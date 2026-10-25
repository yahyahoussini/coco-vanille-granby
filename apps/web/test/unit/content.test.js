// Page-contract checks on the seeded copy (src/seed/content.js), before it reaches the database:
// v1 §7, rank-first 02-page-contract, 00 §10.1. Every page, every locale.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { pages } from '../../src/seed/content.js'
import { pageByKey } from '../../src/lib/routes.js'
import { MARKER_RE } from '../../src/lib/facts.js'

const MARKERS = new RegExp(MARKER_RE.source, 'g')

// A marker stands for the fact it will become: it counts as one word.
export const countWords = (text = '') =>
  text
    .replace(MARKERS, 'X')
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length

const firstSentence = (text = '') => text.replace(MARKERS, 'X').split(/(?<=[.!?])\s/)[0]

// Verified in data/facts.json (address, phone, downtown, registry); one must sit in every answer block.
const VERIFIED = ['3, rue Court', '3 rue Court', '450-372-7177', 'centre-ville', 'downtown', '1177082220', '9 novembre 2021', 'November 9, 2021']

const LEGAL = ['confidentialite', 'conditions-de-vente', 'temoins', 'accessibilite']

const entries = pages.flatMap((page) => Object.entries(page.locales).map(([locale, copy]) => ({ page, locale, copy })))
const label = ({ page, locale }) => `${page.key} (${locale})`

describe('content registry', () => {
  test('every page key exists in the registry, once, with the same status', () => {
    const keys = pages.map((p) => p.key)
    assert.equal(new Set(keys).size, keys.length, 'duplicate page key')
    for (const p of pages) {
      const reg = pageByKey(p.key)
      assert.ok(reg, `${p.key} is not in src/lib/routes.js`)
      assert.equal(p.status, reg.status, `${p.key}: status`)
    }
  })

  test('copy exists only for locales that have a URL, and French always comes first', () => {
    for (const p of pages) {
      const reg = pageByKey(p.key)
      assert.ok(p.locales.fr, `${p.key}: French copy is the source`)
      assert.equal(Object.keys(p.locales)[0], 'fr', `${p.key}: fr first`)
      for (const locale of Object.keys(p.locales)) assert.ok(reg.paths[locale], `${p.key}: ${locale} copy without a ${locale} URL`)
    }
  })

  test('core pages with an English URL have English copy', () => {
    for (const p of pages) {
      const reg = pageByKey(p.key)
      if (reg.status === 'core' && reg.paths.en) assert.ok(p.locales.en, `${p.key}: missing en`)
    }
  })

  test('the core pages are all seeded', () => {
    const want = ['home', 'carte', 'commander', 'nous-trouver', 'a-propos', 'allergenes', 'faq', 'viennoiseries', 'pains', 'gateaux', 'patisseries']
    const have = new Set(pages.map((p) => p.key))
    for (const key of want) assert.ok(have.has(key), `${key} not seeded`)
  })
})

describe('page contract, per page and locale', () => {
  for (const entry of entries) {
    const { copy, page, locale } = entry
    test(label(entry), () => {
      assert.ok(copy.title, 'title')
      assert.ok(copy.title.length <= 60, `title ${copy.title.length} > 60: ${copy.title}`)
      assert.ok(copy.description, 'description')
      const d = copy.description.length
      assert.ok(d >= 140 && d <= 160, `description ${d} not in 140–160: ${copy.description}`)
      assert.ok(copy.h1, 'h1')
      for (const field of ['title', 'description', 'h1']) assert.doesNotMatch(copy[field], MARKER_RE, `${field} carries a marker`)

      const n = countWords(copy.answer)
      assert.ok(n >= 40 && n <= 60, `answer has ${n} words (40–60)`)
      assert.match(copy.answer, /Coco Vanille/, 'answer names the brand')
      assert.match(copy.answer, /Granby/, 'answer names the place')
      const plain = copy.answer.replace(/ /g, ' ')
      assert.ok(VERIFIED.some((f) => plain.includes(f)), 'answer carries a verified fact')

      const sections = copy.sections || []
      assert.ok(sections.length >= 3 && sections.length <= 6, `${sections.length} sections (3–6)`)
      for (const s of sections) {
        assert.match(s.heading.trim(), /\?$/, `section heading is a question: ${s.heading}`)
        assert.ok(s.answer?.trim(), `section "${s.heading}" has an answer`)
        assert.ok(countWords(firstSentence(s.answer)) <= 45, `first sentence of "${s.heading}" is short enough to be lifted`)
      }

      const faq = copy.faq || []
      assert.ok(faq.length >= 5 && faq.length <= 8, `${faq.length} FAQ (5–8)`)
      for (const f of faq) {
        assert.match(f.question.trim(), /\?$/, `FAQ question: ${f.question}`)
        assert.ok(f.answer?.trim(), `FAQ "${f.question}" has an answer`)
      }
      const questions = [...sections.map((s) => s.heading), ...faq.map((f) => f.question)]
      assert.equal(new Set(questions).size, questions.length, 'a question appears twice on the page')

      assert.ok(copy.changeNote?.trim(), 'changeNote')
      if (LEGAL.includes(page.key)) {
        assert.match(JSON.stringify(copy), /révision par un avocat/, 'legal page carries the lawyer-review marker')
        if (locale !== 'fr') assert.match(JSON.stringify(copy), /French version prevails|versión francesa prevalece/, 'translation says the French version prevails')
      }
    })
  }
})

describe('across pages', () => {
  test('titles and descriptions are unique', () => {
    const titles = entries.map((e) => e.copy.title)
    const descriptions = entries.map((e) => e.copy.description)
    assert.equal(new Set(titles).size, titles.length, 'duplicate title')
    assert.equal(new Set(descriptions).size, descriptions.length, 'duplicate description')
  })

  test('no unsupported claims or banned words (00 §3.2, §10.1; 04 §3)', () => {
    const banned = [
      [/mariage|wedding|boda/i, 'weddings are frozen'],
      [/\bmeilleur|\bbest\b|\bmejor\b/i, 'no superlatives as facts'],
      [/prix sur demande|price on request/i, 'prices are never "on request"'],
      [/ramassage/i, '« cueillette », not « ramassage »'],
      [/\bWhatsApp\b/i, 'no WhatsApp (M11)'],
    ]
    for (const e of entries) {
      const text = JSON.stringify(e.copy)
      for (const [re, why] of banned) assert.doesNotMatch(text, re, `${label(e)}: ${why}`)
    }
  })

  test('French copy uses non-breaking spaces before « : » and inside guillemets', () => {
    for (const e of entries.filter((x) => x.locale === 'fr')) {
      const text = JSON.stringify(e.copy)
      assert.doesNotMatch(text, / [:»]|« /, `${label(e)}: plain space next to « : » or guillemets`)
    }
  })

  test('the Granby phrasing question appears on the cake and order pages', () => {
    for (const key of ['commander', 'gateaux']) {
      const fr = pages.find((p) => p.key === key).locales.fr
      assert.ok(fr.faq.some((f) => /C’est-tu possible/.test(f.question)), key)
    }
  })

  test('the word counter counts a marker as one word', () => {
    assert.equal(countWords('Heures : [[FACT NEEDED: heures confirmées par le propriétaire]].'), 2)
    assert.equal(countWords('La Pâtisserie Coco Vanille, au 3, rue Court.'), 8)
  })
})
