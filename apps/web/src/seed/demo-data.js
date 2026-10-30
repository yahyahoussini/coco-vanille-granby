// DEMO DATA ONLY, shared by src/seed/demo.js (ordering demo, e2e) and src/seed/demo-catalogue.js (test products
// with photos). Invented prices, portions and capacity: every variant is labelled « (démo) », never a fact.

export const DEMO = '(démo)'
export const DEMO_EN = '(demo)'

// Demo catalogue facts for the shop's own products (01 §5), by French slug. Prices in cents before taxes;
// weights per serving for the tax rule.
export const PRODUCTS = {
  'gateau-aux-framboises': {
    taxClass: 'rule',
    leadTimeHours: 48,
    cakeMessageMax: 30,
    everSold: true,
    variants: [
      { fr: `6 po ${DEMO}`, en: `6-inch ${DEMO_EN}`, sizeInches: 6, portionsMin: 8, portionsMax: 10, priceCents: 3800, unitWeightGrams: 1100 },
      { fr: `8 po ${DEMO}`, en: `8-inch ${DEMO_EN}`, sizeInches: 8, portionsMin: 12, portionsMax: 16, priceCents: 5200, unitWeightGrams: 1700 },
    ],
  },
  'shortcake-aux-fraises': {
    taxClass: 'rule',
    leadTimeHours: 48,
    cakeMessageMax: 30,
    variants: [{ fr: `8 po ${DEMO}`, en: `8-inch ${DEMO_EN}`, sizeInches: 8, portionsMin: 12, portionsMax: 14, priceCents: 4800, unitWeightGrams: 1500 }],
  },
  'paris-brest': {
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `Individuel ${DEMO}`, en: `Single ${DEMO_EN}`, portionsMin: 1, priceCents: 650, unitWeightGrams: 180 }],
  },
  'croissant-aux-amandes': {
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `À l’unité ${DEMO}`, en: `Each ${DEMO_EN}`, portionsMin: 1, priceCents: 425, unitWeightGrams: 110 }],
  },
  baguette: {
    taxClass: 'zero',
    leadTimeHours: 24,
    variants: [{ fr: `Baguette ${DEMO}`, en: `Baguette ${DEMO_EN}`, priceCents: 400, unitWeightGrams: 250 }],
  },
  // Vol-au-vent stays out of online sale on purpose: heated food is 07 §6 row 9 (ASK the accountant).
}

export const POOLS = { gateaux: 6, viennoiseries: 120, pains: 80, patisseries: 40 }

// Test products that do not exist at the shop (src/seed/demo-catalogue.js): slugs end in « -demo », the summary
// says it is a demonstration. `photo`: a file in src/seed/demo-photos/ or « public:<key> » (public/photos/<key>-1200.webp).
export const TEST_PRODUCTS = [
  {
    slug: ['croissant-au-beurre-demo', 'butter-croissant-demo'],
    title: ['Croissant au beurre', 'Butter croissant'],
    category: 'viennoiseries',
    photo: 'croissant-au-beurre',
    vitrine: true,
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `À l’unité ${DEMO}`, en: `Each ${DEMO_EN}`, portionsMin: 1, priceCents: 325, unitWeightGrams: 70 }],
  },
  {
    slug: ['chocolatine-demo', 'chocolatine-demo'],
    title: ['Chocolatine', 'Chocolatine'],
    category: 'viennoiseries',
    photo: 'public:viennoiseries',
    vitrine: true,
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `À l’unité ${DEMO}`, en: `Each ${DEMO_EN}`, portionsMin: 1, priceCents: 375, unitWeightGrams: 80 }],
  },
  {
    slug: ['eclair-au-chocolat-demo', 'chocolate-eclair-demo'],
    title: ['Éclair au chocolat', 'Chocolate éclair'],
    category: 'patisseries',
    photo: 'eclair-au-chocolat',
    vitrine: true,
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `Individuel ${DEMO}`, en: `Single ${DEMO_EN}`, portionsMin: 1, priceCents: 550, unitWeightGrams: 90 }],
  },
  {
    slug: ['tartelette-aux-fruits-demo', 'fruit-tartlet-demo'],
    title: ['Tartelette aux fruits', 'Fruit tartlet'],
    category: 'patisseries',
    photo: 'public:patisseries',
    vitrine: true,
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [{ fr: `Individuelle ${DEMO}`, en: `Single ${DEMO_EN}`, portionsMin: 1, priceCents: 600, unitWeightGrams: 110 }],
  },
  {
    slug: ['macarons-demo', 'macarons-demo'],
    title: ['Macarons', 'Macarons'],
    category: 'patisseries',
    photo: 'macarons',
    vitrine: false,
    taxClass: 'rule',
    leadTimeHours: 24,
    variants: [
      { fr: `Boîte de 6 ${DEMO}`, en: `Box of 6 ${DEMO_EN}`, portionsMin: 6, priceCents: 1500, unitWeightGrams: 15, packCount: 6 },
      { fr: `Boîte de 12 ${DEMO}`, en: `Box of 12 ${DEMO_EN}`, portionsMin: 12, priceCents: 2800, unitWeightGrams: 15, packCount: 12 },
    ],
  },
  {
    slug: ['gateau-au-chocolat-demo', 'chocolate-cake-demo'],
    title: ['Gâteau au chocolat', 'Chocolate cake'],
    category: 'gateaux',
    photo: 'gateau-au-chocolat',
    vitrine: false,
    taxClass: 'rule',
    leadTimeHours: 48,
    cakeMessageMax: 30,
    variants: [
      { fr: `6 po ${DEMO}`, en: `6-inch ${DEMO_EN}`, sizeInches: 6, portionsMin: 8, portionsMax: 10, priceCents: 4200, unitWeightGrams: 1200 },
      { fr: `8 po ${DEMO}`, en: `8-inch ${DEMO_EN}`, sizeInches: 8, portionsMin: 12, portionsMax: 16, priceCents: 5800, unitWeightGrams: 1800 },
    ],
  },
]

// Photos for the shop's own products, demo only (removed by SEED_DEMO=clean): the site as it will look once the
// owner uploads hers. Same file conventions as TEST_PRODUCTS[].photo.
export const PRODUCT_PHOTOS = {
  'croissant-aux-amandes': 'croissant-aux-amandes',
  baguette: 'public:pains',
  'paris-brest': 'paris-brest',
  'vol-au-vent': 'vol-au-vent',
  'gateau-aux-framboises': 'public:gateaux',
  'shortcake-aux-fraises': 'shortcake-aux-fraises',
}

// Real products also shown « dans la vitrine » by the demo catalogue.
export const VITRINE = ['croissant-aux-amandes', 'paris-brest']
