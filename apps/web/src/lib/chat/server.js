// « Écrivez-nous » on the server: the visitor's thread (found by their cookie), their messages, the shop's
// replies from Studio, the read marks and the 90-day purge. Every write to a conversation runs under a
// Postgres advisory lock on its id, so a visitor's message and a shop reply landing together never overwrite
// each other (the web and studio processes share the database, not their memory). Relative imports only: the
// worker loads this file outside Next.
import { randomBytes } from 'node:crypto'
import { newVisitorSecret, verifySecret, parseCookieValue } from './token.js'
import { LIMITS, mergeProfile } from './validate.js'
import { localParts, zonedTime } from '../studio/time.js'
import { openState } from '../../components/site/hours.js'
import { notifyLive } from '../studio/live.js'

const SYS = { overrideAccess: true, depth: 0 }
const COLLECTION = 'conversations'
export const RETENTION_DAYS = 90
const LOCK_NAMESPACE = 7177
const LOCK_WAIT = '10s'

const iso = (d) => new Date(d).toISOString()
export const newMessageId = () => randomBytes(12).toString('hex')

// Last message older than this → deleted by the nightly worker.
export const retentionCutoff = (now = new Date(), days = RETENTION_DAYS) => new Date(new Date(now).getTime() - days * 24 * 60 * 60 * 1000)

// One writer at a time per conversation (two-key advisory lock: namespace, id). No pool (tests): run directly.
export async function withConversationLock(payload, id, fn) {
  const pool = payload?.db?.pool
  if (!pool?.connect) return fn()
  const client = await pool.connect()
  let locked = false
  let broken = false
  try {
    await client.query(`set lock_timeout = '${LOCK_WAIT}'`)
    await client.query('select pg_advisory_lock($1, $2)', [LOCK_NAMESPACE, Number(id)])
    locked = true
    return await fn()
  } finally {
    if (locked) await client.query('select pg_advisory_unlock($1, $2)', [LOCK_NAMESPACE, Number(id)]).catch(() => (broken = true))
    await client.query('reset lock_timeout').catch(() => (broken = true))
    // A connection that could not unlock is closed, which frees the lock in Postgres.
    client.release(broken || undefined)
  }
}

const load = (payload, id) => payload.findByID({ collection: COLLECTION, id, ...SYS, disableErrors: true }).catch(() => null)

const keep = (m) => ({ id: m.id, from: m.from, text: m.text, at: m.at, author: m.author && typeof m.author === 'object' ? m.author.id : m.author ?? null, relay: m.relay ?? null })

// Studio and the worker: the conversation by id, or null.
export const findConversation = (payload, id) => (id === undefined || id === null || id === '' ? Promise.resolve(null) : load(payload, id))

// The visitor's conversation from their cookie value, or null (unknown, purged, or a wrong secret).
export async function conversationFromCookie(payload, value) {
  const parsed = parseCookieValue(value)
  if (!parsed) return null
  const doc = await load(payload, parsed.id)
  return doc && verifySecret(parsed.secret, doc.tokenHash) ? doc : null
}

export const shopOpenNow = (shop, now = new Date()) => {
  const s = shop ? openState(shop, now) : null
  return s ? s.open : null
}

// What the visitor's browser receives: no author, no token hash, no contact value (only whether one is kept).
export function publicThread(conversation, { shopOpen = null } = {}) {
  if (!conversation) return { ok: true, conversation: false, status: null, messages: [], unread: 0, shopOpen, profile: null }
  return {
    ok: true,
    conversation: true,
    status: conversation.status || 'open',
    messages: (conversation.messages || []).map((m) => ({ id: m.id, from: m.from === 'shop' ? 'shop' : 'client', text: m.text, at: m.at })),
    unread: conversation.unreadForVisitor || 0,
    shopOpen,
    profile: { name: conversation.name || null, hasContact: Boolean(conversation.contact), replyByConsent: Boolean(conversation.replyByConsent) },
  }
}

// Visitor messages since midnight in Granby (the per-day cap).
export function clientMessagesToday(conversation, now = new Date()) {
  const from = zonedTime(localParts(now).iso, '00:00').getTime()
  return (conversation?.messages || []).filter((m) => m.from === 'client' && new Date(m.at).getTime() >= from).length
}

const profileData = (input, current = {}) => mergeProfile(current, input)

// Live refresh of open Studio screens (lib/studio/live.js): a hint with an id, never the text.
export const notifyShop = (payload, id) => notifyLive(payload, { id: null, op: 'CHAT', status: null, conversation: id }).catch(() => null)

// First message: a new conversation and its secret (the route puts it in the cookie, then forgets it).
export async function startConversation(payload, { input, now = new Date() }) {
  const p = profileData(input)
  if (p.error) return { error: p.error }
  const { secret, hash } = newVisitorSecret()
  const at = iso(now)
  const conversation = await payload.create({
    collection: COLLECTION,
    data: {
      tokenHash: hash,
      status: 'open',
      language: input.locale,
      startedOnPath: input.value.page,
      ...p.next,
      messages: [{ id: newMessageId(), from: 'client', text: input.value.text, at }],
      lastMessageAt: at,
      unreadForShop: 1,
      unreadForVisitor: 0,
    },
    ...SYS,
  })
  return { conversation, secret }
}

