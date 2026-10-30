# Rythme hebdomadaire — Pâtisserie Coco Vanille

Rédigé le jeudi 29 octobre 2026. Environ **6 heures par semaine pour l'agence**, en créneaux fixes, et **quelques minutes par jour pour vous** ([research/plan-v1-ranking-stack.md §9](../research/plan-v1-ranking-stack.md), budgets de temps de [research/16 §1.3](../research/16-admin-dashboard-spec.md)). Chaque tâche indique où elle se fait : un écran de Coco Studio (admin.cocovanillegranby.com), un outil gratuit de Google ou de Bing, ou une commande de l'agence.

Deux périodes :

- **Avant l'ouverture de la commande en ligne (S1 à S12, jusqu'au dimanche 24 janvier 2027)** : le mardi et le mercredi servent aux pages du lancement ([docs/01](01-plan-90-jours.md)). Tant que Coco Studio n'est pas en ligne sur le serveur, vos tâches passent par téléphone ou par courriel avec l'agence, et les réponses aux avis se font dans l'application de Google ([research/12 F11](../research/12-plan-review.md)).
- **Après (à partir de S13, le lundi 25 janvier 2027)** : une page par semaine.

## 1. Qui fait quoi, en un coup d'œil

| Quand | Vous (propriétaire) | L'équipe au comptoir | L'agence | Où |
|---|---|---|---|---|
| Chaque jour d'ouverture | **10 minutes au plus** : coup d'œil, demandes de gâteaux, avis, messages, photo de la vitrine | **5 minutes au plus par quart** : commandes prêtes, remises, « Épuisé » | ≈ 10 minutes : une action de mention, une question de client notée | Coco Studio : Aujourd'hui, Demandes, Avis, Messages, Vitrine |
| Lundi | **5 minutes** : lire « Cette semaine », répondre à 3 cartes au plus | — | **1 heure** (environ 1 h 45 tant que les moteurs d'IA se relèvent à la main, [scoreboard/README §7](../scoreboard/README.md)) : mesurer, choisir les 3 actions de la semaine | Plus › Cette semaine ; rapport du lundi |
| Mardi et mercredi | Approuver les faits de la nouvelle page | — | **3 heures** : une page | Avancé ; préproduction |
| Jeudi | — | — | **1 heure** : une action hors du site, une publication | Fiche Google, Facebook, courriel |
| Vendredi | — | — | **1 heure + 30 minutes de serveur** : vérifier | Search Console, Bing, commandes de vérification, Agence |
| Chaque mois | **15 minutes** : approuver le rapport | — | ≈ 2 heures | [docs/07](07-rapport-mensuel.md) |
| Chaque trimestre | **30 minutes** : valider les chiffres | — | ≈ 1 journée | Étude de données, révisions |

Règle : quand une tâche dépasse son temps prévu pendant deux semaines (mesuré dans le journal de Coco Studio), elle va sur la liste de corrections de l'agence ([research/16 §1.3](../research/16-admin-dashboard-spec.md)).

## 2. L'heure du lundi (agence) : mesurer et choisir

| Étape | Quoi | Où | Résultat |
|---|---|---|---|
| 1 | **À 6 h, heure du Québec, la mesure part toute seule** : positions dans Google.ca réglé sur Granby (si la clé SerpApi existe), réponses des moteurs d'IA (si leurs clés existent), Signaux Web essentiels (quand le site est public), puis le calcul du tableau de bord, la carte du marché, Search Console et GA4 (si le compte de service existe) et les vérifications en direct. Une étape sans clé est sautée et nommée dans le rapport. **Attention :** l'outil des moteurs d'IA règle encore sa recherche sur le Maroc (réglage hérité du modèle) : ses réponses ne comptent pas tant que ce n'est pas corrigé ([scoreboard/README §6](../scoreboard/README.md)) | GitHub › Actions › « Weekly rank-first » ([.github/workflows/weekly.yml](../.github/workflows/weekly.yml)) | Le rapport de la semaine dans le résumé de l'exécution ; l'historique est gardé 90 jours |
| 2 | Lire le rapport | Le résumé de l'exécution. Coco Studio › Agence › « Gates » et « Scoreboard » afficheront ces chiffres quand les fichiers du rapport seront déposés dans le dossier des rapports du serveur ; ce transfert n'est pas encore branché | Les chiffres de la semaine |
| 3 | Remplir à la main ce que la mesure automatique ne voit pas : Copilot et le Mode IA de Google (pas d'interface de programmation), les moteurs sans clé, et les captures de la personne qui vérifie sur cellulaire à Granby | `scoreboard/runs/<semaine>.csv`, puis le calcul (encadré ci-dessous) | Une ligne par question et par moteur |
| 4 | Lire Search Console : Performances filtrées sur les questions suivies (jamais la moyenne de tout le site), rapport « IA générative » (des impressions seulement, ni clics ni requêtes), Pages. Lire Bing Webmaster Tools › AI Performance (un échantillon, exportable en CSV seulement) | search.google.com/search-console ; bing.com/webmasters | La tendance sur 4 semaines |
| 5 | Chercher les **faits faux** dans les réponses des IA, surtout les heures et le téléphone : le 29 octobre 2026, la réponse à « Coco Vanille Granby heures » donnait les heures et le téléphone d'une boulangerie fermée, le (450) 770-7246 (déduit), et une autre répétait « peut-être temporairement fermée » ([research/05 W44.5](../research/05-serp-baseline.md)). On corrige à la source : la fiche Google d'abord, puis les annuaires qui la copient | Rapport ; [docs/09 §3.4](09-runbook-incident.md) | Une demande de correction |
| 6 | Choisir les **3 actions de la semaine** : la question la plus proche du but, la page à attaquer, la mention à obtenir | [docs/19-marche-et-concurrence.md](19-marche-et-concurrence.md) ; les 10 questions prioritaires de [research/05 W44.7](../research/05-serp-baseline.md) | Les 3 actions, inscrites dans [docs/13](13-taches-humaines.md) section B |
| 7 | Préparer ce qui partira cette semaine : le plan de la page ([docs/08-brief-page.md](08-brief-page.md)), la publication de la fiche Google, la publication Facebook, les réponses aux avis, la demande hors du site ([docs/04](04-pitch-media.md), [docs/06](06-annuaires-listicles.md)) | Brouillons | Tout est prêt le lundi midi |

> **Pour l'agence — refaire le calcul à la main** (même dossier que la mesure automatique) :
> ```sh
> mkdir -p rank/scoreboard/runs rank/reports
> node apps/web/scripts/rank-config.mjs --out rank/site.config.json
> cp data/prompts.csv data/competitors.csv rank/scoreboard/
> # copier ici l'historique de la dernière exécution (artefact « rank-first-history ») et le CSV rempli à la main
> cd rank
> # si la clé SerpApi existe, d'abord la recherche Google, toujours avec ces options (sans elles, l'outil cherche dans google.co.ma) :
> # node ../tools/serp.mjs --week 2026-W45 --gl ca --domain google.ca --location "Granby,Quebec,Canada"
> node ../tools/weekly.mjs --week 2026-W45 --no-serp --no-ai
> ```
> Comme dans `weekly.yml`, `weekly.mjs` tourne avec `--no-serp --no-ai` : lancé seul, il appellerait la recherche Google et les moteurs d'IA avec leurs réglages marocains par défaut ([scoreboard/README §6](../scoreboard/README.md)). Sans clé, `weekly.mjs` saute la mesure concernée et le dit dans le rapport. Sans clés d'IA, chaque question ne passe qu'une fois par semaine au lieu de trois : la définition de « premier » de [docs/01 §5](01-plan-90-jours.md) est alors une **mesure partielle**, et le rapport le dit.

## 3. Vos 5 minutes du lundi : Coco Studio › Plus › « Cette semaine »

- **Cinq chiffres** lisibles en cinq secondes : commandes en ligne (nombre, montant, variation), demandes de gâteaux (reçues, chiffrées), avis (nouveaux, note, combien répondus en 24 heures), appels et itinéraires depuis le site (affiche « pas encore relié » tant que GA4 n'est pas installé), citations par les IA (affiche « pas encore mesuré » tant que les rapports ne sont pas déposés).
- **Trois cartes au plus**, la plus urgente en premier : confirmer les heures, fixer l'acompte, valider un prix manquant, indiquer la capacité par jour, dire si la boutique est ouverte un jour férié qui arrive dans les 30 jours.
- **Score de présence** : il ne s'affiche qu'après quatre semaines de mesure, et ne remplace jamais les trois tableaux de bord ([research/15 D24](../research/15-decisions-and-risks.md)).
- **Jamais de chiffre par employé** (décision M2).
- **Le courriel du lundi** qui reprend ces chiffres est prévu, pas encore branché. D'ici là, l'agence vous envoie un résumé de cinq lignes par courriel.

## 4. Mardi et mercredi (agence, 3 heures) : une page

1. **Le plan de la page** ([docs/08-brief-page.md](08-brief-page.md)) : la question visée, ce que Google montre pour elle, les sous-questions, les faits nécessaires. Les faits viennent seulement de [data/facts.json](../data/facts.json) et de Coco Studio.
2. **Vous approuvez les faits** (par courriel pour l'instant ; une carte d'approbation dans Coco Studio est prévue, pas encore construite). Pas de fait approuvé, pas de page : la garde de publication l'empêche.
3. **Écrire.** Le français d'abord ; l'anglais seulement si quelqu'un sert en anglais, et jamais plus complet que le français (Charte de la langue française). Modifier une page existante se fait dans Coco Studio › Plus › Avancé (pages, FAQ, traductions) : la page se rafraîchit aussitôt. Créer une nouvelle adresse demande une modification du code (registre des pages), donc les vérifications automatiques et un déploiement.
4. **Vérifications automatiques** à chaque modification du code : tests, contrat de page, liens, accessibilité. Rouge = rien ne passe ([infra/README.md](../infra/README.md)).
5. **Préproduction** : on regarde la page sur un cellulaire (staging.cocovanillegranby.com).
6. **Production** : déploiement manuel avec approbation (GitHub › Actions › « Deploy production ») ; ensuite, la vérification des adresses et de l'accès des robots se fait toute seule de l'extérieur.
7. **Avertir les moteurs** : IndexNow pour Bing et les autres moteurs qui l'utilisent, à la main tant que ce n'est pas automatique (`node tools/indexnow.mjs https://cocovanillegranby.com/<page>/`), et seulement une fois que le site sert le fichier de clé ([docs/12 §2](12-setup-mesure.md)) ; d'ici là, soumission de l'adresse dans Bing Webmaster Tools. Google n'utilise pas IndexNow : Search Console › Inspection de l'URL › « Demander l'indexation ».
8. **Trois liens internes** vers la nouvelle page, depuis des pages qui sont déjà vues par Google.
9. **Boucle des extraits** : si la page vise une question, on vérifie aux jours 7 et 14 qui tient l'extrait.

## 5. Chaque jour : avis, messages, vitrine

| Tâche | Qui | Où | Règle |
|---|---|---|---|
| Demander un avis | Vous et l'équipe | La carte QR dans chaque boîte (elle mène à `cocovanillegranby.com/avis`), le lien sur le reçu, une phrase au comptoir : « Si vous avez deux minutes, un avis Google nous aide beaucoup. » | À tout le monde, sans tri. Jamais « 5 étoiles », jamais un produit ou un employé nommé, jamais un cadeau. Un courriel de demande seulement aux clients qui ont coché la case ([research/11 §4](../research/11-offsite-local-citations.md) ; décisions M3, M23) |
| Noter un nouvel avis Google | Vous ou le gérant | Coco Studio › Avis › « Ajouter un avis » | À la main, tant que l'accès à l'interface de la fiche Google n'est pas approuvé |
| Répondre à l'avis | Vous ou le gérant | Coco Studio › Avis : le brouillon est prêt dans la langue de l'avis → « Copier la réponse » → « Ouvrir Google » → coller → « J'ai répondu » | **En moins de 24 heures, jours de fermeture compris** (M1). Signé « — L'équipe Coco Vanille ». Pour un avis de 1 à 3 étoiles, Studio propose d'appeler le client si une commande correspond |
| « Écrivez-nous » | Vous et l'équipe | Coco Studio › Messages | Répondre pendant les heures d'ouverture, ou mettre le clavardage en pause. L'agence ne voit pas ces messages (Loi 25) |
| Question entendue au comptoir | Vous et l'équipe | Coco Studio › Plus › « Noter une question de client » | Une ligne suffit : elle devient une réponse de la FAQ |
| Photo de la vitrine, « Épuisé » | L'équipe | Coco Studio › Vitrine | Photo réelle seulement |

## 6. Jeudi (agence, 1 heure) : se faire mentionner

- **Une action hors du site** : une demande de correction, une inscription, une demande à un partenaire ou une proposition à un média ([docs/04](04-pitch-media.md), [docs/06](06-annuaires-listicles.md), [data/directories.csv](../data/directories.csv), [data/pitch-list.csv](../data/pitch-list.csv)). Elle part d'une vraie boîte de courriel.
- **Une publication sur la fiche Google et une sur Facebook ou Instagram** : une photo, trois endroits, **trois publications par semaine au plus en tout** ([research/15 D17](../research/15-decisions-and-risks.md)).
- **Contrôle** : les cartes QR sont dans les boîtes, chaque avis de la semaine a sa réponse.

## 7. L'heure du vendredi (agence) : vérifier

| Contrôle | Où | Ce qui doit être vrai |
|---|---|---|
| Indexation et santé | Search Console › Pages, Signaux Web essentiels, Problèmes de sécurité, Actions manuelles | Aucune nouvelle erreur ; alertes par courriel activées |
| Contrôle de l'IA générative (premier vendredi du mois) | Search Console › Paramètres | « Inclure » : sinon, aucune visibilité dans l'Aperçu IA ni le Mode IA ([research/06 (e)](../research/06-seo-aeo-geo-2026-verified.md)) |
| Mise à jour de Google en cours? | status.search.google.com | Si oui : aucune conclusion tant qu'elle n'est pas finie ; on le note dans le rapport |
| Adresses du site | `node tools/check-urls.mjs https://cocovanillegranby.com/sitemap.xml` | Chaque page répond 200, au plus une redirection, la bonne adresse canonique, aucun « noindex » sur une page publique |
| Accès des robots | `node tools/crawler-access.mjs --sitemap https://cocovanillegranby.com/sitemap.xml --max 5` | Aucun robot bloqué (Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, Claude-SearchBot, Applebot…) |
| Serveur (≈ 30 minutes, liste du vendredi de [infra/README.md](../infra/README.md)) | Serveur et outils de surveillance | Alertes lues ; mises à jour de sécurité vérifiées ; disque à moins de 70 % ; certificat valide plus de 30 jours ; sauvegarde de la nuit reçue ; dernier test de restauration réussi et âgé de moins de 31 jours ; liste des faits manquants envoyée si elle a changé |
| Coco Studio › Agence | Tuiles « Système » et « Intégrations », « Questions de clients à traiter », journal | Rien d'ouvert sans responsable |
| Premier vendredi du mois | `node tools/log-bots.mjs <journal du site public> --verify --week` (décompresser les anciens journaux d'abord) ; revue des accès (anciens employés) ; coûts | Googlebot et Bingbot passent chaque semaine sur les pages clés ; au moins deux robots d'IA passent ; aucun accès oublié |

## 8. Chaque mois et chaque trimestre

**Chaque mois** (≈ 2 heures pour l'agence, 15 minutes pour vous) : comparaison sur 4 semaines ; comparaison de chaque fiche d'annuaire avec la fiche Google ([research/11 §1](../research/11-offsite-local-citations.md)) ; compte des mentions (alertes Google et recherche manuelle de « "Coco Vanille" Granby ») ; journaux du serveur ; résultat du test de restauration du premier lundi ; nouvelles photos sur la fiche Google ; **rapport mensuel** ([docs/07](07-rapport-mensuel.md)) que vous approuvez.

**Chaque trimestre** (≈ 1 journée pour l'agence, 30 minutes pour vous) : l'étude de données (la première : le relevé des prix des gâteaux du premier trimestre 2027) ; revérification avec vous de chaque chiffre des 20 premières pages ; audit des liens (Search Console, Ahrefs Webmaster Tools ; on ne désavoue un lien qu'en cas d'action manuelle) ; revue de l'index (une page sans impression depuis 6 mois est améliorée, fusionnée ou retirée de l'index) ; rotation des clés et exercice de restauration hors site ([infra/README.md](../infra/README.md)) ; relecture des prix des fournisseurs.

## 9. Le programme rapide qui reste permis

Aller vite sans tricher (référence rank-first 09 §6, adaptée) : une page par semaine après le lancement ; chaque client invité à laisser un avis le jour même ; une étude de données par trimestre ; la tournée des annuaires et des listes « meilleures pâtisseries » chaque jeudi ; la tournée des mentions sans lien chaque mois ; un outil gratuit utile (le calculateur de portions, si vos portions sont connues) ; une page comparative honnête (après le lancement et un avis juridique) ; des vidéos à partir du mois 4 ; la marque visible hors ligne (vitrine, autocollant sur les boîtes, reçus, signature de courriel). La petite publicité permanente sur le nom de marque attend un budget publicitaire ([research/12 §5.1](../research/12-plan-review.md)).

## 10. Règles de lecture

- Jamais de réaction à une seule journée : un changement est réel après **quatre semaines dans la même direction**.
- Aucune conclusion pendant une mise à jour majeure de Google annoncée.
- Comparer avec la même période de l'année précédente. La première année, il n'y en a pas : on compare avec les semaines de départ et avec le calendrier des saisons (Fêtes, Saint-Valentin, Pâques, saison du Zoo, rentrée ; [research/04 §6](../research/04-keywords-demand.md)).
- **Un changement à la fois**, puis 14 jours d'attente, en comparant avec des pages qu'on n'a pas touchées (plan-v1, couche 21).
- Des signaux qui montent pendant 8 semaines avec des commandes stables : c'est tôt. Des signaux plats après 8 semaines : on change l'approche (plan-v1 §11).
- Des chiffres de boutique seulement, jamais par employé.

## 11. Les écrans de Coco Studio qui servent ce rythme

| Écran | Existe | Sert à |
|---|---|---|
| Aujourd'hui · Commandes · Vitrine · Demandes · Avis · Boutique & heures | Oui (construit) | Le quotidien : cueillettes, gâteaux sur commande, avis, heures et fermetures, pause des commandes |
| Plus › Cette semaine | Oui | Vos 5 minutes du lundi |
| Plus › Messages (« Écrivez-nous ») | Oui | Le clavardage du site |
| Plus › Produits · Noter une question · Réglages | Oui | Prix, allergènes, taxes ; FAQ ; lien d'avis, équipe, NIP |
| Agence | Oui, mais « Gates » et « Scoreboard » restent vides tant que les rapports ne sont pas déposés sur le serveur | Lecture des rapports, intégrations, système, journal |
| Plus › Avancé | Oui (l'administration de Payload) | Pages, FAQ, traductions, médias, modèles de messages |
| Recherche · Visibilité IA · Mentions · Analytique | Non : prévus dans une version suivante ([research/00 §13](../research/00-master-concept.md)) | En attendant : le rapport du lundi et [docs/07](07-rapport-mensuel.md) |
