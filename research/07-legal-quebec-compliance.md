# 07 · Québec / Canada compliance: public site, Coco Studio and online ordering (2026-10-25)

> **Not legal or tax advice.** This is a design brief for a lawyer and an accountant to confirm. Every row says who must sign it off.
> Inputs: requirements-2026-10-25, plan-v1 §10–§17, plan-v0c §6 and §9, research/01, /16b, /17 (§7 Loi 25 inventory), /18 (claim 7 tips, claim 20 Consent Mode, claim 22 taxes).
> Method: **22 WebSearch queries** (cap 22). WebFetch is blocked, so primary pages (Légis Québec, OPC, CRA, Revenu Québec, CFIA, OQLF) were read **only through search summaries**. Exact article wording was rarely visible: when a summary named a rule but not its text, the row says so.
> Labels: **Confirmed** = an official page (government, regulator, statute) in the summaries · **Partly** = law-firm or other secondary source only, or official but incomplete · **UNVERIFIED** = no source this session (my prior knowledge at most; never treat as true) · **[[FACT NEEDED: …]]** = owner or professional must supply it.
> **Adversarial check 2026-10-25:** 8 more WebSearch queries tried to refute the riskiest rows. Two rows were wrong and are fixed (contests X-3, Bill C-59 K-2). See "Verification log" at the end.
> Legal refs: article numbers come from a source in the Src column unless marked **†** (= from prior knowledge, UNVERIFIED this session; confirm on Légis Québec / Justice Laws).
> Levels: **MUST** = a legal obligation (as far as the sources show) · **SHOULD** = conservative design choice that lowers legal risk or that a professional is likely to require.

---

## 0. Bottom line (read this first)

1. **Taxes changed on 2026-07-15.** Revenu Québec now zero-rates the **QST** on single-serving sweet baked goods (doughnuts, cookies, cakes, muffins, pastries, tarts; < 230 g, or packs of fewer than six). **GST still applies** to them under the federal "fewer than six single servings" rule (ETA Sch. VI, Part III, s. 1(m)). The plans' tax row (v0c §9) is out of date. The checkout needs **effective-dated tax classes** (§6). Revenu Québec's 2026-08-07 « Précisions » notice is not read yet: read it first. (T3, T5, T7–T9, T14, T15)
2. **French first, at least as good.** The site, social posts and GBP posts are "commercial publications" (Charter s. 52). EN/ES versions are allowed only if the French one is at least as accessible and as good. The OQLF has fined businesses whose French site was less accessible (F1–F4). → French at `/`, **no automatic redirect** away from French, FR content ≥ EN/ES content.
3. **Online T&Cs = contract of adhesion → French first** (Charter s. 55, in force 2023-06-01). Someone can be bound by an English version only after receiving the French one and expressly asking for English (F6, F8). The EN/ES checkout needs an explicit choice (§4).
4. **Tracking off by default** (Loi 25 s. 8.1, secondary sources): no GA4, Clarity or Meta pixel before opt-in. Google's **basic** Consent Mode (tags blocked until consent) is the conservative fit. **Advanced** mode sends cookieless pings while consent is denied, and needs a counsel decision (L1–L3, L13).
5. **Data leaving Québec needs a PIA (ÉFVP) + written agreement** (s. 17). Other provinces count (L5, L6). VPS + backups in Québec remove the biggest store from that work. Stripe/Square, Twilio, GA4, Clarity, Claude API, Sentry and the mailbox do not (§2).
6. **All-in price** (LPC s. 224 + Competition Act drip pricing): the advertised price includes every mandatory fee. Only GST/QST may be added (C7, C11, K1). → No "frais de service", no box/packaging fee lines, no card surcharge (C13).
7. **Gift cards: no expiry and no usage fees** (OPC, C15–C17). Selling one is not a GST supply; tax applies at redemption (CRA P-202, secondary; T11).
8. **Distance contract (LPC 54.1+).** Confirmed by the OPC: no general cooling-off right; a refund is due **within 15 days** of a valid cancellation; chargeback route if the merchant doesn't refund (C5, C6). Exact disclosure list, "express acceptance" and "copy within 15 days" wording: **UNVERIFIED this session** → design to the strictest reading (§4).
9. **CASL.** The pickup SMS « C'est prêt ! » is transactional (s. 6(6), exempt from consent). Vendor guides say it still needs identification and an unsubscribe (E2, E3). Treat **review requests as commercial messages** (UNVERIFIED either way). Safest review channel: **QR code on the box**, which is not an electronic message.
10. **Allergens.** The 11 priority allergen groups + gluten sources (CFIA, A1–A3). "May contain" is voluntary and must not replace prevention (A4). **"Sans gluten" in advertising, which includes the website, is a regulated claim**: no gluten protein, ≤ 20 ppm from cross-contact (A6, A7). → No free-from claims at launch.
11. **No tip prompt in the online checkout** (research/18 claim 7: pre-tax rule confirmed for terminals; online scope unknown).
12. **Contests (corrected 2026-10-25):** Québec's RACJ publicity-contest regime (the duties of up to 10 % of prize value above $100, and the Rules) was **repealed on 2023-10-27** by Bill 17 (R5, R6). No RACJ filing or duties now. Still to check: the Criminal Code skill-testing question, Competition Act contest disclosure (s. 74.06 †) and Meta's rules (UNVERIFIED). Keep giveaways small and have a lawyer review the rules template once.

---

## 1. Compliance checklist (MUST / SHOULD)

Each row has a Status and Src. Sources are listed at the end; "via 1X" = an existing research file.

