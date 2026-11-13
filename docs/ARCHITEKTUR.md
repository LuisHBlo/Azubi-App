# Architektur (Kurzfassung)

```
src/
├── app/
│   ├── (auth)/login          Login
│   ├── (app)/                Geschützter Bereich
│   │   ├── kalender, pruefungen, lernkarten, berichtsheft
│   │   ├── ausbilder         Ausbilder-Ansicht
│   │   ├── verwaltung        Nutzerverwaltung
│   │   └── assistent         KI-Assistent
│   └── api/                  assistent, berichtsheft
├── components/Shell.tsx      Layout
├── db/                       schema.ts, init.ts, index.ts (Drizzle + SQLite)
└── lib/                      auth, fsrs, passwort, types, util
scripts/                      seed, create-admin, deploy-zip
```

Rollen: azubi, ausbilder, admin. Auth über Session-Cookie.
Offene Architekturfrage: SQLite (jetzt) vs. Postgres (geplant auf VPS), Migration vor dem Pilot klären.
