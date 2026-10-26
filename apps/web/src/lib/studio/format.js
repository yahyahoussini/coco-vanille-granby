// Studio wording and number formats, Québec French (16 §3.0 « Format », 16a §8.2).
import { clockFr, clockOf, shortDay, localParts, addDays, dayOf } from './time.js'

const nbsp = ' '

// 4500 → « 45,00 $ »
export function money(cents) {
  if (!Number.isFinite(cents)) return ''
  const s = (Math.round(cents) / 100).toFixed(2).replace('.', ',')
  const [int, dec] = s.split(',')
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, nbsp)},${dec}${nbsp}$`
}

// « 45 », « 45,5 », « 45,50 » → cents; null when it is not a price.
export function parseMoney(text) {
  const s = String(text ?? '').trim().replace(/\s|\$/g, '').replace(',', '.')
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(s)) return null
  return Math.round(Number(s) * 100)
}

export const STATUS = {
  pending_payment: { label: 'Paiement en cours', tone: 'warn', icon: '◷' },
  paid: { label: 'Payée', tone: 'info', icon: '●' },
  ready: { label: 'Prête', tone: 'ok', icon: '✓' },
  picked_up: { label: 'Récupérée', tone: 'done', icon: '✓' },
  not_picked_up: { label: 'Non récupérée', tone: 'bad', icon: '!' },
  cancelled: { label: 'Annulée', tone: 'muted', icon: '×' },
  refunded: { label: 'Remboursée', tone: 'muted', icon: '↺' },
}

export const statusOf = (status) => STATUS[status] || { label: status || '—', tone: 'muted', icon: '•' }

// Payment line on a card: « Payée en ligne · 48,00 $ », « Acompte payé · solde 126,00 $ au comptoir », « À payer au comptoir ».
export function paymentLine(order) {
  const p = order?.payment || {}
  const t = order?.totals || {}
  if (p.status === 'refunded' || order?.status === 'refunded') return 'Remboursée'
  if (p.kind === 'deposit') return t.balanceCents > 0 ? `Acompte payé · solde ${money(t.balanceCents)} au comptoir` : 'Acompte et solde payés'
  if (p.provider === 'counter') return t.balanceCents > 0 ? `À payer au comptoir · ${money(t.balanceCents)}` : `Payée au comptoir · ${money(t.totalCents)}`
  if (p.status === 'paid') return `Payée en ligne · ${money(t.totalCents)}`
  if (p.status === 'failed') return 'Paiement refusé'
  return 'Paiement en attente'
}

// « Julie T. » from first + last name (staff screens use first name + initial).
export function customerName(customer) {
  if (!customer) return 'Client'
  const first = String(customer.firstName || '').trim()
  const last = String(customer.lastName || '').trim()
  if (!first && !last) return 'Client'
  return last ? `${first} ${last[0].toUpperCase()}.` : first
}

export const languageBadge = (l) => (l === 'en' ? 'EN' : l === 'es' ? 'ES' : 'FR')

// « 10 h 15 » or « heure à convenir » (custom-cake orders made from a deposit have no window).
export const windowLabel = (order) => (order?.pickupWindowStart ? clockFr(order.pickupWindowStart) : 'heure à convenir')
export const windowRange = (order) => (order?.pickupWindowStart ? `${clockFr(order.pickupWindowStart)}–${clockFr(order.pickupWindowEnd || order.pickupWindowStart)}` : 'heure à convenir')

// « aujourd'hui », « demain », otherwise « sam. 31 oct. »
export function dayWord(iso, now = new Date()) {
  const today = localParts(now).iso
  const d = dayOf(iso)
  if (d === today) return 'aujourd’hui'
  if (d === addDays(today, 1)) return 'demain'
  if (d === addDays(today, -1)) return 'hier'
  return shortDay(d)
}

// « jeudi 9 h » for an instant (next opening, closure end…)
export function whenFr(date, now = new Date()) {
  if (!date) return ''
  const p = localParts(date)
  const day = dayWord(p.iso, now)
  return `${day} ${clockOf(date)}`
}

// « 14 cueillettes · 3 prêtes · 1 en retard »
export function plural(n, one, many) {
  return `${n} ${n === 1 || n === 0 ? one : many}`
}

export const stars = (n) => '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(Math.max(0, 5 - Math.max(0, Math.min(5, n))))

// « 18 h pour répondre » · « Délai de 24 h dépassé de 2 h »
export function answerTimer(deadline, now = new Date()) {
  if (!deadline) return { overdue: false, text: '' }
  const ms = new Date(deadline).getTime() - new Date(now).getTime()
  const h = Math.floor(Math.abs(ms) / 3600000)
  const m = Math.round((Math.abs(ms) % 3600000) / 60000)
  const span = h >= 1 ? `${h} h` : `${m} min`
  if (ms >= 0) return { overdue: false, text: `${span} pour répondre`, urgent: ms < 6 * 3600000 }
  return { overdue: true, text: `Délai de 24 h dépassé de ${span}` }
}
