# 18 · Dated and risky claims in the plans: verification (2026-10-25)

Scope: 22 claims taken from plan-v1 (§10–§17), plan-v0a, plan-v0b and plan-v0c. Many are dated after the owner's assistant's training data.

Method and limits (read first):

- This track ran **18 WebSearch queries** (US-located, summarized results). Then the shared search budget for this turn (200 calls across all agents) ran out, and further searches were refused.
- Cross-checks: research/16a and research/16b (sibling tracks that cite Google, WebKit and Meta docs) and the Ranking Stack references (secondary sources).
- **No verdict is given without a source.** After the completion pass, only 11b and 17 stay fully **UNVERIFIED**. Several Partly rows still hold UNVERIFIED sub-parts; the completion pass lists them. Self-tests are in §2, the remaining search queue in §4.
- WebFetch and curl are blocked, so official pages were read only through search summaries. Where a summary quoted secondary blogs rather than the official page, the row says so.
- **Second pass, adversarial (2026-10-25).** The shared search budget was already used up when this pass started: every WebSearch call was refused, so **no new web evidence** was gathered. This pass tested 20 high-risk claims against what exists locally: this file's own verdict scale, the fact-check log of research/16b, and a grep of the Ranking Stack skill files. Result: 4 verdicts downgraded (3, 4c, 5, 17), 1 provenance statement corrected (16), 1 wording corrected (1), every "Not checked" / "Not found" changed to **UNVERIFIED**. Details are in each downgraded row ("downgraded … 2026-10-25").
- **Completion pass (2026-10-25).** It ran 12 new WebSearch queries (its cap) on claims 12, 13, 15, 16, 18, 19 and 20, plus one re-check of claim 9. Claims 21 and 22 were settled from sibling files research/06 and research/07 without a search. Summary in "Completion pass" before the Sources.

Verdicts: **Confirmed** (an official source in the summaries) · **Partly** (true with a correction, or only secondary sources) · **Contradicted** (wrong or out of date) · **UNVERIFIED** (no supporting source found, or no search possible; never treat as true).

Bottom line:

