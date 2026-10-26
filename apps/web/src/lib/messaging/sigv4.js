// AWS Signature Version 4 for one JSON request (SES v2). No SDK: node:crypto only.
import { createHash, createHmac } from 'node:crypto'

const sha256 = (data) => createHash('sha256').update(data, 'utf8').digest('hex')
const hmac = (key, data) => createHmac('sha256', key).update(data, 'utf8').digest()
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)

// → headers to send (host, x-amz-date, [x-amz-security-token], authorization, + the given ones)
export function signRequest({ method = 'POST', url, headers = {}, body = '', region, service, accessKeyId, secretAccessKey, sessionToken, now = new Date() }) {
  const u = new URL(url)
  const amzDate = new Date(now).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const date = amzDate.slice(0, 8)
  const all = { ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), String(v).trim()])), host: u.host, 'x-amz-date': amzDate }
  if (sessionToken) all['x-amz-security-token'] = sessionToken
  const names = Object.keys(all).sort()
  const canonicalHeaders = names.map((n) => `${n}:${all[n].replace(/\s+/g, ' ')}\n`).join('')
  const signedHeaders = names.join(';')
  const query = [...u.searchParams.entries()].map(([k, v]) => [enc(k), enc(v)]).sort(([a, x], [b, y]) => (a === b ? (x < y ? -1 : 1) : a < b ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('&')
  const path = u.pathname.split('/').map((p) => enc(decodeURIComponent(p))).join('/') || '/'
  const canonical = [method, path, query, canonicalHeaders, signedHeaders, sha256(body)].join('\n')
  const scope = `${date}/${region}/${service}/aws4_request`
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonical)].join('\n')
  const key = hmac(hmac(hmac(hmac(`AWS4${secretAccessKey}`, date), region), service), 'aws4_request')
  const signature = createHmac('sha256', key).update(stringToSign, 'utf8').digest('hex')
  return { ...all, authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}` }
}
