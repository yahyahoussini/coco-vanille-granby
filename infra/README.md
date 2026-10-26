# infra · running Coco Vanille on the VPS

Runbook for the self-hosted stack decided in `research/17-vps-self-hosting-and-domain.md` (17 below) and `research/19-build-workflow-and-requirements.md` §1. One image, three processes, one Postgres, nginx in front, blue/green deploys from GitHub Actions.

```
GitHub Actions ── ci.yml (every PR) ── deploy-staging.yml (push to main) ── deploy-prod.yml (manual + approval)
      │ image ghcr.io/yahyahoussini/coco-vanille-granby:<git sha>
      ▼ SSH (deploy user) → /opt/coco/releases/<sha>/scripts/deploy.sh <env> <sha>
VPS (Québec) · nginx :80/:443 ──► 127.0.0.1:3001|3011 web-blue|green   (cocovanillegranby.com)
                              ──► 127.0.0.1:3002|3012 studio-blue|green (admin.cocovanillegranby.com)
                              ──► 127.0.0.1:3101…3112 staging pair (basic auth + noindex)
             Docker: db (Postgres 16, private network) · migrate (one-shot) · worker (one)
             systemd: backup 02:15 · restore test 1st Monday · image prune · reboot window · certbot
```

## What is where

| Path | What |
|---|---|
| `apps/web/Dockerfile`, `.dockerignore` | The image. `APP_ROLE=web` (:3000), `studio` (:3001), `worker` (`npm run worker`); `npm run migrate` / `npm run seed` as one-off commands. HEALTHCHECK on `/svc/health/?shallow=1` |
| `apps/web/scripts/gate.mjs` | rank-first gate against a running server: audit + links, fails unless every FAIL is a `[[FACT NEEDED]]` marker, writes the owner's to-do list |
| `apps/web/scripts/rank-config.mjs` | `site.config.json` for the rank-first tools, from `src/lib/routes.js` and `data/facts.json` |
| `infra/docker-compose.yml` | One environment: db, migrate, web/studio × blue/green, worker |
| `infra/.env.example` | Every variable, commented. Copied to `/opt/coco/<env>/.env` |
| `infra/nginx/` | `conf.d/coco.conf` (log format, rate limits, gzip), `snippets/` (TLS, HSTS, proxy), `sites/` (public, admin, staging pair, 444 default), `html/50x.html`. The public host serves uploads from `MEDIA_DIR` at `/media/<file>` (the URLs the templates write, `src/lib/media.js`) and 404s `/media/demandes/` (customer request photos, Studio only); `src/app/media/[...file]/route.js` does the same when Node serves it (dev, standalone) |
| `infra/scripts/` | `harden-vps.sh`, `install-nginx.sh`, `deploy.sh`, `rollback.sh`, `retire.sh`, `backup.sh`, `restore-test.sh`, `nginx-test.sh`, `lib.sh` |
| `infra/systemd/` | `coco-backup@`, `coco-restore-test@`, `coco-image-prune`, `coco-reboot-window` (service + timer) |
| `.github/workflows/` | `ci.yml`, `deploy-staging.yml`, `deploy-prod.yml`, `weekly.yml` |

## Who does what

| Yahya (operator) | CI (GitHub Actions) | The VPS on its own |
|---|---|---|
| Orders the VPS **in the owner's account**, sets DNS, runs `harden-vps.sh` once | On every PR: build, unit tests, Playwright, rank-first gate, infra checks. Red = no merge | Nightly backup 02:15, encrypted, two buckets |
| Writes the two `.env` files, the GitHub secrets, the rclone remotes, keeps the age private key offline | On merge to `main`: image → GHCR → staging deploy → gate on staging | Monthly restore test (1st Monday 03:30) |
| Reviews staging on a phone, approves the production run | On approval: same image to production, then `check-urls` + `crawler-access` from outside | Reboot only in the Monday 03:00 window, only if an update needs it |
| Friday checklist (30 min), monthly log review, quarterly key rotation and off-site restore drill | Monday 06:00 (Toronto): rank-first measurements, report in the run summary | Certificate renewal (certbot timer), weekly image prune |
| Sends the owner the to-do list from the gate (`owner-todo.md`) | Owner facts stay `[[FACT NEEDED]]`; `PUBLISH_GUARD=strict` keeps those pages off production | — |

