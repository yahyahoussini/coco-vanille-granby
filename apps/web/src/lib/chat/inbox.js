// Studio › Messages wording and order (French UI). Pure, node --test.
export const STATUS = {
  open: { label: 'À répondre', tone: 'warn' },
  answered: { label: 'Répondu', tone: 'ok' },
  closed: { label: 'Réglé', tone: undefined },
}

export const statusOf = (status) => STATUS[status] || STATUS.open

export const visitorName = (c) => (c?.name && String(c.name).trim()) || 'Internaute'

export const initialOf = (c) => (c?.name ? String(c.name).trim().charAt(0).toUpperCase() : '?')

// The last message on one line (« Vous : … » for the shop's own), cut at `max` characters.
export function lastPreview(c, max = 90) {
  const m = (c?.messages || []).at(-1)
  if (!m) return ''
  const text = String(m.text || '').replace(/\s+/g, ' ').trim()
  const cut = text.length > max ? `${text.slice(0, max - 1)}…` : text
  return m.from === 'shop' ? `Vous : ${cut}` : cut
}

// Unread first, then the most recent message.
export function sortInbox(conversations = []) {
  const t = (c) => new Date(c.lastMessageAt || c.updatedAt || 0).getTime()
  return [...conversations].sort((a, b) => Number((b.unreadForShop || 0) > 0) - Number((a.unreadForShop || 0) > 0) || t(b) - t(a))
}
