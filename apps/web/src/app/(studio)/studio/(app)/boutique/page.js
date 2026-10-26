import { studioPage } from '@/lib/studio/guard'
import { localParts, addDays, shortDay, clockFr, dayOf, WEEKDAYS, nextOpening } from '@/lib/studio/time'
import { statusLine, shopBanners } from '@/lib/studio/shop'
import { whenFr } from '@/lib/studio/format'
import { closurePlan, affectedOrders, withPhone, REASONS, DURATIONS } from '@/lib/studio/closure'
import { ordersBetween } from '@/lib/studio/orders'
import { holidaySuggestions } from '@/lib/ordering/holidays'
import { capacityOn } from '@/lib/ordering'
import { onlineState } from '@/lib/ordering/availability'
import { PRODUCTION_CATEGORIES } from '@/collections/Catalog'
import { marker } from '@/lib/facts'
import { ActionForm } from '@/components/studio/ActionForm'
import { SaveBar } from '@/components/studio/SaveBar'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Boutique & heures · Coco Studio' }

const BACK = '/boutique/'
const DAY_FR = { Monday: 'lundi', Tuesday: 'mardi', Wednesday: 'mercredi', Thursday: 'jeudi', Friday: 'vendredi', Saturday: 'samedi', Sunday: 'dimanche' }
const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].filter((d) => WEEKDAYS.includes(d))
const CAT = Object.fromEntries(PRODUCTION_CATEGORIES.map((c) => [c.value, c.label]))
const STATE_FR = { to_confirm: 'à confirmer', closed: 'fermé', open: 'ouvert (heures habituelles)', special: 'heures spéciales' }

function Effects({ plan, orders, mode, now }) {
  const texted = withPhone(orders).length
  return (
    <ul>
      {mode === 'special' ? <li>afficher « fermé » le {shortDay(plan.firstDay)} sur le site et dans ses données (FR/EN/ES)</li> : <li>afficher un bandeau sur le site (FR/EN/ES)</li>}
      {mode === 'special' ? <li>retirer les cueillettes en ligne de ce jour</li> : <li>mettre en pause les commandes en ligne</li>}
      <li>mettre des heures spéciales sur Google : à faire à la main (1 min)</li>
      <li>{texted ? `texter ${texted} ${texted > 1 ? 'clients' : 'client'} : choisir une autre date ou être remboursé` : 'aucun client à texter'}</li>
      {orders.length > texted && <li>{orders.length - texted} sans téléphone : à appeler ou écrire</li>}
      <li>tout remettre {whenFr(plan.until, now)}</li>
    </ul>
  )
}

