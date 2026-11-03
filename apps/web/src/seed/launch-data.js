// What the site needs on launch day (2026-11-04) so a customer can read a price and reserve: approximate formats, prices,
// lead times and tax classes, the products the shop publishes itself, and the reservation settings. Written by the agency
// at the operator's request of 2026-11-03; every price is marked « indicatif » on the site and « Prix à vérifier » in Studio
// until the owner checks it. Sources for the orders of magnitude, read on 2026-11-03: Avec un Grand A (Granby, 6–8 and 10–12
// servings, 45–65 $, 48 h), Rose Gâteaux (Granby, from 6,50 $ a serving, 12-serving minimum, 3 weeks), Première Moisson
// (24–48 h), public prices of a croissant (about 2,55 $), a baguette (about 3,40 $) and an almond croissant (about 3,58 $),
// raised a little for a small shop. Tax classes follow the rule written in Studio › Produits (lib/ordering/tax.js).
// Allergens stay out of this file: a person checks them in Studio. Pure module (no imports): the unit tests read it.

const CLASSIC = [
  { label: '6 po', en: '6-inch', sizeInches: 6, portionsMin: 6, portionsMax: 8, priceCents: 4500 },
  { label: '8 po', en: '8-inch', sizeInches: 8, portionsMin: 10, portionsMax: 12, priceCents: 6500 },
  { label: '10 po', en: '10-inch', sizeInches: 10, portionsMin: 16, portionsMax: 20, priceCents: 9500 },
]
const DECORATED = [
  { label: '6 po', en: '6-inch', sizeInches: 6, portionsMin: 6, portionsMax: 8, priceCents: 6500 },
  { label: '8 po', en: '8-inch', sizeInches: 8, portionsMin: 10, portionsMax: 12, priceCents: 8500 },
  { label: '10 po', en: '10-inch', sizeInches: 10, portionsMin: 16, portionsMax: 20, priceCents: 12500 },
]
const SHEET = [
  { label: 'Quart de plaque', en: 'Quarter sheet', portionsMin: 12, portionsMax: 15, priceCents: 7000 },
  { label: 'Demi-plaque', en: 'Half sheet', portionsMin: 20, portionsMax: 25, priceCents: 11000 },
]
const SQUARE = [
  { label: 'Carré de 8 po', en: '8-inch square', sizeInches: 8, portionsMin: 12, portionsMax: 15, priceCents: 7000 },
  { label: 'Carré de 10 po', en: '10-inch square', sizeInches: 10, portionsMin: 20, portionsMax: 25, priceCents: 11000 },
]
const LOG = [
  { label: 'Petite', en: 'Small', portionsMin: 6, portionsMax: 6, priceCents: 3800 },
  { label: 'Moyenne', en: 'Medium', portionsMin: 10, portionsMax: 10, priceCents: 5800 },
  { label: 'Grande', en: 'Large', portionsMin: 12, portionsMax: 16, priceCents: 7500 },
]
const one = (priceCents, extra = {}) => [{ label: 'À l’unité', en: 'Each', portionsMin: 1, portionsMax: 1, priceCents, ...extra }]

const DAYS = (n) => n * 24
const cake = (variants, lead) => ({ variants, taxClass: 'zero', leadTimeHours: lead, cakeMessageMax: 30 })
const log = { variants: LOG, taxClass: 'zero', leadTimeHours: 72, season: 'noel' }

