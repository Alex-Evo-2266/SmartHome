FROM node:15.4.0-alpine

WORKDIR /client

COPY . /client

RUN npm install --silent
RUN npm run build
