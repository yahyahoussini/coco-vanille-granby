# 20d · Policy benchmarks and law: deposits, cancellation, pickup, gift cards, privacy and claims (2026-10-29)

As of 2026-10-29 (ISO week 2026-W44). Track: the ordering policies that comparable bakeries publish, and the Québec and federal law that bounds them.
Mandate: Yahya, 2026-10-29 (« take all decisions based on what I give and web research »). This file checks the agency decisions of research/21 §1 against the law and the market: A3–A6, plus A1 and A9 as side checks. It gives market benchmarks for the policies that stay the owner's: the next-day rule, lead times and message length. It takes no new decision. Where a decision needs a change, §3 gives the exact wording to adopt (record it in research/21 if adopted).
**Not legal advice.** A lawyer signs off the conditions of sale and the privacy policy (07 §8).
Machine-readable twin: `data/research-policies.json` (same row ids as the tables below).

How this was made, and its limits:
- **25 WebSearch queries** (standard mode, US-located) and **53 WebFetch calls**, all on 2026-10-29. Both logs are at the end.
- **The law's text.** Légis Québec, CanLII, the CRTC, Protégez-Vous and one Revenu Québec page returned HTTP 403, and CAIJ e-Lois needs a login. So:
  - The wording of LPC ss. 11.2, 11.4, 13, 19.1, 187.1–187.5 and 224 comes from the **official text of the 2009 amending act**: Projet de loi n° 60, S.Q. 2009, c. 51, Éditeur officiel du Québec, sanctioned 2009-12-04. The PDF was read page by page.
  - Amendments made to those articles after 2009, if any, were **not** seen.
  - An article number marked **†** comes from prior knowledge or a draft text, not from the law in force.
- **The OPC's own pages** (opc.gouv.qc.ca) were read directly; each row gives the page's update date. Two OPC PDFs were also read: its December 2007 business letter on distance contracts, and a 2021 access-to-information release (the comments table on the draft regulation).
- **Competitors' pages** were read directly where their sites answered.
  - Cake Design Granby's custom-order page returned HTTP 429 on four attempts.
  - The bare domains avecungranda.com, cakegranby.ca and rosegateaux.com did not resolve; their « www. » forms worked. maitreglacier.com did not resolve, but the Granby store's own site did.
- **Labels:**
  - **verified** = the law's official text, a regulator's own page (OPC, CAI, CFIA), or a business's own page about **its own** policy.
  - **unverified** = a search summary only, a law-firm summary, a third-party listing, a draft text, prior knowledge, or an inference.
  - A competitor's policy is "verified" as **what that shop publishes**. It is never a finding that the policy is lawful.
- **Absence of evidence is not proof.** "Not found" means the pages read and the searches run did not show it.

---

## 0. Bottom line

1. **A3 (pickup only): lawful and in line with Granby. No change.**
   - No law requires a bakery to deliver. Where the distance-contract rules apply, the delivery mode and place must be disclosed before the contract, and the site does that (L-16).
   - None of the three Granby cake shops whose pages were read mentions delivery on them. The chains do deliver (M-5, M-12, M-14).
2. **A4 (30 % deposit): the amount is lawful, but the refund rule may never be « non remboursable ».**
   - The LPC bans any clause that fixes in advance the fees, penalty or damages a consumer pays for failing to perform (s. 13, L-1).
   - It also bans any clause that excludes Civil Code arts. 2125 and 2129 (s. 11.4, L-2). Those articles let a client cancel a contract for work at any time, paying only the work done and the costs actually incurred (L-3).
   - The OPC says it plainly: a merchant may not set a cancellation penalty in advance, not even « 20 % du montant total »; it may claim only the damages it has actually suffered (L-4).
   - The exact refund wording is in §3.2. It replaces the counsel marker in the conditions of sale and corrects one FAQ answer.
   - Market: no Granby or other Québec shop reached publishes a deposit percentage. The only figures found are on two order forms, one of unknown place (30 %) and one French (50 %) (M-18, M-19, M-22).
3. **A5 (gift cards): « ni date d'expiration ni frais » is too broad as a statement of Québec law.**
   - The law bans expiry dates and issuance or usage fees on a shop's own card (LPC ss. 187.3–187.4; L-11, L-13, L-14).
   - Fees stay allowed on shopping-centre and bank cards, and so do replacement fees (lost card, if disclosed before the sale) and customisation fees.
   - Exact correction in §3.3. Première Moisson's card terms promise no expiry and no fees (M-13).
4. **A6 (order not picked up): lawful and in line with the market, if the order was ready at the agreed time.**
   - What is kept is the price of goods made for the customer, not a penalty (L-8, by analogy).
   - Market: Première Moisson holds a refused delivery 24 h, then donates it without refund. Cake Design Granby refunds nothing (M-11, M-2).
   - Add the reason to the sentence and remove a duplicated clause (§3.4).
5. **New finding: the LPC's distance-contract rules do not apply to « un contrat relatif à l'achat de biens susceptibles de dépérir rapidement » (L-9).**
   - Sources: the OPC's 2007 business letter and its 2023 merchant page. The draft regulation numbers the exemption s. 6.1 b) †.
   - For fresh bakery goods ordered online, three items in the conditions of sale are then the shop's own promises, not statutory rights: the 15-day refund, the 60-day card chargeback, and the right to cancel when the date differs from the one announced. Keep the promises, and reword the chargeback sentence (§3.5).
   - **Open for counsel:** is a custom cake such a « vente », or a contract for work (L-10)? If it is not exempt, the LPC lets the shop collect any payment before delivery **only by credit card** (L-7). Until counsel answers, take custom-cake deposits by credit card only.
6. **Loi 25 (A1): lawful as built.**
   - The CAI requires the **title and contact details** of the person in charge on the website. A name is optional (L-18, L-20).
   - Two privacy-page markers now have a public answer:
     - access requests are answered **within 30 days** (CAI, L-19);
     - GST/QST records are kept **6 years after the end of the last year they relate to** (Revenu Québec, L-21; search summary, so the accountant confirms it).
7. **Claims (A9): stands.**
   - CFIA: a gluten-free claim is any labelling or advertising that states, suggests or implies it, names and slogans included (L-24).
   - « Sans lactose » means **no detectable lactose** (L-25). This closes 20b's open point on « sans lactose ».
   - The shop's Instagram line makes both claims (20b S-21).
8. **CASL (review requests): the build already takes the conservative path.** It asks for a separate opt-in, sends one message per order and offers no incentive. Whether a review request is a commercial message stays unverified, because the CRTC pages returned 403 (L-22, L-23).
9. **Open policies: benchmarks only; the owner decides (§4).**
   - Menu cakes: 24 h (Café Bazin; Première Moisson by product) to 48 business hours (Avec un Grand A, Granby).
   - Custom cakes: about 3 weeks (Rose Gâteaux, Granby) to 1 month (La Gâtisserie, Montréal). Cake Design Granby freezes changes 7 days before.
   - No Québec bakery reached publishes a next-day cut-off hour or a message-length limit.

### Verdicts on research/21 §1

| # | Decision as applied | Lawful? | In line with the market? | Change | Rows |
|---|---|---|---|---|---|
| A3 | Delivery « non offerte; toutes les commandes se récupèrent à la boutique » | Yes | Yes for small Granby shops; chains deliver | None (optional copy fix, §3.1) | L-16, M-5, M-12, M-14 |
| A4 | 30 % of the quote at acceptance; balance at pickup; refund rule written before payment | Amount: yes. Refund rule: actual costs only (L-1…L-4). Payment method: credit card, unless custom cakes are exempt (L-7, L-9, L-10) | Yes: no local percentage published; 30 % and 50 % on the two forms found (place unknown; France) | Fill the marker; fix one FAQ (§3.2) | L-1…L-5, L-7, L-9, L-10, M-2, M-18, M-19, M-22 |
| A5 | No gift cards online; « au Québec, une carte-cadeau n'a ni date d'expiration ni frais » | The shop part: yes. The law sentence: over-broad | Yes (Première Moisson: no expiry, no fees) | Replace the law sentence (§3.3) | L-11…L-15, M-13 |
| A6 | Ready until closing on the day; not kept; amount paid not refunded | Yes if the order was ready (counsel for custom cakes paid by deposit only) | Yes | Add the reason; remove the duplicate (§3.4) | L-8, M-2, M-11 |
| A1 | Title and contact of the person in charge; no name | Yes | — | None. The mailbox works only once the domain is registered (21 §3) | L-18…L-20 |
| A9 | The site makes no free-from claim; the sentence describes the site | Yes | — | None | L-24, L-25 |

