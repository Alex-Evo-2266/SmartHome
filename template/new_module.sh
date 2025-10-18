#!/bin/bash

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Использование: ./new_module.sh <app-name>"
  exit 1
fi

# создаём приложение

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
BASE_DIR=$SCRIPT_DIR/../modules

# COMPOSE_FILE="$BASE_DIR/$APP_NAME/docker-compose.yml"
# COMPOSE_FILE_TEMPLATE="$BASE_DIR/$APP_NAME/docker-compose-template.yml"
MODULE_CONFIG_FILE="$BASE_DIR/$APP_NAME/module-config.yml"
MODULE_CONFIG_FILE_TEMPLATE="$BASE_DIR/$APP_NAME/module-config-template.yml"

npx create-next-app@latest $BASE_DIR/$APP_NAME --typescript --eslint --app --src-dir

mkdir -p $BASE_DIR/$APP_NAME/scripts

cp "$SCRIPT_DIR/src/create_config_files.ts" "$BASE_DIR/$APP_NAME/scripts/"
cp "$SCRIPT_DIR/src/tsconfig.scripts.json" "$BASE_DIR/$APP_NAME/"
cp "$SCRIPT_DIR/src/next.config.ts" "$BASE_DIR/$APP_NAME/"
cp "$SCRIPT_DIR/src/Dockerfile" "$BASE_DIR/$APP_NAME/"
cp "$SCRIPT_DIR/src/generate_page.sh" "$BASE_DIR/$APP_NAME/scripts/"
cp "$SCRIPT_DIR/src/generate_config.sh" "$BASE_DIR/$APP_NAME/scripts/"

TEMPLATE_FILE="$SCRIPT_DIR/src/docker-compose-template.yml"
TEMPLATE_MODULE_CONFIG_FILE="$SCRIPT_DIR/src/module-config.yml"

# sed "s/__MODULE_NAME__/$APP_NAME/g" "$TEMPLATE_FILE" > "$COMPOSE_FILE"
sed "s/__MODULE_BASE_NAME__/$APP_NAME/g" "$TEMPLATE_MODULE_CONFIG_FILE" > "$MODULE_CONFIG_FILE"
sed "s/__MODULE_BASE_NAME__/$APP_NAME/g" "$TEMPLATE_MODULE_CONFIG_FILE" > "$MODULE_CONFIG_FILE_TEMPLATE"
# cp $TEMPLATE_MODULE_CONFIG_FILE $MODULE_CONFIG_FILE
# cp $TEMPLATE_FILE $COMPOSE_FILE_TEMPLATE

cd $BASE_DIR/$APP_NAME

echo "Next.js приложение $APP_NAME создано!"

npm install js-yaml
npm install --save-dev @types/js-yaml
npm install

tmpfile=$(mktemp)
jq '.scripts["build"]="next build && tsc -p tsconfig.scripts.json" | .scripts["generate:pages"]="node dist/create_config_files.js"' package.json > "$tmpfile" && mv "$tmpfile" package.json

tmpfile=$(mktemp)
jq '.compilerOptions["outDir"]="dist"' tsconfig.json > "$tmpfile" && mv "$tmpfile" tsconfig.json

rm -rf $BASE_DIR/$APP_NAME/src/app
rm -rf $BASE_DIR/$APP_NAME/public
mkdir $BASE_DIR/$APP_NAME/src/app
mkdir $BASE_DIR/$APP_NAME/public

LIB_DIR=$BASE_DIR/$APP_NAME/src/lib

mkdir $LIB_DIR
cp "$SCRIPT_DIR/src/envVar.ts" "$LIB_DIR"
ENV_VAR_FILE="$LIB_DIR/envVar.ts"

TEMPLATE_FILE_LAYOUT="$SCRIPT_DIR/src/layout.tsx"
sed "s/__MODULE_NAME__/$APP_NAME/g" "$TEMPLATE_FILE_LAYOUT" > "$BASE_DIR/$APP_NAME/src/app/layout.tsx"

# ======================
# Функция для добавления env переменной
# ======================

