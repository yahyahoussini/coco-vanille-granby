#!/usr/bin/env bash
# Stops the web + studio containers of a colour after a delay, unless that colour is live again
# (a rollback happened meanwhile). Started in the background by deploy.sh and rollback.sh.
# The stopped containers stay on disk: rollback.sh starts them again in seconds.
# Usage: retire.sh <production|staging> <blue|green> [minutes]
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
colour="${2:-}"
minutes="${3:-10}"
require_env_name "$ENV_NAME"
case "$colour" in blue | green) ;; *) die "colour must be blue or green" ;; esac
[[ "$minutes" =~ ^[0-9]+$ ]] || die "minutes must be a number"

step "Waiting ${minutes} min before stopping ${colour} (${ENV_NAME})"
sleep $((minutes * 60))

exec 9>"$(env_dir "$ENV_NAME")/.deploy.lock"
flock 9
if [ "$(state_get LIVE_COLOR)" = "$colour" ]; then
  info "${colour} is live again: left running"
  exit 0
fi
step "Stopping ${colour}"
compose --profile "$colour" stop "web-$colour" "studio-$colour"
info "stopped (rollback.sh starts it again)"
