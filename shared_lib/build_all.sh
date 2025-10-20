#!/bin/sh

# Папка, где лежит сам скрипт
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Базовая папка — та же, что и скрипт
BASE_DIR="$SCRIPT_DIR"

# Папка для всех артефактов
OUTPUT_DIR="$BASE_DIR/dist_all"
mkdir -p "$OUTPUT_DIR"

# Ищем все pyproject.toml и собираем проекты
find "$BASE_DIR" -name "pyproject.toml" | while read -r file; do
    DIR=$(dirname "$file")
    echo "=== Сборка проекта: $DIR ==="

    cd "$DIR" || { echo "Не удалось перейти в $DIR"; continue; }

    # Получаем имя библиотеки из pyproject.toml
    LIB_NAME=$(grep -m1 'name =' pyproject.toml | sed -E "s/name = \"(.*)\"/\1/")
    if [ -z "$LIB_NAME" ]; then
        echo "Не удалось определить имя библиотеки, пропускаем $DIR"
        continue
    fi

    # Создаём подпапку для библиотеки
    LIB_OUTPUT="$OUTPUT_DIR/$LIB_NAME"
    mkdir -p "$LIB_OUTPUT"

    # Сборка wheel и sdist в подпапку
    poetry build --format wheel --output "$LIB_OUTPUT" || { echo "Ошибка сборки wheel в $DIR"; continue; }
    poetry build --format sdist --output "$LIB_OUTPUT" || { echo "Ошибка сборки sdist в $DIR"; continue; }
done

echo "=== Сборка завершена. Все пакеты собраны в $OUTPUT_DIR с подпапками библиотек ==="

# Папка для всех whl
WHL_DIR="$BASE_DIR/whl_all"
mkdir -p "$WHL_DIR"

cp "$OUTPUT_DIR"/*/*.whl "$WHL_DIR" || echo "No .whl files found"
