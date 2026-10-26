'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { undoAction } from './outbox'

// Undo, not confirm (16a P4): every single-tap change shows « … [Annuler] » for at least 5 s, longer while
// focus is on the snackbar (keyboard and screen-reader users), never past the server's undo window.
export function Snackbar() {
  const [snack, setSnack] = useState(null)
  const [busy, setBusy] = useState(false)
  const box = useRef(null)
  const timer = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const show = (e) => setSnack({ ...e.detail, shownAt: Date.now() })
    const rejected = (e) => setSnack({ message: `Pas appliqué : ${e.detail.result?.message || 'refusé par le serveur.'}`, tone: 'bad', shownAt: Date.now() })
    window.addEventListener('studio:snack', show)
    window.addEventListener('studio:rejected', rejected)
    return () => {
      window.removeEventListener('studio:snack', show)
      window.removeEventListener('studio:rejected', rejected)
    }
  }, [])

  useEffect(() => {
    clearTimeout(timer.current)
    if (!snack) return
    const visible = Math.max(5, snack.undo?.visible || 8) * 1000
    const hardStop = snack.undo?.until ? new Date(snack.undo.until).getTime() - Date.now() : visible
    const tick = () => {
      const focused = box.current?.contains(document.activeElement)
      const age = Date.now() - snack.shownAt
      if ((focused && age < hardStop) || age < visible) timer.current = setTimeout(tick, 500)
      else setSnack(null)
    }
    timer.current = setTimeout(tick, 500)
    return () => clearTimeout(timer.current)
  }, [snack])

  const cancel = async () => {
    if (!snack?.undo) return
    setBusy(true)
    const r = await undoAction(snack.undo.id)
    setBusy(false)
    setSnack({ message: r.message || (r.ok ? 'Annulé.' : 'Annulation refusée.'), tone: r.ok ? 'ok' : 'bad', shownAt: Date.now() })
    router.refresh()
  }

  return (
    <div className="st-snack" ref={box} role="status" aria-live="polite" hidden={!snack} data-tone={snack?.tone || 'ok'}>
      <p>{snack?.message}</p>
      {snack?.undo && (
        <button type="button" className="btn" onClick={cancel} disabled={busy}>
          Annuler
        </button>
      )}
      {snack?.extra}
    </div>
  )
}

export const snack = (detail) => window.dispatchEvent(new CustomEvent('studio:snack', { detail }))
