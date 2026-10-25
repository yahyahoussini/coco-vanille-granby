# Coco Vanille × The Ranking Stack — Integrated Build and SEO · AEO · GEO Plan (v1, owner's research)

> Stored as provided by Yahya on 2026-10-25. Only fixes: words split by copy-paste were rejoined, and the `||` operators lost in the JavaScript snippet were restored. The snippet was truncated in the original; the cut point is marked. Everything else is verbatim in substance. Review and corrections live in `research/12-plan-review.md`.

The Ranking Stack is now the backbone of the plan. Each of its 21 layers gets:

- a Coco Vanille adaptation,
- a gate (its "Done when" checklist, which passes or fails),
- a check (a rank-first script, a Studio job or a manual sign-off),
- a week in the timeline.

Adaptations from the stack's Moroccan example (Atlas Location):

- Languages: FR/AR/Darija becomes FR/EN/ES.
- Law: Moroccan Laws 09-08 and 31-08 become Loi 25, the LPC and the Competition Act, plus Loi 96 and CASL.
- Trademarks: OMPIC becomes CIPO.
- Main call to action: WhatsApp-first becomes order-online-first (WhatsApp only on Spanish pages).
- Directories, media and seasonal calendar are swapped for Québec equivalents.
- Where the stack and Québec rules differ, Québec rules win.

Note on facts: the stack's dated facts (December 2025 to September 2026) are newer than my training data. I've adopted them as given and applied its corrections to our earlier plan (§16). Items marked [verify-CA] must be confirmed for Canada before the baseline week.

## 0. What changes in our plan

- "First" is measured, not claimed. We use the stack's definition, measured on 30 fixed prompts over four weekly runs in a row (§1, §5).
- SEO-first build order.
  - The content site (Levels 101–201) goes live by week 6.
  - Ordering and Coco Studio follow by weeks 12–14.
  - The domain starts getting crawled and indexed two months earlier.
- All 21 gates are in the backlog. Each layer's "Done when" becomes an acceptance criterion. Most run as rank-first scripts in CI or as Studio jobs.
- Off-site work becomes the main budget line: mentions, "best of" lists, YouTube, data studies (§8).
- Studio gains seven stack modules: Gates, Scoreboard, Battle map, Snippet loop, Mentions, Own data, Diagnostics (§12).
- rank-first gets a Québec localization patch (§13).
- Corrections to the earlier plan are listed in §16.

## 1. The three scoreboards: what "first" means for Coco Vanille

| Scoreboard | First means (4 weekly runs in a row) | Measured with |
|---|---|---|
| SEO | Position 1 on ≥ 10 of the 20 commercial + local prompts; top 3 on the rest; map pack held on the local prompts | Search results API set to Granby; phone checks in Granby; Search Console; Local Falcon grid |
| AEO | Our passage owns the featured snippet, a "People also ask" (PAA) answer or the AI Overview citation on ≥ 10 of 30 prompts | Search results API (snippet, PAA, AI Overview sources); Search Console Generative AI report |
| GEO | Brand cited on ≥ 15 of 30 prompts in ≥ 2 AI engines, and ours is the most-cited domain in the category | ai-runs.mjs (ChatGPT, Perplexity, Gemini, Claude, Copilot); Bing AI Performance |

The Layer 12 local grid (top 3 across Granby) stays as an extra local gate.

When all three hold, widen by one step, in this order:

1. the wider category ("pâtisserie Granby", viennoiseries)
2. a nearby city (Bromont, only with real delivery and local proof)
3. a deeper Spanish tier, or a fourth language

## 2. The stack's "truth first" facts, applied to Granby

| Stack truth | What it means for Coco Vanille |
|---|---|
| Nobody can promise position 1 | The contract promises the process, the gates and the weekly scoreboard |
| Google is the market | See below |
| Most AI answers are Google's | AI Overviews and AI Mode [verify-CA: available in French and English?]; winning Google is most of AEO and much of GEO |
| Clicks are shrinking | Reports count orders, quote requests, calls, direction requests and citations, not sessions |
| Ranking doesn't decide citation alone | A page at position 15 can be cited if it has the best passage, so passage quality matters on every page |
| The biggest cost is off-site | Brand mentions correlate 0.664 with AI visibility vs. 0.218 for backlinks; press, lists, YouTube and partners get the biggest budget |
| AI "hacks" don't hold | No AI-only tricks; the old work done better |
| Timeline | Early signals move in weeks; orders and leads in months; a new domain takes months |

Google is the market, but Canada differs from Morocco:

