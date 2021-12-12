FROM python:3.6

ENV PYTHONDONTRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN apt-get upgrade -y

RUN mkdir -p /home/smart_home

RUN groupadd smart_home
RUN useradd -m -g smart_home smart_home -p PASSWORD
RUN usermod -aG smart_home smart_home

ENV HOME=/home/smart_home
ENV APP_HOME=/home/smart_home/web

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apt-get update \
    && apt-get install -y netcat

COPY ./req.txt /usr/src/req.txt
RUN pip3 install --upgrade pip
RUN pip3 install -r /usr/src/req.txt
RUN python3 -m pip install daphne

COPY . $APP_HOME

RUN chown -R smart_home:smart_home $APP_HOME

USER smart_home

RUN mkdir media
RUN touch files/devices.yml
