import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { money } from '@/lib/studio/format'
import { shortDay, localParts } from '@/lib/studio/time'
import { effectiveAvailability } from '@/lib/ordering/lines'
import { marker } from '@/lib/facts'

export const metadata = { title: 'Produits · Coco Studio' }

const TAX = { pending: 'Taxe à confirmer (comptable)', zero: 'Détaxé', taxable: 'Taxable', rule: 'Règle des produits de boulangerie' }
const AVAIL = { instock: ['En vente', 'ok'], soldout: ['Épuisé', 'bad'], backorder: ['Saisonnier (de retour)', 'warn'], preorder: ['Nouveau (précommande)', 'warn'], discontinued: ['Retiré', 'bad'] }

// Plus › Produits (16 §8.1): prices, allergen verification, tax class. Facts missing stay visible markers.
export default async function Produits() {
  const ctx = await studioPage('produits')
  const now = new Date()
  const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
  const res = await ctx.payload.find({ collection: 'products', sort: 'title', limit: 200, depth: 0, locale: 'fr', ...ctx.as })
  return (
    <>
      <p>
        <Link href="/plus/">‹ Plus</Link>
      </p>
      <div className="st-head">
        <h1>Produits</h1>
      </div>
      {res.docs.map((p) => {
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
            <p className="meta">{(p.variants || []).map((v) => `${v.label} : ${Number.isInteger(v.priceCents) ? money(v.priceCents) : marker('prix')}`).join(' · ')}</p>
            <p className="meta">
              {verified ? `Allergènes vérifiés le ${shortDay(localParts(verified).iso)}` : 'Allergènes à vérifier'} · {TAX[p.taxClass] || p.taxClass}
              {p._status !== 'published' ? ' · brouillon' : ''}
            </p>
          </Link>
        )
      })}
      <p className="meta">Ajouter un produit ou modifier ses textes : « Avancé ».</p>
    </>
  )
}
