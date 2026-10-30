#!/usr/bin/env node
// Writes the site.config.json the rank-first tools read (weekly.yml, gate.mjs), from
// src/lib/routes.js (pages, languages) and data/facts.json (brand, NAP, geo, sameAs),
// plus the facts file path, the other forms of the brand name and the market block the
// measurement tools search from (Québec).
// Usage: node apps/web/scripts/rank-config.mjs [--out site.config.json]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { PAGES, esEnabled } from '../src/lib/routes.js'
import { siteConfig } from './gate-lib.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const { values } = parseArgs({ options: { out: { type: 'string', default: 'site.config.json' } } })
const factsFile = resolve(here, '../../../data/facts.json')
const { entity } = JSON.parse(readFileSync(factsFile, 'utf8'))
const cfg = siteConfig(PAGES, { es: esEnabled(), entity })

// The shop's second number (owner-published mobile): ai-runs.mjs counts it as ours, never as a wrong phone.
const mobile = entity.telephoneMobile?.match(/\+?\d[\d\s().-]{8,}\d/)?.[0]
if (mobile) cfg.nap = { ...cfg.nap, mobile }

// The forms of the name that count as the brand (scoreboard/README.md §3: an answer that says « Coco Vanille » or
// « Cocovanille »; the Google listing is « Pâtisserie Cocovanille », entity.alternateName): ai-runs.mjs reads them as
// the brand named, serp.mjs and market.mjs as our listing in the local pack. Without them only brand.name is matched.
cfg.brand = { ...cfg.brand, alternateNames: ['Coco Vanille', 'Cocovanille'] }

// ai-runs.mjs reads the facts there: a path relative to the config file written here.
cfg.facts = relative(dirname(resolve(values.out)), factsFile).split(sep).join('/')

// Where the measurement searches from (tools/lib.mjs marketConfig): Google.ca located on Granby, the AI engines'
// web search from Québec on Eastern time, North American phone numbers. Without this block the tools fall back
// to their Moroccan defaults (google.co.ma, +212 numbers, Africa/Casablanca). hl comes from each prompt's lang.
const city = cfg.nap?.city
cfg.market = {
  country: 'CA',
  region: 'Quebec',
  gl: 'ca',
  googleDomain: 'google.ca',
  ...(city ? { location: `${city},Quebec,Canada` } : {}), // SerpApi canonical location name
  timezone: 'America/Toronto',
  // (450) 770-7246, 450-372-7177, +1 438-528-7818: compared on their last 10 digits
  phonePattern: /(?<!\d)(?:\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]?[2-9]\d{2}[\s.-]?\d{4}(?!\d)/.source,
  phoneDigits: 10,
}

writeFileSync(values.out, `${JSON.stringify(cfg, null, 2)}\n`)
console.log(`wrote ${values.out}`)
