#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🧹 Nettoyage des volumes node_modules et containers éventuels..."
docker compose down -v --remove-orphans || true

echo "📦 Installation des dépendances BACK..."
docker compose run --rm back npm install

echo "📦 Installation des dépendances FRONT..."
docker compose run --rm front npm install

echo "🚀 Lancement de l'environnement DEV..."
docker compose up
