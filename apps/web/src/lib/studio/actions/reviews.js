// Avis actions (16 §3.5): manual entry while the Google Business Profile API is not approved, « J'ai répondu »
// after copying the reply into Google, « Plus tard ». A human always publishes (G7, G9).
import { sentence } from '../audit.js'
import { stars } from '../format.js'
import { refuse, load, str, int } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const snapshot = (r) => ({ status: r.status, reply: r.reply || null, repliedAt: r.repliedAt || null, replyDraft: r.replyDraft || null })

const setStatus = (status, word) => ({
  undoSeconds: 30,
  async run(ctx, input) {
    const review = await load(ctx, 'reviews', input.reviewId)
    const reply = str(input.reply, 4000)
    const data = status === 'answered' ? { status, reply: reply || review.replyDraft || null, repliedAt: ctx.now.toISOString(), replyDraft: reply || review.replyDraft || null } : { status, replyDraft: reply || review.replyDraft || null }
    if (status === 'answered' && !data.reply) refuse('reply_required', 'Écrivez ou copiez la réponse d’abord.', 422)
    await ctx.payload.update({ collection: 'reviews', id: review.id, data, depth: 0, ...ctx.write })
    const late = status === 'answered' && ctx.now.getTime() - new Date(review.receivedAt).getTime() > 24 * 3600000
    return {
      entity: 'reviews',
      entityId: review.id,
      before: snapshot(review),
      after: { status, reply: data.reply || null },
      summary: sentence(ctx.user, ctx.device, `${word} l’avis ${review.rating}★`, ctx.now),
      message: status === 'answered' ? `Réponse notée${late ? ' (après 24 h)' : ''}. Elle peut prendre un moment à s’afficher sur Google.` : 'Gardé pour plus tard · le délai de 24 h continue.',
    }
  },
  async undo(ctx, entry) {
    await ctx.payload.update({ collection: 'reviews', id: entry.entityId, data: entry.before, ...SYS, context: { studioAudited: true } })
    return { message: 'Annulé.' }
  },
})

export const reviewActions = {
  'review.create': {
    undoSeconds: 30,
    async run(ctx, input) {
      const author = str(input.author, 80)
      const rating = int(input.rating)
      if (!author) refuse('author_required', 'Indiquez le nom affiché sur Google.', 422)
      if (!(rating >= 1 && rating <= 5)) refuse('rating_required', 'Choisissez le nombre d’étoiles.', 422)
      const at = input.receivedAt ? new Date(input.receivedAt) : ctx.now
      const receivedAt = Number.isNaN(at.getTime()) || at.getTime() > ctx.now.getTime() ? ctx.now : at
      const data = {
        platform: ['google', 'facebook', 'tripadvisor', 'yelp'].includes(input.platform) ? input.platform : 'google',
        author,
        rating,
        text: str(input.text, 4000) || null,
        language: ['fr', 'en', 'es'].includes(input.language) ? input.language : 'fr',
        receivedAt: receivedAt.toISOString(),
        status: 'unanswered',
      }
      const doc = await ctx.payload.create({ collection: 'reviews', data, depth: 0, ...ctx.write })
      return { entity: 'reviews', entityId: doc.id, before: null, after: data, summary: sentence(ctx.user, ctx.device, `a ajouté un avis ${stars(rating)} de ${author}`, ctx.now), message: `Avis ${rating}★ ajouté · répondre d’ici 24 h.`, data: { reviewId: doc.id } }
    },
    async undo(ctx, entry) {
      await ctx.payload.delete({ collection: 'reviews', id: entry.entityId, ...SYS, context: { studioAudited: true } })
      return { message: 'Avis retiré.' }
    },
  },
  'review.answered': setStatus('answered', 'a répondu à'),
  'review.later': setStatus('later', 'a remis à plus tard'),
}
