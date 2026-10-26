'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { wireOutbox } from './outbox'

const IDLE_MS = 30 * 60 * 1000

// Enhancements for the whole Studio: the offline outbox, the service worker (shell only), and on the shop's
// shared tablet « Qui utilise la tablette? » after 30 minutes without a touch (16 §3.0).
export function ClientBoot({ shared = false }) {
  const router = useRouter()
  useEffect(() => {
    wireOutbox()
    if ('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!shared) return
    let timer
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => router.push('/qui/'), IDLE_MS)
    }
    const events = ['pointerdown', 'keydown', 'touchstart']
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()
    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [shared, router])
  return null
}
