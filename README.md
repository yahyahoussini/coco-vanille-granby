# Coco Vanille · planning and research repo

Planning and research for two sites of **Pâtisserie Coco Vanille** (3 rue Court, Granby, Québec; legal name « Pâtisserie Coco Vanille inc. »; Google Maps spells it « Pâtisserie Cocovanille »):

| Host | Role |
|---|---|
| `cocovanillegranby.com` | Public site: French at `/`, `/en/`, `/es/`, with ordering inside the site |
| `admin.cocovanillegranby.com` | **Coco Studio**, the admin: functional and easy for the owner and staff |

Both will be self-hosted on the owner's VPS. Goals, in order: SEO/AEO/GEO first, ordering inside the site, exceptional UI/UX (`research/requirements-2026-10-25.md`).

**Stage: plan and brainstorm only. There is no code yet.** When code starts, it is JavaScript only.

Operating model, "One-Man Empire": one operator (Yahya, the « Agence » role in research/16) plus systems and automation. This repo is the system's business intelligence: one facts file, one decision log, one risk register, one owner-question list. Persuasion stays ethical: real prices, real capacity, real reviews, never fake urgency (research/02 §7–§8, research/07).

---

## Start here

1. `research/00-master-concept.md`: the master concept.
2. `research/14-owner-questions.md`: what only the owner can answer, plus a ready-to-send message in Québec French.
3. `research/15-decisions-and-risks.md`: open choices with recommendations, and the risk register.
4. `research/12-plan-review.md`: the red-team of the owner plans and the 25 merged decisions (M1–M25).

## How the files are organised

- `research/requirements-2026-10-25.md` and `research/plan-*.md`: the owner's inputs, stored as provided by Yahya (formatting only). Their claims are reviewed in research/12 and research/18.
- `research/01`–`18`: one research track per file. Each has a method-and-limits header, a bottom line, the body, open items, a search queue and Sources. Numbers 09 and 13 are not used.
- `data/`: machine-readable twins of the research files (CSV, JSON).
- **Precedence:** files with a verification pass win over files without one; research wins over the owner plans (research/12 lists each conflict); research/12 §3 merged decisions bind until the owner overrules one in writing.
- **Labels used everywhere:** verified / conflict / unverified / needed (research/01) · Confirmed / Partly / Not found / Contradicted (research/06, 18) · **UNVERIFIED** = no source or a secondary one only · **UNVERIFIED (FC)** = flagged by the fact-check, not re-confirmed · **(est.)** = an estimate · **[[FACT NEEDED: …]]** = only the owner (or a professional) can supply it; the publish guard blocks it from going live.

## File index: research/

