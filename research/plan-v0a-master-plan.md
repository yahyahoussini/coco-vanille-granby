# Coco Vanille: Master Plan (Build, Local Dominance, Ads-Ready Signals, Social, Coco Studio)

> Stored as provided by Yahya on 2026-10-25. Formatting only; content unchanged. Claims are reviewed in research/12-plan-review.md and research/18-dated-claims-verification.md.
>
> Note: some code samples in the original are TypeScript; new code for this project is JavaScript only.

Two notes before the plan:

- Your topic list didn't come through. The message ends at "…right now, and more:". The complete SEO/GEO/AEO topic universe is in Part 3. Paste your list and I'll map every item onto it and add anything missing.
- I can't do live web research from here. Part 1 is therefore the research sprint: what to collect, where to find it, and which decision each finding drives. It starts from what I already know about Granby.

## 0 · The plan on one page

Mission: Coco Vanille becomes the answer for pastry and cake searches in Granby, in French, English and Spanish, on:

- Google Search and Google Maps
- Apple Maps and Siri
- Bing and Copilot
- ChatGPT, Perplexity and Gemini
- Instagram, TikTok, Pinterest and YouTube

Every signal is wired so Google, Meta and TikTok ads can be switched on later without rebuilding anything.

| # | What we build | Purpose |
|---|---|---|
| 1 | The website (FR/EN/ES, ordering, cake builder) | The business's official home online and its conversion engine |
| 2 | Coco Studio | Control center for the whole online presence: products, content, listings, reviews, social, AI visibility, analytics, APIs |
| 3 | The signal layer | Consent, events, server-side conversions and product feeds. Principle: ads-ready, ads-off |
| 4 | The growth engine | SEO/GEO/AEO, social and reputation routines, all run from Studio |

| Phase | Weeks | Outcome |
|---|---|---|
| Research & quick wins | 1–2 | Market report and decisions signed; Google/Apple/Bing profiles fixed; review collection live |
| Design & foundation | 3–8 | Design system, CMS, trilingual site, ordering, signal layer |
| Studio & launch | 9–12 | Coco Studio v1, product feeds, social composer, then go-live |
| Growth modules | 13–18 | Cake builder, AI visibility, geogrid tracking, AI assistant in Studio, ads connectors |
| Dominance operations | Ongoing | Weekly and monthly routines, run from Studio |

## PART 1 · Market research sprint (2 weeks)

### 1.1 What we already know [to verify]

| Dimension | Known | Implication |
|---|---|---|
| City | Granby ≈ 70k residents (2021 census), fast-growing; Haute-Yamaska region ≈ 90k+ | One location has enough local density for daily demand |
| Location | Central Granby; ~80 km from Montréal; under 1 hour from Vermont | Day-trippers and US/Ontario tourists, so English matters |
| Tourism | Zoo de Granby (summer peak), Bromont, the Estriade trail, lac Boivin, fall foliage, Festival international de la chanson | Seasonal tourist searches: "near the Zoo", "open now", picnic boxes |
| Communities | Francophone majority; English-speaking Townshippers; established Latin American community; newcomers | The FR/EN/ES language tiers |
| Youth | Cégep de Granby | TikTok/Instagram content, limited "drops" |
| Weddings | Eastern Townships venues; Brome-Missisquoi wine route nearby | Wedding season June–Sept; couples plan January–March |
| Competition | Other pâtisseries and bakeries; supermarket cakes; ice-cream-cake chains; home bakers on Instagram and Facebook Marketplace | See below |
| Food culture | Strong seasonal rituals: bûche de Noël, maple season, galette des rois | Seasonal hub pages |

Competitive angle: win on custom work and quality, and dominate the places home bakers are weak: Maps, a real website, AI answers.

### 1.2 Research workstreams

1. What do people search, in which language, and when?
   - Sources:
     - Google Keyword Planner (a free Ads account, which also prepares future ads)
     - Google Trends for Québec
     - Autocomplete and "People also ask" as seen from Granby, plus AlsoAsked
     - TikTok and Pinterest search suggestions; Pinterest Trends; TikTok Creative Center
   - Output: keyword universe in FR/EN/ES, with intent, season and value for each term.
2. Who competes for those searches and answers?
   - Sources:
     - Maps sweep within 25 km (bakeries, pastry shops, cake shops)
     - Home bakers on Instagram and Facebook Marketplace
     - Supermarket and chain cakes
   - Output: competitor map and gap scorecard.
3. How do competitors show up online?
   - Sources:
     - Their Google profiles: categories, reviews, photos, posts
     - Their websites and posting rhythm on social
     - Public ad libraries: Meta Ad Library, Google Ads Transparency Center, TikTok Creative Center
   - Output: what to beat and where they are weak.
4. Who are the customers?
   - Sources:
     - StatCan 2021 census and ISQ (Institut de la statistique du Québec)
     - ATN NETendances surveys (Québec digital habits)
     - Audience insights from their Instagram and Facebook accounts
     - Meta and TikTok ad audience estimates for a 25 km radius
     - 10 quick interviews at the counter
     - Sales data from the point-of-sale system (POS)
   - Output: personas and segment sizes.
5. What do customers love or dislike?
   - Sources:
     - Review mining: ours plus the top 3 competitors
     - Instagram DMs and comments
   - Output: the 3 attributes we want to be known for, plus an opportunity list.
6. What do AI engines say today?
   - Source: 30 prompts × 5 engines × 3 languages.
   - Output: AI baseline and the list of sources they cite.
7. What do the search results pages look like?
   - Source: for the top 50 queries, note the map pack, AI Overview, "People also ask", images, videos and forums.
   - Output: which content formats each query needs.
8. Where do we sit on price?
   - Source: competitors' public prices per size and per portion; supermarket benchmarks.
   - Output: pricing pages and "combien coûte…?" answers.
9. What is the local calendar?
   - Source: Trends data, Zoo and tourism seasons, local events, wedding season.
   - Output: 12-month content calendar.
10. What works on social locally?
    - Sources:
      - Local creators in food, family, weddings, Granby lifestyle and the Latin community
      - Hashtags and formats that perform locally
    - Output: creator shortlist and content pillars.

### 1.3 Decisions this research unlocks

- Positioning and the 3 attributes
- Which languages get which depth
- Keyword-to-page map
- How prices are communicated
- 12-month calendar
- Social content pillars
- Competitor targets
- KPI baselines

## PART 2 · How we build it

### 2.1 Architecture

This refines the earlier stack: Studio is now a full product, so we consolidate on one codebase.

- Next.js + Payload CMS 3 in a single app for both the public site and Studio.
  - Payload already provides: admin interface, roles, French/English/Spanish fields, drafts and versions, scheduled publishing, hooks, background jobs.
  - We build custom dashboards on top instead of writing a CMS from scratch.
  - Astro + Sanity remains a valid alternative.
