# 19 · Build workflow and what is required from Yahya

> Written 2026-10-25. Stage: plan only, no code yet. Sources: research/00 §11 and §13 (roadmap and dates), 10 (ordering), 14 (owner questions), 15 (decisions), 16 (admin spec), 17 (VPS), 07 (legal), plan-v1 §12 (CI and rank-first jobs).
> Week 0 starts Monday 2026-10-26. Ordering + Studio MVP live in W11–12 (2027-01-11 → 01-24).
> Three roles: **Claude Code** builds in this repo. **Yahya** (operator and agency) decides, gives access and reviews. **The bakery owner** supplies facts, approves, and owns every account.

---

## 1. How the build works

### 1.1 Where things run

```
This repo (GitHub: yahyahoussini/coco-vanille-granby)
   │  Claude Code writes code on a branch → opens a pull request
   ▼
GitHub Actions (CI)
   │  lint · unit tests · Playwright end-to-end · rank-first gate (audit, links, images, render-diff,
   │  schema, hreflang) · Lighthouse CI · axe accessibility
   │  green → builds one Docker image → pushes it to GitHub Container Registry
   ▼
Your VPS (Québec data centre)
   ├─ staging.cocovanillegranby.com   (password + noindex)  ← you review here
   ├─ cocovanillegranby.com            (public site)
   └─ admin.cocovanillegranby.com      (Coco Studio)
       one image → 3 processes: web · studio · worker, + Postgres; nginx in front; blue/green deploy
```

Why deploys go through GitHub Actions: this cloud session's network policy blocks most hosts (it can't reach Instagram, Facebook, Google Maps or, by default, your VPS). GitHub Actions can reach the VPS. Secrets live in GitHub Actions secrets and in the VPS `.env`, **never in chat or in the repo**.

### 1.2 The loop for every change

| Step | Who | What |
|---|---|---|
| 1. Brief | Claude | One spec per piece of work, from the research files and that topic session's decisions |
| 2. Build | Claude | Code on a feature branch. Big phases use parallel agents, with adversarial review before the pull request |
| 3. Gates | GitHub Actions | All checks in §1.1. **Red = no merge.** `[[FACT NEEDED]]` markers block publishing |
| 4. Preview | Claude → staging | Deploy to `staging.cocovanillegranby.com` |
| 5. Review | Yahya (owner for copy and prices) | Click through on a phone; approve or comment on the pull request |
| 6. Release | Claude merges, Actions deploys | Blue/green switch after a health check |
| 7. After deploy | Actions | `check-urls`, `crawlers` (every search and AI crawler gets a 200), IndexNow ping, sitemap |
| 8. Measure | Weekly | Monday scoreboard (30 prompts), Search Console, Bing, GA4 → ≤ 3 action cards |

### 1.3 Planned repo layout (built in W1–2)

```
apps/web/            Next.js + Payload 3: public site, Studio at the admin host, Payload admin at /admin
  src/app/(site)/    FR at /, EN at /en/, ES at /es/
  src/app/(studio)/  Coco Studio screens (served only on admin.cocovanillegranby.com)
  src/collections/   Payload: Business, Location, Hours, SpecialHours, Product, Variant, Allergen,
                     Page, FAQ, Media, Order, Request, Slot, CapacityPool, Review, Redirect, AuditLog
  src/jobs/          worker: SMS, email, IndexNow, GBP sync, rank-first intake
packages/schema/     JSON-LD generators (Bakery, Product/Offer, BreadcrumbList, Person)
packages/seo/        hreflang, sitemap, robots, page-contract checks
tools/               rank-first scripts (audit, links, check-urls, crawlers, indexnow, score…)
infra/               Dockerfile, docker-compose, nginx, deploy script, backup + restore scripts, VPS hardening
.github/workflows/   ci.yml, deploy-staging.yml, deploy-prod.yml, weekly.yml (Monday 06:00), friday.yml
research/, data/     this planning work (kept)
```

All code is JavaScript (no TypeScript), subject to the W1 half-day spike on Payload in plain JS (12 D5). If Payload refuses plain JS, the fallback is decided in session 6.

---

## 2. Build phases

