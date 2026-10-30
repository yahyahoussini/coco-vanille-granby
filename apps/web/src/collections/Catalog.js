import { anyone, isOwnerOrManager, isEditor, publishedOrTeam, withStepUp, nobody } from '../lib/access.js'
import { auditHooks } from '../lib/studio/audit.js'

// Health Canada / CFIA priority allergens + gluten sources (07 A-3).
export const PRIORITY_ALLERGENS = [
  ['oeufs', 'Œufs', 'Eggs', 'Huevo'],
  ['lait', 'Lait', 'Milk', 'Leche'],
  ['moutarde', 'Moutarde', 'Mustard', 'Mostaza'],
  ['arachides', 'Arachides', 'Peanuts', 'Cacahuetes'],
  ['crustaces-mollusques', 'Crustacés et mollusques', 'Crustaceans and molluscs', 'Crustáceos y moluscos'],
  ['poisson', 'Poisson', 'Fish', 'Pescado'],
  ['sesame', 'Sésame', 'Sesame', 'Sésamo'],
  ['soya', 'Soya', 'Soy', 'Soya'],
  ['sulfites', 'Sulfites', 'Sulphites', 'Sulfitos'],
  ['noix', 'Noix', 'Tree nuts', 'Frutos de cáscara'],
  ['ble-triticale', 'Blé et triticale', 'Wheat and triticale', 'Trigo y triticale'],
  ['gluten', 'Sources de gluten (orge, avoine, seigle)', 'Gluten sources (barley, oats, rye)', 'Fuentes de gluten (cebada, avena, centeno)'],
]

export const PRODUCTION_CATEGORIES = [
  { value: 'gateaux', label: 'Gâteaux' },
  { value: 'viennoiseries', label: 'Viennoiseries' },
  { value: 'pains', label: 'Pains et baguettes' },
  { value: 'patisseries', label: 'Pâtisseries' },
  { value: 'traiteur', label: 'Traiteur' },
]

export const Allergens = {
  slug: 'allergens',
  admin: { useAsTitle: 'label', group: 'Boutique' },
  access: { read: anyone, create: isOwnerOrManager, update: isOwnerOrManager, delete: () => false },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true },
    { name: 'label', type: 'text', required: true, localized: true },
  ],
}

export const Categories = {
  slug: 'categories',
  admin: { useAsTitle: 'title', group: 'Boutique' },
  access: { read: anyone, create: isOwnerOrManager, update: isEditor, delete: isOwnerOrManager },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, localized: true, index: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'productionCategory', type: 'select', options: PRODUCTION_CATEGORIES },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

// REST and « Avancé » writes on what a customer relies on (16 §2.2, 16b §4 #4). Studio's own actions check the
// role matrix and the step-up, then write with overrideAccess, so Comptoir's « Épuisé » still works there.
const stepUpPG = withStepUp('proprietaire', 'gerant')
const moneyPG = { create: stepUpPG, update: stepUpPG }
const taxOwner = { create: withStepUp('proprietaire'), update: withStepUp('proprietaire') }
const opsPG = { update: isOwnerOrManager }

const ids = (list) => (Array.isArray(list) ? list : []).map((a) => String(a && typeof a === 'object' ? a.id ?? a.value : a)).sort()
const sameIds = (a, b) => JSON.stringify(ids(a)) === JSON.stringify(ids(b))

// « Vérifié par » is never typed: whoever changes the allergen lists is recorded, from the session (G3).
// Studio's « J’ai vérifié la recette » writes its own stamp (studioAudited).
export const stampAllergens = ({ data, originalDoc, req, operation }) => {
  if (!data || !req?.user || req.context?.studioAudited) return data
  const touched = ['allergens', 'mayContain'].some((k) => k in data && (operation === 'create' ? ids(data[k]).length > 0 : !sameIds(data[k], originalDoc?.[k])))
  if (touched) data.allergensVerified = { by: req.user.id, at: new Date().toISOString() }
  return data
}

const productAudit = auditHooks('products')

