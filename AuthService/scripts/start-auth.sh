#!/bin/bash
set -e  # завершить скрипт при любой ошибке
BASE_DIR="$(dirname "$(realpath "$0")")/.."

# Загружаем переменные из .env
export $(grep -v '^#' ./.env | xargs)

# Создаём сеть, если её ещё нет
if ! docker network ls | grep -q "^.*${NETWORK_NAME}.*$"; then
  echo "Создаём сеть ${NETWORK_NAME}..."
  docker network create "${NETWORK_NAME}"
  else
  echo "сеть ${NETWORK_NAME} уже создана"

fi

# Собираем и поднимаем все сервисы
sudo docker compose --env-file ./.env \
  -f $BASE_DIR/docker-compose-base.yml \
  -f $BASE_DIR/docker-compose-auth.yml build

# Собираем и поднимаем все сервисы
sudo docker compose --env-file ./.env \
  -f $BASE_DIR/docker-compose-base.yml \
  -f $BASE_DIR/docker-compose-auth.yml up
