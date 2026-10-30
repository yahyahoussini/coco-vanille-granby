import { studioPage } from '@/lib/studio/guard'
import { relative } from '@/lib/studio/time'
import { statusOf, visitorName, initialOf, lastPreview, sortInbox } from '@/lib/chat/inbox'
import { LangBadge } from '@/components/studio/OrderCard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { LiveRefresh } from '@/components/studio/LiveRefresh'
import styles from './messages.module.css'

export const metadata = { title: 'Messages · Coco Studio' }

const BACK = '/messages/'
const SYS = { overrideAccess: true, depth: 0 }

function Row({ c, now }) {
  const st = statusOf(c.status)
  const unread = c.unreadForShop || 0
  return (
    <li>
      <a className={styles.row} href={`/messages/${c.id}/`} data-unread={unread > 0 || undefined}>
        <span className={styles.avatar} aria-hidden="true">
          {initialOf(c)}
        </span>
        <span className={styles.main}>
          <span className={styles.top}>
            <strong>{visitorName(c)}</strong>
            <LangBadge language={c.language} />
            <span className="tag" data-tone={st.tone}>
              {st.label}
            </span>
            <span className={styles.when}>{c.lastMessageAt ? relative(c.lastMessageAt, now) : ''}</span>
          </span>
          <span className={styles.preview}>{lastPreview(c)}</span>
        </span>
        {unread > 0 ? (
          <span className="badge">
            {unread}
            <span className="sr-only"> {unread > 1 ? 'messages non lus' : 'message non lu'}</span>
          </span>
        ) : (
          <span aria-hidden="true">›</span>
        )}
      </a>
    </li>
  )
}

// Messages (« Écrivez-nous »): what visitors wrote on the site. Unread first, then the most recent; the reply
// shows in the visitor's chat window (and by texto or courriel when they asked). Owner, manager and counter.
export default async function Messages({ searchParams }) {
  const ctx = await studioPage('messages', { back: BACK })
  const now = new Date()
  const [current, settled, shop] = await Promise.all([
    ctx.payload.find({ collection: 'conversations', where: { status: { in: ['open', 'answered'] } }, sort: '-lastMessageAt', limit: 60, ...SYS }),
    ctx.payload.find({ collection: 'conversations', where: { status: { equals: 'closed' } }, sort: '-lastMessageAt', limit: 20, ...SYS }),
    ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as }),
  ])
  const list = sortInbox(current.docs)
  const unread = list.filter((c) => (c.unreadForShop || 0) > 0).length
  const enabled = shop.chat?.enabled !== false

  return (
    <>
      <div className="st-head">
        <h1>Messages</h1>
        <span className="st-date">{unread ? `${unread} à lire` : 'à jour'}</span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />
      <LiveRefresh />
      {!enabled && (
        <p className="st-banner" data-tone="warn">
          <span>« Écrivez-nous » est en pause : les visiteurs ne peuvent pas commencer de conversation.</span>
        </p>
      )}

      <section aria-labelledby="en-cours">
        <h2 id="en-cours" className="sr-only">
          Conversations en cours
        </h2>
        {list.length ? (
          <ul className={styles.inbox}>
            {list.map((c) => (
              <Row key={c.id} c={c} now={now} />
            ))}
          </ul>
        ) : (
          <p className="empty">Aucun message en attente. Les messages écrits sur le site, dans « Écrivez-nous », arrivent ici.</p>
        )}
      </section>

      {settled.docs.length > 0 && (
        <details className="card">
          <summary className="btn btn-text">Réglés ({settled.docs.length})</summary>
          <ul className={styles.inbox}>
            {settled.docs.map((c) => (
              <Row key={c.id} c={c} now={now} />
            ))}
          </ul>
        </details>
      )}

      <section className="card" aria-labelledby="sur-le-site">
        <h2 id="sur-le-site">Sur le site</h2>
        <p>{enabled ? '« Écrivez-nous » est affiché sur toutes les pages, sauf le paiement.' : '« Écrivez-nous » est en pause. Les conversations en cours restent ici et reçoivent vos réponses.'}</p>
        {ctx.can('chat.enabled') && (
          <ActionForm type="chat.enabled" fields={{ enabled: enabled ? 'false' : 'true' }} back={BACK} needsNetwork>
            <button className="btn" type="submit">
              {enabled ? 'Mettre en pause' : 'Afficher sur le site'}
            </button>
          </ActionForm>
        )}
        <p className="meta">On répond pendant les heures d’ouverture : le site ne promet aucun délai. Chaque conversation est effacée 90 jours après son dernier message.</p>
      </section>
    </>
  )
}
