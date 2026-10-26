// Public URLs of the ordering pages per locale, from the page registry (src/lib/routes.js).
import { pathFor } from '../routes.js'

const p = (key, locale) => pathFor(key, locale) || pathFor(key, 'fr')

export const orderPath = (locale) => p('commander', locale)
export const boxPath = (locale, token) => `${p('boite', locale)}${token ? `${token}/` : ''}`
export const checkoutPath = (locale) => p('paiement', locale)
export const thanksPath = (locale) => p('merci', locale)
export const termsPath = (locale) => (locale === 'en' ? p('conditions-de-vente', 'en') : p('conditions-de-vente', 'fr'))
export const privacyPath = (locale) => (locale === 'en' ? p('confidentialite', 'en') : p('confidentialite', 'fr'))

// Query keys stay French on every locale (they are not indexed).
export const Q = { day: 'jour', window: 'plage', order: 'commande', quote: 'soumission', request: 'demande', error: 'erreur' }