- Data stays in Québec: Postgres (Supabase or AWS RDS, region ca-central-1, Montréal) and S3 media storage in the same region. This keeps personal data in Québec under Loi 25.
- Background jobs (Payload jobs or Trigger.dev/Inngest) for syncs, feeds, the AI prompt panel, reports and retries.
- Ordering is matched to the POS they already use (Square, Shopify or Stripe).
  - Store operations (POS, inventory, kitchen) stay in that system.
  - Studio only reads order data, for analytics and attribution.
- Signal layer:
  - Google Tag Manager (GTM) in the browser, plus a server-side GTM container (Cloud Run in Montréal, or Stape)
  - GA4
  - Each ad platform's pixel plus its server-to-server API
- Data warehouse: BigQuery (Montréal region) with Looker Studio dashboards.
- Monitoring:
  - Sentry for errors
  - Better Stack for uptime
  - Our own Core Web Vitals measurement from real visitors (the web-vitals library)

```
Google · Apple · Bing/Copilot · ChatGPT · Perplexity · Gemini
        ▲  HTML · JSON-LD · sitemaps · IndexNow · llms.txt · feeds
        │
apps/web — Next.js + Payload
 ├─ Public site FR/EN/ES (SSG/ISR) · ordering · cake builder · PWA   ◄── customers
 └─ Coco Studio (/studio) · presence control center                  ◄── owner & team
        │ hooks & jobs (syncs · feeds · AI panel · reports)
        ▼
Postgres + S3 (Montréal) ──► BigQuery (Montréal) ──► Looker Studio
        ▲
        │ order webhooks (orders · values · consent · click IDs)
POS / order system — store operations stay here
        │
Signal layer: GTM web + server GTM → GA4 · Google Ads · Meta CAPI · TikTok Events · Pinterest CAPI
Integrations: Business Profile · Search Console · Bing · Instagram/Facebook · TikTok · YouTube ·
              Pinterest · Yelp/TripAdvisor · geogrid · SERP · LLM APIs · Brevo/Klaviyo · Twilio
```

```
apps/web               Next.js + Payload (site + Coco Studio)
apps/worker            jobs: syncs, feeds, AI panel, reports
packages/ui            design system (tokens, components)
packages/schema        JSON-LD generators (Bakery, Product, FAQ…)
packages/tracking      event dictionary + typed dataLayer + server senders
packages/feeds         Google / Meta / TikTok / Pinterest feeds
packages/integrations  Business Profile, Search Console, GA4, Meta, TikTok, Pinterest, YouTube, Yelp…
```

Automated checks on every code change:

- type checks
- end-to-end tests of ordering and the cake builder (Playwright)
- performance budgets (Lighthouse CI)
- accessibility (axe)
- structured-data validation
- hreflang reciprocity
- broken links
- a preview deployment

Staging is password-protected and hidden from search engines.

### 2.2 Team

| Role | Load |
|---|---|
| Strategist / PM (SEO-GEO-AEO lead) | 0.5–1 |
| UX/UI designer | 1 (weeks 2–10) |
| Full-stack developer (site + Studio) | 1 |
| Integrations/data developer (APIs, tracking, feeds) | 1 |
| Québec French copywriter + EN/ES adapters | As needed |
| Photo/video | 2–3 shoot days, then a half-day monthly |
| Community manager | 0.5, ongoing |

### 2.3 Sprint plan (2-week sprints)

| Sprint | Weeks | Build | Strategy & content | Exit criteria |
|---|---|---|---|---|
| S0 | 1–2 | Repo, environments, CI, architecture decisions; audit who owns each account | Research sprint; quick wins; measurement plan; keyword-to-page map v1 | Research report signed; quick wins live |
| S1 | 3–4 | Design system; Payload content types (products, pages, FAQ, business info, seasons, media) in 3 languages; roles | Content model; copy templates; shoot plan | Key screens approved; team can edit in Studio |
| S2 | 5–6 | See below | French copy for core pages; photo/video shoot | Core pages live on staging in 3 languages with valid schema |
| S3 | 7–8 | See below | Product data entry; English adaptation | Test orders work end-to-end; every event validated in debuggers |
| S4 | 9–10 | See below | Spanish adaptation; FAQ banks in 3 languages | Owner adds or pauses a product and changes hours alone |
| S5 | 11–12 | See below | Launch content; social launch plan; Google posts | All launch gates passed, then go-live |
| S6 | 13–14 | See below | Content sprint #1; outreach #1 | Builder live; Monday report arrives |
| S7 | 15–16 | See below | AI panel post-launch vs. baseline; outreach to sources AI cites | Monthly report automated |
| S8 | 17–18 | See below | Next seasonal hub; review push | v1 complete; training and handover |

Build details, sprints S2–S8:

- S2:
  - Public page templates
  - Language routing
  - hreflang tags and sitemaps generated from translation groups
  - Structured-data generators
  - Performance and accessibility budgets in CI
- S3:
  - Ordering, pickup slots and payments
  - Data layer
  - Consent banner (CMP) and Google Consent Mode
  - GA4
  - Server-side events from the order webhook
- S4 (Studio v1):
  - Home screen
  - Catalogue with channel toggles
  - Business info synced to Google
  - Reviews inbox
  - Redirects
  - Link-in-bio page and QR codes
- S5:
  - Product feeds (Merchant Center, Meta)
  - Social composer v1 (Instagram, Facebook, Google posts)
  - Media library
  - Season orchestrator v1
- S6:
  - Cake builder v1
  - Wedding funnel
  - Microsoft Clarity
  - Looker dashboards
  - Weekly report email
- S7:
  - AI visibility module
  - Geogrid and search-results integrations
  - TikTok, Pinterest and YouTube connectors
- S8:
  - Coco Copilot
  - Health score and alerts
  - Ads connectors (read-only)
  - Server-side GTM

Timing tip: if a big season is less than 8 weeks away, ship a standalone seasonal pre-order page during S0.

### 2.4 Launch quality gates

- SEO:
  - site crawl with 0 errors; canonicals point to themselves
  - 100% hreflang reciprocity
  - sitemaps submitted to Google and Bing
  - valid schema on every template; utility pages set to noindex
  - redirects tested
- GEO/AEO:
  - AI crawlers allowed (CDN and firewall checked)
  - llms.txt and JSON feeds live
  - fact sheets and FAQs in 3 languages
- Performance: Core Web Vitals budgets pass on a mid-range Android phone; JavaScript budget respected.
- Accessibility: 0 critical axe issues; keyboard and screen-reader smoke test.
- Tracking:
  - events verified in GA4 DebugView, Meta Test Events and TikTok Test Events
  - duplicate browser/server events confirmed merged
  - consent choices respected
  - click IDs and language saved on every order
- Languages:
  - native-speaker sign-off for EN/ES
  - no mixed-language interface
  - local formats (12,50 $ vs. $12.50; 14 h vs. 2 p.m.)
- Legal:
  - Loi 96 French-parity check
  - Loi 25 privacy policy, consent banner and consent logs
  - CASL consent records
  - terms shown in French first
- Operations:
  - owner trained
  - written procedures for reviews, closures and season switches
  - 2 weeks of daily post-launch monitoring

## PART 3 · SEO · GEO · AEO master strategy for local dominance

