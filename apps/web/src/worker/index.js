// Background worker process (APP_ROLE=worker): `npm run worker`. Every 5 s: due messages, expired holds and
// quotes, orders not picked up after closing. Once a night (first tick after 3 h, Granby time): retention.
// WORKER_ONCE=1 runs every job once (nightly included) and exits: used by the e2e test and by cron checks.
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { localParts } from '../lib/studio/time.js'
import { senders as makeSenders } from '../lib/messaging/senders.js'
import { tick } from './tasks.js'

const EVERY_MS = Number(process.env.WORKER_INTERVAL_MS) || 5000
const once = process.env.WORKER_ONCE === '1' || process.argv.includes('--once')

const payload = await getPayload({ config })
const senders = makeSenders()
let lastNightly = null
let running = false
let stopping = false

async function run() {
  if (running) return
  running = true
  try {
    const now = new Date()
    const here = localParts(now)
    const nightly = once || (lastNightly !== here.iso && here.hh >= 3)
    const summary = await tick(payload, { now, senders, nightly })
    if (nightly) lastNightly = here.iso
    if (once || Object.values(summary).some((n) => n > 0)) payload.logger.info({ worker: summary }, 'worker tick')
    if (once) console.log(`[worker] ${JSON.stringify(summary)}`)
  } catch (e) {
    payload.logger.error({ err: e }, 'worker tick failed')
  } finally {
    running = false
  }
}

if (once) {
  await run()
  process.exit(0)
}

payload.logger.info(`Coco Vanille worker started (every ${EVERY_MS / 1000} s, SMS: ${senders.sms.name}, email: ${senders.email.name}).`)
await run()
const timer = setInterval(() => {
  if (!stopping) run()
}, EVERY_MS)

const stop = () => {
  stopping = true
  clearInterval(timer)
  const wait = setInterval(() => {
    if (!running) {
      clearInterval(wait)
      process.exit(0)
    }
  }, 100)
}
process.on('SIGTERM', stop)
process.on('SIGINT', stop)
