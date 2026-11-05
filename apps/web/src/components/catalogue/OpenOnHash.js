'use client'
import { useEffect } from 'react'

// An anchor into a closed family (/commander/#commande-gateaux): the browser opens a <details> around a target in
// its content by itself, but not one in its <summary>, and Safari before 26.2 opens neither. Enhancement only: the
// family's heading stays in view and opens with a tap without this script.
export function OpenOnHash() {
  useEffect(() => {
    const reveal = () => {
      const target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null
      const fold = target?.closest('details')
      if (!fold || fold.open) return
      fold.open = true
      target.scrollIntoView()
    }
    reveal()
    window.addEventListener('hashchange', reveal)
    return () => window.removeEventListener('hashchange', reveal)
  }, [])
  return null
}
