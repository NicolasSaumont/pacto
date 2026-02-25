@echo off

echo 🛑 Arrêt de Pacto...

docker compose -f docker-compose.prod.yml down

echo ✅ Pacto est arrêté !