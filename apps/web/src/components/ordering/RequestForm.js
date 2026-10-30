// Custom-cake request form (10 §5.2). Plain HTML POST to /svc/demande/ (multipart, works with JavaScript off);
// errors come back through a short-lived draft cookie and show at the top and next to each field.
import { localParts, addDays } from '@/lib/studio/time'
import { REQUEST_LIMITS } from '@/lib/ordering/requests'
import { errorText } from '@/lib/ordering/errors'
import { privacyPath } from '@/lib/ordering/paths'
import { Icon } from '../site/Icon'
import { orderingCopy } from './copy'
import { Field, CheckboxField, ErrorSummary, describedBy } from './Field'
import { MessagePreview } from './MessagePreview'

const errorFor = (code, locale) => orderingCopy(locale).errors[code] || errorText(code, locale)

function Legend({ icon, children }) {
  return (
    <legend>
      <span className="legend-icon" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      {children}
    </legend>
  )
}

export function RequestForm({ locale = 'fr', business, draft, now = new Date() }) {
  const c = orderingCopy(locale).request
  const values = draft?.v || {}
  const errors = (draft?.e || []).map((e) => ({ field: e.field ? `f-${e.field}` : null, code: e.code, text: errorFor(e.code, locale) }))
  const err = (field) => errors.find((e) => e.field === `f-${field}`)?.text
  const today = localParts(now).iso
  const phone = business?.phoneDisplay
  const field = (id) => ({ id: `f-${id}`, name: id, 'aria-describedby': describedBy(`f-${id}`, { hint: true, error: err(id) }), 'aria-invalid': err(id) ? 'true' : undefined })
  const noHint = (id) => ({ id: `f-${id}`, name: id, 'aria-describedby': err(id) ? `f-${id}-error` : undefined, 'aria-invalid': err(id) ? 'true' : undefined })
  const optional = { fr: '(facultatif)', en: '(optional)', es: '(opcional)' }[locale] || '(facultatif)'

  return (
    <section className="order-request" aria-labelledby="demande">
      <div className="request-head">
        <span className="request-emblem icon-badge" aria-hidden="true">
          <Icon name="cake" size={30} strokeWidth={1.5} />
        </span>
        <div className="request-head-text">
          <h2 id="demande">{c.title}</h2>
          <p>{c.intro}</p>
        </div>
      </div>
      <form className="order-form" method="post" action="/svc/demande/" encType="multipart/form-data" id="demande-form">
        <ErrorSummary id="demande-erreurs" title={c.errorsTitle} errors={errors} />
        {errors.length > 0 && <p className="field-hint form-hint-again">{c.photosAgain}</p>}
        <input type="hidden" name="locale" value={locale} />
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-site">Site web</label>
          <input id="f-site" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <fieldset className="form-group">
          <Legend icon="cake">{c.cake}</Legend>
          <Field id="f-occasion" label={c.occasion} hint={c.occasionHint} error={err('occasion')}>
            <input {...field('occasion')} type="text" required maxLength={REQUEST_LIMITS.occasion} list="occasions" defaultValue={values.occasion || ''} autoComplete="off" />
            <datalist id="occasions">
              {c.occasions.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </Field>
          <div className="field-row">
            <Field id="f-guests" label={c.guests} error={err('guests')}>
              <input {...noHint('guests')} type="number" inputMode="numeric" required min={1} max={REQUEST_LIMITS.guestsMax} step={1} defaultValue={values.guests ?? ''} className="input-short" />
            </Field>
            <Field id="f-eventDate" label={c.date} hint={c.dateHint} error={err('eventDate')}>
              <input {...field('eventDate')} type="date" required min={addDays(today, 1)} max={addDays(today, REQUEST_LIMITS.daysAhead)} defaultValue={values.eventDate || ''} className="input-date" />
            </Field>
          </div>
          <Field id="f-flavour" label={c.flavour} hint={c.flavourHint} error={err('flavour')}>
            <input {...field('flavour')} type="text" maxLength={REQUEST_LIMITS.flavour} defaultValue={values.flavour || ''} />
          </Field>
          <div className="field-with-preview">
            <Field id="f-cakeMessage" label={c.message} hint={c.messageHint(REQUEST_LIMITS.cakeMessage)} error={err('cakeMessage')}>
              <input {...field('cakeMessage')} type="text" maxLength={REQUEST_LIMITS.cakeMessage} defaultValue={values.cakeMessage || ''} autoComplete="off" />
            </Field>
            <MessagePreview inputId="f-cakeMessage" initial={values.cakeMessage || ''} caption={c.preview} max={REQUEST_LIMITS.cakeMessage} />
          </div>
          <Field id="f-details" label={c.details} optional optionalLabel={optional} error={err('details')}>
            <textarea {...noHint('details')} rows={4} maxLength={REQUEST_LIMITS.details} defaultValue={values.details || ''} />
          </Field>
          <Field id="f-photos" label={c.photos} hint={c.photosHint} error={err('photos')} className="field-file">
            <input {...field('photos')} type="file" multiple accept="image/jpeg,image/png,image/webp" />
          </Field>
          <CheckboxField id="f-hasAllergy" name="hasAllergy" label={c.allergy} hint={c.allergyHint} defaultChecked={Boolean(values.hasAllergy)} />
        </fieldset>

        <fieldset className="form-group">
          <Legend icon="users">{c.you}</Legend>
          <div className="field-row field-row-pair">
            <Field id="f-firstName" label={c.firstName} error={err('firstName')}>
              <input {...noHint('firstName')} type="text" required maxLength={60} autoComplete="given-name" defaultValue={values.firstName || ''} />
            </Field>
            <Field id="f-lastName" label={c.lastName} optional optionalLabel={optional}>
              <input id="f-lastName" name="lastName" type="text" maxLength={60} autoComplete="family-name" defaultValue={values.lastName || ''} />
            </Field>
          </div>
          <div className="field-row">
            <Field id="f-phone" label={c.phone} hint={c.phoneHint} error={err('phone')}>
              <input {...field('phone')} type="tel" required autoComplete="tel" inputMode="tel" maxLength={30} defaultValue={values.phone || ''} />
            </Field>
            <Field id="f-email" label={c.email} hint={c.emailHint} error={err('email')}>
              <input {...field('email')} type="email" autoComplete="email" maxLength={120} defaultValue={values.email || ''} />
            </Field>
          </div>
        </fieldset>

        <div className="form-submit">
          <p className="small form-privacy">
            {c.privacy} <a href={privacyPath(locale)}>{c.privacyLink}</a>
          </p>
          <button type="submit" className="btn btn-primary form-submit-btn">
            <Icon name="send" size={20} />
            {c.submit}
          </button>
          {phone && (
            <p className="order-call">
              <Icon name="phone" size={18} />
              {c.orCall} <a href={`tel:${business.phone}`}>{phone}</a>
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
