# --- Сборка фронтенда ---
FROM node:20 AS builder
WORKDIR /app

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
