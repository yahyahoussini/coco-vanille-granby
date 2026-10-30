# Brief de page — Pâtisserie Coco Vanille (couches 9, 10 et 13)

**Un brief par page, avant d'écrire ou de réécrire. Le §2 est le gabarit à copier dans `docs/briefs/<adresse>.md`. Le §3 est un exemple rempli : la page « Gâteau pour demain », pour la requête prioritaire n° 1 de research/05 (§6 et W44.7, mise à jour du 29 octobre 2026 : L3, 19 sur 20).**

| | |
|---|---|
| Mis à jour | 29 octobre 2026 |
| Préparé par | Yahya (BrandHub.ma), l'Agence |
| Contrat de page lu dans | `apps/web/src/seed/content.js` (règles en tête du fichier), `apps/web/src/components/site/Contract.js`, la page rendue `/gateau-pour-demain/` du contrôle du 28 octobre 2026 (`apps/web/reports/gate/html/`) |
| S'appuie sur | plan-v1 §7, research/00 §10.1, research/04 §3 et §5, research/05 §6, research/07 (S10 à S12, F-2), research/11 §5, research/12 §3, `data/facts.json`, `data/prompts.csv` |
| Voir aussi | [docs/17-architecture.md](17-architecture.md) (la page dans l'arbre) · [docs/14-calendrier-contenu.md](14-calendrier-contenu.md) (la semaine où on l'écrit) · [docs/16-recherche.md](16-recherche.md) (vocabulaire, concurrents) · [docs/15-script-video.md](15-script-video.md) (la vidéo de la page) |

