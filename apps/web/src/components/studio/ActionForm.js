'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { act } from './outbox'
import { snack } from './Snackbar'

// A Studio tap as a real HTML form: without JavaScript it posts to /svc/action and the screen comes back with
// a notice and « Annuler »; with JavaScript it goes through the outbox, shows the snackbar at once and refreshes.
export function ActionForm({ type, fields = {}, back = '/', pending = null, className = '', children, needsNetwork = false, ...rest }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (busy) return
    const data = new FormData(e.currentTarget)
    const input = {}
    for (const [k, v] of data.entries()) {
      if (k === 'type' || k === 'back') continue
      const key = k.endsWith('[]') ? k.slice(0, -2) : k
      if (k.endsWith('[]')) (input[key] ||= []).push(v)
      else input[key] = v
    }
    if (needsNetwork && navigator.onLine === false) {
      snack({ message: 'Cette action a besoin du réseau. Rien n’a été envoyé.', tone: 'bad' })
      return
    }
    setBusy(true)
    if (pending) snack({ message: pending })
    const r = await act(type, input)
    setBusy(false)
    if (r.code === 'step_up') return router.push(`/verifier/?retour=${encodeURIComponent(back)}`)
    if (r.code === 'login') return router.push(`/connexion/?retour=${encodeURIComponent(back)}`)
    snack({ message: r.ok ? r.message : `Pas appliqué : ${r.message}`, tone: r.ok ? 'ok' : 'bad', undo: r.undo || null, link: r.data?.link || null })
    if (r.ok && r.data?.redirect) router.push(r.data.redirect)
    else router.refresh()
  }

  return (
    <form method="post" action="/svc/action/" onSubmit={onSubmit} className={className} aria-busy={busy || undefined} {...rest}>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="back" value={back} />
      {Object.entries(fields).map(([k, v]) =>
        Array.isArray(v) ? v.map((x) => <input key={`${k}-${x}`} type="hidden" name={`${k}[]`} value={x} />) : <input key={k} type="hidden" name={k} value={v ?? ''} />,
      )}
      {children}
    </form>
  )
}
