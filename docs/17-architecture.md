# Arborescence du site — Pâtisserie Coco Vanille (cocovanillegranby.com)

**Couche 9 de la méthode : une requête, une page; chaque page à trois clics ou moins de l'accueil; au moins trois liens internes vers chaque page.**

| | |
|---|---|
| Mis à jour | 29 octobre 2026 |
| Préparé par | Yahya (BrandHub.ma), l'Agence |
| Lu dans le site construit | `apps/web/src/lib/routes.js` (registre des pages), `apps/web/src/seed/content.js` (textes des pages), `apps/web/src/lib/publish.js` (verrou de publication), `apps/web/src/proxy.js` (règles d'adresse), rapport de contrôle du 28 octobre 2026 (`apps/web/reports/gate/`) |
| S'appuie sur | research/04 §2 (arbre P01 à P38), research/00 §5 (adresses retenues), plan-v1 §6, research/05 (requêtes et notes), `data/keywords.csv`, `data/prompts.csv`, research/12 (décisions M1 à M25); pour la page du Zoo et les spécialités marocaines : [research/22d](../research/22d-local-content.md) (29 octobre 2026) |
| À savoir | Une refonte visuelle est en cours. Les menus et le pied de page peuvent changer; les adresses des pages, non. Après la refonte, on recompte les liens (§4). |
| Voir aussi | [docs/14-calendrier-contenu.md](14-calendrier-contenu.md) (quand publier) · [docs/08-brief-page.md](08-brief-page.md) (comment écrire une page) · [docs/16-recherche.md](16-recherche.md) (la demande et les concurrents) · [docs/18-redirections.md](18-redirections.md) (règles d'adresse) |

Les mots utilisés dans ce document :
- **Requête** : ce que les gens tapent dans Google ou demandent à une IA (ChatGPT, Gemini, Copilot…). Chaque requête suivie a un code (L3, C1, I3…) et une note sur 20 qui mesure nos chances de gagner (research/05 §5 et W44.6; `scoreboard/prompts.csv`).
- **Sous-questions** (en anglais *fan-out*) : les questions qu'un moteur d'IA pose de lui-même derrière une requête. Chacune devient un intertitre de la page, ou une autre page; jamais une page presque identique.
- **Lien interne** : un lien d'une page du site vers une autre page du même site.
- **Fil d'Ariane** : la petite ligne « Accueil › Carte › Gâteaux » en haut d'une page.
- **[[FACT NEEDED: …]]** : une information que seule la boutique peut donner. Tant qu'il en reste une sur une page, cette page ne se publie pas.

---

## En bref

1. **Le site est construit, il n'est pas encore en ligne** (README, état du 26 octobre 2026). En production, le verrou de publication ne montre une page que si son texte, dans cette langue, ne contient plus aucune mention [[FACT NEEDED]]; une page anglaise ne s'ouvre que si sa version française est en ligne (Charte de la langue française, `publish.js`). Aujourd'hui, chaque page attend au moins une réponse : en production, aucune page ne serait publiée.
2. **Ce qui existe :** 21 pages de contenu en français, leurs 21 adresses anglaises (3 sans texte anglais pour l'instant) et 6 pages de produits par langue, soit 54 pages vérifiées par le contrôle du 28 octobre 2026; plus 3 pages utilitaires jamais indexées (boîte, paiement, merci). Le volet espagnol est fermé.
3. **Une réponse est nécessaire à toutes les pages :** le nom, le titre et le courriel de la personne responsable des renseignements personnels (Loi 25; question A4 de research/14). Ces informations sont dans le pied de chaque page : sans elles, aucune page ne peut être publiée proprement, même quand son propre texte est complet.
4. **Chaque page vise une requête principale** et répond à ses sous-questions dans ses intertitres (§3). La page prioritaire n° 1, « gâteau pour demain » (L3, 19 sur 20), est construite; elle attend l'heure limite et les formats.
5. **Les liens internes passent le contrôle :** chaque page reçoit au moins 5 liens internes, tout est à 2 clics ou moins de l'accueil, aucun lien cassé, aucune ancre du type « cliquez ici » (rapport du 28 octobre 2026). À recompter après la refonte et à chaque mise en ligne (§4).
6. **Couverture des sujets :** 25 des 34 groupes de mots-clés ouverts ont déjà une page ou une section (73,5 %; la méthode demande 80 % avant d'élargir); 46 des 60 questions de clients en français et en anglais ont leur réponse (76,7 %). Les pages prévues au §6 comblent l'écart (§5).
7. **Prévu le 29 octobre 2026** ([research/22d](../research/22d-local-content.md)) : une page « Depuis le Zoo de Granby » (`/nous-trouver/zoo-de-granby/`), enfant de Nous trouver, qui remplace la page « Visiter Granby » du §6; et, pour les spécialités marocaines, une question sur la carte et une ligne sur l'accueil, sans page. Ni l'une ni l'autre n'est encore dans le code (§1, §6).

---

## 1. L'arbre (français à la racine, anglais sous `/en/`)

Légende : **[prête]** = page construite qui attend des réponses de la boutique · **[conditionnelle]** = page construite, cachée tant que l'offre n'est pas confirmée · **[utilitaire]** = page de service, jamais indexée · **[prévue]** = page décidée et rédigée, pas encore dans le code.

```
/                                         Accueil : phrase de catégorie, bloc réponse, « Coco Vanille en bref », vitrine du jour  [prête]
├── /carte/                               Carte : les 4 familles, un lien vers chaque produit                                    [prête]
│   ├── /viennoiseries/                   Croissants et viennoiseries                                                          [prête]
│   │   └── /viennoiseries/croissant-aux-amandes/                                                                              [prête]
│   ├── /pains-baguettes/                 Pains et baguettes                                                                   [prête]
│   │   └── /pains-baguettes/baguette/                                                                                         [prête]
│   ├── /gateaux/                         Gâteaux de fête sur commande                                                         [prête]
│   │   ├── /gateaux/gateau-aux-framboises/ · /gateaux/shortcake-aux-fraises/                                                  [prête]
│   │   ├── /gateaux-personnalises-granby/   PILIER : gâteaux personnalisés                                                    [conditionnelle]
│   │   ├── /gateau-pour-demain/             Gâteau pour demain (la requête n° 1)                                              [conditionnelle]
│   │   ├── /buches-de-noel/                 Bûches de Noël (page permanente, saisonnière)                                    [conditionnelle]
│   │   └── /calculateur-portions-gateau/    Calculateur de portions (l'outil gratuit)                                        [conditionnelle]
│   └── /patisseries/                     Paris-Brest et pâtisseries                                                           [prête]
│       └── /patisseries/paris-brest/ · /patisseries/vol-au-vent/                                                              [prête]
├── /commander/                           Commander pour la cueillette                                                         [prête]
│   ├── /boite/  (et /boite/<jeton>/)     « Ma boîte »                                                                         [utilitaire]
│   ├── /commander/paiement/              Paiement (page sécurisée du processeur)                                              [utilitaire]
│   └── /commander/merci/                 Confirmation                                                                         [utilitaire]
├── /prix/                                Prix : tableau daté                                                                  [conditionnelle]
├── /nous-trouver/                        Adresse, heures, stationnement, Zoo de Granby                                       [prête]
│   └── /nous-trouver/zoo-de-granby/      Depuis le Zoo de Granby (trajet, autobus, stationnement)                            [prévue]
├── /a-propos/                            À propos : la source de vérité                                                       [prête]
│   └── /a-propos/chef/                   Le chef (avec son accord)                                                            [conditionnelle]
├── /allergenes/                          Allergènes (information, jamais « sans gluten »)                                     [prête]
├── /faq/                                 Questions fréquentes                                                                 [prête]
├── /confidentialite/ · /conditions-de-vente/ · /temoins/ · /accessibilite/    Pages légales (révision par un avocat)  [prête]
└── /page-introuvable/                    Vraie page 404, en français                                                          [prête]

Hors de l'arbre : /robots.txt · /sitemap.xml · /llms.txt · /avis/ (302 vers la page d'avis Google) · /og/<page> (images de partage)
                  /media/… (images) · /svc/… (services internes, exclus des robots)
```

Le fil d'Ariane suit le registre : par exemple Accueil › Carte › Gâteaux › Gâteau pour demain. Les menus et le pied de page relient directement les pages importantes, d'où une profondeur de 1 ou 2 clics (§4).

### 1.1 Toutes les pages, en français et en anglais

| # | Page | Adresse française | Adresse anglaise | Rôle | État dans le code | Condition de publication (registre) |
|---|---|---|---|---|---|---|
| 1 | Accueil | `/` | `/en/` | accueil | prête | — |
| 2 | Carte | `/carte/` | `/en/menu/` | centre de la carte | prête | — |
| 3 | Viennoiseries | `/viennoiseries/` | `/en/viennoiseries/` | famille de produits | prête | — |
| 4 | Pains et baguettes | `/pains-baguettes/` | `/en/bread/` | famille de produits | prête | — |
| 5 | Gâteaux | `/gateaux/` | `/en/cakes/` | famille de produits | prête | — |
| 6 | Pâtisseries | `/patisseries/` | `/en/pastries/` | famille de produits | prête | — |
| 7 | Gâteaux personnalisés | `/gateaux-personnalises-granby/` | `/en/custom-cakes-granby/` | pilier | conditionnelle | « Gâteaux sur commande confirmés (volume, délai, prix) » |
| 8 | Gâteau pour demain | `/gateau-pour-demain/` | `/en/cake-for-tomorrow/` (texte anglais à écrire) | page satellite | conditionnelle | « Commande pour le lendemain + heure limite confirmées » |
| 9 | Bûches de Noël | `/buches-de-noel/` | `/en/yule-logs/` (texte anglais à écrire) | saisonnière permanente | conditionnelle | « Bûches offertes (oui/non avant le 1er novembre) » |
| 10 | Calculateur de portions | `/calculateur-portions-gateau/` | `/en/cake-serving-calculator/` | outil gratuit | conditionnelle | « Portions par taille fournies par le propriétaire » |
| 11 | Prix | `/prix/` | `/en/prices/` | satellite commercial | conditionnelle | « Grille de prix du propriétaire » |
| 12 | Commander | `/commander/` | `/en/order/` | commande et cueillette | prête | — (la vente en ligne attend en plus les signatures de l'avocat et du comptable, research/00 §13, G10) |
| 13 | Nous trouver | `/nous-trouver/` | `/en/visit/` | page locale | prête | — |
| 13 bis | Depuis le Zoo de Granby | `/nous-trouver/zoo-de-granby/` | `/en/visit/granby-zoo/` | page locale pour les visiteurs du Zoo, enfant de Nous trouver | prévue ([research/22d](../research/22d-local-content.md) §1 : texte validé, ligne du registre prête) | aucune : la page n'a aucun fait manquant et se publie avec le site |
| 14 | À propos | `/a-propos/` | `/en/about/` | source de vérité | prête | — |
| 15 | Le chef | `/a-propos/chef/` | `/en/about/chef/` (texte anglais à écrire) | personne | conditionnelle | « Consentement photo + biographie du chef » |
| 16 | Allergènes | `/allergenes/` | `/en/allergens/` | information | prête | — |
| 17 | FAQ | `/faq/` | `/en/faq/` | questions fréquentes | prête | — |
| 18 | Confidentialité | `/confidentialite/` | `/en/privacy/` | légal (Loi 25) | prête | révision par un avocat |
| 19 | Conditions de vente | `/conditions-de-vente/` | `/en/terms-of-sale/` | légal (Loi sur la protection du consommateur) | prête | révision par un avocat |
| 20 | Témoins | `/temoins/` | `/en/cookies/` | légal | prête | révision par un avocat |
| 21 | Accessibilité | `/accessibilite/` | `/en/accessibility/` | légal (WCAG 2.2 AA visé) | prête | révision par un avocat |
| — | 6 produits | `/viennoiseries/croissant-aux-amandes/` · `/pains-baguettes/baguette/` · `/gateaux/gateau-aux-framboises/` · `/gateaux/shortcake-aux-fraises/` · `/patisseries/paris-brest/` · `/patisseries/vol-au-vent/` | `/en/viennoiseries/almond-croissant/` · `/en/bread/baguette/` · `/en/cakes/raspberry-cake/` · `/en/cakes/strawberry-shortcake/` · `/en/pastries/paris-brest/` · `/en/pastries/vol-au-vent/` | produit | prêtes | description, formats avec prix et portions, délai, allergènes vérifiés (`productReady`, `publish.js`) |
| — | Utilitaires | `/boite/` · `/commander/paiement/` · `/commander/merci/` | `/en/box/` · `/en/order/checkout/` · `/en/order/thanks/` | service | utilitaires | jamais indexées, hors du plan du site |

Les 6 produits sont ceux que des sources publiques nomment (research/01 §5) : croissant aux amandes, baguette, Paris-Brest, vol-au-vent, gâteau aux framboises, shortcake aux fraises. Aucun prix, aucune portion et aucun allergène n'est inventé : ces champs attendent la boutique.

**Espagnol :** 13 adresses espagnoles sont réservées dans le registre (par exemple `/es/`, `/es/pedidos/`, `/es/pasteles-personalizados-granby/`), mais aucune n'a de texte. Le volet reste fermé (réglage `ENABLE_ES`) tant que personne n'est nommé pour servir la clientèle en espagnol (research/14 L2). Ensuite : 3 à 5 pages seulement, écrites en espagnol par une personne qui le parle (décision M10; research/15 D3).

---

## 2. Ce qui manque, page par page

Le chiffre donne le nombre d'informations distinctes à fournir dans le texte de la page (français / anglais), lu dans `content.js` le 29 octobre 2026. Entre parenthèses : le numéro de la question dans research/14, où chaque question est expliquée.

**Pour toutes les pages :** nom, titre et courriel de la personne responsable des renseignements personnels (A4). Ces informations s'affichent dans le pied de chaque page; sans elles, aucune page ne peut être mise en ligne proprement (`infra/README.md`, points ouverts).

**Déjà en place, à approuver :** la phrase de catégorie de l'accueil, option B (« Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. »), en français, en anglais et en espagnol (`apps/web/src/seed/index.js`; research/15 D19; votre choix : research/14 S5); l'horaire de la fiche Google (research/14 H1).

| Page | FR / EN | Ce qui manque |
|---|---|---|
| Accueil | 5 / 5 | commande pour le lendemain et heure limite (P4) · livraison offerte ou non (O3) · stationnement (H5) · modes de paiement au comptoir (O5) · personne qui sert en anglais (L1) |
| Carte | 5 / 5 | liste complète des produits (P1) · produits saisonniers (P2, P10) · réservation de la vitrine (P14) · pains et baguettes congelés (P2) · cafés, prix et places assises (N3) |
| Commander | 6 / 7 | délais par produit et heure limite (P4) · pourcentage de l'acompte (O4) · commandes non récupérées (O4) · livraison (O3); en anglais, en plus : minutes en auto depuis le Zoo de Granby (calcul de l'Agence à partir du point de la boutique, une fois ce point vérifié, research/14 §13) |
| Nous trouver | 8 / 8 | repère pour trouver la porte et stationnement (H5) · minutes en auto depuis le Zoo (Agence) · courriel de la boutique (H4) · heures des Fêtes 2026 (H2) · places assises (N3) · accès en fauteuil roulant (H5, à préciser) · livraison (O3) |
| À propos | 7 / 7 | équipe et rôles, propriétaires, biographie et consentement photo (C1, D2) · date d'ouverture de la boutique (C2) · présence au Marché public en 2026 (S10) · produits faits sur place ou non (S8) · courriel (H4) |
| Le chef | 8 / pas de texte | nom, rôle, parcours, formation, spécialités, année d'arrivée, rencontres pour un gâteau, distinctions avec preuve datée, équipe de production (C1, C2) |
| Prix | 7 / 7 | grille de prix datée, plus petit format avec son prix et ses portions, prix en ligne et en boutique (P1) · suppléments de décor et de saveur (P9) · acompte (O4) · format et prix pour 20 portions (P7) |
| Gâteau pour demain | 5 / pas de texte | heure limite, formats et gâteaux offerts pour le lendemain, personnalisation possible, message sur le gâteau (P4, P9) |
| Gâteaux personnalisés | 12 / 12 | délais par type de gâteau (P4) · portions minimum et maximum, délai de réponse aux demandes, message, gâteaux à étages (P9) · acompte et modifications (O4) · prix de départ (P1) · thèmes, personnages, gâteau à écraser (P2, P11) · livraison (O3) |
| Bûches de Noël | 9 / pas de texte | bûches offertes en 2026 ou non, dates des précommandes et de la cueillette, prix, portions, saveurs, bûches glacées, liste d'attente (P3) |
| Allergènes | 4 / 4 | allergènes manipulés en cuisine et précautions contre la contamination croisée, liste des ingrédients, affichage en boutique (A1, A6) · produits faits sans lait ou sans œufs (A2) |
| FAQ | 9 / 9 | prix des gâteaux (P1) · portions (P7) · ateliers créatifs : thèmes, âges, durée, prix, dates (N2) · délais (P4) · acompte (O4) · livraison (O3) · stationnement (H5) · cartes-cadeaux (P2) · paiement à la cueillette (O5) |
| Calculateur | 5 / 5 | portions par format, format pour 20 portions, portions d'un gâteau de 8 po, taille d'une portion, plus grand format (P7) |
| Viennoiseries | 8 / 8 | liste et prix (P1) · heures de sortie du four (H6) · chocolatines (P2) · boîtes pour réunions (P12) · réservation pour le lendemain (P14) · cuisson le matin même (S8) |
| Pains et baguettes | 7 / 7 | liste et prix (P1) · heures de sortie du four (H6) · pain congelé (P2) · réservation (P14) · commandes en quantité (P12) |
| Gâteaux | 10 / 10 | liste, saveurs, décors, prix et portions (P1, P7) · délais et commande pour le lendemain (P4) · message, thèmes et personnages (P9, P11) · acompte (O4) · consignes de conservation des gâteaux à la crème (aucune question dans research/14 : à ajouter) |
| Pâtisseries | 8 / 8 | liste, prix, garnitures du Paris-Brest et du vol-au-vent (P1) · tartes (P2) · consignes de conservation (à ajouter à research/14) · commandes pour événements (P12) |
| Confidentialité | 8 / 8 | révision par un avocat (A5) · fournisseurs, pays de traitement et évaluations des facteurs relatifs à la vie privée (Agence et avocat) · ville du centre de données (T1) · délais et durées de conservation (avocat, comptable : A5) |
| Conditions de vente | 10 / 10 | révision par un avocat (A5) · courriel (H4) · numéros de TPS et de TVQ (A5) · acompte, annulation, remboursement, commandes non récupérées (O4 et avocat) · validité des soumissions (P9) · cartes-cadeaux (P2) |
| Témoins | 3 / 3 | révision par un avocat (A5) · outils de mesure retenus et durée des témoins (Agence) |
| Accessibilité | 6 / 6 | révision par un avocat (A5) · contrôle manuel au lecteur d'écran et limites connues (Agence) · courriel (H4) · accès en fauteuil roulant (H5) |
| 6 pages de produits | — | description de 40 à 60 mots, chaque format avec son prix et ses portions (P1, P7), délai de préparation (P4), allergènes vérifiés et datés par une personne (A1) |

**Mise à jour du 29 octobre 2026, après [research/21](../research/21-decisions-agence-2026-10-29.md) §6.1 et [research/22d](../research/22d-local-content.md).** Le stationnement (décision F1) et la distance du Zoo (F2) sont maintenant répondus sur l'accueil, Nous trouver, Commander (anglais) et la FAQ; le courriel (A2) et la livraison (A3) sont décidés; les places assises sont confirmées par les publications de la boutique, mais leur nombre manque. Prévu : la carte reçoit la question « Avez-vous des spécialités marocaines? », avec un marqueur pour les jours et les prix; la page du Zoo n'a aucun marqueur. Les nombres de la colonne « FR / EN » datent de la lecture du matin : à recompter quand les changements de research/22d §1.5 seront intégrés.

Ce que le contrôle du 28 octobre 2026 signale aussi sur les textes (`apps/web/reports/gate/audit.json`) :
- **Pages de produits trop courtes** (93 à 139 mots, bloc réponse de 9 mots, description de 115 à 128 caractères) : normal tant que la description du produit manque.
- **Trois pages anglaises sans texte** (`/en/cake-for-tomorrow/`, `/en/yule-logs/`, `/en/about/chef/`) : à écrire en anglais, par une personne anglophone, une fois la version française confirmée (§6).
- **Accueil :** un bloc de texte caché de plus de 15 mots est signalé (risque au regard de la règle de Google sur le texte caché). À vérifier pendant la refonte : un texte replié doit l'être dans un `<details>`.
- **Aucune citation d'une personne nommée** sur le site : elle viendra avec l'accord de la propriétaire ou du chef (C1).

---

## 3. La requête visée par chaque page, et ses sous-questions

### 3.1 Une requête principale par page

Les notes sur 20 viennent de research/05 W44.6 (mise à jour du 29 octobre 2026, relevés indirects des 25 et 29 octobre faits depuis les États-Unis; [scoreboard/prompts.csv](../scoreboard/prompts.csv)). Elles restent provisoires jusqu'à la mesure depuis Granby. Les priorités de mots-clés (élevée, moyenne, faible) sont des estimations, pas des volumes de recherche (research/04 §1).

| Page | Requête principale (code, note) | Autres requêtes suivies | Mots-clés liés (priorité estimée) |
|---|---|---|---|
| Accueil | X1 « pâtisserie Granby » (candidate, 18) · C1 « meilleure pâtisserie à Granby » (18) | C8 « best bakery in Granby Quebec » (17, EN) · B1 « Pâtisserie Coco Vanille Granby avis » (18) | pâtisserie granby (élevée) · boulangerie pâtisserie granby (moyenne) |
| Carte | X2 « boulangerie Granby » (candidate, 17) | X7 « croissants Granby » (18), X9 « Paris-Brest Granby » (15), X10 « vol-au-vent Granby » (16) (candidates) | coco vanille granby menu (faible) |
| Viennoiseries | X7 « croissants Granby » (candidate, 18) | L6 « chocolatines Granby » (18; chocolatines à confirmer) · X8 « croissant aux amandes Granby » (19) | croissant granby, chocolatine granby (moyennes) |
| Pains et baguettes | X2 « boulangerie Granby » (candidate, 17) | — | boulangerie granby (élevée) · boulangerie près de moi (élevée) · pain artisanal granby (moyenne) |
| Gâteaux | X3 « gâteau d'anniversaire Granby » (candidate, 18) | C2 « meilleur gâteau de fête à Granby » (18) | gâteau de fête granby (élevée, partagée avec le pilier : voir 3.3) |
| Pâtisseries | X9 « Paris-Brest Granby » (candidate, 15) | X6 « pâtisserie française Granby » (14) · X10 (16) | paris-brest granby (faible) |
| Gâteaux personnalisés (pilier) | X4 « gâteau personnalisé Granby » (candidate, 17) · C2 (18) | I2 délais (16) · I1 prix (16) · L9 « order custom cake online Granby » (16, EN) · X5 « gâteau sur mesure Granby » (17) | gâteau personnalisé granby (élevée) · gâteau de fête granby (élevée) |
| Gâteau pour demain | **L3 « gâteau pour demain Granby » (19)**, la n° 1 de research/05 W44.7 | I2 (16) · E19 « Can you make a cake for tomorrow? » | gâteau pour demain granby (moyenne) · gâteau dernière minute granby (faible) |
| Bûches de Noël | C4 « bûche de Noël Granby » (19; n° 1 en novembre et décembre seulement si les bûches sont confirmées) | — | bûche de noël granby (élevée en saison) · commander bûche de noël (moyenne) |
| Calculateur | I3 « quelle grosseur de gâteau pour 20 personnes » (17) | X13 « gâteau 8 pouces combien de portions » · X14 (EN) | combien de portions gâteau 8 pouces (moyenne) |
| Prix | I1 « combien coûte un gâteau de fête personnalisé à Granby » (16) | I8 (15, EN) | prix gâteau personnalisé granby (moyenne) · prix gâteau par portion (moyenne) |
| Commander | L2 « commander un gâteau de fête en ligne Granby » (15) | L9 (16, EN) | commander gâteau en ligne granby (moyenne) · livraison gâteau granby (moyenne : réponse « cueillette en boutique ») |
| Nous trouver | L1 « pâtisserie près de moi » (17) | B2 « Coco Vanille Granby heures » (19) · L4 « pâtisserie ouverte dimanche Granby » (18) · X12 « café pâtisserie centre-ville Granby » (15) · L5 et L8 passent à la page du Zoo (prévue) | pâtisserie près de moi (élevée) · café pâtisserie granby (moyenne) |
| Depuis le Zoo de Granby (prévue) | L5 « café et pâtisserie près du Zoo de Granby » (15) · L8 « bakery near Granby Zoo » (16) | la variante L8-quebec « bakery near Granby Zoo Quebec » | visiteurs du Zoo (moyenne; aucune suggestion de Google ne relie le Zoo à une pâtisserie, [research/22b](../research/22b-local-market-granby.md) §5) |
| À propos | B3 « Que sais-tu de la Pâtisserie Coco Vanille à Granby ? » (16) | B1 (18) | pâtisserie coco vanille granby, cocovanille granby (moyennes) |
| Le chef | B3 | X6 « pâtisserie française Granby » | — |
| Allergènes | C6 « gâteau sans gluten Granby » (17), répondue par l'information sur les allergènes, jamais par une allégation « sans gluten » (research/07 A-6, S10) | — | gâteau sans gluten granby (moyenne) |
| FAQ | les questions qui débordent des autres pages (research/02 §5) | B2 | — |
| Pages légales | aucune requête visée; le texte légal est marqué `data-nosnippet` pour qu'aucun moteur ne le cite comme réponse | — | — |

Une nouvelle donnée change une note : la fiche Google indique maintenant le dimanche ouvert, de 9 h 30 à 17 h (horaire relayé le 27 octobre 2026, research/01). La requête L4 « pâtisserie ouverte dimanche Granby », que research/05 jugeait perdue si la boutique fermait le dimanche, est passée de 17 à 18 et entre dans les 10 requêtes prioritaires (research/05 W44.6, W44.7) : elle se joue par `/nous-trouver/` et la fiche Google.

### 3.2 Les sous-questions des requêtes clés, et où elles reçoivent leur réponse

« Existe » = l'intertitre ou la question est déjà dans le texte construit. « À ajouter » = travail d'écriture prévu.

| Requête | Sous-question | Où est la réponse |
|---|---|---|
| L3 « gâteau pour demain Granby » | Est-ce possible? | `/gateau-pour-demain/`, intertitre « Peut-on avoir un gâteau pour demain à Granby? » (existe) |
| | Quels gâteaux? | intertitre « Quels gâteaux sont offerts pour le lendemain? » (existe; tableau des formats à ajouter quand P1 et P4 sont fournis) |
| | Jusqu'à quelle heure? | intertitre « Jusqu'à quelle heure commander pour demain? » (existe) |
| | Et pour aujourd'hui? | intertitre « Et si c'est pour aujourd'hui? » (existe : vitrine du jour et téléphone) |
| | Les jours de fermeture? | question « Peut-on commander pour un lendemain de fermeture? » (existe : fermé le lundi et le mardi) |
| | Combien ça coûte? | à ajouter : intertitre court et lien vers `/prix/` dès que la grille existe |
| X4 et C2, le pilier gâteaux personnalisés (plan-v1 §6) | Le prix | `/prix/` + intertitre « Combien coûte un gâteau personnalisé? » (existe) |
| | Le délai | intertitre « Combien de jours d'avance faut-il commander? » (existe) |
| | La grosseur pour X invités | `/calculateur-portions-gateau/` (existe; lien dans le texte du pilier à ajouter) |
| | Les saveurs et les finis | à ajouter quand la liste des saveurs est fournie (P1); la différence crème au beurre et ganache (I6) ira au glossaire prévu (§6) |
| | Le gâteau ressemblera-t-il à la photo? | intertitre « Est-ce que mon gâteau va ressembler à la photo? » (existe; c'est la crainte n° 1, research/02 §0.6) |
| | Les allergies | `/allergenes/` (existe; lien à ajouter dans le pilier) |
| | Le transport | page prévue `/transporter-conserver-gateau/` (§6) |
| | La livraison | question « Livrez-vous les gâteaux? » (existe : cueillette au 3, rue Court) + `/nous-trouver/` |
| C1 et X1 « pâtisserie Granby » | Que vend la boutique? | accueil, intertitre « Que vend la Pâtisserie Coco Vanille? » (existe) |
| | Peut-on commander en ligne? | accueil, « Peut-on commander en ligne pour la cueillette? » (existe) |
| | Où est-elle? | accueil, « Où se trouve la Pâtisserie Coco Vanille à Granby? » (existe) |
| | Pourquoi « Cocovanille »? | accueil, « Pourquoi voit-on aussi le nom « Cocovanille »? » (existe : les deux graphies) |
| | Est-elle ouverte aujourd'hui? | accueil, question « La Pâtisserie Coco Vanille est-elle ouverte aujourd'hui? » (existe) |
| | Qu'en disent les clients? | bloc « Coco Vanille en bref » : la note Google avec le nombre d'avis et la date, une fois lue directement sur Google (jamais de note « étoiles » auto-déclarée dans le balisage, research/15 R35) |
| | Est-ce la meilleure? | le site ne se dit jamais « la meilleure » (research/07 S12); ce sont les palmarès et la fiche Google qui gagnent cette requête ([docs/16-recherche.md](16-recherche.md) §7.3) |
| L1 « pâtisserie près de moi » et B2 « heures » | Heures | `/nous-trouver/`, tableau des heures et intertitre (existent) |
| | Comment s'y rendre | « Comment se rendre au 3, rue Court? » (existe) |
| | Stationnement | « Où se stationner près de la Pâtisserie Coco Vanille? » (existe, répondue le 29 octobre 2026 : stationnement municipal gratuit, Centre-Court à environ 100 m, [research/21](../research/21-decisions-agence-2026-10-29.md) F1) |
| | Distance du Zoo | « À quelle distance du Zoo de Granby est la boutique? » (existe, répondue le 29 octobre 2026 : environ 5 à 8 minutes en auto, F2); l'autobus, le stationnement et les règles du Zoo vont sur la page du Zoo (prévue) |
| | Ouvert le dimanche? Les Fêtes? | questions « Êtes-vous ouverts le dimanche? » et « … pendant le temps des Fêtes? » (existent) |
| I3 « grosseur de gâteau pour 20 personnes » | Comment ça marche | `/calculateur-portions-gateau/`, « Comment fonctionne le calculateur? » (existe) |
| | 20 personnes | « Quelle grosseur de gâteau pour 20 personnes? » (existe, attend P7) |
| | 8 pouces | « Combien de portions dans un gâteau de 8 pouces? » (existe) |
| | Qu'est-ce qu'une portion | « Qu'est-ce qu'une portion de gâteau? » (existe) |
| | 50 invités et plus | question « Et pour 50 invités ou plus? » (existe) |
| I1 « combien coûte un gâteau de fête » | Prix par format | `/prix/`, « Combien coûte un gâteau de fête? » (existe, attend P1) |
| | Prix par portion | « Combien coûte une portion de gâteau? » (existe) |
| | Taxes | « Les taxes sont-elles incluses dans les prix? » (existe : TPS et TVQ en sus, s'il y a lieu) |
| | Pourquoi ça varie | « Pourquoi le prix d'un gâteau personnalisé varie-t-il? » (existe) |
| C4 « bûche de Noël Granby » | Où, quand, combien, pour combien de personnes, qu'est-ce que c'est | `/buches-de-noel/`, cinq intertitres (existent, attendent P3) |

### 3.3 Deux pages pour « gâteau de fête » : une décision à prendre au lancement du pilier

Aujourd'hui, `/gateaux/` porte le titre « Gâteaux de fête sur commande à Granby » et le pilier `/gateaux-personnalises-granby/` porte « Gâteaux personnalisés à Granby ». Tant que le pilier est caché, il n'y a pas de concurrence. Quand le pilier s'ouvre, on fait le test de chevauchement de plan-v1 §6 : si « gâteau de fête Granby » et « gâteau personnalisé Granby » partagent au moins 6 de leurs 10 premiers résultats (relevé fait depuis Granby), une seule page vise « gâteau de fête » et l'autre change de titre et de premier paragraphe. On ne change pas d'adresse (research/04 §2; [docs/18-redirections.md](18-redirections.md)).

### 3.4 Parité français-anglais : quatre questions à aligner

La Charte de la langue française exige une version française au moins aussi complète que la version anglaise (research/07 F-2, S2). Sur quatre pages, quelques questions anglaises visent les visiteurs et n'ont pas leur jumelle française sur la même page :

| Page | Question en anglais seulement | Question en français seulement |
|---|---|---|
| Commander | « Can I pre-order pastries for pickup on the way to the Zoo? » | « Comment payer ma commande en ligne? » |
| Nous trouver | « Do you accept US dollars? » | « Livrez-vous à Bromont ou à Waterloo? » |
| FAQ | « Is there a bakery near the Granby Zoo? » | « Où se stationner près de la Pâtisserie Coco Vanille? » |
| Calculateur | « What size cake do I need for 30 guests? » | « Comment commander le format proposé? » |

Proposition : ajouter en français les questions des visiteurs (Zoo, cartes et dollars américains, 30 invités), pour que le français couvre tout ce que couvre l'anglais. À faire avec la refonte du texte, et à confirmer avec l'avocat (research/07 §8).

**Prévu ([research/22d](../research/22d-local-content.md) §1.5, validé le 29 octobre 2026)** : la question anglaise du Zoo de `/en/order/` passe à la page du Zoo, dans les deux langues, et l'anglais reçoit la jumelle de « Comment payer ma commande en ligne? »; « Do you accept US dollars? » reçoit sa jumelle française sur `/nous-trouver/`, et « Livrez-vous à Bromont ou à Waterloo? » sa jumelle anglaise; « Is there a bakery near the Granby Zoo? » devient une section de `/faq/` dans les deux langues, et l'anglais reçoit la jumelle de la question sur le stationnement. Reste à aligner : le calculateur.

---

## 4. Les liens internes

### 4.1 Ce que le site fait déjà (lu dans le code)

| Endroit | Liens |
|---|---|
| En-tête, sur chaque page | sur ordinateur : Carte · Gâteaux sur commande (le pilier) · Commander · Nous trouver · À propos; dans le menu du cellulaire : Carte · Gâteaux sur commande · Nous trouver · À propos · Prix · FAQ, et le bouton « Commander »; l'adresse mène à `/nous-trouver/`. Seules les pages publiées apparaissent |
| Barre du bas sur cellulaire | Appeler · Itinéraire · Commander · Carte · Écrire (clavardage « Écrivez-nous ») |
| Pied de page, sur chaque page | « Découvrir » : Gâteaux personnalisés, Gâteau pour demain, Bûches de Noël, Calculateur de portions, Prix, FAQ, Allergènes, Le chef · « Informations légales » : les 4 pages légales · adresse vers `/nous-trouver/` |
| Accueil, « Par où commencer? » | les 4 familles + Commander, Gâteaux personnalisés, Prix, FAQ, Nous trouver; « Voir toute la carte » |
| « À consulter aussi » | sous une page, les pages qui en dépendent : la Carte mène aux 4 familles; Gâteaux mène au pilier, au gâteau pour demain, aux bûches et au calculateur; À propos mène au chef |
| Carte et familles | une rangée de pastilles vers chaque famille; chaque famille relie ses produits |
| Fil d'Ariane | chaque page relie ses pages parentes |
| Page 404 | Accueil, Carte, Commander, Nous trouver, FAQ |

Règle déjà codée : en production, le site ne fait jamais de lien vers une page qu'il cache (`publish.js`). Un lien vers une page conditionnelle n'apparaît donc qu'au jour de sa publication.

### 4.2 Le contrôle du 28 octobre 2026

Fait par `apps/web/scripts/gate.mjs` en mode aperçu (toutes les pages affichées), 54 pages :

| Type de page | Liens internes reçus (pages différentes) | Profondeur |
|---|---|---|
| Accueil, pages du menu et du pied de page (y compris les pages conditionnelles et légales) | 27, soit toutes les pages de la même langue | 1 clic |
| Gâteaux | 12 | 1 clic |
| Pâtisseries | 8 | 1 clic |
| Viennoiseries, Pains et baguettes | 7 | 1 clic |
| Produits | 5 à 7 (le vol-au-vent : 5) | 1 ou 2 clics |

Aucun lien cassé et aucune ancre générique. La règle « au moins 3 liens entrants » est respectée partout, en aperçu. **En production, le compte sera plus bas** au début, parce que seules les pages publiées se relient entre elles. On recompte après la refonte, puis à chaque mise en ligne d'une page (`node apps/web/scripts/gate.mjs` ou `node tools/links.mjs` sur le site rendu).

### 4.3 Les liens à ajouter dans le texte (prévu, après la refonte)

Le texte nomme souvent une autre page (« la page Commander », « la page Allergènes », « le calculateur de portions ») sans faire de lien. Ces liens dans le corps du texte comptent plus qu'un menu, parce qu'ils disent au moteur de quoi parle la page visée. Proposition pour les ingénieurs, une fois la refonte terminée :

| Depuis | Vers | Texte du lien (ancre) |
|---|---|---|
| Accueil, question « Peut-on avoir un gâteau pour demain? » · Gâteaux et Commander, question « C'est-tu possible d'avoir un gâteau pour demain? » · FAQ (question à ajouter) | `/gateau-pour-demain/` | « gâteau pour demain » |
| FAQ, « Combien coûte un gâteau de fête? » · Gâteaux, « Combien coûte un gâteau d'anniversaire? » · Carte, « Les prix sont-ils affichés sur la carte? » · Pilier | `/prix/` | « prix des gâteaux par format » |
| Gâteaux, « Quelle grosseur de gâteau choisir pour mes invités? » · FAQ, « Quelle grosseur de gâteau pour 20 personnes? » · Prix · Pilier | `/calculateur-portions-gateau/` | « calculateur de portions » |
| Commander, « Comment commander un gâteau personnalisé? » · Gâteaux · FAQ · Accueil | `/gateaux-personnalises-granby/` | « gâteau personnalisé » |
| Accueil, question sur le sans gluten · Carte, « Où voir les allergènes de chaque produit? » · chaque famille | `/allergenes/` | « allergènes de chaque produit » |
| Accueil, « Où se trouve la Pâtisserie Coco Vanille à Granby? » · FAQ, heures et stationnement · À propos | `/nous-trouver/` | « heures et stationnement » ou « nous trouver au 3, rue Court » |
| Accueil, Carte, Nous trouver, Gâteaux | `/commander/` | « commander en ligne pour la cueillette » |
| Nous trouver (section du Zoo) · Accueil (« Où se trouve… ») · FAQ (nouvelle section sur le Zoo) · Pâtisseries (question sur le salé) : prévu | `/nous-trouver/zoo-de-granby/` | « Depuis le Zoo de Granby » ([research/22d](../research/22d-local-content.md) §1.6) |
| Gâteaux et Carte, en saison seulement | `/buches-de-noel/` | « bûches de Noël » |

### 4.4 Les règles

- Le jour où une page est publiée, elle reçoit au moins 3 liens dans le texte de pages déjà en ligne (de préférence celles qui reçoivent déjà des visites, Search Console › Pages).
- Une page satellite relie son pilier et deux pages sœurs; le pilier relie chaque satellite depuis la section qui pose sa sous-question (méthode, couche 9.3).
- L'ancre décrit la page visée, dans la langue de la page. Jamais « cliquez ici », « en savoir plus » ou « ici ».
- Aucun lien vers une page cachée ou vers une page de service (boîte, paiement).
- Chaque mois : ajouter des liens depuis les pages qui se classent déjà vers celles qui doivent se classer ensuite.

---

## 5. La carte des sujets (couverture)

**La règle de la méthode :** avant d'élargir à une nouvelle catégorie, au moins 80 % des sujets de la catégorie doivent avoir une page ou une section. L'univers des sujets, ici, ce sont les 43 groupes de mots-clés de `data/keywords.csv` (220 mots-clés) et les 88 questions de la banque de research/04 §5. Il manque deux sources que la méthode demande : la récolte des « Autres questions posées » de Google depuis Granby (research/04 V5), à faire par l'Agence avec la personne de Granby; et l'intégration à ce calcul de l'analyse des sites concurrents, faite le 29 octobre 2026 avec `tools/crawl.mjs` sur 4 sites ([docs/19 §2.1](19-marche-et-concurrence.md)), mais pas encore comparée sujet par sujet à cette carte.

| État | Groupes | Mots-clés | Lesquels |
|---|---|---|---|
| Une page construite les couvre | 16 | 115 | marque, catégorie, « près de moi », heures, gâteaux personnalisés, gâteaux de fête, gâteau pour demain, commande en ligne, prix, portions, gâteaux de la carte, viennoiseries, pains, pâtisseries, bûches, allergies (comme information) |
| Une section ou une question d'une page construite | 9 | 34 | gâteaux d'enfants, gâteau à écraser, transport et conservation (en partie), boîtes pour le bureau, prêt-à-manger (vol-au-vent), cadeaux, visiteurs du Zoo (une page prévue, research/22d), livraison, avis |
| Page ou section prévue (les pages de fête attendent aussi la confirmation de leurs produits) | 9 | 29 | comparatif, saveurs et finis (glossaire), Saint-Valentin, Pâques, fête des Mères, fête des Pères, saisons d'été et d'automne, grandes occasions (baptême, communion…, une section du pilier) |
| En attente d'un produit confirmé | 7 | 38 | mariages, macarons, petits gâteaux (cupcakes), desserts québécois, galette des rois, temps des sucres, volet espagnol |
| Exclus volontairement | 2 | 4 | gâteaux glacés, gâteaux crus véganes et beignes (marchés d'autres commerces, research/04 §0.9); « tout sur la vanille » (aucune spécialité vanille prouvée, research/12 A5) |

Résultat (calcul fait le 29 octobre 2026 sur `data/keywords.csv`) :
- **Groupes ouverts couverts : 25 sur 34, soit 73,5 %.** Sous le seuil de 80 %. Les pages prévues au §6 (comparatif, glossaire, pages de fête, saisons) et une section « grandes occasions » dans le pilier couvrent les 9 groupes manquants; les pages de fête n'ouvrent que si leurs produits sont confirmés.
- **Mots-clés ouverts couverts : 149 sur 178, soit 83,7 %.** Les 8 mots-clés de priorité élevée ont tous leur page; il manque 4 mots-clés de priorité moyenne, tous saisonniers (gâteau Saint-Valentin, gâteau et chocolat de Pâques, gâteau fête des Mères).
- **Questions de clients** (FR et EN, 72 questions) : 46 ont leur réponse dans une page construite (63,9 %), 14 attendent une page prévue, 12 attendent un produit. Hors produits à confirmer : **46 sur 60, soit 76,7 %**. Les 16 questions en espagnol attendent l'ouverture du volet espagnol.
- **Construit ne veut pas dire en ligne :** plusieurs pages qui couvrent ces sujets sont conditionnelles et restent cachées tant que la boutique n'a pas confirmé l'offre (§2).

---

## 6. Les pages encore à créer

Chaque page part d'un brief ([docs/08-brief-page.md](08-brief-page.md)) et prend sa place dans le calendrier ([docs/14-calendrier-contenu.md](14-calendrier-contenu.md)). Une page de fête ou de produit n'existe que si la boutique vend vraiment le produit (research/14 P2). Les adresses ci-dessous viennent de research/04 §2 et research/00 §5; aucune n'a encore été créée dans le code.

| Page | Adresse FR · EN | Pourquoi | Condition | Au plus tard |
|---|---|---|---|---|
| Saint-Valentin | `/saint-valentin/` · `/en/valentines-day/` | mot-clé « gâteau saint-valentin granby » (moyenne) | produits de la Saint-Valentin confirmés (P2) | dimanche 20 décembre 2026 (8 semaines avant le dimanche 14 février 2027) |
| Pâques | `/paques/` · `/en/easter/` | « gâteau de pâques granby », « chocolat de pâques granby » (moyennes) | produits de Pâques confirmés | dimanche 31 janvier 2027 (Pâques : dimanche 28 mars 2027, calculé) |
| Temps des sucres | `/temps-des-sucres/` · `/en/maple-season/` | « pâtisserie érable granby » (faible) | produits à l'érable confirmés | lundi 1er février 2027 (plan-v1 §14) |
| Fête des Mères | `/fete-des-meres/` · `/en/mothers-day/` | « gâteau fête des mères granby » (moyenne) | produits confirmés | dimanche 14 mars 2027 (fête le dimanche 9 mai 2027) |
| Fête des Pères | `/fete-des-peres/` · `/en/fathers-day/` | « gâteau fête des pères » (faible) | produits confirmés | dimanche 25 avril 2027 (fête le dimanche 20 juin 2027) |
| Saisons (été et automne) | `/saisons/` · `/en/seasons/` | fête nationale, fête du Canada et Halloween en sections, pas en pages minces (research/04 P32) | une offre réelle par saison | jeudi 29 avril 2027 (8 semaines avant le jeudi 24 juin 2027); section Halloween avant le dimanche 5 septembre 2027 |
| Transporter et conserver un gâteau | `/transporter-conserver-gateau/` · `/en/cake-transport-storage/` | I4 (16) et I7 (15); pages en tête faibles (fermes de contenu) | consignes de la boutique + une source officielle de salubrité [[FACT NEEDED: guide MAPAQ ou Santé Canada avec son adresse]] | après le lancement, rythme d'une page par semaine (semaine du lundi 8 février 2027 au calendrier) |
| Comparatif honnête | `/comparatif-gateau-de-fete-granby/` · `/en/birthday-cake-options-granby/` | C1 et C2 (18 chacune); on compare des types d'options (épicerie, gâteau glacé, pâtisserie, boulangère à domicile), avec critères et date | relecture d'un avocat (Loi sur la concurrence, Loi sur la protection du consommateur; research/12 §5.1) | brouillon remis à l'avocat la semaine du lundi 15 février 2027 |
| Glossaire de pâtisserie | `/journal/glossaire-patisserie/` · `/en/journal/pastry-glossary/` | I6 (13), crème au beurre ou ganache, pièce montée, gâteau mousse | aucune | après les pages de saison (2e vague, research/04 P36) |
| Gâteaux d'enfants | `/gateaux-enfants/` · `/en/kids-birthday-cakes/` | « gâteau de fête enfant granby » (moyenne) | gâteaux thématiques confirmés + politique sur les personnages (P2, P11) | quand la boutique confirme |
| Depuis le Zoo de Granby (remplace « Visiter Granby ») | `/nous-trouver/zoo-de-granby/` · `/en/visit/granby-zoo/` (l'ancienne idée `/en-visite-a-granby/` est abandonnée) | L5 (15) et L8 (16); les deux conditions de research/00 §5.1 existent maintenant : la distance (research/20c Z-8) et l'offre du café, sur place ou à emporter (research/20b S-14 à S-16) | **prévue** : texte validé, aucun fait manquant ([research/22d](../research/22d-local-content.md) §1). Une seule page de lieu : jamais d'autre page pour un lieu ou une ville, jamais « Zoo » dans le nom de la fiche Google; aucune offre pour les visiteurs inventée (P16 reste ouverte) | avec le site; rafraîchie au plus tard le samedi 1er mai 2027 ([docs/14](14-calendrier-contenu.md)) |
| Spécialités marocaines | pas de page : une question sur `/carte/` et `/en/menu/`, et une ligne dans la liste « Que vend… » de l'accueil | la boutique les annonce (publication du 25 août 2026, research/20b S-13); aucune demande mesurée à Granby (research/22b §2, §5) | **prévue** : la question garde un marqueur pour les jours et les prix ([research/22d](../research/22d-local-content.md) §2); une section datée sur `/carte/` quand la boutique répond; une page seulement si Search Console montre des impressions pour « msemmen » ou « harcha » près de Granby | quand la boutique répond |
| Boîtes pour le bureau | `/boites-bureau-corporatif/` · `/en/corporate/` | L7 (17) | offre confirmée (P12) | dimanche 1er août 2027 (rentrée) si l'offre existe |
| Ateliers créatifs | adresse à fixer (proposition : `/ateliers/`) | la boutique annonce des « ateliers créatifs sur réservation » (bio Facebook, relayée le 27 octobre 2026) | thèmes, âges, durée, prix, dates (N2) [[FACT NEEDED: demande de recherche inconnue, aucun mot-clé dans data/keywords.csv]] | quand N2 est répondue |
| Textes anglais manquants | `/en/cake-for-tomorrow/` · `/en/yule-logs/` · `/en/about/chef/` | les adresses existent sans texte | version française confirmée + relecture par une personne anglophone (research/14 M2) | avec la version française |
| Volet espagnol | 3 à 5 pages parmi les 13 adresses réservées | communauté réelle mais petite (research/01 §9.4) | une personne qui sert en espagnol (L2) | seulement après L2 |
| Gelées (attente d'un produit) | mariages, quinceañera, macarons, boîtes-cadeaux, carte-cadeau, prêt-à-manger, desserts québécois, boîtes pique-nique, galette des rois | pas de preuve de l'offre (research/01 §5) | confirmation de la boutique; mariages : capacité (étages, livraison, montage) | aucune date |
| Abandonnées | `/sans-gluten-allergies/` (remplacée par `/allergenes/`), `/journal/tout-sur-la-vanille/`, pages « villes » sans boutique ni livraison | allégation encadrée ou sans preuve; pages satellites d'entrée interdites | — | jamais |

---

## 7. Les règles d'adresse

- Minuscules, mots français sans accents, traits d'union, mots de la catégorie; jamais d'année dans l'adresse (`/buches-de-noel/`, pas `/buches-2026/`; research/04 §3.2).
- Toujours une barre oblique à la fin : une adresse sans elle reçoit une redirection 301 vers la bonne (`proxy.js`). Un seul hôte, `https://cocovanillegranby.com` (sans www). Détails : [docs/18-redirections.md](18-redirections.md).
- Le français à la racine (`/`), l'anglais sous `/en/`, l'espagnol sous `/es/` quand il ouvrira. Aucune redirection automatique selon la langue du navigateur ou l'adresse IP (research/15 D2; Charte de la langue française).
- Le sélecteur de langue mène à la page équivalente, jamais à l'accueil de l'autre langue.
- hreflang : seulement les équivalents qui existent vraiment, plus `x-default` vers le français (décision M9). Une page sans version anglaise publiée sort de l'ensemble.
- Les produits vivent sous leur famille : `/<famille>/<produit>/` (par exemple `/viennoiseries/croissant-aux-amandes/`).
- Une adresse se fixe une fois. Tout changement passe par une redirection 301 inscrite dans [docs/18-redirections.md](18-redirections.md).
- Aucune adresse ne contient « cueillette » ni « ramassage » : le choix du mot (research/14 L3) ne touche pas les adresses.

---

## 8. Où vivent les pages

| Quoi | Où |
|---|---|
| La liste des pages, leurs adresses FR, EN, ES, leur parent et leur condition | `apps/web/src/lib/routes.js`, tableau `PAGES` |
| Les textes de départ (titre, description, h1, bloc réponse, intertitres, FAQ, note de changement) | `apps/web/src/seed/content.js`, puis la collection « pages » de Payload, modifiable dans Coco Studio |
| Les produits, leurs formats, prix, portions et allergènes | collection « produits » de Payload, dans Coco Studio |
| Le verrou de publication (marqueurs, français d'abord, produits complets) | `apps/web/src/lib/publish.js` |
| Le plan du site, robots.txt et llms.txt | générés par le site : `/sitemap.xml`, `/robots.txt`, `/llms.txt` |
| Le contrôle (contrat de page, liens, marqueurs) | `apps/web/scripts/gate.mjs`; rapports dans `apps/web/reports/gate/` |

---

## Sources

- Code lu le 29 octobre 2026 : `apps/web/src/lib/routes.js`, `apps/web/src/seed/content.js`, `apps/web/src/seed/index.js`, `apps/web/src/lib/publish.js`, `apps/web/src/lib/public-paths.js`, `apps/web/src/proxy.js`, `apps/web/src/components/site/Header.js`, `Footer.js`, `Related.js`, `StickyBar.js`, `apps/web/src/components/templates/home.js`, `apps/web/src/components/catalogue/CategoryNav.js`.
- Rapport de contrôle du 28 octobre 2026 : `apps/web/reports/gate/links.json`, `audit.json`, `owner-todo.md`.
- README.md (« The app », état du 26 octobre 2026); `infra/README.md` (points ouverts).
- research/04 §2, §3, §5; research/05 §5, §6; research/00 §5; research/02 §0, §5; research/07 F-2, S2, S10, S12; research/12 §3 et §5; research/14; research/15 D2, D3, D19; plan-v1 §6.
- research/22d (§0 à §3 : page du Zoo, spécialités marocaines, banque de questions locales, 29 octobre 2026); research/21 §6.1 (stationnement, Zoo); research/20b S-13 à S-16; research/20c Z-8.
- `data/keywords.csv`, `data/prompts.csv` (calculs de couverture refaits le 29 octobre 2026).
