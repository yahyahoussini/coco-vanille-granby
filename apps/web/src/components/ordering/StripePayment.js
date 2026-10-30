'use client'
import { useEffect, useRef, useState } from 'react'

// Stripe Payment Element (+ Express Checkout Element for wallets when not inside an in-app browser).
// Card fields live in Stripe's iframes (SAQ A); Stripe.js is the only third-party script on the page (10 §1.4).
// The order is marked paid by the signed webhook only; the return page waits for it.
// Fewer keystrokes: the name, email and phone the customer already gave fill the card form and Link (`billing`);
// Apple Pay or Google Pay comes first when the phone offers it, then « ou payez par carte ». A wallet sheet opens
// only once the required boxes are checked, so it never waits on a box the customer cannot see.
export function StripePayment({ scriptUrl, publishableKey, clientSecret, returnPath, locale = 'fr', wallets = true, labels, mustCheck = [], accept = null, billing = null }) {
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const [wallet, setWallet] = useState(false)
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
      const billingDetails = billing ? Object.fromEntries(Object.entries(billing).filter(([, v]) => v)) : null
      elements.create('payment', { layout: 'tabs', ...(billingDetails ? { defaultValues: { billingDetails } } : {}) }).mount('#payment-element')
      if (wallets) {
        try {
          const express = elements.create('expressCheckout', { buttonHeight: 52, buttonType: { applePay: 'order', googlePay: 'order' } })
          express.on('ready', ({ availablePaymentMethods }) => setWallet(Boolean(availablePaymentMethods && Object.values(availablePaymentMethods).some(Boolean))))
          express.on('click', (event) => {
            if (unchecked()) return
            event.resolve()
          })
          express.on('confirm', (event) => pay(null, event))
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

  // A required box left empty: say so and put the focus on it. → true when something is missing.
  function unchecked() {
    const missing = mustCheck.map((id) => document.getElementById(id)).find((box) => box && !box.checked)
    if (!missing) return false
    setMessage(labels.mustCheck)
    missing.focus()
    return true
  }

  async function pay(event, walletEvent = null) {
    event?.preventDefault?.()
    if (unchecked()) {
      walletEvent?.paymentFailed?.({ reason: 'fail' })
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
        walletEvent?.paymentFailed?.({ reason: 'fail' })
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
      {wallet && labels.or && (
        <p className="pay-or">
          <span>{labels.or}</span>
        </p>
      )}
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
