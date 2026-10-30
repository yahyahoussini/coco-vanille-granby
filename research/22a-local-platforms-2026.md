# 22a · Local platforms and the sources AI assistants use for local answers (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Step: research « local platforms », under Yahya's mandate of 2026-10-29 (« take all decisions based on what I give and web research, and make the full thing ready »). It refreshes research/06 (c), (d), (o) and (r), research/18 #2, #18 and #19, and the Google rules that docs/05 §2 quotes. What those files already verified is cited, not searched again.
Machine-readable twin: `data/research-local-platforms.json` (one object per finding: `id`, `value`, `label`, `source`, `seen`, `note`; each `note` gives the row number used below).

How this was made, and its limits:
- **Official pages first.** Google Business Profile Help (English and fr-CA), Google Maps' content policy, Google's blogs (including the Google Canada blog in French), the Apple Business user guide (en-CA), Apple Newsroom (Canada), the Apple Maps data attribution page, the Bing blog, Yelp's SEC filing and Meta's newsroom.
- **25 WebSearch queries** (standard mode, US-located, summarized results) and **65 WebFetch calls** (53 answered; 12 refused, empty, redirected, timed out or truncated), plus 6 direct lookups with curl. All are logged in §8.
- **The page reader summarises.** WebFetch returns a model's summary of each page. Quotes are short and as returned. Check the wording against the page before printing it in a client document.
- **Category names.** Google publishes no category list. Its Business Information API needs approved access (research/18 #17). The names below come from PlePer's category generator, a third-party tool that says its list is « not more than three days old ». It was downloaded three times (French + Canada, English + Canada, French + France) between 15:17 and 15:19 UTC. Every row carries the tool's own « last seen » date, 2026-10-28.
  - English names: **verified** (PlePer and Daltonluka's list of 2026-05-09 agree).
  - French (Canada) names: **unverified** (one third-party tool) until someone reads the picker in the dashboard (docs/05 T2). One practitioner warns that an identifier can differ from the name the dashboard shows (Sterling Sky, search summary).
- **Not done:**
  - the Google, Apple and Bing dashboards (no access yet: research/14 S2)
  - Google Maps itself (it does not open in this environment: 20a)
  - any AI assistant: no engine was queried, because the weekly prompt panel is a human task (research/05 W44.10)
  - refused: the OpenAI Help Center (HTTP 403, twice), Axios and Search Engine Land (HTTP 403)
  - empty: bing.com/forbusiness. Two guessed Google help IDs returned 404 (metrics, menus); the right pages were found by search.
- **Labels:**
  - **verified** = an official page of the platform itself, or two independent sources
  - **unverified** = one non-official source, several outlets that all relay one report, an inference, or an absence of evidence
  - The Whitespark survey is labelled **unverified (industry opinion)**: it is expert scoring, never a Google fact.
  - Agency proposals are marked **proposal**. They are not facts; the owner validates them.
- **House rules, unchanged and in places confirmed:** no keyword or city in any name field; one listing per shop; no review gating, no incentives; no text written « for AI »; no position promised.

---

## 0. Bottom line (decision-relevant)

1. **The 750-character limit for the Google description is now verified.**
   - Google: « Ne dépassez pas 750 caractères dans le champ de description. » « N'incluez pas d'URL ni de code HTML. »
   - Business information comes before promotions, prices and sales (G-1).
   - The 293-character draft in docs/05 §2.1 fits. The closing table proposes a 391-character version that adds the shop's own Moroccan line and the café seating (both owner-published, 20b S-13, S-16).
2. **The categories now have exact names, in French (Canada) and English, with identifiers (§1B).** Proposal for the owner:
   - **Primary:** `gcid:pastry_shop`, shown as « Boulangerie-pâtisserie » in French (Canada) and "Pastry shop" in English. It matches the register's activity 6013 « Boulangeries et pâtisseries » (20a) and category sentence B (21 B2).
   - **Secondary, as few as possible:** `gcid:bakery` « Boulangerie »; one café category; optionally `gcid:cake_shop` « Magasin de gâteaux ».
   - **Trap 1:** the French (Canada) list has **two different categories both named « Café »**: `gcid:cafe` ("Cafe") and `gcid:coffee_shop` ("Coffee shop"). Switch the dashboard to English to tell them apart.
   - **Trap 2:** the same `gcid:pastry_shop` reads « Pâtisserie » in French (France). Advice written for France names the category differently.
   - **No Moroccan category fits a bakery.** The only Moroccan category is « Restaurant marocain » (`gcid:moroccan_restaurant`), next to « Restaurant nord-africain ». A pâtisserie is not a restaurant, so both fail Google's "this business IS a…" test. Msemmens and harchas go into products, the description and posts.
3. **A name change can trigger a new verification.**
   - Google: « Si vous modifiez le nom de votre entreprise après sa validation, vous devrez peut-être valider votre entreprise à nouveau » (G-3). This closes the open point in docs/05 row 3: change the name once, outside the holiday rush, with the sign photo in hand.
   - The name rules also bar a name repeated in two languages, even when the sign shows both, and any landmark or entrance detail (G-2).
4. **The sign photo (14 S3) now blocks a second thing: video verification.**
   - Google chooses the verification method (G-28).
   - A video must show the business name on a permanent fixture. « Name not visible on the storefront » is a listed rejection reason (G-29).
5. **« Demander à Maps » (Ask Maps) has been live in Canada since 2026-08-06.**
   - The source is now official: the Google Canada blog, in French (G-22). It does not state the languages, so test 19 still decides whether it works in French.
   - Ask Maps draws on information about more than 300 million places and on reviews from more than 500 million contributors (Google, 2026-03-12: G-23).
   - Food ordering and conversational contributions (users proposing new hours, for example) roll out in the US first (G-24).
   - GBP Q&A stays gone (secondary sources, unchanged: G-21).
6. **Reviews: the rules in docs/03 hold, and the sanctions are now on Google's own page.**
   - The policy page lists staff review quotas and asking staff for reviews « that include specific content » (G-25).
   - The restrictions page lists three sanctions: no new reviews for a period, existing reviews unpublished for a period, and a warning to customers that fake reviews were removed. Google emails before acting, and an appeal is possible (G-26).
7. **Online ordering link.**
   - Google's help page no longer lists countries. Google's Canadian restaurants page says Canadian merchants can work with ordering providers (G-31, G-32).
   - The fr-CA labels: « Commande de repas » → « Ajouter un lien » → « Définir comme préféré » → « Préféré pour le ramassage ».
   - Whether a bakery profile gets the section is still self-test T2.
8. **Apple Business is verified, with its Canadian features.**
   - Renamed and free: Apple Newsroom (Canada), 2026-03-24; live on 2026-04-14 in more than 200 countries and regions (A-1).
   - Canada has Brand and Location Management, Branded Mail and Tap to Pay on iPhone (A-2).
   - Showcases accept French (Canada): a 38-character header, a 100-character body, up to 365 days (A-7, A-8).
   - Action links accept `utm_source` through `utm_content` and forbid `gclid` and tokens, so self-test T3 is answered on paper (A-10).
   - Apple's ads on Maps reached Canada in summer 2026. No ad spend is planned.
9. **Apple Maps names its data providers** (attribution page, revised 2026-10-21: A-12).
   - Reviews come from Yelp.
   - Business listings come from Foursquare, Tripadvisor, Yellow Pages Group, Yext, Uberall, Localeze and others.
   - Map data comes from OpenStreetMap.
   - Siri finds places through Maps (A-14).
   - → The Yelp claim (claim only), Foursquare, Tripadvisor, PagesJaunes and an OSM point (20c S-4) all feed the iPhone. iOS is about 65 % of Canadian mobile browsing (research/06 (b)).
10. **Among the AI assistants, only Google and Apple state their local sources officially.**
    - **ChatGPT:** Yelp signed a data-licensing agreement with OpenAI (Yelp's SEC filing, 2026-02-12: I-2). Axios reported on 2026-07-23 that ChatGPT's local answers show Yelp reviews, ratings and photos; the geographic scope is not stated (I-3). The Foursquare, Mapbox and Bing claims stay secondary (I-4).
    - **Perplexity:** Yelp data since 2024 (I-5).
    - **Copilot:** Microsoft still calls a deeper Copilot integration a plan (B-2).
    - **Meta AI:** available in Canada since 2024; its sources are not stated (I-13, I-14).
11. **Local ranking.**
    - **Google:** relevance, distance and prominence (« notoriété » in the fr-CA page); links and reviews count; nobody can pay for a better local rank (R-1).
    - **Whitespark 2026** (47 experts, 187 factors; opinion): the top local-pack factors are the primary category, proximity, then keywords in the name. The third is forbidden here (G-2). For AI visibility, the experts put « best of » lists first (R-3, R-4).
    - → The order of work stands: category, hours, map pin (20c G-1), reviews asked of every customer (docs/03), then the lists in docs/06. No position is promised.

---

## 1. Google Business Profile in Canada

### 1A. Profile fields and rules (refresh of docs/05 §2)

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-1 | **Description.** « Ne dépassez pas 750 caractères dans le champ de description. » « N'incluez pas d'URL ni de code HTML. » Give business details priority over promotions, prices or sales. It shows in the profile's "From the business" section. Help from AI to write it exists « only in select regions and languages » | verified (official) | Google help « Edit your Business Profile » (3039617), en and fr-CA | 2026-10-29 |
| G-2 | **Name.** The real-world name, as on the signage, stationery and branding. Not allowed: marketing taglines, store or branch codes, trademark symbols, fully capitalized words, hours or open status, phone numbers or URLs, product or service descriptions, location details (a landmark, a floor, an entrance), containment (a host business), and **repeated names in multiple languages or scripts, including transliterations, even if the storefront shows them**. Special characters and legal terms (INC, LTD) only with real-world proof. Unnecessary information « could result in the suspension » of the profile | verified (official; reader summary) | Google « Guidelines for representing your business on Google » (3038177) | 2026-10-29 |
| G-3 | **Edits and re-verification.** « We review your changes before we update them live on your profile. » « Si vous modifiez le nom de votre entreprise après sa validation, vous devrez peut-être valider votre entreprise à nouveau. » A move after verification needs a new verification. Some businesses must verify before they can edit | verified (official) | 3039617 (en, fr-CA) | 2026-10-29 |
| G-4 | **Categories.** « Vous pouvez sélectionner jusqu'à neuf catégories supplémentaires. » All locations of a business share one primary category. Don't use categories as keywords or to describe features. « Use as few categories as possible »; « as specific as possible, but representative of your main business »; a category completes « This business IS a », not « HAS a » | verified (official) | 3039617; 3038177 | 2026-10-29 |
| G-5 | **Opening date.** Month and year only. It can be up to one year ahead, and then shows from 90 days before | verified (official) | 3039617 | 2026-10-29 |
| G-6 | **Phone.** Up to two additional numbers; no fax. A number under the business's direct control; a local number rather than a call centre; no premium-rate numbers | verified (official) | 3039617; 3038177 | 2026-10-29 |
| G-7 | **Hours.** Regular customer-facing hours. Special hours when the business « reste fermée jusqu'à six jours consécutifs »; « Fermé temporairement » when it is closed « pendant au moins sept jours consécutifs ou pour une période indéterminée ». Confirm holiday hours even when they are unchanged. Path: « Modifier le profil » → « Heures » → next to « Heures spéciales », « Modifier » | verified (official; matches docs/05 rows 2 and 9) | Google « Comment définir un horaire spécial » (6303076, fr-CA); 3038177 | 2026-10-29 |
| G-8 | **Address and eligibility.** A precise address; no P.O. boxes; virtual offices are ineligible; a shown address keeps permanent fixed signage with the business name. « There should only be one profile per business » | verified (official) | 3038177 | 2026-10-29 |
| G-9 | **Website and links.** No phone numbers or URLs that send users to pages other than the business's own, including pages on social media sites; no link in the description | verified (official; reader summary) | 3038177 | 2026-10-29 |

### 1B. Categories: exact names and identifiers

The list below is PlePer's output for Canada, read on 2026-10-29. The tool's « last seen » date is 2026-10-28 on every row (first seen 2019-04-24 on all but the newer restaurant types). « Fit » is the agency's **proposal**; the owner decides (docs/05 rows 4–5).

| Identifier | English (Canada) | French (Canada) | French (France), for contrast | Fit for Coco Vanille (proposal) | Evidence that the shop « IS a… » |
|---|---|---|---|---|---|
| `gcid:pastry_shop` | Pastry shop | **Boulangerie-pâtisserie** | Pâtisserie | **Primary** | Register activity 6013 « Boulangeries et pâtisseries » (20a §1); bio « Pâtisserie & Café »; pinned post: viennoiseries, pains frais, pâtisseries (20b S-1); category sentence B (21 B2) |
| `gcid:bakery` | Bakery | Boulangerie | Boulangerie | **Secondary** | « Pains frais » (20b S-3) |
| `gcid:cafe` | Cafe | **Café** | Café | **Secondary: one of the two cafés** (default: this one, because the shop serves drinks with light food to eat in) | Drinks list, a place to sit, « sur place ou à emporter » (20b S-14 to S-16); savoury snacks and sandwiches (S-10, S-12) |
| `gcid:coffee_shop` | Coffee shop | **Café** (same label as `gcid:cafe`) | Café | Alternative to `gcid:cafe`; **never both** | Same as above |
| `gcid:cake_shop` | Cake shop | Magasin de gâteaux | Magasin de gâteaux | Optional, if the owner wants custom cakes to stand out | « Gâteaux personnalisés sur commande » (20b S-8) |
| `gcid:patisserie` | Patisserie | Pâtisserie-confiserie | (not in the France list) | No: the French label adds confectionery, which is not evidenced | — |
| `gcid:dessert_shop` | Dessert shop | Magasin de desserts | Boutique de desserts | No (redundant with the primary) | — |
| `gcid:wedding_bakery` | Wedding bakery | Boulangerie-pâtisserie spécialisée en gâteaux de mariage | Pâtissier spécialisé dans les gâteaux de mariage | **Never** | No wedding cakes found (20b N-3) |
| `gcid:moroccan_restaurant` | Moroccan restaurant | Restaurant marocain | Restaurant marocain | **Never**: the shop is not a restaurant | Moroccan specialities are a product line (20b S-13), not what the business is |
| `gcid:north_african_restaurant` | North African restaurant | Restaurant nord-africain | Restaurant de spécialités d'Afrique du Nord | **Never** | Same |
| `gcid:sandwich_shop` | Sandwich shop | Sandwicherie | Sandwicherie | No (sandwiches are a side line: 20b S-12) | — |
| `gcid:catering_service` | Caterer | Traiteur | Traiteur | No (one platter offer, 20b S-11; not a caterer) | — |
| `gcid:tea_house` | Tea house | Salon de thé | Salon de thé | No | — |
| `gcid:espresso_bar` | Espresso bar | Bar espresso | Café spécialisé dans les boissons expresso | No | — |
| `gcid:cupcake_shop` | Cupcake shop | Boutique de cupcakes | Boutique de cupcakes | No (no cupcakes found: 20b N-4) | — |
| `gcid:breakfast_restaurant` | Breakfast restaurant | Restaurant de déjeuners | Restaurant servant le petit-déjeuner | No | — |

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-10 | **The English names exist as written:** Bakery, Pastry shop, Patisserie, Cake shop, Cafe, Coffee shop, Dessert shop, Wedding bakery, Moroccan restaurant, North African restaurant, Tea house, Espresso bar | verified (two independent lists) | PlePer, English + Canada (2026-10-28); Daltonluka, « 4046 » categories « as of May 9th, 2026 » | 2026-10-29 |
| G-11 | **No Moroccan bakery or pastry category.** In the English (Canada) list, only `moroccan_restaurant` and `north_african_restaurant` contain « Moroccan » or « North African ». In the French (Canada) list, « Restaurant marocain » is the only label containing « marocain ». The only nationality-specific bakery category is « Pâtisserie chinoise » (Chinese bakery) | verified (PlePer + Daltonluka agree) | same | 2026-10-29 |
| G-12 | **The French (Canada) names** in the table above, including the two categories labelled « Café » | unverified (one third-party tool; confirm in the picker: T2) | PlePer, French + Canada | 2026-10-29 |
| G-13 | **Canadian French is its own localization.** Of 3,865 identifiers present in both French lists, 1,129 have a different label in French (Canada), and 70 more appear only in the Canadian list. Québec words appear: « Beignerie » (donut shop), « Baguelerie » (bagel shop), « Casse-croûte » (snack bar), « Restaurant de déjeuners » (breakfast restaurant). So French advice written for France (« Pâtisserie ») does not match the Canadian picker | unverified (observed in one tool's data; computed) | PlePer, French + Canada vs French + France | 2026-10-29 |

Reading:
- **The primary category is what the shop is as a whole.** « Boulangerie-pâtisserie » covers the bread and the pastries, and it is the register's own activity. In English it reads "Pastry shop", which is also accurate. Industry opinion ranks the primary category as the first local-pack factor (R-3); the rule above it is Google's own: specific, representative, never a keyword (G-4).
- **Secondary categories add only what is true and distinct.** Bread is a real line, so « Boulangerie ». Coffee with seating is a real line, so one « Café ». In the French picker the two « Café » entries look identical, so the person who sets them must check the identifier, or switch the dashboard language to English and choose "Cafe" or "Coffee shop".
- **Msemmens and harchas never become a category.** No Moroccan bakery category exists, and a restaurant category would misdescribe the shop. They are products with real photos, a sentence in the description and posts: the shop's own words, « Spécialités marocaines : msemmens, harchas et autres gourmandises » (20b S-13).
- **Competitors' categories** stay a [[FACT NEEDED]] (docs/05 row 4): they can only be read in Google Maps, which does not open here.

### 1C. Attributes

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-14 | **How attributes work.** « Modifier le profil » → « Plus » → « Modifier » next to the attribute group → « Oui » or « Non » → « Enregistrer ». Some attributes « ne peuvent être modifiés que dans certains endroits, certains pays ou certaines catégories d'entreprises ». Some are set from « des informations fournies par les clients qui visitent votre entreprise » | verified (official; matches docs/05 row 16) | Google « Gérer les attributs de votre entreprise » (14150971, fr-CA) | 2026-10-29 |
| G-15 | **Identity attributes** (French Canada labels): « Appartenant à une personne d'origine asiatique », « Appartenant à une personne noire », « Appartenant à une personne d'origine latino-américaine », « Appartenant à un membre de la communauté LGBTQ+ », « Appartenant à une personne handicapée », « Appartenant à des Autochtones », « Appartenant à un ancien combattant », « Appartenant à une femme », « Petite entreprise ». Several can be chosen; opt in or out at any time | verified (official) | 14150971 (fr-CA, en) | 2026-10-29 |
| G-16 | **« Petite entreprise »:** annual revenue under 10 million US dollars; franchises excluded; Google may mark a business automatically « en fonction des informations dont nous disposons » | verified (official) | 14150971 | 2026-10-29 |
| G-17 | **Which identity attributes exist in Canada:** the page names no country. A 2021 launch article said the « Asian-owned » label was US-only at the time | unverified (absence; dated secondary) | 14150971; techcrunch.com (search summary) | 2026-10-29 |
| G-18 | **Food service options.** Google's Canadian page for restaurants shows « Dine-in », « Takeout » and « Delivery » on a sample listing and asks for « dining and delivery options ». It names no Wi-Fi, seating or accessibility attribute. No official per-category attribute list exists; vendor guides say the dashboard shows what the category and country allow | verified (Google page, undated) for the sample; unverified (vendor guides) for the rest | business.google.com/ca-en/business-profile/restaurants/; search summaries (Zoho, BrightLocal) | 2026-10-29 |
| G-19 | **What the shop has published for attributes:** « sur place ou à emporter » and a place to sit (owner posts, 2026). Delivery: none (21 A3). Wi-Fi, payment methods, entrance and seat count: not public | verified (owner) / open | 20b S-16, N-11; 20c A-1; 21 A3; 14 H5, O5, N3 | 2026-10-29 |

### 1D. Products, menu, posts, photos

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-20 | **Product editor.** « If you have a local store which sells physical goods, the product editor is suitable for you. » Products must follow the Shopping ads policy; otherwise « the removal of all of the products you uploaded » can follow. Dining establishments are pointed to the menu editor. The page lists no fields, limits or review time | verified (official; matches docs/05 row 17) | Google « About product editor » (9124203) | 2026-10-29 |
| G-21 | **Menu editor.** « L'éditeur de menus est destiné aux entreprises de restauration uniquement », in the section « Menu ou services (disponibilité limitée) » | verified (official) | 3039617 (fr-CA) | 2026-10-29 |
| G-22a | **Posts.** Three types: « Update », « Offer », « Event ». « Schedule this post », and a « Repeats » option (weekly, monthly or custom). Archived after six months unless a date range is set. Update and Event posts can carry a button (booking, order online, learn more); an Offer carries « View offer ». Posts show in the Updates or Overview tabs on mobile and in « From the owner » on desktop. They stay « Pending » while the profile is unverified | verified (official; adds to docs/05 row 21) | Google help on posts (7342169) | 2026-10-29 |
| G-22b | **Featured posts:** « single-location food and drink businesses in the US, UK, Canada, Australia, and New Zealand », in English for now | verified (official) | 7342169 | 2026-10-29 |
| G-22c | **What gets posts removed:** « we may remove posts with unverified contact information »: phone numbers, email addresses and social media handles. Use the call button instead, which uses the verified phone. Businesses in regulated industries may post, but not about those products | verified (official) | Google « Business Profile photos, videos & posts content policy » (7213077); 7342169 | 2026-10-29 |
| G-22d | **Photos and videos.** JPG or PNG, 10 KB to 5 MB, 720 × 720 px recommended, 250 × 250 px minimum; « in focus and well lit », with « no significant alterations or excessive use of filters ». Videos: up to 30 seconds, up to 75 MB, 720p or more. They can take 24–48 hours to show. Owners can request the removal of customer photos | verified (official; matches docs/05 row 20) | Google help on photos and videos (6103862) | 2026-10-29 |

(The 22a–22d numbering keeps the twin's ids stable; there is no G-22 row.)

### 1E. Q&A and « Demander à Maps » (Ask Maps)

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-23a | **Q&A is gone.** The Q&A API ended on 2025-11-03, and public Q&A was replaced from early December 2025 (exact day unverified). Practitioners add that an Ask Maps answer cannot be corrected or reported: only the underlying data can be fixed | unverified (secondary, consistent; unchanged from research/06 (d)) | brightlocal.com/learn/google-business-profile-qa; ppc.land (Q&A API); search summaries (Slashpost, Valley Marketing Group) | 2026-10-29 |
| G-22 | **Ask Maps in Canada.** « Nous l'étendons également à plus de 160 nouveaux pays et territoires », with Canada named among them, in a post titled « Demander à Maps devient encore plus utile : commande de repas et plus encore ». The languages are not stated. MobileSyrup (same day): Ask Maps and Personal Intelligence come to Canada on Android and iOS | verified (official, 2026-08-06) | Google Canada blog (fr-CA); mobilesyrup.com | 2026-10-29 |
| G-23 | **What Ask Maps uses.** Maps « analyzes information from over 300 million places » and adds « reviews from our community of more than 500 million contributors »; answers are personalised by places searched or saved. Business Profiles are not named | verified (official; US launch post, 2026-03-12) | blog.google « Ask Maps » | 2026-10-29 |
| G-24 | **US first.** Ordering food (partners named: Square, Toast, Uber Eats), hotels, events and conversational contributions (users propose updates such as changed opening hours, which Maps checks before publication) « sont en cours de déploiement aux États-Unis ». Real-time information and personalised answers come « partout où Demander à Maps est offert » | verified (official) | Google Canada blog (2026-08-06) | 2026-10-29 |

Reading: research/18 #19 called Ask Maps « English only » (one secondary source). Google's own Canadian post does not say, and a French post proves only that Google Canada writes in French. Self-test 19 stays. Reviews already feed Ask Maps (G-23), which is why docs/03 asks every customer.

### 1F. Reviews: policy and sanctions

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-25 | **Policy.** « Fake engagement is not allowed and will be removed. » Not allowed: incentives (payment, discounts, free goods or services) for posting, revising or removing a review; conflicts of interest, including current or former employment, a contractual relationship and family; discouraging negative reviews or « selectively » soliciting positive ones; pressuring people to review « while on the premises »; « Merchants requesting that staff solicit a certain number of reviews »; « Merchants requesting that staff solicit reviews that include specific content ». Allowed: asking for genuine reviews « without offering incentives » | verified (official; matches docs/03 §1) | Google Maps « Prohibited and restricted content » (contributionpolicy 7400114) | 2026-10-29 |
| G-25b | **When the staff clauses were added** (2026-04-17) | unverified (secondary; research/18 #4a) | research/18 | 2026-10-29 |
| G-26 | **Sanctions for fake engagement.** The profile « will not be able to receive new reviews or ratings for set period of time »; its « existing reviews or ratings will be unpublished for set period of time »; it « will display a warning to let consumers know that fake reviews were removed ». Google notifies the owner by email before; an appeal form exists. No country is named | verified (official) | Google « Business Profile restrictions for policy violations » (14114287) | 2026-10-29 |
| G-27 | **Context.** Google's 2025 Maps safety report: more than 292 million reviews blocked or removed and more than 13 million fake profiles removed. On 2026-07-03, Google said it was looking into reviews going missing and that its systems had paused new reviews on affected profiles | unverified (secondary) | seroundtable.com (2025 report); techwyse.com (2026), search summaries | 2026-10-29 |

### 1G. Verification and suspension

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-28 | **Methods.** Video recording; live video call (during business hours); phone or text (« Interactive Voice Response (IVR) systems won't get the code »); email; postcard (a 5-digit code, « Most codes arrive within 14 days »); instant verification (Search Console, bulk). « Verification methods are automatically determined by Google and can't be changed. » Review takes « up to 5 business days ». During postcard verification, don't edit the name, address or category | verified (official) | Google « Verify your business on Google » (7107242) | 2026-10-29 |
| G-29 | **Video recording.** At least 30 seconds, unedited, continuous, captured live. For a storefront, show street signs, building numbers or nearby businesses; the storefront or signage with the business name on a permanent fixture; proof of management (for example « opening a cash register »; permits or invoices also work). No sensitive data and no other people's faces. Review: up to 5 business days. Common rejections: the business name isn't visible on the storefront; no nearby area shown; no proof of authorization | verified (official) | Google « Verify your business with a video recording » (14271705) | 2026-10-29 |
| G-30 | **Suspension and appeal.** « We may suspend or disable Business Profiles that don't follow our guidelines. » An account restriction suspends all the profiles it manages. One appeal, in the appeals tool, with optional evidence (registration, business licence, tax certificate, utility bill) whose name and address match the profile; « Don't create a new profile for the same business ». The page lists no specific triggers; the guidelines name the name rule (G-2) and the one-profile rule (G-8) | verified (official) | Google « Fix suspended or disabled profiles » (4569145); 3038177 | 2026-10-29 |

### 1H. Ordering link and performance metrics

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| G-31 | **Online ordering.** « Commande de repas » → choose a provider, or « Ajouter un lien » at the bottom → « Définir comme préféré » → turn on « Préféré pour le ramassage » and/or « Préféré pour la livraison » → « Enregistrer ». Turning off « Accepter les commandes sur votre profil » hides every option. Buttons: « Commander en ligne » and « Passer une commande », « Dans certains pays et certaines régions ». The page has US and non-US sections and **no country list**. Providers must remove links within 5 business days when asked | verified (official) | Google « Manage online ordering options » (10842217), en and fr-CA | 2026-10-29 |
| G-32 | **Canada.** Google's Canadian page for restaurants says Canadian merchants can work with online ordering providers; its sample listing shows « Order online » (pickup, delivery) and Reserve with Google | verified (official, undated) | business.google.com/ca-en/business-profile/restaurants/ | 2026-10-29 |
| G-33 | **Performance metrics.** Interactions (total). Searches: the terms people used, updated at the start of each month, up to 5 days late. Views: unique people per day on Search and Maps. Directions (duplicate taps, cancels and spam excluded). Calls. Website clicks. Messages. Bookings (through a booking provider). Products (views of products sold at the location). Menus (clicks on menu content: photos, links, structured menus). Offers. Only the metrics that apply to a business appear | verified (official) | Google « Understand your Business Profile performance & insights » (10018786) | 2026-10-29 |

Reading:
- research/06 (d) and (r) wrote « Canada is among the countries » from an earlier version of the ordering help page. Today that page lists no country, and the Canadian claim rests on G-32. The custom link to `/commander/` stays the plan (research/21 B5: ordering opens 11–24 January 2027).
- The Messages metric still appears although GBP chat ended in 2024 (research/15 D27, not re-checked here).

---

## 2. Apple Business in Canada, 2026

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| A-1 | **Rename, date, price.** Announced « March 24, 2026 »: « Apple Business will be available starting Tuesday, April 14, in more than 200 countries and regions »; « a free service »; existing Business Connect data « will automatically migrate ». This upgrades research/18 #2 from secondary to official | verified (official) | Apple Newsroom (Canada), « Introducing Apple Business » | 2026-10-29 |
| A-2 | **Canadian features.** Canada's row: Brand and Location Management, Branded Mail, Built-in device management, Get Apps, Get Books, Managed Apple Accounts, Tap to Pay on iPhone, Zero-touch deployment; no footnote. Business Caller ID does not appear on the page. Showcases appear only in the guide's menu, not in any country row | verified (official, published 2026-04-14) | Apple « Apple Business feature availability » (en-CA) | 2026-10-29 |
| A-3 | **Where it shows.** Place cards « across Apple Maps, Safari, Spotlight, and more »; the brand « across Apple Maps, Wallet, and other features and apps »; Branded Mail in Mail and iCloud Mail | verified (official) | Apple Newsroom (2026-03-24) | 2026-10-29 |
| A-4 | **Place card fields.** Logo and cover photo (Apple reviews them); display name, with optional alternate-language names; « About » description (shown on the place card); photos; address and coordinates; standard, special and temporary hours (temporary hours record open times, not closures); phone (country code, « Phone number extensions aren't supported »); website (the primary brand site; « It can't be a third-party website »); Actions; Showcases; app link; « one and only one primary category » and « up to 19 optional categories »; « Good to Know » attributes (examples: contactless payment, accessible parking, EV charging); status (open or closed) | verified (official) | Apple « Configure location attributes in Apple Business » | 2026-10-29 |
| A-5 | **Website: two Apple pages disagree.** « Add a location »: website optional, and « A Facebook, Instagram, or TikTok page can also be used ». « Configure location attributes »: the website « can't be a third-party website ». Until the site is live, docs/05's Facebook fallback rests on the first page; at launch the field takes cocovanillegranby.com | verified (both pages); the conflict is open | Apple « Add a location in Apple Business »; A-4 | 2026-10-29 |
| A-6 | **Verification and transfer.** A phone call to « the one that Apple has on record for this location », then a four-digit code; the first location also needs the organization verified. « This location is already managed » → transfer request with documents (business licence, utility bill), « up to five business days ». Each location has a default content language, not shown to customers | verified (official; matches docs/05 §6 rows 1–3) | Apple « Add a location in Apple Business » | 2026-10-29 |
| A-7 | **Showcases.** « A module on the place card » for new items, deals, sales or events, with an optional call to action. « Showcases can run for up to 365 days. The default is set for 90 days. » Header « limited to 38 characters »; body « limited to 100 characters »; alt text 100. Apple approves the photo. Review « up to three calendar days ». « If any content is rejected by Apple for a single language, the entire showcase is rejected » | verified (official) | Apple « Create your first showcase in Apple Business » | 2026-10-29 |
| A-8 | **Showcase languages for Canada:** English (Canada) `en-CA` and French (Canada) `fr-CA` | verified (official) | Apple « Language list for showcases in Apple Business » | 2026-10-29 |
| A-9 | **Actions.** Shown at the top of the place card, through « Primary Action » or « More »; the first Action created becomes the Primary Action. Restaurant examples: Menu, Reserve, Waitlist, Pickup, Delivery. Customers need iOS or iPadOS 17.4 or later; Apple approval « can take up to three business days ». Actions can also come through the Apple Business brand API | verified (official) | Apple « About Actions in Apple Business » | 2026-10-29 |
| A-10 | **Action URL parameters.** Approved: analytics values for the source and `UTM_source`, `UTM_medium`, `UTM_campaign`, `UTM_term`, `UTM_content`. Prohibited: GCLID parameters, login trackers or single sign-on, tokens. This settles the conflict in research/06 (c) | verified (official) | Apple « Action URL standards and guidelines in Apple Business » | 2026-10-29 |
| A-11 | **Ads on Apple Maps** « this summer in the U.S. and Canada » (2026) | verified (official) | Apple Newsroom (2026-03-24) | 2026-10-29 |
| A-12 | **Apple Maps' data providers** (« Rev. 10/21/2026 »). « "Reviews from Yelp" »; « Business listings data » from Foursquare, Tripadvisor, Yellow Pages Group Corp (linked to corporate.yp.ca), Yext, Uberall, Localeze, PagesJaunes S.A., Booking.com and others; Acxiom (© 2015); « Contains map data © OpenStreetMap contributors »; DMTI postal data; CanVec (Natural Resources Canada). The page does not say which provider serves which country | verified (official) | Apple Maps data attribution page | 2026-10-29 |
| A-13 | **Which rating a Granby place card shows** (Apple's own, Yelp, Tripadvisor): not settled. A July 2026 post says the attribution page still shows only Yelp for local reviews; claims of a native Apple star rating from May 2026 have no Apple or press source | unverified | appleworld.today (search summary); research/18 #18 | 2026-10-29 |
| A-14 | **Siri finds places through Maps.** In the Maps chapter of the iPhone User Guide: « Ask Siri something like, "Find coffee near me." »; « Nearby suggestions aren't available in all countries or regions. » | verified (official) | Apple « Find nearby attractions, restaurants, and services in Maps on iPhone » (en-CA) | 2026-10-29 |
| A-15 | **Apple Intelligence and ChatGPT.** The same guide lists a topic « Use Siri to get answers from ChatGPT ». No Apple statement on how Siri or Apple Intelligence answers a local-business question beyond Maps was found | unverified (absence) | same guide (table of contents) | 2026-10-29 |
| A-16 | **French.** The Apple Business user guide is published in fr-CA, and `fr-CA` is a showcase language (A-8) | verified (official) | support.apple.com/fr-ca/guide/business/ (search result); A-8 | 2026-10-29 |

---

## 3. Bing Places for Business, 2026

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| B-1 | **Relaunch, 2025-10-03.** Listings « appear in Bing search results and Bing Maps ». The Google import is « better at preserving key attributes like business name, hours, and contact details »; bulk editing; a Recommendation Tool that suggests photos, a website, hours, social links, and a menu or online-order link for restaurants. The domain moved « from www.bingplaces.com to www.bing.com/forbusiness » | verified (official; same as research/06 (c)) | Bing blog, « Introducing the New Bing Places for Business » | 2026-10-29 |
| B-2 | **Copilot.** The only mention: « from deeper integrations with Bing Maps and Copilot to expanded support for agencies and other partners », as continuing investment. A plan, not a current feature | verified (as a plan) | same | 2026-10-29 |
| B-3 | **Vendor claims.** A verified Google listing imported into Bing skips Bing's own verification (BrightLocal). Copilot reads Bing's local index, fed by Bing Places (Pinmeto and others). Copilot links local reviews to Google Maps (one blog). No Microsoft page confirms any of them | unverified (vendor claims) | search summaries (brightlocal.com, pinmeto.com, optimixed.com) | 2026-10-29 |
| B-4 | **Weight in Canada.** Bing ≈ 10 % of Canadian search (StatCounter, May–Sept 2026) | via research/06 (b) | research/06 | 2026-10-29 |

Reading: nothing changes in docs/05 §7. Import from the finished Google profile, then read every imported field.

---

## 4. What each AI assistant uses for local answers

| # | Assistant | Finding | Label | Source | Seen |
|---|---|---|---|---|---|
| I-1 | ChatGPT | OpenAI's help says ChatGPT search « sometimes partners with other search providers » and shares a general location, not the IP; the providers are not named (research/18 #11a). Today the help pages returned HTTP 403. A search summary of them adds: maps for relevant local results on iOS and Android, an approximate location from the IP, precise location optional and off by default | unverified (not opened this session) | help.openai.com/en/articles/9237897 (HTTP 403); research/18 #11a | 2026-10-29 |
| I-2 | ChatGPT | **Yelp licenses data to OpenAI.** Yelp's letter to shareholders: « To accelerate this strategy, we recently signed an agreement with OpenAI »; Other revenue includes « data licensing, including from recently signed agreements with major AI search providers »; « In 2026, we intend to pursue additional licensing agreements with leading AI search providers. » | verified (official: Yelp's SEC filing, 2026-02-12) | sec.gov, Yelp 8-K exhibit 99.2 | 2026-10-29 |
| I-3 | ChatGPT | **How it shows.** ChatGPT's local answers « can include Yelp reviews, ratings, photos, and business details », with Yelp branding and links; the deal is not exclusive; a « Request a Quote » feature is planned. Reported by Axios on 2026-07-23 (HTTP 403 here) and relayed by MarTech on 2026-07-28. The geographic scope is not stated, and no OpenAI statement was seen | unverified (one report, relayed) | martech.org; axios.com (403) | 2026-10-29 |
| I-4 | ChatGPT | **Other claimed sources conflict.** Foursquare (several secondary sources, research/06 (o)); Mapbox for the map (Mapbox's own social posts, per one article); Bing web results reorganised by ChatGPT, which « does not see » Bing Places profile data (a Search Engine Land analysis) | unverified (secondary, conflicting) | research/06 (o) W78–W82; searchengineland.com (search summary) | 2026-10-29 |
| I-5 | Perplexity | **Yelp data since 2024-03-12:** « detailed information on local businesses, including maps, reviews, photos, and more », through Yelp's Fusion programme; Perplexity « will not use Yelp's data to train any models »; quotes from Perplexity's CEO and a Yelp senior vice-president. Status in 2026 and coverage in Canada: not stated | verified (both companies quoted, 2024); unverified for 2026 | maginative.com | 2026-10-29 |
| I-6 | Perplexity | A Tripadvisor partnership for hotel information | unverified (secondary) | itiger.com relay (search summary) | 2026-10-29 |
| I-7 | Gemini (models) | **Grounding with Google Maps** (Gemini API, « generally available now »): « data from more than 250 million places »; « structured, factual data like addresses, hours and user ratings » and « user reviews » | verified (official, 2025-10-17) | blog.google, « Grounding with Google Maps: Now available in the Gemini API » | 2026-10-29 |
| I-8 | Gemini (app) | The Google Maps connection in the Gemini app returns addresses, websites, ratings and opening hours from public Maps information. Canada and French: not stated | unverified (search summary of Google's help) | search summary | 2026-10-29 |
| I-9 | Google AI Mode and AI Overviews | AI Mode in French in Canada since 2025-10-14 (research/06 (a)). How it shows local businesses (lists of up to ten businesses, profile-like panels, the local-pack leaders) comes only from practitioners. Google's I/O 2025 post on AI Mode names restaurant reservations and local appointments, not its data sources | verified (French availability, via research/06); unverified (local mechanics) | research/06 (a); blog.google (2025-05-20); Whitespark and Humanlevel guides (search summaries) | 2026-10-29 |
| I-10 | Ask Maps (Gemini in Maps) | See G-22 to G-24: in Canada since 2026-08-06; places and reviews | verified | §1E | 2026-10-29 |
| I-11 | Microsoft Copilot | See B-2 and B-3: a deeper integration is a plan; the Bing Places link is a vendor claim | verified (plan) / unverified | §3 | 2026-10-29 |
| I-12 | Siri and Apple Intelligence | See A-12 to A-15: Siri searches through Apple Maps; Maps names Yelp for reviews and lists Foursquare, Tripadvisor, Yellow Pages Group and OpenStreetMap among its data providers | verified | §2 | 2026-10-29 |
| I-13 | Meta AI | Launched on 2024-04-18 in English in « more than a dozen countries outside of the US », Canada among them; « real-time information from across the web »; a restaurant recommendation as an example | verified (official) | Meta newsroom, « Meet Your New Assistant: Meta AI, Built With Llama 3 » | 2026-10-29 |
| I-14 | Meta AI | Web answers from Bing, then also Google (2024); no source on its local data in 2026 | unverified (secondary, 2024) | searchenginejournal.com (search summary) | 2026-10-29 |

What each one needs from us (the agency's reading; inferences, labelled as such):

| Assistant | What it states officially | What is only reported | What the shop keeps exact |
|---|---|---|---|
| ChatGPT | Search partners, unnamed (I-1); Yelp's licence (I-2) | Yelp in local answers (I-3); Foursquare, Bing, Mapbox (I-4) | The site's facts (French first); the Yelp listing, claimed only; Foursquare; Bing Places |
| Perplexity | Yelp data, 2024 (I-5) | Tripadvisor (I-6) | Yelp; Tripadvisor; the site |
| Gemini, AI Mode, AI Overviews, Ask Maps | Google Maps places and reviews (I-7, G-23) | AI Mode's local lists (I-9) | The Google profile, complete; reviews from every customer |
| Copilot | A deeper integration, planned (B-2) | Bing's local index (B-3) | Bing Places, imported from the finished Google profile |
| Siri and Apple Intelligence | Apple Maps; Yelp reviews; Foursquare, Tripadvisor, Yellow Pages Group, OSM (A-12, A-14) | Apple's own ratings (A-13) | Apple Business; Yelp; Foursquare; PagesJaunes; an OSM point (20c S-4, owner's OK) |
| Meta AI | Web information (I-13) | Bing and Google (I-14) | The Facebook page; the site |

Same rules for every one of them: one name spelling, the same hours everywhere, no text written « for AI », never a request for Yelp reviews (research/18 #4c).

---

## 5. Local ranking: Google's statement and the industry survey

| # | Finding | Label | Source | Seen |
|---|---|---|---|---|
| R-1 | **Google.** « Les résultats locaux sont principalement basés sur la pertinence, la distance et la popularité. » Relevance is how well a profile matches the search; distance, how far each business is from the searcher (Google uses what it knows of the location when none is given); prominence (« Notoriété ») is how well known a business is. It also rests on « le nombre de sites Web qui renvoient à votre entreprise » and on reviews: « un nombre élevé d'avis et des notes positives peuvent aider ». « Il n'existe pas de moyen de payer pour obtenir un meilleur classement local sur Google ou d'en faire la demande. » The tips: complete information, verification, hours including special hours, replies to reviews, photos and videos. The page read today mentions neither articles, directories nor position in web results | verified (official) | Google « Astuces pour améliorer votre classement local sur Google » (7091, fr-CA and en) | 2026-10-29 |
| R-2 | **Whitespark, Local Search Ranking Factors, 2026 edition** (published 2025-11-06, Darren Shaw): 47 experts, a two-hour survey, 187 factors scored for local pack/Maps, local organic, conversion and, new in 2026, AI search visibility. « None of the experts have special access to the internal workings of Google's local search algorithm. » The AI-search scoring is ambiguous, because a factor can matter for AI Mode and not for ChatGPT. Biggest 2026 change in the local pack: review and behavioural signals up; on-page and link signals slightly down | unverified (industry opinion) | whitespark.ca/local-search-ranking-factors/ | 2026-10-29 |
| R-3 | **Local pack/Maps, top 10** (score): 1 Primary GBP category (227); 2 Proximity of the address to the point of search (225); 3 Keywords in the GBP business title (223); 4 Physical address in the city of search (213); 5 Business open at the time of search (189); 6 High numerical Google ratings, 4–5 (181); 7 Address showing, not a service-area business (176); 8 Additional GBP categories (173); 9 Quantity of native Google reviews with text (170); 10 Proper placement of the map pin (165) | unverified (industry opinion) | same | 2026-10-29 |
| R-4 | **AI search visibility, top 10** (score): 1 Presence on expert-curated « best of » and similar lists (179); 2 A dedicated page for each service (170); 3 Prominence on key industry-relevant domains (167); 4 Quality and authority of unstructured citations: newspaper articles, blog posts, government sites, associations (160); 5 Authority of the third-party sites where reviews are present (156); 6 City or neighbourhood relevance of the content (153); 7 Quantity of unstructured citations (147); 8 High numerical Google ratings (146); 9 The site's focus on a niche (138); 10 A scannable structure across the site (137) | unverified (industry opinion) | same | 2026-10-29 |

What it means for Coco Vanille (reading, not a promise):

| Factor | Status | The move |
|---|---|---|
| Primary and additional categories (R-3: 1, 8) | Names found (§1B), picker unread | T2, then the owner's choice (closing table) |
| Proximity; address in the city (R-3: 2, 4) | Fixed facts: 3, rue Court, Granby | Nothing to do. Never a second listing (docs/05 §8) |
| Keywords in the name (R-3: 3) | **Forbidden** by Google (G-2) and by the house rules | Never. A name with « Granby » or « gâteaux » risks suspension |
| Open at the time of search (R-3: 5) | Hours published; holiday hours missing | Exact hours everywhere; holiday hours by 1 December (docs/05 §3) |
| Ratings and native reviews (R-3: 6, 9; R-4: 8) | 4.9 from about 41 reviews (unverified copies, 20a) | Ask every customer, no gating, no gift (docs/03) |
| Map pin (R-3: 10) | Verified (20c G-1) | Nothing to do |
| « Best of » lists; citations (R-4: 1, 4, 7) | Two directories name the shop (research/05 W44.4) | docs/06 §4 and docs/04 |
| A page per service; local content (R-4: 2, 6) | Built, not online (README) | The domain first (21 §3) |

---

## 6. What changes in which doc (hand-off; this step edits no other file)

The docs/05 changes are in the closing table, at the end of this file. The other changes:

| Where | Was | Now | Evidence |
|---|---|---|---|
| research/06 (c) | Apple: UTM rule « conflicting Apple docs »; country list for Actions and Showcases « Not found » | UTM parameters approved, `gclid` and tokens prohibited; Showcases accept `fr-CA`; the Canadian feature row read | A-2, A-8, A-10 |
| research/06 (d) | 750 characters and category names « Not found »; Ask Maps secondary | 750 verified; names in §1B (EN verified, FR-CA unverified); « Demander à Maps » in Canada from Google's own post | G-1, G-10 to G-13, G-22 |
| research/06 (o) | ChatGPT: Mapbox, Bing, Foursquare (secondary); Siri « Not found » | ChatGPT: Yelp licence (official), Yelp in answers (reported); Siri searches through Maps; Apple Maps' providers named | I-2, I-3, A-12, A-14 |
| research/06 (r) | « Canada is in the list of countries » for ordering providers | The help page no longer lists countries; Canada rests on Google's Canadian restaurants page | G-31, G-32 |
| research/18 #2 | Rename: secondary only | Official: Apple Newsroom, 2026-03-24 | A-1 |
| research/18 #18 | « Yelp feeds Apple Maps »: Partly | Yelp reviews in Apple Maps: official (attribution page); which rating a Granby card shows: still self-test 18 | A-12, A-13 |
| research/18 #19 | Ask Maps in Canada around August 2026, English only (secondary) | Canada from 2026-08-06: official; languages not stated | G-22 |
| research/11 §1.2 | Yelp → « Apple Maps (UNVERIFIED) »; Foursquare → ChatGPT only; OSM « not searched » | Yelp → Apple Maps reviews (official) and ChatGPT (Yelp's licence); Foursquare, Tripadvisor, Yellow Pages Group → Apple Maps listings (official); OSM → Apple Maps map data (official) | A-12, I-2 |
| docs/06 §3, Priority 1 | Yelp: « Plans d'Apple (non vérifié) »; Foursquare: « Données de lieux de ChatGPT »; PagesJaunes: « Citation » only | Yelp: Plans d'Apple (avis) and ChatGPT (licence de Yelp); Foursquare and PagesJaunes: also Plans d'Apple; Tripadvisor: also Plans d'Apple | A-12, I-2 |
| docs/06 §3, Priority 2 | OpenStreetMap: « applications qui les utilisent au Canada : non vérifié » | Plans d'Apple uses OSM map data (attribution page). The shop has no OSM point (20c G-4): add it with the owner's OK (20c S-4) | A-12 |
| docs/03 §6.3 | Fake reviews: report, document, Competition Bureau | Add Google's sanctions: new reviews blocked for a period, existing reviews unpublished, a warning to customers; email first; appeal | G-26 |
| docs/03 §8 | Yelp: never ask | Unchanged. Yelp now also reaches ChatGPT (I-2), which makes a claimed, correct listing worth more; the rule against asking stays | I-2, research/18 #4c |
| docs/19 §6 | Lists are « le premier coup hors du site » | Consistent with Whitespark's top AI-visibility factor (industry opinion) | R-4 |
| data/directories.csv (for its owner) | « Feeds » for Yelp, Foursquare, Tripadvisor, PagesJaunes, OSM | Same changes as docs/06 | A-12 |
| apps/web | — | No change from this step | — |

---

## 7. Open items (routed)

**Agency, in the Google dashboard (self-test T2, once manager access exists, 14 S2):**
1. Type « pâtisserie », « boulangerie », « gâteau » and « café » in the category picker and note the French labels. Confirm « Boulangerie-pâtisserie ». Switch the dashboard to English to tell "Cafe" from "Coffee shop", then choose one (§1B).
2. Note every attribute the form offers to a « Boulangerie-pâtisserie » in Canada, identity attributes included (G-14, G-17).
3. Note whether « Commande de repas » exists for the category (G-31), and whether featured posts are offered (G-22b).

**Owner (one reply or one photo each):**
4. Choose the café category and say yes or no to « Magasin de gâteaux » (§1B).
5. Wi-Fi, payment methods, entrance and seat count, so the attributes can be set (14 H5, O5, N3; 20c A-1).
6. The storefront sign photo (14 S3). It now serves the name decision and video verification (G-29).
7. OK to add the shop to OpenStreetMap (20c S-4), which Apple Maps uses (A-12).

**Self-tests on phones (docs/05 §9):**
8. Test 19: « Demander à Maps » in French (G-22).
9. Test 18: the rating source on Apple Maps cards in Granby (A-13).
10. Test T3 now only checks that the action link with its UTM tags is approved (A-10). Also check how Apple records a closed holiday, since temporary hours record open times only (A-4).

**Agency research, later:**
11. Whether a Google-verified import skips Bing's verification (B-3): read it in the Bing portal.
12. A Microsoft statement on what Copilot uses for local answers (B-2, B-3).
13. Whether Yelp content appears in ChatGPT's answers for Canadian queries: the weekly prompt panel (research/05 W44.10) records the cited sources (I-3).
14. The practitioners' list of suspension triggers was not checked; Google's pages name only general rules (G-30).
15. The 2026-04-17 date of the staff clauses stays secondary (G-25b).

---

## 8. Search log

### WebSearch (25 queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Filter | Useful result |
|---|---|---|---|
| 1 | "gcid:pastry_shop" OR "gcid:cake_shop" Google Business Profile category list French | — | Nothing (dictionary and travel pages) |
| 2 | liste catégories Google Business Profile français "Boulangerie-pâtisserie" "Pâtisserie-confiserie" "Magasin de gâteaux" | — | No list; French APE codes; OSM `shop=pastry` |
| 3 | Google Business Profile categories full list by language country gcid tool alternative to Pleper | — | Daltonluka's 2026 list; Sterling Sky's caveat (identifier vs display name); PlePer's language and country filters |
| 4 | Google Business Profile help identity attributes "women-owned" "Black-owned" countries available Canada | — | Help page 14150971; no country list; TechCrunch (US-only at launch) |
| 5 | Google Business Profile attributes list for bakery cafe "dine-in" "takeout" "wheelchair accessible entrance" "NFC mobile payments" "Wi-Fi" 2026 | — | No official list; vendor guides |
| 6 | "Ask Maps" Gemini Google Maps Canada French language rollout 2026 | — | MobileSyrup 2026-08-06; the Google Canada post on Gemini navigation |
| 7 | support.google.com business "questions and answers" Business Profile Q&A discontinued Ask Maps help page 2026 | — | Secondary only (BrightLocal, PPC Land, Slashpost) |
| 8 | Google Business Profile help fake reviews policy violation "temporarily" block new reviews warning on profile restrictions 2025 2026 | — | Help page 14114287; the 2025 safety report; the July 2026 review pause |
| 9 | support.google.com business "Business Profile performance" metrics interactions calls "direction requests" "website clicks" "food orders" "menu clicks" searches | — | Help page 10018786; the Performance API reference |
| 10 | Whitespark Local Search Ranking Factors 2026 results top factors local pack AI search visibility | — | whitespark.ca, 2026 edition (2025-11-06) |
| 11 | Apple Business feature availability by country region Showcases Branded Mail Business Caller ID Canada support.apple.com 2026 | — | The feature-availability page (en-CA) |
| 12 | Apple Maps place card ratings reviews source 2026 Yelp Tripadvisor Apple own reviews iOS 26 Canada | — | Conflicting; a July 2026 post (Yelp only) |
| 13 | Apple Business 2026 business information appears "Apple Maps" "Siri" "Spotlight" "Wallet" "Mail" place card brand logo how Siri finds local businesses | — | Apple Newsroom, 2026-03-24 |
| 14 | Bing Places for Business 2026 Copilot local results business listings import from Google verification update | — | The Bing blog (2025-10-03); vendor claims on import and verification |
| 15 | Microsoft Copilot local business answers maps places data source Bing "Copilot" "Bing Maps" restaurant results 2026 Microsoft announcement | — | Vendor claims only |
| 16 | OpenAI help center ChatGPT search maps local businesses "third-party" providers data "Foursquare" OR "Mapbox" OR "Yelp" official 2026 | — | The Yelp–OpenAI report; Mapbox (secondary) |
| 17 | Yelp OpenAI deal license reviews ChatGPT local search Axios July 2026 | — | Axios 2026-07-23 and its relays |
| 18 | openai.com ChatGPT search "local" places map results improvements release notes Yelp business listings official announcement | — | Summary of OpenAI's help (maps on mobile, approximate location); a Search Engine Land analysis |
| 19 | Perplexity local business results data source Yelp Tripadvisor partnership places maps 2026 | — | Maginative (2024); a Tripadvisor partnership (hotels) |
| 20 | Google blog AI Mode local search results "Business Profile" Google Maps data places reviews ratings hours how AI Mode shows local businesses | — | Secondary only (Whitespark, Humanlevel, SOCi) |
| 21 | Gemini Apps Help "Google Maps" app in Gemini find places reviews hours support.google.com/gemini local businesses Canada French | — | Secondary; nothing on Canada or French |
| 22 | "Grounding with Google Maps" Gemini API "250 million places" Google developers blog | — | Google's post of 2025-10-17 |
| 23 | Meta AI local business recommendations data source search partners Bing Google 2026 "Meta AI" restaurants nearby Canada | — | 2024 reports; Meta's newsroom |
| 24 | support.apple.com iPhone User Guide Siri "find" places restaurants nearby Apple Maps "Ask Siri" Apple Intelligence ChatGPT extension local | — | The iPhone User Guide (Maps chapter) |
| 25 | Yelp shareholder letter 2026 OpenAI agreement data licensing ChatGPT investor relations Yelp official | — | Yelp's 8-K exhibit 99.2 (2026-02-12) |

### WebFetch (65 calls, 2026-10-29)

| # | URL (short) | Result |
|---|---|---|
| 1 | support.google.com/business/answer/3039617?hl=en | G-1, G-3 to G-6 |
| 2 | …/3039617?hl=fr-CA | The French wording of G-1, G-3, G-4, G-21 |
| 3 | …/3038177?hl=en | G-2, G-7 to G-9, G-30 |
| 4 | …/3038177?hl=en (second read) | The name list (G-2) |
| 5 | pleper.com GBP category tool (form page) | How the tool works; identifier and name columns |
| 6 | daltonluka.com/blog/google-my-business-categories | G-10, G-11 (first 100,000 characters) |
| 7 | …/14150971?hl=en | G-15, G-16, G-17 |
| 8 | …/14150971?hl=fr-CA | G-14, G-15 (French labels) |
| 9 | support.google.com/maps/answer/9935285?hl=en | Attribute groups only (not used) |
| 10 | google.com/intl/en_ca/business/restaurants/ | HTTP 301 to business.google.com |
| 11 | business.google.com/ca-en/business-profile/restaurants/ | G-18, G-32 |
| 12 | …/10842217?hl=en | G-31 |
| 13 | …/10842217?hl=fr-CA | G-31 (French labels) |
| 14 | …/7213077?hl=en | G-22c |
| 15 | …/7342169?hl=en | G-22a, G-22b |
| 16 | mobilesyrup.com/2026/08/06/ask-maps-gemini-google-maps/ | G-22 (Canada; agentic features not in Canada) |
| 17 | blog.google/…/ask-maps-immersive-navigation/ | G-23 |
| 18 | support.google.com/contributionpolicy/answer/7400114?hl=en | G-25 |
| 19 | …/14114287?hl=en | G-26 |
| 20 | …/7107242?hl=en | G-28 |
| 21 | …/7107242?hl=en (links) | The video article's address |
| 22 | …/14271705?hl=en | G-29 |
| 23 | …/4569145?hl=en | G-30 |
| 24 | …/9918328?hl=en | HTTP 404 (guessed ID) |
| 25 | …/10018786?hl=en | G-33 |
| 26 | …/9124203?hl=en | G-20 |
| 27 | …/9265883?hl=en | HTTP 404 (guessed ID) |
| 28 | …/7091?hl=en | R-1 |
| 29 | …/7091?hl=fr-CA | R-1 (French wording) |
| 30 | whitespark.ca/local-search-ranking-factors/ | R-2 to R-4 (first 100,000 of 373,084 characters) |
| 31 | apple.com/ca/business/ | Apple Business listed as « New and noteworthy »; no features |
| 32 | business.apple.com | Maps listing, custom actions, insights; « availability varies by country and region » |
| 33 | support.apple.com/en-ca/guide/business/feature-availability-axmef1c47twq/web | A-2 |
| 34 | …/guide/business/welcome/web | The guide's table of contents |
| 35 | …/abcbdc543423/web | A-4, A-5 |
| 36 | …/abcb04e20054/web | A-7 |
| 37 | …/abcb04e20054/web (links) | The language list's address |
| 38 | …/language-list-for-showcases-abcb88b4fea6/1/web/1 | A-8 |
| 39 | …/abcb06152096/web | A-10 |
| 40 | …/abcba5e65376/web | A-9 |
| 41 | gspe21-ssl.ls.apple.com/html/attribution.html | A-12 |
| 42 | same (second read) | The exact lines; « Rev. 10/21/2026 » |
| 43 | apple.com/ca/business/connect/ | A « Redirect » page with no text |
| 44 | apple.com/ca/newsroom/2026/03/introducing-apple-business-… | A-1, A-3, A-11 |
| 45 | bing.com/forbusiness | Empty to the reader |
| 46 | blogs.bing.com/search/October-2025/… | B-1, B-2 |
| 47 | axios.com/2026/07/23/yelp-reviews-chatgpt-geo-partnership | HTTP 403 |
| 48 | searchengineland.com/openai-yelp-deal-483326 | HTTP 403 |
| 49 | martech.org/yelp-brings-reviews-and-local-leads-to-chatgpt/ | I-3 |
| 50 | help.openai.com/en/articles/9237897-chatgpt-search | HTTP 403 |
| 51 | help-lb.openai.com/en/articles/9237897-searching-the-web-with-chatgpt | HTTP 403 |
| 52 | maginative.com/article/perplexity-enhances-ai-search-engine-with-direct-yelp-data-integration/ | I-5 |
| 53 | blog.google/products/search/google-search-ai-mode-update/ | I-9 (nothing on local data) |
| 54 | about.fb.com/news/2024/04/meta-ai-assistant-built-with-llama-3/ | I-13 |
| 55 | blog.google/intl/fr-ca/fil-dactualite/la-navigation-google-maps-avec-gemini-… | No language or Canada detail; links to the Ask Maps post |
| 56 | same (links) | The « Demander à Maps » post's address |
| 57 | blog.google/intl/fr-ca/produits/…/demander-a-maps-devient-encore-plus-utile-… | G-22, G-24 |
| 58 | sec.gov/…/yelpq42025ex992lettertos.htm | I-2 |
| 59 | …/6103862?hl=en | G-22d |
| 60 | …/6303076?hl=en | Timed out |
| 61 | …/6303076?hl=fr-CA | G-7 |
| 62 | support.apple.com/en-ca/guide/business/abcb98816a34/web | A-5, A-6 |
| 63 | blog.google/innovation-and-ai/technology/developers-tools/grounding-google-maps-gemini-api/ | I-7 |
| 64 | support.apple.com/en-ca/guide/iphone/iphbaf51b2c0/ios | Truncated (navigation only) |
| 65 | same, from character 30,000 | Navigation only; the page was read with curl instead (A-14) |

### Direct lookups (curl, 2026-10-29, UTC)

| Lookup | Result |
|---|---|
| PlePer form page (15:17) | The form sends `lang` and `country` by GET; Canada = 32, France = 66 |
| PlePer, French + Canada (15:17:56) | 3,935 categories parsed; SHA-256 `0ac57e16…e3221` |
| PlePer, English + Canada (15:17:56) | 4,044 categories parsed; SHA-256 `e015b993…50a41` |
| PlePer, French + France (15:19:22) | 3,880 categories parsed; SHA-256 `2daeae7e…01046` |
| HEAD request, French + Canada | `Content-Type: text/html; charset=UTF-8` (the accented labels are correct UTF-8) |
| Apple iPhone User Guide, Maps chapter (15:44:24) | A-14 sentences; SHA-256 `f0dc6b95…a901b` |

---

## Sources

All seen 2026-10-29.

Official: Google
- Edit your Business Profile (Google Business Profile Help) — https://support.google.com/business/answer/3039617?hl=en — seen 2026-10-29
- Same page, French (Canada) — https://support.google.com/business/answer/3039617?hl=fr-CA — seen 2026-10-29
- Guidelines for representing your business on Google — https://support.google.com/business/answer/3038177?hl=en — seen 2026-10-29
- Comment définir un horaire spécial — https://support.google.com/business/answer/6303076?hl=fr-CA — seen 2026-10-29
- Manage your business attributes / Gérer les attributs de votre entreprise — https://support.google.com/business/answer/14150971?hl=en and https://support.google.com/business/answer/14150971?hl=fr-CA — seen 2026-10-29
- Edit place information in Google Maps (Google Maps Help) — https://support.google.com/maps/answer/9935285?hl=en — seen 2026-10-29
- Google Business Profile for restaurants (Canada) — https://business.google.com/ca-en/business-profile/restaurants/ — seen 2026-10-29
- Manage online ordering options — https://support.google.com/business/answer/10842217?hl=en and https://support.google.com/business/answer/10842217?hl=fr-CA — seen 2026-10-29
- Business Profile photos, videos & posts content policy — https://support.google.com/business/answer/7213077?hl=en — seen 2026-10-29
- Posts on your Business Profile (Google Business Profile Help) — https://support.google.com/business/answer/7342169?hl=en — seen 2026-10-29
- Photos and videos on your Business Profile (Google Business Profile Help) — https://support.google.com/business/answer/6103862?hl=en — seen 2026-10-29
- About product editor — https://support.google.com/business/answer/9124203?hl=en — seen 2026-10-29
- Prohibited and restricted content (Maps user-contributed content policy) — https://support.google.com/contributionpolicy/answer/7400114?hl=en — seen 2026-10-29
- Business Profile restrictions for policy violations — https://support.google.com/business/answer/14114287?hl=en — seen 2026-10-29
- Verify your business on Google — https://support.google.com/business/answer/7107242?hl=en — seen 2026-10-29
- Verify your business with a video recording — https://support.google.com/business/answer/14271705?hl=en — seen 2026-10-29
- Fix suspended or disabled profiles — https://support.google.com/business/answer/4569145?hl=en — seen 2026-10-29
- Understand your Business Profile performance & insights — https://support.google.com/business/answer/10018786?hl=en — seen 2026-10-29
- Tips to improve your local ranking on Google / Astuces pour améliorer votre classement local sur Google — https://support.google.com/business/answer/7091?hl=en and https://support.google.com/business/answer/7091?hl=fr-CA — seen 2026-10-29
- Ask Maps and Immersive Navigation (Google, 2026-03-12) — https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/ — seen 2026-10-29
- « Demander à Maps devient encore plus utile : commande de repas et plus encore » (Google Canada, 2026-08-06) — https://blog.google/intl/fr-ca/produits/explorez-obtenez-des-reponses/demander-a-maps-devient-encore-plus-utile-commande-de-repas-et-plus-encore/ — seen 2026-10-29
- « La navigation Google Maps avec Gemini est en cours de déploiement partout où Gemini est offert » (Google Canada, 2025-11-05) — https://blog.google/intl/fr-ca/fil-dactualite/la-navigation-google-maps-avec-gemini-est-en-cours-de-deploiement-partout-ou-gemini-est-offert/ — seen 2026-10-29
- AI in Search: Going beyond information to intelligence (Google, 2025-05-20) — https://blog.google/products/search/google-search-ai-mode-update/ — seen 2026-10-29
- Grounding with Google Maps: Now available in the Gemini API (Google, 2025-10-17) — https://blog.google/innovation-and-ai/technology/developers-tools/grounding-google-maps-gemini-api/ — seen 2026-10-29

Official: Apple
- Introducing Apple Business (Apple Newsroom, Canada, 2026-03-24) — https://www.apple.com/ca/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/ — seen 2026-10-29
- Apple Business feature availability (published 2026-04-14) — https://support.apple.com/en-ca/guide/business/feature-availability-axmef1c47twq/web — seen 2026-10-29
- Apple Business User Guide (en-CA), welcome and table of contents — https://support.apple.com/en-ca/guide/business/welcome/web — seen 2026-10-29
- Add a location in Apple Business — https://support.apple.com/en-ca/guide/business/abcb98816a34/web — seen 2026-10-29
- Configure location attributes in Apple Business — https://support.apple.com/en-ca/guide/business/abcbdc543423/web — seen 2026-10-29
- Create your first showcase in Apple Business — https://support.apple.com/en-ca/guide/business/abcb04e20054/web — seen 2026-10-29
- Language list for showcases in Apple Business — https://support.apple.com/en-ca/guide/business/language-list-for-showcases-abcb88b4fea6/1/web/1 — seen 2026-10-29
- About Actions in Apple Business — https://support.apple.com/en-ca/guide/business/abcba5e65376/web — seen 2026-10-29
- Action URL standards and guidelines in Apple Business — https://support.apple.com/en-ca/guide/business/abcb06152096/web — seen 2026-10-29
- Apple Maps data attribution (Rev. 10/21/2026) — https://gspe21-ssl.ls.apple.com/html/attribution.html — seen 2026-10-29
- Find nearby attractions, restaurants, and services in Maps on iPhone (en-CA) — https://support.apple.com/en-ca/guide/iphone/iphbaf51b2c0/ios — seen 2026-10-29
- Apple Business — https://business.apple.com/ — seen 2026-10-29
- Apple at Work, Canada — https://www.apple.com/ca/business/ — seen 2026-10-29
- apple.com/ca/business/connect (a redirect page) — https://www.apple.com/ca/business/connect/ — seen 2026-10-29

Official: Microsoft
- Introducing the New Bing Places for Business (Bing blog, 2025-10-03) — https://blogs.bing.com/search/October-2025/Introducing-the-New-Bing-Places-for-Business-Built-for-Business-Owners,-Powered-by-Research — seen 2026-10-29
- Bing Places for Business (empty to the reader) — https://www.bing.com/forbusiness — seen 2026-10-29

Official: other companies
- Yelp, letter to shareholders for Q4 2025 (Form 8-K, exhibit 99.2, 2026-02-12) — https://www.sec.gov/Archives/edgar/data/1345016/000134501626000011/yelpq42025ex992lettertos.htm — seen 2026-10-29
- Meta, « Meet Your New Assistant: Meta AI, Built With Llama 3 » (2024-04-18, updated 2024-07-03) — https://about.fb.com/news/2024/04/meta-ai-assistant-built-with-llama-3/ — seen 2026-10-29
- OpenAI Help Center, ChatGPT search (HTTP 403 this session) — https://help.openai.com/en/articles/9237897 — seen 2026-10-29

Third parties (opened)
- PlePer, Google Business Profile Categories tool — https://pleper.com/index.php?do=tools&sdo=gmb_categories — seen 2026-10-29
  - French + Canada — https://pleper.com/index.php?do=tools&sdo=gmb_categories&go=1&lang=fr&country=32&show_table=1
  - English + Canada — https://pleper.com/index.php?do=tools&sdo=gmb_categories&go=1&lang=en&country=32&show_table=1
  - French + France — https://pleper.com/index.php?do=tools&sdo=gmb_categories&go=1&lang=fr&country=66&show_table=1
- Daltonluka, Google Business Profile Categories (Complete List – 2026; 4,046 categories as of 2026-05-09) — https://daltonluka.com/blog/google-my-business-categories — seen 2026-10-29
- Whitespark, Local Search Ranking Factors (2026 edition, 2025-11-06) — https://whitespark.ca/local-search-ranking-factors/ — seen 2026-10-29
- MobileSyrup, Ask Maps coming to Canada (2026-08-06) — https://mobilesyrup.com/2026/08/06/ask-maps-gemini-google-maps/ — seen 2026-10-29
- MarTech, « Yelp brings reviews and local leads to ChatGPT » (2026-07-28) — https://martech.org/yelp-brings-reviews-and-local-leads-to-chatgpt/ — seen 2026-10-29
- Maginative, « Perplexity Enhances AI Search Engine with Direct Yelp Data Integration » (2024-03-12) — https://www.maginative.com/article/perplexity-enhances-ai-search-engine-with-direct-yelp-data-integration/ — seen 2026-10-29
- Axios, « Exclusive: Yelp partners with ChatGPT to surface reviews » (2026-07-23; HTTP 403) — https://www.axios.com/2026/07/23/yelp-reviews-chatgpt-geo-partnership — seen 2026-10-29
- Search Engine Land, OpenAI–Yelp deal (HTTP 403) — https://searchengineland.com/openai-yelp-deal-483326 — seen 2026-10-29

Third parties (search summaries only, not opened)
- BrightLocal, Google Business Profile Q&A — https://www.brightlocal.com/learn/google-business-profile-qa — seen 2026-10-29
- PPC Land, Q&A API discontinued — https://ppc.land/google-discontinues-business-profile-q-a-api-effective-november-3/ — seen 2026-10-29
- Slashpost, Google Business Profile Q&A removed in 2026 — https://slashpost.ai/blogs/google-business-profile/google-business-profile-qa-removed-2026 — seen 2026-10-29
- Search Engine Roundtable, Google Maps spam fighting 2025 — https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html — seen 2026-10-29
- Techwyse, missing Business Profile reviews (2026) — https://www.techwyse.com/news/platform-updates/google-business-profile-reviews-missing-investigation-2026 — seen 2026-10-29
- Sterling Sky, categories (identifier vs display name) — https://www.sterlingsky.ca/category-google-business-profile/ — seen 2026-10-29
- TechCrunch, Asian-owned label (US-only at launch) — https://techcrunch.com/?p=2364729 — seen 2026-10-29
- AppleWorld Today, Apple Maps reviews (July 2026) — https://appleworld.today/apple-maps-adds-trip-advisor-booking-com-reviews — seen 2026-10-29
- BrightLocal, Bing Places import (vendor) — https://www.brightlocal.com/?p=72209 — seen 2026-10-29
- Pinmeto, Bing partnership (vendor) — https://www.pinmeto.com/knowledge-hub/bing-partnership/ — seen 2026-10-29
- Optimixed, Copilot links local reviews to Google Maps — https://www.optimixed.com/microsoft-copilot-links-local-reviews-to-google-maps/ — seen 2026-10-29
- Search Engine Land, how ChatGPT conducts local searches — https://searchengineland.com/how-does-chatgpt-conduct-local-searches-454894 — seen 2026-10-29
- Search Engine World, Mapbox local search in ChatGPT — https://www.searchengineworld.com/getting-your-business-on-the-map-in-chatgpt-local-search-comes-to-chatgpt — seen 2026-10-29
- Perplexity × Tripadvisor (relay) — https://www-web.itiger.com/news/2502048270 — seen 2026-10-29
- Whitespark, guide to Google's AI Mode for local businesses — https://whitespark.ca/guides/whitesparks-guide-to-googles-ai-mode-for-local-businesses/ — seen 2026-10-29
- Humanlevel, Google AI Mode and local search results — https://www.humanlevel.com/en/blog/seo/google-ai-mode-and-local-search-results — seen 2026-10-29
- Search Engine Journal, Meta integrates Google and Bing results into its AI assistant (2024) — https://www.searchenginejournal.com/meta-integrates-google-bing-search-results-into-ai-assistant/514291/ — seen 2026-10-29

Repo inputs
- research/06 (a), (b), (c), (d), (o), (r), §4; research/18 #2, #4a, #4c, #11a, #17, #18, #19; research/11 §0, §1, §1.2; research/04 §0; research/05 W44.4, W44.5, W44.10; research/20a §0, §1, §2; research/20b §0, §1 (S-1, S-3, S-8, S-10 to S-16, S-19), §3 (N-3, N-4, N-11); research/20c G-1, G-4, A-1, S-4; research/20d (no platform rows); research/20e §5 row 15; research/21 A3, A7, A10, B2, B5, B6; research/14 S2, S3, S5, H5, N1, N3, O5; research/15 D1, D19, D27; docs/05 (all); docs/06 §1, §3, §4; docs/03 §1, §6.3, §8; docs/19 §1.3, §3, §6; data/facts.json (read only)

---

## What changes in docs/05

The « What it should say » column is Québec French, ready to paste; it keeps docs/05's existing typography. Rows 1–3 are side corrections from research/20b and research/21; the others come from this step. Nothing here is applied: docs/05 is edited by the next step.

| # | Field (docs/05) | Current text | What it should say | Source |
|---|---|---|---|---|
| 1 | §1, Cellulaire | « 438-528-7818 : affiché « Cellulaire » sur le site; ce numéro reçoit-il les textos ou les réservations d'ateliers? À confirmer » | « 438-528-7818 : le numéro que la boutique publie pour réserver les ateliers, du vendredi au dimanche (vérifié, publication du 22 octobre 2026). Textos : [[FACT NEEDED: research/14 N1]] » | 20b S-19; research/21 A7 |
| 2 | §1, Instagram | « non vérifié : [[FACT NEEDED: confirmer le compte (research/14 T4)]] » | « vérifié : compte public et actif, même biographie et mêmes numéros que Facebook (29 octobre 2026) » | 20b §0.1; research/21 A10 |
| 3 | §1, Phrase de catégorie | « à confirmer (research/14 S5; décision D19) » | « Option B, décision de l'Agence du 29 octobre 2026 (research/21 B2), modifiable par la propriétaire » | research/21 B2 |
| 4 | §0, question 3 (enseigne) | « La fiche doit porter le nom réel. » | Ajouter : « La même photo sert à la validation : pour une validation par vidéo, Google demande de voir le nom de l'entreprise sur une enseigne permanente, et un nom invisible sur la devanture est un motif de refus (aide Google, consultée le 29 octobre 2026). » | G-29 |
| 5 | §2, ligne 3, Nom | « On ne sait pas si un changement de nom déclenche une nouvelle validation (non vérifié, research/12 §7) : le faire une seule fois, en dehors de la période chargée des Fêtes. » | « Google l'écrit : « Si vous modifiez le nom de votre entreprise après sa validation, vous devrez peut-être valider votre entreprise à nouveau. » Donc : un seul changement, en dehors des Fêtes, avec la photo de l'enseigne en main. Aussi interdits : le nom répété en deux langues, même si l'enseigne l'affiche; les mots tout en majuscules; un repère de lieu ou d'entrée. » | G-2, G-3 |
| 6 | §2, nouvelle ligne après la ligne 1 : Validation | — | « Google choisit la méthode : vidéo enregistrée, appel vidéo en direct, téléphone ou texto, courriel ou carte postale. Vidéo : au moins 30 secondes, d'un seul trait et en direct; montrer la rue (plaque, numéro de l'immeuble), l'enseigne avec le nom, puis un geste réservé à la boutique (ouvrir la caisse). Examen : jusqu'à 5 jours ouvrables. Pendant une validation par carte postale, ne pas modifier le nom, l'adresse ni la catégorie. » | G-28, G-29 |
| 7 | §2, ligne 4, Catégorie principale | « Les noms exacts de la liste n'ont pas pu être vérifiés (research/06 (d)) : taper « pâtisserie », « boulangerie », « gâteau », « café » dans le champ et noter les choix offerts (auto-test T2, §9). » | « Proposition : « Boulangerie-pâtisserie » (en anglais « Pastry shop »; identifiant gcid:pastry_shop), le nom de la liste de Google pour le Canada en français (outil PlePer, relevé du 29 octobre 2026; à confirmer dans le champ, auto-test T2). Elle correspond à l'activité du registre (« Boulangeries et pâtisseries ») et à la phrase de catégorie B. En français de France, la même catégorie s'appelle « Pâtisserie »; « Pâtisserie-confiserie » (gcid:patisserie) est une autre catégorie, qui suppose des confiseries. » | G-4, G-10, G-12, G-13; §1B |
| 8 | §2, ligne 5, Catégories secondaires | « **Le moins possible**, seulement ce qui est vrai : une catégorie « boulangerie » (…) et une catégorie « café » (« Pâtisserie & Café »), si la liste les offre » | « Jusqu'à neuf catégories supplémentaires sont permises, mais le moins possible : « Boulangerie » (gcid:bakery) et un seul « Café ». La liste en français du Canada affiche deux catégories différentes nommées « Café » : « Cafe » (gcid:cafe) et « Coffee shop » (gcid:coffee_shop); passer l'interface en anglais pour choisir. Proposition : « Cafe », parce qu'on y sert des boissons et des bouchées à manger sur place. « Magasin de gâteaux » (gcid:cake_shop) seulement si la boutique veut mettre en avant les gâteaux sur commande. Jamais « Restaurant marocain » ni « Restaurant nord-africain » : aucune catégorie ne désigne une pâtisserie marocaine, et la boutique n'est pas un restaurant; les msemmens et les harchas vont dans les produits, la description et les publications. Jamais « Boulangerie-pâtisserie spécialisée en gâteaux de mariage ». » | G-4, G-11, G-12; §1B; 20b S-13 |
| 9 | §2, ligne 9, Heures spéciales | « à côté de « Heures spéciales », l'icône crayon » | « à côté de « Heures spéciales », sélectionner « Modifier » » (libellé de l'aide Google; le reste de la ligne est confirmé) | G-7 |
| 10 | §2, ligne 11, Autres numéros | « Rien pour l'instant » · « Le 438-528-7818 s'ajoute seulement quand la boutique dit à quoi il sert (research/14 N1). » | « Google permet jusqu'à deux numéros supplémentaires. Le 438-528-7818 est le numéro que la boutique publie pour réserver les ateliers : il peut s'ajouter comme autre numéro, avec l'accord de la boutique. » | G-6; 20b S-19 |
| 11 | §2, ligne 13, Lien de commande | « marqué « préféré » pour la cueillette » · « le Canada fait partie des pays où cette section existe (research/06 (d), (r)) » | « Chemin : « Commande de repas » → « Ajouter un lien » → « Définir comme préféré » → activer « Préféré pour le ramassage » (libellé de Google; dans nos textes, on garde « cueillette ») → « Enregistrer ». L'aide de Google ne nomme plus de pays; la page de Google pour les restaurants au Canada indique que les commerçants canadiens peuvent travailler avec des fournisseurs de commande en ligne. Section offerte pour une boulangerie-pâtisserie : auto-test T2. » | G-31, G-32 |
| 12 | §2, ligne 14, Description | « Limite de 750 caractères selon le guide rank-first, non vérifiée (research/06 (d)) : le compteur du champ fait foi (auto-test T2). » | « « Ne dépassez pas 750 caractères dans le champ de description. » « N'incluez pas d'URL ni de code HTML. » Pas de promotions, de prix ni de soldes (aide Google, consultée le 29 octobre 2026). » | G-1 |
| 13 | §2.1, titre et texte proposé | « Description proposée (293 caractères sans le marqueur, pour une limite de 750) » | Titre : « Description proposée (391 caractères sans le marqueur; limite de Google : 750) ». Texte : « Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. La boutique est au 3, rue Court. On y trouve aussi des spécialités marocaines, comme les msemmens et les harchas. On peut s'y asseoir pour prendre un café, et des ateliers créatifs sont offerts sur réservation. Les gâteaux sur commande se récupèrent en boutique. [[FACT NEEDED: délai pour commander un gâteau, en jours (research/14 P4)]] » (proposition; la boutique valide) | G-1; 20b S-13, S-16 |
| 14 | §2, ligne 16, Attributs | « Un attribut d'identité (par exemple « Appartenant à une femme ») seulement s'il est vrai et si la boutique le souhaite. » | Ajouter : « Attributs d'identité de Google : « Appartenant à une femme », « Appartenant à une personne noire », « Appartenant à des Autochtones », « Appartenant à un membre de la communauté LGBTQ+ », etc., et « Petite entreprise » (moins de 10 millions de dollars américains de chiffre d'affaires annuel; Google peut l'ajouter lui-même). L'aide ne dit pas lesquels existent au Canada : noter ce que le formulaire offre (auto-test T2). La boutique écrit « sur place ou à emporter » : cocher les attributs de service sur place et à emporter si le formulaire les offre (libellés exacts à noter). » | G-14 to G-19 |
| 15 | §2, ligne 17, Produits | « (aide Google; la page d'aide ne détaille pas les champs : vérifier le formulaire) » | Ajouter : « Google présente l'éditeur de produits pour les commerces qui vendent des biens en magasin et renvoie les restaurants vers l'éditeur de menus. Les msemmens et les harchas, publiés par la boutique, deviennent des produits dès qu'il y a une vraie photo. » | G-20; 20b S-13 |
| 16 | §2, ligne 18, Menu | « Si la fiche offre un éditeur de menu » | « Si la fiche offre un éditeur de menu (« L'éditeur de menus est destiné aux entreprises de restauration uniquement », section « Menu ou services (disponibilité limitée) ») » | G-21 |
| 17 | §2, ligne 20, Photos et vidéos | (les formats, tailles et durées) | Confirmé; ajouter : « Les photos et vidéos peuvent prendre de 24 à 48 heures à paraître. On peut demander le retrait d'une photo ajoutée par un client. » | G-22d |
| 18 | §2, ligne 21, Publications | « Éviter le numéro de téléphone dans le texte : Google peut refuser la publication s'il ne peut pas vérifier le numéro (aide Google). » | « Pas de numéro de téléphone, de courriel ni de compte de réseau social dans le texte : Google peut retirer une publication dont les coordonnées ne sont pas vérifiées; utiliser plutôt le bouton d'appel. Une publication peut se répéter (chaque semaine, chaque mois). Tant que la fiche n'est pas validée, les publications restent « en attente ». Les publications mises en avant existent au Canada pour les commerces d'alimentation à un seul emplacement, en anglais seulement pour l'instant (aide Google). » | G-22a to G-22c |
| 19 | §2, ligne 22, Questions et réponses | « Ask Maps est offert au Canada en anglais depuis environ août 2026; le français n'est pas vérifié (research/18 #19). » | « « Demander à Maps » (Ask Maps) est offert au Canada depuis le 6 août 2026 (blogue de Google Canada); Google ne précise pas les langues : auto-test 19. Il s'appuie sur les renseignements de plus de 300 millions de lieux et sur les avis de la communauté (Google, 12 mars 2026). La commande de repas et les mises à jour proposées par les utilisateurs, comme des heures modifiées, arrivent d'abord aux États-Unis : des heures exactes sur la fiche restent la meilleure défense. » | G-22 to G-24 |
| 20 | §2, ligne 24, Avis et réponses | « Tout est dans docs/03-messages-avis.md. » | Ajouter : « Si Google détecte de faux avis, il peut bloquer les nouveaux avis pendant un temps, masquer les avis existants et afficher un avertissement aux clients; il prévient par courriel, et on peut faire appel (aide Google, consultée le 29 octobre 2026). » | G-26 |
| 21 | §2, ligne 26, Statistiques de la fiche | « Appels, demandes d'itinéraire, clics vers le site, chaque mois » | « Chaque mois : vues (personnes uniques par jour), recherches (termes, mis à jour au début de chaque mois, jusqu'à 5 jours de délai), itinéraires, appels, clics vers le site, produits (vues), menus (clics) et offres. » | G-33 |
| 22 | §2, nouvelle ligne : Suspension et appel | — | « Une fiche qui ne respecte pas les règles peut être suspendue. Un seul appel, dans l'outil d'appel de Google, avec une preuve (registre, licence, facture de services publics) au nom et à l'adresse de la fiche. Ne jamais créer une deuxième fiche. » | G-30 |
| 23 | §6, introduction (Apple) | « Apple Business est le nouveau nom d'Apple Business Connect depuis le 14 avril 2026 (sources secondaires, research/18 #2). » | « … depuis le 14 avril 2026 : un service gratuit, offert dans plus de 200 pays et régions (Apple Newsroom, 24 mars 2026). Au Canada : la gestion de la marque et des emplacements, Branded Mail et Tap to Pay sur iPhone (page d'Apple sur les fonctions offertes par pays). » | A-1, A-2 |
| 24 | §6, ligne 4, Remplir les champs | « site (une page Facebook est acceptée en attendant le site) » | Ajouter : « une seule catégorie principale et jusqu'à 19 autres; téléphone avec l'indicatif du pays, sans poste. À la mise en ligne, le site cocovanillegranby.com : une autre page d'Apple refuse un site tiers. Les heures temporaires d'Apple notent des heures d'ouverture, pas des fermetures : vérifier comment inscrire un jour férié fermé (auto-test T3). » | A-4, A-5 |
| 25 | §6, ligne 5, Action « Commander » | « Tester si le formulaire accepte `?utm_source=apple&utm_medium=organic`; sinon, adresse simple (auto-test T3). » | « Apple accepte utm_source, utm_medium, utm_campaign, utm_term et utm_content dans les liens d'action et refuse gclid et les jetons (aide Apple, consultée le 29 octobre 2026) : `https://cocovanillegranby.com/commander/?utm_source=apple&utm_medium=organic`. Les clients doivent avoir iOS ou iPadOS 17.4 ou plus; l'approbation prend jusqu'à trois jours ouvrables. » | A-9, A-10 |
| 26 | §6, ligne 6, Vitrine saisonnière | « Offerte au Canada? [[FACT NEEDED: auto-test 2 de research/18 §2]] » | « Le français du Canada est une langue acceptée pour les vitrines. Titre de 38 caractères, texte de 100 caractères, jusqu'à 365 jours (90 par défaut), examen jusqu'à trois jours civils; si une langue est refusée, toute la vitrine l'est. Soumettre la vitrine des Fêtes au moins trois jours à l'avance. » | A-7, A-8 |
| 27 | §6, ligne 8, Notes affichées | « noter d'où viennent les notes (Apple, Yelp, Tripadvisor, PagesJaunes) : auto-test 18 » | Ajouter : « La page d'attribution de Plans (révisée le 21 octobre 2026) nomme Yelp pour les avis, Foursquare, Tripadvisor et Yellow Pages Group parmi les fournisseurs de données d'entreprises, et OpenStreetMap pour la carte : la fiche Yelp réclamée, Foursquare, Tripadvisor et PagesJaunes doivent être exactes (docs/06). » | A-12, A-13 |
| 28 | §7, introduction et ligne 2 (Bing) | « Microsoft annonce une intégration plus étroite avec Copilot, encore à venir » | Confirmé; ajouter à la ligne 2 : « L'importation conserve le nom, les heures et les coordonnées (blogue Bing, 3 octobre 2025). Qu'une fiche Google validée dispense de la validation Bing n'est pas confirmé par Microsoft. » | B-1 to B-3 |
| 29 | §9, T2 | « Taper « pâtisserie », « boulangerie », « gâteau », « café » dans la catégorie et noter les noms exacts. Lire le compteur de caractères de la description. » | « Taper « pâtisserie », « boulangerie », « gâteau » et « café » et noter les noms exacts; confirmer « Boulangerie-pâtisserie »; passer l'interface en anglais pour distinguer « Cafe » et « Coffee shop ». Noter les attributs offerts, dont les attributs d'identité, et si « Commande de repas » existe. » (Le compteur n'est plus nécessaire : la limite de 750 est vérifiée.) | G-1, G-12, G-14, G-31 |
| 30 | §9, T3 | « Accepté avec les paramètres, ou adresse simple » | « Lien approuvé avec les paramètres utm (Apple les accepte); noter aussi comment inscrire un jour férié fermé » | A-4, A-10 |
| 31 | §9, test 19 | « toucher « Ask Maps » » | « toucher « Demander à Maps » (« Ask Maps » en anglais), offert au Canada depuis le 6 août 2026 » | G-22 |
| 32 | Sources, « Sources publiques » | — | Ajouter les pages d'aide Google 3039617 (fr-CA), 3038177, 14114287, 7107242, 14271705, 4569145, 10842217 (fr-CA), 7213077, 7342169, 10018786 et 7091 (fr-CA); le billet de Google Canada du 6 août 2026; Apple Newsroom (24 mars 2026); les pages d'Apple sur les fonctions par pays, les attributs, les vitrines, les langues des vitrines, les actions et les paramètres d'URL; la page d'attribution de Plans; le blogue Bing (3 octobre 2025); PlePer (liste des catégories, Canada) | §8, Sources |
