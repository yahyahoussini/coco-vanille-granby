# Plan de 90 jours — Pâtisserie Coco Vanille (du lundi 2 novembre 2026 au dimanche 31 janvier 2027)

Rédigé le jeudi 29 octobre 2026 par l'agence. Treize semaines, deux pistes menées ensemble :

- **la piste classement** (SEO, AEO, GEO : être trouvé dans Google, être la réponse affichée, être cité par les IA), tirée de [research/plan-v1-ranking-stack.md §3](../research/plan-v1-ranking-stack.md) et du sprint de 90 jours de [research/plan-v0b-multilingual-local-domination.md §C1](../research/plan-v0b-multilingual-local-domination.md) ;
- **la piste lancement** (site, commande en ligne, Coco Studio), tirée de l'ordre corrigé de [research/12 §6](../research/12-plan-review.md) et de la feuille de route de [research/00 §13](../research/00-master-concept.md).

Les numéros de semaine S1 à S13 sont les semaines W1 à W13 de [research/00 §13](../research/00-master-concept.md). Chaque ligne a une date, un livrable qu'on peut vérifier, un responsable et une porte. On mesure avant de construire : sans mesure de départ, « premier » n'est qu'une opinion.

Responsables : **P** = propriétaire · **A** = agence (Yahya) · **J** = juriste · **C** = comptable · **G** = la personne qui fait la vérification sur cellulaire à Granby (`[[FACT NEEDED: son nom (research/14 D1)]]`) · **Ph** = photographe ou propriétaire.

Documents liés : [docs/00-intake.md](00-intake.md) (les faits) · [docs/02-rythme-hebdo.md](02-rythme-hebdo.md) (la semaine type) · [docs/13-taches-humaines.md](13-taches-humaines.md) (les tâches à faire à la main) · [docs/14-calendrier-contenu.md](14-calendrier-contenu.md) (le calendrier des pages).

## Où on en est le jeudi 29 octobre 2026

