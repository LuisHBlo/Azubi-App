// Legt Betrieb + ersten Betriebsadmin an (für den echten Start, ohne Demo-Daten).
// Aufruf: npx tsx scripts/create-admin.ts "Betriebsname" "Vor Nachname" mail@betrieb.de
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { betriebe, db, users } from "../src/db";
import { zufallsPasswort } from "../src/lib/passwort";

const [betrieb, name, email] = process.argv.slice(2);
if (!betrieb || !name || !email) { console.error('Aufruf: npx tsx scripts/create-admin.ts "Betriebsname" "Name" mail@x.de'); process.exit(1); }
const bid = randomUUID(), pw = zufallsPasswort(12), now = new Date().toISOString();
db.insert(betriebe).values({ id: bid, name: betrieb, createdAt: now }).run();
db.insert(users).values({ id: randomUUID(), betriebId: bid, email: email.toLowerCase(), name, role: "admin", passwordHash: bcrypt.hashSync(pw, 10), createdAt: now }).run();
console.log(`Betrieb "${betrieb}" angelegt.\nLogin: ${email}\nPasswort: ${pw}\n(Bitte notieren – wird nicht erneut angezeigt.)`);