| File | What it holds | Searches · verification |
|---|---|---|
| `00-master-concept.md` | The master concept: verdict and definition of first, week-0 blockers, positioning, personas, page tree and slug set, 40 scored features, ordering flows, Coco Studio, design inputs, SEO/AEO/GEO system with the 61-row corrections ledger, tech and cost, One-Man Empire model, roadmap W0–W18 with gates G0–G18, risks and kill criteria, 13 topic sessions | 0 · consolidation |
| `01-business-facts.md` | Entity (NEQ 1177082220), NAP conflicts, six conflicting hour schedules, operating-status evidence, products, reviews, name collisions, Granby market, owner checklist | ~60 + 10 · Verification log |
| `02-customers-jtbd.md` | 8 personas and build order, journeys, objections → FAQ bank, Granby price landscape ($/portion), ethical behavioural levers and their legal limits | 0 + 16 (shared with 04) · Evidence pass |
| `03-competitors.md` | Granby and regional competitors, chains, published price anchors, listicle ownership, battle maps, legal gaps to exploit | ~60 · none |
| `04-keywords-demand.md` | Keyword universe, page tree P01–P38 with FR/EN/ES slugs, vocabulary rules, 88-question seed bank, seasonal plan Nov 2026 – Dec 2027, date computations | 0 + 16 (shared with 02) · Evidence pass |
| `05-serp-baseline.md` | Proxy SERP baseline 2026-W43 (17 of 33 prompts run), winnability scores, 10 priority prompts, candidate prompts X1–X20, Monday re-run protocol | budget ran out at C8 · none |
| `06-seo-aeo-geo-2026-verified.md` | 2026 platform facts (AI Overviews / AI Mode in Canada, StatCounter, Apple Business, Bing, GBP, Search Console, GA4, IndexNow, Content Signals, llms.txt, schema, crawlers, Merchant Center), plan changes, top 20 practices, owner self-tests T1–T5 | 25 + 8 · Verification log |
| `07-legal-quebec-compliance.md` | Loi 25, Charter of the French language, LPC, Competition Act, CASL, MAPAQ/CFIA allergens, GST/QST (QST change of 2026-07-15), design rules for site, checkout and Studio, tax decision table, questions for lawyer and accountant. Not legal or tax advice | 22 + 8 · Verification log |
| `08-ux-ui-inspiration.md` | Public-site references, mobile checkout evidence, pattern library, anti-patterns, the three creative directions vs the references, 14 moves | 20 + 5 · Verification log |
| `10-ordering-tech-architecture.md` | Payments in Canada, POS APIs, PCI scope, domain model, capacity engine, checkout, cake builder, notifications, kitchen sheet and labels, Merchant Center feed, tax line, server-side GA4, run cost, build vs buy | 10 · none |
| `11-offsite-local-citations.md` | Citation rules and sweep order, media and pitch list, partners, review engine (CASL), 20 video ideas, communities | 15 · Search log |
| `12-plan-review.md` | Red-team of the owner plans: issues A–G, merged decisions M1–M25, amended definition of "first", cut list for one operator, launch budget, corrected weeks 0–6 | 6 · none |
| `14-owner-questions.md` | Every owner-only question, grouped, with why, format and priority; Québec-French message with the top 15 | 0 · consolidation |
| `15-decisions-and-risks.md` | Decision log D1–D25, settled decisions, cross-file corrections, risk register R1–R34 | 0 · consolidation |
| `16-admin-dashboard-spec.md` | Coco Studio functional spec: roles, daily jobs, time budgets, 6 daily screens + « Cette semaine », guardrails G1–G20, notifications, automations, technical shape, MVP, acceptance criteria, owner ease-of-use test, open questions | 0 · none |
| `16a-admin-ux-inspiration.md` | Admin UX references (POS, KDS, ordering apps), pattern library, anti-patterns, notification design, offline handling, French-first UI, usability tests | flags inline as UNVERIFIED (FC); the "Verification log" it mentions is not in the file |
| `16b-admin-tech-subdomain.md` | Admin stack options A–G (Option B recommended), subdomain routing, noindex, real time, PWA, printing, security checklist, integration surfaces, JavaScript sketches | first search refused · Verification log (3 confirmed, 3 corrected, 16 unverified) |
| `17-vps-self-hosting-and-domain.md` | VPS architecture and sizing, nginx, blue/green deploys, staging, CDN decision, Loi 25 data location, Canadian providers, backups, operations, email, domain and DNS, monthly cost | ~30 + 6 · Verification log |
| `18-dated-claims-verification.md` | 22 dated or risky plan claims with verdicts, owner self-tests, required plan changes | 18 + 12 · adversarial pass + Completion pass |
| `19-build-workflow-and-requirements.md` | How the build runs (repo → CI → staging → VPS), build phases W0–W18, everything required from Yahya by week | 00, 10, 14–17 · no searches |
| `plan-v1-ranking-stack.md` | Main owner plan: the 21-layer Ranking Stack adapted to Coco Vanille, 30-prompt set, gates, timeline | owner input |
| `plan-v0a-master-plan.md` | Owner master plan: build, local dominance, ads-ready signals, social, Coco Studio | owner input |
| `plan-v0b-multilingual-local-domination.md` | Owner plan: multilingual layer and the 8 foundations of local domination | owner input |
| `plan-v0c-site-ux-ordering.md` | Owner's earlier draft: site, UX, ordering, local SEO, three creative directions | owner input |
| `requirements-2026-10-25.md` | Owner requirements: domains, admin focus, own VPS, plan-only stage, known identifiers | owner input |

## File index: data/

