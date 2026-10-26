import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { capacityOn } from '@/lib/ordering'
import { senderFacts } from '@/lib/messaging/templates'
import { localParts, addDays, shortDay, longDay, dayOf, dayBounds } from '@/lib/studio/time'
import { answerTimer, customerName, money, whenFr } from '@/lib/studio/format'
import { declineText, otherDateText } from '@/lib/studio/requests'
import { PRODUCTION_CATEGORIES } from '@/collections/Catalog'
import { marker } from '@/lib/facts'
import { LangBadge } from '@/components/studio/OrderCard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Demandes · Coco Studio' }

const BACK = '/demandes/'
const CAT = Object.fromEntries(PRODUCTION_CATEGORIES.map((c) => [c.value, c.label.toLowerCase()]))

function Photos({ photos = [] }) {
  const list = photos.filter((p) => p && typeof p === 'object')
  if (!list.length) return null
  return (
    <div className="thumbs">
      {list.map((p) => {
        const t = p.sizes?.thumb
        return (
          <a key={p.id} href={p.url} target="_blank" rel="noopener">
            <img src={t?.url || p.url} alt={p.alt || 'Photo d’inspiration du client'} width={t?.width || p.width || 96} height={t?.height || p.height || 96} loading="lazy" />
          </a>
        )
      })}
    </div>
  )
}