// One indexable page per product (08 move 3). Facts are data fields so FR/EN/ES never drift.
export const Products = {
  slug: 'products',
  admin: { useAsTitle: 'title', group: 'Boutique', defaultColumns: ['title', 'category', 'availability', '_status'] },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: publishedOrTeam, create: isOwnerOrManager, update: isEditor, delete: isOwnerOrManager },
  hooks: { beforeChange: [stampAllergens], ...productAudit },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, localized: true, index: true },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'productionCategory', type: 'select', options: PRODUCTION_CATEGORIES, required: true },
    { name: 'summary', type: 'textarea', localized: true, admin: { description: 'Première phrase = réponse directe (40–60 mots avec la marque et un fait).' } },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'variants',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'sizeInches', type: 'number' },
        { name: 'portionsMin', type: 'number' },
        { name: 'portionsMax', type: 'number' },
        { name: 'unitWeightGrams', type: 'number', admin: { description: 'Requis pour la règle de taxe des produits de boulangerie (07 §6).' } },
        {
          name: 'priceCents',
          type: 'number',
          admin: { description: 'Prix en cents, taxes en sus. Vide = [[FACT NEEDED]].' },
          access: moneyPG,
        },
        { name: 'sku', type: 'text' },
        // Tax rule rows 4–5 (07 §6): single servings in a prepackaged pack. Empty = sold one by one.
        { name: 'packCount', type: 'number', min: 1, admin: { description: 'Portions individuelles par boîte (vide = à l’unité).' } },
      ],
    },
    { name: 'allergens', type: 'relationship', relationTo: 'allergens', hasMany: true, access: moneyPG },
    { name: 'mayContain', type: 'relationship', relationTo: 'allergens', hasMany: true, label: 'Peut contenir', access: moneyPG },
    {
      name: 'allergensVerified',
      type: 'group',
      admin: { description: 'Vérifié par une personne, jamais par l’IA (G3). Rempli par le serveur.', readOnly: true },
      access: { create: nobody, update: nobody },
      fields: [
        { name: 'by', type: 'relationship', relationTo: 'users' },
        { name: 'at', type: 'date' },
      ],
    },
    {
      name: 'taxClass',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { value: 'pending', label: 'À choisir (vente en ligne bloquée)' },
        { value: 'zero', label: 'Détaxé (produit alimentaire de base)' },
        { value: 'taxable', label: 'Taxable (TPS + TVQ)' },
        { value: 'rule', label: 'Selon la règle des produits de boulangerie (quantité/poids)' },
      ],
      access: taxOwner,
    },
    { name: 'leadTimeHours', type: 'number', defaultValue: 0, admin: { description: 'Délai minimum de préparation.' } },
    {
      name: 'availability',
      type: 'select',
      required: true,
      defaultValue: 'instock',
      access: opsPG,
      options: [
        { value: 'instock', label: 'En vente' },
        { value: 'soldout', label: 'Épuisé (schema SoldOut)' },
        { value: 'backorder', label: 'Saisonnier de retour + date (BackOrder)' },
        { value: 'preorder', label: 'Nouveau, jamais vendu + date (PreOrder)' },
        { value: 'discontinued', label: 'Retiré' },
      ],
    },
    { name: 'soldOutUntil', type: 'date', access: opsPG, admin: { description: 'Épuisé jusqu’à cette date (par défaut : prochaine ouverture).' } },
    { name: 'availabilityDate', type: 'date', access: opsPG },
    { name: 'onlineOrderable', type: 'checkbox', defaultValue: false, access: opsPG },
    // Ordering engine (10 §3): what one item takes from its production pool, and when it is made.
    { name: 'capacityUnits', type: 'number', min: 1, admin: { description: 'Unités de capacité par article (vide = 1).' } },
    { name: 'productionOffsetDays', type: 'number', min: 0, admin: { description: 'Fait la veille = 1 (vide = le jour même).' } },
    { name: 'cakeMessageMax', type: 'number', min: 1, admin: { description: 'Caractères permis pour le message sur le gâteau (vide = pas de message).' } },
    // Vendu auparavant → BackOrder (et non PreOrder) quand il revient (06 k).
    { name: 'everSold', type: 'checkbox', defaultValue: false, label: 'Déjà vendu (produit qui revient)' },
    { name: 'vitrine', type: 'checkbox', defaultValue: false, label: 'Dans la vitrine du jour', access: opsPG },
    { name: 'vitrinePlanned', type: 'number', access: opsPG, admin: { description: 'Quantité prévue aujourd’hui.' } },
    { name: 'season', type: 'relationship', relationTo: 'seasons' },
  ],
}

export const Seasons = {
  slug: 'seasons',
  admin: { useAsTitle: 'name', group: 'Boutique' },
  access: { read: anyone, create: isOwnerOrManager, update: isOwnerOrManager, delete: isOwnerOrManager },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'mode', type: 'select', defaultValue: 'date-first', options: ['date-first', 'product-first'] },
    { name: 'preorderOpensAt', type: 'date' },
    { name: 'preorderClosesAt', type: 'date' },
    { name: 'pickupDates', type: 'array', fields: [{ name: 'date', type: 'date', required: true }] },
    { name: 'active', type: 'checkbox', defaultValue: false },
  ],
}
