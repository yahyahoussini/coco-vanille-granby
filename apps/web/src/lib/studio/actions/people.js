// People and settings: staff PINs, accounts, the « Fermeture » permission, customer questions (16 §8.1 Plus).
import { randomBytes } from 'node:crypto'
import { hashPin, validPin } from '../pin.js'
import { sentence } from '../audit.js'
import { PIN_ROLES } from '../roles.js'
import { refuse, load, str, bool } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const STAFF_ROLES = ['comptoir', 'gerant']

const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'personne'

export const peopleActions = {
  'users.pin': {
    async run(ctx, input) {
      const pin = str(input.pin, 4)
      if (!validPin(pin)) refuse('pin_invalid', 'Le NIP doit avoir 4 chiffres.', 422)
      const target = await load(ctx, 'users', input.userId)
      if (!PIN_ROLES.includes(target.role)) refuse('pin_role', 'Le NIP sert au personnel sur la tablette; ce compte se connecte avec sa clé d’accès ou son mot de passe.', 422)
      await ctx.payload.update({ collection: 'users', id: target.id, data: { pinHash: await hashPin(pin), pinFailures: 0, pinLockedUntil: null }, ...SYS, context: { studioAudited: true } })
      return {
        entity: 'users',
        entityId: target.id,
        before: { pin: 'ancien NIP' },
        after: { pin: 'nouveau NIP' },
        summary: sentence(ctx.user, ctx.device, `a changé le NIP de ${target.name}`, ctx.now),
        message: `NIP de ${target.name} enregistré.`,
        noUndo: true,
      }
    },
  },

  // Counter staff log in with a PIN only: the account gets a placeholder address and a random password.
  'users.create': {
    async run(ctx, input) {
      const name = str(input.name, 60)
      const role = STAFF_ROLES.includes(input.role) ? input.role : 'comptoir'
      const pin = str(input.pin, 4)
      if (!name) refuse('name_required', 'Indiquez le prénom.', 422)
      if (!validPin(pin)) refuse('pin_invalid', 'Le NIP doit avoir 4 chiffres.', 422)
      const email = str(input.email, 120) || `${slug(name)}-${randomBytes(3).toString('hex')}@comptoir.invalid`
      const doc = await ctx.payload.create({
        collection: 'users',
        data: { name, role, email, password: randomBytes(24).toString('base64url'), pinHash: await hashPin(pin), active: true },
        ...SYS,
        context: { studioAudited: true },
      })
      return {
        entity: 'users',
        entityId: doc.id,
        before: null,
        after: { name, role, email },
        summary: sentence(ctx.user, ctx.device, `a ajouté ${name} (${role})`, ctx.now),
        message: `${name} peut maintenant choisir son nom sur la tablette.`,
        noUndo: true,
      }
    },
  },

  'users.active': {
    async run(ctx, input) {
      const target = await load(ctx, 'users', input.userId)
      if (String(target.id) === String(ctx.user.id)) refuse('self', 'Vous ne pouvez pas désactiver votre propre compte.', 422)
      const active = bool(input.active)
      await ctx.payload.update({ collection: 'users', id: target.id, data: { active, ...(active ? {} : { sessions: [] }) }, ...SYS, context: { studioAudited: true } })
      return {
        entity: 'users',
        entityId: target.id,
        before: { active: target.active !== false },
        after: { active },
        summary: sentence(ctx.user, ctx.device, `a ${active ? 'réactivé' : 'désactivé'} le compte de ${target.name}`, ctx.now),
        message: active ? `${target.name} est réactivé·e.` : `${target.name} ne peut plus ouvrir Studio.`,
        noUndo: true,
      }
    },
  },

  'settings.mayClose': {
    async run(ctx, input) {
      const target = await load(ctx, 'users', input.userId)
      const mayClose = bool(input.mayClose)
      await ctx.payload.update({ collection: 'users', id: target.id, data: { mayClose }, ...ctx.write, depth: 0 })
      return {
        entity: 'users',
        entityId: target.id,
        before: { mayClose: Boolean(target.mayClose) },
        after: { mayClose },
        summary: sentence(ctx.user, ctx.device, `a ${mayClose ? 'permis' : 'retiré'} la fermeture de la boutique à ${target.name}`, ctx.now),
        message: mayClose ? `${target.name} peut fermer la boutique.` : `${target.name} ne peut plus fermer la boutique.`,
        noUndo: true,
      }
    },
  },

  // Deposit % for custom-cake quotes: owner only, no default until set (10 §1.2).
  'settings.deposit': {
    async run(ctx, input) {
      const pct = Number(String(input.percent || '').replace(',', '.'))
      if (!(pct > 0 && pct <= 100)) refuse('percent', 'Pourcentage invalide (1 à 100).', 422)
      const shop = await ctx.payload.findGlobal({ slug: 'shop', depth: 0, ...ctx.as })
      await ctx.payload.updateGlobal({ slug: 'shop', data: { ordering: { ...(shop.ordering || {}), depositPercent: pct } }, depth: 0, ...ctx.write })
      return {
        entity: 'shop',
        entityId: 'ordering.depositPercent',
        before: { depositPercent: shop.ordering?.depositPercent ?? null },
        after: { depositPercent: pct },
        summary: sentence(ctx.user, ctx.device, `a fixé l’acompte des gâteaux sur demande à ${pct} %`, ctx.now),
        message: `Acompte : ${pct} % · s’applique aux prochaines soumissions.`,
        noUndo: true,
      }
    },
  },

  // Target of the printed /avis QR code (11 §4.2): the printed link never changes, this does.
  'settings.reviewLink': {
    async run(ctx, input) {
      const url = str(input.url, 500)
      if (url && !/^https:\/\/(g\.page|search\.google\.com|www\.google\.com|maps\.google\.com|maps\.app\.goo\.gl|business\.google\.com)\//.test(url)) refuse('url', 'Collez le lien « Demander des avis » de la fiche Google (https://g.page/… ou https://search.google.com/…).', 422)
      const business = await ctx.payload.findGlobal({ slug: 'business', locale: 'fr', depth: 0, ...ctx.as })
      await ctx.payload.updateGlobal({ slug: 'business', locale: 'fr', data: { google: { ...(business.google || {}), reviewLink: url || null } }, depth: 0, ...ctx.write })
      return {
        entity: 'business',
        entityId: 'google.reviewLink',
        before: { reviewLink: business.google?.reviewLink || null },
        after: { reviewLink: url || null },
        summary: sentence(ctx.user, ctx.device, 'a changé la cible du code QR /avis', ctx.now),
        message: url ? 'Le code QR /avis mène maintenant à ce lien.' : 'Lien retiré · /avis attend un lien.',
        noUndo: true,
      }
    },
  },

  // « Noter une question de client » → agency FAQ queue (AEO loop, 16 §2.3 #36).
  'question.create': {
    undoSeconds: 30,
    async run(ctx, input) {
      const text = str(input.text, 1000)
      if (text.length < 3) refuse('text_required', 'Écrivez la question.', 422)
      const language = ['fr', 'en', 'es'].includes(input.language) ? input.language : 'fr'
      const source = ['comptoir', 'telephone', 'instagram', 'courriel', 'avis'].includes(input.source) ? input.source : 'comptoir'
      const doc = await ctx.payload.create({ collection: 'questions', data: { text, language, source, status: 'new' }, ...ctx.write, depth: 0 })
      return {
        entity: 'questions',
        entityId: doc.id,
        before: null,
        after: { text, language, source },
        summary: sentence(ctx.user, ctx.device, 'a noté une question de client', ctx.now),
        message: 'Question notée · l’agence s’en occupe.',
        data: { id: doc.id },
      }
    },
    async undo(ctx, entry) {
      await ctx.payload.delete({ collection: 'questions', id: entry.entityId, overrideAccess: true, context: { studioAudited: true } }).catch(() => null)
      return { message: 'Question retirée.' }
    },
  },
}
