# 16a — Coco Studio admin UX: inspiration, patterns, anti-patterns

> Track: what "functional and easy to use" means for the Coco Vanille back office (admin.cocovanillegranby.com), with evidence.
> Stage: plan and brainstorm only. No production code. Code sketches are JavaScript and illustrative.
> Written 2026-10-25. Every factual claim has a source in §Sources or is marked UNVERIFIED / [[FACT NEEDED: …]].
> **UNVERIFIED (FC)** = flagged by the 2026-10-25 adversarial fact-check. The shared web-search budget was used up before that pass could search, so the claim was neither re-confirmed nor refuted. The author's cited source stands; re-check it before quoting. See the Verification log before §Sources.
> Evidence labels: **official** = vendor help/docs or a standards body · **community** = vendor forum post · **3rd-party** = review site, blog, retailer · **concept** = Dribbble/Behance design, never shipped as far as we know.
> Inputs read: plan-v1-ranking-stack.md (§9, §10, §12), plan-v0a-master-plan.md (Part 2, Part 6), plan-v0c-site-ux-ordering.md (§6 back-office, §8), requirements-2026-10-25.md, 01-business-facts.md. The CSV companion is data/admin-inspiration.csv (96 rows).
> CSV `verified` column: **yes** = a search result (an official, standards or community page) confirmed the pattern as described · **partial** = confirmed only by a third-party summary, or the page exists but its content was not inspected. Pages were seen through search summaries only (WebFetch was blocked), so re-check the wording before quoting it in client material.

---

## 0. Summary (read this if nothing else)

