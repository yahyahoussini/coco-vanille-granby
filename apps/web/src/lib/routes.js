// Page registry: one intent = one page per language (00 §5.2). URLs are fixed once (v1 L9).
// status: core | conditional (needs owner facts) | utility (noindex)
// es pages exist only when ENABLE_ES=true (someone serves customers in Spanish, M10).
export const SITE_ORIGIN = 'https://cocovanillegranby.com'
export const LOCALES = ['fr', 'en', 'es']
export const HTML_LANG = { fr: 'fr-CA', en: 'en-CA', es: 'es' }

export const PAGES = [
  { key: 'home', template: 'home', status: 'core', paths: { fr: '/', en: '/en/', es: '/es/' } },
  { key: 'carte', template: 'menu', status: 'core', parent: 'home', paths: { fr: '/carte/', en: '/en/menu/' } },
  { key: 'commander', template: 'order', status: 'core', parent: 'home', paths: { fr: '/commander/', en: '/en/order/', es: '/es/pedidos/' } },
  { key: 'nous-trouver', template: 'visit', status: 'core', parent: 'home', paths: { fr: '/nous-trouver/', en: '/en/visit/', es: '/es/como-llegar/' } },
  // Visitors of the Zoo de Granby: one page, under Nous trouver (research/22d §1; Spanish stays off).
  { key: 'zoo-de-granby', template: 'content', status: 'core', parent: 'nous-trouver', paths: { fr: '/nous-trouver/zoo-de-granby/', en: '/en/visit/granby-zoo/' } },
  { key: 'a-propos', template: 'about', status: 'core', parent: 'home', paths: { fr: '/a-propos/', en: '/en/about/', es: '/es/nosotros/' } },
  { key: 'chef', template: 'content', status: 'conditional', parent: 'a-propos', condition: 'Consentement photo + biographie du chef', paths: { fr: '/a-propos/chef/', en: '/en/about/chef/' } },
  { key: 'prix', template: 'prices', status: 'conditional', parent: 'home', condition: 'Grille de prix du propriétaire', paths: { fr: '/prix/', en: '/en/prices/', es: '/es/precios/' } },
  { key: 'gateau-pour-demain', template: 'content', status: 'conditional', parent: 'gateaux', condition: 'Commande pour le lendemain + heure limite confirmées', paths: { fr: '/gateau-pour-demain/', en: '/en/cake-for-tomorrow/' } },
  { key: 'gateaux-personnalises', template: 'content', status: 'conditional', parent: 'gateaux', condition: 'Gâteaux sur commande confirmés (volume, délai, prix)', paths: { fr: '/gateaux-personnalises-granby/', en: '/en/custom-cakes-granby/', es: '/es/pasteles-personalizados-granby/' } },
  { key: 'buches', template: 'seasonal', status: 'conditional', parent: 'gateaux', season: 'noel', condition: 'Bûches offertes (oui/non avant le 1er novembre)', paths: { fr: '/buches-de-noel/', en: '/en/yule-logs/', es: '/es/tronco-de-navidad/' } },
  { key: 'allergenes', template: 'allergens', status: 'core', parent: 'home', paths: { fr: '/allergenes/', en: '/en/allergens/', es: '/es/alergenos/' } },
  { key: 'faq', template: 'content', status: 'core', parent: 'home', paths: { fr: '/faq/', en: '/en/faq/', es: '/es/preguntas-frecuentes/' } },
  { key: 'calculateur', template: 'calculator', status: 'conditional', parent: 'gateaux', condition: 'Portions par taille fournies par le propriétaire', paths: { fr: '/calculateur-portions-gateau/', en: '/en/cake-serving-calculator/', es: '/es/calculadora-porciones-pastel/' } },
  { key: 'viennoiseries', template: 'category', status: 'core', parent: 'carte', category: 'viennoiseries', paths: { fr: '/viennoiseries/', en: '/en/viennoiseries/' } },
  { key: 'pains', template: 'category', status: 'core', parent: 'carte', category: 'pains', paths: { fr: '/pains-baguettes/', en: '/en/bread/', es: '/es/panaderia/' } },
  { key: 'gateaux', template: 'category', status: 'core', parent: 'carte', category: 'gateaux', paths: { fr: '/gateaux/', en: '/en/cakes/', es: '/es/pasteles/' } },
  { key: 'patisseries', template: 'category', status: 'core', parent: 'carte', category: 'patisseries', paths: { fr: '/patisseries/', en: '/en/pastries/', es: '/es/postres/' } },
  { key: 'confidentialite', template: 'legal', status: 'core', parent: 'home', paths: { fr: '/confidentialite/', en: '/en/privacy/' } },
  { key: 'conditions-de-vente', template: 'legal', status: 'core', parent: 'home', paths: { fr: '/conditions-de-vente/', en: '/en/terms-of-sale/' } },
  { key: 'temoins', template: 'legal', status: 'core', parent: 'home', paths: { fr: '/temoins/', en: '/en/cookies/' } },
  { key: 'accessibilite', template: 'legal', status: 'core', parent: 'home', paths: { fr: '/accessibilite/', en: '/en/accessibility/' } },
  // Utility pages: crawlable, noindex, out of the sitemap (00 §5.2 "Not indexed").
  { key: 'boite', template: 'box', status: 'utility', paths: { fr: '/boite/', en: '/en/box/', es: '/es/caja/' } },
  { key: 'paiement', template: 'checkout', status: 'utility', paths: { fr: '/commander/paiement/', en: '/en/order/checkout/', es: '/es/pedidos/pago/' } },
  { key: 'merci', template: 'thanks', status: 'utility', paths: { fr: '/commander/merci/', en: '/en/order/thanks/', es: '/es/pedidos/gracias/' } },
]

export const esEnabled = () => process.env.ENABLE_ES === 'true'
export const localeEnabled = (locale) => locale !== 'es' || esEnabled()

export const pageByKey = (key) => PAGES.find((p) => p.key === key)

export const pathFor = (key, locale) => {
  const page = pageByKey(key)
  if (!page || !localeEnabled(locale)) return null
  return page.paths[locale] || null
}

export const urlFor = (key, locale) => {
  const p = pathFor(key, locale)
  return p ? `${SITE_ORIGIN}${p}` : null
}

// "/en/menu/" → { page, locale }. Paths are normalised to a trailing slash.
export function resolvePath(locale, segments = []) {
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const path = `${prefix}/${segments.length ? segments.join('/') + '/' : ''}`
  const page = PAGES.find((p) => p.paths[locale] === path)
  return { page: page && localeEnabled(locale) ? page : null, path }
}

// Reciprocal hreflang set: only equivalents that exist, + x-default → FR (M9).
export function alternatesFor(key) {
  const page = pageByKey(key)
  if (!page) return {}
  const languages = {}
  for (const locale of LOCALES) {
    const p = pathFor(key, locale)
    if (p) languages[HTML_LANG[locale]] = `${SITE_ORIGIN}${p}`
  }
  if (page.paths.fr) languages['x-default'] = `${SITE_ORIGIN}${page.paths.fr}`
  return languages
}

export const isIndexable = (page) => page && page.status !== 'utility'
