import Link from 'next/link'
import { studioPage, firstParam } from '@/lib/studio/guard'
import { Flash } from '@/components/studio/Flash'
import { checkPost, CATEGORY_LABELS, dayOfPost } from '@/lib/journal'
import { FILTERS, matchesFilter, frenchTag, englishTag, factsTag, weekStrip, dayText } from '@/lib/studio/journal-view'
import { longDay } from '@/lib/studio/time'

export const metadata = { title: 'Journal · Coco Studio' }

const BACK = '/plus/journal/'

// Plus › Journal (the blog): every post with its French and English state, its facts and its checks; the next
// eight Mondays (one post a week at most); « Nouveau billet ». Traduction lands on « Anglais à faire ».
export default async function Journal({ searchParams }) {
  const ctx = await studioPage('journal')
  const sp = (await searchParams) || {}
  const now = new Date()
  const translator = ctx.user.role === 'traduction'
  const filter = FILTERS.some(([k]) => k === firstParam(sp.filtre)) ? firstParam(sp.filtre) : translator ? 'anglais' : 'tous'
  const [frRes, enRes, pagesRes] = await Promise.all([
    ctx.payload.find({ collection: 'posts', locale: 'fr', sort: '-publishedAt', limit: 500, depth: 0, pagination: false, ...ctx.as }),
    ctx.payload.find({ collection: 'posts', locale: 'en', sort: '-publishedAt', limit: 500, depth: 0, pagination: false, ...ctx.as }),
    ctx.payload.find({ collection: 'pages', locale: 'fr', limit: 500, depth: 0, pagination: false, overrideAccess: true }),
  ])
  const en = new Map(enRes.docs.map((d) => [d.id, d]))
  const others = frRes.docs.map((d) => ({ id: d.id, slug: d.slug, title: d.title, description: d.description, state: d.state, publishedAt: d.publishedAt }))
  const pages = pagesRes.docs.map((d) => ({ key: d.key, title: d.title, description: d.description }))
  const rows = frRes.docs.filter((d) => matchesFilter(filter, d, en.get(d.id), now))
  const strip = weekStrip(frRes.docs, now)
  return (
    <>
      <p>
        <Link href="/plus/">‹ Plus</Link>
      </p>
      <div className="st-head">
        <h1>Journal</h1>
      </div>
      <Flash ctx={ctx} searchParams={sp} back={BACK} />
      <p className="st-lead">Un billet par semaine au plus, le lundi à 6 h. Le français d’abord : l’anglais paraît une fois relu.</p>
      {ctx.can('post.saveFr') && (
        <p>
          <Link className="btn btn-primary" href="/plus/journal/nouveau/">
            Nouveau billet
          </Link>
        </p>
      )}

      <section aria-labelledby="semaines" className="card">
        <h2 id="semaines" style={{ marginTop: 0 }}>
          Les 8 prochains lundis
        </h2>
        <ul className="rows">
          {strip.map(({ monday, post }) => (
            <li key={monday}>
              <span className="grow">{longDay(monday)}</span>
              {post ? (
                <Link href={`/plus/journal/${post.id}/`}>{post.title || post.slug}</Link>
              ) : (
                <span className="tag">libre</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <nav className="btn-row" aria-label="Filtrer les billets">
        {FILTERS.map(([key, label]) => (
          <Link key={key} className="btn" href={`${BACK}?filtre=${key}`} aria-current={key === filter ? 'page' : undefined}>
            {label}
          </Link>
        ))}
      </nav>

      {!rows.length && <p className="card empty">Aucun billet ici pour l’instant.</p>}
      {rows.map((d) => {
        const e = en.get(d.id)
        const fr = frenchTag(d, now)
        const english = englishTag(e, d, now)
        const missing = factsTag(d)
        const { errors } = checkPost(d, 'fr', { others, pages })
        return (
          <article key={d.id} className="card">
            <div className="card-head">
              <h2 style={{ margin: 0, fontSize: '1.0625rem', textTransform: 'none', letterSpacing: 0 }}>
                <Link href={translator ? `/plus/journal/${d.id}/anglais/` : `/plus/journal/${d.id}/`}>{d.title || '(sans titre)'}</Link>
              </h2>
              <span className="tag" data-tone={fr.tone}>
                {fr.label}
              </span>
            </div>
            <p className="meta">
              {CATEGORY_LABELS.fr[d.category] || d.category} · {dayText(dayOfPost(d.publishedAt))}
            </p>
            <p className="btn-row">
              <span className="tag" data-tone={english.tone}>
                Anglais : {english.label}
              </span>
              {missing && (
                <Link className="tag" data-tone="warn" href="/plus/faits/">
                  {missing}
                </Link>
              )}
              <span className="tag" data-tone={errors.length ? 'bad' : 'ok'}>
                {errors.length ? `${errors.length} ${errors.length > 1 ? 'erreurs' : 'erreur'}` : 'Contrôle OK'}
              </span>
            </p>
          </article>
        )
      })}
    </>
  )
}
