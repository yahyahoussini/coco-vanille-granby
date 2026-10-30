# 20b · Products and offers: what the shop sells, and how (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Track: products, café, workshops, prices, ordering, payment, delivery, gift cards, seasonal offers.
Mandate: Yahya, 2026-10-29 (« take all decisions based on what I give and web research »). This file records **facts and their sources only**. Where a fact was not found, §5 routes it either to the owner (a fact nobody may invent) or to an agency decision taken in another step. No decision is taken here.
Machine-readable twin: `data/research-offers.json` (same ids as the tables below).

How this was made, and its limits:
- **16 WebSearch queries** (standard mode, US-located) and **41 WebFetch reads**, all on 2026-10-29. Both logs are at the end.
- **The shop's Instagram could be read for the first time.**
  - The profile page and each post's public embed page (`/p/<code>/embed/captioned/`) returned the captions.
  - The plain post pages stopped answering after the first reads (a rate limit or login wall, inference).
  - Quotes come through WebFetch's summarising reader. The wording is as returned: check it against the post before printing it. Quotes drop the emojis.
- **Post dates** come from the profile grid ("Photo by Coco•vanille on …"). The grid showed 12 posts: one pinned (2026-08-25), then 2026-09-05 → 2026-10-22. Older posts, if any, were not visible.
- **Instagram's automatic image descriptions** ("May be an image of …") are machine guesses and are **not** used as evidence. Example: the 2026-09-18 reel is described as a "wedding cake", while its caption says « gâteau d'anniversaire ».
- **Pages that could not be read:**
  - Facebook (page, mobile, mbasic, page plugin) showed only the page name and its follower count. No post could be read, so Facebook posts appear here only through search summaries, and none surfaced.
  - Google Maps (CID 10789122976114705165) showed only its title, so its posts, products and menu were not seen.
  - RestoMontreal, find-open, Allbiz, Chamber of Commerce and Tripadvisor returned HTTP 403. Their content comes from search summaries, as in research/01.
