import { and, eq, gt } from "drizzle-orm";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, sessions, users } from "@/db";

const COOKIE = "session";
const DAYS = 14;
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + DAYS * 86400000);
  db.insert(sessions).values({ tokenHash: hash(token), userId, expiresAt: expires.toISOString() }).run();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const t = jar.get(COOKIE)?.value;
  if (t) db.delete(sessions).where(eq(sessions.tokenHash, hash(t))).run();
  jar.delete(COOKIE);
}

export const getUser = cache(async () => {
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t) return null;
  const row = db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, betriebId: users.betriebId, lehrjahr: users.lehrjahr, beruf: users.beruf })
    .from(sessions).innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, hash(t)), gt(sessions.expiresAt, new Date().toISOString())))
    .get();
  return row ?? null;
});

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export async function requireUser(): Promise<SessionUser> {
  const u = await getUser();
  if (!u) redirect("/login");
  return u;
}

export async function requireRole(...roles: SessionUser["role"][]): Promise<SessionUser> {
  const u = await requireUser();
  if (!roles.includes(u.role)) redirect("/");
  return u;
}
