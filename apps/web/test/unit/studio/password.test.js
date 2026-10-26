// Step-up password check matches Payload's own PBKDF2 format (current and legacy).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pbkdf2Sync } from 'node:crypto'
import { passwordMatches } from '../../../src/lib/studio/password.js'

test('current pbkdf2-sha256-v1 hashes', async () => {
  const salt = 'a1b2c3'
  const hash = `pbkdf2-sha256-v1:${pbkdf2Sync('coco-dev-only', salt, 600000, 32, 'sha256').toString('hex')}`
  assert.ok(await passwordMatches('coco-dev-only', { hash, salt }))
  assert.equal(await passwordMatches('autre', { hash, salt }), false)
})

test('legacy hashes and missing values', async () => {
  const salt = 'ff00'
  const hash = pbkdf2Sync('vieux', salt, 25000, 512, 'sha256').toString('hex')
  assert.ok(await passwordMatches('vieux', { hash, salt }))
  assert.equal(await passwordMatches('', { hash, salt }), false)
  assert.equal(await passwordMatches('vieux', {}), false)
})
