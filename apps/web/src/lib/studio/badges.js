// Tab badges: requests waiting for a price, reviews waiting for a reply (16 §6.1). Counts only.
import { canSee } from './roles.js'

export async function badgeCounts({ payload, user }) {
  const as = { user, overrideAccess: false }
  const out = {}
  if (canSee(user, 'demandes')) {
    const r = await payload.count({ collection: 'requests', where: { status: { equals: 'new' } }, ...as })
    out.demandes = r.totalDocs
  }
  if (canSee(user, 'avis')) {
    const r = await payload.count({ collection: 'reviews', where: { status: { equals: 'unanswered' } }, ...as })
    out.avis = r.totalDocs
  }
  // « Écrivez-nous » conversations with unread visitor messages, on « Plus » (Messages lives there: the tab bar
  // keeps 5 tabs). The collection is server-only: the screen guard above is the role check.
  if (canSee(user, 'messages')) {
    const r = await payload.count({ collection: 'conversations', where: { unreadForShop: { greater_than: 0 } }, overrideAccess: true }).catch(() => null)
    if (r?.totalDocs) out.plus = r.totalDocs
  }
  return out
}
