import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studioPage } from '@/lib/studio/guard'
import { relative } from '@/lib/studio/time'
import { whenFr } from '@/lib/studio/format'
import { statusOf, visitorName } from '@/lib/chat/inbox'
import { findConversation, markShopRead } from '@/lib/chat/server'
import { contactKind, LIMITS } from '@/lib/chat/validate'
import { LangBadge } from '@/components/studio/OrderCard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { LiveRefresh } from '@/components/studio/LiveRefresh'
import styles from '../messages.module.css'

export const metadata = { title: 'Message du site · Coco Studio' }

// One conversation of « Écrivez-nous »: what the visitor wrote, the shop's replies, the reply form. Opening it marks
// the visitor's messages as read. The reply shows at once in the visitor's chat window; a texto or courriel copy
// only when they asked for one and left a phone or an email (transactional, after the undo window).
export default async function Conversation({ params, searchParams }) {
  const ctx = await studioPage('messages', { back: '/messages/' })
  const { id } = await params
  const found = await findConversation(ctx.payload, id)
  if (!found) notFound()
  const c = (found.unreadForShop || 0) > 0 ? (await markShopRead(ctx.payload, found.id)) || found : found
  const now = new Date()
  const back = `/messages/${c.id}/`
  const st = statusOf(c.status)
  const kind = c.contact ? contactKind(c.contact) : null
  const canRelay = Boolean(c.replyByConsent && c.contact)
  const started = c.startedOnPath ? String(c.startedOnPath) : null

  return (
    <>
      <p>
        <Link href="/messages/">‹ Messages</Link>
      </p>
      <div className="st-head">
        <h1>{visitorName(c)}</h1>
        <span className="st-date">
          <LangBadge language={c.language} />{' '}
          <span className="tag" data-tone={st.tone}>
            {st.label}
          </span>
        </span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={back} />
      <LiveRefresh />

      <section className="card" aria-labelledby="qui">
        <h2 id="qui">Coordonnées</h2>
        <dl className={styles.contact}>
          <dt>Prénom</dt>
          <dd>{c.name || 'non indiqué'}</dd>
          <dt>{kind === 'email' ? 'Courriel' : 'Téléphone'}</dt>
          <dd>{c.contact ? kind === 'email' ? <a href={`mailto:${c.contact}`}>{c.contact}</a> : <a href={`tel:${c.contact}`}>{c.contact}</a> : 'non indiqué'}</dd>
          <dt>Réponse par {kind === 'email' ? 'courriel' : 'texto'}</dt>
          <dd>{canRelay ? 'oui, demandée' : 'non demandée : la réponse reste sur le site'}</dd>
          {started && (
            <>
              <dt>Écrit depuis</dt>
              <dd>{started}</dd>
            </>
          )}
        </dl>
      </section>

      <section aria-labelledby="fil">
        <h2 id="fil" className="sr-only">
          Conversation
        </h2>
        <ul className={styles.thread}>
          {(c.messages || []).map((m) => (
            <li key={m.id} className={m.from === 'shop' ? styles.shop : styles.client}>
              <p className={styles.bubble}>{m.text}</p>
              <p className={styles.by}>
                {m.from === 'shop' ? 'Coco Vanille' : visitorName(c)} · <time dateTime={m.at}>{whenFr(m.at, now)}</time> ({relative(m.at, now)})
              </p>
            </li>
          ))}
        </ul>
      </section>

      {ctx.can('chat.reply') && (
        <ActionForm type="chat.reply" fields={{ conversationId: c.id }} back={back} className={`card ${styles.reply}`} needsNetwork pending="Envoi de la réponse…">
          <div className="field">
            <label htmlFor="reponse">Votre réponse</label>
            <textarea id="reponse" name="text" required maxLength={LIMITS.text} placeholder="Bonjour! …" />
            <span className="hint">Visible dans la fenêtre « Écrivez-nous » du visiteur, sur le même navigateur. {LIMITS.text} caractères au plus.</span>
          </div>
          {canRelay && (
            <label className="choice">
              <input type="checkbox" name="relay" value="true" defaultChecked />
              <span>Envoyer aussi par {kind === 'email' ? 'courriel' : 'texto'} (le visiteur l’a demandé)</span>
            </label>
          )}
          <button className="btn btn-primary" type="submit">
            Envoyer la réponse
          </button>
        </ActionForm>
      )}

      {ctx.can('chat.close') && c.status !== 'closed' && (
        <ActionForm type="chat.close" fields={{ conversationId: c.id }} back="/messages/" needsNetwork>
          <button className="btn" type="submit">
            Marquer comme réglé
          </button>
        </ActionForm>
      )}
      <p className="meta">Effacée automatiquement 90 jours après le dernier message.</p>
    </>
  )
}
