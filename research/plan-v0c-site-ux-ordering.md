# Coco Vanille: Site, UX, Ordering and Local SEO Plan (earlier draft)

> Stored as provided by Yahya on 2026-10-25. Formatting only; content unchanged. Claims are reviewed in research/12-plan-review.md and research/18-dated-claims-verification.md.
>
> Provenance: the paste starts mid-document (at the end of a technical layer, before "Layer 3"); the earlier part of this draft was not included.

- Cheap future-proofing: add /llms.txt, a markdown map of your key pages for LLMs. No major engine has confirmed using it yet, but it takes 30 minutes. Also publish /menu.json and /hours.json, generated from the CMS, so any AI agent can read prices, availability and hours without guessing.
- One source of truth: hours, prices, lead times and allergens live in the CMS. From there they generate the pages, the JSON-LD, the JSON feeds and (via API) the Google Business Profile hours. Nothing is typed twice, so nothing contradicts.

Core entity block. Address, phone, hours and domain are placeholders. The Person block for the chef lives on /a-propos/.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": "https://VOTREDOMAINE.ca/#patisserie",
  "name": "Pâtisserie Coco Vanille",
  "alternateName": ["Pâtisserie Cocovanille", "Coco Vanille Granby"],
  "description": "Pâtisserie artisanale à Granby (Cantons-de-l'Est) : gâteaux de fête personnalisés, gâteaux de mariage, macarons et viennoiseries. Commande en ligne et cueillette en boutique.",
  "url": "https://VOTREDOMAINE.ca/",
  "logo": "https://VOTREDOMAINE.ca/logo.png",
  "image": "https://VOTREDOMAINE.ca/img/vitrine-coco-vanille-granby.avif",
  "telephone": "+1-450-000-0000",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "À VALIDER",
    "addressLocality": "Granby",
    "addressRegion": "QC",
    "postalCode": "À VALIDER",
    "addressCountry": "CA"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 45.3995807, "longitude": -72.7250821 },
  "hasMap": "https://maps.google.com/?cid=10789122976114705165",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "08:00",
    "closes": "17:00"
  }],
  "areaServed": ["Granby", "Bromont", "Shefford", "Waterloo", "Haute-Yamaska"],
  "knowsLanguage": ["fr-CA", "en-CA"],
  "servesCuisine": "Pâtisserie",
  "acceptsReservations": false,
  "hasMenu": "https://VOTREDOMAINE.ca/carte/",
  "founder": { "@id": "https://VOTREDOMAINE.ca/a-propos/#chef" },
  "sameAs": [
    "https://www.instagram.com/coco_vanillegranby/",
    "https://www.facebook.com/PatisserieCocoVanille"
  ]
}
</script>
```

## Layer 3: Content architecture and Québec keywords

Write in Québec French, not France French. People in Granby search terms like:

- "gâteau de fête" (and also "gâteau d'anniversaire")
- "chocolatine", "beigne"
- "cueillette en boutique"
- "8 po"

Keyword tools under-represent these nuances. Mine the real wording from Instagram DMs, Google reviews and phone calls.

Six topical hubs. Each hub is a pillar page plus spokes, all internally linked. Only include what they actually make.

| Hub | Spokes |
|---|---|
| Occasions | Fête enfants/adultes · smash cake 1 an · gâteaux chiffres & lettres · bento cakes · baby shower & dévoilement · baptême · retraite |
| Mariages | Gâteaux à étages · tables sucrées · boîte dégustation · prix par portion · vrais mariages · lieux de réception de la région |
| Saisons | Galette des rois · Saint-Valentin · temps des sucres · Pâques · Fête des Mères/Pères · Fête nationale · Action de grâce · Halloween · bûches de Noël |
| Diètes & allergies | Sans gluten · végane · sans noix, plus an honest cross-contamination policy |
| Savoir-faire | Guide des portions · conservation · transporter un gâteau · crème au beurre vs ganache vs fondant · glossaire · « Tout sur la vanille » (Madagascar vs Tahiti vs Mexique) |
| Local | « Une pause sucrée après le Zoo de Granby » · boîte pique-nique pour l'Estriade / lac Boivin · producteurs partenaires |

« Tout sur la vanille » is the brand pillar: Coco Vanille can own the topic "vanille" in Québec.

Rules:

- Granby is the core geo.
- Create pages for Bromont, Waterloo, Shefford, etc. only when there is real substance: actual delivery, weddings delivered there, local testimonials.
- Cloned city pages count as doorway pages and risk a penalty.
- Seasonal URLs never change. Refresh /buches-de-noel/ every year; never create /buches-2026/. Authority then compounds year after year.
- Show prices ("à partir de XX $") on every hub. "Prix sur demande" kills AEO, because an engine can't quote what you hide.
- Kids' themes: say "thèmes" and use licensed edible prints. Don't build pages around trademarks (Pat' Patrouille, Bluey…).

Seasonal calendar. Each page goes live or gets refreshed 6–8 weeks before the occasion.

| Occasion | When | Live by |
|---|---|---|
| Galette des rois | Jan 6 | early Dec |
| Saint-Valentin | Feb 14 | early Jan |
| Temps des sucres | Mar–Apr | Feb |
| Pâques | Mar/Apr | 6–8 wks before |
| Fête des Mères | 2nd Sunday of May | early Apr |
| Fête des Pères / Fête nationale | 3rd Sunday of June / June 24 | early May |
| Wedding season | June–Sept | Jan–Mar (planning season) |
| Action de grâce / Halloween | 2nd Monday of Oct / Oct 31 | early Sept |
| Bûches & Fêtes | December | October (pre-orders open Nov) |

## Layer 4: Answer-first writing (the AEO pattern)

Every commercial page follows the same skeleton:

1. H1 = product + place, e.g. "Gâteaux de fête personnalisés à Granby".
2. Answer block of 40–60 words: what it is, price range, lead time, how to order. Include the brand name and the city.
3. Key-facts table: sizes, portions, prices, lead times.
4. Real photos with descriptive alt text in both languages.
5. H2s phrased as real questions, each answered in its first sentence.
6. Proof: reviews about this product, press mentions, a quote from the chef. The original GEO research (Princeton, 2023) found that quotes and statistics raised visibility in AI answers by up to ~40%.
7. CTA plus links to related hubs.
8. Visible "Mis à jour le…" date, plus dateModified in the schema.

Example:

```markdown
## Combien coûte un gâteau de fête personnalisé à Granby ?

