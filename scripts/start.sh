#!/bin/bash

BASE_DIR="$(dirname "$(realpath "$0")")/.."

CONFIGURATE_DIR="$BASE_DIR/Configurate" docker compose --env-file $BASE_DIR/.env -f $BASE_DIR/docker-compose-traefik.yml -f $BASE_DIR/AuthService/docker-compose-auth.yml start

