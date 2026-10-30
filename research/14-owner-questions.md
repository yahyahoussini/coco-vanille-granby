# 14 · Owner questions: the consolidated list (2026-10-25)

> Track: every question that only the bakery's owner can answer, deduplicated from all research files and plans. Stage: plan only, no code.
> Method: **0 web searches.** Sources are the `[[FACT NEEDED]]` lists and open-question sections of: 01 §12 · 02 §10.1 · 03 §8 · 04 §0.11, §3 · 05 §10 · 07 §8 (Owner) · 10 §14 · 11 §7 · 12 §6 (owner-input column), A–G · 16 §9 · 16a §12 · 16b §0 · 17 §14 · 00 §5, §7, §11 · 15 D15 · plan-v0b "Decisions needed this week" · plan-v0c §13 · plan-v1 "Next steps" · `data/facts.json` `fact_needed` (21 items).
> Refs: "01 §12" = `research/01-business-facts.md` §12; "v1", "v0a", "v0b", "v0c" = the owner plans in `research/plan-*.md`.
> Terms: **Owner** = the bakery's owner (role « Propriétaire », 16 §1.1). **Operator** = Yahya (role « Agence », 16 §1.1).
> Rule (One-Man Empire): each answer is entered **once** into the single facts file (`data/facts.json`, later Studio). Pages, schema, listings and AI-facing facts all read from it (12 A4; v0b facts-as-data rule kept in 12 §2). Nothing marked `[[FACT NEEDED]]` can go live: the publish guard blocks it (v1 §10; 16 G2).

---

## 0. Priority legend (dates from 12 §6; week 0 starts Monday 2026-10-26)

| Priority | Meaning | Answer by |
|---|---|---|
| **BLOCKER** | Nothing else starts without it (12 A1 go/no-go), it sits in the 12 §6 week-0 owner-input list, or a dated deadline is missed without it | 2026-11-01 (week 0) |
| **Week 1** | Needed for plan weeks 1–2: baseline, listings, VPS, data model, photo shoot | 2026-11-15 |
| **Later** | Needed from week 3 (pages), by the week-6 ordering-spec freeze (2026-12-13), or when that topic session starts | per row |

The admin dashboard is the next topic session (README). Group D answers help it start well, even where the build date is later.

Answer formats: **Y/N** · **photo** · **list** · **table** (a sheet or a photo of a handwritten list is fine) · **number** (a rough figure is fine) · **text** · **access** (an invitation to a manager account; never a password).

---

## 1. Status and identity (S)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| S1 | Is the shop open and trading today (October 2026)? If not, since when, and is a reopening planned? | Go/no-go for the whole project. The newest dated evidence is a mid-2026 directory snapshot; RestoMontreal still shows "may be temporarily closed"; no 2026 owner post or news found · 01 §0.2, §4; 12 A1 | Y/N + date | **BLOCKER** |
| S2 | Is the Google Business Profile (GBP) marked "temporarily closed"? Who holds owner access to it? | That status would suppress map-pack visibility (inference, 01 §4). The GBP is the master record that ~15 listings copy · 01 §4, §12 #1; 11 §0.1; 12 A1 | screenshot + name; **access** (operator as manager; the business keeps ownership, v0a §4.1, kept in 12 §2) | **BLOCKER** |
| S3 | What exact name is on the storefront sign? | Decides the schema `name`, the GBP name and every listing. Google and its mirrors say "Pâtisserie Cocovanille"; the registry, Facebook, Tripadvisor and the press say "Pâtisserie Coco Vanille"; both AI-proxy mentions used "Cocovanille" · 01 §2; 05 §0.2; 12 A2; requirements | photo | **BLOCKER** |
| S4 | Approve the canonical NAP: « Pâtisserie Coco Vanille · 3 rue Court, Granby (QC) J2G 4Y6 · 450-372-7177 » (name adjusted to S3) | One NAP source file feeds the site, schema, GBP, Apple and Bing (week-1 gate: GBP = Apple = Bing = Facebook) · 01 §2.3; 12 A4, §6 | "approuvé" or a correction | Week 1 |
| S5 | Rough revenue mix: counter (viennoiseries, bread, café) vs custom cakes vs public market vs frozen bread. Then choose category sentence **A** (custom cakes) or **B** (pâtisserie-boulangerie; the default), or give the revenue share that would justify A | Sets the category sentence, the home page and the beachhead. B is the default; A only if custom cakes clear the owner's threshold and capacity is known; no weddings in it · 01 §11; 12 B1, M15; v1 "Next steps" | 4 % figures or a ranking + A/B | **BLOCKER** |
| S6 | Agree to the refused-tactics clause (no fake, bought, incentivised or filtered reviews; no staff review quotas; no keywords in the GBP name; no fake locations; no undisclosed paid posts…) | Week-0 item and a weeks 1–2 gate · v1 §10, §3; 12 §6 | signature | **BLOCKER** |
| S7 | The current Google review count, and permission to reply to reviews in the bakery's name | Baseline for review velocity (RestoMontreal showed "40+" in mid-2026; Mont Rose 70+); 24 h reply rule · 01 §6, §12 #15; 11 §4.6; 12 M1 | number + Y/N | Week 1 |
| S8 | Marketing lines in the plans: is there a real vanilla speciality? Is everything « fait ici chaque matin » (frozen bread is also sold)? « depuis [année] »: which year? | These lines came from the brand name, not from evidence; the publish guard blocks unconfirmed claims · 12 A5 | Y/N per line | Later (week 3, copy) |
| S9 | Has a trademark been filed for "COCO VANILLE" or "COCOVANILLE"? | Check before printing boxes or signage; a pending application already counts under the Charter. The CIPO search itself is an operator task · 07 X-2, §8 | Y/N + file number | Later |
| S10 | Still an exhibitor at the Marché public de Granby in 2026? Which days? | Partner link and market-day post; the 2026 exhibitor status is unverified · 01 §9.5, §12 #16; 11 §3 | Y/N + days | Later |

