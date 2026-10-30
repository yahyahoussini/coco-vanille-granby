# Brief de page — Café et pâtisserie près du Zoo de Granby

**Une seule page pour les visiteurs du Zoo de Granby, rangée sous « Nous trouver ». Ce brief remplit le gabarit de [docs/08-brief-page.md](../08-brief-page.md) (§2). Le texte prêt à coller dans le site, la source de chaque fait et le résultat des vérifications sont dans [research/22d-local-content.md](../../research/22d-local-content.md) (§1).**

| | |
|---|---|
| Mis à jour | 29 octobre 2026 |
| Préparé par | Yahya (BrandHub.ma), l'Agence |
| Contrat de page lu dans | `apps/web/src/seed/content.js` (état du 29 octobre 2026 vers 16 h, heure UTC), `apps/web/test/unit/content.test.js`, `apps/web/src/lib/routes.js`, `apps/web/src/components/templates/index.js` |
| S'appuie sur | research/20b (l'offre de la boutique), research/20c (le lieu et l'accès), research/21 (décisions de l'Agence), research/22d (cette étape), research/05 (relevé du 29 octobre 2026, requêtes L5 et L8), research/04 (§2, P16; §5), research/00 §5.1, docs/17 (§6 et §7), docs/19 |
| Voir aussi | [docs/17-architecture.md](../17-architecture.md) (la page dans l'arbre) · [docs/14-calendrier-contenu.md](../14-calendrier-contenu.md) (la relecture du printemps) · [docs/05-gbp-checklist.md](../05-gbp-checklist.md) (la fiche Google) |

Mots utilisés :
- **Page satellite** (en anglais *doorway page*) : une page créée pour se classer sur une requête, qui envoie ailleurs au lieu de répondre. Google la traite comme du spam.
- **Calculateur d'itinéraire** : un service qui calcule un trajet et sa durée sur une carte. Ici : OSRM et Valhalla, sur les données d'OpenStreetMap.

---

## En bref

1. **Oui à une seule page.**
   - Adresses : `/nous-trouver/zoo-de-granby/` et `/en/visit/granby-zoo/`, sous « Nous trouver ».
   - Elle remplace la page « En visite à Granby » prévue à `/en-visite-a-granby/` (research/04 P16; docs/17 §6).
   - Les deux conditions posées pour cette page sont remplies : la distance (research/20c) et l'offre du café (research/20b).
2. **Ce n'est pas une page satellite.**
   - Elle répond elle-même aux questions d'une journée au Zoo.
   - C'est la seule page de ce genre.
   - Elle ne reprend aucune question ni aucune phrase de `/nous-trouver/` (vérifié, §1).
3. **Aucun fait ne manque.** La page ne contient aucune mention [[FACT NEEDED]] : elle se publie avec le site. Tout vient de sources vérifiées :
   - la Ville de Granby
   - le Zoo de Granby
   - vos publications
   - deux calculateurs d'itinéraire
4. **Ce qui la rend utile :**
   - le trajet : environ 5 à 8 minutes en auto, soit 3 à 4 km
   - l'autobus : le circuit Nord, dont l'arrêt est déplacé l'été
   - le stationnement : gratuit, et sans limite de temps la fin de semaine dans les cases de 4 h
   - les règles du Zoo : on peut apporter son lunch, mais pas de contenants de verre; on peut sortir et revenir avec la main étampée
   - vos jours d'ouverture : ouverte le dimanche, fermée le lundi et le mardi
5. **Ce qu'elle ne dit pas**, parce que rien n'est publié (§7) :
   - l'entrée et l'accès en fauteuil roulant
   - le nombre de places
   - les modes de paiement
   - le service en anglais
   - une offre propre aux visiteurs du Zoo

---

## 1. La décision : une page utile, pas une page satellite

Ce que dit Google (Search Central, « Règles relatives au spam pour la recherche Web de Google », section sur les pages satellites; dernière mise à jour le 2026/08/31; lue le 29 octobre 2026) :

> « L'utilisation abusive des pages satellites se produit lorsque des pages ou des sites sont créés pour bien se classer pour des requêtes de recherche spécifiques similaires. »
>
> « Elles redirigent les internautes vers des pages intermédiaires qui ne sont pas aussi utiles que la destination finale. »

| Exemple donné par Google (résumé) | Cette page |
|---|---|
| Plusieurs sites ou adresses presque identiques pour une même requête | Une seule adresse par langue, sur le seul site de la boutique |
| Des pages pour des régions ou des villes qui envoient toutes vers une même page | Une seule page, pour un seul lieu réel, à 3 ou 4 km. Aucune autre page de lieu ou de ville ne sera créée (Bromont, Waterloo, lac Boivin, Marché public…) : ces lieux restent des phrases de `/nous-trouver/`. docs/17 §6 écarte déjà les pages « villes » sans boutique ni livraison |
| Des pages qui servent à diriger les visiteurs vers la partie utile du site | Pour une journée au Zoo, la page est elle-même la partie utile : trajet, autobus, stationnement, règles du Zoo, jours d'ouverture, quoi acheter à emporter. Son action principale est « Itinéraire » |
| Des pages presque semblables, plus proches d'une page de résultats que d'une arborescence | Elle est l'enfant de « Nous trouver » dans le registre et dans le fil d'Ariane. La vérification du 29 octobre 2026 ne trouve aucune question en commun avec une autre page, et aucune phrase de 8 mots ou plus copiée de `/nous-trouver/` |

**Pourquoi elle est utile, et pas seulement permise.**
- **Le trou mesuré** (relevé indirect du 29 octobre 2026, fait depuis les États-Unis, research/05) :
  - Pour L5, « café et pâtisserie près du Zoo de Granby » (15 sur 20) :
    - la réponse nommait deux cafés et disait « aucun résultat ne confirme leur distance exacte du zoo »;
    - elle donnait l'adresse postale du Zoo (525, rue Saint-Hubert) au lieu de son adresse pour les visiteurs.
  - Pour L8, « bakery near Granby Zoo » (16 sur 20), aucune boulangerie du Québec n'était nommée : 9 liens sur 12 menaient à des Granby américains.
- **Les questions d'une journée au Zoo** que la page « Nous trouver » ne règle pas :
  - Peut-on apporter son lunch?
  - Peut-on sortir et revenir?
  - Où est l'arrêt d'autobus l'été?
  - Y a-t-il une limite de stationnement la fin de semaine?

**Les garde-fous.** Décision de l'Agence du 29 octobre 2026 (mandat de Yahya), que vous pouvez modifier.
1. Une seule page de ce genre : aucune autre page « près de » un lieu ou une ville.
2. Le nom de la fiche Google ne change pas : jamais « Zoo » ni « Granby » dans le nom de l'entreprise.
3. La page est relue avant le samedi 1er mai 2027, date que le calendrier de research/04 §6.2 fixe pour la page des visiteurs, à relire chaque printemps. On relit :
   - la foire aux questions et les règlements du Zoo
   - le dépliant du transport urbain
   - les plans de stationnement de la Ville, dont les deux projets de règlement du 19 octobre 2026

   On refait aussi le calcul des trajets, une fois par année. Si le Zoo change une règle, la section change ou disparaît.
4. Ni l'horaire, ni les prix, ni le logo du Zoo ne sont copiés : la page renvoie à sa page « Horaire et directions ».

---

## 2. La fiche (gabarit de docs/08 §2)

| Champ | Valeur |
|---|---|
| Adresse française · anglaise (· espagnole) | `/nous-trouver/zoo-de-granby/` · `/en/visit/granby-zoo/` · espagnole : aucune (le volet est fermé; la question S14 attend son ouverture) |
| Clé du registre et condition de publication | `zoo-de-granby`, gabarit `content`, statut `core`, parent `nous-trouver`. Aucune condition : la page n'attend aucun fait de la boutique. Ligne à ajouter dans `apps/web/src/lib/routes.js`, après celle de `nous-trouver` : `{ key: 'zoo-de-granby', template: 'content', status: 'core', parent: 'nous-trouver', paths: { fr: '/nous-trouver/zoo-de-granby/', en: '/en/visit/granby-zoo/' } }` |
| Type | locale |
| Requête principale (code de `scoreboard/prompts.csv`, note sur 20) | L5 « café et pâtisserie près du Zoo de Granby », 15 sur 20 (note provisoire, relevé indirect du 29 octobre 2026) |
| Requêtes secondaires et mots-clés (`data/keywords.csv`, priorité estimée) | L8 « bakery near Granby Zoo » (16, en anglais) et sa variante « … Quebec ». Questions F27, E04 et E17 de research/04 §5 (S14 en espagnol, plus tard). Mots-clés du groupe « visitors » : café et pâtisserie près du zoo de granby (moyenne), bakery near granby zoo (moyenne), where to eat near granby zoo (moyenne), pique-nique zoo de granby (faible) |
| Intention lue dans les résultats | locale et informationnelle : où prendre un café ou manger pendant une journée au Zoo, et comment s'y rendre |
| Forme qui gagne déjà (relevé fait depuis Granby, research/05 §9) | [[FACT NEEDED: relevé depuis un cellulaire à Granby (research/05 §9, research/14 D1)]]. Relevé indirect du 29 octobre 2026 : pour L5, un article touristique (easterntownships.org, « Happiness is a terrace ») et deux cafés; pour L8, des pages de Granby américains |
| Éléments présents dans la page de résultats | [[FACT NEEDED: même relevé]] |
| Sous-questions (3 à 6) | les 5 intertitres du §3.2 |
| « Autres questions posées » récoltées depuis Granby (3 niveaux) | [[FACT NEEDED: récolte depuis Granby (research/04 V5)]] |
| Titre (moins de 60 caractères) | « Café et pâtisserie près du Zoo de Granby · Coco Vanille » (55 caractères) |
| Description (140 à 160 caractères) | « À environ 5 à 8 minutes en auto du Zoo de Granby, la Pâtisserie Coco Vanille sert café, viennoiseries et salé au 3, rue Court. Trajet, autobus, stationnement. » (158 caractères) |
| H1 | « Café et pâtisserie près du Zoo de Granby » |
| Bloc réponse (40 à 60 mots) | voir §3.1 |
| En bref (5 faits datés, la marque dans chaque ligne) | voir §4 |
| Preuves à rassembler | Voir §5. Chiffres sourcés : 5 à 8 minutes et 3 à 4 km en auto; environ 300 m à pied depuis le terminus; environ 100 m jusqu'au stationnement. S'y ajoutent les règles du Zoo et vos publications. Citation d'une personne nommée : [[FACT NEEDED: citation de la propriétaire, avec son accord (research/14 C1)]] |
| Tableau (options × critères, avec légende) | Proposé, si le gabarit accepte un tableau sous une section (comme la page Prix). Légende : « Du Zoo de Granby à la boutique, au 29 octobre 2026 ». Lignes : en auto (environ 5 à 8 minutes, 3 à 4 km; calcul OSRM et Valhalla) · en autobus (circuit Nord jusqu'au Terminus Centre-ville, puis environ 300 m à pied; dépliant de la Ville de juillet 2026). Sans tableau, la section 2 donne les étapes en liste |
| Liste numérotée (étapes) | les 3 étapes en autobus (section 2) |
| Images réelles (fichier, texte de remplacement factuel, dimensions) | [[FACT NEEDED: photo réelle de la devanture, vue du trottoir (research/14 S3, H5)]]. Jamais une photo ni le logo du Zoo; jamais une photo d'illustration présentée comme la boutique |
| Vidéo | aucune pour l'instant |
| FAQ (5 à 8 vraies questions, dont une formulée comme à Granby) | 6 questions, dont « C'est-tu ouvert le lundi? » (§3.3) |
| Action principale · secondaire | « Itinéraire » (Google Maps) · « Appeler » au 450-372-7177. Le gabarit `content` affiche « Commander » par défaut : le changement d'une ligne est décrit dans research/22d §1.2 |
| Liens internes entrants (au moins 3 : depuis quelles pages, avec quelle ancre) | 4 pages par langue, plus le bloc « À consulter aussi » de `/nous-trouver/` (§6) |
| Liens internes sortants (la page parente + 2 pages sœurs) | `/nous-trouver/` (parent : le fil d'Ariane et « le tableau des heures de la page Nous trouver ») · `/commander/` (« la page Commander ») · `/viennoiseries/` et `/patisseries/` (section sur le lunch) · `/faq/` (les ateliers créatifs) |
| Auteur, date de publication, note de changement | L'équipe Coco Vanille · publiée le [[FACT NEEDED: date de mise en ligne du site]] · note : « Première version : trajet depuis le Zoo calculé le 29 octobre 2026; règles du Zoo et plans de stationnement de la Ville lus le même jour. » |
| Données structurées (types) | WebPage + BreadcrumbList, comme toute page. S'y ajoute, sur le nœud WebPage de cette page seulement, une mention du Zoo de Granby : type `Zoo`, son nom, son site et son adresse (research/22d §4.2 et §4.5). Aucune note « étoiles » et aucun horaire du Zoo |
| Version anglaise | Rédigée par l'Agence, à faire relire par une personne anglophone (research/14 M2). Mêmes faits, même nombre de sections, de listes et de questions, et moins de mots que le français : jamais plus complète (vérifié, §3.4) |
| Porte de sortie | voir §8 |

---

## 3. Le texte de la page (à coller : research/22d §1.3)

### 3.1 Titre, description, H1 et bloc réponse

- **Titre** (55 caractères) : « Café et pâtisserie près du Zoo de Granby · Coco Vanille »
- **Description** (158 caractères) : « À environ 5 à 8 minutes en auto du Zoo de Granby, la Pâtisserie Coco Vanille sert café, viennoiseries et salé au 3, rue Court. Trajet, autobus, stationnement. »
- **H1** : « Café et pâtisserie près du Zoo de Granby »
- **Bloc réponse** (56 mots; la première phrase se dit à voix haute, sans symbole ni parenthèse) :

> La Pâtisserie Coco Vanille est au 3, rue Court, au centre-ville de Granby, à environ 5 à 8 minutes en auto du Zoo de Granby. On y sert café, viennoiseries et salé, sur place ou à emporter. Elle est ouverte le dimanche de 9 h 30 à 17 h et fermée le lundi et le mardi.

### 3.2 Les intertitres, la réponse d'abord

**1. Combien de temps faut-il pour aller du Zoo de Granby à la boutique?** (première phrase : 32 mots)

> Il faut environ 5 à 8 minutes en auto pour aller du Zoo de Granby à la Pâtisserie Coco Vanille, soit 3 à 4 km selon le trajet, sans compter la circulation.
>
> Le calcul part du stationnement principal du Zoo, dont l’adresse pour les visiteurs est le 1050, boulevard David-Bouchard Nord, et va jusqu’au 3, rue Court. Selon votre GPS, le trajet passe par la rue Saint-Hubert et la rue Principale, ou par le boulevard David-Bouchard Nord et la rue Dufferin.
>
> Méthode : deux calculateurs d’itinéraire, OSRM et Valhalla, sur les données d’OpenStreetMap, le 29 octobre 2026. Les durées ne comptent ni la circulation, ni les feux, ni le temps pour se stationner.

Preuve en dessous : le point de départ (le stationnement principal du Zoo), les deux trajets possibles, la méthode et sa date.

**2. Peut-on aller du Zoo à la boutique en autobus?** (première phrase : 29 mots)

> Oui : le circuit Nord du transport urbain de Granby, direction centre-ville, relie l’arrêt Saint-Hubert/Zoo au Terminus Centre-ville, rue du Centre, à environ 300 m à pied de la boutique. Horaires, tarifs et carte : granby.ca/fr/transport-urbain-granby.
>
> - Prendre le circuit Nord, direction centre-ville, à l’arrêt Saint-Hubert/Zoo, déplacé sur la rue Dorion l’été
> - Descendre au Terminus Centre-ville, rue du Centre
> - Marcher environ 300 m par la rue du Centre, la rue Principale, puis la rue Court

Preuve en dessous : les 3 étapes en liste, avec l’arrêt déplacé sur la rue Dorion l’été, et le lien vers le transport urbain de la Ville.

**3. Où se stationner au centre-ville en arrivant du Zoo?** (première phrase : 31 mots)

> Le stationnement municipal est gratuit au centre-ville de Granby, et le plus proche, le stationnement Centre-Court, est à environ 100 m de la boutique, entre les rues Court et du Centre.
>
> Ses cases de 4 h sont limitées du lundi au vendredi, de 8 h à 18 h; le samedi et le dimanche, ces cases n’ont pas de limite de temps, et certaines rangées n’en ont jamais. Le stationnement Johnson, au 18, rue Johnson, de l’autre côté de la rue Principale, a lui aussi des rangées sans limite de temps. Suivez toujours les panneaux; ces règles sont celles des plans de la Ville en vigueur depuis le 12 juin 2026.

Preuve en dessous : les cases de 4 h limitées du lundi au vendredi, l’absence de limite la fin de semaine, le stationnement Johnson et la date des plans de la Ville.

**4. Peut-on apporter au Zoo un lunch acheté à la boutique?** (première phrase : 24 mots)

> Oui : selon sa foire aux questions, le Zoo de Granby permet d’apporter son lunch, et plusieurs aires de pique-nique sont aménagées sur le site.
>
> Les règlements du Zoo interdisent toutefois les contenants de verre et les boissons alcoolisées apportées de l’extérieur (foire aux questions et règlements lus le 29 octobre 2026).
>
> La Pâtisserie Coco Vanille vend, sur place ou à emporter, des viennoiseries, des pâtisseries, des sandwichs et du salé, comme des feuilletés, des mini pizzas et des pastillas au poulet, selon ses publications d’août et de septembre 2026.

Preuve en dessous : les contenants de verre et l’alcool interdits au Zoo, et ce que la boutique vend à emporter, daté.

**5. Peut-on sortir du Zoo pour un café et revenir le même jour?** (première phrase : 36 mots)

> Oui : selon sa foire aux questions, le Zoo de Granby permet de sortir et de revenir pendant la journée en faisant étamper sa main à la sortie, même s’il encourage à limiter les entrées et sorties.
>
> Au 3, rue Court, la boutique sert le café, l’espresso, le latte et le chocolat chaud, et des boissons froides comme le café glacé et le matcha, sur place ou à emporter (liste publiée par la boutique en 2026).

Preuve en dessous : les boissons, sur place ou à emporter.

### 3.3 La FAQ (6 questions)

**1. C’est-tu ouvert le lundi?** (formulée comme on le dit à Granby; la réponse est en français standard)

> Non : la Pâtisserie Coco Vanille est fermée le lundi et le mardi. Elle est ouverte du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h 30 à 17 h; les jours fériés et les fermetures exceptionnelles sont dans le tableau des heures de la page Nous trouver.

**2. Peut-on s’asseoir pour prendre un café?**

> Oui : dans sa publication d’août 2026, la boutique se présente comme un endroit où l’on peut s’installer pour prendre un café; le café et le salé se vendent aussi à emporter.

**3. La Pâtisserie Coco Vanille est-elle sur le site du Zoo?**

> Non : la Pâtisserie Coco Vanille est au centre-ville de Granby, au 3, rue Court, à environ 3 à 4 km du Zoo par la route. Le Zoo a ses propres points de restauration sur le site, selon sa foire aux questions.

**4. Offrez-vous des ateliers créatifs?**

> Oui : la Pâtisserie Coco Vanille offre des ateliers créatifs du vendredi au dimanche, sur réservation au 438-528-7818. Un atelier de peinture, ou de décoration de perles et de strass sur un objet de votre choix, dure 2 h 30 et coûte 37 $ par personne, avec le matériel, une boisson et une part de gâteau. Les places sont limitées.

**5. Quelle adresse entrer dans le GPS pour le Zoo de Granby?**

> Pour s’y rendre, le Zoo de Granby donne l’adresse du 1050, boulevard David-Bouchard Nord, à Granby (J2H 0Y6), sur sa page Horaire et directions, où se trouve aussi son horaire : zoodegranby.com/horaire. Pour la boutique, entrez le 3, rue Court, à Granby (J2G 4Y6).

**6. Peut-on commander à l’avance pour passer en allant au Zoo?**

> Oui, pour les produits qui ont des plages de cueillette ce jour-là : commandez sur la page Commander ou par téléphone au 450-372-7177, puis passez au 3, rue Court pendant votre plage.

### 3.4 La version anglaise (même structure, jamais plus complète)

- **Titre** (58 caractères) : « Bakery and café near the Granby Zoo, Québec · Coco Vanille »
- **Description** (158 caractères) : « About 5 to 8 minutes by car from the Granby Zoo, Pâtisserie Coco Vanille serves coffee, viennoiseries and savoury food at 3 rue Court. Route, bus and parking. »
- **H1** : « Bakery and café near the Granby Zoo »
- **Bloc réponse** (53 mots) :

> Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec, about 5 to 8 minutes by car from the Granby Zoo. You can have coffee, viennoiseries and savoury snacks there, to stay or to go. The shop is open Sunday from 9:30 a.m. to 5 p.m. and closed Monday and Tuesday.

- **Intertitres** : 1. « How long does it take to get from the Granby Zoo to the shop? » · 2. « Can I take the bus from the Zoo to the shop? » · 3. « Where can I park downtown when coming from the Zoo? » · 4. « Can I bring a lunch from the shop into the Zoo? » · 5. « Can I leave the Zoo for a coffee and come back the same day? »
- **FAQ** : 1. « Are you open on Monday? » · 2. « Can I sit down for a coffee? » · 3. « Is Pâtisserie Coco Vanille inside the Zoo? » · 4. « Do you offer creative workshops? » · 5. « What address should I enter in my GPS for the Granby Zoo? » · 6. « Can I pre-order pastries for pickup on the way to the Zoo? »
- **Texte complet** : research/22d §1.3.

---

## 4. En bref (5 faits datés, la marque dans chaque ligne)

Le gabarit `content` n'affiche pas encore de bloc « En bref ». Ces lignes servent à la publication de la fiche Google, au fichier llms.txt et au futur bloc de faits.

| Fait | Source | État |
|---|---|---|
| La Pâtisserie Coco Vanille est au 3, rue Court, au centre-ville de Granby (Québec). | Registraire des entreprises (research/20a) | prêt |
| La Pâtisserie Coco Vanille est à environ 5 à 8 minutes en auto du Zoo de Granby, soit 3 à 4 km selon le trajet (calcul du 29 octobre 2026). | research/20c Z-8 | prêt |
| La Pâtisserie Coco Vanille est ouverte du mercredi au samedi de 8 h 30 à 17 h 30 et le dimanche de 9 h 30 à 17 h; elle est fermée le lundi et le mardi. | Fiche Google relayée le 27 octobre 2026 (à confirmer par vous, research/14 H1) | prêt |
| La Pâtisserie Coco Vanille sert le café et des boissons froides, sur place ou à emporter (publication du 25 août 2026). | research/20b S-14 à S-16 | prêt |
| La Pâtisserie Coco Vanille offre des ateliers créatifs du vendredi au dimanche, sur réservation au 438-528-7818 (publication du 22 octobre 2026). | research/20b S-17 à S-19 | prêt |

---

## 5. Les preuves (une source pour chaque phrase)

| Ce que dit la page | Source | État |
|---|---|---|
| Le trajet en auto : environ 5 à 8 minutes, 3 à 4 km, sans compter la circulation | Deux calculateurs d'itinéraire (OSRM et Valhalla), sur les données d'OpenStreetMap, le 29 octobre 2026 (research/20c Z-5, Z-7, Z-8) | vérifié : les deux s'entendent sur l'intervalle |
| L'adresse du Zoo pour les visiteurs (1050, boulevard David-Bouchard Nord, J2H 0Y6) et son « stationnement principal » | Page « Horaire et directions » et foire aux questions du Zoo, lues le 29 octobre 2026 | vérifié : source officielle |
| Le circuit Nord, direction centre-ville, de l'arrêt Saint-Hubert/Zoo au Terminus Centre-ville, rue du Centre; l'arrêt déplacé sur la rue Dorion l'été | Dépliant du transport urbain de la Ville de Granby, juillet 2026, relu le 29 octobre 2026 | vérifié : source officielle |
| Environ 300 m à pied du terminus à la boutique, par la rue du Centre, la rue Principale puis la rue Court | OSRM à pied, environ 290 m (research/20c Z-10); Valhalla à pied, 301 m (research/22d) | vérifié : deux calculateurs |
| Le stationnement municipal est gratuit au centre-ville; Centre-Court est à environ 100 m | Règlement 1885-1990, article 56 et annexes E et F (research/20c P-1 à P-3); distance calculée (research/20c P-7; research/22d) | vérifié : lecture du règlement officiel; distance calculée |
| Les cases de 4 h de Centre-Court sont limitées du lundi au vendredi, de 8 h à 18 h; ces cases n'ont aucune limite le samedi et le dimanche, et des rangées n'en ont jamais | Plan de Centre-Court (annexe BB), en vigueur depuis le 12 juin 2026 (research/20c P-4, P-5) | vérifié : source officielle (les panneaux font foi) |
| Le stationnement Johnson (18, rue Johnson), de l'autre côté de la rue Principale, a des rangées sans limite de temps | Plan de Johnson (annexe AA, research/20c P-10); les deux calculateurs à pied passent par la rue Principale (research/22d) | vérifié |
| Le Zoo permet d'apporter son lunch, a plusieurs aires de pique-nique et ses propres points de restauration; on peut sortir et revenir en faisant étamper sa main | Foire aux questions du Zoo, en français et en anglais, lue le 29 octobre 2026 | vérifié : source officielle |
| Le Zoo interdit les contenants de verre et l'alcool apporté de l'extérieur | Règlements et foire aux questions du Zoo, lus le 29 octobre 2026 | vérifié : source officielle |
| Le café et les boissons froides, les viennoiseries, les pâtisseries, les sandwichs, les feuilletés, les mini pizzas et les pastillas au poulet, sur place ou à emporter; un endroit où s'installer | Vos publications du 25 août, du 5 septembre et du 20 septembre 2026 (research/20b S-1, S-10, S-12, S-14 à S-16) | vérifié : votre source. Datées sur la page, parce que les produits changent |
| Les ateliers : du vendredi au dimanche, 2 h 30, 37 $ par personne avec le matériel, une boisson et une part de gâteau, au 438-528-7818, places limitées | Votre publication du 22 octobre 2026 (research/20b S-17 à S-19) | vérifié : votre source |
| Les heures de la boutique | Votre fiche Google, relayée le 27 octobre 2026 (research/21) | vérifié; votre confirmation est bienvenue (research/14 H1) |
| La commande à l'avance pour les produits qui ont des plages de cueillette | La règle de commande du site (`/commander/`). La commande en ligne ouvre du 11 au 24 janvier 2027 (research/21 B5); d'ici là, le téléphone | règle du site |

---

## 6. Les liens

### 6.1 Liens entrants (4 pages par langue)

| Page | Phrase ajoutée | Ancre |
|---|---|---|
| `/nous-trouver/` (section « À quelle distance du Zoo de Granby est la boutique? ») | « La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch. » | « Depuis le Zoo de Granby » |
| `/` (section « Où se trouve la Pâtisserie Coco Vanille à Granby? ») | « En visite au Zoo de Granby? La page Depuis le Zoo de Granby donne le trajet, l’autobus et le stationnement. » | « Depuis le Zoo de Granby » |
| `/faq/` (nouvelle section « Y a-t-il une pâtisserie près du Zoo de Granby? ») | « La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch. » | « Depuis le Zoo de Granby » |
| `/patisseries/` (nouvelle question « Avez-vous du salé pour le dîner? ») | « Pour un pique-nique au Zoo de Granby, la page Depuis le Zoo de Granby donne le trajet et les règles du Zoo. » | « Depuis le Zoo de Granby » |

En anglais, les mêmes phrases pointent vers `/en/visit/granby-zoo/`, avec l'ancre « From the Granby Zoo » (research/22d §1.6).

**Ce qui existe déjà et ce qui reste à faire :**
- **Automatique dès la mise en ligne :** le bloc « À consulter aussi » de `/nous-trouver/` affiche la page, puisqu'elle en est l'enfant. Il faut pour cela le nom de page « Depuis le Zoo de Granby » dans `i18n.js`.
- **Pas encore des liens :** le texte du site s'affiche aujourd'hui sans lien. Les liens dans le texte sont prévus après la refonte (docs/17 §4.3).
- **Ce que la méthode demande :** au moins 3 liens entrants. Il faut donc, au choix :
  - transformer en lien chaque « la page X » qui nomme une page du site;
  - ou, à défaut, ajouter la page au pied de page « Découvrir ».

### 6.2 Liens sortants

- `/nous-trouver/` (parent) : le fil d'Ariane et « le tableau des heures de la page Nous trouver ».
- `/commander/` : « la page Commander ».
- `/viennoiseries/` et `/patisseries/` : les mots de la section sur le lunch.
- `/faq/` : les ateliers créatifs. Une future page `/ateliers/` (docs/17 §6) prendrait le relais.

---

## 7. Ce que la page ne dit pas, et pourquoi

| Sujet | Pourquoi | Où il reste |
|---|---|---|
| L'entrée : marches, porte, accès en fauteuil roulant | [[FACT NEEDED: marches, largeur de porte et accès en fauteuil roulant]] (research/14 H5; research/20c A-1) | `/nous-trouver/`, `/accessibilite/` |
| Le nombre de places assises | [[FACT NEEDED: nombre de places assises]] (research/14 N3). La page dit seulement qu'on peut s'installer, comme le dit votre publication | `/nous-trouver/`, `/carte/` |
| Ce que les clients voient à la porte | [[FACT NEEDED: repère visuel près de la boutique, approuvé par le propriétaire]] (research/20c L-2) | `/nous-trouver/` |
| Les modes de paiement, les dollars américains, le service en anglais | [[FACT NEEDED: modes de paiement acceptés au comptoir]] (O5); [[FACT NEEDED: personne qui sert la clientèle en anglais]] (L1) | `/`, `/nous-trouver/` |
| Une offre propre aux visiteurs du Zoo (boîte à emporter, pique-nique) | [[FACT NEEDED: offre pour les visiteurs du Zoo, s'il y en a une (research/14 P16)]]. La page n'en invente aucune | — |
| L'horaire et les tarifs du Zoo; les horaires et les tarifs d'autobus | Ils changent : la page renvoie à zoodegranby.com/horaire et à granby.ca/fr/transport-urbain-granby | — |
| Une page pour un autre lieu (lac Boivin, Marché public, Bromont, Waterloo) | Ce serait une page satellite (§1) | des phrases de `/nous-trouver/` |

---

## 8. La porte de sortie et le suivi

1. **Application.** On applique :
   - la ligne du registre et les noms de page (`pageNames` : « Depuis le Zoo de Granby », « From the Granby Zoo »)
   - le texte (research/22d §1.3)
   - les changements des autres pages (research/22d §1.5)

   Ensuite, trois vérifications doivent passer : le validateur de research/22d, `npm test` (dans `apps/web`) et `node apps/web/scripts/gate.mjs`.
2. **Texte.** La page n'a aucune mention [[FACT NEEDED]] (vérifié le 29 octobre 2026). Sa version anglaise est relue par une personne anglophone.
3. **Liens.** Le jour de la mise en ligne, au moins trois liens dans le texte d'autres pages publiées pointent vers elle (§6). D'ici là, le contrôle des liens donne un avertissement, pas un échec.
4. **La semaine de la mise en ligne.** On relit la foire aux questions, les règlements et la page « Horaire et directions » du Zoo.
5. **Avant le samedi 1er mai 2027.** La relecture du printemps (garde-fou 3 du §1).
6. **Suivi :**
   - L5, L8 et L8-quebec dans la mesure du lundi ([docs/02-rythme-hebdo.md](../02-rythme-hebdo.md))
   - les requêtes qui contiennent « zoo » dans Search Console
   - les requêtes d'ancrage (*grounding queries*) qui contiennent « zoo » dans le rapport AI Performance de Bing

   Aucune position n'est promise.

---

## Sources

Toutes vues le 29 octobre 2026.

- Google Search Central, « Règles relatives au spam pour la recherche Web de Google » (pages satellites; dernière mise à jour le 2026/08/31) : https://developers.google.com/search/docs/essentials/spam-policies?hl=fr
- Google Search Central, « Spam policies for Google web search » (doorway abuse; last updated 2026-08-28) : https://developers.google.com/search/docs/essentials/spam-policies
- Google Search Central, données structurées LocalBusiness (2026-09-08) : https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Search Central, règles générales des données structurées (2026-07-10) : https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- schema.org, type Zoo : https://schema.org/Zoo
- Zoo de Granby, « Horaire et directions » : https://www.zoodegranby.com/horaire
- Zoo de Granby, « Schedule and directions » : https://www.zoodegranby.com/en/schedule
- Zoo de Granby, foire aux questions : https://www.zoodegranby.com/faq · en anglais : https://www.zoodegranby.com/en/faq
- Zoo de Granby, règlements : https://www.zoodegranby.com/reglements
- Ville de Granby, Transport urbain Granby : https://granby.ca/fr/transport-urbain-granby
- Ville de Granby, dépliant du transport urbain (juillet 2026) : https://www.granby.ca/sites/default/files/2026-07/depliant_transport-urbain-26x26_juillet2026-hr.pdf
- Ville de Granby, codification du règlement 1885-1990 (révisée le 18 septembre 2026), par research/20c : https://www.granby.ca/sites/default/files/2026-09/codification-circulation-1885-1990_maj18sept2026.pdf
- Calculs d'itinéraire (données © les contributeurs d'OpenStreetMap, licence ODbL) : OSRM (router.project-osrm.org et routing.openstreetmap.de) et Valhalla (valhalla1.openstreetmap.de); détails et heures dans research/20c §10 et research/22d §7
- Vos publications Instagram (@coco_vanillegranby) du 25 août, du 5 septembre, du 20 septembre et du 22 octobre 2026, par research/20b : https://www.instagram.com/coco_vanillegranby/
- Dans le dépôt : research/20b, 20c, 21, 22d, 04, 05, 00 §5.1, 14; docs/08, 17, 19; `apps/web/src/seed/content.js`, `apps/web/src/lib/routes.js`, `apps/web/src/components/templates/index.js`, `apps/web/test/unit/content.test.js`
