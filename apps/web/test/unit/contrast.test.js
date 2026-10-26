// WCAG 2.2 AA colour contrast for every text/background token pair in src/styles/site.css (≥ 4.5:1),
// and ≥ 3:1 for non-text cues (focus ring, form-control borders). Tokens are read from the stylesheet,
// so a new --ink-* or --paper-* token is checked against its whole group automatically.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const css = readFileSync(fileURLToPath(new URL('../../src/styles/site.css', import.meta.url)), 'utf8')
const root = css.match(/:root\s*{([\s\S]*?)\n}/)[1]
const tokens = Object.fromEntries([...root.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{3,6})\b/gi)].map((m) => [m[1], m[2].toLowerCase()]))

const hex = (h) => {
  const s = h.replace('#', '')
  const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}
const channel = (c) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const luminance = (h) => {
  const [r, g, b] = hex(h).map(channel)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const names = Object.keys(tokens)
const lightInks = names.filter((n) => n.startsWith('--ink') && !n.startsWith('--ink-on-'))
const darkInks = names.filter((n) => n.startsWith('--ink-on-dark'))
const lightPapers = names.filter((n) => n.startsWith('--paper') && !n.startsWith('--paper-dark'))
const darkPapers = names.filter((n) => n.startsWith('--paper-dark'))
const accents = names.filter((n) => /^--accent/.test(n))

const check = (fg, bg, min) => {
  const ratio = contrast(tokens[fg], tokens[bg])
  assert.ok(ratio >= min, `${fg} ${tokens[fg]} on ${bg} ${tokens[bg]}: ${ratio.toFixed(2)}:1 < ${min}:1`)
}

describe('colour contrast (WCAG 2.2 AA)', () => {
  test('the stylesheet declares the token groups', () => {
    for (const group of [lightInks, darkInks, lightPapers, darkPapers, accents]) assert.ok(group.length > 0)
    assert.ok(tokens['--ink-on-accent'] && tokens['--focus'] && tokens['--focus-on-dark'] && tokens['--control-border'])
  })

  test('every light ink on every light paper ≥ 4.5:1', () => {
    for (const fg of lightInks) for (const bg of lightPapers) check(fg, bg, 4.5)
  })

  test('every dark ink on every dark paper ≥ 4.5:1', () => {
    for (const fg of darkInks) for (const bg of darkPapers) check(fg, bg, 4.5)
  })

  test('button text on every accent ≥ 4.5:1', () => {
    for (const bg of accents) check('--ink-on-accent', bg, 4.5)
  })

  test('inverted badges (raised paper on ink) ≥ 4.5:1', () => {
    check('--paper-raised', '--ink', 4.5)
  })

  test('non-text cues ≥ 3:1: focus ring and control borders', () => {
    for (const bg of lightPapers) check('--focus', bg, 3)
    for (const bg of lightPapers) check('--control-border', bg, 3)
    for (const bg of darkPapers) check('--focus-on-dark', bg, 3)
  })

  test('the contrast formula matches known values', () => {
    assert.equal(contrast('#000000', '#ffffff').toFixed(1), '21.0')
    assert.equal(contrast('#777777', '#ffffff').toFixed(2), '4.48')
  })
})

describe('brand texture and fonts', () => {
  test('the vanilla-speckle texture is an inline SVG of 2 KB or less', () => {
    const uri = root.match(/--speckle:\s*(url\("data:image\/svg\+xml,[^"]+"\))/)
    assert.ok(uri, '--speckle data URI')
    assert.ok(uri[1].length <= 2048, `${uri[1].length} bytes`)
  })

  test('display type uses the Fraunces SOFT axis and size-adjusted fallbacks (no layout shift)', () => {
    assert.match(css, /font-variation-settings:\s*'SOFT' 100/)
    assert.match(css, /font-family: 'Fraunces Fallback';[\s\S]*?size-adjust/)
    assert.match(css, /font-family: 'Inter Fallback';[\s\S]*?size-adjust/)
  })

  test('reduced motion turns transitions off', () => {
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transition: none !important/)
  })
})
