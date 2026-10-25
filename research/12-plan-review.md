# 12 · Red-team review of the owner's plans (v1, v0a, v0b, v0c, requirements) — 2026-10-25

> Scope: `plan-v1-ranking-stack.md` (main), `plan-v0a-master-plan.md`, `plan-v0b-multilingual-local-domination.md`, `plan-v0c-site-ux-ordering.md`, `requirements-2026-10-25.md`, checked against research/01–05, 06, 07, 10, 16a, 16b, 17, 18 and the Ranking Stack references.
> Method: mostly reading. **6 WebSearch queries** (cap 6), US-located summaries, used only for decisive checks (operating status, TikTok Canada, Search Console social properties, Payload in plain JavaScript, GBP API access, tool prices). WebFetch/curl blocked: no page opened directly.
> Labels: **UNVERIFIED** = no source, or a secondary source only, flagged as such · **[[FACT NEEDED: …]]** = only the owner can answer · **(est.)** = my own estimate · "via research/0X" = fact carried from that file, not re-searched.
> Severity: **Critical** = the project fails or harms the business if not fixed first · **High** = wrong build, legal/policy exposure or a large waste of time · **Medium** = rework or a misleading metric · **Low** = wording, hygiene.

---

## 0. Verdict in one screen

1. **The plans are strong on method and weak on facts.** v1's measured "first", refused-tactics clause and publish guard are right. But all four plans build for a business the evidence does not show: weddings, macarons, bûches, gluten-free, quinceañera, delivery and corporate boxes have **no public evidence** (via research/01 §5, 04 §0.1).
2. **No plan has a go/no-go on whether the shop is open (Critical).** The newest dated directory data is 2025-08-20, and one listing says "may be temporarily closed" (via research/01 §4). This session found only a mirror of the Google listing (4.9, "40+" reviews, "as of July 2026"): that proves a live listing, not a trading shop.
3. **The beachhead attacks where Coco Vanille is weakest and leaves undefended where it is the incumbent.** Cake Design Granby and Avec un Grand A already own custom cakes online (carts, prices). Coco Vanille is #2 on the *bakery* list, and the #1 there (Pain-Pain) closed on 2026-06-16 (via research/03 §0, 04 §0.2–0.3).
4. **Scope is sized for a 4–4.5 FTE agency, not a one-person operator (Critical).** Together the plans describe ≈ 30 Studio modules, 10 channels (≈ 30+ publishing units a week), 3 languages, 5 ad platforms and a server-side signal layer. The v0a team table alone is 4–4.5 FTE plus copywriter and photo/video.
5. **The plans contradict each other** on reply time, review wording, stack, hosting, Studio location, domain, WhatsApp, TikTok, analytics, the prompt panel and the definition of done. §3 picks one winner for each.
6. **Several claims are stale or unsourced:** ChatGPT Instant Checkout, the 0.664/0.218 correlation, the tax rule, the TikTok "wind-down" and the tool-price date (§1-D). Two v1 items checked out better than research/18 expected: Search Console "platform properties" for social accounts exist (announced 2026-07-07, secondary sources), and the TikTok wind-up order was set aside (2026-01-21, secondary sources).
7. **The 30-prompt set is structurally right but biased.** 12 of 30 prompts depend on unconfirmed products. "Best X" prompts are listicle-intent, and a weekly single run is noisy. §4 gives an amended definition with a JavaScript sketch.
8. **Corrected order (§6):** week 0 = facts and go/no-go; weeks 1–2 = measure, listings, infrastructure, data model; weeks 3–6 = ~12 French core pages (with a menu and an order-request page) + EN essentials. The ordering engine launches **after the holiday rush** (plan weeks 11–12 = 2027-01-11 → 01-24). The Noël 2026 bridge runs on GBP and Facebook.

---

## 1. Issues

Columns: ID · plan file + section · issue · severity · evidence · fix. "→ M#" points to the merged decision in §3.

### A. Operating status, entity and facts

| ID | Plan + section | Issue | Severity | Evidence | Fix |
|---|---|---|---|---|---|
| A1 | v1 §3 weeks 1–2, §17, "Next steps"; v0a §0; v0b "Decisions"; v0c §13 | No plan has a go/no-go on whether the shop is trading in Oct 2026. Every timeline starts building | **Critical** | via research/01 §0.2, §4: newest dated data 2025-08-20; RestoMontreal "may be temporarily closed"; no 2026 post, review or news found. This session: RestoMontreal still mirrors Google 4.9 from 40+ reviews "as of July 2026" (search summary): a live listing, not proof of trading. via research/01 §4: a "temporarily closed" GBP status would suppress map-pack visibility (inference) | **Week-0 gate:** the owner confirms open + GBP status ≠ "temporarily closed" + who holds GBP owner access. No other work starts until this passes |
| A2 | requirements "Identity"; v1 §6–§7 copy, §5 B1–B3; v0c entity block (`alternateName`) | Spelling undecided, yet copy, schema and brand prompts already use "Pâtisserie Coco Vanille" | High | via research/01 §2: Maps + mirrors "Cocovanille"; registry, Facebook, Tripadvisor, press "Coco Vanille". via research/05 §0.2: both answers that named the brand used "Cocovanille" | Storefront-sign photo decides (requirements already say so). Schema `name` = signage; `alternateName` = the other spelling only. Drop "Coco Vanille Granby" from `alternateName` (city in a name field). B1–B3 run both spellings. Rename the GBP only to match the sign (whether a name edit triggers re-verification: UNVERIFIED, search queue) |
| A3 | v1 §4 L5, L8 (NAP in weeks 1–2) | Wrong hours are already repeated by answer engines; the plans schedule NAP as week 1–2 work | High | via research/05 §0.3: the C1 answer says « ouverte du mercredi au dimanche », the older RestoMontreal schedule; via research/01 §3: 6 conflicting schedules | Week 0: owner-confirmed hours on GBP first, then Facebook, RestoMontreal, Three Best Rated, Yellow Pages, MapQuest (name typo), Wanderlog ("Magog") |
| A4 | v0c entity block | Placeholders that contradict the evidence: hours Tue–Sat 08:00–17:00, phone +1-450-000-0000, `areaServed` Bromont/Shefford/Waterloo, `knowsLanguage` fr-CA/en-CA | Medium | via research/01 §1 (phone 450-372-7177, 10+ sources), §3 (hours), §5 (no delivery evidence) | JSON-LD generated only from one NAP source file; publish guard blocks placeholders; `areaServed` omitted until delivery is real |
| A5 | v0c §7 hero (« La vraie vanille, depuis [année] », « Fait ici chaque matin »), v0c Layer 3 (« Tout sur la vanille » brand pillar), v0b B0 (« créations à la vanille ») | Claims derived from the brand name, with no evidence. "Made here every morning" may clash with frozen bread being sold | Medium | via research/01 §5: no vanilla specialty evidenced; frozen bread and baguettes listed (Three Best Rated) | Remove until the owner confirms each claim. v1's [[FACT NEEDED]] publish guard applies to marketing lines too |
| A6 | v0a §1.1 | "Granby ≈ 70k (2021)", "Haute-Yamaska ≈ 90k+" | Low | via research/01 §9.1: 69,025 (2021 census); 72,078 (2026 decree); MRC 98,146 (2026 decree) | Use research/01 figures with their dates |

### B. Business fit: category, beachhead, products, languages, season