### 3.1 The 10 pillars

| # | Pillar | Core moves |
|---|---|---|
| 1 | Consistent entity | One name, address and phone everywhere; one descriptive sentence in 3 languages; 3 attributes repeated everywhere; Google IDs in schema |
| 2 | Maps excellence | Google, Apple and Bing profiles at a level competitors don't match; engineer Google's "Their website mentions…" snippets; automatic holiday hours |
| 3 | Reputation engine | QR + SMS review requests in 3 languages; replies within 48 h; more new reviews per month than any competitor |
| 4 | Technical & multilingual base | Server-rendered pages, schema graph, automated hreflang, Core Web Vitals, AI crawler access |
| 5 | Answer-first content | Hub pages, seasonal pages at permanent URLs, guides, gallery; written FR → EN → ES |
| 6 | Local authority | Directory listings, partners, press, "best of" lists, community |
| 7 | AI visibility system | Prompt panel in 3 languages, fixing gaps in cited sources, correcting errors, fact sheets |
| 8 | Social search | Instagram/TikTok/YouTube/Pinterest optimized for search; every post points to a page |
| 9 | Signal engineering | Consent, events, server-side conversions, feeds → ads-ready |
| 10 | Operating system | Coco Studio, routines, KPIs, governance |

### 3.2 Phases and win conditions

| Phase | Months | Objective | Win condition |
|---|---|---|---|
| Foundation | 0–3 | Correct, consistent and crawlable everywhere | 0 listing mismatches; site indexed in 3 languages; review engine live; AI baseline taken |
| Authority | 3–6 | Most-cited, most-reviewed | Top 3 across the core geogrid; local press and partners; AI mentions rising |
| Dominance | 6–12 | Own the results page and the AI answer | Targets from the earlier "definition of done" |
| Defend & expand | 12+ | Deepen the lead, open new segments | New languages or segments, maybe a 2nd location |

### 3.3 The complete topic universe

Phase markers: ① launch · ② months 2–6 · ③ advanced.

| Area | Topics |
|---|---|
| Research & intent | Keyword universe FR/EN/ES ① · intent and search-feature mapping ① · topical map ① · seasonality model ① · opportunity scoring (value × difficulty × language) ② · quarterly re-research ③ |
| Entity & brand | One name and address ① · descriptive sentence + 3 attributes ① · IDs in sameAs (kgmid, CID) ① · telling the brand apart from other "Coco Vanille" businesses ① · chef as an entity (Person schema, bio, interviews) ② · owning the brand-name results page ② · growth of brand-name searches as a KPI ② |
| Technical | See list below |
| On-page | Title/description templates per language ① · answer-first intros ① · question-style subheadings ① · fact tables ① · proof of experience and expertise (chef, process, real photos) ① · visible update dates ① · click-through testing using Search Console data ② · refresh queue for decaying pages ② · pruning and merging ③ |
| Local / Maps | See list below |
| Reputation | Review engine ① · reply deadline in 3 languages ① · Yelp/TripAdvisor accuracy ① · topic and sentiment analysis ② · customer photos and videos with permission ② · crisis protocol ② |
| Structured data | Bakery / Organization / WebSite ① · WebPage / Breadcrumb ① · Product/Offer with availability states (PreOrder, SoldOut) ① · Person ① · FAQ content ① · product review ratings ② · Menu ② · Event ② · Image/Video ② · JobPosting ② · Recipe ③ · validation in CI ① |
| AEO | Question bank in 3 languages ① · answer blocks in snippet formats (paragraph, list, table) ① · price answers ① · "People also ask" targeting ② · voice and conversational queries ② · practical guides (portions, storage, transport) ② · glossary ② · comparisons ② · turning on-site search and assistant logs into FAQs ③ |
| GEO | See list below |
| Visual & multimodal | Image SEO: filenames, alt text in 3 languages, captions, image sitemap ① · Google Lens / Circle to Search (original, distinctive photos) ② · Pinterest visual search ② · video thumbnails and transcripts ② · IPTC creator/copyright metadata ③ |
| Social search | Instagram: name field, bio, captions, alt text, location; public posts now appear in Google ① · TikTok: captions, on-screen text, spoken keywords ① · Facebook page ① · hashtag library ① · YouTube Shorts ② · Pinterest ② |
| Off-page & PR | Local press calendar ② · partner and sponsor links ② · getting onto "best of" lists that already rank ② · turning unlinked mentions into links ② · awards ③ · podcasts and radio ③ |
| Conversion & UX | Speed ① · sticky action bar ① · trust signals ① · checkout tested inside the Instagram browser ① · "how did you hear about us?" question ① · heatmaps (Clarity, with consent) ② · A/B tests ③ |
| Measurement | GA4 + GTM + Consent Mode ① · Search Console and Bing ① · Business Profile performance ① · geogrid ① · UTM naming rules ① · AI visibility ② · social analytics ② · BigQuery + Looker ② · offline conversion uploads ③ |
| Multilingual | Language tiers, hreflang, adaptation by native speakers, French parity ① (see the previous plan) |
| Compliance | Loi 96 for site, ads and social ① · Loi 25 consent, privacy assessments and access requests ① · CASL consent records ① · Competition Act (fake reviews, hidden fees) ① · platform policies and API terms ① |
| Zero-click & demand | Google profile treated as a second homepage ① · share of voice ② · brand demand ② · "search everywhere" mindset ② |
| Emerging | Local results in Google AI Mode ② · Gemini features in Maps answering from reviews and photos ② · AI agents completing checkout ③ · new languages ③ |

Technical topics:

- ① Server-side rendering
- ① AI-bot rules and CDN check
- ① Canonicals
- ① Sitemaps: pages, images, video, per language
- ① Automated hreflang with CI validation
- ① Site structure and automatic internal linking
- ① Breadcrumbs
- ① Redirect manager and migration
- ① 404/410 policy
- ① Core Web Vitals with real-user data
- ① Image and video pipeline
- ① Social share cards per language
- ① HTTPS and security headers
- ① Uptime and error monitoring
- ① IndexNow
- ① WCAG 2.2 AA accessibility
- ② Handling of gallery filter pages
- ② Bot log analysis

Local / Maps topics:

- ① Google profile 100% complete
- ① Products and food menu on the profile
- ① "Order online" link on the profile
- ① Steady posting and photo uploads
- ① Automatic special hours
- ① Apple Business Connect, including Showcases
- ① Bing Places
- ① Directory listings and address audit
- ① Geogrid tracking
- ② Category testing
- ② Engineering Google's "mentions" snippets
- ② Distance-ring strategy
- ② Landmark content: Zoo, Estriade, lac Boivin
- ② Service-area content only where it's real

GEO topics:

- ① Fact sheets in 3 languages
- ① llms.txt and JSON feeds
- ① Seeding the 3 attributes everywhere
- ② Automated prompt panel
- ② Gaps in the sources AI cites
- ② Original data and chef quotes
- ② Press, tourism and list mentions that confirm our facts
- ② Reddit and community presence (authentic only)
- ② YouTube presence
- ② Error-correction protocol
- ② AI crawler logs
- ③ Readiness for AI agents: feeds, ACP, MCP/NLWeb