| Phase | Weeks | Claude builds | You approve | Gate |
|---|---|---|---|---|
| **0 · Decide** | W0, Oct 26 – Nov 1 | Session notes, the owner message, the NAP file | Session 1 codes; go/no-go on the owner's answers | **G0**: shop open, Google profile not "temporarily closed", owner access known |
| **1 · Foundations** | W1–2, Nov 2–15 | Repo scaffold; CI; Docker + nginx + deploy; VPS hardening script; DNS records list; holding page (NAP, hours, phone, holiday orders, `/buches-de-noel/` if confirmed); robots + sitemap; Payload data model; design tokens v0; backups + restore test; plain-JS spike | VPS and DNS access; NAP file; photos | **G1**: baseline saved, holding page 200 to every crawler. **G2**: restore test logged, publish guard works |
| **2 · Content site v1** | W3–6, Nov 16 – Dec 13 | FR pages (home, `/carte/`, `/commander/` interim request form, `/nous-trouver/`, `/a-propos/`, `/prix/`, cake page, `/allergenes/`, legal ×4) + EN core; schema graph; FAQ; portion calculator if standards exist; GA4 with consent; IndexNow; design system from session 4 | Copy and prices (owner); design direction (session 4) | **G4**: audit 0 failures, CWV green, no marker. **G5**: key pages indexed in Google and Bing. **G6**: ordering spec signed |
| **3 · Ordering + Studio MVP** | W7–10, Dec 14 – Jan 10 | Ordering engine (slots, capacity, cut-off, deposits, payments, SMS, email, production sheet); checkout; Studio MVP per the session 1 answers; load test; owner and staff tests | Test orders on staging; owner test in the shop | **G10**: owner test 5/5, restore test, tax classes stamped, lawyer sign-off on checkout |
| **4 · Launch** | W11–12, Jan 11–24 | Go-live; Product/Offer markup with real availability; server-side purchase event; Google profile order link; Saint-Valentin in date-first mode | 10-min onboarding; install the PWA | **G12**: first 20 real orders, no lost or duplicated SMS |
| **5 · Grow** | W13–18+, Jan 25 → | 1 page a week; re-baseline vs W1; Merchant Center 5-product test; Studio v1.1; Q1 price study; Pâques pre-orders Mar 1 | Monday 5 min; review replies ≤ 24 h | **G14**: rhythm running. **G18**: definition-of-first review |

Topic sessions (00 §15) run alongside: 1 admin → 2 owner facts → 3 positioning + IA → 4 design → 5 ordering → 6 technical SEO → 7 local + reviews → 8 content + AEO → 9 GEO + off-site → 10 measurement → 11 legal → 12 hosting + ops → 13 budget + roadmap. Each one ends with decisions written to `research/sessions/NN-*.md`, and only then does the matching build phase start.

---

## 3. Required from Yahya

Rule for every account: **the bakery owns it**; you get an admin or manager role; Claude never holds passwords. Keys go into GitHub Actions secrets or the VPS `.env`.

### 3.1 Now (week 0, by Sunday 2026-11-01)

| # | What | Why it blocks | Format |
|---|---|---|---|
| Y1 | **Session 1 answers** (codes 1–10) + design-system choice for the mockups | The admin MVP scope and the W7–10 workload | Reply in chat |
| Y2 | **Send the owner message** (`research/14-owner-questions.md` §14) and bring back the answers | G0 go/no-go: open status, Google profile access, sign photo, hours, product list, **bûches yes/no by Nov 1**, prices, portions, lead times, budget | Owner's answers in chat or a file |
| Y3 | **VPS facts**: provider, data-centre city, vCPU/RAM/disk, OS, who has root | Loi 25 (a Québec data centre avoids the s. 17 assessment for the database); sizing ≥ 4 vCPU / 8 GB / 75 GB | Text. If you have no VPS yet: buy one in Québec (OVH Beauharnois, picked explicitly), research/17 §7 |
| Y4 | **Domain**: is `cocovanillegranby.com` registered? Registrar, registrant (should be the bakery), DNS access | DNS for apex, admin, staging, email, Search Console | Text; DNS access in week 1 |
| Y5 | **Who runs the Monday phone check from Granby** (search the prompts on a phone in the shop) | WebSearch here is US-located; the real local baseline needs a phone in Granby | A name |

### 3.2 Week 1 (Nov 2–8)

| # | What | Why | Format |
|---|---|---|---|
| Y6 | **Google**: the bakery's own Google account; you added as manager of the Business Profile; Search Console Domain property (DNS TXT); GA4 property | Listing fixes, indexing, measurement | Invitations to your account |
| Y7 | **Bing Webmaster Tools + Bing Places; Apple Business** (claim the place) | Bing ≈ 10 % of Canadian search, iOS ≈ 65 % of Canadian mobile (06) | Invitations / access |
| Y8 | **Facebook Page admin + Instagram professional account** (confirm the handle) | NAP alignment, `sameAs`, posts | Access |
| Y9 | **Mailbox on the domain** (Google Workspace ≈ C$9.20/month or Microsoft 365): `bonjour@` or `commandes@cocovanillegranby.com` | Google Business Profile API application needs a domain email; customer contact | Provider choice |
| Y10 | **GitHub Actions secrets**: `VPS_HOST`, `VPS_USER` (a `deploy` user I script), `VPS_SSH_KEY` (a deploy-only key) | Automated deploys from CI | Add in GitHub → Settings → Secrets (I send the exact list in W1) |
| Y11 | **Run the VPS hardening script once** (I write it: SSH keys only, firewall, updates, Docker, nginx, certbot) — or give the deploy user sudo for the first run | Day-0 security | 15 min over SSH |
| Y12 | **Photos you already have**: storefront sign, interior, products, logo files (SVG/PNG) | NAP spelling (the sign decides), holding page, Google profile | Upload to the repo or a shared folder |
| Y13 | Optional: **allow these hosts in this cloud environment's network settings**: `cocovanillegranby.com`, `*.cocovanillegranby.com`, your VPS IP | Lets me run live checks (status, crawler access, page speed) from here instead of only from GitHub Actions | Environment settings → Network access → Allowed domains |

