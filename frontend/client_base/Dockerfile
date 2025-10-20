FROM node:18

WORKDIR /client

ARG REACT_APP_WS_HOST

COPY . /client

RUN npm install npm -g
RUN npm config set fetch-timeout 600000
RUN npm install --silent
RUN npm run build