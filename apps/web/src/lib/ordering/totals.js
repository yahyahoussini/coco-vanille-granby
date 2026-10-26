// Order totals shown at review, on the receipt and in the contract email (07 O1, 10 §9 sketch 2).
// Both tax lines are always shown, even at 0,00 $. No fee line of any kind (07 O4).
import { computeTaxes } from './tax.js'
import { money } from '../i18n.js'

const int = (n) => Number.isInteger(n)

// lines: [{ cents, qty, taxClass, unitGrams, packCount }]
// depositPercent: only for custom-cake quotes (no default, 10 §1.2); null = paid in full.
export function orderTotals(lines = [], { supplyDate, depositPercent = null } = {}) {
  if (!lines.length) throw Object.assign(new Error('empty'), { code: 'empty' })
  for (const l of lines) {
    if (!int(l.cents) || l.cents <= 0) throw Object.assign(new Error('price_missing'), { code: 'price_missing' })
    if (!int(l.qty) || l.qty <= 0) throw Object.assign(new Error('qty_invalid'), { code: 'qty_invalid' })
  }
  const subtotalCents = lines.reduce((s, l) => s + l.cents * l.qty, 0)
  const { gst, qst } = computeTaxes(lines, supplyDate)
  const totalCents = subtotalCents + gst + qst
  const split = splitPayments({ totalCents, gstCents: gst, qstCents: qst }, depositPercent)
  return {
    subtotalCents,
    gstCents: gst,
    qstCents: qst,
    totalCents,
    depositCents: split.deposit ? split.deposit.totalCents : null,
    balanceCents: split.balance ? split.balance.totalCents : 0,
    split: [split.deposit, split.balance].filter(Boolean),
  }
}

// Deposit + balance with tax allocated pro rata (07 §6 row 13 is ASK: placeholder until the accountant answers).
export function splitPayments({ totalCents, gstCents, qstCents }, depositPercent) {
  if (!(typeof depositPercent === 'number' && depositPercent > 0 && depositPercent < 100)) {
    return { deposit: null, balance: null, full: { kind: 'full', totalCents, gstCents, qstCents } }
  }
  const dep = Math.round((totalCents * depositPercent) / 100)
  const depGst = totalCents ? Math.round((gstCents * dep) / totalCents) : 0
  const depQst = totalCents ? Math.round((qstCents * dep) / totalCents) : 0
  return {
    deposit: { kind: 'deposit', totalCents: dep, gstCents: depGst, qstCents: depQst },
    balance: { kind: 'balance', totalCents: totalCents - dep, gstCents: gstCents - depGst, qstCents: qstCents - depQst },
  }
}

const LABELS = {
  fr: { subtotal: 'Sous-total', gst: 'TPS (5 %)', qst: 'TVQ (9,975 %)', total: 'Total', deposit: 'Acompte aujourd’hui', balance: 'Solde à la cueillette' },
  en: { subtotal: 'Subtotal', gst: 'GST (5%)', qst: 'QST (9.975%)', total: 'Total', deposit: 'Deposit today', balance: 'Balance at pickup' },
  es: { subtotal: 'Subtotal', gst: 'GST/TPS (5 %)', qst: 'QST/TVQ (9,975 %)', total: 'Total', deposit: 'Anticipo hoy', balance: 'Saldo al recoger' },
}

export const totalsLabels = (locale) => LABELS[locale] || LABELS.fr

// Display rows: subtotal, GST, QST (always), total, then deposit/balance when there is a deposit.
export function totalsRows(totals, locale = 'fr') {
  const l = totalsLabels(locale)
  const rows = [
    { key: 'subtotal', label: l.subtotal, cents: totals.subtotalCents },
    { key: 'gst', label: l.gst, cents: totals.gstCents },
    { key: 'qst', label: l.qst, cents: totals.qstCents },
    { key: 'total', label: l.total, cents: totals.totalCents },
  ]
  if (totals.depositCents) {
    rows.push({ key: 'deposit', label: l.deposit, cents: totals.depositCents })
    rows.push({ key: 'balance', label: l.balance, cents: totals.balanceCents })
  }
  return rows.map((r) => ({ ...r, text: money(r.cents, locale) }))
}
