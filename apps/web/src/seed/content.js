// Page copy per registry key (src/lib/routes.js). Québec French is the source; EN adapts it (Loi 96: never more complete).
// Contract (v1 §7, rank-first 02, 00 §10.1): title ≤ 60 characters, customer word first, brand last; description 140–160;
// h1 in the searcher's words; answer block 40–60 words with « Pâtisserie Coco Vanille » + Granby + one verified fact;
// 3–6 question-phrased sections whose first sentence answers; 5–8 FAQ from the objection bank (02 §5, 04 §5); change note.
// Facts come only from data/facts.json and the seed. Every owner fact not yet supplied stays a marker (zero invention).
// Checked by test/unit/content.test.js.
import { marker } from '../lib/facts.js'

const fn = marker
const UPDATED = '2026-10-25'

const s = (heading, answer, extra = {}) => ({
  heading,
  answer,
  ...(extra.body ? { body: extra.body } : {}),
  ...(extra.list ? { list: extra.list.map((item) => ({ item })) } : {}),
})
const q = (question, answer) => ({ question, answer })

// Québec typography: non-breaking space before « : » and inside guillemets (OQLF).
const NBSP = ' '
const frTypo = (value) => {
  if (typeof value === 'string') return value.replace(/ :/g, `${NBSP}:`).replace(/« /g, `«${NBSP}`).replace(/ »/g, `${NBSP}»`)
  if (Array.isArray(value)) return value.map(frTypo)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, frTypo(v)]))
  return value
}

const HOURS_FR = fn('heures d’ouverture confirmées par le propriétaire')
const HOURS_EN = fn('opening hours confirmed by the owner')
const DEPOSIT_FR = fn('pourcentage de l’acompte')
const DEPOSIT_EN = fn('deposit percentage')
const NEXT_DAY_FR = fn('commande pour le lendemain offerte ou non, et heure limite')
const NEXT_DAY_EN = fn('next-day orders offered or not, and cut-off time')
const DELIVERY_FR = fn('livraison offerte ou non, zones et frais')
const DELIVERY_EN = fn('delivery offered or not, areas and fees')
const PARKING_FR = fn('stationnement près du 3, rue Court (rues, terrains, tarifs)')
const PARKING_EN = fn('parking near 3 rue Court (streets, lots, rates)')

