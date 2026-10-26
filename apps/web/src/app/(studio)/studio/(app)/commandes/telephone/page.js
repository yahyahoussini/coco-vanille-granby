import Link from 'next/link'
import { redirect } from 'next/navigation'
import { studioPage, firstParam } from '@/lib/studio/guard'
import { availableDays, errorText } from '@/lib/ordering'
import { effectiveAvailability } from '@/lib/ordering/lines'
import { money } from '@/lib/studio/format'
import { shortDay, clockFr } from '@/lib/studio/time'
import { marker } from '@/lib/facts'
import { ActionForm } from '@/components/studio/ActionForm'
import { Stepper } from '@/components/studio/Stepper'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Commande téléphone · Coco Studio' }

const BASE = '/commandes/telephone/'

// Commande téléphone (16 §3.2, F5): 1 products → 2 pickup (only windows with room) → 3 customer → 4 payment.
// Same pools and slots as the web (createOrder, source 'phone'); works as plain GET/POST forms.
export default async function Telephone({ searchParams }) {
  const ctx = await studioPage('commandes')
  if (!ctx.can('order.phone')) redirect('/commandes/')
  const q = (await searchParams) || {}
  const shop = await ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })
  const res = await ctx.payload.find({ collection: 'products', where: { and: [{ _status: { equals: 'published' } }, { availability: { not_equals: 'discontinued' } }] }, sort: 'title', limit: 200, depth: 0, locale: 'fr', ...ctx.as })
  const products = res.docs

  const items = []
  for (const [k, v] of Object.entries(q)) {
    const m = k.match(/^q\.(\d+)\.(\d+)$/)
    const qty = Number(firstParam(v))
    if (m && Number.isInteger(qty) && qty > 0) items.push({ productId: Number(m[1]), variantIndex: Number(m[2]), qty: Math.min(qty, 50) })
  }
  const keep = items.map((i) => `q.${i.productId}.${i.variantIndex}=${i.qty}`).join('&')
  const day = /^\d{4}-\d{2}-\d{2}$/.test(firstParam(q.jour) || '') ? firstParam(q.jour) : null
  const byId = new Map(products.map((p) => [String(p.id), p]))
  const lines = items.map((i) => {
    const p = byId.get(String(i.productId))
    const v = p?.variants?.[i.variantIndex]
    return { ...i, product: p, variant: v, cents: Number.isInteger(v?.priceCents) ? v.priceCents : null }
  })
  const subtotal = lines.every((l) => l.cents) ? lines.reduce((s, l) => s + l.cents * l.qty, 0) : null
  const days = items.length ? await availableDays(ctx.payload, { items, source: 'phone', limit: 14 }) : null
  const chosen = day && days ? days.days.find((d) => d.date === day) : null

  return (
    <>
      <p>
        <Link href="/commandes/">‹ Commandes</Link>
      </p>
      <div className="st-head">
        <h1>Commande téléphone</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={`${BASE}?${keep}${day ? `&jour=${day}` : ''}`} />

      <section aria-labelledby="etape-produits">
        <h2 id="etape-produits">1 · Produits</h2>
        <form method="get" action={BASE} className="card">
          <ul className="rows">
            {products.flatMap((p) =>
              (p.variants || []).map((v, vi) => {
                const soldout = effectiveAvailability(p, shop) === 'soldout'
                const id = `q-${p.id}-${vi}`
                const label = `${p.title}${p.variants.length > 1 || v.label ? ` · ${v.label}` : ''}`
                const current = items.find((i) => i.productId === p.id && i.variantIndex === vi)?.qty || 0
                return (
                  <li key={id}>
                    <span className="grow">
                      {label}
                      <small className="meta" style={{ display: 'block' }}>
                        {Number.isInteger(v.priceCents) ? money(v.priceCents) : marker('prix')}
                        {soldout ? ' · Épuisé' : ''}
                      </small>
                    </span>
                    <Stepper id={id} name={`q.${p.id}.${vi}`} label={label} defaultValue={current} />
                  </li>
                )
              }),
            )}
          </ul>
          {!products.length && <p className="empty">Aucun produit publié.</p>}
          <button className="btn" type="submit">
            {items.length ? 'Mettre à jour' : 'Choisir la cueillette'}
          </button>
        </form>
      </section>

      {items.length > 0 && (
        <section aria-labelledby="etape-cueillette">
          <h2 id="etape-cueillette">2 · Cueillette</h2>
          {days.days.length ? (
            <nav className="choices" aria-label="Jour de cueillette">
              {days.days.map((d) => (
                <Link key={d.date} className="btn" href={`${BASE}?${keep}&jour=${d.date}#etape-cueillette`} aria-current={d.date === day ? 'page' : undefined}>
                  {shortDay(d.date)}
                  {d.toConfirm ? ' (à confirmer)' : ''}
                </Link>
              ))}
            </nav>
          ) : (
            <p className="error-summary">Aucune journée possible : {errorText(days.reason, 'fr') || days.reason}</p>
          )}
          {day && !chosen && <p className="error-summary">Ce jour n’a plus de place. Choisissez-en un autre.</p>}
        </section>
      )}

      {chosen && (
        <ActionForm type="order.phone" fields={{ items: items.map((i) => `${i.productId}.${i.variantIndex}.${i.qty}`), date: chosen.date }} back={`${BASE}?${keep}&jour=${chosen.date}`} pending="Création de la commande…">
          <fieldset className="field card">
            <legend>Heure ({shortDay(chosen.date)}) · seulement les plages avec de la place</legend>
            <div className="choices">
              {chosen.windows.map((w, i) => (
                <label className="choice" key={w.start}>
                  <input type="radio" name="windowStart" value={w.start} defaultChecked={i === 0} required />
                  <span>
                    {clockFr(w.start)} <small>({w.remaining})</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <section aria-labelledby="etape-client" className="card">
            <h2 id="etape-client" style={{ marginTop: 0 }}>
              3 · Client
            </h2>
            <div className="field">
              <label htmlFor="firstName">Prénom</label>
              <input id="firstName" name="firstName" type="text" autoComplete="off" autoCorrect="off" spellCheck={false} required />
            </div>
            <div className="field">
              <label htmlFor="lastName">Nom (facultatif)</label>
              <input id="lastName" name="lastName" type="text" autoComplete="off" autoCorrect="off" spellCheck={false} />
            </div>
            <div className="field">
              <label htmlFor="phone">Tél.</label>
              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="off" required />
            </div>
            <div className="field">
              <label htmlFor="email">Courriel (facultatif, pour la confirmation)</label>
              <input id="email" name="email" type="email" autoComplete="off" autoCapitalize="none" spellCheck={false} />
            </div>
            <fieldset className="field">
              <legend>Langue du client</legend>
              <div className="choices">
                {[
                  ['fr', 'Français'],
                  ['en', 'English'],
                  ['es', 'Español'],
                ].map(([v, l]) => (
                  <label className="choice" key={v}>
                    <input type="radio" name="language" value={v} defaultChecked={v === 'fr'} />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {lines
              .filter((l) => l.product?.cakeMessageMax > 0)
              .map((l) => (
                <div className="field" key={`m-${l.productId}-${l.variantIndex}`}>
                  <label htmlFor={`message_${l.productId}_${l.variantIndex}`}>Message sur le gâteau · {l.product.title} (facultatif)</label>
                  <input id={`message_${l.productId}_${l.variantIndex}`} name={`message_${l.productId}_${l.variantIndex}`} type="text" maxLength={l.product.cakeMessageMax} />
                </div>
              ))}
            <div className="field">
              <label htmlFor="allergyNote">Allergie signalée (facultatif)</label>
              <textarea id="allergyNote" name="allergyNote" maxLength={500} />
              <span className="hint">Visible sur la commande seulement, jamais dans les textos. Supprimée 30 jours après la cueillette.</span>
            </div>
          </section>

          <fieldset className="field card">
            <legend>4 · Paiement</legend>
            <div className="choices">
              <label className="choice">
                <input type="radio" name="payment" value="comptoir" defaultChecked />
                <span>Au comptoir</span>
              </label>
              <label className="choice">
                <input type="radio" name="payment" value="lien" />
                <span>Lien par texto</span>
              </label>
            </div>
          </fieldset>

          <p>
            <strong>Total {subtotal !== null ? `${money(subtotal)} + taxes` : marker('prix')}</strong>
          </p>
          <button className="btn btn-primary" type="submit">
            Créer la commande
          </button>
        </ActionForm>
      )}
    </>
  )
}