| Sujet | État | Source |
|---|---|---|
| Site, commande en ligne, Coco Studio | **Construits et testés, pas encore en ligne.** Vérifiés le 26 octobre 2026 sur une base neuve : 413 tests unitaires, 23 tests d'infrastructure, 124 tests de navigateur, vérification du site réussie sauf les faits manquants | [README.md](../README.md) |
| Ce que ça change au plan | Les semaines de construction prévues en novembre et décembre (research/19 §2) sont en grande partie faites. Il reste : le serveur, le domaine, les faits, les révisions du juriste et du comptable, les tests en boutique, la mise en ligne. La refonte visuelle en cours se termine avant la mise en ligne publique (date de fin à confirmer par l'agence) | [research/19](../research/19-build-workflow-and-requirements.md) |
| Faits du propriétaire | Presque tous manquants : le site ne publie aucune page tant qu'ils manquent | [docs/00 §9](00-intake.md) |
| Mesure de départ | Seulement une mesure indirecte depuis les États-Unis (les 33 questions, les 25 et 29 octobre 2026, plus 13 candidates) ; aucune mesure dans les moteurs d'IA, aucune depuis Granby | [research/05](../research/05-serp-baseline.md), mise à jour du 29 octobre |
| Commande en ligne | Ouverture prévue du lundi 11 au dimanche 24 janvier 2027, **après la cohue des Fêtes** (décision M20, qui tient tant que vous ne la changez pas par écrit) | [research/12 §3](../research/12-plan-review.md) |

## 1. Les portes

Une porte est une vérification qui doit réussir. Si elle échoue, le travail qui en dépend attend la semaine suivante.

| Porte | Réussie quand | Échéance | Si elle échoue |
|---|---|---|---|
| **G0** Go ou pas | Ouverture de la boutique confirmée · la fiche Google n'est pas marquée comme temporairement fermée · on sait qui a l'accès propriétaire de la fiche | Dimanche 1er novembre 2026 | Rien d'autre ne démarre. Sans confirmation dans les deux semaines, on arrête le travail de lancement et on corrige seulement les fiches ([research/00 §14](../research/00-master-concept.md)) |
| **G1** Mesure et fiches | Mesure de départ enregistrée · fiche Google = Apple = Bing = Facebook (mêmes nom, adresse, téléphone, heures) · Search Console et Bing Webmaster Tools vérifiés | Dimanche 8 novembre 2026 | La semaine 2 commence par ce qui manque |
| **G2** Fondations | Test de restauration des sauvegardes réussi et consigné · la garde de publication bloque marqueurs, textes provisoires et allergènes non vérifiés · personne responsable des renseignements personnels nommée | Dimanche 15 novembre 2026 | Aucun formulaire ne recueille de renseignements personnels en production |
| **G4** Premières pages | Vérification du site : 0 échec · aucune différence entre la page brute et la page affichée · Signaux Web essentiels au vert sur l'accueil et `/carte/` · aucun marqueur sur les pages servies · chaque robot de Google, de Bing et des IA reçoit une réponse 200 | Dimanche 29 novembre 2026 | Les pages restent sur le site de préproduction ; la fiche Google porte la saison |
| **G5** Indexation | Pages clés indexées dans Google et dans Bing · si GA4 est installé, ses événements ne partent qu'après le consentement | Dimanche 6 décembre 2026 | On cherche la cause avec [docs/09](09-runbook-incident.md) |
| **G6** Cahier de la commande | Cahier de la commande en ligne signé (processeur, capacité, plages de cueillette, acompte et annulation, taxes, consentements) · demande d'accès à l'interface de programmation de la fiche Google déposée · heures des Fêtes en ligne partout | Dimanche 13 décembre 2026 | Par défaut : Stripe et l'imprimante de Coco Studio ; le lancement n'attend jamais l'intégration d'une caisse ([research/00 §14](../research/00-master-concept.md)) |
| **G10** Avant d'ouvrir la commande | Test du propriétaire : 5 tâches sur 5 sans aide · test de l'équipe · test de charge pour la saison · test de restauration · sauvegarde continue en place · classes de taxes signées par le comptable · avis du juriste sur le paiement et les conditions de vente · textos d'un seul segment | Dimanche 10 janvier 2027 | La commande en ligne reste fermée ; téléphone et demandes de gâteaux seulement |
| **G12** Lancement | 20 premières vraies commandes sans texto perdu ni en double · remboursements et minuteries fonctionnels | Dimanche 24 janvier 2027 | On corrige avant d'annoncer la commande en ligne |
| **G14** Re-mesure | Les 33 questions remesurées et comparées à S1 · rapport en commandes et en demandes · 20 pages suivantes choisies · protocole de diagnostic fait une fois · rythme hebdomadaire en marche | Commence en S13 ; se termine le dimanche 7 février 2027 ([research/00 §13](../research/00-master-concept.md)) | — |

## 2. Le plan en un écran

| Semaine | Dates | Thème | Porte |
|---|---|---|---|
| S0 | Jusqu'au dimanche 1er novembre 2026 | Go ou pas, bûches oui ou non | G0 |
| S1 | Lundi 2 → dimanche 8 novembre 2026 | Mesurer, ouvrir les comptes, aligner les fiches | G1 |
| S2 | Lundi 9 → dimanche 15 novembre 2026 | Nettoyer les fiches, poser les fondations, photos | G2 |
| S3–S4 | Lundi 16 → dimanche 29 novembre 2026 | Premières pages publiques en français | G4 |
| S5 | Lundi 30 novembre → dimanche 6 décembre 2026 | **Heures des Fêtes partout le mardi 1er décembre 2026** ; indexation | G5 |
| S6 | Lundi 7 → dimanche 13 décembre 2026 | Cahier de la commande, fiches touristiques, liens | G6 |
| S7 | Lundi 14 → dimanche 20 décembre 2026 | Cohue des Fêtes : mesurer, préparer G10, ne rien casser | — |
| S8 | Lundi 21 → dimanche 27 décembre 2026 | Noël (jeudi 24 et vendredi 25 décembre 2026) | — |
| S9 | Lundi 28 décembre 2026 → dimanche 3 janvier 2027 | Jour de l'An (vendredi 1er janvier 2027) | — |
| S10 | Lundi 4 → dimanche 10 janvier 2027 | Tests en boutique et révisions | G10 |
| S11–S12 | Lundi 11 → dimanche 24 janvier 2027 | Ouverture de la commande en ligne | G12 |
| S13 | Lundi 25 → dimanche 31 janvier 2027 | Re-mesurer et choisir la suite | G14 (début) |

## 3. Semaine par semaine

### S0 — cette semaine, jusqu'au dimanche 1er novembre 2026

- **A** envoie le message de 15 questions ([research/14 §14](../research/14-owner-questions.md)) et l'entente d'une page sur les tactiques refusées ([docs/11, annexe A](11-contrat-clauses.md)).
- **P** répond aux questions bloquantes ([docs/00 §9](00-intake.md)) et dit **oui ou non aux bûches**, avec le menu des Fêtes et la date des précommandes (research/14 P3).
- **P** choisit la phrase de catégorie A ou B ([docs/00 §1](00-intake.md)).
- **A** propose le remplacement des questions suivies qui dépendent de produits non confirmés (proposition de [research/00 §10.5](../research/00-master-concept.md) : les cinq questions sur les mariages I5, I9, C3, C7, C9 deviennent X1 « pâtisserie Granby », X2 « boulangerie Granby », X7 « croissants Granby », X3 « gâteau d'anniversaire Granby » et X12 « café pâtisserie centre-ville Granby »).
- **Porte G0** le dimanche 1er novembre.

### S1 — du lundi 2 au dimanche 8 novembre 2026 : mesurer et ouvrir les comptes

**Classement**
- **G + A, lundi 2 novembre : mesure de départ n° 1** (protocole de [research/05 §9](../research/05-serp-baseline.md)). G cherche, depuis un cellulaire au centre-ville de Granby, les questions locales et de marque avec des captures d'écran datées ; A fait le reste avec SerpApi réglé sur Granby (si la clé existe) et les cinq moteurs d'IA (ChatGPT, Perplexity, Gemini, Claude, Copilot). Fichier : `scoreboard/runs/2026-W45.csv` (celui que lisent les scripts, [scoreboard/README §3](../scoreboard/README.md)), avec une copie dans `data/serp-baseline-2026-W45.csv`. Les questions sont ensuite figées : leurs numéros ne changent plus.
- **G ou P, avec la liste préparée par A** : les autotests T1 à T3 ([research/06 §4](../research/06-seo-aeo-geo-2026-verified.md)) et 2, 5, 11b, 13, 18, 19 ([research/18 §2](../research/18-dated-claims-verification.md)), environ 30 minutes sur un cellulaire à Granby; **A** fait T4 et T5 (Search Console, Bing Webmaster Tools), qui se font à distance.
- **P + A** : fiche Google. Catégorie principale choisie dans la vraie liste de Google (autotest T2), jamais dans un blogue ; description qui commence par la phrase de catégorie ; heures confirmées ; produits avec prix si la liste existe ; photos réelles ([docs/05-gbp-checklist.md](05-gbp-checklist.md)).
- **A** : Apple Business réclamé ; « À propos » de Facebook aligné ; Instagram professionnel, public, visible des moteurs (autotest 5). Bing Places est importé depuis la fiche Google **dès que celle-ci est finale**, dans la même semaine, jamais avant : l'import copie aussi les erreurs ([research/06 (c)](../research/06-seo-aeo-geo-2026-verified.md), [research/11 §1.1](../research/11-offsite-local-citations.md)).
- **A, seulement si les bûches sont confirmées** : le pont des Fêtes 2026 (décision D20), dès l'ouverture des précommandes (le 1er novembre au plan) : produits et publication sur la fiche Google, publication Facebook, téléphone, formulaire de demande et lien de paiement. Le nouveau site ne gagnera pas Noël 2026 dans Google : il sera trop jeune ([research/04 §0.6](../research/04-keywords-demand.md)).

**Lancement**
- **P + A** : serveur au Québec confirmé ou commandé **dans le compte de la boutique** (si c'est OVHcloud : Beauharnois, choisi explicitement) ; sécurisation (`harden-vps.sh`), DNS, certificats, courriel sur le domaine, secrets GitHub ([infra/README.md](../infra/README.md), « First deploy »).
- **A** : site de préproduction en ligne (`staging.cocovanillegranby.com`, protégé par mot de passe et invisible des moteurs) ; P le parcourt sur son cellulaire.
- **A** : Search Console (propriété « Domaine »), Bing Webmaster Tools (import depuis Search Console) et clé IndexNow dès que le DNS est prêt ([docs/12](12-setup-mesure.md)).
- **A** : juriste mandaté **dès maintenant**, pas en S3 : les quatre pages légales portent le marqueur « révision par un avocat » et bloquent la première mise en ligne. Comptable contacté : aucun produit ne se vend en ligne sans classe de taxes signée ([research/07 §8](../research/07-legal-quebec-compliance.md)).

**Vous** : approuver le NAP ; envoyer vos photos existantes ; fixer la date de la séance photo (S2) ; envoyer les invitations d'accès (fiche Google, Facebook et Meta Business, domaine, serveur).

**Porte G1**, dimanche 8 novembre 2026.

### S2 — du lundi 9 au dimanche 15 novembre 2026 : nettoyer les fiches, poser les fondations

**Classement**
- **A** : corrections, première ronde ([research/11 §1.1](../research/11-offsite-local-citations.md)) : Pages Jaunes (nom sans « Inc », vérifier le 450-372-5917), Foursquare (créer ou réclamer), Yelp (réclamer seulement, ne jamais demander d'avis), Tripadvisor (réclamer).
- **A** : Three Best Rated : demande de mise à jour (Pain-Pain est fermée depuis le 16 juin 2026) et demande d'ajout à la liste des pâtisseries.
- **G + A** : mesure n° 2, lundi 9 novembre.
- **A** : carte QR prête à imprimer, avec le texte de la décision M3 ([docs/03 §4.2](03-messages-avis.md)) ; elle pointe vers `cocovanillegranby.com/avis`, qui renvoie à votre lien d'avis Google.

**Lancement**
- **A** : sauvegardes (deux compartiments au Québec, clé `age`, minuteries) et **premier test de restauration réussi** avant qu'un formulaire recueille des renseignements personnels en production.
- **P** : allergènes par produit, pratiques contre la contamination croisée, permis du MAPAQ (research/14 A1–A3) ; ils sont vérifiés et signés dans Coco Studio › Plus › Produits.
- **P** : nom, titre et courriel de la personne responsable des renseignements personnels (Loi 25, article 3.1 ; research/14 A4).
- **Ph** : la demi-journée de photos (produits confirmés seulement, lumière de fenêtre, coupes).

**Vous** : les allergènes ; la marque de la caisse ; la séance photo.

**Porte G2**, dimanche 15 novembre 2026.

### S3 et S4 — du lundi 16 au dimanche 29 novembre 2026 : premières pages publiques

**Classement**
- **A** : demandes de correction ([research/11 §1.1](../research/11-offsite-local-citations.md)) : RestoMontreal (mention « peut être temporairement fermée » et heures), Wanderlog (Magog → Granby), MapQuest (nom), find-open, canada.chamberofcommerce.com.
- **G + A** : mesures n° 3 (lundi 16 novembre) et n° 4 (lundi 23 novembre).
- **A** : pour chaque page publiée : « Demander l'indexation » dans Search Console, avis IndexNow (`node tools/indexnow.mjs <adresses>`, une fois que le site sert le fichier de clé, [docs/12 §2](12-setup-mesure.md) ; d'ici là, soumission des adresses dans Bing Webmaster Tools), test des résultats enrichis sur l'accueil et `/carte/`.
- **P** : la carte QR dans chaque boîte, dès qu'elle est imprimée (décisions M3 et M23).
- **A** : si Bing Places n'a pas pu être importé en S1 (fiche Google pas encore finale), il l'est maintenant.

**Lancement**
- **A** : premier déploiement en production dès que l'accueil et les pages légales passent la garde. Premier lot visé, en français : accueil, `/carte/`, `/nous-trouver/`, `/a-propos/`, `/allergenes/`, `/faq/`, les quatre familles, les quatre pages légales, et les fiches produits dont les faits sont complets. Pages conditionnelles seulement si l'offre est confirmée : `/prix/` (grille de prix), `/gateau-pour-demain/` (la question n° 1 des 10 prioritaires, [research/05 §6](../research/05-serp-baseline.md)), `/buches-de-noel/` (bûches). En anglais : accueil, menu, commander, nous trouver, seulement si quelqu'un sert en anglais.
- **A** : `/commander/` avant l'ouverture : la commande en ligne reste en pause (Coco Studio › Boutique & heures) jusqu'à G10. Les demandes de gâteaux passent par le formulaire du site (Coco Studio › Demandes). L'acompte en ligne ne s'active qu'avec le pourcentage d'acompte, le compte Stripe de la boutique et les conditions de vente révisées ; d'ici là, il se règle comme aujourd'hui.
- **A** : après le déploiement, le flux de production vérifie de l'extérieur les adresses et l'accès des robots (`check-urls`, `crawler-access`).

**Vous** : approuver le texte et les prix de chaque page avant sa mise en ligne (research/14 P13).

**Porte G4**, dimanche 29 novembre 2026.

### S5 — du lundi 30 novembre au dimanche 6 décembre 2026 : heures des Fêtes et indexation

**Classement**
- **P + A : heures des Fêtes sur la fiche Google, Apple, Bing et Facebook au plus tard le mardi 1er décembre 2026** ([research/04 §6](../research/04-keywords-demand.md)). Coco Studio › Boutique & heures affiche les jours fériés « à confirmer » ; Google se met à jour à la main (une minute par date, le temps que l'accès à l'interface de programmation soit approuvé).
- **A** : première comparaison sur quatre semaines (mesures n° 1 à 4), lue le lundi 30 novembre.
- **A** : la FAQ s'enrichit des vraies questions notées dans Coco Studio (« Noter une question de client ») ; le calculateur de portions se publie seulement si vos portions par format existent (research/14 P7) ; `/nous-trouver/` est complétée (stationnement, porte, accessibilité).
- **A** : Fête des Rois (mercredi 6 janvier 2027) : aucune page prévue au site ; publications sur la fiche Google et Facebook seulement, si vous faites des galettes `[[FACT NEEDED: galettes des rois offertes?]]`.

**Lancement**
- **A** : GA4 avec sa bannière de consentement (prévu, pas encore construit) : « Tout refuser » et « Tout accepter » de même taille, plus « Choisir » ; GA4 ne se charge qu'après l'accord ([docs/12](12-setup-mesure.md)). Sans l'avis du juriste sur ce point, GA4 attend : on mesure avec les commandes, les appels, la fiche Google et les journaux du serveur.
- **A** : le lien du site dans la fiche Google reçoit son étiquette de suivi.

**Vous** : les heures des Fêtes finales, au plus tard le lundi 30 novembre.

**Porte G5**, dimanche 6 décembre 2026.

### S6 — du lundi 7 au dimanche 13 décembre 2026 : cahier de la commande, fiches touristiques, liens

**Classement**
- **A** : demande d'accès de base à l'interface de programmation de la fiche Google (il faut le site en ligne et un courriel sur le domaine ; [research/12 D4](../research/12-plan-review.md)).
- **A** : demandes d'inscription : Tourisme Granby région, Chambre de commerce de la Haute-Yamaska (nom exact à confirmer, [research/11 §0](../research/11-offsite-local-citations.md)), Marché public de Granby (lien sur la page des exposants). Frais d'adhésion : `[[FACT NEEDED: frais de chaque organisme]]`.
- **A** : cinq demandes de liens envoyées (porte des semaines 3 à 6 du plan-v1) : partenaires réels seulement ([docs/04-pitch-media.md](04-pitch-media.md), [docs/06-annuaires-listicles.md](06-annuaires-listicles.md)).
- **A** : contrôle des réponses aux avis (toutes en moins de 24 heures) et du rythme des avis (cible : deux fois le rythme des huit semaines précédentes, au niveau de la boutique, jamais par employé ; [research/15 R24](../research/15-decisions-and-risks.md)).

**Lancement**
- **P + A + C + J : cahier de la commande figé** : processeur (Stripe par défaut, sauf si votre caisse est Square), capacité par catégorie et par jour, plages de cueillette, acompte et annulation, classes de taxes signées par le comptable, cases de consentement pour les messages ([research/07 §4, §6](../research/07-legal-quebec-compliance.md)).
- **A** : compte Twilio de la boutique ouvert et numéro en vérification (ça prend du temps) ; Amazon SES sorti du mode d'essai.

**Vous** : le pourcentage d'acompte, la règle de remboursement, la capacité par jour, les mots (« cueillette » ou « ramassage », « acompte » ou « dépôt », « tu » ou « vous »).

**Porte G6**, dimanche 13 décembre 2026.

### S7 — du lundi 14 au dimanche 20 décembre 2026 : pendant la cohue, mesurer et ne rien casser

- **A** : mesures hebdomadaires ; boucle des extraits (vérifier aux jours 7 et 14 les pages en ligne depuis S3 à S5, parmi les 12 cibles de [scoreboard/snippet-targets.csv](../scoreboard/snippet-targets.csv)).
- **A** : début de la collecte du relevé des prix des gâteaux à Granby (l'étude du premier trimestre 2027, [research/00 §10.4](../research/00-master-concept.md)).
- **A** : Saint-Valentin (dimanche 14 février 2027) : sa page devrait être publiée au plus tard le dimanche 20 décembre 2026 (règle des 8 semaines, [research/04 §6](../research/04-keywords-demand.md)). Elle n'existe pas dans le site : on la crée seulement si vous confirmez des produits `[[FACT NEEDED: produits de la Saint-Valentin?]]` ; sinon, fiche Google et Facebook en janvier.
- **A** : préparation de G10 : scénario du test en boutique, test de charge, sauvegarde continue de la base de données ([research/17 §8.4](../research/17-vps-self-hosting-and-domain.md)), textos d'un seul segment.
- **A** : à partir du lundi 21 décembre, aucun changement en production sauf les corrections (choix de l'agence, pour protéger la cohue).
- **Vous** : rien de nouveau. Seulement des approbations, si elles sont prêtes.

### S8 — du lundi 21 au dimanche 27 décembre 2026 : Noël

- **P** : réponses aux avis en moins de 24 heures, jours de fermeture compris (M1) ; messages « Écrivez-nous » répondus pendant les heures d'ouverture, ou clavardage mis en pause (Coco Studio › Messages).
- **A** : mesure du lundi (automatique) ; surveillance.
- **A** : après le samedi 26 décembre, la page des bûches passe en « Saison terminée — précommandes 2027 dès le … » et reste en ligne ([research/04 §6.1](../research/04-keywords-demand.md)).

### S9 — du lundi 28 décembre 2026 au dimanche 3 janvier 2027 : Jour de l'An

- **A** : rapport mensuel de décembre préparé ([docs/07](07-rapport-mensuel.md)).
- **A** : test de restauration automatique le lundi 4 janvier 2027 à 3 h 30 (premier lundi du mois) ; résultat lu le jour même.

### S10 — du lundi 4 au dimanche 10 janvier 2027 : tests en boutique et révisions

- **P + A** : test du propriétaire en boutique (environ 45 minutes, 5 tâches sur 5 sans aide) et test de l'équipe ([research/19 Y26](../research/19-build-workflow-and-requirements.md)).
- **J** : avis écrit sur le paiement et les conditions de vente. **C** : classes de taxes signées.
- **A** : Fête des Rois (mercredi 6 janvier) sur la fiche Google et Facebook seulement.
- **Porte G10**, dimanche 10 janvier 2027. Si elle échoue, la commande en ligne reste fermée et la saison suivante se fait par téléphone et par demandes.

### S11 et S12 — du lundi 11 au dimanche 24 janvier 2027 : ouverture de la commande en ligne

**Lancement**
- **A + P** : commande en ligne ouverte (Coco Studio › Boutique & heures) ; formation de dix minutes à Coco Studio ; application installée sur les téléphones et la tablette.
- **A** : données des produits avec la vraie disponibilité ; lien de commande personnalisé vers `/commander/` dans la section « Commander » de la fiche Google, si Google l'offre pour votre catégorie (autotest T2) ; action « Commander » dans Apple Business vers la même adresse.
- **A** : la Saint-Valentin en mode « date d'abord » (choisir le jour avant les produits), si des produits sont offerts.
- **Porte G12**, dimanche 24 janvier 2027.

**Classement**
- **A** : Merchant Center (fiches produits gratuites dans Google) : test sur cinq produits au plus tôt maintenant, plus probablement en février ([research/15 D14](../research/15-decisions-and-risks.md)).

### S13 — du lundi 25 au dimanche 31 janvier 2027 : re-mesurer et choisir la suite

- **G + A** : mesure n° 13 avec le même protocole qu'en S1, comparée à S1.
- **A** : rapport en commandes, demandes, appels et itinéraires, pas en visites ; les 20 pages suivantes choisies d'après ce qui a bougé ; protocole de diagnostic fait une fois sur les vraies données ([docs/09](09-runbook-incident.md)).
- **A** : règle des huit semaines pour les pages en ligne depuis S5 environ : des signaux qui montent avec des commandes stables, c'est tôt ; des signaux plats après huit semaines, c'est un échec : on change l'approche, pas les outils (plan-v1 §11).
- **A** : Pâques (dimanche 28 mars 2027) : sa page devrait être publiée au plus tard le dimanche 31 janvier 2027 ([research/04 §0](../research/04-keywords-demand.md)). Elle n'existe pas encore : on la crée si vous confirmez des produits `[[FACT NEEDED: produits de Pâques?]]`.
- **A** : début du rythme d'une page par semaine ([docs/02](02-rythme-hebdo.md)).

## 4. Livrables datés

| Livrable | Échéance | Responsable | Fait le |
|---|---|---|---|
| Message des 15 questions envoyé ; réponses bloquantes reçues | Dimanche 1er novembre 2026 | A, P | |
| Entente sur les tactiques refusées signée | Dimanche 1er novembre 2026 | P, A | |
| Mesure de départ (`scoreboard/runs/2026-W45.csv`, copie dans `data/serp-baseline-2026-W45.csv`) | Lundi 2 novembre 2026 | G, A | |
| Fiche Google = Apple = Bing = Facebook | Dimanche 8 novembre 2026 | P, A | |
| Search Console et Bing Webmaster Tools vérifiés | Dimanche 8 novembre 2026 | A | |
| Premier test de restauration réussi | Dimanche 15 novembre 2026 | A | |
| Premières pages en ligne, sans marqueur | Dimanche 29 novembre 2026 | A, P, J | |
| Heures des Fêtes sur Google, Apple, Bing et Facebook | Mardi 1er décembre 2026 | P, A | |
| Rapport mensuel de novembre | Vendredi 4 décembre 2026 | A ; approuvé par P | |
| Demande d'accès à l'interface de la fiche Google déposée | Dimanche 13 décembre 2026 | A | |
| Cahier de la commande signé | Dimanche 13 décembre 2026 | P, A, C, J | |
| Rapport mensuel de décembre | Vendredi 8 janvier 2027 | A ; approuvé par P | |
| Porte G10 réussie | Dimanche 10 janvier 2027 | P, A, C, J | |
| Commande en ligne ouverte ; 20 premières commandes sans erreur | Dimanche 24 janvier 2027 | A, P | |
| Re-mesure comparée à S1 ; 20 pages suivantes choisies | Dimanche 31 janvier 2027 | A | |
| Rapport mensuel de janvier | Vendredi 5 février 2027 | A ; approuvé par P | |

## 5. Ce qu'il faut attendre, honnêtement

- **En jours ou en semaines** : l'indexation, les visites des robots, les impressions sur les questions suivies, les premières citations dans les moteurs d'IA. Des praticiens observent que les citations des IA se rafraîchissent quelques jours ouvrables après la modification d'une page : c'est une observation, pas une garantie (référence rank-first 13 §9).
- **En mois** : les positions classiques d'un domaine neuf. Personne ne publie de chiffre fiable sur ce délai.
- **Noël 2026 se joue sur la fiche Google et Facebook**, pas sur le nouveau site. Décembre 2027 sera la première saison des Fêtes où le site pourra compter ([research/04 §0.6](../research/04-keywords-demand.md)).
- **Moins de clics avec plus de citations, c'est normal en 2026** : les réponses des IA gardent une partie des clics. On compte donc les commandes, les demandes, les appels et les itinéraires (plan-v1 §2).

**Définition de « premier »** (version corrigée de [research/12 §4](../research/12-plan-review.md), décision M14), mesurée sur quatre lundis de suite :

- **Ensemble mesuré** : 30 questions (après le remplacement) et les questions de marque B1 à B3 comme diagnostic. Chaque question passe trois fois par semaine dans chaque moteur ; une case compte si elle réussit au moins deux fois sur trois.
- **SEO** : notre domaine est 1er sur au moins la moitié des questions commerciales et locales, et dans les 3 premiers sur les autres. Pour les questions du type « meilleure pâtisserie », la 1re place compte aussi si le 1er résultat nous nomme en premier. Bloc local : dans les 3 premiers au point de la boutique et sur au moins la moitié d'une grille de 7 × 7 points dans un rayon de 3 km (proposition à ajuster après 4 mesures).
- **AEO** : notre texte tient l'extrait en vedette, une réponse « Autres questions posées » ou une citation dans l'Aperçu IA ou le Mode IA sur au moins le tiers des questions.
- **GEO** : la marque est nommée sur au moins la moitié des questions dans au moins deux moteurs d'IA, et notre domaine est le domaine de pâtisserie le plus souvent lié (les annuaires sont comptés à part).
- **Les trois doivent tenir sur l'ensemble et sur les seules questions en français.** Sur un domaine neuf, la barre SEO est difficile ([research/12 §4](../research/12-plan-review.md)) : aucune date n'est promise. Quand les trois tiennent, on élargit d'un cran (« pâtisserie Granby », les viennoiseries ; Bromont seulement avec une vraie livraison ; une langue de plus).

## 6. Hors de ces 90 jours (liste de coupes de [research/12 §5.1](../research/12-plan-review.md))

Gâteaux de mariage et quinceañera ; pages « sans gluten », véganes ou « sans noix » (allégations réglementées) ; espagnol au-delà de 3 à 5 pages, et seulement si quelqu'un le sert ; TikTok, Pinterest, WhatsApp ; pixels publicitaires ; tableau de bord Data Studio ; page comparative (après le lancement et un avis juridique) ; vidéos YouTube (à partir du mois 4, une par mois) ; créateur de gâteaux en ligne (environ trois mois après l'ouverture des demandes) ; cartes-cadeaux en ligne ; études de données au-delà de la première ; outils payants avant l'autotest 16 de [research/18 §2](../research/18-dated-claims-verification.md).

## 7. Budget

- **Votre plafond mensuel :** `[[FACT NEEDED: montant maximal par mois (research/14 M1)]]`. Sans plafond à la fin de S6, aucun outil payant ni inscription payante ([research/00 §14](../research/00-master-concept.md)).
- **Estimations connues** (toutes (est.)) : hébergement, textos et courriels ≈ 27 à 65 $ CA par mois ; frais de carte ≈ 3,4 à 3,6 % des ventes en ligne ; outils de mesure de 0 à ≈ 25 $ US par mois (SerpApi, source secondaire) ; appels aux interfaces des IA : `[[FACT NEEDED: coût par appel]]` ([research/19 §3.8](../research/19-build-workflow-and-requirements.md)).
- **Dépenses ponctuelles :** séance photo, réviseur anglais, juriste, comptable : `[[FACT NEEDED: montants (research/14 M2)]]`.
