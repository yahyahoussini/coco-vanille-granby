# 08 · Public-site UX/UI inspiration: premium pâtisserie with ordering (2026-10-25)

Scope: the public site cocovanillegranby.com only. The admin (Coco Studio) is covered in research/16a. Data file: `data/inspiration.csv` (57 rows).

Method and limits (read first):

- **20 WebSearch queries** (the cap for this track). Results are US-located summaries. WebFetch and curl are blocked, so **no page was opened or inspected visually**. "Steal" notes describe what the search summaries say a page contains, not how it looks.
- Brand sites change often. Every fact carries "seen 2026-10-25" unless a source date is given.
- `verified` in the CSV: **yes** = a search result (this pass, or a sibling track's, named in notes) confirmed the page and the pattern. **partial** = the business exists, but the pattern, the current state or the URL was not confirmed. **no** = not confirmed or not searched. `seo_safe`: **yes / no / unknown** for the approach as observed. Unknown means the page was not inspected.
- Not searched (cap): Behance, Dribbble, Pinterest and Mobbin for public-site flows, CSS Design Awards, Godly, Ladurée, NN/g ordering articles, Baymard express-wallet data. See §10, Search queue.
- **Adversarial verification pass (2026-10-25, 5 more searches):** corrected the Rhubarbe benchmark (2025 pivot to online orders, not a dead site), Lady M's off-domain label (it orders on ladym.com) and the Baymard per-reason figures (now ranges). Downgraded Lady M's /llms.txt to UNVERIFIED. Confirmed the Chrome 116 video-LCP change, the scroll-driven support split and Lady M's sizes and prices. See the Verification log.

---

## 0. Ten findings that change decisions

1. **No reference surfaced that combines all three things Coco Vanille needs**: indexable HTML prices and lead times, slot-accurate pickup booking, and a visual cake builder. The premium houses do the first two (Pierre Hermé, Lady M). The cake-builder results were form-builder vendors only (Makeform, B12), not a real bakery's configurator. That the builder is a differentiator is likely but UNVERIFIED: this pass found no live example.
2. **Famous bakeries often order off-domain.** Levain surfaced on DoorDash's `order.online` storefront. Boulangerie Guillaume surfaced only on Uber Eats. Lady M is the counter-example: one `order.online` storefront surfaced, but its pickup ordering runs **on ladym.com** through per-location pages (`/same-day-pickup/boston-ma`, `/scheduled-pickup/…`) with prices (verification, 2026-10-25). Rule: Coco Vanille's ordering stays on cocovanillegranby.com, where it earns links, reviews and structured data.
3. **The best cut-off copy is a date and a clock time, not a duration.**
   - Lady M: "Place your order by 12pm for next day pick up", and on other items "at least 2 days in advance before 12pm… up to 30 days ahead" (first-pass summary; the verification search did not reproduce these lines, so re-check before quoting).
   - Pierre Hermé: "order placed before 12h delivered on the day after".
   - Baymard: show a delivery date rather than a shipping speed; per the article's title, 41% of sites don't.
4. **Abandonment reasons (Baymard, US):**

   | Reason | First pass: newer list ("2026", UNVERIFIED) | First pass: older edition | Verification: secondary readings |
   |---|---|---|---|
   | Extra costs | 40% | 48% | 47% (OptinMonster, 2023 survey) · 48% (Magazine Manager) · 39% (Red Stag, "2024 report") |
   | Delivery too slow | 20% | 22% | 24% (OptinMonster) · 21% (Red Stag) |
   | Didn't trust the site with card details | 19% | 18% | 19% (OptinMonster) · 25% (Magazine Manager) |
   | Site wanted me to create an account | 18% | 24% | 25% (OptinMonster) · 26% (Magazine Manager) |

   Average documented abandonment: 70.19% (consistent across sources). The per-reason figures differ by edition and source, and none could be tied to a dated Baymard edition. **Quote ranges, not single numbers**: extra costs 39–48%, account 18–26%, slow delivery 20–24%, trust 18–25%. Open the Baymard page before citing one figure. Implications for a pickup bakery: the total with taxes on the first screen, the pickup date up front, guest checkout, and visible trust signals.
5. **The Instagram and Facebook in-app browsers break Apple Pay and Google Pay**, per Shopify and Square community threads and payment vendors. No Meta or Apple statement was found. The checkout must work fully without a wallet, and must offer « Ouvrir dans Safari » without losing the box.
6. **A hero video is LCP-safe only with a poster.** web.dev: when a video is the LCP element, LCP is when the poster renders. The Chromium changelog (Chrome 116, rolled out from about 2023-08-22) confirms that a video with no poster can now be an LCP candidate, timed at its first presented frame (previously such videos were ignored). At launch that change applied to field data (UKM, so CrUX), not to `PerformanceObserver` in JavaScript. plan-v0c's "poster = LCP image" is correct. Keep it.
7. **CSS scroll-driven animations and cross-document View Transitions are not universal in Oct 2026** (secondary sources). Chrome and Edge since Jul 2023, Safari since Sep 2025 (Safari 26). Firefox stable still has them behind a flag, and they are on the Interop 2026 list (drweb.de, 2026). The "v152 (Jun 2026)" version label was not re-confirmed. Use them for enhancement only; never gate content on them.
8. **Weekly reveals create recurring search demand that others capture.** Crumbl previews its lineup every Sunday evening (Tasting Table). Spoiler and spam pages dominate the results. A « Saveur de la semaine » feature needs one stable, indexable URL from day one.
9. **The Québec online bar is low.** For Patrice, Fous Desserts, Guillaume, Mamie Clafoutis, Hof Kelsten and Première Moisson, no own ordering page surfaced. **Correction (verification):** Rhubarbe closed its Laurier boutique in **2025** (after 15+ years) and now runs as a caterer with **online orders and Saturday-morning pickup** at a production atelier near Marché Atwater (Tastet; Lesley Chesterman; The Main listing dated 2025). The close date is stated differently (Instagram notice 19 June vs a 13 July close), and its ordering URL was not seen ([[FACT NEEDED: Rhubarbe ordering URL]]). Rhubarbe is therefore the one live Québec pre-order + fixed-pickup-day benchmark found, not a dead one. Christian Faure left the house that bears his name (Time Out, 2020; not re-checked). plan-v0c's Faure benchmark is not current. Coco Vanille can become the reference instead of copying one.
10. **A premium cake brand may already publish `/llms.txt`.** The first pass saw ladym.com/llms.txt in a search result (contents not read). The verification search did not reproduce it, so it is UNVERIFIED until the file is opened. Either way, llms.txt is a cheap GEO move. Treat it as a hint, not a ranking factor (UNVERIFIED effect).

---

## 1. Gallery, grouped by type

SEO-safe means the approach as observed works for search. "unknown" means the page was not inspected. Full rows: `data/inspiration.csv`.

### 1.1 Parisian and luxury houses (Direction A references)

| Reference | URL | Steal | Avoid | SEO-safe | Verified |
|---|---|---|---|---|---|
| Pierre Hermé | pierreherme.com/en/the-art-of-macaron | Products shot as jewels. Named seasonal boxes with **availability dates printed on the product page** (e.g. 12 macarons €39, from 08/05/2025). Cut-off line « avant 12 h → livré le lendemain ». Free delivery from €75. Click & collect in Paris (the summary's threshold wording is ambiguous). | Seasonal pages that simply end. An 8-box was listed 27/08/2026 to 21/10/2026 and is already over. | yes | yes |
| Cédric Grolet Opéra | timeout.fr (2020 launch article) | One product per screen. Click & collect with a stated wait (48 h) and a stated minimum basket (€15), as of 2020. | Terms are pandemic-era; the current site was not seen. | unknown | partial |
| Dominique Ansel (SoHo) | dominiqueanselny.com/frequently-asked-questions | A **capped pre-order window** for the hero product (older reports: Monday 11 a.m., max 6, pickup 2 weeks out). Large orders (50+) by email with 1 month's notice. | The FAQ admits the "beta" system can time out under traffic. | unknown | partial |
| Lady M | ladym.com/items/signature-mc | **Sizes made obvious** (6 in / 9 in; Signature US$70 / US$115, confirmed 2026-10-25). **On-domain pickup pages per location** (/same-day-pickup/{location}, /scheduled-pickup/{location}). Rules attached to each product: 9 in only for shipping; 2 days ahead before noon vs next-day (first pass; not reproduced). /llms.txt (first pass; not reproduced: UNVERIFIED). | Rules differ page by page, so the buyer must read each one. | yes | yes |
| Ladurée | [[FACT NEEDED]] | plan-v0c claims colour-coded flavours and packaging as a UI motif. | — | unknown | no (not searched) |

### 1.2 Cake e-commerce, gifting and birthdays (Direction B references)

| Reference | URL | Steal | Avoid | SEO-safe | Verified |
|---|---|---|---|---|---|
| Milk Bar | milkbarstore.com/collections/cakes | **Merchandising by moment**: "Moments & Milestones", "The Birthday Sweet Shop", "Always On", seasonal "Fall" shop. City + occasion landing (/birthday-cake-delivery-nyc). Order up to 30 days ahead. 6 in Birthday Cake US$65. | The shipping fee (US$15–60) depends on date and destination, so the total shows late. That is Baymard's #1 abandonment cause. | yes | yes |
| Levain | order.online/store/levain-bakery-new-york-1014847 | Hero = a close-up cookie photo instead of copy (Krishaweb 2026). Tins as giftable SKUs. Scheduled pickup. | Ordering on a third-party domain. **Lookalike domains** (levainbakeryusa.it.com) rank for brand FAQs. | no | partial |
| Magnolia Bakery | [[FACT NEEDED]] | Signature item sold as a gift bundle (seen only on delivery apps). | — | unknown | no |
| Tartine, Flour Bakery | [[FACT NEEDED]] | — | Tartine: a dated forum post says "call ahead" for bread orders. | unknown | no |

### 1.3 Drops, limited releases, weekly rotation

| Reference | URL | Steal | Avoid | SEO-safe | Verified |
|---|---|---|---|---|---|
| Crumbl | tastingtable.com (guide) | Weekly lineup **previewed Sunday evening** on app, site and social. Per-store current **and upcoming** menu. A weekly "secret menu" item. | Spoiler and spam sites own the "this week" queries. | unknown | partial (crumblcookies.com URL not confirmed) |
| Lune Croissanterie | lunecroissanterie.com/faqs | **Per-venue pre-order rules stated plainly** (pre-order at Armadale only). Monthly specials "over the counter or pre-order via website". Limited Easter releases (2020). | The pre-order limit is visible only in the FAQ, not on each product. | yes | yes |
| Hotplate (platform) | help.hotplate.com (via research/16a) | Drops with open and close times. Several pickup windows. A text before a drop opens, plus reminder texts. | Hosted storefront. | no | yes (16a) |

### 1.4 Canada and Québec (Direction C context)

| Reference | URL | What's there | Lesson | Verified |
|---|---|---|---|---|
| Duchess Bake Shop, Edmonton | duchessbakeshop.com (per Edify 2025) | Parisian-style pâtisserie, 2 shops; pre-order and delivery (directories); a cookbook. Press: "transport you to Paris" (RMO). | The closest Canadian analogue to Direction A; a cookbook as an authority asset. | partial |
| Bobbette & Belle | zarla.com/inspiration/bakery | Pale, airy hero: ribbon-tied cookie stacks and a single-tier cake in soft blues and creams. | Soft palette done well. City and URL UNVERIFIED. | partial |
| Pâtisserie Rhubarbe, Montréal | tastet.ca (« se métamorphose en traiteur »; pivot dated 2025) | **Corrected:** in 2025 the Laurier boutique closed after 15+ years; Rhubarbe became a caterer with online orders and Saturday-morning pickup at a production atelier near Marché Atwater. (The first pass dated this pivot 2016; the 2025 date comes from The Main's listing and the 15+ years since 2010.) | A live Québec benchmark for **pre-order + one fixed pickup day**. Ordering URL not seen. | partial |
| Maison Christian Faure / ÔFauria | timeout.com (2020) | The chef left his eponymous house; ÔFauria (2020) is delivery-based. | Drop it from plan-v0c's board, or re-check. | partial |
| Patrice Pâtissier · Fous Desserts | dailyhive.com (undated) | They exist (2360 Notre-Dame O. · 809 Laurier E.). No ordering page surfaced. | — | partial |
| Boulangerie Guillaume | ubereats.com listing | Marketplace only. | Off-domain. | partial |
| Mamie Clafoutis · Hof Kelsten | restomontreal.ca · theinfatuation.com | Listings. Hof Kelsten took orders by email (one review). | Email ordering = no slots, no capacity. | partial |
| Première Moisson | [[FACT NEEDED]] | Nothing surfaced on online ordering. Owned by Metro (via research/03). | — | no |

### 1.5 Granby rivals: the local bar to beat (via research/03)

| Rival | What they publish | Coco Vanille must beat it with |
|---|---|---|
| Cake Design Granby (Shopify, inferred) | $5/portion (min 16); pickup date/time fields | Price per portion **plus** a portion slider, real photos and next available date |
| Avec un Grand A | Per-size prices; 48 h lead time | The date shown, not "48 h" |
| Rose Gâteaux | Wedding specialty; tastings; sample prices | Weddings only if the owner confirms capacity ([[FACT NEEDED]], research/01) |
| Maître Glacier Granby | Add-to-cart ice-cream cakes | Not a fight to pick (different category) |
| IGA traiteur | 8–12-person cake at $26.99 | Value story: per-portion price + « fait ici ce matin » |

### 1.6 Ordering tools and custom-cake intake (customer side)

| Tool | Steal | Avoid | Verified |
|---|---|---|---|
| Makeform (cake form generator) | Step-by-step options, image upload, auto-calculated price | No visual preview; third-party domain | yes (vendor page) |
| B12 bakery template | Order form: date, flavour, size, dietary notes | No capacity logic | yes (vendor page) |
| Bakesy (via 16a) | Intake questions + inspiration photos that pre-fill the quote | US payment methods | partial |
| DoorDash Storefront (order.online) | — | Off-domain ordering (see §4) | yes |

### 1.7 Galleries and roundups (where to dig next)

| Source | Status this pass |
|---|---|
| Awwwards | A "Transition Sonoma Bakery" (NIGHTJAR) listing exists under food & drink; its award level was not shown. 1Bite2Go (café/deli) has an Awwwards HM, per its agency. **No bakery Site of the Day confirmed.** |
| Lapa Ninja, SiteInspire, Land-book | Exist and are curated galleries (Substack directory). Bakery entries not inspected. |
| Godly, CSS Design Awards, Mobbin, Behance, Dribbble, Pinterest | Not surfaced or not searched → §10 |
| Roundups: Krishaweb "15 best bakery website designs 2026", Webflow "7 bakery websites", ColorWhistle "75 bakery website ideas", Azuro "10 best F&B websites 2026" | Exist. Opinion pieces: a good browsing queue, not evidence. |

---

## 2. Evidence: mobile ordering and checkout

### 2.1 Baymard (US; numbers by edition)

| Finding | Number | Source, date | Coco Vanille rule |
|---|---|---|---|
| Average documented cart abandonment | **70.19%** (48+ studies; one page variant shows 70.22%) | baymard.com/lists/cart-abandonment-rate (updated 2025-09-22, per summary) | Expect most boxes to be abandoned; save the box server-side and allow a reminder only with consent (CASL) |
| Extra costs too high (shipping, tax, fees) | **39–48%** by edition (first pass: 40% newer list, 48% older, 39% checkout guide; secondary: 47%, 48%, 39%). Single figure UNVERIFIED | Baymard list / ux-statistics / checkout-flow guide; OptinMonster, Magazine Manager, Red Stag | Show the **total with TPS/TVQ and any deposit** on the product and the box, not at the last step. Pickup = $0 fees, and say so |
| Delivery too slow | **20–24%** (first pass 20% / 22%; secondary 24%, 21%) | same | Show the **earliest pickup date** on every card; never a bare "48 h" |
| Didn't trust the site with card details | **18–25%** (first pass 19% / 18%; secondary 19%, 25%) | same | Trust strip near pay: reviews with their date, address, phone, payment-processor badge, refund/allergen policy |
| Site wanted me to create an account | **18–26%** (first pass 18% / 24%, 19% in the guide; secondary 25%, 26%) | same | Guest by default; offer a passkey or magic-link account **after** payment |
| "Just browsing" (removed from normalized results) | 42% of US shoppers | Baymard list; Statista notes the same removal | Not fixable by checkout design. Save boxes and use « Envoyer pour avis » links |
| Caveat | Baymard warns that "too long checkout" does not mean "make it one page" | Baymard (per search summary; page not opened) | Few, clear steps: Boîte → Date → Coordonnées → Paiement |
| Delivery date vs shipping speed | Per the title, **41%** of sites show speed, not date | baymard.com/research-articles/shipping-speed-vs-delivery-date | « Prête jeudi 30 oct. dès 10 h » |
| Store pickup belongs in the same step as delivery | 54% of 60 top US/EU retailers left it out | Amazon Pay blog summarizing Baymard (~2020, secondary) | Pickup is the default; delivery (if ever offered) sits next to it with its date and price |

### 2.2 Instagram and Facebook in-app browsers

- Reports: Apple Pay and Google Pay **don't appear** when shoppers arrive from an Instagram bio link or Facebook, but work in Safari and Chrome for the same URL. Sources: the Shopify Community, a Square Community thread (Square said it couldn't fix it on its side), a Dodo Payments feature request, and Fundraise Up's support page (wallets need a pop-up type in-app browsers don't support). **No official Meta or Apple statement found.**
- The conversion figures in vendor marketing (e.g. 0.83% vs 2.84%) are illustrative mock-ups, not measurements. **Don't quote them.**
- Design response (§8 code): detect the in-app browser. Then:
  - don't promise a wallet;
  - show the card form inline;
  - offer « Ouvrir dans Safari » with a box-restore link, so nothing is lost.
- Test on real devices with each app version (owner self-test).

### 2.3 Performance and motion

| Topic | Evidence | Rule |
|---|---|---|
| Hero video vs LCP | web.dev video pattern: LCP = poster render time. Chromium changelog 2023-08 (Chrome 116, rollout from ~2023-08-22; confirmed): a video with no poster can be an LCP candidate, timed at the first frame shown; at launch this applied to UKM/CrUX, not `PerformanceObserver`. DebugBear: the poster-to-video swap usually doesn't add a new LCP entry. | Poster = optimized AVIF/WebP still, preloaded. Video `preload="none"`, starts after load, skipped on `prefers-reduced-motion` and Save-Data |
| Scroll-driven animations | Chrome 115+ (Jul 2023); Safari 26 (Sep 2025); Firefox stable behind a flag, on the Interop 2026 list (drweb.de 2026, confirms). "v152 (Jun 2026)" not re-confirmed. Secondary (codercops, buildmvpfast, modern-css, drweb.de) | `@supports (animation-timeline: view())` only; static layout is the default |
| View Transitions | Same-document: Chrome 111, Safari 18, Firefox (version conflicting: 130 vs 144). Cross-document: Chrome 126+, Safari 18+, Firefox unclear. Secondary | `@view-transition { navigation: auto; }` as enhancement; MPA pages work without it |
| GSAP | Free for commercial use, all plugins (research/18, claim 6) | Only if CSS can't do it; load it on the savoir-faire page only |

### 2.4 Restaurant-site basics (secondary only)

- NN/g restaurant-site research did **not** surface. The NN/g articles reused in 16a (touch targets, mobile input checklist) still apply.
- Agency blogs (Moodby, PlumPOS, Chowly) say PDF menus hurt mobile reading and search, and that address and hours must be obvious.
- Their stats ("70% mobile", "68% abandon") are unsourced. **Don't quote them.**

---

## 3. Pattern library (each with its SEO-safe version)

| # | Pattern | Seen at | SEO/AEO/GEO-safe version for Coco Vanille |
|---|---|---|---|
| P1 | Cut-off + date line | Lady M, Pierre Hermé, Baymard | Server-rendered text on every card and product: « Commandez avant 14 h → prête demain » / « Prête dès jeudi 30 oct. ». Computed by the same engine as the checkout (§8). Optional Offer markup: `deliveryLeadTime`, `availableDeliveryMethod: OnSitePickup` (schema.org properties not re-checked this pass: UNVERIFIED) |
| P2 | Sizes made obvious | Lady M | HTML portion table per cake: diameter, portions, price, price per portion. The table is the quotable fact, so AEO engines answer « combien pour 20 personnes » from it |
| P3 | Dated seasonal product | Pierre Hermé | **Permanent URL** (/noel/buches/) with a state machine: Bientôt → Précommandes ouvertes (date) → Complet → « De retour en novembre 2027 ». Never a 404, never a redirect to home |
| P4 | Collections by moment | Milk Bar | Occasion hubs (/gateaux/anniversaire/, /fete-des-meres/) as real category pages: 150–300 words, FAQ, real photos. Filters as `?param` stay noindex |
| P5 | City + occasion landing | Milk Bar (/birthday-cake-delivery-nyc) | /gateau-de-fete-granby/ with local proof (reviews from Granby, pickup map, parking). One page per real service, no doorway clones |
| P6 | Capped pre-order window | Dominique Ansel, Hotplate, Lune; Rhubarbe (online orders, Saturday pickup, 2025) | The window opens at a published time. Capacity is checked server-side. Waitlist SMS with consent. The page explains the rules in plain HTML (an AEO answer to « quand commander ma bûche ») |
| P7 | Large-order route | Dominique Ansel (50+ by email, 1 month) | Not email: a « Demande de soumission » form with photos, answered within 24 h. Builder steps stay noindex; the indexable /gateaux-personnalises/ page holds the prices and FAQ (plan-v0c §6) |
| P8 | Weekly reveal | Crumbl | /saveur-de-la-semaine/ (stable URL, updated Monday) + a dated archive (/saveur-de-la-semaine/2026-w44/) + a GBP post + IG. Coco Vanille owns its own "spoiler" query |
| P9 | Per-venue/per-product rules in an FAQ | Lune | The same rules shown **on the product** (not only in the FAQ). The FAQ page is still useful for AEO, even though FAQ rich results are gone (research/18, claim 1) |
| P10 | Product close-up as hero | Levain (Krishaweb), Pierre Hermé, Grolet | Close-up photo as the LCP element, **with a real text H1 above it** (« Pâtisserie artisanale à Granby »). Never text baked into the image |
| P11 | Poster-first hero video | web.dev | Poster = LCP. The 6 s cut-cake loop loads after `load`. Captions not needed (no speech); `aria-hidden` on the decorative video |
| P12 | Soft, airy palette | Bobbette & Belle | Pastels on surfaces only; text in Gousse #2E211A (plan-v0c palette). Contrast checked automatically |
| P13 | llms.txt | Lady M (first pass; not reproduced: UNVERIFIED) | /llms.txt linking the canonical facts page, prices, hours, lead times and allergen policy. Same facts as the JSON-LD; no new claims |
| P14 | Pickup next to delivery | Baymard via Amazon Pay | One "Comment ?" step: « Cueillette au 3 rue Court » (default) · delivery only if offered, with its date and price |
| P15 | Guest checkout | Baymard | No account wall. After payment: « Garder mes infos pour la prochaine fois ? » (passkey or magic link) |
| P16 | Box saved and shareable | Baymard "just browsing" | /boite/{token} restores the box on any device (also the Safari hand-off for in-app browsers) |
| P17 | Public per-portion price | Cake Design Granby, IGA | « À partir de [X] $ la portion » on /prix/ and on each cake [[FACT NEEDED: owner prices]]. A quotable fact for AI answers (research/05: AI engines found no Québec price) |

---

## 4. Anti-patterns (seen in the gallery) and the rule that prevents each

| Anti-pattern | Seen at | Coco Vanille rule |
|---|---|---|
| Ordering on a marketplace or hosted storefront as the main path | Levain (order.online), Guillaume (Uber Eats). Lady M has one order.online storefront, but its main pickup ordering is on ladym.com | The order button always leads to cocovanillegranby.com/commande/. Marketplaces, if any, are secondary listings |
| Orders by email, DM or appointment only | Hof Kelsten (email), Rose Gâteaux (appointment, via 03), Dominique Ansel (50+ by email) | Every request goes through a structured form with a date; the IG auto-reply points to it |
| Fees revealed late | Milk Bar (US$15–60 by date and destination) | Total incl. taxes on the product and box; pickup costs $0 |
| Seasonal pages that vanish | Pierre Hermé (a box listed until 21/10/2026) | P3 state machine; the URL lives forever |
| "Beta" ordering that times out on drop day | Dominique Ansel FAQ | Load-test the Christmas opening. Fair queue: hold capacity for 10 min while paying. Product pages served from the page cache (ISR/data cache + nginx, research/17), not rendered per request |
| Wallet promised inside Instagram | Shopify and Square community reports | §2.2: in-app browser detection, card inline, Safari hand-off |
| Hero video with no poster, or text inside images | web.dev | P10, P11 |
| Content gated on scroll animation or JS | (principle; Firefox gaps §2.3) | Everything readable with CSS animations off and JS off (except the builder, which is noindex) |
| PDF or image menus and price lists | Agency blogs (secondary) | Prices only in HTML; no PDF menus; the print version is a print stylesheet |
| Instagram-embed walls | (principle: third-party script weight; impact not measured here) | A static grid of own photos, each linking to the post; no embed script |
| Third parties owning brand or recurring queries | Crumbl spoiler spam; Levain lookalike domains | P8; register defensive domains ([[FACT NEEDED: owner budget]]); monitor brand SERP monthly |
| Stale benchmark copied as truth | plan-v0c board (Faure; Rhubarbe's model changed in 2025) | Re-verify any reference before copying it (this file) |

---

## 5. Food-brand design trends 2025–2026: what the evidence supports

| Trend | Evidence this pass | Verdict | Use at Coco Vanille |
|---|---|---|---|
| Grain or paper textures | Listed among 2026 trends (Black Country Chamber, "5 predictions") | Weak support (opinion) | The vanilla-speckle texture (plan-v0c) as a CSS/SVG noise layer, ≤ 2 KB, not a JPEG |
| Handcrafted, imperfect visuals; away from slick polish | Blendnow "13 trends 2026" | Weak support (opinion) | Hand-drawn icons, chef's handwriting notes (Direction C detail) |
| Bold typography | Blendnow | Weak support | Large display serif for one line per screen |
| Editorial serif | No source surfaced | UNVERIFIED as a trend | Use only because it fits the brand (Direction A), not because it is trendy |
| Bento grids | No source surfaced | UNVERIFIED | Fine for the home "vitrine" grid; not needed |
| Macro and close-up photography | Azuro F&B 2026 (quality photography); Levain hero (Krishaweb) | Supported (opinion + examples) | Macro shots and the cross-section ("la coupe") as signature |
| White space, mobile-first, clear CTAs | Azuro F&B 2026 | Supported (opinion) | Sticky bottom bar (plan-v0c §7) |
| CSS scroll-driven animations | §2.3 | Real, but not universal | Enhancement only |
| View Transitions | §2.3 | Real, partly universal | Card → product morph, enhancement only |
| Variable fonts | Not searched | UNVERIFIED (Fraunces' "Soft" axis is a plan-v0c claim) | Check the font file before relying on the axis |

Bottom line: the trend evidence is opinion. Choose the direction on **brand fit and the owner's Instagram** (plan-v0c), not on trend lists.

---

## 6. The three directions in plan-v0c §7 vs the references

| Direction | Supported by (this pass) | Not supported or unverified | Strength for SEO/ordering |
|---|---|---|---|
| **A · Atelier Vanille** (Parisian editorial minimal) | Pierre Hermé (jewel product, dated seasonal boxes), Lady M (clear sizes, on-domain pickup pages, rules per product; llms.txt UNVERIFIED), Grolet (one product per screen, 2020), Dominique Ansel (capped pre-orders), Duchess Bake Shop (Canadian "Paris" pâtisserie), Bobbette & Belle (soft airy palette) | Aesop (plan reference) not checked; editorial-serif "trend" unverified | Best fit with premium pricing and per-portion price pages; the calm layout keeps cut-off and date lines readable |
| **B · Coco Joyeux** (playful) | Milk Bar (moment collections, birthday shop, city + occasion landing), Crumbl (weekly reveal), Lune (limited releases) | Crumbl's own site not seen | Best for birthday pages, the builder and weekly-reveal content (recurring freshness) |
| **C · Maison des Cantons** (warm, local) | Violet (neighbourhood + seasonal identity, Hackney), Hof Kelsten and Duchess (local institutions), trend notes on handcrafted/grain | Poilâne and Lune-as-C (plan references) not checked; no Québec site found doing this well online | Best for GEO entity signals (Granby places, people, history) on /a-propos/ and the « pâtisserie Granby » pillar |

**Recommendation (adjusts plan-v0c, doesn't replace it):** A as the base and B in the builder, birthday pages and microcopy, as plan-v0c says. Add **C as a content layer, not a skin**: Granby storytelling, hand-drawn local illustrations on /a-propos/ and the Granby pages, and seasonal photos of the real vitrine.

Why: A carries the clearest ordering UI (supported by Lady M and Hermé). B carries the recurring content (Milk Bar, Crumbl). C carries the local entity facts that AI engines quote. None of the three is evidenced by a local rival, so whichever is chosen is a differentiator.

Final choice: after the owner's Instagram review (open decision, plan-v0c).

---

## 7. Do better than all of them: 14 moves (beauty + SEO/AEO/GEO + ordering clarity)

1. **« Prête quand ? » on every card.** Show the real earliest pickup date, computed server-side from lead time, cut-off, closed days and capacity (§8). Lady M and Hermé publish rules; none of the references surfaced shows the computed date on the listing card.
2. **The total with taxes before the box.** Price, portions, TPS/TVQ-included total and any deposit appear on the product. This answers Baymard's #1 cause (39–48% across editions) up front.
3. **One indexable page per product, ordering on-domain.** HTML price, portions, allergens, lead time and a real photo, plus Product/Offer JSON-LD. Never a marketplace as the main path.
4. **Seasonal URLs that live forever** (P3), with a public « Les précommandes ouvrent le 1er novembre à 9 h » countdown and a consented SMS waitlist. This beats Hermé's ending pages and Ansel's timeouts.
5. **Fair drops.** Capacity is held for 10 min during payment, the queue is visible (« 12 boîtes restantes pour samedi »), and product pages come from the page cache (research/17). Goal: drop day never times out (load-test it).
6. **The cake builder as a price engine with an indexable twin.**
   - The live illustrated builder (noindex) feeds a public /gateaux-personnalises/ page with the price table, portion guide and dated gallery.
   - It is the first builder in this research set that shows price **and** next available date together (no live bakery builder surfaced, §0.1).
7. **A checkout that survives Instagram.** Detect in-app browsers, show the card form inline, offer « Ouvrir dans Safari » with the box restored, and offer wallets only where they work. Test it on Coco Vanille's own IG bio link.
8. **Guest first, account later.** No wall. After payment, offer one tap to save details (passkey or magic link). This targets the forced-account cause (18–26% across editions).
9. **A trust strip that is data, not adjectives.** « ★ 4,9 · 40+ avis Google (au 2026-08-01) » [[FACT NEEDED: live count]] · address · phone · « Fait ici ce matin ». Placed next to Pay, which targets the trust cause (18–25% across editions).
10. **Poster-first macro hero.**
    - LCP = AVIF still of the cross-section; the 6 s loop arrives after load.
    - « La coupe » reveal in pure CSS (hover or press), no JS.
    - Target: Lighthouse mobile ≥ 95, LCP ≤ 2.5 s (plan-v1).
11. **Motion only as enhancement.** Scroll-built cake and card → product morph only behind `@supports` and `prefers-reduced-motion: no-preference`. Every page is complete without them (Firefox gaps, §2.3).
12. **Own the weekly ritual.** /saveur-de-la-semaine/ with a dated archive, auto-pushed to a GBP post and an IG story template from Studio. This beats Crumbl's spoiler leakage and creates a fresh, crawlable page every week.
13. **A facts layer for AI engines.**
    - /llms.txt (Lady M precedent, UNVERIFIED re-check) plus a « Coco Vanille en bref » page: name and spelling, address, hours, lead times, price per portion, allergen policy, payment, parking.
    - The same facts appear in JSON-LD and on GBP, with no contradictions (research/03: hours conflict on 3+ directories).
14. **Local layer as entity content (Direction C).** Real Granby references (3 rue Court, nearby landmarks [[FACT NEEDED: owner-approved list]]), dated vitrine photos and staff names (with consent). Entity-rich local facts are what AI answers and Maps can quote (principle; effect UNVERIFIED). None of the Québec references in this pass showed this online (pages not inspected).

---

## 8. Code sketches (JavaScript)

```js
// next-pickup.js: the « Prête dès … » label, computed server-side in Granby time (America/Toronto).
// Studio supplies leadDays per product, the cut-off hour, closed weekdays (0 = Sunday) and blackout dates.
// Capacity is checked again at checkout. This only labels the earliest possible day.
export function nextPickupDate({ now = new Date(), leadDays = 1, cutoffHour = 14, closedWeekdays = [], blackout = [] }) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', hourCycle: 'h23',
    }).formatToParts(now).map(({ type, value }) => [type, value]),
  );
  const day = new Date(Date.UTC(+p.year, +p.month - 1, +p.day)); // today's Granby calendar date
  day.setUTCDate(day.getUTCDate() + leadDays + (+p.hour >= cutoffHour ? 1 : 0));
  const iso = (d) => d.toISOString().slice(0, 10);
  while (closedWeekdays.includes(day.getUTCDay()) || blackout.includes(iso(day))) day.setUTCDate(day.getUTCDate() + 1);
  return iso(day); // '2026-10-29' → rendered as « Prête dès jeudi 29 oct. »
}
```

```js
// iab.js: Instagram/Facebook in-app browser hand-off.
// UA tokens are UNVERIFIED this pass; confirm on real devices.
export const inAppBrowser = (ua = navigator.userAgent) =>
  /Instagram/i.test(ua) ? 'instagram' : /FBAN|FBAV|FB_IAB/i.test(ua) ? 'facebook' : null;

export function checkoutHints(boxToken) {
  const iab = inAppBrowser();
  return iab
    ? { wallets: false, showCardInline: true, handoffUrl: `https://cocovanillegranby.com/boite/${boxToken}`,
        message: 'Pour Apple Pay, ouvrez cette page dans Safari (••• → Ouvrir dans le navigateur). Votre boîte vous suit.' }
    : { wallets: true, showCardInline: true, handoffUrl: null, message: null };
}
```

The menu path in that message ("••• → Ouvrir dans le navigateur") is UNVERIFIED and must match the current Instagram UI.

---

## 9. Proposed changes to plan-v0c §7 (inspiration board)

| Row in plan-v0c | Change |
|---|---|
| Maison Christian Faure, Pâtisserie Rhubarbe "Québec benchmarks for tone and bilingual handling" | Replace with: "No Québec pâtisserie surfaced with strong on-site ordering (research/08). Faure left his house (2020). Rhubarbe closed its Laurier boutique in 2025 and now takes online orders with Saturday pickup: keep it as the Québec **pre-order/pickup-day** benchmark once its ordering page is checked. Duchess Bake Shop (Edmonton) is the Canadian analogue; bilingual handling is still unbenchmarked." |
| Lune "pre-order drops and classy scarcity" | Keep; add "per-venue rules (pre-order at Armadale only, FAQ)". |
| Lady M "luxury-minimal, crystal-clear sizes" | Confirmed (6 in US$70 / 9 in US$115); add "on-domain per-location pickup pages + rules per product"; /llms.txt only after the file is opened (UNVERIFIED). |
| Crumbl "weekly flavour reveal" | Confirmed (Sunday-evening preview); add the warning that spoiler sites capture the queries → P8. |
| Milk Bar "birthday merchandising" | Confirmed (moment collections); add the anti-pattern of late, date-based shipping fees. |
| Pierre Hermé, Grolet | Hermé confirmed (dated boxes, cut-off line). Grolet: 2020 evidence only. |
| Aesop, Poilâne, Apple product pages, Domino's Tracker, Ladurée, Violet | Not verified this pass (Violet: exists; ordering unknown). |
| "Hero concept: poster frame is the LCP image" | Confirmed by web.dev and the Chromium changelog. |
| "View Transitions… scroll-built cake with CSS scroll-driven animations" | Add "enhancement only; Firefox gaps as of mid-2026 (secondary)". |

---

## 10. Search queue (unsearched or unresolved; about 18 queries)

1. Godly, CSS Design Awards, SiteInspire: "bakery" / "pâtisserie" entries (names + URLs)
2. Mobbin: food-ordering flows with date and slot pickers (e.g. Starbucks, Sweetgreen, Uber Eats scheduled order)
3. Behance, Dribbble, Pinterest: bakery **public** website concepts with pickup-date UI
4. Baymard: express checkout and wallets (Apple Pay) on mobile, numbers; Baymard date-picker guidelines
5. NN/g: date-input / date-picker guidelines; food-ordering or restaurant articles
6. Meta developer docs: in-app browser and Payment Request / Apple Pay support; Instagram UI path "Open in external browser"
7. Ladurée site: flavour colour system, box builder
8. Tartine, Flour Bakery, Magnolia: own ordering pages
9. Première Moisson: online ordering and pickup (Québec chain benchmark)
10. Québec / Canadian bakery sites with design awards (Grafika, Applied Arts, Awwwards Canada)
11. Live bakery cake configurators (named sites) with visual preview and live price
12. MDN / web-features: Baseline status for scroll-driven animations and cross-document View Transitions (Oct 2026)
13. schema.org Offer `deliveryLeadTime` and `availableDeliveryMethod` OnSitePickup: current definitions; Google support
14. Fraunces variable axes (SOFT, WONK, opsz) on Google Fonts
15. (verification) Baymard primary page: which edition and year gives 40/20/19/18% vs 48/26/25%
16. (verification) ladym.com/llms.txt: does it exist? Lady M cut-off lines ("by 12pm", "2 days in advance", "30 days")
17. (verification) Rhubarbe's own ordering URL and its rules (cut-off, Saturday slots); Christian Faure's current status in 2026
18. (verification) Firefox: scroll-driven animations and cross-document View Transitions in stable releases (MDN BCD)

---

## Verification log (2026-10-25)

Adversarial pass: 5 WebSearch queries (US-located summaries, no page opened). Verdicts: CONFIRMED, CORRECTED, UNVERIFIED (could not be reproduced or tied to a primary source).

| Claim | Verdict | Source URL |
|---|---|---|
| Baymard average documented cart abandonment 70.19% | CONFIRMED (consistent across secondary sources; Baymard page not opened) | https://optinmonster.com/cart-abandonment-statistics/ · https://redstagfulfillment.com/percentage-of-online-shoppers-abandon-their-cart/ |
| Baymard per-reason figures, "2026" list: extra costs 40%, delivery 20%, trust 19%, account 18% | UNVERIFIED; secondary sources give 47/24/19/25 (2023 survey), 48/–/25/26 and 39/21. Text now quotes ranges | https://optinmonster.com/cart-abandonment-statistics/ · https://www.magazinemanager.com/?p=35429 · https://redstagfulfillment.com/percentage-of-online-shoppers-abandon-their-cart/ |
| Baymard "older edition" 48 / 22 / 18 / 24% | UNVERIFIED as a set (48% extra costs matches; the others conflict: 24–26% account, 25% trust) | https://www.magazinemanager.com/?p=35429 |
| Chrome 116: a video can be an LCP candidate, timed at its first frame | CONFIRMED; added: no-poster videos were previously ignored; rollout ~2023-08-22; at launch UKM/CrUX only, not PerformanceObserver | https://chromium.googlesource.com/chromium/src/+/main/docs/speed/metrics_changelog/2023_08_lcp.md |
| Scroll-driven animations: Chrome since Jul 2023, Safari 26 (Sep 2025), Firefox stable behind a flag in 2026 | CONFIRMED (secondary, 2026); Firefox on the Interop 2026 list. "v152 (Jun 2026)" not re-confirmed | https://www.drweb.de/css-scroll-animationen-ohne-javascript/ · https://connect.mozilla.org/t5/ideas/implement-css-scroll-driven-animations-animation-timeline/idc-p/119842 |
| Cross-document View Transitions in Firefox | UNVERIFIED (nothing surfaced) | — |
| Rhubarbe: "2016: online orders + Saturday pickup"; "not a live benchmark" | CORRECTED: the Laurier boutique closed in 2025 (after 15+ years, opened 2010); Rhubarbe is now a caterer with online orders and Saturday-morning pickup near Marché Atwater, so it is a live pre-order benchmark. The close date is stated differently (19 June vs 13 July) | https://tastet.ca/en/news/patisserie-rhubarbe-montreal/?region=qc · https://lesleychesterman.substack.com/p/the-end-of-an-era-patisserie-rhubarbe · https://www.themain.com/montreal/bakery/patisserie-rhubarbe |
| Christian Faure left Maison Christian Faure; ÔFauria (2020) | Not re-checked (the combined query returned Rhubarbe only); 2020 Time Out sources stand | https://www.timeout.com/montreal/news/one-of-montreals-great-pastry-chefs-christian-faure-is-running-a-new-personal-shop-110420 |
| Lady M sizes 6 in / 9 in at US$70 / US$115 | CONFIRMED for the **Signature** cake (the CSV had attributed these prices to Green Tea; corrected) | https://www.ladym.com/scheduled-pickup/us-panda-fest · https://www.ladym.com/same-day-pickup/boston-ma |
| Lady M orders off-domain (order.online) | CORRECTED: per-location pickup ordering is on ladym.com (/same-day-pickup/…, /scheduled-pickup/…); one order.online storefront also exists | https://www.ladym.com/same-day-pickup/boston-ma · https://order.online/store/-2834935/ |
| Lady M cut-off lines ("by 12pm for next day", "2 days in advance… up to 30 days") | UNVERIFIED (not reproduced) | — |
| Lady M publishes /llms.txt | UNVERIFIED (not reproduced; first pass saw it in a search result, contents never read) | https://www.ladym.com/llms.txt (unopened) |
| Older Lady M prices (Green Tea 6 in $55 / 9 in $90) | CONFIRMED as an older third-party figure (Patch); it differs from the CSV's "older review 55/95" (The Nibble, not re-checked) | https://patch.com/virginia/mclean/crepe-cake-maker-latest-addition-tysons-food-hall |

Not re-checked this pass (cap): Pierre Hermé prices and dates, Milk Bar prices and fees, Crumbl's Sunday preview, Dominique Ansel rules, Lune, Duchess, Violet, Baymard 41% / 54%, schema.org OnSitePickup, GSAP licence (research/18). See §10, items 15–18.

---

## Sources

All seen 2026-10-25 through WebSearch summaries (no page opened). Source dates are given where known.

**Checkout and mobile evidence**
- Baymard: 50 Cart Abandonment Rate Statistics (list; updated 2025-09-22 per summary) — https://baymard.com/lists/cart-abandonment-rate
- Baymard: 40+ UX Statistics — https://baymard.com/blog/ux-statistics
- Baymard: Ecommerce Checkout UX Guide — https://baymard.com/blog/checkout-flow-ux-optimization
- Baymard: Use "Delivery Date" Not "Shipping Speed" (41% Don't) — https://baymard.com/research-articles/shipping-speed-vs-delivery-date
- Baymard: How to Reduce Cart Abandonment — https://baymard.com/blog/reduce-cart-abandonment
- Amazon Pay blog: 4 ways to optimize UX during COVID-19 (summarizes Baymard; ~2020) — https://pay.amazon.com/blog/for-businesses/4-ways-to-optimize-ux-during-covid-19
- Statista: reasons for abandonment during checkout, US 2025 — https://statista.com/statistics/1228452/reasons-for-abandonments-during-checkout-united-states
- Contentsquare: cart abandonment stats — https://contentsquare.com/guides/cart-abandonment/stats/
- OptinMonster: cart abandonment statistics (reproduces Baymard's 2023 survey; verification) — https://optinmonster.com/cart-abandonment-statistics/
- Magazine Manager: abandonment issues (cites Baymard; verification) — https://www.magazinemanager.com/?p=35429
- Red Stag Fulfillment: share of shoppers who abandon (cites a 2024 Baymard report; verification) — https://redstagfulfillment.com/percentage-of-online-shoppers-abandon-their-cart/
- Shopify Community: Apple Pay/G Pay not available from Instagram bio or Facebook — https://community.shopify.com/t/apple-pay-g-pay-not-available-on-cart-page-when-clicked-through-from-instagram-bio-or-facebook/16591
- Square Community: No Apple Pay on checkout links? — https://community.squareup.com/t5/Community-Corner/No-Apple-Pay-on-checkout-links/m-p/213179/highlight/true
- Dodo Payments feature request: Apple Pay in Meta in-app browser — https://dodopayments.featurebase.app/p/apple-pay-support-in-meta-facebook-instagram-in-app-browser
- Fundraise Up: Donation options for in-app browsers — https://fundraiseup.com/support/app-browsers
- EscapeHatch (vendor) — https://www.getescapehatch.com/
- link.boo: Shopify Apple Pay missing in Instagram browser (vendor) — https://link.boo/fix/shopify-apple-pay-missing-instagram-browser
- Chowly: restaurant website design (secondary) — https://chowly.com/resources/blogs/restaurant-website-design-7-elements-of-a-high-converting-restaurant-website/
- Moodby: crafting a restaurant website (secondary) — https://moodby.com/blog/crafting-a-restaurant-website/
- PlumPOS: restaurant website mistakes (secondary) — https://qa1.plumpos.com/topics/common-mistakes-to-avoid-when-building-a-website-for-your-restaurant

**Performance and CSS**
- web.dev: Video pattern (Web Vitals patterns) — https://web.dev/patterns/web-vitals-patterns/video/video/
- Chromium metrics changelog 2023-08 LCP (Chrome 116) — https://chromium.googlesource.com/chromium/src/+/main/docs/speed/metrics_changelog/2023_08_lcp.md
- DebugBear: Optimize video LCP — https://debugbear.com/blog/optimize-video-lcp
- Web Platform Tests: video-play-after-poster — https://kdab.searchfox.org/firefox-main/source/testing/web-platform/tests/largest-contentful-paint/video-play-after-poster.html
- Codercops: CSS View Transitions and scroll animations 2026 — https://blog.codercops.com/blog/css-view-transitions-scroll-animations-2026
- BuildMVPFast: CSS scroll-driven animations go cross-browser (2026) — https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026
- modern-css.com: what's new 2026 — https://modern-css.com/whats-new/?year=2026
- Chrome for Developers: I/O 2024 web UI recap — https://developer.chrome.com/blog/new-in-web-ui-io-2024?hl=en
- Dr. Web: CSS-Scroll-Animationen ohne JavaScript (2026; Firefox behind a flag, Interop 2026; verification) — https://www.drweb.de/css-scroll-animationen-ohne-javascript/
- Mozilla Connect: implement CSS scroll-driven animations (undated forum; verification) — https://connect.mozilla.org/t5/ideas/implement-css-scroll-driven-animations-animation-timeline/idc-p/119842

**Brand sites and press**
- Dominique Ansel: FAQ — https://dominiqueanselny.com/frequently-asked-questions
- Complex: order Cronuts online (older) — https://www.complex.com/pop-culture/a/julian-kimble/order-cronuts-online
- Foursquare: Dominique Ansel tips — https://redirect.foursquare.com/dominiqueansel
- Seastreak: Cronuts guide — https://seastreak.com/cronuts/
- StoryHunt: Dominique Ansel Bakery guide — https://www.storyhunt.io/en/articles/dominique-ansel-bakery
- Pierre Hermé: The art of macaron — https://www.pierreherme.com/en/the-art-of-macaron
- Pierre Hermé: 12-macaron box (spring-summer) — https://www.pierreherme.com/en/coffret-de-12-macarons-printemps-ete.html
- Pierre Hermé: 8-macaron box — https://www.pierreherme.com/en/coffret-de-8-macarons-julie-serre.html
- Time Out Paris: Cédric Grolet launches online shop (2020) — https://www.timeout.fr/paris/actualites/cedric-grolet-vient-de-lancer-sa-boutique-en-ligne-051320
- Paris Zigzag: Cédric Grolet online sales (2020) — https://www.pariszigzag.fr/paris-au-quotidien/cedric-grolet-se-lance-dans-la-vente-en-ligne/
- France.fr: Parisian pastry chefs click and collect (2023) — https://france.fr/en/article/parisian-pastry-chefs-click-and-collect-delivery
- Lady M: llms.txt (first pass only; not reproduced in verification; unopened) — https://www.ladym.com/llms.txt
- Lady M: Signature Mille Crêpes — https://www.ladym.com/items/signature-mc
- Lady M: Pistachio Mille Crêpes — https://www.ladym.com/items/pistachio-mille-crepes
- Lady M: scheduled pickup page (Signature 6 in $70 / 9 in $115; verification) — https://www.ladym.com/scheduled-pickup/us-panda-fest
- Lady M: same-day pickup, Boston (verification) — https://www.ladym.com/same-day-pickup/boston-ma
- Patch: Lady M at Tysons food hall (older prices; verification) — https://patch.com/virginia/mclean/crepe-cake-maker-latest-addition-tysons-food-hall
- The Nibble: Lady M review — https://blog.thenibble.com/?p=113323
- order.online: Lady M storefront — https://order.online/store/-2834935/
- Milk Bar: cakes — https://milkbarstore.com/collections/cakes
- Milk Bar: Birthday cake — https://milkbarstore.com/products/birthday-cake
- Milk Bar: Moments & Milestones — https://milkbarstore.com/collections/moments-milestones
- Milk Bar: Birthday Sweet Shop — https://milkbarstore.com/collections/the-birthday-sweet-shop/party
- Milk Bar: Always On — https://milkbarstore.com/collections/always-on
- Milk Bar: Birthday cake delivery NYC — https://milkbarstore.com/collections/birthday-cake-delivery-nyc
- order.online: Levain Bakery New York — https://order.online/store/levain-bakery-new-york-1014847/
- Lookalike: levainbakeryusa.it.com FAQ (unofficial; do not trust) — https://levainbakeryusa.it.com/faq/
- PureWow: best online bakeries — https://purewow.com/food/best-online-bakeries
- Hungry Onion: Tartine forum thread — https://www.hungryonion.org/t/do-you-live-the-tartine-way-sfba/8798?page=2
- Lune Croissanterie: FAQs — https://www.lunecroissanterie.com/faqs
- Time Out Melbourne: Lune Croissanterie — https://www.timeout.com/melbourne/restaurants/lune-croissanterie
- Pedestrian.tv: Lune Hot Cross Cruffins (2020) — https://www.pedestrian.tv/bites/lune-croissanterie-hot-cross-cruffins-easter-limited-release-2020/
- Wikipedia: Claire Ptak — https://en.wikipedia.org/wiki/Claire_Ptak
- Marie Claire: Violet Cakes — https://www.marieclaire.co.uk/news/violet-cakes-587070
- The Modern House: Claire Ptak at home — https://themodernhouse.com/journal/chefs-at-home-claire-ptak
- Tasting Table: first time at Crumbl — https://www.tastingtable.com/1825055/first-time-crumbl-cookies/
- Tasting Table: Crumbl secret menu cookie — https://www.tastingtable.com/1962070/crumbl-new-secret-menu-cookie
- Designbeep: Crumbl rotating menu (2026-07-31) — https://designbeep.com/2026/07/31/crumbl-cookie-near-me/
- Edify Edmonton: best desserts 2025 (Duchess Bake Shop) — https://edifyedmonton.com/food/best-restaurants/2025/best-desserts-3/
- Family Fun Canada: Edmonton Christmas treats — https://www.familyfuncanada.com/edmonton/christmas-treats/
- RMO: Alberta bake shop "transport you to Paris" — https://www.rmoutlook.com/cool-winter-guide/this-alberta-bake-shop-will-transport-you-to-paris-with-every-bite-6217381
- Zarla: bakery inspiration (Bobbette & Belle) — https://www.zarla.com/inspiration/bakery

**Québec**
- Tastet: « Rhubarbe : l'excellente pâtisserie se métamorphose en traiteur » (first pass labelled it a 2016 review; the pivot it describes is dated 2025) — https://tastet.ca/critiques/patisserie-rhubarbe-quartier-plateau-mont-royal/
- Tastet (EN): Rhubarbe transforms into a caterer (verification) — https://tastet.ca/en/news/patisserie-rhubarbe-montreal/?region=qc
- Lesley Chesterman (Substack): Patisserie Rhubarbe closes its Plateau location (verification) — https://lesleychesterman.substack.com/p/the-end-of-an-era-patisserie-rhubarbe
- The Main: Pâtisserie Rhubarbe, Pointe-Saint-Charles (listing dated 2025; verification) — https://www.themain.com/montreal/bakery/patisserie-rhubarbe
- Tastet: best birthday cakes in Montréal — https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/
- RestoMontreal: Pâtisserie Rhubarbe — https://www.restomontreal.ca/resto/patisserie-rhubarbe-montreal/17483/fr/
- Daily Hive: 7 Montréal bakeries (undated) — https://dailyhive.com/montreal/7-montreal-bakeries-to-try
- Uber Eats: Guillaume — https://www.ubereats.com/ca/montreal/food-delivery/guillaume/eIfg7KgjRESaNHASN3JXtg
- The Main: Guillaume — https://www.themain.com/montreal/bakery/guillaume
- RestoMontreal: Mamie Clafoutis — https://www.restomontreal.ca/resto/mamie-clafoutis-montreal/7024/en/?k=bread
- Kitchissippi: Mamie Clafoutis Westboro — https://kitchissippi.com/?p=191703
- The Infatuation: Hof Kelsten — https://www.theinfatuation.com/montreal/reviews/hof-kelsten
- Tiny Urban Kitchen: Montréal bakeries tour — https://tinyurbankitchen.com/a-tour-of-montreal-bakeries-bagel-shops/
- Lufa Farms blog: Hof Kelsten (2026-03-04; content not read) — https://montreal.lufa.com/en/blog/hof-kelsten-20260304112136
- Time Out Montréal: Christian Faure's new shop (2020) — https://www.timeout.com/montreal/news/one-of-montreals-great-pastry-chefs-christian-faure-is-running-a-new-personal-shop-110420
- Time Out Montréal (FR): ÔFauria (2020) — https://www.timeout.com/fr/montreal/nouvelles/ofauria-la-nouvelle-maison-du-patissier-christian-faure-102720
- Afar: Maison Christian Faure — https://www.afar.com/places/maison-christian-faure-montreal

**Galleries, awards, trends, tools**
- Awwwards: Transition Sonoma Bakery — https://www.awwwards.com/inspiration/transition-sonoma-bakery
- Tenten: 1Bite2Go Awwwards HM — https://tenten.co/blog/culture/1bite2go-website-gets-awwwards/
- Kota: Awwwards honourable mention — https://kota.co.uk/blog/weve-just-bagged-an-honourable-mention-from-awwwards
- Wikipedia: Awwwards — https://en.wikipedia.org/wiki/Awwwards
- All That Is Kim (Substack): inspiration sites (Lapa Ninja, SiteInspire, Land-book) — https://allthatiskim.substack.com/p/get-inspired-websites-to-spark-your
- Krishaweb: 15 best bakery website designs 2026 — https://www.krishaweb.com/blog/best-bakery-website-designs/
- Webflow: 7 bakery website examples — https://webflow.com/blog/bakery-websites
- ColorWhistle: bakery website design ideas — https://colorwhistle.com/bakery-website-design/
- Azuro Digital: 10 best F&B website designs of 2026 — https://azurodigital.com/food-beverage-website-examples/
- Black Country Chamber: Design trends 2026 — https://www.blackcountrychamber.co.uk/news/article/design-trends-2026-5-predictions-to-get-excited-about/
- Blendnow: Design trends 2026 — https://www.blendnow.com/blog/design-trends-2026-you-need-to-know
- Makeform: AI design-your-own-cake form generator — https://www.makeform.ai/tools/ai-design-your-own-cake-form-generator
- B12: bakery website prompt gallery — https://www.b12.io/prompt-gallery/bakery-website/
- Brihaspati Tech: bakery app features (custom cake builder) — https://www.brihaspatitech.com/?p=42626
- ColorWhistle: bakery website cost (USA) — https://colorwhistle.com/website-cost-features/bakery-website-cost-usa/

**Via sibling files (not re-searched)**
- research/03-competitors.md: Cake Design Granby, Avec un Grand A, Rose Gâteaux, Maître Glacier, IGA traiteur, Première Moisson ownership, directory hours conflicts
- research/16a-admin-ux-inspiration.md: Hotplate, Bakesy, CakeBoss, Tock; NN/g touch-target and mobile-input articles
- research/18-dated-claims-verification.md: GSAP licence (claim 6), FAQ rich results (claim 1), Instagram indexing (claim 5)
- research/05-serp-baseline.md (via research/02): AI engines found no Québec cake price
- research/plan-v0c-site-ux-ordering.md §5–§7: directions, palette, hero concept, inspiration board
