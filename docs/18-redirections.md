# Carte des redirections — Pâtisserie Coco Vanille (cocovanillegranby.com)

**Couches 5.3 et 18.6 de la méthode : chaque changement d'adresse jamais fait, gardé au moins un an. Une adresse qui disparaît sans redirection perd ses liens et ses positions.**

| | |
|---|---|
| Mis à jour | 29 octobre 2026 |
| Préparé par | Yahya (BrandHub.ma), l'Agence |
| Lu dans | `infra/nginx/sites/cocovanillegranby.com.conf`, `infra/nginx/sites/00-default.conf`, `infra/nginx/sites/admin.cocovanillegranby.com.conf`, `infra/nginx/sites/staging.cocovanillegranby.com.conf`, `apps/web/src/proxy.js`, `apps/web/src/lib/public-paths.js`, `apps/web/src/app/avis/route.js`, `apps/web/src/collections/Content.js` (collection « redirections »), `infra/README.md` |
| S'appuie sur | research/01 §1 et §7 (aucun ancien site trouvé), research/17 §10 (domaine et hôte canonique), research/12 (M7, M8, M9, C7, C21), research/14 T2 et T7, research/00 §5.1, plan-v1 §4 (couche 5) |
| Voir aussi | [docs/17-architecture.md](17-architecture.md) (les adresses de chaque page) · [docs/09-runbook-incident.md](09-runbook-incident.md) (en cas de baisse) · [docs/06-annuaires-listicles.md](06-annuaires-listicles.md) (les fiches à mettre à jour) · [docs/05-gbp-checklist.md](05-gbp-checklist.md) (le lien de la fiche Google) |

Mots utilisés :
- **Redirection 301** : « cette page a déménagé pour de bon ». Le navigateur et Google suivent vers la nouvelle adresse, et Google y transfère les liens et la réputation de l'ancienne.
- **Redirection 302** : « déménagement temporaire ». Google garde l'ancienne adresse. On ne s'en sert que pour un lien dont la cible change souvent (le code QR des avis).
- **404** : « cette page n'existe pas ». **410** : « cette page a été retirée pour de bon ».
- **Hôte canonique** : la seule forme officielle de l'adresse du site, ici `https://cocovanillegranby.com` (sans www).
- **Chaîne de redirections** : plusieurs redirections de suite. On n'en veut aucune : une seule redirection, directement vers l'adresse finale.

---

## En bref

1. **Il n'y a rien à rediriger aujourd'hui.** Aucun ancien site de la Pâtisserie Coco Vanille n'a été trouvé : ni domaine, ni boutique en ligne (recherches sur cocovanille.ca, patisseriecocovanille.com et les noms de compte, research/01 §1 et §7; research/17 §10.2). Le nouveau site n'a encore jamais été en ligne, donc aucune de ses adresses n'a été indexée.
2. **Une question reste ouverte :** avez-vous déjà utilisé une autre adresse (lien de bio Linktree, boutique Square en ligne, boutique Facebook, ancien site)? [[FACT NEEDED: anciennes adresses à rediriger (research/14 T7)]]. Si oui, chacune reçoit sa 301 avant la mise en ligne.
3. **Les règles d'hôte sont déjà écrites** dans la configuration du serveur (nginx) et du site : un seul hôte, HTTPS, sans www, une barre oblique à la fin de chaque adresse, le français à la racine, l'anglais sous `/en/`, l'espagnol sous `/es/` quand il ouvrira (§1).
4. **Trois choses à brancher avant le premier vrai changement d'adresse, et un domaine à enregistrer** : la collection des redirections existe dans la base de données mais le site ne la lit pas encore; IndexNow n'est pas branché; les adresses tapées sans barre oblique sur `http://` ou `www` passent par deux redirections au lieu d'une; le domaine de défense `cocovanillegranby.ca` attend votre accord (§5).
5. **La règle pour tout changement futur** tient en une phrase : on évite de changer une adresse; si on doit le faire, une seule 301 de l'ancienne vers la nouvelle, gardée au moins un an, et on met à jour les liens internes, le plan du site et les fiches externes le jour même (§4).

