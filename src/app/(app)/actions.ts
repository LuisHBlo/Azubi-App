"use server";
import { and, eq } from "drizzle-orm";
import type { Grade } from "ts-fsrs";
import { revalidatePath } from "next/cache";
import { berichte, db, karten, pruefungen, termine, users } from "@/db";
import { requireUser } from "@/lib/auth";
import { newCard, review } from "@/lib/fsrs";
import { uid } from "@/lib/util";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function addTermin(fd: FormData) {
  const u = await requireUser();
  if (!s(fd, "titel") || !s(fd, "datum")) return;
  db.insert(termine).values({ id: uid(), userId: u.id, titel: s(fd, "titel"), datum: s(fd, "datum"), typ: s(fd, "typ") || "Sonstiges" }).run();
  revalidatePath("/", "layout");
}
export async function delTermin(fd: FormData) {
  const u = await requireUser();
  db.delete(termine).where(and(eq(termine.id, s(fd, "id")), eq(termine.userId, u.id))).run();
  revalidatePath("/", "layout");
}

export async function addPruefung(fd: FormData) {
  const u = await requireUser();
  if (!s(fd, "titel") || !s(fd, "datum")) return;
  db.insert(pruefungen).values({ id: uid(), userId: u.id, titel: s(fd, "titel"), datum: s(fd, "datum"), notiz: s(fd, "notiz") }).run();
  revalidatePath("/", "layout");
}
export async function setNote(fd: FormData) {
  const u = await requireUser();
  db.update(pruefungen).set({ note: s(fd, "note") || null }).where(and(eq(pruefungen.id, s(fd, "id")), eq(pruefungen.userId, u.id))).run();
  revalidatePath("/", "layout");
}
export async function delPruefung(fd: FormData) {
  const u = await requireUser();
  db.delete(pruefungen).where(and(eq(pruefungen.id, s(fd, "id")), eq(pruefungen.userId, u.id))).run();
  revalidatePath("/", "layout");
}

export async function addKarte(fd: FormData) {
  const u = await requireUser();
  if (!s(fd, "frage") || !s(fd, "antwort")) return;
  const c = newCard();
  db.insert(karten).values({ id: uid(), userId: u.id, thema: s(fd, "thema") || "Allgemein", frage: s(fd, "frage"), antwort: s(fd, "antwort"), fsrs: c.json, due: c.due }).run();
  revalidatePath("/", "layout");
}
export async function bewerteKarte(fd: FormData) {
  const u = await requireUser();
  const grade = Number(fd.get("grade"));
  if (![1, 2, 3, 4].includes(grade)) return;
  const k = db.select().from(karten).where(and(eq(karten.id, s(fd, "id")), eq(karten.userId, u.id))).get();
  if (!k) return;
  const r = review(k.fsrs, grade as Grade);
  db.update(karten).set({ fsrs: r.json, due: r.due }).where(eq(karten.id, k.id)).run();
  revalidatePath("/", "layout");
}

export async function saveBericht(fd: FormData) {
  const u = await requireUser();
  if (!s(fd, "woche")) return;
  const vals = { taetigkeiten: s(fd, "taetigkeiten"), unterweisung: s(fd, "unterweisung"), berufsschule: s(fd, "berufsschule") };
  const ex = db.select().from(berichte).where(and(eq(berichte.userId, u.id), eq(berichte.woche, s(fd, "woche")))).get();
  if (ex) {
    if (ex.status === "freigegeben") return;
    db.update(berichte).set({ ...vals, status: "entwurf" }).where(eq(berichte.id, ex.id)).run();
  } else {
    db.insert(berichte).values({ id: uid(), userId: u.id, woche: s(fd, "woche"), ...vals, createdAt: new Date().toISOString() }).run();
  }
  revalidatePath("/", "layout");
}
export async function reichBerichtEin(fd: FormData) {
  const u = await requireUser();
  db.update(berichte).set({ status: "eingereicht" }).where(and(eq(berichte.id, s(fd, "id")), eq(berichte.userId, u.id))).run();
  revalidatePath("/", "layout");
}

// Ausbilder: nur Berichte von Azubis des eigenen Betriebs
export async function entscheideBericht(fd: FormData) {
  const u = await requireUser();
  if (u.role === "azubi") return;
  const b = db.select({ id: berichte.id, betrieb: users.betriebId }).from(berichte).innerJoin(users, eq(users.id, berichte.userId)).where(eq(berichte.id, s(fd, "id"))).get();
  if (!b || b.betrieb !== u.betriebId) return;
  const freigeben = s(fd, "entscheidung") === "freigeben";
  db.update(berichte).set({ status: freigeben ? "freigegeben" : "zurueck", feedback: s(fd, "feedback") }).where(eq(berichte.id, b.id)).run();
  revalidatePath("/", "layout");
}
