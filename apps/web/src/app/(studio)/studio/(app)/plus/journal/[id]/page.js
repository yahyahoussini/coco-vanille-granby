import Link from 'next/link'
import { notFound } from 'next/navigation'
import { studioPage } from '@/lib/studio/guard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { CopyFields, SharedFields } from '@/components/studio/PostFields'
import { toFormValues } from '@/lib/studio/journal-form'
import { frenchTag, englishTag, dayText } from '@/lib/studio/journal-view'
import { checkPost, dayOfPost, postPath } from '@/lib/journal'
import { publishGuard } from '@/lib/facts'
import { localParts, relative } from '@/lib/studio/time'

export const metadata = { title: 'Billet · Coco Studio' }

const VERIFY = 'J’ai vérifié : ce billet ajoute un fait local, un détail vérifié de la boutique ou un tableau clair que les premiers résultats de Google n’ont pas, et chaque chiffre a sa date et sa source.'

function Issues({ title, list, tone }) {
  if (!list.length) return null
  return (
    <>
      <h3>{title}</h3>
      <ul className="rows">
        {list.map((x, i) => (
          <li key={i}>
            <span className="tag" data-tone={tone}>
              {x.code}
            </span>
            <span className="grow">{x.message}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

// One Journal post: the French editor, then « Contrôle » (the checks that block « Publier »), « Publication »,
// « Anglais » and « Historique ». Traduction reads the French and writes the English on its own screen.
export default async function Billet({ params, searchParams }) {
  const ctx = await studioPage('journal')
  const { id } = await params
  const doc = await ctx.payload.findByID({ collection: 'posts', id, locale: 'fr', depth: 1, ...ctx.as, disableErrors: true }).catch(() => null)
  if (!doc) notFound()
  const en = await ctx.payload.findByID({ collection: 'posts', id, locale: 'en', depth: 0, ...ctx.as, disableErrors: true }).catch(() => null)
  const now = new Date()
  const back = `/plus/journal/${doc.id}/`
  const [all, pages, history] = await Promise.all([
    ctx.payload.find({ collection: 'posts', locale: 'fr', limit: 500, depth: 0, pagination: false, ...ctx.as }),
    ctx.payload.find({ collection: 'pages', locale: 'fr', limit: 500, depth: 0, pagination: false, overrideAccess: true }),
    ctx.payload.find({ collection: 'audit-log', where: { and: [{ entity: { equals: 'posts' } }, { entityId: { equals: String(doc.id) } }] }, sort: '-createdAt', limit: 5, depth: 0, overrideAccess: true }),
  ])
  const others = all.docs.map((d) => ({ id: d.id, slug: d.slug, title: d.title, description: d.description, state: d.state, publishedAt: d.publishedAt }))
  const { errors, warnings } = checkPost(doc, 'fr', { others, pages: pages.docs.map((p) => ({ key: p.key, title: p.title, description: p.description })) })
  const tag = frenchTag(doc, now)
  const english = englishTag(en, doc, now)
  const published = doc.state === 'published'
  const editable = ctx.can('post.saveFr')
  const v = toFormValues(doc, 'fr')
  const owner = ctx.user.role === 'proprietaire'
  const live = published && new Date(doc.publishedAt) <= now
  const path = postPath(doc, 'fr')

  return (
    <>
      <p>
        <Link href="/plus/journal/">‹ Journal</Link>
      </p>
      <div className="st-head">
        <h1>{doc.title || '(sans titre)'}</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={back} />
      <p className="btn-row">
        <span className="tag" data-tone={tag.tone}>
          {tag.label}
        </span>
        <span className="tag" data-tone={english.tone}>
          Anglais : {english.label}
        </span>
        <a className="btn" href={`/plus/journal/${doc.id}/apercu/?langue=fr`}>
          Aperçu
        </a>
      </p>
      {live && path && <p className="meta">Adresse publique : {path}{publishGuard() === 'strict' && warnings.some((w) => w.code === 'W4') ? ' (cachée en production tant qu’un fait manque)' : ''}</p>}

      <section aria-labelledby="controle" className="card">
        <h2 id="controle" style={{ marginTop: 0 }}>
          Contrôle
        </h2>
        {errors.length ? <p className="tag" data-tone="bad">{`${errors.length} ${errors.length > 1 ? 'erreurs bloquent' : 'erreur bloque'} « Publier »`}</p> : <p className="tag" data-tone="ok">Contrôle OK</p>}
        <Issues title="À corriger" list={errors} tone="bad" />
        <Issues title="À regarder (ne bloque pas)" list={warnings} tone="warn" />
      </section>

      {editable && (
        <section aria-labelledby="publication" className="card">
          <h2 id="publication" style={{ marginTop: 0 }}>
            Publication
          </h2>
          {!published ? (
            <ActionForm type="post.publish" fields={{ id: doc.id }} back={back} needsNetwork pending="Publication…">
              <div className="field">
                <label htmlFor="pub-day">Jour de parution (6 h, heure de Granby)</label>
                <input id="pub-day" name="publishedAt" type="date" defaultValue={dayOfPost(doc.publishedAt) || ''} min={doc.releasedAt ? undefined : localParts(now).iso} required />
              </div>
              <label className="check">
                <input type="checkbox" name="verified" value="on" required />
                <span>{VERIFY}</span>
              </label>
              {owner && (
                <label className="check">
                  <input type="checkbox" name="override" value="1" />
                  <span>Permettre un deuxième billet la même semaine (propriétaire seulement).</span>
                </label>
              )}
              <div className="effects">
                <strong>Ça va changer :</strong> le billet paraît ce jour-là à 6 h, sur le Journal, l’accueil et les pages liées. Avant, son adresse répond « page introuvable ».
              </div>
              <button className="btn btn-primary" type="submit">
                Publier ou programmer
              </button>
            </ActionForm>
          ) : (
            <>
              <p>{live ? `En ligne depuis le ${dayText(dayOfPost(doc.publishedAt))}.` : `Programmé pour le ${dayText(dayOfPost(doc.publishedAt))}, 6 h.`}</p>
              <ActionForm type="post.unpublish" fields={{ id: doc.id }} back={back} needsNetwork pending="Retrait…">
                <div className="field">
                  <label htmlFor="reason">Raison (une ligne, gardée au registre)</label>
                  <input id="reason" name="reason" type="text" maxLength={200} required />
                </div>
                <button className="btn btn-danger" type="submit">
                  Retirer du site
                </button>
              </ActionForm>
            </>
          )}
        </section>
      )}

      <section aria-labelledby="anglais" className="card">
        <h2 id="anglais" style={{ marginTop: 0 }}>
          Anglais
        </h2>
        <p>
          {english.label === '—' ? 'Pas encore écrit.' : `État : ${english.label}.`} <Link href={`/plus/journal/${doc.id}/anglais/`}>Écrire ou relire l’anglais</Link>
        </p>
        {ctx.can('post.publishEn') && en?.title && (en.stateEn !== 'published' || en.enReviewNeeded) && (
          <ActionForm type="post.publishEn" fields={{ id: doc.id }} back={back} needsNetwork pending="Publication…">
            <label className="check">
              <input type="checkbox" name="verified" value="on" required />
              <span>Une personne qui écrit l’anglais couramment a relu ce billet.</span>
            </label>
            <button className="btn" type="submit">
              Publier l’anglais
            </button>
          </ActionForm>
        )}
        {ctx.can('post.unpublishEn') && en?.stateEn === 'published' && (
          <ActionForm type="post.unpublishEn" fields={{ id: doc.id }} back={back} needsNetwork>
            <button className="btn btn-danger" type="submit">
              Retirer l’anglais
            </button>
          </ActionForm>
        )}
      </section>

      <section aria-labelledby="texte" className="card">
        <h2 id="texte" style={{ marginTop: 0 }}>
          Le billet en français
        </h2>
        {published && editable && <div className="notice">Ce billet est en ligne : vos changements paraissent dès l’enregistrement, s’ils passent le contrôle.</div>}
        {editable ? (
          <ActionForm type="post.saveFr" fields={{ id: doc.id }} back={back} className="post-editor" pending="Enregistrement…" needsNetwork>
            <SharedFields v={v} />
            <CopyFields v={v} lang="fr" published={published} />
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
          </ActionForm>
        ) : (
          <fieldset disabled className="post-editor">
            <legend className="sr-only">Lecture seule</legend>
            <SharedFields v={v} />
            <CopyFields v={v} lang="fr" />
          </fieldset>
        )}
      </section>

      <section aria-labelledby="historique" className="card">
        <h2 id="historique" style={{ marginTop: 0 }}>
          Historique
        </h2>
        {history.docs.length ? (
          <ul className="rows">
            {history.docs.map((h) => (
              <li key={h.id}>
                <span className="grow">{h.summary || h.action}</span>
                <span className="meta">{relative(h.createdAt, now)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Aucun changement enregistré.</p>
        )}
        <p className="meta">Versions plus anciennes : « Avancé » › Journal › ce billet › Versions.</p>
      </section>
    </>
  )
}
