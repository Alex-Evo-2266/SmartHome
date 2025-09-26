#!/bin/bash

MODULE_NAME=$1

if [ -z "$MODULE_NAME" ]; then
  echo "Использование: ./stop_module.sh <module-name>"
  exit 1
fi

BASE_DIR="$(dirname "$(realpath "$0")")/.."
MODULES_DIR="$BASE_DIR/modules"
CONFIG_DIR="$BASE_DIR/Configurate"

# docker compose --env-file $BASE_DIR/.env -f $BASE_DIR/$MODULE_NAME/docker-compose.yml build
docker compose --env-file $BASE_DIR/.env -f $MODULES_DIR/$MODULE_NAME/docker-compose.yml up -d

