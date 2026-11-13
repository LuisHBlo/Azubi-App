import { eq } from "drizzle-orm";
import { betriebskarten, db } from "@/db";
import { requireRole } from "@/lib/auth";
import { addBetriebskarten, delBetriebskarte } from "../../verwaltung/actions";

export default async function Betriebskarten() {
  const me = await requireRole("ausbilder", "admin");
  const liste = db.select().from(betriebskarten).where(eq(betriebskarten.betriebId, me.betriebId)).all();
  return (
    <div className="max-w-3xl">
      <h1 className="h1">Betriebskarten</h1>
      <p className="sub">Eigene Lernkarten für alle Azubis deines Betriebs: Anlagen, Checklisten, Betriebsabläufe. Sie landen sofort bei jedem Azubi im Lernplan.</p>
      <form action={addBetriebskarten} className="card mb-6 grid gap-3">
        <div><label className="label">Karten (eine pro Zeile: Thema;Frage;Antwort)</label>
          <textarea name="zeilen" rows={6} required className="input font-mono" placeholder={"Heizung;Wofür ist das Ausdehnungsgefäß da?;Es nimmt die Volumenzunahme des Heizwassers bei Erwärmung auf."} /></div>
        <button className="btn w-52">An alle Azubis verteilen</button>
      </form>
      <div className="card">
        <div className="label">{liste.length} Betriebskarten</div>
        {liste.map((k) => (
          <form key={k.id} action={delBetriebskarte} className="flex items-start justify-between border-b py-2.5 text-sm last:border-0" style={{ borderColor: "var(--line)" }}>
            <input type="hidden" name="id" value={k.id} />
            <div><span className="badge mr-2">{k.thema}</span>{k.frage}</div>
            <button className="text-xs text-slate-400 hover:text-red-600" title="Entfernt nur die Vorlage, nicht die bereits verteilten Karten">Entfernen</button>
          </form>
        ))}
        {!liste.length && <p className="text-sm" style={{ color: "var(--muted)" }}>Noch keine Betriebskarten.</p>}
      </div>
    </div>
  );
}
