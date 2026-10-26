# shellcheck shell=bash
# Shared helpers for the infra scripts (sourced, not run). Layout on the VPS:
#   /opt/coco/<env>/            .env (secrets, 600) · state.env (live colour + tags) · docker-compose.yml
#                               media/ · backups/ · reports/ · infra -> ../releases/<sha> (live release)
#   /opt/coco/releases/<sha>/   this infra/ folder, as shipped by CI for that commit
#   /etc/nginx/coco/upstreams/<env>.conf   which colour nginx sends traffic to (deploy.sh rewrites it)
# <env> is "production" or "staging". COCO_ROOT and NGINX_COCO_DIR can be overridden for tests.

COCO_ROOT="${COCO_ROOT:-/opt/coco}"
NGINX_COCO_DIR="${NGINX_COCO_DIR:-/etc/nginx/coco}"
# How nginx is checked and reloaded (the deploy user has sudo for exactly these; harden-vps.sh).
NGINX_TEST_CMD="${NGINX_TEST_CMD:-sudo -n /usr/sbin/nginx -t -q}"
NGINX_RELOAD_CMD="${NGINX_RELOAD_CMD:-sudo -n /usr/bin/systemctl reload nginx}"

step() { printf '\n==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  local cmd
  for cmd in "$@"; do
    command -v "$cmd" >/dev/null 2>&1 || die "missing command: $cmd"
  done
}

require_env_name() {
  case "${1:-}" in
    production | staging) ;;
    *) die "environment must be production or staging (got '${1:-}')" ;;
  esac
}

env_dir() { printf '%s/%s' "$COCO_ROOT" "$1"; }

# Reads KEY from a KEY=VALUE file without executing it (secrets may hold shell characters).
# Last assignment wins; surrounding single or double quotes are dropped.
file_get() {
  local file="$1" key="$2" default="${3:-}" line value
  value=""
  if [ -f "$file" ]; then
    line="$(grep -E "^${key}=" "$file" | tail -n 1 || true)"
    value="${line#*=}"
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
  fi
  printf '%s' "${value:-$default}"
}

env_get() { file_get "$(env_dir "$ENV_NAME")/.env" "$1" "${2:-}"; }
state_get() { file_get "$(env_dir "$ENV_NAME")/state.env" "$1" "${2:-}"; }

# Rewrites one KEY=VALUE in state.env (atomic: temp file + mv).
state_set() {
  local file key="$1" value="$2" tmp
  file="$(env_dir "$ENV_NAME")/state.env"
  touch "$file"
  tmp="$(mktemp "${file}.XXXXXX")"
  grep -v -E "^${key}=" "$file" >"$tmp" || true
  printf '%s=%s\n' "$key" "$value" >>"$tmp"
  mv "$tmp" "$file"
}

compose() {
  local dir
  dir="$(env_dir "$ENV_NAME")"
  docker compose -p "coco-${ENV_NAME}" --project-directory "$dir" -f "$dir/docker-compose.yml" \
    --env-file "$dir/.env" --env-file "$dir/state.env" "$@"
}

other_colour() {
  if [ "$1" = blue ]; then printf green; else printf blue; fi
}

# Host port of a role for a colour, from .env (defaults match infra/.env.example).
port_of() {
  local role="$1" colour="$2" key default
  key="$(printf '%s_%s_PORT' "$role" "$colour" | tr '[:lower:]' '[:upper:]')"
  case "$ENV_NAME:$role:$colour" in
    production:web:blue) default=3001 ;;
    production:studio:blue) default=3002 ;;
    production:web:green) default=3011 ;;
    production:studio:green) default=3012 ;;
    staging:web:blue) default=3101 ;;
    staging:studio:blue) default=3102 ;;
    staging:web:green) default=3111 ;;
    staging:studio:green) default=3112 ;;
  esac
  env_get "$key" "$default"
}

# Docker health of a compose service's container: healthy | unhealthy | starting | missing.
service_health() {
  local id
  id="$(compose ps -q "$1" 2>/dev/null || true)"
  if [ -z "$id" ]; then
    printf missing
    return
  fi
  docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$id" 2>/dev/null || printf missing
}

# HTTP status of a path on a local port, with the Host header the app routes on.
http_status() {
  local port="$1" host="$2" path="$3"
  curl -s -o /dev/null -w '%{http_code}' --max-time 30 -H "Host: ${host}" -H 'X-Forwarded-Proto: https' \
    -A 'coco-deploy/1' "http://127.0.0.1:${port}${path}" || true
}

