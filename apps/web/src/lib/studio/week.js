// « Cette semaine » (16 §4.2): 5 numbers readable in 5 seconds, at most 3 cards, the Système tile.
// Numbers come from orders, requests and reviews; site calls/directions (GA4) and AI citations (rank-first)
// show as « pas encore relié » until those reports exist. Never a per-staff number (G20).
import { localParts, addDays, weekStart, zonedTime, shortDay } from './time.js'
import { money } from './format.js'
import { holidaySuggestions } from '../ordering/holidays.js'
import { marker } from '../facts.js'

const COUNTED = ['paid', 'ready', 'picked_up', 'not_picked_up']

export function percentChange(now, before) {
  if (!before) return null
  return Math.round(((now - before) / before) * 100)
}

const signed = (n) => (n === null ? '' : ` ${n >= 0 ? '+' : '−'}${Math.abs(n)} %`)

export function weekBounds(now = new Date()) {
  const monday = weekStart(localParts(now).iso)
  return { monday, sunday: addDays(monday, 6), from: zonedTime(monday, '00:00'), to: zonedTime(addDays(monday, 7), '00:00'), prevFrom: zonedTime(addDays(monday, -7), '00:00') }
}

// Pure: the 5 lines from already-loaded rows.
export function fiveNumbers({ orders = [], prevOrders = [], requests = [], reviews = [] }) {
  const online = orders.filter((o) => o.source === 'web' && COUNTED.includes(o.status))
  const prev = prevOrders.filter((o) => o.source === 'web' && COUNTED.includes(o.status))
  const sum = (list) => list.reduce((s, o) => s + (o.totals?.totalCents || 0), 0)
  const ok = requests.filter((r) => ['quoted', 'deposit_paid', 'confirmed'].includes(r.status)).length
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null
  const fast = reviews.filter((r) => r.repliedAt && new Date(r.repliedAt).getTime() - new Date(r.receivedAt).getTime() <= 24 * 3600000).length
  return [
    { key: 'orders', label: 'Commandes en ligne', value: `${online.length} · ${money(sum(online))}${signed(percentChange(online.length, prev.length))}` },
    { key: 'requests', label: 'Demandes', value: `${requests.length} ${requests.length > 1 ? 'reçues' : 'reçue'} · ${ok} chiffrée${ok > 1 ? 's' : ''}` },
    { key: 'reviews', label: 'Avis', value: reviews.length ? `${reviews.length} ${reviews.length > 1 ? 'nouveaux' : 'nouveau'} · ${avg.toFixed(1).replace('.', ',')} · ${fast}/${reviews.length} répondus en 24 h` : 'aucun nouvel avis' },
    { key: 'calls', label: 'Appels + itinéraires (site)', value: 'pas encore relié (GA4)', muted: true },
    { key: 'ai', label: 'Cité par l’IA', value: 'pas encore mesuré (rapports rank-first)', muted: true },
  ]
}

// Owner cards (≤ 3): a missing fact that blocks something first, then what is due soonest (16 §4.4–§4.5).
export function weekCards({ shop = {}, products = [], pools = [], now = new Date() }) {
  const today = localParts(now).iso
  const cards = []
  if (!(shop.hours || []).length) cards.push({ key: 'hours', rank: 0, title: 'Confirmer les heures d’ouverture', why: `Le site affiche « à confirmer » et la commande en ligne attend : ${marker('heures d’ouverture')}`, href: '/boutique/#heures', action: 'Répondre' })
  if (typeof shop.ordering?.depositPercent !== 'number') cards.push({ key: 'deposit', rank: 1, title: 'Fixer le pourcentage d’acompte', why: 'Sans lui, aucune soumission de gâteau ne peut partir.', href: '/plus/reglages/#reglages-boutique', action: 'Fixer' })
  const noPrice = products.filter((p) => p._status === 'published' && (p.variants || []).some((v) => !Number.isInteger(v.priceCents)))
  if (noPrice.length) cards.push({ key: 'price', rank: 2, title: `Valider le prix ${noPrice.length > 1 ? `de ${noPrice.length} produits` : `du ${noPrice[0].title}`}`, why: 'Un prix manquant reste « à confirmer » sur le site.', href: `/plus/produits/${noPrice.length === 1 ? `${noPrice[0].id}/` : ''}`, action: 'Valider' })
  if (!pools.some((p) => typeof p.defaultPerDay === 'number')) cards.push({ key: 'capacity', rank: 3, title: 'Indiquer la capacité de production par jour', why: 'Sans capacité, rien ne se commande en ligne.', href: '/boutique/#capacite', action: 'Répondre' })
  const holiday = holidaySuggestions(shop, { fromISO: today }).find((h) => h.date <= addDays(today, 30))
  if (holiday) cards.push({ key: `hol-${holiday.date}`, rank: 1, title: `Le ${shortDay(holiday.date)} approche : ouvert ou fermé?`, why: `${holiday.label} · à confirmer`, href: '/boutique/#jours-speciaux', action: 'Choisir' })
  return cards.sort((a, b) => a.rank - b.rank).slice(0, 3)
}

// Système tile (17 §8.2): textos stuck in the queue, failures this week. Backups and uptime come from the
// agency's monitor (Agence › Système).
export async function systemTile(payload, { now = new Date() } = {}) {
  const stuck = await payload.count({ collection: 'messages', where: { and: [{ status: { equals: 'queued' } }, { sendAfter: { less_than: new Date(now.getTime() - 5 * 60000).toISOString() } }] }, overrideAccess: true })
  const failed = await payload.count({ collection: 'messages', where: { and: [{ status: { equals: 'failed' } }, { updatedAt: { greater_than_equal: new Date(now.getTime() - 7 * 86400000).toISOString() } }] }, overrideAccess: true })
  if (stuck.totalDocs) return { tone: 'bad', text: `Les textos ne partent pas (${stuck.totalDocs} en attente) · l’agence est avertie` }
  if (failed.totalDocs) return { tone: 'warn', text: `${failed.totalDocs} ${failed.totalDocs > 1 ? 'textos ou courriels non livrés' : 'texto ou courriel non livré'} cette semaine` }
  return { tone: 'ok', text: 'Système : tout roule ✓' }
}
