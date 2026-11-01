#!/usr/bin/env bash
# Installs infra/nginx on the VPS (run with sudo from a release folder, idempotent):
#   sudo bash /opt/coco/releases/<sha>/scripts/install-nginx.sh                  configs only
#   sudo bash …/install-nginx.sh --issue-certs you@example.com                     + Let's Encrypt
#   sudo bash …/install-nginx.sh --issue-certs you@example.com --no-staging        without the staging pair
# A server that hosts other sites, on a temporary address (render-sites.sh explains each option):
#   sudo bash …/install-nginx.sh --shared --no-staging --temporary \
#     --public-host cocovanille.<ip-with-dashes>.sslip.io --admin-host admin-cocovanille.<ip-with-dashes>.sslip.io \
#     --issue-certs you@example.com
# --shared leaves the other sites alone: no default_server is installed and Ubuntu's default site is kept.
# First run: TLS starts with a self-signed certificate (so nginx can start and answer the ACME
# challenge on port 80); --issue-certs then gets one certificate for every name (webroot), links it
# and adds a renewal hook that reloads nginx. Staging basic auth: STAGING_AUTH_USER and
# STAGING_AUTH_PASSWORD (asked for when missing and no htpasswd exists yet).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src="$(cd "$here/../nginx" && pwd)"
email=""
staging=1
shared=0
temporary=0
public=cocovanillegranby.com
admin=admin.cocovanillegranby.com
while [ "$#" -gt 0 ]; do
  case "$1" in
    --issue-certs) email="${2:-}"; shift 2 ;;
    --no-staging) staging=0; shift ;;
    --shared) shared=1; shift ;;
    --temporary) temporary=1; shift ;;
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 64 ;;
  esac
