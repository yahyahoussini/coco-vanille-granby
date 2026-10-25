# 00 · Master concept: the Coco Vanille web app, end to end (decision-ready) — 2026-10-25

> Synthesis of every file in `research/` and `data/` as of 2026-10-25. **0 web searches** (cap 0): every fact below carries the file it comes from. Nothing new was researched.
> Reference keys: `01 §4` = research/01-business-facts.md §4 (same pattern for 02–18) · `v1`, `v0a`, `v0b`, `v0c` = the owner's plans · `M15` = merged decision 15 in 12 §3 · `A1`, `G3`… = issue IDs in 12 §1 · `R18 #9` = claim 9 in 18 · `07 O3` = row O3 in 07 · `T2` = owner self-test T2 in 06 §4 · `G0`–`G18` = roadmap gates in §13 · `16 G1`–`G20` = Studio guardrails (16 §5) · `16 T1`–`T5` = owner ease-of-use tasks (16 §8.3) · `R1`–`R34` = risks in 15 §4 · `14 S1`… = owner questions.
> Labels: **UNVERIFIED** = carried from the source file · **[[FACT NEEDED: …]]** = only the owner or a professional can answer · **(est.)** = estimate · **(computed)** = arithmetic on sourced numbers · **(design choice)** = a choice made here, to confirm in the topic session.
> Precedence: files with a verification pass (01, 06, 07, 08, 16b, 17 'Verification log'; 02, 04 'Evidence pass'; 18 'Completion pass') win over files without one; research wins over the owner plans where they conflict (12 lists the conflicts). Every correction is in the ledger, §10.6.
> **Not done yet:** the design concept (3 directions judged) is a later topic session (§15 #4). The SERP proxy covered only **17 of 33** prompts (05). **No AI-engine baseline** was run (05). The Granby phone baseline is a **human task** (05 §9). The shop's **October 2026 operating status is unconfirmed** (01 §4).

---

## 1. Verdict

Build one French-first site, **cocovanillegranby.com**, that is both the entity home and the order desk of a downtown Granby pâtisserie-boulangerie, plus **Coco Studio** at admin.cocovanillegranby.com, a six-screen phone tool that runs the shop's day and turns the SEO/AEO/GEO machinery into three cards a week. It serves, in order, walk-in regulars (defend), parents ordering birthday cakes (wedge) and visitors in English (support); everything else waits for owner confirmation (02 §3). It can win because the local web is nearly empty, not because the shop is strong online: in the W43 proxy the answer engine found no local source on 10 of 17 prompts (05 §0.1); 31 of 33 prompts score ≥ 14/20 on weak top-10s (05 §0.5); only one rival publishes a per-portion price on its own site (Cake Design, $5/portion, 03 §0.1, §6); a Facebook snippet gives choco.vanille (Le Marmiton) « à partir de 4 $ la portion » (01 §8, unverified); no Granby rival surfaced with an English or Spanish ordering page (03 §1, inferred from snippets, UNVERIFIED); Coco Vanille is #2 on the bakery list whose #1, Pain-Pain, closed on 2026-06-16 (03 §0.4), with Google 4.9 from "40+" reviews in a mid-2026 snapshot (01 §6). The limits are internal: unconfirmed status, hours, prices and products; no owned web presence (01 §7); a new domain with zero links that will take months, not weeks (05 §5). "First" is a measurement, never a promise (v1 §2), using v1 §1's three scoreboards as amended by 12 §4 (below). Everything starts only after the week-0 go/no-go (§2).

**Definition of first (v1 §1, corrected by 12 §4; proposal until the owner signs it):**

| Scoreboard | Passes in a week when… | Corrections applied |
|---|---|---|
| Method | Frozen set = 30 prompts after the swap (12 G3) + B1–B3 as diagnostics (both spellings). Each prompt × engine runs **3 times**; a cell counts at ≥ 2 of 3 | v1 ran once a week (G6). ≈ 540 AI calls a week (computed: 30 + B1–B3 in both spellings = 36 prompts × 5 engines × 3 runs; 12 G6's 495 counts 33), cost [[FACT NEEDED]] (12 G6) |
| SEO | Our domain is #1 (or, on listicle-intent "meilleur(e)/best" prompts only, the #1 result names us first) on **≥ half** of the commercial + local prompts; top 3 on the rest. Map pack = top 3 at the shop's grid point + ≥ 50 % of a 7 × 7 grid within 3 km | v1 "≥ 10 of 20" ignored listicle intent (G1); pack undefined (G2) |
| AEO | Our passage owns the featured snippet, a PAA answer, or an **AI Overview or AI Mode** citation on **≥ a third** of prompts | French AI Overviews in Canada not found; AI Mode in French live since 2025-10-14 (06 a; G7) |
| GEO | Brand **named** on ≥ half of prompts in ≥ 2 engines, and our domain is the most-**linked bakery** domain (directories reported apart) | "Cited" and "category" were undefined (G5) |
| Hold | All three on the full set **and** on the FR subset alone, for **4 consecutive Mondays** | Cheap ES wins inflated v1's count (G4) |

---

## 2. Blockers before anything ships

Nothing in §13 starts until rows 1–4 pass (12 A1, §6 week 0). Rows 5–7 block specific builds.

| # | Blocker | What the evidence shows | What it blocks | Deadline | Default if unanswered |
|---|---|---|---|---|---|
| 1 | **Operating status** | Entity alive: annual update filed 2026-01-24 (01 §0.1) (aggregator summary, unverified, 01 §1). A RestoMontreal mid-2026 snapshot cites 2026 reviews, incl. a Jan 2026 complaint (unverified, 01 §4). RestoMontreal still shows "may be temporarily closed"; no 2026 owner post found (01 §4). A "temporarily closed" GBP would suppress map-pack visibility (inference, 01 §4) | Everything | W0 (Oct 26 – Nov 1) | **No build.** Listing fixes only |
| 2 | **NAP name spelling** | Google + mirrors: « Pâtisserie Cocovanille »; registry, Facebook, Tripadvisor, press: « Pâtisserie Coco Vanille »; MapQuest typo « Coco Vanill »; Wanderlog says Magog (01 §2). Both AI-answer mentions used « Cocovanille » (05 §0.2). Address and phone consistent: 3 rue Court, J2G 4Y6, 450-372-7177 (01 §2.2) | Schema `name`, GBP name, every listing, brand prompts | W0 | Storefront-sign photo decides (requirements; 12 A2). Rename the GBP only to match the sign (re-verification risk UNVERIFIED, 12 §7 #1) |
| 3 | **Hours** | 6 conflicting schedules; most probable recent one Thu–Fri 9:00–16:30, Sat 9:00–15:00 (4 sources, newest 2025-08-20, unverified) (01 §3). An answer engine already repeats « ouverte du mercredi au dimanche » (05 §0.3). A 3-day week = 84 pickup windows a week (computed, 10 §3.1) | GBP, Apple, Bing, site, capacity engine | W0; holiday hours on GBP/Apple/Bing/Facebook **by 2026-12-01** (12 E9) | Holding page shows phone only; no hours table |
| 4 | **GBP ownership** | GBP exists (CID 10789122976114705165, requirements); owner access, status and live review count unknown (01 §12 #1; 11 §7). The bakery's own Google account must own it (v1 L12). API access later needs the live site + a domain mailbox (12 D4) | Week-1 listing work; review replies; API filing (W6) | W0 | Recover access through Google's ownership claim (process not researched: [[FACT NEEDED]]) |
| 5 | **Products actually sold** | Evidenced: almond croissants, Paris-Brest, tarts, breads and baguettes (also frozen), strawberry shortcake, raspberry cake, vol-au-vent, coffee, ~10 seats; "custom cakes" once; "order by phone, ready next day" once (2025) (01 §5). **No evidence** of weddings, macarons, bûches, catering, delivery, gluten-free, corporate boxes (01 §5). 10 of 38 pages conditional + 2 waiting (04 §0.1); 12 of 30 prompts gated (05 §0.5) | Category sentence, page tree, prompt freeze, menu, capacity | W0. **Bûches yes/no by 2026-11-01** (05 §6; 12 B5) | Category sentence B; custom-cake pillar waits; weddings frozen (§3) |
| 6 | **POS** | Unknown. It decides Square (Web Payments SDK + Orders API → Square Order Manager) vs Stripe; printer; one order screen (10 §0, §1.3) | Payment processor, Studio printing, ordering spec | W2 (12 E10); spec frozen W6 | Stripe + Studio « Aujourd'hui » + a CloudPRNT printer (10 §1.3) |
| 7 | **VPS location** | Provider and city not given (requirements). A Québec data centre removes the main database and backups from the Loi 25 s. 17 assessment (17 §0, §7.1; 07 §2). OVH "Canada" also has a Cambridge (ON) site: pick Beauharnois explicitly (17 §7.3). Spec ≥ 4 vCPU / 8 GB / 75 GB NVMe (17 §0) | Infra (W1), ÉFVP list, launch | W0 | Move to a Québec DC before launch (one evening pre-launch, 17 §7.3) |

Also blocking (week 0, 14 BLOCKER): domain registrar and registrant (14 T2; 17 §14; 12 E13) · monthly budget ceiling (14 M1; 12 F8) · price grid, portions, lead times, next-day cut-off (14 P1, P4; 02 §10.1; 10 §14) · who serves customers in English and in Spanish (14 L1, L2) · who runs the weekly Granby phone check (14 D1; 12 E12) · refused-tactics clause signed (14 S6). Asked in week 0, due later (dates per 14 and §13): allergen list + cross-contact practice + MAPAQ permit coverage of online pickup orders (14 A1, A3: week 1; §13 W2; 07 A-2) · Instagram handle (14 T4: week 1; 01 §7) · « cueillette »/« ramassage », « acompte »/« dépôt », « tu »/« vous » (§13 W2 and backlog DES-08 say W2; 14 L3 and 15 D21 say week 6: use W2, because the W3–4 copy and session 1 need them) · unit weights in grams (14 P8: week 6) · chef photo consent (14 C1: week 3; 12 E14). Engineering gate: the half-day Payload plain-JS spike (12 D5) in W1.

---

## 3. Positioning

### 3.1 Category-sentence options (no adjectives, v1 L1)

| Option | FR | EN | ES | Competitor test (03 §7: can every competitor be named?) | Evidence fit (01 §11) | Verdict |
|---|---|---|---|---|---|---|
| v1 original | « Pâtisserie Coco Vanille est une pâtisserie de gâteaux personnalisés pour les fêtes et les mariages à Granby. » | "…a custom cake shop for birthdays and weddings in Granby, Québec." | «…pasteles personalizados para cumpleaños y bodas…» | Passes: bounded set, 5 named, 2 fully confirmed (Rose Gâteaux, Cake Design) (03 §7) | **Fails**: zero wedding evidence (01 §5) | Rejected (M15) |
| v0b | « …pâtisserie artisanale… reconnue pour ses gâteaux personnalisés, ses gâteaux de mariage et ses créations à la vanille… » | — | — | — | Adjectives; weddings and vanilla unsupported (12 A5, C15) | Rejected |
| **A** · cakes to order | « Pâtisserie Coco Vanille est une pâtisserie de gâteaux sur commande pour les anniversaires et les fêtes à Granby. » | "Pâtisserie Coco Vanille is a Granby pastry shop that makes cakes to order for birthdays and celebrations." | « Pâtisserie Coco Vanille es una pastelería de Granby que hace pasteles por encargo para cumpleaños y celebraciones. » | Passes, narrowed: Cake Design, Avec un Grand A, Rose Gâteaux, Délices Sucrés, Le Marmiton (+ IGA, Maître Glacier as the floor) (03 §7) | Partial: custom cakes once, next-day once (01 §5) | Only if custom-cake orders ≥ the owner's revenue threshold **and** capacity + lead time are known (01 §11) |
| **B** · evidence-led | « Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. » | "Pâtisserie Coco Vanille is a pastry shop and bakery in downtown Granby: viennoiseries, bread and cakes to order." | « Pâtisserie Coco Vanille es una pastelería y panadería en el centro de Granby: bollería, pan y pasteles por encargo. » | Passes, presence-based: Mont Rose (190 rue Principale, chain, 70+ reviews), Café ORÉE (142 rue Principale), La Mie Bretonne (Granby branch), Mélisse (flagged "may be temporarily closed"), Pain-Pain (closed) (03 §1). "Downtown" is verified only by rue Principale addresses | Strong: matches every evidenced product (01 §11) | **Default (M15)** |

If the owner says cakes are not made to order at all, B drops its last clause (« …viennoiseries, pains et pâtisseries. »: variant derived here from B, owner to approve).

### 3.2 Beachhead

| | Recommendation | Evidence |
|---|---|---|
| Home sentence | **B** on the home page, GBP description, bios and press kit | M15 |
| Defend first | « pâtisserie / boulangerie Granby » (X1, X2, C1, C8, L1): Coco Vanille is the incumbent; the #1 bakery slot is a closed business | 03 §5(b), §0.4; 04 §0.2–0.3 |
| Wedge | « gâteau pour demain » (L3, 19/20 prov.) **only if** next-day is confirmed with a cut-off hour | 05 §6 #1; 01 §5 |
| 12-month beachhead | « gâteaux de fête sur commande à Granby » (C2, I1, I2, I3, L2): pillar + dated price table + calculator + request flow. A becomes the pillar's own answer-block sentence once confirmed | 05 §6; 12 B1 |
| Frozen | Weddings (I5, I9, C3, C7, C9), quinceañera, free-from, corporate, macarons until confirmed | 12 §5.1 |
| Widen order (only after holding first) | the wider category → a nearby city with real delivery and local proof → a deeper ES tier | v1 §1 |

**Fallbacks:**
- **Custom cakes not confirmed or below threshold:** B stays. Beachhead = « pâtisserie-boulangerie Granby » + vitrine reservations + seasonal pre-order boxes (if seasonal products exist). The cake pillar becomes the menu-cakes catalogue `/gateaux/` (04 P21) with lead times; calculator, comparison page and quote flow wait.
- **Weddings not confirmed (expected):** no wedding page, profile or prompts; swap the 5 wedding prompts before the freeze (§10.5); « mariages » never appears in any sentence (03 §7).
- **Weddings confirmed later:** they re-enter as a widen step with the 10 §2 tasting flow (flag off today), a WeddingWire profile (03 §6) and price per portion on the first screen (v1 §14).

---

## 4. Personas → jobs → pages → primary action

Build order and evidence from 02 §2–§3. Primary actions follow v1 §7, corrected by M11 (no WhatsApp) and M24 (request before builder).

| Rank | Persona | Offer evidence (01) | Job (02, functional) | Prompts (05) | Pages (§5) | Primary action | Secondary | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | P7 Walk-in regulars | Strong | A fresh croissant and coffee without a wait; bread for the house | C1, C8, L1, X1, X2, X7 | `/`, `/nous-trouver/`, `/carte/` | « Itinéraire » | « Réserver » (vitrine, only if offered) | **Defend now** |
| 2 | P1 Parents, birthday cakes | Partial | « Un gâteau à son thème, de la bonne grosseur, prêt à l'heure » | L3, C2, I3, I1, I2, L2 | `/gateau-pour-demain/` or `/gateaux-personnalises-granby/`, `/prix/`, `/calculateur-portions-gateau/`, `/commander/` | « Demander une soumission » (interim) → « Commander » | « Appeler » | **Beachhead** |
| 3 | P4 Zoo and other visitors (EN) | Inferred | Good coffee and pastries near the day's route, fast | L5, L8 | `/en/visit/` (visitor section), `/en/menu/` | « Directions » | Pre-order for pickup (after W11–12) | Supporting; distance to the Zoo [[FACT NEEDED]] |
| 4 | P8 Gift buyers | Unknown | A local gift, reserved ahead, quick pickup | C4 (19, conditional) | `/buches-de-noel/`, `/saint-valentin/`, `/paques/` (confirmed products only) | « Précommander » | — | Conditional |
| 5 | P5 Latin-American families | Birthday partial; quince none | A large cake for many guests, ordered in Spanish | I10, C10, L10, X17, X19 | `/es/`, `/es/pedidos/`, `/es/pasteles-personalizados-granby/` | Same order form | Phone | Only if Spanish service exists (M10). 02's WhatsApp action → dropped (M11) |
| 6 | P3 Corporate | None | Right quantity at a fixed time, compliant invoice | L7 (gated) | `/boites-bureau-corporatif/` (conditional) | « Demander une soumission » | « Ajouter à ma boîte » | After ordering ships; invoice tax numbers [[FACT NEEDED]] |
| 7 | P6 Allergy families | None; legal | Know exactly what is in it and the cross-contact risk | C6 (gated + legal) | `/allergenes/` + « Contient : … » on every product | « Voir les allergènes » | « Appeler » (a human answers) | Transparency only; no free-from claim (07 A-6) |
| 8 | P2 Couples (weddings) | None | Cake that tastes right, delivered and set up on time | I5, I9, C3, C7, C9 | `/gateaux-de-mariage/` (frozen) | « Réserver une dégustation » | Quote request | **Frozen** |

Six worries every product page answers above the fold, in this order (02 §0.6, §9.1): design accuracy (photo + approval process) · lead time (a number) · price with $/portion and tax status · allergens · transport · freshness.

---

## 5. Information architecture (cocovanillegranby.com)

### 5.1 URL conflicts resolved

**Rule:** the slug set is **04 §2** (already built on v1 §6 slugs), with the overrides below. Why: 04 is the keyword-derived tree that maps every page to prompt IDs and keyword clusters; it already declared v0b/v0c's `/gateaux-personnalises/` and `/gateaux-de-fete/` superseded; v1 L9 says URLs are fixed once; 10 (ordering) uses the same `/commander/` and pillar paths. Trailing slash on every URL, ASCII French words, never a year in a slug (04 §3.2; v0c Layer 3).

| Conflict | Candidates (source) | Pick | Why |
|---|---|---|---|
| Custom-cake pillar | `/gateaux-personnalises-granby/` (v1, 04, 10) vs `/gateaux-personnalises/` (v0b, v0c, 08 move 6) | **`/gateaux-personnalises-granby/`** | 04 rule; the H1 term + city; 10 §5.2 builder notes already point to it |
| Birthday | `/gateaux-de-fete/` (v0b, v0c) vs folded into the pillar (v1 §6) vs `/gateau-de-fete-granby/` (08 P5) vs `/gateaux/anniversaire/` (08 P4) | **Folded into the pillar**; `/gateaux-de-fete/` only if the overlap test fails | v1 §6 overlap test (≥ 6 of 10 shared results → fold); 04 §2 rule |
| Order page | `/commander/` (v0b, v0c, 04, 10, 12 E1) vs `/commande/` (08 §4) | **`/commander/`** | 5 sources vs 1; v1's own event example uses it |
| Cart and resume | `/boite/` (v1 robots, 08 P16 `/boite/{token}`) vs `/panier/` (06 robots sketch) vs `/commander/reprendre/<token>/` (10 §4) | **`/boite/` and `/boite/<token>/`** (EN `/en/box/`, ES `/es/caja/`) | Matches the « Ma boîte » UX word (v0c §7) and one Disallow prefix; resume and cart share it |
| Payment step | — | **`/commander/paiement/`** (10 §1.4) | No third-party scripts on it (SAQ A); noindex |
| Allergies | `/sans-gluten-allergies/` (v0b, v0c, v1, 04 P12) vs `/allergenes/` (02 P6, 12 B2) | **`/allergenes/`** (EN `/en/allergens/`, ES `/es/alergenos/`: new slugs, design choice) | A « sans gluten » URL is itself advertising that implies a regulated claim (07 A-6) |
| Christmas | `/buches-de-noel/` (v0b, v0c, v1, 04, seasonal CSV) vs `/noel/buches/` (08 P3); ES `/es/troncos-de-navidad/` (v0b) vs `/es/tronco-de-navidad/` (04) | **`/buches-de-noel/`**, ES **`/es/tronco-de-navidad/`** | 04 rule; evergreen URL already in the calendar |
| Corporate | `/corporatif/` (v0c) vs `/boites-corporatives/` (02) vs `/boites-bureau-corporatif/` (04 P14) | **`/boites-bureau-corporatif/`**, EN `/en/corporate/` | 04 rule (keyword cluster L7) |
| Visitors | `/en/visit/` as the visitor page (02 P4) vs a separate `/en-visite-a-granby/` + `/en/visiting-granby/` (04 P16, v1 §14) | **One page at launch** (`/nous-trouver/` + `/en/visit/`) with a Zoo/visitor section; P16 only when the distance and a visitor offer exist | One query, one page (04 §2); avoids a thin twin |
| Menu | `/carte/` (12 E1, v0c `hasMenu`) missing from 04 | **`/carte/`** (EN `/en/menu/`) as the hub; category pages stay flat at root (`/viennoiseries/`, `/pains-baguettes/`) | 12 E1 + 04 P18–P21 |
| Product pages | not defined in any file | **`/<category>/<product>/`**, e.g. `/viennoiseries/croissant-aux-amandes/` | Design choice; one indexable page per product (08 move 3) |
| Builder | `/createur/…` (v0c, 10) | **`/createur/`** steps noindex, crawlable, out of sitemap; designs `/createur/d/<shortId>/` noindex | 12 C21: a disallowed URL can't show its noindex |
| Studio paths | `/studio/` (v0a, v1 robots) | **None on the public host** (404 for `/admin`, `/studio`, `/api`) | M7; 16b §2 |
| Review QR | — | **`/avis`** → 302 to the GBP review link (target editable in Studio) | 11 §4.2 |

robots.txt on the public host: generated from the 06 (n) crawler table (search, user-fetch and, by owner choice, training tokens allowed); `Disallow: /boite/`, `/en/box/`, `/es/caja/`, `/compte/`, `/recherche`, `/svc/`; no `/studio/` or `/api/` lines (12 C7); `Content-Signal` line optional with zero expected effect (06 i); `Sitemap: https://cocovanillegranby.com/sitemap.xml`.

### 5.2 The merged page tree

Languages: FR 100 %; EN for home, menu, order, visit, about, pillar; ES 3–5 pages **only if someone answers in Spanish** (M10). hreflang = the reciprocal set of equivalents that exist + `x-default` → FR (M9). Schema: one site graph (Bakery + WebSite, + Person only with consent) on every page, plus the page node listed (v1 L8).

| # | Page | FR | EN | ES | Status · wave | Target prompts / keywords | Page schema | Primary action |
|---|---|---|---|---|---|---|---|---|
| 1 | Home | `/` | `/en/` | `/es/` (M10) | Core · W3–4 | X1, X2, C1, C8, C10, B1–B3 | WebPage | « Itinéraire » / « Commander » |
| 2 | Menu hub | `/carte/` | `/en/menu/` | — | Core · W3–4 | X1, X2, X7, X8, X9, X10, L6 (gated) | WebPage + BreadcrumbList | « Commander » |
| 3 | Order | `/commander/` | `/en/order/` | `/es/pedidos/` (M10) | Core · W3–4 interim form → W11–12 engine | L2, L9 | WebPage | « Envoyer ma demande » → « Commander » |
| 4 | Visit (+ visitor section) | `/nous-trouver/` | `/en/visit/` | `/es/como-llegar/` (M10) | Core · W3–4 | L1, L4 (gated hours), L5, L8, B2 | WebPage + BreadcrumbList | « Itinéraire » |
| 5 | About + facts box | `/a-propos/` | `/en/about/` | `/es/nosotros/` (opt.) | Core · W3–4 (EN W5) | B1, B3 | WebPage | « Appeler » |
| 6 | Chef | `/a-propos/chef/` | `/en/about/chef/` | — | **Conditional** (photo consent, 12 E14) | B3 | WebPage + Person | — |
| 7 | Prices | `/prix/` | `/en/prices/` | `/es/precios/` | **Conditional** (price grid exists) · W3–4 | I1, I8 | WebPage + BreadcrumbList | « Demander une soumission » |
| 8a | Cake for tomorrow | `/gateau-pour-demain/` | `/en/cake-for-tomorrow/` | — | **Conditional** (next-day + cut-off confirmed) · W3–4 | L3, I2 | WebPage + Product/Offer | « Commander pour demain » |
| 8b | Custom-cake pillar | `/gateaux-personnalises-granby/` | `/en/custom-cakes-granby/` | `/es/pasteles-personalizados-granby/` (M10) | Core if custom cakes confirmed · W3–4 (else 8a first) · EN W5 | C2, X3, X4, X5, I1, I2, L10, X17, X19 | WebPage + BreadcrumbList (+ Product/Offer per size) | « Demander une soumission » (« Créer mon gâteau » only once the builder exists) |
| 9 | Bûches | `/buches-de-noel/` | `/en/yule-logs/` | `/es/tronco-de-navidad/` | **Conditional** (bûches by 2026-11-01) · 2026 on the holding page (W1), full page 2027 | C4 | WebPage + Product/Offer (BackOrder + date if sold before; PreOrder if never sold) | « Précommander » |
| 10 | Allergens | `/allergenes/` | `/en/allergens/` | `/es/alergenos/` | Core · W3–4 | C6 replaced; 02 objection #9 | WebPage | « Appeler » |
| 11 | Legal ×4 | `/confidentialite/`, `/conditions-de-vente/`, `/temoins/`, `/accessibilite/` | Translations with the "French prevails" clause (07 S15); slugs set in the legal session | Same, if ES checkout | Core · W3–4 | — | WebPage | — |
| 12 | FAQ | `/faq/` | `/en/faq/` | `/es/preguntas-frecuentes/` | Core · W5 | Overflow questions (02 §5) | WebPage (FAQPage optional, never a gate: M17) | — |
| 13 | Portion calculator | `/calculateur-portions-gateau/` | `/en/cake-serving-calculator/` | `/es/calculadora-porciones-pastel/` | **Conditional** (portion standards) · W5 | I3, X13, X14 | WebPage | « Demander une soumission » |
| 14 | Viennoiseries | `/viennoiseries/` | `/en/viennoiseries/` | — | Core · W7–10 if capacity, else W13–14 | X7, X8, L6 (chocolatines gated) | WebPage + BreadcrumbList | « Commander » |
| 15 | Bread | `/pains-baguettes/` | `/en/bread/` | `/es/panaderia/` | Core · same as 14 | X2 | WebPage + BreadcrumbList | « Commander » |
| 16 | Product pages | `/<category>/<product>/` | `/en/<category>/<product>/` | — | Core · with the engine W11–12 | X8, X9, X10 | Product + Offer (06 k states) | « Ajouter à ma boîte » |
| 17 | Menu cakes | `/gateaux/` | `/en/cakes/` | `/es/pasteles/` | v2 (04 P21); **fallback beachhead page** if custom cakes are not confirmed | C2, X3 | WebPage + BreadcrumbList | « Commander » |
| 18 | Pastries | `/patisseries/` | `/en/pastries/` | `/es/postres/` | v2 (04 P20) | X6, X9 | WebPage + BreadcrumbList | « Commander » |
| 19 | Transport + storage | `/transporter-conserver-gateau/` | `/en/cake-transport-storage/` | `/es/transportar-conservar-pastel/` | v1 rhythm W13+ | I4, I7 (food-safety source [[FACT NEEDED]]) | Article | — |
| 20 | Birthday cakes | `/gateaux-de-fete/` | `/en/birthday-cakes/` | — | **Conditional** (overlap test < 6/10) | C2, X3 | WebPage | « Demander une soumission » |
| 21 | Kids' cakes | `/gateaux-enfants/` | `/en/kids-birthday-cakes/` | section of 8b | **Conditional** (themed kids' cakes confirmed) | — | WebPage | Same |
| 22 | Seasons hub | `/saisons/` | `/en/seasons/` | `/es/temporadas/` | v1 rhythm (04 P32) | Fête nationale, Halloween as sections | WebPage | — |
| 23 | Seasonal pages | `/saint-valentin/` (by 2026-12-20), `/paques/` (by 2027-01-31), `/fete-des-meres/` (by 2027-03-14), `/galette-des-rois/`, `/temps-des-sucres/`, `/fete-des-peres/` | Mirrored | Mirrored where the ES lane exists | **Conditional** per product; dates from 04 §6.2 | Seasonal | WebPage + Product/Offer | « Précommander » |
| 24 | Visiting Granby | `/en-visite-a-granby/` | `/en/visiting-granby/` | `/es/visita-granby/` | **Conditional** (distance, visitor offer) | L5, L8 | WebPage | « Itinéraire » |
| 25 | Flavour of the week | `/saveur-de-la-semaine/` + dated archive | Mirrored | — | **Conditional** (a weekly rotation exists [[FACT NEEDED]]) | brand freshness (08 P8) | WebPage | « Réserver » |
| 26 | Comparison | `/comparatif-gateau-de-fete-granby/` | `/en/birthday-cake-options-granby/` | — | Deferred: after launch + legal check (12 §5.1) | C1, C2 | Article | — |
| 27 | Corporate | `/boites-bureau-corporatif/` | `/en/corporate/` | — | **Conditional** | L7 | WebPage | « Demander une soumission » |
| 28 | Weddings | `/gateaux-de-mariage/` | `/en/wedding-cakes/` | `/es/pasteles-de-boda/` | **Frozen** | I5, I9, C3, C7, C9 | WebPage | « Réserver une dégustation » |
| 29 | Macarons, gift boxes + gift card, ready meals, pies | `/macarons/`, `/boites-cadeaux/`, `/carte-cadeau/`, `/traiteur-pret-a-manger/`, `/tartes-desserts-quebecois/` | Mirrored (04) | Partly | **Conditional**; gift cards after the engine (12 E4) | C5, X10 | WebPage (+ Product/Offer) | « Commander » |
| 30 | Glossary | `/journal/glossaire-patisserie/` | `/en/journal/pastry-glossary/` | `/es/blog/glosario-pasteleria/` | v2 | I6 | Article | — |
| 31 | Quinceañera | — | — | `/es/quinceanera/` | **Frozen** | I10 | WebPage | — |

Not indexed: `/boite/`, `/boite/<token>/`, `/commander/paiement/`, `/createur/…`, `/compte/`, `/recherche`, `/avis`, `/svc/*`. Dropped or deferred from v0c §4: `/vrais-mariages/`, `/ateliers/`, `/emplois/`, `/presse/`, `/galerie/` (needs real dated photos and the uniqueness test, v1 L19), `/liens/` (optional), `/journal/tout-sur-la-vanille/` (unsupported brand claim, 12 A5).

---

## 6. Signature features (40 scored)

Scores are **(est.)** judgments built on the cited evidence: SEO/AEO/GEO value, conversion and delight 1–5; effort S/M/L; legal risk Low/Med/High with the rule. **MVP-C** = content site W3–6 · **MVP-O** = ordering launch W11–12 · **v2** = after launch · **Gated** = waits on an owner fact or counsel.

| # | Feature | Source | SEO | Conv | Delight | Effort | Legal risk | Set |
|---|---|---|---|---|---|---|---|---|
| F01 | **One hours record** → site, `openingHoursSpecification`, GBP, Apple, Bing; "Ouvert maintenant" computed, never typed | 02 §9.5; 16 §3.6 | 5 | 4 | 3 | M | Low | MVP-C (site) · MVP-O (Studio push) |
| F02 | **Answer block + key-facts block** (5 dated, brand-named facts) on every core page | v1 §7 | 5 | 3 | 2 | S | Med: no superlatives as facts (07 K-5) | MVP-C |
| F03 | **`/carte/` HTML menu**: prices, portions, allergens, « vitrine du jour » block | 12 E1 | 5 | 4 | 3 | M | Med: allergen accuracy | MVP-C |
| F04 | **Dated price table** with a $/portion column | v1 §6; 03 §6; 02 §7 | 5 | 4 | 3 | S | Med: all-in price (07 C-9) | MVP-C · Gated (grid) |
| F05 | **Portion calculator**, server-rendered, inches + cm, works without JS | v1 §6; 05 I3 | 5 | 4 | 4 | M | Low | MVP-C · Gated (standards) |
| F06 | **« Prête dès … »** earliest pickup computed on every card | 08 move 1, P1; 10 §3 | 3 | 5 | 4 | M | Low | MVP-O |
| F07 | **Interim request form** with labelled fields + payment link (Noël 2026 bridge) | 12 §6; 10 §13 D | 2 | 5 | 3 | S | Med: distance-contract disclosures (07 C-2) | MVP-C |
| F08 | **Design-accuracy loop**: written recap + reference photo + approval before production | 02 §9.4; 12 E11 | 2 | 4 | 5 | S | Low | MVP-C |
| F09 | **Smart click & collect**: capacity per category × day, 15-min windows, product-first and date-first modes | v0c §6; 10 §3 | 2 | 5 | 4 | L | Low | MVP-O |
| F10 | **Evergreen seasonal URLs** with a state machine (Bientôt → Précommandes ouvertes → Complet → « De retour en … ») + BackOrder/PreOrder with a visible date | 08 P3; 06 k | 5 | 4 | 3 | M | Low | MVP-O |
| F11 | **Fair drops + honest scarcity**: 10-min hold, real remaining count, "no data → no claim" | 08 move 5; 02 §7 `slotLabel` | 2 | 4 | 4 | M | Med: fake urgency is misleading (02 §8) — designed out | MVP-O |
| F12 | **Guest checkout**; passkey or magic link offered after payment | 08 P15; v0c §6 | 1 | 5 | 4 | S | Low | MVP-O |
| F13 | **Instagram/Facebook in-app browser hand-off** (`/boite/<token>/`, card inline) | 08 §0.5, move 7; 10 §4 | 1 | 5 | 3 | M | Low | MVP-O |
| F14 | **All-in total with taxes** on the product and a full review step before payment | 08 move 2; 07 O1 | 2 | 5 | 3 | M | High if wrong (07 C-9, K-1, §6) | MVP-O |
| F15 | **Confirmation = contract copy** (French first) + .ics + 4-digit code + QR | 07 O6; 10 §4 | 1 | 3 | 4 | S | Med: Charter s. 55 (07 F-3) | MVP-O |
| F16 | **« Prête » SMS** in one GSM-7 segment with sender + STOP | 10 §6 | 1 | 3 | 5 | S | Med: CASL ID/unsubscribe (07 E-2) | MVP-O |
| F17 | **QR review card in every box** → `/avis` | 11 §4.2; M23 | 4 | 2 | 2 | S | Low | MVP-C |
| F18 | **Review replies drafted in the reviewer's language**, names stripped, owner approves, 24 h timer | 11 §4.5; 16 §3.5 | 4 | 3 | 3 | S | Med: Claude API = ÉFVP (07 §2) | MVP-O (GBP app before) |
| F19 | **Vitrine du jour**: daily photo → site block; GBP post + IG Story drafts | v0c §5; 16a move 8 | 4 | 4 | 5 | M | Low | MVP-O (block) · v2 (drafts) |
| F20 | **« Épuisé » in 2 taps** → `SoldOut` on page and schema; auto-reset | 16 §3.3; 06 k | 3 | 4 | 3 | S | Low | MVP-O |
| F21 | **One-button « Fermeture exceptionnelle »**: banner FR/EN/ES, pause, GBP special hours, texts, auto-revert | 16a move 4; 16 §6.2 | 4 | 3 | 4 | M | Med: never move a confirmed order alone (07 O7) | MVP-O |
| F22 | **Request → price → deposit link in < 1 min** | 16a move 5; M24 | 2 | 5 | 4 | M | Med: deposit terms (07 C-13) | MVP-O |
| F23 | **Cake builder** (2.5D SVG, live price + earliest date, indexable twin) | v0c §6; 08 move 6; 10 §5 | 3 | 4 | 5 | L | Med: price display, « aperçu indicatif » | v2: after 3 months of request data (M24) |
| F24 | **Allergen data model** + « Contient : … » block + human verification stamp + `/allergenes/` | 12 §5.2; 07 A-3 | 3 | 3 | 3 | M | High: safety; free-from claims banned (07 A-6) | MVP-C |
| F25 | **GBP Food Ordering custom link** → `/commander/`, preferred for pickup | 06 d | 4 | 5 | 2 | S | Low | MVP-O · Gated (T2) |
| F26 | **Apple Business "Commander" action** + one Showcase per season | 06 c; 11 §1.1 | 4 | 4 | 2 | S | Low | MVP-C (claim W1; action once `/commander/` is live, W3–4) |
| F27 | **Merchant Center free local listings** (pickup today / later), 5-product test | 06 q; 10 §8.1 | 4 | 3 | 1 | M | Low (perishables rule not found) | v2 |
| F28 | **« Coco Vanille en bref »** facts box on `/a-propos/`; llms.txt from the same data, optional | v0c §4; 08 move 13; M16 | 4 | 1 | 1 | S | Low | MVP-C (box) · v2 (llms.txt) |
| F29 | **Comparison page** by category of option (supermarket, ice-cream cake, artisan, home baker) | v1 §6; 02 §9.10 | 4 | 3 | 3 | M | High: Competition Act / LPC review (03 §6) | v2 + counsel |
| F30 | **Q1 2027 data study** « Prix des gâteaux de fête à Granby » | v1 §8; 11 §2; 03 §2b | 5 | 2 | 2 | M | Med: dated price claims | W10–18 |
| F31 | **« Ce qu'on a mesuré »** own-data passages | v1 §7 | 4 | 2 | 2 | S | Low | v2 (needs ≥ 30 orders, 02 §9.7) |
| F32 | **Saveur de la semaine** stable URL + dated archive + GBP post | 08 P8, move 12 | 4 | 3 | 4 | S | Low | Gated (weekly rotation) |
| F33 | **Transport + storage guides** with the shop's own method + videos | 04 P15; 11 §5 #5–6 | 4 | 2 | 3 | S | Med: food-safety source (05 I7) | v2 |
| F34 | **« Comment avez-vous entendu parler de nous ? »** at checkout | v0a §7.4 | 1 | 1 | 1 | S | Low (state the purpose, Loi 25) | MVP-O |
| F35 | **Corporate one-tap reorder + invoice** | 02 P3 | 1 | 4 | 3 | M | Med: invoice tax numbers | Gated (corporate) |
| F36 | **Wedding tasting booking** → contract → deposit locks the date | v0c §6; 10 §2 (flag off) | 3 | 4 | 4 | M | Med: deposits | Gated (frozen) |
| F37 | **Gift cards**: no expiry, no fees, no GST at sale | 07 C-11, T-4 | 2 | 3 | 3 | M | Med: LPC prepaid rules | After the engine (12 E4) |
| F38 | **Consented birthday reminder** next year | 02 P1; 07 O10 | 1 | 4 | 4 | S | Med: CASL express consent (07 E-3) | v2 |
| F39 | **Poster-first macro hero** + « la coupe » CSS reveal; video loop after load | v0c §7; 08 P10–P11, move 10 | 3 | 3 | 5 | M | Low (no unconfirmed claims in copy, 12 A5) | MVP-C (still) · v2 (video) |
| F40 | **Language switcher to the equivalent page**, no auto-redirect, FR parity guard | v0b A3; 07 S1–S3 | 4 | 3 | 3 | S | High if wrong (Charter s. 52, 07 F-1–F-2) | MVP-C |

Dropped for year 1, not scored (12 §5.1): Club Coco wallet card, AR preview, « Demande à Coco » assistant, ateliers, « Fête parfaite » kits, subscriptions. Untested idea kept on file: an end-of-day anti-waste basket (v0c §5).

**MVP-C (W3–6):** F01 (site), F02, F03, F04*, F05*, F07, F08, F17, F24, F26, F28 (box), F39 (still), F40. **MVP-O (W11–12):** F06, F09, F10, F11, F12, F13, F14, F15, F16, F18, F19 (block), F20, F21, F22, F25*, F34. (* = gated on an owner fact.)

---

## 7. Ordering flows end to end

Engine: our own, on Payload/Postgres on the VPS, system of record for web orders; payments, SMS and email bought (10 §0, §13 option A). Noël 2026 runs on the **bridge** (option D: request form + payment links + GBP/Facebook), because the engine launches in W11–12 = 2027-01-11 → 01-24 (M20). First season on the engine: Saint-Valentin 2027 (Sun 14 Feb), then Pâques (Sun 28 Mar 2027) in date-first mode (10 §13).

| Flow | Pages | Customer steps | Payment | Capacity rule | Availability state (06 k) | Studio | Status |
|---|---|---|---|---|---|---|---|
| **Vitrine / ready-made** | `/carte/`, product pages | Sees today's items with « Prête dès … »; reserves for a window today or tomorrow | Full at order | `DailyStock.planned` minus reservations (10 §2) | `InStock` / `SoldOut` (daily); not in the v1 feed (10 §8.1) | « Épuisé » 2 taps, photo of the day (16 §3.3) | MVP-O **only if the owner wants vitrine reservations** (02 P7) |
| **Menu items with lead time** (product-first) | product pages, `/boite/` | Adds to « Ma boîte »; the calendar offers only dates that work for the whole box; picks a 15-min window | Full at order | Units per production category × production day; cut-off placeholder « avant 14 h pour demain »; hold 10 min (10 §3.1) | `InStock` | Commandes, production sheet at cut-off + 5 min (10 §7) | MVP-O |
| **Pre-order box / season** (date-first) | `/buches-de-noel/`, `/saint-valentin/`, `/paques/` | Picks the pickup day first, then sees only what that day can still produce | Full at order; conditions say when payment is taken (07 O14) | `Season` window opens and closes by date; `capacityOverrides`; special days (Dec 24, 26–31, the Saturdays before Easter and Fête des mères) (10 §3.4) | Returning item → **`BackOrder` + date**; never-sold item → **`PreOrder` + date**, both visible on the page (M21) | Season activation; load test before each opening (10 §13) | MVP-O (Saint-Valentin 2027) |
| **Holiday caps** | same | « Complet ce jour-là. Prochaine date : … » | — | Per-window max + per-category day cap; statutory holidays pre-loaded « à confirmer » until the owner taps (10 §3.4; 16 G18) | `SoldOut` when the season is full | Holiday planner card at J-30 (16 §4.4) | MVP-O |
| **Custom cake: request → quote → deposit** | pillar / cake page, `/commander/` | Sends photos, guest count, date, message; gets a price within 24 h; quote valid 72 h (placeholder); pays the deposit by link; approves the written recap with the reference photo | **Deposit as its own charge**, balance at pickup by link or POS; no card holds (Stripe holds ≈ 7 days) (10 §1.2) | An open quote puts a tentative hold on its date's pool; released on expiry (10 §5.2) | — (not a feed item) | Demandes: price + deposit in 3 taps / 60 s (16 §1.2) | MVP-O; interim version by form + payment link from W3–4 |
| **Custom cake: builder** | `/createur/` (noindex) + indexable pillar | 10 steps, live price range, earliest date; simple builds pay a deposit, complex ones become a quote (10 §5.2) | Deposit | Same pools | — | Same as above | v2, after 3 months of request data (M24) |
| **Wedding tasting** | `/gateaux-de-mariage/` | Tasting booked → reminder → proposal → deposit locks the date → final-count reminder (10 §2) | Deposit | Weekly wedding capacity [[FACT NEEDED]] | — | `TastingBooking` flag | **Frozen** (feature flag off) |
| **Corporate** | `/boites-bureau-corporatif/` | Request → quote → purchase order → pickup → invoice → payment (10 §2) | Invoice [[FACT NEEDED: terms]] | Same pools | — | Demandes | Gated |
| **Phone orders** | — | Staff enter them in Studio on the same pools; drafts allowed offline, slot checked on sync (16 §3.0) | At counter or link | Same pools | — | « Commande au téléphone » ≤ 8 taps (16 §1.2) | MVP-O |

**Checkout contract (07 §4 O1–O14, 10 §4), every flow:**
- Review step before payment: items, options, pickup date + window, address, subtotal, **TPS and TVQ lines** (shown even at 0,00 $), total, deposit vs balance, cancellation summary, conditions link; every line editable (07 O1).
- One **unticked** box « J'ai lu et j'accepte les Conditions de vente. » + the amount on the button « Confirmer et payer 48,00 $ » (07 O2). On `/en/` and `/es/`: French conditions first, then an explicit binding-language box (counsel decides if needed, 07 O3, F-4).
- **No fee lines** (service, box, card), same price for every payment method, **no tip prompt** online (07 O4, O5, C-10).
- Hosted payment fields (Stripe Payment Element / Square iframes) for **SAQ A**; `/commander/paiement/` runs no GTM, pixels or chat (10 §1.4). Only the processor's webhook marks an order paid; nightly reconciliation (10 §4).
- Confirmation email = contract copy, French first, sent immediately (07 O6). The bakery **never moves a confirmed date alone**; if it can't fulfil: new slot chosen by the customer or full refund within 15 days, timer in Studio (07 O7, C-6, A9).
- Deposit copy: « Acompte : 40,00 $ aujourd'hui · Solde : 85,00 $ au ramassage » with the refund rule next to the button (07 O8; counsel writes it).
- Allergy note optional, kept 30 days after pickup (est.), never copied into email, SMS or AI prompts (07 O9).
- Marketing consents: separate unticked boxes for seasonal emails, the birthday reminder and the review email (07 O10).
- Taxes from the effective-dated engine; a product with class `ask` **cannot be sold online** (07 O13).

**Tax decision table:** 07 §6, rows 1–13 (accountant signs every row). Since **2026-07-15** the QST zero-rates single-serving sweet baked goods (< 230 g or packs of fewer than six) while the GST still applies to them; bread and plain croissants stay zero-rated (07 T-1, T-3). Revenu Québec's 2026-08-07 « Précisions » must be read first (07 §0.1). **Launch rule: pickup only, no delivery fee, no café items online** until rows 7–13 are signed (07 §6).

**Notifications (10 §6):** order confirmation, quote/deposit, day-before reminder, « prête », not picked up, bakery can't fulfil = transactional (sender + STOP). Review request = QR card in the box; email only if the box was ticked (M23). Birthday reminder and seasonal alerts = commercial, express consent. French SMS templates stay in GSM-7 (no « n° », « prête », guillemets): one segment each, tested in CI (10 §6).

---

## 8. Coco Studio (admin.cocovanillegranby.com), from 16

| Layer | What it is | Who / device | MVP (W11–12) |
|---|---|---|---|
| **Daily** | 6 screens: **Aujourd'hui · Commandes · Vitrine · Demandes · Avis · Boutique & heures**. Comptoir bar: Aujourd'hui · Commandes · Vitrine · Plus. Owner bar: Aujourd'hui · Commandes · Demandes · Avis · Plus | Owner (phone), counter staff (tablet or phones), French first | All 6; phone orders; production sheet + print/PDF; « Fermeture »; holiday planner; owner refund with passkey step-up |
| **Weekly** | « Cette semaine »: 5 numbers (online orders, requests, reviews, calls + directions, « Cité par l'IA » x/30) + ≤ 3 cards + Système tile; same content in the Monday email | Owner, 5 min on Monday | Yes, built from `weekly.mjs`, no AI summary |
| **Agency** | Gates, Scoreboard, Recherche, Visibilité IA, Mentions, Analytique, Intégrations, Conformité, Système | Agency, desktop; no customer names or phones by default | Read-only Gates + Scoreboard from report files, Intégrations, Système; the rest in v1.1 |
| **Avancé** | Payload admin at `/admin` (products, pages, FAQ, translations, seasons, capacity rules, templates, users, audit log) | Owner, agency | Yes |

12 M18 named "5 screens"; 16 splits Commandes and Demandes and adds Vitrine, same jobs: 16 wins as the newer, detailed spec. Of 41 plan modules, 13 are cut or deferred, 8 move to the agency layer (16 §2.3). **Before W11 there is no Studio**: the owner replies to reviews in Google's own app and sends facts by phone or email; holiday orders run on the bridge (12 F11; 16 §8.1). Studio must work **without the GBP API** (Google changes become manual tasks) (12 D4; 16 AC15).

**Why it is easy (16, 16a):**
1. Opens on today's pickups, the next order's button is the only big one (16a move 1).
2. One primary action per screen; instant apply + « Annuler » for ≥ 5 s instead of confirm dialogs; side effects (texto, Google change) leave only after the undo window (16 §3.0).
3. Targets ≥ 48 px, primary buttons ≥ 64 px for floury hands (a design choice to test in the shop, 16a §0.4).
4. Offline outbox: taps queued and replayed; customer SMS only after the server confirms (16a §0.5).
5. 4 urgent alert types only; everything else in a digest (16 §6.1).
6. Passkey for the owner, PIN switch per person on a shared tablet, every change in the audit log (16 §7).
7. Guardrails 16 G1–G20 make the wrong thing impossible: French parity, [[FACT NEEDED]] guard, human-verified allergens, no free-from text, GBP name lock, one open-ended review request per order, schema only from visible values, AI never publishes, tax class `ask` blocks online sale, no per-staff review numbers (16 §5).
8. Time budgets: owner ≤ 10 min per open day, ≤ 3 min per closed day, + 5 min Monday; staff ≤ 5 min per shift (targets, 16 §1.3). A job over budget for 2 weeks goes on the agency's fix list.
9. Acceptance: owner tasks T1–T5 pass 5/5 unaided (sold out 15 s, « prête » 10 s, quote + deposit 90 s, storm closure 60 s, review reply 45 s) + staff test 16a T1 (16 §8.3).

Open conflict for session 1: the **Presence Health Score**. 12 G9 says drop it (arbitrary weights hide what moved); 16 §4.6 keeps it, shown only after 4 weekly baselines with a « Mesure partielle » label. Proposal: v1.1 only, never a replacement for the three scoreboards or the orders/leads numbers.

---

## 9. Design direction

| Source | What it proposes |
|---|---|
| v0c §7 | Three directions: **A « Atelier Vanille »** (Parisian editorial minimal), **B « Coco Joyeux »** (playful), **C « Maison des Cantons »** (warm, local). Recommends A as the base with B in the builder, birthday pages and microcopy. Starter system: Crème vanille #F7F0E3, Coco #FFFCF6, Gousse #2E211A (text), Caramel #C8915A, Framboise #B8435A (CTAs), Pistache #B9C99A; Fraunces + Inter or DM Sans, self-hosted; vanilla-speckle texture; "whipped cream" easing 250–450 ms; photo spec (window light, 45° and top-down, a cross-section of every cake, 4:5 / 3:2 / 1:1). Hero: 6 s cut-cake loop, poster = LCP, live « Ouvert » pill, [Commander pour demain] [Créer mon gâteau]. Interactions: la coupe, interactive vitrine hotspots, « Ma boîte », portion slider, live message preview, View Transitions, cut-off countdown. Sticky bottom bar Commander · Itinéraire · Appeler; day chips, never a tiny calendar; WCAG 2.2 AA, Lighthouse mobile ≥ 95 |
| v1 Layer 3 | AVIF hero ≤ 200 KB with `fetchpriority="high"`; video only after interaction; 2 variable font files, subset, `font-display: swap`; static map image linking to Google Maps; YouTube behind a click-to-load facade; space reserved for the consent banner; CSS logical properties |
| 08 adds | **A base + B + C as a content layer, not a skin** (Granby storytelling, local illustrations on `/a-propos/`, dated vitrine photos) (08 §6). Trend evidence is opinion: choose on brand fit and the owner's Instagram (08 §5). Poster-first video confirmed by web.dev + Chrome 116 (08 §0.6). Scroll-driven animations and cross-document View Transitions are enhancement only (Firefox gaps, 08 §0.7). In-app browsers break wallets (08 §0.5). 17 patterns with SEO-safe versions and 14 "do better" moves (08 §3, §7). Corrected benchmarks: Faure left his house (2020) (08: partial, not re-checked); Rhubarbe now runs online orders with Saturday pickup (08 §9) |
| Corrections | « La vraie vanille, depuis [année] », « Fait ici chaque matin » (and 08's « Fait ici ce matin » trust strip) and a vanilla brand pillar stay out until the owner confirms each claim (12 A5). Fraunces's "Soft" axis is unverified: check the font file (08 §5). GSAP is free for commercial use under Webflow's licence (R18 #6). v0c's contrast ratios are its own figures: re-check with tooling |

**Open decisions for the design session (§15 #4):** judge the three directions (not done yet) against the owner's Instagram (handle unconfirmed) and logo (not seen) · palette vs logo, contrast checked · type pair and the variable axes actually present · photo shoot plan (half-day in W2, confirmed products only, 12 E5) · hero: still first, video later? · motion level and `prefers-reduced-motion` behaviour · the « Ma boîte » metaphor · « tu » or « vous » (v0c says decide from the Instagram tone) · illustration style for the C layer · seasonal skin or not · whether Studio shares the public design tokens (16 §3.0 sets its own targets) · accessibility gate (axe in CI, 12 E6).

---

## 10. SEO / AEO / GEO system

### 10.1 Page contract (every indexable page)

| Part | Rule | Source |
|---|---|---|
| Head | `lang` fr-CA / en-CA / es · title < 60 characters, customer word first, brand last · meta description 140–160 characters that states the answer · self canonical · hreflang for existing equivalents + `x-default` → FR · robots `max-snippet:-1, max-image-preview:large` · OG 1200×630 · one `@graph` | v1 L2; M9 |
| Server HTML | Prices, hours, vitrine, FAQ (`<details>`), allergens, lead times in the raw HTML; render-diff = 0 | v1 L4; 06 practice 1 |
| Snippet controls | No `nosnippet` or low `max-snippet` on citable pages; `data-nosnippet` only on the consent banner and legal boilerplate | 06 (m) |
| Answer block | 40–60 words: brand + service + customer + place + one dated number; H1 term once, one synonym once | v1 §7; 04 §3.2 |
| Key facts | 5 dated facts, brand named in each | v1 §7 |
| FAQ | 5–8 real objections from the 02 §5 bank; one in Granby phrasing (« C'est-tu possible d'avoir un gâteau pour demain? »), answer in standard French | v1 §7; 04 §3.2 |
| Action | One primary action per page type (§4) | v1 L10 |
| Trust | Author with bio link; published + updated dates; one-line change note | v1 §7 |
| Prices | As text, all-in before taxes, « taxes en sus, s'il y a lieu »; never « prix sur demande » | 07 S11; v1 §14 |
| Claims | No superlatives as facts (« Comment choisir une pâtisserie à Granby », not « la meilleure »); no free-from words | 07 S10, S12 |
| Vocabulary | « gâteau de fête » in H1, « anniversaire » in body and meta; « chocolatine »; 8 po + cm; 14 h; ES H1 « Pasteles y tortas… », never « torta » alone; EN titles say "Granby, Québec" | 04 §3; 05 §0.7 |
| Guard | Publish blocked on: missing or thinner FR version, any [[FACT NEEDED]], unverified allergens, free-from text, placeholders | v1 §10; 16 G1–G4 |
| CI (`npm run gate`) | audit · links · images · render-diff · schema · hreflang (existing-equivalents rule) · axe; Core Web Vitals p75 LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | v1 §12; 12 E6; 06 (p) |

### 10.2 Entity graph

| Node / field | Value | Source / status |
|---|---|---|
| `Bakery` `@id` | `https://cocovanillegranby.com/#patisserie`, same on every language page | v0b A3; requirements (domain) |
| `name` | The storefront-sign spelling [[FACT NEEDED]]; draft « Pâtisserie Coco Vanille » | 01 §2.3; 12 A2 |
| `alternateName` | The other spelling only (« Pâtisserie Cocovanille » if the sign says Coco Vanille). Drop « Coco Vanille Granby » (city in a name field, 12 A2) and the draft « Patisserie Coco Vanille Inc » in `data/facts.json` ("Inc" in the trade name is on 01 §2.3's fix list) | 12 A2; 01 §2.3 |
| `legalName` · `identifier` | « Pâtisserie Coco Vanille inc. » · NEQ 1177082220 | 01 §1, §8 |
| `address` · `telephone` | 3 rue Court, Granby QC J2G 4Y6, CA · +1-450-372-7177 | 01 §2.3 (verified) |
| `geo` | 45.3995807, -72.7250821 | requirements; unverified (Maps not openable, 01 §1) |
| `hasMap` | `https://maps.google.com/?cid=10789122976114705165` (CID = decimal of 0x95baaa2efd52830d) | requirements; v0c entity block |
| `sameAs` | Facebook `/PatisserieCocoVanille` (verified) · Instagram only after the handle is confirmed · `https://www.google.com/search?kgmid=/g/11s3b_3rsh` (KG ID from the Maps URL) | 01 §7; requirements; v0b B1 (effect UNVERIFIED: no file tested it) |
| `openingHoursSpecification` | From the single hours record only | 02 §9.5; 12 A4 |
| `knowsLanguage` | Only languages actually served | M9 (C10) |
| `areaServed` | Omitted until delivery is real | 12 A4, E3 |
| `aggregateRating` | Never on the business | v1 §10; 16 G8 |
| `Person` (chef) | Only with consent and real bio facts | v1 L8; 12 E14 |
| Studio `ExternalId` | CID, Place ID [[FACT NEEDED]], kgmid | v0a §6.8 |
| Wikidata | Only after independent press coverage | v1 L8 |
| Disambiguation | "Coco Vanille" + "Granby" in every entity sentence; collisions: choco.vanille (Le Marmiton, Granby, custom cakes), Mancera perfume, a closed bakery of the same name in La Réunion, Pâtisserie Coco (Montréal). « à ne pas confondre avec … » only if confusion shows up in AI answers | 01 §8; 04 §0.7 |

### 10.3 Local

| Surface | Moves | Source |
|---|---|---|
| **GBP** (master record) | W0: status, owner access, hours, name to the sign. W1: primary category = what the business **is**, read from the live picklist (category names were not found in any source, T2); only true secondaries; description (the 750-character limit was not found: read the counter, T2); products with prices; photos; website link `?utm_source=google&utm_medium=organic&utm_campaign=business_profile`; **Food Ordering custom link** to `/commander/` preferred for pickup, if the section is offered for the category (T2). One post a week. Special hours by 2026-12-01. **Q&A is gone** (API ended 2025-11-03; replaced by Ask Maps, live in Canada in English ~Aug 2026, secondary): no Q&A preload or sync. API application W6 | 06 (d); 18 #19; 12 D4 |
| **Apple Business** | Rename (from Apple Business Connect, 2026-04-14, secondary); claim in W1; "Commander" action to `https://cocovanillegranby.com/commander/` (UTM accepted or not: T3); one Showcase per season (iOS 17.4+). iOS = 64.87 % of Canadian mobile (Sept 2026): Safari-iOS is the primary QA browser | 06 (b)(c); R18 #2 |
| **Bing Places** | `bing.com/forbusiness` (relaunched 2025-10-03); import from the GBP **only after** name, category and hours are final (the import copies errors). Bing ≈ 10 % of Canadian search (May–Sept 2026) | 06 (b)(c) |
| **AI local feeds** | Claim Foursquare, Yelp (claim only, never solicit), Tripadvisor (listing d27188801), PagesJaunes (announced as an Apple Maps supplier: UNVERIFIED); one spelling, GBP hours | 06 (o); R18 #18; 11 §1 |
| **Citation cleanup** | ~15 citations exist: fix before creating. W3: RestoMontreal closure flag + hours, Three Best Rated (Pain-Pain closed; apply to the cakes list), Wanderlog city, MapQuest typo, find-open, canada.chamberofcommerce.com mirror. W4–6: local chamber, Tourisme Granby région, Tourisme Cantons-de-l'Est/Bonjour Québec, Haltes gourmandes (fees [[FACT NEEDED]]). Monthly diff against the master record | 11 §0.1, §1.1 |
| **Reviews** | QR card in every box + one spoken counter line; email/SMS only with a ticked box (M23 overrides 11 §4.3's implied-consent sketch, per 16 G6); open-ended wording only: « Merci d'avoir choisi Coco Vanille ! Si vous avez deux minutes, votre avis sur Google nous aide beaucoup : [lien] » (M3); replies within **24 h**, closed days included (M1; 11 §4.1's "48 h" is superseded); no per-staff counts (M2); shop-level target = 2× the trailing 8-week rate until the response rate is measured (12 F5; v1's ≥ 3/week returns once order volume is known, 11 §4.6) | 11 §4; 12 M1–M3, M23, F5 |

### 10.4 Off-site engine (11)

1. **Clean first, create second** (11 §0.1), then the tourism layer Coco Vanille is missing from (11 §0.3).
2. Media core: La Voix de l'Est, Granby Express, M105; Tastet (surfaced in the W43 WebSearch proxy for I8, C2, C5, 05 §2; no AI-engine baseline was run, so 11 §2's 'cited by AI engines' is unverified; its Granby list has no bakery); listicles get corrections, not pitches (11 §2). Contacts [[FACT NEEDED]].
3. One data study only in months 1–3: the **Q1 2027 price survey** (seeds in 03 §2b: custom cakes ≈ $4.40–6.70 a portion, supermarkets ≈ $2.25–3.40; re-verify on the study date), with method, date, chart and a one-line credit; pitch to 3 names (12 F6; 11 §2).
4. Partners publish a page naming Coco Vanille: Marché public link (2026 participation [[FACT NEEDED]]), Haltes gourmandes (eligibility), Zoo visitor material (if a visitor offer exists), Cégep, SERY (only with a real ES offer); local-ingredient stories only if true (11 §3).
5. Video **from month 4**, 1 a month (12 F6, §5.1), in the 11 §5 order 1, 3, 4, 14, 10, 15: brand + Granby in the first 15 s, transcript on the target page, click-to-load facade.
6. Communities: manual search of Facebook groups; real name, affiliation disclosed, never posing as a customer (11 §6).
7. The Ahrefs correlation (0.664 for branded mentions) applies to **AI Overview** mentions of brands with DR > 40; the 0.218 backlink figure is unverified: keep the direction (earned mentions over link building), drop the numbers from client material (06 l; 12 D2).

### 10.5 Measurement

| Instrument | What it gives, and its limit | Source |
|---|---|---|
| **Truth layer** | Orders database + calls + GBP actions + nginx logs. GA4 is directional (opt-in consent shows a fraction of visits) | 12 G8 |
| Prompt panel | 36 prompts weekly (30 frozen + B1–B3 × 2 spellings); X1–X20 run in the W1 baseline only, as swap reserves; 3 runs per cell; SERP API set to Granby + monthly phone checks + 5 AI engines. **Swap gated prompts before the W1 freeze** (proposal: the 5 wedding prompts I5, I9, C3, C7, C9 → X1, X2, X7, X3, X12 per 12 G3; C4, C5, C6, L4, L6, L7, I10 swap to X4, X5, X8, X9, X10, X13, X19 if their product is not confirmed in W0). B1–B3 in both spellings. A "sponsored competitor" column (ChatGPT ads in Canada since ~Apr 2026, secondary) | 12 §4, G3; 05 §8; R18 #13 |
| **Search Console Generative AI report** | Launched 2026-06-03: **impressions only** in AI Overviews, AI Mode and Discover generative features, by page, country, device and date; no clicks, no CTR (one source: no queries, no position). "All sites by 2026-08-31" is disputed (T4). Per-prompt ownership still needs the SERP API + phone checks. Monthly gate: Settings › "Search generative AI" = Include | 06 (e) |
| **Bing AI Performance** | Public preview 2026-02-10: citations across Copilot, Bing AI summaries and select partners; page-level citations; grounding queries; **sampled** (a floor); **CSV only, no API** → weekly manual upload | 06 (f) |
| **GA4** | Basic Consent Mode: no Google tag before opt-in. Key events `phone_click`, `directions_click`, `order_click`, `generate_lead` (`whatsapp_click` dropped, M11). Native **"AI Assistant"** channel (announced 2026-05-13, secondary; not retroactive per one source; **excludes AI Overviews/AI Mode**; Perplexity possibly in Referral) + the regex as a custom group; both are floors. `purchase` sent **server-side only** via Measurement Protocol when the stored consent allows | 06 (g); 07 S7; 10 §10 |
| Logs | nginx `combined_timing`; monthly `log-bots.mjs` (Googlebot by reverse DNS, Bingbot, ≥ 2 AI crawlers on the pillar); raw logs 90 days | v1 L17; 17 §8.3 |
| Self-reported | « Comment avez-vous entendu parler de nous ? » at checkout | v0a §7.4 |
| Platform properties | Instagram (and YouTube if a channel exists) as Search Console properties (announced 2026-07-07, secondary) | 12 D6 |
| Tools | Free stack first; SerpApi free tier (250/month) covers one weekly run at one location (≈ 156 (36 × 4.33), 12 D7); 3 runs a week ≈ 468/month (computed: 36 × 3 × 4.33) needs Starter (US$25/1,000, secondary). Local Falcon, AlsoAsked, Otterly deferred; any spend waits for self-test 16 | 12 §5.1, D7; R18 #16 |
| Rule | One change at a time, 14-day wait, compare with untouched pages; compare a month with the same month last year; early signals up 8 weeks with flat leads = early; flat after 8 weeks = failing | v1 §11, §14, L21 |

### 10.6 Corrections ledger (every correction applied to the owner plans)

| # | Owner plan said | Now | Evidence |
|---|---|---|---|
| 1 | "First" = v1 §1 as written | Amended definition (§1): 3 runs, listicle rule, pack defined, AI Mode counts, named vs linked, FR subset | 12 §4, G1–G7 |
| 2 | 30 prompts as listed (12 gated) | Swap before the freeze; EN prompts say "Quebec/QC"; B1–B3 in both spellings | 12 G3; 05 §7 |
| 3 | Category sentence with weddings (v1) / adjectives + vanilla (v0b) | Option B by default; A only above the owner's threshold; no « mariages » | M15; 01 §11; 12 A5 |
| 4 | Beachhead = custom celebration cakes (v1 §6) | Defend pâtisserie-boulangerie; wedge « gâteau pour demain »; then custom birthday cakes | 12 B1 |
| 5 | Wedding, quinceañera, free-from, macarons, corporate clusters (v1, v0b, v0c) | Gated or frozen until confirmed; `offer_confirmed` flag per page and prompt | 12 B2, B3, §5.1 |
| 6 | `/sans-gluten-allergies/` | `/allergenes/` + « Contient : … » per product; no free-from claim at launch | 12 B2; 07 A-6 |
| 7 | Full trilingual (v0a, v0b) | FR 100 %, EN 6 pages, ES 3–5 only if served | M10 |
| 8 | WhatsApp on ES pages (v1), everywhere (v0a) | None at launch | M11 |
| 9 | TikTok "regulatory status" (v1) / pillar (v0a) | Order set aside 2026-01-21 (secondary); cut for capacity, not law | M12; R18 #12 |
| 10 | Audit rule "hreflang trio" (v1 §13) | Reciprocal set of existing equivalents + `x-default` → FR | M9 |
| 11 | Astro + Sanity / Supabase (v0b, v0c) | Next.js + Payload 3 on the VPS; plain-JS spike first | M5; 12 D5 |
| 12 | Vercel / Cloudflare hosting, Vercel log drain (v0a, v0c, v1) | Québec VPS, nginx, no CDN at launch; nginx logs | M6; 17 §13 |
| 13 | Studio at `/studio/`; robots `Disallow: /studio/`, `/api/` | `admin.cocovanillegranby.com`; public host 404s those paths; lines removed | M7; 12 C7 |
| 14 | VOTREDOMAINE.ca | `https://cocovanillegranby.com/` apex; `www` → 301; defensive `.ca` | M8; 17 §10 |
| 15 | Disallow cart and builder steps (v1, v0c) | Disallow cart, account, search; builder steps noindex and crawlable | 12 C21 |
| 16 | Content-Signal line as a correction (v1 §16) | Optional; no engine has committed to honour it | 06 (i) |
| 17 | llms.txt and JSON feeds at launch (v0a, v0c) | Optional, after launch, never a gate | M16; 06 (j) |
| 18 | FAQ markup (v0a) | FAQ rich results gone since 2026-05-07; `<details>` FAQ stays; FAQPage optional; removed from CI gates | M17; R18 #1 |
| 19 | Review replies 48 h (v0a, v0b, v0c; also 11 §4.1) | 24 h | M1 |
| 20 | Weekly review count on the kitchen board (v0b) | Shop-level count in Studio only | M2; R18 #4a |
| 21 | "Tell us what you chose" review prompts (v0b, v0a) | Open-ended request only; product mentions measured, never requested | M3; R18 #4a |
| 22 | Seed the 3 attributes everywhere (v0b, v0a) | Authentic only, in our own copy and unscripted earned media | M4 |
| 23 | Review ask by SMS/email after pickup (v0b, v0c, v1) | QR card + receipt link; electronic only with a ticked box | M23; 07 E-4 |
| 24 | ≥ 3 reviews a week from week 7 (v1) | 2× the trailing 8-week rate until measured | 12 F5 |
| 25 | Plausible / full ad stack / GA4 + Clarity | GA4 basic consent; server-side purchase; no pixels, sGTM, BigQuery or Clarity at launch | M19; 07 §0.4 |
| 26 | Seasonal products as PreOrder (v0a, v1) | Returning seasonal = BackOrder + date; PreOrder only for never-sold | M21; 06 (k) |
| 27 | v0c tax row | Effective-dated classes; QST zero-rated on sweet single servings from 2026-07-15, GST continues; accountant signs | M25; 07 §6 |
| 28 | Agentic checkout as a horizon (v1, v0c, v0a) | ChatGPT Instant Checkout deprioritized 2026-03-24; UCP in Canada not confirmed: watch, don't build | 12 D1; R18 #9–10 |
| 29 | "Mentions 0.664 vs backlinks 0.218" (v1 §2) | AI Overviews only, DR > 40 brands; 0.218 unverified; no numbers in client material | 12 D2; 06 (l) |
| 30 | "ChatGPT search uses Bing" (v0a) | Unnamed third-party providers (Microsoft inferred) + OAI-SearchBot | 12 D9; R18 #11a |
| 31 | Apple Business Connect, Looker Studio | Apple Business; Data Studio (both secondary) | M22; R18 #2–3 |
| 32 | Pre-load FAQ in GBP Q&A; Q&A sync in Studio | Q&A gone (API 2025-11-03; Ask Maps); questions live on the site | 06 (d) |
| 33 | Studio v1 synced to the GBP API (v1, v0a) | Works without the API; apply in W6 | 12 D4 |
| 34 | Custom AI channel (v0c); regex only | Native GA4 AI Assistant channel + regex backstop; floors; excludes AIO/AI Mode | 06 (g) |
| 35 | "Search Console Generative AI report" as the AEO measure (v1 §1) | Page-level impressions only; per-prompt ownership via SERP API + phone | 06 (e) |
| 36 | "Bing AI Performance" (v1 §1) | Sampled, CSV only, no API | 06 (f) |
| 37 | [verify-CA] items (v1 §2, §13, §17) | AIO EN in Canada 2024-10-28; AI Mode FR 2025-10-14; FR AIO in Canada not found (T1); Bing ≈ 10 %; iOS 64.87 % | 06 (a)(b) |
| 38 | Ordering at weeks 3–8 / days 15–45 / 7–12 / 11–14 | Engine live W11–12 (2027-01-11 → 01-24); Noël 2026 on the bridge | M20; 12 B5 |
| 39 | 10-step builder as the killer feature (v0c) | Request → quote → deposit first; builder after 3 months of request data | M24; 12 B6 |
| 40 | ≈ 30 Studio modules, health-score home (v0a, v1) | 6 daily screens + Cette semaine + read-only agency layer; home = Aujourd'hui | M18; 16 |
| 41 | Comparison page at week 8 (v1) | After launch + legal check | 12 §5.1 |
| 42 | Quarterly data studies; YouTube 2 a month (v1) | Q1 2027 price survey only; video from month 4, 1 a month | 12 F6 |
| 43 | Tools from week 7 ≈ US$62 "as of Sep 28, 2026" (v1 §15) | Date unsourced; SerpApi free tier + manual first; spend after self-test 16 | 12 D7; R18 #16 |
| 44 | Ads-ready signal layer (v0a Part 4) | Deferred; keep UTM and consent-gated `gclid` fields on orders | 12 F7 |
| 45 | `tenant_id` now (v1 §12) | Deferred; single tenant | 12 F9 |
| 46 | v0c entity placeholders (hours, phone 000, `areaServed`, `knowsLanguage` fr-CA/en-CA) | JSON-LD only from the NAP source file | 12 A4 |
| 47 | `alternateName` incl. « Coco Vanille Granby » (v0c) | Other spelling only | 12 A2 |
| 48 | Hero « La vraie vanille, depuis [année] », « Fait ici chaque matin », « Tout sur la vanille » pillar | Out until each claim is confirmed | 12 A5 |
| 49 | Primary category "Pastry shop" by default; 750-character description | Live picklist (names not found); read the counter (T2) | 06 (d) |
| 50 | Hosting ≈ C$35–55 (12 §5.3, 10 §0) | ≈ C$25–55 after 17's arithmetic check | 17 verification #15 |
| 51 | Faure, Rhubarbe as Québec benchmarks (v0c) | Faure left (2020) (08: partial, not re-checked); Rhubarbe = online orders + Saturday pickup since 2025 | 08 §9 |
| 52 | Princeton "~40 %" (v0c) | +41 % statistics / +28 % quotes (secondary); paper unread: don't quote | R18 #14 |
| 53 | `utm_source=chatgpt.com` (v0c) | Unverified; GA4 also matches the referrer (self-test 11b) | R18 #11b |
| 54 | "Yelp feeds Apple Maps" (v1, v0a) | Partly: Apple's own ratings + Yelp/Tripadvisor shown (secondary); add PagesJaunes; self-test 18 | R18 #18 |
| 55 | Gemini in Maps answering from reviews (v0a ②) | Ask Maps live in Canada in English ~Aug 2026 (secondary): profile complete from day 1 | R18 #19 |
| 56 | Consent Mode v2 "mandate" (v0a) | EEA policy, not a Canadian trigger; Loi 25 drives basic mode | R18 #20 |
| 57 | Follow-up message 24 h after pickup (v0c) | QR + opt-in email | 07 §9 |
| 58 | Suggested tips (v0c §9) | No online tip prompt | 07 C-12; R18 #7 |
| 59 | No `/carte/`, no `/commander/` in v1's tree; pickup/delivery undecided; gift cards for holidays | Added in W3–4; pickup only stated; gift cards in-store only for 2026, if offered | 12 E1, E3, E4 |
| 60 | No shoot, no accessibility gate, no infra week, no Apple/Bing step, no holiday dates, no POS deadline (v1) | Half-day shoot W2; axe in CI; infra gate W2; Apple + Bing W1; holiday hours by Dec 1; POS by W2 | 12 E5–E10 |
| 61 | Presence Health Score on the home (v0a) | Not a home screen; v1.1 only, after 4 baselines (decision pending, §8) | 12 G9; 16 §4.6 |

---

## 11. Tech + hosting

| Area | Decision | Source |
|---|---|---|
| Stack | One repo, one Next.js + Payload 3 build; versions pinned from `npm view` at install (Payload 3.92.x / Next 16.4.x reported, UNVERIFIED (FC)); plain JS subject to the W1 spike; Payload advisories checked every Friday (a "≥ 3.90 for Oct 2026 CVEs" note is UNVERIFIED (FC)) | 16b §0, §4; 12 D5 |
| Processes | Two Node processes from the same image (**web** = public, **studio** = admin) + one **worker** (`payload jobs:run`) + Postgres in a container on a private network; blue/green on one host | 17 §0, §1.1 |
| Admin subdomain | nginx routes by host; Studio at `/`, Payload admin at `/admin`; `X-Robots-Tag: noindex, nofollow, noarchive` with `always` on every response; admin robots.txt doesn't block; public host 404s `/admin`, `/studio`, `/api`; Local API calls pass `user` + `overrideAccess: false`; SSE + Postgres LISTEN/NOTIFY, Web Push for Home Screen apps, SMS backstop | 16b §2–§3, verification #21; 16 §7 |
| VPS | Québec data centre (OVH Beauharnois picked explicitly, AWS ca-central-1 [VERIFY Montréal], or a Montréal host); 4 vCPU / 8 GB / ≥ 75 GB NVMe for production + staging; 2 GB swap; OVH plan names are contested: pick by specs | 17 §0, §1.2, §7.3 |
| Proxy, TLS, DNS | nginx + certbot; 444 for unknown hosts; apex canonical, `www` → 301; Cloudflare DNS in DNS-only mode (or the registrar if it has DNSSEC + CAA + API); DNSSEC after a stable week; CAA; HSTS ramp, no preload at launch | 17 §3, §10 |
| CDN | **None at launch** (crawler-blocking defaults, partial logs, an extra Loi 25 processor). Revisit on: p75 TTFB > 0.8 s after cache fixes (threshold UNVERIFIED, 17 §6), attack traffic, bandwidth limits. Then a Bunny pull zone for static files first; Cloudflare only for DDoS, public host only, with the 17 §6.3 switches | 17 §6 |
| Email | Transactional via **Amazon SES ca-central-1** (Essentials confirmed; à la carte and ca-central-1 availability UNVERIFIED) from `commandes@`, bounce domain `envoi.`; never SMTP from the VPS; mailbox: Google Workspace Business Starter C$9.20 annual / C$11 flexible (confirmed) or M365 Business Basic C$9.50 (CAD not re-confirmed after the 2026-07-01 increase); SPF + DKIM + DMARC p=none → quarantine → reject | 17 §9 |
| Backups | Nightly `pg_dump` encrypted with `age` → two Québec buckets at two providers; WAL/PITR from the ordering week; monthly automated restore test written to Gates; targets RPO ≤ 15 min, RTO ≤ 2 h (owner to approve) | 17 §8.4 |
| Monitoring | Uptime + heartbeats **outside** the VPS; Sentry with PII scrubbed; Système tile in Studio | 17 §8.2 |
| Payments | POS-gated: Square (Web Payments SDK + Orders API) or Stripe (Payment Element + Express Checkout); never mix processors; Interac Online is discontinued | 10 §0, §1 |
| SMS | Twilio, toll-free verification; GSM-7 one-segment templates; US vendor → ÉFVP | 10 §6; 07 §2 |
| Loi 25 vendor list | ÉFVP + written agreement for processor, Twilio, GA4, Claude API (review drafts, names stripped), Sentry, mailbox; none for the VPS and backups if in Québec | 07 §2; 17 §7.2 |

**Monthly cost range (est.):**

| Line | Amount | Basis |
|---|---|---|
| VPS + backups + domains + mailbox + DNS + email | **≈ C$25–55** | 17 §11 (corrected from C$35–55) |
| SMS + email volume | ≈ $2–10 a month at one SMS segment for 100 / 250 / 600 orders (SMS $1.58–9.48, email < $0.40); ≈ $19 at peak if templates fall into UCS-2; SMS currency and Twilio number rental UNVERIFIED | 10 §12 (est.) |
| Fixed subtotal | **≈ C$27–65** with one-segment SMS (computed: 17's corrected hosting + 10's message lines; 10 showed C$37–75 on the older C$35 hosting floor) | — |
| Card fees | ≈ 3.4–3.6 % of online sales (Stripe 2.9 % + C$0.30; Square 2.8 % + 30¢, with a 2.9 % conflict) | 10 §1.1, §12 |
| SEO tools | US$0 → ≈ US$25 (SerpApi Starter) when 3 weekly runs start; more only after self-test 16 | 12 D7; R18 #16 |
| AI-engine API runs: ≈ 540 AI calls a week (computed: 30 + B1–B3 in both spellings = 36 prompts × 5 engines × 3 runs; 12 G6's 495 counts 33) | [[FACT NEEDED]] | 12 G6 |
| One-off: photo half-day, native EN reviewer, lawyer, accountant | [[FACT NEEDED]] | 12 §5.3 |
| Owner's ceiling | [[FACT NEEDED]] | 12 F8 |

Operator time for hosting: ≈ 30 min a week (Friday gate) + ≈ 1 h a month (restore test, logs) + ≈ 2 h a quarter (rotation, rebuild drill) (est., 17 §11).

---

## 12. One-Man Empire operating model

One operator (the agency) + Studio + scheduled jobs; the owner spends minutes, not hours. Systematised business intelligence = the same five numbers every Monday, decision rules written in advance (§10.5), and the orders database as the source of truth.

### 12.1 Who does what

| Work | Automated by Studio / jobs (no tap) | Owner (minutes) | Staff | Agency |
|---|---|---|---|---|
| Orders | Confirmation = contract + .ics; capacity reserved; production sheet at cut-off + 5 min; day-before reminder; nightly payment reconciliation (16 §6.2) | — | « Prête » 1 tap / 3 s; hand-over by code 10 s | Webhook alerts (≈ 30 min/week, 10 §13) |
| Custom cakes | Recap from the request; quote expiry; tentative capacity hold | Price + deposit link, 60 s each (≤ 4 a day) | — | — |
| Vitrine | Compression, sizes, site block, schema `SoldOut` on « Épuisé » | Photo 60 s (if the owner takes it) | « Épuisé » 2 taps | — |
| Hours | Holiday dates pre-loaded « à confirmer », card at J-30; site + schema update | 1 tap per date (≈ 2 min a season) | — | Apple/Bing tasks until API |
| Reviews | Language detection, draft in the reviewer's language (names stripped), 24 h timer, alert ≤ 3★ | 2 taps / 30 s per reply | — | — |
| Presence | Monday 06:00 rank-first runs; ≤ 3 owner cards; Monday email; IndexNow + revalidation on publish | 5 min on Monday | — | ≈ 6 h/week: Mon 1 h scoreboard · Tue–Wed 3 h one page FR + EN · Thu 1 h off-site · Fri 1 h gates (v1 §9) |
| Ops | Nightly backups, retention deletes (allergy notes + 30 days, raw logs 90 days), monthly restore test | — | — | Fri 30 min; monthly 1 h; quarterly 2 h (17 §11) |
| **Total** | — | **≤ 10 min per open day, ≤ 3 per closed day, + 5 on Monday, 15 a month, 30 a quarter** (16 §1.3) | **≤ 5 min per shift** | ≈ 6 h/week + ops |

Weeks 0–10 (no Studio): owner facts by phone or email to the operator; review replies in Google's app; holiday orders on the bridge (12 F11).

### 12.2 Weekly rhythm (after W13)

| When | Owner | Agency | Output |
|---|---|---|---|
| Monday | Read « Cette semaine », answer ≤ 3 cards (5 min) | Scoreboard, Search Console, Bing AI Performance CSV; pick 3 moves (1 h) | Monday email |
| Tue–Wed | Approve facts on the new page (in a card) | One page FR + EN → gate → deploy → IndexNow → request indexing (3 h) | 1 page/week |
| Thursday | — | One off-site action, one GBP post, one pitch (1 h) | Mentions log |
| Friday | — | Pages report, CWV, security, manual actions, crawler access, Payload advisories (1 h + 30 min ops) | Gates |
| Monthly | Approve the report (15 min) | Prompts in every engine, NAP sweep, log-bots, restore test result | Report in orders, quotes, calls |
| Quarterly | Validate the data (30 min) | Data study, re-verify statistics, key rotation, rebuild drill | — |

### 12.3 KPI tree (orders, quotes, calls, directions, citations — not sessions)

```
NORTH STAR  Online orders $ + won quotes $ + calls + direction requests      (v0a §7.3 adapted; v1 §2)
├─ Orders      online orders (count, $, by mode: vitrine / menu / season / custom) · by language · repeat rate
├─ Quotes      requests received · answered ≤ 24 h % · quote → deposit % · cancellations + refunds ≤ 15 days
├─ Calls       site phone_click (consented, partial) + GBP calls
├─ Directions  site directions_click (consented, partial) + GBP direction requests
├─ Citations   GEO: brand named x/30 in ≥ 2 engines · domain linked · AEO: snippet/PAA/AIO/AI Mode x/30
│              · SEO: C+L prompts at #1 · Bing AI citations (sampled) · GSC generative impressions (trend)
├─ Reputation  new reviews vs trailing 8-week rate · % replied ≤ 24 h · rating (90 days)
└─ Inputs      facts accuracy (NAP diffs = 0, [[FACT NEEDED]] on live pages = 0) · pages published · listings fixed · pitches
```

### 12.4 Ethical behavioural levers (02 §7: every lever reads live data; no data → no claim)

| Lever | Use | Never |
|---|---|---|
| Anchoring | The full real price table with $/portion | Fake "was" prices; decoy sizes |
| Defaults | Size preselected from the guest count; earliest real slot | Pre-ticked add-ons or consents |
| Real scarcity | « Il reste 2 places pour cette date », computed from capacity | Countdowns with no real cut-off |
| Social proof | Live Google rating **with count and date** | Gated, incentivised or staff reviews; own reviews as `aggregateRating` |
| Commitment | Deposit + written recap approved before production | Hidden non-refundable terms |
| Reciprocity | Free calculator and guides, no email wall | Gating guides behind an email |
| Peak-end | « Prête » SMS, clean box, review ask after the event | Promotions in transactional messages |
| Fluency | Québec French (« gâteau de fête », « en auto »); native ES | Machine-translated allergens |

---

## 13. Roadmap weeks 0–18 (corrected order, 12 §6)

Week 0 starts Monday 2026-10-26. W11–12 = 2027-01-11 → 01-24 (12 §6). Gates are pass/fail; a failed gate stops the next week's dependent work (§14).

| Week | Dates | Ranking track | Product track | Owner input | Gate |
|---|---|---|---|---|---|
| **W0** | Oct 26 – Nov 1 | Refused-tactics clause signed; prompt swap + freeze; category sentence A/B | VPS, registrar, POS facts collected | Open? GBP access; sign photo; hours + Dec 24 – Jan 2; product list + prices + portions + lead times + cut-off; **bûches yes/no**; revenue mix; budget; Spanish service; phone-check owner | **G0 go/no-go**: shop open, GBP not "temporarily closed", owner access known |
| W0–W1 | Nov 1 → | **Noël 2026 bridge** (if bûches): GBP products + posts, Facebook post on Nov 1; phone + request form + payment link | — | Bûche menu, prices, pickup dates | — |
| **W1** | Nov 2–8 | Monday baseline: 33 prompts + candidates from a phone in Granby + SERP API (Granby) + 5 AI engines; GBP category audit, description, products, photos; Apple Business + Bing Places claimed; Facebook aligned; self-tests T1–T5, 18, 19 | VPS day-0 hardening, DNS, TLS; static FR holding page (NAP, hours, phone, holiday orders) **+ `/buches-de-noel/` on it if bûches are confirmed** (04 §0.6: no 2026 organic win; the URL gains history for 2027, a hypothesis; it also gives GBP/Facebook links a landing page); robots + sitemap; Search Console Domain property; Bing Webmaster + IndexNow; Payload plain-JS spike; mailbox on the domain | Photos; approve the NAP file | **G1**: baseline saved; GBP = Apple = Bing = Facebook; holding page 200 to every crawler |
| W2 | Nov 9–15 | Citation cleanup (PagesJaunes, Foursquare, Yelp claim, Tripadvisor claim); TBR refresh request; run #2 | Payload model (Business, Location, Hours, SpecialHours, Product, Variant, Allergen, Page, FAQ, Media, Redirect, AuditLog); design tokens v0; CI gate incl. axe; backups + restore test; owner passkey; half-day photo shoot | Allergen list per product; POS fact; tu/vous; cueillette/ramassage | **G2**: restore test logged; publish guard blocks markers, placeholders, unverified allergens; person in charge of PI named |
| W3–4 | Nov 16–29 | Correction requests (RestoMontreal, TBR, Wanderlog, MapQuest, find-open); QR card in every box; runs #3–#4 | FR: home, `/carte/`, `/commander/` (interim), `/nous-trouver/`, `/a-propos/`, `/prix/` (if grid), cake page (8a or 8b), `/allergenes/`, legal ×4, `/buches-de-noel/` (if offered). EN: home, menu, order, visit | Approve copy and prices | **G4**: audit 0 failures; render-diff 0; CWV green on home + `/carte/`; no marker left |
| W5 | Nov 30 – Dec 6 | **Holiday hours on GBP, Apple, Bing, Facebook by Dec 1**; first 4-week comparison (runs #1–#4) | Calculator (if standards); `<details>` FAQ; schema graph validated; sitemap with hreflang; IndexNow; request indexing; GA4 basic consent + key events; GBP website UTM; EN pillar + about; ES 3 pages only if M10 is met | Final holiday hours | **G5**: key pages indexed in Google and Bing; events fire only after consent |
| W6 | Dec 7–13 | GBP API Basic Access filed; listing requests (Tourisme Granby région, chamber, Marché public, Yelp/Tripadvisor claims); review-reply log vs 24 h; velocity vs trailing baseline | **Ordering spec frozen**: processor, capacity per category × day, windows, deposit + cancellation, tax classes with the accountant, CASL boxes | Deposit %, refund policy, capacity numbers | **G6**: spec signed; API filed; holiday hours live everywhere |
| W7–10 | Dec 14 – Jan 10 | Weekly runs; snippet loop as a script report on the pages live since W3–5; Q1 price-survey collection starts; Saint-Valentin page by **2026-12-20** (if products confirmed, 04 §6.2); Fête des Rois (Jan 6) on GBP only | Build the ordering engine + Studio MVP while the shop is in its holiday rush (owner asks kept minimal); `/viennoiseries/` + `/pains-baguettes/` if capacity; ÉFVPs; conditions of sale reviewed. Effort check (computed, est.): ordering v1 ≈ 3–4 weeks (10 §13) + Studio UI ≈ 4–6 weeks (16b §1) = ≈ 7–10 operator-weeks in a 4-week window that includes Dec 24 – Jan 2. Session 1 decides: start the Studio shell (backlog STU-01) in W3–6, or cut the MVP to what G10 tests (16 §8.3 T1–T5) and move the rest to v1.1. | Approvals only | **G10 pre-launch**: owner test 5/5 + staff test; season load test; restore test; PITR ready; tax classes stamped; counsel sign-off on checkout + conditions; SMS templates one segment |
| **W11–12** | Jan 11–24 | Product/Offer markup with real availability; GBP Food Ordering custom link added (if T2); the Apple "Commander" action now lands on the live engine (same URL) | **Ordering + Studio MVP live**; Saint-Valentin season in date-first mode; server-side `purchase`; WAL/PITR on | 10-min Studio onboarding; install the PWA | **G12 launch**: first 20 real orders without a lost or duplicated SMS; refunds and timers work |
| W13–14 | Jan 25 – Feb 7 | **Re-baseline vs W1** (v1's weeks 11–12 gate, moved): report in orders and leads, next 20 pages chosen, diagnostic protocol run once; **8-week rule** check (content live since ~W5); **Pâques page by 2027-01-31**; 1-page-a-week rhythm starts | Studio v1.1 scoped; ease-of-use re-check on real audit-log times (AC17) | Monday 5 min | **G14**: rhythm running; early signals vs leads read |
| W15–16 | Feb 8–21 | Saint-Valentin (Sun Feb 14) fulfilment + post-season review; Pâques refresh by Feb 14; comparison page drafted for counsel | Merchant Center local listings, 5-product test | Valentine's capacity | — |
| W17–18 | Feb 22 – Mar 7 | Q1 data study published + pitched to 3 names; first video (month 4); Pâques pre-orders open **2027-03-01** (date-first) | Studio v1.1 (Recherche, Visibilité IA, Mentions, Analytique; vitrine post drafts) | — | **G18**: review of the definition of first and the kill criteria (§14) |

Beyond W18: Fête des mères page by 2027-03-14 (04 §6.2); builder decision after 3 months of request data (≈ mid-April 2027, M24); `/buches-de-noel/` refresh by 2027-10-01 and pre-orders 2027-11-01, the first holiday season the site can compete for (04 §0.6).

---

## 14. Top risks and kill criteria

Full register: 15 §4; this table adds kill criteria only.

Thresholds in the last column are proposals for session 13 (design choice) unless the row cites a source.

| # | 15 ID | Risk | Evidence | Mitigation | Kill / stop criterion |
|---|---|---|---|---|---|
| 1 | R1 | The shop is closed or flagged "temporarily closed" | 01 §4 | G0 | Not confirmed open with GBP access within 2 weeks of W0 → stop the build; listing fixes only |
| 2 | R33 (new) | Owner facts never arrive | 01 §12; 02 §10.1 | Publish guard; holding page; one card per missing fact | Hours, products and prices missing at end of W2 → content site slips week by week; no page with a placeholder ships |
| 3 | R4 | Scope swells back to an agency of 4–4.5 FTE | 12 F1–F3 | Cut list 12 §5.1; one build track at a time. Effort check (computed, est.): ordering v1 ≈ 3–4 weeks (10 §13) + Studio UI ≈ 4–6 weeks (16b §1) = ≈ 7–10 operator-weeks in a 4-week window that includes Dec 24 – Jan 2. Session 1 decides: start the Studio shell (backlog STU-01) in W3–6, or cut the MVP to what G10 tests (16 §8.3 T1–T5) and move the rest to v1.1. | Owner median Studio time > 10 min/open day for 2 weeks (16 AC17), or agency > 6 h/week on presence → cut screens or modules, never add |
| 4 | R16 | Payload in plain JS fails | 12 D5 | W1 half-day spike | Spike fails → owner decides within 2 days: JS everywhere except config files, or another CMS (12 D5) |
| 5 | R34 (new) | POS unknown; processor wrong | 10 §0; 12 E10 | Default Stripe + Studio printer | No POS fact by W6 → spec defaults to Stripe; ordering launch never waits on a POS integration |
| 6 | R23 | Holiday rush overload, drop-day timeouts | 08 §4; 10 §13 | Engine after the rush; load test; page cache; 10-min holds; « Pause des commandes en ligne » in one tap | Load test fails at G10 → season stays on the bridge |
| 7 | R7–R11 | Legal exposure: French parity, all-in price, distance contract, taxes, Loi 25 transfers, CASL | 07 §0 | Guards 16 G1, G13–G15; counsel + accountant sign-offs; ÉFVP register | Any unsigned row in 07 §6 → that product is not sold online; no counsel sign-off at G10 → no online checkout |
| 8 | R6 | Allergen error or free-from claim | 07 A-3, A-6; 12 §5.2 | Human-verified stamp voided on recipe change; text scan | Any incident → product pages with allergen data pause until re-verified |
| 9 | R13 | Another "cake made wrong" complaint | 01 §6; 02 §0.2 | Recap + reference photo + approval before production | Two in a quarter → custom-cake intake moves back to phone + written recap until fixed |
| 10 | R29 (partial) | New domain is slow; listicle prompts unwinnable by our own domain | 05 §5; 12 G1 | Listicle rule; listings + GBP carry the early months; report orders monthly | v1 §11 rule: early signals flat after 8 weeks of live content (≈ W13) → change the approach, not the tools |
| 11 | R2 | AI engines repeat wrong facts (hours) | 05 §0.3 | Fix at the source (GBP, then RestoMontreal); weekly runs log wrong facts | Same wrong fact in 2 engines for 4 weeks after the source fix → escalate to every mirror in 11 §1.1 |
| 12 | R3 | Entity merge with choco.vanille or the perfume | 01 §8 | Brand + Granby everywhere; NEQ identifier; `sameAs` | Confusion observed in AI answers → add the « à ne pas confondre » line on `/a-propos/` |
| 13 | R21 | Instagram in-app checkout fails | 08 §0.5 | Card inline, Safari hand-off with the box restored | Checkout from the IG bio link fails in testing → no IG link to checkout until fixed |
| 14 | R15 | GBP API never approved | 12 D4 | Studio works without it (AC15) | None: manual Google tasks continue |
| 15 | R12, R24 | Review velocity targets push staff toward quotas | R18 #4a; 12 F5 | No per-staff numbers anywhere (G20) | Any per-staff target appears → removed the same day |
| 16 | R19 | A CDN or firewall blocks crawlers | 17 §6; 06 practice 6 | No CDN; `crawler-access.mjs` after every deploy | Gate 5 red → deploys freeze until fixed |
| 17 | R27 | Budget unknown | 12 F8 | Free stack first; every paid line gated | No ceiling by W6 → no paid tool, no paid listing, no photographer beyond the W2 half-day |
| 18 | R18 | Data loss | 17 §8.4 | Two Québec copies at two providers; monthly restore test | Restore test fails or is > 31 days old → no deploy until it passes |

---

## 15. Topic sessions, one by one

Ordered as the owner asked: admin first. Session 2 is time-critical (bûche decision by Nov 1, holiday hours by Dec 1): run it right after session 1.

| # | Session | Decisions to make | Inputs ready | Inputs missing |
|---|---|---|---|---|
| 1 | **Coco Studio (admin) review** | Confirm the 6 daily screens, owner/comptoir bars, Cette semaine, agency MVP; roles (may staff close or pause?); the 4 urgent alerts and quiet hours; offline policy; pickup check by code or name; AI review drafts via the Claude API (needs an ÉFVP); Presence Health Score yes/no (§8); label printer now or later; MVP cut line; acceptance tests | 16, 16a, 16b, 10 §2, 07 §5, `data/admin-inspiration.csv`, this file §8 | Staff count, devices (iPhone/Android, tablet), POS and printer, kitchen Wi-Fi, request and phone-order volumes, owner identity, words (cueillette/ramassage, acompte/dépôt) (16 §9) |
| 2 | **Owner facts confirmation (week-0 go/no-go)** | Open + GBP status + access; sign spelling → NAP file; hours + holiday hours; product list incl. bûches; next-day cut-off; prices, portions, weights; revenue mix → sentence A/B; POS; VPS provider + city; registrar; budget ceiling; phone-check owner; Spanish service; Instagram handle | 01 §12, 02 §10.1, 10 §14, 16 §9, 17 §14, `data/facts.json` (`fact_needed`), §2 here | Every answer (owner); storefront-sign photo |
| 3 | **Positioning + IA** | Sentence A or B (FR/EN/ES); beachhead + fallback; prompt swap and freeze; slug set (§5.1); product URL pattern; overlap test; EN/ES page lists; navigation labels | 01 §11, 03 §7, 04 §2–§4, 05, `data/prompts.csv`, `data/keywords.csv`, §3 and §5 here | Revenue mix, confirmed products; the Granby phone baseline; Keyword Planner ranges and a Granby PAA harvest (04 V4–V5) |
| 4 | **Design direction + design system** | Judge A/B/C (not done yet); palette vs logo; type; photo shoot plan; hero (still vs loop); motion; « Ma boîte »; tu/vous; C-layer illustrations; shared tokens with Studio; accessibility gate | v0c §7, v1 L3, 08, `data/inspiration.csv`, 16a §3.8, §9 here | Logo files, the Instagram account (unconfirmed), real photos, the owner's taste, sign photo |
| 5 | **Ordering + checkout** | Flows in scope at W11 (vitrine reservation yes/no); processor; deposit %, cancellation, quote SLA and validity; capacity per category × day; pickup windows; cut-off; seasons (Saint-Valentin, Pâques); gift cards later; pickup only | 10, 07 §4 + §6, 02 §7, 08 §3–§8, 16 §3, §7 here | POS; capacity and lead times; prices with weights; accountant tax classes; counsel on deposits, pre-orders and s. 55 (07 §8) |
| 6 | **Technical SEO foundation** | Page template contract; crawler table and the training choice; robots; sitemap + hreflang builder; schema graph; CI gate list; trailing slash; IndexNow hook on the public host; CWV budget | v1 §4 L2–L5 + §12, 06 §3 + (n), 16b §2, 17 §2 + §12, 10 §8 + §11, §10.1 here | Spike result, VPS, domain access |
| 7 | **Local + reviews** | GBP category (T2), description, products, Food Ordering link (T2); Apple action (T3); Bing import timing; citation sweep order; QR card copy and design; velocity target; reply policy | 11, 06 (c)(d)(o), `data/directories.csv`, 18 §2, §10.3 here | GBP access, live review count, self-test results, chamber and tourism fees |
| 8 | **Content + AEO** | The ~12 FR + 6 EN launch pages: answer blocks, key facts, FAQ picks; vocabulary rules; seasonal commitments for 2027; the 1-page-a-week queue | 02 §5, 04 §3 + §5 + §6, v1 §7, `data/seasonal-calendar.csv`, `data/keywords.csv` | Owner facts, a Granby PAA harvest, photos, a native EN reviewer |
| 9 | **GEO + off-site** | Entity values (`sameAs`, kgmid, `alternateName`); facts box; llms.txt yes/no; pitch order; Q1 study method; partner asks; video start; communities | 11, `data/pitch-list.csv`, 03 §4, 06 (l)(o), 05 §8, §10.2 + §10.4 here | **The AI-engine baseline (not run)**, newsroom contacts, creators and Facebook groups (manual), price-survey data |
| 10 | **Measurement** | KPI tree and the 5 Monday numbers; GA4 setup (basic consent, key events, AI channel + regex); server-side purchase; Search Console GenAI + Bing AI routines; 3-run prompt method and its cost; log-bots; self-reported source; tool spend | v1 §11, 06 (e)(f)(g), 12 §4 + G6–G8, 10 §10, 16 §4.2, 05 §9, §10.5 + §12.3 here | Per-call AI API prices (12 §7 #4), self-test 16, who runs the phone check |
| 11 | **Legal pack** | Engage lawyer + accountant; privacy policy; conditions of sale (deposits, refunds, pre-orders, perishables); EN/ES checkout box; ÉFVP list; consent banner text; allergen statement; tax classes; CIPO search; contest template | 07 (all), 12 B2 + E2, 16 §5 | Professional answers (07 §8), MAPAQ permit, CIPO result, the CAI template |
| 12 | **Hosting + ops** | Keep or move the VPS; plan size; backup providers; mailbox suite; SES vs Postmark; DNS provider; monitoring tools; RPO/RTO; runbook; staging | 17, 16b §2 + §4, 10 §12, §11 here | VPS facts, registrar access, the 17 §14 price re-checks |
| 13 | **Budget + roadmap** | Monthly ceiling; one-off costs (photo, lawyer, accountant, EN reviewer); tool spend gates; freeze W0–W18 and the gates; sign the kill criteria | 12 §5.3 + §6, 10 §12, 17 §11, v1 §15, R18 #16, §11 + §13 + §14 here | The owner's ceiling; professional quotes |

---

## Inputs (all read 2026-10-25; no web search in this run)

- Owner: `research/requirements-2026-10-25.md`, `research/plan-v1-ranking-stack.md` (main), `research/plan-v0a-master-plan.md`, `research/plan-v0b-multilingual-local-domination.md`, `research/plan-v0c-site-ux-ordering.md`
- Research: `research/01-business-facts.md`, `02-customers-jtbd.md`, `03-competitors.md`, `04-keywords-demand.md`, `05-serp-baseline.md`, `06-seo-aeo-geo-2026-verified.md`, `07-legal-quebec-compliance.md`, `08-ux-ui-inspiration.md`, `10-ordering-tech-architecture.md`, `11-offsite-local-citations.md`, `12-plan-review.md`, `16-admin-dashboard-spec.md`, `16a-admin-ux-inspiration.md`, `16b-admin-tech-subdomain.md`, `17-vps-self-hosting-and-domain.md`, `18-dated-claims-verification.md`
- Data: `data/facts.json`, `data/prompts.csv`, `data/keywords.csv`, `data/seasonal-calendar.csv`, `data/directories.csv`, `data/pitch-list.csv`, `data/competitors.csv`, `data/price-benchmarks.csv`, `data/serp-baseline-2026-W43.csv`, `data/inspiration.csv`, `data/admin-inspiration.csv`
- Backlog twin: `data/backlog.csv`
