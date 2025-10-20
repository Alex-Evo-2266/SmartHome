FROM python:3.12

# Установим переменные окружения
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR="/var/cache/pypoetry"

# Обновляем систему и устанавливаем необходимые пакеты
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y curl

# Создаем пользователя и группу device_service
RUN groupadd -r device_service && \
    useradd -m -g device_service -r device_service && \
    usermod -aG device_service device_service

# Устанавливаем Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry

# Проверяем версию Python перед установкой зависимостей
RUN python3 --version  # Должно вывести 3.12.x

# Удаляем Python 3.11, так как он не нужен
RUN apt-get remove -y python3.11 python3.11-minimal || echo "Python 3.11 не найден"

# Проверяем, что Python 3.12 стал активным
RUN python3 --version  # Должно вывести 3.12.x

# Создаём рабочие директории
RUN mkdir -p /home/device_service/web
WORKDIR /home/device_service/web

# Удаляем старую директорию .venv, если она есть
# RUN rm -rf /home/device_service/web/.venv

# Даем права на директорию .venv перед установкой зависимостей
# RUN mkdir -p /home/device_service/web/.venv && chown -R device_service:device_service /home/device_service/web/.venv

# Копируем файлы poetry.lock и pyproject.toml
COPY poetry.lock pyproject.toml ./
COPY ./external/whl_all ./shared_lib

# Очистка кэша Poetry
RUN poetry cache clear pypi --all

# Устанавливаем зависимости
RUN poetry install --no-interaction --no-ansi $(test "$YOUR_ENV" == "production" && echo "--no-dev")
RUN poetry add ./shared_lib/*.whl

# Проверяем, что Poetry использует правильный Python
RUN poetry run python --version  # Должно вывести 3.12.x

# Копируем весь проект
COPY . .

# Создаём директорию media и устанавливаем права
RUN mkdir -p media && chmod 755 media
RUN mkdir -p config && chmod 755 config
RUN mkdir -p config_services && chmod 755 config_services
RUN mkdir -p config_services/dashboards && chmod 755 config_services/dashboards

# Запускаем контейнер от имени пользователя device_service
# USER device_service

# Указываем рабочую директорию
WORKDIR /home/device_service/web

COPY ./command.sh ./
# RUN chown auth_service:auth_service command.sh
RUN chmod +x command.sh