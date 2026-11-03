import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { FACT_GROUPS, FACTS, factIdFor } from '@/lib/facts-catalog'
import { proposalFor, NO_PROPOSAL, REPEATS_PRODUCTS } from '@/lib/facts-proposals'

export const metadata = { title: 'Faits du site · Coco Studio' }

const BACK = '/plus/faits/'
const SLOT = /\[\[FACT NEEDED: ([^\]]+)\]\]/g
const LANGS = { fr: 'français', en: 'anglais' }
const PAGE_NAMES = {
  home: 'Accueil', carte: 'Carte', commander: 'Commander', 'nous-trouver': 'Nous trouver', 'zoo-de-granby': 'Depuis le Zoo', 'a-propos': 'À propos', chef: 'Le chef',
  prix: 'Prix', 'gateau-pour-demain': 'Gâteau pour demain', 'gateaux-personnalises': 'Gâteaux personnalisés', buches: 'Bûches de Noël', allergenes: 'Allergènes',
  faq: 'FAQ', calculateur: 'Calculateur de portions', viennoiseries: 'Viennoiseries', pains: 'Pains et baguettes', gateaux: 'Gâteaux', patisseries: 'Pâtisseries',
  confidentialite: 'Confidentialité', 'conditions-de-vente': 'Conditions de vente', temoins: 'Témoins', accessibilite: 'Accessibilité', journal: 'Journal',
}
// A Journal post, named by its French title (the place a slot appears).
const postName = (doc) => `Journal › « ${doc.title || doc.slug || doc.id} »`

// Every [[FACT NEEDED]] slot left in the published copy, per language: fact key → { labels, pages, langs }.
// Read from the stored copy (not the filled one), so an answered fact still shows where it appears. Journal posts
// count once published, whatever their day (a scheduled post waits for its facts too); `pages` holds place names.
async function slotsInCopy(payload) {
  const out = new Map()
  const published = (collection, locale, where) => payload.find({ collection, where, locale, limit: 500, depth: 0, pagination: false, overrideAccess: true }).catch(() => ({ docs: [] }))
  const frTitles = new Map((await published('posts', 'fr', { state: { equals: 'published' } })).docs.map((d) => [d.id, d]))
  for (const locale of ['fr', 'en']) {
    const res = await published('pages', locale, { _status: { equals: 'published' } })
    const posts = await published('posts', locale, { state: { equals: 'published' } })
    const places = [...res.docs.map((doc) => [doc, PAGE_NAMES[doc.key] || doc.key]), ...posts.docs.map((doc) => [doc, postName(frTitles.get(doc.id) || doc)])]
    for (const [doc, place] of places) {
      for (const m of JSON.stringify(doc).matchAll(SLOT)) {
        const label = m[1].replace(/ /g, ' ')
        const key = factIdFor(locale, label)
        const slot = out.get(key) || { labels: new Set(), pages: new Set(), langs: new Set() }
        slot.labels.add(label)
        slot.pages.add(place)
        slot.langs.add(locale)
        out.set(key, slot)
      }
    }
  }
  return out
}

// À vérifier: an answer from the agency nobody at the shop has looked at · À donner: no answer at all (the chef's page,
// off until then) · Vérifié: a person kept it or wrote it.
const stateOf = (answer) => (!answer?.fr ? 'missing' : answer.proposed ? 'proposed' : answer.enReview ? 'english' : 'verified')
const TAG = { missing: ['À donner', 'warn'], proposed: ['À vérifier', 'warn'], english: ['Anglais à revoir', 'warn'], verified: ['Vérifié', 'ok'] }

