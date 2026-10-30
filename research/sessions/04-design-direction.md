# Session 4 · Design direction « Vanille & Cacao » + direct chat (2026-10-27)

> Yahya's instruction (2026-10-27): "much more pretty UI and much clearer UX", inspired by (not copying) his reference
> boards: the round logo, café-app mockups (chunky serif headlines, blobs, chips with icons, round « + » buttons, a
> bottom tab bar with a raised centre action) and pâtisserie site concepts (« Vanilla Chocolate / Classic Vanilla »,
> « Berry Vanilla »). Good scroll animation and mouse effects. Any UX addition that helps, e.g. a direct chat.
> The new logo arrived the same day: a round cream badge, « COCO » chocolate serif, « Vanille » dusty-rose script,
> PÂTISSERIE · ♥ · GRANBY, coconut and palm leaf, vanilla flower and pods, double caramel ring.

## Decisions

| # | Topic | Decision | Why / source |
|---|---|---|---|
| 1 | Direction | **« Vanille & Cacao »**: the logo's palette (chocolat profond, vanille crème, caramel ring, palm sage, rose poudré) on the « Atelier Vanille » base; Coco Joyeux's rose moves into the brand | Yahya's references 8–9 (« Classic Vanilla », « Berry Vanilla ») match the logo; supersedes session 1's A/B mix |
| 2 | Tokens | Light papers vanille `#faf4e8`, coco `#fffcf7`, sunk, sauge pâle, rose pâle, caramel pâle; inks chocolat `#3b241c`, caramel `#85552a`, rose profond `#983a52`/`#9e4058`, sauge `#4d5a3c`; dark papers chocolat and bordeaux doux `#5a2e3a`; primary button chocolate that fills with rose on hover | Every pair ≥ 4.5:1, tested (`test/unit/contrast.test.js`); the logo's own rose `#d88088` is 2.6:1 on cream, so it stays decorative |
| 3 | Type | Fraunces (display, SOFT axis) + Inter (UI) only; the script feel comes from the logo artwork, never from a third font file | Two-file font rule (plan-v1 §4 L3, v0c §7) kept |
| 4 | Logo | Cut into a transparent round badge (`public/brand/logo-badge-*`, AVIF/WebP/PNG, favicon, Apple icon) for the header, hero stage, footer and chat | Real brand asset; alt="" where the name is already text |
| 5 | Hero | Real-text h1 (place phrase in rose) beside a « stage »: arch photo window, the badge as its seal, a ring of real services, line-art palm and vanilla flower drawn from the logo; floating chips « Gâteaux sur commande », « Café » | The photo is a labelled ambiance photo until the owner's own (#12) |
| 6 | Product imagery | Product cards and product pages: the owner's real photos only; until then pastel surfaces per family + line icons (Lucide, ISC) in a double-ring badge — never a stand-in product image | Media rule; Competition Act (no misleading images) |
| 7 | Motion | One small client layer (`Motion.js`): reveal on scroll (hidden only after the script runs, below the fold), stagger, scroll-linked parallax, ring rotation and ribbon, header condensing; pointer effects (magnetic buttons, spotlight, tilt, stage depth) only with a fine pointer; nothing moves on its own for more than a moment; prefers-reduced-motion stops everything | 08 §2.3 and §4 (never gate content on JS or animation), WCAG 2.2.2 / 2.3.3, CWV (transform/opacity only, LCP painted at once) |
| 8 | Phone navigation | Floating tab bar: Appeler · Itinéraire · **Commander** (raised rose button) · Carte · Écrire; class `.sticky-bar` kept; hidden ≥ 60rem | v0c §7 thumb-zone bar extended; focus-not-obscured padding kept (2.4.11) |
| 9 | Header | Info bar (live « Ouvert », address, phone, language), brand badge + wordmark, literal nav (Carte · Gâteaux sur commande · Nous trouver · À propos) + « Commander » button; sticky and condensed on desktop | One primary action; literal labels (plan-v1 §4 row 10) |
| 10 | Direct chat | **« Écrivez-nous »**, first-party: messages in the shop's own database, answered from Coco Studio during opening hours; instant answers to common questions built from published facts; optional first name and phone/email only to receive the answer; deleted 90 days after the last message; never on payment pages; no third-party script, no WhatsApp/Messenger embed | Meta ended the Messenger chat plugin and Google ended Business Profile chat (2024); M11 (no WhatsApp) stands; Loi 25 (no processor outside Québec); research/02 « offer messaging only if answered » → the panel promises hours, never minutes |
| 11 | New facts on the site | Hours (Google listing, relayed by Yahya), « Pâtisserie & Café », « Gâteaux sur commande », « Ateliers créatifs sur réservation », mobile 438-528-7818 shown as « Cellulaire » (texting not promised) | research/01 update 2026-10-27; research/15 |

| 12 | Ambiance photos (2026-10-28, Yahya: « take any photo you want from the web ») | 7 photos under the **Unsplash License** (free for commercial use, no permission or payment needed): hero, the four families, café, atelier. Always labelled « Photo d'illustration », decorative alt where they only decorate, never on a product card or product page, never a storefront or a person's face. Replace each with the shop's own photo as soon as it exists (same key in `src/lib/photos.js`) | Unsplash, not « any » web photo: no licence debt, no takedown risk. The label keeps the Competition Act and the zero-invention rule: a generic picture never claims to be the shop's product |

Photo credits (`apps/web/src/lib/photos.js`; Unsplash License, credit appreciated, not required): hero · Conor Brown (@commonboxturtle) · viennoiseries · tabitha turner (@tabithaturnervisuals) · pains · Anastasia gezalova (@nastasiko) · pâtisseries · Max Griss (@grissphoto) · gâteaux · Aneta Voborilova (@anetvob) · café · Joe Hepburn (@thatjoebloke) · ateliers · Holly Stratton (@holly_buildalifeyoulove).

## Open for the owner

- Which number takes texts and atelier bookings (450 or 438)? Atelier themes, ages, duration, price, dates.
- Real photos: storefront, counter, a cross-section of each cake, the café, a workshop. Product photos go in Studio (« Vitrine » or the product); the 7 ambiance photos are swapped file by file in `public/photos/` (same names, `src/lib/photos.js`).
- Time budget: the chat inbox adds to the owner's daily Studio time (16 §1.3); the chat can be switched off in « Boutique & heures » if it costs too much.