add_env_var_and_compose() {
  local VAR_NAME="$1"

  # --- envVar.ts ---
  if [ ! -f "$ENV_VAR_FILE" ]; then
    echo "// Автоматически сгенерированные переменные окружения" > "$ENV_VAR_FILE"
  fi

  if ! grep -q "export const $VAR_NAME" "$ENV_VAR_FILE"; then
    echo "export const $VAR_NAME = process.env.$VAR_NAME" >> "$ENV_VAR_FILE"
    echo "✅ Добавлено в envVar.ts: $VAR_NAME"
  else
    echo "⚠️ Уже существует в envVar.ts: $VAR_NAME"
  fi

  # # --- docker-compose.yml ---
  # if ! grep -q "  $VAR_NAME:" "$COMPOSE_FILE"; then
  #   # вставляем в блок environment (после строки 'environment:')
  #   awk -v varname="$VAR_NAME" '
  #     /environment:/ {
  #       print;
  #       print "      " varname ": ${" varname "}";
  #       next
  #     }
  #     {print}
  #   ' "$COMPOSE_FILE" > "$COMPOSE_FILE.tmp" && mv "$COMPOSE_FILE.tmp" "$COMPOSE_FILE"
  #   echo "✅ Добавлено в docker-compose.yml: $VAR_NAME"
  # else
  #   echo "⚠️ Уже существует в docker-compose.yml: $VAR_NAME"
  # fi

  # # --- docker-compose-template.yml ---
  # if ! grep -q "  $VAR_NAME:" "$COMPOSE_FILE_TEMPLATE"; then
  #   # вставляем в блок environment (после строки 'environment:')
  #   awk -v varname="$VAR_NAME" '
  #     /environment:/ {
  #       print;
  #       print "      " varname ": ${" varname "}";
  #       next
  #     }
  #     {print}
  #   ' "$COMPOSE_FILE_TEMPLATE" > "$COMPOSE_FILE_TEMPLATE.tmp" && mv "$COMPOSE_FILE_TEMPLATE.tmp" "$COMPOSE_FILE_TEMPLATE"
  #   echo "✅ Добавлено в docker-compose-template.yml: $VAR_NAME"
  # else
  #   echo "⚠️ Уже существует в docker-compose-template.yml: $VAR_NAME"
  # fi

  # --- module-config.yml ---
  if ! grep -q "  $VAR_NAME:" "$MODULE_CONFIG_FILE"; then
    # вставляем в блок environment (после строки 'environment:')
    awk -v varname="$VAR_NAME" '
      /environment:/ {
        print;
        print "        " varname ": ${" varname "}";
        next
      }
      {print}
    ' "$MODULE_CONFIG_FILE" > "$MODULE_CONFIG_FILE.tmp" && mv "$MODULE_CONFIG_FILE.tmp" "$MODULE_CONFIG_FILE"
    echo "✅ Добавлено в module-config.yml: $VAR_NAME"
  else
    echo "⚠️ Уже существует в module-config.yml: $VAR_NAME"
  fi

  # --- module-config.yml ---
  if ! grep -q "  $VAR_NAME:" "$MODULE_CONFIG_FILE_TEMPLATE"; then
    # вставляем в блок environment (после строки 'environment:')
    awk -v varname="$VAR_NAME" '
      /environment:/ {
        print;
        print "        " varname ": ${" varname "}";
        next
      }
      {print}
    ' "$MODULE_CONFIG_FILE_TEMPLATE" > "$MODULE_CONFIG_FILE_TEMPLATE.tmp" && mv "$MODULE_CONFIG_FILE_TEMPLATE.tmp" "$MODULE_CONFIG_FILE_TEMPLATE"
    echo "✅ Добавлено в module-config-template.yml: $VAR_NAME"
  else
    echo "⚠️ Уже существует в module-config-template.yml: $VAR_NAME"
  fi
}

