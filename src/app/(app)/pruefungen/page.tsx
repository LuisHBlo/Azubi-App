import { asc, eq } from "drizzle-orm";
import { db, pruefungen } from "@/db";
import { requireUser } from "@/lib/auth";
import { tageBis } from "@/lib/util";
import { addPruefung, delPruefung, setNote } from "../actions";

export default async function Pruefungen() {
  const u = await requireUser();
  const liste = db.select().from(pruefungen).where(eq(pruefungen.userId, u.id)).orderBy(asc(pruefungen.datum)).all();
  return (
    <div className="max-w-3xl">
      <h1 className="h1">Prüfungen & Noten</h1>
      <p className="sub">Termine eintragen, Fristen im Blick, Ergebnisse festhalten.</p>
      <form action={addPruefung} className="card mb-6 grid grid-cols-[1fr_auto] gap-3">
        <div><label className="label">Prüfung / Klassenarbeit</label><input name="titel" required className="input" /></div>
        <div><label className="label">Datum</label><input name="datum" type="date" required className="input" /></div>
        <div><label className="label">Themen / Notiz</label><input name="notiz" className="input" /></div>
        <div className="flex items-end"><button className="btn">Eintragen</button></div>
      </form>
      <div className="space-y-3">
        {liste.map((p) => (
          <div key={p.id} className="card">
            <div className="flex justify-between"><b className="font-medium">{p.titel}</b>
              <span className="text-sm" style={{ color: "var(--muted)" }}>{p.datum} · {tageBis(p.datum) >= 0 ? `noch ${tageBis(p.datum)} Tage` : "vorbei"}</span></div>
            {p.notiz && <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{p.notiz}</div>}
            <div className="mt-3 flex items-center gap-3">
              <form action={setNote} className="flex items-center gap-2"><input type="hidden" name="id" value={p.id} />
                <label className="label mb-0">Note</label><input name="note" defaultValue={p.note ?? ""} className="input w-20" /><button className="btn-ghost">Speichern</button></form>
              <form action={delPruefung} className="ml-auto"><input type="hidden" name="id" value={p.id} /><button className="text-xs text-slate-400 hover:text-red-600">Löschen</button></form>
            </div>
          </div>
        ))}
        {!liste.length && <p className="text-sm" style={{ color: "var(--muted)" }}>Noch keine Prüfungen.</p>}
      </div>
    </div>
  );
}
