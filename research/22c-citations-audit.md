# 22c · Live citations audit: every listing of the shop, opened one by one (2026-10-29)

As of Thursday 2026-10-29 (ISO week 2026-W44). Step: research « citations audit », under Yahya's mandate of 2026-10-29 (« take all decisions based on what I give and web research, and make the full thing ready »). It re-opens the 34 rows of docs/06 §3 and `data/directories.csv`, then looks for listings nobody had recorded.
Machine-readable twin: `data/citations-audit-2026-10-29.csv` (46 rows, one per listing; columns `listing, url, name_shown, address_shown, phone_shown, hours_shown, category, rating, reviews, website_shown, errors, fix_how, priority, seen`).

How this was made, and its limits:
- **The record every listing is compared with** is §1: the task's canonical record, checked against research/20a (register), 20c (map point) and 21 (decisions). Nothing in it was changed here.
- **62 WebFetch reads and 25 WebSearch queries**, all on 2026-10-29 (standard mode, US-located, summarised results). Both logs are at the end.
- **WebFetch passes every page through a summarising reader.** Quotes are as the reader returned them. Check a quote against the page before printing it anywhere.
- **Pages that could not be opened:**
  - HTTP 403: RestoMontreal (FR, EN, and without www), Tripadvisor (.ca, .com and its owner pages), find-open.ca, canada.chamberofcommerce.com, allbiz.ca, foodpages.ca, dnb.com, bdir.in, Cylex, Yelp, Foursquare's help centre
  - script shells: Google Maps (both place IDs) and Apple Maps
  - empty results: Bing (two reads)
  - empty page: MapQuest (two reads)
  - login wall: Foursquare's explorer
  - DNS failure: www.marchepublicgranby.ca (the address without www worked)

  For those, values come from search summaries or search-result titles and are labelled unverified, or the row says « not opened ». A page that could not be opened is « not opened », never « absent ». « Not found by search » is absence of evidence only.
- **Not done:**
  - no claim, form, email or edit was submitted, and no account was created
  - no phone check in Granby
  - Google Maps, Apple Maps, Bing Maps and Facebook's « À propos » need a phone or a logged-in browser
- **Labels:**
  - **verified** = what a listing displays, read directly on that listing; or an official or owner source; or two independent sources
  - **unverified** = a search summary or a search-result title only, one third-party source, or an inference
- **CSV convention:** the bracketed tag at the start of `name_shown` says how the row was seen: [read], [not opened: …], [not found by search], or an earlier step that read it. The tag applies to the whole row. `seen` is 2026-10-29 unless the row cites an older step.
- **No file was edited** other than this one and its CSV twin.

---

## 0. Bottom line (decision-relevant)

1. **Three Best Rated has already removed the closed bakery.** On 2026-10-29 its Granby bakeries page lists one business: Pâtisserie Coco Vanille (verified, three direct reads of the EN and FR pages).
   - EN heading: « Best Bakeries in Granby, QC ». The page shows 3 Rue Court, (450) 372-7177, Wed–Sat 8:30–17:30, Sun 9:00–17:00, Mon–Tue closed, a 4.8/5.0 score and a Facebook link.
   - Pain-Pain, Mélisse and 450-770-7246 no longer appear. docs/06 still says « 2e sur 3 ».
   - **What is left to fix:** Sunday opens at 9:00 instead of 9:30, and the shop is still missing from both cake lists (« 3 Best Cakes », « 3 Meilleurs Pâtisseries »).
   - → **Model B loses its Pain-Pain paragraph.** A short email to support@threebestrated.ca fixes Sunday now.
   - TBR's free update form waits for launch. It requires a website, an email, a start year, prices, three customer reviews and three photos. The website, the email, the start year and the prices are not available yet (20a §7; research/14 H4, C2, P1).