- Bing is a stronger second engine [verify-CA: StatCounter Canada].
- Canada is iPhone-heavy, so Apple Maps matters.
- Work order: Maps (Google, Apple, Bing) and Google Search first → answer boxes → other AI engines.

## 3. Merged master timeline: ranking track × product track

| Weeks | Ranking track (stack layers) | Product track | Gate to pass |
|---|---|---|---|
| 1–2 · Measure & set up | L1, L5, L7, L8 (+ L6, L16, L20 setup) | Code repository; CI running `npm run gate`; Payload content model; design system v0; tracking plan + consent banner; holding page with robots.txt and sitemap if the domain is new | See below |
| 3–6 · Build the pages | L2–L4, L9–L11 | Content site v1 live: see below | See below |
| 7–10 · Win the surfaces | L12–L15 | Ordering engine (matched to the existing point-of-sale system), checkout, server-side events; Studio v1 (Catalogue, Business info synced to Google profile, Reviews inbox with 24-hour timer, Gates, Scoreboard, Battle map) | See below |
| 11–12 · Re-baseline & scale | L17, L21 (+ L18) | Online ordering live; Monday report; Data Studio dashboard; Merchant Center feed | See below |
| 13–18+ | Weekly rhythm + L19 depth | Cake builder, wedding funnel, automated AI visibility tracking, Snippet loop and Mentions modules, Copilot, ads connectors | Definition of first held for 4 weeks → widen one step |

Weeks 1–2 gate:

- Baseline recorded: 30 prompts in Google + 5 AI engines
- Search Console and Bing verified; IndexNow key installed
- No crawler blocked
- Category sentence in FR/EN/ES, with 5 competitors named
- Battle map written for the 10 priority prompts
- Name, address, phone (NAP) identical on 10 profiles; Google profile name in one language only
- Refused-tactics clause signed

Weeks 3–6, content site v1 includes:

- home, pillar page, 8 cluster pages
- prices page, comparison page, portion calculator
- About and chef pages, visit page, legal pages
- French and English, plus the core Spanish pages
- GA4 with key events
- a temporary order path: phone + a request form with labelled fields
- the Google profile's website link pointed to the new site (with UTM tags)

Weeks 3–6 gate:

- audit.mjs shows 0 failures; render-diff shows no gap
- Core Web Vitals green on home and pillar
- Pillar and 8 clusters live; content-gap "beat score" ≥ 80
- ≥ 3 internal links pointing to each page
- Key events firing
- 5 link requests sent
- Key pages indexed in Google and Bing

Weeks 7–10 gate:

- Google profile complete and owned by the bakery
- ≥ 12 new reviews in 4 weeks, all answered within 24 hours
- NAP identical on the top-30 directories
- 10 snippet targets in the day-7/day-14 loop
- AI-citation baseline ("share of model") recorded in 5 engines; wrong facts fixed at their source
- First data study pitched to 30 names
- 4 YouTube videos live with transcripts

Weeks 11–12 gate:

- 30 prompts re-run and compared with week 1
- Report written in orders and leads
- Next 20 pages chosen
- Weekly rhythm running
- Diagnostic protocol run once

If an old site or online shop already exists, weeks 1–2 also include a crawl and a redirect map (Layer 18) before anything moves.

Team onboarding: one stack layer a day during weeks 1–3, starting with Level 101, practising directly on Coco Vanille.

## 4. Gate register: all 21 layers, adapted

### Level 101: Foundations

| Layer | Coco Vanille adaptation | Done when | Check |
|---|---|---|---|
| 1 The map | Category sentence in FR/EN/ES with no adjectives (§6); 30 customer questions drafted; team understands both paths (Google, AI) | Sentence in 3 languages; top-5 competitors named; team can explain "not indexed = never cited" | prompts.mjs set to fr-CA/en/es |
| 2 HTML a machine can read | See below | One h1 and ordered headings; every image has alt, width and height; unique title and description on every page; no noarchive/nocache/nosnippet on pages we want cited | audit.mjs in CI (fails the build); W3C validator |
| 3 Speed, mobile first | See below | PageSpeed mobile green (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1) on home + top 5 pages; no image over 200 KB; no raw iframe above the fold | cwv.mjs, images.mjs, Lighthouse CI |
| 4 JavaScript without hiding content | Next.js static or server rendering; prices, hours, daily display case (vitrine du jour) and FAQ in the server HTML; FAQ in `<details>`; JSON-LD built at build time; cake builder marked noindex; no hash routes; CSS and JS never blocked | Raw HTML matches the rendered page: words, headings, links, title, canonical, JSON-LD | render-diff.mjs per template; Search Console URL Inspection |
| 5 Crawl, index, get counted | See below | Key pages show in site: searches on Google and Bing; Pages report clean; every crawler in the stack's table gets a 200; AI control checked | generate.mjs, check-urls.mjs, crawler-access.mjs, indexnow.mjs |

