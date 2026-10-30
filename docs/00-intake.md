# Fiche d'entrée — Pâtisserie Coco Vanille (pâtisserie-boulangerie et café, Granby)

Créée le jeudi 29 octobre 2026 par l'agence (Yahya, BrandHub.ma, rôle « Agence » dans Coco Studio).
Elle résume ce qu'on sait de l'entreprise, d'où vient chaque fait et ce qui manque encore.

- **Sources :** [data/facts.json](../data/facts.json) (état au 25 octobre 2026, mis à jour le 27 octobre 2026), [research/01-business-facts.md](../research/01-business-facts.md), [research/14-owner-questions.md](../research/14-owner-questions.md), [research/15-decisions-and-risks.md](../research/15-decisions-and-risks.md).
- **Règle :** un fait qui manque reste écrit `[[FACT NEEDED: …]]`. Le site refuse de publier une page qui en contient un (garde de publication `PUBLISH_GUARD=strict`, [infra/README.md](../infra/README.md)). Rien n'est « rempli » avec un chiffre plausible.
- **Limite de la recherche :** les recherches Web ont été faites depuis les États-Unis, à partir de résumés de résultats ; aucune page n'a été ouverte directement (méthode de [research/01](../research/01-business-facts.md)). Votre confirmation a toujours le dernier mot.

Documents liés : [docs/01-plan-90-jours.md](01-plan-90-jours.md) · [docs/10-handover.md](10-handover.md) · [docs/11-contrat-clauses.md](11-contrat-clauses.md) · [docs/13-taches-humaines.md](13-taches-humaines.md).

## Comment lire les étiquettes

| Étiquette | Ce qu'elle veut dire |
|---|---|
| **vérifié** | Au moins deux sources indépendantes, ou une source officielle, disent la même chose |
| **vérifié (publié par la boutique, transmis)** | Copié de votre fiche Google ou de votre bio Facebook par Yahya le 27 octobre 2026 |
| **conflit** | Les sources ne disent pas la même chose (toutes sont listées dans research/01) |
| **non vérifié** | Une seule source non officielle, ou une déduction |
| **(est.)** | Une estimation de l'agence, pas un fait |
| **`[[FACT NEEDED: …]]`** | Seul le propriétaire (ou un professionnel) peut le fournir |

## Les mots techniques en une ligne

| Mot | Ce que ça veut dire ici |
|---|---|
| **SEO** | Être trouvé dans les résultats de Google et de Bing |
| **AEO** | Être *la* réponse affichée directement : l'encadré en haut de Google, « Autres questions posées », la réponse vocale |
| **GEO** | Être cité par les moteurs d'IA : ChatGPT, Perplexity, Gemini, Claude, Copilot, et l'Aperçu IA ou le Mode IA de Google |
| **Profil d'entreprise Google (la fiche)** | La fiche de la pâtisserie dans Google Maps et dans la recherche (heures, photos, avis) |
| **Bloc local** | Les trois fiches que Google affiche sur la carte pour une recherche comme « pâtisserie près de moi » |
| **Question suivie** (ou requête suivie) | Une recherche type qu'on mesure chaque semaine (33 au total, [scoreboard/prompts.csv](../scoreboard/prompts.csv)) |
| **Search Console / Bing Webmaster Tools** | Les tableaux de bord gratuits où Google et Bing montrent comment ils voient le site |
| **GA4** | Google Analytics 4, l'outil qui compte les visites ; il ne fonctionne qu'avec le consentement du visiteur (Loi 25) |
| **Robots d'indexation** | Les programmes de Google, de Bing et des IA qui lisent le site |
| **Données structurées** | Des étiquettes invisibles qui disent aux moteurs « ceci est une boulangerie, voici l'adresse, voici les heures » |
| **NAP** | Nom, adresse, téléphone : identiques partout, au caractère près |
| **Porte (gate)** | Une vérification qui doit réussir avant de passer à l'étape suivante |
| **Coco Studio** | L'outil de gestion de la boutique, à admin.cocovanillegranby.com |

---

## 1. La phrase de catégorie (couches 1 et 7)

Une phrase, sans adjectif, qui dit ce qu'est l'entreprise. Elle ouvre la page d'accueil, la page À propos, la description de la fiche Google et chaque profil.