// Boutique & heures (16 §3.6): is the shop open, and what the site, the schema and Google say about it.
export default async function Boutique({ searchParams }) {
  const ctx = await studioPage('boutique')
  const now = new Date()
  const today = localParts(now).iso
  const [shop, business] = await Promise.all([ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as }), ctx.payload.findGlobal({ slug: 'business', locale: 'fr', depth: 0, ...ctx.as })])
  const line = statusLine(shop, now)
  const banners = shopBanners(shop, now)
  const online = onlineState(shop, now)
  const canClose = ctx.can('shop.closure')
  const editHours = ctx.can('shop.hours')

  let preview = null
  if (canClose) {
    const orders = ctx.can('order.ready') ? await ordersBetween(ctx, today, addDays(today, 1), { statuses: ['paid', 'ready'] }) : []
    preview = Object.fromEntries(
      ['jour', 'demain'].map((d) => {
        const plan = closurePlan(shop, d, { now })
        return [d, { plan, orders: affectedOrders(orders, plan, now) }]
      }),
    )
  }

  const special = [...(shop.specialDays || [])].filter((d) => dayOf(d.date) >= today).sort((a, b) => String(a.date).localeCompare(String(b.date)))
  const suggestions = holidaySuggestions(shop, { fromISO: today }).filter((h) => h.date <= addDays(today, 365))
  const pools = (await ctx.payload.find({ collection: 'capacity-pools', limit: 20, depth: 0, ...ctx.as })).docs
  const capDays = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(today, i))
  const caps = {}
  for (const p of pools) caps[p.productionCategory] = await Promise.all(capDays.map((d) => capacityOn(ctx.payload, { date: d, category: p.productionCategory, now })))
  const a = business.address || {}
  const hoursByDay = Object.fromEntries((shop.hours || []).map((h) => [h.day, h]))

  return (
    <>
      <div className="st-head">
        <h1>Boutique & heures</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />

      <div className="card">
        <p>
          <strong>
            <span aria-hidden="true">{line.icon}</span> {line.text}
          </strong>
        </p>
        <p className="meta">
          Commandes en ligne : {online.open ? 'actives' : online.reason === 'disabled' ? 'pas encore ouvertes (formulaire de demande)' : online.reason === 'paused' ? 'en pause' : online.reason === 'closure' ? 'fermées (fermeture)' : online.reason === 'hours' ? `en attente des heures · ${marker('heures d’ouverture')}` : 'non disponibles'}
        </p>
      </div>
      {banners.map((b) => (
        <div className="st-banner" data-tone={b.tone} key={b.key} role="status">
          <span>{b.text}</span>
          {ctx.can(b.action) && (
            <ActionForm type={b.action} back={BACK} needsNetwork>
              <button className="btn" type="submit">
                {b.label}
              </button>
            </ActionForm>
          )}
        </div>
      ))}

      {canClose && (
        <details className="card" id="fermer">
          <summary className="btn btn-primary">Fermeture exceptionnelle</summary>
          <ActionForm type="shop.closure" back={BACK} needsNetwork className="closure-form">
            <fieldset className="field">
              <legend>Pourquoi?</legend>
              <div className="choices">
                {REASONS.map(([v, l]) => (
                  <label className="choice" key={v}>
                    <input type="radio" name="reason" value={v} required />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="field">
              <legend>Combien de temps?</legend>
              <div className="choices">
                {DURATIONS.map(([v, l]) => (
                  <label className="choice" key={v}>
                    <input type="radio" name="duree" value={v} required />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
              <label htmlFor="fermer-jusqua" className="hint">
                Jusqu’au (inclus), pour « Jusqu’au… »
              </label>
              <input id="fermer-jusqua" name="date" type="date" min={today} max={addDays(today, 60)} />
            </fieldset>
            <div className="effects">
              <strong>Ça va :</strong>
              {preview && (
                <>
                  <div className="fx" data-duree="jour">
                    <p className="meta fx-title">Reste de la journée</p>
                    <Effects plan={preview.jour.plan} orders={preview.jour.orders} mode="closure" now={now} />
                  </div>
                  <div className="fx" data-duree="demain">
                    <p className="meta fx-title">Demain</p>
                    <Effects plan={preview.demain.plan} orders={preview.demain.orders} mode="special" now={now} />
                  </div>
                  <div className="fx" data-duree="jusqua">
                    <p className="meta fx-title">Jusqu’au…</p>
                    <ul>
                      <li>afficher un bandeau sur le site et mettre en pause les commandes en ligne</li>
                      <li>mettre des heures spéciales sur Google : à faire à la main (1 min)</li>
                      <li>texter les clients de ces jours : choisir une autre date ou être remboursés</li>
                      <li>tout remettre à la première ouverture après la date choisie</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
            <p className="meta">Les textos partent 60 secondes après, le temps d’« Annuler ».</p>
            <button className="btn btn-primary" type="submit">
              Fermer la boutique
            </button>
          </ActionForm>
        </details>
      )}

      <div className="btn-row" style={{ marginBlock: '0.75rem' }}>
        {ctx.can('shop.busy') && (
          <details className="card" style={{ flex: '1 1 16rem' }}>
            <summary className="btn" style={{ inlineSize: '100%' }}>
              Délai allongé
            </summary>
            <ActionForm type="shop.busy" back={BACK} needsNetwork>
              <fieldset className="field">
                <legend>Délai de plus</legend>
                <div className="choices">
                  {[
                    ['30', '+30 min'],
                    ['60', '+1 h'],
                    ['demain', 'Pour demain'],
                  ].map(([v, l], i) => (
                    <label className="choice" key={v}>
                      <input type="radio" name="minutes" value={v} defaultChecked={i === 1} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="field">
                <legend>Jusqu’à</legend>
                <div className="choices">
                  {[
                    ['fermeture', 'la fermeture'],
                    ['14:00', '14 h'],
                  ].map(([v, l], i) => (
                    <label className="choice" key={v}>
                      <input type="radio" name="until" value={v} defaultChecked={i === 0} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="meta">Les commandes déjà payées ne changent pas.</p>
              <button className="btn btn-primary" type="submit">
                Allonger le délai
              </button>
            </ActionForm>
          </details>
        )}
        {ctx.can('shop.pause') && (
          <details className="card" style={{ flex: '1 1 16rem' }}>
            <summary className="btn" style={{ inlineSize: '100%' }}>
              Pause en ligne
            </summary>
            <ActionForm type="shop.pause" back={BACK} needsNetwork>
              <fieldset className="field">
                <legend>Pause</legend>
                <div className="choices">
                  {[
                    ['1h', '1 h'],
                    ['fermeture', 'Reste de la journée'],
                    ['demain', 'Jusqu’à demain'],
                  ].map(([v, l], i) => (
                    <label className="choice" key={v}>
                      <input type="radio" name="until" value={v} defaultChecked={i === 0} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="meta">Les commandes déjà payées restent prévues.</p>
              <button className="btn btn-primary" type="submit">
                Mettre en pause
              </button>
            </ActionForm>
          </details>
        )}
      </div>

      <section aria-labelledby="heures">
        <h2 id="heures">Heures habituelles</h2>
        {!(shop.hours || []).length && <p className="error-summary">{marker('heures d’ouverture confirmées par la propriétaire')}</p>}
        {editHours ? (
          <ActionForm type="shop.hours" back={BACK} needsNetwork className="card">
            <ul className="rows">
              {WEEK.map((day) => {
                const h = hoursByDay[day]
                return (
                  <li key={day} style={{ flexWrap: 'wrap' }}>
                    <label className="check grow">
                      <input type="checkbox" name={`open_${day}`} defaultChecked={Boolean(h)} />
                      <span style={{ textTransform: 'capitalize' }}>{DAY_FR[day]}</span>
                    </label>
                    <span className="btn-row">
                      <label className="sr-only" htmlFor={`opens_${day}`}>
                        Ouverture {DAY_FR[day]}
                      </label>
                      <input id={`opens_${day}`} name={`opens_${day}`} type="time" step={900} defaultValue={h?.opens || ''} style={{ inlineSize: '8rem' }} />
                      <span aria-hidden="true">–</span>
                      <label className="sr-only" htmlFor={`closes_${day}`}>
                        Fermeture {DAY_FR[day]}
                      </label>
                      <input id={`closes_${day}`} name={`closes_${day}`} type="time" step={900} defaultValue={h?.closes || ''} style={{ inlineSize: '8rem' }} />
                    </span>
                  </li>
                )
              })}
            </ul>
            <SaveBar effects="Ça va changer : le site et ses données · Google : à faire à la main · Apple : tâche" />
          </ActionForm>
        ) : (
          <ul className="rows card">
            {WEEK.map((day) => (
              <li key={day}>
                <span style={{ textTransform: 'capitalize' }}>{DAY_FR[day]}</span>
                <span>{hoursByDay[day] ? `${clockFr(hoursByDay[day].opens)} – ${clockFr(hoursByDay[day].closes)}` : 'fermé'}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="jours-speciaux-titre" id="jours-speciaux">
        <h2 id="jours-speciaux-titre">Jours spéciaux</h2>
        {[...special.map((d) => ({ date: dayOf(d.date), label: d.label, state: d.state, opens: d.opens, closes: d.closes, saved: true })), ...suggestions.map((s) => ({ date: s.date, label: s.label, state: 'to_confirm', saved: false }))]
          .sort((x, y) => x.date.localeCompare(y.date))
          .slice(0, 14)
          .map((d) => (
            <div className="card" key={d.date} data-tone={d.state === 'to_confirm' && d.date <= addDays(today, 30) ? 'warn' : undefined}>
              <div className="card-head">
                <h3>
                  {shortDay(d.date)}
                  {d.label ? ` · ${d.label}` : ''}
                </h3>
                <span className="tag" data-tone={d.state === 'to_confirm' ? 'warn' : d.state === 'closed' ? 'bad' : 'ok'}>
                  {d.state === 'special' ? `${clockFr(d.opens)} – ${clockFr(d.closes)}` : STATE_FR[d.state]}
                </span>
              </div>
              {ctx.can('shop.special') && (
                <div className="btn-row" style={{ marginBlockStart: '0.5rem' }}>
                  {['open', 'closed'].map((st) => (
                    <ActionForm key={st} type="shop.special" fields={{ date: d.date, state: st, label: d.label || '' }} back={`${BACK}#jours-speciaux`} needsNetwork>
                      <button className="btn" type="submit" aria-pressed={d.state === st}>
                        {st === 'open' ? 'Ouvert' : 'Fermé'}
                      </button>
                    </ActionForm>
                  ))}
                  <details>
                    <summary className="btn">Heures spéciales</summary>
                    <ActionForm type="shop.special" fields={{ date: d.date, state: 'special', label: d.label || '' }} back={`${BACK}#jours-speciaux`} needsNetwork className="btn-row">
                      <label className="sr-only" htmlFor={`sp-o-${d.date}`}>
                        Ouverture
                      </label>
                      <input id={`sp-o-${d.date}`} name="opens" type="time" step={900} required defaultValue={d.opens || ''} style={{ inlineSize: '8rem' }} />
                      <label className="sr-only" htmlFor={`sp-c-${d.date}`}>
                        Fermeture
                      </label>
                      <input id={`sp-c-${d.date}`} name="closes" type="time" step={900} required defaultValue={d.closes || ''} style={{ inlineSize: '8rem' }} />
                      <button className="btn" type="submit">
                        Enregistrer
                      </button>
                    </ActionForm>
                  </details>
                </div>
              )}
            </div>
          ))}
        <p className="meta">Les jours fériés restent « à confirmer » tant que personne n’a choisi : rien n’est publié avant (G18).</p>
      </section>

      <section aria-labelledby="capacite">
        <h2 id="capacite">Capacité</h2>
        {!pools.length && <p className="card">{marker('capacité de production par jour')} · à régler dans « Avancé ».</p>}
        {pools.map((p) => (
          <div className="card" key={p.id}>
            <div className="card-head">
              <h3>{CAT[p.productionCategory] || p.productionCategory} par jour</h3>
              <strong>{typeof p.defaultPerDay === 'number' ? p.defaultPerDay : marker('capacité')}</strong>
            </div>
            <ul className="rows">
              {caps[p.productionCategory].map((c) => (
                <li key={c.date}>
                  <span className="grow">
                    {c.date === today ? 'Aujourd’hui' : shortDay(c.date)} : {c.limit === null ? '—' : `${c.used}/${c.limit}`}
                  </span>
                  {ctx.can('capacity.adjust') && c.limit !== null && (
                    <span className="btn-row">
                      {[-1, 1].map((delta) => (
                        <ActionForm key={delta} type="capacity.adjust" fields={{ category: p.productionCategory, date: c.date, delta }} back={`${BACK}#capacite`} needsNetwork>
                          <button className="btn" type="submit" aria-label={`${delta > 0 ? 'Un de plus' : 'Un de moins'} le ${shortDay(c.date)}`}>
                            {delta > 0 ? '+' : '−'}
                          </button>
                        </ActionForm>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="fiche">
        <h2 id="fiche">Fiche (verrouillée)</h2>
        <div className="card">
          <p>
            <strong>{business.name}</strong>
          </p>
          <p>
            {[a.street, a.city].filter(Boolean).join(', ') || marker('adresse')} · {business.phoneDisplay || marker('téléphone')}
          </p>
          <p className="meta">Site ✓ (automatique) · Google : à vérifier à la main · Apple : tâche</p>
          <p className="meta">Nom verrouillé : le même partout, sans mots-clés. Un changement passe par l’agence et la propriétaire.</p>
        </div>
      </section>
      <p className="meta">Prochaine ouverture : {nextOpening(shop, now) ? whenFr(nextOpening(shop, now), now) : marker('heures d’ouverture')}</p>
    </>
  )
}
