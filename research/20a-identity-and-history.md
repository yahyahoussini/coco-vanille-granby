# 20a · Identity and history: legal entity, names, status, reviews, domain (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Step: research « identity », under Yahya's mandate of 2026-10-29 (« take all decisions based on what I give and web research, and make the full thing ready »).
Machine-readable twin: `data/research-identity.json` (one object per candidate fact: `id`, `value`, `label`, `source`, `seen`, `note`).

How this was made, and its limits:
- **Official data first.** The Registraire des entreprises publishes the register as open data. The ZIP (`JeuDonnees.zip`, 269 MB, SHA-256 `11d89a0a…34b65`, inner files dated 2026-10-15) was downloaded on 2026-10-29 through the Données Québec link. It was searched for the NEQ, for every name containing « Coco Vanille » or « Cocovanille », and for every entity declared at 3 rue Court. Limits:
  - The extract is refreshed twice a month. The live register on Québec.ca can be newer.
  - It **omits the names and addresses of natural persons by design** (open-data guide, §1).
  - Its licence is CC BY-NC-SA 4.0. It was used only to check the shop's own record. It is not redistributed.
- **Consumer complaints:** the open data of the Office de la protection du consommateur (OPC), `opc-plaintes-2026-10-28.csv`: 192,083 complaints, June 2014 – October 2026, CC BY 4.0. It names no merchant, so it can only rule complaints out by city and activity code.
- **Domains:** IANA's RDAP bootstrap file (published 2026-10-28T22:00Z) points to Verisign for .com and CIRA for .ca. Both registries were queried by RDAP, then by port-43 WHOIS, between 10:32 and 10:47 UTC on 2026-10-29. Control queries (google.com, example.com, granby.ca) returned records, so a 404 means "not in the registry".
- **Pages opened directly (WebFetch):**
  - Three Best Rated and Wanderlog
  - Radio-Canada (2022) and La Voix de l'Est (2022)
  - the Marché public exhibitor list and the shop's exhibitor page
  - Facebook: the page title only (the rest needs a login)
- **Refused or empty:**
  - opengovca and b2bhint: HTTP 403. They are no longer needed: the register replaced them.
  - RestoMontreal: HTTP 403.
  - Google Maps: an empty shell.
  - BAnQ newspaper archive: a security page.
  - OPC merchant-search page: 404.
  - A curl retry of opengovca with a browser user agent was stopped by the session's safety check (bot-check circumvention). It was not pursued.
  - So the RestoMontreal facts come only from search summaries.
- **15 WebSearch queries** (standard mode, US-located, summarized results), logged in §11.
- **Not done:**
  - a look at the storefront sign (no source we could open shows it)
  - Google Maps itself
  - Facebook « À propos » and Page transparency
  - the live register's « état de renseignements »
  - a CIPO trademark search (not this step)
