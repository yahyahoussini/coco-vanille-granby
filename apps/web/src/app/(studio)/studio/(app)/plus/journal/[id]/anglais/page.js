import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studioPage } from '@/lib/studio/guard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { CopyFields } from '@/components/studio/PostFields'
import { toFormValues } from '@/lib/studio/journal-form'
import { englishTag } from '@/lib/studio/journal-view'
import { checkPost } from '@/lib/journal'

export const metadata = { title: 'Billet en anglais · Coco Studio' }

// The English adaptation of a post: each field under its French text (natural Canadian English, not a word-for-word
// translation). Traduction writes it here; a person of the shop or the agency releases it on the post's screen.
export default async function BilletAnglais({ params, searchParams }) {
  const ctx = await studioPage('journal')
  const { id } = await params
  const [fr, en] = await Promise.all(
    ['fr', 'en'].map((locale) => ctx.payload.findByID({ collection: 'posts', id, locale, depth: 0, ...ctx.as, disableErrors: true }).catch(() => null)),
  )
  if (!fr || !en) notFound()
  const back = `/plus/journal/${fr.id}/anglais/`
  const now = new Date()
  const [all, pages] = await Promise.all([
    ctx.payload.find({ collection: 'posts', locale: 'en', limit: 500, depth: 0, pagination: false, ...ctx.as }),
    ctx.payload.find({ collection: 'pages', locale: 'en', limit: 500, depth: 0, pagination: false, overrideAccess: true }),
  ])
  const others = all.docs.map((d) => ({ id: d.id, slug: d.slug, title: d.title, description: d.description, state: d.state, publishedAt: d.publishedAt }))
  const { errors, warnings } = en.title ? checkPost(en, 'en', { others, pages: pages.docs.map((p) => ({ key: p.key, title: p.title, description: p.description })) }) : { errors: [], warnings: [] }
  const english = englishTag(en, fr, now)
  return (
    <>
      <p>
        <Link href={ctx.can('post.saveFr') ? `/plus/journal/${fr.id}/` : '/plus/journal/'}>‹ {fr.title || 'Journal'}</Link>
      </p>
      <div className="st-head">
        <h1>En anglais</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={back} />
      <p className="btn-row">
        <span className="tag" data-tone={english.tone}>
          {english.label === '—' ? 'Pas encore écrit' : english.label}
        </span>
        {en.title && (
          <a className="btn" href={`/plus/journal/${fr.id}/apercu/?langue=en`}>
            Aperçu
          </a>
        )}
      </p>
      {!fr.title ? (
        <p className="card empty">Écrivez d’abord le billet en français.</p>
      ) : (
        <>
          {en.title && (
            <section aria-labelledby="controle-en" className="card">
              <h2 id="controle-en" style={{ marginTop: 0 }}>
                Contrôle
              </h2>
              {errors.length ? <p className="tag" data-tone="bad">{`${errors.length} ${errors.length > 1 ? 'erreurs' : 'erreur'} avant la publication`}</p> : <p className="tag" data-tone="ok">Contrôle OK</p>}
              <ul className="rows">
                {[...errors, ...warnings].map((x, i) => (
                  <li key={i}>
                    <span className="tag" data-tone={x.code.startsWith('E') ? 'bad' : 'warn'}>
                      {x.code}
                    </span>
                    <span className="grow">{x.message}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {en.stateEn === 'published' && <div className="notice">L’anglais est en ligne : vos changements paraissent dès l’enregistrement, s’ils passent le contrôle.</div>}
          <ActionForm type="post.saveEn" fields={{ id: fr.id }} back={back} className="card post-editor post-editor-en" pending="Enregistrement…" needsNetwork>
            <CopyFields v={toFormValues(en, 'en')} lang="en" french={toFormValues(fr, 'fr')} />
            <button className="btn btn-primary" type="submit">
              Enregistrer l’anglais
            </button>
          </ActionForm>
        </>
      )}
    </>
  )
}
