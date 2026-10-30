# 21 · Agency decisions under the owner-agency mandate (2026-10-29)

Mandate (Yahya, the agency operator, 2026-10-29): « take all decisions based on what I give and web research, and
make the full thing ready ». This file records what was decided, what was found and applied, and what was deliberately
**not** decided. It binds like research/15 decisions until the owner changes one in writing (most are settings or
sentences she can change in Coco Studio).

Method and limits:
- Facts come only from public or owner sources: research/20a (identity and history) and research/20b (products and
  offers), both of 2026-10-29. The three other research steps planned for that day (place and access, policy
  benchmarks and law, infra and accounts) did not run: the account's spending limit stopped them. Their topics stay
  open below. **Update, same afternoon:** they ran (research/20c, 20d, 20e). What the agency took from them is in §6;
  §4 and §5 are updated.
- Decisions are agency defaults for administrative policies, based on research/15 (D12), research/07 (C-13, O8, A9)
  and the law named in each row. Operational promises that bind the kitchen (lead times, next-day cakes, capacity)
  and food-safety facts (allergens) are **not** decided by the agency.
- Applied in `apps/web/src/seed/content.js` (FR + EN copy), `apps/web/src/seed/index.js` (Business global) and
  `apps/web/src/components/templates/index.js` (privacy page). Unit tests: 469 of 472 pass (the one failure is the
  Windows-only path case in media.test.js); `test/unit/content.test.js` was updated where it asserted a placeholder
  that is now a published fact (the workshops).

## 1. Decisions applied to the site

| # | Topic | Decision (site wording) | Basis | Who can change it |
|---|---|---|---|---|
| A1 | Person in charge of personal information | Published as a title and a contact: « Propriétaire, responsable de la protection des renseignements personnels », confidentialite@cocovanillegranby.com. No name is published; the privacy page shows a name only if one is entered | Loi 25 (Act respecting the protection of personal information in the private sector) s. 3.1 (by default the person with the highest authority) and s. 3.2 (the title and contact information are published on the website). Mailbox created at launch | Owner (name, title, address) in Studio › Réglages |
| A2 | Shop email | bonjour@cocovanillegranby.com on the contact, terms and accessibility answers | Needed by the conditions of sale and the accessibility page; mailbox created at launch | Owner |
| A3 | Delivery | « non offerte; toutes les commandes se récupèrent à la boutique » | The site is built for pickup (« Cueillette en boutique seulement »); the shop's posts say « sur place ou à emporter » (20b); no delivery evidence anywhere | Owner |
| A4 | Custom-cake deposit | 30 % of the quoted price at acceptance; balance at pickup | research/15 D12 (separate deposit charge, 20–30 %); the checkout already splits deposit and balance; refund rule written in the conditions before payment (07 C-13, O8) | Owner (Studio › ordering rules); counsel for the refund wording |
| A5 | Gift cards | « Le site ne vend pas de cartes-cadeaux pour l'instant »; for the counter, call the shop; « au Québec, une carte-cadeau n'a ni date d'expiration ni frais » | No evidence of gift cards (20b N-10); the expiry/fee rule is the Consumer Protection Act's | Owner |
| A6 | Order not picked up | Ready until closing on the planned day; another time that day by phone; fresh products are not kept beyond that day and the amount paid is then not refunded | Perishable goods made for the customer; wording in the conditions of sale, flagged for counsel (07 C-5, C-13) | Owner; counsel |
| A7 | Workshops | Fri–Sun, painting or bead-and-rhinestone decoration of an item of your choice, 2 h 30, 37 $ per person with materials, a drink and a slice of cake, limited places, booked at **438-528-7818** (the site said 450-372-7177) | The shop's own reel, 2026-10-22, and pinned post, 2026-08-25 (20b §0.4, verified) | Owner |
| A8 | Café | Drinks listed as the shop published them in 2026 (café, espresso, cappuccino, latte, macchiato, thé, tisane, chocolat chaud; café glacé, moka glacé, matcha), to stay or to go; prices and seats stay a marker | 20b §0.2 (verified) | Owner |
| A9 | « Sans gluten » | Sentences now describe the site (« Ce site ne présente aucun produit comme « sans gluten »… ») because the shop itself advertises gluten-free options on Instagram; the site still makes no regulated claim | 07 A-6; 20b §0.7–0.8. The owner is told that her post makes a regulated claim | Owner + counsel |
| A10 | Instagram | @coco_vanillegranby verified (public, active, same bio and phones): now in the footer and the structured data `sameAs` | 20b §0.1 | — |

