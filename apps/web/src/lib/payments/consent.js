// Express acceptance of the conditions (07 O2, O3): unticked box, French first, with the accepted version:
// the owner's label in Boutique & heures, else the date the conditions page last changed.
export async function termsVersionOf(payload) {
  const shop = await payload.findGlobal({ slug: 'shop', overrideAccess: true, depth: 0 })
  if (shop?.ordering?.termsVersion) return shop.ordering.termsVersion
  const doc = (await payload.find({ collection: 'pages', where: { key: { equals: 'conditions-de-vente' } }, locale: 'fr', limit: 1, overrideAccess: true, depth: 0 })).docs[0]
  const at = doc?.contentUpdatedAt || doc?.updatedAt
  return at ? `conditions-de-vente@${String(at).slice(0, 10)}` : null
}

const yes = (v) => v === true || ['on', '1', 'true'].includes(String(v || ''))

export async function quoteConsent(payload, { locale = 'fr', terms, frenchFirst, now = new Date() }) {
  if (!yes(terms)) return { ok: false, code: 'terms_required' }
  if (locale !== 'fr' && !yes(frenchFirst)) return { ok: false, code: 'binding_language_required' }
  const version = await termsVersionOf(payload)
  if (!version) return { ok: false, code: 'terms_version_missing' }
  return { ok: true, consent: { termsAcceptedAt: new Date(now).toISOString(), termsVersion: version, bindingLanguage: locale === 'en' ? 'en' : 'fr' } }
}
