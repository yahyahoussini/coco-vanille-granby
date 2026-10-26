// Shared pieces for Studio actions.
export class Refusal extends Error {
  constructor(code, message, status = 409, extra = {}) {
    super(message)
    this.code = code
    this.status = status
    this.extra = extra
  }
}

export const refuse = (code, message, status = 409, extra = {}) => {
  throw new Refusal(code, message, status, extra)
}

// One document, read with the person's own access rules. Missing or hidden → a clear refusal.
export async function load(ctx, collection, id, { depth = 0, locale = 'fr' } = {}) {
  if (id === undefined || id === null || id === '') refuse('missing', 'Introuvable.', 404)
  const doc = await ctx.payload.findByID({ collection, id, depth, locale, ...ctx.as, disableErrors: true }).catch(() => null)
  if (!doc) refuse('missing', 'Introuvable ou déjà retiré.', 404)
  return doc
}

export const timelineEntry = (ctx, status, note) => ({ at: ctx.now.toISOString(), status, by: ctx.user?.id ?? null, source: 'studio', note })

export const pushTimeline = (doc, entry) => [...(Array.isArray(doc?.timeline) ? doc.timeline : []), entry]

// Textos queued by a Studio action leave only after its undo window (16 §3.0 « Side effects wait for undo »).
export async function holdMessages(payload, messages, until) {
  if (!until) return
  const at = new Date(new Date(until).getTime() + 2000).toISOString()
  for (const m of (messages || []).filter(Boolean)) {
    await payload.update({ collection: 'messages', id: m.id, data: { sendAfter: at }, overrideAccess: true, depth: 0 }).catch(() => null)
  }
}

export const str = (v, max = 500) => String(v ?? '').trim().slice(0, max)
export const int = (v) => (v === '' || v === null || v === undefined ? null : Number.isInteger(Number(v)) ? Number(v) : null)
export const bool = (v) => v === true || v === 'true' || v === 'on' || v === '1'
