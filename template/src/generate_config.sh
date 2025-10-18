#!/usr/bin/env bash
set -e

BASE_DIR="$(dirname "$(realpath "$0")")/.."
MODULE_CONFIG_FILE_TEMPLATE="$BASE_DIR/module-config-template.yml"

# Определяем имя папки, в которой лежит шаблон
MODULE_DIR_NAME="$(basename "$(dirname "$MODULE_CONFIG_FILE_TEMPLATE")")"

# Проверяем, что шаблон существует
if [ ! -f "$MODULE_CONFIG_FILE_TEMPLATE" ]; then
  echo "❌ Файл шаблона не найден: $MODULE_CONFIG_FILE_TEMPLATE"
  exit 1
fi

# Заменяем __MODULE_NAME__ на имя папки и сохраняем результат в module-config.yml
MODULE_CONFIG_FILE="$(dirname "$MODULE_CONFIG_FILE_TEMPLATE")/module-config.yml"
sed "s|__MODULE_NAME__|$MODULE_DIR_NAME|g" "$MODULE_CONFIG_FILE_TEMPLATE" > "$MODULE_CONFIG_FILE"

echo "✅ Файл $MODULE_CONFIG_FILE создан с MODULE_NAME=$MODULE_DIR_NAME"
