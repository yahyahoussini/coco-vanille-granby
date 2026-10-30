// New orders → open Studio screens (16 §7, 16b §3): orders are written by the public process, so the studio
// process LISTENs on Postgres (one dedicated connection, not the pool's busy ones) and fans out to SSE clients.
// NOTIFY is a hint, never data: screens re-read the database. Without LISTEN, a 10-second poll stands in.
const CHANNEL = 'coco_orders'
const POLL_MS = 10 * 1000

// Fires on every new order and every status change. Migrated databases (production, staging, CI) get it from
// src/migrations/*_orders_notify.js and the app runs no DDL there; a development database built by Payload's
// schema push (no migrations) gets it at start instead (idempotent).
export const TRIGGER_SQL = `
CREATE OR REPLACE FUNCTION coco_orders_notify() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('${CHANNEL}', json_build_object('id', NEW.id, 'op', TG_OP, 'status', NEW.status)::text);
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER coco_orders_notify AFTER INSERT OR UPDATE OF status ON orders FOR EACH ROW EXECUTE FUNCTION coco_orders_notify();
`

export const DROP_TRIGGER_SQL = `
DROP TRIGGER IF EXISTS coco_orders_notify ON orders;
DROP FUNCTION IF EXISTS coco_orders_notify();
`

const state = (globalThis.__cocoLive ||= { listeners: new Set(), started: false, mode: null, client: null, timer: null, last: null })

const emit = (msg) => {
  for (const fn of state.listeners) {
    try {
      fn(msg)
    } catch {
      // a closed stream: its own abort handler removes it
    }
  }
}

async function startPolling(payload) {
  state.mode = 'poll'
  const read = async () => {
    const r = await payload.find({ collection: 'orders', sort: '-updatedAt', limit: 1, depth: 0, overrideAccess: true, select: { updatedAt: true, status: true } }).catch(() => null)
    // « Écrivez-nous » messages too (lib/chat/server.js), so an open Messages screen refreshes without LISTEN.
    const c = await payload.find({ collection: 'conversations', sort: '-updatedAt', limit: 1, depth: 0, overrideAccess: true, select: { updatedAt: true } }).catch(() => null)
    const doc = r?.docs?.[0]
    const chat = c?.docs?.[0]
    const mark = `${doc ? `${doc.id}:${doc.updatedAt}` : ''}|${chat ? `${chat.id}:${chat.updatedAt}` : ''}`
    if (state.last !== null && mark !== state.last) emit({ id: doc?.id, op: 'POLL', status: doc?.status })
    state.last = mark
  }
  await read()
  state.timer = setInterval(read, POLL_MS)
}

// The orders_notify migration has run: the trigger is the migration's, never touched at run time.
const migrated = (client) =>
  client
    .query("select 1 from payload_migrations where name like '%orders_notify' and batch > 0 limit 1")
    .then((r) => r.rowCount > 0)
    .catch(() => false)

async function start(payload) {
  if (state.started) return
  state.started = true
  const pool = payload?.db?.pool
  if (!pool?.connect) return startPolling(payload)
  try {
    const client = await pool.connect()
    if (!(await migrated(client))) await client.query(TRIGGER_SQL).catch((e) => payload.logger?.warn?.({ err: e }, 'studio live: trigger not installed'))
    await client.query(`LISTEN ${CHANNEL}`)
    client.on('notification', (n) => {
      let msg = null
      try {
        msg = JSON.parse(n.payload)
      } catch {
        msg = { raw: n.payload }
      }
      emit(msg)
    })
    client.on('error', () => {
      state.client = null
      state.started = false
      client.release(true)
    })
    state.client = client
    state.mode = 'listen'
  } catch (e) {
    payload.logger?.warn?.({ err: e }, 'studio live: LISTEN unavailable, polling instead')
    await startPolling(payload)
  }
}

export async function subscribe(payload, fn) {
  await start(payload)
  state.listeners.add(fn)
  return () => state.listeners.delete(fn)
}

export const liveMode = () => state.mode

// A hint sent by app code rather than the orders trigger (a visitor's « Écrivez-nous » message, a reply): NOTIFY
// on the same channel reaches the studio process from the public one. Without Postgres (tests), this process only.
export async function notifyLive(payload, msg) {
  const pool = payload?.db?.pool
  if (pool?.query) return void (await pool.query('select pg_notify($1, $2)', [CHANNEL, JSON.stringify(msg)]))
  emit(msg)
}
