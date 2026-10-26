#!/usr/bin/env node
// Writes the site.config.json the rank-first tools read (weekly.yml, gate.mjs), from
// src/lib/routes.js (pages, languages) and data/facts.json (brand, NAP, geo, sameAs).
// Usage: node apps/web/scripts/rank-config.mjs [--out site.config.json]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { PAGES, esEnabled } from '../src/lib/routes.js'
import { siteConfig } from './gate-lib.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const { values } = parseArgs({ options: { out: { type: 'string', default: 'site.config.json' } } })
const { entity } = JSON.parse(readFileSync(resolve(here, '../../../data/facts.json'), 'utf8'))
writeFileSync(values.out, `${JSON.stringify(siteConfig(PAGES, { es: esEnabled(), entity }), null, 2)}\n`)
console.log(`wrote ${values.out}`)
