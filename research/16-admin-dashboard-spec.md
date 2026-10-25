# 16 · Coco Studio: admin dashboard functional spec (admin.cocovanillegranby.com)

> Track: what Studio does, screen by screen, for the people who use it. Stage: plan only, no code. Written 2026-10-25.
> Inputs (read, not edited): research/16a, 16b, 17, 10, 07, 02, 11, 12, 01, 06; plan-v0a Part 6; plan-v1 §1, §4, §9–§12; plan-v0c §6; requirements-2026-10-25.
> Method: **0 web searches (cap 0).** Every fact comes from a research file ("via 16a §4") and keeps that file's label. New items here are marked **(design choice)**, **(target)** (a goal, not a measurement) or **(est.)** (my estimate).
> Labels: **UNVERIFIED** / **UNVERIFIED (FC)** = carried over from the source file · **[[FACT NEEDED: …]]** = the owner must supply it.
> Wireframes: names, prices, times, sizes and counts are placeholders. Products shown are only ones evidenced in research/01 §0.4 (almond croissants, Paris-Brest, raspberry cake, strawberry shortcake, baguettes, vol-au-vent).
> Term: « cueillette » is used throughout as a placeholder. research/10 uses « ramassage »; one word must win (12 C22). [[FACT NEEDED: owner's word]]

---

## 0. Decisions in one screen

| Question | Decision |
|---|---|
| What Studio is | A **shop tool first**: today's orders, sold-out, requests, reviews, hours. Presence work (SEO/AEO/GEO) reaches the owner only as **≤ 3 to-do cards a week + one score** (12 M18; 16a §9) |
| Daily layer | **6 screens:** Aujourd'hui · Commandes · Vitrine · Demandes · Avis · Boutique & heures. Phone and tablet first, French first |
| Weekly layer | **1 owner screen**, « Cette semaine » (score, 5 numbers, ≤ 3 cards), plus a Monday email |
| Agency layer | Desktop « Agence »: Gates, Scoreboard, Recherche, Visibilité IA, Mentions, Analytique, Intégrations, Conformité. **MVP = read-only views of the rank-first reports + the card generator** (12 §5.1) |
| Deep edits | Payload admin at `/admin` = « Avancé » (owner, agency) (16b §0) |
| Cuts | 41 items from the plans → 6 daily screens + 1 weekly screen + Plus + Agence + Avancé. 13 cut or deferred (§2.3) |
| Interaction rules | One primary action per screen. Instant apply + « Annuler » for ≥ 5 s instead of confirm dialogs. An effects preview only for high-impact actions. Targets ≥ 48 px, primary buttons ≥ 64 px. Works offline (16a P1–P22) |
| Time budget | Owner **≤ 10 min per open day**, ≤ 3 min per closed day, + 5 min on Monday. Staff **≤ 5 min of Studio time per shift**, phone orders excluded (target) |
| MVP | Ships with the ordering engine in plan weeks 11–12 = **2027-01-11 → 01-24** (12 M20, §6). **Must work without the GBP API** (12 D4) |
| Biggest unknowns | Is the shop open? Staff count, devices, POS, hours, « cueillette » vs « ramassage », « acompte » vs « dépôt » (§9) |

---

## 1. Users, roles, jobs, time budget

### 1.1 Roles

| Role (FR label) | Who | Device | Known? | Scope |
|---|---|---|---|---|
| **Propriétaire** | Owner / chef | Own phone (+ a laptop at night) | Identity [[FACT NEEDED]] (01 §12 #5) | All screens. Passkey login; step-up check for money, prices, allergens, taxes, roles (16b §4 #4–5) |
| **Comptoir** | Counter staff | Shared tablet or own phones | [[FACT NEEDED: number of staff, devices]] (16a §1.1) | 4 tabs. PIN switch on a shared device. No money actions |
| **Gérant·e** | Only if a manager exists | Phone | [[FACT NEEDED]] | Owner minus users/roles, refunds and taxes (16b §4 roles) |
| **Agence** | Yahya | Desktop | Yes | Agence + Avancé. **No customer names or phones by default** (design choice; Loi 25 minimisation, 07 §2) |
| **Traduction** | EN (later ES) reviewer, if hired | Desktop | [[FACT NEEDED]] | Translation queue only (16b §4) |
| **Intégration** | Bot (API key) | — | — | rank-first jobs post their results (17 §2.2) |
| ~~Lecture~~ (viewer) | **Cut** | — | — | Nobody identified for it (v0a §6.6 had one) |

### 1.2 Daily jobs

From 16a §2 (J1–J12), assigned to a role and a screen. Budgets are targets.

| Job | Who | Frequency (est.) | Budget | Screen |
|---|---|---|---|---|
| J5 See today's pickups | Comptoir, Propriétaire | All day | 0 taps (it's the home screen) | Aujourd'hui |
| J6 « Marquer prête » → texto | Comptoir | Per order | 1 tap / 3 s | Aujourd'hui |
| J6b Hand the order over | Comptoir | Per order | 2 taps + code / 10 s | Aujourd'hui, Commandes |
| J1 Épuisé | Comptoir | 0–5 a day | 2 taps / 5 s | Quick action → Vitrine |
| J2 Photo de la vitrine | Comptoir or owner | 1 per open day | 3 taps + photo / 60 s | Quick action → Vitrine |
| J11 Phone order | Comptoir, owner | [[FACT NEEDED: volume]] | ≤ 8 taps + typing / 60–90 s | Commandes |
| J12 Tomorrow's production list | Owner / kitchen | 1 a day | 3 taps / 10 s (0 if auto-printed) | Commandes › Production |
| J3–J4 Request → price → deposit | Propriétaire | [[FACT NEEDED: volume]] | 3 taps + amount / 60 s | Demandes |
| J9 Reply to a review | Propriétaire | ≈ 3 a week if the gate is met (v1 §4 L12) | 2 taps / 30 s | Avis |
| J7 Exceptional closure | Propriétaire (Comptoir if allowed) | Rare | 5 taps / 30 s | Boutique & heures |
| J8 Holiday hours | Propriétaire | ~2 seasons a year | 1 tap per date, ≈ 2 min per season | Boutique & heures |
| J10 Numbers of the week | Propriétaire | Weekly | 1 tap + reading / 2–5 min | Cette semaine |

### 1.3 Time budget per role

| Role | Open day | Closed day | Weekly extra | Monthly / quarterly | Basis |
|---|---|---|---|---|---|
| Propriétaire | **≤ 10 min**: glance 1 · photo 1 (if the owner takes it) · requests ≤ 4 · reviews ≤ 1 · other 3 | **≤ 3 min**: reviews (the 24 h rule includes closed days, 12 M1) + requests | Monday 5 min: Cette semaine + ≤ 3 cards | Monthly 15 min: approve the report, Conformité check. Quarterly 30 min: validate data (v1 §9) | Owner requirement "minutes per day". v1 §9 gives the bakery "daily, 20 min"; pre-filled drafts and the 2-tap patterns aim to halve it (target) |
| Comptoir | **≤ 5 min per shift** (e.g. 14 pickups × ~13 s ≈ 3 min + 3 sold-outs + 1 photo), + ~1 min per phone order | 0 | 0 | 10-minute walkthrough at onboarding (16a E10) | 16a §2 budgets (est.) |
| Agence | ≈ 10 min: one mention action, one customer question logged | Same | ≈ 6 h: Mon 1 h scoreboard · Tue–Wed 3 h one page · Thu 1 h off-site · Fri 1 h gates | Monthly: prompts re-run, report. Quarterly: data study | v1 §9 |
| Traduction | ≈ 20 min per new page (est.) | — | — | — | (est.) |

Rule: when a job's median time (from audit-log timestamps) exceeds its budget for 2 weeks, it goes on the agency's fix list (design choice).

---

## 2. Information architecture

### 2.1 Layers and navigation

```
admin.cocovanillegranby.com
├─ DAILY  (phone/tablet · French · big targets)          bottom tab bar, 5 slots max (design choice)
│   Comptoir     : Aujourd'hui · Commandes · Vitrine · Plus
│   Propriétaire : Aujourd'hui · Commandes · Demandes · Avis · Plus
│   Vitrine is one tap away for everyone through the « Épuisé » and « Photo vitrine » quick actions.
│   Boutique & heures opens from the status line on Aujourd'hui (« Ouvert · ferme à 15 h ») and from Plus.
├─ WEEKLY (owner · phone)      Plus › Cette semaine  (+ Monday email)
├─ PLUS   (owner)              Boutique & heures · Cette semaine · Vitrine · Produits · Noter une question ·
│                              Réglages · Conformité · Système · Aide · Avancé
├─ AGENCE (agency · desktop)   Gates · Scoreboard · Recherche · Visibilité IA · Mentions · Analytique ·
│                              Intégrations · Conformité · Système
└─ /admin = « Avancé »         Payload admin: products, pages, FAQ, translations, media, message templates,
                               seasons, capacity rules, users, audit log (owner, agency)
```

Why the owner's bar differs: the owner's jobs that can't wait are requests (24 h answer, v0c §6) and reviews (24 h, M1). Sold-out and the photo are quick actions on Aujourd'hui for every role. The first two tabs are the same for everyone, so a shared tablet behaves the same whoever holds it.

### 2.2 Access matrix

| Screen | Propriétaire | Gérant·e | Comptoir | Agence | Traduction |
|---|---|---|---|---|---|
| Aujourd'hui | ✓ | ✓ | ✓ | — | — |
| Commandes (+ Production, phone order) | ✓ + cancel/refund | ✓ (no refund) | ✓ (no cancel, no refund) | Counts only | — |
| Vitrine | ✓ | ✓ | ✓ | — | — |
| Demandes | ✓ | ✓ | — | — | — |
| Avis | ✓ | ✓ | — | Read | — |
| Boutique & heures | ✓ | ✓ | Read + « Délai allongé »; « Fermeture » only if the owner allows it [[FACT NEEDED]] | Read | — |
| Cette semaine | ✓ | Read | — | ✓ | — |
| Produits (prices, allergens, taxes) | ✓ step-up | ✓ step-up (no taxes) | — | Drafts only (the owner verifies allergens) | EN/ES fields |
| Conformité | ✓ | — | — | ✓ (registers) | — |
| Agence | Read | — | — | ✓ | — |
| Avancé (`/admin`) | ✓ | Content | — | ✓ (no users/roles) | — |

### 2.3 What happens to each module in the plans

41 items from v0a §6.3 (20 modules), v1 §12 (7), v0c §6 back-office (8) and add-ons from v0a §6.5–6.7, v1 §9, 16b, 07 and 17.

| # | Plan item (source) | Decision | Lives in | Why |
|---|---|---|---|---|
| 1 | Accueil (v0a) | **Replaced** | Aujourd'hui | Staff need today's pickups first; a health score means nothing at the counter (16a A18; 12 M18) |
| 2 | Catalogue (v0a) | **Split** | Vitrine (today's availability) · Plus › Produits (facts) · Avancé (deep edit) | A toggle at 10 a.m. and a product form at night are different jobs (16a A1) |
| 3 | Pages & contenu (v0a) | **Cut from the Studio UI** | Avancé (agency); the owner approves through a card | Agency job, desktop (v1 §9 Tue–Wed) |
| 4 | Fiche d'entreprise (v0a) | **Merged** | Boutique & heures | One hours record pushed everywhere (02 §9.5) |
| 5 | Annuaires (v0a) | **Agency report** | Agence › Mentions (directories sweep) | Monthly manual sweep (11 §1.1) |
| 6 | Avis (v0a, v0c) | **Kept, daily** | Avis | 24 h rule (M1) |
| 7 | Cartes & local (v0a) | **Cut; parts merged** | Google-post drafts come from Vitrine and Fermeture; geogrid later in Agence | Local Falcon deferred (12 §5.1) |
| 8 | Recherche (SEO) (v0a) | **Agency layer** | Agence › Recherche + cards | Desktop, agency only (16a §9) |
| 9 | Visibilité IA (v0a) | **Agency layer** | Agence › Visibilité IA; the owner sees one number | Same |
| 10 | Social Studio (v0a) | **Cut (MVP)** | Share drafts from Vitrine only | Channels cut for capacity (12 §5.1, F3) |
| 11 | Médiathèque (v0a) | **Cut as a module** | Photos inside the Vitrine/Produits flows; Payload Media in Avancé | No separate daily job |
| 12 | Saisons & campagnes (v0a) | **Deferred** | Season checklist as cards; season settings in Avancé | 12 §5.1: manual checklist per season |
| 13 | Courriels & SMS (v0a) | **Reduced** | Avancé › Messages: templates tagged transactionnel / commercial. No segments, no flows | No marketing at launch (12 M19; 07 A5) |
| 14 | Demandes (v0a leads) + Soumissions (v0c) | **Kept, daily; custom cakes only** | Demandes | Weddings and corporate are not evidenced (01 §0.4; 12 §5.1) |
| 15 | Publicité (v0a) | **Cut** | — | Ads deferred (12 §5.1) |
| 16 | Analytique (v0a) + Tableau de bord (v0c) | **Reduced** | Cette semaine (5 numbers); Agence › Analytique | Numbers readable in 5 seconds (16a P14) |
| 17 | Liens, QR & UTM (v0a) | **Reduced** | Réglages: the target of the `/avis` QR redirect | 11 §4.2 |
| 18 | Veille (v0a) | **Cut** | — (manual agency checks) | Capacity (12 F) |
| 19 | Intégrations (v0a) | **Agency layer** | Agence › Intégrations; the owner sees the Système tile | 17 §8.2 |
| 20 | Conformité & accès (v0a) | **Kept, monthly** | Plus › Conformité + Agence | Legal registers (07 §5 A3–A5) |
| 21 | Gates (v1) | **Agency layer → cards** | Agence › Gates; a failing gate that needs the owner becomes an owner card | The owner never reads gate JSON |
| 22 | Scoreboard (v1) | **Agency layer → numbers** | Agence › Scoreboard; the owner sees the score + 1 number | Same |
| 23 | Battle map (v1) | **Deferred** | Script report (CSV/Markdown) | 12 §5.1 |
| 24 | Snippet loop (v1) | **Deferred** | Script report | 12 §5.1 |
| 25 | Mentions (v1) | **Agency layer** | Agence › Mentions | v1 §9 Thursday |
| 26 | Données maison (v1) | **Deferred** | — | Needs ≥ 30 orders (02 §9.7) |
| 27 | Diagnostics (v1) | **Agency layer** | Agence › Recherche › Diagnostics; rollout banner on Cette semaine | v1 §12 |
| 28 | Production (v0c) | **Merged** | Commandes › Production | 16a P9 |
| 29 | Capacité (v0c) | **Merged** | Boutique & heures (± per day) + Avancé (rules) | — |
| 30 | Menu (v0c) | **Merged** | Vitrine | — |
| 31 | Heures (v0c) | **Merged** | Boutique & heures | — |
| 32 | Ramassage / scan (16b) | **Merged** | Commandes (« Remettre » by code, QR or name) | — |
| 33 | Coco Copilot (v0a §6.7) | **Not a module** | Drafts inside Avis now; captions and alt text later | 16a P15 |
| 34 | Presence Health Score (v0a §6.5) | **Kept, weekly, owner** | Cette semaine (§4.5) | — |
| 35 | Monday report (v0a flow 6) | **Kept as a digest** | Email + Cette semaine, built from `weekly.mjs`; no AI summary at MVP | 12 §5.1 |
| 36 | Questions log (v1 §9) | **Kept, tiny** | Plus › « Noter une question de client » → agency FAQ queue | AEO loop (v0c §5) |
| 37 | Price history, taxes (07 A6–A7) | **Kept** inside Produits | Owner only, step-up | — |
| 38 | Cartes-cadeaux (07 A8) | **Deferred** | — | Phase 3 (10 §13) |
| 39 | Concours (07 A11) | **Deferred** | Checklist when a contest is planned | — |
| 40 | Système tile (17 §8.2) | **Kept** | Plus › Système + Cette semaine | — |
| 41 | Lecture role (v0a §6.6) | **Cut** | — | No user |

Tally: 8 kept (rows 6, 14, 20, 34–37, 40) · 8 merged, split or replaced (1, 2, 4, 28–32) · 3 reduced (13, 16, 17) · 8 moved to the agency layer (5, 8, 9, 19, 21, 22, 25, 27) · 1 folded into other screens (33) · 13 cut or deferred (3, 7, 10, 11, 12, 15, 18, 23, 24, 26, 38, 39, 41) = 41.

---

## 3. The daily layer, screen by screen

### 3.0 Shell and standards (every screen)

| Element | Rule | Source |
|---|---|---|
| Top bar | Screen name + date · sync chip (« ● À jour » / « ◐ Reconnexion… » / « ○ Hors ligne · 2 en attente ») · person chip (shared device: tap → switch person) | 16a P18, P19; 17 §4 |
| Targets | ≥ 48 × 48 CSS px, ≥ 8 px apart. Primary buttons full width, ≥ 64 px tall (a design choice to test with floury hands) | 16a E3, §0.4, T3 |
| One primary action | One filled button per screen or card; secondary actions as text buttons; everything else under « ⋯ » | Brief; 16a P2 |
| Undo, not confirm | Single taps apply at once; a snackbar « … [Annuler] » stays ≥ 5 s, and longer while screen-reader focus is on it | 16a P4, E7 |
| Side effects wait for undo | A texto or a Google change leaves the server only after the undo window closes, so « Annuler » really cancels | Design choice |
| Forms | Multi-field edits (hours, product) use one sticky bar « Modifications non enregistrées · Ignorer · Enregistrer ». Never mixed with instant toggles on one screen | 16a P5, A5 |
| Effects preview | « Ça va : … » only before closure, pause, refund, cancellation, price change, retiring a product, publishing hours | 16a P22 |
| Status | Icon + word + colour, never colour alone | Design choice (WCAG) |
| Layout | Cards on phones, no tables; tables only in Agence | 16a A4 |
| Format | Local time America/Toronto; « 16 h 30 », « 45,00 $ », « sam. 8 nov. »; relative times (« dans 25 min ») | 16a §8.2; 10 §3.1 |
| Language badge | FR / EN / ES chip on each order and request | 16a P21 |
| Gestures | Shortcuts only; every swipe has a visible button | 16a P17 |
| Speed | Visible response < 0.1 s (optimistic UI) | 16a E4 |
| Copy | Québec French written by a human; infinitive verbs on buttons; no tu/vous in staff UI | 16a §8.2 |
| Install and alerts | Installed from Safari to the Home Screen; « Activer les alertes » asked only after a tap (iOS 16.4+ web push works only for Home Screen web apps) | 16a §6; confirmed by research/18 claim 8 |

Global states:

| State | Copy (fr-CA) |
|---|---|
| Offline | « Hors ligne · 2 changements en attente · envoi automatique au retour du réseau » |
| Reconnecting (deploy, SSE drop) | « Reconnexion… » |
| Stale data | « Mis à jour il y a 4 min » |
| Action refused by the server | « Pas appliqué : la commande 1042 a été annulée par la cliente. » (16a §7.4) |
| Needs the network | « Cette action a besoin du réseau. Rien n'a été envoyé. [Réessayer] » |
| Server error | « Problème de notre côté. Rien n'est perdu. L'agence est avertie. [Réessayer] » |
| Shared tablet, idle 30 min (design choice) | « Qui utilise la tablette? [Léa] [Marc] [Propriétaire] » → 4-digit PIN |

Offline policy (design choice, built on 16a §7):

| Queued offline (outbox, replayed on reconnect) | Blocked offline (needs the server) |
|---|---|
| Épuisé / Remettre en vente · Marquer prête · Remettre la commande · Photo vitrine (uploads later) · Noter une question · Phone order **as a draft** (the slot is checked on sync; if full: « Créneau complet : rappeler Julie ») | Sending a quote · Cancel / refund · Fermeture, pause, délai · Publishing a review reply · Editing hours |

### 3.1 Aujourd'hui (home)

- **Purpose:** what to do now. **Primary action:** the forward button of the next order. **Who:** every bakery role.
- **Order of blocks:** status line (tap → Boutique & heures) · search · 3 quick actions · « À faire » (≤ 3 cards, filtered by role) · pickups by time.

```
+--------------------------------------+
| Aujourd'hui · sam. 31 oct.  ● À jour |
| Ouvert · ferme à 15 h             >  |
| 14 cueillettes · 3 prêtes · 1 retard |
|--------------------------------------|
| [ Rechercher une commande, un nom… ] |
| [ Épuisé ] [ Photo vitrine ] [ Tél. ]|
|--------------------------------------|
| À FAIRE                            2 |
| Demande · gâteau 40 pers. · 8 nov.   |
|   Répondre d'ici dim. 10 h  [Ouvrir] |
| Avis 2★ · brouillon prêt    [Ouvrir] |
|--------------------------------------|
| 10 h 00  Léa B. · 1039        FR     |
|   Prête ✓ · Payée                    |
|   [===== Remettre la commande =====] |
| 10 h 15  Julie T. · 1042      FR     |
|   Paris-Brest · Payée                |
|   [========= Marquer prête ========] |
| 10 h 30  Mark S. · 1043       EN  ⚠  |
|   Gâteau aux framboises · Acompte    |
|   [========= Marquer prête ========] |
|   … 11 autres                        |
|--------------------------------------|
| Aujourd'hui Commandes Demandes Avis +|
+--------------------------------------+
```

| State | What shows | Copy (fr-CA) |
|---|---|---|
| Open | As above, sorted by pickup time; late orders move to the top | « 14 cueillettes · 3 prêtes · 1 en retard » |
| Before opening | Today's list, read mode | « Ouvre à 9 h · 14 cueillettes aujourd'hui » |
| Closed day | Next opening + its pickup count; cards stay | « Fermé aujourd'hui · prochaine ouverture : jeudi 9 h (9 cueillettes) » |
| Exceptional closure on | Red banner with end time | « Fermeture exceptionnelle jusqu'à demain 9 h · [Rouvrir maintenant] » |
| Busy mode on | Amber banner | « Délai allongé de 1 h jusqu'à 14 h · [Arrêter] » |
| Online orders paused | Amber banner | « Commandes en ligne en pause jusqu'à 13 h · [Reprendre] » |
| Empty | — | « Aucune cueillette aujourd'hui. Les nouvelles commandes arrivent ici. » |
| Due in 15 min, not ready | Amber chip | « Dans 15 min · pas prête » |
| Late | Red chip | « En retard · prévue à 10 h 15 » |
| After closing, orders left | Card | « 2 commandes non récupérées · [Décider] » |
| No data and no cache | Error card | « Impossible d'afficher les commandes. Elles sont en sécurité sur le serveur. Utiliser la liste imprimée ce matin. [Réessayer] » (paper fallback, 16a §7.6) |

Notifications: a new order for today slides into its time slot, with a sound on the tablet (16a §6). A new order for tomorrow adds a badge on Commandes.

### 3.2 Commandes

- **Purpose:** every order, and the one queue for web and phone (16a J11; v0c §8 rule #1). **Primary action:** « + Commande téléphone ».
- **Tabs:** Aujourd'hui · Demain · À venir · Production. A search field finds a number, name or phone.
- **Statuses shown to staff:** Payée → Prête → Récupérée (+ Non récupérée, Annulée, Remboursée). « En préparation » is derived from the production date, with no tap (design choice; state machine in 10 §2).

Order card (detail):

```
+--------------------------------------+
| < Commande 1042                  FR  |
| Julie T.                  [Appeler]  |
| Cueillette sam. 31 oct. 10 h 15–10 h 30
| Code : 4821                          |
|--------------------------------------|
| 1 × Paris-Brest                      |
| Message : « Bonne fête Léo »         |
| ⚠ Allergie signalée · voir la note   |
|--------------------------------------|
| Payée en ligne · 48,00 $             |
|--------------------------------------|
| Payée > Prête > Récupérée            |
| [========= Marquer prête ==========] |
| ⋯ Imprimer l'étiquette · Proposer un |
|   autre créneau · Annuler (proprio)  |
+--------------------------------------+
```

Production tab (16a P9; 10 §7):

```
+--------------------------------------+
| Production · ven. 30 oct. (pour sam.)|
| Imprimée à 14 h 05 · 1 changement    |
|   depuis [Voir]                      |
|--------------------------------------|
| GÂTEAUX                            5 |
|  Paris-Brest              2  1042 1047
|  Gâteau aux framboises    1  1051 ⚠  |
|    « Joyeux 40e Marie »              |
|  Shortcake aux fraises    2          |
| VIENNOISERIES (vitrine prévue)       |
|  Croissant aux amandes   20          |
|--------------------------------------|
| [=========== Imprimer ============]  |
| PDF                                  |
+--------------------------------------+
```

Phone order sheet:

```
+--------------------------------------+
| Commande téléphone                   |
| 1 Produits  [ Rechercher…        ]   |
|   Paris-Brest           [−] 1 [+]    |
| 2 Cueillette [sam. 31] [10 h 15 >]   |
|   (only slots with room are shown)   |
| 3 Client  Prénom [        ]          |
|           Tél.   [        ]          |
| 4 Paiement (•) Au comptoir           |
|            ( ) Lien par texto        |
| Total 48,00 $ + taxes                |
| [======= Créer la commande ========] |
+--------------------------------------+
```

| State | Copy (fr-CA) |
|---|---|
| Empty tab | « Aucune commande pour demain pour l'instant. » |
| Slot taken while entering | « Ce créneau vient d'être pris. Les plus proches : 10 h 30 · 10 h 45 » (10 §3.2) |
| Offline phone order | « Brouillon gardé · on vérifie la place au retour du réseau » |
| Bulk mode | « Sélectionner » → visible checkboxes → « Marquer 5 commandes prêtes » (16a P13) |
| Hand-over | « Code du client? [_ _ _ _] · [Scanner] · [Client reconnu] » → « Récupérée · 10 h 12 » |
| Printed list changed | « Modifié après impression : +1 Paris-Brest (1052) » (10 §7) |
| Printer offline | « Imprimante hors ligne · [Ouvrir le PDF] » |
| Texto failed | « Texto non livré à Julie T. · [Appeler] [Réessayer] » |
| Refund (owner) | Effects preview, reason required, passkey: « Rembourser 54,00 $ à Julie T. · ça ne peut pas être annulé » (16a A16; 16b §4 #4) |
| Refund timer | « Remboursement dû d'ici le 14 nov. » turns red at day 10 (07 A9) |

Notifications: badge on the tab for new orders for tomorrow; in-app banners for late, unpicked and failed-texto cases (§6.1). Offline: Prête and Remettre are queued; cancel and refund are blocked (§3.0).

Phone orders send the same confirmation (email or texto with the conditions link) when a contact is given. Whether LPC distance-contract rules cover phone orders: [[FACT NEEDED: counsel]] (07 C-1 covers online orders).

### 3.3 Vitrine

- **Purpose:** what the site shows as available today, and today's display-case photo (v0c §5). **Primary action:** « Prendre la photo » until the photo is posted, then none (the toggles apply at once).

```
+--------------------------------------+
| Vitrine · sam. 31 oct.      ● À jour |
|--------------------------------------|
| PHOTO DU JOUR                        |
| [ photo d'hier, grisée ]             |
| Pas encore de photo aujourd'hui.     |
| [======== Prendre la photo ========] |
|--------------------------------------|
| DISPONIBLE AUJOURD'HUI               |
|                    [Reprendre hier]  |
| Croissant aux amandes                |
|   20 prévus · 8 réservés  [Épuisé]   |
| Paris-Brest                          |
|   8 prévus · 2 réservés   [Épuisé]   |
| Vol-au-vent       ÉPUISÉ [Remettre]  |
|   revient jeudi à l'ouverture        |
| [ + Ajouter à la vitrine ]           |
+--------------------------------------+
```

Sold-out semantics follow 16a P3: the default is « pour aujourd'hui », which resets at the next opening; « Changer la durée » in the snackbar offers « Plusieurs jours… » and, for the owner, « Jusqu'à nouvel ordre ». Retiring a product is not here: it goes through Produits with an effects preview (G19).

| State | Copy (fr-CA) |
|---|---|
| Sold out | Snackbar: « Croissant aux amandes : épuisé jusqu'à jeudi 9 h. [Annuler] [Changer la durée] » |
| Uploading | « Envoi de la photo… » |
| Offline photo | « Photo gardée · elle sera publiée au retour du réseau » |
| Published | « Sur le site depuis 8 h 12 · [Remplacer] ». The site shows the date: « Vitrine du samedi 31 octobre » (design choice) |
| Drafts | « Brouillons prêts : publication Google · story Instagram · [Voir] » (v1.1; approval needed, G9) |
| Empty list | « Rien à la vitrine aujourd'hui. [Reprendre hier] » (16a P10) |

Notifications: none (a quiet screen). A card on Aujourd'hui at 10 h if no photo is posted on an open day (design choice). Offline: toggles and the photo are queued.

Alt text for the photo is built from visible facts, not AI: « Vitrine de Pâtisserie Coco Vanille, samedi 31 octobre : croissants aux amandes, Paris-Brest » (design choice; zero-invention rule).

### 3.4 Demandes (custom-cake requests)

- **Purpose:** request → price → deposit link, with a written recap and the inspiration photo, which designs out the shop's one public complaint (02 §0.2; 16a P11; 12 M24). **Primary action:** « Chiffrer et envoyer ».

```
+--------------------------------------+
| Demandes                2 en attente |
|--------------------------------------|
| ⏱ 18 h pour répondre                 |
| Anniversaire · 40 pers. · sam. 8 nov.|
| Vanille-framboise                    |
| Message : « Bonne fête Léo »         |
| [photo 1] [photo 2]          FR  ⚠   |
| Capacité du 8 nov. : 2/6 gâteaux     |
| [======= Chiffrer et envoyer ======] |
| Autre date · Refuser · Appeler       |
+--------------------------------------+

+--------------------------------------+
| Chiffrer                             |
| Prix total            [ 180,00 $ ]   |
|   grille : 160–190 $ (si grille)     |
| Acompte (30 %)          54,00 $      |
| Solde à la cueillette  126,00 $      |
| Valide jusqu'au     mar. 4 nov.      |
| Récapitulatif + photo     [Aperçu]   |
| [===== Envoyer le lien d'acompte ==] |
+--------------------------------------+
```

The deposit % has **no default** until the owner sets it (10 §1.2); 30 % is a placeholder. Quote validity 72 h is a placeholder (10 §5.2). Taxes come from the tax engine (07 §6). Recap and conditions are sent French first (07 F-3).

| State | Copy (fr-CA) |
|---|---|
| None waiting | « Aucune demande en attente. » |
| Overdue | « Délai de 24 h dépassé de 2 h · répondre maintenant » |
| Day full | « Le 8 nov. est complet (6/6 gâteaux) · [Proposer une autre date] » |
| Allergy in the request | « Demande avec allergie : à traiter par téléphone » (always a human, 10 §5.2; no free-from promises, 07 S10) |
| Sent | « Soumission envoyée · expire mar. 4 nov. 18 h · place réservée provisoirement » |
| Deposit paid | « Acompte reçu · commande confirmée · ajoutée aux commandes du 8 nov. » |
| Expired | « Expirée · place libérée » |
| Refuse (template, editable) | « Désolés, nous sommes complets ce jour-là. Nous pouvons vous proposer le samedi 15 novembre. » |
| Offline | « Envoi impossible hors ligne · la demande reste en attente » (the button is disabled) |

Notifications: urgent push on a new request; a reminder card at 18 h left; deposit received in the digest (§6.1).

### 3.5 Avis

- **Purpose:** reply within 24 h in the reviewer's language (M1). **Primary action:** « Publier la réponse ».

```
+--------------------------------------+
| Avis                   1 sans réponse|
|--------------------------------------|
| ★★★★★ Google · Julie T. · il y a 3 h |
| « Le Paris-Brest était parfait… »    |
| Répondre d'ici : demain 13 h         |
| Brouillon (FR) :                     |
| Merci beaucoup, Julie! On est        |
| contents que le Paris-Brest vous ait |
| plu. Au plaisir de vous revoir rue   |
| Court. — L'équipe Coco Vanille       |
| [======= Publier la réponse =======] |
| Modifier · Plus tard                 |
+--------------------------------------+
```

Drafts start from the 11 §4.5 templates: signed « — L'équipe Coco Vanille », no staff names, no order details. Names are stripped before any AI call (07 A10).

| State | Copy (fr-CA) |
|---|---|
| All answered | « Tous les avis ont une réponse. » |
| 1–3 ★ | Push + card; draft from the "mixed / negative" template; follow-up card: « Appeler le client? (commande trouvée : 1042) » (v0a flow 5) |
| Sent | Snackbar « Réponse envoyée à Google. [Annuler] » (10 s before it leaves, design choice), then « Elle peut prendre un moment à s'afficher. » |
| GBP API not approved yet | « Google n'est pas encore relié. [Copier la réponse] [Ouvrir Google] [J'ai répondu] » (12 D4) |
| No draft | « Pas de brouillon cette fois · choisir un modèle : Positif · Note seule · Négatif » |
| Offline | « Publier » disabled: « Publication impossible hors ligne · le brouillon est gardé » |

Notifications: urgent push for 1–3 ★; 4–5 ★ go to a card and the daily digest (§6.1).

### 3.6 Boutique & heures

- **Purpose:** is the shop open, and what the site, schema and Google say about it. **Primary action:** « Fermeture exceptionnelle ».

```
+--------------------------------------+
| Boutique & heures                    |
| ● Ouvert · ferme à 15 h              |
| Commandes en ligne : actives         |
|--------------------------------------|
| [==== Fermeture exceptionnelle ====] |
| [ Délai allongé ] [ Pause en ligne ] |
|--------------------------------------|
| HEURES HABITUELLES        [Modifier] |
| jeu.–ven. 9 h – 16 h 30              |
| sam. 9 h – 15 h · dim.–mer. fermé    |
| JOURS SPÉCIAUX                       |
| 24 déc. · à confirmer     [Choisir]  |
| 25 déc. Noël · à confirmer [Choisir] |
| CAPACITÉ · gâteaux par jour  6 [−][+]|
|   sam. 31 oct. : 4/6                 |
| FICHE (verrouillée)                  |
| Pâtisserie Coco Vanille              |
| 3, rue Court, Granby · 450-372-7177  |
| Site ✓ · Google ✓ · Apple : tâche    |
+--------------------------------------+
```

Hours shown are the most probable pattern from 01 §3 (UNVERIFIED; [[FACT NEEDED: owner-confirmed hours]]). Holidays are pre-loaded « à confirmer » (10 §3.4). The business name itself is undecided (« Coco Vanille » vs « Cocovanille », 01 §0.3) [[FACT NEEDED]].

Closure sheet (16a P6, P22; v0a flow 4; 07 O7):

```
+--------------------------------------+
| Fermeture exceptionnelle             |
| Pourquoi?                            |
| [Tempête] [Maladie] [Bris] [Autre]   |
| Combien de temps?                    |
| [Reste de la journée] [Demain]       |
| [Jusqu'au…]                          |
|--------------------------------------|
| Ça va :                              |
| · afficher un bandeau (FR/EN/ES)     |
| · mettre en pause les commandes en   |
|   ligne                              |
| · mettre des heures spéciales sur    |
|   Google                             |
| · texter 6 clients : choisir un      |
|   nouveau créneau ou être remboursés |
| · tout remettre jeudi à 9 h          |
| [======= Fermer la boutique =======] |
+--------------------------------------+
```

| State | Copy (fr-CA) |
|---|---|
| After closing | « Boutique fermée jusqu'à jeudi 9 h · les textos partent dans 60 s · [Annuler] » (60 s grace: design choice) |
| Google without API | « Google : à faire à la main (1 min) · [Voir les heures à copier] » |
| Hours form | Sticky bar « Modifications non enregistrées · Ignorer · Enregistrer », then an effects preview: « Ça va changer : le site, Google, la fiche Apple (tâche) » |
| Busy mode | « +30 min · +1 h · Pour demain » × « jusqu'à : la fermeture · 14 h · … » → « Délai allongé de 1 h jusqu'à 14 h. [Annuler] » (16a P7) |
| Pause | « Pause : 1 h · Reste de la journée · Jusqu'à… » + « Les commandes déjà payées restent prévues. » (10 §13) |
| Device offline | Studio never closes the shop by itself; it alerts the owner (16a A17) |
| Offline (this device) | Closure, pause, busy mode and hours are disabled: « Hors ligne · la fermeture a besoin du réseau. Essayer avec les données cellulaires. » |
| Sync failed | « Google n'a pas accepté les heures · l'agence est avertie · [Le faire à la main] » |

Notifications: a card at J-30 for each holiday still « à confirmer »; a card when the hours on Google and the site disagree (§4.4).

### 3.7 Top 12 flows

Counted from Aujourd'hui, app open and unlocked. Targets, not measurements.

| # | Flow | Who | Steps | Taps | Time | Safety net | Automatic effects |
|---|---|---|---|---|---|---|---|
| F1 | **Épuisé** | Comptoir | 1 « Épuisé » → 2 tap the item | **2** | **5 s** | Annuler 5 s; « Changer la durée » | Site « Épuisé aujourd'hui »; schema `SoldOut` (10 §8); resets at next opening |
| F2 | **Marquer prête** (+ bulk) | Comptoir | 1 tap on the card. Bulk: « Sélectionner » → check N → « Marquer N prêtes » | **1** (bulk 2 + N) | **3 s** (bulk 5 in 15 s) | Annuler 5 s; the texto waits for the window | GSM-7 texto (10 §6); customer tracker |
| F3 | **Remettre la commande** | Comptoir | 1 « Remettre » → 4-digit code, or « Scanner » / « Client reconnu » | **2** + code | **10 s** | Annuler 5 s | Status « Récupérée »; one review request planned under G6 |
| F4 | **Photo vitrine** | Comptoir | 1 « Photo vitrine » → 2 shutter → 3 « Publier » | **3** | **60 s** | « Remplacer » at any time | Compression and sizes; site block; facts-only alt text; post drafts (v1.1) |
| F5 | **Commande téléphone** | Comptoir | 1 « Tél. » → products → date + slot → name + phone → payment → « Créer » | **≤ 8** + typing | **60–90 s** | Server re-checks capacity | Same pools as the web (10 §3.3); confirmation with the conditions link |
| F6 | **Demande → prix → acompte** | Propriétaire | 1 open (push or card) → 2 « Chiffrer et envoyer » → amount → 3 « Envoyer le lien d'acompte » | **3** + amount | **60 s** | Recap preview; editable | Payment link by texto/email; provisional capacity hold; expiry timer |
| F7 | **Répondre à un avis** | Propriétaire | 1 open → 2 « Publier la réponse » | **2** (4 without the API) | **30 s** | Annuler 10 s | Reply through the API, or copy + open Google |
| F8 | **Fermeture exceptionnelle** | Propriétaire | 1 status line → 2 « Fermeture exceptionnelle » → 3 reason → 4 duration → 5 « Fermer la boutique » | **5** | **30 s** | Effects preview; 60 s Annuler before textos | Banner ×3; online pause; Google special hours (API or task); textos with new-slot or refund link; 15-day refund timers; Apple/Bing tasks; auto-revert |
| F9 | **Délai allongé** | Comptoir, owner | 1 status line → 2 « Délai allongé » → 3 « +1 h » | **3** | **10 s** | Annuler 5 s | Online slots earlier than now + 1 h hidden; paid orders untouched |
| F10 | **Heures des fêtes** | Propriétaire | 1 card « 3 jours fériés à confirmer » → one chip per date (Ouvert / Fermé / Heures spéciales) → « Publier partout » | **2 + 1 per date** | **≈ 2 min** per season | Effects preview | Site, `openingHoursSpecification`, Google (API or task), Apple/Bing tasks. Live everywhere by Dec 1 (12 §6 week 5) |
| F11 | **Production de demain** | Owner / kitchen | 1 Commandes → 2 Production → 3 « Imprimer » | **3** (0 if auto-printed at cut-off) | **10 s** | Versioned snapshot | « Modifié après impression » diff (10 §7) |
| F12 | **Cette semaine** | Propriétaire | 1 Monday push → read → 1 tap per card | **1 + ≤ 3** | **2–5 min** | « Pas maintenant » on a card | — |

F8 counts navigation and the final confirmation; 16a J7's "3 taps" counted only reason, duration and confirm.

Other flows, same rules: « Non récupérée » at closing (2 taps: Garder pour demain / Annuler selon la politique, [[FACT NEEDED: no-show rule]]); « Proposer un autre créneau » (3 taps; the customer chooses, 07 O7); « Changer de personne » (1 tap + PIN); « Rembourser » (owner: 4 taps + passkey).

---

## 4. The SEO/AEO/GEO layer, made simple

### 4.1 Principle

- The owner never reads raw charts, gate JSON or prompt tables. The Ranking Stack's outputs become **to-do cards** (v0a §6.1: "alerts and prioritized actions replace raw charts").
- The agency keeps the full reports on the desktop (Agence).
- The staff see none of it (16a A18).

### 4.2 « Cette semaine » (owner, Monday)

```
+--------------------------------------+
| Cette semaine · 26 oct.–1er nov.     |
| Présence 74/100 (+3)                 |
| Avis ▮▮▮▮▮ · Faits ▮▮▯ · Carte ▮▮▮▯  |
|--------------------------------------|
| 5 CHIFFRES                           |
| Commandes en ligne  23 · 612 $ +15 % |
| Demandes            4 reçues · 3 ok  |
| Avis       3 nouveaux · 5,0 · 3/3    |
|            répondus en 24 h          |
| Appels + itinéraires (site)  41 +8 % |
| Cité par l'IA        6/30 réponses   |
|--------------------------------------|
| À FAIRE (3 max)                      |
| 1 Confirmer les heures du 24 déc.    |
|   [Ouvert] [Fermé] [Heures spéciales]|
| 2 Confirmer les portions du gâteau   |
|   aux framboises (page Gâteaux)      |
|   [Répondre]                         |
| 3 Valider le prix du Paris-Brest     |
|   [Valider]                          |
|--------------------------------------|
| L'agence s'occupe de 3 actions [Voir]|
| Système : tout roule ✓               |
+--------------------------------------+
```

Number sources: orders and requests from the order database (10 §2); reviews from GBP (API, or a weekly count typed by the owner); calls + directions from GA4 key events `phone_click` and `directions_click` on the site, consent-gated, so partial (v1 §11; 07 S7); « Cité par l'IA » = the GEO count over the 30-prompt set (v1 §1). The Monday email carries the same 5 numbers + the 3 cards, built by `weekly.mjs` without AI (12 §5.1).

### 4.3 Card anatomy

| Part | Rule |
|---|---|
| Title | Verb first, ≤ 60 characters, French: « Confirmer les heures du 24 déc. » |
| Why | One sentence with its source and date: « Google affiche 9 h–16 h 30 le samedi (vu le 2 nov.), le site dit 9 h–15 h. » |
| Action | One primary action, answered inside the card when possible (a chip, a number, a photo) |
| Due date and owner | Each card has both; the agency sees all cards, the owner sees only theirs |
| Snooze | « Pas maintenant » = 7 days, twice at most, then the card goes to the agency (design choice) |
| Closing | Never ticked by hand: the generator closes it when its next run sees the condition fixed |
| Evidence | Link to the report row (agency view only) |

### 4.4 Generation rules

| Source (Ranking Stack or Studio) | Trigger | Card (fr-CA) | For | Done when |
|---|---|---|---|---|
| Publish guard (v1 §10) | A draft is blocked by a [[FACT NEEDED]] marker | « 1 info manquante pour publier : portions du gâteau aux framboises » + field | Owner | Guard passes |
| Gates (`npm run gate`, Friday) (v1 §12) | A gate fails | Agency: « Gate 5 : un robot IA reçoit 403 sur /carte/ ». Owner only if the fix needs them | Agency (owner if input needed) | Gate passes on the next run |
| Hours / NAP consistency (directories sweep, 11 §1.1; GBP read) | Any mismatch | « Google dit 9 h–16 h 30 le samedi, le site dit 9 h–15 h. Lequel est juste? » [9 h–16 h 30] [9 h–15 h] | Owner | All sources match |
| Holiday planner (10 §3.4) | A holiday within 30 days is still « à confirmer » | « Le 24 décembre approche : ouvert ou fermé? » | Owner | Set |
| Refresh queue (`fresh`, v1 §12) | Key page > 180 days, a stale fact, or a seasonal page at J-40 (v0a §6.2) | « La page Saint-Valentin revient dans 40 jours : confirmer les produits et les prix » | Owner (facts), agency (writing) | Page republished with a dated fact |
| Scoreboard (`weekly.mjs`, Monday) | The agency picks the week's 3 moves (v1 §9) | Information only: « Cette semaine, l'agence : 1) … » . A card only if the owner must supply something (photos, a fact) | Owner (if input needed) | Move done |
| Review replies (Avis) | Unanswered review; 24 h timer | « Avis 5★ de Julie · brouillon prêt » | Owner | Reply posted |
| Review velocity (v1 §4 L12; 11 §4.6) | < 3 new reviews a week, shop level, 2 weeks running | « Peu d'avis ces 2 semaines : les cartes QR sont-elles dans les boîtes? » [C'est fait] [Commander des cartes] | Owner | Checked. Never a staff target (M2) |
| AI answers (`ai-runs`, v1 §1) | An engine states a wrong fact about the shop | Agency fixes it at its source; owner told in the digest: « ChatGPT donnait de mauvaises heures : corrigé à la source » | Agency | Next run correct |
| Striking distance (`gsc striking`) | Query at position 4–15 | Agency only | Agency | — |
| Season calendar (data/seasonal-calendar.csv) | J-40 / J-14 milestones | « Précommandes Saint-Valentin : ouvrir le 1er février? » [Oui] [Pas cette année] | Owner | Decided |
| Google update rollout (v1 §12 Diagnostics) | Rollout in progress | Banner, not a card: « Mise à jour Google en cours : on ne tire aucune conclusion cette semaine. » | Both | Rollout over |
| Integrations (17 §8.2) | Token expires in < 14 days | Agency card; owner only when the owner's own Google login is needed: « Google demande une reconnexion (2 min) » | Agency / owner | Reconnected |
| Backups, uptime (17 §8.2) | A heartbeat fails | Agency; the owner's Système tile turns red: « Problème de sauvegarde · l'agence est avertie » | Agency | Fixed |
| Conformité (07 A3) | A vendor in use without an ÉFVP; a privacy request due; a 15-day refund timer at day 10 | « Demande d'accès de Julie T. : répondre d'ici le 20 nov. » | Owner | Closed |

### 4.5 Card budget and order

- Owner: **≤ 3 presence cards a week** (review and request cards are shop work and don't count). Everything else goes to the agency queue (design choice).
- Order: (1) blocks a publication or an error in a published fact or a legal deadline → (2) due in < 7 days → (3) expected impact set by the agency (design choice).
- A card the owner can't act on in under 2 minutes is split, or it goes to the agency (design choice).

### 4.6 Presence Health Score, adapted from v0a §6.5

| Component | Weight (v0a → now) | Measured by | Change and reason | MVP |
|---|---|---|---|---|
| Avis | 20 → **20** | 10 = % replied ≤ 24 h · 5 = new reviews a week vs the shop-level gate of ≥ 3 · 5 = trailing-90-day rating ≥ 4.5 (threshold: design choice) | 48 h → 24 h (M1); no per-staff counts (M2) | Yes (API, or the weekly count typed in) |
| Exactitude des faits | 15 → **20** | NAP and hours identical on GBP, site, Apple Business, Bing Places, Facebook and the top directories; 0 [[FACT NEEDED]] on live pages; AI answers give the right hours and address | Was "listings accuracy". Raised because conflicting hours are the shop's main documented weakness (01 §3: 6 conflicting schedules) | Partly (monthly manual sweep) |
| Recherche | 15 → **15** | SEO scoreboard: prompts at #1 / top 3 among the 20 commercial + local prompts (v1 §1); gates L2–L5 passing | Same | Yes |
| Carte | 15 → **15** | Map pack held on local prompts, checked from Granby (v1 §1); geogrid % top 3 once a grid tool is bought | Geogrid replaced by a map-pack check until then (12 §5.1) | Yes (reduced method) |
| Réponses (AEO + GEO) | 10 → **15** | AEO: prompts where our passage owns the snippet, a PAA answer or the AI Overview citation (/30). GEO: prompts citing the brand in ≥ 2 engines (/30) (v1 §1) | AEO was not scored in v0a; both are first-class in v1 | Yes (weekly runs) |
| Fraîcheur | 10 → **10** | Key pages within the 180-day cycle; seasonal page ready by J-40 | Same | Yes |
| Technique | 10 → **5** | Gates for CWV, crawler access, schema and hreflang; uptime; last restore test OK (17 §8) | Agency-controlled; its failures already raise cards | Yes |
| Social | 5 → **0** | — | Channels cut for capacity (12 §5.1) | — |

Display rules (design choices unless sourced):
- The score appears only after **4 weekly baselines** (v1 §1 counts "4 weekly runs in a row").
- « Mesure partielle » when less than 80 % of the weight is measured.
- Bars and arrows only; no gauge or donut (16a P14). ≥ 80 vert · 60–79 ambre · < 60 rouge.
- Each component opens one sentence plus the card that fixes it.
- After 8 weeks, one line applies v1 §11's rule: early signals up with flat orders = « c'est tôt »; flat signals = « ça ne marche pas, on change d'approche ».
- Never shown to Comptoir.

### 4.7 Agency layer at MVP

| Screen | Shows | Source | MVP form |
|---|---|---|---|
| Gates | 21 layers: pass/fail, last run, evidence, owner (v1 §12) | Gate JSON from CI and Friday runs | Table; filter on failing |
| Scoreboard | One row a week: SEO / AEO / GEO counts, 4-week trend (v1 §1) | `weekly.mjs` | Table + one line chart |
| Recherche | GSC/Bing by language folder, striking distance, cannibalisation, CTR; Diagnostics + DROP mode | gsc scripts | Rendered report pages (v1.1) |
| Visibilité IA | 30 prompts × engines: named, linked, wrong facts; monthly crawler log | `ai-runs`, `log-bots.mjs` | Rendered report (v1.1) |
| Mentions | Mentions, best-of lists, pitches, directories sweep | mentions.csv, directories.csv | List (v1.1) |
| Analytique | GA4 key events, AI channel, orders by channel and language | ga4 scripts + order database | Report (v1.1) |
| Intégrations | Per connection: status, scopes, expiry, last sync, errors (v0a §6.3) | Integration collection | Cards |
| Conformité | Vendor register and ÉFVP status, incidents, requests, consents, retention jobs (07 A3–A4); audit log | Studio | Lists |
| Système | Uptime, backups, restore test, disk, certificate (17 §8.2) | Heartbeats | Tile |

---

## 5. Guardrails

| # | Guardrail | Enforced | What the user sees (fr-CA) | Source |
|---|---|---|---|---|
| G1 | **French first.** No EN/ES page or product goes live unless its FR version exists and is at least as complete | Server publish hook + UI | « Publication bloquée : la version française manque ou est moins complète (prix, allergènes, FAQ). » | 07 F-2, S2, A2; v1 §10 |
| G2 | **[[FACT NEEDED]] guard.** No marker or placeholder on a live page | Same | « 1 info manquante : portions du gâteau aux framboises. [Répondre] » | v1 §10; 02 §9.9 |
| G3 | **Allergens verified by a human.** Checklist of the priority allergens + gluten sources; a "vérifié le … par …" stamp; a recipe change voids it; labels and the site read only verified fields; never AI-written | Produits custom field; `allergenErrors()` check (12 §5.2) | « Allergènes à vérifier : la recette a changé depuis le 20 nov. [Vérifier] » · « Vérifié le 20 nov. par la propriétaire » | 07 A-3, A-8; 12 §5.2 |
| G4 | **No free-from claims** (« sans gluten », « végane », « sans noix ») unless cleared | Text scan on save | « « Sans gluten » est une allégation réglementée. Retirer le mot ou demander à l'agence. » | 07 A-6, S10 |
| G5 | **GBP name lock.** One name, one language, no keywords | Read-only in Boutique & heures; validation in Avancé | « Nom verrouillé : le même partout, sans mots-clés. Un changement passe par l'agence et la propriétaire. » | v1 §10; 01 §0.3 |
| G6 | **Review requests.** One per completed order, to everyone, never filtered by satisfaction; no incentive, no stars, no product or staff names; QR card in the box; email only if the box was ticked; never folded into the « prête » texto | Job rules (11 §4.3 `planReviewRequest`, with one change: its sketch relies on implied consent from the purchase, while binding decision M23 requires the ticked box for email/SMS); locked templates; no UI to filter | « Une demande par commande, à tout le monde. » | 11 §4.1; 12 M2, M3, M23; 07 E-4 |
| G7 | **Review replies.** Templates; names stripped before AI; signed « — L'équipe Coco Vanille »; no order details in public; a human publishes | Avis | « Brouillon · à vérifier avant de publier » | 11 §4.5; 07 A10 |
| G8 | **Schema only from visible values.** JSON-LD built from the same fields the page renders; no `aggregateRating` on the business; one availability state drives page, schema and feed | Build + gates (render-diff, schema) | Agency gate, nothing for the owner | v1 §10; 10 §8; 06 (k) |
| G9 | **AI never publishes.** Every AI text is a draft that needs a tap | All drafts | « Brouillon prêt · Approuver » | v0a §6.7; 16a P15 |
| G10 | **Audit log.** Every change: person + device, time, before/after, IP; read-only; the owner can read it | `afterChange` / `afterDelete` hooks → AuditLog (16b §4 #14) | « Léa (tablette) a marqué Croissant aux amandes épuisé à 10 h 42 » | 16b §4; v0a §6.1 |
| G11 | **Money actions.** Cancel and refund: owner only, passkey step-up, reason, effects preview; 15-day refund timer | Commandes | « Rembourser 54,00 $ · ça ne peut pas être annulé » | 16b §4 #4; 16a A16; 07 A9 |
| G12 | **The customer chooses a new date.** Studio never moves a confirmed pickup alone | Commandes, Fermeture | Button « Proposer un autre créneau », never « Changer la date » | 07 O7 |
| G13 | **Tax class.** A product in class `ask` can't be sold online; a class goes live only with « Approuvé par le comptable le … » | Produits (owner only) | « Vente en ligne bloquée : classe de taxe à confirmer avec le comptable. » | 07 A7, O13; 10 §0 |
| G14 | **Price history.** Automatic; « était / maintenant » blocked unless the history backs it | Produits | « Promo impossible : l'ancien prix n'a pas été affiché assez longtemps. » | 07 A6 |
| G15 | **Message types.** Templates are transactionnel or commercial; a commercial one needs a matching consent; each SMS template passes the GSM-7, one-segment test with sender + STOP | Avancé › Messages + CI | « Modèle commercial : envoyé seulement aux clients qui ont coché la case. » | 07 A5; 10 §6 |
| G16 | **Allergy notes.** Shown on the order card only; a ⚠ on the production sheet; never in texto, email or AI; deleted 30 days after pickup | Data model + templates | « Allergie signalée · voir la note » | 07 O9; 10 §2 |
| G17 | **Never auto-close** because a device is offline | Monitoring | Owner alert only | 16a A17 |
| G18 | **Holidays « à confirmer ».** Nothing is published until the owner taps | Boutique & heures | « 3 jours fériés à confirmer » | 10 §3.4 |
| G19 | **Retire or delete a product.** Warn when the page ranks; prefer pause or redirect; delete = 410 | Produits (effects preview) | « Cette page est 2e sur Google pour « paris-brest granby ». La mettre en pause plutôt? » | v0a §6.4 flow 2 |
| G20 | **No per-staff review numbers**, anywhere | Data model (no field) | — | 12 M2; 07 A10 |

---

## 6. Notifications and automations

### 6.1 Notifications to the team

Urgent push is limited to **4 types** (16a §6, A8). Quiet hours are set by the owner; the default is none during opening hours (design choice).

| Event | To | Channel | Tier | Expires when | Copy (fr-CA) |
|---|---|---|---|---|---|
| New order for **today** | On-duty device; the owner by SMS if no device has Studio open (16b §3) | Push + sound on the tablet; live list | **Urgent** | Seen on Aujourd'hui | « Nouvelle commande · cueillette 11 h 30 · 48,00 $ » |
| New cake request | Owner | Push + badge | **Urgent** | Answered | « Nouvelle demande · gâteau 40 pers. · sam. 8 nov. · répondre d'ici 24 h » |
| Review 1–3 ★ | Owner | Push | **Urgent** | Replied | « Avis 2★ sur Google · brouillon prêt » |
| Payment or deposit failed | Owner | Push | **Urgent** | Resolved | « Acompte non payé · demande de Julie T. · relancer? » |
| Due in 15 min, not ready | Tablet | In-app banner | Medium | Marked ready | « Julie arrive à 11 h 30 · pas encore prête » |
| Not picked up at closing | Owner + tablet | In-app + card | Medium | Decided | « 2 commandes non récupérées · décider » |
| Texto not delivered | Tablet + owner | In-app | Medium | Resolved | « Texto non livré à Julie T. · [Appeler] » |
| Printer offline | Tablet | In-app | Medium | Back online | « Imprimante hors ligne · [Ouvrir le PDF] » |
| Review 4–5 ★ | Owner | Card + daily digest | Low | Replied | « Avis 5★ · brouillon prêt » |
| Deposit received | Owner | In-app + digest | Low | — | « Acompte reçu · 54,00 $ · demande de Julie T. » |
| Integration error | Agency (owner card only if they must act) | Email / Agence | Medium | Fixed | « Google demande une reconnexion (2 min) » |
| Site down > 10 min | Agency first, then owner by SMS | External monitor SMS | System | Back up | « Coco Studio : le site ne répond plus depuis 10 min. L'agence est avertie. Les commandes reçues sont en sécurité. » (17 §8.2, adapted) |
| Daily summary (optional) | Owner | Push at a chosen time, or email | Digest | — | « Hier : 23 commandes · 612 $ · 1 avis » |
| Cette semaine | Owner | Email + push, Monday | Digest | — | 5 numbers · ≤ 3 actions |

### 6.2 Automations: automatic vs needs approval

| Event | Automatic (no tap) | Needs a human | Never automatic |
|---|---|---|---|
| Order paid (webhook only, 10 §4) | Confirmation email = contract copy + .ics; capacity reserved; production entry; live alert | — | Marking "paid" without the webhook |
| Day before pickup | Reminder texto (transactional, GSM-7) | — | — |
| « Marquer prête » | Texto after the undo window; tracker | The tap | — |
| Closing time | Unpicked → « Non récupérée » + texto; sold-out « pour aujourd'hui » resets at the next opening | Keep or cancel | Automatic refund or charge |
| Cut-off + 5 min | Production sheet snapshot (+ print if a printer exists) (10 §7) | — | — |
| Épuisé | Site availability, schema `SoldOut` | The tap | — |
| Vitrine photo | Compression, sizes, site block, facts-only alt text | « Publier »; Google post and IG Story drafts | AI alt text published without review |
| Fermeture | After confirmation: banner FR/EN/ES, online pause, Google special hours (API or task), textos after 60 s, refund timers, Apple/Bing tasks, auto-revert | Reason + duration + confirm | Moving confirmed orders without the customer |
| Holidays | Pre-loaded « à confirmer »; card at J-30 | Ouvert / Fermé per date | Publishing an unconfirmed date |
| Season | Pre-order windows open and close on the configured dates | Activating the season | — |
| New review | Language detection; draft in the reviewer's language (names stripped); 24 h timer; alert if ≤ 3 ★ | Publishing the reply | Asking anyone to edit or remove a review |
| Pickup completed | One review request planned under G6 | — | A review ask by SMS bundled with « prête »; filtering by satisfaction |
| Publish (page or product) | IndexNow; revalidation of the public process; sitemap (17 §2) | Publish (guards must pass) | Publishing with a failing guard |
| Product facts | Readiness checks | Price change (step-up); allergen verification | AI-written allergens |
| Quote | Recap from the request; expiry; provisional capacity hold released on expiry | Price + send | — |
| Refund | 15-day timer, red at day 10 | The refund (owner, step-up) | — |
| Monday 06:00 | rank-first runs; card generation; Monday email (17 §2.2) | Approving cards | AI summary at MVP |
| Nightly | Backups; payment reconciliation; retention deletes (allergy notes + 30 days, raw logs 90 days); monthly restore test (17 §8.4) | — | — |
| Device offline | Owner alert | — | Pausing or closing the shop |

---

## 7. Technical shape on admin.cocovanillegranby.com

```
browser (PWA, Safari/Chrome) ──HTTPS──► nginx  server admin.…  (X-Robots-Tag … always; limit_req on login; SSE unbuffered)
                                          └─► studio process (Next.js, APP_ROLE=studio)  /  → Studio screens · /admin → Payload « Avancé » · /api
                                                 │ Local API (user + overrideAccess:false)
public process (cocovanillegranby.com) ──► Postgres on the VPS ◄── worker (payload jobs:run: texto, email, GBP, IndexNow, rank-first intake)
                         orders written ──► NOTIFY orders_new ──► studio process ──► SSE to open screens · Web Push when closed · SMS backstop
```

| Decision | Choice | Reason | Source |
|---|---|---|---|
| Host | `admin.cocovanillegranby.com`, own nginx server block, same IP | Admin separate from the public site; host-only cookies never reach the public host | 16b §2.1, §2.3 |
| Process | A separate Node process from the same build as the public site, plus one jobs worker | An admin crash or leak can't take the site down; one codebase for one operator | 16b §2.1; 17 §1.1 |
| Routing | Studio at `/`, Payload admin at `/admin` (« Avancé »), `/api` on the admin host only; the public host returns 404 for `/admin`, `/studio`, `/api` | Daily jobs need task-first screens; Payload's admin is a list → edit → save CMS | 16b §0, §2.2; 16a A1 |
| Data | Payload 3 (pin from `npm view`; 3.92.x reported, UNVERIFIED (FC)) on Postgres on the owner's VPS, in Québec as the target [[FACT NEEDED: provider + city]]; hot counters as SQL tables | One schema, roles, drafts, versions, jobs; Loi 25 s.17 avoided for the main store if in Québec | 16b §1; 10 §2; 17 §0, §7 |
| Access | Every Studio call passes `user` + `overrideAccess: false` | Payload 3's Local API skips access control by default (UNVERIFIED (FC)) | 16b §4 #2 |
| Real time | SSE + Postgres LISTEN/NOTIFY; 30 s polling fallback; Web Push when closed; SMS to the owner as backstop | The public process writes orders, the studio process streams them | 16b §3, §6.4 |
| Offline | Manifest + service worker; IndexedDB outbox; flush on open, `online` and `visibilitychange`; idempotency keys server-side | No Background Sync in Safari (caniuse via 16b) | 16a §7; 16b §3 |
| Login | Owner passkey (+ TOTP backup); staff PIN on a shared device (a practicality choice, not a WCAG basis, UNVERIFIED (FC)); 12 h sessions; step-up for sensitive actions; 5 login attempts | No typed passwords at a floury counter | 16b §4; 16a E9 |
| No indexing | `X-Robots-Tag: noindex, nofollow, noarchive` on every response, error pages included (nginx `always`); admin robots.txt doesn't block; everything except login behind auth | Google must crawl a page to see its noindex | 16b §2.4, verification log #21 |
| Printing | Through the POS if it prints online orders; otherwise a Star CloudPRNT printer (model UNVERIFIED (FC)); always a PDF fallback | WebUSB, Web Serial and Web Bluetooth don't work in Safari | 16b §3 |
| Pickup check-in | 4-digit code or name search; QR with the native API where present, WASM otherwise | `BarcodeDetector` not on iOS Safari (UNVERIFIED (FC)) | 16b §3 |
| Camera | File input + client compression; the server makes the sizes | HEIC handling to check on an iPhone | 16b §3 |
| Deploys | Blue/green; open screens show « Reconnexion… » for a few seconds | Near-zero downtime on one host | 17 §4 |
| Caching | Admin responses `no-store, private` | Personal data | 17 §2.1 |
| Logs | Admin access log kept 30 days (staff IPs) | Loi 25 minimisation | 17 §8.3 |
| UI language | Studio strings in Québec French; EN per user. Payload admin French pack: verify | Work tools in French (07 F-6, Partly) | 16a §8; 16b §1 |
| JavaScript only | Subject to the half-day plain-JS Payload spike | Owner rule | 12 D5 |

---

## 8. MVP, acceptance criteria, ease-of-use test

### 8.1 Scope

| Area | **MVP** (with ordering, weeks 11–12) | v1.1 (≈ 4–8 weeks after launch, est.) | Later / on a trigger |
|---|---|---|---|
| Aujourd'hui | Timeline, statuses, 3 quick actions, ≤ 3 cards, order search | Verbs in search (« épuiser croissant », 16a P16) | — |
| Commandes | Tabs, detail, Prête/Remettre, bulk ready, phone order, production list + print/PDF, new-slot proposal, owner refund | Box labels (after the CFIA/MAPAQ answer, 07 A-4) | Corporate invoices |
| Vitrine | Photo of the day, sold-out with durations, « Reprendre hier » | Google post + IG Story drafts | — |
| Demandes | Card, price, deposit link, other date, refuse, recap with photo | Price-grid suggestion (once the grid exists) | Cake builder link (12 M24) |
| Avis | Full flow with the GBP API; without it: templates + copy + « J'ai répondu » | Facebook reviews | — |
| Boutique & heures | Hours, special hours, holiday planner, closure, busy mode, pause, capacity ±, NAP lock, sync status (site + schema automatic; Google by API or task) | Apple/Bing task checklist | — |
| Cette semaine | 5 numbers, ≤ 3 cards, Système tile, Monday email | Presence score (after 4 baselines) | AI-written summary |
| Plus | Produits (edit prices/sizes, verify allergens, photo, tax class with the accountant stamp) · Réglages (people + PINs, notifications, `/avis` target, deposit %, capacity defaults) · Conformité · Noter une question · Aide · link to Avancé | « Ajouter un produit » wizard (the agency uses Avancé until then) | Gift cards, contests |
| Agence | Gates and Scoreboard as read-only views of the report files; Intégrations; Système | Recherche, Visibilité IA, Mentions, Analytique | Battle map, snippet loop, own data, multi-tenant |
| Platform | PWA, offline outbox, SSE + push + SMS backstop, roles, passkey/PIN, audit log, noindex, French UI | EN UI for staff, if asked | ES UI |

Before the MVP (weeks 0–10): no Studio. The owner replies to reviews in Google's own app and sends facts to the operator by phone or email; holiday orders run on the request form + payment links (12 F11 states this for weeks 0–6; extended here to week 10 because Studio launches with ordering, 12 M20).

### 8.2 Acceptance criteria

| # | Criterion | Pass |
|---|---|---|
| AC1 | Every daily job (§1.2) can be done from a phone | 100 % (16a E1) |
| AC2 | Taps per flow, counted from Aujourd'hui | ≤ the §3.7 targets |
| AC3 | Targets | ≥ 48 × 48 px, ≥ 8 px apart; primary ≥ 64 px; axe: 0 violations of WCAG 2.2 2.5.8 (16a T6) |
| AC4 | Response to a tap | < 0.1 s on a mid-range phone (16a E4) |
| AC5 | Airplane mode mid-shift | 5 queued actions applied after reconnect; 0 lost; 0 duplicate textos (16a T4) |
| AC6 | Undo | Every single-tap change can be undone for ≥ 5 s; undoing inside the window sends nothing |
| AC7 | French | 100 % of Studio strings, alerts and printouts in Québec French; a native reviewer finds no France-French or anglicisms in the 50 most-seen strings (16a T7) |
| AC8 | Guards | Automated tests show publishing blocked for G1, G2, G3, G4 and G13 |
| AC9 | Audit log | 100 % of state changes carry person, device, time, before and after |
| AC10 | No indexing | Every admin response (200, 302, 401, 404, 502) carries `X-Robots-Tag`; the public host returns 404 for `/admin`, `/studio`, `/api` (16b §2) |
| AC11 | Alerts | ≤ 4 urgent push types; a new order for today reaches an open screen in ≤ 10 s, and the owner by SMS when no screen is open (target) |
| AC12 | Textos | Every FR/EN/ES template fits one GSM-7 segment and carries the sender + STOP (10 §6) |
| AC13 | Snowstorm drill | Banner live; Google special hours set or task created; 100 % of affected customers texted; auto-revert at the next opening (16a T5) |
| AC14 | Roles | Comptoir can't cancel, refund or change prices, allergens or taxes; Agence sees no customer names or phones by default |
| AC15 | Without the GBP API | Every daily job still completes, with Google as manual tasks (12 D4) |
| AC16 | Ease of use | Owner test (§8.3) passes; staff test 16a T1 passes |
| AC17 | Time budget, first 2 weeks live | Median owner Studio time ≤ 10 min per open day, from audit-log sessions (target) |

### 8.3 Ease-of-use test with the owner

- **Setup:** the owner's own phone, in the shop, at a quiet hour. Studio installed on the Home Screen; staging data (17 §5); one 5-minute tour, nothing more (design choice).
- **Method:** the facilitator reads each task aloud and stays silent; screen recording; taps and time counted.
- **Success:** the task is done **without help, within the time limit**, with at most one error recovered through « Annuler ». Any failed task is fixed and retested with a new scenario.
- The time limit for a first-time user is set above the daily target (design choice). The daily targets are re-checked after 2 weeks of real use (AC17).

| # | Task, as read to the owner | Starts at | Done when | Daily target | Test limit |
|---|---|---|---|---|---|
| T1 | « Il n'y a plus de croissants aux amandes. Faites-le savoir sur le site. » | Aujourd'hui | Item sold out for today | 2 taps / 5 s | 15 s |
| T2 | « La commande de Julie est prête. Prévenez-la. » | Aujourd'hui | Status Prête; texto queued | 1 tap / 3 s | 10 s |
| T3 | « Une demande de gâteau pour 20 personnes vient d'arriver. Envoyez un prix de 120 $ avec l'acompte. » | Push notification | Link sent after the recap preview | 3 taps + amount / 60 s | 90 s |
| T4 | « Tempête demain. Fermez la boutique toute la journée et prévenez les clients. » | Aujourd'hui | Closure for tomorrow confirmed after the preview | 5 taps / 30 s | 60 s |
| T5 | « Répondez à l'avis 5 étoiles de ce matin. » | Push or card | Reply published (or copied, without the API) | 2 taps / 30 s | 45 s |

Pass = 5/5 tasks. One question afterwards: « Sur 10, à quel point c'était facile? » (target ≥ 8; design choice).

---

## 9. Open questions for the owner

Blocking first.

1. Is the shop open, and is the Google profile not "temporarily closed"? Who has owner access to it? (01 §12 #1)
2. How many people work at the counter and in the kitchen? Who will use Studio? Does anyone need it in English?
3. Devices: the owner's phone (iPhone or Android)? A shared tablet at the counter, or phones only? (16a §12)
4. Which POS or payment terminal, and does it print online orders? (10 §14 #1: decides the processor and the printer)
5. Wi-Fi and phone signal in the kitchen and the back room?
6. Words: « cueillette » or « ramassage »? « acompte » or « dépôt »? (12 C22; 16a §8.2)
7. Customer messages: « tu » or « vous »? (10 §6; v0c §7)
8. Open days and hours, closed days, holiday plans (sets the pickup slots and the Monday 03:00 maintenance window; 01 §3; 17 §2.2)
9. Custom-cake requests per week today; is a 24 h answer realistic; who sets the price; is there a price grid?
10. Deposit %, cancellation deadline, quote validity, no-show rule (counsel too; 10 §14 #6)
11. Phone orders per day, and should they all go into Studio as one queue? (16a J11)
12. May staff close the shop or pause online orders, or only the owner?
13. Which events should push to your phone, and quiet hours?
14. Reviews: only you reply? OK to use AI drafts (sent to the Claude API in the US with names removed, so it needs a privacy assessment, 07 §2)?
15. At pickup: check the 4-digit code every time, or is the name enough?
16. A label printer now or later, and which items get a box label? (16a §12; 07 A-4)
17. Who is the person in charge of personal information? (07 P1)
18. The daily display-case photo: who takes it, and at what time?
19. Is the Monday summary by email fine? (WhatsApp is dropped, 12 M11)

---

## Verification queue (not searched: cap 0)

- Payload admin: is a French language pack included, and is it France-French? (16a §8.1 UNVERIFIED (FC); 16b §1)
- iPhone PWA: camera capture through a file input in standalone mode; HEIC → JPEG on upload (16b §3).
- GBP API: approval delay, reviews on a verified location, whether a reply can be deleted for undo (16b §5; 12 D4).
- Google review replies: publication delay (16a J9, UNVERIFIED (FC)).
- Web Push reliability for iOS Home Screen apps (16b §3: OneSignal reports of stopped deliveries).
- Star CloudPRNT on the chosen model (16b §3, UNVERIFIED (FC)).
- Payload 3 in plain JavaScript (12 D5).
- Counsel: phone orders under LPC 54.1+; CASL wording for transactional textos; the Charter's work-tool reading for Studio (07 F-6, lawyer Q4–Q6).
- WCAG 2.2 SC 3.3.8 and a remembered PIN (16a E9, UNVERIFIED (FC)).

## Sources

Internal (read 2026-10-25; facts carried with their original labels):

- research/16a-admin-ux-inspiration.md — /home/user/coco-vanille-granby/research/16a-admin-ux-inspiration.md
- research/16b-admin-tech-subdomain.md — /home/user/coco-vanille-granby/research/16b-admin-tech-subdomain.md
- research/17-vps-self-hosting-and-domain.md — /home/user/coco-vanille-granby/research/17-vps-self-hosting-and-domain.md
- research/10-ordering-tech-architecture.md — /home/user/coco-vanille-granby/research/10-ordering-tech-architecture.md
- research/07-legal-quebec-compliance.md — /home/user/coco-vanille-granby/research/07-legal-quebec-compliance.md
- research/02-customers-jtbd.md — /home/user/coco-vanille-granby/research/02-customers-jtbd.md
- research/11-offsite-local-citations.md — /home/user/coco-vanille-granby/research/11-offsite-local-citations.md
- research/12-plan-review.md — /home/user/coco-vanille-granby/research/12-plan-review.md
- research/01-business-facts.md — /home/user/coco-vanille-granby/research/01-business-facts.md
- research/06-seo-aeo-geo-2026-verified.md — /home/user/coco-vanille-granby/research/06-seo-aeo-geo-2026-verified.md
- research/18-dated-claims-verification.md (claim 8, iOS web push) — /home/user/coco-vanille-granby/research/18-dated-claims-verification.md
- Owner plans: plan-v0a-master-plan.md (Part 6), plan-v1-ranking-stack.md (§1, §4, §9–§12), plan-v0c-site-ux-ordering.md (§5–§6), requirements-2026-10-25.md — /home/user/coco-vanille-granby/research/
- data/seasonal-calendar.csv — /home/user/coco-vanille-granby/data/seasonal-calendar.csv

External, as cited by those files (not re-opened by this track):

- WCAG 2.2, SC 2.5.8 Target Size (Minimum) (W3C) — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (via 16a)
- Response Time Limits (NN/g) — https://www.nngroup.com/articles/response-times-3-important-limits/ (via 16a)
- Dashboards: Making Charts and Graphs Easier to Understand (NN/g) — https://www.nngroup.com/articles/dashboards-preattentive/ (via 16a)
- Confirmation Dialogs Can Prevent User Errors (NN/g) — https://www.nngroup.com/articles/confirmation-dialog/ (via 16a)
- Using Swipe to Trigger Contextual Actions (NN/g) — https://www.nngroup.com/articles/contextual-swipe/ (via 16a)
- Five Mistakes in Designing Mobile Push Notifications (NN/g) — https://www.nngroup.com/articles/push-notification/ (via 16a)
- Web Push for Web Apps on iOS and iPadOS (WebKit) — https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ (via 16a, 16b, 18)
- caniuse: Background Sync API — https://caniuse.com/background-sync (via 16b)
- caniuse: BarcodeDetector — https://caniuse.com/mdn-api_barcodedetector (via 16b)
- Contextual save bar (Shopify Polaris) — https://polaris.shopify.com/components/deprecated/contextual-save-bar (via 16a)
- Hotplate: Prep and pack — https://help.hotplate.com/articles/245855-prep-and-pack (via 16a)
- Owner.com: mark an item available or unavailable — https://help.owner.com/en/articles/11833514-how-to-mark-an-item-as-available-or-unavailable (via 16a)
- Uber Eats Orders app — https://merchants.ubereats.com/gb/en/resources/learning-center/uber-eats-orders-app/ (via 16a)
- Payload: Customizing Views — https://payloadcms.com/docs/custom-components/custom-views (via 16a, 16b)
- Payload: Respecting Access Control with Local API Operations (v3) — https://payloadcms.com/docs/v3/local-api/access-control.md (via 16b)
- Google: Block Search indexing with noindex — https://developers.google.com/search/docs/advanced/crawling/block-indexing (via 16b)
- nginx: ngx_http_headers_module (`add_header … always`) — https://nginx.org/en/docs/http/ngx_http_headers_module.html (via 16b)
- Google Business Profile APIs: Prerequisites — https://developers.google.com/my-business/content/prereqs (via 16b)
- GBP v4 reviews `updateReply` — https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/updateReply (via 16a)