| ID | Plan + section | Issue | Severity | Evidence | Fix |
|---|---|---|---|---|---|
| B1 | v1 §6 category sentence + beachhead, §7 answer block; v0b B0 positioning | "Custom cakes for birthdays **and weddings**" is the shop's weakest position. Weddings: zero evidence. The evidenced business (viennoiseries, bread, pastries, small café, next-day phone orders) has no defended page | High | via research/01 §11; via research/03 §0.1–0.3 (Cake Design + Avec un Grand A own custom cakes online; Rose Gâteaux owns weddings; Coco Vanille #2 on TBR *bakeries*, absent from TBR *cakes/pâtisseries*); via research/04 §0.2–0.3 (Pain-Pain closed 2026-06-16, bread slot open) | → M15. Default to research/01 **Option B** (evidence-led sentence). Defend « pâtisserie / boulangerie Granby » first. Cake wedge = « gâteau pour demain » (L3, documented next-day service, score 19 in research/05), then the custom-cake pillar. Weddings frozen until capacity is confirmed |
| B2 | v1 §6 cluster "gluten-free / allergies", §5 C6; v0c Layer 3 "Diètes & allergies" hub (sans gluten · végane · sans noix) | Free-from pages are regulated claims, not content | High | via research/07 §0.10: "sans gluten" in advertising, website included, means no gluten protein and ≤ 20 ppm from cross-contact (CFIA); no free-from claims at launch. via research/01: no gluten-free evidence | Replace with one allergen-information page + a « Contient : … » block per product (§5.2 sketch). No free-from page until a controlled process is documented and cleared |
| B3 | v1 §6 clusters (9 listed), §5 prompts; v0b A3; v0c §4 site map | 5 of v1's 9 clusters (smash cake, weddings, bûches, gluten-free, corporate) and 12 of 30 prompts depend on unconfirmed products | High | via research/04 §0.1: 10 of 38 pages CONDITIONAL + 2 waiting; via research/05 §0.5, §5: 12 prompts gated | Each page and prompt carries `offer_confirmed`; build only confirmed ones (research/05 `pickTen(…, offerOk)`) |
| B4 | v0b A1 (EN for "Townshippers", ES "sizeable community… first-place rankings come fast"); v0a §1.1; v1 §3 weeks 3–6 ("core Spanish pages") | Language tiers sized on community claims, not on demand or on who can answer | Medium | via research/01 §9.3–9.4: French mother tongue 91.8 %; English ≈ 2.1 % (computed, aggregator); Spanish 965 = 1.3 % (2011, CA); 535 Colombian-born (2021, press). via research/01 #17: Spanish-speaking staff unknown | → M10. Apply v0b's own rule (demand + serviceability + maintainability). FR 100 %; EN for commercial + visit pages (tourists); ES 3–5 pages only if someone answers in Spanish |
| B5 | v1 §0, §3 (no 2026 holiday plan); v0a §2.3 and v0c §10 timing tips (not scheduled) | Holiday pre-orders open 2026-11-01 (v1 §14), 7 days from today. v1 has no Noël 2026 plan | High | via research/04 §0.6: Noël 2026 can't be won organically by the new site; GBP + Facebook only. via research/05 §6: C4 becomes #1 for Nov–Dec only if bûches are confirmed by 2026-11-01. via research/10 §0: bridge = payment links + request form | Week 0: bûches yes/no. If yes: GBP products and posts, a Facebook post, phone + request form, deposit by payment link. Optional `/buches-de-noel/` on the holding page (hypothesis: gives the URL history for 2027) |
| B6 | v0c §6 custom-cake builder (10 steps, 2.5D SVG, rules engine, live price) as "the killer feature"; v1 §3 weeks 13–18 | The most expensive feature is built before anyone knows the custom-cake volume or price grid | Medium | via research/01 §12 #9–10 (revenue mix, price grid: FACT NEEDED); via research/16a §10 move 5 (structured request → price → deposit link in under a minute) | → M24. Structured request + quote + deposit link first; the builder after 3 months of real request data |

### C. Contradictions between the plans

