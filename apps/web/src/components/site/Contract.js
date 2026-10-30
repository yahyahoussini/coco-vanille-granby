import Link from 'next/link'
import { t, longDate } from '@/lib/i18n'
import { Icon } from './Icon'
import { ReadMore } from './ReadMore'

// The page contract blocks (v1 §7; rank-first references/02-page-contract.md).

const TRAIL = { fr: 'Fil d’Ariane', en: 'Breadcrumb', es: 'Ruta de navegación' }

export function Breadcrumb({ crumbs }) {
  if (!crumbs || crumbs.length < 2) return null
  // The first crumb is the home page of the page's language: /, /en/ or /es/.
  const locale = crumbs[0]?.path?.match(/^\/(en|es)\//)?.[1] || 'fr'
  return (
    <nav aria-label={TRAIL[locale]} className="breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.url}>{i < crumbs.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
    </nav>
  )
}

// Body text: a phone number, a clock time (« 8 h 30 », "5:30 p.m."), a postal code and French spaced punctuation
// (« Heures : », « … ») never break across two lines. The text stays byte-identical; only nowrap spans are added.
const KEEP = /(\d{3}-\d{3}-\d{4}|\b\d{1,2} h(?: \d{2})?(?!\p{L})|\b\d{1,2}(?::\d{2})? [ap]\.m\.|\b[A-Z]\d[A-Z] \d[A-Z]\d\b|« \S+|\S+(?: [:;!?»])+(?=\s|$))/u

export function Typeset({ text }) {
  if (typeof text !== 'string') return text ?? null
  const parts = text.split(KEEP)
  if (parts.length === 1) return text
  return parts.map((part, i) => (i % 2 ? <span key={i} className="nowrap">{part}</span> : part))
}

// 40–60 words: brand + service + place + one dated number.
export function AnswerBlock({ text }) {
  if (!text) return null
  return (
    <p className="answer">
      <Typeset text={text} />
    </p>
  )
}

// Five dated facts, brand named in each line (v1 §7): extractable as they stand.
export function KeyFacts({ items, locale, title }) {
  const list = (items || []).filter(Boolean)
  if (!list.length) return null
  return (
    <aside className="key-facts" aria-labelledby="key-facts-title" data-reveal="">
      <h2 id="key-facts-title">{title || t(locale).keyFacts}</h2>
      <ul>
        {list.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </aside>
  )
}

// One question-phrased h2 per sub-query; the first sentence answers.
// `slot` renders template content (a product list, a table) at the end of section `slot.after`.
// On phones, what follows the answer passage (paragraphs, a list) folds under « Lire la suite »; the answer itself
// and a section that holds a slot always show in full. Without JavaScript, or from 48rem, nothing folds; legal
// pages (`folds` false) never fold: a clipped clause would read as a hidden condition.
export function Sections({ sections, slot, locale, folds = true }) {
  const list = sections || []
  const at = slot ? Math.min(slot.after ?? 0, list.length - 1) : -1
  if (slot && !list.length) return slot.node
  return list.map((s, i) => {
    const paragraphs = s.body ? s.body.split(/\n{2,}/).filter((p) => p.trim()) : []
    const items = s.list || []
    const rest = (paragraphs.length > 0 || items.length > 0) && (
      <>
        {paragraphs.map((para, j) => (
          <p key={j}>
            <Typeset text={para} />
          </p>
        ))}
        {items.length > 0 && (
          <ul>
            {items.map((li, j) => (
              <li key={j}>
                <Typeset text={li.item} />
              </li>
            ))}
          </ul>
        )}
      </>
    )
    const fold = folds && Boolean(rest) && i !== at
    return (
      <section key={i} className="qa" data-reveal="" data-clamp={fold ? '' : undefined}>
        <h2>
          <Unbroken text={s.heading} />
        </h2>
        <p className="qa-answer">
          <Typeset text={s.answer} />
        </p>
        {fold ? <div className="clamp-body">{rest}</div> : rest}
        {fold && <ReadMore locale={locale} />}
        {i === at && slot.node}
      </section>
    )
  })
}

// FAQ in <details>: readable without JavaScript, never hidden from crawlers.
export function Faq({ items, locale }) {
  if (!items?.length) return null
  return (
    <section className="faq" aria-labelledby="faq-title" data-reveal="">
      <h2 id="faq-title">{t(locale).faq}</h2>
      {items.map((f, i) => (
        <details key={i}>
          <summary>
            <Unbroken text={f.question} />
          </summary>
          <p>
            <Typeset text={f.answer} />
          </p>
        </details>
      ))}
    </section>
  )
}

// One primary action per page type (v1 §7).
export function ConversionBand({ primary, secondary }) {
  if (!primary) return null
  return (
    <div className="conversion-band" data-reveal="">
      <a className="btn btn-primary btn-large" href={primary.href} data-event={primary.event} data-magnetic="">
        {primary.label}
        <Icon name="arrow" size={20} className="icon-arrow" />
      </a>
      {secondary && (
        <a className="btn btn-quiet btn-large" href={secondary.href} data-event={secondary.event}>
          {secondary.label}
        </a>
      )}
    </div>
  )
}

// Author + dates + one-line change note on every page.
// « Publié » is the earlier of the record's creation and its copy's date (the seed dates the copy, the database
// dates the record), so an update never reads as older than the publication; « Mis à jour » shows only when the
// copy changed on a later day.
const TEAM = { fr: 'l’équipe Coco Vanille', en: 'the Coco Vanille team', es: 'el equipo de Coco Vanille' }
const dayOf = (iso) => (iso ? longDate(iso, 'en') : '')

export function MetaLine({ doc, locale }) {
  if (!doc) return null
  const s = t(locale)
  const changed = doc.contentUpdatedAt || doc.updatedAt
  const published = [doc.createdAt, doc.contentUpdatedAt].filter(Boolean).sort()[0] || doc.createdAt
  const updated = changed && changed > published && dayOf(changed) !== dayOf(published) ? changed : null
  return (
    <p className="meta-line">
      {s.by} {doc.author || TEAM[locale] || TEAM.fr} · {s.published} <time dateTime={published}>{longDate(published, locale)}</time>
      {updated && (
        <>
          {' '}· {s.updated} <time dateTime={updated}>{longDate(updated, locale)}</time>
        </>
      )}
      {doc.changeNote && <> · {doc.changeNote}</>}
    </p>
  )
}

// Headings: a hyphenated word (« centre-ville », « Paris-Brest ») never breaks at its hyphen.
// The text stays byte-identical for crawlers; only a nowrap span is added around the word.
export function Unbroken({ text }) {
  if (typeof text !== 'string') return text ?? null
  return text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className="nowrap">{part}</span> : part))
}