## 1b. New since 2026-10-27 (Facebook bio, chat, strategy)

| # | Question | Why it matters · source | Format | Priority |
|---|---|---|---|---|
| N1 | Which number takes texts, and which one takes atelier bookings: 450-372-7177 or 438-528-7818? | The site shows the mobile as « Cellulaire » only and promises no texting until you say so · 01 update 2026-10-27; sessions/04 #11 | text | Week 1 |
| N2 | Creative workshops (« Ateliers créatifs sur réservation »): themes, ages, duration, group size, price, dates, how to book | The FAQ and the chat say « sur réservation » and leave a visible marker for the rest · 01 update 2026-10-27 | text | Week 2 |
| N3 | Café: drinks offered, seats, can people sit and eat in? | « Pâtisserie & Café » is on the site; nothing else is claimed · 01 update 2026-10-27 | text | Week 2 |
| N4 | Which of these are current: chocolate mousse, verrines, dessert trays, sandwiches/lunch, framboisier, Boston cake? Any « sans gluten » product, and how is cross-contact handled? | A pasted strategy names them from public posts (unverified); « sans gluten » is a regulated claim · 01 update 2026-10-27; 07 A-6, A-7 | list + process | Week 2 |
| N5 | « Écrivez-nous » (the site's own chat): who answers, from which phone, during opening hours only? Keep it on, or pause it in Studio › Messages? | Replies count in the owner's daily Studio time (16 §1.3) · sessions/04 #10 | Y/N + names | Week 1 |

## 2. NAP and hours (H)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| H1 | ~~Current opening hours for each day, and the closed days~~ **Answered by the Google listing (relayed by Yahya, 2026-10-27): Mon–Tue closed, Wed–Sat 8:30–17:30, Sun 9:30–17:00. Owner: confirm, or correct in Studio « Boutique & heures ».** | Six conflicting schedules exist online, and an AI answer already repeats the older « mercredi au dimanche » one. Hours set the pickup windows (84 a week if the shop opens 3 days, est.) and the weekly maintenance window (Monday 03:00 assumed) · 01 §3; 05 §0.3; 12 A3; 10 §3.1; 17 §8.1 | table Mon–Sun | **BLOCKER** |
| H2 | Holiday hours from 2026-12-24 to 2027-01-02, seasonal closures, and open/closed for each Québec statutory holiday (Studio pre-loads them « à confirmer ») | Special hours must reach GBP, Apple, Bing and Facebook by **2026-12-01**. Noël is Friday 2026-12-25; Jour de l'An is Friday 2027-01-01 · 12 E9, §6; 04 §6; 10 §3.4; 16 G18 | date table | **BLOCKER** (final version by week 5) |
| H3 | Is 450-372-5917 an old line, a second line, or an error? | One Yellow Pages result shows it; the citation cleanup runs in week 2 · 01 §2.2, §12 #4 | text | Week 1 |
| H4 | Business email address, if any | Footer, schema `email`, contact page. None was found online · 01 §1, §12 #7 | address or "aucune" | Week 1 |
| H5 | Café seats, customer Wi-Fi, parking, and which door customers use (with photos) | Visit page; the order confirmation and `.ics` carry parking and door; visitors ask about parking downtown · 01 §12 #14; 10 §4; 02 P4 | number + text + photos | Later |
| H6 | When do croissants and bread come out of the oven? | Walk-in regulars want fresh-bake times on the visit page · 02 P7 | times | Later |

## 3. Products, prices, portions, lead times, order process (P)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| P1 | Full product list with prices: sizes, portions per size (inches and cm), flavours, finishes; mark each item daily (vitrine), menu cake, custom or seasonal | `/carte/`, `/prix/`, product pages and offers in schema. Prices go in HTML, never « prix sur demande » · 01 §12 #10; 02 §10.1 #3; 04 P03; 10 §14 #5; 12 E1, §2, §6 | table (one row per product × size) | **BLOCKER** |
| P2 | Which of these do you offer today? Themed kids' cakes · smash cake · wedding cakes (if yes: tiers, set-up, lead time) · bûches · macarons · chocolatines · corporate boxes · quinceañera cakes · gluten-free or vegan items · gift cards · gift boxes · picnic boxes · galette des rois · maple-season items · pies / Québec desserts · ready meals (vol-au-vent) | 10 of 38 planned pages are CONDITIONAL and 2 more wait on the product; 12 of 30 prompts are gated. Only confirmed offers get pages · 04 §0.1, §2; 05 §5, §10; 12 B3; 01 §5 (no public evidence for weddings, macarons, bûches, gluten-free, corporate boxes) | Y/N checklist | **BLOCKER** |
| P3 | Noël 2026: bûches yes or no? The 2026 holiday menu (vol-au-vent included), the pre-order opening date and the pickup days | v1 dates holiday pre-orders to 2026-11-01. C4 (bûche) becomes the #1 prompt for Nov–Dec **only if** bûches are confirmed by then. The site can't win Noël 2026; the bridge is GBP products and posts + Facebook + phone + a payment link · 05 §0.9; 04 §0.6; 12 B5; 10 §13 (option D); `data/seasonal-calendar.csv` | Y/N + list + dates | **BLOCKER** (deadline 2026-11-01) |
| P4 | Lead time per cake type. Can customers order a cake for tomorrow? If so, until what time (placeholder « avant 14 h pour demain »)? | L3 « gâteau pour demain » is the first of the 10 priority prompts (score 19/20); `/gateau-pour-demain/` only if confirmed; the capacity engine needs `leadDays` · 05 §0.9, §10; 02 §0.6; 04 P13; 10 §3.1; 12 B1, §6 | table + hour | **BLOCKER** |
| P5 | Current volumes: custom-cake requests a week, phone orders a day, completed orders a week. Can you export order history? | Sizes the Demandes flow and the cost scenarios; review-velocity formula; "most ordered size" needs N ≥ 30 orders · 10 §12; 11 §4.6; 16 §9 #9, #11; 02 §10.1 #13 | numbers (rough is fine) | Week 1 |
| P6 | How do you confirm a custom design today (photo, written recap, approval)? What happened in the reported January 2026 complaint (chocolate ordered, vanilla with chocolate cream received), and what changed since? | The order flow must design this out: written recap, reference photo, approval before production, in the interim request form too · 01 §6; 02 §0.2; 12 E11 | text | Week 1 |
| P7 | Your own portion standards per pan size | Portion calculator and the I3 answer (« quelle grosseur de gâteau pour 20 personnes ») with CAD and inch sizes; videos 1–2 · 05 §6; 11 §5; 04 evidence pass (one home-recipe data point only) | table | Later (week 5) |
| P8 | Unit weight in grams of each single-serving sweet item; sold loose or prepackaged; pack sizes | Tax class: GST applies under 6 single servings; QST is zero-rated on them since 2026-07-15; one ruling draws the line at 230 g. A product without an approved class can't be sold online · 07 §6, A7, S9; 10 §14 #5 | column in the P1 table | Later (week 6) |
| P9 | Custom cakes: who sets the price; is there a grid; is a reply within 24 h realistic; how long is a quote valid (placeholder 72 h); up to how many portions or tiers can a cake be paid by deposit without a quote (placeholders 30 / 3); maximum message length (placeholder 30 characters) | Demandes screen and the instant-deposit vs quote rule · 10 §4, §5.2; 16 §9 #9 | text + numbers | Later (week 6) |
| P10 | Seasonal items: which were sold in earlier years? | Availability markup: a returning seasonal item = `BackOrder` + date; `PreOrder` only for a never-sold product · 06 (k); 10 §8, §14 #5; 12 M21 | Y/N per item | Later |
| P11 | Licensed characters on kids' cakes: do you make them? Your policy? | FAQ « Pouvez-vous faire un gâteau avec un personnage? » needs the owner's policy (plus a legal view) · 02 §5 #6 | Y/N + text | Later |
| P12 | Corporate boxes, only if offered: items per person; invoices with GST/QST numbers; payment by company card | Corporate page P14 and invoices · 02 P3; 10 §2 | text | Later |
| P13 | Approve the copy and prices of the first French pages before they go live | Weeks 3–4 owner input; the weeks 3–6 gate needs no marker left · 12 §6 | "approuvé" or corrections | Later (weeks 3–4) |
| P14 | « Voulez-vous que les clients puissent réserver en ligne des produits de la vitrine du jour, payés à la commande? » | The Vitrine flow ships at MVP-O only if wanted · 00 §7; 02 P7; 15 D12 | Y/N | Later (week 6) |
| P15 | « Avez-vous une saveur de la semaine ou une rotation régulière? » | `/saveur-de-la-semaine/` and F32 are gated on it · 00 §5.2 row 25; 08 P8 | Y/N + rhythm | Later |
| P16 | « Offrez-vous quelque chose de particulier aux visiteurs du Zoo ou aux touristes? » | The visitor page (04 P16) ships only with a real offer · 00 §5.1; 02 P4 | text | Later |

## 4. Allergens, permits and compliance (A)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| A1 | The real allergen list for each product (eggs, milk, mustard, peanuts, crustaceans and molluscs, fish, sesame, soy, sulphites, tree nuts with the nut named, wheat and triticale, plus barley, oats and rye) and the kitchen's real cross-contact practices. Who will verify and stamp each product? | « Contient : … » block on every product page and box label; publish guard G3; a recipe change voids the stamp; never AI-written · 07 A-3, A-5, A-8, §7; 12 E2, §5.2; 16 G3 | checklist per product | Week 1 |
| A2 | Your allergy policy for customer questions. Do you make anything nut-free, gluten-free or vegan, and how? | « Sans gluten » in advertising (website included) is a regulated claim: no gluten protein, ≤ 20 ppm from cross-contact. No free-from claims at launch · 07 A-6, A-7, S10; 12 B2 | text | Week 1 |
| A3 | MAPAQ permit number(s) and category (retail, restaurant or both) | Whether the permit covers online orders picked up (and delivery later) is open; it blocks labels · 07 A-1, A-2; 10 §7; 01 §12 #13 | photo of the permit | Week 1 |
| A4 | Person in charge of personal information (by default the owner): name, title, email | Loi 25 s. 3.1: title and contact details published on the site; needed before the first form collects data (week-2 infrastructure gate) · 07 P1, S5; 12 E7; 16 §9 #17 | text | Week 1 |
| A5 | Do you have an accountant and a lawyer we can send the 07 §8 questions to? GST and QST registration numbers? | The accountant signs every tax row (07 §6); the lawyer decides Consent Mode, deposit refunds, the EN/ES checkout box and CASL wording · 07 §6, §8; 10 §14 #7; 02 P3 | names + numbers | Week 1 |
| A6 | Which items leave the shop packed (boxes, bags), and are any labelled today? | Labelling exemptions are unverified; this decides box labels and the label printer · 07 A-4; 16a §3.6; 16 §8.1 | list | Later |
| A7 | Is any staff member paid to post? Any influencer deal? | Disclosure rules (Ad Standards); refused-tactics clause · 07 §8; v1 §10 | Y/N | Later |

## 5. POS, payments, delivery (O)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| O1 | Which POS or payment terminal: brand, plan, number of terminals, receipt or kitchen printer? Does it print online orders? Must walk-in sales stay on it? | Decides Square vs Stripe, where online orders appear, and the printing path · 10 §0, §1.3, §14 #1; 16b §0; 16a §12; 12 E10 (deadline week 2) | brand + photo of the terminal | **BLOCKER** |
| O2 | Is there already a Stripe, Square or Moneris account? In whose name? | The account must belong to the bakery, not the agency · 10 §14 #2; v0a §4.1 | Y/N + holder | Week 1 |
| O3 | Delivery: offered? If yes, radius, fee, days | Launch is pickup-only by default (no `areaServed` until delivery is real); the delivery-fee tax status is open · 01 §5, §12 #12; 12 E3, A4; 07 §6 | Y/N (+ details) | Week 1 |
| O4 | Deposit for custom cakes: % or fixed amount; refundable or not, and from when; cancellation deadline; no-show rule. Full payment at order for holiday pre-orders: OK? | `depositPercent` has no default until the owner sets it; refundability goes to counsel (lawyer Q7); refunds are due within 15 days of a valid cancellation · 10 §1.2, §14 #6; 07 O7, O8, O14; 16 §9 #10; 12 §6 (week 6) | numbers + text | Later (week 6) |
| O5 | Payment methods accepted today (cash, debit, credit, foreign cards, Apple Pay) | Zoo visitors with foreign cards cost more online (Stripe +0.8 %; Square +1.5 % since 2026-03-03); the price is the same for every method · 02 §10.1 #10; 10 §1.1; 07 C-10 | list | Later |
| O6 | Accounting software, and are company invoices needed? | Corporate invoices: Stripe/Square invoicing or the accountant's tool · 10 §13, §14 #10 | text | Later |

## 6. VPS, domain and account ownership (T)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| T1 | Your VPS: provider, data-centre city, plan (vCPU, RAM, disk), OS, IPv4/IPv6, backup or snapshot option; who has root/SSH access? | The requirements leave provider and location open, which blocks the Loi 25 s. 17 assessment; target is a Québec data centre with ≥ 4 vCPU / 8 GB / 75 GB NVMe (est.) · requirements; 17 §0, §7.3, §14; 07 §2; 16b §0 | control-panel screenshot + **access** | **BLOCKER** |
| T2 | Domain cocovanillegranby.com: registrar, registrant name, who has account access, renewal date, current DNS host. OK to register cocovanillegranby.ca in the legal name (CIRA rules), plus cocovanille.ca if free? | DNS, TLS, mailbox and the Search Console Domain property depend on it; scheduled weeks 0–1 · 17 §10.1, §14; 12 E13, §6 | registrar + **access**; Y/N | **BLOCKER** |
| T3 | Mailbox: Microsoft 365 or Google Workspace? Which addresses (e.g. bonjour@, commandes@)? | The GBP API application needs a mailbox on the site's domain; created in week 1 · 17 §9.2; 16b §5 | choice + list | Week 1 |
| T4 | Instagram: is @coco_vanillegranby the right account? Is it a professional, public account? Who is admin? Follower count and last post date? Any TikTok, Pinterest or YouTube account? | No search surfaced the handle. Needed for `sameAs`, the search-engine indexing toggle (self-test 5) and Search Console platform properties · 01 §7, §12 #8; 18 §2; 12 D6 | handle + screenshot of Settings › Privacy | Week 1 |
| T5 | Facebook page /PatisserieCocoVanille and Meta Business: who is admin? Is the page in a Meta business portfolio owned by the bakery? | The business owns every account; the agency gets user access only. Facebook "About" is aligned in week 1 · v0a §4.1; 12 §2, §6; v0b decisions | names + **access** | Week 1 |
| T6 | Have Apple Business, Bing Places, Yelp, Foursquare or Tripadvisor ever been claimed? By whom? | Claims run in weeks 1–2 from the NAP file; Bing imports from a finished GBP · 11 §0.2, §1.1, §7 #2; 06 (c) | Y/N per listing ("je ne sais pas" is fine: the operator checks) | Week 1 |
| T7 | Any old link-in-bio (Linktree…), Square Online or Facebook shop URL? | Redirect map before the holding page · 17 §10.2 | URLs | Week 1 |
| T8 | Who gets outage alerts (operator only, or you too), on which phone? Does the shop have a fixed internet IP? | Monitoring; optional allowlist on `/admin` « Avancé » · 17 §14; 16 §6.1; 16b §4 #12 | text | Later |
| T9 | « Acceptez-vous que des robots d'IA utilisent le contenu du site pour s'entraîner? Les robots des moteurs de recherche restent permis dans tous les cas. » | Owner-made training choice in robots.txt (it ships with the W1 holding page) · 15 D15; 06 §3 #5; 00 §5.1 | Y/N | Week 1 |
| T10 | « Approuvez-vous ces cibles après une panne : au plus 15 minutes de commandes perdues et le site rétabli en 2 heures? » | Backup and restore targets (RPO ≤ 15 min, RTO ≤ 2 h) · 17 §8.4; 00 §11 | Y/N | Later (before W11 PITR) |

## 7. Photos and brand assets (B)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| B1 | Logo files (vector if possible) and any colours or brand guide | Holding page, site, boxes · v0c §13 | files | Week 1 |
| B2 | Your best existing photos, with permission to use them and consent from anyone shown | Gates require real photos only · v1 L19; v0c §13; 12 E5; 01 §12 #5 | files or album link | Week 1 |
| B3 | A date for a half-day photo shoot in week 2 (window light, cross-sections, confirmed products only) | Unplanned and unbudgeted in every plan · 12 E5, §6 | date | Week 1 |
| B4 | Who takes the daily display-case photo, and at what time? | Vitrine screen job J2 · 16 §1.2, §9 #18 | name + time | Later |
| B5 | Your most-liked Instagram posts, three sites you love, the rivals you watch | Input for the design concept (later topic; directions A/B/C are chosen after the Instagram review) · v0c §7, §13; 08 §6 | links | Later |

## 8. Chef and "about" story (C)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| C1 | Owner and chef names, roles, training and background; consent to publish names and photos | `/a-propos/`, the chef page and Person schema (E-E-A-T). Without consent, About ships without the chef page · 01 §12 #5; 12 E14; 11 §5 (video 18) | short bio + Y/N | Later (week 3) |
| C2 | The founding story: when the shop opened (the corporation dates from 2021-11-08/09), any earlier business or Coco Vanille location at 3 rue Court, and why the name | `foundingDate`; About page · 01 §1, §12 #6; `data/facts.json` | text | Later |
| C3 | Directors and shareholders (from the REQ), only if a founder entity is wanted | Person / founder schema · 01 §12 #18 | Y/N | Later |

## 9. Staff, devices, printers (D)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| D1 | Who can run a 20–30-minute check from a phone in Granby: search the prompts, take dated screenshots, weekly (or at least monthly)? | The baseline must come from a phone in Granby; nobody is named. Fallback: a SERP API set to Granby + a monthly owner check · 12 E12, §6; 05 §9; 06 §4; 18 §2 | name + day | **BLOCKER** |
| D2 | How many people work at the counter and in the kitchen? Who will use Studio, and who will update the site day to day? Is there a manager? Does anyone need Studio in English? | Roles (Propriétaire, Comptoir, Gérant·e) and the time budget per role · 16 §1.1, §9 #2; v0c §13 | numbers + roles | Week 1 |
| D3 | Devices: your phone (iPhone or Android)? A shared tablet at the counter, or phones only? Wi-Fi and phone signal in the kitchen and back room? | PWA install path, offline design, push support · 16 §9 #3, #5; 16a §12; 16b §0, §3 | text | Week 1 |
| D4 | Printers you already have (receipt, kitchen, label). A label printer now or later? | Printing path; box labels · 16 §9 #16; 16a §12 #7; 10 §14 #1 | list + choice | Later |
| D5 | May staff close the shop or pause online orders, or only you? Who replies to reviews? Are AI-drafted replies OK (sent to the Claude API in the US with names removed, so a privacy assessment is needed)? | Roles and guardrails · 16 §9 #12, #14; 07 §2 | text | Later |
| D6 | Which events should push to your phone, and quiet hours? Is a Monday summary by email fine? Should all phone orders go into Studio? At pickup, check the 4-digit code every time, or is the name enough? | Notification tiers; the Monday email; one order queue · 16 §9 #11, #13, #15, #19; 16a §12 #5 | text | Later |

## 10. Capacity per day (K)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| K1 | Your real production categories, and how many units of each you can make per day | The capacity engine (placeholders: `gateaux`, `viennoiseries`… e.g. 6 cakes a day); macarons and bûches are not evidenced · 10 §3.1, §14 #4; 02 §10.1 #5 | table | Later (week 6) |
| K2 | How many pickups can the counter handle per 15 minutes at peak (placeholder 4)? Which days and weeks are busiest? | Pickup windows and holiday date-first mode · 10 §3.1; v0c §13 | number + text | Later (week 6) |

## 11. Languages served (L)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| L1 | Who can serve customers in English (counter, phone, email)? | EN pages (home, menu, order, visit, about, pillar) for visitors; the EN order flow depends on it · 12 M10, §6; 05 §6 (L9) | names | **BLOCKER** |
| L2 | Does anyone on the team speak Spanish? Do Spanish-speaking customers come today? | ES pages (3–5) only if someone answers in Spanish; « Hablamos español » only if true; WhatsApp is dropped at launch · 12 M10, M11; 01 §12 #17; v0b A1 | Y/N + names | **BLOCKER** |
| L3 | One word each: « cueillette » or « ramassage »? « acompte » or « dépôt »? « tu » or « vous » with customers? In Spanish, « tú » or « usted »? | One term on the site, in Studio, emails, SMS and the GBP · 04 §0.11, §3.2; 12 C22; 16 §9 #6–7; 10 §6 | 4 choices | Later (week 6; wanted for the admin session) |

## 12. Budget (M)

| ID | Question | Why it matters (what it blocks · file) | Format | Priority |
|---|---|---|---|---|
| M1 | Your monthly ceiling, all-in | No plan has a total budget. Known estimates: fixed hosting + SMS + email ≈ C$27–65/month (computed in 00 §11 from 17 §11's corrected C$25–55 and 10 §12's message lines; 10 §0's C$37–75 used the old C$35 floor) + ≈ 3.4–3.6 % of online sales in card fees (10 §12, est.); SEO tools US$0 → ≈ US$25 (SerpApi Starter, secondary) only when 3 weekly runs start (12 D7, §5.3); AI-engine API runs [[FACT NEEDED]] (12 G6). v1 §15's '≈ US$62 as of Sep 28, 2026' has no source (R18 #16) · 12 F8, §5.3 | $ per month | **BLOCKER** |
| M2 | One-time amounts for: a half-day photo shoot, a native English reviewer, the lawyer review, the accountant review | Unpriced in every plan · 12 §5.3, E5 | $ or Y/N each | Week 1 |

---

## 13. Not owner questions (kept out of the list above, with who answers)

| Item | Who | File |
|---|---|---|
| Road and walking distances from 3 rue Court (Zoo, market, Lac Boivin, nearby towns) | Operator: compute from the verified geo point, never calculator sites | 01 §9.2, §9.5 |
| Zoo visitor origin; large Granby employers; 2021 Spanish census table | Operator: ask Tourisme Granby région / the Zoo; Granby Industriel; StatCan | 02 §1, evidence pass; 01 §9.3 |
| Newsroom contacts; tourism and chamber membership fees | Operator, manual | 11 §7 |
| CIPO search; CAI PIA template; OQLF checks; CNESST holiday list | Operator | 07 §10; 04 §8; 12 §7 |
| Legal and tax questions (Consent Mode, deposits, CASL, tax classes) | Lawyer, accountant (contacts from A5) | 07 §8 |
| Payload plain-JS spike; label test print from iPad Safari; vendor price checks | Operator | 12 D5; 16a §3.6; 10 §15 |
| Owner self-tests (GBP food-ordering section, Apple actions, Instagram toggle, Ask Maps…) | Owner, as tasks once access exists (S2, T4–T6) | 06 §4; 18 §2 |

---

## 14. Message to the owner (Québec French, top 15)

Send as is. It asks the BLOCKER items first (S6 is a signature: the message announces it and the one-page clause goes separately) and two items with a real date. Everything else comes later, one topic at a time.

> **Objet : 15 questions pour bien démarrer le site de Coco Vanille**
>
> Bonjour,
>
> Merci de prendre quelques minutes pour m'aider à préparer le site cocovanillegranby.com et l'outil de gestion de la boutique.
>
> Avant de construire quoi que ce soit, j'ai besoin de vos réponses à 15 questions. En ligne, plusieurs sites affichent des heures différentes pour la pâtisserie, et une réponse générée par l'IA en reprend déjà une qui ne concorde pas. Vos réponses deviennent la seule source officielle : on les entre une fois, et le site, Google et les autres fiches les reprennent partout.
>
> Des réponses courtes suffisent. « Je ne sais pas » est une bonne réponse. Une photo, un message vocal ou un appel de 20 minutes, c'est comme vous préférez.
>
> Deux dates à retenir : la question 4 avant le **1er novembre** (précommandes des Fêtes) et vos heures des Fêtes avant le **1er décembre** (Google).
>
> 1. La pâtisserie est-elle ouverte en ce moment? Votre fiche Google indique-t-elle « temporairement fermé »? Qui a l'accès propriétaire de cette fiche?
> 2. Pouvez-vous m'envoyer une photo de l'enseigne (pour le nom exact : « Coco Vanille » ou « Cocovanille »)? L'adresse 3, rue Court et le 450-372-7177 sont-ils exacts? Le 450-372-5917 vous dit-il quelque chose?
> 3. Quelles sont vos heures d'ouverture, jour par jour, et vos jours de fermeture? Et vos heures des Fêtes, du 24 décembre au 2 janvier?
> 4. Faites-vous des bûches de Noël cette année? Quel est votre menu des Fêtes 2026 (vol-au-vent, etc.), et à partir de quand prenez-vous les précommandes?
> 5. Pouvez-vous m'envoyer la liste de vos produits avec les prix, les formats et le nombre de portions? Une photo de votre menu ou une liste à la main, c'est parfait.
> 6. Combien de jours d'avance faut-il pour chaque type de gâteau? Peut-on commander un gâteau pour le lendemain? Si oui, jusqu'à quelle heure?
> 7. Lesquels offrez-vous (oui ou non) : gâteaux de mariage, gâteaux thématiques pour enfants, « smash cake », macarons, chocolatines, boîtes pour le bureau, produits sans gluten ou véganes, cartes-cadeaux, livraison (si oui : zone, frais et jours)?
> 8. En gros, d'où viennent vos ventes : comptoir (viennoiseries, pains, café), gâteaux sur commande, marché public, pains surgelés? Et combien de demandes de gâteaux personnalisés recevez-vous par semaine?
> 9. Quelle caisse ou quel terminal de paiement utilisez-vous (marque)? Imprime-t-il les commandes? Avez-vous déjà un compte Stripe, Square ou Moneris, et à quel nom?
> 10. Qui, dans l'équipe, peut servir les clients en anglais? Et en espagnol?
> 11. Pour l'hébergement : chez quel fournisseur est votre serveur (VPS), et dans quelle ville? Pour le nom de domaine cocovanillegranby.com : chez qui est-il enregistré, à quel nom, et qui a l'accès?
> 12. Le compte Instagram @coco_vanillegranby est-il bien le vôtre? Qui est administrateur d'Instagram, de la page Facebook et de Meta Business? Vous restez propriétaire de tous vos comptes : je demande seulement un accès de gestionnaire.
> 13. Quels allergènes contient chacun de vos produits, et quelles précautions prenez-vous contre la contamination croisée? Quel est le numéro et la catégorie de votre permis du MAPAQ?
> 14. Quel budget mensuel maximal voulez-vous consacrer au site et aux outils? Avez-vous aussi un montant prévu pour une séance photo, un avocat et un comptable?
> 15. Quelqu'un à Granby pourrait-il faire une petite vérification de 20 à 30 minutes sur son cellulaire, idéalement chaque semaine (quelques recherches et des captures d'écran)? Je fournis la liste.
>
> Je vous enverrai aussi une courte entente d'une page à signer : pas de faux avis, pas d'avis achetés, récompensés ou filtrés, pas de quotas d'avis pour l'équipe, pas de mots-clés ajoutés au nom de la fiche Google, pas de publication payée sans le dire.
>
> Le reste (photos, histoire de la pâtisserie, équipe, appareils) viendra plus tard, une question à la fois.
>
> Merci beaucoup!
>
> Yahya
