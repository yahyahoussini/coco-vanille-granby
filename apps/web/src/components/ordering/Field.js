// Form building blocks: every control has a visible label, its hint and error tied with aria-describedby,
// and a 48 px target (WCAG 2.2 AA, 2.5.8). Errors are text, never colour alone.
import { Icon } from '../site/Icon'

export function describedBy(id, { hint, error } = {}) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

export function Field({ id, label, hint, error, optional, optionalLabel, children, className = '' }) {
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {optional && optionalLabel ? <span className="field-optional"> {optionalLabel}</span> : null}
      </label>
      {hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
      {children}
    </div>
  )
}

export function CheckboxField({ id, name, label, hint, error, defaultChecked = false, required = false, value = 'on', children }) {
  return (
    <div className={`check ${error ? 'has-error' : ''}`.trim()}>
      <input type="checkbox" id={id} name={name} value={value} defaultChecked={defaultChecked} required={required} aria-describedby={describedBy(id, { hint, error })} aria-invalid={error ? 'true' : undefined} />
      <label htmlFor={id}>{children || label}</label>
      {hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

// Error summary at the top of a form: focusable alert with links to each field.
export function ErrorSummary({ id, title, errors }) {
  if (!errors?.length) return null
  return (
    <div className="error-summary" role="alert" aria-labelledby={`${id}-title`} tabIndex={-1} id={id}>
      <span className="error-summary-icon" aria-hidden="true">
        <Icon name="alert" size={22} />
      </span>
      <div className="error-summary-body">
        <p className="error-summary-title" id={`${id}-title`}>
          {title}
        </p>
        <ul>
          {errors.map((e, i) => (
            <li key={i}>{e.field ? <a href={`#${e.field}`}>{e.text}</a> : e.text}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
