# 16b · Coco Studio at admin.cocovanillegranby.com: technical options (self-hosted VPS)

> Track: admin dashboard technology. Stage: plan only, no build. Written 2026-10-25.
> Inputs: owner requirements of 2026-10-25 (admin on its own subdomain, owner's VPS, functional and easy for staff), `plan-v1-ranking-stack.md` §9, §10, §12, `plan-v0a-master-plan.md` Part 2.1 and Part 6.
> Labels: **UNVERIFIED** = a search summary or third-party page only, not confirmed on an official page. **UNVERIFIED (FC)** = flagged by the 2026-10-25 fact-check: no independent confirmation found (the shared search budget was used up, so the author's cited source was not re-checked); confirm before relying on it (see the Verification log). **[[FACT NEEDED: …]]** = the owner must supply it. **(est.)** = my own effort estimate, not sourced.
> Code sketches are JavaScript only and are illustrative. They have not been run.

---

## 0. Decision in one screen

| Question | Recommendation |
|---|---|
| Admin stack | **Option B**: Payload CMS 3 as the data layer (schema, access, drafts, jobs, API) + a **custom, task-first "Studio" UI** (Next.js routes) at the root of `admin.cocovanillegranby.com`. Payload's own admin panel stays at `/admin` on the same host as the **« Avancé »** area for the owner and the agency. |
| Code layout | One repo, one Next.js + Payload build. On the VPS it runs as **two Node processes from the same build** (public · studio) plus **one jobs worker**, behind nginx, which routes by host name. |
| Host isolation | Enforced twice: nginx server blocks + `proxy.js` (Next.js 16's new name for middleware; UNVERIFIED (FC)). The public host returns 404 for `/admin`, `/studio`, `/api`. |
| Real-time orders | SSE while Studio is open + Web Push when it is closed (iOS 16.4+ Home Screen app) + SMS to the owner as a last resort. Postgres `LISTEN/NOTIFY` connects the two processes. |
| Indexing | Auth wall + `X-Robots-Tag: noindex` on **every** admin response + a robots.txt on the admin host that **does not** block crawling (Google has to crawl a page to see its noindex). |
| Versions to pin | Payload **3.92.x** (Oct 22, 2026; no 4.0 until it is stable) · Next.js **16.4.x** · Node per Payload's minimum (reported as 22.23.4 for 3.92: verify). UNVERIFIED (FC): all three version facts. At install, read them from the registry (`npm view payload version engines`, `npm view next version`) and pin what it returns. |
| Gating facts | [[FACT NEEDED: VPS provider + data-centre city]] (Loi 25 s.17) · [[FACT NEEDED: POS in use]] · [[FACT NEEDED: counter devices (iPad or Android) + printer]] |

Why this beats "just customize Payload's admin": staff tasks (sold out, display-case photo, closure, pickup check-in, new order) need one-tap screens, offline tolerance and a live order feed. Payload's admin is a generic list → edit → save CMS. I found no evidence that it is optimized for phones, and community reports describe it as slow on very large documents. Payload still provides the hard parts (roles, field access, fr/en/es content, drafts, versions, scheduling, jobs, API), so the custom layer stays thin.

---

## 1. Options compared

| # | Option | VPS fit | Phone UX for floury hands | Effort for v1 (est.) | Maintainability for one developer | Licence / lock-in | Verdict |
|---|---|---|---|---|---|---|---|
| A | Payload admin only, customized (custom dashboard view, custom root views, custom field components) | Yes | Generic forms; mobile behaviour unverified; a custom dashboard helps, but every task stays a form | 1–2 weeks | High (one system) | MIT (open source) | Fine for the owner and agency, **not for staff** |
| **B** | **Payload data layer + custom task-first Studio UI + Payload admin as « Avancé »** | Yes | Designed for it: big buttons, offline outbox, live feed, scanner | 4–6 weeks on top of the Payload model that gets built anyway | High: one schema, one auth, one access layer; Studio screens are ordinary Next.js pages calling the Local API | Same | **Recommended** |
| C | Separate React Admin / Refine SPA on top of Payload's REST/GraphQL | Yes | Good list/CRUD kits, still CRUD-shaped | ≈ B + 1–2 weeks | Lower: second auth path (REST + CSRF/CORS), second UI framework, no server components | Refine core MIT, plus paid enterprise tier; react-admin licence UNVERIFIED | No added value over B |
| D | Directus | Yes (self-host) | Generic data studio | 2–3 weeks + a second backend next to Next.js | Two systems to patch | BSL 1.1: free in production under $5M a year in total finances (UNVERIFIED (FC)); a newer licence is reported (UNVERIFIED) | No |
| E | Strapi 5 | Yes (self-host) | Admin customization is config + extensions | 2–3 weeks + a second server | Two systems | SSO needs Enterprise (Gold), per a search summary of Strapi docs | No |
| F | Medusa v2 admin | Yes | Widgets and UI routes only; you can't change the layout or design of existing pages | High: it is a commerce engine | Overlaps the POS | MIT (UNVERIFIED) | Only if Medusa became the order system: not the plan |
| G | Sanity Studio | Studio yes, data no | Good editor | Medium | Medium | **Content Lake is hosted by Sanity and can't be self-hosted** | Conflicts with "own VPS" and with keeping data in a chosen location |

Payload capabilities B relies on (all official docs unless marked):

| Need | Payload 3 feature |
|---|---|
| Studio home inside the Payload admin (for « Avancé ») | `admin.components.views` replaces or adds root views (e.g., `dashboard`). Custom views are **public by default**: they need their own auth check |
| Custom inputs (allergen checklist, price + portions) | Custom `Field` components resolved by file path through the auto-generated import map. With a custom Field you send and receive the value yourself (`useField`) |
| fr / en / es content | `localization` (no limit on the number of locales). Region codes such as `fr-CA` are allowed (third-party guide) |
| Admin UI in French | `i18n.supportedLanguages`; the admin panel ships in 30+ languages. The French pack's import path is UNVERIFIED (pattern: `@payloadcms/translations/languages/<code>`) |
| Drafts, versions, autosave | `versions.drafts` (adds `_status`), `versions.drafts.autosave` |
| Scheduled publish | Built into v3 through the jobs queue and the "Schedule Publish" drawer. Requires drafts and a running jobs worker |
| Background jobs | Jobs queue. On a dedicated server the docs prefer a separate worker started with `payload jobs:run --cron … --queue … --handle-schedules` over `jobs.autoRun` |
| Live preview | `admin.livePreview.url` + `breakpoints`. Uses `postMessage` to an iframe of the public site. A front-end CSP has to allow the admin host in `frame-ancestors` |
| Roles, field rules | Collection and field `access`. Field access can't return query constraints (only collection access can) |
| Integrations, bots | `useAPIKey`: API keys sent in the `Authorization` header, so no cookie and no CSRF |
| Agency reuse (`tenant_id`, plan v1 §12) | `@payloadcms/plugin-multi-tenant`: tenant field, admin tenant selector, scoped list views |
| Plain JavaScript (owner rule) | [[FACT NEEDED / VERIFY: a Payload 3 project run in plain JS with `payload.config.js`. Official templates are TypeScript; all packages are ESM]] |

---

## 2. Subdomain and routing design

### 2.1 Topology on the VPS

| Layer | Public: cocovanillegranby.com (+ www → 301 to apex) | Admin: admin.cocovanillegranby.com |
|---|---|---|
| DNS | A/AAAA → VPS | A/AAAA → VPS (same IP) |
| nginx server block | `server_name` apex + www; reject unknown Host headers; `/admin`, `/studio`, `/api` → 404 at the edge | `server_name admin…`; `X-Robots-Tag` added on every status code (including 4xx/5xx and nginx's own error pages). That needs `add_header X-Robots-Tag "noindex, nofollow, noarchive" always;`: without `always`, nginx adds headers only to 2xx/3xx responses. Any `add_header` inside a `location` also drops the server-level ones, so repeat it there (nginx headers module docs, not re-opened: UNVERIFIED (FC)); `limit_req` on login routes; buffering off for the SSE path; optional IP allowlist on `/admin` only |
| Node process | `next start` on port A (role: public) | `next start` on port B (role: studio). Same build, separate process: a crash or memory leak in the admin can't take down the public site |
| Jobs | One worker process (`payload jobs:run`) for IndexNow, GBP sync, feeds, reminders, the Claude drafts | (same worker) |
| Data | Postgres (local on the VPS, or managed in Montréal: owner decision) + media on disk or S3-compatible storage | Same database |

Next.js recommends a reverse proxy in front of the Node server (to deal with malformed requests, slow connections, payload limits and rate limiting). Streaming responses need proxy buffering turned off (`X-Accel-Buffering: no`).

Self-hosting also gives the ranking track **raw access logs** for the public host. That replaces the "Vercel log drain" of plan v1 §11 for the monthly AI-crawler log check (`log-bots.mjs`).

### 2.2 Path map

| Path | Public host | Admin host |
|---|---|---|
| `/` and site pages | Site (fr-CA root, /en/, /es/) | → rewritten to Studio (`/studio/*` internally) |
| `/admin/*` | **404** | Payload admin = « Avancé » (owner, agency) |
| `/api/*` (Payload REST, `/api/graphql`) | **404**: the public site uses the Local API server-side, so Payload's REST API is never exposed publicly | Payload API (Studio, integrations, webhooks) |
| `/svc/*` (public endpoints: pickup slots, order submit) | Route handlers / server actions → Local API with `overrideAccess: false` | 404 |
| `/robots.txt` | Normal public file (no need to mention admin) | Served by `proxy.js`, non-blocking (see §2.4) |
| `/sitemap.xml` | Public URLs only | none |

Why `/svc` and not `/api/public`: Payload mounts its REST catch-all route at `/api`. Keeping public endpoints off that prefix means the public host can block `/api` entirely.

### 2.3 Payload settings for the split

| Setting | Value | Why / source |
|---|---|---|
| `serverURL` | `https://admin.cocovanillegranby.com` | Protocol + domain (+ port) only, no path. Used for absolute URLs such as reset links. Bug in 3.68.3 with `serverURL` set (closed by #14907; still reported on 3.68.4): test on the pinned version |
| `routes.admin` | `/admin` (default) | A custom path must match the location of the `(payload)` folder |
| `csrf` | `['https://admin.cocovanillegranby.com']` | Domains trusted for cookie-authenticated requests. `serverURL` is added by default |
| `cors` | Admin origin only (or none) | The public site never calls Payload over HTTP. Exact option shape UNVERIFIED (main config docs not opened) |
| Auth cookie | Host-only (leave `domain` unset), `secure: true`, `sameSite: 'Lax'` | Never sent to the public host, so the public site can't leak or replay it. Cookies on another domain count as third-party; subdomain setups are the documented workaround, and we don't even need sharing |
| `admin.meta.robots` | `noindex, nofollow` (the default since PR #11623; UNVERIFIED (FC): set it explicitly anyway, as in §6.3) | That meta tag stops indexing, not crawling |
| Live preview `url` | `https://cocovanillegranby.com/svc/preview?…` (signed token → draft mode) | The public CSP for the preview route only: `frame-ancestors https://admin.cocovanillegranby.com`. Preview responses are `noindex` too |
| Upload URLs | Public pages must reference `https://cocovanillegranby.com/media/...`, not the admin host | [[VERIFY: how Payload builds file URLs when `serverURL` is the admin host; plan: nginx serves `/media` on the public host from the upload directory or a bucket]] |
| IndexNow hook (plan v1 §12) | `host` / `keyLocation` = the **public** host constant, never `serverURL` | Otherwise IndexNow is pinged with the admin host |

### 2.4 Keeping the admin host out of search: what Google says

| Fact (Google Search Central) | Consequence for us |
|---|---|
| `noindex` works only if the page is **not blocked by robots.txt**. A blocked URL can still appear (URL only) if linked from elsewhere | Don't `Disallow: /` on the admin host while relying on noindex |
| `noindex` in robots.txt is **not supported** | Use the header (X-Robots-Tag) and the meta tag |
| Meta tag and X-Robots-Tag header have the same effect | The header covers non-HTML responses too (JSON, images, PDFs). Put it on every response |
| robots.txt rules apply only to the **host, protocol and port** where the file lives | The admin host needs its own robots.txt. The public robots.txt doesn't need to list `/admin`, which keeps it clean and doesn't advertise the path |
| Private content should be **password-protected** (the strongest option); noindex is a second layer | Everything except `/login` sits behind auth. Crawlers see a login page with noindex |
| The Removals tool is temporary (third-party summary) | For emergencies only |

Policy: (1) auth on everything; (2) `X-Robots-Tag: noindex, nofollow, noarchive` from both Next.js and nginx; (3) admin robots.txt = `User-agent: *` with an empty `Disallow:`; (4) once Search Console shows nothing indexed for the admin host, you may switch it to `Disallow: /` to save crawling (owner decision); (5) no links to the admin host from public pages, sitemaps, emails sent to customers or schema.

Next.js's `app/robots.js` is **one route for the whole app**. It is static (cached) by default. Making it differ by host would mean reading request headers (a Dynamic API), which makes the route dynamic (Next.js robots.txt docs, not re-opened: UNVERIFIED (FC)). The simpler setup is to serve the admin robots.txt from `proxy.js` (sketch §6.1) and keep `app/robots.js` static for the public host.

---

## 3. Real-time, PWA, offline, printing, scanning, camera

| Capability | Options | iPhone / iPad (Safari) | Android (Chrome) | Choice |
|---|---|---|---|---|
| New-order alert while Studio is open | **SSE** (one-way, plain HTTP, `EventSource` reconnects automatically, `Last-Event-ID`) · WebSocket (two-way: not needed) · polling | SSE works | SSE works | **SSE** + 30 s polling fallback. nginx: buffering off; return the `Response` before the stream loop (otherwise everything arrives at the end) |
| Alert when Studio is closed | Web Push (VAPID; `web-push` npm 3.6.7, UNVERIFIED (FC) as the current version) | **iOS/iPadOS 16.4+ only for web apps added to the Home Screen**; the permission prompt must follow a tap. Declarative Web Push since iOS 18.4 (no service worker needed; UNVERIFIED (FC)). OneSignal reports deliveries that stop working: monitor | Supported | Push + **SMS to the owner** for orders due today (Twilio) as a backstop |
| Cross-process event | In-memory emitter (fails: orders are written by the public process, and the stream is served by the studio process) · **Postgres LISTEN/NOTIFY** | — | — | `LISTEN` on one dedicated connection (not pooled); `pg-listen` handles reconnects. NOTIFY is a hint, not a durable queue: always re-read from the database |
| Install as an app | Web manifest + service worker; Home Screen | Install from Safari (OneSignal says Safari; another OneSignal page says other browsers work too: tell staff "Safari → Partager → Sur l'écran d'accueil") | Install prompt | One "Studio" app per device |
| Offline actions (sold out, photo, check-in) | Background Sync API · IndexedDB outbox | **Background Sync not supported** (caniuse: Safari and iOS, all versions) | Supported | IndexedDB outbox, flushed on app open / `online` / `visibilitychange`; idempotency keys on the server |
| Receipt / label printing | WebUSB / Web Serial / Web Bluetooth | **Not supported** (WebKit opposes them) | Chromium only | Not used |
| | Epson ePOS SDK for JavaScript (browser → network TM printer, e.g., TM-m30) | v2.27.0 docs list Safari on iOS 5–16.0: test on today's iPadOS | Yes | Option if an Epson printer exists |
| | **Star CloudPRNT** (the printer polls our server; built into TSP143IV and the mC-Print series: UNVERIFIED (FC), check the exact model and interface before buying) · WebPRNT | Device-independent | Device-independent | **Preferred for new hardware**: works from any phone or tablet, survives a device change |
| | Print through the POS | Depends on the POS | Depends | **First choice if the POS already prints online orders** (Square: paid orders with fulfilment details go to Order Manager; pickup is supported) |
| Pickup check-in (QR) | `BarcodeDetector` · WASM (zxing-wasm / polyfill) | **Not available** (caniuse: off by default on iOS 17–26.x; UNVERIFIED (FC). The WASM fallback is needed either way) | Supported on Chrome for Android | Native API when present, otherwise a WASM fallback. Always offer a manual fallback: 4-digit code or name/phone search. The QR holds only an opaque token |
| Photo from the camera | File input with `accept="image/*"` (+ `capture`; MDN not re-checked) → client compression → upload | `browser-image-compression` handles jpeg/png/webp/bmp; **HEIC not listed** | Same | Compress to a quality master (e.g., long edge 2560 px) before upload; the server generates the sizes. [[VERIFY on an iPhone: HEIC → JPEG conversion when uploading through a file input]] |

---

## 4. Security checklist (admin host)

| # | Control | Setting | Source / reason |
|---|---|---|---|
| 1 | **Patch level** | Payload ≥ 3.90.0 is mandatory: it fixed Oct 2026 CVEs rated up to CVSS 9.2 and 9.8 (token-claim injection; an access bypass on orderable collections). Pin 3.92.x; re-check GitHub advisories in the Friday gate. UNVERIFIED (FC): the CVE numbers, scores and fixed-in versions come from third-party trackers only. The rows below cite CVE-2026-105849, -105861, -105866 and -105868; Sources also list -105851, -105859 and -105863. None of these IDs is linked to the 9.2 / 9.8 scores. Before the build, open each advisory at github.com/payloadcms/payload/security/advisories and record the fixed-in version | Third-party CVE trackers + Payload release notes (verify the GHSA pages) |
| 2 | Local API access | **Always pass `user` + `overrideAccess: false`** in Studio code. In Payload 3, Local API calls skip access control by default; Payload 4 reverses that default (UNVERIFIED (FC); the helper in §6.3 is right under either default) | Payload Local API access-control docs v3 / v4 |
| 3 | Sessions | `useSessions: true` (the default; sessions can be revoked, stateless JWTs can't). `tokenExpiration` = one shift (12 h) for counter devices | Payload auth docs |
| 4 | Timeouts by risk | OWASP-cited ranges: 2–5 min idle for high-value apps, 15–30 min for low-risk ones (secondary source). Short idle timeouts don't work at a floury counter, so: **staff role = low privilege + long session; owner/agency actions that matter (roles, integrations, exports, prices, deletes) need a fresh passkey (Face ID) check** | OWASP (via secondary sources) |
| 5 | Passkeys | Community Payload plugins (Better Auth-based payload-auth / payload-passkey; Auth Pwless by trieb-work) or our own on `@simplewebauthn/server` + `/browser`. Apple needs iOS 16 / macOS 13 for full passkey support | Plugin listings; SimpleWebAuthn docs |
| 6 | TOTP (backup factor) | `payload-totp` (community; v3.0.4, Sep 27, 2026; one collection) or `@plutotcool/payload-plugin-two-factor` (secrets encrypted with AES-256-GCM) | Plugin listings: audit before adopting |
| 7 | Brute force | `maxLoginAttempts: 5`, `lockTime` (**milliseconds**). Set `access.unlock` to owner only (an advisory on 3.84.1: by default any logged-in user could unlock others). nginx `limit_req` (per IP, small burst, `nodelay`) on the login routes. Note CVE-2026-105866 (lockout as denial of service, fixed in 3.90): passkey login keeps the owner from being locked out | Payload auth docs; Fluid Attacks; nginx docs |
| 8 | API keys | Only on dedicated "integration" users with minimal access; keys go in the Authorization header. **Rotate after upgrading** (CVE-2026-105849 exposed other users' API keys to readers of auth documents) | Payload docs; CVE tracker |
| 9 | Uploads | Allow-list `image/jpeg, image/png, image/webp` (+ HEIC if needed); **block XML/XSL/SVG** (CVE-2026-105868, stored XSS in the admin origin); disable external-URL uploads (CVE-2026-105861) | CVE trackers |
| 10 | CSP | Nonce-based CSP generated in `proxy.js` for Studio; `frame-ancestors 'none'` on the admin host; the public preview route allows the admin host | Next.js CSP guide |
| 11 | Other headers | HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy: camera=(self)` on admin (scanner), `camera=()` on public | Standard practice (not re-sourced) |
| 12 | IP allowlist (optional) | Staff phones on mobile data change IP, so don't allowlist Studio. Optional allowlist on `/admin` (« Avancé ») for the bakery's fixed IP + the agency's VPN. [[FACT NEEDED: does the bakery have a fixed IP?]] | — |
| 13 | Roles (least privilege) | See the table below. Payload's admin panel is closed to staff, translator and viewer (`access.admin` on the users collection: verify the name in the docs) | Plan v0a §6.6 |
| 14 | Audit log | `afterChange` / `afterDelete` hooks → an `AuditLog` collection (who, what, before/after diff, IP, device), read-only, owner-visible; plus Payload versions on content | Plan v0a §6.1 ("every change logged") |
| 15 | Backups | Nightly `pg_dump` + media sync, encrypted, **off-site in a chosen jurisdiction**, monthly restore test logged as a gate. [[FACT NEEDED: VPS snapshot and backup offering]] | Plan v1 §10 ("tested backups") |
| 16 | Loi 25 | Personal data (orders, phones, review texts) stored or sent outside Québec → privacy impact assessment (s.17; UNVERIFIED (FC): read s.17 of the private-sector act, CQLR c. P-39.1, on LégisQuébec, with counsel). Sources disagree on whether a server elsewhere in Canada triggers it. The same applies to sending reviews to the Claude API (US) and to Twilio/email providers | Google Cloud Law 25 page, DataGuidance, consultancies: legal check |
| 17 | No indexing | §2.4 | Google Search Central |
| 18 | Secrets | One `.env` per process, outside the repo; separate keys per integration; recorded in Studio › Intégrations (expiry, scopes) | Plan v0a §6.3 |

Roles → permissions (draft):

| Role | Studio screens | Payload « Avancé » | Sensitive actions |
|---|---|---|---|
| Owner (Propriétaire) | All | Yes | All, with a passkey step-up |
| Manager (Gérant·e) | Orders, Catalogue, Vitrine, Avis, Fermeture, Social | Read + content | Prices and allergens, with a step-up |
| Staff (Équipe / « Comptoir » device) | Aujourd'hui, Commandes, Ramassage (scan), Épuisé, Vitrine photo, Fermeture (if allowed) | No | None |
| Agency (Agence) | Gates, Scoreboard, Recherche, Visibilité IA, Intégrations | Yes (no users/roles) | Integrations, with a step-up |
| Translator (Traduction) | Translation queue (EN/ES fields only) | No | None |
| Viewer (Lecture) | Dashboards | No | None |
| Integration bot | — (API key) | — | Only its own collections |

---

## 5. Integration surfaces

| API | We pull | We push | Access / approval | Limits and gotchas | Studio module |
|---|---|---|---|---|---|
| Google Business Profile: Business Information API | Location data | Hours, special hours, description, attributes (`locations.patch` + `updateMask`, scope `business.manage`) | **Application for Basic API Access** (GBP API contact form). A quota of 0 means not approved (don't request an increase); 300 QPM = approved; reviews within 14 days; the website must represent the business; **the email domain must match the website domain** (UNVERIFIED (FC): re-read the Prerequisites page before filing) | Exact field paths for hours not re-checked. The "profile at least 60 days old" rule is third-party and unconfirmed | Fiche d'entreprise, Fermeture |
| GBP v4 reviews | Reviews | Replies (`updateReply`: creates or replaces) | Same | Works only on a **verified** location | Avis (24 h timer, plan v1 §16) |
| GBP v4 local posts | Posts | Create / patch / delete | Same | Error `LOCATION_DISABLED_FOR_LOCAL_POST_API` exists | Cartes, Saisons |
| GBP food menus (v4) | — | Menu sections and items | Same | A menu supplied through the API may disable the editor in Business Profile (Google help) | Catalogue |
| GBP products | — | **No public API** (third-party claim; matches plan v0a) | — | Studio creates a manual task | Catalogue |
| Instagram API with Instagram Login | Comments, insights, mentions | Posts (feed, Reels, Stories, carousels), replies, hide/delete comments | Permissions `instagram_business_basic`, `instagram_business_manage_comments` (+ publishing); no Facebook Page needed. **Advanced Access only for accounts the app doesn't own or manage** | **100 API posts per rolling 24 h** (a carousel counts as 1; one Meta page still says 50: check `content_publishing_limit`; UNVERIFIED (FC)); use webhooks rather than polling | Social Studio, Avis |
| Facebook Pages API | Comments, insights | `POST /{page-id}/feed` | `pages_manage_posts` + read permissions; App Review and Business Verification for non-admin use (third-party guides) | Graph API version not checked | Social Studio |
| POS: Square | Orders, catalogue, webhooks | Orders (pickup fulfilment); `CreatePaymentLink` (`quick_pay`) for deposits | Developer app + OAuth | No Orders API fee with Square payments; 1% with other processors (country not stated). Paid orders with fulfilment details appear in Order Manager. DELIVERY is beta | Commandes |
| POS: Lightspeed K-Series | Menus, orders | Local / to-go orders | **Partner programme** first, then API credentials (third-party) | Sandbox unclear | Commandes |
| POS: Clover | Orders | Orders (Orders API covers the US and Canada) | Needs a Clover app for webhooks | Webhooks send IDs only; fetch the details | Commandes |
| Stripe Payment Links | Payment status (webhooks) | Deposit links | Standard account | Canadian domestic cards reported at 2.9% + C$0.30 (third-party; confirm on stripe.com/en-ca/pricing; UNVERIFIED (FC)) | Demandes (quotes → deposit) |
| Twilio SMS | Delivery status | Pickup reminders, closure notices, the owner's order backstop | Toll-free verification required before sending; A2P in Canada → short code or verified toll-free recommended | C$/US$ not stated: **$0.0079 per segment** outbound long code or toll-free (Twilio CA page; UNVERIFIED (FC): price and currency to re-check on the pricing page); carriers filter A2P. CASL consent for anything promotional | Courriels & SMS |
| Email (SES or Postmark) | Bounces | Order confirmations, reports | Domain DNS (SPF/DKIM/DMARC) | Prices are third-party only (SES ≈ $0.10 per 1,000; Postmark from $15 a month for 10k) [[FACT NEEDED: provider]] | Courriels |
| Search Console API | Queries, pages, index status | Sitemaps | OAuth, verified property | Search Analytics 1,200 QPM per site; URL Inspection 2,000/day + 600/min per property (2022 figure) | Recherche, Scoreboard |
| Bing Webmaster API | Queries, crawl | `SubmitUrl` | API key (one per user, covers all their verified sites) | Daily limits not found | Recherche |
| GA4 Data API | Traffic, key events, AI channel | — (Measurement Protocol is separate) | OAuth / service account | Token quotas, e.g., 200k/day and 40k/hour for a standard property (third-party citing Google); `returnPropertyQuota: true` | Analytique |
| IndexNow | — | Changed URLs (≤ 10,000 per request; `host`, `key`, `keyLocation`, `urlList`) | Key file on the **public** host | Shared with participating engines | Gates, Intégrations |
| Claude API (`@anthropic-ai/sdk`) | — | Drafts: review replies, posts, captions, alt text, the Monday summary | API key | `claude-sonnet-5-5`: $2 / $10 per M tokens, 1M context; `claude-haiku-5-5`: $0.10 / $0.50 (prompts ≤ 100K tokens; $0.50 / $2.50 above), 1M context. `2026-10-21` is an **API version** (the `anthropic-version` header; new SDK majors send it by default), not a cut-off date. On that version, a Messages request that sends `temperature` / `top_p` / `top_k` returns a 400 on every model, even at default values. On `2023-06-01`, Sonnet 5.5 and Haiku 5.5 already reject non-default values. So never send them. Check `stop_reason === 'refusal'` (Haiku 5.5 has no server-side refusal fallback). **Human approval before anything is published**; personal data → Loi 25 PIA | Copilot, Avis, Social |

Routing for Claude: Haiku 5.5 for classification (language, sentiment, topics, "3 stars or fewer" alert); Sonnet 5.5 for French-first drafts. Facts are always injected from Studio data (plan v0a §6.7). Allergen text is never AI-written.

Timeline dependency: the GBP API application needs the live website and a **@cocovanillegranby.com mailbox**. File it as soon as content site v1 is up (week 6) so the 14-day review ends before the Studio v1 GBP features (weeks 7–10, plan v1 §3).

---

## 6. JavaScript sketches

### 6.1 `proxy.js`: host-based routing, admin robots.txt, public lockout

```js
// proxy.js — Next.js 16 renamed middleware to proxy (codemod: middleware-to-proxy).
// On Next 15, name the file middleware.js and export `middleware`.
import { NextResponse } from 'next/server';

const ADMIN_HOST = 'admin.cocovanillegranby.com';
const PUBLIC_HOSTS = new Set(['cocovanillegranby.com', 'www.cocovanillegranby.com']);

const ADMIN_ONLY = /^\/(admin|studio|api)(\/|$)/;                  // never served on the public host
const ADMIN_PASSTHROUGH = /^\/(admin|api|_next|icons)(\/|$)|^\/(sw\.js|manifest\.webmanifest)$/;

// Not a Disallow: Google must be able to crawl to read the noindex header.
const ADMIN_ROBOTS = 'User-agent: *\nDisallow:\n';

export function proxy(request) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase(); // nginx: proxy_set_header Host $host
  const { pathname } = request.nextUrl;

  if (host === ADMIN_HOST) {
    if (pathname === '/robots.txt') {
      return new NextResponse(ADMIN_ROBOTS, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow' },
      });
    }
    if (pathname.startsWith('/studio')) {                    // one visible URL per screen
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/studio/, '') || '/';
      return NextResponse.redirect(url, 308);
    }
    if (ADMIN_PASSTHROUGH.test(pathname)) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = `/studio${pathname === '/' ? '' : pathname}`; // e.g. /commandes → app/studio/commandes
    return NextResponse.rewrite(url);
  }

  if (PUBLIC_HOSTS.has(host)) {
    if (ADMIN_ONLY.test(pathname)) return new NextResponse('Not found', { status: 404 });
    return NextResponse.next();
  }

  return new NextResponse('Misdirected Request', { status: 421 }); // raw IP or stray DNS name
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
```

### 6.2 `next.config.js`: X-Robots-Tag on every admin response, per-host headers

```js
// next.config.js — `has: [{ type: 'host' }]` is documented for headers().
// nginx adds the same X-Robots-Tag on its own error pages (502/504) for the admin host (add_header … always).
import { withPayload } from '@payloadcms/next/withPayload'; // as in Payload's Next.js template — verify at install

const ADMIN_HOST = 'admin.cocovanillegranby.com';
const PUBLIC_HOST = 'cocovanillegranby.com';

const base = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig = {
  output: 'standalone',
  async headers() {
    return [
      { source: '/:path*', headers: base },
      {
        source: '/:path*',
        has: [{ type: 'host', value: ADMIN_HOST }],
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: PUBLIC_HOST }],
        headers: [{ key: 'Permissions-Policy', value: 'camera=(), microphone=()' }],
      },
      {
        source: '/svc/preview/:path*', // Payload live preview iframe only
        headers: [
          { key: 'Content-Security-Policy', value: `frame-ancestors https://${ADMIN_HOST}` },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
```

### 6.3 Payload excerpt: split-host auth and access defaults

```js
// payload.config.js (excerpt) — keys from Payload docs; values are proposals.
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { fr } from '@payloadcms/translations/languages/fr'; // path pattern per i18n docs — verify
import { en } from '@payloadcms/translations/languages/en';
import { Users } from './collections/Users.js';
import { Orders } from './collections/Orders.js';

export default buildConfig({
  serverURL: 'https://admin.cocovanillegranby.com',
  csrf: ['https://admin.cocovanillegranby.com'],
  admin: { user: 'users', meta: { robots: 'noindex, nofollow' } },
  i18n: { supportedLanguages: { fr, en } },                     // admin UI in French first
  localization: { locales: ['fr', 'en', 'es'], defaultLocale: 'fr', fallback: false }, // no FR text under EN URLs
  collections: [Users, Orders /* Products, Pages, Media, AuditLog, Gates… */],
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  secret: process.env.PAYLOAD_SECRET,
});

// collections/Users.js (excerpt)
export const Users = {
  slug: 'users',
  auth: {
    useSessions: true,               // default; revocable (stateless JWTs are not)
    tokenExpiration: 60 * 60 * 12,   // seconds — one shift
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,        // milliseconds
    useAPIKey: true,                 // used only by role 'integration'
    cookies: { secure: true, sameSite: 'Lax' }, // no `domain`: host-only on admin.*
  },
  access: {
    unlock: ({ req }) => req.user?.role === 'owner',
    admin: ({ req }) => ['owner', 'manager', 'agency'].includes(req.user?.role), // verify option name
  },
  fields: [{ name: 'role', type: 'select', required: true,
    options: ['owner', 'manager', 'staff', 'agency', 'translator', 'viewer', 'integration'] }],
};

// Studio server code: one helper so no screen forgets access rules (Payload 3 skips them by default).
export const asUser = (user, args) => ({ ...args, user, overrideAccess: false });
// await payload.update(asUser(user, { collection: 'products', id, data: { soldOutToday: true } }));
```

### 6.4 SSE endpoint for new orders (admin host)

```js
// lib/order-events.js — one LISTEN connection per process (pg-listen handles reconnects; API per its README)
import createSubscriber from 'pg-listen';

const subscriber = createSubscriber({ connectionString: process.env.DATABASE_URI });
const listeners = new Set();
let ready;

function ensureConnected() {
  ready ??= (async () => {
    subscriber.notifications.on('orders_new', (msg) => listeners.forEach((fn) => fn(msg)));
    subscriber.events.on('error', (err) => console.error('[order-events]', err));
    await subscriber.connect();
    await subscriber.listenTo('orders_new');
  })();
  return ready;
}

export function subscribe(fn) { ensureConnected(); listeners.add(fn); return () => listeners.delete(fn); }
export const notifyNewOrder = (id) => ensureConnected().then(() => subscriber.notify('orders_new', { id }));

// collections/Orders.js (excerpt): the public process creates the order → the studio process hears about it.
// VERIFY: whether afterChange runs before the Postgres transaction commits; the stream retries reads anyway.
// hooks: { afterChange: [({ doc, operation }) => { if (operation === 'create') notifyNewOrder(doc.id); }] }
```

```js
// app/studio/flux/commandes/route.js  →  https://admin.cocovanillegranby.com/flux/commandes
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';
import { subscribe } from '@/lib/order-events';

export const dynamic = 'force-dynamic';
const CAN_SEE_ORDERS = new Set(['owner', 'manager', 'staff']);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function GET(request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user || !CAN_SEE_ORDERS.has(user.role)) return new Response('Unauthorized', { status: 401 });

  const enc = new TextEncoder();
  let stop = () => {};

  const stream = new ReadableStream({
    start(controller) {
      const send = (o) => controller.enqueue(enc.encode(
        `id: ${Date.parse(o.createdAt)}\nevent: order\ndata: ${JSON.stringify({
          id: o.id, code: o.pickupCode, pickupAt: o.pickupAt, total: o.total, status: o.status,
        })}\n\n`));
      const read = async (id) => {
        for (const delay of [0, 300, 1000]) {             // NOTIFY may arrive before commit
          await wait(delay);
          try { return await payload.findByID({ collection: 'orders', id, user, overrideAccess: false, depth: 0 }); }
          catch { /* not visible yet */ }
        }
        return null;
      };

      controller.enqueue(enc.encode('retry: 5000\n\n'));
      const since = request.headers.get('last-event-id');    // replay what a sleeping tablet missed
      if (since) {
        payload.find({ collection: 'orders', user, overrideAccess: false, depth: 0, limit: 50, sort: 'createdAt',
          where: { createdAt: { greater_than: new Date(Number(since)).toISOString() } } })
          .then((r) => r.docs.forEach(send)).catch(() => {});
      }
      const unsubscribe = subscribe(async ({ id }) => { const o = await read(id); if (o) send(o); });
      const ping = setInterval(() => controller.enqueue(enc.encode(': ping\n\n')), 25_000);
      stop = () => { clearInterval(ping); unsubscribe(); };
      request.signal.addEventListener('abort', stop);
    },
    cancel() { stop(); },
  });

  return new Response(stream, {                              // returned immediately; work happens in start()
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',                             // nginx must not buffer (Next.js self-hosting guide)
    },
  });
}
```

```js
// Studio client: live list + polling fallback + "Activer les alertes" (Web Push needs a tap on iOS)
export function liveOrders(onOrder, refreshAll) {
  let poll = null;
  const es = new EventSource('/flux/commandes');             // same origin → session cookie is sent
  es.addEventListener('order', (e) => onOrder(JSON.parse(e.data)));
  es.onopen = () => { clearInterval(poll); poll = null; refreshAll(); };
  es.onerror = () => { poll ??= setInterval(refreshAll, 30_000); };
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && refreshAll());
  return () => { es.close(); clearInterval(poll); };
}

export async function activerAlertes(vapidKeyBytes) {          // bound to the button « Activer les alertes de commande »
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return 'installer-depuis-safari';
  if ((await Notification.requestPermission()) !== 'granted') return 'refuse';
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKeyBytes });
  await fetch('/flux/abonnements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) });
  return 'ok';
}
```

```js
// Offline outbox — Safari has no Background Sync, so flush on open / online / visible.
// idb: any small IndexedDB wrapper (e.g. idb-keyval) — choose at build time.
export async function queueAction(idb, action) {              // { type: 'soldOut', productId }
  const item = { ...action, key: crypto.randomUUID(), at: Date.now() };
  await idb.set(`outbox:${item.key}`, item);
  return flushOutbox(idb);
}
export async function flushOutbox(idb) {
  for (const item of await idb.values('outbox:')) {
    const res = await fetch('/actions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': item.key }, body: JSON.stringify(item) }).catch(() => null);
    if (!res?.ok) break;                                       // keep order; retry later
    await idb.del(`outbox:${item.key}`);
  }
}
```

UI copy (Québec French) for these states: « Hors ligne — 2 actions en attente, envoi automatique au retour du réseau » · « Nouvelle commande · ramassage 14 h 30 · 48,00 $ » · « Pour recevoir les alertes, ajoutez Studio à l'écran d'accueil depuis Safari ».

---

## 7. Changes to earlier plans

| Earlier plan | Now |
|---|---|
| v0a §2.1: Studio at `/studio` inside the public app; Postgres/S3 on Supabase or AWS `ca-central-1` | Studio at `admin.cocovanillegranby.com` on the owner's VPS; the data location depends on the VPS (FACT NEEDED). Managed Montréal Postgres stays an option |
| v0a §2.1: `apps/worker` | Kept, as the `payload jobs:run` worker process |
| v1 §11: Vercel log drain for bot logs | nginx access logs on the VPS |
| v1 §17: "which crawlers our host's firewall challenges (Vercel or Cloudflare)" | Now: VPS firewall + nginx (+ Cloudflare only if added); re-run `crawler-access.mjs` against the VPS |
| v1 §12 IndexNow hook (`HOST`) | Must be the public host constant, not Payload's `serverURL` |
| v0a §6.3 Avis "48 h timer" | 24 h (v1 §16) |

---

## Verification log (2026-10-25)

Method and limits:

- Adversarial pass on the 22 highest-risk claims (versions, CVEs, prices, quotas, platform support, law, AI API terms).
- **The first WebSearch was refused.** The 200-call budget is shared by every agent in this turn, and other agents had used it up. WebFetch and curl are blocked. So no claim could be re-searched or refuted independently.
- Verdicts rely only on independent local sources: the Claude API skill cache (Anthropic docs mirror), sibling tracks that ran their own searches (research/18, research/16a) and the Ranking Stack scripts. A fact that matches what I knew before 2026 but has no such source stays **Unverified**.
- Every Unverified row is tagged **UNVERIFIED (FC)** in the text above.
- To re-run, ask for a follow-up turn with a fresh search budget. Start with rows 1–5, which gate the build.

| # | Claim (section) | Verdict | Source URL / note |
|---|---|---|---|
| 1 | Payload 3.92.0 released 2026-10-22; no stable 4.0 (§0) | Unverified | https://github.com/payloadcms/payload/releases (author's source, not re-opened). Pin from `npm view` at install |
| 2 | Next.js 16.4.x current, 16.4.3 on npm (§0) | Unverified | https://www.npmjs.com/package/next (author's source, not re-opened) |
| 3 | Payload 3.92 needs Node ≥ 22.23.4 (§0) | Unverified | No source located. Read `engines` from `npm view payload engines` |
| 4 | Next.js 16 renamed middleware to `proxy.js` (codemod `middleware-to-proxy`) (§0, §6.1) | Unverified | https://nextjs.org/docs/app/getting-started/proxy (author's source). Matches the Next.js 16 release as known before 2026, but not re-checked |
| 5 | Payload ≥ 3.90.0 fixes Oct 2026 CVEs (CVSS 9.2 / 9.8); IDs CVE-2026-1058xx (§4 #1, #7–#9) | Unverified | Third-party trackers only. **Inconsistency:** 7 IDs are cited and none is mapped to a score. Check https://github.com/payloadcms/payload/security/advisories |
| 6 | Payload 3 Local API skips access by default; Payload 4 reverses it (§4 #2) | Unverified | https://payloadcms.com/docs/v3/local-api/access-control.md, v4 page (author's sources). The `asUser` helper is safe either way |
| 7 | `admin.meta.robots` defaults to noindex, nofollow since PR #11623 (§2.3) | Unverified | https://github.com/payloadcms/payload/commit/5285518 (author's source). The config sets it explicitly anyway |
| 8 | iOS/iPadOS 16.4+ Web Push only for Home Screen web apps; prompt must follow a tap (§3) | **Confirmed** | research/18 claim 8 (own searches: WebKit, https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/; Safari 16.4 shipped 2023-03-27). research/16a agrees |
| 9 | Declarative Web Push since iOS 18.4, no service worker (§3) | Unverified | https://webkit.org/?p=16535 (author's source). research/18 marks it "not re-checked" |
| 10 | `BarcodeDetector` unavailable on iOS Safari (off by default 17–26.x) (§3) | Unverified | https://caniuse.com/mdn-api_barcodedetector (author's source). The design has a WASM and manual fallback anyway |
| 11 | Star CloudPRNT built into TSP143IV and mC-Print (§3) | Unverified | https://starmicronics.com/product/tsp143iv-thermal-receipt-printer/ (author's source) |
| 12 | Directus BSL 1.1, free under $5M total finances (§1) | Unverified | https://directus.io/blog/changing-our-license-one-year-later (author's source). The verdict ("No") doesn't depend on it |
| 13 | GBP API: quota 0 = not approved, 300 QPM, 14-day review, email domain must match the site (§5) | Unverified | https://developers.google.com/my-business/content/prereqs (author's source). research/18 #17 cites this file, so it is not independent |
| 14 | Instagram API: 100 API posts per rolling 24 h (§5) | Unverified | https://developers.facebook.com/docs/instagram-platform/content-publishing (author's source). Read `content_publishing_limit` live |
| 15 | Stripe Canada: 2.9% + C$0.30 domestic cards (§5) | Unverified | Third-party only. Check https://stripe.com/en-ca/pricing |
| 16 | Twilio Canada SMS: $0.0079 per segment (§5) | Unverified | https://twilio.com/sms/pricing/ca (author's source). Currency also unconfirmed |
| 17 | `claude-sonnet-5-5` $2 / $10, 1M context; `claude-haiku-5-5` $0.10 / $0.50 for prompts ≤ 100K (§5) | **Confirmed** (detail added) | Claude API skill cache (2026-10-06), mirroring https://platform.claude.com/docs/en/about-claude/models/overview. Added: Haiku 5.5 costs $0.50 / $2.50 above 100K tokens and has a 1M context |
| 18 | "Since 2026-10-21 the Messages API rejects `temperature` / `top_p` / `top_k`" (§5) | **Corrected** | `2026-10-21` is an API version, not a date. Requests on it get a 400 on every model. On `2023-06-01`, only non-default values are rejected on Sonnet 5.5 / Haiku 5.5. Source: https://platform.claude.com/docs/en/api/migration-2026-10-21 (via the Claude API skill) |
| 19 | IndexNow: ≤ 10,000 URLs per request (§5) | **Confirmed** (secondary) | Ranking Stack `scripts/indexnow.mjs` caps `urlList` at 10,000. Author's sources: https://yandex.ru/support/webmaster/en/indexnow/reference, https://indexnow.org/searchengines |
| 20 | Loi 25 s.17: privacy impact assessment before personal data leaves Québec (§4 #16) | Unverified | Author's sources are secondary (Google Cloud, DataGuidance, consultancies). Read s.17 of CQLR c. P-39.1 on https://www.legisquebec.gouv.qc.ca/ with counsel |
| 21 | nginx adds `X-Robots-Tag` "on every status code, including error pages" (§2.1, §6.2) | **Corrected** (missing condition) | Needs `add_header … always;`. Without it, nginx adds headers only to 2xx/3xx, and a `location`-level `add_header` drops the server-level ones. https://nginx.org/en/docs/http/ngx_http_headers_module.html (cited, not re-opened) |
| 22 | `app/robots.js` "produces one file for the whole app, whatever the host" (§2.4) | **Corrected** (overstated) | It is one route, static by default. It can vary by host only by reading request headers, which makes it dynamic. Serving the admin file from `proxy.js` stays the simpler choice. https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots (cited, not re-opened) |

Tally: 3 Confirmed · 3 Corrected · 16 Unverified · 0 refuted.

---

## Sources

- Payload Release Notes — https://payloadcms.com/posts/releases — seen 2026-10-25
- Payload releases on GitHub (3.92.0, Oct 22, 2026; 3.91.0; 3.90.x) — https://github.com/payloadcms/payload/releases — seen 2026-10-25
- New in Payload: A Security Patch and Stability Fixes — https://payloadcms.com/posts/releases/new-in-payload-a-security-patch-and-stability-fixes — seen 2026-10-25
- Payload Release Notes (Releasebot) — https://releasebot.io/updates/payloadcms — seen 2026-10-25
- Payload CMS in 2026: Payload 4 canary status (yugraphik) — https://yugraphik.com/en/blog/web-development/payload-cms-what-it-is-comparison/ — seen 2026-10-25
- Payload: Customizing Views — https://payloadcms.com/docs/custom-components/custom-views — seen 2026-10-25
- Payload: Custom views (beta docs, public by default) — https://payloadcms.com/docs/beta/custom-components/custom-views — seen 2026-10-25
- Payload: Swap in your own React components (import map) — https://payloadcms.com/docs/v3/custom-components/overview.md — seen 2026-10-25
- Payload: Customizing Fields — https://payloadcms.com/docs/admin/fields — seen 2026-10-25
- Payload: I18n — https://payloadcms.com/docs/configuration/i18n — seen 2026-10-25
- Payload: Localization (v3) — https://payloadcms.com/docs/v3/configuration/localization.md — seen 2026-10-25
- Payload multi-tenant localization (buildwithmatija) — https://www.buildwithmatija.com/blog/payload-multi-tenant-localization — seen 2026-10-25
- Payload: Jobs Queue overview — https://payloadcms.com/docs/beta/jobs-queue/overview — seen 2026-10-25
- Payload: Queues (autoRun, bin script) — https://payloadcms.com/docs/jobs-queue/queues — seen 2026-10-25
- Payload: Queues (v3) — https://payloadcms.com/docs/v3/jobs-queue/queues.md — seen 2026-10-25
- Payload: Job Schedules — https://payloadcms.com/docs/beta/jobs-queue/schedules — seen 2026-10-25
- payload-plugin-scheduler README (built-in Schedule Publish in v3) — https://unpkg.com/payload-plugin-scheduler@1.0.1/README.md — seen 2026-10-25
- Railway: Payload CMS template (separate jobs service) — https://railway.com/deploy/payload-cms.md — seen 2026-10-25
- Railway: Payload CMS [Oct 26] template (Payload 3.91, Next.js 16.4) — https://railway.com/deploy/payload-cms-oct-26--payload-cms-postgres — seen 2026-10-25
- Payload: Drafts (v3) — https://payloadcms.com/docs/v3/versions/drafts.md — seen 2026-10-25
- Payload: Live Preview — https://payloadcms.com/docs/live-preview — seen 2026-10-25
- Payload: Live Preview overview (v3) — https://payloadcms.com/docs/v3/live-preview/overview.md — seen 2026-10-25
- Payload: Cookie Strategy (v3) — https://payloadcms.com/docs/v3/authentication/cookies.md — seen 2026-10-25
- Payload: Authentication config — https://payloadcms.com/docs/authentication/config — seen 2026-10-25
- Payload: Authentication Overview (v4) — https://payloadcms.com/docs/v4/authentication/overview.md — seen 2026-10-25
- Payload: Authentication Operations (v3) — https://payloadcms.com/docs/v3/authentication/operations.md — seen 2026-10-25
- Payload community: recommended pattern for proxying the current user to the Local API — https://payloadcms.com/community-help/discord/recommended-pattern-for-proxying-current-user-to-local-api — seen 2026-10-25
- Payload: Local API overview — https://payloadcms.com/docs/local-api/overview — seen 2026-10-25
- Payload: Respecting Access Control with Local API Operations (v3) — https://payloadcms.com/docs/v3/local-api/access-control.md — seen 2026-10-25
- Payload: Respecting Access Control with Local API Operations (v4) — https://payloadcms.com/docs/v4/local-api/access-control.md — seen 2026-10-25
- Payload: Using Payload outside Next.js — https://payloadcms.com/docs/local-api/outside-nextjs — seen 2026-10-25
- Payload: The Payload Config (serverURL) — https://payloadcms.com/docs/configuration/overview — seen 2026-10-25
- Payload: Custom Admin Panel Location — https://payloadcms.com/docs/admin/admin-panel-location — seen 2026-10-25
- Payload issue #14900 (serverURL breaks admin in 3.68.3) — https://github.com/payloadcms/payload/issues/14900 — seen 2026-10-25
- Host Payload on a subdomain and subpath with nginx (nouance.io) — https://nouance.io/articles/how-to-host-payloadcms-on-a-subdomain-and-subpath-with-nginx — seen 2026-10-25
- Payload: Page Metadata (admin.meta.robots) — https://payloadcms.com/docs/admin/metadata — seen 2026-10-25
- Payload commit "defaults to noindex nofollow" — https://github.com/payloadcms/payload/commit/5285518 — seen 2026-10-25
- Payload: Field-level access (v3.80.0 docs mirror) — https://code.morphllm.com/payloadcms/payload/raw/tag/v3.80.0/docs/access-control/fields.mdx — seen 2026-10-25
- Payload: Access control (product page) — https://payloadcms.com/access-control — seen 2026-10-25
- Payload: Multi-Tenant Plugin — https://payloadcms.com/docs/plugins/multi-tenant — seen 2026-10-25
- Payload community: admin UI crawling with 100 layout blocks — https://payloadcms.com/community-help/discord/admin-ui-is-crawling-with-100-layout-blocks — seen 2026-10-25
- Payload CMS in production: honest answers (buildwithmatija) — https://www.buildwithmatija.com/de/blog/payload-cms-in-production-honest-answers — seen 2026-10-25
- Next.js 16 and Payload CMS compatibility (buildwithmatija) — https://www.buildwithmatija.com/blog/nextjs-16-payload-cms-compatibility — seen 2026-10-25
- payload-totp (payload.market) — https://payload.market/item/payload-totp-NJ162BH — seen 2026-10-25
- @plutotcool/payload-plugin-two-factor — https://store.boilerplate.com/product/npm/QHBsdXRvdGNvb2wvcGF5bG9hZC1wbHVnaW4tdHdvLWZhY3Rvcg== — seen 2026-10-25
- Use passkeys with Payload CMS through payload-passkey (Roboin, Sep 16, 2026) — https://roboin.io/article/en/2026/09/16/payload-passkey-brings-passkey-authentication-to-payload-cms/ — seen 2026-10-25
- Auth Pwless by trieb-work — https://payload.market/item/trieb.work-payload-auth-pwless-R3SFZDC — seen 2026-10-25
- Payload CMS auth plugins: which one should you use? (buildwithmatija) — https://www.buildwithmatija.com/blog/which-payload-cms-auth-plugin-to-use — seen 2026-10-25
- CVE-2026-105863 (learnctem) — https://learnctem.com/cve-intelligence-hub/cve-2026-105863 — seen 2026-10-25
- CVE-2026-105859 (The Hacker Wire) — https://www.thehackerwire.com/cve-2026-105859-payload-cms-access-control-bypass-enables-unauthorized-data-manipulation/ — seen 2026-10-25
- CVE-2026-105866 account lockout DoS (safeguard.sh) — https://safeguard.sh/resources/blog/cve-2026-105866-payload-cms-account-lockout-dos — seen 2026-10-25
- CVE-2026-105849 API key disclosure (safeguard.sh) — https://safeguard.sh/resources/blog/cve-2026-105849-payload-cms-api-key-disclosure — seen 2026-10-25
- CVE-2026-105868 stored XML script execution (safeguard.sh) — https://safeguard.sh/resources/blog/cve-2026-105868-payload-cms-xml-upload-xss — seen 2026-10-25
- CVE-2026-105861 auth data leak on external uploads (safeguard.sh) — https://safeguard.sh/resources/blog/cve-2026-105861-payload-cms-upload-auth-forwarding — seen 2026-10-25
- CVE-2026-105851 duplicate access bypass (safeguard.sh) — https://safeguard.sh/resources/blog/cve-2026-105851-payload-cms-duplicate-access-bypass — seen 2026-10-25
- PayloadCMS 3.84.1 lockout bypass through default unlock access (Fluid Attacks) — https://fluidattacks.com/advisories/stitches — seen 2026-10-25
- Next.js: Proxy (getting started) — https://nextjs.org/docs/app/getting-started/proxy.md — seen 2026-10-25
- Next.js Proxy replaces Middleware (John Kavanagh) — https://johnkavanagh.co.uk/articles/next-js-proxy-replaces-middleware/ — seen 2026-10-25
- PostHog: Next.js proxy file (middleware.js before 16, proxy.js from 16) — https://posthog.com/docs/advanced/proxy/nextjs-middleware — seen 2026-10-25
- next on npm (16.4.3) — https://www.npmjs.com/package/next — seen 2026-10-25
- Next.js release history (versionlog) — https://versionlog.com/nextjs/ — seen 2026-10-25
- Next.js 17 isn't out (suhag.me) — https://suhag.me/blog/what-nextjs-version-should-i-use — seen 2026-10-25
- Next.js: headers (has: host) — https://nextjs.org/docs/app/api-reference/config/next-config-js/headers — seen 2026-10-25
- Next.js: Self-hosting guide — https://nextjs.org/docs/app/guides/self-hosting — seen 2026-10-25
- Next.js: Content Security Policy guide — https://nextjs.org/docs/app/guides/content-security-policy — seen 2026-10-25
- Using SSE to stream responses in Next.js (Upstash) — https://upstash.com/blog/sse-streaming-llm-responses — seen 2026-10-25
- Fixing slow SSE streaming in Next.js (Medium) — https://medium.com/@oyetoketoby80/fixing-slow-sse-server-sent-events-streaming-in-next-js-and-vercel-99f42fbdb996 — seen 2026-10-25
- open-notebook PR #770 (rewrites buffer SSE in standalone mode) — https://cubic.dev/pr/lfnovo/open-notebook/pull/770 — seen 2026-10-25
- pg-listen on npm — https://npmjs.com/package/pg-listen — seen 2026-10-25
- How to use LISTEN/NOTIFY for real-time updates in PostgreSQL (OneUptime) — https://oneuptime.com/blog/post/2026-01-25-use-listen-notify-real-time-postgresql/view — seen 2026-10-25
- web-push (Snyk advisor, 3.6.7) — https://snyk.io/advisor/npm-package/web-push — seen 2026-10-25
- web-push (jsDelivr) — https://www.jsdelivr.com/package/npm/web-push — seen 2026-10-25
- WebKit: Web Push for Web Apps on iOS and iPadOS — https://webkit.org/?p=13878 — seen 2026-10-25
- OneSignal: Web push for iOS — https://documentation.onesignal.com/docs/web-push-for-ios — seen 2026-10-25
- WebKit: Meet Declarative Web Push — https://webkit.org/?p=16535 — seen 2026-10-25
- WebKit Features in Safari 18.4 — https://webkit.org/?p=16574 — seen 2026-10-25
- WebKit Features in Safari 18.5 — https://webkit.org/?p=16923 — seen 2026-10-25
- caniuse: BarcodeDetector API — https://caniuse.com/mdn-api_barcodedetector — seen 2026-10-25
- Barcode scanning on iOS: the missing Web API and a WebAssembly solution (DEV) — https://dev.to/ilhannegis/barcode-scanning-on-ios-the-missing-web-api-and-a-webassembly-solution-2in2 — seen 2026-10-25
- barcode-detector-api-polyfill README — https://cdn.jsdelivr.net/npm/barcode-detector-api-polyfill@1.2.0/README.md — seen 2026-10-25
- mobile_scanner docs (zxing-wasm fallback) — https://pub.dev/documentation/mobile_scanner/latest/ — seen 2026-10-25
- Firefox Nightly Web Serial (The Register, Apr 14, 2026) — https://theregister.com/2026/04/14/firefox_nightly_web_serial — seen 2026-10-25
- caniuse: Web Bluetooth — https://caniuse.com/web-bluetooth — seen 2026-10-25
- Firefox declines WebUSB, after Safari (usefulangle) — https://usefulangle.com/web-updates/post/80/firefox-decines-to-implement-web-usb-api — seen 2026-10-25
- caniuse: Background Sync API — https://caniuse.com/background-sync — seen 2026-10-25
- WebKit bug 201866 (Background Sync) — https://bugs.webkit.org/show_bug.cgi?id=201866 — seen 2026-10-25
- Epson ePOS SDK for JavaScript v2.27.0 (PDF) — https://download3.ebz.epson.net/dsc/f/03/00/15/16/08/912403dcd72ccb22fc13f41eec229b35e2a1ea9c/ov_ePOS_SDK_JavaScript_v2.27.0.pdf — seen 2026-10-25
- Epson ePOS SDK reference — https://download4.epson.biz/sec_pubs/pos/reference_en/technology/epson_epos_sdk.html — seen 2026-10-25
- Star TSP143IV (CloudPRNT built in) — https://starmicronics.com/product/tsp143iv-thermal-receipt-printer/ — seen 2026-10-25
- Star CloudPRNT — https://star-emea.com/products/cloudprnt/ — seen 2026-10-25
- Star WebPRNT interface compatibility table — https://star-m.jp/products/s_print/sdk/webprnt/manual/en/_interfaceTable.htm — seen 2026-10-25
- browser-image-compression on npm — https://www.npmjs.com/package/browser-image-compression — seen 2026-10-25
- Google: Block Search indexing with noindex — https://developers.google.com/search/docs/advanced/crawling/block-indexing — seen 2026-10-25
- Google: How Google interprets the robots.txt specification — https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec?hl=es — seen 2026-10-25
- robots.txt per host (PPC Land summary) — https://ppc.land/robots-txt/ — seen 2026-10-25
- Google: Control what you share with Google — https://developers.google.cn/search/docs/crawling-indexing/control-what-you-share?hl=uk — seen 2026-10-25
- Google is indexing your staging site (Alphonso Labs) — https://www.alphonsolabs.com/?p=2689 — seen 2026-10-25
- Google Cloud: Québec Law 25 — https://cloud.google.com/security/compliance/quebeclaw25?hl=fr — seen 2026-10-25
- Québec overview of Law 25, part two (DataGuidance) — https://www.dataguidance.com/opinion/quebec-overview-law-25-part-two — seen 2026-10-25
- Law 25 cross-border transfers (Hilotech) — https://hilotech.ca/en/wiki/law-25/cross-border-transfers — seen 2026-10-25
- Law 25 compliant web hosting (GoTekky) — https://www.gotekky.com/guides/hosting-and-infrastructure/law-25-quebec-compliant-web-hosting/ — seen 2026-10-25
- OWASP Periodic Table: Insufficient Session Expiration — https://owasp.org/index.php/OWASP_Periodic_Table_of_Vulnerabilities_-_Insufficient_Session_Expiration — seen 2026-10-25
- Session timeout glossary citing OWASP ranges (MojoAuth) — https://mojoauth.com/glossary/session-timeout.md — seen 2026-10-25
- nginx: ngx_http_limit_req_module — https://nginx.org/r/limit_req — seen 2026-10-25
- SimpleWebAuthn: Passkeys — https://simplewebauthn.dev/docs/advanced/passkeys — seen 2026-10-25
- Directus: Changing our license, one year later — https://directus.io/blog/changing-our-license-one-year-later — seen 2026-10-25
- Directus: Getting Started — https://directus.io/docs/getting-started/overview — seen 2026-10-25
- Directus licensing discussion — https://community.directus.io/t/discussion-licensing-concerns-and-a-model-that-might-help/1880 — seen 2026-10-25
- Migrating Directus to code (license change claim) — https://www.rapidevelopers.com/md/no-code-to-code/how-to-migrate-directus-project-to-code — seen 2026-10-25
- Strapi: Admin panel customization — https://docs.strapi.io/cms/admin-panel-customization — seen 2026-10-25
- Strapi guide 2026 (techsy) — https://techsy.io/en/blog/strapi-guide — seen 2026-10-25
- Sanity: Setup and deployment — https://www.sanity.io/docs/setup-and-deployment — seen 2026-10-25
- Sanity answers: where is data stored — https://www.sanity.io/answers/beginner-questions-about-data-storage-and-deployment-in-sanity — seen 2026-10-25
- Medusa: Customize Admin Dashboard — https://docs.medusajs.com/learn/customization/customize-admin — seen 2026-10-25
- Medusa: Admin Widgets — https://docs.medusajs.com/learn/fundamentals/admin/widgets — seen 2026-10-25
- Medusa: UI Routes — https://docs.medusajs.com/learn/fundamentals/admin/ui-routes/index.html.md — seen 2026-10-25
- Refine vs React Admin (Refine) — https://refine.dev/blog/refine-vs-react-admin/ — seen 2026-10-25
- React-Admin vs Refine (Marmelab, 2023) — https://marmelab.com/blog/2023/07/04/react-admin-vs-refine.html — seen 2026-10-25
- Google Business Profile APIs: Usage limits — https://developers.google.com/my-business/content/limits — seen 2026-10-25
- Google Business Profile APIs: Prerequisites — https://developers.google.com/my-business/content/prereqs — seen 2026-10-25
- Google Business Profile APIs: FAQ — https://developers.google.com/my-business/content/faq — seen 2026-10-25
- GBP: REST resource accounts.locations.reviews — https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews — seen 2026-10-25
- GBP: Package google.mybusiness.v4 — https://developers.google.com/my-business/reference/rpc/google.mybusiness.v4 — seen 2026-10-25
- GBP Business Information API: locations.patch — https://developers.google.com/my-business/reference/businessinformation/rest/v1/locations/patch — seen 2026-10-25
- Google Business Profile Help: About the menu editor — https://support.google.com/business/answer/9455840?hl=en — seen 2026-10-25
- Google Business Profile Help: How to use the Business Profile APIs — https://support.google.com/business/answer/6333473?hl=en — seen 2026-10-25
- Google Products: the part nobody automates (no products API) — https://www.theimagency.com/blog/google-business-profile-products-no-api — seen 2026-10-25
- Meta: Instagram Content Publishing — https://developers.facebook.com/docs/instagram-platform/content-publishing — seen 2026-10-25
- Meta: Instagram API with Instagram Login — https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login — seen 2026-10-25
- Meta: Instagram Comment Moderation — https://developers.facebook.com/docs/instagram-platform/comment-moderation — seen 2026-10-25
- Meta: Pages API — https://developers.facebook.com/documentation/pages-api — seen 2026-10-25
- Meta: Pages API posts — https://developers.facebook.com/documentation/pages-api/posts — seen 2026-10-25
- Facebook API permissions guide (bundle.social) — https://bundle.social/blog/facebook-api-permissions — seen 2026-10-25
- Square: Orders API — https://developer.squareup.com/docs/orders-api/what-it-does — seen 2026-10-25
- Square: Orders API fulfillments — https://developer.squareup.com/docs/orders-api/fulfillments — seen 2026-10-25
- Square: Quick pay checkout — https://developer.squareup.com/docs/checkout-api/quick-pay-checkout — seen 2026-10-25
- Square: CreatePaymentLink reference — https://developer.squareup.com/reference/square/checkout-api/create-payment-link — seen 2026-10-25
- Square forum: DELIVERY fulfilments not in Order Manager — https://developer.squareup.com/forums/t/orders-api-delivery-fulfilments-created-successfully-but-not-appearing-in-orders-manager-or-square-kds/26705 — seen 2026-10-25
- Square API essentials (Rollout) — https://rollout.com/integration-guides/square/api-essentials — seen 2026-10-25
- Lightspeed K-Series integration (Storekit) — https://storekit.com/docs/guides/integrations/pos/lightspeed-k-series — seen 2026-10-25
- Lightspeed API summary (Jentic) — https://jentic.com/apis/lightspeed — seen 2026-10-25
- Clover: Manage orders data — https://docs.clover.com/docs/working-with-orders — seen 2026-10-25
- Clover API essentials (Rollout) — https://rollout.com/integration-guides/clover/api-essentials — seen 2026-10-25
- Stripe: July 2024 pricing update for Canadian businesses — https://support.stripe.com/questions/july-2024-pricing-update-for-canadian-businesses-on-standard-pricing — seen 2026-10-25
- Stripe Canada fees (Venn) — https://www.venn.ca/resources/how-to-save-on-your-stripe-payments-for-canadian-businesses — seen 2026-10-25
- Stripe Canada fees (EcomCalcTools) — https://ecomcalctools.com/blog/fees-stripe/stripe-canada-fees/ — seen 2026-10-25
- Twilio SMS pricing, Canada — https://twilio.com/sms/pricing/ca — seen 2026-10-25
- Twilio Canada SMS guidelines — https://static0.twilio.com/guidelines/ca/sms — seen 2026-10-25
- Twilio: Best practices for toll-free SMS in the US and Canada — https://support.twilio.com/hc/en-us/articles/360038172934-Best-Practices-for-Using-Toll-Free-SMS-and-MMS-in-the-US-and-Canada — seen 2026-10-25
- Postmark vs Amazon SES (ToolQuestor) — https://toolquestor.com/vs/postmark-vs-amazon-ses — seen 2026-10-25
- Amazon SES pricing 2026 (SaaS Price Pulse) — https://www.saaspricepulse.com/blog/amazon-ses-pricing-per-1000-emails-2026 — seen 2026-10-25
- Search Console API: Usage limits — https://developers.google.com/webmaster-tools/limits — seen 2026-10-25
- Search Central blog: URL Inspection API (Jan 2022) — https://developers.google.com/search/blog/2022/01/url-inspection-api — seen 2026-10-25
- Google Analytics blog: Managing quota for the Data API — https://developers.google.com/analytics/blog/2023/data-api-quota-management — seen 2026-10-25
- GA4 API quotas (SEO Gets) — https://seogets.com/help/google-analytics-4-api-quotas-and-how-they-can-be-exceeded-1xz8u — seen 2026-10-25
- Bing: Adaptive URL submission API set-up guide — https://blogs.bing.com/webmaster/may-2019/Easy-set-up-guide-for-Bing’s-Adaptive-URL-submission-API — seen 2026-10-25
- Yandex: IndexNow API request reference — https://yandex.ru/support/webmaster/en/indexnow/reference — seen 2026-10-25
- IndexNow: Documentation for search engines — https://indexnow.org/searchengines — seen 2026-10-25
- Anthropic: Models overview (IDs, context, prices; via the Claude API skill cache dated 2026-10-06) — https://platform.claude.com/docs/en/about-claude/models/overview.md — seen 2026-10-25
- Anthropic: Pricing — https://platform.claude.com/docs/en/about-claude/pricing.md — seen 2026-10-25
- Best VPS in Toronto 2026 (Valebyte, vendor) — https://www.valebyte.com/es/blog/best-vps-in-toronto-2026-review-and-prices/ — seen 2026-10-25
- Best Montreal VPS hosting (HostAdvice) — https://hostadvice.com/vps/montreal/ — seen 2026-10-25
- Owner's plan v1 — /home/user/coco-vanille-granby/research/plan-v1-ranking-stack.md — seen 2026-10-25
- Owner's master plan v0a — /home/user/coco-vanille-granby/research/plan-v0a-master-plan.md — seen 2026-10-25
- rank-first reference 03-technical ("block only admin, internal search, carts, staging") — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/03-technical.md — seen 2026-10-25

Fact-check additions (2026-10-25):

- Anthropic: Migrating to API version 2026-10-21 (sampling parameters removed; via the local Claude API skill cache) — https://platform.claude.com/docs/en/api/migration-2026-10-21 — seen 2026-10-25
- Anthropic: Models overview (Haiku 5.5 price above 100K tokens, 1M context, no server-side refusal fallback; via the local Claude API skill cache dated 2026-10-06) — https://platform.claude.com/docs/en/about-claude/models/overview.md — seen 2026-10-25
- nginx: ngx_http_headers_module (`add_header … always`, inheritance) — https://nginx.org/en/docs/http/ngx_http_headers_module.html — cited, not re-opened 2026-10-25 (search budget used up)
- Next.js: robots.txt file convention (static by default) — https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots — cited, not re-opened 2026-10-25 (search budget used up)
- LégisQuébec: Act respecting the protection of personal information in the private sector, CQLR c. P-39.1 (s.17) — https://www.legisquebec.gouv.qc.ca/ — to be read, not opened 2026-10-25
- GitHub: Payload security advisories — https://github.com/payloadcms/payload/security/advisories — to be read, not opened 2026-10-25
- Sibling track: dated-claims verification (claim 8, iOS web push; S28 WebKit) — /home/user/coco-vanille-granby/research/18-dated-claims-verification.md — seen 2026-10-25
- Sibling track: admin UX inspiration (web push, Background Sync notes) — /home/user/coco-vanille-granby/research/16a-admin-ux-inspiration.md — seen 2026-10-25
- Ranking Stack script `indexnow.mjs` (`urlList: urls.slice(0, 10000)`) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/scripts/indexnow.mjs — seen 2026-10-25
