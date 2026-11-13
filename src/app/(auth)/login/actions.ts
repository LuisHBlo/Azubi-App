"use server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db, users } from "@/db";
import { createSession, destroySession } from "@/lib/auth";

// Einfacher Schutz gegen Passwort-Raten (im Speicher, pro Server-Prozess).
const fails = new Map<string, { n: number; until: number }>();

export async function login(_: { error?: string } | undefined, fd: FormData) {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const pw = String(fd.get("password") ?? "");
  const f = fails.get(email);
  if (f && f.n >= 5 && Date.now() < f.until) return { error: "Zu viele Versuche. Bitte in 15 Minuten erneut versuchen." };
  const u = db.select().from(users).where(eq(users.email, email)).get();
  const ok = u ? await bcrypt.compare(pw, u.passwordHash) : (await bcrypt.compare(pw, "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali"), false);
  if (!u || !ok) {
    fails.set(email, { n: (f?.n ?? 0) + 1, until: Date.now() + 15 * 60000 });
    return { error: "E-Mail oder Passwort falsch." };
  }
  fails.delete(email);
  await createSession(u.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
