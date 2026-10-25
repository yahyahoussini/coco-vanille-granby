# 06 · SEO / AEO / GEO platform facts, verified (2026-10-25)

Scope: the platform facts that plan-v1 (§1, §2, §11–§13, §16, §17), plan-v0a §3–§5, plan-v0b §B2–§B6 and plan-v0c depend on, plus 2026 best practices for a **self-hosted .com on a Québec VPS** (no Vercel, no Cloudflare at launch: research/17 §6).

Method and limits (read first):

- **25 WebSearch queries** (the cap). Results are US-located summaries. WebFetch and curl are blocked, so no official page was opened directly.
- research/18 is cited, not re-searched: FAQ rich results, Apple Business rename, OpenAI ACP, Google UCP, ChatGPT search providers, GBP API (R18 #1, #2, #9, #10, #11a, #17).
- Verdicts:
  - **Confirmed**: an official page (Google, Apple, Microsoft, StatCounter, web.dev) is among the results and says it.
  - **Partly**: true with a correction, part of the item missing, or only secondary sources (trade press quoting the platform).
  - **Not found**: no source in 25 queries. This is not the same as false.
  - **Contradicted**: the plan's wording is wrong or out of date.
- Owner self-tests (§4) settle the Canada-only questions faster than US-located search.
- **Adversarial fact-check pass (2026-10-25, 8 more queries):** 11 high-risk claims re-tested; corrections are applied in place and listed in the Verification log at the end.

---

## 0. Bottom line

| Verdict | Items |
|---|---|
| Confirmed | (a) AI Overviews in Canada (EN, 2024-10-28) and AI Mode in French (2025-10-14) · (b) iOS ≈ 65 % of Canadian mobile · (e) Search Console Generative AI report exists (2026-06-03) · (f) Bing AI Performance public preview (Microsoft blog, 2026-02-10) · (n) DuckAssistBot exists, real-time AI answers, not training (DuckDuckGo help) · (p) Core Web Vitals thresholds · (q) Merchant Center free local listings + pickup in Canada · (k) Merchant Center availability mapping |
| Partly | (a) AI Mode in English in Canada (Canada listed on Google's help page; language not seen) · (b) Bing ≈ 10 % in Canada · (c) Apple Business actions/Showcases (country list missing) and new Bing Places · (d) GBP: food-ordering custom links (Confirmed); Q&A API end 2025-11-03 (secondary, consistent); public Q&A → Ask Maps **early Dec 2025** (day UNVERIFIED) · (e) "Search generative AI" control (secondary quoting Google); "all sites by 2026-08-31" disputed · (f) Bing AI Performance CSV-only / no API (Microsoft staff on X, secondary) · (g) GA4 AI Assistant channel ("not retroactive" in one source only) · (h) IndexNow list · (j) llms.txt · (k) 2025 deprecations · (l) Ahrefs study (0.218 UNVERIFIED) · (m) Google statements · (n) crawler table · (o) local data sources |
| Not found | (a) AI Overviews **in French** in Canada (re-searched: still not found) · (b) per-device engine shares · (d) official category names, 750-char description, posts/products/menu changes · (i) any engine that **honours** Content-Signal · (k) self-serving review rule, Bakery type, Menu, Event, VideoObject status · (n) ChatGPT-User "Dec 2025 robots.txt change" (re-searched: no source) · (q) perishables rule · (r) named ordering partners in Canada |
| Contradicted | plan-v1 §2 "mentions correlate 0.664 with **AI visibility**": the study measured **AI Overview brand mentions** among **75k brands with DR > 40** only (l) · rank-first 05 "pre-load the FAQ in GBP Q&A": Q&A is gone (d) · plan-v0a §5 "seasonal products show as **pre-order**": Google reserves `preorder` for never-released products (k) · plan-v0c "create an AI assistants channel": now native in GA4 (g) |

---

## 1. Verdict per item

### (a) AI Overviews and AI Mode in Canada (EN/FR)

| Fact | Verdict | Source (date) |
|---|---|---|
| AI Overviews full rollout in Canada on **2024-10-28**, after a small test. **English only at launch; French "not yet supported"** | Confirmed | W5 (Google Canada blog), W6 (MobileSyrup, 2024-10-28) |
| AI Overviews **in French** in Canada today | **Not found** (re-searched in the fact-check pass: still no source) | France: rollout announced for "cet été" 2026 (F8, Siècle Digital, 2026-06-30) and later reported switched on (F9, PPC Land, date not in summary). The exact day **2026-07-22** comes from W4 only: **UNVERIFIED**. That shows French-language AI Overviews exist, but not that they run in Canada. The Oct 2024 Canadian launch listed English, Hindi, Indonesian, Japanese, Portuguese, Spanish and said French was not supported (W6, F7) |
| AI Mode **in French**, as a tab in Search and in the Google app (Android, iOS) | **Confirmed** (2025-10-14) | W1 (Google's fr-CA blog) |
| AI Mode in English in Canada | Partly | W3: "180 English-speaking countries" (date not in the summary). W2: Google's AI Mode help page **lists Canada among supported countries** (fact-check pass); the language list for Canada was not in the summary. F10 (Thurrott): AI Mode in "over 200 countries" (date not in summary). Launch date in Canada: UNVERIFIED |

**Implication:** French queries in Granby can already trigger AI Mode, so French pages compete there from day 1. French AI Overviews: self-test T1 (§4). Plan-v1 §2 and §13: replace "[verify-CA]" with these dates.

### (b) StatCounter Canada

| Fact | Verdict | Source (date) |
|---|---|---|
| Bing **≈ 9.8–10.1 %** of Canadian search (pages show months from May to Sept 2026: 10.03 % May, 9.79–9.82 % June, 10.06 % Sept). Top engine **≈ 85–86 %**: the label was cut from the summary, so "Google" is an inference. Yahoo ≈ 2.3–2.5 %, DuckDuckGo ≈ 1.5 % | Partly (inconsistent snapshots) | W7, W8 |
| Engine share **by device** (mobile vs desktop) | **Not found** (the page needs JavaScript) | W8 |
| Platform split June 2026: desktop 55.23 %, mobile 42.14 % (a StatCounter platform page; it's unclear whether this covers search traffic or all web traffic) | Partly | W9 |
| Mobile OS, Canada, **Sept 2026: iOS 64.87 %, Android 35.13 %**. July 2026 ≈ 65.9 / 34.1; June 2026 ≈ 61 / 39 (June is an outlier; cause unknown) | **Confirmed** (StatCounter; re-checked in the fact-check pass, values read from table text, not the JS chart) | W10 |

**Implication:**
- Bing is about 1 search in 10 in Canada, and it also feeds Copilot (f). Bing Webmaster Tools + Bing Places are a week-1 task, not optional.
- iPhones are about two-thirds of Canadian mobile, so Apple Maps / Apple Business and Safari-iOS QA come first (practice 7).
- Quote these numbers only with month and URL. Re-read StatCounter in the baseline week.

### (c) Apple Business + Bing Places

| Fact | Verdict | Source (date) |
|---|---|---|
| Rename "Apple Business Connect" → "Apple Business" (2026-04-14, secondary) | Partly (cite R18 #2) | R18 |
| Apple's **Canadian** page: place-card actions to **order food**, book, schedule "and more" | **Confirmed** (page undated) | W11 |
| **Showcases** can carry a **custom action link** (promote a new or seasonal product). Actions sit on the Primary Action or "More" button. Customers need **iOS / iPadOS 17.4+** | Confirmed (Apple docs) | W12, W13, W14 |
| Action link URL must be **https://**. **UTM parameters:** one Apple version forbids them, an older one allowed "approved analytics parameters" | Partly (conflicting Apple docs) | W12, W14 |
| A country list for actions and Showcases (Canada) | **Not found** | — |
| **Bing Places relaunched 2025-10-03**: portal moved to **bing.com/forbusiness**, rebuilt Google import (name, hours, contact), bulk edit, health indicators, a "Recommendation Tool". "Tighter integration with Bing Maps and Copilot" is announced as **planned** | **Confirmed** (Bing blog, Oct 2025) | W15, W16, W17 |

**Implication:**
- Apple: the "Commander" action goes to `https://cocovanillegranby.com/commander/`. Whether a UTM tag is allowed is decided in the Apple Business form (self-test T3). GA4 then relies on the referrer. A Showcase per season (bûche, Easter) links to the seasonal page.
- Bing Places: import from GBP **only after** the GBP name, category and hours are final (the import copies errors too).

### (d) Google Business Profile, 2025–2026

| Fact | Verdict | Source (date) |
|---|---|---|
| **Food Ordering section**: add third-party providers **or custom ordering links**, hide/show ordering, mark an option **preferred for pickup / delivery**. **Canada is among the countries** with online ordering providers. Depending on the region, links sit under "Order online" or "Place an order" | **Confirmed** (Google help, undated) | W18, W19 |
| Whether a **Bakery / Pastry shop** profile gets the Food Ordering section (the help page is written for food businesses) | Not found | Self-test T2 |
| Google ended its own "Order with Google" checkout in 2024 | **UNVERIFIED** (one vendor blog) | W21 |
| **Q&A removed**: the Q&A API was discontinued on **2025-11-03** (announced 2025-09-17). In **early December 2025** Google said the Q&A feature was changing: customers now ask in Google Maps and get AI answers built from the business's info and reviews ("Ask Maps"). The exact day "2025-12-03" (earlier draft) is **UNVERIFIED**. The "Ask a question" button began disappearing from some listings; old Q&A may still show (Jan 2026). Ask Maps in Canada: English, ~Aug 2026 (R18 #19, secondary) | Partly (secondary, consistent; F6 predates the December change) | W22, W23, W24, W25, F4, F5, F6 |
| Primary category = what the business **is**, not what it sells. Add extra categories only for real special services, not one per product | Confirmed (Google help) | W26, W27 |
| Exact picklist names "Pastry shop", "Cake shop", "Wedding bakery", "Dessert shop" | **Not found** (one third-party post suggests "Cake shop" or "Dessert restaurant" as secondary categories) | W28 |
| 750-character description limit; 2025–2026 changes to posts, products or the menu editor | **Not found** (API facts: R18 #17, UNVERIFIED) | — |

**Implication:**
- Put a **custom ordering link** to our own `/commander/`, marked **preferred for pickup**, in the GBP Food Ordering section **if the section is offered** for our category (T2). Then no delivery-app commission sits between Google and the order.
- Studio's GBP module drops any Q&A sync. Questions move to the site's FAQ (`<details>`, server HTML) and to review replies.
- Categories: read the dashboard picklist (T2). Don't take names from blogs. "Wedding bakery" also stays off unless weddings are proven (research/01: weddings not evidenced).

### (e) Search Console: AI reporting and AI control

| Fact | Verdict | Source (date) |
|---|---|---|
| **"Search Generative AI performance reports"** launched **2026-06-03**. They show **impressions** in AI Overviews, AI Mode and Discover's generative AI features, by page, country, device (Search only) and date, at hourly / daily / weekly / monthly grain. The data also stays in the main Performance report | **Confirmed** (Google Search Central blog, June 2026) | W29, W30 |
| **No clicks, no CTR**. One source adds no queries and no average position | Partly | W29, W30, W31 |
| A subset of sites first (Google's post: "a subset of websites"); wider on 23 June; **all sites worldwide as of 2026-08-31** | Partly, **disputed** (secondary only: F1 and W31 say worldwide; F2 still calls it beta, F3 describes a UK subset first). Google's own "all sites" statement not seen: UNVERIFIED. Self-test T4 settles it | W29, W31, W30, F1, F2, F3 |
| **"Search generative AI" control** in Settings: Include (default) or Exclude from AI Overviews, AI Mode and Discover generative AI. Google: not a ranking signal for core web search; "sites that opt out will not receive traffic or impressions from our generative AI features." It followed a UK order | Partly (secondary quoting Google; first reported 2026-06-02) | W31, W32, W33, W34 |

**Implication:**
- The Generative AI report gives **page-level impressions**, not per-prompt citations. So plan-v1 §1 AEO "AI Overview citation on ≥ 10 of 30 prompts" still needs the SERP API and phone checks. The report is the trend line.
- Gates check monthly that the control reads **Include** (practice 2).

### (f) Bing Webmaster Tools: AI Performance

| Fact | Verdict | Source (date) |
|---|---|---|
| **AI Performance** report, **public preview announced 2026-02-10** (Microsoft Bing Webmaster blog; date per F12), open to any verified site. It counts citations across **Microsoft Copilot, AI-generated summaries in Bing, and select partner integrations**. Views: daily overview, page-level citations, **grounding queries** ("the key phrases the AI used when retrieving content", Microsoft) | **Confirmed** (Microsoft's post found in the fact-check pass; excerpt only) | F11, F12, W35, W36, W37, W38 |
| **CSV export only, no API** ("on the backlog", Fabrice Canel on X, no timeline). No clicks. Grounding queries aren't linked to specific citations. Data is **a sample of overall citation activity** (Microsoft) → a floor. Page counts reflect citation frequency, not ranking or importance (Microsoft) | Sampling: Confirmed (F11). CSV/no API: Partly (secondary) | F11, W36, W37 |

**Implication:**
- Studio › Visibilité IA imports the three CSVs weekly by hand (one upload field). There is no API to automate it.
- Plan-v1 §1 GEO already names "Bing AI Performance": keep it, labelled "sampled; Copilot + Bing AI summaries + select partners".
- The rank-first claim "Bing Feb 2026 guidelines: NOARCHIVE keeps a page out of Copilot" (RS03, RS08) was not searched: **UNVERIFIED** (queue).

### (g) GA4: AI traffic

| Fact | Verdict | Source (date) |
|---|---|---|
| Native **"AI Assistant"** channel in the Default Channel Group, announced **2026-05-13**, rolled out gradually through about early-to-mid June 2026. It needs no setup | Partly (secondary citing Google's "What's new"; date consistent across sources) | W39, W40, W41, W42, F13 |
| **Not retroactive** | Partly: **one source only** (F13, Terminus) states it; treat as likely, not proven. Do not confuse with the separate **"Source Group" dimension** (2026-06-11, one source says it fills history retroactively) | F13 |
| Matched sessions get medium `ai-assistant`, campaign `(ai-assistant)`. Google doesn't publish the full referrer list (ChatGPT, Gemini, Claude named as confirmed in one source; others add Copilot, DeepSeek, Grok). **Perplexity: one source says it is not included and stays in Referral**; others differ | Partly (conflicting secondary) | W39, W41, F14, F15 |
| **AI Overviews and AI Mode traffic is not in this channel** (it stays Organic Search) | Partly | W39, W41 |

**Implication:**
- Use the native channel, plus the rank-first regex as a custom channel group (RS10) to catch Perplexity, Meta AI and the rest.
- Google's AI surfaces are measured only by the Search Console report (e).
- Both GA4 numbers are a **floor**: referrer-less visits fall into Direct (RS10).
- `utm_source=chatgpt.com` is still unverified: R18 #11b, self-test 11b.

### (h) IndexNow participants

| Fact | Verdict | Source |
|---|---|---|
| **Bing, Yandex, Naver, Seznam, Yep** (Yep in only two sources). **Google does not participate** (as of April 2026). **Amazon: not found as a participant** | Partly (secondary; indexnow.org not opened) | W43, W44, W45; R16b row 19 (≤ 10,000 URLs per request) |

**Implication:** keep the plan-v1 §12 hook as written. Google still gets the sitemap and Search Console URL inspection (RS03). Pinging from staging stays off (research/17).

### (i) Cloudflare Content Signals

| Fact | Verdict | Source (date) |
|---|---|---|
| Three directives: `search`, `ai-input`, `ai-train`. Cloudflare's managed robots.txt sets `search=yes, ai-train=no` on **3.8 M+ domains** and leaves `ai-input` unset | Partly (secondary; policy Sept 2025 per research/17) | W46, W47; R17 §6.1 |
| **Who honours it:** **no** major operator (Google, OpenAI, Anthropic, Meta) has publicly committed. Google got "a heads up" and hasn't said. One German blog says OpenAI **fetches** these files often (a crawl, not a commitment). The signals are preferences, not enforcement | **Not found** (no honouring operator) | W46, W47, W48, W49 |

**Implication:**
- We are on a VPS without Cloudflare, so **nothing injects `ai-train=no`** for us.
- A `Content-Signal: search=yes, ai-input=yes, ai-train=yes` line costs nothing and states the owner's choice, but **expect zero effect**.
- In plan-v1 §16, downgrade it from a correction to an optional line. It must never be a gate.

### (j) llms.txt

| Fact | Verdict | Source (date) |
|---|---|---|
| Google: Mueller (**2025-06-17**): "no AI system currently uses llms.txt". Illyes (July 2025): Google doesn't support it and isn't planning to. One source says Google's AI optimization guide (updated June 2026) states that no special machine-readable files are needed | Partly (secondary quoting Google staff) | W50, W51 |
| OpenAI, Anthropic, Perplexity: **no official statement** in the results. Vendor claims conflict. A vendor log panel (EZY.ai, 83 sites, Apr–Jul 2026; page not identified) saw a handful of fetches against thousands of robots.txt fetches | Not found (official) | W51, W52 |

**Implication:** keep plan-v1 §16 ("optional, lowest priority"). Plan-v0a ① "llms.txt and JSON feeds live" → move llms.txt to ③. Generate it from the same data as the site if it costs nothing, and never gate on it.

### (k) Structured data, 2025–2026

| Fact | Verdict | Source (date) |
|---|---|---|
| FAQ rich results no longer shown (2026-05-07). Tooling removal announced for June / Aug 2026 | Confirmed (cite R18 #1) | R18 |
| FAQ markup is still read for understanding; "unused structured data doesn't cause problems" (Google, quoted) | Partly (secondary) | W53, W55, W56 |
| HowTo: limited in **Aug 2023** (removed from desktop). A "Nov 2025 HowTo deprecation" was seen in one source only | Partly / UNVERIFIED | W55 |
| **June 2025:** rich results phased out for Book Actions, Course Info, ClaimReview, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing. Search Console reports were removed Sept 2025. **None is used by a bakery** | Partly (secondary, consistent) | W53, W54 |
| **Availability mapping** (Merchant Center): `in_stock` ← InStock, LimitedAvailability, OnlineOnly · `out_of_stock` ← Discontinued, InStoreOnly, OutOfStock, **SoldOut** · `preorder` ← **PreOrder**, PreSale · `backorder` ← **BackOrder**. **`preorder` is only for products not yet released.** Existing out-of-stock items taking orders → **`backorder`**. Both need an **availability date, visible on the landing page** | **Confirmed** (Google Merchant Center Help) | W57 (W58: ≤ 365 days ahead, UNVERIFIED) |
| Self-serving review rule (no `aggregateRating` on our own LocalBusiness) | **Not found** this session. rank-first cites a 2019 Google guideline (RS 05, secondary). plan-v1 §4 already bans it | RS05 |
| `Bakery` type, `hasMenu`/Menu, Event, VideoObject status in 2026 | **Not found** this session | Queue §5 |

**Implication:** see §2 (plan-v0a §3.2, §5) and the mapping sketch below. Validate `Bakery` and every node with validator.schema.org and the Rich Results Test in CI (plan-v1 `npm run gate` → schema). That settles the type question at build time.

```js
// availability.js — one Studio state → schema.org Offer.availability + Merchant Center feed value
// Mapping from Google Merchant Center Help "Availability" (support.google.com/merchants/answer/6324448)
const MAP = {
  disponible:     { schema: 'https://schema.org/InStock',      feed: 'in_stock' },
  epuise_du_jour: { schema: 'https://schema.org/SoldOut',      feed: 'out_of_stock' }, // « Épuisé aujourd'hui »
  retour_saison:  { schema: 'https://schema.org/BackOrder',    feed: 'backorder', needsDate: true }, // sold before, orders open early (bûche)
  nouveaute:      { schema: 'https://schema.org/PreOrder',     feed: 'preorder',  needsDate: true }, // never sold before
  retire:         { schema: 'https://schema.org/Discontinued', feed: 'out_of_stock' },
};
export function availabilityFor(state, firstPickupDateISO) {
  const m = MAP[state];
  if (!m) throw new Error(`Unknown state: ${state}`);
  if (m.needsDate && !firstPickupDateISO) throw new Error(`${state}: availability date required and shown on the page`);
  return { schema: m.schema, feed: m.feed, availabilityDate: m.needsDate ? firstPickupDateISO : undefined };
}
```

### (l) Ahrefs "brand mentions 0.664 vs backlinks 0.218"

| Fact | Verdict | Source (date) |
|---|---|---|
| Ahrefs, **2025-05-26**, "An Analysis of AI Overview Brand Visibility Factors (75K Brands Studied)". It measured brand **mentions inside Google AI Overviews** (via Ahrefs Brand Radar), for **domains with DR > 40**, each on its highest-volume keyword (≥ 800 searches/month); the ~26 % with zero mentions were excluded. **Spearman** correlations: branded web mentions **0.664**, branded anchors **0.527**, branded search volume **0.392**. Ahrefs itself calls all factors "moderate to very weak" | **Confirmed** (Ahrefs; re-checked in the fact-check pass) | W59 |
| Backlinks **0.218** | **UNVERIFIED** (re-searched: Ahrefs lists backlinks as a tested factor, but no coefficient in the excerpts; the number appears only in a Medium post) | W59, W60 |
| "YouTube mentions ≈ 0.737 (Dec 2025 extension)" (RS08) | Not found this session | — |

**Implication:** plan-v1 §2 and rank-first 08/09 overstate the scope. The study covers AI Overviews only (not ChatGPT, Perplexity…), large brands (DR > 40), and correlation, not cause. A tiny local bakery is outside the sample. The direction still holds (earned mentions > link building), so the off-site budget stays. The wording changes (§2).

### (m) Google statements on AI features

| Fact | Verdict | Source (date) |
|---|---|---|
| To appear in AI Overviews / AI Mode, a page only has to be **indexed and eligible for a snippet**. There is no separate AI index or submission | Partly (secondary quoting "AI features and your website") | W63, W64 |
| `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex` control what AI features use, **and they also cut the normal snippet** | Partly (secondary quoting Google) | W63, W64 |
| **Google-Extended** doesn't affect inclusion in Search and isn't a ranking signal. It's a robots.txt token (no own user-agent) for Gemini Apps and Vertex AI | Partly (secondary quoting updated Google docs) | W61, W62 |
| "No special optimization needed" (Google's AI optimization guide, May/July 2026, per RS15) | Partly (one secondary + RS) | W50, RS08, RS15 |

**Implication:** never put `nosnippet` or a low `max-snippet` on citable pages. `data-nosnippet` is only for text that must not be quoted out of context (e.g., promo terms). Allowing or blocking Google-Extended is a pure training choice with no Search effect.

### (n) Crawler table, 2026 (secondary unless noted; purpose = what the token is for)

| Token | Operator | Purpose | Note | Src |
|---|---|---|---|---|
| Googlebot | Google | Search (also feeds AI Overviews / AI Mode) | Verify by reverse DNS | RS03, RS08 |
| Google-Extended | Google | Training / grounding control for Gemini Apps + Vertex AI | **No own UA**; no Search effect | W61, W62 |
| Bingbot | Microsoft | Search (Bing; Copilot grounding) | — | RS08 |
| OAI-SearchBot | OpenAI | Search (ChatGPT search) | Blocking it can remove ChatGPT citations; shares crawl results with GPTBot | W65, W66 |
| GPTBot | OpenAI | Training | — | W65, W66 |
| ChatGPT-User | OpenAI | User-triggered fetch | Sources say robots.txt **may not apply** (Dec 2025 doc change, secondary). **UNVERIFIED**: the fact-check pass found no source for the change; OpenAI's bots page not seen | W65, W67 |
| PerplexityBot | Perplexity | Search index; **not** for training (Perplexity, quoted) | — | W68, W69 |
| Perplexity-User | Perplexity | User-triggered fetch | Generally ignores robots.txt | W68 |
| ClaudeBot | Anthropic | Training | — | W65, W66 |
| Claude-SearchBot | Anthropic | Search quality / index | — | W65, W66 |
| Claude-User | Anthropic | User-triggered fetch | Robots.txt behaviour: sources differ | W65, W66 |
| Applebot | Apple | Search (Siri / Spotlight / Safari) | Not re-checked this session | RS15 |
| Applebot-Extended | Apple | Training control token for Apple Intelligence (not a separate crawler) | — | W69, W70 |
| Amazonbot | Amazon | Indexing for Alexa answers | — | W68, W70 |
| Meta-ExternalAgent | Meta | Training (one source adds indexing) | — | W69, W70 |
| DuckAssistBot | DuckDuckGo | Real-time crawl for DuckAssist AI-assisted answers, which cite sources; **not used to train AI models** (DuckDuckGo, official) | Disallow in robots.txt takes effect after ~72 h (DuckDuckGo). Reported UA `DuckAssistBot/1.2` (directories) | F16 |
| CCBot | Common Crawl | Open archive, widely used for training | — | W70 |
| Bytespider | ByteDance | Training | — | W69, W70 |

**Implication (owner decision on training, rank-first default = allow all, RS03):**
- Search and user-fetch tokens must be allowed, or we disappear from live answers.
- Training tokens remove the brand from future models' memory if blocked.
- With no CDN, the only blockers are our own nginx `limit_req` and fail2ban rules. Exempt verified Googlebot and Bingbot, and run `crawler-access.mjs` after each deploy (research/17).

```js
// robots.js — /robots.txt generated from one table (Studio › Intégrations shows it; owner flips TRAIN)
const SEARCH_AND_USER = ['Googlebot','Bingbot','OAI-SearchBot','ChatGPT-User','PerplexityBot','Perplexity-User',
  'Claude-SearchBot','Claude-User','Applebot','Amazonbot','DuckAssistBot'];
const TRAINING = ['Google-Extended','GPTBot','ClaudeBot','Applebot-Extended','Meta-ExternalAgent','CCBot','Bytespider'];
const PRIVATE = ['/svc/', '/panier/']; // a named group overrides `*`, so every group repeats these
export function robotsTxt({ host, allowTraining = true }) {
  const rules = (allow) => (allow ? [...PRIVATE.map((p) => `Disallow: ${p}`), 'Allow: /'] : ['Disallow: /']);
  const group = (ua, allow) => [`User-agent: ${ua}`, ...rules(allow), ''].join('\n');
  return [
    ...SEARCH_AND_USER.map((ua) => group(ua, true)),
    ...TRAINING.map((ua) => group(ua, allowTraining)),
    'User-agent: *', ...rules(true),
    `Content-Signal: search=yes, ai-input=yes, ai-train=${allowTraining ? 'yes' : 'no'}`, // inside the * group; preference only, no engine has committed (W46–W48)
    '',
    `Sitemap: https://${host}/sitemap.xml`,
  ].join('\n');
}
```

### (o) Where AI assistants get local business data

| Engine | What the sources say | Verdict | Src |
|---|---|---|---|
| ChatGPT | Map visuals from **Mapbox**; listings via Bing and "other search data providers"; several sources name **Foursquare** as the main place-data supplier (not Google); one deck lists Yelp, Tripadvisor, a Google Maps feed and Foursquare, with the mix varying by country. **No OpenAI statement** | Partly (conflicting secondary) | W78, W79, W80, W81, W82 |
| Perplexity | **Yelp** as main local source (one vendor study; page not identified) | Partly (single source) | — |
| Gemini | Google Search grounding + Maps (rank-first) | Partly (RS only) | RS08 |
| Copilot | Bing index (third-party); Bing Places ↔ Copilot integration **planned** (Bing blog) | Partly | W15 |
| Siri / Apple Intelligence | **Not found** (Yelp → Apple Maps: R18 #18, UNVERIFIED) | Not found | R18 |

**Implication:**
- Claim and fill **Foursquare, Yelp (claim only, never solicit: R18 #4c), Tripadvisor, Bing Places, Apple Business and GBP**, with one name spelling and identical hours. These feeds are where AI engines read hours and addresses.
- Studio › Fiches holds one master record and a monthly diff check (plan-v1 §13 directory list already has them).

### (p) Core Web Vitals

| Metric | Good | Poor | Verdict | Src |
|---|---|---|---|---|
| LCP | ≤ 2,500 ms | > 4,000 ms | **Confirmed** (web.dev) | W71 |
| INP | ≤ 200 ms | > 500 ms | Confirmed | W71 |
| CLS | ≤ 0.1 | > 0.25 | Confirmed | W71 |
| Assessed at the **75th percentile** of real visits | — | — | Confirmed (web.dev); "all three must pass": secondary | W71, W72 |

**Implication:** plan-v1 Layer 3 gate matches. Real-user data comes from our own `web-vitals` → `/svc/vitals` (research/17), because the site starts with little traffic. TTFB ≤ 0.8 s (research/17) stays UNVERIFIED.

### (q) Merchant Center for a Canadian bakery

| Fact | Verdict | Source |
|---|---|---|
| **Canada is eligible** for free local listings (retailers with a physical store). Shopping policies apply with exceptions. **Online checkout not required**, no shipping info (purchase + pickup in store) | **Confirmed** (Google Merchant Center Help) | W73, W74 |
| Members-only purchase → ineligible. Products need inventory for a location **published as a Business Profile**, and Google approval | Confirmed | W74 |
| **Pickup today** (same-day or next-day) and **pickup later** are both supported in Canada. Pickup later lets out-of-stock offers still show | Confirmed | W75, W76 |
| Free local listings / local inventory ads pickup is **not compatible** with "in-store product and price availability hosted on Google" | Confirmed | W77 |
| Perishable food / bakery restrictions | **Not found** | Queue |

**Implication:**
- Phase 2 (after ordering is live): a local product feed from Studio, with daily items as **pickup today** and made-to-order cakes as **pickup later**. Start with 5 products to learn whether food is approved.
- `google_product_category` "Food Items > Bakery > Cakes & Dessert Bars" (plan-v0a §5) is UNVERIFIED: queue.

### (r) Google food-ordering partners in Canada

| Fact | Verdict | Source |
|---|---|---|
| Canada is in the list of countries where merchants can work with online ordering providers; partners Google already works with show up automatically | Confirmed (Google help) | W18 |
| **Named partners** for Canada | **Not found** (KFC Canada tested Google's food ordering, Restaurant Dive, date not in the summary) | W20 |

**Implication:** we don't need a partner. The **custom ordering link** (d) points to our own checkout. If a delivery app is ever added, it appears automatically, and our link stays "preferred for pickup".

---

## 2. Implications for the plan (file › section › change)

| File › section | Change | Evidence |
|---|---|---|
| plan-v1 §1 AEO row | "Search Console Generative AI report" → "Search Console Generative AI report (**page-level impressions only, no queries or clicks**) as the trend. Per-prompt AI Overview ownership still comes from the SERP API + phone checks" | (e) |
| plan-v1 §1 GEO row | "Bing AI Performance" → "Bing AI Performance (public preview, **sampled**, CSV only)" | (f) |
| plan-v1 §2 "Most AI answers are Google's" | Replace [verify-CA] with: "AI Overviews in Canada since 2024-10-28 (EN at launch); AI Mode in French since 2025-10-14; French AI Overviews in Canada: self-test T1" | (a) |
| plan-v1 §2 "biggest cost is off-site" | → "Ahrefs (2025-05-26, 75k brands with DR > 40, **AI Overviews only**): branded web mentions correlate 0.664 (Spearman) with AI Overview mentions (anchors 0.527, branded search 0.392); backlinks coefficient UNVERIFIED (0.218 only in a Medium post). Correlation, large brands." | (l) |
| plan-v1 §2 Canada bullets | "Bing stronger second engine [verify]" → "Bing ≈ 10 % (StatCounter Canada, May–Sept 2026)". "iPhone-heavy" → "iOS 64.87 % of mobile (StatCounter, Sept 2026)" | (b) |
| plan-v1 §11 | AI traffic: "GA4 AI Assistant channel (native since 2026-05-13, not retroactive per one source, **excludes AI Overviews/AI Mode**, Perplexity possibly in Referral) + rank-first regex". Add "Search Console › Settings › Search generative AI = Include (monthly Gate)". Bing AI Performance CSV → Studio upload | (e)(f)(g) |
| plan-v1 §13 "Market facts" row | Replace [verify-CA] with the (a)/(b) numbers and dates | (a)(b) |
| plan-v1 §13 directories + rank-first patch | Add **Foursquare** and **Tripadvisor** as "AI local data feeds". Remove rank-first 05's "pre-load the FAQ in Q&A" (GBP Q&A is gone) | (d)(o) |
| plan-v1 §16 "llms.txt" row | Keep | (j) |
| plan-v1 §16 "robots.txt" row | "Plus a Content-Signal line" → "Content-Signal line optional (**no engine has committed to honour it**); on our VPS nothing injects `ai-train=no`" | (i) |
| plan-v1 §17 Verify list | Close: StatCounter, AI Overviews / AI Mode (except FR AI Overviews → T1), Bing Places features, Bing AI Performance (Microsoft blog, 2026-02-10). Add: GBP Food Ordering for our category (T2), Apple action-link UTM rule (T3), Bing NOARCHIVE claim (queue) | all |
| plan-v0a §3.2 Structured data ① "PreOrder, SoldOut" | → "InStock / SoldOut / **BackOrder** (returning seasonal items, with a visible date) / PreOrder (never-sold items only, with a date)". FAQ markup optional, never a gate (R18 #1) | (k) |
| plan-v0a §3.3 "Products and food menu on the profile", "'Order online' link" | → "GBP **Food Ordering › custom ordering link** to `/commander/`, preferred for pickup [if offered: T2]". Products and menu stay manual (R18 #17) | (d)(r) |
| plan-v0a §3.3/§3.4 llms.txt ① | → ③ (optional, never gated) | (j) |
| plan-v0a §5 feed table | `availability` → in_stock / out_of_stock / **backorder** / preorder per W57. Seasonal = backorder + date. `google_product_category` [verify] | (k)(q) |
| plan-v0a §5 + §7.2 | Merchant Center free local listings: pickup today (daily items) and pickup later (cakes to order); no online checkout needed. Food approval tested with 5 products | (q) |
| plan-v0b §B2, §B6 | Bing Places: new portal **bing.com/forbusiness** (2025-10-03); import from GBP **after** GBP is final. Apple Business: Showcase per season + "Commander" action (iOS 17.4+) | (c) |
| plan-v0b line "Website, order and menu links, all tracked with UTM parameters" | Add "except Apple action links if the form rejects UTM tags (T3); then rely on the referrer" | (c) |
| plan-v0c Layer 6 "Create an AI assistants channel" | → "Use GA4's native AI Assistant channel; keep a custom group as backstop" | (g) |
| plan-v0c §1 `hasMenu`, §4 "atelier macarons (Event schema)" | Tag [verify 2026 status: queue §5]; keep the HTML menu and event page regardless | (k) |

---

## 3. Top 20 SEO / AEO / GEO practices for a self-hosted local bakery site (.com on a VPS), 2026

| # | Practice | Evidence |
|---|---|---|
| 1 | **Every citable fact in server-rendered HTML**: prices, hours, menu, allergens, lead times. AI features use only indexed, snippet-eligible pages | (m) W63, W64; RS03 (JS rendered in a second wave) |
| 2 | **Search Console › Settings › Search generative AI = Include**. Checked monthly in Gates. Excluding means no AI Overview / AI Mode traffic | (e) W31–W33 |
| 3 | **No `nosnippet` / low `max-snippet` on citable pages.** `data-nosnippet` only on text that must not be quoted alone. These controls cut both normal snippets and AI use | (m) W63, W64 |
| 4 | **French first, EN/ES on their own URLs with reciprocal hreflang.** AI Mode works in French in Canada; a .com has no ccTLD geo signal, so language, content, hreflang and the GBP carry location | (a) W1; RS03 |
| 5 | **robots.txt allows every search and user-fetch crawler.** The training choice is explicit and owner-made; Google-Extended has no Search effect | (n) W61, W65–W70; RS03 |
| 6 | **nginx, not a CDN, is the edge: verify bots, never rate-limit them into 429s.** Reverse-DNS check for Googlebot/Bingbot; `crawler-access.mjs` after each deploy; monthly `log-bots.mjs` | R17 §6; RS03 |
| 7 | **Safari-iOS is the primary QA browser**, and Apple Maps is a primary listing (iOS ≈ 65 % of Canadian mobile) | (b) W10 |
| 8 | **Core Web Vitals at p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**, from our own real-user data plus Lighthouse CI | (p) W71 |
| 9 | **Search Console Generative AI report baseline in week 1**, read as page-level impressions; per-prompt ownership from SERP checks | (e) W29 |
| 10 | **Bing Webmaster Tools + AI Performance**: weekly CSV of citations and grounding queries; rewrite pages toward the grounding queries we already earn | (f) W35–W37; (b) Bing ≈ 10 % |
| 11 | **IndexNow on every publish** (Bing, Yandex, Naver, Seznam, Yep) + sitemap + URL inspection for Google | (h) W43–W45; R16b |
| 12 | **GA4: native AI Assistant channel + regex backstop**, both read as floors; Google's own AI traffic only via Search Console | (g) W39, W41; RS10 |
| 13 | **GBP Food Ordering custom link to our own checkout, preferred for pickup** (if offered for the category); no delivery-app commission | (d)(r) W18 |
| 14 | **GBP after Q&A:** questions answered on the site (`<details>` FAQ) and in review replies; category chosen from the live picklist; primary = what we are | (d) W22–W26 |
| 15 | **Apple Business: "Commander" action + a Showcase per season** (https, UTM rule checked) | (c) W11–W14 |
| 16 | **Bing Places (bing.com/forbusiness) imported from a finished GBP** | (c) W15, W16 |
| 17 | **Feed the AI local-data sources: Foursquare, Yelp (claim only), Tripadvisor**, with one master record in Studio and a monthly diff | (o) W78–W81 |
| 18 | **Lean, true structured data**: Bakery + Product/Offer + Person; availability values per Google's mapping (SoldOut, BackOrder + date, PreOrder only for new); no self-serving stars; FAQ/HowTo never gates | (k) W57, R18 #1, RS05 |
| 19 | **Merchant Center free local listings** (pickup today / later) once ordering is live; no online checkout required | (q) W73–W76 |
| 20 | **Earned brand mentions over link building**: local press, "best of" lists, partners, video. The strongest public correlation with AI Overview mentions (0.664, large brands) | (l) W59 |

Not worth the hour (zero or unproven effect): llms.txt as a task (j); expecting Content-Signal to change crawler behaviour (i); FAQ markup for stars (R18 #1); markup that isn't visible on the page (RS05).

---

## 4. Owner self-tests (phone in Granby, ~20 min, add dated screenshots to Studio › Gates)

| # | Test | Pass = |
|---|---|---|
| T1 | Google app, French UI, 5 French prompts (« meilleure pâtisserie à Granby », « combien coûte un gâteau de fête à Granby »…) | An AI Overview block in French appears → French AI Overviews live in Canada |
| T2 | GBP dashboard › Edit profile: (1) is there a **Food ordering / Commande** section? (2) category picker: type "pâtisserie", "gâteau", "dessert", "boulangerie" and note the exact names; (3) description field character counter | Section present; exact names and the limit recorded |
| T3 | Apple Business › location › Actions: add "Order" with `https://cocovanillegranby.com/commander/?utm_source=apple&utm_medium=organic` | Accepted with UTM → keep; refused → plain URL |
| T4 | Search Console › Settings | "Search generative AI" control visible and set to Include; Performance › Generative AI report visible |
| T5 | Bing Webmaster Tools › AI Performance | Report visible for the property |

---

## 5. Search queue (not searched or unresolved; about 20 queries, updated after the fact-check pass)

1. StatCounter Canada search engine **by device** (desktop vs mobile chart data, latest month)
2. Google help "AI Overviews" supported languages / countries: French in Canada
3. AI Mode in English in Canada: launch date (blog.google/intl/en-ca)
4. GBP: current description limit; category picklist (Pastry shop, Cake shop, Wedding bakery, Dessert shop); 2025–2026 changes to posts, products, menu editor
5. Google review snippet docs: self-serving reviews on LocalBusiness/Organization (developers.google.com/search/docs/appearance/structured-data/review-snippet)
6. schema.org Bakery; Google Event, VideoObject and Menu (`hasMenu`) rich-result status 2026; HowTo "Nov 2025" claim
7. Bing Webmaster Guidelines Feb 2026: NOARCHIVE / NOCACHE and Copilot (bing.com/webmasters/help)
8. ~~Microsoft's own AI Performance announcement (blogs.bing.com, Feb 2026)~~ closed in the fact-check pass (F11)
9. GA4 "What's new" 2026-05-13 and the Default Channel Group definition page (now also: Google's own "not retroactive" wording; is Perplexity in the referrer list)
10. indexnow.org/searchengines current participant list
11. platform.openai.com/docs/bots (ChatGPT-User robots.txt change, Dec 2025)
12. Anthropic crawler help page (ClaudeBot, Claude-SearchBot, Claude-User)
13. docs.perplexity.ai bots; support.apple.com/119829 (Applebot); Meta web crawlers page (DuckDuckGo DuckAssistBot page: closed, F16)
14. Apple Business: country availability of actions and Showcases; current UTM rule
15. Apple Maps / Siri local data providers in Canada (Yelp?) (R18 #18)
16. Merchant Center: food / perishable product policy; bakery `google_product_category`
17. Google food-ordering partners in Canada; end date of "Order with Google"
18. Google "Optimizing your website for generative AI features" (2026): exact wording on special files and no extra optimization
19. Ahrefs page: is 0.218 for backlinks on it; YouTube 0.737 (Dec 2025 / May 2026)
20. Any operator statement on honouring Content-Signal (OpenAI, Google, Anthropic, Perplexity) after Sept 2025
21. Search Console Generative AI report: Google's own statement that it reached **all** sites (the 2026-08-31 date is secondary and disputed)
22. GBP Q&A → Ask Maps: Google's December 2025 announcement and its exact date (the "2025-12-03" day is unverified)
23. AI Overviews in France: exact launch day (W4 says 2026-07-22; unconfirmed)

---

## Verification log (2026-10-25)

Adversarial pass, 8 WebSearch queries (cap). F-numbers are listed under Sources.

| Claim | Verdict | Source URL |
|---|---|---|
| Search Console "Search Generative AI performance reports" launched 2026-06-03, impressions only (AI Overviews, AI Mode, Discover) | Confirmed | https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports |
| The report reached all sites worldwide on 2026-08-31 | Unverified (secondary only; other secondary sources still call it beta / UK subset) | https://www.techwyse.com/blog/ai/google-search-console-ai-search-reporting · https://pasqualepillitteri.it/en/news/4116/search-console-generative-ai-report-ai-overviews-ai-mode |
| GBP Q&A API discontinued 2025-11-03 | Confirmed (secondary, consistent; announced 2025-09-17) | https://ppc.land/google-discontinues-business-profile-q-a-api-effective-november-3/ · https://www.brightlocal.com/learn/google-business-profile-qa |
| Public GBP Q&A deprecated "from 2025-12-03" | Corrected → "early December 2025, exact day UNVERIFIED"; replaced by Ask Maps; button disappearing on some listings | https://www.brightlocal.com/learn/google-business-profile-qa · https://ppc.land/google-quietly-kills-q-a-for-an-ai-button-most-wont-use/ |
| GA4 native AI Assistant channel, 2026-05-13, medium `ai-assistant` | Confirmed (secondary, consistent) | https://www.techwyse.com/news/platform-updates/google-analytics-ai-assistant-channel-ga4-default-channel-group |
| GA4 AI Assistant channel is not retroactive | Corrected → "one source only"; Perplexity possibly excluded (Referral) | https://www.terminusapp.com/blog/ai-traffic-channel-in-ga4/ · https://delante.co/ga4-adds-a-ai-assistant-channel-what-it-changes/ |
| Ahrefs (75k brands, DR > 40, AI Overviews): mentions 0.664, anchors 0.527, branded search 0.392 | Confirmed (Spearman; "moderate to very weak", Ahrefs) | https://ahrefs.com/blog/ai-overview-brand-correlation/ |
| Ahrefs: backlinks 0.218 | Unverified (not in Ahrefs excerpts; Medium only) | https://ahrefs.com/blog/ai-overview-brand-correlation/ |
| AI Overviews in French in Canada | Unverified (still not found; 2024 launch said French not supported) | https://mobilesyrup.com/2024/10/28/google-expands-ai-overview-feature-canada/ · https://support.google.com/websearch/answer/14901683?hl=en |
| France got AI Overviews + AI Mode on 2026-07-22 | Corrected → "summer 2026 (announced 2026-06-30); exact day UNVERIFIED" | https://siecledigital.fr/2026/06/30/google-va-bouleverser-la-recherche-en-france-avec-ses-resumes-ia-des-cet-ete/ · https://ppc.land/google-ends-france-ai-overviews-blackout-as-68-users-flagged-the-gap |
| AI Mode available in Canada | Confirmed for the country (help page lists Canada); English launch date Unverified | https://support.google.com/websearch/answer/16011537?hl=en |
| StatCounter Canada mobile OS, Sept 2026: iOS 64.87 %, Android 35.13 % | Confirmed | https://gs.statcounter.com/os-market-share/mobile/canada |
| Bing AI Performance: public preview Feb 2026; Copilot + Bing AI summaries + partners; sampled | Corrected Partly → Confirmed (Microsoft's own post; 2026-02-10 per PPC Land) | https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview · https://ppc.land/bing-gives-publishers-first-look-at-how-ai-systems-cite-their-content/ |
| Bing AI Performance: CSV only, API on backlog | Confirmed (secondary quoting Fabrice Canel) | https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/ |
| DuckAssistBot "Not found" | Corrected → exists: real-time crawl for AI-assisted answers, not used for training, robots.txt honoured within ~72 h (official). robots.js list stays valid | https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot |
| ChatGPT-User: robots.txt may not apply (Dec 2025 doc change) | Unverified (no source found) | — |

Not re-searched (cited from other files, consistency checked only): FAQ rich results gone 2026-05-07 and Apple Business rename 2026-04-14 match research/18 #1 and #2; Content Signals Sept 2025 matches research/17 §6.

---

## Sources

Web (seen 2026-10-25):

- W1 · Le Mode IA est maintenant disponible en français (Google Canada blog, fr-CA, 2025-10-14) — https://blog.google/intl/fr-ca/produits/explorez-obtenez-des-reponses/le-mode-ia-est-maintenant-disponible-en-francais/ — seen 2026-10-25
- W2 · Get AI-powered responses with AI Mode in Google Search (Google Search Help) — https://support.google.com/websearch/answer/16011537?hl=en — seen 2026-10-25
- W3 · Google déploie AI Mode dans 180 pays anglophones (La Réclame) — https://lareclame.fr/google-ai-mode-180-pays-321343 — seen 2026-10-25
- W4 · AI Overviews and AI Mode in France (Ads-Up) — https://ads-up.fr/en/publications/sea/google-ads/ai-overviews-and-ai-mode-are-coming-to-france/ — seen 2026-10-25
- W5 · AI Overviews in Search are coming to Canada (Google Canada blog) — https://blog.google/intl/en-ca/products/explore-get-answers/ai-overviews-in-search-are-coming-to-canada/ — seen 2026-10-25
- W6 · Google expands AI Overview feature to Canada (MobileSyrup, 2024-10-28) — https://mobilesyrup.com/2024/10/28/google-expands-ai-overview-feature-canada/ — seen 2026-10-25
- W7 · Search engine market share Canada (StatCounter) — https://gs.statcounter.com/search-engine-market-share/all/canada — seen 2026-10-25
- W8 · Search engine market share Canada, desktop + mobile + console (StatCounter) — https://gs.statcounter.com/search-engine-market-share/desktop-mobile-console/canada/ — seen 2026-10-25
- W9 · Platform market share Canada (StatCounter) — https://gs.statcounter.com/platform-market-share/search-engine/canada — seen 2026-10-25
- W10 · Mobile operating system market share Canada (StatCounter) — https://gs.statcounter.com/os-market-share/mobile/canada — seen 2026-10-25
- W11 · Apple Business Connect, Canada (Apple) — https://apple.com/ca/business/connect — seen 2026-10-25
- W12 · Custom action links (Apple, PDF) — https://business.apple.com/partners/assets/custom-action-links.pdf — seen 2026-10-25
- W13 · Apple Maps Place Card (Apple Business onboarding guide) — https://business.apple.com/docs/onboarding-guide/place-card — seen 2026-10-25
- W14 · Action links guidance (Apple Business API docs) — https://business.apple.com/docs/api/v1/guidance/action_links — seen 2026-10-25
- W15 · Introducing the New Bing Places for Business (Bing blog, Oct 2025) — https://blogs.bing.com/search/October-2025/Introducing-the-New-Bing-Places-for-Business-Built-for-Business-Owners,-Powered-by-Research — seen 2026-10-25
- W16 · Bing Places for Business migrates to bing.com domain with import tools (PPC Land) — https://ppc.land/bing-places-for-business-migrates-to-bing-com-domain-with-import-tools/ — seen 2026-10-25
- W17 · Microsoft launches new Bing Places for Business (Search Engine Journal) — https://www.searchenginejournal.com/microsoft-launches-new-bing-places-for-business/557520/ — seen 2026-10-25
- W18 · Manage online ordering options (Google Business Profile Help) — https://support.google.com/business/answer/10842217 — seen 2026-10-25
- W19 · Google Business Profile for restaurants (Google, Canada) — https://maps.google.ca/intl/en/business/restaurants — seen 2026-10-25
- W20 · KFC Canada tests Google's food ordering service (Restaurant Dive) — https://www.restaurantdive.com/news/kfc-canada-tests-googles-food-ordering-service/572923/ — seen 2026-10-25
- W21 · Google Business Profile for restaurants in Toronto (ys.contact, vendor) — https://ys.contact/guides/google-business-profile-restaurants-toronto/ — seen 2026-10-25
- W22 · Google discontinues Business Profile Q&A API effective November 3 (PPC Land) — https://ppc.land/google-discontinues-business-profile-q-a-api-effective-november-3/ — seen 2026-10-25
- W23 · Google quietly kills Q&A for an AI button most won't use (PPC Land) — https://ppc.land/google-quietly-kills-q-a-for-an-ai-button-most-wont-use/ — seen 2026-10-25
- W24 · With Google Q&A gone, you need a Maps "Ask a question" strategy (Whitespark) — https://whitespark.ca/blog/with-google-qa-gone-you-need-a-maps-ask-a-question-strategy/ — seen 2026-10-25
- W25 · Google Business Profile Q&A removed in 2026 (Slashpost) — https://slashpost.ai/blogs/google-business-profile/google-business-profile-qa-removed-2026 — seen 2026-10-25
- W26 · Choose a business category (Google Business Profile Help) — https://support.google.com/business/answer/7249669?hl=en — seen 2026-10-25
- W27 · Tips for creating a free business listing (Google Small Business blog, 2011) — https://smallbusiness.googleblog.com/2011/01/tips-for-creating-free-business-listing.html — seen 2026-10-25
- W28 · SEO for bakeries (ProfileTree) — https://profiletree.com/seo-for-bakeries/ — seen 2026-10-25
- W29 · Introducing Search Generative AI performance reports in Search Console (Google Search Central blog, June 2026) — https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports — seen 2026-10-25
- W30 · Google finally gives Search Console its own generative AI visibility reports (PPC Land) — https://ppc.land/google-finally-gives-search-console-its-own-generative-ai-visibility-reports/ — seen 2026-10-25
- W31 · Search Console AI performance reports and Search generative AI control rolling out globally (Search Engine Land) — https://searchengineland.com/google-search-console-ai-performance-reports-and-search-generative-ai-control-rolling-out-globally-486269 — seen 2026-10-25
- W32 · Google gives site owners a toggle to exit AI Overviews and AI Mode (PPC Land) — https://ppc.land/google-gives-site-owners-a-toggle-to-exit-ai-overviews-and-ai-mode/ — seen 2026-10-25
- W33 · Google AI Mode / Overviews opt-out (9to5Google, 2026-06-02) — https://9to5google.com/2026/06/02/google-ai-mode-overviews-opt-out/ — seen 2026-10-25
- W34 · Google reacts to UK order with a Search Console AI opt-out toggle (PPC Land) — https://ppc.land/google-reacts-to-uk-order-with-a-search-console-ai-opt-out-toggle/ — seen 2026-10-25
- W35 · Bing Webmaster Tools testing new AI performance report (Search Engine Land) — https://searchengineland.com/bing-webmaster-tools-testing-new-ai-performance-report-468039 — seen 2026-10-25
- W36 · Inside Bing's new AI Performance report: what 20,000 Copilot citations taught us (Search Influence) — https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/ — seen 2026-10-25
- W37 · Bing's improved AI performance section (Practical Ecommerce) — https://www.practicalecommerce.com/bings-improved-ai-performance-section — seen 2026-10-25
- W38 · Initial thoughts on AI Performance reports in Bing WMT (Momentic) — https://momenticmarketing.com/blog/bing-wmt-ai-performance-report — seen 2026-10-25
- W39 · Google Analytics adds native AI Assistant channel to GA4's Default Channel Group (Techwyse) — https://www.techwyse.com/news/platform-updates/google-analytics-ai-assistant-channel-ga4-default-channel-group — seen 2026-10-25
- W40 · Native GA4 vs custom regex: navigating the new era of AI traffic (Summit) — https://www.summit.co.uk/opinions-news/native-ga4-vs-custom-regex-navigating-the-new-era-of-ai-traffic/ — seen 2026-10-25
- W41 · The AI Assistant channel in GA4: what it counts and what it misses (eSEOspace) — https://eseospace.com/blog/ga4-ai-assistant-channel-explained/ — seen 2026-10-25
- W42 · GA4's new AI number is a boundary (Magnet) — https://magnet.co/posts/ga4-ai-number-is-a-boundary — seen 2026-10-25
- W43 · IndexNow (Wikipedia) — https://en.wikipedia.org/wiki/IndexNow — seen 2026-10-25
- W44 · Search engines supporting IndexNow (MeshWorld) — https://meshworld.in/blog/web-dev/seo/indexnow/search-engines-supporting-indexnow/ — seen 2026-10-25
- W45 · IndexNow: 3.5 billion URLs daily without Google (blckalpaca) — https://blckalpaca.at/en/knowledge-base/seo-geo/technical-seo/indexnow-35-billion-urls-daily-without-google — seen 2026-10-25
- W46 · Cloudflare offers way to block AI Overviews – will Google comply? (Search Engine Land) — https://searchengineland.com/cloudflare-content-signals-462538 — seen 2026-10-25
- W47 · Content Signals y grounding (Cyberclick) — https://www.cyberclick.es/numerical-blog/content-signals-el-nuevo-robots-txt-para-decirle-que-usa-la-ia — seen 2026-10-25
- W48 · Content-Signal (Lumar agentic-readiness docs) — https://agentic-readiness.lumar.io/docs/access/content-signal — seen 2026-10-25
- W49 · robots.txt lernt Nein sagen (Dr. Web) — https://www.drweb.de/robots-txt-lernt-nein-sagen-cloudflare-stoppt-ki-scraper/ — seen 2026-10-25
- W50 · Does llms.txt help SEO? Google's 2026 answer (eCorp IT) — https://ecorpit.com/does-llms-txt-help-seo-google-2026/ — seen 2026-10-25
- W51 · llms.txt in 2026: the full guide (Limy) — https://www.limy.ai/blog/llms.txt-in-2026-the-full-guide — seen 2026-10-25
- W52 · llms.txt (AI Eating the World) — https://www.aieatingtheworld.com/articles/llms-txt — seen 2026-10-25
- W53 · Google deprecates seven structured data types to simplify search results (PPC Land) — https://ppc.land/google-deprecates-seven-structured-data-types-to-simplify-search-results/ — seen 2026-10-25
- W54 · Google's removal of structured data: what it means in 2025 (Relevant Audience) — https://www.relevantaudience.com/google-removes-structured-data-2025-guide-for-websites — seen 2026-10-25
- W55 · Google ends FAQ rich results for all sites (Techwyse) — https://www.techwyse.com/news/ai-search/google-faq-rich-results-deprecated-2026 — seen 2026-10-25
- W56 · Google killed the FAQ rich result, don't panic (JSONLD.com) — https://jsonld.com/google-faq-rich-results-deprecated/ — seen 2026-10-25
- W57 · Availability [availability] (Google Merchant Center Help) — https://support.google.com/merchants/answer/6324448?hl=en — seen 2026-10-25
- W58 · Google Shopping price and availability requirements (FeedArmy) — https://feedarmy.com/kb/google-shopping-price-and-availability-requirements/ — seen 2026-10-25
- W59 · An analysis of AI Overview brand visibility factors (75K brands studied) (Ahrefs, 2025-05-26) — https://ahrefs.com/blog/ai-overview-brand-correlation/ — seen 2026-10-25
- W60 · Ahrefs studied 75,000 brands: brand mentions beat backlinks 3-to-1 (Medium) — https://medium.com/@lorenzoswanson786/ahrefs-studied-75-000-brands-brand-mentions-beat-backlinks-3-to-1-for-ai-visibility-e86ef9f6baba — seen 2026-10-25
- W61 · Google-Extended bot (token) does not affect Google Search (Search Engine Roundtable) — https://seroundtable.com/google-extended-seo-36865.html — seen 2026-10-25
- W62 · Google updates Gemini / Vertex AI user agent documentation (Search Engine Journal) — https://www.searchenginejournal.com/google-updates-gemini-vertex-ai-user-agent-documentation/545409/ — seen 2026-10-25
- W63 · Google details how to control content in AI search (PinMeTo) — https://www.pinmeto.com/news/google-ai-features-content-controls-2026/ — seen 2026-10-25
- W64 · Controlling how Google uses your content in AI answers (eSEOspace) — https://eseospace.com/blog/google-ai-preview-controls/ — seen 2026-10-25
- W65 · AI crawlers explained: GPTBot, ClaudeBot and who's reading your site (Superblog) — https://superblog.ai/blog/ai-crawlers-guide.md — seen 2026-10-25
- W66 · AI crawlers robots.txt: ClaudeBot, GPTBot, PerplexityBot (The Rank Masters) — https://www.therankmasters.com/insights/service-playbooks/ai-crawlers-robots-txt-claudebot-gptbot-perplexitybot — seen 2026-10-25
- W67 · Control AI crawlers with robots.txt (Vydai) — https://vydai.inweb.ua/en/blog/practice-and-methodology/control-ai-crawlers-with-robots-txt-gptbot-claudebot-perplexitybot-google-extended — seen 2026-10-25
- W68 · Top AI search crawlers and user-agents (AIRefs) — https://getairefs.com/blog/top-ai-search-crawlers-user-agents/ — seen 2026-10-25
- W69 · AI crawlers list (ContextBolt) — https://contextbolt.com/blog/ai-crawlers-list/ — seen 2026-10-25
- W70 · Block AI bots from crawling websites using robots.txt (Originality.ai) — https://originality.ai/blog/ai-bot-blocking — seen 2026-10-25
- W71 · How the Core Web Vitals metrics thresholds were defined (web.dev) — https://web.dev/articles/defining-core-web-vitals-thresholds — seen 2026-10-25
- W72 · What are the Core Web Vitals? LCP, INP and CLS explained (corewebvitals.io) — https://corewebvitals.io/core-web-vitals — seen 2026-10-25
- W73 · Free local listings (Google Merchant Center Help) — https://support.google.com/merchants/answer/7457386 — seen 2026-10-25
- W74 · Local inventory ads and free local product listings policies (Google Merchant Center Help) — https://support.google.com/merchants/answer/3271956?hl=en — seen 2026-10-25
- W75 · Pickup later with in-store inventory data (Google Merchant Center Help) — https://support.google.com/merchants/answer/14633302 — seen 2026-10-25
- W76 · Pickup today (Google Merchant Center Help) — https://support.google.com/merchants/answer/14634281 — seen 2026-10-25
- W77 · About in-store product and price availability hosted on Google (Google Merchant Center Help) — https://support.google.com/merchants/answer/14869424?hl=en — seen 2026-10-25
- W78 · Getting your business "on the map" in ChatGPT: Mapbox local search (Search Engine World) — https://www.searchengineworld.com/getting-your-business-on-the-map-in-chatgpt-local-search-comes-to-chatgpt — seen 2026-10-25
- W79 · ChatGPT local business data sources: Foursquare (MapAtlas) — https://mapatlas.eu/es/blog/chatgpt-local-business-data-sources-foursquare — seen 2026-10-25
- W80 · ChatGPT local search data sources: where does business info come from (Local Falcon) — https://www.localfalcon.com/blog/chatgpt-local-search-data-sources-where-does-business-info-come-from — seen 2026-10-25
- W81 · Inside the data: what AI engines actually do with local queries (SlideShare) — https://www.slideshare.net/slideshow/inside-the-data-what-ai-engines-actually-do-with-local-queries/288969638 — seen 2026-10-25
- W82 · ChatGPT's new local map knowledge panel experience (Birdeye) — https://birdeye.com/blog/chatgpts-new-local-map-knowledge-panel-experience-what-it-is-and-how-to-show-up-well/ — seen 2026-10-25

Fact-check pass (seen 2026-10-25):

- F1 · Google Search Console now tracks AI search visibility (TechWyse) — https://www.techwyse.com/blog/ai/google-search-console-ai-search-reporting — seen 2026-10-25
- F2 · Search Console generative AI report: AI Overviews, AI Mode (Pasquale Pillitteri) — https://pasqualepillitteri.it/en/news/4116/search-console-generative-ai-report-ai-overviews-ai-mode — seen 2026-10-25
- F3 · Search generative AI performance report in Google Search Console (Refinery89) — https://refinery89.com/search-generative-ai-performance-report-google-search-console/ — seen 2026-10-25
- F4 · Google Business Profile Q&A (BrightLocal) — https://www.brightlocal.com/learn/google-business-profile-qa — seen 2026-10-25
- F5 · Google is removing Business Profile Q&A and replacing it with AI (Footbridge Media) — https://www.footbridgemedia.com/marketing-tips/google-shutting-down-gbp-q-a — seen 2026-10-25
- F6 · Google will discontinue the My Business Q&A API (RatingCaptain, pre-December 2025) — https://ratingcaptain.com/blog/google-will-discontinue-the-my-business-q-and-a-api-what-it-means-for-your-google-business-profile — seen 2026-10-25
- F7 · Find information in faster and easier ways with AI Overviews in Google Search (Google Search Help) — https://support.google.com/websearch/answer/14901683?hl=en — seen 2026-10-25
- F8 · Google va bouleverser la recherche en France avec ses résumés IA dès cet été (Siècle Digital, 2026-06-30) — https://siecledigital.fr/2026/06/30/google-va-bouleverser-la-recherche-en-france-avec-ses-resumes-ia-des-cet-ete/ — seen 2026-10-25
- F9 · Google ends France AI Overviews blackout (PPC Land) — https://ppc.land/google-ends-france-ai-overviews-blackout-as-68-users-flagged-the-gap — seen 2026-10-25
- F10 · AI Mode in Google Search is now available in over 200 countries (Thurrott) — https://www.thurrott.com/a-i/328035/ai-mode-in-google-search-is-now-available-in-over-200-countries — seen 2026-10-25
- F11 · Introducing AI Performance in Bing Webmaster Tools Public Preview (Microsoft Bing Webmaster blog, Feb 2026) — https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview — seen 2026-10-25
- F12 · Bing gives publishers first look at how AI systems cite their content (PPC Land) — https://ppc.land/bing-gives-publishers-first-look-at-how-ai-systems-cite-their-content/ — seen 2026-10-25
- F13 · AI traffic channel in GA4 (Terminus) — https://www.terminusapp.com/blog/ai-traffic-channel-in-ga4/ — seen 2026-10-25
- F14 · GA4 adds a native AI Assistant channel: what it changes (Delante) — https://delante.co/ga4-adds-a-ai-assistant-channel-what-it-changes/ — seen 2026-10-25
- F15 · GA4's AI Assistant channel undercounts your AI traffic (Search Engine Journal) — https://searchenginejournal.com/ga4s-ai-assistant-channel-undercounts-your-ai-traffic-how-to-build-one-that-doesnt/580133 — seen 2026-10-25
- F16 · DuckAssistBot (DuckDuckGo Help Pages) — https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot — seen 2026-10-25

Local (seen 2026-10-25):

- R16b · research/16b-admin-tech-subdomain.md (fact-check row 19, IndexNow) — /home/user/coco-vanille-granby/research/16b-admin-tech-subdomain.md — seen 2026-10-25
- R17 · research/17-vps-self-hosting-and-domain.md (§6 CDN decision, Content Signals) — /home/user/coco-vanille-granby/research/17-vps-self-hosting-and-domain.md — seen 2026-10-25
- R18 · research/18-dated-claims-verification.md (#1, #2, #4c, #9, #10, #11a, #11b, #17, #18) — /home/user/coco-vanille-granby/research/18-dated-claims-verification.md — seen 2026-10-25
- RS03 · Ranking Stack reference 03-technical.md (secondary) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/03-technical.md — seen 2026-10-25
- RS05 · Ranking Stack reference 05-entity-schema.md (secondary) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/05-entity-schema.md — seen 2026-10-25
- RS08 · Ranking Stack reference 08-aeo-geo.md (secondary) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/08-aeo-geo.md — seen 2026-10-25
- RS10 · Ranking Stack reference 10-measurement.md (secondary) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/10-measurement.md — seen 2026-10-25
- RS15 · Ranking Stack reference 15-sources.md (secondary) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/15-sources.md — seen 2026-10-25
