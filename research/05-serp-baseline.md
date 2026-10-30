# 05 · SERP baseline (proxy) and prompt scoring — 2026-W43

As of 2026-10-25 (ISO week 2026-W43). Track: 30-prompt baseline + B1–B3, winnability scoring, wording fixes, candidate prompts (Ranking Stack Layer 7.6–7.7; plan §5).
Machine-readable twins: `data/serp-baseline-2026-W43.csv` (one row per prompt, engine = WebSearch-proxy) and `data/prompts.csv` (scored prompt set + candidates).

> **CAVEAT: read before using any number below.**
> - **This is a proxy baseline, not the baseline.** WebSearch runs **from the US** and returns a **summarized** list of links plus a generated answer. It is **not** a Google.ca results page localized to Granby. It shows no map pack, no featured-snippet box, no People Also Ask and no AI Overview, and its order is not a Google position.
> - **Coverage: 17 of 33 prompts were run** (I1–I10, C1–C7). The shared WebSearch budget (200 calls per turn across all agents) ran out at C8. The other **16 prompts (C8–C10, L1–L10, B1–B3) were NOT run.** Their rows hold **secondary evidence** from same-day searches by the business-facts track (`research/01-business-facts.md`) and the competitor track (`research/03-competitors.md`). Those are labelled "secondary"; none of it is a measurement of that exact prompt.
> - No AI engine (ChatGPT, Perplexity, Gemini, Claude, Copilot) was queried, so the GEO baseline and B3 are empty.
> - **Mandatory human re-run (first Monday task):** (1) the 33 prompts from a phone in Granby; (2) the same through a SERP API with the location set to Granby, Québec; (3) the 5 AI engines (§9). Until then, every score below is **provisional**.

---

## 0. Bottom line (decision-relevant)

1. **The answer engine had no local source in 10 of 17 runs.** It said so explicitly on I1, I5, I8, I10, C2, C3, C4, C5, C6 and C7: no Granby price, no Granby cake shop, no Eastern Townships wedding baker, no local bûche, macaron or gluten-free result. The first dated, sourced, local passage for each of these is unclaimed. This is the core AEO/GEO opening.
2. **The brand appeared in only 2 of 17 runs**, both times through a directory and with the Google-mirror spelling **"Cocovanille"**:
   - C1 « meilleure pâtisserie à Granby »: the RestoMontreal page ranks first in the list, and the summary names Cocovanille first.
   - I1: the RestoMontreal FR page at #7.
   - No run surfaced an owned site, Facebook or Instagram.
3. **A wrong fact is already spreading.** The C1 answer says Cocovanille is « ouverte du mercredi au dimanche ». That matches the RestoMontreal schedule. 01-business-facts judged that schedule older: the most probable recent one is Thu–Sat (4 sources, newest 2025-08-20). → Fix it at the source (the GBP, then RestoMontreal) before the build (rank-first `16-market-intelligence.md` §9).
4. **French informational prompts are owned by France, not Québec.** I2–I7 and C4 were dominated by France, Belgium or Switzerland pages (content farms, blogs, wedding directories, price PDFs in euros). I1 was mixed: Québec directories plus French € price PDFs. No Québec bakery answers any of them. A Québec-French answer page with CAD prices and inch sizes would face weak pages. Google.ca with a Granby location may differ: re-check.
5. **The top 10 is weak, so winnability scores are high across the board.** 31 of 33 prompts score ≥ 14/20. The limit is not competition. It is **Coco Vanille's unconfirmed facts**:
   - operating status, hours and prices
   - lead times
   - whether it offers weddings, bûches, macarons, gluten-free or corporate boxes (01 found **no evidence** for any of these)

   12 prompts are gated on those facts (§5).
6. **Granby's own competitor sites (cakegranby.ca, avecungranda.com, rosegateaux.com) surfaced in 0 of 17 proxy runs.** They did appear in the competitor track's targeted searches. Either the US proxy hides them or they are weak on these exact phrasings. Only the Granby re-run can tell.
7. **"Granby" collides with US towns.** US Granby pages (Zola Granby VT/MA, a US newspaper, a US history site) surfaced in 4 of 17 runs (I1, C1, C2, C7). Every EN title and every AI-facing fact must say "Granby, Québec" / "Granby, QC".
8. **Spanish has no content at all.** I10 (quinceañera cake) returned zero Spanish-language pages. ES prompts are the cheapest uncontested answers, but at low volume. Treat them as a side lane, not the 10.
9. **The 10 priority prompts are:** L3, C1, C2, C8, L1, I3, I1, I2, L9, L2 (§6). C4 (bûche) jumps to #1 for Nov–Dec **only if** the owner confirms bûches by 2026-11-01.

---

## 1. Method and definitions

| Item | Value |
|---|---|
| Engine | WebSearch (standard mode), US-located, summarized; `engine = WebSearch-proxy` in the CSV |
| Query | prompt text verbatim; no "Québec" added (the ambiguous prompts already carry "Granby", "Québec" or "Quebec") |
| Order recorded | order of the returned link list (≈ 9–10 links). **Not a Google position.** |
| `google_position` | rank of a Coco Vanille **owned** domain in that list → `none` (no owned domain exists, per 01) |
| `snippet_owner` | proxy: the domain the generated answer drew its main answer from; `none (gap)` when the answer said nothing local was found |
| `ai_overview_cited`, `map_pack` | `not_observable` (WebSearch shows neither) |
| `brand_named` / `brand_position` | yes/no; rank of the first link whose page names the brand |
| Not-run rows | measurement columns left empty; `notes` starts with `NOT_RUN` and carries the secondary evidence |
| Scoring | plan §5 rubric, 1–5 on each of 4 questions, total /20. Prompts ≥ 14 get worked first (rank-first `04-research-prompts.md` §7) |

---

## 2. Per-prompt findings: the 17 prompts run

Domains are in surfaced order (duplicates collapsed). "CV" = Coco Vanille.

| ID | Prompt | Domains surfaced (order) | CV? where | Dominant owner type | Winning format | Answer-style content seen |
|---|---|---|---|---|---|---|
| I1 | combien coûte un gâteau de fête personnalisé à Granby | threebestrated.ca (FR « pâtisseries » list) · cdn.website.dish.co (×2, France price PDFs, €) · pagesjaunes.fr · propoptions.co.uk · collections.banq.qc.ca · **restomontreal.ca (CV page)** · zola.com (Granby **VT**, ×2) | **yes, #7** (RestoMontreal FR); the answer says "prix raisonnables… gâteaux sur mesure", no amount | directory/listicle | directory | **Gap:** "Je n'ai pas trouvé de tarifs précis… à Granby". It falls back to a French €7.50/part example (min 12 parts, 15 days' notice, 30% deposit) |
| I2 | combien de jours d'avance commander un gâteau personnalisé | fr.igraal.com (×2) · mariages.net · lepetitjournal.com · jotform.com · abcsalles.com · form.jotform.com · tally.so · royalcaribbean.com · cdn.website.dish.co | no | France review/wedding sites, forms | guide + price PDF | Direct answer from the dish.co PDF: 15 days (1 tier), 21 days (2 tiers), 30 days (pièce montée); wedding 3–6 months (abcsalles) |
| I3 | quelle grosseur de gâteau pour 20 personnes | synonyme-du-mot.com · wwwstag.nelson-atkins.org · digilib.ucr.edu · nigella.com · cakecentral.com · forums.thebump.com | no | content farm + parasite pages (inferred) + forums | size→portions **table** | Table answer: 26 cm round ≈ 14–18 people (16–20 parts); a 10-in pan serves 16–20 (EN guide) |
| I4 | comment transporter un gâteau à étages en auto | fluxdeconnaissances.com · lematin.ma · c-and-a.com (fr/ch/be) · codestream.fullstackacademy.com · cater4you.co.uk · cakecentral.com | no | content farm, clothing retailer, forum | how-to list | Bullet answer: car trunk, non-slip mat, dowels, stack the top tier on site. The summary itself flags the sources as "de qualité inégale" |
| I5 | prix d'un gâteau de mariage par portion au Québec | desjardins.com · collections.banq.qc.ca · abcsalles.com · etsy.com · jotform.com | no | bank advice page (2014) + France | guide | **Gap:** the only Québec figure is Desjardins 2014 ($600 cake, $5–7/portion). "aucune source récente" |
| I6 | différence entre crème au beurre et ganache sur un gâteau | dubocalalassiette.fr · sweetlycakes.com · vitrinelinguistique.oqlf.gouv.qc.ca | no | France blogs + OQLF definition | definition / comparison | Definitions. The summary calls the OQLF entry the most reliable |
| I7 | comment conserver un gâteau à la crème jusqu'au lendemain | synonyme-du-mot.com · croq-kilos.com · dubocalalassiette.fr · collections.banq.qc.ca | no | content farm | how-to | Answer: fridge, covered, take it out 30 min before serving, < 48 h for pastry cream. "sans avis d'experts en sécurité alimentaire" (no government source surfaced) |
| I8 | how much does a custom birthday cake cost in Quebec | weddingwire.ca · tastet.ca (Montréal birthday-cake list, ×5 region variants) · new.risingsunartscentre.org · weddingwire.ca | no | wedding directory + Montréal food media + parasite cost guide | listicle | **Gap:** "didn't turn up Quebec-specific prices". US range $60–700+ (parasite page); Émotions Gâteaux cupcake from $8 |
| I9 | how far in advance to order a wedding cake | kb.rashmisbakery.com · easyweddings.com.au · rashmisbakery.com · help.rashmisbakery.com · forums.theknot.com · weddingwire.com · patisserie-valerie.co.uk · commons.open.uci.edu | no | **bakery help-centre FAQ** (one bakery holds 3 of the top 4) + forums | FAQ page per question | "Several months"; 2–3 weeks minimum (custom); 20–30% deposit (forum) |
| I10 | cuánto cuesta una torta de quinceañera en Quebec | mtlblog.com · weddingwire.ca · app.bridebook.com · ricardocuisine.com · wedding-guide.bridebook.com · bc.jobbank.gc.ca · clarksvillenow.com · npr.org | no | EN wedding guides; **0 Spanish pages** | guide | **Gap:** "No encontré un precio específico… en Quebec". Falls back to Bridebook Canada wedding tiers (2 tiers CA$350–900) and a US $4/portion anecdote |
| C1 | meilleure pâtisserie à Granby | **restomontreal.ca (CV vote page)** · restomontreal.ca (Mont Rose) · threebestrated.ca (FR pâtisseries; FR boulangeries) · en.wikipedia.org · collections.banq.qc.ca · granbydrummer.com (US) | **yes, #1** (RestoMontreal); also #4 via the TBR boulangeries list (CV #2 there, per 03) | local directories/listicles | directory | Answer lists **Cocovanille first** (4.8, "ouverte du mercredi au dimanche", a likely outdated schedule), then Mont Rose, Cake Design, Pain-Pain. Calls the lists "peu fiables" |
| C2 | meilleur gâteau de fête à Granby | tastet.ca (Montréal list, ×3) · collections.banq.qc.ca · fpc-dev.cron.cl · zola.com (Granby **MA**) · islaguru.com · granbydrummer.com (US) | no | Montréal food media | listicle | **Gap:** "pas de palmarès local pour les gâteaux de fête dans cette ville". Suggests Montréal shops "à plus d'une heure" |
| C3 | pâtisserie gâteau de mariage Cantons-de-l'Est | mariages.net (×6; a /lorraine region page suggests France-focused, UNVERIFIED) · weddingwire.ca · thecanadianencyclopedia.ca · quoifaire.com | no | wedding directories | directory | **Gap:** "didn't turn up a wedding cake pastry shop based in the Cantons-de-l'Est". Only a Gâteau Mania decorating workshop (quoifaire) |
| C4 | bûche de Noël Granby | vitrinelinguistique.oqlf.gouv.qc.ca · fr.vikidia.org · substack · lalibre.be · barry-callebaut.com · tendanceouest.com · dhnet.be · parismatch.be · blick.ch | no | OQLF + European press | definition / press | **Gap:** "didn't return anything specific to Granby". OQLF definition only |
| C5 | macarons Granby avis | tastet.ca (Montréal macarons) · en.wikipedia.org · fr.trustpilot.com (×2, non-local brands) · cs.grinnell.edu / autry.cs.grinnell.edu (parasite PDFs, inferred) · restomontreal.ca (Granby delivery list) · vancouverchristmasmarket.com | no | Montréal media + review platform | listicle | **Gap:** no Granby macaron reviews. The summary notes the Tastet guide was "made with Tourisme Granby région" |
| C6 | gâteau sans gluten Granby | cinqfourchettes.com · pardonyourfrench.com · cuisinelangelique.com · cookidoo (×2) · iletaitungateau.com · fpc-dev.cron.cl · thetvdb.com · atly.com (gluten-free dinner, Granby) | no | recipe sites | recipe | **Gap:** no GF bakery found. Only atly.com lists GF restaurants (Resto mangeZen, Brasserie Daniel Lapointe) |
| C7 | prix gâteau de mariage Granby | collections.banq.qc.ca · threebestrated.ca (FR pâtisseries) · etsy.com · data.bnf.fr · wix.com · fr.hespress.com · bridebook.com · historysoft.com (US Granby) | no | archives + TBR | directory | **Gap:** "didn't find any actual prices for wedding cakes in Granby". Names Cake Design Granby (TBR) without a price |

---

## 3. The 16 prompts not run: secondary evidence (other tracks, same day)

Not measurements. Each row needs the Granby re-run.

| ID | Prompt | Secondary evidence | Source (track) |
|---|---|---|---|
| C8 | best bakery in Granby Quebec | TBR "3 Best Bakeries in Granby": Pain-Pain #1 (**closed 2026-06-16**), **CV #2**, Mélisse #3. Yelp bakeries Granby (Oct 2026 snapshot): Pain-Pain first, CV not in the snippet. RestoMontreal "Best Bakeries in Granby": Mélisse, CV | 03 §4; La Voix de l'Est 2026-06-16 |
| C9 | wedding cake bakery Eastern Townships | WeddingWire.ca Sherbrooke shows 2 results (Extra Cakes). No Granby, Bromont or Magog vendor. Mlles Gâteaux (Montréal) surfaced for Bromont/Sherbrooke wedding searches | 03 §0.5, §3 |
| C10 | mejor pastelería en Granby Quebec | No ES page surfaced for any Granby competitor (inferred). The I10 run returned 0 Spanish pages | 03 §1 note; I10 |
| L1 | pâtisserie près de moi (phone in Granby) | Cannot be measured from the US at all. CV's RestoMontreal page carries "may be temporarily closed"; if that mirrors the GBP, it suppresses the pack (inference, 01) | 01 §4 |
| L2 | commander un gâteau de fête en ligne Granby | Cake Design Granby: cart with pickup date/time. Avec un Grand A: online ordering with prices, 48 h lead time. Maître Glacier Granby: ice-cream cakes with add-to-cart | 03 §1–2 |
| L3 | gâteau pour demain Granby | **CV: "order by phone, ready next day"** (TBR, 2025 listing). Délices Sucrés Granby promises last-minute orders | 01 §5; 03 §1 |
| L4 | pâtisserie ouverte dimanche Granby | CV Sunday: open 9:00–17:00 (RestoMontreal) **vs** closed (TBR, Allbiz, Wanderlog, find-open, Chamber of Commerce). Mont Rose keeps late hours | 01 §3; 03 §1 |
| L5 | café et pâtisserie près du Zoo de Granby | Tastet's Granby list (made with Tourisme Granby région) has no bakery. Distance from 3 rue Court to the Zoo: [[FACT NEEDED]] | 03 §4; 01 §9.5 |
| L6 | chocolatines Granby | Croissants (incl. almond) appear in CV reviews; chocolatines are not evidenced | 01 §5 |
| L7 | boîte de pâtisseries pour réunion Granby | Le Marmiton (caterer) sells priced cupcake boxes of 6 and 12. No CV corporate offer found | 03 §1; 01 §5 |
| L8 | bakery near Granby Zoo | as L5 | — |
| L9 | order custom cake online Granby | No EN ordering page surfaced for any Granby competitor (inferred) | 03 §1 note |
| L10 | torta de cumpleaños personalizada Granby | as C10 | — |
| B1 | Pâtisserie Coco Vanille Granby avis | Google 4.9 (40+) as of 2026-08-01 via RestoMontreal; TBR 4.8 (115); RestoMontreal 4.8 (22); Chamber 5.0 (11); Wanderlog 5.0 (21, page titled "Magog"); Tripadvisor snapshots conflict | 01 §6; 03 §1 |
| B2 | Coco Vanille Granby heures | 6 conflicting schedules across directories. The C1 run already repeats "mercredi au dimanche" | 01 §3; C1 |
| B3 | « Que sais-tu de la Pâtisserie Coco Vanille à Granby ? » / "What is Pâtisserie Coco Vanille in Granby known for?" | AI engines not run. Entity-merge risks: choco.vanille (Le Marmiton, Granby), Coco Vanille perfume, a closed Coco Vanille in Bras-Panon (La Réunion), Wanderlog "Magog" | 01 §8 |

---

## 4. Patterns: who owns what (17 runs)

| Owner type | Runs present | Examples | What it means for us |
|---|---|---|---|
| France/Belgium/Swiss FR content | 8 (all of I1–I7, C4) | synonyme-du-mot.com, dubocalalassiette.fr, sweetlycakes.com, abcsalles.com, mariages.net, cdn.website.dish.co PDFs, lalibre.be | Québec-French answers (CAD, inches, « gâteau de fête », « en auto ») have no local rival. Real-phrasing pages win on relevance |
| Wedding directories | 8 (I1, I2, I8, I9, I10, C2, C3, C7) | weddingwire.ca, mariages.net, zola.com (US), bridebook, easyweddings.com.au | They own wedding intent. A WeddingWire.ca profile makes sense **only if** weddings are offered [[FACT NEEDED]] |
| Parasite / spam pages (inferred from URL patterns) | 7 (I3, I4, I8, I9, C2, C5, C6) | wwwstag.nelson-atkins.org, digilib.ucr.edu, commons.open.uci.edu, cs.grinnell.edu, codestream.fullstackacademy.com, fpc-dev.cron.cl | Weak top 10: a real, signed, dated page beats them |
| Archive scans | 6 (I1, I5, I7, C1, C2, C7) | collections.banq.qc.ca, data.bnf.fr | Thin local web content: the index falls back on old newspaper scans |
| Encyclopedic / official | 6 (I6, I10, C1, C3, C4, C5) | OQLF Vitrine linguistique, Wikipedia, Vikidia, Canadian Encyclopedia, Job Bank | Cite OQLF and official sources inside our answers (information gain + trust) |
| Local directories / listicles | 5 (I1, C1, C5, C6, C7) | restomontreal.ca, threebestrated.ca, atly.com | **The only surfaces that name CV.** Fix facts there and get on the "cakes / pâtisseries" lists |
| Montréal food media | 3 (I8, C2, C5) | tastet.ca | Engines fill the Granby gap with Montréal names. Tastet works with Tourisme Granby région (C5 summary), so it is a pitch target |
| Forums / UGC | 3 (I3, I4, I9) | cakecentral.com, forums.theknot.com, forums.thebump.com | Informational, global EN |
| Bakery help-centre FAQ | 1 (I9) | rashmisbakery.com (3 of the top 4 links) | **Model to copy:** one question, one short answer page (or one H2 + passage), indexable |
| Granby competitor own sites | **0** | (cakegranby.ca, avecungranda.com not surfaced) | Confirm in the Granby re-run |
| Facebook / Instagram / YouTube | **0** | — | Social does not carry these prompts in this proxy. The owned site + GBP must |
| US "Granby" pages | 4 (I1, C1, C2, C7) | zola.com Granby VT/MA, granbydrummer.com, historysoft.com | Always write "Granby, Québec" / "Granby, QC" |

---

## 5. Winnability scores (all 33)

