import { and, asc, eq } from "drizzle-orm";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { berichte, betriebe, db, users } from "@/db";
import { getUser } from "@/lib/auth";

const M = 50, W = 595, H = 842, TXT = W - 2 * M;

// ISO-Woche "2026-W44" -> Montag bis Sonntag
function wochenbereich(w: string) {
  const [y, n] = w.split("-W").map(Number);
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const mo = new Date(jan4.getTime() + ((n - 1) * 7 - ((jan4.getUTCDay() || 7) - 1)) * 86400000);
  const so = new Date(mo.getTime() + 6 * 86400000);
  const f = (d: Date) => d.toLocaleDateString("de-DE", { timeZone: "UTC" });
  return `${f(mo)} – ${f(so)}`;
}

export async function GET(req: Request) {
  const me = await getUser();
  if (!me) return new Response("Nicht angemeldet", { status: 401 });
  const wunsch = new URL(req.url).searchParams.get("user");
  let azubi = me;
  if (wunsch && wunsch !== me.id) {
    const u = db.select().from(users).where(eq(users.id, wunsch)).get();
    if (me.role === "azubi" || !u || u.betriebId !== me.betriebId) return new Response("Keine Berechtigung", { status: 403 });
    azubi = { ...me, id: u.id, name: u.name, beruf: u.beruf, lehrjahr: u.lehrjahr };
  }
  const betrieb = db.select().from(betriebe).where(eq(betriebe.id, me.betriebId)).get()?.name ?? "";
  const liste = db.select().from(berichte).where(and(eq(berichte.userId, azubi.id))).orderBy(asc(berichte.woche)).all();

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ok = new Set(font.getCharacterSet());
  const clean = (t: string) => Array.from(t.replace(/\t/g, " ")).map((c) => (c === "\n" || ok.has(c.codePointAt(0)!) ? c : "?")).join("");

  let page: PDFPage = pdf.addPage([W, H]);
  let y = H - M;
  const neu = () => { page = pdf.addPage([W, H]); y = H - M; };
  const zeile = (t: string, f: PDFFont, size: number, color = rgb(0.05, 0.07, 0.12)) => {
    if (y < M + 20) neu();
    page.drawText(t, { x: M, y, size, font: f, color }); y -= size + 4;
  };
  const absatz = (text: string, size = 10) => {
    for (const roh of clean(text || "–").split("\n")) {
      let cur = "";
      for (const wort of roh.split(" ")) {
        const test = cur ? `${cur} ${wort}` : wort;
        if (font.widthOfTextAtSize(test, size) > TXT && cur) { zeile(cur, font, size); cur = wort; } else cur = test;
      }
      zeile(cur, font, size);
    }
  };

  zeile("Ausbildungsnachweis (Berichtsheft)", bold, 18); y -= 4;
  zeile(clean(`${azubi.name} · ${azubi.beruf}${azubi.lehrjahr ? ` · ${azubi.lehrjahr}. Lehrjahr` : ""}`), font, 11);
  zeile(clean(`Ausbildungsbetrieb: ${betrieb}`), font, 11);
  y -= 10;

  if (!liste.length) zeile("Keine Berichte vorhanden.", font, 11);
  const status = { entwurf: "Entwurf", eingereicht: "Eingereicht", freigegeben: "Vom Ausbilder freigegeben", zurueck: "Zur Überarbeitung" } as const;
  for (const b of liste) {
    if (y < 260) neu();
    zeile(clean(`Kalenderwoche ${b.woche.split("-W")[1]}/${b.woche.split("-W")[0]}  (${wochenbereich(b.woche)})`), bold, 12);
    zeile(clean(`Status: ${status[b.status]}`), font, 9, rgb(0.35, 0.4, 0.47));
    for (const [titel, text] of [["Betriebliche Tätigkeiten", b.taetigkeiten], ["Unterweisungen / Lehrgespräche", b.unterweisung], ["Berufsschule", b.berufsschule]] as const) {
      zeile(clean(titel), bold, 10); absatz(text); y -= 2;
    }
    if (y < 80) neu();
    y -= 16;
    page.drawLine({ start: { x: M, y }, end: { x: M + 200, y }, thickness: 0.5 });
    page.drawLine({ start: { x: W - M - 200, y }, end: { x: W - M, y }, thickness: 0.5 });
    page.drawText("Datum, Unterschrift Auszubildende/r", { x: M, y: y - 11, size: 8, font });
    page.drawText("Datum, Unterschrift Ausbilder/in", { x: W - M - 200, y: y - 11, size: 8, font });
    y -= 40;
  }
  return new Response(Buffer.from(await pdf.save()), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="Berichtsheft-${azubi.name.replace(/[^A-Za-z0-9]+/g, "_")}.pdf"` },
  });
}
