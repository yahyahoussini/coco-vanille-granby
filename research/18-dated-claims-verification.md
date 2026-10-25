# 18 · Dated and risky claims in the plans: verification (2026-10-25)

Scope: 22 claims taken from plan-v1 (§10–§17), plan-v0a, plan-v0b and plan-v0c. Many are dated after the owner's assistant's training data.

Method and limits (read first):

- This track ran **18 WebSearch queries** (US-located, summarized results). Then the shared search budget for this turn (200 calls across all agents) ran out, and further searches were refused.
- Cross-checks: research/16a and research/16b (sibling tracks that cite Google, WebKit and Meta docs) and the Ranking Stack references (secondary sources).
- **No verdict is given without a source.** Claims 11b, 12, 13, 15–22 are marked **UNVERIFIED**. A self-test and a follow-up query are given for each (§2, §4).
- WebFetch and curl are blocked, so official pages were read only through search summaries. Where a summary quoted secondary blogs rather than the official page, the row says so.
- **Second pass, adversarial (2026-10-25).** The shared search budget was already used up when this pass started: every WebSearch call was refused, so **no new web evidence** was gathered. This pass tested 20 high-risk claims against what exists locally: this file's own verdict scale, the fact-check log of research/16b, and a grep of the Ranking Stack skill files. Result: 4 verdicts downgraded (3, 4c, 5, 17), 1 provenance statement corrected (16), 1 wording corrected (1), every "Not checked" / "Not found" changed to **UNVERIFIED**. Details in the verification log at the end.

Verdicts: **Confirmed** (an official source in the summaries) · **Partly** (true with a correction, or only secondary sources) · **Contradicted** (wrong or out of date) · **UNVERIFIED** (no supporting source found, or no search possible; never treat as true).

Bottom line:

| Verdict | Claims |
|---|---|
| Confirmed (6) | 1 FAQ rich results gone · 4a staff-quota clause · 4b no gating, no incentives · 6 GSAP free · 7 tips before tax (terminals) · 8 iOS web push |
| Partly (7) | 2 Apple Business (Canada features unknown) · 3 Data Studio (secondary only) · 4c Yelp solicitation (2017–2018 secondary only) · 5 Instagram indexing (secondary only) · 10 Google UCP (Canada not live) · 11a ChatGPT search providers · 14 Princeton GEO (secondary only) |
| Contradicted (1) | 9 ChatGPT Instant Checkout: deprioritized by OpenAI on 2026-03-24 |
| UNVERIFIED (11) | 11b `utm_source` · 12 TikTok Canada · 13 ads in ChatGPT / AI Overviews · 15 Meta Andromeda, Trial Reels, DM shares · 16 tool prices (no known source) · 17 GBP API (circular sourcing) · 18 Yelp → Apple Maps · 19 Gemini in Maps · 20 Consent Mode v2 · 21 StatCounter · 22 GST/HST bakery rule and rates |

---

## 1. Verdict table

