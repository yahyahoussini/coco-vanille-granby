import { firstParam } from '@/lib/studio/guard'

// Server-rendered notice after a form post without JavaScript: the result, and « Annuler » while the
// undo window is open. With JavaScript the snackbar does the same job.
export async function Flash({ ctx, searchParams, back }) {
  const q = (await searchParams) || {}
  const done = firstParam(q.fait)
  const error = firstParam(q.erreur)
  if (error) {
    const msg = firstParam(q.msg)
    return (
      <div className="error-summary" tabIndex={-1} id="avis-erreur">
        Pas appliqué : {msg || 'refusé par le serveur.'}
      </div>
    )
  }
  if (firstParam(q.annule)) return <div className="notice">Annulé. Rien n’est parti.</div>
  if (!done || !/^\d+$/.test(done)) return null
  const entry = await ctx.payload.findByID({ collection: 'audit-log', id: done, overrideAccess: true, depth: 0, disableErrors: true }).catch(() => null)
  const actor = entry && (typeof entry.actor === 'object' ? entry.actor?.id : entry.actor)
  if (!entry || String(actor) !== String(ctx.user.id)) return null
  const open = entry.undoUntil && !entry.undoneAt && new Date(entry.undoUntil).getTime() > Date.now()
  return (
    <div className="notice" role="status">
      <span>{entry.result?.message || entry.summary || 'Fait.'}</span>
      {open && (
        <form method="post" action="/svc/annuler/">
          <input type="hidden" name="id" value={entry.id} />
          <input type="hidden" name="back" value={back} />
          <button className="btn" type="submit">
            Annuler
          </button>
        </form>
      )}
    </div>
  )
}
