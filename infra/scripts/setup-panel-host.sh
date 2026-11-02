#!/usr/bin/env bash
# Adds Coco Vanille to a server run by CyberPanel (OpenLiteSpeed on ports 80/443, AlmaLinux or Rocky), beside the
# sites already there, without changing them. Run once as root, safe to run again:
#   DEPLOY_SSH_KEYS="$(cat coco_vps_ed25519.pub)" bash infra/scripts/setup-panel-host.sh \
#     --public-host cocovanille.<ip-with-dashes>.sslip.io --admin-host admin-cocovanille.<ip-with-dashes>.sslip.io \
#     --server-ip <ip> [--temporary] [--port-base 3000]
# How the traffic flows: OpenLiteSpeed (TLS, two new CyberPanel websites) → Coco's own nginx in a container, on
# 127.0.0.1 only (coco-edge, the same site files as the other layouts) → the blue or green containers. A deploy only
# reloads coco-edge: OpenLiteSpeed is not touched again.
# What it adds: Docker if missing · Coco's own Linux account (DEPLOY_USER, default `coco`, docker group, no sudo) ·
# /opt/coco · Coco's systemd timers · coco-edge · two CyberPanel websites and their certificates (one graceful
# OpenLiteSpeed restart, as CyberPanel itself does for any new site).
# What it never touches: the other sites and their files, firewalld, sshd, MariaDB, PHP, the time zone, another
# account, the Docker engine of a server that already has one. It stops before any change when ports 80/443 are not
# OpenLiteSpeed's, when Coco's ports are taken, or when DEPLOY_USER is another app's account.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
infra="$(cd "$here/.." && pwd)"
DEPLOY_USER="${DEPLOY_USER:-coco}"
GECOS="Coco Vanille deploy"
EDGE_IMAGE="${EDGE_IMAGE:-nginx:1.27-alpine}"
public=""
admin=""
server_ip=""
temporary=0
port_base=3000
while [ "$#" -gt 0 ]; do
  case "$1" in
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    --server-ip) server_ip="${2:-}"; shift 2 ;;
    --temporary) temporary=1; shift ;;
    --port-base) port_base="${2:-}"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 64 ;;
  esac
