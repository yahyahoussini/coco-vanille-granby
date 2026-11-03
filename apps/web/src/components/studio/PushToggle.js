'use client'

import { useEffect, useState } from 'react'
import { act } from './outbox'
import { snack } from './Snackbar'

const bytes = (base64url) => Uint8Array.from(atob(base64url.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
const label = () => (/iPhone|iPad/.test(navigator.userAgent) ? 'iPhone ou iPad' : /Android/.test(navigator.userAgent) ? 'Android' : 'Ordinateur')

// « Recevoir les alertes sur cet appareil » (16b §3): the browser asks after this tap, as iPhones require. iPhones and iPads
// only allow it once Studio is on the Home Screen, so the button says how to get there.
export function PushToggle({ publicKey }) {
  const [state, setState] = useState('loading')
  const [endpoint, setEndpoint] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function look() {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
      if (/iPhone|iPad/.test(navigator.userAgent) && !standalone) return setState('homescreen')
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !publicKey) return setState('unsupported')
      if (Notification.permission === 'denied') return setState('denied')
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (cancelled) return
      setEndpoint(sub?.endpoint || null)
      setState(sub ? 'on' : 'off')
    }
    look().catch(() => setState('unsupported'))
    return () => {
      cancelled = true
    }
  }, [publicKey])

  async function turnOn() {
    setBusy(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'off')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: bytes(publicKey) })
      const { endpoint: url, keys } = sub.toJSON()
      const r = await act('push.subscribe', { endpoint: url, p256dh: keys.p256dh, auth: keys.auth, label: label() })
      snack({ message: r.ok ? r.message : `Pas appliqué : ${r.message}`, tone: r.ok ? 'ok' : 'bad' })
      if (r.ok) {
        setEndpoint(url)
        setState('on')
      }
    } catch {
      snack({ message: 'Ce navigateur refuse les alertes pour l’instant. Rien n’a changé.', tone: 'bad' })
    } finally {
      setBusy(false)
    }
  }

  async function turnOff() {
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) await sub.unsubscribe()
      const r = await act('push.unsubscribe', { endpoint })
      snack({ message: r.ok ? r.message : `Pas appliqué : ${r.message}`, tone: r.ok ? 'ok' : 'bad' })
      setEndpoint(null)
      setState('off')
    } finally {
      setBusy(false)
    }
  }

  async function test() {
    const r = await act('push.test', { endpoint })
    snack({ message: r.ok ? r.message : `Pas appliqué : ${r.message}`, tone: r.ok ? 'ok' : 'bad' })
  }

  if (state === 'loading') return <p className="meta">Vérification de cet appareil…</p>
  if (state === 'unsupported') return <p className="meta">Ce navigateur ne reçoit pas les alertes. Sur un téléphone Android, utilisez Chrome.</p>
  if (state === 'denied') return <p className="meta">Les alertes sont bloquées pour Coco Studio dans les réglages de ce navigateur : autorisez-les, puis revenez ici.</p>
  if (state === 'homescreen') {
    return (
      <p className="meta">
        Sur iPhone et iPad, les alertes demandent d’ouvrir Studio depuis l’écran d’accueil : dans Safari, touchez Partager, puis « Sur l’écran d’accueil ». Ouvrez ensuite Coco Studio avec sa nouvelle icône et revenez ici.
      </p>
    )
  }
  if (state === 'on') {
    return (
      <>
        <p>
          <span className="tag" data-tone="ok">
            Alertes actives sur cet appareil
          </span>
        </p>
        <div className="btn-row">
          <button className="btn" type="button" onClick={test} disabled={busy}>
            Envoyer une alerte d’essai
          </button>
          <button className="btn" type="button" onClick={turnOff} disabled={busy}>
            Couper les alertes
          </button>
        </div>
      </>
    )
  }
  return (
    <button className="btn btn-primary" type="button" onClick={turnOn} disabled={busy}>
      Recevoir les alertes sur cet appareil
    </button>
  )
}