The wording of A4, A5 and A6 was corrected the same afternoon after the law check (research/20d): see §6.2.

## 2. Decisions taken, applied elsewhere

| # | Topic | Decision | Where |
|---|---|---|---|
| B1 | Prompt set | The swap recommended in docs/19 §3.3 is adopted: the five wedding prompts (I5, I9, C3, C7, C9) leave the tracked set; X1 « pâtisserie Granby », X3 « gâteau d'anniversaire Granby », X7 « croissants Granby », X2 « boulangerie Granby » and X12 « café pâtisserie centre-ville Granby » enter. Applied in the scoreboard at the freeze run of Monday 2 November 2026 (docs/02) | scoreboard/prompts.csv, data/prompts.csv |
| B2 | Category sentence | Option B, as built (« …pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande ») | research/15 D19 |
| B3 | Words | « cueillette », « acompte », « vous » (already used everywhere) | research/15 D21 |
| B4 | Spanish | Stays off until someone serves customers in Spanish | 15; Charte de la langue française |
| B5 | Online ordering | Opens 11–24 January 2027, after the holiday rush (M20); the demo catalogue on the dev database is never shipped | research/12 M20 |
| B6 | Display name | « Pâtisserie Coco Vanille », with « Pâtisserie Cocovanille » as an alternate name in the structured data; the legal name on terms, confirmations and receipts | 20a §0.2 (the Registraire's rules) |

## 3. Facts found and used (research/20a, 20b)

- **Legal entity, verified at the Registraire:** Pâtisserie Coco Vanille inc., NEQ 1177082220, société par actions, constituted 2021-11-08, registered 2021-11-09, « Immatriculée », activity 6013 « Boulangeries et pâtisseries », seat and only establishment at 3, rue Court (20a §0.1).
- **The domain cocovanillegranby.com is not registered** (Verisign RDAP 404, WHOIS « No match », 2026-10-29). Nor is the .ca. **Launch blocker:** register both in the corporation's name this week (14 T2).
- **Trading in October 2026:** Instagram newest post 2026-10-22; Marché public 2026 exhibitor list (20a §0.5, 20b §0.1). The Google listing is probably not marked « temporarily closed » (unverified).
- **Google rating:** 4.9 (41 reviews per a Wanderlog copy, undated; « 40+ » per RestoMontreal at 2026-07-15) — unverified copies; nothing changes on the site (no `aggregateRating`).
- **Offer, as the shop lists it (pinned post 2026-08-25):** viennoiseries and croissants, fresh bread, pâtisseries, custom cakes for birthdays and special occasions, Moroccan specialities (msemmens, harchas), hot and cold drinks, a place to sit. The six product pages of the site rest on older review summaries (unverified) and stay as they are until the owner confirms them.
- **Not found anywhere:** bûches de Noël for any year, a holiday menu, wedding cakes, macarons, chocolatines by name, lead times, deposits, gift cards, payment methods, any product price.

## 4. Deliberately not decided (still the owner's, or a professional's)

| Topic | Why the agency does not decide it |
|---|---|
| Allergens and cross-contact practices | Food safety: a person at the shop verifies them (07 A-1 to A-3) |
| Prices, portions per size, product list confirmation | Only the shop can publish its prices; inventing them would mislead customers |
| Next-day orders, cut-off hour, minimum lead time per cake, change deadline | They commit the kitchen's capacity. Market benchmarks only (20d §4): menu cakes 24 h to 48 business hours (Avec un Grand A, Granby); custom cakes about 3 weeks (Rose Gâteaux, Granby) to 1 month; no Québec bakery reached publishes a next-day cut-off hour |
| Bûches de Noël 2026 and the holiday menu | No evidence; the page stays unpublished until the owner says yes |
| Holiday hours 2026 | The owner's calendar |
| Entrance accessibility (steps, threshold, door, ramp) and a landmark at the door | No public source describes them (20c A-1, L-1): the markers stay. Parking and the distance from the Zoo are now answered from public sources (§6.1) |
| Free-cancellation window, longest cake message, waiving the balance of an uncollected custom cake | Optional policies the owner chooses. Without a window, the actual-cost refund rule of §6.2 applies alone; no Québec benchmark for the message length (20d §4) |
| Gift cards at the counter; payment methods at the counter and for deposits | The shop's own practice (20b N-11). A card sold at the counter comes with its conditions of use and a way to check the balance (LPC s. 187.2, 20d L-11) |
| Opening date, chef story, team | Not public; the owner's to give |
| Legal pages (conditions, privacy, cookies, accessibility) | A lawyer signs them off (07 §8); the agency drafts only. The deposit-refund, gift-card, pickup and card-issuer sentences now follow the law as 20d read it (§6.2); counsel's questions are in 20d §5 |
| Tax classes; retention of tax records | The accountant confirms them (07 T-rows). The 6-year GST/QST retention (20d L-21, unverified) stays a marker on the privacy page until then |

## 5. What the owner now has to give (ranked)

1. **Today:** a « go » to register cocovanillegranby.com and cocovanillegranby.ca in the name « Pâtisserie Coco
   Vanille inc. » (both still free at 13:11 UTC on 2026-10-29; the .com registry price rises on 2026-11-01), yes or
   no to cocovanille.ca, and a company card for the accounts (20e §7; docs/13 §A0).
2. Allergens per product, checked by a person (blocks 14 pages).
3. The product list and prices, portions per cake size (blocks the menu, prices, calculator).
4. Next-day rule, cut-off hour, lead times per cake type and the change deadline (blocks /gateau-pour-demain/, the
   #1 priority prompt; market benchmarks in 20d §4).
5. Bûches 2026 yes or no, and holiday hours (seasonal; due 1 and 30 November).
6. One photo of the storefront from the sidewalk, and five lines on the entrance: steps (how many, how high),
   threshold, door width, push, pull or automatic, which door, ramp or bell (20c §9; 14 H5). The same photo answers
   the sign (14 S3) and what customers see at the door. Also: does a « Pâtisserie Hygge Factory » exist at 17, rue
   Court (20c S-1)? And the opening date.
7. Payment methods at the counter and for deposits (14 O5); gift cards at the counter, yes or no; the corporation's
   CRA Business Number (for Twilio's toll-free verification); who receives outage alerts, on which phone (14 T8;
   20d §5, 20e §7).
8. Optional: a free-cancellation window, the longest cake message per size, waiving the balance of an uncollected
   custom cake (20d §5).
9. Approval of the decisions above, §6 included (one reply is enough).

Professional and agency tasks this week:
- **Agency, with the owner:** the week-0 checklist in docs/13 §A0 (from 20e §5): the Cloudflare account and both
  domains, the OVHcloud VPS-2 at Beauharnois, DNS, Exchange Online with the shared mailboxes bonjour@ and
  confidentialite@, SES in ca-central-1 and DMARC, the two backup stores and a first restore test before any launch,
  monitoring, Search Console and Bing Webmaster Tools; the Google Business Profile link on go-live day only.
- **Lawyer** (20d §5, with 07 §8): is an online or phone custom-cake order a sale of perishable goods, exempt from
  the distance-contract rules, or a contract for work? Sign off the deposit-refund, pickup and card-issuer sentences
  (§6.2); the current consolidated text of LPC ss. 11.4, 13 and 187.1–187.5 and any s. 187.5 threshold; whether a
  review request is a commercial message under CASL; the privacy page's own complaint route and its effective date.
- **Accountant:** the tax classes (07 T-rows); the 6-year retention of GST/QST records (20d L-21); GST/QST on the
  services billed from outside Québec (20e §7).

## 6. Update of 2026-10-29, afternoon: place, policies and infrastructure (research/20c, 20d, 20e)

The three research steps that §4 listed as not run did run: research/20c (place and access), 20d (policy benchmarks
and law) and 20e (infrastructure and accounts), with their twins `data/research-place.json`,
`data/research-policies.json` and `data/research-infra.json`. This section records what the agency applied from them,
under the same mandate and on the same terms as §1: each item is « Décision de l'Agence du 29 octobre 2026 (mandat de
Yahya), modifiable par la propriétaire ». **Not legal advice:** a lawyer still signs off the conditions of sale and the
privacy policy (07 §8).

### 6.1 Public facts applied to the site

| # | Topic | Site wording (French; English adapts it) | Basis | Where |
|---|---|---|---|---|
| F1 | Parking | « Le stationnement municipal Centre-Court, entre les rues Court et du Centre, est à environ 100 m de la boutique. Comme tout le stationnement municipal du centre-ville de Granby, il est gratuit. » The Visit page adds: 4 h and 2 h spaces limited Monday to Friday, rows with no time limit, 2 h on rue Court, the Johnson lot (18, rue Johnson) across rue Principale at about 150 m, and « Suivez toujours les panneaux. » Its parking row reads « Gratuit au centre-ville de Granby; le stationnement municipal Centre-Court, entre les rues Court et du Centre, est à environ 100 m. » | The City's traffic by-law 1885-1990, consolidation revised 2026-09-18: no meters since 2021-06-12, lot plans in force since 2026-06-12 (20c P-1…P-8, P-10, verified). Distances computed on OpenStreetMap, so « environ ». 20c PL-1 | `content.js` `PARKING_*` (home and FAQ answers, Visit section); `PARKING` → the Business global's `parking` (FR, EN) in `seed/index.js` |
| F2 | The Zoo | « La Pâtisserie Coco Vanille est à environ 5 à 8 minutes en auto du Zoo de Granby (3 à 4 km selon le trajet), sans compter la circulation. Le Zoo est au 1050, boulevard David-Bouchard Nord. » | The range two routing engines agree on (20c Z-8) and the Zoo's own visitor address (Z-1); never its postal address (Z-2). 20c PL-2 | `content.js` `ZOO_*`: Visit section (FR, EN), the English order and FAQ pages |
| F3 | Privacy: response time for access requests | « délai de réponse : 30 jours au plus » | CAI: the person in charge must « y répondre dans les 30 jours » (20d L-19, verified) | Privacy page, « Quels sont vos droits? » (FR, EN) |
| F4 | The map point | `geo` 45.3995807, -72.7250821 is now verified; no value changes | 20c G-1…G-3; PL-4 | `data/facts.json` (`entity.geo.status`; new facts `parking.downtown` and `distance.zoo`; two `fact_needed` rows narrowed) |

One departure from 20c's candidate copy: the site does not call Centre-Court « le plus proche ». On foot, Johnson's
listed address is about as close (about 120 m each, 20c P-7, P-10), and the City lot behind the Palace (P-11) was not
measured. An OpenStreetMap check on 2026-10-29 confirmed that the Johnson lot lies south of rue Principale, across
from the shop.

Held back (markers kept, or not written):
- The entrance and its access (20c A-1, PL-3): the markers « marches, largeur de porte et accès en fauteuil roulant »
  stay on the Visit and accessibility pages.
- A landmark at the door (20c L-1, L-2): the marker « repère visuel près de la boutique, approuvé par le
  propriétaire » stays; « à quelques pas de la rue Principale » waits for the owner's agreement.
- The two accessible spaces of Centre-Court (P-6): not written until the City says who may use them (20c §9, item 5).
- Holiday parking (P-13, PL-5): time limits are lifted in four lots from 7 December 2026 to 3 January 2027. It goes on
  the holiday page only if that page is published.
- Tax-record retention on the privacy page (20d L-21): unverified; the marker stays until the accountant confirms the
  6 years.

### 6.2 Corrections to A3–A6 after the law check (20d)

| Decision | 20d's verdict | Correction applied (French; English adapts it) | Where |
|---|---|---|---|
| A3 Delivery | Lawful: no rule requires delivery (L-16); in line with the Granby shops read (M-5) | **None.** 20d's shorter answer is optional and not a legal point, so it was not applied | — |
| A4 Deposit, refund | 30 % is lawful (no cap, L-5) and in line with the market (M-18, M-22). The refund rule is bounded by law: no amount or percentage fixed in advance and no « non remboursable » (LPC s. 13, L-1; OPC, L-4); for a contract for work, the customer may cancel at any time and owes only the work done and the costs incurred (LPC s. 11.4, CCQ arts. 2125 and 2129; L-2, L-3) | The conditions marker « règle de remboursement de l'acompte, à rédiger avec l'avocat » is replaced by 20d §3.2: « L'acompte réserve votre date et s'applique au prix du gâteau. Si vous annulez, la boutique vous rembourse l'acompte, moins les frais qu'elle a réellement engagés pour votre gâteau avant l'annulation, comme les ingrédients ou les décorations achetés pour vous et le travail déjà fait; elle vous en remet le détail par écrit. Le remboursement est versé dans les 15 jours suivant l'annulation. » The conditions FAQ « Puis-je annuler une commande en ligne à n'importe quel moment? » now answers « Non, sauf pour un gâteau personnalisé », which can be cancelled at any time, the deposit refunded less the costs already incurred | `conditionsDeVente` (FR, EN) |
| A4 Deposit, payment method | If a custom cake is not a « vente de biens susceptibles de dépérir rapidement » (L-9, L-10: for counsel), a payment before delivery on an online or phone order may be taken by credit card only (L-7) | **New decision, pending counsel:** custom-cake deposits are taken only by credit card, through the checkout or a payment link; no Interac e-Transfer and no debit on online or phone custom-cake orders. Before online ordering opens (B5), check that the processor can refuse debit cards on deposits (docs/13 A24) | Operations; the site promises no other payment method |
| A5 Gift cards | « ni date d'expiration ni frais » overstates the law, which bans expiry dates and issuance or use fees on a shop's own card (LPC ss. 187.3, 187.4; L-11, L-13, L-14) | « Au Québec, la carte-cadeau d'un commerce n'a pas de date d'expiration, et aucuns frais ne peuvent être exigés pour sa délivrance ou son utilisation. » (20d §3.3) | `faq` and `conditionsDeVente` (FR, EN) |
| A6 Order not picked up | Lawful when the order was ready at the agreed time: what is kept is the price of goods made for the customer, not a penalty (L-8, by analogy); in line with the market (M-2, M-11). Counsel confirms the case of a custom cake paid by deposit only | Not a legal correction: the reason is now written (« comme la commande a été préparée pour vous, le montant payé n'est alors pas remboursé »), and the order FAQ no longer says « appelez … pour convenir d'une autre heure » twice (20d §3.4). The optional waiver of an uncollected cake's balance stays the owner's choice (§5) | `commander` FAQ and `conditionsDeVente` pickup body (FR, EN) |
| New: card issuer | For fresh goods the distance-contract rules do not apply (L-9), so the 60-day chargeback may not be a right the shop can cite | « Si un remboursement dû n'est pas fait, vous pouvez aussi vous adresser à l'émetteur de votre carte de crédit. » (20d §3.5) replaces « … d'annuler le paiement, dans les 60 jours ». Counsel may restore the 60 days for custom cakes if they are not exempt | `conditionsDeVente` (FR, EN) |

The 15-day full refund when the shop cannot fill an order, and the rule that the shop never moves a confirmed date
without the customer's agreement, stay as the shop's own commitments (20d §3.5). A1 and A9 stand (20d §3.6). Not
applied, for counsel: the privacy page's own complaint route and an effective date next to its last update (20d §3.6).

Dates: the changed pages (home, order, Visit, FAQ, privacy, conditions of sale) now show « Mis à jour le 29 octobre
2026 » and a new change note. The conditions page's date also names the terms version a customer accepts when Studio
holds no version label: it becomes « conditions-de-vente@2026-10-29 » (`src/lib/payments/consent.js`).

### 6.3 Infrastructure and accounts (20e)

Nothing was bought or opened. The agency's choices, now step by step in the week-0 checklist (docs/13 §A0):
- **Registrar and DNS:** Cloudflare Registrar for cocovanillegranby.com and cocovanillegranby.ca, both still free at
  13:11 UTC; registrant « Pâtisserie Coco Vanille inc. », .ca category « Canadian corporation »; CanSpace as the
  fallback for the .ca. cocovanille.ca, also free, is optional.
- **Server:** OVHcloud VPS-2 (4 vCores, 8 GB, 75 GB NVMe) at Beauharnois: C$13.70 a month with no commitment,
  C$11.64 a month on 12 months prepaid (CAD, before tax, OVHcloud's catalogue). OVHcloud's Canadian VPS has no
  Toronto site.
- **Backups:** AWS S3 in ca-central-1 (Montréal) and OVHcloud Object Storage Standard at Beauharnois.
- **Mail:** Exchange Online (Plan 1), one licence, tenant country Canada; bonjour@ and confidentialite@ as shared
  mailboxes (no licence needed), commandes@ and dmarc@ as aliases.
- **Sending and payments:** Amazon SES in ca-central-1 (production access requested in week 0); Twilio toll-free with
  its verification, which needs the corporation's registration number, by mid-December; Stripe Canada.
- **Cost floor (est., before GST/QST):** about C$21–23 a month, about C$28–31 once texts run (20e §4).

research/17 was not edited; 20e §6 lists the rows it updates.

### 6.4 Checks

- `node --test test/unit` (apps/web), 2026-10-29 after these changes: 472 tests, 469 pass, 1 skipped, 1 todo; the one
  failure is the known Windows-only path case in media.test.js.
- No unit test asserted a placeholder that became a fact (none covers the parking, Zoo, gift-card, refund or privacy
  sentences), so no test was changed.
- Not run in this step: the seed, the build, the gate and anything on a server.

## 7. Update of 2026-10-29, evening: design reviews, local content and the release run

Same mandate and same terms as §1 and §6 (« Décision de l'Agence du 29 octobre 2026 (mandat de Yahya), modifiable par
la propriétaire »).

### 7.1 Local content applied (research/22c, 22d)

| # | Topic | Decision (site wording, French; English adapts it) | Basis |
|---|---|---|---|
| L1 | Zoo visitors | One page, « Depuis le Zoo de Granby » (`/nous-trouver/zoo-de-granby/`, `/en/visit/granby-zoo/`), child of Nous trouver: the drive, the city bus, free downtown parking, the Zoo's own rules on bringing lunch and on leaving and coming back, the shop's hours, workshops and drinks. No marker on it. Its main buttons are « Itinéraire » and « Appeler ». Linked from the home, Nous trouver, FAQ and pâtisseries pages and from the footer's guides | 22d §1 (Google's doorway-page policy checked; facts from 20b, 20c and the Zoo's FAQ, rules and « Horaire et directions » pages, read 2026-10-29) |
| L2 | Moroccan specialities | An FAQ on the menu page, « Avez-vous des spécialités marocaines? », and one item in the home page's offer list. Days and prices stay a marker. No page and no section until the owner gives them | The shop's pinned post of 2026-08-25 (20b S-13); 22d §2 |
| L3 | Seating | « Oui : la boutique se décrit comme un endroit chaleureux où l'on peut s'installer pour prendre un café »; the number of seats stays a marker | The shop's own words (20b S-16) |
| L4 | Savoury food | An FAQ on the pastries page: feuilletés, mini pizzas, pastillas au poulet and sandwiches, to stay or to go | The shop's posts of 2026-09-05 and 2026-09-20 (20b S-10, S-12) |
| L5 | Custom cakes | The cakes section now opens with the shop's own words: « gâteaux personnalisés sur commande pour les anniversaires et les occasions spéciales » | Pinned post (20b S-8) |
| L6 | Johnson lot | « à environ 120 m » (was 150 m): two routing engines give 119–120 m on foot to 18, rue Johnson | 22d (OSRM and Valhalla) |
| L7 | FR/EN parity | Each language gets the other's visitor questions (US dollars, delivery to Bromont or Waterloo, parking); the English-only Zoo questions moved to the Zoo page | docs/17 §3.4; Loi 96 (English never more complete) |
| L8 | Structured data | Added: `legalName`; a `contactPoint` for the workshop line 438-528-7818 (its use is the shop's own, 20b S-19); the Zoo as `mentions` on the Zoo page. Removed: `inLanguage` from the Bakery node (not a LocalBusiness property). Not added: ratings, `priceRange`, payment fields, `areaServed`, `amenityFeature`, diet claims | 22d §4 |

### 7.2 Wording corrected after the design reviews

- Allergens: every sentence that promised « allergènes vérifiés » now says they show once a person has checked them,
  and the allergens page's answer block describes the site (« Ce site ne présente aucun produit comme « sans gluten »
  … »), as A9 decided. Four more free-from sentences that spoke for the shop now speak for the site.
- The person in charge of personal information: the title is « Propriétaire » (« Owner » on English pages); the
  footer no longer repeats « responsable de la protection des renseignements personnels ».
- Photos: « toute photo qui n'est pas celle de la boutique porte la mention « Photo d'illustration » » replaces a
  sentence that said the site showed only real photos.
- Dates: every page whose copy changed today shows « Mis à jour le 29 octobre 2026 »; a byline never shows an update
  older than its publication.

### 7.3 Checks (release run, production build)

- Unit: 474 tests, 471 pass, 1 skipped, 1 todo; the one failure is the known Windows-only path case.
- Public browser tests: 81 pass, 1 skipped. Studio: 41 (40 in the full run on a clean demo database; the
  accessibility scan of the 14 daily screens passed on its own after its timeout went to 3 minutes).
- Gate: PASS on 68 pages; the 101 FAILs are all owner-fact markers.
- Test hygiene: the Studio allergen test now clears its check on the Baguette, versions included, so it never
  reaches /allergenes/ or a screenshot.

## 8. Update of 2026-10-30: no lawyer or accountant step; the owner's facts move into Studio

Yahya's instructions of 2026-10-30: the facts « will be handled from the admin dashboard in an organized way, and
edited there »; for the lawyer and the accountant, « we don't need that, handle it by yourself and my client will
verify later »; the domains will be registered when the web app is fully ready; the Stripe account comes from the
client.

### 8.1 Legal and administrative slots decided by the agency (French; English adapts it)

| Slot | Decision | Basis |
|---|---|---|
| « révision par un avocat » (4 legal pages) | Removed. Each legal page's change note now says « texte rédigé par l'Agence, à valider par la propriétaire » | The instruction above; content.test.js now checks the marker is gone |
| Providers and processing countries (privacy) | Stripe (Canada and the United States), Twilio (United States), Amazon Web Services (Montréal), Microsoft (Canada), OVHcloud; a privacy impact assessment before each provider that processes information outside Québec is put into service | research/20e §1; Loi 25 s. 17 |
| Hosting (privacy) | OVHcloud, Beauharnois (Québec) | research/20e (recommended plan; update the page if another host is chosen) |
| Retention (privacy) | Orders and invoices: 6 years after the end of the tax year they relate to; allergy note: 30 days after pickup, deleted automatically (the worker's nightly job); server logs: 90 days; abandoned boxes: none kept on the server (a box lives in its link and a 30-day cookie) | research/20d L-21 (6 years, Revenu Québec); src/worker/tasks.js; src/lib/ordering/box.js |
| Quote validity (terms) | 72 hours, the deadline written on the quote | The shop setting `ordering.quoteValidHours` (default 72) that Studio already uses |
| Free cancellation (terms) | Up to 24 hours before the pickup slot starts; custom-cake deposits keep the §6.2 refund rule | Agency default; changeable in one word |
| Product not as ordered (terms) | Report it on the day of pickup, at the counter or by phone, with a photo if possible; the shop replaces it if it can, otherwise refunds that product | Consumer Protection Act (goods must match the description) |
| Cookies | No measurement tool for now; « Ma boîte » 30 days, the « Écrivez-nous » conversation 90 days, an order form in progress 10 minutes | src/lib/ordering/cookies.js, box.js, chat/token.js, the order and request routes |
| Accessibility | Manual screen-reader check before launch, then yearly; known limits: none from the automated WCAG 2.2 AA tests; response time 5 business days | Agency commitment |

### 8.2 Tax classes without an accountant

- Studio › Produits › Taxe now explains the choice next to it: bread, baguette, plain croissant and whole cakes:
  « Détaxé »; sweet viennoiseries, pastries, cookies, muffins and slices: « Règle des produits de boulangerie »
  (with the weight of a serving); sandwiches, ready-to-eat savoury food, drinks: « Taxable ».
- Verified 2026-10-30: since 2026-07-15 the QST no longer applies to sweet bakery products sold as single servings
  (under 230 g) or in packs of fewer than six (Revenu Québec, « Précisions concernant la détaxation de certains
  produits dans le régime de la TVQ », 2026-08-07); the GST still applies to fewer than six single servings
  (CRA). src/lib/ordering/tax.js already applies both rules.
- The accountant's approval date is no longer required to set a class (it stays as an optional check date).

### 8.3 « Faits du site » in Studio

- New screen Studio › Plus › « Faits du site »: the 95 facts the copy waits for, in 8 groups (products and prices,
  cakes, lead times and orders, holidays and bûches, the shop, access and payment, allergens and storage, team,
  administration), each with its question, where it appears, a French answer and, where an English page asks for
  it, an English one. Progress per group; « Voir aussi les faits déjà donnés » to edit an answer later.
- An answer fills every [[FACT NEEDED]] slot of its fact in its language at once (collection `site-facts`,
  `lib/facts.js resolveFacts`, `lib/data.js`); the public pages refresh through the collection's revalidation hooks;
  a page goes live when all its slots are answered (publish guard). An empty answer brings the marker back.
- The owner, the manager, the agency and the translator can answer (the agency types in answers it receives);
  English alone is refused (French first, Loi 96). Every answer is in the audit log, with « Annuler » for 30 s.
- Migration `src/migrations/20261030_120000_site_facts.js`; unit tests `test/unit/facts-catalog.test.js` (every slot
  of the copy belongs to a fact, and the reverse); Studio test `test/e2e/studio/facts.spec.js`.
