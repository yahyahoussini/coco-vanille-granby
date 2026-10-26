// Audit log (16 §5 G10, AC9): every state change carries person, device, time, before, after and IP.
// Studio actions write their own entry (with a French sentence and the undo window); the hooks below cover
// edits made in « Avancé » (/admin) on the collections Studio owns.
import { clockOf } from './time.js'

// Never copied into the log.
const SECRET = new Set(['hash', 'salt', 'pinHash', 'sessions', 'backupCodes', 'passkeys', 'resetPasswordToken', 'resetPasswordExpiration', 'loginAttempts', 'lockUntil', 'apiKey', 'apiKeyIndex', 'accessToken', 'webauthnChallenge'])

export function scrub(value, depth = 0) {
  if (value === null || value === undefined || typeof value !== 'object') return value ?? null
  if (depth > 6) return null
  if (Array.isArray(value)) return value.map((v) => scrub(v, depth + 1))
  const out = {}
  for (const [k, v] of Object.entries(value)) {
    if (SECRET.has(k)) continue
    out[k] = scrub(v, depth + 1)
  }
  return out
}

// Only the top-level keys that changed, so the log stays readable (« avant / après »).
export function changed(before = {}, after = {}) {
  const b = scrub(before) || {}
  const a = scrub(after) || {}
  const keys = new Set([...Object.keys(b), ...Object.keys(a)])
  const out = { before: {}, after: {} }
  for (const k of keys) {
    if (['updatedAt', 'createdAt'].includes(k)) continue
    if (JSON.stringify(b[k] ?? null) !== JSON.stringify(a[k] ?? null)) {
      out.before[k] = b[k] ?? null
      out.after[k] = a[k] ?? null
    }
  }
  return out
}

export const DEVICE_LABELS = { telephone: 'téléphone', tablette: 'tablette', ordinateur: 'ordinateur', avance: 'Avancé' }

// « Léa (tablette) »
export function actorLabel(user, device) {
  const name = user?.name || 'Quelqu’un'
  const d = DEVICE_LABELS[device?.kind] || device?.kind
  return d ? `${name} (${d})` : name
}

// « Léa (tablette) a marqué Croissant aux amandes épuisé à 10 h 42 »
export const sentence = (user, device, what, at = new Date()) => `${actorLabel(user, device)} ${what} à ${clockOf(at)}`

// The client's address as nginx saw it (X-Real-IP = $remote_addr, infra/nginx/snippets/coco-proxy.conf).
// Never X-Forwarded-For: its first entry is whatever the client typed. Null without the proxy (development).
export function ipOf(headers) {
  const get = (k) => (typeof headers?.get === 'function' ? headers.get(k) : headers?.[k])
  return String(get('x-real-ip') || '').trim() || null
}

export async function writeAudit(payload, { user = null, device = null, ip = null, action, entity = null, entityId = null, before = null, after = null, summary = null, key = null, undoOf = null, undoUntil = null, result = null, req = null }) {
  return payload.create({
    collection: 'audit-log',
    data: {
      actor: user?.id ?? null,
      device: device ? [device.kind, device.id].filter(Boolean).join(' · ') : null,
      ip,
      action,
      entity,
      entityId: entityId === null || entityId === undefined ? null : String(entityId),
      before: scrub(before),
      after: scrub(after),
      summary,
      key,
      undoOf,
      undoUntil: undoUntil ? new Date(undoUntil).toISOString() : null,
      result: scrub(result),
    },
    overrideAccess: true,
    depth: 0,
    req: req || undefined,
    context: { studioAudited: true },
  })
}

// Idempotency: an outbox replay with a key already in the log returns the first result, nothing runs twice.
export async function findByKey(payload, key) {
  if (!key) return null
  const res = await payload.find({ collection: 'audit-log', where: { key: { equals: String(key) } }, limit: 1, overrideAccess: true, depth: 0 })
  return res.docs[0] || null
}

// Collection hooks for edits that do not go through Studio actions (Payload admin, seeds with a user).
export function auditHooks(entity, { global = false } = {}) {
  const log = async ({ req, action, doc, before, after }) => {
    if (req?.context?.studioAudited || req?.context?.skipAudit) return
    if (!req?.user) return
    const d = changed(before || {}, after || {})
    if (!Object.keys(d.after).length && action.endsWith('.update')) return
    await req.payload
      .create({
        collection: 'audit-log',
        data: { actor: req.user.id, device: 'avance', ip: ipOf(req.headers), action, entity, entityId: global ? entity : String(doc.id), before: d.before, after: d.after, summary: `${req.user.name || 'Quelqu’un'} (Avancé) · ${action}` },
        overrideAccess: true,
        depth: 0,
        req,
        context: { studioAudited: true },
      })
      .catch((e) => req.payload.logger?.error?.({ err: e }, 'audit hook'))
  }
  // Globals: no operation, no delete (« Boutique & heures », the business identity).
  if (global) return { afterChange: [async ({ doc, previousDoc, req }) => (await log({ req, action: `${entity}.update`, doc, before: previousDoc, after: doc }), doc)] }
  return {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        await log({ req, action: `${entity}.${operation === 'create' ? 'create' : 'update'}`, doc, before: operation === 'create' ? {} : previousDoc, after: doc })
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await log({ req, action: `${entity}.delete`, doc, before: doc, after: {} })
        return doc
      },
    ],
  }
}
