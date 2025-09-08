#!/bin/bash

BASE_DIR="$(dirname "$(realpath "$0")")/.."

docker compose --env-file $BASE_DIR/.env -f $BASE_DIR/docker-compose-traefik.yml -f $BASE_DIR/AuthService/docker-compose-auth.yml stop

