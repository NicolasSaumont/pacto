@echo off

echo 🚀 Lancement de Pacto...

REM Démarrer les conteneurs Docker
docker compose -f docker-compose.prod.yml up -d

echo ⏳ Attente du démarrage des services...
timeout /t 5 /nobreak > nul

echo 🌐 Ouverture de l'application...
start http://localhost:3000

echo ✅ Pacto est lancé !