'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const POLL_MS = 30 * 1000

// Two short tones on the shop tablet for a new order (16 §6.1); browsers allow it after the first tap.
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[0, 0.18].forEach((t, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = i ? 1046 : 784
      g.gain.setValueAtTime(0.15, ctx.currentTime + t)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.15)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + t)
      o.stop(ctx.currentTime + t + 0.16)
    })
  } catch {
    // no audio: the list still refreshes
  }
}

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
      if (document.visibilityState !== 'visible' || navigator.onLine === false) return
      last.current = Date.now()
      router.refresh()
    }
    const startPolling = () => {
      if (!poll) poll = setInterval(refresh, POLL_MS)
    }
    if ('EventSource' in window) {
      source = new EventSource('/svc/evenements/')
      source.addEventListener('open', () => emit('ok'))
      source.addEventListener('commande', (e) => {
        refresh()
        let msg = {}
        try {
          msg = JSON.parse(e.data)
        } catch {
          msg = {}
        }
        if (sound && msg.nouvelle) beep()
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
