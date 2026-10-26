import Link from 'next/link'
import { t, longDate } from '@/lib/i18n'

// The page contract blocks (v1 §7; rank-first references/02-page-contract.md).

export function Breadcrumb({ crumbs }) {
  if (!crumbs || crumbs.length < 2) return null
  return (
    <nav aria-label="Fil d’Ariane" className="breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.url}>{i < crumbs.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
    </nav>
  )
}

// 40–60 words: brand + service + place + one dated number.
export function AnswerBlock({ text }) {
  if (!text) return null
  return <p className="answer">{text}</p>
}

// Five dated facts, brand named in each line (v1 §7): extractable as they stand.
export function KeyFacts({ items, locale, title }) {
  const list = (items || []).filter(Boolean)
  if (!list.length) return null
  return (
    <aside className="key-facts" aria-labelledby="key-facts-title">
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
export function Sections({ sections, slot }) {
  const list = sections || []
  const at = slot ? Math.min(slot.after ?? 0, list.length - 1) : -1
  if (slot && !list.length) return slot.node
  return list.map((s, i) => (
    <section key={i} className="qa">
      <h2>{s.heading}</h2>
      <p className="qa-answer">{s.answer}</p>
      {s.body && s.body.split(/\n{2,}/).map((para, j) => <p key={j}>{para}</p>)}
      {s.list?.length > 0 && (
        <ul>
          {s.list.map((li, j) => (
            <li key={j}>{li.item}</li>
          ))}
        </ul>
      )}
      {i === at && slot.node}
    </section>
  ))
}

// FAQ in <details>: readable without JavaScript, never hidden from crawlers.
export function Faq({ items, locale }) {
  if (!items?.length) return null
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">{t(locale).faq}</h2>
      {items.map((f, i) => (
        <details key={i}>
          <summary>{f.question}</summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </section>
  )
}

// One primary action per page type (v1 §7).
export function ConversionBand({ primary, secondary }) {
  if (!primary) return null
  return (
    <div className="conversion-band">
      <a className="btn btn-primary" href={primary.href} data-event={primary.event}>{primary.label}</a>
      {secondary && <a className="btn btn-quiet" href={secondary.href} data-event={secondary.event}>{secondary.label}</a>}
    </div>
  )
}

// Author + dates + one-line change note on every page.
export function MetaLine({ doc, locale }) {
  if (!doc) return null
  const s = t(locale)
  const updated = doc.contentUpdatedAt || doc.updatedAt
  return (
    <p className="meta-line">
      {s.by} {doc.author || 'L’équipe Coco Vanille'} · {s.published} <time dateTime={doc.createdAt}>{longDate(doc.createdAt, locale)}</time>
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
