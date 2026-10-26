#!/usr/bin/env bash
# Restore test (17 §8.4): restores a dump into a throwaway Postgres 16 container (no network), counts
# the rows of every table, checks the result and writes <env>/reports/restore-test.json (+ a dated
# copy). Monthly by systemd (infra/systemd/coco-restore-test@.timer). The time taken is our RTO.
#   bash /opt/coco/<env>/infra/scripts/restore-test.sh <production|staging>
#        [--dump FILE]                      a given .dump (default: the newest local dump)
#        [--remote REMOTE --identity KEY]   the newest encrypted copy on REMOTE, decrypted with the
#                                           offline age key (the quarterly off-site test, 17 §8.5)
# Checks: tables restored · users and pages tables present · orders count not lower than the last
# report · with EXPECT_RECENT_ORDERS=true (ordering live), the newest order is under 48 h old.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
shift || true
require_env_name "$ENV_NAME"
dump=""
remote=""
identity=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dump) dump="${2:-}"; shift 2 ;;
    --remote) remote="${2:-}"; shift 2 ;;
    --identity) identity="${2:-}"; shift 2 ;;
    *) die "unknown option: $1" ;;
  esac
done

dir="$(env_dir "$ENV_NAME")"
reports="$dir/reports"
mkdir -p "$reports"
require_cmd docker jq
work="$(mktemp -d)"
container="coco-restore-test-${ENV_NAME}-$$"
cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  rm -rf "$work"
}
trap cleanup EXIT

step "Choosing the dump"
source_label=""
if [ -n "$remote" ]; then
  require_cmd rclone age
  identity="${identity:-$(env_get AGE_IDENTITY_FILE)}"
  [ -s "$identity" ] || die "--remote needs the age private key (--identity or AGE_IDENTITY_FILE)"
  base="${remote%/}/coco/${ENV_NAME}/daily"
  latest="$(rclone lsf --files-only "$base" | grep '\.dump\.age$' | sort | tail -n 1)"
  [ -n "$latest" ] || die "no encrypted dump in ${base}"
  rclone copyto "${base}/${latest}" "$work/${latest}"
  age -d -i "$identity" -o "$work/restore.dump" "$work/${latest}"
  dump="$work/restore.dump"
  source_label="${base}/${latest}"
elif [ -z "$dump" ]; then
  dump="$(find "$dir/backups" -maxdepth 1 -type f -name "coco-${ENV_NAME}-*.dump" -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -n 1 | cut -d' ' -f2-)"
  [ -n "$dump" ] || die "no dump in $dir/backups (run backup.sh first)"
fi
[ -s "$dump" ] || die "dump not found or empty: $dump"
source_label="${source_label:-$dump}"
dump_time="$(date -u -d "@$(stat -c %Y "$dump")" +%FT%TZ)"
info "${source_label} (written ${dump_time})"

step "Starting a scratch Postgres 16 (no network)"
docker run -d --rm --name "$container" --network none \
  -e POSTGRES_PASSWORD="restore-$(od -An -N8 -tx8 /dev/urandom | tr -d ' ')" -e POSTGRES_DB=restore \
  postgres:16 >/dev/null
for _ in $(seq 1 60); do
  if docker exec "$container" pg_isready -U postgres -d restore >/dev/null 2>&1; then break; fi
  sleep 1
done
docker exec "$container" pg_isready -U postgres -d restore >/dev/null || die "scratch Postgres did not start"
psql_q() { docker exec "$container" psql -U postgres -d restore -At -v ON_ERROR_STOP=1 -c "$1"; }

step "Restoring"
started="$(date +%s)"
docker exec -i "$container" pg_restore -U postgres -d restore --no-owner --no-privileges --exit-on-error <"$dump"
seconds=$(($(date +%s) - started))
info "restored in ${seconds} s"

step "Counting rows"
tables="$(psql_q "select coalesce(json_object_agg(t.table_name, (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', t.table_schema, t.table_name), false, true, '')))[1]::text::bigint order by t.table_name), '{}'::json) from information_schema.tables t where t.table_schema = 'public' and t.table_type = 'BASE TABLE'")"
table_count="$(jq 'length' <<<"$tables")"
info "${table_count} tables"
jq -r 'to_entries[] | "    \(.key): \(.value)"' <<<"$tables" | head -n 60

step "Checks"
previous_orders="$(jq -r '.tables.orders // empty' "$reports/restore-test.json" 2>/dev/null || true)"
orders="$(jq -r '.orders // empty' <<<"$tables")"
newest_order_hours=""
if [ -n "$orders" ] && [ "$orders" -gt 0 ]; then
  newest_order_hours="$(psql_q "select round(extract(epoch from now() - max(created_at)) / 3600, 1) from orders")"
fi
checks="$(jq -n \
  --argjson tables "$tables" \
  --arg previous "$previous_orders" \
  --arg newest "$newest_order_hours" \
  --arg expect_recent "${EXPECT_RECENT_ORDERS:-false}" '
  def check(name; ok; detail): {name: name, ok: ok, detail: detail};
  [
    check("tables restored"; ($tables | length) > 0; "\($tables | length) tables"),
    check("users table present"; $tables | has("users"); "users: \($tables.users // "missing")"),
    check("pages table present"; $tables | has("pages"); "pages: \($tables.pages // "missing")"),
    (if $previous == "" or ($tables | has("orders") | not) then check("orders not fewer than last test"; true; "no earlier figure")
     else check("orders not fewer than last test"; ($tables.orders >= ($previous | tonumber)); "\($tables.orders) now, \($previous) last time") end),
    (if $expect_recent != "true" then check("newest order under 48 h"; true; "not checked (EXPECT_RECENT_ORDERS is not true)")
     elif $newest == "" then check("newest order under 48 h"; false; "no orders in the dump")
     else check("newest order under 48 h"; (($newest | tonumber) < 48); "\($newest) h old") end)
  ]')"
ok="$(jq 'all(.ok)' <<<"$checks")"
jq -r '.[] | "    \(if .ok then "ok  " else "FAIL" end) \(.name): \(.detail)"' <<<"$checks"

step "Writing the report"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
jq -n \
  --arg env "$ENV_NAME" \
  --arg source "$source_label" \
  --arg dumpWrittenAt "$dump_time" \
  --arg testedAt "$(date -u +%FT%TZ)" \
  --argjson seconds "$seconds" \
  --argjson tables "$tables" \
  --argjson checks "$checks" \
  --argjson ok "$ok" \
  '{ok: $ok, env: $env, source: $source, dumpWrittenAt: $dumpWrittenAt, testedAt: $testedAt,
    restoreSeconds: $seconds, tableCount: ($tables | length), tables: $tables, checks: $checks}' \
  >"$reports/restore-test-${stamp}.json"
cp "$reports/restore-test-${stamp}.json" "$reports/restore-test.json"
info "$reports/restore-test.json"

if [ "$ok" = true ]; then
  heartbeat "$(env_get HEARTBEAT_RESTORE_TEST_URL)"
  step "Restore test passed (${seconds} s)"
else
  die "restore test failed: see $reports/restore-test.json"
fi
