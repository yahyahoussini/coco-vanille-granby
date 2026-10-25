# 11 · Off-site: citations, media, partners, review engine, video plan (Granby / Cantons-de-l'Est)

As of 2026-10-25 (ISO week 2026-W43). Ranking Stack Layers 12 (local), 13 (reviews), 15 (mention engine), 16 (risk). Québec rules override the Morocco-oriented rank-first references.
Machine-readable twins: `data/directories.csv` (34 rows), `data/pitch-list.csv` (16 rows).

**Method and limits (read first)**

- 15 WebSearch queries, run 2026-10-25. Each one is logged in §9. WebSearch runs from the US and returns summaries. No page was opened: WebFetch and curl are blocked.
- Earlier facts are reused, not searched again. They are cited "via research/0X".
- "Not surfaced" means this search did not show it. That is absence of evidence, not proof that a listing does not exist.
- Contact routes for media were **not** surfaced. Every one is `[[FACT NEEDED]]`. No email address is guessed.
- Gated items (weddings, delivery, bûches, macarons, gluten-free, corporate boxes) depend on the owner's answers in research/01 §12.

---

## 0. Findings that change decisions

1. **Clean up first, create second.** About 15 citations already exist (via research/01 §7). The costly errors are:
   - a "may be temporarily closed" flag on RestoMontreal;
   - six conflicting hour schedules;
   - Wanderlog lists the shop in "Magog";
   - MapQuest spells it "Coco Vanill";
   - PagesJaunes uses "Inc" in the trade name and may show a second phone number;
   - Three Best Rated still ranks the closed Pain-Pain as #1.
   All of these copy from one master record. Fix that record (the GBP) in week 0, then correct the copies.
2. **The data feeds behind AI answers can be claimed, and we do not know their status.** The sources are mostly secondary:
   - ChatGPT may use Foursquare and Bing;
   - Perplexity may use Yelp;
   - Copilot uses Bing (via research/06 §o).
   No Yelp, Foursquare, Restaurant Guru or 411 listing for Coco Vanille surfaced this turn. Claim or create the listings in weeks 1–2, using one spelling and the hours from the GBP.
