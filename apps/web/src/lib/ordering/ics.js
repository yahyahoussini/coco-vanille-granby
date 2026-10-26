// Calendar file for a pickup (10 §4): UTC times (no VTIMEZONE block), reminder 1 h before, CRLF, folded lines.
import { zonedTime, dayOf } from '../studio/time.js'

const escape = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')
const stamp = (date) => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

// Lines longer than 75 octets continue on the next line after a space (RFC 5545 §3.1).
function fold(line) {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line
  const parts = []
  let current = ''
  for (const ch of line) {
    if (Buffer.byteLength(current + ch, 'utf8') > (parts.length ? 74 : 75)) {
      parts.push(current)
      current = ch
    } else current += ch
  }
  parts.push(current)
  return parts.join('\r\n ')
}

const COPY = {
  fr: { summary: (n) => `Cueillette Coco Vanille – commande ${n}`, code: (c) => `Code de cueillette : ${c}`, alarm: 'Cueillette Coco Vanille' },
  en: { summary: (n) => `Coco Vanille pickup – order ${n}`, code: (c) => `Pickup code: ${c}`, alarm: 'Coco Vanille pickup' },
  es: { summary: (n) => `Recogida Coco Vanille – pedido ${n}`, code: (c) => `Código de recogida: ${c}`, alarm: 'Recogida Coco Vanille' },
}

// order: { number, pickupDate, pickupWindowStart, pickupWindowEnd, pickupCode, locale } · location: one-line address
export function pickupIcs(order, { location = '', url = '', now = new Date(), extra = '' } = {}) {
  const c = COPY[order.locale] || COPY.fr
  const day = dayOf(order.pickupDate)
  if (!day || !order.pickupWindowStart) return null
  const start = zonedTime(day, order.pickupWindowStart)
  const end = order.pickupWindowEnd ? zonedTime(day, order.pickupWindowEnd) : new Date(start.getTime() + 15 * 60 * 1000)
  const description = [c.code(order.pickupCode), extra].filter(Boolean).join('\n')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Patisserie Coco Vanille//Commandes//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${order.number}@cocovanillegranby.com`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(c.summary(order.number))}`,
    location && `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    url && `URL:${url}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escape(c.alarm)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return lines.map(fold).join('\r\n') + '\r\n'
}
