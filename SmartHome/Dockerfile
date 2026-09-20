FROM python:3.12

# ---------- Переменные окружения ----------
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    POETRY_VERSION=2.4.1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR="/var/cache/pypoetry"

# ---------- Пользователь ----------
RUN groupadd -r device_service && \
    useradd -m -g device_service -r device_service && \
    usermod -aG device_service device_service

# ---------- Poetry ----------
# Устанавливаем Poetry той версии, что указана в POETRY_VERSION.
# pip подтянет нужную, --upgrade pip — чтобы работали современные wheels.
RUN python3 -m pip install --upgrade pip \
 && python3 -m pip install "poetry==${POETRY_VERSION}"

# Проверяем, что версии Python и Poetry совпадают с ожидаемыми
RUN python3 --version && poetry --version

# ---------- Рабочая директория ----------
RUN mkdir -p /home/device_service/web/shared_lib
WORKDIR /home/device_service/web

# ---------- Зависимости ----------
# Копируем ТОЛЬКО манифесты — это позволяет кэшировать слой с установкой,
# пока не меняется pyproject/lock.
COPY poetry.lock pyproject.toml ./
COPY ./external/whl_all ./shared_lib

# Сбрасываем кэш pip/poetry, чтобы не тянуть старое из локального образа
RUN poetry cache clear pypi --all || true

# Ставим основные зависимости (без dev).
# --only main — современный эквивалент устаревшего --no-dev в Poetry 2.x.
RUN poetry install --no-interaction --no-ansi --only main

# Ставим локальные whl-пакеты из shared_lib.
# ВАЖНО: pip install --no-deps НЕ трогает pyproject.toml/poetry.lock,
# поэтому следующий docker build не будет ругаться на расхождение.
# Если нужны зависимости самих whl — убери --no-deps, но проверь,
# что они не конфликтуют с основным lock.
RUN if ls ./shared_lib/*.whl >/dev/null 2>&1; then \
        pip install --no-deps ./shared_lib/*.whl; \
    else \
        echo "No .whl files in shared_lib — skipping"; \
    fi

# Проверяем, что Poetry использует правильный Python
RUN poetry run python --version

# ---------- Проект ----------
COPY . .

# Директория для медиа
RUN mkdir -p media && chmod 755 media

WORKDIR /home/device_service/web