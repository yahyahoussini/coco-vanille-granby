import Link from 'next/link'
import { studioPage, firstParam } from '@/lib/studio/guard'
import { money } from '@/lib/studio/format'
import { shortDay, localParts } from '@/lib/studio/time'
import { effectiveAvailability } from '@/lib/ordering/lines'
import { toGive } from '@/lib/facts'

export const metadata = { title: 'Produits · Coco Studio' }

const TAX = { pending: 'Taxe à choisir', zero: 'Détaxé', taxable: 'Taxable', rule: 'Règle des produits de boulangerie' }
const AVAIL = { instock: ['En vente', 'ok'], soldout: ['Épuisé', 'bad'], backorder: ['Saisonnier (de retour)', 'warn'], preorder: ['Nouveau (précommande)', 'warn'], discontinued: ['Retiré', 'bad'] }
const FAMILY = { gateaux: 'Gâteaux', viennoiseries: 'Viennoiseries', pains: 'Pains', patisseries: 'Pâtisseries', traiteur: 'Traiteur' }

const VIEWS = {
  tout: ['Tous', () => true],
  prix: ['Prix à vérifier', (p) => p.priceEstimated],
  allergenes: ['Allergènes à cocher', (p) => !p.allergensVerified?.at && p.availability !== 'discontinued'],
  retires: ['Retirés', (p) => p.availability === 'discontinued'],
}

// Plus › Produits (16 §8.1): the shop's list. Each product opens its formats and prices, words, photos, allergens and tax;
// the two views the owner works through after the launch: prices to check, allergens to tick.
export default async function Produits({ searchParams }) {
  const ctx = await studioPage('produits')
  const now = new Date()
  const sp = (await searchParams) || {}
  const view = VIEWS[firstParam(sp.vue)] ? firstParam(sp.vue) : 'tout'
  const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
  const res = await ctx.payload.find({ collection: 'products', sort: 'title', limit: 300, depth: 0, locale: 'fr', ...ctx.as })
  const count = (key) => res.docs.filter(VIEWS[key][1]).length
  const shown = res.docs.filter(VIEWS[view][1])
  return (
    <>
      <p>
        <Link href="/plus/">‹ Plus</Link>
      </p>
      <div className="st-head">
        <h1>Produits</h1>
        {ctx.can('product.create') && (
          <Link className="btn btn-primary" href="/plus/produits/nouveau/">
            Ajouter un produit
          </Link>
        )}
      </div>
      <nav className="btn-row" aria-label="Filtrer les produits" style={{ marginBlockEnd: '0.75rem' }}>
        {Object.entries(VIEWS).map(([key, [label]]) => (
          <Link key={key} className="btn" href={key === 'tout' ? '/plus/produits/' : `/plus/produits/?vue=${key}`} aria-current={view === key ? 'page' : undefined}>
            {label} ({count(key)})
          </Link>
        ))}
      </nav>
      {!shown.length && <p className="card empty">Rien à faire ici.</p>}
      {shown.map((p) => {
        const [label, tone] = AVAIL[effectiveAvailability(p, shop, now)] || [p.availability, undefined]
        const verified = p.allergensVerified?.at
        return (
          <Link key={p.id} href={`/plus/produits/${p.id}/`} className="card" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
            <div className="card-head">
              <h2 style={{ margin: 0, fontSize: '1.0625rem', textTransform: 'none', letterSpacing: 0, color: 'inherit' }}>{p.title}</h2>
              <span className="tag" data-tone={tone}>
                {label}
              </span>
            </div>
            <p className="meta">{(p.variants || []).map((v) => `${v.label} : ${Number.isInteger(v.priceCents) ? money(v.priceCents) : toGive('prix')}`).join(' · ')}</p>
            <p className="meta">
              {FAMILY[p.productionCategory] || p.productionCategory} · {verified ? `Allergènes vérifiés le ${shortDay(localParts(verified).iso)}` : 'Allergènes à cocher'} · {TAX[p.taxClass] || p.taxClass}
              {p._status !== 'published' ? ' · brouillon' : ''}
            </p>
            {p.priceEstimated && (
              <p>
                <span className="tag" data-tone="warn">
                  Prix à vérifier
                </span>
              </p>
            )}
          </Link>
        )
      })}
    </>
  )
}
