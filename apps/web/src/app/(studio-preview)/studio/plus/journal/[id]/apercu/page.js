import { notFound } from 'next/navigation'
import { studioPage, firstParam } from '@/lib/studio/guard'
import { getBusiness, getServed, getServedPosts, getFactAnswers } from '@/lib/data'
import { resolveFacts } from '@/lib/facts'
import { factIdFor } from '@/lib/facts-catalog'
import { HTML_LANG } from '@/lib/routes'
import { PostArticle } from '@/components/templates/journal'

export const dynamic = 'force-dynamic'

// « Aperçu » (Plus › Journal › a post): the post as the public page renders it, draft, scheduled or live, with the
// answered facts filled and the others shown as markers. ?langue=fr|en.
export default async function Apercu({ params, searchParams }) {
  const ctx = await studioPage('journal')
  const { id } = await params
  const locale = firstParam((await searchParams)?.langue) === 'en' ? 'en' : 'fr'
  const doc = await ctx.payload.findByID({ collection: 'posts', id, locale, depth: 1, ...ctx.as, disableErrors: true }).catch(() => null)
  if (!doc || !doc.title) notFound()
  const [business, served, posts, answers] = await Promise.all([getBusiness(locale), getServed(), getServedPosts(), getFactAnswers(locale)])
  const post = resolveFacts(doc, answers, (label) => factIdFor(locale, label))
  const live = posts.ids[locale]?.has(doc.id)
  const back = locale === 'en' ? `/plus/journal/${doc.id}/anglais/` : `/plus/journal/${doc.id}/`
  return (
    <>
      <div className="wrap" style={{ paddingBlock: '1rem' }}>
        <p className={live ? 'translation-notice notice' : 'notice'} role="status">
          {live ? 'Aperçu · ce billet est en ligne.' : 'Aperçu · pas encore en ligne.'} <a href={back}>‹ Retour au billet</a>
        </p>
      </div>
      <main id="contenu" className="site-main" lang={HTML_LANG[locale]}>
        <PostArticle post={post} locale={locale} business={business} served={served} preview />
      </main>
    </>
  )
}
