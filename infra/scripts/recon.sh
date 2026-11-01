#!/usr/bin/env bash
# Read-only survey of a server before Coco Vanille joins it: what serves the websites already there, which ports
# are taken, how much room is left. Changes nothing, prints no secret (no .env, keys, passwords, cron commands or
# full configs). Run as root; paste the output to the agency.
#   sudo bash infra/scripts/recon.sh
# Without a copy of the repository (Hostinger hPanel › VPS › Terminal), from the public repository, pinned to a commit:
#   curl -fsSL https://raw.githubusercontent.com/yahyahoussini/coco-vanille-granby/<sha>/infra/scripts/recon.sh | sudo bash
set -uo pipefail
export LC_ALL=C

h() { printf '\n## %s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

h "System"
# shellcheck disable=SC1091
. /etc/os-release 2>/dev/null && echo "os: ${PRETTY_NAME:-?} · kernel $(uname -r) · $(uname -m)"
echo "host: $(hostname -f 2>/dev/null || hostname) · up $(uptime -p 2>/dev/null)"
echo "cpu: $(nproc) · load $(cut -d' ' -f1-3 /proc/loadavg)"
free -h | awk 'NR==2{print "memory: " $2 " total, " $7 " available"} NR==3{print "swap: " $2 " total, " $3 " used"}'
df -h / | awk 'NR==2{print "disk /: " $2 " total, " $4 " free (" $5 " used)"}'
echo "time zone: $(timedatectl show -p Timezone --value 2>/dev/null || cat /etc/timezone 2>/dev/null)"

h "Listening TCP ports (process)"
ss -Hltnp 2>/dev/null | awk '{print $4, $6}' | sed -E 's/users:\(\("([^"]+)".*/\1/' | sort -t: -k2 -n -u | head -60

h "Web servers and panels present"
for b in nginx apache2 httpd lshttpd openlitespeed caddy traefik haproxy certbot; do
  if have "$b"; then echo "$b: $(command -v "$b")"; fi
done
[ -d /usr/local/lsws ] && echo "LiteSpeed/OpenLiteSpeed: /usr/local/lsws"
[ -d /home/clp ] || [ -f /etc/nginx/sites-enabled/clp ] && echo "panel: CloudPanel"
[ -d /data/coolify ] && echo "panel: Coolify (/data/coolify)"
[ -d /etc/dokploy ] && echo "panel: Dokploy (/etc/dokploy)"
[ -d /usr/local/CyberCP ] && echo "panel: CyberPanel"
[ -d /usr/local/hestia ] && echo "panel: HestiaCP"
[ -d /www/server/panel ] && echo "panel: aaPanel"
[ -d /etc/easypanel ] && echo "panel: Easypanel"
[ -d /usr/local/psa ] && echo "panel: Plesk"
[ -d /etc/webmin ] && echo "panel: Webmin"
if have systemctl; then
  systemctl list-units --type=service --state=running --no-legend --plain 2>/dev/null \
    | awk '{print $1}' | grep -E 'nginx|apache|httpd|lsws|litespeed|caddy|traefik|haproxy|docker|containerd|php|mysql|mariadb|postgres|redis|pm2|node' | sed 's/^/running: /'
fi

h "nginx sites (file · listen · server_name · where it sends traffic)"
if have nginx; then
  nginx -v 2>&1
  nginx -t 2>&1 | tail -n 2
  nginx -T 2>/dev/null | awk '
    /^# configuration file / { file = $4; sub(/:$/, "", file); next }
    /^[[:space:]]*#/ { next }
    /^[[:space:]]*listen[[:space:]]/ { gsub(/;/, ""); $1 = ""; print file " · listen" $0; next }
    /^[[:space:]]*server_name[[:space:]]/ { gsub(/;/, ""); $1 = ""; print file " · server_name" $0; next }
    /^[[:space:]]*(proxy_pass|root|fastcgi_pass)[[:space:]]/ { gsub(/;/, ""); print file " · " $1 " " $2; next }
  ' | sort -u | head -120
else
  echo "nginx: not installed"
fi

h "Docker"
if have docker; then
  docker --version
  docker compose version 2>/dev/null
  echo "containers (name · image · state · published ports · compose project):"
  docker ps -a --format '{{.Names}} · {{.Image}} · {{.State}} · {{.Ports}} · {{.Label "com.docker.compose.project"}}' 2>/dev/null | head -60
  echo "networks: $(docker network ls --format '{{.Name}}' 2>/dev/null | tr '\n' ' ')"
  docker system df 2>/dev/null | sed 's/^/df: /'
else
  echo "docker: not installed"
fi

h "TLS certificates (certbot)"
if have certbot; then
  certbot certificates 2>/dev/null | grep -E 'Certificate Name|Domains|Expiry' | sed 's/^ *//' | head -60
else
  echo "certbot: not installed"
fi

h "Firewall and SSH (settings only)"
if have ufw; then ufw status 2>/dev/null | head -20; fi
have sshd && sshd -T 2>/dev/null | grep -E '^(port|permitrootlogin|passwordauthentication|pubkeyauthentication|allowusers|allowgroups) ' | sort
echo "login users: $(awk -F: '$3 >= 1000 && $7 !~ /(nologin|false)$/ {print $1}' /etc/passwd | tr '\n' ' ')"

h "Scheduled jobs (names and schedules only)"
systemctl list-timers --all --no-legend --plain 2>/dev/null | awk '{print $(NF-1)}' | sort -u | tr '\n' ' '
echo
for f in /etc/crontab /etc/cron.d/* /var/spool/cron/crontabs/*; do
  [ -f "$f" ] && echo "$f: $(grep -cvE '^\s*(#|$)' "$f") line(s)"
done

h "Where the apps live (top-level folders only)"
for d in /opt /srv /var/www /home /root/apps /data; do
  [ -d "$d" ] && echo "$d: $(find "$d" -mindepth 1 -maxdepth 1 -printf '%f ' 2>/dev/null)"
done
[ -d /opt/coco ] && echo "Coco Vanille: /opt/coco already exists" || echo "Coco Vanille: not installed yet"

h "Ports Coco Vanille would use on 127.0.0.1"
for p in 3001 3002 3011 3012 55432 3999; do
  if ss -Hltn "( sport = :$p )" 2>/dev/null | grep -q .; then echo "$p: TAKEN"; else echo "$p: free"; fi
done
echo
echo "End of the survey. Nothing was changed."
