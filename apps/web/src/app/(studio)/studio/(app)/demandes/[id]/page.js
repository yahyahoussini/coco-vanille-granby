import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studioPage } from '@/lib/studio/guard'
import { capacityOn } from '@/lib/ordering'
import { shortDay, longDay, dayOf } from '@/lib/studio/time'
import { customerName, whenFr } from '@/lib/studio/format'
import { marker } from '@/lib/facts'
import { ActionForm } from '@/components/studio/ActionForm'
import { QuotePreview } from '@/components/studio/QuotePreview'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Chiffrer une demande · Coco Studio' }

// « Chiffrer » (16 §3.4, F6): total before taxes → deposit and balance → recap → « Envoyer le lien d'acompte ».
// The deposit % has no default until the owner sets it (10 §1.2); the tax class comes from the accountant.
export default async function Chiffrer({ params, searchParams }) {
  const ctx = await studioPage('demandes')
  const { id } = await params
  const r = await ctx.payload.findByID({ collection: 'requests', id, depth: 1, ...ctx.as, disableErrors: true }).catch(() => null)
  if (!r) notFound()
  const now = new Date()
  const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
  const pct = shop.ordering?.depositPercent
  const hours = shop.ordering?.quoteValidHours
  const day = dayOf(r.eventDate)
  const cap = await capacityOn(ctx.payload, { date: day, category: r.productionCategory || 'gateaux', now })
  const full = cap.limit !== null && cap.used >= cap.limit
  const back = `/demandes/${r.id}/`
  const formId = `chiffrer-${r.id}`
  const photo = (r.photos || []).find((p) => p && typeof p === 'object')
  const validUntil = typeof hours === 'number' ? new Date(now.getTime() + hours * 3600000) : null

  return (
    <>
      <p>
        <Link href="/demandes/">‹ Demandes</Link>
      </p>
      <div className="st-head">
        <h1>Chiffrer</h1>
        <span className="st-date">
          {r.occasion}
          {r.guests ? ` · ${r.guests} pers.` : ''} · {shortDay(day)}
        </span>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={back} />
      {r.status !== 'new' && <p className="error-summary">Cette demande n’attend plus de prix (statut : {r.status}).</p>}
      {full && <p className="st-banner" data-tone="warn">Le {shortDay(day)} est complet ({cap.used}/{cap.limit}).</p>}

      <ActionForm id={formId} type="request.quote" fields={{ requestId: r.id }} back={back} needsNetwork pending="Envoi de la soumission…">
        <div className="card">
          <div className="field">
            <label htmlFor="price">Prix total, avant taxes</label>
            <input id="price" name="price" type="text" inputMode="decimal" autoComplete="off" placeholder="ex. 120" required />
            <span className="hint">Grille de prix : {marker('grille de prix des gâteaux sur demande')}</span>
          </div>
          <fieldset className="field">
            <legend>Taxes (selon le comptable)</legend>
            <div className="choices">
              {[
                ['zero', 'Détaxé'],
                ['taxable', 'Taxable (TPS + TVQ)'],
              ].map(([v, l]) => (
                <label className="choice" key={v}>
                  <input type="radio" name="taxClass" value={v} defaultChecked={r.quote?.taxClass === v} required />
                  <span>{l}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {typeof pct === 'number' ? (
            <QuotePreview formId={formId} percent={pct} supplyDate={day} initialTax={['zero', 'taxable'].includes(r.quote?.taxClass) ? r.quote.taxClass : null} />
          ) : (
            <p className="error-summary">
              Pourcentage d’acompte : {marker('pourcentage d’acompte')} ·{' '}
              {ctx.user.role === 'proprietaire' ? <Link href="/plus/reglages/#reglages-boutique">le régler dans Réglages</Link> : 'la propriétaire le règle dans Réglages'}
            </p>
          )}
          <p className="meta">Valide jusqu’au {validUntil ? whenFr(validUntil, now) : marker('durée de validité des soumissions')} · la place du {shortDay(day)} est réservée en attendant.</p>
          {full && ctx.user.role === 'proprietaire' && (
            <label className="check">
              <input type="checkbox" name="force" value="true" />
              <span>Envoyer quand même (journée complète)</span>
            </label>
          )}
        </div>

        <details className="card">
          <summary className="btn btn-text">Récapitulatif + photo · aperçu</summary>
          <p>
            Le client reçoit, en {r.customer?.language === 'en' ? 'anglais (français d’abord pour les conditions)' : r.customer?.language === 'es' ? 'espagnol (français d’abord pour les conditions)' : 'français'}, par {[r.customer?.email && 'courriel', r.customer?.phone && 'texto'].filter(Boolean).join(' et ') || '—'} :
          </p>
          <ul>
            <li>
              {r.occasion}
              {r.guests ? ` pour ${r.guests} personnes` : ''}, cueillette le {longDay(day)}
            </li>
            {r.flavour && <li>Saveur : {r.flavour}</li>}
            {r.cakeMessage && <li>Message : « {r.cakeMessage} »</li>}
            <li>le prix, l’acompte, le solde et la date d’expiration</li>
            <li>le lien de paiement de l’acompte et les conditions</li>
          </ul>
          {photo && <img src={photo.sizes?.thumb?.url || photo.url} alt={photo.alt || 'Photo d’inspiration du client'} width={photo.sizes?.thumb?.width || 160} height={photo.sizes?.thumb?.height || 160} style={{ maxInlineSize: '10rem', blockSize: 'auto' }} />}
          <p className="meta">Pour {customerName(r.customer)}.</p>
        </details>

        <button className="btn btn-primary" type="submit" disabled={r.status !== 'new' || typeof pct !== 'number'}>
          Envoyer le lien d’acompte
        </button>
        <p className="meta">Le courriel et le texto partent 30 secondes après, le temps d’« Annuler ». Envoi impossible hors ligne.</p>
      </ActionForm>
    </>
  )
}
