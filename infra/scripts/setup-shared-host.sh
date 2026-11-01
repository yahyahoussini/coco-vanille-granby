#!/usr/bin/env bash
# Adds Coco Vanille to a server that already runs other apps (for example the agency's Hostinger VPS), without
# changing anything they rely on. Run once as root, safe to run again:
#   sudo DEPLOY_SSH_KEYS="$(cat coco_vps_ed25519.pub)" bash infra/scripts/setup-shared-host.sh \
#     --public-host cocovanille.<ip-with-dashes>.sslip.io --admin-host admin-cocovanille.<ip-with-dashes>.sslip.io \
#     --temporary --email you@example.com [--port-base 3000]
# What it does: Docker if missing · nginx and certbot if missing (never upgraded) · Coco's own Linux account
# (DEPLOY_USER, default `coco`: docker group, sudo for nginx -t / reload only) · /opt/coco · Coco's systemd
# timers · Coco's nginx sites and certificate.
# What it never touches, unlike harden-vps.sh (for a dedicated server): the time zone, apt upgrades, ufw, sshd,
# fail2ban, swap, journald, /etc/docker/daemon.json, the Docker engine of a server that already has one, another
# account, other nginx sites or the default_server; no service is restarted (needrestart is held back) and there
# is no reboot timer. It stops before any change when ports 80/443 belong to something other than the host's nginx
# (a Docker proxy such as Traefik or Caddy, a panel), when Coco's ports are taken, or when DEPLOY_USER is another
# app's account.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
infra="$(cd "$here/.." && pwd)"
DEPLOY_USER="${DEPLOY_USER:-coco}"
GECOS="Coco Vanille deploy"
public=""
admin=""
email=""
temporary=0
port_base=3000
while [ "$#" -gt 0 ]; do
  case "$1" in
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    --email) email="${2:-}"; shift 2 ;;
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
[ "$(id -u)" = 0 ] || die "run as root (sudo)"
[ -n "$public" ] && [ -n "$admin" ] || die "--public-host and --admin-host are required"
[[ "$port_base" =~ ^[1-9][0-9]{2,4}$ ]] && [ "$port_base" -le 64000 ] || die "--port-base is a number like 3000"
[[ "$DEPLOY_USER" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || die "DEPLOY_USER is a Linux user name such as coco"
export DEBIAN_FRONTEND=noninteractive
# Ubuntu's needrestart would otherwise restart, after any apt install, every service running on an updated
# library: the other apps' nginx, PHP, database. List only.
export NEEDRESTART_SUSPEND=1 NEEDRESTART_MODE=l

step "Checks before any change"
owners="$(ss -Hltnp '( sport = :80 or sport = :443 )' 2>/dev/null | grep -o 'users:(("[^"]*"' | sed 's/users:(("//' | sort -u | tr '\n' ' ' || true)"
info "ports 80/443: ${owners:-nobody}"
for o in $owners; do
  case "$o" in
    nginx) ;;
    *) die "ports 80/443 belong to '${o}', not to the host's nginx: nothing was changed. Route the two hosts from that proxy to Coco's nginx instead (infra/README.md › Shared server)." ;;
  esac
done
if [ -n "$owners" ]; then
  # "nginx" must be Ubuntu's packaged nginx under systemd, the one that reads /etc/nginx: a panel's own build
  # (aaPanel, OpenResty, a source build) also shows up as "nginx", and installing a second one would break it.
  main_pid="$(systemctl show -p MainPID --value nginx 2>/dev/null || true)"
  listen_pids="$(ss -Hltnp '( sport = :80 or sport = :443 )' 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u | tr '\n' ' ' || true)"
  if ! dpkg -s nginx-common >/dev/null 2>&1 || ! systemctl is-active --quiet nginx || [ -z "$main_pid" ] || [ "$main_pid" = 0 ] ||
    [[ " ${listen_pids} " != *" ${main_pid} "* ]]; then
    die "the nginx on ports 80/443 is not Ubuntu's packaged nginx.service (a panel's or a custom build?): nothing was changed. Coco's sites must go into that nginx's own configuration instead (infra/README.md › Shared server)."
  fi
  info "Ubuntu's nginx.service answers on 80/443 (pid ${main_pid}): Coco adds its own sites beside the others"
fi
app_ports="$((port_base + 1)) $((port_base + 2)) $((port_base + 11)) $((port_base + 12))"
busy=""
for p in $app_ports 55432 3999; do
  if ss -Hltn "( sport = :$p )" 2>/dev/null | grep -q .; then
    if ! docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep -q "^coco-.*127.0.0.1:${p}->"; then busy="$busy $p"; fi
  fi
done
[ -z "$busy" ] || die "ports in use by another app:${busy}. Nothing was changed: run again with another --port-base (e.g. --port-base 4300), and give make-env.sh the same one; BUILD_DB_PORT / SMOKE_PORT move the build ports"
info "Coco's ports: ${app_ports} (production colours), 55432 and 3999 (builds) are free"
if id "$DEPLOY_USER" >/dev/null 2>&1; then
  case "$(getent passwd "$DEPLOY_USER" | cut -d: -f5)" in
    "$GECOS"*) info "account ${DEPLOY_USER} exists and is Coco's" ;;
    *) die "the account '${DEPLOY_USER}' already exists and belongs to something else: nothing was changed. Run again with DEPLOY_USER=<another name>." ;;
  esac
fi
if command -v docker >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
  die "Docker is installed but root has no 'docker compose' (v2): nothing was changed. Add the plugin that matches this engine (docker-compose-plugin for docker-ce, docker-compose-v2 for Ubuntu's docker.io) yourself; this script never replaces a running Docker engine."
fi
uid1000="$(getent passwd 1000 | cut -d: -f1 || true)"
if [ -n "$uid1000" ] && [ "$uid1000" != "$DEPLOY_USER" ]; then
  info "NOTE: uid 1000 (the containers' user) is the account '${uid1000}' on this server: it will be able to change Coco's uploaded photos"
fi

step "Packages (only the missing ones; nothing already installed is upgraded)"
missing=()
for p in ca-certificates curl gnupg nginx certbot jq openssl age rsync; do
  if [ "$p" = certbot ] && [ -x /snap/bin/certbot ]; then continue; fi
  dpkg -s "$p" >/dev/null 2>&1 || missing+=("$p")
done
if [ "${#missing[@]}" -gt 0 ]; then
  apt-get update -qq
  apt-get install -y -qq --no-upgrade "${missing[@]}" >/dev/null
  info "installed: ${missing[*]}"
else
  info "all present"
fi
if ! command -v certbot >/dev/null 2>&1 && [ -x /snap/bin/certbot ]; then ln -sfn /snap/bin/certbot /usr/local/bin/certbot; fi
info "nginx $(nginx -v 2>&1 | sed 's#.*/##') · $(certbot --version 2>&1)"
if ! command -v docker >/dev/null 2>&1; then
  # shellcheck disable=SC1091
  . /etc/os-release
  install -d -m 755 /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' \
    "$(dpkg --print-architecture)" "${VERSION_CODENAME:-noble}" >/etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq --no-upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
  systemctl enable --now docker >/dev/null
  info "Docker installed"
fi
info "$(docker --version) · $(docker compose version)"

step "Coco's account (${DEPLOY_USER})"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "$GECOS" "$DEPLOY_USER" >/dev/null
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
info "$(grep -c '^ssh-' "$home/.ssh/authorized_keys" || true) key(s); docker group (= root on this box: guard the keys)"
if sshd -T 2>/dev/null | grep -qi '^allowusers'; then
  info "NOTE: sshd has an AllowUsers list; add ${DEPLOY_USER} to it yourself to log in as ${DEPLOY_USER}"
fi

step "sudo for ${DEPLOY_USER}: nginx test and reload only"
cat >/etc/sudoers.d/coco-deploy <<EOF
# Installed by infra/scripts/setup-shared-host.sh: what deploy.sh / rollback.sh need, nothing else.
${DEPLOY_USER} ALL=(root) NOPASSWD: /usr/sbin/nginx -t -q, /usr/sbin/nginx -t, /usr/bin/systemctl reload nginx
EOF
chmod 440 /etc/sudoers.d/coco-deploy
visudo -cf /etc/sudoers.d/coco-deploy >/dev/null
info "ok"

step "Folders (/opt/coco, production only)"
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /opt/coco /opt/coco/releases /opt/coco/src
install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /opt/coco/production /opt/coco/production/backups /opt/coco/production/reports
# Uploads: written by the containers (uid 1000, the image's node user), read by nginx. Customer request photos
# (media/demandes, Loi 25) are never served and stay unreadable to the server's other accounts.
install -d -m 755 -o 1000 -g 1000 /opt/coco/production/media
install -d -m 750 -o 1000 -g "$DEPLOY_USER" /opt/coco/production/media/demandes
chmod 711 /opt/coco/production
info "media readable by nginx (but not media/demandes); .env, backups and reports private"

step "systemd timers (Coco's own; none reboots the server)"
for unit in "$infra"/systemd/coco-backup@.* "$infra"/systemd/coco-restore-test@.* "$infra"/systemd/coco-image-prune.*; do
  sed "s/^User=deploy\$/User=${DEPLOY_USER}/" "$unit" >"/etc/systemd/system/$(basename "$unit")"
  chmod 644 "/etc/systemd/system/$(basename "$unit")"
done
systemctl daemon-reload
systemctl enable --now coco-image-prune.timer >/dev/null
info "enabled: coco-image-prune.timer (Coco images only); the jobs run as ${DEPLOY_USER}"
info "after the first deploy: systemctl enable --now coco-backup@production.timer coco-restore-test@production.timer"

step "nginx sites and certificate"
if ! systemctl is-active --quiet nginx; then systemctl enable --now nginx >/dev/null; fi
flags=(--shared --no-staging --public-host "$public" --admin-host "$admin" --port-base "$port_base")
if [ "$temporary" = 1 ]; then flags+=(--temporary); fi
if [ -n "$email" ]; then flags+=(--issue-certs "$email"); fi
DEPLOY_USER="$DEPLOY_USER" bash "$here/install-nginx.sh" "${flags[@]}"

step "Done. Next, as ${DEPLOY_USER} (infra/README.md › Shared server, steps 4-7): make-env.sh → build-image.sh → run-task.sh migrate, seed and accounts --tag <sha> → deploy.sh. The accounts come before deploy.sh: Studio must never open with no account."
