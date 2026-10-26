import { ActionForm } from './ActionForm'
import { statusOf, paymentLine, customerName, languageBadge, windowLabel, money } from '@/lib/studio/format'
import { pickupState, forwardAction, itemsLine } from '@/lib/studio/orders'
import { clockFr } from '@/lib/studio/time'

const LANG_NAMES = { FR: 'français', EN: 'anglais', ES: 'espagnol' }

export function StatusTag({ status }) {
  const s = statusOf(status)
  return (
    <span className="tag" data-tone={s.tone === 'ok' || s.tone === 'done' ? 'ok' : s.tone === 'bad' ? 'bad' : s.tone === 'warn' ? 'warn' : undefined}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  )
}

export function LangBadge({ language }) {
  const b = languageBadge(language)
  return (
    <span className="lang" title={`Langue : ${LANG_NAMES[b]}`}>
      <span aria-hidden="true">{b}</span>
      <span className="sr-only">Langue : {LANG_NAMES[b]}</span>
    </span>
  )
}

// « Remettre la commande »: the customer's 4-digit code, or « Client reconnu » (16 §3.2 hand-over).
export function Handover({ order, back }) {
  const balance = order.totals?.balanceCents > 0 ? order.totals.balanceCents : 0
  return (
    <details className="sheet">
      <summary className="btn btn-primary">Remettre la commande</summary>
      <div className="sheet-body">
        {balance > 0 && (
          <p>
            <strong>Solde à encaisser au comptoir : {money(balance)}</strong>
          </p>
        )}
        <ActionForm type="order.pickup" fields={{ orderId: order.id }} back={back} pending={`Commande ${order.number} : remise…`}>
          <div className="field">
            <label htmlFor={`code-${order.id}`}>Code du client</label>
            <input id={`code-${order.id}`} name="code" className="code" type="text" inputMode="numeric" pattern="\d{4}" maxLength={4} autoComplete="off" />
          </div>
          <button className="btn btn-primary" type="submit">
            {balance > 0 ? 'Solde encaissé · valider le code' : 'Valider le code'}
          </button>
        </ActionForm>
        <ActionForm type="order.pickup" fields={{ orderId: order.id, recognized: 'true' }} back={back} pending={`Commande ${order.number} : remise…`}>
          <button className="btn" type="submit" style={{ inlineSize: '100%' }}>
            Client reconnu{balance > 0 ? ' · solde encaissé' : ''}
          </button>
        </ActionForm>
      </div>
    </details>
  )
}

export function ForwardButton({ order, back }) {
  const next = forwardAction(order)
  if (next === 'ready') {
    return (
      <ActionForm type="order.ready" fields={{ orderId: order.id }} back={back} pending={`Commande ${order.number} prête…`}>
        <button className="btn btn-primary" type="submit">
          Marquer prête
        </button>
      </ActionForm>
    )
  }
  if (next === 'pickup') return <Handover order={order} back={back} />
  return null
}

// One pickup on Aujourd'hui / Commandes: time, name, number, language, what, status, payment, one forward button.
export function OrderCard({ order, now = new Date(), back = '/', showDay = null, forward = true }) {
  const ps = pickupState(order, now)
  const allergy = Boolean(order.allergyNote || order.hasAllergy)
  return (
    <article className="card" data-tone={ps.late ? 'bad' : ps.dueSoon ? 'warn' : undefined} aria-labelledby={`commande-${order.id}`}>
      <div className="card-head">
        <h3 id={`commande-${order.id}`}>
          <span className="when">
            {showDay ? `${showDay} · ` : ''}
            {windowLabel(order)}
          </span>{' '}
          <a href={`/commandes/${order.id}/`}>
            {order.customer ? `${customerName(order.customer)} · ` : ''}
            {order.number}
          </a>
        </h3>
        <LangBadge language={order.locale || order.customer?.language} />
      </div>
      <p>{itemsLine(order)}</p>
      <p className="meta">
        <StatusTag status={order.status} /> · {paymentLine(order)}
      </p>
      {(ps.late || ps.dueSoon || allergy) && (
        <p className="btn-row">
          {ps.late && (
            <span className="tag" data-tone="bad">
              <span aria-hidden="true">!</span> En retard · prévue à {clockFr(order.pickupWindowStart)}
            </span>
          )}
          {ps.dueSoon && (
            <span className="tag" data-tone="warn">
              <span aria-hidden="true">◷</span> {ps.minutesTo > 0 ? `Dans ${ps.minutesTo} min` : 'Maintenant'} · pas prête
            </span>
          )}
          {allergy && (
            <span className="tag" data-tone="warn">
              <span aria-hidden="true">⚠</span> Allergie signalée · voir la note
            </span>
          )}
        </p>
      )}
      {forward && (
        <div className="actions">
          <ForwardButton order={order} back={back} />
        </div>
      )}
    </article>
  )
}
