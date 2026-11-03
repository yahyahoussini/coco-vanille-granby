// Vitrine and Produits actions (16 §3.3, §8.1 Plus): sold-out with a duration that resets by itself, the
// display case, « Reprendre hier », the photo of the day; prices (step-up, history in the audit log),
// human allergen verification (G3), tax class (owner, G13); the owner's own editing of a product: « Ces prix sont les bons »,
// formats with their servings and prices, words in both languages, lead time, photos, retiring it, a new product.
import { localParts, addDays, shortDay } from '../time.js'
import { money, parseMoney } from '../format.js'
import { sentence } from '../audit.js'
import { soldOutUntilToday, soldOutUntilDay, INDEFINITE, untilLabel, vitrineAlt, VITRINE_CREDIT } from '../vitrine.js'
import { frTypo } from '../../typo.js'
import { refuse, load, str, bool, int } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const PHOTO_MAX = 15 * 1024 * 1024

const readShop = (ctx) => ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })

// Keep a published product published (drafts stay drafts) when Studio changes one field.
async function saveProduct(ctx, product, data, { system = false } = {}) {
  return ctx.payload.update({ collection: 'products', id: product.id, locale: 'fr', data: { ...data, ...(product._status ? { _status: product._status } : {}) }, depth: 0, ...(system ? SYS : ctx.write), context: { studioAudited: true } })
}

const availability = (p) => ({ availability: p.availability, soldOutUntil: p.soldOutUntil || null })

const list = (v) => [].concat(v ?? [])
const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const idOf = (x) => (x && typeof x === 'object' ? x.id : x)
// « 8 po » in a format's name is its size in inches: the site adds the centimetres.
const inchesIn = (label) => {
  const m = /(\d+(?:[.,]\d+)?)\s*po\b/i.exec(label)
  return m ? Number(m[1].replace(',', '.')) : null
}
// What one format says, for the audit log.
const formatsOf = (variants = []) => (variants || []).map((v) => ({ label: v.label, portionsMin: v.portionsMin ?? null, portionsMax: v.portionsMax ?? null, priceCents: v.priceCents ?? null }))
const englishOf = (ctx, id) => ctx.payload.findByID({ collection: 'products', id, locale: 'en', fallbackLocale: false, depth: 0, ...SYS })

// The rows of the « Formats et prix » form → clean rows. A row whose name is empty or marked « Retirer » is dropped.
function readFormats(input, product, english) {
  const removed = new Set(list(input.remove).map(String))
  const rows = []
  list(input.label).forEach((raw, i) => {
    const label = str(raw, 80)
    if (!label || removed.has(String(i))) return
    const cents = parseMoney(list(input.price)[i])
    if (!cents) refuse('price_invalid', `Prix invalide pour « ${label} » (ex. 45 ou 6,50).`, 422)
    const min = int(str(list(input.portionsMin)[i], 5))
    const max = int(str(list(input.portionsMax)[i], 5))
    if ((min !== null && min < 1) || (max !== null && max < 1) || (min !== null && max !== null && max < min)) refuse('portions', `Portions invalides pour « ${label} ».`, 422)
    const old = product?.variants?.[i] || null
    const grams = int(str(list(input.grams)[i], 6))
    if (product?.taxClass === 'rule' && !(grams > 0)) refuse('grams', `Indiquez le poids d’une portion de « ${label} », en grammes : la règle de taxe en a besoin.`, 422)
    rows.push({
      ...(old?.id ? { id: old.id } : {}),
      label,
      sizeInches: inchesIn(label),
      portionsMin: min,
      portionsMax: max ?? min,
      priceCents: cents,
      unitWeightGrams: grams ?? old?.unitWeightGrams ?? null,
      packCount: old?.packCount ?? null,
      sku: old?.sku ?? null,
      labelEn: str(list(input.labelEn)[i], 80) || english?.variants?.[i]?.label || label,
    })
  })
  if (!rows.length) refuse('formats', 'Gardez au moins un format, avec son prix.', 422)
  return rows
}

async function saveEnglish(ctx, id, fields, rows) {
  const fr = await ctx.payload.findByID({ collection: 'products', id, locale: 'fr', depth: 0, ...SYS })
  const variants = rows ? fr.variants.map((row, i) => ({ ...row, label: rows[i]?.labelEn || row.label })) : undefined
  await ctx.payload.update({ collection: 'products', id, locale: 'en', data: { ...fields, ...(variants ? { variants } : {}), ...(fr._status ? { _status: fr._status } : {}) }, depth: 0, ...SYS, context: { studioAudited: true } })
}

