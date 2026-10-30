# 22d · Local content: the Zoo page, Moroccan specialities, the local question bank and local schema (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Step: on-site local content (local SEO, AEO, GEO), ready to implement, under Yahya's mandate of 2026-10-29 (« take all decisions based on what I give and web research, and make the full thing ready »). This step edits nothing in `apps/`: a later step applies it.
Twin: [docs/briefs/zoo-de-granby.md](../docs/briefs/zoo-de-granby.md), the page brief in Québec French (docs/08 format).
Validator: `C:/Users/yahya/AppData/Local/Temp/claude/c--Users-yahya-Desktop-coco-vanille-granby/02cd2703-b751-4c08-b190-a46fdfcb8285/scratchpad/local-check/`. In that folder, `entry.mjs` holds the copy below, `check.mjs` the checks and `quotes.json` the quotes of §3. Its output is pasted in §1.7.

How this was made, and its limits:
- **Built on 20a–20e, 21, docs/03, 05, 06, 19 and research/04, 06, 11.** A fact those files verified is cited, not searched again. Two sources were re-read on purpose:
  - the Zoo's « Horaire et directions » page, because the page links to it
  - the City's July 2026 transit brochure, to read the summer move of the Zoo stop that 20c's data twin mentions only in a note (`data/research-place.json`, zoo.bus)
- **New in this step:**
  - Google's spam policies (doorway section, English and French pages)
  - Google's LocalBusiness, Organization, structured-data policy and review-snippet pages
  - schema.org: FoodEstablishment, inLanguage, Zoo
  - the Zoo's FAQ and rules (French) and its English schedule and FAQ pages
  - the City's transit page
  - two sources each for what a msemmen and a harcha are
  - a second routing engine for three walks
- **Volume:** 4 WebSearch queries (standard mode, US-located), 18 WebFetch reads and 8 direct lookups. All are logged in §7.
- **The seed changed during this step.** Another workflow was editing `apps/web/src/seed/content.js`; the 20c parking and Zoo facts landed at about 15:38 UTC.
  - Every quote of existing copy in §3 is checked word for word by the validator, against the state of 16:06 UTC (SHA-256 `8ddaa985f9b0bebb…`, 1,336 lines).
  - If the file changes again, re-run `node check.mjs` before applying anything.
