#!/usr/bin/env bash
# Proof that installing or deploying Coco Vanille left the other apps of a shared server alone. Records, for
# everything that is NOT Coco's, what an install could change: nginx files (checksums) and how nginx routes each
# socket (its default server and flags), the certificate a client without SNI gets, containers (id, image, state,
# start time, restart count), services (main pid and start time: a restart shows), listening ports, systemd units,
# cron files, certificates and renewal hooks, firewall, sshd, time zone, accounts, Docker daemon settings.
# Run it before and after; the two files must be identical.
#   sudo bash infra/scripts/snapshot.sh > /root/coco-before.txt
#   … setup-shared-host.sh, deploy.sh …
#   sudo bash infra/scripts/snapshot.sh > /root/coco-after.txt && diff /root/coco-before.txt /root/coco-after.txt && echo UNTOUCHED
# Expected differences only: packages setup-shared-host.sh had to install (nginx, certbot, Docker and their units).
# Coco's own items (its files and containers, /etc/nginx/coco, /opt/coco, its ports and its account) are left out on
# purpose. Read-only; prints checksums, never file contents. DEPLOY_USER (default coco) names Coco's account.
set -uo pipefail
export LC_ALL=C

DEPLOY_USER="${DEPLOY_USER:-coco}"
coco() { grep -vE '(^|[/ ·])(00-|zz-)?coco[-_.@]|/etc/nginx/coco/|/opt/coco|coco-production|coco-staging|coco-build-|/renewal/cocovanille[.]'; }
# The 127.0.0.1 sockets Coco's containers publish right now, and nothing else: a port another app holds stays
# listed, even one Coco would use by default.
coco_sockets="$(docker ps --filter name=^coco- --format '{{.Ports}}' 2>/dev/null | tr ',' '\n' | grep -oE '127\.0\.0\.1:[0-9]+' | sort -u | paste -sd'|' - || true)"
coco_sockets="$(printf '%s' "${coco_sockets:-none}" | sed 's/[.]/[.]/g')"

echo "# nginx files"
if [ -d /etc/nginx ]; then
  find /etc/nginx \( -type f -o -type l \) 2>/dev/null | sort | coco | while read -r f; do
    if [ -L "$f" ]; then echo "$f -> $(readlink "$f")"; else echo "$f $(sha256sum "$f" | cut -c1-16)"; fi
  done
fi

echo "# nginx routing: per socket, the default server (first loaded, or default_server) and the socket's flags"
if command -v nginx >/dev/null 2>&1; then
  nginx -T 2>/dev/null | awk '
    /^[[:space:]]*#/ { next }
    /^[[:space:]]*server[[:space:]]*\{/ { inserver = 1; depth = 0; n = 0; name = "" }
    inserver {
      line = $0
      if (line ~ /^[[:space:]]*listen[[:space:]]/) { gsub(/;/, "", line); sub(/^[[:space:]]*listen[[:space:]]+/, "", line); n++; L[n] = line }
      if (line ~ /^[[:space:]]*server_name[[:space:]]/) { gsub(/;/, "", line); sub(/^[[:space:]]*server_name[[:space:]]+/, "", line); name = line }
      o = gsub(/\{/, "{", $0); c = gsub(/\}/, "}", $0); depth += o - c
      if (depth <= 0) {
        for (i = 1; i <= n; i++) {
          split(L[i], p, /[[:space:]]+/); sock = p[1]; flags = ""
          for (j = 2; j in p; j++) flags = flags " " p[j]
          if (!(sock in first)) { first[sock] = name; order[++k] = sock }
          if (flags ~ /default_server/) dflt[sock] = name
          if (flags ~ /ssl/) ssl[sock] = 1
          if (flags ~ /http2/) h2[sock] = 1
        }
        inserver = 0
      }
    }
    END {
      for (i = 1; i <= k; i++) { s = order[i]; d = (s in dflt) ? dflt[s] : first[s]
        printf "%s default=%s%s%s\n", s, d, (s in ssl) ? " ssl" : "", (s in h2) ? " http2" : "" }
    }' | sort
fi
if command -v openssl >/dev/null 2>&1; then
  echo "# certificate for a client without SNI on 127.0.0.1:443"
  timeout 5 openssl s_client -connect 127.0.0.1:443 </dev/null 2>/dev/null | openssl x509 -noout -subject -fingerprint -sha256 2>/dev/null || echo "none"
fi

echo "# containers"
if command -v docker >/dev/null 2>&1; then
  docker ps -aq 2>/dev/null | xargs -r docker inspect -f '{{.Name}} {{.Id}} {{.Image}} {{.State.Status}} started={{.State.StartedAt}} restarts={{.RestartCount}}' 2>/dev/null | sed 's#^/##' | sort | coco
  echo "# docker networks and volumes"
  docker network ls --format '{{.Name}} {{.ID}}' 2>/dev/null | sort | coco
  docker volume ls --format '{{.Name}}' 2>/dev/null | sort | coco
  echo "# docker daemon"
  [ -f /etc/docker/daemon.json ] && sha256sum /etc/docker/daemon.json | cut -c1-16
fi

echo "# listening ports"
ss -Hltn 2>/dev/null | awk '{print $4}' | sort -u | grep -vxE "$coco_sockets"

echo "# running services (main pid and start time: a restart changes them, a reload does not)"
systemctl list-units --type=service --state=running --no-legend --plain 2>/dev/null | awk '{print $1}' | grep -v '^user@' | coco | sort | while read -r u; do
  echo "$u $(systemctl show -p MainPID -p ExecMainStartTimestamp --value "$u" 2>/dev/null | tr '\n' ' ')"
done
echo "# systemd unit files"
systemctl list-unit-files --no-legend --plain 2>/dev/null | awk '{print $1, $2}' | sort | coco

echo "# cron"
for f in /etc/crontab /etc/cron.d/* /var/spool/cron/crontabs/*; do
  [ -f "$f" ] && echo "$f $(sha256sum "$f" | cut -c1-16)"
done | coco

echo "# certificates and renewal hooks"
for f in /etc/letsencrypt/renewal/*.conf /etc/letsencrypt/renewal-hooks/*/*; do
  [ -f "$f" ] && echo "$f $(sha256sum "$f" | cut -c1-16)"
done | coco

echo "# firewall, sshd, time zone, accounts and groups"
command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | sha256sum | cut -c1-16
command -v sshd >/dev/null 2>&1 && sshd -T 2>/dev/null | sort | sha256sum | cut -c1-16
timedatectl show -p Timezone --value 2>/dev/null
awk -F: -v u="$DEPLOY_USER" '$1 != u {print $1, $3, $6, $7}' /etc/passwd | sha256sum | cut -c1-16
# Group lines without Coco's account in their member lists (Coco joins the docker group).
awk -F: -v u="$DEPLOY_USER" '$1 != u { n = split($4, m, ","); s = ""; for (i = 1; i <= n; i++) if (m[i] != u) s = s "," m[i]; print $1, $3, s }' /etc/group | sha256sum | cut -c1-16
swapon --show=NAME,SIZE --noheadings 2>/dev/null

echo "# out-of-memory kills since boot (any increase: journalctl -k names the process)"
grep '^oom_kill ' /proc/vmstat 2>/dev/null
echo "# packages (a new line is an expected install; a changed version is not)"
dpkg-query -W -f='${Package} ${Version}\n' 2>/dev/null | sort