## Prerequisites

| Item | Requirement |
|---|---|
| VPS | **Data centre in Québec** (OVHcloud Beauharnois BHS, AWS ca-central-1, or a Montréal provider; not OVH's Toronto-area site): keeps the database and backups out of the Loi 25 s.17 assessment (17 §7). [[FACT NEEDED: provider + data-centre city of the owner's VPS]] |
| Size | **4 vCPU · 8 GB RAM · ≥ 75 GB NVMe** for production + staging on one box (2 vCPU / 4 GB only if staging lives elsewhere). Ubuntu **24.04 LTS**. IPv4 (+ IPv6 if offered). Provider 2FA on, snapshots on |
| Backups | Two object-storage buckets **in Québec, at two different providers** (for example S3 ca-central-1 + OVH Object Storage BHS), each with a key limited to that bucket |
| Keys | An `age` key pair made on your laptop (`age-keygen -o coco-backup.key`): the **private** key goes to the password manager + a printed copy in the shop safe, never to the server |
| GitHub | Admin on `yahyahoussini/coco-vanille-granby` (secrets, environments, packages) |
| Domain | Registrar/DNS access for `cocovanillegranby.com`. [[FACT NEEDED: registrar, registrant name, renewal date]] |
| Outside the VPS | Uptime monitor + heartbeat service (Better Stack or Healthchecks.io), Sentry (PII scrubbed), mailbox suite, Amazon SES in ca-central-1 |

## First deploy, step by step

1. **SSH keys (laptop).** Your own key, plus one for CI: `ssh-keygen -t ed25519 -f coco-ci -C github-actions -N ''`. The private `coco-ci` file becomes the `VPS_SSH_KEY` secret; `coco-ci.pub` goes on the server.
2. **DNS** (table below). Point the five host names at the VPS before asking for certificates. TTL 300 s during setup.
3. **Harden the box.** Copy this folder and run it as root:
   ```sh
   scp -r infra root@<vps-ip>:/root/coco-infra
   ssh root@<vps-ip>
   DEPLOY_SSH_KEYS="$(cat your-key.pub coco-ci.pub)" STAGING_AUTH_USER=agence STAGING_AUTH_PASSWORD='<long random>' \
     bash /root/coco-infra/scripts/harden-vps.sh
   ```
   Before closing that session, open a second one as `deploy@<vps-ip>`: root and password logins are now off.
4. **Registry login (as deploy).** A classic GitHub token with `read:packages` only: `docker login ghcr.io -u <github-user>` (paste the token). It lets the VPS pull images; it cannot push.
5. **Environment files.** For `production` and `staging`:
   ```sh
   cp /root/coco-infra/.env.example /opt/coco/production/.env   # then staging
   chmod 600 /opt/coco/*/.env && chown deploy:deploy /opt/coco/*/.env
   openssl rand -hex 24   # POSTGRES_PASSWORD     openssl rand -hex 32   # PAYLOAD_SECRET, REVALIDATE_SECRET
   ```
   Staging differs here: `APP_ENV=staging`, `PUBLISH_GUARD=show`, ports `3101/3102/3111/3112`, `MEDIA_DIR=/opt/coco/staging/media`, origins and hosts `staging.` / `admin-staging.`, `PUBLIC_HOST=staging.cocovanillegranby.com`, `ADMIN_HOST=admin-staging.cocovanillegranby.com`, Stripe/Twilio **test** keys, SES sandbox, `INDEXNOW_KEY` and `BACKUP_REMOTES` empty, its own secrets.
