// Custom-cake request form (10 §5.2, 16 §3.4): occasion, guests, date, flavour, cake message, details,
// up to 3 inspiration photos, an allergy checkbox (always handled by phone, 07 S10), the customer.
// Stored with answerBy = now + 24 h; the "request received" message is queued by the caller.
import { localParts, addDays } from '../studio/time.js'
import { cleanCustomer } from './customer.js'
import { newToken, storedDay } from './context.js'

export const REQUEST_LIMITS = { occasion: 80, flavour: 120, cakeMessage: 60, details: 1500, guestsMax: 500, photos: 3, photoBytes: 10 * 1024 * 1024, daysAhead: 365 }
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ANSWER_HOURS = 24

const text = (v, max) => String(v ?? '').replace(/\r\n/g, '\n').trim().slice(0, max)

// Raw form values → clean values + error codes (field-level). Pure, so the form and the tests share it.
export function cleanRequest(input = {}, { now = new Date(), locale = 'fr' } = {}) {
  const errors = []
  const today = localParts(now).iso
  const occasion = text(input.occasion, REQUEST_LIMITS.occasion)
  const guestsRaw = String(input.guests ?? '').trim()
  const guests = /^\d{1,4}$/.test(guestsRaw) ? Number(guestsRaw) : null
  const eventDate = String(input.eventDate || '').trim()
  if (!occasion) errors.push({ code: 'occasion_required', field: 'occasion' })
  if (guests === null || guests < 1 || guests > REQUEST_LIMITS.guestsMax) errors.push({ code: 'guests_invalid', field: 'guests' })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) errors.push({ code: 'date_required', field: 'eventDate' })
  else if (eventDate <= today) errors.push({ code: 'date_too_soon', field: 'eventDate' })
  else if (eventDate > addDays(today, REQUEST_LIMITS.daysAhead)) errors.push({ code: 'date_too_far', field: 'eventDate' })
  const { customer, errors: ce } = cleanCustomer(input, { requirePhone: true, locale })
  errors.push(...ce)
  const values = {
    occasion,
    guests,
    eventDate,
    flavour: text(input.flavour, REQUEST_LIMITS.flavour),
    cakeMessage: text(input.cakeMessage, REQUEST_LIMITS.cakeMessage).replace(/\s+/g, ' '),
    details: text(input.details, REQUEST_LIMITS.details),
    hasAllergy: input.hasAllergy === true || input.hasAllergy === 'on' || input.hasAllergy === '1',
    customer,
  }
  return { values, errors }
}

export function checkPhotos(files = []) {
  const list = files.filter((f) => f && typeof f === 'object' && f.size > 0)
  const errors = []
  if (list.length > REQUEST_LIMITS.photos) errors.push({ code: 'photos_too_many', field: 'photos' })
  for (const f of list) {
    if (!PHOTO_TYPES.includes(f.type)) errors.push({ code: 'photo_type', field: 'photos' })
    else if (f.size > REQUEST_LIMITS.photoBytes) errors.push({ code: 'photo_too_big', field: 'photos' })
  }
  return { photos: list.slice(0, REQUEST_LIMITS.photos), errors: errors.slice(0, 1) }
}

// Creates the request (and its private photos). → { request, errors }
export async function submitRequest(payload, { input = {}, files = [], locale = 'fr', attribution = null, now = new Date() } = {}) {
  const { values, errors } = cleanRequest(input, { now, locale })
  const { photos, errors: photoErrors } = checkPhotos(files)
  errors.push(...photoErrors)
  if (errors.length) return { request: null, errors, values }

  const photoIds = []
  for (const [i, f] of photos.entries()) {
    try {
      const data = Buffer.from(await f.arrayBuffer())
      const ext = f.type === 'image/png' ? 'png' : f.type === 'image/webp' ? 'webp' : 'jpg'
      const doc = await payload.create({
        collection: 'request-photos',
        data: { alt: `Photo d’inspiration ${i + 1} · ${values.occasion}` },
        file: { data, mimetype: f.type, name: `demande-${Date.now()}-${i + 1}.${ext}`, size: data.length },
        overrideAccess: true,
        depth: 0,
      })
      photoIds.push(doc.id)
    } catch {
      return { request: null, errors: [{ code: 'photo_unreadable', field: 'photos' }], values }
    }
  }

  const request = await payload.create({
    collection: 'requests',
    data: {
      status: 'new',
      source: 'web',
      occasion: values.occasion,
      guests: values.guests,
      eventDate: storedDay(values.eventDate),
      flavour: values.flavour || null,
      cakeMessage: values.cakeMessage || null,
      details: values.details || null,
      photos: photoIds,
      hasAllergy: values.hasAllergy,
      customer: values.customer,
      answerBy: new Date(new Date(now).getTime() + ANSWER_HOURS * 3600 * 1000).toISOString(),
      accessToken: newToken(9),
      attribution,
      timeline: [{ at: new Date(now).toISOString(), status: 'new', by: null, source: 'web', note: values.hasAllergy ? 'Allergie signalée : appeler le client' : null }],
    },
    overrideAccess: true,
    depth: 0,
  })
  return { request, errors: [], values }
}
