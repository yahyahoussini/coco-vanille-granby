# syntax=docker/dockerfile:1
# Coco Vanille · one image, three roles (17 §1.1), chosen at run time with APP_ROLE:
#   web     public site  cocovanillegranby.com        node server.js on :3000
#   studio  Coco Studio  admin.cocovanillegranby.com  node server.js on :3001
#   worker  jobs         npm run worker               no port
# One-shot jobs use the same image with a command: `npm run migrate`, `npm run seed`.
#
# Build from apps/web. `next build` prerenders the site pages (generateStaticParams + ISR),
# so it needs a Postgres that already has the schema and the seed — a throwaway CI database,
# never production. Pass it one of two ways:
#   docker build --network host --build-arg BUILD_DATABASE_URI=postgres://cv:cv@127.0.0.1:5432/coco_ci -t coco .
#   docker build --network host --secret id=build_database_uri,env=BUILD_DATABASE_URI -t coco .
# The build arg is recorded in the image history: fine for a disposable CI database, use the
# secret for anything else. Values baked at build time (CI seed data, PUBLISH_GUARD=strict,
# ENABLE_ES=false) only fill the first ISR copy of each page; the first revalidation (5 min)
# re-renders with the runtime env, and deploy.sh warms every sitemap URL before the switch.

ARG NODE_IMAGE=node:22-slim

FROM ${NODE_IMAGE} AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Production dependencies: the Payload CLI (migrate, worker, seed) needs the full tree, not
# only what the standalone trace keeps. The swc compilers are build-only (the trace drops them).
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund \
 && rm -rf node_modules/@next/swc-*

FROM base AS build
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund
COPY . .
ARG BUILD_DATABASE_URI=""
ARG GIT_SHA=dev
ARG PUBLISH_GUARD=strict
ARG ENABLE_ES=false
ENV GIT_SHA=${GIT_SHA} PUBLISH_GUARD=${PUBLISH_GUARD} ENABLE_ES=${ENABLE_ES} \
    PAYLOAD_CONFIG_PATH=src/payload.config.js
RUN --mount=type=secret,id=build_database_uri \
    if [ -s /run/secrets/build_database_uri ]; then DATABASE_URI="$(cat /run/secrets/build_database_uri)"; \
    else DATABASE_URI="$BUILD_DATABASE_URI"; fi \
 && if [ -z "$DATABASE_URI" ]; then echo 'BUILD_DATABASE_URI is required: next build prerenders pages from a seeded Postgres (see the header).' >&2; exit 1; fi \
 && export DATABASE_URI \
 && export PAYLOAD_SECRET="$(node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))")" \
 && mkdir -p public \
 && npx next build \
 && rm -f .next/standalone/.env

FROM base AS runtime
ARG GIT_SHA=dev
LABEL org.opencontainers.image.title="coco-vanille-web" \
      org.opencontainers.image.description="Pâtisserie Coco Vanille: public site, Coco Studio and worker (APP_ROLE)" \
      org.opencontainers.image.revision="${GIT_SHA}"
# tini reaps zombies and forwards signals to the npm/payload process group (worker, migrate).
# jemalloc: sharp's guidance for glibc, against memory fragmentation from image work.
RUN apt-get update \
 && apt-get install -y --no-install-recommends tini ca-certificates libjemalloc2 \
 && rm -rf /var/lib/apt/lists/* \
 && ln -s "$(find /usr/lib -name libjemalloc.so.2 | head -n 1)" /usr/local/lib/libjemalloc.so.2
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    APP_ROLE=web \
    PAYLOAD_CONFIG_PATH=src/payload.config.js \
    LD_PRELOAD=/usr/local/lib/libjemalloc.so.2 \
    GIT_SHA=${GIT_SHA}

# Code and dependencies stay root-owned (read-only for the app user). Writable: .next (ISR
# rewrites prerendered pages, the image optimiser caches) and media (Payload uploads, staticDir
# "media", bind-mounted by compose so nginx can serve /media/ from disk).
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/package.json /app/jsconfig.json ./
COPY --from=build /app/.next/standalone/server.js ./server.js
COPY --from=build --chown=node:node /app/.next/standalone/.next ./.next
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/scripts/docker-entrypoint.sh /app/scripts/healthcheck.mjs ./scripts/
RUN mkdir -p media .next/cache && chown node:node media .next/cache

USER node
EXPOSE 3000 3001
HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=3 \
  CMD ["node", "scripts/healthcheck.mjs"]
ENTRYPOINT ["/usr/bin/tini", "-g", "--", "/app/scripts/docker-entrypoint.sh"]
