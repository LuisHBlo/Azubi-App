# Azubi-App (SHK) – Regeln für Claude

Lern- und Ausbildungsplattform für SHK-Betriebe und ihre Azubis. Zwei Entwickler (Luis + Kumpel), jeweils mit eigenem Claude-Abo, arbeiten am selben Repo.

## Zuerst lesen (vor jeder Session)
1. `docs/STATUS.md` – wer arbeitet woran, was ist offen
2. `docs/DECISIONS.md` – getroffene Entscheidungen, NICHT stillschweigend umwerfen
3. Kurz `git log --oneline -15` ansehen

Oder einfach `/sync` ausführen.

## Arbeitsregeln
- Pro Aufgabe ein eigener Branch (`feature/<modul>-<kurzbeschreibung>`), nie direkt auf `main` pushen. Änderungen über Pull Request, der andere schaut drüber.
- Bleib im eigenen Modul (siehe Modul-Tabelle in `docs/STATUS.md`). Änderungen in fremden Modulen oder an `src/db/schema.ts` vorher mit dem anderen abstimmen.
- Schema-Änderungen sind riskant: klein halten, in `docs/DECISIONS.md` vermerken, dem anderen sofort Bescheid geben.
- Keine Secrets, `.env*`, `data/` oder `deploy/` committen (steht in `.gitignore`).
- Next.js 16 weicht von älterem Wissen ab: vor dem Schreiben von Next-Code die Doku in `node_modules/next/dist/docs/` lesen (siehe `AGENTS.md`).
- Sprache: Code und Kommentare auf Englisch, UI-Texte auf Deutsch. Nutzer sind Azubis, also einfache, klare Sprache.
- Kleine, häufige Commits mit verständlicher Nachricht.
- Am Ende jeder Session `/handoff` ausführen.

## Stack
Next.js 16, React 19, Tailwind 4, SQLite via Drizzle (better-sqlite3), ts-fsrs für Spaced Repetition, pdf-lib für Berichtsheft-PDF, eigener Login mit Rollen (azubi/ausbilder/admin). Ziel-Hosting: Hostinger-VPS (Docker, Postgres geplant), EU-Rechenzentrum.

## Datenschutz
- Azubis sind teils minderjährig: nur Daten speichern, die nötig sind.
- Keine echten personenbezogenen Daten in Demo-Daten, Tests oder Commits.
- Second Brain eines Azubis ist privat, der Betrieb sieht es nie.
- KI-Assistent antwortet nur aus geprüftem Material.

## Start lokal
`npm install && npm run seed && npm run dev` (Demo-Logins stehen in `scripts/seed.ts`, nur lokal, vor Deploy entfernen)
