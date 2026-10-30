import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { FACT_GROUPS, FACTS, factIdFor } from '@/lib/facts-catalog'

export const metadata = { title: 'Faits du site · Coco Studio' }

const BACK = '/plus/faits/'
const SLOT = /\[\[FACT NEEDED: ([^\]]+)\]\]/g
const LANGS = { fr: 'français', en: 'anglais' }
const PAGE_NAMES = {
  home: 'Accueil', carte: 'Carte', commander: 'Commander', 'nous-trouver': 'Nous trouver', 'zoo-de-granby': 'Depuis le Zoo', 'a-propos': 'À propos', chef: 'Le chef',
  prix: 'Prix', 'gateau-pour-demain': 'Gâteau pour demain', 'gateaux-personnalises': 'Gâteaux personnalisés', buches: 'Bûches de Noël', allergenes: 'Allergènes',
  faq: 'FAQ', calculateur: 'Calculateur de portions', viennoiseries: 'Viennoiseries', pains: 'Pains et baguettes', gateaux: 'Gâteaux', patisseries: 'Pâtisseries',
  confidentialite: 'Confidentialité', 'conditions-de-vente': 'Conditions de vente', temoins: 'Témoins', accessibilite: 'Accessibilité',
}

// Every [[FACT NEEDED]] slot left in the published copy, per language: fact key → { labels, pages, langs }.
// Read from the stored copy (not the filled one), so an answered fact still shows where it appears.
async function slotsInCopy(payload) {
  const out = new Map()
  for (const locale of ['fr', 'en']) {
    const res = await payload.find({ collection: 'pages', where: { _status: { equals: 'published' } }, locale, limit: 500, depth: 0, pagination: false, overrideAccess: true })
    for (const doc of res.docs) {
      for (const m of JSON.stringify(doc).matchAll(SLOT)) {
        const label = m[1].replace(/ /g, ' ')
        const key = factIdFor(locale, label)
        const slot = out.get(key) || { labels: new Set(), pages: new Set(), langs: new Set() }
        slot.labels.add(label)
        slot.pages.add(doc.key)
        slot.langs.add(locale)
        out.set(key, slot)
      }
    }
  }
  return out
}

// « Faits du site » (Plus): every answer the site still waits for, grouped as the owner thinks about the shop.
// One answer fills every sentence that asks for it, at once, in its language; a page goes live when all its
// facts are given (publish guard). Structured facts keep their own screens: Produits, Boutique & heures.
export default async function Faits({ searchParams }) {
  const ctx = await studioPage('faits')
  const sp = (await searchParams) || {}
  const onlyMissing = sp.tout !== '1'
  const [slots, saved] = await Promise.all([slotsInCopy(ctx.payload), ctx.payload.find({ collection: 'site-facts', limit: 1000, depth: 0, pagination: false, ...ctx.as })])
  const answers = new Map(saved.docs.map((d) => [d.key, d]))
  const canEdit = ctx.can('fact.answer')

  // The catalog's facts that the copy asks for (or that already have an answer), then the slots it does not know.
  const known = new Set(FACTS.map((f) => f.id))
  const items = [
    ...FACTS.filter((f) => slots.has(f.id) || answers.has(f.id)).map((f) => ({ ...f, slot: slots.get(f.id) })),
    ...[...slots.entries()].filter(([key]) => !known.has(key)).map(([key, slot]) => ({ id: key, group: 'autres', q: [...slot.labels][0], fr: [], en: [], slot })),
  ]
  const done = (f) => Boolean(answers.get(f.id)?.fr)
  const total = items.length
  const answered = items.filter(done).length
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
          {answered} sur {total} réponses données
        </h2>
        <progress max={total || 1} value={answered} aria-labelledby="faits-etat" />
        <p>
          Chaque réponse s’affiche aussitôt dans les phrases du site qui la demandent. Une page se publie dès que tous ses faits sont donnés. « Je ne sais pas encore » : laissez vide.
        </p>
        <p className="meta">
          Aussi dans Studio : <Link href="/plus/produits/">Produits</Link> (prix, portions, allergènes, délai, taxe) · <Link href="/boutique/">Boutique &amp; heures</Link> (heures, fermetures, jours fériés) ·{' '}
          <Link href="/plus/reglages/">Réglages</Link>.
        </p>
        <p className="meta">{onlyMissing ? <Link href={`${BACK}?tout=1`}>Voir aussi les faits déjà donnés</Link> : <Link href={BACK}>Voir seulement les faits à donner</Link>}</p>
      </section>

      {groups.map((g) => {
        const all = items.filter((f) => f.group === g.id)
        if (!all.length) return null
        const shown = onlyMissing ? all.filter((f) => !done(f)) : all
        const groupDone = all.filter(done).length
        return (
          <section key={g.id} aria-labelledby={`g-${g.id}`} className="facts-group">
            <div className="facts-group-head">
              <h2 id={`g-${g.id}`}>{g.title}</h2>
              <span className="tag" data-tone={groupDone === all.length ? 'ok' : 'warn'}>
                {groupDone} / {all.length}
              </span>
            </div>
            <p className="meta">{g.hint}</p>
            {!shown.length && <p className="card empty">Tout est donné dans cette section.</p>}
            {shown.map((f) => {
              const a = answers.get(f.id)
              const langs = f.slot ? [...f.slot.langs] : []
              const needsEn = langs.includes('en') || Boolean(a?.en)
              const where = f.slot ? [...f.slot.pages].map((k) => PAGE_NAMES[k] || k).join(', ') : 'plus aucune page pour l’instant'
              return (
                <details key={f.id} className="card fact" open={!done(f)}>
                  <summary>
                    <span className="grow">{f.q}</span>
                    <span className="tag" data-tone={done(f) ? 'ok' : 'warn'}>
                      {done(f) ? (needsEn && !a?.en ? 'Donné (français)' : 'Donné') : 'À donner'}
                    </span>
                  </summary>
                  <p className="meta">
                    Sur : {where}
                    {langs.length ? ` · en ${langs.map((l) => LANGS[l]).join(' et ')}` : ''}
                  </p>
                  {canEdit ? (
                    <ActionForm type="fact.answer" fields={{ key: f.id }} back={BACK} pending="Enregistrement…" needsNetwork>
                      <div className="field">
                        <label htmlFor={`fr-${f.id}`}>Réponse</label>
                        <textarea id={`fr-${f.id}`} name="fr" rows={2} maxLength={1500} defaultValue={a?.fr || ''} aria-describedby={f.hint ? `h-${f.id}` : undefined} />
                        {f.hint && (
                          <span className="hint" id={`h-${f.id}`}>
                            {f.hint}
                          </span>
                        )}
                      </div>
                      {needsEn && (
                        <div className="field">
                          <label htmlFor={`en-${f.id}`}>En anglais (pour les pages anglaises)</label>
                          <textarea id={`en-${f.id}`} name="en" rows={2} maxLength={1500} lang="en" defaultValue={a?.en || ''} />
                        </div>
                      )}
                      <button className="btn btn-primary" type="submit">
                        Enregistrer
                      </button>
                    </ActionForm>
                  ) : (
                    <p>{a?.fr || '—'}</p>
                  )}
                </details>
              )
            })}
          </section>
        )
      })}
    </>
  )
}