### 3.4 Where each assistant gets its local answers

| Assistant | Main sources | What we do |
|---|---|---|
| Google AI Overviews / AI Mode / Gemini | Google index, Business Profile, reviews, photos | Profile excellence, specific reviews, answer-first pages |
| Gemini features in Google Maps | Profile data, reviews, photos | Reviews that name products, labeled photos, complete attributes |
| ChatGPT search | Bing's index, its own crawler (OAI-SearchBot), third-party data | Bing Places + Webmaster Tools; IndexNow; allow OAI-SearchBot; get onto the lists it cites |
| Copilot | Bing | Bing Places + Webmaster Tools |
| Perplexity | Own index; leans on "best of" lists, directories, review sites | Fix gaps in its cited sources; TripAdvisor/Yelp accuracy; fact sheet |
| Siri / Apple Maps / Apple Intelligence | Apple Business Connect, Apple ratings, partners such as Yelp | Business Connect complete; Yelp data accurate (never ask for Yelp reviews) |

## PART 4 · Signal engineering: ads-ready, ads-off

The rule: everything is wired and tested now; turning ads on later means adding budget and campaigns, not engineering work.

### 4.1 Principles

- One event dictionary feeds every platform.
- Consent first (Loi 25):
  - Tracking is off until the visitor opts in.
  - Google Consent Mode v2 (basic or advanced mode — decide with legal counsel).
  - Ad pixels are gated behind consent.
  - Server-side events respect the consent stored on each order.
- Money events are sent from the server.
  - Purchases and won quotes come from the order system's webhook, the source of truth.
  - The browser handles earlier steps.
  - Browser and server share an event_id so platforms merge the duplicates.
- Store click IDs, UTM parameters and language on every order and lead:
  - gclid / gbraid / wbraid (Google)
  - fbc / fbp (Meta)
  - ttclid / _ttp (TikTok)
  - epik (Pinterest)
  - This is what makes future ad attribution and offline uploads possible.
- Put a value on everything.
  - Purchases carry their amount.
  - Leads carry an estimated value by type (illustrative): wedding quote 300 $, corporate 150 $, custom cake 60 $. Refine these with real close rates.
- The business owns every account: Google Ads, GA4, GTM, Merchant Center, Business Profile, Meta Business Portfolio, TikTok Business Center, Pinterest, YouTube, the domain and DNS. Agencies get user access, never ownership.

### 4.2 Event dictionary

| Business event | GA4 | Meta | TikTok | Google Ads |
|---|---|---|---|---|
| Product viewed | view_item | ViewContent | ViewContent | — |
| Added to box | add_to_cart | AddToCart | AddToCart | secondary |
| Checkout started | begin_checkout | InitiateCheckout | InitiateCheckout | — |
| Pickup slot chosen | select_pickup_slot* | — | — | — |
| Payment info entered | add_payment_info | AddPaymentInfo | AddPaymentInfo | — |
| Order paid (server) | purchase | Purchase | CompletePayment† | Purchase (primary, value) |
| Cake builder started | builder_start* | CustomizeProduct | custom | — |
| Quote requested | generate_lead | Lead | SubmitForm | Lead (primary, value by type) |
| Tasting booked | book_tasting* | Schedule | SubmitForm | Lead (primary) |
| Call tapped | click_call* | Contact | Contact | secondary |
| Directions tapped | click_directions* | FindLocation | custom | secondary |
| Club / newsletter signup | sign_up | CompleteRegistration | CompleteRegistration | — |
| Review link / QR | click_review* | — | — | — |
| Language switched | language_switch* | — | — | — |

- \* Custom event.
- † Check TikTok's current standard-event list; it has been expanding.
- Pinterest equivalents: page_visit, add_to_cart, checkout, lead, signup.
- Parameters on every event:
  - language, page_type, season
  - item IDs
  - value / currency (CAD)
  - consent state

### 4.3 Browser and server events, deduplicated

```js
// Order confirmation page (browser) — fires only if the visitor consented
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: 'purchase',
  event_id: 'CV-004812',               // = order ID, shared with server events
  language: 'fr',
  fulfillment_type: 'pickup',
  ecommerce: {
    transaction_id: 'CV-004812',
    value: 75.0,
    currency: 'CAD',
    items: [{ item_id: 'buche-praline-8', item_name: 'Bûche praliné 8 po',
              item_category: 'Saisons/Noël', item_variant: '8 po', price: 75.0, quantity: 1 }]
  }
});
```

```ts
// Order webhook (server) → Meta CAPI, TikTok Events API, Google Ads — deduplicated by event_id
async function onOrderPaid(order: Order) {
  if (!order.consent.ads) return;                      // Loi 25: respect stored consent
  const user = {
    em: sha256(order.email.trim().toLowerCase()),
    ph: sha256(order.phoneE164),                       // E.164 digits, hashed
    fbc: order.clickIds.fbc, fbp: order.clickIds.fbp,
  };
  await meta.send({ event_name: 'Purchase', event_id: order.id, event_time: order.paidAt,
                    action_source: 'website', user_data: user,
                    custom_data: { value: order.subtotal, currency: 'CAD' } });
  await tiktok.send({ event: 'CompletePayment', event_id: order.id, ttclid: order.clickIds.ttclid });
  if (order.clickIds.gclid)
    await googleAds.uploadClickConversion({ gclid: order.clickIds.gclid, value: order.subtotal });
}
```

Send purchases to GA4 from one place only (browser or server), always with transaction_id.

### 4.4 One catalog feeds every channel

The catalogue in Studio generates the feeds for Google Merchant Center, the Meta catalog, the TikTok catalog and Pinterest.

| Field | Example | Why |
|---|---|---|
| id | buche-praline-8 | Stable across channels |
| title (FR and EN feeds) | Bûche praliné — 8 po (10–12 portions) | Portions in the title help Shopping and AI |
| image_link / additional_image_link | Hero + cross-section + scale shot | Algorithms and Lens reward variety |
| price | 75.00 CAD | — |
| availability (+ availability_date) | in_stock / preorder / out_of_stock | Seasonal products show as pre-order with a date |
| brand / condition | Coco Vanille / new | — |
| identifier_exists | no | Handmade products have no barcode (GTIN) |
| google_product_category | Food Items > Bakery > Cakes & Dessert Bars | — |
| product_type | Saisons > Noël > Bûches | Our own taxonomy |
| custom_label_0–4 | Season · margin tier · best-seller · lead time · occasion | Lets future ads be segmented |
| pickup_method / pickup_SLA | buy / next day | Pickup data; combined with the Business Profile link, this enables free local listings (phase 3) |

### 4.5 Google Ads readiness

- Link the accounts: Google Ads ↔ GA4 ↔ Merchant Center ↔ Business Profile (for location assets and ads in Maps) ↔ YouTube.
- Conversions:
  - Purchase: primary, with value.
  - Leads by type: primary, with value.
  - Calls and directions: secondary.
  - Enhanced conversions for web and leads.
  - Consent Mode v2.
  - An upload path for quotes won offline.
