# 02 · Customers, jobs-to-be-done, decision journeys, price benchmarks

As of 2026-10-25 (ISO week 2026-W43). Track: personas, jobs-to-be-done (JTBD), journeys, objections → FAQ, price landscape.
Machine-readable twin: `data/price-benchmarks.csv` (35 rows after the evidence pass).

> **READ FIRST: how this file was made, and its limits**
> - **This track ran zero web searches.** All agents share one WebSearch budget (200 calls per turn), and it was used up before this track's first query. WebFetch and curl are blocked.
> - So every fact here comes from one of three places:
>   1. **Same-day, sourced findings of tracks 01, 03 and 05.** Their original URLs are carried over and labelled "via 01/03/05". Those tracks read search-result summaries only; no page was opened.
>   2. **The owner's plan** (`plan-v1-ranking-stack.md`). Its claims are labelled "plan (unsourced)" unless the plan cites a source.
>   3. **Model knowledge.** Always labelled **UNVERIFIED (model knowledge)**. Never use it in site copy until it is verified.
> - The task asked for these, and **none of them were collected**:
>   - Québec marriage counts (ISQ)
>   - wedding spend and wedding-cake trends 2025–2026
>   - Granby's large employers
>   - Zoo visitor origin
>   - quinceañera sources
>   - celiac and food-allergy prevalence
>   - Montréal and Estrie pâtisserie prices
>   - croissant and macaron prices

>   Each one is marked `[[FACT NEEDED]]` and listed in the search queue (§10). Run that queue in a follow-up turn.
> - **Evidence pass, same day (16 WebSearch calls, summaries only).** Now sourced:
>   - Québec marriage counts (ISQ)
>   - wedding-spend ranges (press, undated)
>   - food-allergy and celiac prevalence
>   - quinceañera practice in Colombia
>   - Spanish cake words by country
>
>   Searched but **not found**: Granby's large employers, Zoo visitor origin, and any published Montréal or Estrie pâtisserie price. Details are in "Evidence pass (2026-10-25)" at the end of this file.
> - WebSearch runs from the US and returns summaries. The tracks it came from did **not** see a Granby-localized results page.

---

## 0. Bottom line (decision-relevant)

1. **Two personas have evidence today: walk-in regulars and parents ordering birthday cakes.**
   - Products named in reviews: almond croissants, Paris-Brest, cream pastries, breads, coffee, ~10 seats; "custom cakes" once.
   - Ordering: "order by phone, ready next day" (2025 listing).
   - The other six personas depend on offers the owner has not confirmed: weddings, bûches, macarons, corporate boxes, quinceañera, gluten-free. (via 01)
2. **The biggest worry for the birthday-cake buyer has already happened to this shop: a cake that did not match the order** (the one public 2-star complaint, via 01). The order flow must design this out:
   - a written recap
   - a reference photo
   - approval before production
