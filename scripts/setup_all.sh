#!/usr/bin/env bash
set -e

BASE_DIR="$(dirname "$(realpath "$0")")"

echo "🚀 Начинаем установку окружения..."
bash "$BASE_DIR/00_install_dependencies.sh"
bash "$BASE_DIR/01_install_pyenv.sh"
bash "$BASE_DIR/02_install_poetry.sh"
bash "$BASE_DIR/auto-setup-sert.sh"
echo "🎉 Установка завершена успешно!"
