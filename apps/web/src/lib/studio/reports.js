// rank-first report files for Agence (16 §4.7): read-only, from REPORTS_DIR (default <repo>/reports).
// gates.json: [{ layer, name, status: 'pass'|'fail', lastRun, evidence, owner }]
// scoreboard.json: [{ week: 'YYYY-MM-DD', seo, aeo, geo }]
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export const reportsDir = () => resolve(process.env.REPORTS_DIR || join(process.cwd(), '..', '..', 'reports'))

export async function readReport(name) {
  try {
    const data = JSON.parse(await readFile(join(reportsDir(), name), 'utf8'))
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

// What is wired, from the environment only (never the secrets themselves).
export function integrations(env = process.env) {
  return [
    { key: 'stripe', label: 'Stripe (paiements)', ok: Boolean(env.STRIPE_SECRET_KEY), note: env.STRIPE_SECRET_KEY ? 'clé présente' : 'pas de clé : paiement de démonstration hors production' },
    { key: 'sms', label: 'Twilio (textos)', ok: Boolean(env.TWILIO_ACCOUNT_SID && (env.TWILIO_FROM || env.TWILIO_MESSAGING_SERVICE_SID)), note: env.TWILIO_ACCOUNT_SID ? 'compte relié' : 'journal seulement (aucun texto réel)' },
    { key: 'email', label: 'Amazon SES (courriels)', ok: env.EMAIL_PROVIDER === 'ses' && Boolean(env.AWS_ACCESS_KEY_ID), note: env.EMAIL_PROVIDER === 'ses' ? 'SES' : 'journal seulement' },
    { key: 'gbp', label: 'Google Business Profile', ok: false, note: 'API pas encore approuvée : avis et heures à la main (12 D4)' },
    { key: 'ga4', label: 'GA4', ok: false, note: 'pas encore relié' },
    { key: 'push', label: 'Alertes (Web Push)', ok: Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY), note: env.VAPID_PUBLIC_KEY ? 'clés VAPID présentes' : 'clés VAPID à créer' },
  ]
}
