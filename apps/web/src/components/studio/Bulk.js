'use client'

import { useEffect, useRef, useState } from 'react'

// « Marquer 5 commandes prêtes » (16a P13): the count follows the visible checkboxes of its form.
export function BulkSubmit() {
  const ref = useRef(null)
  const [n, setN] = useState(null)
  useEffect(() => {
    const form = ref.current?.form
    if (!form) return
    const update = () => setN(form.querySelectorAll('input[name="orderIds[]"]:checked').length)
    update()
    form.addEventListener('change', update)
    return () => form.removeEventListener('change', update)
  }, [])
  const label = n === null ? 'Marquer les commandes cochées prêtes' : n === 0 ? 'Cochez des commandes' : `Marquer ${n} ${n > 1 ? 'commandes prêtes' : 'commande prête'}`
  return (
    <button ref={ref} className="btn btn-primary" type="submit" disabled={n === 0}>
      {label}
    </button>
  )
}
