// Customer textos sent from Studio actions, in the customer's language, one GSM-7 segment each (10 §6, AC12).
// Transactional only: sender named, STOP line, no order contents, never the allergy note (07 O9).
import { toGsm, smsInfo } from '../messaging/gsm.js'
import { dayOf } from './time.js'

const STOP = { fr: 'STOP pour ne plus recevoir de textos.', en: 'Reply STOP to opt out.', es: 'Responda STOP para darse de baja.' }
const lang = (l) => (['fr', 'en', 'es'].includes(l) ? l : 'fr')

const dayShort = (iso, l) => {
  const s = new Intl.DateTimeFormat(l === 'en' ? 'en-CA' : l === 'es' ? 'es' : 'fr-CA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${dayOf(iso)}T12:00:00Z`))
  return (l === 'fr' ? s.replace(/(^|\s)1(\s)/, '$11er$2') : s).replace(/\.$/, '')
}

const call = { fr: (p) => (p ? `appelez le ${p}` : 'appelez la boutique'), en: (p) => (p ? `call ${p}` : 'call the shop'), es: (p) => (p ? `llame al ${p}` : 'llame a la tienda') }

const T = {
  // Fermeture exceptionnelle: the customer chooses a new date or a refund; Studio never moves the pickup (G12).
  closure: {
    fr: (d) => `Coco Vanille : fermé le ${d.day}. Commande ${d.number} : ${call.fr(d.phone)} pour une autre date ou un remboursement. ${STOP.fr}`,
    en: (d) => `Coco Vanille: closed ${d.day}. Order ${d.number}: ${call.en(d.phone)} for another date or a refund. ${STOP.en}`,
    es: (d) => `Coco Vanille: cerrado el ${d.day}. Pedido ${d.number}: ${call.es(d.phone)} para otra fecha o un reembolso. ${STOP.es}`,
  },
  other_slot: {
    fr: (d) => `Coco Vanille : pour la commande ${d.number}, pouvons-nous changer l'heure de cueillette? ${call.fr(d.phone).replace(/^a/, 'A')}. ${STOP.fr}`,
    en: (d) => `Coco Vanille: for order ${d.number}, could we change the pickup time? Please ${call.en(d.phone)}. ${STOP.en}`,
    es: (d) => `Coco Vanille: para el pedido ${d.number}, ¿podemos cambiar la hora de recogida? Por favor ${call.es(d.phone)}. ${STOP.es}`,
  },
  payment_link: {
    fr: (d) => `Coco Vanille, paiement ${d.number} : ${d.link} ${STOP.fr}`,
    en: (d) => `Coco Vanille, payment ${d.number}: ${d.link} ${STOP.en}`,
    es: (d) => `Coco Vanille, pago ${d.number}: ${d.link} ${STOP.es}`,
  },
}

export const STUDIO_SMS = Object.keys(T)

export function studioSms(template, locale, data) {
  const fn = T[template]?.[lang(locale)]
  if (!fn) throw new Error(`texto Studio inconnu : ${template}`)
  const d = { ...data, day: data.day ? dayShort(data.day, lang(locale)) : '' }
  return toGsm(fn(d).replace(/\s+/g, ' ').trim())
}

export const segments = (text) => smsInfo(toGsm(text)).segments

// Free text written by the owner (refusal, other date): the screen shows how many textos it costs.
export function freeTextSms(text) {
  const body = toGsm(String(text || '').replace(/\s+/g, ' ').trim())
  return { body, ...smsInfo(body) }
}
