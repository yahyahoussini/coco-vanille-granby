'use client'

import { useEffect, useState } from 'react'
import { count, flush } from './outbox'

// « ● À jour » / « ◐ Reconnexion… » / « ○ Hors ligne · 2 en attente » (16 §3.0, 16a P18).
export function SyncChip() {
  const [online, setOnline] = useState(true)
  const [waiting, setWaiting] = useState(0)
  const [live, setLive] = useState('ok')

  useEffect(() => {
    const update = () => setOnline(navigator.onLine !== false)
    const onCount = (e) => setWaiting(e.detail?.count || 0)
    const onLive = (e) => setLive(e.detail?.state || 'ok')
    update()
    count().then(setWaiting)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    window.addEventListener('studio:outbox', onCount)
    window.addEventListener('studio:live', onLive)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      window.removeEventListener('studio:outbox', onCount)
      window.removeEventListener('studio:live', onLive)
    }
  }, [])

  let tone = 'ok'
  let text = '● À jour'
  if (!online) {
    tone = 'bad'
    text = waiting ? `○ Hors ligne · ${waiting} en attente` : '○ Hors ligne'
  } else if (waiting) {
    tone = 'warn'
    text = `◐ Envoi · ${waiting} en attente`
  } else if (live === 'reconnecting') {
    tone = 'warn'
    text = '◐ Reconnexion…'
  }
  return (
    <button type="button" className="st-chip" data-tone={tone} onClick={() => flush()} aria-live="polite" title={online ? 'Envoyer ce qui attend' : 'Les changements partent au retour du réseau'}>
      {text}
    </button>
  )
}
