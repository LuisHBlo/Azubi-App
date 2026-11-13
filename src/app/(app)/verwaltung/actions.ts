"use server";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { betriebskarten, db, karten, users } from "@/db";
import { requireRole } from "@/lib/auth";
import { newCard } from "@/lib/fsrs";
import { zufallsPasswort } from "@/lib/passwort";
import { uid } from "@/lib/util";

type Res = { error?: string; email?: string; passwort?: string } | undefined;
const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function createUser(_: Res, fd: FormData): Promise<Res> {
  const me = await requireRole("ausbilder", "admin");
  const role = s(fd, "role") as "azubi" | "ausbilder" | "admin";
  // Ausbilder dürfen nur Azubis anlegen; Ausbilder/Admins nur der Betriebsadmin.
  if (!["azubi", "ausbilder", "admin"].includes(role) || (role !== "azubi" && me.role !== "admin")) return { error: "Diese Rolle darfst du nicht anlegen." };
  const email = s(fd, "email").toLowerCase();
  const name = s(fd, "name");
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) return { error: "Name und gültige E-Mail angeben." };
  if (db.select().from(users).where(eq(users.email, email)).get()) return { error: "Diese E-Mail ist schon vergeben." };
  const pw = zufallsPasswort();
  const id = uid();
  const lj = Number(s(fd, "lehrjahr"));
  db.insert(users).values({
    id, betriebId: me.betriebId, email, name, role, passwordHash: await bcrypt.hash(pw, 10),
    lehrjahr: role === "azubi" && lj >= 1 && lj <= 4 ? lj : null, createdAt: new Date().toISOString(),
  }).run();
  if (role === "azubi") verteileAn(id, me.betriebId);
  revalidatePath("/verwaltung");
  return { email, passwort: pw };
}

export async function resetPasswort(_: Res, fd: FormData): Promise<Res> {
  const me = await requireRole("ausbilder", "admin");
  const u = db.select().from(users).where(and(eq(users.id, s(fd, "id")), eq(users.betriebId, me.betriebId))).get();
  if (!u) return { error: "Nutzer nicht gefunden." };
  if (u.role !== "azubi" && me.role !== "admin") return { error: "Keine Berechtigung." };
  const pw = zufallsPasswort();
  db.update(users).set({ passwordHash: await bcrypt.hash(pw, 10) }).where(eq(users.id, u.id)).run();
  return { email: u.email, passwort: pw };
}

// Kopiert alle Master-Karten des Betriebs zu einem Azubi
function verteileAn(userId: string, betriebId: string) {
  const c = newCard();
  for (const m of db.select().from(betriebskarten).where(eq(betriebskarten.betriebId, betriebId)).all())
    db.insert(karten).values({ id: uid(), userId, thema: m.thema, frage: m.frage, antwort: m.antwort, fsrs: c.json, due: c.due }).run();
}

// Zeilenformat: Thema;Frage;Antwort
export async function addBetriebskarten(fd: FormData) {
  const me = await requireRole("ausbilder", "admin");
  const neu = s(fd, "zeilen").split("\n").map((l) => l.split(";").map((x) => x.trim())).filter((p) => p.length >= 3 && p[1] && p[2])
    .map(([thema, frage, ...rest]) => ({ thema: thema || "Allgemein", frage, antwort: rest.join(";") }));
  if (!neu.length) return;
  const azubis = db.select().from(users).where(and(eq(users.betriebId, me.betriebId), eq(users.role, "azubi"))).all();
  const c = newCard();
  for (const k of neu) {
    db.insert(betriebskarten).values({ id: uid(), betriebId: me.betriebId, ...k }).run();
    for (const a of azubis) db.insert(karten).values({ id: uid(), userId: a.id, ...k, fsrs: c.json, due: c.due }).run();
  }
  revalidatePath("/", "layout");
}
export async function delBetriebskarte(fd: FormData) {
  const me = await requireRole("ausbilder", "admin");
  db.delete(betriebskarten).where(and(eq(betriebskarten.id, s(fd, "id")), eq(betriebskarten.betriebId, me.betriebId))).run();
  revalidatePath("/ausbilder/karten");
}
