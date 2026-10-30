// Quick answers of « Écrivez-nous »: shown at once in the browser from chatFacts(), never stored, never sent to
// the shop. A topic whose fact is missing is left out (no guess, no marker in front of a customer); the
// allergy answer is always there and always sends people to the phone before they order. Pure, node --test.
import { chatCopy } from './copy.js'

const ORDER = ['hours', 'address', 'cake', 'order', 'allergy', 'coffee', 'workshops', 'contact']
const ICON = { hours: 'clock', address: 'pin', cake: 'cake', order: 'box', allergy: 'alert', coffee: 'coffee', workshops: 'palette', contact: 'phone' }

// → [{ key, label, icon, text, links: [{ href, label, external }] }] in the order of the chips.
export function quickAnswers(facts, locale = 'fr') {
  const c = chatCopy(locale)
  const a = c.answers
  const f = facts || {}
  const L = f.links || {}
  const ln = (href, label, external = false) => (href ? { href, label, external } : null)
  const tel = f.phone && f.phoneDisplay ? ln(`tel:${f.phone}`, `${a.phone} : ${f.phoneDisplay}`) : null
  const cell = f.mobile && f.mobileDisplay ? ln(`tel:${f.mobile}`, `${a.mobile} : ${f.mobileDisplay}`) : null
  const call = tel ? f.phoneDisplay : null
  const topics = {}

  if (f.hours) topics.hours = { text: a.hours(f.hours), links: [ln(L.visit, a.hoursLink)] }
  if (f.address) topics.address = { text: a.address(f.address), links: [ln(f.maps, a.maps, true), ln(L.visit, a.visit)] }
  if (L.cake) topics.cake = { text: a.cake, links: [ln(L.cake, a.cakeLink)] }
  else if (call) topics.cake = { text: a.cakeCall(call), links: [tel] }
  if (L.order && f.orderingOpen) topics.order = { text: a.order, links: [ln(L.order, a.orderLink), ln(L.menu, a.menuLink)] }
  else if (L.order || call) topics.order = { text: call ? a.orderOffCall(call) : a.orderOff, links: [tel, ln(L.menu, a.menuLink)] }
  topics.allergy = { text: call ? a.allergy(call) : a.allergyNoPhone, links: [tel, ln(L.allergens, a.allergensLink)] }
  topics.coffee = { text: a.coffee, links: [ln(L.visit, f.hours ? a.hoursLink : a.visit)] }
  topics.workshops = { text: call ? a.workshops(call) : a.workshopsNoPhone, links: [tel] }
  const reach = [tel, cell, ln(f.facebook, a.facebook, true)].filter(Boolean)
  if (reach.length) topics.contact = { text: a.contact, links: reach }

  return ORDER.filter((key) => topics[key]).map((key) => ({ key, label: c.chips[key], icon: ICON[key], text: topics[key].text, links: topics[key].links.filter(Boolean) }))
}
