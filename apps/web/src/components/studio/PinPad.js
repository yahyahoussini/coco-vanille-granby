'use client'

import { useRef, useState } from 'react'

// 4-digit PIN: a plain numeric field (works without JavaScript) + big keys for floury fingers.
// The form submits by itself once the fourth digit is in.
export function PinPad({ name = 'nip', label = 'NIP à 4 chiffres' }) {
  const [value, setValue] = useState('')
  const input = useRef(null)
  const set = (v) => {
    const clean = v.replace(/\D/g, '').slice(0, 4)
    setValue(clean)
    if (clean.length === 4) setTimeout(() => input.current?.form?.requestSubmit(), 50)
  }
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  return (
    <div className="field">
      <label htmlFor="nip">{label}</label>
      <input
        ref={input}
        id="nip"
        name={name}
        className="code"
        type="password"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        autoComplete="off"
        required
        value={value}
        onChange={(e) => set(e.target.value)}
      />
      <div className="pinpad" role="group" aria-label="Clavier">
        {keys.map((k) => (
          <button key={k} type="button" className="btn" onClick={() => set(value + k)}>
            {k}
          </button>
        ))}
        <button type="button" className="btn" onClick={() => setValue(value.slice(0, -1))} aria-label="Effacer le dernier chiffre">
          ⌫
        </button>
        <button type="button" className="btn" onClick={() => set(value + '0')}>
          0
        </button>
        <button type="submit" className="btn" aria-label="Valider">
          OK
        </button>
      </div>
    </div>
  )
}