---

## 1. Les règles d'hôte et d'adresse (en place dans la configuration, à vérifier à la mise en ligne)

| Demande | Réponse | Où c'est réglé | Vérifié |
|---|---|---|---|
| `http://cocovanillegranby.com/…` et `http://www.cocovanillegranby.com/…` | 301 vers `https://cocovanillegranby.com/…` (même chemin), en une étape | nginx, `cocovanillegranby.com.conf` (port 80) | ☐ |
| `https://www.cocovanillegranby.com/…` | 301 vers `https://cocovanillegranby.com/…` | nginx, bloc « www → apex » | ☐ |
| Une adresse de page sans barre oblique finale (ex. `/carte`) | 301 vers la même adresse avec la barre (`/carte/`), paramètres gardés | `apps/web/src/proxy.js` | ☐ |
| Un fichier (`/sitemap.xml`, `/robots.txt`, une image) | aucune redirection | `proxy.js` (les fichiers sont reconnus à leur extension) | ☐ |
| Une adresse inconnue (ni dans le registre, ni un produit, ni une boîte) | vraie 404 : la page « introuvable » de la langue de l'adresse, rendue par le serveur | `proxy.js` et `public-paths.js` | ☐ |
| Une adresse en majuscules (ex. `/Carte/`) | 404 (aucun doublon possible) | `public-paths.js` | ☐ |
| `/admin`, `/api`, `/studio` sur le site public | 404 | `proxy.js` et nginx (défense en double) | ☐ |
| L'adresse IP du serveur ou un hôte inconnu | connexion fermée (code 444), pour qu'aucune copie du site ne soit indexée sous l'adresse IP | nginx, `00-default.conf` | ☐ |
| `https://admin.cocovanillegranby.com/…` (Coco Studio) | jamais indexé : en-tête « noindex » sur chaque réponse; son robots.txt autorise l'exploration pour que Google voie ce « noindex » | nginx + `proxy.js` (décision M7; research/12 C21) | ☐ |
| `https://staging.cocovanillegranby.com/…` (site de répétition) | mot de passe + « noindex » | nginx, `staging.cocovanillegranby.com.conf` | ☐ |
| `/` (français, fr-CA) · `/en/` (anglais, en-CA) · `/es/` (espagnol) | aucune redirection automatique selon la langue du navigateur ou l'adresse IP; le sélecteur de langue mène à la page équivalente | `routes.js`, `Header.js` (research/15 D2; Charte de la langue française) | ☐ |
| `/es/…` tant que l'espagnol est fermé (réglage `ENABLE_ES`) | 404 (page introuvable en français) | `public-paths.js` | ☐ |
| `/avis/` (le code QR des boîtes) | 302 vers la page d'avis Google, avec « noindex »; la cible se change dans Coco Studio sans réimprimer les cartes | `apps/web/src/app/avis/route.js` (research/11 §4.2) | ☐ |

**Cartes QR :** l'adresse courte imprimée en texte, `cocovanillegranby.com/avis` ([docs/03-messages-avis.md](03-messages-avis.md)), fonctionne : elle passe par une 301 vers `/avis/`, puis par la 302. Dans le code QR lui-même, que personne ne lit, on encode `https://cocovanillegranby.com/avis/`, avec la barre oblique finale : une étape de moins à chaque scan.

**À propos de l'outil de contrôle :** le rapport du 28 octobre 2026 signale « pas de fichier `_redirects` ni `.htaccess` ». C'est normal ici : ces fichiers servent à d'autres hébergements; sur ce serveur, les redirections d'hôte sont dans nginx.

---

## 2. Historique des changements d'adresse

Rien n'a encore changé. Chaque ligne future s'ajoute ici, en plus de son inscription dans la configuration (§4).

