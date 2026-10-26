import Link from 'next/link'
import { studioPage, firstParam } from '@/lib/studio/guard'
import { localParts, addDays, shortDay, longDay, clockOf } from '@/lib/studio/time'
import { ordersOn, ordersBetween, searchOrders, sortPickups, pickupSummary, productionList, productionChanges, itemsLine } from '@/lib/studio/orders'
import { customerName, windowLabel } from '@/lib/studio/format'
import { PRODUCTION_CATEGORIES } from '@/collections/Catalog'
import { OrderCard } from '@/components/studio/OrderCard'
import { ActionForm } from '@/components/studio/ActionForm'
import { BulkSubmit } from '@/components/studio/Bulk'
import { PrintButton } from '@/components/studio/PrintButton'
import { Flash } from '@/components/studio/Flash'
import { LiveRefresh } from '@/components/studio/LiveRefresh'

export const metadata = { title: 'Commandes · Coco Studio' }

const TABS = [
  ['aujourdhui', 'Aujourd’hui'],
  ['demain', 'Demain'],
  ['avenir', 'À venir'],
  ['production', 'Production'],
]
const LABELS = Object.fromEntries(PRODUCTION_CATEGORIES.map((c) => [c.value, c.label]))

// Commandes (16 §3.2): the one queue for web and phone orders. Tabs, search, bulk « prête », production list.
export default async function Commandes({ searchParams }) {
  const ctx = await studioPage('commandes')
  const q = (await searchParams) || {}
  const now = new Date()
  const today = localParts(now).iso
  const tab = TABS.some(([k]) => k === firstParam(q.onglet)) ? firstParam(q.onglet) : 'aujourdhui'
  const search = String(firstParam(q.q) || '').trim()
  const selecting = firstParam(q.selection) === '1'
  const countsOnly = ctx.user.role === 'agence'
  const back = `/commandes/?onglet=${tab}`

  const head = (
    <>
      <div className="st-head">
        <h1>Commandes</h1>
        <span className="st-date">{shortDay(today)}</span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={back} />
      <LiveRefresh />
    </>
  )

  if (countsOnly) {
    const [t, d, later] = await Promise.all([ordersOn(ctx, today), ordersOn(ctx, addDays(today, 1)), ordersBetween(ctx, addDays(today, 2), addDays(today, 30))])
    return (
      <>
        {head}
        <p className="st-lead">Vue Agence : des chiffres seulement, sans noms ni téléphones.</p>
        <ul className="numbers card">
          <li>
            <span>Aujourd’hui</span> <strong>{t.length}</strong>
          </li>
          <li>
            <span>Demain</span> <strong>{d.length}</strong>
          </li>
          <li>
            <span>30 prochains jours</span> <strong>{later.length}</strong>
          </li>
        </ul>
      </>
    )
  }

  let body
  if (search) {
    const found = await searchOrders(ctx, search, { now })
    body = (
      <section aria-labelledby="resultats">
        <h2 id="resultats">Résultats pour « {search} »</h2>
        {found.length ? found.map((o) => <OrderCard key={o.id} order={o} now={now} back={`/commandes/?q=${encodeURIComponent(search)}`} showDay={shortDay(o.pickupDate)} />) : <p className="empty">Aucune commande trouvée. Essayez le numéro, le prénom ou les 4 derniers chiffres du téléphone.</p>}
      </section>
    )
  } else if (tab === 'production') {
    const day = /^\d{4}-\d{2}-\d{2}$/.test(firstParam(q.jour) || '') ? firstParam(q.jour) : addDays(today, 1)
    const orders = await ordersBetween(ctx, addDays(day, -1), addDays(day, 7), { statuses: ['paid', 'ready'] })
    const list = productionList(orders, day, { categoryLabels: LABELS })
    const printed = await ctx.payload.find({ collection: 'audit-log', where: { and: [{ action: { equals: 'production.print' } }, { entityId: { equals: day } }] }, sort: '-createdAt', limit: 1, depth: 0, overrideAccess: true })
    const last = printed.docs[0] || null
    const changes = last ? productionChanges(last.after?.list || [], list) : []
    body = (
      <section aria-labelledby="production">
        <h2 id="production">
          Production · {shortDay(day)}
        </h2>
        <nav className="choices no-print" aria-label="Jour de production">
          {[today, addDays(today, 1), addDays(today, 2)].map((d) => (
            <Link key={d} className="btn" href={`/commandes/?onglet=production&jour=${d}`} aria-current={d === day ? 'page' : undefined}>
              {d === today ? 'Aujourd’hui' : d === addDays(today, 1) ? 'Demain' : shortDay(d)}
            </Link>
          ))}
        </nav>
        <p className="meta">
          {last ? `Imprimée à ${clockOf(last.createdAt)}${changes.length ? ` · ${changes.length} ${changes.length > 1 ? 'changements' : 'changement'} depuis` : ' · aucun changement depuis'}` : 'Pas encore imprimée.'}
        </p>
        {changes.length > 0 && (
          <div className="st-banner" data-tone="warn" role="status">
            <span>
              Modifié après impression :{' '}
              {changes.map((c) => `${c.diff > 0 ? '+' : ''}${c.diff} ${c.title}${c.orders.length ? ` (${c.orders.join(', ')})` : ''}`).join(' · ')}
            </span>
          </div>
        )}
        <p className="print-only">Production du {longDay(day)} · Pâtisserie Coco Vanille</p>
        {list.length ? (
          list.map((g) => (
            <div className="card" key={g.category}>
              <div className="card-head">
                <h3>{g.label}</h3>
                <strong>{g.total}</strong>
              </div>
              <ul className="rows">
                {g.rows.map((r) => (
                  <li key={`${r.title}|${r.variantLabel}`}>
                    <span className="grow">
                      {r.title}
                      {r.variantLabel ? ` · ${r.variantLabel}` : ''}
                      {r.messages.map((m) => (
                        <small key={m.number} className="meta" style={{ display: 'block' }}>
                          « {m.text} » ({m.number})
                        </small>
                      ))}
                    </span>
                    <strong>{r.qty}</strong>
                    <span className="meta">
                      {r.orders.join(' ')}
                      {r.allergy ? ' ⚠' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="empty">Rien à produire ce jour-là pour l’instant.</p>
        )}
        <ActionForm type="production.print" fields={{ date: day, snapshot: JSON.stringify(list) }} back={`/commandes/?onglet=production&jour=${day}`} className="no-print">
          <PrintButton />
        </ActionForm>
        <p className="meta no-print">⚠ = allergie signalée : voir la commande. « Imprimer » ouvre aussi l’enregistrement en PDF du navigateur.</p>
      </section>
    )
  } else {
    const days = tab === 'aujourdhui' ? [today, today] : tab === 'demain' ? [addDays(today, 1), addDays(today, 1)] : [addDays(today, 2), addDays(today, 30)]
    const orders = sortPickups(tab === 'avenir' ? await ordersBetween(ctx, days[0], days[1]) : await ordersOn(ctx, days[0]), now)
    const summary = pickupSummary(orders, now)
    const paid = orders.filter((o) => o.status === 'paid')
    const empty = { aujourdhui: 'Aucune commande pour aujourd’hui pour l’instant.', demain: 'Aucune commande pour demain pour l’instant.', avenir: 'Aucune commande à venir pour l’instant.' }[tab]
    body = (
      <section aria-labelledby="liste">
        <h2 id="liste">{summary.total ? summary.text : 'Commandes'}</h2>
        {!orders.length && <p className="empty">{empty}</p>}
        {selecting && paid.length > 0 ? (
          <ActionForm type="order.bulkReady" back={back} pending="Commandes prêtes…">
            {paid.map((o) => (
              <label className="card check" key={o.id}>
                <input type="checkbox" name="orderIds[]" value={o.id} />
                <span>
                  <strong>
                    {windowLabel(o)} · {customerName(o.customer)} · {o.number}
                  </strong>
                  <span className="meta" style={{ display: 'block' }}>
                    {itemsLine(o)}
                  </span>
                </span>
              </label>
            ))}
            <div className="savebar">
              <BulkSubmit />
              <Link className="btn btn-text" href={back}>
                Annuler la sélection
              </Link>
            </div>
          </ActionForm>
        ) : (
          <>
            {paid.length > 1 && (
              <p>
                <Link className="btn" href={`${back}&selection=1`}>
                  Sélectionner
                </Link>
              </p>
            )}
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} now={now} back={back} showDay={tab === 'avenir' ? shortDay(o.pickupDate) : null} forward={o.status !== 'picked_up'} />
            ))}
          </>
        )}
      </section>
    )
  }

  return (
    <>
      {head}
      <form method="get" action="/commandes/" role="search" className="field no-print">
        <label htmlFor="recherche-commandes" className="sr-only">
          Rechercher une commande
        </label>
        <input id="recherche-commandes" name="q" type="search" defaultValue={search} placeholder="Numéro, nom ou téléphone…" autoComplete="off" enterKeyHint="search" />
      </form>
      <p className="no-print">
        <Link className="btn btn-primary" href="/commandes/telephone/">
          + Commande téléphone
        </Link>
      </p>
      <nav className="st-subtabs no-print" aria-label="Onglets des commandes">
        {TABS.map(([k, label]) => (
          <Link key={k} href={`/commandes/?onglet=${k}`} aria-current={!search && k === tab ? 'page' : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      {body}
    </>
  )
}