| # | Claim (where it appears in the plans) | Verdict | What the sources say (source date) | Src |
|---|---|---|---|---|
| 1 | FAQ rich results "not shown at all since May 7, 2026" (v1 §16) | **Confirmed** | Google's changelog: the FAQ rich result is no longer shown in Search as of **2026-05-07**. Deprecation entry dated 2026-05-08. **Announced, not confirmed done** (corrected 2026-10-25: an earlier draft stated the June step as fact): FAQ documentation removal, Search Console FAQ appearance filter and report, and Rich Results Test support in **June 2026**; Search Console API support in **August 2026**. UNVERIFIED that the June and August removals happened. Secondary sources: FAQPage markup is still valid and not penalized. It just no longer shows a SERP feature. The 2023 "gov/health only" restriction is superseded. | S1, S2, S3 |
| 2 | "Apple Business Connect" renamed "Apple Business" since April 14, 2026; Showcases, action links, Order in Canada (v1 §16, v0a §3.3, v0b §B2) | **Partly** | Rename confirmed by Apple Support ("Apple Business Connect is now Apple Business"; the page seen is the en-om locale, so it says nothing about Canada). Secondary sources only (date UNVERIFIED on Apple's side): launched **2026-04-14** in 200+ countries and regions; one source says it was announced 2026-03-24 (UNVERIFIED). It merges Apple Business Manager, Apple Business Essentials and Business Connect, and existing place-card data moved over automatically. **Showcases, action links and Order in Canada: Not checked.** | S4, S5, S6 |
| 3 | "Looker Studio" renamed "Data Studio" (v1 §11, §15) | **Partly** (secondary only; downgraded from Confirmed 2026-10-25) | Secondary sources say Google renamed Looker Studio back to **Data Studio in April 2026**. Sources differ on the day (2026-04-11 vs 2026-04-16). One source says Looker Studio Pro is now Data Studio Pro, and another says old links redirect to datastudio.google.com. "Still free": secondary. **No Google page is among S7–S10** (a trade blog, an agency, Wikipedia, a vendor), so under this file's own scale the verdict cannot be Confirmed. The rename itself is low-risk: the plans only use the name. | S7, S8, S9, S10 |
| 4a | Google policy against staff review targets/quotas, "April 2026" (v1 §10, §16) | **Confirmed** | Google's official Maps "Prohibited and restricted content" page lists "merchants requesting that staff solicit a certain number of reviews" as not allowed. Secondary sources (the date is UNVERIFIED on Google's side): two clauses were added to "Rating manipulation" on **2026-04-17**: (1) staff review quotas; (2) asking staff to collect reviews with **specific content**, including naming a staff member. The scope of "specific content" is unclear: practitioners report that a Google Product Expert called it broader than intended. Google has not clarified. Customers may still name staff on their own. | S11, S12, S13, S14 |
| 4b | Google: no review gating, no incentives (v0b §B3, v0c §11) | **Confirmed** | The official page says incentivized reviews are removed. The gating rule has been quoted since 2018: "Don't discourage or prohibit negative reviews or selectively solicit positive reviews from customers." Asking every customer, with no incentive and no attempt to influence the rating or content, stays allowed. | S11, S15 |
| 4c | Yelp: never solicit reviews (v0a §3.4, v0b §B3) | **Partly** (2017–2018 secondary only; downgraded from Confirmed 2026-10-25) | Secondary sources (Search Engine Land, 2017–2018): Yelp prohibits asking for reviews in any form. It warns by email, gives **90 days** to comply, then penalizes the business in Yelp search; a compliance form can lift the penalty. The **90-day** and penalty mechanics are UNVERIFIED for 2026: Yelp's current support page was not seen. The operating rule (never ask for Yelp reviews) costs nothing and stays. | S16, S17 |
| 5 | Instagram lets search engines index public posts from professional accounts since July 2025, via a setting (v0a §3.3, v0c Layer 5) | **Partly** (secondary only; downgraded from Confirmed 2026-10-25) | Secondary sources only (Instagram Help Center not opened; "on by default" and the menu path are UNVERIFIED on Meta's side). From **2025-07-10**: public photos, videos, Reels and carousels from **professional (business or creator) accounts, owner 18+, public profile**. **On by default (opt-out).** Path given by one source: Settings → Privacy → "Allow public photos and videos to appear in search engine results". Some indexing already existed since 2020. Stories and Highlights reported as not indexed. Instagram Help Center not opened. | S18, S19, S20 |
| 6 | GSAP fully free including ScrollTrigger after the Webflow acquisition (v0c §7) | **Confirmed**, with one correction | Webflow: GSAP is "100% FREE including ALL of the bonus plugins" (SplitText, MorphSVG…), even for commercial use. ScrollTrigger and ScrollSmoother are in the toolset. **Licence:** "Standard No-Charge" (effective **2025-04-30**, modified 2025-05-30) is a custom licence. It **prohibits** using GSAP in a no-code visual animation builder that competes with Webflow. That doesn't affect a bakery website. | S21, S22, S23 |
| 7 | Québec LPC: suggested tips calculated on the pre-tax amount, "since May 2025" (v0c §9) | **Confirmed** for payment terminals. **Online checkout: UNVERIFIED** | Since **2025-05-07** (Bill 72 amending the LPC): tip suggestions must be calculated **before taxes**, shown in a **neutral, uniform way** (no highlighted option, no "super" labels), and the consumer must be able to choose the amount easily. Official sources and Radio-Canada describe the rule for **payment terminals / point of sale**. No source found on whether it covers online checkout. | S24, S25, S26, S27 |
| 8 | iOS web push for Home Screen web apps since iOS 16.4 (v0c §8) | **Confirmed** | WebKit: Web Push works for **web apps added to the Home Screen** only. Permission must follow a **direct user action** (a tap). Ordinary Safari tabs on iOS cannot ask. iOS 16.4 / Safari 16.4 public release: **2023-03-27**. research/16b adds Declarative Web Push from iOS 18.4: **UNVERIFIED** (not re-checked here, and 16b's own fact-check log, row 9, also marks it Unverified). | S28, S29 |
| 9 | OpenAI Agentic Commerce Protocol with Stripe (2025); Instant Checkout "limited to approved partners"; Canada (v1 §16, v0c §12) | **Contradicted** (out of date) | ACP is confirmed: co-developed with Stripe and open-sourced, launched **2025-09-29**. Instant Checkout started with **US users and US Etsy sellers**, with Shopify merchants next; other merchants applied and were certified. **On 2026-03-24** OpenAI ("Powering Product Discovery in ChatGPT") expanded ACP to **product discovery** and said the first Instant Checkout lacked flexibility. Merchants now use **their own checkout**, and ChatGPT apps remain an option. **No Canadian launch found** in OpenAI or press sources. | S30, S31, S32, S33 |
| 10 | Google's agentic-checkout protocol, "US-first with Canada next" (v1 §16–17) | **Partly** | Name: **Universal Commerce Protocol (UCP)**, with "Universal Cart" in Search and Gemini. At Google Marketing Live (**May 2026**; 2026-05-20 per secondary sources), Google said UCP checkout goes live with US retailers and **expands to Canada and Australia "in the coming months"**, with the UK later. As of Oct 2026 sources conflict: Google help reportedly lists US/Canada/Australia eligibility (UNVERIFIED: that help page is not among the sources); BigCommerce says "early access for select U.S. merchants". **Consumer availability in Canada: UNVERIFIED.** The 2026-05-20 date is secondary only. Checkout uses Google Pay; the retailer stays merchant of record. | S34, S35, S36, S37, S46 |
| 11a | ChatGPT search uses third-party search providers (Microsoft among them) + OAI-SearchBot (v1 §16, v0a §3.4) | **Partly** | OpenAI Help: ChatGPT search "sometimes partners with other search providers", rewrites the query for them and shares general location, not the IP. **OpenAI does not name the providers.** A third-party analysis: the only pointer is links to Microsoft's and Shopify's privacy documents. So "Microsoft" is an inference. Third-party source: blocking OAI-SearchBot removes a site from ChatGPT search answers (navigational links may remain). OpenAI's crawler page is listed in the Ranking Stack sources but was not opened. | S38, S39, RS15 |
| 11b | ChatGPT appends `utm_source=chatgpt.com` to links (v0c Layer 6) | **UNVERIFIED** (no web source; stated only by the Ranking Stack, secondary) | No web result in either pass. Ranking Stack refs 10 and 00 state it; neither cites an OpenAI page. Treat as UNVERIFIED until the self-test in §2 passes. The GA4 rule already matches the referrer too, so nothing breaks if it is false. | RS10 |
| 12 | TikTok Canada: Nov 2024 wind-down order; 2026 status (v0a §4.7, v1 §13, §17) | **UNVERIFIED** | No search possible in either pass. **Every part is UNVERIFIED**: the late-2024 wind-down order, that the app and self-serve ads stayed available, and the Oct 2026 status. [[FACT NEEDED: canada.ca (Investment Canada Act) and Federal Court, status Oct 2026]]. Until then: no TikTok ad spend (§3). | — |
| 13 | Ads in ChatGPT; ads in AI Overviews / AI Mode, in Canada, Oct 2026 (v1 §17) | **UNVERIFIED** | No source found in either pass. [[FACT NEEDED: OpenAI ads help page; Google Ads help "ads in AI Overviews" country list]]. Self-test 13 answers it from Granby. | — |
| 14 | Princeton GEO study (2023): quotes and statistics raise AI visibility by up to ~40% (v0c Layer 4) | **Partly** (secondary only) | Ranking Stack refs: Aggarwal et al., *GEO: Generative Engine Optimization*, **KDD 2024** (arXiv 2311.09735). **Statistics +41%, direct quotes +28%**; citing sources also strong; keyword stuffing negative. Later work (C-SEO Bench, NeurIPS 2025; FeatGEO, 2026) finds phrasing tricks fail, and being retrieved beats any edit. The plan merges two numbers into "~40%" (this critique is itself UNVERIFIED: if the paper's abstract gives a single "up to 40%" headline, the plan's wording is fair; read arxiv.org/abs/2311.09735). The paper was not opened in either pass, so **no number from it may be quoted** until it is. | RS08, RS15 |
| 15 | Meta "Andromeda" rewards creative diversity; Instagram "Trial Reels"; DM shares a key ranking signal (v0a §4.6) | **UNVERIFIED** | No source in either pass, and no sibling file or Ranking Stack file mentions Andromeda, Trial Reels or DM shares (grep). [[FACT NEEDED: Meta engineering / Instagram (Mosseri) primary statements]]. Keep the tactics as cheap tests, never as facts (§3). | — |
| 16 | Prices: SerpApi Starter $25/mo, Local Falcon $24.99/mo, AlsoAsked $12/mo, Otterly.AI $29/mo (15 prompts), Screaming Frog £199/yr (free up to 500 URLs), Ahrefs Webmaster Tools free (v1 §15) | **UNVERIFIED** (provenance corrected 2026-10-25) | v1 §15 says "stack prices as of Sep 28, 2026, USD". **Corrected:** an earlier draft said this date came from the Ranking Stack. A grep of the Ranking Stack skill files (references/*.md, README) finds **neither these prices nor "Sep 28, 2026"**; the README itself says "re-verify every number before quoting it". The prices and their date have **no known source**. Internal arithmetic only: 25 + 24.99 + 12 = 61.99, so "≈ $62" is consistent. Currency (USD vs CAD, GBP for Screaming Frog) also UNVERIFIED. | RS-README |
| 17 | GBP API cannot manage products; food menus via the older v4 API; API access requires approval (v0a §6.4, §7.2) | **UNVERIFIED** (circular sourcing; downgraded from Partly 2026-10-25) | Facts as written in research/16b: **Approval required:** an application for Basic API Access; quota 0 = not approved; 300 QPM once approved; the website must represent the business; the email domain must match the site's domain. **Food menus** sit in the v4 package. Google help warns that a menu supplied through the API may disable the menu editor in Business Profile. **Products:** "no public API" comes only from a third-party blog. **Why downgraded:** research/16b's own fact-check log (row 13) marks the approval, quota and email-domain facts **Unverified** ("author's source, not re-opened") and notes that this row cites 16b, so the two files are **not independent**. The menu-editor and products facts are also author-sourced in 16b, never re-opened. S40–S45 stay as lookup targets. | S40–S45, R16b |
| 18 | "Yelp feeds Apple Maps" (ratings/reviews) in Canada (v1 §13, v0a §3.4) | **UNVERIFIED** | No source in either pass. research/03 flags it as a hypothesis ("claim to verify") and cites only Yelp search pages, which say nothing about Apple. Self-test 18. | R03 |
| 19 | Gemini features in Google Maps answer questions from reviews and photos, in Canada (v0a §3.2–3.4) | **UNVERIFIED** | No source in either pass; no sibling file covers it. Self-test 19. | — |
| 20 | Consent Mode v2 (EEA mandate March 2024), relevance in Canada, basic vs advanced (v0a §4.1, §4.5, §7.1; v1 §11) | **UNVERIFIED** | No source in either pass; no sibling file cites Google's consent mode docs. The "March 2024 EEA mandate" date and the basic/advanced definitions are UNVERIFIED. [[FACT NEEDED: developers.google.com/tag-platform consent mode page]]. The Loi 25 fit stays an owner + counsel decision. | — |
| 21 | StatCounter Canada: Google and Bing share (v1 §2, §13) | **UNVERIFIED** | Stays [verify-CA]. Don't quote numbers. | — |
| 22 | GST/HST: some single pastries taxable, packs of 6+ zero-rated (v0c §9) | **UNVERIFIED** | No source in either pass. **Also UNVERIFIED:** the rates in the same v0c §9 row (TPS 5 %, TVQ 9.975 %): no file in research/ or data/ cites a CRA or Revenu Québec page (grep). Another track covers taxes; until it cites CRA and Revenu Québec, tax classes are set with the accountant only. | — |

---

## 2. Self-tests for the owner (phone in Granby, about 30 minutes, free)

Search here is US-located. For "is it live in Canada?" questions, a phone in Granby is the better test. Record a dated screenshot for each in Studio › Gates.

| # | Test | Pass = |
|---|---|---|
| 2 | Sign in to Apple Business with the shop's location and open the location card | Showcases / action links / Order appear as available options → note which ones |
| 5 | Instagram (@coco_vanillegranby) › Settings › Privacy: find the search-engine toggle. Confirm the account is Professional and public | Toggle on |
| 11b | Ask ChatGPT (search on) « meilleure pâtisserie à Granby » and long-press a cited link | The URL contains `utm_source=chatgpt.com` → keep the GA4 rule; if not, rely on the referrer |
| 13 | Search 5 commercial prompts in Google (AI Overview / AI Mode) and in ChatGPT, in FR and EN | Any "Sponsored / Commandité" unit inside the AI answer → ads exist in Canada |
| 18 | Apple Maps on an iPhone: open 3 Granby bakeries | Rating source shown (Yelp logo, Apple ratings, or none) |
| 19 | Google Maps app: open the shop's profile | An "Ask" / Gemini question box on the place → Gemini in Maps is live here |
| 12 | Canadian App Store / Google Play: TikTok present; TikTok Ads Manager: create a Canadian account (stop before paying) | App installable, CAD ads account allowed |

---

## 3. Plan changes required

### plan-v1-ranking-stack.md

| Section | Change |
|---|---|
| §16 row "FAQ rich results" | Keep. Add "(Google Search Central changelog, 2026-05-07)". Add: the Rich Results Test and Search Console no longer cover FAQ, so **remove FAQ from every gate and CI check**. FAQPage JSON-LD is optional and never a gate. The `<details>` FAQ in server HTML stays (AEO/GEO value). |
| §16 row "Apple Business" | Keep. Add: "merges Apple Business Manager/Essentials; Showcases, action links and Order in Canada [[FACT NEEDED]] (self-test §2)". |
| §16 row "kitchen board" | Replace "(policy since April 2026)" with "(Google Maps 'Rating manipulation': staff-quota and specific-content clauses, 2026-04-17)". |
| §4 Layer 12 "≥ 3 new reviews a week" | Keep it as a **shop-level** gate seen only in Studio. Never split it per employee. Studio › Avis shows **no per-staff counts and no leaderboard**. |
| §10 refused tactics and Studio guardrails | Add: "No review request that asks for specific content (a product, a staff name, a star count). Requests stay open-ended until Google clarifies." Example copy, Québec French: « Merci d'avoir choisi Coco Vanille ! Si vous avez deux minutes, votre avis sur Google nous aide beaucoup : [lien] ». Banned: « 5 étoiles », « parlez de notre Paris-Brest », « mentionnez Julie ». |
| §16 row "Agentic checkout" | Replace with: "OpenAI ACP (with Stripe, 2025-09-29): Instant Checkout was US-only and deprioritized on 2026-03-24. ChatGPT shopping is now discovery via product feeds, with checkout on the merchant's site. Google UCP: Canada announced for 'the coming months' (May 2026), not confirmed live in Oct 2026. Action: clean prices and availability in HTML and in Merchant Center; **watch, don't build**." |
| §16 row "ChatGPT search" | Change to "Third-party search providers (OpenAI doesn't name them; Microsoft is inferred) + OAI-SearchBot". Keep the Bing Webmaster Tools and IndexNow actions, because they're cheap and Copilot is reported to use Bing (UNVERIFIED in this file: no Microsoft source). |
| §11 Measurement | The GA4 AI rule matches **referrer chatgpt.com OR utm_source=chatgpt.com**. Mark the utm part [verify: self-test 11b]. Also replace "Vercel log drain" with "VPS nginx access logs" (requirements 2026-10-25). |
| §13 lines "TikTok [regulatory status]" and "Yelp (feeds Apple Maps)" | Change to "TikTok [[FACT NEEDED: Oct 2026 status]]" and "Yelp (may feed Apple Maps in Canada: self-test 18)". |
| §15 Tools and cost | Tag every price "[verify: pricing page, date, currency]" and drop "as of Sep 28, 2026" from the heading: no source for that date was found (claim 16). The week-7 spend (≈ US$62 + AI usage) is **not committed** until checked. Free tools stay. |
| §17 Verify list | Rename "Google's commerce protocol" to "Google UCP (Canada consumer launch)". Add Consent Mode decision, Instagram toggle, `utm_source` test. Replace "host firewall (Vercel or Cloudflare)" with "VPS firewall / nginx bot rules". |

### plan-v0a-master-plan.md

| Section | Change |
|---|---|
| §2.1 (lines on BigQuery → Looker Studio), §2.3 "Looker dashboards", §3.2 Measurement row "BigQuery + Looker" | "Looker Studio" → **"Data Studio"** (renamed April 2026 per secondary sources; claim 3). |
| §3.2 "Emerging" row: "AI agents completing checkout ③" | Keep ③. Add "ChatGPT: discovery only since 2026-03-24; Google UCP: Canada not confirmed". |
| §3.3 "① Apple Business Connect, including Showcases" | → "① Apple Business (formerly Business Connect); Showcases if available in Canada [[FACT NEEDED]]". Same rename in §3.4 (Siri row) and §7.2 Listings row ("Apple Business interface"). |
| §3.4 row "Gemini features in Google Maps": "Reviews that name products" | → "Specific reviews in customers' own words (we never prompt for product or staff names: 2026-04-17 policy)". Add "[verify-CA: self-test 19]". |
| §3.4 row "ChatGPT search": "Bing's index" | → "third-party search providers (unnamed by OpenAI), its own crawler OAI-SearchBot". |
| §3.4 Siri row: "partners such as Yelp" | Add "[verify-CA: self-test 18]". Keep "never ask for Yelp reviews". |
| §4.1, §4.5, §7.1 Consent Mode v2 | Mark [verify: Google's consent mode docs]. Whether "basic vs advanced" fits Loi 25 is an **owner + counsel decision** (see decisions). Don't assume Google's EEA mandate applies in Canada (UNVERIFIED either way). |
| §4.6 Andromeda, "shares by DM per view", Trial Reels | Tag each [verify: Meta / Instagram primary statement]. The tactics (several distinct creative concepts, watching shares) are low cost, so keep them as tests, not as facts. |
| §4.7 TikTok regulatory note | Replace "as of my last information" with "[[FACT NEEDED: status Oct 2026]]". **No TikTok ad spend until verified.** Organic posting and keeping raw video in our own media library stay. |
| §6.4 product flow and §7.2 API sentence | Keep "profile products = manual task" (third-party source only). Add, both tagged [UNVERIFIED: claim 17, read the Google pages S40–S44 before building]: (1) Basic API Access application needs the live site and an @cocovanillegranby.com mailbox (file it at week 6, per research/16b); (2) pushing the food menu through v4 can lock the GBP menu editor (Google help as cited by 16b), so pick **one** source of truth (Studio). |

### plan-v0b-multilingual-local-domination.md

| Section | Change |
|---|---|
| §B2 "Apple Business Connect:" and §B6 Core directories | Rename to Apple Business. Showcases [[FACT NEEDED: Canada]]. |
| §B3 Reputation engine | Add the two 2026-04-17 clauses: no staff quotas; no asking for specific content or staff names. |
| §C4 KPI "% mentioning products" | Keep as a **measured** metric only, never a request. Change "% answered within 48 h" to 24 h (matches v1 §16). |

### plan-v0c-site-ux-ordering.md

| Section | Change |
|---|---|
| Layer 4, item 6 (Princeton) | → "Lab study (Aggarwal et al., KDD 2024): adding statistics +41%, quotations +28% in a benchmark. Later studies found that phrasing tricks don't beat being retrieved. Use real numbers and named quotes because they are true and quotable." Tag [verify: paper]. |
| Layer 5, Instagram line | Add "since 2025-07-10; professional, public accounts, 18+; on by default (secondary sources; claim 5)". Studio adds a **monthly check of the toggle** (Gates), which settles it either way. |
| Layer 6, `utm_source=chatgpt.com` | Tag [verify: self-test 11b]. |
| §7 Signature interactions, GSAP | → "GSAP (free for commercial use since 2025-04-30 under Webflow's Standard No-Charge licence, all plugins incl. ScrollTrigger; the licence only bars competing visual animation builders)". |
| §8 PWA web push | Add: "iOS: only after the app is added to the Home Screen, and the permission prompt must follow a tap." Onboarding shows « Ajoutez Coco Vanille à l'écran d'accueil pour recevoir « C'est prêt ! » » before « Activer les alertes ». |
| §9 LPC row, tips | → "Since 2025-05-07 (Bill 72): if a tip is suggested, base it on the pre-tax amount, show options neutrally and uniformly, and let the customer enter any amount. The rule is written for payment terminals; online scope [[FACT NEEDED: OPC or lawyer]]." **Recommended: no tip prompt in online pickup checkout.** |
| §9 Taxes row | Tag the "6+ zero-rated" rule **and the TPS 5 % / TVQ 9.975 % rates** [verify: CRA GST/HST and Revenu Québec; taxes track]. Keep "set up tax classes with the accountant". |
| §12 Horizon (agentic) | Rewrite as in v1 §16 above (ACP discovery-only since 2026-03-24; UCP Canada not confirmed). |
| TL;DR item 2 | "Apple Business Connect" → "Apple Business". |

If a terminal or online tip prompt is ever kept, the rule in JavaScript (integer cents, pre-tax base, no default option):

```js
// tips.js: suggestions on the pre-tax subtotal (LPC, since 2025-05-07); all options rendered identically
export function tipOptions(subtotalCents, rates = [0.10, 0.15, 0.18]) {
  return rates.map((r) => ({ rate: r, cents: Math.round(subtotalCents * r) })); // never on subtotal + TPS + TVQ
}
// UI: same style for every button, no "recommandé" badge, plus « Autre montant » and « Aucun pourboire ».
```

---

## 4. Follow-up search queue (next pass, about 12 queries)

1. "TikTok Technology Canada" wind-up order judicial review decision 2025 2026 (canada.ca, Federal Court)
2. ads in ChatGPT countries available 2026 (openai.com)
3. "ads in AI Overviews" countries Canada French (support.google.com/google-ads)
4. Meta engineering "Andromeda" ads retrieval; Instagram "Trial Reels"; Mosseri "sends per reach"
5. Pricing pages: serpapi.com/pricing, localfalcon.com pricing, alsoasked.com pricing, otterly.ai pricing, screamingfrog.co.uk SEO Spider licence, ahrefs.com webmaster-tools
6. Apple Business feature availability by country (Showcases, action links)
7. Apple Maps ratings and reviews providers Canada (Yelp)
8. Gemini in Google Maps "Ask Maps" countries Canada
9. Google consent mode basic vs advanced (developers.google.com/tag-platform)
10. gs.statcounter.com search engine market share Canada, latest month
11. CRA GST/HST memorandum basic groceries bakery products "six or more"
12. OpenAI crawlers page (OAI-SearchBot) and `utm_source=chatgpt.com` confirmation

---

## Sources

- S1 · Latest Google Search Documentation Updates (Google Search Central) — https://developers.google.com/search/updates — seen 2026-10-25
- S2 · Google to no longer support FAQ rich results (Search Engine Land) — https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957 — seen 2026-10-25
- S3 · FAQ Rich Results Deprecated: Google's May 2026 Change (Passionfruit) — https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now — seen 2026-10-25
- S4 · Apple Business Connect is now Apple Business (Apple Support) — https://support.apple.com/en-om/guide/apple-business-connect/abcb205640e7/web — seen 2026-10-25
- S5 · Apple Business Connect Is Now Apple Business: What to Know (PinMeTo) — https://www.pinmeto.com/blog/apple-business-connect-now-apple-business/ — seen 2026-10-25
- S6 · Apple Business Connect (Now Apple Business): How to set up and optimize (Birdeye) — https://birdeye.com/blog/apple-business-connect-comprehensive-guide/ — seen 2026-10-25
- S7 · Data Studio is back: Google kills Looker Studio name for good (PPC Land) — https://ppc.land/data-studio-is-back-google-kills-looker-studio-name-for-good/ — seen 2026-10-25
- S8 · The Return of Data Studio: What Google's Rebrand Means for Your Dashboards (Calibrate Analytics, 2026-04-17) — https://calibrate-analytics.com/insights/2026/04/17/The-Return-of-Data-Studio-What-Googles-Rebrand-Means-for-Your-Dashboards/ — seen 2026-10-25
- S9 · Data Studio (Wikipedia) — https://en.wikipedia.org/wiki/Data_Studio — seen 2026-10-25
- S10 · Data Studio vs Looker Studio: What Changed in 2026? (Catchr) — https://www.catchr.io/post/google-data-studio-vs-looker-studio — seen 2026-10-25
- S11 · Prohibited & restricted content, Maps User Generated Content Policy Help (Google) — https://support.google.com/contributionpolicy/answer/7400114?hl=en — seen 2026-10-25
- S12 · Google tightens Maps review policy: staff names and quotas now banned (PPC Land) — https://ppc.land/google-tightens-maps-review-policy-staff-names-and-quotas-now-banned/ — seen 2026-10-25
- S13 · Google Business Profile review policy update (April 2026) (Launchcodex) — https://launchcodex.com/blog/seo-geo-ai/google-business-profile-review-policy-update/ — seen 2026-10-25
- S14 · Google Review Policy Update (April 2026) (Mainstreethost) — https://www.mainstreethost.com/blog/google-review-policy-update-april-2026/ — seen 2026-10-25
- S15 · 4 ways to read Google's "no cherry-picking" policy on Google reviews (Local Visibility System, 2018) — https://www.localvisibilitysystem.com/2018/04/16/4-ways-to-read-googles-no-cherry-picking-policy-on-google-reviews/ — seen 2026-10-25
- S16 · Yelp increasingly cracking down on "review solicitation" across the internet (Search Engine Land) — https://searchengineland.com/yelp-increasingly-cracking-review-solicitation-across-internet-286290 — seen 2026-10-25
- S17 · How does Yelp's review solicitation penalty work? (Search Engine Land) — https://searchengineland.com/how-does-yelps-review-solicitation-penalty-work-299893 — seen 2026-10-25
- S18 · Instagram content becomes searchable on Google starting July 10 (PPC Land) — https://ppc.land/instagram-content-becomes-searchable-on-google-starting-july-10/ — seen 2026-10-25
- S19 · Search engines can now index public content from Instagram (afaqs) — https://www.afaqs.com/news/digital/search-engines-can-now-index-public-content-from-instagram-9483796 — seen 2026-10-25
- S20 · Instagram Content Now Appears in Google Search (Metricool) — https://metricool.com/instagram-indexing-on-google/ — seen 2026-10-25
- S21 · Webflow makes GSAP 100% free (Webflow blog) — https://webflow.com/blog/gsap-becomes-free — seen 2026-10-25
- S22 · GSAP Standard "No Charge" License (GSAP) — https://gsap.com/community/standard-license/ — seen 2026-10-25
- S23 · GSAP README, gsap@3.15.0 (jsDelivr) — https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md — seen 2026-10-25
- S24 · Des pourboires calculés avant les taxes et des prix plus clairs à l'épicerie (Québec.ca) — https://www.quebec.ca/nouvelles/actualites/details/des-pourboires-calcules-avant-les-taxes-et-des-prix-plus-clairs-a-lepicerie-62679 — seen 2026-10-25
- S25 · Des pourboires calculés avant les taxes et des prix plus clairs (Office de la protection du consommateur) — https://www.opc.gouv.qc.ca/actualite/communiques/article/pourboires-avant-taxes-et-prix-plus-clairs — seen 2026-10-25
- S26 · Terminé, le pourboire sur les taxes au Québec (Radio-Canada) — https://ici.radio-canada.ca/nouvelle/2163367/nouvelles-regles-pourboire-etiquetage-exactitude-prix-quebec — seen 2026-10-25
- S27 · Pourboires au Québec, guide marchands (TD, PDF) — https://td.com/content/dam/tdct/document/pdf/business-banking/tipping-in-quebec-fr.pdf — seen 2026-10-25
- S28 · Web Push for Web Apps on iOS and iPadOS (WebKit) — https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ — seen 2026-10-25
- S29 · Apple Details Safari 16.4 and its 135 New Web Features (iPhone in Canada, 2023-03-27) — https://www.iphoneincanada.ca/2023/03/27/safari-16-4-new-web-features/ — seen 2026-10-25
- S30 · Developing an open standard for agentic commerce (Stripe) — https://stripe.com/se/blog/developing-an-open-standard-for-agentic-commerce — seen 2026-10-25
- S31 · OpenAI ChatGPT Instant Checkout, agentic commerce, Etsy, Shopify (Retail Dive) — https://www.retaildive.com/news/openai-chatgpt-instant-checkout-agentic-commerce-etsy-shopify/761442/ — seen 2026-10-25
- S32 · Powering Product Discovery in ChatGPT (OpenAI, 2026-03-24) — https://openai.com/index/powering-product-discovery-in-chatgpt/ — seen 2026-10-25
- S33 · OpenAI revamps shopping experience in ChatGPT after struggling with Instant Checkout (CNBC, 2026-03-24) — https://www.cnbc.com/2026/03/24/openai-revamps-shopping-experience-in-chatgpt-after-instant-checkout.html — seen 2026-10-25
- S34 · How we're helping retailers thrive with new Universal Commerce Protocol features (Google blog, GML 2026) — https://blog.google/products-and-platforms/products/shopping/shopping-updates-google-marketing-live/ — seen 2026-10-25
- S35 · Universal Commerce Protocol powered features on Google (Google, Accelerate US) — https://business.google.com/us/accelerate/announcements/universal-commerce-protocol-powered-features-on-google/ — seen 2026-10-25
- S36 · Google Agentic Checkout: Enable Buying in AI Mode & Gemini (BigCommerce) — https://www.bigcommerce.com/articles/ecommerce/google-agentic-checkout/ — seen 2026-10-25
- S37 · The Universal Commerce Protocol rollout is happening (Productrise) — https://productrise.app/blog/ucp-rollout-update — seen 2026-10-25
- S38 · ChatGPT search (OpenAI Help Center) — https://help.openai.com/en/articles/9237897-chatgpt-search — seen 2026-10-25
- S39 · ChatGPT search explained: how it finds and links to websites (eSEOspace) — https://eseospace.com/blog/chatgpt-search-explained/ — seen 2026-10-25
- S40 · Google Business Profile APIs: Prerequisites (cited by research/16b; not opened by this track) — https://developers.google.com/my-business/content/prereqs — seen 2026-10-25
- S41 · Google Business Profile APIs: Usage limits (cited by research/16b) — https://developers.google.com/my-business/content/limits — seen 2026-10-25
- S42 · Google Business Profile Help: How to use the Business Profile APIs (cited by research/16b) — https://support.google.com/business/answer/6333473?hl=en — seen 2026-10-25
- S43 · GBP: Package google.mybusiness.v4 (cited by research/16b) — https://developers.google.com/my-business/reference/rpc/google.mybusiness.v4 — seen 2026-10-25
- S44 · Google Business Profile Help: About the menu editor (cited by research/16b) — https://support.google.com/business/answer/9455840?hl=en — seen 2026-10-25
- S45 · Google Products: the part nobody automates (no products API) (The IM Agency; cited by research/16b) — https://www.theimagency.com/blog/google-business-profile-products-no-api — seen 2026-10-25
- S46 · Google Shopping introduces Universal Cart, agentic shopping (Google blog) — https://blog.google/products-and-platforms/products/shopping/google-shopping-cart/ — seen 2026-10-25
- RS08 · Ranking Stack reference 08-aeo-geo.md (secondary; local skill file) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/08-aeo-geo.md — seen 2026-10-25
- RS10 · Ranking Stack reference 10-measurement.md (secondary; local skill file) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/10-measurement.md — seen 2026-10-25
- RS15 · Ranking Stack reference 15-sources.md (lists arxiv.org/abs/2311.09735 and platform.openai.com/docs/bots; not opened) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/references/15-sources.md — seen 2026-10-25
