FROM node:16

WORKDIR /client

ARG REACT_APP_WS_HOST

COPY . /client

RUN npm install npm -g

RUN npm install --silent
RUN npm run build
