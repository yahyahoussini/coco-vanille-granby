# 22b · The local market in Granby: directories, the Maghreb niche, downtown cafés, the Zoo and events, autocomplete (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Step: research « local market », under Yahya's mandate of 2026-10-29 (« take all decisions based on what I give and web research, and make the full thing ready »). It complements research/03 (competitors, 2026-10-25), research/05 (the proxy runs of 2026-10-29) and docs/19 (market and competition) without redoing them. It adds what they did not have: direct reads of the directory lists, the Moroccan niche, the café ring around the door, the Zoo and the City's events from official sources, and Google autocomplete.
Machine-readable twin: `data/research-local-market.json` (one object per finding: `id`, `value`, `label`, `source`, `seen`, `note`; each `note` gives the row number used below).

How this was made, and its limits:
- **15 WebSearch queries** (standard mode, US-located, summarised results) and **17 WebFetch reads**, all on 2026-10-29, plus direct lookups with curl and Python (public pages, official APIs and files). All are logged in §8.
- **Directory lists were read directly where they answered:**
  - Three Best Rated: 5 Granby pages, raw HTML
  - Restaurant Guru: the Granby desserts ranking, the city page and 5 place pages, raw HTML
  - Wanderlog: 3 pages
  - PagesJaunes: 1 search page

  **Refused:** Yelp and Tripadvisor (HTTP 403), Uber Eats (403), and RestoMontreal (403 in 20a–20c, so only search summaries). Their content here comes from search summaries, and each row says so.
- **The Google local pack and Google Maps cannot be seen from here.** WebSearch is US-located and returns summaries, not a Granby results page, and Google Maps returns an empty shell (20a). §1.2 lists the **likely** pack holders by evidence, using the three factors Google itself names (relevance, distance, prominence). It is an inference until a phone in Granby checks it (14 D1).
- **Ratings and review counts are copies.** They are Google figures as Restaurant Guru, Wanderlog or RestoMontreal reproduce them, at their own dates; Restaurant Guru's own « votes » aggregate several platforms. They are facts about a competitor on that page and date, never figures of the shop (docs/19). All are **unverified**.
- **Official sources:**
  - Statistics Canada's Census Profile API (2021; Granby city and census agglomeration)
  - the Zoo de Granby's site, press room and 2025 annual report (PDF)
  - the City of Granby's site, its events calendar and its 2026 events PDF
  - the FICG's site and the Marché public's site
  - the parade's organiser (Vie culturelle et communautaire de Granby)
  - Google's Business Profile help
- **Distances** are straight lines from the shop's verified map point (45.3995807, -72.7250821; 20c G-1) to Nominatim's position for each published address, rounded to the metre. They are **unverified (computed)**, and they are not walking routes.
- **Autocomplete** comes from Google's public suggest endpoint (`suggestqueries.google.com`, `client=firefox`, `gl=ca`, `hl=fr` then `hl=en`), called from a US location. Google personalises suggestions by location, so a phone in Granby may see others. Every suggestion here is **« autocomplete, not volume »**: it shows that a phrase is typed often enough to be suggested, and nothing about how often.
- **Not done:** no Google Maps, no local pack, no phone in Granby, no call to any business, no Semrush (no API units), no Yelp, Tripadvisor or Uber Eats page read.
- **Labels:**
  - **verified** = an official source (Statistics Canada, the City, the Zoo, the FICG, the market, the parade's organiser, Google's help), two independent sources, or a direct observation of what a page or dataset shows (for example « Three Best Rated lists one bakery »).
  - **unverified** = a search summary, one third-party copy (every rating and review count), a computed distance, an inference, or an absence of evidence.

---

## 0. Bottom line (decision-relevant)

1. **Three Best Rated now lists Pâtisserie Coco Vanille as Granby's only bakery.** The EN page « Best Bakeries in Granby, QC » and the FR « Meilleures Boulangeries à Granby » show one entry: 4.8, 115/120, « 2025 Highlights ». Pain-Pain (closed 2026-06-16) and Mélisse are gone, and the title lost its « 3 » (raw HTML, D-1).
   - docs/19 coup n° 2 (« Le palmarès qui met une boulangerie fermée en tête ») is settled at the source. What remains:
     - Sunday still shows 9:00 there instead of 9:30.
     - The answers of 2026-10-29 still quoted the old version (research/05 C8, X2, B2), so the engines' copies lag behind the page.
   - The cake list (« 3 Best Cakes » / « 3 Meilleurs Pâtisseries ») now ranks Avec un Grand A (118/120), Cake Design Granby (117) and Rose Gâteaux (116). Coco Vanille is still absent (D-2).
   - A third Granby list exists, « 3 Best Cafes »: Café de la Brûlerie, Tim Hortons, Starbucks. The shop is absent there too (D-3).
2. **No one else sells Moroccan specialities in the area, as far as public sources show.**
   - No seller of msemmen, harcha, chebakia or cornes de gazelle surfaced in Granby, the Haute-Yamaska, Bromont, Saint-Hyacinthe or Cowansville (five searches, two directory pages).
   - RestoMontreal's « restaurants marocains » page for Granby lists none.
   - The nearest documented Moroccan bakery is in Saint-Hubert (Longueuil). The nearest Maghreb restaurants are in Sherbrooke (§2.1).
   - **The local demand is small.** The 2021 census for Granby (city) counts:
     - 400 people with Arabic as mother tongue (0.6 %)
     - 200 who speak it most often at home, and 555 who know it
     - 150 « Moroccan » ethnic-origin responses, and 115 people born in Morocco (§2.2)
   - Autocomplete returns nothing for any Granby + Moroccan seed, while « msemen montreal » and « pâtisserie marocaine montréal / laval / brossard » exist (§5).
   - → Easy to own because nobody else claims it, but small: a section and two products, not a pillar.
3. **Five places serve coffee with seats within 170 m of the door, two of them within about 50 m** (§3):
   - Caféine & co (29 m) and Café ORÉE Pâtisserie (52 m)
   - La Mie Bretonne (121 m) and Les Finfinettes (124 m; a café that also runs creative workshops)
   - Mont Rose Pâtisserie & Café (168 m)

   Café de la Brûlerie, 736 m away, holds the prominence: 1,794 Google reviews per a copy, and #1 café on Three Best Rated. The café term is crowded. The shop's gap there is a missing café listing, not a missing page.
4. **The Zoo had 665,578 visitors in 2025, 514,661 of them in summer** (its 2025 annual report).
   - The 2026 season opened daily on 16 May (Amazoo on 8 June) and closes with the Halloween weekends on 1 November 2026.
   - **No 2027 date is published**, and the winter page still shows 2025–2026.
   - Autocomplete pairs the Zoo with no pâtisserie or bakery, in French or English (§4.1, §5).
5. **The next downtown crowd is the Défilé de Noël, Saturday 5 December 2026, leaving at 16 h on rue Principale**, while the shop is open; the route is not yet published (organiser's page and the City's calendar). The City's 2026 calendar also has these downtown events (§4.2):
   - the Oasis de la rue Principale (10–11 July)
   - FICG58 (13–23 August), whose semi-finals and final were at the Palace de Granby, 42 m from the shop (computed)
   - Les Folies gourmandes (25–26 September)
   - the Marché public, Saturdays until 7 November

   None of these organisers has published 2027 dates.
6. **Autocomplete shows people looking for the shop by name and by street**: « coco vanille granby » → « pâtisserie coco vanille granby », and « pâtisserie granby » → « pâtisserie granby rue court ». They look for rivals by product and street:
   - « … trompe l oeil » (Mont Rose, Café ORÉE) and « … rue denison » (Cake Design)
   - « cake design granby », « rose gateau granby », « gâteau personnalisé iga granby »

   In English, « bakery/cake granby » means the US Granby (§5).
7. **Winnable first, by evidence (last section):**
   - the bakery term (« boulangerie Granby », "bakery Granby Quebec"), where the only list that ranks bakeries now names the shop alone
   - the brand and its facts
   - the Maghreb specialities, uncontested but small

   The café, « pâtisserie Granby » and custom-cake battles are crowded or brand-led. The Zoo is a seasonal answer, not a map battle.

---

## 1. Who appears in public local lists, by query

### 1.1 What each directory list shows (2026-10-29)