| File | Rows | What it holds | Twin of |
|---|---|---|---|
| `facts.json` | 66 facts + 21 `fact_needed` | Canonical entity draft (pending owner sign-off), sourced facts with status, verification log, search queue | 01 |
| `competitors.csv` | 45 | Competitors: ratings, address, category, online ordering, custom cakes, weddings, published prices, languages, listicles | 03 |
| `price-benchmarks.csv` | 35 | Published prices with size or portions and price basis | 02 |
| `keywords.csv` | 220 | Keywords: cluster, language, intent, target page, relative-demand prior (not volume), evidence URL | 04 |
| `seasonal-calendar.csv` | 45 | Occasions Nov 2026 – Dec 2027 with publish-by and pre-order dates | 04 |
| `prompts.csv` | 53 | 33 scored prompts (I1–I10, C1–C10, L1–L10, B1–B3) + 20 candidates (X1–X20) | 05 |
| `serp-baseline-2026-W43.csv` | 33 | Proxy baseline, one row per prompt (engine = WebSearch-proxy) | 05 |
| `inspiration.csv` | 57 | Public-site references: pattern to steal, what to avoid, SEO-safe flag | 08 |
| `directories.csv` | 34 | Citation targets: what each feeds, priority, cost, Coco Vanille status | 11 |
| `pitch-list.csv` | 16 | Media and listicle targets; contact routes still [[FACT NEEDED]] | 11 |
| `admin-inspiration.csv` | 96 | Admin UX references: pattern to steal, what to avoid | 16a |
| `backlog.csv` | 147 | Work backlog (LOC, CON, TSE, OFF, ORD, STU, DES, LEG, MEA, HOS). Columns: layer = v1 Ranking Stack layer L1–L21 (not prompt IDs), `ops` or `—`; phase_week = roadmap week (00 §13); seo_value / conversion_value / delight = 1–5 (est.); effort S/M/L; depends_on = ids separated by `;`; gate = 00 §13 G-gate, 16 §8.2 AC or a plain check; notes = sources | 00 |

## Research method and limits

- **WebSearch summaries only.** WebFetch and curl were blocked, so no page was opened directly. Every web fact comes from a search-result summary.
- **US-located.** Results are not a Granby-localized Google page: no map pack, no People Also Ask, no AI Overview was seen.
- **Not reachable:** Instagram, Facebook posts and Google Maps. GBP data appears only where directories mirror it; the Instagram handle @coco_vanillegranby never surfaced.
- **Semrush:** no API units were available, so no Semrush data was used (research/18 records "Semrush not used").
- **Search budget:** about 200 WebSearch calls per turn, shared by every agent. Several tracks hit it: 02 and 04 ran 0 searches in their main pass, 05 stopped at 17 of 33 prompts, 16b's fact-check search was refused. Each file lists its unrun queries in a search queue.
- **No demand volumes.** Keyword demand is a prior (high / medium / low), to replace with Keyword Planner, Search Console and a Granby PAA harvest.
- **Every fact is sourced or marked.** A URL in the file's Sources, or a label (UNVERIFIED, (est.), [[FACT NEEDED]]). Nothing marked goes into client copy.
- **No professional sign-off yet.** research/07 is a brief for a lawyer and an accountant to confirm.

## Not done yet

- **Design concept:** the three directions (A Atelier Vanille, B Coco Joyeux, C Maison des Cantons) are not judged yet; it is a later topic. research/08 §6 holds the evidence only.
- **SERP baseline:** the proxy covered 17 of 33 prompts; the other 16 have secondary evidence only.
- **AI-engine baseline:** not run (ChatGPT, Perplexity, Gemini, Claude, Copilot).
- **Granby phone baseline:** a human task from a phone in Granby (research/14 D1).
- **Operating status:** whether the shop is trading in October 2026 is unconfirmed (research/14 S1, S2).
- Owner answers (research/14), lawyer and accountant sign-offs (research/07 §8), the Payload plain-JavaScript spike (research/12 D5), and the search queue in each file.

## Next step

Topic sessions, **one topic per session**, starting with the **admin dashboard (Coco Studio)**. Its inputs: research/16, 16a, 16b, 10 §2, 07 §5, 00 §8, `data/admin-inspiration.csv`, decisions D5, D13, D16, D21 and D22 in research/15, and the group-D answers in research/14.

Send the message in research/14 §14 first. Planning can continue meanwhile; build work waits for the go/no-go on the shop's status (research/12 A1).
