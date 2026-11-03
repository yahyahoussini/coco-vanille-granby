import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studioPage } from '@/lib/studio/guard'
import { money } from '@/lib/studio/format'
import { shortDay, localParts } from '@/lib/studio/time'
import { effectiveAvailability } from '@/lib/ordering/lines'
import { untilLabel } from '@/lib/studio/vitrine'
import { toGive } from '@/lib/facts'
import { mediaUrl } from '@/lib/media'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { LEAD_CHOICES, FormatFields, ConfirmFirst } from '@/components/studio/ProductFields'

export const metadata = { title: 'Produit · Coco Studio' }

const idOf = (x) => (x && typeof x === 'object' ? x.id : x)

// One product (16 §8.1, G3, G13, G14): sold out or retired, formats and prices behind a step-up (history in the audit log),
// its words in both languages, lead time, photos, allergens verified by a person with a dated stamp, tax class by the owner.
export default async function Produit({ params, searchParams }) {
  const ctx = await studioPage('produits')
  const { id } = await params
  const p = await ctx.payload.findByID({ collection: 'products', id, depth: 1, locale: 'fr', ...ctx.as, disableErrors: true }).catch(() => null)
  if (!p) notFound()
  const en = await ctx.payload.findByID({ collection: 'products', id, depth: 0, locale: 'en', fallbackLocale: false, ...ctx.as, disableErrors: true }).catch(() => null)
  const now = new Date()
  const back = `/plus/produits/${p.id}/`
  const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
  const allergens = (await ctx.payload.find({ collection: 'allergens', sort: 'code', limit: 50, depth: 0, locale: 'fr', ...ctx.as })).docs
  const contains = new Set((p.allergens || []).map((a) => String(idOf(a))))
  const may = new Set((p.mayContain || []).map((a) => String(idOf(a))))
  const soldout = effectiveAvailability(p, shop, now) === 'soldout'
  const verified = p.allergensVerified?.at ? p.allergensVerified : null
  const verifier = verified && typeof verified.by === 'object' ? verified.by?.name : null
  const history = await ctx.payload.find({ collection: 'audit-log', where: { and: [{ entity: { equals: 'products' } }, { entityId: { equals: String(p.id) } }, { action: { in: ['product.price', 'product.formats', 'product.pricesOk'] } }] }, sort: '-createdAt', limit: 5, depth: 0, overrideAccess: true })
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
        <div className="btn-row">
          {ctx.can('product.soldout') &&
            (soldout || p.availability === 'discontinued' ? (
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
          {ctx.can('product.retire') && p.availability !== 'discontinued' && (
            <ActionForm type="product.retire" fields={{ productId: p.id }} back={back} needsNetwork>
              <button className="btn" type="submit">
                Retirer de la carte
              </button>
            </ActionForm>
          )}
        </div>
      </section>

      <section aria-labelledby="prix" className="card">
        <h2 id="prix" style={{ marginTop: 0 }}>
          Formats et prix (taxes en sus)
        </h2>
        {p.priceEstimated && (
          <div className="st-banner" data-tone="warn">
            <span>Prix proposés par l’agence : le site affiche « prix indicatif », et une commande garde le prix affiché.</span>
            {ctx.can('product.pricesOk') && (
              <ActionForm type="product.pricesOk" fields={{ productId: p.id }} back={back} needsNetwork>
                <button className="btn btn-primary" type="submit">
                  Ces prix sont les bons
                </button>
              </ActionForm>
            )}
          </div>
        )}
        <ul className="rows">
          {(p.variants || []).map((v, i) => (
            <li key={v.id || i}>
              <span className="grow">
                <strong>{v.label}</strong>
                {v.portionsMin ? ` · ${v.portionsMax && v.portionsMax !== v.portionsMin ? `${v.portionsMin} à ${v.portionsMax}` : v.portionsMin} portion${(v.portionsMax || v.portionsMin) > 1 ? 's' : ''}` : ''}
              </span>
              <strong>{Number.isInteger(v.priceCents) ? money(v.priceCents) : toGive('prix')}</strong>
            </li>
          ))}
        </ul>
        {ctx.can('product.formats') && (
          <details className="sheet">
            <summary className="btn">Changer les formats et les prix</summary>
            <ConfirmFirst ctx={ctx} back={back} />
            <ActionForm type="product.formats" fields={{ productId: p.id }} back={back} needsNetwork pending="Enregistrement…" className="sheet-body">
              {(p.variants || []).map((v, i) => (
                <FormatFields key={v.id || i} index={i} variant={v} labelEn={en?.variants?.[i]?.label} needsGrams={p.taxClass === 'rule'} removable={(p.variants || []).length > 1} />
              ))}
              <FormatFields index={(p.variants || []).length} isNew needsGrams={p.taxClass === 'rule'} />
              {p.priceEstimated && (
                <label className="check">
                  <input type="checkbox" name="checked" value="true" defaultChecked />
                  <span>Ces prix sont les bons (le site n’affiche plus « prix indicatif »)</span>
                </label>
              )}
              <div className="effects">
                <strong>Ça va changer :</strong> les formats et les prix sur le site et pour les nouvelles commandes. Les commandes déjà confirmées gardent leur prix.
              </div>
              <button className="btn btn-primary" type="submit">
                Enregistrer les formats et les prix
              </button>
            </ActionForm>
          </details>
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

      <section aria-labelledby="fiche" className="card">
        <h2 id="fiche" style={{ marginTop: 0 }}>
          Fiche du produit
        </h2>
        <p className="meta">Le nom, la description et le délai s’affichent sur le site. L’adresse de la page ne change pas.</p>
        {ctx.can('product.text') ? (
          <ActionForm type="product.text" fields={{ productId: p.id }} back={back} needsNetwork pending="Enregistrement…">
            <div className="field">
              <label htmlFor="nom">Nom</label>
              <input id="nom" name="title" type="text" required maxLength={120} defaultValue={p.title || ''} />
            </div>
            <div className="field">
              <label htmlFor="nom-en">Nom en anglais</label>
              <input id="nom-en" name="titleEn" type="text" maxLength={120} lang="en" defaultValue={en?.title || ''} />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="summary" rows={4} maxLength={1200} defaultValue={p.summary || ''} />
            </div>
            <div className="field">
              <label htmlFor="description-en">Description en anglais</label>
              <textarea id="description-en" name="summaryEn" rows={4} maxLength={1200} lang="en" defaultValue={en?.summary || ''} />
            </div>
            <div className="field">
              <label htmlFor="delai">Délai de préparation</label>
              <select id="delai" name="leadHours" defaultValue={String(p.leadTimeHours || 48)}>
                {[...new Set([...LEAD_CHOICES.map(([h]) => h), p.leadTimeHours > 0 ? p.leadTimeHours : 48])].sort((a, b) => a - b).map((h) => (
                  <option key={h} value={h}>
                    {LEAD_CHOICES.find(([x]) => x === h)?.[1] || `${h} heures`}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="message-max">Message sur le gâteau : caractères permis (0 = pas de message)</label>
              <input id="message-max" name="messageMax" type="number" min={0} max={120} defaultValue={p.cakeMessageMax || 0} style={{ maxInlineSize: '8rem' }} />
            </div>
            <label className="check">
              <input type="checkbox" name="online" value="true" defaultChecked={Boolean(p.onlineOrderable)} />
              <span>Se commande en ligne</span>
            </label>
            <button className="btn" type="submit">
              Enregistrer la fiche
            </button>
          </ActionForm>
        ) : (
          <p className="meta">{p.summary || 'Aucune description.'}</p>
        )}
      </section>

      <section aria-labelledby="photos" className="card">
        <h2 id="photos" style={{ marginTop: 0 }}>
          Photos
        </h2>
        {!(p.photos || []).length && <p className="meta">Pas encore de photo : le site montre une photo d’illustration, identifiée comme telle.</p>}
        {(p.photos || []).length > 0 && <p className="meta">La première photo est celle des cartes du site.</p>}
        <ul className="rows">
          {(p.photos || [])
            .filter((m) => m && typeof m === 'object')
            .map((m) => {
              // Photos are served by the public site, not by Studio's host.
              const src = mediaUrl(m, 'card') || mediaUrl(m)
              return (
                <li key={m.id}>
                  {src && <img src={src} alt={m.alt || p.title} width={72} height={90} loading="lazy" style={{ objectFit: 'contain', borderRadius: '8px' }} />}
                  <span className="grow meta">{m.alt || p.title}</span>
                  {ctx.can('product.photoRemove') && (
                    <ActionForm type="product.photoRemove" fields={{ productId: p.id, mediaId: m.id }} back={back} needsNetwork>
                      <button className="btn" type="submit">
                        Retirer
                      </button>
                    </ActionForm>
                  )}
                </li>
              )
            })}
        </ul>
        {ctx.can('product.photoAdd') && (
          <ActionForm type="product.photoAdd" fields={{ productId: p.id }} back={back} needsNetwork pending="Envoi de la photo…" encType="multipart/form-data">
            <div className="field">
              <label htmlFor="photo">Ajouter une photo (JPEG, PNG ou WebP, 15 Mo au plus)</label>
              <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required />
              <span className="hint">Sans nom de client ni visage sans accord : la photo s’affiche sur le site.</span>
            </div>
            <button className="btn" type="submit">
              Ajouter la photo
            </button>
          </ActionForm>
        )}
      </section>

      <section aria-labelledby="allergenes" className="card">
        <h2 id="allergenes" style={{ marginTop: 0 }}>
          Allergènes
        </h2>
        <p className={verified ? undefined : 'tag'} data-tone={verified ? undefined : 'warn'}>
          {verified ? `Vérifié le ${shortDay(localParts(verified.at).iso)}${verifier ? ` par ${verifier}` : ''}` : 'À cocher : sans vérification, le site invite le client à appeler avant de commander.'}
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
            <p className="meta">Écrit et vérifié par une personne, jamais par l’IA. Le site n’affiche aucune allégation « sans … ».</p>
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
              <strong>Règle des produits de boulangerie</strong> : viennoiseries sucrées, pâtisseries, biscuits, muffins, parts de gâteau. Indiquez le poids d’une portion dans « Changer les formats et les prix ». Une portion de moins de 230 g achetée à moins de 6 : TPS seulement (au Québec, la TVQ ne s’applique plus à ces produits depuis le 15 juillet 2026); 6 portions ou plus : détaxé.
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
          <a href={`/admin/collections/products/${p.id}`}>Autres réglages dans « Avancé »</a>
        </p>
      )}
    </>
  )
}
