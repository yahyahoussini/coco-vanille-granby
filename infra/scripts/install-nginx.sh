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
# --port-base N: Coco's local ports are N+1, N+2 (blue) and N+11, N+12 (green); default 3000 (make-env.sh, same option).
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
port_base=3000
while [ "$#" -gt 0 ]; do
  case "$1" in
    --issue-certs) email="${2:-}"; shift 2 ;;
    --no-staging) staging=0; shift ;;
    --shared) shared=1; shift ;;
    --temporary) temporary=1; shift ;;
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    --port-base) port_base="${2:-}"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 64 ;;
  esac
done
step() { printf '\n==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
[ "$(id -u)" = 0 ] || { echo "run with sudo" >&2; exit 1; }
[[ "$port_base" =~ ^[1-9][0-9]{2,4}$ ]] && [ "$port_base" -le 64000 ] || { echo "--port-base is a number like 3000" >&2; exit 64; }
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
rendered="$(mktemp -d)"
backup="$(mktemp -d)"
trap 'rm -rf "$rendered" "$backup"' EXIT
# Coco's nginx files as they are now (and nothing else), to put back if the new set fails `nginx -t`: a broken
# file left in sites-enabled would keep every site on the server from starting at the next nginx restart.
# A file is Coco's by its name (coco-*, zz-coco-*, 00-coco-default), or, for the names of the first layout that
# another site could also use (00-default.conf…), only when its content includes Coco's snippets.
is_coco_file() {
  case "$1" in
    /etc/nginx/conf.d/coco.conf | /etc/nginx/snippets/coco-*.conf | */coco-public.conf | */coco-admin.conf | */coco-staging.conf | */zz-coco-*.conf | */00-coco-default.conf) return 0 ;;
    */00-default.conf | */cocovanillegranby.com.conf | */admin.cocovanillegranby.com.conf | */staging.cocovanillegranby.com.conf)
      grep -qs -e 'coco_timing' -e 'snippets/coco-' "$1"
      return
      ;;
  esac
  return 1
}
coco_nginx_files() {
  local f
  for f in /etc/nginx/conf.d/coco.conf /etc/nginx/snippets/coco-*.conf /etc/nginx/sites-available/* /etc/nginx/sites-enabled/*; do
    if { [ -e "$f" ] || [ -L "$f" ]; } && is_coco_file "$f"; then printf '%s\n' "${f#/}"; fi
  done
}
mapfile -t before < <(coco_nginx_files)
if [ "${#before[@]}" -gt 0 ]; then tar -C / -cpf "$backup/coco-nginx.tar" "${before[@]}"; fi
restore_coco_nginx() {
  local f
  while IFS= read -r f; do rm -f "/$f"; done < <(coco_nginx_files)
  if [ -f "$backup/coco-nginx.tar" ]; then tar -C / -xpf "$backup/coco-nginx.tar"; fi
}
install -m 644 "$src/conf.d/coco.conf" /etc/nginx/conf.d/coco.conf
install -m 644 "$src"/snippets/*.conf /etc/nginx/snippets/
install -m 644 "$src/html/50x.html" /var/www/coco/50x.html
flags=(--public-host "$public" --admin-host "$admin")
if [ "$temporary" = 1 ]; then flags+=(--temporary); fi
if [ "$staging" = 0 ]; then flags+=(--no-staging); fi
if [ "$shared" = 1 ]; then flags+=(--shared); fi
bash "$here/render-sites.sh" "$rendered" "${flags[@]}" >/dev/null
# Coco's files from an earlier layout or an option turned off since; another site's file is never removed.
for old in cocovanillegranby.com.conf admin.cocovanillegranby.com.conf staging.cocovanillegranby.com.conf 00-default.conf \
  coco-public.conf coco-admin.conf coco-staging.conf zz-coco-public.conf zz-coco-admin.conf zz-coco-staging.conf 00-coco-default.conf; do
  [ ! -f "$rendered/$old" ] || continue
  for f in "/etc/nginx/sites-enabled/$old" "/etc/nginx/sites-available/$old"; do
    if { [ -e "$f" ] || [ -L "$f" ]; } && is_coco_file "$f"; then rm -f "$f"; fi
  done
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
  # Rewritten until the first deploy owns it (deploy.sh writes its own header), so a new --port-base applies.
  if [ ! -f "$file" ] || ! grep -q '^# Written by infra/scripts (deploy.sh' "$file"; then
    # Blue ports (WEB_BLUE_PORT / STUDIO_BLUE_PORT in .env): port base + 1 and + 2, staging 100 higher.
    if [ "$env" = production ]; then web=$((port_base + 1)) studio=$((port_base + 2)); else web=$((port_base + 101)) studio=$((port_base + 102)); fi
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
if ! nginx -t; then
  echo "nginx -t failed: Coco's previous nginx files are put back, nothing was reloaded" >&2
  restore_coco_nginx
  nginx -t || echo "nginx -t still fails without Coco's new files: the problem is elsewhere, look before any restart" >&2
  exit 1
fi
# A reload is graceful (open connections finish); never a restart while other sites are being served.
if systemctl is-active --quiet nginx; then systemctl reload nginx; else systemctl start nginx; fi

if [ -n "$email" ]; then
  step "Let's Encrypt for: ${names[*]}"
  command -v certbot >/dev/null || { echo "certbot is not installed" >&2; exit 1; }
  args=()
  for n in "${names[@]}"; do args+=(-d "$n"); done
  hint="the site keeps its self-signed certificate meanwhile. Check that port 80 reaches this server for every name; for a .sslip.io name refused by Let's Encrypt's quota, the same names under .nip.io work the same way"
  # A dry run first, on Let's Encrypt's staging server (its own limits): port 80 or name problems never spend
  # the real quota.
  certbot certonly --dry-run --webroot -w /var/www/certbot --cert-name "$cert_name" \
    --email "$email" --agree-tos --no-eff-email --non-interactive "${args[@]}" ||
    { echo "Let's Encrypt dry run failed: ${hint}" >&2; exit 1; }
  # The reload hook is stored in this certificate's own renewal file (not renewal-hooks/, which every
  # certificate on a shared server runs).
  certbot certonly --webroot -w /var/www/certbot --cert-name "$cert_name" \
    --email "$email" --agree-tos --no-eff-email --non-interactive --keep-until-expiring --expand \
    --deploy-hook 'systemctl reload nginx' "${args[@]}" ||
    { echo "Let's Encrypt refused the certificate: ${hint}" >&2; exit 1; }
  link_cert
  nginx -t
  systemctl reload nginx
  info "certificate installed; renewal: certbot's systemd timer, then a reload for this certificate only"
fi
step "nginx ready"
