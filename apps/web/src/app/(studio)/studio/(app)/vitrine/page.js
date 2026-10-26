import { studioPage } from '@/lib/studio/guard'
import { localParts, addDays, longDay, clockOf } from '@/lib/studio/time'
import { ordersOn } from '@/lib/studio/orders'
import { vitrinePhotoOf, isSoldOut, backLabel, reservedToday, vitrineCaption, isIndefinite } from '@/lib/studio/vitrine'
import { effectiveAvailability } from '@/lib/ordering/lines'
import { ActionForm } from '@/components/studio/ActionForm'
import { PhotoCapture } from '@/components/studio/PhotoCapture'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Vitrine · Coco Studio' }

const BACK = '/vitrine/'

function imageOf(media) {
  const s = media?.sizes?.card?.url ? media.sizes.card : media
  return s?.url ? { src: s.url, width: s.width || 640, height: s.height || 800 } : null
}

// Vitrine (16 §3.3): today's photo and what the site shows as available today. Sold-out lasts « pour
// aujourd'hui » and comes back at the next opening; « Plusieurs jours… » and, for the owner, « Jusqu'à nouvel ordre ».
export default async function Vitrine({ searchParams }) {
  const ctx = await studioPage('vitrine')
  const now = new Date()
  const today = localParts(now).iso
  const [shop, photo, yesterday, orders, all] = await Promise.all([
    ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as }),
    vitrinePhotoOf(ctx.payload, today),
    vitrinePhotoOf(ctx.payload, addDays(today, -1)),
    ordersOn(ctx, today),
    ctx.payload.find({ collection: 'products', where: { and: [{ _status: { equals: 'published' } }, { availability: { not_equals: 'discontinued' } }] }, sort: 'title', limit: 200, depth: 0, locale: 'fr', ...ctx.as }),
  ])
  const products = all.docs
  const shown = products.filter((p) => p.vitrine)
  const others = products.filter((p) => !p.vitrine)
  const lastList = await ctx.payload.find({ collection: 'audit-log', where: { and: [{ entity: { equals: 'vitrine' } }, { entityId: { less_than: today } }, { undoneAt: { exists: false } }] }, sort: '-createdAt', limit: 1, depth: 0, overrideAccess: true })
  const yesterdayList = lastList.docs[0]?.after?.vitrine || null
  const differs = yesterdayList && JSON.stringify([...yesterdayList].map(String).sort()) !== JSON.stringify(shown.map((p) => String(p.id)).sort())
  const owner = ctx.can('product.soldoutIndefinite')
  const img = imageOf(photo)
  const old = !img ? imageOf(yesterday) : null

  return (
    <>
      <div className="st-head">
        <h1>Vitrine</h1>
        <span className="st-date">{longDay(today)}</span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />

      <section aria-labelledby="photo-titre" id="photo">
        <h2 id="photo-titre">Photo du jour</h2>
        <div className="card photo-day">
          {img ? (
            <>
              <img src={img.src} alt={photo.alt || vitrineCaption(today)} width={img.width} height={img.height} />
              <p className="meta">
                Sur le site depuis {clockOf(photo.takenAt)} · « {vitrineCaption(today)} »
              </p>
              {ctx.can('vitrine.photo') && <PhotoCapture back={BACK} replace />}
            </>
          ) : (
            <>
              {old && <img className="stale" src={old.src} alt={`Photo d’hier : ${yesterday.alt || ''}`} width={old.width} height={old.height} />}
              <p>Pas encore de photo aujourd’hui.</p>
              {ctx.can('vitrine.photo') && <PhotoCapture back={BACK} />}
            </>
          )}
          <p className="meta">Texte de remplacement écrit à partir de ce qui est visible, jamais par l’IA.</p>
        </div>
      </section>

      <section aria-labelledby="disponible-titre" id="disponible">
        <div className="card-head">
          <h2 id="disponible-titre">Disponible aujourd’hui</h2>
          {yesterdayList && differs && ctx.can('vitrine.copyYesterday') && (
            <ActionForm type="vitrine.copyYesterday" back={BACK}>
              <button className="btn" type="submit">
                Reprendre hier
              </button>
            </ActionForm>
          )}
        </div>
        {!shown.length && <p className="empty">Rien à la vitrine aujourd’hui.{yesterdayList ? ' « Reprendre hier » remet la vitrine d’hier.' : ''}</p>}
        <ul className="rows card" aria-label="Produits de la vitrine">
          {shown.map((p) => {
            const out = effectiveAvailability(p, shop, now) === 'soldout' && isSoldOut(p, now)
            const reserved = reservedToday(orders, p.id)
            const planned = typeof p.vitrinePlanned === 'number' && p.vitrinePlanned > 0 ? p.vitrinePlanned : null
            return (
              <li key={p.id} id={`produit-${p.id}`} style={{ flexWrap: 'wrap' }}>
                <span className="grow">
                  <strong>{p.title}</strong>
                  <small className="meta" style={{ display: 'block' }}>
                    {out ? (
                      <>
                        <span className="tag" data-tone="bad">
                          × Épuisé
                        </span>{' '}
                        {backLabel(p.soldOutUntil, now)}
                      </>
                    ) : (
                      [planned && `${planned} prévus`, `${reserved} ${reserved > 1 ? 'réservés' : 'réservé'}`].filter(Boolean).join(' · ')
                    )}
                  </small>
                </span>
                {out ? (
                  <ActionForm type="product.restock" fields={{ productId: p.id }} back={BACK} pending={`${p.title} : remise en vente…`}>
                    <button className="btn" type="submit" aria-label={`Remettre en vente : ${p.title}`}>
                      Remettre
                    </button>
                  </ActionForm>
                ) : (
                  <ActionForm type="product.soldout" fields={{ productId: p.id }} back={BACK} pending={`${p.title} : épuisé…`}>
                    <button className="btn" type="submit" aria-label={`Épuisé : ${p.title}`}>
                      Épuisé
                    </button>
                  </ActionForm>
                )}
                <details style={{ flex: '1 1 100%' }}>
                  <summary className="btn btn-text">{out ? 'Changer la durée' : 'Plus'}</summary>
                  <div className="sheet-body">
                    <ActionForm type="product.soldoutDays" fields={{ productId: p.id }} back={BACK} className="btn-row">
                      <label htmlFor={`jours-${p.id}`}>Épuisé plusieurs jours, jusqu’au</label>
                      <input id={`jours-${p.id}`} name="date" type="date" min={today} max={addDays(today, 60)} defaultValue={addDays(today, 1)} required style={{ inlineSize: '11rem' }} />
                      <button className="btn" type="submit">
                        Plusieurs jours…
                      </button>
                    </ActionForm>
                    {owner && !isIndefinite(p.soldOutUntil) && (
                      <ActionForm type="product.soldoutIndefinite" fields={{ productId: p.id }} back={BACK}>
                        <button className="btn" type="submit">
                          Jusqu’à nouvel ordre
                        </button>
                      </ActionForm>
                    )}
                    <ActionForm type="vitrine.remove" fields={{ productId: p.id }} back={BACK}>
                      <button className="btn btn-text" type="submit">
                        Retirer de la vitrine
                      </button>
                    </ActionForm>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
        {others.length > 0 && ctx.can('vitrine.add') && (
          <ActionForm type="vitrine.add" back={BACK} className="card btn-row">
            <label htmlFor="ajouter" className="sr-only">
              Produit à ajouter
            </label>
            <select id="ajouter" name="productId" required defaultValue="" style={{ flex: '1 1 12rem' }}>
              <option value="" disabled>
                Choisir un produit…
              </option>
              {others.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <button className="btn" type="submit">
              + Ajouter à la vitrine
            </button>
          </ActionForm>
        )}
        <p className="meta">Épuisé = « Épuisé aujourd’hui » sur le site et dans ses données (SoldOut), remis en vente tout seul à la prochaine ouverture. Retirer un produit de la carte se fait dans Produits.</p>
      </section>
    </>
  )
}
