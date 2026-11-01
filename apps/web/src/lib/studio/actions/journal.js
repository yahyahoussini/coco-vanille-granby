// Studio « Journal » (Plus › Journal): write the French post, its English adaptation, publish or schedule each
// language, take a post off the site. French first (Loi 96): English is written after the French and released only
// while the French is published. Every change is in the audit log with before and after, and can be undone for 30 s.
// No Payload drafts (collections/Journal.js): saving a published post changes the live page, once its checks pass.
import { sentence } from '../audit.js'
import { refuse, str, bool, load } from './util.js'
import { parsePostForm, slugFrom } from '../journal-form.js'
import { checkPost, releaseInstant, weekKey, dayOfPost, slugError, relatedError, photoKnown, POST_CATEGORIES } from '../../journal.js'
import { frenchCopy } from '../../typo.js'
import { localParts, addDays } from '../time.js'
import { dayText } from '../journal-view.js'

const SYS = { overrideAccess: true, depth: 0 }
const LOCKED = 'Cette adresse est déjà publique : elle ne change plus (docs/17 §7).'
// Fields restored by « Annuler ».
const COPY = ['slug', 'title', 'description', 'h1', 'answer', 'sections', 'faq', 'changeNote']
const SHARED = ['category', 'photo', 'related', 'publishedAt', 'sources', 'contentUpdatedAt', 'enReviewNeeded']
const STATE = ['state', 'stateEn', 'publishedAt', 'releasedAt', 'releasedEnAt', 'enReviewNeeded']

const pick = (doc, keys) => Object.fromEntries(keys.map((k) => [k, doc?.[k] ?? null]))
// Arrays as stored, without Payload's row ids (a restore writes fresh rows).
const plain = (v) => JSON.parse(JSON.stringify(v ?? null, (k, x) => (k === 'id' ? undefined : x)))
const titleOf = (doc) => doc?.title || doc?.slug || `billet ${doc?.id}`

// The other posts in one language, and the registry pages' copy, for the uniqueness checks (E8, E11, W6).
async function othersIn(ctx, locale) {
  const res = await ctx.payload.find({ collection: 'posts', locale, limit: 500, pagination: false, ...SYS })
  return res.docs.map((d) => ({ id: d.id, slug: d.slug, title: d.title, description: d.description, state: d.state, publishedAt: d.publishedAt }))
}
async function pagesIn(ctx, locale) {
  const res = await ctx.payload.find({ collection: 'pages', locale, limit: 500, pagination: false, ...SYS }).catch(() => ({ docs: [] }))
  return res.docs.map((d) => ({ key: d.key, title: d.title, description: d.description }))
}
const checks = async (ctx, doc, locale) => checkPost(doc, locale, { others: await othersIn(ctx, locale), pages: await pagesIn(ctx, locale) })

const failChecks = (code, errors) => refuse(code, `${errors.length} ${errors.length > 1 ? 'erreurs' : 'erreur'} à corriger : ${errors.map((e) => e.message).join(' · ')}`, 422, { errors })

async function slugGuard(ctx, { id, locale, slug, locked }) {
  if (!slug) return
  if (locked && locked !== slug) refuse('slug_locked', LOCKED, 409)
  const bad = slugError(slug)
  if (bad) refuse('invalid', `Adresse : ${bad}`, 422, { errors: [{ code: 'E8', message: bad }] })
  const taken = (await othersIn(ctx, locale)).some((o) => String(o.id) !== String(id ?? '') && o.slug === slug)
  if (taken) refuse('slug_taken', 'Cette adresse est déjà prise par un autre billet.', 409)
}

// A key that never changes (seed, « Faits du site »): the first French address, made unique.
async function freshKey(ctx, base) {
  const root = slugFrom(base) || 'billet'
  for (let n = 1; n < 50; n++) {
    const key = n === 1 ? root : `${root}-${n}`
    const found = await ctx.payload.find({ collection: 'posts', where: { key: { equals: key } }, limit: 1, ...SYS })
    if (!found.docs.length) return key
  }
  return `${root}-${Date.now()}`
}

