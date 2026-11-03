// Studio › Plus › Paiement (owner): connect the shop's Stripe account, choose how customers pay, disconnect. The secret key
// goes in here and never comes back out: the audit log and the screen only see its masked form.
import { refuse, bool } from './util.js'
import { sealSecret, maskKey } from '../../payments/secrets.js'
import { getPaymentSettings, SETTINGS_SLUG } from '../../payments/settings.js'
import { resolveOptions } from '../../payments/provider.js'
import { checkKeys, readAccount, ensureWebhook, webhookUrlFor, stripeProblem } from '../../payments/connect.js'
import { stripeFor } from '../../payments/stripe.js'
import { publicOrigin } from '../../ordering/context.js'

const save = (ctx, data) => ctx.payload.updateGlobal({ slug: SETTINGS_SLUG, data, depth: 0, ...ctx.write })
const clear = { stripePublishableKey: null, stripeSecretKey: null, stripeWebhookSecret: null, stripeWebhookId: null, stripeWebhookUrl: null, stripeAccountId: null, stripeAccountName: null, stripeLive: null, stripeChargesEnabled: null, stripeConnectedAt: null }

// Asks Stripe about the account and makes sure its webhook points at this site. Refuses with the owner's words.
async function link(stripe, knownId) {
  try {
    const account = await readAccount(stripe)
    const webhook = await ensureWebhook(stripe, { url: webhookUrlFor(publicOrigin()), knownId })
    return { account, webhook }
  } catch (e) {
    refuse('stripe', stripeProblem(e), 422)
  }
}

export const paymentActions = {
  'payment.connect': {
    async run(ctx, input) {
      const keys = checkKeys(input.publishable, input.secret)
      if (keys.problem) refuse('keys', keys.problem, 422)
      const before = await getPaymentSettings(ctx.payload)
      const { account, webhook } = await link(stripeFor(keys.secret), before.webhookId)
      await save(ctx, {
        stripePublishableKey: keys.publishable,
        stripeSecretKey: sealSecret(keys.secret),
        ...(webhook.secret ? { stripeWebhookSecret: sealSecret(webhook.secret) } : {}),
        stripeWebhookId: webhook.id,
        stripeWebhookUrl: webhook.url,
        stripeAccountId: account.accountId,
        stripeAccountName: account.accountName,
        stripeLive: keys.live,
        stripeChargesEnabled: account.chargesEnabled,
        stripeConnectedAt: ctx.now.toISOString(),
        onlineEnabled: true,
        // Paying at pickup stays as it was: written down, now that the owner's row decides.
        counterEnabled: resolveOptions(before).counter,
      })
      const where = keys.live ? '' : ' (mode essai : aucune vraie carte n’est débitée)'
      return {
        entity: 'payment-settings',
        before: { connected: Boolean(before.secretKey), key: maskKey(before.secretKey) },
        after: { connected: true, key: maskKey(keys.secret), account: account.accountName, live: keys.live },
        summary: `${ctx.user?.name || 'Quelqu’un'} a connecté Stripe (${account.accountName || account.accountId})`,
        message: account.chargesEnabled ? `Stripe connecté${where} : le paiement en ligne est offert sur le site.` : 'Stripe est connecté, mais il n’a pas encore activé les paiements de ce compte. Finissez le dossier dans Stripe, puis touchez « Vérifier la connexion ».',
        noUndo: true,
      }
    },
  },

  // Asks Stripe again: the file finished, or the site moved to its real domain (the webhook follows).
  'payment.check': {
    async run(ctx) {
      const settings = await getPaymentSettings(ctx.payload)
      if (!settings.secretKey) refuse('not_connected', 'Stripe n’est pas connecté.', 409)
      const { account, webhook } = await link(stripeFor(settings.secretKey), settings.webhookId)
      await save(ctx, {
        ...(webhook.secret ? { stripeWebhookSecret: sealSecret(webhook.secret) } : {}),
        stripeWebhookId: webhook.id,
        stripeWebhookUrl: webhook.url,
        stripeAccountId: account.accountId,
        stripeAccountName: account.accountName,
        stripeChargesEnabled: account.chargesEnabled,
      })
      return {
        entity: 'payment-settings',
        after: { account: account.accountName, chargesEnabled: account.chargesEnabled },
        summary: `${ctx.user?.name || 'Quelqu’un'} a vérifié la connexion à Stripe`,
        message: account.chargesEnabled ? 'Connexion vérifiée : tout est en ordre.' : 'Stripe n’a pas encore activé les paiements de ce compte. Finissez le dossier dans Stripe.',
        noUndo: true,
      }
    },
  },

  // What the customer may choose. At least one way stays open.
  'payment.methods': {
    async run(ctx, input) {
      const counter = bool(input.counter)
      const online = bool(input.online)
      const settings = await getPaymentSettings(ctx.payload)
      if (!counter && !online) refuse('none', 'Gardez au moins une façon de payer, sinon personne ne peut commander.', 422)
      if (online && !settings.secretKey) refuse('not_connected', 'Connectez d’abord Stripe pour offrir le paiement en ligne.', 409)
      if (online && settings.chargesEnabled === false) refuse('charges', 'Stripe n’a pas encore activé les paiements de ce compte. Finissez le dossier dans Stripe, puis touchez « Vérifier la connexion ».', 409)
      await save(ctx, { counterEnabled: counter, onlineEnabled: online })
      const words = counter && online ? 'à la cueillette ou en ligne' : counter ? 'à la cueillette seulement' : 'en ligne seulement'
      return {
        entity: 'payment-settings',
        before: { counter: settings.counterEnabled, online: settings.onlineEnabled },
        after: { counter, online },
        summary: `${ctx.user?.name || 'Quelqu’un'} a choisi : paiement ${words}`,
        message: `Les clients paient ${words}. Le site suit aussitôt.`,
        noUndo: true,
      }
    },
  },

  'payment.disconnect': {
    async run(ctx) {
      const settings = await getPaymentSettings(ctx.payload)
      if (settings.secretKey && settings.webhookId) await stripeFor(settings.secretKey).webhookEndpoints.del(settings.webhookId).catch(() => null)
      await save(ctx, { ...clear, onlineEnabled: false, counterEnabled: true })
      return {
        entity: 'payment-settings',
        before: { connected: Boolean(settings.secretKey), key: maskKey(settings.secretKey), account: settings.accountName },
        after: { connected: false },
        summary: `${ctx.user?.name || 'Quelqu’un'} a déconnecté Stripe`,
        message: 'Stripe est déconnecté : les clients paient à la cueillette. Les commandes déjà payées restent dans Stripe.',
        noUndo: true,
      }
    },
  },
}

