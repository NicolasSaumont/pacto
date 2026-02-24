@echo off

echo ==============================
echo Lancement de Pacto...
echo ==============================

docker compose -f docker-compose.prod.yml up -d

timeout /t 5

start http://localhost:3000

echo Application lancée !
pause