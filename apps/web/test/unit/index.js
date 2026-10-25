// Entry point for `npm test` (= `node --test test/unit`).
// Node 22 does not expand a directory given to --test: it resolves "test/unit" to this index.js.
// It loads every *.test.js below this folder (ordering/, studio/ and any later module included),
// so all tests register in one run. A glob script (node --test 'test/unit/**/*.test.js') also works
// and never picks this file up.
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return []
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith('.test.js') ? [full] : []
  })

for (const file of walk(here).sort()) {
  await import(pathToFileURL(file).href)
}
