// Contract shared by the public checkout and Studio phone orders (implemented by the ordering module, M2-B).
// createOrder(payload, { source: 'web'|'phone', items: [{ productId, variantIndex, qty, message }],
//   pickup: { date: 'YYYY-MM-DD', windowStart: 'HH:MM' }, customer: { firstName, lastName, phone, email, language },
//   payment: { provider: 'stripe'|'square'|'counter'|'none' }, consent, attribution, req })
// → { order, totals, errors: [] }   (validates capacity, slot, prices, tax classes; never invents a price)
export async function createOrder() {
  throw new Error('createOrder: implemented by the ordering module (M2-B)')
}

// sendQuote(payload, { requestId, totalCents, depositPercent, validHours, req }) → { request, paymentLink }
export async function sendQuote() {
  throw new Error('sendQuote: implemented by the ordering module (M2-B)')
}

// availableWindows(payload, { date, items, now }) → [{ start: 'HH:MM', end: 'HH:MM', remaining }]
export async function availableWindows() {
  return []
}
