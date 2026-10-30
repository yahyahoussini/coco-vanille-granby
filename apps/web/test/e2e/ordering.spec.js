// Ordering module end to end: the custom-cake request form (JavaScript off), then « Ma boîte » → checkout →
// mock payment → paid → confirmation queued → the worker sends it through the log sender.
// The box flow needs the demo data (SEED_DEMO=true npm run seed:demo: ordering on, invented hours, prices and
// capacity); on the verified-facts-only seed it is skipped, because nothing can be ordered online yet.
import { test, expect } from '@playwright/test'
import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, existsSync } from 'node:fs'
import { deflateSync, crc32 } from 'node:zlib'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import pg from 'pg'
import { PUBLIC_URL, raw } from './support/site.js'

const APP_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const DB = process.env.DATABASE_URI

// A small real PNG (caramel square) for the inspiration-photo upload.
function png(w = 32, h = 24) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])) >>> 0)
    return Buffer.concat([len, Buffer.from(type), data, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr.set([8, 2, 0, 0, 0], 8)
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(w * 3, Buffer.from([0xc8, 0x91, 0x5a]))])
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.concat(Array(h).fill(row)))), chunk('IEND', Buffer.alloc(0))])
}
const PNG = png()

async function query(sql, params = []) {
  const client = new pg.Client({ connectionString: DB })
  await client.connect()
  try {
    return (await client.query(sql, params)).rows
  } finally {
    await client.end()
  }
}

// One worker pass (WORKER_ONCE=1) with the log sender writing to a file we can read.
function runWorkerOnce(logFile) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['payload', 'run', 'src/worker/index.js'], {
      cwd: APP_DIR,
      env: { ...process.env, WORKER_ONCE: '1', MESSAGE_LOG_FILE: logFile, SMS_PROVIDER: 'log', EMAIL_PROVIDER: 'log', PAYLOAD_CONFIG_PATH: 'src/payload.config.js' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (out += d))
    const timer = setTimeout(() => child.kill('SIGKILL'), 120_000)
    child.on('error', reject)
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, out })
    })
  })
}

const seriousViolations = async (page) => {
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  return res.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
}

