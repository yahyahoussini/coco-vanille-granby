// Vitrine and Produits actions (16 §3.3, §8.1 Plus): sold-out with a duration that resets by itself, the
// display case, « Reprendre hier », the photo of the day; prices (step-up, history in the audit log),
// human allergen verification (G3), tax class (owner, G13).
import { localParts, addDays, shortDay } from '../time.js'
import { money, parseMoney } from '../format.js'
import { sentence } from '../audit.js'
import { soldOutUntilToday, soldOutUntilDay, INDEFINITE, untilLabel, vitrineAlt, VITRINE_CREDIT } from '../vitrine.js'
import { refuse, load, str, bool } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const PHOTO_MAX = 15 * 1024 * 1024

const readShop = (ctx) => ctx.payload.findGlobal({ slug: 'shop', locale: 'fr', depth: 0, ...ctx.as })

// Keep a published product published (drafts stay drafts) when Studio changes one field.
async function saveProduct(ctx, product, data, { system = false } = {}) {
  return ctx.payload.update({ collection: 'products', id: product.id, locale: 'fr', data: { ...data, ...(product._status ? { _status: product._status } : {}) }, depth: 0, ...(system ? SYS : ctx.write), context: { studioAudited: true } })
}

const availability = (p) => ({ availability: p.availability, soldOutUntil: p.soldOutUntil || null })

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
        message: `${product.title} · ${variant.label} : ${money(cents)} (taxes en sus). Les commandes déjà payées gardent leur prix.`,
      }
    },
    async undo(ctx, entry) {
      const product = await ctx.payload.findByID({ collection: 'products', id: entry.entityId, locale: 'fr', ...SYS })
      const variants = product.variants.map((v, i) => ({ ...v, priceCents: i === entry.before.variantIndex ? entry.before.priceCents : v.priceCents }))
      await saveProduct(ctx, product, { variants }, { system: true })
      return { message: 'Annulé · ancien prix remis.' }
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