Layer 2: page template details. Templates in FR, EN and ES, structured as: skip link → header with a language switcher that goes to the equivalent page → main → breadcrumb → article → footer with NAP identical to the Google profile.

Full `<head>` on every page:

- lang set to fr-CA, en-CA or es
- title under 60 characters
- meta description of 140–160 characters that states the answer
- self-referencing canonical
- hreflang for fr/en/es plus x-default
- robots meta with max-snippet:-1 and max-image-preview:large
- Open Graph image at 1200×630
- one @graph JSON-LD block

The Loi 25 consent banner and legal boilerplate are wrapped in `data-nosnippet`, so no engine quotes them as an answer.

Layer 3: speed rules.

- Hero poster in AVIF, ≤ 200 KB, with `fetchpriority="high"`.
- Hero video loads only after the first interaction.
- Fraunces + Inter: 2 variable font files, subset, `font-display: swap`.
- Map shown as a static image that links to Google Maps.
- YouTube behind a click-to-load facade (lite-youtube).
- Space reserved for the consent banner so it never shifts the layout.
- CSS logical properties, which keep a future right-to-left language possible.

Layer 5: crawl and index setup.

- robots.txt as shown below.
- Host firewall (Vercel or Cloudflare) aligned with the crawler table. Never block "Training" if doing so also blocks Googlebot.
- Sitemap built from real pages, with real lastmod dates and hreflang.
- Search Console Domain property owned by the bakery. "Search generative AI control" not opted out; Generative AI report baseline noted.
- Bing Webmaster Tools imported from Search Console; IndexNow key installed.
- One host, one trailing-slash rule, every redirect a single 301 hop.
- Removed pages return 404 or 410.

```
User-agent: *
Disallow: /studio/
Disallow: /boite/
Disallow: /en/box/
Disallow: /es/caja/
Disallow: /compte/
Disallow: /recherche
Disallow: /api/
Content-Signal: search=yes, ai-input=yes, ai-train=yes

Sitemap: https://VOTREDOMAINE.ca/sitemap.xml
```

Training stays allowed. For a local business, blocking it mostly erases the brand from future AI models' memory. The cake builder is kept out of the index with a noindex tag, not with robots.txt.

### Level 201: Practitioner

| Layer | Coco Vanille adaptation | Done when | Check |
|---|---|---|---|
| 6 Inside Google | Team reads Google's SEO Starter Guide, ranking systems guide and spam policies; checks the Search Status Dashboard every Friday; Google's helpful-content questions are in every page brief; no conclusions drawn during update rollouts | Team can name the systems and which policy each "hack" breaks; Friday routine running | Studio Friday checklist |
| 7 Research | See below | prompts.csv scored and baseline recorded; each of the 10 priority prompts has a current owner and a counter-move | prompts.mjs, serp.mjs, ai-runs.mjs, crawl.mjs, content-gap.mjs, market.mjs |
| 8 The entity | See below | NAP identical on 10 profiles; every sameAs link live and linking back; JSON-LD valid; About and chef pages live | schema.mjs, check-urls.mjs --config, Rich Results Test |
| 9 Architecture | Page tree in §6; fan-out map for each core prompt; search-results overlap test before splitting "gâteau de fête" from "gâteau personnalisé"; one new page a week after launch; 3 internal links to each new page on its publish day; URLs fixed once | Every page within 3 clicks of home; ≥ 3 internal links in; no two pages competing for the same query; topic coverage ≥ 80% before widening | links.mjs, crawl.mjs, pages.mjs, gsc-api.mjs cannibal |
| 10 Content that gets chosen and clicked | Page pattern from §7; title and description written as a free ad; the first screen repeats the searcher's words; one primary action per page; scarcity only when real (actual slot capacity) | Pattern complete on every page; no [[FACT NEEDED]] marker left; beat score ≥ 80 | audit.mjs, content-gap.mjs, Studio publish guard |
| 11 Links | Every month: 2 link requests (wedding venues, photographers, corporate clients, suppliers), 1 sweep for unlinked brand mentions, 1 media pitch; the portion calculator is the free tool; sponsorships marked rel="sponsored"; add internal links from pages that already rank | 5 earned links in progress by day 90; ≥ 3 internal links per page; no paid link without sponsored | links.mjs, gsc-api.mjs links, Ahrefs Webmaster Tools |

