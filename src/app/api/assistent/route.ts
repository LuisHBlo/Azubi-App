const SYSTEM = `Du bist ein geduldiger Lernbegleiter für Auszubildende im deutschen Handwerk (Start: Anlagenmechaniker SHK). Erkläre verständlich, mit Beispielen aus der Praxis, auf Deutsch. Stelle am Ende gern eine kurze Kontrollfrage. Wenn du dir bei einer Fachaussage nicht sicher bist, sag das offen.`;

import { getUser } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await getUser())) return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "Kein ANTHROPIC_API_KEY gesetzt. Lege ihn in .env.local ab." });
  const { messages } = await req.json();
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-5-5", max_tokens: 1024, system: SYSTEM, messages }),
  });
  const j = await r.json();
  if (!r.ok) return Response.json({ error: j.error?.message ?? "API-Fehler" });
  return Response.json({ text: j.content?.[0]?.text ?? "" });
}
