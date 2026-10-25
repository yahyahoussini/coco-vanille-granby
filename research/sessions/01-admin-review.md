# Session 1 · Coco Studio review + build decisions (2026-10-25)

> Yahya's instruction (2026-10-25): "answer all 1–10 from the research, build it first, owner questions after the build; VPS access later."
> Consequence: every owner fact stays a visible `[[FACT NEEDED: …]]` marker in the build (zero-invention rule). The publish guard keeps markers off the live site until the owner answers (`research/14-owner-questions.md`).

## Session 1 answers (all ★ recommendations)

| # | Decision | Answer |
|---|---|---|
| 1 | Screens | **A** · 6 daily screens (Aujourd'hui · Commandes · Vitrine · Demandes · Avis · Boutique & heures) + « Cette semaine » + Agence (desktop) + « Avancé » (Payload admin at `/admin`) |
| 2 | Build capacity | **A**, superseded by the build-now instruction: Claude builds all 6 screens now, so the weeks 7–10 squeeze no longer applies. Order of build stays: Aujourd'hui → Commandes → Demandes → Boutique & heures → Vitrine → Avis → Cette semaine → Agence |
| 3 | Technical approach | **A** · custom phone-first Studio at the root of `admin.cocovanillegranby.com`; Payload admin at `/admin` |
| 4 | Login | **A** · owner passkey (+ backup code), staff 4-digit PIN on a shared device, 12 h sessions, step-up for refunds, prices, allergens, taxes |
| 5 | Interaction rule | **A** · instant apply + « Annuler » ≥ 5 s; effects preview only for closure, refund, price change; side effects leave after the undo window |
| 6 | Alerts | **A** · 4 urgent push types (new order for today, new cake request, review 1–3 ★, failed payment/deposit) |
| 7 | Offline | **A** · queue: Épuisé, Prête, Remettre, photo, phone-order draft; block: quotes, refunds, closure, hours |
| 8 | AI review drafts | **A** · templates at launch; Claude API drafts in v1.1 after the Loi 25 privacy assessment |
| 9 | Presence Health Score | **A** · v1.1, after 4 weekly baselines |
| 10 | Printing | **A** · PDF at launch; printer after the POS is known |
| — | Mockup design system | Not used: the build itself is the mockup; Coco Vanille gets its own tokens (below) |

## Build defaults taken from the research (owner can change later)

| Topic | Default | Source |
|---|---|---|
| Category sentence | **B** « Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. » | 00 §3.1 (M15) |
| Name on the site | « Pâtisserie Coco Vanille » with `alternateName` « Pâtisserie Cocovanille » — sign photo decides | 00 §2 #2; 01 §2 |
| Slugs | 00 §5.1–5.2 (FR at `/`, EN `/en/`, ES `/es/` behind a flag until someone serves in Spanish, M10) | 00 §5 |
| Conditional pages | Built, flagged `conditional`; published only when the facts exist | 00 §5.2 |
| Design | **A « Atelier Vanille »** base · **B « Coco Joyeux »** in cake/birthday flows and microcopy · **C** Granby storytelling as a content layer | v0c §7; 08 §6 |
| Palette | Crème vanille #F7F0E3 · Coco #FFFCF6 · Gousse #2E211A (text) · Caramel #C8915A · Framboise #B8435A (CTA) · Pistache #B9C99A; contrast checked by tooling | v0c §7 |
| Type | Fraunces (display) + Inter (UI), variable, self-hosted, `font-display: swap` | v0c §7; v1 L3 |
| Payments | Stripe adapter first (Square adapter slot kept: POS unknown) | 00 §2 #6 default |
| Fulfilment | Pickup only at 3 rue Court; no delivery | 00 §7 |
| Words | « cueillette », « acompte », « vous » with customers | 16 §0; 14 §14 |
| Availability states | `BackOrder` + date for returning seasonal items, `PreOrder` only for never-sold items, `SoldOut` for « Épuisé » | 06 (k) |
| Stack | Next.js 16.4.3 + Payload 3.92.0, JavaScript only, Postgres 16 | 16b §0; npm registry 2026-10-25 |
