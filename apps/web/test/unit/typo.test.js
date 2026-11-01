// lib/typo: Québec French typography. frTypo (moved unchanged from seed/content.js) and frPunct, the spaces before
// the high punctuation the Journal's French copy gets (frenchCopy).
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { frTypo, frPunct, frenchCopy } from '../../src/lib/typo.js'

const NBSP = ' '
const NNBSP = ' '

describe('frPunct', () => {
  test('a narrow no-break space before ? ! ;, with or without a plain space', () => {
    assert.equal(frPunct('Quand?'), `Quand${NNBSP}?`)
    assert.equal(frPunct('Quand ?'), `Quand${NNBSP}?`)
    assert.equal(frPunct('Oui! Enfin; voilà.'), `Oui${NNBSP}! Enfin${NNBSP}; voilà.`)
    assert.equal(frPunct('« Écrivez-nous »?'), `« Écrivez-nous »${NNBSP}?`)
    assert.equal(frPunct('(450-372-7177)?'), `(450-372-7177)${NNBSP}?`)
  })

  test('a no-break space before the colon', () => {
    assert.equal(frPunct('Heures: 9 h'), `Heures${NBSP}: 9 h`)
    assert.equal(frPunct('Heures : 9 h'), `Heures${NBSP}: 9 h`)
  })

  test('markers, web addresses, clock times and ratios are left as written', () => {
    const marker = '[[FACT NEEDED: âges et heures de début des ateliers]]'
    assert.equal(frPunct(`Âges : ${marker}.`), `Âges${NBSP}: ${marker}.`)
    assert.equal(frPunct('Voir https://www.granby.ca/fr?x=1: la page'), `Voir https://www.granby.ca/fr?x=1: la page`)
    assert.equal(frPunct('Ouvert à 8:30, un ratio 1:2'), 'Ouvert à 8:30, un ratio 1:2')
    assert.equal(frPunct(`Déjà là${NNBSP}?`), `Déjà là${NNBSP}?`, 'already spaced')
  })

  test('idempotent: twice is once', () => {
    for (const text of ['Quand? Heures: 8:30! « Écrivez-nous »?', 'Prix : 37 $ ; places limitées !', 'A?! B']) assert.equal(frPunct(frPunct(text)), frPunct(text))
  })
})

describe('frTypo (unchanged)', () => {
  test('the seed copy’s rules', () => {
    assert.equal(frTypo('Heures :'), `Heures${NBSP}:`)
    assert.equal(frTypo('« Écrivez-nous »'), `«${NBSP}Écrivez-nous${NBSP}»`)
    // Snapshot of the rule as it was in seed/content.js: the unit rule runs first, so « h 30 » keeps its space.
    assert.equal(frTypo('de 8 h 30 à 17 h'), `de 8${NBSP}h 30 à 17${NBSP}h`)
    assert.equal(frTypo('37 $ et 30 %'), `37${NBSP}$ et 30${NBSP}%`)
    assert.equal(frTypo('le 1er novembre et le 22 octobre'), `le 1er${NBSP}novembre et le 22${NBSP}octobre`)
    assert.equal(frTypo('au 3, rue Court, J2G 4Y6'), `au 3,${NBSP}rue Court, J2G${NBSP}4Y6`)
    assert.deepEqual(frTypo({ a: ['x :'], b: 2 }), { a: [`x${NBSP}:`], b: 2 })
  })
})

describe('frenchCopy', () => {
  test('frPunct then frTypo over a whole post copy; keys and markers unchanged', () => {
    const copy = { title: 'Chocolatine ou pain au chocolat? Ce que dit l’OQLF', faq: [{ question: 'Quand?', answer: 'Le 2 novembre: à 6 h. [[FACT NEEDED: heures des Fêtes 2026]]' }] }
    const out = frenchCopy(copy)
    assert.deepEqual(Object.keys(out), ['title', 'faq'])
    assert.equal(out.title, `Chocolatine ou pain au chocolat${NNBSP}? Ce que dit l’OQLF`)
    assert.equal(out.faq[0].question, `Quand${NNBSP}?`)
    assert.equal(out.faq[0].answer, `Le 2${NBSP}novembre${NBSP}: à 6${NBSP}h. [[FACT NEEDED: heures des Fêtes 2026]]`)
    assert.deepEqual(frenchCopy(out), out)
  })
})
