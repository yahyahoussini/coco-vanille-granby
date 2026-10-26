// Test fixtures for the ordering engine. Every number here is a PLACEHOLDER for tests (10 §3.3 pattern:
// Thu–Fri 9:00–16:30, Sat 9:00–15:00), never an owner fact.
export const local = (iso, hhmm, offset = '-04:00') => new Date(`${iso}T${hhmm}:00${offset}`)

export const shop = (over = {}) => ({
  hours: [
    { day: 'Thursday', opens: '09:00', closes: '16:30' },
    { day: 'Friday', opens: '09:00', closes: '16:30' },
    { day: 'Saturday', opens: '09:00', closes: '15:00' },
  ],
  specialDays: [],
  closure: { active: false },
  busy: { extraMinutes: 0 },
  onlinePause: { active: false },
  ...over,
  ordering: { enabled: true, nextDayCutoff: '14:00', windowMinutes: 15, maxPerWindow: 4, maxDaysAhead: 30, quoteValidHours: 72, ...(over.ordering || {}) },
})

export const pools = (over = {}) => [
  { productionCategory: 'gateaux', defaultPerDay: 6, overrides: [], perWeekday: [], ...(over.gateaux || {}) },
  { productionCategory: 'viennoiseries', defaultPerDay: 120, overrides: [], perWeekday: [], ...(over.viennoiseries || {}) },
]

export const cake = (over = {}) => ({
  id: 11,
  title: 'Gâteau test',
  _status: 'published',
  availability: 'instock',
  onlineOrderable: true,
  productionCategory: 'gateaux',
  taxClass: 'rule',
  leadTimeHours: 48,
  cakeMessageMax: 30,
  variants: [{ label: '8 po', priceCents: 6000, unitWeightGrams: 1400 }],
  ...over,
})

export const croissant = (over = {}) => ({
  id: 12,
  title: 'Croissant test',
  _status: 'published',
  availability: 'instock',
  onlineOrderable: true,
  productionCategory: 'viennoiseries',
  taxClass: 'rule',
  leadTimeHours: 4,
  variants: [{ label: 'À l’unité', priceCents: 450, unitWeightGrams: 120 }],
  ...over,
})