- Calls:
  - Use call assets.
  - Website call tracking uses forwarding numbers shown only to ad visitors.
  - Never change the main phone number on the Google profile.
- Audiences ready, with consent:
  - started the builder without finishing
  - viewed wedding pages
  - viewed seasonal pages
  - purchasers, used as an exclusion
- Paused campaign blueprints:
  - brand protection
  - local search ("gâteau de fête", "pâtisserie")
  - seasonal Performance Max campaigns using the feed and location assets (Noël, Fête des Mères)
  - wedding search (January–March)
  - remarketing
- Structure:
  - Each hub page maps to one ad group or asset group.
  - Ads land on the same indexable hub pages, so SEO work and ad quality reinforce each other.
- Targeting and copy:
  - Granby + 25 km, "people in or regularly in" the area.
  - French–English–Spanish keyword lists.
  - Negatives: recette, emploi, gratuit, DIY.
  - French ads are required when targeting Québec; English and Spanish versions run alongside.

### 4.6 Meta: feeding the ad algorithm and the organic algorithm

Ads:

- Setup:
  - Business Portfolio owned by the business, with the domain verified.
  - Pixel + Conversions API, deduplicated with event_id.
  - Match quality improved by sending hashed email/phone plus fbc/fbp.
- Optimization:
  - Optimize for Purchase with value.
  - Under roughly 50 conversions per week, start with Lead or AddToCart instead.
- Catalog: built from the feed, using lifestyle and cross-section images and accurate availability.
- Creative variety:
  - Meta's ad-matching engine (Andromeda) rewards many distinct concepts: the cut shot, behind the scenes, testimonial, a price and portions explainer.
  - French first, with English and Spanish variants.
- Audiences:
  - website visitors and Instagram/Facebook engagers (with consent)
  - customer lists (with consent)
  - recent buyers excluded
  - all fed to Advantage+ as suggestions
- Formats and offline data:
  - Partnership ads with local creators.
  - Click-to-WhatsApp ads for the Spanish-speaking segment.
  - Won wedding leads sent back through the Conversions API.

Organic Instagram and Facebook:

- What the algorithm rewards:
  - watch time
  - likes per view
  - shares by DM per view (the key signal for reaching non-followers)
  - saves
  - originality (reposted content gets pushed down)
- Tools to use:
  - Trial Reels to test with non-followers
  - collab posts with partners
  - location tags
  - keywords in captions and the name field
  - an Instagram broadcast channel
- Habits: post consistently and reply to comments fast.

### 4.7 TikTok

- Setup:
  - Business Center owned by the business.
  - Pixel + Events API, deduplicated with event_id, with ttclid/_ttp captured.
  - Catalog later.
- What the algorithm rewards:
  - completion and rewatches
  - shares, comments, follows
  - search keywords
  - native trends and sounds
  - recurring series
  - consistent posting
  - video replies to comments
- Paid, later:
  - Spark Ads to boost the best organic or creator posts
  - Search Ads
  - lead generation
- Regulatory note: in late 2024 Canada ordered TikTok to wind down its Canadian business. The app and self-serve ads remained available as of my last information — verify the current status. Keep TikTok as a channel, keep all raw video in our own media library, and never make TikTok a single point of failure.

### 4.8 Pinterest · YouTube · Microsoft

- Pinterest:
  - Claim the domain.
  - Install the tag and Conversions API.
  - Connect the catalog.
  - Enable Rich Pins (built from page metadata and schema).
  - One board per occasion, in FR and EN.
  - Use Pinterest Trends to time seasonal content.
- YouTube:
  - Link the channel to Google Ads.
  - Repurpose content as Shorts.
  - Add a few evergreen videos ("Comment transporter un gâteau", a tour of the shop).
  - YouTube is frequently cited in AI Overviews.
- Microsoft Ads: import the Google campaigns later; these ads also appear in Copilot experiences.

## PART 5 · Social and channel system

### 5.1 Channel roles

| Channel | Role | Language | Rhythm (example) | Key metric |
|---|---|---|---|---|
| Instagram | Flagship: discovery, DMs, customer content | FR first (+EN/ES lines) | See below | Shares and saves per view; link clicks |
| Facebook | 35+ audience, local groups, events, recommendations | FR | 3 posts/week + events | Reach in Granby; recommendations |
| TikTok | Reach under 35, trends, search | FR (+ES community content) | 3–5/week | Watch time, shares, profile → site |
| YouTube Shorts | Evergreen search; cited by AI Overviews | FR/EN | 3/week (repurposed) | Views from search |
| Pinterest | Evergreen inspiration traffic (weddings, birthdays) | FR/EN | 5 pins/week from the gallery | Outbound clicks |
| Google profile | Local conversion and freshness | FR (+EN) | 1–2 posts + 5 photos/week | Calls, directions, clicks |
| WhatsApp Business | Spanish speakers and newcomers; quick quotes | ES/FR/EN | On demand | Conversations → orders |
| Email (Brevo/Klaviyo) | Owned audience: pre-orders, birthdays | Per language | 2/month + automated flows | Revenue per send |
| SMS | Pickup notices; pre-order openings (with consent) | Per language | Event-based | Conversions |
| LinkedIn | Corporate orders | FR | 2/month | Corporate leads |

Instagram rhythm: 4 Reels + 2 carousels per week, plus daily Stories.

### 5.2 Content engine

- One half-day shoot per month produces 30+ assets.
  - 8–10 products, each filmed as: the cut, a pour or drip, decorating hands, packaging, the chef.
  - Plus the display case and one Granby location.
  - Cut into Reels/TikToks (9:16), carousels (4:5), pins (2:3), Google profile photos, site gallery images and Stories.
- Content pillars:
  - La coupe: cross-section reveals (satisfying "ASMR" videos)
  - Les coulisses: behind the scenes
  - Moments clients: customer reveals
  - Granby & saisons: local places and seasons
  - Savoir-faire utile: portions, transport (the same questions the site answers)
  - Drops & précommandes: limited items and pre-orders
  - L'équipe: the team
  - Cultures: quinceañera, Rosca de Reyes, Navidad
- Format rules:
  - Hook in the first 1–2 seconds.
  - On-screen text in French, with EN/ES subtitles.
  - Captions for viewers watching without sound.
  - Every post links to a page on the site (with UTM tags).

### 5.3 Social SEO rules

- Instagram:
  - Name field: "Coco Vanille · Pâtisserie Granby".
  - Bio: what you do, where, languages, call to action.
  - First caption line: keyword + "Granby".
  - Fill in alt text and the location tag.
  - Use 3–5 hashtags.
  - Public posts from professional accounts can appear in Google, so treat each caption like a meta description.
- TikTok:
  - Put keywords in the caption, in on-screen text, and say them out loud in the first seconds ("Le gâteau de fête le plus demandé à Granby…").
  - Use TikTok's own search suggestions as titles.
  - Group videos into series by occasion.
