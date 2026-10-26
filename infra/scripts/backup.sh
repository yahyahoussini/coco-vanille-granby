#!/usr/bin/env bash
# Postgres backup of one environment (17 §8.4): pg_dump -Fc → age (public key) → every rclone remote
# in BACKUP_REMOTES (two buckets in Québec at two providers, 17 §7.4) → retention → heartbeat.
# Nightly by systemd (infra/systemd/coco-backup@.timer) and before every migration (deploy.sh).
#   bash /opt/coco/<env>/infra/scripts/backup.sh <production|staging> [--label pre-<sha>] [--local-only]
# Remote layout: <remote>/coco/<env>/{daily,monthly,predeploy}/coco-<env>-<UTC stamp>[-label].dump.age
# The local copy stays unencrypted on the VPS (same disk as the live database, chmod 600) so the
# monthly restore test can run there without the private key; only encrypted copies leave the box.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
shift || true
require_env_name "$ENV_NAME"
label=""
local_only=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --label) label="${2:-}"; shift 2 ;;
    --local-only) local_only=1; shift ;;
    *) die "unknown option: $1" ;;
  esac
done
[[ -z "$label" || "$label" =~ ^[A-Za-z0-9_.-]{1,40}$ ]] || die "label: letters, digits, . _ - only"

dir="$(env_dir "$ENV_NAME")"
backups="$dir/backups"
db_user="$(env_get POSTGRES_USER coco)"
db_name="$(env_get POSTGRES_DB coco)"
remotes="$(env_get BACKUP_REMOTES)"
recipients="$(env_get AGE_RECIPIENTS_FILE /opt/coco/age-recipients.txt)"
keep_daily="$(env_get BACKUP_KEEP_DAILY 30)"
keep_monthly="$(env_get BACKUP_KEEP_MONTHLY 12)"
keep_local="$(env_get BACKUP_KEEP_LOCAL 7)"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
name="coco-${ENV_NAME}-${stamp}${label:+-$label}.dump"
kind=daily
if [ -n "$label" ]; then kind=predeploy; fi
umask 077
mkdir -p "$backups"

step "Dumping ${db_name} (${ENV_NAME})"
require_cmd docker
compose exec -T db pg_dump -U "$db_user" -d "$db_name" -Fc >"$backups/${name}.partial"
mv "$backups/${name}.partial" "$backups/${name}"
size="$(stat -c %s "$backups/${name}")"
[ "$size" -gt 0 ] || die "empty dump"
info "${backups}/${name} (${size} bytes)"

step "Checking the archive (pg_restore --list)"
entries="$(compose exec -T db pg_restore --list <"$backups/${name}" | grep -vc '^;' || true)"
[ "$entries" -gt 0 ] || die "pg_restore cannot read the dump"
info "${entries} entries"

if [ "$local_only" = 1 ] || [ -z "$remotes" ]; then
  step "Off-site copies"
  info "skipped (${remotes:+--local-only}${remotes:-BACKUP_REMOTES is empty}): local copy only"
else
  step "Encrypting with age (public key only on this server)"
  require_cmd age rclone
  [ -s "$recipients" ] || die "age recipients file missing: ${recipients}"
  age -R "$recipients" -o "$backups/${name}.age" "$backups/${name}"
  trap 'rm -f "$backups/${name}.age"' EXIT
  local_size="$(stat -c %s "$backups/${name}.age")"

  for remote in $remotes; do
    step "Uploading to ${remote}"
    base="${remote%/}/coco/${ENV_NAME}"
    rclone copyto "$backups/${name}.age" "${base}/${kind}/${name}.age"
    remote_size="$(rclone size --json "${base}/${kind}/${name}.age" | sed -n 's/.*"bytes":\([0-9]*\).*/\1/p')"
    [ "$remote_size" = "$local_size" ] || die "${remote}: size mismatch (${remote_size:-none} vs ${local_size})"
    info "${base}/${kind}/${name}.age (${remote_size} bytes)"
    if [ "$kind" = daily ] && [ "$(date -u +%d)" = 01 ]; then
      rclone copyto "${base}/daily/${name}.age" "${base}/monthly/${name}.age"
      info "monthly copy kept ${keep_monthly} months"
    fi
    step "Retention on ${remote}"
    rclone delete --min-age "${keep_daily}d" "${base}/daily" 2>/dev/null || true
    rclone delete --min-age "${keep_daily}d" "${base}/predeploy" 2>/dev/null || true
    rclone delete --min-age "$((keep_monthly * 31))d" "${base}/monthly" 2>/dev/null || true
    info "daily and pre-deploy: ${keep_daily} days · monthly: ${keep_monthly} months"
    if [ -z "$label" ] && [ -d "$dir/media" ]; then
      step "Uploads (media/) to ${remote}"
      # copy, not sync: a photo deleted on the site stays in the backup (public files, not encrypted).
      rclone copy "$dir/media" "${base}/media"
      info "${base}/media"
    fi
  done
fi

step "Local retention (${keep_local} nightly + 5 pre-deploy dumps)"
prune() {
  local keep="$1"
  shift
  # Newest first; delete everything after the first $keep.
  find "$backups" -maxdepth 1 -type f "$@" -printf '%T@ %p\n' | sort -rn | awk -v keep="$keep" 'NR > keep { sub(/^[^ ]+ /, ""); print }' |
    while IFS= read -r old; do
      rm -f -- "$old"
      info "removed $(basename "$old")"
    done
}
prune "$keep_local" -name "coco-${ENV_NAME}-*Z.dump"
prune 5 -name "coco-${ENV_NAME}-*Z-*.dump"

step "Heartbeat"
if [ -z "$label" ]; then
  heartbeat "$(env_get HEARTBEAT_BACKUP_URL)"
  info "sent (if HEARTBEAT_BACKUP_URL is set)"
else
  info "not for pre-deploy dumps"
fi
step "Backup done: ${name}"