async function vitrineIds(ctx) {
  const r = await ctx.payload.find({ collection: 'products', where: { vitrine: { equals: true } }, limit: 200, depth: 0, locale: 'fr', ...SYS, select: { title: true } })
  return r.docs.map((d) => d.id)
}

function soldOut(computeUntil, word) {
  return {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const until = await computeUntil(ctx, input)
      await saveProduct(ctx, product, { availability: 'soldout', soldOutUntil: until.toISOString() })
      const label = untilLabel(until, ctx.now)
      return {
        entity: 'products',
        entityId: product.id,
        before: availability(product),
        after: { availability: 'soldout', soldOutUntil: until.toISOString() },
        summary: sentence(ctx.user, ctx.device, `a marqué ${product.title} épuisé ${word(label)}`, ctx.now),
        message: `${product.title} : épuisé ${label}.`,
        data: { productId: product.id, link: { href: `/vitrine/#produit-${product.id}`, label: 'Changer la durée' } },
      }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, ...SYS })
      await saveProduct(ctx, product, entry.before, { system: true })
      return { message: `${product.title} : de nouveau en vente.` }
    },
  }
}

export const catalogActions = {
  // « Pour aujourd'hui » by default (16a P3): back at the next opening.
  'product.soldout': soldOut(async (ctx) => soldOutUntilToday(await readShop(ctx), ctx.now), (l) => l),

  'product.soldoutDays': soldOut(async (ctx, input) => {
    const date = str(input.date, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < localParts(ctx.now).iso) refuse('date', 'Choisissez le dernier jour où il manque.', 422)
    if (date > addDays(localParts(ctx.now).iso, 60)) refuse('date', 'Plus de 60 jours : retirez-le plutôt dans Produits.', 422)
    return soldOutUntilDay(await readShop(ctx), date)
  }, (l) => l),

  'product.soldoutIndefinite': soldOut(async () => new Date(INDEFINITE), () => 'jusqu’à nouvel ordre'),

  'product.restock': {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      await saveProduct(ctx, product, { availability: 'instock', soldOutUntil: null })
      return { entity: 'products', entityId: product.id, before: availability(product), after: { availability: 'instock', soldOutUntil: null }, summary: sentence(ctx.user, ctx.device, `a remis ${product.title} en vente`, ctx.now), message: `${product.title} : de nouveau en vente.` }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, ...SYS })
      await saveProduct(ctx, product, entry.before, { system: true })
      return { message: `${product.title} : épuisé comme avant.` }
    },
  },

  // The display case: one flag per product; every change keeps the day's list for « Reprendre hier ».
  'vitrine.add': vitrineToggle(true),
  'vitrine.remove': vitrineToggle(false),

  'vitrine.copyYesterday': {
    undoSeconds: 30,
    async run(ctx) {
      const today = localParts(ctx.now).iso
      const prev = await ctx.payload.find({ collection: 'audit-log', where: { and: [{ entity: { equals: 'vitrine' } }, { entityId: { less_than: today } }, { undoneAt: { exists: false } }] }, sort: '-createdAt', limit: 1, ...SYS })
      const list = prev.docs[0]?.after?.vitrine
      if (!Array.isArray(list) || !list.length) refuse('none', 'Pas de vitrine d’hier enregistrée.', 409)
      const current = await vitrineIds(ctx)
      const products = await ctx.payload.find({ collection: 'products', where: { id: { in: [...new Set([...current, ...list])] } }, limit: 200, depth: 0, locale: 'fr', ...SYS })
      for (const p of products.docs) {
        const want = list.map(String).includes(String(p.id))
        const reset = want && p.availability === 'soldout' && p.soldOutUntil && new Date(p.soldOutUntil).getTime() <= ctx.now.getTime()
        if (Boolean(p.vitrine) !== want || reset) await saveProduct(ctx, p, { vitrine: want, ...(reset ? { availability: 'instock', soldOutUntil: null } : {}) })
      }
      return {
        entity: 'vitrine',
        entityId: today,
        before: { vitrine: current },
        after: { vitrine: list },
        summary: sentence(ctx.user, ctx.device, `a repris la vitrine du ${shortDay(prev.docs[0].entityId)}`, ctx.now),
        message: `Vitrine reprise (${list.length} ${list.length > 1 ? 'produits' : 'produit'}).`,
      }
    },
    async undo(ctx, entry) {
      await setVitrine(ctx, entry.before.vitrine)
      return { message: 'Annulé · vitrine comme avant.' }
    },
  },

  // Photo of the day (16 §3.3, F4): compressed on the phone, sizes made by the server, alt text from visible facts.
  'vitrine.photo': {
    undoSeconds: 30,
    async run(ctx, input) {
      const file = input.photo
      if (!file || typeof file.arrayBuffer !== 'function') refuse('photo_required', 'Prenez ou choisissez une photo.', 422)
      if (!PHOTO_TYPES.includes(file.type)) refuse('photo_type', 'Format non accepté : JPEG, PNG ou WebP seulement.', 415)
      if (file.size > PHOTO_MAX) refuse('photo_size', 'Photo trop lourde (15 Mo au plus).', 413)
      const today = localParts(ctx.now).iso
      const business = await ctx.payload.findGlobal({ slug: 'business', locale: 'fr', ...SYS })
      const shown = await ctx.payload.find({ collection: 'products', where: { vitrine: { equals: true } }, limit: 12, depth: 0, locale: 'fr', sort: 'title', ...SYS })
      const alt = vitrineAlt(business.name, today, shown.docs.filter((p) => p.availability !== 'soldout'))
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const doc = await ctx.payload.create({
        collection: 'media',
        data: { alt, takenAt: ctx.now.toISOString(), credit: VITRINE_CREDIT, consent: false },
        file: { data: Buffer.from(await file.arrayBuffer()), mimetype: file.type, name: `vitrine-${today}-${Date.now()}.${ext}`, size: file.size },
        locale: 'fr',
        depth: 0,
        ...ctx.write,
      })
      return { entity: 'media', entityId: doc.id, before: null, after: { alt, filename: doc.filename }, summary: sentence(ctx.user, ctx.device, 'a publié la photo de la vitrine', ctx.now), message: 'Photo publiée sur le site.', data: { mediaId: doc.id } }
    },
    async undo(ctx, entry) {
      await ctx.payload.delete({ collection: 'media', id: entry.entityId, ...SYS, context: { studioAudited: true } })
      return { message: 'Photo retirée du site.' }
    },
  },

  // Prices: owner and manager, after a step-up; the audit log keeps the price history (G14).
  'product.price': {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const vi = Number(input.variantIndex) || 0
      const variant = product.variants?.[vi]
      if (!variant) refuse('variant', 'Format introuvable.', 404)
      const cents = parseMoney(input.price)
      if (!cents) refuse('price_invalid', 'Prix invalide (ex. 6,50).', 422)
      const variants = product.variants.map((v, i) => ({ ...v, priceCents: i === vi ? cents : v.priceCents }))
      await saveProduct(ctx, product, { variants })
      return {
        entity: 'products',
        entityId: product.id,
        before: { variantIndex: vi, priceCents: variant.priceCents ?? null },
        after: { variantIndex: vi, priceCents: cents },
        summary: sentence(ctx.user, ctx.device, `a changé le prix de ${product.title} (${variant.label}) : ${variant.priceCents ? money(variant.priceCents) : 'à confirmer'} → ${money(cents)}`, ctx.now),
        message: `${product.title} · ${variant.label} : ${money(cents)} (taxes en sus). Les commandes déjà confirmées gardent leur prix.`,
      }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, locale: 'fr', ...SYS })
      const variants = product.variants.map((v, i) => ({ ...v, priceCents: i === entry.before.variantIndex ? entry.before.priceCents : v.priceCents }))
      await saveProduct(ctx, product, { variants }, { system: true })
      return { message: 'Annulé · ancien prix remis.' }
    },
  },

  // « Ces prix sont les bons »: the approximate prices were right. The site stops saying « prix indicatif ».
  'product.pricesOk': {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      await saveProduct(ctx, product, { priceEstimated: false })
      return {
        entity: 'products',
        entityId: product.id,
        before: { priceEstimated: Boolean(product.priceEstimated) },
        after: { priceEstimated: false },
        summary: sentence(ctx.user, ctx.device, `a vérifié les prix de ${product.title}`, ctx.now),
        message: `${product.title} : prix vérifiés · le site n’affiche plus « prix indicatif ».`,
      }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, locale: 'fr', ...SYS })
      await saveProduct(ctx, product, { priceEstimated: entry.before.priceEstimated }, { system: true })
      return { message: 'Annulé · à vérifier comme avant.' }
    },
  },

  // Every format at once: name in both languages, servings, price. The audit log keeps the history (G14).
  'product.formats': {
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const english = await englishOf(ctx, product.id)
      const rows = readFormats(input, product, english)
      const checked = bool(input.checked)
      await saveProduct(ctx, product, { variants: rows.map(({ labelEn, ...row }) => row), priceOnRequest: false, ...(checked ? { priceEstimated: false } : {}) })
      await saveEnglish(ctx, product.id, {}, rows)
      return {
        entity: 'products',
        entityId: product.id,
        before: { variants: formatsOf(product.variants) },
        after: { variants: formatsOf(rows), priceEstimated: checked ? false : Boolean(product.priceEstimated) },
        summary: sentence(ctx.user, ctx.device, `a changé les formats et les prix de ${product.title}`, ctx.now),
        message: `${product.title} : formats et prix enregistrés. Les commandes déjà confirmées gardent leur prix.`,
        noUndo: true,
      }
    },
  },

  // The product's words and how it is sold. The address of its page never changes.
  'product.text': {
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const title = str(input.title, 120)
      if (!title) refuse('title', 'Donnez un nom au produit.', 422)
      const lead = int(str(input.leadHours, 5))
      if (!(lead > 0 && lead <= 24 * 90)) refuse('lead', 'Choisissez le délai de préparation.', 422)
      const messageMax = int(str(input.messageMax, 3))
      if (messageMax !== null && (messageMax < 0 || messageMax > 120)) refuse('message', 'Longueur du message invalide (0 à 120).', 422)
      const summary = str(input.summary, 1200)
      const fields = { title: frTypo(title), summary: summary ? frTypo(summary) : null, leadTimeHours: lead, onlineOrderable: bool(input.online), cakeMessageMax: messageMax > 0 ? messageMax : null }
      await saveProduct(ctx, product, fields)
      await saveEnglish(ctx, product.id, { title: str(input.titleEn, 120) || title, summary: str(input.summaryEn, 1200) || null })
      return {
        entity: 'products',
        entityId: product.id,
        before: { title: product.title, summary: product.summary || null, leadTimeHours: product.leadTimeHours ?? null, onlineOrderable: Boolean(product.onlineOrderable) },
        after: fields,
        summary: sentence(ctx.user, ctx.device, `a modifié la fiche de ${title}`, ctx.now),
        message: `${title} : fiche enregistrée · le site suit aussitôt.`,
        noUndo: true,
      }
    },
  },

  'product.photoAdd': {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const file = input.photo
      if (!file || typeof file.arrayBuffer !== 'function' || !file.size) refuse('photo_required', 'Choisissez une photo.', 422)
      if (!PHOTO_TYPES.includes(file.type)) refuse('photo_type', 'Format non accepté : JPEG, PNG ou WebP seulement.', 415)
      if (file.size > PHOTO_MAX) refuse('photo_size', 'Photo trop lourde (15 Mo au plus).', 413)
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const media = await ctx.payload.create({
        collection: 'media',
        data: { alt: product.title, takenAt: ctx.now.toISOString(), credit: 'Pâtisserie Coco Vanille', consent: false },
        file: { data: Buffer.from(await file.arrayBuffer()), mimetype: file.type, name: `${product.slug}-${Date.now()}.${ext}`, size: file.size },
        locale: 'fr',
        depth: 0,
        ...ctx.write,
      })
      const before = (product.photos || []).map(idOf)
      await saveProduct(ctx, product, { photos: [...before, media.id] })
      return { entity: 'products', entityId: product.id, before: { photos: before }, after: { photos: [...before, media.id], added: media.id }, summary: sentence(ctx.user, ctx.device, `a ajouté une photo à ${product.title}`, ctx.now), message: `${product.title} : photo ajoutée sur le site.` }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, locale: 'fr', ...SYS })
      await saveProduct(ctx, product, { photos: entry.before.photos }, { system: true })
      await ctx.payload.delete({ collection: 'media', id: entry.after.added, ...SYS, context: { studioAudited: true } }).catch(() => null)
      return { message: 'Photo retirée du site.' }
    },
  },

  'product.photoRemove': {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const before = (product.photos || []).map(idOf)
      const after = before.filter((id) => String(id) !== String(input.mediaId))
      if (after.length === before.length) refuse('photo_missing', 'Cette photo n’est plus sur ce produit.', 404)
      await saveProduct(ctx, product, { photos: after })
      return { entity: 'products', entityId: product.id, before: { photos: before }, after: { photos: after }, summary: sentence(ctx.user, ctx.device, `a retiré une photo de ${product.title}`, ctx.now), message: `${product.title} : photo retirée.` }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, locale: 'fr', ...SYS })
      await saveProduct(ctx, product, { photos: entry.before.photos }, { system: true })
      return { message: 'Photo remise.' }
    },
  },

  // Off the menu: no page, no card, no order. « Remettre en vente » brings it back.
  'product.retire': {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      await saveProduct(ctx, product, { availability: 'discontinued', soldOutUntil: null, vitrine: false })
      return { entity: 'products', entityId: product.id, before: availability(product), after: { availability: 'discontinued', soldOutUntil: null }, summary: sentence(ctx.user, ctx.device, `a retiré ${product.title} de la carte`, ctx.now), message: `${product.title} : retiré de la carte et du site.` }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, locale: 'fr', ...SYS })
      await saveProduct(ctx, product, entry.before, { system: true })
      return { message: `${product.title} : de nouveau sur la carte.` }
    },
  },

  // A new product, on the site at once. Its address comes from its name, once.
  'product.create': {
    async run(ctx, input) {
      const title = str(input.title, 120)
      if (!title) refuse('title', 'Donnez un nom au produit.', 422)
      const family = ['gateaux', 'viennoiseries', 'pains', 'patisseries'].includes(input.family) ? input.family : null
      if (!family) refuse('family', 'Choisissez la famille du produit.', 422)
      const lead = int(str(input.leadHours, 5))
      if (!(lead > 0 && lead <= 24 * 90)) refuse('lead', 'Choisissez le délai de préparation.', 422)
      const owner = ctx.user.role === 'proprietaire'
      const taxClass = owner && ['zero', 'taxable', 'rule'].includes(input.taxClass) ? input.taxClass : 'pending'
      const rows = readFormats(input, { taxClass }, null)
      const category = (await ctx.payload.find({ collection: 'categories', where: { productionCategory: { equals: family } }, limit: 1, depth: 0, ...SYS })).docs[0]
      if (!category) refuse('family', 'Cette famille n’existe pas encore.', 409)
      const base = slugify(title)
      if (!base) refuse('title', 'Ce nom ne permet pas de faire une adresse de page.', 422)
      const taken = async (slug, locale) => (await ctx.payload.find({ collection: 'products', where: { slug: { equals: slug } }, locale, limit: 1, depth: 0, draft: true, ...SYS })).totalDocs > 0
      let slug = base
      for (let i = 2; await taken(slug, 'fr'); i++) slug = `${base}-${i}`
      const titleEn = str(input.titleEn, 120) || title
      const baseEn = slugify(titleEn) || base
      let slugEn = baseEn
      for (let i = 2; await taken(slugEn, 'en'); i++) slugEn = `${baseEn}-${i}`
      const summary = str(input.summary, 1200)
      const doc = await ctx.payload.create({
        collection: 'products',
        locale: 'fr',
        data: { title: frTypo(title), slug, summary: summary ? frTypo(summary) : null, category: category.id, productionCategory: family, variants: rows.map(({ labelEn, ...row }) => row), taxClass, leadTimeHours: lead, onlineOrderable: bool(input.online), availability: 'instock', priceEstimated: false, _status: 'published' },
        depth: 0,
        ...ctx.write,
      })
      await saveEnglish(ctx, doc.id, { title: titleEn, slug: slugEn, summary: str(input.summaryEn, 1200) || null }, rows)
      return {
        entity: 'products',
        entityId: doc.id,
        before: null,
        after: { title, slug, variants: formatsOf(rows) },
        summary: sentence(ctx.user, ctx.device, `a ajouté le produit ${title}`, ctx.now),
        message: `${title} : ajouté à la carte.${taxClass === 'pending' ? ' La propriétaire doit encore choisir sa taxe pour la vente en ligne.' : ''}`,
        data: { redirect: `/plus/produits/${doc.id}/` },
        noUndo: true,
      }
    },
  },

  // Allergens verified by a person, never by AI (G3): the checklist + « vérifié le … par … ».
  'product.allergens': {
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      if (!bool(input.confirm)) refuse('confirm_required', 'Cochez « J’ai vérifié la recette » pour confirmer.', 422)
      const ids = (v) => [].concat(v || []).map((x) => Number(x)).filter((n) => Number.isInteger(n))
      const allergens = ids(input.allergens)
      const mayContain = ids(input.mayContain).filter((id) => !allergens.includes(id))
      const before = { allergens: (product.allergens || []).map((a) => (typeof a === 'object' ? a.id : a)), mayContain: (product.mayContain || []).map((a) => (typeof a === 'object' ? a.id : a)), allergensVerified: product.allergensVerified || null }
      const stamp = { by: ctx.user.id, at: ctx.now.toISOString() }
      await saveProduct(ctx, product, { allergens, mayContain, allergensVerified: stamp })
      return {
        entity: 'products',
        entityId: product.id,
        before,
        after: { allergens, mayContain, allergensVerified: stamp },
        summary: sentence(ctx.user, ctx.device, `a vérifié les allergènes de ${product.title}`, ctx.now),
        message: `Allergènes de ${product.title} vérifiés le ${shortDay(localParts(ctx.now).iso)} par ${ctx.user.name}.`,
        noUndo: true,
      }
    },
  },

  // Tax class: owner only, after the accountant (G13). 'pending' blocks online sale.
  'product.tax': {
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const taxClass = ['pending', 'zero', 'taxable', 'rule'].includes(input.taxClass) ? input.taxClass : null
      if (!taxClass) refuse('tax_class', 'Choisissez une classe de taxe.', 422)
      const approvedOn = str(input.approvedOn, 10)
      // The rule is written next to the choice in Studio; a check date (an accountant's, or the owner's) is optional.
      if (approvedOn && !/^\d{4}-\d{2}-\d{2}$/.test(approvedOn)) refuse('approval_date', 'La date doit être au format AAAA-MM-JJ.', 422)
      await saveProduct(ctx, product, { taxClass })
      return {
        entity: 'products',
        entityId: product.id,
        before: { taxClass: product.taxClass },
        after: { taxClass, approvedByAccountantOn: approvedOn || null },
        summary: sentence(ctx.user, ctx.device, `a mis la classe de taxe de ${product.title} à « ${taxClass} »${approvedOn ? ` (vérifiée le ${approvedOn})` : ''}`, ctx.now),
        message: `Classe de taxe de ${product.title} enregistrée.`,
        noUndo: true,
      }
    },
  },
}

