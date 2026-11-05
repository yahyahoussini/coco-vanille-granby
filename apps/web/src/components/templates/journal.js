import Link from 'next/link'
import { t, longDate } from '@/lib/i18n'
import { pathFor } from '@/lib/routes'
import { getServedPosts } from '@/lib/data'
import { CATEGORY_LABELS, postPath, listPath, paginate, isoWithOffset, dateModifiedOf, dayOfPost, relatedLinks, photoKnown } from '@/lib/journal'
import { mediaFile } from '@/lib/media'
import { AnswerBlock, Sections, Faq, ConversionBand, Unbroken } from '../site/Contract'
import { Photo } from '../site/Products'
import { StockPhoto } from '../site/StockPhoto'
import { Ornament } from '../site/Ornament'
import { Fold } from '../catalogue/Fold'
import { ContentTemplate, answers, orderAction, mapsAction, phoneAction } from './shared'

// The Journal (blog): the index and its pages (template « journal », registry page), the post page (template
// « post »), the cards the index, the home page and the related pages show, and the post body Studio previews.
// Posts come from lib/data.js getServedPosts (the publish guard of lib/journal.js). Styles: src/styles/journal.css.

// A source's date is a calendar day as written (« 2026-10-01 »): read at noon so no time zone moves it.
const dayLabel = (day, locale) => (day ? longDate(`${day}T12:00:00Z`, locale) : '')
const categoryOf = (post, locale) => CATEGORY_LABELS[locale]?.[post?.category] || CATEGORY_LABELS.fr[post?.category] || ''
// The shop's own photo (the post's « hero » upload) replaces the illustration as soon as it exists.
export const ownHeroOf = (post) => (post?.hero && typeof post.hero === 'object' && mediaFile(post.hero, 'hero') ? post.hero : null)
const photoKeyOf = (post) => (photoKnown(post?.photo) ? post.photo : 'hero')

// One post in a list: its picture, category, title (the post's own h1, never « Lire la suite »), description and date.
// `compact` (the home page): a row with a small picture and the first words of the description; the whole row links
// to the post, where the rest is. Same HTML on every screen, journal.css lays it out.
export function PostCard({ post, locale, compact = false }) {
  const href = postPath(post, locale)
  if (!href) return null
  const own = ownHeroOf(post)
  const Heading = compact ? 'h3' : 'h2'
  return (
    <li>
      <article className={`post-card${compact ? ' is-compact' : ''}`}>
        <div className="post-card-media">
          {own ? (
            <Photo media={own} size="card" />
          ) : (
            <StockPhoto name={photoKeyOf(post)} locale={locale} decorative sizes={compact ? '(min-width: 48rem) 11rem, 5rem' : '(min-width: 60rem) 18rem, (min-width: 48rem) 45vw, 92vw'} />
          )}
        </div>
        <div className="post-card-body">
          <span className="post-card-category">{categoryOf(post, locale)}</span>
          <Heading className="post-card-title">
            <Link href={href}>
              <Unbroken text={post.h1} />
            </Link>
          </Heading>
          {post.description && <p className="post-card-text">{post.description}</p>}
          <time className="post-card-date" dateTime={isoWithOffset(post.publishedAt)}>
            {longDate(post.publishedAt, locale)}
          </time>
        </div>
      </article>
    </li>
  )
}

// Real links (no fragment, no button): « Billets plus récents », the page numbers, « Billets plus anciens ».
function JournalPager({ pager, locale }) {
  if (!pager || pager.pages < 2) return null
  const j = t(locale).journal
  return (
    <nav className="journal-pager" aria-label={j.pages}>
      {pager.prev && (
        <Link href={listPath(locale, pager.prev)} className="btn btn-quiet" rel="prev">
          {j.newer}
        </Link>
      )}
      <ol className="journal-pages">
        {Array.from({ length: pager.pages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n === pager.page ? (
              <span aria-current="page">{n}</span>
            ) : (
              <Link href={listPath(locale, n)} aria-label={j.page(n)}>
                {n}
              </Link>
            )}
          </li>
        ))}
      </ol>
      {pager.next && (
        <Link href={listPath(locale, pager.next)} className="btn btn-quiet" rel="next">
          {j.older}
        </Link>
      )}
    </nav>
  )
}

function PostList({ items, locale, pager }) {
  const j = t(locale).journal
  return (
    <section aria-labelledby="journal-list" className="journal-list">
      <h2 id="journal-list" className="visually-hidden">
        {j.listTitle}
      </h2>
      <ol className="post-cards">
        {items.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} />
        ))}
      </ol>
      <JournalPager pager={pager} locale={locale} />
    </section>
  )
}