### 1A. Privacy: Loi 25 (Act respecting the protection of personal information in the private sector, CQLR c. P-39.1)

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| P1 | MUST | Name a **person in charge of PI protection** (by default the person with the highest authority, who can delegate in writing). Publish their **title and contact details on the website** | s. 3.1 | Partly. Website publication of title + contact details (or another suitable means if there's no site) is in the s. 3.1 text reproduced by Gowling's annotated guide (L16). Default holder + written delegation per OTPQ guide (L17). Légis Québec itself not seen | L12, L16, L17 |
| P2 | MUST | **Tracking technology** (identify, locate, profile): inform the person beforehand, explain how to turn the functions on, and keep them **off by default**. Only strictly necessary cookies may be on by default | s. 8.1 | Partly (law-firm, industry and consumer sources agree; CAI's own guidance not seen) | L1, L2, L3, L4 |
| P3 | MUST | **Privacy policy** in clear terms, published on the site (needed when PI is collected by technological means). It covers purposes, means, rights, third parties and possible communication outside Québec | ss. 8, 8.2 † | **UNVERIFIED this session** (plan v0c §9 assumes it; wording not seen) | via v0c |
| P4 | MUST | **Before communicating PI outside Québec** (other provinces included, and providers who hold PI for us): a privacy impact assessment (ÉFVP) that weighs the destination's legal regime and finds adequate protection, then a **written agreement** that reflects it | s. 17 | Partly (law firms, IAB Canada; consistent with research/17 §7) | L5, L6, L8, via 17 |
| P5 | MUST | **Confidentiality incidents:** if there's a risk of serious injury, report to the CAI and to the people affected. Keep a **register of every incident** | s. 3.5; ss. 3.6–3.8 † | Partly. s. 3.5 (report to CAI) is named in L12. Register: **UNVERIFIED this session** | L12 |
| P6 | MUST | Rights: access, rectification and **portability** (PI provided by the person, in a structured, commonly used technological format) | s. 27 † | **UNVERIFIED this session.** The reform phased in over 3 years from 2021-09-22 (L7); an OPIQ guide says provisions phase in until September 2024 (L18). Portability's exact date (reported 2024-09-22) was **not confirmed** by the verification search | L7, L18 |
| P7 | SHOULD | Allergy notes are probably **sensitive (health) information**: optional field, purpose stated, kept as short as possible, never sent to email/SMS/AI vendors | s. 12 † (sensitive PI) | **UNVERIFIED** (counsel) | — |
| P8 | SHOULD | Treat IP addresses in nginx logs as PI: keep raw logs **90 days** (est., research/17), then keep aggregates only | — | **UNVERIFIED** whether an IP is PI under P-39.1 (counsel) | via 17 |
| P9 | INFO | **Penalties.** Administrative monetary penalties up to **$10M or 2 % of worldwide turnover of the previous fiscal year**, whichever is higher (enterprise); **$50,000 for an individual is UNVERIFIED** (not found in two searches). Penal fines up to **$25M or 4 %**, whichever is higher; **minimum $15,000** for an enterprise; doubled for a repeat offence; the CAI can prosecute within 5 years (since 2023-09-22). The CAI weighs gravity, duration, repetition, benefit gained and ability to pay | ss. 90.1+, 91 † | Partly (law firms McCarthy, Osler; third-party guide) | L10, L11, L12, L19, L20 |

### 1B. French language: Charter of the French language (CQLR c. C-11, as amended by Bill 96)

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| F-1 | MUST | **Commercial publications in French**, including **websites and social media**. Recent fines and orders target business websites | s. 52 | Confirmed (Québec.ca enforcement notices, 2022–2026) | F1, F2, F3, F4 |
| F-2 | MUST | Another language may sit in a **separate version** only if the French version is available with **accessibility and quality at least equal**. A 2022 fine hit a company whose French site was less accessible | Reg. on the language of commerce and business, s. 10 (as cited) | Confirmed (Québec.ca notice; Éducaloi) | F1, F4 |
| F-3 | MUST | **Contracts of adhesion** (online conditions of sale) and **related documents** (order confirmations, receipts) in French. A customer can be bound by another language only **after the French version is given** and they **expressly** ask for it. No charge for the French version | s. 55 (French-first since 2023-06-01) | Confirmed (OQLF Charter text, June 2025; Gowling) | F6, F8 |
| F-4 | SHOULD | OQLF internal note: on a website or app, the **navigation language** the adherent chose sets the contract language by default. Counsel must say whether that alone satisfies s. 55 on /en/ and /es/ | s. 55 | Partly (OQLF document released under access to information; not a public guide) | F7 |
| F-5 | MUST | **Invoices, receipts** and similar documents in French | s. 57 † | **UNVERIFIED this session** (the summary did not show s. 57) | — |
| F-6 | MUST | **Work tools in French**: software staff use (Coco Studio, POS, kitchen tablet) is available in French. Businesses under **25 employees** don't register with the OQLF (threshold lowered from 50 to 25 on 2025-06-01, measured as a 6-month average) but still follow the work-language rules | ss. 41+ † (work) | Partly (law-firm and legal-info summaries, re-confirmed 2026-10-25 by Lavery, Gowling, DLA Piper; statute not seen) | F11, F12, F13, F14, F15, F17 |
| F-7 | INFO | **Signage and trademarks.** A 2024 regulation treats a **pending** trademark application as registered for Charter purposes, and sets when signage is French-only or bilingual. In force **2025-06-01** (law firms; OQLF text not seen). Non-French marks without a French version filed or registered are the only trademark exception; products made before that date may be sold until **2027-06-01**. Low impact: "Coco Vanille" is French | Reg. amending the language-of-commerce reg. (2024) | Partly (Gazette texts + 2025 law-firm notes; date now supported) | F9, F10, F14, F15, F16 |
| F-8 | INFO | Enforcement: the OQLF issues an order. Ignoring it leads to penal proceedings under **s. 205** (2026 case: a rafting company's website) | s. 205 | Confirmed (Québec.ca, 2026) | F2 |

### 1C. Consumer protection: LPC (Consumer Protection Act, CQLR c. P-40.1) and its regulation (r. 3)

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| C-1 | MUST | An online order is a **distance contract** (concluded without the parties in each other's presence, after the merchant's offer) | s. 54.1 | Confirmed (Gazette officielle 2007, text of the amending act) | C1 |
| C-2 | MUST | **Pre-contract disclosures**, at least: total of all sums payable, currency, delivery (here: **pickup**) timing, and cancellation/return/refund conditions. The full s. 54.4 list (merchant identity and contact details, itemized price, delivery terms, other restrictions…) must be checked | s. 54.4 | Partly (2006 law-firm commentary lists these items; full current list **UNVERIFIED**) | C4, C7 |
| C-3 | MUST | Give the consumer a chance to **expressly accept or decline** and to **correct errors** before the contract is concluded | s. 54.5 † | **UNVERIFIED this session** | — |
| C-4 | MUST | Send the **contract (copy) after conclusion**. Reported deadline: 15 days | s. 54.7 | Partly (54.7 named in reg. r. 3; the deadline was not seen) | C2 |
| C-5 | MUST | Consumer cancellation cases. Confirmed: if the delivery date in the contract differs from the one announced before purchase, **7 days after receiving the contract**. Other cases (missing disclosures, non-delivery) **UNVERIFIED** | ss. 54.8–54.9 | Partly (OPC) | C5, C6, C8 |
| C-6 | MUST | After a valid cancellation, **refund everything within 15 days**. Reasonable return costs fall on the merchant | s. 54.13 † | Confirmed (OPC) | C5, C6 |
| C-7 | INFO | **Chargeback.** If the merchant doesn't refund, the consumer asks the card issuer within **60 days**. The issuer acknowledges within **30 days** and credits within 90 days or two statement periods, whichever is shorter | s. 54.14; ss. 54.15–54.16 † | Confirmed (OPC) | C5, C3 |
| C-8 | INFO | **No general right to cancel an online purchase** in Québec. Cancellation depends on the merchant breaking an obligation | — | Confirmed (OPC) | C5 |
| C-9 | MUST | **All-in advertised price**: it includes every sum the consumer must pay (mandatory delivery and other fees). Only GST/QST may be left out. The total must stand out more than its parts. Never charge more than the advertised price (224 c) | s. 224 c) and its 2nd paragraph (all-in price); r. 3 exemptions (cash rounding to 5 ¢) | Confirmed (Légis Québec version history; OPC online-commerce page) | C7, C10, C11, C12, C14 |
| C-10 | MUST | **No payment-method surcharge**, and a warning doesn't fix it (OPC page on debit cards). Credit cards: **UNVERIFIED this session**; don't surcharge either | LPC (OPC guidance) | Confirmed (debit) | C13 |
| C-11 | MUST | **Gift cards** usable like money: **no expiry date**, no making the card unusable after a period, **no usage fees**; replacement fees restricted. Exceptions exist: Éducaloi cites an activation fee ≤ $3.50 and an inactivity fee ≤ $2.50/month after 15 months "under certain conditions"; the OPC allows usage fees for cards usable at several independent merchants or issued by a financial institution. Whether any exception fits a single-bakery card: UNVERIFIED → **charge no fees at all** | LPC ss. 187.1+ † and r. 3 (prepaid cards) | Confirmed (OPC); fee exceptions per Éducaloi | C15, C16, C17, C18 |
| C-12 | MUST if tips are suggested | **Tips** calculated on the **pre-tax** amount, options shown neutrally, any amount allowed. Since **2025-05-07**, written for payment terminals. Online scope unknown → **no online tip prompt** | LPC (Bill 72) | Confirmed for terminals, via research/18 claim 7 | via 18 (S24, S25) |
| C-13 | SHOULD | **Deposits (acomptes)** for custom cakes: write the amount, what it covers, and the refund rule on cancellation in the conditions of sale *before* payment | LPC / Civil Code | **UNVERIFIED** (no source found; counsel) | — |
| C-14 | SHOULD | **Perishables**: a "no returns on perishables" policy fits C-8. Quality and legal-warranty duties still apply (a spoiled or wrong cake → remedy) | LPC legal warranty (ss. 37–38 †) | **UNVERIFIED this session** | — |

### 1D. Competition Act, Ad Standards, reviews

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| K-1 | MUST | **Drip pricing**: a price that can't be reached because of extra mandatory fees is deemed misleading (since **2022-06-23**). Exception: only charges imposed by an Act of Parliament or a provincial legislature (taxes); since C-59, only those **payable by the purchaser** | Competition Act ss. 52(1.3), 74.01(1.1) | Confirmed (Competition Bureau brief to FINA; date per Fasken 2024-07) | K1, K6 |
| K-2 | MUST | **Bill C-59 (enacted 2024)** (corrected 2026-10-25: not "a bill in progress"). It narrows the drip-pricing tax exception (K-1). The supplier must prove the "**ordinary selling price**" behind any "was / now" discount claim (described as **in force** by Fasken, 2024-07) → keep price records. Private right of action reported in force **2025-06-20**. AMP ceiling: greater of $10M, 3× the benefit, or 3 % of global revenue. Royal Assent date (2024-06-20 by prior knowledge) **UNVERIFIED**; whether the Senate amendments were adopted is **UNVERIFIED** | Competition Act as amended by C-59 | Partly (law firms; enacted text not seen) | K1, K2, K3, K6 |
| K-3 | MUST | **Influencers and partners**: disclose any material connection (payment, free product, discount, family or staff tie). A discount code or link alone may not be enough. Ad Standards guidelines **2025-10-08** + Canadian Code clause 1 + Bureau guidance "Influencer marketing and the Competition Act" | Code cl. 1; Competition Act | Confirmed (Ad Standards PDF); "codes/links not enough" is secondary | K4, K5 |
| K-4 | MUST | **Reviews and testimonials**: real customers only, no staff or family posing as customers, no incentives, no gating, no staff quotas or staff-name requests (Google policy, 2026-04-17) | Competition Act (misleading representations); Google policy | Google parts Confirmed via research/18 (S11). Bureau fake-review guidance **not found** this session | via 18 |
| K-5 | SHOULD | **Comparative or superlative claims** (« la meilleure pâtisserie de Granby », « le meilleur croissant ») only with dated proof or attribution to a named third party | Competition Act (adequate test for performance claims) | **UNVERIFIED this session** | — |

### 1E. Anti-spam: CASL (S.C. 2010, c. 23) and CRTC rules

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| E-1 | MUST | Messages that **facilitate or confirm an agreed transaction** (order confirmation, « C'est prêt ! », a quote the person asked for) are **exempt from consent** | s. 6(6) | Partly (law-firm 2016 + vendor guides) | E1, E2, E3 |
| E-2 | SHOULD (likely MUST) | Those messages still carry **sender identification + an unsubscribe**. Reported as the CRTC's view; industry has contested it | s. 6(2)–(3) † | Partly (vendor guides; 2017 coalition brief) | E2, E3, E4 |
| E-3 | MUST | **Commercial electronic messages** (newsletter, promos, birthday reminder, seasonal pre-order alerts) need **consent** + ID + a working unsubscribe | s. 6(1) † | Partly (vendor guides) | E2, E3 |
| E-4 | SHOULD | **Review-request email/SMS 24 h after pickup** → treat as a commercial message. Implied consent from a purchase lasts **2 years** from the purchase (6 months for an inquiry), and the sender must track each expiry. Whether a review request is a CEM is still **UNVERIFIED**. Conservative path: the QR code on the box + a link on the paper receipt (not electronic messages), and an email only to customers who ticked a box | s. 10(9)–(10) † (implied consent) | Partly (2-year rule: university CASL guides + BLG; CEM status UNVERIFIED) | E6, E7, E8 |
| E-5 | SHOULD | Keep **proof of consent** (text shown, timestamp, source, IP/order ID). Legal deadline: unsubscribe requests honoured **within 10 business days**, at no cost. Design target: handle « STOP » in under a day | — | Partly (10 business days per secondary guides) | E6, E7 |

### 1F. Food: MAPAQ, Health Canada, CFIA

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| A-1 | MUST | **MAPAQ food permit.** Retail permit: "préparation générale" (**$367**) or "maintenir chaud ou froid" (**$283**). Restaurant permit includes a "préparation générale avec buffet" option (**$566**). Since **2025-07-08**, applicants and holders no longer pay extra fees for hot/cold holding units (UMCF) (re-seen 2026-10-25). The same date was linked in the first pass to "no hygiene-manager number for new applicants, but hygiene control entrusted to a certificate holder": that part was **not re-seen** in verification. A $144 file-opening fee appears only on a franchise blog: UNVERIFIED | Food Products Act + reg. † | Confirmed (Québec.ca; prices re-seen 2026-10-25, page undated, date-sensitive) | M1, M2, M3, M4 |
| A-2 | MUST | [[FACT NEEDED: current MAPAQ permit number(s) and category]]. With ~10 café seats (research/01), the shop may hold a retail permit, a restaurant permit or both. Check that the permit covers **online orders picked up** and, later, **delivery** | — | **UNVERIFIED** | via 01 |
| A-3 | MUST (prepackaged) | Priority allergens: **eggs, milk, mustard, peanuts, crustaceans and molluscs, fish, sesame, soy, sulphites, tree nuts, wheat and triticale**, plus **gluten sources** (barley, oats, rye). Declared in the ingredient list or a "Contains" statement on prepackaged food | Food and Drug Regs (FDR) B.01.010.1+ † | Confirmed (CFIA) | A1, A2, A3 |
| A-4 | INFO | **Retail-made / retail-packaged exemptions** from full labelling: **not confirmed this session**. Whether in-store boxed items need a full label is a CFIA / counsel question | FDR B.01.003 † | **UNVERIFIED** | — |
| A-5 | SHOULD | **Precautionary statements** (« Peut contenir… ») are voluntary, with CFIA-recommended wording. Use one only when a real, unavoidable risk remains, never as a blanket line in place of prevention | CFIA guidance | Confirmed (voluntary); "not generic" is industry commentary | A1, A4, A5 |
| A-6 | MUST if used | **"Sans gluten" / gluten-free** covers any labelling **or advertising** (website, Instagram, names, images) that states or implies it. The food must contain no gluten protein, and gluten from cross-contact must stay ≤ **20 ppm** under good practices | FDR B.24.018; F&DA s. 5(1) | Confirmed (CFIA, Justice Laws, Health Canada) | A6, A7, A8, A9 |
| A-7 | SHOULD | **Vegan, nut-free, peanut-free** claims: rules not checked this session. **Don't make them** until counsel/CFIA guidance is read and the kitchen can support them | F&DA s. 5(1) | **UNVERIFIED** | — |
| A-8 | SHOULD | **Allergen text is human-verified** before publishing, never AI-written (plan v1 publish guard; 16b) | — | Design | via v1, 16b |

### 1G. Sales taxes (GST / QST): details and the decision table in §6

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| T-1 | MUST | **GST:** cakes, muffins, pies, pastries, tarts, cookies, doughnuts, brownies, croissants **with sweetened filling or coating**, or similar → **taxable** when prepackaged in quantities of **fewer than six single servings**, or sold unpackaged as single servings in quantities of fewer than six. Otherwise zero-rated. **Bread products** (bagels, English muffins, croissants and rolls without sweet filling/coating) stay zero-rated | Excise Tax Act Sch. VI, Part III, s. 1(m) | Confirmed (Revenu Québec page quoting the rule; CRA Memo 4.3 is the CRA reference) | T1, T3, T4 |
| T-2 | INFO | Rulings: a **mixed** six single servings (e.g., 2 bagels + 2 muffins + 2 doughnuts, unpackaged) is zero-rated. One ruling drew the single-serving line at **< 230 g** | CRA rulings | Partly (rulings via a third-party database) | T10 |
| T-3 | MUST | **QST since 2026-07-15**: doughnuts, cookies, cakes, muffins, pastries, tartlets and tarts sold as a single serving (< 230 g) or in packs of fewer than six → **zero-rated** for QST. **GST continues** (RQ heading: « détaxés dans le régime de la TVQ seulement »). Announced by Québec on **2026-05-25** (RQ tax news 2026-05-27). RQ published **« Précisions »** on **2026-08-07**: content not read → must be read before tax classes go live. Whether "< 230 g" and "fewer than six" are alternative tests is loosely worded → accountant. Beverages are excluded; coffee and tea stay QST-taxable. Whether it's permanent: UNVERIFIED | QST Act (zero-rated supplies) | Confirmed (Revenu Québec "Fournitures détaxées" + RQ news 2026-05-27, re-seen 2026-10-25) + Crowe, BDO, Protégez-vous | T5, T6, T7, T8, T9, T14, T15 |
| T-4 | MUST | **Gift cards**: the sale is deemed not a supply, so **no GST at sale**; tax applies at redemption by the status of what is bought | CRA policy P-202 | Partly (secondary summaries of P-202). QST equivalent **UNVERIFIED** | T11, T12 |
| T-5 | ASK | **Delivery fee**: likely follows the tax status of the food delivered (an inference from a 2024 CRA holiday measure) → accountant | ETA | **UNVERIFIED** | T13 |
| T-6 | ASK | Café items: **heated food, food for consumption on premises, prepared beverages, confectionery** | ETA Sch. VI Part III s. 1 (other paragraphs) † | **UNVERIFIED** (only "candies and confectionery are taxable" surfaced: T1, T2) | T1, T2 |
| T-7 | ASK | Rates: GST **5 %** (as cited in CRA material); QST **9.975 %** not confirmed this session; registration numbers on receipts | — | Partly / **UNVERIFIED** | T1 |

### 1H. Accessibility, trademarks, contests

| # | Level | Requirement | Legal ref | Status | Src |
|---|---|---|---|---|---|
| X-1 | SHOULD | **WCAG 2.2 AA** as a target and gate (plan v0c §9). I found no source this session on any **legal** web-accessibility duty for a small private Québec business (likely none; federal law reaches federally regulated sectors) | — | **UNVERIFIED** (not searched: budget) | — |
| X-2 | SHOULD | **Trademark**: before printing boxes or signage, search CIPO's Canadian Trademarks Database for "COCO VANILLE", "COCOVANILLE", "COCO & VANILLE". No search was possible this session. Under the Charter, a *pending* application already counts as registered (F-7) | Trademarks Act | **UNVERIFIED** [[FACT NEEDED: CIPO search result]] | F9 |
| X-3 | INFO | **Publicity contests (corrected 2026-10-25).** The former regime (duties to the RACJ of up to **10 %** of prize value when total prizes exceeded **$100**, plus the Rules on publicity contests) was **repealed on 2023-10-27** by Bill 17, with immediate effect; formalities filed before that date stayed under the old rules. International contests had already been excluded since **2021-06-02**. → **No RACJ filing or duties** for a Coco Vanille giveaway. The old 3 % / 0.5 % tiers were never confirmed and are moot | Act respecting lotteries, publicity contests and amusement machines (contest provisions repealed) | Corrected (law firms Blakes, Cassels; Mondaq) | R2, R5, R6, R7 |
| X-4 | INFO | RACJ registration of contests **no longer required**: consistent with the 2023-10-27 repeal (X-3). A 1998 Gazette **draft** proposed a $2,000 threshold: it is not law | — | Partly (consistent with R5, R6) | R3, R4, R5, R6 |
| X-5 | SHOULD | Contest rules in French; no purchase required; a skill-testing question for prizes; respect Meta's promotion rules | Criminal Code †; Meta terms | **UNVERIFIED** (not searched) | — |

---

## 2. Personal-information flows and s. 17 (who needs a PIA)

Builds on research/17 §7.2. "s. 17?" = an ÉFVP + written agreement is needed if the data leaves Québec (P4). Other provinces count (L5).

| Component | PI involved | Location | s. 17? | Loi 25 s. 8.1? | Design decision |
|---|---|---|---|---|---|
| VPS (Postgres, uploads, nginx logs) | Orders, names, phones, emails, allergy notes, staff accounts, IPs | [[FACT NEEDED: provider + city]]. Target: Québec (OVH Beauharnois / AWS ca-central-1) per research/17 | No, if in Québec. **Yes** if Toronto or abroad | — | Pick a Québec data centre before launch |
| Off-site backups | Same, encrypted | Québec bucket, another provider (17) | No, if in Québec | — | `age` encryption, private key offline |
| Transactional email (SES ca-central-1) | Name, email, order summary | Montréal per plan v0a [[VERIFY]] | Likely no | — | No allergy details in emails |
| Mailbox (M365 / Workspace) | Customer emails | [[UNVERIFIED tenant region]] | Probably | — | Check the data-residency setting |
| SMS (Twilio) | Phone, message text | US [[UNVERIFIED]] | **Yes** | — | Text = first name + order no. + "prête"; no order contents |
| Payments (Stripe / Square) | Card data, name, email | Processor's [[UNVERIFIED]] | **Yes** | — | Hosted fields / hosted page (card data never on the VPS) |
| GA4 (Google) | Cookie IDs, IP, behaviour | US [[UNVERIFIED]] | **Yes** | **Yes** | Off until opt-in; Consent Mode **basic** (§3) |
| Microsoft Clarity | Session replays, clicks, IP | US [[UNVERIFIED]] | **Yes** | **Yes** | Off until opt-in; mask all form fields; never on checkout and account pages |
| Meta pixel / TikTok pixel | Cross-site IDs | US | **Yes** | **Yes** (profiling) | **Not at launch.** Revisit with counsel if ads start |
| Claude API (Anthropic) | Review texts, reviewer names, staff names | US (16b) | **Yes** | — | Strip names/phones before sending; human approves every draft (16b) |
| Sentry SaaS | Form values, IPs (if not scrubbed) | [[UNVERIFIED]] | Yes, unless scrubbed or self-hosted | — | `sendDefaultPii: false`; scrub order fields |
| GitHub / CI | None if no dumps or `.env` committed | US | No | — | Secret scanning |

Penalty scale (P9) makes "do the ÉFVP once, file it in Studio" cheap insurance. The CAI published a PIA guide and template on 2023-09-22 (via research/17, McCarthy) [[FACT NEEDED: download the CAI template]].

---

## 3. Design requirements: public site (cocovanillegranby.com)

| # | Requirement | Why (row) |
|---|---|---|
| S1 | **French at `/`**; EN at `/en/`, ES at `/es/`. **No automatic redirect** by browser language or IP; suggest a language with a dismissible banner only | F-1, F-2 |
| S2 | **Parity gate**: an EN/ES page can't be published unless its FR page exists and is at least as complete (same sections, prices, allergens, FAQ). Studio blocks it (plan v1 publish guard) | F-2 |
| S3 | Language switcher on every page, links to the equivalent page (not the home page); `hreflang` FR/EN/ES + `x-default` → FR | F-2 |
| S4 | Product names: French first. A loan term (*smash cake*, *brownie*) appears next to a French label: « gâteau à écraser (smash cake) » | F-1 (best practice) |
| S5 | **Footer**: Pâtisserie Coco Vanille inc. · 3, rue Court, Granby (Québec) J2G 4Y6 · 450-372-7177 · email · links to Politique de confidentialité, Conditions de vente, Gestion des témoins, Accessibilité · **person in charge of PI** (title + email) | P1, P3, C-2 |
| S6 | **Consent banner**: no non-essential script runs before a choice. « Tout refuser » and « Tout accepter » are **the same size and style**, plus « Choisir ». A footer link reopens it. Space is reserved so it doesn't shift the layout (plan v1). It's wrapped in `data-nosnippet` | P2 |
| S7 | Google tags: **Consent Mode basic**: the gtag/GTM container is **not loaded** until analytics consent. Advanced mode (cookieless pings while denied) only after a counsel sign-off | P2, L13–L15 |
| S8 | Baseline measurement that needs no consent: first-party server counts from nginx logs (no cookies, IP truncated/aggregated after 90 days) | P2, P8 |
| S9 | **Product page block**: price (all-in, before taxes), portions, **weight per unit** (needed for the 230 g tax line), lead time, « Contient : … » allergens, a cross-contact statement only if real, storage advice, « Question d'allergie ? Appelez-nous avant de commander » | C-9, A-3, A-5, T-2 |
| S10 | **No free-from claims** (« sans gluten », « végane », « sans noix ») and no implying images or names until A-6 / A-7 are cleared | A-6, A-7 |
| S11 | Prices: shown as « 48,00 $ » with « taxes en sus, s'il y a lieu » (T-1/T-3 make taxes vary by quantity). Never a "from" price that no one can actually buy | C-9, K-1 |
| S12 | No superlatives as facts. AEO pages say « Comment choisir une pâtisserie à Granby », not « la meilleure pâtisserie de Granby », unless a dated third-party award is cited | K-5 |
| S13 | Testimonials: real, dated, first name + initial, with permission; never edited to change meaning; partners and influencers labelled | K-3, K-4 |
| S14 | Accessibility: WCAG 2.2 AA gate (contrast, focus, 24 px targets, labels, errors announced); an Accessibility page with a contact | X-1 |
| S15 | Legal pages (privacy, conditions of sale, cookies, contest rules) in FR, then EN/ES translations marked « Traduction : en cas de divergence, la version française prévaut » [counsel to confirm the clause] | F-3 |

## 4. Design requirements: checkout and ordering

| # | Requirement | Why |
|---|---|---|
| O1 | **Review step before payment** shows: items, unit prices, quantities, options (message, decoration), **pickup date and window**, pickup address, total before tax, GST and QST lines, **grand total**, currency (CAD), deposit vs balance, cancellation/refund policy summary, and links to the full conditions of sale. Every line can be edited from this step | C-2, C-3, C-9 |
| O2 | One **unticked** checkbox « J'ai lu et j'accepte les Conditions de vente » + button « Confirmer et payer 48,00 $ » (the amount on the button). No pre-ticked boxes anywhere | C-3, F-3 |
| O3 | **/en/ and /es/ checkout**: show a link to the French conditions first, then an unticked box « I have received the French version and I expressly wish to be bound by the English version ». Counsel decides whether the navigation-language reading (F-4) makes this box unnecessary | F-3, F-4 |
| O4 | **No fee lines** (service, platform, box, card fees). Packaging is in the product price. Delivery (if ever offered) is an optional line priced before the review step | C-9, C-10, K-1 |
| O5 | **No tip prompt online** | C-12 |
| O6 | **Confirmation email = the contract copy**, sent immediately: everything in O1 + merchant identity + full conditions as a link and a PDF. **French first**; for EN/ES customers, French block then their language | C-4, F-3 |
| O7 | Pickup changes: the bakery **never moves** a confirmed date or window alone. If it can't fulfil the order, the customer chooses a new slot or gets a **full refund**, tracked with a 15-day deadline in Studio | C-5, C-6 |
| O8 | **Deposit for custom cakes**: « Acompte : 40,00 $ aujourd'hui · Solde : 85,00 $ au ramassage ». Its refund rule is stated next to the button (counsel to write it) | C-13 |
| O9 | **Allergy note**: optional; helper text « Utilisée seulement pour préparer votre commande; effacée 30 jours après le ramassage » (est. retention, counsel). Not copied into emails, SMS or AI prompts | P7 |
| O10 | **Marketing consent**: separate unticked boxes: « M'écrire au sujet des précommandes saisonnières », « M'envoyer un rappel pour l'anniversaire l'an prochain », « M'écrire après ma commande pour me demander mon avis ». Each one is stored with its text version and time | E-3, E-4, E-5 |
| O11 | **Payment**: hosted payment fields (Stripe/Square), Apple Pay / Google Pay; the card number never reaches the VPS. Same price whatever the payment method | C-10, §2 |
| O12 | **Gift cards**: sold without GST/QST; the card and every page say « Sans date d'expiration · Sans frais »; partial use keeps the balance; balance check page | C-11, T-4 |
| O13 | **Taxes** come from the effective-dated engine (§6). A product with no confirmed tax class **cannot be sold online** | T-1–T-7 |
| O14 | **Pre-orders** (Noël, Pâques): the conditions state when payment is taken and what happens if the bakery cancels (full refund within 15 days) | C-6 |

## 5. Design requirements: Coco Studio (admin.cocovanillegranby.com)

| # | Module / rule (what it does) | Why |
|---|---|---|
| A1 | **Interface in French by default**; per-user switch to EN. Every staff-facing screen, alert and printed kitchen sheet exists in French (Payload `i18n` FR + custom Studio screens, 16b) | F-6 |
| A2 | **Publish guard** (plan v1): blocks a page or product if the FR version is missing or behind the EN/ES version, if any [[FACT NEEDED]] marker remains, if allergens lack a human "vérifié le … par …" stamp, or if text contains « sans gluten / végane / sans noix » while the product isn't flagged as cleared | F-2, A-6, A-8 |
| A3 | **Confidentialité** tab: (a) person in charge (name, title, email; feeds the site footer); (b) **vendor register** = §2 table with ÉFVP status, agreement date and region; (c) **incident register** (date, nature, PI involved, people affected, risk of serious injury yes/no, CAI notified yes/no, measures); (d) **requests log** (access, rectification, portability, withdrawal) with due dates; (e) retention jobs (allergy notes, raw logs, abandoned carts) | P1, P4, P5, P6 |
| A4 | **Consent ledger**: cookie choices (anonymous ID + version) and CASL consents (text, time, source, order ID). One-click export for a complaint | P2, E-5 |
| A5 | **Message templates** tagged *Transactionnel* or *Commercial*. Commercial ones can't be sent to anyone without a matching consent. Footer added automatically: « Coco Vanille · 3, rue Court, Granby · Se désabonner ». SMS adds « STOP pour arrêter » | E-1–E-5 |
| A6 | **Prix**: automatic price history per product (date, old price, new price, who). A "promo" (« était / maintenant ») can't be set unless the history backs the old price | K-2 |
| A7 | **Taxes**: per product: tax class, single-serving weight (g), sold unpackaged or prepackaged, pack count. Effective-dated rate table. **Owner-only**, with an « Approuvé par le comptable le … » field required before a class goes live | T-1–T-7 |
| A8 | **Cartes-cadeaux**: ledger (issued, redeemed, balance). The data model has **no expiry field and no fee field**, so they can't be added by mistake | C-11 |
| A9 | **Commandes**: date changes need the customer's confirmation; cancellation starts a **15-day refund timer** that turns red at day 10; deposit/balance shown on the pickup card | C-5, C-6, C-13 |
| A10 | **Avis**: no per-employee counts or leaderboard; review requests are open-ended; Claude drafts get names stripped before the API call; a human approves every reply | K-4, §2 |
| A11 | **Concours** checklist: total prize value; FR rules template (lawyer-reviewed once); no purchase required; skill-testing question; draw date; winner record. No RACJ step (regime repealed 2023-10-27) | X-3, X-5 |
| A12 | Staff accounts: least privilege (16b roles); staff PI is also PI (same register); MFA for owner/admin | P4, P5 |

---

## 6. Tax decision table (checkout must implement; accountant signs every row)

Two dates matter: **before** and **from 2026-07-15** (QST change, T-3). GST rows follow ETA Sch. VI Part III s. 1(m) (T-1). "Zero" = zero-rated (0 %). Rates in the code are placeholders until confirmed (T-7).

| # | Item (examples) | How sold | GST | QST before 2026-07-15 | QST from 2026-07-15 | Status |
|---|---|---|---|---|---|---|
| 1 | Bread, baguette, plain croissant, bagel, roll, frozen bread | Any quantity | Zero | Zero | Zero | Confirmed rule (T3); "frozen" is my reading |
| 2 | Sweet baked goods: cake slice, muffin, tartelette, cookie, doughnut, brownie, éclair, Paris-Brest individuel, **almond croissant** (sweet filling) | Unpackaged, **< 6** single servings in the supply | **Taxable** | Taxable | **Zero** | Confirmed (T1, T3, T5) |
| 3 | Same | Unpackaged, **≥ 6** single servings (can be mixed) | Zero | Zero | Zero | Confirmed (T3) + ruling (T10) |
| 4 | Same | **Prepackaged** pack of **< 6** single servings (e.g., box of 4) | **Taxable** | Taxable | **Zero** | Confirmed rule; **ASK**: is a *made-for-this-order* box "prepackaged"? Do two boxes of 4 count as 8? |
| 5 | Same | Prepackaged pack of **≥ 6** | Zero | Zero | Zero | Confirmed rule |
| 6 | Whole cake, whole tart, bûche (several portions), item over the single-serving line (≥ 230 g in one ruling) | Any | Zero (not a single serving) | Zero | Zero | My reading of T-1/T-2 → **ASK** (serving-size test) |
| 7 | Macarons, chocolates, candy-like items | Any | **ASK** (confectionery is taxable, T1/T2; whether macarons are "confectionery" or "similar to pastries" is unknown) | ASK | ASK | **UNVERIFIED** |
| 8 | Coffee, tea, other prepared beverages | Café | **ASK** | Taxable (T7) | Taxable (beverages excluded from the measure: T7, T9) | Partly |
| 9 | Heated food (vol-au-vent chaud), food eaten in the café (≈10 seats) | Café / dine-in | **ASK** | ASK | ASK | **UNVERIFIED** (restaurant and heated-food rules not searched) |
| 10 | Gift card | Sale | None at sale (T11) | **ASK** (QST equivalent) | ASK | Partly |
| 11 | Gift card | Redemption | By the item bought (rows 1–9) | Same | Same | Partly (T11) |
| 12 | Delivery fee (not offered at launch) | Optional | **ASK** (likely follows the food, T13) | ASK | ASK | **UNVERIFIED** |
| 13 | Deposit on a custom cake | Paid before pickup | **ASK** (when tax is due on a deposit) | ASK | ASK | **UNVERIFIED** |

Launch rule: **pickup only, no delivery fee, no café items in the online menu** until rows 7–13 are signed. That removes most of the unknowns.

```js
// tax.js — illustrative, not run. Integer cents. Every class, rate and date is Studio data approved by the accountant.
const RATES = [ // effective-dated; [[UNVERIFIED: confirm 5 % / 9.975 % with CRA and Revenu Québec]]
  { from: '1900-01-01', gst: 0.05, qst: 0.09975 },
];
const QST_SWEET_SINGLE_ZERO_FROM = '2026-07-15'; // Revenu Québec, Fournitures détaxées (T5)
const SINGLE_SERVING_MAX_G = 230; // one CRA ruling (T10); accountant to confirm

function rateOn(dateISO) {
  return RATES.filter((r) => r.from <= dateISO).at(-1);
}

// line: { cents, qty, taxClass: 'basic'|'sweet'|'taxable'|'giftcard'|'ask', unitGrams, packCount|null }
export function computeTaxes(lines, supplyDateISO) {
  if (lines.some((l) => l.taxClass === 'ask')) throw new Error('Produit sans classe fiscale approuvée');
  const r = rateOn(supplyDateISO);
  const isSweetSingle = (l) => l.taxClass === 'sweet' && l.unitGrams < SINGLE_SERVING_MAX_G;
  // Unpackaged single servings are counted across the whole supply (mixed six = zero-rated, T10)
  const looseSingles = lines.filter((l) => isSweetSingle(l) && !l.packCount).reduce((n, l) => n + l.qty, 0);

  let gstBase = 0, qstBase = 0;
  for (const l of lines) {
    const amount = l.cents * l.qty;
    if (l.taxClass === 'giftcard' || l.taxClass === 'basic') continue;   // no tax at sale / zero-rated
    if (l.taxClass === 'taxable') { gstBase += amount; qstBase += amount; continue; }
    if (!isSweetSingle(l)) continue;                                      // not a single serving → zero-rated (row 6, ASK)
    const gstTaxable = l.packCount ? l.packCount < 6 : looseSingles < 6;  // ETA Sch. VI III 1(m)
    if (gstTaxable) {
      gstBase += amount;
      if (supplyDateISO < QST_SWEET_SINGLE_ZERO_FROM) qstBase += amount;  // QST zero-rated from 2026-07-15
    }
  }
  // Rounding method (per invoice vs per line): accountant
  return { gst: Math.round(gstBase * r.gst), qst: Math.round(qstBase * r.qst) };
}
```

---

## 7. Copy examples (Québec French, with EN)

| Where | FR | EN |
|---|---|---|
| Consent banner | « Nous utilisons des témoins essentiels au fonctionnement du site (panier, sécurité). Avec votre accord, nous utiliserions aussi des outils de mesure (Google Analytics, Microsoft Clarity) qui peuvent suivre votre navigation. Ils restent désactivés tant que vous ne les activez pas. » [Tout refuser] [Tout accepter] [Choisir] | "We use cookies the site needs to work (cart, security). With your permission we'd also use measurement tools (Google Analytics, Microsoft Clarity) that can track your browsing. They stay off unless you turn them on." [Refuse all] [Accept all] [Choose] |
| Checkout (FR) | ☐ « J'ai lu et j'accepte les Conditions de vente. » [Confirmer et payer 48,00 $] | — |
| Checkout (/en/) | — | "The Conditions of Sale are provided in French [here]." ☐ "I have received the French version and I expressly wish to be bound by the English version." (counsel) |
| Gift card | « Carte-cadeau Coco Vanille · Sans date d'expiration · Sans frais · Solde : 32,50 $ » | "No expiry date · No fees" |
| Allergen block | « Contient : blé, lait, œufs, amandes. Préparé dans une cuisine où l'on manipule aussi arachides, noix, soya et sésame. Une question d'allergie ? Appelez-nous au 450-372-7177 avant de commander. » [[FACT NEEDED: the kitchen's real allergen list]] | "Contains: wheat, milk, eggs, almonds…" |
| Pickup SMS | « Coco Vanille : votre commande n° 1042 est prête ! 3, rue Court, Granby. STOP pour ne plus recevoir de textos. » | "Coco Vanille: order #1042 is ready! … Reply STOP to opt out." |
| Box QR card | « Votre avis nous aide beaucoup : [QR] » (no stars, no product, no staff name: research/18) | "Your review helps us a lot: [QR]" |
| Influencer post | « Partenariat rémunéré avec Coco Vanille » at the start of the caption, plus the platform's paid-partnership label [exact Ad Standards FR wording: check K4] | "Paid partnership with Coco Vanille" |
| Contest | « Concours ouvert aux résidents du Québec de 18 ans et plus. Aucun achat requis. Prix : carte-cadeau de 75 $. Règlement complet : [lien]. » | — |

---

## 8. Questions for professionals

### Lawyer (Québec privacy / consumer / language)

1. Loi 25 s. 8.1: does Google Consent Mode **advanced** (cookieless pings while denied) fit "off by default", or only **basic**? Is Clarity with masking acceptable after opt-in?
2. s. 17: confirm the ÉFVP list in §2 (Stripe/Square, Twilio, GA4, Clarity, Claude API, Sentry, mailbox). One ÉFVP per vendor, or one grouped document? Which contract clauses are needed with US vendors whose terms we can't negotiate?
3. Are allergy notes "sensitive" PI? What retention fits (30 days after pickup proposed)? Are IP addresses in server logs PI?
4. Charter s. 55: on /en/ checkout, is the navigation-language reading (F-4) enough, or is the express-choice box (O3) required? Can transactional emails be FR + EN in one message?
5. Charter s. 57 (invoices/receipts) and s. 52 for Google Business Profile posts and Instagram captions: French only, or bilingual with French at least equal?
6. LPC 54.4–54.9: the exact disclosure list and cancellation cases for **pickup** orders of perishable food. Does the distance-contract section apply to a same-day pickup ordered online?
7. Custom-cake **deposit**: may it be non-refundable, and from when (once ingredients are bought, X days before)? What about Civil Code rules on cancelling a contract for work (UNVERIFIED hypothesis)?
8. Holiday **pre-orders** paid weeks ahead: any LPC limits on prepayment?
9. Tips online: does the 2025 LPC tip rule apply to web checkout? (We plan no prompt.)
10. CASL: is a review-request email after pickup a commercial message? Does purchase-based implied consent (2 years per secondary guides) cover it?
11. Competition Act: enacted C-59 text (were the 2024 Senate amendments kept?) on drip pricing and ordinary-selling-price evidence. How long must price records be kept?
12. Contests: confirm nothing replaced the RACJ regime repealed 2023-10-27, and what the Criminal Code and Competition Act (s. 74.06 †) still require for an Instagram giveaway with a $75 gift card.
13. Trademark: is it worth filing "COCO VANILLE" with CIPO (classes, cost), given "Pâtisserie Cocovanille" on Google Maps?

### Accountant

1. Confirm rows 1–13 of §6, especially: made-to-order boxes as "prepackaged", several boxes of 4, the 230 g test, macarons, café beverages, heated and dine-in food.
2. Confirm the **2026-07-15 QST zero-rating**: product list, permanence, that GST still applies, and what Revenu Québec's **2026-08-07 « Précisions »** notice changes (T15).
3. Gift cards: QST at sale? Breakage (unused balances) treatment?
4. Deposits: when GST/QST is due on a deposit for a custom cake.
5. Delivery fee tax status (mixed carts).
6. Rounding method; registration numbers and wording on receipts and emails (in French).

### Owner [[FACT NEEDED]]

- MAPAQ permit number(s) and category (retail / restaurant).
- VPS provider + data-centre city.
- Payment processor (Stripe, Square or the POS's own) and its data region.
- Who is the person in charge of PI (default: the owner).
- The kitchen's real allergen list and cross-contact practices; any gluten-free or vegan products.
- Is any staff member paid to post? Any influencer deals?
- Results of a CIPO search for "COCO VANILLE" / "COCOVANILLE".

---

## 9. What this changes in the plans (for the owner; files not edited by this track)

| Where | Change |
|---|---|
| plan-v0c §9 "Taxes" | Replace with: "GST: sweet single servings taxable under 6 (ETA Sch. VI III 1(m)); QST zero-rated on them since 2026-07-15 (Revenu Québec). Tax classes set with the accountant (research/07 §6)." |
| plan-v0c §9 "Loi 96" | Add: French-first T&Cs (s. 55, 2023-06-01) + express-choice box on EN/ES checkout; no auto-redirect away from French |
| plan-v0c §6 "After the order" | Follow-up message 24 h later → **QR on the box + opt-in email only** (CASL, E-4). Birthday reminder: express consent box (O10) |
| plan-v1 §11 Measurement | GA4 + Clarity load only after opt-in (Consent Mode basic). Advanced mode = counsel decision. Meta pixel not at launch |
| plan-v1 §4 Layer 19 / product pages | Add weight per unit (tax), the allergen block, and a ban on free-from claims until cleared |
| research/18 claim 22 | Evidence now exists: GST rule **Confirmed** (T3, T10), and **the QST side changed on 2026-07-15** (T5). Claim 20: basic vs advanced definitions **Confirmed** on Google's page (L13); the EEA-mandate date is still UNVERIFIED. (For the track that owns research/18.) |
| research/17 §7 | "Other provinces count as outside Québec": supported by IAB Canada (L5). No change to the "Québec VPS" recommendation |

---

## 10. Search queue (not run: cap reached; updated after the 2026-10-25 check)

1. legisquebec.gouv.qc.ca P-39.1 s. 3.8 (incident register), s. 8.2 (privacy policy), s. 27 (portability, in-force date), s. 90.12 † (AMP ceiling for an individual: $50,000?). (s. 3.1 now Partly via L16)
2. cai.gouv.qc.ca: cookies / s. 8.1 guidance; ÉFVP guide and template (2023)
3. legisquebec P-40.1 ss. 54.4, 54.5, 54.7, 54.8, 54.9 (full text); OPC "acompte" page
4. LPC legal warranty ss. 37–38 and perishable food; Civil Code art. 2125 (cancelling a contract for work)
5. Charter s. 57 (invoices) and OQLF page "Sites Web et médias sociaux"; regulation in force 2025-06-01 (signage, trademarks)
6. Competition Act after C-59: Royal Assent date; were the Senate amendments (2024-05-02) kept; enacted s. 74.01 wording; Bureau guidance on fake reviews
7. Ad Standards 2025 guidelines: French disclosure tags (#pub, #commandité)
8. CRTC CASL: s. 6(6) transactional exemption scope (CRTC primary text); identification info; review requests as CEMs. (2-year implied consent and 10-business-day unsubscribe now Partly via E6–E8)
9. CFIA: vegan / vegetarian claims; "free of" allergen claims; FDR B.01.003 retail-packaged labelling exemptions
10. CRA GST/HST Memo 4.3 §§ on baked goods and restaurants; "food for consumption on premises" and the 90 % rule; prepared coffee
11. Revenu Québec: 2026-08-07 « Précisions concernant la détaxation » (full text); permanence; QST on gift cards; QST rate 9.975 %
12. CRA P-202 full text (gift certificates); GST on deposits; delivery charges
13. Québec / Canada web-accessibility obligations for private businesses
14. CIPO Canadian Trademarks Database: "COCO VANILLE", "COCOVANILLE"
15. Contests after the 2023-10-27 repeal: any replacement rule in Québec; Criminal Code skill-testing question; Competition Act s. 74.06 disclosure; Meta promotion guidelines
16. Stripe and Square Canada data regions; Twilio data residency; Microsoft Clarity consent API
17. MAPAQ: the 2025-07-08 hygiene-manager change (re-check); 2026 permit tariff indexation; $144 file-opening fee (franchise blog only)

---

## Verification log (2026-10-25)

Adversarial pass: 8 WebSearch queries (cap 8), several claims per query. Summaries only (WebFetch blocked). This log sits just above "Sources" so the file still ends with Sources.

| Claim (row) | Verdict | Source URL |
|---|---|---|
| QST zero-rated from 2026-07-15 on single-serving sweet baked goods (< 230 g or packs < 6); QST only (T-3, §0.1) | Confirmed. Added: announced 2026-05-25; RQ « Précisions » 2026-08-07 not read | https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq/regles-de-base-relatives-a-lapplication-de-la-tpstvh-et-de-la-tvq/types-de-fournitures/fournitures-detaxees/ · https://www.revenuquebec.ca/fr/salle-de-presse/nouvelles-fiscales/details/2026-05-27/detaxation-de-certains-produits-dans-le-regime-de-la-tvq/ |
| GST still applies to those items (T-1, T-3) | Confirmed (RQ heading "TVQ seulement") | https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq/regles-de-base-relatives-a-lapplication-de-la-tpstvh-et-de-la-tvq/types-de-fournitures/fournitures-detaxees/ |
| Drip-pricing rule in force since June 2022 (K-1) | Confirmed: 2022-06-23 | https://www.fasken.com/en/knowledge/2024/07/the-evolving-competition-law-landscape-in-ca-4 |
| Bill C-59 "still in progress; final text and in-force date UNVERIFIED" (K-2) | **Corrected**: enacted 2024; OSP burden shift described as in force; private action from 2025-06-20; tax exception narrowed to charges payable by the purchaser. Royal Assent date still UNVERIFIED | https://www.fasken.com/en/knowledge/2024/07/the-evolving-competition-law-landscape-in-ca-4 |
| Loi 25 AMP ceiling $10M or 2 % of worldwide turnover (P9) | Confirmed (law firms) | https://www.mccarthy.ca/en/insights/blogs/techlex/now-may-hurt-cais-general-framework-monetary-administrative-penalties |
| Penal fines $25M or 4 %, doubled for repeat (P9) | Confirmed. Added: minimum $15,000 (enterprise); 5-year limit since 2023-09-22 | https://www.mccarthy.ca/fr/references/blogues/techlex/loi-25-obligations-en-vigueur-en-septembre-2023 |
| AMP ceiling $50,000 for an individual (P9) | Unverified (not found in two searches) | — |
| s. 3.1: default holder, written delegation, title + contact on the website (P1) | Confirmed (Partly: law-firm guide reproducing the text; OTPQ guide) | https://gowlingwlg.com/getmedia/781d315a-dc64-45af-8f1d-bb0b49dc7898/Gowling-WLG-Guide-annote-sur-la-Loi-25.pdf.xml |
| Portability in force 2024-09-22 (P6) | Unverified (only "phased in until Sept 2024") | https://www.opiq.qc.ca/wp-content/uploads/2022/10/OPIQ_COMM_MbrPrive_Loi25_VF.pdf |
| OQLF registration threshold 25 employees since 2025-06-01 (F-6) | Confirmed (secondary) | https://www.dlapiper.com/fr-ca/insights/publications/2025/06/quebecs-language-laws-changed-this-week |
| Signage/trademark regulation in force 2025-06-01 (F-7) | Confirmed (secondary). Added: sell-through of older products to 2027-06-01 | https://gowlingwlg.com/fr/insights-resources/articles/2025/entree-dernieres-dispositions-loi-96 |
| MAPAQ permit prices $367 / $283 / $566 (A-1) | Confirmed (Québec.ca, page undated) | https://www.quebec.ca/entreprises-et-travailleurs-autonomes/industrie-bioalimentaire/permis-alimentaires/permis-restauration-vente-detail |
| 2025-07-08 = hygiene-manager number no longer required (A-1) | Unverified: the date was re-seen only for the end of UMCF (hot/cold unit) fees | https://www.quebec.ca/entreprises-et-travailleurs-autonomes/permis-certifications/permis-restauration-vente-detail |
| Contests > $100 owe RACJ duties (10 %) and the Rules apply (X-3, §0.12, A11) | **Corrected**: regime repealed 2023-10-27 (Bill 17); no RACJ duties or filing | https://cassels.com/insights/let-the-games-begin-quebec-repeals-laws-related-to-the-regulation-of-publicity-contests/ · https://www.blakes.com/fr-ca/perspectives/changements-a-loi-en-matiere-de-concours-publicitaires-au-quebec/ |
| RACJ 3 % / 0.5 % tiers (X-3) | Unverified (moot after repeal) | — |
| International contests excluded from RACJ (X-3) | Confirmed: since 2021-06-02 | https://langlois.ca/en/?p=10474 |
| CASL implied consent from a purchase = 2 years (E-4) | Confirmed (secondary guides) | https://www.queensu.ca/secretariat/legal-counsel/casl/how-comply-casl |
| Unsubscribe honoured within 10 business days (E-5) | Confirmed (secondary guides) | https://www.conestogac.on.ca/canadas-anti-spam-legislation |
| CASL s. 6(6) transactional exemption (E-1) | Unverified in this pass (not covered by results; row stays Partly) | — |

## Sources

Privacy (Loi 25) and consent
- L1 · Loi 25 et gestion des témoins : comment vous conformer à la loi (Raymond Chabot Grant Thornton) — https://www.rcgt.com/fr/conseils/avis-d-experts/loi-25-gestion-temoins-comment-conformer-loi/ — seen 2026-10-25
- L2 · Law25 and Cookies: Navigating Digital Consent in Quebec (Private AI) — https://www.private-ai.com/en/blog/cookies-law25 — seen 2026-10-25
- L3 · Loi 25 sur la protection des données : serez-vous mieux protégé ? (Protégez-vous) — https://www.protegez-vous.ca/nouvelles/technologie/loi-25-sur-la-protection-des-donnees-serez-vous-mieux-protege — seen 2026-10-25
- L4 · Identification, localisation et profilage (Québec.ca, public-sector guidance) — https://www.quebec.ca/gouvernement/travailler-gouvernement/normes-gouvernance-pratiques-internes/protection-des-renseignements-personnels/technologie-et-droit-a-la-protection-des-renseignements-personnels/identification-localisation-profilage — seen 2026-10-25
- L5 · Transferts transfrontaliers, Québec (IAB Canada, June 2022) — https://iabcanada.com/wp-content/uploads/2022/06/IAB-Canada_BPG-Que_Transferts-transfrontaliers_June-2022.pdf — seen 2026-10-25
- L6 · The exportation of personal data from Québec (Fasken) — https://www.fasken.com/fr/knowledge/loi-25/17-the-exportation-of-personal-data-from-quebec — seen 2026-10-25
- L7 · La réforme du régime de protection de la vie privée entre en vigueur au Québec (McCarthy Tétrault) — https://www.mccarthy.ca/fr/references/blogues/techlex/reforme-du-regime-de-protection-de-la-vie-privee-entre-en-vigueur-au-quebec — seen 2026-10-25
- L8 · Évaluations des facteurs relatifs à la vie privée (IAB Canada, June 2022) — https://iabcanada.com/wp-content/uploads/2022/06/IAB-Canada_BPG-Que_Evaluations-des-facteurs-relatifs-a-la-vie-privee_June-2022.pdf — seen 2026-10-25
- L9 · LPRPSP as amended (Lavery, PDF) — https://www.lavery.ca/upload/pdf/Publications/Amendee-LPRPSP-FR.pdf — seen 2026-10-25
- L10 · Loi 25 : nouveau régime d'application de la loi québécoise sur la protection des renseignements personnels (Osler) — https://www.osler.com/fr/articles/mises-%C3%A0-jour/loi-25-nouveau-regime-d-application-de-la-loi-quebecoise-sur-la-protection-des-renseignements-pers/?pdf=1 — seen 2026-10-25
- L11 · Loi 25 : obligations en vigueur en septembre 2023 (McCarthy Tétrault) — https://www.mccarthy.ca/fr/references/blogues/techlex/loi-25-obligations-en-vigueur-en-septembre-2023 — seen 2026-10-25
- L12 · Law 25 penalties (Hilotech, third-party guide) — https://hilotech.ca/en/wiki/law-25/penalties — seen 2026-10-25
- L13 · Consent mode overview (Google Tag Platform) — https://developers.google.com/tag-platform/security/concepts/consent-mode?hl=en — seen 2026-10-25
- L14 · Set up consent mode (Google Tag Platform devguide) — https://developers.google.com/tag-platform/devguides/consent — seen 2026-10-25
- L15 · Basic vs advanced Google Consent Mode (Consently, secondary) — https://help.consently.net/en/basic-vs-advanced-google-consent-mode — seen 2026-10-25
- L16 · Guide annoté sur la Loi 25 (Gowling WLG, PDF; reproduces s. 3.1) — https://gowlingwlg.com/getmedia/781d315a-dc64-45af-8f1d-bb0b49dc7898/Gowling-WLG-Guide-annote-sur-la-Loi-25.pdf.xml — seen 2026-10-25
- L17 · Loi 25 (Ordre des technologues professionnels du Québec, PDF, 2022) — https://www.otpq.qc.ca/publications/articles_mai_2022/Loi25-OTPQ-vf.pdf — seen 2026-10-25
- L18 · Loi 25, communication aux membres (OPIQ, PDF, 2022-10) — https://www.opiq.qc.ca/wp-content/uploads/2022/10/OPIQ_COMM_MbrPrive_Loi25_VF.pdf — seen 2026-10-25
- L19 · Now it may hurt: the CAI's general framework for monetary administrative penalties (McCarthy Tétrault) — https://www.mccarthy.ca/en/insights/blogs/techlex/now-may-hurt-cais-general-framework-monetary-administrative-penalties — seen 2026-10-25
- L20 · Loi 25 : un nouveau mécanisme de mise en application (Osler blog) — https://www.osler.com/fr/articles/blogues/blogue-sur-la-gestion-des-risques-et-la-reponse-aux-crises/loi-25-un-nouveau-mecanisme-de-mise-en-application-de-la-loi-en-matiere-de-protection-des-renseignements-personnels-dans-le-secteur-prive-au-quebec/ — seen 2026-10-25

French language
- F1 · Infraction à la Charte de la langue française : le site Web de l'entreprise Quality Belt Maintenance ltée (Québec.ca) — https://www.quebec.ca/nouvelles/actualites/details/infraction-a-la-charte-de-la-langue-francaise-le-site-web-de-lentreprise-quality-belt-maintenance-ltee-42492 — seen 2026-10-25
- F2 · Infraction à la Charte : le site Web de l'entreprise Esprit Rafting Adventures inc. (Québec.ca, 2026) — https://www.quebec.ca/nouvelles/actualites/details/infraction-a-la-charte-de-la-langue-francaise-le-site-web-de-lentreprise-esprit-rafting-adventures-inc-72388 — seen 2026-10-25
- F3 · Infraction à la Charte : le site Web de URBN Canada Retail inc. (Anthropologie) (Québec.ca) — https://www.quebec.ca/nouvelles/actualites/details/infraction-a-la-charte-de-la-langue-francaise-le-site-web-de-urbn-canada-retail-inc-anthropologie-69964 — seen 2026-10-25
- F4 · Droits linguistiques : votre site Web est-il conforme à la loi ? (Éducaloi) — https://educaloi.qc.ca/decryptage/droits-linguistiques-votre-site-web-est-il-conforme-a-la-loi — seen 2026-10-25
- F5 · OQLF sends warning to radio host (CTV Montréal, 2023) — https://montreal.ctvnews.ca/mobile/oqlf-sends-warning-to-radio-host-1.1673363 — seen 2026-10-25
- F6 · OQLF, access-to-information release AI2526-358, Document 6 (Charter text, June 2025) — https://www.oqlf.gouv.qc.ca/office/RDIPRP/demandes/AI2526-358/Document%206.pdf — seen 2026-10-25
- F7 · OQLF, access-to-information release AI2526-358, Document 4 (contracts on websites/apps) — https://www.oqlf.gouv.qc.ca/office/RDIPRP/demandes/AI2526-358/Document%204.pdf — seen 2026-10-25
- F8 · Bill 96's French-first rule takes effect (Gowling WLG, 2023) — https://gowlingwlg.com/fr/insights-resources/articles/2023/bill-96-s-french-first-rule-takes-effect — seen 2026-10-25
- F9 · Gazette officielle du Québec 2024, regulation text 83579 (trademarks, signage) — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2024F/83579.pdf — seen 2026-10-25
- F10 · Gazette officielle du Québec 2024, regulation text 82179 — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2024F/82179.pdf — seen 2026-10-25
- F11 · Fasken, Bill 96 summary (PDF; work-language points, the summary didn't say which Fasken/Osler document) — https://www.fasken.com/-/media/1e3cfed740254004985801f31bc41626.ashx — seen 2026-10-25
- F12 · Bill 96 / Loi 96 Québec 2026 (SiLaw, 2026-06-12) — https://silaws.com/2026/06/12/bill-96-loi-96-quebec-2026-fr/ — seen 2026-10-25
- F13 · Osler, Bill 96 work-language summary — https://www.osler.com/?p=31426 — seen 2026-10-25
- F14 · Quebec's language laws changed this week (DLA Piper, 2025-06) — https://www.dlapiper.com/fr-ca/insights/publications/2025/06/quebecs-language-laws-changed-this-week — seen 2026-10-25
- F15 · Entrée en vigueur des dernières dispositions de la Loi 96 (Gowling WLG, 2025) — https://gowlingwlg.com/fr/insights-resources/articles/2025/entree-dernieres-dispositions-loi-96 — seen 2026-10-25
- F16 · Exigences de français du projet de loi 96 et du 1er juin 2025 : idées reçues (McCarthy Tétrault) — https://www.mccarthy.ca/fr/references/blogues/consumer-markets-perspectives/exigences-de-francais-du-projet-de-loi-96-et-du-1er-juin-2025-idees-recues — seen 2026-10-25
- F17 · Lavery, publication 4312 (francization threshold, 25 employees) — https://www.lavery.ca/fr/publications/4312-afficher-PDF-publication.html — seen 2026-10-25

Consumer protection
- C1 · Gazette officielle 2007, act adding LPC Division I.1 "Contrats à distance" (47480) — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2007F/47480.pdf — seen 2026-10-25
- C2 · Gazette officielle 2010, regulation exempting oral distance contracts from s. 54.4 (53795) — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2010F/53795.pdf — seen 2026-10-25
- C3 · OPC, access-to-information document 344001991 (54.8, 54.9, 54.14) — https://cdn.opc.gouv.qc.ca/media/documents/a-propos/AccesInformation/2021/344001991_Document4.pdf — seen 2026-10-25
- C4 · Loi modifiant la LPC… où en êtes-vous avec votre site Web ? (Lavery, 2006) — https://lavery.ca/DATA/PUBLICATION/829_fr~v~loi-modifiant-la-loi-sur-la-protection-du-consommateur-et-la-loi-sur-le-recouvrement-de-certaines-creances-ou-en-etes-vous-avec-votre-site-web-.pdf — seen 2026-10-25
- C5 · Cancelling an online purchase: refund (OPC) — https://www.opc.gouv.qc.ca/en/consumer/topic/purchase/online-purchase/cancelling/refund/ — seen 2026-10-25
- C6 · Démarche pour annuler un achat en ligne (OPC) — https://www.opc.gouv.qc.ca/en/consumer/topic/purchase/online-purchase/cancelling/ — seen 2026-10-25
- C7 · Obligations des commerçants liées au commerce en ligne (OPC) — https://www.opc.gouv.qc.ca/enligne — seen 2026-10-25
- C8 · Livraison et retard (OPC) — https://www.opc.gouv.qc.ca/en/consumer/topic/delivery-delays/delay — seen 2026-10-25
- C9 · Annuler un achat en ligne (Éducaloi) — https://educaloi.qc.ca/capsules/annuler-un-achat-en-ligne/ — seen 2026-10-25
- C10 · P-40.1, Loi sur la protection du consommateur (Légis Québec) — https://legisquebec.gouv.qc.ca/fr/showdoc/cs/p-40.1 — seen 2026-10-25
- C11 · Article 224, versions de la disposition (Légis Québec) — https://www.legisquebec.gouv.qc.ca/fr/version/lc/P-40.1?code=se%3A224&historique=20180817 — seen 2026-10-25
- C12 · Règlement d'application de la LPC, P-40.1, r. 3 (Légis Québec) — https://www.legisquebec.gouv.qc.ca/fr/ShowDoc/cr/P-40.1,%20r.%203 — seen 2026-10-25
- C13 · Paiement par carte de débit : frais interdits (OPC) — https://www.opc.gouv.qc.ca/commercant/pratique-commerce/prix-rabais/frais-interdit — seen 2026-10-25
- C14 · Annonce d'un prix tout inclus (OPC, tickets sector) — https://www.opc.gouv.qc.ca/commercant/secteur/billet-spectacle/tout-inclus — seen 2026-10-25
- C15 · Règles encadrant les cartes prépayées (OPC) — https://www.opc.gouv.qc.ca/en/consumer/topic/contract/rules/card/ — seen 2026-10-25
- C16 · Date d'expiration : cartes utilisables comme de l'argent (OPC) — https://www.opc.gouv.qc.ca/commercant/secteur/carte-prepayee/carte-argent/date-dexpiration — seen 2026-10-25
- C17 · Les cartes prépayées (Éducaloi) — https://educaloi.qc.ca/capsules/les-cartes-prepayees/ — seen 2026-10-25
- C18 · Règles : cartes pour un service précis (OPC) — https://www.opc.gouv.qc.ca/commercant/secteur/carte-prepayee/carte/date-dexpiration/regle-service-precis/ — seen 2026-10-25
- Tips rule: research/18, claim 7 (sources S24 Québec.ca and S25 OPC) — /home/user/coco-vanille-granby/research/18-dated-claims-verification.md — seen 2026-10-25

Competition and advertising
- K1 · Competition Bureau Canada, brief to the House Finance Committee on Bill C-59 — https://www.ourcommons.ca/Content/Committee/441/FINA/Brief/BR12944851/br-external/CompetitionBureauCanada-e.pdf — seen 2026-10-25
- K2 · Government's fight against junk fees, savings claims and greenwashing heats up (Baker McKenzie, 2024-06-17) — https://canada-insights.bakermckenzie.com/2024/06/17/governments-fight-against-junk-fees-savings-claims-and-greenwashing-heats-up-with-new-proposed-amendments/ — seen 2026-10-25
- K3 · Further and significant proposed amendments to the Competition Act (Fasken, May 2024) — https://www.fasken.com/en/knowledge/2024/05/further-and-significant-proposed-amendments-to-the-competition-act-in-the-areas-of-merger-review-or — seen 2026-10-25
- K4 · Influencer Marketing Disclosure Guidelines, 2025-10-08 (Ad Standards) — https://adstandards.ca/wp-content/uploads/Ad-Standards-Influencer-Marketing-Disclosure-Guidelines-2025-10-08.pdf — seen 2026-10-25
- K5 · Influencer Marketing: Legal Implications for Canadian Content Creators and Advertisers (Aird & Berlis) — https://airdberlis.com/insights/blogs/thespotlight/post/ts-item/influencer-marketing-legal-implications-for-canadian-content-creators-and-advertisers — seen 2026-10-25
- K6 · The evolving competition law landscape in Canada (Fasken, 2024-07) — https://www.fasken.com/en/knowledge/2024/07/the-evolving-competition-law-landscape-in-ca-4 — seen 2026-10-25
- Google review policy (staff quotas, incentives, gating): research/18, claims 4a–4b (S11) — /home/user/coco-vanille-granby/research/18-dated-claims-verification.md — seen 2026-10-25

Anti-spam
- E1 · The many purposes of CASL (Lorman, 2016) — https://lorman.com/resources/the-many-purposes-of-canadian-anti-spam-legislation-casl-16393 — seen 2026-10-25
- E2 · About Canada's Anti-Spam Legislation (Klaviyo Help) — https://help.klaviyo.com/hc/en-us/articles/4402385511579-About-Canada-s-Anti-Spam-Legislation — seen 2026-10-25
- E3 · Messaging regulations for Canada (MoEngage docs) — https://moengage.com/docs/user-guide/campaigns-and-channels/sms-mms-and-rcs/compliance-and-deliverability/messaging-regulations-for-canada — seen 2026-10-25
- E4 · ESPC CASL review brief (Email Sender & Provider Coalition, 2017-10-05) — https://www.espcoalition.org/sites/default/files/news-items/ESPC%20CASL%20Review%20Brief%205Oct2017%20-%20THREE%20PAGE.pdf — seen 2026-10-25
- E5 · CASL clarified by CRTC at information sessions (Barry Sookman, 2014) — https://barrysookman.com/2014/06/08/casl-clarified-by-crtc-at-information-sessions/ — seen 2026-10-25
- E6 · How to comply with CASL (Queen's University) — https://www.queensu.ca/secretariat/legal-counsel/casl/how-comply-casl — seen 2026-10-25
- E7 · Canada's Anti-Spam Legislation (Conestoga College) — https://www.conestogac.on.ca/canadas-anti-spam-legislation — seen 2026-10-25
- E8 · CASL: preparing for the end of the special transition rule (BLG, 2017-05) — https://www.blg.com/en/insights/2017/05/canadas-anti-spam-legislation-preparing-for-the-end-of-special-transition-rule — seen 2026-10-25
- E9 · Getting consent to send email (Government of Canada, fightspam.gc.ca; listed in results, text not seen) — https://www.fightspam.gc.ca/eic/site/030.nsf/eng/00008.html — seen 2026-10-25

Food
- M1 · Permis de restauration et de vente au détail (Québec.ca) — https://www.quebec.ca/entreprises-et-travailleurs-autonomes/industrie-bioalimentaire/permis-alimentaires/permis-restauration-vente-detail — seen 2026-10-25
- M2 · Marché public (MAPAQ, PDF; permit category definitions) — https://www.mapaq.gouv.qc.ca/fr/Publications/Marche_public.pdf — seen 2026-10-25
- M3 · Permis de restauration et de vente au détail (Québec.ca, permits section; prices, UMCF fees ended 2025-07-08) — https://www.quebec.ca/entreprises-et-travailleurs-autonomes/permis-certifications/permis-restauration-vente-detail — seen 2026-10-25
- M4 · Ouvrir une épicerie (L'Express franchise; $144 file fee, secondary) — https://lexpress-franchise.com/fr-ca/articles/ouvrir-epicerie/ — seen 2026-10-25
- A1 · Industry resource: food allergen labelling (CFIA) — https://inspection.canada.ca/en/food-labels/labelling/industry/how-label-allergens — seen 2026-10-25
- A2 · Food allergies (CFIA, consumers) — https://inspection.canada.ca/en/food-labels/labelling/consumers/food-allergies — seen 2026-10-25
- A3 · Allergen infographic 2025 (CFIA, PDF) — https://inspection.canada.ca/sites/default/files/documents/2025-09/Allergen%20Infographic%202025%20English%20copy.pdf — seen 2026-10-25
- A4 · Just the facts on labels (Bakers Journal) — https://magazine.bakersjournal.com/article/Just+the+facts+on+labels/163607/17289/article.html — seen 2026-10-25
- A5 · ARCHIVED: Consultation document on precautionary labelling of priority allergens (Health Canada) — https://www.canada.ca/en/health-canada/services/food-nutrition/public-involvement-partnerships/precautionary-labelling-food-allergens/document.html — seen 2026-10-25
- A6 · Compliance and enforcement of gluten-free claims (CFIA) — https://inspection.canada.ca/en/food-labels/labelling/industry/allergens-and-gluten/gluten-free-claims — seen 2026-10-25
- A7 · Food and Drug Regulations, s. B.24.018 (Justice Laws; check the current consolidation) — https://laws-lois.justice.gc.ca/eng/Regulations/C.R.C.,_c._870/section-B.24.018-20120804.html — seen 2026-10-25
- A8 · Health Canada's position on gluten-free claims — https://www.canada.ca/en/health-canada/services/food-nutrition/food-safety/food-allergies-intolerances/celiac-disease/health-canada-position-gluten-free-claims.html — seen 2026-10-25
- A9 · When are gluten-free claims allowed in Canada? (Smart & Biggar) — https://www.smartbiggar.ca/insights/publication/when-are-gluten-free-claims-allowed-in-canada- — seen 2026-10-25

Taxes
- T1 · GST/HST Memorandum 4.3, Basic groceries (CRA) — https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/4-3/basic-groceries.html — seen 2026-10-25
- T2 · GI-020, Bars (CRA) — https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/gi-020/bars.html — seen 2026-10-25
- T3 · Sweetened baked goods and similar products (Revenu Québec, EN) — https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/special-cases-gsthst-and-qst/food-services-sector-applying-the-gst-and-qst/groceries/sweetened-baked-goods-and-similar-products/ — seen 2026-10-25
- T4 · Produits de boulangerie sucrés et autres produits semblables (Revenu Québec, FR) — https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq/situations-particulieres-liees-a-la-tpstvh-et-a-la-tvq/alimentation-application-de-la-tps-et-de-la-tvq/produits-alimentaires/produits-de-boulangerie-sucres-et-autres-produits-semblables/ — seen 2026-10-25
- T5 · Fournitures détaxées (Revenu Québec) — https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq/regles-de-base-relatives-a-lapplication-de-la-tpstvh-et-de-la-tvq/types-de-fournitures/fournitures-detaxees/ — seen 2026-10-25
- T6 · Produits alimentaires de base (Revenu Québec, citizens) — https://www.revenuquebec.ca/fr/citoyens/taxes/biens-et-services-taxables-detaxes-ou-exoneres/tps-et-tvq/alimentation-produits-taxables-detaxes-ou-exoneres/produits-alimentaires-de-base/ — seen 2026-10-25
- T7 · Québec abolit la TVQ sur plusieurs produits en épicerie (Protégez-vous) — https://www.protegez-vous.ca/nouvelles/argent/quebec-abolit-la-tvq-sur-plusieurs-produits-en-epicerie — seen 2026-10-25
- T8 · Changements à venir au sujet de la TVQ sur certains produits d'épicerie et d'hygiène (Crowe BGK) — https://www.crowe.com/ca/crowebgk/fr-ca/publications/upcoming-changes-to-the-application-of-quebec-sale-tax — seen 2026-10-25
- T9 · Quebec sales tax: zero-rated food and hygiene products (BDO) — https://www.bdo.ca/fr-ca/insights/quebec-sales-tax-zero-rated-food-and-hygiene-products — seen 2026-10-25
- T10 · CRA rulings and interpretations on 1(m) (taxinterpretations.com: 662936, 676239, 663526, 670653) — https://taxinterpretations.com/content/662936 — seen 2026-10-25
- T11 · CRA GST/HST Policy Statement P-202, Gift certificates (Ryan, 2012) — https://ryan.com/canada/about-ryan/news-and-insights/2012/april/cra-gsthst-policy-statement-p-202-gift-certificates/ — seen 2026-10-25
- T12 · Revised policy statement by the CRA on GST/HST and gift certificates (Sales Tax Institute) — https://www.salestaxinstitute.com/resources/revised-policy-statement-issued-canada-revenue-agency-gsthst-and-gift-certificates — seen 2026-10-25
- T13 · GST/HST temporary tax relief on holiday essentials (Ryan, 2024) — https://ryan.com/canada-fr/a-propos-de-ryan/nouvelle-et-apercus/2024/gsthst-temporary-tax-relief-on-holiday-essentials — seen 2026-10-25
- T14 · Détaxation de certains produits dans le régime de la TVQ (Revenu Québec tax news, 2026-05-27) — https://www.revenuquebec.ca/fr/salle-de-presse/nouvelles-fiscales/details/2026-05-27/detaxation-de-certains-produits-dans-le-regime-de-la-tvq/ — seen 2026-10-25
- T15 · Précisions concernant la détaxation de certains produits dans le régime de la TVQ (Revenu Québec tax news, 2026-08-07; only the title and product list seen) — https://www.revenuquebec.ca/fr/salle-de-presse/nouvelles-fiscales/details/2026-08-07/precisions-concernant-la-detaxation-de-certains-produits-dans-le-regime-de-la-tvq/ — seen 2026-10-25

Contests
- R1 · Lavery, publicity contests in Québec (publication 3018) — https://www.lavery.ca/fr/publications/3018-afficher-PDF-publication.html — seen 2026-10-25
- R2 · Exclusion of international publicity contests from the jurisdiction of the RACJ (Langlois) — https://langlois.ca/en/?p=10474 — seen 2026-10-25
- R3 · Fini l'inscription des concours en ligne auprès de la Régie (François Charron, undated) — https://francoischarron.com/sur-le-web/infos/fini-linscription-des-concours-en-ligne-aupres-de-la-regie-des-jeux-du-quebec-quels-sont-les-impacts/zVbGRsGzw9/ — seen 2026-10-25
- R4 · Gazette officielle 1998, draft on publicity contests (30608) — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/1998F/30608.pdf — seen 2026-10-25
- R5 · Changements à la loi en matière de concours publicitaires au Québec (Blakes) — https://www.blakes.com/fr-ca/perspectives/changements-a-loi-en-matiere-de-concours-publicitaires-au-quebec/ — seen 2026-10-25
- R6 · Let the games begin: Québec repeals laws related to the regulation of publicity contests (Cassels) — https://cassels.com/insights/let-the-games-begin-quebec-repeals-laws-related-to-the-regulation-of-publicity-contests/ — seen 2026-10-25
- R7 · Get ready to play: the end of the RACJ rules on publicity contests (Mondaq) — https://mondaq.com/canada/advertising-marketing--branding/1476446/get-ready-to-play-the-end-of-the-régie-des-alcools-des-courses-et-des-jeux-rules-on-publicity-contests — seen 2026-10-25

Local research files
- research/01 business facts (seating, products, no delivery found) — /home/user/coco-vanille-granby/research/01-business-facts.md — seen 2026-10-25
- research/16b admin tech (Payload FR i18n, Claude API use, Loi 25 row 16) — /home/user/coco-vanille-granby/research/16b-admin-tech-subdomain.md — seen 2026-10-25
- research/17 VPS and Loi 25 inventory (§7) — /home/user/coco-vanille-granby/research/17-vps-self-hosting-and-domain.md — seen 2026-10-25
- research/18 dated claims (tips, Google review policy, Consent Mode, taxes) — /home/user/coco-vanille-granby/research/18-dated-claims-verification.md — seen 2026-10-25
- plan-v0c §6, §9 and plan-v1 §4, §11 — /home/user/coco-vanille-granby/research/plan-v0c-site-ux-ordering.md — seen 2026-10-25
