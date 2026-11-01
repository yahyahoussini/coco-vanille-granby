#!/usr/bin/env bash
# Writes /opt/coco/<env>/.env from infra/.env.example for one pair of host names, with fresh secrets
# (openssl, never printed). Run as the deploy user; safe to run again: the secrets already in the file are kept,
# only the host names and the options below are rewritten.
#   bash infra/scripts/make-env.sh production --public-host cocovanille.<ip-with-dashes>.sslip.io \
#     --admin-host admin-cocovanille.<ip-with-dashes>.sslip.io [--guard strict|show] [--image coco-vanille-web] [--port-base 3000]
# Messages stay in the container log (EMAIL_PROVIDER=log, SMS_PROVIDER=log) and no payment is taken
# (PAYMENT_PROVIDER=none) until the owner's Amazon SES, Twilio and Stripe accounts exist (docs/13).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
require_env_name "$ENV_NAME"
shift
public=""
admin=""
guard=strict
image=coco-vanille-web
# Empty: the ports already in the file stay (a new file has 3001-3012 from .env.example).
port_base=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    --guard) guard="${2:-}"; shift 2 ;;
    --image) image="${2:-}"; shift 2 ;;
    --port-base) port_base="${2:-}"; shift 2 ;;
    *) die "unknown option: $1" ;;
  esac
done
[ -n "$public" ] && [ -n "$admin" ] || die "--public-host and --admin-host are required"
case "$guard" in strict | show) ;; *) die "--guard is strict or show" ;; esac
if [ -n "$port_base" ]; then [[ "$port_base" =~ ^[1-9][0-9]{2,4}$ ]] && [ "$port_base" -le 64000 ] || die "--port-base is a number like 3000"; fi
require_cmd openssl awk

dir="$(env_dir "$ENV_NAME")"
file="$dir/.env"
mkdir -p "$dir"
umask 077
if [ ! -f "$file" ]; then
  cp "$here/../.env.example" "$file"
  info "new $file from .env.example"
fi
chmod 600 "$file"

# KEY=VALUE in place (value passed through the environment: no shell or sed escaping of secrets).
set_kv() {
  local tmp
  tmp="$(mktemp "${file}.XXXXXX")"
  KEY="$1" VALUE="$2" awk 'BEGIN { k = ENVIRON["KEY"]; v = ENVIRON["VALUE"]; done = 0 }
    index($0, k "=") == 1 { if (!done) { print k "=" v; done = 1 } ; next }
    { print }
    END { if (!done) print k "=" v }' "$file" >"$tmp"
  chmod 600 "$tmp"
  mv "$tmp" "$file"
}
keep_or_new() {
  local key="$1" value
  value="$(file_get "$file" "$key")"
  if [ -z "$value" ]; then
    set_kv "$key" "$2"
    info "${key}: generated"
  else
    info "${key}: kept"
  fi
}

keep_or_new POSTGRES_PASSWORD "$(openssl rand -hex 24)"
keep_or_new PAYLOAD_SECRET "$(openssl rand -hex 32)"
keep_or_new REVALIDATE_SECRET "$(openssl rand -hex 32)"
keep_or_new NEXT_SERVER_ACTIONS_ENCRYPTION_KEY "$(openssl rand -base64 32)"

set_kv APP_ENV "$ENV_NAME"
set_kv IMAGE "$image"
set_kv MEDIA_DIR "$dir/media"
set_kv PUBLIC_ORIGIN "https://${public}"
set_kv ADMIN_ORIGIN "https://${admin}"
set_kv PUBLIC_HOSTS "${public},www.${public}"
set_kv ADMIN_HOSTS "$admin"
set_kv PUBLIC_HOST "$public"
set_kv ADMIN_HOST "$admin"
set_kv PUBLISH_GUARD "$guard"
# Same --port-base as setup-shared-host.sh: blue = base + 1 / + 2, green = base + 11 / + 12.
if [ -n "$port_base" ]; then
  set_kv WEB_BLUE_PORT "$((port_base + 1))"
  set_kv STUDIO_BLUE_PORT "$((port_base + 2))"
  set_kv WEB_GREEN_PORT "$((port_base + 11))"
  set_kv STUDIO_GREEN_PORT "$((port_base + 12))"
fi
set_kv SEED_DEMO false
set_kv SEED_DEV_USER false
set_kv PAYMENT_PROVIDER none
set_kv PAYMENT_MOCK off
set_kv EMAIL_PROVIDER log
set_kv SMS_PROVIDER log
info "hosts ${public} · ${admin} · PUBLISH_GUARD=${guard} · image ${image} · ports $(file_get "$file" WEB_BLUE_PORT)/$(file_get "$file" STUDIO_BLUE_PORT) and $(file_get "$file" WEB_GREEN_PORT)/$(file_get "$file" STUDIO_GREEN_PORT) · payments off · messages logged"
