# Coco Vanille: Multilingual Layer and Full Local-Domination Strategy (Granby)

> Stored as provided by Yahya on 2026-10-25. Formatting only; content unchanged. Claims are reviewed in research/12-plan-review.md and research/18-dated-claims-verification.md.
>
> Note: some code samples in the original are TypeScript; new code for this project is JavaScript only.

This plugs into the previous plan and adds two things:

- A trilingual site (FR, EN, ES), in tiers and compliant with Loi 96.
- The strategy layer: positioning, audiences, the query universe, 8 foundations, and an operating system (90 days, 12 months, routines, KPIs).

Items marked [verify] need checking with the owner or with local data.

## 0. What "dominating Granby" means (definition of done, month 12)

| Surface | Target (calibrate after the baseline audit) |
|---|---|
| Google Maps / local pack | Top 3 on ≥ 80% of geogrid points across Granby for 10 core French terms; #1 around the shop |
| Organic results | #1 for 25+ local commercial queries across FR / EN / ES |
| AI answers (ChatGPT, Perplexity, Gemini, AI Overviews / AI Mode, Copilot) | Named in most of 30 tracked prompts in 3 languages, described with our 3 chosen attributes |
| Reputation | The most-reviewed, highest-rated pâtisserie in Granby, with new reviews every week |
| Search results page (SERP) real estate | 6+ of the 10 first-page results for "Coco Vanille" and "pâtisserie Granby" are ours or positive mentions |
| Third-party lists | Present in every local "best of", tourism guide and wedding vendor list that AI engines cite |

## PART A: Multilingual foundation

### A1. Language strategy (tiered and data-driven)

| Tier | Language | Scope | Why it pays in Granby |
|---|---|---|---|
| 1 | Français | 100%: default at the root, legal reference | Majority market; required by Loi 96 |
| 2 | English | Full mirror of commercial pages + main guides | See below |
| 3 | Español | ~15–20 core pages | See below |
| 4 | Others | Landing page + FAQ only | Only if data shows demand (e.g., Arabic, Ukrainian, Portuguese) |

Why English:

- the Townships' anglophone community
- Ontario and US tourists (Zoo, Bromont, less than an hour from Vermont)
- AI prompts typed in English

Why Spanish:

- Granby has welcomed a sizeable Latin American community (notably Colombian) for 20+ years [verify with the 2021 census and customer data].
- There is near-zero competition, so first-place rankings come fast.
- Core pages: home, order, birthday, custom, wedding, quinceañera, macarons, Noël, allergies, visit, about, FAQ.

Rules:

- Loi 96 parity:
  - French is the default and the reference.
  - Every EN or ES page needs a French equivalent that is at least as complete.
  - No content or deal may exist only in EN or ES.
- Rule for adding a language. Add it only if all three are true:
  - Demand: census data, browser languages in analytics, Search Console queries, customer requests.
  - Serviceability: someone can answer messages and serve customers in that language.
  - Maintainability: the content can be kept up to date.
- Honesty:
  - Write "Hablamos español" only if staff actually speak it.
  - Otherwise write "Pedidos en línea en español" (ordering available in Spanish).

### A2. Keyword universe by language (translate intent, not words)

| Intent | Français (QC) | English | Español |
|---|---|---|---|
| Category | pâtisserie Granby · pâtisserie près de moi | bakery Granby · pastry shop near me | pastelería en Granby · pastelería cerca de mí |
| Birthday | gâteau de fête Granby · gâteau d'anniversaire | birthday cake Granby | pastel / torta de cumpleaños Granby |
| Custom | gâteau personnalisé Granby | custom cake Granby | pastel personalizado Granby |
| Wedding | gâteau de mariage Cantons-de-l'Est | wedding cake Eastern Townships | pastel de boda · torta de matrimonio |
| Milestones | baptême · première communion | christening · first communion cake | quinceañera · primera comunión · bautizo |
| Seasonal | bûche de Noël Granby | yule log Granby | tronco navideño |
| Diet | gâteau sans gluten Granby | gluten-free bakery Granby | pastel sin gluten Granby |
| Practical | pâtisserie ouverte dimanche | bakery open Sunday Granby | pastelería abierta el domingo |
| Tourism | café près du Zoo de Granby | coffee near Granby Zoo | dónde comer cerca del Zoo de Granby |

Localization traps:

