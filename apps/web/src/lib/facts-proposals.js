// A proposed answer for each fact of the catalog (lib/facts-catalog.js), so the public site reads complete from the
// first day. These are approximations written by the agency on 2026-11-03, at the request of the operator, from the
// shop's own posts (research/20b), public reviews and the Granby market (Rose Gâteaux, Avec un Grand A, Première
// Moisson). The owner checks each one in Studio › Plus › Faits du site: « C'est bon » keeps it, a new answer replaces
// it, and an emptied answer comes back here (lib/studio/actions/facts.js). Until then Studio shows it as « À vérifier ».
// Each answer fits the sentence its fact has in the copy (src/seed/content.js), in French and in English. Answers that
// go into an answer block stay short: the block keeps its 40–60 words once filled (test/unit/facts-catalog.test.js).
//
// What is not proposed, on purpose: anything about one person (the chef page stays off until the owner answers), and
// nothing here says a product is free of an allergen. The sentences about allergens, access and tax numbers send the
// customer to the shop instead of stating a fact only the shop knows. Pure module (no imports).

const PHONE = '450-372-7177'

export const PROPOSALS = {
  // Produits et prix
  'liste-produits': { fr: 'viennoiseries, pains, pâtisseries, salé, spécialités marocaines, gâteaux sur commande, bûches en saison, boissons chaudes et froides', en: 'viennoiseries, bread, pastries, savoury food, Moroccan specialties, cakes to order, Yule logs in season, hot and cold drinks' },
  'liste-viennoiseries': { fr: 'croissant, chocolatine et croissant aux amandes', en: 'croissant, chocolatine and almond croissant' },
  'viennoiseries-jour': { fr: 'croissants et chocolatines, dès l’ouverture', en: 'croissants and chocolatines, from opening time' },
  'liste-pains': { fr: 'baguette et pain de campagne', en: 'baguette and country loaf' },
  'pains-jour': { fr: 'baguette et pain de campagne, dès le matin', en: 'baguette and country loaf, from the morning' },
  'liste-patisseries': { fr: 'mousse au chocolat, Gâteau Royal, verrine kunafa pistache, Paris-Brest et, côté salé, vol-au-vent, feuilletés, mini pizzas, pastillas au poulet et sandwichs', en: 'chocolate mousse, Gâteau Royal, pistachio kunafa verrine, Paris-Brest and, on the savoury side, vol-au-vent, puff pastries, mini pizzas, chicken pastillas and sandwiches' },
  'patisseries-saison': { fr: 'mousse au chocolat, Gâteau Royal et Paris-Brest', en: 'chocolate mousse, Gâteau Royal and Paris-Brest' },
  'prix-viennoiseries': { fr: 'à titre indicatif, 3,25 $ le croissant, 3,95 $ la chocolatine et 4,25 $ le croissant aux amandes, avant taxes', en: 'as a guide, $3.25 for a croissant, $3.95 for a chocolatine and $4.25 for an almond croissant, before taxes' },
  'prix-pains': { fr: 'à titre indicatif, 3,75 $ la baguette et 6,75 $ le pain de campagne, avant taxes', en: 'as a guide, $3.75 for a baguette and $6.75 for a country loaf, before taxes' },
  'prix-patisseries': { fr: 'à titre indicatif, de 6,50 $ à 7,50 $ la pâtisserie individuelle, avant taxes', en: 'as a guide, $6.50 to $7.50 for an individual pastry, before taxes' },
  'produits-saisonniers': { fr: 'les bûches de Noël, en précommande jusqu’au 18 décembre', en: 'Yule logs, open for pre-order until December 18' },
  'prix-en-ligne': { fr: 'Oui : le prix est le même sur le site et au comptoir.', en: 'Yes: the price is the same on the website and at the counter.' },
  boissons: { fr: 'café à environ 2,75 $, latte à environ 4,75 $, et une dizaine de places assises', en: 'coffee at about $2.75, latte at about $4.75, and about ten seats' },
  marocain: { fr: 'selon la fournée, surtout la fin de semaine, à environ 2,50 $ l’unité', en: 'depending on the batch, mostly on weekends, at about $2.50 each' },
  'pain-congele': { fr: `Oui, selon l’arrivage : demandez au comptoir ou appelez au ${PHONE}.`, en: `Yes, depending on what came in: ask at the counter or call ${PHONE}.` },
  tartes: { fr: 'Oui, selon la saison : demandez au comptoir ce qu’il y a cette semaine.', en: 'Yes, depending on the season: ask at the counter what there is this week.' },
  chocolatines: { fr: 'Oui : la chocolatine, aussi appelée pain au chocolat, est à la carte.', en: 'Yes: the chocolatine, also called pain au chocolat, is on the menu.' },
  'garniture-paris-brest': { fr: 'une crème pralinée', en: 'a praline cream' },
  'garniture-vol-au-vent': { fr: 'du poulet en sauce', en: 'chicken in sauce' },
  'fait-sur-place': { fr: 'Les pâtisseries et les gâteaux sont préparés et décorés à la boutique, au 3, rue Court; demandez au comptoir pour un produit en particulier.', en: 'Pastries and cakes are made and decorated at the shop, 3 rue Court; ask at the counter about a particular product.' },

  // Gâteaux
  'liste-gateaux': { fr: 'gâteaux classiques (framboises, fraises, chocolat, red velvet) et gâteaux décorés selon votre thème', en: 'classic cakes (raspberry, strawberry, chocolate, red velvet) and cakes decorated to your theme' },
  'portions-format': { fr: '6 po, 6 à 8 portions; 8 po, 10 à 12 portions; 10 po, 16 à 20 portions', en: '6-inch, 6 to 8 servings; 8-inch, 10 to 12 servings; 10-inch, 16 to 20 servings' },
  'prix-format': { fr: 'à titre indicatif, 45 $ pour 6 po, 65 $ pour 8 po et 95 $ pour 10 po, avant taxes, pour un gâteau classique', en: 'as a guide, $45 for 6-inch, $65 for 8-inch and $95 for 10-inch, before taxes, for a classic cake' },
  'grille-prix': { fr: 'le tableau ci-dessous, à titre indicatif', en: 'the table below, as a guide' },
  'prix-plus-petit': { fr: '45 $', en: '$45' },
  'portions-plus-petit': { fr: '6 à 8', en: '6 to 8' },
  'plus-grand': { fr: 'le 10 po, pour 16 à 20 portions; un gâteau à deux étages sert de 25 à 40 personnes', en: 'the 10-inch, for 16 to 20 servings; a two-tier cake serves 25 to 40 people' },
  'format-20': { fr: 'le 10 po, qui donne de 16 à 20 portions', en: 'the 10-inch, which gives 16 to 20 servings' },
  'format-prix-20': { fr: 'le 10 po, à environ 95 $ avant taxes', en: 'the 10-inch, at about $95 before taxes' },
  'taille-portion': { fr: 'environ 5 cm de large', en: 'about 5 cm (2 inches) wide' },
  'portions-8po': { fr: 'la boutique compte de 10 à 12 portions', en: 'the shop counts 10 to 12 servings' },
  supplements: { fr: 'comptez environ 20 $ à 30 $ de plus qu’un gâteau classique pour un décor thématique', en: 'allow about $20 to $30 more than a classic cake for a themed decoration' },
  etages: { fr: 'Oui : des gâteaux à deux étages, de 25 à 40 portions, sur demande et avec au moins 14 jours d’avance.', en: 'Yes: two-tier cakes, 25 to 40 servings, on request and at least 14 days ahead.' },
  smash: { fr: 'Oui : un petit gâteau à écraser se prépare sur demande; dites-le dans votre demande.', en: 'Yes: a small smash cake can be made on request; say so in your request.' },
  message: { fr: 'Oui : un court message, jusqu’à 30 caractères, sans frais.', en: 'Yes: a short message, up to 30 characters, at no charge.' },
  themes: { fr: 'La boutique réalise les thèmes, les couleurs et les décors selon votre photo de référence. Pour un personnage connu, parlez-en avec la boutique : elle vous propose un décor inspiré.', en: 'The shop makes themes, colours and decorations from your reference photo. For a well-known character, talk to the shop: it will suggest a decoration in the same spirit.' },
  'prix-perso-min': { fr: '65 $', en: '$65' },
  'portions-min-max': { fr: 'de 6 à 40 portions', en: '6 to 40 servings' },

  // Délais et commandes
  'delai-gateau': { fr: '48 h pour un gâteau classique, 7 jours pour un gâteau décoré', en: '48 hours for a classic cake, 7 days for a decorated cake' },
  'delai-perso': { fr: '7 jours pour un décor simple, 14 jours pour un gâteau à étages', en: '7 days for a simple decoration, 14 days for a tiered cake' },
  'delai-perso-min': { fr: '7 jours', en: '7 days' },
  lendemain: { fr: 'oui par téléphone, pour un gâteau classique commandé avant 14 h la veille, selon les places libres; en ligne, comptez 48 h', en: 'yes by phone, for a classic cake ordered before 2 p.m. the day before, depending on the spots left; online, allow 48 hours' },
  'lendemain-heure': { fr: '14 h la veille', en: '2 p.m. the day before' },
  'lendemain-gateaux': { fr: 'Les gâteaux classiques de la carte, en 6 po ou en 8 po, selon les places libres de la journée.', en: 'The classic cakes on the menu, in 6-inch or 8-inch, depending on the spots left that day.' },
  'lendemain-formats': { fr: 'le 6 po et le 8 po', en: '6-inch and 8-inch' },
  'lendemain-message': { fr: 'Oui : un court message est possible, s’il est donné au moment de commander.', en: 'Yes: a short message is possible if you give it when you order.' },
  'lendemain-perso': { fr: 'Non : un décor personnalisé demande au moins 7 jours. Pour demain, choisissez un gâteau classique de la carte.', en: 'No: a custom decoration takes at least 7 days. For tomorrow, choose a classic cake from the menu.' },
  'delais-produits': { fr: '24 h pour viennoiseries et pain, 48 h pour les gâteaux, 7 jours pour un gâteau décoré', en: '24 hours for viennoiseries and bread, 48 hours for classic cakes, 7 days for a decorated cake' },
  'modif-acompte': { fr: `Oui : appelez au ${PHONE} au moins 7 jours avant la cueillette pour changer le décor, et 48 h avant pour changer le message.`, en: `Yes: call ${PHONE} at least 7 days before pickup to change the decoration, and 48 hours before to change the message.` },
  'reponse-demandes': { fr: '2 jours ouvrables', en: '2 business days' },
  'boites-groupes': { fr: `Oui : à partir de 12 viennoiseries, avec 48 h d’avance, par téléphone au ${PHONE}.`, en: `Yes: from 12 viennoiseries, 48 hours ahead, by phone at ${PHONE}.` },
  'pain-quantite': { fr: `Oui : à partir de 6 pains, avec 48 h d’avance, par téléphone au ${PHONE}.`, en: `Yes: from 6 loaves, 48 hours ahead, by phone at ${PHONE}.` },
  'patisseries-evenement': { fr: `Oui : à partir de 12 pâtisseries, avec 72 h d’avance, par téléphone au ${PHONE}. La boutique prépare aussi des plateaux de bouchées salées.`, en: `Yes: from 12 pastries, 72 hours ahead, by phone at ${PHONE}. The shop also makes platters of savoury bites.` },
  'reservation-pain': { fr: `Oui : réservez avant 14 h la veille sur la page Commander, ou appelez au ${PHONE}.`, en: `Yes: reserve before 2 p.m. the day before on the Order page, or call ${PHONE}.` },
  'reservation-viennoiseries': { fr: `Oui : réservez avant 14 h la veille sur la page Commander, ou appelez au ${PHONE}.`, en: `Yes: reserve before 2 p.m. the day before on the Order page, or call ${PHONE}.` },
  'reservation-vitrine': { fr: `Oui : appelez au ${PHONE} le jour même, et la boutique met le produit de côté jusqu’à la fermeture, tant qu’il en reste.`, en: `Yes: call ${PHONE} the same day, and the shop sets the product aside until closing, while there are some left.` },

  // Fêtes et bûches
  'heures-fetes': { fr: `du 24 décembre au 2 janvier, appelez au ${PHONE} avant de vous déplacer`, en: `from December 24 to January 2, call ${PHONE} before you come` },
  'buches-oui-non': { fr: 'oui, en précommande', en: 'yes, by pre-order' },
  'buches-saveurs': { fr: `Chocolat, vanille ou praliné, selon le modèle : demandez à la boutique au ${PHONE}.`, en: `Chocolate, vanilla or praline, depending on the model: ask the shop at ${PHONE}.` },
  'buches-portions': { fr: '6, 10 ou de 12 à 16 portions', en: '6, 10 or 12 to 16 servings' },
  'buches-prix': { fr: 'à titre indicatif, 38 $, 58 $ ou 75 $ selon le format', en: 'as a guide, $38, $58 or $75 depending on the size' },
  'buches-precommandes': { fr: 'ouvertes jusqu’au 18 décembre 2026', en: 'open until December 18, 2026' },
  'buches-cueillette': { fr: 'les 19, 20, 23 et 24 décembre 2026', en: 'December 19, 20, 23 and 24, 2026' },
  'buches-glacees': { fr: 'Non : les bûches de la boutique sont des bûches de pâtisserie.', en: 'No: the shop’s Yule logs are pastry logs, not ice cream.' },
  'liste-attente': { fr: `demandez à la boutique au ${PHONE}`, en: `ask the shop at ${PHONE}` },

  // Boutique, accès et paiement
  acces: { fr: `Appelez au ${PHONE} avant de venir : la boutique vous décrit l’entrée et prépare votre visite avec vous.`, en: `Call ${PHONE} before you come: the shop will describe the entrance and plan your visit with you.` },
  repere: { fr: 'la boutique donne sur la rue Court, à quelques pas de la rue Principale', en: 'the shop faces rue Court, a few steps from rue Principale' },
  places: { fr: 'une dizaine', en: 'about ten' },
  'paiement-comptoir': { fr: 'comptant, débit et cartes de crédit', en: 'cash, debit and credit cards' },
  'paiement-cueillette': { fr: 'oui, comptant, débit ou carte de crédit, au comptoir', en: 'yes, cash, debit or credit card, at the counter' },
  anglais: { fr: 'selon la personne au comptoir; appelez avant de venir si vous préférez l’anglais', en: 'depending on who is at the counter; call ahead if you prefer English' },
  'heure-croissants': { fr: 'Les croissants sont prêts dès l’ouverture : 8 h 30 du mercredi au samedi, 9 h 30 le dimanche', en: 'Croissants are ready at opening time: 8:30 a.m. Wednesday to Saturday, 9:30 a.m. on Sunday' },
  'heure-baguettes': { fr: `Les baguettes sont prêtes le matin, dès l’ouverture; pour une heure précise, appelez au ${PHONE}.`, en: `Baguettes are ready in the morning, at opening time; for an exact time, call ${PHONE}.` },
  'cuites-matin': { fr: 'Oui : les viennoiseries sortent du four le matin, avant l’ouverture.', en: 'Yes: viennoiseries come out of the oven in the morning, before opening.' },
  ateliers: { fr: 'à partir de 8 ans; l’heure se confirme à la réservation', en: 'from age 8; the time is confirmed when you book' },
  ouverture: { fr: `renseignez-vous au comptoir ou au ${PHONE}`, en: `ask at the counter or call ${PHONE}` },
  'marche-public': { fr: `La Pâtisserie Coco Vanille figure sur la liste des exposants du Marché public de Granby, selon le site du marché. Pour savoir si elle y est cette saison, appelez au ${PHONE}.`, en: `Pâtisserie Coco Vanille is on the exhibitor list of the Marché public de Granby, according to the market’s website. To find out whether it is there this season, call ${PHONE}.` },

  // Allergènes et conservation: never a « free from » claim; the shop answers for one product.
  'cuisine-allergenes': { fr: 'la cuisine manipule notamment du blé, des œufs, du lait et des noix, donc aucun produit n’est garanti sans allergène', en: 'the kitchen handles wheat, eggs, milk and tree nuts among others, so no product is guaranteed free of allergens' },
  ingredients: { fr: `demandez-la au comptoir ou au ${PHONE}`, en: `ask for it at the counter or at ${PHONE}` },
  'sans-lait-oeufs': { fr: 'demandez à la boutique avant de commander, car la cuisine manipule ces ingrédients', en: 'ask the shop before you order, because the kitchen handles these ingredients' },
  'affichage-allergenes': { fr: 'Demandez à la personne au comptoir : elle vérifie la recette du produit avec vous.', en: 'Ask the person at the counter: they will check the product’s recipe with you.' },
  'conservation-gateaux': { fr: 'Gardez-le au réfrigérateur, dans sa boîte, et sortez-le environ 30 minutes avant de servir. Il se déguste idéalement dans les 2 jours.', en: 'Keep it in the fridge, in its box, and take it out about 30 minutes before serving. It is at its peak within 2 days.' },
  'conservation-patisseries': { fr: 'Oui, au réfrigérateur et dans leur boîte, mais elles sont plus fraîches le jour même; dégustez-les dans les 24 heures.', en: 'Yes, in the fridge and in their box, but they are at their peak the same day; enjoy them within 24 hours.' },

  // Équipe et histoire: no name, no biography.
  proprietaires: { fr: 'L’entreprise Pâtisserie Coco Vanille inc. est inscrite au Registraire des entreprises du Québec sous le numéro 1177082220.', en: 'The company, Pâtisserie Coco Vanille inc., is listed with Québec’s Registraire des entreprises under number 1177082220.' },
  parcours: { fr: 'L’équipe de la boutique, au 3, rue Court. Comme elle l’écrit sur son compte Instagram, chaque pâtisserie est préparée et décorée avec soin, jusqu’au dernier détail.', en: 'The shop’s team, at 3 rue Court. As it says on its Instagram account, each pastry is made and decorated with care, down to the last detail.' },
  equipe: { fr: 'une équipe de pâtisserie et de service', en: 'a pastry and counter team' },

  // Administratif
  'tps-tvq': { fr: `indiqués sur vos reçus, ou sur demande au ${PHONE}`, en: `shown on your receipts, or on request at ${PHONE}` },
}

// Sentences that repeat a price or a number of servings: when Produits changes, they need a look too (Studio says so).
export const REPEATS_PRODUCTS = new Set(['prix-viennoiseries', 'prix-pains', 'prix-patisseries', 'boissons', 'marocain', 'portions-format', 'prix-format', 'prix-plus-petit', 'portions-plus-petit', 'plus-grand', 'format-20', 'format-prix-20', 'portions-8po', 'supplements', 'etages', 'prix-perso-min', 'portions-min-max', 'delai-gateau', 'delai-perso', 'delai-perso-min', 'delais-produits', 'buches-portions', 'buches-prix', 'buches-precommandes', 'buches-cueillette'])

// Facts only the person concerned can give: the chef's page answers 404 until they are all in (lib/publish.js).
export const NO_PROPOSAL = ['chef-nom', 'chef-presentation', 'chef-formation', 'chef-arrivee', 'chef-specialites', 'chef-distinctions', 'chef-rencontre', 'equipe-production']

export const proposalFor = (key) => PROPOSALS[key] || null