done
step() { printf '\n==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}
[ "$(id -u)" = 0 ] || die "run as root"
[ -n "$public" ] && [ -n "$admin" ] && [ -n "$server_ip" ] || die "--public-host, --admin-host and --server-ip are required"
[[ "$server_ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "--server-ip is the server's IPv4 address"
[[ "$port_base" =~ ^[1-9][0-9]{2,4}$ ]] && [ "$port_base" -le 64000 ] || die "--port-base is a number like 3000"
[[ "$DEPLOY_USER" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || die "DEPLOY_USER is a Linux user name such as coco"
edge_public=$((port_base + 80))
edge_admin=$((port_base + 81))
edge="/opt/coco/edge"
vhosts=/usr/local/lsws/conf/vhosts

step "Checks before any change"
owners="$(ss -Hltnp '( sport = :80 or sport = :443 )' 2>/dev/null | grep -o 'users:(("[^"]*"' | sed 's/users:(("//; s/"$//' | sort -u | tr '\n' ' ' || true)"
info "ports 80/443: ${owners:-nobody}"
for o in $owners; do
  case "$o" in
    litespeed | lshttpd | openlitespeed) ;;
    *) die "ports 80/443 belong to '${o}', not to OpenLiteSpeed: nothing was changed." ;;
  esac
done
[ -n "$owners" ] || die "nothing listens on 80/443: this script is for a server where CyberPanel's OpenLiteSpeed serves them. Nothing was changed."
command -v cyberpanel >/dev/null 2>&1 || die "no cyberpanel command on this server: nothing was changed."
[ -d "$vhosts" ] || die "$vhosts is missing: not CyberPanel's OpenLiteSpeed layout. Nothing was changed."
ports="$((port_base + 1)) $((port_base + 2)) $((port_base + 11)) $((port_base + 12)) $edge_public $edge_admin 3999"
claimed="$( {
  ss -Hltn 2>/dev/null | awk '{print $4}' | sed 's/.*://'
  if command -v docker >/dev/null 2>&1; then
    docker ps -aq 2>/dev/null | xargs -r docker inspect -f '{{.Name}}{{range $p, $b := .HostConfig.PortBindings}}{{range $b}} {{.HostPort}}{{end}}{{end}}' 2>/dev/null |
      grep -v '^/coco-' | cut -s -d' ' -f2- | tr ' ' '\n'
  fi
} | grep -E '^[0-9]+$' | sort -u | tr '\n' ' ' || true)"
busy=""
for p in $ports; do
  if [[ " ${claimed} " == *" ${p} "* ]] && ! docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep -q "^coco-.*127.0.0.1:${p}->"; then
    # coco-edge is on the host network: its own listeners do not count.
    if ! ss -Hltnp "( sport = :$p )" 2>/dev/null | grep -q '"nginx"' || ! docker ps --format '{{.Names}}' 2>/dev/null | grep -qx coco-edge; then busy="$busy $p"; fi
  fi
done
[ -z "$busy" ] || die "ports claimed by another app:${busy}. Nothing was changed: run again with another --port-base (e.g. --port-base 4300), and give make-env.sh the same one"
info "Coco's ports are free: ${ports}"
if id "$DEPLOY_USER" >/dev/null 2>&1; then
  case "$(getent passwd "$DEPLOY_USER" | cut -d: -f5)" in
    "$GECOS"*) info "account ${DEPLOY_USER} exists and is Coco's" ;;
    *) die "the account '${DEPLOY_USER}' already exists and belongs to something else: nothing was changed. Run again with DEPLOY_USER=<another name>." ;;
  esac
fi
if command -v docker >/dev/null 2>&1; then
  compose_v="$(DOCKER_CONFIG=/nonexistent docker compose version --short 2>/dev/null | sed 's/^v//' || true)"
  if [ -z "$compose_v" ] || [ "$(printf '%s\n2.17.0\n' "$compose_v" | sort -V | head -n 1)" != 2.17.0 ] ||
    ! DOCKER_CONFIG=/nonexistent docker buildx version >/dev/null 2>&1 || ! getent group docker >/dev/null; then
    die "Docker is installed but lacks what Coco needs (docker compose 2.17 or later: '${compose_v:-none}'; docker buildx; a docker group): nothing was changed. This script never replaces a running Docker engine."
  fi
fi

step "Packages (only the missing ones)"
missing=()
for p in curl jq openssl rsync; do rpm -q "$p" >/dev/null 2>&1 || missing+=("$p"); done
if [ "${#missing[@]}" -gt 0 ]; then
  dnf install -y -q --setopt=install_weak_deps=False "${missing[@]}" >/dev/null
  info "installed: ${missing[*]}"
else
  info "all present"
fi
# Backups are encrypted with age (backup.sh): EPEL when the server has it, else the check in backup.sh names it.
if ! command -v age >/dev/null 2>&1; then
  dnf install -y -q --setopt=install_weak_deps=False age >/dev/null 2>&1 && info "installed: age" || info "NOTE: age is not available from this server's repositories"
fi
if ! command -v docker >/dev/null 2>&1; then
  cat >/etc/yum.repos.d/docker-ce.repo <<'REPO'
[docker-ce-stable]
name=Docker CE Stable
baseurl=https://download.docker.com/linux/centos/$releasever/$basearch/stable
enabled=1
gpgcheck=1
gpgkey=https://download.docker.com/linux/centos/gpg
REPO
  dnf install -y -q --setopt=install_weak_deps=False docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
  systemctl enable --now docker >/dev/null
  info "Docker installed"
fi
info "$(docker --version) · $(docker compose version)"

step "Coco's account (${DEPLOY_USER})"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd -m -c "$GECOS" -s /bin/bash "$DEPLOY_USER"
  info "created"
fi
usermod -aG docker "$DEPLOY_USER"
home="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$home/.ssh"
touch "$home/.ssh/authorized_keys"
if [ -n "${DEPLOY_SSH_KEYS:-}" ]; then
  while IFS= read -r key; do
    [ -n "$key" ] || continue
    grep -qxF "$key" "$home/.ssh/authorized_keys" || printf '%s\n' "$key" >>"$home/.ssh/authorized_keys"
  done <<<"$DEPLOY_SSH_KEYS"
fi
chown "$DEPLOY_USER:$DEPLOY_USER" "$home/.ssh/authorized_keys"
chmod 600 "$home/.ssh/authorized_keys"
command -v restorecon >/dev/null 2>&1 && restorecon -R "$home/.ssh" 2>/dev/null || true
info "$(grep -c '^ssh-' "$home/.ssh/authorized_keys" || true) key(s); docker group (= root on this box: guard the keys)"

step "Folders (/opt/coco, production only)"
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /opt/coco /opt/coco/releases /opt/coco/src
install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /opt/coco/production /opt/coco/production/backups /opt/coco/production/reports
install -d -m 755 -o 1000 -g 1000 /opt/coco/production/media
install -d -m 750 -o 1000 -g "$DEPLOY_USER" /opt/coco/production/media/demandes
chmod 711 /opt/coco/production
info "media readable by coco-edge (but not media/demandes); .env, backups and reports private"

step "systemd timers (Coco's own; none reboots the server)"
for unit in "$infra"/systemd/coco-backup@.* "$infra"/systemd/coco-restore-test@.* "$infra"/systemd/coco-image-prune.*; do
  sed "s/^User=deploy\$/User=${DEPLOY_USER}/" "$unit" >"/etc/systemd/system/$(basename "$unit")"
  chmod 644 "/etc/systemd/system/$(basename "$unit")"
done
systemctl daemon-reload
systemctl enable --now coco-image-prune.timer >/dev/null
info "enabled: coco-image-prune.timer (Coco images only)"
info "after the first deploy: systemctl enable --now coco-backup@production.timer coco-restore-test@production.timer"

step "Coco's nginx (coco-edge, 127.0.0.1:${edge_public} and :${edge_admin})"
install -d -m 755 "$edge" "$edge/conf.d" "$edge/snippets" "$edge/html" "$edge/log" "$edge/coco"
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$edge/coco/upstreams"
install -m 644 "$infra/nginx/conf.d/coco.conf" "$edge/conf.d/coco.conf"
install -m 644 "$infra"/nginx/snippets/*.conf "$edge/snippets/"
install -m 644 "$infra/nginx/html/50x.html" "$edge/html/50x.html"
# OpenLiteSpeed in front: it ended TLS, and it is the only client of these sockets, so its X-Forwarded-For names the visitor.
sed -i 's/X-Forwarded-Proto \$scheme/X-Forwarded-Proto https/' "$edge/snippets/coco-proxy.conf"
# OpenLiteSpeed keeps its connections to coco-edge open while there is traffic, and a reload leaves an old nginx worker
# on every connection already open: without keepalive_time it would go on sending visitors to the previous colour until
# that colour is stopped (a 502 for whoever is still on it). With 20 s, every visitor is on the new colour within seconds.
printf '# OpenLiteSpeed is the only client (127.0.0.1): the visitor is its X-Forwarded-For.\nset_real_ip_from 127.0.0.1;\nreal_ip_header X-Forwarded-For;\n' >"$edge/conf.d/coco-edge.conf"
flags=(--no-staging --shared --public-host "$public" --admin-host "$admin" --edge "${edge_public}:${edge_admin}:${server_ip}")
if [ "$temporary" = 1 ]; then flags+=(--temporary); fi
rm -f "$edge"/conf.d/zz-coco-*.conf
bash "$here/render-sites.sh" "$edge/conf.d" "${flags[@]}" >/dev/null
upstream="$edge/coco/upstreams/production.conf"
if [ ! -f "$upstream" ] || ! grep -q '^# Written by infra/scripts (deploy.sh' "$upstream"; then
  printf 'upstream coco_production_web {\n  server 127.0.0.1:%s;\n  keepalive 16;\n}\nupstream coco_production_studio {\n  server 127.0.0.1:%s;\n  keepalive 8;\n}\n' "$((port_base + 1))" "$((port_base + 2))" >"$upstream"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$upstream"
fi
mounts=(-v "$edge/conf.d:/etc/nginx/conf.d:ro" -v "$edge/snippets:/etc/nginx/snippets:ro" -v "$edge/coco:/etc/nginx/coco:ro" -v "$edge/html:/var/www/coco:ro" -v "$edge/log:/var/log/nginx" -v /opt/coco/production/media:/opt/coco/production/media:ro)
docker pull -q "$EDGE_IMAGE" >/dev/null
docker run --rm --network host "${mounts[@]}" "$EDGE_IMAGE" nginx -t -q || die "coco-edge's configuration does not pass nginx -t: OpenLiteSpeed and the other sites were not touched"
if docker ps --format '{{.Names}}' | grep -qx coco-edge; then
  docker exec coco-edge nginx -s reload
  info "reloaded"
else
  docker rm -f coco-edge >/dev/null 2>&1 || true
  docker run -d --name coco-edge --restart unless-stopped --network host --memory 128m --log-opt max-size=10m --log-opt max-file=2 "${mounts[@]}" "$EDGE_IMAGE" >/dev/null
  sleep 2
  docker ps --format '{{.Names}} {{.Status}}' | grep -q '^coco-edge Up' || die "coco-edge did not start: $(docker logs --tail 5 coco-edge 2>&1)"
  info "running"
fi
# How deploy.sh and rollback.sh switch colours on this server (read by lib.sh).
cat >/opt/coco/host.env <<HOSTENV
NGINX_COCO_DIR="$edge/coco"
NGINX_TEST_CMD="docker exec coco-edge nginx -t -q"
NGINX_RELOAD_CMD="docker exec coco-edge nginx -s reload"
HOSTENV
chmod 644 /opt/coco/host.env

step "CyberPanel websites and certificates"
# Written once per website, between these two lines: the proxy to coco-edge. Everything else in the file is CyberPanel's.
BEGIN="# BEGIN coco-edge (infra/scripts/setup-panel-host.sh)"
END="# END coco-edge"
ols_changed=0
site() {
  local host="$1" port="$2" conf="$vhosts/$1/vhost.conf" out before
  if [ ! -f "$conf" ]; then
    # The website's PHP is never used (everything is proxied), but CyberPanel asks for one it has.
    php="$(ls -d /usr/local/lsws/lsphp[0-9]* 2>/dev/null | sed 's#.*/lsphp##' | sort -n | tail -n 1 | sed 's/^\(.\)\(.*\)$/\1.\2/')"
    out="$(cyberpanel createWebsite --package Default --owner admin --domainName "$host" --email "webmaster@${host}" --php "${php:-8.2}" 2>&1 || true)"
    [ -f "$conf" ] || die "CyberPanel did not create ${host}: ${out}"
    info "website ${host} created"
    ols_changed=1
  else
    info "website ${host} exists"
  fi
  if [ ! -s "/etc/letsencrypt/live/${host}/fullchain.pem" ]; then
    out="$(cyberpanel issueSSL --domainName "$host" 2>&1 || true)"
    if [ -s "/etc/letsencrypt/live/${host}/fullchain.pem" ]; then info "certificate issued for ${host}"; else info "NOTE: no certificate yet for ${host}: ${out}"; fi
  else
    info "certificate exists for ${host}"
  fi
  [ -f "$conf.before-coco" ] || cp -p "$conf" "$conf.before-coco"
  before="$(md5sum <"$conf")"
  sed -i "/^${BEGIN//\//\\/}\$/,/^${END}\$/d" "$conf"
  cat >>"$conf" <<CONF
$BEGIN
extprocessor coco_edge_${port} {
  type                    proxy
  address                 127.0.0.1:${port}
  maxConns                200
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}
context / {
  type                    proxy
  handler                 coco_edge_${port}
  addDefaultCharset       off
}
$END
CONF
  [ "$before" = "$(md5sum <"$conf")" ] || ols_changed=1
}
site "$public" "$edge_public"
site "$admin" "$edge_admin"
if [ "$ols_changed" = 1 ]; then
  /usr/local/lsws/bin/lswsctrl restart >/dev/null
  sleep 3
  ss -Hltnp '( sport = :443 )' 2>/dev/null | grep -q litespeed || die "OpenLiteSpeed is not back on port 443: put back $vhosts/{$public,$admin}/vhost.conf.before-coco and run lswsctrl restart"
  info "OpenLiteSpeed reloaded gracefully, back on 80/443"
else
  info "nothing changed for OpenLiteSpeed: not reloaded"
fi

step "Done. Next, as ${DEPLOY_USER}: make-env.sh → build-image.sh → run-task.sh migrate, seed, seed:catalogue, seed:journal and accounts --tag <sha> → deploy.sh."
