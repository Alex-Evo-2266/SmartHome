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
RUN npm run build

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

# Экспонируем порт (по умолчанию в Next.js — 3000)
# EXPOSE 3009

# Запускаем Next.js в production-режиме
# CMD ["npm", "start"]
