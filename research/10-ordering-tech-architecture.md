# 10 · Ordering system: technical architecture (plan level)

> Track: the ordering engine on cocovanillegranby.com: payments, POS, capacity, checkout, cake builder, notifications, kitchen output, feeds, tax, events. Stage: plan only, no build. Written 2026-10-25.
> Not repeated here: hosting, nginx, deploys, backups and SES setup (research/17); the Studio stack, roles, SSE, printing hardware, scanner and security (research/16b); admin UX patterns and label hardware (research/16a); legal requirements (research/07); verified search facts (research/06).
> Inputs: `plan-v0c-site-ux-ordering.md` §5–§9, `plan-v0a-master-plan.md` §2.1, §4.2–4.4, §6.8, `plan-v0b-multilingual-local-domination.md` A3, `plan-v1-ranking-stack.md` §3, §6, `requirements-2026-10-25.md`, and research/01, 02, 03, 04, 06, 07, 16a, 16b, 17, 18.
> research/06 and research/07 appeared while this file was being written. Both were read and reconciled:
> - Availability values follow 06 (k).
> - Tax, CASL, refund, gift-card and checkout rules follow 07.
>
> I didn't edit either file. research/08 was not read (outside this track).
> Labels:
> - **Seen** = an official vendor or government page as summarized by WebSearch on 2026-10-25 (page not opened; WebFetch is blocked).
> - **3rd-party** = a non-official page.
> - **UNVERIFIED** = prior knowledge, conflicting sources, or no source.
> - **[[FACT NEEDED: …]]** = the owner must supply it.
> - **(est.)** = my own estimate.
>
> Search budget: 10 of 10 used. Unsearched questions are in §15.
> Code sketches are JavaScript only and illustrative. All four were run in Node against small fixtures, never in production.

---

## 0. Decisions in one screen

| Question | Recommendation | Why |
|---|---|---|
| Order system of record | **Our own engine** in Payload/Postgres on the VPS (16b, 17) for web orders, capacity, quotes and pre-orders | Payload is being built anyway. A POS has no capacity, date-first or builder features. Orders stay in the chosen data location |
| Payment processor | **Depends on the POS.** POS = Square → Square Web Payments SDK + Orders API, so online orders land in Square's Order Manager. Any other POS, or none → **Stripe** (embedded Payment Element + Express Checkout Element) | v0c §8 rule #1: online orders on the same screen or printer as walk-ins. Square: no Orders API fee with Square payments, 1 % with another processor (Seen, §1.3). [[FACT NEEDED: POS]] |
| Online fees (CAD) | Stripe **2.9 % + C$0.30** for domestic cards. Square Canada **2.8 % + 30¢** online (one Square page still shows 2.9 %) | §1.1 |
| Interac | **Don't plan for "Interac en ligne"**: it was discontinued (Oct 31, 2024 per Wikipedia; credit-union notices). Interac debit online goes through Apple Pay / Google Pay with Square or Moneris (Seen) | §1.1 |
| Deposits | **A separate charge now, the balance later.** No card holds: Stripe online holds last **about 7 days**, and Stripe doesn't support holds beyond that (Seen). Custom cakes are booked weeks ahead | §1.2 |
| PCI scope | Aim for **SAQ A**: card fields only in the processor's iframes, and **no third-party scripts on the payment page** (2025 SAQ A eligibility criterion; vendor readings) | §1.4 |
| Capacity | Units per **production category × production day**; 15-minute pickup windows with a maximum per window; blackouts; cut-off placeholder « avant 14 h pour demain »; `America/Toronto`. Atomic SQL reserve with a 10-minute hold | §3 |
| Tax | Effective-dated tax classes per **research/07 §6**. Since **2026-07-15**, QST is zero-rated on single-serving sweet goods, while GST still applies under 6 units. A product with no approved class **can't be sold** | §9 |
| Availability markup | Per **research/06 (k)** (Google Merchant Center help): a returning seasonal item taking orders = **`BackOrder` + date**; **`PreOrder` only for a never-sold product**; daily sell-out = `SoldOut` | §8 |
| Purchase event | **Server-side only**: GA4 Measurement Protocol from the payment webhook, sent only when the stored consent allows it. Consent Mode **basic** (07 S7): no Google tag before opt-in | §10. This also keeps tags off the payment page |
| Notifications | Email via SES ca-central-1 (17). Twilio SMS with **GSM-7-safe French templates** that carry ID + « STOP » (07 E-2) and fit one segment | §6 |
| Loi 25 | The VPS in Québec covers orders. **The payment processor, Twilio and GA4 still each need an ÉFVP** (07 §2) | — |
| Build vs buy | **Build the thin engine; buy everything regulated or deliverability-heavy** (payments, SMS, email). **Noël 2026 bridge:** payment links + the plan-v1 request form, because the engine only goes live in plan weeks 11–12 | §13 |
| Monthly run cost | ≈ **C$37–75 fixed** (hosting from 17, plus SMS and email) **+ about 3.4–3.6 % of online sales** in card fees (est., §12) | — |

---

## 1. Payments in Canada (facts found)

### 1.1 Processors

| Provider | Online card rate (CAD) | Wallets | Interac debit online | Monthly fee | Status / source |
|---|---|---|---|---|---|
| **Stripe** | **2.9 % + C$0.30** per successful domestic card transaction. +0.8 % for international cards; +2 % if currency conversion applies | Not priced separately on the pricing page. "Included in the card rate" appears only on 3rd-party and reseller pages (UNVERIFIED) | Stripe's Canadian regulatory disclosures list **Interac Debit 2.9 % + CA$0.30** (online) and **CA$0.15** (in-person). Xero CA says C$0.30 per transaction. **What Stripe accepts as "online Interac" was not confirmed** (UNVERIFIED) | None | Seen: stripe.com/en-ca/pricing; regulatory disclosures (the page seen is the `/ae/` locale). 3rd-party: Xero CA, OLIVER POS |
| **Square Canada** | **2.8 % + 30¢** for online sales (Square Online, eCommerce API, invoices). Conflict: another Square CA page at the same path shows **2.9 % + 30¢**, and Wise (3rd-party) also cites 2.9 %. Keyed-in 3.3 % + 15¢. In-person credit 2.5 % | Interac debit through Apple Pay / Google Pay on Square Online is billed at the online rate | Yes, through wallets. In-person: 0.75 % + 7¢ | None. Custom pricing above $250k a year in card sales | Seen: squareup.com/ca/en/payments/our-fees (+ the conflicting square.com copy). Square CA payment terms: **+1.5 % international transaction fee from 2026-03-03**. Square CA press release on lower fees (date not read) |
| **Moneris** | **Not found.** [[FACT NEEDED: Moneris quote]] | Checkout lists Apple Pay, Google Pay, credit, debit, gift cards | Interac Debit through Apple Pay / Google Pay online (Moneris blog, 2021). Moneris called itself the first Canadian acquirer with Interac on Google Pay (2020) | Not found | Seen: go.moneris.com/getcheckout, /onlinepayments; moneris.com blog (2021), news (2020). Hosted page or API |
| **Shopify Payments** (only on the Shopify path) | ≈ 2.9 % + C$0.30 on Basic (3rd-party; a 2024 article says 2.8 %). Shopify's community: the rate depends on the plan. **2.0 % third-party-gateway fee** without Shopify Payments (one 3rd-party guide) | — | — | Basic **C$37–69/month** across three 3rd-party guides (conflicting). POS Pro **$79–89 per location per month** (3rd-party; currency conflicting) | 3rd-party only: salaccounting.ca, ecomcalctools, arslanemre, eseospace, qualimero |
| **Interac Online** (bank-redirect checkout) | — | — | **Discontinued**: Oct 31, 2024 (Wikipedia). Credit unions announced it for fall 2024. e-Transfer is not affected | — | Wikipedia; Kindred CU and Mainstreet CU notices |

What this means:
- **Card fees dominate the run cost.** A C$45 order costs C$1.61 on Stripe and C$1.56 on Square (computed from the rates above).
- **Splitting a payment costs one extra fixed fee.** A C$30 deposit + C$70 balance on Stripe costs C$1.17 + C$2.33 = **C$3.50**, against **C$3.20** for one C$100 charge (computed).
- **Foreign cards cost more:** Stripe +0.8 %, Square +1.5 % since 2026-03-03. That matters for Zoo visitors.
- **Same price whatever the payment method** (07 C-10, O11). A card surcharge is never passed on.

### 1.2 Deposits, holds, refunds

