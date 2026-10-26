import { studioPage } from '@/lib/studio/guard'
import { shortDay } from '@/lib/studio/time'
import { weekBounds, fiveNumbers, weekCards, systemTile } from '@/lib/studio/week'

export const metadata = { title: 'Cette semaine · Coco Studio' }

// Cette semaine (16 §4.2): 5 numbers, at most 3 cards, the Système tile. The presence score waits for
// 4 weekly baselines (16 §4.6).
export default async function Semaine() {
  const ctx = await studioPage('semaine')
  const now = new Date()
  const w = weekBounds(now)
  const range = (from, to, field = 'createdAt') => ({ and: [{ [field]: { greater_than_equal: from.toISOString() } }, { [field]: { less_than: to.toISOString() } }] })
  const [orders, prevOrders, requests, reviews, shop, products, pools, system] = await Promise.all([
    ctx.payload.find({ collection: 'orders', where: range(w.from, w.to), limit: 1000, depth: 0, ...ctx.as, select: { source: true, status: true, totals: true } }),
    ctx.payload.find({ collection: 'orders', where: range(w.prevFrom, w.from), limit: 1000, depth: 0, ...ctx.as, select: { source: true, status: true, totals: true } }),
    ['proprietaire', 'gerant'].includes(ctx.user.role) ? ctx.payload.find({ collection: 'requests', where: range(w.from, w.to), limit: 500, depth: 0, ...ctx.as, select: { status: true } }) : { docs: [] },
    ctx.payload.find({ collection: 'reviews', where: range(w.from, w.to, 'receivedAt'), limit: 500, depth: 0, ...ctx.as }),
    ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as }),
    ctx.payload.find({ collection: 'products', limit: 200, depth: 0, locale: 'fr', ...ctx.as, select: { title: true, variants: true, _status: true } }),
    ctx.payload.find({ collection: 'capacity-pools', limit: 20, depth: 0, ...ctx.as }),
    systemTile(ctx.payload, { now }),
  ])
  const numbers = fiveNumbers({ orders: orders.docs, prevOrders: prevOrders.docs, requests: requests.docs, reviews: reviews.docs })
  const cards = weekCards({ shop, products: products.docs, pools: pools.docs, now })
  const readOnly = ctx.user.role === 'gerant'
  return (
    <>
      <div className="st-head">
        <h1>Cette semaine</h1>
        <span className="st-date">
          {shortDay(w.monday)} – {shortDay(w.sunday)}
        </span>
      </div>
      <div className="card">
        <p>
          <strong>Score de présence</strong>
        </p>
        <p className="meta">Il s’affiche après 4 semaines de mesure (Avis, Faits, Recherche, Carte, Réponses, Fraîcheur, Technique).</p>
      </div>

      <section aria-labelledby="chiffres">
        <h2 id="chiffres">5 chiffres</h2>
        <ul className="numbers card">
          {numbers.map((n) => (
            <li key={n.key}>
              <span>{n.label}</span>
              <strong className={n.muted ? 'meta' : undefined}>{n.value}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="actions-semaine">
        <h2 id="actions-semaine">À faire (3 au plus)</h2>
        {!cards.length && <p className="empty">Rien à faire cette semaine.</p>}
        {cards.map((c, i) => (
          <div className="card" key={c.key}>
            <div className="card-head">
              <h3>
                {i + 1} · {c.title}
              </h3>
              {!readOnly && (
                <a className="btn" href={c.href}>
                  {c.action}
                </a>
              )}
            </div>
            <p className="meta">{c.why}</p>
          </div>
        ))}
      </section>

      <div className="st-banner" data-tone={system.tone} role="status">
        <span>{system.text}</span>
      </div>
      <p className="meta">Le courriel du lundi reprend ces 5 chiffres et ces cartes. Jamais de chiffres par employé.</p>
    </>
  )
}