---

## 1. The law (findings)

Seen 2026-10-29 unless stated. "Effect" is a hand-off note, not a decision.

### 1A. Deposits and cancellation

| # | Finding (quotes as returned) | Label | Source | Effect on the site |
|---|---|---|---|---|
| L-1 | **LPC s. 13**, first paragraph as replaced in 2009: « Est interdite la stipulation qui impose au consommateur, dans le cas de l'inexécution de son obligation, le paiement de frais, de pénalités ou de dommages, dont le montant ou le pourcentage est fixé à l'avance dans le contrat, autres que l'intérêt couru. » The 2nd paragraph exempts only the long-term sale or lease of a car | verified (official 2009 text; current consolidation not seen) | S.Q. 2009, c. 51, s. 3 (PDF p. 6) | No « acompte non remboursable », no fixed retention (« 20 % »), no « solde dû si annulation à moins de X jours » |
| L-2 | **LPC s. 11.4** (added 2009): « Est interdite la stipulation qui exclut en tout ou en partie l'application des articles 2125 et 2129 du Code civil relatifs à la résiliation des contrats d'entreprise ou de services. » | verified (official 2009 text) | S.Q. 2009, c. 51, s. 2 (PDF p. 6) | If a custom cake is a contract for work, the customer may cancel at any time; the shop keeps only what art. 2129 allows |
| L-3 | **Civil Code arts. 2125 and 2129**, as summarised by a law firm. The client may terminate unilaterally even once the work has begun. It pays "pro rata to the agreed upon price and the value of the work it has performed" and "the reasonable expenses actually incurred". The provider "must repay the amount of any advance it has received that is over and above what it is entitled to". Injury means "only the actual loss sustained, to the exclusion of any eventual loss or unrealized profits". Between businesses the rule can be waived; L-2 bars that in consumer contracts | unverified (law-firm summary, 2016-08-22; the Code's text not seen: HTTP 403) | Langlois | The refund rule in §3.2 follows this: deposit minus actual costs and work done |
| L-4 | **OPC, merchant page:** « Vous n'avez pas le droit de déterminer à l'avance une pénalité ». It applies to agreements, contracts and policies alike. Banned example: « l'annulation d'une mise de côté oblige le consommateur à payer 20 % du montant total de la facture ». « Vous pourriez par contre réclamer une somme d'argent pour compenser les dommages que vous avez vraiment subis. » « Si vous n'arrivez pas à vous entendre avec le consommateur, vous devrez demander aux tribunaux de trancher la question. » **OPC consumer page (EN):** "merchants cannot set in advance the penalty they will charge if you cancel an agreement" | verified (OPC; merchant page updated 2025-03-04, consumer page 2026-07-30) | OPC « Mise de côté et acompte »; OPC "Layaways and down payments" | Same as L-1. A retention must be itemised and real |
| L-5 | **OPC consumer advice on deposit size:** "You should try to negotiate the lowest possible amount." "A low down payment means a smaller loss if the store closes its doors or goes bankrupt." No legal cap on a deposit's size was found | verified (OPC, 2026-07-30); "no cap" = absence of evidence | OPC "Layaways and down payments" | 30 % is moderate. The law sets no ceiling |

### 1B. Distance contracts (online and phone orders)

| # | Finding (quotes as returned) | Label | Source | Effect on the site |
|---|---|---|---|---|
| L-6 | **The distance-contract regime, in force 2007-12-15.** Before the contract, the shop discloses:<br>• its name and address, phone and e-mail<br>• a detailed description and an itemised price, taxes included<br>• the total and the payment terms<br>• « la date ou les délais d'exécution de son obligation principale »<br>• « le cas échéant, le mode de livraison, le nom du transporteur et le lieu de livraison »<br>• « le cas échéant, les politiques du commerçant concernant l'annulation, la résiliation, le retour, l'échange ou le remboursement »<br>• every other restriction<br>The consumer gets a chance to accept, refuse or correct errors, and a copy of the contract within 15 days. They may cancel within 7 days of receiving the copy if a disclosure was missing (30 days if no copy was sent), or at any time before delivery if the shop has not delivered within 30 days of the contract date. A refund is due within 15 days of a cancellation; credit-card chargeback within 60 days | verified (OPC business letter, December 2007) | OPC « De nouvelles règles relatives aux contrats à distance » | Confirms research/07 rows C-2…C-5 (Partly or UNVERIFIED there; C-6 and C-7 were already confirmed), where the regime applies: see L-9 |
| L-7 | **Payment before delivery, credit card only:** « Le paiement anticipé : le commerçant ne peut percevoir un paiement du consommateur ou lui offrir de percevoir un tel paiement avant d'exécuter son obligation principale, sauf s'il s'agit d'un paiement par carte de crédit. » The 2023 page: « Vous pouvez percevoir ou offrir de percevoir un paiement avant d'avoir livré le bien ou fourni le service dans un seul cas : si le consommateur paie par carte de crédit. » Its exceptions include « contrat de vente de biens susceptibles de dépérir rapidement; » | verified (OPC letter 2007; OPC merchant page « Moment du paiement », modified 2023-08-10) | both OPC pages | Debit-card, Interac e-Transfer or cash deposits on an online or phone order are barred, unless the order is exempt (L-9) |
| L-8 | **When the shop has performed:** « Un commerçant est présumé avoir exécuté son obligation principale […] lorsqu'il a tenté de l'exécuter à la date indiquée au contrat […] et qu'il a été empêché de le faire en raison des agissements ou de la négligence du consommateur. » | verified (OPC letter 2007) | OPC « De nouvelles règles… » | Supports A6. An order ready during its slot counts as performed; applied by analogy where the regime is excluded |
| L-9 | **Perishables are exempt.** 2007 letter: « Les règles relatives aux contrats à distance ne s'appliquent pas s'il s'agit : […] d'un contrat relatif à l'achat de biens susceptibles de dépérir rapidement ». Draft regulation: « 6.1. La section I.1 du chapitre III du Titre I de la Loi ne s'applique pas : (…) b) au contrat de vente de biens susceptibles de dépérir rapidement; ». The OPC's comment on the draft: the exemption covers « non seulement les produits alimentaires mais l'ensemble des biens susceptibles de dépérir rapidement », because the merchant « ne pourrait les remettre en vente en cas d'annulation » | verified as to the exemption (two OPC documents). The article number is the draft's † | OPC letter 2007; OPC comments table (2021 access-to-information release); OPC « Moment du paiement » | For fresh goods, the conditions' 15-day refund, chargeback and cancellation when the date differs become the shop's own promises. **Counsel decides** whether a custom cake is covered (L-10) |
| L-10 | **Sale or contract for work?** « Il y a contrat de vente, et non contrat d'entreprise ou de service, lorsque l'ouvrage ou le service n'est qu'un accessoire par rapport à la valeur des biens fournis » (Civil Code art. 2103 †) | unverified (prior knowledge; the Code's text not seen: HTTP 403) | Légis Québec (not read) | If a decorated cake is a contract for work, L-2 and L-3 govern its cancellation, and the « vente » exemption in L-9 may not cover it. Counsel |

### 1C. Gift cards (prepaid cards)

| # | Finding (quotes as returned) | Label | Source | Effect on the site |
|---|---|---|---|---|
| L-11 | **LPC ss. 187.1–187.4** (added 2009).<br>• 187.1: a prepaid card is « un certificat, une carte ou tout instrument d'échange permettant au consommateur de se procurer un bien ou un service disponible chez un ou plusieurs commerçants moyennant un paiement effectué à l'avance ».<br>• 187.2: before the sale, the merchant tells the buyer « des conditions d'utilisation de la carte de même que de la manière dont le solde pourra en être vérifié », in writing if this is not on the card.<br>• 187.3: « Sous réserve de ce qui peut être prévu par règlement, est interdite la stipulation prévoyant une date de péremption de la carte prépayée sauf si le contrat prévoit une utilisation illimitée d'un service. »<br>• 187.4: « Sous réserve de ce qui peut être prévu par règlement, aucuns frais ne peuvent être réclamés du consommateur pour la délivrance ou l'utilisation de la carte prépayée. » | verified (official 2009 text) | S.Q. 2009, c. 51, s. 9 (PDF p. 7) | A counter card must come with its conditions of use and a way to check the balance |
| L-12 | **LPC s. 187.5:** the merchant refunds the balance on request « lorsque ce solde est inférieur au montant ou au pourcentage déterminé par règlement » | verified as text; **no regulatory threshold seen**, and the OPC pages read do not mention one | S.Q. 2009, c. 51, s. 9 | Counsel, only if the shop sells cards |
| L-13 | **OPC, expiry:** merchants may not indicate "an expiry date" or determine "a period after which the card can no longer be used". "As long as it has not been used, a card that was paid $50 will always keep its value." Expiry is allowed only on cards for unlimited use of a service and on cell-phone cards | verified (OPC, 2025-03-04; rules page 2025-04-09) | OPC "Expiry date"; OPC "Rules for prepaid cards" | — |
| L-14 | **OPC, fees.** Activation or usage fees are allowed only on financial-institution cards and on shopping-centre or regional cards (3,50 $ at issue, or 2,50 $ a month from the 15th month if the card is unused). "All other cards usable as cash": none. "If the merchant requires you to replace your card, it must be replaced for free." A lost or stolen card: "merchants may charge replacement fees if they informed you of this policy before you purchased the card". "Merchants are permitted to charge fees to customize a card." | verified (OPC, 2021-05-03) | OPC "Activation, usage and replacement fees" | « Ni frais » is too broad as a general statement (§3.3) |
| L-15 | **OPC, a card for a specific good** (e.g. « un gâteau de 8 po »): « Vous n'avez pas le droit d'indiquer une date d'expiration ». A supplement is allowed from a set date only if the card shows « la valeur du bien ou du service au moment de la vente de la carte » and « la date à partir de laquelle vous pourrez exiger un supplément » | verified (OPC, 2025-03-04) | OPC « Date d'expiration – cartes échangeables contre un bien ou un service précis » | Owner, only if a product card is ever sold |

### 1D. Other consumer rules seen

| # | Finding | Label | Source | Effect on the site |
|---|---|---|---|---|
| L-16 | No rule requires delivery. The disclosure list asks for the delivery mode and place only « le cas échéant » (L-6) | verified (OPC letter 2007); "no rule" = absence of evidence | OPC « De nouvelles règles… » | A3 is lawful |
| L-17 | Also seen in the 2009 text:<br>• **s. 11.2** limits clauses that let the merchant change the contract alone.<br>• **s. 19.1**: a clause « inapplicable au Québec » must be « immédiatement précédée, de manière évidente et explicite, d'une mention à ce sujet ».<br>• **s. 224, 2nd paragraph** (all-in price): « le prix annoncé doit comprendre le total des sommes que le consommateur devra débourser pour l'obtention du bien ou du service. Toutefois, ce prix peut ne pas comprendre la taxe de vente du Québec, ni la taxe sur les produits et services du Canada. » | verified (official 2009 text) | S.Q. 2009, c. 51, ss. 2, 4, 12 | Matches the site: it never moves a date alone, and its prices are all-in (07 C-9). Never print a banned clause, even with a warning |

### 1E. Loi 25 (privacy) and record retention

| # | Finding (quotes as returned) | Label | Source | Effect on the site |
|---|---|---|---|---|
| L-18 | **CAI, the person in charge.** By default « la personne ayant la plus haute autorité dans l'entreprise ». « Cette fonction peut cependant être déléguée par écrit, en tout ou en partie ». « Le titre et les coordonnées du responsable » « doivent être publiés sur le site Web de l'entreprise ». A name is not required | verified (CAI page; no date, © 2026) | CAI « Responsabilité des entreprises… responsable de la protection des renseignements personnels » | A1 is lawful as built (title and email; the name shows only if entered) |
| L-19 | **CAI, response time:** « Le responsable doit évaluer les demandes d'accès et de rectification et y répondre dans les 30 jours » | verified (CAI page) | same | Answers the privacy marker « délai de réponse aux demandes d'accès »: **30 jours** |
| L-20 | **CAI guide « Rédiger une politique de confidentialité ».** « Depuis le 22 septembre 2023, vous devez publier une politique de confidentialité si votre entreprise recueille des renseignements personnels par un moyen technologique ». « Pour commencer, vous devez indiquer le nom de votre entreprise, la date d'entrée en vigueur de la politique et la date de la dernière mise à jour. » The name of the person in charge is an optional element. The rights to state include « De déposer une plainte selon le processus prévu dans votre politique et vos pratiques de gouvernance ». Retention and destruction rules and the complaint process belong in the governance policy, of which « vous devez au minimum publier des informations détaillées » | verified (CAI PDF, guide pp. 2–8) | CAI guide | The privacy page should name the shop's own complaint route before the CAI, and show an effective date (§3.6) |
| L-21 | **Revenu Québec:** « Vous devez conserver ces registres et ces pièces justificatives pendant les six années suivant la fin de la dernière année à laquelle ils se rapportent, à moins d'un avis contraire de notre part ». Records needed for an objection or appeal are kept longer. Destroying them earlier needs Revenu Québec's written permission | unverified (search summaries of five Revenu Québec pages, all agreeing; the direct read returned HTTP 403) | Revenu Québec « Tenue de registres et conservation des pièces justificatives » | Answers the privacy marker on tax retention (« 6 ans après la fin de l'année… »), once the accountant confirms it |

### 1F. Anti-spam (CASL) and food claims

| # | Finding (quotes as returned) | Label | Source | Effect on the site |
|---|---|---|---|---|
| L-22 | **Review-request emails under CASL.** Whether one is a commercial message is not settled. The test is whether "the purpose or one of the purposes of the message is to encourage participation in a commercial activity". A message that seeks consent is itself a commercial message | unverified (search summaries of law-firm pages; CRTC pages HTTP 403) | barrysookman.com (2013); Torys (2016) | No change: the build asks for express consent (`consent_review_request`), sends one request per order and offers no incentive (07 E-4) |
| L-23 | **What an express-consent request contains** (CRTC Bulletin 2012-548 †): the purpose, who is asking, their contact details, and that consent can be withdrawn | unverified (prior knowledge; page HTTP 403) | CRTC 2012-548 (not read) | The checkout already says « Facultatif. Vous pouvez changer d'idée en tout temps. » on the shop's own page |
| L-24 | **CFIA, gluten-free claims:** "any representation in labelling or advertising that states, suggests or implies that a food is gluten-free". "Trademarks, brand names, pictures, logos, or slogans that suggest or imply a food is gluten-free" are assessed the same way. Gluten from cross-contamination is kept "as low as reasonably achievable" and "must not surpass 20 ppm". "Foods containing gluten as a result of intentional addition may not be represented as being gluten-free." The page does not mention restaurants, social media or « options » wording | verified (CFIA, modified 2024-03-22) | CFIA "Compliance and enforcement of gluten-free claims" | A9 stands. The Instagram line « Options sans gluten » is a claim (inference: it "suggests") |
| L-25 | **CFIA, lactose claims:** "not prohibited under the FDR [B.01.502(2)(d), FDR]. However, there are no criteria set out in the regulations". CFIA guideline: "lactose-free means that there is no detectable lactose in the food using an acceptable analytical method"; "lactose reduced" means a reduction of 25 % or more | verified (CFIA, modified 2025-01-15) | CFIA "Food composition and quality claims" | Closes 20b §0.8 (« sans lactose » rules not checked). Not on the site; the owner is told |

---

## 2. Market benchmarks

What each shop publishes about its own policy. Seen 2026-10-29. None of these rows says a policy is lawful.

### 2A. Granby

| # | Shop | What it publishes (quotes as returned) | Label | Source | Benchmark for |
|---|---|---|---|---|---|
| M-1 | **Avec un Grand A**, 581 rue Breton | Menu cakes (6–8 or 10–12 portions; « Plage de prix : 45.00$ à 65.00$ »): « Sur commande seulement. Prévoir un délai de 48h heures ouvrables. » The online-order page lists cakes with a cart; no deposit, cancellation or message rule on the pages read | verified (own site) | avecungranda.com product page; « commande en ligne » | Lead time; next day |
| M-2 | **Cake Design Granby**, 194 rue Denison Est | Refund policy: « ANNULATION : Aucun remboursement, ni crédit ne sera accordé. » Changes of flavour, quantity or date until « 7 jours de calendrier AVANT la date de votre réservation »; after that « AUCUNE MODIFICATION de saveurs, quantité ou design et AUCUN REPORT de date n'est possible », and the customer is told to « venir chercher votre gâteau et le congeler pour usage ultérieur » (« se conserve 6 mois au congélateur »). « aucun crédit ne sera accordé advenant une erreur/omission dans la présentation visuelle de la commande » | verified (own refund-policy page; © 2026) | cakegranby.ca refund policy | Cancellation and change deadline. The « aucun remboursement » clause is the kind of fixed-in-advance term L-1 and L-4 describe: **the site must not copy it** |
| M-3 | Cake Design Granby | Online catalogue with a cart (51 products; e.g. « Gâteaux sur Mesure (16 portions et +) », « Soumission (25pers.+) »). The terms of service are a generic template that names another operator. The custom-order page could not be read (HTTP 429) | verified (catalogue); lead time and deposit not seen | cakegranby.ca catalogue; terms | — |
| M-4 | **Rose Gâteaux**, 160 rue Robinson Sud | « il faut généralement commander avec un minimum de 3 semaines d'avance »; « nous demandons un minimum de 1 semaine à l'avance pour tout changement de conception »; « le prix débute à 6,50$ par portion »; signature cakes « un minimum de 12 parts ». No deposit or cancellation rule published | verified (own price page; footer © 2022) | rosegateaux.com/prix.html | Custom lead time; change deadline |
| M-5 | Avec un Grand A, Cake Design, Rose Gâteaux | No delivery service on the pages read (Rose Gâteaux claims a service area in research/03, but its price page does not mention delivery) | unverified (absence) | the pages in M-1…M-4 | Delivery |
| M-6 | **Maître Glacier**, Granby store | Ice-cream cakes for sale online, 36,50 $ to 46 $. No notice period and no message field on the three pages read. research/03 had recorded 48 h notice by phone for some cakes | unverified (lead time not seen today) | granby.maitreglacier.com | Lead time |
| M-7 | **Mont Rose Pâtisserie & Café**, 190 rue Principale | No ordering policy found (search 12; research/03 §1 row 4) | unverified (not found) | research/03; RestoMontreal | — |
| M-8 | Coco Vanille itself, as a third party reports it | "just order by phone and your order will be ready the next day" | unverified (20b T-1; 2025 listing) | Three Best Rated | Next day |

### 2B. Elsewhere in Québec

| # | Shop | What it publishes (quotes as returned) | Label | Source | Benchmark for |
|---|---|---|---|---|---|
| M-9 | **Première Moisson** (chain) | « Il n'est jamais trop tôt pour passer votre commande, vous devez simplement respecter le délai minimum qui varie entre 2, 24 ou 48 heures, selon le(s) produit(s) sélectionné(s). » | verified (own FAQ; undated) | premieremoisson.com FAQ | Lead time; next day |
| M-10 | Première Moisson | Policy page: « L'annulation d'une commande doit être faite au moins 48 heures avant l'heure de cueillette ou de livraison prévue. » « Si la commande a été payée d'avance, elle vous sera remboursée. » The FAQ says instead that changes or cancellation « peut être faite dans un délai de 24 heures (48 heures pour les commandes de traiteur) ». The two pages differ | verified (own pages; undated) | premieremoisson.com policy; FAQ | Free-cancellation window |
| M-11 | Première Moisson | A delivery refused, or nobody home: « vous devrez aller cueillir votre commande en magasin dans les 24 heures suivant l'heure de livraison prévue ». After that the order goes with the day's unsold goods to a donation, without refund | verified (own policy page) | premieremoisson.com policy | Order not picked up |
| M-12 | Première Moisson | Delivers: « aucune marchandise ne sera laissée à la porte » | verified | premieremoisson.com policy | Delivery |
| M-13 | Première Moisson gift cards | « n'ont aucune date d'expiration et ne font l'objet d'aucuns frais »; « Les cartes perdues ou volées ne seront pas remplacées »; they « ne peuvent être remboursées ou échangées contre de l'argent comptant »; usable « dans les succursales Première Moisson participantes »; balance checked online | verified (own terms; undated) | premieremoisson.com gift-card terms | Gift cards |
| M-14 | **Pâtisserie St-Martin** (Laval, Montréal) | « Des douceurs artisanales prêtes à être livrées ou à retirer. » No lead time, deposit or message rule on the pages read | verified (own site) | patisseriestmartin.com | Delivery |
| M-15 | **Café Bazin** (Montréal) | Whole cakes « doivent être commandés au moins 24 heures à l'avance ». The same guide: « plusieurs pâtisseries travaillent uniquement sur commande » | unverified (Tastet guide, updated 2026-10-17) | tastet.ca | Lead time |
| M-16 | **Ma Pâtisserie** (L'Ancienne-Lorette) | Wedding cakes 6 to 12 months ahead; cupcakes and other occasion cakes at least 3 to 4 weeks | unverified (WeddingWire listing, search summary) | weddingwire.ca | Custom lead time |
| M-17 | **La Gâtisserie** (Montréal) | One month's minimum notice | unverified (WeddingWire listing, search summary) | weddingwire.ca | Custom lead time |

### 2C. Outside Québec or of unknown place, and not found

| # | Item | Value | Label | Source | Benchmark for |
|---|---|---|---|---|---|
| M-18 | AZ Cake Design order form (place not established) | 30 % deposit, « Sans acompte, la date n'est pas réservée »; cancelled more than 30 days before, the deposit is kept as a credit; within 30 days, it is kept and not refunded | unverified (search summary of a Jotform form) | form.jotform.com | Deposit % |
| M-19 | Atelier Brimbelle (France) | 50 % at acceptance of the quote to hold the date; balance at delivery | unverified (search summary) | mariages.net | Deposit % |
| M-20 | Cake message length | No Québec bakery limit found (searches 21 and 25; none on the Première Moisson, Avec un Grand A, Maître Glacier or St-Martin pages read). Outside Québec: 30 characters (a TableCheck booking page); 3 lines of 12 characters (a US shop) | unverified (absence; search summaries) | tablecheck.com | Message length |
| M-21 | Next-day cut-off hour | No Québec bakery reached publishes one (search 20) | unverified (absence) | — | Cut-off |
| M-22 | Deposit % in Québec | No Québec or Granby bakery reached publishes one (searches 1, 14, 15, 22). research/15 D12 had found only US or global forum figures (20–30 %) | unverified (absence) | — | Deposit % |

---

## 3. The decisions one by one, with exact wording

### 3.1 A3 · Delivery

- **Lawful:** yes (L-16). **Market:** yes. Small Granby shops publish no delivery; the chains deliver (M-5, M-12, M-14).
- **No correction needed.**
- **Optional copy fix (not a legal point).** The « Livrez-vous? » answers built from `DELIVERY_FR`/`DELIVERY_EN` say twice that orders are picked up. A shorter answer, if the engineer touches them:
  - FR: « Non : la boutique ne livre pas. Toutes les commandes se récupèrent au 3, rue Court, à Granby. »
  - EN: "No: the shop does not deliver. Every order is picked up at 3 rue Court, Granby."

### 3.2 A4 · Deposit for custom cakes

- **The amount is lawful.** No cap was found, and the OPC tells consumers to keep deposits low (L-5).
- **The amount is in line with the market.** No Québec shop publishes a percentage (M-22). The two order forms found take 30 % (place unknown) and 50 % (France) (M-18, M-19). The chains and the Granby shops with online carts appear to take full payment at order: an inference from their carts and from Première Moisson's « payée d’avance », since no checkout was read.
- **The refund rule is bounded by law** (L-1…L-4):
  - The shop may keep only what it has really spent or earned: ingredients or decorations bought for this cake, and work already done. It shows that amount.
  - It may never keep a fixed amount or percentage, never print « non remboursable », and never turn the deposit into a credit the customer did not choose: art. 2129 requires repaying the excess (L-3; analysis).
  - For a custom cake treated as a contract for work, the customer may cancel at any time (L-2).
- **Exact wording to adopt.** It replaces, in the conditions of sale, the marker « Ce que couvre l’acompte et son remboursement en cas d’annulation : [[FACT NEEDED: règle de remboursement de l’acompte, à rédiger avec l’avocat]] ». Because it restates the legal default, the agency can adopt it now; counsel signs it off with the rest of the conditions.
  - FR: « L’acompte réserve votre date et s’applique au prix du gâteau. Si vous annulez, la boutique vous rembourse l’acompte, moins les frais qu’elle a réellement engagés pour votre gâteau avant l’annulation, comme les ingrédients ou les décorations achetés pour vous et le travail déjà fait; elle vous en remet le détail par écrit. Le remboursement est versé dans les 15 jours suivant l’annulation. »
  - EN: "The deposit holds your date and is applied to the price of the cake. If you cancel, the shop refunds the deposit, less the costs it actually incurred for your cake before you cancelled, such as ingredients or decorations bought for you and work already done; it gives you the details in writing. The refund is paid within 15 days of the cancellation."
- **One FAQ answer to correct** (conditions of sale, « Puis-je annuler une commande en ligne à n’importe quel moment? »). Today's « Non : au Québec, il n’existe pas de droit général… » is incomplete for a custom cake (L-2):
  - FR: « Non, sauf pour un gâteau personnalisé : au Québec, il n’existe pas de droit général d’annuler un achat en ligne, et l’annulation suit les règles ci-dessus. Un gâteau personnalisé peut être annulé en tout temps; l’acompte est alors remboursé, moins les frais déjà engagés pour votre gâteau. »
  - EN: "No, except for a custom cake: Québec has no general right to cancel an online purchase, and cancellation follows the rules above. A custom cake can be cancelled at any time; the deposit is then refunded, less the costs already incurred for your cake."
- **The free-cancellation marker** (« Vous pouvez annuler sans frais jusqu’à [[FACT NEEDED: délai d’annulation sans frais avant la cueillette]] ») stays the owner's. Benchmark and legal bounds are in §4.
- **Payment method (L-7, L-9, L-10).** If counsel finds that a custom cake is not a « vente de biens susceptibles de dépérir rapidement », the deposit on an online or phone order may be collected **only by credit card**. Until counsel answers:
  - take custom-cake deposits through the card checkout or payment link, limited to credit cards;
  - take no Interac e-Transfer or debit deposits on phone or online custom-cake orders.

### 3.3 A5 · Gift cards

- **Lawful and in line with the market:** saying the site sells none, and sending the customer to the counter. Première Moisson promises no expiry and no fees (M-13).
- **The law sentence is over-broad** (L-11, L-13, L-14). Fees remain allowed on shopping-centre and bank cards, and so do replacement fees for a lost card (if disclosed before the sale) and customisation fees. Say what the law says about a shop's own card.
- **Exact wording.** FAQ « Vendez-vous des cartes-cadeaux? » / "Do you sell gift cards?":
  - FR: « Le site ne vend pas de cartes-cadeaux pour l’instant; pour savoir si la boutique en offre au comptoir, appelez au 450-372-7177. Au Québec, la carte-cadeau d’un commerce n’a pas de date d’expiration, et aucuns frais ne peuvent être exigés pour sa délivrance ou son utilisation. »
  - EN: "The website does not sell gift cards for now; to find out whether the shop offers them at the counter, call 450-372-7177. In Québec, a shop’s gift card has no expiry date, and no fee can be charged to issue or use it."
- **Exact wording.** Conditions of sale, FAQ « Les cartes-cadeaux expirent-elles? » / "Do gift cards expire?":
  - FR: « Non : au Québec, la carte-cadeau d’un commerce n’a pas de date d’expiration, et aucuns frais ne peuvent être exigés pour sa délivrance ou son utilisation. Le site ne vend pas de cartes-cadeaux pour l’instant; pour la boutique, appelez au 450-372-7177. »
  - EN: "No: in Québec, a shop’s gift card has no expiry date, and no fee can be charged to issue or use it. The website does not sell gift cards for now; for the shop, call 450-372-7177."
- **If the shop sells cards at the counter** (owner): give the buyer the conditions of use and how to check the balance, on the card or on a slip (s. 187.2, L-11).

### 3.4 A6 · Order not picked up

- **Lawful** when the order was ready at the agreed place and time. The money kept is the price of goods made for the customer: the shop has performed (L-8, by analogy), and keeping the price is not a fixed-in-advance penalty in the sense of s. 13 (analysis; unverified).
- **Counsel confirms one case:** a custom cake paid by deposit only. There the 30 % kept is below the value of the work done (L-3), which favours the customer.
- **In line with the market:** Première Moisson holds a refused delivery 24 h, then donates it without refund (M-11). Cake Design Granby gives no refunds and suggests freezing the cake (M-2).
- **Exact wording.** It adds the reason, and in the FAQ removes the clause « appelez … pour convenir d’une autre heure », which appears twice.
  - FAQ « Que se passe-t-il si j’arrive après ma plage de cueillette? », FR: « Appelez la boutique au 450-372-7177 : la commande reste prête jusqu’à la fermeture le jour prévu, et vous pouvez convenir d’une autre heure ce jour-là. Les produits frais ne peuvent pas être gardés au-delà de ce jour; comme la commande a été préparée pour vous, le montant payé n’est alors pas remboursé. »
  - Same, EN: "Call the shop at 450-372-7177: the order stays ready until closing on the planned day, and you can agree on another time that day. Fresh products cannot be kept beyond that day; because the order was made for you, the amount paid is then not refunded."
  - Conditions of sale, « Comment se passe la cueillette? » body, FR: « Commande non récupérée pendant la plage : la commande reste prête jusqu’à la fermeture de la boutique le jour prévu; appelez au 450-372-7177 pour convenir d’une autre heure ce jour-là. Les produits frais ne peuvent pas être gardés au-delà de ce jour; comme la commande a été préparée pour vous, le montant payé n’est alors pas remboursé. »
  - Same, EN: "Order not picked up during the slot: the order stays ready until the shop closes on the planned day; call 450-372-7177 to agree on another time that day. Fresh products cannot be kept beyond that day; because the order was made for you, the amount paid is then not refunded."
- **Optional, the owner's choice:** add « Le solde d’un gâteau personnalisé n’est pas réclamé. » / "The balance of a custom cake is not claimed." It waives money the shop could otherwise claim.

### 3.5 New · The conditions of sale and the perishables exemption

- **What changes.** For fresh goods the distance-contract regime is excluded (L-9). So, in the « Puis-je annuler, et quand suis-je remboursé? » section, these become the shop's own commitments, which are lawful and worth keeping:
  - the 15-day full refund when the shop cannot fill an order or the date differs;
  - the « never moves a date alone » rule.
- **One sentence cites a right that may not exist.** The chargeback right (LPC ss. 54.14–54.16 †) belongs to the excluded regime. Proposed wording, for counsel:
  - FR: « Si un remboursement dû n’est pas fait, vous pouvez aussi vous adresser à l’émetteur de votre carte de crédit. »
  - EN: "If a refund that is owed is not made, you can also contact your credit-card issuer."
  - This replaces « … d’annuler le paiement, dans les 60 jours » / "… to reverse the payment, within 60 days".
- **If counsel finds that custom cakes are not exempt** (L-10): keep the 60-day sentence for them, and apply the credit-card rule (§3.2).
- The answer block's « selon la Loi sur la protection du consommateur » stays true: the LPC's general rules (ss. 11.4, 13, 224, gift cards) still apply.

### 3.6 Side checks · A1 (Loi 25) and A9 (claims)

- **A1: lawful** (L-18). The title « Propriétaire, responsable de la protection des renseignements personnels » and confidentialite@cocovanillegranby.com meet the CAI's « titre et coordonnées ». The mailbox works only once the domain is registered, which is research/21 §3's launch blocker.
- **Privacy page, two markers with a public answer:**
  - « délai de réponse aux demandes d’accès » → « 30 jours » / "30 days" (L-19, verified).
  - « durée de conservation exigée par les règles fiscales » → « 6 ans après la fin de l’année à laquelle les documents se rapportent » / "6 years after the end of the year the records relate to" (L-21, unverified: the accountant confirms it).
- **Privacy page, two additions** from the CAI guide (L-20), for counsel:
  - Before « Si vous n’êtes pas satisfait… », add the shop's own complaint route: « Pour une plainte sur la protection de vos renseignements, écrivez à la personne responsable; elle vous répond par écrit. »
  - Make sure the policy shows an **effective date** next to its last update. Every page's meta line shows « Publié le » (the record's creation date) and « Mis à jour le ». At launch the publication date should be the policy's effective date, or the line should say « En vigueur le ».
- **A9: stands** (L-24, L-25). The site makes no claim. Tell the owner that the Instagram line claims both « sans gluten » (20 ppm, cross-contact included) and « sans lactose » (no detectable lactose). Neither should be repeated anywhere without a person checking it, and a test for lactose.

---

## 4. Open policies: market benchmarks only

The owner decides these (research/21 §4–§5). "Bounds" are the legal limits found here.

| Policy | Benchmark seen | Rows | Bounds from the law |
|---|---|---|---|
| Next-day orders (yes or no; which products) | The shop itself, per a third party: order by phone, ready the next day (2025). Première Moisson: minimum 2, 24 or 48 h by product. Café Bazin: whole cakes at least 24 h. Avec un Grand A (Granby): 48 business hours, so no next day | M-1, M-8, M-9, M-15 | None specific. Online, the date and pickup slot appear in the summary before payment (L-6, as good practice where exempt) |
| Next-day cut-off hour | None published by any Québec bakery reached | M-21 | — |
| Lead time, menu cakes | 24 h (Café Bazin; Première Moisson for some products) to 48 h (Première Moisson) or 48 business hours (Avec un Grand A) | M-1, M-9, M-15 | — |
| Lead time, ice-cream cakes | 48 h by phone at Maître Glacier, per research/03 (not seen today) | M-6 | — |
| Lead time, custom decorated cakes | About 3 weeks (Rose Gâteaux, Granby); 3 to 4 weeks (Ma Pâtisserie); 1 month (La Gâtisserie). Weddings: 6 to 12 months (not offered by Coco Vanille) | M-4, M-16, M-17 | — |
| Change deadline | 7 calendar days (Cake Design Granby); 1 week for design changes (Rose Gâteaux); 24 or 48 h (Première Moisson) | M-2, M-4, M-10 | The shop cannot change the order alone (L-17). After the deadline it may refuse a change, but cannot charge a fixed fee for one (L-1) |
| Free-cancellation window | At least 48 h before pickup, prepaid orders refunded (Première Moisson) | M-10 | Optional. Custom cake: after the window, only actual costs (L-1…L-4). Standard order: the shop may refuse a late cancellation and hand over the order, but may not fix a penalty (L-1, L-4) |
| Cake message length | No Québec limit found. Outside Québec: 30 characters, or 3 lines of 12 | M-20 | None. The site's request form accepts 60 characters (`REQUEST_LIMITS.cakeMessage`). The per-product limit (`cakeMessageMax`) is unset in production; the demo catalogue's 30 is never shipped |
| Gift cards at the counter | Première Moisson: no expiry, no fees, lost or stolen cards not replaced, no cash-out, in store only | M-13 | L-11…L-15 |

---

## 5. Open items (routed)

**Lawyer** (add to 07 §8):
1. Is an online or phone custom-cake order a « contrat de vente de biens susceptibles de dépérir rapidement », exempt from LPC ss. 54.1–54.16 (L-9)? Or is it a contract for work (L-10)? If it is not exempt:
   - any deposit before delivery must be paid by credit card (L-7);
   - the distance-contract rights in L-6 apply to it.
2. Sign off §3.2 (deposit refund), §3.4 (an order not picked up, especially custom cakes paid by deposit only) and §3.5 (the chargeback sentence).
3. Confirm the current consolidated text of LPC ss. 11.4, 13 and 187.1–187.5; only the 2009 text was read. Does a regulation set the s. 187.5 balance-refund threshold (L-12)?
4. CASL: is a review request a commercial message (L-22)? The build asks for express consent either way.
5. The privacy page's complaint route and effective date (§3.6).

**Owner:**
1. Next day: yes or no, which products, and the cut-off hour (§4). This is research/21 §5 item 3.
2. Lead time per cake type, and the change deadline (§4).
3. The longest cake message, per cake size (§4: no Québec benchmark).
4. Optional: a free-cancellation window (§4). Without one, the actual-cost rule of §3.2 applies alone.
5. Gift cards at the counter: yes or no. If yes, the card or a slip shows its conditions of use and how to check the balance (§3.3).
6. Payment methods at the counter and for deposits (20b N-11). The credit-card question in L-7 depends on them.
7. Whether to waive the balance of an uncollected custom cake (§3.4, optional).

**Engineer** (hand-off; no file was edited in this step):
1. In `apps/web/src/seed/content.js`, apply the exact wording of §3.2 (the conditions marker and the « Puis-je annuler une commande en ligne… » FAQ, FR and EN), §3.3 (four gift-card answers), §3.4 (two FAQ answers and two pickup bodies) and §3.5 (the chargeback sentence, FR and EN), once adopted in research/21. `test/unit/content.test.js` may assert some of these strings.
2. On the privacy page, fill the two answered markers (§3.6). Fill the tax one after the accountant confirms it.
3. Until counsel answers lawyer item 1, limit custom-cake deposits to credit cards. A hosted checkout or payment link may otherwise accept debit cards, or wallets that hold them.

**Accountant:** confirm the 6-year retention for the privacy page (L-21). Nothing else new; deposit tax timing stays at 07 §8, accountant Q4.

---

## 6. What this changes in earlier research files (for their owners; not edited here)

| File, row | Change |
|---|---|
| 07 C-2, C-3, C-4, C-5 | Now **Confirmed** by the OPC's 2007 letter (L-6), and scoped by the perishables exemption (L-9) |
| 07, new rows | Payment before delivery by credit card only (L-7); perishables exempt from the distance-contract rules (L-9) |
| 07 C-11 | Statute text seen (L-11). The Éducaloi fee figures (3,50 $; 2,50 $ a month after 15 months) apply to shopping-centre or regional cards only (L-14) |
| 07 C-13; lawyer Q7 | **Confirmed in principle:** no non-refundable deposit and no fixed retention; only actual costs (L-1…L-4). Counsel still signs the wording |
| 07 P1 | Title and contact details on the website: **Confirmed** on the CAI's own page (L-18) |
| 07 §10 queue, items 3 and 4 | Partly run here: the OPC pages on deposits and distance contracts; arts. 2125 and 2129 through a law firm |
| 15 D12 | « Refundability, deadline and no-show rule: owner + counsel » is now bounded by law (§3.2, §3.4) |
| 20b §0.8 | « Sans lactose » rule found: no detectable lactose (L-25) |
| 21 §1 A4, A5, A6 | Wording in §3.2–§3.4. A4 depends on a counsel question about payment by credit card (§3.2) |

---

## Search log

### WebSearch (25 queries, standard mode, US-located, 2026-10-29)

| # | Query (verbatim) | Filter | Useful result |
|---|---|---|---|
| 1 | "Cake Design" Granby gâteau commande délai acompte | — | No Granby policy. AZ Cake Design form: 30 % (M-18) |
| 2 | Office de la protection du consommateur acompte annulation contrat commerçant garder l'acompte | — | Protégez-Vous (OPC partner): credit-card-only prepayment sentence, which led to L-7 |
| 3 | Office de la protection du consommateur carte-cadeau date d'expiration frais exceptions carte promotionnelle | — | Other provinces only |
| 4 | carte prépayée carte-cadeau date d'expiration frais | opc.gouv.qc.ca | The OPC prepaid-card pages (L-13…L-15) |
| 5 | acompte annulation dommages commerçant rembourser | opc.gouv.qc.ca | OPC: no penalty fixed in advance; the 20 % example (L-4) |
| 6 | "Loi sur la protection du consommateur" article 13 "frais, de pénalités ou de dommages" "stipulé à l'avance" acompte non remboursable | — | The 2009 amending act's PDF (L-1, L-2, L-11, L-17) |
| 7 | Code civil du Québec article 2125 2129 résiliation unilatérale client contrat d'entreprise "restituer les avances" acompte | — | Langlois; case PDFs (L-3) |
| 8 | "Est interdite la stipulation" "impose au consommateur" "inexécution de son obligation" "stipulé à l'avance" article 13 | — | A CAIJ e-Lois link (then a login wall) |
| 9 | "paiement à l'avance" "autre moyen que la carte de crédit" interdit commerçant contrat Québec | — | The same Protégez-Vous sentence; no article number |
| 10 | payer à l'avance attention contrat conclu par téléphone ou par Internet carte de crédit rétrofacturation paiement anticipé | opc.gouv.qc.ca, protegez-vous.ca | OPC « Moment du paiement »; OPC 2007 letter (L-6, L-7, L-9) |
| 11 | "Avec un grand A" Granby gâteau commande | — | Address, phone, prices; no policy |
| 12 | Granby gâteaux sur commande "Rose" OR "Mont Rose" pâtisserie délai commande acompte | — | Nothing for Mont Rose (M-7) |
| 13 | Maître Glacier Granby gâteau glacé commande délai 48 heures | — | Head office in Granby; no lead time |
| 14 | pâtisserie Québec conditions commande gâteau personnalisé acompte 50 % "non remboursable" délai minimum semaines | — | La Gâtisserie one month (M-17); French examples |
| 15 | pâtisserie Sherbrooke OR Magog OR Bromont gâteau sur commande délai "heures à l'avance" OR "jours à l'avance" acompte | — | Nothing local |
| 16 | responsable de la protection des renseignements personnels titre coordonnées publiés site Internet entreprise | cai.gouv.qc.ca | CAI pages and guide (L-18…L-20) |
| 17 | Revenu Québec conservation des registres et pièces justificatives six ans entreprise | revenuquebec.ca, canada.ca | 6 years after the last year (L-21) |
| 18 | CASL review request email "commercial electronic message" feedback survey consent CRTC | — | The purpose test; not decisive (L-22) |
| 19 | CFIA "lactose-free" claim requirements "gluten-free" advertising restaurant bakery not prepackaged | inspection.canada.ca, canada.ca | CFIA pages (L-24, L-25) |
| 20 | boulangerie pâtisserie Québec commande gâteau "pour le lendemain" "avant midi" OR "avant 14 h" OR "avant 15 h" OR "avant 12 h" heure limite | — | No cut-off hour found (M-21) |
| 21 | gâteau "message" "caractères maximum" OR "maximum de caractères" OR "max. 30 caractères" OR "25 caractères" pâtisserie Québec commande en ligne | — | No Québec limit; 30 characters outside Québec (M-20) |
| 22 | gâteau de mariage OR gâteau personnalisé Québec pâtisserie "dépôt de 50" OR "acompte de 50" OR "dépôt de 25" OR "acompte de 30" réservation de la date | — | Ma Pâtisserie 3–4 weeks (M-16); Brimbelle 50 % (M-19); no Québec deposit % |
| 23 | pâtisserie Québec "commande non récupérée" OR "commandes non récupérées" OR "non réclamée" gâteau "ne sera pas remboursée" OR "aucun remboursement" | — | Nothing from Québec |
| 24 | "biens susceptibles de dépérir rapidement" contrat conclu à distance Loi sur la protection du consommateur règlement exemption article | — | OPC 2021 release: draft s. 6.1 b) (L-9) |
| 25 | commander gâteau en ligne inscription "caractères" Québec IGA OR Metro OR Provigo OR Costco OR "Première Moisson" message sur le gâteau | — | Nothing |

### WebFetch (53 calls, 2026-10-29)

| # | URL (short) | Result |
|---|---|---|
| 1 | protegez-vous.ca « Payer à l'avance? Attention! » | HTTP 403 |
| 2–3 | OPC « Mise de côté et acompte » (merchants); OPC "Layaways and down payments" (EN) | Read (L-4, L-5) |
| 4–7 | OPC prepaid cards: expiry (EN), fees (EN), rules (EN), specific-good cards (FR) | Read (L-13…L-15) |
| 8 | legisquebec.gouv.qc.ca P-40.1 | HTTP 403 |
| 9, 11 | langlois.ca (redirect, then the article) | Read (L-3) |
| 10 | canlii.org LPC | HTTP 403 |
| 12–13 | elois.caij.qc.ca article 13; app.caij.qc.ca | "Moved" notice; login wall |
| 14 | publicationsduquebec.gouv.qc.ca 2009C51F.PDF | Saved; pages 1–14 read (L-1, L-2, L-11, L-12, L-17) |
| 15 | OPC « Moment du paiement » (distance contracts) | Read (L-7, L-9) |
| 16 | cdn.opc.gouv.qc.ca « De nouvelles règles relatives aux contrats à distance » (PDF) | Saved; 4 pages read (L-6…L-9, L-16) |
| 17 | maitreglacier.com | DNS failure |
| 18, 20 | premieremoisson.com FAQ (redirect, then the page) | Read (M-9, M-10) |
| 19, 21 | patisseriestmartin.com; /nos-gateaux/ | Read (M-14) |
| 22–23 | Première Moisson exchange, refund and delivery policy; gift-card terms | Read (M-10…M-13) |
| 24 | threebestrated.ca « 3 Meilleurs Pâtisseries à Granby » | Read: the three Granby cake shops and their sites |
| 25–28 | avecungranda.com, cakegranby.ca, rosegateaux.com (bare domains); www.avecungranda.com | DNS failures |
| 29 | www.cakegranby.ca refund policy | Read (M-2) |
| 30, 32 | www.rosegateaux.com; /prix.html | Read (M-4) |
| 31, 38 | www.cakegranby.ca catalogue | HTTP 429, then read (M-3) |
| 33 | CAI page on the person in charge | Read (L-18, L-19) |
| 34 | CAI guide « Rédiger une politique de confidentialité » (PDF) | Saved; guide pp. 1–11 read (L-20) |
| 35 | crtc.gc.ca Bulletin 2012-548 | HTTP 403 |
| 36–37 | CFIA gluten-free claims; CFIA composition and quality claims | Read (L-24, L-25) |
| 39 | www.cakegranby.ca terms of service | Read: a generic template |
| 40, 41, 45, 50, 52 | www.cakegranby.ca custom-order page (×4); classic-cakes collection | HTTP 429 |
| 42 | tastet.ca birthday-cake guide | Read (M-15) |
| 43–44, 46 | www.avecungranda.com home; « commande en ligne »; a cake product page | Read (M-1) |
| 47–49 | granby.maitreglacier.com home; ice-cream cakes; a product page | Read (M-6) |
| 51 | cdn.opc.gouv.qc.ca 2021 release, document 8 (PDF) | Saved; 3 pages read (L-9) |
| 53 | revenuquebec.ca record-keeping page | HTTP 403 |

---

## Sources

All seen 2026-10-29. "Direct read" = opened with WebFetch (PDFs read from the saved file). Otherwise, a WebSearch summary.

Law and regulators
- Projet de loi n° 60 (2009, chapitre 51), Loi modifiant la Loi sur la protection du consommateur et d'autres dispositions législatives (Éditeur officiel du Québec), direct read — https://www.publicationsduquebec.gouv.qc.ca/fileadmin/Fichiers_client/lois_et_reglements/LoisAnnuelles/fr/2009/2009C51F.PDF — seen 2026-10-29
- Mise de côté et acompte (OPC, commerçants; updated 2025-03-04), direct read — https://www.opc.gouv.qc.ca/commercant/secteur/bien-consommation/vetement/echange-remboursement/acompte/ — seen 2026-10-29
- Layaways and down payments (OPC, EN; updated 2026-07-30), direct read — https://www.opc.gouv.qc.ca/en/consumer/topic/exchanging-layaways/layaway-down-payment/ — seen 2026-10-29
- Moment du paiement, contrats à distance (OPC, commerçants; modified 2023-08-10), direct read — https://www.opc.gouv.qc.ca/commercant/pratique-commerce/contrats-distance/paiement — seen 2026-10-29
- De nouvelles règles relatives aux contrats à distance (OPC, Lettre d'affaires, December 2007), direct read — https://cdn.opc.gouv.qc.ca/media/documents/commercant/secteur/bien-consommation/la-regles-contrats-distance.pdf — seen 2026-10-29
- Tableau des commentaires reçus… projet de règlement modifiant le Règlement d'application de la LPC (OPC, access-to-information release 2021, document 8), direct read — https://cdn.opc.gouv.qc.ca/media/documents/a-propos/AccesInformation/2021/344001991_Document8.pdf — seen 2026-10-29
- Expiry date: prepaid cards usable as cash (OPC, EN; 2025-03-04), direct read — https://www.opc.gouv.qc.ca/en/consumer/good-service/prepaid-card/cash/expiration/ — seen 2026-10-29
- Activation, usage and replacement fees (OPC, EN; 2021-05-03), direct read — https://www.opc.gouv.qc.ca/en/consumer/good-service/prepaid-card/cash/fee/ — seen 2026-10-29
- Rules for prepaid cards and rewards programs (OPC, EN; 2025-04-09), direct read — https://www.opc.gouv.qc.ca/en/consumer/topic/contract/rules/card/ — seen 2026-10-29
- Date d'expiration: cartes échangeables contre un bien ou un service précis (OPC, commerçants; 2025-03-04), direct read — https://www.opc.gouv.qc.ca/commercant/secteur/carte-prepayee/carte/date-dexpiration — seen 2026-10-29
- Payer à l'avance? Attention! (Protégez-Vous with the OPC; HTTP 403 on direct read) — https://www.protegez-vous.ca/partenaires/office-de-la-protection-du-consommateur/payer-a-l-avance-attention — seen 2026-10-29
- The Specific Regime for Termination of a Contract of Enterprise or a Contract for Services: Pros and Cons (Langlois, 2016-08-22), direct read — http://langlois.ca/en/insights/specific-regime-termination-contract-enterprise-contract-services-pros-cons/ — seen 2026-10-29
- Responsabilité des entreprises : responsable de la protection des renseignements personnels (CAI), direct read — https://www.cai.gouv.qc.ca/protection-renseignements-personnels/information-entreprises-privees/responsable-protection-renseignements-personnels-entreprise — seen 2026-10-29
- Rédiger une politique de confidentialité, guide explicatif pour les entreprises (CAI, PDF), direct read — https://www.cai.gouv.qc.ca/uploads/pdfs/CAI_GU_POL_Confidentialite.pdf — seen 2026-10-29
- Tenue de registres et conservation des pièces justificatives, TPS/TVH et TVQ (Revenu Québec; HTTP 403 on direct read) — https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq/regles-de-base-relatives-a-lapplication-de-la-tpstvh-et-de-la-tvq/tenue-de-registres-et-pieces-justificatives/ — seen 2026-10-29
- Conserver vos registres et vos pièces justificatives (Revenu Québec) — https://www.revenuquebec.ca/fr/entreprises/retenues-a-la-source-et-cotisations-de-lemployeur/registres-et-pieces-justificatives/ — seen 2026-10-29
- Compliance and enforcement of gluten-free claims (CFIA; modified 2024-03-22), direct read — https://inspection.canada.ca/en/food-labels/labelling/industry/allergens-and-gluten/gluten-free-claims — seen 2026-10-29
- Food composition and quality claims (CFIA; modified 2025-01-15), direct read — https://inspection.canada.ca/en/food-labels/labelling/industry/composition-and-quality — seen 2026-10-29
- CRTC FAQ on CASL (barrysookman.com, 2013-12-18) — https://barrysookman.com/2013/12/18/crtc-faq-on-casl/ — seen 2026-10-29
- CRTC Releases Guidelines on CASL Consent Records (Torys, 2016-07) — https://www.torys.com/our-latest-thinking/publications/2016/07/crtc-releases-guidelines-on-casl-consent-records — seen 2026-10-29

Market, Granby
- 3 Meilleurs Pâtisseries à Granby, QC (Three Best Rated), direct read — https://threebestrated.ca/fr-gâteaux-in-granby-qc — seen 2026-10-29
- Gâteau vanille et sucre à la crème (Avec un Grand A), direct read — https://www.avecungranda.com/product/gateau-vanille-et-sucre-a-la-creme/ — seen 2026-10-29
- Produits & commande en ligne (Avec un Grand A), direct read — https://www.avecungranda.com/commande-en-ligne/ — seen 2026-10-29
- Politique de remboursement (Cake Design Granby), direct read — https://www.cakegranby.ca/policies/refund-policy — seen 2026-10-29
- Catalogue (Cake Design Granby), direct read — https://www.cakegranby.ca/collections/all — seen 2026-10-29
- Conditions d'utilisation (Cake Design Granby), direct read — https://www.cakegranby.ca/policies/terms-of-service — seen 2026-10-29
- Prix (Rose Gâteaux), direct read — https://www.rosegateaux.com/prix.html — seen 2026-10-29
- Rose Gâteaux, home page, direct read — https://www.rosegateaux.com/ — seen 2026-10-29
- Gâteaux à la crème glacée (Maître Glacier Granby), direct read — https://granby.maitreglacier.com/categorie-produit/gateaux-2/gateaux-a-la-creme-glacee/ — seen 2026-10-29
- Signature Bleuet (Maître Glacier Granby), direct read — https://granby.maitreglacier.com/produit/signature-bleuet/ — seen 2026-10-29
- Mont Rose Pâtisserie & Café Granby (RestoMontreal; via research/03) — https://www.restomontreal.ca/resto/mont-rose-patisserie-cafe-granby/23174/en/ — seen 2026-10-29
- 3 Best Bakeries in Granby, QC (Three Best Rated; via 20b T-1) — https://threebestrated.ca/bakeries-in-granby-qc — seen 2026-10-29

Market, elsewhere in Québec
- FAQ (Première Moisson), direct read — http://premieremoisson.com/fr/faq — seen 2026-10-29
- Politique d'échange, de remboursement et de livraison (Première Moisson), direct read — http://premieremoisson.com/fr/politique-d-echange-remboursement-et-livraison — seen 2026-10-29
- Cartes-cadeaux, modalités d'utilisation (Première Moisson), direct read — http://premieremoisson.com/fr/cartes-cadeaux/modalites-d-utilisation — seen 2026-10-29
- Pâtisserie St-Martin, home page and « Nos gâteaux », direct read — https://patisseriestmartin.com/ — seen 2026-10-29
- Où trouver les meilleurs gâteaux d'anniversaire à Montréal (Tastet, updated 2026-10-17), direct read — https://tastet.ca/listes/ou-trouver-les-meilleurs-gateaux-danniversaire-a-montreal-nos-suggestions/ — seen 2026-10-29
- Ma Pâtisserie (WeddingWire) — https://www.weddingwire.ca/wedding-cakes/ma-patisserie--e16269 — seen 2026-10-29
- La Gâtisserie (WeddingWire) — https://www.weddingwire.ca/wedding-cakes/la-gatisserie--e2141 — seen 2026-10-29

Outside Québec or of unknown place
- AZ Cake Design order form (Jotform; place not established) — https://form.jotform.com/230825029481859 — seen 2026-10-29
- Atelier Brimbelle (mariages.net) — https://www.mariages.net/wedding-cake/atelier-brimbelle--e407723 — seen 2026-10-29
- A TableCheck booking page with a 30-character message limit — https://www.tablecheck.com/fr/shops/auralenti/reserve — seen 2026-10-29

Read but returned nothing usable (listed for the record): Légis Québec and CanLII (HTTP 403); CAIJ e-Lois (moved; login wall); CRTC Bulletin 2012-548 (HTTP 403); maitreglacier.com (DNS failure); Cake Design Granby's custom-order and classic-cakes pages (HTTP 429).
