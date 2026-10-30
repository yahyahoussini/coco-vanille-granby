// Where the customer is in the online order: Boîte → Date → Coordonnées → Paiement. A plain ordered list (no links:
// each page has its own way back); the current step carries aria-current="step", done steps say so in words.
import { Icon } from '../site/Icon'
import { orderingCopy } from './copy'

const STEPS = ['box', 'day', 'you', 'pay']

export function Steps({ locale, current }) {
  const c = orderingCopy(locale).steps
  const at = STEPS.indexOf(current)
  return (
    <ol className="steps" aria-label={c.label}>
      {STEPS.map((key, i) => (
        <li key={key} className={i < at ? 'step is-done' : i === at ? 'step is-current' : 'step'} aria-current={i === at ? 'step' : undefined}>
          <span className="step-dot" aria-hidden="true">
            {i < at ? <Icon name="check" size={16} strokeWidth={2.75} /> : i + 1}
          </span>
          <span className="step-label">
            {c[key]}
            {i < at && <span className="step-state"> {c.done}</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}