// French slug → what the product page shows. Whole cakes are zero-rated; individual sweet pastries follow the bakery rule
// (under 230 g, under 6 units: GST); savoury food ready to eat is taxable.
export const OFFERS = {
  // Classic: 48 h
  'gateau-marbre-aux-amandes': cake(CLASSIC, 48),
  'gateau-creme-et-copeaux-blancs': cake(CLASSIC, 48),
  'gateau-croustillant-au-chocolat': cake(CLASSIC, 48),
  'gateau-couronne-de-fraises': cake(CLASSIC, 48),
  'gateau-red-velvet': cake(CLASSIC, 48),
  'gateau-ganache-et-creme': cake(CLASSIC, 48),
  'gateau-fraises-et-amandes-effilees': cake(CLASSIC, 48),
  'gateau-aux-framboises': cake(CLASSIC, 48),
  'shortcake-aux-fraises': cake(CLASSIC, 48),
  'gateau-rectangulaire-en-couches': cake(SHEET, 48),
  'gateau-rectangulaire-aux-fraises': cake(SHEET, 48),
  'gateau-carre-noisettes-et-chocolat': cake(SQUARE, 48),
  'gateau-au-fromage-basque': cake([
    { label: '6 po', en: '6-inch', sizeInches: 6, portionsMin: 6, portionsMax: 8, priceCents: 4200 },
    { label: '8 po', en: '8-inch', sizeInches: 8, portionsMin: 10, portionsMax: 12, priceCents: 6200 },
  ], 48),
  // Decorated: 7 days
  'gateau-theme-plage': cake(DECORATED, DAYS(7)),
  'gateau-couronne-de-perles': cake(DECORATED, DAYS(7)),
  'gateau-eventails-noir-et-or': cake(DECORATED, DAYS(7)),
  'gateau-de-finissants': cake(DECORATED, DAYS(7)),
  'gateau-d-halloween': cake(DECORATED, DAYS(7)),
  'gateau-aux-macarons': cake(DECORATED, DAYS(7)),
  'gateau-degrade-bleu': cake(DECORATED, DAYS(7)),
  'gateau-papillons': cake(DECORATED, DAYS(7)),
  'gateau-perles-et-boules-disco': cake(DECORATED, DAYS(7)),
  'gateau-soleil-et-lune-dores': cake(DECORATED, DAYS(7)),
  'gateau-blanc-et-or-aux-papillons': cake(DECORATED, DAYS(7)),
  'gateau-rose-aux-confettis': cake(DECORATED, DAYS(7)),
  'gateau-coeur-a-la-creme': cake([{ label: 'Cœur de 8 po', en: '8-inch heart', sizeInches: 8, portionsMin: 10, portionsMax: 12, priceCents: 7000 }], DAYS(7)),
  // Tiered: 14 days
  'gateau-deux-etages-aux-noeuds-rouges': cake([{ label: 'Deux étages', en: 'Two tiers', portionsMin: 25, portionsMax: 30, priceCents: 19000 }], DAYS(14)),
  'gateau-aux-roses': cake([{ label: 'Deux étages', en: 'Two tiers', portionsMin: 30, portionsMax: 40, priceCents: 22000 }], DAYS(14)),
  // Season
  'buche-au-sapin': log,
  'buche-aux-spirales': log,
  'buche-blanche-striee': log,
  'buche-forestiere': log,
  'buche-aux-rosaces': log,
  // Sold by the piece or to share
  'bouquet-de-cupcakes': { variants: [{ label: 'Bouquet de 7 cupcakes', en: '7-cupcake bouquet', portionsMin: 7, portionsMax: 7, priceCents: 4500, unitWeightGrams: 90, packCount: 7 }], taxClass: 'rule', leadTimeHours: 72 },
  'couronne-de-choux-aux-rosaces': { variants: [{ label: 'Couronne', en: 'Crown', portionsMin: 8, portionsMax: 10, priceCents: 4800 }], taxClass: 'zero', leadTimeHours: 72 },
  'paris-brest': { variants: [{ label: 'Individuel', en: 'Individual', portionsMin: 1, portionsMax: 1, priceCents: 750, unitWeightGrams: 120 }, { label: 'À partager', en: 'To share', portionsMin: 6, portionsMax: 8, priceCents: 4000, unitWeightGrams: 700 }], taxClass: 'rule', leadTimeHours: 48 },
  'vol-au-vent': { variants: one(700), taxClass: 'taxable', leadTimeHours: 48 },
  'croissant-aux-amandes': { variants: one(425, { unitWeightGrams: 90 }), taxClass: 'rule', leadTimeHours: 24 },
  baguette: { variants: one(375), taxClass: 'zero', leadTimeHours: 24 },
}

