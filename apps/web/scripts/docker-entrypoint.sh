#!/bin/sh
# Container entrypoint (runs under tini). A command given to the container runs as is
# (`docker compose run --rm migrate` → npm run migrate); otherwise APP_ROLE picks the process.
set -eu

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

role="${APP_ROLE:-web}"
case "$role" in
  web | all)
    export PORT="${PORT:-3000}"
    exec node server.js
    ;;
  studio)
    export PORT="${PORT:-3001}"
    exec node server.js
    ;;
  worker)
    exec npm run --silent worker
    ;;
  *)
    echo "APP_ROLE must be web, studio, worker or all (got \"$role\")" >&2
    exit 64
    ;;
esac
