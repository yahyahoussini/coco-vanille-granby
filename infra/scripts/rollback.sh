#!/usr/bin/env bash
# Rollback = switch nginx back to the previous colour (seconds while it still runs, about 15 s once
# retired: its stopped containers start again). Run as the deploy user on the VPS:
#   bash /opt/coco/<env>/infra/scripts/rollback.sh <production|staging>
# The database is not rolled back: migrations are expand-only, so the previous code still works on
# it. Last resort only (orders since the dump are lost): restore the pre-deploy dump, README › Rollback.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
require_env_name "$ENV_NAME"
dir="$(env_dir "$ENV_NAME")"
KEEP_PREVIOUS_MINUTES="${KEEP_PREVIOUS_MINUTES:-10}"

step "Reading the state of ${ENV_NAME}"
require_cmd docker curl flock
[ -f "$dir/state.env" ] || die "no $dir/state.env: nothing was deployed here"
exec 9>"$dir/.deploy.lock"
flock -n 9 || die "a deploy or rollback is running for ${ENV_NAME}"
live="$(state_get LIVE_COLOR)"
previous="$(state_get PREVIOUS_COLOR)"
[ -n "$live" ] || die "no live colour recorded"
[ -n "$previous" ] && [ "$previous" != "$live" ] || die "no previous colour to go back to (first deploy?): redeploy an older tag with deploy.sh"
previous_tag="$(state_get "$(upper "$previous")_TAG")"
[ -n "$previous_tag" ] || die "no tag recorded for ${previous}"
info "live ${live} ($(state_get "$(upper "$live")_TAG")) → back to ${previous} (${previous_tag})"

step "Starting ${previous} (${previous_tag})"
compose --profile "$previous" up -d --no-deps "web-$previous" "studio-$previous"
wait_healthy "$previous" || die "${previous} is not healthy: still on ${live}"

step "Switching nginx to ${previous}"
switch_upstream "$previous"
state_set LIVE_COLOR "$previous"
state_set PREVIOUS_COLOR "$live"
state_set DEPLOYED_TAG "$previous_tag"
state_set DEPLOYED_AT "$(date -u +%FT%TZ)"
state_set ROLLED_BACK_FROM "$(state_get "$(upper "$live")_TAG")"

step "Worker on ${previous_tag}"
state_set WORKER_TAG "$previous_tag"
compose up -d --no-deps --force-recreate worker

step "Rolled-back colour"
retire_later "$live" "$KEEP_PREVIOUS_MINUTES"

step "Done"
info "${ENV_NAME}: ${previous} live on ${previous_tag}. The database was not touched."
