"use client";
import { useActionState } from "react";
import { createUser, resetPasswort } from "./actions";

function Ergebnis({ s }: { s?: { error?: string; email?: string; passwort?: string } }) {
  if (!s) return null;
  if (s.error) return <p className="mt-2 text-sm text-red-600">{s.error}</p>;
  return (
    <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm">
      Zugang für <b>{s.email}</b>: Passwort <code className="rounded bg-white px-1.5 py-0.5 font-mono">{s.passwort}</code>
      <div className="mt-1 text-xs text-slate-500">Wird nur jetzt angezeigt. Gib es persönlich weiter.</div>
    </div>
  );
}

export function NutzerForm({ admin }: { admin: boolean }) {
  const [s, action, pending] = useActionState(createUser, undefined);
  return (
    <form action={action} className="card mb-6 grid grid-cols-2 gap-3">
      <div><label className="label">Name</label><input name="name" required className="input" /></div>
      <div><label className="label">E-Mail</label><input name="email" type="email" required className="input" /></div>
      <div><label className="label">Rolle</label>
        <select name="role" className="input"><option value="azubi">Azubi</option>{admin && <><option value="ausbilder">Ausbilder</option><option value="admin">Betriebsadmin</option></>}</select></div>
      <div><label className="label">Lehrjahr (nur Azubi)</label><input name="lehrjahr" type="number" min={1} max={4} className="input" /></div>
      <div className="col-span-2"><button className="btn" disabled={pending}>{pending ? "Lege an…" : "Zugang anlegen"}</button><Ergebnis s={s} /></div>
    </form>
  );
}

export function ResetForm({ id }: { id: string }) {
  const [s, action, pending] = useActionState(resetPasswort, undefined);
  return (
    <form action={action} className="text-right">
      <input type="hidden" name="id" value={id} />
      <button className="btn-ghost" disabled={pending}>Neues Passwort</button>
      <Ergebnis s={s} />
    </form>
  );
}
