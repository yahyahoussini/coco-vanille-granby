// lib/facts: the zero-invention markers and the publish guard.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { MARKER_RE, marker, isMissing, factOr, publishGuard, containsMarker } from '../../src/lib/facts.js'

const AUDIT = fileURLToPath(new URL('../../../../tools/audit.mjs', import.meta.url))

describe('marker', () => {
  test('has the rank-first shape', () => {
    assert.equal(marker('heures confirmées'), '[[FACT NEEDED: heures confirmées]]')
    assert.match(marker('x'), MARKER_RE)
  })

  test('is caught by the rank-first audit placeholder rule', () => {
    const src = readFileSync(AUDIT, 'utf8')
    const m = src.match(/const PLACEHOLDER = \/(.+)\/([a-z]*);/)
    assert.ok(m, 'PLACEHOLDER regex not found in tools/audit.mjs')
    const auditRe = new RegExp(m[1], m[2])
    assert.match(marker('prix du croissant'), auditRe)
    assert.match(`<p>${marker('téléphone')}</p>`, auditRe)
  })

  test('MARKER_RE finds a marker inside text and ignores look-alikes', () => {
    assert.ok(MARKER_RE.test('Heures : [[FACT NEEDED: heures]].'))
    assert.ok(MARKER_RE.test('[[FACT NEEDED]]'))
    assert.ok(!MARKER_RE.test('[FACT NEEDED: x]'))
    assert.ok(!MARKER_RE.test('fact needed'))
  })
})

describe('isMissing', () => {
  test('empty values and markers are missing', () => {
    for (const v of [undefined, null, '', [], marker('x'), `avant ${marker('y')} après`]) {
      assert.equal(isMissing(v), true, JSON.stringify(v))
    }
  })

  test('real values are not missing, including 0 and false', () => {
    for (const v of ['3, rue Court', 0, false, ['fr'], { a: 1 }, 45.39]) {
      assert.equal(isMissing(v), false, JSON.stringify(v))
    }
  })
})

describe('factOr', () => {
  test('returns the value when present', () => {
    assert.equal(factOr('450-372-7177', 'téléphone'), '450-372-7177')
    assert.equal(factOr(0, 'prix'), 0)
  })

  test('returns a marker when missing, never a guess', () => {
    assert.equal(factOr(undefined, 'heures'), '[[FACT NEEDED: heures]]')
    assert.equal(factOr('', 'prix'), '[[FACT NEEDED: prix]]')
    assert.equal(factOr(marker('ancien'), 'nouveau'), '[[FACT NEEDED: nouveau]]')
  })
})

describe('containsMarker', () => {
  test('finds markers in strings and nested documents', () => {
    assert.equal(containsMarker(marker('x')), true)
    assert.equal(containsMarker({ title: 'ok', sections: [{ body: `a ${marker('b')}` }] }), true)
    assert.equal(containsMarker({ title: 'ok', faq: [] }), false)
    assert.equal(containsMarker(null), false)
    assert.equal(containsMarker(undefined), false)
  })
})

describe('publishGuard', () => {
  test('strict only when PUBLISH_GUARD=strict, show otherwise', () => {
    const before = process.env.PUBLISH_GUARD
    try {
      process.env.PUBLISH_GUARD = 'strict'
      assert.equal(publishGuard(), 'strict')
      process.env.PUBLISH_GUARD = 'show'
      assert.equal(publishGuard(), 'show')
      process.env.PUBLISH_GUARD = 'STRICT'
      assert.equal(publishGuard(), 'show', 'exact value only')
      delete process.env.PUBLISH_GUARD
      assert.equal(publishGuard(), 'show')
    } finally {
      if (before === undefined) delete process.env.PUBLISH_GUARD
      else process.env.PUBLISH_GUARD = before
    }
  })
})