- Spanish varies by country.
  - In Colombia, "torta" or "ponqué" means cake.
  - In Mexico, "torta" means a sandwich, and cake is "pastel".
  - Use both in titles ("Pasteles y tortas de cumpleaños") and match the community you actually serve.
- Québec French: "gâteau de fête", "chocolatine", "cueillette", "14 h".
- Canadian English: "flavour", "colour", "centre".
- Ignore "0–10 searches/month" in keyword tools. They under-report small cities and AI prompts, and a single wedding-cake query can be worth a several-hundred-dollar order.

### A3. Technical architecture

URL structure: one domain with subfolders: / (FR), /en/, /es/.

No subdomains, no ?lang= parameters, no separate domains: authority stays consolidated.

Slugs: translated, ASCII-only (ñ becomes n). One intent equals one page per language, which prevents pages competing with each other.

| Intent | FR | EN | ES |
|---|---|---|---|
| Home | / | /en/ | /es/ |
| Order | /commander/ | /en/order/ | /es/pedidos/ |
| Birthday | /gateaux-de-fete/ | /en/birthday-cakes/ | /es/pasteles-de-cumpleanos/ |
| Custom | /gateaux-personnalises/ | /en/custom-cakes/ | /es/pasteles-personalizados/ |
| Wedding | /gateaux-de-mariage/ | /en/wedding-cakes/ | /es/pasteles-de-boda/ |
| Quinceañera | /gateaux-quinceanera/ | /en/quinceanera-cakes/ | /es/pasteles-de-quinceanera/ |
| Christmas | /buches-de-noel/ | /en/yule-logs/ | /es/troncos-de-navidad/ |
| Allergies | /sans-gluten-allergies/ | /en/gluten-free-allergies/ | /es/sin-gluten-alergias/ |
| Visit | /nous-trouver/ | /en/visit/ | /es/como-llegar/ |
| About / facts | /a-propos/ | /en/about/ | /es/nosotros/ |
| FAQ | /faq/ | /en/faq/ | /es/preguntas-frecuentes/ |

hreflang rules:

- Use language-only codes (fr, en, es) plus x-default pointing to French.
- This refines the earlier plan: with one version per language, it ensures US tourists get English.
- Each page references itself, and every version links back to the others.
- Link only true equivalents.
- The canonical is the page itself in every language. Never point EN or ES canonicals to French.

```html
<!-- On /gateaux-de-fete/ — same alternate set on all 3 versions; canonical = the page itself -->
<html lang="fr-CA">
<link rel="canonical" href="https://VOTREDOMAINE.ca/gateaux-de-fete/">
<link rel="alternate" hreflang="fr" href="https://VOTREDOMAINE.ca/gateaux-de-fete/">
<link rel="alternate" hreflang="en" href="https://VOTREDOMAINE.ca/en/birthday-cakes/">
<link rel="alternate" hreflang="es" href="https://VOTREDOMAINE.ca/es/pasteles-de-cumpleanos/">
<link rel="alternate" hreflang="x-default" href="https://VOTREDOMAINE.ca/gateaux-de-fete/">
```

Generate hreflang from the CMS. Framework plugins can't pair translated slugs automatically, so build the links from each page's "translation group":

```ts
// astro.config.mjs — FR at root, /en/ and /es/
export default defineConfig({
  site: 'https://VOTREDOMAINE.ca',
  i18n: { defaultLocale: 'fr', locales: ['fr', 'en', 'es'], routing: { prefixDefaultLocale: false } },
});

// hreflang.ts — one call per page, using the docs of its translation group
type Locale = 'fr' | 'en' | 'es';
type PageDoc = { locale: Locale; slug: string }; // slug '' = home
const BASE = 'https://VOTREDOMAINE.ca';

const urlOf = ({ locale, slug }: PageDoc) => {
  const path = [locale === 'fr' ? '' : locale, slug].filter(Boolean).join('/');
  return `${BASE}/${path}${path ? '/' : ''}`;
};

export function hreflangLinks(group: PageDoc[]) {
  const links = group.map((p) => ({ hreflang: p.locale, href: urlOf(p) }));
  const fr = group.find((p) => p.locale === 'fr');
  if (fr) links.push({ hreflang: 'x-default', href: urlOf(fr) });
  return links; // only languages that truly exist → no broken alternates
}
```

Schema per language.