async function setVitrine(ctx, ids) {
  const want = new Set((ids || []).map(String))
  const r = await ctx.payload.find({ collection: 'products', limit: 300, depth: 0, locale: 'fr', ...SYS })
  for (const p of r.docs) if (Boolean(p.vitrine) !== want.has(String(p.id))) await saveProduct(ctx, p, { vitrine: want.has(String(p.id)) }, { system: true })
}

function vitrineToggle(on) {
  return {
    undoSeconds: 30,
    async run(ctx, input) {
      const product = await load(ctx, 'products', input.productId)
      const before = await vitrineIds(ctx)
      await saveProduct(ctx, product, { vitrine: on })
      const after = on ? [...new Set([...before, product.id])] : before.filter((id) => String(id) !== String(product.id))
      return {
        entity: 'vitrine',
        entityId: localParts(ctx.now).iso,
        before: { vitrine: before },
        after: { vitrine: after, productId: product.id },
        summary: sentence(ctx.user, ctx.device, `a ${on ? 'ajouté' : 'retiré'} ${product.title} ${on ? 'à' : 'de'} la vitrine`, ctx.now),
        message: `${product.title} ${on ? 'ajouté à' : 'retiré de'} la vitrine.`,
      }
    },
    async undo(ctx, entry) {
      await setVitrine(ctx, entry.before.vitrine)
      return { message: 'Annulé · vitrine comme avant.' }
    },
  }
}