Layer 7: research steps.

- Score the 30 prompts from §5 out of 20; start with those scoring ≥ 14.
- Baseline week: Google, from a phone in Granby; ChatGPT, Perplexity, Gemini, Claude and Copilot.
- Battle map of the top 5 competitors, including home bakers.
- Demand sources: autocomplete and PAA as seen from Granby, in 3 languages; Google profile search terms and Google Trends; the wording customers use in Instagram DMs; Search Console, once the site has impressions.

Layer 8: entity setup.

- One spelling of the name.
- NAP copied from one source file onto ≥ 10 profiles.
- Google profile name in one language only.
- Chef page with photo, training and social profiles that link back.
- About page as the source of truth, with dated facts.
- Structured data: site-wide graph: Bakery + Person (chef) + WebSite; on each page: WebPage + BreadcrumbList + Product or Article.
- No self-serving review stars.
- Wikidata only after independent press coverage exists.

### Level 301: Advanced

| Layer | Coco Vanille adaptation | Done when | Check |
|---|---|---|---|
| 12 Local | See below | Profile complete, verified and owned; ≥ 3 new reviews a week for 4 weeks, all answered within 24 h; NAP identical on top-30 directories; local-proof page in FR + EN; grid top 3 across the core area | serp.mjs local-grid or Local Falcon; docs/05 |
| 13 AEO | Harvest PAA 3 levels deep for each core prompt in FR/EN/ES → 20–40 questions mapped to pages; first sentence answers in the format the question asks for; brand and fact in the same sentence (§7); snippet loop on 10 prompts | 10 targets logged at day 7 and day 14; our passage owns the snippet, a PAA answer or the AI Overview citation on ≥ 10/30 prompts | serp.mjs, snippet-targets.csv |
| 14 GEO | Four conditions in order: retrievable → extractable → citable → corroborated; honest comparison page; weekly runs (named? linked? position? competitors? wrong facts? Fix each at its source); Bing AI Performance; llms.txt optional | Every AI search crawler gets a 200; Bing indexes the key pages; share of model tracked for 4 weeks; cited ≥ 15/30 in ≥ 2 engines and the most-cited domain | ai-runs.mjs, citation-share.mjs |
| 15 Off-site | Mention engine in §8; add Instagram, TikTok and YouTube as Search Console properties; build brand demand | Mentions counted monthly and rising 3 months in a row; 2 videos a month embedded on pages; present on ≥ half of the ranking "best of" lists | data-study.mjs, mentions.csv, Google Alerts |
| 16 Risk ledger | §10: refused-tactics clause, Studio guardrails, written conditions for each grey move, fast legal programme with dates | Clause signed; programme scheduled; conditions written | Studio guardrails; audit.mjs doorway and hidden-text tests |

Layer 12: Google profile, field by field.

- Official name, in one language.
- Primary category chosen from a competitor category audit (Pastry shop vs. Cake shop).
- Hours including Québec holidays.
- Services and products with prices.
- 750-character description that opens with the category sentence.
- One post a week; fresh photos every month.
- Website link with UTM tags.
- The bakery's own Google account owns the profile.

Layer 12: review engine.

- An SMS the day after the celebration, plus a QR code on every box.
- Every review answered within 24 hours.
- No review quotas for staff.

Layer 12: other local work.

- Listings on every directory in the top 30 results.
- A local-proof page: address, parking photos, directions from landmarks, local customer stories.

### Level 401: Expert

| Layer | Coco Vanille adaptation | Done when | Check |
|---|---|---|---|
| 17 Measurement | §11 | All sources connected; key events firing; AI channel live; 4 weekly scoreboard rows; monthly log check shows Googlebot, Bingbot and ≥ 2 AI crawlers on the pillar page | gsc-api.mjs, ga4-api.mjs, log-bots.mjs, weekly.mjs, dashboard.mjs |
| 18 Diagnostics | One-hour protocol; compare year over year against Québec seasons; log of reporting changes; redirect map for every URL ever changed (including old link-in-bio or shop URLs) | Protocol run once; Manual actions and Security issues empty with alerts on; redirect map exists | gsc-diff.mjs, DROP mode |
| 19 Special cases | See below | Must-have facts present on the pages; markup valid; every programmatic page passes the one-sentence uniqueness test | feed.mjs, programmatic.mjs, Lighthouse Agentic Browsing |
| 20 Running it as a business | For your agency: 3-phase offer; paid diagnostic = the market map; ownership and refused-tactics clauses; capacity = available hours ÷ 6; monthly report in orders, quotes and calls | Offer, clauses, capacity plan and report template in use | portfolio.mjs, docs kit |
| 21 Rank first | Weekly rhythm in §9; striking-distance work first; one change at a time (wait 14 days, compare with untouched pages); a new dated fact on any page older than 180 days; the stack's decision tree | Rhythm runs 4 weeks in a row; scoreboard updated every Monday; 90-day plan dated in the bakery's calendar | weekly.mjs, gsc-api.mjs striking, freshness.mjs |

