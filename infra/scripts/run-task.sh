#!/usr/bin/env bash
# Runs one npm script of the app (migrate, seed, accounts) once, in a throwaway container, on the environment's
# database. Run as the deploy user:
#   bash run-task.sh production seed                                       (the image live in production)
#   bash run-task.sh production accounts --tag <sha> -e OWNER_EMAIL=… -e AGENCY_EMAIL=…
# --tag runs an image before its first deploy: on a new server, migrate, seed and create the accounts BEFORE
# deploy.sh opens Studio, so Payload's « create first user » screen is never reachable. Extra -e KEY=VALUE pairs
# reach that one run only (nothing is written to .env).
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
release="$(cd "$here/.." && pwd)"
# shellcheck source=infra/scripts/lib.sh
. "$here/lib.sh"

ENV_NAME="${1:-}"
task="${2:-}"
require_env_name "$ENV_NAME"
case "$task" in
  migrate | seed | accounts) ;;
  *) die "usage: run-task.sh <env> <migrate|seed|accounts> [--tag <image-tag>] [-e KEY=VALUE …]" ;;
esac
shift 2
tag=""
extra=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --tag) tag="${2:-}"; shift 2 ;;
    -e)
      [[ "${2:-}" =~ ^[A-Z][A-Z0-9_]*=.*$ ]] || die "-e needs KEY=VALUE"
      extra+=(-e "$2")
      shift 2
      ;;
    *) die "unknown option: $1" ;;
  esac
done
require_cmd docker
dir="$(env_dir "$ENV_NAME")"
[ -f "$dir/.env" ] || die "$dir/.env is missing (make-env.sh)"
touch "$dir/state.env"
# Before the first deploy the environment has no compose file yet: use this release's.
[ -f "$dir/docker-compose.yml" ] || cp "$release/docker-compose.yml" "$dir/docker-compose.yml"
tag="${tag:-$(state_get DEPLOYED_TAG)}"
[[ "$tag" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]] || die "no image tag: pass --tag <sha> (nothing deployed yet in ${ENV_NAME})"
info "npm run ${task} on ${tag:0:12} (${ENV_NAME})"
DEPLOY_TAG="$tag" compose --profile ops run --rm "${extra[@]}" migrate npm run --silent "$task"
