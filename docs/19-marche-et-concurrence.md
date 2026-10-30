# Marché et concurrence — Pâtisserie Coco Vanille

**Couches 7, 12, 14 et 15 de la méthode : la première place se prend à quelqu'un. Ce document dit à qui, sur quelle requête, avec quelle page et par quel coup.**

| | |
|---|---|
| Mis à jour | 29 octobre 2026 |
| Préparé par | Yahya (BrandHub.ma), l'Agence |
| Semaine | 2026-W44 (du lundi 26 octobre au dimanche 1er novembre 2026) |
| Mesures utilisées | Relevé indirect du 25 octobre 2026 (17 requêtes) et du 29 octobre 2026 (16 requêtes, 13 candidates et une variante), fait depuis les États-Unis ([research/05](../research/05-serp-baseline.md)) · lecture des sites de 4 concurrents le 29 octobre 2026 (`crawl/`) · fiches des concurrents de [research/03](../research/03-competitors.md) (vues le 25 octobre 2026) |
| Parties générées | Les blocs marqués **« Généré par market.mjs »** sont la sortie de `node tools/market.mjs` du 29 octobre 2026, recopiée telle quelle (copie brute : [scoreboard/market/2026-W44.md](../scoreboard/market/2026-W44.md)). Tout le reste est complété à la main à partir de research/03 et research/05. |
| Fichiers | [scoreboard/](../scoreboard/README.md) (requêtes, concurrents, relevés, cibles d'extraits) · `crawl/` (profils des sites concurrents) · [site.config.json](../site.config.json) |
| Voir aussi | [docs/16](16-recherche.md) (la recherche) · [docs/17](17-architecture.md) (les pages) · [docs/06](06-annuaires-listicles.md) (annuaires et palmarès) · [docs/05](05-gbp-checklist.md) (fiche Google) · [docs/03](03-messages-avis.md) (avis) · [docs/04](04-pitch-media.md) (médias) · [docs/14](14-calendrier-contenu.md) (calendrier) · [docs/01 §5](01-plan-90-jours.md) (définition de « premier ») · [docs/02](02-rythme-hebdo.md) (le lundi) · [docs/13](13-taches-humaines.md) (tâches à faire à la main) |

**À retenir avant de lire**

- Aucune mesure n'a encore été faite depuis Granby, ni dans les moteurs d'IA (ChatGPT, Perplexity, Gemini, Claude, Copilot). Tout ce qui touche aux positions vient d'un **relevé indirect** : une recherche faite depuis les États-Unis par un outil qui résume les résultats. Ce n'est pas la page que voit une personne à Granby : on n'y voit ni la carte, ni l'encadré de réponse, ni l'aperçu IA ([research/05](../research/05-serp-baseline.md), mise en garde).
- Le site cocovanillegranby.com est construit, pas en ligne : aucune de nos pages ne peut encore sortir.
- **Aucune position n'est promise.** Ce qui est promis : la méthode, la mesure de chaque lundi et la définition de « premier » ([docs/01 §5](01-plan-90-jours.md)).
- Les chiffres des concurrents sont des faits sur les concurrents, avec leur page et leur date. Ils ne deviennent jamais des chiffres de la Pâtisserie Coco Vanille.

## Les mots de ce document

- **Requête** : ce que les gens tapent dans Google ou demandent à une IA. Chaque requête suivie a un code (L3, C1, I3…).
- **Note sur 20** (gagnabilité) : nos chances de gagner une requête, selon quatre questions : les pages en tête sont-elles faibles? l'autorité nécessaire est-elle à notre portée? y a-t-il une place à prendre maintenant? la personne qui cherche veut-elle acheter? ([research/05 §5](../research/05-serp-baseline.md)).
- **Propriétaire d'une requête** : le site qui sort en premier, ou celui que la réponse utilise, aujourd'hui.
- **Répertoire** : un site qui liste des commerces avec leurs heures et leurs avis (RestoMontreal, Three Best Rated, Yelp).
- **Palmarès** (en anglais *listicle*) : un article-liste, du genre « Les 3 meilleures boulangeries de Granby ».
- **Extrait en vedette** : la réponse encadrée que Google affiche au-dessus des résultats. **Aperçu IA** et **Mode IA** : les réponses écrites par l'IA de Google, avec leurs sources.
- **Pack local** : les trois commerces que Google affiche avec la carte.
- **Part de voix** : la place qu'un site occupe dans les résultats de toutes les requêtes suivies.
- **Fiche Google** : votre Profil d'entreprise Google, la fiche que la carte affiche.
- **Les codes** : L3, C1, I3, X1… sont des requêtes ([scoreboard/prompts.csv](../scoreboard/prompts.csv)); « research/14 P4 », « research/14 S2 »… sont des questions du message au propriétaire ([research/14](../research/14-owner-questions.md)); S1 à S13 sont les semaines du [plan de 90 jours](01-plan-90-jours.md); M1 à M25 sont les décisions de [research/12 §3](../research/12-plan-review.md).

## En bref

1. **Aujourd'hui, ce ne sont pas des pâtisseries qui décident : ce sont deux répertoires.** Dans le relevé du 29 octobre 2026, RestoMontreal sort dans 20 recherches sur 30 (premier lien dans 14) et Three Best Rated dans 12. Les sites des pâtisseries de Granby ne sont sortis dans aucune des 47 recherches relevées les 25 et 29 octobre ([research/05 W44.4](../research/05-serp-baseline.md)).
2. **Les requêtes d'achat n'ont pas encore de propriétaire.** Dans 12 des 26 recherches hors marque du 29 octobre, la réponse dit ne trouver aucune source locale : commander un gâteau en ligne, un gâteau pour demain, la livraison, des boîtes pour le bureau, une boulangerie près du Zoo ([research/05 W44.0](../research/05-serp-baseline.md)).
3. **La boutique est déjà nommée, mais par la voix des autres** : dans 12 des 26 recherches hors marque du 29 octobre (2 sur 17 le 25 octobre), toujours par RestoMontreal ou Three Best Rated. Ce qu'ils disent est surtout bon (croissant aux amandes, Paris-Brest, gâteaux sur commande). Mais dans 4 recherches sur les gâteaux sur commande, la seule information donnée est la plainte de janvier 2026.
4. **Un fait faux circule.** À « Coco Vanille Granby heures », la réponse du 29 octobre donne des heures et un téléphone, le (450) 770-7246, qui sont ceux de Pain-Pain (déduit), une boulangerie fermée depuis le 16 juin 2026, en citant Three Best Rated. On corrige à la source : la fiche Google, puis les répertoires (coup n° 1).
5. **Sur les gâteaux sur commande, deux concurrents ont de l'avance en ligne** : Cake Design Granby et Avec un Grand A ont un panier et des prix publiés ([research/03 §0](../research/03-competitors.md)). Mais sur les 92 pages de concurrents lues le 29 octobre 2026, aucune n'est datée, aucune n'a de vidéo, aucune n'a de version anglaise, et une seule pose une question dans ses intertitres (au panier). La place de « la page qui répond » est libre, et le site construit a déjà cette forme.
6. **Les trois premiers coups** (§4) : les heures et le téléphone justes partout; la mise à jour du palmarès de Three Best Rated qui classe une boulangerie fermée en premier; l'entrée sur sa liste « pâtisseries », où la boutique n'est pas. Les pages suivent, au rythme de vos réponses.

---

## 1. Qui possède le marché aujourd'hui

### 1.1 Le calcul de l'outil

**Généré par market.mjs (29 octobre 2026)** :

> **Marché et concurrence — Pâtisserie Coco Vanille — semaine 2026-W44 (généré 2026-10-29 par market.mjs)**
>
> Objectif : la première place se prend à quelqu'un. Ce document dit à qui, sur quel prompt, avec quelle page, et par quel coup.
>
> Données : pas de run SERP (serp.mjs) · 33 lignes de runs sur 2 semaine(s) · pas de run IA automatisé (ai-runs.mjs ou relevé manuel) · 4 site(s) concurrent(s) crawlé(s) · 0 brief(s) d'écart · 9 concurrent(s) déclaré(s) dans scoreboard/competitors.csv.

| # | Domaine | Score | Part de voix Google | N°1 | Top 3 | Extraits | Réf. AI Overview | Citations IA (4 sem.) | Mentions IA | Pack local | Fiche GBP | Site (crawl) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | cakegranby.ca | 0 | 0 | 0 | 0 | 0 | 0 | — | — | — | — | 38 pages, ndash/cake/cake design/design/granby, maj ? |
| 2 | avecungranda.com | 0 | 0 | 0 | 0 | 0 | 0 | — | — | — | — | 40 pages, gateau/produits/produits similaires/similaires/caramel, maj ? |
| 3 | rosegateaux.com | 0 | 0 | 0 | 0 | 0 | 0 | — | — | — | — | 13 pages, rose/rose gateaux/gateaux/gateaux rose/accueil, maj 2010 |
| 4 | lemarmiton.ca | 0 | 0 | 0 | 0 | 0 | 0 | — | — | — | 4.7★ (30+) | — |
| 5 | delicessucresgranby.my.canva.site | 0 | 0 | 0 | 0 | 0 | 0 | — | — | — | — | 1 pages, delices/delices sucres/sucres/sucres granby/granby, maj ? |

Score = part de voix Google + 3 × citations IA + 2 × mentions IA + 2 × apparitions dans le pack local. Le domaine le plus cité de la catégorie est la cible à dépasser (définition de « premier », GEO).

**Comment le lire.** Le score vaut 0 partout : aucune part de voix n'a encore été mesurée (pas de relevé Google réglé sur Granby, pas de relevé des moteurs d'IA). L'outil affiche les sites concurrents qu'il connaît : ceux qu'on a lus (colonne « Site (crawl) ») et ceux dont on a une note Google datée. Il ne compte pas Mont Rose, Mélisse, Café ORÉE ni La Mie Bretonne, faute de site repéré; ils comptent pourtant dans le pack local et dans les réponses (§1.3). « maj ? » veut dire qu'aucune page n'est datée; « maj 2010 » veut dire que 2010 est l'année la plus récente écrite dans le texte du site de Rose Gâteaux, pas une date de mise à jour. « ndash » est un tiret des titres de Cake Design, mal lu par l'outil. « 9 concurrents déclarés » : l'outil ne compte que les concurrents de la liste qui ont un site (la liste en compte 15). Ce tableau deviendra utile dès la première mesure depuis Granby, le lundi 2 novembre 2026 ([docs/01](01-plan-90-jours.md), S1).

