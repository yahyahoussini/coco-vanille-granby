'use client'
import { useEffect, useState } from 'react'

// Live preview of the cake message (enhancement only): the server renders the current text, the client
// follows the input as the customer types. Decorative (aria-hidden): the input itself holds the message.
// Colours come from the site tokens (ordering.css), never from the drawing.
export function MessagePreview({ inputId, initial = '', caption, max = 30 }) {
  const [text, setText] = useState(initial)
  useEffect(() => {
    const input = document.getElementById(inputId)
    if (!input) return undefined
    const update = () => setText(input.value)
    input.addEventListener('input', update)
    return () => input.removeEventListener('input', update)
  }, [inputId])
  const shown = text.slice(0, max)
  const size = shown.length > 22 ? 14 : shown.length > 14 ? 17 : 21
  return (
    <figure className="cake-preview">
      <svg viewBox="0 0 240 160" width="240" height="160" aria-hidden="true" focusable="false">
        <ellipse className="cake-plate" cx="120" cy="134" rx="116" ry="18" />
        <path className="cake-side" d="M18 62v58c0 13 46 24 102 24s102-11 102-24V62Z" />
        <path className="cake-drip" d="M18 64c0 8 4 14 8 14s6-8 10-8 5 14 10 14 6-12 11-12 6 9 11 9 6-13 12-13 6 16 12 16 6-12 12-12 6 10 12 10 6-14 12-14 6 11 12 11 6-9 12-9 5 13 10 13 6-10 11-10 5 7 9 7 6-12 10-12V62Z" />
        <ellipse className="cake-top" cx="120" cy="62" rx="102" ry="30" />
        <g className="cake-pearls">
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2
            return <circle key={i} cx={(120 + Math.cos(a) * 92).toFixed(1)} cy={(62 + Math.sin(a) * 25).toFixed(1)} r="2.6" />
          })}
        </g>
        <text className="cake-text" x="120" y="68" textAnchor="middle" fontSize={size}>
          {shown || '…'}
        </text>
      </svg>
      <figcaption className="small">{caption}</figcaption>
    </figure>
  )
}