| Date | Ancienne adresse | Nouvelle adresse | Code | Raison | Vérifié |
|---|---|---|---|---|---|
| à la mise en ligne : [[FACT NEEDED: date de mise en ligne]] | `http://cocovanillegranby.com/*`, `http://www.cocovanillegranby.com/*`, `https://www.cocovanillegranby.com/*` | `https://cocovanillegranby.com/*` | 301 | un seul hôte, HTTPS | ☐ |
| à l'enregistrement du domaine : [[FACT NEEDED: accord pour enregistrer cocovanillegranby.ca au nom de l'entreprise (research/14 T2)]] | `https://cocovanillegranby.ca/*` (et les autres domaines de défense, s'il y en a) | `https://cocovanillegranby.com/*` (même chemin) | 301 | domaine de défense (research/17 §10.1). **Pas encore configuré** : aucun bloc nginx ni certificat pour le `.ca` | ☐ |
| [[FACT NEEDED: anciennes adresses (research/14 T7)]] | — | — | 301 | ancien lien de bio, boutique en ligne ou ancien site, s'il y en a | ☐ |

### Adresses prévues puis abandonnées avant toute mise en ligne

Ces adresses ont figuré dans des plans, jamais sur Internet : aucune redirection n'est nécessaire. Si l'une d'elles a été imprimée ou partagée (affiche, publication Facebook), on ajoute une 301 vers l'adresse retenue.

| Adresse abandonnée | Adresse retenue | Pourquoi | Source |
|---|---|---|---|
| `/gateaux-personnalises/`, `/gateaux-de-fete/` | `/gateaux-personnalises-granby/` (anniversaire inclus, sauf si le test de chevauchement dit le contraire) | règle de research/04 §2; adresses fixées une fois | research/00 §5.1 |
| `/sans-gluten-allergies/` (et `/en/gluten-free-allergies/`) | `/allergenes/` (`/en/allergens/`) | une adresse « sans gluten » est déjà une allégation encadrée | research/12 B2; research/07 A-6 |
| `/panier/`, `/commander/reprendre/<jeton>/` | `/boite/` et `/boite/<jeton>/` | le mot « Ma boîte » de l'interface | research/00 §5.1 |
| `/noel/buches/`, `/es/troncos-de-navidad/` | `/buches-de-noel/`, `/es/tronco-de-navidad/` | règle de research/04 | research/00 §5.1 |
| `/corporatif/`, `/boites-corporatives/` | `/boites-bureau-corporatif/` (page prévue, conditionnelle) | groupe de mots-clés L7 | research/00 §5.1 |
| `/commande/` | `/commander/` | 5 sources contre 1 | research/00 §5.1 |
| `/studio/` sur le site public | Coco Studio sur `admin.cocovanillegranby.com` | l'administration n'est jamais sur le site public | décision M7 |
| `/en-visite-a-granby/` au lancement | la section Zoo et visiteurs de `/nous-trouver/` (la page dédiée reste prévue, conditionnelle) | une requête, une page; pas de page mince en double | research/00 §5.1 |

---

## 3. Les profils et fiches à faire pointer vers le site

Ce ne sont pas des redirections, mais ce sont les liens qui comptent le plus le jour de la mise en ligne (research/17 §10.2). Adresse actuelle du site web sur la fiche Google et sur Facebook : [[FACT NEEDED: lien actuel du champ « site web » (accès à la fiche, research/14 S2, T5)]].

| Où | Lien | Note |
|---|---|---|
| Fiche Google, champ « site web » | `https://cocovanillegranby.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile` | format exact de plan-v1 §11; les paramètres servent à reconnaître ces visites, la balise canonique de la page reste l'adresse sans paramètres |
| Fiche Google, lien de commande | `https://cocovanillegranby.com/commander/` | seulement si la fiche offre la section « Commander en ligne » pour une pâtisserie (test T2, research/06 (d)) |
| Apple Business, action « Commander » | `https://cocovanillegranby.com/commander/` | paramètres de suivi permis ou non : à voir dans le formulaire d'Apple (test T3) |
| Bing Places, Facebook (« Site web »), bio Instagram | `https://cocovanillegranby.com/` | Instagram : compte à confirmer (research/14 T4) |
| Répertoires (Three Best Rated, RestoMontreal, PagesJaunes, Yelp, Tripadvisor…) | `https://cocovanillegranby.com/` | le même nom, la même adresse et le même téléphone partout ([docs/06-annuaires-listicles.md](06-annuaires-listicles.md)) |
| Cartes QR et reçus papier | texte imprimé : `cocovanillegranby.com/avis`; code QR : `https://cocovanillegranby.com/avis/` | les deux mènent à la page d'avis Google (§1) |

---

## 4. La règle pour tout changement d'adresse futur

1. **D'abord, ne pas changer.** Une adresse se fixe une fois (plan-v1, couche 9). On modifie le contenu de la page, pas son adresse. Une page de fête garde la même adresse chaque année; hors saison, elle annonce la prochaine (research/04 §6.1).
2. **Faire l'inventaire** avant de toucher quoi que ce soit : dans Search Console, les pages qui ont des impressions, des clics ou des liens; dans Bing Webmaster Tools, la même chose; les liens d'autres sites, s'il y en a.
3. **Une 301 par adresse, de l'ancienne directement vers la nouvelle** : jamais une chaîne, jamais tout vers l'accueil. On la garde au moins un an (le plus longtemps possible).
4. **Changer l'adresse au même endroit pour tout le site** : le registre `apps/web/src/lib/routes.js` (ou le « slug » du produit dans Coco Studio). Le plan du site, la balise canonique et les liens hreflang suivent tout seuls, parce qu'ils sont générés à partir du registre.
5. **Mettre à jour les liens internes** pour qu'aucun lien du site ne passe par la redirection : menus, pied de page, liens dans le texte ([docs/17-architecture.md](17-architecture.md) §4).
6. **Mettre à jour les liens externes** : fiche Google (site web, produits, publications épinglées), Apple, Bing, Facebook, Instagram, répertoires ([docs/06-annuaires-listicles.md](06-annuaires-listicles.md)).
7. **Prévenir les moteurs** : demande d'indexation de la nouvelle adresse dans Search Console; avis à Bing par IndexNow (`node tools/indexnow.mjs <adresse>`, une fois la clé publiée sur le site, §5).
8. **Surveiller** chaque jour pendant un mois les rapports « Pages » et « Performances » de Search Console.
9. **Inscrire le changement** dans le tableau du §2 : date, ancienne adresse, nouvelle, code, raison, vérification.

### Les cas particuliers

| Situation | Ce qu'on fait |
|---|---|
| Un produit quitte la carte pour de bon | Aujourd'hui, sa page disparaît (404) et sort du plan du site (`sitemap.xml`). Si la page avait des visites ou des liens : 301 vers sa famille (ex. `/patisseries/`) ou vers le produit qui le remplace; sinon 410 |
| Un produit est simplement épuisé | aucune redirection : la page reste, avec « Épuisé aujourd'hui » ou « De retour le [date] » |
| Une page de fête hors saison | aucune redirection, aucune suppression : « Saison terminée, de retour le [date] » |
| Une page déjà en ligne qui redevient incomplète | à éviter : en production, le verrou cache toute page qui contient un [[FACT NEEDED]], et la page répond alors 404. Pour une offre retirée, on garde la page avec la nouvelle réalité (ou une 301 vers la page la plus proche), plutôt que d'y remettre une mention manquante |
| Le volet espagnol ouvre, puis ferme | chaque adresse espagnole indexée reçoit une 301 vers son équivalent français, ou une 410 si elle n'en a pas |
| Le nom de la boutique change d'écriture (« Coco Vanille » ou « Cocovanille ») | aucune adresse ne change : le domaine reste `cocovanillegranby.com` |
| Le mot « cueillette » devient « ramassage » | aucune adresse ne contient ce mot : rien à rediriger |
| Un changement de domaine (non prévu) | une 301 par chemin vers le même chemin sur le nouveau domaine, plus l'outil « Changement d'adresse » de Search Console |
| Un lien externe mal écrit (majuscules, faute) qui reçoit des visites | une 301 vers la bonne adresse, inscrite au §2 |

---

## 5. À brancher avant le premier changement d'adresse

Constats faits en lisant le code le 29 octobre 2026. Ce sont des tâches pour les ingénieurs, après la refonte en cours.

| # | Constat | Pourquoi ça compte | Proposition |
|---|---|---|---|
| 1 | La collection des redirections (`redirects` : ancienne adresse, nouvelle adresse, code 301, 302 ou 410) existe dans la base de données et dans Coco Studio › Avancé, mais le site ne la lit pas : le serveur renvoie toute adresse inconnue vers la page 404 (`proxy.js`). C'est aussi noté dans `infra/README.md` (« Old URLs ») | une redirection saisie dans Studio n'aurait aucun effet | lire la collection avant la 404 (une seule étape, sans chaîne), et ajouter un test |
| 2 | IndexNow n'est pas branché : la variable `INDEXNOW_KEY` est prévue dans `infra/.env.example`, mais le site ne publie pas le fichier de clé et n'envoie aucun avis à la publication | Bing (et Copilot) apprennent les changements plus lentement | publier le fichier de clé et l'envoi à chaque publication; d'ici là, `node tools/indexnow.mjs` à la main |
| 3 | Une adresse tapée sans barre oblique sur `http://` ou `www` (ex. `http://www.cocovanillegranby.com/carte`) passe par deux redirections : nginx vers `https://cocovanillegranby.com/carte`, puis le site vers `/carte/` | plan-v1 (couche 5) demande une seule étape; l'effet est faible, parce que tous nos liens ont déjà la bonne forme | ajouter la barre oblique dans la même redirection nginx, pour les chemins de pages |
| 4 | Le domaine de défense `cocovanillegranby.ca` n'est pas encore enregistré par la boutique (sa disponibilité n'a pas été vérifiée, research/17 §10.1) ni configuré sur le serveur | sans lui, quelqu'un d'autre peut l'enregistrer | votre accord (research/14 T2), puis l'enregistrement au nom de l'entreprise et un bloc nginx avec certificat |

