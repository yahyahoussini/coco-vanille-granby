import Link from 'next/link'
import { studioPage, firstParam } from '@/lib/studio/guard'
import { localParts, addDays, dayBounds, shortDay } from '@/lib/studio/time'
import { stars, whenFr, answerTimer, customerName } from '@/lib/studio/format'
import { relative } from '@/lib/studio/time'
import { KINDS, kindFor, replyTemplate, replyDeadline, googleLink, firstNameOf } from '@/lib/studio/reviews'
import { senderFacts } from '@/lib/messaging/templates'
import { LangBadge } from '@/components/studio/OrderCard'
import { ActionForm } from '@/components/studio/ActionForm'
import { CopyButton } from '@/components/studio/CopyButton'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Avis · Coco Studio' }

const BACK = '/avis/'
const PLATFORM = { google: 'Google', facebook: 'Facebook', tripadvisor: 'Tripadvisor', yelp: 'Yelp' }

// Avis (16 §3.5): reply within 24 h in the reviewer's language. The Google Business Profile API is not approved
// yet, so: « Copier la réponse » · « Ouvrir Google » · « J'ai répondu ». Drafts come from templates; no AI at launch.
export default async function Avis({ searchParams }) {
  const ctx = await studioPage('avis')
  const q = (await searchParams) || {}
  const now = new Date()
  const today = localParts(now).iso
  const readOnly = !ctx.can('review.answered')
  const [open, done, business, products] = await Promise.all([
    ctx.payload.find({ collection: 'reviews', where: { status: { in: ['unanswered', 'later'] } }, sort: 'receivedAt', limit: 30, depth: 0, ...ctx.as }),
    ctx.payload.find({ collection: 'reviews', where: { status: { equals: 'answered' } }, sort: '-repliedAt', limit: 10, depth: 0, ...ctx.as }),
    ctx.payload.findGlobal({ slug: 'business', locale: 'fr', depth: 0, ...ctx.as }),
    ctx.payload.find({ collection: 'products', limit: 200, depth: 0, locale: 'fr', ...ctx.as, select: { title: true } }),
  ])
  const f = senderFacts(business)
  const titles = products.docs.map((p) => p.title)
  const google = googleLink(business)
  const chosen = firstParam(q.modele)
  const chosenFor = firstParam(q.avis)

  // 1–3 ★: « Appeler le client? (commande trouvée : 1042) », matched on the first name in the last 30 days (owner and manager only).
  const matches = {}
  if (!readOnly) {
    for (const r of open.docs.filter((x) => x.rating <= 3)) {
      const name = firstNameOf(r.author)
      if (!name) continue
      const found = await ctx.payload.find({ collection: 'orders', where: { and: [{ 'customer.firstName': { equals: name } }, { pickupDate: { greater_than_equal: dayBounds(addDays(today, -30)).from } }] }, limit: 1, sort: '-pickupDate', depth: 0, ...ctx.as })
      if (found.docs[0]) matches[r.id] = found.docs[0]
    }
  }

  return (
    <>
      <div className="st-head">
        <h1>Avis</h1>
        <span className="st-date">{open.docs.length ? `${open.docs.length} sans réponse` : 'à jour'}</span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />
      <p className="st-banner" data-tone="warn">
        <span>Google n’est pas encore relié : copier la réponse, l’ouvrir dans Google, puis « J’ai répondu ».</span>
      </p>
      {!open.docs.length && <p className="empty">Tous les avis ont une réponse.</p>}
      {open.docs.map((r) => {
        const kind = chosenFor === String(r.id) && KINDS.some(([k]) => k === chosen) ? chosen : kindFor(r)
        const draft = chosenFor === String(r.id) ? replyTemplate(kind, r.language, { author: r.author, text: r.text, titles, phone: f.phone, email: f.email }) : r.replyDraft || replyTemplate(kind, r.language, { author: r.author, text: r.text, titles, phone: f.phone, email: f.email })
        const deadline = replyDeadline(r)
        const t = answerTimer(deadline, now)
        const match = matches[r.id]
        return (
          <article className="card" id={`avis-${r.id}`} key={r.id} data-tone={t.overdue ? 'bad' : r.rating <= 3 ? 'warn' : undefined} aria-labelledby={`avis-titre-${r.id}`}>
            <div className="card-head">
              <h3 id={`avis-titre-${r.id}`}>
                <span aria-hidden="true">{stars(r.rating)}</span>
                <span className="sr-only">{r.rating} étoiles sur 5</span> {PLATFORM[r.platform] || r.platform} · {r.author}
              </h3>
              <LangBadge language={r.language} />
            </div>
            <p className="meta">
              {relative(r.receivedAt, now)}
              {r.status === 'later' ? ' · gardé pour plus tard' : ''}
            </p>
            {r.text ? <p>« {r.text} »</p> : <p className="meta">Note seule, sans texte.</p>}
            <p>
              <span className="tag" data-tone={t.overdue ? 'bad' : t.urgent ? 'warn' : undefined}>
                {t.overdue ? t.text : `Répondre d’ici : ${whenFr(deadline, now)}`}
              </span>
            </p>
            {match && (
              <p className="st-banner" data-tone="warn">
                <span>
                  Appeler le client? (commande trouvée : <Link href={`/commandes/${match.id}/`}>{match.number}</Link> · {customerName(match.customer)})
                </span>
              </p>
            )}
            {readOnly ? (
              <p className="meta">Lecture seule.</p>
            ) : (
              <>
                <nav className="choices" aria-label="Modèle de réponse">
                  {KINDS.map(([k, label]) => (
                    <Link key={k} className="btn btn-text" href={`/avis/?avis=${r.id}&modele=${k}#avis-${r.id}`} aria-current={k === kind ? 'true' : undefined}>
                      {label}
                    </Link>
                  ))}
                </nav>
                <ActionForm type="review.answered" fields={{ reviewId: r.id }} back={BACK} needsNetwork>
                  <div className="field">
                    <label htmlFor={`reponse-${r.id}`}>Brouillon ({r.language === 'en' ? 'anglais' : r.language === 'es' ? 'espagnol' : 'français'}) · à vérifier avant de publier</label>
                    <textarea id={`reponse-${r.id}`} name="reply" key={`${r.id}-${kind}`} defaultValue={draft} required />
                  </div>
                  <div className="btn-row">
                    <CopyButton target={`reponse-${r.id}`} />
                    <a className="btn" href={google} target="_blank" rel="noopener noreferrer">
                      Ouvrir Google
                    </a>
                  </div>
                  <button className="btn btn-primary" type="submit" style={{ marginBlockStart: '0.5rem' }}>
                    J’ai répondu
                  </button>
                </ActionForm>
                {r.status !== 'later' && (
                  <ActionForm type="review.later" fields={{ reviewId: r.id }} back={BACK}>
                    <button className="btn btn-text" type="submit">
                      Plus tard
                    </button>
                  </ActionForm>
                )}
              </>
            )}
          </article>
        )
      })}

      {!readOnly && (
        <details className="card" id="ajouter">
          <summary className="btn">Ajouter un avis</summary>
          <ActionForm type="review.create" back={BACK}>
            <div className="field">
              <label htmlFor="av-auteur">Nom affiché</label>
              <input id="av-auteur" name="author" type="text" autoComplete="off" required />
            </div>
            <fieldset className="field">
              <legend>Étoiles</legend>
              <div className="choices">
                {[5, 4, 3, 2, 1].map((n) => (
                  <label className="choice" key={n}>
                    <input type="radio" name="rating" value={n} required />
                    <span>{n} ★</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="av-texte">Texte (vide = note seule)</label>
              <textarea id="av-texte" name="text" />
            </div>
            <fieldset className="field">
              <legend>Langue</legend>
              <div className="choices">
                {[
                  ['fr', 'Français'],
                  ['en', 'English'],
                  ['es', 'Español'],
                ].map(([v, l]) => (
                  <label className="choice" key={v}>
                    <input type="radio" name="language" value={v} defaultChecked={v === 'fr'} />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="av-plateforme">Plateforme</label>
              <select id="av-plateforme" name="platform" defaultValue="google">
                {Object.entries(PLATFORM).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="av-date">Reçu le (vide = maintenant)</label>
              <input id="av-date" name="receivedAt" type="datetime-local" />
            </div>
            <button className="btn btn-primary" type="submit">
              Ajouter
            </button>
          </ActionForm>
        </details>
      )}

      {done.docs.length > 0 && (
        <section aria-labelledby="repondus">
          <h2 id="repondus">Répondus</h2>
          {done.docs.map((r) => (
            <details className="card" key={r.id}>
              <summary>
                {stars(r.rating)} {r.author} · répondu {r.repliedAt ? shortDay(localParts(r.repliedAt).iso) : ''}
              </summary>
              {r.text && <p className="meta">« {r.text} »</p>}
              <p>{r.reply}</p>
            </details>
          ))}
        </section>
      )}
      <p className="meta">Une demande d’avis par commande, à tout le monde, sans cadeau ni filtre. Jamais de chiffres par employé.</p>
    </>
  )
}
