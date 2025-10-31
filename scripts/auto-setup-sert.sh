#!/bin/bash
set -e

BASE_DIR="$(dirname "$(realpath "$0")")/.."
CERT_DIR="$BASE_DIR/certs"

# Получаем локальный IP
LOCAL_IP=$(ip route get 1 | awk '{print $7; exit}')
if [ -z "$LOCAL_IP" ]; then
    echo "❌ Не удалось определить локальный IP"
    exit 1
fi

# Генерируем локальный домен
DOMAIN="local-$(echo $LOCAL_IP | tr '.' '-')".test

echo "ℹ️ Локальный IP: $LOCAL_IP"
echo "ℹ️ Локальный домен: $DOMAIN"

# Вызываем generate-cert.sh
"$BASE_DIR/scripts/generate-cert.sh" "$CERT_DIR" localhost 127.0.0.1 "$LOCAL_IP" "$DOMAIN"

# Добавляем запись в /etc/hosts
HOSTS_LINE="$LOCAL_IP $DOMAIN"
if grep -q "$DOMAIN" /etc/hosts; then
    echo "ℹ️ Запись для $DOMAIN уже есть в /etc/hosts"
else
    echo "🔑 Добавляем запись в /etc/hosts (требуются права root)..."
    echo "$HOSTS_LINE" | sudo tee -a /etc/hosts > /dev/null
    echo "✅ Запись добавлена: $HOSTS_LINE"
fi

echo "ℹ️ Используйте $DOMAIN для Traefik и WSS/HTTPS"
