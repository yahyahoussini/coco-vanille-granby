'use client'

import { useEffect, useRef, useState } from 'react'

// Sticky save bar for multi-field forms (16a P5): « Modifications non enregistrées · Ignorer · Enregistrer ».
// Without JavaScript it is always there (a plain submit); with JavaScript it appears on the first change,
// « Ignorer » resets the form, and leaving the page with changes asks first.
export function SaveBar({ effects = null, label = 'Enregistrer' }) {
  const ref = useRef(null)
  const [js, setJs] = useState(false)
  const [dirty, setDirty] = useState(false)
  useEffect(() => {
    setJs(true)
    const form = ref.current?.form || ref.current?.closest('form')
    if (!form) return
    const mark = () => setDirty(true)
    const clean = () => setDirty(false)
    form.addEventListener('input', mark)
    form.addEventListener('change', mark)
    form.addEventListener('submit', clean)
    form.addEventListener('reset', clean)
    return () => {
      form.removeEventListener('input', mark)
      form.removeEventListener('change', mark)
      form.removeEventListener('submit', clean)
      form.removeEventListener('reset', clean)
    }
  }, [])
  useEffect(() => {
    if (!dirty) return
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const hidden = js && !dirty
  return (
    <div className="savebar" hidden={hidden} style={hidden ? { display: 'none' } : undefined}>
      <p>
        {js ? 'Modifications non enregistrées' : 'Enregistrer les changements'}
        {effects && <small>{effects}</small>}
      </p>
      <button type="reset" className="btn btn-text">
        Ignorer
      </button>
      <button ref={ref} type="submit" className="btn btn-primary" style={{ inlineSize: 'auto' }}>
        {label}
      </button>
    </div>
  )
}
