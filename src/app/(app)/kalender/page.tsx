import { asc, eq } from "drizzle-orm";
import { db, termine } from "@/db";
import { requireUser } from "@/lib/auth";
import { addTermin, delTermin } from "../actions";

export default async function Kalender() {
  const u = await requireUser();
  const liste = db.select().from(termine).where(eq(termine.userId, u.id)).orderBy(asc(termine.datum)).all();
  return (
    <div className="max-w-3xl">
      <h1 className="h1">Kalender</h1>
      <p className="sub">Berufsschule, Betrieb und Lernzeiten an einem Ort.</p>
      <form action={addTermin} className="card mb-6 grid grid-cols-[1fr_auto_auto_auto] items-end gap-3">
        <div><label className="label">Termin</label><input name="titel" required className="input" /></div>
        <div><label className="label">Datum</label><input name="datum" type="date" required className="input" /></div>
        <div><label className="label">Typ</label><select name="typ" className="input">{["Berufsschule", "Betrieb", "Lernen", "Sonstiges"].map((t) => <option key={t}>{t}</option>)}</select></div>
        <button className="btn">Hinzufügen</button>
      </form>
      <div className="card">
        {liste.map((t) => (
          <form key={t.id} action={delTermin} className="flex items-center justify-between border-b py-2.5 text-sm last:border-0" style={{ borderColor: "var(--line)" }}>
            <input type="hidden" name="id" value={t.id} />
            <span><b className="mr-2 font-medium">{t.datum}</b>{t.titel} <span className="badge ml-1">{t.typ}</span></span>
            <button className="text-xs text-slate-400 hover:text-red-600">Löschen</button>
          </form>
        ))}
        {!liste.length && <p className="text-sm" style={{ color: "var(--muted)" }}>Noch keine Termine.</p>}
      </div>
    </div>
  );
}
