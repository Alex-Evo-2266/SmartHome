#!/bin/bash

# Путь к родительской папке относительно текущего скрипта
BASE_DIR="$(dirname "$(realpath "$0")")/.."

bash "$BASE_DIR/shared_lib/build_all.sh"

# Перебираем все верхние папки в BASE_DIR
for dir in "$BASE_DIR"/*/; do
    # Получаем имя папки
    folder_name=$(basename "$dir")

    # Пропускаем папку scripts
    if [ "$folder_name" = "scripts" ]; then
        continue
    fi

    # Проверяем, есть ли copy_shared_lib.sh
    script_path="$dir/copy_shared_lib.sh"
    if [ -f "$script_path" ]; then
        echo "Выполняем $script_path..."
        bash "$script_path"
    fi
done
