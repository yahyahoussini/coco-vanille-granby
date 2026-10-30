import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { pages } from '../../src/seed/content.js'
import { FACTS, FACT_GROUPS, factIdFor, factById } from '../../src/lib/facts-catalog.js'
import { answerMap, resolveFacts, containsMarker } from '../../src/lib/facts.js'

const SLOT = /\[\[FACT NEEDED: ([^\]]+)\]\]/g
const norm = (s) => s.replace(/ /g, ' ')
const slotsIn = (locale) => {
  const found = new Set()
  for (const p of pages) if (p.locales[locale]) for (const m of JSON.stringify(p.locales[locale]).matchAll(SLOT)) found.add(norm(m[1]))
  return found
}

describe('« Faits du site »: the catalog matches the copy', () => {
  test('every slot of the copy belongs to one fact of the catalog (French and English)', () => {
    for (const locale of ['fr', 'en']) {
      const unknown = [...slotsIn(locale)].filter((label) => factIdFor(locale, label).startsWith('autre:'))
      assert.deepEqual(unknown, [], `${locale}: slots no fact answers`)
    }
  })

  test('every label of the catalog is still asked by the copy', () => {
    const asked = { fr: slotsIn('fr'), en: slotsIn('en') }
    const stale = FACTS.flatMap((f) => ['fr', 'en'].flatMap((l) => (f[l] || []).filter((label) => !asked[l].has(label)).map((label) => `${f.id} (${l}): ${label}`)))
    assert.deepEqual(stale, [])
  })

  test('ids are unique, each fact has a known group and a question, no label belongs to two facts', () => {
    const ids = FACTS.map((f) => f.id)
    assert.equal(new Set(ids).size, ids.length)
    const groups = new Set(FACT_GROUPS.map((g) => g.id))
    for (const f of FACTS) {
      assert.ok(groups.has(f.group), `${f.id}: group`)
      assert.match(f.q, /\S/, `${f.id}: question`)
    }
    for (const l of ['fr', 'en']) {
      const labels = FACTS.flatMap((f) => f[l] || [])
      assert.equal(new Set(labels).size, labels.length, `${l}: a label in two facts`)
    }
    assert.equal(factById('delai-gateau').group, 'delais')
  })
})

describe('an answer fills its slots', () => {
  const idFor = (label) => factIdFor('fr', label)
  const copy = {
    answer: 'Le délai dépend du type de gâteau : [[FACT NEEDED: délai minimum par type de gâteau, en jours]].',
    faq: [{ question: 'Livrez-vous?', answer: 'Repère : [[FACT NEEDED: repère visuel près de la boutique, approuvé par le propriétaire]].' }],
  }

  test('every slot of the fact, in strings, arrays and objects; the others stay markers', () => {
    const answers = answerMap([{ key: 'delai-gateau', fr: '2 jours pour un gâteau de la carte, 7 jours pour un gâteau personnalisé.' }], 'fr')
    const out = resolveFacts(copy, answers, idFor)
    assert.equal(out.answer, 'Le délai dépend du type de gâteau : 2 jours pour un gâteau de la carte, 7 jours pour un gâteau personnalisé.')
    assert.ok(containsMarker(out.faq), 'an unanswered slot stays a marker')
    assert.ok(containsMarker(copy.answer), 'the stored copy is never changed')
  })

  test('French answers get the copy’s typography; English answers stay as typed; blanks are ignored', () => {
    const fr = answerMap([{ key: 'repere', fr: 'à côté du Palace : la porte rouge', en: 'next to the Palace: the red door' }, { key: 'x', fr: '  ' }], 'fr')
    assert.equal(fr.get('repere'), 'à côté du Palace : la porte rouge')
    assert.equal(fr.has('x'), false)
    assert.equal(answerMap([{ key: 'repere', en: 'next to the Palace: the red door' }], 'en').get('repere'), 'next to the Palace: the red door')
  })

  test('no answers: the copy comes back untouched', () => {
    assert.equal(resolveFacts(copy, new Map(), idFor), copy)
  })
})
