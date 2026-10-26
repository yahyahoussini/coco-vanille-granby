'use client'
import { useEffect, useState } from 'react'

// Live « Ouvert · jusqu'à 15 h » pill. Enhancement only: the hours table is the content.
export function OpenNow({ hours = [], labels }) {
  const [state, setState] = useState(null)
  useEffect(() => {
    const now = new Date()
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(now)
        .map((p) => [p.type, p.value]),
    )
    const minutes = Number(parts.hour) * 60 + Number(parts.minute)
    const today = hours.filter((h) => h.day === parts.weekday)
    const open = today.find((h) => {
      const [oh, om] = h.opens.split(':').map(Number)
      const [ch, cm] = h.closes.split(':').map(Number)
      return minutes >= oh * 60 + om && minutes < ch * 60 + cm
    })
    setState(open ? { open: true, closes: open.closesLabel } : { open: false })
  }, [hours])
  if (!hours.length) return null
  // Same box before the clock is read in the browser, so the pill never pushes content down.
  if (!state) return <p className="open-pill is-pending" aria-hidden="true">{labels.open}</p>
  return (
    <p className={`open-pill ${state.open ? 'is-open' : 'is-closed'}`} role="status">
      <span aria-hidden="true">●</span> {state.open ? `${labels.open} · ${labels.until} ${state.closes}` : labels.closed}
    </p>
  )
}