// The index (/journal/, /en/journal/) and its pages (/journal/page/2/…): newest first, 12 per page. Page 1 keeps
// the index copy (answer, sections, FAQ) around the list; the next pages show the h1, the list and the pager only.
export async function JournalTemplate(props) {
  const { locale, doc, served, listPage = 1 } = props
  const posts = (await getServedPosts())[locale] || []
  const pager = paginate(posts, listPage)
  const j = t(locale).journal
  if (listPage > 1) {
    return (
      <article className="wrap page journal-index">
        <header className="page-head">
          <Ornament name="vanilla" className="page-head-ornament" />
          <h1>
            <Unbroken text={doc?.h1 || doc?.title} />
          </h1>
        </header>
        {pager && <PostList items={pager.items} locale={locale} pager={pager} />}
      </article>
    )
  }
  return (
    <ContentTemplate {...props} className="journal-index" primary={orderAction(locale, served)}>
      {posts.length ? <PostList items={pager.items} locale={locale} pager={pager} /> : <p className="notice journal-empty">{j.empty}</p>}
    </ContentTemplate>
  )
}

// The body of a post page (also Studio's preview, without the site's header and footer). The answer stays the
// first paragraph of <main> (tools/audit.mjs reads it there). `served`: the registry pages the site answers
// (lib/data.js getServed); `around`: the newer and older posts served in this language.
export function PostArticle({ post, locale, business, served, around = {}, preview = false }) {
  const s = t(locale)
  const j = s.journal
  const published = isoWithOffset(post.publishedAt)
  const modifiedAt = dateModifiedOf(post)
  const updated = dayOfPost(modifiedAt) !== dayOfPost(post.publishedAt)
  const about = answers(served, locale, 'a-propos') ? pathFor('a-propos', locale) : null
  const team = j.team(business?.name || 'Pâtisserie Coco Vanille')
  const own = ownHeroOf(post)
  const related = relatedLinks(post, locale, served?.[locale] || null)
  const primary = post.category === 'granby' ? mapsAction(business, locale) : orderAction(locale, served)
  const link = (p) => (preview ? <span>{p.h1}</span> : <Link href={postPath(p, locale)}>{p.h1}</Link>)
  return (
    <article className="wrap page post">
      <header className="page-head">
        <Ornament name="vanilla" className="page-head-ornament" />
        <span className="eyebrow post-category">{categoryOf(post, locale)}</span>
        <h1>
          <Unbroken text={post.h1} />
        </h1>
        <AnswerBlock text={post.answer} />
        <p className="meta-line post-byline">
          {s.by} {about ? <a href={about} rel="author">{team}</a> : team} · {s.published} <time dateTime={published}>{longDate(post.publishedAt, locale)}</time>
          {updated && (
            <>
              {' '}· {s.updated} <time dateTime={isoWithOffset(modifiedAt)}>{longDate(modifiedAt, locale)}</time>
            </>
          )}
        </p>
      </header>
      {own ? (
        <figure className="page-hero">
          <Photo media={own} size="hero" priority />
        </figure>
      ) : (
        <StockPhoto name={photoKeyOf(post)} locale={locale} caption priority className="page-hero" sizes="(min-width: 60rem) 56rem, 92vw" />
      )}
      <Sections sections={post.sections} locale={locale} />
      {(post.sources || []).length > 0 && (
        <section className="post-sources" aria-labelledby="post-sources">
          {/* Reference material: closed, with its count. The links stay in the HTML and the h2 keeps its exact words. */}
          <Fold
            summary={
              <>
                <h2 id="post-sources">{j.sources}</h2>
                <span className="post-sources-count">· {post.sources.length}</span>
              </>
            }
          >
            <ol>
              {post.sources.map((src, i) => (
                <li key={src.id || i}>
                  <a href={src.url} rel="noopener">
                    {src.label}
                  </a>
                  {src.date && (
                    <>
                      {' · '}
                      <time dateTime={src.date}>{dayLabel(src.date, locale)}</time>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </Fold>
        </section>
      )}
      <Faq items={post.faq} locale={locale} />
      {related.length > 0 && (
        <nav className="related related-line post-related" aria-labelledby="post-related">
          <h2 id="post-related">{s.related}</h2>
          <ul>
            {related.map((key) => (
              <li key={key}>
                <Link href={pathFor(key, locale)}>{s.pageNames[key] || s.nav[key]}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {(around.older || around.newer) && (
        <nav className="post-around" aria-label={j.around}>
          {around.older && (
            <p className="post-around-older">
              <span className="post-around-label">{j.prev}</span>
              {link(around.older)}
            </p>
          )}
          {around.newer && (
            <p className="post-around-newer">
              <span className="post-around-label">{j.next}</span>
              {link(around.newer)}
            </p>
          )}
        </nav>
      )}
      <ConversionBand primary={primary || phoneAction(business, locale)} secondary={primary ? phoneAction(business, locale) : null} />
      {post.changeNote && (
        <footer className="post-footer">
          {/* The same small fold as the meta line of the other pages (Contract.js MetaLine): the dates stay in the byline. */}
          <Fold summary={s.changeNoteTitle} className="meta-note">
            <p>{post.changeNote}</p>
          </Fold>
        </footer>
      )}
    </article>
  )
}

// The post page: SitePage passes the post it found among the served posts of this language.
export async function PostTemplate(props) {
  const { post, locale } = props
  const list = (await getServedPosts())[locale] || []
  const i = list.findIndex((p) => p.id === post.id)
  // Newest first: the newer post sits before this one, the older one after.
  const around = i < 0 ? {} : { newer: list[i - 1] || null, older: list[i + 1] || null }
  return <PostArticle {...props} around={around} />
}
