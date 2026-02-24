@echo off

echo Installation de Pacto...

docker compose -f docker-compose.prod.yml build

docker compose -f docker-compose.prod.yml up -d

echo Installation terminée !
pause