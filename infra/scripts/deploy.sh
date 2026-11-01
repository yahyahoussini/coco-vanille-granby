#!/usr/bin/env bash
# Blue/green deploy of one image tag to one environment, on one host (17 §4). Run as the deploy user:
#   bash /opt/coco/releases/<sha>/scripts/deploy.sh <production|staging> <image-tag>
# CI (deploy-staging.yml, deploy-prod.yml) ships infra/ to /opt/coco/releases/<sha>/ first.
# Steps: checks → pull → Postgres → pre-migration dump → migrate → start the idle colour on its own
# ports → wait for /svc/health/ → warm every sitemap URL → switch the nginx upstream include → reload
# → worker on the new tag → previous colour kept for a quick rollback (rollback.sh), then stopped.
# Any failure before the switch leaves the live colour untouched. Safe to re-run with the same tag.
# Tunables (env): HEALTH_TIMEOUT=180 · ISR_REVALIDATE_SECONDS=300 · KEEP_PREVIOUS_MINUTES=10 · SKIP_BACKUP=0
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
release="$(cd "$here/.." && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
TAG="${2:-}"
require_env_name "$ENV_NAME"
[[ "$TAG" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]] || die "usage: deploy.sh <production|staging> <image-tag>"
dir="$(env_dir "$ENV_NAME")"
ISR_REVALIDATE_SECONDS="${ISR_REVALIDATE_SECONDS:-300}"
KEEP_PREVIOUS_MINUTES="${KEEP_PREVIOUS_MINUTES:-10}"

step "Checking ${ENV_NAME} (${dir})"
require_cmd docker curl flock
[ -f "$dir/.env" ] || die "$dir/.env is missing: copy infra/.env.example, fill it in, chmod 600"
perms="$(stat -c %a "$dir/.env")"
case "$perms" in 600 | 400) ;; *) die "$dir/.env must be chmod 600 (it is $perms)" ;; esac
[ -f "$release/docker-compose.yml" ] || die "no docker-compose.yml in the release folder $release"
image="$(env_get IMAGE ghcr.io/yahyahoussini/coco-vanille-granby)"
public_host="$(env_get PUBLIC_HOST)"
[ -n "$public_host" ] || die "PUBLIC_HOST is not set in $dir/.env"
mkdir -p "$dir/media" "$dir/backups" "$dir/reports"
touch "$dir/state.env"
info "image ${image}:${TAG} · release ${release}"

exec 9>"$dir/.deploy.lock"
flock -n 9 || die "another deploy or rollback is running for ${ENV_NAME}"

live="$(state_get LIVE_COLOR)"
if [ "$live" = blue ]; then target=green; else target=blue; fi
TARGET_KEY="$(upper "$target")_TAG"
web_port="$(port_of web "$target")"
studio_port="$(port_of studio "$target")"
info "live colour: ${live:-none yet} → deploying to ${target} (web :${web_port}, studio :${studio_port})"

switched=0
on_exit() {
  local code=$?
  if [ "$code" -ne 0 ] && [ "$switched" -eq 0 ]; then
    warn "deploy aborted before the switch: ${live:-nothing} stays live, stopping ${target}"
    compose --profile "$target" logs --tail 40 "web-$target" "studio-$target" 2>/dev/null || true
    compose --profile "$target" stop "web-$target" "studio-$target" 2>/dev/null || true
  fi
}
trap on_exit EXIT

step "Installing this release's compose file"
if [ -f "$dir/docker-compose.yml" ]; then cp -p "$dir/docker-compose.yml" "$dir/docker-compose.previous.yml"; fi
cp "$release/docker-compose.yml" "$dir/docker-compose.yml"

step "Pulling ${image}:${TAG}"
if ! docker pull "${image}:${TAG}"; then
  docker image inspect "${image}:${TAG}" >/dev/null 2>&1 || die "image ${image}:${TAG} not found (registry login? see infra/README.md)"
  warn "pull failed; using the local copy of ${image}:${TAG}"
fi

step "Starting Postgres"
compose up -d db
wait_service_healthy db 90 || die "Postgres did not become healthy"
info "db healthy"

step "Pre-migration backup"
if [ "${SKIP_BACKUP:-0}" = 1 ]; then
  info "skipped (SKIP_BACKUP=1)"
elif [ -z "$live" ]; then
  info "first deploy: nothing to back up yet"
else
  bash "$here/backup.sh" "$ENV_NAME" --label "pre-${TAG:0:12}"
fi

