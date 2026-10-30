// Zero-invention rule: a fact is either a real value or a visible marker.
// The marker text matches rank-first's audit rule ("[[FACT NEEDED: …]]").
export const MARKER_RE = /\[\[FACT NEEDED[^\]]*\]\]/

export const marker = (label) => `[[FACT NEEDED: ${label}]]`

export const isMissing = (value) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'string' && MARKER_RE.test(value))

// Returns the value, or the marker when the value is missing.
export const factOr = (value, label) => (isMissing(value) ? marker(label) : value)

// "show" renders markers (staging). "strict" hides any page that still has one (production).
export const publishGuard = () => (process.env.PUBLISH_GUARD === 'strict' ? 'strict' : 'show')

export const containsMarker = (data) => MARKER_RE.test(typeof data === 'string' ? data : JSON.stringify(data ?? ''))

// ---------- Answers given in Studio › « Faits du site » (collection site-facts, lib/facts-catalog.js) ----------
const SLOT_RE = /\[\[FACT NEEDED: ([^\]]+)\]\](\.?)/g
const NBSP = ' '
// The French answer gets the copy's typography (seed/content.js frTypo): no line break before « : » or in « ».
const frenchTypo = (text) => text.replace(/ :/g, `${NBSP}:`).replace(/« /g, `«${NBSP}`).replace(/ »/g, `${NBSP}»`)

// records: [{ key, fr, en }] → Map(fact key → answer) for one language (blank answers left out).
export function answerMap(records = [], locale = 'fr') {
  const map = new Map()
  for (const r of records) {
    const text = typeof r?.[locale] === 'string' ? r[locale].replace(/\s+/g, ' ').trim() : ''
    if (r?.key && text) map.set(r.key, locale === 'fr' ? frenchTypo(text) : text)
  }
  return map
}

// Fills every slot that has an answer, in strings, arrays and objects (a page's copy). idFor(label) → fact key
// (lib/facts-catalog.js factIdFor for the language). A slot without an answer stays a marker, so the publish
// guard keeps the page hidden until it is answered. An answer ending in a period before the copy's own period
// keeps one period.
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
