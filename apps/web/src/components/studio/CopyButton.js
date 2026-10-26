'use client'

import { useState } from 'react'

// « Copier la réponse »: copies the reply field (the field itself stays selectable without JavaScript).
export function CopyButton({ target, label = 'Copier la réponse' }) {
  const [done, setDone] = useState(false)
  async function copy() {
    const el = document.getElementById(target)
    if (!el) return
    try {
      await navigator.clipboard.writeText(el.value)
    } catch {
      el.select()
      document.execCommand?.('copy')
    }
    setDone(true)
    setTimeout(() => setDone(false), 4000)
  }
  return (
    <button type="button" className="btn" onClick={copy} aria-live="polite">
      {done ? 'Copié ✓' : label}
    </button>
  )
}