| Option | Français (fr-CA) | Anglais (en-CA) | Statut |
|---|---|---|---|
| **B, par défaut (en ligne sur le site construit)** | « Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. » | "Pâtisserie Coco Vanille is a pastry shop and bakery in downtown Granby: viennoiseries, bread and cakes to order." | Choisie par défaut (décisions D19 et M15, [research/15](../research/15-decisions-and-risks.md)) parce que les preuves montrent une pâtisserie-boulangerie avec un petit café |
| A | « Pâtisserie Coco Vanille est une pâtisserie de gâteaux sur commande pour les anniversaires et les fêtes à Granby. » | "Pâtisserie Coco Vanille is a Granby pastry shop that makes cakes to order for birthdays and celebrations." | Seulement si les gâteaux sur commande dépassent le seuil de revenus que vous fixez et que la capacité et les délais sont connus ([research/01 §11](../research/01-business-facts.md)) |

- **Votre choix :** `[[FACT NEEDED: option A ou B, ou la part des revenus qui justifierait A (research/14 S5)]]`.
- **Aucun des deux ne parle de mariages** : aucune preuve publique d'une offre de gâteaux de mariage ([research/01 §5](../research/01-business-facts.md)).
- **Test des concurrents** (pouvoir nommer ceux qui répondent à la même phrase) : pour B, on peut nommer Mont Rose Pâtisserie & Café, Mélisse Pâtisserie, La Mie Bretonne et Café ORÉE Pâtisserie (§5 et [scoreboard/competitors.csv](../scoreboard/competitors.csv)). Le test passe.
- L'espagnol n'est pas publié tant que personne ne sert la clientèle en espagnol (décision M10).

## 2. Accès et propriété des comptes (couche 20.2) : la boutique possède, l'agence gère

Règle sans exception : chaque compte est ouvert **au nom de Pâtisserie Coco Vanille inc.**, avec un courriel et un téléphone de récupération que la boutique contrôle. L'agence reçoit un accès de gestionnaire ou d'éditeur. Aucun mot de passe n'est écrit dans un document, un courriel ou le clavardage : on utilise un gestionnaire de mots de passe partagé.