- **Labels** (the mandate's rule):
  - **verified** = an owner channel (the shop's Instagram, its Facebook bio or about text, the Google listing data relayed by Yahya), or two independent non-owner sources.
  - **unverified** = one non-owner source, a review summary, a machine description, or an inference.
  - Product mentions drawn from customer reviews count as **one** source, even when several directories repeat them, because those directories summarise the same Google reviews (inference). One example: Three Best Rated's "frozen bread" highlight quotes the very review that says it.
- **Where seen:** **Shop** = published by the shop itself (§1) · **Third party** (§2) · **Not found** = searched and absent (§3). Absence of evidence is not proof.
- **Out of bounds** (mandate): allergens and cross-contact, prices the shop has not published, reviews and ratings, photos of real products. Ingredients named in a caption are **not** an allergen list. Where a shop post touches these, the row says « do not publish ».

---

## 0. Bottom line

1. **The shop's Instagram exists, is public and is active.**
   - Account: @coco_vanillegranby, display name « Coco•vanille ». 266 followers, 103 following.
   - Its bio repeats the Facebook bio word for word, with both phone numbers. The link in its bio opens a page titled « Pâtisserie Coco Vanille | Granby QC ».
   - Newest post: **2026-10-22**.
   - This ends "Instagram never found" (01 §7, 14 T4). It is also the first **owner** evidence that the shop is trading in late October 2026 (14 S1).
2. **The shop has published its own offer list** (pinned post, 2026-08-25). It is the strongest product source the project has:
   - « Viennoiseries & croissants » · « Pains frais » · « Pâtisseries gourmandes »
   - « Gâteaux personnalisés sur commande pour vos anniversaires et vos occasions spéciales »
   - « Options sans gluten et/ou sans lactose »
   - « Spécialités marocaines : msemmens, harchas et autres gourmandises »
   - hot drinks (café, espresso, cappuccino, latte, macchiato, thé, tisane, chocolat chaud) and cold drinks (café glacé, moka glacé, matcha)
   - a place to sit down: « un endroit chaleureux où vous pouvez vous installer, prendre un café »
3. **The 2026 posts show items the site does not list yet:**
   - savoury food: golden puff pastries, mini pizzas, chicken pastillas; tuna and cachir sandwiches; a savoury platter for events
   - chocolate mousse, « Gâteau Royal », a returning « Verrine Kunafa Pistache »
   - decorated custom cakes

   The site's six product pages (almond croissant, Paris-Brest, vol-au-vent, baguette, raspberry cake, strawberry shortcake) rest on older review summaries. All six are **unverified**, and the shop names none of them in its 2026 posts.
4. **The creative workshops are almost fully documented by the shop** (14 N2; reel 2026-10-22):
   - painting, or « bedazzling » with beads and rhinestones, on an item you choose
   - 2 h 30; the materials, one drink and one slice of cake are included
   - **37 $ per person**
   - Fridays, Saturdays and Sundays, booked at **438-528-7818**; places are limited
   - A Halloween pumpkin-bedazzling activity runs on the same days (2026-10-20).
   - Not stated: ages, group size, start times, taxes, prepayment, cancellation.
5. **The only price the shop has published is the workshop's 37 $.** No product price was found anywhere. RestoMontreal shows only "$–$$". The « à partir de 4 $ par portion » seen in search results belongs to choco.vanille (Le Marmiton), a different business.
6. **Not found anywhere:**
   - bûches de Noël, for any year (the expected 2024/2025 bûche posts did not surface; the Facebook timeline is unreadable)
   - a holiday menu
   - wedding cakes, macarons, chocolatines by name
   - lead times, deposits, gift cards, payment methods
   - delivery: the posts say only « sur place ou à emporter »

   §5 routes each one.
7. **Three conflicts with the site as built** (hand-off to the engineer; no file was edited, §4):
   - (a) The FAQ says to book workshops at 450-372-7177. The shop says 438-528-7818.
   - (b) The FAQ and allergen pages say the shop « ne présente aucun produit comme « sans gluten » » (and none as « sans lactose »). The shop's Instagram does present such options. The site still must not repeat the claim (07 A-6), but its sentence has to describe the site, not the shop.
   - (c) The « Que vend la Pâtisserie Coco Vanille? » answer names only the older review items.
8. **A compliance flag for the owner:**
   - « Sans gluten » in advertising, Instagram included, is a regulated claim (FDR B.24.018; 07 A-6). The 2026-08-25 post already makes it.
   - The rules for « sans lactose » were not checked in this session (UNVERIFIED).
   - The agency can't fix that post. The owner should hear about it, and 14 A1–A2 stay open.

### Coverage of the topics in this step

| Topic | Result | Rows |
|---|---|---|
| Viennoiseries (croissants, chocolatines) | Shop: viennoiseries and croissants. Almond croissant: third party. Chocolatines: not found | S-2, T-3, N-6 |
| Breads, baguettes | Shop: « Pains frais ». Baguettes and frozen bread: third party, 2025 | S-3, T-1, T-2 |
| Pastries (Paris-Brest, vol-au-vent, macarons) | Shop: chocolate mousse, Gâteau Royal, Kunafa verrine. Paris-Brest, vol-au-vent: third party. Macarons: not found | S-4…S-7, T-2, T-3, N-5 |
| Cakes (custom, birthday, wedding) | Shop: custom cakes for birthdays and special occasions. Weddings: not found | S-8, S-9, N-3 |
| Bûches de Noël; holiday menu | Not found | N-1, N-2 |
| Café drinks, seating | Shop: full drinks list; eat in or take away. Seat count: third party (~10) | S-14…S-16, T-3 |
| Ateliers créatifs | Shop: what, length, what is included, price, days, booking number, limited places | S-17…S-20 |
| Lead times; next-day orders | Lead times not found. Next day by phone: third party, 2025 | N-7, T-1 |
| Deposits; delivery; gift cards; payment methods | Not found | N-8…N-11 |
| Published prices | Workshop 37 $ only (shop) | S-18, N-12 |

---

## 1. Seen published by the shop (owner channels)

All rows: **verified** (owner source), seen 2026-10-29. "Use" is a hand-off note, not a decision.

| # | Item | What the shop says (quotes as returned) | Source (post date) | Use / note |
|---|---|---|---|---|
| S-1 | Offer list | Pinned « Bienvenue chez Coco Vanille »: viennoiseries & croissants; pains frais; pâtisseries gourmandes; custom cakes; « Options sans gluten et/ou sans lactose »; Moroccan specialities; hot and cold drinks; seating | Instagram, pinned post (2026-08-25) | Publishable as the shop's own words, **except** the free-from line (S-21) |
| S-2 | Viennoiseries | « Viennoiseries & croissants » | pinned post (2026-08-25) | Which ones, prices and bake times: not found (14 P1, H6) |
| S-3 | Bread | « Pains frais ». Hashtag #boulangerie on most posts | pinned post (2026-08-25) | Varieties not named. Baguette and frozen bread only in T-1/T-2 |
| S-4 | Pastries, general | « Pâtisseries gourmandes »; « Chez Coco Vanille, chaque pâtisserie est préparée et décorée avec soin, jusqu'au dernier détail. » | pinned post (2026-08-25); reel (2026-09-17) | Publishable |
| S-5 | Chocolate mousse | « Une mousse au chocolat onctueuse, une finition croquante et cette petite touche chocolatée… » | reel (2026-09-17) | Also answers part of 14 N4 (« mousse au chocolat ») |
| S-6 | « Gâteau Royal » | « Une pâtisserie intensément chocolatée, avec une texture fondante, une base croustillante et un glaçage chocolat brillant, sublimée par quelques noisettes. » « Disponible dès maintenant » | reel (2026-09-05) | Publishable. The hazelnuts named here are not an allergen list (14 A1) |
| S-7 | « Verrine Kunafa Pistache » | « Verrine Kunafa Pistache, de retour Chez @coco_vanillegranby » | photo (2026-10-09) | « De retour » = a returning item, so availability rotates (inference). Answers « verrines » in 14 N4 |
| S-8 | Custom cakes | « Gâteaux personnalisés sur commande pour vos anniversaires et vos occasions spéciales »; « nous réalisons vos gâteaux sur commande selon vos envies et votre événement »; bio: « Gâteaux sur commande ». Examples: chocolate–caramel–crunch (2026-09-13); a birthday cake « bedazzled » with pearls, gold touches and mini disco balls (2026-09-18) | pinned post (2026-08-25); carousel (2026-09-13); reel (2026-09-18); bio | Publishable. The shop's own words match the slug `/gateaux-personnalises-granby/` and « sur commande ». Weddings are **not** named (N-3) |
| S-9 | How to order a cake | « Écrivez-nous pour passer votre commande… » | carousel (2026-09-13) | The channel (Instagram DM? Facebook? text?) is not named. No lead time, no deposit |
| S-10 | Savoury snacks | « feuilletés dorés, mini pizzas généreusement garnies et pastillas au poulet. Parfait pour une petite pause, sur place ou à emporter. » | photo (2026-09-05) | Publishable. Explains the pizza story-highlight cover |
| S-11 | Savoury platter | « plateau de bouchées salées… à partager… ou à apporter lors de vos événements »: mini burgers (ground meat), tuna quiches, small salmon croissants, chicken wraps. « Pour commander votre plateau, contactez-nous en message privé ou directement à la pâtisserie. » | photo (2026-09-09) | Price, minimum and lead time not found. The closest thing to "boxes for events" (14 P12) |
| S-12 | Sandwiches | Tuna: « Thon, œuf, olives, tomate et salade… ». Cachir: « Saucisson de viande (cachir), fromage, tomate et salade… ». « Parfait pour une pause lunch gourmande, sur place ou à emporter. » | carousel (2026-09-20) | Answers « sandwiches/lunch » in 14 N4. **Halal is not stated**: don't infer it from « cachir » |
| S-13 | Moroccan specialities | « Spécialités marocaines : msemmens, harchas et autres gourmandises » | pinned post (2026-08-25) | Publishable. New for the menu and for the language and community pages |
| S-14 | Hot drinks | « café, espresso, cappuccino, latte, macchiato, thé, tisane, chocolat chaud… » | pinned post (2026-08-25) | Publishable (14 N3). No prices |
| S-15 | Cold drinks | « café glacé, moka glacé, matcha et autres boissons rafraîchissantes » | pinned post (2026-08-25) | Publishable (14 N3). No prices |
| S-16 | Eat in or take away | « un endroit chaleureux où vous pouvez vous installer, prendre un café… »; « sur place ou à emporter » | pinned post (2026-08-25); photo (2026-09-05); carousel (2026-09-20) | Publishable. Seat count only in T-3 (~10, unverified) |
| S-17 | Workshops: what | « tout nouveaux ateliers de décoration créative »: « Peinture ou Bedazzling avec des perles et des strass, choisissez votre article préféré et personnalisez-le à votre image. » Framed as a café outing: « Et si votre prochaine sortie café se transformait en une expérience créative unique ? » | reel (2026-10-22) | Publishable. Which items can be chosen (mugs, frames…) is not stated |
| S-18 | Workshops: length, what is included, **price** | « 2 h 30 de créativité et de plaisir » · « Un article à personnaliser avec le matériel de décoration fourni » · « Une boisson au choix » · « Une part de gâteau » · « **Le tout pour seulement 37 $ par personne** » | reel (2026-10-22) | **The only price the shop has published.** Taxes not stated |
| S-19 | Workshops: when, how to book | « Ateliers disponibles les vendredis, samedis et dimanches, sur réservation : 438 528 7818 » · « Places limitées, réservez votre moment créatif dès maintenant. » | reel (2026-10-22) | Answers 14 N1 for the workshops: **438-528-7818**. Whether the number takes texts is not stated. No start times, group size or ages |
| S-20 | Halloween activity 2026 | « Activité spéciale Halloween… décoration des citrouilles avec la tendance BEDAZZLE »; « Une activité créative et amusante à partager en famille ou entre amis »; « Tous les vendredis, samedis et dimanches »; « Réservez votre place au : 438 528 7818 »; « Places et quantités limitées » | reel (2026-10-20) | No price, no end date (#halloween2026). Seasonal: drop after 2026-10-31 (inference) |
| S-21 | Free-from statement | « Options sans gluten et/ou sans lactose » | pinned post (2026-08-25) | **Do not publish.** It is a regulated claim (07 A-6). Which products, how they are made and the cross-contact practice stay [[FACT NEEDED]] until a person at the shop verifies them (14 A1, A2) |
| S-22 | « Fait maison » | Hashtag #faitmaison on 3 posts (2026-09-17, 2026-10-09, 2026-10-15) | those posts | A hashtag, not a claim about every product. Frozen bread was sold in 2025 (T-1). Don't write « tout est fait maison » (14 S8) |
| S-23 | Facebook "about" | « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! » | facebook.com/PatisserieCocoVanille/about (undated; surfaced again 2026-10-29) | Already in facts.json (`products.owner_description`) |
| S-24 | Bio | « Pâtisserie & Café » · « Gâteaux sur commande » · « (450) 372-7177 » · « Ateliers créatifs sur réservation » · « (438) 528-7818 » | Instagram profile (seen 2026-10-29) | Same text as the Facebook bio relayed by Yahya on 2026-10-27 |
| S-25 | « Une première à Granby » | « UNE PREMIÈRE À GRANBY ! » (about the workshops) | reel (2026-10-22) | **Don't repeat it as a fact.** Les Finfinettes (24 rue Johnson, Granby) already advertises a café with creative workshops (tourism listing, search summary) |
| S-26 | Voice | The posts address customers as « vous » (« Venez découvrir… », « Réservez votre place… ») | all captions | An owner signal for 14 L3 / 15 D21 (tu or vous) |
| S-27 | Name in use | « Coco Vanille » in every caption (« Chez Coco Vanille », « Bienvenue chez Coco Vanille »); display name « Coco•vanille »; hashtag #cocovanille | all captions | A signal for 14 S3 / 15 D1. The storefront sign is still unseen |

Also seen, **unverified**:
- **Tagline.** « Votre petit coin douceur » appears as text inside the pinned image. It was read by Instagram's machine description, not from a caption.
- **Story highlights.** Six highlights carry emoji-only covers: speech bubble, cake, palette, croissant, pizza, coffee. Their content needs a login.

---

## 2. Seen on a third party

All rows: **unverified** under the labelling rule (single sources, or review summaries that may repeat the same Google reviews), unless stated otherwise. Seen 2026-10-29.

| # | Item | Value | Source (date on the page) | Use / note |
|---|---|---|---|---|
| T-1 | Three Best Rated: specialities, ordering, frozen bread | "Specialities: Pastries, Cakes, Custom-made Cakes, Breads, Baguettes, Croissants, Tarts, Cheesecakes." "just order by phone and your order will be ready the next day." "you can also find their bread and baguettes frozen". Review excerpts (FR): « …ces pains et baquettes congelées, solution pratique pour économiser l'essence », « Succulentes pâtisseries, délicieux café et excellent service! ». No prices, no payment methods | threebestrated.ca/bakeries-in-granby-qc, direct read ("2025 Highlights"; no other date) | Next day by phone (14 P4), cheesecakes and tarts are single-source. The frozen-bread highlight quotes one customer review. Owner « oui » needed (14 P2, N4) |
| T-2 | Wanderlog tips | "Consider ordering ahead by phone for popular items like vol-au-vents"; "Try their frozen breads and muffins"; "Customers highly recommend their raspberry cake and vol-au-vents"; "Try heavenly desserts like the strawberry shortcake"; "breads, baguettes, and frozen options" | wanderlog.com place 13122992, direct read (undated; filed under Magog) | Generated from Google reviews. The vol-au-vent, raspberry cake and shortcake pages rest on this. Not named by the shop in 2026 |
| T-3 | RestoMontreal (search summaries) | Croissants, cakes, tarts, handcrafted breads; "sweet and savoury"; almond croissants; Paris-Brest; chocolate tart; cream pastries; custom cakes; a raspberry cake "succulent"; a pistachio biscuit; "about ten seats"; listed among "takeout" places; price range "$–$$"; no online ordering (phone) | restomontreal.ca resto 20633 FR/EN/vote (search summaries; HTTP 403 on direct read; page title says 2026) | The almond-croissant and Paris-Brest pages rest on this. "$–$$" is a directory label, not a price |
| T-4 | Ready meals at the market (history) | Visitors to the 2022 market kiosk found « prêts-à-manger » from Pâtisserie Coco Vanille (kiosk ran until 2022-11-19) | La Voix de l'Est, 2022-10-23 (search summary) | History only. The 2026 owner posts (S-10…S-12) are the current evidence for savoury food |
| T-5 | Marché public de Granby | The exhibitor list includes « Pâtisserie Coco Vanille », categories « Spécialités » and « Sucré », with no description and no days | marchepublicgranby.ca/exposants/ and /exposants/patisserie-coco-vanille/, direct read (footer © 2026) | **verified** as a listing (the market's own site). Presence in 2026 and the days: not stated (14 S10) |
| T-6 | Delivery apps | The shop is not on the Uber Eats, DoorDash or SkipTheDishes Granby pages that surfaced | ubereats.com, doordash.com, skipthedishes.com (search, 2026-10-29) | Absence of evidence. Matches research/01 |
| T-7 | Not the shop's price | « à partir de seulement 4$ par portion » belongs to **choco.vanille** (Le Marmiton, 166 rue St-Charles Sud, Granby) | facebook.com/chocovanille.marmiton (search summary) | A name-collision risk (01 §8): AI answers may hand this price to Coco Vanille. **verified** as choco.vanille's own wording |

---

## 3. Not found (searched 2026-10-29)

Searched in: the 12 visible Instagram posts and the profile; Facebook through search; Three Best Rated, Wanderlog and PagesJaunes (direct reads); RestoMontreal (summaries); local press (Granby Express, La Voix de l'Est, M105, Le Guide, Radio-Canada, La Tribune); the delivery apps.

| # | Item | What was looked for | Result | Route (§5) | 14 |
|---|---|---|---|---|---|
| N-1 | Bûches de Noël, any year | « bûche », « Noël », « précommande », 2024–2026 | Nothing from the shop or about it. Facebook's timeline is unreadable, and the visible Instagram posts start on 2026-08-25 | Owner fact | P3 |
| N-2 | Holiday menu 2026 (vol-au-vent, tourtière, Fêtes) | idem | Nothing | Owner fact | P3 |
| N-3 | Wedding cakes; tiered cakes | captions, directories | Nothing. One machine description says "wedding cake", but its caption says birthday cake | Owner fact | P2 |
| N-4 | Smash cake, themed kids' cakes, characters, cupcakes, quinceañera | idem | Nothing | Owner fact | P2, P11 |
| N-5 | Macarons | idem | Nothing (a machine description's "coconut macaroon" is not evidence) | Owner fact | P2 |
| N-6 | Chocolatines, by name | idem | Nothing: only « viennoiseries & croissants » | Owner fact | P2 |
| N-7 | Lead time per cake type; a next-day rule stated by the shop | captions | Nothing. Only Three Best Rated (2025) says "ready the next day" | Agency decision (default) | P4 |
| N-8 | Deposit, cancellation, refund | captions | Nothing | Agency decision | O4 |
| N-9 | Delivery | captions, delivery apps | Nothing. The posts say « sur place ou à emporter » | Agency decision (15 D11: pickup only) | O3 |
| N-10 | Gift cards (cartes-cadeaux) | captions, search | Nothing | Agency decision | P2 |
| N-11 | Payment methods (cash, debit, credit, foreign cards) | captions, PagesJaunes, Three Best Rated, Wanderlog, search | Nothing | **Owner fact** (what the terminal takes; not a policy) | O5 |
| N-12 | Any product price, size or portion | everywhere | Nothing. Only the workshop's 37 $ (S-18) and the "$–$$" label (T-3) | Owner fact (**never invent**) | P1, P7 |
| N-13 | Bake-out times | captions | Nothing | Owner fact | H6 |
| N-14 | Workshops: ages, group size, start times, private groups or birthday parties, the items to choose from, taxes, prepayment, cancellation | both workshop captions | Not stated | Owner fact (ages, size, times, items); agency decision (prepayment, cancellation) | N2 |
| N-15 | Platter: price, minimum, lead time | caption S-11 | Not stated | Owner fact (price); agency decision (lead time, minimum) | P12 |
| N-16 | Framboisier, Boston cake, dessert trays (from the pasted strategy) | captions, search | Nothing | Owner fact | N4 |
| N-17 | Halal | captions | Not stated | Owner fact. Never infer it | — |
| N-18 | Corporate or viennoiserie boxes for groups | captions, search | Nothing (the savoury platter is the nearest offer) | Owner fact | P12 |

---

## 4. What this means for the site (hand-off; no file edited here)

The step forbids edits outside its two files, and `apps/web/src` may still be in use, so these are notes for the engineer:

1. **FAQ, workshops** (`apps/web/src/seed/content.js`, the « Offrez-vous des ateliers? » answer and its EN twin):
   - Change the booking number to **438-528-7818** (S-19).
   - The [[FACT NEEDED: thèmes, âges, durée, prix et dates des ateliers]] marker can now carry: painting or bedazzling, 2 h 30, 37 $ per person with a drink and a slice of cake, Fridays to Sundays.
   - Ages and start times stay open (N-14).
2. **Free-from sentences.** On the FAQ, `/allergenes/`, `/pains-baguettes/` and their EN twins, « La Pâtisserie Coco Vanille ne présente aucun produit comme « sans gluten » / « sans lactose » » is now contradicted by the shop's own post (S-21).
   - The site must still make no such claim (07 A-6, S10).
   - Reword it to talk about the site, e.g. « Ce site ne présente aucun produit comme « sans gluten » ou « sans lactose »… », and keep the allergen markers.
3. **« Que vend la Pâtisserie Coco Vanille? »** (FR/EN):
   - Lead with the shop's own 2026 list (S-1).
   - Name the review-sourced items (almond croissant, Paris-Brest, vol-au-vent, raspberry cake, strawberry shortcake) only once the owner confirms them (14 N4).
4. **Pages backed by the shop's own words:** `/viennoiseries/`, `/pains-baguettes/` (bread in general), `/patisseries/`, `/gateaux/`, `/gateaux-personnalises-granby/` and the café facts on `/carte/` and `/nous-trouver/`.
5. **Pages resting on unverified review mentions only:** `/viennoiseries/croissant-aux-amandes/`, `/patisseries/paris-brest/`, `/patisseries/vol-au-vent/`, `/gateaux/gateau-aux-framboises/`, `/gateaux/shortcake-aux-fraises/`, `/pains-baguettes/baguette/`, and the frozen-bread answer.
6. **No evidence at all:** `/buches-de-noel/` and `/en/yule-logs/`. 15 D20 (the Noël bridge, only if bûches are confirmed) stays conditional, and its date (2026-11-01) is three days away.
7. **Candidate content found in owner posts:**
   - a savoury and lunch section (S-10…S-12)
   - Moroccan specialities (S-13)
   - the drinks list (S-14, S-15)
   - a workshops section (S-17…S-20)
   - the returning verrine as a "back this week" item (S-7)
8. **Schema, once the agency decides how workshops appear:** an `Offer` with `price` 37 and `priceCurrency` CAD is supported by S-18. Tax treatment is unstated, so the price is copied as published.

---

## 5. Open items (routed)

**Owner facts.** Nobody may invent these. Each one can come back in one line or one photo.
1. Payment methods at the counter and for workshops (N-11; 14 O5).
2. Allergens and cross-contact for every product, starting with the « options sans gluten et/ou sans lactose »: which products, made how, with what precautions (S-21; 14 A1, A2). Also tell the owner that the Instagram line is a regulated claim (07 A-6).
3. Which older review items are still sold: almond croissant, Paris-Brest, vol-au-vent, raspberry cake, strawberry shortcake, baguette, frozen bread and baguettes, cheesecake, tarts, muffins, pistachio biscuit (T-1…T-3; 14 N4, P2).
4. Product prices, sizes and portions (N-12; 14 P1, P7), with the dated price grid the site requires.
5. Bûches 2026: yes or no, then flavours, sizes, prices and pickup days (N-1; 14 P3). The 2026-11-01 deadline is close.
6. Workshops: ages, group size, start times, which items can be decorated, whether 37 $ includes taxes, private groups or birthdays (N-14; 14 N2).
7. Does 438-528-7818 take texts? Which channel does « Écrivez-nous » mean on Instagram: DMs, Facebook Messenger, or both (S-9, S-19; 14 N1, N5)?
8. Seat count (T-3; 14 N3, H5) and bake-out times (N-13; 14 H6).
9. Halal or not, if the shop wants to say it (N-17). It must never be inferred.

**Agency decisions** (defaults the owner can change in Studio; taken in another step; benchmarks and law, not this file):
- deposit % and refund terms for custom cakes and platters (N-8)
- lead time per cake type and the next-day rule (N-7)
- delivery, where 15 D11 (pickup only) stands (N-9)
- gift cards at launch or not (N-10)
- workshop prepayment and cancellation, and how booking works on the site (phone only, or a request form) (N-14)
- platter lead time and minimum (N-15)

---

## 6. Side findings (outside this step; for the facts and status steps)

| Finding | Label | Source (seen 2026-10-29) | For |
|---|---|---|---|
| Instagram @coco_vanillegranby is the shop's account. Bio = Facebook bio; both shop numbers; 266 followers, 103 following; link in bio → « Pâtisserie Coco Vanille \| Granby QC » | verified (owner channel) | instagram.com/coco_vanillegranby/; facebook.com/share/1DThcg9BeB/ | 01 §7; facts.json `social.instagram` and `sameAs_unverified`; 14 T4 |
| Newest owner posts on 2026-10-20 and 2026-10-22 advertise activities at 3 rue Court | verified (owner) | the two reels | 14 S1 (trading in late October 2026) |
| Facebook page: 1 067 followers | verified (owner page header) | Facebook page plugin | facts.json `social.facebook` (was 1,046) |
| PagesJaunes shows only 450-372-7177 (« Principal »). No 450-372-5917, no hours | verified (direct read of the listing) | pagesjaunes.ca listing 102750737 | 14 H3; 01 §2.2 |
| Three Best Rated (EN) now shows Wed–Sat 8:30–17:30 and **Sun 9:00–17:00**, versus Sun 9:30–17:00 on the Google listing relayed by Yahya. 01 §3 had Thu–Fri 9–16:30, Sat 9–15 | verified (direct read of the listing) | threebestrated.ca/bakeries-in-granby-qc | 01 §3; the hours fix list (Sunday opening differs) |
| Marché public 2026 season: « Tous les samedis du 2 mai au 7 novembre »; « Les jeudis soir du 18 juin au 27 août ». The year is not printed, but the weekdays match 2026 and the footer says © 2026 | unverified (the year is an inference) | marchepublicgranby.ca/exposants/ | 01 §9.5 ("2026 dates not reproduced" → now seen) |
| Wanderlog shows Google 4.9 from 41 reviews (37/3/0/1/0) | unverified; **never publish** (no `aggregateRating`; read Google directly) | wanderlog.com place 13122992 | 01 §6; 14 S7 |

---

## Search log

### WebSearch (16 queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Filter | Useful result |
|---|---|---|---|
| 1 | "Coco Vanille" Granby bûche de Noël | — | Nothing about the shop |
| 2 | "Coco Vanille" Granby atelier créatif réservation | — | Nothing about the shop; Les Finfinettes (24 rue Johnson, Granby) surfaced |
| 3 | Pâtisserie Coco Vanille Granby | facebook.com | The "about" sentence; 605 likes / 1,046 followers (snapshots); choco.vanille's « 4$ par portion » |
| 4 | PatisserieCocoVanille posts bûches commandes Noël | facebook.com | No post surfaced |
| 5 | Cocovanille Granby pâtisserie menu prix | — | No menu or price; "$–$$"; a stray (450) 770-7246 in a block the summary could not attribute |
| 6 | coco_vanillegranby instagram | — | Nothing (perfume noise). The direct read then found the account |
| 7 | "Coco Vanille" Granby rue Court pâtisserie nouveaux propriétaires OR reprise OR ouverture 2026 | — | No takeover news; summary: Google reviews from Aug–Sep 2026 mention the Marché public |
| 8 | restomontreal Pâtisserie Cocovanille Granby avis 2026 marché public café gâteau | restomontreal.ca | Almond croissants, Paris-Brest, custom cakes, raspberry cake, pistachio biscuit, ~10 seats |
| 9 | "Pâtisserie Cocovanille" Granby | — | Nothing new; phone orders, no online ordering |
| 10 | "Pâtisserie Coco Vanille" Noël OR Fêtes OR "vol-au-vent" OR tourtière Granby commande | — | Nothing about the shop |
| 11 | Coco Vanille Granby livraison Uber Eats OR DoorDash OR "carte-cadeau" | — | Nothing |
| 12 | Coco Vanille Granby | ubereats.com, doordash.com, skipthedishes.com | Not listed |
| 13 | Coco Vanille Granby bûches précommande Noël 2025 pâtisserie 3 rue Court | — | Nothing about the shop |
| 14 | Pâtisserie Coco Vanille Granby accepts credit cards debit payment | — | Nothing |
| 15 | bedazzling atelier Granby café Coco Vanille 2026 | — | No third-party mention of the workshops; Les Finfinettes again |
| 16 | "Coco Vanille" Granby | granbyexpress.com, lavoixdelest.ca, m105.ca, journalleguide.com, ici.radio-canada.ca, latribune.ca | Only the two 2022 market articles |

### WebFetch (41 reads, 2026-10-29)

| # | URL (short) | Result |
|---|---|---|
| 1–2 | facebook.com/PatisserieCocoVanille/; mbasic.facebook.com/… | Title only; error page |
| 3 | restomontreal.ca resto 20633 FR | HTTP 403 |
| 4–5 | threebestrated.ca/bakeries-in-granby-qc | Read (T-1) |
| 6 | wanderlog.com place 13122992 | Read (T-2) |
| 7–9 | instagram.com/coco_vanillegranby/ | Read: bio, 12 posts, dates, links |
| 10–15 | instagram.com/p/… and /reel/… (plain pages) | One caption (2026-10-20); the rest returned only "Instagram" |
| 16–27 | instagram.com/p/<code>/embed/captioned/ × 12 (one read twice) | All 12 captions (§1) |
| 28 | Facebook page plugin (timeline tab) | Header only: 1 067 followers |
| 29 | google.com/maps?cid=10789122976114705165 | Title only |
| 30–31 | find-open.ca; allbiz.ca | HTTP 403 |
| 32 | pagesjaunes.ca listing 102750737 | Read (side findings) |
| 33–34 | chamberofcommerce.com; tripadvisor.ca | HTTP 403 |
| 35 | facebook.com/share/1DThcg9BeB/ (Instagram link in bio) | Title « Pâtisserie Coco Vanille \| Granby QC » |
| 36–38 | marchepublicgranby.ca/exposants/ (DNS failure, then www.); /exposants/patisserie-coco-vanille/ | Read (T-5) |
| 39–40 | embed of the 2026-10-22 and 2026-10-20 reels (targeted questions) | Ages, group size, times, taxes, cancellation: not mentioned |
| 41 | m.facebook.com/PatisserieCocoVanille/ | Error page |

---

## Sources

All seen 2026-10-29. "Direct read" = opened with WebFetch. Otherwise, a WebSearch summary.

Shop (owner channels)
- Coco•vanille (@coco_vanillegranby), Instagram profile, direct read — https://www.instagram.com/coco_vanillegranby/ — seen 2026-10-29
- « Bienvenue chez Coco Vanille » (pinned; post 2026-08-25) — https://www.instagram.com/p/Dcd6Ks4O-G5/ — seen 2026-10-29
- « Gâteau Royal » (reel 2026-09-05) — https://www.instagram.com/reel/Dc6sHszMKxT/ — seen 2026-10-29
- « Team salé sucré » feuilletés, mini pizzas, pastillas (post 2026-09-05) — https://www.instagram.com/p/Dc6u1avscrR/ — seen 2026-10-29
- « Une envie de salé ? » savoury platter (post 2026-09-09) — https://www.instagram.com/p/DdDH7oLg_h8/ — seen 2026-10-29
- « Un gâteau aussi beau que gourmand » custom cake (carousel 2026-09-13) — https://www.instagram.com/p/DdPKZ3TiYnm/ — seen 2026-10-29
- « Avis aux amoureux du chocolat » chocolate mousse (reel 2026-09-17) — https://www.instagram.com/reel/DdZg6XXt4nh/ — seen 2026-10-29
- « A little Bedazzling touch » birthday cake (reel 2026-09-18) — https://www.instagram.com/reel/DdcTXIkBcuz/ — seen 2026-10-29
- « Deux sandwichs, deux façons de se faire plaisir » (carousel 2026-09-20) — https://www.instagram.com/p/DdhC7keCdYf/ — seen 2026-10-29
- « Verrine Kunafa Pistache, de retour » (post 2026-10-09) — https://www.instagram.com/p/DeSbWThBvfM/ — seen 2026-10-29
- « Quelques délices » (reel 2026-10-15) — https://www.instagram.com/reel/DeiUWLvAi8n/ — seen 2026-10-29
- « Activité spéciale Halloween » pumpkin bedazzling (reel 2026-10-20) — https://www.instagram.com/reel/DevLPQ3gDCo/ — seen 2026-10-29
- « Une première à Granby ! » creative workshops, 37 $ (reel 2026-10-22) — https://www.instagram.com/reel/DezR46TBye6/ — seen 2026-10-29
- Captions were read through each post's embed page, e.g. https://www.instagram.com/p/DezR46TBye6/embed/captioned/ — seen 2026-10-29
- Pâtisserie Coco Vanille (Facebook page; search summary) — https://www.facebook.com/PatisserieCocoVanille/ — seen 2026-10-29
- Pâtisserie Coco Vanille, about (Facebook; search summary) — https://www.facebook.com/PatisserieCocoVanille/about — seen 2026-10-29
- Facebook page plugin (followers), direct read — https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FPatisserieCocoVanille&tabs=timeline — seen 2026-10-29
- Instagram link in bio (Facebook share link), direct read — https://www.facebook.com/share/1DThcg9BeB/ — seen 2026-10-29

Third parties
- 3 Best Bakeries in Granby, QC (Three Best Rated), direct read — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-29
- Pâtisserie Cocovanille, Magog, QC (Wanderlog), direct read — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-29
- Pâtisserie Cocovanille Granby: Menu, Reviews & Reserve (2026) (RestoMontreal EN) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/ — seen 2026-10-29
- Pâtisserie Cocovanille (RestoMontreal FR) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ — seen 2026-10-29
- Pâtisserie Cocovanille (RestoMontreal, vote) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/vote/ — seen 2026-10-29
- Patisserie Coco Vanille Inc (PagesJaunes), direct read — https://www.pagesjaunes.ca/bus/Quebec/Granby/Patisserie-Coco-Vanille-Inc/102750737.html — seen 2026-10-29
- Exposants (Marché public de Granby et région), direct read — https://www.marchepublicgranby.ca/exposants/ — seen 2026-10-29
- Pâtisserie Coco Vanille, exhibitor page (Marché public), direct read — https://www.marchepublicgranby.ca/exposants/patisserie-coco-vanille/ — seen 2026-10-29
- Un marché qui mise sur le bon voisinage (La Voix de l'Est, 2022-10-23) — https://www.lavoixdelest.ca/2022/10/23/un-marche-qui-mise-sur-le-bon-voisinage-cd5aafe8bfcdc08ab30265e590a93863/ — seen 2026-10-29
- Le Marché public de Granby aide les marchands de la rue Principale (Radio-Canada, 2022) — https://ici.radio-canada.ca/nouvelle/1932271/granby-travaux-marchand-rue — seen 2026-10-29
- La boutique chez Les Finfinettes à Granby (Québec Vacances) — https://www.quebecvacances.com/fr/attractions/les-finfinettes — seen 2026-10-29
- choco.vanille (Facebook; name collision, not the shop) — https://www.facebook.com/chocovanille.marmiton/ — seen 2026-10-29
- THE 10 BEST Cake Delivery in Granby (Uber Eats) — https://www.ubereats.com/ca/category/granby-qc/cake — seen 2026-10-29
- THE 10 BEST Desserts Delivery in Granby 2026 (Uber Eats) — https://www.ubereats.com/ca/category/granby-qc/dessert — seen 2026-10-29
- Order the best Breakfast near Granby, QC (DoorDash) — https://www.doordash.com/food-delivery/granby-qc-restaurants/breakfast/ — seen 2026-10-29
- Order Dessert Online in Granby (SkipTheDishes) — https://www.skipthedishes.com/city-cuisines/granby/dessert — seen 2026-10-29

Read but returned nothing usable (listed for the record): Google Maps CID 10789122976114705165; find-open.ca, allbiz.ca, chamberofcommerce.com and tripadvisor.ca (HTTP 403); m.facebook.com and mbasic.facebook.com (error pages).
