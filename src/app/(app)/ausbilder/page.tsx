import { and, count, eq, lte, asc, gte, desc } from "drizzle-orm";
import { berichte, db, karten, pruefungen, users } from "@/db";
import { requireRole } from "@/lib/auth";
import { heute, tageBis } from "@/lib/util";
import { entscheideBericht } from "../actions";

export default async function Ausbilder() {
  const u = await requireRole("ausbilder", "admin");
  const azubis = db.select().from(users).where(and(eq(users.betriebId, u.betriebId), eq(users.role, "azubi"))).orderBy(asc(users.name)).all();
  const jetzt = new Date().toISOString();
  const zeilen = azubis.map((a) => ({
    a,
    faellig: db.select({ n: count() }).from(karten).where(and(eq(karten.userId, a.id), lte(karten.due, jetzt))).get()?.n ?? 0,
    gesamt: db.select({ n: count() }).from(karten).where(eq(karten.userId, a.id)).get()?.n ?? 0,
    pruefung: db.select().from(pruefungen).where(and(eq(pruefungen.userId, a.id), gte(pruefungen.datum, heute()))).orderBy(asc(pruefungen.datum)).get(),
    noten: db.select().from(pruefungen).where(eq(pruefungen.userId, a.id)).all().filter((p) => p.note).map((p) => p.note),
    offen: db.select().from(berichte).where(and(eq(berichte.userId, a.id), eq(berichte.status, "eingereicht"))).orderBy(desc(berichte.woche)).all(),
  }));
  return (
    <div className="max-w-5xl">
      <h1 className="h1">Azubi-Übersicht</h1>
      <p className="sub">Lernstand, Prüfungen, Noten und offene Berichtshefte deines Betriebs.</p>
      <div className="space-y-4">
        {zeilen.map(({ a, faellig, gesamt, pruefung, noten, offen }) => (
          <div key={a.id} className="card">
            <div className="flex items-baseline justify-between"><b className="font-medium">{a.name}</b><span className="text-sm" style={{ color: "var(--muted)" }}>{a.lehrjahr}. Lehrjahr · {a.beruf} · <a className="underline" href={`/api/berichtsheft/pdf?user=${a.id}`}>Berichtsheft (PDF)</a></span></div>
            <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
              <div><div className="label">Karten</div>{gesamt - faellig}/{gesamt} aktuell</div>
              <div><div className="label">Nächste Prüfung</div>{pruefung ? `${pruefung.titel} · ${tageBis(pruefung.datum)} T` : "–"}</div>
              <div><div className="label">Noten</div>{noten.length ? noten.join(", ") : "–"}</div>
              <div><div className="label">Offene Berichte</div>{offen.length}</div>
            </div>
            {offen.map((b) => (
              <form key={b.id} action={entscheideBericht} className="mt-4 rounded-lg bg-slate-50 p-3">
                <input type="hidden" name="id" value={b.id} />
                <div className="mb-1 text-sm font-medium">Woche {b.woche}</div>
                <p className="mb-2 whitespace-pre-wrap text-sm">{b.taetigkeiten || "(leer)"}</p>
                <input name="feedback" placeholder="Rückmeldung (optional)" className="input mb-2" />
                <div className="flex gap-2">
                  <button name="entscheidung" value="freigeben" className="btn">Freigeben</button>
                  <button name="entscheidung" value="zurueck" className="btn-ghost">Zurück an Azubi</button>
                </div>
              </form>
            ))}
          </div>
        ))}
        {!zeilen.length && <p className="text-sm" style={{ color: "var(--muted)" }}>Keine Azubis im Betrieb.</p>}
      </div>
    </div>
  );
}
