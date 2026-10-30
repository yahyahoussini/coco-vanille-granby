// The facts only the shop can give, as the owner answers them in Studio › Plus › « Faits du site » (16 §2.1).
// The page copy (src/seed/content.js) keeps a [[FACT NEEDED: label]] slot for each; an answer saved in Studio
// (collection site-facts) fills every slot of its fact, in its language, wherever it appears (lib/facts.js
// resolveFacts). One fact can fill several labels that ask the same thing on different pages.
// Structured facts have their own screens and are not here: product prices, servings, lead times, allergens
// and tax (Produits), opening hours and closures (Boutique & heures), the person in charge (Réglages).
// test/unit/facts-catalog.test.js checks that every slot of the copy belongs to one fact, and the reverse.
// Pure module (relative imports only): node --test and the seed read it too.

export const FACT_GROUPS = [
  { id: 'produits', title: 'Produits et prix', hint: 'Ce que la boutique vend, en mots. Les prix et portions de chaque produit se mettent dans Produits.' },
  { id: 'gateaux', title: 'Gâteaux', hint: 'Formats, portions, prix, messages et thèmes.' },
  { id: 'delais', title: 'Délais et commandes', hint: 'Combien d’avance, le lendemain, les grosses commandes.' },
  { id: 'fetes', title: 'Fêtes et bûches', hint: 'Heures des Fêtes et offre de Noël.' },
  { id: 'boutique', title: 'Boutique, accès et paiement', hint: 'L’entrée, les places, le paiement au comptoir, la fournée.' },
  { id: 'allergenes', title: 'Allergènes et conservation', hint: 'Ce que la cuisine manipule et comment conserver. Les allergènes de chaque produit se cochent dans Produits.' },
  { id: 'equipe', title: 'Équipe et histoire', hint: 'Facultatif : seulement avec l’accord de chaque personne.' },
  { id: 'admin', title: 'Administratif', hint: 'Les numéros qui vont sur les reçus et les conditions de vente.' },
]

