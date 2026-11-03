// The Stripe keys the owner pastes in Studio, encrypted before they reach the database (AES-256-GCM). The key comes from
// PAYLOAD_SECRET, like the alert keys (lib/studio/push.js): a stolen database dump alone gives nothing. Changing that secret
// means connecting Stripe again. Pure module.
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto'

const keyOf = (env) => {
  if (!env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET is missing')
  return Buffer.from(hkdfSync('sha256', env.PAYLOAD_SECRET, 'coco-studio', 'stripe-keys', 32))
}

export function sealSecret(plain, env = process.env) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keyOf(env), iv)
  const body = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()])
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), body.toString('base64url')].join('.')
}

// null when it can't be read: nothing stored, another format, or PAYLOAD_SECRET changed since it was sealed.
export function openSecret(sealed, env = process.env) {
  if (typeof sealed !== 'string' || !sealed.startsWith('v1.')) return null
  try {
    const [, iv, tag, body] = sealed.split('.')
    const decipher = createDecipheriv('aes-256-gcm', keyOf(env), Buffer.from(iv, 'base64url'))
    decipher.setAuthTag(Buffer.from(tag, 'base64url'))
    return Buffer.concat([decipher.update(Buffer.from(body, 'base64url')), decipher.final()]).toString('utf8')
  } catch {
    return null
  }
}

// What Studio may show of a key: its kind and last four characters, never more.
export const maskKey = (key) => (key ? `${String(key).slice(0, 8)}…${String(key).slice(-4)}` : '')
