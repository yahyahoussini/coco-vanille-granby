// First Coco Studio accounts on a new server, so Payload's « create first user » screen is never left open
// (the first visitor of /admin would otherwise become the owner). Creates only the accounts that do not exist
// yet; an existing account is never changed. Each new password is random, printed once on stdout: hand it over
// in person or through a password manager, then the person changes it and adds a passkey in Studio.
//
//   OWNER_EMAIL=… [OWNER_NAME=Propriétaire] [AGENCY_EMAIL=… AGENCY_NAME=…] npm run --silent accounts
//
// On the VPS: docker compose … run --rm -e OWNER_EMAIL=… migrate npm run --silent accounts
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const wanted = [
  { email: process.env.OWNER_EMAIL, name: process.env.OWNER_NAME || 'Propriétaire', role: 'proprietaire' },
  { email: process.env.AGENCY_EMAIL, name: process.env.AGENCY_NAME || 'Agence', role: 'agence' },
].filter((a) => a.email)

if (!wanted.some((a) => a.role === 'proprietaire')) {
  console.error('OWNER_EMAIL is required: the owner account is the one that adds the others in Studio.')
  process.exit(1)
}
for (const a of wanted) {
  if (!EMAIL.test(a.email)) {
    console.error(`Not an email address: ${a.email}`)
    process.exit(1)
  }
}

// 4 groups of 5 letters and digits (about 119 bits), easy to read aloud; no 0/O or 1/l/I.
const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const password = () => {
  const bytes = randomBytes(40)
  const chars = []
  for (const b of bytes) {
    if (b < 256 - (256 % ALPHABET.length)) chars.push(ALPHABET[b % ALPHABET.length])
    if (chars.length === 20) break
  }
  return chars.join('').match(/.{5}/g).join('-')
}

const payload = await getPayload({ config })
const created = []
for (const a of wanted) {
  const email = a.email.trim().toLowerCase()
  const found = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })
  if (found.docs[0]) {
    console.log(`kept     ${email} (${found.docs[0].role}): the account exists, nothing changed`)
    continue
  }
  const secret = password()
  await payload.create({
    collection: 'users',
    data: { email, password: secret, name: a.name, role: a.role, active: true, uiLanguage: 'fr' },
    overrideAccess: true,
    depth: 0,
  })
  created.push({ email, role: a.role, secret })
}
for (const c of created) console.log(`created  ${c.email} (${c.role})  password: ${c.secret}`)
if (!created.length) console.log('No new account.')
process.exit(0)
