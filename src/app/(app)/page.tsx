import { and, asc, count, eq, gte, lte } from "drizzle-orm";
import Link from "next/link";
import { berichte, db, karten, pruefungen, termine } from "@/db";
import { requireUser } from "@/lib/auth";
import { heute, isoWeek, tageBis } from "@/lib/util";
import { redirect } from "next/navigation";

const statusText = { entwurf: "Entwurf", eingereicht: "Eingereicht", freigegeben: "Freigegeben", zurueck: "Überarbeiten" } as const;

export default async function Dashboard() {
  const u = await requireUser();
  if (u.role !== "azubi") redirect("/ausbilder");
  const jetzt = new Date().toISOString();
  const faellig = db.select({ n: count() }).from(karten).where(and(eq(karten.userId, u.id), lte(karten.due, jetzt))).get()?.n ?? 0;
  const gesamt = db.select({ n: count() }).from(karten).where(eq(karten.userId, u.id)).get()?.n ?? 0;
  const naechste = db.select().from(pruefungen).where(and(eq(pruefungen.userId, u.id), gte(pruefungen.datum, heute()))).orderBy(asc(pruefungen.datum)).limit(3).all();
  const bevor = db.select().from(termine).where(and(eq(termine.userId, u.id), gte(termine.datum, heute()))).orderBy(asc(termine.datum)).limit(5).all();
  const woche = isoWeek();
  const bericht = db.select().from(berichte).where(and(eq(berichte.userId, u.id), eq(berichte.woche, woche))).get();
  const rueck = db.select({ n: count() }).from(berichte).where(and(eq(berichte.userId, u.id), eq(berichte.status, "zurueck"))).get()?.n ?? 0;
  const lernstand = gesamt ? Math.round(((gesamt - faellig) / gesamt) * 100) : 0;

  return (
    <div className="max-w-5xl">
      <h1 className="h1">Hallo {u.name.split(" ")[0]}</h1>
      <p className="sub">{u.beruf}{u.lehrjahr ? ` · ${u.lehrjahr}. Lehrjahr` : ""} · Das steht an.</p>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="card">
          <div className="label">Nächste Prüfung</div>
          {naechste[0] ? (<><div className="text-3xl font-semibold">{tageBis(naechste[0].datum)} <span className="text-base font-normal" style={{ color: "var(--muted)" }}>Tage</span></div>
            <div className="mt-1 text-sm">{naechste[0].titel}</div></>) : <div className="text-sm" style={{ color: "var(--muted)" }}>Keine eingetragen. <Link className="underline" href="/pruefungen">Eintragen</Link></div>}
        </div>
        <div className="card">
          <div className="label">Lernkarten heute</div>
          <div className="text-3xl font-semibold">{faellig}</div>
          <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>fällig · {gesamt} gesamt</div>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full" style={{ width: `${lernstand}%`, background: "var(--accent)" }} /></div>
          {faellig > 0 && <Link href="/lernkarten" className="mt-3 inline-block text-sm font-medium" style={{ color: "var(--accent-ink)" }}>Jetzt lernen →</Link>}
        </div>
        <div className="card">
          <div className="label">Berichtsheft {woche}</div>
          <div className="text-xl font-semibold">{bericht ? statusText[bericht.status] : "Noch offen"}</div>
          {rueck > 0 && <div className="mt-1 text-sm text-red-600">{rueck} zur Überarbeitung zurück</div>}
          <Link href="/berichtsheft" className="mt-3 inline-block text-sm font-medium" style={{ color: "var(--accent-ink)" }}>{bericht ? "Öffnen" : "Jetzt schreiben"} →</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="label">Prüfungsfristen</div>
          {naechste.length ? naechste.map((p) => (
            <div key={p.id} className="flex justify-between border-b py-2 text-sm last:border-0" style={{ borderColor: "var(--line)" }}>
              <span>{p.titel}</span><span style={{ color: "var(--muted)" }}>{p.datum} · {tageBis(p.datum)} T</span>
            </div>)) : <p className="text-sm" style={{ color: "var(--muted)" }}>Nichts eingetragen.</p>}
        </div>
        <div className="card">
          <div className="label">Kommende Termine</div>
          {bevor.length ? bevor.map((t) => (
            <div key={t.id} className="flex justify-between border-b py-2 text-sm last:border-0" style={{ borderColor: "var(--line)" }}>
              <span>{t.titel} <span className="badge ml-1">{t.typ}</span></span><span style={{ color: "var(--muted)" }}>{t.datum}</span>
            </div>)) : <p className="text-sm" style={{ color: "var(--muted)" }}>Keine Termine.</p>}
        </div>
      </div>
    </div>
  );
}
