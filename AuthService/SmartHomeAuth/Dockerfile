FROM python:3.12

ENV PYTHONDONTRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.8.3 PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
ENV POETRY_HOME='/opt/poetry'
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_CACHE_DIR='/var/cache/pypoetry'

RUN apt-get update
RUN apt-get upgrade -y

RUN mkdir -p /home/auth_service

ENV HOME=/home/auth_service
ENV APP_HOME=/home/auth_service/web

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# RUN curl -sSL https://install.python-poetry.org | python3 -
# RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry

RUN python3.12 -m ensurepip --upgrade
RUN python3.12 -m pip install --user pipx
RUN python3.12 -m pipx ensurepath
RUN source ~/.bashrc
RUN pipx install poetry

RUN cd /usr/local/bin && ln -s /opt/poetry/bin/poetry

COPY poetry.lock $APP_HOME/
COPY pyproject.toml $APP_HOME/

RUN poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

COPY . $APP_HOME

RUN mkdir media
RUN mkdir -p config_services && chmod 755 config_services
RUN chmod 777 media/

RUN groupadd auth_service
RUN useradd -m -g auth_service auth_service -p PASSWORD
RUN usermod -aG auth_service auth_service

COPY ./command.sh ./
RUN chown auth_service:auth_service command.sh
RUN chmod +x command.sh

USER auth_service