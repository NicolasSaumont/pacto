#!/bin/bash
set -e

BACK_CONTAINER="pacto-back-1"  # Nom du container back
DB_CONTAINER="pacto-db-1"

echo "⏳ Attente que Postgres soit prêt..."
until docker exec "$DB_CONTAINER" pg_isready -U pacto_user; do
  echo "⚠️ Postgres non prêt, retry dans 2s..."
  sleep 2
done
echo "✅ Postgres prêt"

echo "🧹 Réinitialisation des tables et relance du seed..."
# Réinitialisation des tables (ex : Sequelize, Prisma ou autre)
docker exec "$BACK_CONTAINER" node src/reset.js
echo "✅ Tables réinitialisées avec succès !"

# Relance du seed
docker exec "$BACK_CONTAINER" node src/seed.js
echo "📦 Seed relancé avec succès !"

# Redémarrage du back pour que les nouvelles données soient prises en compte
echo "🔄 Redémarrage du back pour prendre en compte les nouvelles données..."
docker restart "$BACK_CONTAINER"
echo "✅ Back redémarré !"

echo "🎉 Reset terminé. Tu peux maintenant recharger le front."
