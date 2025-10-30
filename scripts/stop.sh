#!/bin/bash

BASE_DIR="$(dirname "$(realpath "$0")")/.."

CONFIGURATE_DIR="$BASE_DIR/Configurate" ROOT_APP_DIR="$BASE_DIR" docker compose --env-file $BASE_DIR/.env -f $BASE_DIR/docker-compose-traefik.yml -f $BASE_DIR/AuthService/docker-compose-auth.yml -f $BASE_DIR/ModuleManeger/docker-compose-manager.yml stop

