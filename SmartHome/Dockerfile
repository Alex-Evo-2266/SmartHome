FROM python:3.8

ENV PYTHONDONTRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/smart_home

COPY ./req.txt /usr/src/req.txt
RUN pip install --upgrade pip
RUN pip install -r /usr/src/req.txt

COPY . /usr/src/smart_home