3. **The walk-in market downtown just lost a rival.**
   - Pain-Pain Boulangerie (120 rue Principale) closed on 2026-06-16 ([La Voix de l'Est](https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/), via 03).
   - Mélisse carries a "may be temporarily closed" flag (RestoMontreal snapshot 2026-07-15, via 03).
   - Bread and viennoiserie regulars are open to a new habit. This only helps if Coco Vanille's own hours and status are right (6 conflicting schedules, plus its own "temporarily closed" flag, via 01).
4. **Price band in Granby (computed from published prices; tax status mostly unknown):**

   | Option | $/portion |
   |---|---|
   | Supermarket floor (IGA) | $2.25–3.37 |
   | Ice-cream cakes | $3.41–4.90 |
   | Artisan occasion and custom cakes (3 rivals) | $4.43–6.67 |
   | Raw vegan | $7.20–12.00 |

   So an artisan portion costs **1.3× to 3.0×** a supermarket portion. A real, dated price table with a $/portion column lets buyers judge value themselves. Only one rival (Cake Design) publishes a per-portion price.
5. **The only Québec wedding per-portion figure is from 2014:** Desjardins, $5–7 per portion, ~$600 cake (via 05). Nobody publishes a fresh one. If weddings are offered, this is the data-study gap to fill. If not, leave weddings frozen, as tracks 03 and 05 recommend.
   - The market is small and flat. Québec had 23,049 marriages in 2024 (provisional) and 22,711 in 2023 ([ISQ](https://statistique.quebec.ca/en/communique/nuptiality-2024-marriage-numbers-remain-low)).
   - At the provincial rate, Granby would see roughly 180–185 marriages a year. This is computed, and the Québec population used (~9.0–9.1 M) is UNVERIFIED (model knowledge).
   - So the freeze stands.
6. **Anxiety order (inferred from the evidence; to validate with real order data):** design accuracy (proven failure) > lead time (L3 "gâteau pour demain" scores 19/20, via 05) > price per guest > allergens > transport > freshness. Every product page must answer all six above the fold.
7. **Where these buyers search:**
   - The only third-party surfaces that name the shop today are directories (RestoMontreal, Three Best Rated). Facebook, Instagram and YouTube carried **0 of 17** proxy prompts (via 05).
   - The AI answer engine found **no local source in 10 of 17** runs (via 05).
   - So the persona pages are also the AEO/GEO pages: one dated, local, sourced passage per buyer question.
8. **Spanish is a real but small lane.**
   - 535 Colombian-born residents (2021, Granby Express, via 01).
   - Granby is one of 14 Québec destination cities for government-assisted refugees (SERY, M105, via 01).
   - Zero Spanish pages surfaced for the quinceañera prompt (via 05).
   - Serve it through WhatsApp and native-written ES pages. Add a quinceañera page only if it is offered.
9. **The Zoo brings volume, not certainty.**
   - Visitors: 620,000 (2024) and >665,000 (2025) per local press, unverified (via 01).
   - Visitor origin: `[[FACT NEEDED]]`. The evidence pass searched for it and found no published breakdown. Ask the Zoo or Tourisme Granby région.
   - Distance from 3 rue Court to the Zoo: `[[FACT NEEDED]]`.
   - So the visitor page is a supporting page, not the beachhead.
10. **Persuasion stays inside the law and the platforms' rules.** All of these come from live data or not at all:
    - real anchors (the full price table)
    - real defaults (size from guest count)
    - real scarcity (slots computed from Studio capacity)
    - real social proof (live rating with date and count)

    Fake urgency, fake "was" prices and incentivised or gated reviews are ruled out (Competition Act / LPC / Google policy: sections UNVERIFIED, see §8).

---

## 1. Evidence ledger (facts that size or shape the personas)

Status: **verified** = official or 2+ sources (as judged by the source track) · **unverified** = 1 non-official source · **conflict** · **needed**.

| Fact | Value | Status | Source |
|---|---|---|---|
| Granby population, 2026 decree | 72,078 | verified (official) | [Gazette officielle 2025-12-24](https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2025F/86980.pdf) (via 01) |
| French mother tongue, Granby 2021 | 91.8% | verified | [StatCan FOGS (FR)](https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?topic=6&dguid=2021A00052447017&lang=F) (via 01) |
| Language most spoken at home | French 95.6%, English 2.8% | verified | same |
| Immigrants in Granby (2021) / from the Americas / from Colombia | 3,550 / 1,105 / 535 | unverified (press citing StatCan) | [Granby Express](https://www.granbyexpress.com/actualites/plus-de-3500-immigrants-adoptent-granby/) (via 01) |
| Refugee destination city | one of 14 in Québec | verified | [SERY](https://sery-granby.org/sery-cest/), [M105](https://m105.ca/nouvelle/granby-et-le-sery-soulignent-la-journee-mondiale-des-refugies/) (via 01) |
| Colombian refugee history; several now run businesses | documented | verified | [Le Devoir](https://www.ledevoir.com/actualites/societe/763253/immigration-de-refugies-colombiens-a-entrepreneurs-granbyiens) (via 01) |
| Spanish mother tongue, Granby CA, 2011 | 965 (1.3%) | verified | [StatCan 2011](https://www12.statcan.gc.ca/census-recensement/2011/as-sa/fogs-spg/Facts-cma-fra.cfm?LANG=Fra&GK=CMA&GC=450) (via 01); the 2021 figure is `[[FACT NEEDED]]` |
| Zoo de Granby visitors | 620,000 (2024); >665,000 (2025) | unverified (press) | [Le Guide 2024](https://www.journalleguide.com/infolettre/un-bilan-2024-en-demi-teinte-pour-le-zoo/), [Granby Express 2025](https://www.granbyexpress.com/actualites/bilan-2025-le-zoo-de-granby-rebondit-apres-une-annee-en-demi-teinte/) (via 01) |
| Zoo, summer 2025 | >500,000, +15% (zoo release) vs a ~450,000 in-season projection | conflict (timing) | [Zoo de Granby](https://www.zoodegranby.com/salle-de-presse/une-saison-estivale-couronnee-de-succes-au-zoo-de-granby), [La Tribune 2025-08-23](https://www.latribune.ca/affaires/affaires-locales/2025/08/23/le-zoo-et-le-parc-aquatique-de-bromont-font-le-plein-ERMIHVGPSJFZTKLR5WRXWYRHGI/) (via 01) |
| Zoo visitor origin (Montréal / Ontario / US) | — | **needed** (searched in the evidence pass; nothing found) | The plan's "Montréal, Ontario, Vermont" is unsourced. A Wikipedia citation title points to 2024 press saying a labour dispute hurt the Zoo's results ([Wikipedia](https://en.wikipedia.org/wiki/Granby_Zoo)), which fits the 2024 « demi-teinte » report |
| Montréal → Granby | ~80 km | unverified (travel site) | [travelprofy](https://www.travelprofy.com/montreal/granby-zoo) (via 01) |
| Festival international de la chanson de Granby | 58th edition, 13–23 Aug 2026 | unverified | [festapp](https://festapp.io/festivals/festival-international-de-la-chanson-de-granby/2026) (via 01) |
| Marché public de Granby, 2026 | Sat 2 May – 7 Nov, 9:00–14:00; Thu 18 Jun – 27 Aug, 16:00–19:00; **Coco Vanille is listed as an exhibitor** | dates unverified | [marchepublicgranby.ca exposants](https://marchepublicgranby.ca/exposants/), [Bonjour Québec](https://www.bonjourquebec.com/en-us/listing/to-see-and-do/marche-public-de-granby-et-region/1dx2) (via 01) |
| La Haute-Yamaska is in Estrie (Cantons-de-l'Est) | since 2021-07-28 | verified (official) | [ISQ](https://statistique.quebec.ca/fr/actualite/modification-decoupages-regions-administratives-estrie-et-monteregie) (via 01/03) |
| Wedding-cake vendors on WeddingWire.ca, Estrie | Sherbrooke page shows 2 results (Extra Cakes); no Granby, Bromont or Magog vendor | unverified (snapshot) | [WeddingWire Sherbrooke](https://www.weddingwire.ca/wedding-cakes/quebec/sherbrooke) (via 03) |
| Québec marriages per year | 22,908 (2022); 22,711 (2023, revised); 23,049 (2024, provisional). Range 22,000–23,500 since the early 2000s. Same-gender marriages: 730 in 2023, a record (previous high 708 in 2018) | **verified (official; read via search summary)** | ISQ: [2023 release (Sept 2024)](https://statistique.quebec.ca/fr/communique/nombre-mariages-2023), [2024 release (Sept 2025)](https://statistique.quebec.ca/en/communique/nuptiality-2024-marriage-numbers-remain-low), [2024 bulletin PDF](https://statistique.quebec.ca/en/fichier/mariages-quebec-2024.pdf). A 2025 release exists ([ISQ](https://statistique.quebec.ca/fr/communique/nombre-mariages-celebres-demeure-faible-2025)), but its figure was not captured. Estrie and Granby counts: `[[FACT NEEDED]]` |
| Average wedding spend, Québec/Canada | Québec median for recently married couples: $10,000–19,999 (rest of Canada: $20,000–29,999), Wealthsimple survey. Canada: planned ~$15,000 vs ~$25,000 actually spent (Wealthsimple). Canadians *estimate* $19,000 (BMO survey). Planners: $20,000–25,000 for ~120 guests (Québec). Desjardins 2014: $17,060 for ~100 guests | **unverified** (press; survey years not captured except Desjardins 2014) | [Narcity FR (Wealthsimple)](https://www.narcity.com/fr/cout-mariage-quebec-invites-wealthsimple), [Noovo (BMO)](https://www.noovo.info/jour-de-paye/article/mariage-et-divorce-les-canadiens-sous-estiment-la-facture-selon-bmo/), [Noovo Moi](https://www.noovomoi.ca/style-et-maison/finances/article.gerer-budget-mariage.1.8982668.html), [Desjardins](https://www.desjardins.com/fr/conseils/cout-mariage.html). [MTL Blog](https://www.mtlblog.com/wedding-cost-quebec-canada) surfaced in 05; no figure captured |
| Wedding cake per portion, Québec | $5–7; ~$600 cake | unverified, **2014 (stale)** | [Desjardins](https://www.desjardins.com/fr/conseils/cout-mariage.html) (via 05) |
| Wedding cake, 2 tiers, Canada | CA$350–900 | unverified (guide; page date unknown) | [Bridebook CA](https://app.bridebook.com/ca-en/article/how-much-does-a-wedding-cake-cost-in-canada) (via 05) |
| Granby's large employers | — | **needed** (searched in the evidence pass; no current list found) | Zoo de Granby is an employer ([Evolia listing](https://work.evolia.com/en/shifts/details/646e1d323d61aa0baea42dd9), via 01). Only stale or partial hits came back: an undated BAnQ scan naming Bombardier (4,000 staff) as the region's top employer, and a 2018 Granby Industriel report saying metal products employ the most people (sector context only). **Do not use the Bombardier figure.** Next: Granby Industriel's annual report, Ville de Granby, Registraire des entreprises |
| Celiac disease prevalence, Canada | about 1% (≈350,000 people in 2013), plus ~6% gluten-sensitive. Toronto adult serology study (2017): ~1% positive, about 90% undiagnosed (lead researcher, per U of T) | **sourced, not official** (association figure via trade press + one city-level study). No Health Canada or Celiac Canada page surfaced | [Baking Business (Canadian Celiac Association, 2013)](https://bakingbusiness.com/articles/28802-canada-approves-gluten-free-claim-for-specially-produced-oats), [U of T Nutritional Sciences (2017)](https://nutrisci.med.utoronto.ca/news/uoftgrad17-joseph-jamnik-getting-grip-gluten) |
| Food allergy prevalence, Canada | 2.5–3.1 million Canadians with at least one food allergy (Food Allergy Canada + Dalhousie survey, Oct 2021, preliminary). SPAACE (2016): 6.1% *probable* food allergy (5.9% in 2010); 9.3% self-reported (7.1% in 2010) | **sourced** (2021 survey + 2016 national study; read via search summaries) | [Dalhousie Agri-Food Analytics Lab report (2021-10-20)](https://cdn.dal.ca/content/dam/dalhousie/pdf/sites/agri-food/Dal%20Report%20Allergies%20EN%20(Oct%2020%202021).pdf), [Health Canada research summary (2020)](https://www.canada.ca/en/health-canada/services/food-nutrition/food-safety/food-allergies-intolerances/food-allergen-research-program/research-related-prevalence-food-allergies-intolerances.html), [JCI reference to the SPAACE paper](https://www.jci.org/references/scholar/39113/B6). Which of the last two URLs carries the SPAACE numbers: UNVERIFIED |
| Health Canada priority food allergens | eggs, milk, mustard, peanuts, crustaceans and molluscs, fish, sesame, soy, sulphites, tree nuts, wheat and triticale (+ gluten sources) | **UNVERIFIED (model knowledge)** | the Health Canada allergen Q&A and CFIA pages are on file in 16a ([Health Canada](https://www.canada.ca/en/health-canada/services/food-nutrition/food-labelling/allergen-labelling/questions-answers-about-new-regulations-enhance-labelling-food-allergens-gluten-added-sulphites.html), [CFIA](https://inspection.canada.ca/en/food-labels/labelling/industry/list-ingredients-and-allergens)), but their content was not read |
| Bread packed on retail premises from bulk | exempt from the *list of ingredients* | per 16a (search summary) | [CFIA](https://inspection.canada.ca/en/food-labels/labelling/industry/list-ingredients-and-allergens) (via 16a). Allergen rules for exempt items: `[[FACT NEEDED]]` |
| Coco Vanille reviews | Google 4.9 (count conflicts: "40+" as of 2026-08-01 per 03; not shown per 01); Three Best Rated 4.8 (115, 2025) | conflict on count | [RestoMontreal](https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/), [Three Best Rated](https://threebestrated.ca/bakeries-in-granby-qc) (via 01/03) |
| Coco Vanille review themes | positive: fresh pastries, almond croissants, Paris-Brest, custom cakes, friendly owners, reasonable prices; **negative (1): cake not as ordered (2★)** | unverified (summaries) | RestoMontreal, Wanderlog (via 01) |
| Coco Vanille Facebook | 605 likes → 1,046 followers (2 undated snapshots) | unverified | [Facebook](https://www.facebook.com/PatisserieCocoVanille/) (via 01) |
| Instagram @coco_vanillegranby | not surfaced | **needed** | — |

---

## 2. Persona cards

Format per card:
- **JTBD** = "When … I want … so I can …", split into functional, emotional and social jobs.
- **Offer status** = whether Coco Vanille is evidenced to sell what the persona buys.
- **System** = what runs without the owner (One-Man Empire).

Page paths and primary actions follow plan-v1 §6–§7.

### P1 · Parents ordering birthday cakes (kids' themes, smash cakes) — **beachhead**

| Field | Content |
|---|---|
| Offer status | **Partly evidenced.** "Custom cakes" appear in one review summary (RestoMontreal), and "order by phone, ready next day" (Three Best Rated, 2025) (via 01). Kids' themes and smash cakes are `[[FACT NEEDED]]`. |
| Segment evidence | 72,078 residents (2026 decree). Births and children 0–14 in La Haute-Yamaska: `[[FACT NEEDED: ISQ births by MRC; StatCan age profile]]`. "Smash cake" (a small cake a 1-year-old breaks into, for photos): the definition is common usage; trend data is **UNVERIFIED** (not searched). |
| Rivals they compare | Cake Design Granby: themed collection, minimum 16 portions, pickup slot in the cart, 7-day change cut-off ([themed collection](https://cakegranby.ca/collections/gateau-perso-thematique), [refund policy](https://cakegranby.ca/policies/refund-policy)). Avec un Grand A: 48 h lead time. IGA: $26.99 for 8–12 (via 03). |
| JTBD | Functional: « Quand la fête de mon enfant approche, je veux un gâteau à son thème, de la bonne grosseur, prêt à l'heure. » Emotional: no stress; the child's face when the cake arrives. Social: look good in front of other parents and grandparents (photos). |
| Triggers | Invitations sent. The child names a theme. A daycare or school party. "I forgot", which leads to « gâteau pour demain » (L3, score 19/20, via 05). |
| Anxieties | **Design accuracy** (the proven failure). **Lead time** (« est-ce trop tard? »). Price for N kids. Nut allergies among guests. Car transport. Freshness the day before. Licensed characters: IP risk for printed images `[[FACT NEEDED: legal]]`. |
| Where they search | Google: « gâteau de fête Granby » (C2), « combien coûte… » (I1), « quelle grosseur… 20 personnes » (I3). Maps: « pâtisserie près de moi ». Facebook parent groups: existence and size `[[FACT NEEDED]]`. Instagram for inspiration. AI assistants (I8 found no Québec price, via 05). |
| Proof they need | Real kids' cakes with dates. A price table by size with portions. The lead time as a number. Reviews that say « gâteau de fête ». The allergen list. Visible pickup slots. |
| Page → primary action | Pillar `/gateaux-personnalises-granby/` + clusters "children's birthday cakes", "smash cake", "gâteau pour demain" (only if true) + `/calculateur-portions-gateau/` → **« Créer mon gâteau »**; secondary: phone. |
| Ethical lever | **Default:** the calculator preselects the size from the guest count, and the user can change it. **Anchoring:** the full real price table with a $/portion column. **Real scarcity:** the earliest available pickup date, computed from capacity. **Commitment:** a deposit plus a written recap. |
| System | Capacity-bound date picker. Auto recap with reference photo. "C'est prêt!" SMS. Review ask the day after the party. Birthday reminder next year, only with CASL consent (plan v0c). |

Copy examples:
- FR: « Dites-nous combien d'invités : on vous propose la bonne grosseur et la date de cueillette la plus proche. »
- EN: "Tell us how many guests: we'll suggest the right size and the earliest pickup date."
- ES: « Dinos cuántos invitados: te proponemos el tamaño y la fecha de recogida más cercana. »

### P2 · Couples (weddings) — **frozen until the offer is confirmed**

| Field | Content |
|---|---|
| Offer status | **No evidence** that Coco Vanille makes wedding cakes (via 01). Tracks 03 and 05 freeze the wedding prompt set (I5, I9, C3, C7, C9). |
| Segment evidence | Québec marriages: 23,049 in 2024 (provisional), flat at 22,000–23,500 a year since the early 2000s (ISQ, §1). Granby at the provincial rate: ~180–185 a year (computed; the Québec population input is UNVERIFIED). Spend: the Québec median is $10,000–19,999 per wedding, below the rest of Canada (Wealthsimple via Narcity, undated). Wedding-cake trends 2025–2026: `[[FACT NEEDED]]` (not searched). Price: Desjardins 2014 ($5–7/portion) is the only Québec figure. Bridebook Canada gives 2 tiers at CA$350–900 (via 05). |
| Region | La Haute-Yamaska is in Estrie / Cantons-de-l'Est (ISQ). The regional wedding-cake board is near empty: WeddingWire Sherbrooke shows 2 results, and there is no Granby, Bromont or Magog vendor (via 03). Rose Gâteaux is the only Granby wedding specialist surfaced: tastings, a service area naming Bromont and Saint-Hyacinthe (via 03). Mlles Gâteaux (Montréal) surfaced for Bromont and Sherbrooke wedding searches (via 03). "Montréal couples search by region, not by town" is a plan hypothesis, **UNVERIFIED**. |
| JTBD | Functional: a cake that tastes right, matches the theme, and is delivered and set up at the venue on time, within a per-guest budget. Emotional: one less thing to worry about on the day. Social: the photo moment; guests talk about it. |
| Triggers | Venue booked. Planning season (the plan says January–March; unsourced). Tasting invitations. |
| Anxieties | Price per guest. Booking lead time (global sources say "several months", 2–3 weeks minimum for custom work; forum deposits of 20–30%: US/global, via 05). Delivery and set-up at the venue. Summer heat and buttercream. Dietary guests. The deposit and cancellation policy. |
| Where they search | Region-level Google queries. WeddingWire.ca and Mariages.net (the latter is France-centric for C3, via 05). Pinterest and Instagram. Venue vendor lists. AI assistants (I5: "no recent source", via 05). |
| Proof they need | Price per portion on the first screen. Real weddings with the venue and photographer credited (with permission). The tasting process. Delivery zones and fees. A written contract. |
| Page → primary action | `/gateaux-de-mariage/` **only if offered** → **« Réserver une dégustation »** (proposal; the plan's custom-cake CTA is « Créer mon gâteau »); secondary: a quote request. |
| Ethical lever | **Real scarcity:** a calendar of wedding dates still open, from real weekly capacity. **Anchoring:** packages with $/portion. **Social proof:** real weddings. |
| System | Tasting booking with auto reminders. A contract and deposit flow. Venue partner pages (plan §8 case studies). |

### P3 · Corporate buyers (meetings, retirements, client gifts)

| Field | Content |
|---|---|
| Offer status | **No evidence** of corporate boxes (via 01). |
| Segment evidence | List of Granby's large employers: `[[FACT NEEDED: sourced list, e.g. Ville de Granby economic development, CLD / Granby Industriel, Chamber of commerce]]`. The evidence pass found no current list (§1). The Zoo de Granby is an employer (Evolia listing, via 01). Public-sector and industrial employers are likely buyers: **UNVERIFIED**. |
| Rivals | Le Marmiton (caterer): cupcake box of 6 $17.25, box of 12 $35.00 (via 03). L7 « boîte de pâtisseries pour réunion Granby » scores 16, gated (via 05). Costco is under construction in Saint-Alphonse-de-Granby, targeting 2027 ([Le Nouvelliste 2026-10-02](https://www.lenouvelliste.ca/affaires/2026/10/02/futur-costco-le-chantier-de-construction-va-bon-train-a-saint-alphonse-de-granby-D4EBZTIGJ5A4HN2OF6BTYAAK5M/), via 03). It will lower the bulk price floor for office buyers. |
| JTBD | Functional: the right quantity, ready or delivered at a fixed time, with a compliant invoice. Emotional: no risk of embarrassment in front of the boss or a client. Social: "the person who brought the good croissants". |
| Triggers | A meeting booked. A retirement or work anniversary. The holiday party. Client gifts in December. The September rentrée (plan calendar). |
| Anxieties | Invoice with GST/QST numbers (`[[FACT NEEDED: CV tax numbers on invoices]]`). Payment by company card. Quantity per person. Allergen labels per item for a mixed group. Timing. Reorder effort. |
| Where they search | Google and Maps, colleagues, AI assistants. LinkedIn: **UNVERIFIED**. |
| Proof they need | Per-person price table. Minimum order. Lead time. A sample invoice. Allergen labels. A named corporate client (with permission). |
| Page → primary action | `/boites-corporatives/` (cluster "corporate boxes", plan §6) → **« Ajouter à ma boîte »** with a quantity default; secondary: « Demander une soumission ». |
| Ethical lever | **Default:** quantity per person preset from an owner rule (`[[FACT NEEDED: items per person]]`). **Status quo (good kind):** « Recommander la même commande » in one tap. |
| System | Saved company profile. One-tap reorder. Invoice PDF auto-generated. A December gift pre-order window. |

### P4 · Zoo de Granby and other visitors (EN-heavy)

| Field | Content |
|---|---|
| Offer status | **Inferred.** Walk-in products and ~10 seats (via 01). Picnic boxes, pre-order on arrival and foreign cards: `[[FACT NEEDED]]` (plan ideas). |
| Segment evidence | Zoo: 620k (2024), >665k (2025), unverified (§1). Origin: `[[FACT NEEDED]]` (searched; no published breakdown). English is ~2–3% of residents, so EN demand is mostly visitors (inference, via 01). The festival runs 13–23 Aug 2026 (unverified). US "Granby" pages appeared in 4 of 17 proxy runs (via 05). |
| JTBD | Functional: good coffee and pastries, or a picnic, close to the day's route, fast. Emotional: a "local find" that makes the trip. Social: the story and photo of a "real Québec pâtisserie". |
| Triggers | Trip planning the night before. Morning on the road. After the Zoo. Rain. |
| Anxieties | **Open right now?** (6 conflicting schedules, via 01). Parking downtown (rue Principale works, [Granby Express](https://www.granbyexpress.com/actualites/centre-ville-de-granby-la-phase-2-des-travaux-de-revitalisation-est-lancee/), via 01). Distance from the Zoo `[[FACT NEEDED]]`. Language. Payment. Seats. |
| Where they search | Maps ("near me", "open now"). Tripadvisor (a listing exists; rating snapshots conflict, via 03). AI assistants ("bakery near Granby Zoo", L8). Tourism sites: CV was not surfaced on granbyregion.com (via 03). Apple Maps for iPhone users: plan claim, **UNVERIFIED**. |
| Proof they need | Correct hours today. Photos of the counter. Minutes from the Zoo. Recent visitor reviews. An EN menu. |
| Page → primary action | `/en/visit/` « En visite à Granby / Visiting Granby » (plan §14) → **Directions**; secondary: pre-order for pickup. |
| Ethical lever | **Friction removal:** "open now" computed from one hours record; pickup time defaults to the stated arrival time. **Social proof:** dated visitor reviews. |
| System | Hours from a single Studio record pushed to the GBP and site. A spring refresh reminder (plan). |

Copy example: EN "Pâtisserie Coco Vanille is downtown Granby, Québec, [[N]] minutes by car from the Granby Zoo. Pre-order croissants for pickup when you arrive."

### P5 · Latin-American families (cumpleaños, quinceañera, community moments)

| Field | Content |
|---|---|
| Offer status | Birthday cakes: same product as P1 (partly evidenced). **Quinceañera: no evidence** (via 01). |
| Segment evidence | 535 Colombian-born; 1,105 born in the Americas (2021, Granby Express). Refugee destination city (SERY, M105). 965 Spanish mother-tongue speakers in 2011 (StatCan). Order of magnitude ~1% (via 01). |
| Culture (evidence pass; search summaries, mapping of each claim to one URL not isolated) | **Sourced:**<br>• The fiesta de quince is "very traditional and common" in Colombia. It marks the girl's passage to womanhood ([Reach the World](https://www.reachtheworld.org/la-fiesta-de-quince-images-0), [LensCulture](https://www.lensculture.com/projects/383035-quinceaneras-in-colombia)).<br>• Typical elements: a large, brightly coloured dress with décor to match; a waltz with the father; a shoe-change or ring ritual.<br>• Parents invite "a great many people": family, friends, neighbours, teachers. Families of modest means borrow to pay for it.<br>• Recent parties are less traditional and fit the girl's personality ([Boston Globe, 2026-09-11](https://www.bostonglobe.com/2026/09/11/magazine/jovenes-latinas-cambian-tradicion-quinceanera/)). One source says the ribbon-cutting of the « torta » is no longer usual ([Diario de Cuyo](https://www.diariodecuyo.com.ar/noticias/quinceaneras-una-noche-a-medida-803806.html); it is Argentine, so do not apply it to Colombia).<br>**Words:** in Mexico « torta » means a sandwich and cake is « pastel » ([SpanishDict](https://www.spanishdict.com/answers/210408/what-is-the-difference-between-una-torta-and-pastel)). For Colombia, « ponqué » (also « torta ») appears only on low-reliability Q&A pages.<br>**Still `[[FACT NEEDED]]`:** guest counts, cake size and flavour conventions (e.g. tres leches). |
| JTBD | Functional: a large, elegant cake for many guests, ordered in Spanish. Emotional: honour the daughter and the family's culture far from home. Social: the community sees a proper celebration. |
| Triggers | The event date (planned months ahead). Venue rented. Community dates listed in the plan: Amor y Amistad (3rd Saturday of September), Novena (Dec 16–24). Demand is **UNVERIFIED** (plan). |
| Anxieties | Being understood (language). Price for many guests. Tiered-cake transport. The deposit. Flavour authenticity. |
| Where they search | WhatsApp and word of mouth (hypothesis). Facebook community groups `[[FACT NEEDED]]`. Google in Spanish (I10: zero Spanish pages, via 05). AI assistants in Spanish. |
| Proof they need | A Spanish page written by a native speaker. Photos. $/portion. A WhatsApp reply in minutes (rank-first `07-local.md`: offer messaging only if answered within minutes). |
| Page → primary action | `/es/pasteles-personalizados-granby/` (+ `/es/…quinceañera…` only if offered) → **WhatsApp pre-filled** (plan §7): « Hola, quiero cotizar una torta para el [[fecha]] para [[N]] personas. » |
| Ethical lever | **Processing fluency:** native language and the community's own words. **Social proof:** real community testimonials, with permission. |
| System | WhatsApp quick replies drafted from Studio facts. Allergen text is never machine-translated (plan v0b). |

### P6 · Allergy and gluten-free families — **legal-gated**

| Field | Content |
|---|---|
| Offer status | **No evidence** of gluten-free or allergen-controlled products (via 01). A « sans gluten » claim needs a controlled process and a labelling review (05: "gated + legal"). |
| Segment evidence | Canada prevalence (sourced in the evidence pass, §1):<br>• celiac ~1%, most cases undiagnosed (Canadian Celiac Association 2013; Toronto study 2017)<br>• 2.5–3.1 million people with at least one food allergy (Food Allergy Canada + Dalhousie, 2021, preliminary)<br>• 6.1% probable food allergy (SPAACE 2016)<br><br>Applied to Granby's 72,078 residents (computed; assumes the national rates hold locally): ~720 celiac residents and ~4,400 with a probable food allergy. Granby: no gluten-free bakery surfaced. Les Crudélices sells raw vegan cakes, gluten-free per 03. Sherbrooke's Extra Cakes lists gluten-, lactose- and nut-free options (via 03). |
| JTBD | Functional: know exactly what is in the cake and the cross-contact risk. Emotional: the child eats like the others, safely. Social: not "the difficult parent". |
| Triggers | A party invitation. A diagnosis. A school rule (nut-free classes: **UNVERIFIED**). |
| Anxieties | Cross-contact. Staff knowledge. Label accuracy. Whether the claim is true. |
| Where they search | « gâteau sans gluten Granby » (C6: recipe sites only, via 05). Allergy Facebook groups `[[FACT NEEDED]]`. AI assistants. |
| Proof they need | A human-verified allergen list per product (plan v0a §6.1, §6.7). A plain cross-contact statement. A described process. **No "sans gluten" claim until validated.** |
| Page → primary action | `/allergenes/` (an honest policy page; the plan's `/sans-gluten-allergies/` only after validation) → **« Voir les allergènes »** on each product; secondary: phone to discuss. |
| Ethical lever | **Transparency only.** Never scarcity or urgency here: safety beats conversion. |
| System | Allergen fields picked from a checklist by a human; labels printed from the same fields (16a). |

Copy example (FR): « Nos gâteaux sont préparés dans une cuisine où l'on utilise des noix, du blé, des œufs et du lait. Nous ne pouvons pas garantir l'absence de traces. » (Placeholder: the real ingredient list is `[[FACT NEEDED]]`.)

### P7 · Walk-in regulars (viennoiseries, bread, coffee) — **core, defend now**

| Field | Content |
|---|---|
| Offer status | **Evidenced:** almond croissants, Paris-Brest, chocolate tart, cream pastries, breads and baguettes (also frozen), vol-au-vent (order ahead), coffee, ~10 seats (via 01). Chocolatines: not evidenced. |
| Segment evidence | Downtown: rue Court meets rue Principale. Marché public exhibitor (Saturdays May–Nov). The Pain-Pain closure (2026-06-16) and Mélisse's flag leave bread and viennoiserie habits unclaimed. Mont Rose (190 rue Principale, chain, Uber Eats, 70+ Google reviews) is the walk-in rival (via 03). |
| JTBD | Functional: a fresh croissant and good coffee without a wait; bread for the house. Emotional: a small daily pleasure. Social: "my bakery"; the owners know them (reviews: friendly owners). |
| Triggers | Morning routine. Saturday market. Guests coming over. |
| Anxieties | **Open?** Sold out of the favourite item. Parking during the works. The wait. |
| Where they search | Maps "open now". The Facebook page (1,046 followers). Instagram stories (handle unconfirmed). Word of mouth. |
| Proof they need | Exact hours. "What's in the case today". Fresh-bake times (`[[FACT NEEDED]]`). |
| Page → primary action | Home + `/nous-trouver/` → **Directions**; secondary: « Réserver mes croissants » (pickup pre-order, only if offered). |
| Ethical lever | **Habit loop:** a real "today's special" post. **Real scarcity:** « Les croissants aux amandes partent souvent avant [[heure]] », only if POS data shows it. **Endowed progress:** a loyalty card, if the owner wants one; terms disclosed. |
| System | Daily "vitrine" post drafted from the Studio catalogue. Hours synced to the GBP. A QR review card at the till (no incentive). |

### P8 · Gift buyers (Saint-Valentin, Fête des mères, Noël)

| Field | Content |
|---|---|
| Offer status | **Unknown.** Bûches, macarons and gift boxes are not evidenced (via 01). C4 « bûche de Noël Granby » scores 19 and becomes #1 for Nov–Dec **only if** bûches are confirmed by 2026-11-01 (via 05). |
| Calendar (computed) | Saint-Valentin 2027-02-14 (a Sunday). Pâques 2027-03-28. Fête des mères 2027-05-09 (2nd Sunday of May). Noël 2026-12-25 (a Friday). Prep windows: plan §14 (pre-orders from Nov 1 for Noël). |
| Rival signals | Crème (Saint-Hyacinthe) ran a Saint-Valentin « gâteau célibataire » ([Noovo Moi](https://www.noovomoi.ca/sortir/restos-bars/gateau-celibataire-saint-valentin.html), via 03). Les Crudélices sells gift cards ([gift card](https://www.lescrudelices.ca/boutique/p/cartecadeau), via 03). |
| JTBD | Functional: a beautiful local gift, reserved ahead, quick pickup. Emotional: show care without running around. Social: a gift that impresses ("from the pâtisserie, not the grocery store"). |
| Triggers | The date approaching. Social posts. Last year's purchase. A consented reminder email. |
| Anxieties | Sold out. Crowds on the day. Packaging and gift message. Price. |
| Where they search | Facebook and Instagram posts, GBP posts, Google « bûche de Noël Granby », email (opt-in). |
| Proof they need | Photos, price, pickup windows, the pre-order cut-off date. |
| Page → primary action | Seasonal page (e.g. `/buches-de-noel/`) **only for confirmed products** → **« Précommander »** with a slot picker. |
| Ethical lever | **Loss aversion, only when true:** « Précommandes jusqu'au [[date]] ». A real cut-off from production capacity. **Pre-commitment:** pre-ordering spares the buyer the queue. |
| System | Pre-order windows open and close by date. Slot capacity per pickup hour. A next-year reminder (CASL consent). |

---

## 3. Persona priority (build order)

Prompt scores (/20) from 05; "gated" = blocked on an owner fact.

| Rank | Persona | CV offer evidence | Segment evidence | Search opening (05) | Call |
|---|---|---|---|---|---|
| 1 | P7 Walk-in regulars | strong | downtown; two bread rivals closed or flagged | C1 18, C8 17, L1 17, L6 18 (gated: chocolatines) | **Defend now:** GBP status and hours, `/nous-trouver/`, home key facts |
| 2 | P1 Parents, birthday cakes | partial (custom cakes, next-day) | population only | L3 19, C2 18, I3 17, I1 16, I2 16, L2 14 | **Beachhead** (plan): pillar, `/prix/`, calculator, order flow |
| 3 | P4 Visitors | inferred | Zoo 620k–665k/yr (unverified) | L5 15, L8 15 | Supporting: `/en/visit/` |
| 4 | P8 Gift buyers | unknown | calendar only | C4 19 (conditional), C5 17 (gated) | Conditional: bûche page only if confirmed by 2026-11-01 |
| 5 | P5 Latin-American | birthday yes; quince no | 535 Colombian-born | I10 17, C10 18, L10 19 (low volume) | ES core pages + WhatsApp; quinceañera gated |
| 6 | P3 Corporate | none | employers needed (searched; no current list) | L7 16 (gated) | After ordering ships; quote + reorder |
| 7 | P6 Allergy / GF | none; legal | celiac ~1%; 6.1% probable food allergy (sourced) | C6 17 (gated + legal) | Allergen transparency page only |
| 8 | P2 Couples | none | ~23,000 Québec marriages/yr, flat (ISQ); Granby ~180–185 (computed) | I5 15, C3 17, C7 18, C9 17 (gated) | **Frozen** |

---

## 4. Journey maps (search → choose → order → pickup → review)

### 4.1 P1 custom birthday cake (the reference journey)

| Stage | Customer question | Touchpoints | What must exist | Failure today (evidence) | Studio event to log |
|---|---|---|---|---|---|
| Search | « Combien? Pour demain? Quelle grosseur? » | Google, Maps, AI assistants | Answer block with a dated price; `/prix/`; calculator; GBP products with prices | No site; no price published anywhere; directories show wrong hours, and "mercredi au dimanche" is already repeated by an AI answer (via 01/05) | `prompt_rank`, `gbp_view` |
| Choose | « Can they do my theme? Is it good? » | Site gallery, reviews, Instagram | Dated real photos per theme; reviews; lead time; allergen list | No gallery or prices; thin, conflicting review counts (via 01) | `product_view`, `calculator_used` |
| Order | « Is my date free? What exactly will I get? » | Configurator, phone, WhatsApp (ES) | Capacity-bound date picker; recap with size, flavour, message, reference photo; deposit; terms of sale (LPC) | Phone only; one wrong-cake complaint (via 01) | `order_created`, `recap_approved` |
| Pickup | « Ready when? How do I carry it? » | SMS, shop | « C'est prêt! » message; transport guide; box | Hours conflict (via 01) | `pickup_on_time` |
| Review / repeat | « Would I come back? » | SMS or email the day after the party | Review ask with the direct link, no incentive, no gating; next-year reminder with consent | Review base thin and split across platforms (via 01) | `review_requested`, `review_posted`, `repeat_order` |

### 4.2 Variants (only where they differ)

| Persona | Search | Choose | Order | Pickup | Review |
|---|---|---|---|---|---|
| P7 Walk-in | Maps "open now" | Facebook "today's case" | none (or pickup pre-order) | counter | QR card at the till → Google |
| P4 Visitor | AI / Tripadvisor / Maps from out of town | `/en/visit/`: minutes from the Zoo, parking | optional pre-order with arrival time | counter | Tripadvisor + Google |
| P5 ES | Spanish query, or WhatsApp via word of mouth | ES page | WhatsApp quote → deposit link | shop | Google review in Spanish (reply in Spanish, plan v0b) |
| P3 Corporate | Google "boîte réunion Granby" | per-person table | basket or quote → invoice | pickup or delivery `[[FACT NEEDED]]` | reorder, not review |
| P8 Gift | social post / GBP post | seasonal page | pre-order + slot | timed pickup window | review + next-year reminder |
| P2 Wedding | region query, WeddingWire | `/gateaux-de-mariage/` | tasting → contract → deposit | delivery + set-up | review + venue case study |

---

## 5. Objections → FAQ (5–8 per page; pick from this bank)

Rule: the first sentence answers. Placeholders stay until the owner supplies the fact; Studio blocks publishing while any `[[…]]` remains (plan §7).

| # | Objection (persona) | FR (Québec phrasing) | EN / ES | Answer pattern | Page |
|---|---|---|---|---|---|
| 1 | Lead time (P1) | « C'est-tu possible d'avoir un gâteau pour demain? » (plan) | EN "Can I get a cake for tomorrow?" · ES «¿Puedo tener una torta para mañana?» | « Oui : commandez avant [[14 h]] pour une cueillette le lendemain, dans les formats [[liste]]. » **Only if true** | L3 cluster, pillar |
| 2 | Lead time (P1, P2) | « Combien de jours d'avance faut-il commander? » | EN "How far in advance should I order?" | Table by cake type: next-day / standard / tiered: [[N]] days | pillar « Délais » |
| 3 | Price (P1) | « Combien coûte un gâteau de fête? » | EN "How much is a custom birthday cake?" · ES «¿Cuánto cuesta una torta de cumpleaños?» | « À partir de [[prix]] $ pour [[N]] portions (taxes [[incluses/en sus]], prix au [[date]]). » | `/prix/` |
| 4 | Size (P1, P3) | « Quelle grosseur de gâteau pour 20 personnes? » | EN "What size cake for 20 people?" | « Pour 20 personnes, un gâteau de [[X]] po ([[Y]] cm). » + table | calculator |
| 5 | Design accuracy (P1, P2) | « Est-ce que mon gâteau va ressembler à la photo? » | EN "Will my cake look like the photo?" | « Vous recevez un récapitulatif écrit avec votre photo de référence; on commence seulement après votre approbation. » (the process to build) | pillar, order flow |
| 6 | Themes / characters (P1) | « Pouvez-vous faire un gâteau avec un personnage? » | — | `[[FACT NEEDED: owner policy + legal view on licensed characters]]` | kids' cluster |
| 7 | Transport (P1, P2, P5) | « Comment transporter un gâteau à étages en auto? » | EN "How do I transport a tiered cake by car?" | Numbered steps (flat floor, A/C, non-slip mat): the shop's own method `[[FACT NEEDED]]` | transport cluster (I4) |
| 8 | Freshness (P1) | « Comment conserver un gâteau à la crème jusqu'au lendemain? » | — | Fridge, covered; cite MAPAQ / Health Canada `[[FACT NEEDED: exact guidance + URL]]` (via 05) | storage cluster (I7) |
| 9 | Allergens (P6, P1) | « Avez-vous des gâteaux sans noix ou sans gluten? » | EN "Do you have nut-free or gluten-free cakes?" · ES «¿Tienen pasteles sin nueces o sin gluten?» | Honest cross-contact statement; product allergen lists; no "sans gluten" claim until validated | `/allergenes/` |
| 10 | Hours (P7, P4) | « Êtes-vous ouverts le dimanche? » | EN "Are you open on Sunday?" | From the single hours record `[[FACT NEEDED]]` | `/nous-trouver/` |
| 11 | Delivery (P1, P3, P2) | « Faites-vous la livraison? » | EN "Do you deliver?" | `[[FACT NEEDED: zones, fees]]` | pillar, `/nous-trouver/` |
| 12 | Deposit / cancellation (all ordered items) | « Faut-il un dépôt? Puis-je annuler? » | — | Policy text reviewed for the LPC `[[FACT NEEDED]]` | `/conditions-de-vente/` |
| 13 | Visitor (P4) | « À quelle distance êtes-vous du Zoo? » | EN "How far are you from the Granby Zoo?" (plan v0b) | « À [[N]] minutes en auto du Zoo de Granby. » | `/en/visit/` |
| 14 | Language (P5) | — | ES «¿Puedo pedir en español por WhatsApp?» | «Sí, escríbenos por WhatsApp al [[número]]; respondemos en [[tiempo]].» | ES pages |
| 15 | Invoice (P3) | « Pouvez-vous fournir une facture avec TPS et TVQ? » | EN "Can you provide an invoice with GST/QST?" | `[[FACT NEEDED]]` | `/boites-corporatives/` |
| 16 | Weddings (P2) | « Faites-vous des gâteaux de mariage? Offrez-vous des dégustations? » | EN "Do you make wedding cakes?" | Only once confirmed | wedding page (gated) |

FAQ format to copy: a bakery help-centre FAQ held 3 of the top 4 links for I9, with one question per short page ([Rashmi's Bakery help](https://www.rashmisbakery.com/help/wedding-and-events/how-far-in-advance-should-i-book-my-wedding-cake), via 05).

---

## 6. Pricing landscape (feeds `/prix/`, the comparison page and the Q1 data study)

All prices were seen 2026-10-25 by other tracks via search summaries. $/portion is computed from the published price ÷ the portion range. Tax status is unknown except where stated. Full rows: `data/price-benchmarks.csv`.

| Tier | Examples (Granby unless stated) | $/portion (computed) | Notes |
|---|---|---|---|
| Supermarket floor | IGA Le Rêve $26.99 (10–12), L'Indécis $26.99 (8–10) | 2.25–3.37 | chain catalogue; Marché Gazaille lists the service |
| Ready-made, unsized | Maxi ~$30 large cakes; Charlotte's 475 g $6.00; Walmart dessert cakes from $6 | n/a | national online pages; Granby stock unverified |
| Ice-cream cakes | Maître Glacier Choco-Fraise $49 (10–12), Napolitain $54.50 (15–16) | 3.41–4.90 | not pastry; owns « gâteau crème glacée Granby » (via 03) |
| Artisan occasion and custom | Rose Gâteaux $57 (12, taxes incl.), $62 (14); Avec un Grand A Framboisier $40 (6–8) / $60 (10–12); Cake Design $5/portion (min 16), from $95 (7 in), from $150 (25+, 2+ tiers) | 4.43–6.67 | the band Coco Vanille competes in |
| Raw vegan niche | Les Crudélices $36 (3–5), $72 (6–8) | 7.20–12.00 | do not fight here (03) |
| Cupcakes | Le Marmiton $3.45 each, box of 6 $17.25, box of 12 $35.00; Cake Design from $35/dozen; Émotions Gâteaux from $8 (city unverified) | 2.88–3.45 each (Granby) | corporate and party add-on |
| Wedding (guides) | Desjardins 2014: $5–7/portion, ~$600 cake (Québec); Bridebook: 2 tiers $350–900 (Canada) | 5–7 (stale) | no live Estrie price captured |
| Viennoiseries (croissant, chocolatine), macarons | — | — | **none captured** `[[FACT NEEDED]]` |
| Montréal and Estrie pâtisseries (celebration cakes) | Evidence pass searched Sherbrooke, Saint-Hyacinthe, Bromont, Magog, Montréal, Longueuil and Première Moisson. Named shops with **no price in any result**: Pâtisserie Duquette (Sherbrooke), Extra Cakes (Sherbrooke), La Demi-Calorie (Saint-Hyacinthe), Rhubarbe (Montréal), Géraldine Gâteau (Longueuil) | — | **none captured** `[[FACT NEEDED]]`. In these summaries, Québec pâtisseries rarely publish celebration-cake prices, so a dated price table is rare in the region (information gain). The data study needs direct collection (phone or email). France €-priced pages (e.g. €7.50/part, [dish.co PDF](https://cdn.website.dish.co/media/f4/69/9546646/Gateaux-personnalises.pdf), via 05) are not comparable |
| Home-bake floor (reference only) | Fondation OLO recipe sheet: 20 cm (8 po) round cake, 8–10 portions, ingredients $0.54/portion | 0.54 (ingredients, not retail) | sheet date not captured ([PDF](https://fondationolo.ca/media/mdebhwtk/fondation-olo-recette-gateau-fete-v2.pdf)). Use it on the comparison page for « faire soi-même », never as a price tier |

Readings:
- The artisan band runs at 1.3× to 3.0× the supermarket portion (computed: 4.43 ÷ 3.37 to 6.67 ÷ 2.25). The comparison page must say what the difference buys: customisation, design, freshness, local and allergen answers. Give a verdict per use case: « Pour un gâteau dans 2 heures, le supermarché est votre meilleure option » (plan §6).
- **Only one price in the set says whether taxes are included** (Rose Gâteaux, "taxes incluses"). Coco Vanille's table must state tax treatment on every row (LPC price display, see §8).
- **No page date was captured for any rival price** (03 §2b). A dated table (« Prix en vigueur au [[date]] ») is information gain for AEO/GEO.
- Granby rivals state sizes in inches ("1 tier, 7 in", via 03). Publish **inches + cm + portions** (I3 answers came in cm from France and in inches from EN guides, via 05).

Q1 2027 data study (« Prix des gâteaux de fête au Québec », plan §8). Method draft:
- **Scope:** published prices only. Target N ≥ 30 businesses across Granby, Estrie, Montérégie and Montréal. Current N is 7 Granby businesses + 3 chains + 3 guides (+ 1 home-bake reference row), not yet enough. The evidence pass found no published price outside Granby.
- **Per row:** business, city, product, size, portions, price, tax status, date seen, URL, and a screenshot archived in Studio.
- **Output:** the median and interquartile range of $/portion by region and tier.
- **Rules:** no ranking of named rivals, a one-line credit line, the method published.

```js
// scripts/price-per-portion.mjs: $/portion from data/price-benchmarks.csv
// Uses only rows priced "per cake" with "N portions" or "N-M portions". Re-tested 2026-10-25 on the 35-row file (10 rows qualify).
import { readFileSync } from 'node:fs';

function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

function portions(s) {
  const m = /(\d+)\s*-\s*(\d+)\s*portions/.exec(s) || /(\d+)\s*portions/.exec(s);
  return m ? { lo: Number(m[1]), hi: Number(m[2] ?? m[1]) } : null;
}

const rows = parseCsv(readFileSync(process.argv[2] ?? 'data/price-benchmarks.csv', 'utf8'));
const out = rows
  .filter((r) => r.price_basis.startsWith('per cake'))
  .map((r) => ({ r, p: portions(r.size_or_portions), price: Number(r.price_cad) }))
  .filter(({ p, price }) => p && Number.isFinite(price))
  .map(({ r, p, price }) => ({
    business: r.business, product: r.product, price,
    perPortionLow: +(price / p.hi).toFixed(2), perPortionHigh: +(price / p.lo).toFixed(2),
  }));
console.table(out);
```

Coco Vanille's own row: `[[FACT NEEDED: price list by size, portions per size, tax treatment, lead time]]`.

---

## 7. Behavioural levers: which to use, and how

Principle: every persuasive element reads from live Studio data (prices, capacity, reviews, cut-offs). When the data is missing, the element does not render.

| Lever | Ethical use (example) | Never | Persona |
|---|---|---|---|
| Anchoring | Full real price table, every size listed, with a $/portion column | Fake "was" prices; a decoy size that is not really sold | P1, P2, P3 |
| Defaults | Size preselected from guest count; earliest real pickup slot; quantity per person (corporate) | Pre-checked add-ons; pre-checked marketing consent | P1, P3, P4 |
| Real scarcity | "N slots left" / "Fully booked" computed from capacity (code below) | Countdown timers with no real cut-off; invented stock counts | P1, P2, P8 |
| Social proof | Live Google rating **with count and date**; real photos with permission; "most ordered size" from real orders | Fake, staff or incentivised reviews; asking only happy customers ("gating"); marking up own Google reviews as `aggregateRating` (rank-first `07-local.md` §4) | all |
| Loss aversion (only when true) | « Précommandes de bûches jusqu'au [[date]] » | "Dernière chance" when there is none | P8 |
| Commitment | Deposit; written recap approved before production; tasting credited to the order (if true) | Hidden non-refundable terms | P1, P2, P5 |
| Reciprocity | Free calculator, transport and storage guides, no email wall | Gating guides behind an email | P1, P2 |
| Peak-end | « C'est prêt! » SMS, clean box, thank-you note; the review ask after the event | Promotions inside transactional messages (16a, CASL) | all |
| Fluency | Québec-French phrasing (« gâteau de fête », « en auto »); native ES | Machine-translated allergens (plan v0b) | P5, P1 |
| Status quo (good kind) | « Recommander la même commande » | Auto-renewing orders without consent | P3 |

```js
// lib/honest-scarcity.mjs: a slot message only when real capacity data supports it.
// No data → no claim. Plenty of room → no message (never invent urgency). Tested 2026-10-25.
const T = {
  fr: { closed: 'Commandes fermées pour cette date', full: 'Complet pour cette date',
        left: (n) => `Il reste ${n} place${n > 1 ? 's' : ''} pour cette date`, until: (d) => `Commandez avant ${d}` },
  en: { closed: 'Orders closed for this date', full: 'Fully booked for this date',
        left: (n) => `${n} spot${n > 1 ? 's' : ''} left for this date`, until: (d) => `Order before ${d}` },
  es: { closed: 'Pedidos cerrados para esta fecha', full: 'Completo para esta fecha',
        left: (n) => `Queda${n > 1 ? 'n' : ''} ${n} cupo${n > 1 ? 's' : ''} para esta fecha`, until: (d) => `Pide antes del ${d}` },
};
const LOCALE = { fr: 'fr-CA', en: 'en-CA', es: 'es' };

export function slotLabel({ capacity, booked, cutoff }, { now = new Date(), lang = 'fr', lowAt = 3 } = {}) {
  const t = T[lang] ?? T.fr;
  if (cutoff && now >= cutoff) return t.closed;
  if (!Number.isInteger(capacity) || !Number.isInteger(booked) || capacity <= 0) return null;
  const left = Math.max(0, capacity - booked);
  if (left === 0) return t.full;
  if (left <= lowAt) return t.left(left);
  if (cutoff) {
    const d = new Intl.DateTimeFormat(LOCALE[lang] ?? 'fr-CA', {
      weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZone: 'America/Toronto',
    }).format(cutoff);
    return t.until(d);
  }
  return null;
}
// slotLabel({ capacity: 40, booked: 38, cutoff }) → "Il reste 2 places pour cette date"
// slotLabel({ capacity: 40, booked: 10, cutoff }) → "Commandez avant dimanche 20 décembre à 14 h 00"
```

---

## 8. Legal limits on the levers (all sections UNVERIFIED: to confirm with the legal track)

| Rule | What it means for the levers | Status |
|---|---|---|
| Competition Act (R.S.C. 1985, c. C-34): false or misleading representations; drip pricing; ordinary-selling-price rules for "was/now" claims | No fake urgency, no hidden fees added at checkout, no invented reference prices. Fake reviews are a Competition Act risk (plan v1 §14, v0c) | **UNVERIFIED (model knowledge)**. `[[FACT NEEDED: legal track to cite sections + Competition Bureau URLs]]` (also open in 03 §6) |
| Loi sur la protection du consommateur (Québec, chapter P-40.1): no false or misleading representation; no omission of an important fact; the advertised price must be the total price (taxes aside) | `/prix/` and the configurator show the full price before checkout; deposit and cancellation terms in plain view | **UNVERIFIED (model knowledge)**: articles 219, 224 c) and 228 recalled, not checked on Légis Québec. `[[FACT NEEDED]]` |
| LPC tipping rule | Plan v0c: "if you suggest tips, calculate them on the pre-tax amount (rule since May 2025)" | plan (unsourced). Check if a tip prompt is planned at the café till or online |
| CASL | Transactional messages (confirmation, reminder, « C'est prêt! ») may be exempt from consent (s. 6(6)(b)); sources disagree on identification and unsubscribe rules (16a). Birthday reminders and promos need consent; plan v0b states implied consent for 2 years after a purchase | 16a cites sources; the plan v0b claim is UNVERIFIED |
| Google review policy | No incentives, no gating, no staff or family reviews (rank-first `07-local.md` §4) | the policy text was not re-read this session: **UNVERIFIED** |
| Ad Standards influencer disclosure | Disclose any paid or gifted creator content (plan v0a) | plan (unsourced) |
| Food labelling and gluten-free claims (Health Canada / CFIA / MAPAQ) | No « sans gluten » claim without a validated process; allergen statements human-verified | `[[FACT NEEDED]]` (16a lists the pages but did not read them) |

---

## 9. Implications for UX and content

1. **Answer the six worries on every product page, above the fold:** design (photo + process), lead time (number), price (with $/portion and tax status), allergens, transport, freshness. The readiness score in plan v0a §6.4 already checks price, portions, lead time and allergens. Add "design-approval process" and "transport note".
2. **Guest count first.** The configurator opens with « Combien d'invités? ». It preselects a size (the calculator logic) and shows the price right away. That one input serves P1, P3 and P5.
3. **Capacity is the source of truth.** The date picker, slot labels (`slotLabel`), seasonal pre-orders and the "gâteau pour demain" promise all read the same Studio capacity table. No capacity data → no promise shown.
4. **Design-accuracy loop.** The steps:
   - reference photo upload
   - auto recap (size, flavour, colours, message)
   - owner approval message
   - production starts only after the customer confirms

   This designs out the one public complaint, and its log becomes "Ce qu'on a mesuré" data (plan §7).
5. **One hours record**, pushed to the GBP, the site, `openingHoursSpecification` and the visitor page. "Open now" is computed, never typed (fixes the walk-in and visitor worry; via 01/05).
6. **Clusters that answer questions where the current top results are weak** (via 05):
   - transport (I4)
   - storage (I7)
   - size per guest (I3)
   - lead time (I2)
   - "for tomorrow" (L3, only if true)

   Each gets a 40–60-word answer under a question H2, in Québec phrasing, with inches + cm.
7. **Proof blocks fed by data:**
   - live rating with count and date (never `aggregateRating` from own Google reviews)
   - a dated real-photo gallery by theme
   - "most ordered size" from order data, once N ≥ 30 orders (`[[FACT NEEDED]]`)
8. **Language lanes:**
   - FR is the default.
   - EN is shaped for visitors (`/en/visit/` + EN ordering).
   - ES runs on WhatsApp first, with native-written pages.
   - The plan's conversion band applies (Spanish → WhatsApp pre-filled).
9. **Gated pages stay unpublished** until the owner confirms the offer: weddings, bûches, macarons, corporate boxes, quinceañera, gluten-free. Studio's `[[FACT NEEDED]]` publish guard enforces this.
10. **Comparison page** (`/comparatif-gateau-de-fete-granby/`): compare categories (supermarket / ice-cream cake / artisan / home baker), using the computed bands above with sources and dates, and a verdict per use case. No denigration; legal review first (03 §6).
11. **One-Man Empire automation map:**

    | Moment | Automation |
    |---|---|
    | Order | auto recap + deposit link |
    | Day before | reminder SMS |
    | Ready | « C'est prêt! » |
    | Day after the event | review ask (FR/EN/ES) |
    | +11 months | birthday reminder (consented) |
    | Season | pre-order windows open and close by date |
    | Corporate | one-tap reorder + auto invoice |

    The owner's manual work is limited to approving designs, allergen fields and AI-drafted replies (plan v0a §6.7).

---

## 10. Open items

### 10.1 [[FACT NEEDED]] from the owner (blocking first)

1. Open in October 2026? GBP not "temporarily closed"? (blocks everything; via 01)
2. Current hours, including Sunday and holidays.
3. Price list by size: portions per size (inches and cm), tax treatment.
4. Lead times by cake type; next-day policy and cut-off hour.
5. Daily or weekly capacity (cakes per day; pickup slots per hour).
6. Design process today (photo approval?) and the facts behind the 2-star complaint.
7. Allergen policy, cross-contact, MAPAQ permit (01 item 13).
8. Which offers exist: themed kids' cakes, smash cakes, weddings, bûches, macarons, chocolatines, corporate boxes, quinceañera, gluten-free, delivery (zones, fees).
9. Deposit, cancellation, refund terms.
10. Payment methods (foreign cards?), parking, minutes to the Zoo.
11. GST/QST numbers on invoices; company-card payment.
12. Instagram handle and follower count; live Google review count.
13. Order history export (for "Ce qu'on a mesuré" and "most ordered size").

### 10.2 Search queue: run when the WebSearch budget is available (one line each)

- **[done 2026-10-25: Québec totals]** ISQ: « nombre de mariages Québec 2024 Institut de la statistique »; still open: « mariages par région administrative Estrie » and the 2025 figure
- **[partly: ranges found, no dated 2025 survey]** « coût moyen mariage Québec 2025 sondage » · "average wedding cost Canada 2025 survey" (next: the Wealthsimple report itself)
- « tendances gâteau de mariage 2026 Québec » · "wedding cake trends 2026"
- « gâteau de mariage prix par portion Montréal 2026 » · « gâteau de mariage Cantons-de-l'Est prix »
- « salles de réception mariage Cantons-de-l'Est » (venue partners) · « Tourisme Cantons-de-l'Est mariage »
- **[searched, not found]** « principaux employeurs Granby »; still to run: « Granby Industriel entreprises » · « Technum Québec Granby employeurs »
- **[searched, not found]** « provenance des visiteurs Zoo de Granby »; next: Tourisme Granby région or Tourisme Cantons-de-l'Est visitor studies, or ask the Zoo
- **[done: prevalence]** « Celiac Canada prevalence » · « Food Allergy Canada statistics »; still open: « Santé Canada allergènes prioritaires liste »
- « MAPAQ conservation gâteau à la crème » (I7) · « Santé Canada allégation sans gluten exigences »
- **[partly: practice sourced; cake conventions open]** "quinceañera cake traditions" · « torta de quince años Colombia tradición » · « fiesta de quince Colombia ponqué »
- « gâteau smash cake Québec prix » · « smash cake Granby »
- **[searched: no published prices]** « prix gâteau personnalisé 8 pouces Montréal pâtisserie » · « prix gâteau anniversaire Sherbrooke pâtisserie » · « prix gâteau Bromont pâtisserie »; next: specific shop sites (e.g. Rhubarbe, Duquette, La Demi-Calorie) or phone collection
- « prix croissant pâtisserie Montréal 2026 » · « prix chocolatine Québec 2026 » · « prix boîte 6 macarons Montréal »
- « prix cupcakes douzaine Sherbrooke » · **[searched, not found]** « Première Moisson gâteau prix »
- « NETendances 2025 réseaux sociaux Québec » · « NETendances intelligence artificielle 2025 » (where Québécois search and use AI)
- « groupe Facebook parents Granby » · « groupe Facebook mariage Estrie »
- « dépenses Saint-Valentin Canada 2026 sondage » · « Fête des mères dépenses Canada sondage » · « bûche de Noël prix Québec 2025 »
- « Loi sur la concurrence indication de prix partiel » · « Bureau de la concurrence faux avis en ligne »
- « Loi sur la protection du consommateur article 224 prix » · « OPC pourboire calcul avant taxes 2025 »
- « Google avis politique incitatifs » (review incentives policy)

---

## Evidence pass (2026-10-25)

16 WebSearch calls (US-located, summaries only; no page opened). Searches covered tracks 02 and 04 together. Pages were read through search summaries, so "verified" means the official source's own summary, not a page read.

| Item | Before | After | Decision impact |
|---|---|---|---|
| Québec marriages per year | needed | **23,049 (2024, provisional); 22,711 (2023)**; flat since the early 2000s (ISQ) | Confirms the wedding freeze: Granby ≈ 180–185 marriages a year at the provincial rate (computed; population input UNVERIFIED) |
| Wedding spend | needed | Ranges only: Québec median $10,000–19,999 (Wealthsimple via Narcity); planners $20,000–25,000; BMO estimate $19,000; all undated | Québec couples spend less than the rest of Canada → any wedding offer needs a clear $/portion entry point |
| Celiac prevalence | UNVERIFIED (model) | ~1% (Canadian Celiac Association 2013 via trade press; Toronto study 2017). No Health Canada page found | ≈ 720 Granby residents (computed). A real but small segment, and the claim stays legal-gated |
| Food-allergy prevalence | UNVERIFIED (model) | 2.5–3.1 M Canadians (Food Allergy Canada + Dalhousie 2021, preliminary); SPAACE 2016: 6.1% probable | ≈ 4,400 Granby residents (computed). Supports an allergen list on every product page as a core feature |
| Granby's large employers | needed | **still needed** (only an undated Bombardier figure and a 2018 sector note) | P3 corporate stays last; get the list from Granby Industriel |
| Zoo visitor origin | needed | **still needed** (no breakdown published in results) | `/en/visit/` copy must not claim "Ontario / US visitors" |
| Quinceañera in Colombia | UNVERIFIED (model) | Practice sourced: common in Colombia; many guests; dress-matched décor; recent shift to personalised parties | ES quinceañera page stays gated on the offer. The "many guests" point supports a large-format option, if one exists |
| ES cake words | hypothesis | Mexico: « pastel » (« torta » = sandwich); Colombia: « torta » / « ponqué » on low-reliability sources only | Keep « Pasteles y tortas » in ES H1s; never « torta » alone on Mexican-facing copy |
| Pâtisserie price lists (Montréal, Estrie, Montérégie) | none | **none found** in 4 searches; 5 shops named in §6 with no published price | The dated `/prix/` table is rare in the region (strong information gain); the data study must collect prices directly |
| Price CSV | 34 rows | 35 rows (+ Fondation OLO home-bake reference, $0.54/portion in ingredients; excluded from tiers) | Comparison page « faire soi-même » row |

Edits made: header row count; READ FIRST note; §0 items 5 and 9; §1 rows for Zoo origin, marriages, spend, employers, celiac, food allergy; P2, P3, P4, P5 and P6 segment rows; §3 priority table; §6 pricing rows, data-study N and the code comment; §10.2 queue statuses. Nothing was deleted except replaced UNVERIFIED or `[[FACT NEEDED]]` markers.

Search queue (unsearched or failed, carry forward):
- ISQ marriages by region (Estrie), plus the 2025 figure from the ISQ 2025 release
- Granby Industriel annual report: top employers
- Tourisme Granby région / Zoo: visitor origin
- Health Canada priority allergens list (canada.ca)
- Celiac Canada's own prevalence page
- Quinceañera cake conventions (size, guests, flavours) from Colombian sources
- Shop-specific price pages: Rhubarbe, Duquette, La Demi-Calorie, Première Moisson
- Croissant, chocolatine and macaron prices
- Wedding-cake trends 2026

---

## Sources

All URLs below were surfaced by same-day WebSearch summaries from tracks 01, 03, 05 or 16a (not opened, not re-searched by this track). Each was seen 2026-10-25.

Granby, demographics, immigration, tourism
- Gazette officielle du Québec, 24 décembre 2025 (décret de population 2026) — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2025F/86980.pdf — seen 2026-10-25
- Série « Perspective géographique », Recensement de 2021 – Granby, langues (StatCan) — https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?topic=6&dguid=2021A00052447017&lang=F — seen 2026-10-25
- Série « Perspective géographique », Recensement de 2011 – AR de Granby (StatCan) — https://www12.statcan.gc.ca/census-recensement/2011/as-sa/fogs-spg/Facts-cma-fra.cfm?LANG=Fra&GK=CMA&GC=450 — seen 2026-10-25
- Plus de 3500 immigrants adoptent Granby (Granby Express) — https://www.granbyexpress.com/actualites/plus-de-3500-immigrants-adoptent-granby/ — seen 2026-10-25
- De réfugiés colombiens à entrepreneurs granbyens (Le Devoir) — https://www.ledevoir.com/actualites/societe/763253/immigration-de-refugies-colombiens-a-entrepreneurs-granbyiens — seen 2026-10-25
- Sery c'est… (SERY) — https://sery-granby.org/sery-cest/ — seen 2026-10-25
- Granby et le SERY soulignent la Journée mondiale des réfugiés (M105) — https://m105.ca/nouvelle/granby-et-le-sery-soulignent-la-journee-mondiale-des-refugies/ — seen 2026-10-25
- Modification des découpages des régions administratives Estrie et Montérégie (ISQ) — https://statistique.quebec.ca/fr/actualite/modification-decoupages-regions-administratives-estrie-et-monteregie — seen 2026-10-25
- Bilan 2025: le Zoo de Granby rebondit (Granby Express) — https://www.granbyexpress.com/actualites/bilan-2025-le-zoo-de-granby-rebondit-apres-une-annee-en-demi-teinte/ — seen 2026-10-25
- Un bilan 2024 en demi-teinte pour le Zoo (Le Guide) — https://www.journalleguide.com/infolettre/un-bilan-2024-en-demi-teinte-pour-le-zoo/ — seen 2026-10-25
- Une saison estivale couronnée de succès au Zoo de Granby — https://www.zoodegranby.com/salle-de-presse/une-saison-estivale-couronnee-de-succes-au-zoo-de-granby — seen 2026-10-25
- Le Zoo de Granby et le parc aquatique de Bromont à plein régime (La Tribune, 2025-08-23) — https://www.latribune.ca/affaires/affaires-locales/2025/08/23/le-zoo-et-le-parc-aquatique-de-bromont-font-le-plein-ERMIHVGPSJFZTKLR5WRXWYRHGI/ — seen 2026-10-25
- Zoo de Granby employer listing (Evolia) — https://work.evolia.com/en/shifts/details/646e1d323d61aa0baea42dd9 — seen 2026-10-25
- Montreal to Granby Zoo (travelprofy) — https://www.travelprofy.com/montreal/granby-zoo — seen 2026-10-25
- FICG 2026 (festapp) — https://festapp.io/festivals/festival-international-de-la-chanson-de-granby/2026 — seen 2026-10-25
- Exposants – Marché public de Granby — https://marchepublicgranby.ca/exposants/ — seen 2026-10-25
- Marché public de Granby et région (Bonjour Québec) — https://www.bonjourquebec.com/en-us/listing/to-see-and-do/marche-public-de-granby-et-region/1dx2 — seen 2026-10-25
- Centre-ville de Granby: la phase 2 des travaux de revitalisation est lancée (Granby Express) — https://www.granbyexpress.com/actualites/centre-ville-de-granby-la-phase-2-des-travaux-de-revitalisation-est-lancee/ — seen 2026-10-25

Coco Vanille (entity, reviews, social)
- Pâtisserie Cocovanille Granby (RestoMontreal EN) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/ — seen 2026-10-25
- 3 Best Bakeries in Granby, QC (Three Best Rated) — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-25
- Pâtisserie Coco Vanille (Facebook) — https://www.facebook.com/PatisserieCocoVanille/ — seen 2026-10-25
- Pâtisserie Coco Vanille (Tripadvisor .ca) — https://www.tripadvisor.ca/Restaurant_Review-g182165-d27188801-Reviews-Patisserie_Coco_Vanille-Granby_Quebec.html — seen 2026-10-25
- Pâtisserie Cocovanille (Wanderlog) — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-25

Competitors and prices (Granby)
- Cake Design Granby – Gâteaux sur mesure — https://cakegranby.ca/products/gateau-sur-mesure — seen 2026-10-25
- Cake Design – saveurs et tarifs — https://www.cakegranby.com/saveurs_tarifs.php — seen 2026-10-25
- Cake Design Granby – Gâteaux thématiques — https://cakegranby.ca/collections/gateau-perso-thematique — seen 2026-10-25
- Cake Design Granby – Politique de remboursement — https://cakegranby.ca/policies/refund-policy — seen 2026-10-25
- 3 Best Cakes in Granby, QC (Three Best Rated) — https://threebestrated.ca/cakes-in-granby-qc — seen 2026-10-25
- Avec un Grand A – Commande en ligne — https://www.avecungranda.com/commande-en-ligne — seen 2026-10-25
- Avec un Grand A – Gâteau Framboisier — https://www.avecungranda.com/product/gateau-framboisier/ — seen 2026-10-25
- Avec un Grand A – Gâteau Boston — https://www.avecungranda.com/product/gateau-boston-cream-pie/ — seen 2026-10-25
- Avec un Grand A – Gâteau Choco noisette — https://www.avecungranda.com/product/gateau-choco-noisette — seen 2026-10-25
- Rose Gâteaux – home — https://rosegateaux.com/ — seen 2026-10-25
- Rose Gâteaux – shower de bébé — https://www.rosegateaux.com/shower-de-bebe.html — seen 2026-10-25
- Les Crudélices – Menu — https://www.lescrudelices.ca/menu — seen 2026-10-25
- Les Crudélices – Carte cadeau — https://www.lescrudelices.ca/boutique/p/cartecadeau — seen 2026-10-25
- Le Marmiton – home — https://lemarmiton.ca/ — seen 2026-10-25
- Le Marmiton – Cupcake individuel — https://lemarmiton.ca/menuitems/cupcake-individuel-saveur-du-jour/ — seen 2026-10-25
- Maître Glacier Granby – Gâteaux — https://granby.maitreglacier.com/categorie-produit/gateaux-2/ — seen 2026-10-25
- Maître Glacier Granby – Fraisier-chocolaté — https://granby.maitreglacier.com/produit/fraisier-chocolate/ — seen 2026-10-25
- Service traiteur IGA – Gâteau Le Rêve — https://traiteur.iga.net/categories/102/product/631?lang=fr — seen 2026-10-25
- Service traiteur IGA – Gâteau l'Indécis — https://traiteur.iga.net/categories/102/product/692?lang=fr — seen 2026-10-25
- IGA – Marché Gazaille — https://www.iga.net/fr/recherche_de_magasin/magasin/8212-marche-gazaille — seen 2026-10-25
- Maxi – Gâteaux d'anniversaire et de célébration — https://www.maxi.ca/fr/alimentation/boulangerie/g-teaux/g-teaux-d-anniversaire-et-de-c-l-bration/c/59507 — seen 2026-10-25
- Maxi – Charlotte's Gâteau Célébration à la vanille — https://www.maxi.ca/fr/g-teau-c-l-bration-la-vanille/p/21381555_EA — seen 2026-10-25
- Walmart.ca – Everyday dessert cakes — https://www.walmart.ca/en/browse/grocery/bread-bakery/cakes-cupcakes/everyday-dessert-cake/10019_6000194327359_6000198840549_6000207191740 — seen 2026-10-25
- Les proprios de la boulangerie Pain-Pain tournent la page (La Voix de l'Est, 2026-06-16) — https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/ — seen 2026-10-25
- Futur Costco: le chantier va bon train à Saint-Alphonse-de-Granby (Le Nouvelliste, 2026-10-02) — https://www.lenouvelliste.ca/affaires/2026/10/02/futur-costco-le-chantier-de-construction-va-bon-train-a-saint-alphonse-de-granby-D4EBZTIGJ5A4HN2OF6BTYAAK5M/ — seen 2026-10-25

Regional, wedding and guide sources
- WeddingWire.ca – The 10 Best Wedding Cakes in Sherbrooke — https://www.weddingwire.ca/wedding-cakes/quebec/sherbrooke — seen 2026-10-25
- WeddingWire.ca – Extra Cakes (Sherbrooke) — https://www.weddingwire.ca/wedding-cakes/extra-cakes--e8919 — seen 2026-10-25
- WeddingWire.ca – Émotions Gâteaux — https://weddingwire.ca/wedding-cakes/emotions-gateaux--e72715 — seen 2026-10-25
- Desjardins – coût d'un mariage — https://www.desjardins.com/fr/conseils/cout-mariage.html — seen 2026-10-25
- Bridebook – How much does a wedding cake cost in Canada — https://app.bridebook.com/ca-en/article/how-much-does-a-wedding-cake-cost-in-canada — seen 2026-10-25
- MTL Blog – wedding cost Quebec — https://www.mtlblog.com/wedding-cost-quebec-canada — seen 2026-10-25
- Rashmi's Bakery help – How far in advance should I book my wedding cake — https://www.rashmisbakery.com/help/wedding-and-events/how-far-in-advance-should-i-book-my-wedding-cake — seen 2026-10-25
- Gateaux personnalises (PDF, France, €) — https://cdn.website.dish.co/media/f4/69/9546646/Gateaux-personnalises.pdf — seen 2026-10-25
- Noovo Moi – Gâteau célibataire Saint-Valentin (Crème) — https://www.noovomoi.ca/sortir/restos-bars/gateau-celibataire-saint-valentin.html — seen 2026-10-25

Food labelling (listed by 16a; content not read)
- Questions and Answers About the New Regulations to Enhance the Labelling of Food Allergens (Health Canada) — https://www.canada.ca/en/health-canada/services/food-nutrition/food-labelling/allergen-labelling/questions-answers-about-new-regulations-enhance-labelling-food-allergens-gluten-added-sulphites.html — seen 2026-10-25
- List of ingredients and allergens on food labels (CFIA) — https://inspection.canada.ca/en/food-labels/labelling/industry/list-ingredients-and-allergens — seen 2026-10-25

Evidence pass (WebSearch summaries, seen 2026-10-25; pages not opened)
- Nombre de mariages en 2023 (ISQ, communiqué, Sept 2024) — https://statistique.quebec.ca/fr/communique/nombre-mariages-2023 — seen 2026-10-25
- Nuptiality 2024: marriage numbers remain low (ISQ, Sept 2025) — https://statistique.quebec.ca/en/communique/nuptiality-2024-marriage-numbers-remain-low — seen 2026-10-25
- Marriages in Québec 2024 (ISQ bulletin PDF) — https://statistique.quebec.ca/en/fichier/mariages-quebec-2024.pdf — seen 2026-10-25
- Le nombre de mariages célébrés demeure faible en 2025 (ISQ; figure not captured) — https://statistique.quebec.ca/fr/communique/nombre-mariages-celebres-demeure-faible-2025 — seen 2026-10-25
- Voici combien un mariage vide les poches des Québécois (Narcity FR, Wealthsimple survey; undated) — https://www.narcity.com/fr/cout-mariage-quebec-invites-wealthsimple — seen 2026-10-25
- Mariage et divorce : les Canadiens sous-estiment la facture, selon BMO (Noovo; undated) — https://www.noovo.info/jour-de-paye/article/mariage-et-divorce-les-canadiens-sous-estiment-la-facture-selon-bmo/ — seen 2026-10-25
- Gérer le budget de son mariage (Noovo Moi; undated) — https://www.noovomoi.ca/style-et-maison/finances/article.gerer-budget-mariage.1.8982668.html — seen 2026-10-25
- A new report suggests 3.1 million Canadians have food allergies (Dalhousie Agri-Food Analytics Lab, 2021-10-20) — https://cdn.dal.ca/content/dam/dalhousie/pdf/sites/agri-food/Dal%20Report%20Allergies%20EN%20(Oct%2020%202021).pdf — seen 2026-10-25
- 2020: Research related to the prevalence of food allergies and intolerances (Health Canada) — https://www.canada.ca/en/health-canada/services/food-nutrition/food-safety/food-allergies-intolerances/food-allergen-research-program/research-related-prevalence-food-allergies-intolerances.html — seen 2026-10-25
- Overall prevalence of self-reported food allergy in Canada (JCI reference entry) — https://www.jci.org/references/scholar/39113/B6 — seen 2026-10-25
- One in 13 Canadians live with a food allergy (CTV; title only) — https://vancouverisland.ctvnews.ca/health/article/one-in-13-canadians-live-with-a-food-allergy-study — seen 2026-10-25
- Canada approves gluten-free claim for specially produced oats (Baking Business; cites the Canadian Celiac Association, 2013) — https://bakingbusiness.com/articles/28802-canada-approves-gluten-free-claim-for-specially-produced-oats — seen 2026-10-25
- #UofTGrad17: Joseph Jamnik, getting a grip on gluten (U of T Nutritional Sciences, 2017-06-09) — https://nutrisci.med.utoronto.ca/news/uoftgrad17-joseph-jamnik-getting-grip-gluten — seen 2026-10-25
- Granby Zoo (Wikipedia; citation to 2024 labour-dispute article) — https://en.wikipedia.org/wiki/Granby_Zoo — seen 2026-10-25
- La fiesta de Quince (Reach the World) — https://www.reachtheworld.org/la-fiesta-de-quince-images-0 — seen 2026-10-25
- Quinceañeras in Colombia (LensCulture) — https://www.lensculture.com/projects/383035-quinceaneras-in-colombia — seen 2026-10-25
- Jóvenes latinas cambian la tradición de la quinceañera (Boston Globe, 2026-09-11) — https://www.bostonglobe.com/2026/09/11/magazine/jovenes-latinas-cambian-tradicion-quinceanera/ — seen 2026-10-25
- Quinceañeras, una noche a medida (Diario de Cuyo, Argentina) — https://www.diariodecuyo.com.ar/noticias/quinceaneras-una-noche-a-medida-803806.html — seen 2026-10-25
- abceconomia.co (quinceañera cost article; title not captured) — https://abceconomia.co/?p=33934 — seen 2026-10-25
- What is the difference between una torta and pastel (SpanishDict answers) — https://www.spanishdict.com/answers/210408/what-is-the-difference-between-una-torta-and-pastel — seen 2026-10-25
- Recette gâteau (Fondation OLO, PDF; date not captured) — https://fondationolo.ca/media/mdebhwtk/fondation-olo-recette-gateau-fete-v2.pdf — seen 2026-10-25
- 3 Meilleurs Pâtisseries à Sherbrooke (Three Best Rated) — https://threebestrated.ca/fr-gâteaux-in-sherbrooke-qc — seen 2026-10-25
- Pâtisserie Duquette (circulaire-en-ligne) — https://www.circulaire-en-ligne.ca/patisserie-duquette — seen 2026-10-25
- 3 Meilleurs Pâtisseries à Saint-Hyacinthe (Three Best Rated) — https://threebestrated.ca/fr-gâteaux-in-saint-hyacinthe-qc — seen 2026-10-25
- Première Moisson (RestoMontreal) — https://www.restomontreal.ca/resto/premiere-moisson-montreal/17355/fr/ — seen 2026-10-25

Internal references (repo and skill files, not web sources)
- research/01-business-facts.md, research/03-competitors.md, research/05-serp-baseline.md, research/16a-admin-ux-inspiration.md
- research/plan-v1-ranking-stack.md (§5–§8, §14), research/plan-v0a-master-plan.md, research/plan-v0b-multilingual-local-domination.md, research/plan-v0c-site-ux-ordering.md
- rank-first skill: references/07-local.md (§4 reviews policy), references/16-market-intelligence.md (§3 price-page and comparison moves)
