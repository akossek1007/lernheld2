# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Production stage ─────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Note: Railway manages volumes via its web UI, so we do not use the VOLUME keyword here.

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Vite build output & server build output
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server

ENV NODE_ENV=production
ENV DATABASE_PATH=/data/lernheld.db

EXPOSE 3000

CMD ["npm", "start"]
