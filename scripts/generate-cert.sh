#!/bin/bash
set -e

# ==========================================
# Скрипт генерации mkcert сертификатов
# Аргументы: список доменов/IP
# ==========================================

CERT_DIR="$1"
shift
DOMAINS="$*"

if [ -z "$CERT_DIR" ] || [ -z "$DOMAINS" ]; then
    echo "Использование: $0 <путь_к_папке_сертификатов> <домены/IP...>"
    exit 1
fi

mkdir -p "$CERT_DIR"

# Проверяем наличие mkcert
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert не установлен. Установи его: https://github.com/FiloSottile/mkcert"
    exit 1
fi

# Устанавливаем локальный CA (один раз)
mkcert -install

# Пути для сертификатов
CERT_FILE="$CERT_DIR/local-cert.pem"
KEY_FILE="$CERT_DIR/local-key.pem"

# Генерация сертификатов
echo "📝 Генерируем сертификаты для: $DOMAINS"
mkcert -key-file "$KEY_FILE" -cert-file "$CERT_FILE" $DOMAINS

echo "✅ Сертификаты созданы:"
echo "   - CERT: $CERT_FILE"
echo "   - KEY:  $KEY_FILE"
