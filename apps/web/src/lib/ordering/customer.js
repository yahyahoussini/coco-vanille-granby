// Customer fields shared by checkout, the request form and Studio phone orders. Guest by default (10 §4).

// North American numbers → E.164 (+1XXXXXXXXXX); other countries must start with +. null when not a phone number.
export function normalizePhone(raw) {
  if (raw === undefined || raw === null) return null
  const text = String(raw).trim()
  if (!text) return null
  const digits = text.replace(/\D/g, '')
  if (text.startsWith('+')) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  if (digits.length === 10 && /^[2-9]\d{2}[2-9]/.test(digits)) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1') && /^1[2-9]\d{2}[2-9]/.test(digits)) return `+${digits}`
  return null
}

// +14503727177 → 450-372-7177
export function phoneDisplay(e164) {
  const m = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164 || '')
  return m ? `${m[1]}-${m[2]}-${m[3]}` : e164 || ''
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// → { customer, errors: [{ code, field }] }. requireEmail: web checkout (the contract copy goes there).
export function cleanCustomer(input = {}, { requireEmail = false, requirePhone = false, locale = 'fr' } = {}) {
  const errors = []
  const firstName = String(input.firstName || '').trim().slice(0, 60)
  const lastName = String(input.lastName || '').trim().slice(0, 60)
  const emailRaw = String(input.email || '').trim().toLowerCase().slice(0, 120)
  const phone = normalizePhone(input.phone)
  if (!firstName) errors.push({ code: 'first_name_required', field: 'firstName' })
  if (emailRaw && !EMAIL.test(emailRaw)) errors.push({ code: 'email_invalid', field: 'email' })
  else if (!emailRaw && requireEmail) errors.push({ code: 'email_required', field: 'email' })
  if (input.phone && String(input.phone).trim() && !phone) errors.push({ code: 'phone_invalid', field: 'phone' })
  else if (!phone && requirePhone) errors.push({ code: 'phone_required', field: 'phone' })
  const language = ['fr', 'en', 'es'].includes(input.language) ? input.language : locale
  return { customer: { firstName, lastName, email: emailRaw || null, phone, language }, errors }
}
