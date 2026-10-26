// Studio actions: one server entry point for every tap (16 §3.0). Each action is checked against the role
// matrix, replayed safely by its idempotency key (offline outbox), written to the audit log with before/after,
// and, when it can be undone, given an undo window. Side effects (textos) are held until that window closes.
import { can, needsStepUp } from '../roles.js'
import { writeAudit, findByKey } from '../audit.js'
import { orderActions } from './orders.js'
import { catalogActions } from './catalog.js'
import { shopActions } from './shop.js'
import { requestActions } from './requests.js'
import { reviewActions } from './reviews.js'
import { peopleActions } from './people.js'
import { Refusal } from './util.js'

// Snackbar ≥ 5 s (16a P4); the server keeps accepting « Annuler » a little longer while the snackbar has focus,
// and queued textos leave only after this window.
export const UNDO_VISIBLE_SECONDS = 8
export const UNDO_SECONDS = 30

export const REGISTRY = { ...orderActions, ...catalogActions, ...shopActions, ...requestActions, ...reviewActions, ...peopleActions }

const fail = (code, message, status = 409, extra = {}) => ({ ok: false, code, message, status, ...extra })

const undoInfo = (entry) => (entry?.undoUntil && !entry.undoneAt ? { id: entry.id, until: entry.undoUntil, visible: UNDO_VISIBLE_SECONDS } : null)

export async function perform(payload, { user, device = null, ip = null, stepUp = false, type, input = {}, key = null, now = new Date() }) {
  // The role matrix first: a refused role learns nothing about what exists.
  if (!can(user, type)) return fail('forbidden', 'Pas permis pour votre rôle. Rien n’a changé.', 403)
  if (needsStepUp(type) && !stepUp) return fail('step_up', 'Confirmez que c’est vous pour continuer.', 401)
  const def = REGISTRY[type]
  if (!def) return fail('unknown', 'Action inconnue.', 400)
  if (key) {
    const prev = await findByKey(payload, key)
    if (prev) return { ...(prev.result || { ok: true }), replay: true, undo: undoInfo(prev) }
  }
  const t = new Date(now).getTime()
  const undoSeconds = def.undo ? (typeof def.undoSeconds === 'function' ? def.undoSeconds(input) : def.undoSeconds ?? UNDO_SECONDS) : 0
  const ctx = { payload, user, device, ip, now: new Date(now), as: { user, overrideAccess: false }, undoUntil: undoSeconds ? new Date(t + undoSeconds * 1000) : null }
  let r
  try {
    r = await def.run(ctx, input || {})
  } catch (e) {
    if (e instanceof Refusal) return fail(e.code, e.message, e.status, e.extra)
    throw e
  }
  const result = { ok: true, message: r.message || 'Fait.', data: r.data ?? null }
  const entry = await writeAudit(payload, {
    user,
    device,
    ip,
    action: type,
    entity: r.entity || null,
    entityId: r.entityId ?? null,
    before: r.before ?? null,
    after: r.after ?? null,
    summary: r.summary || null,
    key,
    undoUntil: r.noUndo ? null : ctx.undoUntil,
    result,
  })
  return { ...result, undo: r.noUndo ? null : undoInfo(entry), auditId: entry.id }
}

// « Annuler »: same person (or the owner), inside the window, once.
export async function undo(payload, { user, device = null, ip = null, id, now = new Date() }) {
  const entry = await payload.findByID({ collection: 'audit-log', id, overrideAccess: true, depth: 0, disableErrors: true }).catch(() => null)
  if (!entry) return fail('undo_missing', 'Rien à annuler.', 404)
  const def = REGISTRY[entry.action]
  if (!def?.undo) return fail('undo_impossible', 'Cette action ne peut pas être annulée.', 409)
  const actor = typeof entry.actor === 'object' ? entry.actor?.id : entry.actor
  if (String(actor) !== String(user?.id) && user?.role !== 'proprietaire') return fail('forbidden', 'Seule la personne qui a fait le changement peut l’annuler.', 403)
  if (entry.undoneAt) return { ok: true, message: 'Déjà annulé.', replay: true }
  if (!entry.undoUntil || new Date(entry.undoUntil).getTime() < new Date(now).getTime()) return fail('undo_late', 'Trop tard pour annuler : le changement est déjà appliqué partout.', 409)
  const ctx = { payload, user, device, ip, now: new Date(now), as: { user, overrideAccess: false } }
  let r
  try {
    r = (await def.undo(ctx, entry)) || {}
  } catch (e) {
    if (e instanceof Refusal) return fail(e.code, e.message, e.status)
    throw e
  }
  await payload.update({ collection: 'audit-log', id: entry.id, data: { undoneAt: new Date(now).toISOString() }, overrideAccess: true, depth: 0, context: { studioAudited: true } })
  await writeAudit(payload, { user, device, ip, action: `${entry.action}.undo`, entity: entry.entity, entityId: entry.entityId, before: entry.after, after: entry.before, summary: r.summary || `${user?.name || 'Quelqu’un'} a annulé : ${entry.summary || entry.action}`, undoOf: String(entry.id) })
  return { ok: true, message: r.message || 'Annulé. Rien n’est parti.' }
}

export { fail, Refusal }
