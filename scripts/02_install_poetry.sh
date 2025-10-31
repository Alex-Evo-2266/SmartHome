#!/usr/bin/env bash
set -e

echo "📦 Проверка наличия pip..."
if ! command -v pip >/dev/null 2>&1; then
  echo "⬇️  Устанавливаю pip..."
  curl -sS https://bootstrap.pypa.io/get-pip.py | python3
fi
echo "✅ pip установлен: $(pip --version)"

echo "📦 Проверка наличия pipx..."
if ! command -v pipx >/dev/null 2>&1; then
  echo "⬇️  Устанавливаю pipx через pip..."
  python3 -m pip install --user pipx
  python3 -m pipx ensurepath
  export PATH="$PATH:$HOME/.local/bin"
fi
echo "✅ pipx установлен: $(pipx --version)"

echo "🎩 Установка Poetry через pipx..."
if ! pipx list | grep -q "poetry"; then
  pipx install poetry
else
  pipx upgrade poetry
fi

echo "✅ Poetry установлен: $(poetry --version)"
