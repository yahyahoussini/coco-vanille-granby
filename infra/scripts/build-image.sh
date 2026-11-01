#!/usr/bin/env bash
# Builds the image on the server itself, for a server with no registry image yet (no GitHub Actions run):
#   bash infra/scripts/build-image.sh <production|staging> <source-dir> <tag>     (as the deploy user)
# <source-dir> holds one commit of the repository (`git -c core.autocrlf=false archive <sha>`, unpacked), with
# apps/web inside. Same recipe as .github/workflows/deploy-staging.yml: a throwaway Postgres gets the migrations
# and the verified seed (NODE_ENV=production, no demo data), `next build` prerenders from it, the web role must
# answer its health check, then the throwaway database is removed. The image is tagged <IMAGE>:<tag> locally;
# deploy.sh uses that local copy when the registry has none.
# The Server Actions key is read from /opt/coco/<env>/.env (the same key in the build and at run time, 17 §2).
# Tunables (env): BUILD_DB_PORT=55432 · SMOKE_PORT=3999 · NEXT_BUILD_WORKERS=2 · NODE_IMAGE=node:22-slim
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
src="${2:-}"
TAG="${3:-}"
require_env_name "$ENV_NAME"
[ -n "$src" ] && [ -f "$src/apps/web/Dockerfile" ] || die "usage: build-image.sh <env> <source-dir> <tag> (no apps/web/Dockerfile in '${src}')"
[[ "$TAG" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]] || die "invalid tag: '${TAG}'"
require_cmd docker openssl curl
image="$(env_get IMAGE coco-vanille-web)"
port="${BUILD_DB_PORT:-55432}"
smoke_port="${SMOKE_PORT:-3999}"
node_image="${NODE_IMAGE:-node:22-slim}"
db="coco-build-db-${TAG:0:12}"
smoke="coco-build-smoke-${TAG:0:12}"
pass="$(openssl rand -hex 16)"
uri="postgres://cv:${pass}@127.0.0.1:${port}/coco_build"

cleanup() { docker rm -f "$db" "$smoke" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup

# A build takes about 2-3 GB of memory and a few GB of disk for a few minutes. On a server that also serves other
# sites, refuse to start when that would squeeze them (MIN_FREE_MB / MIN_DISK_GB to change the floor).
avail_mb=$(($(awk '/^MemAvailable:/ {print $2}' /proc/meminfo) / 1024))
disk_gb=$(($(df -Pk / | awk 'NR == 2 {print $4}') / 1024 / 1024))
info "memory available ${avail_mb} MB · disk free ${disk_gb} GB"
[ "$avail_mb" -ge "${MIN_FREE_MB:-2500}" ] || die "only ${avail_mb} MB of memory available: the build could slow the other sites down (add swap, or build when the server is quiet)"
[ "$disk_gb" -ge "${MIN_DISK_GB:-6}" ] || die "only ${disk_gb} GB free on /: free some space first"

# Secrets reach the containers by name (-e NAME, value from this script's environment), never on a command line
# that `ps` would show to the server's other accounts.
export POSTGRES_PASSWORD="$pass" DATABASE_URI="$uri" PAYLOAD_SECRET="build-${TAG:0:12}"
cpus="$(awk -v n="$(nproc)" 'BEGIN { print (n > 1.5 ? 1.5 : n) }')"

step "Throwaway build database (127.0.0.1:${port})"
docker run -d --name "$db" -e POSTGRES_USER=cv -e POSTGRES_PASSWORD -e POSTGRES_DB=coco_build \
  -p "127.0.0.1:${port}:5432" --tmpfs /var/lib/postgresql/data postgres:16 >/dev/null
for _ in $(seq 1 45); do
  if docker exec "$db" pg_isready -U cv -d coco_build >/dev/null 2>&1; then break; fi
  sleep 2
done
docker exec "$db" pg_isready -U cv -d coco_build >/dev/null || die "the build database did not start"
info "ready"

step "Migrations and the verified seed (NODE_ENV=production)"
docker run --rm --network host --memory 1536m --cpus "$cpus" -v "$src/apps/web:/src:ro" -e DATABASE_URI -e PAYLOAD_SECRET \
  -e PAYLOAD_CONFIG_PATH=src/payload.config.js -e NEXT_TELEMETRY_DISABLED=1 "$node_image" sh -ec '
    mkdir -p /work && cp -a /src/. /work && cd /work
    npm ci --no-audit --no-fund --loglevel=error
    NODE_ENV=production npm run --silent migrate
    NODE_ENV=production npm run --silent seed'
info "seeded"

step "docker build ${image}:${TAG}"
export BUILD_DATABASE_URI="$uri"
secrets=(--secret id=build_database_uri,env=BUILD_DATABASE_URI)
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="$(env_get NEXT_SERVER_ACTIONS_ENCRYPTION_KEY)"
if [ -n "$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY" ]; then
  export NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
  secrets+=(--secret id=server_actions_key,env=NEXT_SERVER_ACTIONS_ENCRYPTION_KEY)
else
  warn "no NEXT_SERVER_ACTIONS_ENCRYPTION_KEY in the .env: open Studio forms break at each deploy"
fi
DOCKER_BUILDKIT=1 docker build --network host "${secrets[@]}" \
  --build-arg GIT_SHA="$TAG" --build-arg DEPLOYMENT_ID="$TAG" --build-arg NEXT_BUILD_WORKERS="${NEXT_BUILD_WORKERS:-2}" \
  -t "${image}:${TAG}" "$src/apps/web"

step "Smoke test: the web role answers its health check"
# HOSTNAME=127.0.0.1: on the host network the test server must not listen on the public address.
docker run -d --name "$smoke" --network host --memory 768m -e APP_ROLE=web -e PORT="$smoke_port" -e HOSTNAME=127.0.0.1 \
  -e DATABASE_URI -e PAYLOAD_SECRET "${image}:${TAG}" >/dev/null
ok=0
for _ in $(seq 1 45); do
  if curl -fsS -m 5 -H 'Host: localhost' "http://127.0.0.1:${smoke_port}/svc/health/" >/dev/null 2>&1; then ok=1; break; fi
  sleep 2
done
if [ "$ok" != 1 ]; then
  docker logs --tail 60 "$smoke" >&2 || true
  die "the image did not answer /svc/health/"
fi
info "healthy"

step "Built ${image}:${TAG}"
docker image ls "${image}:${TAG}" --format '    {{.Repository}}:{{.Tag}}  {{.Size}}  {{.CreatedSince}}'
