# FROM python:3.12

# ENV PYTHONDONTRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
# ENV POETRY_VERSION=1.8.3 PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
# ENV POETRY_HOME='/opt/poetry'
# ENV POETRY_VIRTUALENVS_CREATE=false
# ENV POETRY_CACHE_DIR='/var/cache/pypoetry'

# RUN apt-get update
# RUN apt-get upgrade -y

# RUN mkdir -p /home/script_service

# ENV HOME=/home/script_service
# ENV APP_HOME=/home/script_service/web
# ENV APP_MEDIA=$APP_HOME/media

# RUN mkdir $APP_HOME
# WORKDIR $APP_HOME

# RUN curl -sSL https://install.python-poetry.org | python3 -
# RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry

# COPY poetry.lock $APP_HOME/
# COPY pyproject.toml $APP_HOME/

# RUN poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

# COPY . $APP_HOME

# WORKDIR $APP_MEDIA
# WORKDIR $APP_HOME
# # RUN mkdir media
# RUN chmod 777 media/

# RUN groupadd script_service
# RUN useradd -m -g script_service script_service -p PASSWORD
# RUN usermod -aG script_service script_service

# FROM python:3.12

# # Установим переменные окружения
# ENV PYTHONUNBUFFERED=1 \
#     PYTHONDONTWRITEBYTECODE=1 \
#     POETRY_VERSION=1.8.3 \
#     POETRY_HOME="/opt/poetry" \
#     POETRY_VIRTUALENVS_CREATE=false \
#     POETRY_CACHE_DIR="/var/cache/pypoetry"

# # Обновляем систему и устанавливаем необходимые пакеты
# RUN apt-get update && \
#     apt-get upgrade -y && \
#     apt-get install -y curl

# # Создаем пользователя и группу script_service
# RUN groupadd -r script_service && \
#     useradd -m -g script_service -r script_service && \
#     usermod -aG script_service script_service

# # Устанавливаем Poetry
# RUN curl -sSL https://install.python-poetry.org | python3 - && \
#     ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry

# # Удаляем Python 3.11, так как он не нужен
# RUN apt-get remove -y python3.11 python3.11-minimal || echo "Python 3.11 не найден"

# # Создаём рабочие директории
# RUN mkdir -p /home/script_service/web
# WORKDIR /home/script_service/web

# # Копируем файлы poetry.lock и pyproject.toml
# COPY poetry.lock pyproject.toml ./

# # Даем права на директорию .venv перед установкой зависимостей
# # RUN mkdir -p /home/script_service/web/.venv && chown -R script_service:script_service /home/script_service/web/.venv

# # Очистка кэша Poetry
# RUN poetry cache clear pypi --all

# # Устанавливаем зависимости
# # RUN poetry install --no-interaction --no-ansi $(test "$YOUR_ENV" == "production" && echo "--no-dev")
# RUN poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

# # Проверяем, что Poetry использует правильный Python
# RUN poetry run python --version  # Должно вывести 3.12.x

# # Копируем весь проект
# COPY . .

# # Создаём директорию media и устанавливаем права
# RUN mkdir -p media && chmod 755 media

# # RUN chown -R script_service:script_service /home/script_service/web/.venv

# # RUN chmod 777 /home/script_service/web/.venv

# # Запускаем контейнер от имени пользователя script_service
# USER script_service

# # RUN chmod 777 /home/script_service/web/.venv

# # Указываем рабочую директорию
# WORKDIR /home/script_service/web

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

# Создаем пользователя и группу script_service
RUN groupadd -r script_service && \
    useradd -m -g script_service -r script_service && \
    usermod -aG script_service script_service

# Устанавливаем Poetry
# RUN curl -sSL https://install.python-poetry.org | python3 - && \
#     ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry

RUN python3.12 -m ensurepip --upgrade
RUN python3.12 -m pip install --user pipx
RUN python3.12 -m pipx ensurepath
RUN source ~/.bashrc
RUN pipx install poetry

RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry

# Проверяем версию Python перед установкой зависимостей
RUN python3 --version  # Должно вывести 3.12.x

# Удаляем Python 3.11, так как он не нужен
RUN apt-get remove -y python3.11 python3.11-minimal || echo "Python 3.11 не найден"

# Проверяем, что Python 3.12 стал активным
RUN python3 --version  # Должно вывести 3.12.x

# Создаём рабочие директории
RUN mkdir -p /home/script_service/web
WORKDIR /home/script_service/web

# Удаляем старую директорию .venv, если она есть
# RUN rm -rf /home/script_service/web/.venv

# Даем права на директорию .venv перед установкой зависимостей
# RUN mkdir -p /home/script_service/web/.venv && chown -R script_service:script_service /home/script_service/web/.venv

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

# Запускаем контейнер от имени пользователя script_service
# USER script_service

# Указываем рабочую директорию
WORKDIR /home/script_service/web