// Avis (16 §3.5, G7): reply drafts from the research/11 §4.5 templates, in the reviewer's language, signed
// « — L'équipe Coco Vanille », no staff names, no order details. No AI at launch: the only « smart » part is
// spotting a product name from the catalogue in the review text.
export const KINDS = [
  ['positive', 'Positif'],
  ['stars', 'Note seule'],
  ['negative', 'Négatif'],
  ['unknown', 'Client introuvable'],
]

const SIGN = { fr: '— L’équipe Coco Vanille', en: '— The Coco Vanille team', es: '— El equipo Coco Vanille' }

export function kindFor(review) {
  if (!review) return 'positive'
  if (review.rating <= 3) return 'negative'
  return String(review.text || '').trim() ? 'positive' : 'stars'
}

// « Julie T. (démo) » → « Julie »
export function firstNameOf(author) {
  const clean = String(author || '').replace(/\(.*?\)/g, '').trim()
  return clean.split(/\s+/)[0] || ''
}

// A product the customer named, taken from the catalogue (« Paris-Brest »), never invented.
export function namedProduct(text, titles = []) {
  const t = String(text || '').toLowerCase()
  return [...titles].sort((a, b) => b.length - a.length).find((title) => title && t.includes(title.toLowerCase())) || null
}

// « le Paris-Brest », « le croissant aux amandes », « l’éclair », « les brioches » (the owner reviews every draft).
export function withArticle(title) {
  const first = title.split(/\s+/)[0]
  const proper = /^[A-ZÀ-Ý][a-zà-ÿ]+-[A-ZÀ-Ý]/.test(title)
  const word = proper ? title : title.charAt(0).toLowerCase() + title.slice(1)
  if (/[sx]$/i.test(first)) return `les ${word}`
  return /^[aeiouyhàâéèêîôû]/i.test(word) ? `l’${word}` : `le ${word}`
}

const T = {
  positive: {
    fr: (d) => `Merci beaucoup${d.name ? `, ${d.name}` : ''}! On est contents que ${d.named ? withArticle(d.named) : 'ça'} vous ${d.named && /^les /.test(withArticle(d.named)) ? 'aient' : 'ait'} plu. Au plaisir de vous revoir rue Court.`,
    en: (d) => `Thank you so much${d.name ? `, ${d.name}` : ''}! We're glad you enjoyed ${d.named ? `the ${d.named}` : 'it'}. See you on rue Court.`,
    es: (d) => `¡Muchas gracias${d.name ? `, ${d.name}` : ''}! Nos alegra que le haya gustado${d.named ? ` el ${d.named}` : ''}. Lo esperamos en la rue Court.`,
  },
  stars: {
    fr: (d) => `Merci pour votre note${d.name ? `, ${d.name}` : ''}. Au plaisir!`,
    en: (d) => `Thanks for your rating${d.name ? `, ${d.name}` : ''}. Hope to see you again!`,
    es: (d) => `Gracias por su calificación${d.name ? `, ${d.name}` : ''}. ¡Hasta pronto!`,
  },
  negative: {
    fr: (d) => `Bonjour${d.name ? ` ${d.name}` : ''}, merci de nous l’avoir dit, et désolés : ce n’est pas ce que vous aviez commandé. Pouvez-vous nous joindre ${d.contact.fr} avec votre numéro de commande? On veut comprendre et corriger.`,
    en: (d) => `Hi${d.name ? ` ${d.name}` : ''}, thank you for telling us, and we're sorry: this isn't what you ordered. Could you reach us ${d.contact.en} with your order number? We want to understand and fix it.`,
    es: (d) => `Hola${d.name ? ` ${d.name}` : ''}: gracias por decírnoslo, y lo sentimos: no es lo que usted pidió. ¿Puede contactarnos ${d.contact.es} con su número de pedido? Queremos entender y corregirlo.`,
  },
  unknown: {
    fr: (d) => `Bonjour, nous ne trouvons pas de commande correspondant à cette description. Pouvez-vous nous appeler ${d.contact.frCall} pour qu’on regarde ensemble?`,
    en: (d) => `Hello, we can't find an order matching this description. Could you call us ${d.contact.enCall} so we can look into it together?`,
    es: (d) => `Hola: no encontramos un pedido que coincida con esta descripción. ¿Puede llamarnos ${d.contact.esCall} para revisarlo juntos?`,
  },
}

// Phone and email from the business global; a missing one is left out, never invented (the email is an owner fact).
function contactOf({ phone, email }) {
  const both = (p, e, or) => [p, e].filter(Boolean).join(or)
  return {
    fr: both(phone && `au ${phone}`, email && `à ${email}`, ' ou ') || 'à la boutique',
    en: both(phone && `at ${phone}`, email && `at ${email}`, ' or ') || 'at the shop',
    es: both(phone && `al ${phone}`, email && `a ${email}`, ' o ') || 'en la tienda',
    frCall: phone ? `au ${phone}` : 'à la boutique',
    enCall: phone ? `at ${phone}` : 'at the shop',
    esCall: phone ? `al ${phone}` : 'en la tienda',
  }
}

export function replyTemplate(kind, language, { author, text, titles = [], phone = null, email = null } = {}) {
  const l = ['fr', 'en', 'es'].includes(language) ? language : 'fr'
  const fn = (T[kind] || T.positive)[l]
  const body = fn({ name: firstNameOf(author), named: namedProduct(text, titles), contact: contactOf({ phone, email }) })
  return `${body} ${SIGN[l]}`
}

// « Répondre d'ici : demain 13 h » = 24 h after the review (M1), closed days included.
export const replyDeadline = (review) => new Date(new Date(review.receivedAt).getTime() + 24 * 3600 * 1000)

export function googleLink(business = {}) {
  if (business.google?.reviewLink) return business.google.reviewLink
  if (business.google?.cid) return `https://maps.google.com/?cid=${business.google.cid}`
  return 'https://business.google.com/'
}
