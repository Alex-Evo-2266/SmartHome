#!/bin/bash

BASE_DIR="$(dirname "$(realpath "$0")")/.."

sh $BASE_DIR/scripts/create_network.sh

sh $BASE_DIR/scripts/copy_shared_lib.sh

docker compose --env-file $BASE_DIR/.env -f $BASE_DIR/docker-compose-traefik.yml -f $BASE_DIR/AuthService/docker-compose-auth.yml -f $BASE_DIR/ModuleManeger/docker-compose-manager.yml build

