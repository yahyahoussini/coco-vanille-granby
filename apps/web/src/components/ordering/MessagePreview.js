'use client'
import { useEffect, useState } from 'react'

// Live preview of the cake message (enhancement only): the server renders the current text, the client
// follows the input as the customer types. Decorative (aria-hidden): the input itself holds the message.
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
  const size = shown.length > 22 ? 15 : shown.length > 14 ? 18 : 22
  return (
    <figure className="cake-preview">
      <svg viewBox="0 0 240 150" width="240" height="150" aria-hidden="true" focusable="false">
        <ellipse cx="120" cy="112" rx="104" ry="26" fill="#efe5d3" />
        <rect x="16" y="58" width="208" height="54" fill="#f8e8ea" />
        <ellipse cx="120" cy="58" rx="104" ry="30" fill="#fffcf6" stroke="#e6dccb" />
        <text x="120" y="64" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={size} fill="#96344a">
          {shown || '…'}
        </text>
      </svg>
      <figcaption className="small">{caption}</figcaption>
    </figure>
  )
}