| Verdict | Claims |
|---|---|
| Confirmed (6) | 1 FAQ rich results gone · 4a staff-quota clause · 4b no gating, no incentives · 6 GSAP free · 7 tips before tax (terminals) · 8 iOS web push |
| Partly (16) | 2 Apple Business (Canada features unknown) · 3 Data Studio (secondary only) · 4c Yelp solicitation (2017–2018 secondary only) · 5 Instagram indexing (secondary only) · 10 Google UCP (Canada not live) · 11a ChatGPT search providers · 14 Princeton GEO (secondary only) · **12 TikTok: wind-down order set aside 2026-01-21** · **13 ChatGPT ads in Canada since ~Apr 2026 (secondary); Google AI-answer ads in Canada not confirmed** · **15 Andromeda, Trial Reels, sends (secondary; "the key signal" unproven)** · **16 prices: 2 vendor-sourced, 2 secondary, 2 unsourced** · **18 Apple has its own ratings in Canada; Yelp still shown (undated)** · **19 Ask Maps in Canada, English, ~Aug 2026 (secondary)** · **20 Consent Mode v2: EEA scope on a Google page; no Canadian mandate found** · **21 Bing ≈ 10 % (via R06)** · **22 GST rule confirmed; QST changed 2026-07-15 (via R07)** |
| Contradicted (1) | 9 ChatGPT Instant Checkout: deprioritized by OpenAI on 2026-03-24 (re-checked: still paused in Sept–Oct 2026, secondary) |
| UNVERIFIED (2) | 11b `utm_source` · 17 GBP API (circular sourcing) |

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
| 9 | OpenAI Agentic Commerce Protocol with Stripe (2025); Instant Checkout "limited to approved partners"; Canada (v1 §16, v0c §12) | **Contradicted** (out of date) | ACP is confirmed: co-developed with Stripe and open-sourced, launched **2025-09-29**. Instant Checkout started with **US users and US Etsy sellers**, with Shopify merchants next; other merchants applied and were certified. **On 2026-03-24** OpenAI ("Powering Product Discovery in ChatGPT") expanded ACP to **product discovery** and said the first Instant Checkout lacked flexibility. Merchants now use **their own checkout**, and ChatGPT apps remain an option. **No Canadian launch found** in OpenAI or press sources. **Re-check (completion pass, 1 query, secondary only):** a vendor blog cites Modern Retail reporting a scale-back on **2026-03-12**; a commercetools note dated **2026-09-15** still calls Instant Checkout paused (via a summary); Shopify guides edited **Oct 2026** say ChatGPT shoppers find products through Shopify Catalog and pay on the merchant's own store. Still no Canadian launch. Verdict unchanged. | S30, S31, S32, S33, S91–S94 |
| 10 | Google's agentic-checkout protocol, "US-first with Canada next" (v1 §16–17) | **Partly** | Name: **Universal Commerce Protocol (UCP)**, with "Universal Cart" in Search and Gemini. At Google Marketing Live (**May 2026**; 2026-05-20 per secondary sources), Google said UCP checkout goes live with US retailers and **expands to Canada and Australia "in the coming months"**, with the UK later. As of Oct 2026 sources conflict: Google help reportedly lists US/Canada/Australia eligibility (UNVERIFIED: that help page is not among the sources); BigCommerce says "early access for select U.S. merchants". **Consumer availability in Canada: UNVERIFIED.** The 2026-05-20 date is secondary only. Checkout uses Google Pay; the retailer stays merchant of record. | S34, S35, S36, S37, S46 |
| 11a | ChatGPT search uses third-party search providers (Microsoft among them) + OAI-SearchBot (v1 §16, v0a §3.4) | **Partly** | OpenAI Help: ChatGPT search "sometimes partners with other search providers", rewrites the query for them and shares general location, not the IP. **OpenAI does not name the providers.** A third-party analysis: the only pointer is links to Microsoft's and Shopify's privacy documents. So "Microsoft" is an inference. Third-party source: blocking OAI-SearchBot removes a site from ChatGPT search answers (navigational links may remain). OpenAI's crawler page is listed in the Ranking Stack sources but was not opened. | S38, S39, RS15 |
| 11b | ChatGPT appends `utm_source=chatgpt.com` to links (v0c Layer 6) | **UNVERIFIED** (no web source; stated only by the Ranking Stack, secondary) | No web result in either pass. Ranking Stack refs 10 and 00 state it; neither cites an OpenAI page. Treat as UNVERIFIED until the self-test in §2 passes. The GA4 rule already matches the referrer too, so nothing breaks if it is false. | RS10 |
| 12 | TikTok Canada: Nov 2024 wind-down order; 2026 status (v0a §4.7, v1 §13, §17) | **Partly** (completion pass; secondary only; the plan's status is out of date) | **Order:** a wind-up order for TikTok Technology Canada followed a national-security review under the Investment Canada Act (Nov 2024, tracker + law firm). The app stayed available to Canadians (summary). **Set aside:** on **2026-01-21** the Federal Court set the order aside and sent the matter back to the Industry Minister for a new review. ISED said this was "on the consent of the Government of Canada and TikTok", so no reasons were given (BNN Bloomberg, 2026-01-22; Cassels). **After that:** one tracker entry says that on **2026-03-09** the Minister let TikTok Technology Canada keep operating under binding undertakings: **UNVERIFIED** (single source, no canada.ca page seen). **Self-serve ads in Canada, Oct 2026: UNVERIFIED** (not in the results). | S47, S48, S49, S50 |
| 13 | Ads in ChatGPT; ads in AI Overviews / AI Mode, in Canada, Oct 2026 (v1 §17) | **Partly** (completion pass; secondary only) | **ChatGPT, Canada:** US pilot from **2026-02-09**. Expansion to Canada, Australia and New Zealand announced **2026-03-26** (one outlet). An outlet says OpenAI's ChatGPT release notes (updated **2026-04-16**) confirm ads rolling out there. Ads go only to **logged-in adults on Free and Go**; paid tiers stay ad-free. Advertiser targeting is reported for US/CA/AU/NZ. A July 2026 third-party tracker says 53.6 % of Canadian replies had an ad: UNVERIFIED (single tracker). A blog relays an OpenAI claim of 60+ ad countries: UNVERIFIED. The summary doesn't tie each detail to one outlet. **Google, Canada:** at GML **May 2025** Google said ads in AI Overviews would expand "later this year" in **English** to select countries, Canada among them. **No 2026 source confirms that ads in AI Overviews or AI Mode are live in Canada**: UNVERIFIED. GML 2026 (2026-05-20) announced new AI Mode ad formats, with no word on Canada. | S51–S58 |
| 14 | Princeton GEO study (2023): quotes and statistics raise AI visibility by up to ~40% (v0c Layer 4) | **Partly** (secondary only) | Ranking Stack refs: Aggarwal et al., *GEO: Generative Engine Optimization*, **KDD 2024** (arXiv 2311.09735). **Statistics +41%, direct quotes +28%**; citing sources also strong; keyword stuffing negative. Later work (C-SEO Bench, NeurIPS 2025; FeatGEO, 2026) finds phrasing tricks fail, and being retrieved beats any edit. The plan merges two numbers into "~40%" (this critique is itself UNVERIFIED: if the paper's abstract gives a single "up to 40%" headline, the plan's wording is fair; read arxiv.org/abs/2311.09735). The paper was not opened in either pass, so **no number from it may be quoted** until it is. | RS08, RS15 |
| 15 | Meta "Andromeda" rewards creative diversity; Instagram "Trial Reels"; DM shares a key ranking signal (v0a §4.6) | **Partly** (completion pass; secondary sources quoting Meta and Mosseri) | **Andromeda:** Meta's **ad retrieval** stage. It narrows millions of ads to a few thousand candidates. Meta engineering figures (+6 % recall, +8 % ads quality on selected segments) appear only through secondary summaries. Meta reportedly called creative diversification a "foundational best practice" (**Dec 2025**). Grouping near-identical ads (one "Entity ID", a Creative Similarity Score) and every threshold (> 60 % vs < 40 %) conflict between blogs: UNVERIFIED. **Trial Reels:** Reels shown **only to non-followers**. Mosseri, as quoted: they "almost always" get less reach; compare trial vs trial; look at sends, likes and watch time. A claim from his Aug 2026 Q&A that sharing a trial reel to followers doesn't hurt reach: UNVERIFIED (one blog). **Sends:** a blog says Mosseri named watch time, likes per reach and **sends per reach** as the signals for reaching new people. "Sends carry the most weight" is that blog's reading. **No primary source makes DM shares "the key signal"**: UNVERIFIED. | S59–S66 |
| 16 | Prices: SerpApi Starter $25/mo, Local Falcon $24.99/mo, AlsoAsked $12/mo, Otterly.AI $29/mo (15 prompts), Screaming Frog £199/yr (free up to 500 URLs), Ahrefs Webmaster Tools free (v1 §15) | **Partly** (completion pass; provenance corrected 2026-10-25) | The "Sep 28, 2026" date still has **no source** (a grep of the Ranking Stack finds neither the prices nor the date). Per tool, as of the Oct 2026 searches: **SerpApi:** Starter **$25/mo = 1,000 searches, 200/h**; free plan 250/mo; one source says speed modes multiply the price ($50/$100). Secondary only. **Local Falcon:** **Starter $24.99/mo = 7,500 credits** (1 credit = 1 grid pin); Basic $49.99, Pro $99.99, Premium $199.99; unused credits expire. From Local Falcon's own pricing page and knowledge base (vendor). **Otterly.AI:** **Lite $29/mo, 15 prompts** (ChatGPT, AI Overviews, Perplexity, Copilot); top plan $489. Capterra + G2 (G2 data dated **2025-08-18**). **Screaming Frog:** **free up to 500 URLs; a paid licence lasts 1 year** (official pricing page). The price conflicts: £199 (Wise, May 2025), £149 (Vendr), £209 (Subger), $259 (Temperstack). **AlsoAsked $12** and **Ahrefs Webmaster Tools free**: no result, UNVERIFIED. Currency: "$" in the summaries; USD presumed, UNVERIFIED. Arithmetic: 25 + 24.99 + 12 = 61.99, so "≈ $62" holds only if AlsoAsked is $12. | S67–S78, S95, RS-README |
| 17 | GBP API cannot manage products; food menus via the older v4 API; API access requires approval (v0a §6.4, §7.2) | **UNVERIFIED** (circular sourcing; downgraded from Partly 2026-10-25) | Facts as written in research/16b: **Approval required:** an application for Basic API Access; quota 0 = not approved; 300 QPM once approved; the website must represent the business; the email domain must match the site's domain. **Food menus** sit in the v4 package. Google help warns that a menu supplied through the API may disable the menu editor in Business Profile. **Products:** "no public API" comes only from a third-party blog. **Why downgraded:** research/16b's own fact-check log (row 13) marks the approval, quota and email-domain facts **Unverified** ("author's source, not re-opened") and notes that this row cites 16b, so the two files are **not independent**. The menu-editor and products facts are also author-sourced in 16b, never re-opened. S40–S45 stay as lookup targets. | S40–S45, R16b |
| 18 | "Yelp feeds Apple Maps" (ratings/reviews) in Canada (v1 §13, v0a §3.4) | **Partly** (completion pass; dates missing) | **Yelp in Apple Maps:** Adweek, "Yelp officially joins Apple Maps" (date not in the summary). **Canada:** iMore says Apple's own **thumb ratings and photo uploads** were offered in the **USA and Canada**, and that the external ratings (**Yelp, Tripadvisor**) were still shown (article date not in the summary). **Yellow Pages (YP.ca)** announced it would supply ratings and reviews to Apple Maps (1.8 M Canadian listings; date and outlet not clear in the summary: UNVERIFIED). Marketing pages claiming a native Apple star rating from **2026-05-09**, with Yelp moved to a secondary tab, contradict each other: UNVERIFIED. **Which source a Granby bakery card shows today:** self-test 18. research/03 had flagged this as a hypothesis. | S79–S82, R03 |
| 19 | Gemini features in Google Maps answer questions from reviews and photos, in Canada (v0a §3.2–3.4) | **Partly** (completion pass; secondary only) | **Ask Maps** (Gemini in Google Maps): launched **March 2026** in the US and India (Droid Life, 2026-03-12); not in Canada then (MobileSyrup). Rolled out to **150+ countries including Canada** around **Aug 2026** (EFTM; MobileSyrup 2026-08-06). **English only** for now (Aixploria). Canada gets Personal Intelligence (Gmail details) and live transit. **Agentic features (food ordering through partners, hotel search) are US-only**, with no Canadian date. research/06 (d): Ask Maps replaces GBP Q&A (secondary). **That Ask Maps answers from reviews and photos: UNVERIFIED** (not stated in these summaries). **French in Canada: UNVERIFIED.** | S83–S86, R06 |
| 20 | Consent Mode v2 (EEA mandate March 2024), relevance in Canada, basic vs advanced (v0a §4.1, §4.5, §7.1; v1 §11) | **Partly** (completion pass) | **Basic vs advanced:** Confirmed on Google's consent-mode overview (research/07, L13). Basic blocks Google tags until consent. Advanced loads them and sends **cookieless pings** while consent is denied, which Google uses for modelling. **v2:** adds `ad_user_data` and `ad_personalization` to `ad_storage` and `analytics_storage`. **EEA:** a Google Tag Manager help page in the results says advertisers must collect consent from **EEA** end users and send the signals to keep measurement, ad personalisation and remarketing. The **March 2024** deadline and the v1 → v2 auto-mapping (`ad_storage` → `ad_user_data`; `ad_personalization` must be set by hand) come from secondary sources (SEJ, Cookie Information). The basis is Google's **EU User Consent Policy**; no source shows that the DMA itself mandates Consent Mode. UK scope: UNVERIFIED. **Canada:** no Google requirement found (absence, not proof). Loi 25 decides, and research/07 S7 sets **basic** mode; advanced mode needs counsel. | S87–S90, R07 |
| 21 | StatCounter Canada: Google and Bing share (v1 §2, §13) | **Partly** (via research/06; no new search) | research/06 (b) read StatCounter Canada: **Bing ≈ 9.8–10.1 %** (May–Sept 2026; 10.06 % Sept). **Top engine ≈ 85–86 %**; the label was cut from the summary, so "Google" is an inference. Yahoo ≈ 2.3–2.5 %, DuckDuckGo ≈ 1.5 %. Engine share **by device: not found**. Mobile OS, Sept 2026: **iOS 64.87 %** (Confirmed). Quote only with month + URL. | R06 (W7–W10) |
| 22 | GST/HST: some single pastries taxable, packs of 6+ zero-rated (v0c §9) | **Partly**: GST rule **Confirmed**, QST side **out of date** (via research/07; no new search) | **GST (ETA Sch. VI, Part III, s. 1(m)):** cakes, muffins, pies, pastries, tarts, cookies, doughnuts, brownies and croissants **with sweetened filling or coating** (or similar) are **taxable when sold as single servings in quantities of fewer than six** (prepackaged or not); otherwise zero-rated. Plain bread products stay zero-rated. Revenu Québec page + CRA Memo 4.3. CRA rulings, via a third-party database: a mixed six is zero-rated; one ruling puts the single-serving line at < 230 g. **QST since 2026-07-15:** the same sweet single servings are **zero-rated for QST**, while GST continues; drinks are excluded (Revenu Québec "Fournitures détaxées", via summary). Whether that's permanent: UNVERIFIED. **Rates:** GST 5 % Partly; QST 9.975 % UNVERIFIED this session (research/07 T-7). Tax classes stay with the accountant. | R07 (T1, T3–T5, T10) |

---

## 2. Self-tests for the owner (phone in Granby, about 30 minutes, free)

Search here is US-located. For "is it live in Canada?" questions, a phone in Granby is the better test. Record a dated screenshot for each in Studio › Gates.

| # | Test | Pass = |
|---|---|---|
| 2 | Sign in to Apple Business with the shop's location and open the location card | Showcases / action links / Order appear as available options → note which ones |
| 5 | Instagram (@coco_vanillegranby) › Settings › Privacy: find the search-engine toggle. Confirm the account is Professional and public | Toggle on |
| 11b | Ask ChatGPT (search on) « meilleure pâtisserie à Granby » and long-press a cited link | The URL contains `utm_source=chatgpt.com` → keep the GA4 rule; if not, rely on the referrer |
| 13 | Search 5 commercial prompts in Google (AI Overview / AI Mode) and in ChatGPT (signed in, **Free** plan: ads go only to Free/Go adults), in FR and EN | Any "Sponsored / Commandité" unit inside the AI answer. Google: still open. ChatGPT: expected yes (claim 13), so note which prompts show ads and which competitors buy them |
| 18 | Apple Maps on an iPhone: open 3 Granby bakeries and the shop's own card | Rating source shown: Apple thumbs (%), Yelp, Tripadvisor, PagesJaunes/YP, or none. Note it per card |
| 19 | Google Maps app (phone language EN, then FR): open the shop's profile, tap "Ask Maps", ask « Est-ce que Coco Vanille fait des gâteaux personnalisés ? » | The button exists (expected in EN since ~Aug 2026), and the answer cites reviews, photos or the profile. Note whether FR works |
| 12 | Canadian App Store / Google Play: TikTok present; TikTok Ads Manager: create a Canadian account (stop before paying) | App installable, CAD ads account allowed. Low priority: there's no ad spend at launch anyway |
| 16 | Desk check (10 min): open alsoasked.com pricing, ahrefs.com/webmaster-tools, screamingfrog.co.uk SEO Spider pricing | Price, currency and date recorded in Studio › Gates before any week-7 spend |

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
| §2 Canada bullet "Bing is a stronger second engine [verify-CA]" | → "Bing ≈ 10 % of Canadian search (StatCounter, May–Sept 2026, via research/06)". This matches research/06's change list; apply it once. |
| §13 lines "TikTok [regulatory status]" and "Yelp (feeds Apple Maps)" | → "TikTok (the 2024 wind-down order was set aside by the Federal Court on 2026-01-21, on consent; the new review's outcome is UNVERIFIED)" and "Yelp, Tripadvisor (shown in Apple Maps next to Apple's own ratings in Canada: secondary, undated; self-test 18)". |
| §13 "Ads inside AI answers: [verify-CA, re-check quarterly]" | → "ChatGPT: ads for signed-in Free/Go adults in Canada since ~Apr 2026 (secondary; claim 13). Google AI Overviews / AI Mode ads in Canada: announced May 2025 for English, live status UNVERIFIED. Re-check quarterly." Effect: organic answers now share space with sponsored units in ChatGPT, so the prompt panel logs **sponsored competitors** as a separate column. |
| §15 Tools and cost | Drop "as of Sep 28, 2026" (no source). Rewrite the rows: "SerpApi Starter US$25/mo, 1,000 searches (secondary, Oct 2026) · Local Falcon Starter US$24.99/mo, 7,500 credits (vendor page, Oct 2026) · AlsoAsked [verify] · Otterly.AI Lite US$29/mo, 15 prompts (Capterra/G2, G2 data 2025-08-18) · Screaming Frog free ≤ 500 URLs (official); licence price conflicting, don't quote · Ahrefs Webmaster Tools [verify]". The week-7 spend (≈ US$62 + AI usage) is **not committed** until self-test 16 is done. Free tools stay. |
| §17 Verify list | Rename "Google's commerce protocol" to "Google UCP (Canada consumer launch)". **Close:** StatCounter (research/06), TikTok status (claim 12, Partly), ChatGPT ads in Canada (claim 13, Partly). **Keep:** Google AI-answer ads in Canada (self-test 13), AlsoAsked + AWT prices (self-test 16). Add the Consent Mode decision, the Instagram toggle and the `utm_source` test. Replace "host firewall (Vercel or Cloudflare)" with "VPS firewall / nginx bot rules". |

### plan-v0a-master-plan.md

| Section | Change |
|---|---|
| §2.1 (lines on BigQuery → Looker Studio), §2.3 "Looker dashboards", §3.2 Measurement row "BigQuery + Looker" | "Looker Studio" → **"Data Studio"** (renamed April 2026 per secondary sources; claim 3). |
| §3.2 "Emerging" row: "AI agents completing checkout ③" | Keep ③. Add "ChatGPT: discovery only since 2026-03-24; Google UCP: Canada not confirmed". |
| §3.3 "① Apple Business Connect, including Showcases" | → "① Apple Business (formerly Business Connect); Showcases if available in Canada [[FACT NEEDED]]". Same rename in §3.4 (Siri row) and §7.2 Listings row ("Apple Business interface"). |
| §3.2 "Emerging" row: "Gemini features in Maps answering from reviews and photos ②" | → "**Ask Maps (Gemini) live in Canada in English since ~Aug 2026** (secondary; claim 19); agentic ordering through Maps is US-only". Move it from ② to **①**: nothing to build, but the profile, reviews and photos must be complete from day 1. |
| §3.4 row "Gemini features in Google Maps": "Reviews that name products" | → "Specific reviews in customers' own words (we never prompt for product or staff names: 2026-04-17 policy)". Add "Ask Maps in Canada (EN, ~Aug 2026); whether it reads reviews and photos [verify: self-test 19]". |
| §3.4 row "ChatGPT search": "Bing's index" | → "third-party search providers (unnamed by OpenAI), its own crawler OAI-SearchBot". |
| §3.4 Siri row: "Apple Business Connect, Apple ratings, partners such as Yelp" | → "Apple Business; Apple's own ratings (thumbs, offered in Canada); Yelp and Tripadvisor still shown (secondary, undated); YP/PagesJaunes announced as a supplier (UNVERIFIED)". Action: keep Yelp, Tripadvisor **and PagesJaunes** data exact. Keep "never ask for Yelp reviews". Self-test 18. |
| §4.1, §4.5, §7.1 Consent Mode v2 | → "Consent Mode v2 = 4 signals (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`). Google requires it for **EEA** users (EU User Consent Policy, March 2024 per secondary sources). No Google mandate for Canada was found. We use it because Loi 25 requires opt-in: **basic mode** (tags not loaded before consent, research/07 S7). Advanced mode = counsel decision." |
| §4.6 Andromeda, "shares by DM per view", Trial Reels | Andromeda → "Meta's ad retrieval stage; Meta advises creative diversification (Dec 2025, secondary)". Keep the four distinct concepts (cut shot, behind the scenes, testimonial, price and portions explainer), and drop any similarity threshold. "shares by DM per view (the key signal for reaching non-followers)" → "**sends per reach**: one of the signals Mosseri cites for non-follower reach, with watch time and likes per reach ('the key signal' UNVERIFIED)". Trial Reels → "shown only to non-followers; compare trial vs trial, never against regular Reels". |
| §4.7 TikTok regulatory note | → "Nov 2024: wind-up order for TikTok Technology Canada (Investment Canada Act); the app stayed available. **2026-01-21: Federal Court set the order aside on consent** and sent it back for a new review (secondary). Outcome of that review: UNVERIFIED." Organic TikTok is fine. **TikTok ad spend and the TikTok pixel stay off at launch** (research/07: no ad pixels at launch) and reopen only after self-test 12 + counsel. Keep raw video in our own media library. |
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
| §9 Taxes row | → "TPS: sweet baked goods (cakes, muffins, pastries, tarts, cookies, doughnuts, brownies, sweet croissants) are taxable when sold as single servings in quantities of fewer than six; 6+ and plain bread are zero-rated (a mixed six counts, per CRA rulings: Partly) (ETA Sch. VI III 1(m)). **TVQ: these single servings have been zero-rated since 2026-07-15** (Revenu Québec). Rates: TPS 5 %, TVQ 9.975 % [verify: T-7]. Tax classes are set with the accountant (research/07 §6)." Same wording as research/07's change list; apply it once. |
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

## 4. Search queue (after the completion pass; not searched)

Ordered by plan impact. Combine where shown.

1. ISED / canada.ca statement on the TikTok Technology Canada new review (March 2026 undertakings?) + TikTok Ads Manager availability in Canada (claim 12)
2. OpenAI Help Center "Ads in ChatGPT" + ChatGPT release notes 2026-04-16, primary (claim 13)
3. Google Ads Help "ads in AI Overviews / AI Mode" country and language list, Canada, French (claim 13)
4. alsoasked.com pricing + ahrefs.com/webmaster-tools limits (claim 16), or self-test 16
5. Screaming Frog SEO Spider official licence price, GBP, 2026 (claim 16)
6. Apple newsroom / Apple Business help: Apple Maps rating providers in Canada (Yelp, Tripadvisor, YP) and a 2026 native star rating (claim 18)
7. Google Maps help "Ask Maps": data sources (reviews, photos) and French availability in Canada (claim 19)
8. Meta engineering blog "Andromeda" + Instagram @creators / Mosseri primary on "sends per reach" (claim 15)
9. Google consent mode outside the EEA (Canada) + UK scope (claim 20)
10. Apple Business: Showcases / action links country list (claim 2, still open)
11. platform.openai.com/docs/bots (OAI-SearchBot) + `utm_source=chatgpt.com` (claims 11a, 11b)
12. arxiv.org/abs/2311.09735 abstract wording (claim 14)
13. GBP API prerequisites, limits and v4 food menus, S40–S44 (claim 17)

---

## Completion pass (2026-10-25)

Budget: **12 of 12 WebSearch queries** (US-located summaries). WebFetch and curl blocked. No official page was opened directly. A vendor or Google page counts only where a summary quotes it. Semrush not used.

| # | Before | After | Queries | What it changes in the plans |
|---|---|---|---|---|
| 9 | Contradicted | Contradicted (re-checked) | 1 | Nothing new: watch, don't build |
| 12 | UNVERIFIED | Partly | 1 | No regulatory block in 2026 (order set aside). Organic TikTok OK. Ads and pixel stay off at launch |
| 13 | UNVERIFIED | Partly | 2 | ChatGPT ads in Canada: the prompt panel logs sponsored units. Google AI-answer ads in Canada: still open |
| 15 | UNVERIFIED | Partly | 2 | Tactics stay as tests. The metric is renamed "sends per reach" |
| 16 | UNVERIFIED | Partly | 3 | Week-7 spend still gated on AlsoAsked + AWT (self-test 16) |
| 18 | UNVERIFIED | Partly | 1 | PagesJaunes joins the Apple-feed accuracy checks. Self-test 18 decides |
| 19 | UNVERIFIED | Partly | 1 | Ask Maps moves from ② to ① (profile, reviews and photos complete from day 1) |
| 20 | UNVERIFIED | Partly | 1 | Basic mode, as research/07 S7. The EEA mandate isn't our trigger; Loi 25 is |
| 21 | UNVERIFIED | Partly | 0 (via R06) | Bing ≈ 10 %: Bing Webmaster Tools + Bing Places in week 1 |
| 22 | UNVERIFIED | Partly (GST Confirmed) | 0 (via R07) | Tax engine: QST 0 on sweet single servings from 2026-07-15; the GST rule unchanged |

**Still UNVERIFIED inside Partly rows. Don't quote these as facts:**

- 12: the 2026-03-09 undertakings; TikTok self-serve ads in Canada.
- 13: Google ads in AI Overviews / AI Mode live in Canada; the 53.6 % tracker figure; "60+ countries".
- 15: creative-similarity thresholds; DM shares as "the key" signal; the Aug 2026 Q&A claim.
- 16: AlsoAsked $12; Ahrefs Webmaster Tools free; the Screaming Frog price; currency for every tool.
- 18: the dates behind Yelp-in-Apple-Maps and YP.ca supply; a 2026 native Apple star rating.
- 19: that Ask Maps reads reviews and photos; French in Canada.
- 20: the March 2024 date (secondary), UK scope, any Canadian requirement.
- 22: whether the QST change is permanent; the QST rate; café items (research/07 T-6).

**For the owner (One-Man Empire view):**

1. **ChatGPT shows ads in Canada now** (signed-in Free/Go adults, secondary). Being cited in the answer is still the goal. There's no AI ad spend at launch, and the monthly prompt panel adds a "sponsored competitor" column.
2. **Ask Maps is live in Canada in English.** It needs nothing new from us, only a complete profile, a steady flow of real reviews (asked open-ended, 2026-04-17 policy) and labelled photos.
3. **QST change of 2026-07-15** (via research/07): a single éclair or muffin sold alone now carries GST only (a plain croissant was already zero-rated for both taxes). The ordering engine must date its tax rules, and the accountant signs off.
4. **TikTok** has no 2026 block on record. Organic posting is fine. The ad decision waits (research/07: no ad pixels at launch).
5. **Local Falcon Starter is probably enough.** 1 credit = 1 grid pin (vendor page, via summary):

```js
// lf-budget.js: monthly Local Falcon credits for the geogrid plan (Starter = 7,500 credits, US$24.99/mo, Oct 2026)
export function monthlyCredits({ terms = 10, grid = 7, scansPerMonth = 4.33 } = {}) {
  return Math.ceil(terms * grid * grid * scansPerMonth); // 1 credit per pin per scan
}
// monthlyCredits()            → 2122  (10 terms, 7×7, weekly)  fits Starter
// monthlyCredits({ terms: 30 }) → 6366 (FR+EN+ES × 10 terms)   still fits Starter
```

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

Completion pass (2026-10-25). All seen 2026-10-25 through WebSearch summaries; none opened directly.

- S47 · Federal government agreed to set aside order to wind down TikTok in Canada (BNN Bloomberg, 2026-01-22) — https://www.bnnbloomberg.ca/business/technology/2026/01/22/federal-government-agreed-to-set-aside-order-to-wind-down-tiktok-in-canada/ — seen 2026-10-25
- S48 · More time on the clock for TikTok: Federal Court of Canada sets aside government-ordered shut-down of TikTok's Canadian operations (Cassels) — https://cassels.com/insights/more-time-on-the-clock-for-tiktok-federal-court-of-canada-sets-aside-government-ordered-shut-down-of-tiktoks-canadian-operations/ — seen 2026-10-25
- S49 · Order to wind up TikTok Technology Canada under the Investment Canada Act (Digital Policy Alert, tracker) — https://digitalpolicyalert.org/change/11758-department-for-innovation-science-and-industry-development-order-wind-up-of-tiktok-technology-canada-under-the-canadian-investment-act — seen 2026-10-25
- S50 · TikTok wins breathing space as Canada reconsiders shutdown order (Outlook Business) — https://www.outlookbusiness.com/corporate/tiktok-wins-breathing-space-as-canada-reconsiders-shutdown-order — seen 2026-10-25
- S51 · ChatGPT Ads go live in Canada, Australia, and New Zealand (TechWyse) — https://www.techwyse.com/news/ai-search/chatgpt-ads-canada-australia-new-zealand-openai — seen 2026-10-25
- S52 · OpenAI expands ChatGPT ads to Canada, Australia, and New Zealand after U.S. pilot (Shopifreaks) — https://www.shopifreaks.com/openai-expands-chatgpt-ads-to-canada-australia-and-new-zealand-after-u-s-pilot-tops-100m-in-annualized-revenue/ — seen 2026-10-25
- S53 · ChatGPT Ads in 2026: how OpenAI's sponsored cards work (Abmatic) — https://abmatic.ai/blog/chatgpt-ads-explained-2026 — seen 2026-10-25
- S54 · Does ChatGPT have ads? (AirOps) — https://www.airops.com/blog/does-chatgpt-have-ads — seen 2026-10-25
- S55 · Google Ads come to AI Mode & AI Overviews desktop (Search Engine Roundtable) — https://www.seroundtable.com/google-ai-mode-ai-overviews-desktop-ads-39449.html — seen 2026-10-25
- S56 · Google introduces ads in AI Mode and AI Overviews, Marketing Live 2025 (ICAI) — https://ai.icai.org/articles_details.php?id=242 — seen 2026-10-25
- S57 · Google Marketing Live 2026: everything Canadian marketers need to know (Marketing News Canada) — https://marketingnewscanada.com/news/google-marketing-live-2026-everything-canadian-marketers-need-to-know — seen 2026-10-25
- S58 · Google's latest AI updates: what Canadian marketers and advertisers need to know (Marketing News Canada) — https://marketingnewscanada.com/news/googles-latest-ai-updates-what-canadian-marketers-and-advertisers-need-to-know — seen 2026-10-25
- S59 · Meta Andromeda: what it means for your ad strategy (Jon Loomer) — https://www.jonloomer.com/meta-andromeda/ — seen 2026-10-25
- S60 · Meta Andromeda creative diversification (Jon Loomer) — https://www.jonloomer.com/meta-andromeda-creative-diversification/ — seen 2026-10-25
- S61 · Andromeda (PPC Land) — https://ppc.land/andromeda/ — seen 2026-10-25
- S62 · Meta Andromeda update: the 2026 creative strategy playbook (Segwise) — https://segwise.ai/blog/meta-andromeda-update-creative-strategy-2026 — seen 2026-10-25
- S63 · Instagram Trial Reels (Buffer) — https://buffer.com/resources/instagram-trial-reels/ — seen 2026-10-25
- S64 · How to test Reels with non-followers on Instagram (RouteNote) — https://routenote.com/blog/how-to-test-reels-with-non-followers-on-instagram/ — seen 2026-10-25
- S65 · Share a trial reel to followers (Kontentino Q&A) — https://www.kontentino.com/q-and-a/share-trial-reel-to-followers/ — seen 2026-10-25
- S66 · Instagram algorithm reference (FemFounded) — https://femfounded.org/reference/instagram-algorithm — seen 2026-10-25
- S67 · SerpApi pricing (ScrapeGraphAI) — https://scrapegraphai.com/blog/serpapi-pricing — seen 2026-10-25
- S68 · SerpApi pricing (Proxidize) — https://proxidize.com/blog/serpapi-pricing/ — seen 2026-10-25
- S69 · All SerpApi plans & pricing (CostBench) — https://costbench.com/software/web-scraping/serpapi/ — seen 2026-10-25
- S70 · Local Falcon pricing (Local Falcon, vendor) — https://localfalcon.com/pricing — seen 2026-10-25
- S71 · How much does Local Falcon cost? KB81 (Local Falcon knowledge base, vendor) — https://www.localfalcon.com/knowledge-base/kb81-how-much-does-local-falcon-cost-a-complete-guide-to-local-falcons-pricing — seen 2026-10-25
- S72 · Local Falcon vs Screaming Frog SEO Spider (softwares.com; read the pricing page in Oct 2026) — https://www.softwares.com/compare/local-falcon-vs-screaming-frog — seen 2026-10-25
- S73 · Otterly.AI pricing (Capterra) — https://www.capterra.com/p/10023384/Otterly-AI/pricing/ — seen 2026-10-25
- S74 · Otterly.AI pricing (G2; pricing data updated 2025-08-18) — https://www.g2.com/products/otterlyai/pricing — seen 2026-10-25
- S75 · SEO Spider pricing (Screaming Frog, vendor; no figure in the summary) — https://www.screamingfrog.co.uk/seo-spider/pricing/ — seen 2026-10-25
- S76 · Screaming Frog pricing and plans guide for the UK (Wise; £199 as of May 2025) — https://wise.com/gb/blog/screaming-frog-pricing — seen 2026-10-25
- S77 · Screaming Frog (Vendr) — https://www.vendr.com/marketplace/screaming-frog — seen 2026-10-25
- S78 · Screaming Frog plans (Temperstack) — https://www.temperstack.com/plans/screaming-frog/ — seen 2026-10-25
- S79 · Apple Maps' new rating system now live across Germany (iMore; date not in summary) — https://www.imore.com/apple-maps-new-rating-system-now-live-across-germany — seen 2026-10-25
- S80 · Yelp officially joins Apple Maps (Adweek; date not in summary) — https://www.adweek.com/digital/yelp-officially-joins-apple-maps/ — seen 2026-10-25
- S81 · Apple Maps Business Connect 2026 (lovable.app marketing page; weak, contradicts itself) — https://s10500.lovable.app/insights/apple-maps-business-connect-2026 — seen 2026-10-25
- S82 · MobileSyrup article (title not shown; likely the YP.ca → Apple Maps item, mapping UNVERIFIED) — https://mobilesyrup.com/?p=141325 — seen 2026-10-25
- S83 · Ask Maps: Gemini in Google Maps (MobileSyrup, 2026-08-06) — https://mobilesyrup.com/2026/08/06/ask-maps-gemini-google-maps/ — seen 2026-10-25
- S84 · Google rolls out Gemini-powered Ask Maps to 150 countries including Australia (EFTM, Aug 2026) — https://eftm.com/2026/08/google-rolls-out-gemini-powered-ask-maps-to-150-countries-including-australia-279055/amp — seen 2026-10-25
- S85 · Ask Maps (Aixploria) — https://www.aixploria.com/?p=47953 — seen 2026-10-25
- S86 · Google gets new AI-powered Ask Maps feature (Droid Life, 2026-03-12) — https://www.droid-life.com/2026/03/12/google-gets-new-ai-powered-ask-maps-feature/ — seen 2026-10-25
- S87 · Consent Mode v2: Google shares key details for advertisers (Search Engine Journal) — https://www.searchenginejournal.com/consent-mode-v2-google-shares-shares-key-details-for-advertisers/508623/ — seen 2026-10-25
- S88 · Google Tag Manager Help, answer 14754100 (Google; EEA consent text quoted in the summary; title not shown) — https://support.google.com/tagmanager/answer/14754100 — seen 2026-10-25
- S89 · Google announces Consent Mode v2 (Cookie Information) — https://cookieinformation.com/resources/blog/google-announces-consent-mode-v2 — seen 2026-10-25
- S90 · Google Consent Mode glossary (Piwik PRO) — https://piwik.pro/glossary/google-consent-mode — seen 2026-10-25
- S91 · ChatGPT Instant Checkout 2026: the current answer for ecommerce (eesel) — https://www.eesel.ai/blog/chatgpt-instant-checkout-2026 — seen 2026-10-25
- S92 · ChatGPT checkout for Shopify: no toggle, no 4 % fee (Craftshift, Oct 2026) — https://craftshift.com/chatgpt-checkout-shopify-fees-2026/ — seen 2026-10-25
- S93 · ChatGPT Instant Checkout failure lessons (Stellagent) — https://stellagent.ai/insights/chatgpt-instant-checkout-failure-lessons — seen 2026-10-25
- S94 · OpenAI Instant Checkout and ACP: what Shopify stores need to know (Ringly) — https://www.ringly.io/blog/openai-instant-checkout-agentic-commerce-protocol — seen 2026-10-25
- S95 · Screaming Frog, free service overview (Subger; GBP 209/yr "2026 anchor") — https://subger.com/en/service/screaming-frog — seen 2026-10-25

Local files (cross-checks, not web sources):

- R03 · research/03-competitors.md (Yelp → Apple Maps flagged as a hypothesis) — /home/user/coco-vanille-granby/research/03-competitors.md — seen 2026-10-25
- R06 · research/06-seo-aeo-geo-2026-verified.md §(b) StatCounter Canada (W7–W10), §(d) GBP Q&A → Ask Maps (W22–W25) — /home/user/coco-vanille-granby/research/06-seo-aeo-geo-2026-verified.md — seen 2026-10-25
- R07 · research/07-legal-quebec-compliance.md §1G T-1–T-7 (T1 CRA Memo 4.3, T3/T4 Revenu Québec sweetened baked goods, T5 Fournitures détaxées, T10 CRA rulings), S7 and L13–L15 (Google consent mode) — /home/user/coco-vanille-granby/research/07-legal-quebec-compliance.md — seen 2026-10-25
- R16b · research/16b-admin-tech-subdomain.md (GBP API facts and fact-check log) — /home/user/coco-vanille-granby/research/16b-admin-tech-subdomain.md — seen 2026-10-25
- RS-README · Ranking Stack README ("re-verify every number before quoting it"; local skill file) — /root/.claude/skills/synced/abe680b4-d166-4e58-98e8-5d7821c874f1_fbcc75d7-6de4-4a79-8a0f-7403dd050d4f/rank-first/README.md — seen 2026-10-25
