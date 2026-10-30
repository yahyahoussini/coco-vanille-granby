import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studioPage } from '@/lib/studio/guard'
import { money } from '@/lib/studio/format'
import { shortDay, localParts } from '@/lib/studio/time'
import { effectiveAvailability } from '@/lib/ordering/lines'
import { untilLabel } from '@/lib/studio/vitrine'
import { marker } from '@/lib/facts'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Produit · Coco Studio' }

const idOf = (x) => (x && typeof x === 'object' ? x.id : x)

// One product (16 §8.1, G3, G13, G14): sold out, prices behind a step-up (history in the audit log),
// allergens verified by a person with a dated stamp, tax class by the owner after the accountant.
export default async function Produit({ params, searchParams }) {
  const ctx = await studioPage('produits')
  const { id } = await params
  const p = await ctx.payload.findByID({ collection: 'products', id, depth: 1, locale: 'fr', ...ctx.as, disableErrors: true }).catch(() => null)
  if (!p) notFound()
  const now = new Date()
  const back = `/plus/produits/${p.id}/`
  const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
  const allergens = (await ctx.payload.find({ collection: 'allergens', sort: 'code', limit: 50, depth: 0, locale: 'fr', ...ctx.as })).docs
  const contains = new Set((p.allergens || []).map((a) => String(idOf(a))))
  const may = new Set((p.mayContain || []).map((a) => String(idOf(a))))
  const soldout = effectiveAvailability(p, shop, now) === 'soldout'
  const verified = p.allergensVerified?.at ? p.allergensVerified : null
  const verifier = verified && typeof verified.by === 'object' ? verified.by?.name : null
  const history = await ctx.payload.find({ collection: 'audit-log', where: { and: [{ entity: { equals: 'products' } }, { entityId: { equals: String(p.id) } }, { action: { equals: 'product.price' } }] }, sort: '-createdAt', limit: 5, depth: 0, overrideAccess: true })
  const step = ctx.stepUp ? null : <p className="meta">Studio vous demandera de confirmer que c’est vous (5 minutes).</p>

  return (
    <>
      <p>
        <Link href="/plus/produits/">‹ Produits</Link>
      </p>
      <div className="st-head">
        <h1>{p.title}</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={back} />

      <section aria-labelledby="dispo" className="card">
        <h2 id="dispo" style={{ marginTop: 0 }}>
          Disponibilité
        </h2>
        <p>{soldout ? `Épuisé ${untilLabel(p.soldOutUntil, now)}` : p.availability === 'discontinued' ? 'Retiré de la carte' : 'En vente'}</p>
        {ctx.can('product.soldout') &&
          (soldout ? (
            <ActionForm type="product.restock" fields={{ productId: p.id }} back={back}>
              <button className="btn" type="submit">
                Remettre en vente
              </button>
            </ActionForm>
          ) : (
            <ActionForm type="product.soldout" fields={{ productId: p.id }} back={back}>
              <button className="btn" type="submit">
                Épuisé pour aujourd’hui
              </button>
            </ActionForm>
          ))}
      </section>

      <section aria-labelledby="prix" className="card">
        <h2 id="prix" style={{ marginTop: 0 }}>
          Prix (taxes en sus)
        </h2>
        {(p.variants || []).map((v, i) => (
          <div key={v.id || i} className="field">
            <p>
              <strong>{v.label}</strong> : {Number.isInteger(v.priceCents) ? money(v.priceCents) : marker('prix')}
            </p>
            {ctx.can('product.price') && (
              <ActionForm type="product.price" fields={{ productId: p.id, variantIndex: i }} back={back} needsNetwork className="btn-row">
                <label className="sr-only" htmlFor={`prix-${i}`}>
                  Nouveau prix : {v.label}
                </label>
                <input id={`prix-${i}`} name="price" type="text" inputMode="decimal" autoComplete="off" placeholder="ex. 6,50" required style={{ maxInlineSize: '9rem' }} />
                <button className="btn" type="submit">
                  Changer le prix
                </button>
              </ActionForm>
            )}
          </div>
        ))}
        {ctx.can('product.price') && (
          <>
            <div className="effects">
              <strong>Ça va changer :</strong> le prix sur le site, dans ses données et pour les nouvelles commandes. Les commandes déjà payées gardent leur prix.
            </div>
            {step}
          </>
        )}
        {history.docs.length > 0 && (
          <details>
            <summary className="btn btn-text">Historique des prix</summary>
            <ul className="rows">
              {history.docs.map((h) => (
                <li key={h.id}>
                  <span className="grow">{h.summary}</span>
                  <span className="meta">{shortDay(localParts(h.createdAt).iso)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section aria-labelledby="allergenes" className="card">
        <h2 id="allergenes" style={{ marginTop: 0 }}>
          Allergènes
        </h2>
        <p className={verified ? undefined : 'tag'} data-tone={verified ? undefined : 'warn'}>
          {verified ? `Vérifié le ${shortDay(localParts(verified.at).iso)}${verifier ? ` par ${verifier}` : ''}` : 'Allergènes à vérifier : aucune vérification enregistrée.'}
        </p>
        {ctx.can('product.allergens') ? (
          <ActionForm type="product.allergens" fields={{ productId: p.id }} back={back} needsNetwork>
            <div className="st-scroll">
            <table className="st-table">
              <thead>
                <tr>
                  <th scope="col">Allergène</th>
                  <th scope="col">Contient</th>
                  <th scope="col">Peut contenir</th>
                </tr>
              </thead>
              <tbody>
                {allergens.map((a) => (
                  <tr key={a.id}>
                    <th scope="row" style={{ fontWeight: 500 }}>
                      {a.label}
                    </th>
                    <td>
                      <input type="checkbox" name="allergens[]" value={a.id} defaultChecked={contains.has(String(a.id))} aria-label={`Contient : ${a.label}`} style={{ inlineSize: '1.5rem', blockSize: '1.5rem' }} />
                    </td>
                    <td>
                      <input type="checkbox" name="mayContain[]" value={a.id} defaultChecked={may.has(String(a.id))} aria-label={`Peut contenir : ${a.label}`} style={{ inlineSize: '1.5rem', blockSize: '1.5rem' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <label className="check">
              <input type="checkbox" name="confirm" value="true" required />
              <span>J’ai vérifié la recette et les étiquettes des ingrédients.</span>
            </label>
            {step}
            <button className="btn btn-primary" type="submit">
              Enregistrer la vérification
            </button>
            <p className="meta">Écrit et vérifié par une personne, jamais par l’IA. Aucune allégation « sans … » sans l’accord de l’agence.</p>
          </ActionForm>
        ) : (
          <p className="meta">{allergens.filter((a) => contains.has(String(a.id))).map((a) => a.label).join(', ') || 'Aucun allergène inscrit.'}</p>
        )}
      </section>

      <section aria-labelledby="taxe" className="card">
        <h2 id="taxe" style={{ marginTop: 0 }}>
          Taxe
        </h2>
        <p>{{ pending: 'À choisir : vente en ligne bloquée.', zero: 'Détaxé', taxable: 'Taxable (TPS + TVQ)', rule: 'Selon la règle des produits de boulangerie' }[p.taxClass] || p.taxClass}</p>
        <details className="hint-box">
          <summary>Quelle classe choisir?</summary>
          <ul>
            <li>
              <strong>Détaxé</strong> : pain, baguette, croissant nature, et tout gâteau vendu entier.
            </li>
            <li>
              <strong>Règle des produits de boulangerie</strong> : viennoiseries sucrées, pâtisseries, biscuits, muffins, parts de gâteau. Indiquez le poids d’une portion dans « Avancé ». Une portion de moins de 230 g achetée à moins de 6 : TPS seulement (au Québec, la TVQ ne s’applique plus à ces produits depuis le 15 juillet 2026); 6 portions ou plus : détaxé.
            </li>
            <li>
              <strong>Taxable (TPS + TVQ)</strong> : sandwichs, salé prêt à manger, boissons.
            </li>
          </ul>
          <p className="meta">Sources : Revenu Québec, « Produits de boulangerie sucrés » et la détaxation du 15 juillet 2026; Agence du revenu du Canada, produits alimentaires de base.</p>
        </details>
        {ctx.can('product.tax') && (
          <ActionForm type="product.tax" fields={{ productId: p.id }} back={back} needsNetwork>
            <div className="field">
              <label htmlFor="classe">Classe de taxe</label>
              <select id="classe" name="taxClass" defaultValue={p.taxClass}>
                <option value="pending">À choisir</option>
                <option value="zero">Détaxé</option>
                <option value="taxable">Taxable (TPS + TVQ)</option>
                <option value="rule">Règle des produits de boulangerie</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="approuve">Vérifié le (facultatif)</label>
              <input id="approuve" name="approvedOn" type="date" />
            </div>
            {step}
            <button className="btn" type="submit">
              Enregistrer la taxe
            </button>
          </ActionForm>
        )}
      </section>
      {['proprietaire', 'gerant', 'agence'].includes(ctx.user.role) && (
        <p>
          <a href={`/admin/collections/products/${p.id}`}>Modifier les textes et les photos dans « Avancé »</a>
        </p>
      )}
    </>
  )
}
