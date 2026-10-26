#!/usr/bin/env bash
# Installs infra/nginx on the VPS (run with sudo from a release folder, idempotent):
#   sudo bash /opt/coco/releases/<sha>/scripts/install-nginx.sh                  configs only
#   sudo bash …/install-nginx.sh --issue-certs you@example.com                     + Let's Encrypt
#   sudo bash …/install-nginx.sh --issue-certs you@example.com --no-staging        without the staging pair
# First run: TLS starts with a self-signed certificate (so nginx can start and answer the ACME
# challenge on port 80); --issue-certs then gets one certificate for every name (webroot), links it
# and adds a renewal hook that reloads nginx. Staging basic auth: STAGING_AUTH_USER and
# STAGING_AUTH_PASSWORD (asked for when missing and no htpasswd exists yet).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src="$(cd "$here/../nginx" && pwd)"
email=""
staging=1
while [ "$#" -gt 0 ]; do
  case "$1" in
    --issue-certs) email="${2:-}"; shift 2 ;;
    --no-staging) staging=0; shift ;;
    *) echo "unknown option: $1" >&2; exit 64 ;;
  esac
done
step() { printf '\n==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
[ "$(id -u)" = 0 ] || { echo "run with sudo" >&2; exit 1; }
command -v nginx >/dev/null || { echo "nginx is not installed (harden-vps.sh installs it)" >&2; exit 1; }

coco=/etc/nginx/coco
deploy_user="${DEPLOY_USER:-deploy}"
names=(cocovanillegranby.com www.cocovanillegranby.com admin.cocovanillegranby.com)
if [ "$staging" = 1 ]; then names+=(staging.cocovanillegranby.com admin-staging.cocovanillegranby.com); fi

step "Folders"
install -d -m 755 "$coco" "$coco/tls" /var/www/certbot /var/www/coco
install -d -m 755 -o "$deploy_user" -g "$deploy_user" "$coco/upstreams"
info "$coco/upstreams is writable by ${deploy_user} (deploy.sh switches colours there)"

step "Configs"
install -m 644 "$src/conf.d/coco.conf" /etc/nginx/conf.d/coco.conf
install -m 644 "$src"/snippets/*.conf /etc/nginx/snippets/
install -m 644 "$src/html/50x.html" /var/www/coco/50x.html
for site in "$src"/sites/*.conf; do
  name="$(basename "$site")"
  if [ "$staging" = 0 ] && [ "$name" = staging.cocovanillegranby.com.conf ]; then continue; fi
  install -m 644 "$site" "/etc/nginx/sites-available/$name"
  ln -sfn "/etc/nginx/sites-available/$name" "/etc/nginx/sites-enabled/$name"
  info "$name"
done
# Ubuntu's default site also claims default_server.
rm -f /etc/nginx/sites-enabled/default

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

step "TLS certificate"
live="/etc/letsencrypt/live/cocovanillegranby.com"
link_cert() {
  ln -sfn "$live/fullchain.pem" "$coco/tls/fullchain.pem"
  ln -sfn "$live/privkey.pem" "$coco/tls/privkey.pem"
}
if [ -s "$live/fullchain.pem" ]; then
  link_cert
  info "Let's Encrypt certificate linked"
elif [ ! -e "$coco/tls/fullchain.pem" ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj '/CN=cocovanillegranby.com' \
    -keyout "$coco/tls/privkey.pem" -out "$coco/tls/fullchain.pem" >/dev/null 2>&1
  chmod 600 "$coco/tls/privkey.pem"
  info "temporary self-signed certificate (run again with --issue-certs once DNS points here)"
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
  certbot certonly --webroot -w /var/www/certbot --cert-name cocovanillegranby.com \
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
