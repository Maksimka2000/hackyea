# HubMI web (Next.js). Build context is web/. Used by the docker-compose.yml in the repository root.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
# These are read while building: NEXT_PUBLIC_* are inlined into the browser code and API_ORIGIN into the /api proxy rules,
# so changing them means rebuilding the image.
ARG API_ORIGIN=http://localhost:8081
ARG NEXT_PUBLIC_API_MODE=live
ARG NEXT_PUBLIC_API_MODE_MATCHING=live
ARG NEXT_PUBLIC_API_MODE_INNOVATION_DETAIL=live
ARG NEXT_PUBLIC_API_MODE_INNOVATION_LIST=live
ARG NEXT_PUBLIC_API_BASE_URL=/api
ENV API_ORIGIN=$API_ORIGIN \
    NEXT_PUBLIC_API_MODE=$NEXT_PUBLIC_API_MODE \
    NEXT_PUBLIC_API_MODE_MATCHING=$NEXT_PUBLIC_API_MODE_MATCHING \
    NEXT_PUBLIC_API_MODE_INNOVATION_DETAIL=$NEXT_PUBLIC_API_MODE_INNOVATION_DETAIL \
    NEXT_PUBLIC_API_MODE_INNOVATION_LIST=$NEXT_PUBLIC_API_MODE_INNOVATION_LIST \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
