import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { LEAD_CHOICES, FormatFields, ConfirmFirst } from '@/components/studio/ProductFields'

export const metadata = { title: 'Ajouter un produit · Coco Studio' }

const BACK = '/plus/produits/nouveau/'

// A new product: its family, its name, one format with its price at least. It goes on the site at once; the photo, the
// allergens and the other formats follow on its own page.
export default async function NouveauProduit({ searchParams }) {
  const ctx = await studioPage('produits')
  const owner = ctx.user.role === 'proprietaire'
  return (
    <>
      <p>
        <Link href="/plus/produits/">‹ Produits</Link>
      </p>
      <div className="st-head">
        <h1>Ajouter un produit</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />
      {!ctx.can('product.create') ? (
        <p className="card">Seuls la propriétaire et le gérant ajoutent des produits.</p>
      ) : (
        <>
          <ConfirmFirst ctx={ctx} back={BACK} />
          <ActionForm type="product.create" back={BACK} needsNetwork pending="Création du produit…" className="card">
            <div className="field">
              <label htmlFor="famille">Famille</label>
              <select id="famille" name="family" required defaultValue="gateaux">
                <option value="gateaux">Gâteaux</option>
                <option value="viennoiseries">Viennoiseries</option>
                <option value="pains">Pains et baguettes</option>
                <option value="patisseries">Pâtisseries et salé</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="nom">Nom</label>
              <input id="nom" name="title" type="text" required maxLength={120} />
              <span className="hint">L’adresse de la page vient de ce nom et ne changera plus.</span>
            </div>
            <div className="field">
              <label htmlFor="nom-en">Nom en anglais</label>
              <input id="nom-en" name="titleEn" type="text" maxLength={120} lang="en" />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="summary" rows={3} maxLength={1200} />
            </div>
            <div className="field">
              <label htmlFor="description-en">Description en anglais</label>
              <textarea id="description-en" name="summaryEn" rows={3} maxLength={1200} lang="en" />
            </div>
            <FormatFields index={0} required showTitle={false} needsGrams={false} />
            <div className="field">
              <label htmlFor="delai">Délai de préparation</label>
              <select id="delai" name="leadHours" defaultValue="48">
                {LEAD_CHOICES.map(([h, label]) => (
                  <option key={h} value={h}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {owner ? (
              <div className="field">
                <label htmlFor="taxe">Taxe</label>
                <select id="taxe" name="taxClass" defaultValue="zero">
                  <option value="zero">Détaxé (pain, gâteau entier)</option>
                  <option value="taxable">Taxable (salé prêt à manger, boissons)</option>
                </select>
                <span className="hint">Pour la règle des produits de boulangerie, choisissez-la ensuite sur la page du produit, avec le poids d’une portion.</span>
              </div>
            ) : (
              <p className="meta">La propriétaire choisit la taxe : le produit ne se réserve pas en ligne avant.</p>
            )}
            <label className="check">
              <input type="checkbox" name="online" value="true" defaultChecked />
              <span>Se commande en ligne</span>
            </label>
            <button className="btn btn-primary" type="submit">
              Ajouter à la carte
            </button>
          </ActionForm>
        </>
      )}
    </>
  )
}