test.describe('custom-cake request form', () => {
  test.use({ javaScriptEnabled: false })

  test('works without JavaScript: errors in text, then the thanks state and a queued confirmation', async ({ page }) => {
    await page.goto(`${PUBLIC_URL}/commander/`)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('#demande')).toHaveText('Que faut-il nous dire pour un gâteau personnalisé?')

    // Server-side validation: the browser's own checks are bypassed to reach the server.
    await page.locator('#demande-form').evaluate((f) => f.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
    await expect(page).toHaveURL(/\/commander\/\?erreur=1#demande$/)
    await expect(page.locator('.error-summary')).toContainText('Indiquez l’occasion.')
    await expect(page.locator('#f-occasion')).toHaveAttribute('aria-invalid', 'true')

    const date = new Date(Date.now() + 20 * 86400 * 1000).toISOString().slice(0, 10)
    const email = `e2e-demande-${Date.now()}@example.test`
    await page.getByLabel('Pour quelle occasion?').fill('Anniversaire (test e2e)')
    await page.getByLabel('Pour combien de personnes?').fill('20')
    await page.getByLabel('Pour quelle date de cueillette?').fill(date)
    await page.getByLabel('Quelle saveur aimeriez-vous?').fill('Vanille')
    await page.getByLabel('Message sur le gâteau').fill('Bonne fête Léo')
    await page.getByLabel('Photos d’inspiration (jusqu’à 3)').setInputFiles({ name: 'inspiration.png', mimeType: 'image/png', buffer: PNG })
    await page.getByLabel('Une allergie ou une restriction alimentaire est en cause').check()
    await page.getByLabel('Prénom').fill('Léa')
    await page.getByLabel('Téléphone').fill('450 555-0123')
    await page.getByLabel('Courriel').fill(email)
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click()

    await expect(page).toHaveURL(/\/commander\/merci\/\?demande=[\w-]{12}$/)
    await expect(page.locator('h1')).toHaveText('Merci, votre demande est envoyée')
    await expect(page.locator('.answer')).toContainText('avec un prix et un lien pour l’acompte')
    await expect(page.locator('.notice')).toContainText('nous vous appellerons')
    expect(await page.locator('meta[name="robots"]').getAttribute('content')).toMatch(/noindex/)

    if (DB) {
      const [req] = await query(`select r.id, r.status, r.has_allergy, round(extract(epoch from (r.answer_by - r.created_at)) / 3600)::int as hours, count(p.id)::int as photos
        from requests r left join requests_rels p on p.parent_id = r.id and p.path = 'photos' where r.customer_email = $1 group by r.id`, [email])
      expect(req.status).toBe('new')
      expect(req.has_allergy).toBe(true)
      expect(req.photos).toBe(1)
      expect(req.hours).toBe(24)
      const messages = await query(`select template, status from messages where "to" = $1`, [email])
      expect(messages).toEqual([{ template: 'request_received', status: 'queued' }])
    }
  })
})

test.describe('accessibility', () => {
  test('the order page and the request form pass axe (WCAG 2.2 AA, serious and critical)', async ({ page }) => {
    await page.goto(`${PUBLIC_URL}/commander/`)
    expect(await seriousViolations(page)).toEqual([])
  })

  test('the request form after an error keeps a correct structure (summary, invalid fields)', async ({ page }) => {
    await page.goto(`${PUBLIC_URL}/commander/`)
    await page.locator('#demande-form').evaluate((f) => f.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
    await expect(page.locator('.error-summary')).toBeVisible()
    await expect(page.locator('.error-summary')).toHaveAttribute('role', 'alert')
    expect(await seriousViolations(page)).toEqual([])
  })
})

test.describe.serial('« Ma boîte » → checkout → mock payment → worker', () => {
  const email = `e2e-commande-${Date.now()}@example.test`
  let thanksUrl

  test('box, day and window chips, review with taxes, terms, mock payment, thanks', async ({ page }) => {
    // Four pages and four axe scans: on a busy laptop running the suite in parallel this takes more than the
    // default 60 s (about 26 s alone), so the whole flow gets two minutes.
    test.setTimeout(120_000)
    // The checkout pages carry the Stripe-only CSP (next.config.mjs): nothing on them may trip it.
    const cspErrors = []
    page.on('console', (m) => {
      if (/Content Security Policy|Refused to (load|execute|connect|frame)/i.test(m.text())) cspErrors.push(m.text())
    })
    await page.goto(`${PUBLIC_URL}/commander/`)
    const add = page.locator('form.order-add').first()
    test.skip((await add.count()) === 0, 'No product can be ordered online: run SEED_DEMO=true npm run seed:demo first.')
    await add.getByRole('button', { name: 'Ajouter à ma boîte' }).click()

    await expect(page).toHaveURL(/\/boite\/[\w-]+\//)
    await expect(page.locator('h1')).toHaveText('Ma boîte')
    expect(await page.locator('meta[name="robots"]').getAttribute('content')).toMatch(/noindex/)
    await expect(page.locator('#boite-jour')).toHaveText('Quelle journée de cueillette?')
    const days = page.locator('.day-chips .chip')
    expect(await days.count()).toBeGreaterThan(0)
    await expect(days.first()).toHaveAttribute('aria-current', 'true')
    await expect(page.locator('#boite-totaux .totals-gst th')).toHaveText('TPS (5 %)')
    await expect(page.locator('#boite-totaux .totals-qst th')).toHaveText('TVQ (9,975 %)')
    expect(await seriousViolations(page)).toEqual([])

    // The second day, then the first free window.
    if ((await days.count()) > 1) {
      await days.nth(1).click()
      await expect(days.nth(1)).toHaveAttribute('aria-current', 'true')
    }
    await expect(page.locator('.window-chips input[type="radio"]').first()).toBeChecked()
    await page.getByRole('button', { name: 'Continuer' }).click()

    await expect(page).toHaveURL(/\/commander\/paiement\/\?boite=/)
    await expect(page.locator('h1')).toHaveText('Vos coordonnées et le récapitulatif')
    await expect(page.locator('#recapitulatif')).toHaveText('Votre récapitulatif est-il exact?')
    await expect(page.locator('#recap-totaux .totals-total td')).toHaveText(/\d+,\d{2}\s\$/)
    for (const id of ['#c-terms', '#c-marketing', '#c-birthdayReminder', '#c-reviewRequest']) await expect(page.locator(id)).not.toBeChecked()
    expect(await seriousViolations(page)).toEqual([])

    await page.getByLabel('Prénom').fill('Julie')
    await page.getByLabel('Courriel').fill(email)
    await page.getByLabel('Téléphone').fill('450 555-0101')
    await page.getByLabel('Note d’allergie (facultatif)').fill('Allergie aux noix (test e2e)')
    const pay = page.getByRole('button', { name: /^Confirmer et payer \d+,\d{2}\s\$$/ })
    const total = (await page.locator('#recap-totaux .totals-total td').textContent()).trim()
    await expect(pay).toContainText(total)

    // Without the terms box the order is refused (server-side check; the browser check bypassed).
    await page.locator('form.checkout-form').evaluate((f) => f.setAttribute('novalidate', ''))
    await pay.click()
    await expect(page.locator('.error-summary')).toContainText('Cochez la case pour accepter les conditions de vente.')
    await page.getByLabel('Prénom').fill('Julie')
    await page.getByLabel('Courriel').fill(email)
    await page.getByLabel('Téléphone').fill('450 555-0101')
    await page.getByLabel('Note d’allergie (facultatif)').fill('Allergie aux noix (test e2e)')
    await page.locator('#c-terms').check()
    await page.getByRole('button', { name: /^Confirmer et payer/ }).click()

    await expect(page).toHaveURL(/\/commander\/paiement\/\?commande=[\w-]{24}$/)
    await expect(page.locator('h1')).toHaveText('Paiement')
    await expect(page.locator('.badge')).toContainText('Votre plage est réservée jusqu’à')
    const scripts = await page.locator('script[src]').evaluateAll((list) => list.map((s) => new URL(s.src).host))
    expect(scripts.filter((h) => h !== new URL(PUBLIC_URL).host), 'no third-party script on the payment page').toEqual([])
    const csp = (await raw(page.url())).headers['content-security-policy'] || ''
    expect(csp).toMatch(/script-src 'self' 'unsafe-inline' https:\/\/js\.stripe\.com;/)
    expect(csp).toMatch(/frame-src https:\/\/js\.stripe\.com https:\/\/hooks\.stripe\.com;/)
    expect(csp).toMatch(/connect-src 'self' https:\/\/api\.stripe\.com;/)
    expect(csp).toMatch(/frame-ancestors 'none'/)
    expect(await seriousViolations(page)).toEqual([])
    await page.getByRole('button', { name: `Payer ${total}` }).click()

    await expect(page).toHaveURL(/\/commander\/merci\/\?commande=[\w-]{24}$/)
    await expect(page.locator('h1')).toHaveText(/^Merci! Commande \d{4,}$/)
    await expect(page.locator('.pickup-code-value')).toHaveText(/^\d{4}$/)
    await expect(page.locator('a[href^="/svc/calendrier/?commande="]')).toBeVisible()
    await expect(page.locator('a[href^="https://maps.google.com/?cid="]').first()).toBeVisible()
    expect(await seriousViolations(page)).toEqual([])
    thanksUrl = page.url()

    const ics = await raw(`${PUBLIC_URL}${await page.locator('a[href^="/svc/calendrier/"]').getAttribute('href')}`)
    expect(ics.status).toBe(200)
    expect(ics.headers['content-type']).toMatch(/^text\/calendar/)
    expect(ics.body).toMatch(/DTSTART:\d{8}T\d{6}Z/)
    expect(cspErrors, 'CSP violations in the checkout flow').toEqual([])
  })

  test('paid in the database; the contract copy is queued, then sent by the worker through the log sender', async () => {
    test.skip(!thanksUrl, 'box flow skipped')
    test.skip(!DB, 'DATABASE_URI is needed to read the queue')
    const [order] = await query(`select id, number, status, payment_status, payment_provider, allergy_note, consent_terms_version from orders where customer_email = $1`, [email])
    expect([order.status, order.payment_status, order.payment_provider]).toEqual(['paid', 'paid', 'mock'])
    expect(order.consent_terms_version).toBeTruthy()
    expect(order.allergy_note).toContain('noix')
    const queued = await query(`select id, template, status, send_after, body from messages where order_id = $1 order by id`, [order.id])
    const confirmation = queued.find((m) => m.template === 'order_confirmed')
    expect(confirmation.status).toBe('queued')
    expect(confirmation.body).not.toContain('noix')

    // The undo window (5 s) must be over before the worker may send it.
    const wait = new Date(confirmation.send_after).getTime() - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait + 250))
    const logFile = join(mkdtempSync(join(tmpdir(), 'cv-worker-')), 'messages.log')
    const { code, out } = await runWorkerOnce(logFile)
    expect(code, out).toBe(0)
    expect(out).toContain(`[message:log] email → ${email} : Commande ${order.number} confirmée`)
    expect(existsSync(logFile)).toBe(true)
    expect(readFileSync(logFile, 'utf8')).toContain(email)
    const [after] = await query(`select status, provider_id from messages where id = $1`, [confirmation.id])
    expect(after.status).toBe('sent')
    expect(after.provider_id).toMatch(/^log_/)
    const [sent] = await query(`select contract_sent_at from orders where id = $1`, [order.id])
    expect(sent.contract_sent_at).toBeTruthy()
  })
})

test.describe('in-app browsers', () => {
  test.use({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0' })

  test('Instagram: notice, « Ouvrir dans Safari » with the box restore link', async ({ page }) => {
    await page.goto(`${PUBLIC_URL}/commander/`)
    const add = page.locator('form.order-add').first()
    test.skip((await add.count()) === 0, 'needs the demo data')
    await add.getByRole('button', { name: 'Ajouter à ma boîte' }).click()
    await expect(page).toHaveURL(/\/boite\/[\w-]+\//)
    await expect(page.locator('.iab-notice')).toContainText('navigateur d’Instagram')
    const href = await page.getByRole('link', { name: 'Ouvrir dans Safari' }).getAttribute('href')
    expect(href).toMatch(/^x-safari-https?:\/\/.+\/boite\/[\w-]+\/$/)
    expect(href.replace(/^x-safari-/, '')).toContain(new URL(page.url()).pathname)
  })
})
