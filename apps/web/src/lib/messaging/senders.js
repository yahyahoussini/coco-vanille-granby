// Delivery adapters (10 §6): SMS by Twilio, email by Amazon SES (ca-central-1, research/17 §9), or « log »
// in development (prints and appends to MESSAGE_LOG_FILE).
//  SMS: Twilio when TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN (+ TWILIO_FROM or TWILIO_MESSAGING_SERVICE_SID) are set,
//       or SMS_PROVIDER=twilio|log.
//  Email: SES only with EMAIL_PROVIDER=ses (AWS keys alone may belong to backups), + AWS_ACCESS_KEY_ID,
//       AWS_SECRET_ACCESS_KEY, AWS_REGION (default ca-central-1), SES_CONFIGURATION_SET. MAIL_FROM is the sender.
import { appendFile } from 'node:fs/promises'
import { signRequest } from './sigv4.js'
import { buildMime, address } from './mime.js'

export const DEFAULT_FROM = { name: 'Pâtisserie Coco Vanille', email: 'commandes@cocovanillegranby.com' }

export function mailFrom(env = process.env) {
  const raw = env.MAIL_FROM || ''
  const m = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(raw)
  if (m) return { name: m[1].replace(/^"|"$/g, ''), email: m[2] }
  return raw.includes('@') ? { name: DEFAULT_FROM.name, email: raw.trim() } : DEFAULT_FROM
}

function logSender(channel, env) {
  return {
    name: 'log',
    async send(message) {
      const id = `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
      const head = channel === 'sms' ? `[message:log] sms → ${message.to} : ${message.body}` : `[message:log] email → ${message.to} : ${message.subject}${message.attachments?.length ? ` (+${message.attachments.map((a) => a.filename).join(', ')})` : ''}`
      console.log(head)
      if (env.MESSAGE_LOG_FILE) await appendFile(env.MESSAGE_LOG_FILE, `${JSON.stringify({ id, channel, at: new Date().toISOString(), to: message.to, subject: message.subject, body: message.body, template: message.template })}\n`).catch(() => {})
      return { providerId: id }
    },
  }
}

function twilioSender(env) {
  const sid = env.TWILIO_ACCOUNT_SID
  const user = env.TWILIO_API_KEY || sid
  const pass = env.TWILIO_API_SECRET || env.TWILIO_AUTH_TOKEN
  return {
    name: 'twilio',
    async send({ to, body }) {
      const form = new URLSearchParams({ To: to, Body: body })
      if (env.TWILIO_MESSAGING_SERVICE_SID) form.set('MessagingServiceSid', env.TWILIO_MESSAGING_SERVICE_SID)
      else form.set('From', env.TWILIO_FROM)
      if (env.TWILIO_STATUS_CALLBACK) form.set('StatusCallback', env.TWILIO_STATUS_CALLBACK)
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: { authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`, 'content-type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(`twilio ${res.status}: ${data.message || data.code || 'error'}`)
      return { providerId: data.sid }
    },
  }
}

function sesSender(env) {
  const region = env.AWS_REGION || env.SES_REGION || 'ca-central-1'
  const from = mailFrom(env)
  return {
    name: 'ses',
    async send({ to, subject, text, html, attachments }) {
      const raw = buildMime({ from: address(from.name, from.email), to, replyTo: env.MAIL_REPLY_TO || from.email, subject, text, html, attachments })
      const url = `https://email.${region}.amazonaws.com/v2/email/outbound-emails`
      const body = JSON.stringify({
        FromEmailAddress: from.email,
        Destination: { ToAddresses: [to] },
        Content: { Raw: { Data: Buffer.from(raw, 'utf8').toString('base64') } },
        ...(env.SES_CONFIGURATION_SET ? { ConfigurationSetName: env.SES_CONFIGURATION_SET } : {}),
      })
      const headers = signRequest({ url, body, region, service: 'ses', headers: { 'content-type': 'application/json' }, accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY, sessionToken: env.AWS_SESSION_TOKEN })
      delete headers.host
      const res = await fetch(url, { method: 'POST', headers, body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(`ses ${res.status}: ${data.message || data.Message || 'error'}`)
      return { providerId: data.MessageId }
    },
  }
}

export function smsSender(env = process.env) {
  const choice = env.SMS_PROVIDER || (env.TWILIO_ACCOUNT_SID && (env.TWILIO_AUTH_TOKEN || env.TWILIO_API_SECRET) ? 'twilio' : 'log')
  return choice === 'twilio' ? twilioSender(env) : logSender('sms', env)
}

export function emailSender(env = process.env) {
  const choice = env.EMAIL_PROVIDER === 'ses' && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY ? 'ses' : 'log'
  return choice === 'ses' ? sesSender(env) : logSender('email', env)
}

export const senders = (env = process.env) => ({ sms: smsSender(env), email: emailSender(env) })
