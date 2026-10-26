'use client'

import { useState } from 'react'

// Quantity with [−] [+] (48 px each). The number field works on its own without JavaScript.
export function Stepper({ name, id, label, defaultValue = 0, max = 50 }) {
  const [v, setV] = useState(Number(defaultValue) || 0)
  const set = (n) => setV(Math.max(0, Math.min(max, n)))
  return (
    <span className="stepper">
      <button type="button" className="btn" onClick={() => set(v - 1)} aria-label={`Un de moins : ${label}`}>
        −
      </button>
      <label htmlFor={id} className="sr-only">
        Quantité : {label}
      </label>
      <input id={id} name={name} type="number" inputMode="numeric" min={0} max={max} value={v} onChange={(e) => set(Number(e.target.value) || 0)} />
      <button type="button" className="btn" onClick={() => set(v + 1)} aria-label={`Un de plus : ${label}`}>
        +
      </button>
    </span>
  )
}