- Every language page carries the full Bakery block with the same @id, so Google sees one entity. Only the description is translated.
- Add inLanguage on each WebPage.
- Only list Spanish in availableLanguage if someone truly serves in Spanish.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://VOTREDOMAINE.ca/es/pasteles-de-cumpleanos/#webpage",
      "url": "https://VOTREDOMAINE.ca/es/pasteles-de-cumpleanos/",
      "name": "Pasteles y tortas de cumpleaños en Granby",
      "inLanguage": "es",
      "about": { "@id": "https://VOTREDOMAINE.ca/#patisserie" }
    },
    {
      "@type": "Bakery",
      "@id": "https://VOTREDOMAINE.ca/#patisserie",
      "name": "Pâtisserie Coco Vanille",
      "description": "Pastelería artesanal en Granby (Quebec): pasteles personalizados, pasteles de boda y macarons. Pedidos en línea y recogida en tienda.",
      "knowsLanguage": ["fr", "en", "es"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+1-450-000-0000",
        "availableLanguage": ["French", "English", "Spanish"]
      }
    }
  ]
}
```

Language switcher UX:

- Show language names in their own language: Français · English · Español.
- No flags: flags represent countries, not languages.
- Link to the equivalent page; if there is none, link to that language's home with a short note.

No automatic redirects by IP or browser language. At most, show a dismissible suggestion banner.

Fonts must cover Latin Extended characters (é ç ñ ü ¿ ¡), including in the cake-message preview.

### A4. Translation and content operations

- French is the source. English and Spanish are transcreated (adapted, not translated word for word) by native speakers, ideally from the community.
- Glossary:
  - Signature product names stay French (part of the charm), with a descriptor: "Fraisier — strawberry cream cake / pastel de fresas y crema".
  - Units: "8 po (20 cm)" / "8-inch (20 cm)" / "8 pulgadas (20 cm)".
  - Allergen terms are translated professionally. This is safety-critical.
- Facts are data fields, not text. Prices, hours, lead times, portions and allergens are rendered in every language from the same fields, so the versions can never drift apart.
- AI drafts, human review. Use DeepL or an LLM with the glossary, then always have a person review. Google's "scaled content abuse" policy targets low-value auto-generated pages, not reviewed translations.
- Translation freshness. When a French page changes, the EN/ES versions are automatically flagged "à mettre à jour", and a dashboard lists stale pages.
- Native extras per language. Each FAQ is written for its audience, not just translated:
  - ES: "¿Hacen tres leches?" · "¿Hablan español?"
  - EN: "How far are you from the Granby Zoo?"

### A5. Multilingual ordering experience

- Language follows the order. The chosen language persists through the box and checkout and is stored on the order. Confirmation email, SMS, order tracker and review request all go out in that language.
- Staff dashboard shows a language badge (FR / EN / ES) on each order so the counter greets customers correctly.
- Local formats via Intl:

  | | Price | Time | Date |
  |---|---|---|---|
  | French | 12,50 $ | 14 h | samedi 14 décembre |
  | English | $12.50 | 2 p.m. | Saturday, December 14 |
  | Spanish | — | — | sábado 14 de diciembre |

- Legal pages:
  - French is authoritative; translations carry "the French version prevails".
  - Terms are presented in French first.
- Internal admin in French (plus English or Spanish if the staff need it).

### A6. Multilingual Maps, reviews and social

- Google Business Profile:
  - The name is never translated. The description is in French, plus one true line on languages: « On vous sert aussi en anglais · We also serve you in English · También le atendemos en español ».
  - Posts are mostly French, English during tourist season, and Spanish around cultural moments.
- Reply to reviews in the reviewer's language:
  - FR: « Merci Julie ! Tellement contents que le fraisier ait fait sensation à la fête de Léa. Au plaisir ! — L'équipe Coco Vanille »
  - EN: "Thanks Mark! So glad the macarons survived Zoo day. See you next time in Granby! — The Coco Vanille team"
  - ES: "¡Gracias, Camila! Nos alegra que la torta de quinceañera haya encantado a todos. ¡Los esperamos pronto! — El equipo de Coco Vanille"
- Review requests in the order's language. Under CASL, a purchase within the past 2 years gives implied consent; always include sender identification and an opt-out.
  - FR: « Merci d'avoir choisi Coco Vanille ! Votre avis Google nous aide énormément : [lien] — dites-nous ce que vous avez goûté. »
  - EN: "Thanks for choosing Coco Vanille! A quick Google review helps us a lot: [link] — tell us what you tried."
  - ES: "¡Gracias por elegir Coco Vanille! Una reseña en Google nos ayuda muchísimo: [enlace] — cuéntanos qué probaste."
- Instagram and Facebook:
  - French first, then English (and Spanish when relevant); French at least as prominent [verify with OQLF guidance].
  - Bio: "FR · EN · ES".

### A7. Multilingual GEO and AEO

- AI assistants answer in the user's language. Native pages with the same facts raise the odds of being cited, and of being quoted correctly.
- Publish a fact sheet (« Coco Vanille en bref ») in all 3 languages.
- llms.txt gets 3 language sections.
- The AI prompt panel runs in all 3 languages (see B7).

## PART B: The 8 foundations of local domination

### B0. Strategic core

#### Positioning sentence

Use it word for word everywhere: site, Google profile, directories, press kit, social bios. Adapt it once the 3 attributes are chosen.

- FR: « Pâtisserie Coco Vanille est une pâtisserie artisanale de Granby (Cantons-de-l'Est), reconnue pour ses gâteaux personnalisés, ses gâteaux de mariage et ses créations à la vanille — commande en ligne et cueillette en boutique. »
- EN: "Pâtisserie Coco Vanille is an artisan pastry shop in Granby, Québec (Eastern Townships), known for custom cakes, wedding cakes and vanilla-forward creations — order online, pick up in store."
- ES: "Pâtisserie Coco Vanille es una pastelería artesanal en Granby, Quebec, conocida por sus pasteles personalizados, pasteles de boda y creaciones a base de vainilla. Pedidos en línea y recogida en tienda."

#### Consensus engineering

AI engines summarize what the web agrees on.

Step 1: find the 3 attributes.

- Export the Google reviews and cluster the praised themes with an LLM.
- Pick the 3 strongest, for example:
  - spectacular custom cakes
  - real vanilla / quality ingredients
  - warm welcome and easy ordering

Step 2: seed those exact attributes everywhere:

- site copy
- Google profile and product descriptions
- review prompts
- press pitches
- partner pages and bios

Repetition across independent sources is what makes AI repeat them.

#### Audience segments

| Segment | Language | Needs | Hook |
|---|---|---|---|
| Local families | FR | Birthday cakes, weekend treats | Cake builder, smash cakes, flavour of the week |
| Couples (regional) | FR / EN | Wedding cakes, tastings | Real weddings, tasting box, per-portion pricing |
| Offices | FR | Meeting boxes, client gifts | Corporate page, recurring orders, invoices |
| Tourists, day-trippers | FR / EN | "Near me", "open now", a treat after the Zoo or the Estriade trail | Visit page, picnic boxes, excellent Maps listings |
| Anglophone Townshippers | EN | Same as families | Full English mirror, English reviews |
| Latin American and newcomer families | ES (+FR) | Birthdays, quinceañeras, communions | Spanish pages, cultural calendar, community partners |
| Students (Cégep de Granby) | FR | Affordable, photogenic treats | Limited drops, Instagram / TikTok |
| Dietary and cultural needs | All | Gluten-free, allergies, no pork gelatin, no alcohol | Transparent ingredient pages |

#### Moments that matter

| Moment | Typical query / prompt | Surface | Asset that wins |
|---|---|---|---|
| "Cake for Saturday" | gâteau de fête / birthday cake / torta de cumpleaños Granby | Local pack, AI | Google products + birthday page + builder |
| "Open now, near me" | pâtisserie ouverte · bakery near me · pastelería cerca de mí | Maps, Siri, AI | Exact hours on Google / Apple / Bing + live "Ouvert" badge |
| "Treat after the Zoo" | café près du Zoo de Granby · near Granby Zoo | Maps, AI | Visit page + Zoo guide + TripAdvisor |
| "Planning the wedding" | gâteau de mariage Cantons-de-l'Est | Organic, AI, Pinterest | Wedding hub + real weddings + vendor lists |
| "Allergy-safe" | gâteau sans arachides · nut-free cake Granby | AI, organic | Allergen page + per-product allergen data |
| "Quinceañera" | pastel de quinceañera Granby | Organic, AI | Spanish page + FR / EN equivalents |
| "Christmas" | bûche de Noël Granby | Organic, local pack | Evergreen seasonal hub, live by October |

### B1. Entity and brand search results

- IDs already in your Maps URL:
  - Google CID: 10789122976114705165
  - Knowledge Graph ID: /g/11s3b_3rsh
  - Add https://www.google.com/search?kgmid=/g/11s3b_3rsh to sameAs, and the CID map link to hasMap. This ties the site to the Google entity.
- Brand search audit. Search these and list what ranks:
  - "Coco Vanille"
  - "Cocovanille"
  - "Coco Vanille Granby"
  - "Pâtisserie Coco Vanille"
- The goal is 6+ of 10 results that are ours or positive:
  - site with sitelinks
  - Google profile panel
  - Instagram and Facebook
  - TripAdvisor, Yelp, PagesJaunes
  - a press article
  - YouTube and Pinterest
- Ask the AI engines « Que sais-tu de la Pâtisserie Coco Vanille à Granby ? » in FR, EN and ES, then fix gaps through the fact sheet and third-party sources.
- Disambiguation: always write "Coco Vanille + Granby".
- Wikidata: only if the shop is genuinely notable with real press coverage; otherwise skip.

### B2. Map ecosystem (Google, Apple, Bing)

Google ranks local results on relevance, distance and prominence. You can't move the shop, but maximum relevance and prominence widen the radius where you win:

- Inner ring (~0–2 km): win the local pack.
- City ring (all of Granby): prominence and relevance.
- Outer ring (Bromont, Waterloo, Shefford): win through organic and AI content (weddings, delivery), not the pack.

| Element | Standard to beat local competitors |
|---|---|
| Completeness | 100% of fields, logo, cover, attributes |
| Categories | Correct primary + only true secondaries; re-check yearly against top competitors |
| Products | Every best-seller and seasonal item, with photo, price and tracked link |
| Photos | Owner uploads weekly: products, team, storefront, interior, packaging |
| Posts | 1–2 per week |
| Special hours | Every Québec holiday set at least 2 weeks ahead |
| Links | Website, order and menu links, all tracked with UTM parameters |
| Video | A few short clips: the cake cut, decorating, the storefront |

Local justifications. Google shows lines such as "Their website mentions gâteau sans gluten", "Reviews mention macarons", or "Sells: bûche de Noël". Engineer them through:

- products in the Google profile
- the right terms on site pages
- review topics

Apple Business Connect:

- Showcases for seasonal pre-orders
- an "Order" action link
- accurate hours, which Siri and Apple Maps use

Bing Places: keep it synced; it feeds Copilot.

### B3. Reputation engine

Collection mechanics:

- QR code on every box
- counter card
- SMS 24 hours after pickup, in the customer's language

Targets:

- rating ≥ 4.8
- review velocity ≥ 1.5× the fastest competitor
- never a week without a new review
- 100% of reviews answered within 48 hours

Content:

- The request asks "tell us what you chose", so product keywords end up in reviews.
- Those keywords feed local justifications and the 3 AI attributes.

Languages: invite EN and ES customers to review in their own language. It builds relevance for queries in those languages and gives AI richer summaries.

Platforms:

- Google first
- Facebook recommendations
- TripAdvisor for tourists
- Yelp: never solicit (against Yelp's rules)

Rules and routine:

- Never offer customers incentives and never ask only happy customers (both against Google policy).
- For a bad review: reply fast, take it offline, fix the issue, follow up.
- Post the weekly review count on the kitchen board.

### B4. Website as entity home and conversion engine

Covered by the previous plan:

- server-rendered pages
- schema graph
- speed
- ordering

Added here:

- Coverage matrix: the A3 table; one intent equals one page per language.
- Internal linking: every hub links to its spokes, and every page links to its language versions.
- Search Console: add separate properties for /en/ and /es/ for clean per-language reporting.

### B5. Content moat

| Content pillar | FR | EN | ES |
|---|---|---|---|
| Occasions (birthday, custom, milestones) | ✓ | ✓ | ✓ (+ quinceañera, communions) |
| Weddings | ✓ | ✓ | Core page |
| Seasonal (Noël, Pâques, Valentine's…) | ✓ | ✓ | Navidad + key moments |
| Dietary and allergies | ✓ | ✓ | ✓ |
| Savoir-faire and guides (portions, vanilla…) | ✓ | Main guides | — |
| Local (Zoo, Estriade, producers) | ✓ | ✓ (tourists) | Visit page |

Pace:

- French: 2–4 pieces per month.
- English: mirrored within 2 weeks.
- Spanish: new subset pages quarterly.
- Refresh the top 20 pages quarterly; seasonal hubs yearly, always at the same URL.

### B6. Local authority graph

| Tier | Where |
|---|---|
| Core | Google, Apple Business Connect, Bing Places, Facebook, Instagram, Yelp, TripAdvisor, Foursquare, PagesJaunes |
| Québec / regional | Tourisme Cantons-de-l'Est, local tourism office, Chambre de commerce Haute-Yamaska, Le Panier Bleu, Aliments du Québec (if eligible), wedding vendor directories |
| Community | See below |
| Media | La Voix de l'Est, regional radio / TV, Estrie food creators |

Community tier:

- Festival international de la chanson de Granby
- Cégep de Granby
- schools and sports clubs
- Townshippers' Association
- newcomer-support organizations (e.g., SERY) and Latin American community groups

Tools: audit and clean up citations with Whitespark (Canadian, strong Canadian data) or BrightLocal.

"Barnacle" SEO. Get onto pages that already rank, such as "best bakeries in Granby" lists on TripAdvisor, Yelp, blogs and tourism sites:

- get listed and collect reviews there;
- pitch blog authors to include you.

Press: 4 story pitches per year:

- anniversary
- new signature creation
- anti-waste initiative
- year-end numbers ("X bûches")

Linkable assets (others will link to them):

- portion guide
- Québec celebrations calendar
- local producers map
- real weddings with photographer and venue credits

### B7. AI visibility system

Prompt panel: 30 prompts (15 FR, 10 EN, 5 ES), run monthly across all engines. Examples:

- « Quelle est la meilleure pâtisserie à Granby ? »
- « Où commander un gâteau de fête personnalisé à Granby pour samedi ? »
- « Quelles pâtisseries recommandes-tu pour un gâteau de mariage dans les Cantons-de-l'Est ? »
- "Best bakery in Granby, Quebec?"
- "Where to grab coffee and pastries near the Granby Zoo?"
- "¿Dónde comprar una torta de cumpleaños en Granby, Quebec?"
- "¿Qué pastelería hace pasteles de quinceañera en Granby?"

What to record for each prompt:

- Are we mentioned, and at what position?
- Are our 3 attributes repeated?
- Which sources are cited?
- Any factual errors?

Correction protocol:

- When an engine states a wrong fact, find the source (often an outdated directory).
- Fix it at the source.
- Resubmit: IndexNow / Bing URL submission, plus Search Console inspection.
- Recheck in 30 days.

AI-ready assets:

- fact sheets ×3
- FAQs ×3
- press kit
- menu / hours feeds
- llms.txt

Monitoring: Google Alerts and Talkwalker Alerts for "Coco Vanille" Granby.

### B8. Competitive intelligence and search-results saturation

Competitor gap template:

| Metric | Us | Comp. A | Comp. B | Comp. C | Target |
|---|---|---|---|---|---|
| Categories (primary / secondary) | | | | | |
| Reviews (count · ★ · new per month) | | | | | |
| Photos / posts per month | | | | | |
| Relevant site pages · schema · speed | | | | | |
| Local referring domains · citations | | | | | |
| Languages online | | | | | Likely only us with ES |
| Online ordering | | | | | |
| AI mentions (x / 30) | | | | | |

Search-results real estate to own:

| Query | Slots to own |
|---|---|
| pâtisserie Granby | See below |
| gâteau de mariage Cantons-de-l'Est | Wedding hub · real-wedding features on venue and photographer sites · vendor directories · Pinterest |
| birthday cake Granby | Local pack · English page · TripAdvisor / Yelp · English reviews |
| torta / pastel de cumpleaños Granby | Spanish page (probably the fastest #1 in the plan) · Google profile · community groups |

For "pâtisserie Granby":

- local pack #1
- site #1 with sitelinks
- Facebook and Instagram
- TripAdvisor, Yelp, PagesJaunes
- a press article
- a tourism listing
- images

## PART C: Operating system

### C1. 90-day sprint

Days 1–14: Foundations

- Lock the name and the positioning sentence in 3 languages.
- Choose the 3 attributes from review mining.
- Optimize Google, Apple and Bing profiles.
- Run the citation audit.
- Launch the review engine.
- Take baselines: geogrid, AI panel ×3 languages, competitor gap, brand search results.
- Confirm the language tiers.
- Build the keyword universe in FR / EN / ES.
- Run the photo shoot.

Days 15–45: Build

- Site MVP in French with the English mirror.
- Spanish core pages.
- hreflang and schema for each language.
- Ordering in 3 languages.
- Analytics with a language dimension.
- Translation workflow in the CMS.

Days 46–90: Amplify

- 8–12 answer-first pages (French, then English; 5 in Spanish).
- Next seasonal hub live.
- 10 partner outreaches and 3 press pitches.
- Barnacle listings.
- Review push.
- First AI correction cycle.
- Month-3 report.

### C2. 12-month calendar

| Month | FR / Québec | EN (tourism, Townships) | ES (community) |
|---|---|---|---|
| Jan | Galette des rois · wedding planning content | Wedding planning | Rosca de Reyes crossover (Jan 6) |
| Feb | Saint-Valentin | Valentine's | San Valentín |
| Mar | Temps des sucres | Maple / sugar-shack season | — |
| Apr | Pâques | Easter | First-communion season begins |
| May | Fête des Mères · weddings | Mother's Day | Día de la Madre (Colombia: same Sunday; Mexico: May 10) |
| Jun | Fête des Pères · Fête nationale · bals de finissants | Zoo season · picnic boxes | Graduations |
| Jul | Vacances de la construction · Estriade | Peak tourism | Summer birthdays |
| Aug | Weddings peak | Tourism | — |
| Sep | Rentrée · corporate | Fall foliage | Amor y Amistad (Colombia, 3rd Saturday) |
| Oct | Action de grâce · Halloween · Christmas page live | Foliage · Thanksgiving | — |
| Nov | Bûche pre-orders · corporate gifts · gift cards | Holiday gifting | Navidad pre-orders |
| Dec | Bûches · Réveillon · year recap for press | Holidays | Día de las Velitas (Dec 7) · Novena (Dec 16–24) |

### C3. Routines and roles

| Rhythm | Who | Tasks (time) |
|---|---|---|
| Daily | Counter staff | Update the display-case page, mark sold-outs, answer messages (10 min) |
| Weekly | Owner + marketing | 1–2 Google posts, reply to every review in its language, upload 5–10 photos, check that review requests went out (45 min) |
| Monthly | Marketing | See below (½–1 day) |
| Quarterly | Marketing + dev | Citation audit, schema / hreflang validation, Core Web Vitals, refresh top 20 pages, seasonal photo shoot |
| Yearly | Everyone | Refresh seasonal hubs, review categories and positioning, review language tiers (add or drop) |

Monthly marketing tasks:

- 2–4 content pieces (French, then English, then the Spanish subset)
- AI prompt panel ×3 languages
- geogrid check
- competitor check
- 3–5 outreach actions
- translation-freshness check
- KPI report

### C4. KPI dashboard (split by FR / EN / ES where possible)

| Foundation | KPIs |
|---|---|
| Maps | Average geogrid rank and % of points in the top 3 · Google calls, direction requests, website clicks |
| Organic | Search Console clicks / impressions per language folder · number of #1 rankings |
| AI | Mention rate per engine and language · how often our 3 attributes are repeated · visits referred by AI assistants |
| Reputation | Reviews per month · rating · % mentioning products · % answered within 48 h · reviews per language |
| Authority | Local referring domains · citation consistency · press mentions |
| Business | Orders and revenue per language · builder requests · wedding leads · % of revenue online |

### C5. Guardrails

- Loi 96:
  - French is complete and comes first.
  - No content or offers only in EN or ES.
  - Terms are presented in French first.
- Languages: never claim a language you can't serve.
- Translation quality: human-reviewed translations; allergens translated professionally.
- Facts: one source of truth in the CMS, rendered in every language.
- Never do these:
  - stuff keywords into the Google business name
  - post fake, incentivized or filtered reviews
  - create cloned city pages
- Loi 25: choose providers with a Montréal data region (e.g., AWS ca-central-1). Personal data then stays in Québec, which simplifies the privacy assessments.

## Decisions needed this week

- The official spelling as it appears on the sign: Coco Vanille or Cocovanille.
- Confirm the language tiers: do they serve Spanish-speaking customers today, and who would answer Spanish messages?
- The 3 attributes, after mining the Google reviews.
- Which point-of-sale system they use in store.
- Access to the Google profile, Instagram and Facebook so the baseline audit can start.

Possible next steps:

- the full FR / EN / ES keyword map with search results checked from Granby
- the trilingual fact sheet and FAQs
- the 30-prompt AI panel template, ready to run