step "Migrating (expand-only: the live colour keeps serving meanwhile)"
DEPLOY_TAG="$TAG" compose --profile ops run --rm migrate

# Both colours run side by side for a while (2 x 768 MB at most, compose mem_limit): on a server shared with other
# apps, start the new one only with that much memory free (MIN_FREE_MB_DEPLOY to change the floor).
avail_mb=$(($(awk '/^MemAvailable:/ {print $2}' /proc/meminfo) / 1024))
[ "$avail_mb" -ge "${MIN_FREE_MB_DEPLOY:-1700}" ] || die "only ${avail_mb} MB of memory available: starting ${target} beside ${live:-nothing} could squeeze the server's other apps"
info "memory available: ${avail_mb} MB"

step "Starting ${target} on ${TAG}"
state_set "$TARGET_KEY" "$TAG"
compose --profile "$target" up -d --no-deps --force-recreate "web-$target" "studio-$target"

step "Waiting for health (Docker health checks + /svc/health/ with the database)"
wait_healthy "$target" || die "${target} is not healthy"

step "Warming the page cache before any visitor or crawler sees ${target}"
# The image holds pages prerendered at build time (CI seed data). Under ISR a page older than its
# revalidate period is re-rendered on the next request: wait until the build is that old, request
# every URL once (re-render from this environment's database), then check every URL answers 200.
created="$(docker image inspect -f '{{.Created}}' "${image}:${TAG}")"
age=$(($(date +%s) - $(date -d "$created" +%s)))
if [ "$age" -lt "$ISR_REVALIDATE_SECONDS" ]; then
  wait_for=$((ISR_REVALIDATE_SECONDS - age + 5))
  info "build-time pages are ${age} s old; waiting ${wait_for} s so the warm-up re-renders them"
  sleep "$wait_for"
fi
http_status "$web_port" "$public_host" /sitemap.xml >/dev/null
sleep 3
sitemap="$(curl -s --max-time 30 -H "Host: ${public_host}" -H 'X-Forwarded-Proto: https' "http://127.0.0.1:${web_port}/sitemap.xml" || true)"
# Under PUBLISH_GUARD=strict the sitemap lists only the pages whose facts are all in (none at all while the
# owner has not answered « Faits du site »): those must answer 200. Both home pages are warmed in any case and
# must answer 200 only when the sitemap lists them, so Studio can go live before the public pages do.
mapfile -t paths < <(printf '%s\n' "$sitemap" | grep -o '<loc>[^<]*</loc>' | sed -e 's#<loc>https\?://[^/]*##' -e 's#</loc>##' | awk 'NF && !seen[$0]++')
for path in / /en/ "${paths[@]}"; do http_status "$web_port" "$public_host" "$path" >/dev/null; done
if [ "${#paths[@]}" -eq 0 ]; then
  warn "the sitemap lists no page: strict mode serves none until the owner's facts are in (Studio › Plus › Faits du site)"
fi
info "${#paths[@]} URLs in the sitemap"
sleep 5
failed=()
for path in "${paths[@]}"; do
  code="$(http_status "$web_port" "$public_host" "$path")"
  tries=1
  while [ "$code" != 200 ] && [ "$tries" -lt 4 ]; do
    sleep 3
    code="$(http_status "$web_port" "$public_host" "$path")"
    tries=$((tries + 1))
  done
  if [ "$code" != 200 ]; then failed+=("${code} ${path}"); fi
done
if [ "${#failed[@]}" -gt 0 ]; then
  printf '    %s\n' "${failed[@]}" >&2
  die "${#failed[@]} URL(s) do not answer 200 on ${target}: not switching"
fi
info "all ${#paths[@]} URLs answer 200"

step "Switching nginx to ${target}"
switch_upstream "$target"
switched=1
state_set PREVIOUS_COLOR "$live"
state_set LIVE_COLOR "$target"
state_set DEPLOYED_TAG "$TAG"
state_set DEPLOYED_AT "$(date -u +%FT%TZ)"
ln -sfn "$release" "$dir/infra"

step "Worker on ${TAG}"
state_set WORKER_TAG "$TAG"
compose up -d --no-deps --force-recreate worker

step "Previous colour"
if [ -n "$live" ] && [ "$live" != "$target" ]; then
  retire_later "$live" "$KEEP_PREVIOUS_MINUTES"
else
  info "none (first deploy)"
fi

step "Done"
info "${ENV_NAME}: ${target} live on ${TAG}. Rollback: bash ${dir}/infra/scripts/rollback.sh ${ENV_NAME}"
