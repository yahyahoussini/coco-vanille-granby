// lib/routes: the page registry, path resolution and the reciprocal hreflang set.
// Every check loops over PAGES, so pages added by later modules are covered without edits here.
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  PAGES,
  LOCALES,
  HTML_LANG,
  SITE_ORIGIN,
  resolvePath,
  alternatesFor,
  pathFor,
  urlFor,
  pageByKey,
  isIndexable,
  localeEnabled,
} from '../../src/lib/routes.js'

const STATUSES = ['core', 'conditional', 'utility']

const segmentsOf = (locale, path) => {
  const prefix = locale === 'fr' ? '' : `/${locale}`
  return path.slice(prefix.length).split('/').filter(Boolean)
}

// Runs fn with ENABLE_ES set to a value, then restores the previous environment.
function withEs(value, fn) {
  const before = process.env.ENABLE_ES
  if (value === undefined) delete process.env.ENABLE_ES
  else process.env.ENABLE_ES = value
  try {
    return fn()
  } finally {
    if (before === undefined) delete process.env.ENABLE_ES
    else process.env.ENABLE_ES = before
  }
}

describe('registry shape', () => {
  test('keys are unique', () => {
    const keys = PAGES.map((p) => p.key)
    assert.equal(new Set(keys).size, keys.length)
  })

  test('every page has a French path (the x-default) and a known status and template', () => {
    for (const page of PAGES) {
      assert.ok(page.paths.fr, `${page.key}: no fr path`)
      assert.ok(STATUSES.includes(page.status), `${page.key}: status ${page.status}`)
      assert.equal(typeof page.template, 'string', `${page.key}: template`)
    }
  })

  test('paths are absolute, end with a slash, carry the locale prefix and are unique per locale', () => {
    for (const locale of LOCALES) {
      const seen = new Map()
      for (const page of PAGES) {
        const path = page.paths[locale]
        if (!path) continue
        assert.match(path, /^\/.*\/$|^\/$/, `${page.key} ${locale}: ${path}`)
        assert.doesNotMatch(path, /\/\//, `${page.key} ${locale}: double slash`)
        assert.doesNotMatch(path, /[A-Z\s]/, `${page.key} ${locale}: uppercase or space in ${path}`)
        if (locale === 'fr') assert.doesNotMatch(path, /^\/(en|es)\//, `${page.key}: fr path inside another locale folder`)
        else assert.ok(path.startsWith(`/${locale}/`), `${page.key} ${locale}: ${path} lacks /${locale}/`)
        assert.ok(!seen.has(path), `${path} used by ${seen.get(path)} and ${page.key}`)
        seen.set(path, page.key)
      }
    }
  })

  test('parents exist', () => {
    for (const page of PAGES) {
      if (page.parent) assert.ok(pageByKey(page.parent), `${page.key}: parent ${page.parent} missing`)
    }
  })

  test('html lang values are the Canadian variants', () => {
    assert.equal(HTML_LANG.fr, 'fr-CA')
    assert.equal(HTML_LANG.en, 'en-CA')
    assert.ok(HTML_LANG.es)
  })

  test('utility pages are not indexable, the others are', () => {
    for (const page of PAGES) assert.equal(isIndexable(page), page.status !== 'utility', page.key)
    assert.equal(Boolean(isIndexable(undefined)), false)
  })
})

describe('resolvePath', () => {
  test('home in French and English', () => {
    assert.equal(resolvePath('fr', []).page.key, 'home')
    assert.equal(resolvePath('fr', []).path, '/')
    assert.equal(resolvePath('en', []).page.key, 'home')
    assert.equal(resolvePath('en', []).path, '/en/')
  })

  test('round-trips every registered fr/en path', () => {
    for (const page of PAGES) {
      for (const locale of ['fr', 'en']) {
        const path = page.paths[locale]
        if (!path) continue
        const hit = resolvePath(locale, segmentsOf(locale, path))
        assert.equal(hit.path, path, `${page.key} ${locale}`)
        assert.equal(hit.page?.key, page.key, `${page.key} ${locale}: resolved to ${hit.page?.key}`)
      }
    }
  })

  test('nested paths resolve', () => {
    const nested = PAGES.find((p) => p.paths.fr.split('/').filter(Boolean).length > 1)
    if (!nested) return
    assert.equal(resolvePath('fr', segmentsOf('fr', nested.paths.fr)).page.key, nested.key)
  })

  test('unknown paths give no page but a normalised path', () => {
    const hit = resolvePath('fr', ['nexiste-pas'])
    assert.equal(hit.page, null)
    assert.equal(hit.path, '/nexiste-pas/')
    assert.equal(resolvePath('en', ['carte']).page, null, 'a French slug under /en/ is not a page')
  })

  test('Spanish pages resolve only when ENABLE_ES=true', () => {
    const esPages = PAGES.filter((p) => p.paths.es)
    if (!esPages.length) return
    withEs('false', () => {
      for (const page of esPages) assert.equal(resolvePath('es', segmentsOf('es', page.paths.es)).page, null, page.key)
      assert.equal(pathFor(esPages[0].key, 'es'), null)
      assert.equal(localeEnabled('es'), false)
    })
    withEs(undefined, () => assert.equal(localeEnabled('es'), false, 'off by default'))
    withEs('true', () => {
      for (const page of esPages) assert.equal(resolvePath('es', segmentsOf('es', page.paths.es)).page?.key, page.key)
      assert.equal(localeEnabled('es'), true)
    })
  })
})

describe('alternatesFor (hreflang)', () => {
  for (const es of ['false', 'true']) {
    test(`reciprocal, self-including, with x-default → fr (ENABLE_ES=${es})`, () => {
      withEs(es, () => {
        for (const page of PAGES) {
          const alts = alternatesFor(page.key)
          assert.equal(alts['x-default'], `${SITE_ORIGIN}${page.paths.fr}`, `${page.key}: x-default`)
          for (const locale of LOCALES) {
            const url = urlFor(page.key, locale)
            const tag = HTML_LANG[locale]
            if (url) {
              assert.equal(alts[tag], url, `${page.key}: ${tag} missing or wrong`)
            } else {
              assert.equal(alts[tag], undefined, `${page.key}: ${tag} points to a page that does not exist`)
            }
          }
          // Reciprocity: every alternate resolves to the same page, whose own set is identical.
          for (const [tag, url] of Object.entries(alts)) {
            if (tag === 'x-default') continue
            const locale = Object.keys(HTML_LANG).find((l) => HTML_LANG[l] === tag)
            const path = url.slice(SITE_ORIGIN.length)
            const hit = resolvePath(locale, segmentsOf(locale, path))
            assert.equal(hit.page?.key, page.key, `${url} does not resolve back to ${page.key}`)
            assert.deepEqual(alternatesFor(hit.page.key), alts, `${url}: alternate set differs`)
          }
          if (es === 'false') assert.equal(alts[HTML_LANG.es], undefined, `${page.key}: es alternate while ES is off`)
        }
      })
    })
  }

  test('unknown key gives an empty set', () => {
    assert.deepEqual(alternatesFor('nope'), {})
  })

  test('urls are absolute https on the canonical apex host', () => {
    for (const page of PAGES) {
      for (const url of Object.values(alternatesFor(page.key))) {
        assert.ok(url.startsWith('https://cocovanillegranby.com/'), url)
      }
    }
  })
})
