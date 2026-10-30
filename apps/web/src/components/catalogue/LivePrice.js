'use client'
import { useEffect } from 'react'

// Product page (enhancement only). Once the shopper picks a size or a quantity, the card's price, its servings and
// the phone buy bar follow the choice (data-price-cents and data-portions on the form's size options, AddToBox.js);
// before any choice, and without JavaScript, the page keeps the server's « à partir de » price, which stays true.
// While any part of the form is on screen, html gets data-buy-in-view: on phones the buy bar steps aside and the
// card's own « Ajouter » shows, so the bar never covers the size or quantity it submits; on desktop the chat
// launcher waits. The card's button keeps its room either way (visibility), so the form never changes size.
export function LivePrice({ formId, locale }) {
  useEffect(() => {
    const form = document.getElementById(formId)
    if (!form) return undefined
    const format = new Intl.NumberFormat(locale === 'en' ? 'en-CA' : 'fr-CA', { style: 'currency', currency: 'CAD' })
    const choice = () => {
      const select = form.querySelector('select[name="variantIndex"]')
      const size = select ? select.selectedOptions[0] : form.querySelector('input[name="variantIndex"]')
      const qty = Math.max(1, Math.round(Number(form.querySelector('input[name="qty"]')?.value) || 1))
      return { cents: Number(size?.dataset.priceCents), portions: size?.dataset.portions || '', qty }
    }
    const show = (selector, cents) => {
      for (const line of document.querySelectorAll(selector)) {
        const amount = line.querySelector('.price-amount')
        if (amount) amount.textContent = format.format(cents / 100)
        const from = line.querySelector('.price-from')
        if (from) from.style.display = 'none'
      }
    }
    const update = () => {
      const { cents, portions, qty } = choice()
      if (!Number.isFinite(cents) || cents <= 0) return
      show(`[data-live-price="${formId}"]`, cents)
      show(`[data-live-total="${formId}"]`, cents * qty)
      if (portions) for (const text of document.querySelectorAll(`[data-live-portions="${formId}"] .portions-text`)) text.textContent = portions
    }
    form.addEventListener('change', update)
    form.addEventListener('input', update)

    const root = document.documentElement
    const watcher =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => root.toggleAttribute('data-buy-in-view', entry.isIntersecting), {
            rootMargin: '-64px 0px 0px 0px',
          })
        : null
    watcher?.observe(form)
    return () => {
      form.removeEventListener('change', update)
      form.removeEventListener('input', update)
      watcher?.disconnect()
      root.removeAttribute('data-buy-in-view')
    }
  }, [formId, locale])
  return null
}