Chez Pâtisserie Coco Vanille, à Granby, un gâteau de fête personnalisé coûte
de XX $ (6 po, 8–10 portions) à XX $ (10 po, 20–25 portions), décoration
simple incluse. Prévoyez 5 jours de délai : commandez en ligne et récupérez
votre gâteau en boutique.

| Taille        | Portions | À partir de | Délai   |
|---------------|----------|-------------|---------|
| 6 po (15 cm)  | 8–10     | XX $        | 5 jours |
| 8 po (20 cm)  | 12–16    | XX $        | 5 jours |
| 10 po (25 cm) | 20–25    | XX $        | 7 jours |
```

Question bank to answer. This is a seed list; expand it with DMs, reviews, "People also ask" and AI prompts.

- Combien de jours d'avance commander ?
- Quelle taille pour 20 personnes ?
- Sans gluten / végane / sans noix ?
- Livrez-vous à Bromont ?
- Commande le jour même ?
- Comment transporter un gâteau à la crème ?
- Prix d'un gâteau de mariage par portion ?
- Ouverts le dimanche et les jours fériés ?
- Puis-je envoyer une photo d'inspiration ?
- Jusqu'à quand commander pour Noël ?

## Layer 5: Off-site corroboration (the real GEO lever)

AI engines triangulate: they recommend businesses that several independent sources agree on. The website alone can't do this.

- Citation-gap workflow (monthly):
  1. Run your prompt panel.
  2. Note which URLs Perplexity, ChatGPT and AI Overviews cite (listicles, directories, news, Reddit threads).
  3. Get onto those sources (outreach, listing, correction), or publish the better source yourself.
- Local press: pitch La Voix de l'Est and regional media with a hook. Options:
  - an anniversary
  - a new signature creation
  - an anti-waste initiative
  - a charity bake
  - an annual « saveurs préférées des Granbyens » mini-report
- Partner web:
  - Wedding venues, photographers, florists and planners: publish "Vrais mariages" stories with credits, and they will share and link.
  - Local producers (érablière, petits fruits, laiterie): cross-feature each other. "Local sourcing" facts are exactly what AI likes to quote.
- Tourism and institutions:
  - Tourisme Cantons-de-l'Est and the local tourism office
  - the Chambre de commerce Haute-Yamaska
  - the Festival international de la chanson de Granby
  - local schools and sports teams
- Original data: "Nos 5 gâteaux les plus commandés", "X bûches cette année". Numbers become quotable facts.
- Instagram captions now count. Since July 2025, Instagram lets search engines index public posts from professional accounts. Write captions with the product name plus "Granby", and check the setting is on.
- Pinterest and Google Images/Lens: people screenshot a cake and search "where can I get this?". A well-tagged gallery with one page per notable cake catches that traffic.
- Organic community mentions: real customers recommending you in local Facebook groups (parents, weddings) or on Reddit count. Never fake this; it breaks platform rules and potentially Canada's Competition Act.
- Consistency: hours, prices and lead times must be identical everywhere. Contradictions lower AI confidence.

## Layer 6: Measurement

- Search Console and Bing Webmaster Tools: FR/EN queries, pages, Core Web Vitals.
- GBP Performance: calls, direction requests, website clicks (UTM-tagged).
- Analytics: Plausible/Fathom (cookieless) or GA4 with consent.
  - Create an "AI assistants" channel for referrals from chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com and claude.ai.
  - ChatGPT also appends utm_source=chatgpt.com to its links.
- Geogrid rank tracking (Local Falcon, BrightLocal) on about 10 core terms across Granby.
- Monthly AI prompt panel: 20 prompts × 4 engines. Track mention rate, position, sentiment and cited sources. A spreadsheet works; Otterly, Peec AI or Profound if budget allows.
- Business metrics:
  - online orders per week and average order value
  - share of revenue online
  - builder completion rate and quote-to-deposit rate
  - new reviews per month
- Zero-click reality: many people get the answer without clicking. Track your share of answers and GBP actions, not just sessions.

## 4. Site map (French at root, English mirror)

| FR (root) | EN | Primary intent |
|---|---|---|
| / | /en/ | pâtisserie Granby · bakery Granby |
| /commander/ | /en/order/ | commander un gâteau en ligne |
| /gateaux-de-fete/ (+ /enfants/, /smash-cake/, /chiffres-lettres/) | /en/birthday-cakes/ | gâteau de fête / d'anniversaire Granby |
| /gateaux-personnalises/ → /createur/ (steps noindex) | /en/custom-cakes/ | gâteau personnalisé Granby |
| /gateaux-de-mariage/ (+ /vrais-mariages/[slug]/) | /en/wedding-cakes/ | gâteau de mariage Cantons-de-l'Est |
| /macarons/ · /viennoiseries/ · /entremets/ · /tartes/ · /cupcakes/ | mirrored | macarons, croissants, chocolatines Granby |
| /buches-de-noel/ · /paques/ · /saint-valentin/ · /fete-des-meres/ · /temps-des-sucres/ · /galette-des-rois/ | mirrored | seasonal (evergreen URLs) |
| /sans-gluten-allergies/ | /en/gluten-free-allergies/ | gâteau sans gluten Granby |
| /corporatif/ | /en/corporate/ | boîtes de bureau, cadeaux clients |
| /ateliers/ | /en/workshops/ | atelier macarons (Event schema) |
| /galerie/ + /galerie/[slug]/ | /en/gallery/ | Google Images, Lens, Pinterest |
| /nous-trouver/ | /en/visit/ | heures, stationnement, près du Zoo |
| /a-propos/ | /en/about/ | entity home: story, chef, facts |
| /faq/ · /journal/ | /en/faq/ · /en/journal/ | AEO hub, guides |
| /carte-cadeau/ · /presse/ · /emplois/ | mirrored | gifting · GEO trust · JobPosting |
| /liens/ | n/a | Instagram link-in-bio on your own domain (replaces Linktree) |

Notes:

- /a-propos/ is the entity home: story, team photos and a « Coco Vanille en bref » facts box. The box lists founding year, chef, address, hours, specialties, service area, lead times, price ranges and languages, in plain quotable sentences.
- Cart, account and builder-step URLs are noindex.
- Filtered gallery and listing URLs get canonicals, to avoid crawl bloat.

## 5. Signature features: each one earns customers and visibility

| Feature | Customer delight | Search / AI payoff |
|---|---|---|
| La vitrine du jour: a tappable photo of the real display case each morning | See what's there now, reserve before it's gone | Daily fresh content; auto-generated GBP post |
| Créateur de gâteau | Design visually, live price, no DMs | Published prices, portions and lead times are quotable facts |
| Compose ta boîte (macarons) | The box fills slot by slot | A product page per flavor |
| Smart click & collect | Only valid dates, add-to-calendar, "c'est prêt" SMS | Reliable operations, so better reviews |
| Seasonal pre-orders | Christmas without phone chaos | Evergreen URLs gain authority every year |
| Wedding tasting box | Taste at home, book online | "Vrais mariages" pages earn links from venues and photographers |
| Club Coco (Apple/Google Wallet card) | Birthday treat, order reminders | Repeat customers bring more reviews and mentions |
| QR code on every box | Review, share or reorder in one tap | Review velocity plus customer photos |
| Filterable gallery (occasion, color, style) | "I want one like this" | Images, Lens and Pinterest long-tail traffic |
| Ateliers (macarons, kids' decorating) | Experiences and gifts | Event rich results, press hooks |
| Saveur de la semaine (Monday reveal) | A reason to come back weekly | Freshness plus Instagram engagement |
| « Demande à Coco » on-site assistant (phase 2) | Instant answers 24/7 | Logs real questions, which become FAQ entries (an AEO loop) |
| Gift cards | Last-minute gifting | "carte-cadeau pâtisserie Granby" queries |

The assistant answers only from the site's own content; allergy questions always go to a human.

More ideas to test:

- Panier surprise de fin de journée (anti-waste)
- "Gâteau du mois" subscription for offices
- "Fête parfaite" kits (cake + cupcakes + candles)
- AR preview of wedding cakes on your table
- A careers page with JobPosting schema

## 6. The ordering engine ("commande")

### Two modes, one engine

- Product-first (everyday):
  - Customers browse freely, and every product shows its lead time ("Prête dès jeudi").
  - At checkout, the calendar only offers dates that work for everything in the box.
- Date-first (Noël, Pâques, Fête des Mères):
  - The customer picks the pickup day first, then sees only what's still available that day.
  - This turns holiday phone chaos into a calm queue.

### Capacity and slots

- Limits: daily capacity per production category (cakes, viennoiseries, macaron boxes) [to confirm with the chef].
- Lead times and cut-offs: a lead time per product, plus an order cut-off such as "avant 14 h pour demain".
- Pickup windows: 15-minute windows with a maximum per window, so there are no counter lineups.
- Calendar controls:
  - blackout days and a holiday mode
  - pre-order windows that open and close automatically ("Les précommandes de bûches ouvrent le 1er novembre")
  - timezone set to America/Toronto

### Checkout

- Guest checkout by default. Forced account creation is a top abandonment cause in Baymard's research; passkey or magic-link accounts stay optional.
- Payment order:
  - Apple Pay and Google Pay first
  - card as fallback
  - gift cards accepted
  - promo-code field collapsed
- Instagram in-app browser: this is where most first visits happen, and Apple Pay often doesn't appear there.
  - Test checkout inside the IG and FB browsers.
  - Show an "Ouvrir dans Safari" hint.
  - Keep other payment methods available.
- Details to collect: cake message (with live preview), allergy note, phone number for SMS.
- Confirmation screen:
  - order number
  - an add-to-calendar file (.ics) with the address and a Maps link
  - parking and door instructions

### Custom cake builder (the killer feature)

Steps:

1. Occasion
2. Number of guests (a portion slider suggests the size)
3. Shape
4. Cake
5. Filling
6. Finish
7. Decoration (color swatches, flowers, macarons, gold leaf)
8. Message + inspiration photos
9. Date
10. Summary

How it works:

- A layered 2.5D illustration (SVG) updates with every choice. It's the "wow" moment without the weight of 3D.
- A pricing formula shows a live price range. A rules engine blocks incompatible combinations and adds surcharges.
- Simple builds: pay a deposit immediately.
- Complex builds: a "demande de soumission" gets an answer within 24 hours, with a payment link.
- Designs can be saved and shared ("Envoyer pour avis" to a partner or family) and resumed later.
- Builder steps are noindex; the indexable /gateaux-personnalises/ page carries the content, prices, gallery and FAQ.
- Operations win: structured requests replace DM ping-pong. Set an Instagram auto-reply that points to the builder.

### Weddings

1. Landing page with real weddings, styles and price per portion.
2. Take-home tasting box or an in-store tasting appointment.
3. Proposal.
4. A deposit locks the date.
5. Automatic reminder to confirm the final guest count.

### After the order

- An illustrated tracker: Reçue → En préparation → Décoration → Prête.
- SMS « C'est prêt ! ».
- QR code on the box: leave a review, share a photo, reorder.
- Follow-up message 24 hours later.
- Birthday reminder the following year (with CASL consent).
- Seasonal pre-order alerts.

### Back-office designed for floury hands (tablet PWA)

- Aujourd'hui: pickup timeline, big status buttons, tap-to-call. Tapping "Prête" sends the SMS.
- Production: quantities aggregated by product, size and flavor for the next one and two days, printable for the kitchen.
- Capacité: close a day in one tap, adjust limits, switch on holiday mode.
- Soumissions: photos and details, set a price, send the deposit link.
- Menu: an "épuisé" toggle updates the site instantly; seasonal items can be scheduled.
- Heures: special hours update the site, schema and GBP from one place.
- Avis: Google and Facebook reviews with AI-drafted FR/EN replies that a human approves.
- Tableau de bord: orders, revenue, best-sellers and traffic sources (Google, Maps, Instagram, AI assistants).

## 7. Design and UX direction

### Three creative directions

Choose after studying their Instagram; the most-liked posts show what their audience loves.

| Direction | Look | References | Best for |
|---|---|---|---|
| A: "Atelier Vanille" (Parisian editorial minimal) | Cream ground, vanilla-pod brown type, oversized serif, cinematic macro photos | Pierre Hermé, Cédric Grolet, Aesop | Premium positioning, weddings |
| B: "Coco Joyeux" (playful) | Coconut white with pistachio, raspberry and lemon accents, rounded shapes, sticker badges, bouncy micro-animations | Milk Bar, Crumbl | Birthdays, families |
| C: "Maison des Cantons" (warm and local) | Kraft textures, hand-drawn Granby illustrations (lac Boivin, zoo silhouettes), maple accents | Poilâne, Lune | Local storytelling |

Recommendation: A as the base, with B's playfulness in the builder, the birthday pages and the microcopy.

### Design system starter

This is an example; align it with their logo.

- Palette:

  | Name | Hex | Use |
  |---|---|---|
  | Crème vanille | #F7F0E3 | background |
  | Coco | #FFFCF6 | cards |
  | Gousse | #2E211A | text (≈13.7:1 contrast on cream) |
  | Caramel | #C8915A | accents |
  | Framboise | #B8435A | CTAs (white text ≈5.3:1, passes AA) |
  | Pistache | #B9C99A | tags |

- Type:
  - Fraunces for headlines: a variable serif with a literal "Soft" axis, which gives creamy headlines.
  - Inter or DM Sans for the interface.
  - Self-host both fonts.
  - Optionally, turn the chef's handwriting into a font for "coup de cœur" notes.
- Signature texture: a barely visible vanilla-bean speckle on cream backgrounds. The whole brand in one detail.
- Shapes and icons: soft corners like a piped dollop; hand-drawn line icons for categories and allergens.
- Motion: "whipped cream" easing, cubic-bezier(0.22, 1, 0.36, 1), 250–450 ms, with a tiny overshoot when adding to the box. Everything respects prefers-reduced-motion.
- Photography:
  - natural window light
  - consistent 45° and top-down angles
  - vanilla pods and coconut flakes as props
  - hands in frame for scale
  - a cross-section shot of every cake
  - cut-out shots on a seamless backdrop for the builder
  - formats: 4:5 (mobile), 3:2 (desktop), 1:1 (GBP)

### Hero concept (mobile)

- A full-bleed 6-second loop: a knife glides through a vanilla-coconut cake and the layers appear in slow motion.
- A small H1, "Pâtisserie artisanale à Granby", sits above a large display line, "La vraie vanille, depuis [année]". It's pretty and SEO-correct at the same time.
- A live status pill: ● Ouvert · jusqu'à 17 h.
- Two buttons: [Commander pour demain] [Créer mon gâteau].
- A trust strip: ★ rating · number of reviews · "Fait ici chaque matin".
- The video's poster frame is the LCP image; the video loads afterwards.

### Signature interactions

- La coupe: hovering (desktop) or press-and-hold (mobile) on a cake card reveals its cross-section.
- La vitrine interactive: the morning photo of the real display case has tappable hotspots that add items to the box, with an accessible list fallback.
- « Ma boîte » instead of "panier": pastries drop into an illustrated box, and the lid closes at checkout.
- Portion slider: drag the guest count and the cake visibly grows.
- Live message preview on a chocolate plaque.
- View Transitions: the card photo morphs into the product hero (progressive enhancement).
- Scroll-built cake on the savoir-faire page, built with CSS scroll-driven animations or GSAP (now fully free, including ScrollTrigger).
- Cut-off countdown: « Commandez d'ici 2 h 14 pour demain ».
- Seasonal skin: the site follows the vitrine through the year.

### Mobile and conversion rules

- Sticky bottom bar in the thumb zone: Commander · Itinéraire · Appeler.
- Nav labels stay literal; keep the cleverness for microcopy.
- Dates: horizontal day chips plus time-slot chips, never a tiny calendar grid.
- Every product shows: price, portions, lead time, allergens and a real photo.
- Filters match how people think: pour combien de personnes, occasion, date, allergens.
- Accessibility:
  - Pastels are for surfaces only; text stays brown.
  - Visible focus states and a keyboard-friendly builder.
  - Accessible date picker (React Aria).
  - Target: WCAG 2.2 AA and Lighthouse mobile ≥ 95.

### Microcopy (Québec French)

- Empty box: « Ta boîte est vide. La vitrine, elle, est pleine. »
- Full slot: « Ce créneau est complet — le four aussi. »
- Order confirmed: « C'est noté! On sort le fouet. »
- 404 page: « Oups, cette page s'est émiettée. »

Decide between tu and vous based on their Instagram tone.

### Inspiration board

I can't browse live from here, so verify the current versions of these sites.

| Reference | What to steal |
|---|---|
| Pierre Hermé | Products shot like jewels; flavor storytelling; macaron box composition |
| Ladurée | Color-coded flavors; packaging as a UI motif |
| Cédric Grolet | One hero product per screen; hyper-real macro photography |
| Lune Croissanterie | Pre-order "drops" and classy scarcity |
| Milk Bar | Birthday merchandising, playful voice, gifting UX |
| Lady M | Luxury-minimal cake e-commerce, crystal-clear sizes |
| Violet (Claire Ptak) | Soft illustration, seasonal storytelling |
| Crumbl | Weekly flavor reveal as a habit loop |
| Maison Christian Faure, Pâtisserie Rhubarbe (Montréal) | Québec benchmarks for tone and bilingual handling |
| Apple product pages | Scroll storytelling, e.g. "anatomie d'un gâteau" |
| Domino's Tracker | Order status as entertainment |

Where to dig further:

- Awwwards and Godly (search bakery, pastry, food)
- Land-book, Lapa Ninja, SiteInspire
- Mobbin for real checkout and date-picker patterns
- Baymard Institute for checkout research

## 8. Tech stack and architecture

Rule #1: online orders must land on the same POS screen or printer as walk-in orders, or staff won't adopt the system. The stack therefore follows the POS they already use [to confirm].

| Path | Stack | Pros | Cons |
|---|---|---|---|
| A: Pro (recommended) | Astro or Next.js (SSG/ISR) · Sanity CMS (bilingual, image hotspots) · commerce through Square APIs or headless Shopify, matching the POS (or Stripe if there's no POS lock-in) · Supabase/Postgres for slots, capacity and quotes · Resend + Twilio · Vercel or Cloudflare · Plausible · Sentry | Full design freedom, perfect schema and speed | Higher build cost; needs a developer for changes |
| B: Lean | Shopify + customized theme + pickup-date app (or Square Online if they're on Square) | Fast and cheap | Rigid URLs, limited schema control, design ceiling, builder harder to do |

Why Astro:

- Content pages ship almost no JavaScript; only the box, builder and slot picker are interactive "islands".
- That means fast pages and pure HTML for AI crawlers.

Mobile app: a PWA with web push ("C'est prêt !", drops) replaces a native app. iOS has supported web push for home-screen web apps since 16.4.

```
  Google · Apple Maps · Bing/Copilot · ChatGPT · Perplexity · Gemini
               ▲  HTML + JSON-LD + sitemaps + IndexNow + llms.txt
               │
