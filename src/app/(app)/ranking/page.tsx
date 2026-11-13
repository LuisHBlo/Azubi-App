import { requireUser } from "@/lib/auth";

export default async function Ranking() {
  await requireUser();
  return (
    <div className="max-w-3xl">
      <h1 className="h1">Fortschritt & Ranking</h1>
      <p className="sub">Streak, Fortschritt und ein anonymes Ranking (nur wenn du mitmachst).</p>
      <div className="card text-sm" style={{ color: "var(--muted)" }}>In Entwicklung.</div>
    </div>
  );
}
