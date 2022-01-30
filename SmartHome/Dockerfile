FROM python:3.8.0

ENV PYTHONDONTRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN apt-get upgrade -y

RUN mkdir -p /home/smart_home

RUN groupadd smart_home
RUN useradd -m -g smart_home smart_home -p PASSWORD
RUN usermod -aG smart_home smart_home

ENV POETRY_VERSION=1.0.0

ENV HOME=/home/smart_home
ENV APP_HOME=/home/smart_home/web

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apt-get update \
    && apt-get install -y netcat

RUN pip3 install --upgrade pip

RUN set -x && apt-get -qq update \
    && apt-get install -y --no-install-recommends \
    libpq-dev python3-dev git \
    && apt-get purge -y --auto-remove\
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

COPY poetry.lock $APP_HOME/
COPY pyproject.toml $APP_HOME/

RUN poetry config virtualenvs.create false \
  && poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

COPY . $APP_HOME

RUN chown -R smart_home:smart_home $APP_HOME

USER smart_home

RUN mkdir media
