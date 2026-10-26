// Studio colours (WCAG 2.2 AA): every --s-ink-* on every light --s-paper-* ≥ 4.5:1, white on the accent,
// light inks on the dark paper, and non-text cues (focus ring, control borders) ≥ 3:1.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { contrast } from '../contrast.test.js'

const css = readFileSync(fileURLToPath(new URL('../../../src/styles/studio.css', import.meta.url)), 'utf8')
const root = css.match(/:root\s*{([\s\S]*?)\n}/)[1]
const t = Object.fromEntries([...root.matchAll(/(--s-[\w-]+):\s*(#[0-9a-f]{3,6})\b/gi)].map((m) => [m[1], m[2].toLowerCase()]))
const names = Object.keys(t)
const papers = names.filter((n) => n.startsWith('--s-paper') && n !== '--s-paper-dark')
const inks = names.filter((n) => n.startsWith('--s-ink') && !n.startsWith('--s-ink-on-'))
const check = (fg, bg, min) => {
  const r = contrast(t[fg], t[bg])
  assert.ok(r >= min, `${fg} ${t[fg]} on ${bg} ${t[bg]}: ${r.toFixed(2)}:1 < ${min}:1`)
}

test('the stylesheet declares the Studio tokens', () => {
  assert.ok(papers.length >= 5 && inks.length >= 5)
  for (const k of ['--s-accent', '--s-ink-on-accent', '--s-paper-dark', '--s-ink-on-dark', '--s-focus', '--s-control']) assert.ok(t[k], k)
})

test('every ink on every light paper ≥ 4.5:1', () => {
  for (const fg of inks) for (const bg of papers) check(fg, bg, 4.5)
})

test('button text on the accent, light inks on the dark bar ≥ 4.5:1', () => {
  check('--s-ink-on-accent', '--s-accent', 4.5)
  check('--s-ink-on-accent', '--s-accent-strong', 4.5)
  check('--s-ink-on-dark', '--s-paper-dark', 4.5)
  check('--s-ink-on-dark-soft', '--s-paper-dark', 4.5)
})

test('focus ring and control borders ≥ 3:1', () => {
  for (const bg of papers) {
    check('--s-focus', bg, 3)
    check('--s-control', bg, 3)
  }
  check('--s-focus-on-dark', '--s-paper-dark', 3)
})
