'use client'
import { useEffect, useState } from 'react'
import { clock } from '@/lib/i18n'
import { openState } from './hours'

// Live « Ouvert · jusqu'à 15 h » pill, read in the browser's clock against the shop's own schedule:
// exceptional closure, special days, then the regular week. Enhancement only: the hours table is the content.
export function OpenNow({ schedule = {}, locale = 'fr', labels }) {
  const [state, setState] = useState(undefined)
  useEffect(() => {
    setState(openState(schedule))
  }, [schedule])
  if (!(schedule.hours || []).length) return null
  // Same box before the clock is read in the browser, so the pill never pushes content down.
  if (state === undefined) return <p className="open-pill is-pending" aria-hidden="true">{labels.open}</p>
  if (state === null) return null
  return (
    <p className={`open-pill ${state.open ? 'is-open' : 'is-closed'}`} role="status">
      <span aria-hidden="true">●</span> {state.open ? `${labels.open} · ${labels.until} ${clock(state.closes, locale)}` : labels.closed}
    </p>
  )
}
