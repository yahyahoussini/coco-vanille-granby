# Recherche — Pâtisserie Coco Vanille : la demande, les questions des clients, les concurrents

**Couche 7 de la méthode : savoir ce que les gens cherchent, qui occupe la place aujourd'hui, et ce qu'on ne sait pas encore. Ce document résume la recherche déjà faite (research/02 à research/05, research/18); il ne la refait pas.**

| | |
|---|---|
| Mis à jour | 29 octobre 2026 |
| Préparé par | Yahya (BrandHub.ma), l'Agence |
| Résume | research/04 (mots-clés, questions, vocabulaire), research/05 (relevé des résultats et notes), research/03 (concurrents), research/02 (clients et prix), research/01 (faits de la boutique), research/06 et research/18 (faits des plateformes vérifiés) |
| Données | `data/keywords.csv` (220 mots-clés), `data/prompts.csv` et `scoreboard/prompts.csv` (33 requêtes notées + 20 candidates; les notes à jour du 29 octobre 2026 sont dans `scoreboard/prompts.csv`), `data/competitors.csv` (45 lignes), `data/price-benchmarks.csv` (35 prix publiés), `data/serp-baseline-2026-W43.csv`, `data/serp-baseline-2026-W44.csv`, `data/directories.csv` |
| Voir aussi | [docs/17-architecture.md](17-architecture.md) (quelle page répond à quoi) · [docs/14-calendrier-contenu.md](14-calendrier-contenu.md) (quand publier) · [docs/08-brief-page.md](08-brief-page.md) (le brief d'une page) · [docs/19-marche-et-concurrence.md](19-marche-et-concurrence.md) (la carte de bataille) · [docs/06-annuaires-listicles.md](06-annuaires-listicles.md) (répertoires et palmarès) |

**Règle de lecture :** les chiffres des concurrents sont des faits sur les concurrents, avec leur page et la date où on les a vus. Ils ne deviennent jamais des chiffres de la Pâtisserie Coco Vanille. Les étiquettes de la recherche sont gardées : *vérifié* (deux sources ou une source officielle), *non vérifié* (une seule source, ou un résumé de recherche), *(est.)* (estimation). Toutes les notes sur 20 restent provisoires jusqu'à la mesure depuis Granby.

---

## En bref

1. **On connaît la forme de la demande, pas son volume.** Les 220 mots-clés ont une priorité estimée (élevée, moyenne, faible), pas un nombre de recherches : aucun outil de volume n'a été utilisé (research/04 §0; README). Les volumes viendront de Keyword Planner et de Search Console après la mise en ligne.
2. **Le web local est presque vide.** Dans 10 des 17 requêtes relevées le 25 octobre 2026, le moteur de réponse n'a trouvé aucune source de Granby : pas de prix local, pas de pâtisserie locale, pas de bûche (research/05 §0.1). Le 29 octobre 2026, même constat dans 12 des 26 recherches hors marque : commander en ligne, un gâteau pour demain, la livraison, des boîtes pour le bureau, une boulangerie près du Zoo (research/05 W44.0). La première réponse locale, datée et sourcée, est à prendre.
3. **La boutique n'apparaît que par des répertoires.** Le 25 octobre, elle est sortie dans 2 relevés sur 17, chaque fois par RestoMontreal et sous la graphie « Cocovanille » (research/05 §0.2); le 29 octobre, dans 12 des 26 recherches hors marque, toujours par RestoMontreal ou Three Best Rated (research/05 W44.0). Aucun site à elle n'est encore en ligne.
4. **La boutique occupe déjà la place du côté « boulangerie »** (2e du palmarès de Three Best Rated, derrière Pain-Pain, fermée depuis le 16 juin 2026), mais elle est **absente du palmarès « gâteaux et pâtisseries »** (research/03 §0.3, §0.4).
5. **Les gâteaux sur commande en ligne sont déjà occupés à Granby** par Cake Design Granby et Avec un Grand A, avec panier et prix publiés (research/03 §0.1). D'où la décision : défendre « pâtisserie-boulangerie Granby », entrer dans les gâteaux par « gâteau pour demain » (research/15 D19).
6. **Les prix sont un trou dans le marché :** un seul concurrent publie un prix par portion sur son site (Cake Design, 5 $ la portion, minimum 16; cakegranby.ca, vu le 25 octobre 2026). Personne ne publie un tableau de portions selon le nombre d'invités (research/03 §6).
7. **Les heures de la boutique se contredisent en ligne.** Six horaires différents circulaient (research/01 §3). L'horaire de votre fiche Google, relayé le 27 octobre 2026 (du mercredi au dimanche), devient la référence; ce sont maintenant les répertoires qui affichent « jeudi au samedi » qu'il faut corriger. Plus grave : le 29 octobre 2026, la réponse à « Coco Vanille Granby heures » donnait les heures et le téléphone de Pain-Pain, le (450) 770-7246 (déduit), en citant Three Best Rated (research/05 W44.5).
8. **Ce qu'on ne sait pas encore** pèse plus que ce qu'on sait : le relevé depuis un cellulaire à Granby, les réponses des moteurs d'IA, les volumes, et vos propres réponses (prix, délais, produits). La liste est au §10.

---

## 1. Comment cette recherche a été faite, et ses limites

- **Des résumés de recherche, pas des pages ouvertes.** Les recherches de research/01 à research/18 ont été faites le 25 octobre 2026 avec un outil de recherche qui résume les résultats, et la mise à jour de research/05 le 29 octobre 2026; les pages elles-mêmes n'ont pas été ouvertes (README, « Research method and limits »).
- **Depuis les États-Unis.** Ce n'est pas la page de résultats que voit une personne à Granby : ni carte locale, ni encadré de réponse, ni « Autres questions posées », ni aperçu IA n'étaient visibles (research/05, mise en garde).
- **Les 33 requêtes** ont été relevées une fois : 17 le 25 octobre 2026 (I1 à I10, C1 à C7), les 16 autres le 29 octobre 2026 (C8 à C10, L1 à L10, B1 à B3), avec 13 candidates (X1 à X13). Un seul passage par requête : ce n'est pas encore la mesure de départ (research/05 W44.1).
- **Aucun moteur d'IA** (ChatGPT, Perplexity, Gemini, Claude, Copilot) n'a été interrogé.
- **Aucun volume de recherche** : l'Agence n'utilise pas d'outil payant de volumes. La demande se lit dans les suggestions de Google et de Bing (relevées le 29 octobre 2026, [data/autocomplete-local-2026-10-29.json](../data/autocomplete-local-2026-10-29.json)), dans la mesure du lundi et, après la mise en ligne, dans Search Console.
- **La banque de 88 questions** a été écrite à partir de la catégorie; ce n'est pas une récolte des « Autres questions posées » de Google.
- **Aucune position n'est promise.** La recherche dit où sont les ouvertures; la mesure du lundi dira ce qui bouge ([docs/02-rythme-hebdo.md](02-rythme-hebdo.md)).

---

## 2. La demande (des estimations, pas des volumes)

### 2.1 La règle des priorités (research/04 §1)

| Priorité | Ce que ça veut dire | Exemples |
|---|---|---|
| Élevée | terme principal de la catégorie ou de la carte locale pour une ville de 72 078 habitants (décret de population 2026, Gazette officielle du 24 décembre 2025, vérifié), où le français est la langue maternelle de 91,8 % des gens (Statistique Canada, 2021, vérifié); intention d'achat claire | pâtisserie granby, boulangerie granby, pâtisserie près de moi, gâteau personnalisé granby, gâteau de fête granby, bûche de noël granby (en saison) |
| Moyenne | produit ou occasion avec au moins une page concurrente, pointe saisonnière, visiteurs du Zoo en anglais, ou question posée partout au Québec | gâteau pour demain, commander en ligne, chocolatine, prix par portion, quelle grosseur de gâteau |
| Faible | longue traîne, niche alimentaire, terme espagnol, produit sans preuve | smash cake, macarons, torta de quinceañera |

Répartition dans `data/keywords.csv` (recomptée le 29 octobre 2026) : 8 élevées, 55 moyennes, 157 faibles; 148 en français, 40 en anglais, 32 en espagnol. 98 lignes ont une adresse web : elle prouve qu'une offre existe (un concurrent, un répertoire), pas qu'il y a de la demande.

### 2.2 Les 8 mots-clés de priorité élevée, et la page qui les porte

| Mot-clé | Page qui le porte ([docs/17-architecture.md](17-architecture.md)) |
|---|---|
| pâtisserie granby | accueil `/` |
| meilleure pâtisserie granby | accueil, fiche Google et palmarès (le site ne se dit jamais « la meilleure », research/07 S12); comparatif honnête prévu |
| boulangerie granby | `/pains-baguettes/` (et l'accueil) |
| pâtisserie près de moi | fiche Google + `/nous-trouver/` (on n'écrit jamais « près de moi » dans le texte, research/04 §4) |
| boulangerie près de moi | fiche Google + `/pains-baguettes/` |
| gâteau personnalisé granby | `/gateaux-personnalises-granby/` (page conditionnelle) |
| gâteau de fête granby | `/gateaux-personnalises-granby/` selon research/04; aujourd'hui aussi le titre de `/gateaux/` : une décision à prendre au lancement du pilier ([docs/17-architecture.md](17-architecture.md) §3.3) |
| bûche de noël granby | `/buches-de-noel/` (en saison, si les bûches sont confirmées) |

### 2.3 Ce qui pèse sur la demande

- **Les saisons :** bûches en novembre et décembre, Saint-Valentin, Pâques (le dimanche 28 mars 2027 : tôt dans l'année, en plein temps des sucres), fête des Mères, été des visiteurs, Action de grâce, puis les Fêtes 2027 : le détail est dans [docs/14-calendrier-contenu.md](14-calendrier-contenu.md). On compare toujours un mois au même mois de l'année d'avant.
- **Les langues :** le français d'abord (91,8 % de langue maternelle, 2021). L'anglais sert surtout les visiteurs (le Zoo de Granby, le Festival de la chanson, les gens de Montréal); environ 2,1 % de langue maternelle anglaise à Granby (calculé à partir d'un agrégateur, non vérifié). L'espagnol est une communauté réelle mais petite : 965 personnes de langue maternelle espagnole dans l'agglomération de Granby en 2011, soit 1,3 % (Statistique Canada, vérifié); 535 personnes nées en Colombie en 2021 (presse, non vérifié) (research/01 §9.3, §9.4).
- **Le nom prête à confusion.** « Coco Vanille » est aussi un parfum (Mancera), une boulangerie fermée à La Réunion, et choco.vanille (Le Marmiton) vend des gâteaux personnalisés à Granby même. Chaque phrase qui présente la boutique dit « Pâtisserie Coco Vanille » et « Granby » (research/01 §8; research/04 §0.7).
- **« Granby » existe aussi aux États-Unis.** Des pages des Granby américains sont sorties dans 4 relevés sur 17 le 25 octobre, puis dans 13 recherches sur 30 le 29 octobre (aucun lien québécois sur 17 pour « order custom cake online Granby ») : en anglais et en espagnol, on écrit toujours « Granby, Québec » (research/05 §0.7, W44.0).
- **Les moteurs, au Canada** (research/06, vérifié le 25 octobre 2026) : les aperçus IA de Google existent au Canada en anglais depuis le 28 octobre 2024; en français au Canada, aucune source trouvée; le mode IA de Google existe en français depuis le 14 octobre 2025. Bing fait environ 1 recherche sur 10 au Canada (StatCounter, mai à septembre 2026, vérifié en partie). iOS, le système de l'iPhone, fait 64,87 % de la navigation sur téléphone au Canada (StatCounter, septembre 2026, vérifié) : Plans d'Apple compte. Les résultats enrichis « FAQ » ne s'affichent plus dans Google depuis le 7 mai 2026 (research/18 n° 1, vérifié) : la FAQ reste utile pour les réponses, pas pour un affichage spécial.

---

## 3. Ce que montrent les pages de résultats (relevés indirects des 25 et 29 octobre 2026)

« Relevée » = la requête a été lancée telle quelle (depuis les États-Unis), le 25 ou le 29 octobre 2026 (research/05 §2, W44.2). Les notes sont celles de la mise à jour du 29 octobre (research/05 W44.6), provisoires jusqu'à la mesure depuis Granby. Les éléments de la page de résultats (carte locale, encadré, « Autres questions posées », aperçu IA) n'étaient pas visibles avec cette méthode : le relevé depuis Granby les remplira (research/05 §9).

| Requête (code, note) | Relevée? | Qui sort en premier | Forme qui gagne | La boutique est-elle là? | Notre page |
|---|---|---|---|---|---|
| L3 gâteau pour demain Granby (19) | oui, le 29 octobre | quoifaire.com (sorties), puis des recettes et des pages américaines; aucune page « pour demain » | aucune page dédiée repérée | oui, nommée en premier (« appelez Cocovanille », fiche RestoMontreal au 14e lien), avec la plainte de janvier 2026; ailleurs, « commandez par téléphone, prêt le lendemain » (Three Best Rated, 2025, non vérifié) | `/gateau-pour-demain/` |
| C1 meilleure pâtisserie à Granby (18) | oui | restomontreal.ca (page de la boutique en 1er), threebestrated.ca | répertoire | oui, nommée en premier, sous « Cocovanille » | accueil + fiche Google + palmarès |
| C2 meilleur gâteau de fête à Granby (18) | oui | tastet.ca (une liste de Montréal) | palmarès | non : « pas de palmarès local » | pilier + comparatif |
| C8 best bakery in Granby Quebec (17) | oui, le 29 octobre | threebestrated.ca en 1er lien (le n° 1, Pain-Pain, est fermé; la boutique est 2e, avec d'anciennes heures) | palmarès | oui (2e chez Three Best Rated) | `/en/` + palmarès |
| L1 pâtisserie près de moi (17) | en partie, le 29 octobre (« pâtisserie près de moi Granby », sans localisation : pas une vraie mesure « près de moi ») | restomontreal.ca (Mélisse 1re, la boutique 2e); la carte locale reste à mesurer depuis Granby | carte locale | oui, 2e dans la liste | fiche Google + `/nous-trouver/` |
| L4 pâtisserie ouverte dimanche Granby (18) | oui, le 29 octobre | restomontreal.ca (9 liens sur 18) | heures des répertoires | oui, parmi les 4 pâtisseries ouvertes le dimanche, mais avec 9 h au lieu de 9 h 30 | `/nous-trouver/` + fiche Google |
| I3 quelle grosseur de gâteau pour 20 personnes (17) | oui | sites de contenu de masse, pages parasites, forums | tableau (format → portions) | non | `/calculateur-portions-gateau/` |
| I1 combien coûte un gâteau de fête personnalisé à Granby (16) | oui | Three Best Rated, PDF de prix en euros (France), RestoMontreal (la boutique en 7e) | répertoire; la réponse dit ne trouver aucun tarif à Granby | oui (7e, par RestoMontreal) | `/prix/` |
| I2 combien de jours d'avance commander un gâteau personnalisé (16) | oui | des pages de France (formulaires, mariages) | une réponse chiffrée (15, 21 ou 30 jours, en France) | non | pilier, section des délais |
| L9 order custom cake online Granby (16) | oui, le 29 octobre | des pages des Granby américains (0 lien québécois sur 17); aucune page de commande en anglais repérée chez les concurrents de Granby (déduit) | — | non | `/en/custom-cakes-granby/`, `/en/order/` |
| L2 commander un gâteau de fête en ligne Granby (15) | oui, le 29 octobre | des pages de France, de Dublin et de Montréal; la réponse dit ne trouver aucune plateforme de commande de gâteaux à Granby. Les paniers de Cake Design, d'Avec un Grand A et de Maître Glacier (research/03) ne sortent pas | paniers avec prix visibles | oui, nommée (17e lien), avec la plainte de janvier 2026 | `/commander/` |
| C4 bûche de Noël Granby (19) | oui | l'Office québécois de la langue française (définition), presse européenne | définition | non : rien de propre à Granby | `/buches-de-noel/` |
| B2 Coco Vanille Granby heures (19) | oui, le 29 octobre | restomontreal.ca (la fiche de la boutique), threebestrated.ca | répertoire | oui, mais avec les heures et le téléphone de Pain-Pain, le (450) 770-7246 (déduit), et « peut-être temporairement fermée » | fiche Google + `/nous-trouver/` |

Sur les heures : la réponse d'IA du relevé C1 disait « ouverte du mercredi au dimanche ». Research/05 la jugeait fausse, d'après les répertoires; l'horaire de votre fiche Google relayé le 27 octobre 2026 (mercredi au samedi de 8 h 30 à 17 h 30, dimanche de 9 h 30 à 17 h) lui donne raison sur les jours. Les copies à corriger sont celles qui affichent jeudi au samedi (Three Best Rated, Allbiz, Wanderlog, find-open) ou mercredi au samedi sans le dimanche (canada.chamberofcommerce.com) (research/01 §3). Le vrai fait faux est celui du 29 octobre : la réponse B2 a pris les heures et le téléphone de Pain-Pain (déduit). C'est la première correction à faire ([docs/19](19-marche-et-concurrence.md), coup n° 1).

Les notes sur 20 montrent un web local faible, pas une victoire facile : un domaine neuf, sans liens, prend des mois (research/05 §5).

---

## 4. Les questions des clients (la banque de départ)

Research/04 §5 propose 88 questions (50 en français, 22 en anglais, 16 en espagnol), écrites à partir de la catégorie, en attendant la récolte depuis Granby. Chaque question a une page cible et une forme de réponse : **P** = un paragraphe de 40 à 60 mots qui commence par la réponse; **L** = une liste; **T** = un tableau.

**Celles qui comptent le plus, et où le site construit y répond :**

| Question | Code | Forme | Où la réponse est construite |
|---|---|---|---|
| C'est-tu possible d'avoir un gâteau pour demain? | F09 (L3) | P | `/gateau-pour-demain/`, accueil, `/commander/`, `/gateaux/` (attend l'heure limite) |
| Combien coûte un gâteau de fête personnalisé à Granby? | F01 (I1) | T | `/prix/`, `/faq/`, pilier (attend la grille de prix) |
| Quelle grosseur de gâteau pour 20 personnes? | F03 (I3) | T | `/calculateur-portions-gateau/`, `/faq/` (attend les portions) |
| Combien de jours d'avance faut-il commander un gâteau personnalisé? | F02 (I2) | P | pilier, `/faq/` (attend les délais) |
| Peut-on commander un gâteau en ligne à Granby? | F10 (L2) | P | `/commander/`, accueil |
| Quelles sont les heures d'ouverture de la Pâtisserie Coco Vanille? | F25 (B2) | T | `/nous-trouver/` (réponse complète) |
| La pâtisserie est-elle ouverte le dimanche? | F24 (L4) | T | `/nous-trouver/` (réponse complète : oui, de 9 h 30 à 17 h) |
| Où se stationner près de la Pâtisserie Coco Vanille? | F26 | L | `/nous-trouver/` (attend H5) |
| Où acheter une bûche de Noël à Granby? | F12 (C4) | P | `/buches-de-noel/` (attend P3) |
| Y a-t-il une pâtisserie sans gluten à Granby? | F16 (C6) | P | `/allergenes/` : la réponse dit qu'aucun produit n'est présenté comme « sans gluten » (allégation encadrée) |
| Où trouver des chocolatines fraîches à Granby? | F20 (L6) | P | `/viennoiseries/` (attend : chocolatines offertes ou non) |
| Que sait-on de la Pâtisserie Coco Vanille à Granby? | F49 (B3) | P | `/a-propos/` (réponse complète : registre des entreprises et presse) |
| How much does a custom birthday cake cost in Quebec? | E01 (I8) | T | `/en/prices/`, `/en/faq/` |
| Is there a bakery near the Granby Zoo? | E04 (L8) | P | `/en/faq/`, `/en/visit/` (attend la distance) |
| Can I order a custom cake online in Granby? | E05 (L9) | P | `/en/order/`, `/en/custom-cakes-granby/` |
| How many servings are in an 8-inch round cake? | E06 | T | `/en/cake-serving-calculator/` |
| Do you accept US or foreign credit cards? | E16 | P | `/en/` (attend O5) |
| What is Pâtisserie Coco Vanille in Granby known for? | E20 (B3) | P | `/en/about/` |

**Le compte** (29 octobre 2026, [docs/17-architecture.md](17-architecture.md) §5) : sur les 72 questions en français et en anglais, 46 ont leur réponse dans une page construite, 14 attendent une page prévue (transport, glossaire, comparatif, fêtes, textes anglais des bûches), 12 attendent un produit à confirmer (mariages, galette des rois, desserts québécois, boîtes pour le bureau). Les 16 questions en espagnol attendent l'ouverture du volet espagnol.

---

## 5. Les mots exacts des clients

[[FACT NEEDED: 10 vraies formulations de clients, en français et en anglais, notées telles quelles]]

Aucune formulation réelle n'a encore été recueillie. La question « C'est-tu possible d'avoir un gâteau pour demain? » vient du plan du propriétaire (plan-v1 §7), pas d'un client enregistré. Où les recueillir, sans nom ni téléphone :
- **Coco Studio › Plus › « Noter une question de client »** : une ligne, la question telle que le client l'a posée (comptoir, téléphone, Instagram, courriel, avis). L'Agence en fait une réponse sur le site.
- **Les conversations « Écrivez-nous »** (le clavardage du site), dans Studio › Messages, une fois le site en ligne.
- **Les messages Facebook et Instagram**, et les avis Google (leurs mots, jamais leurs noms).

---

## 6. Les règles de vocabulaire

Tirées de research/04 §3 et research/07; elles s'appliquent au site, à Coco Studio, aux courriels, aux textos et à la fiche Google.

| Sujet | On écrit | On évite | Pourquoi |
|---|---|---|---|
| Gâteau d'anniversaire | « gâteau de fête » dans le H1 et le titre; « gâteau d'anniversaire » au moins une fois dans le texte et la description | — | les deux formes sont employées au Québec; Search Console tranchera après 8 semaines |
| Gâteau sur commande | « gâteau personnalisé », « sur mesure » dans le texte | « design cake » dans un titre français | mots des concurrents et des épiceries de Granby |
| Pain au chocolat | « chocolatine », « pain au chocolat » une seule fois | — | mot du Québec (Larousse, vérifié) |
| Viennoiseries | « Croissants et viennoiseries » dans le H1 (on y ajoute « chocolatines » si vous en faites); « Viennoiseries » dans le menu | le mot du métier seul dans le H1 | « croissant granby » a une priorité moyenne, « viennoiseries granby » une priorité faible (estimations, `data/keywords.csv`) |
| Cueillette | « cueillette » partout, pour l'instant | mélanger « cueillette » et « ramassage » | un seul mot partout; votre choix final : [[FACT NEEDED: cueillette ou ramassage (research/14 L3)]] |
| Bûche | « bûche de Noël » (avec accents dans le texte; adresse sans accents) | une année dans l'adresse | page permanente |
| Tailles | « 8 po » avec les portions, et les centimètres | une taille sans portions | les gens comptent leurs invités |
| Prix | format « 00,00 $ », « taxes en sus, s'il y a lieu » | « prix sur demande »; un prix « à partir de » que personne ne peut acheter | Loi sur la protection du consommateur (research/07 S11, C-9) |
| Heures | « 14 h » | « 2pm » en français | format d'ici (exemple de format seulement) |
| Fêtes | Saint-Valentin · Pâques · Action de grâce · temps des Fêtes · fête nationale (avec un f minuscule) · fête-surprise | majuscules au hasard | Office québécois de la langue française (en partie vérifié) |
| Allergies | « Contient : … »; la liste des allergènes prioritaires | « sans gluten », « sans noix », « végane », « 100 % sans allergènes » | allégations encadrées (Agence canadienne d'inspection des aliments, research/07 A-6, A-7) |
| Comparaison | « Comment choisir une pâtisserie à Granby » | « la meilleure pâtisserie de Granby » | aucun superlatif sans distinction datée (research/07 S12) |
| Marque | « Pâtisserie Coco Vanille » + « Granby » dans chaque phrase qui présente la boutique; « Cocovanille » seulement comme autre graphie dans les données structurées | un pronom à la place du nom | une seule entité, sans confusion |
| Anglais | orthographe canadienne (flavour, colour, centre); « Granby, Québec » dans les titres; on garde « chocolatine », « bûche » avec une explication | une traduction automatique | les visiteurs; les Granby des États-Unis |
| Espagnol | « pasteles y tortas » dans les titres | « torta » seule (au Mexique, c'est un sandwich) | research/04 §0.8 (en partie vérifié) |
| À ne pas viser | gâteaux glacés (Maître Glacier), gâteaux crus véganes (Les Crudélices), beignes (Tim Hortons) | une page sur ces sujets | ce sont les marchés d'autres commerces (research/04 §0.9) |

---

## 7. Les concurrents (research/03, vu le 25 octobre 2026)

### 7.1 Les cinq qui comptent

Faits de concurrents, avec leur page; résumés de recherche, pages non ouvertes. « Score » de Three Best Rated = leur note éditoriale.

| Concurrent | Site | Ce qu'il occupe aujourd'hui | Prix publiés (page) | Avis (source, date) | Point faible visible | Notre réponse (une meilleure page, une meilleure fiche, une preuve) |
|---|---|---|---|---|---|---|
| Cake Design Granby, 194, rue Denison Est | cakegranby.ca (et cakegranby.com) | gâteaux sur mesure en ligne : panier avec date et heure de cueillette; 1er du palmarès « gâteaux » de Three Best Rated (score de 118 sur 120) | 5 $ la portion, minimum 16, pour un gâteau design (cakegranby.ca/products/gateau-sur-mesure); à partir de 95 $ pour 1 étage de 7 po (cakegranby.com/saveurs_tarifs.php; page exacte non vérifiée); petits gâteaux (cupcakes) à partir de 35 $ la douzaine (selon Three Best Rated) | note Google non relevée | page sur mesure affichée « épuisé »; deux domaines qui se partagent l'autorité | pilier gâteaux personnalisés + tableau de prix daté avec prix par portion + calculateur + vraies photos |
| Avec un Grand A, 581, rue Breton | avecungranda.com | commande en ligne avec prix; délai de 48 h en jours ouvrables; fiche et article de Tourisme Granby région; 3e du palmarès « gâteaux » | Framboisier de 40 $ à 60 $ (6 à 8 et 10 à 12 portions; correspondance prix-taille déduite); Boston de 32 $ à 42 $; Choco-noisette de 45 $ à 65 $ (avecungranda.com, pages produits) | RestoMontreal 5,0 sur 3 avis | peu d'avis; fermé le dimanche et le lundi | une heure limite pour demain, écrite en chiffres; fiche Tourisme Granby région |
| Rose Gâteaux, 160, rue Robinson Sud (atelier) | rosegateaux.com | la seule spécialiste du mariage repérée à Granby (mariages, anniversaires, baptêmes, showers de bébé); dégustations; zone Granby, Bromont, Saint-Hyacinthe; 2e du palmarès « gâteaux » (117 sur 120) | gâteau « nu » aux roses 57 $ taxes incluses (12 portions); cupcake géant 62 $ (14 portions) (rosegateaux.com/shower-de-bebe.html) | Three Best Rated 4,9; environ 2 478 abonnés Facebook | ouvert seulement le jeudi de 14 h à 18 h, sinon sur rendez-vous | pas de combat sur les mariages (gelés tant que la capacité n'est pas confirmée); prendre les anniversaires et le lendemain |
| Mont Rose Pâtisserie & Café, 190, rue Principale | pas de site repéré pour Granby | le rival du comptoir : 3 boutiques (Granby, Saint-Hyacinthe, Beloeil), longues heures, Uber Eats | non relevés | Google 4,6 (70+ avis) et RestoMontreal 4,7 (31), instantané d'octobre 2026 | heures contradictoires selon les instantanés | fiche Google complète, heures justes partout, invitation à laisser un avis à chaque client |
| Délices Sucrés Granby | delicessucresgranby.my.canva.site | promet les commandes de dernière minute, l'intention de L3 | aucun prix | non relevé | site d'une page, courriel gratuit, aucun prix (entreprise à domicile? non vérifié) | `/gateau-pour-demain/` avec heure limite, formats et prix, seulement si c'est vrai |

**Le plancher de prix :** IGA (Marché Gazaille, 310, rue Denison, gâteaux personnalisés en service), Maître Glacier (siège social à Granby, gâteaux glacés d'environ 35 $ à 55 $), Maxi, Walmart. Un Costco est en construction à Saint-Alphonse-de-Granby : ouverture visée en 2027, possiblement en 2028 (Le Nouvelliste, 2 octobre 2026, via research/03).

**Dans la région :** Si Petit Soit-il à Bromont (gâteaux sur mesure; Google environ 4,9 sur 90+ avis via RestoMontreal), Extra Cakes à Sherbrooke (mariages, livraison et montage), et Mlles Gâteaux de Montréal, que les moteurs proposent pour Bromont et Sherbrooke faute de choix local (research/03 §3).

### 7.2 Les prix publiés à Granby (des repères, pas nos prix)

Calculés à partir des prix publiés (research/02 §0.4; research/03 §2b; `data/price-benchmarks.csv`), vus le 25 octobre 2026; statut des taxes surtout inconnu.

| Option | Prix par portion (calculé) | Exemple publié |
|---|---|---|
| Épicerie (plancher) | de 2,25 $ à 3,37 $ | IGA : Le Rêve, 10 à 12 portions, 26,99 $; L'Indécis, 8 à 10 portions, 26,99 $ (traiteur.iga.net) |
| Gâteau glacé | de 3,41 $ à 4,90 $ | Maître Glacier : Napolitain, 15 à 16 portions, 54,50 $; Choco-Fraise, 10 à 12 portions, 49 $ (granby.maitreglacier.com) |
| Gâteau d'occasion ou personnalisé (3 commerces) | de 4,43 $ à 6,67 $ | Cake Design 5 $ la portion; Rose Gâteaux 57 $ pour 12 portions; Avec un Grand A, Framboisier |
| Gâteau cru végane | de 7,20 $ à 12,00 $ | Les Crudélices : 36 $ (3 à 5 portions), 72 $ (6 à 8 portions) (lescrudelices.ca) |

Une portion de pâtisserie coûte donc de 1,3 à 3,0 fois une portion d'épicerie (calculé, research/02 §0.4). Vos prix : [[FACT NEEDED: grille de prix par format, avec les portions (research/14 P1, P7)]]. Ces repères serviront à l'étude de prix du 1er trimestre 2027, revérifiés le jour même de l'étude (research/11 §2).

### 7.3 Les palmarès et répertoires qui décident aujourd'hui

| Palmarès ou répertoire | Qui y est | La boutique? | Ce qu'on fait (preuves seulement; détail dans [docs/06-annuaires-listicles.md](06-annuaires-listicles.md)) |
|---|---|---|---|
| Three Best Rated, « 3 Best Bakeries in Granby » (FR et EN) | Pain-Pain (fermée), Pâtisserie Coco Vanille 2e, Mélisse (signalée « peut-être fermée ») | oui, 2e | envoyer les articles sur la fermeture et demander une mise à jour; jamais demander le retrait d'un concurrent ouvert |
| Three Best Rated, « gâteaux » / « 3 Meilleurs Pâtisseries à Granby » | Cake Design, Rose Gâteaux, Avec un Grand A | non | demander l'inscription, avec photos, nombre d'avis et page de prix (une fois en ligne) |
| RestoMontreal (boulangeries et pâtisseries de Granby) | la boutique, Mélisse, Pain-Pain, Café ORÉE, Mont Rose, La Mie Bretonne… | oui, avec le signal « peut-être fermée » | corriger le statut à la source (la fiche Google), mettre à jour la page |
| RestoMontreal, « 10 Best Eastern Townships Bakeries (2026) » | Canaël, Pâtisserie Syrienne, Au Coeur du Pain… | oui, plus bas | plus d'avis Google, demandés honnêtement |
| Yelp, boulangeries de Granby (instantané d'octobre 2026) | Pain-Pain (fermée) en tête; la moitié hors de Granby | pas dans l'extrait | réclamer la fiche Yelp; ne jamais solliciter d'avis Yelp |
| Tripadvisor | fiche d27188801 | oui, notes contradictoires | réclamer la fiche |
| Tourisme Granby région | Avec un Grand A, Pâtisserie Langevin, La Mie Bretonne… | non repérée | demander une fiche; proposer une histoire pour le prochain article gourmand |
| Tastet, liste de Granby (avec Tourisme Granby région) | aucune pâtisserie | non | proposer une histoire (étude de prix, chef) une fois le site en ligne |

### 7.4 Ce qu'on fait, et ce qu'on ne fait jamais

On gagne par une meilleure page, une meilleure fiche et de vraies preuves : tableau de prix daté, calculateur, page « gâteau pour demain », pages en anglais (aucune page de commande en anglais n'a été repérée chez les concurrents de Granby; déduit des résultats, non vérifié), fiche Google complète, palmarès corrigés (research/03 §6). On ne dénigre personne; un comparatif nomme des faits publiés et datés, passe par l'avocat, et ne met aucune marque de concurrent dans nos adresses ni nos titres (research/03 §6; plan-v1 §10).

---

## 8. Trois règles que ce secteur enfreint souvent (et que nous refusons)

1. **Les avis manipulés.** Demander des avis seulement aux clients contents, offrir un rabais ou un cadeau contre un avis, fixer des quotas d'avis aux employés, demander de nommer un employé ou un produit. La page officielle de Google Maps interdit de demander aux employés d'obtenir un certain nombre d'avis; deux clauses (quotas et contenu précis) auraient été ajoutées le 17 avril 2026 selon des sources secondaires; les avis incités sont retirés et le tri des clients est interdit (research/18 n° 4a et 4b, vérifiés). Notre règle : la même invitation à tous, sans cadeau (décisions M2, M3, M23).
2. **Les pages « villes » sans réalité et les fausses adresses.** Des pages « pâtisserie Bromont », « gâteau Waterloo » sans boutique ni livraison sont des pages satellites d'entrée, que Google pénalise; une fiche Google à une adresse sans personnel est une fausse adresse (plan-v1 §10; politique anti-pollupostage de Google sur les pages satellites).
3. **Les mots-clés dans le nom de la fiche Google.** Ajouter « Gâteaux Granby » au nom, ou un deuxième nom dans une autre langue, enfreint les consignes de Google pour les fiches (plan-v1 §10, §13). Le nom est celui de l'enseigne : [[FACT NEEDED: photo de l'enseigne (research/14 S3)]].

Deux règles de loi vont avec : aucune mention « sans gluten » sans procédé contrôlé (Agence canadienne d'inspection des aliments, research/07 A-6), et toute publication payée ou commanditée est annoncée comme telle (règles de divulgation des Normes canadiennes de la publicité, texte non relu; plan-v1 §10; research/11 §2).

---

## 9. Ce qui décide du gagnant, selon le type de requête

| Type | Exemples | Ce qui décide surtout | Ce qu'on y met |
|---|---|---|---|
| Locale (près de moi, heures, ouvert le dimanche) | L1, L4, B2 | la carte locale : la pertinence, la distance et la notoriété (fiche complète, avis, coordonnées identiques partout) | fiche Google, `/nous-trouver/`, répertoires corrigés |
| Commerciale « meilleur(e) » | C1, C2, C8 | les palmarès et les répertoires, le système d'évaluation des avis, l'autorité des liens | présence sur les palmarès, avis honnêtes, comparatif honnête |
| Transactionnelle (commander, pour demain) | L2, L3, L9 | la page qui répond clairement (prix, délai, cueillette) et la fiche Google | `/gateau-pour-demain/`, `/commander/` |
| Informationnelle (combien, quelle grosseur, comment) | I1, I2, I3, I4, I7 | le classement par passage et le contenu utile; la fraîcheur quand la requête porte sur un prix | blocs réponse, tableaux datés, calculateur |
| Saisonnière | C4 | la fraîcheur, et la fiche Google pendant la saison | page permanente rafraîchie chaque année |
| Marque | B1, B2, B3 | l'entité : un seul nom, une seule adresse, la page À propos comme source de vérité, les profils reliés entre eux | `/a-propos/`, données structurées, fiche Google |

---

## 10. Ce qu'on ne sait pas encore

| Inconnu | Qui le trouve | Où c'est noté |
|---|---|---|
| Le relevé depuis un cellulaire à Granby : carte locale, 10 premiers résultats, encadré, « Autres questions posées », aperçu IA, pour les 33 requêtes et les 20 candidates | une personne à Granby, 20 à 30 minutes par semaine : [[FACT NEEDED: qui (research/14 D1)]]; sinon un outil de relevé réglé sur Granby | research/05 §9 |
| Les réponses des moteurs d'IA (ChatGPT, Perplexity, Gemini, Claude, Copilot) sur nos requêtes : qui est cité, quels faits faux circulent | l'Agence | research/05 (jamais fait) |
| Les volumes de recherche (Keyword Planner, Google Trends) | l'Agence | research/04 V3, V4 |
| La récolte des « Autres questions posées » depuis Granby, 3 niveaux | l'Agence | research/04 V5 |
| L'analyse des sites de Cake Design, d'Avec un Grand A et de Rose Gâteaux (pages, dates, FAQ) | faite le 29 octobre 2026 par l'Agence (`tools/crawl.mjs`, 4 sites; le site du Marmiton n'a pas pu être lu) : [docs/19 §2.1](19-marche-et-concurrence.md); à refaire chaque trimestre ([docs/13 D6](13-taches-humaines.md)) | research/03 §8 |
| Les catégories des fiches Google concurrentes et leurs nombres d'avis actuels | l'Agence, à la main | research/03 §8 |
| Les mots exacts des clients | vous et l'équipe (Coco Studio › « Noter une question de client ») | §5 |
| Les vérifications de l'Office québécois de la langue française (« gâteau de fête », « cueillette » ou « ramassage », « carte-cadeau », majuscules des fêtes) | l'Agence | research/04 V1 |
| La distance en auto et à pied de la boutique au Zoo, au Marché public et aux villes voisines | l'Agence, à partir du point de la boutique une fois vérifié (jamais avec un site de calcul de distance) | research/01 §9.2, §9.5 |
| La fréquentation du Zoo en 2025 et l'origine des visiteurs (le chiffre de « plus de 665 000 » n'a pas été retrouvé) | l'Agence (communiqué du Zoo, Tourisme Granby région) | research/01 §9.5 |
| Vos réponses : produits et prix, portions, délais, heure limite pour demain, bûches 2026, livraison, allergènes, personne qui sert en anglais, en espagnol | vous | research/14 §14 (le message de 15 questions) |

---

## Sources

Fichiers du projet lus le 29 octobre 2026 : research/01 (§1, §3, §5, §8, §9 et mise à jour du 27 octobre 2026), research/02 §0 et §5, research/03 (§0 à §8), research/04 (§0 à §5, §8), research/05 (§0 à §10 et mise à jour du 29 octobre 2026, W44.0 à W44.6), research/06 §0 et §1 (a) à (d), research/07 (A-6, A-7, C-9, S10 à S12), research/11 §2, research/15 D19, research/18 (n° 1, 4a, 4b); `data/keywords.csv` (comptes refaits le 29 octobre 2026), `data/prompts.csv`, `scoreboard/prompts.csv`, `data/serp-baseline-2026-W44.csv`, `data/competitors.csv`, `data/price-benchmarks.csv`, `data/directories.csv`.

Pages citées par la recherche (vues le 25 octobre 2026, résumés de recherche, pages non ouvertes) :
- Cake Design Granby : https://cakegranby.ca/products/gateau-sur-mesure · https://www.cakegranby.com/saveurs_tarifs.php
- Avec un Grand A : https://www.avecungranda.com/commande-en-ligne · https://www.avecungranda.com/product/gateau-framboisier/
- Rose Gâteaux : https://rosegateaux.com/ · https://www.rosegateaux.com/shower-de-bebe.html
- Mont Rose Pâtisserie & Café (RestoMontreal) : https://www.restomontreal.ca/resto/mont-rose-patisserie-cafe-granby/23174/en/
- Délices Sucrés Granby : delicessucresgranby.my.canva.site
- IGA, service traiteur : https://traiteur.iga.net/categories/102/product/631?lang=fr
- Maître Glacier Granby : https://granby.maitreglacier.com/categorie-produit/gateaux-2/
- Les Crudélices : https://www.lescrudelices.ca/menu
- Three Best Rated : https://threebestrated.ca/bakeries-in-granby-qc · https://threebestrated.ca/cakes-in-granby-qc
- RestoMontreal, la boutique : https://www.restomontreal.ca/resto/patisserie-cocovanille-granby/20633/fr/
- La Voix de l'Est, fermeture de Pain-Pain (16 juin 2026) : https://www.lavoixdelest.ca/affaires/affaires-locales/2026/06/16/les-proprios-de-la-boulangerie-pain-pain-tournent-la-page-BGIVLUIEIRCHHJX6KZ5J2RWZZQ/
- Le Nouvelliste, chantier du Costco (2 octobre 2026) : https://www.lenouvelliste.ca/affaires/2026/10/02/futur-costco-le-chantier-de-construction-va-bon-train-a-saint-alphonse-de-granby-D4EBZTIGJ5A4HN2OF6BTYAAK5M/
- Gazette officielle du Québec, décret de population 2026 : https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/lois_reglements/2025F/86980.pdf
- Statistique Canada, Granby, langue maternelle 2021 : https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?topic=6&dguid=2021A00052447017&lang=F
