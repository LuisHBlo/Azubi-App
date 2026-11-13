#!/bin/sh
# Erzeugt ein Quell-Paket für Hostinger (Node.js-App). Hostinger installiert und baut selbst.
set -e
cd "$(dirname "$0")/.."
mkdir -p deploy
OUT="deploy/azubi-app-$(date +%Y%m%d-%H%M).zip"
zip -rq "$OUT" . -x "node_modules/*" ".next/*" "data/*" ".env*" ".git/*" "deploy/*" "*.db" "*.db-*" ".DS_Store"
echo "Paket: $OUT"
echo "Hinweis: scripts/seed.ts (Demo-Nutzer) NICHT auf dem Server ausführen."
