import { and, asc, count, eq, lte } from "drizzle-orm";
import { db, karten } from "@/db";
import { requireUser } from "@/lib/auth";
import { addKarte } from "../actions";
import Review from "./Review";

export default async function Lernkarten() {
  const u = await requireUser();
  const jetzt = new Date().toISOString();
  const aktuell = db.select().from(karten).where(and(eq(karten.userId, u.id), lte(karten.due, jetzt))).orderBy(asc(karten.due)).get();
  const faellig = db.select({ n: count() }).from(karten).where(and(eq(karten.userId, u.id), lte(karten.due, jetzt))).get()?.n ?? 0;
  const gesamt = db.select({ n: count() }).from(karten).where(eq(karten.userId, u.id)).get()?.n ?? 0;
  return (
    <div className="max-w-2xl">
      <h1 className="h1">Lernkarten</h1>
      <p className="sub">Wiederholung nach dem FSRS-Algorithmus: Du siehst Karten genau dann, wenn du sie fast vergessen hättest.</p>
      {aktuell ? <Review id={aktuell.id} thema={aktuell.thema} frage={aktuell.frage} antwort={aktuell.antwort} offen={faellig} />
        : <div className="card mb-8 text-sm" style={{ color: "var(--muted)" }}>{gesamt ? "Für heute alles gelernt." : "Lege deine erste Karte an."}</div>}
      <h2 className="mb-2 text-sm font-semibold">Neue Karte</h2>
      <form action={addKarte} className="card grid gap-3">
        <div><label className="label">Thema</label><input name="thema" placeholder="z. B. Kältekreislauf" className="input" /></div>
        <div><label className="label">Frage</label><input name="frage" required className="input" /></div>
        <div><label className="label">Antwort</label><textarea name="antwort" required rows={3} className="input" /></div>
        <button className="btn w-40">Speichern</button>
      </form>
    </div>
  );
}
