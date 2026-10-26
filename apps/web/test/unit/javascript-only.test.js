// The app is JavaScript only (no .ts/.tsx, no TypeScript syntax), migrations included: Payload's generator
// writes TypeScript, scripts/migrate-create.mjs rewrites it.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SKIP = new Set(['node_modules', '.next', 'test-results', 'playwright-report', 'reports', 'media'])

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (SKIP.has(e.name) || e.name.startsWith('.')) return []
    const full = join(dir, e.name)
    return e.isDirectory() ? files(full) : [full]
  })
}

test('no TypeScript file in the app', () => {
  const ts = files(app).filter((f) => /\.(ts|tsx|mts|cts)$/.test(f))
  assert.deepEqual(ts, [])
})

test('migrations are JavaScript with up and down, and carry no type annotation', () => {
  const dir = join(app, 'src', 'migrations')
  const js = readdirSync(dir).filter((f) => f.endsWith('.js'))
  assert.ok(js.some((f) => /_initial\.js$/.test(f)), 'initial migration')
  assert.ok(js.some((f) => /_orders_notify\.js$/.test(f)), 'orders trigger migration')
  for (const f of js) {
    const src = readFileSync(join(dir, f), 'utf8')
    assert.match(src, /export async function up\(/, f)
    assert.match(src, /export async function down\(/, f)
    assert.doesNotMatch(src, /\): Promise<|: Migrate(Up|Down)Args/, f)
  }
})
