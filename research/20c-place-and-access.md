# 20c · Place and access: parking, the Zoo, the entrance, the map point (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Step: research « place and access », under Yahya's mandate of 2026-10-29 (« take all decisions based on what I give and web research, and make the full thing ready »). It runs the research topic that research/21 §4 left open (« Parking, entrance accessibility, distance from the Zoo »).
Machine-readable twin: `data/research-place.json` (one object per finding: `id`, `value`, `label`, `source`, `seen`, `note`; each `note` gives the row number used below).

How this was made, and its limits:
- **Official sources first: the Ville de Granby's own by-laws and plans.** These files were downloaded from granby.ca on 2026-10-29, read with pdftotext, and their annex maps were extracted at native resolution (poppler 25.07):
  - the consolidated traffic and parking by-law 1885-1990 (« codification administrative », revised 2026-09-18, 175 pages, SHA-256 `a4c10952…e45388`)
  - the night-parking by-law 1171-2022 (codification of 2022-12-12)
  - the draft of by-law 1479-2026 (tabled 2026-05-25), and two draft by-laws tabled 2026-10-19
  - the City's 2026 road-works deck (press conference of 2026-04-20) and its July 2026 transit brochure

  Limits:
  - The codification warns that it « n'a aucune sanction officielle »: the adopted by-laws and the signs on the street prevail.
  - The downtown street map (annex Y) is published at 1430 × 953 px, so its smallest labels cannot be read. The lot plans (annexes AA, BB and O) are 2200 × 1700 px and legible.
  - The promulgation notice of by-law 1479-2026 failed to open (TLS error at wallace.granby.ca). The codification shows that by-law in force instead (§1).
- **The Zoo's own site:** the « Horaire et directions » page (visitor address, parking) and the « Nous contacter » page (postal address).
- **OpenStreetMap** (data © OpenStreetMap contributors, ODbL), queried between 12:58 and 13:24 UTC:
  - Nominatim, for search and reverse geocoding: at most one request a second, with an identifying user agent and no personal data.
  - The OSM API 0.6, for one way, its history and two small bounding boxes.
  - Overpass timed out, then answered « at capacity ». The bounding-box calls replaced it.
- **Routing.** All the engines below give free-flow times: no traffic, no queue at the lights and no time to park. Times are rounded to the minute and written with « environ ».
  - Driving: the OSRM demo server (`router.project-osrm.org`, car profile), as the step required.
  - Cross-check: Valhalla (`valhalla1.openstreetmap.de`, auto costing).
  - Walking: FOSSGIS OSRM foot (`routing.openstreetmap.de/routed-foot`).
- **19 WebSearch queries** (standard mode, US-located) and **15 WebFetch reads**, all logged in §10.
- **Not done:**
  - no site visit and no Street View (Google Maps does not open in this environment, 20a)
  - no call to the City or to the shop
  - no reading of RestoMontreal (HTTP 403, as in 20a and 20b)
- **Labels:**
  - **verified** = an official source (the City's by-laws and plans, the Zoo's site), an owner source, two independent sources, or a direct observation of what a dataset (OSM) itself contains. A computed travel time or distance is verified only for the bound on which two engines agree.
  - **unverified** = one non-official source, one engine's output, a reading of the low-resolution street map, an inference, or an absence of evidence.

---

## 0. Bottom line (decision-relevant)

1. **Municipal parking downtown is free, and the City's nearest lot is about 100 m from the shop** (official by-law; the distance is computed).
   - **No meters since 12 June 2021.**
     - By-law 1043-2021 repealed the meters annex (annex E) and rewrote article 56.
     - Payment is now owed only in public lots that annex F lists as « à péage ». The only one listed is the Hôpital de Granby's lot (205, boulevard Leclerc Ouest).
   - **The nearest lot is « Centre-Court »:** the City's « Stationnement Centre-Ville, entre les rues Court et Centre (41, rue Centre) ». Its plan (annex BB) has been in force since **2026-06-12** (by-law 1479-2026). It has:
     - 4-hour spaces, 8 h–18 h Monday to Friday (37 per the draft)
     - 2-hour spaces, 8 h–17 h Monday to Friday, and one 2-hour strip
     - unlimited rows
     - two spaces « Réservé aux personnes handicapées »
     - rows reserved for permit holders
   - **Weekends:** the weekday limits do not apply on Saturday and Sunday, two of the shop's five opening days.
   - **Getting there on foot:** about 120 m, along rue Court and through the lot's driveway facing rue Victoria. The entrance comes from OSM and is unverified.
   - **On rue Court itself:** a 2-hour limit on the west side (annex Y).
   - **Other lots:**
     - Johnson (18, rue Johnson), about 150 m away: many unlimited rows, plus 4-hour, 2-hour and 1-hour spaces.
     - The church and Palace lots off rue Victoria: unlimited rows plus 4-hour spaces.
   - **Holidays: every year, from the first Monday of December to 3 January, time limits are lifted** in the Centre-Court, Johnson, Phoenix and Centre Notre-Dame lots. This year that runs from **7 December 2026 to 3 January 2027**. It is useful for holiday pickups, if that page is published.
   - **Winter nights (1 November–30 April):** parking is banned 1:00–6:30 only when the City triggers a snow operation. That is outside opening hours.
2. **The Zoo's visitor address is 1050, boulevard David-Bouchard Nord, Granby J2H 0Y6** (the Zoo's « Horaire et directions » page). Parking at lot P1 is free.
   - Its contact page gives another address: 525, rue St-Hubert, J2G 5P3. That is a postal address: don't use it for directions.
