'use client'
import { useEffect, useId, useRef } from 'react'
import { Icon } from './Icon'

const LABELS = {
  fr: ['Lire la suite', 'Réduire'],
  en: ['Read more', 'Show less'],
  es: ['Leer más', 'Mostrar menos'],
}

// « Lire la suite » for a long block, at every width (styles: site.css). Markup, server side:
//   <section data-clamp="">
//     <h2>…</h2>
//     <div className="clamp-body">…every paragraph, list, link…</div>
//     <ReadMore locale={locale} />
//   </section>
// The text is always in the HTML, and stays rendered. CSS clamps .clamp-body on screen only and only once html.js is
// set, so without JavaScript, and on paper, everything shows. The default is three lines (--clamp-height changes it).
// A block too short to be worth a fold gets no markup at all (Contract.js foldsAt): no flash of a fade and a button.
//
// The button's behaviour lives in FoldScript.js, in the <head>: it has to work before this component hydrates, and two
// owners of the open state could only disagree. So this renders the button once and leaves it alone: the attributes and
// the label it may find changed are the DOM's to keep (suppressHydrationWarning), and the only thing left to do here is to
// measure again when the block changes size, or when a move inside the site brings a new block.
export function ReadMore({ locale = 'fr', labels }) {
  const [more, less] = labels || LABELS[locale] || LABELS.fr
  const ref = useRef(null)
  const id = useId()

  useEffect(() => {
    const box = ref.current?.closest('[data-clamp]')
    const body = box?.querySelector('.clamp-body')
    if (!box || !body) return undefined
    if (!body.id) body.id = `clamp-${id.replace(/[^\w-]/g, '')}`
    ref.current.setAttribute('aria-controls', body.id)
    // No such script in Studio's preview (its own root layout): no html.js there, so nothing folds.
    const measure = () => window.cocoFold?.(box)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(body)
    return () => observer.disconnect()
  }, [id])

  return (
    <button ref={ref} type="button" className="read-more" aria-expanded="false" data-more={more} data-less={less} suppressHydrationWarning>
      <span suppressHydrationWarning>{more}</span>
      <Icon name="chevron" size={18} />
    </button>
  )
}
