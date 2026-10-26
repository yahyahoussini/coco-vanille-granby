import { ActionForm } from '../ActionForm'
import { marker } from '@/lib/facts'

// Réglages › Boutique (owner): deposit % for custom-cake quotes, the /avis QR target (16 §8.1).
export async function ShopSettings({ ctx, back }) {
  if (ctx.user.role !== 'proprietaire') return null
  const [shop, business] = await Promise.all([ctx.payload.findGlobal({ slug: 'shop', depth: 0, ...ctx.as }), ctx.payload.findGlobal({ slug: 'business', locale: 'fr', depth: 0, ...ctx.as })])
  const pct = shop.ordering?.depositPercent
  return (
    <section aria-labelledby="reglages-boutique-titre" id="reglages-boutique">
      <h2 id="reglages-boutique-titre">Boutique</h2>
      <ActionForm type="settings.deposit" back={back} needsNetwork className="card">
        <div className="field">
          <label htmlFor="acompte">Acompte des gâteaux sur demande (%)</label>
          <input id="acompte" name="percent" type="text" inputMode="decimal" defaultValue={typeof pct === 'number' ? String(pct).replace('.', ',') : ''} placeholder="ex. 30" required style={{ maxInlineSize: '8rem' }} />
          <span className="hint">Actuel : {typeof pct === 'number' ? `${pct} %` : marker('pourcentage d’acompte')}. Changer l’acompte demande de confirmer que c’est vous.</span>
        </div>
        <button className="btn" type="submit">
          Enregistrer l’acompte
        </button>
      </ActionForm>
      <ActionForm type="settings.reviewLink" back={back} needsNetwork className="card">
        <div className="field">
          <label htmlFor="lien-avis">Lien Google « Demander des avis » (cible du code QR /avis)</label>
          <input id="lien-avis" name="url" type="url" inputMode="url" defaultValue={business.google?.reviewLink || ''} placeholder="https://g.page/r/…/review" />
          <span className="hint">Le lien imprimé (cocovanillegranby.com/avis) ne change jamais; seule sa cible change ici.</span>
        </div>
        <button className="btn" type="submit">
          Enregistrer le lien
        </button>
      </ActionForm>
    </section>
  )
}
