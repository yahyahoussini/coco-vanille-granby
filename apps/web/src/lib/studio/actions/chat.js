// Messages actions (« Écrivez-nous », Studio › Messages): reply, « Marquer comme réglé », and the switch that shows
// the chat on the site. A reply is on the site at once; its texto or courriel copy (only when the visitor asked for
// it) is transactional and leaves after the undo window. « Annuler » takes the reply back and cancels the copy.
// The audit log keeps ids and lengths, never the conversation's text, name or contact (Loi 25 minimisation).
import { appendShopMessage, retractShopMessage, setConversationState, findConversation, notifyShop } from '../../chat/server.js'
import { relayMessage, RELAY_TEMPLATE } from '../../chat/relay.js'
import { LIMITS, cleanText } from '../../chat/validate.js'
import { enqueueMessage } from '../../messaging/queue.js'
import { senderFacts } from '../../messaging/templates.js'
import { sentence } from '../audit.js'
import { refuse, bool, holdMessages } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }

async function conversationOr404(ctx, id) {
  const c = await findConversation(ctx.payload, id)
  if (!c) refuse('missing', 'Conversation introuvable ou déjà effacée (90 jours).', 404)
  return c
}

// The queued texto/courriel copy of a reply, cancelled while it has not left.
async function cancelRelay(payload, id) {
  if (!id) return
  await payload.update({ collection: 'messages', where: { and: [{ id: { equals: id } }, { status: { equals: 'queued' } }] }, data: { status: 'cancelled' }, ...SYS }).catch(() => null)
}

export const chatActions = {
  'chat.reply': {
    async run(ctx, input) {
      const conv = await conversationOr404(ctx, input.conversationId)
      const text = cleanText(input.text)
      if (!text) refuse('text_required', 'Écrivez la réponse avant d’envoyer.', 422)
      if (text.length > LIMITS.text) refuse('too_long', `La réponse dépasse ${LIMITS.text} caractères : raccourcissez-la.`, 422)
      const facts = senderFacts(await ctx.payload.findGlobal({ slug: 'business', locale: 'fr', ...SYS }))
      const relay = bool(input.relay) ? relayMessage(conv, text, { phone: facts.phone }) : null
      const r = await appendShopMessage(ctx.payload, conv.id, { text, userId: ctx.user?.id ?? null, relay: relay?.channel || null, now: ctx.now })
      if (r.error) refuse('missing', 'Conversation introuvable ou déjà effacée (90 jours).', 404)
      let queued = null
      if (relay) {
        queued = await enqueueMessage(ctx.payload, { ...relay, template: RELAY_TEMPLATE, language: conv.language || 'fr' })
        await holdMessages(ctx.payload, [queued], ctx.undoUntil)
      }
      await notifyShop(ctx.payload, conv.id)
      const channel = relay ? (relay.channel === 'email' ? 'courriel' : 'texto') : null
      return {
        entity: 'conversations',
        entityId: conv.id,
        before: r.before,
        after: { status: 'answered', messageId: r.message.id, relay: relay?.channel || null, relayMessageId: queued?.id ?? null, length: text.length },
        summary: sentence(ctx.user, ctx.device, `a répondu à un message du site (conversation ${conv.id}${channel ? `, copie par ${channel}` : ''})`, ctx.now),
        message: channel ? `Réponse envoyée · visible sur le site · ${channel} dans 30 s` : 'Réponse envoyée · visible sur le site',
      }
    },
    async undo(ctx, entry) {
      const a = entry.after || {}
      await cancelRelay(ctx.payload, a.relayMessageId)
      const r = await retractShopMessage(ctx.payload, entry.entityId, { messageId: a.messageId, before: entry.before || {} })
      if (r.error) refuse('undo_state', 'La conversation a été effacée entre-temps.')
      await notifyShop(ctx.payload, entry.entityId)
      return { message: a.relay ? 'Réponse retirée · la copie par texto ou courriel n’est pas partie.' : 'Réponse retirée du site.' }
    },
  },

  // « Marquer comme réglé »: out of the « À répondre » list. A new visitor message opens it again by itself.
  'chat.close': {
    async run(ctx, input) {
      const conv = await conversationOr404(ctx, input.conversationId)
      if (conv.status === 'closed') refuse('already', 'Cette conversation est déjà réglée.')
      const r = await setConversationState(ctx.payload, conv.id, { status: 'closed', unreadForShop: 0 })
      if (r.error) refuse('missing', 'Conversation introuvable ou déjà effacée (90 jours).', 404)
      await notifyShop(ctx.payload, conv.id)
      return {
        entity: 'conversations',
        entityId: conv.id,
        before: r.before,
        after: { status: 'closed' },
        summary: sentence(ctx.user, ctx.device, `a marqué la conversation ${conv.id} comme réglée`, ctx.now),
        message: 'Conversation réglée.',
        data: { redirect: '/messages/' },
      }
    },
    async undo(ctx, entry) {
      const b = entry.before || {}
      const r = await setConversationState(ctx.payload, entry.entityId, { status: b.status || 'open', unreadForShop: b.unreadForShop || 0 })
      if (r.error) refuse('undo_state', 'La conversation a été effacée entre-temps.')
      await notifyShop(ctx.payload, entry.entityId)
      return { message: 'Annulé · la conversation est de retour.' }
    },
  },

  // Shop › chat.enabled: « Écrivez-nous » on the site, or paused (no new conversation; open ones still answered).
  'chat.enabled': {
    async run(ctx, input) {
      const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
      const before = shop.chat?.enabled !== false
      const next = bool(input.enabled)
      await ctx.payload.updateGlobal({ slug: 'shop', locale: 'fr', data: { chat: { enabled: next } }, depth: 0, ...ctx.write })
      return {
        entity: 'shop',
        entityId: 'chat',
        before: { enabled: before },
        after: { enabled: next },
        summary: sentence(ctx.user, ctx.device, next ? 'a affiché « Écrivez-nous » sur le site' : 'a mis « Écrivez-nous » en pause sur le site', ctx.now),
        message: next ? '« Écrivez-nous » est sur le site.' : '« Écrivez-nous » est en pause : plus de nouvelle conversation.',
      }
    },
    async undo(ctx, entry) {
      await ctx.payload.updateGlobal({ slug: 'shop', locale: 'fr', data: { chat: { enabled: entry.before?.enabled !== false } }, ...SYS, context: { studioAudited: true } })
      return { message: 'Annulé · comme avant.' }
    },
  },
}
