// Coco Studio accounts from the server, for the two moments Studio cannot handle itself:
// 1. A new server: the first accounts, created before Studio opens, so Payload's « create first user » screen is
//    never left open (the first visitor of /admin would otherwise become the owner). Only missing accounts are
//    created; an existing account is never changed.
// 2. A forgotten password or a locked account: RESET_EMAIL gives that one account a new password and unlocks it
//    (no email can carry a reset link until the shop's sending account exists).
// Each password is random and printed once on stdout: hand it over in person or through a password manager.
//
//   OWNER_EMAIL=… [OWNER_NAME=Propriétaire] [AGENCY_EMAIL=… AGENCY_NAME=…] npm run --silent accounts
//   RESET_EMAIL=… npm run --silent accounts
// On the VPS: infra/scripts/run-task.sh production accounts -e OWNER_EMAIL=… (README › Shared server)
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../payload.config.js'

// Stricter than "something@something.tld", so Payload never refuses an address halfway through the run.
const EMAIL = /^(?!.*\.\.)[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i
const fail = (message) => {
  console.error(message)
  process.exit(1)
}

// 4 groups of 5 letters and digits (about 116 bits), easy to read aloud: no 0/O or 1/l/I.
const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const password = () => {
  const chars = []
  while (chars.length < 20) {
    // Rejection sampling: no letter more likely than another.
    for (const b of randomBytes(32)) {
      if (b < 256 - (256 % ALPHABET.length) && chars.length < 20) chars.push(ALPHABET[b % ALPHABET.length])
    }
  }
  return chars.join('').match(/.{5}/g).join('-')
}

const reset = process.env.RESET_EMAIL?.trim().toLowerCase()
const wanted = [
  { email: process.env.OWNER_EMAIL, name: process.env.OWNER_NAME || 'Propriétaire', role: 'proprietaire' },
  { email: process.env.AGENCY_EMAIL, name: process.env.AGENCY_NAME || 'Agence', role: 'agence' },
].filter((a) => a.email)

if (reset) {
  if (!EMAIL.test(reset)) fail(`Not an email address: ${reset}`)
} else {
  if (!wanted.some((a) => a.role === 'proprietaire')) fail('OWNER_EMAIL is required: the owner account is the one that adds the others in Studio.')
  for (const a of wanted) if (!EMAIL.test(a.email)) fail(`Not an email address: ${a.email}`)
}

const payload = await getPayload({ config })
const findUser = async (email) => (await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]

if (reset) {
  const user = await findUser(reset)
  if (!user) fail(`No account for ${reset}: nothing changed.`)
  const secret = password()
  await payload.update({ collection: 'users', id: user.id, data: { password: secret }, overrideAccess: true, depth: 0 })
  await payload.unlock({ collection: 'users', data: { email: reset }, overrideAccess: true }).catch(() => {})
  console.log(`reset    ${reset} (${user.role})  password: ${secret}`)
  process.exit(0)
}

// Accounts nobody asked for here are listed, so a stranger who registered first cannot go unnoticed.
const asked = new Set(wanted.map((a) => a.email.trim().toLowerCase()))
const others = (await payload.find({ collection: 'users', limit: 200, depth: 0, overrideAccess: true, sort: 'createdAt' })).docs.filter((u) => !asked.has(u.email))
for (const u of others) console.log(`other    ${u.email} (${u.role}), created ${u.createdAt}`)
// An owner account under an email nobody gave here, while the requested owner does not exist yet: someone may
// have used Payload's first-user screen before this ran. Stop and look; nothing is created.
const owner = wanted.find((a) => a.role === 'proprietaire')
if (!(await findUser(owner.email.trim().toLowerCase())) && others.some((u) => u.role === 'proprietaire')) {
  console.error('An owner account above was not created by this script: check who made it before going on. Nothing was created.')
  process.exit(2)
}

let created = 0
for (const a of wanted) {
  const email = a.email.trim().toLowerCase()
  const found = await findUser(email)
  if (found) {
    console.log(`kept     ${email} (${found.role}): the account exists, nothing changed`)
    continue
  }
  const secret = password()
  await payload.create({
    collection: 'users',
    data: { email, password: secret, name: a.name, role: a.role, active: true, uiLanguage: 'fr' },
    overrideAccess: true,
    depth: 0,
  })
  // Printed at once: a later failure must not leave an account whose password nobody saw.
  console.log(`created  ${email} (${a.role})  password: ${secret}`)
  created += 1
}
if (!created) console.log('No new account.')
process.exit(0)
