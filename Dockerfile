# Build stage
FROM oven/bun:1.2.13-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY packages/emails/package.json ./packages/emails/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build web app
ENV NODE_ENV=production
RUN bun run build

# Production stage for web app
FROM oven/bun:1.2.13-alpine AS web

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "apps/web/server.js"]
