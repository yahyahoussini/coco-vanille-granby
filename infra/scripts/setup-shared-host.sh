#!/usr/bin/env bash
# Adds Coco Vanille to a server that already runs other apps (for example the agency's Hostinger VPS), without
# changing anything they rely on. Run once as root, safe to run again:
#   sudo DEPLOY_SSH_KEYS="$(cat coco_vps_ed25519.pub)" bash infra/scripts/setup-shared-host.sh \
#     --public-host cocovanille.<ip-with-dashes>.sslip.io --admin-host admin-cocovanille.<ip-with-dashes>.sslip.io \
#     --temporary --email you@example.com
# What it does: Docker if missing · nginx and certbot if missing (never upgraded) · the deploy user (docker group,
# sudo for nginx -t / reload only) · /opt/coco · Coco's systemd timers · Coco's nginx sites and certificate.
# What it never touches, unlike harden-vps.sh (for a dedicated server): the time zone, apt upgrades, ufw, sshd,
# fail2ban, swap, journald, /etc/docker/daemon.json, other nginx sites or the default_server, and no reboot timer.
# It stops before any change when ports 80/443 belong to something other than the host's nginx (a Docker proxy
# such as Traefik or Caddy, a panel): that case needs the proxy's own route to Coco's nginx (infra/README.md).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
infra="$(cd "$here/.." && pwd)"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
public=""
admin=""
email=""
temporary=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --public-host) public="${2:-}"; shift 2 ;;
    --admin-host) admin="${2:-}"; shift 2 ;;
    --email) email="${2:-}"; shift 2 ;;
    --temporary) temporary=1; shift ;;
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
export DEBIAN_FRONTEND=noninteractive

step "Who answers on ports 80 and 443"
owners="$(ss -Hltnp '( sport = :80 or sport = :443 )' 2>/dev/null | grep -o 'users:(("[^"]*"' | sed 's/users:(("//' | sort -u | tr '\n' ' ')"
info "${owners:-nobody}"
for o in $owners; do
  case "$o" in
    nginx) ;;
    *) die "ports 80/443 belong to '${o}', not to the host's nginx: nothing was changed. Route the two hosts from that proxy to Coco's nginx instead (infra/README.md › Shared server)." ;;
  esac
done

step "Coco's local ports are free"
busy=""
for p in 3001 3002 3011 3012 55432 3999; do
  if ss -Hltn "( sport = :$p )" 2>/dev/null | grep -q .; then
    if ! docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep -q "^coco-.*127.0.0.1:${p}->"; then busy="$busy $p"; fi
  fi
done
[ -z "$busy" ] || die "ports in use by another app:${busy} (set WEB_BLUE_PORT… in /opt/coco/production/.env, or BUILD_DB_PORT / SMOKE_PORT for build-image.sh)"
info "3001 3002 3011 3012 (production colours), 55432 and 3999 (builds)"

step "Packages (installed when missing, never upgraded)"
apt-get update -qq
apt-get install -y -qq --no-upgrade ca-certificates curl gnupg nginx certbot jq openssl age rsync >/dev/null
info "nginx $(nginx -v 2>&1 | sed 's#.*/##') · $(certbot --version 2>&1)"
if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
  # shellcheck disable=SC1091
  . /etc/os-release
  install -d -m 755 /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' \
    "$(dpkg --print-architecture)" "${VERSION_CODENAME:-noble}" >/etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
  systemctl enable --now docker >/dev/null
fi
info "$(docker --version) · $(docker compose version)"

step "Deploy user (${DEPLOY_USER})"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "Coco Vanille deploy" "$DEPLOY_USER" >/dev/null
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
if [ -f /etc/ssh/sshd_config ] && sshd -T 2>/dev/null | grep -qi '^allowusers'; then
  info "NOTE: sshd has an AllowUsers list; add ${DEPLOY_USER} to it yourself if you want to log in as ${DEPLOY_USER}"
fi

step "sudo for the deploy user: nginx test and reload only"
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
# Uploads: written by the containers (uid 1000, the image's node user), read by nginx.
install -d -m 755 -o 1000 -g 1000 /opt/coco/production/media
chmod 711 /opt/coco/production
info "media is readable by nginx; .env, backups and reports are not"

step "systemd timers (Coco's own; none reboots the server)"
install -m 644 "$infra"/systemd/coco-backup@.* "$infra"/systemd/coco-restore-test@.* "$infra"/systemd/coco-image-prune.* /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now coco-image-prune.timer >/dev/null
info "enabled: coco-image-prune.timer (Coco images only)"
info "after the first deploy: systemctl enable --now coco-backup@production.timer coco-restore-test@production.timer"

step "nginx sites and certificate"
systemctl enable --now nginx >/dev/null
flags=(--shared --no-staging --public-host "$public" --admin-host "$admin")
if [ "$temporary" = 1 ]; then flags+=(--temporary); fi
if [ -n "$email" ]; then flags+=(--issue-certs "$email"); fi
DEPLOY_USER="$DEPLOY_USER" bash "$here/install-nginx.sh" "${flags[@]}"

step "Done. Next (as ${DEPLOY_USER}): make-env.sh → build-image.sh → deploy.sh → npm run accounts (infra/README.md › Shared server)"
