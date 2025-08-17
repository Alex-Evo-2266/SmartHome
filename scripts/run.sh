#!/bin/bash

BASE_DIR="$(dirname "$(realpath "$0")")/.."

sudo docker compose --env-file $BASE_DIR/.env --file $BASE_DIR/docker-compose-traefik.yml up