add_traefik_ws_labels() {
  # Проверим, есть ли уже метки Traefik WS
  # if grep -q "traefik.http.routers.${APP_NAME}__ws.rule" "$COMPOSE_FILE"; then
  #   echo "⚠️ Traefik WS labels уже существуют в docker-compose.yml"
  #   return
  # fi

  # # Добавляем новые labels внутрь существующего блока labels
  # awk -v service="$APP_NAME" '
  #   /labels:/ {
  #     print;
  #     print "      - \"traefik.http.routers." service "__ws.rule=PathPrefix(`/ws/" service "`)\"";
  #     print "      - \"traefik.http.routers." service "__ws.service=" service "__ws\"";
  #     print "      - \"traefik.http.services." service "__ws.loadbalancer.server.port=3000\"";
  #     print "      - \"traefik.http.routers." service "__ws.entrypoints=websecure\"";
  #     next
  #   }
  #   {print}
  # ' "$COMPOSE_FILE" > "$COMPOSE_FILE.tmp" && mv "$COMPOSE_FILE.tmp" "$COMPOSE_FILE"

  # echo "✅ Добавлены Traefik WS labels в docker-compose.yml"

  # if grep -q "traefik.http.routers.__MODULE_NAME____ws.rule" "$COMPOSE_FILE_TEMPLATE"; then
  #   echo "⚠️ Traefik WS labels уже существуют в docker-compose-template.yml"
  #   return
  # fi

  # # Добавляем новые labels внутрь существующего блока labels
  # awk -v service="__MODULE_NAME__" '
  #   /labels:/ {
  #     print;
  #     print "      - \"traefik.http.routers." service "__ws.rule=PathPrefix(`/ws/" service "`)\"";
  #     print "      - \"traefik.http.routers." service "__ws.service=" service "__ws\"";
  #     print "      - \"traefik.http.services." service "__ws.loadbalancer.server.port=3000\"";
  #     print "      - \"traefik.http.routers." service "__ws.entrypoints=websecure\"";
  #     next
  #   }
  #   {print}
  # ' "$COMPOSE_FILE_TEMPLATE" > "$COMPOSE_FILE_TEMPLATE.tmp" && mv "$COMPOSE_FILE_TEMPLATE.tmp" "$COMPOSE_FILE_TEMPLATE"

  # echo "✅ Добавлены Traefik WS labels в docker-compose-template.yml"

  if grep -q "traefik.http.routers.${__APP_NAME__}__ws.rule" "$MODULE_CONFIG_FILE"; then
    echo "⚠️ Traefik WS labels уже существуют в docker-compose-template.yml"
    return
  fi

  # Добавляем новые labels внутрь существующего блока labels
  awk -v service="__MODULE_NAME__" '
    /labels:/ {
      print;
      print "        - \"traefik.http.routers." service "__ws.rule=PathPrefix(`/ws/" service "`)\"";
      print "        - \"traefik.http.routers." service "__ws.service=" service "__ws\"";
      print "        - \"traefik.http.services." service "__ws.loadbalancer.server.port=3000\"";
      print "        - \"traefik.http.routers." service "__ws.entrypoints=websecure\"";
      next
    }
    {print}
  ' "$MODULE_CONFIG_FILE" > "$MODULE_CONFIG_FILE.tmp" && mv "$MODULE_CONFIG_FILE.tmp" "$MODULE_CONFIG_FILE"

  echo "✅ Добавлены Traefik WS labels в module-config.yml"

  if grep -q "traefik.http.routers.${__APP_NAME__}__ws.rule" "$MODULE_CONFIG_FILE_TEMPLATE"; then
    echo "⚠️ Traefik WS labels уже существуют в docker-compose-template.yml"
    return
  fi

  # Добавляем новые labels внутрь существующего блока labels
  awk -v service="__MODULE_NAME__" '
    /labels:/ {
      print;
      print "        - \"traefik.http.routers." service "__ws.rule=PathPrefix(`/ws/" service "`)\"";
      print "        - \"traefik.http.routers." service "__ws.service=" service "__ws\"";
      print "        - \"traefik.http.services." service "__ws.loadbalancer.server.port=3000\"";
      print "        - \"traefik.http.routers." service "__ws.entrypoints=websecure\"";
      next
    }
    {print}
  ' "$MODULE_CONFIG_FILE_TEMPLATE" > "$MODULE_CONFIG_FILE_TEMPLATE.tmp" && mv "$MODULE_CONFIG_FILE_TEMPLATE.tmp" "$MODULE_CONFIG_FILE_TEMPLATE"

  echo "✅ Добавлены Traefik WS labels в module-config.yml"
}


# ======================
# Дополнительные опции
# ======================

echo ""
echo "Хотите добавить поддержку RabbitMQ? (y/N)"
read -r ADD_RABBIT
if [[ "$ADD_RABBIT" =~ ^[Yy]$ ]]; then
  echo "Устанавливаю amqplib..."
  npm install amqplib
  npm install @types/amqplib

  add_env_var_and_compose "RABITMQ_HOST"
  add_env_var_and_compose "RABITMQ_PORT"
  add_env_var_and_compose "EXCHANGE_SERVICE_DATA"

  cp "$SCRIPT_DIR/src/rabbitmq/rabbitmq.ts" "$LIB_DIR"

fi

echo ""
echo "Хотите добавить поддержку WebSocket? (y/N)"
read -r ADD_WS
if [[ "$ADD_WS" =~ ^[Yy]$ ]]; then
  echo "Устанавливаю ws..."
  npm install ws
  npm install @types/ws

  cp "$SCRIPT_DIR/src/ws/server.ts" "$BASE_DIR/$APP_NAME/src"
  TEMPLATE_FILE_WS="$SCRIPT_DIR/src/ws/ws-server.ts"
  sed "s/__MODULE_NAME__/$APP_NAME/g" "$TEMPLATE_FILE_WS" > "$LIB_DIR/ws-server.ts"
  add_traefik_ws_labels
fi

sed "s/__MODULE_NAME__/$APP_NAME/g" "$MODULE_CONFIG_FILE" > "${MODULE_CONFIG_FILE}2.tmp" \
  && mv "${MODULE_CONFIG_FILE}2.tmp" "$MODULE_CONFIG_FILE"

echo ""
echo "🎉 Модуль $APP_NAME готов!"