---

## 6. Vérifier après la mise en ligne

Avec les scripts du dossier `tools/` (les mêmes que ceux de la méthode) :
- `node tools/check-urls.mjs https://cocovanillegranby.com/sitemap.xml` : code de chaque adresse, chaînes de redirections, balise canonique, « noindex », variantes d'hôte.
- `node tools/check-urls.mjs http://cocovanillegranby.com/ http://www.cocovanillegranby.com/ https://www.cocovanillegranby.com/carte` : chaque variante doit finir en une 301 vers l'adresse officielle (voir le constat 3).
- `node tools/crawler-access.mjs --sitemap https://cocovanillegranby.com/sitemap.xml` : aucun robot de recherche ni d'IA bloqué.
- Dans Search Console : rapport « Pages » (aucune page importante « explorée, actuellement non indexée » à cause d'une redirection) et test d'une adresse en direct.

---

## Sources

- Configuration lue le 29 octobre 2026 : `infra/nginx/sites/cocovanillegranby.com.conf`, `00-default.conf`, `admin.cocovanillegranby.com.conf`, `staging.cocovanillegranby.com.conf`; `infra/README.md` (points ouverts); `infra/.env.example` (IndexNow).
- Code lu le 29 octobre 2026 : `apps/web/src/proxy.js`, `apps/web/src/lib/public-paths.js`, `apps/web/src/lib/routes.js`, `apps/web/src/app/avis/route.js`, `apps/web/src/app/sitemap.xml/route.js`, `apps/web/src/collections/Content.js`; rapport de contrôle du 28 octobre 2026 (`apps/web/reports/gate/audit.json`).
- research/01 §1 et §7; research/17 §10.1 à §10.3; research/12 (M7, M8, M9, B2, C7, C21); research/00 §5.1; research/04 §2 et §6.1; research/06 (d) et (c); research/11 §4.2; research/14 (S2, T2, T4, T5, T7); research/15 D2; plan-v1 §4 (couche 5) et §11.