- YouTube Shorts: title = the search query; description with link and location; playlists by occasion.
- Pinterest:
  - Boards per occasion, in FR and EN.
  - Pin titles written as search queries ("Gâteau de mariage champêtre — Cantons-de-l'Est").
  - Pins link to gallery pages.
- Facebook:
  - Complete About section, services and menu; recommendations turned on.
  - Events for workshops and pre-order openings.
  - Genuine participation in local groups.

### 5.4 Automations and community

- Comment-to-DM (via ManyChat or another Meta partner tool): "Commente BÛCHE pour recevoir le lien des précommandes" sends the link automatically. The comments themselves also boost reach.
- DM keyword replies in FR/EN/ES, with a human taking over when needed:
  - GÂTEAU → cake builder
  - HEURES → opening hours
  - ALLERGIES → allergen page
- WhatsApp Business:
  - product catalog
  - quick replies in 3 languages
  - greeting and away messages
  - click-to-WhatsApp buttons on Spanish pages
- Instagram broadcast channel: "Le club des précommandes", for limited drops.
- Customer content: hashtag #cocovanillegranby, a permission-request template, and rights logged in the media library.
- Response time: comments and DMs answered the same business day.

### 5.5 Creator program

- Who: 10–15 local micro-creators across food, family, weddings, Granby lifestyle, the Latin community and English-speaking Townships.
- How:
  - seasonal tastings and collab posts
  - permission to run their posts as Meta partnership ads
  - TikTok Spark codes
  - trackable links and codes
- Disclosure: paid partnerships must be disclosed (Ad Standards Canada guidelines; Competition Bureau).

## PART 6 · Coco Studio: the online-presence control center

### 6.1 Principles

- Studio manages the online presence, not the store.
  - POS, inventory and kitchen production stay in the POS / order system.
  - Studio reads order data and controls what is shown online: which products are available, lead times, pre-order windows.
- Single source of truth: publish once, sync everywhere.
  - Site, schema, feeds, the Google profile, social and llms.txt all come from the same data.
- It tells you what to do next. Alerts and prioritized actions replace raw charts.
- Phone-first for quick actions. Daily display-case photo, sold out, closure, reply to a review — each in under a minute.
- Guardrails built in:
  - French-first publishing rule
  - AI never invents facts
  - allergens always verified by a human
  - every change logged

### 6.2 Home screen

```
+-- Coco Studio ------------------------------------ FR | EN | ES -- Proprio --+
| Santé de la présence en ligne : 82/100   (+4 cette semaine)                  |
+--------------------------------------+---------------------------------------+
| À FAIRE AUJOURD'HUI                  | 7 DERNIERS JOURS                      |
| [!] 2 avis sans réponse (dont 2/5)   | Impressions Google       4 812  +12 % |
| [!] Heures du 24 juin à saisir       | Itinéraires Maps           312   +8 % |
| [!] Flux Meta : 3 produits refusés   | Commandes en ligne          64  +15 % |
| [+] Page Pâques à rafraîchir (J-40)  | Mentions IA              17/30     +3 |
| [+] « gâteau licorne » : page à créer| Note · nouveaux avis     4,8/5     +9 |
+--------------------------------------+---------------------------------------+
| Géogrille « pâtisserie » : 72 % des points en top 3 · Social : 240 partages  |
+------------------------------------------------------------------------------+
| [+ Produit] [Vitrine du jour] [Fermeture exceptionnelle] [Publier] [Avis]    |
+------------------------------------------------------------------------------+
```

### 6.3 Modules

| Module | What it does | Data / APIs |
|---|---|---|
| Accueil (home) | Health score, today's to-dos, alerts, weekly KPIs, recommended actions, quick-action buttons | All modules |
| Catalogue | See below | Feeds, Google profile, IndexNow |
| Pages & contenu | See below | Search Console (per-page data) |
| Fiche d'entreprise (source of truth) | See below | Business Profile APIs, Facebook Pages API (where permitted), feeds |
| Annuaires (listings) | Platform-by-platform comparison against our data; fix tasks; manual checklist for Apple | Places API, Yelp, Foursquare, TripAdvisor, BrightLocal |
| Avis (reviews) | See below | Business Profile reviews + new-review notifications, Facebook, Yelp/TripAdvisor (read-only) |
| Cartes & local | Geogrid heatmaps for FR/EN/ES terms; Google profile performance and search terms; post composer; photo uploads; competitor overlay | Business Profile Performance API, Local Falcon / BrightLocal |
| Recherche (SEO) | Search Console and Bing by language folder; keywords ranking 4–15; pages competing for the same query; keyword-to-page map; technical health (crawl, links, schema, hreflang, Core Web Vitals); redirects | Search Console, Bing Webmaster, CrUX / PageSpeed Insights, real-user data |
| Visibilité IA | See below | OpenAI / Perplexity / Gemini / Anthropic APIs, search-results API (AI Overviews), CDN logs, GA4 |
| Social Studio | One asset → a version per platform; captions in 3 languages with keywords; calendar and approvals; hashtag and location library; customer-content inbox with rights; insights | Instagram/Facebook APIs, TikTok Content Posting, Pinterest, YouTube, Google posts, Threads |
| Médiathèque (media library) | All photos and videos; automatic tags and alt text in 3 languages; rights and consent; where each asset is used; sizes per platform | S3, vision model |
| Saisons & campagnes | Season orchestrator: dates drive content, products, banners, posts, emails, special hours and ad flights; promos; gift-card pushes | Everything |
| Courriels & SMS | Segments (language, birthday month, interests); automated flows; CASL consent records with proof; performance | Brevo/Klaviyo, Twilio |
| Demandes (leads) | Pipeline for wedding, corporate and custom-cake quotes; values; sources; won deals sent to ad platforms as offline conversions | Google Ads / Meta APIs |
| Publicité (ads, prête) | See below | Merchant API, Meta Marketing/Catalog, TikTok, Google Ads, Pinterest |
| Analytique | Executive view; visibility; acquisition (including AI and Maps channels); funnels; revenue by channel, language and product; cohorts; content → conversions; QR scans; "how did you hear" answers | GA4/BigQuery, order webhooks |
| Liens, QR & UTM | Link-in-bio page manager, QR codes with tracking, short links with UTMs | — |
| Veille (watch) | Competitors' ratings and reviews (via vendor), website changes, ad-library links; brand mentions; local events calendar; trends | BrightLocal, Visualping, alerts by RSS |
| Intégrations | One card per connection: status, permissions, token expiry, last sync, errors; webhook log; quotas; retries | — |
| Conformité & accès | See below | axe, consent banner logs |

Catalogue:

- Products, sizes, prices, lead times, allergens, dietary and cultural tags.
- Translation status per language.
- Per-channel on/off toggles.
- Seasonal scheduling.
- Pause / retire / redirect flows.
- A check that each product has the facts AI needs.
- The daily display-case photo.

Pages & contenu:

- Block editor limited to brand components.
- Hub pages, guides, gallery, real weddings, FAQ bank.
- Translation workflow.
- SEO panel: preview of the Google result in 3 languages, answer-first check, schema and hreflang status.
- Scheduling, version history, refresh queue.

