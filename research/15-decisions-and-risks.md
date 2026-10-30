# 15 · Decision log and risk register (2026-10-25)

> Track: every open choice, with options, a recommendation, the reason and the evidence; then the risks. Stage: plan only, no code.
> Method: **0 web searches.** Every fact comes from a research file and keeps that file's label (UNVERIFIED, UNVERIFIED (FC), (est.), [[FACT NEEDED]]). Owner questions are cited with the file number (« 14 S1 », « 14 T1 »…), because 12 (A1–G9, M1–M25), this file (D1–D25, R1–R34), the prompts (L1–L10) and 06 (self-tests T1–T5) reuse the same letters.
> Precedence: (1) files with a verification pass (01, 06, 07, 08, 16b, 17 "Verification log"; 02, 04 "Evidence pass"; 18 "Completion pass") win over unverified ones; (2) research wins over the owner plans (12 lists the conflicts); (3) 12 §3 merged decisions are binding until the owner overrules one in writing. Each decision says which plan line it corrects.
> Terms: **Owner** = the bakery's owner; **Operator** = Yahya (Agence, 16 §1.1); **Counsel** = the lawyer; **Accountant**.
> One-Man Empire rule applied to every choice: one operator, one box, one codebase, one facts file; buy what is regulated (payments, SMS, email); automate only what is repeatable; defer what only an agency team could run.

---

## 0. Decisions in one screen

