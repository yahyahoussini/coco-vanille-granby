'use client'
import { useState } from 'react'

// « Copier le lien » for the box restore link (enhancement: the link itself is printed as text).
export function CopyLink({ url, label, done }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-quiet"
      onClick={async () => {
        try {
          await navigator.clipboard?.writeText(url)
          setCopied(true)
        } catch {
          setCopied(false)
        }
      }}
    >
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  )
}
