# 04 · Keyword universe, question bank, seasonal calendar (Granby, FR/EN/ES)

As of 2026-10-25 (ISO week 2026-W43). Track: keywords, demand, question bank, seasonal plan (Ranking Stack Layers 7.2–7.3, 9.1–9.4, 13.4; rank-first `04-research-prompts.md`, `06-architecture.md`, `08-aeo-geo.md`).
Machine-readable twins: `data/keywords.csv` (220 rows) and `data/seasonal-calendar.csv` (45 rows, Nov 2026 – Dec 2027).
Inputs: `research/plan-v1-ranking-stack.md` (backbone: §5 prompts, §6 page tree, §14 calendar), `plan-v0b` (§A2, §C2), `plan-v0c` (Layer 3, §4), `research/01-business-facts.md`, `research/03-competitors.md`.

## Method and limits (read first)

- **This track ran 0 web searches.** The shared WebSearch budget (200 calls per turn, all agents) was used up before this track's first query. WebFetch and curl are blocked. Every query this track planned is in §8, so it can run in a follow-up turn.
- Evidence comes from three places only:
  1. URLs that tracks 01, 03 and 05 surfaced on 2026-10-25. Those searches ran from the US and returned summaries: **not a Granby-localized SERP**, no map pack, no PAA box, no autocomplete. This track did not reopen the URLs.
  2. The owner's plans (v0a/v0b/v0c/v1). These are labelled "owner plan" and count as UNVERIFIED for facts.
  3. Dates computed in JavaScript (§7). The algorithm is deterministic; the rule it applies (for example "2nd Sunday of May") is sourced or marked.
- **No search volumes anywhere.** `relative_demand` is a **prior** (high / medium / low) that sets build order. It follows the rubric in §1. Replace it with Keyword Planner ranges, Search Console and a Granby PAA/autocomplete harvest in the baseline week.
- `evidence_url` in `keywords.csv` proves **supply**: an aggregator, competitor or retailer page exists for the term or product, or Coco Vanille is documented selling the item. It does **not** prove demand. 86 of 220 rows have a URL. The other 134 say `UNVERIFIED`.
- The question bank (§5) is a **seed written from the category, not a PAA harvest**. Keep the IDs and replace the wording with what Google shows from Granby (rank-first 04 §4.3).

## 0. Decision-relevant findings

