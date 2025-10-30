FROM python:3.12

ENV PYTHONDONTRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.8.3 PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
ENV POETRY_HOME='/opt/poetry'
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_CACHE_DIR='/var/cache/pypoetry'

RUN apt-get update
RUN apt-get upgrade -y

RUN mkdir -p /home/email_service

ENV HOME=/home/email_service
ENV APP_HOME=/home/email_service/web
ENV APP_MEDIA=$APP_HOME/media

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# RUN curl -sSL https://install.python-poetry.org | python3 -
# RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry
RUN wget https://install.python-poetry.org -O install-poetry.py
RUN python3 install-poetry.py

RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry

COPY poetry.lock $APP_HOME/
COPY pyproject.toml $APP_HOME/

RUN poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

COPY . $APP_HOME

WORKDIR $APP_MEDIA
WORKDIR $APP_HOME
# RUN mkdir media
RUN chmod 777 media/

RUN groupadd email_service
RUN useradd -m -g email_service email_service -p PASSWORD
RUN usermod -aG email_service email_service