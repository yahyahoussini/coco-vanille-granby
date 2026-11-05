import Link from 'next/link'
import { t, longDate } from '@/lib/i18n'
import { Fold } from '../catalogue/Fold'
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

// A fact with no answer at all, inside the copy: the same plain words as the template markers (Fact.js). The marker
// stays in data-marker, so the gate still counts it, and it stays out of search snippets.
const SLOT = /(\[\[FACT NEEDED: [^\]]+\]\])/
const withSlots = (text, render) =>
  text.split(SLOT).map((part, i) =>
    i % 2 ? (
      <span key={i} className="fact-needed" data-marker={part} data-nosnippet="" />
    ) : (
      render(part, i)
    ),
  )

export function Typeset({ text }) {
  if (typeof text !== 'string') return text ?? null
  // The same pattern decides and splits: a malformed marker ("[[FACT NEEDED]]", no closing brackets) stays plain text.
  if (SLOT.test(text)) return withSlots(text, (part, i) => <Typeset key={i} text={part} />)
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
// `fold`: the title stays in view, the list folds after its first lines. The home does not ask for it: it folds its
// whole card itself (home.js .intro-facts), and a clamp never goes inside a clamp.
export function KeyFacts({ items, locale, title, fold = false }) {
  const list = (items || []).filter(Boolean)
  if (!list.length) return null
  const facts = (
    <ul>
      {list.map((f, i) => (
        <li key={i}>{f}</li>
      ))}
    </ul>
  )
  return (
    <aside className="key-facts" aria-labelledby="key-facts-title" data-clamp={fold ? '' : undefined}>
      <h2 id="key-facts-title">{title || t(locale).keyFacts}</h2>
      {fold ? (
        <>
          <div className="clamp-body">{facts}</div>
          <ReadMore locale={locale} />
        </>
      ) : (
        facts
      )}
    </aside>
  )
}

// Below this many words a block is not worth a fold: on any screen it would hide about a line, or nothing. The server
// leaves it unfolded, so it never flashes a fade and a button before the browser has measured it.
const FOLD_MIN_WORDS = 28
const wordCount = (texts) => texts.filter(Boolean).join(' ').split(/\s+/).filter(Boolean).length

// One question-phrased h2 per sub-query; the first sentence answers.
// `slot` renders template content (a product list, a table) at the end of section `slot.after`.
// A section shows its h2 and its first lines, the rest under « Lire la suite », at every width. The text stays in the
// HTML and stays rendered, in the same order. A slot stays out of the fold, fully in view. Without JavaScript, and on
// paper, nothing folds; legal pages (`folds` false) never fold: a clipped clause would read as a hidden condition.
export function Sections({ sections, slot, locale, folds = true }) {
  const list = sections || []
  const at = slot ? Math.min(slot.after ?? 0, list.length - 1) : -1
  if (slot && !list.length) return slot.node
  return list.map((s, i) => {
    const paragraphs = s.body ? s.body.split(/\n{2,}/).filter((p) => p.trim()) : []
    const items = s.list || []
    const text = (
      <>
        <p className="qa-answer">
          <Typeset text={s.answer} />
        </p>
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
    const fold = folds && wordCount([s.answer, ...paragraphs, ...items.map((li) => li.item)]) >= FOLD_MIN_WORDS
    return (
      <section key={i} className="qa" data-clamp={fold ? '' : undefined}>
        <h2>
          <Unbroken text={s.heading} />
        </h2>
        {fold ? (
          <>
            <div className="clamp-body">{text}</div>
            <ReadMore locale={locale} />
          </>
        ) : (
          text
        )}
        {i === at && slot.node}
      </section>
    )
  })
}

// FAQ in <details>: readable without JavaScript, never hidden from crawlers.
export function Faq({ items, locale }) {
  if (!items?.length) return null
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">{t(locale).faq}</h2>
      {items.map((f, i) => (
        <details key={i}>
          {/* One flex item: the nowrap spans of Unbroken would each become a column of the row. */}
          <summary>
            <span>
              <Unbroken text={f.question} />
            </span>
          </summary>
          <p>
            <Typeset text={f.answer} />
          </p>
        </details>
      ))}
    </section>
  )
}

// One primary action per page type (v1 §7). A page that sells nothing (/allergenes/, /a-propos/) passes only its phone
// link: it is then the page's one action, and it shows as such.
export function ConversionBand({ primary, secondary }) {
  const main = primary || secondary
  if (!main) return null
  return (
    <div className="conversion-band" data-reveal="">
      <a className="btn btn-primary btn-large" href={main.href} data-event={main.event} data-magnetic="">
        {main.label}
        {primary && <Icon name="arrow" size={20} className="icon-arrow" />}
      </a>
      {primary && secondary && (
        <a className="btn btn-quiet btn-large" href={secondary.href} data-event={secondary.event}>
          {secondary.label}
        </a>
      )}
    </div>
  )
}

// Author + dates on every page, in view; the change note one tap away, in a small <details> (it can run to four lines).
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
    <>
      <p className="meta-line">
        {s.by} {doc.author || TEAM[locale] || TEAM.fr} · {s.published} <time dateTime={published}>{longDate(published, locale)}</time>
        {updated && (
          <>
            {' '}· {s.updated} <time dateTime={updated}>{longDate(updated, locale)}</time>
          </>
        )}
      </p>
      {doc.changeNote && (
        <Fold summary={s.changeNoteTitle} className="meta-note">
          <p>{doc.changeNote}</p>
        </Fold>
      )}
    </>
  )
}

// Headings: a hyphenated word (« centre-ville », « Paris-Brest ») never breaks at its hyphen.
// The text stays byte-identical for crawlers; only a nowrap span is added around the word.
export function Unbroken({ text }) {
  if (typeof text !== 'string') return text ?? null
  if (SLOT.test(text)) return withSlots(text, (part, i) => <Unbroken key={i} text={part} />)
  return text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className="nowrap">{part}</span> : part))
}
