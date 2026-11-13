import { requireUser } from "@/lib/auth";

export default async function Notizen() {
  await requireUser();
  return (
    <div className="max-w-3xl">
      <h1 className="h1">Second Brain</h1>
      <p className="sub">Dein privates Wissensnetz. Dein Betrieb sieht hier nichts.</p>
      <div className="card text-sm" style={{ color: "var(--muted)" }}>In Entwicklung: Notizen, Tags, Verknüpfungen und Lernkarten aus Notizen.</div>
    </div>
  );
}