1. **The admin has two jobs, and the plans mix them.** v0a Part 6 and v1 §12 describe a *presence* control centre (health score, SEO gates, scoreboard, battle map: about 27 modules). The 2026-10-25 requirements add *ordering inside the site*, so Studio must also run the daily *shop* jobs (pickups, sold-out, quotes, deposits, "Prête" SMS). The staff should never see the presence half. Proposal: the default screen is **Aujourd'hui** (today's shop operations). **Présence** (SEO/AEO/GEO) and **Agence** are separate areas for the owner and the agency.
2. **The best merchant apps converge on the same 1-tap patterns.** Examples: sold-out with a duration that resets by itself (Square, Uber Eats, DoorDash, Owner.com); pause or busy mode with a duration and a reason (Uber Eats, Square, DoorDash); instant toggles with no Save button (Owner.com); a short undo window (Square KDS: 3 s, UNVERIFIED (FC)); an aggregated prep list (Hotplate Prep tab, Toast All Day View); automatic pickup texts (Hotplate). Copy these; none of them is new.
3. **Where Square and Shopify are weak for this bakery, there is room to be easier.** Shopify has no native bulk "ready for pickup" (community). Square's "ready" text is plan-gated (UNVERIFIED (FC)) and was unreliable in 2021 community reports. Square Online sites have one default language (community). Square inventory-tracked items cannot be 86'd. Square for Restaurants flows were called "restrictive and awkward" for a café (community).
4. **Touch targets: our floor is 48 × 48 CSS px everywhere.** That is 2× the WCAG 2.2 AA minimum of 24 px, the same as Material's 48 dp (≈ 9 mm) and above Apple's 44 pt (unit figures UNVERIFIED (FC)). Daily-job buttons are bigger (≥ 64 px tall, full width). The 64 px figure is our own design choice and has to be validated in the shop, with flour on the fingers.
5. **Offline is a requirement, not a feature.** Phone and tablet signal in a shop's back room is unreliable. Taps must be queued, shown instantly (under 0.1 s per NN/g), and replayed. Customer SMS goes out only after the server confirms. iOS web push works only for Home Screen web apps (WebKit; confirmed by research/18 claim 8), so installing the PWA is part of onboarding.
6. **French (Québec) first is both a legal and a usability floor.** Charter s.52.1 (1997 text) requires software to be available in French where a French version exists (UNVERIFIED (FC)). Bill 96 moved workplace documents to French from 2022-06-01 (McCarthy; UNVERIFIED (FC)). [[FACT NEEDED: lawyer's reading for custom in-house software]]
7. **No peer-reviewed UX study of non-technical bakery owners turned up.** The closest evidence: a 2021 Xero study of 4,200+ owners in 6 countries found that more than 6 in 10 Canadian owners felt overwhelmed by technology options. The claim that Canadians were the *most* likely of the 6 countries is UNVERIFIED (FC). A 2025 CFIB report cites tight budgets and digital-skills gaps. Design implication: few choices, defaults pre-set, no setup wizardry.

---

## 1. Context of use, and what "functional and easy" means here

### 1.1 Users, devices, conditions

| Who | Device (assumed until confirmed) | Conditions | Time budget |
|---|---|---|---|
| Owner / chef | Own phone; maybe a laptop at night | Interrupted constantly; hands in dough or flour; works across counter, kitchen and home | "Minutes per day" (owner requirement) |
| Counter staff | Shared tablet at the counter or kitchen | Several people, one device; customers waiting; noise | Seconds per action |
| Agency (Yahya) | Desktop | Long sessions, keyboard | Hours per week (v1 §9) |

- Business facts that shape the UI (01-business-facts.md): the hours conflict across directories (possibly a 3-day week). Next-day phone ordering is documented. There is one public complaint about a cake order made wrong. Custom cakes exist, but their volume is unknown. [[FACT NEEDED: number of staff, devices in the shop, current POS (if any), Wi-Fi/cellular coverage in the kitchen]]
- NN/g: the average mobile session is 72 s vs 150 s on desktop. A little over 40 % of mobile use consists of "microsessions" under 15 s. Apps should save state at all times and expect interruptions (NN/g, *Mobile Microsessions*, 2019; figures UNVERIFIED (FC)).

### 1.2 Definition of done for "easy" (acceptance criteria, ours)

| # | Criterion | Target | Basis |
|---|---|---|---|
| E1 | Each of the 10 daily jobs (§2) can be done from the phone | 100 % | Owner requirement |
| E2 | Taps from the home screen to completing a daily job | ≤ 3 (sold-out: 2, "Prête": 1) | Our target, derived from §3 patterns |
| E3 | Every interactive target | ≥ 48 × 48 CSS px, ≥ 8 px apart | Material/Android 48 dp, 8 dp spacing; WCAG 2.2 2.5.8 (24 px AA) |
| E4 | Visible response to a tap | < 0.1 s (optimistic UI) | NN/g response-time limits |
| E5 | No data loss on signal drop | 0 lost actions in the offline test | §7 |
| E6 | UI language | Québec French by default; English per user | §8 |
| E7 | Undo | Every single-tap state change can be undone for ≥ 5 s, or stays reversible | NN/g error prevention; Square KDS 3 s undo |
| E8 | No hidden-only gestures | Every swipe has a visible button equivalent | NN/g contextual swipe |
| E9 | Login | No password typed on the shared tablet (passkey or PIN) | WCAG 2.2 3.3.8 supports the passkey. Corrected (FC): a remembered 4-digit PIN may itself count as a "cognitive function test" under 3.3.8, so the staff PIN is a practicality choice, not a WCAG basis (UNVERIFIED (FC)) |
| E10 | Learnability | A new staff member does the 5 staff jobs unaided after a 10-minute walkthrough | Our target; test in §11 |

---

## 2. The 10 daily jobs → interaction budget → reference pattern

Targets are design goals, not measured values.

| # | Job (FR label in Studio) | Who | Budget (taps / time) | What the system does automatically | Closest proven pattern |
|---|---|---|---|---|---|
| J1 | Marquer épuisé | Staff | 2 taps / 5 s | Site shows « Épuisé aujourd'hui »; schema availability updates; resets at closing | Square "Make Available at End of Day"; Uber Eats "sold out for today"; DoorDash duration; Owner.com instant toggle |
| J2 | Vitrine du jour (photo of today's display case) | Staff | Photo + 2 taps / 60 s | Crop, compress, alt text draft (FR/EN/ES), publish to the site's vitrine block; drafts a Google post and an IG Story | v0a flow; Hotplate "duplicate +1 week" for reuse |
| J3 | Répondre à une demande de gâteau (accept / refuse) | Owner | 3 taps / 60 s | Templates for refusal and alternative dates; recap built from the structured request | Bakesy custom intake questions → auto-filled invoice with inspiration photos |
| J4 | Fixer le prix + envoyer le lien de dépôt | Owner | 3 taps + amount / 60 s | Deposit = % or fixed; payment link by SMS/email; recap with sketch/photo attached | Square Invoices deposits (fixed or %); v0c "set a price, send the deposit link" |
| J5 | Voir les cueillettes du jour | Staff, owner | 0 taps (it is the home screen) | Sorted by pickup time; status chips; language badge (v0b) | Toast KDS oldest→newest ticket order; Hotplate pickup windows |
| J6 | Marquer « Prête » → SMS | Staff | 1 tap (+ undo) | SMS « C'est prêt! »; status on the customer tracker | Hotplate completion text; Shopify "Ready for local pickup" notification |
| J7 | Fermeture exceptionnelle (snowstorm, sick day) | Owner | 3 taps / 30 s | Site banner in 3 languages; GBP special hours; SMS to affected pickups with a reschedule link; auto-revert (v0a flow 4) | Uber Eats pause (duration + reason); Square Pause Orders; DoorDash pause all channels |
| J8 | Heures des fêtes | Owner | Review pre-filled list + 1 tap | Québec holidays pre-filled (v0a); pushes to site, schema, GBP | GBP special hours (up to 6 consecutive days; "temporarily closed" beyond, per BrightLocal; UNVERIFIED (FC)) |
| J9 | Répondre à un avis | Owner | 2 taps / 30 s | AI draft in the reviewer's language; human approves (v1 §9, v0a) | Google review reply (moderated, ~10 min up to 30 days; UNVERIFIED (FC)) |
| J10 | Chiffres de la semaine | Owner | 0–1 tap | 5 numbers + 3 actions; Monday 7 a.m. digest (v0a flow 6) | Stripe daily-summary push; Shopify widgets; Square Dashboard app; Toast Now day-over-day |

Two jobs the plans do not list but the evidence suggests:

- **J11 Commande au téléphone (quick add).** Phone orders are documented (01-business-facts.md). If they bypass Studio, staff work from two queues, which is the "tablet hell" problem (Toast, The Spoon). v0c Rule #1 says the same: online and walk-in orders must land on one screen.
- **J12 Liste de production (tomorrow's prep list).** Hotplate's Prep tab and Toast's All Day View both exist because ticket-by-ticket views hide totals.

---

## 3. Reference gallery: what to steal, what to avoid

### 3.1 POS and back-office suites

| Product | Steal | Avoid | Evidence |
|---|---|---|---|
| **Square for Restaurants (POS)** | Long-press an item to change availability. An 86'd item cannot be ordered online, and staff get a warning in-house. An item that is out *temporarily* can be set to "Make Available at End of Day" (business hours, else 5 a.m.; community answer only, UNVERIFIED (FC)). | Items with inventory tracking on cannot be 86'd: availability follows stock, so there are two mechanisms for one concept. A café user found the restaurant flows "restrictive and awkward". A reviewer found creating menu items "very tedious, even when duplicating". | official (help 6425), community (297979, 297991, 643281, 717913), 3rd-party (Software Advice) |
| **Square Online / POS order manager** | Pause Orders for pickup or delivery, with a resume time and the remaining pause shown on the Orders tab. **Busy Mode** adds 15 min of prep time for 15 min / 30 min / 1 h (GB help page; figures and Canadian availability UNVERIFIED (FC)). | It lives in the POS app (v5.93+, UNVERIFIED (FC)), not on the website side. Community threads show sellers struggled for years to find a pause. One default language per site (community). | official (GB help 6703), community |
| **Square Invoices** | Deposit as a fixed amount or a %, with a separate due date for the balance; available on mobile. | Deposits apply to the whole order, so items can't be split. | official (GB help 6581) |
| **Square pickup texts** | Texts on "received" and "ready for pickup". Customers can reply "Here" to trigger an arrival alert. | Some text settings need a paid Square Online/Square plan (UNVERIFIED (FC)). 2021 community reports say the "ready" text sometimes didn't send. | official (help 6889), community (2021) |
| **Square KDS** | Tap an item or a ticket banner to complete it, **with 3 s to undo** (UNVERIFIED (FC)); a Completed tab with Recall; yellow → red timers you can configure; a sound on new tickets. | Android only; US$20/month per device after a 30-day trial (Square US page, seen 2026-10-25). UNVERIFIED (FC): price, trial and platform support not re-checked; the Canadian price was not looked up [[FACT NEEDED: Square KDS price on the Canadian page, in CAD]]. That is a separate device, a separate subscription and a separate screen. | official (help 8171, 7944; KDS page) |
| **Square Dashboard app** | Live sales on the phone. Beta users opened it about 12 times a day (2015 launch coverage). | The 2015 sources are dated; current features are not confirmed. | 3rd-party (Computerworld 2015) |
| **Toast (POS + Toast Web)** | Press and hold → Quick Edit → Out of stock, which blocks POS and online ordering. Quantity tracking auto-86s at 0. | Toast "is unable to reserve those items for future orders" when scheduling is on, so a limited item can sell out while sitting in a future cart. | official (support "86 an Item", updated 2025-12-17 per search summary; date UNVERIFIED (FC)) |
| **Toast Now (owner app)** | Search an item → toggle in-stock; sales and labour with day-over-day comparison; product mix; **throttle online ordering**; snooze takeout/delivery. | — | official (support page, updated 2026-09-03 per search summary; date UNVERIFIED (FC)) |
| **Toast online ordering capacity** | Capacity per interval (example: 3 orders per 15 min). Over the cap, the quoted time grows instead of the order being refused. | Community users say item throttling "still needs work" and want limits that vary by time of day. | official (Quote time strategies), community |
| **Toast offline mode** | Switches on automatically, with a banner after about 40 s (UNVERIFIED (FC)); tickets keep printing; payments are authorised later. Advice: one device per employee during an outage. | Toast documents that online ordering stops, and DoorDash Drive and Uber Eats get no orders, while devices are offline. | official (Toast offline docs) |
| **Lightspeed Restaurant** | Lightspeed Pulse: live sales and multi-location oversight from the phone. | Menu setup lives in the back office (Restaurant Manager). I found no source for a mobile sold-out toggle (UNVERIFIED either way). | official (support, Pulse page) |
| **Clover (Clover Go, formerly Dashboard app)** | Real-time sales and popular items; Clover says its redesigned dashboard shows key metrics at a glance, with navigation optimised for mobile. | I found no official doc on how the "hidden" and "online" flags interact (only third-party help pages). | official (Clover blog), 3rd-party (App Store listing, LoyLap) |

### 3.2 Commerce and payments

| Product | Steal | Avoid | Evidence |
|---|---|---|---|
| **Shopify mobile app** | New-order notifications; fulfil, refund and archive; bulk fulfil; edit orders; home-screen widgets for sales, orders and sessions; barcode-scan stock counts. The app follows the device language, and French is supported. | — | official (Shopify blog, help center) |
| **Shopify local pickup** | Three customer notifications: confirmation → "Ready for local pickup" → "Picked up"; the ready template is set per location. | Community: each order must be marked ready individually, with no native bulk option ("multiple page loads and clicks"). | official (help), community |
| **Shopify Polaris contextual save bar** | One page-level bar appears as soon as anything is edited: "Unsaved changes", Save / Discard. Don't let several forms on one page be edited at once. | The React component is deprecated in favour of App Bridge. The *pattern* is what we reuse. | official (Polaris docs) |
| **Shopify resource index** | Filter tabs, search and bulk selection for desktop power use. | Community: the native index table lacks a clear mobile bulk-action pattern ("mobile shows a list instead of a table"). | official (shopify.dev), community |
| **Shopify Sidekick (AI)** | The AI proposes a change and the merchant reviews it before it is saved; it respects user permissions; when it can't act, it links to the right page. | It can't talk to customers. | 3rd-party summaries only (UNVERIFIED against help.shopify.com) |
| **Stripe Dashboard mobile** | Push for new payments, alerts and a **daily summary**; lock-screen and home-screen widgets; refunds from the phone. | Not optimised for iPad. Payment-link management is iOS-only. (Both UNVERIFIED (FC).) | official (docs.stripe.com/dashboard/mobile) |

### 3.3 Ordering platforms and marketplaces

| Product | Steal | Avoid | Evidence |
|---|---|---|---|
| **Owner.com (Owner app)** | **The toggle takes effect immediately, with no separate Save step**, live on the website, app and in-house ordering. An "unavailable for X days" option where 1 = today only. Refund from the chat thread of the linked order. Hours and delivery toggles are live "in seconds". | Refunds are immediate and can't be reversed from the app. Marking an item unavailable doesn't touch orders already placed, which then need a manual refund. | official (help.owner.com, owner.com/mobile) |
| **Slice (Owner's App + Register)** | Phone, online and counter orders in one place; menu, hours, photos and promos edited once and synced in real time; daily totals live. | Pizza-specific; hardware billed monthly (3rd-party pricing, UNVERIFIED). | official (slice.com) |
| **Uber Eats Orders / Manager** | Pause = store-status button → duration → reason → confirm. **Busy mode** adds minutes for a set time. Delay a single order by 5/10/20/30 min. Sold out **"for today"** (auto-returns tomorrow) vs **"indefinitely"**. | — | official (merchants.ubereats.com learning centre) |
| **DoorDash Merchant (tablet + portal)** | Mark out of stock from inside the live order, choosing how long: a few hours, until end of day, or indefinitely. "Pause all ordering channels". The cancel flow shows the fees first and requires a reason. | Auto-pause if the tablet can't receive orders for 5+ min, which punishes a dead tablet. Yet another device. | official (help.doordash.com) |

### 3.4 Bakery, pre-order and custom-cake tools

| Product | Steal | Avoid | Evidence |
|---|---|---|---|
| **Hotplate (drops / pre-orders)** | Drops with open and close times and several pickup windows; drafts stay hidden until published; subscribers get a text before a drop opens. The **Prep tab** totals each item, grouped by pickup date. Printable packing tickets to staple on bags. **"Duplicate +1 week"**. Automatic texts 24 h, 2 h and 15 min before pickup, plus one when the order is complete; templates are editable in Settings › Notifications. | Reminder texts aren't customisable per location. | official (help.hotplate.com, blog) |
| **Bakesy (home-bakery app)** | **Custom intake questions** for requests. The invoice is **auto-filled** from the request, including inspiration photos. Orders are grouped by stage; calendar or list view; block off dates. | US-centric payment list (Venmo, Zelle…). Price US$10–18/month per AlternativeTo (UNVERIFIED). | official (App Store listing), 3rd-party |
| **CakeBoss** | Orders, invoicing, calendar, recipes, inventory and reports in one small-bakery tool. | Breadth over speed; only 5 Capterra reviews (4.2/5). The price shown changed between snapshots (UNVERIFIED). | 3rd-party (Capterra) |
| **Tock (takeout)** | Slot-based ordering with a limit on orders per time. | Marketing page only; setup UI not verified. | official marketing page |

### 3.5 Kitchen display and production

| Product | Steal | Avoid |
|---|---|---|
| **Toast KDS** | Tickets oldest on the left, newest on the right; fulfil a whole ticket or one item. Expediter vs prep-station roles. **All Day View** gives condensed counts of each item to prepare. | KDS hardware and setup are overkill for one counter. |
| **Square KDS** | 3 s undo; Recall; timers; per-modifier text colours. | A separate subscription per device. |
| **Hotplate Prep tab** | Totals per item per pickup date. This is exactly the « Production » list v0c asks for. | — |

What we take: the "Production" view is a **read-only aggregated list** (product × size × flavour × pickup day), printable on paper. It is not a KDS. A bakery producing the next day's orders needs totals and cut-offs, not ticket bumping.

### 3.6 Label printing at small bakeries

| Source | What it shows | Use in Studio |
|---|---|---|
| Toast item labels | One label per item, showing item name and modifiers, guest name, due date and time, and dining option. Supported printers: Epson L90/L100, Toast TLP400. Label printers can't print barcodes. | Box label: order #, first name, pickup time, cake message, « Contient : … » flag. Printed from the order card ("Imprimer l'étiquette"). |
| Brother QL-1110NWB bakery case study (Australia) | A small bakehouse prints its own allergen labels from desktop and mobile after a rule change. | Candidate printer family. QL-810W / QL-820NWB support AirPrint per retailer listings. [[FACT NEEDED: test-print a 62 mm label from the Studio PWA in iPad Safari: size, cut, margins]] |
| Cybake + Dill (UK) | Recipe and allergen data flow into labels, so labels update when a recipe changes; staff print and reprint from a tablet. | Same principle: labels read the human-verified allergen fields (v1 §10 publish guard), never free text. |
| CFIA (Canada) | Prepackaged products packed on retail premises from bulk, including in-store-baked bread, are exempt from the *list of ingredients* (UNVERIFIED (FC); safety-relevant, so CFIA or counsel must confirm before any label decision). Allergen rules for such exempt products: I did not read Health Canada's Q16. | [[FACT NEEDED: CFIA/Health Canada + MAPAQ requirements for Coco Vanille's packed items; which items need labels at all]] |

### 3.7 Quick actions and AI helpers

| Product | Pattern | Studio use |
|---|---|---|
| Linear | Cmd/Ctrl + K opens a command menu that runs any action or jumps to any page by typing its name; Cmd + / lists shortcuts. | Desktop (agency, owner at night): « Rechercher ou faire… » with verbs: *épuiser croissant*, *fermer samedi*, *répondre avis*. |
| Notion | "/" opens an insert/command menu filtered as you type. | The same search on mobile, as a big search field at the top of Aujourd'hui (no keyboard shortcut on phones). |
| Shopify Sidekick (3rd-party reports) | The AI drafts, the human approves before saving. | Coco Copilot drafts (review replies, captions, alt text); one-tap approve; never auto-publishes (v0a §6.7). |

### 3.8 Design concepts (Dribbble / Behance) — aesthetics only

These are concepts, not shipped products; use them for visual tone, not as evidence of usability.

| Concept | What to look at | Caveat |
|---|---|---|
| Mark.One Bakery Recipe Management – Order Interface (Usarion, Dribbble) | Bakery order screen, from selection through customisation | Desktop-style web app |
| Point of Sales – Bakery POS System "Bakehouse" (Jëlly for Odama, Dribbble) | Warm bakery palette; activity view; gross → net report | POS, not back office |
| Streamlined Restaurant UI: POS, Kitchen, Self-Order (Atif Nadeem, Dribbble) | Kitchen view with priority levels | Concept |
| Cake admin dashboard (Jahran Chowdhury, Dribbble) | Cake-shop admin | Content not inspected |
| Cake Eats – Cake Shop Website & Admin Panel (Ashikur Rahman, Dribbble) | Custom-cake order admin | Web desktop |
| Panem – Bakery Management Dashboard (Behance, 2022) | Bakery dashboard layout | Adobe XD concept |
| Inventory Management System (Bakery) Admin Dashboard (Behance, 2024) | Bakery stock and reports | Student/portfolio concept |
| Restaurant POS System – Point of Sale UI/UX (Behance) | Tablet order → kitchen flow | Concept |

Observation: every bakery concept found is a **desktop dashboard with charts and sidebars**. None shows a phone-first "today" list with big status buttons. That gap is the opportunity, and also a warning against copying their layouts.

---

## 4. Pattern library (Studio standards)

Each pattern: the problem → the pattern → evidence → Québec French copy.

| ID | Pattern | Rule | Evidence | Copy (fr-CA) |
|---|---|---|---|---|
| P1 | **Aujourd'hui is home** | Opens on today's pickups sorted by time, with status chips, the 3 daily buttons, and a search field. No KPI wall for staff. | NN/g: operational dashboards = act quickly; microsessions | « Aujourd'hui · 14 cueillettes · 3 prêtes » |
| P2 | **Status button, one tap forward** | One big button per order advances the state: Reçue → En préparation → Prête → Récupérée. The next action is the only primary button. | Toast/Square KDS tap-to-complete; Hotplate completion text | « Marquer prête » |
| P3 | **Sold-out with a duration** | Default « pour aujourd'hui » (auto-resets at closing time); options « 1 jour… », « jusqu'à nouvel ordre ». | Square "Make Available at End of Day"; Uber Eats "for today / indefinitely"; DoorDash; Owner.com "X days" | « Épuisé · revient demain à l'ouverture » |
| P4 | **Instant-apply + undo, no Save** | Single toggles apply immediately; a snackbar offers Annuler for ≥ 5 s; the snackbar stays until dismissed if screen-reader focus is on it. | Owner.com (no Save step); Square KDS 3 s undo; NN/g "support undo"; Compose M3 says action snackbars shouldn't time out (3rd-party mirror) | « Croissant aux amandes : épuisé. [Annuler] » |
| P5 | **Sticky save bar for multi-field edits** | Forms (product, hours) show one page-level bar as soon as anything changes: « Modifications non enregistrées · Ignorer · Enregistrer ». Leaving warns. | Polaris contextual save bar | « Modifications non enregistrées » |
| P6 | **Pause / close with duration + reason** | One « Fermeture exceptionnelle » sheet with reason chips (Tempête, Maladie, Complet, Autre) and duration chips (Reste de la journée, Demain, Jusqu'au…). A summary of the effects is shown before confirming. | Uber Eats pause; Square Pause Orders; DoorDash pause; v0a flow 4 | « Fermer aujourd'hui — on prévient les 6 clients de cueillette » |
| P7 | **Busy mode, not just closed** | « On est débordés » adds lead time (+30 min / +1 h / next day) for a period instead of closing. | Uber Eats busy mode; Square Busy Mode; Toast throttling | « Délai allongé de 1 h jusqu'à 14 h » |
| P8 | **Capacity per slot fills itself** | Slots close when full; the owner sees « 6/8 » per slot and can bump the limit with + / −. | Toast capacity per interval; Tock slot limits; v0c 15-min windows | « Créneau 10 h 15 : 6/8 » |
| P9 | **Production list** | Aggregated quantities per product × size × flavour for today and tomorrow; print button. | Hotplate Prep tab; Toast All Day View | « Demain · 4 Paris-Brest 8 pers. · 2 fraisiers 12 pers. » |
| P10 | **Duplicate yesterday / +1 week** | Vitrine, drops and seasonal menus start from a copy. | Hotplate "duplicate +1 week" | « Reprendre la vitrine d'hier » |
| P11 | **Request → quote → deposit in one card** | A structured request (occasion, portions, flavours, photos, date) arrives as a card: Accepter et chiffrer / Proposer une autre date / Refuser. Price suggested from the grid; deposit %; link sent; a written recap with the inspiration photo goes to the customer (fixes the documented "cake made wrong" risk). | Bakesy intake + auto-filled invoice; Square deposits; 01-business-facts complaint | « Envoyer le lien de dépôt (30 %) » |
| P12 | **Lifecycle texts are automatic** | Confirmation, a day-before reminder, « C'est prêt! », and a post-pickup message; editable templates; transactional content only. | Hotplate 24 h/2 h/15 min + completion; Shopify pickup notifications; CASL s.6(6)(b) (§6) | « Bonjour Julie, ta commande n° 1042 est prête! On t'attend jusqu'à 16 h 30. » |
| P13 | **Bulk where it repeats** | « Tout marquer prêt » for the 8 a.m. batch; multi-select in the list with visible checkboxes. | Gap: Shopify has no native bulk ready (community) | « Marquer 5 commandes prêtes » |
| P14 | **Glanceable numbers** | 5 numbers with week-over-week arrows; bars and lines only; direct labels; no pie, donut or gauge. | NN/g dashboards (pies, donuts and gauges are poor); Stripe daily summary | « Commandes 64 (+15 %) » |
| P15 | **AI drafts, human approves** | Review replies, captions and alt text are drafts with Approuver / Modifier; allergens are never AI-written. | v0a §6.7; Sidekick review-before-save (3rd-party); Google moderation delay | « Brouillon prêt · Approuver » |
| P16 | **Search = command** | One field: « Que veux-tu faire? »; results are actions first, then records. | Linear Cmd+K; Notion "/" | « épuiser croissant » → action |
| P17 | **Visible actions, gestures as shortcuts only** | Swipe on a row = shortcut; the same action is always a visible button. | NN/g: swipe is low-discoverability; provide a non-gesture alternative | — |
| P18 | **Offline outbox** | Every tap is persisted locally, shown instantly and replayed; banner with a count. | NN/g 0.1 s; MDN Background Sync; Toast offline banner | « Hors ligne · 2 changements en attente » |
| P19 | **Shared tablet mode** | iPad locked to Studio with Guided Access; staff switch with a 4-digit PIN; owner uses a passkey. | Apple Guided Access; WCAG 2.2 3.3.8 | « Qui es-tu? [Léa] [Marc] [Proprio] » |
| P20 | **Role-shaped navigation** | Staff see 4 tabs (Aujourd'hui, Vitrine, Menu, Plus); owner adds Demandes, Avis, Chiffres, Présence; agency gets Agence (desktop). | v0a §6.6 roles; anti-pattern A2 | — |
| P21 | **Language badge per order** | FR / EN / ES chip on each order so the counter greets in the right language. | v0b | « EN » chip |
| P22 | **Effects preview before big actions** | Close, retire product, change hours: show a list of what will change (site, Google, SMS to N customers) before confirming; then undo or auto-revert. | NN/g: confirm only high-impact actions; v0a "Studio warns before you act" | « Ça va : afficher un bandeau · modifier Google · texter 6 clients » |

Sketch for P3 (sold-out semantics). It's JavaScript, illustrative only:

```js
// availability.js — sold-out that resets by itself (P3). Times are America/Toronto.
// state: 'available' | 'soldout'; until: ISO string or null (= jusqu'à nouvel ordre)
export function isAvailable(item, now = new Date()) {
  if (item.state !== 'soldout') return true;
  if (!item.until) return false;               // indefinitely
  return now >= new Date(item.until);          // auto-reset when 'until' passes
}

// "pour aujourd'hui" = until next opening, computed from HoursRule/SpecialHours (v0a data model)
export function soldOutForToday(item, nextOpeningISO, user) {
  return { ...item, state: 'soldout', until: nextOpeningISO, changedBy: user.id, changedAt: new Date().toISOString() };
}
```

---

## 5. Anti-patterns (and the Studio rule that prevents each)

| ID | Anti-pattern | Why it fails here | Evidence | Studio rule |
|---|---|---|---|---|
| A1 | **CMS-style long forms for daily jobs** | A product edit form is fine at night on a laptop; it is wrong for "sold out" at 10 a.m. with dough on your hands. The Payload admin is a collection-list + edit-view CMS. | Payload docs: custom views and an experimental modular dashboard exist ("experimental" status UNVERIFIED (FC)), which means the defaults are CMS screens | Daily jobs live in custom views (Aujourd'hui, Vitrine, Demandes). The generic Payload admin is reserved for the owner and agency, for deep edits. |
| A2 | **Module sprawl / nested menus** | v0a Part 6 lists ~20 modules and v1 §12 adds 7. A staff member needs 4. | Square café user: restaurant flows "restrictive and awkward"; Xero: Canadian owners overwhelmed by options | P20 role-shaped tabs; agency modules hidden from bakery roles. |
| A3 | **English-only or bilingual clutter** | Staff work in French; mixed-language admin slows them down and may conflict with Québec rules. | Square Online: one default language per site (community); Charter s.52.1; Bill 96 | Québec French source strings; EN as a per-user preference; no FR/EN side-by-side labels. |
| A4 | **Desktop-only tables** | Wide tables collapse badly on phones; bulk actions disappear. | Shopify community: no clear mobile bulk pattern in the index table | Lists of cards on phone; tables only in Agence (desktop). |
| A5 | **Hidden or lost Save** | Users leave a form thinking it saved. | Polaris contextual save bar rationale | P4 instant-apply for toggles; P5 sticky bar for forms. Never both on one screen. |
| A6 | **No undo, or confirm-everything** | Without undo, mis-taps on « Prête » text the wrong customer. Too many confirmations make users click through without reading. | NN/g confirmation dialogs; NN/g user mistakes | P4 undo by default; confirmations only for P22 high-impact actions. |
| A7 | **Hidden gestures** | Swipe-only actions are never discovered. | NN/g contextual swipe; tablet usability | P17. |
| A8 | **Notification spam** | Users revoke permission and then miss the critical alert. | NN/g push-notification mistakes; smart-home notifications | §6 tiering; ≤ 4 urgent types. |
| A9 | **One more device / one more queue** | Each channel adds a tablet, a login and a queue; orders get re-keyed. | Toast "tablet hell"; The Spoon (2–20 tablets per restaurant) | One queue: web, phone (J11), and later any marketplace; printer optional. |
| A10 | **Two truths for "available"** | Stock-tracked vs 86'd items behave differently, so staff can't predict the site. | Square: inventory-tracked items can't be 86'd | One availability field (P3); stock counts, if ever used, only *set* that field. |
| A11 | **Sold-out that never comes back** | Staff forget to switch items back on, and the site shows "épuisé" for a week. | Square "Make Available at End of Day" and Uber Eats "for today" exist because of this | Default duration = today (P3). |
| A12 | **Future orders not reserved** | Limited items oversell between "added" and "paid". | Toast can't reserve items for future orders | Capacity is reserved at checkout in the capacity pool (v0c CapacityPool). |
| A13 | **Passwords on a shared tablet** | Typed passwords with floury fingers; shared logins kill the audit log. | WCAG 2.2 3.3.8; Square relies on per-person passcodes (community troubleshooting thread) | P19: passkeys for the owner, PIN switch for staff, audit log per person (v0a). |
| A14 | **Charts that need study** | Pie, donut, gauge and treemap charts on a phone at 7 a.m. | NN/g dashboards | P14. |
| A15 | **Placeholder-as-label, wrong keyboard** | Labels vanish on typing; a text keyboard for prices. | NN/g mobile input checklist | Labels above fields; `inputmode="decimal"` for prices, `tel` for phones; no autocorrect on names. |
| A16 | **Irreversible money actions without context** | Refunds that can't be undone, triggered from a chat. | Owner.com: refunds immediate and not reversible from the app | Refund = P22 preview + reason; owner role only. |
| A17 | **Auto-penalties for a dead device** | A platform pauses the store if the tablet is offline. | DoorDash auto-pause after 5 min | Studio never auto-closes the shop. It alerts the owner's phone instead (§7). |
| A18 | **Presence metrics on the staff home** | A "health score 82/100" means nothing at the counter and pushes the real job down. | v0a §6.2 home mock-up | The health score moves to the Présence tab (owner/agency). |

---

## 6. Notification design

Principles (NN/g): send only alerts tied to the core purpose; make urgency obvious; let users tune thresholds; expire alerts once resolved; group bursts (we combine more than 5 into one: the figure 5 has no source in the CSV evidence, so treat it as our default, UNVERIFIED (FC)); ask for permission only after the user sees the value. iOS: web push works only for Home Screen web apps (iOS/iPadOS 16.4+), and the permission prompt must follow a user action (WebKit). Confirmed by research/18 claim 8 (own searches; Safari 16.4 released 2023-03-27).

| Event | To | Channel | Urgency | Expires when | Copy (fr-CA) |
|---|---|---|---|---|---|
| New custom-cake request | Owner | Push + badge | High (v0c: answer within 24 h) | Accepted / refused | « Nouvelle demande · gâteau 40 pers. · sam. 8 nov. » |
| Online order for **today** | On-duty device | Push + sound on tablet | High | Seen on Aujourd'hui | « Nouvelle commande pour 11 h 30 » |
| Order due in 15 min, not « Prête » | Tablet only | In-app banner | Medium | Marked Prête | « Julie arrive à 11 h 30 — pas encore prête » |
| Deposit paid | Owner | In-app + daily digest | Low | — | « Dépôt reçu · 45 $ · commande n° 1042 » |
| Payment failed / deposit overdue | Owner | Push | High | Resolved | « Dépôt non payé · relancer? » |
| Review 1–3 ★ | Owner | Push | High (v0a: alert + task) | Replied | « Avis 2★ sur Google · brouillon prêt » |
| Review 4–5 ★ | Owner | Daily digest | Low | Replied | — |
| Integration error (GBP token, SMS provider) | Agency (+ owner digest) | Email / Agence | Medium | Fixed | « Google : reconnexion requise » |
| Daily summary | Owner | Push at a chosen time (or email) | Digest | — | « Hier : 23 commandes · 612 $ · 1 avis » |
| Monday report | Owner | Email / WhatsApp (v0a) | Digest | — | 5 numbers · 3 wins · 3 actions |

Customer-facing messages (SMS/email):

- They are transactional: confirmation, reminder, « C'est prêt! », reschedule after a closure. CASL s.6(6)(b) exempts messages that *solely* facilitate, complete or confirm a transaction the customer agreed to *from the consent requirement* (UNVERIFIED (FC): statute text not re-read). Sources disagree on whether identification and unsubscribe rules still apply (ESPC 2017 brief on CRTC staff reading). Rule: no promotion inside these messages. Until counsel answers, also include the sender's name, contact details and a short opt-out line (conservative default; our design choice). [[FACT NEEDED: lawyer confirmation of identification/unsubscribe wording for transactional SMS]]
- Quiet hours for customer SMS: none during opening hours; reminders outside hours only if the customer opted in. Design choice; owner decides.

---

## 7. Offline and poor-signal handling

What the evidence shows:

- Toast and Square both treat offline as a first-class mode for POS payments (Toast banner after ~40 s; Square requires reconnection within 24 h or offline payments expire).
- Toast documents that its online ordering and delivery integrations stop while devices are offline.
- Background Sync replays queued work when the connection returns (MDN). Browser support is limited, mainly Chromium (3rd-party caveat). Cross-check: research/16b cites caniuse: no Background Sync in Safari or iOS Safari, any version (FC: Confirmed via that sibling track, not re-searched here).

Coco Studio rules:

1. **The public site never depends on the shop's connection.** It runs on the VPS, so a shop Wi-Fi outage doesn't stop online orders, unlike device-hosted systems. Risk: staff don't *see* new orders. Mitigation: a new order for today also goes by SMS/email to the owner's phone over cellular. [[FACT NEEDED: VPS provider and data-centre location; uptime target]]
2. **Outbox for every staff action** (sketch below): persist → show optimistically (< 0.1 s) → send with an idempotency key → retry on `online`, on app focus, and via Background Sync where supported. iPad Safari can't be assumed to support Background Sync, so replay on focus is mandatory.
3. **Side effects run server-side only after sync.** « Prête » offline shows « SMS envoyé dès le retour du réseau ». Never text twice: the idempotency key is checked server-side.
4. **Conflicts:** payment and order state = server wins. Availability toggles = last write wins, with an audit-log entry naming the staff member. A rejected action shows a clear card: « Pas appliqué : la commande a été annulée par le client ».
5. **Read cache:** today's and tomorrow's orders, the production list and the menu stay available offline (cached shell + IndexedDB).
6. **Paper fallback:** the production list and the pickup list can be printed or downloaded each morning (Hotplate packing-ticket precedent).

```js
// outbox.js — queue staff taps when the signal drops (sketch, not production code)
const openDb = () => new Promise((resolve, reject) => {
  const req = indexedDB.open('coco-studio', 1);
  req.onupgradeneeded = () => req.result.createObjectStore('outbox', { keyPath: 'id' });
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

async function store(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('outbox', mode);
    const req = fn(tx.objectStore('outbox'));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
  });
}

export async function act(type, payload, ui) {
  const action = { id: crypto.randomUUID(), type, payload, at: Date.now() };
  await store('readwrite', (s) => s.put(action)); // 1. persist first
  ui.applyOptimistic(action);                     // 2. show the result now
  flush(ui);                                      // 3. try to send
}

export async function flush(ui) {
  const pending = (await store('readonly', (s) => s.getAll())) || [];
  if (navigator.onLine) {
    for (const a of pending.sort((x, y) => x.at - y.at)) {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': a.id },
        body: JSON.stringify(a),
      }).catch(() => null);
      if (!res || res.status >= 500) break;           // keep it for the next try
      await store('readwrite', (s) => s.delete(a.id)); // done (2xx) or refused (4xx)
      if (!res.ok) ui.showRejected(a, await res.json());
    }
  }
  ui.setPendingBanner(await store('readonly', (s) => s.count())); // « Hors ligne · N en attente »
}

// Replay triggers: network back, app back in front (Safari has no reliable Background Sync)
export function wire(ui) {
  window.addEventListener('online', () => flush(ui));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') flush(ui);
  });
}
```

---

## 8. French-first UI

### 8.1 Basis

- Charter of the French language s.52.1 (inserted by Bill 40, 1997): all software must be available in French unless no French version exists (UNVERIFIED (FC)). A June 2025 OQLF document lists 52.1 among provisions in force (per search summary). [[FACT NEEDED: current consolidated wording on LégisQuébec]]
- Bill 96: most workplace obligations in force since 2022-06-01; employer documents such as contracts and offers must be in French (McCarthy Tétrault; UNVERIFIED (FC)). Montréal International (2025): work tools in French, interfaces may be bilingual. [[FACT NEEDED: lawyer's view on whether an in-house admin counts as a "work tool" requiring French]]
- Vendors: the Shopify app follows the device language, with French supported. Payload's admin ships 30+ languages (consistent with research/16b), but whether French is included was not confirmed in my results (UNVERIFIED (FC)). The French *variant* (France vs Québec) of either is unknown.

### 8.2 Rules

1. Source strings are written in Québec French by a human; English is a translation. Not the reverse.
2. Buttons use infinitive verbs, which sidesteps the tu/vous decision in staff UI (« Marquer prête », « Envoyer le lien »). The tu/vous choice for *customer* messages stays open (v0c §7).
3. Québec typography: « 16 h 30 », « 45,00 $ », « sam. 8 nov. », non-breaking space before « ! ? : » per house style. [[FACT NEEDED: house style for spacing before « ! » in SMS, where some phones render it oddly]]
4. One term per concept; a glossary lives in packages/ui:

| Concept | Studio term | Avoid |
|---|---|---|
| Sold out | Épuisé | « Sold out », « 86 » |
| Pickup | Cueillette | « Pick-up » |
| Ready | Prête (commande) | « Ready » |
| Deposit | Dépôt or Acompte | Mixing both. [[FACT NEEDED: owner's word; check OQLF Grand dictionnaire terminologique]] |
| Quote request | Demande de soumission | « Quote » |
| Display case | Vitrine | « Display » |
| Busy mode | Délai allongé | « Busy mode » |

5. Dates and times are always local (America/Toronto, per v0c), and relative where helpful: « dans 25 min », « demain ».

---

## 9. Information architecture: proposed change to the plans

| Plan | Says | Tension | Proposal |
|---|---|---|---|
| v0a §6.1 | "Studio manages the online presence, not the store"; the POS keeps orders | 2026-10-25: ordering lives inside the site | Studio runs order operations (J3–J7, J11–J12). The POS question stays open. [[FACT NEEDED: current POS / payment terminal]] |
| v0a §6.2 | Home = health score + KPIs + to-dos | Staff need today's pickups first (A18) | Home = Aujourd'hui; health score in Présence |
| v0a §6.3 + v1 §12 | ~27 modules | Staff need 4 (A2) | Staff: Aujourd'hui · Vitrine · Menu · Plus. Owner: + Demandes · Avis · Chiffres · Présence. Agency: Agence (Gates, Scoreboard, Battle map…) on desktop |
| v0c §8 Rule #1 | Online orders on the same screen as walk-in orders | If a POS exists, Studio becomes a second screen | Either the POS prints or receives Studio orders, or Studio becomes the single order screen, with a printer for tickets/labels. Decide after the POS fact. |
| v0c §6 | "Prête" sends the SMS | — | Keep, add undo (P4) and offline rule (§7.3) |

---

## 10. Easier than Square/Shopify for this bakery: 15 moves

Each move: what Studio does vs the evidence on Square/Shopify.

1. **Open on today, not on a dashboard.** Pickups by time with the next action as the only big button. Square/Shopify mobile apps lead with sales and orders data (Shopify widgets; Square Dashboard app).
2. **Sold-out in 2 taps that resets by itself.** Square has "Make Available at End of Day", but I saw it only in a Food & Drink community answer, and inventory-tracked items can't be 86'd at all. Shopify: no equivalent found in my searches (UNVERIFIED).
3. **No Save button for toggles; 5 s Annuler on every tap.** Square KDS has 3 s undo only on the KDS; Owner.com proves instant-apply works.
4. **One « Fermeture exceptionnelle » button that does everything.** Site banner, Google special hours, SMS to today's pickups and auto-revert in one step. With Square, pausing online orders happens in the POS app (v5.93+), and I found no source showing Square pushing special hours to Google.
5. **Custom-cake request → price → deposit link in under a minute, from the phone.** A structured intake like Bakesy; the deposit like Square Invoices, but pre-filled from the request with the inspiration photo attached and a written recap.
6. **« Prête » texts the customer, reliably, one at a time or in bulk.** Shopify needs per-order marking with no native bulk (community). Square's ready text is plan-gated and had 2021 reports of not sending (community).
7. **Tomorrow's production list, printable.** Like Hotplate's Prep tab and Toast's All Day View, without a KDS subscription (Square KDS is US$20/month per device on the US page; UNVERIFIED (FC), CAD price not checked).
8. **Vitrine du jour in 60 s.** Photo → site block + Google post draft + IG Story draft + "reprendre hier". Neither Square nor Shopify ties a daily photo to the site, Google and social in one flow (no evidence found).
9. **Québec French everywhere, by default.** Square Online sites have one default language (community). The French variant used by Square and Shopify admin is unverified.
10. **One queue for web and phone orders.** « Commande au téléphone » quick-add means no second screen (tablet-hell evidence).
11. **Works through a dead zone.** Outbox + banner + server-side SMS after sync. The public site keeps taking orders because it doesn't live in the shop.
12. **Four urgent alerts, everything else in a digest.** NN/g tiering; Stripe-style daily summary.
13. **Numbers you can read in 5 seconds.** 5 numbers, bars and lines, 3 suggested actions; no pies (NN/g).
14. **Review replies drafted in the reviewer's language; one tap to approve.** Studio tells the owner that Google may take up to 30 days to publish a reply (UNVERIFIED (FC)).
15. **No passwords at the counter.** Guided-Access-locked iPad, PIN switch per person, passkey for the owner; every change carries a name in the audit log (WCAG 2.2 3.3.8).

---

## 11. Usability acceptance tests (run before launch, in the shop)

| Test | Who | Pass |
|---|---|---|
| T1 Five staff jobs (J1, J2, J5, J6, J11) after a 10-min walkthrough | 2 staff, own devices or the shop tablet | Unaided; each within its §2 budget |
| T2 Five owner jobs (J3, J4, J7, J9, J10) | Owner, own phone | Each within budget; ≤ 1 error, recovered with undo |
| T3 Floury hands | Staff with flour-dusted fingers; also a knuckle | 10/10 targets hit on first tap. Hypothesis only: no study on flour and capacitive screens was found |
| T4 Airplane mode mid-shift | Staff | 5 actions queued, banner correct, all applied after reconnect, no double SMS |
| T5 Snowstorm drill | Owner | Banner live, Google special hours set, 100 % of affected customers texted, auto-revert next day |
| T6 Accessibility | Agency | axe: 0 violations of 2.5.8; all targets ≥ 48 px; screen reader can reach Annuler |
| T7 Language | Native Québec speaker | No France-French or anglicisms in the 50 most-seen strings |

---

## 12. Decisions for the owner and facts needed

Decisions:

1. Agree that the admin home is Aujourd'hui (shop operations), with the presence/SEO areas moved to a second tab.
2. Studio as the single order screen, or alongside an existing POS (depends on the POS fact)?
3. A shared shop tablet (iPad + Guided Access) or phones only?
4. Deposit: % or fixed, and the word (dépôt / acompte); refund policy for cancelled cakes.
5. Which events push to the owner's phone (§6), and quiet hours.
6. tu or vous in customer SMS.
7. A label printer now or later; which items get box labels.

[[FACT NEEDED]]:

- Current POS / payment terminal, if any, and whether walk-in sales must stay there.
- Number of staff; devices in the shop; Wi-Fi and cellular coverage in the kitchen and back room.
- VPS provider and data-centre location (Loi 25), uptime and backup targets.
- Weekly custom-cake volume and lead time (sizes the Demandes flow).
- Current hours and holiday hours (01-business-facts §3 conflict).
- Labelling obligations (CFIA/Health Canada Q16, MAPAQ) for items packed in the shop.
- Lawyer: Charter s.52.1 / Bill 96 work-tool reading; CASL wording for transactional SMS.
- Test print from iPad Safari to the chosen label printer.

---

## Sources

Standards and research

- Understanding SC 2.5.8 Target Size (Minimum) (W3C) — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — seen 2026-10-25
- Web Content Accessibility Guidelines (WCAG) 2.2 (W3C) — https://www.w3.org/TR/WCAG22/ — seen 2026-10-25
- Understanding SC 3.3.7 Redundant Entry (W3C) — https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html — seen 2026-10-25
- UI Design Dos and Don'ts (Apple Developer) — https://developer.apple.com/design/tips/ — seen 2026-10-25
- HIG recommended size for buttons (Apple Developer Forums) — https://developer.apple.com/forums/thread/739201 — seen 2026-10-25
- Touch target size (Android Accessibility Help, Google) — https://support.google.com/accessibility/android/answer/7101858 — seen 2026-10-25
- Touch Targets on Touchscreens (NN/g) — https://www.nngroup.com/articles/touch-target-size/ — seen 2026-10-25
- Dashboards: Making Charts and Graphs Easier to Understand (NN/g, 2017) — https://www.nngroup.com/articles/dashboards-preattentive/ — seen 2026-10-25
- Confirmation Dialogs Can Prevent User Errors (NN/g) — https://www.nngroup.com/articles/confirmation-dialog/ — seen 2026-10-25
- Preventing User Errors: Avoiding Conscious Mistakes (NN/g) — https://www.nngroup.com/articles/user-mistakes/ — seen 2026-10-25
- 10 Usability Heuristics for User Interface Design (NN/g) — https://www.nngroup.com/articles/ten-usability-heuristics/ — seen 2026-10-25
- A Checklist for Designing Mobile Input Fields (NN/g) — https://www.nngroup.com/articles/mobile-input-checklist/ — seen 2026-10-25
- Using Swipe to Trigger Contextual Actions (NN/g) — https://www.nngroup.com/articles/contextual-swipe/ — seen 2026-10-25
- Tablet Usability: Findings from User Research (NN/g) — https://www.nngroup.com/articles/tablet-usability/ — seen 2026-10-25
- Mobile Microsessions (NN/g, 2019) — https://www.nngroup.com/articles/mobile-microsessions/ — seen 2026-10-25
- Five Mistakes in Designing Mobile Push Notifications (NN/g) — https://www.nngroup.com/articles/push-notification/ — seen 2026-10-25
- Designing Useful Smart Home Notifications (NN/g) — https://www.nngroup.com/articles/smart-home-notifications/ — seen 2026-10-25
- Response Time Limits (NN/g) — https://www.nngroup.com/articles/response-times-3-important-limits/ — seen 2026-10-25
- Web Push for Web Apps on iOS and iPadOS (WebKit) — https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ — seen 2026-10-25
- Offline and background operation (MDN) — https://developer.mozilla.org/en-US/docs/Web/Progressive_Web_Apps/Guides/Offline_and_background_operation — seen 2026-10-25
- Snackbar (Jetpack Compose Material 3 reference) — https://developer.android.com/reference/kotlin/androidx/compose/material3/Snackbar.composable — seen 2026-10-25
- Use Guided Access on iPhone or iPad (Apple Support) — https://support.apple.com/en-us/ht202612 — seen 2026-10-25
- Behavioural research by Xero uncovers barriers to small business technology adoption (Xero, 2021) — https://www.xero.com/ca/media-releases/ca-one-step/ — seen 2026-10-25
- SMEs' Digital transformation journey 2025 (CFIB) — https://www.cfib-fcei.ca/hubfs/research/reports/2025/SMEs%20Digital%20transformation%20journey%202025-EN.pdf — seen 2026-10-25

Square

- Mark items sold out / 86 (Square Help 6425) — https://squareup.com/help/article/6425 — seen 2026-10-25
- Mark an Item as Sold Out with Square, and 86 items (Square Seller Community) — https://sellercommunity.com/t5/Product-Updates/Mark-an-Item-as-Sold-Out-with-Square-and-86-items-with-Square/ba-p/297991 — seen 2026-10-25
- Mark an Item as Sold Out… (Square Seller Community, long-press) — https://sellercommunity.com/t5/Product-Updates/Mark-an-Item-as-Sold-Out-with-Square-and-86-Items-with-Square/ba-p/297979 — seen 2026-10-25
- How do you make an item available when it is restocked? (Square Seller Community) — https://www.sellercommunity.com/t5/Food-Drink-Group/How-do-you-make-an-item-available-when-it-is-restocked/m-p/643281 — seen 2026-10-25
- Complete orders with Square KDS (Square Help 8171) — https://squareup.com/help/us/en/article/8171 — seen 2026-10-25
- Square KDS settings, timers & alerts (Square Help 7944) — https://squareup.com/help/ca/en/article/7944 — seen 2026-10-25
- Square KDS (product page) — https://Square.com/us/en/point-of-sale/restaurants/kitchen-display-system — seen 2026-10-25
- Managing Online Orders with Square FAQs (Square Help GB 6703) — https://squareup.com/help/gb/article/6703 — seen 2026-10-25
- Request Deposits with Square Invoices (Square Help GB 6581) — https://squareup.com/help/gb/article/6581 — seen 2026-10-25
- Customer text notifications for pickup (Square Help 6889) — https://squareup.com/help/article/6889 — seen 2026-10-25
- Why doesn't Square text the customer when you mark the order ready? (Square Community) — https://community.squareup.com/t5/Payments-Troubleshooting/Why-doesn-t-Square-text-the-customer-when-you-mark-the-order/m-p/282204 — seen 2026-10-25
- Does Square webstores support multiple languages? (Square Community) — https://community.squareup.com/t5/Online-Store/Does-square-webstores-support-multiple-languages/m-p/208939/highlight/true — seen 2026-10-25
- How can I temporarily disable online ordering for my Square Online site? (Square Community) — https://community.squareup.com/t5/Online-Store/How-can-I-temporarily-disable-online-ordering-for-my-Square/td-p/762744 — seen 2026-10-25
- Process Offline Payments FAQ (Square Help) — https://square.com/help/us/en/article/7775-process-offline-payments-faq — seen 2026-10-25
- Square for Restaurant reviews (Square Community) — https://community.squareup.com/t5/Orders-Menu-Items-Catalog/Square-for-Restaurant-reviews/m-p/717913 — seen 2026-10-25
- Square for Restaurants reviews (Software Advice UK) — https://www.softwareadvice.co.uk/software/184987/square-for-restaurants — seen 2026-10-25
- Square's new Dashboard app can help you track your sales (Computerworld, 2015) — https://www.computerworld.com/article/1626993/squares-new-dashboard-app-can-help-you-track-your-sales.html — seen 2026-10-25
- Clocking In Passcode Won't Work (Square Community) — https://community.squareup.com/t5/Staff-Payroll/Clocking-In-Passcode-Won-t-Work/m-p/752850 — seen 2026-10-25

Toast

- 86 an Item on the POS or Toast Web (Toast Support) — https://support.toasttab.com/en/article/86-an-Item — seen 2026-10-25
- Get Started With the Toast Now App (Toast Support) — https://support.toasttab.com/en/article/Get-Started-with-the-Toast-Now-App — seen 2026-10-25
- Kitchen display system overview (Toast Platform Guide) — https://doc.toasttab.com/doc/platformguide/platformKDSOverview.html — seen 2026-10-25
- Get Started With KDS All Day View Display (Toast Support) — https://support.toasttab.com/en/article/KDS-All-Day-1493055871075 — seen 2026-10-25
- Quote time strategies (Toast Platform Guide) — https://doc.toasttab.com/doc/platformguide/adminQuoteTimeStrategies.html — seen 2026-10-25
- Offline mode overview (Toast Platform Guide) — https://doc.toasttab.com/doc/platformguide/adminOfflineModeOverview.html — seen 2026-10-25
- Prepare to Operate in Offline Mode During Service Disruptions or Outages (Toast Support) — https://support.toasttab.com/en/article/Prepare-to-Operate-in-Offline-Mode-During-Service-Disruptions-or-Outages — seen 2026-10-25
- Set Up and Print Item Labels (Toast Support) — https://support.toasttab.com/en/article/How-to-Set-Up-Print-Item-Labels — seen 2026-10-25
- Tablet hell in restaurants (Toast blog, CA) — https://pos.toasttab.com/ca/blog/on-the-line/tablet-hell-in-restaurants — seen 2026-10-25
- Online order maximum (Toast Community) — https://community.toasttab.com/t5/restaurant-operations/online-order-maximum/m-p/1073 — seen 2026-10-25

Shopify, Stripe, Clover, Lightspeed

- Shopify mobile app (Shopify blog) — https://www.shopify.com/blog/shopify-mobile-app — seen 2026-10-25
- Mobile order management and fulfillment (Shopify blog) — https://www.shopify.com/blog/mobile-order-management-fulfillment — seen 2026-10-25
- Using the Shopify app for iPhone and Android (Shopify Help) — https://help.shopify.com/en/manual/shopify-admin/shopify-app/using-the-shopify-app — seen 2026-10-25
- Choosing your account language and region (Shopify Help) — https://help.shopify.com/en/manual/your-account/languages — seen 2026-10-25
- Pickup in store for online orders (Shopify Help) — https://help.shopify.com/en/manual/sell-in-person/shopify-pos/order-management/local-pickup-for-online-orders — seen 2026-10-25
- How can I bulk notify customers about ready for pickup orders? (Shopify Community) — https://community.shopify.com/t/how-can-i-bulk-notify-customers-about-ready-for-pickup-orders/80671 — seen 2026-10-25
- Contextual save bar (Shopify Polaris, deprecated) — https://polaris.shopify.com/components/deprecated/contextual-save-bar — seen 2026-10-25
- Resource index (shopify.dev) — https://shopify.dev/docs/api/app-home/patterns/templates/resource-index — seen 2026-10-25
- Share: What I'm building with the new Polaris Web Components (Shopify dev community) — https://community.shopify.dev/t/share-what-im-building-with-the-new-polaris-web-components/23831 — seen 2026-10-25
- What is Shopify Sidekick? (MESA blog) — https://www.getmesa.com/blog/shopify-sidekick — seen 2026-10-25
- What can Shopify Sidekick actually do? (Strix) — https://www.strix.net/en/insights/blog/what-can-shopify-sidekick-actually-do — seen 2026-10-25
- Stripe Dashboard mobile app (Stripe Docs) — https://docs.stripe.com/dashboard/mobile — seen 2026-10-25
- Clover Go – Dashboard & POS (App Store) — https://apps.apple.com/us/app/clover-go-dashboard-pos/id969311778 — seen 2026-10-25
- Run your business from virtually anywhere with the Clover Go app (Clover blog CA) — https://blog.clover.com/ca/run-your-business-from-virtually-anywhere-with-the-clover-go-app — seen 2026-10-25
- Making hidden items available for ordering (LoyLap) — https://support.loylap.com/making-hidden-items-available-for-ordering — seen 2026-10-25
- About Restaurant Manager (Lightspeed Support) — https://resto-support.lightspeedhq.com/hc/en-us/articles/115005105873-About-Restaurant-Manager — seen 2026-10-25
- Lightspeed Pulse restaurant insights app (Lightspeed) — https://lightspeedhq.com/pos/restaurant/lightspeed-pulse — seen 2026-10-25

Ordering platforms

- How to mark an item as available or unavailable (Owner.com Help) — https://help.owner.com/en/articles/11833514-how-to-mark-an-item-as-available-or-unavailable — seen 2026-10-25
- How to 86 items or mark them available (Owner.com Help) — https://help.owner.com/en/articles/8851464-how-to-86-items-or-mark-them-available — seen 2026-10-25
- How do I refund a guest from Inbox in the Owner app? (Owner.com Help) — https://help.owner.com/en/articles/15400493-how-do-i-refund-a-guest-from-inbox-in-the-owner-app — seen 2026-10-25
- Owner mobile app (Owner.com) — https://www.owner.com/mobile — seen 2026-10-25
- Owner.com releases — https://www.owner.com/releases — seen 2026-10-25
- Online ordering and the Slice app (Slice Knowledge Hub) — https://slice.com/knowledge-hub/online-ordering-slice-app/ — seen 2026-10-25
- Slice POS / Register — https://www.slice.com/pos — seen 2026-10-25
- How to manage your orders with Uber Eats Orders (Uber Eats Merchants, GB) — https://merchants.ubereats.com/gb/en/resources/learning-center/uber-eats-orders-app/ — seen 2026-10-25
- Delivery person wait time (Uber blog) — https://www.uber.com/blog/delivery-person-wait-time — seen 2026-10-25
- How to Accept and Fulfill Orders on DoorDash (DoorDash Merchant Help, CA) — https://help.doordash.com/en-ca/merchants/article/fulfill-orders — seen 2026-10-25
- How to Fix a Temporary Deactivation on DoorDash (DoorDash Merchant Help, CA) — https://help.doordash.com/en-ca/merchants/article/temporary-deactivation — seen 2026-10-25
- Costa Vida's journey to tablet hell and back (The Spoon) — https://thespoon.tech/costa-vidas-journey-to-tablet-hell-and-back — seen 2026-10-25

Bakery and pre-order tools

- How Hotplate works (Hotplate Help) — https://help.hotplate.com/articles/384984-how-hotplate-works — seen 2026-10-25
- Your first event (Hotplate Help) — https://help.hotplate.com/articles/731168-your-first-event — seen 2026-10-25
- Prep and pack (Hotplate Help) — https://help.hotplate.com/articles/245855-prep-and-pack — seen 2026-10-25
- Guide to automated text reminders (Hotplate Help) — https://help.hotplate.com/en/articles/13719038-guide-to-automated-text-reminders — seen 2026-10-25
- Keys to success with customer pickups (Hotplate blog) — https://blog.hotplate.com//posts/keys-to-success-with-customer-pickups — seen 2026-10-25
- Bakesy: Home Bakery Biz App (App Store) — https://apps.apple.com/app/id1515139393 — seen 2026-10-25
- Bakesy (AlternativeTo) — https://alternativeto.net/software/bakesy/about — seen 2026-10-25
- CakeBoss (Capterra) — https://www.capterra.com/p/127935/CakeBoss/ — seen 2026-10-25
- Restaurant delivery and takeout software (Tock) — https://exploretock.com/join/restaurant-delivery-takeout-software/ — seen 2026-10-25

Labels

- Case study: national bakery franchise (Brother Australia) — https://corpsolutions.brother.com.au/case-study-national-bakery-franchise — seen 2026-10-25
- Cybake bakery management software integrated with Dill labelling platform (British Baker) — https://bakeryinfo.co.uk/equipment/cybake-bakery-management-software-integrated-with-dill-labelling-platform/717436.article — seen 2026-10-25
- Brother QL810W Label Printer (OfficeMax NZ listing) — https://www.officemax.co.nz/Office-Products/Labels-Label-Makers/Brother-Label-Makers/Brother-QL810W-Label-Printer-2492091 — seen 2026-10-25
- Brother QL820NWBC Label Printer (RS Online) — https://uk.rs-online.com/web/p/label-printers/0334118 — seen 2026-10-25
- List of ingredients and allergens on food labels (CFIA) — https://inspection.canada.ca/en/food-labels/labelling/industry/list-ingredients-and-allergens — seen 2026-10-25
- Questions and Answers About the New Regulations to Enhance the Labelling of Food Allergens (Health Canada) — https://www.canada.ca/en/health-canada/services/food-nutrition/food-labelling/allergen-labelling/questions-answers-about-new-regulations-enhance-labelling-food-allergens-gluten-added-sulphites.html — seen 2026-10-25

Quick actions, CMS

- Navigating Linear (Linear enablement guide) — https://linear.app/enablement/guide/navigating-linear — seen 2026-10-25
- Using slash commands (Notion Help) — https://www.notion.com/help/guides/using-slash-commands — seen 2026-10-25
- Customizing Views (Payload Docs) — https://payloadcms.com/docs/custom-components/custom-views — seen 2026-10-25
- Dashboard Widgets (Payload Docs) — https://payloadcms.com/docs/custom-components/dashboard — seen 2026-10-25
- I18n (Payload Docs) — https://payloadcms.com/docs/configuration/i18n — seen 2026-10-25

Google Business Profile

- Manage customer reviews (Google Business Profile Help) — https://support.google.com/business/answer/3474050 — seen 2026-10-25
- Method accounts.locations.reviews.updateReply (Google Business Profile API v4) — https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/updateReply — seen 2026-10-25
- Google Business Profile opening hours (BrightLocal) — https://www.brightlocal.com/learn/google-business-profile/optimization/google-business-profile-opening-hours/ — seen 2026-10-25

Québec / Canada law (verify with counsel)

- Bill 40 (1997), inserting s.52.1 into the Charter of the French language (Publications du Québec) — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/Fichiers_client/lois_et_reglements/LoisAnnuelles/en/1997/1997C24A.PDF — seen 2026-10-25
- OQLF document listing provisions in force (OQLF access-to-information release) — https://www.oqlf.gouv.qc.ca/office/RDIPRP/demandes/AI2526-364/document_7.pdf — seen 2026-10-25
- Employer obligations under Bill 96 (McCarthy Tétrault) — https://www.mccarthy.ca/en/insights/blogs/canadian-employer-advisor/employer-obligations-under-bill-96-an-act-respecting-french-the-official-and-common-language-of-quebec — seen 2026-10-25
- Doing business in French in Québec (Montréal International) — https://www.montrealinternational.com/en/?p=40110 — seen 2026-10-25
- ESPC CASL Review Brief (2017) — https://www.espcoalition.org/sites/default/files/news-items/ESPC%20CASL%20Review%20Brief%205Oct2017%20-%20THREE%20PAGE.pdf — seen 2026-10-25
- Commercial Electronic Messages (Queen's University, CASL) — https://www.queensu.ca/secretariat/legal-counsel/casl/commercial-electronic-messages-cems — seen 2026-10-25

Design concepts

- Mark.One Bakery Recipe Management – Order Interface (Dribbble) — https://dribbble.com/shots/24678016-Mark-One-Bakery-Recipe-Management-Order-Interface — seen 2026-10-25
- Point of Sales – Bakery POS System (Dribbble, Odama) — https://dribbble.com/shots/24439918-Point-of-Sales-Bakery-POS-System — seen 2026-10-25
- Streamlined Restaurant UI: POS, Kitchen, Self-Order, App (Dribbble) — https://dribbble.com/shots/25916792-Streamlined-Restaurant-UI-POS-Kitchen-Self-Order-App — seen 2026-10-25
- Cake admin dashboard (Dribbble) — https://dribbble.com/shots/25339078-Cake-admin-dashboard — seen 2026-10-25
- Cake Eats – Cake Shop Website & Admin Panel UI Design (Dribbble) — https://dribbble.com/shots/18025613-Cake-Eats-Cake-Shop-Website-Admin-Panel-UI-Design — seen 2026-10-25
- Bakery Management Dashboard search (Dribbble) — https://dribbble.com/search/bakery-management-dashboard — seen 2026-10-25
- Panem – Bakery Management Dashboard Design (Behance) — https://www.behance.net/gallery/139814087/Panem-Bakery-Management-Dashboard-Design — seen 2026-10-25
- Inventory Management System (Bakery) Admin Dashboard (Behance) — https://www.behance.net/gallery/196773437/Inventory-Management-System-(Bakery)-Admin-Dashboard — seen 2026-10-25
- Restaurant POS System – Point of Sale UI/UX Design (Behance) — https://www.behance.net/gallery/210280099/Restaurant-POS-System-Point-of-Sale-UIUX-Design — seen 2026-10-25

Internal inputs (not edited)

- research/plan-v1-ranking-stack.md · research/plan-v0a-master-plan.md · research/plan-v0b-multilingual-local-domination.md · research/plan-v0c-site-ux-ordering.md · research/requirements-2026-10-25.md · research/01-business-facts.md — read 2026-10-25