Layer 19: what a bakery + online shop + wedding business must publish (see §14):

- Products listed in HTML with prices, portions and lead times.
- Allergens.
- Pickup and delivery zones.
- Deposit and cancellation terms.
- A no-return policy for perishable items.
- Holiday hours.

How it's built:

- Product + Offer markup with real availability states (PreOrder, SoldOut).
- Merchant Center feed.
- Real photos only.
- Gallery pages that each pass the uniqueness test.
- Forms that AI agents can fill.
- No content hidden behind the consent banner.

## 5. The fixed 30-prompt set (prompts.csv seed)

The set mixes the beachhead (custom cakes) with the map-pack basics a walk-in bakery can't ignore. Prompt IDs stay stable; adjust the wording after the baseline if real phrasing differs.

| ID | Type | Lang | Prompt |
|---|---|---|---|
| I1 | Informational | FR | combien coûte un gâteau de fête personnalisé à Granby |
| I2 | Informational | FR | combien de jours d'avance commander un gâteau personnalisé |
| I3 | Informational | FR | quelle grosseur de gâteau pour 20 personnes |
| I4 | Informational | FR | comment transporter un gâteau à étages en auto |
| I5 | Informational | FR | prix d'un gâteau de mariage par portion au Québec |
| I6 | Informational | FR | différence entre crème au beurre et ganache sur un gâteau |
| I7 | Informational | FR | comment conserver un gâteau à la crème jusqu'au lendemain |
| I8 | Informational | EN | how much does a custom birthday cake cost in Quebec |
| I9 | Informational | EN | how far in advance to order a wedding cake |
| I10 | Informational | ES | cuánto cuesta una torta de quinceañera en Quebec |
| C1 | Commercial | FR | meilleure pâtisserie à Granby |
| C2 | Commercial | FR | meilleur gâteau de fête à Granby |
| C3 | Commercial | FR | pâtisserie gâteau de mariage Cantons-de-l'Est |
| C4 | Commercial | FR | bûche de Noël Granby |
| C5 | Commercial | FR | macarons Granby avis |
| C6 | Commercial | FR | gâteau sans gluten Granby |
| C7 | Commercial | FR | prix gâteau de mariage Granby |
| C8 | Commercial | EN | best bakery in Granby Quebec |
| C9 | Commercial | EN | wedding cake bakery Eastern Townships |
| C10 | Commercial | ES | mejor pastelería en Granby Quebec |
| L1 | Local | FR | pâtisserie près de moi (searched from a phone in Granby) |
| L2 | Local | FR | commander un gâteau de fête en ligne Granby |
| L3 | Local | FR | gâteau pour demain Granby |
| L4 | Local | FR | pâtisserie ouverte dimanche Granby |
| L5 | Local | FR | café et pâtisserie près du Zoo de Granby |
| L6 | Local | FR | chocolatines Granby |
| L7 | Local | FR | boîte de pâtisseries pour réunion Granby |
| L8 | Local | EN | bakery near Granby Zoo |
| L9 | Local | EN | order custom cake online Granby |
| L10 | Local | ES | torta de cumpleaños personalizada Granby |
| B1–B3 | Brand | FR/EN | "Pâtisserie Coco Vanille Granby avis" · "Coco Vanille Granby heures" · « Que sais-tu de la Pâtisserie Coco Vanille à Granby ? » / "What is Pâtisserie Coco Vanille in Granby known for?" |

Scoring. Rate each prompt 1–5 on four questions (total out of 20): Are there weak pages in the top 10? Is the needed authority within reach? Is there a surface we can win now? Is the searcher a buyer?

Weekly runs: search results through an API with the location set to Granby, Quebec; AI engines through their APIs; monthly manual spot checks: the map pack from a phone, and the consumer AI apps.

## 6. Category sentence, beachhead, page tree and fan-out

Category sentence. Draft only: validate with the owner. If viennoiseries or the café are the core business, the sentence changes. No adjectives.