| # | List (as titled) | Who is on it, in order (as shown) | Coco Vanille? | Label | Source | Seen |
|---|---|---|---|---|---|---|
| D-1 | Three Best Rated, « Best Bakeries in Granby, QC » (EN) and « Meilleures Boulangeries à Granby » (FR) | **One entry:** « PÂTISSERIE COCO VANILLE », 3 Rue Court, « (4.8 Score) », « Total Inspection Points: 115/120 », « 2025 Highlights », « Wed-Sat: 8:30am - 5:30pm · Sun: 9am - 5pm · Mon & Tue: Closed », (450) 372-7177, facebook.com/patisseriecocovanille. No Pain-Pain and no Mélisse; the title lost its « 3 » | **yes, alone** | verified (observed in the raw HTML of both pages) | threebestrated.ca/bakeries-in-granby-qc; …/fr-boulangeries-in-granby-qc | 2026-10-29 |
| D-2 | Three Best Rated, « 3 Best Cakes in Granby, QC » (EN) and « 3 Meilleurs Pâtisseries à Granby » (FR) | 1. Avec un Grand A, 581 Rue Breton, 4.9, 118/120, menu with prices (for example « Raspberry Cake $40.00 - $60.00 »); 2. Cake Design Granby, 194 Rue Denison East, 4.9, 117/120; 3. Rose Gâteaux, 160 rue Robinson Sud, 4.8, 116/120. research/03 (search summaries, 2026-10-25) had Cake Design first | no | verified (observed, raw HTML) | threebestrated.ca/cakes-in-granby-qc; …/fr-gâteaux-in-granby-qc | 2026-10-29 |
| D-3 | Three Best Rated, « 3 Best Cafes in Granby, QC » | 1. Café de la Brûlerie, 4 rue de la Gare, 5.0, 120/120, « Since 2003 »; 2. Tim Hortons Granby, 80 Rue Robinson Sud, 4.9, 117/120; 3. Starbucks Granby, 1035 Rue Principale, 4.8, 116/120 | no | verified (observed, raw HTML) | threebestrated.ca/cafe-in-granby-qc | 2026-10-29 |
| D-4 | Restaurant Guru, « Top 5 restaurants with desserts in Granby, october 2026 » (40 places; the 20 of page 1 read) | 1. Café De La Brûlerie (Le) 4.8 (2,070 votes); 2. Maître Glacier 4.8 (772); 3. Café Van Houtte 2.9 (316); 4. Eggsquis 2.5 (727); 5. Tim Hortons 4.7 (1,269); 6. Caféine & co - rue Principale 4.6 (380); 7. C'est Belge 4.8 (1,399); 8. Cora 4.8 (1,019); 9. Mélisse Pâtisserie 4 (28); 10. Mr. Puffs 3.2 (295); 11. Avec Un Grand A 1.5 (24); 12–14. Pur Délice, Fleur De Sel, La Crémière (no rating); 15. Beaver Tails 4.5 (27); 16. Les Aliments M&M 4.4 (71); **17. Patisserie Coco Vanille: no rating, « No info on opening hours »**; 18. Cake Design Cupcakerie 4.8 (62); 19. Café ORÉE Pâtisserie 5 (56), marked « New »; 20. La Fabrique de Bagel 3.6 (124) | yes, #17, no rating | verified (observed in the raw HTML; the WebFetch reading matched); the ratings are unverified copies | restaurantguru.com/desserts-Granby-t12 | 2026-10-29 |
| D-5 | Restaurant Guru place pages | **Patisserie Coco Vanille:** « 3 Rue Court, Granby, Québec, Canada, J2G 4Y6 », +1 450-372-7177, Facebook 5/5 from 5 reviews, **no Google rating and no hours**, « Updated on: Sep 05, 2026 ». **Caféine & co - rue Principale:** 139 Rue Principale, +1 450-956-1414, Google 4.7 (283), Facebook 5/5 (89), « Dine in », « Outdoor seating », « Wi-Fi ». **Café ORÉE Pâtisserie:** 142 Rue Principale, +1 450-521-4828, Google 4.8 (56), « Updated on: Oct 23, 2026 ». **Mélisse Pâtisserie:** 301 Rue Notre Dame, +1 450-956-4651, Google 4.8 (20), website « melissepatisserie.com » (not opened), « Updated on: Oct 26, 2026 ». **Café De La Brûlerie:** 4 Rue de la Gare, +1 450-372-2200, Google 4.4 (1,794), Foursquare 7.8/10 (22), terrace, « Wheelchair accessible », Wi-Fi | — | verified (observed); the figures are unverified copies | restaurantguru.com (5 pages, see Sources) | 2026-10-29 |
| D-6 | PagesJaunes, « Pâtisseries » near « Granby QC » (32 listings, most outside Granby) | Granby entries: Boulangerie Multi-Marques (615 Simonds S); Tartes et Clafoutis (189, rue Principale; 450-361-8881; 1 review); SimpleEtDelicieux (601 Rue Denison O); Boulangerie St-Methode (500, rue Guy); Gâteries Diane (603, rue Fréchette); Cake Design (194 rue Denison E); Avec Un Grand A (581 Rue Breton); Cri Et Véro Gâteaux (no street shown). No star ratings shown | **no**: the shop's listing 102750737 exists (20b), but not under this heading | verified (observed) | pagesjaunes.ca/search/si/1/Pâtisseries/Granby+QC | 2026-10-29 |
| D-7 | RestoMontreal Granby lists: « Meilleurs Pâtisseries de Granby », « Best Bakeries in Granby », desserts, cafés | As summarised: Pâtisserie Cocovanille 4.8 (22), with Google 4.9 (40+) « août 2026 »; Café ORÉE 4.8 (14); Caféine & co 4.8 (131); Mont Rose 4.7 (31), « reconnu pour ses pâtisseries en trompe-l'œil »; Café Van Houtte 4.7 (60); Fleur de Sel 4.8 (20); Pain-Pain 4.3 (29); « Boulangerie artisanale Le Moulin à Pain » 5.0 (4; address not seen); Mélisse 5.0 (1). The first figure of each pair is RestoMontreal's own vote count | yes | unverified (search summary; direct read refused) | restomontreal.ca (4 list URLs, see Sources) | 2026-10-29 |
| D-8 | RestoMontreal, « restaurants marocains » Granby | « 0 » local restaurants | — | unverified (search summary) | restomontreal.ca/restaurants/marocains-granby/fr/?c=91&d=103 | 2026-10-29 |
| D-9 | Yelp, « Patisserie/Cake Shop » and « Bakeries » near Granby (titles say « Updated October 2026 ») | Canaël (Bromont) 4.4 (about 29); Les Vraies Richesses (Sherbrooke) 5.0 (7–8); La Rumeur Affamée (Sutton) 5.0 (6–7); La Cabosse d'Or 4.2 (5); La Vie en Douceur (2); Cronin Cakes & Sweets and Pâtisserie Chez Dorville (1 each). Mostly outside Granby, as research/03 found | not named | unverified (search summary; direct read refused, 403) | yelp.ca (2 searches, see Sources) | 2026-10-29 |
| D-10 | Tripadvisor, Granby bakeries | Direct read refused (403). The shop's listing d27188801 exists (research/03). A Tartes et clafoutis review page (reviews from 2016–2017) surfaced | listing exists | unverified | tripadvisor.ca (403); research/03 §4 | 2026-10-29 |
| D-11 | Wanderlog, Granby lists | **No Granby bakery, café, dessert or cake list** among the lists Wanderlog links for Granby (breakfast and brunch, restaurants, cheap eats, family, Japanese, Asian, fast food, attractions, lunch). The breakfast list has 14 places, including: Café Van Houtte, 605 Rue Principale, Google 4.4 (300); three Tim Hortons, each with the Google categories « Coffee shop; Bakery; Breakfast restaurant; Cafe »: 1020 Rue Principale 3.5 (555), 315 Rue Denison E 3.5 (560), 575 Rue Saint-Hubert 3.6 (741); C'est Belge, 102 Rue Principale, 4.7 (1,007). Lunch list: Café De La Brûlerie #2, Google 4.4 (1,766). The shop appears only as a place page | not on a list | verified (observed); the figures are unverified copies | wanderlog.com lists 233379 and 317895 | 2026-10-29 |
| D-12 | Wanderlog, the shop's place page | Category tag « Pastry shop » (the only one shown); Google 4.9 from 41 reviews (37 / 3 / 0 / 1 / 0); the title still says « Magog, QC » | — | verified (observed); the Google figures are unverified copies | wanderlog.com/place/details/13122992 | 2026-10-29 |

Reading:
- **The shop owns the bakery category on the one list that ranks Granby bakeries** (D-1). It is absent from the cake lists (D-2, D-6) and from the café list (D-3). RestoMontreal's café pages leave it out too (research/05 X12).
- **Restaurant Guru has a listing for the shop**, contrary to docs/06 (« Non trouvée »). That listing shows no hours and no Google rating, only 5 Facebook reviews, and ranks the shop 17th of 20 in the desserts list (D-4, D-5).
- **The Google category that Wanderlog copies is « Pastry shop », alone** (D-12). Whether « Bakery » or « Cafe » are secondary categories cannot be seen. Wanderlog shows one tag for the shop but four for each Tim Hortons (D-11).
- **189, rue Principale carries two names**: « Tartes et Clafoutis » on PagesJaunes and in OSM (2016), « La Mie Bretonne » on RestoMontreal, both with the phone (450) 361-8881 (D-6, C-3). Most likely the same premises under a new sign (inference). That is a rival's citation problem, not ours.

### 1.2 By query: who appears, and the likely pack holders

The local pack cannot be seen from here (method). Google's own help names three factors:
- « Relevance is how well a Business Profile matches what someone is searching for »
- « Distance refers to how far each business is from the customer who's searching »
- « Prominence means how well-known a business is »

It adds that « More reviews and positive ratings can help your business's local ranking », and that « There's no way to request or pay for a better local ranking on Google » (Google Business Profile Help, read 2026-10-29). The last column applies these three factors to the evidence. **It is an inference, not a measurement** (label: unverified).