# Writes the nginx upstream include for this environment and reloads nginx.
# On a failed `nginx -t` the previous file is put back and nothing is reloaded.
switch_upstream() {
  local colour="$1" file tmp backup web studio
  file="${NGINX_COCO_DIR}/upstreams/${ENV_NAME}.conf"
  web="$(port_of web "$colour")"
  studio="$(port_of studio "$colour")"
  mkdir -p "${NGINX_COCO_DIR}/upstreams"
  tmp="$(mktemp "${file}.XXXXXX")"
  backup="${file}.previous"
  {
    printf '# Written by infra/scripts (deploy.sh / rollback.sh): live colour = %s (%s).\n' "$colour" "$(date -u +%FT%TZ)"
    printf 'upstream coco_%s_web {\n  server 127.0.0.1:%s;\n  keepalive 16;\n}\n' "$ENV_NAME" "$web"
    printf 'upstream coco_%s_studio {\n  server 127.0.0.1:%s;\n  keepalive 8;\n}\n' "$ENV_NAME" "$studio"
  } >"$tmp"
  chmod 644 "$tmp"
  if [ -f "$file" ]; then cp -p "$file" "$backup"; fi
  mv "$tmp" "$file"
  # Word splitting is wanted: the commands carry their arguments.
  # shellcheck disable=SC2086
  if ! $NGINX_TEST_CMD; then
    if [ -f "$backup" ]; then mv "$backup" "$file"; fi
    die "nginx -t failed; upstream file restored, nginx not reloaded"
  fi
  # shellcheck disable=SC2086
  $NGINX_RELOAD_CMD || die "nginx reload failed"
  info "nginx → ${colour} (web :${web}, studio :${studio})"
}

heartbeat() {
  local url="$1"
  if [ -n "$url" ]; then
    curl -fsS -m 10 --retry 3 -o /dev/null "$url" || warn "heartbeat ping failed: $url"
  fi
}

upper() { printf '%s' "$1" | tr '[:lower:]' '[:upper:]'; }

wait_service_healthy() {
  local service="$1" timeout="${2:-60}" start
  start="$(date +%s)"
  until [ "$(service_health "$service")" = healthy ]; do
    if [ $(($(date +%s) - start)) -ge "$timeout" ]; then return 1; fi
    sleep 2
  done
}

# Waits until web-<colour> and studio-<colour> report Docker "healthy" and the web process passes the
# deep health check (/svc/health/ → 200, database up). Returns 1 after HEALTH_TIMEOUT seconds.
wait_healthy() {
  local colour="$1" timeout="${HEALTH_TIMEOUT:-180}" start web_port public_host body=""
  start="$(date +%s)"
  web_port="$(port_of web "$colour")"
  public_host="$(env_get PUBLIC_HOST cocovanillegranby.com)"
  while :; do
    if [ "$(service_health "web-$colour")" = healthy ] && [ "$(service_health "studio-$colour")" = healthy ]; then
      body="$(curl -s --max-time 5 -H "Host: ${public_host}" "http://127.0.0.1:${web_port}/svc/health/" || true)"
      case "$body" in
        *'"ok":true'*'"db":"up"'*)
          info "healthy after $(($(date +%s) - start)) s: $body"
          return 0
          ;;
      esac
    fi
    if [ $(($(date +%s) - start)) -ge "$timeout" ]; then
      warn "web-$colour: $(service_health "web-$colour"), studio-$colour: $(service_health "studio-$colour"), /svc/health/: ${body:-no answer}"
      return 1
    fi
    sleep 3
  done
}

# Detached: stops a colour after some minutes unless it became live again (rollback in between).
retire_later() {
  local colour="$1" minutes="$2" log
  log="$(env_dir "$ENV_NAME")/reports/retire-${colour}.log"
  # 9>&-: the deploy lock (fd 9) must not stay held by the sleeping child.
  setsid nohup bash "$(dirname "${BASH_SOURCE[0]}")/retire.sh" "$ENV_NAME" "$colour" "$minutes" >"$log" 2>&1 </dev/null 9>&- &
  info "previous colour ${colour} stays up ${minutes} min for an instant rollback, then stops (log: ${log})"
}
