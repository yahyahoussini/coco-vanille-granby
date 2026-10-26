// Demandes (16 §3.4): editable answers for « Refuser » and « Autre date », in the customer's language, and the
// message that carries them (email when given, otherwise one texto). Prices go through sendQuote only.
import { freeTextSms } from './texts.js'

const lang = (l) => (['fr', 'en', 'es'].includes(l) ? l : 'fr')
const day = (iso, l) => {
  const s = new Intl.DateTimeFormat(l === 'en' ? 'en-CA' : l === 'es' ? 'es' : 'fr-CA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${String(iso).slice(0, 10)}T12:00:00Z`))
  return l === 'fr' ? s.replace(/(^|\s)1(\s)/, '$11er$2') : s
}

export function declineText(language, { date } = {}) {
  const l = lang(language)
  return {
    fr: `Bonjour, désolés, nous sommes complets le ${day(date, l)} et ne pouvons pas prendre votre commande. Merci d’avoir pensé à nous.`,
    en: `Hello, we're sorry: we're fully booked on ${day(date, l)} and can't take your order. Thank you for thinking of us.`,
    es: `Hola: lo sentimos, estamos completos el ${day(date, l)} y no podemos aceptar su pedido. Gracias por pensar en nosotros.`,
  }[l]
}

export function otherDateText(language, { date, alt, phone } = {}) {
  const l = lang(language)
  const call = { fr: phone ? ` ou appelez-nous au ${phone}` : '', en: phone ? ` or call us at ${phone}` : '', es: phone ? ` o llámenos al ${phone}` : '' }[l]
  return {
    fr: `Bonjour, désolés, nous sommes complets le ${day(date, l)}. Nous pouvons vous proposer le ${day(alt, l)}. Répondez à ce message${call}.`,
    en: `Hello, we're sorry: we're fully booked on ${day(date, l)}. We can offer ${day(alt, l)} instead. Reply to this message${call}.`,
    es: `Hola: lo sentimos, estamos completos el ${day(date, l)}. Podemos proponerle el ${day(alt, l)}. Responda a este mensaje${call}.`,
  }[l]
}

const SUBJECT = { fr: 'Votre demande de gâteau · Pâtisserie Coco Vanille', en: 'Your cake request · Pâtisserie Coco Vanille', es: 'Su solicitud de pastel · Pâtisserie Coco Vanille' }
const SIGN = { fr: '— L’équipe Coco Vanille', en: '— The Coco Vanille team', es: '— El equipo Coco Vanille' }
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// → { channel, to, subject?, body, html?, segments? } or null when there is no way to reach the customer.
export function answerMessage(request, text, { phone = null } = {}) {
  const l = lang(request.customer?.language)
  const body = `${String(text || '').trim()}\n\n${SIGN[l]}${phone ? ` · ${phone}` : ''}`
  if (request.customer?.email) {
    const html = `<!doctype html><html lang="${l === 'fr' ? 'fr-CA' : l}"><body style="font-family:Arial,sans-serif;color:#2e211a">${body
      .split('\n\n')
      .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
      .join('')}</body></html>`
    return { channel: 'email', to: request.customer.email, subject: SUBJECT[l], body, html }
  }
  if (request.customer?.phone) {
    const sms = freeTextSms(`Coco Vanille : ${String(text || '').trim()}`)
    return { channel: 'sms', to: request.customer.phone, body: sms.body, segments: sms.segments }
  }
  return null
}
