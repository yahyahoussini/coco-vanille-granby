// Decorative line art drawn from the round logo (palm leaf, vanilla flower and pods, coconut, heart rule, spoon).
// Inline SVG, a few hundred bytes each, always aria-hidden: they decorate, they never carry information.

const round = (n) => Math.round(n * 10) / 10

// Palm frond: leaflets computed along a quadratic midrib, longest in the middle (like the logo's leaf).
function palmPaths() {
  const p0 = [16, 186]
  const p1 = [86, 64]
  const p2 = [204, 18]
  const at = (t) => [0, 1].map((k) => (1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * p1[k] + t ** 2 * p2[k])
  const tangent = (t) => {
    const d = [0, 1].map((k) => 2 * (1 - t) * (p1[k] - p0[k]) + 2 * t * (p2[k] - p1[k]))
    const len = Math.hypot(d[0], d[1])
    return [d[0] / len, d[1] / len]
  }
  const leaflets = []
  let i = 0
  for (let t = 0.09; t < 0.97; t += 0.058) {
    const [x, y] = at(t)
    const [tx, ty] = tangent(t)
    for (const side of [1, -1]) {
      i += 1
      // Deterministic jitter, so the frond looks drawn by hand but renders the same everywhere.
      const jitter = ((i * 37) % 11) / 11 - 0.5
      const length = (10 + 66 * Math.sin(Math.PI * t) ** 0.8) * (1 + jitter * 0.22)
      const nx = -ty * side
      const ny = tx * side
      // Leaflets lean toward the tip and droop a little (gravity pulls +y).
      const lean = 0.5 + t * 0.35
      const ex = x + (nx * (1 - lean * 0.45) + tx * lean) * length
      const ey = y + (ny * (1 - lean * 0.45) + ty * lean) * length + length * 0.18
      const cx = x + (nx * 0.6 + tx * 0.25) * length
      const cy = y + (ny * 0.6 + ty * 0.25) * length - length * 0.06
      leaflets.push(`M${round(x)} ${round(y)}Q${round(cx)} ${round(cy)} ${round(ex)} ${round(ey)}`)
    }
  }
  return { rib: `M${p0.join(' ')}Q${p1.join(' ')} ${p2.join(' ')}`, leaflets: leaflets.join('') }
}

const PALM = palmPaths()

function Palm(props) {
  return (
    <svg viewBox="0 0 220 200" fill="none" stroke="currentColor" strokeLinecap="round" {...props}>
      <path d={PALM.leaflets} strokeWidth="2.2" />
      <path d={PALM.rib} strokeWidth="3" />
    </svg>
  )
}

const PETAL = 'M0 0C11-12 13-35 0-50C-13-35-11-12 0 0Z'

function Vanilla(props) {
  return (
    <svg viewBox="0 0 200 170" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <g stroke="var(--ink, #3b241c)" strokeWidth="7">
        <path d="M18 150C70 118 120 92 186 40" />
        <path d="M40 162C88 120 140 100 194 82" opacity=".85" />
      </g>
      <g transform="translate(92 74)" stroke="var(--caramel, #c99558)" strokeWidth="1.6" fill="#fffaf0">
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={PETAL} transform={`rotate(${a + 8})`} />
        ))}
        <path d="M-9 4C-6 16 6 16 9 4C6-6-6-6-9 4Z" fill="#f3d27a" />
        <circle r="3.5" fill="#e0a93b" stroke="none" />
      </g>
    </svg>
  )
}

function Coconut(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <circle cx="60" cy="60" r="52" fill="#81411d" />
      <g stroke="#5c2c12" strokeWidth="1.4" strokeLinecap="round" opacity=".7">
        <path d="M16 46l7 3M13 64l8 0M20 84l7-4M38 104l4-7M84 104l-4-7M102 84l-7-4M107 64h-8M104 46l-7 3M84 14l-3 8M36 14l3 8" />
      </g>
      <circle cx="60" cy="58" r="38" fill="#fffaf2" stroke="#e8dcc8" strokeWidth="3" />
      <ellipse cx="52" cy="50" rx="14" ry="9" fill="#ffffff" opacity=".7" />
    </svg>
  )
}

function Spoon(props) {
  return (
    <svg viewBox="0 0 160 30" fill="none" stroke="currentColor" strokeLinecap="round" {...props}>
      <path d="M8 15h92" strokeWidth="5" />
      <ellipse cx="128" cy="15" rx="26" ry="11" fill="currentColor" fillOpacity=".25" strokeWidth="2" />
    </svg>
  )
}

const SHAPES = { palm: Palm, vanilla: Vanilla, coconut: Coconut, spoon: Spoon }

export function Ornament({ name, className, ...rest }) {
  const Shape = SHAPES[name]
  if (!Shape) return null
  return <Shape className={['ornament', `ornament-${name}`, className].filter(Boolean).join(' ')} aria-hidden="true" focusable="false" {...rest} />
}

// « —— ♥ —— »: the logo's divider between PÂTISSERIE and GRANBY.
export function HeartRule({ className }) {
  return (
    <svg viewBox="0 0 220 24" className={['heart-rule', className].filter(Boolean).join(' ')} aria-hidden="true" focusable="false">
      <path d="M4 12h84M132 12h84" stroke="var(--caramel, #c99558)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M110 19c-1-.9-9-6-9-11a4.8 4.8 0 0 1 9-2.4A4.8 4.8 0 0 1 119 8c0 5-8 10.1-9 11z" fill="var(--rose, #d78ca0)" />
    </svg>
  )
}
