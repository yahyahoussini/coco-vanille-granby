# 17 · Self-hosting on a VPS + the domain cocovanillegranby.com

> Track: hosting, operations, email, domain/DNS. Stage: plan only, no build. Written 2026-10-25.
> Inputs: `requirements-2026-10-25.md` (owner's VPS, public + admin hosts), `plan-v1-ranking-stack.md` §11, §12, §15, §16, §17, `plan-v0a-master-plan.md` Part 2.1, `plan-v0c-site-ux-ordering.md` §8–9, `16b-admin-tech-subdomain.md` (admin host, nginx, proxy.js, security), rank-first `references/03-technical.md`, `10-measurement.md`, `14-unknown-unknowns.md`, `scripts/log-bots.mjs`.
> Labels: **UNVERIFIED** = from a search summary, a third-party page or prior knowledge; not confirmed on an official page this session. **[[FACT NEEDED: …]]** = the owner must supply it. **(est.)** = my own engineering estimate.
> Research limit: the shared web-search budget ran out after 30 queries. Items I could not check are marked UNVERIFIED and listed in §14.
> `research/07-legal-quebec-compliance.md` did not exist when this was written. The Loi 25 points in §7 need cross-checking against it.
> Code sketches are JavaScript only, illustrative, and have not been run. Server config (nginx, Compose) is described in tables, not as code.

---

## 0. Decisions in one screen

| Question | Recommendation | Why |
|---|---|---|
| VPS location | **A data centre in Québec**: OVHcloud Beauharnois, AWS ca-central-1 (Montréal), or a Montréal provider. [[FACT NEEDED: provider + data-centre city of the owner's VPS]] | Takes the largest personal-data store out of the Loi 25 s.17 assessment, and keeps network distance to Granby short |
| Size | **4 vCPU / 8 GB RAM / ≥ 75 GB NVMe** for production + staging on one box. Minimum 2 vCPU / 4 GB if staging runs elsewhere (est.) | Two Next.js processes + worker + Postgres + staging. Builds run in CI, never on the VPS |
| Runtime | One Docker image (Next.js `output: 'standalone'` + Payload 3), run as **web** (public), **studio** (admin), **worker** (`payload jobs:run`). Postgres in a container on a private network | Matches 16b. Same build, isolated processes |
| Reverse proxy | **nginx on the host + certbot** (not Caddy, not Traefik) | 16b already depends on nginx features (`limit_req`, buffering off for SSE, headers on error pages). nginx's default `combined` log format works with `log-bots.mjs` unchanged |
| CDN | **None at launch.** DNS-only. Revisit on measured triggers (§6) | Local audience + local origin. No AI-crawler default blocks. Real client IPs in our own logs. No extra party in the order and admin data path |
| Deploys | GitHub Actions → image tagged by git SHA → GHCR → SSH forced-command → **blue/green on one host** (health check → cache warm-up → nginx switch). Rollback = switch back | Near-zero downtime without Kubernetes |
| Staging | `staging.` + `admin-staging.cocovanillegranby.com` on the same VPS: HTTP basic auth + `X-Robots-Tag: noindex` + test keys + no IndexNow | One person, one box, safe rehearsal |
| Backups | Nightly `pg_dump` + WAL archiving once ordering is live, encrypted with `age`, sent to **object storage in Québec at a different provider**. Monthly automated restore test | Survives losing the VPS or the whole provider |
| Email | Transactional mail through an API (**Amazon SES ca-central-1** for data location, or Postmark for simplicity). Mailbox: Microsoft 365 Business Basic or Google Workspace. **Never SMTP from the VPS** | Deliverability. Loi 25 |
| Domain | `cocovanillegranby.com` canonical at the **apex**; `www` → 301. Register `cocovanillegranby.ca` defensively (owner task). DNSSEC + CAA. HSTS ramped up, no preload at launch | Search Console country targeting is gone, so the .com relies on hreflang + content + local signals; the .ca would only add a country signal |
| Monthly cost | **≈ C$35–55** (est., §11) | — |

---

## 1. Architecture

```
  Visitors (Granby / Québec, mostly phones)        Crawlers: Googlebot · Bingbot · OAI-SearchBot · ChatGPT-User ·
                    │ HTTPS (HTTP/2)                  ClaudeBot · Claude-SearchBot · PerplexityBot · Applebot …
                    ▼                                              ▼
  DNS (Cloudflare DNS in DNS-only mode, or the registrar) ── A / AAAA ──► VPS in Québec  [[FACT NEEDED]]
  ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ufw: 22/tcp (keys only, fail2ban) · 80/tcp · 443/tcp            unattended-upgrades · swap 2 GB     │
  │ nginx (host package) + certbot      logs: /var/log/nginx/{public,admin,staging}.access.log          │
  │  ├─ cocovanillegranby.com  (www → 301) ─────► 127.0.0.1:3001 | 3011   web     role=public (blue|green)│
  │  │     /media/*  served from disk (uploads volume), long cache                                       │
  │  │     /svc/revalidate → only from 127.0.0.1 / Docker subnet · /svc/health → public, rate-limited    │
  │  ├─ admin.cocovanillegranby.com ────────────► 127.0.0.1:3002 | 3012   studio  role=studio (blue|green)│
  │  ├─ staging. / admin-staging.  (basic auth + noindex) ─► 127.0.0.1:3101 / 3102   staging stack       │
  │  └─ unknown Host / raw IP ─► close (444)                                                            │
  │ Docker network "coco" (nothing published except 127.0.0.1 ports above)                             │
  │  worker   payload jobs:run --cron … --queue … --handle-schedules  (exactly one)                      │
  │  db       Postgres (volume pgdata) ── WAL archive (continuous) + pg_dump (nightly, pre-deploy) ─┐    │
  │  uploads  volume (Payload media + generated sizes) ── nightly sync ────────────────────────────┤    │
  │ systemd timers: backup · restore-test · log-bots · image-prune · disk check · certbot renew     │    │
  └────────────────────────────────────────────────────────────────────────────────────────────────┼────┘
                                                                                                   ▼
                                   Encrypted backups (age) → object storage in Québec, at ANOTHER provider
  Outside the VPS: GitHub (repo, Actions CI/CD, GHCR images) · uptime + heartbeat monitor · Sentry (PII scrubbed)
                   Email API (SES ca-central-1 / Postmark) · mailbox (M365 / Workspace) · POS / Stripe · Twilio
```

### 1.1 Processes (Docker Compose layout, described)

| Service | Image | Listens | Volumes | Health check | Memory limit (est.) | Notes |
|---|---|---|---|---|---|---|
| `web-blue` / `web-green` | `ghcr.io/<org>/coco:<sha>` | `127.0.0.1:3001` / `:3011` | `uploads` (read-only) | `node -e "fetch('http://127.0.0.1:3000/svc/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"` every 15 s | 768 MB | `APP_ROLE=public`. Only one colour is live at a time |
| `studio-blue` / `studio-green` | same image | `127.0.0.1:3002` / `:3012` | `uploads` (read-write) | same, port 3000 inside | 768 MB | `APP_ROLE=studio`. Admin uploads land here |
| `worker` | same image | none | `uploads` (rw) | process alive + a heartbeat ping after each job loop | 512 MB | `payload jobs:run …`. Never also enable `jobs.autoRun` for the same queue (duplicates: Payload docs) |
| `db` | official Postgres, major version pinned [[VERIFY: current supported major]] | Docker network only | `pgdata`, `walarchive` | `pg_isready` | 1 GB | Never published to the host or the internet |
| staging (`web`, `studio`, `worker`, `db`) | same image, staging tag | `127.0.0.1:3101`, `:3102` | separate volumes | same | 1.5 GB total | Separate Compose project, separate database |

The Docker health check uses the **shallow** route (process alive) so Docker doesn't restart the app when only the database is down. The deploy script and the uptime monitor use `?deep=1` (database reachable). Sketch in §12.2.

### 1.2 Sizing (est.: measure with `docker stats` during week 1)

| Component | RAM (est.) | CPU notes |
|---|---|---|
| OS + Docker + nginx + page cache | ~1 GB | — |
| web (public) | 300–700 MB | Spikes on image optimization and on cold ISR renders |
| studio | 300–700 MB | SSE connections are cheap |
| worker | 200–400 MB | Bursty (feeds, AI drafts, GBP sync) |
| Postgres | 0.5–1 GB | A bakery's data stays small: well under 1 GB in year one (est.) |
| Staging stack (capped) | ~1.5 GB | Can be stopped when not in use |
| During blue/green overlap | + one extra web/studio for ~10 min | That's why 8 GB, not 4 GB |
| **Total** | **≈ 4.5–6 GB peak → 8 GB VPS** | 4 vCPU gives headroom for sharp |

Disk (est.): images (keep the last 3 SHAs) ~3–5 GB; media ~5–10 GB in year one (phone photos, about a 2560 px master plus sizes); Postgres + WAL < 5 GB; logs < 2 GB with rotation. **75 GB is enough; alert at 80 %.**

Add a **2 GB swap file**. Without it, a sharp spike during the blue/green overlap can trigger the OOM killer (est.).

---

## 2. Next.js + Payload on a VPS: what self-hosting changes

Versions: 16b pins **Payload 3.92.x** and **Next.js 16.4.x**, Node per Payload's minimum. I did not re-verify these; this session's searches only saw docs for `next@16.3.8` on unpkg. Next.js 16 was released on 21 Oct 2025 (InfoQ, hashnode).

| Topic | What the docs say | What we do |
|---|---|---|
| Standalone output | `output: 'standalone'` makes `next build` produce a self-contained folder with a minimal `server.js` and only the needed dependencies. It's the usual base for a small Docker image (Next.js docs; third-party guides). Railway's Payload 3 guide sets it too | Multi-stage Dockerfile: build in CI, run `server.js`. [[VERIFY at build: standalone doesn't copy `public/` and `.next/static` by default, so copy them in the Dockerfile (prior knowledge)]] |
| Reverse proxy | Next.js recommends a reverse proxy (e.g., nginx) in front of the Node server instead of exposing it directly | nginx on the host (§3) |
| ISR / data cache | The default cache lives **on each instance's local disk** (plus memory). It's automatic only for a single `next start` instance with persistent disk. Multiple instances need a custom `cacheHandler` (`get`, `set`, `revalidateTag`, `resetRequestCache`), usually with `cacheMaxMemorySize: 0` (Next.js docs) | **One live public instance.** Blue/green means the new colour starts with an empty cache, so warm it (§12.4) before switching. Add a shared handler (Redis or Postgres) only if we ever run two live public instances |
| **Revalidation across processes** | `revalidatePath` / `revalidateTag` clear the cache **of the process that calls them** (follows from the per-instance cache above) | Payload hooks run in the **studio** process and scheduled publishes run in the **worker**. Neither can clear the **public** process's cache directly. Both POST to `https://cocovanillegranby.com/svc/revalidate` with a secret; nginx routes that to whichever colour is live (sketch §12.3). This changes plan v1 §12's `revalidateUrls()` |
| Server Actions key | Each build and each instance may generate a different Server Actions encryption key. Set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (base64, 16/24/32 bytes) so every instance shares it. One source says it's embedded at build time (Next.js error docs; third-party) | One key per environment in CI secrets. Same key for web + studio + both colours |
| Version skew | `deploymentId` in `next.config` is added to asset and navigation requests. On a client/server mismatch Next.js forces a full reload (mirror of the self-hosting guide) | `deploymentId: process.env.GIT_SHA` |
| Build without the production DB | — (design point, not a doc quote) | CI can't reach the production Postgres (firewalled). **Don't prerender DB pages at build.** They render on first request and are then cached. The warm-up step makes the first request ours, not Googlebot's. A build against an empty CI database would bake empty pages: never do that. [[VERIFY: the exact Next 16 route config for this, especially if Cache Components / `use cache` are enabled]] |
| Build once, promote | — | Never put host names in `NEXT_PUBLIC_*` (those are inlined at build). Read `PUBLIC_HOST` / `ADMIN_HOST` / `APP_ENV` at runtime on the server, so the **same image** goes from staging to production. 16b's `proxy.js` constants must come from env for this reason |
| Images (sharp) | `next/image` works self-hosted with zero config under `next start`. On glibc Linux, image optimization may need extra allocator configuration to avoid excessive memory use (sharp install guide, linked from the Next.js 15 docs). A community demo says sharp no longer needs a manual install since Next 15 | **Payload uploads:** sizes generated once at upload (Payload uses sharp), served by nginx from `/media/` with long cache, plus a custom `next/image` loader. No runtime optimization and no cache rebuilt after each deploy. **Design assets in `/public`:** built-in optimizer, with `.next/cache/images` on a volume. [[VERIFY: Payload `imageSizes` WebP/AVIF output options; the custom loader config in Next 16]] |
| Compression | — | nginx does gzip; set `compress: false` in Next so content isn't compressed twice [[VERIFY option name in Next 16]] |
| Jobs | For dedicated servers the bin script is preferred: a separate process from Next.js. `payload jobs:run --cron "*/5 * * * *" --queue <q> --handle-schedules` both schedules and runs jobs. A task's `schedule` only queues jobs; a runner must execute them. Don't combine the bin script's `--handle-schedules` with `autoRun` on the same queue (duplicates) (Payload docs v3/v4) | One `worker` container. Docs disagree between v3 and v4 on whether `autoRun` schedules, so we don't use `autoRun` at all |
| Migrations | A Railway Payload template runs migrations before the server starts | Run `payload migrate` as a one-off container **before** starting the new colour, after a pre-migration `pg_dump`. Migrations must be **expand-only** (additive), because the old colour keeps serving during the switch |

### 2.1 Cache headers

| Path | Cache-Control | Set by |
|---|---|---|
| `/_next/static/*` (hashed) | `public, max-age=31536000, immutable` | Next.js default [[VERIFY]] |
| `/media/*` (Payload files) | `public, max-age=2592000` (30 days). Filenames aren't content-hashed: if a photo is replaced, a new filename or `?v=` busts the cache | nginx |
| HTML (ISR pages) | Next.js default for ISR. Without a CDN, browsers ignore `s-maxage` | Next.js |
| `/svc/*`, all of `admin.*`, all of `staging.*` | `no-store` (+ `private` on admin) | Next.js / nginx |
| `robots.txt`, `sitemap.xml`, IndexNow key | short (≤ 1 h) | Next.js |

### 2.2 Cron and background jobs

| Job | Runs in | When (Eastern time) | Notes |
|---|---|---|---|
| Payload jobs (IndexNow, GBP sync, feeds, reminders, AI drafts, scheduled publish) | `worker` | Per queue | Exactly one worker. Calls `/svc/revalidate` after publishing |
| `pg_dump` (custom format) → `age` → bucket | host systemd timer | 02:15 nightly + before each migration | Heartbeat ping on success |
| WAL archiving (PITR) | Postgres `archive_command` or pgBackRest / WAL-G [[VERIFY tool choice]] | Continuous, from the week ordering goes live | RPO ≈ minutes instead of 24 h |
| Media sync (rclone) | host timer | 02:45 nightly | Bucket versioning on |
| Restore test | host timer | 1st Monday of the month, 03:30 | §8.4 |
| `log-bots.mjs --verify --week` | host timer | Monthly (+ weekly `--week`) | Public log only; `zcat` rotated `.gz` files first (the script doesn't read `.gz`) |
| `crawler-access.mjs`, `check-urls.mjs` | GitHub Actions | After every production deploy + Friday | Runs **from outside** the VPS, which is realistic. It can't run against staging (basic auth returns 401) |
| rank-first weekly (`serp`, `ai`, `gsc`, `ga4`, `fresh`) | GitHub Actions schedule (cron in **UTC**) or the worker | Monday 06:00 | Results POSTed to Studio with an integration API key (16b §4 #8) |
| certbot renew | systemd timer (package default) [[VERIFY]] | Twice a day | Uptime monitor also alerts at < 14 days to expiry |
| unattended-upgrades + reboot | apt timers | Daily; reboot window **Monday 03:00** | Most directories list the shop closed Sun–Tue (01-business-facts §3). [[FACT NEEDED: confirmed closed day]] |
| `docker image prune` (keep the last 3 SHAs) | host timer | Weekly | — |

---

## 3. Reverse proxy: nginx vs Caddy vs Traefik

| Criterion | **nginx + certbot** | Caddy 2 | Traefik |
|---|---|---|---|
| TLS | No built-in automatic certificates; Certbot handles them (falcao.org, 2026) | **Automatic HTTPS by default** (falcao.org; Dokploy) | ACME built in [[UNVERIFIED]] |
| HTTP/3 | "First-class but still evolving"; needs a QUIC-enabled build + UDP 443 (falcao.org) | On by default once TLS is on (falcao.org) | UNVERIFIED |
| Rate limiting | `limit_req` built in (16b uses it on login routes) | Not in core; third-party module [[UNVERIFIED]] | Middleware [[UNVERIFIED]] |
| Access logs for `log-bots.mjs` | **`combined` works as is.** The script's regex expects combined and has no end anchor, so fields appended after the user agent still parse (read from `scripts/log-bots.mjs`) | JSON by default; HTTP access logging **off** until enabled. The `transform-encoder` plugin falls back to Common Log Format, which **has no user agent** (Caddy docs; transform-encoder README). Needs a custom template or a converter | UNVERIFIED |
| SSE / streaming | `proxy_buffering off` / `X-Accel-Buffering: no` (16b) | UNVERIFIED | UNVERIFIED |
| Where it shines | Maximum control; existing installs (Dokploy, falcao.org) | Minimal config | Dynamic container fleets and Kubernetes (falcao.org; Dokploy) |
| Fit for one VPS, one operator | **Chosen** | Good alternative if 16b's nginx features are re-implemented | Overkill |

nginx settings that matter here:

| Setting | Value | Reason |
|---|---|---|
| Log format | `combined_timing` = `combined` + ` $request_time $upstream_response_time` | `log-bots.mjs` still parses it, and we get server timing (a TTFB proxy) for free |
| Separate logs | `public.access.log`, `admin.access.log`, `staging.access.log` | `log-bots.mjs` runs on the public log only. Admin logs hold staff IPs (personal information) |
| Default server | `return 444` for unknown `Host` / raw IP | Stops IP-address duplicates of the site from being crawled |
| Redirects | `http://*` and `www` → `https://cocovanillegranby.com$request_uri`, **one hop** | rank-first 03-technical (Nginx `return 301`) |
| HSTS | Set **in nginx only** (covers redirects and nginx error pages). Remove it from 16b §6.2 `next.config.js` to avoid duplicate headers | Ramp in §10.4 |
| Compression | gzip on for text types; Next `compress: false` | One place only |
| Internal and health routes | `/svc/revalidate`: `allow 127.0.0.1; allow <docker subnet>; deny all;`. `/svc/health`: public (the external uptime monitor needs it), `limit_req`, body limited to ok / db / short SHA | Secret + network check on revalidate |
| SSE path (admin) | buffering off, long `proxy_read_timeout` | 16b §3 |
| `/media/` on the public host | `alias` to the uploads volume, `expires 30d` | No Node work for images |
| Upstream switch | `include /etc/nginx/coco/upstream-public.conf` (rewritten by the deploy script) + `nginx -s reload` | Graceful blue/green |

---

## 4. Deploys: zero-downtime on a single host

| Step | Where | What | Gate |
|---|---|---|---|
| 1. Pull request | GitHub Actions | lint · build image (tag = git SHA) · Playwright against a CI-only Postgres · Lighthouse CI · push to GHCR | Green or no merge (plan v1 §12) |
| 2. Merge to `main` | Actions → SSH | Deploy the SHA to **staging**: migrate the staging DB → start → warm → `npm run gate` against staging (with basic-auth credentials) | Gate pass |
| 3. Approve | GitHub environment `production` (required reviewer: owner or agency) | Manual click | Human |
| 4. Production | SSH forced command → `deploy.mjs <sha>` | (a) `pg_dump` (b) `payload migrate` (expand-only) (c) start the idle colour (d) wait for `/svc/health?deep=1` 200 (e) **warm-up: every sitemap URL returns 200, fail = abort** (§12.4) (f) rewrite the upstream include, reload nginx (g) keep the old colour 10 min, then stop it (h) restart the worker on the new SHA | Abort at any step = nothing switched |
| 5. Post-deploy | Actions | `npm run check`, `npm run crawlers` (`crawler-access.mjs`) against production | Fails → alert + rollback decision |
| Rollback | SSH | If the old colour still runs: switch the upstream back (seconds). Otherwise redeploy the previous SHA. Database: expand-only migrations mean the old code still works. Otherwise restore the pre-migration dump (orders since then are lost: last resort) | — |

Security of the pipeline:
- The CI SSH key sits in `authorized_keys` with a **forced command** (`command="/opt/coco/deploy.mjs"`, `no-pty`, `no-port-forwarding`). A leaked GitHub secret can then only redeploy an image that already exists in GHCR; it can't open a shell. (Standard OpenSSH feature, not re-sourced.)
- GHCR pull uses a read-only token on the VPS.
- Staging uses **test keys** (Stripe/Square sandbox, SES sandbox or a mail sink, Twilio test credentials), **no IndexNow**, no GA4/ads tags, and `APP_ENV=staging`, which forces `noindex` (§12.1).

Studio and SSE during the switch: open `EventSource` connections drop and reconnect by themselves (16b §3). Staff see at most a few seconds of "reconnexion…".

---

## 5. Staging host

| Item | Setting |
|---|---|
| Hosts | `staging.cocovanillegranby.com` (public) + `admin-staging.cocovanillegranby.com` (Studio). Host-based routing (16b `proxy.js`) needs a pair |
| Access | nginx HTTP basic auth on both hosts (agency + owner). Google: password protection is the strongest way to keep content private (16b §2.4) |
| Indexing backup | `X-Robots-Tag: noindex, nofollow` on every response from Next (driven by `APP_ENV`) + nginx. No links to staging anywhere. No sitemap submission |
| Data | Seed data or an **anonymized** copy of production (names, phones, emails replaced) made after the monthly restore test. Never raw customer data (Loi 25: minimization) |
| Side effects off | IndexNow, GBP writes, Instagram/Facebook posting, SMS, real emails, payments: all sandboxed or disabled by `APP_ENV` |
| Resources | Capped by Compose memory limits; `docker compose stop` when idle |

---

## 6. CDN decision

### 6.1 Facts found

| Fact | Source (date) |
|---|---|
| Cloudflare began **blocking AI crawlers by default** (reported as "for new domains" / "new customers": the scope is worded differently across outlets) and introduced pay-per-crawl | MIT Technology Review, 2025-07-01; Techwyse |
| Existing Cloudflare users can turn the block on with one click | Techwyse |
| Cloudflare's **managed robots.txt** serves `Content-Signal: search=yes, ai-train=no` and leaves `ai-input` unset. `search` excludes AI-generated summaries; `ai-input` covers RAG/grounding/real-time AI answers | Cloudflare blog (Content Signals Policy, Sept 2025); Cloudflare developer docs |
| Newer controls split traffic into **Search, Agent, Training**. Each can be allowed, blocked only on pages with ads, or blocked site-wide, on all plans including Free. **Mixed-use crawlers get the most restrictive category, so blocking Training can block a Googlebot-style crawler** | The Decoder; Ctrl AI Profit (third-party). The year of the "September 15" ad-site default is not clear in the summary: UNVERIFIED |
| Raptive says free-tier zones begin blocking the listed AI crawlers automatically (broader than the ads-only scope) | Raptive help centre (third-party) |
| rank-first: CDN 403s are the course's #1 "unknown unknown". Run `crawler-access.mjs` after every deploy | rank-first 03-technical, 14-unknown-unknowns |

### 6.2 Options

| | **No CDN (launch)** | Cloudflare Free (proxied) | Bunny CDN (pull zone for static only) |
|---|---|---|---|
| TTFB/LCP for Québec visitors | Origin in Québec: short network path (est.; measure §6.4). HTML speed depends on our ISR cache, not on distance | Edge HTML caching isn't on by default for dynamic pages [[UNVERIFIED]]; static assets gain a little | Static assets only. HTML unchanged |
| AI / search crawlers | Nothing between them and nginx | **Risk**: AI Crawl Control, managed robots.txt, Bot Fight Mode can block or rewrite | No known default AI blocking [[UNVERIFIED]] |
| Raw logs for `log-bots.mjs` | Complete, real client IPs | Origin sees Cloudflare IPs unless nginx `real_ip` uses `CF-Connecting-IP` with Cloudflare's ranges. Edge-cached hits never reach origin logs, so bot counts come out low | Origin logs complete for HTML |
| Loi 25 | No extra processor in the order / admin path | TLS ends at Cloudflare, so order-form contents and IPs pass through a US company's network: add it to the PIA | Static files only (no personal data) |
| DDoS / abuse | nginx `limit_req` + provider network protection [[UNVERIFIED for the chosen VPS]] | Strong | Partial |
| Cost | $0 | $0 (Free plan) | Pay as you go [[UNVERIFIED pricing]] |
| Moving parts | Fewest | + dashboard, toggles, IP ranges | + one zone, one CNAME |

**Decision: no CDN at launch.** The two things a CDN adds (edge distance, DDoS absorption) matter little for a one-shop site whose customers are 80 km from a Québec origin. Its known costs (crawler-blocking defaults, partial logs, an extra Loi 25 processor) hit our primary goal: SEO/AEO/GEO.

**Revisit triggers** (any one of them):
1. p75 TTFB from real users or CrUX persistently > 0.8 s (web.dev's "good" threshold [[UNVERIFIED this session]]) **after** cache fixes.
2. Sustained attack traffic that nginx + the provider can't absorb.
3. Bandwidth near the VPS plan limit.

Then: first a **Bunny pull zone on `cdn.` for `/_next/static` and `/media` only**. Cloudflare only if DDoS is the issue, and only for the **public host** (admin stays DNS-only).

### 6.3 If Cloudflare is ever switched on: the switches

| Setting | Value | Why |
|---|---|---|
| AI Crawl Control: Search / Agent / Training | **Allow / Allow / Allow** (owner's decision; rank-first default for a business that wants to be recommended) | Blocking Training can also hit mixed-use crawlers (The Decoder) |
| Managed robots.txt | **Off**: our own robots.txt is served unchanged with `Content-Signal: search=yes, ai-input=yes, ai-train=yes` (plan v1 §16; rank-first 03-technical) | The default inserts `ai-train=no` |
| Bot Fight Mode | **Off** | Challenges crawlers (rank-first 03-technical) |
| Pay-per-crawl | Off | We want citations, not tolls |
| "Under Attack" / high security level | Only during an incident | JavaScript challenges block crawlers |
| Cache rules | Static paths only; never `admin.*` or `/svc/*` | Personal data |
| nginx | `real_ip_header CF-Connecting-IP` + `set_real_ip_from` for each Cloudflare range [[VERIFY current ranges]] | `log-bots.mjs --verify` needs real IPs |
| Gate | `crawler-access.mjs` + `check-urls.mjs` (detects Cloudflare challenge headers) after every change | rank-first 17-advanced-playbook |

### 6.4 Measure before choosing the VPS location (owner task, 30 min)

From the shop's own internet connection in Granby: ping/mtr to each candidate region's test endpoint [[UNVERIFIED: providers' looking-glass / speed-test hosts]]. Pick the lowest latency among the **Québec** options. Server location doesn't matter for geotargeting; John Mueller (via SEJ): "place the server where it works best for you."

---

## 7. Loi 25 and data location

### 7.1 What the sources say

| Point | Source |
|---|---|
| s.17: before communicating personal information **outside Québec**, the business must do a privacy impact assessment (ÉFVP). This covers hosting outside Québec, cloud services included | Fasken (FR) |
| The communication may proceed only if the assessment shows **adequate protection**, and it must be covered by a **written agreement** that takes the results into account, with mitigations if needed. This applies to service providers too | IAB Canada guide (June 2022); BLG |
| One reading: there's no risk threshold, so every transfer out of Québec needs an assessment (unlike the GDPR) | Usercentrics (FR) |
| The CAI published a PIA guide and template (French) on 22 Sept 2023 | McCarthy Tétrault |
| Whether a server **elsewhere in Canada** triggers s.17 in practice: sources disagree | 16b §4 #16 |

Reading for this plan (to be confirmed by the legal track): the text says "outside Québec", so **Toronto is outside Québec** on a literal reading. Ontario hosting is **allowed** with an assessment + written agreement. A Québec data centre **removes the main database and the backups** from that work. It doesn't remove the other vendors.

### 7.2 Where personal information flows (inventory for the PIA)

| Component | Personal information | Location | s.17 assessment? | Mitigation |
|---|---|---|---|---|
| VPS (Postgres, uploads, logs) | Orders, names, phones, emails, allergy notes, staff accounts, IPs | **Québec** (target) [[FACT NEEDED]] | No, if in Québec | Encrypted disk if the provider offers it [[UNVERIFIED]]; least-privilege roles (16b) |
| Off-site backups | Same (encrypted) | Québec bucket, other provider | No, if in Québec | `age` encryption; private key kept offline |
| Transactional email | Name, email, order summary | SES ca-central-1 = Montréal (per plan v0a; [[VERIFY]]) · Postmark: [[UNVERIFIED location]] · Resend: **account data, logs and metadata stored in the US whatever the sending region** (Resend docs) | SES: likely no · others: yes | Minimal content in emails (no allergy details) |
| Mailbox (M365 / Workspace) | Customer emails | [[UNVERIFIED: tenant data location]] | Probably | Check the data-residency page of the chosen suite |
| SMS (Twilio) | Phone numbers, message text | US [[UNVERIFIED]] | Yes | Short texts, no order details |
| Payments (Stripe / Square) | Payment data (handled by the processor) | Processor's | Yes (legal track) | Hosted checkout / payment links |
| Error monitoring (Sentry SaaS) | Can capture form values, IPs | [[UNVERIFIED regions]] | Yes, unless scrubbed | `sendDefaultPii: false`, scrub order fields; or self-host |
| Uptime monitor | None (URL checks only) | Any | No | Never put tokens in check URLs |
| CDN (if ever) | IPs, request bodies | Global edge | Yes | Static-only zone (§6.2) |
| DNS | None about customers | Any | No | — |
| GitHub (code, CI) | None, **as long as no dumps or `.env` are committed** | US | No | `.gitignore`, secret scanning |
| Claude API (review drafts) | Review texts, names | US | Yes (16b) | Strip names; human approval |

Access logs: IP addresses may be personal information (legal track to confirm). Proposal: **keep raw access logs 90 days** (est.), then keep only aggregated bot reports.

### 7.3 VPS providers with a Canadian region

Prices are list prices from the pages or summaries named in the source column, as seen on 2026-10-25. **Confirm every price and the data-centre city at checkout.** Prices are USD unless marked.

| Provider | Data centre | In Québec? | Example plan | Price seen | Source / caveat |
|---|---|---|---|---|---|
| **OVHcloud** | Beauharnois (BHS), QC | **Yes** | VPS-2: 4 vCores, 8 GB, 75 GB NVMe, 1 Gbps · VPS-1: 2 vCores, 4 GB, 40 GB NVMe | VPS-2 **from $11.64/mo**, VPS-1 from $6.20/mo (en-ca page; currency not explicit, structured data tagged CAD) | OVH en-ca VPS Canada page. Beauharnois per HostingCompass / Vpsium (third-party). Price rise from 2026-04-01 (next.ink) and compute price changes on 2026-10-01 (LowEndTalk post) reported: **re-check** |
| **AWS Lightsail** | Canada (Central) `ca-central-1` (code CAN1) | **Yes** (Montréal per plan v0a / brief; [[VERIFY]]) | 2 vCPU, 4 GB, 80 GB SSD, 4 TB transfer | $24/mo global list price; **Canada price not confirmed** | AWS Lightsail pricing page; billing docs (CAN1) |
| Montréal providers | Montréal, QC | Yes | Patrii Cloud from C$5.25 · Astral Internet unmanaged from C$17.49 (Tier III) · Sucura Networks from US$7.50 · VPS Shell (managed KVM) US$9 · GTHost 1 core / 1 GB US$4 · PlanetHoster managed 2 CPU / 4 GB / 40 GB C$66.20 | as listed | Provider pages / directories. **All UNVERIFIED**; check specs, support, backups and track record |
| DigitalOcean | TOR1 Toronto, ON | No | Basic 2 vCPU, 4 GB, 80 GB, 4 TB | $24/mo (third-party; a 20 % Basic price cut in Jan 2026 is also reported, so possibly lower). Backups +20 % weekly / +30 % daily | diyai.io, CostBench, Better Stack review (SFO3). TOR1 price not confirmed |
| Vultr | Toronto, ON | No | Regular 2 vCPU, 4 GB, 80 GB, 3 TB | $20/mo (undated, region not stated) | vpsbenchmarks. Toronto not seen in this session's excerpt: [[VERIFY]] |
| Akamai / Linode | Toronto (ca-central), ON | No | Linode 4 GB shared: 2 vCPU, 80 GB, 4 TB | $24/mo | akamai.com/cloud/pricing; history stable (CostBench). Toronto price not confirmed |
| Hetzner | — | No Canadian location [[UNVERIFIED, prior knowledge]] | — | — | Listed only because it's a common cheap choice: not suitable |

Decision tree for the owner's VPS:

| The owner's VPS is… | Then |
|---|---|
| In Québec (OVH BHS, AWS ca-central-1, a Montréal host) and ≥ 4 vCPU / 8 GB | Keep it |
| In Québec but smaller | Upgrade the plan, or move staging to a small second VPS |
| In Ontario (Toronto) | Workable with an s.17 assessment + written agreement. Pre-launch, moving is cheap (one evening): compare |
| Outside Canada | Move before launch (assessment burden, latency, foreign law) |

### 7.4 Backup storage

| Option | Region | In Québec? | Price seen | Notes |
|---|---|---|---|---|
| **AWS S3 `ca-central-1`** | Canada (Central) | Yes [[VERIFY]] | [[UNVERIFIED: search budget exhausted]] | Good pair with an OVH VPS (different provider) |
| **OVHcloud Object Storage** | BHS [[VERIFY that S3 Standard is offered in BHS]] | Yes | ≈ $0.0081/GB-mo or €0.0119/GB-mo (third-party, region not stated). Egress reported free | Good pair with an AWS/Lightsail VPS. Not independent if the VPS is also at OVH |
| Wasabi | Toronto region [[UNVERIFIED]] | No | **$7.99/TB-mo** from the first billing cycle on or after 2026-07-01 (Wasabi FAQ, example rate); **1 TB minimum**; 90-day minimum storage on pay-go; egress free up to the stored volume | The 1 TB minimum makes it poor value for < 50 GB of backups |
| Backblaze B2 | Canadian region [[UNVERIFIED]] | — | [[UNVERIFIED]] | Not checked (budget) |
| Provider snapshots | Same DC as the VPS | Same | DigitalOcean: +20 % / +30 % of the droplet price (third-party); OVH option [[UNVERIFIED]] | Fast rollback, **not** a disaster backup (same site) |

Rule: **two copies off the VPS, at least one at a different provider, all in Québec**, all encrypted before upload. A site-wide data-centre loss (e.g., the OVH Strasbourg fire, March 2021 [[UNVERIFIED this session]]) is the case snapshots don't cover.

---

## 8. Operations for a one-person operator

### 8.1 Hardening (day 0). Standard practice, not re-sourced this session

| # | Control | Setting |
|---|---|---|
| 1 | Accounts | Provider console, registrar, DNS, GitHub, email: **2FA**, recovery email the owner controls (rank-first 03-technical). Domains and the VPS in the **owner's** name and account, the agency as a delegate |
| 2 | SSH | ed25519 keys only; `PasswordAuthentication no`; `PermitRootLogin no`; `AllowUsers deploy agency`; CI key with a forced command (§4) |
| 3 | Firewall | ufw default deny incoming; allow 22 (rate-limited), 80, 443. **Docker-published ports bypass ufw** [[UNVERIFIED this session, well-known]], so publish app ports on `127.0.0.1` only and never publish Postgres |
| 4 | Intrusion | fail2ban jails for sshd + nginx `limit_req` (simpler than CrowdSec for one box) |
| 5 | Patching | unattended-upgrades (security), reboot window Monday 03:00; weekly image rebuild to pick up base-image patches (Renovate/Dependabot on the Dockerfile); Payload advisories checked in the Friday gate (16b §4 #1) |
| 6 | Resource safety | 2 GB swap; Compose memory limits; journald `SystemMaxUse=500M`; Docker log rotation (`json-file`, max-size 10 MB × 3) |
| 7 | Secrets | Password manager = source of truth. On the VPS: one `.env` per environment, `chmod 600`, owner `deploy`, outside the repo. CI: GitHub environment secrets (registry token, SSH key, Server Actions key). Separate keys per environment and per integration; expiry and rotation dates recorded in Studio › Intégrations (16b §4 #18) |
| 8 | Backups key | `age` **public** key on the server, **private** key offline (password manager + printed copy in the shop safe). A compromised server can't read old backups |
| 9 | TLS / DNS | CAA record limiting issuance to Let's Encrypt; DNSSEC (§10.5) |

### 8.2 Monitoring and alerts

| What | Tool (choice) | Where it runs | Alert to |
|---|---|---|---|
| Uptime: `/`, `/svc/health?deep=1`, the admin login page, certificate expiry | Better Stack (in plan v0a) or Uptime Kuma **on a separate tiny VPS** (Kuma on the same VPS can't report the VPS down) | **Outside** the VPS | Agency (push/SMS); owner on a 10-min outage |
| Heartbeats (dead-man switch): backup, WAL archive age, restore test, worker loop, monthly `log-bots` | Healthchecks-style pings (Better Stack heartbeats or Healthchecks.io) [[UNVERIFIED free tiers]] | Outside | Agency |
| App errors | Sentry SaaS, PII scrubbed. Self-hosted Sentry is heavy [[UNVERIFIED requirements]]; GlitchTip is a lighter self-host option [[UNVERIFIED]] | Outside (SaaS) | Agency |
| Disk ≥ 80 %, RAM, load | 5-min host timer → push heartbeat with a status | VPS → outside | Agency |
| Real-user Core Web Vitals | `web-vitals` → `/svc/vitals` → Postgres (plan v0a) | VPS | Studio › Recherche › Technique |
| Crawler access | `crawler-access.mjs` (Actions) | Outside | Gates |

What the owner sees: one Studio tile, no jargon (Québec French):

> **Système** · « Tout roule » ✓
> « Site public : en ligne · Studio : en ligne »
> « Sauvegarde : cette nuit, 2 h 15 — OK »
> « Test de restauration : 6 oct. — OK (11 min) »
> « Certificat HTTPS : 54 jours (renouvellement automatique) »
> « Espace disque : 38 % »

SMS on an outage: « Coco Studio : le site ne répond plus depuis 3 min. L'agence est avertie. Les commandes reçues sont en sécurité. »

### 8.3 Logs

| Log | Rotation | Kept | Used by |
|---|---|---|---|
| nginx public (`combined_timing`) | daily, `compress` + `delaycompress` | 90 days raw (proposal, §7.2) | `log-bots.mjs` (monthly, `zcat` first), TTFB trend |
| nginx admin / staging | daily | 30 days | Security review |
| App (Docker json-file) | 10 MB × 3 per container | Rolling | Debugging; errors go to Sentry |
| Postgres | default | 14 days | — |

### 8.4 Postgres backups and restore tests

| Layer | Method | RPO (est.) | When |
|---|---|---|---|
| Logical | `pg_dump -Fc` → `age` → two buckets; 30 daily + 12 monthly kept | 24 h | From day 1 |
| Pre-migration | Same, tagged with the SHA | 0 for that deploy | Every production deploy |
| Continuous (PITR) | WAL archiving to a bucket via `archive_command` or pgBackRest / WAL-G [[VERIFY]] + weekly base backup | Minutes | **From the week online ordering goes live** (an order lost = a cake not made) |
| Media | rclone sync + bucket versioning | 24 h | Day 1 |

**Monthly restore test (automated):**
1. Fetch the latest dump.
2. Restore into a throwaway Postgres container.
3. Check: the tables exist, the order count ≥ last month's, the latest order is < 48 h old.
4. Time it: that's our measured RTO.
5. Write the result to Studio's Gates ("Sauvegardes : restauration testée ≤ 31 jours", plan v1 §10) and ping the heartbeat.
6. Optionally produce the **anonymized** staging copy.
7. Drop the container.

Targets for the owner to approve: **RPO ≤ 15 min** once ordering is live; **RTO ≤ 2 h** to rebuild on a new VPS from the runbook (est.).

### 8.5 Runbook checklist

**Day 0 (setup, once)**
- [ ] VPS in Québec, ≥ 4 vCPU / 8 GB; provider 2FA; snapshot plan on
- [ ] Hardening §8.1 #1–9
- [ ] Docker + Compose; nginx + certbot; log format + three log files
- [ ] DNS records §10.6; CAA; DNSSEC after a week of stability
- [ ] Buckets (two providers, Québec), `age` keys, backup + restore-test timers, heartbeats
- [ ] Uptime monitor + Sentry (scrubbed) + disk check
- [ ] Email domain authentication §9.3; DMARC reports mailbox
- [ ] First restore test passes **before** launch

**Every deploy (automated):** gates → pre-migration dump → migrate → health → warm → switch → `crawlers` + `check` on production.

**Weekly (Friday gate, about 30 min):** alerts reviewed · Payload/Next/Node advisories · image rebuild merged · disk < 70 % · `crawler-access` green · certificate > 30 days.

**Monthly (about 1 h):** restore test result · `log-bots.mjs --verify --week` on the pillar pages (Googlebot and Bingbot weekly; GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot at all) · prune · review access (ex-staff accounts) · cost check.

**Quarterly:** rotate integration keys and the revalidate secret · test the full rebuild on a fresh VPS from the runbook (time it) · re-read provider prices.

**Incident playbooks (one line each in the repo's `RUNBOOK.md`):**

| Symptom | First move |
|---|---|
| Site down | Uptime alert → `docker compose ps` → switch back to the previous colour → check disk / OOM |
| Disk full | `docker image prune`, rotate logs, check WAL archive growth (a failing `archive_command` keeps WAL files piling up) |
| Certificate expiring | `certbot renew --dry-run`; check port 80 reachable |
| Database corrupted / bad migration | Stop the writers → PITR or the pre-migration dump → replay POS/Stripe orders |
| Leaked key | Rotate in the provider → update `.env` → redeploy; log it in the Loi 25 incident register if personal data was exposed (plan v0c §9) |
| Crawlers blocked (`crawler-access` red) | Check nginx `limit_req`/fail2ban for crawler IPs, then the CDN if any |

---

## 9. Email on the domain

### 9.1 Transactional email (orders, pickup reminders, staff password resets, the Monday report)

| Provider | Data location | Price seen | Fit |
|---|---|---|---|
| **Amazon SES** | Choose `ca-central-1` (Montréal per plan v0a; [[VERIFY SES availability + location]]) | À la carte ≈ $0.10 per 1,000 (third-party, "uniform across regions"). Since 2026-07-21, bundled plans are reported: Essentials $0.16 per 1,000; Pro $0.22 + $105/mo; Enterprise $0.23 + $500/mo; new accounts start on Essentials, and you can switch back to à la carte (dev.to; third-party) [[VERIFY on aws.amazon.com/ses/pricing]] | **Best for Loi 25** if it stays in Canada. More setup: leaving the sandbox, bounce/complaint handling |
| Postmark | [[UNVERIFIED]] | Basic **$15/mo for 10,000** emails, $1.80 per extra 1,000 (third-party). Plan structure reported as changed in 2026: conflicting | Simplest. Needs an s.17 assessment if outside Québec |
| Resend | Sending regions: us-east-1, eu-west-1, sa-east-1, ap-northeast-1. **Account data, logs and metadata in the US regardless** (Resend docs) | Free: 3,000/mo, 100/day cap (third-party + pricing page) | Good DX; US data → assessment |

Recommendation: **SES ca-central-1**, sent from the worker through its API with a send-only IAM key. Fallback: Postmark if SES setup stalls; record the assessment.

**Never send from the VPS directly** (no Postfix/Exim on the box). A new VPS IP has no sending reputation and often no matching PTR. Many providers restrict outbound port 25 [[UNVERIFIED per provider]]. A compromised box shouldn't be able to spam under the brand: the API key is send-only and revocable in one click.

### 9.2 Mailbox (bonjour@ / commandes@)

| Suite | Price seen (CAD per user per month) | Note |
|---|---|---|
| Microsoft 365 Business Basic | **C$9.50** (annual, + tax); a no-Teams SKU at C$6.00 | microsoft.com/en-ca. Canadian data residency [[UNVERIFIED: check Microsoft's data-residency page]] |
| Google Workspace Business Starter | **C$9.20** annual / **C$11** flexible (read from a partly cut-off Google help table) | [[VERIFY on Google's Canadian pricing page]]. Data regions [[UNVERIFIED]] |

One paid mailbox (`bonjour@`) + aliases (`commandes@`, `avis@`, `dmarc@`) is enough at launch. The GBP API application needs a mailbox on the website's domain (16b §5). Create it in **week 1**.

### 9.3 Domain authentication

| Record | Value (pattern) | Note |
|---|---|---|
| MX | Per the mailbox suite | Apex |
| SPF (TXT, apex) | `v=spf1 include:<mailbox suite> include:<ESP if it sends from the apex> -all` | One SPF record only; ≤ 10 DNS lookups [[standard, not re-sourced]] |
| Transactional subdomain | Send as `commandes@cocovanillegranby.com`, with the bounce domain / MAIL FROM on `envoi.cocovanillegranby.com` | Separate reputation from the mailbox |
| DKIM | CNAMEs or TXT records from the ESP **and** from the mailbox suite | Both must sign |
| DMARC (`_dmarc` TXT) | Start `v=DMARC1; p=none; rua=mailto:dmarc@cocovanillegranby.com` → `p=quarantine` after 4 clean weeks → `p=reject` | Ramp = standard practice [[not re-sourced]] |
| Marketing (newsletter, plan v0a Brevo/Klaviyo) | Its own subdomain (`infolettre.`) + CASL consent | Never mixed with order mail |

---

## 10. Domain and DNS plan

### 10.1 `.com` vs `.ca`

| Fact | Source |
|---|---|
| Google treats a ccTLD as a **strong** indicator that a site targets one country; it also limits the site to that country | Google Search Central, multi-regional sites |
| Search Console's International Targeting report and its **country-targeting setting were removed** (deprecation, removal on 2022-09-22). Google still supports hreflang | Google Search Console Help; Search Engine Land |
| Server location doesn't drive geotargeting ("place the server where it works best for you", John Mueller) | Search Engine Journal |
| `.ca` requires meeting CIRA's **Canadian Presence Requirements**; CIRA may cancel a non-compliant registration without refund. Corporations register under their full legal name + jurisdiction (third-party) | CIRA; A2 Hosting KB; Wikipedia |

Decision: keep **`cocovanillegranby.com`** (owner's choice). For a single-location bakery, the real local battle is the map pack and the Google profile (plan v1, rank-first Layer 12), where the domain extension isn't the lever. The `.com` gets its Canadian signal from `fr-CA`/`en-CA` hreflang, the address, `LocalBusiness` schema, and links from Québec sites.

Defensive registrations (owner tasks; availability **not checked**, no tool access):

| Domain | Action |
|---|---|
| `cocovanillegranby.ca` | Register in the business's **legal name** (CIRA rules) → 301 to the `.com` |
| `cocovanille.ca`, `cocovanille.com` | Check availability. Note a "Coco Vanille" bakery in La Réunion with a Facebook page (01-business-facts). If free, register `.ca` at least |
| `patisseriecocovanille.ca/.com` | Matches the Google Maps name. Optional |
| All | Same registrar, auto-renew, 2FA, registrar lock. [[FACT NEEDED: who registered cocovanillegranby.com, with which registrar, under whose name?]] |

### 10.2 Canonical host and redirects

| Request | Response |
|---|---|
| `http://cocovanillegranby.com/*`, `http://www.…/*`, `https://www.…/*` | **301 → `https://cocovanillegranby.com/*`** in one hop (rank-first default: no www; 16b) |
| `https://cocovanillegranby.ca/*` (and other defensive domains) | 301 → same path on the `.com` (needs a certificate for each name) |
| Raw IP / unknown host | 444 |
| Trailing slash | One policy, decided once in `site.config.json` (`urlPolicy`), the other form 301s (rank-first 03-technical) |
| Old links | **No previous website was found** (01-business-facts §1). Nothing to migrate. [[FACT NEEDED: any old link-in-bio (Linktree etc.), Square Online, or Facebook shop URL to redirect]] |
| Social and profile links | Instagram bio, Facebook "Site web", Apple Business, Bing Places → apex URL. Google profile website → `https://cocovanillegranby.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile` (plan v1 §11) |

### 10.3 Subdomain map

| Host | Points to | Purpose | Indexable |
|---|---|---|---|
| `cocovanillegranby.com` | A/AAAA → VPS | Public site (fr-CA root, `/en/`, `/es/`) | Yes |
| `www` | A/AAAA → VPS | 301 → apex | — |
| `admin` | A/AAAA → VPS | Coco Studio (16b) | No (auth + noindex) |
| `staging`, `admin-staging` | A/AAAA → VPS | Rehearsal | No (basic auth + noindex) |
| `cdn` | Reserved; unused at launch | A future Bunny pull zone for static files | — |
| `envoi` | ESP records | Transactional bounce / MAIL FROM domain | — |
| `infolettre` | ESP records | Newsletter (later) | — |
| `statut` (optional) | CNAME → status page provider | Public status page | No |

No `media.` subdomain: images stay on the canonical host (`/media/`), which keeps image URLs, sitemap entries and schema on one host.

### 10.4 HSTS

| Phase | Header (set by nginx) |
|---|---|
| Launch week | `max-age=300` |
| +1 week, all hosts verified HTTPS-only | `max-age=86400; includeSubDomains` |
| +1 month | `max-age=31536000; includeSubDomains` |
| Preload | **Not at launch.** It's hard to undo [[UNVERIFIED this session]]. Owner decision after 3 months |

### 10.5 DNS provider and DNSSEC

| Option | For | Against |
|---|---|---|
| **Cloudflare DNS, DNS-only (grey cloud)** | Free, API, one-click DNSSEC [[UNVERIFIED]]; a CDN later is one toggle | One toggle away from proxying by mistake: `check-urls.mjs` / `crawler-access.mjs` catch Cloudflare headers |
| Registrar DNS | One account fewer | Quality, API and DNSSEC support vary by registrar |

Recommendation: Cloudflare DNS in DNS-only mode, unless the registrar offers DNSSEC + CAA + an API.

DNSSEC: enable after one stable week; publish the DS at the registrar; **turn DNSSEC off before ever changing DNS provider**, otherwise the domain goes dark.

### 10.6 Records at launch

| Name | Type | Value |
|---|---|---|
| `@` | A / AAAA | VPS IPv4 / IPv6 [[FACT NEEDED]] |
| `www`, `admin`, `staging`, `admin-staging` | A / AAAA | Same |
| `@` | MX | Mailbox suite |
| `@` | TXT | SPF; Google Search Console domain verification (plan v1: Domain property) |
| `@` | CAA | `0 issue "letsencrypt.org"` + `0 iodef "mailto:dmarc@cocovanillegranby.com"` |
| `_dmarc` | TXT | DMARC (§9.3) |
| ESP / mailbox DKIM names | CNAME / TXT | From each provider |
| `envoi` | MX / TXT | ESP MAIL FROM |

TTL 300 s during setup, 3600 s after.

---

## 11. Monthly cost estimate (est.)

| Item | Choice | ≈ Monthly | Basis |
|---|---|---|---|
| VPS (production + staging) | OVH VPS-2, Beauharnois | **$11.64** (likely CAD) | OVH en-ca page; 2026 price changes reported: re-check |
| (alt.) | Lightsail 4 GB, ca-central-1 | US$24 + a second small instance for staging | AWS list price |
| Provider backup option | — | [[UNVERIFIED]] | — |
| Off-site backups (≈ 20–50 GB × 2 providers) | S3 ca-central-1 + OVH Object Storage | ≈ $1–3 | OVH third-party per-GB price; S3 [[UNVERIFIED]] |
| Domains (.com + .ca + 1–2 defensive) | Registrar | ≈ $3–6 amortized | [[UNVERIFIED registrar prices]] |
| DNS | Cloudflare DNS-only | $0 | [[UNVERIFIED]] |
| Transactional email | SES (à la carte) | < $1 at bakery volume | Third-party rate |
| (alt.) | Postmark Basic | US$15 | Third-party |
| Mailbox (1–2 users) | M365 Business Basic | **C$9.50–19** | microsoft.com/en-ca |
| Uptime + heartbeats | Free tiers, or a $5 second VPS for Uptime Kuma | $0–6 | [[UNVERIFIED tiers]] |
| Errors | Sentry free tier | $0 | [[UNVERIFIED]] |
| CI/CD + registry | GitHub Free | $0 | [[UNVERIFIED Actions minute / GHCR quotas for private repos]] |
| CDN | none | $0 | §6 |
| **Total** | | **≈ C$35–55/month** (≈ +US$15 with Postmark; ≈ +US$20–30 with Lightsail) | Excludes SMS, payments, AI APIs, SEO tools (plan v1 §15) |

Operator time (est.): about 30 min/week (Friday gate) + about 1 h/month (restore and logs review) + about 2 h/quarter (rotation, rebuild drill).

---

## 12. JavaScript sketches

### 12.1 `next.config.js`: standalone, runtime-safe headers, staging noindex

```js
// next.config.js — extends 16b §6.2 (host-specific headers live there).
// HSTS is set by nginx only (§3), so it is NOT repeated here.
import { withPayload } from '@payloadcms/next/withPayload'; // as in 16b — verify at install

const isStaging = process.env.APP_ENV === 'staging';

const nextConfig = {
  output: 'standalone',                         // self-contained server.js for the Docker image
  compress: false,                              // nginx gzips; avoid double compression (verify option in Next 16)
  poweredByHeader: false,
  deploymentId: process.env.GIT_SHA,            // version-skew protection during blue/green
  images: {
    loader: 'custom',                           // Payload-generated sizes served by nginx from /media
    loaderFile: './lib/image-loader.js',        // verify config shape in Next 16
  },
  async headers() {
    const rules = [
      { source: '/svc/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
    if (isStaging) {
      // Basic auth is the real lock; this is the backup if auth is ever misconfigured.
      rules.push({ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] });
    }
    return rules;
  },
};

export default withPayload(nextConfig);
```

```js
// lib/image-loader.js — maps next/image widths to Payload's pre-generated sizes (names = your imageSizes config).
const SIZES = [[480, 'small'], [960, 'medium'], [1600, 'large'], [2560, 'xlarge']];

export default function payloadLoader({ src, width }) {
  if (!src.startsWith('/media/')) return src;            // only Payload uploads
  const [, name] = SIZES.find(([w]) => w >= width) ?? SIZES[SIZES.length - 1];
  return src.replace(/(\.[a-z0-9]+)$/i, `-${name}.webp`); // assumes Payload writes <file>-<size>.webp — verify naming
}
```

### 12.2 Health-check route

```js
// app/(public)/svc/health/route.js — shallow for Docker, ?deep=1 for the deploy script and the uptime monitor.
// 16b's proxy.js must let this path through for any Host, before its 421 rule:
//   if (pathname === '/svc/health') return NextResponse.next();
// (Docker's check calls the container port with Host 127.0.0.1; /svc/revalidate arrives via nginx with the public Host, so it needs no exemption.)
import { getPayload } from 'payload';
import config from '@payload-config';

export const dynamic = 'force-dynamic'; // never cached (verify the Next 16 equivalent if Cache Components are on)

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

export async function GET(request) {
  const deep = new URL(request.url).searchParams.get('deep') === '1';
  const body = { ok: true, role: process.env.APP_ROLE, version: (process.env.GIT_SHA || 'dev').slice(0, 7) };

  if (deep) {
    try {
      const payload = await getPayload({ config });
      // Any small collection works; 'pages' is an assumption. depth 0 + limit 1 keeps it cheap.
      await withTimeout(payload.find({ collection: 'pages', limit: 1, depth: 0 }), 2000);
      body.db = 'up';
    } catch {
      body.ok = false;
      body.db = 'down';
    }
  }

  return Response.json(body, {
    status: body.ok ? 200 : 503,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}
```

### 12.3 Revalidation that reaches the live public process

```js
// app/(public)/svc/revalidate/route.js — only the PUBLIC process clears its own cache.
// nginx allows this path only from 127.0.0.1 / the Docker subnet; the secret is the second lock.
import { revalidatePath, revalidateTag } from 'next/cache';
import { timingSafeEqual } from 'node:crypto';

const SECRET = Buffer.from(process.env.REVALIDATE_SECRET || '');
const isValid = (value) => {
  const given = Buffer.from(value || '');
  return SECRET.length > 0 && given.length === SECRET.length && timingSafeEqual(given, SECRET);
};

export async function POST(request) {
  if (process.env.APP_ROLE !== 'public' || !isValid(request.headers.get('x-revalidate-secret'))) {
    return new Response('Not found', { status: 404 });
  }
  const { paths = [], tags = [] } = await request.json();
  for (const tag of tags) revalidateTag(tag);   // Next 16 may require a second (profile) argument — verify
  for (const path of paths) revalidatePath(path);
  return Response.json({ ok: true, paths: paths.length, tags: tags.length });
}
```

```js
// lib/revalidate-public.js — used by Payload hooks (studio process) and jobs (worker). Replaces plan v1 §12's revalidateUrls().
export async function revalidatePublic({ urls = [], tags = [] }) {
  const paths = urls.map((u) => new URL(u).pathname);
  const res = await fetch(`https://${process.env.PUBLIC_HOST}/svc/revalidate`, { // nginx → the live colour
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': process.env.REVALIDATE_SECRET },
    body: JSON.stringify({ paths, tags }),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`revalidate failed: ${res.status}`); // a Payload job retry picks it up
}
```

From inside a container, `PUBLIC_HOST` resolves to the VPS's public IP. nginx must allow that source (the Docker subnet after NAT, or the VPS IP) [[VERIFY on the box]].

### 12.4 Warm-up before switching nginx

```js
// scripts/warm.mjs — run by deploy.mjs against the NEW colour before the upstream switch.
// Usage: node scripts/warm.mjs --port 3011 --host cocovanillegranby.com
import http from 'node:http';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: { port: { type: 'string' }, host: { type: 'string' }, concurrency: { type: 'string', default: '2' } },
});
const PORT = Number(values.port);
const HOST = values.host;

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { host: '127.0.0.1', port: PORT, path, timeout: 30000, headers: { host: HOST, 'user-agent': 'coco-warmup/1' } },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      },
    );
    req.on('timeout', () => req.destroy(new Error(`timeout ${path}`)));
    req.on('error', reject);
  });
}

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const index = await get('/sitemap.xml');
if (index.status !== 200) throw new Error(`sitemap.xml returned ${index.status}`);
let paths = locs(index.body);
if (index.body.includes('<sitemapindex')) {                      // nested sitemaps
  const children = await Promise.all(paths.map(get));
  paths = children.flatMap((child) => locs(child.body));
}

const failures = [];
const queue = [...new Set(paths)];
await Promise.all(Array.from({ length: Number(values.concurrency) }, async () => {
  while (queue.length) {
    const path = queue.shift();
    const { status, body } = await get(path).catch((e) => ({ status: 0, body: String(e) }));
    if (status !== 200 || !body.includes('application/ld+json')) failures.push(`${status} ${path}`);
  }
}));

console.log(`warmed ${paths.length} URLs, ${failures.length} failures`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); } // deploy aborts, old colour stays live
```

---

## 13. Changes to earlier plans

| Earlier plan | Now |
|---|---|
| Plan v0a 2.1: Postgres on Supabase / RDS + S3 media in ca-central-1 | Postgres + media **on the owner's VPS** (Québec), encrypted backups to two Québec buckets |
| Plan v1 §11: Vercel log drain | nginx `combined_timing` logs on the VPS → `log-bots.mjs` (`zcat` rotated files first) |
| Plan v1 §12: a preview deploy per pull request | CI tests per PR + **one staging host**. `crawler-access` runs on production after deploy (staging is behind auth) |
| Plan v1 §12: `revalidateUrls(urls)` inside the Payload hook | `revalidatePublic()` → `/svc/revalidate` on the live **public** process (the hook runs in studio; jobs run in the worker) |
| Plan v1 §17: "which crawlers our host's firewall challenges (Vercel or Cloudflare)" | No CDN at launch. If Cloudflare is ever used, apply the switches in §6.3 |
| 16b §2.1 nginx | Confirmed. Added: certbot, `combined_timing` log, three log files, `444` default server, HSTS in nginx only, internal-only `/svc/revalidate` and deep health |
| 16b §6.1 `proxy.js` | Exempt `/svc/health` before the 421 unknown-host rule; host constants from env (staging pair) |
| 16b §6.2 `next.config.js` | Drop HSTS there (nginx sets it); add `compress: false`, `deploymentId`, custom image loader, staging noindex |
| Plan v0a monitoring (Sentry, Better Stack) | Kept, but **outside the VPS**, Sentry PII-scrubbed, and both in the s.17 inventory |

---

## 14. Open items

**[[FACT NEEDED]] (owner)**
- VPS provider, data-centre city, plan specs, OS, IPv4/IPv6, backup/snapshot option.
- Who registered `cocovanillegranby.com`: registrar, registrant name, account access, renewal date.
- Any old link-in-bio, Square Online or Facebook shop URL to redirect.
- Confirmed weekly closed day (maintenance window) and opening hours.
- Mailbox preference (Microsoft 365 or Google Workspace) and the addresses wanted.
- Who receives outage alerts (agency only, or the owner too) and on which phone.
- Whether a defensive `.ca` registration is approved (the business's legal name and jurisdiction for CIRA).

**[[VERIFY]] (search budget exhausted; check before the build)**
- Exact prices and currency: OVH VPS (BHS) after the 2026 changes; Lightsail ca-central-1; DigitalOcean TOR1; Vultr Toronto; Linode Toronto.
- AWS S3 ca-central-1 storage price; OVH Object Storage availability in BHS; Wasabi Toronto region; Backblaze B2 Canadian region.
- SES availability and price in ca-central-1, and the 2026 plan structure; Postmark data location and current plans.
- Cloudflare: the current AI Crawl Control defaults on the Free plan, Bot Fight Mode behaviour, Cloudflare IP ranges (only if a CDN is adopted).
- Bunny CDN pricing and bot defaults.
- Next 16 specifics: standalone copy of `public/` and `.next/static`, `compress`, custom loader config, `revalidateTag` signature, route config for "no prerender at build" with Cache Components.
- Payload: `imageSizes` WebP output and file naming; the `payload migrate` CLI in a one-off container.
- Microsoft 365 / Google Workspace data residency for Canadian tenants.
- Free tiers: Sentry, Better Stack, Healthchecks.io, GitHub Actions minutes and GHCR storage for private repos.

**Docs to open next (not seen this session)**
- Next.js `output` docs: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- PostgreSQL continuous archiving and PITR: https://www.postgresql.org/docs/current/continuous-archiving.html
- Cloudflare IP ranges: https://www.cloudflare.com/ips/
- AWS SES pricing: https://aws.amazon.com/ses/pricing/
- Amazon S3 pricing: https://aws.amazon.com/s3/pricing/
- CAI ÉFVP guide: https://www.cai.gouv.qc.ca/

---

## Sources

Internal (read 2026-10-25)
- Owner requirements — /home/user/coco-vanille-granby/research/requirements-2026-10-25.md — seen 2026-10-25
- Plan v1 Ranking Stack (§11, §12, §15–17) — /home/user/coco-vanille-granby/research/plan-v1-ranking-stack.md — seen 2026-10-25
- Plan v0a master plan (Part 2.1) — /home/user/coco-vanille-granby/research/plan-v0a-master-plan.md — seen 2026-10-25
- Plan v0c site/UX/ordering (§8–9) — /home/user/coco-vanille-granby/research/plan-v0c-site-ux-ordering.md — seen 2026-10-25
- 16b admin tech + subdomain — /home/user/coco-vanille-granby/research/16b-admin-tech-subdomain.md — seen 2026-10-25
- 01 business facts (no website found; hours) — /home/user/coco-vanille-granby/research/01-business-facts.md — seen 2026-10-25
- rank-first 03-technical, 10-measurement, 14-unknown-unknowns, 17-advanced-playbook; scripts/log-bots.mjs — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/ — seen 2026-10-25

Next.js and Payload
- Next.js — Self-hosting guide — https://nextjs.org/docs/app/guides/self-hosting — seen 2026-10-25
- Next.js 15 — Self-hosting guide — https://nextjs.org/docs/15/app/guides/self-hosting — seen 2026-10-25
- Next.js — cacheHandler (incrementalCacheHandlerPath) — https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath — seen 2026-10-25
- Next.js — "Failed to find Server Action" (encryption key) — https://nextjs.org/docs/messages/failed-to-find-server-action — seen 2026-10-25
- Self-hosting guide mirror (deploymentId) — https://mintlify.wiki/vercel/next.js/app/guides/self-hosting — seen 2026-10-25
- next@16.3.8 self-hosting doc (unpkg) — https://app.unpkg.com/next@16.3.8/files/dist/docs/01-app/02-guides/self-hosting.md — seen 2026-10-25
- DEV Community — Self-host Next.js without Vercel in 2026 — https://dev.to/mr_manushukla/self-host-nextjs-without-vercel-in-2026-a-production-guide-to-the-stable-adapter-api-3ll6 — seen 2026-10-25
- Next.js self-hosted demo (nginx compression, buffering) — https://enrgx.duckdns.org/ — seen 2026-10-25
- InfoQ — Next.js 16 release — https://www.infoq.com/news/2025/12/nextjs-16-release — seen 2026-10-25
- Hashnode — Next.js 16.2 — https://hashnode.com/tag/next-js-16 — seen 2026-10-25
- Payload — Jobs Queue overview — https://payloadcms.com/docs/jobs-queue/overview — seen 2026-10-25
- Payload v3 — Queues — https://payloadcms.com/docs/v3/jobs-queue/queues.md — seen 2026-10-25
- Payload v3 — Job Schedules — https://payloadcms.com/docs/v3/jobs-queue/schedules.md — seen 2026-10-25
- Railway — Self-host Payload CMS with Postgres — https://docs.railway.com/guides/payload-cms — seen 2026-10-25

Reverse proxy
- falcao.org — Caddy, Nginx, Traefik: picking a reverse proxy in 2026 — https://falcao.org/posts/caddy-nginx-traefik-2026/ — seen 2026-10-25
- Dokploy — Caddy vs Traefik vs Nginx — https://dokploy.com/blog/caddy-vs-traefik-vs-nginx — seen 2026-10-25
- Caddy — Logging docs — https://caddyserver.com/docs/logging — seen 2026-10-25
- caddyserver/transform-encoder — https://github.com/caddyserver/transform-encoder — seen 2026-10-25
- Caddy community — v2 logfile format — https://caddy.community/t/caddy-v2-logfile-format/11711 — seen 2026-10-25
- Better Stack — Logging in Caddy — https://betterstack.com/community/guides/logging/caddy-logging/ — seen 2026-10-25

CDN and AI crawlers
- MIT Technology Review — Cloudflare will now block AI bots by default (2025-07-01) — https://www.technologyreview.com/2025/07/01/1119498/cloudflare-will-now-by-default-block-ai-bots-from-crawling-its-clients-websites/ — seen 2026-10-25
- Techwyse — Cloudflare's AI bot blocker — https://www.techwyse.com/blog/digital-marketing-101/what-does-cloudflares-ai-bot-blocker-mean-for-digital-marketing — seen 2026-10-25
- Cloudflare blog — Content Signals Policy — https://blog.cloudflare.com/content-signals-policy/ — seen 2026-10-25
- Cloudflare docs — Managed robots.txt — https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/ — seen 2026-10-25
- The Decoder — Cloudflare's granular AI crawler controls — https://the-decoder.com/cloudflare-replaces-its-blanket-ai-bot-block-with-granular-controls-for-search-training-and-agent-crawlers/ — seen 2026-10-25
- Ctrl AI Profit — Ep. 176 Cloudflare and AI bots — https://ctrlaiprofit.buzzsprout.com/2596090/episodes/19462882-ep-176-cloudflare-just-drew-a-line-in-the-sand-over-ai-bots — seen 2026-10-25
- Raptive — Blocking AI crawlers with Cloudflare FAQs — https://help.raptive.com/hc/en-us/articles/38501169866011-Blocking-AI-crawlers-with-Cloudflare-FAQs — seen 2026-10-25

VPS providers
- OVHcloud — VPS Canada (en-ca) — https://www.ovhcloud.com/en-ca/vps/vps-canada/ — seen 2026-10-25
- OVHcloud — Cloud VPS (en-ca) — https://www.ovhcloud.com/en-ca/vps/vps-cloud/ — seen 2026-10-25
- OVHcloud — Dedicated servers in Canada — https://www.ovhcloud.com/en/bare-metal/dedicated-server-canada/ — seen 2026-10-25
- HostingCompass — OVHcloud VPS plans — https://hostingcompass.com/en/providers/ovhcloud/vps — seen 2026-10-25
- Vpsium — OVHcloud VPS-1 — https://vpsium.com/en/product/ovhcloud-vps-1 — seen 2026-10-25
- next.ink — OVHcloud augmente le prix de ses VPS 2026 — https://next.ink/225720/ovhcloud-augmente-fortement-le-prix-de-ses-vps-2026-et-ipv4/ — seen 2026-10-25
- LowEndTalk — OVHcloud price changes Oct 2026 — https://lowendtalk.com/discussion/comment/4845833/ — seen 2026-10-25
- AWS — Lightsail pricing — https://aws.amazon.com/th/lightsail/pricing/ — seen 2026-10-25
- AWS — Lightsail billing and usage (region codes) — https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-your-amazon-lightsail-bill.html — seen 2026-10-25
- diyai.io — DigitalOcean pricing 2026 — https://diyai.io/ai-tools/hosting/digitalocean-pricing/ — seen 2026-10-25
- CostBench — DigitalOcean price change Feb 2026 — https://costbench.com/changelog/digitalocean-price-decrease-2026-02/ — seen 2026-10-25
- Better Stack — DigitalOcean review — https://betterstack.com/community/guides/web-servers/digitalocean-review/ — seen 2026-10-25
- VPSBenchmarks — Vultr Regular 4GB — https://vpsbenchmarks.com/hosters/vultr/plans/regular_4gb_2cores — seen 2026-10-25
- Vultr — Regular Performance — https://www.vultr.com/products/regular-performance-compute/ — seen 2026-10-25
- Akamai — Cloud pricing — https://akamai.com/cloud/pricing — seen 2026-10-25
- CostBench — Linode price history — https://www.costbench.com/software/cloud-infrastructure/linode/price-history/ — seen 2026-10-25
- Sucura Networks — Montréal VPS — https://sucuranetworks.ca/montreal-vps — seen 2026-10-25
- VPS Shell — Montréal VPS — https://www.vpsshell.com/montreal-vps/ — seen 2026-10-25
- Patrii Cloud — https://patrii.cloud/ — seen 2026-10-25
- HostScout — Canadian-owned VPS hosting — https://hostscout.ca/canadian-vps-hosting — seen 2026-10-25
- HostFinder — VPS hosting Canada 2026 — https://hostfinder.ca/best-vps-hosting-canada — seen 2026-10-25
- GitHub zbd384 — Montréal VPS hosting (GTHost) — https://github.com/zbd384/montreal-vps-hosting — seen 2026-10-25

Loi 25
- Fasken — Loi 25 : on répond à vos questions (2 de 3) — https://www.fasken.com/fr/knowledge/loi-25/on-repond-a-vos-questions-2-de-3 — seen 2026-10-25
- IAB Canada — Transferts transfrontaliers (June 2022) — https://iabcanada.com/wp-content/uploads/2022/06/IAB-Canada_BPG-Que_Transferts-transfrontaliers_June-2022.pdf — seen 2026-10-25
- Usercentrics — ÉFVP Loi 25 — https://usercentrics.com/fr/knowledge-hub/fr-ca-efvp-loi-25/ — seen 2026-10-25
- BLG — Cross-border transfers of personal information outside Québec — https://www.blg.com/en/insights/2022/12/cross-border-transfers-of-personal-information-outside-quebec — seen 2026-10-25
- McCarthy Tétrault — CAI guide to Law 25 PIAs — https://www.mccarthy.ca/en/insights/blogs/techlex/quebec-privacy-regulators-guide-law-25-compliant-privacy-impact-assessments — seen 2026-10-25
- IAPP — Québec privacy regulations — https://iapp.org/news/a/iapp-cps-23-forthcoming-quebec-privacy-regulations-situate-province-between-canada-and-europe — seen 2026-10-25

Storage
- CloudTweaks — OVHcloud Object Storage — https://tools.cloudtweaks.com/company/ovhcloud-object-storage — seen 2026-10-25
- getdeploying — Backblaze vs OVH — https://getdeploying.com/backblaze-vs-ovh — seen 2026-10-25
- Wasabi — May 2026 pricing FAQs — https://docs.wasabi.com/docs/may-2026-wasabi-pricing-faqs — seen 2026-10-25
- Wasabi — Pricing FAQs — https://wasabi.com/?p=4612 — seen 2026-10-25

Email
- dev.to — Amazon SES pricing plans in 2026 — https://dev.to/mr_manushukla/amazon-ses-pricing-plans-in-2026-essentials-vs-pro-vs-enterprise-and-when-a-la-carte-still-wins-1ohg — seen 2026-10-25
- usecarly — Amazon SES pricing 2026 — https://www.usecarly.com/blog/amazon-ses-pricing/ — seen 2026-10-25
- Resend — Choosing a region — https://resend.com/docs/dashboard/domains/regions — seen 2026-10-25
- Resend — Multi-region for everyone — https://resend.com/changelog/multi-region-for-everyone — seen 2026-10-25
- Resend — Pricing — https://resend.com/pricing — seen 2026-10-25
- Email Software Insights — Postmark pricing — https://www.emailsoftwareinsights.com/reviews/postmark/pricing/ — seen 2026-10-25
- Activepieces — Postmark pricing 2026 — https://www.activepieces.com/blog/postmark-pricing-plans-costs-by-volume-2026-guide — seen 2026-10-25
- Google Workspace Help — Flexible vs annual plans (FR) — https://knowledge.workspace.google.com/admin/billing/compare-flexible-and-annual-fixed-term-payment-plans?hl=fr — seen 2026-10-25
- Microsoft — Compare Exchange Online plans (en-ca) — https://www.microsoft.com/en-ca/microsoft-365/exchange/compare-microsoft-exchange-online-plans — seen 2026-10-25
- Microsoft — Microsoft 365 plan chooser (en-ca) — https://www.microsoft.com/en-ca/microsoft-365/business/microsoft-365-plan-chooser — seen 2026-10-25
- Canadian Web Hosting — Email hosting stored in Canada — https://www.canadianwebhosting.com/hosting/email-hosting — seen 2026-10-25

Domain
- Google Search Central — Managing multi-regional and multilingual sites — https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites — seen 2026-10-25
- Google Search Console Help — The International Targeting report is deprecated — https://support.google.com/webmasters/answer/12474899 — seen 2026-10-25
- Search Engine Land — Search Console to remove International Targeting report — https://searchengineland.com/google-search-console-to-remove-international-targeting-report-387477 — seen 2026-10-25
- Search Engine Journal — Google uses ccTLDs / Search Console settings to geotarget — https://searchenginejournal.com/google-uses-cctlds-search-console-settings-geotarget-search-results/205486 — seen 2026-10-25
- CIRA — Canadian Presence Requirements for registrants — https://www.cira.ca/en/?p=45244 — seen 2026-10-25
- A2 Hosting — Requirements for .ca domains — https://www.a2hosting.com/kb/getting-started-guide/registering-a-domain1/requirements-for-.ca-domains — seen 2026-10-25
- Wikipedia — .ca — https://en.wikipedia.org/wiki/.ca — seen 2026-10-25
