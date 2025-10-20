#!/bin/bash
set -e

BASE_DIR="$(dirname "$(realpath "$0")")/.."

# Директория для сертификатов
CERT_DIR="$BASE_DIR/certs"

# Список доменов (можно добавить свои сервисы)
DOMAINS="localhost 127.0.0.1 ::1"

# Создаём папку, если её нет
mkdir -p "$CERT_DIR"

# Проверяем наличие mkcert
if ! command -v mkcert &> /dev/null
then
    echo "❌ mkcert не установлен. Установи его: https://github.com/FiloSottile/mkcert"
    exit 1
fi

# Устанавливаем локальный CA (один раз)
mkcert -install

# Генерация сертификата
mkcert -key-file "$CERT_DIR/local-key.pem" -cert-file "$CERT_DIR/local-cert.pem" $DOMAINS

echo "✅ Сертификат создан:"
echo "   - $CERT_DIR/local-cert.pem"
echo "   - $CERT_DIR/local-key.pem"