2. **Search engines still serve the old copies.** The search tool's summaries today repeated TBR's older schedule (Thu–Fri 9–16:30, Sat 9–15, as research/01 §3 recorded it) and Wanderlog's older data (5.0 from 21, same schedule). Both live pages have changed since.
   - The wrong AI answer of 2026-10-29 (Pain-Pain's hours and phone, research/05 W44.5) most likely came from such copies, not from today's TBR page (inference).
   - → After each correction, re-run the brand prompts (B1, B2) at the next weekly run. Expect a lag; its length is unknown.
3. **Sunday 9:00 is on both live pages we could read that show Sunday hours** (Wanderlog's Google card and TBR); RestoMontreal's summary also says 9:00. The 9:30 rests only on Yahya's reading of the Google listing on 2026-10-27.
   - → **Before any hours correction goes out, take one dated screenshot of the Google listing.** It settles whether the copies are stale or the record is wrong (research/14 S1, S2, H1).
4. **Old three-day schedules survive in the mirrors that refused us** (find-open.ca, canada.chamberofcommerce.com, allbiz: HTTP 403; search summaries).
   - find-open also shows reduced hours for Halloween, Saturday 2026-10-31, that nobody gave (summary, unverified).
   - They are fixed after the Google listing is final (model D). The minor ones go into the quarterly sweep.
5. **The six named confusion risks, checked today (§3):**

   | Risk | Today |
   |---|---|
   | « Pâtisserie Hygge Factory », 17, rue Court | Listing read; it links to a **separate Google place (CID 8325714417058721602)**; still no second source → owner question + phone check (P1) |
   | Pain-Pain's hours and phone via TBR | Gone from TBR (verified); still in the engines' copies (inference) |
   | RestoMontreal « peut être temporairement fermée » | Page refused (403); today's summary still reports it (unverified) |
   | MapQuest « Coco Vanill » | Page empty; the indexed title still shows it (unverified) |
   | Wanderlog « Magog » | Still there, in the title and the breadcrumb (verified) |
   | 450-372-5917 | Not on PagesJaunes, Yellow Pages or Canada411 today (verified), and no indexed page holds it (search) → keep it off every listing; research/14 H3 drops to the lowest priority |

6. **New listings and new risks:**
   - **Restaurant Guru has the shop.** It shows no hours and lists « Food delivery » and « Dinner » features. The shop does not deliver (decision A3) and closes at 17:30.
   - **Cylex lists the shop on a Cowansville page.** At 3 Rue Court it also lists « Les petits trésors » with (450) 956-1656 and a « gluten-free » label (unverified: Cylex refused the reader). It is probably the bakery partnership of that name, seated at 3 rue Court and struck off the register on 2026-03-12 (20a §5; inference from the name and the address).
   - **Tourisme Granby région named « la pâtisserie Coco Vanille »** in an article of 8 September 2022, linked to the Facebook page (verified). It is a link to ask for at launch.
   - Yellow Pages (EN) and Canada411 carry the PagesJaunes record.
   - **One old « citation » is not the shop:** Airbnb place 1364951 (research/01 §7) is a permanently closed bakery in Chicago (verified).
7. **Still not found by search** (absence of evidence only): Yelp, Foursquare, an Apple Maps place page, a Bing card, 411.ca, Hotfrog, n49, Waze, FindGlocal, Bonjour Québec and Tourisme Cantons-de-l'Est.
   - Yelp (https://biz.yelp.com/claim, verified) and Foursquare (https://foursquare.com/venue/claim, via summary) stay the P1 claim-or-create pair.
   - The reason: AI assistants are said to read them (research/06 (o), secondary sources).
8. **The local chamber is settled by its own site.** Chambre de commerce et d'industrie Haute-Yamaska (CCIHY), 825, suite 1, rue Bernard, Granby J2J 0H5, 450 372-6100, info@ccihy.com (verified).
   - It has an online « Répertoire des membres » (« plus de 540 entrepreneurs et industries »).
   - The site shows no fee. The 650, rue Principale address of the old BAnQ notice (research/11 §0.4) is out of date.
9. **Website field: every listing that has one points to the Facebook page.** That covers Google (via Wanderlog), TBR, Restaurant Guru, Sluurpy and Tourisme Granby région.
   - This is right until launch: the domain is not registered (20a §7, 20e §0).
   - Switch them all on launch day, not before.
10. **Names in use:**
    - Google and its copies: « Pâtisserie Cocovanille »
    - PagesJaunes, Yellow Pages and Canada411: « Patisserie Coco Vanille Inc » (« Inc » has no place in a trade name)
    - MapQuest: « Coco Vanill » (a typo)
    - Instagram: « Coco•vanille »

    Renames wait for the sign photo (research/14 S3). No name field we saw carries a keyword or a city; the only city in a title is Wanderlog's wrong « Magog ».

---

## 1. The record every listing is compared with

| Field | Canonical value | Source |
|---|---|---|
| Display name | Pâtisserie Coco Vanille | decision B6 (research/21); the sign photo can still change it (research/14 S3) |
| Name on Google today | « Pâtisserie Cocovanille » (CID 10789122976114705165) | task record; Wanderlog's Google-sourced card (verified, 20a §2) |
| Legal name | Pâtisserie Coco Vanille inc., NEQ 1177082220 (for legal pages and credit records, never a trade-name field) | register (20a §1) |
| Address | 3, rue Court, Granby (Québec) J2G 4Y6 | register (20a §1); map point verified (20c G-1) |
| Main phone | 450-372-7177 | every listing read today |
| Mobile | 438-528-7818: the number the shop gives for workshop bookings | the shop's reel of 2026-10-22 (20b S-19); decision A7 |
| Hours | Wed–Sat 8:30–17:30 · Sun 9:30–17:00 · closed Mon and Tue | Google listing read by Yahya, 2026-10-27 (research/01 update) |
| Website | none yet: cocovanillegranby.com is built, not online, and not registered | 20a §7; 20e §0 |
| Social | facebook.com/PatisserieCocoVanille · instagram.com/coco_vanillegranby (verified 2026-10-29) | 20b §0.1; this step |

---

## 2. What each listing shows (2026-10-29)

« Errors » are measured against §1. Ratings are recorded only to spot errors: none of them goes on the site or into its code (research/01 §6).

### P0: the master record and the pages the engines cite

| # | Listing | What it shows | Errors against §1 | Label | Source | Seen |
|---|---|---|---|---|---|---|
| 1 | Google Business Profile | Not opened (script shell). Through Wanderlog's Google-sourced card: « Pâtisserie Cocovanille », 3 Rue Court, +1 450-372-7177, Wed–Sat 8:30–17:30, Sun 9:00–17:00, 4.9 from 41, website = the Facebook page | Name variant (rename waits for the sign); Sunday 9:00 on the card vs 9:30 read on 2026-10-27 | unverified (a copy of the listing) | https://www.google.com/maps?cid=10789122976114705165 · https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille | 2026-10-29 |
| 2 | Apple Maps (Apple Business) | Not opened (script shell). No place page for the shop surfaced in search #13, while place pages of other Granby shops did (e.g. Le Cafe de la Brulerie) | unknown | — | https://maps.apple.com/?q=P%C3%A2tisserie%20Cocovanille | 2026-10-29 |
| 3 | Bing Maps (Bing Places) | Not opened: two Bing reads returned an empty results page | unknown | — | https://www.bing.com/search?q=P%C3%A2tisserie+Cocovanille+Granby | 2026-10-29 |
| 4 | Facebook page | Title « Pâtisserie Coco Vanille \| Granby QC » only (login wall). https://www.facebook.com/103739695618750, the address Sluurpy and Restaurant Guru link, opens the same title. 1,067 followers (20b) | none seen; hours, address and phone not visible | verified (title) | https://www.facebook.com/PatisserieCocoVanille/ | 2026-10-29 |
| 5 | Instagram | Display name « Coco•vanille »; bio « Pâtisserie & Café », « Gâteaux sur commande », (450) 372-7177, « Ateliers créatifs sur réservation », (438) 528-7818; link in bio https://www.facebook.com/share/1DThcg9BeB/?mibextid=wwXIfr; 266 followers, 103 following; newest post 2026-10-22; no address | name field differs from the display name; no address | verified (direct read; owner channel) | https://www.instagram.com/coco_vanillegranby/ | 2026-10-29 |
| 6 | RestoMontreal, fiche 20633 | Not opened (HTTP 403, three addresses). Search summary: « peut être temporairement fermée » still on the listing and on Granby list pages; Mon–Tue closed, Thu from 8:30, Sun 9:00–17:30; other pages of the site show a 9:30 or 7:30 opening | closure line; hours | unverified (search summary) | https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ | 2026-10-29 |
| 7 | Three Best Rated, « Best Bakeries in Granby, QC » | The only business: « PÂTISSERIE COCO VANILLE », 3 Rue Court, (450) 372-7177, « Wed-Sat: 8:30am - 5:30pm », « Sun: 9am - 5pm », « Mon & Tue: Closed »; « Overall TBR® Inspection Score: 4.8/5.0 »; no review count; Facebook link; « 2025 Highlights ». No « Pain-Pain », « Mélisse » or « 770-7246 » on the page | Sunday 9:00 | verified (two direct reads) | https://threebestrated.ca/bakeries-in-granby-qc | 2026-10-29 |
| 8 | Three Best Rated, boulangeries (FR) | Rank 1 of 1, same data: « Du mercredi au samedi : 8 h 30 à 17 h 30 », « Dimanche : 9 h - 17 h », « Lundi et mardi : Fermé »; « Note de 4,8 » | Sunday 9 h | verified (direct read) | https://threebestrated.ca/fr-boulangeries-in-granby-qc | 2026-10-29 |

### P1: feeds for AI assistants and visitors, partners, the cake lists

| # | Listing | What it shows | Errors against §1 | Label | Source | Seen |
|---|---|---|---|---|---|---|
| 9 | TBR, « 3 Best Cakes in Granby, QC » | Avec un Grand A (118/120), Cake Design Granby (117/120), Rose Gateaux (116/120), in page order (the page does not number them). The shop is not listed | absent | verified (direct read) | https://threebestrated.ca/cakes-in-granby-qc | 2026-10-29 |
| 10 | TBR, « 3 Meilleurs Pâtisseries à Granby, QC » | The same three; the shop is not listed | absent | verified (direct read) | https://threebestrated.ca/fr-gâteaux-in-granby-qc | 2026-10-29 |
| 11 | Yelp.ca | Not opened (HTTP 403). Search #3 surfaced Yelp's Granby bakery and cake-shop pages, without the shop | unknown | — | https://www.yelp.ca/search?find_desc=Coco+Vanille&find_loc=Granby%2C+QC | 2026-10-29 |
| 12 | Tripadvisor d27188801 | Not opened (HTTP 403). Summary: « PÂTISSERIE COCO VANILLE », 3 Rue Court J2G 4Y6, +1 450-372-7177, no hours; 4.4 from 7 on one version, 0 reviews on another; listing type « Restaurant » | no hours; type; counts conflict | unverified (search summary) | https://www.tripadvisor.ca/Restaurant_Review-g182165-d27188801-Reviews-Patisserie_Coco_Vanille-Granby_Quebec.html | 2026-10-29 |
| 13 | PagesJaunes 102750737 | « Patisserie Coco Vanille Inc », 3 Rue Court, Granby QC J2G 4Y6, « 450-372-7177 Principal » (the only number); no hours (« Voir toutes les heures » shows nothing), no category, no rating, no site | « Inc » in the trade name; no accent; no hours | verified (direct read) | https://www.pagesjaunes.ca/bus/Quebec/Granby/Patisserie-Coco-Vanille-Inc/102750737.html | 2026-10-29 |
| 14 | Yellow Pages (EN), same record | « Patisserie Coco Vanille Inc », « Primary » 450-372-7177. The « Coco-Vanille » search pages of both sites show only that number | same as #13 | verified (direct reads) | https://www.yellowpages.ca/bus/Quebec/Granby/Patisserie-Coco-Vanille-Inc/102750737.html | 2026-10-29 |
| 15 | Foursquare | Not opened (login wall). No venue surfaced in search #5 | unknown | — | https://app.foursquare.com/explore?near=Granby%2C%20QC&q=Coco%20Vanille | 2026-10-29 |
| 16 | Wanderlog 13122992 | Title « Pâtisserie Cocovanille, Magog, QC », breadcrumb « Magog »; address « 3 Rue Court, Granby, QC J2G 4Y6, Canada »; +1 450-372-7177; Sun 9AM–5PM, Mon–Tue Closed, Wed–Sat 8:30AM–5:30PM; « Pastry shop »; 4.9 « From Google » from 41; website = the Facebook page; « Report an issue »; footer © 2025 | city Magog; Sunday 9:00 | verified (direct read) | https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille | 2026-10-29 |
| 17 | Restaurant Guru, « Pâtisserie Hygge Factory » | 17 Rue Court; no phone, « No info on opening hours », no reviews; « Wheelchair accessible »; « Updated on: Sep 13, 2026 »; its Google link (restaurantguru.com/link/a1:53799356) answers 302 → https://maps.google.com/?cid=8325714417058721602 | not the shop: a confusion risk (§3) | verified (the listing); its existence on the street: unverified | https://restaurantguru.com/Patisserie-Hygge-Factory-Granby | 2026-10-29 |
| 18 | Marché public de Granby et région | « Pâtisserie Coco Vanille », categories « Spécialités » and « Sucré »; no description, no link; the market's season (« Tous les samedis du 2 mai au 7 novembre », 9 h–14 h; « Les jeudis soir du 18 juin au 27 août »); © 2026 | no link (no site yet) | verified (direct read) | https://marchepublicgranby.ca/exposants/patisserie-coco-vanille/ | 2026-10-29 |
| 19 | Tourisme Granby région, « Recette locale signée Tourisme Granby région! » | Article of 8 September 2022: « Terminer votre soirée sur une belle note avec l'une des merveilles sucrées de la pâtisserie Coco Vanille. » « Coco Vanille » links to the Facebook page | none | verified (direct read) | https://granbyregion.com/recette-locale-signee-tourisme-granby-region/ | 2026-10-29 |
| 20 | CCIHY, member directory | Directory with filters (type, sector, city); « plus de 540 entrepreneurs et industries »; the shop not seen in the visible part (the page was truncated) | not a member, as far as visible | verified (the chamber's own site) | https://www.ccihy.com/repertoire-des-membres-2/ | 2026-10-29 |
| 21 | Tastet, Granby list | Not re-checked: as research/03 (no bakery on the list) | — | as research/03 | https://tastet.ca/en/lists/nos-restaurants-coups-de-coeur-a-granby/ | 2026-10-25 |

### P2: copies with a wrong name or hours, and the tourism and map layer

| # | Listing | What it shows | Errors against §1 | Label | Source | Seen |
|---|---|---|---|---|---|---|
| 22 | MapQuest | Empty page (two reads). Indexed title: « Patisserie Coco Vanill, 3 Rue Court, Granby, Québec J2G 4Y6, CA - MapQuest » | name typo | unverified (search-result title) | https://www.mapquest.com/ca/quebec/patisserie-coco-vanill-754679978 | 2026-10-29 |
| 23 | find-open.ca | Not opened (HTTP 403). Summary: Wed–Fri 9:00–16:30, Sat 9:00–15:00, Sun–Tue closed; hours « set » 2025-08-20; reduced Saturday hours for Halloween on 2026-10-31 | old schedule; holiday hours nobody gave | unverified (search summary) | https://find-open.ca/granby/p%C3%A2tisserie-cocovanille-1781027 | 2026-10-29 |
| 24 | canada.chamberofcommerce.com | Not opened (HTTP 403). Summary: Wed–Fri 9:00–17:00, Sat 9:00–16:00, Sun–Tue closed | old schedule | unverified (search summary) | https://canada.chamberofcommerce.com/business-directory/quebec/granby/pastry-shop/1192259-patisserie-cocovanille | 2026-10-29 |
| 25 | Cylex, « Les petits trésors » | Not opened (HTTP 403). Summaries: 3 Rue Court, Granby J2G 4Y6, (450) 956-1656; bakery and pastry, plus a « gluten-free » restaurant category; closed at the snapshot | probably a former business at the shop's address (§3) | unverified (search summaries) | https://fr.cylex-canada.ca/cowansville/desserts.html | 2026-10-29 |
| 26 | OpenStreetMap | No point for the shop; « 3, Rue Court » exists as a CanVec address interpolation | shop absent | verified (observed in OSM by 20c G-4) | https://www.openstreetmap.org/way/1261961939 | 2026-10-29 |
| 27 | Tourisme Cantons-de-l'Est | No page for the shop surfaced in search #14 (cantonsdelest.com, easterntownships.org) | — | — | https://www.cantonsdelest.com/ | 2026-10-29 |
| 28 | Bonjour Québec | No page for the shop surfaced in search #14 | — | — | https://www.bonjourquebec.com/ | 2026-10-29 |
| 29 | Réseau des Haltes gourmandes | Not re-checked: as research/11 | — | as research/11 | https://www.lequebecavelo.ca/en/tourist-attractions/reseau-des-haltes-gourmandes-en-haute-yamaska | 2026-10-25 |

### P3: minor mirrors, old mentions, nothing found

| # | Listing | What it shows | Errors against §1 | Label | Source | Seen |
|---|---|---|---|---|---|---|
| 30 | Restaurant Guru, « Patisserie Coco Vanille » | 3 Rue Court, +1 450-372-7177; « No info on opening hours »; « #18 of 40 restaurants with desserts in Granby »; Facebook 5/5, « Trip: Not rated yet »; features include « Food delivery », « Dinner », « Outdoor seating »; « Updated on Sep 05, 2026 »; website = the Facebook page (link 119083002 → facebook.com/103739695618750) | no hours; delivery and dinner features | verified (direct read) | https://restaurantguru.com/Patisserie-Coco-Vanille-Granby | 2026-10-29 |
| 31 | Sluurpy | « Patisserie Coco Vanille », 3 Rue Court, +1 450-372-7177; no hours; 3.5 from 0 reviews; website facebook.com/103739695618750; « Updated on 05 Jun 2025 »; « Report error » and « Report closed » buttons | rating artefact; no hours | verified (direct read) | https://www.sluurpy.com/en/granby/restaurant/9959902/patisserie-coco-vanille | 2026-10-29 |
| 32 | Cylex, « Pâtisserie Cocovanille » | Not opened (HTTP 403). Summaries: 3 Rue Court, (450) 372-7177, on Cylex's Cowansville « Desserts » page; « Fermé maintenant » at the snapshot; page ages 624 to 1,520 days | listed on a Cowansville page | unverified (search summaries) | https://fr.cylex-canada.ca/cowansville/desserts.html | 2026-10-29 |
| 33 | allbiz.ca | Not opened (HTTP 403). Summary: Thu–Fri 9:00–16:30, Sat 9:00–15:00, Wed closed | old schedule | unverified (search summary) | https://www.allbiz.ca/p%C3%A2tisserie-cocovanille-450-372-7177 | 2026-10-29 |
| 34 | foodpages.ca | Not opened (HTTP 403). Indexed title « Pâtisserie Cocovanille, 3 Rue Court, Granby » | hours unknown | unverified (search-result title) | https://foodpages.ca/ptisseriecocovanille | 2026-10-29 |
| 35 | Dun & Bradstreet | Not opened (HTTP 403). research/01: « Patisserie Coco Vanille Inc », a company-credit record, where the legal name belongs | nothing material | as research/01 | https://www.dnb.com/business-directory/company-profiles.patisserie_coco_vanille_inc.def6e6d3ea762188a0f800c49a1dd49d.html | 2026-10-29 |
| 36 | bdir.in | Not opened (HTTP 403) | unknown today | — | https://www.bdir.in/p/best/ca/bakeries-in-granby-qc/MjMwNzk1 | 2026-10-29 |
| 37 | Canada411 | Search page: « Patisserie Coco Vanille Inc », 3 Rue Court, Granby, QC, J2G 4Y6, linking the Yellow Pages record; no 450-372-5917 | same « Inc » | verified (direct read) | https://www.canada411.ca/search/si/1/Coco+Vanille/Granby+QC/ | 2026-10-29 |
| 38 | 411.ca | Not found by search (#4, #12) | — | — | https://411.ca/ | 2026-10-29 |
| 39 | Hotfrog | Not found by search (#4, #12) | — | — | https://www.hotfrog.ca/ | 2026-10-29 |
| 40 | n49 | Not found by search (#4, #12) | — | — | https://www.n49.com/ | 2026-10-29 |
| 41 | Waze | Not found by search (#12). A Waze result for another Granby shop carries a Google place ID (« place.ChIJ… ») | Waze seems to read Google's data | unverified (inference) | https://www.waze.com/live-map/directions/ca/qc/granby/orange-coco?to=place.ChIJOfGBxzLPyUwR2MoyMMBcpYo | 2026-10-29 |
| 42 | FindGlocal | Not found by search (#20). Named in the strategy Yahya pasted, with Wed–Fri 9–17, Sat 9–16 (research/01 update 2026-10-27) | old schedule, if it still exists | unverified | https://www.findglocal.com/ | 2026-10-29 |
| 43 | La Voix de l'Est, 2022-10-22 | « Pâtisserie Coco Vanille »; no link (there was no site) | — | verified (20a) | https://www.lavoixdelest.ca/2022/10/23/un-marche-qui-mise-sur-le-bon-voisinage-cd5aafe8bfcdc08ab30265e590a93863/ | 2026-10-29 |
| 44 | ICI Radio-Canada, 2022-11-13 | « la Pâtisserie Coco Vanille »; no link | — | verified (20a) | https://ici.radio-canada.ca/nouvelle/1932271/granby-travaux-marchand-rue | 2026-10-29 |
| 45 | Delivery apps | Not listed on Uber Eats, DoorDash or SkipTheDishes (gated: no delivery) | — | as 20b T-6 | https://www.ubereats.com/ca/category/granby-qc/bakery | 2026-10-29 |
| 46 | Airbnb things to do, place 1364951 | « Vanille Pâtisserie », Chicago, IL, « Permanently closed »: **not the shop** | a false positive in research/01 §7 | verified (direct read) | https://www.airbnb.ca/things-to-do/places/1364951 | 2026-10-29 |

---

## 3. The confusion risks

| Risk | What we saw | Label | Source (seen 2026-10-29) | What to do |
|---|---|---|---|---|
| **« Pâtisserie Hygge Factory », 17, rue Court** | Restaurant Guru lists a pastry business four doors up the same street. Its « on Google » link resolves to a **separate Google place, CID 8325714417058721602**, so Restaurant Guru ties the entry to a Google place. No phone, no hours, no reviews, « Wheelchair accessible », updated 2026-09-13. Search #6 and 20c (query 13) found no second source. Google Maps does not open here | verified (the listing and its CID); the business itself: unverified | https://restaurantguru.com/Patisserie-Hygge-Factory-Granby; https://restaurantguru.com/link/a1:53799356 (302) | **P1, week 0–1.** Ask the owner whether it exists and whether it has anything to do with the shop. Open https://maps.google.com/?cid=8325714417058721602 on a phone and take a dated screenshot. Use Google Maps' own « Suggest an edit » on that place only if no such business is at 17, rue Court, or if it duplicates the shop (the options were not checked here). Never report a real business |
| **Pain-Pain's hours and phone, copied via Three Best Rated** | The live TBR bakeries pages (EN, FR) no longer carry Pain-Pain, Mélisse or 450-770-7246. The search tool's summaries still print TBR's older schedule for the shop, and the indexed title still says « 3 Best Bakeries ». A Pain-Pain listing on canada.chamberofcommerce.com shows a number starting « 450-770… » in its search-result title (cut off) | verified (TBR today); the engines' lag and the Pain-Pain number: unverified (inference; research/05 W44.5) | https://threebestrated.ca/bakeries-in-granby-qc; https://threebestrated.ca/fr-boulangeries-in-granby-qc | No request about Pain-Pain any more. Fix the Sunday hour at TBR. Re-run B1 and B2 at the next weekly run, and record whether 450-770-7246 still comes back |
| **RestoMontreal « peut être temporairement fermée »** | Three addresses answered HTTP 403. Today's summary says the line is still on the listing and on the Granby list pages | unverified (search summary) | https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ | A dated screenshot of the Google listing first (S1, S2); then model A. The correction route is not known (§4) |
| **MapQuest « Coco Vanill »** | The page came back empty twice. The indexed title still reads « Patisserie Coco Vanill, 3 Rue Court, Granby, Québec J2G 4Y6, CA - MapQuest » | unverified (search-result title) | https://www.mapquest.com/ca/quebec/patisserie-coco-vanill-754679978 | Model C once a route is known. Do not buy a paid listing to fix a typo |
| **Wanderlog « Magog »** | Title « Pâtisserie Cocovanille, Magog, QC » and breadcrumb « Magog », with a Granby street address. The Google-sourced card on the same page is right | verified (direct read) | https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille | The page's « Report an issue »: city, and Sunday 9:30 (model C) |
| **450-372-5917** | It is on none of PagesJaunes 102750737, its search page, Yellow Pages (EN, listing and search) or Canada411. An exact-number search (#2) found no page in any format | verified (the five pages); elsewhere: absence of evidence | §2 rows 13, 14, 37 | Never use it. research/14 H3 drops to « only if it reappears ». The fixed line stays 450-372-7177 everywhere |
| **New: « Les petits trésors » at 3 Rue Court (Cylex)** | Cylex lists a bakery-pastry « Les petits trésors » at the shop's address, with (450) 956-1656 and a « gluten-free » category. The register shows a partnership of that name seated at 3 rue Court, struck off ex officio on 2026-03-12 (20a §5). Search #19 found no other copy | unverified (search summaries; Cylex 403) | https://fr.cylex-canada.ca/cowansville/desserts.html | **P2.** Ask Cylex to mark it closed, once the route is known. Ask the owner whether (450) 956-1656 was ever the shop's number. The « sans gluten » label matters: the site makes no such claim (decision A9) |
| **New: « Food delivery » on Restaurant Guru** | The shop's Restaurant Guru page lists « Food delivery », « Dinner » and « Outdoor seating ». The shop is pickup only (decision A3) and closes at 17:30 | verified (direct read) | https://restaurantguru.com/Patisserie-Coco-Vanille-Granby | **P3.** « Report incorrect information » on the page. An answer engine could repeat « livraison » |
| **New: an Airbnb « citation » that is another bakery** | Place 1364951, cited in research/01 §7 from the brief's first search, is Vanille Pâtisserie in Chicago, permanently closed | verified (direct read) | https://www.airbnb.ca/things-to-do/places/1364951 | Remove it from the inventory. Nothing to correct |
| **Name collisions already known** | The Coco Vanille perfume, Pâtisserie Coco (Montréal), Vanille Pâtisserie (Chicago) and Vanille Coco (La Réunion) crowd today's brand searches (#3, #9, #17, #18). choco.vanille (Le Marmiton) did not surface today | verified (search results) | research/01 §8; 20b T-7 | No change: one name everywhere, `alternateName`, `sameAs` and « Granby » in every bio |

---

## 4. How to fix each listing: route, priority, timing

Order of work, unchanged from docs/06 §2: the Google listing first, then the copies. One reason for the order: Google feeds Gemini, Bing feeds Copilot and partly ChatGPT, and Foursquare and Yelp are named as place sources for ChatGPT and Perplexity (research/06 (o), secondary).

| Listing | Route (exact form or contact) | Route label | Priority | When (docs/06 weeks) | Blocked by |
|---|---|---|---|---|---|
| Google Business Profile | https://business.google.com/ (docs/05 §2) | verified (docs/05) | P0 | week 0–1 | owner access, sign photo, dated screenshot (S1, S2, S3, S7) |
| Apple Business | https://business.apple.com/ (Apple calls the number on file: docs/05 §6) | verified (Apple help, via docs/05) | P0 | week 1 | final Google listing |
| Bing Places | https://www.bing.com/forbusiness (import from Google: docs/05 §7) | verified (Bing blog, via research/06) | P0 | week 1 | final Google listing |
| Facebook, Instagram | the owner's accounts (profile editing; the screens were not checked here) | — | P0 | week 1 | owner login; sign photo for the name |
| RestoMontreal | [[FACT NEEDED: correction route: open the listing in a normal browser and note the owner link]]; unverified lead: hello@restomontreal.ca (a third-party profile seen in a search summary) | unverified | P0 | week 3 | dated Google screenshot (S1, S2) |
| Three Best Rated (bakeries, Sunday hour) | **Now:** support@threebestrated.ca (the address the pages print). **At launch:** https://threebestrated.ca/submit-business?reason=update or https://threebestrated.ca/submit-business-fr?reason=update | verified (direct reads) | P0 | week 2 (email); launch (form) | the form: website, email (H4), start year (C2), prices (P1), 3 reviews, 3 photos |
| Three Best Rated (cake lists, model F) | ask support@threebestrated.ca which form applies (the update form asks « Select Business Category »); new-listing form https://threebestrated.ca/submit-business-fr?reason=new | verified (direct reads) | P1 | when the price page exists | prices (P1), photos |
| Yelp | https://biz.yelp.com/claim (« Claim your free Yelp Business Page »; « It's free to be on Yelp ») | verified (Yelp for Business page) | P1 | week 2 | — (claim only; never ask for Yelp reviews) |
| Foursquare | https://foursquare.com/venue/claim (third-party guides, via summary; Foursquare's article https://support.foursquare.com/hc/en-us/articles/23646714300444-Claiming-a-listing answered 403). Free postal verification vs a paid instant one: third-party claims, unverified | unverified | P1 | week 2 | final Google listing |
| Tripadvisor | https://www.tripadvisor.com/business/claim-restaurant-listing-free (« Claim your Tripadvisor restaurant listing ») or https://www.tripadvisor.co.uk/Owners | unverified (Tripadvisor's own pages, seen only through a search summary; both answer 403 to the reader) | P1 | week 2 | — |
| PagesJaunes / Yellow Pages / Canada411 | public form https://www.pagesjaunes.ca/marchand/miseajour/102750737 (fields: name, address, phone, website, Facebook, X; sign-in or email, plus a context box); EN https://www.yellowpages.ca/merchant/update/102750737; owner dashboard https://ypforbusiness.yellowpages.ca/dashboard?lang=fr | verified (direct reads) | P1 | week 2 (name, Facebook); launch (site); owner dashboard for hours | sign photo for the name (S3) |
| Wanderlog | the page's « Report an issue » (no URL exposed; https://wanderlog.com/contact answers 404) | verified (direct read) | P1 | week 3 | final Google listing (Sunday) |
| « Hygge Factory » (Google place) | owner answer + phone screenshot of https://maps.google.com/?cid=8325714417058721602; then, only if warranted, Google Maps « Suggest an edit » on that place | — | P1 | week 0–1 | owner answer |
| Marché public | info@marchepublicgranby.ca · https://marchepublicgranby.ca/contact/ | verified (direct read) | P1 | launch | site online |
| Tourisme Granby région | info@granbyregion.com · 450 372-7056 · 111, rue Denison Est · https://granbyregion.com/nous-joindre/ | verified (direct read) | P1 | weeks 4–6 (listing); launch (link) | [[FACT NEEDED: frais ou conditions d'inscription]] |
| CCIHY | https://www.ccihy.com/formulaire-dadhesion/ · info@ccihy.com · 450 372-6100 | verified (the chamber's site) | P1 | weeks 4–6 | [[FACT NEEDED: frais d'adhésion]]; owner decision |
| MapQuest | [[FACT NEEDED: correction route]]; unverified leads: a Help Center request (a forum post), paid management through Yext (Podium); one forum says MapQuest draws on Yelp | unverified | P2 | week 3 | — |
| find-open.ca, canada.chamberofcommerce.com | [[FACT NEEDED: correction routes (pages 403; open them in a browser)]]. Yext lists chamberofcommerce.com as a paid integration: not needed | unverified | P2 | week 3 | final Google listing |
| Cylex (both entries) | [[FACT NEEDED: correction route (pages 403)]] | — | P2 (petits trésors) · P3 (the shop) | quarterly sweep | owner answer on (450) 956-1656 |
| OpenStreetMap | edit on https://www.openstreetmap.org/ (name, `shop=pastry`, address, phone, hours) | as 20c S-4 | P2 | after the owner's OK | owner OK |
| Restaurant Guru, Sluurpy | « Report incorrect information » / « Report error » on each page (no URL exposed; Restaurant Guru's « Claim your business » points to « # ») | verified (direct reads) | P3 | quarterly sweep | — |
| allbiz, foodpages, bdir.in | [[FACT NEEDED: routes (pages 403)]] | — | P3 | quarterly sweep | — |

---

## 5. What changes in docs/06 (row by row)

The current docs/06 §3 « État connu » is dated 25 October 2026. The changes below are for whoever edits docs/06. This step edits no other file.

### 5.1 The 34 rows of §3

| docs/06 row | « État connu »: what changes | « Geste »: what changes | Priority |
|---|---|---|---|
| Profil d'entreprise Google | Add: Google Maps does not open here (script shell, 2026-10-29). Its Google-sourced copy on Wanderlog shows 4.9 from 41, the Facebook page as website and Sunday 9 h–17 h, against 9 h 30 read on 2026-10-27. A separate Google place, « Pâtisserie Hygge Factory », 17, rue Court, exists in Restaurant Guru's copy (new P1 row) | Add: a dated screenshot settles the Sunday hour **before** any correction is sent | P0 (no change) |
| Apple Business | « Non vérifiée » → not opened (script shell); no Apple Maps place page for the shop surfaced in search, while other Granby shops have one | no change | P0 |
| Bing Places | « Non vérifiée » → not opened (Bing returned empty results pages) | no change | P0 |
| Page Facebook | Replace the 605 / 1 046 snapshots: 1,067 followers (20b, 29 October 2026); title « Pâtisserie Coco Vanille \| Granby QC ». The address facebook.com/103739695618750 is the same page (Sluurpy and Restaurant Guru link it) | no change | P0 |
| Instagram | Replace « vient du brief et n'a jamais été trouvé » and the T4 marker: verified (20b and this audit). « Coco•vanille »; both numbers in the bio; link to the Facebook page; 266 followers; newest post on 22 October 2026; no address | Keep « nom = nom de l'enseigne » (after S3); link to the site at launch | P0 |
| RestoMontreal | Add: not opened on 29 October (HTTP 403); the search summary still reports « peut être temporairement fermée » on the listing and on the list pages; Sunday 9 h–17 h 30 in one summary | Add: the correction route is not known ([[FACT NEEDED]]); open the listing in a normal browser to find the owner link. Unverified lead: hello@restomontreal.ca | P0 |
| Three Best Rated | Replace: on 29 October 2026 the bakeries page (EN « Best Bakeries in Granby, QC » and FR) lists **only** Pâtisserie Coco Vanille; Pain-Pain, Mélisse and the 450-770-7246 are gone. Sunday 9 h instead of 9 h 30. Score 4,8/5, no review count shown (the « 115 » is gone). Still absent from both cake lists. Drop the Pain-Pain closure sentence | Replace: model B (rewritten, §5.4) by email to support@threebestrated.ca in week 2; the free update form only at launch (it requires a website, an email, the start year, prices, 3 reviews and 3 photos); model F unchanged | P0 |
| Yelp.ca | « Aucune fiche trouvée » → not opened (HTTP 403) and still not found by search (29 October) | Add the route https://biz.yelp.com/claim (free) | P1 |
| Tripadvisor | Add: not opened (HTTP 403); the summary shows no hours, 4.4 from 7 on one version and 0 reviews on another | Add the route https://www.tripadvisor.com/business/claim-restaurant-listing-free | P1 |
| PagesJaunes | Replace: read on 29 October: « Patisserie Coco Vanille Inc », only 450-372-7177 (« Principal »), no hours, no site. The 450-372-5917 appears neither there, nor on Yellow Pages, nor on Canada411 | Route: public form https://www.pagesjaunes.ca/marchand/miseajour/102750737 (name, Facebook now, site at launch); hours through the owner dashboard. Drop the H3 marker from the row; the cell 438-528-7818 stays off until docs/05 decides | P1 |
| Foursquare | « Non trouvée » → not opened (login wall) and not found by search | Add the route https://foursquare.com/venue/claim (via summary) | P1 |
| Tastet | no change (not re-checked) | no change | P1 (pitch) |
| Chambre de commerce de la Haute-Yamaska | Replace the name conflict: the chamber's own site gives « Chambre de commerce et d'industrie Haute-Yamaska (CCIHY) », 825, suite 1, rue Bernard, Granby J2J 0H5, 450 372-6100, info@ccihy.com. It has an online « Répertoire des membres » (« plus de 540 entrepreneurs et industries »); the shop is not in its visible part; no fee is shown | Route: https://www.ccihy.com/formulaire-dadhesion/; [[FACT NEEDED: frais d'adhésion]] stays | P1 |
| Tourisme Granby région | « Aucune fiche Coco Vanille trouvée » → no listing page, but its article « Recette locale signée Tourisme Granby région! » (8 September 2022) names « la pâtisserie Coco Vanille », linked to the Facebook page | Ask about a listing (info@granbyregion.com, 450 372-7056); at launch, ask for the link to point to the site (and add the article to §5) | P1 |
| Marché public de Granby et région | Replace « page non datée »: read on 29 October 2026: name, categories « Spécialités » and « Sucré », no link, no description; © 2026 | Contact: info@marchepublicgranby.ca or https://marchepublicgranby.ca/contact/ (S10 stays open) | P1 |
| Wanderlog (correction) | Replace « 5,0 sur 21 »: read on 29 October: « Magog, QC » in the title and the breadcrumb, Granby address, Google 4,9 from 41, Sunday 9 h, website = the Facebook page | Route: the page's « Report an issue » (no address published); ask for the city **and** Sunday 9 h 30 | P1 |
| 411.ca | « Non trouvée » → still not found by search; Canada411 shows the PagesJaunes record (its result links the Yellow Pages listing) | no change | P2 → P3 |
| canada.chamberofcommerce.com (correction) | Add: not opened (HTTP 403); same hours in today's summary | Route: [[FACT NEEDED]] (page 403); no paid service | P2 |
| Tourisme Cantons-de-l'Est | Add: no page for the shop surfaced in search (29 October) | no change | P2 |
| Bonjour Québec | Add: no page for the shop surfaced in search (29 October) | no change | P2 |
| Réseau des Haltes gourmandes | no change (not re-checked) | no change | P2 |
| OpenStreetMap | « Non vérifiée » → verified (20c): no point for the shop; « 3, Rue Court » is mapped as an address interpolation | Add the shop with the owner's OK (20c S-4) | P2 |
| MapQuest (correction) | Add: page empty on 29 October; the indexed title still says « Coco Vanill » | Route: [[FACT NEEDED]]; never pay (Yext) to fix it | P2 |
| find-open.ca (correction) | Add: not opened (HTTP 403); the summary repeats the 20 August 2025 hours and shows reduced Halloween hours for 31 October 2026 | Route: [[FACT NEEDED]]; model D also asks to remove holiday hours the shop did not set | P2 |
| Restaurant Guru | « Non trouvée » → found: « Patisserie Coco Vanille », 3 Rue Court, 450-372-7177, no hours, updated 5 September 2026; it lists « Food delivery », « Dinner » and « Outdoor seating »; website = the Facebook page | Route: the page's « Report incorrect information »: remove delivery and dinner, add the hours | P3 |
| Le Panier Bleu | no change | no change | P3 |
| Aliments du Québec | no change | no change | P3 |
| Waze | « Non vérifié » → not found by search; Waze results carry Google place IDs, so the Google fix comes first (inference) | no change | P3 |
| Sluurpy (correction) | Add: read on 29 October: still 3,5 from 0 reviews; no hours; updated 5 June 2025; website = the Facebook page | Route: the page's « Report error » | P3 |
| Autres copies (foodpages, allbiz, D&B, bdir.in) | Add: none could be opened (HTTP 403); allbiz's summary still shows Thursday–Friday 9 h–16 h 30, Saturday 9 h–15 h; D&B carries the legal name, which suits a credit record. Add Cylex to the list (two entries, below) | no change (quarterly sweep) | P3 |
| WeddingWire.ca | no change | no change | gated |
| Bridebook | no change | no change | gated |
| Mariages.net / Mariée Québec | no change | no change | gated |
| Applications de livraison | Add: not listed (20b T-6, 29 October); Restaurant Guru wrongly shows « Food delivery » | no change | gated |

### 5.2 New rows for §3

| New row | État connu | Geste | Priority |
|---|---|---|---|
| Google place « Pâtisserie Hygge Factory », 17, rue Court (seen through Restaurant Guru) | Separate Google place (CID 8325714417058721602); no phone, hours or reviews; « Wheelchair accessible »; updated 13 September 2026; no second source | Owner question + phone screenshot; act on Google only if the business does not exist or duplicates the shop | P1 |
| Cylex, « Les petits trésors » (3 Rue Court, (450) 956-1656) | Probably the former bakery partnership of that name at the shop's address (struck off 2026-03-12, 20a; inference), with a « gluten-free » category (search summaries) | Ask Cylex to mark it closed ([[FACT NEEDED: route]]); owner: was the number ever the shop's? | P2 |
| Cylex, « Pâtisserie Cocovanille » | Shop listed on Cylex's Cowansville « Desserts » page; old snapshot (search summaries) | Quarterly sweep | P3 |
| Yellow Pages (EN) and Canada411 | The same record as PagesJaunes 102750737 | Fixed with PagesJaunes | P3 |

No row of docs/06 is deleted. The Airbnb place of research/01 §7 is not in docs/06.

### 5.3 §4.1, the lists

| List row | Change |
|---|---|
| Three Best Rated, « 3 Best Bakeries in Granby » | Rename « Best Bakeries in Granby, QC ». Who is on it: Coco Vanille alone (EN and FR), « Oui, 1re (seule) ». Problem: « Pain-Pain retiré; dimanche à 9 h au lieu de 9 h 30 ». Geste: model B (rewritten) |
| Three Best Rated, « 3 Best Cakes » / « 3 Meilleurs Pâtisseries » | Page order on 29 October: Avec un Grand A, Cake Design Granby, Rose Gâteaux (docs/19 recorded Cake Design first on 25 October). Coco Vanille is still absent (verified) |
| RestoMontreal (three rows) | Add: the closure line is still reported on 29 October (summary; pages 403) |
| Tourisme Granby région | « Non trouvée » → no listing; a 2022 article names the shop, linked to Facebook |
| Yelp, Tripadvisor, Tastet, Narcity, WeddingWire, Uber Eats, La Voix de l'Est | not re-checked: no change |

### 5.4 §4.3, the request models

| Model | Change |
|---|---|
| A (RestoMontreal) | Text unchanged. Add above it: the sending route is [[FACT NEEDED]]; send only after the dated Google screenshot |
| B (Three Best Rated) | **Rewrite.** Drop the Pain-Pain paragraph and the three press links: TBR already removed it. New subject: « Mise à jour : heures du dimanche, Pâtisserie Coco Vanille (Granby) ». Body: our listing shows Sunday 9 h–17 h; the hours on our Google listing are Wednesday to Saturday 8 h 30–17 h 30, Sunday 9 h 30–17 h, closed Monday and Tuesday; main number 450-372-7177. Send to support@threebestrated.ca. Same change for the English version |
| C (Wanderlog, MapQuest) | Wanderlog: through « Report an issue » on the page, city **and** Sunday 9 h 30. MapQuest: route unknown |
| D (find-open, chamberofcommerce) | Add one sentence: please remove any special or holiday hours we did not set (find-open shows Halloween hours, per a summary) |
| E (PagesJaunes) | Drop the 450-372-5917 sentence. Send through the public form https://www.pagesjaunes.ca/marchand/miseajour/102750737 (the name, and the Facebook page until the site exists) |
| F (TBR cakes) | Add: TBR's forms require the start year (C2), prices (P1), an email (H4), three photos and three customer reviews. Ask by email first which form applies. Use only real reviews, word for word, never written or edited by the shop; leave « Special Discounts » empty |

### 5.5 §5, mentions without a link

| Change | Detail |
|---|---|
| Add a row | Tourisme Granby région, « Recette locale signée Tourisme Granby région! », 8 September 2022: linked, but to the Facebook page → ask at launch for the link to point to the site |
| Marché public row | « À vérifier » → no link (read on 29 October 2026) |
| « Découvrez Granby et sa région » (La Voix de l'Est) | not re-checked: no change |

### 5.6 §2, the week plan

| Week | Change |
|---|---|
| 0 | Add: the « Hygge Factory » check (owner question, phone screenshot of the Google place) |
| 2 | Three Best Rated: email about Sunday only (model B rewritten); no Pain-Pain request. Yelp https://biz.yelp.com/claim; Foursquare https://foursquare.com/venue/claim; Tripadvisor claim URL; PagesJaunes public form |
| 3 | Wanderlog: city + Sunday; find-open and chamberofcommerce: also remove the holiday hours we did not set |
| Each quarter | Add to the sweep: Cylex (two entries), Restaurant Guru (two entries), Yellow Pages EN and Canada411, FindGlocal |

---

## 6. What changes elsewhere (hand-off; this step edits no other file)

| Where | Was | Now |
|---|---|---|
| `data/directories.csv` | Instagram « NOT surfaced »; TBR « #2 of 3 »; PagesJaunes « second phone 450-372-5917 »; Restaurant Guru, 411 « Not surfaced »; local chamber name conflict | as §5.1; add the four rows of §5.2 |
| research/01 §7 | Airbnb things-to-do in the live-citations list | remove: place 1364951 is a Chicago bakery |
| research/01 §2.2 and research/14 H3 | 450-372-5917 « on one Yellow Pages result » | not on any of the five YP-family pages read today; H3 to the lowest priority |
| research/14 (new questions for the owner) | — | (a) « Pâtisserie Hygge Factory », 17, rue Court: does it exist, and is it linked to the shop? (already 20c §9 item 4). (b) Was (450) 956-1656 ever the shop's number? |
| research/05 and the weekly scoreboard | B2's wrong answer cites TBR | TBR's live page is now clean: re-run B1 and B2 at the freeze run of Monday 2 November 2026, and note whether 450-770-7246 still comes back |
| docs/19 (rows on TBR: §1 point 4, the « fantôme » row, C8, coups n° 1–2, the lists table) | « Pain-Pain 1re, nous 2es » | Coco Vanille is the only business on TBR's bakeries page; Sunday 9 h remains; still absent from the cake lists |
| docs/05 §1 | Instagram « non vérifié » | verified (decision A10); the Google listing's website field = the Facebook page (Wanderlog's Google card) |
| research/20b (products, for the owner) | — | The 2022 Tourisme Granby article names « Éclairs au chocolat, napoléons, chaussons aux pommes » next to the shop: one tourism-board sentence from 2022, unverified for 2026; owner « oui » before any use |

---

## 7. Open items

**Owner (one reply and a few screenshots):**
1. A dated screenshot of the Google listing: status, name, Sunday hour, website field, review count (research/14 S1, S2, S7). It unblocks every hours correction.
2. « Pâtisserie Hygge Factory », 17, rue Court: real, related, or neither?
3. (450) 956-1656: ever the shop's number? Is 450-372-5917 anything at all (H3, low)?
4. The sign photo (S3), before any rename anywhere.
5. The start year (C2), an email (H4) and prices (P1). Three Best Rated's forms ask for all three.

**Agency, by hand in a normal browser or on a phone:**
6. Open the pages that refused the reader (RestoMontreal, Tripadvisor, find-open.ca, canada.chamberofcommerce.com, allbiz, foodpages, D&B, bdir.in, Cylex, Yelp). Note what each shows and the exact correction link.
7. Read the Apple Maps, Bing Maps and Facebook « À propos » cards on a phone, with dated screenshots.
8. Re-run B1 and B2 after the first corrections and record the lag. This step could not measure one.

**Search queue (not run; the cap was reached):**
9. RestoMontreal's own contact or owner page.
10. MapQuest's help page for listing corrections.
11. Cylex's « modifier / signaler » route.
12. Tourisme Cantons-de-l'Est and Bonjour Québec listing rules (research/11 §7).

---

## Search log

### WebSearch (25 queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Filter | Useful result |
|---|---|---|---|
| 1 | "Pâtisserie Cocovanille" Granby | — | RestoMontreal and TBR; the summary repeats TBR's older hours (Thu–Fri 9–16:30, Sat 9–15) and the « temporairement fermée » line |
| 2 | "450-372-5917" OR "450 372-5917" OR "(450) 372-5917" OR "4503725917" | — | No page holds the number |
| 3 | Coco Vanille Granby pâtisserie | yelp.ca, yelp.com, foursquare.com | No business page for the shop; Yelp Granby lists; Coco Crepe |
| 4 | Cocovanille OR "Coco Vanille" Granby Rue Court | restaurantguru.com, restaurantguru.ca, 411.ca, canada411.ca, cylex-canada.ca, hotfrog.ca, n49.com | Cylex: the shop on a Cowansville page; « Les petits trésors », 3 Rue Court, (450) 956-1656 |
| 5 | Cocovanille Granby | foursquare.com, fr.foursquare.com, ca.foursquare.com | Nothing for the shop |
| 6 | "Hygge Factory" Granby | — | No second source |
| 7 | "petits trésors" OR Cocovanille Granby "Rue Court" | cylex-canada.ca, fr.cylex-canada.ca | Same two Cylex entries; page ages 624 to 1,520 days |
| 8 | Pâtisserie Cocovanille Granby heures temporairement fermée | restomontreal.ca | The closure line still reported; Sunday 9–17:30; 9:30 and 7:30 openings elsewhere |
| 9 | Patisserie Coco Vanille Granby Tripadvisor | tripadvisor.ca, tripadvisor.com, fr.tripadvisor.ca | 4.4 (7) vs 0 reviews; no hours; phone |
| 10 | Pâtisserie Cocovanille Granby 3 Rue Court hours | find-open.ca, canada.chamberofcommerce.com, allbiz.ca, mapquest.com, foodpages.ca | Three old schedules; Halloween hours on find-open; the MapQuest « Coco Vanill » title; Pain-Pain's « 450-770… » title |
| 11 | Cocovanille Granby pastry shop | restaurantguru.com, restaurantguru.ca | The shop on Restaurant Guru's desserts list |
| 12 | "Coco Vanille" OR Cocovanille Granby | 411.ca, canada411.ca, fr.canada411.ca, hotfrog.ca, n49.com, waze.com | Nothing for the shop; a Waze URL with a Google place ID |
| 13 | Pâtisserie Cocovanille OR "Coco Vanille" Granby | maps.apple.com, airbnb.ca, airbnb.com, airbnb.se, airbnb.dk, bing.com | No Apple Maps page for the shop (other Granby shops have one) |
| 14 | Coco Vanille pâtisserie Granby | granbyregion.com, cantonsdelest.com, easterntownships.org, bonjourquebec.com, ccihy.com, haute-yamaska.ca, granby.ca | The 2022 Tourisme Granby région article |
| 15 | "Coco Vanille" Granby 2025 OR 2026 | lavoixdelest.ca, granbyexpress.com, m105.ca, journalleguide.com, ici.radio-canada.ca, latribune.ca, noovo.info | Only the two 2022 articles |
| 16 | Chambre de commerce Haute-Yamaska répertoire des membres Granby | — | The two older name variants (then the chamber's site, read directly) |
| 17 | "Cocovanille" OR "Coco Vanille" Granby pâtisserie -parfum -perfume -Mancera | — | Perfume noise only |
| 18 | "Cocovanille" "J2G 4Y6" | — | Nothing |
| 19 | "Les petits trésors" Granby "956-1656" OR "Rue Court" boulangerie | — | No other copy |
| 20 | Pâtisserie Cocovanille Granby | findglocal.com, cybo.com, ca.cybo.com, infobel.com, top-rated.online, yably.ca, restaurantji.com, opendi.ca, brownbook.net, ourbis.ca, iglobal.co, wanderlog.com | Only Wanderlog; its summary repeats older data (5.0 from 21) |
| 21 | RestoMontreal propriétaire restaurant modifier fiche corriger informations contact courriel | — | No official route; hello@restomontreal.ca in a third-party profile |
| 22 | MapQuest business listing incorrect name how to correct or claim listing | — | Third-party leads only (Help Center, Yext, Yelp upstream) |
| 23 | Foursquare claim your business listing free verification how to claim venue 2026 | — | foursquare.com/venue/claim; Foursquare's « Claiming a listing » article |
| 24 | Tripadvisor claim your listing free business owner Management Center verify | tripadvisor.com, tripadvisor.ca, tripadvisor.co.uk, tripadvisorsupport.com | Tripadvisor's claim pages |
| 25 | canada.chamberofcommerce.com "claim" business listing update hours free | — | No route from the site itself; Yext integration page |

### WebFetch (62 reads, 2026-10-29)

| # | URL (short) | Result |
|---|---|---|
| 1 | wanderlog.com place 13122992 | Read (§2 #16) |
| 2, 55 | mapquest.com …754679978 (and `?lang=en`) | Empty page, twice |
| 3, 9 | threebestrated.ca/bakeries-in-granby-qc | Read twice (§2 #7) |
| 4 | threebestrated.ca/fr-boulangeries-in-granby-qc | Read (§2 #8) |
| 5 | pagesjaunes.ca listing 102750737 | Read (§2 #13) |
| 6 | sluurpy.com …9959902 | Read (§2 #31) |
| 7 | foodpages.ca/ptisseriecocovanille | HTTP 403 |
| 8, 18, 62 | restomontreal.ca 20633 FR, EN, FR without www | HTTP 403 |
| 10 | threebestrated.ca/cakes-in-granby-qc | Read (§2 #9) |
| 11, 19 | tripadvisor.ca and .com d27188801 | HTTP 403 |
| 12 | find-open.ca …1781027 | HTTP 403 |
| 13 | canada.chamberofcommerce.com …1192259 | HTTP 403 |
| 14 | allbiz.ca … | HTTP 403 |
| 15 | dnb.com company profile | HTTP 403 |
| 16 | restaurantguru.com/Patisserie-Hygge-Factory-Granby | Read (§2 #17) |
| 17 | threebestrated.ca/fr-gâteaux-in-granby-qc | Read (§2 #10) |
| 20 | bdir.in … | HTTP 403 |
| 21 | yellowpages.ca listing 102750737 | Read (§2 #14) |
| 22 | www.marchepublicgranby.ca exhibitor page | DNS failure |
| 23 | instagram.com/coco_vanillegranby/ | Read (§2 #5) |
| 24 | facebook.com/PatisserieCocoVanille/ | Title only |
| 25, 46 | bing.com/search (default, fr-CA) | Empty results page, twice |
| 26 | maps.apple.com/?q=… | Script shell |
| 27 | marchepublicgranby.ca/exposants/patisserie-coco-vanille/ | Read (§2 #18) |
| 28 | pagesjaunes.ca search « Coco-Vanille » Granby | Read: one result, 450-372-7177 only |
| 29 | yellowpages.ca search « Coco-Vanille » Granby | Read: one result, 450-372-7177 only |
| 30 | fr.cylex-canada.ca/cowansville/desserts.html | HTTP 403 |
| 31 | restaurantguru.com/link/a1:53799356 | 302 → maps.google.com/?cid=8325714417058721602 |
| 32, 34 | maps.google.com and google.com/maps, CID 8325714417058721602 | 302, then script shell |
| 33, 35 | maps.google.com and google.com/maps, CID 10789122976114705165 | 302, then script shell |
| 36 | restaurantguru.com/desserts-Granby-t12 | Read: the shop at rank 17 of page 1 |
| 37 | restaurantguru.com/Patisserie-Coco-Vanille-Granby | Read (§2 #30) |
| 38 | canada411.ca search « Coco Vanille » Granby | Read (§2 #37) |
| 39 | granbyregion.com/recette-locale-signee-tourisme-granby-region/ | Read (§2 #19) |
| 40 | airbnb.dk things-to-do 57fec99c… | Read: Vanille Pâtisserie, Chicago (not the shop) |
| 41 | ccihy.com | Read: name, address, phone, directory link |
| 42 | ccihy.com/repertoire-des-membres-2/ | Read (truncated) |
| 43 | ccihy.com/membres/ | Read: no fee shown |
| 44 | yelp.ca search « Coco Vanille » Granby | HTTP 403 |
| 45, 47 | foursquare.com/explore → app.foursquare.com/explore | 308, then login wall |
| 48 | threebestrated.ca/submit-business?reason=update | Read: the form's fields and terms |
| 49 | facebook.com/103739695618750 | Title « Pâtisserie Coco Vanille \| Granby QC » |
| 50 | business.foursquare.com/claim/ | Heading « Business Listings » only |
| 51 | wanderlog.com/contact | HTTP 404 |
| 52, 54 | biz.yelp.ca → business.yelp.com | 302, then read: the claim links |
| 53 | tripadvisor.ca/Owners | HTTP 403 |
| 56 | support.foursquare.com « Claiming a listing » | HTTP 403 |
| 57 | tripadvisor.com/business/claim-restaurant-listing-free | HTTP 403 |
| 58 | restaurantguru.com/link/119083002 | 302 → facebook.com/103739695618750 |
| 59 | pagesjaunes.ca/marchand/miseajour/102750737 | Read: the public correction form |
| 60 | granbyregion.com/nous-joindre/ | Read: contact details |
| 61 | airbnb.ca/things-to-do/places/1364951 | Read: Vanille Pâtisserie, Chicago (§2 #46) |

---

## Sources

All seen 2026-10-29. « Direct read » = opened with WebFetch. Otherwise a WebSearch summary or search-result title, as marked.

Listings of the shop, read directly
- Pâtisserie Cocovanille, Magog, QC (Wanderlog) — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-29
- Best Bakeries in Granby, QC (Three Best Rated) — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-29
- Boulangeries à Granby, QC (Three Best Rated, French page) — https://threebestrated.ca/fr-boulangeries-in-granby-qc — seen 2026-10-29
- 3 Best Cakes in Granby, QC (Three Best Rated) — https://threebestrated.ca/cakes-in-granby-qc — seen 2026-10-29
- 3 Meilleurs Pâtisseries à Granby, QC (Three Best Rated) — https://threebestrated.ca/fr-gâteaux-in-granby-qc — seen 2026-10-29
- Update Listed Business in Canada - FREE (Three Best Rated form) — https://threebestrated.ca/submit-business?reason=update — seen 2026-10-29
- Patisserie Coco Vanille Inc (PagesJaunes) — https://www.pagesjaunes.ca/bus/Quebec/Granby/Patisserie-Coco-Vanille-Inc/102750737.html — seen 2026-10-29
- Modifier les informations de l'entreprise (PagesJaunes form) — https://www.pagesjaunes.ca/marchand/miseajour/102750737 — seen 2026-10-29
- Patisserie Coco Vanille Inc (Yellow Pages) — https://www.yellowpages.ca/bus/Quebec/Granby/Patisserie-Coco-Vanille-Inc/102750737.html — seen 2026-10-29
- Coco-Vanille à Granby QC (PagesJaunes search) — https://www.pagesjaunes.ca/search/si/1/Coco-Vanille/Granby+QC — seen 2026-10-29
- Coco-Vanille in Granby QC (Yellow Pages search) — https://www.yellowpages.ca/search/si/1/Coco-Vanille/Granby+QC — seen 2026-10-29
- Coco Vanille, Granby QC (Canada411 search) — https://www.canada411.ca/search/si/1/Coco+Vanille/Granby+QC/ — seen 2026-10-29
- Patisserie Coco Vanille (Sluurpy) — https://www.sluurpy.com/en/granby/restaurant/9959902/patisserie-coco-vanille — seen 2026-10-29
- Patisserie Coco Vanille, Granby (Restaurant Guru) — https://restaurantguru.com/Patisserie-Coco-Vanille-Granby — seen 2026-10-29
- Top 5 restaurants with desserts in Granby, october 2026 (Restaurant Guru) — https://restaurantguru.com/desserts-Granby-t12 — seen 2026-10-29
- Coco•vanille (@coco_vanillegranby), Instagram — https://www.instagram.com/coco_vanillegranby/ — seen 2026-10-29
- Pâtisserie Coco Vanille | Granby QC (Facebook; title only) — https://www.facebook.com/PatisserieCocoVanille/ — seen 2026-10-29
- Pâtisserie Coco Vanille | Granby QC (Facebook numeric address; title only) — https://www.facebook.com/103739695618750 — seen 2026-10-29
- Pâtisserie Coco Vanille | Marché public de Granby et région — https://marchepublicgranby.ca/exposants/patisserie-coco-vanille/ — seen 2026-10-29
- Recette locale signée Tourisme Granby région! (8 September 2022) — https://granbyregion.com/recette-locale-signee-tourisme-granby-region/ — seen 2026-10-29

Confusion risks and false positives, read directly
- Pâtisserie Hygge Factory, Granby (Restaurant Guru) — https://restaurantguru.com/Patisserie-Hygge-Factory-Granby — seen 2026-10-29
- Restaurant Guru's Google link for that listing (HTTP 302 to https://maps.google.com/?cid=8325714417058721602) — https://restaurantguru.com/link/a1:53799356 — seen 2026-10-29
- Vanille Pâtisserie, Chicago (Airbnb things to do, place 1364951) — https://www.airbnb.ca/things-to-do/places/1364951 — seen 2026-10-29
- Vanille Pâtisserie, Chicago (Airbnb things to do, Danish site) — https://www.airbnb.dk/things-to-do/places/57fec99c-ac8c-4fd0-9192-971729a7a0c7 — seen 2026-10-29

Partners and associations, read directly
- Chambre de commerce et d'industrie Haute-Yamaska (home) — https://ccihy.com/ — seen 2026-10-29
- CCIHY, Répertoire des membres — https://www.ccihy.com/repertoire-des-membres-2/ — seen 2026-10-29
- CCIHY, Membres — https://www.ccihy.com/membres/ — seen 2026-10-29
- Tourisme Granby région, Nous joindre — https://granbyregion.com/nous-joindre/ — seen 2026-10-29
- Yelp for Business (claim links) — https://business.yelp.com/ — seen 2026-10-29

Not opened (the reason in brackets); facts from search summaries or titles
- Google Maps, CID 10789122976114705165 (script shell) — https://www.google.com/maps?cid=10789122976114705165 — seen 2026-10-29
- Google Maps, CID 8325714417058721602 (script shell) — https://www.google.com/maps?cid=8325714417058721602 — seen 2026-10-29
- Apple Maps (script shell) — https://maps.apple.com/?q=P%C3%A2tisserie%20Cocovanille&sll=45.3995807,-72.7250821 — seen 2026-10-29
- Bing (empty results page) — https://www.bing.com/search?q=P%C3%A2tisserie+Cocovanille+Granby — seen 2026-10-29
- RestoMontreal, Pâtisserie Cocovanille (HTTP 403; summary) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ — seen 2026-10-29
- RestoMontreal, EN page (HTTP 403) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/ — seen 2026-10-29
- Tripadvisor .ca (HTTP 403; summary) — https://www.tripadvisor.ca/Restaurant_Review-g182165-d27188801-Reviews-Patisserie_Coco_Vanille-Granby_Quebec.html — seen 2026-10-29
- Tripadvisor .com (HTTP 403; summary) — https://www.tripadvisor.com/Restaurant_Review-g182165-d27188801-Reviews-Patisserie_Coco_Vanille-Granby_Quebec.html — seen 2026-10-29
- Claim your Tripadvisor restaurant listing (HTTP 403; summary) — https://www.tripadvisor.com/business/claim-restaurant-listing-free — seen 2026-10-29
- Claim your free business listing, Tripadvisor (summary) — https://www.tripadvisor.co.uk/Owners — seen 2026-10-29
- find-open.ca, Pâtisserie Cocovanille (HTTP 403; summary) — https://find-open.ca/granby/p%C3%A2tisserie-cocovanille-1781027 — seen 2026-10-29
- canada.chamberofcommerce.com, Pâtisserie Cocovanille (HTTP 403; summary) — https://canada.chamberofcommerce.com/business-directory/quebec/granby/pastry-shop/1192259-patisserie-cocovanille — seen 2026-10-29
- canada.chamberofcommerce.com, Pain-Pain Boulangerie Artisanale (search-result title) — https://canada.chamberofcommerce.com/business-directory/quebec/granby/pastry-shop/60680-pain-pain-boulangerie-artisanale — seen 2026-10-29
- allbiz.ca (HTTP 403; summary) — https://www.allbiz.ca/p%C3%A2tisserie-cocovanille-450-372-7177 — seen 2026-10-29
- foodpages.ca (HTTP 403; title) — https://foodpages.ca/ptisseriecocovanille — seen 2026-10-29
- Dun & Bradstreet (HTTP 403) — https://www.dnb.com/business-directory/company-profiles.patisserie_coco_vanille_inc.def6e6d3ea762188a0f800c49a1dd49d.html — seen 2026-10-29
- bdir.in (HTTP 403) — https://www.bdir.in/p/best/ca/bakeries-in-granby-qc/MjMwNzk1 — seen 2026-10-29
- MapQuest, Patisserie Coco Vanill (empty page; title) — https://www.mapquest.com/ca/quebec/patisserie-coco-vanill-754679978 — seen 2026-10-29
- Cylex, Desserts à Cowansville (HTTP 403; summaries) — https://fr.cylex-canada.ca/cowansville/desserts.html — seen 2026-10-29
- Yelp search (HTTP 403) — https://www.yelp.ca/search?find_desc=Coco+Vanille&find_loc=Granby%2C+QC — seen 2026-10-29
- Yelp, Granby bakeries and cake shops (search-result titles) — https://www.yelp.com/search?find_desc=Bakeries&find_loc=Granby%2C+QC · https://www.yelp.com/search?cflt=cakeshop&find_loc=Granby,+QC — seen 2026-10-29
- Foursquare explorer (login wall) — https://app.foursquare.com/explore?near=Granby%2C%20QC&q=Coco%20Vanille — seen 2026-10-29
- Foursquare, « Claiming a listing » (HTTP 403; summary) — https://support.foursquare.com/hc/en-us/articles/23646714300444-Claiming-a-listing — seen 2026-10-29
- Waze, Orange Coco directions (a Google place ID in the URL; title) — https://www.waze.com/live-map/directions/ca/qc/granby/orange-coco?to=place.ChIJOfGBxzLPyUwR2MoyMMBcpYo — seen 2026-10-29
- Apple Maps, Le Cafe de la Brulerie (an indexed Granby place page; title) — https://maps.apple.com/place?place-id=I492225426B0930B — seen 2026-10-29

Third-party leads (search summaries; unverified)
- RestoMontreal profile with hello@restomontreal.ca (third-party; which of these profiles holds it: unverified) — https://nyne.ai/sc/restomontreal.ca · https://logokit.com/brands/restomontreal.ca — seen 2026-10-29
- How to Create a MapQuest Business Listing (Podium) — https://www.podium.com/article/mapquest-business-listing — seen 2026-10-29
- Moz Q&A forum, MapQuest corrections — https://mozdev.nodebb.com/community/q/post/29020 — seen 2026-10-29
- How to claim your listing on Foursquare (SOCi) — https://www.soci.ai/knowledge-articles/how-to-claim-your-listing-on-foursquare/ — seen 2026-10-29
- How to List a Business on Foursquare (Synup) — https://www.synup.com/en/how-to/list-business-on-foursquare — seen 2026-10-29
- Yext, chamberofcommerce.com integration — https://www.yext.com/integrations/chamberofcommerce-com — seen 2026-10-29

Earlier steps used, not redone
- research/20a (register, names, the 2022 press, Wanderlog's Google card), research/20b (Instagram, Facebook followers, PagesJaunes, delivery apps), research/20c (OSM, the map point, the Hygge Factory first sighting), research/20e (domain), research/21 (decisions A3, A7, A9, A10, B6) — seen 2026-10-29
- research/01 §2–§7, research/03 §4, research/05 W44, research/06 (c) and (o), research/11 §0–§7, research/14, docs/03, docs/05, docs/06, docs/19, data/directories.csv, data/facts.json — repo files, read 2026-10-29
