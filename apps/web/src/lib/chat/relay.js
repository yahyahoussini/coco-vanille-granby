// A shop reply also sent by texto or courriel, only when the visitor asked for it (« M'envoyer aussi la réponse
// par texto ou courriel ») and left a phone or an email. Transactional (an answer to the visitor's own question,
// template 'chat_reply'), queued through lib/messaging/queue.js like every customer message. Pure, node --test.
import { freeTextSms } from '../studio/texts.js'
import { contactKind } from './validate.js'

export const RELAY_TEMPLATE = 'chat_reply'

const lang = (l) => (['fr', 'en', 'es'].includes(l) ? l : 'fr')
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const W = {
  fr: {
    subject: 'Réponse à votre message · Pâtisserie Coco Vanille',
    hello: (n) => (n ? `Bonjour ${n},` : 'Bonjour,'),
    sign: (p) => `— L’équipe Coco Vanille${p ? ` · ${p}` : ''}`,
    why: 'Vous avez écrit à la Pâtisserie Coco Vanille sur son site et demandé la réponse par courriel. La conversation reste aussi sur le site, dans le même navigateur.',
    stop: (p) => `Pour ne plus recevoir nos courriels, répondez « désabonnement »${p ? ` ou appelez le ${p}` : ''}.`,
    sms: 'STOP pour ne plus recevoir de textos.',
  },
  en: {
    subject: 'Reply to your message · Pâtisserie Coco Vanille',
    hello: (n) => (n ? `Hello ${n},` : 'Hello,'),
    sign: (p) => `— The Coco Vanille team${p ? ` · ${p}` : ''}`,
    why: 'You wrote to Pâtisserie Coco Vanille on its website and asked for the reply by email. The conversation also stays on the site, in the same browser.',
    stop: (p) => `To stop receiving our emails, reply “unsubscribe”${p ? ` or call ${p}` : ''}.`,
    sms: 'Reply STOP to opt out.',
  },
  es: {
    subject: 'Respuesta a su mensaje · Pâtisserie Coco Vanille',
    hello: (n) => (n ? `Hola ${n}:` : 'Hola:'),
    sign: (p) => `— El equipo Coco Vanille${p ? ` · ${p}` : ''}`,
    why: 'Escribió a Pâtisserie Coco Vanille en su sitio web y pidió la respuesta por correo. La conversación también queda en el sitio, en el mismo navegador.',
    stop: (p) => `Para no recibir más correos, responda «baja»${p ? ` o llame al ${p}` : ''}.`,
    sms: 'Responda STOP para darse de baja.',
  },
}

// → { channel, to, subject?, body, html?, segments? } or null (no consent, or nothing to reach the visitor with).
export function relayMessage(conversation, text, { phone = null } = {}) {
  if (!conversation?.replyByConsent || !conversation.contact) return null
  const reply = String(text || '').trim()
  if (!reply) return null
  const w = W[lang(conversation.language)]
  if (contactKind(conversation.contact) === 'email') {
    const paragraphs = [w.hello(conversation.name), reply, w.sign(phone), w.why, w.stop(phone)]
    const body = `${paragraphs.join('\n\n')}\n`
    const l = lang(conversation.language)
    const html = `<!doctype html><html lang="${l === 'fr' ? 'fr-CA' : l === 'en' ? 'en-CA' : 'es'}"><body style="font-family:Arial,sans-serif;color:#3b241c;line-height:1.5">${paragraphs
      .map((p, i) => `<p${i >= 3 ? ' style="font-size:13px;color:#6a5444"' : ''}>${esc(p).replace(/\n/g, '<br>')}</p>`)
      .join('')}</body></html>`
    return { channel: 'email', to: conversation.contact, subject: w.subject, body, html }
  }
  const sms = freeTextSms(`Coco Vanille : ${reply} ${w.sms}`)
  return { channel: 'sms', to: conversation.contact, body: sms.body, segments: sms.segments }
}
