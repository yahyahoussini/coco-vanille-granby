#!/usr/bin/env bash
# Builds the image on the server itself, for a server with no registry image yet (no GitHub Actions run):
#   bash infra/scripts/build-image.sh <production|staging> <source-dir> <tag>     (as Coco's account)
# <source-dir> holds one commit of the repository (`git -c core.autocrlf=false archive <sha>`, unpacked), with
# apps/web inside. Same recipe as .github/workflows/deploy-staging.yml: a throwaway Postgres gets the migrations
# and the verified seed (NODE_ENV=production, no demo data), `next build` prerenders from it, the web role must
# answer its health check, then the throwaway database is removed. The image is tagged <IMAGE>:<tag> locally;
# deploy.sh uses that local copy when the registry has none.
# On a server shared with other apps: nothing here uses the host's network (the dependency install scripts could
# otherwise reach other apps' services on 127.0.0.1); the build waits for enough free memory, volunteers as the
# kernel's first victim if memory runs out (apps/web/Dockerfile) and uses at most 2 prerender workers.
# The Server Actions key is read from /opt/coco/<env>/.env (the same key in the build and at run time, 17 §2).
# Tunables (env): SMOKE_PORT=3999 · NEXT_BUILD_WORKERS · NODE_IMAGE=node:22-slim · MIN_FREE_MB=2500 · MIN_DISK_GB=6
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
smoke_port="${SMOKE_PORT:-3999}"
node_image="${NODE_IMAGE:-node:22-slim}"
db="coco-build-db-${TAG:0:12}"
smoke="coco-build-smoke-${TAG:0:12}"
pass="$(openssl rand -hex 16)"
# 1 prerender worker on a 1-2 vCPU server, 2 above.
workers="${NEXT_BUILD_WORKERS:-$(if [ "$(nproc)" -le 2 ]; then echo 1; else echo 2; fi)}"
cpus="$(awk -v n="$(nproc)" 'BEGIN { print (n > 1.5 ? 1.5 : n) }')"

cleanup() { docker rm -fv "$db" "$smoke" >/dev/null 2>&1 || true; }
trap cleanup EXIT
cleanup

# A build takes about 2-3 GB of memory and a few GB of disk for a few minutes. On a server that also serves other
# sites, refuse to start when that would squeeze them.
avail_mb=$(($(awk '/^MemAvailable:/ {print $2}' /proc/meminfo) / 1024))
disk_gb=$(($(df -Pk / | awk 'NR == 2 {print $4}') / 1024 / 1024))
info "memory available ${avail_mb} MB · disk free ${disk_gb} GB · ${workers} prerender worker(s)"
[ "$avail_mb" -ge "${MIN_FREE_MB:-2500}" ] || die "only ${avail_mb} MB of memory available: the build could slow the other sites down (add swap, or build when the server is quiet)"
[ "$disk_gb" -ge "${MIN_DISK_GB:-6}" ] || die "only ${disk_gb} GB free on /: free some space first"

# Secrets reach the containers by name (-e NAME, value from this script's environment), never on a command line
# that `ps` would show to the server's other accounts.
export POSTGRES_PASSWORD="$pass" PAYLOAD_SECRET="build-${TAG:0:12}"

step "Throwaway build database (Docker's default network, no published port)"
docker run -d --name "$db" -e POSTGRES_USER=cv -e POSTGRES_PASSWORD -e POSTGRES_DB=coco_build \
  --tmpfs /var/lib/postgresql/data postgres:16 >/dev/null
for _ in $(seq 1 45); do
  if docker exec "$db" pg_isready -U cv -d coco_build >/dev/null 2>&1; then break; fi
  sleep 2
done
docker exec "$db" pg_isready -U cv -d coco_build >/dev/null || die "the build database did not start"
db_ip="$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$db")"
[ -n "$db_ip" ] || die "the build database has no address on Docker's default network"
info "ready at ${db_ip}"

step "Migrations and the verified seed (NODE_ENV=production)"
# In the database's own network namespace: 127.0.0.1 is the build database, never one of the host's services.
DATABASE_URI="postgres://cv:${pass}@127.0.0.1:5432/coco_build" \
  docker run --rm --network "container:${db}" --memory 1536m --cpus "$cpus" -v "$src/apps/web:/src:ro" \
  -e DATABASE_URI -e PAYLOAD_SECRET -e PAYLOAD_CONFIG_PATH=src/payload.config.js -e NEXT_TELEMETRY_DISABLED=1 "$node_image" sh -ec '
    echo 1000 >/proc/self/oom_score_adj 2>/dev/null || true
    mkdir -p /work && cp -a /src/. /work && cd /work
    npm ci --no-audit --no-fund --loglevel=error
    NODE_ENV=production npm run --silent migrate
    NODE_ENV=production npm run --silent seed'
info "seeded"

step "docker build ${image}:${TAG}"
export BUILD_DATABASE_URI="postgres://cv:${pass}@${db_ip}:5432/coco_build"
secrets=(--secret id=build_database_uri,env=BUILD_DATABASE_URI)
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY="$(env_get NEXT_SERVER_ACTIONS_ENCRYPTION_KEY)"
if [ -n "$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY" ]; then
  export NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
  secrets+=(--secret id=server_actions_key,env=NEXT_SERVER_ACTIONS_ENCRYPTION_KEY)
else
  warn "no NEXT_SERVER_ACTIONS_ENCRYPTION_KEY in the .env: open Studio forms break at each deploy"
fi
# Default (bridge) network for the build steps: they reach the build database by its address, not the host.
DOCKER_BUILDKIT=1 docker build "${secrets[@]}" \
  --build-arg GIT_SHA="$TAG" --build-arg DEPLOYMENT_ID="$TAG" --build-arg NEXT_BUILD_WORKERS="$workers" \
  -t "${image}:${TAG}" "$src/apps/web"

step "Smoke test: the web role answers its health check"
DATABASE_URI="postgres://cv:${pass}@${db_ip}:5432/coco_build" \
  docker run -d --name "$smoke" -p "127.0.0.1:${smoke_port}:3000" --memory 768m -e APP_ROLE=web \
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