- FR: « Pâtisserie Coco Vanille est une pâtisserie de gâteaux personnalisés pour les fêtes et les mariages à Granby. »
- EN: "Pâtisserie Coco Vanille is a custom cake shop for birthdays and weddings in Granby, Québec."
- ES: "Pâtisserie Coco Vanille es una pastelería de pasteles personalizados para cumpleaños y bodas en Granby, Quebec."

Test: name the top 5 competitors for that exact phrase, including home bakers on Instagram and Marketplace. If you can't, narrow it.

Beachhead to own within 12 months: custom celebration cakes in Granby. Widen later.

| Page | FR | EN | ES | Job |
|---|---|---|---|---|
| Home | / | /en/ | /es/ | Category sentence, answer block, top products, proof, order button |
| Pillar | /gateaux-personnalises-granby/ | /en/custom-cakes-granby/ | /es/pasteles-personalizados-granby/ | The category answered in full |
| Prices | /prix/ | /en/prices/ | /es/precios/ | Dated price table: sizes, portions, lead times |
| Comparison | /comparatif-gateau-de-fete-granby/ | /en/birthday-cake-options-granby/ | /es/comparativo-pasteles-granby/ | See below |
| Free tool | /calculateur-portions-gateau/ | /en/cake-serving-calculator/ | /es/calculadora-porciones-pastel/ | Server-rendered table that works without JavaScript; earns links for years |
| Clusters (8+) | See below | Mirrored | Subset + quinceañera | One sub-intent each |
| Local proof | /nous-trouver/ | /en/visit/ | /es/como-llegar/ | Address, parking photos, directions from landmarks, local stories |
| About + chef | /a-propos/ + /a-propos/chef/ | /en/about/… | /es/nosotros/… | Source of truth |
| Legal | /confidentialite/ (Loi 25), /conditions-de-vente/ (LPC) | Mirrored | Mirrored | — |

Comparison page: compares options honestly: pâtisserie vs. supermarket vs. home baker vs. chains. Criteria: price per portion, lead time, customization, allergens and permits, taste, reliability. A verdict per use case. Example: "For a cake within 2 hours, a supermarket is your best bet."

Cluster pages: children's birthday cakes; smash cake; wedding cakes; bûches de Noël; gluten-free / allergies; "cake for tomorrow"; corporate boxes; transporting and storing a cake; Zoo visitors.

Fan-out for the pillar prompt. AI engines split "gâteau personnalisé Granby" into sub-questions, each mapped to a section or page:

| Sub-question | Answered on |
|---|---|
| Price | /prix/ + pillar section |
| Lead time | Pillar section |
| Size for X guests | Calculator |
| Flavours and finishes | Pillar section |
| Allergies | Cluster page |
| Transport | Cluster page |
| Delivery | Pillar section + /nous-trouver/ |

Overlap test: if "gâteau de fête Granby" and "gâteau personnalisé Granby" share ≥ 6 of their top 10 results, fold birthday cakes into the pillar page.

## 7. The page pattern for Coco Vanille (Layer 10), with examples

Facts not yet confirmed use the stack's [[FACT NEEDED]] marker. Studio blocks publishing while any marker remains.

Answer block (pillar, FR, 40–60 words: brand + service + customer + place + one dated number):

> « La Pâtisserie Coco Vanille, à Granby, réalise des gâteaux personnalisés pour les fêtes et les mariages, de 8 à [[FACT NEEDED: portions max]] portions. Les prix commencent à [[FACT NEEDED: prix 6 po]] $ (2026) et la commande se fait au moins [[FACT NEEDED: délai]] jours d'avance, en ligne ou par téléphone, pour une cueillette en boutique. »

AEO sentence (brand and fact in the same sentence, drawn from the data study):

> « Selon le relevé de la Pâtisserie Coco Vanille auprès de [[N]] pâtisseries québécoises (mars 2027), un gâteau de fête de 8 po (12 à 16 portions) se vend entre [[min]] $ et [[max]] $. »