const SHOP_TAIL = {
  fr: 'À la Pâtisserie Coco Vanille, à Granby, à commander en ligne ou à prendre au comptoir du 3, rue Court.',
  en: 'At Pâtisserie Coco Vanille in Granby, to order online or pick up at the counter, 3 rue Court.',
}

// What the shop publishes itself (research/20b §1, posts of August to October 2026) and a few plain basics, as products with a
// page and a price. No photo of their own yet: the site labels the picture « Photo d'illustration » (lib/photos.js), and
// the owner can add a real one in Studio › Produits.
export const SHOP_PRODUCTS = [
  { slug: 'croissant', enSlug: 'croissant', title: 'Croissant', en: 'Croissant', family: 'viennoiseries', fr: 'Un croissant nature.', enText: 'A plain croissant.', offer: { variants: one(325), taxClass: 'zero', leadTimeHours: 24 } },
  { slug: 'chocolatine', enSlug: 'chocolatine', title: 'Chocolatine', en: 'Chocolatine', family: 'viennoiseries', fr: 'Une chocolatine, aussi appelée pain au chocolat.', enText: 'A chocolatine, also called pain au chocolat.', offer: { variants: one(395, { unitWeightGrams: 85 }), taxClass: 'rule', leadTimeHours: 24 } },
  { slug: 'pain-de-campagne', enSlug: 'country-loaf', title: 'Pain de campagne', en: 'Country loaf', family: 'pains', fr: 'Un pain de campagne à la croûte dorée.', enText: 'A country loaf with a golden crust.', offer: { variants: one(675), taxClass: 'zero', leadTimeHours: 24 } },
  { slug: 'msemmen', enSlug: 'msemmen', title: 'Msemmen', en: 'Msemmen', family: 'pains', fr: 'Une crêpe marocaine feuilletée.', enText: 'A flaky Moroccan crêpe.', offer: { variants: one(250), taxClass: 'zero', leadTimeHours: 24 } },
  { slug: 'harcha', enSlug: 'harcha', title: 'Harcha', en: 'Harcha', family: 'pains', fr: 'Une galette marocaine de semoule, cuite à la poêle.', enText: 'A Moroccan semolina flatbread cooked in a pan.', offer: { variants: one(250), taxClass: 'zero', leadTimeHours: 24 } },
  { slug: 'mousse-au-chocolat', enSlug: 'chocolate-mousse', title: 'Mousse au chocolat', en: 'Chocolate mousse', family: 'patisseries', fr: 'Une mousse au chocolat onctueuse, avec une finition croquante.', enText: 'A smooth chocolate mousse with a crunchy finish.', offer: { variants: one(650, { unitWeightGrams: 120 }), taxClass: 'rule', leadTimeHours: 48 } },
  { slug: 'gateau-royal', enSlug: 'gateau-royal', title: 'Gâteau Royal', en: 'Gâteau Royal', family: 'patisseries', fr: 'Une pâtisserie intensément chocolatée, à la texture fondante, sur une base croustillante, avec un glaçage de chocolat brillant et quelques noisettes.', enText: 'An intensely chocolatey pastry with a melting texture, a crisp base, a shiny chocolate glaze and a few hazelnuts.', offer: { variants: one(750, { unitWeightGrams: 130 }), taxClass: 'rule', leadTimeHours: 48 } },
  { slug: 'verrine-kunafa-pistache', enSlug: 'pistachio-kunafa-verrine', title: 'Verrine kunafa pistache', en: 'Pistachio kunafa verrine', family: 'patisseries', fr: 'Une verrine à la kunafa et à la pistache, offerte selon la saison.', enText: 'A verrine with kunafa and pistachio, offered depending on the season.', offer: { variants: one(750, { unitWeightGrams: 130 }), taxClass: 'rule', leadTimeHours: 48 } },
  { slug: 'feuillete-sale', enSlug: 'savoury-puff-pastry', title: 'Feuilleté salé', en: 'Savoury puff pastry', family: 'patisseries', fr: 'Un feuilleté doré, garni de salé.', enText: 'A golden puff pastry with a savoury filling.', offer: { variants: one(450), taxClass: 'taxable', leadTimeHours: 24 } },
  { slug: 'mini-pizza', enSlug: 'mini-pizza', title: 'Mini pizza', en: 'Mini pizza', family: 'patisseries', fr: 'Une mini pizza généreusement garnie.', enText: 'A generously topped mini pizza.', offer: { variants: one(450), taxClass: 'taxable', leadTimeHours: 24 } },
  { slug: 'pastilla-au-poulet', enSlug: 'chicken-pastilla', title: 'Pastilla au poulet', en: 'Chicken pastilla', family: 'patisseries', fr: 'Une pastilla au poulet.', enText: 'A chicken pastilla.', offer: { variants: one(750), taxClass: 'taxable', leadTimeHours: 24 } },
  { slug: 'sandwich-au-thon', enSlug: 'tuna-sandwich', title: 'Sandwich au thon', en: 'Tuna sandwich', family: 'patisseries', fr: 'Un sandwich au thon, à l’œuf, aux olives, à la tomate et à la salade.', enText: 'A sandwich with tuna, egg, olives, tomato and lettuce.', offer: { variants: one(850), taxClass: 'taxable', leadTimeHours: 24 } },
  { slug: 'sandwich-au-cachir', enSlug: 'cachir-sandwich', title: 'Sandwich au cachir', en: 'Cachir sandwich', family: 'patisseries', fr: 'Un sandwich au saucisson de viande (cachir), au fromage, à la tomate et à la salade.', enText: 'A sandwich with meat sausage (cachir), cheese, tomato and lettuce.', offer: { variants: one(850), taxClass: 'taxable', leadTimeHours: 24 } },
  { slug: 'plateau-de-bouchees-salees', enSlug: 'savoury-bites-platter', title: 'Plateau de bouchées salées', en: 'Platter of savoury bites', family: 'patisseries', fr: 'Un plateau à partager ou à apporter à un événement : mini burgers, quiches au thon, petits croissants au saumon et wraps au poulet.', enText: 'A platter to share or bring to an event: mini burgers, tuna quiches, small salmon croissants and chicken wraps.', offer: { variants: [{ label: 'Pour 8 à 10 personnes', en: 'For 8 to 10 people', portionsMin: 8, portionsMax: 10, priceCents: 5500 }], taxClass: 'taxable', leadTimeHours: 72 } },
].map((p) => ({ ...p, tail: SHOP_TAIL }))

// Reservation settings, written once; the owner changes them in Studio › Boutique & heures.
export const ORDERING = { enabled: true, nextDayCutoff: '14:00', windowMinutes: 30, maxPerWindow: 4, maxDaysAhead: 60, quoteValidHours: 72 }
export const POOLS = [
  { productionCategory: 'gateaux', unit: 'cakes', defaultPerDay: 8 },
  { productionCategory: 'viennoiseries', unit: 'items', defaultPerDay: 60 },
  { productionCategory: 'pains', unit: 'items', defaultPerDay: 40 },
  { productionCategory: 'patisseries', unit: 'items', defaultPerDay: 40 },
]
const noon = (iso) => `${iso}T12:00:00.000Z`
export const SEASON = {
  key: 'noel',
  name: { fr: 'Noël 2026', en: 'Christmas 2026', es: 'Navidad 2026' },
  mode: 'date-first',
  // Open from launch day; closes at the end of December 18 in Granby.
  preorderOpensAt: '2026-11-03T12:00:00.000Z',
  preorderClosesAt: '2026-12-19T04:59:00.000Z',
  pickupDates: ['2026-12-19', '2026-12-20', '2026-12-23', '2026-12-24'].map((d) => ({ date: noon(d) })),
  active: true,
}