| Query | Lists that answer it (rows) | Named there | Likely pack holders, by evidence (unmeasured) | Evidence for the guess |
|---|---|---|---|---|
| pâtisserie Granby | D-2, D-4, D-6, D-7; research/05 X1 | TBR cakes: Avec un Grand A, Cake Design, Rose Gâteaux. RestoMontreal: Mélisse 1st, the shop 2nd (05 X1) | Mont Rose Pâtisserie & Café; Café ORÉE Pâtisserie; Pâtisserie Cocovanille; Mélisse Pâtisserie (status uncertain); Cake Design Granby | The query word is in four of these names. Three of them sit within 170 m of each other (§3), so for a searcher downtown, distance hardly separates them and prominence does. Google reviews: Mont Rose 70+ (03, October 2026 copy); Café ORÉE 56 (D-5) or about 80+ (05 X12); the shop 41 (D-12). Autocomplete suggests « … rue principale », « … trompe l oeil », « … rue denison » and « … rue court » (§5) |
| boulangerie Granby | D-1, D-6, D-7; 05 X2 | TBR: the shop alone (D-1). RestoMontreal: La Mie Bretonne 1st link, the shop 4th (05 X2) | La Mie Bretonne (189 rue Principale); Pâtisserie Cocovanille; Tim Hortons outlets (Google category « Bakery », D-11); the discount outlets St-Méthode (500 rue Guy) and Multi-Marques (615 Simonds S) | Pain-Pain is closed. The Tim Hortons outlets carry the « Bakery » category and 555–741 Google reviews each (D-11): prominence without being a bakery in the usual sense. The shop's copied category is « Pastry shop » only (D-12) |
| gâteau d'anniversaire Granby | D-2, D-4; 05 X3 | TBR's three cake shops. The shop's RestoMontreal page was link 1 for X3 (05) | Cake Design Granby; Avec un Grand A; Rose Gâteaux; IGA and Maître Glacier for supermarket and ice-cream cakes | Autocomplete names Cake Design, Rose Gâteaux and IGA (§5). Maître Glacier is at 4.8 (772) on D-4. TBR's three hold 116–118/120 (D-2) |
| gâteau personnalisé Granby | D-2; 05 X4 | TBR's « pâtisseries » list came first (05 X4) | Cake Design Granby; Avec un Grand A; Rose Gâteaux; IGA (Marché Gazaille lists personalised cakes, 03) | « gâteau personnalisé granby » completes to « cake design granby » and « gâteau personnalisé iga granby » (§5) |
| croissant Granby | none (no croissant list anywhere); 05 X7 | The shop's RestoMontreal page (05 X7, X8) | The downtown bakery-cafés (La Mie Bretonne, Pâtisserie Cocovanille, Café ORÉE, Mont Rose) and Tim Hortons | No page or list for croissants in Granby (05 X7). Autocomplete has only « meilleur croissant granby » (§5). Weak evidence for any name |
| café centre-ville Granby | D-3, D-4, D-7; 05 X12 | TBR: Brûlerie, Tim Hortons, Starbucks. RestoMontreal: Café ORÉE, Mélisse, Caféine & co, La Mie Bretonne, Mont Rose, Brûlerie, Van Houtte (05 X12) | Caféine & co; Café ORÉE; Café de la Brûlerie; Mont Rose; La Mie Bretonne | Caféine & co: 283 Google reviews, 29 m from the shop. Brûlerie: 1,794 reviews at 736 m, TBR's #1 café (D-3, D-5). The shop's copied category is not « café » (D-12) |
| pâtisserie près du Zoo de Granby | none; 05 L5 (Tourisme Cantons-de-l'Est's terrace article names Brûlerie and Caféine & co) | — | Next to the Zoo: the Tim Hortons at 575 rue Saint-Hubert (Google 3.6 (741), « Bakery » among its categories, D-11) and the IGA Marché St-Pierre et Fils at 585 rue Saint-Hubert (03), about 390 m from the Zoo's P1 lot (computed). Downtown is 2.2 km away in a straight line (20c Z-8) | When a query names the Zoo, distance is most likely measured from the Zoo (inference from Google's distance factor). No autocomplete for any Zoo + pâtisserie or bakery prefix (§5) |
| pâtisserie marocaine Granby; msemmen / msemen Granby; harcha Granby | none; D-8 lists 0 | — | Unknown. With no Moroccan-labelled business in Granby, Google may show generic pâtisseries or Montréal-area Moroccan bakeries (inference) | §2. The shop's own post is the only Granby evidence of these products (20b S-13) |
| bakery Granby Quebec | D-1 (EN); 05 C8; Uber Eats « bakery Granby » (03) | TBR EN: the shop alone. Uber Eats: Tim Hortons, Mont Rose, Mr. Puffs (03) | Tim Hortons outlets; Pâtisserie Cocovanille; La Mie Bretonne; Mont Rose | English autocomplete drifts to the US Granby (CT, CO, MA) and « julien's bakery granby ct » (§5). The « Quebec » variant matters (05 W44) |
| cake Granby Quebec | D-2 (EN) | Avec un Grand A, Cake Design, Rose Gâteaux | Cake Design Granby (« Cake Design Cupcakerie »); Avec un Grand A; Rose Gâteaux | « cake granby » completes to « cake design granby », « cake design cupcakerie granby » and « cake shop granby » (§5) |

---

## 2. The Moroccan / Maghreb niche

### 2.1 Who else sells it

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| M-1 | **The shop publishes « Spécialités marocaines : msemmens, harchas et autres gourmandises »** (pinned post, 2026-08-25) | verified (owner) | research/20b S-13; https://www.instagram.com/p/Dcd6Ks4O-G5/ | 2026-10-29 (20b) |
| M-2 | **No other seller of msemmen, msemen, harcha, chebakia, cornes de gazelle or baklava surfaced** in Granby, the Haute-Yamaska (Waterloo included), Bromont, Saint-Hyacinthe or Cowansville. Checked: five queries in French and English (§8, queries 4–7 and 12) and two directory lists (D-6, D-8) | unverified (absence of evidence) | search (§8) | 2026-10-29 |
| M-3 | **Nearest documented Moroccan bakery: Boulangerie Maison Dorée, Saint-Hubert (Longueuil).** Its reviews mention msemen and harcha; the listing describes Moroccan breads, msemen, harchas and pastries | unverified (search summary) | restomontreal.ca resto 18690 | 2026-10-29 |
| M-4 | **Nearest Maghreb restaurants: Sherbrooke.** La Rose des Sables (Tunisian, Moroccan and Algerian; « Apportez votre vin ») and Baladi (Moroccan and grills; Google 4.5 per the summary). In Granby, RestoMontreal's Moroccan page is empty (D-8); none surfaced in Saint-Hyacinthe or Bromont | unverified (search summary) | restomontreal.ca resto 5648 and 19506; « marocains-granby » | 2026-10-29 |
| M-5 | **One Middle-Eastern restaurant in Granby: Mr Ghanoush, 344 rue Principale** (listed on Uber Eats), 583 m from the shop (computed). Nothing shows Maghreb pastries there | unverified (search summary; distance computed) | ubereats.com (via summary); Nominatim | 2026-10-29 |
| M-6 | **No Maghreb, halal or international grocer found in Granby** (two queries). An Uber Eats page for « Épicerie Africain Kamia » surfaced, but it refused the read (403), so its town is unknown | unverified (absence of evidence) | search (§8, queries 5 and 12) | 2026-10-29 |

### 2.2 Census 2021 (Statistics Canada)

Figures for Granby (V), census subdivision 2447017, and for the Granby census agglomeration (code 450), as read from Statistics Canada's Census Profile API on 2026-10-29. The API gives two release dates: 2022-08-17 for language, 2022-10-26 for immigration and ethnocultural data.

Three cautions:
- Statistics Canada rounds counts randomly to a multiple of 5.
- Ethnic-origin rows count responses, and one person may give several.
- The shares are computed here.

| # | Characteristic | Granby (city) | Granby (CA) | Base (city) | Share (city, computed) | Label |
|---|---|---|---|---|---|---|
| K-1 | Population, 2021 | 69,025 | 90,833 | — | — | verified (official) |
| K-2 | Mother tongue: Arabic (single responses) | 400 | 430 | 67,725 (total population excluding institutional residents; 100 % data) | 0.6 % | verified (official) |
| K-3 | Language spoken most often at home: Arabic | 200 | 210 | 67,725 | 0.3 % | verified (official) |
| K-4 | Knowledge of languages: Arabic | 555 | 590 | 66,590 (private households; 25 % sample) | 0.8 % | verified (official) |
| K-5 | Mother tongue: Berber languages (Kabyle: 25) | 30 | 30 | 67,725 | < 0.1 % | verified (official) |
| K-6 | Ethnic or cultural origin: Moroccan | 150 | 160 | 66,590 (25 % sample) | 0.2 % | verified (official) |
| K-7 | Ethnic or cultural origin: Algerian 65, Tunisian 80, Berber 55, North African n.o.s. 20 (city; CA: 70, 80, 65, 20) | 220 responses | 235 responses | 66,590 | — | verified (official); a sum of responses, not of people |
| K-8 | Place of birth of immigrants: Morocco | 115 | 115 | 3,550 immigrants (city) | 3.2 % of immigrants | verified (official) |
| K-9 | Place of birth of immigrants: Algeria; recent immigrants (2016–2021) born in Morocco, Algeria, Tunisia | Algeria 130; recent: 35, 40, 10 | Algeria 140 | 3,550; 820 recent | — | verified (official) |
| K-10 | For scale: immigrants born in Colombia | 535 | 590 | 3,550 | 15.1 % of immigrants | verified (official); confirms the press figure research/04 §0.8 used |
| K-11 | Knowledge of official languages: neither English nor French (all languages together) | 290 | 345 | 67,725 | 0.4 % | verified (official) |

Reading:
- The Arabic-speaking and Maghreb-origin population is real and small: about 400 mother-tongue speakers in a city of 69,000. Moroccan origin and Moroccan birth are each below 0.25 % of residents.
- Most of it already speaks French. That is an inference from K-11: only 290 people in the city know neither English nor French, all languages together.
- → **No Arabic pages.** That agrees with docs/00 and plan-v0b, where a language is added only on proven demand. The shop's own French wording (« msemmens », « harchas ») is enough, and these specialities are for every customer, not for one community.

---

## 3. Coffee with seating within about 500 m of 3, rue Court

Distances are straight lines from the shop's point to Nominatim's position for the published address (computed, unverified).

