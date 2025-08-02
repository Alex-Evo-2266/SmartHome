# 1. Используем официальный Node.js-образ
FROM node:18-alpine AS deps

# 2. Установка зависимостей
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Сборка приложения
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG CONTAINER_NAME=mqtt_page
ARG PORT=3000
ENV CONTAINER_NAME=$CONTAINER_NAME
ENV PORT=$PORT

ARG NEXT_BASE_PATH
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}

RUN npm run build
RUN mkdir -p config
RUN npm run generate:pages

# 4. Production-слой (минимальный)
FROM node:18-alpine AS runner

# Установим производственные зависимости только
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p config
RUN mkdir -p config_local
COPY --from=builder /app/config ./config_local

# Экспонируем порт (по умолчанию в Next.js — 3000)
# EXPOSE 3009

# Запускаем Next.js в production-режиме
# CMD ["npm", "start"]
