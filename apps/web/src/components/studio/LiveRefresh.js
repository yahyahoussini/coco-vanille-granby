'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const POLL_MS = 30 * 1000

// New orders reach an open screen without a tap (16 §6.1, AC11): server-sent events from /svc/evenements/
// (Postgres LISTEN/NOTIFY on the server), and a 30-second refresh when the stream is not available.
export function LiveRefresh({ sound = false }) {
  const router = useRouter()
  const last = useRef(Date.now())
  useEffect(() => {
    let source = null
    let poll = null
    const emit = (state) => window.dispatchEvent(new CustomEvent('studio:live', { detail: { state } }))
    const refresh = () => {
      if (document.visibilityState !== 'visible') return
      last.current = Date.now()
      router.refresh()
    }
    const startPolling = () => {
      if (!poll) poll = setInterval(refresh, POLL_MS)
    }
    if ('EventSource' in window) {
      source = new EventSource('/svc/evenements/')
      source.addEventListener('open', () => emit('ok'))
      source.addEventListener('commande', () => {
        refresh()
        if (sound) new Audio('/son-commande.wav').play().catch(() => {})
      })
      source.addEventListener('error', () => {
        emit('reconnecting')
        startPolling()
      })
    } else startPolling()
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - last.current > POLL_MS) refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      source?.close()
      clearInterval(poll)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [router, sound])
  return null
}
