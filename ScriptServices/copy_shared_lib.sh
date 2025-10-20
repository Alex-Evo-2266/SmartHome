#!/bin/bash
set -e  # прерывать выполнение при ошибках

# Определяем папку, где лежит сам скрипт
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

# Создаём external внутри папки со скриптом
mkdir -p "$SCRIPT_DIR/external"

# Запускаем сборку из ../shared_lib относительно скрипта
bash "$SCRIPT_DIR/../shared_lib/build_all.sh"

# Копируем dist_all во внутреннюю папку external
cp -r "$SCRIPT_DIR/../shared_lib/dist_all" "$SCRIPT_DIR/external"
cp -r "$SCRIPT_DIR/../shared_lib/whl_all" "$SCRIPT_DIR/external"
