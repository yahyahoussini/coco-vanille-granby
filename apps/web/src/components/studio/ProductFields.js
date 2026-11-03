// The form rows shared by a product's page and « Ajouter un produit »: one format (name in both languages, servings, price,
// weight when the bakery tax rule needs it), the lead-time choices, and the step-up reminder before a long form.
import Link from 'next/link'
import { money } from '@/lib/studio/format'

export const LEAD_CHOICES = [
  [24, '24 heures'],
  [48, '48 heures'],
  [72, '3 jours'],
  [120, '5 jours'],
  [168, '7 jours'],
  [336, '14 jours'],
  [504, '21 jours'],
]

const priceField = (cents) => (Number.isInteger(cents) ? money(cents).replace(/\s*\$$/, '').replace(/\s/g, '') : '')

export function FormatFields({ index, variant = {}, labelEn = '', needsGrams = false, removable = false, isNew = false, showTitle = true, required = false }) {
  const id = (name) => `format-${index}-${name}`
  return (
    <fieldset className="field format-fields">
      {showTitle && <legend>{isNew ? 'Ajouter un format (facultatif)' : `Format ${index + 1}`}</legend>}
      <div className="field">
        <label htmlFor={id('nom')}>Nom du format</label>
        <input id={id('nom')} name="label[]" type="text" maxLength={80} defaultValue={variant.label || ''} placeholder="ex. 8 po, À l’unité, Pour 10 personnes" required={required} />
      </div>
      <div className="field">
        <label htmlFor={id('en')}>En anglais</label>
        <input id={id('en')} name="labelEn[]" type="text" maxLength={80} lang="en" defaultValue={labelEn || ''} placeholder="ex. 8-inch, Each" />
      </div>
      <div className="btn-row">
        <div className="field">
          <label htmlFor={id('min')}>Portions, de</label>
          <input id={id('min')} name="portionsMin[]" type="number" min={1} max={500} defaultValue={variant.portionsMin ?? ''} style={{ inlineSize: '6rem' }} />
        </div>
        <div className="field">
          <label htmlFor={id('max')}>à</label>
          <input id={id('max')} name="portionsMax[]" type="number" min={1} max={500} defaultValue={variant.portionsMax ?? ''} style={{ inlineSize: '6rem' }} />
        </div>
        <div className="field">
          <label htmlFor={id('prix')}>Prix, avant taxes</label>
          <input id={id('prix')} name="price[]" type="text" inputMode="decimal" autoComplete="off" defaultValue={priceField(variant.priceCents)} placeholder="ex. 6,50" required={required} style={{ inlineSize: '7rem' }} />
        </div>
        {needsGrams ? (
          <div className="field">
            <label htmlFor={id('poids')}>Poids d’une portion (g)</label>
            <input id={id('poids')} name="grams[]" type="number" min={1} max={20000} defaultValue={variant.unitWeightGrams ?? ''} style={{ inlineSize: '7rem' }} />
          </div>
        ) : (
          <input type="hidden" name="grams[]" value={variant.unitWeightGrams ?? ''} />
        )}
      </div>
      {removable && (
        <label className="check">
          <input type="checkbox" name="remove[]" value={index} />
          <span>Retirer ce format</span>
        </label>
      )}
    </fieldset>
  )
}

// Prices ask who you are: better before a long form than after it.
export function ConfirmFirst({ ctx, back }) {
  if (ctx.stepUp) return null
  return (
    <p className="meta">
      Studio demande de confirmer que c’est vous pour changer un prix (5 minutes). <Link href={`/verifier/?retour=${encodeURIComponent(back)}`}>Confirmer d’abord</Link>
    </p>
  )
}