// « Faits du site » (Plus): every sentence of the site that depends on the shop, grouped as the owner thinks about it. The
// site shows the proposed answer from day one; the owner reads it and taps « C'est bon », or changes it. Structured facts
// keep their own screens: Produits, Boutique & heures.
export default async function Faits({ searchParams }) {
  const ctx = await studioPage('faits')
  const sp = (await searchParams) || {}
  const all = sp.tout === '1'
  const [slots, saved] = await Promise.all([slotsInCopy(ctx.payload), ctx.payload.find({ collection: 'site-facts', limit: 1000, depth: 0, pagination: false, ...ctx.as })])
  const answers = new Map(saved.docs.map((d) => [d.key, d]))
  const canEdit = ctx.can('fact.answer')
  const canConfirm = ctx.can('fact.confirm')

  // The catalog's facts that the copy asks for (or that already have an answer), then the slots it does not know.
  const known = new Set(FACTS.map((f) => f.id))
  const items = [
    ...FACTS.filter((f) => slots.has(f.id) || answers.has(f.id)).map((f) => ({ ...f, slot: slots.get(f.id) })),
    ...[...slots.entries()].filter(([key]) => !known.has(key)).map(([key, slot]) => ({ id: key, group: 'autres', q: [...slot.labels][0], fr: [], en: [], slot })),
  ]
  const state = (f) => stateOf(answers.get(f.id))
  const verified = items.filter((f) => state(f) === 'verified').length
  const toCheck = items.filter((f) => ['proposed', 'english'].includes(state(f))).length
  const toGive = items.filter((f) => state(f) === 'missing').length
  const groups = [...FACT_GROUPS, { id: 'autres', title: 'Autres faits', hint: 'Des phrases du site que la liste ne range pas encore.' }]

  return (
    <>
      <p>
        <Link href="/plus/">‹ Plus</Link>
      </p>
      <div className="st-head">
        <h1>Faits du site</h1>
      </div>
      <Flash ctx={ctx} searchParams={sp} back={BACK} />
      <section className="card facts-intro" aria-labelledby="faits-etat">
        <h2 id="faits-etat" className="facts-count">
          {verified} sur {items.length} réponses vérifiées
        </h2>
        <progress max={items.length || 1} value={verified} aria-labelledby="faits-etat" />
        <p>
          {toCheck} à vérifier · {toGive} à donner
        </p>
        <p>
          Le site affiche déjà une réponse proposée par l’agence. Lisez-la : si elle est juste, touchez « C’est bon ». Sinon, changez-la : le site suit aussitôt, en français et en anglais. Une réponse effacée revient à la proposition.
        </p>
        <p className="meta">
          Aussi dans Studio : <Link href="/plus/produits/">Produits</Link> (formats, prix, photos, allergènes, délai, taxe) · <Link href="/boutique/">Boutique &amp; heures</Link> (heures, fermetures, commande en ligne) ·{' '}
          <Link href="/plus/reglages/">Réglages</Link>.
        </p>
        <p className="meta">{all ? <Link href={BACK}>Voir seulement ce qui reste à faire</Link> : <Link href={`${BACK}?tout=1`}>Voir aussi les réponses déjà vérifiées</Link>}</p>
      </section>

      {groups.map((g) => {
        const list = items.filter((f) => f.group === g.id)
        if (!list.length) return null
        const shown = all ? list : list.filter((f) => state(f) !== 'verified')
        const done = list.filter((f) => state(f) === 'verified').length
        return (
          <section key={g.id} aria-labelledby={`g-${g.id}`} className="facts-group">
            <div className="facts-group-head">
              <h2 id={`g-${g.id}`}>{g.title}</h2>
              <span className="tag" data-tone={done === list.length ? 'ok' : 'warn'}>
                {done} / {list.length}
              </span>
            </div>
            <p className="meta">{g.hint}</p>
            {!shown.length && <p className="card empty">Tout est vérifié dans cette section.</p>}
            {shown.map((f) => {
              const a = answers.get(f.id)
              const st = state(f)
              const [word, tone] = TAG[st]
              const langs = f.slot ? [...f.slot.langs] : []
              const where = f.slot ? [...f.slot.pages].join(', ') : 'plus aucune page pour l’instant'
              const proposal = proposalFor(f.id)
              return (
                <article key={f.id} id={`fait-${f.id}`} className="card fact-card" aria-labelledby={`q-${f.id}`}>
                  <div className="card-head">
                    <h3 id={`q-${f.id}`}>{f.q}</h3>
                    <span className="tag" data-tone={tone}>
                      {word}
                    </span>
                  </div>
                  {a?.fr ? <p className="fact-answer">{a.fr}</p> : <p className="meta">{NO_PROPOSAL.includes(f.id) ? 'Aucune réponse proposée : seule la personne concernée peut la donner. La page du chef reste hors ligne tant qu’il manque une réponse.' : 'Pas encore de réponse : le site invite le client à demander à la boutique.'}</p>}
                  <p className="meta">
                    Sur : {where}
                    {langs.length ? ` · en ${langs.map((l) => LANGS[l]).join(' et ')}` : ''}
                  </p>
                  {REPEATS_PRODUCTS.has(f.id) && <p className="meta">Cette phrase répète un prix ou un délai de Produits : si vous en changez un, relisez-la.</p>}
                  {canEdit ? (
                    <div className="btn-row fact-actions">
                      {canConfirm && a?.fr && st !== 'verified' && (
                        <ActionForm type="fact.confirm" fields={{ key: f.id }} back={`${BACK}#fait-${f.id}`} needsNetwork>
                          <button className="btn btn-primary" type="submit">
                            C’est bon
                          </button>
                        </ActionForm>
                      )}
                      <details className="fact-edit" open={st === 'missing' || undefined}>
                        <summary className="btn">{a?.fr ? 'Changer' : 'Répondre'}</summary>
                        <ActionForm type="fact.answer" fields={{ key: f.id }} back={`${BACK}#fait-${f.id}`} pending="Enregistrement…" needsNetwork className="fact-form">
                          <div className="field">
                            <label htmlFor={`fr-${f.id}`}>Réponse</label>
                            <textarea id={`fr-${f.id}`} name="fr" rows={3} maxLength={1500} defaultValue={a?.fr || ''} aria-describedby={f.hint ? `h-${f.id}` : undefined} />
                            {f.hint && (
                              <span className="hint" id={`h-${f.id}`}>
                                {f.hint}
                              </span>
                            )}
                          </div>
                          <div className="field">
                            <label htmlFor={`en-${f.id}`}>En anglais (pour les pages anglaises)</label>
                            <textarea id={`en-${f.id}`} name="en" rows={3} maxLength={1500} lang="en" defaultValue={a?.en || ''} />
                          </div>
                          <button className="btn btn-primary" type="submit">
                            Enregistrer
                          </button>
                          {proposal && st === 'verified' && <p className="meta">Proposition de l’agence : {proposal.fr}</p>}
                        </ActionForm>
                      </details>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </section>
        )
      })}
    </>
  )
}
