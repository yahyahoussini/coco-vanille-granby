// Web Push to the team's own devices (16b §3): the one alert that works while no text or email can leave, and with Studio
// closed. An order or a request sends one short notice, with no customer's name in it. Each device opts in from Réglages
// (components/studio/PushToggle.js); iPhones need Studio added to the Home Screen first (iOS 16.4+).
import { createECDH, hkdfSync } from 'node:crypto'

const COLLECTION = 'push-subscriptions'
const SYS = { overrideAccess: true, depth: 0 }

// The VAPID pair comes from PAYLOAD_SECRET: no new secret to keep, and the same in every process and colour. Changing the
// secret means each device turns its alerts on again. null without a secret (unit tests).
export function vapidKeys(env = process.env) {
  if (!env.PAYLOAD_SECRET) return null
  const privateKey = Buffer.from(hkdfSync('sha256', env.PAYLOAD_SECRET, 'coco-studio', 'web-push-vapid', 32))
  const ecdh = createECDH('prime256v1')
  ecdh.setPrivateKey(privateKey)
  return { publicKey: ecdh.getPublicKey().toString('base64url'), privateKey: privateKey.toString('base64url') }
}

// Push services ask for an https: or mailto: subject; a local run has neither.
const subjectOf = (env) => (/^https:\/\//.test(env.PUBLIC_ORIGIN || '') ? env.PUBLIC_ORIGIN.replace(/\/$/, '') : 'https://cocovanillegranby.com')

// One notice to every device that asked for it, or to one (`only`, an endpoint: the test button). Never throws: an alert
// must not stop an order. A device the push service no longer knows is forgotten. → how many were sent.
export async function pushToTeam(payload, { title, body, url = '/', tag = 'coco', only = null }, env = process.env) {
  try {
    const keys = vapidKeys(env)
    if (!keys) return 0
    const where = only ? { endpoint: { equals: only } } : undefined
    const subs = (await payload.find({ collection: COLLECTION, where, limit: 50, pagination: false, ...SYS })).docs
    if (!subs.length) return 0
    const { default: webpush } = await import('web-push')
    const data = JSON.stringify({ title, body, url, tag })
    const options = { vapidDetails: { subject: subjectOf(env), publicKey: keys.publicKey, privateKey: keys.privateKey }, TTL: 24 * 3600, urgency: 'high', timeout: 5000 }
    const results = await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, data, options)
          return 1
        } catch (e) {
          if ([404, 410].includes(e?.statusCode)) await payload.delete({ collection: COLLECTION, id: s.id, ...SYS }).catch(() => null)
          else payload.logger?.warn?.({ status: e?.statusCode, message: e?.message }, 'web push not sent')
          return 0
        }
      }),
    )
    return results.reduce((a, b) => a + b, 0)
  } catch (e) {
    payload.logger?.warn?.({ message: e?.message }, 'web push failed')
    return 0
  }
}
