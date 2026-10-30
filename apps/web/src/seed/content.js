// Page copy per registry key (src/lib/routes.js). Québec French is the source; EN adapts it (Loi 96: never more complete).
// Contract (v1 §7, rank-first 02, 00 §10.1): title ≤ 60 characters, customer word first, brand last; description 140–160;
// h1 in the searcher's words; answer block 40–60 words with « Pâtisserie Coco Vanille » + Granby + one verified fact;
// 3–6 question-phrased sections whose first sentence answers; 5–8 FAQ from the objection bank (02 §5, 04 §5); change note.
// Facts come only from data/facts.json and the seed. Every owner fact not yet supplied stays a marker (zero invention).
// Checked by test/unit/content.test.js.
import { marker } from '../lib/facts.js'
import { t } from '../lib/i18n.js'
import { hoursSummary, WEEK } from '../components/site/hours.js'

const fn = marker
// Noon in Granby (16:00 UTC), so the date reads the same in every time zone of the country.
const UPDATED = '2026-10-25T16:00:00.000Z'
// Pages changed by the owner-published facts relayed by Yahya on 2026-10-27 (hours, café, ateliers, chat).
const UPDATED_1027 = '2026-10-27T16:00:00.000Z'
// Pages changed on 2026-10-29 by the public facts of research/20c (parking, the Zoo) and the legal corrections of
// research/20d (deposit refund, gift cards, orders not picked up), applied in research/21 §6. The terms version a
// customer accepts follows the date of the conditions page (src/lib/payments/consent.js).
const UPDATED_1029 = '2026-10-29T16:00:00.000Z'