| Mechanism | Fact | Fit for Coco Vanille |
|---|---|---|
| Card hold (authorize now, capture later) | Online holds typically last **about 7 days**, in-person Terminal holds 2 days. Extended authorization exists for some eligible payments. Stripe support says it doesn't support holds **beyond 7 days**. An expired hold is released and the payment cancelled (Seen: docs.stripe.com capture-later; support.stripe.com) | Only for pickups ≤ 6 days away, and only if the owner wants "charge at pickup". **Not for custom cakes** |
| Re-authorizing before expiry | Possible, but funds may be held twice for a few days (Seen, same docs) | Never: it confuses customers |
| Partial capture | Capturing less releases the rest, which can't be captured later (3rd-party dev.to, consistent with the Stripe docs) | Not a deposit tool |
| Fees on uncaptured holds | "Fees only when captured" comes from a 3rd-party property-management page. Stripe's pricing page doesn't confirm it (UNVERIFIED) | — |
| **Deposit as its own charge** | A PaymentIntent (Stripe) or a payment (Square) for the deposit amount. The balance comes later by payment link, or at the counter on the POS | **Recommended.** Payment Links exist on Stripe and Square (via 16b). Square Invoices take a fixed or % deposit with a separate balance due date (via 16a). Copy: « Acompte : 40,00 $ aujourd'hui · Solde : 85,00 $ au ramassage » (07 O8; dépôt or acompte is still the owner's choice, 16a) |
| Full payment at order | One charge | **Recommended for vitrine reservations and holiday pre-orders** (fewer no-shows). The conditions say when payment is taken (07 O14) |
| Refunds | After a valid cancellation, **refund within 15 days** (LPC 54.13, Confirmed by the OPC via 07 C-6). The bakery **never moves a confirmed date alone**: the customer picks a new slot or gets a full refund (07 O7). Studio runs a 15-day timer (07 A9). « Rembourser » is owner-only with a passkey step-up (16b §4). Whether processing fees come back on a refund: **UNVERIFIED** (§15) | Deposit refundability: counsel (07 C-13, lawyer Q7). [[FACT NEEDED: deposit %, cancellation deadline]] |

Deposit size: research/02 found forum deposits of **20–30 %**, from US/global sources (via 05), not Québec. Studio setting `depositPercent` has **no default** until the owner sets it.

### 1.3 POS systems and their APIs

**POS market share in Québec bakeries:** I found no source (UNVERIFIED). One Granby rival with its own online cart (Cake Design Granby) appears to run Shopify; research/03 inferred this from its URL patterns. **Coco Vanille's POS: [[FACT NEEDED: POS brand, plan, terminals, receipt/kitchen printer]].**

| POS | Orders API | Catalogue / inventory API | Access | Gotchas | Source |
|---|---|---|---|---|---|
| **Square** | Records items, totals, payments and fulfilment. Fulfilment types **PICKUP**, SHIPMENT, DELIVERY. Can send fulfilment orders to the Square Point of Sale app | Catalog API ("unlocks the full range" of Orders). Inventory API for counts and changes. Orders update inventory when closed or charged. Webhook `inventory.count.updated` | Developer app + OAuth (via 16b) | **No Orders API fee with Square payments; 1 % per transaction with another processor** (Canada not stated). Paid orders with fulfilment details appear in Order Manager (via 16b). Square inventory-tracked items can't be 86'd (via 16a) | Seen: developer.squareup.com Orders API "what it does" / "how it works", Inventory webhooks |
| **Lightspeed Restaurant (K-Series)** | `POST /o/op/1/order/local` and `/order/to-go` (3rd-party) | Rich items CRUD by SKU (3rd-party) | **Partner Program**; merchants go through their account manager (3rd-party, two accounts differ) | "In continuous development", short deprecation runways (3rd-party scorecard) | 3rd-party: supergood.ai, jentic, codat |
| **Clover** | Orders API covers the US and Canada (via 16b) | Not researched | A Clover app is needed for webhooks (via 16b) | Webhooks send IDs only (via 16b) | via 16b only |
| **Shopify POS** | Not researched (UNVERIFIED) | Not researched | — | POS Pro $79–89 per location; 2 % third-party-gateway fee (3rd-party) | §1.1 |
| **Moneris** (terminal / Moneris Go) | Not researched (UNVERIFIED) | — | — | — | — |

Integration rule by POS:

| If the POS is… | Payments | Online orders appear in | Catalogue master |
|---|---|---|---|
| Square | Square Web Payments SDK (card, Apple Pay, Google Pay; Interac via wallets) | Square Order Manager (Orders API, PICKUP) **and** Studio « Aujourd'hui » | **Payload** for web content. Each variant stores `squareVariationId`; a nightly job flags price drift |
| Clover, Lightspeed, Moneris, other | Stripe | Studio « Aujourd'hui » + Star CloudPRNT printer (16b §3). No POS push in v1 | Payload |
| Shopify POS | Re-open buy option C (§13) | Shopify | Shopify |
| None / cash register | Stripe | Studio + printer | Payload |

Never mix processors. Square POS + Stripe online means two payouts, two reconciliations, and the 1 % Orders API fee if orders are pushed into Square.

### 1.4 PCI scope with hosted fields

| Fact (vendor readings of PCI SSC documents; the PCI SSC PDFs were not opened) | Source |
|---|---|
| The SAQ A revision of **January 2025** removed requirements **6.4.3, 11.6.1 and 12.3.1** from SAQ A | 3rd-party: SecurityMetrics, Jscrambler, Report URI |
| They were replaced by **eligibility criteria**: (1) the merchant confirms its site is **not susceptible to attacks from scripts** that could affect its e-commerce systems; (2) **all elements of the payment page or form** delivered to the browser must originate **only and directly from a PCI DSS compliant TPSP or processor** | same |
| **FAQ 1588 (Feb 2025)** defines "site" as the page that hosts the TPSP iframe. The merchant either applies techniques like those in 6.4.3 / 11.6.1, **or** confirms that the TPSP provides those script protections on its behalf | same; PCI SSC community-session page (NACM track) |