Sanity CMS ──► Astro/Next (SSG/ISR, edge CDN) ◄── customers (mobile PWA)
               │  islands: Ma boîte · Créateur · Créneaux
               ▼
          Order API (serverless)
           ├─ Slots & capacity ... Postgres (Supabase)
           ├─ Payments ........... Square / Shopify / Stripe
           ├─ POS sync ........... same screen as walk-in orders
           ├─ Notifications ...... email · SMS
           └─ Admin PWA .......... tablet in the kitchen
               ▼
  GBP API (hours, posts) · Merchant feed (later) · analytics · review requests
```

Data model sketch:

- Product → Variant (size, portions, price) → OptionGroup (flavor, filling, finish)
- Rule (compatibility, surcharges)
- CapacityPool (category × day), Slot
- Order / OrderItem / Fulfillment
- Quote (deposit)
- Customer (consents, birthdays)
- Season (pre-order windows)
- Review

## 9. Québec compliance (validate with a professional)

| Topic | What it means for the site |
|---|---|
| Loi 96 (French language) | The site is complete and default in French. English is allowed but never more complete. Order terms are presented in French first. |
| Loi 25 (privacy) | Publish a privacy policy and the privacy officer's contact. Non-essential trackers are off by default (opt-in). Do a privacy impact assessment before sending personal data to services outside Québec (most SaaS tools). Keep an incident register. |
| CASL / LCAP (anti-spam) | Get express consent for the newsletter, SMS promos and birthday reminders. Every message includes an unsubscribe. |
| LPC (consumer protection) | Show clear total prices. Write a deposit and cancellation policy for custom and perishable items. Send order confirmations. If you suggest tips, calculate them on the pre-tax amount (rule since May 2025). |
| Taxes | TPS 5 % + TVQ 9.975 %. Bakery items have special rules (some single pastries are taxable while 6+ are zero-rated). Set up tax classes with the accountant. |
| Allergens | Show Health Canada priority allergens per product, with an honest cross-contamination statement. A human answers allergy questions. |
| Accessibility | Target WCAG 2.2 AA. |

## 10. Roadmap and KPIs

| Phase | When | Work |
|---|---|---|
| 0: No code | Weeks 1–2 | Fix GBP, Apple and Bing listings; unify the name; set up the review QR and SMS flow; run the AI and ranking baseline; mine keywords from DMs and reviews; plan the photo shoot; collect menu, prices, lead times and capacity |
| 1: MVP | Weeks 3–8 | Design system and key screens; French content (English adapted, not literally translated); site, menu, click & collect, slots, payments, schema, hreflang; admin "Aujourd'hui"; analytics |
| 2: Delight | Weeks 9–14 | Cake builder; wedding funnel and tasting box; gift cards; Wallet loyalty card; push notifications; gallery pages; review automation |
| 3: Ongoing | Every month | 2 guides; seasonal hubs refreshed 6–8 weeks ahead; weekly GBP posts and photos; reviews answered within 48 h; 2–3 partner/outreach actions; AI-visibility report. Later: Merchant Center feed, workshops, AR, on-site assistant. |

Timing tip: launch the first seasonal page 6–8 weeks before the next big season. If you start in the fall, ship the Noël / bûches pre-order page first, even before the full site.

| KPI | 6-month target (calibrate after baseline) |
|---|---|
| Geogrid rank on 10 core terms | Top 3 across Granby |
| AI mention rate (20 prompts × 4 engines) | Majority of prompts |
| GBP actions (calls, directions, clicks) | Steady month-over-month growth |
| Custom cake requests via builder vs DMs | > 70 % via builder |
| New Google reviews per month | 2–3× baseline |
| Core Web Vitals (mobile) | 100 % "good" |

## 11. Pitfalls that would sabotage SEO/GEO/AEO

- Menu as a PDF or image, or prices hidden.
- Client-side-only rendering, or Instagram widgets instead of real HTML.
- Keywords stuffed into the GBP name.
- Fake, incentivized or gated reviews.
- Cloned city pages.
- A new seasonal URL every year.
- Automatic language redirects, or English more complete than French.
- 5 MB hero videos and bloated page builders.
- Different hours on Google, Facebook and the site.
- A CDN or firewall silently blocking AI crawlers.

## 12. Horizon: AI agents that order for people

AI agents are starting to complete purchases on users' behalf. One example is the Agentic Commerce Protocol from OpenAI and Stripe (2025), which is still early and US-first.

Don't build for it yet; just don't block it:

- semantic, well-labelled forms
- stable URLs
- a structured product feed
- public menu, hours and availability JSON

Later, consider MCP- or NLWeb-style endpoints so assistants can query availability directly.

## 13. What we need from the owner, and what I can produce next

Needed:

- Official name as on the sign (Coco Vanille or Cocovanille), address, phone, hours and holiday habits.
- The in-store POS (Square, Lightspeed, Clover, Shopify?) and payment provider.
- Full menu: prices, sizes and portions, lead times, allergens, daily vs seasonal items.
- Kitchen capacity and peak days; whether they deliver, and the zones and fees.
- Access to GBP, Facebook and Instagram business accounts, and any existing domain or site.
- Logo, best photos, chef bio and founding story.
- Who will update the site day to day, plus a budget range.
- Top competitors, and three sites they love.

Next deliverables I can produce:

- full FR/EN keyword map
- complete schema @graph
- wireframes for home, product, builder, checkout and admin
- PRD and user stories for the slot engine and the builder
- 12-month content calendar
- GBP checklist
- AI prompt-panel template

## TL;DR: the 10 moves that matter most

1. Unify the name (Coco Vanille vs Cocovanille) and keep NAP consistent everywhere.
2. Max out GBP, and claim Apple Business Connect and Bing Places.
3. Run a review engine (QR code on every box, SMS after pickup) and reply to every review.
4. Server-render an HTML menu with prices, lead times and allergens.
5. Generate the schema graph from the CMS so there is one source of truth.
6. Write answer-first pages built on real customer questions, in Québec French.
7. Keep evergreen seasonal hubs and put them live 6–8 weeks ahead.
8. Build ordering that respects kitchen capacity and lands on the POS.
9. Ship a custom cake builder that ends the DM chaos.
10. Run the monthly AI-visibility panel and do citation-gap outreach.
