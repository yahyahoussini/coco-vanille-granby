'use client'
import { useEffect, useRef, useState } from 'react'

// Stripe Payment Element (+ Express Checkout Element for wallets when not inside an in-app browser).
// Card fields live in Stripe's iframes (SAQ A); Stripe.js is the only third-party script on the page (10 §1.4).
// The order is marked paid by the signed webhook only; the return page waits for it.
export function StripePayment({ scriptUrl, publishableKey, clientSecret, returnPath, locale = 'fr', wallets = true, labels, mustCheck = [], accept = null }) {
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const ref = useRef({ stripe: null, elements: null })

  useEffect(() => {
    let cancelled = false
    const start = () => {
      if (cancelled || !window.Stripe) return
      const stripe = window.Stripe(publishableKey, { locale: locale === 'en' ? 'en-CA' : locale === 'es' ? 'es' : 'fr-CA' })
      const elements = stripe.elements({
        clientSecret,
        appearance: { theme: 'stripe', variables: { colorPrimary: '#96344a', colorText: '#2e211a', colorBackground: '#fffcf6', borderRadius: '10px', fontSizeBase: '16px' } },
      })
      elements.create('payment', { layout: 'tabs' }).mount('#payment-element')
      if (wallets) {
        try {
          const express = elements.create('expressCheckout')
          express.on('confirm', () => pay())
          express.mount('#express-checkout')
        } catch {
          // Wallets are optional; the card form stays.
        }
      }
      ref.current = { stripe, elements }
      setState('ready')
    }
    if (window.Stripe) start()
    else {
      let s = document.querySelector(`script[src="${scriptUrl}"]`)
      if (!s) {
        s = document.createElement('script')
        s.src = scriptUrl
        s.async = true
        document.head.appendChild(s)
      }
      s.addEventListener('load', start)
      s.addEventListener('error', () => setState('error'))
    }
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSecret])

  async function pay(event) {
    event?.preventDefault?.()
    const missing = mustCheck.map((id) => document.getElementById(id)).find((box) => box && !box.checked)
    if (missing) {
      setMessage(labels.mustCheck)
      missing.focus()
      return
    }
    const { stripe, elements } = ref.current
    if (!stripe || !elements) return
    setState('paying')
    setMessage(labels.processing)
    if (accept) {
      const body = { ...accept.body }
      for (const [key, id] of Object.entries(accept.fields || {})) body[key] = Boolean(document.getElementById(id)?.checked)
      const res = await fetch(accept.url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null)
      if (!res || !res.ok) {
        setState('ready')
        setMessage(labels.failed)
        return
      }
    }
    const { error } = await stripe.confirmPayment({ elements, confirmParams: { return_url: new URL(returnPath, window.location.origin).toString() } })
    if (error) {
      setState('ready')
      setMessage(error.message || labels.failed)
    }
  }

  return (
    <form onSubmit={pay} className="pay-panel" aria-describedby="pay-status">
      {wallets && <div id="express-checkout" />}
      <div id="payment-element" />
      <button type="submit" className="btn btn-primary" disabled={state !== 'ready'}>
        {labels.button}
      </button>
      <p id="pay-status" className="pay-status" role="status" aria-live="polite">
        {state === 'error' ? labels.failed : message}
      </p>
    </form>
  )
}
