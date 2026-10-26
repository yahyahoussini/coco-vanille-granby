// GST + QST per research/07 §6 (the accountant signs every row). Integer cents, effective-dated.
// Product tax classes (Catalog.js): 'pending' (no approved class: cannot be sold online, 07 O13),
// 'zero' (zero-rated basic grocery: bread, plain croissant, row 1), 'taxable' (GST + QST),
// 'rule' (sweet baked goods: the single-serving rule, rows 2–6, needs the unit weight).
// Nothing here decides a class: it applies the one the owner set.

// Effective-dated rates (07 T-7: 5 % and 9.975 % still to confirm with CRA and Revenu Québec).
export const RATES = [{ from: '1900-01-01', gst: 0.05, qst: 0.09975 }]

// Revenu Québec, « Fournitures détaxées » (07 T-3): QST zero-rated on single-serving sweet goods from this date.
export const QST_SWEET_SINGLE_ZERO_FROM = '2026-07-15'

// Single-serving line drawn in one CRA ruling (07 T-2); the accountant confirms it.
export const SINGLE_SERVING_MAX_G = 230

// Fewer than six single servings in the supply → GST applies (ETA Sch. VI, Part III, s. 1(m)).
export const SINGLE_SERVINGS_ZERO_AT = 6

export const TAX_CLASSES = ['pending', 'zero', 'taxable', 'rule']

export function rateOn(dateISO) {
  return RATES.filter((r) => r.from <= dateISO).at(-1) || RATES[0]
}

const positive = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0

// Why a line cannot be taxed (and so cannot be sold online): null when it can.
// line: { taxClass, unitGrams, packCount }
export function taxBlocker(line = {}) {
  if (!TAX_CLASSES.includes(line.taxClass) || line.taxClass === 'pending') return 'tax_class_pending'
  if (line.taxClass === 'rule' && !positive(line.unitGrams)) return 'tax_weight_missing'
  return null
}

const isSweetSingle = (l) => l.taxClass === 'rule' && l.unitGrams < SINGLE_SERVING_MAX_G

// lines: [{ cents, qty, taxClass, unitGrams, packCount }] · supplyDateISO: 'YYYY-MM-DD'
// → { gst, qst, gstBase, qstBase }. Throws { code } on a line with no approved class.
export function computeTaxes(lines = [], supplyDateISO) {
  for (const l of lines) {
    const code = taxBlocker(l)
    if (code) {
      const err = new Error(code)
      err.code = code
      throw err
    }
  }
  const r = rateOn(supplyDateISO)
  // Unpackaged single servings count across the whole supply (a mixed six is zero-rated, 07 T-2).
  const looseSingles = lines.filter((l) => isSweetSingle(l) && !positive(l.packCount)).reduce((n, l) => n + l.qty, 0)

  let gstBase = 0
  let qstBase = 0
  for (const l of lines) {
    const amount = l.cents * l.qty
    if (l.taxClass === 'zero') continue
    if (l.taxClass === 'taxable') {
      gstBase += amount
      qstBase += amount
      continue
    }
    // 'rule': over the single-serving line → not a single serving → zero-rated (row 6, ASK).
    if (!isSweetSingle(l)) continue
    const gstTaxable = positive(l.packCount) ? l.packCount < SINGLE_SERVINGS_ZERO_AT : looseSingles < SINGLE_SERVINGS_ZERO_AT
    if (!gstTaxable) continue
    gstBase += amount
    if (supplyDateISO < QST_SWEET_SINGLE_ZERO_FROM) qstBase += amount
  }
  // Rounded once per order (per-invoice rounding; the accountant confirms the method).
  return { gst: Math.round(gstBase * r.gst), qst: Math.round(qstBase * r.qst), gstBase, qstBase }
}