// Next message in an existing conversation (at most LIMITS.perDay a day); reopens a settled one.
export async function appendVisitorMessage(payload, conversation, { input, now = new Date() }) {
  return withConversationLock(payload, conversation.id, async () => {
    const fresh = await load(payload, conversation.id)
    if (!fresh) return { error: 'no_conversation' }
    if (clientMessagesToday(fresh, now) >= LIMITS.perDay) return { error: 'daily_limit' }
    const p = profileData(input, fresh)
    if (p.error) return { error: p.error }
    const at = iso(now)
    const doc = await payload.update({
      collection: COLLECTION,
      id: fresh.id,
      data: {
        ...p.next,
        status: 'open',
        messages: [...(fresh.messages || []).map(keep), { id: newMessageId(), from: 'client', text: input.value.text, at }],
        lastMessageAt: at,
        unreadForShop: (fresh.unreadForShop || 0) + 1,
      },
      ...SYS,
    })
    return { conversation: doc }
  })
}

// « Comment vous répondre? »: name, phone or email, and the consent to get the reply by texto/courriel.
export async function saveProfile(payload, conversation, { input }) {
  return withConversationLock(payload, conversation.id, async () => {
    const fresh = await load(payload, conversation.id)
    if (!fresh) return { error: 'no_conversation' }
    const p = profileData(input, fresh)
    if (p.error) return { error: p.error }
    return { conversation: await payload.update({ collection: COLLECTION, id: fresh.id, data: p.next, ...SYS }) }
  })
}

// The visitor's panel is open (GET ?read=1): their unread count goes back to 0.
export async function markVisitorRead(payload, conversation) {
  if (!conversation?.unreadForVisitor) return conversation
  return withConversationLock(payload, conversation.id, async () => {
    const fresh = await load(payload, conversation.id)
    if (!fresh?.unreadForVisitor) return fresh || conversation
    return payload.update({ collection: COLLECTION, id: fresh.id, data: { unreadForVisitor: 0 }, ...SYS })
  })
}

// Studio opened the thread: nothing left to read for the shop.
export async function markShopRead(payload, id) {
  return withConversationLock(payload, id, async () => {
    const fresh = await load(payload, id)
    if (!fresh?.unreadForShop) return fresh
    return payload.update({ collection: COLLECTION, id: fresh.id, data: { unreadForShop: 0 }, ...SYS })
  })
}

// A reply from Studio. → { conversation, message, before } ; before = what « Annuler » restores.
export async function appendShopMessage(payload, id, { text, userId = null, relay = null, now = new Date() }) {
  return withConversationLock(payload, id, async () => {
    const fresh = await load(payload, id)
    if (!fresh) return { error: 'missing' }
    const message = { id: newMessageId(), from: 'shop', text, at: iso(now), author: userId, relay }
    const before = { status: fresh.status, unreadForShop: fresh.unreadForShop || 0 }
    const conversation = await payload.update({
      collection: COLLECTION,
      id: fresh.id,
      data: { status: 'answered', messages: [...(fresh.messages || []).map(keep), message], lastMessageAt: message.at, unreadForShop: 0, unreadForVisitor: (fresh.unreadForVisitor || 0) + 1 },
      ...SYS,
    })
    return { conversation, message, before }
  })
}

// « Annuler » on a reply: the message goes away; status and unread come back unless the visitor wrote since.
export async function retractShopMessage(payload, id, { messageId, before = {} }) {
  return withConversationLock(payload, id, async () => {
    const fresh = await load(payload, id)
    if (!fresh) return { error: 'missing' }
    const messages = fresh.messages || []
    const target = messages.find((m) => m.id === messageId && m.from === 'shop')
    if (!target) return { conversation: fresh, removed: false }
    const rest = messages.filter((m) => m.id !== messageId)
    const after = (m) => new Date(m.at).getTime() > new Date(target.at).getTime()
    const untouched = fresh.status === 'answered' && !rest.some(after)
    const data = {
      messages: rest.map(keep),
      lastMessageAt: rest.length ? rest.at(-1).at : fresh.lastMessageAt,
      unreadForVisitor: Math.max(0, (fresh.unreadForVisitor || 0) - 1),
    }
    if (untouched && before.status) Object.assign(data, { status: before.status, unreadForShop: before.unreadForShop || 0 })
    return { conversation: await payload.update({ collection: COLLECTION, id: fresh.id, data, ...SYS }), removed: true }
  })
}

// « Marquer comme réglé » (and its « Annuler »).
export async function setConversationState(payload, id, { status, unreadForShop }) {
  return withConversationLock(payload, id, async () => {
    const fresh = await load(payload, id)
    if (!fresh) return { error: 'missing' }
    const before = { status: fresh.status, unreadForShop: fresh.unreadForShop || 0 }
    const data = { status }
    if (typeof unreadForShop === 'number') data.unreadForShop = unreadForShop
    return { conversation: await payload.update({ collection: COLLECTION, id: fresh.id, data, ...SYS }), before }
  })
}

// Studio badge and « À faire »: conversations with something the shop has not read, most recent first.
export async function shopInbox(payload, { limit = 3 } = {}) {
  const res = await payload.find({ collection: COLLECTION, where: { unreadForShop: { greater_than: 0 } }, sort: '-lastMessageAt', limit, ...SYS })
  return { count: res.totalDocs ?? res.docs.length, latest: res.docs }
}

// Nightly (worker): conversations whose last message is older than 90 days are deleted with their messages.
export async function purgeConversations(payload, { now = new Date(), limit = 500 } = {}) {
  const cutoff = iso(retentionCutoff(now))
  const res = await payload.find({
    collection: COLLECTION,
    where: { or: [{ lastMessageAt: { less_than: cutoff } }, { and: [{ lastMessageAt: { exists: false } }, { createdAt: { less_than: cutoff } }] }] },
    limit,
    ...SYS,
  })
  let purged = 0
  for (const c of res.docs) {
    await payload.delete({ collection: COLLECTION, id: c.id, ...SYS })
    purged += 1
  }
  return { conversationsPurged: purged }
}