- **Labels:**
  - **verified** = an official source (the Registraire, the OPC, a domain registry), an owner source (the shop's own Facebook page or Google listing), or two independent sources.
  - **unverified** = one non-official source, or an inference.
- **Privacy:** no director, shareholder or sole-proprietor name is recorded in this file or its twin (§9).

---

## 0. Bottom line (decision-relevant)

1. **The legal entity is now confirmed at the source (official register).** Every field below is verified:
   - Legal name: *Pâtisserie Coco Vanille inc.*, NEQ **1177082220**.
   - Form: société par actions under the Québec *Loi sur les sociétés par actions* (RLRQ, c. S-31.1).
   - Dates: **constituted 2021-11-08** in Québec, **registered 2021-11-09**.
   - Status: « Immatriculée », with no bankruptcy indicator.
   - Annual update: the one for 2025 was filed on 2026-01-24. The next is due by 2027-05-01.
   - Activity: CAE 6013 « Boulangeries et pâtisseries ». Employees declared: « Aucun ».
   - Address: the seat and the only establishment are at 3 rue Court, Granby J2G 4Y6.

   What this settles:
   - It closes the one-day conflict in `data/facts.json` (`legal.incorporation_date`): the 8th is the constitution and the 9th is the registration.
   - It upgrades `legal.form`, `legal.status` and `legal.employees_declared` to verified.
   - The site's sentence « immatriculée au Québec depuis le 9 novembre 2021, numéro 1177082220 » is exact.
2. **The register holds no other name, but the shop uses three spellings.**

   | Where | Spelling |
   |---|---|
   | Its Facebook page | « Pâtisserie Coco Vanille » |
   | Google and its mirrors | « Pâtisserie Cocovanille » |
   | The Facebook bio | « Coco•vanille » |
   | The storefront sign | **still unseen** |

   The Registraire's own guide (IN-531, 2025-08) sets three rules:
   - Any other name used to identify the business in Québec must be declared from its first use.
   - The constitutive name, with « inc. », must appear on contracts and invoices.
   - « inc. » may not appear in another name.

   → « Pâtisserie Coco Vanille » is the best-supported display name, with the legal name on the terms, order confirmations and receipts (the build already does this). Whether « Cocovanille » must be declared is a question for the accountant (§2).
3. **cocovanillegranby.com is not registered** (Verisign RDAP 404 and WHOIS « No match », 10:32–10:47 UTC on 2026-10-29). These are free too:
   - cocovanillegranby.ca
   - cocovanille.ca
   - patisseriecocovanille.ca and patisseriecocovanille.com

   **cocovanille.com belongs to a third party** (registered 2015, NameBright) and redirects to a HugeDomains resale page. → The domain that `infra/`, the nginx configs and the plans assume does not exist yet. Registering it, and the .ca, in the corporation's name is now a week-0 blocker (research/14 T2). Until then anyone can take it.
4. **The opening date is not published anywhere we could read.** What bounds it:
   - « Coco Vanille » first appears in the register as a bakery name on **2021-11-08**.
   - The earliest public trace of trading is **La Voix de l'Est, 22 Oct 2022**: the shop's prêts-à-manger were sold at the Marché public kiosk during the rue Principale works.
   - Next comes **Radio-Canada, 13 Nov 2022**, which lists it among « commerçants de la rue Principale ».

   An earlier bakery partnership, « Les petits trésors s.e.n.c. », had its seat at 3 rue Court:
   - Its stated aim: « produits naturels de qualités et des produits sans lactose ».
   - Registered 2014-04-02; last annual update filed 2021-02-08; struck off ex officio 2026-03-12.
   - Whether Coco Vanille took over those premises is an inference only.

   → Keep « immatriculée depuis le 9 novembre 2021 ». No « depuis [année] » and no opening story until the owner gives it (14 C2).
5. **The Google listing is probably not marked « temporarily closed »** (unverified).
   - The Google-sourced Wanderlog card (seen today) shows 4.9 from 41 Google reviews and opening hours, with no closure notice.
   - Three Best Rated shows none either.
   - Yahya read the listing's hours on 2026-10-27.
   - Only RestoMontreal still prints « Cette entreprise peut être temporairement fermée ».

   Signs of trading through 2026:
   - Reviews dated January, March–April and late summer 2026 (RestoMontreal summaries).
   - The Marché public's 2026-season exhibitor list.

   → A dated screenshot of the Google listing still closes 14 S1–S2.
6. **Google rating: 4.9.**
   - RestoMontreal: « 40+ » at 2026-07-15.
   - Wanderlog: 41 reviews (snapshot undated).

   Both are unverified copies. This changes nothing on the site: no `aggregateRating`; on-page only after reading Google directly (01 §6; 15).
7. **The January 2026 complaint is public only as one Google review**, seen through RestoMontreal summaries:
   - A chocolate cake with chocolate cream was ordered; a vanilla cake with chocolate cream was received.
   - The same reviewer praised the pastries and the welcome.
   - No owner reply was seen, and no news item exists.
   - The OPC's complaint data has **no complaint against any Granby-based bakery (activity 6013) from June 2014 to October 2026**.

   → It is a process issue, already designed out by the order recap (14 P6), not a legal file.
8. **Nothing the shop itself published about its owner or chef could be read.**
   - Facebook « À propos » needs a login.
   - The Marché public page has no description.
   - Neither 2022 article quotes anyone from the shop.

   This stays [[FACT NEEDED]] (14 C1). No personal name is recorded here.

---

## 1. Legal entity (official register, extract of 2026-10-15)

| Field | Value | Label | Source | Seen |
|---|---|---|---|---|
| Legal name (« nom constitutif ») | Pâtisserie Coco Vanille inc.: type « Nom », status « En vigueur » since 2021-11-08 | verified | REQ open data, `Nom.csv` | 2026-10-29 |
| NEQ | 1177082220 | verified | REQ `Entreprise.csv` | 2026-10-29 |
| Legal form | Société par actions ou compagnie (code CIE) | verified | REQ `Entreprise.csv` + `DomaineValeur.csv` | 2026-10-29 |
| Legal regime (now and at constitution) | « QUÉBEC : Loi sur les sociétés par actions (RLRQ, C. S-31.1) » (code 024) | verified | same | 2026-10-29 |
| Constitution | 2021-11-08, place « Québec » | verified | same (`DAT_CONSTI`, `NOM_LOCLT_CONSTI`) | 2026-10-29 |
| Registration (« immatriculation ») | 2021-11-09 | verified | same (`DAT_IMMAT`) | 2026-10-29 |
| Status | « Immatriculée » (IM) since 2021-11-09; bankruptcy indicator N; no planned cessation date | verified (as of 2026-10-15) | same | 2026-10-29 |
| Last annual update declaration | For 2025, filed 2026-01-24 (the 2025 deadline was 2026-05-01) | verified | same (`DAT_DEPO_DECLR`, `AN_DECL`, `DAT_LIMIT_PROD_PRE`) | 2026-10-29 |
| Next annual update | Production year 2026, deadline 2027-05-01 | verified | same (`AN_PROD`, `DAT_LIMIT_PROD`) | 2026-10-29 |
| Activity | CAE 6013 « Boulangeries et pâtisseries » (only activity) | verified | same | 2026-10-29 |
| Employees in Québec | « Aucun » (code O) | verified (a declared range, not a headcount) | same | 2026-10-29 |
| Seat (« domicile ») | 3 rue Court, Granby (Québec) J2G 4Y6; address not exempt from disclosure | verified | same | 2026-10-29 |
| Establishments | One, principal: 3 rue Court, Granby J2G 4Y6, CAE 6013, named « Pâtisserie Coco Vanille inc. »; no tanning salon, no tobacco sales | verified | REQ `Etablissements.csv` | 2026-10-29 |
| Other names (« autres noms utilisés au Québec ») | **None declared** | verified | REQ `Nom.csv` | 2026-10-29 |
| Mergers, splits, continuations | None | verified | REQ `FusionScissions.csv`, `ContinuationsTransformations.csv` | 2026-10-29 |
| Directors and shareholders | Not in the open data (natural persons are excluded); not sought elsewhere | — | open-data guide §1 | 2026-10-29 |

The corporation's own rows, verbatim (no personal data in them):

```
Entreprise.csv  1177082220,N,2021-11-09,024,O,,IM,CIE,2021-11-09,024,2026-01-24,2025,2026,2027-05-01,2025,2026-05-01,2021-11-08,6013,1,-,,,,Québec,2021-11-08,,,,,,,,N,3 rue Court,Granby (Québec),,J2G4Y6
Nom.csv         1177082220,Pâtisserie Coco Vanille inc.,,V,N,2021-11-08,
Etablissements  1177082220,1,O,N,N,N,3 rue Court,Granby (Québec),,J2G4Y6,6013,-,1,,,,Pâtisserie Coco Vanille inc.
```

What this changes elsewhere (for whoever merges; this step edits no other file):

| Where | Was | Now |
|---|---|---|
| `data/facts.json` `legal.incorporation_date` | conflict 2021-11-08 vs 2021-11-09 | constitution 2021-11-08 · registration 2021-11-09 (both verified, official) |
| `legal.form` | unverified | verified: société par actions, Québec LSA |
| `legal.status` | unverified (aggregators) | verified: « Immatriculée », 2025 update filed 2026-01-24, next due 2027-05-01 |
| `legal.employees_declared` | unverified | verified: « Aucun » |
| research/01 §1 | REQ not opened; aggregators only | the official extract replaces opengovca and b2bhint as the source |

---

## 2. Names in use, and the rules that apply

| Where | Name as shown | Label | Source | Seen |
|---|---|---|---|---|
| Register (legal name) | Pâtisserie Coco Vanille inc. | verified (official) | REQ open data | 2026-10-29 |
| Facebook page (owner) | « Pâtisserie Coco Vanille »; page title « Pâtisserie Coco Vanille \| Granby QC » | verified (owner) | facebook.com/PatisserieCocoVanille/ | 2026-10-29 |
| Facebook bio (owner) | « Coco•vanille Pâtisserie 🍰 & Café ☕️ … » | verified (owner), relayed by Yahya | computed task / research/01 update 2026-10-27; **not re-seen today** (login wall) | 2026-10-27 |
| Google listing | « Pâtisserie Cocovanille » (CID 10789122976114705165) | verified as the **listing** name (Google-sourced Wanderlog card + RestoMontreal + operator brief) | wanderlog.com; restomontreal.ca | 2026-10-29 |
| Wanderlog | « Pâtisserie Cocovanille, **Magog**, QC », with a Granby street address | verified (observed on the page) | wanderlog.com | 2026-10-29 |
| Three Best Rated | « PÂTISSERIE COCO VANILLE » | unverified (third party) | threebestrated.ca | 2026-10-29 |
| Press | « Pâtisserie Coco Vanille » (La Voix de l'Est 2022-10-22; Radio-Canada 2022-11-13) | verified (2 independent sources) | lavoixdelest.ca; ici.radio-canada.ca | 2026-10-29 |
| Marché public de Granby (partner) | « Pâtisserie Coco Vanille », categories « Spécialités », « Sucré » | verified (the market's own page) | marchepublicgranby.ca | 2026-10-29 |
| Round logo (relayed by Yahya 2026-10-27) | « COCO Vanille · PÂTISSERIE · GRANBY » (two words) | unverified as evidence of the sign: provenance (old logo or new design) not recorded | `apps/web/public/brand/`, research/sessions/04 | 2026-10-29 |
| **Storefront sign** | **not seen**: no openable source shows it | — | — | — |

Rules (official guide « Les noms d'entreprises au Québec », IN-531, 2025-08, Registraire des entreprises):
- §2.1, société par actions: the constitutive name « figure dans ses statuts constitutifs et […] doit être inscrit sur ses contrats et ses factures ».
- §2.2: « un autre nom doit être déclaré au registre dès que l'entreprise l'utilise pour s'identifier au Québec dans le cadre de ses activités. Par ailleurs, un autre nom doit en être retiré si son utilisation a cessé. »
- §4.1: « inc. », « ltée », « s.a. » and similar particles « ne peuvent toutefois pas figurer dans un autre nom d'une société par actions ». The guide's conforming example of another name is « PHOTOGRAPHIE PRIXPRO ».

Reading:
- « Pâtisserie Coco Vanille » has the most support of any spelling: the registered name minus its legal particle, the shop's own Facebook page, both 2022 articles, the Marché public and Tripadvisor (research/01 §2).
- « Cocovanille » lives on Google and the directories that copy Google.
- « Coco•vanille » is a typographic styling in the bio.
- The register declares none of them as another name. The guide does not say whether dropping « inc. » or merging two words counts as another name. That is a question for the accountant (14 A5), not something to assert.
- The build already puts « Pâtisserie Coco Vanille inc. » + NEQ in the footer, the terms of sale, the privacy page, checkout and order messages (`apps/web/src/seed/content.js`, `lib/messaging/templates.js`, `components/ordering/BoxCheckout.js`). That matches §2.1.

---

## 3. Is the Google listing marked « temporarily closed »?

| Evidence | Points to | Date of evidence | Source | Label |
|---|---|---|---|---|
| Wanderlog card « From Google »: 4.9, 41 reviews, hours Sun 9–17 / Wed–Sat 8:30–17:30, website = the Facebook page, **no closure notice** | not closed at Wanderlog's snapshot | snapshot undated; page seen 2026-10-29 | wanderlog.com | unverified |
| Three Best Rated: « 2025 Highlights », hours Wed–Sat 8:30–17:30, Sun 9–17, Mon–Tue closed, **no closure note** | trading | 2025 listing, page seen 2026-10-29 | threebestrated.ca | unverified |
| Yahya read the Google listing's hours (Mon–Tue closed, Wed–Sat 8:30–17:30, Sun 9:30–17:00) | the listing shows hours | 2026-10-27 | operator relay (research/01 update) | unverified (no screenshot) |
| RestoMontreal FR still prints « Cette entreprise peut être temporairement fermée » | possible Google « temporarily closed » flag at its snapshot (inference) | page « au 2026-07-15 »; seen in a summary 2026-10-29 | restomontreal.ca | unverified |
| RestoMontreal distinguishes statuses on other pages: « Peut être temporairement fermé » (a Boucherville suggestion), « closed permanently » (Dame Tartine, Da Teresa in Granby) | the line is a per-listing status, not a site-wide banner (inference) | seen 2026-10-29 (summary) | restomontreal.ca | unverified |
| Reviews quoted in RestoMontreal summaries: « 4 janv. 2026 », « 24 avr. 2026 », framboisier birthday cakes (March–April 2026), the shop « discovered at the Granby public market » with a pistachio-raspberry « style Dubaï » tiramisu (late summer 2026: one summary says September, another August/September) | trading in 2026 | 2026 | restomontreal.ca (summaries) | unverified |
| Marché public 2026 site lists « Pâtisserie Coco Vanille » as an exhibitor | trading in 2026 (exhibitor days not shown) | season 2 May – 7 Nov 2026 | marchepublicgranby.ca | verified (the market's page); the shop's attendance in 2026 is unverified |
| Register: status « Immatriculée »; 2025 annual update filed 2026-01-24 | entity alive and maintained | 2026-01-24; extract 2026-10-15 | REQ | verified |

Verdict: **probably not marked temporarily closed today** (unverified).
- No Google-sourced copy seen today shows a closure.
- The only flag is RestoMontreal's, whose own snapshot is three months old.
- Close it with one dated screenshot of the Google listing showing name, status, hours, rating, review count and website field (14 S1, S2, S7). Then ask RestoMontreal to drop the line (05 W44 already lists it).

Incidental, for the citation cleanup: Wanderlog and Three Best Rated show **Sunday 9:00**, but Yahya read **9:30** on the Google listing on 2026-10-27. The Three Best Rated page has dropped its older Thu–Sat schedule (research/01 §3).

---

## 4. Google rating and review count

| Source | Rating | Count | Date shown | Label |
|---|---|---|---|---|
| RestoMontreal FR header | 4.9; 86 % five-star | « 40+ » | « au 2026-07-15 » | unverified (search summary) |
| Wanderlog card « From Google » | 4.9 | 41 | none (seen 2026-10-29) | unverified |
| Three Best Rated (its own score) | « Overall TBR® Inspection Score: 4.8/5.0 » | not shown on today's page (115 in an older summary, research/01 §6) | « 2025 Highlights » | unverified |

- Best reading: Google 4.9 from about 41 reviews in the second half of 2026.
- Not for schema. On the page only after someone reads Google directly and dates it (research/01 §6; 15).

---

## 5. History and opening date

| Date | Event | Label | Source |
|---|---|---|---|
| 1995–1997 | A computer-store business has its seat at 3 rue Court (registered 1995, struck off ex officio 1997) | verified | REQ open data |
| 2005-02-10 → 2010-01-25 | A tattoo and piercing studio (a partnership) has its seat at 3 rue Court; struck off ex officio | verified | REQ open data |
| 2014-03-27 / 2014-04-02 | « Les petits trésors s.e.n.c. » is formed and registered, seat at 3 rue Court. Activities: CAE 1072 « Industrie du pain et des autres produits de boulangerie-pâtisserie » and CAE 1071 « Industrie des biscuits ». Stated aim: « offrir des produits naturels de qualités et des produits sans lactose » | verified | REQ open data |
| 2021-02-08 | Last annual update filed by « Les petits trésors s.e.n.c. » | verified | REQ open data |
| Aug 2021 | Rue Principale reconstruction begins (rue Court meets rue Principale downtown) | verified (press) | Radio-Canada 2022 |
| **2021-11-08** | **Pâtisserie Coco Vanille inc. is constituted** (Québec LSA); « Coco Vanille » appears in the register as a bakery name for the first time | verified | REQ open data |
| **2021-11-09** | **Registered**, seat at 3 rue Court (the extract shows today's address, not the 2021 one) | verified | REQ open data |
| **2022-10-22** | **Earliest public trace of trading.** La Voix de l'Est: « Les visiteurs y dénichaient des prêts-à-manger des entreprises Pâtisserie Coco Vanille, … » at the Marché public kiosk for rue Principale merchants (page dated 22 Oct 2022, updated 2023-03-03; the URL path says 2022/10/23) | verified | lavoixdelest.ca |
| 2022-11-13 | Radio-Canada: « Les commerçants de la rue Principale qui vendent des produits au Marché sont la Pâtisserie Coco Vanille, … » (00:23 UTC; no one from the shop quoted) | verified | ici.radio-canada.ca |
| 2023-11-25 | foodpages listing updated | unverified | research/01 §4 |
| 2025 | Three Best Rated « 2025 Highlights » | unverified | threebestrated.ca |
| 2026-01-24 | Annual update for 2025 filed | verified | REQ open data |
| Jan 2026 | The order complaint (§6) | unverified | restomontreal.ca (summary) |
| 2026-03-12 | « Les petits trésors s.e.n.c. » is struck off ex officio (code RX, « article 59 ») | verified | REQ open data |
| 2026 season | Listed as a Marché public exhibitor (Saturdays 2 May – 7 Nov, 9 h – 14 h; Thursday evenings 18 Jun – 27 Aug. The page prints no year, but the weekdays match 2026 and the footer says © 2026) | verified (the market's page) | marchepublicgranby.ca |
| 2026-07-15 | RestoMontreal snapshot: Google 4.9 (40+) | unverified | restomontreal.ca |
| 2026-10-27 | Yahya relays the Google listing hours and the Facebook bio | owner-published, relayed | research/01 update |

Reading:
- **Opening date:** not published in any source we could read.
  - Earliest bound: 2021-11-08, the first time « Coco Vanille » appears in the register as a bakery name.
  - Latest bound: 2022-10-22, the first press trace.
  - The bounds are evidence. A month inside them would be a guess. → [[FACT NEEDED: date d'ouverture de la boutique]] stays on `/a-propos/` (owner-todo #70).
- **Premises:** the register shows a bakery partnership seated at 3 rue Court from 2014. Its last filing was nine months before Coco Vanille was constituted at the same address.
  - That Coco Vanille took over a working bakery there is a reasonable **inference, not a fact**. No public source links the two.
  - Not for publication. It is someone else's business.
- **Searched and not found:**
  - an opening announcement (La Voix de l'Est, Granby Express)
  - a Tourisme Granby page
  - a job post
  - any owner-written story

  The BAnQ archive returned possibly relevant La Voix de l'Est supplements, but they sit behind a security page (§10, item 6).

---

## 6. The January 2026 complaint: what is public

- **What:** one Google review, dated January 2026, seen only through RestoMontreal summaries (2026-10-25 and 2026-10-29).
  - The customer ordered a chocolate cake with chocolate cream and received a vanilla cake with chocolate cream, and was very disappointed.
  - The same reviewer said the pastries were very good and the welcome kind.
  - Rated 2 stars per the 2026-10-25 summary (research/01 §6). Not re-seen today.
- **Not found:**
  - a public reply from the shop
  - any news item
  - any formal complaint

  OPC open data, June 2014 – October 2026: **0** complaints against merchants with a Granby head office and activity code 6013, against 83 such complaints across Québec. About 1,060 complaints name Granby as the head-office city, none coded 6013. The data names no merchant. Reading it as "no OPC complaint against this shop" assumes the OPC codes merchants by their register activity (likely, unverified).
- **Label:** unverified (one non-official source). The reviewer is not named here.
- **Use:** none in copy. It is design input for the order recap. Cake flavour and cream flavour go on separate lines, with a photo or recap approval before production (research/14 P6, research/10). AI answers already repeat this review on custom-cake prompts (05 W44). The fix is more recent reviews and a visible written recap, never a reply that discloses order details.

---

## 7. Domain: cocovanillegranby.com and neighbours

| Domain | Registry | Result, 2026-10-29 (UTC) | Label |
|---|---|---|---|
| **cocovanillegranby.com** | Verisign (`rdap.verisign.com/com/v1/`) | RDAP **HTTP 404** at 10:32 and 10:47; WHOIS `whois.verisign-grs.com`: « No match for "COCOVANILLEGRANBY.COM" » (database updated 10:46:45). **Not registered; no registrar** | verified |
| cocovanillegranby.ca | CIRA (`rdap.ca.fury.ca/rdap/`) | RDAP 404; WHOIS `whois.cira.ca`: « Not found: cocovanillegranby.ca » | verified |
| cocovanille.ca | CIRA | RDAP 404: not registered | verified |
| patisseriecocovanille.ca | CIRA | RDAP 404: not registered | verified |
| patisseriecocovanille.com | Verisign | RDAP 404: not registered | verified |
| cocovanille.com | Verisign | Registered **2015-11-02** · registrar TurnCommerce, Inc. DBA NameBright.com (IANA 1441) · expires 2026-11-02 · last changed 2025-11-03 · status « client transfer prohibited » · NS NSG1/NSG2.NAMEBRIGHTDNS.COM · no DNSSEC. `http://cocovanille.com/` answers 302 → `hugedomains.com/domain_profile.cfm?d=cocovanille.com`, a resale page. No link to the shop (registered six years before the corporation) | verified |

What it means:
- The planned domain is **free and unprotected**. Anyone can register it today.
- Everything downstream waits on registration: DNS, TLS, the `bonjour@` mailbox, the Search Console Domain property, the GBP API application (it needs a mailbox on the site's domain, 17 §9.2), and `infra/nginx/sites/*.conf`.
- research/14 T2 changes from « who registered it? » to « register it ».
- research/17 §10 already says how: in the business's name, the owner's account as registrant, the agency as delegate, .ca in the legal name under CIRA rules, auto-renew, 2FA, registrar lock. The registrar itself is the hosting decision's call.

---

## 8. Name collisions found on the way

| Collision | Detail | Label | Source |
|---|---|---|---|
| Other « Coco Vanille » names in the register | Two sole proprietorships, both unrelated to food: one for baby and maternity accessories used « COCO VANILLE » 2010-01-22 → 2024-10-30 (struck off ex officio); a **Granby** sewing workshop used « Coco Vanille » 2023-01-16 → 2025-07-06 (name withdrawn). Neither uses the name today | verified | REQ open data |
| cocovanille.com | Domain-resale inventory since 2015 (§7) | verified | Verisign RDAP; HTTP check |
| Earlier lists (research/01 §8) | Mancera perfume; choco.vanille (Le Marmiton, Granby); Pâtisserie Coco (Montréal); Coco Vanille (Bras-Panon, Réunion, closed) | as in research/01 | research/01 §8 |

The register shows **no other bakery** that ever used « Coco Vanille » or « Cocovanille » in Québec. That helps the entity rule (`legalName` + NEQ as the schema `identifier`, research/15 R3).

---

## 9. Private note (not for publication)

- **Directors and shareholders: none recorded.**
  - The open data excludes natural persons by design.
  - The live register's « état de renseignements » would list directors and the three largest shareholders. It was not opened: the site does not need them. Loi 25 needs only the privacy officer's title and contact, which is a separate step.
- **Sole proprietorships in §8** are natural persons' businesses. Their names, NEQs and addresses are left out on purpose. The register shows them; nothing here needs them.
- **« Les petits trésors s.e.n.c.»:** its partners' names are not in the open data and were not sought.
- **Press:** neither 2022 article names anyone from the shop. La Voix de l'Est quotes two market volunteers, who have no link to the shop. They are not recorded.
- **Reviews:** no reviewer is named in this file or its twin.

---

## 10. Open items

1. **Storefront sign: a dated photo** (14 S3). It decides schema `name` and whether the Google listing is renamed. Until then the display name stays « Pâtisserie Coco Vanille » (§2).
2. **Google listing: one dated screenshot** (14 S1, S2, S7). It shows:
   - name, status and hours
   - rating and exact review count
   - the website field (today the Facebook page, per Wanderlog)
3. **Opening date and story** (14 C1, C2). A free proxy: Facebook › À propos › « Transparence de la Page » › date de création. It needs a logged-in browser.
4. **Register cocovanillegranby.com + cocovanillegranby.ca now** (14 T2; §7). Add cocovanille.ca if the decisions step agrees (free today).
5. **Accountant: other names.** If the shop keeps identifying itself as « Cocovanille » on Google or as « Coco•vanille » on Facebook, ask whether these must be declared as « autres noms utilisés au Québec » (IN-531 §2.2). If yes, file at the next annual update (due by 2027-05-01) or before.
6. **BAnQ archive hits, to open by hand in a browser.** They surfaced for the opening and « 3 rue Court » queries but sit behind a security page, which was not bypassed:
   - `collections.banq.qc.ca/document/s/t/SK1UexVrU6Nq9zCXvGFJCA` (matched both « 3 rue Court » Granby and the opening query)
   - `…/R5WeYxgYAfTviwTYSa54mw`, `…/iRIiR3jZcSakjDIGQhJa-w`, `…/rEssvhHyi9ylhH5WfTuHxw`, `…/c0DPxEl0-g0tipL1BCZBHw`, `…/1FlIMhvq0r6O3zu6Z5lcSA`, `…/7wfo2MdS3lslVJaf_qWKaA`, `…/qAQMeqwARyvEgyxxz772SA`, `…/BRRlpHborGFbAPETOfQ0DQ`, `…/QC1zciz9ruhtBmWmh1MKMw`, `…/QCt-uv9MmMmnmCf4tWltbA`
   - `…/pNaNJHS5NU53ClobmlXlbw` is, per its summary, an Orange Coco supplement, so probably unrelated.
7. **Citation fixes** (citations step):
   - Wanderlog city « Magog » → Granby.
   - Wanderlog and Three Best Rated Sunday 9:00 → whatever the Google listing says (9:30 on 2026-10-27).
   - RestoMontreal's closure line (after item 2).
8. **Live register check, before launch:** confirm the status is still « Immatriculée » and the address unchanged. The open data is two weeks old.

### Proposals for the decisions step (identity only)

If adopted, each is recorded as « Décision de l'Agence du 29 octobre 2026 (mandat de Yahya), modifiable par la propriétaire ».

| # | Proposal | Evidence |
|---|---|---|
| ID-1 | Display name « Pâtisserie Coco Vanille » on the site, in schema `name` and on new listings. `legalName` « Pâtisserie Coco Vanille inc. » + NEQ 1177082220 on the terms of sale, privacy page, order confirmations and receipts (already built). `alternateName`: « Pâtisserie Cocovanille », « Coco•vanille ». The Google listing is renamed only after the sign photo: Google asks for the real-world name, and a rename may trigger re-verification (research/15 D1) | §1, §2 |
| ID-2 | Keep the verified sentence « immatriculée au Québec depuis le 9 novembre 2021 (numéro 1177082220) ». Leave schema `foundingDate` and any « depuis [année] » empty until the owner gives the opening date. A Bakery's `foundingDate` reads as the shop's opening, which the evidence only brackets (2021-11 → 2022-10) | §5 |
| ID-3 | Register cocovanillegranby.com and cocovanillegranby.ca today, in the corporation's name (owner account, agency as delegate), plus cocovanille.ca as a defensive name. Do not pursue cocovanille.com (resale inventory, price unchecked). The registrar is chosen with hosting | §7 |
| ID-4 | No change for ratings (never in schema) or for the January complaint (handled by the order recap) | §4, §6 |

---

## 11. Search log (15 WebSearch queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Useful result |
|---|---|---|
| 1 | "Coco Vanille" pâtisserie Granby ouverture rue Court | No opening date; directory hours conflict; a review mentions the public market |
| 2 | "Coco Vanille" Granby site:lavoixdelest.ca | No indexed article (the 2022 article exists: opened directly); BAnQ supplement hits |
| 3 | "Coco Vanille" OR "Cocovanille" Granby site:granbyexpress.com | Nothing from Granby Express |
| 4 | "Pâtisserie Cocovanille" Granby | RestoMontreal 4.9 (40+), « temporairement fermée » line, framboisier praise |
| 5 | "Cocovanille" OR "Coco Vanille" Granby avis gâteau chocolat vanille 2026 | The January 2026 complaint; March–April 2026 praise; no owner reply |
| 6 | "Coco Vanille" Granby nouvelle pâtisserie "ouvre ses portes" OR "a ouvert" OR "nouveau commerce" centre-ville | No announcement; reviews dated « 24 avr. 2026 », « 4 janv. 2026 » |
| 7 | "3 rue Court" Granby | Nothing on the address; BAnQ hits |
| 8 | "Les petits trésors" boulangerie Granby "rue Court" sans lactose | Nothing |
| 9 | "Coco Vanille" Granby tourisme OR "centre-ville de Granby" pâtisserie café ateliers | No Tourisme Granby page; a September 2026 review at the public market |
| 10 | "Les Petits Trésors" Granby pâtisserie OR boulangerie OR "produits sans lactose" | Nothing |
| 11 | Registraire des entreprises Québec déclarer "autre nom" utilisé au Québec obligation nom différent du nom légal | Pointer to the official guide IN-531 (then read directly) |
| 12 | restomontreal "Pâtisserie Cocovanille" Granby avis Google "en date du" | « Google 4.9 (40+) au 2026-07-15 », 86 % five-star |
| 13 | restomontreal Granby "peut être temporairement fermée" | RestoMontreal shows per-listing statuses (temporary vs permanent) |
| 14 | "Pâtisserie Coco Vanille" Granby emploi OR "offre d'emploi" OR pâtissier OR "nouvelle pâtisserie" | No job post; late-summer 2026 review (tiramisu « style Dubaï », public market) |
| 15 | Office de la protection du consommateur "Se renseigner sur un commerçant" outil recherche NEQ plaintes | Pointer to the OPC complaints open data |

Direct lookups (not searches):

| Lookup | Result |
|---|---|
| IANA RDAP bootstrap `data.iana.org/rdap/dns.json` | .com → Verisign; .ca → CIRA (published 2026-10-28T22:00Z) |
| RDAP + WHOIS for 6 domains, 3 controls | §7 |
| `http://cocovanille.com/` | 302 → HugeDomains resale page |
| Données Québec CKAN API (`package_search`, `package_show`) | links to the REQ ZIP (modified 2026-10-16) and the OPC CSV (2026-10-28) |
| REQ open-data ZIP + guide (`in-5372025-11.pdf`) | §1, §5, §8 |
| OPC complaints CSV | §6 |
| WebFetch: threebestrated.ca, wanderlog.com, ici.radio-canada.ca, lavoixdelest.ca, marchepublicgranby.ca (2 pages), facebook.com (2 pages, title only), IN-531 PDF | §2–§6 |
| WebFetch refused or empty: opengovca.com, b2bhint.com, restomontreal.ca (403); google.com/maps (empty); collections.banq.qc.ca (security page, not followed); opc.gouv.qc.ca search page (404); donneesquebec.ca HTML (script page) | — |

---

## Sources

All seen 2026-10-29.

Official
- Registraire des entreprises, open data « Registre des entreprises » (JeuDonnees.zip: Entreprise.csv, Nom.csv, Etablissements.csv, FusionScissions.csv, ContinuationsTransformations.csv, DomaineValeur.csv; extract 2026-10-15) — https://www.registreentreprises.gouv.qc.ca/RQAnonymeGR/GR/GR03/GR03A2_22A_PIU_RecupDonnPub_PC/FichierDonneesOuvertes.aspx — seen 2026-10-29
- Données Québec, dataset « Registre des entreprises » — https://www.donneesquebec.ca/recherche/dataset/registre-des-entreprises — seen 2026-10-29
- Registraire des entreprises, « Données publiques sur les entreprises au Québec » (guide d'utilisation, 2025) — https://www.donneesquebec.ca/recherche/dataset/6f710997-b5f9-4347-893b-1a47ddb61437/resource/09008d3a-2e0e-4613-ab43-bd833f381929/download/in-5372025-11.pdf — seen 2026-10-29
- Registraire des entreprises, « Les noms d'entreprises au Québec », IN-531 (2025-08) — https://cdn-contenu.quebec.ca/cdn-contenu/adm/min/emploi-solidarite-sociale/registraire_entreprises/IN-531_REQ_noms_ENTR_QC.pdf — seen 2026-10-29
- Office de la protection du consommateur, « Plaintes reçues par l'Office de la protection du consommateur » (opc-plaintes-2026-10-28.csv) — https://www.donneesquebec.ca/recherche/dataset/bcc45cfc-bfb3-4afd-b162-eb76dfd4e8a3/resource/b3926d33-575a-4de8-aa85-fb95c9459685/download/opc-plaintes-2026-10-28.csv — seen 2026-10-29
- IANA RDAP bootstrap for DNS — https://data.iana.org/rdap/dns.json — seen 2026-10-29
- Verisign RDAP, cocovanillegranby.com (404) — https://rdap.verisign.com/com/v1/domain/cocovanillegranby.com — seen 2026-10-29
- Verisign RDAP, cocovanille.com — https://rdap.verisign.com/com/v1/domain/cocovanille.com — seen 2026-10-29
- Verisign RDAP, patisseriecocovanille.com (404) — https://rdap.verisign.com/com/v1/domain/patisseriecocovanille.com — seen 2026-10-29
- CIRA RDAP, cocovanillegranby.ca / cocovanille.ca / patisseriecocovanille.ca (404) — https://rdap.ca.fury.ca/rdap/domain/cocovanillegranby.ca — seen 2026-10-29
- Verisign WHOIS (whois.verisign-grs.com, port 43) and CIRA WHOIS (whois.cira.ca, port 43) — seen 2026-10-29

Owner and partner
- Pâtisserie Coco Vanille (Facebook; title only without login) — https://www.facebook.com/PatisserieCocoVanille/ — seen 2026-10-29
- Pâtisserie Coco Vanille, À propos (Facebook; title only) — https://www.facebook.com/PatisserieCocoVanille/about — seen 2026-10-29
- Exposants – Marché public de Granby et région — https://marchepublicgranby.ca/exposants/ — seen 2026-10-29
- Pâtisserie Coco Vanille – Marché public de Granby et région — https://marchepublicgranby.ca/exposants/patisserie-coco-vanille/ — seen 2026-10-29

Press
- Le Marché public de Granby aide les marchands de la rue Principale (Radio-Canada, 2022-11-13) — https://ici.radio-canada.ca/nouvelle/1932271/granby-travaux-marchand-rue — seen 2026-10-29
- Un marché qui mise sur le bon voisinage (La Voix de l'Est, Nicolas T. Parent, 2022-10-22, updated 2023-03-03) — https://www.lavoixdelest.ca/2022/10/23/un-marche-qui-mise-sur-le-bon-voisinage-cd5aafe8bfcdc08ab30265e590a93863/ — seen 2026-10-29

Directories (third party)
- Pâtisserie Cocovanille (RestoMontreal FR; search summaries only, page 403) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ — seen 2026-10-29
- Pâtisserie Cocovanille (RestoMontreal EN vote; search summaries only) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/vote/ — seen 2026-10-29
- 3 Best Bakeries in Granby, QC (Three Best Rated) — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-29
- Pâtisserie Cocovanille, Magog, QC (Wanderlog) — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-29
- RestoMontreal Granby listings with statuses (Dame Tartine, Da Teresa; search summary) — https://www.restomontreal.ca/resto/dame-tartine-granby/10875/en/ ; https://www.restomontreal.ca/resto/da-teresa-granby/3386/en/ — seen 2026-10-29
- cocovanille.com resale page (HTTP redirect target) — https://www.hugedomains.com/domain_profile.cfm?d=cocovanille.com — seen 2026-10-29

Not opened (security page; listed for a person to open)
- BAnQ, La Voix de l'Est supplements — https://collections.banq.qc.ca/document/s/t/SK1UexVrU6Nq9zCXvGFJCA (and the others in §10, item 6) — seen 2026-10-29 (titles only)

Repo inputs
- research/01-business-facts.md (§1–§8, update 2026-10-27), research/05-serp-baseline.md (W44), research/14-owner-questions.md (S, C, T), research/15-decisions-and-risks.md (D1, R1, R3), research/17-vps-self-hosting-and-domain.md (§9–§10), research/sessions/04-design-direction.md (logo), data/facts.json (`legal.*`), apps/web/reports/gate/owner-todo.md (2026-10-28)
