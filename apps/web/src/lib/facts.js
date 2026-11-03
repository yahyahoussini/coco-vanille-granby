// A fact is a real value or a marker. The marker text matches rank-first's audit rule ("[[FACT NEEDED: …]]").
// A reader never sees a marker since the launch of 2026-11-03: the public components show ASK_THE_SHOP in its place and
// keep the marker in the element's data-marker attribute, so the gate still counts it and the page stays out of the index.
import { frTypo } from './typo.js'

export const MARKER_RE = /\[\[FACT NEEDED[^\]]*\]\]/

export const marker = (label) => `[[FACT NEEDED: ${label}]]`

// What a marker's label says (Studio's screens only).
export const factLabel = (text) => String(text).replace(/\[\[FACT NEEDED:? ?([^\]]*)\]\]/g, '$1')

// What a reader sees where a fact is missing: never a label, never « À confirmer ».
export const ASK_THE_SHOP = { fr: 'demandez à la boutique', en: 'ask the shop', es: 'pregunte en la tienda' }

export const isMissing = (value) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'string' && MARKER_RE.test(value))

// How Studio names a fact nobody has given: words the team can read, never the marker.
export const toGive = (label) => `à donner (${label})`

// Returns the value, or the marker when the value is missing.
export const factOr = (value, label) => (isMissing(value) ? marker(label) : value)

// "show": every registry page renders. "strict": a page with a marker answers 404. A conditional page with a marker
// answers 404 either way (lib/publish.js).
export const publishGuard = () => (process.env.PUBLISH_GUARD === 'strict' ? 'strict' : 'show')

export const containsMarker = (data) => MARKER_RE.test(typeof data === 'string' ? data : JSON.stringify(data ?? ''))

// ---------- Answers given in Studio › « Faits du site » (collection site-facts, lib/facts-catalog.js) ----------
const SLOT_RE = /\[\[FACT NEEDED: ([^\]]+)\]\](\.?)/g

// records: [{ key, fr, en }] → Map(fact key → answer) for one language (blank answers left out).
export function answerMap(records = [], locale = 'fr') {
  const map = new Map()
  for (const r of records) {
    const text = typeof r?.[locale] === 'string' ? r[locale].replace(/\s+/g, ' ').trim() : ''
    if (r?.key && text) map.set(r.key, locale === 'fr' ? frTypo(text) : text)
  }
  return map
}

// Fills every slot that has an answer, in strings, arrays and objects (a page's copy). idFor(label) → fact key
// (lib/facts-catalog.js factIdFor for the language). A slot without an answer stays a marker. An answer ending in a
// period before the copy's own period keeps one period.
export function resolveFacts(value, answers, idFor) {
  if (!answers?.size) return value
  if (typeof value === 'string') {
    if (!value.includes('[[FACT NEEDED')) return value
    return value.replace(SLOT_RE, (whole, label, dot) => {
      const answer = answers.get(idFor(label))
      if (!answer) return whole
      return dot && /[.!?…]$/.test(answer) ? answer : `${answer}${dot}`
    })
  }
  if (Array.isArray(value)) return value.map((v) => resolveFacts(v, answers, idFor))
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveFacts(v, answers, idFor)]))
  }
  return value
}