| Compte ou actif | Propriétaire (la boutique) | Accès de l'agence | Statut au 29 octobre 2026 | Source |
|---|---|---|---|---|
| Domaine `cocovanillegranby.com` (registraire, double authentification, renouvellement automatique, verrou) | `[[FACT NEEDED: registraire, titulaire, date de renouvellement (14 T2)]]` | Accès DNS délégué | À CONFIRMER | [research/17 §10](../research/17-vps-self-hosting-and-domain.md) |
| `cocovanillegranby.ca` (enregistrement défensif, au nom légal selon les règles canadiennes) | Décision du propriétaire | — | À DÉCIDER | [research/17 §10.1](../research/17-vps-self-hosting-and-domain.md) |
| Serveur (VPS) qui héberge le site, Coco Studio et la base de données | `[[FACT NEEDED: fournisseur, ville du centre de données, taille (14 T1)]]`. Cible : un centre de données **au Québec**, 4 processeurs virtuels, 8 Go de mémoire, 75 Go de disque NVMe (est.) | Utilisateur `deploy` par clé SSH | À CONFIRMER | [research/17 §0](../research/17-vps-self-hosting-and-domain.md), [infra/README.md](../infra/README.md) |
| Stockage des sauvegardes : deux compartiments au Québec, chez deux fournisseurs différents | Compte de la boutique | Clé limitée à chaque compartiment | À CRÉER | [infra/README.md](../infra/README.md) |
| Clé de chiffrement des sauvegardes (`age`) | Clé privée dans le gestionnaire de mots de passe + une copie imprimée dans le coffre de la boutique ; jamais sur le serveur | Aucun accès permanent | À CRÉER | [infra/README.md](../infra/README.md) |
| Google Search Console (propriété « Domaine ») | Compte Google de l'entreprise | Utilisateur complet | À CRÉER (après l'accès DNS) | [docs/12-setup-mesure.md](12-setup-mesure.md) |
| Bing Webmaster Tools | Compte de l'entreprise (importé depuis Search Console) | Utilisateur | À CRÉER | [docs/12-setup-mesure.md](12-setup-mesure.md) |
| Profil d'entreprise Google (fiche « Pâtisserie Cocovanille ») | `[[FACT NEEDED: qui détient l'accès propriétaire de la fiche (14 S2)]]` | Gestionnaire | EXISTE ; statut à vérifier | [research/14 S2](../research/14-owner-questions.md) |
| Apple Business, Bing Places | Compte de l'entreprise | Gestionnaire | À RÉCLAMER (Bing après que la fiche Google est finale) | [research/11 §1.1](../research/11-offsite-local-citations.md) |
| Google Analytics 4 | Compte Google de l'entreprise | Éditeur | À CRÉER ; pas encore installé sur le site | [docs/12-setup-mesure.md](12-setup-mesure.md) |
| Page Facebook `/PatisserieCocoVanille` et portefeuille Meta Business | `[[FACT NEEDED: administrateurs actuels (14 T5)]]` | Accès partenaire | EXISTE | [data/facts.json](../data/facts.json) `social.facebook` |
| Instagram `@coco_vanillegranby` | `[[FACT NEEDED: confirmer le compte, professionnel et public, administrateur (14 T4)]]` | Accès partenaire | Non vérifié (aucune recherche ne l'a trouvé) | `social.instagram` |
| Chaîne YouTube | Compte Google de l'entreprise | Gestionnaire | Aucune trouvée ; à créer avant la première vidéo (prévue au mois 4) | [research/12 F6](../research/12-plan-review.md) |
| Courriel sur le domaine (`bonjour@`, `commandes@`) | Microsoft 365 ou Google Workspace : `[[FACT NEEDED: choix (14 T3)]]` | Alias `dmarc@` lu par l'agence | À CRÉER | [research/17 §9.2](../research/17-vps-self-hosting-and-domain.md) |
| Stripe (paiements en ligne, acomptes) | Compte au nom de la boutique : `[[FACT NEEDED: compte existant? (14 O2)]]` | Clés d'API seulement, dans le fichier `.env` du serveur ; aucun accès aux virements | À OUVRIR | [research/19 §3.4](../research/19-build-workflow-and-requirements.md) |
| Twilio (textos « C'est prêt! ») | Compte de la boutique | Clés dans le fichier `.env` du serveur | À OUVRIR (la vérification du numéro prend du temps) | [research/19 Y23](../research/19-build-workflow-and-requirements.md) |
| Amazon SES (courriels de commande, région ca-central-1) | Compte AWS de la boutique | Clé d'envoi seulement | À OUVRIR | [research/17 §9.1](../research/17-vps-self-hosting-and-domain.md) |
| Code du site et déploiements (GitHub `yahyahoussini/coco-vanille-granby`, images `ghcr.io/yahyahoussini/…`) | **Aujourd'hui sous le compte de l'agence.** Recommandation : le transférer à une organisation GitHub au nom de la boutique avant la mise en ligne, ou l'inscrire au contrat (remise du code, [docs/11 §3](11-contrat-clauses.md)) | Administrateur | À DÉCIDER | [infra/README.md](../infra/README.md) |
| Surveillance de disponibilité et alertes d'erreurs (Better Stack ou Healthchecks.io, Sentry) | `[[FACT NEEDED: qui reçoit les alertes de panne, sur quel téléphone (14 T8)]]` | Reçoit toutes les alertes | À CRÉER | [infra/README.md](../infra/README.md) |
| Comptes Coco Studio | Propriétaire : clé d'accès (passkey) + code de secours ; équipe : NIP à 4 chiffres sur l'appareil partagé | Rôle « Agence » : ne voit ni noms ni téléphones de clients par défaut (Loi 25) | Construit, pas encore en ligne | [research/sessions/01-admin-review.md](../research/sessions/01-admin-review.md) |

## 3. L'entreprise (couche 8) : identique partout, au caractère près

| Champ | Valeur | Statut | Source |
|---|---|---|---|
| Nom affiché (site, données structurées) | **Pâtisserie Coco Vanille** | vérifié (registre, Facebook, Tripadvisor, presse, Marché public). Décision finale : le nom sur l'enseigne `[[FACT NEEDED: photo de l'enseigne (14 S3)]]` | `name.trade.owner_channels` ; D1 |
| Orthographe sur Google Maps | Pâtisserie Cocovanille | vérifié (nom de la fiche) ; gardée seulement comme « autre nom » | `name.trade.google` |
| Raison sociale | Pâtisserie Coco Vanille inc. | vérifié (sites qui reprennent le Registraire des entreprises ; registre non ouvert directement) | `legal.name` |
| NEQ | 1177082220 | vérifié (2 sources) | `legal.neq` |
| Forme juridique | Société par actions | non vérifié | `legal.form` |
| Immatriculation | 9 novembre 2021 | vérifié | `legal.registration_date` |
| Constitution | 8 ou 9 novembre 2021 | conflit (un jour d'écart entre deux sources) | `legal.incorporation_date` |
| Dernière déclaration annuelle au registre | Déposée le 24 janvier 2026 (pour 2025) | non vérifié | `legal.status` |
| Activité déclarée | CAE 6013 – Boulangeries et pâtisseries | vérifié | `legal.activity_code` |
| Adresse | 3, rue Court, Granby (Québec) J2G 4Y6 | vérifié (identique partout) | `address` |
| Téléphone | 450-372-7177 | vérifié (plus de 10 sources) | `phone.primary` |
| Cellulaire | 438-528-7818 | vérifié (publié par la boutique, transmis). Affiché « Cellulaire » seulement : `[[FACT NEEDED: quel numéro reçoit les textos et les réservations d'ateliers (14 N1)]]` | `phone.mobile` |
| Autre numéro vu une fois | 450-372-5917 | conflit (un seul résultat Pages Jaunes) : `[[FACT NEEDED: ancien numéro, deuxième ligne ou erreur? (14 H3)]]` | `phone.alternate` |
| Courriel | `[[FACT NEEDED: courriel de la boutique (14 H4)]]` | à fournir (aucun trouvé) | `web.email` |
| Site Web | https://cocovanillegranby.com/ (sans « www », qui redirige) ; Coco Studio à https://admin.cocovanillegranby.com/ | décidé (exigences du 25 octobre 2026 ; M7, M8) | [research/requirements-2026-10-25.md](../research/requirements-2026-10-25.md) |
| Heures | Lundi et mardi : fermé · mercredi au samedi : 8 h 30 à 17 h 30 · dimanche : 9 h 30 à 17 h | vérifié (publié par la boutique, transmis le 27 octobre 2026). Votre confirmation est bienvenue (14 H1) ; on les change dans Coco Studio › Boutique & heures | `hours.google_listing` ; D26 |
| Heures des Fêtes (du jeudi 24 décembre 2026 au samedi 2 janvier 2027) et jours fériés | `[[FACT NEEDED: heures des Fêtes et jours fériés (14 H2)]]` | **à fournir au plus tard le lundi 30 novembre 2026**, pour être en ligne le mardi 1er décembre (Google, Apple, Bing, Facebook) | [research/04 §6](../research/04-keywords-demand.md) |
| Coordonnées GPS | 45.3995807, -72.7250821 | non vérifié (tiré du lien Google Maps) | `entity.geo` |
| Identifiant Google Maps (CID) et identifiant Knowledge Graph | 10789122976114705165 · /g/11s3b_3rsh | fourni par Yahya (exigences du 25 octobre 2026), non revérifié | [research/requirements-2026-10-25.md](../research/requirements-2026-10-25.md) |
| Statut | En activité selon la fiche Google et la bio Facebook (transmis le 27 octobre 2026). RestoMontreal affichait encore « Cette entreprise peut être temporairement fermée » le 25 octobre 2026 | non vérifié : `[[FACT NEEDED: confirmer l'ouverture et que la fiche Google n'est pas marquée comme temporairement fermée (14 S1, S2)]]` | `status.temporarily_closed_flag` |
| Propriétaire(s) et chef | `[[FACT NEEDED: noms, rôles, formation, parcours, consentement photo (14 C1)]]` | à fournir | `fact_needed` |
| Ouverture de la boutique | `[[FACT NEEDED: date d'ouverture (14 C2)]]`. Plus ancienne preuve d'activité : 2022 (Radio-Canada ; La Voix de l'Est, 23 octobre 2022) | à fournir | `history.rue_principale_merchant_2022` |
| Zone servie | Cueillette en boutique seulement au lancement (décision D11). Livraison : `[[FACT NEEDED: offerte? zone, frais, jours (14 O3)]]` | décidé pour le lancement | D11 |
| Langues servies | Français. Anglais : `[[FACT NEEDED: qui sert en anglais (14 L1)]]`. Espagnol : pages désactivées (`ENABLE_ES=false`) tant que personne ne sert en espagnol (14 L2) | partiel | M10 |
| Type de données structurées | `Bakery` (boulangerie) | décidé | `entity.schemaType` |
| Profils liés (`sameAs`) | facebook.com/PatisserieCocoVanille (vérifié) ; instagram.com/coco_vanillegranby (non vérifié) | partiel | `entity.sameAs` |

**Variantes à corriger dans les annuaires** (source : `name.variants.errors`) : « Patisserie Coco Vanill » (faute sur MapQuest) ; « Pâtisserie Cocovanille, Magog » (mauvaise ville sur Wanderlog) ; « Patisserie Coco Vanille Inc » comme nom commercial (Pages Jaunes, D&B). La liste et l'ordre des corrections : [docs/06-annuaires-listicles.md](06-annuaires-listicles.md) et [research/11 §1.1](../research/11-offsite-local-citations.md).

**À ne pas confondre** (source : `collision.*`) : choco.vanille (Le Marmiton, Granby, gâteaux personnalisés : même ville, nom presque identique) ; le parfum « Coco Vanille » de Mancera ; Pâtisserie Coco (quartier chinois de Montréal) ; Coco Vanille (Bras-Panon, La Réunion). D'où la règle : « Coco Vanille » s'écrit toujours avec « Granby » dans les titres, les bios et les faits destinés aux IA.

## 4. L'offre et les preuves (couche 10) : chaque fait avec sa source et sa date

| Fait | Valeur | Statut | Source |
|---|---|---|---|
| Vos mots sur Facebook | « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! » | vérifié | `products.owner_description` |
| Café | « Pâtisserie & Café » | vérifié (publié par la boutique, transmis le 27 octobre 2026). Boissons et places : `[[FACT NEEDED: boissons offertes, nombre de places (14 N3)]]` | `service.cafe` |
| Gâteaux sur commande | « Gâteaux sur commande » | vérifié (publié, transmis). Volume, délais, prix : `[[FACT NEEDED: volume, délais et prix des gâteaux sur commande (14 P1, P4)]]` | `service.custom_cakes_bio` |
| Ateliers | « Ateliers créatifs sur réservation » | vérifié (publié, transmis). Thèmes, âges, durée, prix, dates : `[[FACT NEEDED: détails des ateliers (14 N2)]]` | `service.ateliers` |
| Produits nommés en ligne | Croissants aux amandes, Paris-Brest, tartes, pains et baguettes (aussi surgelés), shortcake aux fraises, gâteau aux framboises, vol-au-vent, café, prêt-à-manger | non vérifié (annuaires et résumés d'avis) : `[[FACT NEEDED: liste complète des produits avec prix, formats, portions (14 P1)]]` | `products.named` |
| Commande la veille par téléphone | « Commandez par téléphone, prêt le lendemain » | non vérifié (Three Best Rated, 2025) : `[[FACT NEEDED: commande pour le lendemain offerte? heure limite? (14 P4)]]` | `service.next_day_phone_order` |
| Places assises | Une dizaine | non vérifié (un avis) | `service.seating` |
| Prix publiés | Aucun prix de produit publié nulle part ; « $ et $$ » sur un annuaire | non vérifié : `[[FACT NEEDED: grille de prix (14 P1)]]` | `price.range` |
| Allergènes, permis | `[[FACT NEEDED: allergènes par produit, pratiques contre la contamination croisée, numéro et catégorie du permis du MAPAQ (14 A1–A3)]]` | à fournir ; jamais écrits par une IA | [research/07 1F](../research/07-legal-quebec-compliance.md) |
| Avis Google | 4,9 sur 5, « 40+ » avis, selon une copie de RestoMontreal datée du 15 juillet et du 1er août 2026 | non vérifié : `[[FACT NEEDED: nombre exact d'avis aujourd'hui (14 S7)]]`. Jamais affiché en étoiles dans les données structurées du site | `reviews.google` |
| Autres notes | Three Best Rated : 4,8 sur 115 évaluations, 2e boulangerie de Granby (2025) ; RestoMontreal : 4,8 sur 22 | non vérifié | `reviews.threebestrated`, `reviews.restomontreal` |
| Plainte publique connue | Gâteau commandé au chocolat, reçu à la vanille avec crème au chocolat (janvier 2026, selon un résumé) | non vérifié : `[[FACT NEEDED: ce qui s'est passé et ce qui a changé (14 P6)]]`. Le site exige un récapitulatif écrit et une photo de référence avant la production | `reviews.themes` |
| Presse | Radio-Canada (2022) et La Voix de l'Est (23 octobre 2022) : le kiosque du Marché public | vérifié | `press.mentions` |
| Marché public de Granby et région | Inscrite parmi les exposants | non vérifié pour 2026 : `[[FACT NEEDED: présence en 2026, jours (14 S10)]]` | `partner.marche_public` |
| Photos réelles (façade, comptoir, produits, équipe) | Le site affiche pour l'instant des photos d'ambiance libres de droits, toujours étiquetées « Photo d'illustration », jamais sur une fiche produit | `[[FACT NEEDED: vos photos avec permission + une demi-journée de photos (14 B2, B3)]]` | [research/sessions/04-design-direction.md](../research/sessions/04-design-direction.md) |
| Vidéo | Aucune | prévue au mois 4 ([docs/15-script-video.md](15-script-video.md)) | [research/12 F6](../research/12-plan-review.md) |
| Citation du chef ou du propriétaire | `[[FACT NEEDED: une phrase, signée d'un nom et d'un rôle]]` | à fournir | règle du skill rank-first |
| Données que seule la boutique peut produire | Relevé des prix des gâteaux à Granby (étude du premier trimestre 2027) ; plus tard, les statistiques des commandes | prévu ; les prix de départ de research/03 §2b sont à revérifier le jour du relevé | [research/00 §10.4](../research/00-master-concept.md) |

**Offres sans aucune preuve publique** (aucune page, aucune question suivie, aucune annonce tant que vous ne les confirmez pas, 14 P2) : gâteaux de mariage, macarons, bûches de Noël, produits « sans gluten » ou véganes, boîtes pour le bureau, livraison, gâteaux de quinceañera, cartes-cadeaux. **Bûches : réponse attendue au plus tard le dimanche 1er novembre 2026** (14 P3).

## 5. Le marché (couche 7)

Les chiffres ci-dessous sont **ceux des concurrents**, relevés sur leurs propres pages ou sur des annuaires (résumés de recherche du 25 octobre 2026, [research/03 §1](../research/03-competitors.md)). Ce ne sont jamais les chiffres de Coco Vanille.

| Concurrent | Ce qui compte | Source et date |
|---|---|---|
| Mont Rose Pâtisserie & Café, 190, rue Principale | Le concurrent le plus fort au comptoir : Google 4,6 (70+), chaîne de 3 boutiques | RestoMontreal, copie d'octobre 2026 |
| Cake Design Granby, 194, rue Denison Est | Boutique en ligne avec panier ; 5 $ la portion (minimum 16) pour un gâteau décoré au fondant | cakegranby.ca (page non datée), vue le 25 octobre 2026 |
| Avec un Grand A, 581, rue Breton | Commande en ligne avec prix par format ; délai de 48 h (jours ouvrables) | avecungranda.com, vue le 25 octobre 2026 |
| Rose Gâteaux, 160, rue Robinson Sud | La seule spécialiste des gâteaux de mariage trouvée à Granby ; Three Best Rated 4,9, 2e « gâteaux » | rosegateaux.com ; threebestrated.ca, vus le 25 octobre 2026 |
| Mélisse Pâtisserie, 301, rue Notre-Dame | Three Best Rated 4,8 (114), 3e boulangerie ; marquée « peut être temporairement fermée » sur RestoMontreal | RestoMontreal, copie du 15 juillet 2026 |

- **Une place s'est libérée :** Pain-Pain, 1re sur les listes de boulangeries, a fermé le 16 juin 2026 ([La Voix de l'Est](https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/)), mais Three Best Rated l'affichait encore en tête ([research/03 §0](../research/03-competitors.md)).
- **Les autres choix du client :** Maître Glacier (gâteaux glacés, siège social à Granby), les épiceries (IGA : gâteau 8–12 personnes à 26,99 $, traiteur.iga.net, vu le 25 octobre 2026). Le portrait complet et le plan de bataille : [docs/19-marche-et-concurrence.md](19-marche-et-concurrence.md) et [research/03](../research/03-competitors.md).
- **Langue des recherches :** le français. Le français est la langue maternelle de 91,8 % des Granbyens (recensement 2021, Statistique Canada, `granby.language.french_mother_tongue`). Granby compte 72 078 habitants (décret de population 2026, `granby.population.decree2026`).
- **Les mots exacts de vos clients :** `[[FACT NEEDED: les mots que les clients utilisent au téléphone, en courriel, sur Facebook et dans « Écrivez-nous »]]`. L'outil existe : Coco Studio › Plus › « Noter une question de client ».
- **Mesure de départ :** seulement une mesure indirecte faite depuis les États-Unis : 17 questions le 25 octobre 2026, puis les 16 autres et 13 candidates le 29 octobre 2026 ([research/05](../research/05-serp-baseline.md), mise à jour du 29 octobre). Elle ne voit ni la carte, ni l'encadré, ni l'Aperçu IA. La vraie mesure, depuis un cellulaire à Granby et dans les moteurs d'IA, **n'a pas encore été faite** ([docs/13 A37–A38](13-taches-humaines.md)).

## 6. Le site tel qu'il est construit (couche 19)

Le site existe : il est construit et testé, mais pas encore en ligne ([README.md](../README.md), « The app », vérifié le 26 octobre 2026). La liste ci-dessous vient du registre des pages ([apps/web/src/lib/routes.js](../apps/web/src/lib/routes.js)).

| Groupe | Pages en français (anglais sous `/en/`) | Quand elles se publient |
|---|---|---|
| Pages de base | Accueil `/`, `/carte/`, `/commander/`, `/nous-trouver/`, `/a-propos/`, `/allergenes/`, `/faq/`, `/viennoiseries/`, `/pains-baguettes/`, `/gateaux/`, `/patisseries/`, et les fiches produits `/<famille>/<produit>/` | Dès que leurs faits sont fournis (aucun `[[FACT NEEDED]]`) |
| Pages légales | `/confidentialite/` (Loi 25), `/conditions-de-vente/` (Loi sur la protection du consommateur), `/temoins/`, `/accessibilite/` | Après la révision d'un juriste (elles portent le marqueur « révision par un avocat ») |
| Pages conditionnelles | `/a-propos/chef/`, `/prix/`, `/gateau-pour-demain/`, `/gateaux-personnalises-granby/`, `/buches-de-noel/`, `/calculateur-portions-gateau/` | Seulement si l'offre est confirmée (consentement et biographie du chef ; grille de prix ; commande pour le lendemain ; bûches ; portions par format) |
| Pages utilitaires, jamais indexées | `/boite/` (« Ma boîte »), `/commander/paiement/`, `/commander/merci/` | — |
| Espagnol | `/es/…` | Désactivé (`ENABLE_ES=false`) |

**Déjà dans le site :** commande en ligne avec cueillette, créneaux et capacité, TPS et TVQ, paiement Stripe ; demande de gâteau personnalisé → soumission → acompte ; textos et courriels ; clavardage « Écrivez-nous » (messages gardés dans la base de données de la boutique, supprimés 90 jours après le dernier message, jamais sur les pages de paiement) ; `robots.txt`, plan du site, données structurées, `llms.txt` ; lien `/avis` vers la page d'avis Google (pour le code QR des boîtes).

**Pas encore dans le site (prévu, à confirmer avant de le promettre) :** GA4 et sa bannière de consentement ; l'envoi IndexNow automatique à la publication ; le courriel du lundi ; les alertes poussées de Coco Studio ; la question « Comment nous avez-vous connus? » au paiement (le champ existe dans les commandes) ; les pages saisonnières autres que les bûches (Saint-Valentin, Pâques, Fête des mères) ; la page comparative ; une page pour les visiteurs du Zoo.

**Ce qu'une boulangerie doit publier** (plan-v1 couche 19) : produits en HTML avec prix, portions et délais ; allergènes ; mode de cueillette ; conditions d'acompte et d'annulation ; politique sur les produits périssables ; heures des Fêtes.

## 7. Adaptation au Québec (le modèle de départ était écrit pour le Maroc)

| Sujet | Modèle d'origine | Coco Vanille |
|---|---|---|
| Langues | Français + arabe, darija | Français (fr-CA) à la racine, anglais (en-CA) sous `/en/`, espagnol plus tard et seulement si quelqu'un le sert ; aucune page plus complète que la française (Charte de la langue française, loi 96) |
| Contact principal | WhatsApp | Commander en ligne, puis le téléphone 450-372-7177, le texto (quand le numéro sera confirmé) et le clavardage « Écrivez-nous ». Pas de WhatsApp au lancement (M11) |
| Lois | 09-08, 31-08 | Loi 25 (renseignements personnels), Loi sur la protection du consommateur, Charte de la langue française, Loi canadienne anti-pourriel (LCAP), Loi sur la concurrence (faux avis, frais cachés) ([research/07](../research/07-legal-quebec-compliance.md)) |
| Identifiants | ICE, RC | NEQ 1177082220 ; numéros de TPS et de TVQ `[[FACT NEEDED: numéros de TPS et de TVQ (14 A5)]]` |
| Taxes | — | TPS et TVQ, avec le changement de TVQ du 15 juillet 2026 sur les pâtisseries vendues à l'unité ; le comptable signe chaque classe ([research/07 §6](../research/07-legal-quebec-compliance.md)) |
| Marque | OMPIC | Office de la propriété intellectuelle du Canada (OPIC) : recherche à faire avant d'imprimer boîtes ou enseigne |
| Annuaires et médias | Annuaires marocains | Fiche Google, Apple Business, Bing Places, Facebook, Pages Jaunes, Yelp (réclamer seulement), Tripadvisor, Foursquare, Tourisme Granby région, Chambre de commerce ; La Voix de l'Est, Granby Express, M105, ICI Estrie, Tastet ([research/11](../research/11-offsite-local-citations.md)) |
| Calendrier | Ramadan, Aïd | Fêtes (bûches), Fête des Rois, Saint-Valentin, temps des sucres, Pâques, Fête des mères, saison du Zoo, rentrée ([research/04 §6](../research/04-keywords-demand.md)) |

## 8. Ce que l'agence ne promet jamais

Aucune position n'est garantie dans Google, Bing ou les moteurs d'IA. Google l'écrit lui-même : « No one can guarantee a #1 ranking on Google » (« Personne ne peut garantir la première place dans Google », [Google Search Central, « Do you need an SEO? »](https://developers.google.com/search/docs/fundamentals/do-i-need-seo), page mise à jour le 5 juin 2026, consultée le 29 octobre 2026).

L'agence promet : le processus ([docs/01-plan-90-jours.md](01-plan-90-jours.md)), la mesure chaque semaine ([docs/02-rythme-hebdo.md](02-rythme-hebdo.md)), un rapport chaque mois ([docs/07-rapport-mensuel.md](07-rapport-mensuel.md)) et la définition de « premier » écrite d'avance ([docs/01 §5](01-plan-90-jours.md)). Les tactiques refusées : [docs/11 §5](11-contrat-clauses.md).

## 9. Ce qui manque encore, par ordre d'urgence

Le message prêt à envoyer (15 questions, en français du Québec) est dans [research/14 §14](../research/14-owner-questions.md). La liste complète des faits demandés par chaque page du site est produite par la vérification du site (`apps/web/reports/gate/owner-todo.md`, générée le 28 octobre 2026 : 240 lignes, dont beaucoup en double français et anglais).

| Échéance | Faits à fournir | Pourquoi |
|---|---|---|
| **Dimanche 1er novembre 2026** | Ouverture confirmée et statut de la fiche Google (S1, S2) · nom sur l'enseigne (S3) · phrase A ou B (S5) · entente sur les tactiques refusées (S6) · **bûches oui ou non, menu des Fêtes et date des précommandes (P3)** · produits, prix, portions, délais, heure limite pour le lendemain (P1, P2, P4) · caisse ou terminal (O1) · serveur et domaine (T1, T2) · qui fait la vérification sur cellulaire à Granby (D1) · qui sert en anglais et en espagnol (L1, L2) · budget mensuel maximal (M1) | Porte G0 (go/no-go) et précommandes des Fêtes |
| Dimanche 15 novembre 2026 | Approbation du NAP (S4) · nombre d'avis Google (S7) · numéro des textos (N1) · « Écrivez-nous » : qui répond (N5) · courriel (H4) · volumes de commandes (P5) · récapitulatif des gâteaux personnalisés (P6) · allergènes, politique, permis du MAPAQ (A1–A3) · personne responsable des renseignements personnels (A4) · juriste et comptable (A5) · Stripe, livraison (O2, O3) · courriel sur le domaine, Instagram, Facebook, fiches réclamées, anciens liens (T3–T7) · logo, photos, date de la séance photo (B1–B3) · équipe et appareils (D2, D3) · choix sur l'entraînement des IA (T9) · montants ponctuels (M2) | Mesure de départ, fiches, serveur, photos |
| **Lundi 30 novembre 2026** | Heures des Fêtes et jours fériés, version finale (H2) | Elles doivent être sur Google, Apple, Bing et Facebook le mardi 1er décembre 2026 |
| Dimanche 13 décembre 2026 | Acompte (pourcentage, remboursement, annulation), capacité par jour, nombre de cueillettes que le comptoir peut servir par 15 minutes en pointe, vocabulaire (« cueillette » ou « ramassage », « acompte » ou « dépôt », « tu » ou « vous ») (O4, K1, K2, L3) | Le cahier de la commande en ligne est figé à cette date (porte G6) |
