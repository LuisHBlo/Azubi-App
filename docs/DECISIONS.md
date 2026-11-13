# Entscheidungen

Format: Datum – Entscheidung – Grund. Nicht stillschweigend ändern, neue Entscheidung ergänzen und alte als überholt markieren.

## Stand 2026-10-31 (Bauphase)
- **Ziel:** bis 31.01.2027 nur bauen, kein Verkauf. Erst Website mit Login, später App.
- **Hosting:** Hostinger-VPS (KVM), Docker, Postgres, eigener Login. Kein Supabase. EU-Rechenzentrum (DE/FR/LT), Standort vor Buchung wählen.
- **Zahler:** Betriebe (Rechnung). Pilot 3 Monate kostenlos, danach Abrechnung. Später optionale Azubi-Erweiterungen.
- **Beruf:** Start nur SHK, Datenmodell mehrberufsfähig.
- **Rollen:** Azubi, Ausbilder, Betriebsadmin. Datenmodell offen für Innung und Berufsschule.
- **Features v1:** Dashboard, Kalender, Prüfungen/Noten, Spaced Repetition (FSRS), Berichtsheft mit PDF und Ausbilder-Freigabe, KI-Assistent nur aus geprüftem Material, Ausbilder-Ansicht inkl. Noten.
- **Second Brain für Azubis:** ja, privat (Betrieb sieht es nicht). Kein Obsidian-Klon: Notizen, Tags, Verlinkung, Karte aus Notiz.
- **Gamification:** nüchtern. Streak, Fortschritt, anonymes Ranking (Opt-in, Pseudonym, innerhalb Betrieb/Jahrgang).
- **Design:** professionell, seriös, futuristisch-klar.
- **KI/Datenschutz:** Anthropic-API direkt hat keine EU-Datenresidenz. EU-Variante über AWS Bedrock Frankfurt oder Google Vertex EU. Modellwahl bleibt frei.
- **Recht:** Datenschutzerklärung und AGB vor erstem echten Nutzer. Gewerbeanmeldung nach dem 3-Monats-Test.
- **Positionierung:** SHK-Spezialist für ca. 50-Mann-Betriebe, nicht "besseres simpleclub". Preishypothese 25 € statt 45 € pro Azubi und Monat (simpleclub), noch nicht validiert.
- **Abbruchkriterium (Vorschlag, nicht entschieden):** kein verbindlich zahlender Betrieb bis Ende des 3-Monats-Piloten.

## Stand 2026-11-12
- **Zusammenarbeit:** ein gemeinsames Git-Repo, Branch pro Aufgabe, Pull Requests, Module mit Besitzer (siehe STATUS.md). Gemeinsames "Gehirn" liegt in `docs/`, nicht als geteiltes Obsidian-Vault.
- **Netzwerk:** Cousin unterstützt, Innungs-Gastvortrag vor 70-80 Unternehmern möglich (erst pitchen, wenn Demo und Angebot stehen). Er bietet an: Ausbildungsreferent, Berufsschulkontakt, Lehrinhalte, Zugänge zu Fremdapps.