Mots utilisés :
- **Bloc réponse** : le premier paragraphe sous le titre, de 40 à 60 mots, qui répond à la question tout seul. C'est le passage que Google, ses aperçus IA et les autres moteurs d'IA reprennent le plus souvent.
- **Intertitre (h2)** : un sous-titre de la page. Ici, chaque intertitre est une question; la première phrase en dessous y répond.
- **Extrait optimisé** : la réponse encadrée que Google affiche parfois tout en haut des résultats.
- **Données structurées (JSON-LD)** : un petit bloc invisible qui décrit la page aux moteurs (la boutique, le fil d'Ariane, le produit). Il ne dit jamais rien qui ne soit pas visible sur la page.

---

## 1. Le contrat de page de ce site

Chaque page construite suit déjà ce contrat. Le brief sert à le remplir avec des faits vrais.

| Élément | Règle | Dans le site construit |
|---|---|---|
| Titre | moins de 60 caractères; le mot du client d'abord, le lieu, la marque à la fin | oui, sur chaque page (ex. « Gâteau pour demain à Granby · Pâtisserie Coco Vanille », 53 caractères) |
| Description | 140 à 160 caractères qui donnent la réponse et, si possible, un chiffre | oui; les pages de produits sont trop courtes tant que leur description manque |
| H1 | un seul, dans les mots du client | oui |
| Bloc réponse | 40 à 60 mots : la marque « Pâtisserie Coco Vanille » + la catégorie + Granby + un fait chiffré et daté; la première phrase se dit à voix haute (pas de symbole, pas de parenthèse) | oui; le chiffre daté manque souvent, faute de réponse de la boutique |
| Intertitres | 3 à 6 questions, la réponse dans la première phrase, puis la preuve (tableau avec légende, liste d'étapes, citation) | oui |
| En bref | 5 faits datés, la marque nommée dans chaque ligne | sur l'accueil (« Coco Vanille en bref ») et À propos (« Fiche d'identité »); à ajouter ailleurs (prévu) |
| FAQ | 5 à 8 vraies questions dans des volets dépliables (`<details>`), dont une formulée comme on le dit à Granby, réponse en français standard | oui |
| Action | une action principale par type de page : Commander, Appeler, Écrire (clavardage « Écrivez-nous »), Itinéraire. Pas de WhatsApp (décision M11) | oui |
| Auteur et dates | « Par L'équipe Coco Vanille · Publié le … · Mis à jour le … » + une ligne qui dit ce qui a changé | oui; une personne nommée seulement avec son accord (research/14 C1) |
| Prix | écrits en texte, avant taxes, « taxes en sus, s'il y a lieu »; jamais « prix sur demande » | oui, là où les prix existent (research/07 S11) |
| Allégations | aucun superlatif présenté comme un fait (« la meilleure »); aucune mention « sans gluten », « sans noix », « végane » | oui (research/07 S10, S12) |
| Langues | français d'abord; l'anglais est écrit en anglais, jamais plus complet que le français | oui, avec quatre écarts à aligner ([docs/17-architecture.md](17-architecture.md) §3.4) |
| Données structurées | site : Bakery + WebSite; page : WebPage + BreadcrumbList; produit : Product + Offer; jamais de note « étoiles » de la boutique sur elle-même | oui (la page rendue contient Bakery, WebSite, WebPage, BreadcrumbList) |
| Texte légal | marqué `data-nosnippet` pour qu'aucun moteur ne le cite comme réponse | oui |
| Verrou | aucune page avec un [[FACT NEEDED]] ne se publie; une page anglaise attend sa page française | oui (`apps/web/src/lib/publish.js`) |

Ce que le contrôle du 28 octobre 2026 demande encore sur beaucoup de pages (`apps/web/reports/gate/audit.json`, 55 pages contrôlées) : une citation d'une personne nommée avec son rôle (38 pages), au moins deux chiffres sourcés par page (20 pages), un texte plus long sur les pages de produits. Ces trois points attendent des faits de la boutique.

---

## 2. Le gabarit (à copier)

| Champ | À remplir |
|---|---|
| Adresse française · anglaise (· espagnole) | |
| Clé du registre et condition de publication (`apps/web/src/lib/routes.js`) | |
| Type | pilier · satellite · famille · produit · saisonnière · outil · locale · à propos · légale |
| Requête principale (code de `scoreboard/prompts.csv`, note sur 20) | |
| Requêtes secondaires et mots-clés (`data/keywords.csv`, priorité estimée) | |
| Intention lue dans les résultats | informationnelle · commerciale · transactionnelle · locale · de marque |
| Forme qui gagne déjà (relevé fait depuis Granby, research/05 §9) | paragraphe · liste · tableau · vidéo · palmarès · carte locale |
| Éléments présents dans la page de résultats | extrait optimisé · « Autres questions posées » · aperçu IA · mode IA · carte locale · vidéo · annonces · forums |
| Sous-questions (3 à 6) : un intertitre chacune, la réponse dans la première phrase | 1. … 2. … 3. … |
| « Autres questions posées » récoltées depuis Granby (3 niveaux) | |
| Titre (moins de 60 caractères) | |
| Description (140 à 160 caractères) | |
| H1 | |
| Bloc réponse (40 à 60 mots) | |
| En bref (5 faits datés, la marque dans chaque ligne) | |
| Preuves à rassembler : 2 ou 3 chiffres sourcés, 1 citation d'une personne nommée, 1 donnée maison (identifiants de `data/facts.json`, questions de research/14) | |
| Tableau (options × critères, avec légende) | |
| Liste numérotée (étapes) | |
| Images réelles (fichier, texte de remplacement factuel, dimensions) | |
| Vidéo (titre, chapitres = sous-questions, transcription sur la page) | |
| FAQ (5 à 8 vraies questions, dont une formulée comme à Granby) | |
| Action principale · secondaire | |
| Liens internes entrants (au moins 3 : depuis quelles pages, avec quelle ancre) | |
| Liens internes sortants (la page parente + 2 pages sœurs) | |
| Auteur, date de publication, note de changement | L'équipe Coco Vanille (ou une personne nommée, avec son accord) · … · … |
| Données structurées (types) | WebPage + BreadcrumbList (+ Product + Offer s'il y a des prix) |
| Version anglaise | écrite par une personne anglophone, les mêmes chiffres, jamais plus complète |
| Porte de sortie | contrôle sans échec (`node apps/web/scripts/gate.mjs`) · aucune mention [[FACT NEEDED]] dans la page · 3 liens entrants le jour de la mise en ligne |

---

## 3. Exemple rempli : « Gâteau pour demain » (requête L3)

### 3.1 La fiche

| Champ | Valeur |
|---|---|
| Adresse | française : `/gateau-pour-demain/` (construite) · anglaise : `/en/cake-for-tomorrow/` (adresse réservée, texte à écrire) · espagnole : aucune |
| Clé du registre et condition | `gateau-pour-demain`, page conditionnelle : « Commande pour le lendemain + heure limite confirmées ». Parent : Gâteaux (fil d'Ariane Accueil › Carte › Gâteaux › Gâteau pour demain) |
| Type | page satellite du pilier gâteaux; c'est le « coin d'entrée » choisi pour les gâteaux (research/15 D19 : défendre « pâtisserie-boulangerie Granby », entrer dans les gâteaux par « gâteau pour demain ») |
| Requête principale | **L3 « gâteau pour demain Granby », 19 sur 20** (relevée telle quelle dans le relevé indirect du 29 octobre 2026; note provisoire jusqu'à la mesure depuis Granby, research/05 W44.6), la n° 1 des dix requêtes prioritaires (research/05 W44.7) |
| Requêtes secondaires | I2 « combien de jours d'avance commander un gâteau personnalisé » (16) pour la partie délais · E19 « Can you make a cake for tomorrow? » (anglais) · mots-clés : gâteau pour demain granby (moyenne), gâteau dernière minute granby (faible), gâteau rapide granby (faible), last minute cake granby (faible, anglais) |
| Pourquoi cette page peut gagner | le 29 octobre 2026, la réponse disait ne trouver aucune boulangerie de Granby qui annonce un gâteau prêt pour le lendemain, et renvoyait déjà vers la boutique (« appelez Cocovanille », fiche RestoMontreal au 14e lien), avec la plainte de janvier 2026 (research/05 W44.2; à confirmer depuis Granby); la boutique est aussi décrite comme prenant les commandes « par téléphone, prêtes le lendemain » (Three Best Rated, fiche de 2025, non vérifiée : `service.next_day_phone_order` dans `data/facts.json`) |
| Intention | transactionnelle et locale : la personne veut un gâteau, demain, près de chez elle |
| Forme qui gagne déjà | [[FACT NEEDED: relevé depuis un cellulaire à Granby (research/05 §9, research/14 D1)]]. Hypothèse : un paragraphe qui répond oui ou non avec l'heure limite |
| Éléments de la page de résultats | [[FACT NEEDED: même relevé]] (le relevé indirect du 29 octobre 2026, fait depuis les États-Unis, ne voit ni carte locale, ni encadré, ni aperçu IA) |
| Concurrents sur cette intention (faits de concurrents, pas les nôtres) | Délices Sucrés Granby promet des commandes de dernière minute sur un site d'une page (delicessucresgranby.my.canva.site, vu le 25 octobre 2026 dans un résumé de recherche, research/03 §1) · Avec un Grand A annonce un délai de 48 h en jours ouvrables (avecungranda.com/commande-en-ligne, vu le 25 octobre 2026) · Maître Glacier prend certains gâteaux glacés par téléphone avec 48 h d'avis (granby.maitreglacier.com, vu le 25 octobre 2026) · l'épicerie est le plancher de prix : gâteaux de 8 à 12 portions à 26,99 $ au catalogue traiteur d'IGA (traiteur.iga.net, vu le 25 octobre 2026; son délai de commande n'a pas été relevé) |
| Titre | construit : « Gâteau pour demain à Granby · Pâtisserie Coco Vanille » (53 caractères). On le garde |
| Description | construite (159 caractères) : « Un gâteau pour demain à Granby? À la Pâtisserie Coco Vanille, commandez avant l'heure limite pour une cueillette le lendemain au 3, rue Court, au centre-ville. » Quand l'heure et les formats sont connus : « Un gâteau pour demain à Granby? Commandez avant [[FACT NEEDED: heure limite]] à la Pâtisserie Coco Vanille : [[FACT NEEDED: formats]], cueillette le lendemain au 3, rue Court. » (à recompter : 140 à 160 caractères) |
| H1 | « Un gâteau pour demain à Granby » (construit) |
| Bloc réponse | voir §3.2 |
| Action principale · secondaire | « Commander pour demain » vers `/commander/` (research/00 §5.2) · « Appeler » au 450-372-7177 · « Écrire » (« Écrivez-nous », réponse pendant les heures d'ouverture, sans promesse de délai, research/15 D27). Tant que la commande en ligne n'est pas ouverte, `/commander/` affiche le formulaire de demande |
| Auteur et dates | « Par L'équipe Coco Vanille » · publiée le [[FACT NEEDED: date de mise en ligne]] · note de changement construite : « Jours de fermeture ajoutés; la page attend la confirmation de la commande pour le lendemain et de l'heure limite. » |
| Données structurées | aujourd'hui : Bakery + WebSite + WebPage + BreadcrumbList. À ajouter quand les prix existent : un Product + Offer par format offert pour le lendemain, avec la disponibilité réelle (research/06 (k); décision M21). Jamais de note « étoiles » de la boutique. Le balisage FAQ est facultatif et n'est jamais une condition (M17) |
| Vidéo | script 3 de [docs/15-script-video.md](15-script-video.md), « Un gâteau pour demain à Granby? » (idée n° 9 de research/11 §5). Chapitres = les intertitres du §3.3; transcription sur la page; condition : l'heure limite et les délais confirmés; place dans le calendrier : [docs/14-calendrier-contenu.md](14-calendrier-contenu.md) (mai 2027, ou mars 2027 si confirmé avant) |
| Fiche Google | une publication et un produit « Gâteau pour demain » sur la fiche, seulement si c'est vrai (research/05 §6) |

### 3.2 Le bloc réponse (à recompter une fois les faits fournis)

Construit (41 mots hors mentions) :

> La Pâtisserie Coco Vanille, au 3, rue Court, à Granby, prépare des gâteaux pour le lendemain quand la commande arrive avant l'heure limite : [[FACT NEEDED: heure limite de commande pour le lendemain]]. Les formats offerts pour le lendemain sont [[FACT NEEDED: formats offerts pour le lendemain]], à récupérer en boutique. Le calendrier affiche seulement les dates possibles.

Proposé, français (43 mots hors mentions; de 49 à 55 mots une fois rempli) : il répond « oui » d'abord, nomme la catégorie, et porte un fait daté (l'heure limite en vigueur à une date).

> Oui : la Pâtisserie Coco Vanille, pâtisserie-boulangerie du centre-ville de Granby, prépare un gâteau pour le lendemain si la commande arrive avant [[FACT NEEDED: heure limite]]. Formats offerts : [[FACT NEEDED: formats et portions]], à récupérer au 3, rue Court. La boutique est fermée le lundi et le mardi. Heure limite en vigueur le [[FACT NEEDED: date]].

Proposé, anglais, pour `/en/cake-for-tomorrow/` (46 mots hors mentions), à faire relire par une personne anglophone (research/14 M2) :

> Yes: Pâtisserie Coco Vanille, a pastry shop and bakery in downtown Granby, Québec, makes a cake for the next day if the order comes in before [[FACT NEEDED: cut-off time]]. Next-day sizes: [[FACT NEEDED: sizes and servings]], for pickup at 3 rue Court. The shop is closed on Monday and Tuesday. Cut-off time as of [[FACT NEEDED: date]].

Format d'écriture de l'heure : « 14 h » en français, « 2 p.m. » en anglais (exemple de format seulement, pas votre heure limite; research/04 §3.1).

### 3.3 Les intertitres, la réponse d'abord

| # | Intertitre | Première phrase (la réponse) | Preuve en dessous | État |
|---|---|---|---|---|
| 1 | Peut-on avoir un gâteau pour demain à Granby? | « Oui, si la commande arrive avant [[FACT NEEDED: heure limite]] : la Pâtisserie Coco Vanille prépare alors un gâteau pour une cueillette le lendemain au 3, rue Court. » | — | existe |
| 2 | Quels gâteaux sont offerts pour le lendemain? | « Pour le lendemain, la Pâtisserie Coco Vanille offre [[FACT NEEDED: gâteaux et formats]]. » | tableau « Gâteaux offerts pour le lendemain, prix au [date] » : format · portions · prix avant taxes · saveurs (P1, P4) | existe; tableau à ajouter |
| 3 | Jusqu'à quelle heure commander pour demain? | « L'heure limite est [[FACT NEEDED: heure limite]]. » Le calendrier calcule la première date possible à partir de l'heure limite, des jours de fermeture et des places libres de la journée | — | existe |
| 4 | Comment commander un gâteau pour demain? | « Une commande pour demain se fait en ligne, en six étapes, ou par téléphone au 450-372-7177. » | liste, les six étapes de `/commander/` : 1. choisir le gâteau et l'ajouter à « Ma boîte »; 2. choisir la date de demain, puis une plage de cueillette; 3. vérifier le récapitulatif (produits, date, total, TPS et TVQ); 4. accepter les conditions de vente en cochant la case; 5. payer sur la page sécurisée du processeur de paiement; 6. recevoir la confirmation par courriel, en français d'abord. Puis la cueillette au 3, rue Court, avec le numéro de commande | à ajouter |
| 5 | Et si c'est pour aujourd'hui? | « Pour aujourd'hui, la vitrine du jour, sur la page d'accueil, montre les gâteaux et les pâtisseries en vente. » | appeler avant de se déplacer | existe |
| 6 | Combien coûte un gâteau pour demain? | « Un gâteau pour demain coûte [[FACT NEEDED: prix par format]], avant taxes. » | lien vers `/prix/` (« prix des gâteaux par format ») | à ajouter quand la grille de prix existe |

### 3.4 En bref (5 faits datés, la marque dans chaque ligne)

| Fait | Source | État |
|---|---|---|
| La Pâtisserie Coco Vanille est au 3, rue Court, au centre-ville de Granby (Québec). | `data/facts.json` › `address` (vérifié) | prêt |
| La Pâtisserie Coco Vanille est ouverte du mercredi au samedi de 8 h 30 à 17 h 30 et le dimanche de 9 h 30 à 17 h; elle est fermée le lundi et le mardi. | `hours.google_listing` (fiche Google relayée le 27 octobre 2026; à confirmer par vous, research/14 H1) | prêt |
| La Pâtisserie Coco Vanille prend les commandes pour le lendemain jusqu'à [[FACT NEEDED: heure limite]]. | research/14 P4 | attend |
| La Pâtisserie Coco Vanille offre pour le lendemain [[FACT NEEDED: formats et portions]]. | research/14 P1, P4 | attend |
| La Pâtisserie Coco Vanille se joint au 450-372-7177. | `phone.primary` (vérifié) | prêt |

### 3.5 Les preuves à rassembler

| Preuve | D'où | État |
|---|---|---|
| L'heure limite, les formats, les prix et les portions | vous (research/14 P1, P4) | [[FACT NEEDED]] |
| Ce que la boutique peut produire chaque jour | vous (research/14 K1) | [[FACT NEEDED]] : sert aussi au calendrier de commande |
| Comment vous confirmez un gâteau aujourd'hui (photo, récapitulatif, approbation) | vous (research/14 P6) : c'est la réponse à la seule plainte publique connue, un gâteau qui ne correspondait pas à la commande (research/01 §6) | [[FACT NEEDED]] |
| Une donnée maison : « Ce que nous avons mesuré » | Coco Studio, une fois la commande en ligne ouverte : « Sur les [N] commandes de gâteau reçues entre le [date] et le [date], [X] % étaient pour le lendemain. Méthode : export des commandes, annulations exclues. » Au moins 30 commandes avant de publier un pourcentage (research/14 P5) | plus tard |
| Une citation d'une personne nommée | la propriétaire ou le chef, avec son nom, son rôle et son accord (research/14 C1) | [[FACT NEEDED]] |
| Des chiffres publics sur les gâteaux du lendemain | aucun chiffre public trouvé à ce jour (research/05) : on n'en invente pas; la donnée maison les remplacera | — |
| Une photo réelle | une vraie photo d'un gâteau de la boutique, avec un texte de remplacement factuel (ex. « Gâteau aux framboises de la Pâtisserie Coco Vanille »); jamais une photo d'illustration présentée comme un produit de la boutique (research/sessions/04 #12) | [[FACT NEEDED: photos (research/14 B2, B3)]] |

### 3.6 La FAQ (5 questions construites, 2 à ajouter)

| Question | Réponse (début) | État |
|---|---|---|
| C'est-tu possible d'avoir un gâteau pour demain? *(formulée comme on le dit à Granby)* | « Oui, si vous commandez avant [[FACT NEEDED: heure limite]], dans les formats offerts pour le lendemain. Après l'heure limite, le calendrier propose le jour suivant. » | existe |
| Peut-on personnaliser un gâteau pour demain? | « La personnalisation d'un gâteau pour le lendemain reste à confirmer : [[FACT NEEDED]]. » | existe |
| Peut-on commander un gâteau pour demain par téléphone? | « Oui : appelez au 450-372-7177 avant l'heure limite. » | existe |
| Peut-on commander pour un lendemain de fermeture? | « Non : le calendrier saute les jours de fermeture et propose la prochaine journée ouverte. » | existe |
| Peut-on écrire un message sur un gâteau pour demain? | « Le message sur un gâteau pour le lendemain reste à confirmer : [[FACT NEEDED]]. » | existe |
| Est-ce que mon gâteau va ressembler à ce que j'ai commandé? | « Avant de payer, vous vérifiez un récapitulatif écrit : produits, date de cueillette, total et taxes. La boutique ne déplace jamais une date confirmée sans votre accord. » (phrases reprises de `/commander/`; pour un gâteau personnalisé, la photo de référence et l'approbation du récapitulatif s'ajoutent) | à ajouter |
| Faites-vous la livraison d'un gâteau pour demain? | « La commande prévoit la cueillette au 3, rue Court, à Granby. » + la réponse sur la livraison (research/14 O3) | à ajouter |

### 3.7 Les liens

| Sens | Pages | Ancre | État |
|---|---|---|---|
| Entrants | pied de page « Découvrir » de chaque page · « À consulter aussi » de `/gateaux/` | « Gâteau pour demain » | existent (27 pages françaises en mode aperçu, contrôle du 28 octobre 2026) |
| Entrants, dans le texte | accueil (question « Peut-on avoir un gâteau pour demain? ») · `/gateaux/` et `/commander/` (question « C'est-tu possible d'avoir un gâteau pour demain? ») · `/faq/` (question à ajouter) · `/gateaux-personnalises-granby/` (question sur la fin de semaine) | « gâteau pour demain » | à ajouter après la refonte |
| Sortants | `/gateaux/` (parent, fil d'Ariane) · `/commander/` (action) · `/prix/` (dès qu'elle est publiée) · `/nous-trouver/` (heures, jours de fermeture) · `/allergenes/` | ancres descriptives | à vérifier après la refonte |

### 3.8 La porte de sortie

1. Vous avez répondu à P4 (heure limite, formats), à P1 (prix, portions) et à P9 (message, personnalisation) : les cinq informations manquantes de la page sont remplies, et celles du pied de page aussi (A4).
2. Le texte anglais est écrit et relu; il dit la même chose que le français, pas plus.
3. Le contrôle passe sans échec (`node apps/web/scripts/gate.mjs`); la page n'a plus aucune mention [[FACT NEEDED]].
4. Trois liens dans le texte d'autres pages publiées pointent vers elle le jour même.
5. Mise en ligne, demande d'indexation dans Search Console, avis à Bing (IndexNow : la clé est prévue dans la configuration du serveur, mais le site ne l'envoie pas encore; à brancher).
6. Suivi : L3 dans la mesure du lundi; requêtes contenant « demain » dans Search Console; contrôle au 7e et au 14e jour pour l'encadré de Google ([docs/07-rapport-mensuel.md](07-rapport-mensuel.md)).

---

## 4. Les règles d'écriture

- **Le fait d'abord, le chiffre ensuite, la source en troisième.** On enlève « nous pensons », « nous croyons », « peut-être ».
- **Une idée par paragraphe, trois phrases au plus.** Le nom complet « Pâtisserie Coco Vanille » à chaque fois, avec « Granby » dans chaque phrase qui présente la boutique; jamais un simple pronom pour la marque (research/04 §3.2, règle 9).
- **On définit le terme de la catégorie une fois**, dans une phrase qui commence par lui (ex. « Une viennoiserie est… »).
- **Les mots d'ici :** « gâteau de fête » dans le H1, « gâteau d'anniversaire » dans le texte et la description; « chocolatine », avec « pain au chocolat » une seule fois; « en auto »; tailles en pouces et en centimètres; « 14 h »; prix au format « 00,00 $ » en français et « $00.00 » en anglais (research/04 §3.1).
- **Le mot de la cueillette** : « cueillette » partout pour l'instant; le choix définitif entre « cueillette » et « ramassage » vous appartient (research/14 L3).
- **Le registre :** français standard, avec une seule question au ton de Granby dans la FAQ (« C'est-tu possible… ? »), et une réponse en français standard.
- **L'anglais** s'écrit en anglais, avec l'orthographe canadienne (flavour, colour, centre); « Granby, Québec » dans les titres anglais, pour ne pas être confondu avec les Granby des États-Unis (research/05 §0.7).
- **Aucun chiffre inventé.** Ce qui manque reste [[FACT NEEDED: …]] jusqu'à votre confirmation écrite. Les chiffres d'un concurrent ou d'une étude ne deviennent jamais les nôtres.
- **Aucune allégation encadrée** (« sans gluten », « sans noix », « végane ») et aucun superlatif (« la meilleure ») tant qu'une distinction datée, remise par un tiers, ne le prouve pas (research/07 S10, S12).
- **Aucun texte écrit pour les robots** ou caché aux visiteurs : tout ce que lit un moteur, un client le lit aussi.

---

## Sources

- `apps/web/src/seed/content.js` (règles du contrat en tête du fichier; page `gateau-pour-demain`), `apps/web/src/lib/routes.js`, `apps/web/src/lib/publish.js`, `apps/web/src/lib/ordering/availability.js` (commande en ligne désactivée par défaut : formulaire de demande); page rendue et audit du contrôle du 28 octobre 2026 (`apps/web/reports/gate/`). Comptes de mots et de caractères refaits le 29 octobre 2026.
- research/05 §3, §6 et mise à jour du 29 octobre 2026 (W44.2, W44.6, W44.7); research/03 §1, §2 et §2b (concurrents, vus le 25 octobre 2026); research/04 §3, §5; research/07 S10, S11, S12; research/11 §5; research/12 §3 (M11, M17, M21); research/14 (B2, B3, C1, D1, H1, K1, L3, M2, O3, P1, P4, P5, P6); research/15 D19, D27; `data/facts.json` (`address`, `phone.primary`, `hours.google_listing`, `service.next_day_phone_order`); `data/prompts.csv`; `data/keywords.csv`; plan-v1 §7.
