#!/bin/bash
set -e

echo "⏳ Waiting for RabbitMQ..."

python -c "import socket, time, os;
host=os.getenv('RABBITMQ_HOST', 'rabbitmq');
port=int(os.getenv('RABBITMQ_PORT', 5672));
s=socket.socket();
while True:
    try:
        s.connect((host, port))
        s.close()
        print('✅ RabbitMQ is up')
        break
    except Exception:
        time.sleep(2)
"

echo "📦 Выполняем миграции Alembic..."
alembic upgrade head

echo "🚀 Запускаем Uvicorn..."
exec uvicorn app:create_app --reload --port=8004 --host=0.0.0.0