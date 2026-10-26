'use client'

import { useEffect, useState } from 'react'
import { orderTotals } from '@/lib/ordering/totals'

const money = (c) => (Number.isFinite(c) ? `${(c / 100).toFixed(2).replace('.', ',')} $` : '—')
const parse = (s) => {
  const t = String(s || '').trim().replace(/\s|\$/g, '').replace(',', '.')
  return /^\d{1,6}(\.\d{1,2})?$/.test(t) ? Math.round(Number(t) * 100) : null
}

// Live « Acompte (30 %) · Solde à la cueillette » as the price is typed (same tax engine as the server).
// Without JavaScript the server computes the same numbers when it sends the quote.
export function QuotePreview({ formId, percent, supplyDate, initialTax = null }) {
  const [state, setState] = useState({ cents: null, tax: initialTax })
  useEffect(() => {
    const form = document.getElementById(formId)
    if (!form) return
    const read = () => setState({ cents: parse(form.elements.price?.value), tax: form.querySelector('input[name="taxClass"]:checked')?.value || initialTax })
    read()
    form.addEventListener('input', read)
    form.addEventListener('change', read)
    return () => {
      form.removeEventListener('input', read)
      form.removeEventListener('change', read)
    }
  }, [formId, initialTax])
  let t = null
  if (state.cents && state.tax && percent) {
    try {
      t = orderTotals([{ cents: state.cents, qty: 1, taxClass: state.tax }], { supplyDate, depositPercent: percent >= 100 ? null : percent })
    } catch {
      t = null
    }
  }
  return (
    <ul className="numbers" aria-live="polite">
      <li>
        <span>Taxes (TPS + TVQ)</span> <strong>{t ? money(t.gstCents + t.qstCents) : '—'}</strong>
      </li>
      <li>
        <span>Total</span> <strong>{t ? money(t.totalCents) : '—'}</strong>
      </li>
      <li>
        <span>Acompte ({percent ? `${percent} %` : '—'})</span> <strong>{t ? money(t.depositCents ?? t.totalCents) : '—'}</strong>
      </li>
      <li>
        <span>Solde à la cueillette</span> <strong>{t ? money(t.balanceCents) : '—'}</strong>
      </li>
    </ul>
  )
}
