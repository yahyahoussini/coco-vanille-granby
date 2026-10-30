'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../site/Icon'

// Quantity « − 1 + » (enhancement only). The server renders the plain number input, which works without JavaScript;
// once this script runs, a button on each side steps it between min and max. The input keeps its label and stays
// typeable. At a limit the button says so (aria-disabled) but keeps the focus, so a keyboard user is never dropped.
export function QtyStepper({ id, name = 'qty', defaultValue = 1, min = 1, max = 50, labels = {} }) {
  const input = useRef(null)
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState(Number(defaultValue) || min)
  useEffect(() => setReady(true), [])

  const read = () => Number(input.current?.value) || min
  const step = (delta) => {
    const el = input.current
    if (!el) return
    const next = Math.min(max, Math.max(min, Math.round(read()) + delta))
    el.value = String(next)
    setValue(next)
    // Anything listening on the form sees the change as if it were typed.
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }
  const button = (delta, label, icon, atLimit) => (
    <button type="button" className={`qty-btn qty-${icon}`} aria-label={label} aria-controls={id} aria-disabled={atLimit ? 'true' : undefined} onClick={() => !atLimit && step(delta)}>
      <Icon name={icon} size={18} strokeWidth={2.25} />
    </button>
  )

  return (
    <div className={ready ? 'qty is-ready' : 'qty'}>
      {ready && button(-1, labels.less, 'minus', value <= min)}
      <input ref={input} id={id} name={name} type="number" inputMode="numeric" min={min} max={max} step={1} defaultValue={defaultValue} onChange={() => setValue(read())} />
      {ready && button(1, labels.more, 'plus', value >= max)}
    </div>
  )
}
