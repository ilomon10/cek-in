# syntax=docker.io/docker/dockerfile:1
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# RUN corepack enable pnpm && pnpm i --frozen-lockfile;
RUN yarn global add turbo@2.5.6
COPY . .

RUN turbo prune web --docker

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/out/json/ .
COPY ./apps/api/src/payload-types.ts ./apps/api/src/payload-types.ts

RUN corepack enable pnpm 
RUN pnpm install
COPY --from=deps /app/out/full/ .
RUN pnpm turbo build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY --from=deps ./node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/web/server.js"]