3. **Coco Vanille is missing from the whole tourism layer.**
   - Tourisme Granby région has no listing for it (via research/03).
   - Tourisme Cantons-de-l'Est covers close to 1,400 tourism businesses and sits on Bonjour Québec's Table nationale de l'accueil ([TCE job posting](https://www.cantonsdelest.com/apropos/emplois-tce/job-download?id=31)).
   - The Réseau des Haltes gourmandes groups 50+ producers within 15 minutes of Granby ([Le Québec à vélo](https://www.lequebecavelo.ca/en/tourist-attractions/reseau-des-haltes-gourmandes-en-haute-yamaska)). Rival Gâteaux Duvoquic is a member (via research/03).
   - Membership terms and fees for all three: `[[FACT NEEDED]]`.
4. **The "Chamber of Commerce 5.0/11" profile is not the local chamber.** That profile, cited in research/01, is canada.chamberofcommerce.com, a separate directory site (inference from the domain). The local chamber's name conflicts between sources:
   - "Chambre de commerce et de l'industrie Haute-Yamaska", ccihy.com ([Village.ai](https://village.ai/company/ccihy), UNVERIFIED);
   - "Chambre de commerce Haute-Yamaska et région", 650 rue Principale, 450 372-6100 ([BAnQ archive](https://collections.banq.qc.ca/document/s/t/g-oY0ZaMemOkX2E0gJAKEA), older and possibly outdated).
5. **Two items drop to P3.**
   - Le Panier Bleu: its 2026 status is unclear. It became transactional in Oct 2022 ([Le Soleil](https://www.lesoleil.com/2022/10/05/le-panier-bleu-est-enfin-transactionnel-85de9ca8a68ba6cee5c1911272d670c4)). One headline speaks of « la fin du Panier Bleu » (undated, [François Charron](https://francoischarron.com/gadgets-techno/web-applications/la-fin-du-panier-bleu-que-devrions-nous-faire-maintenant/gA6vgHvg1u/)).
   - Aliments du Québec certifies **products**, not shops: at least 85% Québec ingredients, or "préparé au Québec" ([quebec.ca](https://www.quebec.ca/agriculture-environnement-et-ressources-naturelles/agriculture/achat-local-tourisme-gourmand/reconnaitre-les-aliments-quebecois)).
6. **The wedding layer stays gated, and its map is nearly empty.**
   - No Granby wedding-cake vendor appears on WeddingWire (via research/03).
   - Only two venues surfaced: Vignoble de la Bauge in Brigham (a century-old barn renovated in 2012, up to 150 guests; [Tourisme Brome-Missisquoi](https://tourismebrome-missisquoi.ca/en/blogue/four-gorgeous-vineyards-for-a-wedding/)) and the Residence Inn Bromont ([Marriott](https://www.marriott.com/fr/hotels/yulrb-residence-inn-bromont/events/)).
   - No wedding photographers or planners surfaced.
7. **The local media core is La Voix de l'Est, Granby Express and M105.** All three covered Granby business closures in 2026 (via research/03), so they report on local commerce. Coco Vanille already got press in 2022 (Radio-Canada and La Voix de l'Est: the market kiosk, via research/01). No newsroom contact surfaced.
8. **Food creators and Facebook groups cannot be found by web search.**
   - A Granby creator directory shows no food creator ([Collabstr](https://collabstr.com/top-influencers/in/canada/quebec/granby)).
   - No Granby parents' or buy-local Facebook group surfaced.
   - Both need a manual check on Instagram, TikTok and Facebook. No names are invented here.
9. **The review engine is legal and realistic, under three rules.**
   - Google's rules: ask every customer, no incentives, no staff names (via research/18).
   - CASL's implied consent lasts about 2 years after a purchase (secondary sources quoting the CRTC).
   - Unsubscribes are honoured within 10 business days.
   Pace: Google shows 40+ reviews (2026-08-01) and Mont Rose 70+ (Oct 2026) (via research/03). At the plan's 3 reviews a week, Coco Vanille passes Mont Rose's snapshot in about 10 weeks (computed: (70 − 40) / 3).

---

## 1. Citation rules (apply to every row of `data/directories.csv`)

| Rule | Why | Source |
|---|---|---|
| The GBP is the master record. Every listing copies its name, hours and phone | The aggregators share the Google spelling and hour pattern | via research/01 §2, §3 |
| One name spelling everywhere, decided by the owner. Put the other spelling only in the schema's `alternateName` | "Cocovanille" (Google and its mirrors) vs "Coco Vanille" (registry, Facebook, Tripadvisor, press) | via research/01 §2.3 |
| Import into Bing Places only after the GBP is final | The import copies errors | via research/06 §c |
| Never ask for Yelp reviews. Claim the listing only | Yelp prohibits soliciting reviews (secondary sources, 2017–18) | via research/18 #4c |
| No keywords and no second language in any profile's name field | Google profile rule; plan-v1 §10, §13 | via plan-v1 |
| Studio › Fiches runs a monthly diff of every live listing against the master record | Hours drift on 6 sources today | via research/06 §o, plan-v1 §9 |

### 1.1 Sweep order (one move per week, plan-v1 §10 rhythm)

| Week | Moves | Gate |
|---|---|---|
| 0 | Owner confirms open status, hours, sign name, GBP access. Clear any "temporarily closed" status. Set GBP categories, products and photos | research/01 §12 items 1–3 |
| 1 | Apple Business ("Commander" action at launch), Bing Places import, Facebook and Instagram name, hours and link | GBP final |
| 2 | Claim or create Foursquare and Yelp (claim only). Claim Tripadvisor. Fix PagesJaunes (name, phone) | — |
| 3 | Correction requests: RestoMontreal (closure flag, hours), Three Best Rated (Pain-Pain closed; cakes list), Wanderlog (city), MapQuest (typo), find-open and canada.chamberofcommerce.com (hours) | GBP fixed and indexed |
| 4–6 | Local chamber, Tourisme Granby région, Tourisme Cantons-de-l'Est and Bonjour Québec, Haltes gourmandes (if eligible). Marché public page: ask for the website link | membership fees `[[FACT NEEDED]]` |
| Gated | WeddingWire.ca and Bridebook (weddings), delivery apps (delivery), Le Panier Bleu (still running?), Aliments du Québec (per product) | owner answers |
| Quarterly | Mirror sweep: foodpages, allbiz, D&B, bdir.in, Sluurpy, 411, Restaurant Guru, MapQuest | — |

### 1.2 What each surface feeds (summary)

| Surface | Feeds (verdict) | Coco Vanille status |
|---|---|---|
| GBP | Google local pack and Maps; Gemini (Partly) | exists; status and access `[[FACT NEEDED]]` |
| Apple Business | Apple Maps place card; an "order food" action exists on Apple's Canadian page (Confirmed, undated) | not checked |
| Bing Places | Bing Maps; Copilot integration *planned* | not checked |
| Foursquare | ChatGPT place data (Partly, secondary) | not surfaced |
| Yelp | Perplexity (Partly, single source); Apple Maps (UNVERIFIED) | not surfaced |
| Tripadvisor | visitors; one ChatGPT source deck (Partly) | listing d27188801, ratings conflict |
| RestoMontreal, Three Best Rated | named in the C1 and C8 answers in the W43 proxy | listed; flags to fix |
| Tastet | cited for C2, I8 and C5 | not on the Granby list |
| OpenStreetMap, Waze | not searched (Search queue) | not checked |

All verdicts come via research/05 §C1–C8 and research/06 §(c), §(o).

---

## 2. Media and pitch list (summary of `data/pitch-list.csv`)

| Priority | Outlet | Why them | First angle (proof only) |
|---|---|---|---|
| P1 | La Voix de l'Est (Granby daily) | Granby local-business desk; covered Coco Vanille in 2022 | Q1 data study « Prix des gâteaux de fête à Granby » (dated method, chart, one-line credit) |
| P1 | Granby Express | Local news; recent articles on the 2026 population decree and the Zoo's 2025 results (via research/01) | Same study, plus the Fêtes pre-order date |
| P1 | M105 (CFXM-FM 104.9) | The Granby radio found ([Wikipedia](https://en.wikipedia.org/wiki/CFXM-FM)); a cooperative | Short interview with the study's numbers |
| P1 | Tastet | Cited by AI engines for our prompts; its Granby list has no bakery | Ask to be considered for the Granby list |
| P1 | Three Best Rated, RestoMontreal | Listicles AI engines repeat | Corrections, not pitches |
| P2 | ICI Radio-Canada (Estrie) | Covered Granby merchants (2022) and immigration in Granby | Regional data study; community story only if real and consented |
| P2 | La Tribune (Sherbrooke) | Covers Granby (2023, 2025) | Estrie-wide data study |
| P2 | Narcity Québec | Ran a Bromont pâtisserie feature | A visual, specific product story |
| P2 | Tourisme Granby région, Tourisme Cantons-de-l'Est | Tourism editorial roundups | Next gourmet roundup; seasonal roundup only if the offer is real |
| P3 | Caribou (spring and fall themed issues), Noovo Moi, Le Nouvelliste | Long-lead or seasonal novelty | Only when the theme fits |

Pitch rules:
- 5–10 pitches a quarter (plan-v1 §8).
- One idea per email. Data with method and date. No exclusivity claims we cannot keep.
- No paid coverage unless disclosed and marked `rel="sponsored"`.
- Creators: disclosure follows Ad Standards (plan-v1 §10). The guideline text itself was not re-checked.

Pitch template (FR, ≤ 120 words):

> Objet : Granby — combien coûte un gâteau de fête en 2027? (relevé daté)
> Bonjour [Prénom],
> Nous avons relevé les prix publiés de [n] pâtisseries et épiceries de Granby le [date]. Résultat : de [x] $ à [y] $ la portion. Méthode, tableau et graphique : [lien]. Libre de reprise avec la mention « Source : Pâtisserie Coco Vanille, relevé du [date] ».
> Je peux vous expliquer comment on calcule la portion (5 min au téléphone).
> [Nom], Pâtisserie Coco Vanille, 3 rue Court, Granby · 450-372-7177

The study's seed numbers already exist in research/03 §2b (custom cakes at about $4.40–6.70 a portion, supermarkets at $2.25–3.40). Re-verify them on the study's own date.

---

## 3. Partner targets

Partners should publish a page that names Coco Vanille: a case study, a "fournisseurs" page or a linked testimonial (rank-first 09 §2.2). Ask for that link in the same message as any thank-you.

| Target | Type | What is known (source) | Ask | Gate |
|---|---|---|---|---|
| Marché public de Granby et région | existing partner | Coco Vanille is a listed exhibitor (via research/01) | website link on the exhibitors page; a market-day post | 2026 participation `[[FACT NEEDED]]` |
| Réseau des Haltes gourmandes en Haute-Yamaska | agri-food trail | 50+ members within 15 min of Granby; 111 rue Denison Est ([Le Québec à vélo](https://www.lequebecavelo.ca/en/tourist-attractions/reseau-des-haltes-gourmandes-en-haute-yamaska)) | membership, if a downtown pâtisserie qualifies | eligibility `[[FACT NEEDED]]` |
| Fromagerie Julio | non-competing producer | Family cheese dairy, 1647 boul. David-Bouchard Nord, Granby; milk processed on site ([Québec Vacances](https://www.quebecvacances.com/fr/attractions/fromagerie-julio)) | cross-listing in a « Guide gourmand de Granby » (plan-v1 §10 grey-move rules); local-ingredient story **only if** Coco Vanille really uses their dairy | `[[FACT NEEDED]]` |
| Le Café de la Brûlerie | coffee roaster (rue de la Gare, Granby) | Arabica roasted on site ([Eastern Townships](https://easterntownships.org/restaurants/581/le-cafe-de-la-brulerie)) | if Coco Vanille serves their coffee: mutual "on sert / on vend" mention | the café overlaps a little: check the coffee supplier `[[FACT NEEDED]]` |
| Chocolats Favoris (Granby) | chocolate and dipped ice cream | Granby location on RestoMontreal ([RestoMontreal](https://www.restomontreal.ca/resto/chocolats-favoris-granby/11246/fr/)) | low; partial dessert overlap; chain approvals likely | P3 |
| Zoo de Granby | attraction (~665k visitors in 2025, secondary, via research/01) | Has a press room; signed a teaching partnership with the Cégep de Granby (Feb 2023) ([Zoo press room](https://www.zoodegranby.com/en/press-room), [academica.ca](https://academica.ca/?p=7660)) | listing in visitor-planning material; pickup-on-arrival boxes | visitor offer, distance and boxes `[[FACT NEEDED]]`; whether the Zoo works with local food suppliers: not surfaced |
| Cégep de Granby | college | Runs a tourism techniques program tied to the Zoo partnership ([academica.ca](https://academica.ca/?p=7660)) | a talk (plan-v1 §8); student events; internship | contact `[[FACT NEEDED]]` |
| Large Granby employers | B2B boxes (prompt L7) | Only old data surfaced: in 2015, 24.4% of Granby's workforce was in manufacturing (2016 source); the industrial park had 121 industrial firms and 6,400+ jobs (2008 source); names in old articles: Transformateurs Delta (Granby; 200+ employees in Québec), IBM Bromont (1,500+) (BAnQ archive; which document holds which fact is UNVERIFIED) | office boxes, rentrée and Fêtes | corporate offer `[[FACT NEEDED]]`; current employer list `[[FACT NEEDED]]` |
| SERY (newcomer services, Granby) | community organization | Granby is one of 14 Québec destination cities for government-assisted refugees; Colombians are among the main groups (via research/01 §9.4) | ES-page review by a native speaker; community events | an ES offer must exist; no tokenism |
| Wedding venues | GATED | Vignoble de la Bauge, Brigham: barn for up to 150 guests ([Tourisme Brome-Missisquoi](https://tourismebrome-missisquoi.ca/en/blogue/four-gorgeous-vineyards-for-a-wedding/)); Residence Inn Bromont: wedding spaces ([Marriott](https://www.marriott.com/fr/hotels/yulrb-residence-inn-bromont/events/)); Granby venues: none surfaced | a "real wedding" story credited to the venue | weddings `[[FACT NEEDED]]` |
| Wedding photographers and planners | GATED | none surfaced for Cantons-de-l'Est (Search queue) | photo credits on real weddings | weddings |
| Local chamber (Haute-Yamaska) | association | name and site conflict (§0.4) | membership, directory, a talk | fee `[[FACT NEEDED]]` |

Rule: a « Guide gourmand de Granby » on our site features complementary businesses only, with stated criteria and a disclosure. It never ranks competing bakeries (plan-v1 §10).

---

## 4. Review engine

### 4.1 Rules (hard-coded in Studio › Avis)

| Rule | Basis |
|---|---|
| Ask **every** completed order: no filter by satisfaction, open complaints included | Google: no gating; no selective asking (via research/18 #4b) |
| No incentives of any kind (discount, draw, gift) for a review, an edit or a removal | Google removes incentivized reviews (via research/18 #4b); Competition Act (plan-v1 §14) |
| No staff names, no star count, no product named in the request | Google rating-manipulation clauses added 2026-04-17 (secondary, via research/18 #4a) |
| No per-staff targets, counts or leaderboards. The ≥ 3/week goal is shop-level only | via research/18 #4a and the §4 Layer 12 fix |
| Google is the only platform asked. No Yelp asks. Tripadvisor asks wait until its policy is checked | via research/18 #4c; Search queue |
| One request per order. No reminder chain. No bulk blast to old customers | Design choice (keeps velocity natural; CASL caution) |
| Replies within 48 h, drafted by AI, approved by the owner (plan-v1 §9) | Design choice |

### 4.2 Touchpoints

| Touchpoint | What | Notes |
|---|---|---|
| Box sticker or card with QR | QR → `https://cocovanillegranby.com/avis` → 302 to the GBP review link | The printed link never changes. The target is editable in Studio. Copy the GBP link from the profile's "ask for reviews" option (feature name and URL format: verify in GBP) |
| Counter card + one spoken line | « Si vous avez deux minutes, un avis Google nous aide beaucoup. » | Same line for everyone; no "5 étoiles" |
| Day-after message (email or SMS) | Sent at 10 h the day after the event date (or the pickup date if there is no event date) | CASL note §4.3 |
| Order confirmation page | No review ask (the cake has not been eaten) | — |

### 4.3 CASL note (not legal advice; counsel to confirm)

- Is a review request a commercial electronic message (CEM)? **Not settled in our sources.** We treat it as one, the conservative choice.
- **Implied consent (existing business relationship).** A purchase gives implied consent for about **2 years**, generally from the purchase. A new purchase restarts the clock. These are secondary sources quoting the CRTC ([Kimoby](https://help.kimoby.com/casl-compliant-text-messaging-explained), [Constant Contact](https://knowledgebase.constantcontact.com/articles/KnowledgeBase/5924), [Conestoga College](https://www.conestogac.on.ca/canadas-anti-spam-legislation)).
- **An inquiry alone gives 6 months** ([Laurentian FAQ](https://laurentian.ca/assets/files/General-Counsel/FAQ-on-CASL.pdf)). Quote requests without a purchase therefore get no review ask.
- **The business must prove consent.** Studio stores the order ID, date and channel as consent evidence ([Conestoga College](https://www.conestogac.on.ca/canadas-anti-spam-legislation)).
- **Unsubscribe within 10 business days** ([BLG](https://blg.com/-/media/legacy-news-and-publications/documents/publication_4937.pdf)). Every message carries sender identification, contact details and an unsubscribe link (SMS: "STOP").
- The transactional exemption (s. 6(6)(b)) covers messages that *solely* confirm or complete a transaction (via research/16a, statute text not re-read). A review request probably does **not** qualify (our inference). So the review ask is never folded into the « C'est prêt! » SMS.
- Loi 25: the privacy notice states this use of the contact details. Wording: `[[FACT NEEDED: counsel]]`.

```js
// Studio job (sketch): plan one review request per completed order.
// No satisfaction filter, no incentive, no staff name, never twice.
export function planReviewRequest(order, now = new Date()) {
  const DAY = 86_400_000;
  const base = new Date(order.eventDate ?? order.pickedUpAt);
  const sendAt = new Date(base.getTime() + DAY);
  sendAt.setHours(10, 0, 0, 0); // scheduler runs in Eastern time

  const daysSincePurchase = (now - new Date(order.paidAt)) / DAY;
  const blocked =
    order.status !== 'picked_up' ||   // completed orders only, every one of them
    order.reviewRequestSentAt ||      // one request per order
    order.contact.unsubscribedAt ||   // CASL opt-out honoured
    daysSincePurchase > 730;          // implied-consent window (~2 years; counsel to confirm)
  if (blocked) return null;

  return {
    sendAt,
    channel: order.contact.prefersSms ? 'sms' : 'email',
    lang: order.lang,                 // 'fr' | 'en' | 'es'
    template: 'review_request_v1',
    link: 'https://cocovanillegranby.com/avis',
    consentEvidence: { basis: 'implied_ebr_purchase', orderId: order.id, paidAt: order.paidAt },
  };
}
```

### 4.4 Request templates

Banned in every language:
- « 5 étoiles »;
- naming a product (« parlez de notre Paris-Brest »);
- naming staff;
- « si vous avez aimé… sinon écrivez-nous » (this is gating);
- any gift.

| | FR (default) | EN | ES |
|---|---|---|---|
| Email subject | Merci pour votre commande, [Prénom] | Thank you for your order, [First name] | Gracias por su pedido, [Nombre] |
| Email body | Bonjour [Prénom], merci d'avoir choisi Pâtisserie Coco Vanille (commande n° [1042]). Si vous avez deux minutes, votre avis sur Google nous aide beaucoup : [lien]. Bonne journée! | Hi [First name], thank you for choosing Pâtisserie Coco Vanille (order #[1042]). If you have two minutes, a Google review helps us a lot: [link]. Have a great day! | Hola [Nombre]: gracias por elegir Pâtisserie Coco Vanille (pedido n.º [1042]). Si tiene dos minutos, su reseña en Google nos ayuda mucho: [enlace]. ¡Que tenga un buen día! |
| Email footer | Pâtisserie Coco Vanille · 3 rue Court, Granby (QC) J2G 4Y6 · 450-372-7177 · Vous recevez ce message à la suite de votre achat. Se désabonner : [lien] | … · You are receiving this because of your purchase. Unsubscribe: [link] | … · Recibe este mensaje por su compra. Darse de baja: [enlace] |
| SMS (≤ 160 chars target) | Coco Vanille : merci pour la commande n° [1042]! Votre avis Google nous aide : [lien court] · 450-372-7177 · STOP pour arrêter | Coco Vanille: thanks for order #[1042]! A Google review helps us: [short link] · 450-372-7177 · Reply STOP to opt out | Coco Vanille: ¡gracias por el pedido n.º [1042]! Su reseña en Google nos ayuda: [enlace] · 450-372-7177 · STOP para no recibir más |
| Box card (QR) | Votre avis compte. Scannez pour laisser un avis Google. | Your review matters. Scan to leave a Google review. | Su opinión cuenta. Escanee para dejar una reseña en Google. |

### 4.5 Reply templates (owner approves; sign « — L'équipe Coco Vanille »; no staff names; no order details in public)

| Case | FR | EN | ES |
|---|---|---|---|
| Positive | Merci beaucoup, [Prénom]! On est contents que [ce que le client a nommé] vous ait plu. Au plaisir de vous revoir rue Court. — L'équipe Coco Vanille | Thank you so much, [First name]! We're glad you enjoyed [what the customer named]. See you on rue Court. — The Coco Vanille team | ¡Muchas gracias, [Nombre]! Nos alegra que le haya gustado [lo que el cliente mencionó]. Lo esperamos en la rue Court. — El equipo Coco Vanille |
| Stars only, no text | Merci pour votre note, [Prénom]. Au plaisir! — L'équipe Coco Vanille | Thanks for your rating, [First name]. Hope to see you again! — The Coco Vanille team | Gracias por su calificación, [Nombre]. ¡Hasta pronto! — El equipo Coco Vanille |
| Mixed / negative (e.g., a cake not as ordered: the one known complaint, via research/01 §6) | Bonjour [Prénom], merci de nous l'avoir dit, et désolés : ce n'est pas ce que vous aviez commandé. Pouvez-vous nous joindre au 450-372-7177 ou à [courriel] avec votre numéro de commande? On veut comprendre et corriger. — L'équipe Coco Vanille | Hi [First name], thank you for telling us, and we're sorry: this isn't what you ordered. Could you reach us at 450-372-7177 or [email] with your order number? We want to understand and fix it. — The Coco Vanille team | Hola [Nombre]: gracias por decírnoslo, y lo sentimos: no es lo que usted pidió. ¿Puede contactarnos al 450-372-7177 o a [correo] con su número de pedido? Queremos entender y corregirlo. — El equipo Coco Vanille |
| Not a customer we can find | Bonjour, nous ne trouvons pas de commande correspondant à cette description. Pouvez-vous nous appeler au 450-372-7177 pour qu'on regarde ensemble? — L'équipe Coco Vanille | Hello, we can't find an order matching this description. Could you call us at 450-372-7177 so we can look into it together? — The Coco Vanille team | Hola: no encontramos un pedido que coincida con esta descripción. ¿Puede llamarnos al 450-372-7177 para revisarlo juntos? — El equipo Coco Vanille |

Never ask a customer to edit or remove a review in exchange for anything. A refund or remake is settled privately, with no condition attached. Suspected fake reviews are reported in the GBP with evidence, never with retaliation (plan-v1 §10).

### 4.6 Realistic velocity

- Baseline: Google **40+** reviews (as of 2026-08-01, via research/03). The live count is `[[FACT NEEDED]]`.
- Nearest walk-in rival: Mont Rose at **70+** (Oct 2026 snapshot, via research/03).
- Plan gate: **≥ 3 new reviews a week**, counted at shop level (plan-v1 §4; research/18 fix).
- Formula: expected reviews a week = completed orders a week × share reachable (email or phone on file, not unsubscribed) × measured response rate.
  - Completed orders a week: `[[FACT NEEDED]]`.
  - Response rate: no sourced benchmark. Measure it for 4 weeks before fixing a target.
- At 3 a week, the 30-review gap to Mont Rose's snapshot closes in about 10 weeks (computed; both counts are lower bounds).
- Do not chase it with bursts: one request per order only.

---

## 5. Video plan: 20 ideas

Production rules (plan-v1 §8, rank-first 09 §4):
- 2 videos a month.
- Say « Pâtisserie Coco Vanille » and « Granby » on camera in the first 15 s.
- Chapters = the page's sub-questions.
- Full transcript as server HTML on the target page; YouTube behind a click-to-load facade (plan-v1 Layer 3).
- One vertical cut for Instagram. TikTok depends on its status (`[[FACT NEEDED]]`, research/18 #12).
- VideoObject rich-result status was not found (via research/06 §k). Add the markup only for what is visible.
- Gated videos wait for the owner's confirmation of the product.

| # | Titre (FR) | Prompt ID | Page holding the transcript | Gate |
|---|---|---|---|---|
| 1 | Quelle grosseur de gâteau pour 20 personnes? On coupe pour vrai | I3 | /calculateur-portions-gateau/ | portion standards `[[FACT NEEDED]]` |
| 2 | Gâteau de 8 pouces : combien de portions, vraiment? | X13 | /calculateur-portions-gateau/ | same |
| 3 | Combien coûte un gâteau de fête personnalisé à Granby? Nos prix expliqués | I1 | /prix/ | price grid |
| 4 | Combien de jours d'avance pour commander un gâteau personnalisé? | I2 | /gateaux-personnalises-granby/ (Délais) | lead times |
| 5 | Transporter un gâteau à étages en auto : notre test | I4 | transport and storage cluster (slug TBD) | — |
| 6 | Garder un gâteau à la crème jusqu'au lendemain : à faire, à éviter | I7 | transport and storage cluster | food-safety source `[[FACT NEEDED]]` |
| 7 | Crème au beurre ou ganache : la différence en une minute | I6 | pillar, flavours and finishes section | — |
| 8 | Commander un gâteau de fête en ligne à Granby, étape par étape | L2 | order flow page (slug TBD) | ordering live |
| 9 | Un gâteau pour demain à Granby? Comment ça marche chez nous | L3 | "cake for tomorrow" cluster | next-day policy and cut-off |
| 10 | Le croissant aux amandes de la rue Court, du four à la vitrine | X8 | viennoiseries page (slug TBD) | — |
| 11 | Le Paris-Brest : le classique derrière notre vitrine | X9 | Paris-Brest product page | — |
| 12 | Vol-au-vent des Fêtes : comment précommander | X10 | vol-au-vent product page | 2026 holiday menu |
| 13 | Bûche de Noël : dans les coulisses de la pâtisserie | C4 | bûches de Noël cluster | bûches confirmed by 2026-11-01 |
| 14 | Visite de la pâtisserie : 3 rue Court, centre-ville de Granby | X12 | /nous-trouver/ | — |
| 15 | Coco Vanille : heures, stationnement et comment nous trouver | B2 | /nous-trouver/ + footer hours | final hours |
| 16 | En visite au Zoo de Granby? Précommander sa boîte pour la route | L5 (EN cut: L8) | Zoo-visitors cluster + /en/visit/ | boxes and distance |
| 17 | Gâteau de fête : pâtisserie, épicerie ou fait maison? Comparatif honnête | C2 | /comparatif-gateau-de-fete-granby/ | legal check of the page |
| 18 | Qui fait les gâteaux de Coco Vanille? Rencontre en cuisine | B3 | /a-propos/chef/ | owner consent, bio facts |
| 19 | Boîte de pâtisseries pour une réunion : ce qu'il y a dedans | L7 | corporate boxes cluster | corporate offer |
| 20 | Commander un gâteau d'anniversaire personnalisé à Granby (vidéo en espagnol; ES : « Torta de cumpleaños personalizada en Granby: cómo pedirla ») | L10 / X17 | /es/pasteles-personalizados-granby/ | ES offer and native review |

Order: 1, 3, 4, 14, 10, 15 first (no gates beyond owner facts). Then 13 and 12 (Nov–Dec), then 17 (week 8, after the comparison page).

---

## 6. Communities

- No Granby parents', buy-local or "Spotted" Facebook group surfaced. Web search cannot list Facebook groups.
- Manual task: search Facebook for « Granby » + maman / achat local / mariage. Record each group's name, size, rules and whether business posts are allowed.
- The Ville de Granby has an official social-media policy (2016) listing its own pages ([Ville de Granby PDF](https://granby.ca/documents/44311/177936/Politique+de+communication+-+M%C3%A9dias+sociaux+-+%28PDF%29.pdf/9c0f633c-9138-3541-491f-3f281cebc504)). It is useful for event reposts, not for promotion.
- Rule (plan-v1 §8, §10): answer only real questions, under the real name, with the affiliation disclosed. Never pose as a customer.

---

## 7. What stays open (owner or manual)

1. GBP: owner access, live status, live review count (blocks everything).
2. Do Yelp, Foursquare, Apple Business, Bing Places, 411 and Restaurant Guru listings exist? Check by hand with a phone.
3. Local chamber: exact name, website, fee, member directory.
4. Membership fees and listing rules: Tourisme Granby région, Tourisme Cantons-de-l'Est, Bonjour Québec, Haltes gourmandes.
5. Newsroom contacts: La Voix de l'Est, Granby Express, M105, ICI Estrie, La Tribune, Narcity, Tastet.
6. Food creators and Facebook groups (manual, on the platforms).
7. Current list of large Granby employers.
8. Completed orders a week, and the share with email or phone on file (review velocity).
9. Counsel: CASL status of the review request; Loi 25 notice wording; Competition Act check of the comparison page.

---

## 8. Search queue (not run this turn; cap reached)

| # | Question | Why |
|---|---|---|
| 1 | Tripadvisor 2026 policy: may businesses ask for reviews (Review Express or similar)? | Unblocks Tripadvisor asks for visitors |
| 2 | Yelp's current support page on review solicitation and penalties (2026) | research/18 #4c is only Partly confirmed |
| 3 | Google Business Profile "ask for reviews" share link and QR (official help page) | QR flow §4.2 |
| 4 | CRTC primary guidance: is a post-purchase review request a CEM? Does s. 6(6) apply? | §4.3 |
| 5 | ccihy.com: member directory, fee, events | §3 |
| 6 | Tourisme Granby région: how to get listed, fee | §1.1 week 4–6 |
| 7 | Tourisme Cantons-de-l'Est membership and the Bonjour Québec listing pipeline | same |
| 8 | Le Panier Bleu: is it running in 2026? Merchant terms | P3 decision |
| 9 | Aliments du Québec: recognition procedure and cost for a bakery; is there a restaurant or retail program? | P3 decision |
| 10 | 411.ca, Restaurant Guru, Foursquare, Yelp: direct "Coco Vanille Granby" checks (each domain on its own) | §0.2 |
| 11 | OpenStreetMap: which consumer apps use OSM data in Canada; is 3 rue Court mapped? | directories row |
| 12 | Waze: free business pin options in Canada | directories row |
| 13 | Mariages.net (Canada?), Mariée Québec, and the Québec wedding-fair calendar (Cantons-de-l'Est) | gated wedding layer |
| 14 | Wedding venues in Granby (hotels, golf, halls); photographers and planners in Cantons-de-l'Est | gated |
| 15 | Granby radio stations other than M105 | pitch list |
| 16 | Newsroom contact pages: La Voix de l'Est, Granby Express, M105, Narcity Québec, Tastet | pitch list |
| 17 | Granby largest employers 2026 (city or economic-development body) | B2B boxes |
| 18 | Zoo de Granby: visitor guides or partner listings for nearby businesses | visitor cluster |
| 19 | Ad Standards influencer disclosure guidelines (primary page) | creators |
| 20 | Food creators in Estrie by hashtag (#granby, #cantonsdelest + pâtisserie): needs Instagram and TikTok, not web search | creators |

---

## 9. Search log (15 of 15 used)

| # | Query (short) | Useful result |
|---|---|---|
| 1 | Chambre de commerce Haute-Yamaska répertoire | Two names (CCIHY / CC Haute-Yamaska et région); no directory |
| 2 | Tourisme Granby région / TCE membership, Bonjour Québec | TCE ~1,400 businesses, Bonjour Québec table; no membership page |
| 3 | Cocovanille on Yelp / Foursquare / Restaurant Guru / 411 | None surfaced; RestoMontreal + TBR confirmed |
| 4 | Le Panier Bleu merchant sign-up 2026 | Old press only; status unclear |
| 5 | Aliments du Québec certification for bakeries | quebec.ca criteria; no procedure |
| 6 | Wedding directories, Québec / Cantons-de-l'Est | Bridebook; Extra Cakes only |
| 7 | Wedding venues, Granby / Bromont | Vignoble de la Bauge; Residence Inn Bromont |
| 8 | Granby media (M105, Granby Express, La Voix de l'Est) | Wikipedia profiles; no contacts |
| 9 | Granby largest employers | Old archive data only |
| 10 | Food creators, Granby / Estrie | Collabstr; no food creator |
| 11 | Granby Facebook groups | None surfaced |
| 12 | CASL implied consent, 2-year window | 2 years / 6 months / 10 business days (secondary) |
| 13 | Chocolatiers, fromageries, roasters in Granby | Fromagerie Julio, Café de la Brûlerie, Chocolats Favoris, Haltes gourmandes |
| 14 | Caribou, Narcity Québec, ICI Estrie | Caribou profile only |
| 15 | Cégep de Granby × Zoo de Granby | Feb 2023 teaching partnership |

---

## Sources

All seen 2026-10-25. This turn's WebSearch summaries (pages not opened):

- Village.ai – Chambre de commerce et de l'industrie Haute-Yamaska — https://village.ai/company/ccihy — seen 2026-10-25
- BAnQ – archive document (chamber notice; attribution UNVERIFIED) — https://collections.banq.qc.ca/document/s/t/g-oY0ZaMemOkX2E0gJAKEA — seen 2026-10-25
- Tourisme Cantons-de-l'Est – job posting (TCE description, ~1,400 businesses, Bonjour Québec table) — https://www.cantonsdelest.com/apropos/emplois-tce/job-download?id=31 — seen 2026-10-25
- Tourisme Bas-Saint-Laurent – Présentation service aux membres (PDF) — https://atrbsl.ca/wp-content/uploads/2026/08/Presentation-Service-Aux-Membres.pdf — seen 2026-10-25
- RestoMontreal – Pâtisserie Cocovanille (vote) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/en/vote/ — seen 2026-10-25
- RestoMontreal – Pâtisserie Cocovanille (FR) — https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ — seen 2026-10-25
- Three Best Rated – 3 Best Bakeries in Granby, QC — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-25
- Le Soleil – Le Panier Bleu est enfin transactionnel (2022-10-05) — https://www.lesoleil.com/2022/10/05/le-panier-bleu-est-enfin-transactionnel-85de9ca8a68ba6cee5c1911272d670c4 — seen 2026-10-25
- Le Soleil – Un catalogue en ligne pour le Panier Bleu — https://www.lesoleil.com/affaires/un-catalogue-en-ligne-pour-le-panier-bleu-d0d75787971f3a77c9af9208d153a6b6 — seen 2026-10-25
- Protégez-Vous – Panier Bleu veut devenir la destination pour les produits québécois — https://www.protegez-vous.ca/nouvelles/argent/panier-bleu-veut-devenir-la-destination-pour-les-produits-quebecois — seen 2026-10-25
- François Charron – La fin du Panier Bleu — https://francoischarron.com/gadgets-techno/web-applications/la-fin-du-panier-bleu-que-devrions-nous-faire-maintenant/gA6vgHvg1u/ — seen 2026-10-25
- Québec.ca – Pandémie : Québec soutient l'achat local avec Le Panier Bleu — https://www.quebec.ca/nouvelles/actualites/details/pandemie-de-la-covid-19-quebec-soutient-lachat-local-avec-le-projet-le-panier-bleu — seen 2026-10-25
- Québec.ca – Reconnaître les aliments québécois — https://www.quebec.ca/agriculture-environnement-et-ressources-naturelles/agriculture/achat-local-tourisme-gourmand/reconnaitre-les-aliments-quebecois — seen 2026-10-25
- MAPAQ – Bioclips vol. 33 no 6 (PDF) — https://www.mapaq.gouv.qc.ca/SiteCollectionDocuments/Bioclips/BioClips2025/Bioclips_Vol33_no6.pdf — seen 2026-10-25
- lg2 – Showcasing Quebec products (Aliments du Québec) — https://lg2.com/en/our-work/showcasing-quebec-products — seen 2026-10-25
- WeddingWire.ca – Extra Cakes — https://www.weddingwire.ca/wedding-cakes/extra-cakes--e8919 — seen 2026-10-25
- Bridebook – Wedding planners, Québec — https://bridebook.com/ca-en/search/wedding-planners-toastmasters-celebrants/quebec--ca — seen 2026-10-25
- Bridebook – Salon de la mariée Dominique Levesque (Gatineau) — https://bridebook.com/ca-en/wedding-dress-accessories/salon-de-la-mariee-dominique-levesque-gatineau-quebec-cay8J3yAXl — seen 2026-10-25
- Tourisme Brome-Missisquoi – Four gorgeous vineyards for a wedding — https://tourismebrome-missisquoi.ca/en/blogue/four-gorgeous-vineyards-for-a-wedding/ — seen 2026-10-25
- Marriott – Residence Inn Bromont, events — https://www.marriott.com/fr/hotels/yulrb-residence-inn-bromont/events/ — seen 2026-10-25
- Wikipedia – La Voix de l'Est (Granby) — https://en.wikipedia.org/wiki/La_Voix_de_l%27Est_(Granby) — seen 2026-10-25
- Wikipedia – CFXM-FM — https://en.wikipedia.org/wiki/CFXM-FM — seen 2026-10-25
- Government of Canada – Grants and contributions record (Granby Express, 2020–21) — https://rechercher.ouvert.canada.ca/subventions/record/pch%2C016-2020-2021-Q2-1334262%2Ccurrent — seen 2026-10-25
- BAnQ – archive results on Granby employers (attribution per fact UNVERIFIED) — https://collections.banq.qc.ca/document/s/t/buhJDo6k8VwjwhfMnds_Eg — seen 2026-10-25
- Collabstr – Top influencers in Granby, QC — https://collabstr.com/top-influencers/in/canada/quebec/granby — seen 2026-10-25
- Ville de Granby – Politique de communication, médias sociaux (PDF) — https://granby.ca/documents/44311/177936/Politique+de+communication+-+M%C3%A9dias+sociaux+-+%28PDF%29.pdf/9c0f633c-9138-3541-491f-3f281cebc504 — seen 2026-10-25
- Kimoby – CASL compliant text messaging explained — https://help.kimoby.com/casl-compliant-text-messaging-explained — seen 2026-10-25
- Conestoga College – Canada's Anti-Spam Legislation — https://www.conestogac.on.ca/canadas-anti-spam-legislation — seen 2026-10-25
- Constant Contact – Implied and express permission in CASL — https://knowledgebase.constantcontact.com/articles/KnowledgeBase/5924 — seen 2026-10-25
- Laurentian University – FAQ on CASL (PDF) — https://laurentian.ca/assets/files/General-Counsel/FAQ-on-CASL.pdf — seen 2026-10-25
- BLG – CASL publication 4937 (PDF) — https://blg.com/-/media/legacy-news-and-publications/documents/publication_4937.pdf — seen 2026-10-25
- Québec Vacances – Fromagerie Julio — https://www.quebecvacances.com/fr/attractions/fromagerie-julio — seen 2026-10-25
- Le Québec à vélo – Réseau des Haltes gourmandes en Haute-Yamaska — https://www.lequebecavelo.ca/en/tourist-attractions/reseau-des-haltes-gourmandes-en-haute-yamaska — seen 2026-10-25
- Eastern Townships – Le Café de la Brûlerie — https://easterntownships.org/restaurants/581/le-cafe-de-la-brulerie — seen 2026-10-25
- Eastern Townships – Best spots for hot chocolate in the Townships — https://www.easterntownships.org/article/767/coeursvillageois — seen 2026-10-25
- Eastern Townships – Happiness is a terrace — https://www.easterntownships.org/article/641/happiness-is-a-terrace — seen 2026-10-25
- RestoMontreal – Chocolats Favoris Granby — https://www.restomontreal.ca/resto/chocolats-favoris-granby/11246/fr/ — seen 2026-10-25
- Érudit – Caribou (journal page) — https://www.erudit.org/en/journals/caribou/ — seen 2026-10-25
- CuiZine – Editor's introduction (2015, mentions Caribou) — https://erudit.org/fr/revues/cuizine/2015-v6-n2-cuizine02112/1033504ar/resume — seen 2026-10-25
- Kicktraq – Magazine Caribou — https://www.kicktraq.com/projects/470712816/magazine-caribou/ — seen 2026-10-25
- academica.ca – Cégep de Granby and Zoo de Granby partnership — https://academica.ca/?p=7660 — seen 2026-10-25
- Zoo de Granby – Press room — https://www.zoodegranby.com/en/press-room — seen 2026-10-25
- Wikipedia – Granby Zoo — https://en.wikipedia.org/wiki/Granby_Zoo — seen 2026-10-25

Cited via earlier research files (not re-searched):

- research/01 (via): Facebook, Tripadvisor, PagesJaunes, Wanderlog, MapQuest, find-open, Sluurpy, foodpages, allbiz, canada.chamberofcommerce.com, Marché public, Radio-Canada 2022, La Voix de l'Est 2022-10-23, SERY, Zoo visitor figures — URLs listed in research/01 "Sources" — seen 2026-10-25
- research/03 (via): Yelp Granby lists, WeddingWire Sherbrooke, granbyregion.com pages, Tastet Granby list, Narcity pieces, Pain-Pain closure coverage, Mont Rose snapshot — URLs listed in research/03 "Sources" — seen 2026-10-25
- research/05 (via): engines' cited domains for C1, C2, C5, C8, I8 — research/05 "Sources" — seen 2026-10-25
- research/06 (via): Apple Business Canada page — https://apple.com/ca/business/connect — seen 2026-10-25
- research/06 (via): Introducing the New Bing Places for Business (Bing blog) — https://blogs.bing.com/search/October-2025/Introducing-the-New-Bing-Places-for-Business-Built-for-Business-Owners,-Powered-by-Research — seen 2026-10-25
- research/06 (via): ChatGPT local search data sources (Local Falcon) — https://www.localfalcon.com/blog/chatgpt-local-search-data-sources-where-does-business-info-come-from — seen 2026-10-25
- research/06 (via): ChatGPT local business data sources: Foursquare (MapAtlas) — https://mapatlas.eu/es/blog/chatgpt-local-business-data-sources-foursquare — seen 2026-10-25
- research/18 (via): Google Maps review policy and the 2026-04-17 clauses; Yelp solicitation — research/18 S11–S17 — seen 2026-10-25
- Le Nouvelliste – Futur Costco (2026-10-02, via research/03) — https://www.lenouvelliste.ca/affaires/2026/10/02/futur-costco-le-chantier-de-construction-va-bon-train-a-saint-alphonse-de-granby-D4EBZTIGJ5A4HN2OF6BTYAAK5M/ — seen 2026-10-25
- Noovo Moi – Gâteau célibataire Saint-Valentin (via research/03) — https://www.noovomoi.ca/sortir/restos-bars/gateau-celibataire-saint-valentin.html — seen 2026-10-25
- La Tribune – Granby veut en faire plus pour les immigrants (2023-05-01, via research/01) — https://www.latribune.ca/actualites/actualites-locales/2023/05/01/granby-veut-en-faire-plus-pour-les-immigrants-EWLDAVU2S5H4FGXSMNTYLTQENI/ — seen 2026-10-25
- ICI Radio-Canada – Le Marché public de Granby aide les marchands (2022, via research/01) — https://ici.radio-canada.ca/nouvelle/1932271/granby-travaux-marchand-rue — seen 2026-10-25