### 1.2 Qui occupe les réponses : le relevé indirect du 29 octobre 2026

Ce sont des apparitions dans les listes de liens du relevé indirect (30 recherches), pas une part de voix Google ([research/05 W44.4](../research/05-serp-baseline.md)). Les répertoires sont comptés à part : la définition de « premier » compare les sites de pâtisseries entre eux ([research/12 §4](../research/12-plan-review.md)).

| Domaine | Ce que c'est | Recherches où il sort (sur 30) | 1er lien | Dans les 3 premiers liens | Source principale de la réponse | Nomme la boutique? |
|---|---|---|---|---|---|---|
| **Répertoires et palmarès** | | | | | | |
| restomontreal.ca | répertoire de restaurants : pages de Granby et résumés d'avis | 20 | 14 | 16 | 11 | oui (fiche de la boutique) |
| threebestrated.ca | palmarès « 3 meilleurs » | 12 | 2 | 7 | 5 | oui sur « boulangeries »; non sur « pâtisseries » et « gâteaux » |
| ubereats.com | plateforme de livraison | 10 | 0 | 2 | 0 | non |
| zola.com | répertoire de mariage américain (pages des Granby des États-Unis) | 8 | 0 | 2 | 0 | non |
| **Médias, tourisme, sorties** | | | | | | |
| tastet.ca | média gourmand de Montréal | 11 | 1 | 6 | 0 | non |
| quoifaire.com | sorties dans les Cantons-de-l'Est | 6 | 1 | 4 | 0 | non |
| sortirauquebec.com | répertoire de sorties | 4 | 0 | 0 | 0 | non |
| easterntownships.org | Tourisme Cantons-de-l'Est | 2 | 1 | 2 | 1 | non |
| **Encyclopédies, archives, outils** | | | | | | |
| en.wikipedia.org (et wikipedia.com) | encyclopédie | 12 | 1 | 4 | 0 | non |
| collections.banq.qc.ca | archives numérisées | 6 | 0 | 0 | 0 | — |
| calculover.com | calculateur en ligne | 1 | 0 | 0 | 1 | non |
| **Sites des pâtisseries de Granby** | cakegranby.ca, avecungranda.com, rosegateaux.com… | **0** (0 sur 47 avec le 25 octobre) | — | — | — | — |
| **Notre site** | cocovanillegranby.com | 0 (pas en ligne) | — | — | — | — |
| Aucune source locale | la réponse dit ne rien trouver à Granby | — | — | — | 12 | — |

**Ce que ça veut dire.** Le propriétaire de fait, c'est RestoMontreal : c'est là que les moteurs lisent la note de la boutique, ses produits, ses heures et la mention « peut-être fermée ». Ce n'est pas un concurrent, c'est un répertoire. La méthode est simple : être complet et exact là d'abord, puis donner aux moteurs notre propre site (page À propos, faits clés, même nom partout) pour qu'ils n'aient plus besoin du répertoire (méthode rank-first, référence 16 §2). Autre constat : aucun site de pâtisserie n'est lié dans ces réponses. La place de « domaine de pâtisserie le plus souvent lié », qui fait partie de la définition de « premier », est vide. Ça ne garantit rien, mais il n'y a personne à déloger.

### 1.3 Les concurrents qui comptent

Faits sur les concurrents, avec leur page et leur date. Les notes Google viennent seulement d'un répertoire qui les reproduit avec une date : Google Maps n'a pas pu être ouvert ([research/03](../research/03-competitors.md), méthode). Les sites ont été lus le 29 octobre 2026 avec `tools/crawl.mjs` (au plus 40 pages par site, règles robots.txt respectées; on garde des mesures, jamais le texte). La liste complète, avec les sources : [scoreboard/competitors.csv](../scoreboard/competitors.csv).

