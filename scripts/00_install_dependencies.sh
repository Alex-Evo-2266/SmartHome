#!/usr/bin/env bash
set -e

echo "🔧 Установка системных зависимостей..."

if command -v apt >/dev/null 2>&1; then
  sudo apt update
  sudo apt install -y \
    git curl build-essential libssl-dev zlib1g-dev libbz2-dev \
    libreadline-dev libsqlite3-dev wget llvm libncurses5-dev libncursesw5-dev \
    xz-utils tk-dev libffi-dev liblzma-dev python3-openssl
elif command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y \
    git curl gcc make zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel \
    openssl-devel tk-devel libffi-devel xz-devel
elif command -v pacman >/dev/null 2>&1; then
  sudo pacman -Sy --noconfirm git curl base-devel openssl zlib xz tk
else
  echo "❌ Неизвестный пакетный менеджер. Установите зависимости вручную."
  exit 1
fi

echo "✅ Системные зависимости установлены."
