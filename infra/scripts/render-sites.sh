#!/usr/bin/env bash
# Writes the nginx site files for one set of host names, from the templates in infra/nginx/sites/ (which use the
# final names: cocovanillegranby.com, www., admin., staging., admin-staging.). Used by install-nginx.sh and
# nginx-test.sh; prints nothing but the files it wrote.
#   render-sites.sh <out-dir> [--public-host H] [--admin-host A] [--temporary] [--no-staging] [--shared]
# --public-host / --admin-host  other names, e.g. a temporary address: cocovanille.<ip-with-dashes>.sslip.io and
#                               admin-cocovanille.<ip-with-dashes>.sslip.io (www.<H> keeps redirecting to <H>)
# --temporary   the public host answers noindex on every response (snippets/coco-noindex.conf)
# --no-staging  leave out the staging pair
# --shared      the server hosts other sites, and nothing about them may change:
#               - no 00-default.conf (no default_server taken over);
#               - files named zz-coco-*.conf, so they load after every other site: nginx makes the first server
#                 it loads on a socket that socket's default, and that must stay the other app's;
#               - no http2 on the listen lines: on nginx < 1.25.1 the flag applies to the whole socket, so it would
#                 switch HTTP/2 on for the other sites too;
#               - no IPv6 listens: a socket the other sites may not use (the temporary names have IPv4 only).
# --edge <public-port>:<admin-port>:<server-ip>   behind another web server on this machine (setup-panel-host.sh):
#               only the two site blocks, on 127.0.0.1 without TLS; the server's own address may call /svc/revalidate
#               (the containers reach the public host through it).
# Output names do not depend on the hosts (coco-public.conf, coco-admin.conf, coco-staging.conf and
# 00-coco-default.conf; zz-coco-*.conf with --shared), so switching to the final domain rewrites the same files.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
src="$(cd "$here/../nginx/sites" && pwd)"
out="${1:-}"
[ -n "$out" ] || { echo "usage: render-sites.sh <out-dir> [options]" >&2; exit 64; }
shift
public=cocovanillegranby.com
admin=admin.cocovanillegranby.com
temporary=0
staging=1
shared=0
edge=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    --temporary) temporary=1; shift ;;
    --no-staging) staging=0; shift ;;
    --shared) shared=1; shift ;;
    --edge) edge="${2:-}"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 64 ;;
  esac
done
host_re='^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$'
[[ "$public" =~ $host_re ]] || { echo "not a host name: $public" >&2; exit 64; }
[[ "$admin" =~ $host_re ]] || { echo "not a host name: $admin" >&2; exit 64; }
[ "$public" != "$admin" ] || { echo "the public and admin hosts must differ" >&2; exit 64; }

mkdir -p "$out"
# Longest names first, so cocovanillegranby.com does not eat the admin. and www. prefixes.
rename() {
  sed -e "s/admin-staging\.cocovanillegranby\.com/admin-staging.${public}/g" \
    -e "s/staging\.cocovanillegranby\.com/staging.${public}/g" \
    -e "s/admin\.cocovanillegranby\.com/${admin}/g" \
    -e "s/www\.cocovanillegranby\.com/www.${public}/g" \
    -e "s/cocovanillegranby\.com/${public}/g" "$1"
}

prefix=""
if [ "$shared" = 1 ]; then prefix=zz-; fi
rename "$src/cocovanillegranby.com.conf" >"$out/${prefix}coco-public.conf"
if [ "$temporary" = 1 ]; then
  # Every place that sets HSTS (server level and the locations that add headers) also says noindex.
  sed -i 's#^\(\s*\)include /etc/nginx/snippets/coco-hsts.conf;#&\n\1include /etc/nginx/snippets/coco-noindex.conf;#' "$out/${prefix}coco-public.conf"
fi
rename "$src/admin.cocovanillegranby.com.conf" >"$out/${prefix}coco-admin.conf"
if [ "$staging" = 1 ]; then rename "$src/staging.cocovanillegranby.com.conf" >"$out/${prefix}coco-staging.conf"; fi
if [ "$shared" = 0 ]; then
  cp "$src/00-default.conf" "$out/00-coco-default.conf"
else
  sed -i -e 's/^\(\s*listen 443 ssl\) http2;/\1;/' -e '/^\s*listen \[::\]/d' "$out"/zz-coco-*.conf
fi
if [ -n "$edge" ]; then
  [ "$shared" = 1 ] || { echo "--edge goes with --shared" >&2; exit 64; }
  IFS=: read -r edge_public edge_admin edge_ip <<<"$edge"
  [[ "$edge_public" =~ ^[0-9]+$ && "$edge_admin" =~ ^[0-9]+$ && "$edge_ip" =~ ^[0-9.]+$ ]] || { echo "--edge <public-port>:<admin-port>:<server-ip>" >&2; exit 64; }
  for name in public admin; do
    file="$out/zz-coco-$name.conf"
    port="$edge_public"
    if [ "$name" = admin ]; then port="$edge_admin"; fi
    # Whole server blocks out: the HTTP redirects and www (the web server in front owns those).
    awk '/^server \{/ { block = $0 "\n"; inside = 1; next }
      inside { block = block $0 "\n"; if ($0 ~ /^\}/) { inside = 0; if (block !~ /listen 80;/ && block !~ /server_name www\./) printf "%s", block } ; next }
      { print }' "$file" >"$file.tmp"
    sed -e "s/^\(\s*\)listen 443 ssl;/\1listen 127.0.0.1:${port};/" -e '/coco-tls\.conf/d' \
      -e "s/^\(\s*\)allow 127\.0\.0\.1;/&\n\1allow ${edge_ip};/" "$file.tmp" >"$file"
    rm -f "$file.tmp"
  done
fi
ls -1 "$out"
