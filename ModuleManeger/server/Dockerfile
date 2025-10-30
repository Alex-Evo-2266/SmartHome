FROM python:3.12

ENV PYTHONDONTRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.8.3 PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
ENV POETRY_HOME='/opt/poetry'
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_CACHE_DIR='/var/cache/pypoetry'

RUN apt-get update
RUN apt-get upgrade -y

RUN mkdir -p /home/module_manager

ENV HOME=/home/module_manager
ENV APP_HOME=/home/module_manager/web

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# RUN curl -sSL https://install.python-poetry.org | python3 -
# RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry
RUN wget https://install.python-poetry.org -O install-poetry.py
RUN python3 install-poetry.py

RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry

COPY poetry.lock $APP_HOME/
COPY pyproject.toml $APP_HOME/
RUN mkdir -p $APP_HOME/shared_lib
COPY ./external/whl_all $APP_HOME/shared_lib

RUN poetry install $(echo "--no-dev") --no-interaction --no-ansi
RUN poetry add $APP_HOME/shared_lib/*.whl

RUN apt-get update && apt-get install -y docker.io docker-compose

COPY . $APP_HOME

RUN mkdir media
RUN mkdir -p config_services && chmod 755 config_services
RUN mkdir -p config && chmod 755 config
RUN mkdir -p modules && chmod 755 modules
RUN mkdir -p modules_core && chmod 755 modules_core
RUN chmod 777 media/

RUN groupadd module_manager
RUN useradd -m -g module_manager module_manager -p PASSWORD
RUN usermod -aG module_manager module_manager