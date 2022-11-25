git pull
docker compose -f docker-compose-deploy.yml stop
docker compose -f docker-compose-deploy.yml up --build -d