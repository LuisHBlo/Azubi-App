# Lerninhalte (content/)

Reine Daten, kein Code. Hier liegen die SHK-Lerninhalte (Karteikarten, Aufgaben), die ein Fachpartner (Meister/Ausbilder) prüfen kann. Der KI-Assistent und die Lernkarten sollen später nur aus diesem geprüften Material schöpfen.

## Regeln
- Keine Original-Prüfungsfragen kopieren (Urheberrecht). Eigene Formulierung, Quelle: BIBB-Rahmenplan / Ausbildungsordnung.
- Jede Datei hat `geprueft: false`, bis ein Fachpartner sie freigegeben hat (`geprueft: true`, `geprueft_von`, `datum`).
- Nur `geprueft: true` darf in die App oder den KI-Assistenten.
- Struktur: `content/<beruf>/<themenblock>.json`, z. B. `content/shk/waermepumpe.json`.

## Format (Beispiel: `content/shk/_beispiel.json`)
Siehe die Beispieldatei. Felder: `thema`, `lehrjahr`, `geprueft`, `karten[]` (`frage`, `antwort`, `quelle`).
