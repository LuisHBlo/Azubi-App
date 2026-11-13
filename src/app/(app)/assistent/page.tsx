"use client";
import { useState } from "react";
import type { Nachricht } from "@/lib/types";

export default function Assistent() {
  const [msgs, setMsgs] = useState<Nachricht[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const senden = async () => {
    if (!input.trim() || busy) return;
    const next = [...msgs, { role: "user", content: input } as Nachricht];
    setMsgs(next); setInput(""); setBusy(true);
    const r = await fetch("/api/assistent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
    const j = await r.json();
    setMsgs([...next, { role: "assistant", content: j.text ?? j.error }]);
    setBusy(false);
  };
  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-2xl flex-col">
      <h1 className="h1">KI-Assistent</h1><p className="sub mb-4">Dein Lernbegleiter. Später antwortet er nur aus geprüftem Material.</p>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {msgs.map((m, i) => (
          <div key={i} className={`whitespace-pre-wrap rounded-lg p-3 text-sm ${m.role === "user" ? "ml-12 bg-orange-100" : "mr-12 bg-white shadow-sm"}`}>{m.content}</div>
        ))}
        {!msgs.length && <p className="text-slate-400">Frag mich z. B. „Erkläre mir den Kältekreislauf einer Wärmepumpe“.</p>}
        {busy && <p className="text-slate-400">denkt nach…</p>}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); senden(); }}>
        <input className="flex-1 rounded border p-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Deine Frage…" />
        <button className="rounded bg-orange-500 px-4 text-white">Senden</button>
      </form>
    </div>
  );
}