3. **The drive from the Zoo's P1 lot to 3, rue Court takes environ 5 minutes with one engine and environ 8 with the other.**

   | Engine | Distance | Time | Route |
   |---|---|---|---|
   | OSRM demo (the step's method) | 3.0 km | 301 s, « environ 5 minutes » | rue Saint-Hubert, then rue Principale |
   | OSRM, return trip | 2.9 km | 263 s | same streets |
   | Valhalla cross-check | 3.8 km | 455 s, « environ 8 minutes » | boulevard David-Bouchard Nord, then rue Dufferin |

   - Straight line: 2.2 km.
   - The engines agree only on a range: **« environ 5 à 8 minutes en auto (3 à 4 km) »** is the wording both support.
   - Without a car: the City's bus Circuit Nord runs from the « Saint-Hubert/Zoo » stop to the Terminus Centre-ville (rue du Centre). The terminus is about 290 m on foot from the shop.
4. **Nothing public describes the entrance.**
   - Not found: the number of steps, a threshold, the door width, a ramp.
   - No Google accessibility attribute appears in any copy we could read: Wanderlog shows none, RestoMontreal is blocked, Kéroul does not list the shop, and OSM has no tag.
   - → The marker [[FACT NEEDED: marches, largeur de porte et accès en fauteuil roulant]] stays (14 H5).
5. **The map point is right.** 45.3995807, -72.7250821:
   - is **10.6 m** from OpenStreetMap's position for « 3, Rue Court » (an address interpolation imported from NRCan CanVec in 2024)
   - lies on the **odd-numbered (east) side** of rue Court, about **35 m from rue Principale**
   - matches the Google-sourced map on Wanderlog to six decimals (45.399581, -72.725082)

   → `geo` moves from unverified to **verified**. OSM has no point for the shop itself.
6. **No public source describes a landmark at the door.**
   - On the maps, the shop sits a few steps from rue Principale, on the same side of rue Court as Le Palace de Granby (135, rue Principale, about 40–50 m).
   - That is an inference until the owner or a storefront photo confirms it (14 S3, H5).
7. **Watch list** (nothing here blocks the copy):
   - **Two draft by-laws tabled on 2026-10-19:**
     - The lot at 84, rue Court would be reserved for tenants holding a vignette. Never send customers there.
     - 57 spaces in the Phoenix, Johnson and Centre-Court lots would become usable overnight during snow operations.
   - **Rue Court is on the City's 2026 active-mobility list.** The type of work and the dates are not given, so street parking on rue Court may change.
   - **The 2026 water-main works on rue Principale (« phase 3 »)** run from rue Laval Nord to rue Saint-Hubert. That is 0.7 km or more west of rue Court, by OSM positions (an inference).

---

## 1. Parking near 3, rue Court (official rules)

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| P-1 | **No fee for municipal parking downtown.** Art. 56: « Tout conducteur qui immobilise ou stationne un véhicule routier dans un stationnement à péage situé dans un stationnement public identifié comme tel à l'annexe « F », doit payer […] ». The only lot annex F marks as paid is « Hôpital de Granby, 205, boulevard Leclerc Ouest (stationnement à péage) » (F-C, item 7). Annex E, « Liste des rues où il existe des chronomètres de stationnement », reads « Abrogé (règ. 1043-2021, art. 3) » | verified (official) | Codification 1885-1990, art. 56, annexes E and F (revised 2026-09-18) | 2026-10-29 |
| P-2 | **History of the meters.** In 2020 the by-law made downtown meters bearing a « Gratuit » sticker free: « Tel stationnement est cependant limité à 2 heures ». By-law **1043-2021** (adopted 2021-06-07, in force **2021-06-12**) then repealed art. 65 and annex E, replaced art. 56 and added annex Y, « Stationnement sur rue - Secteur centre-ville » | verified (official) | Codification, historical table | 2026-10-29 |
| P-3 | **The nearest municipal lot.** « Stationnement Centre-Ville, entre les rues Court et Centre (41, rue Centre) », owned by the City (annex F-A, item 1.0). It is the lot the by-law also calls « Centre-Court » (art. 45.3, art. 49.14, annex BB), and the annex Y map labels it « Stationnement Centre-Court » between rue Court and rue du Centre | verified (official) | Codification, annex F-A, art. 49, art. 49.14; annexes BB and Y | 2026-10-29 |
| P-4 | **Centre-Court plan (annex BB), in force 2026-06-12** (by-law 1479-2026; plan revised 2026-06-03). Space types: « Autorisé 4 h (8h-18h, Lun à Ven) » (the central rows; « trente-sept (37) cases » in the draft); « Autorisé 2 h (8h-17h, Lun à Ven) » (several small groups); one strip « Autorisé 2 h »; rows « Autorisé » (legend: « Illimité »); two spaces « Réservé aux personnes handicapées »; rows « Interdit excepté véhicules munis d'un permis "40 rue Court" » and « … "12 rue Court" »; one row « Interdit (1er Nov. au 30 Avr.) excepté véhicules munis d'un permis; Autorisé 2 h (8h-17h, Lun à Ven, 1er Mai au 31 Oct.) »; and « Privé » spaces | verified (official) | Codification p. 142 (annex BB); draft of 1479-2026, art. 8 (the number 37) | 2026-10-29 |
| P-5 | **Weekends.** The 4-hour and 2-hour (8 h–17 h) limits are labelled « Lun à Ven ». On Saturday and Sunday those spaces carry no time limit. The plain « Autorisé 2 h » strip and the permit and reserved rows are not limited to weekdays | verified (reading of the plan's labels; the signs prevail) | Annex BB | 2026-10-29 |
| P-6 | **Accessible spaces in Centre-Court.** The plan labels two spaces « Réservé aux personnes handicapées », with no permit mention. Separately, art. 45.3 b) reserves twelve vignette spaces in this lot for the Édifice Pierrette-Robichaud-Lafleur, « dont deux cases pour personnes handicapées ». **Whether the two labelled spaces are those two is unclear** | verified (both texts); who may use them: open | Annex BB; codification art. 45.3 b) (by-law 1409-2025) | 2026-10-29 |
| P-7 | **Walking distance to Centre-Court.** About **120 m (≈ 2 min)**: 97 m along rue Court, then 21 m on the driveway that faces rue Victoria. Straight line from the shop's point to the lot's aisles: 75–105 m. OSM also shows driveways from rue Principale and from rue du Centre. The City's plan does not show the entrances | unverified (computed on OSM data) | FOSSGIS OSRM foot; OSM ways 750434137, 742331596, 704899543 | 2026-10-29 |
| P-8 | **Rue Court, street parking.** The west side, from near rue Principale to beyond the lot, carries an orange 2-hour class. Further north a box reads « Zone débarcadère 30 min ». The corner segment is marked red (no parking). Whether the 2 hours apply only 8 h–18 h cannot be read at the published resolution. All three orange classes mean 2 hours for a customer | verified (official map) for the 2-hour limit; the hours window and the corner are unverified | Annex Y (codification p. 139; amended up to 1479-2026) | 2026-10-29 |
| P-9 | **Rue Principale at the corner of rue Court:** the north side (the shop's side) is marked « Stationnement interdit »; the south side is in the 1-hour (8 h–18 h) class. One space reserved for people with reduced mobility sits on the north side, east of rue Court | unverified (low-resolution map reading) | Annex Y | 2026-10-29 |
| P-10 | **The Johnson lot**, « Stationnement Johnson (18, rue Johnson) », owned by the City, between rue Saint-Joseph and rue Johnson. Plan (annex AA, in force 2026-06-12 and 2026-07-10): large rows « Autorisé » (unlimited); « Autorisé 4 h (8h-18h, Lun à Ven) » (27 spaces per the draft); « Autorisé 2 h (8h-17h, Lun à Ven) »; « Autorisé 1 h »; « Réservé aux personnes handicapées »; « Réservé aux véhicules électriques 4 h »; and winter permit rows. On foot: 120 m to its listed address, about 210 m to the middle of the lot | verified (rules, official); the distances are computed (unverified) | Codification p. 141 (annex AA; by-laws 1479-2026 and 1488-2026); draft of 1479-2026, art. 6 | 2026-10-29 |
| P-11 | **The lots off rue Victoria, east of rue Court** (behind the Palace and the Sainte-Famille church; annex O, in force 2026-06-12). Rows « Autorisé » (unlimited) along rue Victoria; « Autorisé 4 h (8h-17h, Lun à Ven) » « excepté détenteur vignette "Palace" »; 35 spaces of 4 h (8 h–18 h, Monday to Friday) in the Sainte-Famille church lot; several spaces « Réservé aux personnes handicapées ». The by-law also lists « Stationnement à l'arrière du Palace (135, rue Principale) » as a City-owned public lot | verified (official) | Codification p. 129 (annex O), art. 49.2, annex F-A item 11.0; draft of 1479-2026, art. 5 | 2026-10-29 |
| P-12 | **Electric vehicles:** 2 street spaces reserved for vehicles while charging, rue Victoria from rue Court to rue Dufferin, north side (art. 45.25, by-law 1244-2023). The Johnson lot also has spaces « Réservé aux véhicules électriques 4 h » | verified (official) | Codification art. 45.25; annex AA | 2026-10-29 |
| P-13 | **Holiday rule.** « le stationnement est permis en tout temps entre le 1er lundi du mois de décembre de chaque année et le 3 janvier suivant » in four lots: « stationnement Centre-Ville, entre les rues Court et du Centre (41, rue du Centre) », Johnson (18, rue Johnson), Phoenix (315, rue Principale) and Centre Notre-Dame (252, rue Principale). **For 2026–2027: Monday 7 December 2026 → Sunday 3 January 2027.** Reserved spaces stay reserved | verified (official; the dates are computed) | Codification art. 49 (by-laws 0083-2008 and 0822-2018) | 2026-10-29 |
| P-14 | **Winter nights.** « Il est interdit de stationner un véhicule routier sur tout chemin public entre une heure (1h) et six heures trente minutes (6h30) lorsqu'une opération de déneigement est déclenchée par la Ville ». The same applies in the public lots of its annex A. « L'interdiction […] s'applique du 1er novembre au 30 avril ». Operations are announced the day before on granby.ca, through the citizen alert system and at 450-776-8366. Minimum fine 30 $ plus costs; towing is possible. **Outside the shop's opening hours**: it concerns staff who park overnight, not customers | verified (official) | Codification of by-law 1171-2022, art. 3, 4, 6, 9 | 2026-10-29 |
| P-15 | **Draft, not in force (notice of motion 2026-10-19).** The lot at **84, rue Court** (« appartenant au Centre d'action bénévole de Granby inc. ») would be closed to parking « sauf pour les détenteurs de vignettes », the tenants of the Édifice Pierrette-Robichaud-Lafleur. The same draft adds 2 taxi spaces and 4-hour spaces on rue Saint-Antoine Sud, Communauto spaces, and two pedestrian crossings | verified (as a draft) | Draft by-law amending 1885-1990 (annexes C, L, Q, Y, F, CC) | 2026-10-29 |
| P-16 | **Draft, not in force (2026-10-19).** « Il est autorisé de stationner un véhicule routier dans 57 cases réparties entre les stationnements Phoenix, Johnson et Centre-Court […] entre une heure (1 h) et six heures trente minutes (6 h 30), durant les opérations de déneigement » | verified (as a draft) | Draft by-law amending 1171-2022 | 2026-10-29 |
| P-17 | **A third-party claim we do not use.** A Turo travel guide says street parking along rue Principale « généralement avec des parcomètres », recommends a « stationnement Blanchard », and says many public lots are free on weekends. The meters are contradicted by P-1 and P-2 | unverified; not used | turo.com (search summary) | 2026-10-29 |
| P-18 | **The meters removal was planned in 2019.** Granby Express (April 2019) reported that the City « compte également enlever les parcomètres pour laisser place à des stationnements d'une durée d'environ … » (the snippet is cut there) | unverified (search summary of a BAnQ copy; not opened) | collections.banq.qc.ca (see Sources) | 2026-10-29 |

Reading:
- **Fee.** « Le stationnement municipal est gratuit au centre-ville » rests on the by-law: no meter annex, and no downtown lot listed as « à péage ». This is a reading of the official text, not a sentence the City publishes in those words. No City page on downtown parking was found: granby.ca/fr/stationnement returns 404.
- **Time limits.** For a customer, the binding limits are the 4-hour and 2-hour weekday spaces in the lots, and the 2-hour limit along rue Court. On Saturdays and Sundays the lots' weekday limits do not apply.
- **Weekday visits.** Most stops at a pastry shop are short, so a 2-hour limit is not a practical constraint on Wednesday to Friday either.
- **Seasonal change.** From 1 November, the winter permit rows in Centre-Court and Johnson become permit-only. Plenty of unlimited and time-limited spaces remain.

---

## 2. The Zoo de Granby: address, parking, the drive

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| Z-1 | **Visitor address:** « 1050 boul. David-Bouchard N, Granby, QC, J2H 0Y6. » (the address block, and again in the public-transit section) | verified (official) | zoodegranby.com/horaire (« Horaire et directions ») | 2026-10-29 |
| Z-2 | **Postal address:** « 525, rue St-Hubert, Granby, (Québec) J2G 5P3 »; phone « (450) 372-9113 ». The J2G 5P3 that a Wikipedia mirror gives belongs to this address. Not for directions | verified (official) | zoodegranby.com/contactez-nous | 2026-10-29 |
| Z-3 | **Parking at the Zoo.** Lot P1: « Stationnement gratuit disponible sur place. » « Lors des journées plus achalandées, le Zoo de Granby offre deux stationnements alternatifs avec services de navettes », with entrances labelled « Entrée rue Dufferin » and « Entrée rue des Colombes » | verified (official) | zoodegranby.com/horaire | 2026-10-29 |
| Z-4 | **The P1 point used for routing:** Nominatim « Zoo de Granby P1 » → 45.4196974, -72.7253607 (OSM way 338552937, tagged `fee=no`, `access=customers`). Nominatim has no point for « 1050 boulevard David-Bouchard Nord »: the search returns only road segments | verified (observed in OSM) | nominatim.openstreetmap.org | 2026-10-29 |
| Z-5 | **OSRM demo, P1 → 3, rue Court** (the shop's point): 3,000.7 m, 300.9 s → **« environ 5 minutes » (environ 3,0 km)**. Route: lot aisles (176 m), rue Saint-Hubert (2,062 m), rue Principale (732 m), rue Court (31 m). Snaps: origin 7.7 m, destination 17.0 m. To Nominatim's « 3, Rue Court » point instead: 2,990.3 m, 299.3 s | unverified (one engine; free flow) | router.project-osrm.org (13:06 UTC) | 2026-10-29 |
| Z-6 | **OSRM return trip, 3, rue Court → P1:** 2,878.3 m, 263.0 s → « environ 4 minutes ». From the Zoo's mapped centroid (way 76938457; origin snapped 135 m): 3,161.7 m, 340.0 s (« environ 6 minutes ») | unverified (one engine) | router.project-osrm.org | 2026-10-29 |
| Z-7 | **Valhalla cross-check, P1 → 3, rue Court:** 3.833 km, 454.8 s → **« environ 8 minutes »**. Route: rue Saint-Hubert (96 m), boulevard David-Bouchard Nord (672 m), rue Dufferin (2,651 m), rue Principale (207 m), rue Court (31 m) | unverified (one engine) | valhalla1.openstreetmap.de (13:14 UTC) | 2026-10-29 |
| Z-8 | **What both engines support:** **5 to 8 minutes by car, 3 to 4 km**, depending on the route and before traffic. Straight line P1 → shop: 2,237 m | verified (two engines agree on this range; computed) | Z-5, Z-7 | 2026-10-29 |
| Z-9 | **By city bus:** Circuit Nord, stop 27 « Saint-Hubert/Zoo » (moved in summer, per the brochure) ↔ Terminus Centre-ville, two departures an hour at the Zoo stop on weekdays (:16 and :46). Regular fare 3,25 $; reduced 3 $; « Gratuit pour les enfants de 12 ans et moins obligatoirement accompagnés ». Service: Monday–Wednesday 6 h 30–19 h 30, Thursday–Friday 6 h 30–22 h, Saturday–Sunday 8 h–18 h 30 | verified (official) | City of Granby transit brochure (July 2026) | 2026-10-29 |
| Z-10 | **Walk from the Terminus Centre-ville to the shop:** about 290 m (≈ 4 min), via rue du Centre and rue Principale | unverified (computed on OSM) | FOSSGIS OSRM foot; OSM way 580993446 « Terminus Centre » | 2026-10-29 |

Method, for whoever re-runs it:
- **Origin:** the Zoo's main lot P1, as Nominatim returns it. The Zoo's own page sends drivers to P1.
- **Destination:** the shop's point 45.3995807, -72.7250821 (G-1).
- **OSRM call:** `https://router.project-osrm.org/route/v1/driving/-72.7253607,45.4196974;-72.7250821,45.3995807?overview=false&steps=true`.
- **Rounding:** the duration in seconds ÷ 60, rounded to the nearest minute.
- **Not modelled:**
  - waiting at traffic lights (OSRM)
  - summer traffic around the Zoo
  - the time to leave P1 and to park downtown
  - the Zoo's alternative lots on busy days, which were not routed

Reading:
- OSRM's « environ 5 minutes » is what the step asked for. A second engine says « environ 8 minutes » by another route.
- A visitor's GPS can choose either route, so a single figure would overstate the precision.
- → For the site: « environ 5 à 8 minutes en auto (3 à 4 km) » (§8).

---

## 3. The entrance: accessibility

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| A-1 | **No public description of the entrance**: no count of steps, threshold, door width, door type, ramp or which door to use. Places checked: the shop's 12 visible Instagram captions (20b), Wanderlog (« Accessibility: none found »), Kéroul (the shop is not listed), and five searches (§10, queries 8–12 and 17). RestoMontreal, which often copies Google's accessibility attributes, returned HTTP 403. Google Maps does not open here | unverified (absence of evidence) | wanderlog.com; keroul.qc.ca; search | 2026-10-29 |
| A-2 | **OpenStreetMap** has no `wheelchair=*` or `entrance=*` tag at 3, rue Court, and no point for the shop at all (G-4) | verified (observed in OSM) | OSM API, bounding box around the shop | 2026-10-29 |
| A-3 | **Context only, not about no. 3:** in Kéroul's 2022 evaluations of other downtown food shops, Pain-Pain Boulangerie Artisanale (120, rue Principale) is rated partly accessible (among other things, a threshold that is too high and no automatic door opener), and Tartes et Clafoutis (189, rue Principale) is rated not accessible | unverified (search summaries) | keroul.qc.ca (see Sources) | 2026-10-29 |
| A-4 | **Nearest reserved parking** for people with disabilities: P-6 (Centre-Court, open question), P-10 (Johnson), P-11 (the lots off rue Victoria), P-9 (rue Principale, map reading) | see those rows | — | 2026-10-29 |

→ The site keeps its marker. Five lines and one photo from the owner close it (§9, item 1). Afterwards, a free Kéroul evaluation would give the shop a public accessibility record, as its neighbours have. This is a suggestion, not a decision.

---

## 4. The shop's map point against OpenStreetMap

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-1 | **45.3995807, -72.7250821 is consistent with 3, rue Court.** It is 10.6 m from Nominatim's « 3, Rue Court » (45.3995025, -72.7251600) and 16 m from the CanVec address point « 1 rue Court » (45.399457, -72.7251861). It sits on the east side of rue Court (17 m from the centreline; the routing snap is at -72.725278). The east side carries the odd numbers in the data (« 6 rue Court » lies west, at -72.7254046). It is 35 m from the rue Principale / rue Court junction | verified (OSM, plus the Google pin in G-2: two independent datasets) | Nominatim search; OSM way 1261961939 | 2026-10-29 |
| G-2 | **Wanderlog's Google-sourced map** shows 45.399581, -72.725082: the same pin as the brief's pointer, to six decimals | verified (observed on the page; the same Google source as the brief) | wanderlog.com place 13122992 | 2026-10-29 |
| G-3 | **How precise the OSM check is.** OSM's rue Court addresses are an odd-number interpolation from no. 1 to no. 37 (way 1261961939: `addr:interpolation=odd`, source NRCan-CanVec-10.0, 2024-03-12). It is about 98 m long, roughly 5.5 m per odd number. Reverse geocoding the shop's point returns « 7, Rue Court » on the same line. The check is good to about ±15 m: enough for `geo`, not a door location. The Google pin is about 17 m from the street, inside the building | verified (observed in OSM) | OSM API 0.6 way 1261961939 (full, history) | 2026-10-29 |
| G-4 | **OSM has no point for the shop.** Nothing named « Coco Vanille » or « Cocovanille » appears within 600 m, and a Nominatim search for « Coco Vanille Granby » is empty. Nearby OSM points may be stale: « DaTeresa » at 13 Court (RestoMontreal lists Da Teresa as permanently closed, 20a) and the café « Madame Hortense » at 141, rue Principale (last edited 2016) | verified (observed in OSM); the staleness is unverified | OSM API bounding box; Nominatim | 2026-10-29 |
| G-5 | **Postcode.** Nominatim displays J2G 4W9 for the interpolated « 3, Rue Court ». That code is computed, not tagged. OSM's rue Court segment and the DaTeresa point (13 Court) show **J2G 4Y6**, as does the register (20a). The site keeps J2G 4Y6 | verified (observed) | Nominatim; OSM node 2061488498 | 2026-10-29 |

→ No change to the site: the schema `geo` already uses 45.3995807, -72.7250821. `data/facts.json` can mark it verified (§8).

---

## 5. A landmark near the door

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| L-1 | **No public source describes what is at or next to the door**: no review, directory, owner post or press article. Searched in English and French (« près », « à côté », « en face », « Palace ») | unverified (absence of evidence) | search (§10, queries 11, 14) | 2026-10-29 |
| L-2 | **Candidates from the maps (not a public description):** the corner of rue Principale (about 35 m); **Le Palace de Granby**, the performance hall at 135, rue Principale (about 40–50 m, on the same east side of rue Court); Église Sainte-Famille (about 110 m); St. George's church across rue Principale (about 100 m) | unverified (inference from OSM and annex Y) | OSM nodes 4399965403, way 76931068, way 442309529; Nominatim « 135, Rue Principale »; annex Y | 2026-10-29 |
| L-3 | **Le Palace de Granby's address:** 135, rue Principale, Granby J2G 2V1 (several listings agree) | verified (two sources) | quebecvacances.com; sortirauquebec.com (search summary) | 2026-10-29 |

→ Until the owner says what customers see (or a storefront photo shows it), the site says only « au 3, rue Court, à quelques pas de la rue Principale ». The 35 m figure supports that phrasing; it is a reading of the map, so it is flagged in §8.

---

## 6. Works, traffic and transit to know about

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| W-1 | **Water-main works in 2026:** « Rue Principale Phase 3 — De la rue Laval Nord à la rue Saint-Hubert — 0,30 km ». No dates are given (the City's 2026 works page leaves them blank). By OSM positions, that segment is 0.7 km or more west of rue Court and not on OSRM's route from the Zoo, which turns east from rue Saint-Hubert | verified (the segment); the location relative to the shop is an inference (unverified) | City of Granby, « Travaux de voirie 2026 » (2026-04-20); granby.ca/fr/travaux-voirie | 2026-10-29 |
| W-2 | **Rue Court is listed in the City's 2026 active-mobility network** (« Rues diverses », 2.18 km, together with avenue du Parc and others). The type of work and the dates are not given | verified (listed); the effect on parking is unknown | « Travaux de voirie 2026 » deck | 2026-10-29 |
| W-3 | **One-way streets next to the shop:** rue Victoria between rue Dufferin and rue Court: « Interdiction de conduire dans la direction est-ouest ». Avenue du Parc between rue Dufferin and rue Court: « Interdiction de conduire dans la direction est » (by-law 1483-2026, in force 2026-06-26) | verified (official) | Codification, annex B items 8.0 and 18.0 | 2026-10-29 |
| W-4 | **Rue Dufferin repaving, « De la rue Court à la rue Bourget »** (0.5 km, 2025 work to be completed in 2026). Rue Court meets rue Dufferin further north; this is not at the shop | verified (official) | « Travaux de voirie 2026 » deck | 2026-10-29 |

---

## 7. Side findings (outside this step)

| # | Finding | Label | Source | For |
|---|---|---|---|---|
| S-1 | **Restaurant Guru lists « Pâtisserie Hygge Factory », 17 Rue Court**, Granby: « Wheelchair accessible », a « wheelchair-accessible parking area », no hours, no reviews, « Updated on: Sep 13, 2026 ». No second source found. If it is real, a second pastry listing four doors up the same street could confuse visitors and AI answers | unverified | restaurantguru.com | the citations step; ask the owner |
| S-2 | **Walk to the Marché public** (176, rue Principale, place du Marché): about **160 m (≈ 2 min)** | unverified (computed; one engine) | FOSSGIS OSRM foot; Nominatim | facts.json `fact_needed`; the market pages |
| S-3 | **Drive to the CINLB at lac Boivin** (700, rue Drummond): about **3.5 km, « environ 5 minutes »**, via rue Principale and rue Drummond | unverified (computed; one engine) | OSRM demo | facts.json `fact_needed` |
| S-4 | **Add the shop to OpenStreetMap** (name, `shop=pastry`, 3, rue Court, phones, hours; `wheelchair=*` once known). Many map apps and AI tools read OSM, and the shop is absent from it today (G-4). Do it only with the owner's OK | suggestion | — | the citations step (research/11) |

---

## 8. What this changes elsewhere (hand-off; this step edits no other file)

| Where | Was | Now |
|---|---|---|
| `data/facts.json` `entity.geo.status` | « unverified (brief's Google Maps pointer; Maps not openable) » | **verified**: within 11 m of OSM's position for no. 3, and the same Google pin as Wanderlog (G-1…G-3) |
| `data/facts.json` `fact_needed`: « Seating count, Wi-Fi, parking (with photos) » | open | public parking answered (P-1…P-13). Seats, Wi-Fi and which door stay with the owner |
| `data/facts.json` `fact_needed`: « Walking distance from 3 rue Court to the Marché public, Zoo de Granby and Lac Boivin » | open | Marché public ≈ 160 m on foot (S-2); Zoo 5–8 min by car (Z-8); CINLB ≈ 5 min by car (S-3) |
| research/21 §4: « Parking, entrance accessibility, distance from the Zoo » | not run (spending limit) | parking and the Zoo answered here; the entrance stays with the owner (A-1) |
| `apps/web/src/seed/content.js`: `PARKING_FR` / `PARKING_EN` (the FAQ, `/nous-trouver/`, `/en/visit/`) | [[FACT NEEDED: stationnement près du 3, rue Court (rues, terrains, tarifs)]] | candidate text below |
| `content.js`: the Zoo markers (« minutes en auto du Zoo de Granby au 3, rue Court », « minutes by car from the Granby Zoo to 3 rue Court », « driving time from the Granby Zoo to 3 rue Court ») | marker | « environ 5 à 8 minutes en auto (3 à 4 km) » |
| `content.js`: the accessibility markers (« marches, largeur de porte et accès en fauteuil roulant ») | marker | **unchanged** (A-1) |
| research/04 F26, F27, E13, S14 and research/05 L5, L8 | distance and parking [[FACT NEEDED]] | answerable now |

Candidate copy for the decisions step (Québec French first). The facts come from the City's by-law; the distances are computed and keep « environ »:

- **Parking** (FAQ « Où se stationner près de la boutique? »; `/nous-trouver/`)
  - FR: « Le stationnement municipal est gratuit au centre-ville de Granby. Le plus proche est le stationnement Centre-Court, entre les rues Court et du Centre, à environ 100 m de la boutique : cases de 4 h et de 2 h (limites du lundi au vendredi) et rangées sans limite de temps. Sur la rue Court, le stationnement est limité à 2 h. Le stationnement Johnson (18, rue Johnson), de l'autre côté de la rue Principale, est à environ 150 m. Suivez toujours les panneaux. »
  - EN: « Municipal parking is free in downtown Granby. The closest lot is the Centre-Court lot, between rue Court and rue du Centre, about 100 m from the shop: 4-hour and 2-hour spaces (limits apply Monday to Friday) and rows with no time limit. On rue Court, parking is limited to 2 hours. The Johnson lot (18 rue Johnson), across rue Principale, is about 150 m away. Always follow the signs. »
- **The Zoo** (FAQ « À quelle distance du Zoo de Granby est la boutique? »)
  - FR: « La boutique est à environ 5 à 8 minutes en auto du Zoo de Granby (3 à 4 km selon le trajet), sans compter la circulation. Le Zoo est au 1050, boulevard David-Bouchard Nord. »
  - EN: « The shop is about 5 to 8 minutes by car from the Granby Zoo (3 to 4 km depending on the route), not counting traffic. The Zoo is at 1050 boulevard David-Bouchard Nord. »
- **Holidays** (only on a holiday page, if one is published)
  - FR: « Du 7 décembre 2026 au 3 janvier 2027, les limites de temps sont levées dans les stationnements municipaux Centre-Court, Johnson, Phoenix et Centre Notre-Dame (les cases réservées restent réservées). »
  - EN: « From 7 December 2026 to 3 January 2027, time limits are lifted in the municipal Centre-Court, Johnson, Phoenix and Centre Notre-Dame lots (reserved spaces stay reserved). »
- **Where it is**
  - FR: « au 3, rue Court, à quelques pas de la rue Principale »
  - EN: « at 3 rue Court, a few steps from rue Principale »

  Based on G-1 (35 m); keep it only if the owner agrees.
- **Not written:** the accessible spaces in Centre-Court (P-6, open) and any landmark (L-1).

---

## 9. Open items (routed)

**Owner facts** (one reply and one photo):
1. **The entrance** (14 H5): how many steps, and how high? A threshold? The door's width, and does it push, pull or open automatically? Which door do customers use? Is there a ramp or a bell? Send one photo of the storefront from the sidewalk. The same photo answers the sign question (14 S3) and the landmark.
2. **What customers see at the door** (L-2): for example « à côté du Palace » or « face au stationnement ». Use it only once the owner confirms it.
3. **Does staff park overnight** in winter? P-14 applies to them, not to customers. This is an information point only.
4. **« Pâtisserie Hygge Factory », 17 rue Court** (S-1): does it exist? It matters for directions.

**Checks with the City** (one email to the City's traffic service):
5. Can any holder of a SAAQ disability vignette use the two « Réservé aux personnes handicapées » spaces in Centre-Court, or are they part of the Édifice Pierrette-Robichaud-Lafleur's twelve (P-6)?
6. On rue Court's west side, does the 2-hour limit apply at all times or only 8 h–18 h (P-8)? Which entrances to the Centre-Court lot are public (P-7)?
7. The two drafts of 2026-10-19 (P-15, P-16): were they adopted, and when do they take effect? Re-check in December.

**Agency** (no decision taken here):
8. **Re-run the routes once a year**, or when the City changes the streets around the Zoo (W-1).
9. **On a busy summer day, the Zoo's alternative lots** (rue Dufferin, rue des Colombes) change the trip. Not routed (Z-3).

### Proposals for the decisions step (place only)

If adopted, each is recorded as « Décision de l'Agence du 29 octobre 2026 (mandat de Yahya), modifiable par la propriétaire ».

| # | Proposal | Evidence |
|---|---|---|
| PL-1 | Publish the parking answer in §8: free municipal parking, the Centre-Court and Johnson lots, the 2-hour limit on rue Court, « suivez les panneaux ». Date it with « règles de la Ville en vigueur depuis le 12 juin 2026 » in the change note, and re-check after the two drafts of 2026-10-19 | P-1…P-13 |
| PL-2 | Answer the Zoo question with the range « environ 5 à 8 minutes en auto (3 à 4 km) » and the visitor address. Never use the 525, rue St-Hubert postal address for directions | Z-1, Z-2, Z-5…Z-8 |
| PL-3 | Keep the accessibility markers until the owner answers item 1. Write nothing about steps or doors in the meantime | A-1 |
| PL-4 | Mark `geo` as verified in facts.json; no change to the schema values | G-1…G-3 |
| PL-5 | On the holiday page, only if it is published: the lifted time limits, 7 December 2026 → 3 January 2027 | P-13 |

---

## 10. Search log

### WebSearch (19 queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Filter | Useful result |
|---|---|---|---|
| 1 | Ville de Granby stationnement centre-ville gratuit durée rue Principale | — | Annex Y amendments (2025, 2026); the Turo guide's « parcomètres » claim (P-17) |
| 2 | Zoo de Granby adresse boulevard David-Bouchard | — | 1050, boulevard David-Bouchard Nord, J2H 0Y6 (directories); J2G 5P3 on a Wikipedia mirror |
| 3 | granby.ca stationnement centre-ville stationnements municipaux carte tarifs | — | The 2024 winter-vignette notice (Johnson, Centre-Court, Phoenix); the 2026 draft |
| 4 | Granby parcomètres centre-ville stationnement gratuit | — | Nothing new |
| 5 | site:granby.ca stationnement | — | The old codification URL (now 404); promulgation PDFs |
| 6 | Granby retire parcomètres centre-ville stationnement gratuit 2021 | — | Granby Express, April 2019: plan to remove the meters (P-18) |
| 7 | "centre-ville de Granby" stationnement gratuit rue Principale commerces | — | Only the Turo guide again |
| 8 | "Cocovanille" Granby wheelchair accessible entrance | — | Nothing about the shop |
| 9 | "Coco Vanille" Granby "accessible en fauteuil roulant" OR "entrée accessible" OR "accès fauteuil" | — | Nothing about the shop |
| 10 | "Pâtisserie Cocovanille" accessibilité OR accessibility OR "fauteuil roulant" OR wheelchair | — | Nothing |
| 11 | "Coco Vanille" OR "Cocovanille" Granby Palace "rue Court" près OR "à côté" OR "en face" | — | No landmark description |
| 12 | Pâtisserie Cocovanille Granby accessibility wheelchair parking | restomontreal.ca, tripadvisor.ca, tripadvisor.com, yelp.ca, restaurantguru.com, find-open.ca, cylex-canada.ca, foodpages.ca | Nothing about the shop; « Pâtisserie Hygge Factory, 17 Rue Court » surfaced (S-1) |
| 13 | "Hygge Factory" Granby rue Court pâtisserie | — | No second source |
| 14 | Palace de Granby adresse 135 rue Principale salle de spectacle | — | 135, rue Principale, J2G 2V1 (L-3) |
| 15 | Kéroul Granby pâtisserie OR boulangerie OR café accessible établissement | keroul.qc.ca | The shop is not listed; 2022 evaluations of other downtown shops (A-3) |
| 16 | Granby "rue Principale" "phase 3" travaux 2026 égout aqueduc segment | — | Phase 3 = rue Laval Nord → rue Saint-Hubert, 0.30 km (W-1) |
| 17 | "3 Rue Court" Granby wheelchair OR "fauteuil roulant" OR "accessible entrance" OR "entrée accessible" | — | Nothing |
| 18 | "Zoo de Granby" "centre-ville" "minutes" en voiture OR auto OR "à pied" | — | No published time; a rental listing says « within 2 miles (3 km) » |
| 19 | stationnement "Centre-Court" Granby 2026 | — | Promulgation notice of 1479-2026 dated 2026-06-12 (summary) |

### WebFetch (15 reads, 2026-10-29)

| # | URL (short) | Result |
|---|---|---|
| 1 | zoodegranby.com/ | No address in the text; links to /horaire and /contactez-nous |
| 2 | zoodegranby.com/horaire | Z-1, Z-3 |
| 3 | granby.ca/…/2026-05/13.1-0-2026modregcirc-annexes-y-o-aa-bb.pdf | Binary to the reader. The tool saved the file, which was then read locally (text and images) |
| 4 | wallace.granby.ca/…/gen-promulgation-1479-2026.pdf | TLS handshake failure |
| 5 | granby.ca/fr/stationnement | HTTP 404 |
| 6 | granby.ca/documents/44311/81555/Codification…aj28avril2023.pdf | HTTP 404 (old site) |
| 7 | granby.ca/ | Links: Règlements municipaux, Travaux de voirie 2026, Déneigement, Cartes interactives |
| 8 | granby.ca/fr/deneigement | « Déneigement 2026-2027 » strategy; no parking rule in the first 100,000 characters (not read further; by-law 1171-2022 read instead) |
| 9 | granby.ca/fr/ville/reglements-municipaux | Links to the codification revised 2026-09-18, by-law 1171-2022 and the two drafts of October 2026 |
| 10 | wanderlog.com place 13122992 | A-1 (no accessibility attributes), G-2 (coordinates) |
| 11 | restomontreal.ca resto 20633 EN | HTTP 403 |
| 12 | restaurantguru.com « Pâtisserie Hygge Factory » | S-1 |
| 13 | zoodegranby.com/contactez-nous | Z-2 |
| 14 | granby.ca/fr/travaux-voirie | « Rue Principale, phase 3 » (segment and dates blank) |
| 15 | zoodegranby.com/horaire (second read) | The verbatim parking sentences in Z-3 |

### Direct lookups (curl and public APIs, 2026-10-29, UTC)

| Lookup | Result |
|---|---|
| City PDFs (curl, about 12:53) | Codification 1885-1990, revised 2026-09-18, 175 pages (SHA-256 `a4c109526d6d27fb5c3856a05e3eecec7471e0381a485b591806547f47e45388`); codification of 1171-2022 (`ee64d33c…ec191`); draft amending 1171-2022, October 2026 (`9a93716a…15578`); draft amending 1885-1990, annexes C, L, Q, Y, F, CC, October 2026 (`ebceabfc…7f232`) |
| City PDFs (curl, about 13:16) | « Travaux de voirie 2026 », 46 pages (`e41b7a99…d6c2`; downloaded from granby.ca after wallace.granby.ca refused TLS); transit brochure, July 2026 (`b70e4b43…6f3d`) |
| Draft of 1479-2026, May 2026 (saved by WebFetch) | `9dfa06d1…191f`; articles 2–10 and annexes 1–4 (the annex Y, O, AA and BB plans) |
| pdftotext and pdfimages (poppler 25.07) | Annex maps Y (codification p. 139), O (p. 129), AA (p. 141), BB (p. 142) |
| Nominatim (12:58–13:24) | Reverse geocode of the shop's point; searches: 3 rue Court, rue Court, « Coco Vanille Granby » (empty), the Zoo (address, name, P1), 41 rue du Centre, 18 rue Johnson, 135, 176 and 315 rue Principale, 700 rue Drummond, the CINLB, rue Laval Nord, rue Saint-Hubert |
| OSM API 0.6 (12:59–13:05) | Way 1261961939 (current, history, full); bounding box -72.7290,45.3972,-72.7210,45.4022 (the shop); bounding box -72.7300,45.4150,-72.7140,45.4240 (the Zoo) |
| Overpass API (12:58) | Timed out; the retry answered HTTP 502 « at capacity ». Replaced by the bounding boxes |
| OSRM demo, car (13:06; 13:23) | Z-5, Z-6, S-3 |
| Valhalla, FOSSGIS (13:14) | Z-7 |
| OSRM foot, FOSSGIS (13:04–13:23) | P-7, P-10, Z-10, S-2 (7 walks) |

---

## Sources

All seen 2026-10-29.

Official: Ville de Granby
- Codification administrative du Règlement numéro 1885-1990 sur la circulation, le stationnement et la sécurité publique (revised 2026-09-18) — https://www.granby.ca/sites/default/files/2026-09/codification-circulation-1885-1990_maj18sept2026.pdf — seen 2026-10-29
- Codification administrative du Règlement numéro 1171-2022 visant à autoriser le stationnement de nuit (revised 2022-12-12) — https://www.granby.ca/sites/default/files/2025-11/codification1171-2022_stationnementnuit_aj12122022.pdf — seen 2026-10-29
- Draft by-law amending 1885-1990 (Paré, du Centre, Sainte-Famille, Johnson, Centre-Court, Richard-Goulet), tabled 2026-05-25 (adopted as 1479-2026) — https://www.granby.ca/sites/default/files/2026-05/13.1-0-2026modregcirc-annexes-y-o-aa-bb.pdf — seen 2026-10-29
- Promulgation notice of by-law 1479-2026 (not opened: TLS error; seen in a search summary) — https://www.wallace.granby.ca/sites/default/files/2026-06/gen-promulgation-1479-2026.pdf — seen 2026-10-29
- Draft by-law amending 1885-1990 (annexes C, L, Q, Y, F, CC; 84, rue Court), tabled 2026-10-19 — https://www.granby.ca/sites/default/files/2026-10/0-2026modregcirc-annexes-c-l-q-y-f-cc.pdf — seen 2026-10-29
- Draft by-law amending 1171-2022 (Phoenix, Johnson and Centre-Court during snow operations), tabled 2026-10-19 — https://www.granby.ca/sites/default/files/2026-10/0-2026_modreg1171-2022_stationnementnuit.pdf — seen 2026-10-29
- Règlements municipaux (index page) — https://www.granby.ca/fr/ville/reglements-municipaux — seen 2026-10-29
- Travaux de voirie 2026 (page) — https://www.granby.ca/fr/travaux-voirie — seen 2026-10-29
- Travaux de voirie 2026, press conference deck (2026-04-20) — https://www.granby.ca/sites/default/files/2026-04/voirie-20-04-2026_vf_sw-1-1.pdf — seen 2026-10-29
- Transport urbain Granby, brochure (July 2026) — https://www.granby.ca/sites/default/files/2026-07/depliant_transport-urbain-26x26_juillet2026-hr.pdf — seen 2026-10-29
- Déneigement 2026-2027 (page) — https://www.granby.ca/fr/deneigement — seen 2026-10-29

Official: Zoo de Granby
- Horaire et directions — https://www.zoodegranby.com/horaire — seen 2026-10-29
- Nous contacter — https://www.zoodegranby.com/contactez-nous — seen 2026-10-29
- Home page — https://www.zoodegranby.com/ — seen 2026-10-29

OpenStreetMap and routing (data © OpenStreetMap contributors, ODbL)
- Nominatim, « 3, Rue Court » — https://nominatim.openstreetmap.org/search?format=jsonv2&street=3%20rue%20Court&city=Granby&state=Qu%C3%A9bec&country=Canada — seen 2026-10-29
- Nominatim, reverse geocode of the shop's point — https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=45.3995807&lon=-72.7250821&zoom=18 — seen 2026-10-29
- OSM way 1261961939 (rue Court odd-number interpolation, CanVec) — https://www.openstreetmap.org/way/1261961939 — seen 2026-10-29
- OSM way 338552937 (« Zoo de Granby P1 ») — https://www.openstreetmap.org/way/338552937 — seen 2026-10-29
- OSM way 76938457 (« Zoo de Granby ») — https://www.openstreetmap.org/way/76938457 — seen 2026-10-29
- OSRM demo, P1 → 3, rue Court — https://router.project-osrm.org/route/v1/driving/-72.7253607,45.4196974;-72.7250821,45.3995807?overview=false&steps=true — seen 2026-10-29
- OSRM demo, 3, rue Court → P1 — https://router.project-osrm.org/route/v1/driving/-72.7250821,45.3995807;-72.7253607,45.4196974?overview=false&steps=true — seen 2026-10-29
- Valhalla (FOSSGIS), P1 → 3, rue Court (auto) — https://valhalla1.openstreetmap.de/route — seen 2026-10-29
- OSRM foot (FOSSGIS), shop → Centre-Court driveway — https://routing.openstreetmap.de/routed-foot/route/v1/driving/-72.7250821,45.3995807;-72.724982,45.400522?overview=false&steps=true — seen 2026-10-29

Third parties
- Pâtisserie Cocovanille (Wanderlog; Google-sourced card and map) — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-29
- Pâtisserie Cocovanille (RestoMontreal EN; HTTP 403) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/ — seen 2026-10-29
- Pâtisserie Hygge Factory, Granby (Restaurant Guru) — https://restaurantguru.com/Patisserie-Hygge-Factory-Granby — seen 2026-10-29
- Pain-Pain Boulangerie Artisanale (Kéroul; search summary) — https://www.keroul.qc.ca/fr/voyage/etablissement/13854-pain-pain-boulangerie-artisanale — seen 2026-10-29
- Tartes et Clafoutis (Kéroul; search summary) — https://www.keroul.qc.ca/fr/voyage/etablissement/13853-tartes-et-clafoutis — seen 2026-10-29
- Le Palace de Granby (Québec Vacances) — https://www.quebecvacances.com/fr/attractions/le-palace-de-granby — seen 2026-10-29
- Le Palace de Granby (Sortir au Québec) — https://sortirauquebec.com/en/listing/auditorium-theatre/le-palace-de-granby/ — seen 2026-10-29
- Granby car-rental guide (Turo; claim not used) — https://turo.com/ca/fr/voiture-location/canada/granby-qc — seen 2026-10-29
- Granby Express, April 2019, via BAnQ (search summary; not opened; the first BAnQ hit, so attribution is uncertain) — https://collections.banq.qc.ca/document/s/t/x-rM5824lmqA4DioFB6Nuw — seen 2026-10-29

Repo inputs
- research/21-decisions-agence-2026-10-29.md (§4, §5); research/20a-identity-and-history.md (§3, §10; Da Teresa's status); research/20b-products-and-offers.md (Instagram captions); research/14-owner-questions.md (H5, S3); research/04-keywords-demand.md (F26, F27, E13, S14); research/05-serp-baseline.md (L5, L8); data/facts.json (`entity.geo`, `fact_needed`); apps/web/src/seed/content.js (the parking, Zoo and accessibility markers)