| # | Place | Address | Distance | Seating (evidence) | Hours seen | Google rating (copy) | Label | Source | Seen |
|---|---|---|---|---|---|---|---|---|---|
| C-1 | **Caféine & co** (« rue Principale ») | 139, rue Principale | **29 m** | « Dine in », « Outdoor seating », « Wi-Fi » | « Open until 5PM » on the day read (a Thursday) | 4.7 (283); RestoMontreal 4.8 (131) | unverified (third-party copies) | restaurantguru.com/Cafeine-and-co-rue-Principale-Granby; D-7 | 2026-10-29 |
| C-2 | **Café ORÉE Pâtisserie** | 142, rue Principale | **52 m** | A seasonal terrace; « a serene, light-filled space » | Closed Sunday; « Open until 7PM » on the day read | 4.8 (56); about 4.9 (80+) per RestoMontreal (05 X12) | unverified | restaurantguru.com/Cafe-OREE-Patisserie-Granby; restomontreal.ca resto 23173 (summary) | 2026-10-29 |
| C-3 | **La Mie Bretonne** (Granby) | 189, rue Principale; (450) 361-8881 | 121 m | « a bakery with a café component », wheelchair accessible, crêpes bretonnes | Closed Monday; Sunday until 14 h | RestoMontreal 4.2 (05 X12) | unverified (search summary) | restomontreal.ca resto 23177 (summary) | 2026-10-29 |
| C-4 | **Les Finfinettes** | 24, rue Johnson, J2G 6T1 | 124 m | « un café, un café céramique, un atelier de poterie »; amenities « Salle à manger », « Terrasse »; « une programmation d'ateliers créatifs » | None shown | — | unverified (one source) | quebecvacances.com/fr/attractions/les-finfinettes | 2026-10-29 |
| C-5 | **Mont Rose Pâtisserie & Café** | 190, rue Principale; (579) 365-3444 | 168 m | A café with pastries and crêpes; seating not stated | 11 h–22 h on Monday, 10 h–20 h on Sunday (summary); 10 h–23 h daily in another copy (05 L4) | 4.6 (70+) (03, October 2026 copy) | unverified | restomontreal.ca resto 23174 (summary); research/03 | 2026-10-29 |
| C-6 | C'est Belge (a breakfast restaurant, not a café) | 102, rue Principale | 185 m | A restaurant | « Open until 2:30PM » on the day read | 4.7 (1,007) | unverified | Wanderlog breakfast list; D-4 | 2026-10-29 |
| C-7 | Café Ork'n'Roll (a board-game café, 03) | Downtown; address not verified | — | — | Events in October and November | — | unverified | granbyregion.com/evenements/ (« Centre-Ville Granby ») | 2026-10-29 |
| C-8 | Mélisse Pâtisserie | 301, rue Notre-Dame | 486 m | Not stated | — | 4.8 (20); RestoMontreal shows « peut-être temporairement fermée » (2026-07-15 copy, 03) | unverified | D-5; research/03 | 2026-10-29 |
| C-9 | Presse Café | 116, rue Principale | 148 m | — | — | — | unverified: only an OSM point last edited 2016-09-13, and no current source, so not counted | OSM API | 2026-10-29 |
| C-10 | *Just outside:* **Café de la Brûlerie** | 4, rue de la Gare | 736 m | Terrace, wheelchair accessible, Wi-Fi; « Since 2003 » | Mon–Tue 8–16; Wed and Sun 8–21; Thu–Sat 8–22 (TBR) | 4.4 (1,794) (RG); 4.4 (1,766) (Wanderlog); TBR's #1 café, 120/120 | unverified (copies); the TBR rank is verified (observed) | D-3, D-5, D-11 | 2026-10-29 |
| C-11 | *Outside:* Café Van Houtte; Starbucks; Tim Hortons | 605 and 1035, rue Principale; several others | 1.7 km and more | — | — | Van Houtte 4.4 (300) | unverified | D-3, D-11 | 2026-10-29 |

Also seen:
- **OpenStreetMap is stale downtown** (verified, observed). In a box of about 1.4 × 1.4 km around the shop it maps only five café or bakery points:
  - Madame Hortense (141 rue Principale), Tartes et Clafoutis (189) and Presse Café (116), all last edited 2016-09-13
  - « Caféine & Co » at 301 rue Notre-Dame, edited 2019, where Mélisse now is
  - Café de la Brûlerie, edited 2025

  It has no point for Café ORÉE, Mont Rose, La Mie Bretonne, Les Finfinettes or the shop. 20c S-4 already suggests adding the shop, with the owner's OK.
- **The shop's hours against the ring.** The shop closes Monday and Tuesday. Mont Rose shows Monday hours, and La Mie Bretonne closes only on Monday (C-3, C-5; summaries). On those days, a downtown café customer goes elsewhere.
- **Les Finfinettes runs a café with creative workshops 124 m away.** This confirms 20b S-25: the shop's workshops cannot be called « une première à Granby ».

---

## 4. The Zoo de Granby and the events that bring people downtown

### 4.1 The Zoo (official)

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| Z-1 | **2025 attendance: « Achalandage total 665 578 personnes ».** That is 615,356 regular visitors (winter 61,612; summer 514,661; autumn 39,083) and 50,222 others (workshops, day camp, events…). Also 30,323 subscriptions and 126,441 subscriber visits | verified (official) | Zoo de Granby, Rapport annuel 2025 (PDF, 43 pages, created 2026-04-08) | 2026-10-29 |
| Z-2 | The release of the annual general meeting, 2026-04-29, repeats « plus de 665 000 visiteurs » for 2025 | verified (official) | zoodegranby.com, release « Le Zoo de Granby tient son assemblée générale annuelle 2025 » | 2026-10-29 |
| Z-3 | Summer 2025: « plus de 500 000 visiteurs », « une hausse de 15 % par rapport à l'an dernier » (release of 2025-09-17). Autumn 2025 ran on weekends from 6 September to 2 November 2025 | verified (official) | zoodegranby.com, release « Une saison estivale couronnée de succès au Zoo de Granby! » | 2026-10-29 |
| Z-4 | **2026 season: « Ouvert 7 jours sur 7 dès le 16 mai 2026 (8 juin pour le parc aquatique Amazoo) ».** Amazoo's rebuilt family zone, Booshikë (a 5 M$ investment), opened on 20 June 2026 | verified (official) | zoodegranby.com, release « Un été renversant s'annonce au Zoo de Granby » (2026-05-11) | 2026-10-29 |
| Z-5 | **Autumn 2026:** Halloween « tous les week-ends du 3 octobre au 1er novembre 2026 », and Monday 12 October (Thanksgiving). The schedule's data file marks 31 October and 1 November open (animal park from 10:00, rides from 12:00; closing stored as 17:00) and the park closed from 2 November | verified (official) | zoodegranby.com, release of 2026-09-28; zoodegranby.com/horaire and its data file | 2026-10-29 |
| Z-6 | **The end of the 2026 daily summer season and Amazoo's 2026 closing date are not on the pages read** | not found | zoodegranby.com/horaire; /parc-aquatique-amazoo | 2026-10-29 |
| Z-7 | **Winter:** the winter page still shows 2025–2026: « À partir du 26 décembre », « Ouvert tous les week-ends jusqu'au 29 mars 2026 », and spring break « Ouvert tous les jours du 28 février au 8 mars 2026 ». The winter/spring pass ran from 26 December 2025 to 10 May 2026, 10:00–16:00. **Winter 2026–2027 is not announced** | verified (official, for 2025–2026) | zoodegranby.com/parc-animalier/hiver; /en/animal-park/winter | 2026-10-29 |
| Z-8 | **2027: no date is published**: no page or release names one, and a search found none. The schedule's data file holds unlabelled 2027 timestamps (for example 2027-05-15 and 2027-09-06) that look like next year's season boundaries. They are not published as dates, so they are not used | unverified (absence of evidence; the timestamps are not interpreted) | zoodegranby.com/horaire data file; search (§8, query 13) | 2026-10-29 |
| Z-9 | Visitor address and the free P1 lot; the drive to the shop is « environ 5 à 8 minutes en auto (3 à 4 km) » | verified (20c) | research/20c Z-1, Z-3, Z-8 | 2026-10-29 (20c) |
| Z-10 | **Food next to the Zoo:** the IGA Marché St-Pierre et Fils, 585 rue Saint-Hubert (03), about 390 m from P1 (computed). A Tim Hortons at 575 rue Saint-Hubert (Wanderlog: Google 3.6 (741); categories « Coffee shop; Bakery; Breakfast restaurant; Cafe »), next to the IGA by street number (inference) | unverified | research/03 §2; Wanderlog breakfast list; Nominatim | 2026-10-29 |

### 4.2 Events (official for 2026; nothing published for 2027)