Fiche d'entreprise (source of truth):

- Name, address, phone, hours.
- Holiday planner pre-filled with Québec holidays.
- Attributes and languages spoken.
- Descriptive sentence and the 3 attributes.
- Google IDs (CID, Place ID, kgmid).
- Every save pushes changes to the site, schema, Google profile, Facebook and feeds.

Avis (reviews):

- One inbox for all platforms.
- AI reply drafts in the reviewer's language, with a 48 h deadline timer.
- Topic and sentiment analysis; tracking of whether reviews mention our 3 attributes.
- Review-request engine and QR codes.
- Picking reviews to feature on the site.

Visibilité IA:

- Prompt panel across 3 languages and all engines.
- Tracks whether we're mentioned, how we're described, and whether the facts are right.
- Ranking of the sources AI cites, feeding outreach.
- Log of AI crawler visits.
- Visits referred by AI assistants.

Publicité (ads, prête):

- Feed manager with error diagnostics.
- Tag health: Meta match quality, duplicate merging, Google conversion status.
- Audiences (with consent).
- Spend, ROAS and marketing efficiency (total revenue ÷ total marketing spend) once ads run.
- UTM builder.

Conformité & accès:

- Loi 96 publishing rule: nothing goes live in EN/ES without its French version.
- Loi 25: consent logs, privacy requests, incident register, privacy assessment documents.
- CASL consent records.
- Accessibility scans.
- Audit log.
- Roles, 2FA and passkeys.

### 6.4 Six key flows

1. Add a product (about 3 minutes)
   - Upload photos. AI suggests a French name, an answer-first description, alt text and tags.
   - The owner enters price, sizes, lead time and allergens. Allergens are picked from a checklist by a human, never by AI.
   - Choose channels: site, Merchant, Meta, TikTok, Pinterest. Adding it to the Google profile becomes a task, since Google's API doesn't handle profile products.
   - French goes live immediately. EN/ES drafts are created and go to a reviewer.
   - On publish, automatically:
     - the page is built and added to the sitemap and IndexNow
     - feeds update and hub pages link to it
     - a "Nouveau !" post and a Google post are drafted
   - Readiness score checks: price, portions, lead time, allergens, at least 3 photos including a cross-section, at least 2 FAQs.
2. Pause or remove a product
   - "Épuisé aujourd'hui" (sold out today): availability is marked SoldOut; the page stays.
   - Seasonal pause: the page stays live with "De retour le…", marked as pre-order or out of stock. Feeds and the Google profile are updated.
   - Retire permanently: the page redirects (301) to the closest product or category; feeds and internal links are cleaned.
   - Delete (rare): the page returns 410.
   - Studio warns before you act, for example: "This page ranks #2 for 'fraisier granby' — pause or redirect it rather than deleting it."
3. Switch on a season (example: Noël)

   The season template creates the whole timeline automatically:

   | Date | What happens |
   |---|---|
   | Oct 1 | Refresh tasks for the Christmas hub page |
   | Nov 1 | Pre-orders open: products scheduled, site banner, Google post, email/SMS, social countdown, optional ad flight |
   | Dec 20 | Order cutoff; pickup slots close automatically |
   | Dec 24–26 | Special hours pushed to the Google profile |
   | Jan 2 | Page switches to "À l'an prochain" with a waitlist form |

4. Exceptional closure (snowstorm, sick day)
   - One button: enter the reason and duration.
   - Automatically:
     - a banner appears on the site in 3 languages
     - special hours are pushed to the Google profile
     - a post and an Instagram Story template are created
     - an SMS with a reschedule link goes to that day's pickups
     - tasks are created for Apple and Bing
   - Everything reverts automatically afterwards.
5. New review
   - Google notifies Studio; the review lands in the inbox.
   - Language is detected and an AI reply is drafted.
   - A person approves; the reply is posted through the API.
   - Topics are tagged.
   - If it's 3 stars or fewer: alert the owner and create a follow-up task.
6. Monday 7 a.m. report (email or WhatsApp to the owner)
   - 5 numbers, 3 wins, 3 actions.
   - A short written summary generated by Coco Copilot.

### 6.5 Presence Health Score (0–100)

| Component | Weight | Measured by |
|---|---|---|
| Reviews | 20 | Rating, new reviews vs. target, reply rate within 48 h |
| Listings accuracy | 15 | % of platforms matching our data |
| Search | 15 | Visibility trend, key positions, indexing errors |
| Maps | 15 | % of geogrid points in the top 3 |
| AI visibility | 10 | Mention rate, correct facts |
| Content freshness | 10 | Key pages within their refresh cycle; seasonal readiness |
| Technical | 10 | Core Web Vitals, valid schema and hreflang, uptime |
| Social rhythm | 5 | Posts vs. plan; engagement trend |

### 6.6 Roles

- Owner: everything.
- Manager: products, content, reviews, social.
- Staff: daily display-case photo, sold-out toggle, closure button.
- Agency: SEO, ads, analytics, integrations.
- Translator: translations only.
- Viewer: dashboards only.

### 6.7 Coco Copilot (the AI assistant inside Studio)

What it does:

- Drafts answer-first product descriptions in French, then EN/ES drafts.
- Writes alt text from photos.
- Drafts Google posts and captions for each platform.
- Drafts review replies.
- Suggests FAQs from questions found in DMs, reviews, Search Console queries and on-site searches.
- Writes content briefs from keywords ranking 4–15.
- Explains anomalies. Example: "Impressions on /gateaux-de-fete/ fell 20%; position for 'gâteau de fête granby' dropped from 3 to 7 after competitor X added 40 photos."
- Writes the weekly summary.

Guardrails:

- Brand voice guide and glossary.
- Facts are always pulled from Studio data, never invented.
- Allergen text is never AI-written without human verification.
- French first.
- Nothing publishes without human approval.

### 6.8 Data model

```
Business ─ Location ─ HoursRule · SpecialHours · Attribute · ExternalId (CID, PlaceID, kgmid)
Product ─ Variant (size, portions, price) ─ OptionGroup · Allergen · Tag · Season
        └ ChannelListing (site · google · merchant · meta · tiktok · pinterest: state, errors)
Page ─ Block · FAQ · Translation (locale, status, outdatedSince) · Redirect
Media (rights, consent, tags, altText×3) · SocialPost (platform, locale, schedule, metrics)
Listing (platform, snapshot, diff) · Review (platform, locale, rating, topics) · ReviewReply
Keyword (locale, page, rank history) · GeogridScan · Prompt · PromptRun (engine, mentioned, sources)
Lead (type, value, source, clickIds, stage) · Consent (purpose, timestamp, proof) · Campaign
Integration (scopes, token, lastSync, errors) · Job · Alert · AuditLog · User/Role
```

## PART 7 · Analytics and API inventory

### 7.1 Tracking stack

