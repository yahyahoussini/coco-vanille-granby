'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// While a payment is being confirmed by the processor's webhook, re-reads the page every few seconds
// (for one minute at most). Without JavaScript the « Mettre à jour » link does the same.
export function AutoRefresh({ every = 4000, max = 15 }) {
  const router = useRouter()
  useEffect(() => {
    let n = 0
    const id = setInterval(() => {
      n += 1
      if (n > max) clearInterval(id)
      else router.refresh()
    }, every)
    return () => clearInterval(id)
  }, [router, every, max])
  return null
}