// Regular hours: the shop's Google listing, supplied by the operator on 2026-10-27 (research/01 « Update 2026-10-27 »,
// 15 D26; owner sign-off still welcome, 14 H1). The seed writes this record to the shop global, the single source of
// truth for the hours table, the « Ouvert » pill and the JSON-LD; the sentences below come from the same record
// through the site's own hoursSummary(), so copy and table say the same thing. Holiday hours stay a marker.
export const HOURS = [
  { day: 'Wednesday', opens: '08:30', closes: '17:30' },
  { day: 'Thursday', opens: '08:30', closes: '17:30' },
  { day: 'Friday', opens: '08:30', closes: '17:30' },
  { day: 'Saturday', opens: '08:30', closes: '17:30' },
  { day: 'Sunday', opens: '09:30', closes: '17:00' },
]
const closedDays = (locale) => WEEK.filter((day) => !HOURS.some((h) => h.day === day)).map((day) => t(locale).weekdays[day])
const joinAnd = (items, word) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} ${word} ${items.at(-1)}` : items[0] || '')
// « du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h 30 à 17 h » · "Wednesday to Saturday from 8:30 a.m. …"
const OPEN_FR = hoursSummary(HOURS, 'fr')
const OPEN_EN = hoursSummary(HOURS, 'en')
const CLOSED_FR = joinAnd(closedDays('fr').map((day) => `le ${day}`), 'et') // « le lundi et le mardi »
const CLOSED_EN = joinAnd(closedDays('en'), 'and') // "Monday and Tuesday"
export const HOURS_FR = `${OPEN_FR}; fermé ${CLOSED_FR}`
export const HOURS_EN = `${OPEN_EN}; closed ${CLOSED_EN}`
const SUNDAY_FR = hoursSummary(HOURS.filter((h) => h.day === 'Sunday'), 'fr') // « le dimanche de 9 h 30 à 17 h »
const SUNDAY_EN = hoursSummary(HOURS.filter((h) => h.day === 'Sunday'), 'en')

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
  if (typeof value === 'string')
    return value
      .replace(/ :/g, `${NBSP}:`)
      .replace(/« /g, `«${NBSP}`)
      .replace(/ »/g, `${NBSP}»`)
      .replace(/(\d) (h|\$|%)(?![\p{L}\d])/gu, `$1${NBSP}$2`)
      .replace(/(\d h) (\d\d)/g, `$1${NBSP}$2`)
      .replace(/(\d(?:er)?) (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/g, `$1${NBSP}$2`)
      .replace(/(\d), (rue|boulevard|avenue) /g, `$1,${NBSP}$2 `)
      .replace(/J2G 4Y6/g, `J2G${NBSP}4Y6`)
  if (Array.isArray(value)) return value.map(frTypo)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, frTypo(v)]))
  return value
}

const DEPOSIT_FR = `30${NBSP}%`
const DEPOSIT_EN = '30%'
const NEXT_DAY_FR = fn('commande pour le lendemain offerte ou non, et heure limite')
const NEXT_DAY_EN = fn('next-day orders offered or not, and cut-off time')
const DELIVERY_FR = 'non offerte; toutes les commandes se récupèrent à la boutique'
const DELIVERY_EN = 'not offered; every order is picked up at the shop'
// Parking and the drive from the Zoo: public facts of research/20c (2026-10-29), applied by the agency (research/21 §6).
// Rules: the City's traffic by-law 1885-1990 (consolidation revised 2026-09-18; the Centre-Court and Johnson lot plans
// in force since 2026-06-12; no meters since 2021-06-12). Distances are computed on OpenStreetMap, hence « environ »;
// the Zoo range is the one two routing engines agree on. Not written until someone confirms them: the accessible
// spaces of Centre-Court (20c P-6), a landmark at the door (20c L-1) and the entrance itself (20c A-1).
// No « le plus proche »: on foot, Johnson's address is as close as the Centre-Court driveway (about 120 m each, 20c
// P-7, P-10), and the City lot behind the Palace (20c P-11) has no measured distance.
const PARKING_FR = 'Le stationnement municipal Centre-Court, entre les rues Court et du Centre, est à environ 100 m de la boutique. Comme tout le stationnement municipal du centre-ville de Granby, il est gratuit.'
const PARKING_EN = 'The municipal Centre-Court lot, between rue Court and rue du Centre, is about 100 m from the shop. Like all municipal parking in downtown Granby, it is free.'
const PARKING_MORE_FR = 'Le Centre-Court offre des cases de 4 h et de 2 h (limites du lundi au vendredi) et des rangées sans limite de temps. Sur la rue Court, le stationnement est limité à 2 h. Le stationnement Johnson (18, rue Johnson), de l’autre côté de la rue Principale, est à environ 120 m. Suivez toujours les panneaux.'
const PARKING_MORE_EN = 'Centre-Court has 4-hour and 2-hour spaces (limits apply Monday to Friday) and rows with no time limit. On rue Court, parking is limited to 2 hours. The Johnson lot (18 rue Johnson), across rue Principale, is about 120 m away. Always follow the signs.'
// The parking row of the Visit page (the Business global's `parking`, written by src/seed/index.js).
export const PARKING = {
  fr: frTypo('Gratuit au centre-ville de Granby; le stationnement municipal Centre-Court, entre les rues Court et du Centre, est à environ 100 m.'),
  en: 'Free in downtown Granby; the municipal Centre-Court lot, between rue Court and rue du Centre, is about 100 m away.',
}
const ZOO_FR = 'environ 5 à 8 minutes en auto du Zoo de Granby (3 à 4 km selon le trajet), sans compter la circulation'
const ZOO_EN = 'about 5 to 8 minutes by car from the Granby Zoo (3 to 4 km depending on the route), not counting traffic'

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
        `La Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby, au 3, rue Court : viennoiseries, pains, pâtisseries et gâteaux sur commande, à récupérer en boutique. Téléphone : 450-372-7177. Heures d’ouverture : ${HOURS_FR}.`,
      sections: [
        s('Que vend la Pâtisserie Coco Vanille?', 'La Pâtisserie Coco Vanille vend des viennoiseries, des pains et baguettes, des pâtisseries et des gâteaux sur commande. Sur sa page Facebook, la boutique résume son offre en une phrase : « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! »', {
          list: ['Viennoiseries, dont le croissant aux amandes', 'Pains, dont la baguette', 'Pâtisseries, dont le Paris-Brest et le vol-au-vent', 'Gâteaux, dont le gâteau aux framboises et le shortcake aux fraises', 'Spécialités marocaines, dont les msemmens et les harchas'],
        }),
        s('Peut-on commander en ligne pour la cueillette?', 'Oui : la page Commander reçoit les commandes et les demandes de gâteau, pour une cueillette au 3, rue Court. Avant toute préparation, vous recevez un récapitulatif écrit avec les produits, la date de cueillette, le total et les taxes.'),
        s('Où se trouve la Pâtisserie Coco Vanille à Granby?', 'La Pâtisserie Coco Vanille se trouve au 3, rue Court, au centre-ville de Granby (Québec), code postal J2G 4Y6. Les itinéraires Google Maps et Plans, les heures et le stationnement sont sur la page Nous trouver. En visite au Zoo de Granby? La page Depuis le Zoo de Granby donne le trajet, l’autobus et le stationnement.'),
        s('Pourquoi voit-on aussi le nom « Cocovanille »?', 'Les noms « Pâtisserie Cocovanille » et « Pâtisserie Coco Vanille » désignent la même boutique du 3, rue Court, à Granby. Google Maps et plusieurs annuaires l’écrivent en un mot; le registre des entreprises du Québec, la page Facebook et la presse l’écrivent en deux mots. Le téléphone, le 450-372-7177, est le même partout.'),
      ],
      faq: [
        q('La Pâtisserie Coco Vanille est-elle ouverte aujourd’hui?', `La boutique est ouverte ${OPEN_FR}; elle est fermée ${CLOSED_FR}. Le tableau des heures de cette page, tenu à jour par la boutique, signale aussi les jours fériés et les fermetures exceptionnelles. En cas de doute, appelez au 450-372-7177 avant de vous déplacer.`),
        q('Peut-on avoir un gâteau pour demain?', `Ça dépend de l’heure limite de commande, que la boutique doit confirmer : ${NEXT_DAY_FR}. Le calendrier de la page Commander affiche seulement les dates que la boutique peut réellement préparer.`),
        q('Faites-vous la livraison?', `La commande en ligne prévoit la cueillette en boutique, au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
        q('Où se stationner près de la boutique?', `${PARKING_FR} La page Nous trouver donne les limites de temps et un deuxième stationnement, à environ 120 m.`),
        q('Avez-vous des produits sans gluten ou sans noix?', 'Ce site ne présente aucun produit comme « sans gluten » ou « sans noix » : ces mentions sont encadrées par la réglementation. Les allergènes de chaque produit paraissent sur la page Allergènes une fois vérifiés par une personne de l’équipe; en cas d’allergie grave, appelez avant de commander.'),
        q('Peut-on payer par carte?', `En ligne, oui : le paiement se fait par carte sur la page sécurisée du processeur de paiement, et le numéro de carte n’est jamais conservé par la boutique. En boutique : ${fn('modes de paiement acceptés au comptoir')}.`),
        q('Parlez-vous anglais?', `Le site de la Pâtisserie Coco Vanille est offert en français et en anglais. Service en anglais au comptoir : ${fn('personne qui sert la clientèle en anglais')}.`),
      ],
      changeNote: 'Stationnement, trajet depuis le Zoo et spécialités marocaines ajoutés.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Pastry shop and bakery in Granby, Québec · Coco Vanille',
      description: 'Pâtisserie Coco Vanille, 3 rue Court in downtown Granby, Québec: viennoiseries, bread, pastries and cakes to order. Menu, hours and ordering for pickup.',
      h1: 'Pastry shop and bakery in downtown Granby',
      answer:
        `Pâtisserie Coco Vanille is a pastry shop and bakery at 3 rue Court in downtown Granby, Québec: viennoiseries, bread, pastries and cakes to order, for pickup at the shop. Phone: 450-372-7177. Opening hours: ${HOURS_EN}.`,
      sections: [
        s('What does Pâtisserie Coco Vanille sell?', 'Pâtisserie Coco Vanille sells viennoiseries, bread and baguettes, pastries and cakes to order. On its Facebook page, the shop sums up its offer in one French sentence: « Nous offrons une grande variété de pâtisseries, gâteaux et pains ! » (a wide variety of pastries, cakes and bread).', {
          list: ['Viennoiseries, including the almond croissant', 'Bread, including the baguette', 'Pastries, including the Paris-Brest and the vol-au-vent', 'Cakes, including the raspberry cake and the strawberry shortcake', 'Moroccan specialties, including msemmen and harcha'],
        }),
        s('Can I order online for pickup?', 'Yes: the Order page takes orders and cake requests for pickup at 3 rue Court. Before anything is made, you receive a written summary with the products, the pickup date, the total and the taxes.'),
        s('Where is Pâtisserie Coco Vanille in Granby?', 'Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec, postal code J2G 4Y6. Google Maps and Apple Maps directions, hours and parking are on the Visit page. Visiting the Granby Zoo? The From the Granby Zoo page gives the route, the bus and parking.'),
        s('Why do some maps say “Cocovanille”?', '“Pâtisserie Cocovanille” and “Pâtisserie Coco Vanille” are the same shop at 3 rue Court, Granby. Google Maps and several directories write it as one word; the Québec business registry, the Facebook page and the press write it as two. The phone number, 450-372-7177, is the same everywhere.'),
      ],
      faq: [
        q('Is Pâtisserie Coco Vanille open today?', `The shop is open ${OPEN_EN}; it is closed ${CLOSED_EN}. The hours table on this page, kept up to date by the shop, also shows statutory holidays and exceptional closures. If in doubt, call 450-372-7177 before you head over.`),
        q('Can I get a cake for tomorrow?', `It depends on the order cut-off time, which the shop still has to confirm: ${NEXT_DAY_EN}. The calendar on the Order page only shows dates the shop can actually prepare.`),
        q('Do you deliver?', `Online orders are picked up at the shop, 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
        q('Where can I park?', `${PARKING_EN} The Visit page gives the time limits and a second lot, about 120 m away.`),
        q('Do you have gluten-free or nut-free products?', 'This website does not label any product “gluten-free” or “nut-free”: those claims are regulated. Each product’s allergens appear on the Allergens page once a team member has checked them; if you have a severe allergy, call before you order.'),
        q('Do you accept US or foreign credit cards?', `Online, payment is made by card on the payment processor’s secure page, and the shop never stores your card number. Cards accepted in store: ${fn('payment methods accepted at the counter')}.`),
        q('Do you speak English in the shop?', `This website is in French and English. English service at the counter: ${fn('staff who serve customers in English')}.`),
      ],
      changeNote: 'Parking, the drive from the Zoo and Moroccan specialties added.',
      contentUpdatedAt: UPDATED_1029,
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
        'La carte de la Pâtisserie Coco Vanille, à Granby, réunit quatre familles de produits : viennoiseries, pains et baguettes, pâtisseries et gâteaux. Chaque produit a sa propre page avec ses formats, ses portions, son prix écrit en texte et ses allergènes, affichés une fois vérifiés. Tout se récupère au 3, rue Court, au centre-ville.',
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
        q('Servez-vous du café sur place?', `Oui : la boutique du 3, rue Court, présentée sur sa page Facebook comme « Pâtisserie & Café », sert, sur place ou à emporter, café, espresso, cappuccino, latte, macchiato, thé, tisane et chocolat chaud, et en boissons froides café glacé, moka glacé et matcha (liste publiée par la boutique en 2026). On peut s’y installer pour prendre un café. Prix et nombre de places : ${fn('prix des boissons et nombre de places assises')}.`),
        q('Peut-on commander un produit pour une date précise?', 'Oui : la page Commander propose les dates et les heures de cueillette que la boutique peut préparer pour l’ensemble de votre commande.'),
        q('Avez-vous des spécialités marocaines?', `Oui : la Pâtisserie Coco Vanille, à Granby, annonce des spécialités marocaines, dont des msemmens et des harchas, dans la liste de son offre publiée en août 2026. Le msemmen est une crêpe marocaine feuilletée; la harcha, une galette de semoule cuite à la poêle. Jours et prix : ${fn('jours où les msemmens et les harchas sont offerts, et leurs prix')}.`),
      ],
      changeNote: 'Spécialités marocaines ajoutées à la FAQ; allergènes affichés seulement une fois vérifiés; produits et prix encore à confirmer.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Menu: viennoiseries, bread and cakes · Coco Vanille',
      description: 'The menu of Pâtisserie Coco Vanille in Granby, Québec: viennoiseries, bread and baguettes, pastries and cakes, with sizes, prices and allergens shown as text.',
      h1: 'Menu: viennoiseries, bread, pastries and cakes in Granby',
      answer:
        'The menu of Pâtisserie Coco Vanille in Granby, Québec, has four families of products: viennoiseries, bread and baguettes, pastries and cakes. Each product has its own page with its sizes, servings, price written as text and its allergens, shown once a person has checked them. Everything is picked up at 3 rue Court, downtown.',
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
        q('Do you serve coffee in the shop?', `Yes: the shop at 3 rue Court, presented on its Facebook page as « Pâtisserie & Café », serves, to stay or to go, coffee, espresso, cappuccino, latte, macchiato, tea, herbal tea and hot chocolate, and cold drinks: iced coffee, iced mocha and matcha (list published by the shop in 2026). You can sit down for a coffee. Prices and number of seats: ${fn('drink prices and number of seats')}.`),
        q('Can I order a product for a specific date?', 'Yes: the Order page offers the dates and pickup times the shop can prepare for your whole order.'),
        q('Do you have Moroccan specialties?', `Yes: Pâtisserie Coco Vanille in Granby lists Moroccan specialties, including msemmen and harcha, in the list of its offer published in August 2026. Msemmen is a flaky Moroccan crêpe; harcha is a semolina flatbread cooked in a pan. Days and prices: ${fn('days msemmen and harcha are offered, and their prices')}.`),
      ],
      changeNote: 'Moroccan specialties added to the FAQ; allergens shown only once checked; products and prices still to be confirmed.',
      contentUpdatedAt: UPDATED_1029,
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
        q('Que se passe-t-il si j’arrive après ma plage de cueillette?', 'Appelez la boutique au 450-372-7177 : la commande reste prête jusqu’à la fermeture le jour prévu, et vous pouvez convenir d’une autre heure ce jour-là. Les produits frais ne peuvent pas être gardés au-delà de ce jour; comme la commande a été préparée pour vous, le montant payé n’est alors pas remboursé.'),
      ],
      changeNote: 'Réponse sur la commande non récupérée précisée; délais de commande encore à confirmer par la boutique.',
      contentUpdatedAt: UPDATED_1029,
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
        q('How do I pay for my online order?', 'Online payment is by card, on the payment processor’s secure page: your card number never reaches the shop’s servers. The exact amount is written on the payment button.'),
        q('What if I arrive after my pickup slot?', 'Call the shop at 450-372-7177: the order stays ready until closing on the planned day, and you can agree on another time that day. Fresh products cannot be kept beyond that day; because the order was made for you, the amount paid is then not refunded.'),
      ],
      changeNote: 'Answer on orders not picked up made clearer, and online payment added to the FAQ; order lead times still to be confirmed by the shop.',
      contentUpdatedAt: UPDATED_1029,
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
        `La Pâtisserie Coco Vanille est au 3, rue Court, au centre-ville de Granby, au Québec; téléphone : 450-372-7177. Heures : ${HOURS_FR}. Cette page donne aussi le stationnement et les itinéraires vers la boutique.`,
      sections: [
        s('Quelles sont les heures d’ouverture de la Pâtisserie Coco Vanille?', `La Pâtisserie Coco Vanille est ouverte ${OPEN_FR}; elle est fermée ${CLOSED_FR}. Le tableau de cette page, tenu à jour par la boutique, signale aussi les jours fériés et les fermetures exceptionnelles. Les annuaires en ligne affichent parfois d’autres horaires; le tableau de cette page fait foi.`),
        s('Comment se rendre au 3, rue Court?', `Le 3, rue Court est au centre-ville de Granby; les boutons Itinéraire ouvrent l’adresse dans Google Maps ou dans Plans d’Apple. Repère pour trouver la porte : ${fn('repère visuel près de la boutique, approuvé par le propriétaire')}.`),
        s('Où se stationner près de la Pâtisserie Coco Vanille?', `${PARKING_FR} ${PARKING_MORE_FR}`),
        s('À quelle distance du Zoo de Granby est la boutique?', `La Pâtisserie Coco Vanille est à ${ZOO_FR}. Le Zoo est au 1050, boulevard David-Bouchard Nord. Pour un arrêt en route, la commande en ligne permet de choisir une heure de cueillette. La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch.`),
        s('Comment joindre la boutique?', `Par téléphone, au 450-372-7177. Par courriel : bonjour@cocovanillegranby.com.`),
      ],
      faq: [
        q('Êtes-vous ouverts le dimanche?', `Oui : la boutique est ouverte ${SUNDAY_FR}. Les dimanches fériés et les fermetures exceptionnelles sont signalés dans le tableau des heures de cette page.`),
        q('Êtes-vous ouverts pendant le temps des Fêtes?', `Les heures des jours fériés et du temps des Fêtes sont publiées sur cette page avant chaque congé : ${fn('heures des Fêtes 2026')}.`),
        q('Y a-t-il des places assises?', `Oui : la boutique se décrit comme un endroit chaleureux où l’on peut s’installer pour prendre un café. Nombre de places : ${fn('nombre de places assises')}.`),
        q('La boutique est-elle accessible en fauteuil roulant?', `L’accès en fauteuil roulant reste à décrire par la boutique : ${fn('marches, largeur de porte et accès en fauteuil roulant')}.`),
        q('Pourquoi Google Maps écrit-il « Cocovanille »?', 'Google Maps écrit « Pâtisserie Cocovanille » en un mot, mais c’est bien la même boutique : la Pâtisserie Coco Vanille, au 3, rue Court, à Granby, au 450-372-7177.'),
        q('Livrez-vous à Bromont ou à Waterloo?', `La commande en ligne prévoit la cueillette au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
        q('Acceptez-vous les dollars américains?', `Les modes de paiement acceptés au comptoir restent à confirmer : ${fn('devises et modes de paiement acceptés au comptoir')}.`),
      ],
      changeNote: 'Stationnement (règles de la Ville en vigueur depuis le 12 juin 2026), trajet depuis le Zoo et places assises ajoutés; accès à la porte encore à confirmer par la boutique.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Hours and address: 3 rue Court, Granby · Coco Vanille',
      description: 'Address, opening hours and parking for Pâtisserie Coco Vanille at 3 rue Court in downtown Granby, Québec. Google Maps or Apple Maps directions and phone number.',
      h1: 'Visit us at 3 rue Court, in downtown Granby',
      answer:
        `Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec; phone: 450-372-7177. Hours: ${HOURS_EN}. This page also gives parking and directions to the shop, including from the Granby Zoo.`,
      sections: [
        s('What are Pâtisserie Coco Vanille’s opening hours?', `Pâtisserie Coco Vanille is open ${OPEN_EN}; it is closed ${CLOSED_EN}. The table on this page, kept up to date by the shop, also shows statutory holidays and exceptional closures. Online directories sometimes show other hours; the table on this page is the reference.`),
        s('How do I get to 3 rue Court?', `3 rue Court is in downtown Granby; the Directions buttons open the address in Google Maps or Apple Maps. Landmark to find the door: ${fn('visual landmark near the shop, approved by the owner')}.`),
        s('Where can I park near Pâtisserie Coco Vanille?', `${PARKING_EN} ${PARKING_MORE_EN}`),
        s('How far is the shop from the Granby Zoo?', `Pâtisserie Coco Vanille is ${ZOO_EN}. The Zoo is at 1050 boulevard David-Bouchard Nord. To stop on your way, online ordering lets you choose a pickup time. The From the Granby Zoo page gives the bus route, parking and the Zoo’s rules for bringing lunch.`),
        s('How do I contact the shop?', `By phone at 450-372-7177. By email: bonjour@cocovanillegranby.com.`),
      ],
      faq: [
        q('Are you open on Sunday?', `Yes: the shop is open ${SUNDAY_EN}, and Sunday statutory holidays and exceptional closures are shown in the hours table on this page.`),
        q('Are you open over the holidays?', `Holiday and statutory-holiday hours are posted on this page before each holiday: ${fn('2026 holiday hours')}.`),
        q('Is there seating?', `Yes: the shop describes itself as a warm place where you can sit down for a coffee. Number of seats: ${fn('number of seats')}.`),
        q('Is the shop wheelchair accessible?', `Wheelchair access is still to be described by the shop: ${fn('steps, door width and wheelchair access')}.`),
        q('Why does Google Maps say “Cocovanille”?', 'Google Maps writes “Pâtisserie Cocovanille” as one word, but it is the same shop: Pâtisserie Coco Vanille, 3 rue Court, Granby, 450-372-7177.'),
        q('Do you accept US dollars?', `Payment methods accepted at the counter are still to be confirmed: ${fn('currencies and payment methods accepted at the counter')}.`),
        q('Do you deliver to Bromont or Waterloo?', `Online orders are picked up at 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
      ],
      changeNote: 'Parking (City rules in force since June 12, 2026), the drive from the Zoo and seating added; access at the door still to be confirmed by the shop.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}

// ---------- About ----------
// ---------- Visitors of the Zoo de Granby (one page, child of Nous trouver; research/22d §1) ----------
// Facts: the drive range two routing engines agree on (20c Z-8); the bus (City brochure, July 2026, 20c Z-9, re-read
// 2026-10-29: the Zoo stop moves to rue Dorion in summer, direction centre-ville); the walks (OSRM foot and Valhalla,
// 20c P-7, Z-10 and 22d); the parking plans in force since 2026-06-12 (20c P-1, P-4, P-5, P-10); the Zoo's own FAQ,
// rules and « Horaire et directions » page (read 2026-10-29); the shop's posts of 2026-08-25, 09-05 and 09-20 (20b).
const zooDeGranby = {
  key: 'zoo-de-granby',
  status: 'core',
  locales: {
    fr: {
      title: 'Café et pâtisserie près du Zoo de Granby · Coco Vanille',
      description: 'À environ 5 à 8 minutes en auto du Zoo de Granby, la Pâtisserie Coco Vanille sert café, viennoiseries et salé au 3, rue Court. Trajet, autobus, stationnement.',
      h1: 'Café et pâtisserie près du Zoo de Granby',
      answer:
        `La Pâtisserie Coco Vanille est au 3, rue Court, au centre-ville de Granby, à environ 5 à 8 minutes en auto du Zoo de Granby. On y sert café, viennoiseries et salé, sur place ou à emporter. Elle est ouverte ${SUNDAY_FR} et fermée ${CLOSED_FR}.`,
      sections: [
        s('Combien de temps faut-il pour aller du Zoo de Granby à la boutique?', 'Il faut environ 5 à 8 minutes en auto pour aller du Zoo de Granby à la Pâtisserie Coco Vanille, soit 3 à 4 km selon le trajet, sans compter la circulation.', {
          body: 'Le calcul part du stationnement principal du Zoo, dont l’adresse pour les visiteurs est le 1050, boulevard David-Bouchard Nord, et va jusqu’au 3, rue Court. Selon votre GPS, le trajet passe par la rue Saint-Hubert et la rue Principale, ou par le boulevard David-Bouchard Nord et la rue Dufferin.\n\nMéthode : deux calculateurs d’itinéraire, OSRM et Valhalla, sur les données d’OpenStreetMap, le 29 octobre 2026. Les durées ne comptent ni la circulation, ni les feux, ni le temps pour se stationner.',
        }),
        s('Peut-on aller du Zoo à la boutique en autobus?', 'Oui : le circuit Nord du transport urbain de Granby, direction centre-ville, relie l’arrêt Saint-Hubert/Zoo au Terminus Centre-ville, rue du Centre, à environ 300 m à pied de la boutique. Horaires, tarifs et carte : granby.ca/fr/transport-urbain-granby.', {
          list: [
            'Prendre le circuit Nord, direction centre-ville, à l’arrêt Saint-Hubert/Zoo, déplacé sur la rue Dorion l’été',
            'Descendre au Terminus Centre-ville, rue du Centre',
            'Marcher environ 300 m par la rue du Centre, la rue Principale, puis la rue Court',
          ],
        }),
        s('Où se stationner au centre-ville en arrivant du Zoo?', 'Le stationnement municipal est gratuit au centre-ville de Granby, et le plus proche, le stationnement Centre-Court, est à environ 100 m de la boutique, entre les rues Court et du Centre.', {
          body: 'Ses cases de 4 h sont limitées du lundi au vendredi, de 8 h à 18 h; le samedi et le dimanche, ces cases n’ont pas de limite de temps, et certaines rangées n’en ont jamais. Le stationnement Johnson, au 18, rue Johnson, de l’autre côté de la rue Principale, a lui aussi des rangées sans limite de temps. Suivez toujours les panneaux; ces règles sont celles des plans de la Ville en vigueur depuis le 12 juin 2026.',
        }),
        s('Peut-on apporter au Zoo un lunch acheté à la boutique?', 'Oui : selon sa foire aux questions, le Zoo de Granby permet d’apporter son lunch, et plusieurs aires de pique-nique sont aménagées sur le site.', {
          body: 'Les règlements du Zoo interdisent toutefois les contenants de verre et les boissons alcoolisées apportées de l’extérieur (foire aux questions et règlements lus le 29 octobre 2026).\n\nLa Pâtisserie Coco Vanille vend, sur place ou à emporter, des viennoiseries, des pâtisseries, des sandwichs et du salé, comme des feuilletés, des mini pizzas et des pastillas au poulet, selon ses publications d’août et de septembre 2026.',
        }),
        s('Peut-on sortir du Zoo pour un café et revenir le même jour?', 'Oui : selon sa foire aux questions, le Zoo de Granby permet de sortir et de revenir pendant la journée en faisant étamper sa main à la sortie, même s’il encourage à limiter les entrées et sorties.', {
          body: 'Au 3, rue Court, la boutique sert le café, l’espresso, le latte et le chocolat chaud, et des boissons froides comme le café glacé et le matcha, sur place ou à emporter (liste publiée par la boutique en 2026).',
        }),
      ],
      faq: [
        q('C’est-tu ouvert le lundi?', `Non : la Pâtisserie Coco Vanille est fermée ${CLOSED_FR}. Elle est ouverte ${OPEN_FR}; les jours fériés et les fermetures exceptionnelles sont dans le tableau des heures de la page Nous trouver.`),
        q('Peut-on s’asseoir pour prendre un café?', 'Oui : dans sa publication d’août 2026, la boutique se présente comme un endroit où l’on peut s’installer pour prendre un café; le café et le salé se vendent aussi à emporter.'),
        q('La Pâtisserie Coco Vanille est-elle sur le site du Zoo?', 'Non : la Pâtisserie Coco Vanille est au centre-ville de Granby, au 3, rue Court, à environ 3 à 4 km du Zoo par la route. Le Zoo a ses propres points de restauration sur le site, selon sa foire aux questions.'),
        q('Offrez-vous des ateliers créatifs?', 'Oui : la Pâtisserie Coco Vanille offre des ateliers créatifs du vendredi au dimanche, sur réservation au 438-528-7818. Un atelier de peinture, ou de décoration de perles et de strass sur un objet de votre choix, dure 2 h 30 et coûte 37 $ par personne, avec le matériel, une boisson et une part de gâteau. Les places sont limitées.'),
        q('Quelle adresse entrer dans le GPS pour le Zoo de Granby?', 'Pour s’y rendre, le Zoo de Granby donne l’adresse du 1050, boulevard David-Bouchard Nord, à Granby (J2H 0Y6), sur sa page Horaire et directions, où se trouve aussi son horaire : zoodegranby.com/horaire. Pour la boutique, entrez le 3, rue Court, à Granby (J2G 4Y6).'),
        q('Peut-on commander à l’avance pour passer en allant au Zoo?', 'Oui, pour les produits qui ont des plages de cueillette ce jour-là : commandez sur la page Commander ou par téléphone au 450-372-7177, puis passez au 3, rue Court pendant votre plage.'),
      ],
      changeNote: 'Première version : trajet depuis le Zoo calculé le 29 octobre 2026; règles du Zoo et plans de stationnement de la Ville lus le même jour.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Bakery and café near the Granby Zoo, Québec · Coco Vanille',
      description: 'About 5 to 8 minutes by car from the Granby Zoo, Pâtisserie Coco Vanille serves coffee, viennoiseries and savoury food at 3 rue Court. Route, bus and parking.',
      h1: 'Bakery and café near the Granby Zoo',
      answer:
        `Pâtisserie Coco Vanille is at 3 rue Court in downtown Granby, Québec, about 5 to 8 minutes by car from the Granby Zoo. You can have coffee, viennoiseries and savoury snacks there, to stay or to go. The shop is open ${SUNDAY_EN} and closed ${CLOSED_EN}.`,
      sections: [
        s('How long does it take to get from the Granby Zoo to the shop?', 'It takes about 5 to 8 minutes by car to get from the Granby Zoo to Pâtisserie Coco Vanille, or 3 to 4 km depending on the route, not counting traffic.', {
          body: 'The calculation runs from the Zoo’s main parking lot, whose visitor address is 1050 boulevard David-Bouchard Nord, to 3 rue Court. Depending on your GPS, the route takes rue Saint-Hubert and rue Principale, or boulevard David-Bouchard Nord and rue Dufferin.\n\nMethod: two route planners, OSRM and Valhalla, on OpenStreetMap data, on October 29, 2026. The times count neither traffic, nor traffic lights, nor the time to park.',
        }),
        s('Can I take the bus from the Zoo to the shop?', 'Yes: the Circuit Nord of Granby’s city buses, towards downtown, links the Saint-Hubert/Zoo stop to the Terminus Centre-ville on rue du Centre, about 300 m on foot from the shop. Schedules, fares and map: granby.ca/fr/transport-urbain-granby.', {
          list: [
            'Take the Circuit Nord towards downtown at the Saint-Hubert/Zoo stop, moved to rue Dorion in summer',
            'Get off at the Terminus Centre-ville, rue du Centre',
            'Walk about 300 m along rue du Centre, rue Principale, then rue Court',
          ],
        }),
        s('Where can I park downtown when coming from the Zoo?', 'Municipal parking is free in downtown Granby, and the closest lot, Centre-Court, is about 100 m from the shop, between rue Court and rue du Centre.', {
          body: 'Its 4-hour spaces are limited Monday to Friday, from 8 a.m. to 6 p.m.; on Saturday and Sunday these spaces have no time limit, and some rows never do. The Johnson lot, at 18 rue Johnson, across rue Principale, also has rows with no time limit. Always follow the signs; these rules are those of the City’s plans in force since June 12, 2026.',
        }),
        s('Can I bring a lunch from the shop into the Zoo?', 'Yes: according to its FAQ, the Granby Zoo lets visitors enjoy their own lunch on site, and several picnic areas are set up.', {
          body: 'The Zoo’s rules, however, ban glass containers and alcoholic drinks brought from outside (FAQ and rules read on October 29, 2026).\n\nPâtisserie Coco Vanille sells viennoiseries, pastries, sandwiches and savoury snacks such as puff pastries, mini pizzas and chicken pastillas, to stay or to go, according to its posts of August and September 2026.',
        }),
        s('Can I leave the Zoo for a coffee and come back the same day?', 'Yes: according to its FAQ, the Granby Zoo lets you leave and come back during the day if you have your hand stamped at the gate, although it encourages visitors to limit their comings and goings.', {
          body: 'At 3 rue Court, the shop serves coffee, espresso, latte and hot chocolate, and cold drinks such as iced coffee and matcha, to stay or to go (list published by the shop in 2026).',
        }),
      ],
      faq: [
        q('Are you open on Monday?', `No: Pâtisserie Coco Vanille is closed ${CLOSED_EN}. It is open ${OPEN_EN}; statutory holidays and exceptional closures are in the hours table on the Visit page.`),
        q('Can I sit down for a coffee?', 'Yes: in its post of August 2026, the shop presents itself as a place where you can sit down for a coffee; coffee and savoury food are also sold to go.'),
        q('Is Pâtisserie Coco Vanille inside the Zoo?', 'No: Pâtisserie Coco Vanille is in downtown Granby, at 3 rue Court, about 3 to 4 km from the Zoo by road. The Zoo has its own food outlets on site, according to its FAQ.'),
        q('Do you offer creative workshops?', 'Yes: Pâtisserie Coco Vanille offers creative workshops Friday to Sunday, by reservation at 438-528-7818. A workshop of painting, or of decorating an item of your choice with beads and rhinestones, lasts 2.5 hours and costs $37 per person, with the materials, one drink and one slice of cake. Places are limited.'),
        q('What address should I enter in my GPS for the Granby Zoo?', 'For directions, the Granby Zoo gives 1050 boulevard David-Bouchard Nord, Granby (J2H 0Y6), on its Schedule and directions page, which also has its hours: zoodegranby.com/en/schedule. For the shop, enter 3 rue Court, Granby (J2G 4Y6).'),
        q('Can I pre-order pastries for pickup on the way to the Zoo?', 'Yes, when the products have pickup slots that day: order on the Order page or by phone at 450-372-7177, then pick up at 3 rue Court during your slot.'),
      ],
      changeNote: 'First version: the drive from the Zoo was calculated on October 29, 2026; the Zoo’s rules and the City’s parking plans were read the same day.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}

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
        q('Où voir des photos de la boutique?', 'Les photos publiées par la boutique sont sur son compte Instagram, @coco_vanillegranby, et sur sa page Facebook, facebook.com/PatisserieCocoVanille. Sur ce site, toute photo qui n’est pas celle de la boutique porte la mention « Photo d’illustration ».'),
        q('Comment joindre la Pâtisserie Coco Vanille?', `Par téléphone, au 450-372-7177, ou en personne au 3, rue Court, à Granby. Courriel : bonjour@cocovanillegranby.com.`),
      ],
      changeNote: 'Compte Instagram et courriel de la boutique ajoutés; équipe à présenter avec son accord.',
      contentUpdatedAt: UPDATED_1029,
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
        q('Where can I see photos of the shop?', 'Photos posted by the shop are on its Instagram account, @coco_vanillegranby, and its Facebook page, facebook.com/PatisserieCocoVanille. On this site, any photo that is not the shop’s own is labelled “Illustrative photo”.'),
        q('How do I contact Pâtisserie Coco Vanille?', `By phone at 450-372-7177, or in person at 3 rue Court, Granby. Email: bonjour@cocovanillegranby.com.`),
      ],
      changeNote: 'Instagram account and shop email added; team to be introduced with consent.',
      contentUpdatedAt: UPDATED_1029,
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
      description: 'Allergènes de chaque produit de la Pâtisserie Coco Vanille, à Granby, affichés une fois vérifiés par une personne. Une allergie? Appelez avant de commander.',
      h1: 'Allergènes et allergies alimentaires',
      answer:
        'La Pâtisserie Coco Vanille, à Granby, indique pour chaque produit les allergènes prioritaires qu’il contient, une fois la liste vérifiée par une personne de l’équipe. Ce site ne présente aucun produit comme « sans gluten », « sans noix » ou « sans arachides ». En cas d’allergie, appelez au 450-372-7177 avant de commander.',
      sections: [
        s('Quels allergènes la Pâtisserie Coco Vanille indique-t-elle?', 'La Pâtisserie Coco Vanille indique les allergènes prioritaires reconnus par Santé Canada et l’Agence canadienne d’inspection des aliments, plus les sources de gluten.', {
          list: ['Œufs', 'Lait', 'Moutarde', 'Arachides', 'Crustacés et mollusques', 'Poisson', 'Sésame', 'Soya', 'Sulfites', 'Noix', 'Blé et triticale', 'Sources de gluten : orge, avoine, seigle'],
        }),
        s('Avez-vous des produits sans gluten ou sans noix?', 'Ce site ne présente aucun produit comme « sans gluten », « sans noix » ou « sans arachides ». Au Canada, « sans gluten » est une allégation encadrée : le produit ne doit contenir aucune protéine de gluten, et le gluten venu d’une contamination croisée doit rester sous 20 ppm.'),
        s('Y a-t-il un risque de contamination croisée?', `Le risque dépend des ingrédients manipulés dans la même cuisine, que la boutique doit confirmer : ${fn('allergènes manipulés dans la cuisine et précautions contre la contamination croisée')}. La mention « Peut contenir » n’apparaît que lorsqu’un risque réel demeure.`),
        s('Comment les allergènes sont-ils vérifiés?', 'Chaque liste d’allergènes est vérifiée et datée par une personne de l’équipe, jamais générée automatiquement. Tant qu’un produit n’est pas vérifié, sa page le dit au lieu d’afficher une liste incomplète.'),
        s('Que faire en cas d’allergie grave?', 'Appelez la boutique au 450-372-7177 avant de commander pour parler des ingrédients et de la préparation. Dans le formulaire de commande, la note d’allergie est facultative et sert seulement à préparer votre commande.'),
      ],
      faq: [
        q('Le croissant aux amandes contient-il des noix?', 'Oui : l’amande fait partie des noix, un des allergènes prioritaires. Sa liste complète paraît sur sa page une fois vérifiée par une personne de l’équipe.'),
        q('Que veut dire « Peut contenir »?', '« Peut contenir » signale un risque de contamination croisée qui demeure malgré les précautions. La Pâtisserie Coco Vanille l’utilise seulement quand ce risque est réel, jamais comme mention générale.'),
        q('Avez-vous des gâteaux sans lactose ou véganes?', `Ce site ne présente aucun produit comme « sans lactose » ou « végane ». Produits préparés sans lait ou sans œufs : ${fn('produits sans lait ou sans œufs, s’il y en a')}.`),
        q('Puis-je indiquer une allergie dans ma commande?', 'Oui : le formulaire de commande a un champ facultatif pour une allergie. Cette note sert seulement à préparer votre commande; elle n’est jamais copiée dans les courriels ou les textos.'),
        q('Où trouver la liste des ingrédients?', `La page de chaque produit affiche ses allergènes une fois vérifiés. Liste complète des ingrédients : ${fn('liste des ingrédients par produit')}.`),
        q('Les allergènes sont-ils affichés en boutique?', `L’affichage des allergènes au comptoir reste à confirmer par la boutique : ${fn('affichage des allergènes en boutique')}.`),
      ],
      changeNote: 'Les mentions « sans gluten » décrivent désormais ce site; vérification par produit en cours.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Allergies and allergens in Granby · Pâtisserie Coco Vanille',
      description: 'Allergens for every Pâtisserie Coco Vanille product in Granby, Québec, shown once a person has checked them. If you have an allergy, call before you order.',
      h1: 'Allergens and food allergies',
      answer:
        'Pâtisserie Coco Vanille in Granby, Québec, shows the priority allergens each product contains, once a team member has checked the list. This website presents no product as “gluten-free”, “nut-free” or “peanut-free”. If you have an allergy, call 450-372-7177 before you order, to talk about ingredients and preparation.',
      sections: [
        s('Which allergens does Pâtisserie Coco Vanille list?', 'Pâtisserie Coco Vanille lists the priority allergens recognised by Health Canada and the Canadian Food Inspection Agency, plus gluten sources.', {
          list: ['Eggs', 'Milk', 'Mustard', 'Peanuts', 'Crustaceans and molluscs', 'Fish', 'Sesame', 'Soy', 'Sulphites', 'Tree nuts', 'Wheat and triticale', 'Gluten sources: barley, oats, rye'],
        }),
        s('Do you have gluten-free or nut-free products?', 'This website does not label any product “gluten-free”, “nut-free” or “peanut-free”. In Canada, “gluten-free” is a regulated claim: the food must contain no gluten protein, and gluten from cross-contact must stay under 20 ppm.'),
        s('Is there a risk of cross-contact?', `The risk depends on the ingredients handled in the same kitchen, which the shop still has to confirm: ${fn('allergens handled in the kitchen and cross-contact precautions')}. “May contain” only appears when a real risk remains.`),
        s('How are allergens checked?', 'Each allergen list is checked and dated by a team member, never generated automatically. Until a product is checked, its page says so instead of showing an incomplete list.'),
        s('What should I do if I have a severe allergy?', 'Call the shop at 450-372-7177 before you order to talk about ingredients and preparation. On the order form, the allergy note is optional and is only used to prepare your order.'),
      ],
      faq: [
        q('Does the almond croissant contain tree nuts?', 'Yes: almonds are tree nuts, one of the priority allergens. Its full list appears on its page once a team member has checked it.'),
        q('What does “may contain” mean?', '“May contain” flags a cross-contact risk that remains despite precautions. Pâtisserie Coco Vanille only uses it when that risk is real, never as a blanket statement.'),
        q('Do you have lactose-free or vegan cakes?', `This website does not label any product “lactose-free” or “vegan”. Products made without milk or eggs: ${fn('products without milk or eggs, if any')}.`),
        q('Can I mention an allergy in my order?', 'Yes: the order form has an optional allergy field. That note is only used to prepare your order; it is never copied into emails or text messages.'),
        q('Where can I find the ingredient list?', `Each product page shows its allergens once they are checked. Full ingredient list: ${fn('ingredient list per product')}.`),
        q('Are allergens posted in the shop?', `Allergen information at the counter is still to be confirmed by the shop: ${fn('allergen display in the shop')}.`),
      ],
      changeNote: 'The “gluten-free” wording now describes this website; per-product checks in progress.',
      contentUpdatedAt: UPDATED_1029,
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
        'Cette page de la Pâtisserie Coco Vanille, à Granby, répond aux questions des clients sur la boutique du 3, rue Court : commande et cueillette, délais, prix, portions, allergènes, heures, stationnement et ateliers. Chaque réponse commence par l’essentiel, puis renvoie à la page qui donne le détail.',
      sections: [
        s('Comment commander à la Pâtisserie Coco Vanille?', 'Vous commandez en ligne sur la page Commander, ou par téléphone au 450-372-7177, pour une cueillette au 3, rue Court. Les deux passent par le même calendrier, qui affiche seulement les dates possibles.'),
        s('Combien coûte un gâteau de fête?', `Le prix d’un gâteau de fête dépend du format et du nombre de portions : ${fn('prix des gâteaux par format')}. La page Prix affiche chaque format avec son prix en texte, avant taxes, et la date de mise à jour; elle sert aussi pour un gâteau d’anniversaire sur commande.`),
        s('Quelle grosseur de gâteau pour 20 personnes?', `Pour 20 personnes, le bon format dépend du nombre de portions par taille, que la boutique doit fournir : ${fn('portions par format de gâteau')}. Le calculateur de portions donne la réponse dès que ces chiffres sont publiés.`),
        s('Quelles sont les heures d’ouverture?', `La boutique est ouverte ${OPEN_FR}; elle est fermée ${CLOSED_FR}. Le tableau de la page Nous trouver, tenu à jour par la boutique, donne aussi les jours fériés et les fermetures exceptionnelles.`),
        s('Offrez-vous des ateliers?', `Oui : la Pâtisserie Coco Vanille offre des ateliers créatifs sur réservation, les vendredis, samedis et dimanches : de la peinture, ou de la décoration de perles et de strass, sur un objet de votre choix. Un atelier dure 2 h 30 et coûte 37 $ par personne, avec le matériel, une boisson et une part de gâteau; les places sont limitées. Pour réserver, appelez le 438-528-7818. Âges et heures de début : ${fn('âges et heures de début des ateliers')}.`),
        s('Y a-t-il une pâtisserie près du Zoo de Granby?', `Oui : la Pâtisserie Coco Vanille est au centre-ville de Granby, au 3, rue Court, à ${ZOO_FR}. La page Depuis le Zoo de Granby donne le trajet en autobus, le stationnement et les règles du Zoo pour le lunch.`),
      ],
      faq: [
        q('Combien de jours d’avance faut-il commander un gâteau personnalisé?', `Le délai dépend du type de gâteau : ${fn('délai minimum par type de gâteau, en jours')}. Le calendrier de la page Commander propose toujours la première date possible.`),
        q('Est-ce que mon gâteau va ressembler à la photo?', 'Vous joignez une photo de référence à votre demande et recevez un récapitulatif écrit avant la préparation. Rien n’est préparé sans votre approbation.'),
        q('Faut-il un dépôt? Puis-je annuler?', `Un acompte de ${DEPOSIT_FR} réserve la date d’un gâteau personnalisé. Les règles d’annulation et de remboursement sont écrites dans les conditions de vente, avant le paiement.`),
        q('Faites-vous la livraison?', `La commande en ligne prévoit la cueillette au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
        q('Avez-vous des gâteaux sans noix ou sans gluten?', 'Ce site ne fait aucune allégation « sans noix » ou « sans gluten ». Les allergènes de chaque produit sont sur la page Allergènes, une fois vérifiés.'),
        q('Où se stationner près de la Pâtisserie Coco Vanille?', `${PARKING_FR} La page Nous trouver donne les limites de temps et un deuxième stationnement, à environ 120 m.`),
        q('Vendez-vous des cartes-cadeaux?', 'Le site ne vend pas de cartes-cadeaux pour l’instant; pour savoir si la boutique en offre au comptoir, appelez au 450-372-7177. Au Québec, la carte-cadeau d’un commerce n’a pas de date d’expiration, et aucuns frais ne peuvent être exigés pour sa délivrance ou son utilisation.'),
        q('Peut-on payer comptant à la cueillette?', `Le paiement en ligne se fait par carte. Paiement à la cueillette : ${fn('paiement comptant ou par carte à la cueillette')}.`),
      ],
      changeNote: 'Stationnement et pâtisserie près du Zoo ajoutés; réponse sur les cartes-cadeaux précisée selon la Loi sur la protection du consommateur.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'FAQ: orders, hours and cakes · Pâtisserie Coco Vanille',
      description: 'Frequently asked questions about Pâtisserie Coco Vanille in Granby, Québec: ordering and pickup, lead times, prices, servings, allergens, hours, parking.',
      h1: 'Frequently asked questions about Pâtisserie Coco Vanille',
      answer:
        'This page of Pâtisserie Coco Vanille in Granby, Québec, answers customers’ questions about the shop at 3 rue Court: ordering and pickup, lead times, prices, servings, allergens, hours, parking and workshops. Each answer starts with the essentials, then points to the page that has the details.',
      sections: [
        s('How do I order from Pâtisserie Coco Vanille?', 'You order online on the Order page, or by phone at 450-372-7177, for pickup at 3 rue Court. Both use the same calendar, which only shows the dates that are possible.'),
        s('How much is a custom birthday cake?', `The price of a birthday cake depends on the size and the number of servings: ${fn('cake prices per size')}. The Prices page shows each size with its price as text, before taxes, and the date it was updated.`),
        s('What size cake for 20 people?', `For 20 people, the right size depends on the number of servings per size, which the shop still has to provide: ${fn('servings per cake size')}. The serving calculator gives the answer as soon as those numbers are published.`),
        s('What are the opening hours?', `The shop is open ${OPEN_EN}; it is closed ${CLOSED_EN}. The table on the Visit page, kept up to date by the shop, also shows statutory holidays and exceptional closures.`),
        s('Do you offer workshops?', `Yes: Pâtisserie Coco Vanille offers creative workshops by reservation on Fridays, Saturdays and Sundays: painting, or decorating an item of your choice with beads and rhinestones. A workshop lasts 2.5 hours and costs $37 per person, with the materials, one drink and one slice of cake; places are limited. To book, call 438-528-7818. Ages and start times: ${fn('workshop ages and start times')}.`),
        s('Is there a bakery near the Granby Zoo?', `Yes: Pâtisserie Coco Vanille, a pastry shop and bakery at 3 rue Court in downtown Granby, is ${ZOO_EN}. The From the Granby Zoo page gives the bus route, parking and the Zoo’s rules for bringing lunch.`),
      ],
      faq: [
        q('How far in advance should I order a custom cake?', `The lead time depends on the type of cake: ${fn('minimum lead time per cake type, in days')}. The calendar on the Order page always offers the first possible date.`),
        q('Will my cake look like the photo?', 'You attach a reference photo to your request and receive a written summary before anything is made. Nothing is made without your approval.'),
        q('Is there a deposit? Can I cancel?', `A deposit of ${DEPOSIT_EN} holds the date for a custom cake. The cancellation and refund rules are written in the conditions of sale, before you pay.`),
        q('Do you deliver?', `Online orders are picked up at 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
        q('Do you have nut-free or gluten-free cakes?', 'This website makes no “nut-free” or “gluten-free” claims. Each product’s allergens are on the Allergens page once checked.'),
        q('Where can I park near Pâtisserie Coco Vanille?', `${PARKING_EN} The Visit page gives the time limits and a second lot, about 120 m away.`),
        q('Do you sell gift cards?', 'The website does not sell gift cards for now; to find out whether the shop offers them at the counter, call 450-372-7177. In Québec, a shop’s gift card has no expiry date, and no fee can be charged to issue or use it.'),
        q('Can I pay cash at pickup?', `Online payment is by card. Payment at pickup: ${fn('cash or card payment at pickup')}.`),
      ],
      changeNote: 'Parking and a bakery near the Zoo added; gift-card answer made precise under the Consumer Protection Act.',
      contentUpdatedAt: UPDATED_1029,
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
        `La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, propose des viennoiseries, dont le croissant aux amandes. Chaque viennoiserie a sa page avec son prix écrit en texte et, une fois vérifiés, ses allergènes; tout se récupère en boutique. Liste du jour et heures de sortie du four : ${fn('viennoiseries offertes et heures de cuisson')}.`,
      sections: [
        s('Quelles viennoiseries trouve-t-on à la Pâtisserie Coco Vanille?', `On y trouve le croissant aux amandes, que les clients citent souvent dans leurs avis. La liste complète des viennoiseries reste à confirmer par la boutique : ${fn('liste des viennoiseries')}.`),
        s('Qu’est-ce qu’une viennoiserie?', 'Une viennoiserie est un produit de boulangerie à pâte levée, souvent feuilletée et enrichie de beurre, de sucre ou d’œufs, comme le croissant ou la brioche. Elle se situe entre le pain et la pâtisserie.'),
        s('À quelle heure les croissants sont-ils prêts le matin?', `L’heure de sortie du four reste à confirmer par la boutique : ${fn('heure de sortie des croissants le matin')}. La vitrine du jour, sur la page d’accueil, montre ce qui est en vente aujourd’hui.`),
        s('Peut-on commander des viennoiseries pour une réunion?', `Les boîtes de viennoiseries pour les réunions restent à confirmer : ${fn('boîtes de viennoiseries pour groupes offertes ou non, quantité minimale et délai')}.`),
      ],
      faq: [
        q('Faites-vous des chocolatines?', `La chocolatine (pain au chocolat) reste à confirmer à la carte : ${fn('chocolatines offertes ou non')}.`),
        q('Le croissant aux amandes contient-il des noix?', 'Oui : l’amande est une noix, un des allergènes prioritaires. La page du croissant aux amandes affiche sa liste d’allergènes une fois vérifiée.'),
        q('Combien coûte un croissant?', `Le prix de chaque viennoiserie est écrit en texte sur sa page : ${fn('prix des viennoiseries')}.`),
        q('Peut-on réserver des croissants pour le lendemain?', `La réservation des viennoiseries reste à confirmer : ${fn('réservation de viennoiseries pour le lendemain')}. Les produits commandables apparaissent sur la page Commander.`),
        q('Les viennoiseries sont-elles faites le matin même?', `Le moment de cuisson reste à confirmer par la boutique : ${fn('viennoiseries cuites le matin même ou non')}.`),
      ],
      changeNote: 'Allergènes affichés seulement une fois vérifiés; liste des viennoiseries et heures de cuisson à confirmer.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Croissants and viennoiseries in Granby · Coco Vanille',
      description: 'Croissants and viennoiseries from Pâtisserie Coco Vanille, 3 rue Court in downtown Granby, Québec, including the almond croissant. Prices and allergens as text.',
      h1: 'Croissants and viennoiseries in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes viennoiseries, including the almond croissant. Each viennoiserie has its own page with its price written as text and, once checked, its allergens; everything is picked up at the shop. Today’s list and baking times: ${fn('viennoiseries offered and baking times')}.`,
      sections: [
        s('Which viennoiseries does Pâtisserie Coco Vanille make?', `The almond croissant, which customers often mention in their reviews. The full list of viennoiseries is still to be confirmed by the shop: ${fn('list of viennoiseries')}.`),
        s('What is a viennoiserie?', 'A viennoiserie is a yeast-raised baked good, often laminated and enriched with butter, sugar or eggs, like a croissant or a brioche. It sits between bread and pastry.'),
        s('What time are the croissants ready in the morning?', `The time the croissants come out of the oven is still to be confirmed by the shop: ${fn('time the croissants are ready in the morning')}. Today’s display case, on the home page, shows what is for sale today.`),
        s('Can I order viennoiseries for a meeting?', `Viennoiserie boxes for meetings are still to be confirmed: ${fn('group viennoiserie boxes offered or not, minimum quantity and lead time')}.`),
      ],
      faq: [
        q('Do you make chocolatines?', `The chocolatine (chocolate croissant, pain au chocolat) is still to be confirmed on the menu: ${fn('chocolatines offered or not')}.`),
        q('Does the almond croissant contain tree nuts?', 'Yes: almonds are tree nuts, one of the priority allergens. The almond croissant page shows its allergen list once it is checked.'),
        q('How much is a croissant?', `Each viennoiserie’s price is written as text on its page: ${fn('viennoiserie prices')}.`),
        q('Can I reserve croissants for the next day?', `Reserving viennoiseries is still to be confirmed: ${fn('next-day viennoiserie reservations')}. Products you can order appear on the Order page.`),
        q('Are the viennoiseries baked the same morning?', `Baking times are still to be confirmed by the shop: ${fn('viennoiseries baked the same morning or not')}.`),
      ],
      changeNote: 'Allergens shown only once checked; list of viennoiseries and baking times to be confirmed.',
      contentUpdatedAt: UPDATED_1029,
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
        `La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, fait des pains et des baguettes à récupérer en boutique. La page de chaque pain affiche son prix écrit en texte et, une fois vérifiés, ses allergènes. Variétés de pains et heures de sortie du four : ${fn('pains offerts et heures de cuisson')}.`,
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
        q('Faites-vous du pain sans gluten?', 'Ce site ne présente aucun pain comme « sans gluten ». Les allergènes de chaque pain sont sur la page Allergènes, une fois vérifiés.'),
        q('Peut-on commander du pain en grande quantité?', `Les commandes de pain en grande quantité restent à confirmer : ${fn('commandes de pain en quantité, minimum et délai')}.`),
      ],
      changeNote: 'Allergènes et mention « sans gluten » précisés; variétés de pains et heures de cuisson à confirmer.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Bread and baguettes in Granby · Pâtisserie Coco Vanille',
      description: 'Bread and baguettes from Pâtisserie Coco Vanille, 3 rue Court in downtown Granby, Québec, for pickup at the shop. Prices, allergens and varieties shown as text.',
      h1: 'Bread and baguettes in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes bread and baguettes for pickup at the shop. Each bread’s page shows its price written as text and, once checked, its allergens. Bread varieties and the times they come out of the oven: ${fn('breads offered and baking times')}.`,
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
        q('Do you make gluten-free bread?', 'This website does not label any bread “gluten-free”. Each bread’s allergens are on the Allergens page once checked.'),
        q('Can I order bread in large quantities?', `Large bread orders are still to be confirmed: ${fn('bulk bread orders, minimum and lead time')}.`),
      ],
      changeNote: 'Allergens and the “gluten-free” wording made precise; bread varieties and baking times to be confirmed.',
      contentUpdatedAt: UPDATED_1029,
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
        s('Quels gâteaux la Pâtisserie Coco Vanille prépare-t-elle?', `La Pâtisserie Coco Vanille, à Granby, prépare des gâteaux personnalisés sur commande pour les anniversaires et les occasions spéciales, selon la liste de son offre publiée en août 2026. Le gâteau aux framboises et le shortcake aux fraises sont à la carte. Les autres gâteaux, saveurs et décors restent à confirmer par la boutique : ${fn('liste des gâteaux, saveurs et décors')}.`),
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
      changeNote: 'Gâteaux personnalisés décrits selon l’offre publiée par la boutique; formats, portions, prix et délais encore à confirmer.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Birthday cakes to order in Granby, Québec · Coco Vanille',
      description: 'Birthday cakes and cakes to order from Pâtisserie Coco Vanille, 3 rue Court, Granby, Québec: sizes, servings, prices as text and the lead time for each cake.',
      h1: 'Birthday cakes and cakes to order in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes cakes to order for pickup at the shop, including the raspberry cake and the strawberry shortcake. Each cake has its own page with its sizes, servings and price as text. Lead time: ${fn('minimum lead time per cake type')}.`,
      sections: [
        s('Which cakes does Pâtisserie Coco Vanille make?', `Pâtisserie Coco Vanille in Granby makes custom cakes to order for birthdays and special occasions, according to the list of its offer published in August 2026. The raspberry cake and the strawberry shortcake are on the menu. Other cakes, flavours and decorations are still to be confirmed by the shop: ${fn('list of cakes, flavours and decorations')}.`),
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
      changeNote: 'Custom cakes described from the shop’s published offer; sizes, servings, prices and lead times still to be confirmed.',
      contentUpdatedAt: UPDATED_1029,
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
        `La Pâtisserie Coco Vanille, au 3, rue Court, au centre-ville de Granby, propose des pâtisseries sucrées et salées, dont le Paris-Brest et le vol-au-vent. Chaque pâtisserie a sa page avec son prix écrit en texte et, une fois vérifiés, ses allergènes. Pâtisseries offertes cette saison : ${fn('liste des pâtisseries offertes')}.`,
      sections: [
        s('Quelles pâtisseries trouve-t-on à la Pâtisserie Coco Vanille?', `Le Paris-Brest et le vol-au-vent sont à la carte de la Pâtisserie Coco Vanille. Les autres pâtisseries restent à confirmer par la boutique : ${fn('liste des pâtisseries')}.`),
        s('Qu’est-ce qu’un Paris-Brest?', `Le Paris-Brest est une couronne de pâte à choux garnie de crème pralinée; sa forme rappelle une roue de vélo, en hommage à la course cycliste Paris-Brest-Paris. Garniture du Paris-Brest de la boutique : ${fn('garniture du Paris-Brest')}.`),
        s('Qu’est-ce qu’un vol-au-vent?', `Un vol-au-vent est une bouchée creuse de pâte feuilletée, garnie d’une préparation salée chaude, souvent du poulet en sauce. Garniture du vol-au-vent de la boutique : ${fn('garniture du vol-au-vent')}.`),
        s('Peut-on commander des pâtisseries à l’avance?', 'Oui, pour les pâtisseries marquées commandables : la page Commander les affiche avec leur délai, et la boutique prend aussi les commandes au 450-372-7177.'),
      ],
      faq: [
        q('Le Paris-Brest contient-il des noix?', 'La crème pralinée classique est faite de noisettes ou d’amandes, deux noix. La liste du Paris-Brest de la boutique paraît sur sa page une fois vérifiée.'),
        q('Combien coûte un Paris-Brest?', `Le prix de chaque pâtisserie est écrit en texte sur sa page : ${fn('prix des pâtisseries')}.`),
        q('Les pâtisseries se conservent-elles jusqu’au lendemain?', `Les consignes de conservation de la boutique restent à confirmer : ${fn('consignes de conservation des pâtisseries à la crème')}.`),
        q('Faites-vous des tartes?', `Les tartes restent à confirmer à la carte : ${fn('tartes offertes ou non')}.`),
        q('Peut-on commander des pâtisseries pour un événement?', `Les commandes de pâtisseries en quantité restent à confirmer : ${fn('commandes de pâtisseries pour événements, minimum et délai')}.`),
        q('Avez-vous du salé pour le dîner?', 'Oui : la Pâtisserie Coco Vanille, à Granby, annonce du salé, sur place ou à emporter : des feuilletés, des mini pizzas, des pastillas au poulet et des sandwichs, selon ses publications de septembre 2026. Pour un pique-nique au Zoo de Granby, la page Depuis le Zoo de Granby donne le trajet et les règles du Zoo.'),
      ],
      changeNote: 'Salé pour le dîner ajouté; allergènes affichés seulement une fois vérifiés; liste des pâtisseries et garnitures à confirmer.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Paris-Brest and pastries in Granby · Coco Vanille',
      description: 'Pastries from Pâtisserie Coco Vanille, 3 rue Court, Granby, Québec: Paris-Brest, vol-au-vent and other French classics, with prices and allergens as text.',
      h1: 'Pastries in Granby, from Paris-Brest to vol-au-vent',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in downtown Granby, Québec, makes sweet and savoury pastries, including the Paris-Brest and the vol-au-vent. Each pastry has its own page with its price written as text and, once checked, its allergens. Pastries offered this season: ${fn('list of pastries offered')}.`,
      sections: [
        s('Which pastries does Pâtisserie Coco Vanille make?', `The Paris-Brest and the vol-au-vent are on the Pâtisserie Coco Vanille menu. Other pastries are still to be confirmed by the shop: ${fn('list of pastries')}.`),
        s('What is a Paris-Brest?', `A Paris-Brest is a ring of choux pastry filled with praline cream; its shape recalls a bicycle wheel, in honour of the Paris-Brest-Paris cycling race. The shop’s Paris-Brest filling: ${fn('Paris-Brest filling')}.`),
        s('What is a vol-au-vent?', `A vol-au-vent is a hollow puff-pastry case filled with a hot savoury mixture, often chicken in sauce. The shop’s vol-au-vent filling: ${fn('vol-au-vent filling')}.`),
        s('Can I order pastries ahead?', 'Yes, for pastries marked as orderable: the Order page lists them with their lead time, and the shop also takes orders at 450-372-7177.'),
      ],
      faq: [
        q('Does the Paris-Brest contain tree nuts?', 'Classic praline cream is made from hazelnuts or almonds, both tree nuts. The list for the shop’s Paris-Brest appears on its page once checked.'),
        q('How much is a Paris-Brest?', `Each pastry’s price is written as text on its page: ${fn('pastry prices')}.`),
        q('Do pastries keep until the next day?', `The shop’s storage instructions are still to be confirmed: ${fn('storage instructions for cream pastries')}.`),
        q('Do you make tarts?', `Tarts are still to be confirmed on the menu: ${fn('tarts offered or not')}.`),
        q('Can I order pastries for an event?', `Large pastry orders are still to be confirmed: ${fn('pastry orders for events, minimum and lead time')}.`),
        q('Do you have savoury food for lunch?', 'Yes: Pâtisserie Coco Vanille in Granby offers savoury food to stay or to go: puff pastries, mini pizzas, chicken pastillas and sandwiches, according to its posts of September 2026. For a picnic at the Granby Zoo, the From the Granby Zoo page gives the route and the Zoo’s rules.'),
      ],
      changeNote: 'Savoury food for lunch added; allergens shown only once checked; list of pastries and fillings to be confirmed.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}

// ---------- Legal (07 §1–§5). Drafts for counsel: every page carries the lawyer-review marker. ----------
const PREVAILS = 'This English translation is provided for information; in case of discrepancy, the French version prevails.'

const confidentialite = {
  key: 'confidentialite',
  status: 'core',
  locales: {
    fr: {
      title: 'Politique de confidentialité · Pâtisserie Coco Vanille',
      description: 'Comment la Pâtisserie Coco Vanille, à Granby, recueille, utilise et protège vos renseignements personnels selon la Loi 25, et comment exercer vos droits.',
      h1: 'Politique de confidentialité',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, à Granby, recueille seulement les renseignements nécessaires pour préparer vos commandes et répondre à vos demandes. Cette politique explique quels renseignements sont recueillis, pourquoi, où ils sont conservés et comment exercer vos droits selon la Loi 25.`,
      sections: [
        s('Qui est responsable de vos renseignements personnels?', 'La personne responsable de la protection des renseignements personnels de Pâtisserie Coco Vanille inc. est désignée dans l’encadré « Responsable » de cette page, avec son titre et ses coordonnées. Par défaut, la loi confie ce rôle à la personne qui a la plus haute autorité dans l’entreprise, qui peut le déléguer par écrit.', {
          body: 'Entreprise : Pâtisserie Coco Vanille inc., 3, rue Court, Granby (Québec) J2G 4Y6, numéro d’entreprise du Québec 1177082220, téléphone 450-372-7177.',
        }),
        s('Quels renseignements recueillez-vous et pourquoi?', 'La Pâtisserie Coco Vanille recueille seulement ce qu’il faut pour préparer et remettre votre commande, et pour vous répondre.', {
          list: [
            'Commande : nom, téléphone, courriel, produits, date et plage de cueillette, pour préparer la commande, vous joindre et vous envoyer la confirmation.',
            'Demande de gâteau : description, photo de référence, nombre d’invités et date, pour préparer la soumission.',
            'Messagerie « Écrivez-nous » : vos messages et, seulement si vous choisissez de les donner, votre prénom et un numéro de téléphone ou une adresse courriel, pour vous répondre.',
            'Note d’allergie, facultative : seulement pour préparer votre commande; elle n’est jamais copiée dans un courriel, un texto ou un outil d’intelligence artificielle.',
            'Paiement : traité par le processeur de paiement; la boutique ne voit ni ne conserve le numéro de votre carte.',
            'Consentements aux témoins et aux messages : votre choix, sa date et la version du texte accepté, pour prouver votre consentement.',
            'Journaux du serveur : adresse IP et pages demandées, pour la sécurité du site.',
          ],
        }),
        s('Vos renseignements sortent-ils du Québec?', `Certains fournisseurs peuvent traiter des renseignements hors du Québec, comme le processeur de paiement, le service d’envoi de textos et, si vous les activez, les outils de mesure d’audience. Avant de leur communiquer un renseignement, la boutique fait une évaluation des facteurs relatifs à la vie privée et signe une entente écrite, comme l’exige l’article 17 de la loi.`, {
          body: 'Fournisseurs et pays de traitement : Stripe pour les paiements (Canada et États-Unis), Twilio pour les textos (États-Unis), Amazon Web Services pour les courriels de commande et les sauvegardes (Montréal), Microsoft pour le courriel de la boutique (Canada) et OVHcloud pour l’hébergement. Une évaluation des facteurs relatifs à la vie privée est faite avant la mise en service de chaque fournisseur qui traite des renseignements hors du Québec. Hébergement du site et de la base de données : OVHcloud, à Beauharnois, au Québec.',
        }),
        s('Quels sont vos droits?', `Vous pouvez demander l’accès à vos renseignements, leur rectification et leur communication dans un format technologique structuré et couramment utilisé, et retirer un consentement à tout moment. Écrivez à la personne responsable; délai de réponse : 30 jours au plus.`, {
          body: 'Si vous n’êtes pas satisfait de la réponse, vous pouvez porter plainte à la Commission d’accès à l’information du Québec.',
        }),
        s('Que faites-vous en cas d’incident de confidentialité?', 'La boutique inscrit chaque incident de confidentialité dans un registre. Si un incident présente un risque de préjudice sérieux, elle avise la Commission d’accès à l’information et les personnes concernées, et prend les mesures pour limiter le préjudice.'),
        s('Combien de temps gardez-vous vos renseignements?', 'La boutique garde vos renseignements le temps nécessaire aux fins indiquées, puis les détruit ou les rend anonymes.', {
          list: [
            'Commandes et factures : 6 ans après la fin de l’année d’imposition qu’elles concernent, comme l’exigent les règles fiscales',
            'Note d’allergie : 30 jours après la cueillette, puis effacée automatiquement',
            'Journaux du serveur : 90 jours',
            'Messages « Écrivez-nous » : supprimés 90 jours après le dernier message',
            'Boîtes abandonnées : aucune n’est conservée sur nos serveurs; une boîte vit dans son lien et dans un témoin de votre appareil, effacé après 30 jours',
          ],
        }),
      ],
      faq: [
        q('Vendez-vous mes renseignements personnels?', 'Non : la Pâtisserie Coco Vanille ne vend ni ne loue vos renseignements personnels.'),
        q('Mon numéro de carte est-il conservé?', 'Non : le numéro de carte est saisi sur la page sécurisée du processeur de paiement et n’arrive jamais sur les serveurs de la boutique.'),
        q('Allez-vous m’envoyer des courriels promotionnels?', 'Seulement si vous cochez la case prévue pour chaque type de message : précommandes saisonnières, rappel d’anniversaire ou demande d’avis. Chaque message permet de vous désabonner.'),
        q('Utilisez-vous des témoins?', 'Seulement les témoins essentiels par défaut. Les outils de mesure d’audience restent désactivés tant que vous ne les activez pas; la page Témoins donne le détail.'),
        q('Comment retirer mon consentement?', 'Pour les témoins, le lien « Témoins » en bas de chaque page permet de changer votre choix. Pour les messages, utilisez le lien de désabonnement ou répondez STOP à un texto.'),
        q('Mes renseignements servent-ils à entraîner une intelligence artificielle?', 'Non : aucun renseignement de commande ni aucune note d’allergie n’est transmis à un outil d’intelligence artificielle.'),
        q('Que deviennent les messages envoyés avec « Écrivez-nous »?', 'Vos messages, et le prénom, le numéro de téléphone ou l’adresse courriel que vous choisissez de donner, servent seulement à vous répondre. Ils sont conservés sur le serveur et dans la base de données du site de la boutique, sans service de clavardage externe, puis supprimés 90 jours après le dernier message. Une réponse par texto ou par courriel est envoyée seulement si vous la demandez; elle passe alors par le fournisseur d’envoi de textos ou de courriels de la boutique.'),
      ],
      changeNote: 'Fournisseurs, hébergement et durées de conservation précisés; texte rédigé par l’Agence, à valider par la propriétaire.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Privacy policy · Pâtisserie Coco Vanille, Granby',
      description: 'How Pâtisserie Coco Vanille in Granby, Québec, collects, uses and protects your personal information under Québec’s Law 25, and how to exercise your rights.',
      h1: 'Privacy policy',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in Granby, Québec, only collects the information it needs to prepare your orders and answer your requests. This policy explains what is collected, why, where it is kept and how to exercise your rights under Law 25. ${PREVAILS}`,
      sections: [
        s('Who is responsible for your personal information?', 'The person in charge of protecting personal information at Pâtisserie Coco Vanille inc. is named in the “Person in charge” box on this page, with their title and contact details. By default, the law gives this role to the person with the highest authority in the business, who may delegate it in writing.', {
          body: 'Business: Pâtisserie Coco Vanille inc., 3 rue Court, Granby, Québec J2G 4Y6, Québec enterprise number 1177082220, phone 450-372-7177.',
        }),
        s('What information do you collect, and why?', 'Pâtisserie Coco Vanille only collects what it needs to prepare and hand over your order, and to answer you.', {
          list: [
            'Order: name, phone, email, products, pickup date and slot, to prepare the order, reach you and send the confirmation.',
            'Cake request: description, reference photo, number of guests and date, to prepare the quote.',
            '“Message us” messaging: your messages and, only if you choose to give them, your first name and a phone number or email address, to answer you.',
            'Allergy note, optional: only used to prepare your order; never copied into an email, a text message or an artificial-intelligence tool.',
            'Payment: handled by the payment processor; the shop never sees or stores your card number.',
            'Cookie and message consents: your choice, its date and the version of the text you accepted, to prove your consent.',
            'Server logs: IP address and pages requested, for the security of the site.',
          ],
        }),
        s('Does your information leave Québec?', 'Some providers may process information outside Québec, such as the payment processor, the text-message service and, if you turn them on, audience-measurement tools. Before sharing any information with them, the shop carries out a privacy impact assessment and signs a written agreement, as section 17 of the law requires.', {
          body: 'Providers and processing countries: Stripe for payments (Canada and the United States), Twilio for text messages (United States), Amazon Web Services for order emails and backups (Montréal), Microsoft for the shop’s email (Canada) and OVHcloud for hosting. A privacy impact assessment is made before each provider that processes information outside Québec is put into service. Hosting of the site and database: OVHcloud, in Beauharnois, Québec.',
        }),
        s('What are your rights?', `You may ask to access your information, to correct it and to receive it in a structured, commonly used technological format, and you may withdraw a consent at any time. Write to the person in charge; response time: 30 days at most.`, {
          body: 'If you are not satisfied with the answer, you may file a complaint with the Commission d’accès à l’information du Québec.',
        }),
        s('What happens if there is a confidentiality incident?', 'The shop records every confidentiality incident in a register. If an incident carries a risk of serious injury, it notifies the Commission d’accès à l’information and the people concerned, and takes steps to limit the harm.'),
        s('How long do you keep your information?', 'The shop keeps your information as long as needed for the purposes stated, then destroys it or makes it anonymous.', {
          list: [
            'Orders and invoices: 6 years after the end of the tax year they relate to, as tax rules require',
            'Allergy note: 30 days after pickup, then deleted automatically',
            'Server logs: 90 days',
            '“Message us” messages: deleted 90 days after the last message',
            'Abandoned boxes: none is kept on our servers; a box lives in its link and in a cookie on your device, deleted after 30 days',
          ],
        }),
      ],
      faq: [
        q('Do you sell my personal information?', 'No: Pâtisserie Coco Vanille does not sell or rent your personal information.'),
        q('Is my card number stored?', 'No: your card number is entered on the payment processor’s secure page and never reaches the shop’s servers.'),
        q('Will you send me promotional emails?', 'Only if you tick the box for each kind of message: seasonal pre-orders, birthday reminder or review request. Every message lets you unsubscribe.'),
        q('Do you use cookies?', 'Only essential cookies by default. Audience-measurement tools stay off until you turn them on; the Cookies page has the details.'),
        q('How do I withdraw my consent?', 'For cookies, the “Cookies” link at the bottom of every page lets you change your choice. For messages, use the unsubscribe link or reply STOP to a text message.'),
        q('Is my information used to train artificial intelligence?', 'No: no order information and no allergy note is sent to an artificial-intelligence tool.'),
        q('What happens to messages sent with “Message us”?', 'Your messages, and the first name, phone number or email address you choose to give, are only used to answer you. They are kept on the server and in the database of the shop’s own website, with no outside chat service, then deleted 90 days after the last message. A reply by text message or email is only sent if you ask for one; it then goes through the shop’s text-message or email provider.'),
      ],
      changeNote: 'Providers, hosting and retention periods made precise; text written by the Agency, to be approved by the owner.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}

const conditionsDeVente = {
  key: 'conditions-de-vente',
  status: 'core',
  locales: {
    fr: {
      title: 'Conditions de vente · Pâtisserie Coco Vanille, Granby',
      description: 'Conditions de vente de la Pâtisserie Coco Vanille, à Granby : commande en ligne, prix tout compris, acompte, cueillette, annulation, remboursement en 15 jours.',
      h1: 'Conditions de vente',
      answer:
        `Ces conditions s’appliquent aux commandes passées en ligne ou par téléphone à la Pâtisserie Coco Vanille, au 3, rue Court, à Granby, pour une cueillette en boutique. Elles précisent les prix, le paiement, l’acompte, la cueillette, l’annulation et le remboursement, selon la Loi sur la protection du consommateur.`,
      sections: [
        s('Qui vend et comment nous joindre?', `Le commerçant est Pâtisserie Coco Vanille inc., 3, rue Court, Granby (Québec) J2G 4Y6, numéro d’entreprise du Québec 1177082220, téléphone 450-372-7177. Courriel : bonjour@cocovanillegranby.com.`, {
          body: `Numéros d’inscription à la TPS et à la TVQ : ${fn('numéros de TPS et de TVQ')}.`,
        }),
        s('Comment le contrat est-il conclu?', 'Le contrat est conclu quand vous confirmez la commande, après avoir vérifié le récapitulatif et coché la case « J’ai lu et j’accepte les conditions de vente ». Aucune case n’est cochée d’avance.', {
          body: 'Avant la confirmation, le récapitulatif indique chaque produit, son prix, la quantité, les options, la date et la plage de cueillette, l’adresse de cueillette, le total avant taxes, la TPS, la TVQ et le total en dollars canadiens, ainsi que l’acompte et le solde s’il y a lieu. Vous pouvez corriger chaque ligne avant de confirmer.\n\nUne copie du contrat vous est envoyée par courriel dès la confirmation, en français d’abord, avec ces conditions.',
        }),
        s('Quels prix et quels frais s’appliquent?', 'Le prix affiché comprend tous les frais obligatoires; seules la TPS et la TVQ s’ajoutent, s’il y a lieu. Aucun frais de service, d’emballage ou de carte n’est ajouté, et le prix est le même quel que soit le mode de paiement.', {
          body: 'Les taxes dépendent du produit et de la quantité; leur montant est affiché séparément avant le paiement. La boutique n’exige jamais plus que le prix annoncé.',
        }),
        s('Comment fonctionne l’acompte d’un gâteau personnalisé?', `Un gâteau personnalisé est réservé par un acompte de ${DEPOSIT_FR} du prix, payé à l’acceptation de la soumission; le solde se paie à la cueillette.`, {
          body: `Durée de validité d’une soumission : 72 heures; la date limite est écrite sur la soumission. L’acompte réserve votre date et s’applique au prix du gâteau. Si vous annulez, la boutique vous rembourse l’acompte, moins les frais qu’elle a réellement engagés pour votre gâteau avant l’annulation, comme les ingrédients ou les décorations achetés pour vous et le travail déjà fait; elle vous en remet le détail par écrit. Le remboursement est versé dans les 15 jours suivant l’annulation.`,
        }),
        s('Comment se passe la cueillette?', `Vous récupérez votre commande au 3, rue Court, à Granby, pendant la plage choisie, en donnant votre numéro de commande. La boutique ne change jamais une date ou une plage confirmée sans votre accord.`, {
          body: 'Commande non récupérée pendant la plage : la commande reste prête jusqu’à la fermeture de la boutique le jour prévu; appelez au 450-372-7177 pour convenir d’une autre heure ce jour-là. Les produits frais ne peuvent pas être gardés au-delà de ce jour; comme la commande a été préparée pour vous, le montant payé n’est alors pas remboursé.',
        }),
        s('Puis-je annuler, et quand suis-je remboursé?', `Vous pouvez annuler sans frais jusqu’à 24 heures avant le début de votre plage de cueillette, en appelant au 450-372-7177. Si la boutique ne peut pas remplir la commande, ou si la date du contrat diffère de celle annoncée avant l’achat, vous pouvez annuler et êtes remboursé au complet dans les 15 jours.`, {
          body: `Si un remboursement dû n’est pas fait, vous pouvez aussi vous adresser à l’émetteur de votre carte de crédit. Produit non conforme ou abîmé : signalez-le le jour de la cueillette, au comptoir ou au 450-372-7177, avec une photo si possible; la boutique le remplace si elle le peut, sinon elle vous rembourse ce produit.`,
        }),
      ],
      faq: [
        q('Puis-je annuler une commande en ligne à n’importe quel moment?', 'Non, sauf pour un gâteau personnalisé : au Québec, il n’existe pas de droit général d’annuler un achat en ligne, et l’annulation suit les règles ci-dessus. Un gâteau personnalisé peut être annulé en tout temps; l’acompte est alors remboursé, moins les frais déjà engagés pour votre gâteau.'),
        q('Dans quelle langue est le contrat?', 'En français. Une traduction anglaise est offerte pour information; en cas de divergence, la version française prévaut.'),
        q('Le prix peut-il changer après ma commande?', 'Non : le prix confirmé dans le récapitulatif est celui que vous payez.'),
        q('Y a-t-il un pourboire à payer en ligne?', 'Non : la commande en ligne ne propose aucun pourboire.'),
        q('Les cartes-cadeaux expirent-elles?', 'Non : au Québec, la carte-cadeau d’un commerce n’a pas de date d’expiration, et aucuns frais ne peuvent être exigés pour sa délivrance ou son utilisation. Le site ne vend pas de cartes-cadeaux pour l’instant; pour la boutique, appelez au 450-372-7177.'),
        q('Comment obtenir une copie de mon contrat?', 'La confirmation envoyée par courriel est votre copie du contrat. Pour en recevoir une autre, appelez au 450-372-7177.'),
      ],
      changeNote: 'Validité des soumissions, annulation sans frais et produit non conforme précisés; texte rédigé par l’Agence, à valider par la propriétaire.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Terms of sale · Pâtisserie Coco Vanille, Granby',
      description: 'Terms of sale of Pâtisserie Coco Vanille in Granby, Québec: online orders, all-in prices, deposit, pickup, cancellation and refunds within 15 days.',
      h1: 'Terms of sale',
      answer:
        `These terms apply to orders placed online or by phone with Pâtisserie Coco Vanille, 3 rue Court, Granby, Québec, for pickup at the shop. They cover prices, payment, the deposit, pickup, cancellation and refunds under Québec’s Consumer Protection Act. ${PREVAILS}`,
      sections: [
        s('Who is the seller, and how do I reach you?', `The merchant is Pâtisserie Coco Vanille inc., 3 rue Court, Granby, Québec J2G 4Y6, Québec enterprise number 1177082220, phone 450-372-7177. Email: bonjour@cocovanillegranby.com.`, {
          body: `GST and QST registration numbers: ${fn('GST and QST numbers')}.`,
        }),
        s('How is the contract made?', 'The contract is made when you confirm the order, after checking the summary and ticking the box “I have read and accept the terms of sale”. No box is ticked in advance.', {
          body: 'Before you confirm, the summary shows each product, its price, the quantity, the options, the pickup date and slot, the pickup address, the total before taxes, GST, QST and the total in Canadian dollars, plus the deposit and balance where they apply. You can correct every line before confirming.\n\nA copy of the contract is emailed to you as soon as you confirm, French version first, with these terms. On the English site, you confirm that you received the French version and expressly choose to be bound by the English version.',
        }),
        s('Which prices and fees apply?', 'The price shown includes every mandatory fee; only GST and QST are added where they apply. No service, packaging or card fee is added, and the price is the same whatever the payment method.', {
          body: 'Taxes depend on the product and quantity; their amount is shown separately before payment. The shop never charges more than the advertised price.',
        }),
        s('How does the deposit for a custom cake work?', `A custom cake is reserved with a deposit of ${DEPOSIT_EN} of the price, paid when you accept the quote; the balance is paid at pickup.`, {
          body: `How long a quote is valid: 72 hours; the deadline is written on the quote. The deposit holds your date and is applied to the price of the cake. If you cancel, the shop refunds the deposit, less the costs it actually incurred for your cake before you cancelled, such as ingredients or decorations bought for you and work already done; it gives you the details in writing. The refund is paid within 15 days of the cancellation.`,
        }),
        s('How does pickup work?', 'You pick up your order at 3 rue Court, Granby, during the slot you chose, by giving your order number. The shop never changes a confirmed date or slot without your agreement.', {
          body: 'Order not picked up during the slot: the order stays ready until the shop closes on the planned day; call 450-372-7177 to agree on another time that day. Fresh products cannot be kept beyond that day; because the order was made for you, the amount paid is then not refunded.',
        }),
        s('Can I cancel, and when am I refunded?', `You may cancel at no charge up to 24 hours before your pickup slot starts, by calling 450-372-7177. If the shop cannot fill the order, or if the date in the contract differs from the one announced before purchase, you may cancel and are refunded in full within 15 days.`, {
          body: `If a refund that is owed is not made, you can also contact your credit-card issuer. Product not as ordered or damaged: report it on the day of pickup, at the counter or at 450-372-7177, with a photo if you can; the shop replaces it if it can, otherwise it refunds that product.`,
        }),
      ],
      faq: [
        q('Can I cancel an online order at any time?', 'No, except for a custom cake: Québec has no general right to cancel an online purchase, and cancellation follows the rules above. A custom cake can be cancelled at any time; the deposit is then refunded, less the costs already incurred for your cake.'),
        q('What language is the contract in?', `French. This English translation is provided for information; in case of discrepancy, the French version prevails.`),
        q('Can the price change after I order?', 'No: the price confirmed in the summary is the price you pay.'),
        q('Is there a tip to pay online?', 'No: online ordering never asks for a tip.'),
        q('Do gift cards expire?', 'No: in Québec, a shop’s gift card has no expiry date, and no fee can be charged to issue or use it. The website does not sell gift cards for now; for the shop, call 450-372-7177.'),
        q('How do I get a copy of my contract?', 'The confirmation sent by email is your copy of the contract. For another copy, call 450-372-7177.'),
      ],
      changeNote: 'Quote validity, free cancellation and products not as ordered made precise; text written by the Agency, to be approved by the owner.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}

const temoins = {
  key: 'temoins',
  status: 'core',
  locales: {
    fr: {
      title: 'Témoins et consentement · Pâtisserie Coco Vanille',
      description: 'Quels témoins le site de la Pâtisserie Coco Vanille, à Granby, utilise-t-il? Les essentiels seulement; la mesure d’audience reste éteinte sans votre accord.',
      h1: 'Témoins et consentement',
      answer:
        `Le site de la Pâtisserie Coco Vanille, boutique du 3, rue Court, à Granby, n’utilise par défaut que les témoins essentiels à son fonctionnement, comme « Ma boîte » et la sécurité du paiement. Les outils de mesure d’audience restent désactivés tant que vous ne les activez pas.`,
      sections: [
        s('Qu’est-ce qu’un témoin?', 'Un témoin, ou « cookie », est un petit fichier qu’un site enregistre dans votre navigateur pour se souvenir d’une information, comme le contenu de votre boîte ou votre choix de témoins.'),
        s('Quels témoins le site utilise-t-il?', 'Le site utilise deux catégories de témoins : les essentiels, toujours actifs, et la mesure d’audience, seulement avec votre accord.', {
          list: [
            'Essentiels, toujours actifs : « Ma boîte », sécurité des formulaires et du paiement, mémoire de votre choix de témoins. Sans eux, la commande en ligne ne fonctionne pas.',
            `Mesure d’audience, désactivée par défaut : outils qui comptent les visites et peuvent suivre votre navigation. Ils ne se chargent qu’après votre accord. Outils retenus : aucun pour l’instant; un outil ajouté plus tard sera nommé ici avant d’être activé.`,
            'Publicité : aucun témoin et aucun pixel publicitaire.',
          ],
        }),
        s('Comment donner ou changer votre choix?', 'Quand un outil de mesure est offert, un bandeau vous demande votre choix, avec « Tout refuser » et « Tout accepter » de même taille, et « Choisir ». Le lien « Témoins », en bas de chaque page, permet de changer ce choix à tout moment, aussi facilement que vous l’avez donné.'),
        s('Combien de temps les témoins sont-ils conservés?', 'La durée dépend du témoin : « Ma boîte », 30 jours; la conversation « Écrivez-nous », 90 jours; un formulaire de commande en cours, 10 minutes. Votre choix est redemandé si la liste des outils change.'),
        s('Le site vous suit-il sans témoins?', 'Non, aucun suivi publicitaire. Le serveur garde des journaux techniques, comme l’adresse IP et la page demandée, pour la sécurité et pour compter les visites de façon agrégée, sans témoin.'),
      ],
      faq: [
        q('Le site fonctionne-t-il si je refuse tout?', 'Oui : refuser la mesure d’audience ne change rien au contenu du site ni à la commande en ligne.'),
        q('Utilisez-vous le pixel de Facebook?', 'Non : le site n’utilise aucun pixel publicitaire, de Meta ou d’ailleurs.'),
        q('Pourquoi « Tout refuser » est-il aussi visible que « Tout accepter »?', 'Parce que refuser doit être aussi simple qu’accepter : les deux boutons ont la même taille et le même style.'),
        q('Mon choix est-il enregistré?', 'Oui : votre choix est enregistré avec sa date et la version du texte affiché, sans votre nom, pour prouver le consentement.'),
        q('Puis-je bloquer aussi les témoins essentiels?', 'Oui, dans les réglages de votre navigateur, mais « Ma boîte » et le paiement en ligne ne fonctionneront plus.'),
      ],
      changeNote: 'Durée de chaque témoin précisée; aucun outil de mesure n’est actif; texte rédigé par l’Agence, à valider par la propriétaire.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Cookies and consent · Pâtisserie Coco Vanille',
      description: 'Which cookies does the Pâtisserie Coco Vanille website in Granby, Québec, use? Only essential ones by default; audience measurement stays off without consent.',
      h1: 'Cookies and consent',
      answer:
        `The website of Pâtisserie Coco Vanille, the shop at 3 rue Court in Granby, Québec, only uses the cookies it needs to work by default, such as “My box” and payment security. Audience-measurement tools stay off until you turn them on. ${PREVAILS}`,
      sections: [
        s('What is a cookie?', 'A cookie is a small file a website stores in your browser to remember something, such as what is in your box or your cookie choice.'),
        s('Which cookies does the site use?', 'The site uses two kinds of cookies: essential ones, always on, and audience measurement, only with your consent.', {
          list: [
            'Essential, always on: “My box”, form and payment security, and remembering your cookie choice. Without them, online ordering does not work.',
            `Audience measurement, off by default: tools that count visits and may track your browsing. They only load after you agree. Tools chosen: none for now; a tool added later will be named here before it is turned on.`,
            'Advertising: no advertising cookies and no advertising pixels.',
          ],
        }),
        s('How do I give or change my choice?', 'When a measurement tool is offered, a banner asks for your choice, with “Refuse all” and “Accept all” the same size, plus “Choose”. The “Cookies” link at the bottom of every page lets you change that choice at any time, as easily as you gave it.'),
        s('How long are cookies kept?', 'It depends on the cookie: “My box”, 30 days; the “Message us” conversation, 90 days; an order form in progress, 10 minutes. You are asked again if the list of tools changes.'),
        s('Does the site track you without cookies?', 'No advertising tracking. The server keeps technical logs, such as the IP address and the page requested, for security and to count visits in aggregate, without cookies.'),
      ],
      faq: [
        q('Does the site work if I refuse everything?', 'Yes: refusing audience measurement changes nothing about the site’s content or online ordering.'),
        q('Do you use the Facebook pixel?', 'No: the site uses no advertising pixel, from Meta or anyone else.'),
        q('Why is “Refuse all” as visible as “Accept all”?', 'Because refusing must be as easy as accepting: both buttons have the same size and style.'),
        q('Is my choice recorded?', 'Yes: your choice is recorded with its date and the version of the text shown, without your name, to prove consent.'),
        q('Can I block essential cookies too?', 'Yes, in your browser settings, but “My box” and online payment will stop working.'),
      ],
      changeNote: 'Each cookie’s retention made precise; no measurement tool is active; text written by the Agency, to be approved by the owner.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const accessibilite = {
  key: 'accessibilite',
  status: 'core',
  locales: {
    fr: {
      title: 'Accessibilité du site · Pâtisserie Coco Vanille, Granby',
      description: 'Engagement d’accessibilité de la Pâtisserie Coco Vanille, à Granby : site conçu selon les WCAG 2.2 niveau AA, limites connues et moyen de signaler un problème.',
      h1: 'Accessibilité du site',
      answer:
        `Le site de la Pâtisserie Coco Vanille, boutique du 3, rue Court, à Granby, vise la conformité aux Règles pour l’accessibilité des contenus Web 2.2, niveau AA. Si une page vous pose problème, appelez au 450-372-7177 : la boutique vous donne l’information ou prend votre commande autrement.`,
      sections: [
        s('Quelle norme le site suit-il?', 'Le site suit les Règles pour l’accessibilité des contenus Web (WCAG) 2.2 du W3C, niveau AA.', {
          list: [
            'Contraste d’au moins 4,5 pour 1 entre le texte et son fond',
            'Navigation complète au clavier, avec un repère de focus visible',
            'Boutons et liens d’au moins 48 pixels de haut',
            'Texte de remplacement pour chaque image utile',
            'Formulaires étiquetés et erreurs annoncées en texte',
            'Respect du réglage « réduire les animations » de votre appareil',
          ],
        }),
        s('Comment l’accessibilité est-elle vérifiée?', `Chaque version du site passe des tests automatiques d’accessibilité et un contrôle du contraste des couleurs avant sa mise en ligne. Un contrôle manuel avec un lecteur d’écran est fait avant la mise en ligne, puis chaque année; sa date est publiée ici.`),
        s('Quelles sont les limites connues?', 'Les limites connues sont publiées ici après chaque contrôle. Les tests automatiques des règles WCAG 2.2, niveau AA, n’en relèvent aucune à ce jour.'),
        s('Comment signaler un problème d’accessibilité?', `Appelez au 450-372-7177 ou écrivez à bonjour@cocovanillegranby.com en décrivant la page et le problème. Délai de réponse : 5 jours ouvrables au plus.`),
        s('La boutique est-elle accessible en personne?', `L’accès à la boutique du 3, rue Court reste à décrire : ${fn('marches, largeur de porte et accès en fauteuil roulant')}.`),
      ],
      faq: [
        q('Puis-je commander sans utiliser le site?', 'Oui : appelez la boutique au 450-372-7177. Les commandes par téléphone suivent le même calendrier que les commandes en ligne.'),
        q('Le site fonctionne-t-il sans JavaScript?', 'Oui pour le contenu : les heures, les prix, la FAQ et les allergènes sont dans le HTML de chaque page. JavaScript ajoute seulement des améliorations.'),
        q('Puis-je agrandir le texte?', 'Oui : le texte s’agrandit avec le zoom du navigateur, jusqu’à 200 %, sans perte de contenu.'),
        q('Les animations peuvent-elles être désactivées?', 'Oui : le site respecte le réglage « réduire les animations » de votre appareil et reste complet sans animation.'),
        q('Le site est-il offert en anglais?', 'Oui, en français et en anglais. La version française est la version de référence.'),
      ],
      changeNote: 'Délai de réponse et contrôles précisés; texte rédigé par l’Agence, à valider par la propriétaire.',
      contentUpdatedAt: UPDATED_1029,
    },
    en: {
      title: 'Website accessibility · Pâtisserie Coco Vanille, Granby',
      description: 'Accessibility statement of Pâtisserie Coco Vanille in Granby, Québec: a website built to WCAG 2.2 level AA, known limits and how to report a problem.',
      h1: 'Website accessibility',
      answer:
        `The website of Pâtisserie Coco Vanille, the shop at 3 rue Court in Granby, Québec, aims to meet the Web Content Accessibility Guidelines 2.2, level AA. If a page gives you trouble, call 450-372-7177 and the shop will help you another way. ${PREVAILS}`,
      sections: [
        s('Which standard does the site follow?', 'The site follows the W3C Web Content Accessibility Guidelines (WCAG) 2.2, level AA.', {
          list: [
            'Contrast of at least 4.5 to 1 between text and its background',
            'Full keyboard navigation, with a visible focus indicator',
            'Buttons and links at least 48 pixels tall',
            'Text alternatives for every meaningful image',
            'Labelled forms and errors announced in text',
            'Respect for your device’s “reduce motion” setting',
          ],
        }),
        s('How is accessibility checked?', `Every version of the site goes through automated accessibility tests and a colour-contrast check before it goes live. A manual check with a screen reader is made before launch, then every year; its date is published here.`),
        s('What are the known limits?', 'Known limits are published here after each check. The automated WCAG 2.2 level AA tests find none so far.'),
        s('How do I report an accessibility problem?', `Call 450-372-7177 or write to bonjour@cocovanillegranby.com, describing the page and the problem. Response time: 5 business days at most.`),
        s('Is the shop accessible in person?', `Access to the shop at 3 rue Court is still to be described: ${fn('steps, door width and wheelchair access')}.`),
      ],
      faq: [
        q('Can I order without using the website?', 'Yes: call the shop at 450-372-7177. Phone orders use the same calendar as online orders.'),
        q('Does the site work without JavaScript?', 'Yes for the content: hours, prices, the FAQ and allergens are in the HTML of every page. JavaScript only adds enhancements.'),
        q('Can I make the text bigger?', 'Yes: text grows with your browser zoom, up to 200%, without losing content.'),
        q('Can animations be turned off?', 'Yes: the site follows your device’s “reduce motion” setting and stays complete without animation.'),
        q('Is the site available in French?', 'Yes: French is the main version of the site, and the French text prevails.'),
      ],
      changeNote: 'Response time and checks made precise; text written by the Agency, to be approved by the owner.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}

// ---------- Conditional pages: published once the owner facts in `condition` exist (00 §5.2) ----------
const PRICE_GRID_FR = fn('grille de prix par format, datée')
const PRICE_GRID_EN = fn('price grid per size, dated')
const PORTIONS_FR = fn('portions par format de gâteau')
const PORTIONS_EN = fn('servings per cake size')

const prix = {
  key: 'prix',
  status: 'conditional',
  condition: 'Grille de prix du propriétaire',
  locales: {
    fr: {
      title: 'Prix des gâteaux et pâtisseries à Granby · Coco Vanille',
      description: 'Les prix de la Pâtisserie Coco Vanille, à Granby, dans un tableau daté : format, portions, prix avant taxes et prix par portion. Aucun frais ajouté en ligne.',
      h1: 'Prix des gâteaux et des pâtisseries à Granby',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, à Granby, affiche ses prix en texte, avant taxes, dans un tableau daté : format, portions, prix et prix par portion. Aucun frais ne s’ajoute en ligne; seules la TPS et la TVQ s’ajoutent, s’il y a lieu. Grille de prix : ${PRICE_GRID_FR}.`,
      sections: [
        s('Combien coûte un gâteau de fête?', `Le prix d’un gâteau de fête dépend du format : à partir de ${fn('prix du plus petit format')} pour ${fn('portions du plus petit format')} portions, selon la grille de la boutique. Le tableau de cette page donne le prix de chaque format, et sert aussi pour un gâteau d’anniversaire sur commande.`),
        s('Combien coûte une portion de gâteau?', 'Le prix par portion est le prix d’un format divisé par son nombre de portions. Le tableau l’affiche dès que la boutique a confirmé les deux chiffres, pour comparer les formats entre eux.'),
        s('Les taxes sont-elles incluses dans les prix?', 'Non : les prix sont affichés avant taxes. La TPS et la TVQ s’ajoutent seulement s’il y a lieu, selon le produit et la quantité, et le total avec chaque taxe est affiché avant le paiement.'),
        s('Pourquoi le prix d’un gâteau personnalisé varie-t-il?', `Le prix d’un gâteau personnalisé dépend du format, de la saveur et du décor demandé : ${fn('suppléments de décor et de saveur')}. La soumission écrite donne le prix exact avant tout acompte.`),
        s('Les prix changent-ils?', 'Chaque prix est daté : la mention « Prix au » sous le tableau indique la dernière mise à jour. Un prix confirmé dans votre récapitulatif ne change plus.'),
      ],
      faq: [
        q('Y a-t-il des frais de service en ligne?', 'Non : aucun frais de service, d’emballage ou de carte ne s’ajoute au prix affiché.'),
        q('Le prix change-t-il selon le mode de paiement?', 'Non : le prix est le même quel que soit le mode de paiement, sans supplément pour la carte de crédit.'),
        q('La boîte est-elle comprise dans le prix?', 'Oui : l’emballage est compris dans le prix du produit; aucun frais de boîte n’est ajouté.'),
        q('Faut-il payer un acompte?', `Pour un gâteau personnalisé, un acompte de ${DEPOSIT_FR} réserve la date; le solde se paie à la cueillette.`),
        q('Le prix est-il le même en boutique et en ligne?', `La politique de prix entre la boutique et le site reste à confirmer : ${fn('prix identiques en ligne et en boutique ou non')}.`),
        q('Combien coûte un gâteau pour 20 personnes?', `Le prix pour 20 personnes est celui du plus petit format qui donne au moins 20 portions : ${fn('format et prix pour 20 portions')}. Le calculateur de portions fait ce calcul pour vous.`),
      ],
      changeNote: 'Première version : la grille de prix attend les chiffres de la boutique.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Cake and pastry prices in Granby, Québec · Coco Vanille',
      description: 'Pâtisserie Coco Vanille prices in Granby, Québec, in a dated table: size, servings, price as text before taxes and price per serving. No fees added online.',
      h1: 'Cake and pastry prices in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in Granby, Québec, shows its prices as text, before taxes, in a dated table: size, servings, price and price per serving. No fees are added online; only GST and QST are added where they apply. Price grid: ${PRICE_GRID_EN}.`,
      sections: [
        s('How much is a birthday cake?', `The price of a birthday cake depends on the size: from ${fn('price of the smallest size')} for ${fn('servings of the smallest size')} servings, according to the shop’s grid. The table on this page gives the price of every size.`),
        s('How much is a serving of cake?', 'The price per serving is the price of a size divided by its number of servings. The table shows it once the shop has confirmed both numbers, so you can compare sizes.'),
        s('Are taxes included in the prices?', 'No: prices are shown before taxes. GST and QST are added only where they apply, depending on the product and quantity, and the total with each tax is shown before you pay.'),
        s('Why does the price of a custom cake vary?', `The price of a custom cake depends on the size, the flavour and the decoration you ask for: ${fn('decoration and flavour supplements')}. The written quote gives the exact price before any deposit.`),
        s('Do prices change?', 'Every price is dated: the “Prices as of” line under the table shows the last update. A price confirmed in your summary no longer changes.'),
      ],
      faq: [
        q('Are there service fees online?', 'No: no service, packaging or card fee is added to the price shown.'),
        q('Does the price change with the payment method?', 'No: the price is the same whatever the payment method, with no credit-card surcharge.'),
        q('Is the box included in the price?', 'Yes: packaging is included in the product price; no box fee is added.'),
        q('Is a deposit required?', `For a custom cake, a deposit of ${DEPOSIT_EN} holds the date; the balance is paid at pickup.`),
        q('Is the price the same in store and online?', `The pricing policy between the shop and the website is still to be confirmed: ${fn('same prices online and in store or not')}.`),
        q('How much is a cake for 20 people?', `The price for 20 people is the price of the smallest size with at least 20 servings: ${fn('size and price for 20 servings')}. The serving calculator does this for you.`),
      ],
      changeNote: 'First version: the price grid is waiting for the shop’s numbers.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const calculateur = {
  key: 'calculateur',
  status: 'conditional',
  condition: 'Portions par taille fournies par le propriétaire',
  locales: {
    fr: {
      title: 'Calculateur de portions de gâteau · Pâtisserie Coco Vanille',
      description: 'Quelle grosseur de gâteau pour vos invités? Le calculateur de portions de la Pâtisserie Coco Vanille, à Granby, propose les formats qui suffisent.',
      h1: 'Quelle grosseur de gâteau pour mon nombre d’invités?',
      answer:
        `Le calculateur de portions de la Pâtisserie Coco Vanille, à Granby, propose les formats de gâteau qui suffisent pour votre nombre d’invités, à partir des portions publiées par la boutique du 3, rue Court. Indiquez le nombre d’invités et lancez le calcul : il fonctionne aussi sans JavaScript. Portions par format : ${PORTIONS_FR}.`,
      sections: [
        s('Comment fonctionne le calculateur?', 'Le calculateur compare votre nombre d’invités aux portions de chaque format de gâteau et affiche les formats qui suffisent, du plus petit au plus grand, avec leur prix quand il est confirmé.'),
        s('Quelle grosseur de gâteau pour 20 personnes?', `Pour 20 personnes, le calculateur propose le plus petit format d’au moins 20 portions : ${fn('format pour 20 portions')}.`),
        s('Combien de portions dans un gâteau de 8 pouces?', `Le nombre de portions d’un gâteau de 8 po (20 cm) dépend de sa hauteur et de la taille des parts : ${fn('portions d’un gâteau de 8 po selon la boutique')}.`),
        s('Qu’est-ce qu’une portion de gâteau?', `Une portion est la part que la boutique compte pour un invité; sa taille est donnée avec la grille des portions : ${fn('taille d’une portion, en centimètres')}.`),
      ],
      faq: [
        q('Faut-il prévoir une portion par invité?', 'Le calculateur compte une portion par invité. Ajoutez quelques portions si vous voulez des restes ou si des invités s’ajoutent à la dernière minute.'),
        q('Le calculateur fonctionne-t-il sans JavaScript?', 'Oui : le formulaire envoie votre nombre d’invités au serveur, qui calcule et affiche les formats sur une nouvelle page.'),
        q('Et pour 50 invités ou plus?', `Pour un grand nombre d’invités, appelez au 450-372-7177 : la boutique conseille un format ou plusieurs gâteaux. Plus grand format offert : ${fn('plus grand format de gâteau offert')}.`),
        q('Le calculateur donne-t-il le prix?', 'Oui, quand le prix du format est confirmé : chaque format proposé affiche son prix et son prix par portion.'),
        q('Comment commander le format proposé?', 'Choisissez ce format sur la page du gâteau ou sur la page Commander; le calendrier propose la première date de cueillette possible.'),
      ],
      changeNote: 'Première version : le calcul attend les portions par format de la boutique.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Cake serving calculator · Pâtisserie Coco Vanille',
      description: 'What size cake for your guests? The serving calculator of Pâtisserie Coco Vanille in Granby, Québec, suggests the sizes that are enough, with their prices.',
      h1: 'What size cake do I need for my guests?',
      answer:
        `The serving calculator of Pâtisserie Coco Vanille in Granby, Québec, suggests the cake sizes that feed your number of guests, using the servings published by the shop at 3 rue Court. Enter the number of guests and run the calculation: it also works without JavaScript. Servings per size: ${PORTIONS_EN}.`,
      sections: [
        s('How does the calculator work?', 'The calculator compares your number of guests with the servings of each cake size and shows the sizes that are enough, from smallest to largest, with their price once it is confirmed.'),
        s('What size cake for 20 people?', `For 20 people, the calculator suggests the smallest size with at least 20 servings: ${fn('size for 20 servings')}.`),
        s('How many servings are in an 8-inch round cake?', `The number of servings in an 8-inch (20 cm) cake depends on its height and the size of the slices: ${fn('servings in an 8-inch cake according to the shop')}.`),
        s('What counts as a serving of cake?', `A serving is the slice the shop counts for one guest; its size is given with the serving grid: ${fn('serving size, in centimetres')}.`),
      ],
      faq: [
        q('Should I plan one serving per guest?', 'The calculator counts one serving per guest. Add a few servings if you want leftovers or if guests join at the last minute.'),
        q('Does the calculator work without JavaScript?', 'Yes: the form sends your number of guests to the server, which calculates and shows the sizes on a new page.'),
        q('What size cake do I need for 30 guests?', 'Enter 30 in the calculator: it shows the smallest size with at least 30 servings, and the larger sizes after it.'),
        q('What about 50 guests or more?', `For a large number of guests, call 450-372-7177: the shop suggests a size or several cakes. Largest size offered: ${fn('largest cake size offered')}.`),
        q('Does the calculator show the price?', 'Yes, when the price of the size is confirmed: each size suggested shows its price and its price per serving.'),
      ],
      changeNote: 'First version: the calculation is waiting for the shop’s servings per size.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const gateauxPersonnalises = {
  key: 'gateaux-personnalises',
  status: 'conditional',
  condition: 'Gâteaux sur commande confirmés (volume, délai, prix)',
  locales: {
    fr: {
      title: 'Gâteaux personnalisés à Granby · Pâtisserie Coco Vanille',
      description: 'Gâteaux personnalisés à la Pâtisserie Coco Vanille, à Granby : photo de référence, prix écrit, acompte, délai de commande et cueillette au 3, rue Court.',
      h1: 'Gâteaux personnalisés à Granby',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, à Granby, prépare des gâteaux personnalisés sur commande : vous envoyez une photo de référence, le nombre d’invités et la date, puis vous recevez un prix et un récapitulatif écrit. Délai minimum : ${fn('délai minimum d’un gâteau personnalisé')}. Formats : ${fn('portions minimum et maximum')}.`,
      sections: [
        s('Comment commander un gâteau personnalisé?', 'Un gâteau personnalisé se commande en cinq étapes, de la demande jusqu’à la cueillette au 3, rue Court.', {
          list: [
            'Envoyer la demande : photo de référence, nombre d’invités, date, saveur et message',
            `Recevoir la soumission avec le prix, dans un délai de ${fn('délai de réponse aux demandes')}`,
            `Verser l’acompte de ${DEPOSIT_FR} pour réserver la date`,
            'Approuver le récapitulatif écrit : format, saveur, couleurs et message',
            'Récupérer le gâteau pendant la plage de cueillette choisie',
          ],
        }),
        s('Combien de jours d’avance faut-il commander?', `Le délai dépend de la complexité du gâteau : ${fn('délai par type de gâteau personnalisé, en jours')}. Le calendrier de la demande propose seulement les dates possibles.`),
        s('Combien coûte un gâteau personnalisé?', `Un gâteau personnalisé coûte à partir de ${fn('prix du plus petit gâteau personnalisé')}, selon le format et le décor. La page Prix donne chaque format, et la soumission écrite le prix exact.`),
        s('Est-ce que mon gâteau va ressembler à la photo?', 'Votre photo de référence est jointe à la demande, et le récapitulatif écrit décrit le format, la saveur, les couleurs et le message. La préparation commence seulement après votre approbation.'),
        s('Quels thèmes pouvez-vous faire?', `Les thèmes possibles restent à confirmer par la boutique : ${fn('thèmes offerts et politique sur les personnages')}.`),
      ],
      faq: [
        q('C’est-tu possible d’avoir un gâteau personnalisé pour la fin de semaine?', `Ça dépend du délai minimum et des places libres dans le calendrier : ${fn('délai minimum d’un gâteau personnalisé')}. La demande en ligne affiche seulement les dates possibles.`),
        q('Pouvez-vous écrire « Bonne fête » sur le gâteau?', `Le message sur le gâteau reste à confirmer : ${fn('message sur le gâteau offert ou non, longueur maximale')}.`),
        q('Faites-vous des gâteaux à étages?', `Les gâteaux à étages restent à confirmer : ${fn('gâteaux à étages offerts ou non')}.`),
        q('Faites-vous des gâteaux à écraser (smash cakes)?', `Le gâteau à écraser du premier anniversaire reste à confirmer : ${fn('smash cake offert ou non')}.`),
        q('Puis-je modifier ma commande après l’acompte?', `Les modifications après l’acompte suivent les conditions de vente : ${fn('délai de modification après l’acompte')}.`),
        q('Livrez-vous les gâteaux?', `Les gâteaux se récupèrent au 3, rue Court, à Granby. Livraison : ${DELIVERY_FR}.`),
      ],
      changeNote: 'Première version : délais, formats, prix et thèmes des gâteaux personnalisés à confirmer.',
      contentUpdatedAt: UPDATED,
    },
    en: {
      title: 'Custom cakes in Granby, Québec · Pâtisserie Coco Vanille',
      description: 'Custom cakes from Pâtisserie Coco Vanille in Granby, Québec: reference photo, written price, deposit, lead time and pickup at 3 rue Court, in the downtown core.',
      h1: 'Custom cakes in Granby',
      answer:
        `Pâtisserie Coco Vanille, at 3 rue Court in Granby, Québec, makes custom cakes to order: you send a reference photo, the number of guests and the date, then receive a price and a written summary. Minimum lead time: ${fn('minimum lead time for a custom cake')}. Sizes: ${fn('minimum and maximum servings')}.`,
      sections: [
        s('How do I order a custom cake?', 'A custom cake is ordered in five steps, from the request to pickup at 3 rue Court.', {
          list: [
            'Send the request: reference photo, number of guests, date, flavour and message',
            `Receive the quote with the price, within ${fn('response time for requests')}`,
            `Pay the ${DEPOSIT_EN} deposit to hold the date`,
            'Approve the written summary: size, flavour, colours and message',
            'Pick up the cake during the pickup slot you chose',
          ],
        }),
        s('How far in advance should I order?', `The lead time depends on how complex the cake is: ${fn('lead time per type of custom cake, in days')}. The request calendar only offers possible dates.`),
        s('How much is a custom cake?', `A custom cake costs from ${fn('price of the smallest custom cake')}, depending on the size and decoration. The Prices page lists every size, and the written quote gives the exact price.`),
        s('Will my cake look like the photo?', 'Your reference photo is attached to the request, and the written summary describes the size, flavour, colours and message. Baking starts only after you approve it.'),
        s('Which themes can you do?', `Possible themes are still to be confirmed by the shop: ${fn('themes offered and policy on characters')}.`),
      ],
      faq: [
        q('Can I get a custom cake for this weekend?', `It depends on the minimum lead time and the open slots in the calendar: ${fn('minimum lead time for a custom cake')}. The online request only shows possible dates.`),
        q('Can you write “Happy birthday” on the cake?', `Messages on cakes are still to be confirmed: ${fn('message on the cake offered or not, maximum length')}.`),
        q('Do you make tiered cakes?', `Tiered cakes are still to be confirmed: ${fn('tiered cakes offered or not')}.`),
        q('Do you make smash cakes?', `The first-birthday smash cake is still to be confirmed: ${fn('smash cake offered or not')}.`),
        q('Can I change my order after the deposit?', `Changes after the deposit follow the terms of sale: ${fn('deadline for changes after the deposit')}.`),
        q('Do you deliver cakes?', `Cakes are picked up at 3 rue Court, Granby. Delivery: ${DELIVERY_EN}.`),
      ],
      changeNote: 'First version: custom-cake lead times, sizes, prices and themes to be confirmed.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const gateauPourDemain = {
  key: 'gateau-pour-demain',
  status: 'conditional',
  condition: 'Commande pour le lendemain + heure limite confirmées',
  locales: {
    fr: {
      title: 'Gâteau pour demain à Granby · Pâtisserie Coco Vanille',
      description: 'Un gâteau pour demain à Granby? À la Pâtisserie Coco Vanille, commandez avant l’heure limite pour une cueillette le lendemain au 3, rue Court, au centre-ville.',
      h1: 'Un gâteau pour demain à Granby',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, à Granby, prépare des gâteaux pour le lendemain quand la commande arrive avant l’heure limite : ${fn('heure limite de commande pour le lendemain')}. Les formats offerts pour le lendemain sont ${fn('formats offerts pour le lendemain')}, à récupérer en boutique. Le calendrier affiche seulement les dates possibles.`,
      sections: [
        s('Peut-on avoir un gâteau pour demain à Granby?', `Oui, si la commande arrive avant ${fn('heure limite de commande pour le lendemain')} : la Pâtisserie Coco Vanille prépare alors un gâteau pour une cueillette le lendemain au 3, rue Court.`),
        s('Quels gâteaux sont offerts pour le lendemain?', `Les gâteaux offerts pour le lendemain restent à confirmer par la boutique : ${fn('gâteaux et formats offerts pour le lendemain')}.`),
        s('Jusqu’à quelle heure commander pour demain?', `L’heure limite est ${fn('heure limite de commande pour le lendemain')}. Le calendrier calcule la première date possible à partir de l’heure limite, des jours de fermeture et des places libres de la journée.`),
        s('Et si c’est pour aujourd’hui?', 'Pour aujourd’hui, la vitrine du jour, sur la page d’accueil, montre les gâteaux et les pâtisseries en vente. Appelez au 450-372-7177 pour vérifier avant de vous déplacer.'),
      ],
      faq: [
        q('C’est-tu possible d’avoir un gâteau pour demain?', `Oui, si vous commandez avant ${fn('heure limite de commande pour le lendemain')}, dans les formats offerts pour le lendemain. Après l’heure limite, le calendrier propose le jour suivant.`),
        q('Peut-on personnaliser un gâteau pour demain?', `La personnalisation d’un gâteau pour le lendemain reste à confirmer : ${fn('personnalisation possible pour le lendemain ou non')}.`),
        q('Peut-on commander un gâteau pour demain par téléphone?', 'Oui : appelez au 450-372-7177 avant l’heure limite. La commande entre dans le même calendrier que les commandes en ligne.'),
        q('Peut-on commander pour un lendemain de fermeture?', `Non : le calendrier saute les jours de fermeture et propose la prochaine journée ouverte. La boutique est fermée ${CLOSED_FR}; les autres jours de fermeture, fériés ou exceptionnels, sont signalés dans le tableau des heures.`),
        q('Peut-on écrire un message sur un gâteau pour demain?', `Le message sur un gâteau pour le lendemain reste à confirmer : ${fn('message possible sur un gâteau pour le lendemain')}.`),
      ],
      changeNote: 'Jours de fermeture ajoutés; la page attend la confirmation de la commande pour le lendemain et de l’heure limite.',
      contentUpdatedAt: UPDATED_1027,
    },
  },
}

const buches = {
  key: 'buches',
  status: 'conditional',
  condition: 'Bûches offertes (oui/non avant le 1er novembre)',
  locales: {
    fr: {
      title: 'Bûches de Noël à Granby · Pâtisserie Coco Vanille',
      description: 'Bûches de Noël de la Pâtisserie Coco Vanille, à Granby : saveurs, formats, portions, prix et dates de précommande pour une cueillette au 3, rue Court.',
      h1: 'Bûches de Noël à Granby',
      answer:
        `La Pâtisserie Coco Vanille, au 3, rue Court, à Granby, publie sur cette page permanente ses bûches de Noël, leurs formats, leurs portions et leurs prix, avec l’état des précommandes : bientôt, ouvertes, complet ou de retour l’an prochain. Bûches offertes en 2026 : ${fn('bûches offertes, oui ou non, avant le 1er novembre')}.`,
      sections: [
        s('Où acheter une bûche de Noël à Granby?', `À la Pâtisserie Coco Vanille, au 3, rue Court, si la boutique offre des bûches cette année : ${fn('bûches offertes en 2026')}. Elles se précommandent sur cette page et se récupèrent en boutique.`),
        s('Quand faut-il commander sa bûche de Noël?', `Les précommandes ouvrent et ferment aux dates affichées en haut de cette page : ${fn('dates d’ouverture et de fermeture des précommandes')}. Une fois les places prises, la page affiche « Complet ».`),
        s('Combien coûte une bûche de Noël?', `Le prix de chaque bûche est écrit en texte sur sa page, avant taxes : ${fn('prix des bûches par format')}.`),
        s('Combien de personnes nourrit une bûche de Noël?', `Le nombre de portions dépend du format de la bûche : ${fn('portions par format de bûche')}.`),
        s('Qu’est-ce qu’une bûche de Noël?', 'La bûche de Noël est un gâteau roulé en forme de bûche, garni de crème et décoré, servi pendant le temps des Fêtes.'),
      ],
      faq: [
        q('Quelles sont les dates de cueillette pour Noël?', `Les dates de cueillette sont affichées avec les précommandes : ${fn('dates de cueillette des bûches')}.`),
        q('Peut-on choisir la saveur de sa bûche?', `Les saveurs offertes restent à confirmer : ${fn('saveurs de bûches')}.`),
        q('Faites-vous des bûches glacées?', `Les bûches glacées restent à confirmer : ${fn('bûches glacées offertes ou non')}.`),
        q('Que se passe-t-il quand les bûches sont complètes?', `La page affiche « Complet » et les dates de cueillette disparaissent du calendrier. Liste d’attente : ${fn('liste d’attente offerte ou non')}.`),
        q('Faut-il payer à la précommande?', 'Les conditions de vente précisent quand le paiement est pris. Si la boutique annule une précommande, vous êtes remboursé au complet dans les 15 jours.'),
      ],
      changeNote: 'Première version de la page permanente des bûches; offre 2026 à confirmer avant le 1er novembre.',
      contentUpdatedAt: UPDATED,
    },
  },
}

const chef = {
  key: 'chef',
  status: 'conditional',
  condition: 'Consentement photo + biographie du chef',
  locales: {
    fr: {
      title: 'Le chef de la Pâtisserie Coco Vanille, à Granby',
      description: 'Qui prépare les gâteaux et les viennoiseries de la Pâtisserie Coco Vanille, à Granby? Parcours, formation et spécialités du chef, présentés avec son accord.',
      h1: 'Le chef de la Pâtisserie Coco Vanille',
      answer:
        `Cette page présente la personne qui dirige la cuisine de la Pâtisserie Coco Vanille, au 3, rue Court, à Granby : son nom, son parcours, sa formation et ses spécialités. Elle est publiée seulement avec son accord écrit et une photo autorisée. Chef : ${fn('nom, rôle et parcours, avec consentement')}.`,
      sections: [
        s('Qui est le chef de la Pâtisserie Coco Vanille?', `Le chef sera présenté ici avec son accord : ${fn('nom et rôle du chef')}.`),
        s('Quelle est sa formation?', `La formation du chef reste à confirmer : ${fn('formation et parcours du chef')}.`),
        s('Quelles sont ses spécialités?', `Les spécialités du chef restent à confirmer : ${fn('spécialités du chef')}.`),
      ],
      faq: [
        q('Depuis quand le chef travaille-t-il à la Pâtisserie Coco Vanille?', `La date d’arrivée du chef reste à confirmer : ${fn('année d’arrivée du chef')}.`),
        q('Peut-on rencontrer le chef pour un gâteau personnalisé?', `Les rencontres pour un gâteau personnalisé restent à confirmer : ${fn('rencontre avec le chef offerte ou non')}.`),
        q('Le chef a-t-il reçu des prix?', `Aucun prix n’est indiqué pour l’instant : ${fn('prix ou distinctions, avec une preuve datée')}.`),
        q('Où voir le travail du chef?', 'Les photos publiées par la boutique sont sur son compte Instagram, @coco_vanillegranby, et sur sa page Facebook, facebook.com/PatisserieCocoVanille.'),
        q('Qui prépare les viennoiseries?', `L’équipe de production reste à présenter, avec son accord : ${fn('équipe de production')}.`),
      ],
      changeNote: 'Compte Instagram ajouté; la page attend la biographie et le consentement photo du chef.',
      contentUpdatedAt: UPDATED_1029,
    },
  },
}

const withTypography = (page) => ({
  ...page,
  locales: Object.fromEntries(Object.entries(page.locales).map(([locale, copy]) => [locale, locale === 'fr' ? frTypo(copy) : copy])),
})

export const pages = [home, carte, commander, nousTrouver, zooDeGranby, aPropos, allergenes, faq, viennoiseries, pains, gateaux, patisseries, confidentialite, conditionsDeVente, temoins, accessibilite, prix, calculateur, gateauxPersonnalises, gateauPourDemain, buches, chef].map(withTypography)