- Tag management: GTM in the browser + server-side GTM in Montréal, driven by the event dictionary.
- Consent: a banner compliant with Loi 25 that supports Google Consent Mode v2 (e.g., Axeptio, Cookiebot, Didomi).
- Analytics and ad tags:
  - GA4 with BigQuery export
  - Google Ads tag (paused until ads start)
  - Meta Pixel + Conversions API
  - TikTok Pixel + Events API
  - Pinterest Tag + Conversions API
  - Microsoft UET (later)
- Real-visitor performance: the web-vitals library sending to GA4/BigQuery. Small sites often lack Chrome's public CrUX data, so we collect our own.
- Microsoft Clarity: heatmaps and recordings, with consent and personal data masked.
- Self-reported attribution: "how did you hear about us?" at checkout and on quotes. QR codes and short links carry UTMs.

### 7.2 APIs to connect

| Area | API / source | We pull | We push | Notes |
|---|---|---|---|---|
| Google profile | See below | Metrics, search terms, reviews | Hours, attributes, description, order link, posts, photos, menu, review replies | Access requires Google approval |
| Google public data | Places API (New) | Public rating, count, hours | — | Respect caching terms; use vendors for competitor history |
| Search | Search Console API (+ URL Inspection) | Queries, pages, positions, index status | Sitemaps | One property per language folder |
| Bing | Bing Webmaster API + IndexNow | Queries, crawl | URL submissions | Feeds Copilot |
| Web analytics | GA4 Data API + BigQuery export + Measurement Protocol | Traffic, events, conversions | Server-side events | Consent-aware |
| Performance | CrUX, PageSpeed Insights, our own real-user data | Core Web Vitals | — | — |
| Ads (future) | Google Ads API, Merchant API | Spend, conversions, feed issues | Offline conversions, product data | Google Ads needs a developer token |
| Meta | Graph API (Pages, Instagram, Messaging), Marketing, Conversions API, Catalog | Insights, comments, mentions, DMs | Posts, Reels, replies, events, catalog | Meta app review and permissions |
| TikTok | Content Posting API, Business API, Events API, Catalog | Video insights | Posts, events, catalog | Unaudited apps can only post privately |
| Pinterest | API v5 + Conversions API | Pin analytics | Pins, catalog, events | — |
| YouTube | Data API + Analytics API | Views, search traffic | Shorts uploads | Uploads use a lot of quota |
| Threads | Threads API | Insights | Posts | Optional |
| WhatsApp | Business Platform (Cloud API) | Conversations | Notifications | Paid per message |
| Other reviews | Yelp API, TripAdvisor Content API, Facebook ratings | Rating, counts, excerpts | — (reply manually) | Yelp has paid tiers; TripAdvisor requires approval |
| Listings | Foursquare Places, BrightLocal / Whitespark | Listing data, directory citations | — | Apple through the Business Connect interface |
| Local rank | Local Falcon or BrightLocal API | Geogrid ranks | — | Weekly |
| Search results | DataForSEO / SerpApi | Rankings, "People also ask", AI Overview presence | — | Weekly |
| AI engines | OpenAI (web search), Perplexity Sonar, Gemini (Search grounding), Anthropic (web search) | Answers, citations | — | API answers approximate the consumer apps; add manual checks |
| Orders | Square / Shopify / Stripe webhooks | Orders, items, values, consent, click IDs | — | Source of truth for conversions |
| Email / SMS | Brevo or Klaviyo, Twilio | Campaigns, flows, consents | Sends | CASL consent records |
| Logs & monitoring | Vercel / Cloudflare logs, Sentry, Better Stack | AI crawler visits, 404s, errors, uptime | Alerts | Daily or real-time |
| Mentions | Google Alerts / Talkwalker (RSS), Visualping | Mentions, competitor changes | — | Daily |

Google profile APIs: Business Information, Place Actions, Performance and Notifications, plus the older v4 endpoints for reviews, posts, media and food menus.

### 7.3 KPI tree and reporting rhythm

```
NORTH STAR  Online-generated revenue (online orders + won quotes)
            + local visit signals (calls + direction requests)
├─ Visibility   Google/Bing impressions · Maps views · % geogrid points in top 3
│               · AI mention rate · local social reach
├─ Engagement   sessions · Business Profile actions · profile visits · link clicks · DMs
├─ Conversion   conversion rate · average order · builder completion · quote → deposit
└─ Loyalty      repeat customers · reviews/month & rating · UGC · email/SMS list growth
Inputs we control: pages published · posts · reviews answered · links earned · listing accuracy
```

| Rhythm | Audience | Content |
|---|---|---|
| Weekly (Monday) | Owner | 6 numbers + 3 actions |
| Monthly | Strategy review | Full report: geogrid, AI panel, search, social, reputation, revenue, each split by language |
| Quarterly | Business review | Strategy review and roadmap |

### 7.4 Attribution that sees AI, TikTok and word of mouth

- Strict UTM naming rules. UTMs on:
  - Google profile links
  - social bios
  - QR codes
  - emails and SMS
- Custom GA4 channel groups:
  - AI assistants
  - Maps / Google profile
  - Social organic
  - Social paid
  - Email/SMS
  - QR/offline
- Self-reported answer at checkout: « Comment avez-vous entendu parler de nous ? » Options:
  - Google
  - Google Maps
  - Instagram
  - Facebook
  - TikTok
  - ChatGPT / IA
  - Bouche-à-oreille (word of mouth)
  - Passage devant la boutique (walked past)
  - Zoo / tourisme
  - Autre (other)
  - This captures what tools miss.
- Click IDs stored on orders and leads; won quotes uploaded to ad platforms as offline conversions.

## PART 8 · Governance and risks

- Ownership: the business owns every account; agencies get user access. 2FA or passkeys everywhere, least privilege, a secrets vault, token rotation, audit log.
- Loi 25:
  - Tracking is opt-in.
  - Pixels are gated behind consent.
  - Server-side events respect stored consent.
  - Privacy assessments for Google, Meta, TikTok and US-based tools.
  - A workflow for privacy requests.
- Loi 96:
  - French first on the site, in ads and on social.
  - Studio's publishing rule enforces it.
- CASL: consent records, an unsubscribe in every message, sender identification.
- Platform policies:
  - No review gating and no incentives for reviews (Google).
  - Meta's 24-hour messaging window for business-initiated DMs.
  - TikTok's audit before public posting through its API.
  - Google Maps Platform caching terms.
  - Influencer disclosure rules.
- AI: Copilot never invents facts; allergens are verified by a human; nothing publishes without human approval.
- Resilience:
  - We own our data warehouse and all raw media.
  - No single platform is a point of failure (TikTok especially).
  - Every integration fails gracefully, with alerts.

## Next steps

- Paste your topic list and I'll map every item onto Part 3 and fill any gaps.
- Confirm which POS they use and share access to their accounts (Google profile, Instagram, Facebook, domain).
- Approve the 2-week research sprint and pick the shoot dates.
- Lock in the build path: one Next.js + Payload app (recommended).

I can then prepare:

- the research brief template
- the Payload content-type specification
- the tracking plan as a spreadsheet or JSON
- Studio wireframes, screen by screen
- the sprint backlog as user stories
