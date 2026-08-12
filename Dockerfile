# Frontend uchun konteyner: build → statik server.
#
# Ikki bosqich, chunki natijada Node ham, node_modules ham kerak emas —
# faqat tayyor fayllar va kichkina Caddy qoladi.

FROM node:22-alpine AS build
WORKDIR /app

# package fayllari alohida ko'chiriladi: kod o'zgarganda ham
# `npm ci` qatlami kesh'dan olinadi.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# `npm run build` = `tsc -b && vite build` — tip xatosi build'ni to'xtatadi.
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
