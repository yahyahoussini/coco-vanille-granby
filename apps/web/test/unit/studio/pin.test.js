// Staff PIN (scrypt) and owner backup codes: hashes only, lockout after 5 wrong PINs.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { hashPin, verifyPin, validPin, afterPinFailure, pinLocked, newBackupCodes, hashSecret, useBackupCode, sign, unsign } from '../../../src/lib/studio/pin.js'

describe('PIN', () => {
  test('4 digits only', () => {
    assert.ok(validPin('0427'))
    for (const bad of ['123', '12345', 'abcd', '12 4', '', null]) assert.equal(validPin(bad), false)
  })

  test('scrypt hash, never the PIN itself, salted', async () => {
    const a = await hashPin('1234')
    const b = await hashPin('1234')
    assert.match(a, /^scrypt\$16384\$8\$1\$/)
    assert.ok(!a.includes('1234'))
    assert.notEqual(a, b)
    assert.ok(await verifyPin('1234', a))
    assert.equal(await verifyPin('1235', a), false)
    assert.equal(await verifyPin('1234', 'garbage'), false)
  })

  test('5 failures lock for 15 minutes', () => {
    const now = new Date('2026-10-31T14:00:00Z')
    let user = { pinFailures: 0 }
    for (let i = 0; i < 4; i++) user = { ...user, ...afterPinFailure(user, now) }
    assert.equal(user.pinFailures, 4)
    assert.equal(pinLocked(user, now), false)
    user = { ...user, ...afterPinFailure(user, now) }
    assert.ok(pinLocked(user, now))
    assert.equal(pinLocked(user, new Date(now.getTime() + 16 * 60 * 1000)), false)
  })
})

describe('backup codes', () => {
  test('8 codes, each usable once', async () => {
    const codes = newBackupCodes()
    assert.equal(codes.length, 8)
    for (const c of codes) assert.match(c, /^[a-z0-9]{5}-[a-z0-9]{5}$/)
    const hashes = await Promise.all(codes.slice(0, 2).map((c) => hashSecret(c)))
    const first = await useBackupCode(codes[0].toUpperCase().replace('-', ' '), hashes)
    assert.ok(first.ok)
    assert.equal(first.remaining.length, 1)
    const again = await useBackupCode(codes[0], first.remaining)
    assert.equal(again.ok, false)
  })
})

describe('signed values (device and step-up cookies)', () => {
  test('tampering is refused', () => {
    const t = sign({ id: 'abc', kind: 'tablette', shared: true }, 's3cret')
    assert.deepEqual(unsign(t, 's3cret'), { id: 'abc', kind: 'tablette', shared: true })
    assert.equal(unsign(t, 'other'), null)
    const [body, mac] = t.split('.')
    const forged = Buffer.from(JSON.stringify({ id: 'abc', kind: 'tablette', shared: false })).toString('base64url')
    assert.equal(unsign(`${forged}.${mac}`, 's3cret'), null)
    assert.equal(unsign(`${body}`, 's3cret'), null)
  })
})