### 3.3 Week 2 (Nov 9–15)

| # | What | Why |
|---|---|---|
| Y14 | From the owner: **allergen list per product + cross-contact practice + MAPAQ permit**; POS name; « tu » or « vous »; « cueillette » or « ramassage »; « acompte » or « dépôt » | Product pages, legal guards, copy |
| Y15 | **Person in charge of personal information** (Loi 25), name and title, published on the site | Legal (07) |
| Y16 | **Photo shoot booked** (half day, a photographer or the owner's phone with my shot list) | Real photos only; hero image ≤ 200 KB AVIF |

### 3.4 Weeks 3–6 (Nov 16 – Dec 13)

| # | What | Why |
|---|---|---|
| Y17 | **Review staging** 2 × 30 min a week (you), copy and prices approved by the owner | No page goes live without approval |
| Y18 | **Final holiday hours** by Nov 30 (live everywhere by Dec 1) | Google, Apple, Bing, Facebook, site |
| Y19 | **Lawyer** engaged by W3, sign-off by W10: privacy policy, conditions of sale (deposits, cancellation, perishables, pre-orders) | LPC, Loi 25, Loi 96 (07) |
| Y20 | **Accountant** by W6: GST/QST class per product (bakery tax rules are product-specific, 07 §6) | Checkout tax lines |
| Y21 | **Native English reviewer** (Spanish only if the ES scope is confirmed) | No machine-only translation |
| Y22 | **Ordering spec inputs** by W6: payment processor account **opened by the bakery** (Stripe, or Square if the POS is Square), deposit %, refund and no-show policy, capacity per day per category, pickup windows, next-day cut-off | G6 spec freeze |

### 3.5 Weeks 6–10 (Dec 7 – Jan 10)

| # | What | Why |
|---|---|---|
| Y23 | **Twilio account** (bakery-owned) + toll-free number verification — start in W6, it takes time | Pickup-ready texts |
| Y24 | **AWS account for Amazon SES ca-central-1** (or Postmark) | Order confirmations; never sent from the VPS |
| Y25 | **Staff list + devices** (iPhone/Android, shared tablet?), printer decision | Studio roles, PINs, printing |
| Y26 | **Owner test in the shop** (45 min, W10) | G10: 5 of 5 tasks without help |

### 3.6 From launch (W11 →)

| # | What | Time |
|---|---|---|
| Y27 | Owner and staff install the Studio app on their phones/tablet; 10-min onboarding | Once |
| Y28 | Owner: Studio ≤ 10 min per open day; reply to reviews within 24 h | Daily |
| Y29 | You: Monday 1 h scoreboard, Tue–Wed one page, Thu off-site, Fri gates (plan-v1 §9) | ≈ 6 h a week |

### 3.7 Optional, from W7 (measurement tools)

| Item | Cost | Why |
|---|---|---|
| SerpApi key (Granby-located results) | ≈ US$25/month | Weekly 30-prompt Google runs |
| AI API keys: OpenAI, Perplexity, Gemini, Anthropic | Pay per use (≈ 540 calls a week, price [[FACT NEEDED]]) | Weekly AI-citation runs |

### 3.8 Money

| Line | Amount (est.) | Source |
|---|---|---|
| Fixed monthly (VPS, backups, domains, mailbox, DNS, email, SMS volume) | ≈ C$27–65 | 00 §11 |
| Card fees | ≈ 3.4–3.6 % of online sales | 10 §1.1 |
| Tools | US$0 → ≈ US$25 | 12 D7 |
| One-offs: photographer, lawyer, accountant, EN reviewer | [[FACT NEEDED]] | 12 §5.3 |
| Owner's monthly ceiling | [[FACT NEEDED]] | 14 M1 |

---

## 4. What Claude Code can't do (stays with you)

- Create accounts or verify identity (Google, Stripe/Square KYC, Twilio verification, Apple, Meta).
- Reach your VPS, Instagram, Facebook or Google Maps from this session (network policy), unless you allow the hosts (Y13).
- Phone checks from Granby, photos, the shoot, talking to the owner, lawyer and accountant.
- Send pitches or review requests from a real mailbox; sign contracts.
- Promise rankings: the plan measures "first" weekly on the 30 prompts (plan-v1 §1 as corrected in 12 §4).

---

## 5. Next step

1. You: Y1 (session 1 codes) and Y2 (send the owner message), today.
2. Claude: on your answers, write `research/sessions/01-admin-review.md`, draw the Studio mockups, then run session 2 (owner facts) as soon as the owner replies.
3. W1 build starts only after **G0** passes.
