#!/usr/bin/env bash
# Writes the nginx site files for one set of host names, from the templates in infra/nginx/sites/ (which use the
# final names: cocovanillegranby.com, www., admin., staging., admin-staging.). Used by install-nginx.sh and
# nginx-test.sh; prints nothing but the files it wrote.
#   render-sites.sh <out-dir> [--public-host H] [--admin-host A] [--temporary] [--no-staging] [--shared]
# --public-host / --admin-host  other names, e.g. a temporary address: cocovanille.<ip-with-dashes>.sslip.io and
#                               admin-cocovanille.<ip-with-dashes>.sslip.io (www.<H> keeps redirecting to <H>)
# --temporary   the public host answers noindex on every response (snippets/coco-noindex.conf)
# --no-staging  leave out the staging pair
# --shared      the server hosts other sites: leave out 00-default.conf (no default_server taken over)
# Output names do not depend on the hosts (coco-public.conf, coco-admin.conf, coco-staging.conf,
# 00-coco-default.conf), so switching to the final domain later rewrites the same files.
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
while [ "$#" -gt 0 ]; do
  case "$1" in
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    --temporary) temporary=1; shift ;;
    --no-staging) staging=0; shift ;;
    --shared) shared=1; shift ;;
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

rename "$src/cocovanillegranby.com.conf" >"$out/coco-public.conf"
if [ "$temporary" = 1 ]; then
  # Every place that sets HSTS (server level and the locations that add headers) also says noindex.
  sed -i 's#^\(\s*\)include /etc/nginx/snippets/coco-hsts.conf;#&\n\1include /etc/nginx/snippets/coco-noindex.conf;#' "$out/coco-public.conf"
fi
rename "$src/admin.cocovanillegranby.com.conf" >"$out/coco-admin.conf"
if [ "$staging" = 1 ]; then rename "$src/staging.cocovanillegranby.com.conf" >"$out/coco-staging.conf"; fi
if [ "$shared" = 0 ]; then cp "$src/00-default.conf" "$out/00-coco-default.conf"; fi
ls -1 "$out"
