# Owner requirements — 2026-10-25

> Stored as provided by Yahya on 2026-10-25. Formatting only; content unchanged. Claims are reviewed in research/12-plan-review.md and research/18-dated-claims-verification.md.

## Identity

- Brand name: "Coco Vanille", in Granby (Québec).
- Google Maps currently shows "Pâtisserie Cocovanille" → official name/spelling decision still open (the shop's signage wins).

## Domains

| Host | Role |
|---|---|
| cocovanillegranby.com | Public site (FR at root, /en/, /es/) |
| admin.cocovanillegranby.com | Admin dashboard ("Coco Studio") |

## Admin dashboard

- A primary focus of the project.
- Must be functional and easy to use for the bakery owner and staff.

## Hosting

- The owner's own VPS.
- Provider and data-centre location not yet given → needed for the Loi 25 assessment (communication of personal information outside Québec).

## Stage and method

- Current stage: plan and brainstorm only, no code.
- Work through the plan one topic at a time.

## Goals (unchanged)

- SEO, AEO and GEO first.
- Ordering inside the site.
- Exceptional UI/UX.

## Known identifiers (from the Google Maps URL and social links)

| Identifier | Value |
|---|---|
| Google CID | 10789122976114705165 (decimal of 0x95baaa2efd52830d) |
| Knowledge Graph ID | /g/11s3b_3rsh |
| Coordinates | 45.3995807, -72.7250821 |
| Instagram | @coco_vanillegranby |
| Facebook | /PatisserieCocoVanille |

## What these change versus the earlier plans

| Earlier plans | Now |
|---|---|
| VOTREDOMAINE.ca | cocovanillegranby.com |
| Vercel / Cloudflare hosting (Vercel log drain) | Self-hosted VPS (direct server logs) |
| Studio at the /studio/ path | Admin subdomain admin.cocovanillegranby.com (robots, noindex and authentication handled per host) |