done
step() { printf '\n==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
[ "$(id -u)" = 0 ] || { echo "run with sudo" >&2; exit 1; }
command -v nginx >/dev/null || { echo "nginx is not installed (harden-vps.sh or setup-shared-host.sh installs it)" >&2; exit 1; }

coco=/etc/nginx/coco
deploy_user="${DEPLOY_USER:-deploy}"
names=("$public" "www.$public" "$admin")
if [ "$staging" = 1 ]; then names+=("staging.$public" "admin-staging.$public"); fi
cert_name="$public"

step "Folders"
install -d -m 755 "$coco" "$coco/tls" /var/www/certbot /var/www/coco
install -d -m 755 -o "$deploy_user" -g "$deploy_user" "$coco/upstreams"
info "$coco/upstreams is writable by ${deploy_user} (deploy.sh switches colours there)"

step "Configs for ${public} and ${admin}"
install -m 644 "$src/conf.d/coco.conf" /etc/nginx/conf.d/coco.conf
install -m 644 "$src"/snippets/*.conf /etc/nginx/snippets/
install -m 644 "$src/html/50x.html" /var/www/coco/50x.html
rendered="$(mktemp -d)"
trap 'rm -rf "$rendered"' EXIT
flags=(--public-host "$public" --admin-host "$admin")
if [ "$temporary" = 1 ]; then flags+=(--temporary); fi
if [ "$staging" = 0 ]; then flags+=(--no-staging); fi
if [ "$shared" = 1 ]; then flags+=(--shared); fi
bash "$here/render-sites.sh" "$rendered" "${flags[@]}" >/dev/null
# Files from an earlier layout or an option turned off since (only Coco's own names are touched).
for old in cocovanillegranby.com.conf admin.cocovanillegranby.com.conf staging.cocovanillegranby.com.conf 00-default.conf \
  coco-public.conf coco-admin.conf coco-staging.conf 00-coco-default.conf; do
  if [ ! -f "$rendered/$old" ]; then rm -f "/etc/nginx/sites-enabled/$old" "/etc/nginx/sites-available/$old"; fi
done
for site in "$rendered"/*.conf; do
  name="$(basename "$site")"
  install -m 644 "$site" "/etc/nginx/sites-available/$name"
  ln -sfn "/etc/nginx/sites-available/$name" "/etc/nginx/sites-enabled/$name"
  info "$name"
done
if [ "$temporary" = 1 ]; then info "temporary address: the public host answers noindex"; fi
if [ "$shared" = 1 ]; then
  info "shared server: no default_server installed, the other sites are untouched"
else
  # Ubuntu's default site also claims default_server.
  rm -f /etc/nginx/sites-enabled/default
fi

step "Upstreams (blue until the first deploy)"
for env in production staging; do
  file="$coco/upstreams/$env.conf"
  if [ ! -f "$file" ]; then
    if [ "$env" = production ]; then web=3001 studio=3002; else web=3101 studio=3102; fi
    printf 'upstream coco_%s_web {\n  server 127.0.0.1:%s;\n  keepalive 16;\n}\nupstream coco_%s_studio {\n  server 127.0.0.1:%s;\n  keepalive 8;\n}\n' \
      "$env" "$web" "$env" "$studio" >"$file"
    chown "$deploy_user:$deploy_user" "$file"
    info "created $file"
  else
    info "kept $file"
  fi
done

step "Staging basic auth"
if [ "$staging" = 0 ]; then
  info "skipped (--no-staging)"
elif [ -s "$coco/staging.htpasswd" ]; then
  info "kept $coco/staging.htpasswd"
else
  user="${STAGING_AUTH_USER:-}"
  pass="${STAGING_AUTH_PASSWORD:-}"
  if [ -z "$user" ]; then read -r -p "    staging user name: " user; fi
  if [ -z "$pass" ]; then read -r -s -p "    staging password: " pass; echo; fi
  if [ -z "$user" ] || [ -z "$pass" ]; then echo "staging user and password are required" >&2; exit 1; fi
  printf '%s:%s\n' "$user" "$(openssl passwd -apr1 "$pass")" >"$coco/staging.htpasswd"
  chown root:www-data "$coco/staging.htpasswd"
  chmod 640 "$coco/staging.htpasswd"
  info "created for ${user}"
fi

step "TLS certificate (${cert_name})"
live="/etc/letsencrypt/live/${cert_name}"
link_cert() {
  ln -sfn "$live/fullchain.pem" "$coco/tls/fullchain.pem"
  ln -sfn "$live/privkey.pem" "$coco/tls/privkey.pem"
}
if [ -s "$live/fullchain.pem" ]; then
  link_cert
  info "Let's Encrypt certificate linked"
elif [ ! -s "$coco/tls/fullchain.pem" ] || [ -L "$coco/tls/fullchain.pem" ]; then
  # No certificate yet for these names (first run, or a change of names): self-signed until --issue-certs.
  rm -f "$coco/tls/fullchain.pem" "$coco/tls/privkey.pem"
  openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj "/CN=${public}" \
    -keyout "$coco/tls/privkey.pem" -out "$coco/tls/fullchain.pem" >/dev/null 2>&1
  chmod 600 "$coco/tls/privkey.pem"
  info "temporary self-signed certificate (run again with --issue-certs once the names point here)"
else
  info "kept the current certificate"
fi

step "nginx -t and reload"
nginx -t
systemctl reload nginx || systemctl restart nginx

if [ -n "$email" ]; then
  step "Let's Encrypt for: ${names[*]}"
  command -v certbot >/dev/null || { echo "certbot is not installed" >&2; exit 1; }
  args=()
  for n in "${names[@]}"; do args+=(-d "$n"); done
  certbot certonly --webroot -w /var/www/certbot --cert-name "$cert_name" \
    --email "$email" --agree-tos --no-eff-email --non-interactive --keep-until-expiring --expand "${args[@]}"
  install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
  printf '#!/bin/sh\n# Installed by infra/scripts/install-nginx.sh\nsystemctl reload nginx\n' >/etc/letsencrypt/renewal-hooks/deploy/coco-reload-nginx.sh
  chmod 755 /etc/letsencrypt/renewal-hooks/deploy/coco-reload-nginx.sh
  link_cert
  nginx -t
  systemctl reload nginx
  info "certificate installed; renewal: certbot's systemd timer + reload hook"
fi
step "nginx ready"
