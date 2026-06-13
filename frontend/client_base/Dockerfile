# --- Сборка фронтенда ---
FROM node:20 AS builder
WORKDIR /app

ARG VITE_SMARTHOME_CLIENT_ID
ARG VITE_API_AUTH
ENV VITE_SMARTHOME_CLIENT_ID=$VITE_SMARTHOME_CLIENT_ID
ENV VITE_API_AUTH=$VITE_API_AUTH

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build

# --- Лёгкий образ для отдачи статики ---
FROM nginx:alpine AS runner
RUN mkdir -p /home/frontend/web
WORKDIR /home/frontend/web

# Копируем собранные файлы
COPY --from=builder /app/dist ./

# Настраиваем nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
