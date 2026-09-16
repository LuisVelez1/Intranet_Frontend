# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to cache the installation layer.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the project and run its configured production build.
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy build artifacts and install production dependencies.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

EXPOSE 4000

# Start Angular's SSR server. See README for the existing build/runtime mismatch.
CMD ["node", "dist/intranet-frontend/server/server.mjs"]
