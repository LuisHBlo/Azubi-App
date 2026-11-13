// Demo-Daten. Nur für lokale Entwicklung/Demo. Passwort für alle: demo1234
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { berichte, betriebe, betriebskarten, db, karten, pruefungen, termine, users } from "../src/db";
import { newCard } from "../src/lib/fsrs";
import { isoWeek } from "../src/lib/util";

const now = new Date().toISOString();
const plus = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
const hash = bcrypt.hashSync("demo1234", 10);

for (const t of [betriebskarten, berichte, karten, pruefungen, termine, users, betriebe]) db.delete(t).run();

const betrieb = randomUUID();
db.insert(betriebe).values({ id: betrieb, name: "Demo SHK GmbH", createdAt: now }).run();
const mk = (name: string, email: string, role: "azubi" | "ausbilder" | "admin", lehrjahr?: number) => {
  const id = randomUUID();
  db.insert(users).values({ id, betriebId: betrieb, email, name, role, passwordHash: hash, lehrjahr: lehrjahr ?? null, createdAt: now }).run();
  return id;
};
mk("Petra Meister", "chef@demo.de", "admin");
mk("Klaus Ausbilder", "ausbilder@demo.de", "ausbilder");
const a1 = mk("Jonas Beispiel", "jonas@demo.de", "azubi", 2);
const a2 = mk("Mia Muster", "mia@demo.de", "azubi", 1);

for (const [id, off] of [[a1, 40], [a2, 90]] as const) {
  db.insert(pruefungen).values({ id: randomUUID(), userId: id, titel: "Zwischenprüfung Teil 1", datum: plus(off), notiz: "Heizung, Trinkwasser" }).run();
  db.insert(termine).values({ id: randomUUID(), userId: id, titel: "Berufsschule Block 3", datum: plus(7), typ: "Berufsschule" }).run();
}
const k = [
  ["Kältekreislauf", "Welche vier Hauptbauteile hat der Kältekreislauf einer Wärmepumpe?", "Verdampfer, Verdichter, Verflüssiger (Kondensator), Expansionsventil."],
  ["Kältekreislauf", "Was passiert im Verdichter?", "Das gasförmige Kältemittel wird verdichtet; Druck und Temperatur steigen."],
  ["Trinkwasser", "Wozu dient ein Systemtrenner?", "Er verhindert das Zurückfließen von Heizungswasser in die Trinkwasserinstallation."],
];
for (const [thema, frage, antwort] of k) { const c = newCard(); db.insert(karten).values({ id: randomUUID(), userId: a1, thema, frage, antwort, fsrs: c.json, due: c.due }).run(); }
db.insert(berichte).values({ id: randomUUID(), userId: a1, woche: isoWeek(), taetigkeiten: "Heizkörper getauscht, Druckprobe an Steigleitung begleitet.", status: "eingereicht", createdAt: now }).run();
console.log("Seed ok. Logins: chef@demo.de, ausbilder@demo.de, jonas@demo.de, mia@demo.de – Passwort demo1234");