const restore = async (ctx, entry, locale, keys) => {
  const before = entry.before || {}
  const data = Object.fromEntries(keys.filter((k) => k in before).map((k) => [k, before[k]]))
  await ctx.payload.update({ collection: 'posts', id: entry.entityId, locale, data, ...SYS, context: { studioAudited: true } })
}

export const journalActions = {
  // Create, or save the French copy and the shared fields. A published post is checked first (it is live).
  'post.saveFr': {
    undoSeconds: 30,
    async run(ctx, input) {
      const { shared, copy, major } = parsePostForm(input, 'fr')
      const fr = frenchCopy(copy)
      const id = input.id ? str(input.id, 20) : null
      const prev = id ? await load(ctx, 'posts', id, { locale: 'fr' }) : null
      if (!fr.title) refuse('missing', 'Donnez au moins un titre au billet.', 422)
      await slugGuard(ctx, { id, locale: 'fr', slug: fr.slug, locked: prev?.releasedAt ? prev.slug : null })
      // What the collection itself requires of every save, said here in plain words instead of a database error.
      if (!POST_CATEGORIES.includes(shared.category) || !photoKnown(shared.photo) || !shared.publishedAt) refuse('missing', 'Choisissez une catégorie, une photo et un jour de publication.', 422)
      const related = relatedError(shared.related)
      if (related) refuse('missing', related, 422)
      if (!shared.sources.length) refuse('missing', 'Donnez au moins une source (nom, adresse https:// et date).', 422)
      shared.sources.forEach((s, i) => {
        if (!s.label || !/^https:\/\/[^\s]+$/.test(s.url) || !/^\d{4}-\d{2}-\d{2}$/.test(s.date)) refuse('invalid', `Source ${i + 1} : un nom, une adresse https:// complète et une date AAAA-MM-JJ.`, 422)
      })
      // A post that has been public keeps its day; « Changement important » dates the update instead.
      const day = prev?.releasedAt ? dayOfPost(prev.publishedAt) : shared.publishedAt
      if (prev?.releasedAt && shared.publishedAt !== day) refuse('date_locked', 'Ce billet a déjà paru : sa date ne change plus. Cochez « Changement important » pour dater la mise à jour.', 409)
      const data = { ...shared, publishedAt: releaseInstant(day).toISOString(), ...fr }
      if (prev?.state === 'published') {
        const { errors } = await checks(ctx, { ...prev, ...data, id: prev.id }, 'fr')
        if (errors.length) failChecks('invalid', errors)
        if (major) {
          data.contentUpdatedAt = ctx.now.toISOString()
          if (prev.stateEn === 'published') data.enReviewNeeded = true
        }
      }
      const doc = prev
        ? await ctx.payload.update({ collection: 'posts', id: prev.id, locale: 'fr', data, ...ctx.write, depth: 0 })
        : await ctx.payload.create({ collection: 'posts', locale: 'fr', data: { ...data, key: await freshKey(ctx, fr.slug || fr.title), state: 'draft', stateEn: 'draft', author: 'equipe' }, ...ctx.write, depth: 0 })
      return {
        entity: 'posts',
        entityId: doc.id,
        before: prev ? plain({ ...pick(prev, COPY), ...pick(prev, SHARED) }) : null,
        after: plain({ ...pick(doc, COPY), ...pick(doc, SHARED) }),
        summary: sentence(ctx.user, ctx.device, `${prev ? 'a modifié' : 'a créé'} le billet « ${titleOf(doc)} »${major && prev?.state === 'published' ? ' (changement important)' : ''}`, ctx.now),
        message: prev?.state === 'published' ? 'Enregistré · la page en ligne est à jour.' : 'Brouillon enregistré.',
        data: prev ? { id: doc.id } : { id: doc.id, redirect: `/plus/journal/${doc.id}/` },
      }
    },
    async undo(ctx, entry) {
      if (!entry.before) {
        await ctx.payload.delete({ collection: 'posts', id: entry.entityId, ...SYS, context: { studioAudited: true } }).catch(() => null)
        return { message: 'Billet retiré : rien n’a été créé.' }
      }
      await restore(ctx, entry, 'fr', [...COPY, ...SHARED])
      return { message: 'Billet remis comme avant.' }
    },
  },

  // The English copy, stored as typed. Traduction may write it; it is released by « post.publishEn ».
  'post.saveEn': {
    undoSeconds: 30,
    async run(ctx, input) {
      const id = str(input.id, 20)
      const fr = await load(ctx, 'posts', id, { locale: 'fr' })
      if (!fr.title) refuse('french_first', 'Écrivez d’abord le billet en français.', 422)
      const prev = await load(ctx, 'posts', id, { locale: 'en' })
      const { copy } = parsePostForm(input, 'en')
      await slugGuard(ctx, { id, locale: 'en', slug: copy.slug, locked: prev.releasedEnAt ? prev.slug : null })
      if (prev.stateEn === 'published') {
        const { errors } = await checks(ctx, { ...prev, ...copy, id: prev.id }, 'en')
        if (errors.length) failChecks('invalid', errors)
      }
      const doc = await ctx.payload.update({ collection: 'posts', id: prev.id, locale: 'en', data: copy, ...ctx.write, depth: 0 })
      return {
        entity: 'posts',
        entityId: doc.id,
        before: plain(pick(prev, COPY)),
        after: plain(pick(doc, COPY)),
        summary: sentence(ctx.user, ctx.device, `a modifié l’anglais du billet « ${titleOf(fr)} »`, ctx.now),
        message: prev.stateEn === 'published' ? 'Enregistré · la page anglaise est à jour.' : 'Anglais enregistré.',
        data: { id: doc.id },
      }
    },
    async undo(ctx, entry) {
      await restore(ctx, entry, 'en', COPY)
      return { message: 'Anglais remis comme avant.' }
    },
  },

  // Publish now or schedule (6 h, Granby time, on the chosen day): the checks, the « J’ai vérifié » box, one post a week.
  'post.publish': {
    undoSeconds: 30,
    async run(ctx, input) {
      const doc = await load(ctx, 'posts', str(input.id, 20), { locale: 'fr' })
      const day = str(input.publishedAt, 10) || dayOfPost(doc.publishedAt)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '')) refuse('invalid', 'Choisissez le jour de publication.', 422)
      const today = localParts(ctx.now).iso
      // No backdating: a post never released is dated today or later (yesterday tolerated, for a late evening).
      if (!doc.releasedAt && day < addDays(today, -1)) refuse('past_date', 'Pas de date passée : un billet paraît aujourd’hui ou plus tard.', 422)
      const at = releaseInstant(day)
      const candidate = { ...doc, publishedAt: at.toISOString() }
      const { errors } = await checks(ctx, candidate, 'fr')
      if (errors.length) failChecks('checks', errors)
      if (!bool(input.verified)) refuse('verify', 'Cochez « J’ai vérifié » : un fait local, un détail vérifié de la boutique ou un tableau clair, chaque chiffre daté et sourcé.', 422)
      const week = weekKey(day)
      const clash = (await othersIn(ctx, 'fr')).find((o) => String(o.id) !== String(doc.id) && o.state === 'published' && weekKey(o.publishedAt) === week)
      const override = clash && input.override === '1' && ctx.user?.role === 'proprietaire'
      if (clash && !override) refuse('one_per_week', `Un seul billet par semaine : « ${titleOf(clash)} » paraît déjà la semaine du ${dayText(week)}.`, 409)
      const live = at.getTime() <= ctx.now.getTime()
      const data = { state: 'published', publishedAt: at.toISOString(), ...(live && !doc.releasedAt ? { releasedAt: ctx.now.toISOString() } : {}) }
      const after = await ctx.payload.update({ collection: 'posts', id: doc.id, locale: 'fr', data, ...ctx.write, depth: 0 })
      return {
        entity: 'posts',
        entityId: doc.id,
        before: pick(doc, STATE),
        after: pick(after, STATE),
        summary: sentence(ctx.user, ctx.device, `a ${live ? 'publié' : `programmé pour le ${dayText(day)}`} le billet « ${titleOf(doc)} »${override ? ` (deuxième billet de la semaine, permis par la propriétaire : « ${titleOf(clash)} »)` : ''}`, ctx.now),
        message: live ? 'Billet en ligne.' : `Billet programmé pour le ${dayText(day)}, 6 h.`,
        data: { id: doc.id },
      }
    },
    async undo(ctx, entry) {
      await restore(ctx, entry, 'fr', STATE)
      return { message: 'Publication annulée : le billet est comme avant.' }
    },
  },

  // Off the site at once (the address answers 404); English follows, since French comes first.
  'post.unpublish': {
    undoSeconds: 30,
    async run(ctx, input) {
      const reason = str(input.reason, 200).replace(/\s+/g, ' ')
      if (!reason) refuse('missing', 'Donnez la raison en une ligne.', 422)
      const doc = await load(ctx, 'posts', str(input.id, 20), { locale: 'fr' })
      const after = await ctx.payload.update({ collection: 'posts', id: doc.id, locale: 'fr', data: { state: 'draft' }, ...ctx.write, depth: 0 })
      return {
        entity: 'posts',
        entityId: doc.id,
        before: pick(doc, STATE),
        after: { ...pick(after, STATE), reason },
        summary: sentence(ctx.user, ctx.device, `a retiré du site le billet « ${titleOf(doc)} » (${reason})`, ctx.now),
        message: 'Billet retiré du site.',
        data: { id: doc.id },
      }
    },
    async undo(ctx, entry) {
      await restore(ctx, entry, 'fr', ['state'])
      return { message: 'Billet remis comme avant.' }
    },
  },

  // English released by a person of the shop or the agency, after a fluent reader's review (research/14 M2).
  'post.publishEn': {
    undoSeconds: 30,
    async run(ctx, input) {
      const id = str(input.id, 20)
      const fr = await load(ctx, 'posts', id, { locale: 'fr' })
      if (fr.state !== 'published') refuse('french_first', 'Publiez d’abord le billet en français.', 422)
      const en = await load(ctx, 'posts', id, { locale: 'en' })
      const { errors } = await checks(ctx, en, 'en')
      if (errors.length) failChecks('checks', errors)
      if (!bool(input.verified)) refuse('verify', 'Cochez « Une personne qui écrit l’anglais couramment a relu ce billet ».', 422)
      const data = { stateEn: 'published', enReviewNeeded: false, ...(fr.releasedAt && !en.releasedEnAt ? { releasedEnAt: ctx.now.toISOString() } : {}) }
      const after = await ctx.payload.update({ collection: 'posts', id: en.id, locale: 'en', data, ...ctx.write, depth: 0 })
      return {
        entity: 'posts',
        entityId: en.id,
        before: pick(en, STATE),
        after: pick(after, STATE),
        summary: sentence(ctx.user, ctx.device, `a publié l’anglais du billet « ${titleOf(fr)} »`, ctx.now),
        message: fr.releasedAt ? 'Billet anglais en ligne.' : 'Billet anglais programmé avec le français.',
        data: { id: en.id },
      }
    },
    async undo(ctx, entry) {
      await restore(ctx, entry, 'en', STATE)
      return { message: 'Anglais remis comme avant.' }
    },
  },

  'post.unpublishEn': {
    undoSeconds: 30,
    async run(ctx, input) {
      const doc = await load(ctx, 'posts', str(input.id, 20), { locale: 'fr' })
      const after = await ctx.payload.update({ collection: 'posts', id: doc.id, locale: 'en', data: { stateEn: 'draft' }, ...ctx.write, depth: 0 })
      return {
        entity: 'posts',
        entityId: doc.id,
        before: pick(doc, STATE),
        after: pick(after, STATE),
        summary: sentence(ctx.user, ctx.device, `a retiré l’anglais du billet « ${titleOf(doc)} »`, ctx.now),
        message: 'Billet anglais retiré du site.',
        data: { id: doc.id },
      }
    },
    async undo(ctx, entry) {
      await restore(ctx, entry, 'en', ['stateEn'])
      return { message: 'Anglais remis comme avant.' }
    },
  },
}