// ---------- Home ----------
const home = {
  key: 'home',
  status: 'core',
  locales: {
    fr: {
      title: 'Pâtisserie-boulangerie à Granby · Pâtisserie Coco Vanille',
      description: 'Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby : viennoiseries, pains et gâteaux sur commande. Carte, heures, commande et cueillette.',
      h1: 'Pâtisserie et boulangerie au centre-ville de Granby',
      answer:
        `La Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby, au 3, rue Court. Elle prépare des viennoiseries, des pains, des pâtisseries et des gâteaux sur commande, à récupérer en boutique. Pour joindre la Pâtisserie Coco Vanille, composez le 450-372-7177. Heures d’ouverture : ${HOURS_FR}.`,
      sections: [
        s('Que vend la Pâtisserie Coco Vanille?', 'La Pâtisserie Coco Vanille vend des viennoiseries, des pains et baguettes, des pâtisseries et des gâteaux sur commande. Sur sa page Facebook, la boutique résume son offre en une phrase : « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! »', {
          list: ['Viennoiseries, dont le croissant aux amandes', 'Pains, dont la baguette', 'Pâtisseries, dont le Paris-Brest et le vol-au-vent', 'Gâteaux, dont le gâteau aux framboises et le shortcake aux fraises'],
        }),
        s('Peut-on commander en ligne pour la cueillette?', 'Oui : la page Commander reçoit les commandes et les demandes de gâteau, pour une cueillette au 3, rue Court. Avant toute préparation, vous recevez un récapitulatif écrit avec les produits, la date de cueillette, le total et les taxes.'),
        s('Où se trouve la Pâtisserie Coco Vanille à Granby?', 'La Pâtisserie Coco Vanille se trouve au 3, rue Court, au centre-ville de Granby (Québec), code postal J2G 4Y6. Les itinéraires Google Maps et Plans, les heures et le stationnement sont sur la page Nous trouver.'),
        s('Pourquoi voit-on aussi le nom « Cocovanille »?', 'Les noms « Pâtisserie Cocovanille » et « Pâtisserie Coco Vanille » désignent la même boutique du 3, rue Court, à Granby. Google Maps et plusieurs annuaires l’écrivent en un mot; le registre des entreprises du Québec, la page Facebook et la presse l’écrivent en deux mots. Le téléphone, le 450-372-7177, est le même partout.'),
      ],
      faq: [
        q('La Pâtisserie Coco Vanille est-elle ouverte aujourd’hui?', `Le tableau des heures de cette page, tenu à jour par la boutique, donne la réponse : ${HOURS_FR}. En cas de doute, appelez au 450-372-7177 avant de vous déplacer.`),
        q('Peut-on avoir un gâteau pour demain?', `Ça dépend de l’heure limite de commande, que la boutique doit confirmer : ${NEXT_DAY_FR}. Le calendrier de la page Commander affiche seulement les dates que la boutique peut réellement préparer.`),
        q('Faites-vous la livraison?', `La commande en ligne prévoit la cueillette en boutique, au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
        q('Où se stationner près de la boutique?', `Les options de stationnement près du 3, rue Court sont décrites sur la page Nous trouver : ${PARKING_FR}.`),
        q('Avez-vous des produits sans gluten ou sans noix?', 'La Pâtisserie Coco Vanille ne présente aucun produit comme « sans gluten » ou « sans noix » : ces mentions sont encadrées par la réglementation. Les allergènes de chaque produit, vérifiés par une personne de l’équipe, sont sur la page Allergènes; en cas d’allergie grave, appelez avant de commander.'),
        q('Peut-on payer par carte?', `En ligne, oui : le paiement se fait par carte sur la page sécurisée du processeur de paiement, et le numéro de carte n’est jamais conservé par la boutique. En boutique : ${fn('modes de paiement acceptés au comptoir')}.`),
        q('Parlez-vous anglais?', `Le site de la Pâtisserie Coco Vanille est offert en français et en anglais. Service en anglais au comptoir : ${fn('personne qui sert la clientèle en anglais')}.`),
      ],
      changeNote: 'Première version du site : heures, prix et délais à confirmer par la boutique.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Pastry shop and bakery in Granby, Québec · Coco Vanille',
      description: 'Pâtisserie Coco Vanille, 3 rue Court in downtown Granby, Québec: viennoiseries, bread, pastries and cakes to order. Menu, hours and ordering for pickup.',
      h1: 'Pastry shop and bakery in downtown Granby',
      answer:
        `Pâtisserie Coco Vanille is a pastry shop and bakery in downtown Granby, Québec, at 3 rue Court. It makes viennoiseries, bread, pastries and cakes to order, for pickup at the shop. To reach Pâtisserie Coco Vanille, call 450-372-7177. Opening hours: ${HOURS_EN}.`,
      sections: [
        s('What does Pâtisserie Coco Vanille sell?', 'Pâtisserie Coco Vanille sells viennoiseries, bread and baguettes, pastries and cakes to order. On its Facebook page, the shop sums up its offer in one French sentence: « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! » (a wide variety of pastries, cakes and bread).', {
          list: ['Viennoiseries, including the almond croissant', 'Bread, including the baguette', 'Pastries, including the Paris-Brest and the vol-au-vent', 'Cakes, including the raspberry cake and the strawberry shortcake'],
        }),
        s('Can I order online for pickup?', 'Yes: the Order page takes orders and cake requests for pickup at 3 rue Court. Before anything is made, you receive a written summary with the products, the pickup date, the total and the taxes.'),
        s('Where is Pâtisserie Coco Vanille in Granby?', 'Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec, postal code J2G 4Y6. Google Maps and Apple Maps directions, hours and parking are on the Visit page.'),
        s('Why do some maps say “Cocovanille”?', '“Pâtisserie Cocovanille” and “Pâtisserie Coco Vanille” are the same shop at 3 rue Court, Granby. Google Maps and several directories write it as one word; the Québec business registry, the Facebook page and the press write it as two. The phone number, 450-372-7177, is the same everywhere.'),
      ],
      faq: [
        q('Is Pâtisserie Coco Vanille open today?', `The hours table on this page, kept up to date by the shop, has the answer: ${HOURS_EN}. If in doubt, call 450-372-7177 before you head over.`),
        q('Can I get a cake for tomorrow?', `It depends on the order cut-off time, which the shop still has to confirm: ${NEXT_DAY_EN}. The calendar on the Order page only shows dates the shop can actually prepare.`),
        q('Do you deliver?', `Online orders are picked up at the shop, 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
        q('Where can I park?', `Parking near 3 rue Court is described on the Visit page: ${PARKING_EN}.`),
        q('Do you have gluten-free or nut-free products?', 'Pâtisserie Coco Vanille does not label any product “gluten-free” or “nut-free”: those claims are regulated. Each product’s allergens, checked by a team member, are on the Allergens page; if you have a severe allergy, call before you order.'),
        q('Do you accept US or foreign credit cards?', `Online, payment is made by card on the payment processor’s secure page, and the shop never stores your card number. Cards accepted in store: ${fn('payment methods accepted at the counter')}.`),
        q('Do you speak English in the shop?', `This website is in French and English. English service at the counter: ${fn('staff who serve customers in English')}.`),
      ],
      changeNote: 'First version of the site: hours, prices and lead times to be confirmed by the shop.',
      contentUpdatedAt: UPDATED,
    },
  },
}

// ---------- Menu hub ----------
const carte = {
  key: 'carte',
  status: 'core',
  locales: {
    fr: {
      title: 'Carte : viennoiseries, pains et gâteaux · Coco Vanille',
      description: 'La carte de la Pâtisserie Coco Vanille à Granby : viennoiseries, pains et baguettes, pâtisseries et gâteaux, avec formats, prix et allergènes affichés en texte.',
      h1: 'Carte : viennoiseries, pains, pâtisseries et gâteaux à Granby',
      answer:
        'La carte de la Pâtisserie Coco Vanille, à Granby, réunit quatre familles de produits : viennoiseries, pains et baguettes, pâtisseries et gâteaux. Chaque produit a sa propre page avec ses formats, ses portions, son prix écrit en texte et ses allergènes vérifiés. Tout se récupère au 3, rue Court, au centre-ville.',
      sections: [
        s('Que trouve-t-on sur la carte de la Pâtisserie Coco Vanille?', `La carte de la Pâtisserie Coco Vanille présente des viennoiseries, des pains et baguettes, des pâtisseries et des gâteaux, classés par famille, avec un lien vers la page de chaque produit. Les produits listés ici sont ceux relevés jusqu’ici; la liste complète reste à confirmer : ${fn('liste complète des produits confirmée par le propriétaire')}.`),
        s('Les prix sont-ils affichés sur la carte?', 'Oui : chaque prix est écrit en texte, avant taxes, sans frais ajoutés en ligne. Un prix que la boutique n’a pas encore confirmé est signalé comme tel, jamais estimé. La page Prix réunit tous les formats dans un tableau daté.'),
        s('Comment savoir ce qu’il reste en vitrine aujourd’hui?', 'La vitrine du jour, sur la page d’accueil, liste les produits que l’équipe inscrit pour la journée. Un produit vendu porte la mention « Épuisé aujourd’hui » sur sa page comme sur la carte.'),
        s('Où voir les allergènes de chaque produit?', 'Les allergènes de chaque produit sont sur sa page et dans le tableau de la page Allergènes, une fois vérifiés par une personne de l’équipe. Tant que cette vérification n’est pas faite, la page le dit au lieu d’afficher une liste incomplète.'),
      ],
      faq: [
        q('Les produits changent-ils selon la saison?', `Chaque produit saisonnier a une page permanente qui indique son état : bientôt offert, en précommande, complet ou de retour plus tard. Produits saisonniers : ${fn('produits saisonniers offerts')}.`),
        q('Peut-on réserver un produit de la vitrine?', `La réservation de la vitrine reste à confirmer par la boutique : ${fn('réservation des produits de la vitrine offerte ou non')}. Les gâteaux et les produits avec un délai de préparation se commandent sur la page Commander.`),
        q('Les prix incluent-ils les taxes?', 'Non : les prix sont affichés avant taxes, et la TPS et la TVQ s’ajoutent seulement s’il y a lieu, selon le produit et la quantité. Le total avec chaque taxe est affiché avant le paiement.'),
        q('Vendez-vous du pain congelé?', `Le pain et les baguettes congelés restent à confirmer par la boutique : ${fn('pains et baguettes congelés offerts ou non')}.`),
        q('Servez-vous du café sur place?', `Le café et les places assises restent à confirmer par la boutique : ${fn('café offert ou non, et nombre de places assises')}.`),
        q('Peut-on commander un produit pour une date précise?', 'Oui : la page Commander propose les dates et les heures de cueillette que la boutique peut préparer pour l’ensemble de votre commande.'),
      ],
      changeNote: 'Première version de la carte : liste des produits et prix à confirmer.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Menu: viennoiseries, bread and cakes · Coco Vanille',
      description: 'The menu of Pâtisserie Coco Vanille in Granby, Québec: viennoiseries, bread and baguettes, pastries and cakes, with sizes, prices and allergens shown as text.',
      h1: 'Menu: viennoiseries, bread, pastries and cakes in Granby',
      answer:
        'The menu of Pâtisserie Coco Vanille in Granby, Québec, has four families of products: viennoiseries, bread and baguettes, pastries and cakes. Each product has its own page with its sizes, servings, price written as text and allergens checked by a person. Everything is picked up at 3 rue Court, downtown.',
      sections: [
        s('What is on the Pâtisserie Coco Vanille menu?', `The Pâtisserie Coco Vanille menu lists viennoiseries, bread and baguettes, pastries and cakes, grouped by family, with a link to each product page. The products listed here are the ones found so far; the full list is still to be confirmed: ${fn('full product list confirmed by the owner')}.`),
        s('Are prices shown on the menu?', 'Yes: every price is written as text, before taxes, with no fees added online. A price the shop has not confirmed yet is flagged as such, never estimated. The Prices page brings every size into one dated table.'),
        s('How do I know what is left in the display case today?', 'Today’s display case, on the home page, lists the products the team enters for the day. A product that has sold out says “Sold out today” on its page and on the menu.'),
        s('Where are the allergens for each product?', 'Each product’s allergens are on its page and in the Allergens table, once a team member has checked them. Until that check is done, the page says so instead of showing an incomplete list.'),
      ],
      faq: [
        q('Does the menu change with the seasons?', `Each seasonal product has a permanent page that shows its state: coming soon, open for pre-order, sold out or back later. Seasonal products: ${fn('seasonal products offered')}.`),
        q('Can I reserve something from the display case?', `Display-case reservations are still to be confirmed by the shop: ${fn('display-case reservations offered or not')}. Cakes and products with a lead time are ordered on the Order page.`),
        q('Do prices include taxes?', 'No: prices are shown before taxes, and GST and QST are added only where they apply, depending on the product and quantity. The total with each tax is shown before you pay.'),
        q('Do you sell frozen bread?', `Frozen bread and baguettes are still to be confirmed by the shop: ${fn('frozen bread and baguettes offered or not')}.`),
        q('Do you serve coffee in the shop?', `Coffee and seating are still to be confirmed by the shop: ${fn('coffee offered or not, and number of seats')}.`),
        q('Can I order a product for a specific date?', 'Yes: the Order page offers the dates and pickup times the shop can prepare for your whole order.'),
      ],
      changeNote: 'First version of the menu: product list and prices to be confirmed.',
      contentUpdatedAt: UPDATED,
    },
  },
}

// ---------- Order (the ordering module renders the form under this copy) ----------
const commander = {
  key: 'commander',
  status: 'core',
  locales: {
    fr: {
      title: 'Commande en ligne et cueillette à Granby · Coco Vanille',
      description: 'Commandez en ligne à la Pâtisserie Coco Vanille, à Granby : gâteaux, viennoiseries et pains à récupérer au 3, rue Court, avec un récapitulatif écrit.',
      h1: 'Commander en ligne à Granby, pour la cueillette',
      answer:
        `La Pâtisserie Coco Vanille, à Granby, reçoit les commandes en ligne pour une cueillette en boutique au 3, rue Court. Vous choisissez vos produits, la date et l’heure de cueillette, puis vous recevez un récapitulatif écrit avant la préparation. Délais de préparation et heure limite : ${fn('délais par produit et heure limite de commande')}.`,
      sections: [
        s('Comment se passe une commande en ligne?', 'Une commande en ligne à la Pâtisserie Coco Vanille se fait en six étapes, du choix des produits jusqu’à la confirmation écrite, qui sert de copie du contrat.', {
          list: [
            'Choisir les produits et les ajouter à « Ma boîte »',
            'Choisir la date, puis une des plages de cueillette proposées',
            'Vérifier le récapitulatif : produits, date, total, TPS et TVQ',
            'Accepter les conditions de vente en cochant la case',
            'Payer sur la page sécurisée du processeur de paiement',
            'Recevoir la confirmation par courriel, en français d’abord',
          ],
        }),
        s('Où et quand récupérer ma commande?', 'Votre commande se récupère au 3, rue Court, à Granby, pendant la plage de cueillette choisie. Donnez le numéro de commande de votre confirmation au comptoir. La boutique ne déplace jamais une date confirmée sans votre accord.'),
        s('Comment commander un gâteau personnalisé?', `Un gâteau personnalisé commence par une demande : photo de référence, nombre d’invités, date et message. La boutique répond avec un prix; un acompte de ${DEPOSIT_FR} réserve la date, et la préparation commence après votre approbation du récapitulatif.`),
        s('Quels frais s’ajoutent au prix affiché?', 'Aucun frais ne s’ajoute au prix affiché : ni frais de service, ni frais d’emballage, ni frais de carte. Seules la TPS et la TVQ s’ajoutent, s’il y a lieu, et le prix est le même quel que soit le mode de paiement.'),
        s('Comment annuler ou changer la date d’une commande?', 'Pour annuler ou changer une date, appelez la boutique au 450-372-7177; les conditions de vente précisent les délais et le sort de l’acompte. Si la boutique ne peut pas honorer une commande, vous choisissez une autre plage de cueillette ou un remboursement complet, versé dans les 15 jours.'),
      ],
      faq: [
        q('C’est-tu possible d’avoir un gâteau pour demain?', `Ça dépend de l’heure limite, que la boutique doit confirmer : ${NEXT_DAY_FR}. Le calendrier de commande affiche seulement les dates réellement possibles.`),
        q('Combien de jours d’avance faut-il commander un gâteau?', `Le délai dépend du gâteau : ${fn('délai minimum par type de gâteau, en jours')}. Chaque page de produit affiche son délai, et le calendrier propose la première date possible.`),
        q('Faut-il verser un acompte?', `Pour un gâteau personnalisé, un acompte de ${DEPOSIT_FR} est demandé après l’acceptation de la soumission; le solde se paie à la cueillette. Le montant de l’acompte et le solde sont écrits dans le récapitulatif avant le paiement.`),
        q('Est-ce que mon gâteau va ressembler à la photo?', 'Vous joignez votre photo de référence à la demande, puis vous recevez un récapitulatif écrit : format, saveur, couleurs et message. La préparation commence seulement après votre approbation.'),
        q('Faites-vous la livraison?', `La commande en ligne prévoit la cueillette au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
        q('Puis-je commander par téléphone?', 'Oui : appelez la boutique au 450-372-7177. Les commandes prises par téléphone entrent dans le même calendrier que les commandes en ligne, avec les mêmes dates possibles.'),
        q('Comment payer ma commande en ligne?', 'Le paiement en ligne se fait par carte, sur la page sécurisée du processeur de paiement : le numéro de carte n’arrive jamais sur les serveurs de la boutique. Le montant exact est écrit sur le bouton de paiement.'),
        q('Que se passe-t-il si j’arrive après ma plage de cueillette?', `Appelez la boutique au 450-372-7177 pour convenir d’une autre heure. Commandes non récupérées : ${fn('politique pour les commandes non récupérées')}.`),
      ],
      changeNote: 'Première version : le formulaire de commande s’affiche sous ce texte; délais et acompte à confirmer.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Order online for pickup in Granby, Québec · Coco Vanille',
      description: 'Order online from Pâtisserie Coco Vanille in Granby, Québec: cakes, viennoiseries and bread for pickup at 3 rue Court, with a written summary first.',
      h1: 'Order online in Granby, for pickup at the shop',
      answer:
        `Pâtisserie Coco Vanille in Granby, Québec, takes online orders for pickup at the shop, 3 rue Court. You choose your products, the date and a pickup time, then you receive a written summary before anything is made. Lead times and cut-off time: ${fn('lead time per product and order cut-off time')}.`,
      sections: [
        s('How does an online order work?', 'An online order at Pâtisserie Coco Vanille takes six steps, from choosing products to the written confirmation, which is your copy of the contract.', {
          list: [
            'Choose products and add them to “My box”',
            'Pick a date, then one of the pickup slots offered',
            'Check the summary: products, date, total, GST and QST',
            'Accept the conditions of sale by ticking the box',
            'Pay on the payment processor’s secure page',
            'Receive the confirmation email, French version first',
          ],
        }),
        s('Where and when do I pick up my order?', 'Your order is picked up at 3 rue Court, Granby, during the pickup slot you chose. Give the order number from your confirmation at the counter. The shop never moves a confirmed date without your agreement.'),
        s('How do I order a custom cake?', `A custom cake starts with a request: a reference photo, the number of guests, the date and the message. The shop replies with a price; a deposit of ${DEPOSIT_EN} holds the date, and baking starts once you approve the written summary.`),
        s('What fees are added to the price shown?', 'No fees are added to the price shown: no service fee, no packaging fee, no card fee. Only GST and QST are added where they apply, and the price is the same whatever the payment method.'),
        s('How do I cancel or change the date of an order?', 'To cancel or change a date, call the shop at 450-372-7177; the conditions of sale set out the deadlines and what happens to the deposit. If the shop cannot fill an order, you choose another pickup slot or a full refund, paid within 15 days.'),
      ],
      faq: [
        q('Can I get a cake for tomorrow?', `It depends on the cut-off time, which the shop still has to confirm: ${NEXT_DAY_EN}. The order calendar only shows dates that are actually possible.`),
        q('How far in advance should I order a cake?', `It depends on the cake: ${fn('minimum lead time per cake type, in days')}. Each product page shows its lead time, and the calendar offers the first possible date.`),
        q('Is a deposit required?', `For a custom cake, a deposit of ${DEPOSIT_EN} is requested once you accept the quote; the balance is paid at pickup. The deposit and the balance are written in the summary before you pay.`),
        q('Will my cake look like the photo?', 'You attach your reference photo to the request, then you receive a written summary: size, flavour, colours and message. Baking starts only after you approve it.'),
        q('Do you deliver?', `Online orders are picked up at 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
        q('Can I order by phone?', 'Yes: call the shop at 450-372-7177. Phone orders go into the same calendar as online orders, with the same available dates.'),
        q('Can I pre-order pastries for pickup on the way to the Zoo?', `Yes, when the products have pickup slots that day: order online, then pick up at 3 rue Court during your slot. Driving time from the Granby Zoo: ${fn('driving time from the Granby Zoo to 3 rue Court')}.`),
        q('What if I arrive after my pickup slot?', `Call the shop at 450-372-7177 to agree on another time. Orders not picked up: ${fn('policy for orders not picked up')}.`),
      ],
      changeNote: 'First version: the order form appears below this text; lead times and deposit to be confirmed.',
      contentUpdatedAt: UPDATED,
    },
  },
}

// ---------- Visit ----------
const nousTrouver = {
  key: 'nous-trouver',
  status: 'core',
  locales: {
    fr: {
      title: 'Heures et adresse : 3, rue Court, Granby · Coco Vanille',
      description: 'Adresse, heures et stationnement de la Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby. Itinéraire Google Maps ou Plans et téléphone.',
      h1: 'Nous trouver au 3, rue Court, au centre-ville de Granby',
      answer:
        `La Pâtisserie Coco Vanille est au 3, rue Court, au centre-ville de Granby, au Québec. Pour joindre la Pâtisserie Coco Vanille, composez le 450-372-7177. Cette page donne l’adresse complète, les heures d’ouverture, le stationnement et les itinéraires vers la boutique. Heures : ${HOURS_FR}.`,
      sections: [
        s('Quelles sont les heures d’ouverture de la Pâtisserie Coco Vanille?', `Les heures d’ouverture de la Pâtisserie Coco Vanille sont celles du tableau de cette page, tenu à jour par la boutique : ${HOURS_FR}. Les annuaires en ligne affichent des horaires qui se contredisent; le tableau de cette page fait foi.`),
        s('Comment se rendre au 3, rue Court?', `Le 3, rue Court est au centre-ville de Granby; les boutons Itinéraire ouvrent l’adresse dans Google Maps ou dans Plans d’Apple. Repère pour trouver la porte : ${fn('repère visuel près de la boutique, approuvé par le propriétaire')}.`),
        s('Où se stationner près de la Pâtisserie Coco Vanille?', `Le stationnement près du 3, rue Court reste à décrire par la boutique : ${PARKING_FR}.`),
        s('À quelle distance du Zoo de Granby est la boutique?', `La durée du trajet en auto entre le Zoo de Granby et le 3, rue Court reste à mesurer : ${fn('minutes en auto du Zoo de Granby au 3, rue Court')}. Pour un arrêt en route, la commande en ligne permet de choisir une heure de cueillette.`),
        s('Comment joindre la boutique?', `Par téléphone, au 450-372-7177. Par courriel : ${fn('adresse courriel de la boutique')}.`),
      ],
      faq: [
        q('Êtes-vous ouverts le dimanche?', `Les heures du dimanche sont dans le tableau des heures de cette page : ${HOURS_FR}.`),
        q('Êtes-vous ouverts pendant le temps des Fêtes?', `Les heures des jours fériés et du temps des Fêtes sont publiées sur cette page avant chaque congé : ${fn('heures des Fêtes 2026')}.`),
        q('Y a-t-il des places assises?', `Les places assises restent à confirmer par la boutique : ${fn('nombre de places assises')}.`),
        q('La boutique est-elle accessible en fauteuil roulant?', `L’accès en fauteuil roulant reste à décrire par la boutique : ${fn('marches, largeur de porte et accès en fauteuil roulant')}.`),
        q('Pourquoi Google Maps écrit-il « Cocovanille »?', 'Google Maps écrit « Pâtisserie Cocovanille » en un mot, mais c’est bien la même boutique : la Pâtisserie Coco Vanille, au 3, rue Court, à Granby, au 450-372-7177.'),
        q('Livrez-vous à Bromont ou à Waterloo?', `La commande en ligne prévoit la cueillette au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
      ],
      changeNote: 'Première version : heures, stationnement et accès à confirmer par la boutique.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Hours and address: 3 rue Court, Granby · Coco Vanille',
      description: 'Address, opening hours and parking for Pâtisserie Coco Vanille at 3 rue Court in downtown Granby, Québec. Google Maps or Apple Maps directions and phone number.',
      h1: 'Visit us at 3 rue Court, in downtown Granby',
      answer:
        `Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec. To reach Pâtisserie Coco Vanille, call 450-372-7177. This page gives the full address, opening hours, parking and directions to the shop, including from the Granby Zoo. Hours: ${HOURS_EN}.`,
      sections: [
        s('What are Pâtisserie Coco Vanille’s opening hours?', `Pâtisserie Coco Vanille’s opening hours are the ones in the table on this page, kept up to date by the shop: ${HOURS_EN}. Online directories show schedules that contradict each other; the table on this page is the reference.`),
        s('How do I get to 3 rue Court?', `3 rue Court is in downtown Granby; the Directions buttons open the address in Google Maps or Apple Maps. Landmark to find the door: ${fn('visual landmark near the shop, approved by the owner')}.`),
        s('Where can I park near Pâtisserie Coco Vanille?', `Parking near 3 rue Court is still to be described by the shop: ${PARKING_EN}.`),
        s('How far is the shop from the Granby Zoo?', `The driving time from the Granby Zoo to 3 rue Court is still to be measured: ${fn('minutes by car from the Granby Zoo to 3 rue Court')}. To stop on your way, online ordering lets you choose a pickup time.`),
        s('How do I contact the shop?', `By phone at 450-372-7177. By email: ${fn('shop email address')}.`),
      ],
      faq: [
        q('Are you open on Sunday?', `Sunday hours are in the hours table on this page: ${HOURS_EN}.`),
        q('Are you open over the holidays?', `Holiday and statutory-holiday hours are posted on this page before each holiday: ${fn('2026 holiday hours')}.`),
        q('Is there seating?', `Seating is still to be confirmed by the shop: ${fn('number of seats')}.`),
        q('Is the shop wheelchair accessible?', `Wheelchair access is still to be described by the shop: ${fn('steps, door width and wheelchair access')}.`),
        q('Why does Google Maps say “Cocovanille”?', 'Google Maps writes “Pâtisserie Cocovanille” as one word, but it is the same shop: Pâtisserie Coco Vanille, 3 rue Court, Granby, 450-372-7177.'),
        q('Do you accept US dollars?', `Payment methods accepted at the counter are still to be confirmed: ${fn('currencies and payment methods accepted at the counter')}.`),
      ],
      changeNote: 'First version: hours, parking and access to be confirmed by the shop.',
      contentUpdatedAt: UPDATED,
    },
  },
}

// ---------- About ----------
const aPropos = {
  key: 'a-propos',
  status: 'core',
  locales: {
    fr: {
      title: 'À propos : pâtisserie-boulangerie à Granby · Coco Vanille',
      description: 'Qui est la Pâtisserie Coco Vanille? Une pâtisserie-boulangerie du 3, rue Court, à Granby, immatriculée au Québec en 2021 : histoire, équipe et faits.',
      h1: 'À propos de la Pâtisserie Coco Vanille, à Granby',
      answer:
        `La Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby, au 3, rue Court : viennoiseries, pains et gâteaux sur commande. L’entreprise Pâtisserie Coco Vanille inc. est immatriculée au Québec depuis le 9 novembre 2021, sous le numéro 1177082220. Équipe : ${fn('noms et rôles de l’équipe, avec consentement')}.`,
      sections: [
        s('Qui est la Pâtisserie Coco Vanille?', 'La Pâtisserie Coco Vanille est une pâtisserie-boulangerie de Granby exploitée par l’entreprise Pâtisserie Coco Vanille inc., inscrite au registre des entreprises du Québec dans l’activité « Boulangeries et pâtisseries ». La boutique décrit elle-même son offre ainsi : « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! »'),
        s('Depuis quand la Pâtisserie Coco Vanille existe-t-elle?', `L’entreprise est immatriculée au Québec depuis le 9 novembre 2021. Date d’ouverture de la boutique du 3, rue Court : ${fn('date d’ouverture de la boutique')}.`),
        s('Qui prépare les gâteaux et les viennoiseries?', `L’équipe de la Pâtisserie Coco Vanille sera présentée ici avec l’accord de chaque personne : ${fn('nom, rôle et parcours du chef ou de la propriétaire, avec consentement photo')}.`),
        s('Où a-t-on parlé de la Pâtisserie Coco Vanille?', 'En 2022, Radio-Canada nommait la Pâtisserie Coco Vanille parmi les commerçants du centre-ville de Granby qui vendaient au kiosque du Marché public pendant les travaux de la rue Principale. Le 23 octobre 2022, La Voix de l’Est mentionnait ses prêts-à-manger au Marché public.'),
        s('Pourquoi deux graphies, Coco Vanille et Cocovanille?', 'Les deux graphies désignent la même entreprise. « Pâtisserie Coco Vanille », en deux mots, est le nom inscrit au registre des entreprises et sur la page Facebook; « Pâtisserie Cocovanille », en un mot, est la graphie de Google Maps et de plusieurs annuaires.'),
      ],
      faq: [
        q('Que sait-on de la Pâtisserie Coco Vanille à Granby?', 'La Pâtisserie Coco Vanille est une pâtisserie-boulangerie du 3, rue Court, au centre-ville de Granby, joignable au 450-372-7177. Elle est exploitée par Pâtisserie Coco Vanille inc., immatriculée au Québec le 9 novembre 2021 (numéro 1177082220).'),
        q('Qui est propriétaire de la Pâtisserie Coco Vanille?', `Le nom des propriétaires sera publié avec leur accord : ${fn('nom et rôle des propriétaires')}.`),
        q('La Pâtisserie Coco Vanille est-elle au Marché public de Granby?', `La participation au Marché public en 2026 reste à confirmer par la boutique : ${fn('présence au Marché public de Granby en 2026')}.`),
        q('Les produits sont-ils faits à la boutique?', `Le lieu de fabrication reste à confirmer par la boutique : ${fn('produits faits au 3, rue Court ou ailleurs')}.`),
        q('Où voir des photos de la boutique?', 'Les photos publiées par la boutique sont sur sa page Facebook, facebook.com/PatisserieCocoVanille. Ce site ne montre que de vraies photos de la boutique et de ses produits, datées.'),
        q('Comment joindre la Pâtisserie Coco Vanille?', `Par téléphone, au 450-372-7177, ou en personne au 3, rue Court, à Granby. Courriel : ${fn('adresse courriel de la boutique')}.`),
      ],
      changeNote: 'Première version : faits du registre des entreprises et de la presse; équipe à présenter avec son accord.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'About: pastry shop and bakery in Granby · Coco Vanille',
      description: 'Who is Pâtisserie Coco Vanille? A pastry shop and bakery at 3 rue Court, Granby, Québec, registered in Québec since 2021: its story, team and facts.',
      h1: 'About Pâtisserie Coco Vanille, in Granby',
      answer:
        `Pâtisserie Coco Vanille is a pastry shop and bakery in downtown Granby, Québec, at 3 rue Court: viennoiseries, bread and cakes to order. The company, Pâtisserie Coco Vanille inc., has been registered in Québec since November 9, 2021, under number 1177082220. Team: ${fn('team names and roles, with consent')}.`,
      sections: [
        s('Who is Pâtisserie Coco Vanille?', 'Pâtisserie Coco Vanille is a Granby pastry shop and bakery run by the company Pâtisserie Coco Vanille inc., listed in the Québec business registry under the activity “Bakeries and pastry shops”. The shop describes its own offer in French: « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! » (a wide variety of pastries, cakes and bread).'),
        s('How long has Pâtisserie Coco Vanille been around?', `The company has been registered in Québec since November 9, 2021. Opening date of the shop at 3 rue Court: ${fn('shop opening date')}.`),
        s('Who makes the cakes and viennoiseries?', `The Pâtisserie Coco Vanille team will be introduced here with each person’s consent: ${fn('name, role and background of the chef or owner, with photo consent')}.`),
        s('Where has Pâtisserie Coco Vanille been mentioned?', 'In 2022, Radio-Canada named Pâtisserie Coco Vanille among the downtown Granby merchants selling at the Marché public kiosk while rue Principale was under construction. On October 23, 2022, La Voix de l’Est mentioned its ready-to-eat dishes at the Marché public.'),
        s('Why two spellings, Coco Vanille and Cocovanille?', 'Both spellings name the same business. “Pâtisserie Coco Vanille”, in two words, is the name in the business registry and on the Facebook page; “Pâtisserie Cocovanille”, in one word, is how Google Maps and several directories write it.'),
      ],
      faq: [
        q('What is Pâtisserie Coco Vanille in Granby known for?', 'Pâtisserie Coco Vanille is a pastry shop and bakery at 3 rue Court in downtown Granby, reachable at 450-372-7177, selling viennoiseries, bread, pastries and cakes to order. It is run by Pâtisserie Coco Vanille inc., registered in Québec on November 9, 2021 (number 1177082220).'),
        q('Who owns Pâtisserie Coco Vanille?', `The owners’ names will be published with their consent: ${fn('owners’ names and roles')}.`),
        q('Is Pâtisserie Coco Vanille at the Granby public market?', `Taking part in the Marché public in 2026 is still to be confirmed by the shop: ${fn('presence at the Marché public de Granby in 2026')}.`),
        q('Are the products made in the shop?', `Where the products are made is still to be confirmed by the shop: ${fn('products made at 3 rue Court or elsewhere')}.`),
        q('Where can I see photos of the shop?', 'Photos posted by the shop are on its Facebook page, facebook.com/PatisserieCocoVanille. This site only shows real, dated photos of the shop and its products.'),
        q('How do I contact Pâtisserie Coco Vanille?', `By phone at 450-372-7177, or in person at 3 rue Court, Granby. Email: ${fn('shop email address')}.`),
      ],
      changeNote: 'First version: facts from the business registry and the press; team to be introduced with consent.',
      contentUpdatedAt: UPDATED,
    },
  },
}

// ---------- Allergens ----------
const allergenes = {
  key: 'allergenes',
  status: 'core',
  locales: {
    fr: {
      title: 'Allergies et allergènes à Granby · Pâtisserie Coco Vanille',
      description: 'Allergènes de chaque produit de la Pâtisserie Coco Vanille, à Granby, vérifiés par une personne. Aucune allégation « sans gluten ». Appelez avant de commander.',
      h1: 'Allergènes et allergies alimentaires',
      answer:
        'La Pâtisserie Coco Vanille, à Granby, indique pour chaque produit les allergènes prioritaires qu’il contient, une fois la liste vérifiée par une personne de l’équipe. La boutique ne fait aucune allégation « sans gluten », « sans noix » ou « sans arachides ». En cas d’allergie, appelez au 450-372-7177 avant de commander.',
      sections: [
        s('Quels allergènes la Pâtisserie Coco Vanille indique-t-elle?', 'La Pâtisserie Coco Vanille indique les allergènes prioritaires reconnus par Santé Canada et l’Agence canadienne d’inspection des aliments, plus les sources de gluten.', {
          list: ['Œufs', 'Lait', 'Moutarde', 'Arachides', 'Crustacés et mollusques', 'Poisson', 'Sésame', 'Soya', 'Sulfites', 'Noix', 'Blé et triticale', 'Sources de gluten : orge, avoine, seigle'],
        }),
        s('Avez-vous des produits sans gluten ou sans noix?', 'La Pâtisserie Coco Vanille ne présente aucun produit comme « sans gluten », « sans noix » ou « sans arachides ». Au Canada, « sans gluten » est une allégation encadrée : le produit ne doit contenir aucune protéine de gluten, et le gluten venu d’une contamination croisée doit rester sous 20 ppm.'),
        s('Y a-t-il un risque de contamination croisée?', `Le risque dépend des ingrédients manipulés dans la même cuisine, que la boutique doit confirmer : ${fn('allergènes manipulés dans la cuisine et précautions contre la contamination croisée')}. La mention « Peut contenir » n’apparaît que lorsqu’un risque réel demeure.`),
        s('Comment les allergènes sont-ils vérifiés?', 'Chaque liste d’allergènes est vérifiée et datée par une personne de l’équipe, jamais générée automatiquement. Tant qu’un produit n’est pas vérifié, sa page le dit au lieu d’afficher une liste incomplète.'),
        s('Que faire en cas d’allergie grave?', 'Appelez la boutique au 450-372-7177 avant de commander pour parler des ingrédients et de la préparation. Dans le formulaire de commande, la note d’allergie est facultative et sert seulement à préparer votre commande.'),
      ],
      faq: [
        q('Le croissant aux amandes contient-il des noix?', 'Oui : l’amande fait partie des noix, un des allergènes prioritaires. La liste complète et vérifiée du croissant aux amandes est sur sa page.'),
        q('Que veut dire « Peut contenir »?', '« Peut contenir » signale un risque de contamination croisée qui demeure malgré les précautions. La Pâtisserie Coco Vanille l’utilise seulement quand ce risque est réel, jamais comme mention générale.'),
        q('Avez-vous des gâteaux sans lactose ou véganes?', `La Pâtisserie Coco Vanille ne présente aucun produit comme « sans lactose » ou « végane ». Produits préparés sans lait ou sans œufs : ${fn('produits sans lait ou sans œufs, s’il y en a')}.`),
        q('Puis-je indiquer une allergie dans ma commande?', 'Oui : le formulaire de commande a un champ facultatif pour une allergie. Cette note sert seulement à préparer votre commande; elle n’est jamais copiée dans les courriels ou les textos.'),
        q('Où trouver la liste des ingrédients?', `La page de chaque produit affiche ses allergènes vérifiés. Liste complète des ingrédients : ${fn('liste des ingrédients par produit')}.`),
        q('Les allergènes sont-ils affichés en boutique?', `L’affichage des allergènes au comptoir reste à confirmer par la boutique : ${fn('affichage des allergènes en boutique')}.`),
      ],
      changeNote: 'Première version : liste des allergènes prioritaires; vérification par produit en cours.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Allergies and allergens in Granby · Pâtisserie Coco Vanille',
      description: 'Allergens for every Pâtisserie Coco Vanille product in Granby, Québec, checked by a person. No “gluten-free” or “nut-free” claims. Call us before you order.',
      h1: 'Allergens and food allergies',
      answer:
        'Pâtisserie Coco Vanille in Granby, Québec, shows the priority allergens each product contains, once a team member has checked the list. The shop makes no “gluten-free”, “nut-free” or “peanut-free” claims. If you have an allergy, call 450-372-7177 before you order, to talk about ingredients and preparation.',
      sections: [
        s('Which allergens does Pâtisserie Coco Vanille list?', 'Pâtisserie Coco Vanille lists the priority allergens recognised by Health Canada and the Canadian Food Inspection Agency, plus gluten sources.', {
          list: ['Eggs', 'Milk', 'Mustard', 'Peanuts', 'Crustaceans and molluscs', 'Fish', 'Sesame', 'Soy', 'Sulphites', 'Tree nuts', 'Wheat and triticale', 'Gluten sources: barley, oats, rye'],
        }),
        s('Do you have gluten-free or nut-free products?', 'Pâtisserie Coco Vanille does not label any product “gluten-free”, “nut-free” or “peanut-free”. In Canada, “gluten-free” is a regulated claim: the food must contain no gluten protein, and gluten from cross-contact must stay under 20 ppm.'),
        s('Is there a risk of cross-contact?', `The risk depends on the ingredients handled in the same kitchen, which the shop still has to confirm: ${fn('allergens handled in the kitchen and cross-contact precautions')}. “May contain” only appears when a real risk remains.`),
        s('How are allergens checked?', 'Each allergen list is checked and dated by a team member, never generated automatically. Until a product is checked, its page says so instead of showing an incomplete list.'),
        s('What should I do if I have a severe allergy?', 'Call the shop at 450-372-7177 before you order to talk about ingredients and preparation. On the order form, the allergy note is optional and is only used to prepare your order.'),
      ],
      faq: [
        q('Does the almond croissant contain tree nuts?', 'Yes: almonds are tree nuts, one of the priority allergens. The full, checked list for the almond croissant is on its page.'),
        q('What does “may contain” mean?', '“May contain” flags a cross-contact risk that remains despite precautions. Pâtisserie Coco Vanille only uses it when that risk is real, never as a blanket statement.'),
        q('Do you have lactose-free or vegan cakes?', `Pâtisserie Coco Vanille does not label any product “lactose-free” or “vegan”. Products made without milk or eggs: ${fn('products without milk or eggs, if any')}.`),
        q('Can I mention an allergy in my order?', 'Yes: the order form has an optional allergy field. That note is only used to prepare your order; it is never copied into emails or text messages.'),
        q('Where can I find the ingredient list?', `Each product page shows its checked allergens. Full ingredient list: ${fn('ingredient list per product')}.`),
        q('Are allergens posted in the shop?', `Allergen information at the counter is still to be confirmed by the shop: ${fn('allergen display in the shop')}.`),
      ],
      changeNote: 'First version: priority allergen list; per-product checks in progress.',
      contentUpdatedAt: UPDATED,
    },
  },
}

// ---------- FAQ ----------
const faq = {
  key: 'faq',
  status: 'core',
  locales: {
    fr: {
      title: 'FAQ : commandes, heures et gâteaux · Pâtisserie Coco Vanille',
      description: 'Questions fréquentes sur la Pâtisserie Coco Vanille, à Granby : commande et cueillette, délais, prix, portions, allergènes, heures, stationnement et paiement.',
      h1: 'Questions fréquentes sur la Pâtisserie Coco Vanille',
      answer:
        'Cette page de la Pâtisserie Coco Vanille, à Granby, répond aux questions des clients sur la boutique du 3, rue Court : commande et cueillette, délais, prix, portions, allergènes, heures et stationnement. Chaque réponse commence par l’essentiel, puis renvoie à la page qui donne le détail.',
      sections: [
        s('Comment commander à la Pâtisserie Coco Vanille?', 'Vous commandez en ligne sur la page Commander, ou par téléphone au 450-372-7177, pour une cueillette au 3, rue Court. Les deux passent par le même calendrier, qui affiche seulement les dates possibles.'),
        s('Combien coûte un gâteau de fête?', `Le prix d’un gâteau de fête dépend du format et du nombre de portions : ${fn('prix des gâteaux par format')}. La page Prix affiche chaque format avec son prix en texte, avant taxes, et la date de mise à jour; elle sert aussi pour un gâteau d’anniversaire sur commande.`),
        s('Quelle grosseur de gâteau pour 20 personnes?', `Pour 20 personnes, le bon format dépend du nombre de portions par taille, que la boutique doit fournir : ${fn('portions par format de gâteau')}. Le calculateur de portions donne la réponse dès que ces chiffres sont publiés.`),
        s('Quelles sont les heures d’ouverture?', `Les heures d’ouverture sont dans le tableau de la page Nous trouver, tenu à jour par la boutique : ${HOURS_FR}.`),
      ],
      faq: [
        q('Combien de jours d’avance faut-il commander un gâteau personnalisé?', `Le délai dépend du type de gâteau : ${fn('délai minimum par type de gâteau, en jours')}. Le calendrier de la page Commander propose toujours la première date possible.`),
        q('Est-ce que mon gâteau va ressembler à la photo?', 'Vous joignez une photo de référence à votre demande et recevez un récapitulatif écrit avant la préparation. Rien n’est préparé sans votre approbation.'),
        q('Faut-il un dépôt? Puis-je annuler?', `Un acompte de ${DEPOSIT_FR} réserve la date d’un gâteau personnalisé. Les règles d’annulation et de remboursement sont écrites dans les conditions de vente, avant le paiement.`),
        q('Faites-vous la livraison?', `La commande en ligne prévoit la cueillette au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
        q('Avez-vous des gâteaux sans noix ou sans gluten?', 'La Pâtisserie Coco Vanille ne fait aucune allégation « sans noix » ou « sans gluten ». Les allergènes vérifiés de chaque produit sont sur la page Allergènes.'),
        q('Où se stationner près de la Pâtisserie Coco Vanille?', `Le stationnement près du 3, rue Court est décrit sur la page Nous trouver : ${PARKING_FR}.`),
        q('Vendez-vous des cartes-cadeaux?', `Les cartes-cadeaux restent à confirmer par la boutique : ${fn('cartes-cadeaux offertes ou non')}. Si elles sont offertes, elles n’auront ni date d’expiration ni frais.`),
        q('Peut-on payer comptant à la cueillette?', `Le paiement en ligne se fait par carte. Paiement à la cueillette : ${fn('paiement comptant ou par carte à la cueillette')}.`),
      ],
      changeNote: 'Première version de la FAQ, à partir des questions de clients relevées en ligne.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'FAQ: orders, hours and cakes · Pâtisserie Coco Vanille',
      description: 'Frequently asked questions about Pâtisserie Coco Vanille in Granby, Québec: ordering and pickup, lead times, prices, servings, allergens, hours, parking.',
      h1: 'Frequently asked questions about Pâtisserie Coco Vanille',
      answer:
        'This page of Pâtisserie Coco Vanille in Granby, Québec, answers customers’ questions about the shop at 3 rue Court: ordering and pickup, lead times, prices, servings, allergens, hours and parking. Each answer starts with the essentials, then points to the page that has the details.',
      sections: [
        s('How do I order from Pâtisserie Coco Vanille?', 'You order online on the Order page, or by phone at 450-372-7177, for pickup at 3 rue Court. Both use the same calendar, which only shows the dates that are possible.'),
        s('How much is a custom birthday cake?', `The price of a birthday cake depends on the size and the number of servings: ${fn('cake prices per size')}. The Prices page shows each size with its price as text, before taxes, and the date it was updated.`),
        s('What size cake for 20 people?', `For 20 people, the right size depends on the number of servings per size, which the shop still has to provide: ${fn('servings per cake size')}. The serving calculator gives the answer as soon as those numbers are published.`),
        s('What are the opening hours?', `Opening hours are in the table on the Visit page, kept up to date by the shop: ${HOURS_EN}.`),
      ],
      faq: [
        q('How far in advance should I order a custom cake?', `The lead time depends on the type of cake: ${fn('minimum lead time per cake type, in days')}. The calendar on the Order page always offers the first possible date.`),
        q('Will my cake look like the photo?', 'You attach a reference photo to your request and receive a written summary before anything is made. Nothing is made without your approval.'),
        q('Is there a deposit? Can I cancel?', `A deposit of ${DEPOSIT_EN} holds the date for a custom cake. The cancellation and refund rules are written in the conditions of sale, before you pay.`),
        q('Do you deliver?', `Online orders are picked up at 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
        q('Do you have nut-free or gluten-free cakes?', 'Pâtisserie Coco Vanille makes no “nut-free” or “gluten-free” claims. Each product’s checked allergens are on the Allergens page.'),
        q('Is there a bakery near the Granby Zoo?', `Pâtisserie Coco Vanille is in downtown Granby, at 3 rue Court. Driving time from the Zoo: ${fn('minutes by car from the Granby Zoo to 3 rue Court')}.`),
        q('Do you sell gift cards?', `Gift cards are still to be confirmed by the shop: ${fn('gift cards offered or not')}. If they are offered, they will have no expiry date and no fees.`),
        q('Can I pay cash at pickup?', `Online payment is by card. Payment at pickup: ${fn('cash or card payment at pickup')}.`),
      ],
      changeNote: 'First version of the FAQ, built from customer questions found online.',
      contentUpdatedAt: UPDATED,
    },
  },
}

// ---------- Category pages ----------
const viennoiseries = {
  key: 'viennoiseries',
  status: 'core',
  locales: {
    fr: {
      title: 'Croissants et viennoiseries à Granby · Coco Vanille',
      description: 'Croissants et viennoiseries de la Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, dont le croissant aux amandes. Prix et allergènes.',
      h1: 'Croissants et viennoiseries à Granby',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, propose des viennoiseries, dont le croissant aux amandes. Chaque viennoiserie a sa page avec son prix écrit en texte et ses allergènes vérifiés, et se récupère en boutique. Liste du jour et heures de sortie du four : ${fn('viennoiseries offertes et heures de cuisson')}.`,
      sections: [
        s('Quelles viennoiseries trouve-t-on à la Pâtisserie Coco Vanille?', `On y trouve le croissant aux amandes, que les clients citent souvent dans leurs avis. La liste complète des viennoiseries reste à confirmer par la boutique : ${fn('liste des viennoiseries')}.`),
        s('Qu’est-ce qu’une viennoiserie?', 'Une viennoiserie est un produit de boulangerie à pâte levée, souvent feuilletée et enrichie de beurre, de sucre ou d’œufs, comme le croissant ou la brioche. Elle se situe entre le pain et la pâtisserie.'),
        s('À quelle heure les croissants sont-ils prêts le matin?', `L’heure de sortie du four reste à confirmer par la boutique : ${fn('heure de sortie des croissants le matin')}. La vitrine du jour, sur la page d’accueil, montre ce qui est en vente aujourd’hui.`),
        s('Peut-on commander des viennoiseries pour une réunion?', `Les boîtes de viennoiseries pour les réunions restent à confirmer : ${fn('boîtes de viennoiseries pour groupes offertes ou non, quantité minimale et délai')}.`),
      ],
      faq: [
        q('Faites-vous des chocolatines?', `La chocolatine (pain au chocolat) reste à confirmer à la carte : ${fn('chocolatines offertes ou non')}.`),
        q('Le croissant aux amandes contient-il des noix?', 'Oui : l’amande est une noix, un des allergènes prioritaires. La page du croissant aux amandes affiche sa liste d’allergènes vérifiée.'),
        q('Combien coûte un croissant?', `Le prix de chaque viennoiserie est écrit en texte sur sa page : ${fn('prix des viennoiseries')}.`),
        q('Peut-on réserver des croissants pour le lendemain?', `La réservation des viennoiseries reste à confirmer : ${fn('réservation de viennoiseries pour le lendemain')}. Les produits commandables apparaissent sur la page Commander.`),
        q('Les viennoiseries sont-elles faites le matin même?', `Le moment de cuisson reste à confirmer par la boutique : ${fn('viennoiseries cuites le matin même ou non')}.`),
      ],
      changeNote: 'Première version : liste des viennoiseries et heures de cuisson à confirmer.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Croissants and viennoiseries in Granby · Coco Vanille',
      description: 'Croissants and viennoiseries from Pâtisserie Coco Vanille, 3 rue Court in downtown Granby, Québec, including the almond croissant. Prices and allergens as text.',
      h1: 'Croissants and viennoiseries in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes viennoiseries, including the almond croissant. Each viennoiserie has its own page with its price written as text and checked allergens, and is picked up at the shop. Today’s list and baking times: ${fn('viennoiseries offered and baking times')}.`,
      sections: [
        s('Which viennoiseries does Pâtisserie Coco Vanille make?', `The almond croissant, which customers often mention in their reviews. The full list of viennoiseries is still to be confirmed by the shop: ${fn('list of viennoiseries')}.`),
        s('What is a viennoiserie?', 'A viennoiserie is a yeast-raised baked good, often laminated and enriched with butter, sugar or eggs, like a croissant or a brioche. It sits between bread and pastry.'),
        s('What time are the croissants ready in the morning?', `The time the croissants come out of the oven is still to be confirmed by the shop: ${fn('time the croissants are ready in the morning')}. Today’s display case, on the home page, shows what is for sale today.`),
        s('Can I order viennoiseries for a meeting?', `Viennoiserie boxes for meetings are still to be confirmed: ${fn('group viennoiserie boxes offered or not, minimum quantity and lead time')}.`),
      ],
      faq: [
        q('Do you make chocolatines?', `The chocolatine (chocolate croissant, pain au chocolat) is still to be confirmed on the menu: ${fn('chocolatines offered or not')}.`),
        q('Does the almond croissant contain tree nuts?', 'Yes: almonds are tree nuts, one of the priority allergens. The almond croissant page shows its checked allergen list.'),
        q('How much is a croissant?', `Each viennoiserie’s price is written as text on its page: ${fn('viennoiserie prices')}.`),
        q('Can I reserve croissants for the next day?', `Reserving viennoiseries is still to be confirmed: ${fn('next-day viennoiserie reservations')}. Products you can order appear on the Order page.`),
        q('Are the viennoiseries baked the same morning?', `Baking times are still to be confirmed by the shop: ${fn('viennoiseries baked the same morning or not')}.`),
      ],
      changeNote: 'First version: list of viennoiseries and baking times to be confirmed.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const pains = {
  key: 'pains',
  status: 'core',
  locales: {
    fr: {
      title: 'Pains et baguettes à Granby · Pâtisserie Coco Vanille',
      description: 'Pains et baguettes de la Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, à récupérer en boutique. Prix, allergènes et variétés.',
      h1: 'Pains et baguettes à Granby',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, fait des pains et des baguettes à récupérer en boutique. La page de chaque pain affiche son prix écrit en texte et ses allergènes vérifiés. Variétés de pains et heures de sortie du four : ${fn('pains offerts et heures de cuisson')}.`,
      sections: [
        s('Quels pains la Pâtisserie Coco Vanille fait-elle?', `La baguette est à la carte de la Pâtisserie Coco Vanille. Les autres variétés de pains restent à confirmer par la boutique : ${fn('liste des pains')}.`),
        s('Vendez-vous du pain congelé?', `Le pain et les baguettes congelés restent à confirmer par la boutique : ${fn('pains et baguettes congelés offerts ou non')}.`),
        s('Comment garder une baguette fraîche?', 'Une baguette se garde dans un sac de papier, à la température de la pièce, et se mange de préférence le jour même. Pour la garder plus longtemps, congelez-la le jour de l’achat, bien emballée.'),
        s('Peut-on réserver du pain pour le lendemain?', `La réservation de pain reste à confirmer par la boutique : ${fn('réservation de pain pour le lendemain')}. Les produits commandables apparaissent sur la page Commander.`),
      ],
      faq: [
        q('Peut-on congeler du pain ou des baguettes?', 'Oui : emballez le pain bien serré le jour de l’achat, puis congelez-le. Quelques minutes au four lui redonnent du croustillant.'),
        q('À quelle heure les baguettes sont-elles prêtes?', `L’heure de sortie du four reste à confirmer par la boutique : ${fn('heure de sortie des baguettes')}.`),
        q('Combien coûte une baguette?', `Le prix de chaque pain est écrit en texte sur sa page : ${fn('prix des pains')}.`),
        q('Faites-vous du pain sans gluten?', 'La Pâtisserie Coco Vanille ne présente aucun pain comme « sans gluten ». Les allergènes vérifiés de chaque pain sont sur la page Allergènes.'),
        q('Peut-on commander du pain en grande quantité?', `Les commandes de pain en grande quantité restent à confirmer : ${fn('commandes de pain en quantité, minimum et délai')}.`),
      ],
      changeNote: 'Première version : variétés de pains et heures de cuisson à confirmer.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Bread and baguettes in Granby · Pâtisserie Coco Vanille',
      description: 'Bread and baguettes from Pâtisserie Coco Vanille, 3 rue Court in downtown Granby, Québec, for pickup at the shop. Prices, allergens and varieties shown as text.',
      h1: 'Bread and baguettes in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes bread and baguettes for pickup at the shop. Each bread’s page shows its price written as text and its checked allergens. Bread varieties and the times they come out of the oven: ${fn('breads offered and baking times')}.`,
      sections: [
        s('Which breads does Pâtisserie Coco Vanille make?', `The baguette is on the Pâtisserie Coco Vanille menu. Other bread varieties are still to be confirmed by the shop: ${fn('list of breads')}.`),
        s('Do you sell frozen bread?', `Frozen bread and baguettes are still to be confirmed by the shop: ${fn('frozen bread and baguettes offered or not')}.`),
        s('How do I keep a baguette fresh?', 'Keep a baguette in a paper bag at room temperature and eat it the same day if you can. To keep it longer, wrap it well and freeze it on the day you buy it.'),
        s('Can I reserve bread for the next day?', `Bread reservations are still to be confirmed by the shop: ${fn('next-day bread reservations')}. Products you can order appear on the Order page.`),
      ],
      faq: [
        q('Can I freeze bread or baguettes?', 'Yes: wrap the bread tightly on the day you buy it, then freeze it. A few minutes in the oven bring back the crust.'),
        q('What time are the baguettes ready?', `The time the baguettes come out of the oven is still to be confirmed: ${fn('time the baguettes are ready')}.`),
        q('How much is a baguette?', `Each bread’s price is written as text on its page: ${fn('bread prices')}.`),
        q('Do you make gluten-free bread?', 'Pâtisserie Coco Vanille does not label any bread “gluten-free”. Each bread’s checked allergens are on the Allergens page.'),
        q('Can I order bread in large quantities?', `Large bread orders are still to be confirmed: ${fn('bulk bread orders, minimum and lead time')}.`),
      ],
      changeNote: 'First version: bread varieties and baking times to be confirmed.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const gateaux = {
  key: 'gateaux',
  status: 'core',
  locales: {
    fr: {
      title: 'Gâteaux de fête sur commande à Granby · Coco Vanille',
      description: 'Gâteaux de fête et gâteaux sur commande de la Pâtisserie Coco Vanille, au 3, rue Court, à Granby : formats, portions, prix en texte et délai de commande.',
      h1: 'Gâteaux de fête et gâteaux sur commande à Granby',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, prépare des gâteaux sur commande à récupérer en boutique, dont le gâteau aux framboises et le shortcake aux fraises. Chaque gâteau a sa page avec ses formats, ses portions et son prix en texte. Délai de commande : ${fn('délai minimum par type de gâteau')}.`,
      sections: [
        s('Quels gâteaux la Pâtisserie Coco Vanille prépare-t-elle?', `Le gâteau aux framboises et le shortcake aux fraises sont à la carte. Les autres gâteaux, saveurs et décors restent à confirmer par la boutique : ${fn('liste des gâteaux, saveurs et décors')}.`),
        s('Combien de jours d’avance commander un gâteau?', `Le délai dépend du gâteau : ${fn('délai minimum par type de gâteau, en jours')}. Le calendrier de la page Commander propose toujours la première date de cueillette possible.`),
        s('Quelle grosseur de gâteau choisir pour mes invités?', `Le bon format dépend du nombre de portions par taille, que la boutique doit fournir : ${fn('portions par format de gâteau')}. Le calculateur de portions fera le calcul pour votre nombre d’invités.`),
        s('Combien coûte un gâteau d’anniversaire?', `Le prix d’un gâteau d’anniversaire dépend du format et du décor : ${fn('prix des gâteaux par format')}. Les prix sont écrits en texte, avant taxes, sans frais ajoutés.`),
      ],
      faq: [
        q('C’est-tu possible d’avoir un gâteau pour demain?', `Ça dépend de l’heure limite de commande, que la boutique doit confirmer : ${NEXT_DAY_FR}. Le calendrier de commande affiche seulement les dates possibles.`),
        q('Est-ce que mon gâteau va ressembler à la photo?', 'Vous joignez une photo de référence à votre demande, puis vous recevez un récapitulatif écrit du format, de la saveur, des couleurs et du message. La préparation commence seulement après votre approbation.'),
        q('Pouvez-vous écrire un message sur le gâteau?', `Le message sur le gâteau reste à confirmer par la boutique : ${fn('message écrit sur le gâteau offert ou non, longueur maximale')}.`),
        q('Pouvez-vous faire un gâteau avec un personnage?', `La boutique doit confirmer sa politique pour les thèmes et les personnages : ${fn('politique pour les thèmes et les personnages')}.`),
        q('Faut-il un acompte pour un gâteau?', `Pour un gâteau personnalisé, un acompte de ${DEPOSIT_FR} réserve la date; le solde se paie à la cueillette.`),
        q('Comment conserver un gâteau à la crème jusqu’au lendemain?', `Les consignes de conservation de la boutique restent à confirmer : ${fn('consignes de conservation des gâteaux à la crème')}.`),
      ],
      changeNote: 'Première version : formats, portions, prix et délais des gâteaux à confirmer.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Birthday cakes to order in Granby, Québec · Coco Vanille',
      description: 'Birthday cakes and cakes to order from Pâtisserie Coco Vanille, 3 rue Court, Granby, Québec: sizes, servings, prices as text and the lead time for each cake.',
      h1: 'Birthday cakes and cakes to order in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes cakes to order for pickup at the shop, including the raspberry cake and the strawberry shortcake. Each cake has its own page with its sizes, servings and price as text. Lead time: ${fn('minimum lead time per cake type')}.`,
      sections: [
        s('Which cakes does Pâtisserie Coco Vanille make?', `The raspberry cake and the strawberry shortcake are on the menu. Other cakes, flavours and decorations are still to be confirmed by the shop: ${fn('list of cakes, flavours and decorations')}.`),
        s('How far in advance should I order a cake?', `It depends on the cake: ${fn('minimum lead time per cake type, in days')}. The calendar on the Order page always offers the first possible pickup date.`),
        s('What size cake should I choose for my guests?', `The right size depends on the number of servings per size, which the shop still has to provide: ${fn('servings per cake size')}. The serving calculator will do the maths for your number of guests.`),
        s('How much is a birthday cake?', `The price of a birthday cake depends on its size and decoration: ${fn('cake prices per size')}. Prices are written as text, before taxes, with no added fees.`),
      ],
      faq: [
        q('Can you make a cake for tomorrow?', `It depends on the order cut-off time, which the shop still has to confirm: ${NEXT_DAY_EN}. The order calendar only shows possible dates.`),
        q('Will my cake look like the photo?', 'You attach a reference photo to your request, then receive a written summary of the size, flavour, colours and message. Baking starts only after you approve it.'),
        q('Can you write a message on the cake?', `Messages on cakes are still to be confirmed by the shop: ${fn('message on the cake offered or not, maximum length')}.`),
        q('Can you make a cake with a character on it?', `The shop still has to confirm its policy on themes and characters: ${fn('policy on themes and characters')}.`),
        q('Is a deposit required for a cake?', `For a custom cake, a deposit of ${DEPOSIT_EN} holds the date; the balance is paid at pickup.`),
        q('How do I keep a cream cake fresh overnight?', `The shop’s storage instructions are still to be confirmed: ${fn('storage instructions for cream cakes')}.`),
      ],
      changeNote: 'First version: cake sizes, servings, prices and lead times to be confirmed.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const patisseries = {
  key: 'patisseries',
  status: 'core',
  locales: {
    fr: {
      title: 'Paris-Brest et pâtisseries à Granby · Coco Vanille',
      description: 'Pâtisseries de la Pâtisserie Coco Vanille, au 3, rue Court, à Granby : Paris-Brest, vol-au-vent et autres classiques, avec prix et allergènes écrits en texte.',
      h1: 'Pâtisseries à Granby : du Paris-Brest au vol-au-vent',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, propose des pâtisseries sucrées et salées, dont le Paris-Brest et le vol-au-vent. Chaque pâtisserie a sa page avec son prix écrit en texte et ses allergènes vérifiés. Pâtisseries offertes cette saison : ${fn('liste des pâtisseries offertes')}.`,
      sections: [
        s('Quelles pâtisseries trouve-t-on à la Pâtisserie Coco Vanille?', `Le Paris-Brest et le vol-au-vent sont à la carte de la Pâtisserie Coco Vanille. Les autres pâtisseries restent à confirmer par la boutique : ${fn('liste des pâtisseries')}.`),
        s('Qu’est-ce qu’un Paris-Brest?', `Le Paris-Brest est une couronne de pâte à choux garnie de crème pralinée; sa forme rappelle une roue de vélo, en hommage à la course cycliste Paris-Brest-Paris. Garniture du Paris-Brest de la boutique : ${fn('garniture du Paris-Brest')}.`),
        s('Qu’est-ce qu’un vol-au-vent?', `Un vol-au-vent est une bouchée creuse de pâte feuilletée, garnie d’une préparation salée chaude, souvent du poulet en sauce. Garniture du vol-au-vent de la boutique : ${fn('garniture du vol-au-vent')}.`),
        s('Peut-on commander des pâtisseries à l’avance?', 'Oui, pour les pâtisseries marquées commandables : la page Commander les affiche avec leur délai, et la boutique prend aussi les commandes au 450-372-7177.'),
      ],
      faq: [
        q('Le Paris-Brest contient-il des noix?', 'La crème pralinée classique est faite de noisettes ou d’amandes, deux noix. La liste vérifiée du Paris-Brest de la boutique est sur sa page.'),
        q('Combien coûte un Paris-Brest?', `Le prix de chaque pâtisserie est écrit en texte sur sa page : ${fn('prix des pâtisseries')}.`),
        q('Les pâtisseries se conservent-elles jusqu’au lendemain?', `Les consignes de conservation de la boutique restent à confirmer : ${fn('consignes de conservation des pâtisseries à la crème')}.`),
        q('Faites-vous des tartes?', `Les tartes restent à confirmer à la carte : ${fn('tartes offertes ou non')}.`),
        q('Peut-on commander des pâtisseries pour un événement?', `Les commandes de pâtisseries en quantité restent à confirmer : ${fn('commandes de pâtisseries pour événements, minimum et délai')}.`),
      ],
      changeNote: 'Première version : liste des pâtisseries et garnitures à confirmer.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Paris-Brest and pastries in Granby · Coco Vanille',
      description: 'Pastries from Pâtisserie Coco Vanille, 3 rue Court, Granby, Québec: Paris-Brest, vol-au-vent and other French classics, with prices and allergens as text.',
      h1: 'Pastries in Granby, from Paris-Brest to vol-au-vent',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes sweet and savoury pastries, including the Paris-Brest and the vol-au-vent. Each pastry has its own page with its price written as text and checked allergens. Pastries offered this season: ${fn('list of pastries offered')}.`,
      sections: [
        s('Which pastries does Pâtisserie Coco Vanille make?', `The Paris-Brest and the vol-au-vent are on the Pâtisserie Coco Vanille menu. Other pastries are still to be confirmed by the shop: ${fn('list of pastries')}.`),
        s('What is a Paris-Brest?', `A Paris-Brest is a ring of choux pastry filled with praline cream; its shape recalls a bicycle wheel, in honour of the Paris-Brest-Paris cycling race. The shop’s Paris-Brest filling: ${fn('Paris-Brest filling')}.`),
        s('What is a vol-au-vent?', `A vol-au-vent is a hollow puff-pastry case filled with a hot savoury mixture, often chicken in sauce. The shop’s vol-au-vent filling: ${fn('vol-au-vent filling')}.`),
        s('Can I order pastries ahead?', 'Yes, for pastries marked as orderable: the Order page lists them with their lead time, and the shop also takes orders at 450-372-7177.'),
      ],
      faq: [
        q('Does the Paris-Brest contain tree nuts?', 'Classic praline cream is made from hazelnuts or almonds, both tree nuts. The checked list for the shop’s Paris-Brest is on its page.'),
        q('How much is a Paris-Brest?', `Each pastry’s price is written as text on its page: ${fn('pastry prices')}.`),
        q('Do pastries keep until the next day?', `The shop’s storage instructions are still to be confirmed: ${fn('storage instructions for cream pastries')}.`),
        q('Do you make tarts?', `Tarts are still to be confirmed on the menu: ${fn('tarts offered or not')}.`),
        q('Can I order pastries for an event?', `Large pastry orders are still to be confirmed: ${fn('pastry orders for events, minimum and lead time')}.`),
      ],
      changeNote: 'First version: list of pastries and fillings to be confirmed.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const withTypography = (page) => ({
  ...page,
  locales: Object.fromEntries(Object.entries(page.locales).map(([locale, copy]) => [locale, locale === 'fr' ? frTypo(copy) : copy])),
})

export const pages = [home, carte, commander, nousTrouver, aPropos, allergenes, faq, viennoiseries, pains, gateaux, patisseries].map(withTypography)
