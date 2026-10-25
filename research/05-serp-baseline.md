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