// Demandes (16 §3.4): request → price → deposit link, with the 24 h timer, the day's capacity and the photos.
export default async function Demandes({ searchParams }) {
  const ctx = await studioPage('demandes')
  const now = new Date()
  const today = localParts(now).iso
  const open = (await ctx.payload.find({ collection: 'requests', where: { status: { in: ['new', 'quoted'] } }, sort: 'answerBy', limit: 50, depth: 1, ...ctx.as })).docs
  const recent = (await ctx.payload.find({ collection: 'requests', where: { and: [{ status: { in: ['deposit_paid', 'confirmed', 'expired', 'declined'] } }, { updatedAt: { greater_than_equal: dayBounds(addDays(today, -7)).from } }] }, sort: '-updatedAt', limit: 10, depth: 0, ...ctx.as })).docs
  const business = await ctx.payload.findGlobal({ slug: 'business', locale: 'fr', depth: 0, ...ctx.as })
  const phone = senderFacts(business).phone
  const caps = await Promise.all(open.map((r) => capacityOn(ctx.payload, { date: dayOf(r.eventDate), category: r.productionCategory || 'gateaux', now })))
  const waiting = open.filter((r) => r.status === 'new').length

  return (
    <>
      <div className="st-head">
        <h1>Demandes</h1>
        <span className="st-date">{waiting ? `${waiting} en attente` : 'à jour'}</span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />
      {!open.length && <p className="empty">Aucune demande en attente.</p>}
      {open.map((r, i) => {
        const day = dayOf(r.eventDate)
        const t = r.status === 'new' && r.answerBy ? answerTimer(r.answerBy, now) : null
        const cap = caps[i]
        const full = cap.limit !== null && cap.used >= cap.limit
        const proposed = (r.timeline || []).filter((x) => /^Autre date proposée/.test(x.note || '')).pop()
        return (
          <article className="card" id={`demande-${r.id}`} key={r.id} data-tone={t?.overdue ? 'bad' : t?.urgent ? 'warn' : undefined} aria-labelledby={`demande-titre-${r.id}`}>
            {t && (
              <p>
                <span className="tag" data-tone={t.overdue ? 'bad' : t.urgent ? 'warn' : undefined}>
                  <span aria-hidden="true">⏱</span> {t.overdue ? `${t.text} · répondre maintenant` : t.text}
                </span>
              </p>
            )}
            <div className="card-head">
              <h3 id={`demande-titre-${r.id}`}>
                {r.occasion}
                {r.guests ? ` · ${r.guests} pers.` : ''} · {shortDay(day)}
              </h3>
              <LangBadge language={r.customer?.language} />
            </div>
            <p className="meta">{customerName(r.customer)}</p>
            {r.flavour && <p>{r.flavour}</p>}
            {r.cakeMessage && <p>Message : « {r.cakeMessage} »</p>}
            {r.details && <p className="meta">{r.details}</p>}
            <Photos photos={r.photos || []} />
            {r.hasAllergy && (
              <div className="st-banner" data-tone="warn">
                <span>
                  <span aria-hidden="true">⚠</span> Demande avec allergie : à traiter par téléphone
                </span>
              </div>
            )}
            <p className="meta">
              {cap.limit === null
                ? `Capacité du ${shortDay(day)} : ${marker(`capacité ${CAT[cap.category] || cap.category} par jour`)}`
                : full
                  ? `Le ${shortDay(day)} est complet (${cap.used}/${cap.limit} ${CAT[cap.category] || ''})`
                  : `Capacité du ${shortDay(day)} : ${cap.used}/${cap.limit} ${CAT[cap.category] || ''}`}
            </p>
            {r.status === 'quoted' ? (
              <p className="tag" data-tone="ok">
                ✓ Soumission envoyée · {money(r.quote?.totalCents)} · expire {r.quote?.validUntil ? whenFr(r.quote.validUntil, now) : '—'} · place réservée provisoirement
              </p>
            ) : proposed ? (
              <p className="tag">Réponse envoyée · {proposed.note}</p>
            ) : null}
            <div className="actions">
              {r.status === 'new' && !full && (
                <Link className="btn btn-primary" href={`/demandes/${r.id}/`}>
                  Chiffrer et envoyer
                </Link>
              )}
              <div className="btn-row">
                {r.status === 'new' && (
                  <details className="sheet" style={{ flex: '1 1 100%' }} open={full || undefined}>
                    <summary className="btn">{full ? 'Proposer une autre date' : 'Autre date'}</summary>
                    <ActionForm type="request.otherDate" fields={{ requestId: r.id }} back={BACK} needsNetwork className="sheet-body">
                      <div className="field">
                        <label htmlFor={`alt-${r.id}`}>Date à proposer</label>
                        <input id={`alt-${r.id}`} name="date" type="date" min={today} defaultValue={addDays(day, 7)} required />
                      </div>
                      <div className="field">
                        <label htmlFor={`alt-msg-${r.id}`}>Message (modifiable)</label>
                        <textarea id={`alt-msg-${r.id}`} name="message" defaultValue={otherDateText(r.customer?.language, { date: day, alt: addDays(day, 7), phone })} required />
                        <span className="hint">Envoyé par {r.customer?.email ? 'courriel' : 'texto'}. Vérifiez la date dans le texte.</span>
                      </div>
                      <button className="btn btn-primary" type="submit">
                        Envoyer la proposition
                      </button>
                    </ActionForm>
                  </details>
                )}
                <details className="sheet" style={{ flex: '1 1 100%' }}>
                  <summary className="btn">Refuser</summary>
                  <ActionForm type="request.decline" fields={{ requestId: r.id }} back={BACK} needsNetwork className="sheet-body">
                    <div className="field">
                      <label htmlFor={`no-${r.id}`}>Réponse (modifiable)</label>
                      <textarea id={`no-${r.id}`} name="message" defaultValue={declineText(r.customer?.language, { date: day })} required />
                    </div>
                    <button className="btn" type="submit">
                      Envoyer le refus
                    </button>
                  </ActionForm>
                </details>
                {r.customer?.phone && (
                  <a className="btn" href={`tel:${r.customer.phone}`}>
                    Appeler
                  </a>
                )}
              </div>
            </div>
          </article>
        )
      })}

      {recent.length > 0 && (
        <section aria-labelledby="recentes">
          <h2 id="recentes">Cette semaine</h2>
          <ul className="rows card">
            {recent.map((r) => (
              <li key={r.id}>
                <span className="grow">
                  {r.occasion} · {shortDay(dayOf(r.eventDate))} · {customerName(r.customer)}
                </span>
                <span className="meta">
                  {{ deposit_paid: `Acompte reçu · ajoutée aux commandes du ${shortDay(dayOf(r.eventDate))}`, confirmed: 'Confirmée', expired: 'Expirée · place libérée', declined: 'Refusée' }[r.status]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="meta">Délai promis aux clients : réponse en 24 h ({longDay(today)}).</p>
    </>
  )
}
