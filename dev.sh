#!/usr/bin/env bash
set -e  # Arrête le script si une commande échoue

# --- Chemin du projet ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Nettoyage des volumes node_modules et containers éventuels..."
# Supprime les containers et volumes liés au projet
docker compose down -v || true

echo "📦 Installation des dépendances dans le conteneur..."
# Installe les dépendances dans le conteneur
docker compose run --rm app npm install

echo "⚡ Démarrage du conteneur en mode dev..."
# Lancer le conteneur en mode développement
docker compose up