| ID | Plan + section | Issue | Severity | Evidence | Fix |
|---|---|---|---|---|---|
| C1 | v0a §3.1, §6.3 Avis, §6.5; v0b B3, C4; v0c §10 phase 3 **vs** v1 §4 L12, §16 | Review reply deadline: 48 h vs 24 h | Medium | v1 §16; Ranking Stack 07-local ("reply within a day"); research/16b §7 adopts 24 h | → M1: 24 h |
| C2 | v0b B3 ("post the weekly review count on the kitchen board") **vs** v1 §10, §16 | Staff-facing review target | High | via research/18 4a: Google Maps "Rating manipulation" bans merchants asking staff to solicit a number of reviews; clauses added 2026-04-17 (date from secondary sources) | → M2: no board; shop-level count in Studio only; no per-staff counts |
| C3 | v0b B3 (« dites-nous ce que vous avez goûté », "tell us what you chose… product keywords end up in reviews"); v0a §3.4 ("reviews that name products"), §6.3 (tracking whether reviews mention the 3 attributes); Ranking Stack 07-local ("what did we help you with?") | Review requests steer the content | High | via research/18 4a: the 2026-04-17 clause also bans asking staff to collect reviews with **specific content**; scope unclear | → M3: open-ended request only (research/18 §3 copy). Product mentions are measured, never requested |
| C4 | v0b B0 step 2 ("seed those exact attributes everywhere": review prompts, partner pages); v0a §3.3 GEO ① **vs** v1 §16 | Consensus seeding vs authentic mentions | High | v1 §16; via research/18 4a (specific-content clause) | → M4: the attributes appear in our own copy and in earned media we don't script; never in review requests or copy we write for partners |
| C5 | v0b A3 (Astro config); v0c §8 Path A (Astro/Next + Sanity + Supabase + Vercel/Cloudflare + Plausible + Resend); v0a §2.1 ("Astro + Sanity remains valid") **vs** v1 §4 L4, §12 (Next + Payload) | Stack | High | via research/16b §1 row G: Sanity's Content Lake can't be self-hosted, which conflicts with "own VPS"; 16b recommends Payload 3.92.x + Next 16.4 (version facts UNVERIFIED (FC) in 16b) | → M5: Next.js + Payload on the VPS |
| C6 | v0a §2.1 (Supabase/RDS, S3, BigQuery, Cloud Run sGTM, Better Stack); v0c §8 (Vercel or Cloudflare); v1 §5, §11, §17 (Vercel/Cloudflare firewall, Vercel log drain) **vs** requirements | Hosting | High (blocks the Loi 25 assessment) | requirements ("owner's VPS"); via research/17 §0 (Québec VPS, nginx, no CDN at launch, SES ca-central-1), §6.1 (Cloudflare AI-crawler defaults) | → M6 |
| C7 | v0a §2.1 (`/studio`), v1 §5 robots (`Disallow: /studio/`, `/api/`) **vs** requirements | Studio location | Medium | via research/16b §2.2: Studio at the admin host root, Payload admin at `/admin` as « Avancé », public host returns 404 for `/admin`, `/studio`, `/api` | → M7. Drop `/studio/` and `/api/` from the public robots.txt: they 404 there |
| C8 | v1 §5 robots (`Sitemap: https://VOTREDOMAINE.ca/…`); v0b A3; v0c entity block | Placeholder domain | Low | requirements; via research/17 §10 (apex canonical, `www` → 301, defensive `.ca`) | → M8: `https://cocovanillegranby.com/` |
| C9 | v1 §13 new audit rule "hreflang trio (fr/en/es)" **vs** v1 §6 (Spanish subset), v0b A1 (ES ~15–20 pages) | The audit rule fails every page that has no Spanish twin | Medium | v0b A3's own code: "only languages that truly exist"; Ranking Stack 06-architecture: legal pages may exist in FR only and leave the hreflang set | → M9: rule = "reciprocal set of the equivalents that exist + `x-default` → FR" |
| C10 | v1 §4 L2 (`lang` fr-CA / en-CA / es; hreflang fr/en/es); v0b A3 (same); v0c (`knowsLanguage` fr-CA, en-CA) | fr vs fr-CA: **not a real conflict** | Low | v0b A3 rationale (language-only codes so US tourists get English); via research/07 S3 | → M9: keep `lang="fr-CA"` with hreflang `fr`; `knowsLanguage` lists only languages actually served |
| C11 | v1 §7, §13 (WhatsApp on ES pages); v0a §5.1, §5.4, §6.4 (Monday report by WhatsApp), §4.6 (click-to-WhatsApp ads) **vs** v0b A1 honesty rule | WhatsApp scope | Medium | via research/01 #17 (Spanish service unknown); v0a §7.2 (WhatsApp Cloud API paid per message); Meta becomes another processor outside Québec (inference; PIA logic of research/07 §0.5) | → M11: no WhatsApp at launch |
| C12 | v0a §4.7, §5.1 (TikTok 3–5/week, pixel, Events API, catalogue, Spark Ads); v1 §14 ("TikTok [regulatory status]"), §17 | TikTok as a pillar; the regulatory note is stale | Medium | This session (secondary: Digital Policy Alert, Mondaq, Outlook Business): the Nov 2024 order wound up TikTok Canada's offices but never restricted the app; the Federal Court set the order aside on consent on **2026-01-21**; on **2026-03-09** the minister let TikTok Canada continue under binding undertakings. No TikTok account found for the shop (via research/01 §7) | → M12: the regulatory blocker is gone (secondary sources); TikTok is cut for **capacity**, not law. Updates research/18 claim 12 |
| C13 | v0b B7 (30 prompts 15/10/5, monthly); v0c Layer 6 (20 × 4 engines, monthly); v0a §1.2 (30 × 5 engines × 3 languages) **vs** v1 §1, §5 (30 fixed, weekly, 5 engines) | Four different prompt panels | Medium | Ranking Stack 04 §6, 08 ("expect variation between runs; judge four-week trends") | → M13: v1's set and cadence, with §4 fixes |
| C14 | v0b §0 (≥ 80 % geogrid, #1 on 25+ queries in 3 languages, 6+ of 10 SERP slots); v0c §10 KPIs; v0a §3.2 **vs** v1 §1 | Three "definitions of done" | Medium | v1 §16 row 1 supersedes the earlier ones | → M14: v1 definition of first, amended (§4) |
| C15 | v0b B0 (« pâtisserie artisanale… reconnue pour… gâteaux de mariage… créations à la vanille ») **vs** v1 §6 (no adjectives) | Positioning sentence | Medium | via research/01 §11; via research/03 §7 (narrowed sentence passes the competitor test) | → M15 |
| C16 | v0a §2.4 launch gate ("llms.txt and JSON feeds live"); v0b A7; v0c (top) **vs** v1 §16 | llms.txt priority | Low | Ranking Stack 13-operations: Google lists llms.txt among things to ignore | → M16: optional, after launch |
| C17 | v1 §0 and §16 ("ordering + Studio by weeks 12–14") **vs** v1 §3 table (Studio v1 weeks 7–10, ordering live weeks 11–12) | v1 contradicts itself | Low | v1 §0, §3, §16 | → M20: ordering live weeks 11–12 (2027-01-11 → 01-24) |
| C18 | v0a §6.1 ("Studio manages the online presence, not the store; POS keeps orders"), §6.2 (home = health score) **vs** requirements (ordering inside the site), v0c §6 back-office | What Studio is for | High | via research/16a §0.1, §9: ~27 presence modules, staff need 4; home should be « Aujourd'hui ». via research/10 §0: our engine is the web-order system of record, payment processor gated on the POS | → M18 |
| C19 | v0c Layer 6 (Plausible/Fathom or GA4); v0a §7.1 (GTM + server GTM + GA4 + BigQuery + Meta/TikTok/Pinterest pixels + CAPI); v1 §11 (GA4 + Clarity + Data Studio) | Tracking stack | High | via research/07 §0.4 (tracking off by default; **basic** Consent Mode is the conservative fit), §2 (Meta/TikTok pixels "not at launch"); via research/10 §0 (purchase sent server-side only, consent-gated) | → M19 |
| C20 | v0a §4.4 ("seasonal products show as pre-order"), §6.4; v1 §4 L19 (PreOrder) | Wrong availability state for returning seasonal items | Medium | via research/06 (k): Merchant Center reserves `preorder` for never-released products; a returning seasonal item taking orders = `backorder`, with a date shown on the page | → M21: research/06 mapping |
| C21 | v1 §5 robots (`Disallow: /boite/`, `/compte/`…) + v0c §4 ("cart, account and builder-step URLs are noindex") | A disallowed URL can't show its noindex | Low | via research/16b §2.4 (Google must crawl a page to see noindex) | Disallow cart, account and search only; builder steps get noindex and stay crawlable |
| C22 | v0b, v0c (« cueillette ») vs research/16b (« Ramassage ») | One concept, two words | Low | via research/04 §0.11 | One term on the site, Studio, emails and GBP [[FACT NEEDED: owner + OQLF check]] |
| C23 | v0b B3, v1 §4 L12 ("SMS the day after the celebration"), v0c §6 ("follow-up 24 h later") | Review requests by SMS/email | Medium | via research/07 §0.9, E-4: treat review requests as commercial messages under CASL; implied consent (reported 2 years) UNVERIFIED; the QR code on the box is not an electronic message | → M23: QR card + paper-receipt link; email/SMS only to customers who ticked a box |

### D. Claims contradicted, stale or unverified

| ID | Plan + section | Issue | Severity | Evidence | Fix |
|---|---|---|---|---|---|
| D1 | v1 §16 row "Agentic checkout" ("Instant Checkout limited to approved partners"); v0c §12; v0a §3.3 ③ ("ACP, MCP/NLWeb") | Out of date even in v1 | Medium | via research/18 #9: on 2026-03-24 OpenAI moved ChatGPT shopping to discovery; merchants use their own checkout. #10: Google UCP Canada "in the coming months" (May 2026), not confirmed live | Watch only. Clean prices and availability in HTML (+ Merchant Center later) |
| D2 | v1 §2 ("brand mentions correlate 0.664 with AI visibility vs 0.218 for backlinks"), used to make off-site "the main budget line" (§0) | Overstated scope | Medium | via research/06 (l): Ahrefs (2025-05-26) measured AI **Overview** brand mentions for 75k brands with DR > 40; 0.218 only in a Medium post | Keep the direction (earned mentions > link building); drop the numbers from client material |
| D3 | v0c §9 Taxes ("some single pastries taxable, 6+ zero-rated") | Out of date | High (checkout) | via research/07 §0.1: since 2026-07-15 QST zero-rates single-serving sweet baked goods; GST still applies under the "fewer than six" rule | Effective-dated tax classes; accountant sign-off |
| D4 | v0a §6.4, §7.2; v1 §3 weeks 7–10 ("Business info synced to Google profile", "Reviews inbox") | Studio v1 assumes GBP API access | High | via research/16b §5 + 18 #17 (application, quota 0 = not approved; UNVERIFIED (FC)). This session: Google's Prerequisites page surfaces; third-party guides say approval is a manual review of days to weeks; a developer forum reports a rejection for a website mismatch and another reports no answer after about a month (quota still 0); "profile active ≥ 60 days" is third-party only | File in week 6 (needs the live site + an @cocovanillegranby.com mailbox: 16b). Studio v1 must work **without** the API (manual GBP tasks); API sync is a bonus |
| D5 | Owner rule "code strictly JavaScript" vs v1 §12 / research/16b (Payload) | Plain-JS Payload 3 is unproven | High | This session: Payload's v2 docs name `payload.config.js`; current docs are TypeScript-first (`payload.config.ts`); no official plain-JS guide for v3 found. 16b §1 already flags [[VERIFY]]. v0a/v0b samples are TypeScript | First build task: a half-day spike (create-payload-app → convert config and collections to `.js`, build, run the jobs worker). If it fails, the owner decides: JS everywhere except config files, or another CMS |
| D6 | v1 §11, L15 ("Instagram, TikTok and YouTube as Search Console properties") | Plausible and new, not an error | Low | This session (secondary: SEO Sherpa, Search Atlas, TechWyse): "platform properties" announced 2026-07-07 for Instagram, TikTok, X and YouTube; verified by authorising the account; gradual rollout | Keep for Instagram (and YouTube if a channel exists). TikTok only if an account exists. Confirm in the console |
| D7 | v1 §15 ("stack prices as of Sep 28, 2026") | Unsourced date; the figures are consistent with third-party pages | Low | via research/18 #16 (no source for the date). This session (third-party only): SerpApi Starter $25/month for 1,000 searches, free tier 250/month; Local Falcon Starter $24.99 for 7,500 credits | Keep figures tagged [verify vendor page]. The SerpApi free tier may cover one weekly 33-prompt run at one location (33 × ≈ 4.3 ≈ 142 searches/month, computed). Updates research/18 claim 16 |
| D8 | v0c Layer 6 (`utm_source=chatgpt.com`); v0c Layer 4 (Princeton "~40 %"); v0a §4.6 (Andromeda, Trial Reels, DM shares); v0a §3.4 + v1 §13 (Yelp → Apple Maps); v0a §4.1 (Consent Mode v2 mandate) | Unverified claims stated as facts | Medium | via research/18 #11b, #14, #15, #18, #20 | Tag [verify]; never in client material; run the self-tests in research/18 §2 |
| D9 | v0a §3.4 ("ChatGPT search: Bing's index") | Partly wrong | Low | via research/18 #11a: OpenAI names no provider; Microsoft is inferred | Use v1 §16 wording |
| D10 | v0a, v0b, v0c ("Apple Business Connect", "Looker Studio") | Old names | Low | via research/18 #2, #3 | "Apple Business", "Data Studio" (v1 §16) |

### E. Missing pages and workstreams

| ID | Plan + section | Issue | Severity | Evidence | Fix |
|---|---|---|---|---|---|
| E1 | v1 §6 page tree | No menu/catalogue page and no `/commander/` page. v0c's schema `hasMenu: /carte/` points to a page no site map contains | High | via research/01 §5 (the evidenced business is walk-in pastry, bread, café); v0c §11 ("menu as PDF/image" is pitfall #1); via research/03 §5(b) (Coco Vanille is the incumbent for « pâtisserie Granby ») | Add `/carte/` (HTML menu: prices, portions, allergens, « vitrine du jour » block) and `/commander/` (interim request form) in weeks 3–4 |
| E2 | all plans (v0a has an `Allergen` entity; v0c's data model has none) | No allergen data model or verification workflow | High | via research/07 A-3 (11 CFIA priority allergen groups + gluten sources), A-8 (human-verified), O9 (allergy notes = probably sensitive PI) | §5.2 sketch: per-product `contains[]`, nut detail, cross-contact line only if real, `verifiedBy/At`, recipe version; a recipe change voids the stamp |
| E3 | v1 L19 ("pickup and delivery zones"); v0c `areaServed`; v1 §1 (Bromont "only with real delivery") | No delivery decision anywhere | Medium | via research/01 §5 (no delivery evidence), §9.2 (zones from the verified geo point with a routing API, never calculator figures) | Launch pickup-only and say so (« Cueillette en boutique seulement ») in the FAQ and on `/commander/` |
| E4 | v1 (absent); v0c §5, §10 phase 2 (weeks 9–14) | Gift cards have no slot before the Nov–Dec gifting peak | Medium | via research/07 C-11, T-4 (no expiry, no fees; no GST at sale) | Holidays 2026: in-store only, if offered. Online after the ordering engine |
| E5 | v1 (no shoot); v0a §2.2, §5.2 (2–3 shoot days + monthly half-day, unpriced); v0c §7 (photo spec) | Photo/video production is unplanned in v1 and unbudgeted everywhere, yet v1's gates need real photos (L19) and 4 YouTube videos by weeks 7–10 | High | v1 L3 (≤ 200 KB images), L15, L19 ("real photos only") | One half-day shoot in week 2 (v0c spec: window light, cross-sections). Video deferred (cut list) |
| E6 | v1 §3–§4 gates | No accessibility gate in v1 (v0a §2.4 and v0c §7 have WCAG 2.2 AA + axe) | Medium | via research/07 X-1 (target; legal duty UNVERIFIED); via research/16a §11 T6 | Add axe to `npm run gate`; WCAG 2.2 AA target |
| E7 | v1 §10 ("2FA everywhere; tested backups": one line), §3 (no infra week) | VPS hardening, backups, restore test and patch level are not scheduled before personal data is collected | High | via research/17 §8 (day-0 hardening, nightly encrypted off-site backups, monthly restore test); via research/16b §4 #1 (Payload ≥ 3.90 for Oct 2026 CVEs; UNVERIFIED (FC)) | Infrastructure gate before the first form submission (week 2) |
| E8 | v1 §2, §13 (Apple and Bing named, no step or gate) | Maps beyond Google not scheduled | Medium | via research/06 (b): iOS 64.87 % of Canadian mobile (StatCounter, Sept 2026); Bing ≈ 10 % (partly) | Week 1: claim Apple Business + Bing Places from the NAP source file; self-tests (research/18 §2, research/06 §4) |
| E9 | v1 L12 ("hours including Québec holidays"); v0a holiday planner; v0b B2 | The rule exists, the dates don't, and Dec 24 – Jan 2 falls inside weeks 0–6 | High | via research/04 seasonal calendar: set GBP special hours by **2026-12-01**; Noël is Friday 2026-12-25; Jour de l'An is Friday 2027-01-01 | Holiday hours from the owner in week 0; pushed to GBP, Apple, Bing and Facebook by 2026-12-01 |
| E10 | v1 §3 weeks 7–10; v0a §2.1; v0c §8 rule #1 | The POS is unknown, and payments, order screens and printing all depend on it; no deadline | High | via research/10 §0 (processor gated on the POS); via research/16a §9; via research/16b §0 | [[FACT NEEDED: POS]] by week 2; ordering spec frozen in week 6 |
| E11 | v1 (absent) | The one public complaint (a cake made wrong) is not designed out in v1 | Medium | via research/01 §6; via research/02 §0.2 | Written recap + reference photo + approval before production, including in the interim form |
| E12 | v1 §1, §5, §7 ("phone checks in Granby") | Nobody is named for the weekly phone check in Granby | Medium | via research/05 §9 (the baseline must come from a phone in Granby) | [[FACT NEEDED: who runs it]]. Fallback: SERP API set to Granby weekly + a monthly check by the owner |
| E13 | v1 (absent) | Domain and mailbox ownership not scheduled, yet the GBP API, SES and Search Console need them | Medium | via research/17 §14 (registrar, registrant unknown); via research/16b §5 (mailbox on the domain for the GBP API) | Weeks 0–1 |
| E14 | v1 L8, §6 (chef page, Person schema) | Owner and chef names, photo consent unknown | Low | via research/01 §1, §12 #5 | Ship `/a-propos/` without the chef page if consent is missing |

### F. Scope, capacity and budget (one-person operator)

| ID | Plan + section | Issue | Severity | Evidence | Fix |
|---|---|---|---|---|---|
| F1 | v0a §2.2 team | Staffed for **4–4.5 FTE** (PM 0.5–1, designer 1, full-stack 1, integrations 1, community 0.5) + copywriter + photo/video, vs the owner's One-Man Empire | **Critical** | v0a §2.2 (summed) | §5 cut list. One build track at a time |
| F2 | v0a §6.3 (20 modules) + v1 §12 (7) + v0c §6 (order back-office) + Copilot + health score | ≈ 30 Studio modules | **Critical** | via research/16a §0.1, §9 ("about 27 modules; staff need 4"); via research/16b §1 (custom Studio UI 4–6 weeks (est.) on top of the model) | → M18. Studio v1 = 5 screens. Presence modules (Gates, Scoreboard, Battle map…) stay as script reports (CSV/Markdown) for the agency |
| F3 | v0a §5.1 | 10 channels; ≈ 30+ publishing units a week (IG 4 Reels + 2 carousels + daily Stories; FB 3; TikTok 3–5; Shorts 3; Pinterest 5; GBP 1–2 posts + 5 photos; LinkedIn, email) | High | v0a §5.1 (counted) | Keep GBP + Facebook + Instagram: one asset, three placements, ≤ 3 posts a week in total |
| F4 | v1 §3 weeks 3–6 | ≥ 36 page-language units (18 FR page types × FR + EN) + core ES in 4 weeks, plus the content model, design system and CI with 7 gate scripts. Steady state (v1 §9) is 1 page a week | High | v1 §3, §6, §9 (counted) | Weeks 3–6 = ~12 FR pages + 6 EN (§6). The rest joins the 1-page-a-week rhythm |
| F5 | v1 §3 weeks 7–10 gate ("≥ 12 new reviews in 4 weeks"), L12 ("≥ 3 a week") | ≈ 6–18× the historical pace (est.), set before ordering exists to collect contacts | High | Google 4.9 from "40+" reviews as of July 2026 (this session, RestoMontreal summary); TBR 115 ratings (via research/01 §6); shop trading since 2022 (via research/01 §1) → ≈ 0.2–0.5 a week (est.); a probable 3-day week (via research/01 §3, unverified) | Target = 2× the trailing 8-week rate, shop-level; QR card on every box from week 1; never per staff member |
| F6 | v1 §8, §9, L15 | Off-site load: 2 YouTube videos a month, a quarterly data study, 5–10 pitches a quarter, weekly community posts, quarterly talks, weekly owner posts | High | v1 §8; Ranking Stack 13 §3 (≈ 6 h per client per week in the growth phase; v1 §9's own rhythm already uses those 6 h) | Months 1–3: listicle/directory sweep + 3 pitches + one data study (Q1 2027 price survey, seeded by research/02's price benchmarks). Video from month 4 |
| F7 | v0a Part 4 ("ads-ready, ads-off") | Pixels, CAPI, Events API, server GTM, BigQuery, offline uploads on 5 ad platforms: engineering for a decision not taken | High | via research/07 §2 (Meta/TikTok pixels: US processors + profiling → PIA, "not at launch"); via research/10 §0 | Defer all. Keep UTM fields (and `gclid`, consent-gated) on orders so ads can start later without rework |
| F8 | v1 §0 ("off-site the main budget line"), §15; v0a (unpriced vendors); v0c §13 (asks for "a budget range") | No total budget; most lines unpriced | High | v1 §15 prices only SEO tools (≈ US$62 + AI usage; unsourced date, research/18 #16). via research/17 §11 hosting ≈ C$35–55/month (est.); via research/10 §0 ≈ C$37–75 fixed + ≈ 3.4–3.6 % card fees (est.). Unpriced in v0a: consent platform, server GTM, BigQuery, BrightLocal/Whitespark, Talkwalker, Visualping, ManyChat, Brevo/Klaviyo, Yelp API, DataForSEO, LLM APIs, photographer, native EN/ES reviewers, legal and accounting reviews | [[FACT NEEDED: monthly budget ceiling]]. Launch budget in §5.3 |
| F9 | v1 §12 (`tenant_id` now), L20 (agency offer, contracts, capacity) | Agency multi-tenancy and agency business work inside the bakery build | Medium | via research/16b §1 (multi-tenant plugin exists), §4 (access-control CVEs; UNVERIFIED (FC)): more access surface | Defer; single tenant in v1 |
| F10 | v1 §1 widen step 3; v0b A1 tier 4 | A fourth language / deeper ES tier | Low | via research/01 §9.3 | Drop until FR + EN hold "first" |
| F11 | v1 §9 ("Daily, 20 min" bakery tasks in Studio) | The owner's daily tasks assume Studio, which arrives in weeks 7–10 at the earliest | Medium | v1 §3, §9 | Weeks 0–6: owner tasks by phone/email to the operator, plus GBP's own app for review replies |

### G. Measurement and the definition of first

| ID | Plan + section | Issue | Severity | Evidence | Fix |
|---|---|---|---|---|---|
| G1 | v1 §1 SEO ("position 1 on ≥ 10 of the 20 commercial + local prompts") | "Best X" prompts (C1, C2, C8, C10) are listicle-intent: a bakery's own domain rarely holds organic #1 there (hypothesis) | High | via research/05 §2, §4: local directories and listicles were the only surfaces that named the shop; C1 owned by RestoMontreal + TBR | §4: a listicle-intent prompt counts as won if our domain is #1 **or** the #1 result names us first; reported separately |
| G2 | v1 §1 ("map pack held on the local prompts") | Undefined: from which point, which slot | Medium | v0b B2 (distance rings); Ranking Stack 07-local | §4: top 3 at the shop's grid point + ≥ 50 % of a 7 × 7 grid within 3 km (my design choice; calibrate after 4 runs) |
| G3 | v1 §5 | 12 of 30 prompts gated on unconfirmed products: the bar is unreachable honestly, or it invites pages for things the shop doesn't sell | High | via research/05 §0.5, §5 | Before the week-1 freeze, swap gated prompts for evidenced candidates (X1 « pâtisserie Granby », X2 « boulangerie Granby », X7 « croissants Granby », X3 « gâteau d'anniversaire Granby », X12 « café pâtisserie centre-ville Granby »). IDs stay fixed after the freeze |
| G4 | v1 §5 | Weights: 21 FR / 6 EN / 3 ES. ES prompts are "the cheapest uncontested answers" (research/05 §0.8), so easy ES wins inflate the counts | Medium | via research/05 §0.8; via research/01 §9.3 | "First" also requires the thresholds on the FR subset alone (§4 sketch) |
| G5 | v1 §1 GEO ("brand cited… and ours is the most-cited domain in the category") | "Cited" (named vs linked) and "category" undefined; directories may stay the most-cited domains | Medium | via research/05 §4; Ranking Stack 16 (citation-share formula) | Two metrics: brand **named** (any source) and our domain **linked**. "Most-cited" compares bakery domains only; directories are reported separately |
| G6 | v1 §1, §5 ("AI engines through their APIs", weekly) | One run per prompt per engine per week; answers vary between runs; API answers only approximate the consumer apps | Medium | Ranking Stack 08 ("expect variation between runs"); v0a §7.2 ("API answers approximate the consumer apps") | 3 runs per prompt × engine; a cell counts at ≥ 2 of 3 (§4). ≈ 495 calls a week (33 × 5 × 3, computed); cost [[FACT NEEDED]] |
| G7 | v1 §1 AEO ("AI Overview citation") | French AI Overviews in Canada not found; AI Mode in French is live | Low | via research/06 (a): AI Mode in French since 2025-10-14; FR AI Overviews in Canada not found | AEO counts snippet, PAA, AI Overview or AI Mode citation; self-test T1 (research/06 §4) |
| G8 | v1 §11 (GA4 key events, AI channel) | With opt-in consent GA4 sees a fraction of visits, and AI Overview/AI Mode traffic is not in GA4's AI channel | Medium | via research/07 §0.4; via research/06 (g) | Truth = orders database + calls + GBP actions + nginx logs. GA4 is directional |
| G9 | v0a §6.5 (Presence Health Score); v0b §0 | A composite score with arbitrary weights hides what moved | Low | — | Drop; use the 3 scoreboards + orders and leads |

---

## 2. What the plans get right (keep)

- **v1:** "first" is a measurement, not a promise; the refused-tactics clause; Studio guardrails; the publish guard ([[FACT NEEDED]], missing French, unverified allergens); one change at a time with a 14-day wait; prices in HTML and never « prix sur demande »; training crawlers allowed; the crawler-access check after every deploy; no self-serving review stars; reports in orders, calls and leads, not sessions.
- **v0b:** Loi 96 parity; no IP or browser-language redirects; the rule for adding a language (demand + serviceability + maintainability); facts as data fields rendered in every language; "Hablamos español" only if true; reciprocal hreflang built from translation groups.
- **v0c:** capacity per production category and day; the date-first mode for holidays; guest checkout; testing checkout inside the Instagram browser; evergreen seasonal URLs; no cloned city pages; allergy questions go to a human; a back-office designed for floury hands.
- **v0a:** the business owns every account; allergens are picked by a human, never by AI; nothing publishes without approval; the pause / retire / redirect flows (with research/06's availability correction); the one-button exceptional closure; the "how did you hear about us?" question.
- **requirements:** a Québec-hostable VPS, a separate admin host and a fixed domain. They match research/16b and 17.

---

## 3. Merged single-source decisions (which plan wins)

Binding until the owner overrules one in writing.

| # | Topic | Conflict | Winner | Decision |
|---|---|---|---|---|
| M1 | Review reply time | 48 h (v0a, v0b, v0c) vs 24 h (v1) | **v1** | 24 h, closed days included (a phone reply takes a minute). Reply in the reviewer's language |
| M2 | Review counts | Kitchen board (v0b) vs no quotas (v1) | **v1** + research/18 4a | Shop-level count in Studio only; no per-staff counts, no leaderboard |
| M3 | Review request wording | Product/attribute prompts (v0b, v0a, Ranking Stack 07) vs open-ended | **research/18 §3** | « Merci d'avoir choisi Coco Vanille ! Si vous avez deux minutes, votre avis sur Google nous aide beaucoup : [lien] ». No stars, products or staff names |
| M4 | "3 attributes" | Seed everywhere (v0a, v0b) vs authentic only (v1 §16) | **v1** | Attributes come from review mining and live in our own copy only |
| M5 | Stack | Astro + Sanity / Supabase (v0b, v0c) vs Next + Payload (v0a, v1) | **v1 + research/16b** | Next.js + Payload 3, versions pinned from `npm view` at install; plain JS subject to the D5 spike |
| M6 | Hosting | Vercel / Cloudflare / Supabase / AWS (v0a, v0c, v1) vs owner VPS | **requirements + research/17** | Québec VPS; nginx; no CDN at launch; SES ca-central-1; encrypted backups to Québec storage at a second provider. [[FACT NEEDED: VPS provider + city]] |
| M7 | Admin location | `/studio` (v0a, v1) vs subdomain | **requirements + research/16b** | `admin.cocovanillegranby.com`: Studio at `/`, Payload admin at `/admin` (« Avancé »); `X-Robots-Tag: noindex` on every admin response; the public host 404s `/admin`, `/studio`, `/api` |
| M8 | Domain | VOTREDOMAINE.ca vs cocovanillegranby.com | **requirements + research/17** | Apex canonical, `www` → 301; register `cocovanillegranby.ca` defensively (owner) |
| M9 | hreflang / lang | "trio" audit rule (v1) vs subset languages | **v0b rule** | `lang` fr-CA / en-CA / es; hreflang `fr`/`en`/`es` for existing equivalents only + `x-default` → FR; FR-only legal pages leave the set |
| M10 | Language scope | Full trilingual (v0a, v0b) vs FR + EN (v0c) | **v0b's add-a-language rule** | FR 100 %; EN for home, menu, order, visit, about, pillar; ES 3–5 pages only if someone answers in Spanish |
| M11 | WhatsApp | ES pages (v1), 3 languages + ads + reports (v0a) | **none** | No WhatsApp at launch. ES pages use the same order form + phone |
| M12 | TikTok | Pillar (v0a) vs "regulatory status" (v1) | **neither** | Not at launch (capacity). The regulatory blocker is gone (secondary sources, C12) |
| M13 | Prompt panel | 4 variants | **v1** | 30 fixed + B1–B3, weekly, 5 engines, with §4's method |
| M14 | Definition of done | v0b, v0c, v0a vs v1 | **v1, amended** | §4 |
| M15 | Category sentence | Adjectives + weddings + vanilla (v0b) vs no adjectives (v1) | **v1 rule + research/01** | Option B by default (« Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. »). Option A only if custom cakes clear the owner's revenue threshold. No weddings |
| M16 | llms.txt / JSON feeds | Launch gate (v0a) vs optional (v1) | **v1** | After launch, lowest priority |
| M17 | FAQ | FAQ markup (v0a) vs `<details>` FAQ (v1) | **v1 + research/18 #1** | FAQ in server HTML; FAQPage markup optional; never a gate |
| M18 | Studio's job and home | Presence centre, health-score home (v0a) vs shop operations | **research/16a + 10** | Home = « Aujourd'hui ». Studio v1 = Aujourd'hui · Commandes/Demandes · Menu (épuisé) · Heures & Fermeture · Avis. Presence work stays in script reports for the agency |
| M19 | Tracking | Plausible (v0c) / full ad stack (v0a) / GA4 + Clarity (v1) | **research/07 + 10** | GA4 with basic Consent Mode; `purchase` sent server-side only; no pixels, no server GTM, no BigQuery, no Clarity at launch; nginx logs for bots |
| M20 | Ordering timing | Weeks 3–8 (v0c), days 15–45 (v0b), weeks 7–12 (v0a), weeks 11–14 (v1) | **v1 sequence + research/10 bridge** | Weeks 3–6: interim request form + deposit by payment link. Engine live in weeks 11–12 = 2027-01-11 → 01-24, after the holiday rush |
| M21 | Availability states | PreOrder for seasonal (v0a, v1) | **research/06 (k)** | Never released → `preorder`; returning seasonal → `backorder`; both with a visible date |
| M22 | Product names | Apple Business Connect / Looker Studio | **v1 §16** | Apple Business; Data Studio |
| M23 | Review channel | SMS/email after pickup (v0b, v0c, v1) | **research/07** | QR card on every box + link on the paper receipt; email only with a ticked box |
| M24 | Custom cakes online | 10-step builder (v0c) vs request flow | **research/16a move 5** | Request (photos, guests, date) → price → deposit link, with a written recap; builder later |
| M25 | Taxes | v0c §9 | **research/07** | Effective-dated tax classes (QST change of 2026-07-15); accountant signs off |

---

## 4. The 30-prompt set and the definition of first: are they sound?

| Element | Sound? | Problem | Fix |
|---|---|---|---|
| 10 informational / 10 commercial / 10 local + B1–B3 | Yes | Matches Ranking Stack 04 §6 | Keep |
| Prompt content | **No** | 12 of 30 gated on unconfirmed products (G3); the evidenced core (bread, viennoiseries, café) is missing | Swap before the freeze; candidates in research/05 §8 |
| Language mix (21 FR / 6 EN / 3 ES) | Partly | ES wins are cheap and inflate the totals (G4) | FR subset must pass on its own |
| SEO "#1 on ≥ 10 of 20 C+L" | Partly | Listicle-intent "best X" prompts (G1); the map pack is undefined (G2) | Listicle rule + pack definition below |
| AEO "≥ 10 of 30" | Yes, with a change | FR AI Overviews in Canada unconfirmed (G7) | Count AI Mode citations too |
| GEO "≥ 15 of 30 in ≥ 2 engines + most-cited domain" | Partly | Named vs linked; directories; run noise (G5, G6) | Two metrics; 3 runs, majority |
| Four consecutive weeks | Yes | — | Keep |
| Realism on a new domain | **Low for the SEO bar** | Zero links; listicles hold "best" queries; the Ranking Stack itself says a new domain takes months | Report progress monthly in orders and leads (v1 already says so); don't promise a date |

Amended definition (proposal):
- Frozen set = 30 prompts (after the swap) + B1–B3 as diagnostics. Each prompt × engine runs 3 times a week; a cell counts at ≥ 2 of 3.
- **SEO:** our domain is #1, or (listicle-intent prompts only) the #1 result names us first, on ≥ half of the C+L prompts; top 3 on the rest. Map pack = top 3 at the shop's grid point + ≥ 50 % of a 7 × 7 grid within 3 km.
- **AEO:** our passage owns the snippet, a PAA answer, or an AI Overview / AI Mode citation on ≥ a third of prompts.
- **GEO:** brand named on ≥ half of prompts in ≥ 2 engines, and our domain is the most-linked **bakery** domain (directories reported separately).
- All three on the full set **and** on the FR subset, for 4 consecutive Mondays.

```js
// first.mjs — amended definition of first (proposal): 3 runs per prompt × engine; a cell counts at ≥ 2 of 3
const ok = (runs = []) => runs.filter(Boolean).length >= 2;

// cells: [{ id, lang, type: 'informational'|'commercial'|'local'|'brand', engine, seo:[b,b,b], aeo:[b,b,b], geo:[b,b,b] }]
export function weekPasses(cells, { lang } = {}) {
  const set = cells.filter((c) => c.type !== 'brand' && (!lang || c.lang === lang));
  const count = (pred) => new Set(set.filter(pred).map((c) => c.id)).size;
  const n = count(() => true);
  const nCL = count((c) => c.type !== 'informational');
  const seo = count((c) => c.engine === 'google' && c.type !== 'informational' && ok(c.seo)); // our domain #1, or #1 result names us first (listicle prompts)
  const aeo = count((c) => c.engine === 'google' && ok(c.aeo)); // snippet, PAA, AI Overview or AI Mode citation
  const enginesPerPrompt = new Map();
  for (const c of set) if (c.engine !== 'google' && ok(c.geo)) enginesPerPrompt.set(c.id, (enginesPerPrompt.get(c.id) || 0) + 1);
  const geo = [...enginesPerPrompt.values()].filter((e) => e >= 2).length;
  return { seo: seo >= nCL / 2, aeo: aeo >= n / 3, geo: geo >= n / 2, counts: { n, nCL, seo, aeo, geo } };
}
// "First" = weekPasses(all) and weekPasses(all, { lang: 'fr' }) both true on 4 consecutive Mondays
// (plus v1's unchanged rules: top 3 on the remaining C+L prompts; most-linked bakery domain).
```

Ran once in Node against a fixture (30 prompts × 3 engines + 1 brand row): the brand row is excluded and the FR subset is computed on its own. Not tested on real data.

---

## 5. Cut list for a one-person operator

### 5.1 Drop or defer

| Item | Source | Action | Why |
|---|---|---|---|
| Wedding funnel, wedding pages, tasting box, WeddingWire profile, wedding prompts | v1 §3, §6; v0c §6; v0b | **Drop** until the owner confirms capacity | No evidence (research/01 §5); Rose Gâteaux owns it (research/03) |
| Quinceañera pages; ES beyond 3–5 pages; a 4th language | v0b A1, A3; v1 §1 | **Drop** | ~1 % scale; serviceability unknown |
| Free-from pages (sans gluten, végane, sans noix) | v1, v0c | **Drop** (replace with allergen information) | Regulated claims (research/07 A-6) |
| TikTok, Pinterest, LinkedIn, Threads, YouTube Shorts, daily Stories | v0a §5.1 | **Drop** | Capacity (F3) |
| WhatsApp Business, comment-to-DM (ManyChat), creator programme | v0a §5.4–5.5; v1 §7 | **Drop** | Capacity; extra processors |
| All ad pixels, CAPI / Events API, server GTM, BigQuery, Meta/TikTok/Pinterest catalogues, Google Ads brand ad, competitor bidding, Microsoft Ads | v0a Part 4; v1 §8, §10 | **Defer** until ads are decided | Loi 25 PIA; no ads budget (F7, F8) |
| Studio presence modules as UI (Gates, Scoreboard, Battle map, Snippet loop, Mentions, Own data, Diagnostics, Visibilité IA, Veille, Annuaires, Social Studio, Médiathèque AI tagging, Publicité, health score, Copilot) | v0a §6.3; v1 §12 | **Defer**: run the rank-first scripts, keep CSV/Markdown reports | Only the agency uses them, on a desktop (research/16a §9) |
| Season orchestrator automation | v0a §6.4 flow 3 | **Defer**: manual checklist per season | One season a quarter; automation can wait a year |
| Cake builder (2.5D SVG) | v0c §6 | **Defer** 3 months after the request flow | Unknown volume (B6) |
| Gift cards online | v0c §5 | **Defer** to after the engine | Needs payments (E4) |
| Club Coco Wallet card, AR preview, « Demande à Coco » assistant, workshops, "Fête parfaite" kits, subscriptions | v0c §5 | **Drop** for year 1 | Nice-to-have |
| Comparison page | v1 §6, §10 | **Defer** to after launch + legal check | Competition Act/LPC review (research/03 §6) |
| YouTube 2/month, quarterly talks, Reddit/communities, "Guide gourmand" | v1 §8 | **Defer** to month 4 (video 1/month) | Capacity (F6) |
| Data studies Q2–Q4 | v1 §8 | **Defer**; run only Q1 2027 (price survey) | Data partly collected (research/02) |
| llms.txt, `/menu.json`, `/hours.json`, MCP/NLWeb | v0a, v0b, v0c | **Defer** | Low value (M16); agentic checkout not live in Canada (D1) |
| Clarity recordings, Data Studio dashboard, Monday Copilot summary | v1 §11; v0a §6.4 | **Defer**: `weekly.mjs` Markdown by email | Loi 25; capacity |
| Multi-tenant `tenant_id`, agency offer and contracts (L20) | v1 §12, L20 | **Defer** | Not bakery work (F9) |
| Local Falcon, AlsoAsked, Otterly, Screaming Frog licence | v1 §15 | **Defer**: SerpApi free tier + manual checks first | Budget unknown (F8) |

### 5.2 What stays (the core) + the allergen data model

Core: GBP + Apple Business + Bing Places, one NAP source file, the review QR, ~12 French pages + 6 English pages, the menu with allergens, an interim order-request flow, the weekly 33-prompt run, then the ordering engine and a 5-screen Studio.

```js
// allergens.mjs — product allergen record + publish check (CFIA priority list via research/07 A-3)
export const PRIORITY = ['oeufs', 'lait', 'moutarde', 'arachides', 'crustaces_mollusques', 'poisson',
  'sesame', 'soya', 'sulfites', 'noix', 'ble_triticale'];
export const GLUTEN_SOURCES = ['orge', 'avoine', 'seigle']; // plus ble_triticale, already above
const FREE_FROM = /sans gluten|sans noix|sans arachides|végane|vegan|gluten[- ]free|nut[- ]free/i;

// product.allergens = { contains: ['ble_triticale', 'lait', 'oeufs', 'noix'], nuts: ['amandes'],
//   crossContact: 'Préparé dans une cuisine où l’on manipule aussi …' | null,
//   verifiedBy: 'user-id', verifiedAt: '2026-11-20', recipeVersion: 3 }
export function allergenErrors(product) {
  const a = product.allergens || {};
  const known = new Set([...PRIORITY, ...GLUTEN_SOURCES]);
  const errors = [];
  if (!Array.isArray(a.contains)) errors.push('allergens.contains manquant (une liste vide doit être explicite)');
  else for (const x of a.contains) if (!known.has(x)) errors.push(`allergène inconnu : ${x}`);
  if (a.contains?.includes('noix') && !a.nuts?.length) errors.push('préciser les noix (ex. amandes)');
  if (!a.verifiedBy || !a.verifiedAt) errors.push('vérification humaine manquante');
  if (a.recipeVersion !== product.recipeVersion) errors.push('recette modifiée depuis la vérification');
  const text = [product.name_fr, product.description_fr, product.name_en, product.description_en].join(' ');
  if (FREE_FROM.test(text) && !product.freeFromClearedBy) errors.push('allégation « sans … » non autorisée (research/07 A-6)');
  return errors; // [] = publishable; Studio shows the list in French
}
```

Ran once in Node: a complete Paris-Brest record passes; a record with an unknown allergen, a stale recipe version and « sans gluten » in the name returns the 3 errors. Allergy notes from customers are a separate, optional field, kept out of emails, SMS and AI prompts (research/07 O9).

### 5.3 Launch budget, as far as the sources go (monthly)

| Line | Amount | Basis |
|---|---|---|
| VPS + backups + domain + mailbox + email API | ≈ C$35–55 | research/17 §11 (est.) |
| Ordering run cost (includes hosting) | ≈ C$37–75 fixed + ≈ 3.4–3.6 % of online sales | research/10 §0 (est.) |
| SERP tracking | US$0 (free tier, 250 searches) → US$25 (1,000) | This session, third-party summaries |
| Local grid (later) | US$24.99 (7,500 credits) | This session, third-party summaries |
| AI-engine API runs (≈ 495 calls a week) | [[FACT NEEDED]] | G6 |
| Photo half-day, native EN reviewer, lawyer + accountant reviews (research/07 sign-offs) | [[FACT NEEDED]] | — |
| **Owner's ceiling** | **[[FACT NEEDED]]** | v0c §13 asked; nobody answered |

---

## 6. Corrected order, weeks 0–6

Dates assume work starts Monday 2026-10-26 (week 0). v1's week 1 = 2026-11-02.

| Week | Must happen | Exit gate | Owner input |
|---|---|---|---|
| **0** · Oct 26 – Nov 1 | Go/no-go (A1). Owner-confirmed hours fixed on the GBP (A3). Bûches yes/no; if yes, the Noël bridge: GBP products + posts, Facebook post, phone + deposit link (B5). Refused-tactics clause signed. Category sentence A or B chosen (M15) | Shop confirmed open; GBP not "temporarily closed"; owner access known | Open? GBP access; sign photo; hours + holiday hours (Dec 24 – Jan 2); product list with prices, portions, lead times; next-day cut-off; POS; revenue mix; who answers EN/ES; VPS provider + city; domain registrar; budget ceiling; who does the Granby phone check |
| **1** · Nov 2–8 | Monday baseline: 33 prompts + candidates from a phone in Granby + 5 AI engines (research/05 §9), after the prompt swap (G3). GBP: category audit, description, products, photos. Apple Business + Bing Places claimed; Facebook "About" aligned. VPS day-0 hardening (research/17 §8.1), DNS, TLS; static FR holding page (NAP, hours, phone, holiday orders if offered); robots.txt + sitemap; Search Console Domain property; Bing Webmaster + IndexNow. Payload plain-JS spike (D5) | Baseline file saved; GBP = Apple = Bing = Facebook; holding page returns 200 to every crawler (`crawler-access.mjs`) | Photos; approval of the NAP file |
| **2** · Nov 9–15 | Citation cleanup of the ~15 live listings (research/01 §7): MapQuest, Wanderlog, Yellow Pages, RestoMontreal flag; TBR refresh request (Pain-Pain closure) + apply to the TBR cakes list (research/03 §4). Payload model: Business, Location, Hours, SpecialHours, Product, Variant, Allergen (§5.2), Page, FAQ, Media, Redirect, AuditLog. Design tokens v0. CI gate: audit, links, images, render-diff, schema, hreflang (M9 rule), axe. Backups + restore test; patched Payload; owner passkey/2FA. Half-day photo shoot (confirmed products only). Run #2 | Restore test logged; publish guard blocks [[FACT NEEDED]], placeholders and unverified allergens | Allergen list per product + cross-contact practice; POS fact (E10) |
| **3–4** · Nov 16–29 | FR: home (category sentence, key facts, hours), `/carte/`, `/commander/` (phone + labelled request form + written recap and photo approval + deposit link; pickup only), `/nous-trouver/`, `/a-propos/`, `/prix/` (if the grid exists), the cake page (`/gateau-pour-demain/` if next-day is confirmed, else the custom-cake pillar after the overlap test), `/buches-de-noel/` (if offered), legal (confidentialité, conditions de vente, témoins, accessibilité). EN: home, menu, order, visit. QR review card on every box (M3, M23). Runs #3–#4 | `audit.mjs` 0 failures; render-diff 0; Core Web Vitals green on home + `/carte/`; no marker left | Approve copy and prices |
| **5** · Nov 30 – Dec 6 | Holiday hours on GBP, Apple, Bing and Facebook **by Dec 1** (E9). Portion calculator if portion standards exist; `<details>` FAQ; schema graph validated; sitemap with hreflang; IndexNow; request indexing. GA4 with basic consent + `phone_click`, `directions_click`, `generate_lead`. GBP website link with UTM. EN pillar + about; ES 3 pages only if M10 is met. First 4-week comparison (runs #1–#4) | Key pages indexed in Google and Bing; key events fire only after consent | Holiday hours final |
| **6** · Dec 7–13 | GBP API Basic Access application (live site + domain mailbox; D4). Listing and link requests: Tourisme Granby région, Chambre de commerce Haute-Yamaska, Marché public, Yelp claim, Tripadvisor claim. Ordering spec frozen: processor (POS-gated), capacity per category and day, pickup windows, deposit and cancellation terms, tax classes with the accountant, CASL consent boxes (research/07, 10). Review reply log vs the 24 h rule; review count vs the trailing baseline (F5) | GBP API filed; ordering spec signed; holiday hours live everywhere | Deposit %, refund policy, tu/vous, capacity numbers |

After week 6: weeks 7–10 build the ordering engine + the 5-screen Studio while the shop is in its holiday rush. Launch in weeks 11–12 (2027-01-11 → 01-24). The weekly 1-page rhythm (v1 §9) starts after launch.

---

## 7. Search queue (not searched: cap reached)

1. Google Business Profile help: does a business-name edit trigger re-verification or suspension? (A2)
2. Apple Business: claim and verification method in Canada; Showcases and action links availability in Canada.
3. Ads inside ChatGPT and inside AI Overviews / AI Mode in Canada, Oct 2026 (research/18 #13).
4. Per-call prices: OpenAI web search, Perplexity Sonar, Gemini grounding, Claude web search, at ≈ 495 calls a week (G6).
5. Vendor pages for SerpApi, Local Falcon, AlsoAsked, Otterly.AI, Screaming Frog (D7: third-party figures only).
6. Payload GitHub discussions: official stance on JavaScript-only v3 projects (D5).
7. Google Search Central primary post on Search Console "platform properties" (2026-07-07) and its Canada rollout (D6).
8. ISED (canada.ca) primary statement of 2026-03-09 on TikTok Canada, and any challenge since (C12).
9. Google's GBP API Prerequisites page text: the 60-day rule, email-domain rule (D4).
10. CASL: is a post-pickup review request a commercial message; implied-consent window (research/07 Q10).
11. CNESST list of Québec statutory holidays 2026–2027 (E9).
12. Health Canada / MAPAQ storage guidance for cream cakes (prompt I7).
13. Manual (not searchable here): the shop's last Facebook/Instagram post date; whether @coco_vanillegranby exists.

---

## Sources

This session's searches (summaries only; pages not opened):
- Pâtisserie Cocovanille, vote page (RestoMontreal) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/vote/ — seen 2026-10-25
- Pâtisserie Cocovanille, FR page (RestoMontreal) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ — seen 2026-10-25
- 3 Best Bakeries in Granby, QC (Three Best Rated) — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-25
- Government of Canada set aside wind-up order against TikTok Technology Canada Inc. (Digital Policy Alert) — https://digitalpolicyalert.org/event/37225-government-of-canada-set-aside-wind-up-order-against-tiktok-technology-canada-inc-following-judicial-review-proceedings — seen 2026-10-25
- Issued order to wind up TikTok's operations in Canada (Digital Policy Alert) — https://digitalpolicyalert.org/event/25453-issued-order-to-wind-up-tiktoks-operations-in-canada-following-a-national-security-review-under-the-investment-canada-act — seen 2026-10-25
- TikTok reaches deal with federal government to continue operating in Canada (Mondaq) — https://www.mondaq.com/canada/social-media/1766624/tiktok-reaches-deal-with-federal-government-to-continue-operating-in-canada — seen 2026-10-25
- TikTok wins breathing space as Canada reconsiders shutdown order (Outlook Business) — https://www.outlookbusiness.com/corporate/tiktok-wins-breathing-space-as-canada-reconsiders-shutdown-order — seen 2026-10-25
- Google Search Console now tracks your Instagram, TikTok, X and YouTube performance (SEO Sherpa) — https://seosherpa.com/google-search-console-now-tracks-your-instagram-tiktok-x-and-youtube-performance/ — seen 2026-10-25
- Google Search Console platform properties (Search Atlas) — https://searchatlas.com/news/google-search-console-platform-properties/ — seen 2026-10-25
- Google Search Console platform properties: social and SEO convergence (TechWyse) — https://www.techwyse.com/news/reports-data/google-search-console-platform-properties-social-seo-convergence — seen 2026-10-25
- The Payload Config, v2 docs (Payload) — https://payloadcms.com/docs/v2/configuration/overview — seen 2026-10-25
- The Payload Config, current docs (Payload) — https://payloadcms.com/docs/configuration/overview — seen 2026-10-25
- The Payload Config, v4 docs path (Payload) — https://payloadcms.com/docs/v4/configuration/overview.md — seen 2026-10-25
- Google Business Profile APIs: Prerequisites (Google) — https://developers.google.com/my-business/content/prereqs — seen 2026-10-25
- GBP API access request: no response, quota still 0 QPM after resubmission (Google Developer forum) — https://discuss.google.dev/t/gbp-api-access-request-no-response-quota-still-0-qpm-after-resubmission/380564 — seen 2026-10-25
- Google Business Profile API in 2026: access, docs, deprecations (Slashpost) — https://slashpost.ai/blogs/google-business-profile/google-business-profile-api-documentation-2026 — seen 2026-10-25
- How to set up Google Business Profile API access (Unified.to) — https://unified.to/blog/how_to_set_up_google_business_profile_api_access_and_get_oauth_2_credentials — seen 2026-10-25
- All SerpApi plans and pricing (Costbench) — https://costbench.com/software/web-scraping/serpapi/ — seen 2026-10-25
- SerpApi free plan 2026 (Costbench) — https://costbench.com/software/web-scraping/serpapi/free-plan/ — seen 2026-10-25
- SerpApi pricing explained 2026 (apiserpent) — https://apiserpent.com/blog/serpapi-pricing-explained — seen 2026-10-25
- How much does Local Falcon cost? (Local Falcon knowledge base) — https://www.localfalcon.com/knowledge-base/kb81-how-much-does-local-falcon-cost-a-complete-guide-to-local-falcons-pricing — seen 2026-10-25
- Local Falcon pricing — https://localfalcon.com/pricing — seen 2026-10-25

Project files read (cited "via research/0X"):
- Owner plan v1 — /home/user/coco-vanille-granby/research/plan-v1-ranking-stack.md — seen 2026-10-25
- Owner plan v0a — /home/user/coco-vanille-granby/research/plan-v0a-master-plan.md — seen 2026-10-25
- Owner plan v0b — /home/user/coco-vanille-granby/research/plan-v0b-multilingual-local-domination.md — seen 2026-10-25
- Owner plan v0c — /home/user/coco-vanille-granby/research/plan-v0c-site-ux-ordering.md — seen 2026-10-25
- Owner requirements — /home/user/coco-vanille-granby/research/requirements-2026-10-25.md — seen 2026-10-25
- 01 Business facts — /home/user/coco-vanille-granby/research/01-business-facts.md — seen 2026-10-25
- 02 Customers and JTBD — /home/user/coco-vanille-granby/research/02-customers-jtbd.md — seen 2026-10-25
- 03 Competitors — /home/user/coco-vanille-granby/research/03-competitors.md — seen 2026-10-25
- 04 Keywords and demand — /home/user/coco-vanille-granby/research/04-keywords-demand.md — seen 2026-10-25
- 04 Seasonal calendar data — /home/user/coco-vanille-granby/data/seasonal-calendar.csv — seen 2026-10-25
- 05 SERP baseline (proxy) — /home/user/coco-vanille-granby/research/05-serp-baseline.md — seen 2026-10-25
- 06 SEO/AEO/GEO platform facts — /home/user/coco-vanille-granby/research/06-seo-aeo-geo-2026-verified.md — seen 2026-10-25
- 07 Québec/Canada compliance — /home/user/coco-vanille-granby/research/07-legal-quebec-compliance.md — seen 2026-10-25
- 10 Ordering architecture — /home/user/coco-vanille-granby/research/10-ordering-tech-architecture.md — seen 2026-10-25
- 16a Admin UX — /home/user/coco-vanille-granby/research/16a-admin-ux-inspiration.md — seen 2026-10-25
- 16b Admin tech — /home/user/coco-vanille-granby/research/16b-admin-tech-subdomain.md — seen 2026-10-25
- 17 VPS and domain — /home/user/coco-vanille-granby/research/17-vps-self-hosting-and-domain.md — seen 2026-10-25
- 18 Dated claims — /home/user/coco-vanille-granby/research/18-dated-claims-verification.md — seen 2026-10-25

Ranking Stack references (secondary; Morocco-oriented):
- 04 Research and the 30 prompts — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/04-research-prompts.md — seen 2026-10-25
- 06 Architecture — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/06-architecture.md — seen 2026-10-25
- 07 Local — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/07-local.md — seen 2026-10-25
- 08 AEO/GEO — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/08-aeo-geo.md — seen 2026-10-25
- 13 Operations (definition of first, capacity) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/13-operations.md — seen 2026-10-25
