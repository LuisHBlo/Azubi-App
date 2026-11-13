import { desc, eq } from "drizzle-orm";
import { berichte, db } from "@/db";
import { requireUser } from "@/lib/auth";
import { isoWeek } from "@/lib/util";
import { reichBerichtEin, saveBericht } from "../actions";

const statusText = { entwurf: "Entwurf", eingereicht: "Eingereicht", freigegeben: "Freigegeben", zurueck: "Zur Überarbeitung" } as const;

export default async function Berichtsheft() {
  const u = await requireUser();
  const liste = db.select().from(berichte).where(eq(berichte.userId, u.id)).orderBy(desc(berichte.woche)).all();
  const felder: [string, string][] = [["taetigkeiten", "Betriebliche Tätigkeiten"], ["unterweisung", "Unterweisungen / Lehrgespräche"], ["berufsschule", "Berufsschule (Themen)"]];
  return (
    <div className="max-w-3xl">
      <h1 className="h1">Berichtsheft</h1>
      <p className="sub">Wöchentlich schreiben, einreichen, vom Ausbilder freigeben lassen. <a href="/api/berichtsheft/pdf" className="underline" style={{ color: "var(--accent-ink)" }}>Als PDF herunterladen</a></p>
      <form action={saveBericht} className="card mb-8 grid gap-3">
        <div><label className="label">Kalenderwoche</label><input name="woche" type="week" defaultValue={isoWeek()} required className="input w-52" /></div>
        {felder.map(([k, l]) => <div key={k}><label className="label">{l}</label><textarea name={k} rows={4} className="input" /></div>)}
        <p className="text-xs" style={{ color: "var(--muted)" }}>Speichern einer bereits vorhandenen Woche überschreibt den Entwurf.</p>
        <button className="btn w-40">Speichern</button>
      </form>
      <div className="space-y-3">
        {liste.map((b) => (
          <div key={b.id} className="card">
            <div className="flex items-center justify-between"><b className="font-medium">Woche {b.woche}</b><span className="badge">{statusText[b.status]}</span></div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{b.taetigkeiten}</p>
            {b.feedback && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-sm">Ausbilder: {b.feedback}</p>}
            {(b.status === "entwurf" || b.status === "zurueck") && (
              <form action={reichBerichtEin} className="mt-3"><input type="hidden" name="id" value={b.id} /><button className="btn-ghost">Beim Ausbilder einreichen</button></form>
            )}
          </div>
        ))}
        {!liste.length && <p className="text-sm" style={{ color: "var(--muted)" }}>Noch keine Berichte.</p>}
      </div>
    </div>
  );
}
