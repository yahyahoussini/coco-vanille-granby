#!/usr/bin/env bash
# Day-0 hardening of a fresh Ubuntu 24.04 VPS (17 §8.1). Run once as root, safe to run again:
#   sudo DEPLOY_SSH_KEYS="$(cat ~/.ssh/id_ed25519.pub)" bash infra/scripts/harden-vps.sh
# DEPLOY_SSH_KEYS: one or more public keys (newline-separated) for the deploy user: your own key and
# the CI key (the public half of the VPS_SSH_KEY secret). Password and root logins are switched off
# only once the deploy user has a key, so the script cannot lock you out.
# Optional: DEPLOY_USER=deploy · EXTRA_SSH_USERS="agence" (other accounts allowed to log in) · SWAP_GB=2
# Steps: timezone · packages · Docker · deploy user · SSH keys only · ufw 22/80/443 · fail2ban ·
# unattended-upgrades (reboot window Monday 03:00) · swap · journald cap · folders · sudo rules ·
# systemd timers (installed, enabled after the first deploy: README) · nginx configs.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
infra="$(cd "$here/.." && pwd)"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
EXTRA_SSH_USERS="${EXTRA_SSH_USERS:-}"
SWAP_GB="${SWAP_GB:-2}"
step() { printf '\n==> %s\n' "$*"; }
info() { printf '    %s\n' "$*"; }
die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

[ "$(id -u)" = 0 ] || die "run as root (sudo)"
# shellcheck disable=SC1091
. /etc/os-release
if [ "${ID:-}" != ubuntu ] || [ "${VERSION_ID:-}" != 24.04 ]; then
  printf 'WARN: written for Ubuntu 24.04, this is %s %s\n' "${ID:-?}" "${VERSION_ID:-?}" >&2
fi
export DEBIAN_FRONTEND=noninteractive

step "Timezone America/Toronto"
timedatectl set-timezone America/Toronto
info "$(date)"

step "Packages"
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq ca-certificates curl gnupg ufw fail2ban unattended-upgrades apt-listchanges \
  nginx certbot jq age rclone rsync git openssl
info "installed"

step "Docker Engine + Compose plugin (download.docker.com)"
if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
  install -d -m 755 /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' \
    "$(dpkg --print-architecture)" "${VERSION_CODENAME:-noble}" >/etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
install -d -m 755 /etc/docker
if [ ! -f /etc/docker/daemon.json ]; then
  # Log rotation for every container (Compose sets it too); containers survive a daemon restart.
  printf '{\n  "log-driver": "json-file",\n  "log-opts": { "max-size": "10m", "max-file": "3" },\n  "live-restore": true\n}\n' >/etc/docker/daemon.json
  systemctl restart docker
fi
systemctl enable --now docker >/dev/null
info "$(docker --version) · $(docker compose version)"

step "Deploy user (${DEPLOY_USER})"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "Coco Vanille deploy" "$DEPLOY_USER"
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
keys="$(grep -c '^ssh-' "$home/.ssh/authorized_keys" || true)"
info "${keys} authorised key(s); in the docker group (Docker access = root on this box: guard the keys)"

step "SSH: keys only, no root login"
if [ "$keys" -gt 0 ]; then
  cat >/etc/ssh/sshd_config.d/10-coco.conf <<EOF
# Installed by infra/scripts/harden-vps.sh (17 §8.1 #2)
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
AuthenticationMethods publickey
MaxAuthTries 3
X11Forwarding no
AllowUsers ${DEPLOY_USER}${EXTRA_SSH_USERS:+ $EXTRA_SSH_USERS}
EOF
  sshd -t
  systemctl reload ssh 2>/dev/null || systemctl restart ssh
  info "applied (open a second session as ${DEPLOY_USER} before closing this one)"
else
  info "SKIPPED: ${DEPLOY_USER} has no SSH key yet; set DEPLOY_SSH_KEYS and run again"
fi

step "Firewall: ufw allows 22 (rate-limited), 80, 443"
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw limit 22/tcp >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null
info "Docker-published ports bypass ufw: compose publishes on 127.0.0.1 only and never Postgres"
ufw status | sed 's/^/    /'

step "fail2ban (sshd + nginx rate-limit jail)"
cat >/etc/fail2ban/jail.d/coco.local <<'EOF'
# Installed by infra/scripts/harden-vps.sh
[sshd]
enabled = true
backend = systemd
maxretry = 5
bantime = 1h

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/admin.error.log
          /var/log/nginx/staging.error.log
maxretry = 10
findtime = 10m
bantime = 1h
EOF
touch /var/log/nginx/admin.error.log /var/log/nginx/staging.error.log
systemctl enable fail2ban >/dev/null
systemctl restart fail2ban
info "$(fail2ban-client status | tr '\n' ' ')"

step "unattended-upgrades (security), reboots only in the Monday 03:00 window"
cat >/etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
cat >/etc/apt/apt.conf.d/52coco-unattended <<'EOF'
// Installed by infra/scripts/harden-vps.sh: the reboot happens in coco-reboot-window.timer (Monday 03:00).
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF
systemctl enable --now unattended-upgrades >/dev/null
info "on"

step "Swap (${SWAP_GB} GB)"
if swapon --show=NAME --noheadings | grep -q .; then
  info "already on: $(swapon --show=NAME,SIZE --noheadings | tr '\n' ' ')"
else
  fallocate -l "${SWAP_GB}G" /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || printf '/swapfile none swap sw 0 0\n' >>/etc/fstab
  info "created /swapfile"
fi
printf 'vm.swappiness=10\n' >/etc/sysctl.d/90-coco-swap.conf
sysctl -q --system

step "journald capped at 500 MB"
install -d -m 755 /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=500M\n' >/etc/systemd/journald.conf.d/coco.conf
systemctl restart systemd-journald

step "Folders (/opt/coco)"
for env in production staging; do
  install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/opt/coco/$env" "/opt/coco/$env/backups" "/opt/coco/$env/reports"
  # Uploads: written by the containers (uid 1000), read by nginx.
  install -d -m 755 -o 1000 -g 1000 "/opt/coco/$env/media"
done
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /opt/coco /opt/coco/releases
chmod 711 /opt/coco/production /opt/coco/staging
info "media is readable by nginx; .env, backups and reports are not"

step "sudo for the deploy user: nginx test and reload only"
cat >/etc/sudoers.d/coco-deploy <<EOF
# Installed by infra/scripts/harden-vps.sh: what deploy.sh / rollback.sh need, nothing else.
${DEPLOY_USER} ALL=(root) NOPASSWD: /usr/sbin/nginx -t -q, /usr/sbin/nginx -t, /usr/bin/systemctl reload nginx
EOF
chmod 440 /etc/sudoers.d/coco-deploy
visudo -cf /etc/sudoers.d/coco-deploy >/dev/null
info "ok"

step "systemd units (backup, restore test, image prune, reboot window)"
install -m 644 "$infra"/systemd/*.service "$infra"/systemd/*.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now coco-reboot-window.timer coco-image-prune.timer >/dev/null
info "enabled: coco-reboot-window.timer, coco-image-prune.timer"
info "after the first production deploy: systemctl enable --now coco-backup@production.timer coco-restore-test@production.timer"

step "nginx"
systemctl enable --now nginx >/dev/null
DEPLOY_USER="$DEPLOY_USER" STAGING_AUTH_USER="${STAGING_AUTH_USER:-}" STAGING_AUTH_PASSWORD="${STAGING_AUTH_PASSWORD:-}" \
  bash "$here/install-nginx.sh"

step "Done. Next: infra/README.md › First deploy (registry login, .env files, DNS, certificates)"
