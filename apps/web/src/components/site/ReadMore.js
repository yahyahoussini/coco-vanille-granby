'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from './Icon'

const LABELS = {
  fr: ['Lire la suite', 'Réduire'],
  en: ['Read more', 'Show less'],
  es: ['Leer más', 'Mostrar menos'],
}

// « Lire la suite » for a long block on phones (styles: site.css). Markup, server side:
//   <section data-clamp="" style={{ '--clamp-height': '9em' }}>  ← optional height, default 11.5em
//     <h2>…</h2>
//     <div className="clamp-body">…every paragraph, list, link…</div>
//     <ReadMore locale={locale} />
//   </section>
// The text is always in the HTML. CSS clamps .clamp-body only on phones and only once html.js is set, so without
// JavaScript (or from 48rem) everything shows. A block that fits, or would hide less than about a line and a
// half, is never folded (no fade, no button). The block opens by itself when the keyboard focus lands inside it
// (a link is never hidden behind the fade).
export function ReadMore({ locale = 'fr', labels }) {
  const [more, less] = labels || LABELS[locale] || LABELS.fr
  const ref = useRef(null)
  // The block fits: it stays open (data-open) without the reader having asked, and without a button.
  const fits = useRef(false)
  // Where the button stood before « Réduire »: the page is scrolled back so it stays under the finger.
  const before = useRef(null)
  const id = useId()
  const [open, setOpen] = useState(false)
  const [needed, setNeeded] = useState(true)

  useEffect(() => {
    const box = ref.current?.closest('[data-clamp]')
    const body = box?.querySelector('.clamp-body')
    if (!box || !body) return undefined
    if (!body.id) body.id = `clamp-${id.replace(/[^\w-]/g, '')}`
    ref.current.setAttribute('aria-controls', body.id)
    const measure = () => {
      // Opened by the reader: keep « Réduire ».
      if (box.hasAttribute('data-open') && !fits.current) return setNeeded(true)
      // Measure folded (same task, nothing is painted in between), then keep it folded only if it is worth it.
      box.removeAttribute('data-open')
      const slack = (parseFloat(getComputedStyle(body).fontSize) || 16) * 2.5
      fits.current = body.scrollHeight - body.clientHeight <= slack
      box.toggleAttribute('data-open', fits.current)
      setNeeded(!fits.current)
    }
    const onFocus = (event) => {
      if (event.target !== ref.current && body.contains(event.target)) setOpen(true)
    }
    measure()
    box.addEventListener('focusin', onFocus)
    const observer = new ResizeObserver(measure)
    observer.observe(body)
    return () => {
      box.removeEventListener('focusin', onFocus)
      observer.disconnect()
    }
  }, [id])

  useEffect(() => {
    ref.current?.closest('[data-clamp]')?.toggleAttribute('data-open', open || fits.current)
    if (open || before.current === null || !ref.current) return
    // A long block just closed above the button: without this, the reader lands far below the section.
    const shift = ref.current.getBoundingClientRect().top - before.current
    before.current = null
    if (Math.abs(shift) > 1) window.scrollBy({ top: shift, behavior: 'instant' })
  }, [open])

  const toggle = () => {
    if (open && ref.current) before.current = ref.current.getBoundingClientRect().top
    setOpen(!open)
  }

  return (
    <button ref={ref} type="button" className="read-more" aria-expanded={open} hidden={!needed} onClick={toggle}>
      {open ? less : more}
      <Icon name="chevron" size={18} />
    </button>
  )
}
