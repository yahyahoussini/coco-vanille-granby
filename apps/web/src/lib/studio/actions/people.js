// People and settings: staff PINs, accounts, the « Fermeture » permission, customer questions (16 §8.1 Plus).
import { randomBytes } from 'node:crypto'
import { hashPin, validPin } from '../pin.js'
import { sentence } from '../audit.js'
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
      await ctx.payload.update({ collection: 'users', id: target.id, data: { mayClose }, ...ctx.as, depth: 0, context: { studioAudited: true } })
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

  // « Noter une question de client » → agency FAQ queue (AEO loop, 16 §2.3 #36).
  'question.create': {
    undoSeconds: 30,
    async run(ctx, input) {
      const text = str(input.text, 1000)
      if (text.length < 3) refuse('text_required', 'Écrivez la question.', 422)
      const language = ['fr', 'en', 'es'].includes(input.language) ? input.language : 'fr'
      const source = ['comptoir', 'telephone', 'instagram', 'courriel', 'avis'].includes(input.source) ? input.source : 'comptoir'
      const doc = await ctx.payload.create({ collection: 'questions', data: { text, language, source, status: 'new' }, ...ctx.as, depth: 0, context: { studioAudited: true } })
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
