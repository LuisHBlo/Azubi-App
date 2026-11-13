# Status (zuletzt aktualisiert: 2026-11-12)

> Wird bei jedem `/handoff` aktualisiert. Neueste Einträge oben im Abschnitt "Verlauf".

## Ziel
Bis 31.01.2027 bauen (Web, Login), dann Pilot (3 Monate kostenlos) mit dem Betrieb von Luis' Cousin. Danach Abrechnung. App-Store-Version später.

## Module und Besitzer
| Modul | Pfad | Besitzer | Stand |
|---|---|---|---|
| Auth, Rollen, Nutzerverwaltung | `src/lib/auth.ts`, `src/app/(auth)`, `src/app/(app)/verwaltung` | Luis | fertig (v1) |
| Datenbank/Schema | `src/db/` | **gemeinsam, Absprache nötig** | läuft |
| Dashboard, Kalender, Prüfungen/Noten | `src/app/(app)/kalender`, `.../pruefungen` | _offen_ | fertig (v1) |
| Spaced Repetition (FSRS), Lernkarten | `src/lib/fsrs.ts`, `src/app/(app)/lernkarten` | _offen_ | fertig (v1) |
| Berichtsheft + PDF | `src/app/(app)/berichtsheft`, `src/app/api/berichtsheft` | _offen_ | v1, PDF ohne offizielles Kammerformat |
| Ausbilder-Ansicht | `src/app/(app)/ausbilder` | _offen_ | fertig (v1) |
| KI-Assistent | `src/app/(app)/assistent`, `src/app/api/assistent` | _offen_ | Route da, "nur aus geprüftem Material" fehlt |
| Second Brain (Notizen) | `src/app/(app)/notizen` | _offen_ | Platzhalter-Seite + Nav, Funktion offen |
| Ranking (Opt-in, anonym) | `src/app/(app)/ranking` | _offen_ | Platzhalter-Seite + Nav, Funktion offen |
| SHK-Lerninhalte (Karten, Aufgaben) | `content/` (Format: content/README.md) | _offen_ (Fachpartner Cousin/Meister) | offen |
| Deploy (Hostinger) | `deploy/`, `scripts/deploy-zip.sh` | _offen_ | Test offen |

## Offene Aufgaben (priorisiert)
1. Repo auf GitHub, Kumpel einladen, Module verteilen
2. Deploy-Test auf Hostinger (better-sqlite3 als natives Modul unklar) und Entscheidung SQLite vs. Postgres
3. Echte SHK-Inhalte (mit Fachpartner des Cousins)
4. Second Brain für Azubis
5. KI nur aus geprüftem Material
6. Datenschutzerklärung, AGB vor dem ersten echten Nutzer
7. Namensentscheidung (vergeben: Gesellenstück.de, Meisterlab.de, Lehrwerk.de, Lernwerk.de, Walzwerk.de, Craftiq.de)

## Verlauf
- 2026-11-13: Modul-Grundgerüst: CLAUDE.md pro Modul, Platzhalter Second Brain + Ranking (mit Navigation), `content/` mit Format-Beispiel.
- 2026-11-12: Git-Gerüst, CLAUDE.md, docs/ und `/sync`, `/handoff` angelegt.