Design consequences:
- Card data only ever enters **the processor's iframes**: Stripe Payment Element + Express Checkout Element, or Square's card and wallet iframes. The fallback is Stripe Checkout, a redirect to Stripe's hosted page: smallest scope, but the customer leaves the domain.
- **`/commander/paiement/` runs no GTM, no pixels, no chat widget, no A/B tool.** Nonce-based CSP with `script-src 'self' 'nonce-…' https://js.stripe.com` (or Square's SDK host), per 16b §4 #10.
- A script inventory for that page is kept in the repo and checked in CI.
- This is one more reason the `purchase` event is server-side (§10).
- No card data is stored or logged. Only webhooks can mark an order "paid".

---

## 2. Domain model

**C** = Payload collection (configuration and documents). **T** = plain SQL table for hot counters that need atomic conditional updates, created by a migration through the Postgres adapter's Drizzle instance [[VERIFY: Payload 3 raw-SQL / Drizzle access]]. This extends v0a §6.8 and v0c §8.

| Entity | Kind | Key fields | Notes |
|---|---|---|---|
| `Product` | C | name/description ×3 locales, paths ×3, `productionCategory`, `allergens[]` (human-verified "vérifié le … par …", 07 A2), images, `channels` (site / feed), `everSold` (for PreOrder vs BackOrder, §8) | One page per product |
| `Variant` | C | `sku`, size (po + cm), `portions`, `priceCents` (all-in before taxes, 07 C-9), **`unitGrams`, `soldAs` (unpackaged / prepackaged), `packCount`** (07 A7, S9), **`taxClass`: `basic` / `sweet` / `taxable` / `giftcard` / `ask`, default `ask`** (07 §6), `leadDays`, `productionOffsetDays` (made the day before = 1), `capacityUnits`, `squareVariationId?` | `ask` blocks online sale (07 O13) |
| `OptionGroup` / `Option` | C | flavour, filling, finish, decoration; `surchargeCents`; `extraUnits`; `forcesQuote` | Builder and catalogue share these |
| `Rule` | C | `if` (options) → `block` / `surcharge` / `forceQuote` / `minLeadDays` | Rules engine (v0c §6) |
| `DailyStock` (vitrine du jour) | C + T | `date`, `variant`, `planned`, `reserved` (T), `soldOutAt`, `photo` | « Épuisé » in 2 taps (16a). Online reservations count against `planned` |
| `Box` (compose ta boîte) | C | `size`, allowed variants, `fillRule` | One line with child selections. Its `packCount` feeds tax rows 4–5 (07 §6) |
| `Season` | C | `preorderOpensAt`, `preorderClosesAt`, `pickupDates[]`, `menu[]`, `capacityOverrides`, `mode: 'date-first'` | « Les précommandes de bûches ouvrent le 1er novembre » (v0c) |
| `CapacityRule` | C | `category`, weekday defaults, per-date overrides | Studio « Capacité » |
| `capacity_pool` | T | `prod_date`, `category`, `cap_limit`, `used` | Materialized 60 days ahead by a worker job |
| `pickup_window` | T | `pickup_date`, `start_hhmm`, `booked` | Max per window from settings |
| `capacity_hold` | T | `order_id`, `lines` (json), window, `expires_at` | Released after 10 min if unpaid |
| `Blackout` | C | `from`, `to`, `reason`, `publicMessage` ×3, `status: 'à confirmer' \| 'fermé' \| 'ouvert'` | Pre-loaded with the statutory holidays (§3.4) |
| `Order` | C | `number`, `status`, `mode`, `pickupWindow`, `pickupCode` (4 digits), `qrToken`, `locale`, **`conditionsVersion`, `acceptedAt`, `bindingLanguage`, `contractSentAt`** (07 O2, O3, O6), `consentSnapshot`, `clickIds`, `gaClientId?` | Guest by default |
| `OrderItem` | C | variant, options, `cakeMessage`, `unitCents`, `qty`, `taxClass` (snapshot) | — |
| `AllergyNote` | C | order, text, **`deleteAfter` = pickup + 30 days** (07 O9, est. retention) | Never copied into email, SMS or AI prompts (07 O9) |
| `Payment` | C | `kind: 'full' \| 'deposit' \| 'balance' \| 'giftcard'`, provider, `providerId`, `amountCents`, tax split (§9), `status` | One order → n payments |
| `Refund` | C | payment, amount, reason, `by`, **`dueBy` = cancellation + 15 days** (07 A9) | Owner only |
| `CakeDesign` | C | `shortId`, `choices` (json), `priceRange`, `decision: 'instant' \| 'quote'`, `ogImage` | Shareable; no personal data |
| `CakeRequest` (quote) | C | design, date, portions, photos, `quoteCents`, `depositCents`, `expiresAt`, status | 16a P11 card |
| `TastingBooking` | C | date/time, type (box / in-store), status | **Feature flag off**: weddings not evidenced (01) |
| `CorporateAccount` / `Invoice` | C | company, billing contact, `terms` [[FACT NEEDED]], PO number | Page P14 is conditional (04) |
| `GiftCard` | C + T | `codeHash`, ledger (issue / redeem / adjust), `balanceCents`. **No expiry field, no fee field** (07 A8, C-11) | Phase 3 |
| `Customer` / `Consent` | C | email, phone E.164; consents (purpose, text version, time, source, order ID: 07 A4) | Account optional (magic link) |
| `NotificationLog` | C | channel, template, `kind: transactionnel \| commercial` (07 A5), to, status, provider id | CASL proof |

State machines (French labels are what staff see):

```
Order (catalogue / vitrine / season):
  en_attente_paiement ─(webhook paid)→ payée → en_préparation → prête ─(scan/code)→ ramassée
        │ (hold expired)                 │                        └─(closing time)→ non_ramassée
        └→ abandonnée                    ├─(bakery can't fulfil)→ nouveau_créneau_proposé ─(customer)→ payée | remboursée (≤ 15 d)
                                         └─(owner)→ annulée → remboursée (full | partial, ≤ 15 d)
Custom cake (CakeRequest):
  brouillon → soumise ─(owner prices, 24 h SLA)→ soumission_envoyée ─(deposit webhook)→ confirmée
     → en_production → décoration → prête → ramassée
  soumission_envoyée ─(expiresAt)→ expirée      soumise ─(owner)→ refusée | autre_date_proposée
  Builder "instant" path: brouillon ─(deposit paid at checkout)→ confirmée
Wedding (flag off): dégustation_réservée → rappel → dégustée → proposition → acompte_payé (date locked)
                    → rappel_nombre_final (J-[[FACT NEEDED]]) → confirmée → …as custom cake
Corporate:          demande → soumission → bon_de_commande_reçu → ramassée/livrée → facturée → payée
```

---

## 3. Capacity engine

### 3.1 Rules (all numbers are Studio settings; values are placeholders)

| Rule | Placeholder | Owner fact needed |
|---|---|---|
| Production categories | `gateaux`, `viennoiseries`, `boites-macarons`, `buches`, `traiteur` | [[FACT NEEDED: real categories; macarons and bûches are not evidenced (01)]] |
| Daily capacity per category | e.g. `gateaux`: 6 units/day | [[FACT NEEDED: chef]] |
| Lead time | `leadDays` per variant (vitrine 0, menu cake 1–2, custom per rules) | [[FACT NEEDED]] |
| Cut-off | « avant 14 h pour demain »: orders before 14:00 local count from today. Applies to `leadDays ≥ 1` only | [[FACT NEEDED: real hour]] (04 P13) |
| Production day | pickup day − `productionOffsetDays` | — |
| Pickup windows | 15 min, from opening to closing − 15 min | Hours [[FACT NEEDED]]. Most probable pattern: Thu–Fri 9:00–16:30, Sat 9:00–15:00 (01 §3, unverified) |
| Max per window | 4 | [[FACT NEEDED: counter staff at peak]] |
| Same-day buffer / hold | 30 min / 10 min | — |
| Timezone | `America/Toronto`. Store UTC instants + the local `YYYY-MM-DD` | — |

If the 3-day week is confirmed: 30 + 30 + 24 = **84 windows a week**; × 4 = up to 336 pickups (computed; est.). **Production, not the counter, is the bottleneck.**

### 3.2 Two modes, one engine (plan v0c §6)

| Mode | When | Flow | Engine call |
|---|---|---|---|
| **Product-first** | Everyday | Browse; each card shows « Prête dès jeudi »; at checkout the calendar offers only dates that work for the whole cart | `availableDates(cart)` |
| **Date-first** | `Season.mode = 'date-first'` (Noël, Pâques, Fête des mères, Saint-Valentin) | Pick the pickup day first, then see only what that day can still produce | For each season item, `poolsOk(date, [item])` |

| Key | FR | EN | ES |
|---|---|---|---|
| lead badge | « Prête dès jeudi » | "Ready Thursday" | « Lista el jueves » |
| cut-off | « Commandez avant 14 h pour demain » | "Order by 2 p.m. for tomorrow" | « Pida antes de las 14 h para mañana » |
| window full | « Ce créneau vient d'être pris. Les plus proches : 10 h 15 · 10 h 30 » | "That time was just taken. Closest: 10:15 · 10:30" | « Ese horario se acaba de ocupar. Los más cercanos: 10:15 · 10:30 » |
| date-first | « Choisissez d'abord votre journée de ramassage » | "First, pick your pickup day" | « Primero, elija su día de recogida » |
| day full | « Complet ce jour-là. Prochaine date : samedi 19 décembre » | "Full that day. Next date: Saturday, December 19" | « Completo ese día. Próxima fecha: sábado 19 de diciembre » |
| closed | « Fermé le 25 décembre » | "Closed December 25" | « Cerrado el 25 de diciembre » |

### 3.3 Sketch 1: slot-capacity check (JavaScript)

```js
// slots.mjs: which pickup dates and 15-minute windows can take this cart? (pure functions + one atomic SQL reserve)
// All business numbers come from Studio settings. Values used in tests are PLACEHOLDERS, not owner facts.
export const TZ = 'America/Toronto';

const pad = (n) => String(n).padStart(2, '0');
const addDays = (ymd, n) => { const d = new Date(`${ymd}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const weekday = (ymd) => new Date(`${ymd}T00:00:00Z`).getUTCDay(); // 0 = dimanche
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const toHhmm = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

// Local calendar date + minutes since midnight in Granby, whatever the server's own timezone is.
export function localNow(instant = new Date(), tz = TZ) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(instant).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

// Earliest pickup date for the whole cart: the slowest item wins; the cut-off adds a day.
// cart: [{ category, units, leadDays, productionOffsetDays }]
export function earliestDate(cart, settings, instant = new Date()) {
  const now = localNow(instant, settings.tz);
  const lead = Math.max(0, ...cart.map((l) => l.leadDays));
  const afterCutoff = lead > 0 && now.minutes >= toMin(settings.cutoff); // « avant 14 h pour demain » (placeholder)
  return addDays(now.date, lead + (afterCutoff ? 1 : 0));
}

const isOpen = (ymd, s) => Boolean(s.hours[weekday(ymd)]) && !s.blackouts.has(ymd);

// Capacity per production category per production day (pickup day minus productionOffsetDays).
function poolsOk(ymd, cart, usage) {
  const need = new Map();
  for (const l of cart) {
    const key = `${addDays(ymd, -(l.productionOffsetDays ?? 0))}|${l.category}`;
    need.set(key, (need.get(key) ?? 0) + l.units);
  }
  for (const [key, units] of need) {
    const pool = usage.pools.get(key); // { limit, used }; no pool = category not produced that day
    if (!pool || pool.used + units > pool.limit) return false;
  }
  return true;
}

export function windowsFor(ymd, settings, usage, instant = new Date()) {
  const h = settings.hours[weekday(ymd)];
  if (!h) return [];
  const now = localNow(instant, settings.tz);
  const out = [];
  for (let t = toMin(h.open); t + settings.windowMinutes <= toMin(h.close); t += settings.windowMinutes) {
    if (ymd === now.date && t < now.minutes + settings.sameDayBufferMin) continue;
    const booked = usage.windows.get(`${ymd}T${toHhmm(t)}`) ?? 0;
    if (booked < settings.maxPerWindow) out.push({ start: toHhmm(t), left: settings.maxPerWindow - booked });
  }
  return out;
}

// Product-first mode: the calendar shows only dates that work for everything in the box.
export function availableDates(cart, settings, usage, instant = new Date(), horizonDays = 60) {
  const first = earliestDate(cart, settings, instant);
  const dates = [];
  for (let i = 0; i < horizonDays; i++) {
    const d = addDays(first, i);
    if (!isOpen(d, settings) || !poolsOk(d, cart, usage)) continue;
    const w = windowsFor(d, settings, usage, instant);
    if (w.length) dates.push({ date: d, windows: w });
  }
  return dates;
}

// Atomic reserve at payment start (node-postgres). Every UPDATE must hit one row, or nothing is kept.
// The payment webhook turns the hold into a booking; a worker job releases expired holds.
export async function reserve(pg, { orderId, date, windowStart, lines, maxPerWindow }) {
  await pg.query('BEGIN');
  try {
    for (const l of lines) {
      const r = await pg.query(
        `UPDATE capacity_pool SET used = used + $1
          WHERE prod_date = $2 AND category = $3 AND used + $1 <= cap_limit RETURNING used`,
        [l.units, l.prodDate, l.category]);
      if (r.rowCount !== 1) throw new Error(`FULL:${l.category}:${l.prodDate}`);
    }
    const w = await pg.query(
      `INSERT INTO pickup_window (pickup_date, start_hhmm, booked) VALUES ($1, $2, 1)
       ON CONFLICT (pickup_date, start_hhmm) DO UPDATE SET booked = pickup_window.booked + 1
         WHERE pickup_window.booked < $3 RETURNING booked`,
      [date, windowStart, maxPerWindow]);
    if (w.rowCount !== 1) throw new Error('FULL:window');
    await pg.query(
      `INSERT INTO capacity_hold (order_id, lines, pickup_date, start_hhmm, expires_at)
       VALUES ($1, $2, $3, $4, now() + interval '10 minutes')`,
      [orderId, JSON.stringify(lines), date, windowStart]);
    await pg.query('COMMIT');
    return { ok: true };
  } catch (e) {
    await pg.query('ROLLBACK');
    return { ok: false, reason: e.message }; // UI: « Ce créneau vient d'être pris. Les plus proches : … »
  }
}
```

Test run with placeholders (Thu–Fri 9:00–16:30, Sat 9:00–15:00; `gateaux` full on Fri 30 Oct):
- A cart with a 2-day cake ordered **Tue 27 Oct at 15:30 local** gets earliest date 30 Oct (past the cut-off: +1 day).
- The first date offered is **Sat 31 Oct**, with 24 windows.
- `reserve` re-checks capacity on the server at payment start. The client calendar is only a hint.
- Phone orders entered in Studio use the same pools, so phone and web never double-book.

### 3.4 Blackout days: Québec statutory holidays (pre-loaded as « à confirmer »)

Under the Labour Standards Act there are **8 statutory holidays**.
- For Easter, the employer chooses Good Friday **or** Easter Monday.
- The National Day for Truth and Reconciliation is **not** a statutory holiday for provincially regulated employees.
- Sources: canada-holidays.ca, Indeed's employer guide; a CNT indemnity calculator exists. CNESST's own list page was not in the results.
- The public-service list is longer: 13 days, including Dec 24, 26 and 31 (Québec.ca).

| Holiday | 2026 | 2027 | Source / check |
|---|---|---|---|
| Jour de l'An | Thu 1 Jan (past) | **Fri 1 Jan** | CCQ 2027 |
| Vendredi saint *or* lundi de Pâques | Fri 3 Apr / Mon 6 Apr (past) | **Fri 26 Mar / Mon 29 Mar** | MRNF (2026), CCQ (2027); matches Easter 2027-03-28 (04 §7) |
| Journée nationale des patriotes | Mon 18 May (past) | **Mon 24 May** | MRNF, CCQ; rule = the Monday before 25 May (computed) |
| Fête nationale | Wed 24 Jun (past) | **Thu 24 Jun** | MRNF, CCQ |
| Fête du Canada | Wed 1 Jul (past) | **Thu 1 Jul** (CCQ shows **Fri 2 Jul** observed for construction, under its collective agreements) | CCQ; non-construction observance rule UNVERIFIED |
| Fête du Travail | Mon 7 Sep (past) | **Mon 6 Sep** | MRNF, CCQ |
| Action de grâce | Mon 12 Oct (past) | **Mon 11 Oct** | MRNF, CCQ |
| Noël | **Fri 25 Dec** | **Sat 25 Dec** | MRNF; computed |

Engine notes:
- These are **labour** rules (holiday pay). Whether the shop may or must close is a different law: the act on hours and days of admission to commercial establishments (UNVERIFIED; research/07 doesn't cover it). Studio pre-loads each date as **« à confirmer »** and the owner taps « Fermé » or « Ouvert ».
- High-demand days are **special days**, not blackouts: Dec 24, Dec 26–31, the Saturday before Easter and the Saturday before Fête des mères. Their capacity overrides come from `Season`.
- Saint-Valentin 2027 is **Sun 14 Feb**; Fête des mères 2027 is Sun 9 May (04). If Sunday is closed (01 §3, unverified), Valentine's pickups fall on Fri 12 / Sat 13, and the date-first menu opens those days.

---

## 4. Checkout rules

research/07 §4 (O1–O14) is the legal checklist and is not repeated here. This table is the build view.

| Rule | Implementation | Copy (fr-CA) |
|---|---|---|
| Guest by default | Email + phone only. Magic-link account offered after payment (v0c, Baymard via v0c) | « Pas besoin de compte » |
| Express wallets first | **Stripe Express Checkout Element** (or Square wallet buttons) above the card form. It shows only the wallets the device supports [UNVERIFIED]. Apple Pay needs the domain-association file on the **public** host [UNVERIFIED] | — |
| Card fallback | Payment Element (iframe), French locale [`fr-CA` vs `fr`: UNVERIFIED] | « Payer par carte » |
| Gift card, promo code | Both collapsed. The gift card applies before the card charge (phase 3) | « Carte-cadeau ? » · « Code promo » |
| Instagram / Facebook in-app browser | Detect server-side from the user agent [token list UNVERIFIED: commonly `Instagram`, `FBAN`, `FBAV`]. The cart lives **server-side** with a resume link `/commander/reprendre/<token>/`, so switching to Safari keeps it. Show a hint; the card form keeps working. "Apple Pay often doesn't appear there" is from v0c (UNVERIFIED) and goes in the test matrix | « Pour Apple Pay, ouvrez cette page dans Safari : votre panier vous suit. » [Copier le lien] |
| Review step (07 O1) | One screen: items, options, message, **pickup date + window**, address, subtotal, **TPS and TVQ lines** (shown even at 0,00 $), total, acompte/solde, cancellation summary, conditions link. Every line editable | — |
| Acceptance (07 O2, O3) | One **unticked** box + the amount on the button. `/en/` and `/es/`: French conditions first, then an explicit binding-language box (counsel) | « J'ai lu et j'accepte les Conditions de vente. » [Confirmer et payer 48,00 $] |
| No fee lines (07 O4, C-9, C-10) | No service, packaging or card fee lines. Same price for every payment method | — |
| Cake message | ≤ 30 characters (placeholder). Live preview on the SVG cake (§5). Stored as text and printed on the production sheet | « Message sur le gâteau (30 caractères max) » |
| Allergy note (07 O9) | Optional. Flags the order for a human in Studio; never answered by AI (v0c, 16b); deleted 30 days after pickup; not copied into email, SMS or AI prompts | « Utilisée seulement pour préparer votre commande; effacée 30 jours après le ramassage » + « Une question d'allergie ? Appelez-nous au 450-372-7177 avant de commander. » (07 §7) |
| Phone + consents (07 O10) | E.164 phone. Separate **unticked** boxes for seasonal emails, the birthday reminder and the review email | 07 O10 wording |
| Tip | **None** online (07 O5, 18 #7) | — |
| Paid = webhook | `payée` only on the processor's webhook (Stripe `payment_intent.succeeded`, or Square's payment update). Idempotency key = order number. A nightly reconciliation job checks the processor's payment list for missed webhooks | — |
| Confirmation = contract copy (07 O6) | Screen + email right away: order number, 4-digit pickup code, QR (opaque token, 16b), **.ics**, address + Maps link, parking/door [[FACT NEEDED]], tracker link, the full conditions as a link + PDF, French first | « Merci ! Commande 1042 · samedi 31 octobre, 10 h 15 à 10 h 30 · Ajouter à mon calendrier » |

**`.ics` fields:**
- `UID:1042@cocovanillegranby.com`
- `DTSTART` / `DTEND` in **UTC (`Z`)** for the 15-minute window (this avoids a VTIMEZONE block)
- `SUMMARY:Ramassage Coco Vanille – commande 1042`
- `LOCATION:3, rue Court, Granby QC J2G 4Y6`
- `URL:` the tracker link
- `DESCRIPTION:` the pickup code + parking
- `VALARM` 1 h before
- Served as `text/calendar` and attached to the email.

---

## 5. Cake builder

### 5.1 2D layered SVG vs 3D

| Criterion | **2D/2.5D layered SVG (recommended, as in v0c)** | 3D (WebGL, e.g. three.js / glTF) |
|---|---|---|
| Weight on a mid-range phone | Small; layers load per step (est.) | Heavy: engine, models, textures (est.) |
| Inside the Instagram webview | Plain SVG/DOM, low risk | WebGL in webviews untested (UNVERIFIED) |
| Effort for one person | Illustrated layers per shape, finish and decoration + compositing ≈ 2–3 weeks (est.) | Modelling, materials, lighting ≈ 6+ weeks (est.) |
| Accessibility | Choices are native radio groups; the SVG is `aria-hidden` and paired with a text summary | Same, plus canvas fallbacks |
| Share image | The server renders the same SVG → PNG with sharp (already in the stack, 17) | Needs headless GPU rendering |
| Honesty | Illustrative (« aperçu indicatif ») | Can over-promise finishes |

### 5.2 Mechanics

- **URLs.** The pillar `/gateaux-personnalises-granby/` is indexable. Builder steps under `/createur/…` send `X-Robots-Tag: noindex` and a robots meta tag. They are **not** blocked in robots.txt, so crawlers can see the noindex (16b §2.4 logic). They are kept out of the sitemap and out of hreflang maps (Sketch 4).
- **State.** It lives on the client and is saved, debounced, to `CakeDesign` (`shortId`). « Envoyer pour avis » shares `/createur/d/<shortId>/`: noindex, OG image from the server render, **no personal data**.
- **Server-side summary.** `POST /api/createur/resume` takes choices only. It returns the price range, surcharges, blocked combinations, lead time, earliest date (§3) and the decision. **The client never sends a price.**
- **Instant deposit vs quote** (placeholders for the owner):

| **Instant deposit** when ALL hold | **« Demande de soumission »** when ANY holds |
|---|---|
| Shape and size from the catalogue grid | Free-text design or an uploaded inspiration photo |
| Portions ≤ [[FACT NEEDED]] (e.g. 30) | Tiers ≥ [[FACT NEEDED]] (e.g. 3); sculpted or 3D cake |
| Decorations from catalogue options only | Date inside the custom lead time, or a full pool |
| No `forcesQuote` option; capacity free | Any allergy or dietary request (always human; no free-from promises, 07 S10) |

- **Quote handling.** Answered within 24 h (v0c), valid 72 h (placeholder). An open quote puts a **tentative hold** on its date's pool. The hold shows in Studio and is released on expiry.
- **Deposit.** `depositPercent` × quote, with the payment link by SMS/email (16a J4). On confirmation, a written recap with the sketch and photo goes to the customer. This answers the documented "cake made wrong" complaint (01 §6, 16a P11).

---

## 6. Notifications

| Trigger | Channel | Template (tone: 07 uses « vous »; [[FACT NEEDED: tu/vous]]) | CASL class (07 §1E) |
|---|---|---|---|
| Order paid | Email (+ .ics, + contract copy) | « Commande 1042 confirmée · ramassage samedi 31 octobre, 10 h 15 à 10 h 30 » | Transactional |
| Quote ready / acompte due | Email + SMS | Link to pay | Transactional (a quote the person asked for, E-1) |
| Day before pickup | SMS (email if no phone) | `Coco Vanille : rappel, ramassage demain (sam.) entre 10 h 15 et 10 h 30. Commande 1042. STOP pour ne plus recevoir de textos.` (GSM-7, 125 chars, 1 segment) | Transactional |
| « Prête » tapped in Studio | SMS | `Coco Vanille : votre commande 1042 vous attend au comptoir jusqu'à 16 h 30. 3, rue Court, Granby. STOP pour ne plus recevoir de textos.` (GSM-7, 135 chars, 1 segment) | Transactional |
| Not picked up at closing | SMS + Studio alert | — | Transactional |
| Bakery can't fulfil | Email + SMS | New-slot link **or** full refund ≤ 15 days (07 O7) | Transactional |
| Review request | **QR card in the box** (not an electronic message); email only if the box was ticked (07 E-4) | « Votre avis nous aide beaucoup : [QR] » (07 §7) | Commercial if electronic |
| Birthday reminder, seasonal alerts | Email/SMS | — | Commercial: **express consent** (E-3) |

- **Email.** SES ca-central-1 through the worker, from `commandes@` (research/17 §9).
- **SMS.** Twilio, with toll-free verification before sending. Canadian A2P traffic should use a short code or a verified toll-free number (via 16b). Price: **$0.0079 per segment** (via 16b; UNVERIFIED (FC)). Twilio is in the US → ÉFVP (07 §2). The text holds only the order number and the pickup time, never the order contents (07 §2).
- **CASL.** Transactional messages are exempt from consent but still carry sender ID + an unsubscribe (07 E-1, E-2, A5). Templates are tagged *transactionnel* or *commercial*. A commercial template can't go to anyone without a matching consent (07 A5).
- **French SMS cost trap.** Per the GSM 03.38 character set (standard, not re-sourced: UNVERIFIED):
  - é, è, à, ù and É are in GSM-7. **ê, â, î, ô, û, ç, ’ (curly apostrophe), « » and ° are not.**
  - One such character switches the whole SMS to UCS-2: 70 characters per segment, 67 per part when split.
  - The 07 §7 template « …votre commande n° 1042 est prête ! … » is **UCS-2, 109 characters = 2 segments** (measured with my encoder). It fails on « ° » and « ê ».
  - The GSM-7 versions above keep 07's required elements (ID, STOP) in one segment.
  - Rules: straight apostrophes in SMS; no « n° », « prête » or guillemets. A CI test counts encoding and segments for every SMS template in every locale.
- **Owner backstop alerts.** 16b §3 (SSE + web push + SMS); not repeated.

---

## 7. Kitchen production sheet and allergen labels

| Output | Content | Generated | Format |
|---|---|---|---|
| **Feuille de production** | For D+1 and D+2 (v0c), grouped **production date → category → variant → options**: quantities, order numbers, cake messages to pipe, ⚠ allergy flag (the text stays on the order card, 07 O9), earliest pickup window per item. Vitrine `planned` quantities are included | Worker job at **cut-off + 5 min** (14:05, placeholder) and on demand. Each print is a **versioned snapshot**; later changes show as « Modifié après impression » with a diff | A4 + 80 mm (CloudPRNT, 16b). In French (07 A1) |
| **Étiquette de boîte** | Order number, first name, pickup window, product + options, message, « Contient : … » from **human-verified** fields (07 A-3 list: eggs, milk, mustard, peanuts, crustaceans and molluscs, fish, sesame, soy, sulphites, tree nuts, wheat and triticale + gluten sources), a cross-contact line **only if real** (07 A-5), storage line. **No free-from claims** (07 A-6, S10) | From the order card (« Imprimer l'étiquette », 16a §3.6) or in a batch per production sheet | 62 mm (16a candidate printers) |

Which items need a label at all is open: the retail-packaged exemption is UNVERIFIED (07 A-4, 16a §3.6). So is whether the MAPAQ permit covers online pickup orders (07 A-2). Both are blocking for labels: [[FACT NEEDED]].

---

## 8. Merchant Center feed and Product/Offer JSON-LD with real availability

### 8.1 One availability state → page markup, feed, calendar

The mapping is **Confirmed in research/06 (k)** from Google Merchant Center Help (W57).

| Engine state (06 names) | When (computed by §3) | schema.org | Feed | Date |
|---|---|---|---|---|
| `disponible` | Orderable inside the normal lead time, capacity free | `InStock` | `in_stock` | — |
| `epuise_du_jour` | Today's vitrine sold out, or no date in the horizon | `SoldOut` | `out_of_stock` | — |
| `retour_saison` | **Returning** seasonal item (e.g. the bûche) with the season open and pickups later | `BackOrder` | `backorder` | **Required; shown on the page** |
| `nouveaute` | Never-sold product taking orders before its first pickup | `PreOrder` | `preorder` | **Required; shown on the page** |
| `retire` | Discontinued | `Discontinued` | `out_of_stock` | — |

- `Product.everSold` decides between `retour_saison` and `nouveaute`. A bûche sold last year is **BackOrder**, not PreOrder (06 corrects plan v0a).
- **Online feed v1** = menu cakes + season items. The worker generates it nightly and on every price or availability change, as a file URL on the public host.
- **Vitrine items are left out of the v1 online feed**: their stock changes hourly. Their pages carry `InStock`/`SoldOut` from `DailyStock`, regenerated on each « épuisé » tap through `/svc/revalidate` (17 §12.3).
- **Phase 2:** a local product feed. Canada is eligible for free local listings without online checkout. Daily items go out as **pickup today** and made-to-order cakes as **pickup later**, starting with 5 products (06 (q)).
- Not emitted until Google support is checked (§15): `MadeToOrder`, an on-site pickup `availableDeliveryMethod`, and return-policy markup (which also needs counsel: 07 C-14).

### 8.2 Sketch 3: Product + Offer JSON-LD with PreOrder / BackOrder (JavaScript)

```js
// product-jsonld.mjs: Product + Offer from the SAME state that drives the calendar and the feed.
// Availability values come from research/06 `availabilityFor` (Google Merchant Center mapping):
// PreOrder only for a never-sold product; a returning seasonal product taking orders is BackOrder; both carry a date.
import { availabilityFor } from './availability.mjs';            // research/06 §(k)
const HOST = () => `https://${process.env.PUBLIC_HOST ?? 'cocovanillegranby.com'}`; // runtime env (research/17 §2)

// engine: { state: 'disponible'|'epuise_du_jour'|'retour_saison'|'nouveaute'|'retire', firstPickupAt?, orderCloseAt?, lastPickupDate? }
export function productJsonLd({ product, variant, locale, engine }) {
  const base = HOST();
  const url = `${base}${product.paths[locale]}`;
  const a = availabilityFor(engine.state, engine.firstPickupAt);  // throws if a dated state has no date
  const offer = {
    '@type': 'Offer',
    url,
    sku: variant.sku,
    price: (variant.priceCents / 100).toFixed(2),                  // all-in price before taxes (research/07 C-9)
    priceCurrency: 'CAD',
    availability: a.schema,
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': `${base}/#bakery` },                          // the one Bakery entity (plan v0b)
  };
  if (a.availabilityDate) {                                        // the same date is printed on the page (06)
    offer.availabilityStarts = a.availabilityDate;                 // first pickup, ISO with offset
    if (engine.orderCloseAt) offer.availabilityEnds = engine.orderCloseAt;
    if (engine.lastPickupDate) offer.priceValidUntil = engine.lastPickupDate;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name[locale],                                    // same text as the visible H1
    description: product.description[locale],
    image: product.images.map((i) => `${base}${i.src}`),           // hero + cross-section + scale shot (v0a §4.4)
    sku: variant.sku,
    brand: { '@type': 'Brand', name: 'Coco Vanille' },             // [[FACT NEEDED: final brand spelling]]
    category: product.category[locale],
    additionalProperty: [
      { '@type': 'PropertyValue', name: locale === 'fr' ? 'Portions' : 'Servings', value: variant.portions },
      { '@type': 'PropertyValue', name: locale === 'fr' ? 'Délai' : 'Lead time', value: variant.leadLabel[locale] },
    ],
    offers: offer,
  };
}
// Feed row uses a.feed ('in_stock' | 'out_of_stock' | 'backorder' | 'preorder') + availability_date = a.availabilityDate.
// Render: <script type="application/ld+json">{JSON.stringify(productJsonLd(…)).replace(/</g, '\\u003c')}</script>
```

Test, run with 06's `availabilityFor`. The fixture is v0a §4.4's example "Bûche praliné 8 po, 75.00 CAD", **not a real price**:
- `retour_saison` → `BackOrder`, starts 2026-12-19T09:00:00-05:00
- `nouveaute` → `PreOrder`, same date
- `epuise_du_jour` → `SoldOut`, no date
- `nouveaute` without a date throws

---

## 9. Tax line

The rule now exists in **research/07 §6**, with a 13-row decision table and an effective-dated `computeTaxes` sketch. The accountant signs every row. Key points from 07:
- **QST** is zero-rated since **2026-07-15** on single-serving sweet goods (< 230 g, or packs of fewer than six).
- **GST** still applies to them under 6 units.
- Bread is zero-rated.
- Whole cakes are zero-rated as "not a single serving", but that is **ASK**.
- Macarons, café drinks, heated food, deposits and gift-card QST are **ASK**.
- The GST 5 % and QST 9.975 % rates themselves are still partly unverified (07 T-7).

This file doesn't redecide anything. Sketch 2 is the **tax line**: it wraps 07's rule. It enforces the approval gate (07 A7), splits tax across acompte and solde, and always prints both lines (07 O1). Open item for the accountant: whether the supply date is the order date or the pickup date [[FACT NEEDED]].

```js
// tax-line.mjs: turns the approved tax rule into the lines shown at review, on the receipt and in the contract email.
// The RULE is research/07 §6 `computeTaxes` (the accountant signs every row). Nothing here decides a tax class.
export const money = (c) => new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(c / 100);

// payments: [{ kind: 'full' }] or [{ kind: 'deposit', cents: 4000 }, { kind: 'balance' }] (balance = the rest)
export function taxLine({ lines, supplyDateISO, rule, approvedAt, payments = [{ kind: 'full' }] }) {
  if (!approvedAt) throw new Error('TAX_RULE_NOT_APPROVED');       // Studio « Approuvé par le comptable le … » (07 A7)
  const subtotal = lines.reduce((s, l) => s + l.cents * l.qty, 0);
  const { gst, qst } = rule(lines, supplyDateISO);                  // throws on an unapproved class (07 §6)
  const total = subtotal + gst + qst;

  // Deposit/balance: tax allocated pro rata to each payment (PLACEHOLDER: 07 §6 row 13 is ASK accountant)
  let rest = { total, gst, qst };
  const split = payments.map((p, i) => {
    const last = i === payments.length - 1;
    const amount = last ? rest.total : p.cents;
    const row = {
      kind: p.kind, totalCents: amount,
      gstCents: last ? rest.gst : Math.round((gst * amount) / total),
      qstCents: last ? rest.qst : Math.round((qst * amount) / total),
    };
    rest = { total: rest.total - row.totalCents, gst: rest.gst - row.gstCents, qst: rest.qst - row.qstCents };
    return row;
  });
  if (rest.total !== 0 || split.some((r) => r.totalCents < 0)) throw new Error('SPLIT_INVALID');

  // Both tax lines are always shown, even at 0,00 $ (07 O1: GST and QST lines on the review step)
  const display = [['Sous-total', subtotal], ['TPS', gst], ['TVQ', qst], ['Total', total]]
    .map(([label, c]) => ({ label, text: money(c) }));
  return { subtotalCents: subtotal, gstCents: gst, qstCents: qst, totalCents: total, split, display };
}
```

Test, run with 07's `computeTaxes` copied into a scratch module; rates are 07's placeholders:
- **Cart, pickup 2026-11-07:** 4 unpackaged single-serving pastries at C$4.50 (120 g) + a whole 1.4 kg cake at C$60.
  - Result: TPS 0,90 $ (4 singles < 6) · TVQ 0,00 $ (QST zero-rated since 2026-07-15; the whole cake is zero-rated under row 6, ASK) · total 78,90 $.
  - Split: a C$20 acompte carries TPS 0,23 $; the solde carries 0,67 $.
- **Same 4 pastries dated 2026-07-01:** TVQ 1,80 $ (effective dating works).
- **No approval date:** throws `TAX_RULE_NOT_APPROVED`.

Gift cards: no GST at sale; tax applies at redemption (07 T-4, secondary). QST at sale is ASK.

---

## 10. Server-side GA4 purchase with Consent Mode default denied

| Step | Where | Rule |
|---|---|---|
| 1 | Every page | **Consent Mode basic** (07 S7): the Google tag is **not loaded** until analytics consent. Everything stays denied by default (Loi 25 s. 8.1, 07 §0 #4). Advanced mode only after counsel (07 lawyer Q1) |
| 2 | Banner | « Tout refuser » and « Tout accepter » are equal (07 S6). The choice is stored with its text version and timestamp (07 A4) |
| 3 | Checkout, before payment | If consented, read the GA `client_id` and session id. Store them on the `Order` with the consent snapshot and click IDs (v0a §4.3). Otherwise store nothing |
| 4 | Payment page | **No tags** (PCI §1.4) |
| 5 | Worker, on the paid webhook | GA4 **Measurement Protocol** `purchase`: `transaction_id` = order number, `value`, `currency: 'CAD'`, `items`, the stored `client_id`. Sent **only if** the snapshot says granted. Ad platforms follow v0a §4.3 under the same check (none at launch, 07 §2). MP consent fields: UNVERIFIED (§15) |
| 6 | Confirmation page | **No browser `purchase`** (v0a §4.3: one source only) |

Result: no double counting, no tags on the payment page, and refunds go out the same way.
- GA4 is a US flow → ÉFVP (07 §2).
- Baseline counts without consent come from nginx logs (07 S8, 17).

---

## 11. Sketch 4: hreflang map builder from a translation group (JavaScript)

This refines the v0b A3 TypeScript sketch:
- plain JavaScript;
- the host read at runtime (17);
- draft and noindex members excluded;
- a duplicate-locale guard;
- a CI reciprocity check.

It implements 07 S3 (`x-default` → FR).

```js
// hreflang-map.mjs: alternates for one page from its translation group (FR at root, /en/, /es/; plan v0b A3).
const HOST = () => `https://${process.env.PUBLIC_HOST ?? 'cocovanillegranby.com'}`;
const LOCALES = ['fr', 'en', 'es'];                        // language-only codes (plan v0b)

const eligible = (d) => d && d.status === 'published' && !d.noindex && LOCALES.includes(d.locale);
const abs = (path) => `${HOST()}${path.endsWith('/') ? path : `${path}/`}`;

// group: [{ locale, path: '/gateaux-personnalises-granby/', status, noindex }]
export function hreflangMap(group) {
  const members = group.filter(eligible);
  const seen = new Set();
  for (const m of members) {
    if (seen.has(m.locale)) throw new Error(`HREFLANG_DUPLICATE_LOCALE:${m.locale}`);
    seen.add(m.locale);
  }
  if (members.length < 2) return {};                       // a lone page carries no alternates
  const languages = Object.fromEntries(members.map((m) => [m.locale, abs(m.path)]));
  const fr = members.find((m) => m.locale === 'fr');
  if (fr) languages['x-default'] = abs(fr.path);
  return languages;
}

// Next.js metadata for one member: canonical = itself (never another language), alternates = the group map.
export function alternatesFor(doc, group) {
  if (!eligible(doc)) return { canonical: null, languages: {} }; // builder steps, cart, drafts: neither
  return { canonical: abs(doc.path), languages: hreflangMap(group) };
}

// CI gate: every member outputs the same map, and the map contains the member itself.
export function checkReciprocity(groups) {
  const errors = [];
  for (const [id, group] of Object.entries(groups)) {
    const map = JSON.stringify(hreflangMap(group));
    for (const doc of group.filter(eligible)) {
      const own = alternatesFor(doc, group);
      if (JSON.stringify(own.languages) !== map) errors.push(`${id}:${doc.locale}:map-differs`);
      if (Object.keys(own.languages).length && own.languages[doc.locale] !== own.canonical) errors.push(`${id}:${doc.locale}:self-missing`);
    }
  }
  return errors;
}
```

Test, with the pillar group: FR published, EN published without a trailing slash, ES as a draft.
- Map: `{ fr, en, x-default → fr }`.
- The EN canonical is the EN URL.
- Reciprocity: 0 errors.

The 07 S2 parity gate (EN/ES not published unless FR is at least as complete) runs before this, in the publish guard.

---

## 12. Monthly cost (est.)

Volumes are **assumptions**: the shop's order count is unknown ([[FACT NEEDED: weekly phone/cake orders today]]).
- **S** = 100 online orders/month at C$45
- **M** = 250 orders at C$45
- **Peak** (a December-like month) = 600 orders at C$55

Each order = 2 SMS + 4 emails.

| Item | Basis | S | M | Peak |
|---|---|---|---|---|
| Card fees, **Stripe** | 2.9 % + C$0.30 (Seen) | C$160.50 | C$401.25 | C$1,137.00 |
| Card fees, **Square** (alt.) | 2.8 % + 30¢ (Seen; 2.9 % conflict) | C$156.00 | C$390.00 | C$1,104.00 |
| SMS (Twilio), 1 segment each (GSM-7 templates, §6) | $0.0079/segment (via 16b, UNVERIFIED (FC)) | $1.58 | $3.95 | $9.48 |
| SMS if templates fall into UCS-2 (2 segments) | same | $3.16 | $7.90 | $18.96 |
| Twilio number rental, toll-free verification | — | [[UNVERIFIED]] | [[UNVERIFIED]] | [[UNVERIFIED]] |
| Email (SES à la carte ≈ $0.10/1,000; Essentials $0.16/1,000) | via 17 (3rd-party) | < $0.10 | $0.10–0.16 | $0.24–0.38 |
| Hosting + mailbox + backups + domains | research/17 §11 | C$35–55 | C$35–55 | C$35–55 |
| **Fixed subtotal** (hosting + SMS + email) | — | **≈ C$37–57** | **≈ C$39–59** | **≈ C$45–75** |
| **Card fees as % of online sales** | computed | 3.57 % | 3.57 % | 3.45 % |

For scale only, buy option C: Shopify Basic C$37–69/month + ≈ 2.9 % + C$0.30 + a pickup-date app [[UNVERIFIED price]] (3rd-party, §1.1).
- Fixed costs stay under ~C$75/month in every scenario. Fees scale with sales.
- Online card fees replace part of today's counter payment fees (counter payment mix unknown), so the incremental cost is lower than shown (est.).

---

## 13. Build vs buy (one-person operator)

| Option | What it is | SEO/AEO/GEO control | Needed features (capacity per category, date-first, builder, quotes, vitrine) | FR first, EN/ES | Loi 25 | Run cost | Build effort (est.) | Weekly upkeep (est.) | Lock-in |
|---|---|---|---|---|---|---|---|---|---|
| **A. Engine on Payload + bought payments/SMS/email** (recommended) | §§2–11 | Full: own URLs, JSON-LD, hreflang | All, by design | Yes, with the parity gate (07 S2) | Orders on the VPS. Processor, Twilio and GA4 each need an ÉFVP (07 §2) | §12 | Ordering v1 ≈ 3–4 weeks (fits plan weeks 7–10). Builder ≈ 2–3 weeks + illustration assets | ≈ 30 min: webhook and reconciliation alerts, capacity settings | Low: the processor sits behind one module |
| B. Square Online (only if POS = Square) | Hosted store | Limited (v0c §8 path B) | No evidence of capacity, date-first or builder features (UNVERIFIED). One default language per site (via 16a, community) | Weak | Square's servers [location UNVERIFIED] → ÉFVP | Plan [UNVERIFIED] + 2.8 % + 30¢ | Days | Low | High |
| C. Shopify + pickup-date app | Hosted store | Rigid URLs, limited schema (v0c §8) | Through apps; no native bulk « prête » (via 16a) | Through apps | Shopify [UNVERIFIED] → ÉFVP | C$37–69 + fees + apps | 1–2 weeks | Low–medium | High |
| D. Bridge (now → plan weeks 11–12) | The plan-v1 request form + **Stripe or Square payment links** | Form page indexable, content-led | Manual (the owner decides capacity) | Form ×3 | Form data on the VPS | Fees only | 2–3 days | Manual | None |

**Recommendation: A, with D as the bridge.**
1. **Build only what no vendor does for this shop:** the capacity engine, date-first seasons, the cake builder + quote flow, and the vitrine → site → feed loop. These are small and testable, and they sit on the Payload schema that 16b builds anyway.
2. **Buy everything regulated or reputation-heavy:** card processing and PCI (processor iframes), SMS delivery and carrier registration (Twilio), email deliverability (SES).
3. **Integrate a POS only if it's Square.** It's the only POS found this session with self-serve Orders (PICKUP), Catalog and Inventory APIs. Lightspeed K is partner-gated (3rd-party); Clover needs an app (16b). Otherwise, Studio « Aujourd'hui » + a CloudPRNT printer meets rule #1 in practice. Re-test that with staff in week 1.
4. **Timeline.** The engine goes live in plan weeks 11–12 (v1 §3), so **Noël 2026 pre-orders (opening 1 Nov 2026, 04 calendar) run on option D**. The first season on the engine is Saint-Valentin 2027 (Sun 14 Feb), then Pâques (Sun 28 Mar 2027) in date-first mode.
5. **Later phases:**
   - gift cards: own ledger with no expiry and no fees (07 C-11), or Square gift cards if on Square [UNVERIFIED];
   - corporate invoices: Stripe or Square invoicing, or the accountant's tool [[FACT NEEDED]];
   - wedding tastings: flag off until the offer exists.
6. **Safety valves for one person:**
   - « Pause des commandes en ligne » in one tap (16a pause pattern)
   - nightly payment reconciliation
   - a capacity load test before each season
   - Studio phone-order entry on the same pools
   - 15-day refund timers (07 A9)

---

## 14. Open items: [[FACT NEEDED]] (blocking first)

1. **POS** brand and plan, terminal, receipt/kitchen printer, label printer. This decides Square vs Stripe.
2. Any existing Stripe or Square account, and who owns it (it should be the bakery, not the agency).
3. Hours and open days; a decision on each date in the §3.4 holiday list; Sunday closure.
4. Production categories, daily capacity per category, lead times, the cut-off hour, max pickups per 15-minute window.
5. Price list (sizes, portions, unit weight in grams for the 230 g test); which items are custom, seasonal or vitrine; whether macarons and bûches are offered; `everSold` per seasonal product.
6. Deposit %, refundability, cancellation deadline, quote validity, no-show rule (counsel: 07 lawyer Q6–Q8).
7. Accountant: tax class per product (07 §6), supply date (order or pickup), tax on deposits, GST/QST registration numbers.
8. Allergen data per product (human-verified) and the cross-contact practice; MAPAQ permit coverage for online pickup orders (07 A-2).
9. Tone: tu or vous; dépôt or acompte.
10. Current order volume (to replace §12's scenarios); accounting software (for invoices).

## 15. Search queue (not searched: the 10-query cap was reached)

| # | Query | Resolves |
|---|---|---|
| 1 | Twilio Canada SMS price per segment, currency, number rental, toll-free verification time | §12 SMS rows (16b value is UNVERIFIED (FC)) |
| 2 | Stripe Canada: processing fees on refunds; dispute fee; what "Interac Debit online" covers | §1.1, §1.2 |
| 3 | Moneris online pricing; Moneris Go / POS API | §1.1, §1.3 |
| 4 | Clover Canada REST API: orders, inventory, online orders | §1.3 |
| 5 | Shopify's official Canadian pricing page; Shopify POS Admin API | §1.1, §13 |
| 6 | Square Canada: does the 1 % non-Square-processor Orders API fee apply; Square gift cards in Canada; Square Online multilingual in 2026 | §1.3, §13 |
| 7 | Merchant API vs Content API status; update limits for local product inventory feeds | §8 |
| 8 | Google Product structured data: `MadeToOrder`; on-site pickup delivery method; return-policy requirements for pickup-only perishables | §8 |
| 9 | GA4 Measurement Protocol consent fields | §10 |
| 10 | Apple Pay / Google Pay inside the Instagram and Facebook in-app browsers (iOS 26); Stripe Express Checkout Element in WKWebView; the Elements French locale code | §4 |
| 11 | PCI SSC primary documents: SAQ A v4.0.1 (Jan 2025) eligibility text; FAQ 1588 | §1.4 |
| 12 | The Québec act on hours and days of admission to commercial establishments (bakery rules on holidays); CNESST's primary holiday page; observance when 1 Jul or 24 Jun falls on a Sunday | §3.4 |
| 13 | GSM 03.38 character table (to confirm which French accents are GSM-7) | §6 |

---

## Sources

This session (WebSearch summaries, seen 2026-10-25; pages not opened):

- Stripe: Pricing (Canada) — https://www.stripe.com/en-ca/pricing
- Stripe: Required Regulatory Disclosures, Canada (seen in the /ae/ locale) — https://stripe.com/ae/legal/ca-required-regulatory-disclosures
- Stripe Docs: Place a hold on a payment method — https://docs.stripe.com/payments/place-a-hold-on-a-payment-method.md
- Stripe Docs: Capture later — https://docs.stripe.com/payments/capture-later
- Stripe Support: Holding an authorization for more than 7 days — https://support.stripe.com/questions/does-stripe-support-holding-an-authorization-for-more-than-7-days-before-capture
- Xero Canada: Pricing and fees for Stripe (3rd-party) — https://www.xero.com/ca/pricing-plans/pricing-and-fees-for-stripe/
- OLIVER POS: Payment rates, Canada (reseller, 3rd-party) — https://oliverpos.com/payments/canada/
- dev.to: Stop refunding payments you should never have charged (3rd-party) — https://dev.to/jguillaumesio/stop-refunding-payments-you-should-never-have-charged-4d7m
- Hostaway: Damage-deposit pre-authorizations (3rd-party) — https://support.hostaway.com/hc/en-us/articles/40916112725147-Creating-Managing-Damage-Deposit-Pre-Authorizations-Automated-Manual
- Square Canada: Our fees — https://squareup.com/ca/en/payments/our-fees
- Square Canada: Our fees (conflicting copy) — https://www.square.com/ca/en/payments/our-fees
- Square Canada: Payment terms — https://squareup.com/ca/en/legal/general/payment
- Square Canada: Lower processing fees (press, FR) — https://squareup.com/ca/fr/press/lower-processing-fees-canada
- Wise: Square Payments Canada guide (3rd-party) — https://wise.com/ca/blog/square-payment-canada
- Square Developer: Orders API, what it does — https://developer.squareup.com/docs/orders-api/what-it-does
- Square Developer: Orders API, how it works — https://developer.squareup.com/docs/orders-api/how-it-works
- Square Developer: Inventory API webhooks — https://developer.squareup.com/reference/square/inventory-api/webhooks
- Square Developer: Payments pricing — https://developer.squareup.com/docs/payments-pricing
- Moneris: Checkout — https://go.moneris.com/getcheckout
- Moneris: Online payments — https://go.moneris.com/onlinepayments
- Moneris blog: More ways to pay with Moneris Online (2021) — https://www.moneris.com/blog/posts/product-education/there-are-even-more-ways-to-pay-with-moneris-online
- Moneris news: Moneris Checkout launch (2020) — https://www.moneris.com/about-moneris/news/moneris-checkout-delivers-greater-payment-security
- Wikipedia: Interac (Interac Online discontinued 2024-10-31) — https://en.wikipedia.org/wiki/Interac
- Kindred Credit Union: Interac Online discontinued — https://www.kindredcu.com/whats-new/announcements/interac-online-discontinued
- Mainstreet Credit Union: Interac Online discontinued — https://www.mainstreetcu.ca/bank/ways-to-bank/online-banking/interac-online
- Shopify Help: Shopify Payments in Canada — https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/canada/accepting-payments
- Shopify Community: Canadian online card rates — https://community.shopify.com/t/does-credit-fee-2-4-of-online-canadian-credit-card-rates-0-30-cad-include-taxes/74326
- SAL Accounting: Shopify pricing in Canada (3rd-party) — https://salaccounting.ca/blog/shopify-pricing-canada/
- EcomCalcTools: Shopify Canada fees (3rd-party) — https://ecomcalctools.com/blog/fees-shopify/shopify-canada/
- Arslan Emre: Shopify Canada pricing plans 2026 (3rd-party) — https://arslanemre.com/blog/shopify-canada-pricing-plans-2026
- eSEOspace: Shopify POS in 2026 (3rd-party) — https://eseospace.com/blog/shopify-pos/
- Qualimero: Shopify POS pricing 2026 (3rd-party) — https://qualimero.com/en/blog/shopify-pos-pricing
- Supergood: Lightspeed Restaurant API report card (3rd-party) — https://supergood.ai/api-report-card/lightspeed-restaurant
- Jentic: Lightspeed API (3rd-party) — https://jentic.com/apis/lightspeed
- Codat: Lightspeed K setup (3rd-party) — https://docs-integration.codat.io/integrations/commerce/lightspeed-k/commerce-lightspeed-k-setup
- SecurityMetrics: Further clarification on SAQ A updates (3rd-party) — https://chat.securitymetrics.com/blog/guidance-on-saq-a-updates
- SecurityMetrics: Big changes for SAQ A (3rd-party) — https://marketing-webflow.securitymetrics.com/blog/big-changes-for-saq-a
- Report URI: PCI DSS 4.0.1 SAQ A FAQ (3rd-party) — https://blog.report-uri.com/pci-dss-4-0-1-saq-a-and-client-side-security-a-plain-english-faq/
- Jscrambler: PCI DSS 4.0.1 changes to 6.4.3 and 11.6.1 (3rd-party) — https://jscrambler.com/blog/pci-dss-4-0-1/
- PCI SSC: Community session on 6.4.3 and 11.6.1 — https://www.pcisecuritystandards.org/nacm_wednesday_track-2_12_6-4-3-and-11-6-1_now-what_jeff-zitomer_-jeff-man_final_approved_9-9/
- canada-holidays.ca: Québec statutory holidays (3rd-party) — https://canada-holidays.ca/province/QC
- Indeed: Guide des jours fériés au Québec pour les employeurs (3rd-party) — https://emplois.ca.indeed.com/recrutement/c/info/guide-jours-feries-quebec-employeurs
- CNT (CNESST): Statutory holiday indemnity calculator — https://www.services.cnt.gouv.qc.ca/outilscalcul/jourferie?lang=en_CA
- Québec.ca: Jours fériés (public service) — https://www.quebec.ca/gouvernement/travailler-gouvernement/remuneration-avantages-sociaux/conditions-travail/jours-feries
- MRNF: Jours fériés (PDF) — https://portail-info.foncier.gouv.qc.ca/media/f0fa5uxk/jours_feries.pdf
- CCQ: Dates des congés et vacances — https://www.ccq.org/fr-CA/avantages-sociaux/dates-conges-vacances

Via sibling files (their labels apply):
- research/06 (k), (q): Google Merchant Center Help "Availability" (W57) — https://support.google.com/merchants/answer/6324448?hl=en ; free local listings (W73) — https://support.google.com/merchants/answer/7457386 ; pickup today / later (W75, W76).
- research/07 §0–§7: LPC, CASL, CFIA allergens, GST/QST decision table and `computeTaxes`, checkout requirements O1–O14, Studio requirements A1–A12.
- research/01, 02, 03, 04, 16a, 16b, 17, 18; plan-v0a, plan-v0b, plan-v0c, plan-v1; requirements-2026-10-25.md (read, not re-searched).