1. **The products that have evidence are viennoiseries, bread and pastries, not weddings.** Sources document croissants (almond included), Paris-Brest, tarts, bread and baguettes (also frozen), strawberry shortcake, a raspberry cake, vol-au-vent, coffee and ready meals ([RestoMontreal](https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/), [Three Best Rated](https://threebestrated.ca/bakeries-in-granby-qc), [Wanderlog](https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille), [La Voix de l'Est 2022](https://www.lavoixdelest.ca/2022/10/23/un-marche-qui-mise-sur-le-bon-voisinage-cd5aafe8bfcdc08ab30265e590a93863/)). There is no evidence of weddings, macarons, bûches, gluten-free products, corporate boxes or delivery (01-business-facts §5). **10 of the 38 pages in §2 are CONDITIONAL, and 2 more (P09 smash cake, P11 bûches) wait on product confirmation.** Build them only after the owner confirms the product.
2. **Two NEW pages protect the position the shop already holds.** Coco Vanille is #2 on Three Best Rated's *bakery* list but absent from its FR « pâtisseries » (cakes) list ([TBR bakeries](https://threebestrated.ca/bakeries-in-granby-qc), [TBR FR pâtisseries](https://threebestrated.ca/fr-gâteaux-in-granby-qc)). `/viennoiseries/` and `/pains-baguettes/` defend « boulangerie Granby », where it is the incumbent. The pillar attacks « gâteau personnalisé », where Cake Design, Avec un Grand A and Rose Gâteaux are already online.
3. **The bread slot is open.** Pain-Pain, #1 on the bakery lists, closed on 2026-06-16 ([La Voix de l'Est](https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/)). « pain artisanal / boulangerie Granby » therefore gets a medium-to-high prior.
4. **Québec retailers use both birthday terms.** Maxi's category is « Gâteaux d'anniversaire et de célébration » ([Maxi](https://www.maxi.ca/fr/alimentation/boulangerie/g-teaux/g-teaux-d-anniversaire-et-de-c-l-bration/c/59507)), and Le Marmiton (Granby) writes « gâteau d'anniversaire … personnalisé » ([Le Marmiton](https://lemarmiton.ca/dessert-choco-vanille/)). « Gâteau de fête » rests on the owner plan and was not verified in this run. Rule: « gâteau de fête » in the H1, « anniversaire » in the body and the meta description. After 8 weeks of impressions, Search Console decides.
5. **Easter 2027 falls on 28 March (computed, §7).** It overlaps the temps des sucres. Publish `/paques/` by **2027-01-31** and run one combined maple-and-Easter push in February.
6. **Noël 2026 cannot be won organically by the new site.** The content site goes live in plan weeks 3–6, after the 1 November pre-order date (plan §14). For 2026, use GBP products and posts plus Facebook. Optional: put the evergreen `/buches-de-noel/` URL on the holding page now, so it already has a history for 2027 (hypothesis; Google guarantees no indexing time, rank-first 08 §1). **Dec 2027 is the first holiday season the site can compete for.**
7. **The bare brand term is ambiguous.** "Coco Vanille" is also a Mancera perfume and a bakery in Bras-Panon, Réunion. Montréal has an unrelated "Pâtisserie Coco" ([Alshaya](https://alshayaperfumes.com/en/products/mancera-coco-vanille-edp-120-ml), [Facebook Bras-Panon](https://www.facebook.com/CocoVanille97412/), [Tastet](https://tastet.ca/critiques/patisserie-coco-quartier-chinois/)). Every brand sentence, title and bio says "Coco Vanille" **plus "Granby"**. Track "Cocovanille" (the Maps spelling) as a variant.
8. **Spanish is a subset, split by country.** The Spanish-speaking population is about 1% scale: 965 Spanish mother-tongue speakers in the Granby CA in 2011 ([StatCan 2011](https://www12.statcan.gc.ca/census-recensement/2011/as-sa/fogs-spg/Facts-cma-fra.cfm?LANG=Fra&GK=CMA&GC=450)), and 535 Colombian-born residents in 2021 (press, [Granby Express](https://www.granbyexpress.com/actualites/plus-de-3500-immigrants-adoptent-granby/)). Every ES row is rated low. ES H1s pair Colombian « torta » with Mexican « pastel »: « Pasteles y tortas … ». That split comes from the owner plan and is UNVERIFIED.
9. **Three terms to exclude.** Ice-cream cakes belong to Maître Glacier (head office in Granby). Raw vegan cakes belong to Les Crudélices. Beignes belong to Tim Hortons. These keywords stay in the CSV under the `exclude` cluster so nobody writes pages for them.
10. **Cross-check with track 05 (`research/05-serp-baseline.md`, US-run proxy).**
    - Québec food media also write « gâteaux d'anniversaire » ([Tastet](https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/)), which supports rule 3.1 (both terms).
    - The results for the informational prompts I1–I7 were dominated by France and Belgium, so Québec markers are the edge: CAD, « po », 14 h, Québec terms.
    - I10 returned zero Spanish pages.
    - Track 05 left the viennoiseries and order slugs as "TBD". §2 proposes `/viennoiseries/` and `/commander/`.
11. **One vocabulary conflict across tracks.** The public site uses « cueillette » (owner plan), while the Studio design uses « Ramassage » (`16b-admin-tech-subdomain.md`). Pick one word for the site, Studio, emails and the GBP: `[[FACT NEEDED: owner choice + OQLF Grand dictionnaire check]]`.

## 1. Relative-demand rubric (priors, not volumes)

| Rating | Rule (all must hold) | Typical members |
|---|---|---|
| high | A head category or map-pack term for a 72,078-resident city ([Gazette officielle 2025-12-24](https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2025F/86980.pdf)) where French is the mother tongue of 91.8% ([StatCan 2021](https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?topic=6&dguid=2021A00052447017&lang=F)); buyer intent; ≥ 2 aggregators build Granby pages for it, or it is a peak-season product term | pâtisserie / boulangerie Granby, pâtisserie près de moi, gâteau personnalisé / de fête Granby, bûche de Noël Granby (Nov–Dec) |
| medium | A product or occasion term with ≥ 1 competitor page, a seasonal spike, EN visitor intent tied to the Zoo, or an informational query asked province-wide | gâteau pour demain, commander en ligne, chocolatine, prix par portion, quelle grosseur de gâteau, bakery near Granby Zoo |
| low | Long tail, a dietary niche, a Spanish term, a product with no evidence, or an informational query with national competition and a small local buyer share | smash cake, macarons, torta de quinceañera, pouding chômeur |

Counts in `keywords.csv`: 8 high, 55 medium, 157 low. 148 FR, 40 EN, 32 ES.
Override rules: buyer intent beats volume (rank-first 04 §7). Ignore "0–10/month" readings for small cities (owner plan v0b §A2). Compare each month with the same month last year before calling a drop (plan §14).

## 2. Cluster map → page tree

Plan §6 pages are kept (P01–P16). NEW pages (P17–P38) are the ones the clusters justify. "Wave": v1 = content site (plan weeks 3–6); v2 = after ordering goes live (weeks 11–14+); "seasonal" = by the publish-by date in §6.

| ID | Page | FR | EN | ES | Clusters (`keywords.csv`) | Prompts (plan §5) | Status | Wave |
|---|---|---|---|---|---|---|---|---|
| P01 | Home | / | /en/ | /es/ | brand, category, reviews | C1, C8, C10, B1–B3 | core | v1 |
| P02 | Pillar | /gateaux-personnalises-granby/ | /en/custom-cakes-granby/ | /es/pasteles-personalizados-granby/ | custom-cakes, birthday, milestones, latino | C2, L10 | core (custom cakes mentioned once in reviews) | v1 |
| P03 | Prices | /prix/ | /en/prices/ | /es/precios/ | prices | I1, I8 | core `[[FACT NEEDED: price list]]` | v1 |
| P04 | Comparison | /comparatif-gateau-de-fete-granby/ | /en/birthday-cake-options-granby/ | /es/comparativo-pasteles-granby/ | comparison, "meilleur(e)" | C1, C2 | core | v1 |
| P05 | Calculator | /calculateur-portions-gateau/ | /en/cake-serving-calculator/ | /es/calculadora-porciones-pastel/ | portions | I3 | core | v1 |
| P06 | Visit | /nous-trouver/ | /en/visit/ | /es/como-llegar/ | near-me, hours | L1, L4, B2 | core | v1 |
| P07 | About + chef | /a-propos/ | /en/about/ | /es/nosotros/ | brand | B1, B3 | core | v1 |
| P08 | Kids' cakes | /gateaux-enfants/ | /en/kids-birthday-cakes/ | section of P02 | kids-cakes | — | plan cluster | v1 |
| P09 | Smash cake | /smash-cake/ | /en/smash-cake/ | — | smash-cake | — | plan cluster; product `[[FACT NEEDED]]` | v2 |
| P10 | Wedding | /gateaux-de-mariage/ | /en/wedding-cakes/ | /es/pasteles-de-boda/ | wedding | C3, C7, C9, I5, I9 | **CONDITIONAL** | only if offered |
| P11 | Bûches | /buches-de-noel/ | /en/yule-logs/ | /es/tronco-de-navidad/ | buche-noel | C4 | plan cluster; product `[[FACT NEEDED]]` | seasonal |
| P12 | Allergies | /sans-gluten-allergies/ | /en/gluten-free-allergies/ | /es/sin-gluten-alergias/ | dietary | C6 | allergen policy page always; product claims only if true | v1 |
| P13 | Cake for tomorrow | /gateau-pour-demain/ | /en/cake-for-tomorrow/ | /es/pastel-para-manana/ | cake-tomorrow | L3 | some evidence (TBR 2025 listing); `[[FACT NEEDED: cut-off hour]]` | v1 |
| P14 | Corporate boxes | /boites-bureau-corporatif/ | /en/corporate/ | — | corporate | L7 | **CONDITIONAL** | v1/v2 |
| P15 | Transport + storage | /transporter-conserver-gateau/ | /en/cake-transport-storage/ | /es/transportar-conservar-pastel/ | transport-storage | I4, I7 | informational (no product needed) | v1 |
| P16 | Zoo visitors | /en-visite-a-granby/ | /en/visiting-granby/ | /es/visita-granby/ | visitors | L5, L8 | plan cluster | v1, refresh in spring |
| P17 | **Order / catalogue** | /commander/ | /en/order/ | /es/pedidos/ | order-online, delivery | L2, L9 | NEW (from v0b/v0c) | v1 (temporary form) → full at weeks 11–12 |
| P18 | **Viennoiseries** | /viennoiseries/ | /en/viennoiseries/ | — | viennoiseries | L6 | NEW, evidenced | v1 |
| P19 | **Bread + baguettes** | /pains-baguettes/ | /en/bread/ | /es/panaderia/ | breads, « boulangerie » | — | NEW, evidenced | v1 |
| P20 | **Pastries (display case)** | /patisseries/ | /en/pastries/ | /es/postres/ | pastries | — | NEW, evidenced | v2 |
| P21 | **Cakes catalogue (menu cakes, cupcakes)** | /gateaux/ | /en/cakes/ | /es/pasteles/ | menu-cakes, cupcakes | — | NEW, partly evidenced | v2 |
| P22 | **Macarons** | /macarons/ | /en/macarons/ | — | macarons | C5 | NEW, **CONDITIONAL** | if offered |
| P23 | **Gift boxes + gift card** | /boites-cadeaux/ · /carte-cadeau/ | /en/gift-boxes/ · /en/gift-card/ | /es/regalos/ | gifting | — | NEW, **CONDITIONAL** | before Nov 2027 |
| P24 | **Traiteur / ready meals** | /traiteur-pret-a-manger/ | /en/catering-ready-meals/ | — | traiteur, vol-au-vent | — | NEW, partly evidenced (2022 market, vol-au-vent) | v2 |
| P25 | **Pies + Québec desserts** | /tartes-desserts-quebecois/ | /en/quebec-desserts/ | — | quebec-desserts, Action de grâce | — | NEW, **CONDITIONAL** | before Sep 2027 |
| P26 | Galette des rois | /galette-des-rois/ | /en/king-cake/ | /es/galette-des-rois/ | galette-rois | — | seasonal (v0c), **CONDITIONAL** | seasonal |
| P27 | Saint-Valentin | /saint-valentin/ | /en/valentines-day/ | /es/san-valentin/ | saint-valentin | — | seasonal (v0c) | seasonal |
| P28 | Pâques | /paques/ | /en/easter/ | /es/pascua/ | paques | — | seasonal (v0c) | seasonal |
| P29 | Temps des sucres | /temps-des-sucres/ | /en/maple-season/ | — | temps-des-sucres | — | seasonal (v0c), **CONDITIONAL** | seasonal |
| P30 | Fête des mères | /fete-des-meres/ | /en/mothers-day/ | /es/dia-de-la-madre/ | fete-des-meres | — | seasonal (v0c) | seasonal |
| P31 | Fête des pères | /fete-des-peres/ | /en/fathers-day/ | — | fete-des-peres | — | seasonal (v0c) | seasonal |
| P32 | **Seasons hub** | /saisons/ | /en/seasons/ | /es/temporadas/ | summer-holidays, fall-holidays | — | NEW: Fête nationale, Canada Day and Halloween become sections, not thin pages | v1 |
| P33 | **Picnic boxes** | /boites-pique-nique/ | /en/picnic-boxes/ | — | summer-holidays, visitors | — | NEW, **CONDITIONAL** | by May 2027 |
| P34 | Quinceañera | — | — | /es/quinceanera/ | latino | I10 | **CONDITIONAL** (plan: ES subset + quinceañera) | if offered |
| P35 | **Navidad latina (Velitas, Novena)** | — | — | /es/navidad/ | latino | — | NEW, **CONDITIONAL** on the 2026 social test | by Oct 2027 |
| P36 | **Glossary** | /journal/glossaire-patisserie/ | /en/journal/pastry-glossary/ | /es/blog/glosario-pasteleria/ | flavours-finishes, pièce montée | I6 | NEW, informational | v2 |
| P37 | **Vanilla brand pillar** | /journal/tout-sur-la-vanille/ | /en/journal/all-about-vanilla/ | — | brand-vanilla | — | optional (v0b idea) | v2+ |
| P38 | FAQ hub | /faq/ | /en/faq/ | /es/preguntas-frecuentes/ | overflow questions | — | v0c | v1 |

Rules carried from rank-first 06:
- One query, one page. Each sub-question becomes a section or a cluster page, never a near-duplicate.
- Every cluster links to the pillar and to two siblings, and gets 3 internal links on the day it is published.
- Use plan v1 slugs (for example `/gateaux-personnalises-granby/`). The earlier `/gateaux-personnalises/` and `/gateaux-de-fete/` in v0b/v0c are superseded.
- Overlap test (plan §6): if « gâteau de fête Granby » and « gâteau personnalisé Granby » share ≥ 6 of their top 10 results, birthday stays inside P02. Otherwise add `/gateaux-de-fete/`.

## 3. Vocabulary rules for copywriters

### 3.1 Term table (H1/title vs body)

| Concept | H1 / title (fr-CA) | Body synonym (≥ 1 natural use) | Avoid | EN | ES | Evidence | Status |
|---|---|---|---|---|---|---|---|
| Birthday cake | gâteau de fête | gâteau d'anniversaire (one H2 or paragraph, plus meta description) | — | birthday cake | H1 « Pasteles y tortas de cumpleaños »; body: ponqué, bizcocho (once each) | « anniversaire »: [Maxi](https://www.maxi.ca/fr/alimentation/boulangerie/g-teaux/g-teaux-d-anniversaire-et-de-c-l-bration/c/59507), [Le Marmiton](https://lemarmiton.ca/dessert-choco-vanille/). « de fête »: owner plan | the GSC split decides after 8 weeks |
| Custom cake | gâteau personnalisé | sur mesure | "design cake" in an FR H1 | custom cake | pastel / torta personalizada | « sur mesure »: [Cake Design](https://cakegranby.ca/products/gateau-sur-mesure); « personnalisés »: [IGA Gazaille](https://www.iga.net/fr/recherche_de_magasin/magasin/8212-marche-gazaille) | evidenced |
| Pain au chocolat | chocolatine | pain au chocolat (once, for France-French speakers and visitors) | — | chocolatine (chocolate croissant) | — | owner plan; UNVERIFIED this run | check OQLF BDL / Usito |
| Croissant | croissant; croissant aux amandes | — | — | croissant; almond croissant | cruasán? UNVERIFIED → keep "croissant" | almond croissants: [RestoMontreal](https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/) | evidenced product |
| Viennoiseries | H1 « Croissants, chocolatines et viennoiseries à Granby »; nav label « Viennoiseries » | viennoiseries | trade jargon as the only H1 word | viennoiseries / croissants | — | — | hypothesis |
| Pickup | cueillette (en boutique) | — | mixing « cueillette » and « ramassage » | pickup | recoger en tienda | owner plan vs 16b Studio | `[[FACT NEEDED]]` |
| Cupcakes | cupcakes | — | — | cupcakes | cupcakes | [Cake Design Cupcakerie](https://www.facebook.com/cakedesigncupcakerie/), [Le Marmiton](https://lemarmiton.ca/menuitems/cupcake-individuel-saveur-du-jour/) | evidenced (rivals) |
| Baby shower | shower de bébé | — | an OQLF alternative, until it is checked | baby shower | baby shower (UNVERIFIED) | [Rose Gâteaux](https://www.rosegateaux.com/shower-de-bebe.html) | evidenced (rival) |
| Tiered cake | gâteau à étages | — | « pièce montée » as a synonym (it may mean croquembouche) | tiered cake | UNVERIFIED | owner plan (prompt I4) | check GDT |
| Croquembouche | croquembouche | pièce montée (defined in the glossary) | — | croquembouche | — | — | UNVERIFIED |
| Mousse cake | gâteau mousse | entremets (once) | « entremets » alone in the H1 | mousse cake | — | — | hypothesis |
| Christmas log | bûche de Noël (accents in copy, ASCII URL) | bûche glacée only if sold | — | title carries both: "Bûche de Noël (Yule Log)" | tronco de Navidad (bûche de Noël) | owner plan | UNVERIFIED |
| Galette | galette des rois | fève, couronne | — | galette des rois (French king cake) | galette des rois, « parecida a la rosca de Reyes »: never call it rosca | owner plan v0b | UNVERIFIED |
| Québec desserts | tarte au sucre · sucre à la crème · pouding chômeur | — | translating the names in FR | keep the FR name + EN gloss | keep the FR name + ES gloss | — | UNVERIFIED |
| Catering | traiteur; prêt-à-manger | boîte à lunch (only if offered) | — | catering; ready-to-eat | comida preparada (UNVERIFIED) | [IGA traiteur](https://traiteur.iga.net/categories/102/product/631?lang=fr), [LVE 2022](https://www.lavoixdelest.ca/2022/10/23/un-marche-qui-mise-sur-le-bon-voisinage-cd5aafe8bfcdc08ab30265e590a93863/) | evidenced |
| Gift card | carte-cadeau | — | mixed spellings (hyphen or not: OQLF check) | gift card | tarjeta de regalo | [Les Crudélices](https://www.lescrudelices.ca/boutique/p/cartecadeau) | evidenced (rival) |
| Dietary | sans gluten · sans lactose · végane · sans noix · sans arachides | cross-contact sentence in plain words | "100 % sans allergènes" or "sans gluten" without proof | gluten-free · nut-free · peanut-free · vegan | sin gluten · sin lactosa · vegano · sin nueces · sin maní / cacahuate (regional, UNVERIFIED) | — | `[[FACT NEEDED: legal track — CFIA/Health Canada claim conditions]]` |
| Smash cake | smash cake | gloss: « gâteau à écraser du premier anniversaire » (descriptive, not an official term) | — | smash cake | smash cake | owner plan | UNVERIFIED |
| Size | 8 po + portions | — | sizes without portions | 8-inch | « 20 cm (8 pulgadas) » (8 in = 20.32 cm) | owner plan §13 | rule |
| Prices | « à partir de 45 $ »; 12,50 $ | — | « prix sur demande » | $12.50 | always add "CAD" (pesos in Colombia and Mexico also use "$"; common knowledge) | plan §13–14 | rule |
| Time | 14 h | — | 2pm in FR | 2 p.m. | 14:00 | plan §13 | rule |
| Holiday names | Saint-Valentin · Pâques · Action de grâce · temps des Fêtes | — | inconsistent capitals | — | — | `[[FACT NEEDED: OQLF BDL typography, e.g. « fête des Mères »]]` | check |

### 3.2 Writing rules

1. H1 = customer word + product + Granby: « Gâteaux de fête personnalisés à Granby ». The title puts the customer word first and the brand last, under 60 characters (plan §7).
2. The answer block (40–60 words) uses the H1 term once and one synonym once, in sentences. No keyword lists.
3. Navigation labels are category words (Gâteaux, Viennoiseries, Pains, Commander), not creative names (rank-first 06 §5).
4. URLs are ASCII French words, never with a year: `/buches-de-noel/`, not `/buches-2026/` (v0c Layer 3).
5. Register: standard written French with Québec vocabulary. Colloquial phrasing appears only in FAQ questions, such as « C'est-tu possible d'avoir un gâteau pour demain? » (plan §7), and the first sentence of the answer is standard French.
6. EN pages use Canadian spelling: flavour, colour, centre (v0b §A2). Keep FR product names (chocolatine, bûche, galette, tarte au sucre) and add a gloss.
7. ES pages: « pasteles y tortas » in H1s, and « Hablamos español » only if staff really speak it (v0b). `[[FACT NEEDED: tú vs usted preference]]`.
8. Kids' themes: say « thèmes ». No trademark pages (Pat' Patrouille, Bluey…) (v0c).
9. Brand: « Pâtisserie Coco Vanille » + « Granby » in every entity sentence. Keep « Cocovanille » for `alternateName` only (entity track).

## 4. Modifiers: where each one is won

| Modifier | Example | Won by | Own page? | Rule |
|---|---|---|---|---|
| près de moi / near me / cerca de mí | pâtisserie près de moi (L1) | GBP proximity, categories, reviews, photos; P06 | no | never write the phrase in copy; identical NAP + Bakery schema |
| ouvert dimanche / heures | pâtisserie ouverte dimanche Granby (L4) | GBP hours + P06 hours table in HTML | no | claim only if true; directories conflict ([find-open](https://find-open.ca/granby/p%C3%A2tisserie-cocovanille-1781027)); GBP special hours before each holiday |
| livraison / delivery | livraison gâteau Granby | P17 FAQ | only if delivery exists | if there is none, say so and point to pickup; city pages only with real delivery |
| prix / price | prix gâteau personnalisé Granby (I1) | P03 | yes | dated table, prices as text |
| avis / reviews | pâtisserie Granby avis (B1) | GBP; key-facts block on P01/P07 | no | review count + date; no self-serving review markup |
| pour demain / dernière minute | gâteau pour demain Granby (L3) | P13 | yes, if there is a real cut-off | first sentence answers yes/no + cut-off hour |
| en ligne / commander | commander un gâteau en ligne Granby (L2) | P17 | yes | label "Commande en ligne" is already used by a rival ([Avec un Grand A](https://www.avecungranda.com/commande-en-ligne)) |
| meilleur(e) / best | meilleure pâtisserie à Granby (C1) | listicles (TBR, RestoMontreal, Yelp, Tourisme Granby région) + P04 | P04 | listicle SERPs: get onto the lists (03 §4); an honest comparison |
| pas cher | gâteau de fête pas cher | P04 | section | supermarket floor $26.99 for 8–12 portions ([IGA](https://traiteur.iga.net/categories/102/product/631?lang=fr)) |
| près du Zoo | bakery near Granby Zoo (L8) | P16 + GBP | yes | distance and parking `[[FACT NEEDED]]` |

## 5. Question bank (seed, 88 questions: 50 FR · 22 EN · 16 ES)

Format = the answer shape that wins the surface (rank-first 08 §2): **P** = 40–60-word paragraph that starts with the answer; **L** = ordered or bulleted list; **T** = table (≤ 5 columns, with a caption). The answer goes under an H2/H3 that copies the question; the first two sentences stand alone.

| # | Question | Lang | Target | Fmt | Prompt | Needs |
|---|---|---|---|---|---|---|
| F01 | Combien coûte un gâteau de fête personnalisé à Granby? | fr | P03 /prix/ | T | I1 | price list |
| F02 | Combien de jours d'avance faut-il commander un gâteau personnalisé? | fr | P02 | P | I2 | lead time |
| F03 | Quelle grosseur de gâteau pour 20 personnes? | fr | P05 | T | I3 | portion grid |
| F04 | Combien de portions dans un gâteau de 8 pouces? | fr | P05 | T | — | portion grid |
| F05 | Comment transporter un gâteau à étages en auto? | fr | P15 | L | I4 | — |
| F06 | Combien coûte un gâteau de mariage par portion au Québec? | fr | P10 | T | I5 | weddings offered? |
| F07 | Quelle est la différence entre la crème au beurre et la ganache? | fr | P36 | T | I6 | — |
| F08 | Comment conserver un gâteau à la crème jusqu'au lendemain? | fr | P15 | L | I7 | food-safety source |
| F09 | C'est-tu possible d'avoir un gâteau pour demain? | fr | P13 | P | L3 | cut-off hour |
| F10 | Peut-on commander un gâteau en ligne à Granby? | fr | P17 | P | L2 | order path |
| F11 | Quelle est la meilleure pâtisserie à Granby? | fr | P04 | L | C1 | — |
| F12 | Où acheter une bûche de Noël à Granby? | fr | P11 | P | C4 | product |
| F13 | Quand faut-il commander sa bûche de Noël? | fr | P11 | P | — | cut-off date |
| F14 | Combien coûte une bûche de Noël artisanale? | fr | P11 | T | — | prices |
| F15 | Combien de personnes nourrit une bûche de Noël? | fr | P11 | T | — | sizes |
| F16 | Y a-t-il une pâtisserie sans gluten à Granby? | fr | P12 | P | C6 | product + claim rules |
| F17 | Un gâteau sans gluten peut-il être garanti sans contamination croisée? | fr | P12 | P | — | kitchen policy |
| F18 | Faites-vous des gâteaux sans noix et sans arachides? | fr | P12 | P | — | policy |
| F19 | Avez-vous des gâteaux véganes ou sans lactose? | fr | P12 | L | — | products |
| F20 | Où trouver des chocolatines fraîches à Granby? | fr | P18 | P | L6 | bake times |
| F21 | À quelle heure les croissants sont-ils prêts le matin? | fr | P18 | P | — | bake times |
| F22 | Peut-on commander une boîte de viennoiseries pour une réunion? | fr | P14 | P | L7 | offer |
| F23 | Combien de viennoiseries prévoir par personne pour un déjeuner de bureau? | fr | P14 | T | — | — |
| F24 | La pâtisserie est-elle ouverte le dimanche? | fr | P06 | T | L4 | hours |
| F25 | Quelles sont les heures d'ouverture de la Pâtisserie Coco Vanille? | fr | P06 | T | B2 | hours |
| F26 | Où se stationner près de la Pâtisserie Coco Vanille? | fr | P06 | L | — | parking |
| F27 | Y a-t-il un café et une pâtisserie près du Zoo de Granby? | fr | P16 | P | L5 | distance |
| F28 | Livrez-vous à Granby, Bromont ou Waterloo? | fr | P17 | T | — | delivery? |
| F29 | Qu'est-ce qu'un smash cake et à quel âge le faire? | fr | P09 | P | — | product |
| F30 | Quel gâteau choisir pour un anniversaire d'enfant? | fr | P08 | L | — | — |
| F31 | Peut-on avoir un gâteau avec un personnage de dessin animé? | fr | P08 | P | — | licensing policy |
| F32 | Qu'est-ce qu'une galette des rois et quand la manger? | fr | P26 | P | — | product |
| F33 | Que fait-on quand on trouve la fève dans la galette? | fr | P26 | P | — | — |
| F34 | Quoi offrir pour la Fête des mères à part des fleurs? | fr | P30 | L | — | products |
| F35 | Faites-vous des gâteaux en forme de cœur pour la Saint-Valentin? | fr | P27 | P | — | product |
| F36 | Quelle est la différence entre un gâteau mousse et un gâteau à étages? | fr | P36 | T | — | — |
| F37 | Qu'est-ce qu'une pièce montée (croquembouche)? | fr | P36 | P | — | — |
| F38 | Combien de temps à l'avance réserver un gâteau de mariage? | fr | P10 | P | — | weddings offered? |
| F39 | Offrez-vous une dégustation pour les gâteaux de mariage? | fr | P10 | P | — | weddings offered? |
| F40 | Épicerie, pâtisserie ou boulangère à domicile : quoi choisir pour un gâteau de fête? | fr | P04 | T | C2 | — |
| F41 | Une boulangère à domicile a-t-elle besoin d'un permis au Québec? | fr | P04 | P | — | MAPAQ rule (legal track) |
| F42 | Vendez-vous des cartes-cadeaux? | fr | P23 | P | — | offer |
| F43 | Faites-vous des boîtes-cadeaux pour les clients ou les employés? | fr | P23 | L | — | offer |
| F44 | Qu'est-ce qu'un Paris-Brest? | fr | P20 | P | — | evidenced item |
| F45 | Peut-on congeler du pain ou des baguettes? | fr | P19 | L | — | frozen-bread instructions |
| F46 | Faites-vous des tartes au sucre et du sucre à la crème pour les Fêtes? | fr | P25 | P | — | product |
| F47 | Qu'est-ce que le pouding chômeur? | fr | P25 | P | — | product |
| F48 | Quoi apporter à un party des Fêtes au bureau? | fr | P14 | L | — | offer |
| F49 | Que sait-on de la Pâtisserie Coco Vanille à Granby? | fr | P07 | P | B3 | key facts |
| F50 | La Pâtisserie Coco Vanille est-elle encore ouverte? | fr | P01/P06 | P | — | **operating status** (01 §0.2) |
| E01 | How much does a custom birthday cake cost in Quebec? | en | P03 | T | I8 | price list |
| E02 | How far in advance should I order a wedding cake? | en | P10 | P | I9 | weddings offered? |
| E03 | What is the best bakery in Granby, Quebec? | en | P04 | L | C8 | — |
| E04 | Is there a bakery near the Granby Zoo? | en | P16 | P | L8 | distance |
| E05 | Can I order a custom cake online in Granby? | en | P17 | P | L9 | order path |
| E06 | How many servings are in an 8-inch round cake? | en | P05 | T | — | portion grid |
| E07 | What size cake do I need for 30 guests? | en | P05 | T | — | portion grid |
| E08 | What is a bûche de Noël (yule log)? | en | P11 | P | — | — |
| E09 | When should I order a Christmas yule log in Granby? | en | P11 | P | — | cut-off date |
| E10 | Does Pâtisserie Coco Vanille have gluten-free or nut-free options? | en | P12 | L | — | products |
| E11 | What is a chocolatine? | en | P18 | P | — | — |
| E12 | What are Pâtisserie Coco Vanille's opening hours? | en | P06 | T | B2 | hours |
| E13 | Where can I park near Pâtisserie Coco Vanille in downtown Granby? | en | P06 | L | — | parking |
| E14 | How do I keep a buttercream cake fresh overnight? | en | P15 | L | — | food-safety source |
| E15 | How do I transport a tiered cake in a car? | en | P15 | L | — | — |
| E16 | Do you accept US or foreign credit cards? | en | P16 | P | — | payment facts |
| E17 | Can I pre-order pastries for pickup on the way to the Zoo? | en | P16 | L | — | order path |
| E18 | What is a smash cake? | en | P09 | P | — | product |
| E19 | Can you make a cake for tomorrow? | en | P13 | P | — | cut-off hour |
| E20 | What is Pâtisserie Coco Vanille in Granby known for? | en | P07 | P | B3 | key facts |
| E21 | Do you make office pastry boxes in Granby? | en | P14 | P | — | offer |
| E22 | Is a bakery cake better value than a supermarket cake? | en | P04 | T | — | — |
| S01 | ¿Cuánto cuesta una torta de quinceañera en Quebec? | es | P34 | T | I10 | offered? |
| S02 | ¿Cuál es la mejor pastelería en Granby? | es | P04 | L | C10 | — |
| S03 | ¿Dónde pedir una torta de cumpleaños personalizada en Granby? | es | P02 | P | L10 | — |
| S04 | ¿Con cuántos días de anticipación debo pedir un pastel personalizado? | es | P02 | P | — | lead time |
| S05 | ¿Qué tamaño de pastel necesito para 50 invitados? | es | P05 | T | — | portion grid |
| S06 | ¿Hacen torta de tres leches? | es | P21 | P | — | **owner decision** |
| S07 | ¿Puedo hacer mi pedido por WhatsApp? | es | P17 | P | — | WhatsApp number |
| S08 | ¿Hablan español en la pastelería? | es | P07 | P | — | staff languages |
| S09 | ¿Tienen pasteles sin gluten? | es | P12 | L | — | products |
| S10 | ¿Qué es una bûche de Noël (tronco de Navidad)? | es | P11 | P | — | — |
| S11 | ¿Dónde comprar postres para la Novena de Aguinaldos en Granby? | es | P35 | L | — | offer |
| S12 | ¿Qué es la galette des rois y en qué se parece a la rosca de Reyes? | es | P26 | P | — | — |
| S13 | ¿Cuál es el horario de la pastelería? | es | P06 | T | — | hours |
| S14 | ¿Cómo llego a la pastelería desde el Zoo de Granby? | es | P06 | L | — | directions |
| S15 | ¿Hacen tortas para bautizo y primera comunión? | es | P02 | P | — | offer |
| S16 | ¿Se puede pagar en efectivo o con tarjeta? | es | P17 | L | — | payment facts |

Example passages (show the pattern only; every bracketed item stays a marker until the owner confirms it):
- F09 (FR): « Oui, si vous commandez avant [[FACT NEEDED: heure limite]] : la Pâtisserie Coco Vanille, à Granby, prépare des gâteaux pour le lendemain en [[FACT NEEDED: formats]], à récupérer en boutique au 3, rue Court. »
- E04 (EN): "Pâtisserie Coco Vanille is a downtown Granby bakery at 3 rue Court, [[FACT NEEDED: km / minutes]] from the Granby Zoo, with croissants, pastries and coffee; pre-order online for pickup on your way."
- S03 (ES): «En Granby, la Pâtisserie Coco Vanille prepara pasteles y tortas de cumpleaños personalizados desde [[FACT NEEDED: precio]] CAD; pida con [[FACT NEEDED: días]] días de anticipación para recoger en la tienda.»

## 6. Seasonal content plan

### 6.1 Rules

1. **Evergreen URLs.** One page per occasion, refreshed every year. It is never deleted, noindexed or given a year in its slug (v0c Layer 3).
2. **First publication ≥ 8 weeks before the occasion.** Plan v1 §14 gives 6–8 weeks; use the 8-week end because the domain is new. This is a heuristic: Google publishes no indexing time, and indexing is never guaranteed (rank-first 08 §1). Where plan §14 gives an earlier date, the earlier date wins.
3. **Refresh 6 weeks before.** Add new dated facts (prices, flavours, order cut-off). Change the visible date and `dateModified` together. Then ping IndexNow and request indexing in Search Console (rank-first 17 §refresh).
4. **GBP 4 weeks before** (proposed): products with prices, one post, then special hours 3 weeks before. Spanish posts on Facebook/WhatsApp for the Latin dates.
5. **Off-season state:** the page stays indexable and switches to « Saison terminée — précommandes [année] dès le [date] ».
6. **Judge a drop against the same month last year,** never the month before (plan §14).

### 6.2 Calendar Nov 2026 – Dec 2027 (full rows in `data/seasonal-calendar.csv`)

| Occasion | Date | Page | First publish by | Refresh by | Pre-orders (proposed unless "plan") | Note |
|---|---|---|---|---|---|---|
| Noël 2026 | Thu 24 / Fri 25 Dec 2026 | P11 | 2026-11-01 (**GBP/social only**) | — | 2026-11-01 (plan) | site not live; optional holding-page URL |
| Velitas / Novena 2026 | Mon 7 Dec; 16–24 Dec 2026 | P35 | social only | — | 23 Nov / 1 Dec | test Spanish demand |
| Fête des Rois 2027 | Wed 6 Jan 2027 | P26 | 2026-12-01 (plan) | — | 2026-12-15 | if v1 misses the date, GBP only |
| Saint-Valentin | Sun 14 Feb 2027 | P27 | 2026-12-20 | 2027-01-03 | 2027-01-18 | Sunday: confirm hours |
| Wedding planning | Jan–Mar 2027 | P10 | 2027-01-04 (plan) | — | — | CONDITIONAL |
| Temps des sucres | ≈ Mar–Apr 2027 | P29 | 2027-02-01 (plan) | — | — | window UNVERIFIED |
| **Pâques** | **Sun 28 Mar 2027** (computed) | P28 | **2027-01-31** | 2027-02-14 | 2027-03-01 | early Easter; Good Fri 26 Mar, Easter Mon 29 Mar |
| Fête des mères | Sun 9 May 2027 | P30 | 2027-03-14 | 2027-03-28 | 2027-04-12 | MX Día de la Madre Mon 10 May |
| Zoo season / visitors | `[[FACT NEEDED]]` 2027 | P16 | 2027-05-01 (plan) | — | — | refresh every spring |
| Fête des pères | Sun 20 Jun 2027 | P31 | 2027-04-25 | 2027-05-09 | 2027-05-24 | — |
| Fête nationale / Fête du Canada | Thu 24 Jun / Thu 1 Jul 2027 | P32 (+P33) | 2027-04-29 | — | 2027-06-01 | statutory hours `[[FACT NEEDED]]` |
| Vacances de la construction | July 2027 `[[FACT NEEDED: CCQ]]` | P16/P33 | 2027-05-01 (plan) | — | — | — |
| FICG 2027 | Aug 2027 `[[FACT NEEDED]]` (2026: 13–23 Aug) | P16 section | 2027-07-01 | — | — | [festapp](https://festapp.io/festivals/festival-international-de-la-chanson-de-granby/2026) |
| Rentrée + corporate | late Aug–Sep 2027 | P14 | 2027-08-01 (plan) | — | — | school dates `[[FACT NEEDED]]` |
| Amor y Amistad | Sat 18 Sep 2027 | P01-ES section | 2027-07-24 | — | 2027-09-01 | rule from the owner plan |
| Action de grâce | Mon 11 Oct 2027 | P25 | 2027-08-16 | 2027-08-30 | 2027-09-20 | — |
| Halloween | Sun 31 Oct 2027 | P32 | 2027-09-05 | 2027-09-19 | 2027-10-04 | — |
| **Noël 2027** | Fri 24 / Sat 25 Dec 2027 | P11 | exists | **2027-10-01 (plan)** | **2027-11-01 (plan)** | first holiday season the site can compete for |
| Party des Fêtes 2027 | Nov–Dec 2027 | P14/P23 | 2027-09-15 | — | 2027-10-15 | — |
| Velitas / Novena 2027 | Tue 7 Dec; 16–24 Dec 2027 | P35 | 2027-10-12 | 2027-10-26 | 2027-11-23 | CONDITIONAL on 2026 test |

## 7. Date computations (JavaScript)

Run with `node dates.mjs`. Every computed date in `seasonal-calendar.csv` comes from this code.

```js
// dates.mjs: Gregorian Easter (Meeus/Jones/Butcher) + nth weekday of a month (UTC)
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(y, month - 1, day));
}
export function nthWeekday(y, month, dow, n) { // dow: 0 = Sunday … 6 = Saturday
  const d = new Date(Date.UTC(y, month - 1, 1));
  let count = 0;
  for (;;) { if (d.getUTCDay() === dow && ++count === n) return d; d.setUTCDate(d.getUTCDate() + 1); }
}
export const minusWeeks = (d, w) => new Date(d.getTime() - w * 7 * 86400000);
const iso = (d) => d.toISOString().slice(0, 10);
console.log(iso(easter(2027)));               // 2027-03-28
console.log(iso(nthWeekday(2027, 5, 0, 2)));  // 2027-05-09 Fête des mères (2nd Sunday of May)
console.log(iso(nthWeekday(2027, 6, 0, 3)));  // 2027-06-20 Fête des pères (3rd Sunday of June)
console.log(iso(nthWeekday(2027, 10, 1, 2))); // 2027-10-11 Action de grâce (2nd Monday of October)
console.log(iso(nthWeekday(2027, 9, 6, 3)));  // 2027-09-18 Amor y Amistad (3rd Saturday of September)
console.log(iso(minusWeeks(easter(2027), 8))); // 2027-01-31 Pâques page publish-by
```

The rules behind the computed dates (2nd Sunday of May, 3rd Sunday of June, 2nd Monday of October, 3rd Saturday of September, the Monday before 25 May, the 1st Monday of September) come from the task brief or the owner plans, or are marked UNVERIFIED in the CSV. Confirm them against CNESST (statutory holidays) and a Colombian calendar source before publishing.

## 8. Verification queue (run when the search budget allows)

| # | Query / check | Resolves |
|---|---|---|
| V1 | OQLF Banque de dépannage linguistique + Usito: « chocolatine », « gâteau de fête », « cupcake », « shower de bébé », « cueillette / ramassage », « carte-cadeau », holiday-name capitals | §3 statuses |
| V2 | Reddit r/Quebec and r/montreal threads on « chocolatine » vs « pain au chocolat » and « gâteau de fête » | real usage |
| V3 | Google Trends, region Québec, 5 years: bûche de Noël, galette des rois, gâteau de fête vs gâteau d'anniversaire, chocolatine vs pain au chocolat, smash cake | seasonality + term split |
| V4 | Keyword Planner (Canada / Québec, FR + EN): ranges for the 8 high and 55 medium rows | replaces the priors |
| V5 | PAA + autocomplete harvest from a Granby location (SerpApi or a phone), 3 levels deep, for C1, C2, C4, L1–L3, I1–I3 | replaces the §5 seed wording |
| V6 | Zoo de Granby 2027 season dates; FICG 2027 dates; Marché public 2027 season; Ville de Granby event calendar | calendar placeholders |
| V7 | CNESST 2027 statutory holidays; CCQ vacances de la construction 2027; Granby school calendar 2027–28 | calendar placeholders |
| V8 | Health Canada / CFIA conditions for « sans gluten » and allergen-free claims; MAPAQ home-baker permit rules | P12, P04 (legal track) |
| V9 | RAE/ASALE (DLE, Diccionario de americanismos): torta, ponqué, pastel, bizcocho by country; Colombian dates (Velitas, Novena, Amor y Amistad 2027) | §3 ES rules, ES calendar rows |
| V10 | Eid al-Fitr 2027 date + any local demand signal (only if the owner wants it) | optional calendar row |

## Sources

Seen 2026-10-25. Because of the exhausted search budget, every URL below was surfaced by tracks 01/03/05 (US-run WebSearch summaries) and recorded in `research/01-business-facts.md`, `research/03-competitors.md` or `research/05-serp-baseline.md`. This track did not reopen them.

Client and entity
- Pâtisserie Cocovanille Granby (RestoMontreal, EN) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/ — seen 2026-10-25
- Pâtisserie Cocovanille opening hours (find-open) — https://find-open.ca/granby/p%C3%A2tisserie-cocovanille-1781027 — seen 2026-10-25
- Pâtisserie Coco Vanille inc. · 3 rue Court (opengovca) — https://opengovca.com/quebec-business/1177082220 — seen 2026-10-25
- Pâtisserie Coco Vanille (Tripadvisor .ca) — https://www.tripadvisor.ca/Restaurant_Review-g182165-d27188801-Reviews-Patisserie_Coco_Vanille-Granby_Quebec.html — seen 2026-10-25
- Pâtisserie Cocovanille (Wanderlog) — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-25
- Un marché qui mise sur le bon voisinage (La Voix de l'Est, 2022-10-23) — https://www.lavoixdelest.ca/2022/10/23/un-marche-qui-mise-sur-le-bon-voisinage-cd5aafe8bfcdc08ab30265e590a93863/ — seen 2026-10-25
- Exposants – Marché public de Granby — https://marchepublicgranby.ca/exposants/ — seen 2026-10-25
- Coco Vanille Eau De Parfum by Mancera (Alshaya) — https://alshayaperfumes.com/en/products/mancera-coco-vanille-edp-120-ml — seen 2026-10-25
- Boulangerie/Pâtisserie Coco Vanille, Bras-Panon (Facebook) — https://www.facebook.com/CocoVanille97412/ — seen 2026-10-25
- Pâtisserie Coco – Quartier chinois (Tastet) — https://tastet.ca/critiques/patisserie-coco-quartier-chinois/ — seen 2026-10-25
- Où trouver les meilleurs gâteaux d'anniversaire à Montréal (Tastet; surfaced by track 05) — https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/ — seen 2026-10-25

Listicles and aggregators
- 3 Best Bakeries in Granby, QC (Three Best Rated) — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-25
- 3 Meilleures Boulangeries à Granby (Three Best Rated) — https://threebestrated.ca/fr-boulangeries-in-granby-qc — seen 2026-10-25
- 3 Best Cakes in Granby, QC (Three Best Rated) — https://threebestrated.ca/cakes-in-granby-qc — seen 2026-10-25
- 3 Meilleurs Pâtisseries à Granby (Three Best Rated) — https://threebestrated.ca/fr-gâteaux-in-granby-qc — seen 2026-10-25
- Best Bakeries in Granby (RestoMontreal) — https://www.restomontreal.ca/restaurants/bakeries-granby/en/?c=338&d=103 — seen 2026-10-25
- Meilleurs Pâtisseries de Granby (RestoMontreal) — https://www.restomontreal.ca/restaurants/patisseries-granby/fr/?c=332&d=103 — seen 2026-10-25
- Best Pastries in Granby (RestoMontreal) — https://www.restomontreal.ca/restaurants/pastries-granby/en/?c=332&d=103 — seen 2026-10-25
- Les 10 meilleurs desserts et pâtisseries Granby (RestoMontreal) — https://www.restomontreal.ca/restaurants/les-meilleurs-desserts-et-sucreries-patisseries-granby/fr/?c=299,332&d=103&sort=best — seen 2026-10-25
- The 10 Best Eastern Townships Bakeries 2026 (RestoMontreal) — https://www.restomontreal.ca/restaurants/the-best-bakeries-eastern-townships/en/?c=338&d=eastern+townships&sort=best — seen 2026-10-25
- Yelp – Bakeries Granby — https://www.yelp.com/search?cflt=bakeries&find_loc=Granby%2C+QC — seen 2026-10-25
- Yelp – Custom Cakes Granby — https://www.yelp.com/search?find_desc=Custom+Cakes&find_loc=Granby%2C+QC — seen 2026-10-25
- Yelp – Caterers Granby — https://www.yelp.com/search?cflt=catering&find_loc=Granby,+QC — seen 2026-10-25
- Uber Eats – Bakery delivery Granby — https://www.ubereats.com/ca/category/granby-qc/bakery — seen 2026-10-25
- Uber Eats – Desserts Granby — https://www.ubereats.com/ca/category/granby-qc/dessert — seen 2026-10-25
- Uber Eats – Apple pie Granby — https://www.ubereats.com/ca/dish/granby-qc/apple-pie — seen 2026-10-25
- WeddingWire – Wedding cakes Sherbrooke — https://www.weddingwire.ca/wedding-cakes/quebec/sherbrooke — seen 2026-10-25
- Granby région – Gâteaux Duvoquic — https://granbyregion.com/quoi_faire/gateaux-duvoquic/ — seen 2026-10-25

Competitors and retailers (vocabulary evidence)
- Cake Design Granby – Gâteaux sur mesure — https://cakegranby.ca/products/gateau-sur-mesure — seen 2026-10-25
- Cake Design – saveurs et tarifs — https://www.cakegranby.com/saveurs_tarifs.php — seen 2026-10-25
- Cake Design Granby – Gâteaux thématiques — https://cakegranby.ca/collections/gateau-perso-thematique — seen 2026-10-25
- Facebook – Cake Design Cupcakerie — https://www.facebook.com/cakedesigncupcakerie/ — seen 2026-10-25
- Avec un Grand A – Commande en ligne — https://www.avecungranda.com/commande-en-ligne — seen 2026-10-25
- Avec un Grand A – Gâteau Boston — https://www.avecungranda.com/product/gateau-boston-cream-pie/ — seen 2026-10-25
- Rose Gâteaux – home — https://rosegateaux.com/ — seen 2026-10-25
- Rose Gâteaux – shower de bébé — https://www.rosegateaux.com/shower-de-bebe.html — seen 2026-10-25
- Le Marmiton – gâteau d'anniversaire ou d'événement personnalisé — https://lemarmiton.ca/dessert-choco-vanille/ — seen 2026-10-25
- Le Marmiton – Cupcake individuel — https://lemarmiton.ca/menuitems/cupcake-individuel-saveur-du-jour/ — seen 2026-10-25
- Les Crudélices – Menu — https://www.lescrudelices.ca/menu — seen 2026-10-25
- Les Crudélices – Carte cadeau — https://www.lescrudelices.ca/boutique/p/cartecadeau — seen 2026-10-25
- Délices sucrés Granby (Canva site) — https://delicessucresgranby.my.canva.site/ — seen 2026-10-25
- Maître Glacier Granby – Gâteaux — https://granby.maitreglacier.com/categorie-produit/gateaux-2/ — seen 2026-10-25
- Narcity – Maître Glacier Cadbury desserts — https://www.narcity.com/fr/montreal/cette-chaine-de-cremerie-au-quebec-fait-des-desserts-aux-oeufs-cadbury — seen 2026-10-25
- IGA – Marché Gazaille — https://www.iga.net/fr/recherche_de_magasin/magasin/8212-marche-gazaille — seen 2026-10-25
- Service traiteur IGA – Gâteau Le Rêve — https://traiteur.iga.net/categories/102/product/631?lang=fr — seen 2026-10-25
- Maxi – Gâteaux d'anniversaire et de célébration — https://www.maxi.ca/fr/alimentation/boulangerie/g-teaux/g-teaux-d-anniversaire-et-de-c-l-bration/c/59507 — seen 2026-10-25
- Walmart.ca – Birthday & Celebration Cakes — https://www.walmart.ca/en/browse/grocery/bread-bakery/cakes-cupcakes/birthday-celebration-cake/10019_6000194327359_6000198840549_6000204016986 — seen 2026-10-25
- PagesJaunes – Tim Hortons Granby — https://www.pagesjaunes.ca/bus/Quebec/Granby/Tim-Hortons/101552414.html — seen 2026-10-25
- La boulangerie Pain Pain ferme ses portes (La Voix de l'Est, 2026-06-16) — https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/ — seen 2026-10-25
- Futur Costco: le chantier va bon train (Le Nouvelliste, 2026-10-02) — https://www.lenouvelliste.ca/affaires/2026/10/02/futur-costco-le-chantier-de-construction-va-bon-train-a-saint-alphonse-de-granby-D4EBZTIGJ5A4HN2OF6BTYAAK5M/ — seen 2026-10-25

Granby market and calendar
- Gazette officielle du Québec, 24 déc. 2025, no 52 (décret de population 2026) — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2025F/86980.pdf — seen 2026-10-25
- Recensement 2021, Granby (SDR), langues (StatCan) — https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?topic=6&dguid=2021A00052447017&lang=F — seen 2026-10-25
- Recensement 2011, AR de Granby (StatCan) — https://www12.statcan.gc.ca/census-recensement/2011/as-sa/fogs-spg/Facts-cma-fra.cfm?LANG=Fra&GK=CMA&GC=450 — seen 2026-10-25
- Plus de 3500 immigrants adoptent Granby (Granby Express) — https://www.granbyexpress.com/actualites/plus-de-3500-immigrants-adoptent-granby/ — seen 2026-10-25
- De réfugiés colombiens à entrepreneurs granbyens (Le Devoir) — https://www.ledevoir.com/actualites/societe/763253/immigration-de-refugies-colombiens-a-entrepreneurs-granbyiens — seen 2026-10-25
- Centre-ville de Granby: phase 2 des travaux (Granby Express) — https://www.granbyexpress.com/actualites/centre-ville-de-granby-la-phase-2-des-travaux-de-revitalisation-est-lancee/ — seen 2026-10-25
- Une saison estivale couronnée de succès au Zoo de Granby — https://www.zoodegranby.com/salle-de-presse/une-saison-estivale-couronnee-de-succes-au-zoo-de-granby — seen 2026-10-25
- Montreal to Granby Zoo (travelprofy) — https://www.travelprofy.com/montreal/granby-zoo — seen 2026-10-25
- FICG 2026 (festapp) — https://festapp.io/festivals/festival-international-de-la-chanson-de-granby/2026 — seen 2026-10-25

Internal (not web sources): `research/plan-v1-ranking-stack.md`, `plan-v0b-multilingual-local-domination.md`, `plan-v0c-site-ux-ordering.md`, `01-business-facts.md`, `03-competitors.md`, `05-serp-baseline.md`, `16b-admin-tech-subdomain.md`; rank-first `references/04-research-prompts.md`, `06-architecture.md`, `08-aeo-geo.md`, `15-sources.md`, `17-advanced-playbook.md`.
