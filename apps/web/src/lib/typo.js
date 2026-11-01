// Québec French typography for copy written by hand (OQLF): the seed's page copy (frTypo, unchanged since
// seed/content.js) and, for the Journal, the spaces before the high punctuation (frPunct). English copy is stored
// as typed. Pure module (no imports) so node --test, the seeds and the Studio actions can load it.
const NBSP = ' '
// Espace fine insécable: before ; ! ? in careful typography (OQLF, « Espacement avant et après les signes »).
const NNBSP = ' '

// Non-breaking space before « : », inside guillemets, between a number and its unit (h, $, %), in a clock time,
// a date, a street address and the shop's postal code.
export const frTypo = (value) => {
  if (typeof value === 'string')
    return value
      .replace(/ :/g, `${NBSP}:`)
      .replace(/« /g, `«${NBSP}`)
      .replace(/ »/g, `${NBSP}»`)
      .replace(/(\d) (h|\$|%)(?![\p{L}\d])/gu, `$1${NBSP}$2`)
      .replace(/(\d h) (\d\d)/g, `$1${NBSP}$2`)
      .replace(/(\d(?:er)?) (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/g, `$1${NBSP}$2`)
      .replace(/(\d), (rue|boulevard|avenue) /g, `$1,${NBSP}$2 `)
      .replace(/J2G 4Y6/g, `J2G${NBSP}4Y6`)
  if (Array.isArray(value)) return value.map(frTypo)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, frTypo(v)]))
  return value
}

// Left exactly as written: a [[FACT NEEDED: …]] marker (the slot patterns of lib/facts.js and Contract.js need the
// text « FACT NEEDED: » byte for byte) and a web address.
const PROTECTED = /(\[\[FACT NEEDED[^\]]*\]\]|https?:\/\/\S+)/
// The sign after a letter, a digit, « » » or « ) », with one plain space or none. A sign already preceded by a
// no-break space (or any other character) is left alone, so the function can run twice.
const HIGH = /([\p{L}\p{N}»)]) ?([;!?])/gu
const COLON = /([\p{L}\p{N}»)])( ?):/gu

function punct(text) {
  return text
    .replace(HIGH, `$1${NNBSP}$2`)
    .replace(COLON, (whole, before, space, offset, all) => {
      // A clock time or a ratio (« 8:30 », « 1:2 ») keeps its colon tight.
      if (!space && /\d/.test(before) && /\d/.test(all[offset + whole.length] || '')) return whole
      return `${before}${NBSP}:`
    })
}

// « Quand? » → « Quand ? » (U+202F) · « Heures: » or « Heures : » → « Heures : » (U+00A0).
export const frPunct = (text) => {
  if (typeof text !== 'string' || !text) return text
  return text
    .split(PROTECTED)
    .map((part, i) => (i % 2 ? part : punct(part)))
    .join('')
}

// The French copy of a Journal post, as stored (seed, Studio « Enregistrer »): frPunct then frTypo, over strings,
// arrays and objects. Keys are never changed.
export function frenchCopy(value) {
  if (typeof value === 'string') return frTypo(frPunct(value))
  if (Array.isArray(value)) return value.map(frenchCopy)
  if (value && typeof value === 'object' && !(value instanceof Date)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, frenchCopy(v)]))
  return value
}