| # | Event | Dates | Where (distance from the shop, computed) | Label | Source | Seen |
|---|---|---|---|---|---|---|
| E-1 | **Festival international de la chanson de Granby (FICG58)** | **13–23 August 2026** (« Vitrines musicales » 20–23 August) | **Palace de Granby, 135 rue Principale (42 m):** 6 ticketed events, including semi-finals 1 to 4 and the final; also its outdoor courtyard (2 events) and the Foyer Yves-Gagnon (1). Église St-George (4); the Marché public (2); Louis' Pub (5) and restaurant Alegria (4), both free. The City's calendar puts 14–15 August at the Victoria lot (« Stationnement Victoria »), which is next to the Palace (20c P-11) | verified (official; Québec Vacances and festapp give the same dates) | ficg.qc.ca; ficg.qc.ca/programmation-complete/; City 2026 calendar | 2026-10-29 |
| E-2 | FICG 2027 | **Not announced** (« Dates à venir » on Québec Vacances) | — | unverified (absence of evidence; search summary) | search (§8, query 14) | 2026-10-29 |
| E-3 | **Marché public de Granby et région** | Saturdays 2 May – 7 November (9 h–14 h); Thursday evenings 18 June – 27 August. No holiday market and no 2027 season on the page | Place du Marché, 176 rue Principale (134 m) | verified: the market's page, and the City's calendar « Saison 2026 » (« Marché public, tous les samedis de 9 h à 14 h à la place du Marché »). This settles the year that 20a and 20b had to infer | marchepublicgranby.ca; City 2026 calendar | 2026-10-29 |
| E-4 | **Défilé de Noël de Granby** | **Saturday 5 December 2026, « départ à 16 h »** | « Rue Principale », « au centre-ville »; the route is not yet published (« La programmation détaillée … sera dévoilée prochainement »). The shop is 35 m from rue Principale (20c) | verified (the organiser and the City) | vccgranby.org/defiledenoel; granby.ca/fr/calendrier-evenements (erratum « samedi 5 décembre 2026 »; the City's April PDF said 6 December) | 2026-10-29 |
| E-5 | Oasis de la rue Principale | 10–11 July 2026 | « Rue Principale et place du Marché » (the calendar's colour key) | verified (official) | City 2026 calendar (PDF, created 2026-04-14) | 2026-10-29 |
| E-6 | Les Folies gourmandes; Les Journées de la culture | 25–26 September 2026; 25–27 September 2026 | Rue Principale and place du Marché (colour key) | verified (official) | City 2026 calendar | 2026-10-29 |
| E-7 | Salon du livre de Granby | 28–30 May 2026 | Centre Notre-Dame, 270 rue Principale (425 m) | verified (official) | City 2026 calendar | 2026-10-29 |
| E-8 | Critérium (cycling); La Grande Marche de Granby | 25 July 2026; 17 October 2026 | Place Jean-Lapierre (corner of rue Saint-Antoine and rue Principale) | verified (official) | City 2026 calendar | 2026-10-29 |
| E-9 | Other 2026 events, not downtown | Grand Défi 24 May; Festival au Lac 4–6 June; Fête nationale 24 June; Championnats Banque Nationale (tennis) 12–19 July; Granby International and Symposium Couleurs urbaines 31 July – 2 August; Festival du sport d'été 22 August; International de soccer 5–7 September; L'Estriade la nuit 12 September; Marathon 4 October | Parks (colour key) | verified (official) | City 2026 calendar | 2026-10-29 |
| E-10 | Coming up downtown (no year printed) | Centre Notre-Dame concerts on 15 November, 12 December and 13 December. Downtown venues listed for October–November: the Palace, the Marché public, Café Ork'n'Roll, Les Finfinettes | Centre-ville | unverified (no year printed) | granbyregion.com/evenements/ | 2026-10-29 |
| E-11 | Semaine québécoise des rencontres interculturelles | 2–8 November 2026 (programme not shown) | — | verified (official) | granby.ca/fr | 2026-10-29 |
| E-12 | **2027: no date** from the City (its calendar covers 2026 only), the FICG, the Zoo or the Marché public | — | — | unverified (absence of evidence) | the pages above | 2026-10-29 |
| E-13 | Holiday parking: time limits lifted in four municipal lots from 7 December 2026 to 3 January 2027 | — | — | verified (20c) | research/20c P-13 | 2026-10-29 (20c) |

Reading:
- The Palace (42 m) and the Victoria lot make the FICG the one event that literally fills the street at the door.
- The parade (5 December, 16 h, rue Principale) falls on a Saturday, when the shop is open until 17:30; whether it passes rue Court is not yet published.
- None of these is a search battle. They are dated reasons for a Google post, for the hours to be right, and for photos.

---

## 5. Demand signals without paid tools: Google autocomplete

Method: see the limits at the top. WebFetch read the first seed (« pâtisserie granby », hl=fr) and returned the same ten suggestions as the raw call. The other calls were made with curl and Python: 60 raw calls, 15:15–15:18 UTC, 1.5 s apart. **The endpoint answered every call; nothing was refused.** « (none) » means an empty list. Spelling is as returned (Google drops accents in some suggestions). « seed » rows are the step's list; « variant » rows are shorter prefixes or related terms, added because several seeds returned nothing.

| Kind | Typed | hl=fr, gl=ca | hl=en, gl=ca |
|---|---|---|---|
| seed | « pâtisserie granby » | « pâtisserie granby » · « pâtisserie granby rue principale » · « pâtisserie granby ouvert actuellement » · « patisserie granby gateau » · « pâtisserie granby rue court » · « patisserie granby trompe l oeil » · « patisserie granby rue denison » · « dessert granby » · « nouvelle patisserie granby » · « boulangerie patisserie granby » | « pâtisserie granby » · « pâtisserie granby rue principale » · « pâtisserie granby ouvert actuellement » · « patisserie granby gateau » · « patisserie granby trompe l oeil » · « dessert granby street leicester » · « dessert granby street » · « dessert granby ct » · « café orée pâtisserie granby reviews » · « dessert granby » |
| seed | « boulangerie granby » | « boulangerie granby » · « boulangerie granby ouvert actuellement » · « boulangerie granby rue principale » · « boulanger granby » · « nouvelle boulangerie granby » · « boulangerie artisanale granby » · « boulangerie patisserie granby » · « boulangerie racine granby » · « meilleure boulangerie granby » · « emploi boulangerie granby » | « boulangerie granby » · « boulangerie granby ouvert actuellement » · « boulangerie granby rue principale » · « nouvelle boulangerie granby » · « boulangerie artisanale granby » · « boulangerie patisserie granby » · « boulangerie racine granby » · « meilleure boulangerie granby » · « emploi boulangerie granby » · « café boulangerie granby » |
| seed | « gâteau d'anniversaire granby » | « gateau d anniversaire granby » | « gateau d'anniversaire granby » |
| seed | « gâteau personnalisé granby » | « gateau personnalisé granby » · « cake design granby » · « gâteau personnalisé iga granby » | « gateau personnalisé granby » · « gâteau personnalisé granby » · « cake design granby » · « gateau sur mesure granby » |
| seed | « croissant granby » | « croissant granby » · « meilleur croissant granby » | « croissant granby » · « meilleur croissant granby » · « croissant butter ratio » · « butter for croissant dough » · « croissant benefits » · « croissants are they healthy » |
| seed | « café centre-ville granby » | « restaurant centre ville granby » | « restaurant centre ville granby » |
| seed | « pâtisserie près du zoo de granby » | (none) | (none) |
| seed | « pâtisserie marocaine granby » | (none) | (none) |
| seed | « msemmen granby » | (none) | (none) |
| seed | « msemen granby » | (none) | (none) |
| seed | « harcha granby » | (none) | (none) |
| seed | « bakery granby quebec » | (none) | (none) |
| seed | « cake granby quebec » | (none) | (none) |
| variant | « bakery granby » | « bakery granby » · « bakery granby ct » · « bakery granby co » · « bakery granby ma » · « bakery granby street » · « bakery granby street norfolk va » · « patisserie granby » · « boulangerie granby » · « dessert granby » · « pâtisserie granby rue principale » | « bakery granby » · « bakery granby ct » · « bakery granby co » · « bakery granby ma » · « bakery granby street » · « bakery granby street norfolk va » · « julien's bakery granby ct » · « julien's bakery granby » · « rollin bakery granby » · « julien's bakery granby ct opening date » |
| variant | « granby bakery » | « granby bakery » · « granby bakery ct » · « granny bakery » · « granny bakery valencia » · « granny's bakery photos » · « granny's bakery delivery sims 4 » · « julien's bakery granby ct » · « granny's bakery reviews » · « granny's bakery celina » · « granny's bakery menu » | « granby bakery » · « granby bakery ct » · « bakery granby co » · « bakery granby ma » · « bakery granby street » · « bakery granby street norfolk va » · « east granby bakery » · « juliens granby bakery » · « granby french bakery » · « granby farm bakery » |
| variant | « cake granby » | « cake granby » · « gateau granby » · « dessert granby » · « cupcakes granby » · « cake design granby » · « cake pop granby » · « cake design cupcakerie granby » · « cupcakes granby ct » | « cake granby » · « cakes granby co » · « cake gypsy granby ct » · « pink cake granby » · « cake gypsy granby » · « cake shop granby » · « cake design cupcakerie granny photos » · « cake design cupcakerie granby » · « cake design granby » · « cake pop granby » |
| variant | « birthday cake granby » | « birthday cake granny » · « birthday cake granny square » | (none) |
| variant | « café granby » | « café granby » · « café granby rue principale » · « café granby rue guy » · « cafe co granby » · « cafe granby bulle » · « restaurant granby livraison » · « restaurant granby » · « restaurant granby apportez votre vin » · « restaurant granby rue principale » · « restaurant granby familiale » | « café granby » · « cafe granby ct » · « cafe granby street leicester » · « cafe granby co » · « cafe granby street » · « cafe granby street ilkeston » · « cafe granby mo » · « café granby rue principale » · « granby cafe bakewell » · « granby café menu » |
| variant | « coffee granby » | « coffee granby » · « coffee granby co » · « coffee granby ct » · « coffee granby street » · « coffee granby ma » · « coffee granby street leicester » · « coffee granby mo » · « best coffee granby » · « granby coffee shops » · « coffee shops granby colorado » | « coffee granby » · « coffee granby co » · « coffee granby ct » · « coffee granby street » · « coffee granby ma » · « coffee granby street leicester » · « coffee granby mo » · « granby coffee shops » · « granby coffee table » · « coffee shop granby ct » |
| variant | « gâteau granby » | « gâteau granby » · « dessert granby » · « gâteau anniversaire granby » · « rose gateau granby » · « gateau fete granby » · « gateau personnalisé granby » · « gateau iga granby » · « gateau fromage granby » · « choco gateau granby » · « gateau mariage granby » | « gâteau granby » · « gateau granby » · « dessert granby street leicester » · « dessert granby street » · « dessert granby ct » · « dessert granby » · « gâteau anniversaire granby » · « rose gateau granby » · « gateau fete granby » · « gateau personnalisé granby » |
| variant | « gâteau anniversaire granby » | « gâteau anniversaire granby » · « gateau fete granby » | « gâteau anniversaire granby » · « gateau fete granby » · « gateau d'anniversaire granby » |
| variant | « pâtisserie zoo de granby » | (none) | (none) |
| variant | « granby zoo bakery » | (none) | (none) |
| variant | « pâtisserie marocaine » | « pâtisserie marocaine » · « pâtisserie marocaine montréal » · « pâtisserie marocaine traditionnelle » · « pâtisserie marocaine corne de gazelle » · « pâtisserie marocaine laval » · « pâtisserie marocaine brossard » · « pâtisserie marocaine nom » · « pâtisserie marocaine autour de moi » · « pâtisserie marocaine casablanca » · « pâtisserie marocaine liste » | « pâtisserie marocaine » · « patisserie marocaine near me » · « patisserie marocaine casablanca » · « patisserie marocaine paris » · « pâtisserie marocaine facile et rapide » · « pâtisserie marocaine nom » · « pâtisserie marocaine liste » · « pâtisserie marocaine marrakech » · « patisserie marocaine toulouse » · « patisserie marocaine montreal » |
| variant | « msemmen » | « msemmens marocain recette » · « msemmen ricetta » · « msemmens marocain farci » · « msemmen in london » · « msemmens marocain recette thermomix » · « msemmens ou crêpes feuilletées marocaines » · « msemmen ricetta originale » · « msemmens farci » · « msemmen ripieno ricetta » · « msemmens facile » | « msemmens marocain recette » · « msemmen ricetta » · « msemmen in london » · « msemmen ripieno ricetta » · « msemmen calorieën » · « msemmen in tunisia » · « msemen pronunciation » · « msemmen fetta » · « msemmen met » · « msemmen ripieno di verdure » |
| variant | « msemen » | « msemen » · « msemen marocain » · « msemen recette » · « msemen montreal » · « msemen recette marocaine » · « msemen farci » · « msemen origine » · « msemen calories » · « msemen algerien » · « msemen vieux port » | « msemen » · « msemen recipe » · « msemen morocco » · « msemen montreal » · « msemen marocain » · « msemen near me » · « msemen casablanca » · « msemen bread » · « msemen calories » · « msemen recette » |
| variant | « harcha » | « harcha » · « harcha marocaine » · « harcha recette » · « harcha thermomix » · « harcha calories » · « harcha choumicha » · « horchata » · « harcha au four » · « archambault » · « archambault laval » | « harcharan singh brar » · « harcha » · « harchand singh longowal » · « harchat 2026 » · « harcharan singh longowal » · « harcharan singh bhullar » · « horchata » · « harcharan grewal » · « harcha recipe » · « harcharan brar » |
| variant | « épicerie marocaine granby » | « epicerie marocaine granby » | « epicerie marocaine granby » |
| variant | « coco vanille granby » | « coco vanille granby » · « pâtisserie coco vanille granby » | « coco vanille granby » · « pâtisserie coco vanille granby » · « coco lopez vs coco goya » · « goya cream of coconut vs coco lopez » · « coco vanilla location » |
| variant | « cocovanille » | « coco vanille » · « coco vanille mancera » · « coco vanille granby » · « coco vanille chambly » · « cocovanille roanne » · « coco vanille parfum » · « coco vanille institut » · « coco vanille homme » · « coco vanille collection privée » · « coco vanille bijoux » | « cocovanille » · « cocovanille roanne » |

Readings (autocomplete, not volume; every reading below is unverified):
- **The shop's name is a known query.** « coco vanille granby » completes to « pâtisserie coco vanille granby » in both languages, and « cocovanille » (FR) completes to « coco vanille granby », right after the Mancera perfume.
  - Two names nobody has explained share the brand: « coco vanille chambly » and « coco vanille institut ». A search found nothing for Chambly (§8, query 11). Watch them as possible collisions.
- **People search by street:**
  - « pâtisserie granby rue court » points to the shop's street (FR). The only other pâtisserie on record on rue Court is the unconfirmed Hygge Factory listing at no. 17 (20c S-1), so this reading is an inference.
  - « … rue principale »: Mont Rose, Café ORÉE and La Mie Bretonne are on rue Principale.
  - « … rue denison »: Cake Design Granby, 194 rue Denison Est (inference).
- **Some products are tied to rivals:**
  - « patisserie granby trompe l oeil »: RestoMontreal says Mont Rose is « reconnu pour ses pâtisseries en trompe-l'œil », and a Google review on Restaurant Guru praises Café ORÉE's « mango and lemon trompe l'oeil ».
  - Cakes are brand-led: « cake design granby », « cake design cupcakerie granby », « rose gateau granby », « gâteau personnalisé iga granby », « gateau iga granby ».
- **Freshness.** « pâtisserie granby ouvert actuellement » and « boulangerie granby ouvert actuellement » are what hours that are right everywhere answer (docs/19 coup n° 1).
- **Both birthday words are typed:** « gateau d anniversaire granby », « gâteau anniversaire granby » and « gateau fete granby ». This supports research/04 §3.1 (use both).
- **Referents not identified:** « nouvelle patisserie granby », « nouvelle boulangerie granby », « boulangerie racine granby », « café granby rue guy » and « cafe granby bulle ». One search found nothing (§8, query 10). RestoMontreal has a page « Boulangerie artisanale Le Moulin à Pain » in Granby, with no address seen (D-7). → To check on Google Maps from Granby.
- **Nothing for the Zoo**, in any of the three Zoo phrasings. **Nothing for the Moroccan seeds either.** « épicerie marocaine granby » comes back as itself only.
  - The completions of « msemen » and « pâtisserie marocaine » point to Montréal, Laval, Brossard and the Vieux-Port: that is where the demand sits.
  - The one-m spelling « msemen » carries the place completions (« msemen montreal », « msemen near me »); « msemmen » completes mostly to recipes and Italian pages.
- **English means another Granby.**
  - « bakery granby », « granby bakery », « coffee granby » and « cafe granby » complete to Granby CT, CO, MA and MO, and to Granby Street (Leicester; Norfolk, VA).
  - « bakery granby quebec » and « cake granby quebec » return nothing.
  - This confirms research/05's rule: English pages always say « Quebec ».

---

## 6. What changes in which doc (hand-off; this step edits no other file)

| Where | Was | Now |
|---|---|---|
| docs/19 §1.3, §4 coup n° 2, §6.2 | Three Best Rated ranks the closed Pain-Pain 1st and Coco Vanille 2nd. The plan was to send a correction with the closure articles | The TBR bakery page lists only Coco Vanille (D-1). Coup n° 2 shrinks to one correction (Sunday 9:00 → 9:30), then watching C8, X2 and B2 until the answers drop the old snapshot. The cake list's order is now Avec un Grand A, Cake Design, Rose Gâteaux (D-2) |
| docs/19 §1.3 (rivals) | Café ORÉE, Mont Rose and Mélisse as the walk-in rivals | Add four café rivals: Caféine & co (139 rue Principale, 29 m; Google 4.7 (283)), Les Finfinettes (café and workshops, 124 m), La Mie Bretonne (bread and café, 121 m) and Café de la Brûlerie (TBR's #1 café; 1,794 reviews). Note that the Tim Hortons outlets carry the Google category « Bakery » (D-11) |
| docs/19 §6.2; docs/06 §3 | No TBR café row | Add « 3 Best Cafes in Granby » (D-3), where the shop is absent. Ask for inclusion (modèle F) only once the café category is right on Google (D-12) |
| docs/06 §3, priority 3, « Restaurant Guru » | « Non trouvée » | The listing exists: « Patisserie Coco Vanille », 3 Rue Court, 450-372-7177, no hours, no Google rating, updated 2026-09-05; 17th in « desserts in Granby » (D-4, D-5). Correction to request: the hours of the master record |
| docs/06 §3, PagesJaunes | Remove « Inc »; keep 450-372-7177 | Also check the listing's heading: the shop does not appear under « Pâtisseries » for Granby (D-6) |
| docs/05 §2 rows 4–5 (categories) | Primary category to choose; « café » and « boulangerie » as secondary categories if Google offers them | The Google copy shows « Pastry shop » only (D-12). X2 and X12 need the secondary categories « Bakery » and « Cafe », if Google's list offers them; both are true, per the shop's own post (20b S-1). The rule is unchanged: never a category for an unconfirmed product |
| docs/05 §2 row 17 (products); docs/17 (pages); the menu | No Moroccan specialities on the menu | « Msemmens » and « harchas » as products and as a short section of /carte/ or /patisseries/, in the shop's words, once the owner confirms the days and prices. One FAQ, « Où trouver des msemmens ou des harchas à Granby? », only if it is true. Never a separate page per spelling (that would be a doorway). Never « halal » unless the owner says it (20b N-17) |
| research/04 §6.2; data/seasonal-calendar.csv | FICG 2026 from festapp (unverified); the Zoo season was a [[FACT NEEDED]] | FICG58: 13–23 August 2026 (official, E-1). Zoo: daily from 16 May, Amazoo from 8 June, closing 1 November 2026 (Z-4, Z-5). Défilé de Noël: 5 December 2026, 16 h (E-4). Oasis 10–11 July; Folies gourmandes 25–26 September (E-5, E-6). 2027 stays [[FACT NEEDED]] for the Zoo, the FICG and the Marché |
| research/04 §8, V5 and V6 | Autocomplete and calendar not harvested | V5 partly done: autocomplete from a US location with gl=ca (§5); the « People also ask » harvest still needs Granby. V6 partly done (§4) |
| research/04 §0.8 | 535 Colombian-born residents (from the press) | Statistics Canada confirms 535 (K-10) |
| docs/14 (content calendar); docs/05 §4 (posts) | — | Dated hooks: the last Marché Saturdays (31 October and 7 November 2026), the parade (5 December, 16 h), and holiday parking (7 December – 3 January) |
| research/20c S-1; 14 S3 | Hygge Factory at 17 rue Court: unverified | Autocomplete suggests « pâtisserie granby rue court »: one more reason to settle what is at no. 17 |

---

## 7. Open items (routed)

**Phone in Granby** (14 D1), 20–30 minutes:
1. The local pack and Maps results for the ten queries of §1.2, with each pack holder's exact name, category and review count. This closes docs/19 §7.2 (« nom exact de chaque concurrent dans Google Maps »).
2. What the unidentified suggestions refer to (§5): « boulangerie racine », « nouvelle boulangerie », « nouvelle pâtisserie », « café … rue guy », « cafe … bulle », « coco vanille chambly », « coco vanille institut ».
3. Whether Mélisse is open (D-5 shows recent updates; RestoMontreal flags it), and what is at 17 rue Court (20c S-1).

**Owner** (one line each):

4. Msemmens and harchas: which days, the prices, and the spelling to use on the menu (M-1). « Halal » only if the owner says so.
5. The Google categories now on the listing, primary and secondary (D-12; docs/05 rows 4–5).

**Agency**, dated re-checks:

6. The Zoo's 2027 season and winter 2026–2027 (Z-7, Z-8). Look again in December 2026, then in April 2027.
7. The FICG's 2027 dates (E-2), the Marché public's 2027 season (E-3) and the City's 2027 calendar (E-12): April 2027.
8. Three Best Rated: Sunday 9:30 (D-1), then the inclusion requests for the cake and café lists, with docs/06's templates.

---

## 8. Search log

### WebSearch (15 queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Filter | Useful result |
|---|---|---|---|
| 1 | best bakeries pastry shops Granby Quebec | restaurantguru.com, wanderlog.com, ca.restaurantguru.com | The Restaurant Guru desserts list URL; Wanderlog Quebec lists, but no Granby bakery list |
| 2 | Granby pâtisseries boulangeries cafés meilleures note Google avis | restomontreal.ca | D-7 |
| 3 | Granby QC bakeries patisserie cake shop reviews | yelp.ca, yelp.com, tripadvisor.ca, tripadvisor.com | D-9, D-10 |
| 4 | msemen OR msemmen OR harcha Granby OR Bromont OR "Saint-Hyacinthe" OR Cowansville boulangerie pâtisserie marocaine | — | M-2, M-3 |
| 5 | épicerie halal OR maghrébine OR marocaine OR "produits du Maghreb" Granby Québec | — | M-6: nothing in Granby |
| 6 | "cornes de gazelle" OR chebakia OR baklava OR "pâtisserie orientale" OR "pâtisseries libanaises" Granby OR "Saint-Hyacinthe" OR Bromont OR Waterloo | — | M-2: nothing local |
| 7 | restaurant marocain OR "cuisine marocaine" OR "traiteur marocain" Granby OR "Saint-Hyacinthe" OR Bromont OR Sherbrooke | — | M-4, D-8 |
| 8 | Granby rue Principale café pâtisserie Mont Rose "La Mie Bretonne" "Café ORÉE" sur place terrasse | — | C-2, C-3, C-5 |
| 9 | Granby Noël 2026 centre-ville marché de Noël activités rue Principale décembre | — | Nothing for Granby; led to the City's calendar |
| 10 | "Moulin à Pain" Granby OR "boulangerie Racine" Granby OR "nouvelle boulangerie" Granby 2026 | — | Nothing: the referents stay unidentified |
| 11 | "Coco Vanille" Chambly | — | Perfumes only |
| 12 | épicerie internationale OR "épicerie africaine" OR "épicerie orientale" Granby rue Principale OR rue Saint-Charles OR rue Dufferin | — | M-5 (Mr Ghanoush), M-6 |
| 13 | Zoo de Granby saison 2027 ouverture date OR horaire 2027 | — | Z-8: none; pointed to the winter page |
| 14 | Festival international de la chanson de Granby 2027 dates 59e édition | — | E-2: « Dates à venir »; Québec Vacances and festapp confirm the 2026 dates |
| 15 | Mont Rose Pâtisserie Café Granby OR "Café ORÉE" Granby OR "Caféine & co" Granby | wanderlog.com | Nothing useful |

### WebFetch (17 reads, 2026-10-29)

| # | URL (short) | Result |
|---|---|---|
| 1 | suggestqueries.google.com, « pâtisserie granby », hl=fr | 10 suggestions (§5) |
| 2 | threebestrated.ca/bakeries-in-granby-qc | D-1 (then confirmed in the raw HTML) |
| 3 | restaurantguru.com/desserts-Granby-t12 | D-4 (confirmed in the raw HTML) |
| 4 | wanderlog.com list 317895 (lunch) | D-11: the Granby lists it links; Brûlerie |
| 5 | wanderlog.com list 233379 (breakfast and brunch) | D-11 |
| 6 | pagesjaunes.ca, « Pâtisseries », Granby QC | D-6 |
| 7 | ubereats.com, « Épicerie Africain Kamia » | HTTP 403 |
| 8 | zoodegranby.com/horaire | The Halloween line and links; the full schedule needed the data file |
| 9 | ficg.qc.ca | E-1 dates |
| 10 | ficg.qc.ca/programmation-complete/ | E-1 venues |
| 11 | marchepublicgranby.ca | E-3 |
| 12 | granbyregion.com/evenements/ | E-10 |
| 13 | granby.ca/fr | E-11; links to the calendar |
| 14 | granby.ca/fr/calendrier-evenements | E-4 (the erratum) and the link to the 2026 PDF |
| 15 | support.google.com/business/answer/7091 | The ranking factors quoted in §1.2 |
| 16 | quebecvacances.com/fr/attractions/les-finfinettes | C-4 |
| 17 | wanderlog.com/place/details/13122992 | D-12 |

### Direct lookups (curl and Python, 2026-10-29, UTC)

| Lookup | Result |
|---|---|
| Google's suggest endpoint (`suggestqueries.google.com/complete/search?client=firefox&gl=ca&hl=…&q=…`): 1 curl test and 60 calls (13 seeds and 17 variants, each with hl=fr and hl=en), 15:15–15:18, 1.5 s apart | §5. Every call answered |
| Three Best Rated, raw HTML: bakeries (EN, FR), cakes (EN), « pâtisseries » (FR), cafés | D-1 to D-3 |
| Yelp and Tripadvisor list pages | HTTP 403 |
| PagesJaunes search pages (« Pâtisseries », « Boulangeries ») | HTTP 202 with an empty body (a bot check). Read by WebFetch instead |
| Restaurant Guru, raw HTML: the desserts list, the Granby city page, 5 place pages | D-4, D-5 |
| Statistics Canada Census Profile API (SDMX): the DF_CSD dataflow (one versioned URL returned 404, the unversioned one 200); the list of dataflows; the data for STC_CP,DF_CSD/A5.2021A00052447017.1..1 and STC_CP,DF_CMACA/A5.2021S0504450.1..1 (CSV, 2,631 characteristics each); the codelist CL_CHARACTERISTIC | §2.2 |
| OSM API 0.6, map of bbox -72.7341,45.3931,-72.7161,45.4061 (15:27) | §3, « Also seen » |
| Nominatim: 19 lookups (15:28 and 15:42), one request per second, with an identifying user agent | The distances in §2–§4 |
| Zoo de Granby: /horaire and its data file (`/_nuxt/static/1793200573/horaire/payload.js`), /parc-aquatique-amazoo, /parc-animalier/automne, /parc-animalier/hiver, /en/animal-park/winter, /salle-de-presse; 6 releases (2 not used: the preventive notice of 2026-08-06 and the labour agreement of 2026-03-03); the 2025 annual report (PDF, 9.1 MB, SHA-256 starting `45b20aa0e0dd02aa`, read with pdftotext) | Z-1 to Z-8 |
| City of Granby: the 2026 events calendar (PDF, 2 pages, created 2026-04-14, SHA-256 starting `f2b0dbbfeaa3c990`), read with pdftotext and rendered at 120 dpi to read the dates | E-3 to E-9 |
| Vie culturelle et communautaire de Granby: the « Défilé de Noël » page | E-4 |

---

## Sources

All seen 2026-10-29.

Official
- Statistics Canada, Census Profile 2021 API, Granby (V), CSD 2447017 (CSV) — https://api.statcan.gc.ca/census-recensement/profile/sdmx/rest/data/STC_CP,DF_CSD/A5.2021A00052447017.1..1?format=csv — seen 2026-10-29
- Statistics Canada, Census Profile 2021 API, Granby CA 450 (CSV) — https://api.statcan.gc.ca/census-recensement/profile/sdmx/rest/data/STC_CP,DF_CMACA/A5.2021S0504450.1..1?format=csv — seen 2026-10-29
- Statistics Canada, Census Profile 2021 API, characteristic codelist — https://api.statcan.gc.ca/census-recensement/profile/sdmx/rest/codelist/STC_CP/CL_CHARACTERISTIC — seen 2026-10-29
- Zoo de Granby, Rapport annuel 2025 (PDF) — https://zoo-granby.files.svdcdn.com/production/pages/Fichiers-PDF/Zoo-RA-2025-WEB.pdf?dm=1777385717 — seen 2026-10-29
- Zoo de Granby, « Le Zoo de Granby tient son assemblée générale annuelle 2025 » (2026-04-29) — https://www.zoodegranby.com/salle-de-presse/le-zoo-de-granby-tient-son-assemblee-generale-annuelle-2025 — seen 2026-10-29
- Zoo de Granby, « Une saison estivale couronnée de succès au Zoo de Granby! » (2025-09-17) — https://www.zoodegranby.com/salle-de-presse/une-saison-estivale-couronnee-de-succes-au-zoo-de-granby — seen 2026-10-29
- Zoo de Granby, « Un été renversant s'annonce au Zoo de Granby » (2026-05-11) — https://www.zoodegranby.com/salle-de-presse/un-ete-renversant-sannonce-au-zoo-de-granby — seen 2026-10-29
- Zoo de Granby, « Des citrouilles, des animaux et une Halloween pleine de surprises au Zoo! » (2026-09-28) — https://www.zoodegranby.com/salle-de-presse/des-citrouilles-des-animaux-et-une-halloween-pleine-de-surprises-au-zoo — seen 2026-10-29
- Zoo de Granby, Horaire et directions — https://www.zoodegranby.com/horaire — seen 2026-10-29
- Zoo de Granby, schedule data file — https://www.zoodegranby.com/_nuxt/static/1793200573/horaire/payload.js — seen 2026-10-29
- Zoo de Granby, Le Zoo l'Hiver — https://www.zoodegranby.com/parc-animalier/hiver — seen 2026-10-29
- Zoo de Granby, Zoo in Winter — https://www.zoodegranby.com/en/animal-park/winter — seen 2026-10-29
- Zoo de Granby, Parc aquatique Amazoo — https://www.zoodegranby.com/parc-aquatique-amazoo — seen 2026-10-29
- Zoo de Granby, L'Halloween au Zoo — https://www.zoodegranby.com/parc-animalier/automne — seen 2026-10-29
- Zoo de Granby, Salle de presse — https://www.zoodegranby.com/salle-de-presse — seen 2026-10-29
- Ville de Granby, home page — https://www.granby.ca/fr — seen 2026-10-29
- Ville de Granby, Calendrier des événements — https://www.granby.ca/fr/calendrier-evenements — seen 2026-10-29
- Ville de Granby, « Calendrier des événements, Saison 2026 » (PDF) — https://www.granby.ca/sites/default/files/2026-05/calendrier_evenement-2026.pdf — seen 2026-10-29
- Vie culturelle et communautaire de Granby, « Défilé de Noël de Granby » — https://vccgranby.org/defiledenoel — seen 2026-10-29
- Festival international de la chanson de Granby, home page — https://ficg.qc.ca/ — seen 2026-10-29
- FICG, « Programmation complète » — https://ficg.qc.ca/programmation-complete/ — seen 2026-10-29
- Marché public de Granby et région, home page — https://www.marchepublicgranby.ca/ — seen 2026-10-29
- Google Business Profile Help, « Tips to improve your local ranking on Google » — https://support.google.com/business/answer/7091?hl=en — seen 2026-10-29
- Google suggest endpoint (pattern of the 61 calls; first seed shown) — https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=ca&q=p%C3%A2tisserie%20granby — seen 2026-10-29

Tourism
- Tourisme Granby région, Événements — https://granbyregion.com/evenements/ — seen 2026-10-29
- Québec Vacances, « Les Finfinettes » — https://www.quebecvacances.com/fr/attractions/les-finfinettes — seen 2026-10-29
- Québec Vacances, FICG (search summary) — https://www.quebecvacances.com/en/events/festival-international-de-la-chanson-de-granby — seen 2026-10-29
- festapp, FICG 2026 (search summary) — https://festapp.io/festivals/festival-international-de-la-chanson-de-granby/2026 — seen 2026-10-29

Directories read directly
- Three Best Rated, Best Bakeries in Granby, QC — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-29
- Three Best Rated, Meilleures Boulangeries à Granby — https://threebestrated.ca/fr-boulangeries-in-granby-qc — seen 2026-10-29
- Three Best Rated, 3 Best Cakes in Granby, QC — https://threebestrated.ca/cakes-in-granby-qc — seen 2026-10-29
- Three Best Rated, 3 Meilleurs Pâtisseries à Granby — https://threebestrated.ca/fr-gâteaux-in-granby-qc — seen 2026-10-29
- Three Best Rated, 3 Best Cafes in Granby, QC — https://threebestrated.ca/cafe-in-granby-qc — seen 2026-10-29
- Restaurant Guru, Top restaurants with desserts in Granby — https://restaurantguru.com/desserts-Granby-t12 — seen 2026-10-29
- Restaurant Guru, Granby — https://restaurantguru.com/Granby — seen 2026-10-29
- Restaurant Guru, Patisserie Coco Vanille — https://restaurantguru.com/Patisserie-Coco-Vanille-Granby — seen 2026-10-29
- Restaurant Guru, Caféine & co - rue Principale — https://restaurantguru.com/Cafeine-and-co-rue-Principale-Granby — seen 2026-10-29
- Restaurant Guru, Café ORÉE Pâtisserie — https://restaurantguru.com/Cafe-OREE-Patisserie-Granby — seen 2026-10-29
- Restaurant Guru, Mélisse Pâtisserie — https://restaurantguru.com/Melisse-Patisserie-Granby — seen 2026-10-29
- Restaurant Guru, Café De La Brûlerie (Le) — https://restaurantguru.com/Le-Cafe-De-La-Brulerie-Granby — seen 2026-10-29
- Wanderlog, best spots for lunch in Granby — https://wanderlog.com/list/geoCategory/317895/best-spots-for-lunch-in-granby — seen 2026-10-29
- Wanderlog, best breakfast and brunch in Granby — https://wanderlog.com/list/geoCategory/233379/best-breakfast-and-brunch-in-granby — seen 2026-10-29
- Wanderlog, Pâtisserie Cocovanille — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-29
- PagesJaunes, Pâtisseries, Granby QC — https://www.pagesjaunes.ca/search/si/1/P%C3%A2tisseries/Granby+QC — seen 2026-10-29

Directories seen through search summaries (direct read refused or not attempted)
- RestoMontreal, Meilleurs Pâtisseries de Granby — https://www.restomontreal.ca/restaurants/patisseries-granby/fr/?c=332&d=103 — seen 2026-10-29
- RestoMontreal, Best Bakeries in Granby — https://www.restomontreal.ca/restaurants/bakeries-granby/en/?c=338&d=103 — seen 2026-10-29
- RestoMontreal, Desserts et sucreries, pâtisseries de Granby — https://www.restomontreal.ca/restaurants/desserts-et-sucreries-patisseries-granby/fr/?c=299%2C332&d=103 — seen 2026-10-29
- RestoMontreal, Cafés Granby — https://www.restomontreal.ca/restaurants/cafes-granby/en/?c=25%2C307&d=103 — seen 2026-10-29
- RestoMontreal, Café ORÉE Pâtisserie — https://www.restomontreal.ca/resto/cafe-oree-patisserie-granby/23173/en/ — seen 2026-10-29
- RestoMontreal, Mont Rose Pâtisserie & Café (Granby) — https://www.restomontreal.ca/resto/mont-rose-patisserie-cafe-granby/23174/en/ — seen 2026-10-29
- RestoMontreal, La Mie Bretonne (Granby) — https://www.restomontreal.ca/resto/la-mie-bretonne-granby/23177/en/ — seen 2026-10-29
- RestoMontreal, Boulangerie artisanale Le Moulin à Pain (Granby) — https://www.restomontreal.ca/resto/boulangerie-artisanale-le-moulin-a-pain-granby/20634/en/ — seen 2026-10-29
- RestoMontreal, restaurants marocains, Granby — https://www.restomontreal.ca/restaurants/marocains-granby/fr/?c=91&d=103 — seen 2026-10-29
- RestoMontreal, La Rose des Sables (Sherbrooke) — https://www.restomontreal.ca/resto/la-rose-des-sables-sherbrooke/5648/fr/ — seen 2026-10-29
- RestoMontreal, Baladi (Sherbrooke) — https://www.restomontreal.ca/resto/baladi-sherbrooke/19506/fr/ — seen 2026-10-29
- RestoMontreal, Boulangerie Maison Dorée (Saint-Hubert) — https://www.restomontreal.ca/resto/boulangerie-maison-doree-st-hubert/18690/fr/ — seen 2026-10-29
- Yelp, Patisserie/Cake Shop, Granby — https://www.yelp.ca/search?cflt=cakeshop&find_loc=Granby,+QC — seen 2026-10-29
- Yelp, Bakeries, Granby — https://www.yelp.ca/search?cflt=bakeries&find_loc=Granby,+QC — seen 2026-10-29
- Tripadvisor, Granby bakeries (HTTP 403) — https://www.tripadvisor.ca/Restaurants-g182165-zfg9909-Granby_Quebec.html — seen 2026-10-29
- Tripadvisor, a Tartes et clafoutis review (search summary) — https://www.tripadvisor.com/ShowUserReviews-g182165-d794490-r456801327-Tartes_et_clafoutis-Granby_Quebec.html — seen 2026-10-29
- Uber Eats, « Épicerie Africain Kamia » (HTTP 403) — https://www.ubereats.com/ca/store/epicerie-africain-kamia/Ll1s6tU-U4ueteiM_1pO_Q — seen 2026-10-29
- Uber Eats, Granby dish page that the summary drew Mr Ghanoush from (search summary) — https://www.ubereats.com/ca/dish/granby-qc/orange-chicken — seen 2026-10-29

Open data (© OpenStreetMap contributors, ODbL)
- OSM API 0.6, map of the box around the shop — https://api.openstreetmap.org/api/0.6/map?bbox=-72.7341,45.3931,-72.7161,45.4061 — seen 2026-10-29
- Nominatim, structured search (pattern of the 19 lookups) — https://nominatim.openstreetmap.org/search?street=139%20rue%20Principale&city=Granby&state=Qu%C3%A9bec&country=Canada&format=jsonv2 — seen 2026-10-29

Repo inputs
- research/03-competitors.md (§1–§4), research/04-keywords-demand.md (§0.8, §3.1, §6.2, §8), research/05-serp-baseline.md (W44: C8, X1–X12, L4, L5, L8, B1–B3), research/06-seo-aeo-geo-2026-verified.md, research/11-offsite-local-citations.md, research/20a-identity-and-history.md, research/20b-products-and-offers.md (S-1, S-13, S-25, N-17), research/20c-place-and-access.md (G-1, P-11, P-13, Z-1, Z-3, Z-8, S-1, S-4), research/20d-policy-benchmarks.md, research/20e-infra-and-accounts.md, research/21-decisions-agence-2026-10-29.md; docs/03-messages-avis.md, docs/05-gbp-checklist.md, docs/06-annuaires-listicles.md, docs/19-marche-et-concurrence.md; data/competitors.csv

---

## What this changes: the local battles winnable first

Evidence only; « winnable » means the evidence shows the fewest or weakest rivals, never a promised position (docs/01 §5).

**Winnable first:**

1. **« boulangerie Granby » and "bakery Granby Quebec" (X2, C8).**
   - The one list that ranks Granby bakeries now names the shop alone, and the closed former #1 has left it (D-1).
   - The rivals for the term are a bread-first café (La Mie Bretonne, C-3), two discount outlets (D-6) and the Tim Hortons outlets, which carry a « Bakery » category without being bakeries in the shop's sense (D-11).
   - The phrases are typed: « meilleure boulangerie granby », « boulangerie patisserie granby », « boulangerie artisanale granby » (§5).
   - The gap is on the shop's own side: its Google copy shows « Pastry shop » only (D-12), and RestoMontreal ranks it behind La Mie Bretonne (05 X2).
   - Moves: the secondary category « Bakery » if Google offers it (docs/05), bread among the listing's products once confirmed, `/pains-baguettes/`, and the TBR Sunday fix.
2. **The brand and its facts (B1, B2).**
   - Autocomplete already completes the name with « pâtisserie … granby » and the street (« pâtisserie granby rue court ») (§5).
   - The answers already name the shop, but with wrong hours and a wrong phone (05 W44).
   - Facts that are right at the source decide this battle, and every fix is in the shop's and the agency's hands (docs/19 coup n° 1).
3. **The Maghreb specialities (msemmens, harchas).**
   - No other seller surfaced in the region (M-2 to M-6). The shop's own post is the only Granby source (M-1).
   - The demand is small locally (K-2 to K-8) and in autocomplete (§5). The payoff is a fact that sets the shop apart in answers about Granby's pâtisseries, not traffic.
   - It costs a menu section and two products, once the owner confirms them.

**Not first, and why:**

4. **« café centre-ville Granby » (X12).**
   - Five places with seats within 170 m. Caféine & co has 283 Google reviews and sits 29 m away. Café de la Brûlerie has 1,794 and is TBR's #1 café (§3).
   - The shop's gap is a missing café category on Google and in the directories (D-3, D-12; 05 X12), not a missing page. Fix the category first, then measure.
5. **« pâtisserie Granby » (X1, C1).**
   - Three « Pâtisserie »-named rivals sit within 170 m with as many reviews or more: Mont Rose 70+, Café ORÉE 56 to 80+ (§1.2).
   - The shop leads on rating (4.9 from 41, D-12), not on count. Reviews come at their own pace, with no quotas (docs/03). TBR's « pâtisseries » list still leaves it out (D-2).
6. **Custom and birthday cakes (X3, X4, C2).**
   - The typed phrases name the brands: Cake Design, Rose Gâteaux, IGA (§5). TBR's three cake shops hold 116–118/120 (D-2).
   - The shop has no published price or photo yet (docs/19 coup n° 7). Proof comes first.
7. **The Zoo (L5, L8).**
   - 665,578 visitors in 2025 (Z-1), yet no one pairs the Zoo with a pâtisserie in autocomplete (§5).
   - Distance from the Zoo favours rue Saint-Hubert (Z-10).
   - This battle is a factual answer (« environ 5 à 8 minutes en auto », 20c) for a season that starts in mid-May, and the 2027 dates are not out (Z-8).
