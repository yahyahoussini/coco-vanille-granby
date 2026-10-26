import { studioPage } from '@/lib/studio/guard'
import { longDay, localParts } from '@/lib/studio/time'
import { ordersOn, sortPickups, pickupSummary } from '@/lib/studio/orders'
import { todoCards } from '@/lib/studio/todo'
import { statusLine, shopBanners } from '@/lib/studio/shop'
import { vitrinePhotoOf } from '@/lib/studio/vitrine'
import { OrderCard } from '@/components/studio/OrderCard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { LiveRefresh } from '@/components/studio/LiveRefresh'

export const metadata = { title: 'Aujourd’hui · Coco Studio' }

// Aujourd'hui (16 §3.1): status line → Boutique & heures, search, 3 quick actions, ≤ 3 « À faire » cards,
// today's pickups by time with one forward button each.
export default async function Aujourdhui({ searchParams }) {
  const ctx = await studioPage('aujourdhui')
  const now = new Date()
  const today = localParts(now).iso
  const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
  const orders = sortPickups(await ordersOn(ctx, today), now)
  const photo = await vitrinePhotoOf(ctx.payload, today).catch(() => null)
  const cards = await todoCards(ctx, { now, shop, todayOrders: orders, photoToday: photo })
  const summary = pickupSummary(orders, now)
  const line = statusLine(shop, now)
  const banners = shopBanners(shop, now)
  const open = orders.filter((o) => o.status !== 'picked_up')
  const done = orders.filter((o) => o.status === 'picked_up')

  return (
    <>
      <div className="st-head">
        <h1>Aujourd’hui</h1>
        <span className="st-date">{longDay(today)}</span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back="/" />
      <LiveRefresh />

      <a className="st-status" href="/boutique/">
        <span>
          <span aria-hidden="true">{line.icon}</span> {line.text}
          <small>{summary.total ? summary.text : 'Aucune cueillette aujourd’hui'}</small>
        </span>
        <span aria-hidden="true">›</span>
      </a>
      {banners.map((b) => (
        <div className="st-banner" data-tone={b.tone} key={b.key} role="status">
          <span>{b.text}</span>
          {ctx.can(b.action) && (
            <ActionForm type={b.action} back="/" needsNetwork>
              <button className="btn" type="submit">
                {b.label}
              </button>
            </ActionForm>
          )}
        </div>
      ))}

      <form method="get" action="/commandes/" role="search" className="field" style={{ marginBlockStart: '0.75rem' }}>
        <label htmlFor="recherche" className="sr-only">
          Rechercher une commande
        </label>
        <input id="recherche" name="q" type="search" placeholder="Rechercher une commande, un nom, un téléphone…" autoComplete="off" enterKeyHint="search" />
      </form>

      <nav className="quick" aria-label="Actions rapides">
        <a className="btn" href="/vitrine/#disponible">
          <span aria-hidden="true">⊘</span> Épuisé
        </a>
        <a className="btn" href="/vitrine/#photo">
          <span aria-hidden="true">◘</span> Photo vitrine
        </a>
        <a className="btn" href="/commandes/telephone/">
          <span aria-hidden="true">☏</span> Tél.
        </a>
      </nav>

      {cards.length > 0 && (
        <section aria-labelledby="a-faire">
          <h2 id="a-faire">
            À faire <span className="badge">{cards.length}</span>
          </h2>
          {cards.map((c) => (
            <div className="card" data-tone={c.tone} key={c.key}>
              <div className="card-head">
                <h3>{c.title}</h3>
                <a className="btn" href={c.href}>
                  {c.action}
                </a>
              </div>
              {c.why && <p className="meta">{c.why}</p>}
            </div>
          ))}
        </section>
      )}

      <section aria-labelledby="cueillettes">
        <h2 id="cueillettes">Cueillettes</h2>
        {!open.length && !done.length && <p className="empty">Aucune cueillette aujourd’hui. Les nouvelles commandes arrivent ici.</p>}
        {open.map((o) => (
          <OrderCard key={o.id} order={o} now={now} back="/" />
        ))}
        {done.length > 0 && (
          <details className="card">
            <summary className="btn btn-text">Récupérées ({done.length})</summary>
            {done.map((o) => (
              <OrderCard key={o.id} order={o} now={now} back="/" forward={false} />
            ))}
          </details>
        )}
      </section>
    </>
  )
}
