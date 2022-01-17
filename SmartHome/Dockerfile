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

RUN pip install "poetry==$POETRY_VERSION"

COPY poetry.lock $APP_HOME/
COPY pyproject.toml $APP_HOME/

RUN poetry config virtualenvs.create false \
  && poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

RUN python3 -m pip install daphne

COPY . $APP_HOME

RUN chown -R smart_home:smart_home $APP_HOME

USER smart_home

RUN mkdir media
RUN mkdir files/scripts
RUN mkdir staticfile
RUN touch files/devices.yml