- **Labels** (as in 20c):
  - **verified** = an official source (the City, the Zoo), an owner source (the shop's posts), two independent sources, or two routing engines that agree on a bound
  - **unverified** = one non-official source, one engine, or an inference
- **Not done:**
  - no SERP or « Autres questions posées » harvest from Granby (still research/05 §9 and research/04 V5)
  - no call to the Zoo, the City or the shop
  - no Semrush (no API units)

---

## 0. Bottom line

1. **The Zoo page: yes, one page.**
   - Paths: `/nous-trouver/zoo-de-granby/` and `/en/visit/granby-zoo/`.
   - Registry: status `core`, template `content`, child of `nous-trouver`.
   - Its copy holds no [[FACT NEEDED]], so it goes live with the site. It needs no owner fact.
   - It passes the four tests drawn from Google's own doorway examples (§1.1):
     - one page, not a set of city or landmark variants
     - it answers on the page instead of funnelling
     - it shares no question and no 8-word sentence with `/nous-trouver/`
     - it sits in the breadcrumb under Nous trouver
   - It fills a gap the 2026-10-29 relevé measured:
     - the L5 answer found no source giving the distance
     - the L8 answer named no Québec bakery (research/05)
   - It replaces the planned `/en-visite-a-granby/` of research/04 P16 and docs/17 §6. Both conditions set for that page now hold: the distance (20c Z-8) and the café offer (20b S-14 to S-16).
2. **Moroccan specialities: an FAQ only, on `/carte/`, plus one item in the home page's « Que vend… » list.** No page and no section, for three reasons:
   - The shop lists msemmens and harchas in one post (2026-08-25), and that is the only verified fact.
   - Days, prices, descriptions and photos are unknown.
   - A page or a section would be thin.

   The FAQ becomes a section with a dated table once the owner answers (§2).
3. **The local question bank has 25 French questions and their 25 English twins (§3).**
   - **8** are fully answered today by copy already in the seed, quoted word for word.
   - **11** get a new or completed sentence, with its source, validated.
   - **10** keep a gap only the owner can fill. Several questions are partly answered and partly open, so the three groups overlap.

   Three pages had English-only or French-only visitor questions (docs/17 §3.4). They are realigned without going over the 8-FAQ limit.
4. **Structured data (§4):**
   - **Add, true and visible on the page:**
     - `legalName`
     - a `contactPoint` for the workshop line
     - `menu`
     - `servesCuisine`, only where the words show
     - on the Zoo page, a `mentions` node for the Zoo
   - **Fix:** remove `inLanguage` from the Bakery node. It is not a Bakery property in schema.org.
   - **Never add:** ratings, `priceRange`, `paymentAccepted`, `acceptsReservations`, `areaServed`, `amenityFeature` (for now), or anything the page does not show.
5. **The validator passes 57 of 57 checks** on the live seed plus every change proposed here: 41 page-locale contracts, the registry, the cross-page rules, the near-duplicate guard and 45 quotes (§1.7).
6. **Side findings (§6):**
   - The seed's « stationnement Johnson … à environ 150 m » matches neither engine. Both give 120 m to the lot's listed address; one gives about 210 m to the middle of the lot.
   - In summer the Zoo stop is moved to rue Dorion, direction centre-ville. The page says so.
   - Google's spam-policy page is dated 2026-08-28 in English and 2026/08/31 in French.

---

## 1. A page for Zoo de Granby visitors

### 1.1 The decision: is one such page genuinely useful?

**Google's rule** (Search Central, « Spam policies for Google web search », doorway section; page last updated 2026-08-28, read 2026-10-29):

> "Doorway abuse is when sites or pages are created to rank for specific, similar search queries. They lead users to intermediate pages that aren't as useful as the final destination."

Google's four examples are as follows. The French page, last updated 2026/08/31, says the same: « L'utilisation abusive des pages satellites se produit lorsque des pages ou des sites sont créés pour bien se classer pour des requêtes de recherche spécifiques similaires. »
- "Having multiple websites with slight variations to the URL and home page to maximize their reach for any specific query"
- "Having multiple domain names or pages targeted at specific regions or cities that funnel users to one page"
- "Generating pages to funnel visitors into the actual usable or relevant portion of a site"
- "Creating substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy"

**The test, one row per example:**

| Google's example | This page | Evidence |
|---|---|---|
| Many sites or URL variants for one query | One URL per language, on the shop's only site | Registry line §1.2 |
| Pages for regions or cities that funnel to one page | One page about one real place, 3 to 4 km away, with content no other page has. No other landmark or town page will be made (Bromont, Waterloo, lac Boivin, Marché public…): they stay sentences on `/nous-trouver/`. docs/17 §6 already abandons town pages without a shop or delivery | §1.4: 25 facts, 12 of them found on no other page of the site |
| Pages that funnel visitors to the usable part of the site | The page is the usable part for a Zoo visitor: the drive, the bus, parking, the Zoo's own rules on bringing lunch and on leaving and coming back, the shop's days, what to buy to go. Its action is « Itinéraire », not a link elsewhere | 5 sections and 6 FAQ answered on the page (§1.3) |
| Substantially similar pages, closer to search results than a browseable hierarchy | A child of Nous trouver in the registry and the breadcrumb (Accueil › Nous trouver › …). The hub keeps its short Zoo answer (the distance and the Zoo’s address) and points to the page | Validator: no question string shared with any other page, no sentence of 8 words or more copied from `/nous-trouver/` (§1.7) |

**Why it is useful, not only allowed:**
- **The measured gap.** In the 2026-10-29 relevé (proxy run from the US, research/05 W44):
  - The L5 answer (« café et pâtisserie près du Zoo de Granby », 15/20) named two cafés and said « aucun résultat ne confirme leur distance exacte du zoo ». It also gave the Zoo's address as 525, rue Saint-Hubert, which is the Zoo's postal address (20c Z-2).
  - The L8 answer (« bakery near Granby Zoo », 16/20) named no Québec bakery: 9 of its 12 links were US Granby pages.
  - The page answers those two prompts with verified figures and the Zoo's visitor address.
- **A Zoo day raises questions the visit page does not answer:**
  - the Zoo lets visitors bring their own lunch, but no glass containers
  - visitors can leave and come back with a hand stamp
  - the bus stop moves in summer
  - the weekday limits of the Centre-Court 4-hour spaces do not apply on weekends
  - the shop is closed Monday and Tuesday and open Sunday

  These answers come from the Zoo's FAQ and rules, the City's plans and brochure, and the shop's posts: all verified.
- **The decisions it follows:**
  - research/00 §5.1 kept a visitor page "only when the distance and a visitor offer exist"
  - docs/19 kept it « seulement avec une vraie offre »

  Both conditions now hold: the distance (20c Z-8) and the shop's own offer to stay or to go (20b S-10, S-12, S-14 to S-16). The page invents no Zoo package (research/14 P16 stays open).

**Guardrails** (proposed decision: « Décision de l'Agence du 29 octobre 2026 (mandat de Yahya), modifiable par la propriétaire »):
1. One visitor page only. No second page for another landmark or town, and no « près de » in any other title.
2. The business name never changes: no « Zoo » and no « Granby » in the Google listing name (house rule).
3. The page is refreshed before **2027-05-01**, the date research/04 §6.2 sets for the visitor page (« Zoo season / visitors », refreshed every spring). The refresh covers:
   - the Zoo's FAQ and rules
   - the City's transit brochure
   - the two draft by-laws of 2026-10-19 (20c P-15, P-16)
   - one more run of the routes, done once a year (20c §9, item 8)

   If the Zoo drops the lunch or hand-stamp rule, that section goes.
4. The Zoo's hours, prices and logo are never copied. The page links to the Zoo's « Horaire et directions » page.

**Verdict: build it.** The page is useful to a person on a Zoo day before it is useful to a search engine. That is the test Google's policy applies.

### 1.2 Registry, labels and action

**Registry line** for `apps/web/src/lib/routes.js`, right after the `nous-trouver` line:

```js
  { key: 'zoo-de-granby', template: 'content', status: 'core', parent: 'nous-trouver', paths: { fr: '/nous-trouver/zoo-de-granby/', en: '/en/visit/granby-zoo/' } },
```

How this line follows docs/17 §7:
- lower case, French words without accents in the French path, hyphens, no year
- a trailing slash
- French at the root, English under `/en/`
- no « cueillette »
- nested under its parent, like `/a-propos/chef/`

Spanish: no path. The volet is off; the question S14 waits for it.

How the code handles the line:
- `resolvePath` matches registry paths before products, and `isKnownPublicPath` matches them exactly, so the two-segment path is never read as a product.
- `routes.test.js` and `content.test.js` loop over `PAGES`, so no test needs an edit.

**Labels**, in `apps/web/src/lib/i18n.js` › `pageNames`. They feed the « À consulter aussi » block of `/nous-trouver/` (Related.js shows the page automatically as a child) and the breadcrumb:
- fr: `'zoo-de-granby': 'Depuis le Zoo de Granby'`
- en: `'zoo-de-granby': 'From the Granby Zoo'`

**Action** (optional, a one-line change):
- The `content` template gives every page the primary action « Commander ». For this page, « Itinéraire » (the Google Maps link from the CID) and « Appeler » fit the visitor better (docs/08 §1: one main action per page type).
- In `apps/web/src/components/templates/index.js`:

```js
  content: (p) => <ContentTemplate {...p} primary={p.page?.key === 'chef' ? null : p.page?.key === 'zoo-de-granby' ? mapsAction(p.business, p.locale) : orderAction(p.locale, p.served)} secondary={p.page?.key === 'zoo-de-granby' ? phoneAction(p.business, p.locale) : undefined} />,
```

`mapsAction` and `phoneAction` are already imported in that file.

### 1.3 The seed entry (paste into `apps/web/src/seed/content.js`, then add `zooDeGranby` to `pages` after `nousTrouver`)

The entry uses only constants content.js already defines: `OPEN_*`, `CLOSED_*`, `SUNDAY_*` and `UPDATED_1029`. The French copy goes through `withTypography` like every other page.

```js
// ---------- Visitors of the Zoo de Granby (one page, child of Nous trouver; research/22d §1) ----------
// Facts: the drive range two routing engines agree on (20c Z-8); the bus (City brochure, July 2026, 20c Z-9, re-read
// 2026-10-29: the Zoo stop moves to rue Dorion in summer, direction centre-ville); the walks (OSRM foot and Valhalla,
// 20c P-7, Z-10 and 22d); the parking plans in force since 2026-06-12 (20c P-1, P-4, P-5, P-10); the Zoo's own FAQ,
// rules and « Horaire et directions » page (read 2026-10-29); the shop's posts of 2026-08-25, 09-05 and 09-20 (20b).
const zooDeGranby = {
  key: 'zoo-de-granby',
  status: 'core',
  locales: {
    fr: {
      title: 'Café et pâtisserie près du Zoo de Granby · Coco Vanille',
      description: 'À environ 5 à 8 minutes en auto du Zoo de Granby, la Pâtisserie Coco Vanille sert café, viennoiseries et salé au 3, rue Court. Trajet, autobus, stationnement.',
      h1: 'Café et pâtisserie près du Zoo de Granby',
      answer:
        `La Pâtisserie Coco Vanille est au 3, rue Court, au centre-ville de Granby, à environ 5 à 8 minutes en auto du Zoo de Granby. On y sert café, viennoiseries et salé, sur place ou à emporter. Elle est ouverte ${SUNDAY_FR} et fermée ${CLOSED_FR}.`,
      sections: [
        s('Combien de temps faut-il pour aller du Zoo de Granby à la boutique?', 'Il faut environ 5 à 8 minutes en auto pour aller du Zoo de Granby à la Pâtisserie Coco Vanille, soit 3 à 4 km selon le trajet, sans compter la circulation.', {
          body: 'Le calcul part du stationnement principal du Zoo, dont l’adresse pour les visiteurs est le 1050, boulevard David-Bouchard Nord, et va jusqu’au 3, rue Court. Selon votre GPS, le trajet passe par la rue Saint-Hubert et la rue Principale, ou par le boulevard David-Bouchard Nord et la rue Dufferin.\n\nMéthode : deux calculateurs d’itinéraire, OSRM et Valhalla, sur les données d’OpenStreetMap, le 29 octobre 2026. Les durées ne comptent ni la circulation, ni les feux, ni le temps pour se stationner.',
        }),
        s('Peut-on aller du Zoo à la boutique en autobus?', 'Oui : le circuit Nord du transport urbain de Granby, direction centre-ville, relie l’arrêt Saint-Hubert/Zoo au Terminus Centre-ville, rue du Centre, à environ 300 m à pied de la boutique. Horaires, tarifs et carte : granby.ca/fr/transport-urbain-granby.', {
          list: [
            'Prendre le circuit Nord, direction centre-ville, à l’arrêt Saint-Hubert/Zoo, déplacé sur la rue Dorion l’été',
            'Descendre au Terminus Centre-ville, rue du Centre',
            'Marcher environ 300 m par la rue du Centre, la rue Principale, puis la rue Court',
          ],
        }),
        s('Où se stationner au centre-ville en arrivant du Zoo?', 'Le stationnement municipal est gratuit au centre-ville de Granby, et le plus proche, le stationnement Centre-Court, est à environ 100 m de la boutique, entre les rues Court et du Centre.', {
          body: 'Ses cases de 4 h sont limitées du lundi au vendredi, de 8 h à 18 h; le samedi et le dimanche, ces cases n’ont pas de limite de temps, et certaines rangées n’en ont jamais. Le stationnement Johnson, au 18, rue Johnson, de l’autre côté de la rue Principale, a lui aussi des rangées sans limite de temps. Suivez toujours les panneaux; ces règles sont celles des plans de la Ville en vigueur depuis le 12 juin 2026.',
        }),
        s('Peut-on apporter au Zoo un lunch acheté à la boutique?', 'Oui : selon sa foire aux questions, le Zoo de Granby permet d’apporter son lunch, et plusieurs aires de pique-nique sont aménagées sur le site.', {
          body: 'Les règlements du Zoo interdisent toutefois les contenants de verre et les boissons alcoolisées apportées de l’extérieur (foire aux questions et règlements lus le 29 octobre 2026).\n\nLa Pâtisserie Coco Vanille vend, sur place ou à emporter, des viennoiseries, des pâtisseries, des sandwichs et du salé, comme des feuilletés, des mini pizzas et des pastillas au poulet, selon ses publications d’août et de septembre 2026.',
        }),
        s('Peut-on sortir du Zoo pour un café et revenir le même jour?', 'Oui : selon sa foire aux questions, le Zoo de Granby permet de sortir et de revenir pendant la journée en faisant étamper sa main à la sortie, même s’il encourage à limiter les entrées et sorties.', {
          body: 'Au 3, rue Court, la boutique sert le café, l’espresso, le latte et le chocolat chaud, et des boissons froides comme le café glacé et le matcha, sur place ou à emporter (liste publiée par la boutique en 2026).',
        }),
      ],
      faq: [
        q('C’est-tu ouvert le lundi?', `Non : la Pâtisserie Coco Vanille est fermée ${CLOSED_FR}. Elle est ouverte ${OPEN_FR}; les jours fériés et les fermetures exceptionnelles sont dans le tableau des heures de la page Nous trouver.`),
        q('Peut-on s’asseoir pour prendre un café?', 'Oui : dans sa publication d’août 2026, la boutique se présente comme un endroit où l’on peut s’installer pour prendre un café; le café et le salé se vendent aussi à emporter.'),
        q('La Pâtisserie Coco Vanille est-elle sur le site du Zoo?', 'Non : la Pâtisserie Coco Vanille est au centre-ville de Granby, au 3, rue Court, à environ 3 à 4 km du Zoo par la route. Le Zoo a ses propres points de restauration sur le site, selon sa foire aux questions.'),
        q('Offrez-vous des ateliers créatifs?', 'Oui : la Pâtisserie Coco Vanille offre des ateliers créatifs du vendredi au dimanche, sur réservation au 438-528-7818. Un atelier de peinture, ou de décoration de perles et de strass sur un objet de votre choix, dure 2 h 30 et coûte 37 $ par personne, avec le matériel, une boisson et une part de gâteau. Les places sont limitées.'),
        q('Quelle adresse entrer dans le GPS pour le Zoo de Granby?', 'Pour s’y rendre, le Zoo de Granby donne l’adresse du 1050, boulevard David-Bouchard Nord, à Granby (J2H 0Y6), sur sa page Horaire et directions, où se trouve aussi son horaire : zoodegranby.com/horaire. Pour la boutique, entrez le 3, rue Court, à Granby (J2G 4Y6).'),
        q('Peut-on commander à l’avance pour passer en allant au Zoo?', 'Oui, pour les produits qui ont des plages de cueillette ce jour-là : commandez sur la page Commander ou par téléphone au 450-372-7177, puis passez au 3, rue Court pendant votre plage.'),
      ],
      changeNote: 'Première version : trajet depuis le Zoo calculé le 29 octobre 2026; règles du Zoo et plans de stationnement de la Ville lus le même jour.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Bakery and café near the Granby Zoo, Québec · Coco Vanille',
      description: 'About 5 to 8 minutes by car from the Granby Zoo, Pâtisserie Coco Vanille serves coffee, viennoiseries and savoury food at 3 rue Court. Route, bus and parking.',
      h1: 'Bakery and café near the Granby Zoo',
      answer:
        `Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec, about 5 to 8 minutes by car from the Granby Zoo. You can have coffee, viennoiseries and savoury snacks there, to stay or to go. The shop is open ${SUNDAY_EN} and closed ${CLOSED_EN}.`,
      sections: [
        s('How long does it take to get from the Granby Zoo to the shop?', 'It takes about 5 to 8 minutes by car to get from the Granby Zoo to Pâtisserie Coco Vanille, or 3 to 4 km depending on the route, not counting traffic.', {
          body: 'The calculation runs from the Zoo’s main parking lot, whose visitor address is 1050 boulevard David-Bouchard Nord, to 3 rue Court. Depending on your GPS, the route takes rue Saint-Hubert and rue Principale, or boulevard David-Bouchard Nord and rue Dufferin.\n\nMethod: two route planners, OSRM and Valhalla, on OpenStreetMap data, on October 29, 2026. The times count neither traffic, nor traffic lights, nor the time to park.',
        }),
        s('Can I take the bus from the Zoo to the shop?', 'Yes: the Circuit Nord of Granby’s city buses, towards downtown, links the Saint-Hubert/Zoo stop to the Terminus Centre-ville on rue du Centre, about 300 m on foot from the shop. Schedules, fares and map: granby.ca/fr/transport-urbain-granby.', {
          list: [
            'Take the Circuit Nord towards downtown at the Saint-Hubert/Zoo stop, moved to rue Dorion in summer',
            'Get off at the Terminus Centre-ville, rue du Centre',
            'Walk about 300 m along rue du Centre, rue Principale, then rue Court',
          ],
        }),
        s('Where can I park downtown when coming from the Zoo?', 'Municipal parking is free in downtown Granby, and the closest lot, Centre-Court, is about 100 m from the shop, between rue Court and rue du Centre.', {
          body: 'Its 4-hour spaces are limited Monday to Friday, from 8 a.m. to 6 p.m.; on Saturday and Sunday these spaces have no time limit, and some rows never do. The Johnson lot, at 18 rue Johnson, across rue Principale, also has rows with no time limit. Always follow the signs; these rules are those of the City’s plans in force since June 12, 2026.',
        }),
        s('Can I bring a lunch from the shop into the Zoo?', 'Yes: according to its FAQ, the Granby Zoo lets visitors enjoy their own lunch on site, and several picnic areas are set up.', {
          body: 'The Zoo’s rules, however, ban glass containers and alcoholic drinks brought from outside (FAQ and rules read on October 29, 2026).\n\nPâtisserie Coco Vanille sells viennoiseries, pastries, sandwiches and savoury snacks such as puff pastries, mini pizzas and chicken pastillas, to stay or to go, according to its posts of August and September 2026.',
        }),
        s('Can I leave the Zoo for a coffee and come back the same day?', 'Yes: according to its FAQ, the Granby Zoo lets you leave and come back during the day if you have your hand stamped at the gate, although it encourages visitors to limit their comings and goings.', {
          body: 'At 3 rue Court, the shop serves coffee, espresso, latte and hot chocolate, and cold drinks such as iced coffee and matcha, to stay or to go (list published by the shop in 2026).',
        }),
      ],
      faq: [
        q('Are you open on Monday?', `No: Pâtisserie Coco Vanille is closed ${CLOSED_EN}. It is open ${OPEN_EN}; statutory holidays and exceptional closures are in the hours table on the Visit page.`),
        q('Can I sit down for a coffee?', 'Yes: in its post of August 2026, the shop presents itself as a place where you can sit down for a coffee; coffee and savoury food are also sold to go.'),
        q('Is Pâtisserie Coco Vanille inside the Zoo?', 'No: Pâtisserie Coco Vanille is in downtown Granby, at 3 rue Court, about 3 to 4 km from the Zoo by road. The Zoo has its own food outlets on site, according to its FAQ.'),
        q('Do you offer creative workshops?', 'Yes: Pâtisserie Coco Vanille offers creative workshops Friday to Sunday, by reservation at 438-528-7818. A workshop of painting, or of decorating an item of your choice with beads and rhinestones, lasts 2.5 hours and costs $37 per person, with the materials, one drink and one slice of cake. Places are limited.'),
        q('What address should I enter in my GPS for the Granby Zoo?', 'For directions, the Granby Zoo gives 1050 boulevard David-Bouchard Nord, Granby (J2H 0Y6), on its Schedule and directions page, which also has its hours: zoodegranby.com/en/schedule. For the shop, enter 3 rue Court, Granby (J2G 4Y6).'),
        q('Can I pre-order pastries for pickup on the way to the Zoo?', 'Yes, when the products have pickup slots that day: order on the Order page or by phone at 450-372-7177, then pick up at 3 rue Court during your slot.'),
      ],
      changeNote: 'First version: the drive from the Zoo was calculated on October 29, 2026; the Zoo’s rules and the City’s parking plans were read the same day.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}
```

### 1.4 Every fact on the page, with its label

| # | Fact (as written) | Label | Source (seen 2026-10-29 unless noted) |
|---|---|---|---|
| Z1 | 3, rue Court, au centre-ville de Granby; J2G 4Y6 | verified (official) | Registraire des entreprises (20a §0.1); OSM (20c G-5) |
| Z2 | « environ 5 à 8 minutes en auto », « 3 à 4 km selon le trajet », « sans compter la circulation » | verified (two engines agree on the bound) | 20c Z-5, Z-7, Z-8 (OSRM demo 13:06 UTC, Valhalla 13:14 UTC) |
| Z3 | The route goes by rue Saint-Hubert and rue Principale, or by boulevard David-Bouchard Nord and rue Dufferin | each route comes from one engine. The page says it depends on the GPS, which is the reason for the range | 20c Z-5 (OSRM), Z-7 (Valhalla) |
| Z4 | The calculation starts at the Zoo's « stationnement principal »; visitor address 1050, boulevard David-Bouchard Nord, J2H 0Y6 | verified (official) | zoodegranby.com/horaire (address); zoodegranby.com/faq (« stationnement principal »); 20c Z-1, Z-4 |
| Z5 | Method: OSRM and Valhalla on OpenStreetMap data; no traffic, no lights, no time to park | verified (our own method) | 20c §0 « Routing ». OSM data © OpenStreetMap contributors, ODbL: the method line also gives the attribution |
| Z6 | The Circuit Nord, direction centre-ville, links the « Saint-Hubert/Zoo » stop to the Terminus Centre-ville, rue du Centre | verified (official) | Ville de Granby transit brochure, July 2026 (re-read 15:37 UTC; same file as 20c, SHA-256 `b70e4b43592b20af…`); 20c Z-9 |
| Z7 | In summer the stop is moved to rue Dorion (direction centre-ville) | verified (official) | Same brochure: « 27 (NCV) Saint-Hubert/Zoo (déplacé sur Dorion l'été) ». Direction Galeries: « déplacé sur Bégin l'été » |
| Z8 | About 300 m on foot from the terminus to the shop, by rue du Centre, rue Principale, then rue Court | verified (two engines) | OSRM foot ≈ 290 m (20c Z-10); Valhalla pedestrian 301 m, 203 s, same streets (§7, lookup 2) |
| Z9 | « Horaires, tarifs et carte : granby.ca/fr/transport-urbain-granby » | verified (official page) | granby.ca/fr/transport-urbain-granby (circuits Sud, Nord, Centre, Est; links the July 2026 brochure) |
| Z10 | Municipal parking is free downtown | verified (official by-law; the agency's reading) | Codification 1885-1990, art. 56, annexes E and F (20c P-1, P-2) |
| Z11 | Centre-Court is the closest lot, between rue Court and rue du Centre, « environ 100 m » | the lot: verified (official). The distance: computed. In a straight line it is 75–105 m (20c P-7); on foot, two engines give 117–118 m (§7, lookup 3). « environ 100 m » matches the seed's existing wording | Annexes F-A and BB; 20c P-3, P-7 |
| Z12 | Its 4-hour spaces are limited Monday to Friday, 8 h–18 h | verified (official) | Annex BB « Autorisé 4 h (8h-18h, Lun à Ven) » (20c P-4) |
| Z13 | On Saturday and Sunday those spaces have no time limit; some rows never have one | verified (reading of the plan labels; the signs prevail) | 20c P-5; annex BB rows « Autorisé » (« Illimité ») |
| Z14 | Johnson lot, 18, rue Johnson, across rue Principale, with rows that have no time limit | the lot and its rules: verified (official). « Across rue Principale »: verified (both walking engines go rue Court › rue Principale › rue Johnson) | Annex AA (20c P-10); §7, lookups 6 and 7 |
| Z15 | « plans de la Ville en vigueur depuis le 12 juin 2026 » | verified (official) | By-law 1479-2026 (20c §0, P-4) |
| Z16 | The Zoo lets visitors bring their own lunch; several picnic areas | verified (official) | zoodegranby.com/faq: « Peut-on apporter notre lunch sur le site? — Bien sûr. Plusieurs aires de pique-nique sont aménagées… »; EN FAQ: "Of course you can! We have several different picnic areas on the site." |
| Z17 | No glass containers and no alcoholic drinks brought from outside | verified (official) | zoodegranby.com/reglements (« D'apporter des contenants de verre », « D'apporter des boissons alcoolisées »); FAQ (« nous ne permettons pas que vous apportiez vos propres boissons alcoolisées ») |
| Z18 | Visitors may leave and come back during the day with a hand stamp at the exit; the Zoo encourages limiting entries and exits | verified (official) | zoodegranby.com/faq; EN FAQ: "it's possible to do so by having your hand stamped at the gate" |
| Z19 | The Zoo has its own food outlets on site | verified (official) | zoodegranby.com/faq (« plusieurs points de restauration sont disponibles sur le site ») |
| Z20 | Coffee, espresso, latte, hot chocolate; iced coffee, matcha; to stay or to go | verified (owner) | Pinned post 2026-08-25 (20b S-14 to S-16) |
| Z21 | A place where one can sit down for a coffee | verified (owner; paraphrased, as the seed does) | Pinned post 2026-08-25 (20b S-16). The number of seats stays unknown and is not mentioned |
| Z22 | Viennoiseries, pâtisseries, sandwiches, feuilletés, mini pizzas, chicken pastillas, to stay or to go | verified (owner; dated « publications d'août et de septembre 2026 » because items rotate) | Posts 2026-08-25, 2026-09-05, 2026-09-20 (20b S-1, S-10, S-12) |
| Z23 | Open on Sunday 9 h 30–17 h; Wednesday to Saturday 8 h 30–17 h 30; closed Monday and Tuesday | verified (the Google listing relayed on 2026-10-27; `HOURS` in the seed) | research/21; data/facts.json `hours.google_listing` (owner sign-off welcome, 14 H1) |
| Z24 | Workshops Friday to Sunday, booked at 438-528-7818; painting, or decoration with beads and rhinestones; 2 h 30; 37 $ per person with materials, a drink and a slice of cake; limited places | verified (owner) | Reel 2026-10-22 (20b S-17 to S-19); research/21 A7 |
| Z25 | Pre-order « pour les produits qui ont des plages de cueillette ce jour-là », online or at 450-372-7177 | the site's own ordering rule (core copy of `/commander/`). Online ordering opens 11–24 January 2027 (21 B5); before that, the phone part holds | content.js `commander` (« Puis-je commander par téléphone? »; the EN Zoo FAQ) |

Facts found on no other page of the site, even after the changes of §1.5: Z3, Z4 (« stationnement principal »), Z5, Z6, Z7, Z8, Z9, Z13, Z16, Z17, Z18, Z19. That makes 12 of 25.

### 1.5 Changes to other pages (links and FR/EN parity)

The copy to add or swap, from the same validated file. This block is a spec, not code to paste as is: each value goes where the table below says, and uses constants content.js already has (`s`, `q`, `fn`, `ZOO_*`, `PARKING_EN`, `DELIVERY_EN`).

```js
// 3. Changes to existing pages (raw: the French ones go through frTypo like the rest of content.js).
// The link sentences name the page « Depuis le Zoo de Granby » / "From the Granby Zoo" (i18n pageNames, below).
const PAGE_NAMES = { fr: 'Depuis le Zoo de Granby', en: 'From the Granby Zoo' }
const CHANGES = {
  // home › « Où se trouve la Pâtisserie Coco Vanille à Granby? »: one sentence appended (link 2).
  homeWhereSentence: {
    fr: 'En visite au Zoo de Granby? La page Depuis le Zoo de Granby donne le trajet, l’autobus et le stationnement.',
    en: 'Visiting the Granby Zoo? The From the Granby Zoo page gives the route, the bus and parking.',
  },
  // home › « Que vend la Pâtisserie Coco Vanille? »: one list item (the shop's own list, pinned post 2026-08-25).
  homeListItem: { fr: 'Spécialités marocaines, dont les msemmens et les harchas', en: 'Moroccan specialties, including msemmen and harcha' },
  // nous-trouver › Zoo section: the facts step's text stays; the pointer sentence is appended (link 1).
  nousTrouverZooSentence: {
    fr: 'La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch.',
    en: 'The From the Granby Zoo page gives the bus route, parking and the Zoo’s rules for bringing lunch.',
  },
  // nous-trouver › FAQ « Y a-t-il des places assises? »: seating exists (pinned post), the count stays a marker.
  nousTrouverSeating: {
    fr: `Oui : la boutique se décrit comme un endroit chaleureux où l’on peut s’installer pour prendre un café. Nombre de places : ${fn('nombre de places assises')}.`,
    en: `Yes: the shop describes itself as a warm place where you can sit down for a coffee. Number of seats: ${fn('number of seats')}.`,
  },
  // nous-trouver › FAQ parity (docs/17 §3.4): each language gets the other's visitor question.
  nousTrouverFrUsd: q('Acceptez-vous les dollars américains?', `Les modes de paiement acceptés au comptoir restent à confirmer : ${fn('devises et modes de paiement acceptés au comptoir')}.`),
  nousTrouverEnDelivery: q('Do you deliver to Bromont or Waterloo?', `Online orders are picked up at 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
  // faq › one new section in both languages (link 3), and the EN-only FAQ becomes the twin of the FR parking FAQ.
  faqSection: {
    fr: s('Y a-t-il une pâtisserie près du Zoo de Granby?', `Oui : la Pâtisserie Coco Vanille est au centre-ville de Granby, au 3, rue Court, à ${ZOO_FR}. La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch.`),
    en: s('Is there a bakery near the Granby Zoo?', `Yes: Pâtisserie Coco Vanille, a pastry shop and bakery at 3 rue Court in downtown Granby, is ${ZOO_EN}. The From the Granby Zoo page gives the bus route, parking and the Zoo’s rules for bringing lunch.`),
  },
  faqEnParking: q('Where can I park near Pâtisserie Coco Vanille?', `${PARKING_EN} The Visit page gives the time limits and a second lot, about 150 m away.`),
  // commander › EN parity: the Zoo pre-order question moves to the Zoo page (both languages); EN gets the FR payment twin.
  commanderEnPayment: q('How do I pay for my online order?', 'Online payment is by card, on the payment processor’s secure page: your card number never reaches the shop’s servers. The exact amount is written on the payment button.'),
  // carte › FAQ « Avez-vous des spécialités marocaines? » (research/22d §2).
  carteMoroccan: {
    fr: q('Avez-vous des spécialités marocaines?', `Oui : la Pâtisserie Coco Vanille, à Granby, annonce des spécialités marocaines, dont des msemmens et des harchas, dans la liste de son offre publiée en août 2026. Le msemmen est une crêpe marocaine feuilletée; la harcha, une galette de semoule cuite à la poêle. Jours et prix : ${fn('jours où les msemmens et les harchas sont offerts, et leurs prix')}.`),
    en: q('Do you have Moroccan specialties?', `Yes: Pâtisserie Coco Vanille in Granby lists Moroccan specialties, including msemmen and harcha, in the list of its offer published in August 2026. Msemmen is a flaky Moroccan crêpe; harcha is a semolina flatbread cooked in a pan. Days and prices: ${fn('days msemmen and harcha are offered, and their prices')}.`),
  },
  // gateaux › « Quels gâteaux la Pâtisserie Coco Vanille prépare-t-elle? »: the shop's own words become the first
  // sentence (pinned post 2026-08-25, 20b S-8); the existing review-sourced sentence and its marker follow unchanged.
  gateauxFirstSentence: {
    fr: 'La Pâtisserie Coco Vanille, à Granby, prépare des gâteaux personnalisés sur commande pour les anniversaires et les occasions spéciales, selon la liste de son offre publiée en août 2026.',
    en: 'Pâtisserie Coco Vanille in Granby makes custom cakes to order for birthdays and special occasions, according to the list of its offer published in August 2026.',
  },
  // patisseries › FAQ on savoury food (20b S-10, S-12), with the picnic pointer (link 4).
  patisseriesSavoury: {
    fr: q('Avez-vous du salé pour le dîner?', 'Oui : la Pâtisserie Coco Vanille, à Granby, annonce du salé, sur place ou à emporter : des feuilletés, des mini pizzas, des pastillas au poulet et des sandwichs, selon ses publications de septembre 2026. Pour un pique-nique au Zoo de Granby, la page Depuis le Zoo de Granby donne le trajet et les règles du Zoo.'),
    en: q('Do you have savoury food for lunch?', 'Yes: Pâtisserie Coco Vanille in Granby offers savoury food to stay or to go: puff pastries, mini pizzas, chicken pastillas and sandwiches, according to its posts of September 2026. For a picnic at the Granby Zoo, the From the Granby Zoo page gives the route and the Zoo’s rules.'),
  },
}
```

Where each piece goes:

| Page | Change | Why |
|---|---|---|
| `/` and `/en/` | Section « Où se trouve la Pâtisserie Coco Vanille à Granby? »: one sentence appended (`homeWhereSentence`). Section « Que vend… »: one list item (`homeListItem`) | Link 2. Moroccan specialities in the shop's own list (§2) |
| `/nous-trouver/` and `/en/visit/` | Zoo section: pointer sentence appended (`nousTrouverZooSentence`). « Y a-t-il des places assises? »: a yes, from the shop's post, with the count kept as a marker (`nousTrouverSeating`). FAQ parity: French gets « Acceptez-vous les dollars américains? » and English gets "Do you deliver to Bromont or Waterloo?" | Link 1. Seating is verified, only the count is missing. docs/17 §3.4 (7 FAQ in each language afterwards) |
| `/faq/` and `/en/faq/` | New section « Y a-t-il une pâtisserie près du Zoo de Granby? » / "Is there a bakery near the Granby Zoo?" (`faqSection`). The English-only FAQ of the same name is replaced by the twin of the French parking FAQ (`faqEnParking`) | Link 3. Parity within the 8-FAQ limit (6 sections and 8 FAQ in each language) |
| `/en/order/` | The English-only "Can I pre-order pastries for pickup on the way to the Zoo?" moves to the Zoo page in both languages. Its place goes to the twin of « Comment payer ma commande en ligne? » (`commanderEnPayment`) | Parity: the French list already holds 8 FAQ, so the French twin could not be added there |
| `/carte/` and `/en/menu/` | FAQ « Avez-vous des spécialités marocaines? » (`carteMoroccan`) | §2 (7 FAQ in each language) |
| `/patisseries/` and `/en/pastries/` | FAQ « Avez-vous du salé pour le dîner? », ending with the picnic pointer (`patisseriesSavoury`) | Link 4. 20b S-10, S-12 |
| `/gateaux/` and `/en/cakes/` | Section « Quels gâteaux… »: the shop's own words come first (`gateauxFirstSentence`); the review-sourced sentence and its marker stay | Question 18 of §3. 20b S-8 |

### 1.6 Links to and from the page

**Inbound** (4 pages per language, plus the automatic « À consulter aussi » on `/nous-trouver/`):

| Page | Sentence (French, then English) | Anchor | Target |
|---|---|---|---|
| `/nous-trouver/` · `/en/visit/` (section on the Zoo) | « La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch. » · "The From the Granby Zoo page gives the bus route, parking and the Zoo’s rules for bringing lunch." | « Depuis le Zoo de Granby » · "From the Granby Zoo" | `/nous-trouver/zoo-de-granby/` · `/en/visit/granby-zoo/` |
| `/` · `/en/` (section « Où se trouve… ») | « En visite au Zoo de Granby? La page Depuis le Zoo de Granby donne le trajet, l’autobus et le stationnement. » · "Visiting the Granby Zoo? The From the Granby Zoo page gives the route, the bus and parking." | same | same |
| `/faq/` · `/en/faq/` (new section) | « … La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch. » · "… The From the Granby Zoo page gives the bus route, parking and the Zoo’s rules for bringing lunch." | same | same |
| `/patisseries/` · `/en/pastries/` (new FAQ) | « Pour un pique-nique au Zoo de Granby, la page Depuis le Zoo de Granby donne le trajet et les règles du Zoo. » · "For a picnic at the Granby Zoo, the From the Granby Zoo page gives the route and the Zoo’s rules." | same | same |

**How the links render:**
- Seed text renders as plain text today. Links inside the text are planned after the redesign (docs/17 §4.3).
- Until they ship, the page gets one inbound link (the « À consulter aussi » block of `/nous-trouver/`). `tools/links.mjs` will then warn « 1 inbound internal link(s) (min 3) ». It is a warning, not a failure.
- The fix:
  - **Preferred:** render « la page X » / "the X page" as a link wherever X is a page name from `i18n.pageNames`. That one change also turns the existing « la page Commander », « la page Nous trouver »… into links.
  - **Fallback:** add `'zoo-de-granby'` to the footer `EXPLORE` list.

**Outbound**, from the page:

| Target | How the page reaches it |
|---|---|
| `/nous-trouver/` (parent) | the breadcrumb and « le tableau des heures de la page Nous trouver » |
| `/commander/` | « la page Commander » |
| `/viennoiseries/`, `/patisseries/` | the words in the lunch section |
| `/faq/` | « ateliers créatifs »; an `/ateliers/` page would take over that link if it is ever built (docs/17 §6) |

The words that point to `/viennoiseries/`, `/patisseries/` and `/faq/` become anchors once links inside the text exist.

### 1.7 Validator output (`node check.mjs`, pasted as printed)

It applies the checks of `apps/web/test/unit/content.test.js` (title ≤ 60, description 140–160, answer 40–60 words naming « Coco Vanille » and « Granby » with a VERIFIED fact, 3–6 question sections whose first sentence is ≤ 45 words, 5–8 FAQ, no repeated question, changeNote, banned words, French typography, no code value or doubled period, the registry rules) to the live seed plus every change above. It adds six checks of its own:
- no marker on the Zoo page
- English never more complete than French
- the same counts in both languages on every changed page
- no question shared with another page
- no sentence of 8 words or more copied from `/nous-trouver/`
- the 45 quotes of §3 found word for word

The real `content.test.js` also passes on the live seed (57 of 57, `node --test`, 16:07 UTC; read-only).

```text
content.js sha256 8ddaa985f9b0bebb · 1336 lines · checked 2026-10-29T16:06:36.678Z
PASS  registry: every page key exists once, same status
PASS  registry: French first, copy only where a URL exists
PASS  registry: core pages with an English URL have English copy
PASS  registry: new line has a known template/status, absolute unique paths, existing parent
PASS  registry: live proxy rule does not yet know the paths (expected until the line is added)
PASS  contract: home (fr) [changed]
PASS  contract: home (en) [changed]
PASS  contract: carte (fr) [changed]
PASS  contract: carte (en) [changed]
PASS  contract: commander (fr) [changed]
PASS  contract: commander (en) [changed]
PASS  contract: nous-trouver (fr) [changed]
PASS  contract: nous-trouver (en) [changed]
PASS  contract: faq (fr) [changed]
PASS  contract: faq (en) [changed]
PASS  contract: gateaux (fr) [changed]
PASS  contract: gateaux (en) [changed]
PASS  contract: patisseries (fr) [changed]
PASS  contract: patisseries (en) [changed]
PASS  contract: zoo-de-granby (fr) [changed]
PASS  contract: zoo-de-granby (en) [changed]
PASS  across: titles and descriptions are unique
PASS  across: no banned words (weddings, superlatives, price on request, ramassage, WhatsApp)
PASS  across: French typography (no plain space before « : » or inside guillemets)
PASS  across: no code value, no doubled period
PASS  across: the Granby phrasing question is still on the cake and order pages
PASS  zoo: no [[FACT NEEDED]] marker in either language (publishable under strict)
PASS  zoo: English never more complete than French (same sections, list items and FAQ; EN words ≤ FR words)
PASS  parity on the changed pages: same number of sections and FAQ in FR and EN
PASS  zoo: no question string repeated from another page
PASS  zoo: no sentence of 8+ words copied verbatim from /nous-trouver/ (near-duplicate guard)
PASS  question bank: 45 quotes of existing copy found verbatim in the live seed

57/57 checks pass · 41 page-locale contracts (41 pass) · 22 pages

Zoo page (fr): title 55 chars · description 158 chars · answer 56 words · 5 sections · 6 FAQ
  first sentence 32 words · Combien de temps faut-il pour aller du Zoo de Granby à la boutique?
  first sentence 29 words · Peut-on aller du Zoo à la boutique en autobus?
  first sentence 31 words · Où se stationner au centre-ville en arrivant du Zoo?
  first sentence 24 words · Peut-on apporter au Zoo un lunch acheté à la boutique?
  first sentence 36 words · Peut-on sortir du Zoo pour un café et revenir le même jour?

Zoo page (en): title 58 chars · description 158 chars · answer 53 words · 5 sections · 6 FAQ
  first sentence 31 words · How long does it take to get from the Granby Zoo to the shop?
  first sentence 30 words · Can I take the bus from the Zoo to the shop?
  first sentence 26 words · Where can I park downtown when coming from the Zoo?
  first sentence 23 words · Can I bring a lunch from the shop into the Zoo?
  first sentence 36 words · Can I leave the Zoo for a coffee and come back the same day?

Changed pages, answer words fr/en: home 58/54 · nous-trouver 58/51 · faq 46/46 · commander 46/43 · carte 53/54 · patisseries 46/44 · gateaux 50/45
FAQ counts fr/en after the changes: zoo-de-granby 6/6 · home 7/7 · nous-trouver 7/7 · faq 8/8 · commander 8/8 · carte 7/7 · patisseries 6/6 · gateaux 6/6
Sections fr/en after the changes: zoo-de-granby 5/5 · home 4/4 · nous-trouver 5/5 · faq 6/6 · commander 5/5 · carte 4/4 · patisseries 4/4 · gateaux 4/4
```

---

## 2. Moroccan specialities: an FAQ only

**What is known:**
- **Verified (owner):** the pinned post « Bienvenue chez Coco Vanille » of 2026-08-25 lists « Spécialités marocaines : msemmens, harchas et autres gourmandises » (20b S-13).
- **Not known:**
  - which days they are made
  - prices and portions
  - fillings (sweet, savoury)
  - whether they are sold every week
  - a photo
- **Other shops:** a search for msemmen and harcha in Granby surfaced no other seller (§7, query 3). This is an absence of evidence, so the site does not claim to be the only one.

**Options:**

| Option | Verdict | Reason |
|---|---|---|
| A page (`/specialites-marocaines/`) | **no** | One verified sentence and five unknowns would make a thin page. A page created for a term the shop cannot yet describe is the « substantially similar / intermediate » pattern of §1.1. No search demand has been measured either: no row in `data/keywords.csv` |
| A section on `/carte/` | **not yet** | A section is an h2 whose answer must be proven underneath (docs/08 §1). Today it would hold one sentence and two markers |
| **An FAQ on `/carte/`, plus one item in the home page's « Que vend… » list** | **yes** | It answers the exact question (« Avez-vous des spécialités marocaines? ») that customers and AI engines ask, names « msemmen » and « harcha » with « Granby » for retrieval, and keeps the unknowns as one marker |

**The copy (validated in §1.7; `carteMoroccan` and `homeListItem` in §1.5):**
- **French FAQ** on `/carte/`:
  - Q: « Avez-vous des spécialités marocaines? »
  - A: « Oui : la Pâtisserie Coco Vanille, à Granby, annonce des spécialités marocaines, dont des msemmens et des harchas, dans la liste de son offre publiée en août 2026. Le msemmen est une crêpe marocaine feuilletée; la harcha, une galette de semoule cuite à la poêle. Jours et prix : [[FACT NEEDED: jours où les msemmens et les harchas sont offerts, et leurs prix]]. »
- **English FAQ** on `/en/menu/`:
  - Q: "Do you have Moroccan specialties?"
  - A: "Yes: Pâtisserie Coco Vanille in Granby lists Moroccan specialties, including msemmen and harcha, in the list of its offer published in August 2026. Msemmen is a flaky Moroccan crêpe; harcha is a semolina flatbread cooked in a pan. Days and prices: [[FACT NEEDED: days msemmen and harcha are offered, and their prices]]."
- **Home list item:**
  - French: « Spécialités marocaines, dont les msemmens et les harchas »
  - English: "Moroccan specialties, including msemmen and harcha"

**Where the two definitions come from.** Both are general, not the shop's recipe.

| Term | Definition used | Sources | Label |
|---|---|---|---|
| Msemmen | a layered (flaky) Moroccan crêpe | **Wiktionnaire via lalanguefrancaise.com:** « Crêpe marocaine fine, confectionnée à base de farine et de semoule ». **Tasting Table (Claire Redden, 2023-08-14):** "a Moroccan-style crepe, only it's richer and flakier", dough "folded like a puff pastry, flattened, and pan-fried to create delicate layers" | verified (two independent sources) |
| Harcha | a semolina flatbread (galette) cooked in a pan | **bladi.net:** « Harcha ou galettes de semoules », filed under « Recette Marocaine », cooked « sur poêle sèche ». **voyages.ideoz.fr:** « Recette marocaine de harchas, galettes de semoule » (title, search result) | verified (two independent sources) |

**Spelling.** The shop's French plural is kept (« msemmens », « harchas »). In English the plural is "msemmen". The sentence of the definition is the only place the words are defined, and nothing is stuffed.

**Rules:**
- No « authentique », « fait maison » or « halal » (20b S-22 and N-17: halal is never inferred).
- No allergen sentence: semolina and flour are wheat, so the allergens page's verified-list rule applies.

**What upgrades it:** the owner's answer to « Quels jours, quels prix, sucrés ou salés? ». Then:
1. The FAQ becomes a section on `/carte/`, « Quelles spécialités marocaines trouve-t-on chez Coco Vanille? », with a dated table (product · days · price before taxes · sweet or savoury).
2. The items go on the Google listing as products, only with the owner's prices.
3. A page is reconsidered only if Search Console shows impressions for « msemmen » or « harcha » near Granby.

The owner question: add it to research/14 (product range P1/P2). The agency owns that file; this step does not edit it.

---

## 3. The local question bank (25 questions)

Status:
- **exists** = the answer sentence is already in `apps/web/src/seed/content.js`, quoted word for word. The validator checked all 45 quotes against the seed state of 16:06 UTC.
- **new** = a sentence to add. The copy is in §1.3 and §1.5, validated.
- **owner** = a gap only the owner can fill. The marker stays.

Pages: `/` home, `/nous-trouver/` visit, `/carte/` menu, `/faq/`, `/commander/` order, `/gateaux/` cakes, `/patisseries/` pastries, `/nous-trouver/zoo-de-granby/` Zoo page.

### 3.1 French

| # | Question | Page | Status | Answer sentence | Source |
|---|---|---|---|---|---|
| 1 | Êtes-vous ouverts le dimanche? | `/nous-trouver/` (FAQ) | exists | « Oui : la boutique est ouverte le dimanche de 9 h 30 à 17 h. Les dimanches fériés et les fermetures exceptionnelles sont signalés dans le tableau des heures de cette page. » | Hours record (Google listing, relayed 2026-10-27) |
| 2 | C’est-tu ouvert le lundi? | `/nous-trouver/` (section); Zoo page (FAQ) | exists + new | « La Pâtisserie Coco Vanille est ouverte du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h 30 à 17 h; elle est fermée le lundi et le mardi. » New on the Zoo page: « Non : la Pâtisserie Coco Vanille est fermée le lundi et le mardi. … » | same |
| 3 | Quelles sont les heures d’ouverture? Est-ce ouvert aujourd’hui? | `/` (FAQ) | exists | « La boutique est ouverte du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h 30 à 17 h; elle est fermée le lundi et le mardi. Le tableau des heures de cette page, tenu à jour par la boutique, signale aussi les jours fériés et les fermetures exceptionnelles. » | same |
| 4 | Êtes-vous ouverts pendant le temps des Fêtes? | `/nous-trouver/` (FAQ) | **owner** (14 H2) | « Les heures des jours fériés et du temps des Fêtes sont publiées sur cette page avant chaque congé : [[FACT NEEDED: heures des Fêtes 2026]]. » For a holiday page only: the City lifts lot time limits from 7 December 2026 to 3 January 2027 (20c P-13, PL-5) | 20c |
| 5 | Où se trouve exactement la boutique au centre-ville? | `/` (section); `/nous-trouver/` | exists + **owner** (landmark: 14 S3, H5; 20c L-1, L-2) | « La Pâtisserie Coco Vanille se trouve au 3, rue Court, au centre-ville de Granby (Québec), code postal J2G 4Y6. » and « Repère pour trouver la porte : [[FACT NEEDED: repère visuel près de la boutique, approuvé par le propriétaire]]. » 20c's « à quelques pas de la rue Principale » waits for the owner's OK | Registraire; 20c G-1 |
| 6 | Où se stationner près de la boutique? Est-ce gratuit? | `/`, `/faq/` (FAQ); `/nous-trouver/` (section) | exists | « Le stationnement municipal Centre-Court, entre les rues Court et du Centre, est à environ 100 m de la boutique. Comme tout le stationnement municipal du centre-ville de Granby, il est gratuit. » | 20c P-1, P-3 |
| 7 | Y a-t-il une limite de temps pour se stationner la fin de semaine? | `/nous-trouver/`; Zoo page (section) | exists + new | « Le Centre-Court offre des cases de 4 h et de 2 h (limites du lundi au vendredi) et des rangées sans limite de temps. » New (Zoo page): « …le samedi et le dimanche, ces cases n’ont pas de limite de temps, et certaines rangées n’en ont jamais. » | 20c P-4, P-5 |
| 8 | À quelle distance du Zoo de Granby est la boutique? | `/nous-trouver/` (section); Zoo page | exists | « La Pâtisserie Coco Vanille est à environ 5 à 8 minutes en auto du Zoo de Granby (3 à 4 km selon le trajet), sans compter la circulation. Le Zoo est au 1050, boulevard David-Bouchard Nord. » + pointer (§1.6) | 20c Z-8, Z-1 |
| 9 | Comment aller du Zoo à la boutique en autobus? | Zoo page (section) | new | « Oui : le circuit Nord du transport urbain de Granby, direction centre-ville, relie l’arrêt Saint-Hubert/Zoo au Terminus Centre-ville, rue du Centre, à environ 300 m à pied de la boutique. » | City brochure, July 2026; Z6–Z8 |
| 10 | Y a-t-il une pâtisserie près du Zoo de Granby? | `/faq/` (new section); Zoo page (H1, answer) | new (FR twin of an EN-only FAQ) | « Oui : la Pâtisserie Coco Vanille est au centre-ville de Granby, au 3, rue Court, à environ 5 à 8 minutes en auto du Zoo de Granby (3 à 4 km selon le trajet), sans compter la circulation. » | 20c Z-8 |
| 11 | Peut-on commander à l’avance pour passer en allant au Zoo? | Zoo page (FAQ) | new (FR twin of an EN-only FAQ) | « Oui, pour les produits qui ont des plages de cueillette ce jour-là : commandez sur la page Commander ou par téléphone au 450-372-7177, puis passez au 3, rue Court pendant votre plage. » | Site ordering rule (Z25) |
| 12 | Peut-on apporter au Zoo un lunch acheté à la boutique? | Zoo page (section) | new | « Oui : selon sa foire aux questions, le Zoo de Granby permet d’apporter son lunch, et plusieurs aires de pique-nique sont aménagées sur le site. » | Zoo FAQ and rules (Z16, Z17) |
| 13 | Peut-on sortir du Zoo pour un café et revenir le même jour? | Zoo page (section) | new | « Oui : selon sa foire aux questions, le Zoo de Granby permet de sortir et de revenir pendant la journée en faisant étamper sa main à la sortie, même s’il encourage à limiter les entrées et sorties. » | Zoo FAQ (Z18) |
| 14 | Peut-on manger sur place? Y a-t-il des places assises? | `/carte/` (FAQ); `/nous-trouver/` (FAQ) | exists + new + **owner** (number of seats: 14 N3, H5) | Exists: « On peut s’y installer pour prendre un café. Prix et nombre de places : [[FACT NEEDED: prix des boissons et nombre de places assises]]. » New on `/nous-trouver/`, replacing « Les places assises restent à confirmer par la boutique : [[FACT NEEDED: nombre de places assises]]. »: « Oui : la boutique se décrit comme un endroit chaleureux où l’on peut s’installer pour prendre un café. Nombre de places : [[FACT NEEDED: nombre de places assises]]. » | Pinned post 2026-08-25 (20b S-16) |
| 15 | Servez-vous du café? | `/carte/` (FAQ) | exists | « Oui : la boutique du 3, rue Court, présentée sur sa page Facebook comme « Pâtisserie & Café », sert, sur place ou à emporter, café, espresso, cappuccino, latte, macchiato, thé, tisane et chocolat chaud, et en boissons froides café glacé, moka glacé et matcha (liste publiée par la boutique en 2026). » | 20b S-14, S-15, S-24 |
| 16 | Avez-vous du salé pour le dîner? | `/patisseries/` (FAQ); Zoo page | new | « Oui : la Pâtisserie Coco Vanille, à Granby, annonce du salé, sur place ou à emporter : des feuilletés, des mini pizzas, des pastillas au poulet et des sandwichs, selon ses publications de septembre 2026. » | 20b S-10, S-12 |
| 17 | Avez-vous des spécialités marocaines? | `/carte/` (FAQ); `/` (list) | new + **owner** (days, prices) | §2 | 20b S-13 |
| 18 | Où acheter un gâteau d’anniversaire à Granby? | `/gateaux/` (answer; section 1) | exists + new | Exists: « La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, prépare des gâteaux sur commande à récupérer en boutique, dont le gâteau aux framboises et le shortcake aux fraises. » The two named cakes come from reviews (unverified, 20b §4.5). New first sentence of section 1: « La Pâtisserie Coco Vanille, à Granby, prépare des gâteaux personnalisés sur commande pour les anniversaires et les occasions spéciales, selon la liste de son offre publiée en août 2026. » Prices and lead times: **owner** (14 P1, P4) | 20b S-8 |
| 19 | Peut-on avoir un gâteau pour demain? | `/` (FAQ); `/gateau-pour-demain/` | **owner** (14 P4) | « Ça dépend de l’heure limite de commande, que la boutique doit confirmer : [[FACT NEEDED: commande pour le lendemain offerte ou non, et heure limite]]. » | — |
| 20 | Offrez-vous des ateliers pour les enfants? | `/faq/` (section); Zoo page (FAQ) | exists + **owner** (ages: 14 N2; 20b N-14) | « Oui : la Pâtisserie Coco Vanille offre des ateliers créatifs sur réservation, les vendredis, samedis et dimanches : de la peinture, ou de la décoration de perles et de strass, sur un objet de votre choix. » and « Âges et heures de début : [[FACT NEEDED: âges et heures de début des ateliers]]. » Never « pour enfants » until the ages are given | 20b S-17 to S-19 |
| 21 | Livrez-vous à Bromont ou à Waterloo? | `/nous-trouver/` (FAQ) | exists | « La commande en ligne prévoit la cueillette au 3, rue Court, à Granby. Livraison : non offerte; toutes les commandes se récupèrent à la boutique. » | research/21 A3 |
| 22 | La boutique est-elle accessible en fauteuil roulant? | `/nous-trouver/` (FAQ); `/accessibilite/` | **owner** (14 H5; 20c A-1) | « L’accès en fauteuil roulant reste à décrire par la boutique : [[FACT NEEDED: marches, largeur de porte et accès en fauteuil roulant]]. » | — |
| 23 | Acceptez-vous les dollars américains et les cartes étrangères? | `/` (FAQ); `/nous-trouver/` (new FAQ) | exists + new + **owner** (14 O5) | Exists: « En boutique : [[FACT NEEDED: modes de paiement acceptés au comptoir]]. » New (FR twin of an EN-only FAQ): « Les modes de paiement acceptés au comptoir restent à confirmer : [[FACT NEEDED: devises et modes de paiement acceptés au comptoir]]. » | — |
| 24 | Parlez-vous anglais? | `/` (FAQ) | **owner** (14 L1) | « Service en anglais au comptoir : [[FACT NEEDED: personne qui sert la clientèle en anglais]]. » | — |
| 25 | Pourquoi Google Maps écrit-il « Cocovanille »? | `/nous-trouver/` (FAQ); `/` (section) | exists | « Google Maps écrit « Pâtisserie Cocovanille » en un mot, mais c’est bien la même boutique : la Pâtisserie Coco Vanille, au 3, rue Court, à Granby, au 450-372-7177. » | 20a §0.2 |

Counts (the groups overlap):
- **Fully answered by existing copy:** 1, 2, 3, 6, 8, 15, 21, 25 (8).
- **New or completed sentence from this step:** 7, 9, 10, 11, 12, 13, 14, 16, 17, 18, 23 (11).
- **A gap only the owner can fill:** 4, 5, 14, 17, 18, 19, 20, 22, 23, 24 (10). Of these, 4, 19, 22 and 24 are existing sentences that are only a marker today.

### 3.2 English twins (same numbers)

| # | Question | Page | Status | Answer sentence |
|---|---|---|---|---|
| 1 | Are you open on Sunday? | `/en/visit/` | exists | "Yes: the shop is open Sunday from 9:30 a.m. to 5 p.m., and Sunday statutory holidays and exceptional closures are shown in the hours table on this page." |
| 2 | Are you open on Monday? | `/en/visit/`; Zoo page | exists + new | "Pâtisserie Coco Vanille is open Wednesday to Saturday from 8:30 a.m. to 5:30 p.m., and Sunday from 9:30 a.m. to 5 p.m.; it is closed Monday and Tuesday." New: "No: Pâtisserie Coco Vanille is closed Monday and Tuesday. …" |
| 3 | What are the opening hours? Is it open today? | `/en/` | exists | "The shop is open Wednesday to Saturday from 8:30 a.m. to 5:30 p.m., and Sunday from 9:30 a.m. to 5 p.m.; it is closed Monday and Tuesday." |
| 4 | Are you open over the holidays? | `/en/visit/` | **owner** | "Holiday and statutory-holiday hours are posted on this page before each holiday: [[FACT NEEDED: 2026 holiday hours]]." |
| 5 | Where exactly is the shop downtown? | `/en/`; `/en/visit/` | exists + **owner** | "Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec, postal code J2G 4Y6." and "Landmark to find the door: [[FACT NEEDED: visual landmark near the shop, approved by the owner]]." |
| 6 | Where can I park near the shop? Is it free? | `/en/`; `/en/visit/`; `/en/faq/` (new twin) | exists + new | "The municipal Centre-Court lot, between rue Court and rue du Centre, is about 100 m from the shop. Like all municipal parking in downtown Granby, it is free." The `/en/faq/` twin (`faqEnParking`) is new |
| 7 | Is there a time limit on weekends? | `/en/visit/`; Zoo page | exists + new | "Centre-Court has 4-hour and 2-hour spaces (limits apply Monday to Friday) and rows with no time limit." New: "…on Saturday and Sunday these spaces have no time limit, and some rows never do." |
| 8 | How far is the shop from the Granby Zoo? | `/en/visit/`; Zoo page | exists | "Pâtisserie Coco Vanille is about 5 to 8 minutes by car from the Granby Zoo (3 to 4 km depending on the route), not counting traffic. The Zoo is at 1050 boulevard David-Bouchard Nord." |
| 9 | How do I get from the Zoo to the shop by bus? | Zoo page | new | "Yes: the Circuit Nord of Granby’s city buses, towards downtown, links the Saint-Hubert/Zoo stop to the Terminus Centre-ville on rue du Centre, about 300 m on foot from the shop." |
| 10 | Is there a bakery near the Granby Zoo? | `/en/faq/` (FAQ becomes a section); Zoo page | exists, moved | "Pâtisserie Coco Vanille, a pastry shop and bakery at 3 rue Court in downtown Granby, is about 5 to 8 minutes by car from the Granby Zoo (3 to 4 km depending on the route), not counting traffic." + pointer |
| 11 | Can I pre-order pastries for pickup on the way to the Zoo? | `/en/order/` (moves); Zoo page | exists, moved | "Yes, when the products have pickup slots that day: order online, then pick up at 3 rue Court during your slot." Zoo page: "…order on the Order page or by phone at 450-372-7177…" |
| 12 | Can I bring a lunch from the shop into the Zoo? | Zoo page | new | "Yes: according to its FAQ, the Granby Zoo lets visitors enjoy their own lunch on site, and several picnic areas are set up." |
| 13 | Can I leave the Zoo for a coffee and come back the same day? | Zoo page | new | "Yes: according to its FAQ, the Granby Zoo lets you leave and come back during the day if you have your hand stamped at the gate, although it encourages visitors to limit their comings and goings." |
| 14 | Can I eat in? Is there seating? | `/en/menu/`; `/en/visit/` | exists + new + **owner** | Exists: "You can sit down for a coffee. Prices and number of seats: [[FACT NEEDED: drink prices and number of seats]]." New on `/en/visit/`, replacing "Seating is still to be confirmed by the shop: [[FACT NEEDED: number of seats]].": "Yes: the shop describes itself as a warm place where you can sit down for a coffee. Number of seats: [[FACT NEEDED: number of seats]]." |
| 15 | Do you serve coffee? | `/en/menu/` | exists | "Yes: the shop at 3 rue Court, presented on its Facebook page as « Pâtisserie & Café », serves, to stay or to go, coffee, espresso, cappuccino, latte, macchiato, tea, herbal tea and hot chocolate, and cold drinks: iced coffee, iced mocha and matcha (list published by the shop in 2026)." |
| 16 | Do you have savoury food for lunch? | `/en/pastries/`; Zoo page | new | "Yes: Pâtisserie Coco Vanille in Granby offers savoury food to stay or to go: puff pastries, mini pizzas, chicken pastillas and sandwiches, according to its posts of September 2026." |
| 17 | Do you have Moroccan specialties? | `/en/menu/`; `/en/` | new + **owner** | §2 |
| 18 | Where can I buy a birthday cake in Granby? | `/en/cakes/` | exists + new + **owner** | Exists: "Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes cakes to order for pickup at the shop, including the raspberry cake and the strawberry shortcake." New first sentence: "Pâtisserie Coco Vanille in Granby makes custom cakes to order for birthdays and special occasions, according to the list of its offer published in August 2026." |
| 19 | Can I get a cake for tomorrow? | `/en/` | **owner** | "It depends on the order cut-off time, which the shop still has to confirm: [[FACT NEEDED: next-day orders offered or not, and cut-off time]]." |
| 20 | Do you offer workshops for kids? | `/en/faq/`; Zoo page | exists + **owner** | "Yes: Pâtisserie Coco Vanille offers creative workshops by reservation on Fridays, Saturdays and Sundays: painting, or decorating an item of your choice with beads and rhinestones." and "Ages and start times: [[FACT NEEDED: workshop ages and start times]]." |
| 21 | Do you deliver to Bromont or Waterloo? | `/en/` (exists); `/en/visit/` (new twin) | exists + new | "Online orders are picked up at the shop, 3 rue Court, Granby. Delivery: not offered; every order is picked up at the shop." New on `/en/visit/`: `nousTrouverEnDelivery` |
| 22 | Is the shop wheelchair accessible? | `/en/visit/` | **owner** | "Wheelchair access is still to be described by the shop: [[FACT NEEDED: steps, door width and wheelchair access]]." |
| 23 | Do you accept US dollars or foreign cards? | `/en/visit/`; `/en/` | **owner** | "Payment methods accepted at the counter are still to be confirmed: [[FACT NEEDED: currencies and payment methods accepted at the counter]]." and "Cards accepted in store: [[FACT NEEDED: payment methods accepted at the counter]]." |
| 24 | Do you speak English in the shop? | `/en/` | **owner** | "English service at the counter: [[FACT NEEDED: staff who serve customers in English]]." |
| 25 | Why does Google Maps say “Cocovanille”? | `/en/visit/` | exists | "Google Maps writes “Pâtisserie Cocovanille” as one word, but it is the same shop: Pâtisserie Coco Vanille, 3 rue Court, Granby, 450-372-7177." |

### 3.3 What only the owner can fill (one reply closes most of them)

| Gap | Questions | research/14 |
|---|---|---|
| Holiday hours 2026 | 4 | H2 |
| What customers see at the door (landmark); entrance, steps and door | 5, 22 | S3, H5; 20c §9, items 1–2 |
| Number of seats (and Wi-Fi, if offered) | 14 | N3, H5 |
| Moroccan specialities: days, prices, sweet or savoury | 17 | P1, P2 (new line to add) |
| Cake prices and lead times; next-day rule | 18, 19 | P1, P4 |
| Workshop ages and start times | 20 | N2 |
| Payment methods and currencies at the counter | 23 | O5 |
| Who serves in English | 24 | L1 |

---

## 4. Local structured data

### 4.1 What the site emits today (`apps/web/src/lib/schema.js`, read 2026-10-29)

**On every page:** one `Bakery` node (`@id` `/#bakery`) with:
- `name`, `alternateName` (« Pâtisserie Cocovanille »), `description` (the category sentence), `url`
- `telephone`, `email`
- `address` (PostalAddress), `geo` (7 decimals), `hasMap` (the Google CID)
- `openingHoursSpecification` and `specialOpeningHoursSpecification` (only the days the hours table shows, closures included)
- `sameAs` (verified profiles only: Facebook, Instagram)
- `knowsLanguage` (`fr-CA`)
- `inLanguage`

Also: `WebSite`, `WebPage`, `BreadcrumbList`, and on product pages `Product` + `Offer`, only for sizes with a price.

**Rules already in the code:** "only values visible on the page; no self-serving review stars; nothing for missing facts". `schema.test.js` asserts that `aggregateRating` and `review` are never emitted.

Google's LocalBusiness page (last updated 2026-09-08):
- **Required:** `address` and `name`.
- **Recommended:** `aggregateRating`, `department`, `geo` (at least 5 decimals), `menu`, `openingHoursSpecification`, `priceRange`, `review`, `servesCuisine`, `telephone`, `url`. Google limits `aggregateRating` and `review` to "sites that capture reviews about other local businesses".
- "Use the most specific LocalBusiness sub-type possible". `Bakery` is a schema.org subtype of `FoodEstablishment`.

The Organization page (2026-09-08) adds `legalName` among the "fields recommended in this guide" for local businesses.

The general policy (2026-07-10): "Don't mark up content that is not visible to readers of the page."

### 4.2 Add: true, and visible on the page

| Property | Value | Visible where | Basis | Note |
|---|---|---|---|---|
| `legalName` | « Pâtisserie Coco Vanille inc. » | Footer of every page (« Pâtisserie Coco Vanille inc. · NEQ 1177082220 ») | Registraire (20a §0.1); Google Organization doc: "The registered, legal name … if applicable and different from the name property" | Separates the entity from « Coco Vanille » the perfume and the bakery in Réunion (research/04 §0.7) |
| `contactPoint` | `{ '@type': 'ContactPoint', telephone: '+14385287818', contactType: 'Réservation des ateliers créatifs' / 'Creative workshop bookings', availableLanguage: 'fr-CA' }` | The number: footer of every page (« Cellulaire »). Its use: `/faq/` section and the Zoo page FAQ | The shop's reel 2026-10-22 (20b S-19): « sur réservation : 438 528 7818 » | Update the comment in `src/seed/index.js` that keeps the mobile out of the JSON-LD (« what it is for … is not confirmed (14 H7) »). Its workshop use is confirmed; whether it takes texts is still open |
| `menu` | `https://cocovanillegranby.com/carte/` · `/en/menu/` | The header « Carte » link on every page | Google's LocalBusiness doc: "For food establishments, the fully-qualified URL of the menu." schema.org now prefers `hasMenu` (which supersedes `menu`); pick one, not both | Emit it only when the menu page is served in that language (strict publishing never names a hidden page) |
| `servesCuisine` | FR `['Pâtisserie', 'Boulangerie', 'Spécialités marocaines']` · EN `['Pastry', 'Bakery', 'Moroccan specialties']` | Home: « pâtisserie-boulangerie » in the answer, plus the « Que vend… » list once the Moroccan item is in (§1.5) | Google's doc ("The type of cuisine the restaurant serves"); schema.org FoodEstablishment | Only on pages where the words show (home; `/carte/`, where « Pâtisserie & Café » shows, could also have 'Café'). No 'Française' or any cuisine the shop has not published |
| `mentions`, on the Zoo page's `WebPage` node only | `{ '@type': 'Zoo', name: 'Zoo de Granby', url: 'https://www.zoodegranby.com/', address: { '@type': 'PostalAddress', streetAddress: '1050, boulevard David-Bouchard Nord', addressLocality: 'Granby', addressRegion: 'QC', postalCode: 'J2H 0Y6', addressCountry: 'CA' } }` | The page names the Zoo and gives that address (section 1, FAQ 5) | schema.org `Zoo` (Place › CivicStructure › Zoo; `address`, `url` available); the Zoo's own page for the address | Disambiguates from the US Granbys that took 9 of 12 L8 links. No hours, prices, rating or `sameAs` for the Zoo. Implementation: an optional `mentions` argument to `webPageNode`, passed for this key |
| `identifier` (optional) | `{ '@type': 'PropertyValue', propertyID: 'NEQ', value: '1177082220' }` | Footer of every page | schema.org Thing › identifier; Registraire | Google lists no field for a Québec enterprise number (it lists taxID, vatID, iso6523Code, naics, duns, leiCode, GLN). The NEQ is not a tax number, so never put it in `taxID`. Useful only for entity matching |

### 4.3 Fix

`inLanguage` sits on the Bakery node (`schema.js` line 86). schema.org lists `inLanguage` only on BroadcastService, CommunicateAction, CreativeWork, Event, LinkRole, PronounceableText and WriteAction, not on Organization, Place, LocalBusiness or FoodEstablishment (schema.org/inLanguage, read 2026-10-29).
- **The fix:** remove it from `bakeryNode` and keep it on `webPageNode`, where it is valid and already tested (`schema.test.js`: `web.inLanguage === 'fr-CA'`).
- **What carries the language:** `knowsLanguage` already says which language the shop serves in.

### 4.4 Do not add

| Property | Why not |
|---|---|
| `aggregateRating`, `review` | Google: they apply "only to sites that capture reviews about other local businesses", and pages whose entity "controls the reviews about itself" are "ineligible for star review feature" (review-snippet doc, 2026-09-08). The Wanderlog copy (4.9 from 41) is unverified and never published (20b §6) |
| `priceRange` | The only shop price is the workshop's 37 $. « $–$$ » is RestoMontreal's label, not the shop's (20b T-3) |
| `paymentAccepted`, `currenciesAccepted` | Unknown (14 O5); the page says so |
| `acceptsReservations` | schema.org: "Indicates whether a FoodEstablishment accepts reservations", that is, reservations to eat or drink there. Nothing shows the shop takes them, and workshop bookings are a different thing. Google's LocalBusiness page does not list it (read 2026-10-29) |
| `areaServed` | Pickup only, no delivery (21 A3). A list of towns would read as delivery or a service area, the doorway pattern of §1.1. The address already places the shop |
| `amenityFeature` | Google's LocalBusiness page does not list it, and schema.org describes it as a feature "of the Accommodation" (read 2026-10-29). The only true value (one can sit down) has no count yet, and wheelchair access is unknown (20c A-1). Revisit once 14 H5 and N3 are answered |
| `servesCuisine` values not on the page | No « Française », no « Halal » (never inferred, 20b N-17), no « Sans gluten » |
| `suitableForDiet` (e.g. GlutenFreeDiet) on any product or menu | A regulated claim (research/07 A-6; 21 A9) |
| `Event` for workshops or the Halloween activity | No dates or start times are published (20b N-14); the Halloween activity ended with October |
| `specialOpeningHoursSpecification` for the 2026 holidays | Unknown (14 H2). The code already emits only what the hours table shows |
| `FAQPage` as a tactic | FAQ rich results are no longer shown (2026-05-07, research/06 (k)). Optional for understanding, never a gate |
| `image`, `logo` | Only the shop's real storefront photo or logo, approved by the owner. Never a « Photo d'illustration » |
| The Zoo's hours, prices, logo or `sameAs` | Not ours; they change. The page links to the Zoo's own page |
| `sameAs` to a Google `kgmid` search URL or to directories | `sameAs` lists only profiles the shop controls and that are verified (Facebook, Instagram) |
| `knowsLanguage: en-CA` | Only once someone serves in English (14 L1) |

**Launch checks** (no schema change):
- `email` and `url` use `cocovanillegranby.com`. That domain is not registered yet (21 §3; 20a §0.3).
- The JSON-LD becomes true only when the domain and the bonjour@ mailbox exist, which is already a launch blocker.

### 4.5 The Zoo page's JSON-LD (French), as it should render

```json
{ "@type": "WebPage", "@id": "https://cocovanillegranby.com/nous-trouver/zoo-de-granby/#webpage",
  "url": "https://cocovanillegranby.com/nous-trouver/zoo-de-granby/", "name": "Café et pâtisserie près du Zoo de Granby",
  "inLanguage": "fr-CA", "isPartOf": { "@id": "https://cocovanillegranby.com/#website" }, "about": { "@id": "https://cocovanillegranby.com/#bakery" },
  "mentions": { "@type": "Zoo", "name": "Zoo de Granby", "url": "https://www.zoodegranby.com/",
    "address": { "@type": "PostalAddress", "streetAddress": "1050, boulevard David-Bouchard Nord", "addressLocality": "Granby", "addressRegion": "QC", "postalCode": "J2H 0Y6", "addressCountry": "CA" } } }
```

The `BreadcrumbList` follows from the registry: Accueil › Nous trouver › Café et pâtisserie près du Zoo de Granby. Bakery and WebSite are unchanged.

---

## 5. Hand-off (this step edited only its two files)

| Who | What |
|---|---|
| Apply step (`apps/`) | 1. Registry line (§1.2). 2. `pageNames` for FR and EN (§1.2). 3. The seed entry (§1.3) and `zooDeGranby` in `pages`. 4. The changes of §1.5 (they use the existing `ZOO_*`, `PARKING_EN` and `DELIVERY_EN` constants). 5. Optional: the `content` template action (§1.2) and the page-name linker (§1.6). 6. Schema: §4.2 and §4.3; update the `src/seed/index.js` comment on the mobile number. 7. Re-run `node check.mjs` (this folder), then `npm test` (in `apps/web`) and `node apps/web/scripts/gate.mjs`. No test needs an edit: the content and registry tests loop over every page |
| Documents to align (not edited here) | docs/17 §1 tree and §1.1 table (add the page under Nous trouver), §2 (the Zoo, parking and seating rows), §3.4 (parity resolved as in §1.5), §6 (the « Visiter Granby » row becomes this page). research/04 §2 P16 slug (now `/nous-trouver/zoo-de-granby/`). `data/keywords.csv`: the `target_page` of the 4 « visitors » FR/EN rows. scoreboard/prompts.csv L5, L8, L8-quebec `target_url` and status (scoreboard is out of bounds for this step). docs/14: the page's spring refresh before 2027-05-01 |
| Facts step | The Johnson distance in `PARKING_MORE_*` (§6, item 1) |
| Owner | §3.3; and the new research/14 line on the Moroccan specialities (§2) |

---

## 6. Side findings and open items

1. **« Le stationnement Johnson … est à environ 150 m »** (content.js `PARKING_MORE_FR`/`_EN`; 20c's candidate copy) matches neither engine:
   - **To the lot's listed address (18, rue Johnson):** 119 m (Valhalla) and 120 m (OSRM foot). Verified, two engines, §7 lookups 6 and 7.
   - **To the middle of the lot:** about 210 m (20c P-10, one engine).
   - **Suggested wording:** « Le stationnement Johnson (18, rue Johnson), de l'autre côté de la rue Principale, est à environ 120 m de la boutique. » If the lot's middle matters more, write « à moins de 250 m ». The « de l'autre côté de la rue Principale » is now verified.
2. **The Zoo stop moves in summer.** Direction centre-ville it moves to rue Dorion; direction Galeries, to rue Bégin (brochure, July 2026). 20c's data twin had it in a note only. Re-check in the 2027 brochure before the spring refresh.
3. **Centre-Court distance.** In a straight line it is 75–105 m (20c P-7); on foot, 117–118 m (two engines). « environ 100 m » is fine for the lot. If a walking figure is ever wanted, it is « environ 120 m à pied ».
4. **The seed's English Zoo answers** on `/en/visit/` and `/en/faq/` already carry the 20c range (applied at about 15:38 UTC). The Zoo page does not repeat that sentence word for word: the near-duplicate guard passes.
5. **Google's spam-policy dates differ by language:** 2026-08-28 (EN) and 2026/08/31 (FR). Cite the page and the date seen.
6. **Open:**
   - a Granby-located SERP and PAA harvest for L5, L8 and L8-quebec (research/05 §9; 04 V5)
   - the spring 2027 refresh (§1.1, guardrail 3)
   - whether the Zoo works with local food suppliers (research/11 §3, not surfaced)
   - research/14 P16 (a visitor offer) stays open: the page does not need it, and invents none

---

## 7. Search log (2026-10-29)

### WebSearch (4 queries, standard mode, US-located)

| # | Query (verbatim) | Useful result |
|---|---|---|
| 1 | msemmen crêpe feuilletée marocaine définition harcha galette de semoule | lalanguefrancaise.com (Wiktionnaire definition of « msemen »); Tasting Table; afrik.com; dubocalalassiette.fr |
| 2 | harcha marocaine galette de semoule cuite à la poêle définition | bladi.net « Harcha ou galettes de semoules »; voyages.ideoz.fr « Recette marocaine de harchas, galettes de semoule »; afrik.com |
| 3 | msemmen OR msemen OR harcha Granby Québec | Nothing about any seller in Granby (absence of evidence) |
| 4 | Zoo de Granby ouvert l'hiver 2026-2027 horaire saison hivernale | The Zoo's rates page (winter: amusement park and Amazoo closed); its gift-ideas page (winter ticket valid 2025-12-26 → 2026-03-29); mtl.org (hours vary by season). **Not used in copy:** the page links to the Zoo's own hours instead |

### WebFetch (18 reads)

| # | URL | Result |
|---|---|---|
| 1 | developers.google.com/search/docs/essentials/spam-policies | Doorway abuse: definition and four examples; "Last updated 2026-08-28 UTC" |
| 2 | developers.google.com/search/docs/appearance/structured-data/local-business | Required and recommended properties; "Use the most specific LocalBusiness sub-type possible"; no `acceptsReservations`; last updated 2026-09-08 |
| 3 | developers.google.com/search/docs/appearance/structured-data/sd-policies | "Don't mark up content that is not visible to readers of the page"; last updated 2026-07-10 |
| 4 | developers.google.com/search/docs/appearance/structured-data/review-snippet | Self-serving reviews on LocalBusiness/Organization are ineligible; last updated 2026-09-08 |
| 5 | schema.org/FoodEstablishment | `acceptsReservations`, `hasMenu` (supersedes `menu`), `servesCuisine`; Place and Organization properties; Bakery is a subtype |
| 6 | zoodegranby.com/horaire | « Horaire et directions »; « 1050 boul. David-Bouchard N, Granby, QC, J2H 0Y6. »; free parking; link to the City's transit page; links to /faq and /reglements |
| 7 | zoodegranby.com/faq | Lunch allowed and picnic areas; no outside alcohol; no BBQ; re-entry with a hand stamp; food outlets on site; free parking and shuttles |
| 8 | zoodegranby.com/reglements | No glass containers, no alcohol; coolers may be checked; no food or drink in the water parks |
| 9 | granby.ca/fr/transport-urbain-granby | Circuits Sud, Nord, Centre, Est; links the July 2026 brochure and an interactive map; fares |
| 10 | developers.google.com/search/docs/appearance/structured-data/organization | `legalName` and identifier fields; local businesses follow LocalBusiness "in addition to the fields recommended in this guide"; last updated 2026-09-08 |
| 11 | lalanguefrancaise.com/dictionnaire/definition/msemen | « Crêpe marocaine fine, confectionnée à base de farine et de semoule » (source: Wiktionnaire) |
| 12 | tastingtable.com/1363195/msemen-moroccan-crepe/ | Claire Redden, 2023-08-14: a flakier Moroccan-style crêpe, folded, flattened and pan-fried |
| 13 | bladi.net/harcha-ou-galettes-de-semoules.html | Title, « Recette Marocaine », cooked « sur poêle sèche »; no date |
| 14 | schema.org/inLanguage | Domain: BroadcastService, CommunicateAction, CreativeWork, Event, LinkRole, PronounceableText, WriteAction |
| 15 | schema.org/Zoo | Thing › Place › CivicStructure › Zoo; `address`, `url`, `sameAs` available |
| 16 | zoodegranby.com/en/schedule | "Schedule and directions"; same address; "Free parking available on site." |
| 17 | zoodegranby.com/en/faq | English wording of the lunch, re-entry and food-outlet answers |
| 18 | developers.google.com/search/docs/essentials/spam-policies?hl=fr | « Utilisation abusive des pages satellites (doorway) »: the French definition; « Dernière mise à jour le 2026/08/31 (UTC) » |

### Direct lookups (curl, UTC; data © OpenStreetMap contributors, ODbL)

| # | Lookup | Result |
|---|---|---|
| 1 | Nominatim lookup W580993446 (15:21:18) | « Terminus Centre »: 45.4008738, -72.7270411 (service way, bounding box 45.4006–45.4012, -72.7275 to -72.7264) |
| 2 | Valhalla pedestrian, shop → Terminus Centre (15:21:39) | 0.301 km, 203 s, via rue Court, rue Principale, rue du Centre |
| 3 | Valhalla pedestrian, shop → Centre-Court driveway 45.400522, -72.724982 (15:21:42) | 0.117 km, 83 s, via rue Court (OSRM foot, 20c P-7: 118 m) |
| 4 | City brochure PDF (15:37:32) into a new empty folder; pdftotext | 16,664,083 bytes, SHA-256 `b70e4b43592b20af…` (the same file as 20c). « 27 (NCV) Saint-Hubert/Zoo (déplacé sur Dorion l'été) » → « ARRIVÉE Terminus Centre-ville »; « 27 (NG) … (déplacé sur Bégin l'été) »; service hours (Saturday and Sunday 8 h–18 h 30) |
| 5 | Nominatim search « 18 rue Johnson, Granby » (15:39:26); « Stationnement Johnson Granby » (15:39:31) | 45.3993090, -72.7263040 (way 1261968225); no result for the lot's name |
| 6 | Valhalla pedestrian, shop → 18, rue Johnson (15:39:47) | 0.119 km, 82 s, via rue Court › rue Principale › rue Johnson |
| 7 | OSRM foot (FOSSGIS), shop → 18, rue Johnson (15:39:54) | 119.9 m, 96 s, same streets |
| 8 | `node --test test/unit/content.test.js` (read-only, 15:4x and again 16:07) | 57 of 57 pass on the live seed, both times |

---

## Sources

All seen 2026-10-29.

Google Search Central
- Spam policies for Google web search (doorway abuse; last updated 2026-08-28) — https://developers.google.com/search/docs/essentials/spam-policies — seen 2026-10-29
- Règles relatives au spam pour la recherche Web de Google (pages satellites; dernière mise à jour 2026/08/31) — https://developers.google.com/search/docs/essentials/spam-policies?hl=fr — seen 2026-10-29
- Local business (LocalBusiness) structured data (last updated 2026-09-08) — https://developers.google.com/search/docs/appearance/structured-data/local-business — seen 2026-10-29
- Organization structured data (last updated 2026-09-08) — https://developers.google.com/search/docs/appearance/structured-data/organization — seen 2026-10-29
- General structured data guidelines (last updated 2026-07-10) — https://developers.google.com/search/docs/appearance/structured-data/sd-policies — seen 2026-10-29
- Review snippet structured data (last updated 2026-09-08) — https://developers.google.com/search/docs/appearance/structured-data/review-snippet — seen 2026-10-29

schema.org
- FoodEstablishment — https://schema.org/FoodEstablishment — seen 2026-10-29
- inLanguage — https://schema.org/inLanguage — seen 2026-10-29
- Zoo — https://schema.org/Zoo — seen 2026-10-29

Official: Zoo de Granby
- Horaire et directions — https://www.zoodegranby.com/horaire — seen 2026-10-29
- Schedule and directions — https://www.zoodegranby.com/en/schedule — seen 2026-10-29
- Foire aux questions — https://www.zoodegranby.com/faq — seen 2026-10-29
- Frequently asked questions — https://www.zoodegranby.com/en/faq — seen 2026-10-29
- Règlements — https://www.zoodegranby.com/reglements — seen 2026-10-29

Official: Ville de Granby
- Transport urbain Granby — https://granby.ca/fr/transport-urbain-granby — seen 2026-10-29
- Transport urbain, dépliant (juillet 2026) — https://www.granby.ca/sites/default/files/2026-07/depliant_transport-urbain-26x26_juillet2026-hr.pdf — seen 2026-10-29

Definitions (msemmen, harcha)
- Msemen, définition (La langue française, from Wiktionnaire) — https://www.lalanguefrancaise.com/dictionnaire/definition/msemen — seen 2026-10-29
- Msemen Is The Moroccan-Style Crepe Your Morning Needs (Tasting Table, Claire Redden, 2023-08-14) — https://www.tastingtable.com/1363195/msemen-moroccan-crepe/ — seen 2026-10-29
- Harcha ou galettes de semoules (Bladi.net) — https://www.bladi.net/harcha-ou-galettes-de-semoules.html — seen 2026-10-29
- Recette marocaine de harchas, galettes de semoule (Voyages Ideoz; search result) — https://voyages.ideoz.fr/recette-marocaine-de-harchas-galettes-de-semoule-cuisine-maroc/ — seen 2026-10-29
- Les Mssemens, une délicieuse tradition culinaire du Maghreb (Afrik.com; search result) — https://www.afrik.com/les-mssemens-une-delicieuse-tradition-culinaire-du-maghreb — seen 2026-10-29

Routing and maps (data © OpenStreetMap contributors, ODbL)
- Nominatim lookup, way 580993446 — https://nominatim.openstreetmap.org/lookup?osm_ids=W580993446&format=jsonv2 — seen 2026-10-29
- Nominatim search, 18 rue Johnson — https://nominatim.openstreetmap.org/search?format=jsonv2&street=18%20rue%20Johnson&city=Granby&state=Qu%C3%A9bec&country=Canada — seen 2026-10-29
- Valhalla (FOSSGIS), pedestrian routes — https://valhalla1.openstreetmap.de/route — seen 2026-10-29
- OSRM foot (FOSSGIS), shop → 18 rue Johnson — https://routing.openstreetmap.de/routed-foot/route/v1/driving/-72.7250821,45.3995807;-72.7263040,45.3993090?overview=false&steps=true — seen 2026-10-29

Searched, not used in copy
- Zoo de Granby, rates (winter season) — https://zoodegranby.com/en/rates — seen 2026-10-29 (search result)
- Zoo de Granby, gift ideas (winter ticket 2025-12-26 → 2026-03-29) — https://www.zoodegranby.com/en/promotions-and-contests/gift-ideas — seen 2026-10-29 (search result)
- Granby Zoo and Amazoo water park (mtl.org) — https://www.mtl.org/en/what-to-do/activities/granby-zoo-and-amazoo-water-park — seen 2026-10-29 (search result)

Repo inputs (read only)
- research/20a (§0.1–0.3), 20b (S-1 to S-27, N-14, N-17, §4), 20c (P-1 to P-18, Z-1 to Z-10, G-1, L-1, L-2, A-1, §8, §9), 20d, 20e, research/21 (A3, A7, A8, A9, B5, §3), research/04 (§2 P16, §5 F27, E04, E13, E17, S14), research/05 (L5, L8 W44 runs), research/06 (k), research/00 §5.1, research/14 (H1, H2, H5, L1, N2, N3, O5, P1, P2, P4, P16, S3), docs/05, 06, 03, 08, 17, 19
- apps/web/src/seed/content.js (state of 16:06 UTC, SHA-256 8ddaa985f9b0bebb…), src/seed/index.js, src/lib/routes.js, schema.js, publish.js, public-paths.js, i18n.js, src/proxy.js, src/components/site/SitePage.js, Contract.js, Related.js, Footer.js, src/components/templates/index.js, shared.js, test/unit/content.test.js, routes.test.js, schema.test.js; data/keywords.csv, scoreboard/prompts.csv
