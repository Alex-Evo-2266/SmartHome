#!/usr/bin/env bash
set -e

echo "🐍 Установка pyenv..."

if [ ! -d "$HOME/.pyenv" ]; then
  git clone https://github.com/pyenv/pyenv.git ~/.pyenv
else
  echo "ℹ️  pyenv уже установлен, обновляем..."
  cd ~/.pyenv && git pull && cd -
fi

export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

if ! pyenv versions | grep -q "3.12"; then
  echo "⬇️  Установка Python 3.12 через pyenv..."
  pyenv install 3.12.7
else
  echo "✅ Python 3.12 уже установлен."
fi

pyenv global 3.12.7
echo "🐍 Python версия:"
python -V
