# SKAZKA — Next.js frontend (multi-stage)

# ── base ────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ── dev ─────────────────────────────────────────
FROM base AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── build ───────────────────────────────────────
FROM base AS build
# NEXT_PUBLIC_* o'zgaruvchilar build vaqtida bundle ichiga yoziladi
ARG NEXT_PUBLIC_API_URL=http://localhost/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# CI runner xotirasi cheklangan — V8 heap'ni cheklab OOM-kill o'rniga GC qildiramiz.
# Telemetriyani ham o'chiramiz (build vaqtini va xotirani tejaydi).
ENV NODE_OPTIONS=--max-old-space-size=4096 \
    NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

# ── prod ────────────────────────────────────────
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
