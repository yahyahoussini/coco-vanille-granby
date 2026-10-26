// Raw MIME message (text + HTML alternative, optional attachments such as the pickup .ics) for SES v2 Raw content.
import { randomBytes } from 'node:crypto'

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/.{76}(?=.)/g, '$&\r\n')
export const encodeWord = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`)
export const address = (name, email) => (name ? `${encodeWord(name)} <${email}>` : email)

export function buildMime({ from, to, replyTo, subject, text, html, attachments = [], now = new Date(), domain = 'cocovanillegranby.com' }) {
  const mixed = `mixed_${randomBytes(8).toString('hex')}`
  const alt = `alt_${randomBytes(8).toString('hex')}`
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodeWord(subject || '')}`,
    `Date: ${new Date(now).toUTCString()}`,
    `Message-ID: <${randomBytes(12).toString('hex')}@${domain}>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    '',
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    '',
    `--${alt}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64(text || ''),
    html ? `--${alt}` : null,
    html ? 'Content-Type: text/html; charset=UTF-8' : null,
    html ? 'Content-Transfer-Encoding: base64' : null,
    html ? '' : null,
    html ? b64(html) : null,
    `--${alt}--`,
    ...attachments.flatMap((a) => [
      `--${mixed}`,
      `Content-Type: ${a.contentType || 'application/octet-stream'}; name="${a.filename}"`,
      `Content-Disposition: attachment; filename="${a.filename}"`,
      'Content-Transfer-Encoding: base64',
      '',
      b64(a.content || ''),
    ]),
    `--${mixed}--`,
    '',
  ].filter((l) => l !== null)
  return lines.join('\r\n')
}
