// Head copy built from facts only (no invented claim): product titles and descriptions, unique per page and
// distinct per language even when a product keeps its French name in English (Baguette, Paris-Brest).
// Pure module (relative imports) for node --test.
const TITLE = {
  fr: (name) => `${name} à Granby · Pâtisserie Coco Vanille`,
  en: (name) => `${name} in Granby · Pâtisserie Coco Vanille`,
  es: (name) => `${name} en Granby · Pâtisserie Coco Vanille`,
}

// What the product page holds, said plainly, with the verified address when the business record has it.
const DESCRIPTION = {
  fr: (name, at) => `${name} de Pâtisserie Coco Vanille${at ? `, ${at}` : ' à Granby'} : formats, portions, allergènes et délai pour commander.`,
  en: (name, at) => `${name} from Pâtisserie Coco Vanille${at ? `, ${at}` : ' in Granby'}: sizes, servings, allergens and how far ahead to order.`,
  es: (name, at) => `${name} de Pâtisserie Coco Vanille${at ? `, ${at}` : ' en Granby'}: formatos, porciones, alérgenos y plazo para pedir.`,
}
const AT = {
  fr: (street, city) => `${street} à ${city}`,
  en: (street, city) => `${street.replace(/^(\d+),\s*/, '$1 ')} in ${city}`,
  es: (street, city) => `${street.replace(/^(\d+),\s*/, '$1 ')} en ${city}`,
}

const pick = (table, locale) => table[locale] || table.fr

// Cut at a word boundary, ≤ max characters, with an ellipsis when cut.
export function clip(text, max = 160) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const i = cut.lastIndexOf(' ')
  return `${(i > 80 ? cut.slice(0, i) : cut).replace(/[\s,;:·–-]+$/, '')}…`
}

export const productTitle = (product, locale = 'fr') => pick(TITLE, locale)(product?.title || 'Produit')

export function productDescription(product, business, locale = 'fr') {
  if (product?.summary && product.summary.trim()) return clip(product.summary)
  const a = business?.address || {}
  const at = a.street && a.city ? pick(AT, locale)(a.street, a.city) : null
  return clip(pick(DESCRIPTION, locale)(product?.title || '', at))
}