Rubric (plan §5): **W** = weak pages in the top 10? **A** = authority within reach? **S** = a surface we can win now? **B** = is the searcher a buyer? Each 1–5; total /20. **prov.** = not run, scored from secondary evidence.

Priority: **P1** = the 10 priority prompts (§6). **P2** = ≥ 14 but gated on an unconfirmed offer, low volume, or low buyer value. **P3** = < 14. **B** = brand defence.

| ID | W | A | S | B | /20 | Tier | Justification (brief) |
|---|---|---|---|---|---|---|---|
| I1 | 4 | 4 | 4 | 4 | **16** | P1 | No Granby price surfaced (€ PDFs, US pages). Locally, Cake Design may show its $5/portion (03), hence W = 4. A dated table can own the answer |
| I2 | 5 | 4 | 4 | 3 | **16** | P1 | France forms and review pages; a number-based answer block wins the snippet. A pre-purchase planner |
| I3 | 5 | 4 | 5 | 3 | **17** | P1 | Content farm + parasite pages; the table snippet + calculator tool is the plan's link earner |
| I4 | 5 | 5 | 4 | 2 | 16 | P2 | Very weak pages, but post-purchase; it supports trust, not orders |
| I5 | 5 | 3 | 4 | 3 | 15 | P2 · gated weddings | Desjardins (high authority) but 2014 data; a fresh dated survey wins. Weddings unconfirmed |
| I6 | 4 | 3 | 4 | 2 | 13 | P3 | Decent France blogs + OQLF; educational |
| I7 | 5 | 4 | 4 | 2 | 15 | P2 | Content farm; no food-safety authority surfaced (cite MAPAQ / Health Canada: [[FACT NEEDED: exact guidance + URL]]). Post-purchase |
| I8 | 4 | 3 | 4 | 4 | 15 | P2 | No Québec price page; Tastet and WeddingWire are strong domains; the EN audience in Granby is small (01: EN mother tongue ~2%) |
| I9 | 3 | 2 | 3 | 3 | 11 | P3 · gated | Global EN competition (The Knot, WeddingWire, bakery FAQs); weddings unconfirmed |
| I10 | 5 | 5 | 4 | 3 | 17 | P2 · ES lane, gated | Zero Spanish content. Quinceañera offer unconfirmed; low volume |
| C1 | 4 | 4 | 5 | 5 | **18** | P1 | CV is already named first via RestoMontreal; stale lists (closed #1 on TBR); defend + fix facts |
| C2 | 5 | 4 | 4 | 5 | **18** | P1 | No Granby page surfaced; the beachhead prompt |
| C3 | 5 | 4 | 3 | 5 | 17 | P2 · gated weddings | No ET vendor surfaced; the surface is a directory profile + page |
| C4 | 5 | 4 | 5 | 5 | 19 | P2 · conditional (→ P1 Nov–Dec if confirmed) | Nothing local; seasonal pre-order; GBP products/posts winnable without site authority. Bûches unconfirmed (01) |
| C5 | 5 | 4 | 4 | 4 | 17 | P2 · gated macarons | Trustpilot pages of non-local brands; macarons unconfirmed for CV (Cake Design sells them, per the C1 summary) |
| C6 | 5 | 5 | 3 | 4 | 17 | P2 · gated + legal | Recipes only; a "sans gluten" claim needs a controlled process + labelling review [[FACT NEEDED: legal track]] |
| C7 | 5 | 4 | 4 | 5 | 18 | P2 · gated weddings | No prices anywhere; high value if weddings are real |
| C8 | 4 | 4 | 5 | 4 | **17** | P1 · prov. | CV is #2 on TBR behind a closed #1; refresh request + Yelp claim |
| C9 | 5 | 4 | 3 | 5 | 17 | P2 · prov., gated | Empty regional board (2 Sherbrooke results) |
| C10 | 5 | 5 | 4 | 4 | 18 | P2 · prov., ES lane | No ES pages; low volume |
| L1 | 3 | 4 | 5 | 5 | **17** | P1 · prov. | The pack is GBP-driven (pages matter less, hence W = 3); 4.9 rating; status flag risk |
| L2 | 2 | 4 | 3 | 5 | **14** | P1 · prov. | Rivals have working carts (Cake Design, Avec un Grand A, Maître Glacier); our ordering ships weeks 11–12; core goal |
| L3 | 5 | 5 | 4 | 5 | **19** | P1 · prov. | No dedicated page surfaced; CV's documented next-day service is a real differentiator (confirm it still holds) |
| L4 | 4 | 4 | 4 | 5 | 17 | P2 · prov., gated hours | Dead if CV is closed on Sunday (5 of 6 sources say closed) |
| L5 | 4 | 4 | 3 | 4 | 15 | P2 · prov. | Proximity-driven pack; distance to the Zoo unknown |
| L6 | 5 | 5 | 4 | 4 | 18 | P2 · prov., gated | Likely an empty SERP; chocolatines not evidenced (croissants are) |
| L7 | 4 | 4 | 3 | 5 | 16 | P2 · prov., gated | Corporate boxes unconfirmed; Le Marmiton (caterer) is the rival |
| L8 | 4 | 4 | 3 | 4 | 15 | P2 · prov. | As L5, EN tourists |
| L9 | 4 | 4 | 3 | 5 | **16** | P1 · prov. | No EN ordering page in Granby (inferred); mirrors L2 |
| L10 | 5 | 5 | 4 | 5 | 19 | P2 · prov., ES lane | No ES pages; clear buyer intent, low volume |
| B1 | 4 | 5 | 5 | 4 | 18 | B · prov. | Third-party directories with conflicting ratings own it; a site + GBP win the brand SERP |
| B2 | 4 | 5 | 5 | 5 | 19 | B · prov. | Conflicting hours are a lead-losing bug; the GBP is the master record |
| B3 | 4 | 5 | 4 | 3 | 16 | B · prov. | Entity-merge risk; the About page as source of truth + sameAs |

Reading: high totals reflect an **empty local web**, not easy wins on Maps. Authority is still a new domain with zero links: expect months, not weeks (plan §2).

---

## 6. The 10 priority prompts: current owner and counter-move

Selection rule:
- score ≥ 14;
- an offer that is **evidenced or partly evidenced** for CV (01 §5);
- a material audience (FR, or EN visitors);
- then by score, tie-broken on buyer intent (rank-first: "buyer intent beats volume").

L2 is kept at 14 because ordering is the project's goal.

| # | ID | Prompt | Score | Current owner (proxy / secondary) | Why they win | Counter-move (better page, profile, proof) | Blocking fact |
|---|---|---|---|---|---|---|---|
| 1 | L3 | gâteau pour demain Granby | 19 prov. | Not measured. Secondary: Délices Sucrés Granby (one-page Canva site promising last-minute orders) | Nobody has a page for the intent (to confirm) | Cluster "gâteau pour demain": an answer block « Commandez avant [[heure]] pour le lendemain », the list of next-day sizes and flavours, phone + order button, a GBP post and product. **Only if true** | [[FACT NEEDED: next-day policy, cut-off hour, sizes]] |
| 2 | C1 | meilleure pâtisserie à Granby | 18 | restomontreal.ca (CV page #1, Mont Rose #2); threebestrated.ca (FR « pâtisseries » list **without** CV; « boulangeries » with CV #2) | Directories with ratings; listicle intent | **Defend:** remove the "may be temporarily closed" signal at the GBP; one set of hours everywhere (the wrong "mercredi au dimanche" is already repeated); claim RestoMontreal + TBR; apply to the TBR cakes/pâtisseries list with photos and review count; home page with the category sentence + key-facts block; reviews naming « pâtisserie » + products (ethical asks only) | [[FACT NEEDED: open in Oct 2026? current hours]] |
| 3 | C2 | meilleur gâteau de fête à Granby | 18 | tastet.ca (Montréal birthday-cake list). No Granby page surfaced. Locally likely cakegranby.ca (03) | Media authority; no local list exists | Pillar `/gateaux-personnalises-granby/` with a birthday section (fold per the plan's overlap test); a dated price table; real photos; FAQ; the comparison page; pitch Tastet / Tourisme Granby région with a price survey (data study) | [[FACT NEEDED: custom-cake range, prices]] |
| 4 | C8 | best bakery in Granby Quebec | 17 prov. | threebestrated.ca (ghost #1 Pain-Pain, closed 2026-06-16; CV #2); Yelp | Stale listicles | TBR refresh request with the closure articles (never ask to remove a live rival); claim Yelp with the right categories; `/en/` home titled "… Granby, Quebec" | none (act now) |
| 5 | L1 | pâtisserie près de moi | 17 prov. | Map pack: unmeasured | Proximity + prominence (GBP) | GBP: primary category, hours, products, photos, weekly posts, 24 h review replies; `/nous-trouver/` with directions from landmarks; monthly local grid | [[FACT NEEDED: GBP owner access, status, categories]] |
| 6 | I3 | quelle grosseur de gâteau pour 20 personnes | 17 | synonyme-du-mot.com (content farm), nigella.com, forums, parasite pages | A simple size→portions table | `/calculateur-portions-gateau/`: a server-rendered table in **inches and cm**; a 40–60-word answer under the question H2 using CV's own portion standards; a "taller cake = thinner slices" note; FAQ. The plan's link-earning tool | [[FACT NEEDED: CV portion standards per pan size]] |
| 7 | I1 | combien coûte un gâteau de fête personnalisé à Granby | 16 | threebestrated.ca (cake list: Cake Design, Rose Gâteaux, Avec un Grand A); € PDFs. Answer: "no Granby price found" | No one answers with a local price | `/prix/`: a dated table (size → portions → $ → lead time) + "ce qui change le prix" + taxes stated; GBP products with prices; a ≈150-word dated passage for AI citation | [[FACT NEEDED: price grid]] |
| 8 | I2 | combien de jours d'avance commander un gâteau personnalisé | 16 | France pages (igraal, mariages.net, abcsalles, dish.co lead-time PDF) | A number-based answer (15/21/30 days) | Pillar section « Délais »: a table by cake type (next-day / standard / tiered), Québec phrasing, CV's real numbers; reuse it in GBP Q&A-style posts | [[FACT NEEDED: lead times]] |
| 9 | L9 | order custom cake online Granby | 16 prov. | No EN ordering page surfaced in Granby (inferred) | — | `/en/custom-cakes-granby/` + the EN order flow (weeks 11–12); until then an EN request form with labelled fields | [[FACT NEEDED: EN service capacity]] |
| 10 | L2 | commander un gâteau de fête en ligne Granby | 14 prov. | cakegranby.ca (cart + pickup slot), avecungranda.com (prices, 48 h), granby.maitreglacier.com (add to cart) | Working carts with visible prices | An order flow that shows the price before checkout; a pickup-slot picker bound to real hours; a written confirmation + flavour/photo recap (designs out the one public complaint, 01 §6); a GBP "order" link. Interim (weeks 3–6): phone + labelled request form | [[FACT NEEDED: POS, pickup hours]] |

Conditional and side lanes:
- **C4 bûche de Noël Granby (19):** if the owner confirms bûches by **2026-11-01**, it becomes #1 for Nov–Dec. A new domain will not rank in six weeks, so win it on the GBP (products + posts), Facebook and a pre-order page. Retire it on 12-26.
- **ES lane (I10, C10, L10):** uncontested. Ship with the core ES pages (plan §6), quinceañera only if offered.
- **Wedding set (I5, I9, C3, C7, C9):** frozen until wedding capacity is confirmed (03 §7 recommends the narrowed category sentence).

---

## 7. Wording fixes (keep IDs; add variants to the Monday run)

Evidence-based where marked; the rest are hypotheses to validate with autocomplete, PAA and Search Console `queries`.

| ID | Current | Proposed variant(s) | Evidence | Status |
|---|---|---|---|---|
| C1 | meilleure pâtisserie à Granby | add X1 « pâtisserie Granby », X2 « boulangerie Granby » | TBR keeps two separate lists: FR « pâtisseries » (cake shops, no CV) vs « boulangeries » (CV #2), and both surfaced for C1 | evidence |
| C2 | meilleur gâteau de fête à Granby | keep (Québec « fête » = birthday); add X3 « gâteau d'anniversaire Granby » | Québec sources use both: Tastet « meilleurs gâteaux d'anniversaire » (C2 run); Le Marmiton (Granby) « gâteau d'anniversaire ou d'événement personnalisé » (01) | evidence |
| C3 | pâtisserie gâteau de mariage Cantons-de-l'Est | add « gâteau de mariage Estrie », « gâteau de mariage Granby » | The Cantons-de-l'Est query returned France-centric mariages.net pages. La Haute-Yamaska is administratively in Estrie since 2021-07-28 (Statistique Québec, via 03) | evidence (variant volume unknown) |
| C5 | macarons Granby avis | test « macarons Granby » (bare) | "avis" pulled Trustpilot pages of non-local brands | evidence |
| I2 | combien de jours d'avance commander un gâteau personnalisé | add « combien de temps d'avance pour commander un gâteau de fête » | The results were France-dominated ("délai de réservation", "quand commander") | hypothesis |
| I3 | quelle grosseur de gâteau pour 20 personnes | keep « grosseur » (Québec usage, UNVERIFIED this session); add X13 « gâteau 8 pouces combien de portions » | The results answered in cm (France) and inches (EN guide); Cake Design Granby states sizes in inches ("1 tier, 7 in", 03) | partial |
| I4 | comment transporter un gâteau à étages en auto | keep « en auto »; use « en voiture » once in the body | France pages say « coffre arrière de la voiture » (I4 run) | evidence |
| L6 | chocolatines Granby | keep; add X7 « croissants Granby » | Croissants are evidenced in CV reviews (01). « chocolatine » as Québec usage: UNVERIFIED this session | partial |
| I10 · C10 · L10 | torta / pastelería | add variants with « pastel », « ponqué », « quince años », « panadería » (X17–X20) | I10 returned 0 Spanish pages. Colombia is a main origin of Granby's Latin-American residents (535 Colombian-born, 2021, per 01). Regional vocabulary claims are **UNVERIFIED** (no source this session) | hypothesis |
| EN prompts (I8, C8, C9, L8, L9) | — | always include "Quebec" or "QC" | US Granby pages surfaced in 4 of 17 runs | evidence |
| B1–B3 | Coco Vanille | add "Cocovanille" variants (e.g. « Pâtisserie Cocovanille Granby ») | Google Maps and its mirrors use "Cocovanille" (01); both answers naming the brand used "Cocovanille" | evidence |

---

## 8. Candidate prompts (new IDs; existing IDs unchanged)

Unscored until the Granby re-run (they sit as `type=candidate` in `data/prompts.csv`).

| ID | Lang | Prompt | Intent | Why (evidence) |
|---|---|---|---|---|
| X1 | FR | pâtisserie Granby | local/commercial | the plan's "widen" step 1; the TBR FR « pâtisseries » list decides it (C1 run, 03) |
| X2 | FR | boulangerie Granby | local | CV is #2 on the TBR « boulangeries » list (C1 run, 03); breads/baguettes are evidenced (01) |
| X3 | FR | gâteau d'anniversaire Granby | commercial | Tastet + Le Marmiton phrasing (§7) |
| X4 | FR | gâteau personnalisé Granby | commercial | the plan's pillar prompt (§6 fan-out) |
| X5 | FR | gâteau sur mesure Granby | commercial | Cake Design's « Gâteaux sur mesure » product page (03) |
| X6 | FR | pâtisserie française Granby | commercial | CV sells French classics (Paris-Brest, almond croissants, 01); Wikipedia "Pâtisserie" / Cédric Grolet surfaced for C1 |
| X7 | FR | croissants Granby | local | almond croissants in reviews (01) |
| X8 | FR | croissant aux amandes Granby | local | 01 §5 |
| X9 | FR | Paris-Brest Granby | commercial | 01 §5 |
| X10 | FR | vol-au-vent Granby | commercial | "order by phone ahead" tip (Wanderlog, via 01) |
| X11 | FR | gâteau de fête livraison Granby | transactional | RestoMontreal Granby delivery list surfaced (C5); Uber Eats "bakery Granby" list exists (03); CV delivery [[FACT NEEDED]] |
| X12 | FR | café pâtisserie centre-ville Granby | local | ~10 seats + coffee (01); the downtown opening was mentioned by La Voix de l'Est (03) |
| X13 | FR | gâteau 8 pouces combien de portions | informational | inch sizing in Granby (03); I3 fan-out |
| X14 | EN | what size cake for 20 people | informational | the EN guide answered I3 ("10-in serves 16–20") |
| X15 | EN | wedding cake Bromont | commercial | widen step 2 (plan §1); Si Petit Soit-il (Bromont) + Mlles Gâteaux surfaced for Bromont wedding searches (03). Gated |
| X16 | FR | gâteau de mariage Bromont | commercial | as X15. Gated |
| X17 | ES | torta de cumpleaños Granby | local | shorter L10; ES lane |
| X18 | ES | ponqué de cumpleaños Granby | local | Colombian-community hypothesis (UNVERIFIED phrasing) |
| X19 | ES | pastel de cumpleaños personalizado Granby | local | the plan's ES category sentence uses « pasteles » |
| X20 | ES | panadería en Granby Quebec | local | "bakery" variant for C10 (UNVERIFIED phrasing) |

---

## 9. Monday re-run protocol (replaces this proxy)

1. **Phone in Granby** (downtown), Chrome incognito, location on, google.ca. For each of the 33 prompts (+ X1–X20), record:
   - map pack top 3
   - organic top 10 domains
   - snippet owner
   - first 4 PAA questions
   - AI Overview present? and its cited domains

   Use FR UI for FR prompts, EN for EN, ES for ES. Save as `data/serp-baseline-2026-W44.csv` (same header; `engine = google-granby-phone`).
2. **SERP API** with the location set to Granby, Québec, Canada and the language per prompt (`engine = serpapi-granby`). API parameter names: check the provider docs (UNVERIFIED here).
3. **AI engines**: ChatGPT, Perplexity, Gemini, Claude, Copilot. Run the 33 prompts; record cited domains, `brand_named`, wrong facts (hours!) → one row per prompt per engine.
4. **Four weekly runs** before any conclusion (rank-first `10-measurement.md` §7).

Scoring helper for the Studio Scoreboard (JavaScript):

```js
// scoreboard/score.mjs: plan §5 winnability rubric + priority pick
export function scorePrompt(p) {
  const w = [p.w_weak_top10, p.w_authority, p.w_surface, p.w_buyer].map(Number);
  if (w.some((x) => !Number.isInteger(x) || x < 1 || x > 5)) return { ...p, w_score: null };
  return { ...p, w_score: w.reduce((a, b) => a + b, 0) };
}

// offerOk(p) -> true only when the owner has confirmed the product behind the prompt
export function pickTen(prompts, offerOk) {
  return prompts
    .map(scorePrompt)
    .filter((p) => p.type !== 'brand' && p.type !== 'candidate' && p.w_score >= 14 && offerOk(p))
    .sort((a, b) => b.w_score - a.w_score || Number(b.w_buyer) - Number(a.w_buyer))
    .slice(0, 10);
}
```

---

## 10. [[FACT NEEDED]] that change the scores

| Fact | Prompts affected |
|---|---|
| Open in Oct 2026; GBP status not "temporarily closed"; owner access | all; L1, C1, C8, B1–B3 |
| Current hours incl. Sunday | L4, B2, C1 (wrong hours already repeated) |
| Next-day policy, cut-off hour | L3, I2 |
| Price grid, sizes, portions per size | I1, I3, I8, L2, L9 |
| Wedding cakes offered? (tiers, delivery, set-up) | I5, I9, C3, C7, C9, X15, X16 |
| Bûches, macarons, chocolatines, gluten-free, corporate boxes, quinceañera, delivery | C4, C5, L6, C6, L7, I10, X11 |
| Walking/driving distance 3 rue Court → Zoo de Granby | L5, L8 |
| Food-safety storage guidance (MAPAQ / Health Canada URL) | I7 |

---

## Sources

All seen 2026-10-25. Grouped by the prompt whose WebSearch surfaced them; "secondary" = cited from the other tracks' same-day searches (not opened by this track).

**I1**
- 3 Meilleurs Pâtisseries à Granby, QC — https://threebestrated.ca/fr-gâteaux-in-granby-qc — seen 2026-10-25
- Gateaux personnalises (PDF) — https://cdn.website.dish.co/media/f4/69/9546646/Gateaux-personnalises.pdf — seen 2026-10-25
- GATEAUX PERSONNALISES (PDF) — https://cdn.website.dish.co/media/3b/d0/6537022/GATEAUX-PERSONNALISES.pdf — seen 2026-10-25
- PagesJaunes.fr listing — https://www.pagesjaunes.fr/pros/56049186 — seen 2026-10-25
- Prop Options personalisation add-on — https://propoptions.co.uk/fr/products/premium-add-on-bespoke-personalisation-for-wooden-cake-stands — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/qAQMeqwARyvEgyxxz772SA — seen 2026-10-25
- RestoMontreal – Pâtisserie Cocovanille (FR) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ — seen 2026-10-25
- Zola – Wedding Cake Bakeries in Granby, VT — https://zola.com/wedding-vendors/search/granby-vt--wedding-cakes-desserts?page=6 — seen 2026-10-25
- Zola – Gluten-Free Wedding Cake Bakeries in Granby, VT — https://zola.com/wedding-vendors/search/granby-vt--wedding-cakes-desserts--gluten-free — seen 2026-10-25

**I2**
- iGraal – avis Votre Gateau — https://fr.igraal.com/avis/votre-gateau — seen 2026-10-25
- iGraal – avis Votre Gateau (2) — https://fr.igraal.com/avis/Votre-Gateau — seen 2026-10-25
- Mariages.net – Votre Gateau — https://www.mariages.net/wedding-cake/votre-gateau--e252685 — seen 2026-10-25
- Le Petit Journal Dublin – trouver rapidement un gâteau — https://lepetitjournal.com/dublin/comment-trouver-rapidement-un-gateau-pour-sa-fete-323093 — seen 2026-10-25
- Jotform form — https://www.jotform.com/form/230825029481859 — seen 2026-10-25
- ABC Salles – Quand commander son gâteau de mariage — https://www.abcsalles.com/guide/mariage/quand-commander-son-gateau-de-mariage — seen 2026-10-25
- Jotform form (2) — https://form.jotform.com/230825029481859 — seen 2026-10-25
- Tally form — https://tally.so/r/5BQeVZ — seen 2026-10-25
- Royal Caribbean FAQ celebrations — https://www.royalcaribbean.com/fra/fr/faq/questions/special-celebrations-birthday-anniversary-event-services — seen 2026-10-25

**I3**
- Quel moule pour combien de part ? — https://www.synonyme-du-mot.com/les-articles/quel-moule-pour-combien-de-part — seen 2026-10-25
- nelson-atkins staging page — https://wwwstag.nelson-atkins.org/?p=3990 — seen 2026-10-25
- cake size — https://digilib.ucr.edu/cake-size — seen 2026-10-25
- Nigella – larger size chocolate fruit cake — https://www.nigella.com/ask/larger-size-chocolate-fruit-cake — seen 2026-10-25
- CakeCentral – cake pan size — https://www.cakecentral.com/forum/t/707072/cake-pan-size — seen 2026-10-25
- cake sizes — https://digilib.ucr.edu/cake-sizes — seen 2026-10-25
- Quel moule pour un wedding cake ? — https://www.synonyme-du-mot.com/les-articles/quel-moule-pour-un-wedding-cake — seen 2026-10-25
- CakeCentral 11x15x2 — https://www.cakecentral.com/cake-decorating-ftopict-3704-11x15x2.html — seen 2026-10-25
- The Bump forum — https://forums.thebump.com/discussion/comment/58352391 — seen 2026-10-25

**I4**
- Comment livrer un gâteau ? — https://fluxdeconnaissances.com/information/page/read/264642-comment-livrer-un-gateau — seen 2026-10-25
- Le Matin (MA) — https://lematin.ma/supplement/weekend/2013/L--OEUF_Idees-recues-et-verites-scientifiques/De-la-creativite-et-du-plaisir_Un-gateau-de-bonbons--ca-vous-tenteA/181009/amp — seen 2026-10-25
- C&A FR – gâteau de couches — https://www.c-and-a.com/fr/fr/shop/faire-gateau-couches-soi-meme — seen 2026-10-25
- C&A CH — https://www.c-and-a.com/ch/fr/shop/faire-gateau-couches-soi-meme-diy — seen 2026-10-25
- 9+ Easy Ways How to Transport a Cake Safely — https://codestream.fullstackacademy.com/?p=36586 — seen 2026-10-25
- C&A BE — https://www.c-and-a.com/be/fr/shop/faire-gateau-couches-soi-meme-fr — seen 2026-10-25
- Cater4you – How To Transport a Cake — https://cater4you.co.uk/?p=4936 — seen 2026-10-25
- Cater4you blog — https://www.cater4you.co.uk/blog/how-to-transport-a-cake/ — seen 2026-10-25
- CakeCentral – Transporting a cake — https://www.cakecentral.com/forum/t/602072/transporting-a-cake — seen 2026-10-25

**I5**
- Desjardins – coût d'un mariage — https://www.desjardins.com/fr/conseils/cout-mariage.html — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/Cq3vJv6-_auui3Zt9YjbfA — seen 2026-10-25
- ABC Salles – gâteaux nuptiaux — https://www.abcsalles.com/mag/actualite/mariages-patisserie-gateaux-nuptiaux-voues-uniques-grandioses — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/y38C3VLEuo82P-yjFZ5kKw — seen 2026-10-25
- ABC Salles – calculer quantités dessert mariage — https://www.abcsalles.com/guide/mariage/calculer-quantites-dessert-mariage — seen 2026-10-25
- Etsy — https://www.etsy.com/r/similar/1709541467 — seen 2026-10-25
- Etsy — https://www.etsy.com/r/similar/1753381230 — seen 2026-10-25
- Etsy — https://www.etsy.com/r/similar/1684847660 — seen 2026-10-25
- Etsy — https://www.etsy.com/r/similar/741361285 — seen 2026-10-25
- Jotform – déterminer le prix de vente d'un gâteau — https://www.jotform.com/fr/blog/comment-determiner-le-prix-de-vente-dun-gateau/ — seen 2026-10-25

**I6**
- Différence entre ganache et glaçage — https://dubocalalassiette.fr/blog/difference-entre-ganache-et-glacage/ — seen 2026-10-25
- Sweetly Cakes – ganache chocolat — https://sweetlycakes.com/ganache-chocolat — seen 2026-10-25
- OQLF Vitrine linguistique – ganache — https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8361440/ganache — seen 2026-10-25
- Sweetly Cakes – ganache lissage — https://sweetlycakes.com/ganache-pour-un-lissage-parfait — seen 2026-10-25
- L'art de la ganache — https://dubocalalassiette.fr/blog/ganache-deco-gateau/ — seen 2026-10-25
- Sweetly Cakes – ganache montée — https://sweetlycakes.com/ganache-montee — seen 2026-10-25
- Boudin de protection en ganache — https://dubocalalassiette.fr/blog/boudin-de-protection-ganache/ — seen 2026-10-25
- Sweetly Cakes – buttercream — https://sweetlycakes.com/buttercream-glacage-creme-au-beurre — seen 2026-10-25
- Sweetly Cakes – ganache caramel — https://sweetlycakes.com/ganache-caramel-beurre-sale — seen 2026-10-25

**I7**
- Conserver un gâteau avec ganache — https://www.synonyme-du-mot.com/les-articles/comment-conserver-un-gateau-avec-ganache — seen 2026-10-25
- Congeler un cake — https://www.synonyme-du-mot.com/les-articles/est-ce-quon-peut-congeler-un-cake — seen 2026-10-25
- Conserver un gâteau moelleux au chocolat — https://www.synonyme-du-mot.com/les-articles/comment-conserver-un-gateau-moelleux-au-chocolat — seen 2026-10-25
- Conserver un quatre-quarts — https://www.synonyme-du-mot.com/les-articles/comment-conserver-un-quatre-quart-fait-maison — seen 2026-10-25
- Croq-Kilos – garder un gâteau moelleux — https://www.croq-kilos.com/actus/comment-garder-un-gateau-moelleux-pendant-plusieurs-jours — seen 2026-10-25
- Le glaçage se conserve ? — https://www.synonyme-du-mot.com/les-articles/est-ce-que-le-glacage-se-conserve — seen 2026-10-25
- Conserver un gâteau au congélateur — https://www.synonyme-du-mot.com/les-articles/comment-conserver-un-gateau-au-congelateur — seen 2026-10-25
- Tarte la veille — https://dubocalalassiette.fr/blog/peut-on-faire-une-tarte-la-veille-pour-le-lendemain/ — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/o4MlxZOOi2hXnrPUvWe_7w — seen 2026-10-25

**I8**
- WeddingWire.ca – Extra Cakes — https://weddingwire.ca/wedding-cakes/extra-cakes--e8919 — seen 2026-10-25
- Tastet – Best Birthday Cakes in Montreal (qc) — https://tastet.ca/en/lists/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/?region=qc — seen 2026-10-25
- WeddingWire.ca – Émotions Gâteaux — https://weddingwire.ca/wedding-cakes/emotions-gateaux--e72715 — seen 2026-10-25
- Cost guide custom birthday cake 2026 — https://new.risingsunartscentre.org/news/cost-guide-and-price-range-for-a-custom-birthday-cake-2026.html — seen 2026-10-25
- Tastet (mtl) — https://tastet.ca/en/lists/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/?region=mtl — seen 2026-10-25
- Tastet (vancouver) — https://tastet.ca/en/lists/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/?region=vancouver — seen 2026-10-25
- Tastet (default) — https://tastet.ca/en/lists/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/ — seen 2026-10-25
- Tastet (to) — https://tastet.ca/en/lists/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/?region=to — seen 2026-10-25
- WeddingWire.ca – La Gâtisserie — https://www.weddingwire.ca/wedding-cakes/la-gatisserie--e2141 — seen 2026-10-25

**I9**
- Rashmi's Bakery KB — https://kb.rashmisbakery.com/en/articles/6008065 — seen 2026-10-25
- Easy Weddings — https://easyweddings.com.au/WeddingCakes/advice/how-far-in-advance-should-i-book-my-wedding-cake — seen 2026-10-25
- Rashmi's Bakery help — https://www.rashmisbakery.com/help/wedding-and-events/how-far-in-advance-should-i-book-my-wedding-cake — seen 2026-10-25
- Rashmi's Bakery help (2) — https://help.rashmisbakery.com/en/article/how-far-in-advance-should-i-book-my-wedding-cake-wwf3o0/ — seen 2026-10-25
- The Knot forum — https://forums.theknot.com/discussion/comment/1518359 — seen 2026-10-25
- WeddingWire forum – cake tasting — https://www.weddingwire.com/wedding-forums/when-to-do-cake-tasting/ebe009ed513a6b88.html — seen 2026-10-25
- Patisserie Valerie – celebration cake lead time — https://patisserie-valerie.co.uk/blogs/news/how-far-in-advance-should-you-order-a-celebration-cake — seen 2026-10-25
- WeddingWire forum – cakes — https://www.weddingwire.com/wedding-forums/cakes/644b6acf094f9c15.html — seen 2026-10-25
- custom cake order — https://commons.open.uci.edu/custom-cake-order — seen 2026-10-25
- The Knot forum (2) — https://forums.theknot.com/discussion/comment/325584 — seen 2026-10-25

**I10**
- MTL Blog – wedding cost Quebec — https://www.mtlblog.com/wedding-cost-quebec-canada — seen 2026-10-25
- WeddingWire.ca – Cakefections MTL — https://www.weddingwire.ca/wedding-cakes/cakefections-mtl--e75812 — seen 2026-10-25
- Bridebook – wedding cake cost Canada — https://app.bridebook.com/ca-en/article/how-much-does-a-wedding-cake-cost-in-canada — seen 2026-10-25
- Ricardo – Quebec Flag Cake — https://ricardocuisine.com/en/recipes/4743-quebec-flag-cake — seen 2026-10-25
- Bridebook guide — https://wedding-guide.bridebook.com/?p=37194 — seen 2026-10-25
- Job Bank – wedding cake decorator wages Côte-Nord — https://bc.jobbank.gc.ca/marketreport/wages-occupation/43/22317;jsessionid=C59034C510A36B12F08C4C8B7BE03D49.jobsearch77 — seen 2026-10-25
- Clarksville Now — https://clarksvillenow.com/?p=55781 — seen 2026-10-25
- NPR – king cake tag — https://www.npr.org/tags/575975150/kings-cake — seen 2026-10-25

**C1**
- RestoMontreal – Pâtisserie Cocovanille (vote) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/vote/ — seen 2026-10-25
- RestoMontreal – Mont Rose Pâtisserie Café Granby — https://www.restomontreal.ca/resto/mont-rose-patisserie-cafe-granby/23174/en/?k=granby — seen 2026-10-25
- 3 Meilleures Boulangeries à Granby, QC — https://threebestrated.ca/fr-boulangeries-in-granby-qc — seen 2026-10-25
- Wikipedia – Pâtisserie — https://en.wikipedia.org/wiki/P%C3%A2tisserie — seen 2026-10-25
- Wikipedia – Cédric Grolet — https://en.wikipedia.org/wiki/C%C3%A9dric_Grolet — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/g-oY0ZaMemOkX2E0gJAKEA — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/fJUTJ9psUlo1CxTgMWgN4Q — seen 2026-10-25
- Granby Drummer – Julien Tessier opens second bakery location — https://granbydrummer.com/?p=3710075 — seen 2026-10-25

**C2**
- Tastet – meilleurs gâteaux d'anniversaire à Montréal (qc) — https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/?region=qc — seen 2026-10-25
- Tastet (to) — https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/?region=to — seen 2026-10-25
- Tastet (default) — https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/ — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/Mlg8IcyUBrFd5LTBZ22lqw — seen 2026-10-25
- Gateau pour la fête des grand-mères — https://fpc-dev.cron.cl/articles/gateau-pour-la-fete-des-grand-mere.html — seen 2026-10-25
- Zola – Wedding Cake Bakeries in Granby, MA — https://www.zola.com/wedding-vendors/search/granby-ma--wedding-cakes-desserts — seen 2026-10-25
- Islaguru – best things to do Granby Quebec — https://www.islaguru.com/articles/best-things-to-do-granby-quebec — seen 2026-10-25
- Granby Drummer – Happenings at the Center — https://granbydrummer.com/author/admin/page/160/ — seen 2026-10-25

**C3**
- Mariages.net – Quintessence Gaétan Élie — https://www.mariages.net/wedding-cake/quintessence-gaetan-elie--e280932 — seen 2026-10-25
- WeddingWire.ca – Ma Pâtisserie — https://www.weddingwire.ca/wedding-cakes/ma-patisserie--e16269 — seen 2026-10-25
- Mariages.net – Les Cakes d'Esther — https://www.mariages.net/wedding-cake/les-cakes-d-esther--e227616 — seen 2026-10-25
- L'Encyclopédie canadienne – Cantons de l'Est — https://thecanadianencyclopedia.ca/fr/article/cantons-de-lest — seen 2026-10-25
- Mariages.net – Pierre Evrard Pâtisserie — https://www.mariages.net/wedding-cake/pierre-evrard-patisserie--e356397 — seen 2026-10-25
- Mariages.net – Luxury Cake — https://www.mariages.net/wedding-cake/luxury-cake--e228936 — seen 2026-10-25
- Mariages.net – Lorraine — https://www.mariages.net/wedding-cake/lorraine — seen 2026-10-25
- Quoifaire – Atelier décoration de gâteau — https://quoifaire.com/en/cantonsdelest/events/atelier-decoration-de-gateau — seen 2026-10-25
- Mariages.net – Gâteau Shop — https://www.mariages.net/wedding-cake/gateau-shop--e377565 — seen 2026-10-25

**C4**
- OQLF Vitrine linguistique – bûche de Noël — https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/8359287/buche-de-noel — seen 2026-10-25
- Vikidia – Bûche de Noël — https://fr.vikidia.org/wiki/B%C3%BBche_de_No%C3%ABl — seen 2026-10-25
- Substack – De l'espoir à la gourmandise — https://corinnembow.substack.com/p/de-lespoir-a-la-gourmandise — seen 2026-10-25
- La Libre – La bûche de Noël — https://www.lalibre.be/lifestyle/food/la-buche-de-noel-du-feu-de-bois-a-nos-assiettes-5bf2c536cd70e3d2f6ca3ce8 — seen 2026-10-25
- Barry Callebaut – Bûche de Noël — https://barry-callebaut.com/en/recipes/artisans-chefs/le-royal/1640 — seen 2026-10-25
- Tendance Ouest — https://www.tendanceouest.com/actualite-375207-calvados-la-buche-de-noel-l-incontournable-du-reveillon — seen 2026-10-25
- DH – sélection de bûches — https://www.dhnet.be/lifestyle/food/notre-selection-de-buches-de-noel-va-vous-mettre-l-eau-a-la-bouche-5c090548cd70fdc91bd2e5bf — seen 2026-10-25
- Paris Match BE — https://www.parismatch.be/lifestyle/food/2024/12/24/pourquoi-mange-t-on-de-la-buche-a-noel-ECJMRVANXFA4TIAR72C6U6YJIM/ — seen 2026-10-25
- Blick – bûches Lausanne — https://www.blick.ch/fr/lifestyle/food/elles-envoient-du-bois-5-b-ches-de-noel-2023-bien-gourmandes-a-acheter-a-lausanne-id19220104.html — seen 2026-10-25

**C5**
- Tastet – Best Macarons in Montreal — https://tastet.ca/en/lists/macarons-where-to-find-the-best-in-montreal/?region=mtl — seen 2026-10-25
- Wikipedia – Macaron — https://en.wikipedia.org/wiki/Macaron — seen 2026-10-25
- Wikipedia – Macaroon — https://en.wikipedia.org/wiki/Macaroon — seen 2026-10-25
- Trustpilot – Macarons & More — https://fr.trustpilot.com/review/www.macaronsandmore.com — seen 2026-10-25
- Macarons PDF — https://cs.grinnell.edu/=46623461/oeditj/lheadd/kexeg/Macarons.pdf — seen 2026-10-25
- Trustpilot – Macaron Bites — https://fr.trustpilot.com/review/macaronbites.com — seen 2026-10-25
- Macarons PDF (2) — https://autry.cs.grinnell.edu/~61069849/hlerckr/qchokoc/lparlishs/Macarons.pdf — seen 2026-10-25
- RestoMontreal – livraison Granby — https://www.restomontreal.ca/restaurants/livraison-granby/fr/?d=103&f=10 — seen 2026-10-25
- Bon Macaron Patisserie — https://www.vancouverchristmasmarket.com/?p=3650 — seen 2026-10-25

**C6**
- Cinq Fourchettes – gâteau mousse chocolat (PDF) — https://cinqfourchettes.com/wp-content/uploads/2020/01/gâteau-mousse-chocolat-Cinq-Fourchettes.pdf — seen 2026-10-25
- Pardon Your French – gluten free — https://www.pardonyourfrench.com/tag/gluten-free/ — seen 2026-10-25
- Cuisine Angélique – gâteau cerisettes (PDF) — https://mail.cuisinelangelique.com/recettes/print/recette-gateau-saveur-cerisettes.pdf — seen 2026-10-25
- Cookidoo CN — https://cookidoo.com.cn/recipes/recipe/en-CN/r913328 — seen 2026-10-25
- Pardon Your French – gâteau grenoblois — https://www.pardonyourfrench.com/french-walnut-coffee-cake-gateau-grenoblois/ — seen 2026-10-25
- Cookidoo AU — https://cookidoo.com.au/recipes/recipe/en-NZ/r917326 — seen 2026-10-25
- Il était un gâteau (PDF) — https://www.iletaitungateau.com/articles/915.pdf — seen 2026-10-25
- Gâteau au yaourt sans gluten — https://fpc-dev.cron.cl/articles/recette-gateau-au-yaourt-sans-gluten.html — seen 2026-10-25
- TheTVDB episode — https://thetvdb.com/series/284784-show/episodes/11014745 — seen 2026-10-25
- Atly – Gluten-free dinner spots Granby — https://www.atly.com/best/gluten-free/dinner-canada-quebec-granby.md — seen 2026-10-25

**C7**
- BAnQ document — https://collections.banq.qc.ca/document/s/t/4VUgHyI-rifjsra91t2u-w — seen 2026-10-25
- data.bnf.fr – gâteaux de mariage (PDF) — https://data.bnf.fr/12312226/gateaux_de_mariage/en.pdf — seen 2026-10-25
- BAnQ document — https://collections.banq.qc.ca/document/s/t/I69p4iKFCUUIE1tJaqO2Og — seen 2026-10-25
- Wix template – wedding cake — https://www.wix.com/templatesfr/2165-wedding-cake/nos-gâteaux — seen 2026-10-25
- Hespress FR — https://fr.hespress.com/219028-219028.html — seen 2026-10-25
- Bridebook – Hôtel Lou Granva — https://bridebook.com/fr/wedding-venues/h-tel-lou-granva-morez-jura-frWXRM6R8d — seen 2026-10-25
- Sarah Friday's 1810 Granby Drawing — https://historysoft.com/granby/cake_shop.html — seen 2026-10-25

**Secondary (other tracks' same-day searches; cited via research/01-business-facts.md and research/03-competitors.md)**
- Three Best Rated – 3 Best Bakeries in Granby — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-25
- Three Best Rated – 3 Best Cakes in Granby — https://threebestrated.ca/cakes-in-granby-qc — seen 2026-10-25
- Yelp – Bakeries Granby — https://www.yelp.com/search?cflt=bakeries&find_loc=Granby%2C+QC — seen 2026-10-25
- RestoMontreal – Best Bakeries in Granby — https://www.restomontreal.ca/restaurants/bakeries-granby/en/?c=338&d=103 — seen 2026-10-25
- RestoMontreal – Pâtisserie Cocovanille (EN) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/ — seen 2026-10-25
- La Voix de l'Est – Pain Pain closure (2026-06-16) — https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/ — seen 2026-10-25
- WeddingWire.ca – Wedding Cakes Sherbrooke — https://www.weddingwire.ca/wedding-cakes/quebec/sherbrooke — seen 2026-10-25
- Mlles Gâteaux — https://www.mllesgateaux.com/ — seen 2026-10-25
- RestoMontreal – Si Petit Soit-il Bromont — https://www.restomontreal.ca/resto/si-petit-soit-il-bromont/20623/fr/ — seen 2026-10-25
- Cake Design Granby – Gâteaux sur mesure — https://cakegranby.ca/products/gateau-sur-mesure — seen 2026-10-25
- Cake Design – saveurs et tarifs — https://www.cakegranby.com/saveurs_tarifs.php — seen 2026-10-25
- Avec un Grand A – Commande en ligne — https://www.avecungranda.com/commande-en-ligne — seen 2026-10-25
- Maître Glacier Granby – Gâteaux — https://granby.maitreglacier.com/categorie-produit/gateaux-2/ — seen 2026-10-25
- Délices sucrés Granby — https://delicessucresgranby.my.canva.site/ — seen 2026-10-25
- Le Marmiton – gâteau d'anniversaire personnalisé — https://lemarmiton.ca/dessert-choco-vanille/ — seen 2026-10-25
- choco.vanille (Facebook) — https://www.facebook.com/chocovanille.marmiton/ — seen 2026-10-25
- Tastet – Nos restaurants coups de cœur à Granby — https://tastet.ca/en/lists/nos-restaurants-coups-de-coeur-a-granby/ — seen 2026-10-25
- Uber Eats – Bakery delivery Granby — https://www.ubereats.com/ca/category/granby-qc/bakery — seen 2026-10-25
- Wanderlog – Pâtisserie Cocovanille (titled Magog) — https://wanderlog.com/place/details/13122992/p%C3%A2tisserie-cocovanille — seen 2026-10-25
- find-open – Pâtisserie Cocovanille hours — https://find-open.ca/granby/p%C3%A2tisserie-cocovanille-1781027 — seen 2026-10-25
- Chamber of Commerce – Pâtisserie Cocovanille — https://canada.chamberofcommerce.com/business-directory/quebec/granby/pastry-shop/1192259-patisserie-cocovanille — seen 2026-10-25
- Statistique Québec – Estrie/Montérégie boundary change — https://statistique.quebec.ca/fr/actualite/modification-decoupages-regions-administratives-estrie-et-monteregie — seen 2026-10-25

**Internal (repo files used)**
- research/plan-v1-ranking-stack.md (§1, §2, §5, §6)
- research/01-business-facts.md (§0, §3–§8)
- research/03-competitors.md (§0–§7)
- rank-first references 04-research-prompts.md, 10-measurement.md, 16-market-intelligence.md

---

## Update 2026-10-29 (W44): the 16 remaining prompts

As of 2026-10-29 (ISO week 2026-W44). Track: complete the proxy baseline (the 16 prompts not run in W43), run 13 candidate prompts for the first time, update the winnability scores and the 10 priority prompts (Ranking Stack Layer 7.6–7.7; rank-first `04-research-prompts.md`, `16-market-intelligence.md`). The W43 sections above (§0–§10, Sources) are unchanged.
Machine-readable twins: `data/serp-baseline-2026-W44.csv` (30 rows, same 12 columns and conventions as the W43 file) and `scoreboard/runs/2026-W44.csv` (rank-first runs format, 16 Google rows).
Feeds the client documents built from the rank-first templates: `docs/16-recherche.md` §3 and §7.3, `docs/19-marche-et-concurrence.md` §1 and §3, `docs/06-annuaires-listicles.md`, `docs/05-gbp-checklist.md`, `docs/03-messages-avis.md`, `docs/13-taches-humaines.md`.

> **CAVEAT: the same proxy as W43, with the same limits.**
> - WebSearch (standard mode), run **from the US** on 2026-10-29. It returns a summarized list of links plus a generated answer. It is **not** a Google.ca results page localized to Granby: no map pack, no featured snippet, no People Also Ask, no AI Overview, and the link order is **not a Google position**.
> - **One run per prompt.** The amended definition of first needs 3 runs per cell and 4 consecutive weeks (research/12 §4). Single runs are noisy.
> - **No AI engine was queried** (ChatGPT, Perplexity, Gemini, Claude, Copilot). AI-engine rows are left out of `scoreboard/runs/2026-W44.csv`: they are a human task (W44.10). The B3 row is the WebSearch answer, a proxy only.
> - `cocovanillegranby.com` is built but not deployed (README, stage of 2026-10-26), so no owned page can appear yet.
> - The Granby phone run and the SERP-API run (§9) are still the first Monday task. The next Monday is 2026-11-02 (2026-W45).

### W44.0 Bottom line (decision-relevant)

1. **The proxy baseline now covers all 33 prompts.** 17 were run on 2026-10-25 (W43, §2). The remaining 16 (C8–C10, L1–L10, B1–B3) were run on 2026-10-29. The same session ran 13 of the 20 candidates (X1–X13) and one spelling variant (« Pâtisserie Cocovanille Granby »): **30 searches, 534 links**. It is still a proxy, not the baseline (W44.10).
2. **The hours answer is wrong, and the error comes from a directory.** B2 « Coco Vanille Granby heures » returned "open Monday to Saturday from 7 a.m. to 6 p.m. and on Sundays from 8 a.m. to 3 p.m.", phone **(450) 770-7246**, citing Three Best Rated (TBR).
   - That is Pain-Pain's data: the X2 answer gives the same number for Pain-Pain (closed 2026-06-16), and the C8 answer gives Pain-Pain Mon–Sat 7–18. The merge is inferred from two same-day answers; the TBR page itself was not opened.
   - B1 also gives (450) 770-7246 as a second number. C8 and X2 repeat TBR's older schedule (closed Sunday to Wednesday).
   - Site-published hours: Mon–Tue closed · Wed–Sat 8:30–17:30 · Sun 9:30–17:00 (`data/facts.json` `hours.google_listing`). Phone: 450-372-7177 (`phone.primary`).
   - → Fix at the source this week (W44.5), then re-run B1 and B2 every Monday.
3. **The brand is named in 12 of 26 non-brand runs (W43: 2 of 17), always through two directories.** That is 5 of the 13 set prompts run this week (C8, L1, L2, L3, L4) and 7 of the 13 candidates. Every mention came via restomontreal.ca and/or threebestrated.ca. RestoMontreal appears in 20 of 30 runs and is link #1 in 14. In 30 runs, no owned site (not live), Facebook, Instagram, YouTube, Yelp or Tripadvisor (.com/.ca) page surfaced, and Tourisme Granby région (granbyregion.com) never appeared.
4. **What the answers say about CV is mostly good, with one recurring bad line.**
   - Good: Google 4.9 from 40+ reviews (RestoMontreal, "as of July 2026"), almond croissants, Paris-Brest, custom cakes, a raspberry birthday cake (X3), a pistachio-raspberry tiramisu bought at the public market (B1, B3; the market visit also appears in L1, X1 and X7).
   - Bad: on four cake-ordering prompts (L2, L3, X4, X5) the only cake-order fact given about CV is the **January 2026 complaint** (a chocolate cake received as vanilla).
   - → The owner's factual public reply, the written recap already built into the checkout, and fresh reviews through the ethical ask (M3). Never gating, never incentives (rank-first `09-offsite-links.md` §5).
5. **The buying intents are still unclaimed in the proxy.** In 12 of 26 non-brand runs the answer said it found no local source: C9, C10, L2, L3, L6, L7, L8, L9, L10, X9, X10, X11 (X7 partly). Nobody owns ordering online, a cake for tomorrow, delivery, office boxes or a bakery near the Zoo.
   - The three Granby carts documented in 03 (cakegranby.ca, avecungranda.com, granby.maitreglacier.com) did not surface in L2, L9, X4 or X5.
   - Granby competitors' own sites surfaced in **0 of 30** runs (0 of 47 with W43). A Google localized in Granby may show them: re-check.
6. **L4 is no longer gated.** Sunday hours are owner-published (Sun 9:30–17:00), and the built `/nous-trouver/` page already answers « Êtes-vous ouverts le dimanche? ». The L4 answer names CV among four Sunday-open pâtisseries, with RestoMontreal's 9:00 opening (30 minutes early). Score 17 → 18. L4 enters the 10; I2 becomes the first reserve.
7. **"Granby" without "Québec" is a US query in English and Spanish.**
   - L8: 9 of 12 links are US pages. L9: 0 Québec links of 17. L10: 0 Québec links of 15.
   - US Granby pages appeared in 13 of 30 runs (W43: 4 of 17).
   - C9's "Eastern" pulls 8 pages on 7 US "East …" towns; L7's « réunion » pulls 8 La Réunion links.
   - → Measure EN/ES variants with "Quebec" and keep "Granby, Québec" in every EN/ES title and passage (W44.8).
8. **Candidates that earn a slot (the R5 swap, W44.8):**
   - X3 « gâteau d'anniversaire Granby »: CV's page is link 1, and the answer leads with a positive birthday-cake review.
   - X1 « pâtisserie Granby »: CV named 2nd, behind a possibly closed Mélisse.
   - X7 « croissants Granby »: CV is the first Granby name (X8 « croissant aux amandes »: the only one).
   - X2 « boulangerie Granby »: CV 2nd, behind the closed Pain-Pain.
   - X12 « café pâtisserie centre-ville Granby » shows a hole: RestoMontreal holds 16 of 17 links and names seven cafés and pâtisseries, but not CV.
   - X9 (Paris-Brest) and X10 (vol-au-vent) show no local intent.
9. **The 10 priority prompts (W44):** L3, C1, C2, L4, L1, C8, I3, L9, I1, L2 (W44.7). C4 (bûche) still waits on the owner's answer, due 2026-11-01 (14 P3).

### W44.1 Method: what stayed the same, what changed

Unchanged from §1: engine and labels; `google_position` = `none` (no owned domain is live); `snippet_owner` = the domain the generated answer drew its main answer from, or `none (gap)` when it said nothing local was found; `ai_overview_cited` and `map_pack` = `not_observable`; `brand_named` / `brand_position` = yes/no and the rank of the first link whose page names the brand; `third_party_names_us` = the third-party domains in the list that name CV.

| Item | W44 |
|---|---|
| Date, week | 2026-10-29 (ISO 2026-W44), one session, standard mode |
| Budget | 30 searches (brief: 20–30), all logged in W44.12 |
| Link lists | 12 to 27 links per query (W43: about 9–10), so link numbers above 10 appear (L2 #17, L3 #14) |
| Query text | The prompt verbatim, as customers type it. Two exceptions. L1 was run as « pâtisserie près de moi Granby », because a US engine has no Granby location; the result is **not** a near-me measurement. B3 was run as the question itself; the generated answer is a proxy for an AI answer, not one of the five engines |
| Extra runs | 13 candidates (X1–X13) and one brand variant (`B1-cocovanille`). X14–X20 were not run: X14 is the global EN calculator query, X15–X16 are gated on weddings, X17–X20 are the ES lane that C10, L10 and I10 already show empty |
| Interpretations | "Parasite page" and "US Granby" are read from URL patterns and the answers (inferred). Third-party figures (ratings, prices, phones) are search-summary values about third parties, never CV's facts |

**`scoreboard/runs/2026-W44.csv`.**
- **Format.** The engine is `Google` so that `tools/citation-share.mjs` and `tools/market.mjs` can read the rows. Every row is still the proxy, and its `notes` start with `PROXY`.
- **Values.** `google_position` = 0, because the domain is not live and is not in the list. `snippet_owner`, `ai_overview_cited`, `cited_domains` and `map_pack` stay empty: the proxy cannot see a featured snippet, an AI Overview or a map pack, so the proxy's answer source and link list stay in the data/ twin. `brand_named`, `brand_position` and `third_party_names_us` describe the proxy list.
- **Coverage.** Candidates and AI-engine rows are left out. W43 has no runs file.
- **Check.** `node tools/citation-share.mjs --runs scoreboard/runs --brand cocovanillegranby.com` read the file on 2026-10-29: 16 Google rows, 0% for top 1, top 3, top 10 and snippets. The AI Overview and map-pack shares are blank, not zero.
- **File rule:** move this file to `scoreboard/runs/proxy/` (the scripts do not read subfolders) the day the first real Granby run is filed, so that no trend ever compares a proxy week with a real one.

### W44.2 Per-prompt findings: the 16 prompts not run in W43

Domains in surfaced order, duplicates collapsed (full ordered lists in the CSV). "CV" = Coco Vanille. "#n" = link number in the proxy list, **not a Google position**.

| ID | Prompt (as run) | Domains surfaced (order) | CV? where | Dominant owner type | Winning format | Answer-style content seen |
|---|---|---|---|---|---|---|
| C8 | best bakery in Granby Quebec | **threebestrated.ca (bakeries list, CV #2)** · ubereats.com (Granby QC, then Granby **CT** and **MA**) · travel.destinationcanada.com · atly.com · scottsdirectories.com · **restomontreal.ca (CV vote page #9; Mélisse #13)** · threebestrated.ca (cakes list) · travelstoke.matadornetwork.com · ns.jobbank.gc.ca · community.thecoast.ca · blogto.com · restoenligne.com | **yes, #1** (TBR) and #9 (RestoMontreal); named 2nd in the answer | listicle + delivery marketplace | listicle | Lists TBR's three: Pain-Pain first (**closed 2026-06-16**, shown with Mon–Sat 7–18 hours), **CV second with TBR's older hours** (Thu–Fri to 16:30, Sat to 15:00, closed Sun–Wed), Mélisse third ("may be temporarily closed"). Says TBR's ranking basis is not explained. Uber Eats: "Made By Pam", 4.5 (which Granby is not stated) |
| C9 | wedding cake bakery Eastern Townships | cantonsdelest.com (press release) · huffingtonpost.ca (2016) · weddingwire.ca (La Gâtisserie; Éphémère; three vendors outside the region) · bcliving.ca · streetsoftoronto.on-forge.com · zola.com (**8 pages on 7 US "East …" towns**: ME, NH, VT, MI) · tourismebrome-missisquoi.ca · ripplecove.com | no | tourism pages + a US wedding directory | directory | **Gap:** "didn't turn up a wedding cake bakery clearly located in the Eastern Townships". Closest: La Gâtisserie (Québec, town not stated). Extra Cakes (Sherbrooke, 03) did not surface |
| C10 | mejor pastelería en Granby Quebec | tripadvisor.com.ar (Granby restaurants) · tastet.ca (Granby restaurants; Montréal pies and pastry shops) · destinationgranby.com (Granby **CO**) · scottsdirectories.com · sortirauquebec.com · sevendaysvt.com · quebecmaritime.ca · ubereats.com · aaa.com · koa.com · restoenligne.com · travel.destinationcanada.com | no | Montréal and Québec City food media; **0 Spanish-language bakery pages** | listicle | **Gap:** "No encontré una pastelería clasificada como la mejor de Granby". Mixes Showboat pies from a Colorado "Destination Granby" blog into Granby QC. Names Les Fours du Roy (directory), Café de la Brûlerie (Tastet), Uber Eats shops |
| L1 | pâtisserie près de moi → run as « pâtisserie près de moi Granby » | restomontreal.ca (Mélisse vote #1; **CV vote #2**) · tastet.ca (Montréal ×2) · threebestrated.ca (FR « pâtisseries » #5, without CV; bakeries #6, with CV) · en.wikipedia.org · harringayonline.com · bluediamond.gg · candidat.francetravail.fr (Granville, France) · ubereats.com · airbnb.com.py · websites.ca · mesprestiges.com | **yes, #2**; named 2nd | local directories | directory | « Je n'ai pas accès à votre position »: **not a near-me measurement**; the list equals X1's. Answer: Mélisse (flag), **Cocovanille** (hours « diffèrent selon les sources »; a public-market review), Cake Design (194 Denison Est), "Annie" on rue Breton (likely Avec un Grand A, inferred) |
| L2 | commander un gâteau de fête en ligne Granby | lepetitjournal.com (Dublin) · royalcaribbean.com · tastet.ca (Montréal ×3) · quoifaire.com · mcsprogram.org (parasite PDFs, inferred) · zola.com (Granby **MO**) · jotform.com · newsletters.yapla.com · islaguru.com · canva.com · ubereats.com · milled.com · helloasso.com · **restomontreal.ca (CV FR, #17)** | **yes, #17**; named first | France, Dublin and Montréal pages, forms, parasite PDFs | none surfaced (no ordering page) | **Gap:** « aucune plateforme de commande en ligne de gâteaux de fête spécifiquement établie à Granby ». CV named **with the January 2026 order complaint**. The three Granby carts in 03 did not surface |
| L3 | gâteau pour demain Granby | quoifaire.com · restomontreal.ca (La Mie Bretonne #2) · zola.com (Granby MO, VT) · cdn.website.dish.co · fr.vikidia.org · recipe sites (fiveroses.ca, redpathsugar ×2, panasonic.ca, weightwatchers.com) · collections.banq.qc.ca · **restomontreal.ca (CV FR, #14)** · youdao.com · journal2022.rvf.ca | **yes, #14**; named first ("call Cocovanille first") | recipes, archives, US pages | none surfaced | **Gap:** "no result that directly lists a Granby bakery offering a cake ready by tomorrow". Repeats the January 2026 complaint. Names La Mie Bretonne (189 rue Principale). TBR's "ready next day" line and Délices Sucrés Granby (03) did not surface |
| L4 | pâtisserie ouverte dimanche Granby | **restomontreal.ca: 9 of 18 links** (La Mie Bretonne #1, **CV #2**, Mélisse ×4, Café ORÉE, Mont Rose) · tourismelandes.com (France ×4) · 118712.fr (Grenoble, Saint-Étienne) · au-magasin.fr · gillespudlowski.com | **yes, #2**; 2nd of 4 named | local directory | directory hours | Four Granby pâtisseries open Sunday: La Mie Bretonne (8:30–14:00), **Cocovanille (9:00–17:00 per RestoMontreal; site-published 9:30–17:00)**, Mont Rose (10:00–23:00 daily per the directory), Mélisse (no Sunday hours given). Café ORÉE is closed Sunday |
| L5 | café et pâtisserie près du Zoo de Granby | easterntownships.org (terrace article; Zoo page) · sevendaysvt.com · airbnb.se · themaritimeexplorer.ca · mtl.org (×2) · en.wikipedia.com · websites.ca · zoos.mono.net · timeout.com · tryperdiem.com · restomontreal.ca (Caféine & co) · bonjourquebec.com · sortirauquebec.com | no | tourism boards and guides | guide | Names Café de la Brûlerie (4 rue de la Gare; river terrace) and Caféine & co (9–16). « aucun résultat ne confirme leur distance exacte du zoo ». Gives the Zoo address as 525 rue Saint-Hubert (search summary, UNVERIFIED) |
| L6 | chocolatines Granby | restomontreal.ca (Chocolats Favoris ×2) · tastet.ca · en.wikipedia.org (Pain au chocolat) · ubereats.com (Granby **CO**) · destinationgranby.com (CO) · wanderlog.com · tendanceouest.com · lanarkcounty.ca · bakeryinfo.co.uk · fr.wiktionary.org · dictionnaire.lerobert.com · threebestrated.ca (FR « pâtisseries ») · 211quebecregions.ca | no | dictionaries, US Granby | definition | **Gap:** "didn't turn up a clear answer about chocolatines specifically in Granby". Says Rose Gâteaux lists chocolatines and has operated since 2010 (likely from the TBR page; UNVERIFIED). Québec usage of « chocolatine » is still UNVERIFIED |
| L7 | boîte de pâtisseries pour réunion Granby | transgourmet.fr · gillespudlowski.com (La Réunion) · leaderreunion.fr (×2) · en.reunion.fr (×4) · jedonneenligne.org · helloasso.com · rausch-packaging.com · candidat.francetravail.fr (a job posting coded 974, Sainte-Marie) · pagesjaunes.fr · zola.com (Granby CT, MO) · macommune.info · zeffy.com | no | **La Réunion (8 of 18 links)** + France | none surfaced | **Gap:** « aucune pâtisserie située à Granby (Québec) qui propose des boîtes pour réunions ». Le Marmiton's boxes (03) did not surface |
| L8 | bakery near Granby Zoo | ediblecteast.ediblecommunities.com · granbydrummer.com · ubereats.com (Granby QC, MA, CT; Granbury TX) · visitgrandcounty.com · destinationgranby.com · ramw.org · washington.org (×2) · superpages.com | no | **US Granby: 9 of 12 links** | none surfaced | **Gap:** "The results don't name a bakery near the Granby Zoo in Quebec". Names Julien's Bakery (Granby, CT, opened March 2026) and Rollin' Street Bakery (Granby, CO). The only Québec item: Uber Eats Granby (Tim Hortons, 315 Denison Est) |
| L9 | order custom cake online Granby | wep.iot.nokia.com (parasite, inferred) · zola.com (Granby CO, MA; East Granby CT) · ohdanishbakery.com · ubereats.com (Granby MA, CT) · samsclub.com · kroger.com · shopmarketplacefoods.com · digital-release.rochesterfirst.com · bluesheepbakeshop.com · beta.wegmans.com | no | **US only: 0 Québec links of 17** | none surfaced | **Gap:** no Granby bakery with an online custom-cake page; US vendors only |
| L10 | torta de cumpleaños personalizada Granby | mendoza.gov.ar · mercadolibre.com.ar · diariodecuyo.com.ar · shopinporto.porto.pt · paxinasgalegas.es · super.lider.cl · sweetbakerycusco.mypesdigitales.com · zola.com (Granby MA, VT) · barcelonaurbana.com · digilib.ucr.edu · ciudad.com.ar · mallorca.com · es-l.airbnb.com | no | Latin America and Spain + US; **0 Québec links** | none surfaced | **Gap:** "No search result identified a custom birthday cake bakery in Granby". The answer asks whether Granby is in Quebec |
| B1 | Pâtisserie Coco Vanille Granby avis | **restomontreal.ca (CV FR #1, EN vote #2)** · restomontreal.ca (Pâtisserie Coco, Montréal ×3) · threebestrated.ca (FR boulangeries #4; bakeries #7) · tryperdiem.com · theinfatuation.com · openrice.com · maisons-de-bricourt.com · airbnb.dk · toasttab.com · timeout.com · gillespudlowski.com · collections.banq.qc.ca · lesarcs.com | **yes, #1** | directories + name collisions | directory | Positive: Google **4.9 (40+)**, 86% five-star, "as of July 2026"; raspberry cake, almond croissants, Paris-Brest, custom cakes; an **Aug–Sep 2026** review of a tiramisu bought at the Granby public market (UNVERIFIED). Hours conflict. **Wrong: gives (450) 770-7246 as a second number** (Pain-Pain's per TBR, see X2) |
| B2 | Coco Vanille Granby heures | **restomontreal.ca (CV FR #1)** · threebestrated.ca (FR boulangeries #2) · restomontreal.ca (Chocolats Favoris; Coco Crêpes Granby) · collections.banq.qc.ca (×4) · cookidoo.co.uk · hemaquebec.ca · scentadvice.com · scentverdict.com · timeout.com (Accra) · royanatlantique.fr · retty.me · opentable.ca · saint-malo-tourisme.co.uk · maisons-de-bricourt.com | **yes, #1** | directories + perfume and name collisions | directory | **Wrong answer:** "open Monday to Saturday from 7 a.m. to 6 p.m. and on Sundays from 8 a.m. to 3 p.m.", (450) 770-7246, citing TBR: Pain-Pain's data (inferred). Also repeats RestoMontreal's « Cette entreprise peut être temporairement fermée » |
| B3 | « Que sais-tu de la Pâtisserie Coco Vanille à Granby ? » (proxy) | **restomontreal.ca (CV ×2)** · threebestrated.ca (×2) · theinfatuation.com · airbnb.se · tastet.ca (Pâtisserie Coco, Montréal ×4) · lefooding.com · exploretock.com · airbnb.dk · restomontreal.ca (Mélisse) · toasttab.com · maisons-de-bricourt.com · dnainfo.com | **yes, #1** | directories | — | Correct address and phone (450) 372-7177. Products per TBR (2025 update). Positive reviews. Hours conflict (RestoMontreal vs TBR). « Cocovanille » = the same address. « rien de plus sur l'histoire de l'établissement ni sur son propriétaire ». No merge with choco.vanille, the perfume or La Réunion in this answer |

### W44.3 Candidate prompts: first runs (13 of 20) and the spelling variant

| ID | Prompt | Domains surfaced (order, short) | CV? where | What the answer says | Read |
|---|---|---|---|---|---|
| X1 | pâtisserie Granby | the same 15 links as the L1 run: RestoMontreal (Mélisse #1, **CV #2**) · Tastet Montréal · TBR FR « pâtisseries » #5 (without CV) · TBR bakeries #6 · Wikipedia · spam and France pages | **yes, #2**; 2nd | Mélisse (flag), **Cocovanille** ("Artisanal French pastry mastery with vanilla"; hours conflict), Cake Design, "Annie" on rue Breton | The head term: CV is in the answer, behind a possibly closed shop. Fix the facts; get on the TBR « pâtisseries » list |
| X2 | boulangerie Granby | restomontreal.ca (La Mie Bretonne #1, **CV #4**) · jobbank.gc.ca ×2 · threebestrated.ca (FR boulangeries #5; bakeries #9) · circulaire-en-ligne.ca · BAnQ ×2 · en.wikipedia.org · fr.mappy.com · granbydrummer.com (US) · 13newsnow.com · tastet.ca · sortirauquebec.com | **yes, #4**; 2nd | Pain-Pain first **with (450) 770-7246** (closed 2026-06-16); CV 2nd with TBR's older hours **and** the RestoMontreal closed flag; Mélisse; La Mie Bretonne (189 Principale); St-Méthode (512 rue Guy); Julien's Bakery (Granby, CT, presented as "Granby centre") | Ghost #1 again; the same TBR fix as C8 |
| X3 | gâteau d'anniversaire Granby | **restomontreal.ca (CV FR, #1)** · ferrerorocher.com · threebestrated.ca (FR « pâtisseries ») · en.wikipedia.org · fondationolo.ca · quoifaire.com · … (26 links: recipes, France, Belgium, Switzerland) | **yes, #1**; first | A CV review: a raspberry birthday cake (framboisier) found « parfait ». Then rival prices « à partir de » 40–45 $ from a « répertoire » (likely the TBR list, link 3; seller not named, UNVERIFIED) | The best evidenced cake candidate: the page and the answer already point to CV |
| X4 | gâteau personnalisé Granby | **threebestrated.ca (FR « pâtisseries », #1)** · quoifaire.com · en.wikipedia.org · canva.com · cdn.website.dish.co (×2) · jotform.com · propoptions.co.uk · paris-friendly.fr · pagesjaunes.fr · restomontreal.ca (CV, #12) · airbnb.pl · mariages.net · fr.igraal.com · beta.openaire.eu · 118712.fr | **yes, #12**; 2nd | Cake Design first (TBR: custom and artistic cakes, "from about 40 $"). For CV, **only the January 2026 complaint** | The pillar prompt: TBR's cake list decides it, and CV's only cake fact is negative |
| X5 | gâteau sur mesure Granby | **restomontreal.ca (CV, #1)** · threebestrated.ca (#2) · quoifaire.com · pagesjaunes.fr · mariages.net (France ×7) · tastet.ca (×3) · restomontreal.ca (Mlles Gâteaux, Montréal ×2) · zola.com (Granby CT, MO) | **yes, #1**; 2nd | Cake Design first (TBR: custom, weddings, birthdays, cupcakes); CV second (custom cakes, with the flavour-error caveat); a workshop at Finfinettes, Granby, on 2026-10-10 | Same as X4 |
| X6 | pâtisserie française Granby | restomontreal.ca (La Mie Bretonne; Mélisse) · en.wikipedia.org · BAnQ · tastet.ca (Montréal ×2) · jobbank.gc.ca · themain.com · airbnb.cz · timeout.com · lepetitjournal.com · pvtistes.net · mesprestiges.com · europe1.fr · sortirauquebec.com | no | Mélisse ("artisanal French-inspired pastries"; flag) and La Mie Bretonne (a 4.95 $ baguette in a review) | A positioning query, not a buying one. It needs the owner's own wording ([[FACT NEEDED]], W44.10) |
| X7 | croissants Granby | tastet.ca (Croissant Croissant, Montréal, #1) · **restomontreal.ca (CV, #2)** · paxinasgalegas.es · restomontreal.ca (La Mie Bretonne) · ubereats.com (Shefford) · en.wikipedia.org · … many parasite and US pages (22 links) | **yes, #2**; first | No croissant guide for Granby. CV first ("I didn't see croissants named specifically in its listing"), then La Mie Bretonne | An empty slot for an evidenced product (01 §5): name the croissants on `/viennoiseries/` and as GBP products |
| X8 | croissant aux amandes Granby | **restomontreal.ca (CV, #1)**, then recipes and French retail products (18 links) | **yes, #1**; the only Granby name | "widely known for its selection of fresh pastries, including its almond croissants", plus the closed flag | Already CV's in the proxy. Long tail: fold into X7 |
| X9 | Paris-Brest Granby | 27 links on the Paris-Brest-Paris bike ride and the pastry (Wikipedia, RUSA, cycling media, recipes) | no | "nothing linking Paris-Brest to Granby" | No local intent visible. Keep Paris-Brest as a product on `/patisseries/` and the GBP, not as a prompt |
| X10 | vol-au-vent Granby | 25 links: recipes, dictionaries, BAnQ archives | no | "didn't turn up anything linking a vol-au-vent to Granby" | Wait for the holiday menu (14 P3) |
| X11 | gâteau de fête livraison Granby | lepetitjournal.com · royalcaribbean.com · quoifaire.com · zola.com (Granby CT, VT, CO, MO) · tastet.ca (×3) · ubereats.com (Granby CO; Granby QC bakery category) · form.jotform.com · elevete.com.my | no | No Granby bakery delivering birthday cakes; an Uber Eats category; an anonymous order form | Gated on delivery ([[FACT NEEDED]]); the built site offers pickup at 3 rue Court |
| X12 | café pâtisserie centre-ville Granby | **restomontreal.ca: 16 of 17 links** (Café ORÉE #1, Mélisse, Caféine & co, La Mie Bretonne, Mont Rose, Café Van Houtte, the « cafés Granby » list) · easterntownships.org | **no** | Café ORÉE (142 Principale; Google about 4.9, 80+), Mont Rose (190 Principale; about 4.6), Mélisse (flag), Caféine & co (139 Principale), La Mie Bretonne (4.2), Café de la Brûlerie, Café Van Houtte | A hole: CV serves coffee and calls itself « Pâtisserie & Café » on Facebook (owner-published), yet RestoMontreal's café pages do not list it (inferred). Fix the category at RestoMontreal and on the GBP |
| X13 | gâteau 8 pouces combien de portions | fr.accio.com · french.alibaba.com · **7 parasite "8-inch-cake" pages** (inferred) · seduc.cssdd.gouv.qc.ca · e.leclerc · calculover.com | no | No single figure: about 10–12 servings for an 8-inch layer (several sites). calculover.com uses a Wilton chart (9-inch round: 24 party or 32 wedding servings). Height matters | The calculator's field is open: a Québec page in inches, built on CV's own standards |
| B1–B3 variant | Pâtisserie Cocovanille Granby | restomontreal.ca (CV ×2) · threebestrated.ca (×2) · Wikipedia · Paris and Montréal pastry media | **yes, #1** | Correct address and phone; hours conflict; Google 4.9 (40+). Says RestoMontreal "points to an official website" that the results did not show | Add the site URL to RestoMontreal at launch |

### W44.4 Who owns the category in the proxy (30 runs)

Seed for `docs/19-marche-et-concurrence.md` §1 (« Qui possède le marché ») and `docs/16-recherche.md` §3. These counts are appearances in proxy lists, **not** Google share of voice.

**(a) By domain**

| Domain | What it is | Runs present (of 30) | Link #1 | In links 1–3 | Main answer source | Names CV? |
|---|---|---|---|---|---|---|
| restomontreal.ca | restaurant directory with Granby pages and review summaries | **20** | **14** | **16** | **11** | yes (CV page, FR/EN/vote) |
| threebestrated.ca | "3 best" listicle | 12 | 2 | 7 | 5 | bakeries (EN) and boulangeries (FR): yes; FR « pâtisseries » and cakes: no (03) |
| tastet.ca | Montréal food media | 11 | 1 | 6 | 0 | no |
| en.wikipedia.org (+ wikipedia.com) | encyclopedia | 12 | 1 | 4 | 0 | no |
| ubereats.com | delivery marketplace | 10 | 0 | 2 | 0 | no |
| zola.com | US wedding directory (US Granby pages) | 8 | 0 | 2 | 0 | no |
| quoifaire.com | events listings (Cantons-de-l'Est) | 6 | 1 | 4 | 0 | no |
| collections.banq.qc.ca | archive scans | 6 | 0 | 0 | 0 | — |
| sortirauquebec.com | Québec outings directory | 4 | 0 | 0 | 0 | no |
| easterntownships.org | Tourisme Cantons-de-l'Est | 2 | 1 | 2 | 1 | no |
| calculover.com | calculator site | 1 | 0 | 0 | 1 | no |
| — (answer found nothing local) | — | — | — | — | 12 | — |

Reading: in the proxy, **RestoMontreal is the category's de facto owner**: it is where engines read CV's rating, products, hours and the closed flag. It is a directory, not a competitor. Rank-first `16-market-intelligence.md` §2: be complete and correct there. Then give the engines the site (sameAs, About, key facts), so they stop needing the directory.

**(b) By owner type, W43 vs W44**

| Owner type | W43 (17 runs) | W44 (30 runs) | Examples (W44) | What it means for us |
|---|---|---|---|---|
| Local directories and listicles | 5 | 20 (RestoMontreal) · 12 (TBR) | restomontreal.ca, threebestrated.ca | Still the only surfaces that name CV. Fix the facts there first (W44.5) |
| Montréal food media | 3 | 11 | tastet.ca | Fills Granby gaps with Montréal names. A pitch target (Tastet made its Granby list with Tourisme Granby région, W43 C5) |
| Delivery marketplace | 0 | 10 | ubereats.com | Out of scope until delivery exists ([[FACT NEEDED]]). The Granby bakery page names Tim Hortons and "Made By Pam" |
| Tourism boards and travel guides | 1 (C2: islaguru.com) | 9 | easterntownships.org, bonjourquebec.com, mtl.org, sortirauquebec.com, cantonsdelest.com, tourismebrome-missisquoi.ca, quebec-cite.com, travel.destinationcanada.com, islaguru.com | They own the Zoo and terrace intents: listing and pitch targets. granbyregion.com never surfaced |
| Wedding directories | 8 | 9 | zola.com (US pages in 8 runs), weddingwire.ca, mariages.net | Mostly US Granby or France; no Eastern Townships vendor |
| US "Granby" pages | 4 | **13** | zola.com (CO, MA, CT, MO, VT), ubereats.com (CT, MA, CO), granbydrummer.com, destinationgranby.com, autoreserve.com | Say "Granby, Québec" in every EN/ES title, passage and profile |
| French-language pages from outside Québec | 8 | 16 of 26 non-brand | francetravail.fr, 118712.fr, tourismelandes.com, pagesjaunes.fr, mariages.net, dish.co PDFs, La Réunion sites | Québec French with CAD and inches still has no local rival |
| Parasite or spam pages (inferred) | 7 | 7 | mcsprogram.org, wep.iot.nokia.com, digilib.ucr.edu, beta.openaire.eu, fazzenda.com.br, champds.com, seven "8-inch-cake" pages | The lists are weak: a real, dated, signed page beats them |
| Archive scans | 6 | 6 | collections.banq.qc.ca | The local web is thin |
| Encyclopedias, dictionaries, official pages | 6 (encyclopedic or official) | 12 (Wikipedia alone) | en.wikipedia.org, fr.wiktionary.org, dictionnaire.lerobert.com, larousse.fr, jobbank.gc.ca | Definitions only |
| Granby competitors' own sites | 0 | **0** | — | 0 of 47 proxy runs. Confirm from Granby |
| Owned site, Facebook, Instagram, YouTube | 0 | **0** | — | The site is not live; social media does not carry these queries in the proxy |
| Yelp, Tripadvisor (.com, .ca) | 0 | 0 (tripadvisor.com.ar once) | — | 03 §4 lists them as claim targets; they did not surface |

### W44.5 What the answers say about Coco Vanille, and where to fix it

Rank-first rule (`16-market-intelligence.md` §9): a wrong fact is corrected at its source (the directory the engine read). Then the owned page is refreshed, and the answer is re-run the next week. All fixes below are white-hat: a correct profile, a factual request, a better page. Never a request to remove a live competitor; never review gating or incentives (rank-first `09-offsite-links.md` §5).

| Fact in the answer | Runs | Where it comes from | Correct value (source) | Fix at the source | Client doc |
|---|---|---|---|---|---|
| Open Mon–Sat 7–18 and Sun 8–15; phone (450) 770-7246 | B2 (B1: the phone) | TBR FR boulangeries list: Pain-Pain's data merged into CV's entry (inferred) | Mon–Tue closed · Wed–Sat 8:30–17:30 · Sun 9:30–17:00; 450-372-7177 (facts.json `hours.google_listing`, `phone.primary`) | Update request to TBR: CV's hours from the GBP. Add a refresh request for Pain-Pain (closed 2026-06-16; La Voix de l'Est, M105, Granby Express, see 03 §0.4) | `docs/06-annuaires-listicles.md` |
| Closed Sunday to Wednesday; Thu–Fri to 16:30, Sat to 15:00 | C8, X2 (one side of a conflict in L1, X1, B1, B3, B1-cocovanille) | TBR (2025 listing) | as above | The same TBR request. Then Allbiz, Wanderlog and find-open (01 §3) in the monthly citation sweep | `docs/06-annuaires-listicles.md` |
| « Cette entreprise peut être temporairement fermée » | B2, X2, X8 | RestoMontreal | trading (01, update 2026-10-27) | First check the GBP status (the flag may mirror it: 01 §4, inference; 14 S2). Then claim or update the RestoMontreal page | `docs/05-gbp-checklist.md`, `docs/06-annuaires-listicles.md` |
| Sunday 9:00–17:00 | L4 (and in B1, B3, B1-cocovanille) | RestoMontreal | Sun 9:30–17:00 | RestoMontreal hours update | `docs/06-annuaires-listicles.md` |
| Pain-Pain shown open and #1 | C8, X2 | TBR | closed 2026-06-16 (03 §0.4) | Part of the TBR request above | `docs/06-annuaires-listicles.md` |
| The January 2026 complaint as the cake-order fact | L2, L3, X4, X5 | RestoMontreal's review summary (a Google review) | A genuine review: it is not removed, hidden or buried | The owner's factual public reply on Google. The built checkout step « Votre récapitulatif est-il exact? » and the courriel confirmation (`apps/web/src/components/ordering/copy.js`). Fresh reviews through M3 (open-ended ask, no incentive, no gating) | `docs/03-messages-avis.md` |

Facts the answers repeat correctly. Keep them identical on the site, the GBP and the directories:
- 3 rue Court, Granby, and 450-372-7177 (every brand run).
- Google 4.9 from 40+ reviews (RestoMontreal header, "as of July 2026"): a third-party snapshot. On the site it appears only after reading Google directly, never as `aggregateRating` (01, update 2026-10-27).
- Almond croissants, Paris-Brest, custom cakes, a raspberry cake (B1, B1-cocovanille, X3, X8).
- The public-market purchase (B1, B3; the visit also in L1, X1, X7).

Name collisions seen in the brand runs:
- Pâtisserie Coco (Montréal, Chinatown: RestoMontreal and Tastet)
- Vanille Patisserie (Chicago)
- Grain de Vanille (Cancale)
- Pâtisserie Mont Coco (Les Arcs)
- Coco Crêpes Granby (RestoMontreal)
- Coco Vanilla Lounge (Accra)
- two perfume pages

choco.vanille (Le Marmiton), the closed Coco Vanille of La Réunion and Wanderlog's "Magog" did **not** appear in these answers. Keep `alternateName` "Pâtisserie Cocovanille", `sameAs` and « Granby, Québec » in every bio (03 §6).

Re-run B1, B2 and B3 every Monday until the wrong hours and phone are gone, and count four clean weeks before calling the fix done.

### W44.6 Winnability scores: all prompts (updated)

Rubric unchanged (§5): **W** = weak pages in the top 10? **A** = authority within reach? **S** = a surface we can win now? **B** = is the searcher a buyer? Each 1–5, total /20.

Labels used in the table:
- **Basis "W44 run"**: re-scored from this run.
- **Basis "W43 run"**: score kept from §5 (not re-run).
- **"cand."**: a candidate with its first proxy score. It stays outside the frozen set until the swap (W44.8).

Every score stays provisional until the Granby run.

| ID | Prompt | W | A | S | B | /20 | W43 | Tier | Basis | Why (brief) |
|---|---|---|---|---|---|---|---|---|---|---|
| I1 | combien coûte un gâteau de fête personnalisé à Granby | 4 | 4 | 4 | 4 | **16** | 16 | P1 | W43 run | Unchanged. The X3 and X4 answers quote rival prices from about 40–45 $ (from a directory, likely TBR); still no dated local price table |
| I2 | combien de jours d'avance commander un gâteau personnalisé | 5 | 4 | 4 | 3 | 16 | 16 | P2 · first reserve | W43 run | Same score; leaves the 10 on the buyer tie-break when L4 enters. Served by the « Délais » sections of `/gateaux-personnalises-granby/` and `/gateau-pour-demain/` |
| I3 | quelle grosseur de gâteau pour 20 personnes | 5 | 4 | 5 | 3 | **17** | 17 | P1 | W43 run | Unchanged. X13 shows the same weak field in inches (7 of 12 links are parasite pages) |
| I4 | comment transporter un gâteau à étages en auto | 5 | 5 | 4 | 2 | 16 | 16 | P2 | W43 run | Unchanged (post-purchase) |
| I5 | prix d'un gâteau de mariage par portion au Québec | 5 | 3 | 4 | 3 | 15 | 15 | P2 · gated weddings | W43 run | Unchanged |
| I6 | différence entre crème au beurre et ganache sur un gâteau | 4 | 3 | 4 | 2 | 13 | 13 | P3 | W43 run | Unchanged |
| I7 | comment conserver un gâteau à la crème jusqu'au lendemain | 5 | 4 | 4 | 2 | 15 | 15 | P2 | W43 run | Unchanged |
| I8 | how much does a custom birthday cake cost in Quebec | 4 | 3 | 4 | 4 | 15 | 15 | P2 | W43 run | Unchanged |
| I9 | how far in advance to order a wedding cake | 3 | 2 | 3 | 3 | 11 | 11 | P3 · gated | W43 run | Unchanged |
| I10 | cuánto cuesta una torta de quinceañera en Quebec | 5 | 5 | 4 | 3 | 17 | 17 | P2 · ES lane, gated | W43 run | Unchanged. C10 and L10 confirm 0 Spanish pages for Granby |
| C1 | meilleure pâtisserie à Granby | 4 | 4 | 5 | 5 | **18** | 18 | P1 | W43 run | Unchanged. X1 shows CV named 2nd behind a flagged Mélisse on the head term |
| C2 | meilleur gâteau de fête à Granby | 5 | 4 | 4 | 5 | **18** | 18 | P1 | W43 run | Unchanged. X3 shows CV's page at link 1 with a positive birthday-cake review |
| C3 | pâtisserie gâteau de mariage Cantons-de-l'Est | 5 | 4 | 3 | 5 | 17 | 17 | P2 · gated weddings | W43 run | Unchanged. C9 confirms an empty regional board |
| C4 | bûche de Noël Granby | 5 | 4 | 5 | 5 | 19 | 19 | P2 · conditional | W43 run | Unchanged. The owner's answer is due 2026-11-01 (14 P3) |
| C5 | macarons Granby avis | 5 | 4 | 4 | 4 | 17 | 17 | P2 · gated macarons | W43 run | Unchanged; swap candidate (W44.8) |
| C6 | gâteau sans gluten Granby | 5 | 5 | 3 | 4 | 17 | 17 | P2 · gated + legal | W43 run | Unchanged; swap candidate |
| C7 | prix gâteau de mariage Granby | 5 | 4 | 4 | 5 | 18 | 18 | P2 · gated weddings | W43 run | Unchanged |
| C8 | best bakery in Granby Quebec | 4 | 4 | 5 | 4 | **17** | 17 prov. | P1 | **W44 run** | TBR holds link 1 with a closed #1 and CV #2 (older hours in the answer); fixable now (TBR refresh, Yelp claim) |
| C9 | wedding cake bakery Eastern Townships | 5 | 4 | 3 | 5 | 17 | 17 prov. | P2 · gated weddings | **W44 run** | No Eastern Townships vendor; "Eastern" pulls 8 US town pages; swap candidate |
| C10 | mejor pastelería en Granby Quebec | 5 | 5 | 4 | 4 | 18 | 18 prov. | P2 · ES lane | **W44 run** | 0 Spanish bakery pages; Colorado content mixed in |
| L1 | pâtisserie près de moi | 3 | 4 | 5 | 5 | **17** | 17 prov. | P1 | W44 proxy variant | Still not measurable without a location; the variant equals X1. The pack is GBP-driven; the closed flag still shows on RestoMontreal |
| L2 | commander un gâteau de fête en ligne Granby | 3 | 4 | 3 | 5 | **15** | 14 prov. | P1 (project goal) | **W44 run** | W 2 → 3: the proxy list is weak (France, Dublin, Montréal, forms, parasite PDFs) and the rival carts did not surface, but 03 documents three carts that a Granby-located Google may show. S stays 3 until `/commander/` (built) is live |
| L3 | gâteau pour demain Granby | 5 | 5 | 4 | 5 | **19** | 19 prov. | P1 · gated next-day | **W44 run** | Nobody owns it, and the answer already says "call Cocovanille first". Only if the next-day policy is real (14 P4) |
| L4 | pâtisserie ouverte dimanche Granby | 4 | 4 | 5 | 5 | **18** | 17 prov. | **P1** (gate lifted) | **W44 run** | S 4 → 5: Sunday hours are owner-published, `/nous-trouver/` answers the question, and the answer already names CV |
| L5 | café et pâtisserie près du Zoo de Granby | 4 | 4 | 3 | 4 | 15 | 15 prov. | P2 | **W44 run** | Tourism pages and two cafés own it; the distance is unknown |
| L6 | chocolatines Granby | 5 | 5 | 4 | 4 | 18 | 18 prov. | P2 · gated chocolatines | **W44 run** | Empty answer, plus a rival claim (Rose Gâteaux, UNVERIFIED); swap candidate |
| L7 | boîte de pâtisseries pour réunion Granby | 5 | 4 | 3 | 5 | 17 | 16 prov. | P2 · gated office boxes | **W44 run** | W 4 → 5: nothing local, La Réunion pages instead. Wording fix and swap candidate (W44.8) |
| L8 | bakery near Granby Zoo | 5 | 4 | 3 | 4 | 16 | 15 prov. | P2 | **W44 run** | W 4 → 5: no Québec page at all (US Granby). The distance is unknown; add "Quebec" |
| L9 | order custom cake online Granby | 4 | 4 | 3 | 5 | **16** | 16 prov. | P1 | **W44 run** | 0 Québec links in the proxy (US Granby). W stays 4 because a Granby-located Google should localize; measure the "Quebec" variant |
| L10 | torta de cumpleaños personalizada Granby | 5 | 5 | 4 | 5 | 19 | 19 prov. | P2 · ES lane | **W44 run** | 0 Québec links; add "Quebec" |
| B1 | Pâtisserie Coco Vanille Granby avis | 4 | 5 | 5 | 4 | 18 | 18 prov. | B | **W44 run** | Directories own it. The answer is positive but carries a wrong second phone |
| B2 | Coco Vanille Granby heures | 4 | 5 | 5 | 5 | 19 | 19 prov. | B · **urgent** | **W44 run** | The answer gives another business's hours and phone (W44.5) |
| B3 | « Que sais-tu de la Pâtisserie Coco Vanille à Granby ? » | 4 | 5 | 4 | 3 | 16 | 16 prov. | B | W44 proxy (not an AI engine) | Correct name, address and phone; hours conflict; no owner story, which the About page will supply |
| X1 | pâtisserie Granby | 4 | 4 | 5 | 5 | 18 | — | cand. · swap-in | W44 run | The head term; CV 2nd behind a flagged shop |
| X2 | boulangerie Granby | 4 | 4 | 5 | 4 | 17 | — | cand. · swap-in | W44 run | The ghost #1 (Pain-Pain) leads; CV 2nd |
| X3 | gâteau d'anniversaire Granby | 5 | 4 | 4 | 5 | 18 | — | cand. · swap-in | W44 run | CV's page is link 1, with a positive review |
| X4 | gâteau personnalisé Granby | 4 | 4 | 4 | 5 | 17 | — | cand. · served by the C2/X3 pillar | W44 run | TBR's cake list first; CV's only fact is the complaint |
| X5 | gâteau sur mesure Granby | 4 | 4 | 4 | 5 | 17 | — | cand. · served by the pillar | W44 run | CV's page is link 1; Cake Design is first in the answer |
| X6 | pâtisserie française Granby | 4 | 4 | 3 | 3 | 14 | — | cand. · gated positioning | W44 run | CV absent; needs the owner's wording |
| X7 | croissants Granby | 5 | 5 | 4 | 4 | 18 | — | cand. · swap-in | W44 run | CV is the first Granby name; there is no croissant page anywhere |
| X8 | croissant aux amandes Granby | 5 | 5 | 5 | 4 | 19 | — | cand. · long tail, fold into X7 | W44 run | Already CV's in the proxy (the only Granby name). A high score on a narrow query: the empty local web, not a priority |
| X9 | Paris-Brest Granby | 5 | 5 | 3 | 2 | 15 | — | cand. · drop as a prompt | W44 run | A bike-ride SERP; no local intent visible |
| X10 | vol-au-vent Granby | 5 | 5 | 3 | 3 | 16 | — | cand. · gated holiday menu | W44 run | Nothing local |
| X11 | gâteau de fête livraison Granby | 5 | 4 | 2 | 5 | 16 | — | cand. · gated delivery | W44 run | Nothing local; the site offers pickup only |
| X12 | café pâtisserie centre-ville Granby | 3 | 4 | 4 | 4 | 15 | — | cand. · swap-in | W44 run | RestoMontreal holds 16 of 17 links; CV is absent from its café pages |
| X13 | gâteau 8 pouces combien de portions | 5 | 4 | 5 | 3 | 17 | — | cand. · calculator fan-out of I3 | W44 run | Parasite pages, and a Wilton chart via calculover |
| X14–X20 | (see §8) | | | | | — | — | candidate, not run | — | Not run in W44 (W44.1) |

Reading: as in W43, high totals mostly reflect an **empty local web**, not easy wins on Maps. The domain still has zero links and is not live. Expect months, not weeks (plan §2). The scores order the work; they promise no position.

### W44.7 The 10 priority prompts (updated): current owner and counter-move

The selection rule is unchanged (§6). What changed:
- **L4 enters** at 18: its gate is lifted.
- **I2 leaves** (16, on the buyer tie-break) and becomes the first reserve.
- L2 stays (15), kept because ordering is the project's goal.

Brand prompts are defended separately (W44.5). No ranking position is promised: what is promised is the process, the weekly measurement and the definition of first (research/12 §4; plan-v1 §1). Pages below are from the built page registry (`apps/web/src/lib/routes.js`). "Conditional" = the page is built but waits for owner facts before it publishes.

| # | ID | Prompt | Score | Current owner (proxy W44 / W43 / secondary) | Why they win | Counter-move (better page, profile, proof) | Blocking fact |
|---|---|---|---|---|---|---|---|
| 1 | L3 | gâteau pour demain Granby | 19 | **Nobody** (W44): no next-day page found. The answer sends people to call Cocovanille (RestoMontreal FR, link 14) and repeats the January 2026 complaint | No page exists for the intent; RestoMontreal fills the gap | Publish `/gateau-pour-demain/` (built, conditional: it waits for the cut-off hour and the next-day formats). Put the same answer in a GBP post and product. The order calendar already skips closed days (seed). The built « Écrivez-nous » chat can take same-day questions. The owner answers the January review factually | [[FACT NEEDED: next-day policy, cut-off hour, formats]] (14 P4) |
| 2 | C1 | meilleure pâtisserie à Granby | 18 | W43: restomontreal.ca (CV page #1; the answer named CV first with older hours). W44 related (X1, L1): RestoMontreal (Mélisse #1, CV #2); the TBR FR « pâtisseries » list without CV | Directory pages with ratings | **Defend:** fix the GBP status and hours (`docs/05-gbp-checklist.md`). RestoMontreal: closed flag, Sunday 9:30. TBR: refresh request plus an application to the cakes/pâtisseries list (`docs/06-annuaires-listicles.md`). Home page with the category sentence and a key-facts block. Review asks that let customers name « pâtisserie » (M3, `docs/03-messages-avis.md`) | [[FACT NEEDED: GBP status and access (14 S2); category sentence (01 §11)]] |
| 3 | C2 | meilleur gâteau de fête à Granby | 18 | W43: tastet.ca (Montréal list). W44 related (X3): CV's RestoMontreal page #1 with a positive raspberry birthday-cake review; rival prices from 40–45 $ via TBR | Media authority; no Granby list exists | `/gateaux-personnalises-granby/` (built, conditional) and `/gateaux/` (built) with a birthday section, a dated price table (`/prix/`, conditional) and real photos. The comparison page `/comparatif-gateau-de-fete-granby/` is **planned, not in the built registry**. Pitch Tastet and Tourisme Granby région with a price survey (`docs/04-pitch-media.md`) | [[FACT NEEDED: custom-cake range and prices (14 P1)]] |
| 4 | L4 | pâtisserie ouverte dimanche Granby | 18 | W44: restomontreal.ca (9 of 18 links); the answer names CV among four Sunday-open pâtisseries, with RestoMontreal's 9:00 | Directory hours pages | GBP hours (Sun 9:30–17:00) and holiday hours. `/nous-trouver/` (built) already answers « Êtes-vous ouverts le dimanche? ». Correct Sunday at RestoMontreal. Identical hours on Facebook, Apple Business and Bing Places (citation sweep, `docs/06-annuaires-listicles.md`) | [[FACT NEEDED: holiday hours; owner sign-off on the hours (14 H1)]] |
| 5 | L1 | pâtisserie près de moi | 17 | Map pack: unmeasured. Proxy variant = the X1 list (RestoMontreal + TBR) | Proximity + prominence (GBP) | GBP: primary category, photos, weekly posts, review replies within 24 h (`docs/05-gbp-checklist.md`). `/nous-trouver/` (built) with directions. Monthly local grid from the Granby run (§9) | [[FACT NEEDED: GBP owner access, status, categories (14 S2)]] |
| 6 | C8 | best bakery in Granby Quebec | 17 | W44: threebestrated.ca (link 1: the closed Pain-Pain #1, CV #2 with older hours); Uber Eats; US Granby pages | A stale listicle | TBR refresh request with the closure articles and CV's GBP hours. Claim Yelp with the right categories. `/en/` (built) titled "… Granby, Quebec" | none (act now) |
| 7 | I3 | quelle grosseur de gâteau pour 20 personnes | 17 | W43: synonyme-du-mot.com (content farm). W44 (X13): parasite pages (7 of 12) + calculover.com (Wilton chart) | A size-to-portions table | `/calculateur-portions-gateau/` (built, conditional): a server-rendered table in inches and cm, and a 40–60-word answer under the question heading, built on CV's own standards | [[FACT NEEDED: CV portion standards per pan size (14 P1)]] |
| 8 | L9 | order custom cake online Granby | 16 | W44: no Québec page at all; 17 US links (zola.com Granby CO, MA, CT; Kroger; Wegmans) | US pages win on the bare word "Granby" | `/en/custom-cakes-granby/` (built, conditional) and `/en/order/` (built), with "Granby, Quebec" in the title and the first passage. Measure the "Quebec" variant (W44.8) | [[FACT NEEDED: EN service capacity]] |
| 9 | I1 | combien coûte un gâteau de fête personnalisé à Granby | 16 | W43: threebestrated.ca + € PDFs ("no Granby price found"). W44 (X3, X4): rival prices from about 40–45 $ from a directory (likely TBR), seller unnamed | Nobody publishes a dated local price table | `/prix/` (built, conditional): a dated table (size → portions → $ → lead time), taxes stated, "ce qui change le prix". GBP products with prices | [[FACT NEEDED: price grid (14 P1)]] |
| 10 | L2 | commander un gâteau de fête en ligne Granby | 15 | W44: **nobody**. The answer says there is no online cake-ordering platform in Granby, and names CV via RestoMontreal (link 17) with the complaint. The rival carts (03) did not surface in the proxy | — | `/commander/` (built): pickup slots, the price before payment, the recap « Votre récapitulatif est-il exact? », the courriel confirmation. At launch: a GBP order link and the Apple Business order action | [[FACT NEEDED: products, prices, pickup capacity (14 P1, O1)]] |

Reserves:
- I2 (16): served inside the pillar's « Délais » section and `/gateau-pour-demain/`.
- L8 (16): ties I1 at 16 with B = 4. It stays out because its "near the Zoo" claim waits on the distance fact, and French is the core market. It also needs the "Quebec" variant.

Conditional and side lanes (updated):
- **C4 bûche de Noël Granby (19):** unchanged. It becomes #1 for November–December only if the owner confirms bûches by **2026-11-01** (14 P3). A new domain will not rank by Christmas: win it on the GBP (products and posts), Facebook and the phone. The built `/buches-de-noel/` is conditional.
- **ES lane (I10, C10, L10):** 0 Québec Spanish pages in three runs. The `/es/` pages exist behind `ENABLE_ES` (M10). Add "Quebec" to the measured wording.
- **Wedding set (I5, I9, C3, C7, C9):** frozen until wedding capacity is confirmed (14 P2).

If the R5 swap (W44.8) is approved, X3 and X1 (18) enter ahead of L9 and I1 (16), and X7 (18) ahead of L1 and C8 (17). X8 folds into X7, and X4 and X5 into the C2/X3 pillar (one intent = one page, 00 §5.2).

### W44.8 Prompt-set changes with W44 evidence (IDs unchanged)

**(a) Wording fixes** (add as variants to the Monday run; prompt IDs stay)

| ID | Current | Proposed variant(s) | W44 evidence | Status |
|---|---|---|---|---|
| L8 | bakery near Granby Zoo | "bakery near Granby Zoo Quebec" | 9 of 12 links are US Granby pages; no Québec bakery named | evidence |
| L9 | order custom cake online Granby | "order custom cake online Granby Quebec" · "… Granby QC" | 0 Québec links of 17 | evidence |
| L10 | torta de cumpleaños personalizada Granby | "… Granby Quebec" · "… Granby Québec" | 0 Québec links of 15; the answer asked whether Granby is in Quebec | evidence |
| C9 | wedding cake bakery Eastern Townships | add "wedding cake Granby Quebec" (keep §7's « gâteau de mariage Estrie ») | "Eastern" pulled 8 pages on 7 US "East …" towns | evidence (gated) |
| L7 | boîte de pâtisseries pour réunion Granby | test « boîte de viennoiseries pour le bureau Granby » | « réunion » pulled 8 La Réunion links | evidence for the collision; the variant is a hypothesis |
| L1 | pâtisserie près de moi | measure from a phone only; in the proxy, the city variant equals X1 | identical link lists | evidence |
| X9 | Paris-Brest Granby | drop as a prompt; keep the product on `/patisseries/` and the GBP | a bike-ride SERP | evidence |
| B1–B3 | (as §7) | keep the « Cocovanille » spelling in the Monday run | the variant returned the same two directories and the same hours conflict | evidence |

**(b) The R5 swap, with W44 evidence.** research/15 R5 says: swap the gated prompts before the week-1 freeze (X1, X2, X7, X3, X12). Below is a mapping proposal for the operator (« Agence ») and the owner (14 P2). This track does not change `data/prompts.csv`: its IDs are stable, and its scores are still those of W43.

| Gated prompt (why gated) | Proposed replacement | W44 evidence for the replacement | Condition |
|---|---|---|---|
| C5 macarons Granby avis (macarons not evidenced; W43 pulled Trustpilot pollution) | X3 gâteau d'anniversaire Granby | CV's page is link 1, with a positive birthday-cake review | swap unless the owner confirms macarons (14 P2) |
| C6 gâteau sans gluten Granby (offer unconfirmed + labelling and legal review) | X1 pâtisserie Granby | CV named 2nd on the head term | swap unless the owner confirms a controlled gluten-free process and the legal review passes (07) |
| L6 chocolatines Granby (not evidenced) | X7 croissants Granby | CV is the first Granby name; croissants are evidenced (01 §5) | swap unless the owner confirms chocolatines; `/viennoiseries/` serves both |
| L7 boîte de pâtisseries pour réunion Granby (office boxes unconfirmed; La Réunion collision) | X2 boulangerie Granby | CV 2nd, behind the closed Pain-Pain | swap unless the owner confirms office boxes |
| C9 wedding cake bakery Eastern Townships (weddings unconfirmed) | X12 café pâtisserie centre-ville Granby | CV is absent: a fixable category gap (the café is owner-published) | swap unless the owner confirms weddings |

Effect of this mapping:
- Language mix: 22 FR / 5 EN / 3 ES (was 21 / 6 / 3).
- Type mix: 10 informational / 8 commercial / 12 local, because X1 and X12 are local in `data/prompts.csv`. X1 may be filed as commercial instead: its results are directory- and listicle-led.
- If weddings are not offered, the other four wedding prompts (I5, I9, C3, C7) get replacements chosen from the candidate list at that time.

### W44.9 Listicles and directories seen in W44 (seed for docs/16 §7.3 and docs/06)

| Page (URL in Sources) | Type | Runs (link #) | CV on it? | Issue seen in W44 | Move (proof only) |
|---|---|---|---|---|---|
| TBR « 3 Best Bakeries in Granby, QC » | listicle | C8 (#1) · L1 and X1 (#6) · X2 (#9) · B1 (#7) · B3 (#3) · B1-cocovanille (#3) | yes, #2 (03) | the closed Pain-Pain is #1; CV's older hours | update request with the closure articles and the GBP hours → `docs/06-annuaires-listicles.md` |
| TBR « 3 Meilleures Boulangeries à Granby » | listicle | B1 (#4) · B2 (#2) · B3 (#4) · B1-cocovanille (#6) · X2 (#5) | yes (03) | B2's answer took Pain-Pain's hours and phone from it (inferred) | the same request, for the FR page |
| TBR « 3 Meilleurs Pâtisseries à Granby » | listicle | L1 and X1 (#5) · L6 (#15) · X3 (#3) · X4 (#1) · X5 (#2) | no (03) | holds X4; feeds the X3 and X4 answers (Cake Design, rival prices) | apply for inclusion with photos, the review count and the price page once live |
| TBR « 3 Best Cakes in Granby, QC » | listicle | C8 (#10) | no (03) | — | the same application |
| RestoMontreal: Pâtisserie Cocovanille (FR, EN, vote) | directory profile | 16 runs; link #1 in B1, B2, B3, B1-cocovanille, X3, X5, X8 | yes | « temporairement fermée » (B2, X2, X8); Sunday 9:00 | claim and update; add the website at launch |
| RestoMontreal « cafés Granby » list | directory list | X12 (#10) | no (not in the answer) | CV missing from the café answer | category request (café): the café is owner-published on Facebook |
| Uber Eats « Bakery delivery in Granby » | marketplace | C8 (#2) · L8 (#3) · X11 (#14) | no | Tim Hortons, "Made By Pam" | out of scope until delivery exists ([[FACT NEEDED]]) |
| Tastet « Nos restaurants coups de cœur à Granby » | media list | C10 (#2, #3) · X2 (#15) | no | no bakery on it (03) | pitch with a data study once the site is live → `docs/04-pitch-media.md` |
| Eastern Townships « Happiness is a terrace » | tourism article | L5 (#1) · X12 (#2) | no | the source for "café near the Zoo" answers | listing request at Tourisme Cantons-de-l'Est |
| WeddingWire.ca vendor pages | wedding directory | C9 (#3, #4) | no | no Eastern Townships vendor | a profile only if weddings are offered ([[FACT NEEDED]]) |
| Tripadvisor AR « Restaurantes de Granby » | directory | C10 (#1) | not shown | the only Spanish-language page | claim the Tripadvisor listing (03 §4) |

### W44.10 Still open

**(a) Human runs** (→ `docs/13-taches-humaines.md`; person: 14 D1)
1. **Phone in Granby** (google.ca, location on), for the 33 prompts plus X1–X13. Record per prompt:
   - map pack top 3
   - organic top 10
   - the snippet owner
   - the first 4 PAA questions
   - whether an AI Overview shows, and its cited domains
2. **SERP API** with the location set to Granby, Québec (§9).
3. **The five AI engines** (ChatGPT, Perplexity, Gemini, Claude, Copilot), one row per prompt per engine, in `scoreboard/runs/<week>.csv`. Alternative: `node tools/ai-runs.mjs` with API keys, which writes `scoreboard/runs/<week>-ai.csv`.
   - Priority: B2 (are the wrong hours repeated?), B3 (entity merges), C1, C8, L3, L4.
   - Rhythm: 3 runs per cell, 4 consecutive Mondays (research/12 §4).

**(b) Files**
- §9 named the human run's file `data/serp-baseline-2026-W44.csv`. The human run did not happen in W44, so that file now holds this proxy. File the human run under its own week, for example `data/serp-baseline-2026-W45.csv` with `engine = google-granby-phone`.
- Move `scoreboard/runs/2026-W44.csv` to `scoreboard/runs/proxy/` before the first real week is filed (W44.1).

**(c) [[FACT NEEDED]] that change the scores** (update of §10)

| Fact | Prompts affected | W44 change |
|---|---|---|
| GBP status (not "temporarily closed") and owner access (14 S2) | L1, C1, C8, B1–B3, X1, X2, X8 | RestoMontreal still shows the flag, and three W44 answers repeat it |
| Hours: site-published since 2026-10-27; owner sign-off (14 H1) and holiday hours | L4, B2, C1, C8, X2 | L4 is ungated; the directories still carry older or wrong hours (W44.5) |
| Next-day policy, cut-off hour, formats (14 P4) | L3, I2 | unchanged |
| Price grid, sizes, portions per size (14 P1) | I1, I3, I8, L2, L9, X3, X4, X5, X13 | unchanged |
| Wedding cakes offered? (14 P2) | I5, I9, C3, C7, C9, X15, X16 | unchanged; C9 is still empty |
| Bûches (answer due 2026-11-01, 14 P3), macarons, chocolatines, gluten-free, office boxes, quinceañera, delivery, a holiday menu with vol-au-vent (14 P2) | C4, C5, L6, C6, L7, I10, X11, X10 | unchanged |
| Driving time from 3 rue Court to the Zoo, and the Zoo's address (the L5 answer says 525 rue Saint-Hubert: UNVERIFIED) | L5, L8 | confirm the address on the Zoo's own site before any directions copy |
| Seats and coffee offer | X12 | new (the built FAQ already asks it) |
| The owner's own word for the style (« pâtisserie française »?) | X6 | new |
| Food-safety storage guidance (MAPAQ / Health Canada URL) | I7 | unchanged |

### W44.11 Hand-offs to other tracks (noted here, not applied)

This track only appends to research/05. Every item below is a search-summary value, UNVERIFIED unless stated.

- **research/01 and `data/facts.json`:**
  - (450) 770-7246 is given for Pain-Pain on TBR (X2 answer) and for CV in B1 and B2. Record it as a third-party error, never as CV's number.
  - An Aug–Sep 2026 public-market review (B1 answer) corroborates trading in 2026.
  - La Mie Bretonne's Granby branch is at 189 rue Principale, per RestoMontreal (03 §1 had no Granby address).
- **research/03 and `data/competitors.csv`:** new names or figures:
  - "Made By Pam" (Uber Eats, 4.5; which Granby is not stated)
  - Café de la Brûlerie (4 rue de la Gare, 450-372-2200)
  - Caféine & co (139 rue Principale; 9–16 in L5 vs a 7:00 weekday opening in X12)
  - Café ORÉE: Google about 4.9 (80+)
  - Mont Rose Granby: (579) 365-3444; open Sunday; "10:00–23:00 daily" per a directory
  - La Mie Bretonne: Sunday 8:30–14:00; Google 4.2
  - Chocolats Favoris Granby (800 rue Principale)
  - Café Van Houtte Granby
  - Rose Gâteaux: "chocolatines" and "since 2010"
  - Cake Design: "from about 40 $" (TBR)
  - Finfinettes (a cake-decorating workshop, Granby, 2026-10-10)
  - Julien's Bakery is in Granby, CT; destinationgranby.com is Granby, CO
- **research/11, `data/directories.csv`, `data/pitch-list.csv`:**
  - the TBR update request
  - RestoMontreal: status flag, Sunday 9:30, café category, website at launch
  - easterntownships.org as the source the answers use for cafés near the Zoo
  - granbyregion.com never surfaced in 47 proxy runs
- **research/15:**
  - evidence for R5 (W44.8)
  - an R25 mitigation: the proxy file rule (W44.1, W44.10)

### W44.12 Search log (2026-10-29, WebSearch standard mode, US-located, 30 queries)

Run in five parallel batches of six, in this order.

| # | Query (verbatim) | Prompt | Lang | Links | CV named in the answer? | Main answer source |
|---|---|---|---|---|---|---|
| 1 | best bakery in Granby Quebec | C8 | EN | 18 | yes (2nd, older hours) | threebestrated.ca |
| 2 | wedding cake bakery Eastern Townships | C9 | EN | 20 | no | none (gap) |
| 3 | mejor pastelería en Granby Quebec | C10 | ES | 17 | no | none (gap) |
| 4 | pâtisserie près de moi Granby | L1 (variant) | FR | 15 | yes (2nd) | restomontreal.ca |
| 5 | commander un gâteau de fête en ligne Granby | L2 | FR | 17 | yes (1st, with the complaint) | none (gap) |
| 6 | gâteau pour demain Granby | L3 | FR | 18 | yes (1st, with the complaint) | none (gap) |
| 7 | pâtisserie ouverte dimanche Granby | L4 | FR | 18 | yes (2nd of 4) | restomontreal.ca |
| 8 | café et pâtisserie près du Zoo de Granby | L5 | FR | 16 | no | easterntownships.org |
| 9 | chocolatines Granby | L6 | FR | 16 | no | none (gap) |
| 10 | boîte de pâtisseries pour réunion Granby | L7 | FR | 18 | no | none (gap) |
| 11 | bakery near Granby Zoo | L8 | EN | 12 | no | none (gap) |
| 12 | order custom cake online Granby | L9 | EN | 17 | no | none (gap) |
| 13 | torta de cumpleaños personalizada Granby | L10 | ES | 15 | no | none (gap) |
| 14 | Pâtisserie Coco Vanille Granby avis | B1 | FR | 17 | yes (wrong second phone) | restomontreal.ca |
| 15 | Coco Vanille Granby heures | B2 | FR | 18 | yes (**wrong hours and phone**) | threebestrated.ca |
| 16 | Que sais-tu de la Pâtisserie Coco Vanille à Granby ? | B3 (proxy) | FR | 17 | yes | restomontreal.ca |
| 17 | Pâtisserie Cocovanille Granby | B1–B3 variant | FR | 17 | yes | restomontreal.ca |
| 18 | pâtisserie Granby | X1 | FR | 15 | yes (2nd) | restomontreal.ca |
| 19 | boulangerie Granby | X2 | FR | 16 | yes (2nd, older hours, flag) | threebestrated.ca |
| 20 | gâteau d'anniversaire Granby | X3 | FR | 26 | yes (1st, positive) | restomontreal.ca |
| 21 | gâteau personnalisé Granby | X4 | FR | 18 | yes (2nd, complaint only) | threebestrated.ca |
| 22 | gâteau sur mesure Granby | X5 | FR | 19 | yes (2nd, with the complaint) | threebestrated.ca |
| 23 | croissants Granby | X7 | FR | 22 | yes (1st) | restomontreal.ca (partial gap) |
| 24 | café pâtisserie centre-ville Granby | X12 | FR | 17 | **no** | restomontreal.ca |
| 25 | gâteau 8 pouces combien de portions | X13 | FR | 12 | no | calculover.com (mixed) |
| 26 | gâteau de fête livraison Granby | X11 | FR | 16 | no | none (gap) |
| 27 | Paris-Brest Granby | X9 | FR | 27 | no | none (gap) |
| 28 | pâtisserie française Granby | X6 | FR | 17 | no | restomontreal.ca |
| 29 | vol-au-vent Granby | X10 | FR | 25 | no | none (gap) |
| 30 | croissant aux amandes Granby | X8 | FR | 18 | yes (the only one) | restomontreal.ca |

Total: 534 links. Not run in W44: X14–X20 (W44.1); every AI engine (W44.10).

### Sources (W44)

All seen 2026-10-29 through WebSearch (standard mode, US-located), grouped by the run whose results surfaced them. Where only the key links are listed, the domains of the other links are in `data/serp-baseline-2026-W44.csv` (`cited_domains`). Third-party facts are search-summary values about those third parties.

**Brand and directory pages (several runs)**
- RestoMontreal – Pâtisserie Cocovanille (FR) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ — seen 2026-10-29 (L2, L3, L4, B1, B2, B3, B1-cocovanille, X2, X3, X4, X5, X8)
- RestoMontreal – Pâtisserie Cocovanille (EN, vote) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/vote/ — seen 2026-10-29 (C8, L1, B1, B3, B1-cocovanille, X1, X7)
- Three Best Rated – 3 Best Bakeries in Granby, QC — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-29 (C8, L1, B1, B3, B1-cocovanille, X1, X2)
- Three Best Rated – 3 Meilleures Boulangeries à Granby — https://threebestrated.ca/fr-boulangeries-in-granby-qc — seen 2026-10-29 (B1, B2, B3, B1-cocovanille, X2)
- Three Best Rated – 3 Meilleurs Pâtisseries à Granby — https://threebestrated.ca/fr-gâteaux-in-granby-qc — seen 2026-10-29 (L1, L6, X1, X3, X4, X5)
- Three Best Rated – 3 Best Cakes in Granby, QC — https://threebestrated.ca/cakes-in-granby-qc — seen 2026-10-29 (C8)
- RestoMontreal – Mélisse Pâtisserie (EN, vote) — https://www.restomontreal.ca/resto/melisse-patisserie-granby/20631/en/vote/ — seen 2026-10-29 (L1, L4, B3, X1, X6)
- RestoMontreal – Mélisse Pâtisserie (EN) — https://www.restomontreal.ca/resto/melisse-patisserie-granby/20631/en/ — seen 2026-10-29 (C8, L4, X12)
- RestoMontreal – La Mie Bretonne Granby (FR) — https://www.restomontreal.ca/resto/la-mie-bretonne-granby/23177/fr/?k=baguette — seen 2026-10-29 (L3, L4, X2, X6, X12)
- RestoMontreal – La Mie Bretonne Granby (EN) — https://www.restomontreal.ca/resto/la-mie-bretonne-granby/23177/en/ — seen 2026-10-29 (X7)
- Uber Eats – Bakery delivery in Granby, QC — https://www.ubereats.com/ca/category/granby-qc/bakery — seen 2026-10-29 (C8, L8, X11)

**C8**
- Uber Eats – Granby, CT bakery — https://www.ubereats.com/category/granby-ct/bakery — seen 2026-10-29
- Uber Eats – Granby, MA bakery — https://www.ubereats.com/category/granby-ma/bakery — seen 2026-10-29
- Scott's Directories – Granby commercial bakeries — https://scottsdirectories.com/canada-b2b-database/quebec/granby/naics311814-commercial-bakeries-and-frozen-bakery-product-manufacturing — seen 2026-10-29
- Destination Canada – best bakeries Québec City — https://travel.destinationcanada.com/en-us/things-to-do/best-bakeries-quebec-city — seen 2026-10-29
- + 9 other links (Uber Eats dish pages, atly, Matador, Job Bank, The Coast, blogTO, restoenligne)

**C9**
- Tourisme Cantons-de-l'Est – A cornucopia of cuisine (press release) — https://www.cantonsdelest.com/presse/communiques/1477/a-cornucopia-of-cuisine-in-the-eastern-townships — seen 2026-10-29
- HuffPost (2016) – food tour, Eastern Townships — https://www.huffingtonpost.ca/2016/04/15/food-tour-quebec-eastern_n_9608758.html — seen 2026-10-29
- WeddingWire.ca – La Gâtisserie — https://www.weddingwire.ca/wedding-cakes/la-gatisserie--e2141 — seen 2026-10-29
- WeddingWire.ca – Éphémère gâteaux de saison — https://weddingwire.ca/wedding-cakes/ephemere-gateaux-de-saison--e71399 — seen 2026-10-29
- BC Living – The Eastern Townships: a gourmet destination — https://bcliving.ca/travel/canada/the-eastern-townships-a-gourmet-destination/ — seen 2026-10-29
- Zola – East Winthrop, ME (one of 8 US "East …" pages) — https://zola.com/wedding-vendors/search/east-winthrop-me--wedding-cakes-desserts?page=28 — seen 2026-10-29
- Tourisme Brome-Missisquoi (post) — https://tourismebrome-missisquoi.ca/en/wp-json/wp/v2/posts/5186 — seen 2026-10-29
- Ripplecove – The Gourmands — https://ripplecove.com/en/the-gourmands — seen 2026-10-29

**C10**
- Tripadvisor AR – Restaurantes de Granby — https://www.tripadvisor.com.ar/Restaurants-g182165-Granby_Quebec.html — seen 2026-10-29
- Tastet – Our favourite restaurants in Granby — https://tastet.ca/en/lists/nos-restaurants-coups-de-coeur-a-granby/ — seen 2026-10-29
- Tastet – The best pastry shops in Montreal — https://tastet.ca/en/lists/the-best-pastry-shops-in-montreal-where-to-find-them — seen 2026-10-29
- Destination Granby – Sweet treats around town — https://www.destinationgranby.com/blog/post/sweet-treats-around-town/ — seen 2026-10-29
- Sortir au Québec – pastry chef baker — https://sortirauquebec.com/en/where-to-go/category/pastry-chef-baker — seen 2026-10-29
- Uber Eats – banana bread, Granby QC — https://www.ubereats.com/ca/dish/granby-qc/banana-bread — seen 2026-10-29

**L1 (variant) and X1** (identical lists)
- Tastet – Pâtisserie Madeleine (Montréal) — https://tastet.ca/en/reviews/patisserie-madeleine-small-delights-on-beaubien-east/ — seen 2026-10-29
- Wikipedia – Pâtisserie — https://en.wikipedia.org/wiki/P%C3%A2tisserie — seen 2026-10-29
- France Travail – pâtissier job, Granville (France) — https://candidat.francetravail.fr/offres/recherche/detail/191ZBPP — seen 2026-10-29
- Airbnb PY – things-to-do place (subject not shown) — https://www.airbnb.com.py/things-to-do/places/a1f216ff-8aa5-4ccc-a689-e58d9d414706 — seen 2026-10-29
- + 8 other links (Wikipedia Petit four, harringayonline, bluediamond.gg, Uber Eats, websites.ca, mesprestiges)

**L2**
- Le Petit Journal (Dublin) – trouver rapidement un gâteau — https://lepetitjournal.com/dublin/comment-trouver-rapidement-un-gateau-pour-sa-fete-323093 — seen 2026-10-29
- Tastet – meilleurs gâteaux d'anniversaire à Montréal — https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/ — seen 2026-10-29
- Quoifaire – Cake decorating workshop (Cantons-de-l'Est) — https://quoifaire.com/en/cantonsdelest/events/atelier-decoration-de-gateau — seen 2026-10-29
- mcsprogram.org PDF (parasite, inferred) — https://mcsprogram.org/ProductPdf/u501AE/246551/La%20Course%20Au%20Ga%20Teau.pdf — seen 2026-10-29
- Zola – Granby, MO — https://zola.com/wedding-vendors/search/granby-mo--wedding-cakes-desserts?page=32 — seen 2026-10-29
- + 10 other links (Royal Caribbean, Jotform, Yapla, Islaguru, Canva, Uber Eats, Milled, HelloAsso)

**L3**
- Zola – Granby, VT sugar-free — https://www.zola.com/wedding-vendors/search/granby-vt--wedding-cakes-desserts--sugar-free — seen 2026-10-29
- dish.co – Pâtisseries orientales (PDF) — https://cdn.website.dish.co/media/10/2f/8664500/Patisseries-orientale.pdf — seen 2026-10-29
- BAnQ document — https://collections.banq.qc.ca/document/s/t/BRRlpHborGFbAPETOfQ0DQ — seen 2026-10-29
- + 12 other links (recipes, Vikidia, Youdao, a 2022 school recipe PDF)

**L4**
- RestoMontreal – Café ORÉE Pâtisserie (EN, vote) — https://www.restomontreal.ca/resto/cafe-oree-patisserie-granby/23173/en/vote/ — seen 2026-10-29
- RestoMontreal – Mont Rose Pâtisserie & Café Granby — https://www.restomontreal.ca/resto/mont-rose-patisserie-cafe-granby/23174/en/?k=granby — seen 2026-10-29
- RestoMontreal – Mélisse Pâtisserie (FR) — https://www.restomontreal.ca/resto/melisse-patisserie-granby/20631/fr/ — seen 2026-10-29
- Tourisme Landes – La Grange à Pain (France) — https://www.tourismelandes.com/?p=74691 — seen 2026-10-29
- 118712.fr – boulangerie ouverte le dimanche à Grenoble — https://www.118712.fr/annuaire/ville/grenoble-38/boulangerie-ouverte-le-dimanche — seen 2026-10-29

**L5**
- Eastern Townships – Happiness is a terrace — https://www.easterntownships.org/article/641/happiness-is-a-terrace — seen 2026-10-29 (L5, X12)
- Seven Days (VT) — https://www.sevendaysvt.com/?p=216932 — seen 2026-10-29
- mtl.org – Zoo de Granby — https://www.mtl.org/fr/quoi-faire/culture-arts-patrimoine/zoo-de-granby — seen 2026-10-29
- RestoMontreal – Caféine & co — https://www.restomontreal.ca/resto/cafeine-co-granby/14344/fr — seen 2026-10-29
- Bonjour Québec – Zoo de Granby — https://www.bonjourquebec.com/fr-ca/repertoire/quoi-faire/zoo-de-granby/0oek — seen 2026-10-29
- Eastern Townships – Zoo de Granby — https://www.easterntownships.org/meetings/activities/116/zoo-de-granby — seen 2026-10-29
- Sortir au Québec – Zoo de Granby — https://sortirauquebec.com/en/listing/zoo-aquarium/zoo-de-granby — seen 2026-10-29

**L6**
- RestoMontreal – Chocolats Favoris Granby — https://www.restomontreal.ca/resto/chocolats-favoris-granby/11246/en/ — seen 2026-10-29
- Wikipedia – Pain au chocolat — https://en.wikipedia.org/wiki/Pain_au_chocolat — seen 2026-10-29
- Uber Eats – Granby, CO chocolate bread — https://www.ubereats.com/dish/granby-co/chocolate-bread — seen 2026-10-29
- Wiktionnaire – chocolatine — https://fr.wiktionary.org/wiki/chocolatine — seen 2026-10-29
- Le Robert – chocolatines — https://dictionnaire.lerobert.com/en/definition/chocolatines — seen 2026-10-29

**L7**
- Gilles Pudlowski – pâtisseries, La Réunion — https://www.gillespudlowski.com/recherche/Boutiques/P%C3%A2tisseries/France%20(DROM)/La%20R%C3%A9union/ — seen 2026-10-29
- Leader Réunion – commerce category — https://www.leaderreunion.fr/en/categorie/expert/commerce/page/2/ — seen 2026-10-29
- Réunion tourism – Calicoco, Saint-Paul — https://en.reunion.fr/offers/calicoco-saint-paul-en-558760 — seen 2026-10-29
- HelloAsso – vente de gâteaux (France) — https://www.helloasso.com/associations/fcpe-91-la-ville-du-bois/boutiques/vente-gateaux-bijou-les-renondaines-v2 — seen 2026-10-29
- Zeffy – précommande de biscuits (Québec) — https://www.zeffy.com/fr-CA/ticketing/precommande-de-biscuits-sourire-printemps-maison-de-la-famille-du-granit — seen 2026-10-29
- Zola – Granby, CT — https://zola.com/wedding-vendors/search/granby-ct--wedding-cakes-desserts?page=3 — seen 2026-10-29

**L8**
- Edible CT East – Julien's farm store opens a bakery café — https://ediblecteast.ediblecommunities.com/eat/a-little-oasis-in-granby-expands-juliens-farm-store-opens-a-new-larger-bakery-cafe/ — seen 2026-10-29
- Granby Drummer – Julien Tessier opens second bakery location — https://granbydrummer.com/?p=3710075 — seen 2026-10-29 (L8, X2)
- Destination Granby – Rollin' Street Bakery — https://www.destinationgranby.com/blog/post/welcome-to-granby-rollin-street-bakery/ — seen 2026-10-29
- Visit Grand County — https://www.visitgrandcounty.com/?p=1927 — seen 2026-10-29
- Superpages – Granby, MA zoos — https://www.superpages.com/granby-ma/zoos — seen 2026-10-29

**L9**
- wep.iot.nokia.com (parasite, inferred) — https://wep.iot.nokia.com/order-custom-cake-online — seen 2026-10-29
- Zola – Granby, CO — https://zola.com/wedding-vendors/search/granby-co--wedding-cakes-desserts — seen 2026-10-29
- Zola – Granby, MA — https://www.zola.com/wedding-vendors/search/granby-ma--wedding-cakes-desserts — seen 2026-10-29
- Kroger – custom cakes — https://www.kroger.com/d/bakery/custom-cakes — seen 2026-10-29
- Oh Danish Bakery – guide to ordering custom cakes — https://ohdanishbakery.com/hygge-blog/dessert-guide/the-ultimate-guide-to-ordering-custom-cakes — seen 2026-10-29

**L10**
- Mendoza – tortas personalizadas — https://www.mendoza.gov.ar/catalogoeconomiasocial/producto/tortas-personalizadas/ — seen 2026-10-29
- Zola – Granby, MA gluten-free — https://zola.com/wedding-vendors/search/granby-ma--wedding-cakes-desserts--gluten-free — seen 2026-10-29
- digilib.ucr.edu (parasite, inferred) — https://digilib.ucr.edu/custom-birthday-cakes — seen 2026-10-29
- + 12 other links (Argentina, Spain, Chile, Peru, Portugal, Zola VT)

**B1**
- RestoMontreal – Pâtisseries, Quartier chinois (Montréal) — https://www.restomontreal.ca/restaurants/patisseries-quartier-chinois/fr/?c=332&d=3 — seen 2026-10-29
- RestoMontreal – Pâtisserie Coco (Montréal) — https://www.restomontreal.ca/resto/patisserie-coco-montreal/20249/fr/?page=4 — seen 2026-10-29
- The Infatuation – Vanille Patisserie (Chicago) — https://www.theinfatuation.com/chicago/reviews/vanille-patisserie — seen 2026-10-29
- Maisons de Bricourt – Grain de Vanille — https://www.maisons-de-bricourt.com/en/page/grain-de-vanille — seen 2026-10-29
- Airbnb DK – things-to-do place (subject not shown) — https://www.airbnb.dk/things-to-do/places/57fec99c-ac8c-4fd0-9192-971729a7a0c7 — seen 2026-10-29
- Les Arcs – Pâtisserie Mont Coco — https://www.lesarcs.com/en/stay/all-shops-and-restaurants/patisserie-mont-coco — seen 2026-10-29

**B2**
- RestoMontreal – Coco Crêpes Granby — https://www.restomontreal.ca/resto/coco-crepes-granby/23155/en/ — seen 2026-10-29
- Scent Advice – Coco Vanille perfume — https://scentadvice.com/coco-vanille-2025-boulangerie/ — seen 2026-10-29
- Scent Verdict – Coco Vanilla eau de parfum — https://scentverdict.com/perfume/perfume-parlour-coco-vanilla-eau-de-parfum — seen 2026-10-29
- Time Out Accra – Coco Vanilla Lounge Bar — https://www.timeout.com/accra/bars-and-pubs/coco-vanilla-lounge-bar — seen 2026-10-29
- BAnQ document — https://collections.banq.qc.ca/document/s/t/pNaNJHS5NU53ClobmlXlbw — seen 2026-10-29

**B3 and the variant**
- Tastet – Pâtisserie Coco, Quartier chinois — https://tastet.ca/critiques/patisserie-coco-quartier-chinois/ — seen 2026-10-29
- Le Fooding – Grain de Vanille — https://lefooding.com/commerces/grain-de-vanille — seen 2026-10-29
- Wikipedia – List of French desserts — https://en.wikipedia.org/wiki/List_of_French_desserts — seen 2026-10-29
- Time Out Montréal – une des meilleures pâtisseries au monde — https://www.timeout.com/fr/montreal/nouvelles/cest-officiel-montreal-abrite-lune-des-meilleures-patisseries-au-monde-082524 — seen 2026-10-29

**X2**
- Circulaire en ligne – Boulangerie St-Méthode Granby — https://www.circulaire-en-ligne.ca/annuaire/boulangerie-st-methode/granby — seen 2026-10-29
- BAnQ document — https://collections.banq.qc.ca/document/s/t/g-oY0ZaMemOkX2E0gJAKEA — seen 2026-10-29
- Sortir au Québec – Le Café de la Brûlerie — https://sortirauquebec.com/en/listing/restaurants-et-bonnes-tables/le-cafe-de-la-brulerie/ — seen 2026-10-29

**X3**
- Wikipedia – Granby, Quebec — https://en.wikipedia.org/wiki/Granby,_Quebec — seen 2026-10-29
- Fondation OLO – recette gâteau de fête (PDF) — https://fondationolo.ca/media/mdebhwtk/fondation-olo-recette-gateau-fete-v2.pdf — seen 2026-10-29
- + 22 other links (recipes, France, Belgium, Switzerland, dictionaries)

**X4**
- dish.co – Gâteaux personnalisés (PDF) — https://cdn.website.dish.co/media/f4/69/9546646/Gateaux-personnalises.pdf — seen 2026-10-29
- Mariages.net – Gâteau Création — https://www.mariages.net/wedding-cake/gateau-creation--e32972 — seen 2026-10-29
- beta.openaire.eu (parasite, inferred) — https://beta.openaire.eu/gateau-gucci-anniversaire-k.html — seen 2026-10-29

**X5**
- Mariages.net – Ton gâteau sur mesure — https://www.mariages.net/wedding-cake/ton-gateau-sur-mesure--e372805 — seen 2026-10-29
- RestoMontreal – Mlles Gâteaux (Montréal) — https://www.restomontreal.ca/resto/mlles-gateaux-montreal/21632/fr/ — seen 2026-10-29
- Zola – Granby, CT — https://zola.com/wedding-vendors/search/granby-ct--wedding-cakes-desserts?page=28 — seen 2026-10-29

**X6**
- Tastet – Pâtisserie Mélilot (Montréal) — https://tastet.ca/en/reviews/patisserie-melilot-a-new-gem-on-laurier-avenue-west/?region=mtl — seen 2026-10-29
- PVTistes forum – boulangeries et pâtisseries françaises — https://pvtistes.net/forum/bons-plans-et-infos-sur-les-villes-canadiennes/36078-liste-des-boulangeries-et-patisseries-francaises-a-post353771.html — seen 2026-10-29
- Sortir au Québec – Shaker Granby — https://sortirauquebec.com/en/listing/restaurants-and-dining/shaker-cuisine-mixologie-granby/ — seen 2026-10-29

**X7 and X8**
- Tastet – Croissant Croissant (Montréal) — https://tastet.ca/en/reviews/croissant-croissant-croissant-heaven-on-the-plateau/?region=mtl — seen 2026-10-29
- Uber Eats – croissants, Shefford — https://www.ubereats.com/ca/dish/shefford-qc/croissants — seen 2026-10-29
- Autoreserve – Granby, CT café — https://autoreserve.com/de/us/connecticut/granby — seen 2026-10-29
- Québec Cité – bakeries for the best croissants — https://quebec-cite.com/en/restaurants-quebec-city/bakeries-for-best-croissants — seen 2026-10-29
- Chocolate & Zucchini – almond croissants — https://chocolateandzucchini.com/archives/2006/03/almond_croissants.php — seen 2026-10-29

**X9 and X10**
- RUSA – Paris-Brest-Paris — https://rusa.org/node/237 — seen 2026-10-29
- Wikipedia – Paris–Brest–Paris — https://en.wikipedia.org/wiki/Paris%E2%80%93Brest%E2%80%93Paris — seen 2026-10-29
- Wikipedia – Vol-au-vent — https://en.wikipedia.org/wiki/Vol-au-vent — seen 2026-10-29
- BAnQ document — https://collections.banq.qc.ca/document/s/t/02olyyRpaZD2g3MhduYoDw — seen 2026-10-29

**X11**
- Jotform – Choisissez votre gâteau — https://form.jotform.com/261451746813055 — seen 2026-10-29
- Zola – Granby, CO — https://zola.com/wedding-vendors/search/granby-co--wedding-cakes-desserts?page=22 — seen 2026-10-29

**X12**
- RestoMontreal – Café ORÉE Pâtisserie (EN) — https://www.restomontreal.ca/resto/cafe-oree-patisserie-granby/23173/en/ — seen 2026-10-29
- RestoMontreal – Caféine & co (FR, vote) — https://www.restomontreal.ca/resto/cafeine-co-granby/14344/fr/vote/ — seen 2026-10-29
- RestoMontreal – Cafés Granby list — https://www.restomontreal.ca/restaurants/cafes-granby/en/?c=25%2C307&d=103 — seen 2026-10-29
- RestoMontreal – Mont Rose Granby (EN) — https://www.restomontreal.ca/resto/mont-rose-patisserie-cafe-granby/23174/en/ — seen 2026-10-29
- RestoMontreal – Café Van Houtte Granby — https://www.restomontreal.ca/resto/cafe-van-houtte-granby/16741/fr/ — seen 2026-10-29

**X13**
- Accio – gâteau 8 pouces combien de personnes — https://fr.accio.com/plp/gateau-8-pouces-combien-de-personnes — seen 2026-10-29
- Calculover – cake serving calculator (FR) — https://calculover.com/fr/food-cooking/baking/cake-serving/ — seen 2026-10-29
- High Altitude Science "8 inch cake" (one of 7 parasite pages, inferred) — https://tools.highaltitudescience.com/post/8-inch-cake — seen 2026-10-29

**Internal (repo files used, read-only)**
- research/05 §1–§10 (W43, this file); research/01-business-facts.md (update 2026-10-27, §3–§8); research/03-competitors.md (§0–§7); research/12-plan-review.md §4; research/14-owner-questions.md (S1, S2, H1, P1–P4, O1, D1); research/15-decisions-and-risks.md (R5, R25)
- data/facts.json (`hours.google_listing`, `phone.primary`, `service.next_day_phone_order`, `products.named`, `products.custom_cakes`); data/prompts.csv; data/serp-baseline-2026-W43.csv
- README.md (stage: built, not deployed); apps/web/src/lib/routes.js (`PAGES`); apps/web/src/seed/content.js (FAQ answers: Sunday hours, Zoo, chocolatines, café); apps/web/src/components/ordering/copy.js (checkout recap) — state of 2026-10-29, read only
- rank-first references 04-research-prompts.md, 09-offsite-links.md §5, 10-measurement.md, 16-market-intelligence.md; assets/scoreboard/runs-template.csv and README.md; tools/citation-share.mjs, tools/market.mjs, tools/lib.mjs (`isoWeek`: 2026-10-29 = 2026-W44, 2026-11-02 = 2026-W45)
