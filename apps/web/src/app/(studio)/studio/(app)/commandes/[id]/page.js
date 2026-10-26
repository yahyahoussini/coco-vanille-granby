import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studioPage, firstParam } from '@/lib/studio/guard'
import { redactOrder } from '@/lib/studio/roles'
import { longDay, shortDay, clockOf, dayOf, addDays, localParts } from '@/lib/studio/time'
import { money, paymentLine, customerName, windowRange, statusOf } from '@/lib/studio/format'
import { ForwardButton, LangBadge, StatusTag } from '@/components/studio/OrderCard'
import { ActionForm } from '@/components/studio/ActionForm'
import { PrintButton } from '@/components/studio/PrintButton'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Commande · Coco Studio' }

const STEPS = ['paid', 'ready', 'picked_up']

// Order detail (16 §3.2): who, when, code, what, allergy note (here only, G16), payment, status steps,
// one forward button; under « ⋯ »: label, another slot, cancel and refund (owner) with an effects preview.
export default async function Commande({ params, searchParams }) {
  const ctx = await studioPage('commandes')
  if (ctx.user.role === 'agence') notFound()
  const { id } = await params
  const q = (await searchParams) || {}
  const raw = await ctx.payload.findByID({ collection: 'orders', id, depth: 0, ...ctx.as, disableErrors: true }).catch(() => null)
  if (!raw) notFound()
  const order = redactOrder(raw, ctx.user)
  const now = new Date()
  const back = `/commandes/${order.id}/`
  const day = dayOf(order.pickupDate)
  const step = STEPS.indexOf(order.status)
  const cancelling = firstParam(q.annuler) === '1' && ctx.can('order.cancel')
  const refunding = firstParam(q.rembourser) === '1' && ctx.can('order.refund')
  const p = order.payment || {}
  const paidCents = p.kind === 'deposit' ? order.totals?.depositCents || p.amountCents : p.amountCents || order.totals?.totalCents
  const refundDue = p.refundDueBy && p.status !== 'refunded' ? new Date(p.refundDueBy) : null
  const refundLate = refundDue && refundDue.getTime() - now.getTime() < 5 * 86400000
  const futureMessages = await ctx.payload.find({ collection: 'messages', where: { and: [{ order: { equals: order.id } }, { status: { in: ['queued', 'failed'] } }] }, limit: 10, depth: 0, overrideAccess: true })

  return (
    <>
      <p className="no-print">
        <Link href={`/commandes/?onglet=${day === localParts(now).iso ? 'aujourdhui' : day === addDays(localParts(now).iso, 1) ? 'demain' : 'avenir'}`}>‹ Commandes</Link>
      </p>
      <div className="st-head">
        <h1>Commande {order.number}</h1>
        <LangBadge language={order.locale || order.customer?.language} />
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={back} />

      <div className="card">
        <div className="card-head">
          <h2 style={{ margin: 0, textTransform: 'none', letterSpacing: 0, fontSize: '1.25rem', color: 'inherit' }}>{customerName(order.customer)}</h2>
          {order.customer?.phone && (
            <a className="btn no-print" href={`tel:${order.customer.phone}`}>
              Appeler
            </a>
          )}
        </div>
        <p>
          Cueillette {longDay(day)} · {windowRange(order)}
        </p>
        {order.pickupCode && (
          <p>
            Code : <strong style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.1em' }}>{order.pickupCode}</strong>
          </p>
        )}
        <p className="meta">
          {order.source === 'phone' ? 'Commande téléphone' : order.source === 'request' ? 'Gâteau sur demande' : 'Commande en ligne'}
        </p>
      </div>

      <div className="card">
        <ul className="rows">
          {(order.items || []).map((it, i) => (
            <li key={i}>
              <span className="grow">
                {it.qty} × {it.title}
                {it.variantLabel ? ` (${it.variantLabel})` : ''}
                {it.message && (
                  <small className="meta" style={{ display: 'block' }}>
                    Message : « {it.message} »
                  </small>
                )}
              </span>
              <span>{money(it.qty * it.unitPriceCents)}</span>
            </li>
          ))}
        </ul>
        {order.allergyNote && (
          <div className="st-banner" data-tone="warn">
            <span>
              <span aria-hidden="true">⚠</span> Allergie signalée : {order.allergyNote}
            </span>
          </div>
        )}
        <p>
          <strong>{paymentLine(order)}</strong>
        </p>
        {order.totals?.totalCents > 0 && (
          <p className="meta">
            Sous-total {money(order.totals.subtotalCents)} · TPS {money(order.totals.gstCents || 0)} · TVQ {money(order.totals.qstCents || 0)} · Total {money(order.totals.totalCents)}
          </p>
        )}
        {refundDue && (
          <p className="tag" data-tone={refundLate ? 'bad' : 'warn'}>
            Remboursement dû d’ici le {shortDay(localParts(refundDue).iso)}
          </p>
        )}
      </div>

      <div className="card">
        <ol className="btn-row" aria-label="Étapes" style={{ listStyle: 'none', padding: 0, margin: '0 0 0.75rem' }}>
          {STEPS.map((s, i) => (
            <li key={s} className="tag" data-tone={i <= step ? 'ok' : undefined} aria-current={i === step ? 'step' : undefined}>
              {i <= step ? '✓ ' : ''}
              {statusOf(s).label}
            </li>
          ))}
        </ol>
        {step < 0 && (
          <p>
            <StatusTag status={order.status} />
          </p>
        )}
        <ForwardButton order={order} back={back} />
        {futureMessages.docs.length > 0 && (
          <p className="meta">
            {futureMessages.docs.map((m) => `${m.status === 'failed' ? 'Texto non livré' : 'À envoyer'} : ${m.template.replace(/_/g, ' ')}${m.status === 'queued' && m.sendAfter ? ` (${clockOf(m.sendAfter)})` : ''}`).join(' · ')}
          </p>
        )}
      </div>

      {cancelling && (
        <div className="effects card" id="annuler">
          <h2 style={{ marginTop: 0 }}>Annuler la commande {order.number}</h2>
          <p>Ça va :</p>
          <ul>
            <li>annuler la commande et libérer sa place du {shortDay(day)}</li>
            <li>annuler les textos et courriels prévus</li>
            {p.status === 'paid' ? <li>lancer un délai de 15 jours pour rembourser {money(paidCents)}</li> : <li>aucun paiement à rembourser</li>}
          </ul>
          <ActionForm type="order.cancel" fields={{ orderId: order.id }} back={back} needsNetwork>
            <div className="field">
              <label htmlFor="raison-annulation">Raison (obligatoire)</label>
              <textarea id="raison-annulation" name="reason" required maxLength={300} />
            </div>
            <button className="btn btn-primary" type="submit">
              Annuler la commande
            </button>
          </ActionForm>
          <p>
            <Link href={back}>Garder la commande</Link>
          </p>
        </div>
      )}

      {refunding && (
        <div className="effects card" id="rembourser">
          <h2 style={{ marginTop: 0 }}>
            Rembourser {money(paidCents)} à {customerName(order.customer)}
          </h2>
          <p>
            <strong>Ça ne peut pas être annulé.</strong> {p.provider === 'stripe' ? 'Le remboursement part par Stripe sur la carte du client.' : p.provider === 'counter' ? 'À rendre au comptoir (caisse).' : 'Paiement de démonstration : remboursement simulé.'}
          </p>
          {!ctx.stepUp && <p className="meta">Studio vous demandera de confirmer que c’est vous.</p>}
          <ActionForm type="order.refund" fields={{ orderId: order.id }} back={`${back}?rembourser=1`} needsNetwork>
            <div className="field">
              <label htmlFor="raison-remboursement">Raison (obligatoire)</label>
              <textarea id="raison-remboursement" name="reason" required maxLength={300} />
            </div>
            <button className="btn btn-primary" type="submit">
              Rembourser {money(paidCents)}
            </button>
          </ActionForm>
          <p>
            <Link href={back}>Ne pas rembourser</Link>
          </p>
        </div>
      )}

      <details className="card no-print">
        <summary className="btn btn-text" aria-label="Plus d’actions">
          ⋯ Plus d’actions
        </summary>
        <div className="actions">
          <PrintButton label="Imprimer l’étiquette" submit={false} />
          {['paid', 'ready'].includes(order.status) && (
            <ActionForm type="order.otherSlot" fields={{ orderId: order.id }} back={back} needsNetwork>
              <button className="btn" type="submit" style={{ inlineSize: '100%' }}>
                Proposer un autre créneau
              </button>
            </ActionForm>
          )}
          {ctx.can('order.cancel') && ['pending_payment', 'paid', 'ready', 'not_picked_up'].includes(order.status) && (
            <Link className="btn btn-danger" href={`${back}?annuler=1#annuler`}>
              Annuler la commande
            </Link>
          )}
          {ctx.can('order.refund') && p.status === 'paid' && ['paid', 'ready', 'not_picked_up', 'cancelled'].includes(order.status) && (
            <Link className="btn btn-danger" href={`${back}?rembourser=1#rembourser`}>
              Rembourser
            </Link>
          )}
        </div>
      </details>

      {Array.isArray(order.timeline) && order.timeline.length > 0 && (
        <section aria-labelledby="historique" className="no-print">
          <h2 id="historique">Historique</h2>
          <ul className="rows card">
            {order.timeline
              .slice()
              .reverse()
              .map((t, i) => (
                <li key={i}>
                  <span className="grow">
                    {statusOf(t.status).label}
                    {t.note ? ` · ${t.note}` : ''}
                  </span>
                  <span className="meta">
                    {shortDay(localParts(t.at).iso)} {clockOf(t.at)}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}
    </>
  )
}
