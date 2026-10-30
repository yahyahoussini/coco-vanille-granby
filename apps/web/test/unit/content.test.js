// Page-contract checks on the seeded copy (src/seed/content.js), before it reaches the database:
// v1 §7, rank-first 02-page-contract, 00 §10.1. Every page, every locale.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { pages, HOURS, HOURS_FR, HOURS_EN } from '../../src/seed/content.js'
import { pageByKey } from '../../src/lib/routes.js'
import { MARKER_RE } from '../../src/lib/facts.js'
import { hoursSummary, WEEK } from '../../src/components/site/hours.js'

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
        // Written by the Agency, approved by the owner (decision of 2026-10-30): no « lawyer » marker blocks the page.
        assert.doesNotMatch(JSON.stringify(copy), /révision par un avocat/, 'legal page publishes without a lawyer marker')
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

  test('no copy prints a code value or a doubled period', () => {
    for (const e of entries) {
      const text = JSON.stringify(e.copy)
      assert.doesNotMatch(text, /\bundefined\b|\bnull\b|NaN|\[object Object\]/, `${label(e)}: code value in the copy`)
      assert.doesNotMatch(text, /[^.]\.\.(?!\.)/, `${label(e)}: doubled period (e.g. « p.m.. »)`)
    }
  })
})

// Owner-published facts relayed by Yahya on 2026-10-27 (research/01 « Update 2026-10-27 »).
const copyOf = (key, locale) => pages.find((p) => p.key === key).locales[locale]
const plain = (value) => (typeof value === 'string' ? value : JSON.stringify(value)).replace(/ /g, ' ')

describe('hours: one record for the seed, the copy and the hours table', () => {
  test('the record is a valid week: known days, HH:MM, opens before closes, one row per day', () => {
    const days = HOURS.map((h) => h.day)
    assert.equal(new Set(days).size, days.length, 'a day appears twice')
    for (const h of HOURS) {
      assert.ok(WEEK.includes(h.day), h.day)
      assert.match(h.opens, /^([01]\d|2[0-3]):[0-5]\d$/)
      assert.match(h.closes, /^([01]\d|2[0-3]):[0-5]\d$/)
      assert.ok(h.opens < h.closes, `${h.day}: opens after it closes`)
    }
  })

  test('it is the Google listing schedule supplied on 2026-10-27: Wed–Sat 8:30–17:30, Sun 9:30–17:00, closed Mon–Tue', () => {
    assert.deepEqual(HOURS, [
      { day: 'Wednesday', opens: '08:30', closes: '17:30' },
      { day: 'Thursday', opens: '08:30', closes: '17:30' },
      { day: 'Friday', opens: '08:30', closes: '17:30' },
      { day: 'Saturday', opens: '08:30', closes: '17:30' },
      { day: 'Sunday', opens: '09:30', closes: '17:00' },
    ])
  })

  test('the sentences are hoursSummary() of that record, plus the closed days', () => {
    assert.equal(HOURS_FR, `${hoursSummary(HOURS, 'fr')}; fermé le lundi et le mardi`)
    assert.equal(HOURS_EN, `${hoursSummary(HOURS, 'en')}; closed Monday and Tuesday`)
    assert.equal(HOURS_FR, 'du mercredi au samedi de 8 h 30 à 17 h 30, et le dimanche de 9 h 30 à 17 h; fermé le lundi et le mardi')
  })

  test('the answer blocks that give hours carry the real schedule, never the old marker', () => {
    for (const key of ['home', 'nous-trouver']) {
      // plain(): the French copy keeps « 8 h 30 » together with non-breaking spaces (frTypo).
      assert.ok(plain(copyOf(key, 'fr').answer).includes(HOURS_FR), `${key} (fr)`)
      assert.ok(copyOf(key, 'en').answer.includes(HOURS_EN), `${key} (en)`)
    }
    for (const e of entries) assert.doesNotMatch(plain(e.copy), /heures d’ouverture confirmées|opening hours confirmed/, label(e))
  })

  test('holiday hours are still unknown, so they stay a marker', () => {
    assert.match(plain(copyOf('nous-trouver', 'fr')), /\[\[FACT NEEDED: heures des Fêtes 2026\]\]/)
    assert.match(plain(copyOf('nous-trouver', 'en')), /\[\[FACT NEEDED: 2026 holiday hours\]\]/)
  })
})

describe('café, ateliers and the « Écrivez-nous » chat', () => {
  test('the coffee FAQ answers yes from the Facebook bio and keeps menu and seating as a marker', () => {
    const fr = copyOf('carte', 'fr').faq.find((f) => f.question === 'Servez-vous du café sur place?')
    assert.match(plain(fr.answer), /^Oui : .*« Pâtisserie & Café ».*\[\[FACT NEEDED: [^\]]*places assises\]\]/)
    const en = copyOf('carte', 'en').faq.find((f) => f.question === 'Do you serve coffee in the shop?')
    assert.match(en.answer, /^Yes: .*« Pâtisserie & Café ».*\[\[FACT NEEDED: [^\]]*seats\]\]/)
  })

  test('workshops: by reservation, booked at the number the shop publishes, its published details, the rest a marker (FR and EN)', () => {
    // The shop's own reel of 2026-10-22 (research/20b §0.4): booked at the cell number, 2 h 30, 37 $ per person.
    const fr = copyOf('faq', 'fr').sections.find((s) => s.heading === 'Offrez-vous des ateliers?')
    assert.ok(fr, 'FAQ page has the workshops question')
    assert.match(fr.answer, /ateliers créatifs sur réservation/)
    assert.match(fr.answer, /438-528-7818/)
    assert.match(plain(fr.answer), /2 h 30 et coûte 37 \$ par personne/)
    assert.match(fr.answer, /\[\[FACT NEEDED: âges et heures de début des ateliers\]\]/)
    const en = copyOf('faq', 'en').sections.find((s) => s.heading === 'Do you offer workshops?')
    assert.ok(en, 'English FAQ page has the workshops question')
    assert.match(en.answer, /creative workshops by reservation.*\$37 per person.*438-528-7818.*\[\[FACT NEEDED: [^\]]+\]\]/)
  })

  test('the privacy policy covers the chat: what, why, where, 90 days, replies only on request', () => {
    for (const [locale, name, kept, asked] of [
      ['fr', '« Écrivez-nous »', /supprimés 90 jours après le dernier message/, /seulement si vous la demandez/],
      ['en', '“Message us”', /deleted 90 days after the last message/, /only sent if you ask for one/],
    ]) {
      const text = plain(copyOf('confidentialite', locale))
      assert.ok(text.includes(name), `${locale}: names the chat`)
      assert.match(text, kept, `${locale}: retention`)
      assert.match(text, asked, `${locale}: reply only on request`)
      assert.match(text, /clavardage externe|outside chat service/, `${locale}: no outside chat service`)
      assert.match(text, /OVHcloud/, `${locale}: names its host`)
    }
  })
})