"Ce qu'on a mesuré" (our own data, from the order system via Studio's Own data module):

> « Sur les [[N]] gâteaux personnalisés commandés chez Coco Vanille entre janvier et septembre 2026, [[X]] % étaient des 8 po; délai moyen commande-cueillette : [[Y]] jours. Méthode : export du système de commandes, annulations exclues. »

Key facts block (5 dated facts, brand named in each):

- Pâtisserie Coco Vanille est située au [[adresse]], à Granby (Québec).
- Pâtisserie Coco Vanille est ouverte [[horaire]] (2026).
- Pâtisserie Coco Vanille prépare des gâteaux de [[min]] à [[max]] portions.
- Pâtisserie Coco Vanille demande [[N]] jours d'avance pour un gâteau personnalisé.
- Pâtisserie Coco Vanille compte [[N]] avis Google, note [[X]]/5 (au [[date]]).

FAQ: 5–8 real objections, including one phrased the way Granby people actually say it. This replaces the stack's Darija question.

> « C'est-tu possible d'avoir un gâteau pour demain? » — first sentence answers it. Only if true: « Oui : commandez avant [[14 h]] pour une cueillette le lendemain. »

Snippet as a free ad:

- Title (under 60 characters): « Gâteaux personnalisés à Granby dès [[prix]] $ – Coco Vanille »
- Description (140–160 characters): « Gâteaux de fête et de mariage sur mesure à Granby : 8 à [[max]] portions, dès [[prix]] $, [[N]] jours d'avance, cueillette en boutique. [[N]] avis Google. »

Conversion band (one primary action per page type):

| Page type | Primary action | Secondary |
|---|---|---|
| Product | « Ajouter à ma boîte » | — |
| Custom cake | « Créer mon gâteau » | Phone |
| Local / visitor | Directions | Phone |
| Spanish pages | WhatsApp with pre-filled text naming the page ("Hola, quiero cotizar una torta de quinceañera para el …") | — |

Every page also carries: an author with a bio link; published and updated dates; a one-line change note.

## 8. Off-site mention engine, Québec version (Layer 15)

| Action | How often | Coco Vanille specifics |
|---|---|---|
| Own data study | Quarterly | See below |
| Pitch list of 30 names | 5–10 pitches per quarter | See below |
| YouTube | 2 a month | Brand and "Granby" said on camera; chapters = sub-questions; transcript embedded on the matching page. Topics: tiered cake build, cake transport test, bûche behind the scenes, shop tour |
| "Best of" lists | Continuous | Every "meilleure pâtisserie Granby / Cantons-de-l'Est / Estrie" list that ranks or that AI engines cite |
| Owner posts (Facebook / LinkedIn) | Weekly | Names the brand and the category |
| Client case study | Quarterly | Published on a wedding venue's, photographer's or corporate client's own site |
| Communities | Weekly, when a question is real | Local Facebook groups (parents, weddings), Reddit; real name, affiliation disclosed, never posing as a customer |
| Talks | Quarterly | Cégep de Granby, Chambre de commerce, wedding fairs |
| Brand demand | Continuous | Box stickers with QR code, window decal, invoices, email signature, a small always-on Google brand ad |

Data study topics, one per quarter: Q1 « Prix des gâteaux de fête au Québec »; Q2 « Saveurs préférées à Granby »; Q3 « Gâteau de mariage dans les Cantons-de-l'Est »; Q4 « Bûches 2027 ». Each one includes its method, date, a chart image and a one-line credit, so it's easy to cite.

Who goes on the pitch list: La Voix de l'Est, La Tribune, ICI Estrie; Narcity Québec, Tastet, Caribou; Tourisme Cantons-de-l'Est, Bonjour Québec; Estrie food creators; authors of ranking "best of" lists; domains the AI engines already cite.

## 9. Weekly rhythm → who does it → where in Studio (Layer 21)

| When | Bakery | Agency | Studio module |
|---|---|---|---|
| Daily, 20 min | Approve AI-drafted review replies; post the daily display-case photo | One mention action; log one real customer question | Avis, Catalogue (vitrine), Mentions, Questions |
| Monday, 1 h | — | Scoreboard, Search Console, Bing AI Performance; choose the week's 3 moves | Scoreboard |
| Tue–Wed, 3 h | — | One page in FR + EN (+ ES when core) → gate → deploy → IndexNow → request indexing | Pages, Gates |
| Thursday, 1 h | — | One off-site action; Google profile post; one pitch | Mentions, Cartes |
| Friday, 1 h | — | Pages report, Core Web Vitals, security, manual actions, Status Dashboard, URL and crawler checks | Gates (Friday) |
| Monthly | Approve the report | Prompts re-run in every engine; video; pitches; mention count; logs; local grid; client report | Visibilité IA, Analytique |
| Quarterly | Validate the data | Data study; re-verify every statistic; link audit; index clean-up; re-read the stack's Sources & changelog | Own data, Recherche |

## 10. Risk ledger → contract, Studio guardrails, fast programme (Layer 16)

Refused-tactics clause (signed by Coco Vanille):

- Google profile: keywords or a second language in the Google profile name; fake locations, such as a "Coco Vanille Bromont" pin with no staff there.
- Reviews: fake, bought, incentivized or filtered reviews; reviews from staff or family; review quotas for staff; asking customers to name staff members.
- Markup and AI: self-serving review stars; markup for anything not visible on the page; text written to AI models; content shown only to bots.
- Links and pages: bought links or private blog networks; expired-domain redirects; parasite pages; mass AI pages or cloned city pages.
- Off-site: fake accounts in groups or on Reddit; undisclosed paid or influencer content (Ad Standards Canada rules); microsites for the same bakery; editing Wikipedia; any negative SEO against competitors.

Guardrails built into Studio:

- Google profile name field: locked to the official name; warns if keywords or a second language are added.
- Review requests: go to every customer, never filtered by satisfaction; no incentive wording; no staff names.
- New city or programmatic pages: require a "what's unique here" sentence and local-proof fields; name-swapped duplicates are blocked (programmatic.mjs).
- Schema generator: only outputs values visible on the page; no aggregate rating on the business itself.
- Publish guard blocks publishing on: a missing French version (Loi 96); any [[FACT NEEDED]] marker; allergen information not verified by a human.

Grey moves, each with its written condition:

| Move | Condition that keeps it legal |
|---|---|
| Paid spot on a "best of" list | The list ranks, payment is disclosed, link marked rel="sponsored"; low priority |
| « Guide gourmand de Granby » on our site | Features complementary businesses (cafés, chocolatiers, cheese shops); stated criteria; disclosure; never ranks competing bakeries |
| Comparison page | Prefer comparing categories of options; if competitors are named: published facts with dates, no denigration, legal check (Competition Act / LPC) |
| AI-assisted content and translation | Human-confirmed facts, human editing, unique data on every page |
| Bidding on competitors' brand names in Google Ads | No competitor trademark in the ad text |

Fast legal programme (one move per week):

| Week | Move |
|---|---|
| 1 | Indexing, crawler access, firewall/CDN settings; Bing Webmaster Tools + IndexNow |
| 1–2 | Google profile: primary category, services, products, photos |
| 2+ | Review engine: every customer asked the day after the celebration |
| 3–6 | Sweep of "best of" lists and directories (top 30 results) |
| 6+ | Snippet loop on 10 prompts; fix wrong AI facts at their source |
| 8 | Comparison page + portion calculator |
| 9 | First data study pitched to 30 names |
| 7+ | 2 YouTube videos a month |
| Launch + 4 weeks | Rewrite pages ranking 4–15 (needs Search Console data) |
| Continuous | Brand demand: boxes, window decal, small brand ad |

Defence: trademark search and filing with CIPO; two-factor authentication everywhere; tested backups; link check every quarter; a weekly look at the brand's search results and AI answers; fake reviews and duplicate listings reported with evidence. Never retaliate.

## 11. Measurement adaptations (Layer 17)

- Key events: purchase, generate_lead; phone_click, directions_click, order_click; whatsapp_click (Spanish pages), instagram_dm_click.
- AI traffic: GA4's "AI Assistant" default channel, plus the stack's regex as a custom channel group to catch what it misses.
- Google profile website link, using the stack's format word for word: `?utm_source=google&utm_medium=organic&utm_campaign=business_profile`.
- Search Console: Generative AI report baseline; Instagram, TikTok and YouTube added as properties.
- Bing AI Performance: citations, grounding queries, citation share.
- Microsoft Clarity's AI visibility view as a cross-check.
- Bot logs: Vercel log drain sent to a log tool. Each month, confirm Googlebot (by reverse DNS), Bingbot and AI crawlers are fetching the pillar page.
- Data Studio page: a KPI row; a 30-prompt × engine table; a 16-month trend.
- Rule from the stack: early signals rising for 8 weeks with flat leads means it's early. Early signals flat after 8 weeks means it's failing.

```js
// key-clicks.js — loaded after the GA4 tag; respects Consent Mode (Loi 25)
const RULES = [
  [/^tel:/, "phone_click"],
  [/wa\.me\/|api\.whatsapp\.com\//, "whatsapp_click"],
  [/ig\.me\//, "instagram_dm_click"],
  [/maps\.google\.|google\.[a-z.]+\/maps|maps\.app\.goo\.gl|maps\.apple\.com/, "directions_click"],
];
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || typeof gtag !== "function") return;
  const name = link.dataset.event || (RULES.find(([re]) => re.test(link.href)) || [])[1];
  if (name) gtag("event", name, {
    link_url: link.href,
    page_path: location.pathname,
    language: document.documentElement.lang,
  });
});
// Internal buttons declare their event: <a href="/commander/" data-event="order_
// [snippet truncated here in the original paste; sections §12–§16 referenced above were not included]
```
