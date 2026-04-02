# Stage 1: Встановлення залежностей
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json./
RUN npm ci --frozen-lockfile

# Stage 2: Збирання проєкту
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules./node_modules
COPY..
RUN npm run build

# Stage 3: Фінальний образ для запуску
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
# Використання не-root користувача для безпеки
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public./public
COPY --from=builder /app/.next/standalone./
COPY --from=builder /app/.next/static./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
