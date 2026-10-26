#!/usr/bin/env bash
# Checks infra/nginx with `nginx -t` without touching /etc: copies the files into a temporary
# prefix, points every absolute path there, adds a self-signed certificate, a dummy htpasswd and
# upstream files, then runs nginx -t. Used by CI (lint job) and before install-nginx.sh.
# Usage: infra/scripts/nginx-test.sh            (needs nginx and openssl on PATH)
#        NGINX_BIN=/usr/sbin/nginx infra/scripts/nginx-test.sh
#        SERVE=1 WEB_PORT=3001 STUDIO_PORT=3002 infra/scripts/nginx-test.sh
#          → after the test, runs nginx in the foreground on :80/:443 against those local ports
#            (smoke-test the redirects and headers with curl --resolve; Ctrl-C to stop).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src="$(cd "$here/../nginx" && pwd)"
nginx_bin="${NGINX_BIN:-nginx}"
command -v "$nginx_bin" >/dev/null 2>&1 || { echo "ERROR: nginx not found (set NGINX_BIN)" >&2; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo "ERROR: openssl not found" >&2; exit 1; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
# Worker processes (www-data / nginx) must be able to read the prefix.
chmod 755 "$tmp"
echo "==> Preparing a test prefix in $tmp"
mkdir -p "$tmp"/{conf.d,snippets,sites,coco/upstreams,coco/tls,log,www/certbot,www/coco,opt/production/media,opt/staging/media,run}
cp "$src"/conf.d/*.conf "$tmp/conf.d/"
cp "$src"/snippets/*.conf "$tmp/snippets/"
cp "$src"/sites/*.conf "$tmp/sites/"
cp "$src"/html/50x.html "$tmp/www/coco/"

# Absolute paths of the real install → the test prefix.
for f in "$tmp"/conf.d/*.conf "$tmp"/snippets/*.conf "$tmp"/sites/*.conf; do
  sed -i \
    -e "s#/etc/nginx/coco/#$tmp/coco/#g" \
    -e "s#/etc/nginx/snippets/#$tmp/snippets/#g" \
    -e "s#/var/log/nginx/#$tmp/log/#g" \
    -e "s#/var/www/#$tmp/www/#g" \
    -e "s#/opt/coco/#$tmp/opt/#g" \
    "$f"
  # Containers and CI runners without IPv6 cannot even create the [::] sockets nginx -t opens.
  if [ ! -f /proc/net/if_inet6 ]; then sed -i '/listen \[::\]/d' "$f"; fi
done

echo "==> Self-signed certificate, htpasswd, upstreams"
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj '/CN=cocovanillegranby.test' \
  -keyout "$tmp/coco/tls/privkey.pem" -out "$tmp/coco/tls/fullchain.pem" >/dev/null 2>&1
if [ -n "${HTPASSWD_FILE:-}" ]; then
  cp "$HTPASSWD_FILE" "$tmp/coco/staging.htpasswd"
else
  # A literal apr1 hash (not a shell expansion).
  # shellcheck disable=SC2016
  printf 'agence:$apr1$test$0000000000000000000000\n' >"$tmp/coco/staging.htpasswd"
fi
for env in production staging; do
  printf 'upstream coco_%s_web { server 127.0.0.1:%s; }\nupstream coco_%s_studio { server 127.0.0.1:%s; }\n' \
    "$env" "${WEB_PORT:-1}" "$env" "${STUDIO_PORT:-2}" \
    >"$tmp/coco/upstreams/$env.conf"
done

mime="$(dirname "$(command -v "$nginx_bin")")/../conf/mime.types"
for candidate in /etc/nginx/mime.types "$mime"; do
  if [ -f "$candidate" ]; then cp "$candidate" "$tmp/mime.types"; break; fi
done
[ -f "$tmp/mime.types" ] || printf 'types { text/html html; }\n' >"$tmp/mime.types"

cat >"$tmp/nginx.conf" <<EOF
pid $tmp/run/nginx.pid;
error_log $tmp/log/error.log;
events { worker_connections 64; }
http {
  include $tmp/mime.types;
  access_log $tmp/log/access.log;
  client_body_temp_path $tmp/run/body;
  proxy_temp_path $tmp/run/proxy;
  fastcgi_temp_path $tmp/run/fastcgi;
  uwsgi_temp_path $tmp/run/uwsgi;
  scgi_temp_path $tmp/run/scgi;
  include $tmp/conf.d/*.conf;
  include $tmp/sites/*.conf;
}
EOF

echo "==> nginx -t"
"$nginx_bin" -t -p "$tmp" -c "$tmp/nginx.conf"

if [ "${SERVE:-0}" = 1 ]; then
  echo "==> Serving on :80 and :443 (upstreams web :${WEB_PORT:-1}, studio :${STUDIO_PORT:-2})"
  "$nginx_bin" -p "$tmp" -c "$tmp/nginx.conf" -g 'daemon off;'
fi