| Concurrent | Ce qu'il tient aujourd'hui | Note Google (source, date) | Son site, lu le 29 octobre 2026 |
|---|---|---|---|
| **Cake Design Granby**, 194, rue Denison Est (cakegranby.ca) | Les gâteaux sur commande en ligne : panier avec date et heure de cueillette; 5 $ la portion, minimum 16, pour un gâteau design (cakegranby.ca/products/gateau-sur-mesure, vu le 25 octobre 2026). 1er du palmarès « gâteaux » de Three Best Rated (note de la rédaction : 118 sur 120) et de sa liste française « pâtisseries » | non relevée | 38 pages lues (échantillon) : 31 de moins de 300 mots, aucune datée, aucune vidéo, aucun intertitre en question; données structurées « Organization » et « Product », sans entité de commerce local. Des pages « portfolio » pour les anniversaires, les mariages, les gâteaux à écraser et le corporatif |
| **Avec un Grand A**, 581, rue Breton (avecungranda.com) | Commande en ligne avec prix par format (Framboisier de 40 $ à 60 $), délai de 48 h en jours ouvrables; fiche et article de Tourisme Granby région; 3e du palmarès « gâteaux » (vus le 25 octobre 2026) | non relevée (RestoMontreal : 5,0 sur 3 avis, ce n'est pas une note Google) | 40 pages lues (échantillon) : toutes de moins de 300 mots, 33 sans titre principal (H1), aucune datée, aucune FAQ; données structurées « Product » seulement. Une catégorie « pâtisseries françaises » et une page « menu événementiel » |
| **Rose Gâteaux**, 160, rue Robinson Sud (rosegateaux.com) | La seule spécialiste du mariage repérée à Granby; dégustations; Granby, Bromont et Saint-Hyacinthe; 2e du palmarès « gâteaux » (117 sur 120) | non relevée (Three Best Rated : 4,9, ce n'est pas une note Google) | 13 pages (tout le site) : 10 de moins de 300 mots, aucune datée, aucune année plus récente que 2010 dans le texte; entité « LocalBusiness »; une page de prix avec des exemples |
| **Mont Rose Pâtisserie & Café**, 190, rue Principale | Le rival du comptoir : une chaîne de 3 boutiques, de longues heures, Uber Eats | **4,6 (70+ avis)**, chiffre Google affiché par RestoMontreal, instantané d'octobre 2026, vu le 25 octobre 2026 | pas de site repéré pour Granby |
| **Mélisse Pâtisserie**, 301, rue Notre-Dame | Nommée en premier sur « pâtisserie Granby » le 29 octobre 2026, avec la mention « peut-être temporairement fermée » | **4,8 (20+ avis)**, chiffre Google affiché par RestoMontreal, vu le 25 octobre 2026 | pas de site repéré |
| **Délices Sucrés Granby** (delicessucresgranby.my.canva.site) | Promet les commandes de dernière minute : l'intention de « gâteau pour demain » | non relevée | 1 page de 153 mots, aucun prix, une adresse Gmail |
| **Le Marmiton** (traiteur), lemarmiton.ca | Gâteaux personnalisés selon l'événement; boîtes de 6 et de 12 petits gâteaux à prix publiés (17,25 $ et 35,00 $) | **4,7 (30+ avis)**, chiffre Google affiché par RestoMontreal, en date du 15 juillet 2026, vu le 25 octobre 2026 | lecture impossible le 29 octobre 2026 (erreur de l'outil, §7) |
| Le plancher de prix | IGA (gâteaux de 8 à 12 personnes à 26,99 $, traiteur.iga.net) et Maître Glacier (gâteaux glacés d'environ 35 $ à 55 $), vus le 25 octobre 2026 | — | — |
| Le « fantôme » : **Pain-Pain**, fermée le 16 juin 2026 | Toujours 1re du palmarès « boulangeries » de Three Best Rated et de la liste Yelp (instantané d'octobre 2026); ses heures et son téléphone ressortent dans la réponse sur nos heures (déduit) | — | — |

### 1.4 Notre position, le 29 octobre 2026

- **Pas encore de site en ligne.** Le site est construit et testé (README, 26 octobre 2026), mais aucune page n'est publiée : chaque page attend au moins une réponse de la boutique, ne serait-ce que le nom de la personne responsable des renseignements personnels, affiché dans le pied de page ([docs/17](17-architecture.md), En bref).
- **Nommée, par d'autres** : dans 12 des 26 recherches hors marque du 29 octobre, dont 5 des 13 requêtes suivies relevées ce jour-là (C8, L1, L2, L3, L4) et 7 des 13 candidates; chaque fois par RestoMontreal ou Three Best Rated ([research/05 W44.0](../research/05-serp-baseline.md)).
- **Ce que les réponses disent de bien**, et qu'on garde identique partout : le 3, rue Court et le 450-372-7177; une note Google de 4,9 sur 40+ avis « en date de juillet 2026 » selon l'en-tête de RestoMontreal (une copie faite par un tiers, pas vérifiée sur Google : sur le site, la note n'apparaît qu'une fois lue directement sur Google, jamais en étoiles dans les données structurées); le croissant aux amandes, le Paris-Brest, les gâteaux sur commande, un gâteau aux framboises; un achat au Marché public (selon un avis, non vérifié) ([research/05 W44.5](../research/05-serp-baseline.md)).
- **Ce qu'elles disent de faux ou de nuisible** : les heures et le téléphone de Pain-Pain (B2); la mention « peut-être temporairement fermée » (B2, X2, X8); un dimanche qui ouvrirait à 9 h au lieu de 9 h 30 (L4); et, dans quatre recherches sur les gâteaux sur commande (L2, L3, X4, X5), la plainte de janvier 2026 (un gâteau commandé au chocolat, reçu à la vanille) comme seule information. Cet avis est réel : on ne le cache pas et on ne demande pas son retrait. On y répond avec des faits, et le site construit fait déjà valider un récapitulatif écrit avant toute préparation ([docs/03 §6](03-messages-avis.md)).
- **Confusions de nom vues dans les réponses** : Pâtisserie Coco (Montréal), Vanille Patisserie (Chicago), Grain de Vanille (Cancale), Coco Crêpes (Granby), des parfums « Coco Vanille ». D'où la règle : « Pâtisserie Coco Vanille » et « Granby » dans chaque phrase qui présente la boutique ([docs/16 §6](16-recherche.md)).

---

## 2. Faiblesses exploitables (légales seulement)

Une faiblesse d'un concurrent n'est jamais une cible à attaquer. C'est une place qu'une meilleure page, une meilleure fiche ou une meilleure preuve peut prendre (méthode rank-first, référence 16).

### 2.1 Ce que l'outil a relevé sur leurs sites

**Généré par market.mjs (lecture des sites du 29 octobre 2026)** :

- **cakegranby.ca** : 82 % de pages minces (< 300 mots) · pages sans date de mise à jour · pages non signées · aucune vidéo · titres non formulés en questions · peu de chiffres (2.9/100 mots) · pas de version arabe · 1 pages noindex
- **avecungranda.com** : 100 % de pages minces (< 300 mots) · pages sans date de mise à jour · pages non signées · presque aucune FAQ · aucune vidéo · titres non formulés en questions · aucune entité Organization/LocalBusiness en JSON-LD · pas de version arabe · 1 pages noindex
- **rosegateaux.com** : 77 % de pages minces (< 300 mots) · pages sans date de mise à jour · presque aucune FAQ · aucune vidéo · titres non formulés en questions · peu de chiffres (2.7/100 mots) · pas de version arabe · contenu daté de 2010 · 1 titres dupliqués
- **delicessucresgranby.my.canva.site** : 100 % de pages minces (< 300 mots) · pages sans date de mise à jour · pages non signées · presque aucune FAQ · aucune vidéo · titres non formulés en questions · aucune entité Organization/LocalBusiness en JSON-LD · pas de version arabe

**Trois lignes à corriger en lisant :**

- « pas de version arabe » est une règle de la version marocaine de l'outil : sans objet à Granby. L'équivalent ici : aucun de ces sites n'a de version anglaise (lecture du 29 octobre 2026; [research/03 §1](../research/03-competitors.md), note sur les langues).
- « 1 pages noindex » : c'est la page de connexion au compte client (Cake Design) et le panier (Avec un Grand A). C'est normal : ce n'est pas une faiblesse.
- « contenu daté de 2010 » : 2010 est l'année la plus récente écrite dans le texte des 13 pages de Rose Gâteaux. Ce n'est pas une date de mise à jour.

Une « page mince » compte moins de 300 mots. Une fiche produit courte n'est pas une faute en soi : ce qui compte, ce sont les questions laissées sans réponse (portions, délais, allergènes, conservation, transport).

Le résumé des quatre sites lus :

| Site (pages lues le 29 octobre 2026) | Moins de 300 mots | Pages datées | Intertitres en question | Blocs FAQ | Vidéo | Entité d'entreprise dans les données structurées | Version anglaise |
|---|---|---|---|---|---|---|---|
| cakegranby.ca (38, échantillon de 40) | 31 | 0 | 1 (au panier : « Vous possédez un compte ? ») | 17 pages ont des blocs repliables, comptés comme FAQ par l'outil (contenu non vérifié) | 0 | « Organization » (pas de commerce local) | non |
| avecungranda.com (40, échantillon de 40) | 40 | 0 | 0 | 0 | 0 | aucune (« Product » seulement) | non |
| rosegateaux.com (13, tout le site) | 10 | 0 | 0 | 0 | 0 | « LocalBusiness » (2 pages) | non |
| delicessucresgranby.my.canva.site (1) | 1 | 0 | 0 | 0 | 0 | aucune | non (la page est marquée « en » par défaut, mais son texte est en français) |
| **Le site construit de la Pâtisserie Coco Vanille** (pas en ligne) | — | chaque page porte sa date de mise à jour et une note de changement | 3 à 6 intertitres en question par page, la réponse d'abord | 5 à 8 questions par page | prévue plus tard | « Bakery » | oui, pour les pages principales (si quelqu'un sert en anglais) |

Sources de la dernière ligne : le contrat de page de `apps/web/src/seed/content.js` et de `apps/web/src/components/site/Contract.js`, l'entité de `apps/web/src/lib/schema.js` (lus le 29 octobre 2026). Le site ne publie une page que lorsqu'elle ne contient plus aucun fait manquant.

### 2.2 Ce que chacun laisse ouvert, et notre geste

| Concurrent | Ce qui manque (fait, source, date) | Notre geste (une meilleure page, une meilleure fiche, une preuve) |
|---|---|---|
| Cake Design Granby | Aucune page datée, aucun intertitre en question, presque toutes les pages de moins de 300 mots, pas d'entité de commerce local (lecture du 29 octobre 2026). Page « sur mesure » affichée « épuisé », plus de modelage de figurines, deux domaines (.ca et .com) qui risquent de se partager l'autorité ([research/03 §1](../research/03-competitors.md), vu le 25 octobre 2026) | Le pilier `/gateaux-personnalises-granby/` et `/prix/` répondent à chaque sous-question : prix daté avec le prix par portion, délais, portions, allergènes, ressemblance à la photo; pages signées et datées; le calculateur de portions; l'entité « Bakery ». On ne nomme jamais un concurrent sur nos pages, sauf dans le comparatif honnête révisé par l'avocat |
| Avec un Grand A | Toutes les pages lues sous 300 mots, 33 sur 40 sans titre principal, aucune FAQ, aucune entité d'entreprise (lecture du 29 octobre 2026). Fermé le dimanche et le lundi ([research/03 §1](../research/03-competitors.md)) | Le dimanche : `/nous-trouver/` et la fiche Google (coup n° 4). Une heure limite écrite en chiffres pour le lendemain, seulement si elle est vraie (coup n° 5). Une fiche Tourisme Granby région (§6) |
| Rose Gâteaux | Ouvert seulement le jeudi de 14 h à 18 h, sinon sur rendez-vous; aucune réservation en ligne repérée ([research/03 §1](../research/03-competitors.md)); aucune page datée (lecture du 29 octobre 2026) | Pas de combat sur les mariages : ils restent gelés tant que la capacité n'est pas confirmée (research/14 P2). On prend les anniversaires et le lendemain |
| Mont Rose | Pas de site repéré pour Granby; des heures différentes selon les instantanés ([research/03 §1](../research/03-competitors.md)) | Des heures identiques partout; une fiche Google complète; une invitation à laisser un avis faite à chaque client, sans tri ni cadeau ([docs/03](03-messages-avis.md)). Ses 70+ avis sont un repère, jamais un objectif imposé à l'équipe |
| Mélisse | Mention « peut-être temporairement fermée » sur RestoMontreal (instantané du 15 juillet 2026) | Rien. On ne parle jamais du statut d'un concurrent; on s'assure seulement que nos propres faits sont justes |
| Délices Sucrés Granby | Une page, aucun prix, une adresse Gmail ([research/03 §1](../research/03-competitors.md); lecture du 29 octobre 2026) | `/gateau-pour-demain/` avec l'heure limite, les formats et les prix, si c'est vrai (coup n° 5) |
| Le marché entier | Personne ne publie un tableau des portions selon le nombre d'invités; un seul concurrent publie un prix par portion sur son site; les heures se contredisent d'un répertoire à l'autre; aucune page en anglais; aucune réponse courte aux questions de délai, de grosseur, de transport ou de conservation ([research/03 §6](../research/03-competitors.md)) | `/prix/`, le calculateur, la FAQ de chaque page, les pages anglaises pour les visiteurs, la fiche maîtresse recopiée partout ([docs/05](05-gbp-checklist.md), [docs/06](06-annuaires-listicles.md)) |

### 2.3 Ce qu'on ne fait jamais

- **Dénigrer un concurrent**, inventer une faiblesse ou mettre le nom d'un concurrent dans nos adresses ou nos titres. Le comparatif honnête (`/comparatif-gateau-de-fete-granby/`, **prévu, pas encore construit**) comparera des types d'options (pâtisserie, épicerie, gâteau glacé, fait maison) avec des faits publiés, leur page et leur date, des liens marqués `nofollow`, et passera d'abord par l'avocat : Loi sur la concurrence et Loi sur la protection du consommateur ([research/07](../research/07-legal-quebec-compliance.md) K-5, S12; [docs/17 §6](17-architecture.md)).
- **Se dire « la meilleure pâtisserie de Granby »** sans une distinction datée, donnée par un tiers nommé (research/07 S12).
- **Demander le retrait d'un concurrent ouvert** d'une liste. Corriger une liste qui classe un commerce fermé, avec les articles de presse à l'appui, c'est permis.
- **Faux avis, avis achetés ou récompensés**, tri des clients avant de demander un avis, quotas d'avis pour l'équipe, votes demandés à l'équipe ou aux proches sur la page de vote de RestoMontreal ([docs/06 §4.2](06-annuaires-listicles.md)).
- **Liens achetés**, pages « villes » sans boutique ni livraison, mots-clés ajoutés au nom de la fiche Google, données structurées pour ce qui n'est pas sur la page.
- **Copier le texte d'un concurrent.** Les lectures de sites servent de statistiques, jamais de texte à réutiliser.
- La liste complète des tactiques refusées : l'entente à signer en S0 ([docs/11 §5](11-contrat-clauses.md); méthode rank-first, référence 09 §5).

---

## 3. Carte de bataille : une requête, un propriétaire, un coup

### 3.1 Les 10 requêtes prioritaires

La liste et l'ordre viennent de [research/05 W44.7](../research/05-serp-baseline.md) (mise à jour du 29 octobre 2026). Les pages sont celles du site construit ([docs/17 §1.1](17-architecture.md)) : **construite** = la page existe dans le code et se publie dès que ses faits sont fournis; **conditionnelle** = elle reste cachée tant que l'offre n'est pas confirmée; **prévue** = elle n'existe pas encore.

| # | Requête (note sur 20) | Qui l'occupe aujourd'hui (relevé indirect, date) | Pourquoi il gagne | Nous, aujourd'hui | Le coup : page, fiche, liste | Ce qui bloque |
|---|---|---|---|---|---|---|
| 1 | **L3** « gâteau pour demain Granby » (19) | Personne : aucune page « pour demain » trouvée (29 octobre); la réponse renvoie vers notre fiche RestoMontreal (lien 14) | Aucune page ne répond à l'intention | Nommée en premier (« appelez Cocovanille »), mais avec la plainte de janvier 2026 | `/gateau-pour-demain/` (conditionnelle) + publication et produit sur la fiche Google + réponse factuelle à l'avis de janvier ([docs/03 §6](03-messages-avis.md)) | Commande pour le lendemain, heure limite, formats (research/14 P4) |
| 2 | **C1** « meilleure pâtisserie à Granby » (18) | restomontreal.ca : notre fiche en 1er lien (25 octobre). Sur « pâtisserie Granby » : Mélisse 1re, nous 2es (29 octobre) | Répertoires avec notes; la recherche demande un palmarès | Nommée en premier le 25 octobre, par RestoMontreal | Fiche Google juste; RestoMontreal et Three Best Rated corrigés; entrée sur la liste « pâtisseries »; accueil `/` (construite) avec la phrase de catégorie et « Coco Vanille en bref » | Statut et accès de la fiche Google (research/14 S2); phrase de catégorie (research/14 S5) |
| 3 | **C2** « meilleur gâteau de fête à Granby » (18) | tastet.ca : une liste de Montréal (25 octobre). Sur « gâteau d'anniversaire Granby » : notre fiche RestoMontreal en 1er lien, avec un avis positif (29 octobre) | L'autorité d'un média; aucune liste de Granby n'existe | Absente sur C2; 1re sur X3, par RestoMontreal | `/gateaux/` (construite) puis le pilier `/gateaux-personnalises-granby/` (conditionnelle), avec des prix datés; proposition à Tastet et à Tourisme Granby région avec l'étude de prix ([docs/04](04-pitch-media.md)); comparatif prévu | Gâteaux sur commande : volume, délai, prix (research/14 P1, P9) |
| 4 | **L4** « pâtisserie ouverte dimanche Granby » (18) | restomontreal.ca : 9 liens sur 18 (29 octobre) | Les pages d'heures des répertoires | Nommée parmi 4 pâtisseries ouvertes le dimanche, mais avec 9 h au lieu de 9 h 30 | Heures justes partout; `/nous-trouver/` (construite) répond « Êtes-vous ouverts le dimanche? » | Heures des Fêtes (research/14 H2) |
| 5 | **L1** « pâtisserie près de moi » (17) | Le pack local : pas encore mesuré (il faut un cellulaire à Granby) | La proximité et la notoriété de la fiche Google | Inconnue | Fiche Google complète, un avis demandé à chaque client, `/nous-trouver/` (construite), grille locale chaque mois | Personne à Granby (research/14 D1); accès à la fiche (research/14 S2) |
| 6 | **C8** « best bakery in Granby Quebec » (17) | threebestrated.ca, 1er lien : Pain-Pain 1re (fermée), nous 2es avec d'anciennes heures (29 octobre) | Un palmarès jamais mis à jour | 2e | Demande de mise à jour à Three Best Rated; fiche Yelp réclamée; `/en/` (construite) | Rien : à faire maintenant |
| 7 | **I3** « quelle grosseur de gâteau pour 20 personnes » (17) | synonyme-du-mot.com, une ferme de contenu (25 octobre); sur « gâteau 8 pouces » : 7 liens sur 12 sont des pages parasites (déduit), puis calculover.com (29 octobre) | Un tableau format → portions | Absente | `/calculateur-portions-gateau/` (conditionnelle) : tableau en pouces et en centimètres, réponse de 40 à 60 mots sous la question | Vos portions par format (research/14 P7) |
| 8 | **L9** « order custom cake online Granby » (16) | Les pages des Granby américains : 0 lien québécois sur 17 (29 octobre) | Sans « Quebec », le mot « Granby » désigne les villes américaines | Absente | `/en/custom-cakes-granby/` (conditionnelle) et `/en/order/` (construite), avec « Granby, Quebec » dans les titres | Personne qui sert en anglais (research/14 L1) |
| 9 | **I1** « combien coûte un gâteau de fête personnalisé à Granby » (16) | Personne : « aucun tarif précis à Granby »; la liste « pâtisseries » de Three Best Rated et des PDF de prix en euros (25 octobre) | Personne ne publie un prix local daté | 7e lien, par RestoMontreal, sans prix | `/prix/` (conditionnelle) : tableau daté, taxes, « ce qui change le prix »; produits avec prix sur la fiche Google | Grille de prix (research/14 P1) |
| 10 | **L2** « commander un gâteau de fête en ligne Granby » (15) | Personne dans le relevé (29 octobre). En réalité, trois paniers concurrents existent : Cake Design, Avec un Grand A, Maître Glacier ([research/03](../research/03-competitors.md)) | Des paniers avec des prix visibles | Nommée (lien 17), avec la plainte de janvier 2026 | `/commander/` (construite) à l'ouverture de la commande en ligne, du 11 au 24 janvier 2027 : prix avant le paiement, plages de cueillette, récapitulatif écrit | Produits, prix, capacité (research/14 P1, O1); avis du juriste et du comptable |

### 3.2 Les autres requêtes suivies

| Requêtes (note sur 20) | État | Qui l'occupe (relevé indirect) | Ce qu'on fait |
|---|---|---|---|
| I2 délais de commande (16), 1re réserve | Attend vos délais (research/14 P4) | Des pages de France (15, 21 ou 30 jours, d'après un PDF de prix français) | Sections « délais » de `/gateaux/` et du pilier; `/gateau-pour-demain/` |
| L8 bakery near Granby Zoo (16), réserve | Attend la durée du trajet depuis le Zoo (calcul de l'Agence) | Les Granby américains (9 liens sur 12) | Section Zoo de `/en/visit/`; mesurer aussi « … Quebec » |
| C4 bûche de Noël Granby (19) | Conditionnelle : votre réponse est attendue le 1er novembre 2026 (research/14 P3) | Rien de propre à Granby (définition de l'OQLF, presse européenne) | Le coup conditionnel du §4 |
| I4 transport (16), I7 conservation (15), I6 crème au beurre ou ganache (13) | Pages prévues ([docs/17 §6](17-architecture.md)) | Fermes de contenu, blogues de France | `/transporter-conserver-gateau/` et le glossaire, après le lancement; une source officielle de salubrité pour I7 (§7) |
| I8 prix au Québec, en anglais (15) | Attend la grille de prix (research/14 P1) | tastet.ca, weddingwire.ca, une page parasite | `/en/prices/` |
| L5 café et pâtisserie près du Zoo (15) | Attend la durée du trajet et l'offre du café (research/14 N3) | Tourisme Cantons-de-l'Est et deux cafés (Café de la Brûlerie, Caféine & co) | Section Zoo de `/nous-trouver/`; page « En visite à Granby » seulement avec une vraie offre (printemps 2027) |
| C5 macarons (17), C6 sans gluten (17), L6 chocolatines (18), L7 boîtes pour une réunion (17) | Produits non confirmés (research/14 P2, P12); C6 passe aussi par l'avocat | Réponses vides ou hors sujet (Trustpilot, recettes, La Réunion) | Aucune page tant que le produit n'est pas confirmé; C6 reçoit seulement l'information sur les allergènes (`/allergenes/`) |
| I5, I9, C3, C7, C9 (mariages) | Gelées : aucune preuve de gâteaux de mariage | Répertoires de mariage (souvent des Granby américains ou la France) | Rien, sauf si vous confirmez la capacité (étages, livraison, montage) |
| I10, C10, L10 (espagnol) | Volet espagnol fermé tant que personne ne sert en espagnol (research/14 L2) | Aucune page en espagnol pour Granby | Rien pour l'instant; mesurer « … Granby Quebec » |
| B1, B2, B3 (marque) | Diagnostic; B2 est urgent | RestoMontreal et Three Best Rated | Le coup n° 1; `/a-propos/` comme source de vérité |

### 3.3 Une décision à prendre avant le gel des requêtes (lundi 2 novembre 2026)

Les codes des requêtes se figent à la première mesure depuis Granby ([docs/01](01-plan-90-jours.md), S1). Douze des trente requêtes dépendent d'un produit non confirmé ([research/12](../research/12-plan-review.md) G3). Les deux propositions au dossier s'entendent sur les cinq requêtes qui entrent, chacune appuyée par le relevé du 29 octobre 2026 :

| Entre | Note (29 octobre) | Ce que montre le relevé |
|---|---|---|
| X1 « pâtisserie Granby » | 18 | Boutique nommée 2e, derrière Mélisse (mention « peut-être fermée ») |
| X3 « gâteau d'anniversaire Granby » | 18 | Notre fiche RestoMontreal en 1er lien, avec un avis positif sur un gâteau aux framboises |
| X7 « croissants Granby » | 18 | La boutique est le premier nom de Granby; aucune page « croissants » nulle part |
| X2 « boulangerie Granby » | 17 | Boutique 2e, derrière Pain-Pain, fermée |
| X12 « café pâtisserie centre-ville Granby » | 15 | Boutique absente, alors que le café est annoncé sur votre page Facebook : une catégorie à corriger |

Celles qui sortent dépendent de vos réponses (research/14 P2) :

- **Proposition du concept** ([research/00 §10.5](../research/00-master-concept.md), reprise dans [docs/01](01-plan-90-jours.md), S0) : les cinq requêtes de mariage (I5, I9, C3, C7, C9) sortent; C5, C6, L6 et L7 sortent à leur tour si leur produit n'est pas confirmé.
- **Proposition du relevé** ([research/05 W44.8](../research/05-serp-baseline.md)) : C5, C6, L6, L7 et C9 sortent; les quatre autres requêtes de mariage restent jusqu'à votre réponse.
- **Recommandation de l'Agence** : la première (aucune preuve de gâteaux de mariage, et elle est déjà au plan de 90 jours). Si vos réponses ferment aussi C5, C6, L6 ou L7, on les remplace le jour même par des candidates déjà relevées : X4 « gâteau personnalisé Granby » (17), X5 « gâteau sur mesure Granby » (17) ou X13 « gâteau 8 pouces combien de portions » (17). Le relevé écarte les autres : X9 n'a pas d'intention locale, X8 est comprise dans X7, X10 et X11 attendent un produit. Si la permutation se fait, X3 et X1 entrent dans les 10 prioritaires ([research/05 W44.7](../research/05-serp-baseline.md)).

### 3.4 La carte calculée par l'outil

La carte complète **générée par market.mjs** (59 lignes : 33 requêtes suivies, 20 candidates, 6 variantes) est à l'**Annexe A**. Tant qu'aucune position n'est mesurée, l'outil propose le même coup partout (« pas dans le top 20 : page dédiée à cette intention »). C'est vrai pour un site qui n'est pas encore en ligne, mais trop vague pour choisir : d'où le tableau 3.1.

---

## 4. Les dix coups, dans l'ordre

Un coup par semaine, c'est le rythme qu'une agence d'une personne peut tenir; chaque changement se mesure 14 jours plus tard, un seul à la fois ([docs/02](02-rythme-hebdo.md); méthode rank-first, référence 16 §4). Les semaines S1 à S13 sont celles du [plan de 90 jours](01-plan-90-jours.md).

### 4.0 Un coup conditionnel, d'abord : les bûches de Noël (C4, 19 sur 20)

Si vous confirmez les bûches d'ici le **dimanche 1er novembre 2026** (research/14 P3) : produits et publications sur la fiche Google, publication Facebook, téléphone et formulaire de demande; `/buches-de-noel/` (conditionnelle) se publie. Le nouveau site ne gagnera pas Noël 2026 dans Google, il sera trop jeune ([docs/01](01-plan-90-jours.md), S1) : Noël se joue sur la fiche Google et Facebook. Si c'est non, rien ne bouge et la page attend 2027.

### 4.1 Les dix coups

1. **Les heures et le téléphone justes partout** (B2, B1; aide aussi C1, C8, L4)
   - Propriétaire à dépasser : Three Best Rated (la réponse sur nos heures a pris celles de Pain-Pain) et RestoMontreal (« peut-être temporairement fermée », dimanche à 9 h).
   - Le geste : la fiche Google d'abord (statut « ouvert »; fermé le lundi et le mardi, du mercredi au samedi de 8 h 30 à 17 h 30, le dimanche de 9 h 30 à 17 h; 450-372-7177; [docs/05](05-gbp-checklist.md)); puis RestoMontreal (modèle A), Three Best Rated (modèle B), find-open et canada.chamberofcommerce.com (modèle D), Wanderlog et MapQuest (modèle C) ([docs/06 §4.3](06-annuaires-listicles.md)).
   - Page : `/nous-trouver/` (construite) et son tableau des heures, « qui fait foi ».
   - Qui et quand : vous (accès à la fiche) et l'Agence. Fiche Google en S1 (du 2 au 8 novembre 2026); Three Best Rated en S2 (du 9 au 15 novembre); RestoMontreal et les autres en S3 et S4 (du 16 au 29 novembre).
   - Ce qui bloque : [[FACT NEEDED: accès propriétaire et statut de la fiche Google (research/14 S1, S2)]].
   - Comment on saura : B1 et B2 relancées chaque lundi. Le coup est terminé après 4 lundis de suite sans heure ni téléphone faux.
2. **Le palmarès qui met une boulangerie fermée en tête** (C8, X2)
   - Propriétaire à dépasser : threebestrated.ca, 1er lien de C8 : Pain-Pain 1re (fermée depuis le 16 juin 2026), la boutique 2e.
   - Le geste : une demande de mise à jour avec les trois articles de presse (La Voix de l'Est, M105, Granby Express) et nos heures identiques à la fiche Google, en français et en anglais (modèle B, [docs/06 §4.3](06-annuaires-listicles.md)). Jamais une demande de retrait d'un commerce ouvert.
   - Page : `/en/` (construite), titrée « … Granby, Québec ».
   - Qui et quand : l'Agence, en S2, une fois la fiche Google corrigée.
   - Ce qui bloque : rien ([research/05 W44.7](../research/05-serp-baseline.md)).
   - Comment on saura : les réponses à C8 et à X2 ne nomment plus Pain-Pain en premier.
3. **Entrer sur la liste « pâtisseries et gâteaux »** (C1, X1, X3, X4)
   - Propriétaire à dépasser : la liste française « 3 Meilleurs Pâtisseries à Granby » de Three Best Rated (Cake Design, Rose Gâteaux, Avec un Grand A, sans nous) : 1er lien de « gâteau personnalisé Granby », elle nourrit les réponses sur les gâteaux. Puis RestoMontreal (Mélisse 1re sur « pâtisserie Granby »).
   - Le geste : la demande d'inclusion (modèle F) avec de vraies photos, le nombre d'avis Google daté et lu sur la fiche, et la page Prix dès qu'elle existe; chez RestoMontreal, la catégorie « café » (X12) et l'adresse du site au lancement; fiches Yelp et Tripadvisor réclamées ([docs/06 §3](06-annuaires-listicles.md)).
   - Page : l'accueil `/` (construite), avec la phrase de catégorie et le bloc « Coco Vanille en bref ».
   - Qui et quand : l'Agence; Three Best Rated en S2, RestoMontreal en S3 et S4.
   - Ce qui bloque : [[FACT NEEDED: photos réelles des produits (séance photo de S2)]], [[FACT NEEDED: nombre d'avis Google à la date d'envoi (research/14 S7)]], la phrase de catégorie A ou B (research/14 S5).
   - Comment on saura : sur C1 et X1, la liste en tête nous nomme en premier (la règle « palmarès » de la définition de « premier »).
4. **Le dimanche** (L4)
   - Propriétaire à dépasser : RestoMontreal (9 liens sur 18). La réponse nomme déjà la boutique parmi les 4 pâtisseries ouvertes le dimanche, avec 9 h au lieu de 9 h 30.
   - Le geste : les heures du dimanche et des Fêtes partout (fiche Google, Apple, Bing, Facebook) au plus tard le mardi 1er décembre 2026; RestoMontreal corrigé (coup n° 1).
   - Page : `/nous-trouver/` (construite) répond déjà « Êtes-vous ouverts le dimanche? ».
   - Qui et quand : vous (les heures des Fêtes) et l'Agence; première mise en ligne en S3 et S4.
   - Ce qui bloque : [[FACT NEEDED: heures des Fêtes 2026 (research/14 H2)]] et, pour publier la moindre page, [[FACT NEEDED: nom, titre et courriel de la personne responsable des renseignements personnels (research/14 A4)]].
   - Comment on saura : sur L4, la réponse donne 9 h 30 et cite notre page ou notre fiche.
5. **Le gâteau pour demain** (L3, I2)
   - Propriétaire à dépasser : personne. Aucune page « pour demain » n'existe; la réponse renvoie à RestoMontreal et répète la plainte de janvier 2026. Délices Sucrés Granby promet la dernière minute, sur un site d'une page.
   - Le geste : publier `/gateau-pour-demain/` dès que l'heure limite et les formats sont confirmés; la même réponse en publication et en produit sur la fiche Google; une réponse factuelle à l'avis de janvier 2026, sans le cacher ni demander son retrait ([docs/03 §6](03-messages-avis.md)). Seulement si c'est vrai.
   - Page : `/gateau-pour-demain/` (conditionnelle); [docs/08 §3](08-brief-page.md) en donne déjà le plan.
   - Qui et quand : vous (la règle) et l'Agence (la page), la semaine même de votre réponse.
   - Ce qui bloque : [[FACT NEEDED: commande pour le lendemain offerte ou non, heure limite, formats (research/14 P4)]].
   - Comment on saura : boucle des extraits aux jours 7 et 14 ([scoreboard/snippet-targets.csv](../scoreboard/snippet-targets.csv)); la réponse cite notre page.
6. **Le pack local** (L1)
   - Propriétaire à dépasser : pas encore mesuré.
   - Le geste : la fiche Google complète : catégorie principale choisie dans la vraie liste de Google (autotest T2), photos réelles, une publication par semaine, réponse aux avis en moins de 24 heures (M1), une invitation à laisser un avis faite à chaque client, sans tri ni cadeau (M3, M23; [docs/03](03-messages-avis.md)); Apple Business et Bing Places identiques ([docs/05](05-gbp-checklist.md)).
   - Page : `/nous-trouver/` (adresse, itinéraires, heures).
   - Qui et quand : vous et l'Agence, dès S1, puis chaque semaine.
   - Ce qui bloque : [[FACT NEEDED: personne qui fait la vérification sur cellulaire à Granby chaque lundi (research/14 D1)]].
   - Comment on saura : dans les 3 premiers au point de la boutique, et sur au moins la moitié d'une grille de 7 × 7 points dans un rayon de 3 km ([docs/01 §5](01-plan-90-jours.md)).
7. **Les gâteaux de fête** (C2, X3, X4, X5)
   - Propriétaire à dépasser : tastet.ca sur C2 (une liste de Montréal); la liste « pâtisseries » de Three Best Rated et Cake Design sur « gâteau personnalisé ». Sur « gâteau d'anniversaire Granby », notre fiche RestoMontreal est déjà en 1er lien.
   - Le geste : `/gateaux/` avec la section anniversaire, de vraies photos et des prix datés; le pilier `/gateaux-personnalises-granby/` quand les gâteaux sur commande sont confirmés; le test de chevauchement pour choisir la page qui porte « gâteau de fête » ([docs/17 §3.3](17-architecture.md)). Après le lancement : une proposition à Tastet et à Tourisme Granby région avec l'étude de prix du 1er trimestre 2027 ([docs/04](04-pitch-media.md)). Le comparatif honnête est **prévu**; son brouillon va à l'avocat la semaine du lundi 15 février 2027 ([docs/17 §6](17-architecture.md)).
   - Page : `/gateaux/` (construite), puis le pilier (conditionnelle).
   - Qui et quand : l'Agence, après vos réponses; la collecte des prix pour l'étude commence en S7.
   - Ce qui bloque : [[FACT NEEDED: gâteaux sur commande : volume, délais, prix, conditions (research/14 P1, P9)]].
   - Comment on saura : sur C2 et X3, la liste en tête nous nomme en premier, ou notre page est citée.
8. **Les prix et les portions : la réponse que personne ne donne** (I1, I3, X13)
   - Propriétaire à dépasser : personne à Granby pour les prix (« aucun tarif précis à Granby »); des fermes de contenu et des pages parasites pour les portions.
   - Le geste : `/prix/` (tableau daté : format → portions → prix → délai; « taxes en sus, s'il y a lieu »; « ce qui change le prix ») et le calculateur de portions (pouces et centimètres, il fonctionne sans JavaScript); produits avec prix sur la fiche Google. C'est ce que le marché n'a pas : un seul concurrent publie un prix par portion sur son site (Cake Design, 5 $, minimum 16, cakegranby.ca, vu le 25 octobre 2026) et personne ne publie un tableau selon le nombre d'invités ([research/03 §6](../research/03-competitors.md)).
   - Page : `/prix/` et `/calculateur-portions-gateau/` (conditionnelles).
   - Qui et quand : l'Agence, la semaine de vos réponses; le calculateur au plus tôt en S5.
   - Ce qui bloque : [[FACT NEEDED: grille de prix par format (research/14 P1)]] et [[FACT NEEDED: portions par format, en pouces et en centimètres (research/14 P7)]].
   - Comment on saura : boucle des extraits aux jours 7 et 14 sur I1 et I3; le tableau est cité dans les réponses.
9. **Commander en ligne** (L2)
   - Propriétaire à dépasser : personne dans le relevé; trois paniers concurrents existent pourtant, qu'un Google réglé sur Granby pourrait montrer.
   - Le geste : `/commander/` s'ouvre du lundi 11 au dimanche 24 janvier 2027 (décision M20) : le prix avant le paiement, les plages de cueillette, le récapitulatif « Votre récapitulatif est-il exact? » et la confirmation par courriel (construits); puis le lien de commande sur la fiche Google et l'action « Commander » d'Apple Business ([docs/01](01-plan-90-jours.md), S11 et S12). D'ici là : le formulaire de demande et le téléphone.
   - Page : `/commander/` (construite).
   - Qui et quand : vous et l'Agence, S11 et S12.
   - Ce qui bloque : [[FACT NEEDED: produits, prix et capacité de cueillette par jour (research/14 P1, O1)]], et la porte G10 (avis du juriste et classes de taxes signées par le comptable).
   - Comment on saura : L2, et surtout les commandes.
10. **Les visiteurs anglophones** (L9, L8)
    - Propriétaire à dépasser : les pages des Granby américains (L9 : 0 lien québécois sur 17; L8 : 9 liens américains sur 12).
    - Le geste : `/en/custom-cakes-granby/`, `/en/order/` et `/en/visit/` avec « Granby, Quebec » dans le titre et le premier paragraphe; mesurer les variantes « … Quebec » (L8-quebec, L9-quebec); fiche Tripadvisor réclamée (les visiteurs).
    - Page : `/en/order/` et `/en/visit/` (construites), `/en/custom-cakes-granby/` (conditionnelle). Une page anglaise ne se publie qu'après sa jumelle française (Charte de la langue française).
    - Qui et quand : l'Agence, quand quelqu'un sert en anglais.
    - Ce qui bloque : [[FACT NEEDED: personne qui sert les clients en anglais (research/14 L1)]] et [[FACT NEEDED: durée du trajet en auto entre le Zoo de Granby et le 3, rue Court (calcul de l'Agence)]].
    - Comment on saura : L9-quebec et L8-quebec citent nos pages.

### 4.2 L'ordre proposé par l'outil, et pourquoi on ne le suit pas

**Généré par market.mjs (29 octobre 2026)** :

1. **C4** (bûche de Noël Granby, position —, priorité 57) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
2. **L3** (gâteau pour demain Granby, position —, priorité 57) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
3. **L10** (torta de cumpleaños personalizada Granby, position —, priorité 57) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
4. **C1** (meilleure pâtisserie à Granby, position —, priorité 54) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
5. **C2** (meilleur gâteau de fête à Granby, position —, priorité 54) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
6. **C7** (prix gâteau de mariage Granby, position —, priorité 54) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
7. **C10** (mejor pastelería en Granby Quebec, position —, priorité 54) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
8. **L4** (pâtisserie ouverte dimanche Granby, position —, priorité 54) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
9. **L6** (chocolatines Granby, position —, priorité 54) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes
10. **C3** (pâtisserie gâteau de mariage Cantons-de-l'Est, position —, priorité 51) — pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes

L'outil classe les requêtes par leur note et leur type, sans savoir quels produits sont confirmés : il met en tête les bûches (en attente de votre réponse), deux requêtes de mariage (C7, C3, gelées), deux requêtes en espagnol (L10, C10, volet fermé) et les chocolatines (L6, non confirmées). Et comme le site n'est pas en ligne, toutes les positions valent zéro : chaque coup devient « page dédiée ». Dès que la mesure depuis Granby donnera de vraies positions et de vrais propriétaires, cette liste deviendra utile; l'ordre du §4.1 reste celui à suivre d'ici là.

---

## 5. Ce que les moteurs cherchent et que nos pages ne couvrent pas encore

Un moteur d'IA découpe une requête en sous-questions. Chacune devient un intertitre d'une page qui existe, ou une nouvelle page; jamais une page presque identique à une autre.

### 5.1 Le calcul de l'outil

**Généré par market.mjs (29 octobre 2026)** :

- aucun (ou pas de données fan-out/PAA : ai-runs.mjs, serp.mjs)

Chaque ligne devient une section du pilier ou une page cluster (Layer 9.2) — jamais une page quasi-dupliquée.

Rien ici, parce qu'aucune donnée de sous-questions n'existe encore : la récolte des « Autres questions posées » se fera depuis Granby et les sous-questions des moteurs viendront de leurs relevés ([scoreboard/README.md](../scoreboard/README.md)).

### 5.2 Ce que les réponses du relevé indirect ont cherché (complété à la main)

Sources : les réponses du 25 et du 29 octobre 2026 ([research/05 §2, W44.2, W44.3](../research/05-serp-baseline.md)) et la carte des intertitres de [docs/17 §3.2](17-architecture.md).

| Sous-question (vue dans quelle réponse) | Couverte par le site construit? | Où, ou ce qu'il faut |
|---|---|---|
| Combien de jours d'avance? (I2 : 15, 21 ou 30 jours, une source de France) | Oui, intertitre écrit; la réponse attend vos délais | `/gateaux/`, pilier, `/gateau-pour-demain/` (research/14 P4) |
| Quel acompte? (I9 : de 20 à 30 %, un forum) | Oui, question écrite; le pourcentage manque | `/gateaux/`, `/prix/` (research/14 O4) |
| Combien de portions dans un gâteau de 8 pouces? La hauteur change-t-elle les portions? (X13) | Oui : l'intertitre existe et le texte parle déjà de la hauteur; les portions manquent | `/calculateur-portions-gateau/` (research/14 P7) |
| Combien coûte un gâteau de fête à Granby? (I1; X3 cite des prix concurrents « à partir de » 40 $ à 45 $, vendeur non nommé, non vérifié; X4 cite Cake Design « à partir d'environ 40 $ », d'après Three Best Rated) | Oui, intertitre écrit; la grille manque | `/prix/` (research/14 P1) |
| Comment transporter un gâteau à étages en auto? (I4) | Non | Page prévue `/transporter-conserver-gateau/` |
| Comment conserver un gâteau à la crème jusqu'au lendemain? (I7) | Oui, question écrite; vos consignes manquent | `/gateaux/`; une source officielle de salubrité (§7) |
| Crème au beurre ou ganache? (I6) | Non | Glossaire prévu |
| À quelle distance du Zoo? (L5, L8; la réponse L5 donne l'adresse du Zoo au 525, rue Saint-Hubert, non vérifié) | Oui, intertitre écrit; la durée manque | `/nous-trouver/`, `/en/visit/` (calcul de l'Agence; adresse du Zoo à vérifier sur son propre site) |
| Livrez-vous? (X11) | Oui : cueillette au 3, rue Court | `/nous-trouver/`, pilier (la livraison reste à confirmer, research/14 O3) |
| Y a-t-il des places assises, un café? (X12) | Oui, question écrite; la réponse manque | `/nous-trouver/` (research/14 N3) |
| Des chocolatines? Des boîtes pour une réunion? (L6, L7) | Oui, questions écrites; vos réponses manquent | `/viennoiseries/` (research/14 P2, P12) |
| Qui sont les propriétaires, quelle est l'histoire? (B3 : « rien sur le propriétaire ») | Oui, page écrite; les faits manquent | `/a-propos/`, `/a-propos/chef/` (research/14 C1, C2, D2) |
| Un gâteau sans gluten? (C6 : des recettes seulement) | Oui, comme information sur les allergènes, jamais comme allégation | `/allergenes/` |
| Comment choisir entre pâtisserie, épicerie et fait maison? (C1, C2 : des palmarès; la réponse à C1 les juge « peu fiables ») | Non | Comparatif prévu (avocat) |

---

## 6. Les palmarès et répertoires à rejoindre

Être sur chaque liste où la catégorie se décide est le premier coup hors du site : avec des preuves, jamais contre un paiement caché. Le détail des fiches et les modèles de demande sont dans [docs/06](06-annuaires-listicles.md).

### 6.1 Le calcul de l'outil

**Généré par market.mjs (29 octobre 2026)** :

- (serp.mjs remplit cette liste ; sinon docs/06 à la main)

Être dans chaque liste où la catégorie se décide est le coup off-site n°1 (Layers 12.5, 15.2) — avec des preuves, jamais contre paiement non signalé.

### 6.2 Les listes vues dans les réponses (complété à la main)

Sources : [research/05 W44.9](../research/05-serp-baseline.md) (29 octobre 2026) et [research/03 §4](../research/03-competitors.md) (25 octobre 2026). « Lien n° » = rang dans la liste de liens du relevé indirect, pas une position Google.

| Liste ou répertoire | Où il sort (lien n°) | La boutique y est? | Problème vu | Notre geste (preuves seulement) | Modèle |
|---|---|---|---|---|---|
| Three Best Rated, « 3 Best Bakeries in Granby, QC » | C8 (1), L1 et X1 (6), X2 (9), B1 (7), B3 (3) | Oui, 2e | Pain-Pain (fermée) en 1re place; nos anciennes heures | Demande de mise à jour avec les articles de presse et les heures de la fiche Google | B ([docs/06 §4.3](06-annuaires-listicles.md)) |
| Three Best Rated, « 3 Meilleures Boulangeries à Granby » | B1 (4), B2 (2), B3 (4), X2 (5) | Oui | La réponse à B2 y a pris les heures et le téléphone de Pain-Pain (déduit) | La même demande, en français | B |
| Three Best Rated, « 3 Meilleurs Pâtisseries à Granby » | L1 et X1 (5), L6 (15), X3 (3), X4 (1), X5 (2) | **Non** | Elle tient X4 et nourrit les réponses sur les gâteaux | Demande d'inclusion avec photos, avis datés et page Prix | F |
| Three Best Rated, « 3 Best Cakes in Granby, QC » | C8 (10) | Non | — | La même demande d'inclusion | F |
| RestoMontreal, fiche Pâtisserie Cocovanille (français, anglais, vote) | 16 recherches; 1er lien de B1, B2, B3, X3, X5, X8 | Oui | « Peut-être temporairement fermée » (B2, X2, X8); dimanche à 9 h | Réclamer et corriger la fiche; ajouter l'adresse du site au lancement | A |
| RestoMontreal, liste « cafés Granby » | X12 (10) | Non | La boutique manque aux pages café | Demander la catégorie « café » (le café est annoncé sur votre page Facebook) | A (adapté) |
| Tastet, « Nos restaurants coups de cœur à Granby » | C10 (2, 3), X2 (15) | Non | Aucune pâtisserie sur la liste | Proposition avec l'étude de prix, après le lancement | [docs/04 §5.4](04-pitch-media.md) |
| Tourisme Cantons-de-l'Est, « Happiness is a terrace » | L5 (1), X12 (2) | Non | La source des réponses « café près du Zoo » | Demande d'inscription, seulement si l'offre du café le permet | [docs/04](04-pitch-media.md) |
| Tourisme Granby région (fiches et article « 10 boutiques gourmandes ») | Aucune recherche (jamais sorti) | Non trouvée | Absente de la liste du tourisme local | Demander une fiche; proposer le prochain article (semaine S6 du plan) | [docs/04 §5.4](04-pitch-media.md) |
| Yelp (boulangeries de Granby) et Tripadvisor (fiche d27188801) | Aucune recherche le 29 octobre | Yelp : pas dans l'extrait; Tripadvisor : oui | Yelp : le 1er est fermé; Tripadvisor : notes contradictoires | Réclamer les deux fiches; jamais d'avis demandé sur Yelp | [docs/06 §3](06-annuaires-listicles.md) |
| Uber Eats, « Bakery delivery in Granby » | C8 (2), L8 (3), X11 (14) | Non | Tim Hortons et « Made By Pam » | Hors sujet tant qu'il n'y a pas de livraison (research/14 O3) | — |
| WeddingWire.ca | C9 (3, 4) | Non | Aucun pâtissier des Cantons-de-l'Est | Seulement si les gâteaux de mariage sont offerts | — |
| Tripadvisor Argentine, « Restaurantes de Granby » | C10 (1) | Non montrée | La seule page en espagnol | La fiche Tripadvisor réclamée suffit | — |

---

## 7. Ce que ce document ne sait pas

### 7.1 Les limites de l'outil

**Généré par market.mjs (29 octobre 2026)** :

- Les autorités de liens (domaines référents) : Ahrefs/Semrush ou l'export Search Console « Liens » des concurrents n'existe pas — estimer par les mentions trouvées.
- Les avis Google des concurrents hors pack local : les relever à la main dans scoreboard/competitors.csv (gbp_rating, gbp_reviews).
- Copilot et AI Mode : pas d'API — relevé manuel hebdomadaire.
- Les chiffres concurrents restent des faits sur les concurrents (page + date), jamais des faits du client.

### 7.2 Les faits qui manquent

- [[FACT NEEDED: personne qui fait la vérification sur cellulaire à Granby chaque lundi, 20 à 30 minutes (research/14 D1)]]
- [[FACT NEEDED: statut et accès propriétaire de la fiche Google (research/14 S1, S2)]]
- [[FACT NEEDED: nom exact de chaque concurrent dans Google Maps, avec sa catégorie et son nombre d'avis actuel (Google Maps n'a pas pu être ouvert)]]
- [[FACT NEEDED: commande pour le lendemain, heure limite et formats (research/14 P4)]]
- [[FACT NEEDED: grille de prix par format et portions par format (research/14 P1, P7)]]
- [[FACT NEEDED: bûches 2026 oui ou non, d'ici le 1er novembre 2026 (research/14 P3)]]
- [[FACT NEEDED: gâteaux de mariage, macarons, chocolatines, boîtes pour le bureau, produits sans gluten, livraison (research/14 P2, P12, O3)]]
- [[FACT NEEDED: personne qui sert en anglais; personne qui sert en espagnol (research/14 L1, L2)]]
- **Le trajet depuis le Zoo** est établi : environ 5 à 8 minutes en auto (3 à 4 km selon le trajet), calculé le 29 octobre 2026 avec deux calculateurs d'itinéraire; l'adresse du Zoo pour les visiteurs est le 1050, boulevard David-Bouchard Nord, selon son propre site ([research/20c](../research/20c-place-and-access.md)). Une page du site s'en sert : « Depuis le Zoo de Granby » ([research/22d](../research/22d-local-content.md)).
- [[FACT NEEDED: source officielle de salubrité pour la conservation des gâteaux à la crème (MAPAQ ou Santé Canada), avec son adresse]]
- **L'autorité des liens des concurrents** (combien de sites les lient) : aucune donnée. L'Agence n'utilise pas d'outil payant de liens, et les outils gratuits ne lisent que nos propres sites.
- **Le site du Marmiton** n'a pas pu être lu le 29 octobre 2026 : l'outil s'arrête quand une adresse répond sans être une page web ([scoreboard/README.md](../scoreboard/README.md), limites).
- **Les moteurs d'IA** n'ont jamais été interrogés : le premier relevé, à la main ou par leurs interfaces de programmation, dira quels sites ils citent pour nos requêtes.

---

## 8. Comment ce document se met à jour

- **Chaque lundi** : les relevés de la semaine entrent dans `scoreboard/runs/<semaine>.csv`, puis `node tools/citation-share.mjs` et `node tools/market.mjs --week <semaine> --out scoreboard/market/<semaine>.md` ([scoreboard/README.md](../scoreboard/README.md)). **Ne jamais lancer `market.mjs` sans `--out`, ni `tools/weekly.mjs` depuis la racine du dépôt** : les deux réécriraient ce document et effaceraient les parties faites à la main. L'exécution automatique de GitHub (`weekly.yml`) travaille dans son propre dossier et ne touche pas ce fichier.
- **Le premier lundi du mois** : l'Agence recopie dans ce document les blocs générés de la dernière semaine (§1.1, §2.1, §4.2, §5.1, §6.1, §7.1 et l'Annexe A) et met à jour les parties faites à la main d'après la tendance de quatre semaines. Elle relit aussi les sites des trois concurrents principaux (`node tools/crawl.mjs https://cakegranby.ca/ --max 40`, et de même pour avecungranda.com et rosegateaux.com) : de nouvelles pages annoncent leur prochain mouvement.
- **La règle de lecture** : aucune conclusion avant quatre semaines dans la même direction; trois passages par requête et par moteur dès que les clés existent; un changement à la fois ([docs/02 §10](02-rythme-hebdo.md)).
- **Les semaines de relevé indirect** (2026-W43 et 2026-W44) passeront dans `scoreboard/runs/proxy/` le jour où la première mesure depuis Granby sera classée, pour qu'aucune tendance ne compare une semaine indirecte et une vraie.
- **Quand les trois tableaux de la définition de « premier » tiendront** quatre lundis de suite ([docs/01 §5](01-plan-90-jours.md)), on élargit d'un cran : « pâtisserie Granby » et les viennoiseries; Bromont seulement avec une vraie livraison; une langue de plus.

---

## Annexe A — La carte de bataille complète, générée par market.mjs (29 octobre 2026)

« Notre pos. » vaut « — » partout : le site n'est pas en ligne. « W » est la note sur 20 de [scoreboard/prompts.csv](../scoreboard/prompts.csv). Les candidates (X) et les variantes ne comptent pas dans la définition de « premier ».

| Prompt | Type | W | Notre pos. | Propriétaire n°1 (type) | Extrait | AI Overview | Cité IA | Moteurs IA citent | Pack local | Format qui gagne | Priorité | Coup à jouer |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C4 bûche de Noël Granby | commercial | 19 | — | — | — | — | — | — | — | — | 57 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L3 gâteau pour demain Granby | local | 19 | — | — | — | — | — | — | — | — | 57 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L10 torta de cumpleaños personalizada Granby | local | 19 | — | — | — | — | — | — | — | — | 57 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C1 meilleure pâtisserie à Granby | commercial | 18 | — | — | — | — | — | — | — | — | 54 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C2 meilleur gâteau de fête à Granby | commercial | 18 | — | — | — | — | — | — | — | — | 54 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C7 prix gâteau de mariage Granby | commercial | 18 | — | — | — | — | — | — | — | — | 54 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C10 mejor pastelería en Granby Quebec | commercial | 18 | — | — | — | — | — | — | — | — | 54 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L4 pâtisserie ouverte dimanche Granby | local | 18 | — | — | — | — | — | — | — | — | 54 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L6 chocolatines Granby | local | 18 | — | — | — | — | — | — | — | — | 54 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C3 pâtisserie gâteau de mariage Cantons-de-l'Est | commercial | 17 | — | — | — | — | — | — | — | — | 51 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C5 macarons Granby avis | commercial | 17 | — | — | — | — | — | — | — | — | 51 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C6 gâteau sans gluten Granby | commercial | 17 | — | — | — | — | — | — | — | — | 51 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C8 best bakery in Granby Quebec | commercial | 17 | — | — | — | — | — | — | — | — | 51 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| C9 wedding cake bakery Eastern Townships | commercial | 17 | — | — | — | — | — | — | — | — | 51 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L1 pâtisserie près de moi | local | 17 | — | — | — | — | — | — | — | — | 51 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L7 boîte de pâtisseries pour réunion Granby | local | 17 | — | — | — | — | — | — | — | — | 51 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L8 bakery near Granby Zoo | local | 16 | — | — | — | — | — | — | — | — | 48 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L9 order custom cake online Granby | local | 16 | — | — | — | — | — | — | — | — | 48 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| B2 Coco Vanille Granby heures | brand | 19 | — | — | — | — | — | — | — | — | 47 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X8 croissant aux amandes Granby | candidate | 19 | — | — | — | — | — | — | — | — | 47 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L2 commander un gâteau de fête en ligne Granby | local | 15 | — | — | — | — | — | — | — | — | 45 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L5 café et pâtisserie près du Zoo de Granby | local | 15 | — | — | — | — | — | — | — | — | 45 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| B1 Pâtisserie Coco Vanille Granby avis | brand | 18 | — | — | — | — | — | — | — | — | 44 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X1 pâtisserie Granby | candidate | 18 | — | — | — | — | — | — | — | — | 44 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X3 gâteau d'anniversaire Granby | candidate | 18 | — | — | — | — | — | — | — | — | 44 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X7 croissants Granby | candidate | 18 | — | — | — | — | — | — | — | — | 44 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I3 quelle grosseur de gâteau pour 20 personnes | informational | 17 | — | — | — | — | — | — | — | — | 41 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I10 cuánto cuesta una torta de quinceañera en Quebec | informational | 17 | — | — | — | — | — | — | — | — | 41 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X2 boulangerie Granby | candidate | 17 | — | — | — | — | — | — | — | — | 41 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X4 gâteau personnalisé Granby | candidate | 17 | — | — | — | — | — | — | — | — | 41 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X5 gâteau sur mesure Granby | candidate | 17 | — | — | — | — | — | — | — | — | 41 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X13 gâteau 8 pouces combien de portions | candidate | 17 | — | — | — | — | — | — | — | — | 41 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I1 combien coûte un gâteau de fête personnalisé à Granby | informational | 16 | — | — | — | — | — | — | — | — | 38 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I2 combien de jours d'avance commander un gâteau personnalisé | informational | 16 | — | — | — | — | — | — | — | — | 38 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I4 comment transporter un gâteau à étages en auto | informational | 16 | — | — | — | — | — | — | — | — | 38 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| B3 Que sais-tu de la Pâtisserie Coco Vanille à Granby ? | brand | 16 | — | — | — | — | — | — | — | — | 38 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X10 vol-au-vent Granby | candidate | 16 | — | — | — | — | — | — | — | — | 38 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X11 gâteau de fête livraison Granby | candidate | 16 | — | — | — | — | — | — | — | — | 38 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I5 prix d'un gâteau de mariage par portion au Québec | informational | 15 | — | — | — | — | — | — | — | — | 35 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I7 comment conserver un gâteau à la crème jusqu'au lendemain | informational | 15 | — | — | — | — | — | — | — | — | 35 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I8 how much does a custom birthday cake cost in Quebec | informational | 15 | — | — | — | — | — | — | — | — | 35 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X9 Paris-Brest Granby | candidate | 15 | — | — | — | — | — | — | — | — | 35 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X12 café pâtisserie centre-ville Granby | candidate | 15 | — | — | — | — | — | — | — | — | 35 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X6 pâtisserie française Granby | candidate | 14 | — | — | — | — | — | — | — | — | 32 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I6 différence entre crème au beurre et ganache sur un gâteau | informational | 13 | — | — | — | — | — | — | — | — | 29 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I9 how far in advance to order a wedding cake | informational | 11 | — | — | — | — | — | — | — | — | 23 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X14 what size cake for 20 people | candidate | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X15 wedding cake Bromont | candidate | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X16 gâteau de mariage Bromont | candidate | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X17 torta de cumpleaños Granby | candidate | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X18 ponqué de cumpleaños Granby | candidate | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X19 pastel de cumpleaños personalizado Granby | candidate | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| X20 panadería en Granby Quebec | candidate | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| B1-cocovanille Pâtisserie Cocovanille Granby | variant | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| B3-en What is Pâtisserie Coco Vanille in Granby known for? | variant | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L8-quebec bakery near Granby Zoo Quebec | variant | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L9-quebec order custom cake online Granby Quebec | variant | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| L10-quebec torta de cumpleaños personalizada Granby Quebec | variant | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |
| I2-fete combien de temps d'avance pour commander un gâteau de fête | variant | — | — | — | — | — | — | — | — | — | -10 | pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes |

W = score de gagnabilité (prompts.csv). Priorité = 3 × W + 20 si à portée (positions 2–10) + 10 si commercial/local + pack local manqué + AI Overview manqué − distance.

---

## Sources

Fichiers du projet, lus le 29 octobre 2026 :
- [research/03-competitors.md](../research/03-competitors.md) (§0 à §8 et ses sources, vues le 25 octobre 2026); [research/05-serp-baseline.md](../research/05-serp-baseline.md) (§0 à §10 et la mise à jour du 29 octobre 2026, W44.0 à W44.12); [research/12-plan-review.md](../research/12-plan-review.md) (§3, §4, G3); [research/00-master-concept.md](../research/00-master-concept.md) (§10.5); [research/07-legal-quebec-compliance.md](../research/07-legal-quebec-compliance.md) (K-5, S12); [research/15-decisions-and-risks.md](../research/15-decisions-and-risks.md) (R5, R25, R29); [research/14-owner-questions.md](../research/14-owner-questions.md) (codes des questions).
- `data/facts.json` (`hours.google_listing`, `phone.primary`, `reviews.google`), `data/competitors.csv`, `data/prompts.csv`, `data/serp-baseline-2026-W43.csv`, `data/serp-baseline-2026-W44.csv`.
- Le site construit, en lecture seule : `apps/web/src/lib/routes.js` (registre des pages), `apps/web/src/seed/content.js` (intertitres et FAQ), `apps/web/src/lib/schema.js`, `apps/web/src/components/site/Contract.js`.
- Les documents [docs/01](01-plan-90-jours.md), [docs/02](02-rythme-hebdo.md), [docs/06](06-annuaires-listicles.md), [docs/16](16-recherche.md) et [docs/17](17-architecture.md).

Mesures faites le 29 octobre 2026 :
- `node tools/citation-share.mjs` (→ [scoreboard/summary.csv](../scoreboard/summary.csv)) et `node tools/market.mjs` (→ [scoreboard/market/2026-W44.md](../scoreboard/market/2026-W44.md)).
- `node tools/crawl.mjs` (au plus 40 pages, règles robots.txt respectées, profils seulement) sur https://cakegranby.ca/, https://www.avecungranda.com/, https://rosegateaux.com/ et https://delicessucresgranby.my.canva.site/ (→ `crawl/<site>.json`); échec sur https://lemarmiton.ca/.

Pages citées par la recherche (résumés de recherche, pages non ouvertes) :
- Three Best Rated : https://threebestrated.ca/bakeries-in-granby-qc · https://threebestrated.ca/fr-boulangeries-in-granby-qc · https://threebestrated.ca/fr-gâteaux-in-granby-qc · https://threebestrated.ca/cakes-in-granby-qc (vues le 25 et le 29 octobre 2026)
- RestoMontreal, Pâtisserie Cocovanille : https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/ (vue le 29 octobre 2026); liste des cafés de Granby : https://www.restomontreal.ca/restaurants/cafes-granby/en/?c=25%2C307&d=103 (vue le 29 octobre 2026)
- RestoMontreal, Mont Rose Pâtisserie & Café (Granby) : https://www.restomontreal.ca/resto/mont-rose-patisserie-cafe-granby/23174/en/ · Mélisse Pâtisserie : https://www.restomontreal.ca/resto/melisse-patisserie-granby/20631/en/ · Le Marmiton : https://www.restomontreal.ca/resto/marmiton-service-de-traiteur-inc-granby/16337/fr/ (vues le 25 octobre 2026)
- Cake Design Granby : https://cakegranby.ca/products/gateau-sur-mesure (vue le 25 octobre 2026) · Avec un Grand A : https://www.avecungranda.com/commande-en-ligne (vue le 25 octobre 2026) · Rose Gâteaux : https://rosegateaux.com/ (vue le 25 octobre 2026)
- Fermeture de Pain-Pain : La Voix de l'Est, 16 juin 2026, https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/ · M105, https://m105.ca/nouvelle/granby-fermetures-a-granby-scores-et-pain-pain-tirent-leur-reverence/ · Granby Express, https://www.granbyexpress.com/actualites/les-fourneaux-de-la-boulangerie-pain-pain-seteignent/ (vues le 25 octobre 2026)
- Tastet, Granby : https://tastet.ca/en/lists/nos-restaurants-coups-de-coeur-a-granby/ (vue le 29 octobre 2026) · Tourisme Cantons-de-l'Est, « Happiness is a terrace » : https://www.easterntownships.org/article/641/happiness-is-a-terrace (vue le 29 octobre 2026) · Tourisme Granby région, « 10 boutiques gourmandes » : https://granbyregion.com/10-boutiques-gourmandes-et-epiceries-fines-a-decouvrir/ (vue le 25 octobre 2026)
- Prix plancher : https://traiteur.iga.net/categories/102/product/631?lang=fr · https://granby.maitreglacier.com/categorie-produit/gateaux-2/ (vues le 25 octobre 2026)
- Uber Eats, Granby : https://www.ubereats.com/ca/category/granby-qc/bakery · Tripadvisor Argentine : https://www.tripadvisor.com.ar/Restaurants-g182165-Granby_Quebec.html (vues le 29 octobre 2026)
