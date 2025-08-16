#!/bin/bash

BASE_DIR="$(dirname "$(realpath "$0")")/.."

sh $BASE_DIR/scripts/copy_shared_lib.sh

sudo docker compose --env-file $BASE_DIR/.env --file $BASE_DIR/docker-compose-traefik.yml build

