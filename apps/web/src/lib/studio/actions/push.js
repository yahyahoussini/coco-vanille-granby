// Alerts on the team's own devices (Studio › Réglages): one device asks for them, stops them, or tries one.
import { sentence } from '../audit.js'
import { pushToTeam } from '../push.js'
import { refuse, str } from './util.js'

const SYS = { overrideAccess: true, depth: 0 }
const URL_OK = /^https:\/\/[^\s]{10,1000}$/

export const pushActions = {
  'push.subscribe': {
    async run(ctx, input) {
      const endpoint = str(input.endpoint, 1000)
      const p256dh = str(input.p256dh, 200)
      const auth = str(input.auth, 100)
      if (!URL_OK.test(endpoint) || !p256dh || !auth) refuse('push_invalid', 'Cet appareil n’a pas donné d’adresse pour les alertes.', 422)
      const data = { endpoint, p256dh, auth, label: str(input.label, 40) || null, user: ctx.user.id }
      const found = (await ctx.payload.find({ collection: 'push-subscriptions', where: { endpoint: { equals: endpoint } }, limit: 1, ...SYS })).docs[0]
      const doc = found ? await ctx.payload.update({ collection: 'push-subscriptions', id: found.id, data, ...SYS }) : await ctx.payload.create({ collection: 'push-subscriptions', data, ...SYS })
      return { entity: 'push-subscriptions', entityId: doc.id, summary: sentence(ctx.user, ctx.device, 'a activé les alertes sur un appareil', ctx.now), message: 'Alertes actives sur cet appareil.', noUndo: true }
    },
  },

  'push.unsubscribe': {
    async run(ctx, input) {
      const endpoint = str(input.endpoint, 1000)
      const found = endpoint ? (await ctx.payload.find({ collection: 'push-subscriptions', where: { endpoint: { equals: endpoint } }, limit: 1, ...SYS })).docs[0] : null
      if (found) await ctx.payload.delete({ collection: 'push-subscriptions', id: found.id, ...SYS })
      return { entity: 'push-subscriptions', entityId: found?.id ?? null, summary: sentence(ctx.user, ctx.device, 'a coupé les alertes sur un appareil', ctx.now), message: 'Alertes coupées sur cet appareil.', noUndo: true }
    },
  },

  'push.test': {
    async run(ctx, input) {
      const endpoint = str(input.endpoint, 1000)
      const sent = await pushToTeam(ctx.payload, { title: 'Coco Studio', body: 'Alerte d’essai : les nouvelles commandes arriveront comme ceci.', url: '/plus/reglages/', tag: 'essai', only: endpoint })
      if (!sent) refuse('push_failed', 'L’alerte n’est pas partie. Coupez les alertes, puis réactivez-les.', 409)
      return { entity: 'push-subscriptions', entityId: null, summary: sentence(ctx.user, ctx.device, 'a essayé les alertes', ctx.now), message: 'Alerte envoyée : elle arrive sur cet appareil dans quelques secondes.', noUndo: true }
    },
  },
}
