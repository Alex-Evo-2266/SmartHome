#!/bin/bash
set -e

echo "🚀 Установка mkcert на Linux"

# Проверка root
if [[ $EUID -ne 0 ]]; then
   echo "❌ Запусти скрипт с sudo!"
   exit 1
fi

# Определяем дистрибутив
if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO=$ID
else
    echo "❌ Не удалось определить дистрибутив!"
    exit 1
fi

echo "🔎 Обнаружен дистрибутив: $DISTRO"

# Установка зависимостей
case "$DISTRO" in
    ubuntu|debian)
        apt update
        apt install -y libnss3-tools curl
        ;;
    fedora)
        dnf install -y nss-tools curl
        ;;
    centos|rhel)
        yum install -y nss-tools curl
        ;;
    arch|manjaro)
        pacman -Sy --noconfirm nss curl
        ;;
    *)
        echo "⚠️ Дистрибутив $DISTRO не поддерживается напрямую. Попробую продолжить..."
        ;;
esac

# Получаем последнюю версию mkcert
LATEST_VERSION=$(curl -s https://api.github.com/repos/FiloSottile/mkcert/releases/latest | grep tag_name | cut -d '"' -f 4)
if [ -z "$LATEST_VERSION" ]; then
    echo "❌ Не удалось получить последнюю версию mkcert!"
    exit 1
fi
echo "📦 Скачиваем mkcert $LATEST_VERSION"

# Скачиваем бинарник
curl -L -o /usr/local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/download/$LATEST_VERSION/mkcert-v${LATEST_VERSION#v}-linux-amd64

# Делаем исполняемым
chmod +x /usr/local/bin/mkcert

# Проверяем установку
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert не установлен!"
    exit 1
fi

# Устанавливаем локальный CA
echo "⚙️ Устанавливаем локальный CA..."
mkcert -install

echo "✅ mkcert установлен успешно!"
mkcert -version
