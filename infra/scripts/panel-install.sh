#!/usr/bin/env bash
# From one commit of the repository to a live site, on a CyberPanel server, as root, with nothing else than a
# terminal on the server (Hostinger hPanel › Web console):
#   curl -fsSL https://raw.githubusercontent.com/yahyahoussini/coco-vanille-granby/<sha>/infra/scripts/panel-install.sh -o /root/panel-install.sh
#   nohup bash /root/panel-install.sh <sha> <public-host> <admin-host> <server-ip> </dev/null >/root/coco-install.log 2>&1 &
# (Downloaded first: a script piped into bash would have its next lines eaten by the commands it runs.)
# First time: code → setup-panel-host.sh → make-env.sh → build-image.sh → run-task.sh (migrate, seed, seed:catalogue,
# seed:journal, accounts) → deploy.sh, in that order: Studio never opens with no account. Next times, to ship a new
# commit: the same command; the database tasks are skipped (deploy.sh migrates), so nothing typed in Studio changes.
# Secrets are kept. The accounts' passwords go to /root/coco-accounts.txt (root only), printed once by
# src/seed/accounts.js; nothing else here prints a secret.
# Options (env): PORT_BASE=3000 · OWNER_EMAIL · OWNER_NAME · AGENCY_EMAIL · AGENCY_NAME · GUARD=show
set -euo pipefail

sha="${1:-}"
public="${2:-}"
admin="${3:-}"
ip="${4:-}"
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] && [ -n "$public" ] && [ -n "$admin" ] && [ -n "$ip" ] || {
  echo "usage: panel-install.sh <full commit sha> <public-host> <admin-host> <server-ip>" >&2
  exit 64
}
[ "$(id -u)" = 0 ] || { echo "run as root" >&2; exit 1; }
repo=yahyahoussini/coco-vanille-granby
port_base="${PORT_BASE:-3000}"
guard="${GUARD:-show}"
user="${DEPLOY_USER:-coco}"
src="/opt/coco/src/$sha"
release="/opt/coco/releases/$sha"
step() { printf '\n######## %s (%s)\n' "$*" "$(date -u +%H:%M:%S)"; }
as_coco() { runuser -u "$user" -- bash -c "cd /tmp && $1"; }

step "Code at ${sha:0:12}"
if [ ! -f "$src/apps/web/Dockerfile" ]; then
  mkdir -p "$src"
  curl -fsSL "https://codeload.github.com/${repo}/tar.gz/${sha}" | tar -xz --strip-components=1 -C "$src"
fi
ls "$src" | tr '\n' ' '
echo

step "Server (Docker, account, coco-edge, CyberPanel websites, certificates)"
flags=(--public-host "$public" --admin-host "$admin" --server-ip "$ip" --port-base "$port_base")
if [ "$guard" = show ]; then flags+=(--temporary); fi
bash "$src/infra/scripts/setup-panel-host.sh" "${flags[@]}"
chown -R "$user:$user" "$src"

step "Secrets and settings (/opt/coco/production/.env, values not printed)"
as_coco "rm -rf '$release' && cp -r '$src/infra' '$release' && bash '$release/scripts/make-env.sh' production --public-host '$public' --admin-host '$admin' --guard '$guard' --port-base '$port_base'"

step "Image"
if docker image inspect "coco-vanille-web:${sha}" >/dev/null 2>&1; then
  echo "    coco-vanille-web:${sha:0:12} is already built"
else
  as_coco "bash '$release/scripts/build-image.sh' production '$src' '$sha'"
fi

if grep -q '^LIVE_COLOR=.' /opt/coco/production/state.env 2>/dev/null; then
  step "Database tasks skipped: the site is live, what was typed in Studio stays (deploy.sh migrates)"
else
  step "Database: migrations, verified seed, the shop's products, the Journal"
  for task in migrate seed seed:catalogue seed:launch seed:journal; do
    echo "--- $task"
    as_coco "bash '$release/scripts/run-task.sh' production '$task' --tag '$sha'" 2>&1 | grep -vE 'Pulling schema' | tail -8
  done

  step "Accounts (passwords in /root/coco-accounts.txt, root only)"
  touch /root/coco-accounts.txt
  chmod 600 /root/coco-accounts.txt
  as_coco "bash '$release/scripts/run-task.sh' production accounts --tag '$sha' -e 'OWNER_EMAIL=${OWNER_EMAIL:-proprietaire@cocovanillegranby.com}' -e 'OWNER_NAME=${OWNER_NAME:-Propriétaire}' -e 'AGENCY_EMAIL=${AGENCY_EMAIL:-agence@cocovanillegranby.com}' -e 'AGENCY_NAME=${AGENCY_NAME:-Agence}'" >>/root/coco-accounts.txt 2>&1 || {
    echo "accounts failed: see the last lines of /root/coco-accounts.txt"
    exit 1
  }
  grep -cE 'created|kept' /root/coco-accounts.txt || true
fi

step "Deploy"
as_coco "bash '$release/scripts/deploy.sh' production '$sha'"

step "Nightly database copy (on this server's disk until BACKUP_REMOTES names an off-site bucket)"
systemctl enable --now coco-backup@production.timer coco-restore-test@production.timer >/dev/null
as_coco "bash /opt/coco/production/infra/scripts/backup.sh production" 2>&1 | tail -3 || echo "first backup failed: see backup.sh"

step "From the outside"
for url in "https://$public/" "https://$public/gateaux/" "https://$public/robots.txt" "https://$admin/connexion/"; do
  printf '%s  %s\n' "$(curl -s -o /dev/null -m 30 -w '%{http_code}' "$url" || true)" "$url"
done
echo
echo "COCO INSTALL DONE"
