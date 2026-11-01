import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { CopyFields, SharedFields } from '@/components/studio/PostFields'
import { toFormValues } from '@/lib/studio/journal-form'
import { nextFreeMonday } from '@/lib/studio/journal-view'

export const metadata = { title: 'Nouveau billet · Coco Studio' }

const BACK = '/plus/journal/nouveau/'

// A new Journal post, in French (the English comes after). « Enregistrer » keeps a draft; nothing is public before
// « Publier » on the post's screen.
export default async function NouveauBillet({ searchParams }) {
  const ctx = await studioPage('journal')
  if (!ctx.can('post.saveFr')) {
    return (
      <>
        <p>
          <Link href="/plus/journal/">‹ Journal</Link>
        </p>
        <p className="card empty">Seules la boutique et l’agence écrivent les billets en français.</p>
      </>
    )
  }
  const posts = await ctx.payload.find({ collection: 'posts', locale: 'fr', limit: 500, depth: 0, pagination: false, ...ctx.as })
  const v = toFormValues({ category: 'conseils', photo: 'hero', related: [], publishedAt: nextFreeMonday(posts.docs) }, 'fr')
  return (
    <>
      <p>
        <Link href="/plus/journal/">‹ Journal</Link>
      </p>
      <div className="st-head">
        <h1>Nouveau billet</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />
      <ActionForm type="post.saveFr" back={BACK} className="card post-editor" pending="Enregistrement…" needsNetwork>
        <SharedFields v={v} />
        <CopyFields v={v} lang="fr" />
        <button className="btn btn-primary" type="submit">
          Enregistrer le brouillon
        </button>
      </ActionForm>
    </>
  )
}
