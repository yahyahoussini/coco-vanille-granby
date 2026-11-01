// In-memory stand-in for the Payload Local API calls the ordering engine makes (find, findByID, findGlobal,
// create, update, delete). Enough of the `where` grammar for the engine's queries; no database needed.
const get = (doc, path) => path.split('.').reduce((v, k) => (v === null || v === undefined ? undefined : v[k]), doc)

const cmp = (a, b) => {
  if (a instanceof Date || b instanceof Date || (typeof a === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(a))) return new Date(a).getTime() - new Date(b).getTime()
  return a < b ? -1 : a > b ? 1 : 0
}

function matches(doc, where) {
  if (!where) return true
  return Object.entries(where).every(([key, cond]) => {
    if (key === 'and') return cond.every((w) => matches(doc, w))
    if (key === 'or') return cond.some((w) => matches(doc, w))
    const v = get(doc, key)
    return Object.entries(cond).every(([op, x]) => {
      switch (op) {
        case 'equals':
          return String(v) === String(x)
        case 'not_equals':
          return String(v) !== String(x)
        case 'in':
          return x.map(String).includes(String(v))
        case 'not_in':
          return !x.map(String).includes(String(v))
        case 'exists':
          return x ? v !== undefined && v !== null && v !== '' : v === undefined || v === null || v === ''
        case 'greater_than':
          return v !== undefined && v !== null && cmp(v, x) > 0
        case 'greater_than_equal':
          return v !== undefined && v !== null && cmp(v, x) >= 0
        case 'less_than':
          return v !== undefined && v !== null && cmp(v, x) < 0
        case 'less_than_equal':
          return v !== undefined && v !== null && cmp(v, x) <= 0
        default:
          throw new Error(`fake payload: operator ${op}`)
      }
    })
  })
}

const clone = (x) => (x === undefined ? x : JSON.parse(JSON.stringify(x)))

// `localized`: { collection: [field, …] } keeps those fields per locale (default 'fr'), as Payload does for localized
// fields; reads and `where` see the requested locale's values. Collections not listed behave as before.
export function fakePayload({ globals = {}, collections = {}, localized = {} } = {}) {
  const store = Object.fromEntries(Object.entries(collections).map(([k, docs]) => [k, docs.map(clone)]))
  const ids = {}
  const nextId = (c) => (ids[c] = (ids[c] || (store[c] || []).reduce((m, d) => Math.max(m, Number(d.id) || 0), 0)) + 1)
  const list = (c) => (store[c] ||= [])
  const sent = []
  const view = (c, doc, locale) => {
    const fields = localized[c]
    if (!fields || !doc) return doc
    const { _locales = {}, ...rest } = doc
    const here = _locales[locale || 'fr'] || {}
    return { ...rest, ...Object.fromEntries(fields.map((k) => [k, here[k] ?? null])) }
  }
  // Writes the localized fields of `data` into the locale; returns the shared rest.
  const writeLocal = (c, doc, data, locale) => {
    const fields = localized[c]
    if (!fields) return data
    doc._locales ||= {}
    const here = (doc._locales[locale || 'fr'] ||= {})
    return Object.fromEntries(Object.entries(data).filter(([k, v]) => (fields.includes(k) ? ((here[k] = v), false) : true)))
  }
  return {
    store,
    sent,
    logger: { info() {}, warn() {}, error() {} },
    async findGlobal({ slug }) {
      return clone(globals[slug] || {})
    },
    async updateGlobal({ slug, data }) {
      globals[slug] = { ...(globals[slug] || {}), ...clone(data) }
      return clone(globals[slug])
    },
    async find({ collection, where, sort, limit = 10, locale }) {
      let docs = list(collection).map((d) => view(collection, d, locale)).filter((d) => matches(d, where))
      if (sort) {
        const desc = sort.startsWith('-')
        const key = desc ? sort.slice(1) : sort
        docs = [...docs].sort((a, b) => (desc ? -1 : 1) * cmp(get(a, key) ?? -Infinity, get(b, key) ?? -Infinity))
      }
      if (limit) docs = docs.slice(0, limit)
      return { docs: clone(docs), totalDocs: docs.length }
    },
    async findByID({ collection, id, locale }) {
      const doc = list(collection).find((d) => String(d.id) === String(id))
      if (!doc) {
        const err = new Error('Not Found')
        err.status = 404
        throw err
      }
      return clone(view(collection, doc, locale))
    },
    async create({ collection, data, locale }) {
      // The unique index on the audit log's idempotency key, as in Postgres.
      if (collection === 'audit-log' && data?.key && list(collection).some((d) => d.key === data.key)) throw new Error('Le champ suivant n’est pas valide : key')
      const doc = { id: nextId(collection), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      Object.assign(doc, writeLocal(collection, doc, clone(data), locale))
      list(collection).push(doc)
      return clone(view(collection, doc, locale))
    },
    async update({ collection, id, data, where, locale }) {
      const targets = id !== undefined ? list(collection).filter((d) => String(d.id) === String(id)) : list(collection).filter((d) => matches(view(collection, d, locale), where))
      for (const doc of targets) {
        for (const [k, v] of Object.entries(writeLocal(collection, doc, clone(data), locale))) {
          doc[k] = v && typeof v === 'object' && !Array.isArray(v) && doc[k] && typeof doc[k] === 'object' && !Array.isArray(doc[k]) ? { ...doc[k], ...v } : v
        }
        doc.updatedAt = new Date().toISOString()
      }
      if (id !== undefined) return clone(view(collection, targets[0], locale))
      return { docs: clone(targets.map((d) => view(collection, d, locale))) }
    },
    async delete({ collection, id }) {
      store[collection] = list(collection).filter((d) => String(d.id) !== String(id))
      return { id }
    },
  }
}
