"use client";
import { useState } from "react";
import { bewerteKarte } from "../actions";

export default function Review({ id, thema, frage, antwort, offen }: { id: string; thema: string; frage: string; antwort: string; offen: number }) {
  const [zeige, setZeige] = useState(false);
  const knopf: [string, number, string][] = [["Nochmal", 1, "#dc2626"], ["Schwer", 2, "#d97706"], ["Gut", 3, "#16a34a"], ["Leicht", 4, "#0284c7"]];
  return (
    <div className="card mb-8" key={id}>
      <div className="label">{thema} · {offen} fällig</div>
      <div className="mb-4 text-xl font-semibold">{frage}</div>
      {zeige ? (
        <>
          <div className="mb-4 rounded-lg bg-slate-50 p-3 text-sm">{antwort}</div>
          <form action={(fd) => { setZeige(false); return bewerteKarte(fd); }} className="flex gap-2">
            <input type="hidden" name="id" value={id} />
            {knopf.map(([l, g, c]) => <button key={l} name="grade" value={g} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: c }}>{l}</button>)}
          </form>
        </>
      ) : <button className="btn" onClick={() => setZeige(true)}>Antwort zeigen</button>}
    </div>
  );
}