| # | Choice | Recommendation | Decider | Due |
|---|---|---|---|---|
| D1 | Official name | The name on the sign; draft « Pâtisserie Coco Vanille »; the other spelling only in `alternateName` | Owner (14 S3) | Week 0 |
| D2 | Language at `/`, slug set | French at `/`, `/en/`, `/es/`; no automatic redirect; slugs: the 04 §2 page tree (built on plan-v1 slugs, e.g. `/gateaux-personnalises-granby/`, `/commander/`, `/viennoiseries/`, `/pains-baguettes/`, `/nous-trouver/`, `/prix/`) plus `/carte/` (12 E1; not in 04), with the 00 §5.1 overrides: `/allergenes/` replaces `/sans-gluten-allergies/` (12 B2; 07 A-6); cart and resume at `/boite/` and `/boite/<token>/` (`/en/box/`, `/es/caja/`); `/commander/paiement/` noindex; products at `/<category>/<product>/` (design choice); no `/studio/` on the public host (M7) | Settled (law + 12); operator | Week 2 |
| D3 | Spanish scope | No ES pages unless a Spanish speaker is named; then 3–5 pages | Owner (14 L2) | Week 0 answer; build week 5 |
| D4 | WhatsApp | None at launch | Settled (12 M11) | — |
| D5 | Stack | 16b Option B (Payload 3 data layer + custom Studio UI + Payload admin as « Avancé »), after a half-day plain-JS spike | Operator; owner if the spike fails | Week 1 |
| D6 | Postgres | On the VPS, private network; encrypted backups in Québec at a second provider; monthly restore test | Operator | Weeks 1–2 |
| D7 | VPS provider / location | Keep the owner's VPS if it is in Québec and ≥ 4 vCPU / 8 GB / 75 GB; otherwise a Québec data centre | Owner (14 T1) + operator | Week 0 |
| D8 | CDN | None at launch; revisit on 3 measured triggers | Operator | On trigger |
| D9 | POS integration depth | Integrate only if the POS is Square; otherwise Stripe + Studio + printer, no POS push in v1 | Owner (14 O1) → operator | Fact by week 2; spec week 6 |
| D10 | Cake builder | Request → quote → deposit link first; a 2D layered-SVG builder about 3 months later; no 3D | Settled (12 M24); operator | After launch |
| D11 | Delivery | Pickup only at launch | Owner (14 O3) may open it later | Week 6 |
| D12 | Deposit policy | Separate deposit charge now, balance later; full payment for holiday pre-orders; no card holds | Owner (amounts) + counsel (refunds) | Week 6 |
| D13 | Printing path | Through the POS if it prints online orders; otherwise Star CloudPRNT; always a PDF | Operator after 14 O1, 14 D4 | Week 6 |
| D14 | Merchant Center | After ordering is live; test with 5 products | Operator | Weeks 11–12 at the earliest |
| D15 | Content-Signal, llms.txt | Both optional, never a gate; llms.txt after launch | Owner (training choice, 14 T9) | After launch |
| D16 | Dashboard | Studio-native « Cette semaine » (5 numbers, ≤ 3 action cards; Presence Health Score: see D24) + Monday email; Data Studio deferred | Settled (12 §5.1; 16 §0) | Studio MVP |
| D17 | TikTok | Not at launch (capacity, not law) | Settled (12 M12) | No date in the files |
| D18 | Ads-ready signal layer | Defer pixels, CAPI, server GTM, BigQuery; store UTM (+ consent-gated `gclid`) and language on orders now; Consent Mode basic | Settled (12 F7, M19); owner decides ads later | Data model, week 2 |
| D19 | Category sentence | Option B by default; A only above the owner's revenue threshold | Owner (14 S5) | Week 0 |
| D20 | Noël 2026 bridge | GBP + Facebook + phone + request form + payment link, only if bûches are confirmed | Owner (14 P3) | 2026-11-01 |
| D21 | Vocabulary | One word each: cueillette/ramassage, acompte/dépôt, tu/vous, tú/usted | Owner (14 L3) | Week 6 (wanted for the admin session) |
| D22 | AI-drafted review replies | Optional; names stripped; a human approves; ÉFVP first | Owner (14 D5) + counsel | Before Studio MVP |
| D23 | Design direction | A « Atelier Vanille » / B « Coco Joyeux » / C « Maison des Cantons » (v0c §7; 08 §6 evidence: A base + B accents + C as a content layer). Not judged yet (later topic, 00 §15 #4); judge against the owner's Instagram (handle unconfirmed, 14 T4) and logo (14 B1) | Owner | Design session |
| D24 | Studio daily screens + Presence Health Score | 12 M18 (binding: 5 screens) and 12 G9 (drop the score) vs 16 §0, §4.6 (6 screens; score after 4 baselines). Recommendation: the 00 §8 proposal (6 screens; score in v1.1 only, never in place of the three scoreboards); M18 binds until the owner confirms in session 1 | Owner | Session 1 |
| D25 | Online vitrine reservations | Yes/no (02 P7; 00 §7; backlog ORD-10); if yes, full payment at order (D12) | Owner (14 P14) | Week 6 spec freeze |
| D26 | Site hours (2026-10-27) | Decided: the site publishes the Google listing hours relayed by Yahya (Mon–Tue closed, Wed–Sat 8:30–17:30, Sun 9:30–17:00) as the single hours record; owner sign-off welcome (14 H1) | Yahya (owner to confirm) | Done 2026-10-27 |
| D27 | Direct chat « Écrivez-nous » (2026-10-27) | Decided: first-party chat (own database, answered from Studio › Messages during opening hours, instant answers from published facts, optional contact for a reply by text/email, deleted 90 days after the last message, never on payment pages, no third-party script). M11 (no WhatsApp) stands; Meta's Messenger chat plugin and Google Business Profile chat no longer exist (2024). Can be paused in Studio | Yahya | Done 2026-10-27 (sessions/04 #10) |
| D28 | Design direction (closes D23) | Decided: « Vanille & Cacao », the new round logo's palette on the Atelier Vanille base; two font files kept (sessions/04) | Yahya | Done 2026-10-27 |

---

## 1. Decision log

### D1 · Official name
- **Options:** « Pâtisserie Coco Vanille » (registry minus « inc. », Facebook, Tripadvisor, press, Marché public) · « Pâtisserie Cocovanille » (Google Maps and the directories that mirror it).
- **Recommendation:** the storefront sign decides (14 S3). Draft until then: « Pâtisserie Coco Vanille ». Schema `name` = the sign; `legalName` = « Pâtisserie Coco Vanille inc. » (legal pages and schema only); `alternateName` = the other spelling only. Rename the GBP only to match the sign.
- **Reason:** one name everywhere is the entity rule; both AI-proxy mentions used "Cocovanille", so track it as a variant. Whether a GBP name edit triggers re-verification is UNVERIFIED (12 §7 #1).
- **Evidence:** 01 §2, §2.3, §8; 05 §0.2; 11 §1; 12 A2; requirements.
- **Corrects:** v0c entity block (`alternateName` "Coco Vanille Granby" puts a city in a name field: drop it, 12 A2). Also `data/facts.json` lists "Patisserie Coco Vanille Inc" in `alternateName`, wider than 12 A2's "other spelling only": fix it in the entity topic.

### D2 · Default language at `/` and the slug set
- **Options:** French at `/` with `/en/` and `/es/` · redirect by browser language or IP · FR and EN as equals.
- **Recommendation:** `lang="fr-CA"` at `/`; `/en/` (en-CA) and `/es/`. No automatic redirect; a dismissible language suggestion only. Language switcher links to the equivalent page. hreflang `fr`/`en`/`es` for the equivalents that exist + `x-default` → FR; FR-only legal pages leave the set. Slugs: the 04 §2 page tree (built on plan-v1 slugs, e.g. `/gateaux-personnalises-granby/`, `/commander/`, `/viennoiseries/`, `/pains-baguettes/`, `/nous-trouver/`, `/prix/`) plus `/carte/` (12 E1; not in 04), with the 00 §5.1 overrides: `/allergenes/` replaces `/sans-gluten-allergies/` (12 B2; 07 A-6); cart and resume at `/boite/` and `/boite/<token>/` (`/en/box/`, `/es/caja/`); `/commander/paiement/` noindex; products at `/<category>/<product>/` (design choice); no `/studio/` on the public host (M7). Birthday stays inside the pillar unless the overlap test (< 6 shared top-10 results) says otherwise. Apex canonical, `www` → 301, one trailing-slash policy.
- **Reason:** Charter s. 52: EN/ES allowed only if French is at least as accessible and as good; the OQLF has fined less-accessible French sites (07 F1–F4). A `.com` has no country signal, so language, content, hreflang and the GBP carry location (06 §3 #4).
- **Evidence:** 07 §0.2, S1–S3; 12 M9, C9, C10, E1; 04 §2; 17 §10.2.
- **Corrects:** v1 §13 audit rule "hreflang trio (fr/en/es)" → the reciprocal set that exists (12 C9). v0b/v0c slugs `/gateaux-personnalises/`, `/gateaux-de-fete/` → superseded (04 §2). v1 / 04 P12 `/sans-gluten-allergies/` → `/allergenes/` (12 B2). Open: « cueillette » vs « ramassage » (D21) touches copy and slugs.

### D3 · Spanish scope
- **Options:** v0b ~15–20 ES pages (wedding, quinceañera, macarons…) · v1 "core Spanish pages" in weeks 3–6 · 3–5 pages if someone answers in Spanish · none.
- **Recommendation:** none at launch unless the owner names a Spanish speaker (14 L2). Then 3–5 natively written pages taken from the 04 §2 ES column (e.g. `/es/`, `/es/pedidos/`, `/es/pasteles-personalizados-granby/`). « Hablamos español » only if staff speak it; otherwise « Pedidos en línea en español ». Quinceañera only if offered. ES H1s pair « pasteles y tortas »; never « torta » alone for Mexican readers.
- **Reason:** ~1 % scale (965 Spanish mother-tongue = 1.3 %, Granby CA, 2011; 535 Colombian-born, 2021, press). ES answers are uncontested but low-volume, and easy ES wins would inflate the "first" count, so the FR subset must pass alone.
- **Evidence:** 01 §9.3–9.4; 04 §0.8; 05 §0.8; 12 M10, B4, G4; v0b A1 (its own add-a-language rule).
- **Corrects:** v0b A1 ("sizeable community… first-place rankings come fast", 15–20 pages) and v1 §3 weeks 3–6 ("core Spanish pages").

### D4 · WhatsApp
- **Options:** on ES pages (v1) · 3 languages + click-to-WhatsApp ads + Monday report (v0a) · none.
- **Recommendation:** none at launch. ES pages use the same order form and phone; the Monday summary goes by email (16 §9 #19).
- **Reason:** Spanish service is unknown; WhatsApp Cloud API is paid per message (v0a §7.2); Meta becomes another processor outside Québec, so another ÉFVP (inference, 12 C11; 07 §0.5).
- **Evidence:** 12 M11, C11; 16 §9 #19.
- **Corrects:** v1 §7, §13; v0a §5.1, §5.4, §6.4, §4.6.

### D5 · Stack: Option B from 16b
- **Options (16b §1):** A Payload admin only · **B** Payload data layer + custom task-first Studio UI + Payload admin as « Avancé » · C React Admin/Refine SPA · D Directus · E Strapi 5 · F Medusa · G Sanity.
- **Recommendation:** B. One repo, one Next.js + Payload build, run as two Node processes (public, studio) + one jobs worker behind nginx. Studio at the root of `admin.cocovanillegranby.com`, Payload admin at `/admin`. **First build task: a half-day plain-JavaScript spike** (create-payload-app → `.js` config and collections → build → jobs worker). If it fails, the owner chooses: JS everywhere except config files, or another CMS. Pin versions from `npm view` at install (Payload 3.92.x, Next 16.4.x, Node minimum: all UNVERIFIED (FC)).
- **Reason:** staff jobs need one-tap screens, offline tolerance and a live order feed; Payload's admin is a list → edit → save CMS. Payload supplies roles, fr/en/es localisation, drafts, versions, scheduling and jobs. Sanity's Content Lake can't be self-hosted. Effort ≈ 4–6 weeks on top of the Payload model (est.).
- **Evidence:** 16b §0–§1, verification log #1–7; 12 M5, C5, D5; 16 §7.
- **Corrects:** v0b A3, v0c §8 Path A, v0a §2.1 (Astro + Sanity/Supabase + Vercel/Cloudflare).

### D6 · Postgres on the VPS vs managed
- **Options:** Postgres container on the VPS (17) · managed Montréal Postgres ("stays an option", 16b §7) · Supabase/RDS ca-central-1 (v0a §2.1).
- **Recommendation:** on the VPS, on a private Docker network, never published. Nightly `pg_dump` + WAL archiving once ordering is live, encrypted with `age`, sent to object storage in Québec at a **different provider**; monthly automated restore test; a logged restore test before the first form collects data. Managed Postgres only if restore tests fail or operations exceed the operator's time budget (≈ 30 min/week + 1 h/month, est.) (design choice).
- **Reason:** owner requirement (own VPS); keeps the largest personal-data store out of Loi 25 s. 17 if the VPS is in Québec; bakery data stays well under 1 GB in year one (est.); fewest vendors.
- **Evidence:** 17 §0, §1, §1.2, §7.2, §8.4, §11; 16b §7; 07 §2; 12 E7.
- **Corrects:** v0a §2.1 (Supabase/RDS + S3 media) → VPS (17 §13; 12 M6).

### D7 · VPS provider and location
- **Options:** OVHcloud Beauharnois (BHS, QC) · AWS ca-central-1 / Lightsail (Montréal [[VERIFY]]) · Montréal hosts (all UNVERIFIED) · Toronto hosts (DigitalOcean TOR1, Vultr, Linode, OVH's Cambridge ON site): outside Québec · Hetzner: no Canadian location (UNVERIFIED).
- **Recommendation:** decision tree of 17 §7.3. In Québec and ≥ 4 vCPU / 8 GB / ≥ 75 GB NVMe → keep. In Québec but smaller → upgrade, or move staging. Ontario → workable with an ÉFVP + written agreement; moving pre-launch is cheap. Outside Canada → move before launch. At OVH: pick **BHS explicitly**, choose **by specs, not plan name** (VPS-1/VPS-2 mapping contested), confirm price and currency at checkout (a +55 % rise on 2026-04-01 is reported). Measure latency from the shop before choosing (17 §6.4).
- **Reason:** Loi 25 s. 17 (other provinces count as outside Québec on a literal reading); short network path to Granby.
- **Evidence:** 17 §0, §6.4, §7.1–7.3, verification log #1–4; 07 P4, §2; requirements.
- **Status:** [[FACT NEEDED: provider + data-centre city]] (14 T1).

### D8 · CDN now or later
- **Options:** none · Cloudflare Free (proxied) · Bunny pull zone for static files only.
- **Recommendation:** none at launch; DNS-only (Cloudflare DNS grey cloud, or the registrar if it offers DNSSEC + CAA + API). Revisit on any one trigger: p75 TTFB > 0.8 s after cache fixes (threshold UNVERIFIED this session), sustained attack traffic, bandwidth near the plan limit. Then a Bunny zone on `cdn.` for `/_next/static` and `/media` first; Cloudflare only for DDoS, public host only, with AI Crawl Control Allow/Allow/Allow, managed robots.txt off, Bot Fight Mode off.
- **Reason:** Cloudflare defaults can block AI crawlers and insert `ai-train=no`; mixed-use crawlers get the strictest category; edge hits never reach our logs; TLS ending at a US company adds a Loi 25 processor. Customers are ~80 km from a Québec origin.
- **Evidence:** 17 §6.1–6.3; 06 (i), §3 #6.
- **Corrects:** v0c §8 / v1 §5, §11, §17 (Vercel or Cloudflare hosting, Vercel log drain, "host firewall") → VPS + nginx (17 §13; 18 §3).

### D9 · POS integration depth
- **Options:** Square → Web Payments SDK + Orders API (PICKUP) into Square's Order Manager · Clover / Lightspeed / Moneris / other → Stripe, orders in Studio + printer · Shopify POS → reopen buy option C · no POS → Stripe + Studio + printer.
- **Recommendation:** integrate only if the POS is Square (no Orders API fee with Square payments; 1 % with another processor, country not stated). Otherwise no POS push in v1. Payload is the catalogue master for web content; with Square, each variant stores its Square ID and a nightly job flags price drift. Never mix processors.
- **Reason:** Square was the only POS found with self-serve Orders (PICKUP), Catalog and Inventory APIs; Lightspeed K is partner-gated (third-party); Clover needs an app. Mixing processors means two payouts and two reconciliations.
- **Evidence:** 10 §0, §1.3, §13; 16b §5; 16a §12 #2; 12 E10.
- **Corrects:** v0a §6.1 ("POS keeps orders; Studio manages presence") → our engine is the web-order system of record (12 C18, M18).

### D10 · Cake builder: 2D vs 3D
- **Options:** 2D/2.5D layered SVG · 3D WebGL (three.js / glTF) · no builder (structured request flow).
- **Recommendation:** launch with the request flow (photos, guests, date) → price → deposit link, with a written recap and reference photo. After about 3 months of real request data, a **2D layered-SVG** builder labelled « aperçu indicatif »; steps under `/createur/` with `noindex`, crawlable, out of the sitemap. No 3D.
- **Reason:** volume and price grid unknown; 2D ≈ 2–3 weeks vs 3D ≈ 6+ weeks (est.); WebGL in the Instagram webview untested (UNVERIFIED); 3D can over-promise finishes. No live bakery configurator was found, so "differentiator" is likely but UNVERIFIED. The documented complaint (a cake made wrong) is fixed by the recap, not by a builder.
- **Evidence:** 10 §5.1–5.2; 12 B6, M24; 08 §0.1; 01 §6; 16a move 5.
- **Corrects:** v0c §6 ("10-step builder, the killer feature") and v1 §3 weeks 13–18.

### D11 · Delivery yes/no
- **Options:** pickup only · own delivery with zones · delivery apps.
- **Recommendation:** pickup only at launch, said plainly in the FAQ and on `/commander/` (« Cueillette en boutique seulement », word per D21). No `areaServed` in schema until delivery is real. If the owner opens it later: zones from the verified geo point with a routing API (never calculator figures); the delivery fee's tax status goes to the accountant.
- **Reason:** no delivery evidence; tax rows 7–13 unsigned (07 launch rule: pickup only, no delivery fee, no café items online until signed); widening to Bromont needs real delivery (v1 §1).
- **Evidence:** 01 §5, §9.2; 07 §6, T-5; 12 E3, A4; 06 (r).
- **Corrects:** v0c `areaServed` Bromont/Shefford/Waterloo (12 A4); v1 L19 "pickup and delivery zones".

### D12 · Deposit policy
- **Options:** card hold (authorise now, capture later) · deposit as its own charge + balance later · full payment at order.
- **Recommendation:** custom cakes → a separate deposit charge now, the balance by payment link or at the counter. Display-case reservations and holiday pre-orders → full payment at order, with the conditions saying when payment is taken. **No card holds.** `depositPercent` has **no default** until the owner sets it (14 O4). Refundability, deadline and no-show rule: owner + counsel (lawyer Q7). The bakery never moves a confirmed date alone; refunds within 15 days of a valid cancellation (Studio timer, red at day 10). Copy: « Acompte : 40,00 $ aujourd'hui · Solde : 85,00 $ au ramassage » (amounts are placeholders).
- **Reason:** Stripe online holds last about 7 days and Stripe doesn't support longer; custom cakes are booked weeks ahead. Splitting costs one extra fixed fee (C$3.50 vs C$3.20 on C$100, computed). The 20–30 % deposit figures found are US/global forum figures, not Québec, so not a default. Tax timing on deposits: accountant (07 §6 row 13).
- **Evidence:** 10 §1.2; 07 O7, O8, O14, C-5, C-6, §6, §8 (lawyer Q7–Q8, accountant Q4); 16 G11, G12.

### D13 · Printing path
- **Options:** through the POS · Star CloudPRNT (the printer polls our server; model support UNVERIFIED (FC)) · Epson ePOS SDK (only if an Epson TM exists; iPadOS to test) · WebUSB / Web Serial / Web Bluetooth (not in Safari) · PDF.
- **Recommendation:** the POS first if it already prints online orders; otherwise CloudPRNT for new hardware; always a PDF fallback. Production sheet: A4 + 80 mm, a versioned snapshot at cut-off + 5 min. Box labels (62 mm; Brother QL family as candidates) move to v1.1, after CFIA/MAPAQ say which items need labels (14 A6) and a test print from iPad Safari.
- **Reason:** CloudPRNT is device-independent and survives a device change; WebKit doesn't support WebUSB/Serial/Bluetooth.
- **Evidence:** 16b §3; 16 §7, §8.1; 10 §7; 16a §3.6; 07 A-4.

### D14 · Merchant Center timing
- **Options:** with the content site · with ordering (v1 weeks 11–12) · later.
- **Recommendation:** after ordering is live. A local product feed from Studio: daily items as **pickup today**, made-to-order cakes as **pickup later**; start with 5 products to learn whether food is approved (no perishables rule found). Availability from one state: `in_stock` / `out_of_stock` / `backorder` (returning seasonal, with a visible date) / `preorder` (never-sold only).
- **Reason:** free local listings in Canada need a physical store and a published Business Profile location, not an online checkout. `google_product_category` "Food Items > Bakery > Cakes & Dessert Bars" is UNVERIFIED.
- **Evidence:** 06 (q), (k), §3 #19; 10 §8; 12 M21.
- **Corrects:** v0a §4.4, §5 and v1 L19 ("seasonal products show as pre-order") → `backorder` + date (12 C20).

### D15 · Content-Signal and llms.txt
- **Options:** Content-Signal line: none / `search=yes, ai-input=yes, ai-train=yes` / with `ai-train=no` · llms.txt: launch gate / optional after launch / never.
- **Recommendation:** robots.txt allows every search and user-fetch crawler; whether to allow AI **training** is the owner's explicit choice (Google-Extended has no Search effect). A Content-Signal line is optional: it states the choice, **expect zero effect** (no major operator has committed to honour it). llms.txt after launch, lowest priority, generated from the same data if it costs nothing. Neither is ever a gate.
- **Reason:** Google staff said no AI system uses llms.txt (2025, secondary quoting Google); no official statement from OpenAI, Anthropic or Perplexity.
- **Evidence:** 06 (i), (j), §2, §3 #5; 12 M16, C16; 17 §6.3.
- **Corrects:** v1 §16 ("plus a Content-Signal line" as a correction) → optional (06 §2); v0a §2.4 launch gate ("llms.txt and JSON feeds live") → after launch. 08 §0.10 ("a cheap GEO move") is overruled by the verified 06 (j): effect unproven.

### D16 · Data Studio dashboard vs Studio-native
- **Options:** Data Studio dashboard (v1 weeks 11–12) · Studio-native « Cette semaine » + Monday email · `weekly.mjs` Markdown by email.
- **Recommendation:** Studio-native « Cette semaine » (5 numbers, ≤ 3 action cards; Presence Health Score: see D24) + the same content by email on Monday. Agency reports as read-only views of the rank-first outputs. Data Studio deferred.
- **Reason:** owner time ≤ 5 min on Monday (16 §1.3); capacity; Loi 25. Truth = order database + calls + GBP actions + nginx logs; GA4 is directional because consent is opt-in (12 G8).
- **Evidence:** 12 §5.1, G8, G9; 16 §0, §4.2, §4.6–4.7, §8.1.
- **Corrects:** v1 §3 weeks 11–12 ("Data Studio dashboard"); v0a §6.2 (home = health score) → home = « Aujourd'hui » (12 M18). Name: "Looker Studio" → "Data Studio" (12 M22), a rename that 18 #3 rates Partly (secondary sources only).

### D17 · TikTok role
- **Options:** pillar at 3–5 posts a week + pixel + Events API + Spark Ads (v0a) · channel pending "regulatory status" (v1) · not at launch.
- **Recommendation:** not at launch. Launch channels: GBP + Facebook + Instagram, one asset in three placements, ≤ 3 posts a week in total. No date to revisit is set in the files.
- **Reason:** capacity, not law. Secondary sources: the Federal Court set the wind-up order aside on 2026-01-21; the 2026-03-09 undertakings are UNVERIFIED (18 completion pass). No TikTok account was found for the shop.
- **Evidence:** 12 M12, C12, F3; 18 #12; 01 §7.
- **Corrects:** v0a §4.7, §5.1 (TikTok pillar); v1 §13, §17 ("TikTok [regulatory status]", stale).

### D18 · Ads-ready signal layer timing
- **Options:** build now on 5 ad platforms (v0a Part 4: pixels, CAPI, Events API, server GTM, BigQuery, offline uploads) · defer all · minimal now.
- **Recommendation:** defer everything ad-specific until ads are decided. Now, only: store UTM fields, language and a consent-gated `gclid` on every order and lead, so ads can start later without rework. Google Consent Mode **basic** (no Google tag before opt-in); `purchase` sent server-side from the payment webhook only when stored consent allows; no tags at all on the payment page.
- **Reason:** Meta/TikTok pixels = US processors + profiling → ÉFVP, "not at launch"; no ads budget; PCI SAQ A eligibility requires no third-party scripts on the payment page. Advanced Consent Mode (cookieless pings while denied) needs a counsel decision.
- **Evidence:** 12 F7, M19, C19; 07 §0.4, §2, S7, lawyer Q1; 10 §0, §1.4, §10; 18 #20.
- **Corrects:** v0a Part 4 ("everything is wired and tested now"; Consent Mode "basic or advanced") and v0a §7.1 (GTM + server GTM + BigQuery + pixels).

### D19 · Category sentence
- **Options:** A « Pâtisserie Coco Vanille est une pâtisserie de gâteaux sur commande pour les anniversaires et les fêtes à Granby. » · B « Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. »
- **Recommendation:** B by default. A only if custom cakes reach the owner's revenue threshold and capacity and lead times are known (14 S5, 14 P4, 14 K1). No weddings in either.
- **Reason:** the evidence shows a pâtisserie-boulangerie with a small café; Cake Design Granby and Avec un Grand A already own custom cakes online; the bread slot opened when Pain-Pain closed (2026-06-16). Cake wedge = « gâteau pour demain » (L3).
- **Evidence:** 01 §11; 03 §0; 04 §0.2–0.3; 12 B1, M15.
- **Corrects:** v1 §6 ("custom cakes for birthdays and weddings"); v0b B0 (adjectives, weddings, « créations à la vanille »).

### D20 · Noël 2026 bridge
- **Recommendation:** only if bûches are confirmed by 2026-11-01 (14 P3): GBP products and posts, a Facebook post, phone + the request form, deposit by payment link. Optional: the evergreen `/buches-de-noel/` URL on the holding page, so it has history for 2027 (hypothesis). Gift cards in store only, if offered (12 E4).
- **Reason:** the content site goes live in weeks 3–6, after pre-orders open; the ordering engine only in weeks 11–12. Dec 2027 is the first holiday season the site can compete for.
- **Evidence:** 04 §0.6; 05 §0.9; 10 §13 (option D); 12 B5, E4.
- **Corrects:** v1 (no Noël 2026 plan, 12 B5).

### D21 · Vocabulary
- **Recommendation:** the owner picks one word per pair; the operator checks it against the OQLF Grand dictionnaire terminologique; the word then applies to the site, Studio, emails, SMS and the GBP. Pairs: « cueillette » / « ramassage »; « acompte » / « dépôt »; « tu » / « vous » (07 copy uses « vous »); ES « tú » / « usted ».
- **Evidence:** 04 §0.11, §3.2 rule 7; 12 C22; 16 header, §9 #6–7; 10 §6.

### D22 · AI-drafted review replies
- **Recommendation:** optional, owner's choice (question 14 D5). If yes: Claude API drafts with names and phones stripped before the call, a human approves every reply, signed « — L'équipe Coco Vanille », no order details in public. An ÉFVP comes first (the API is in the US). AI never publishes.
- **Evidence:** 07 §2, A10; 16 G7, G9, §9 #14; 16b §5; 11 §4.5.

### D23 · Design direction
- **Options:** A « Atelier Vanille » (Parisian editorial minimal) · B « Coco Joyeux » (playful) · C « Maison des Cantons » (warm, local) (v0c §7).
- **Recommendation:** not judged yet: a later topic (00 §15 #4). Judge against the owner's Instagram (handle unconfirmed, 14 T4) and logo (14 B1).
- **Reason:** 08 §6 evidence points to A as the base, B as accents and C as a content layer, not a skin; trend evidence is opinion, so brand fit and the owner's Instagram decide (08 §5).
- **Evidence:** v0c §7; 08 §5, §6; 00 §9.
- **Decider · Due:** Owner · design session.

### D24 · Studio daily screens + Presence Health Score
- **Options:** 12 M18 (binding: 5 screens) and 12 G9 (drop the score) · 16 §0, §4.6 (6 screens: Commandes and Demandes split, Vitrine added; score shown only after 4 weekly baselines with a « Mesure partielle » label).
- **Recommendation:** the 00 §8 proposal: 6 screens; the score in v1.1 only, never in place of the three scoreboards. M18 binds until the owner confirms in session 1.
- **Reason:** 16 covers the same jobs as M18 in more detail; 12 G9: arbitrary weights hide what moved.
- **Evidence:** 12 §3 M18, G9; 16 §0, §4.6; 00 §8.
- **Decider · Due:** Owner · session 1.

### D25 · Online vitrine reservations
- **Options:** yes (reserve today's display-case items for a window today or tomorrow) · no (the vitrine stays walk-in only).
- **Recommendation:** owner's choice (14 P14). If yes: full payment at order (D12); stock from `DailyStock.planned` minus reservations (10 §2); ships at MVP-O.
- **Evidence:** 02 P7; 00 §7; 10 §2; backlog ORD-10 (gate « owner yes »).
- **Decider · Due:** Owner · week 6 spec freeze.

---

## 2. Already settled (12 §3; binding until the owner overrules in writing)

| # | Decision | Owner-plan line it replaces |
|---|---|---|
| M1 | Review replies within 24 h, closed days included, in the reviewer's language | 48 h (v0a, v0b, v0c) |
| M2 | Shop-level review count in Studio only; no per-staff counts, no leaderboard | Kitchen board (v0b B3) |
| M3 | Open-ended request: « Merci d'avoir choisi Coco Vanille ! Si vous avez deux minutes, votre avis sur Google nous aide beaucoup : [lien] » | Product/attribute prompts (v0a, v0b) |
| M4 | Attributes come from review mining, in our own copy only | "Seed the 3 attributes everywhere" (v0a, v0b) |
| M7 | Studio at `admin.cocovanillegranby.com` (`/`), Payload at `/admin`; `noindex` on every admin response; the public host 404s `/admin`, `/studio`, `/api` | `/studio` path (v0a, v1) |
| M8 | `https://cocovanillegranby.com/` apex canonical, `www` → 301, defensive `.ca` | VOTREDOMAINE.ca |
| M13–M14 | 30 fixed prompts + B1–B3, weekly, 5 engines; amended definition of "first" (3 runs, ≥ 2 of 3; FR subset must pass alone) | Four prompt panels; three definitions of done |
| M17 | FAQ in server HTML (`<details>`); FAQPage markup optional, never a gate (FAQ rich results gone since 2026-05-07) | FAQ markup as a gate (v0a) |
| M18 | Studio home = « Aujourd'hui »; presence work as agency reports | Health-score home (v0a §6.2) |
| M20 | Interim request form + payment-link deposits in weeks 3–6; ordering engine live weeks 11–12 = 2027-01-11 → 01-24 | Weeks 3–8 / days 15–45 / weeks 7–12 / weeks 12–14 |
| M21 | `preorder` only for never-released items; returning seasonal = `backorder`, with a date | PreOrder for seasonal (v0a, v1) |
| M23 | Review channel: QR card in every box + link on the paper receipt; email only with a ticked box | SMS/email after pickup (v0b, v0c, v1) |
| M25 | Effective-dated tax classes (QST change of 2026-07-15); the accountant signs every row | v0c §9 tax row |

## 3. Cross-file corrections found while consolidating

| Item | Corrected value | Why |
|---|---|---|
| Hosting cost | ≈ C$25–55/month (est.) | 17's verification log corrected its own C$35–55 by arithmetic; 10 §12 and 12 §5.3 still carry the old C$35–55 basis |
| Zoo de Granby 2025 visitors (">665,000") | UNVERIFIED; not for copy | 01's verification log could not reproduce it; 11 §3 still cites "~665k (secondary)" |
| TikTok 2026-03-09 undertakings | UNVERIFIED | 12 C12 states it from secondary sources; 18's completion pass keeps it UNVERIFIED |
| "Data Studio" rename | Use the name; rated Partly (secondary only) | 18 #3 downgraded it from Confirmed |
| Pickup word in Studio | Open (D21) | 16 uses « cueillette » as a placeholder; 10 and 16b use « ramassage » |

---

## 4. Risk register

Likelihood (L) and impact (I): **H / M / L**, estimates (est.) from the evidence cited. Owner = who carries the mitigation.

| ID | Risk | L | I | Mitigation | Owner | Evidence |
|---|---|---|---|---|---|---|
| R1 | The shop is not trading, or the GBP shows "temporarily closed" | M | H | Week-0 go/no-go (14 S1, 14 S2); no build before it passes | Owner | 01 §0.2, §4; 12 A1 |
| R2 | Wrong hours keep spreading through directories and AI answers (already observed) | H | H | Owner-confirmed hours on the GBP in week 0, then Facebook, RestoMontreal, Three Best Rated, Yellow Pages, MapQuest, Wanderlog; monthly listing diff | Owner (hours) · Operator (sweep) | 05 §0.3; 01 §3; 11 §1; 12 A3 |
| R3 | Entity confusion: split name; choco.vanille (Granby, custom cakes); Mancera perfume; closed Réunion bakery | H | M | One name (D1); `legalName` + NEQ identifier, `sameAs`; brand text always with "Granby"; brand prompts run both spellings | Operator | 01 §8; 04 §0.7; 12 A2 |
| R4 | Scope sized for 4–4.5 FTE, run by one operator | H | H | 12 §5 cut list; one build track at a time; Studio v1 = the D24 screen set + 1 weekly; ≤ 3 posts a week; 1 page a week after launch | Operator | 12 F1–F4, §5; 16 §0 |
| R5 | Pages and prompts built for products not sold (12 of 30 prompts gated) | H | M | `offer_confirmed` flag per page and prompt; publish guard; swap gated prompts before the week-1 freeze (X1, X2, X7, X3, X12) | Operator · Owner (14 P2) | 12 B3, G3; 04 §0.1 |
| R6 | Allergen error or an unlawful free-from claim | M | H | Human-verified allergen record per product, voided by a recipe change; text scan blocks « sans gluten / végane / sans noix »; allergy notes never in email, SMS or AI; « Appelez-nous avant de commander » | Owner (verifies) · Operator (guards) | 07 A-3–A-8; 12 B2, E2, §5.2; 16 G3, G4, G16 |
| R7 | Loi 25 breach: tracking before consent, PI leaving Québec without an ÉFVP, no incident register. Penalties up to $10M or 2 % of worldwide turnover (AMP), $25M or 4 % (penal) | M | H | Consent Mode basic; no pixels at launch; Québec VPS and backups; ÉFVP per vendor (processor, Twilio, GA4, Claude API, Sentry, mailbox); Confidentialité tab (vendor, incident, request registers); person in charge on the site | Owner (14 A4) · Operator · Counsel | 07 §0.4–0.5, §2, P1–P9, A3 |
| R8 | Charter breach: EN/ES better or more accessible than FR; T&Cs not French-first | L | M | FR at `/`, no auto-redirect; parity guard G1; French-first conditions + express-choice box on EN/ES checkout (counsel) | Operator · Counsel | 07 §0.2–0.3, S1–S3, O3 |
| R9 | Wrong sales tax after the 2026-07-15 QST change (RQ « Précisions » of 2026-08-07 unread) | M | M | Effective-dated classes; no online sale without an accountant-approved class; pickup only, no café items online until rows 7–13 are signed | Accountant · Operator | 07 §0.1, §6; 10 §9; 16 G13 |
| R10 | Price-display breach: fee lines, drip pricing, unsupported "was" prices | L | M | All-in prices; no fee lines; same price for every payment method; price-history guard | Operator | 07 §0.6, O4, A6; 16 G14 |
| R11 | CASL: review requests or seasonal messages sent without consent | M | M | QR card in the box; email only with a ticked box; templates tagged transactional/commercial; sender ID + STOP on every SMS | Operator | 07 §0.9, E-1–E-5, O10; 12 M23; 16 G6, G15 |
| R12 | Google review-policy breach: staff quotas, specific-content requests, gating, incentives | L | H | Open-ended wording (M3); one request per order, to everyone; no per-staff numbers anywhere (G20); refused-tactics clause signed (14 S6) | Owner · Operator | 18 #4a–4b; 12 M2–M3, C2–C3; 16 G6, G20 |
| R13 | A custom cake made wrong again (the one public complaint) | M | H | Written recap + reference photo + approval before production, in the interim form and in Studio; flavour recap on the production sheet | Owner · Operator | 01 §6; 02 §0.2, §0.6; 10 §5.2; 12 E11 |
| R14 | Noël 2026 demand arrives before the site | H | M | D20 bridge, if bûches are confirmed by 2026-11-01 | Owner (14 P3) · Operator | 04 §0.6; 12 B5; 10 §13 |
| R15 | GBP API approval delayed or refused (third-party reports of rejections and month-long waits) | M | L | File in week 6 with the live site + domain mailbox; Studio passes AC15 without the API (manual GBP tasks) | Operator | 12 D4; 16 AC15; 16b §5 |
| R16 | Payload 3 in plain JavaScript doesn't work (docs are TypeScript-first) | M | M | Half-day spike as the first build task; owner fallback decision (D5) | Operator → Owner | 12 D5; 16b §1 |
| R17 | Unpatched or mis-pinned Payload/Next (versions and CVE facts UNVERIFIED (FC)) on a host holding PI | M | H | Pin from `npm view`; check Payload's security advisories; Local API with `user` + `overrideAccess: false`; passkeys, step-up, audit log | Operator | 16b §0, §4, verification log #1–6; 16 §7 |
| R18 | Data loss on a single VPS or a whole provider | L | H | Two encrypted copies off the VPS, one at another provider, all in Québec; monthly automated restore test; logged test before the first form | Operator | 17 §0, §7.4, §8.4; 12 E7 |
| R19 | Crawlers blocked (CDN defaults, rate limits, firewall) | L (no CDN) | H | No CDN at launch; nginx verifies bots and never 429s them; `crawler-access.mjs` after every deploy; 17 §6.3 switches if Cloudflare is ever used | Operator | 17 §6; 06 §3 #5–6 |
| R20 | Admin host indexed or exposed | L | M | `X-Robots-Tag` with nginx `always` on every response; admin robots.txt doesn't block; public host 404s `/admin`, `/studio`, `/api`; host-only cookies | Operator | 16b §2, verification log #21; 16 AC10 |
| R21 | Checkout fails inside the Instagram/Facebook in-app browser (wallets missing; community and vendor reports) | M | M | Card form works without a wallet; server-side cart + resume link to open in Safari; in the test matrix | Operator | 08 §0.5; 10 §4 |
| R22 | PCI scope grows (third-party scripts on the payment page) | L | M | Processor iframes only; no GTM, pixels or chat on `/commander/paiement/`; nonce CSP; script inventory checked in CI | Operator | 10 §1.4 |
| R23 | Kitchen overbooked | M | M | Capacity per category × day; atomic reserve with a 10-min hold; one-tap « Pause des commandes en ligne »; phone orders on the same pools; load test before each season | Owner (14 K1–K2) · Operator | 10 §3, §13 |
| R24 | Review target unrealistic (≥ 3 a week vs ≈ 0.2–0.5 a week historically, est.) | H | L | Target = 2× the trailing 8-week rate, shop-level; QR card from week 1; measure the response rate for 4 weeks first | Operator | 12 F5; 11 §4.6 |
| R25 | Proxy data mistaken for the baseline (US-located WebSearch; 17 of 33 prompts; no AI engine; single runs noisy) | M | M | Monday re-run from a phone in Granby + SERP API set to Granby + 5 AI engines; 3 runs per cell, ≥ 2 of 3 | Operator · 14 D1 person | 05 caveat, §9; 12 G4–G6, §4 |
| R26 | Accounts held by the wrong party (GBP, Instagram, Facebook, domain access unknown) | M | H | The business owns every account; the operator gets manager access; 2FA/passkeys; one registrar, auto-renew, registrar lock | Owner | v0a §4.1, Part 8; 12 §2; 17 §10.1 |
| R27 | No budget ceiling, so spend decisions stall | H | M | 14 M1 in week 0; free tools first; week-7 tool spend only after self-test 16 | Owner | 12 F8, §5.3; 18 #16 |
| R28 | VPS lands outside Québec by mistake (OVH Cambridge ON; contested plan names) | M | M | BHS explicitly; choose by specs; confirm city and price at checkout; Ontario workable with an ÉFVP | Operator · Owner | 17 §7.3, verification log #1–4 |
| R29 | Rivals entrenched on custom cakes (carts, prices) and weddings (Rose Gâteaux) | H | M | Defend « pâtisserie / boulangerie Granby » first (D19); wedge = « gâteau pour demain »; dated price table with $/portion | Operator | 03 §0; 04 §0.2–0.3; 12 B1; 02 §0.4 |
| R30 | Trademark conflict over "COCO VANILLE" (no CIPO search yet) | unknown | M | CIPO search before printing boxes or signage; lawyer Q13 on filing | Operator · Counsel | 07 X-2, §8 |
| R31 | French SMS fall into UCS-2 (2 segments, double cost) | M | L | GSM-7-safe templates; CI test on encoding and segment count | Operator | 10 §6; 16 AC12 |
| R32 | A Costco in Saint-Alphonse-de-Granby (opening targeted 2027, possibly 2028) lowers the price floor | M | L | Keep the dated $/portion table current (artisan 1.3×–3.0× a supermarket portion) | Operator | 03 §0.8; 02 §0.4 |
| R33 | Owner facts never arrive (hours, products, prices) | M | H | Publish guard blocks [[FACT NEEDED]]; holding page; one card per missing fact; no page with a placeholder ships; content site slips week by week (00 §14 #2) | Owner | 01 §12; 02 §10.1; 00 §14 #2 |
| R34 | POS unknown, so the processor is chosen wrong | M | M | Default Stripe + Studio printer; no POS fact by week 6 → spec defaults to Stripe; launch never waits on a POS integration (00 §14 #5) | Owner (14 O1) · Operator | 10 §0; 12 E10; 00 §14 #5 |
| R35 | Unverified review figures or product claims reach the site (pasted strategy, 2026-10-27) | M | M | Strategy claims stay `unverified` in data/facts.json; no rating in copy or schema until read on Google directly, never `aggregateRating`; products only after owner confirmation (14 N4) | Operator | 01 update 2026-10-27 |
| R36 | « Écrivez-nous » messages wait too long (one operator) | M | M | The panel promises opening hours, never minutes; instant answers cover hours, address, cakes, ordering, allergies; Studio to-do card and badge; pause switch in Studio › Messages (D27) | Owner · Operator | sessions/04 #10 |