6. **Certificates.** One certificate for the five names (webroot, renewed by certbot's timer, nginx reloaded by a hook):
   ```sh
   sudo bash /root/coco-infra/scripts/install-nginx.sh --issue-certs <agency mailbox>
   ```
7. **Backups.** As deploy: `rclone config` (two remotes, e.g. `s3ca` and `ovhbhs`), then in production's `.env`: `BACKUP_REMOTES="s3ca:coco-backups ovhbhs:coco-backups"`. Put the age **public** key in `/opt/coco/age-recipients.txt`. Heartbeat URLs in `HEARTBEAT_BACKUP_URL` / `HEARTBEAT_RESTORE_TEST_URL`.
8. **GitHub.** Environments `staging` and `production`; on `production` add **required reviewers** (owner or agency). Secrets and variables: table below.
9. **Migrations are in the repo.** Production never pushes the schema (`push` is off when `NODE_ENV=production`): the first `deploy.sh` runs `src/migrations/<stamp>_initial.js` (every table) and `<stamp>_orders_notify.js` (the Postgres trigger behind Studio's live screens) on the empty database, then `docker compose … run --rm migrate npm run seed` loads the verified facts. Every later schema change gets its own migration, **expand-only** (below).
10. **Staging.** Push to `main` (or run *Deploy staging* by hand). Check `https://staging.cocovanillegranby.com` on a phone, and the gate's owner to-do list in the run summary.
11. **Production.** *Actions › Deploy production › Run workflow*, paste the full SHA running on staging, approve. The run ends with `check-urls` and `crawler-access` from outside.
12. **After the first production deploy.** Enable the timers, then run a backup and a restore test by hand. **The first restore test must pass before launch** (17 §8.5):
    ```sh
    sudo systemctl enable --now coco-backup@production.timer coco-restore-test@production.timer
    bash /opt/coco/production/infra/scripts/backup.sh production
    bash /opt/coco/production/infra/scripts/restore-test.sh production
    ```
13. **Monitoring.** Uptime checks on `https://cocovanillegranby.com/`, `https://cocovanillegranby.com/svc/health/` (deep: database included), the admin login page and certificate expiry; alert the agency, the owner after 10 minutes down. [[FACT NEEDED: who receives outage alerts, on which phone]]
14. **HSTS ramp** (`snippets/coco-hsts.conf`, then `install-nginx.sh`): launch week `max-age=300` → after a week with every host on HTTPS `max-age=86400; includeSubDomains` → a month later `max-age=31536000; includeSubDomains`. No preload (owner decision after 3 months).

## DNS records

| Name | Type | Value | Note |
|---|---|---|---|
| `@` | A / AAAA | VPS IPv4 / IPv6 | [[FACT NEEDED: VPS IPv4/IPv6]] |
| `www` | A / AAAA | same | nginx answers 301 → apex |
| `admin` | A / AAAA | same | Coco Studio |
| `staging`, `admin-staging` | A / AAAA | same | basic auth + noindex |
| `@` | CAA | `0 issue "letsencrypt.org"` | only Let's Encrypt may issue |
| `@` | CAA | `0 iodef "mailto:dmarc@cocovanillegranby.com"` | issuance problems reported here |
| `@` | MX | per mailbox suite (Microsoft 365 or Google Workspace) | [[FACT NEEDED: mailbox suite]] |
| `@` | TXT | `v=spf1 include:<mailbox suite> -all` | one SPF record only |
| `envoi` | MX + TXT | SES custom MAIL FROM: the MX and `v=spf1 include:amazonses.com -all` values the SES console shows | bounces kept apart from the mailbox |
| `<selector>._domainkey` | CNAME ×3 | SES Easy DKIM values from the SES console | plus the mailbox suite's DKIM record |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:dmarc@cocovanillegranby.com` | `p=quarantine` after 4 clean weeks, then `p=reject` |
| `@` | TXT | Search Console domain verification | Domain property (plan v1) |

DNS-only (no CDN proxying) at launch (17 §6). DNSSEC after a stable week; turn it off before ever changing DNS provider. Defensive `cocovanillegranby.ca` is an owner decision (17 §10.1).

## GitHub secrets and variables

| Name | Where | Used by |
|---|---|---|
| `VPS_HOST`, `VPS_USER` (`deploy`), `VPS_SSH_KEY` (private `coco-ci`) | environments `staging` and `production` | deploy workflows |
| `VPS_KNOWN_HOSTS` | both environments (recommended) | pins the host key: `ssh-keyscan -t ed25519 <host>` checked against the provider console |
| `STAGING_BASIC_AUTH` (`user:password`) | `staging` | gate on staging |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (`openssl rand -base64 32`) | repository | image build in `deploy-staging.yml` (secret `server_actions_key`); the same value goes in both `.env` files |
| `SERPAPI_KEY`, `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `PSI_KEY` | repository, optional | `weekly.yml` (a step without its key is skipped) |
| `GOOGLE_SERVICE_ACCOUNT_JSON`, `GA4_PROPERTY_ID` | repository, optional | Search Console + GA4 in `weekly.yml` |
| variable `SITE_LIVE=true` | repository variables | turns on the live checks in `weekly.yml` once the site is public |

`GITHUB_TOKEN` pushes images to GHCR (no extra secret). The VPS SSH key can run commands as `deploy`, who is in the `docker` group, which is root-equivalent: keep it in the two environments only, with required reviewers on production, and rotate it quarterly. A stricter set-up (forced command that only accepts `deploy`/`rollback`, with the VPS fetching `infra/` itself through a read-only deploy key) is possible later.

## Environment variables

All of them are in `infra/.env.example`, one comment each, under the names the app reads (`apps/web/.env.example` is the development twin; `apps/web/scripts/test/infra.test.js` fails when the code reads a variable that neither file documents). Email uses `EMAIL_PROVIDER=ses` with `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` and `MAIL_FROM`; text messages `SMS_PROVIDER=twilio` with the `TWILIO_*` keys; without them the log sender writes to the container log and nothing leaves. Compose builds `DATABASE_URI` from `POSTGRES_*`. `deploy.sh` writes `state.env` next to `.env` (`LIVE_COLOR`, `PREVIOUS_COLOR`, `BLUE_TAG`, `GREEN_TAG`, `WORKER_TAG`, `DEPLOYED_TAG`, `DEPLOYED_AT`); never edit it by hand during a deploy. Manual Compose commands:

```sh
cd /opt/coco/production
docker compose -p coco-production --env-file .env --env-file state.env ps
docker compose -p coco-production --env-file .env --env-file state.env logs --tail 100 web-blue
```

## How a deploy works

`deploy.sh <env> <sha>` prints each step and stops at the first failure; before the switch, a failure leaves the live colour untouched (the new colour is stopped):

1. checks (`.env` present and `chmod 600`, lock: one deploy at a time) · 2. pull the image · 3. Postgres up · 4. **pre-migration dump** (`backup.sh --label pre-<sha>`) · 5. `npm run migrate` (one-shot container) · 6. start the idle colour on its own ports · 7. wait for Docker health + `/svc/health/` with the database on the web and the studio process (`src/proxy.js` lets it through on every host and role) · 8. **warm-up**: the image carries pages prerendered at build time from the CI seed; the script waits until the build is older than the ISR period (300 s), requests every sitemap URL once (re-rendered from this environment's data), then requires a 200 on every URL · 9. rewrite `/etc/nginx/coco/upstreams/<env>.conf`, `nginx -t`, reload · 10. worker on the new tag · 11. the previous colour stays up 10 minutes for an instant rollback, then stops (its containers stay on disk).

## Blue/green and Next.js

- **One build id per image.** CI builds with `DEPLOYMENT_ID=<git sha>` (`next.config.mjs` `deploymentId`): a browser that loaded pages from the old colour gets a full reload on its next navigation instead of mixing two builds.
- **One Server Actions key for every build and colour.** `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (the GitHub secret, passed to `docker build` as the secret `server_actions_key`, and the same value in `/opt/coco/<env>/.env`): forms and the « Avancé » admin keep working across a switch and a rollback. Rotate it with the quarterly keys; a rotation logs open admin sessions out of their pending forms, nothing else.
- **Compression in nginx only.** `next.config.mjs` has `compress: false`; `snippets/coco-proxy.conf` asks Node for plain bodies and `conf.d/coco.conf` gzips.
- **Checkout CSP.** `/commander/paiement/`, `/en/order/checkout/` and `/es/pedidos/pago/` send a Content-Security-Policy that allows this site plus Stripe only (`js.stripe.com` script and frames, `hooks.stripe.com` frames for 3-D Secure, `api.stripe.com` calls). A new Stripe.js URL (`STRIPE_JS_URL`) must stay on `js.stripe.com`.

## Page refresh (ISR)

Public pages are static with a 5-minute ISR period. A write that the site shows (shop and business globals, products, categories, seasons, allergens, page copy, photos) refreshes them at once through Payload hooks (`apps/web/src/lib/revalidate.js`): the public process clears its own cache; `studio`, the worker and one-off scripts `POST /svc/revalidate/` on `PUBLIC_ORIGIN` (or `REVALIDATE_URL`) with `REVALIDATE_SECRET`. nginx accepts that path only from 127.0.0.1 and the Docker range (staging skips the password there); the app answers 404 without the secret. If the call fails, the write still succeeds and the pages renew within 5 minutes. Containers reach the public host through hairpin NAT: if `/svc/revalidate/` answers 403 from a container, add the VPS IP to the `allow` list (17 §12.3).

## Migrations

- Generated with `cd apps/web && npm run migrate:create -- <name>` against a database at the previous migration (`scripts/migrate-create.mjs`: Payload's generator with `NODE_ENV=production`, so it never pushes, then the file is rewritten as JavaScript and Payload's `index.ts` dropped). Commit the `.js` and its `.json` snapshot under `apps/web/src/migrations/`; the `migrate` service runs them before the new colour starts.
- Proof that the migrations match the code: on a migrated database, a development `npm run seed` (schema push on) changes nothing. CI migrates an empty database and seeds it with `NODE_ENV=production` on every run.
- Hand-written SQL (triggers, functions) goes in its own migration with `sql.raw` (see `_orders_notify.js`); the app runs no DDL on a migrated database (`src/lib/studio/live.js` only installs its trigger on a pushed development database).
- **Expand-only**: add tables, columns and indexes; never rename or drop in the same release. The old colour keeps serving during the switch and after a rollback, so it must still work on the new schema. Remove old columns in a later release, once no live code reads them.
- Every production migration is preceded by a dump (`/opt/coco/production/backups/*-pre-<sha>.dump`).

## Rollback

```sh
ssh deploy@<vps>
bash /opt/coco/production/infra/scripts/rollback.sh production
```

Switches nginx back to the previous colour (seconds while it still runs, about 15 s once retired), restarts the worker on the previous tag, and leaves the database alone. When the previous colour is gone, redeploy an older SHA with *Deploy production*.

Last resort, bad data after a migration (orders taken since the dump are lost; replay them from Stripe/POS): stop the writers (`… stop web-<colour> studio-<colour> worker`), then restore the pre-deploy dump into the live database:

```sh
cd /opt/coco/production
docker compose -p coco-production --env-file .env --env-file state.env exec -T db \
  pg_restore -U coco -d coco --clean --if-exists --no-owner < backups/coco-production-<stamp>-pre-<sha>.dump
```

## Backups and the restore test

| What | When | Where |
|---|---|---|
| `pg_dump -Fc`, checked with `pg_restore --list` | 02:15 nightly (`coco-backup@production.timer`) and before each migration | local copy `/opt/coco/<env>/backups/` (7 nightly + 5 pre-deploy, same disk as the database) |
| the same dump encrypted with `age` (public key) | same run | every `BACKUP_REMOTES` bucket: `coco/<env>/daily` (30 days), `monthly` (12 months, copy of the 1st), `predeploy` (30 days); size checked after upload |
| uploads (`media/`) | same run | `coco/<env>/media` (copy, never deletes: public images, not encrypted) |
| restore test | 1st Monday 03:30 (`coco-restore-test@production.timer`) | newest local dump → throwaway Postgres 16 with no network → row counts → `/opt/coco/<env>/reports/restore-test.json` → heartbeat |
| off-site restore drill | quarterly, by hand | `restore-test.sh production --remote s3ca:coco-backups --identity /path/to/coco-backup.key` (the private key comes from the password manager for the drill, then leaves the server) |

The restore test fails on: no tables, `users` or `pages` missing, fewer orders than the previous report, and (with `EXPECT_RECENT_ORDERS=true` in the unit's environment once ordering is live) a newest order older than 48 h. The seconds it takes are the measured RTO. WAL archiving (RPO of minutes) is added the week online ordering goes live (17 §8.4).

## Friday checklist (about 30 min)

- [ ] Alerts of the week read (uptime, heartbeats, Sentry); nothing left open.
- [ ] Advisories: `cd apps/web && npm audit --omit=dev`; Payload, Next.js and Node release notes; merge the base-image/dependency update PR (CI green).
- [ ] Disk under 70 %: `df -h /` and `docker system df`.
- [ ] Last production run: `check-urls` and `crawler-access` green (or run them: `node tools/crawler-access.mjs --sitemap https://cocovanillegranby.com/sitemap.xml --max 5`).
- [ ] Certificate valid more than 30 days: `sudo certbot certificates`.
- [ ] Backups: last night's heartbeat received; `jq .ok,.testedAt /opt/coco/production/reports/restore-test.json` is `true` and less than 31 days old.
- [ ] Staging gate: owner to-do list (`owner-todo.md` in the latest *Deploy staging* run) sent to the owner if it changed.
- [ ] Monthly (first Friday): `log-bots.mjs --verify --week` on the public log (`zcat` rotated files first), access review (ex-staff accounts), cost check.

## Incidents (first move)

| Symptom | First move |
|---|---|
| Site down | `docker compose … ps`; `rollback.sh production`; then disk (`df -h`) and memory (`dmesg | grep -i oom`) |
| Disk full | `docker image prune -a --filter until=336h`, old logs, local dumps |
| Certificate expiring | `sudo certbot renew --dry-run`; port 80 reachable? |
| Bad migration | stop the writers, restore the pre-deploy dump (Rollback, last resort), replay orders |
| Leaked key | rotate at the provider → update `.env` → redeploy; if personal data was exposed, log it in the Loi 25 incident register |
| Crawlers blocked | `crawler-access.mjs`; nginx `limit_req` / fail2ban bans (`sudo fail2ban-client status nginx-limit-req`) |

## Open points after integration

- **Production publishes nothing yet.** Under `PUBLISH_GUARD=strict` a language goes live with its home page, a page needs its copy in that language with no `[[FACT NEEDED]]` marker, and a product page needs its description, priced and portioned sizes, lead time and checked allergens (`src/lib/publish.js`). With today's seed every page copy still holds a marker, so strict serves no page (gate: 0 pages, empty sitemap) until the owner answers `owner-todo.md`. Facts kept outside the page copy (shop hours, the privacy officer's email) still render as markers on served pages: supply them before the first page goes live.
- **404 for a missing product or a page hidden by strict.** Unknown URLs get the server-rendered 404 page from `src/proxy.js`; a URL shaped like a product (`/gateaux/<slug>/`) whose product does not exist, or a registry page hidden by strict, still goes through Next's `notFound()`, which answers 404 with a client-rendered body (Next's limitation with several root layouts).
- **Old URLs.** The `redirects` collection exists in Payload but nothing serves it yet (proxy or nginx map).
- **Web Push.** VAPID keys are only reported in Agence; Studio's four urgent push alerts are not wired.
- **Checkout CSP** keeps `'unsafe-inline'` for scripts (Next's inline bootstrap). A per-request nonce from `src/proxy.js` on the three checkout paths would remove it.
- **Stripe** was exercised with the mock provider only (no keys here): run one test-mode payment and the webhook on staging.
- **Hairpin NAT** for `/svc/revalidate/` from the containers: check on the VPS (see « Page refresh »).
- **Public favicon**: none yet (audit warning on every page); it needs the owner's logo or wordmark.