// { id, group, q (the question as the owner reads it), hint (an example of a good answer), fr / en (labels) }
export const FACTS = [
  // Produits et prix
  { id: 'liste-produits', group: 'produits', q: 'Quels produits vendez-vous en ce moment?', hint: 'Une liste par famille suffit.', fr: ['liste complète des produits confirmée par le propriétaire'], en: ['full product list confirmed by the owner'] },
  { id: 'liste-viennoiseries', group: 'produits', q: 'Quelles viennoiseries offrez-vous?', hint: 'ex. croissant, chocolatine, croissant aux amandes', fr: ['liste des viennoiseries'], en: ['list of viennoiseries'] },
  { id: 'viennoiseries-jour', group: 'produits', q: 'Les viennoiseries du jour et leurs heures de sortie du four', hint: 'ex. croissants et chocolatines dès 8 h 30', fr: ['viennoiseries offertes et heures de cuisson'], en: ['viennoiseries offered and baking times'] },
  { id: 'liste-pains', group: 'produits', q: 'Quels pains offrez-vous?', fr: ['liste des pains'], en: ['list of breads'] },
  { id: 'pains-jour', group: 'produits', q: 'Les pains du jour et leurs heures de sortie du four', fr: ['pains offerts et heures de cuisson'], en: ['breads offered and baking times'] },
  { id: 'liste-patisseries', group: 'produits', q: 'Quelles pâtisseries offrez-vous?', fr: ['liste des pâtisseries'], en: ['list of pastries'] },
  { id: 'patisseries-saison', group: 'produits', q: 'Les pâtisseries offertes cette saison', fr: ['liste des pâtisseries offertes'], en: ['list of pastries offered'] },
  { id: 'prix-viennoiseries', group: 'produits', q: 'Les prix des viennoiseries', hint: 'ex. croissant 2,25 $, chocolatine 2,75 $', fr: ['prix des viennoiseries'], en: ['viennoiserie prices'] },
  { id: 'prix-pains', group: 'produits', q: 'Les prix des pains', fr: ['prix des pains'], en: ['bread prices'] },
  { id: 'prix-patisseries', group: 'produits', q: 'Les prix des pâtisseries', fr: ['prix des pâtisseries'], en: ['pastry prices'] },
  { id: 'produits-saisonniers', group: 'produits', q: 'Quels produits saisonniers offrez-vous?', fr: ['produits saisonniers offerts'], en: ['seasonal products offered'] },
  { id: 'prix-en-ligne', group: 'produits', q: 'Les prix en ligne sont-ils les mêmes qu’en boutique?', fr: ['prix identiques en ligne et en boutique ou non'], en: ['same prices online and in store or not'] },
  { id: 'boissons', group: 'produits', q: 'Les prix des boissons et le nombre de places assises', hint: 'ex. café 2,50 $, latte 4,75 $; 10 places', fr: ['prix des boissons et nombre de places assises'], en: ['drink prices and number of seats'] },
  { id: 'marocain', group: 'produits', q: 'Msemmens et harchas : quels jours, à quel prix?', fr: ['jours où les msemmens et les harchas sont offerts, et leurs prix'], en: ['days msemmen and harcha are offered, and their prices'] },
  { id: 'pain-congele', group: 'produits', q: 'Vendez-vous du pain ou des baguettes congelés?', fr: ['pains et baguettes congelés offerts ou non'], en: ['frozen bread and baguettes offered or not'] },
  { id: 'tartes', group: 'produits', q: 'Faites-vous des tartes?', fr: ['tartes offertes ou non'], en: ['tarts offered or not'] },
  { id: 'chocolatines', group: 'produits', q: 'Faites-vous des chocolatines?', fr: ['chocolatines offertes ou non'], en: ['chocolatines offered or not'] },
  { id: 'garniture-paris-brest', group: 'produits', q: 'La garniture de votre Paris-Brest', fr: ['garniture du Paris-Brest'], en: ['Paris-Brest filling'] },
  { id: 'garniture-vol-au-vent', group: 'produits', q: 'La garniture de votre vol-au-vent', fr: ['garniture du vol-au-vent'], en: ['vol-au-vent filling'] },
  { id: 'fait-sur-place', group: 'produits', q: 'Vos produits sont-ils faits au 3, rue Court?', fr: ['produits faits au 3, rue Court ou ailleurs'], en: ['products made at 3 rue Court or elsewhere'] },

  // Gâteaux
  { id: 'liste-gateaux', group: 'gateaux', q: 'Quels gâteaux, saveurs et décors offrez-vous?', fr: ['liste des gâteaux, saveurs et décors'], en: ['list of cakes, flavours and decorations'] },
  { id: 'portions-format', group: 'gateaux', q: 'Combien de portions par format de gâteau?', hint: 'ex. 6 po : 8 à 10 portions; 8 po : 12 à 16', fr: ['portions par format de gâteau'], en: ['servings per cake size'] },
  { id: 'prix-format', group: 'gateaux', q: 'Le prix des gâteaux par format', hint: 'ex. 6 po : 42 $; 8 po : 58 $', fr: ['prix des gâteaux par format'], en: ['cake prices per size'] },
  { id: 'grille-prix', group: 'gateaux', q: 'Votre grille de prix par format, avec sa date', fr: ['grille de prix par format, datée'], en: ['price grid per size, dated'] },
  { id: 'prix-plus-petit', group: 'gateaux', q: 'Le prix du plus petit format', fr: ['prix du plus petit format'], en: ['price of the smallest size'] },
  { id: 'portions-plus-petit', group: 'gateaux', q: 'Les portions du plus petit format', fr: ['portions du plus petit format'], en: ['servings of the smallest size'] },
  { id: 'plus-grand', group: 'gateaux', q: 'Le plus grand format offert', fr: ['plus grand format de gâteau offert'], en: ['largest cake size offered'] },
  { id: 'format-20', group: 'gateaux', q: 'Quel format pour 20 personnes?', fr: ['format pour 20 portions'], en: ['size for 20 servings'] },
  { id: 'format-prix-20', group: 'gateaux', q: 'Le format et le prix pour 20 personnes', fr: ['format et prix pour 20 portions'], en: ['size and price for 20 servings'] },
  { id: 'taille-portion', group: 'gateaux', q: 'La taille d’une portion, en centimètres', fr: ['taille d’une portion, en centimètres'], en: ['serving size, in centimetres'] },
  { id: 'portions-8po', group: 'gateaux', q: 'Combien de portions dans un gâteau de 8 po?', fr: ['portions d’un gâteau de 8 po selon la boutique'], en: ['servings in an 8-inch cake according to the shop'] },
  { id: 'supplements', group: 'gateaux', q: 'Les suppléments de décor et de saveur, et leur prix', fr: ['suppléments de décor et de saveur'], en: ['decoration and flavour supplements'] },
  { id: 'etages', group: 'gateaux', q: 'Faites-vous des gâteaux à étages?', fr: ['gâteaux à étages offerts ou non'], en: ['tiered cakes offered or not'] },
  { id: 'smash', group: 'gateaux', q: 'Faites-vous des « smash cakes »?', fr: ['smash cake offert ou non'], en: ['smash cake offered or not'] },
  { id: 'message', group: 'gateaux', q: 'Écrivez-vous un message sur le gâteau? Combien de lettres au maximum?', hint: 'ex. oui, 30 caractères au plus', fr: ['message écrit sur le gâteau offert ou non, longueur maximale', 'message sur le gâteau offert ou non, longueur maximale'], en: ['message on the cake offered or not, maximum length'] },
  { id: 'themes', group: 'gateaux', q: 'Quels thèmes offrez-vous, et acceptez-vous les personnages?', fr: ['politique pour les thèmes et les personnages', 'thèmes offerts et politique sur les personnages'], en: ['policy on themes and characters', 'themes offered and policy on characters'] },
  { id: 'prix-perso-min', group: 'gateaux', q: 'Le prix du plus petit gâteau personnalisé', fr: ['prix du plus petit gâteau personnalisé'], en: ['price of the smallest custom cake'] },
  { id: 'portions-min-max', group: 'gateaux', q: 'Gâteaux personnalisés : portions minimum et maximum', fr: ['portions minimum et maximum'], en: ['minimum and maximum servings'] },

  // Délais et commandes
  { id: 'delai-gateau', group: 'delais', q: 'Combien de jours d’avance pour commander chaque type de gâteau?', hint: 'ex. gâteau de la carte : 2 jours; gâteau personnalisé : 7 jours', fr: ['délai minimum par type de gâteau, en jours', 'délai minimum par type de gâteau'], en: ['minimum lead time per cake type, in days', 'minimum lead time per cake type'] },
  { id: 'delai-perso', group: 'delais', q: 'Gâteaux personnalisés : délai par type, en jours', fr: ['délai par type de gâteau personnalisé, en jours'], en: ['lead time per type of custom cake, in days'] },
  { id: 'delai-perso-min', group: 'delais', q: 'Le délai minimum d’un gâteau personnalisé', fr: ['délai minimum d’un gâteau personnalisé'], en: ['minimum lead time for a custom cake'] },
  { id: 'lendemain', group: 'delais', q: 'Gâteau pour le lendemain : oui ou non, et l’heure limite pour commander la veille', hint: 'ex. oui, gâteaux de la carte, commandés avant 14 h la veille', fr: ['commande pour le lendemain offerte ou non, et heure limite'], en: ['next-day orders offered or not, and cut-off time'] },
  { id: 'lendemain-heure', group: 'delais', q: 'L’heure limite pour commander un gâteau pour le lendemain', fr: ['heure limite de commande pour le lendemain'], en: [] },
  { id: 'lendemain-gateaux', group: 'delais', q: 'Quels gâteaux et formats pour le lendemain?', fr: ['gâteaux et formats offerts pour le lendemain'], en: [] },
  { id: 'lendemain-formats', group: 'delais', q: 'Quels formats pour le lendemain?', fr: ['formats offerts pour le lendemain'], en: [] },
  { id: 'lendemain-message', group: 'delais', q: 'Un message écrit est-il possible sur un gâteau pour le lendemain?', fr: ['message possible sur un gâteau pour le lendemain'], en: [] },
  { id: 'lendemain-perso', group: 'delais', q: 'Une personnalisation est-elle possible pour le lendemain?', fr: ['personnalisation possible pour le lendemain ou non'], en: [] },
  { id: 'delais-produits', group: 'delais', q: 'Les délais par produit et l’heure limite de commande', fr: ['délais par produit et heure limite de commande'], en: ['lead time per product and order cut-off time'] },
  { id: 'modif-acompte', group: 'delais', q: 'Jusqu’à quand le client peut-il modifier sa commande après l’acompte?', fr: ['délai de modification après l’acompte'], en: ['deadline for changes after the deposit'] },
  { id: 'reponse-demandes', group: 'delais', q: 'En combien de temps répondez-vous à une demande de gâteau?', hint: 'ex. dans les 2 jours ouvrables', fr: ['délai de réponse aux demandes'], en: ['response time for requests'] },
  { id: 'boites-groupes', group: 'delais', q: 'Boîtes de viennoiseries pour un groupe : quantité minimale et délai', fr: ['boîtes de viennoiseries pour groupes offertes ou non, quantité minimale et délai'], en: ['group viennoiserie boxes offered or not, minimum quantity and lead time'] },
  { id: 'pain-quantite', group: 'delais', q: 'Commandes de pain en quantité : minimum et délai', fr: ['commandes de pain en quantité, minimum et délai'], en: ['bulk bread orders, minimum and lead time'] },
  { id: 'patisseries-evenement', group: 'delais', q: 'Pâtisseries pour un événement : minimum et délai', fr: ['commandes de pâtisseries pour événements, minimum et délai'], en: ['pastry orders for events, minimum and lead time'] },
  { id: 'reservation-pain', group: 'delais', q: 'Peut-on réserver du pain pour le lendemain?', fr: ['réservation de pain pour le lendemain'], en: ['next-day bread reservations'] },
  { id: 'reservation-viennoiseries', group: 'delais', q: 'Peut-on réserver des viennoiseries pour le lendemain?', fr: ['réservation de viennoiseries pour le lendemain'], en: ['next-day viennoiserie reservations'] },
  { id: 'reservation-vitrine', group: 'delais', q: 'Peut-on réserver un produit de la vitrine?', fr: ['réservation des produits de la vitrine offerte ou non'], en: ['display-case reservations offered or not'] },

  // Fêtes et bûches
  { id: 'heures-fetes', group: 'fetes', q: 'Vos heures du temps des Fêtes 2026 (24 décembre au 2 janvier)', hint: 'Les jours fermés se mettent aussi dans Boutique & heures.', fr: ['heures des Fêtes 2026'], en: ['2026 holiday hours'] },
  { id: 'buches-oui-non', group: 'fetes', q: 'Offrez-vous des bûches de Noël en 2026?', fr: ['bûches offertes en 2026', 'bûches offertes, oui ou non, avant le 1er novembre'], en: [] },
  { id: 'buches-saveurs', group: 'fetes', q: 'Les saveurs de bûches', fr: ['saveurs de bûches'], en: [] },
  { id: 'buches-portions', group: 'fetes', q: 'Les portions par format de bûche', fr: ['portions par format de bûche'], en: [] },
  { id: 'buches-prix', group: 'fetes', q: 'Le prix des bûches par format', fr: ['prix des bûches par format'], en: [] },
  { id: 'buches-precommandes', group: 'fetes', q: 'Les dates d’ouverture et de fermeture des précommandes', fr: ['dates d’ouverture et de fermeture des précommandes'], en: [] },
  { id: 'buches-cueillette', group: 'fetes', q: 'Les dates de cueillette des bûches', fr: ['dates de cueillette des bûches'], en: [] },
  { id: 'buches-glacees', group: 'fetes', q: 'Offrez-vous des bûches glacées?', fr: ['bûches glacées offertes ou non'], en: [] },
  { id: 'liste-attente', group: 'fetes', q: 'Une liste d’attente quand les bûches sont épuisées?', fr: ['liste d’attente offerte ou non'], en: [] },

  // Boutique, accès et paiement
  { id: 'acces', group: 'boutique', q: 'L’entrée : marches, largeur de porte, accès en fauteuil roulant', hint: 'ex. une marche de 15 cm, porte de 80 cm, pas de rampe', fr: ['marches, largeur de porte et accès en fauteuil roulant'], en: ['steps, door width and wheelchair access'] },
  { id: 'repere', group: 'boutique', q: 'Un repère près de la porte que les clients reconnaissent', fr: ['repère visuel près de la boutique, approuvé par le propriétaire'], en: ['visual landmark near the shop, approved by the owner'] },
  { id: 'places', group: 'boutique', q: 'Combien de places assises?', fr: ['nombre de places assises'], en: ['number of seats'] },
  { id: 'paiement-comptoir', group: 'boutique', q: 'Paiements acceptés au comptoir (comptant, débit, crédit, dollars américains?)', fr: ['modes de paiement acceptés au comptoir', 'devises et modes de paiement acceptés au comptoir'], en: ['payment methods accepted at the counter', 'currencies and payment methods accepted at the counter'] },
  { id: 'paiement-cueillette', group: 'boutique', q: 'Une commande en ligne peut-elle se payer à la cueillette?', fr: ['paiement comptant ou par carte à la cueillette'], en: ['cash or card payment at pickup'] },
  { id: 'anglais', group: 'boutique', q: 'Qui sert la clientèle en anglais?', fr: ['personne qui sert la clientèle en anglais'], en: ['staff who serve customers in English'] },
  { id: 'heure-croissants', group: 'boutique', q: 'À quelle heure les croissants sortent-ils du four?', fr: ['heure de sortie des croissants le matin'], en: ['time the croissants are ready in the morning'] },
  { id: 'heure-baguettes', group: 'boutique', q: 'À quelle heure les baguettes sortent-elles du four?', fr: ['heure de sortie des baguettes'], en: ['time the baguettes are ready'] },
  { id: 'cuites-matin', group: 'boutique', q: 'Les viennoiseries sont-elles cuites le matin même?', fr: ['viennoiseries cuites le matin même ou non'], en: ['viennoiseries baked the same morning or not'] },
  { id: 'ateliers', group: 'boutique', q: 'Ateliers créatifs : à partir de quel âge, et à quelle heure?', fr: ['âges et heures de début des ateliers'], en: ['workshop ages and start times'] },
  { id: 'ouverture', group: 'boutique', q: 'Depuis quand la boutique est-elle ouverte au 3, rue Court?', fr: ['date d’ouverture de la boutique'], en: ['shop opening date'] },
  { id: 'marche-public', group: 'boutique', q: 'Étiez-vous au Marché public de Granby en 2026?', fr: ['présence au Marché public de Granby en 2026'], en: ['presence at the Marché public de Granby in 2026'] },

  // Allergènes et conservation
  { id: 'cuisine-allergenes', group: 'allergenes', q: 'Quels allergènes la cuisine manipule-t-elle, et quelles précautions prenez-vous?', fr: ['allergènes manipulés dans la cuisine et précautions contre la contamination croisée'], en: ['allergens handled in the kitchen and cross-contact precautions'] },
  { id: 'ingredients', group: 'allergenes', q: 'La liste des ingrédients de chaque produit', fr: ['liste des ingrédients par produit'], en: ['ingredient list per product'] },
  { id: 'sans-lait-oeufs', group: 'allergenes', q: 'Avez-vous des produits sans lait ou sans œufs?', fr: ['produits sans lait ou sans œufs, s’il y en a'], en: ['products without milk or eggs, if any'] },
  { id: 'affichage-allergenes', group: 'allergenes', q: 'Les allergènes sont-ils affichés au comptoir?', fr: ['affichage des allergènes en boutique'], en: ['allergen display in the shop'] },
  { id: 'conservation-gateaux', group: 'allergenes', q: 'Comment conserver un gâteau à la crème, et combien de temps?', fr: ['consignes de conservation des gâteaux à la crème'], en: ['storage instructions for cream cakes'] },
  { id: 'conservation-patisseries', group: 'allergenes', q: 'Comment conserver une pâtisserie à la crème, et combien de temps?', fr: ['consignes de conservation des pâtisseries à la crème'], en: ['storage instructions for cream pastries'] },

  // Équipe et histoire
  { id: 'proprietaires', group: 'equipe', q: 'Le nom et le rôle des propriétaires', fr: ['nom et rôle des propriétaires'], en: ['owners’ names and roles'] },
  { id: 'parcours', group: 'equipe', q: 'Le chef ou la propriétaire : nom, rôle, parcours (avec votre accord pour la photo)', fr: ['nom, rôle et parcours du chef ou de la propriétaire, avec consentement photo'], en: ['name, role and background of the chef or owner, with photo consent'] },
  { id: 'equipe', group: 'equipe', q: 'Les noms et rôles de l’équipe (avec l’accord de chacun)', fr: ['noms et rôles de l’équipe, avec consentement'], en: ['team names and roles, with consent'] },
  { id: 'chef-nom', group: 'equipe', q: 'Page du chef : son nom et son rôle', fr: ['nom et rôle du chef'], en: [] },
  { id: 'chef-presentation', group: 'equipe', q: 'Page du chef : sa présentation (avec son accord)', fr: ['nom, rôle et parcours, avec consentement'], en: [] },
  { id: 'chef-formation', group: 'equipe', q: 'Page du chef : sa formation et son parcours', fr: ['formation et parcours du chef'], en: [] },
  { id: 'chef-arrivee', group: 'equipe', q: 'Page du chef : son année d’arrivée', fr: ['année d’arrivée du chef'], en: [] },
  { id: 'chef-specialites', group: 'equipe', q: 'Page du chef : ses spécialités', fr: ['spécialités du chef'], en: [] },
  { id: 'chef-distinctions', group: 'equipe', q: 'Prix ou distinctions, avec une preuve datée', fr: ['prix ou distinctions, avec une preuve datée'], en: [] },
  { id: 'chef-rencontre', group: 'equipe', q: 'Peut-on rencontrer le chef pour un gâteau personnalisé?', fr: ['rencontre avec le chef offerte ou non'], en: [] },
  { id: 'equipe-production', group: 'equipe', q: 'L’équipe de production', fr: ['équipe de production'], en: [] },

  // Administratif
  { id: 'tps-tvq', group: 'admin', q: 'Vos numéros d’inscription à la TPS et à la TVQ', hint: 'Ils figurent sur vos reçus.', fr: ['numéros de TPS et de TVQ'], en: ['GST and QST numbers'] },
]

const norm = (s) => String(s || '').replace(/ /g, ' ').trim()

// label → fact id, per language.
const BY_LABEL = { fr: new Map(), en: new Map() }
for (const f of FACTS) for (const l of ['fr', 'en']) for (const label of f[l] || []) BY_LABEL[l].set(norm(label), f.id)

// The fact a slot belongs to; a slot the catalog does not know gets its own key, so it can still be answered.
export const factIdFor = (locale, label) => BY_LABEL[locale]?.get(norm(label)) || `autre:${locale}:${norm(label)}`

export const factById = (id) => FACTS.find((f) => f.id === id) || null
