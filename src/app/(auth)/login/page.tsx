"use client";
import { useActionState } from "react";
import { login } from "./actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "radial-gradient(1200px 600px at 20% 0%, #12304a 0%, #0b1220 60%)" }}>
      <form action={action} className="w-[22rem] rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-1 flex items-center gap-2 text-lg font-semibold"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--accent)" }} />AzubiPro</div>
        <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>Melde dich mit deinem Zugang an.</p>
        <label className="label" htmlFor="email">E-Mail</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="input mb-4" />
        <label className="label" htmlFor="password">Passwort</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input mb-4" />
        {state?.error && <p className="mb-3 text-sm text-red-600">{state.error}</p>}
        <button className="btn w-full" disabled={pending}>{pending ? "Anmelden…" : "Anmelden"}</button>
      </form>
    </div>
  );
}
