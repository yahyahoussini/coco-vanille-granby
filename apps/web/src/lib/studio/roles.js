// Who sees which Studio screen and who may do what (16 §2.2 access matrix, 16b §4 roles).
// Pure module: the same rules drive the tab bar, the screens and the server-side action guard.
export const P = 'proprietaire'
export const G = 'gerant'
export const C = 'comptoir'
export const A = 'agence'
export const T = 'traduction'

export const ROLE_LABELS = { proprietaire: 'Propriétaire', gerant: 'Gérant·e', comptoir: 'Comptoir', agence: 'Agence', traduction: 'Traduction', integration: 'Intégration' }

// Roles that can open Studio at all (the integration bot uses an API key, never a screen).
export const STUDIO_ROLES = [P, G, C, A, T]
export const BAKERY_ROLES = [P, G, C]

export const SCREENS = {
  aujourdhui: [P, G, C],
  commandes: [P, G, C, A], // Agence: counts only
  vitrine: [P, G, C],
  demandes: [P, G],
  avis: [P, G, A], // Agence: read
  boutique: [P, G, C, A], // Comptoir: read + « Délai allongé »; Agence: read
  semaine: [P, G, A], // Gérant·e: read
  produits: [P, G, A, T],
  question: [P, G, C, A],
  reglages: [P, G, C, A, T],
  agence: [P, A], // Propriétaire: read
  plus: [P, G, C, A, T],
}

// Server-side action guard. A role missing from a list is refused, whatever the screen shows.
export const ACTIONS = {
  'order.ready': [P, G, C],
  'order.unready': [P, G, C],
  'order.pickup': [P, G, C],
  'order.bulkReady': [P, G, C],
  'order.phone': [P, G, C],
  'order.cancel': [P, G],
  'order.refund': [P],
  'production.print': [P, G, C],
  'product.soldout': [P, G, C],
  'product.soldoutDays': [P, G, C],
  'product.soldoutIndefinite': [P],
  'product.restock': [P, G, C],
  'product.price': [P, G],
  'product.allergens': [P, G],
  'product.tax': [P],
  'vitrine.add': [P, G, C],
  'vitrine.remove': [P, G, C],
  'vitrine.copyYesterday': [P, G, C],
  'vitrine.photo': [P, G, C],
  'shop.busy': [P, G, C],
  'shop.busyStop': [P, G, C],
  'shop.pause': [P, G],
  'shop.resume': [P, G],
  'shop.closure': [P, G], // + Comptoir when the owner allows it (user.mayClose)
  'shop.reopen': [P, G],
  'shop.hours': [P, G],
  'shop.special': [P, G],
  'capacity.adjust': [P, G],
  'request.quote': [P, G],
  'request.decline': [P, G],
  'request.otherDate': [P, G],
  'review.create': [P, G],
  'review.answered': [P, G],
  'review.later': [P, G],
  'question.create': [P, G, C, A],
  'settings.deposit': [P],
  'settings.reviewLink': [P],
  'settings.mayClose': [P],
  'users.create': [P],
  'users.pin': [P],
  'users.active': [P],
  'device.mode': [P, G, C, A, T],
}

// Money, prices, allergens, taxes and people need a fresh identity check (16b §4 #4).
export const STEP_UP = new Set(['order.refund', 'product.price', 'product.allergens', 'product.tax', 'settings.deposit', 'users.create', 'users.pin', 'users.active'])

// Actions that may wait in the offline outbox; everything else needs the network (16 §3.0 offline policy).
export const OFFLINE_OK = new Set(['product.soldout', 'product.restock', 'order.ready', 'order.pickup', 'vitrine.photo', 'question.create'])

export const roleOf = (user) => (user && user.active !== false && STUDIO_ROLES.includes(user.role) ? user.role : null)

export function canSee(user, screen) {
  const role = roleOf(user)
  return Boolean(role && SCREENS[screen]?.includes(role))
}

export function can(user, action) {
  const role = roleOf(user)
  if (!role) return false
  if ((action === 'shop.closure' || action === 'shop.reopen') && role === C) return user.mayClose === true
  return Boolean(ACTIONS[action]?.includes(role))
}

export const needsStepUp = (action) => STEP_UP.has(action)

// Bottom tab bar, 5 slots max (16 §2.1). The first two tabs are the same for every bakery role.
const TAB = {
  aujourdhui: { key: 'aujourdhui', href: '/', label: 'Aujourd’hui' },
  commandes: { key: 'commandes', href: '/commandes/', label: 'Commandes' },
  vitrine: { key: 'vitrine', href: '/vitrine/', label: 'Vitrine' },
  demandes: { key: 'demandes', href: '/demandes/', label: 'Demandes' },
  avis: { key: 'avis', href: '/avis/', label: 'Avis' },
  semaine: { key: 'semaine', href: '/semaine/', label: 'Semaine' },
  agence: { key: 'agence', href: '/agence/', label: 'Agence' },
  plus: { key: 'plus', href: '/plus/', label: 'Plus' },
}

export function tabsFor(user) {
  const role = roleOf(user)
  if (role === P || role === G) return [TAB.aujourdhui, TAB.commandes, TAB.demandes, TAB.avis, TAB.plus]
  if (role === C) return [TAB.aujourdhui, TAB.commandes, TAB.vitrine, TAB.plus]
  if (role === A) return [TAB.agence, TAB.semaine, TAB.avis, TAB.plus]
  if (role === T) return [TAB.plus]
  return []
}

// Where a role lands after login.
export const homeFor = (user) => (roleOf(user) === A ? '/agence/' : roleOf(user) === T ? '/plus/' : '/')

// Agence sees no customer names, phones, codes or allergy notes by default (Loi 25 minimisation, 16 §1.1).
// Second layer on top of the collection field access.
export function redactOrder(order, user) {
  if (!order) return order
  if (BAKERY_ROLES.includes(roleOf(user))) return order
  const { customer, allergyNote, accessToken, pickupCode, ...rest } = order
  return { ...rest, customer: null, allergyNote: null, accessToken: null, pickupCode: null, hasAllergy: Boolean(allergyNote) }
}

export const redactRequest = (request, user) => {
  if (!request) return request
  if ([P, G].includes(roleOf(user))) return request
  const { customer, accessToken, photos, ...rest } = request
  return { ...rest, customer: null, accessToken: null, photos: [] }
}
