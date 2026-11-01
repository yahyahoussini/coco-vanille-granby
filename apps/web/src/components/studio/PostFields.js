import { t } from '@/lib/i18n'
import { PHOTOS, photoSources } from '@/lib/photos'
import { CATEGORY_LABELS, POST_CATEGORIES, POST_PHOTO_KEYS, RELATABLE } from '@/lib/journal'
import { SECTION_ROWS, FAQ_ROWS, SOURCE_ROWS, MAX } from '@/lib/studio/journal-form'

// The fields of the Journal editor (Plus › Journal), as plain form controls: the form posts without JavaScript
// (ActionForm) and lib/studio/journal-form.js reads the same names. `v`: toFormValues() of the post.

const fr = t('fr')
const LEGAL_NAMES = { confidentialite: fr.privacy, 'conditions-de-vente': fr.terms, temoins: fr.cookies, accessibilite: fr.accessibility, carte: 'Carte', commander: 'Commander', 'nous-trouver': 'Nous trouver', 'a-propos': 'À propos' }
export const pageName = (key) => fr.pageNames[key] || LEGAL_NAMES[key] || key

function Text({ id, name, label, value, max, hint, required = false, lang }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} type="text" defaultValue={value} maxLength={max} required={required} lang={lang} aria-describedby={hint ? `${id}-hint` : undefined} />
      {hint && (
        <span className="hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
    </div>
  )
}

function Area({ id, name, label, value, max, hint, rows = 3, lang }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={name} rows={rows} defaultValue={value} maxLength={max} lang={lang} aria-describedby={hint ? `${id}-hint` : undefined} />
      {hint && (
        <span className="hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
    </div>
  )
}

// The French text of a field, shown above its English field (stacked on phones, side by side from 60rem).
function Pair({ french, children }) {
  return (
    <div className="post-pair">
      <div className="post-pair-fr" lang="fr">
        <span className="meta">En français</span>
        <p>{french || '—'}</p>
      </div>
      <div className="post-pair-en">{children}</div>
    </div>
  )
}

// The copy of one language: address, title, description, h1, answer, 6 sections, 8 FAQ, update note.
// `french`: toFormValues() of the French post, shown beside each English field (English editor).
export function CopyFields({ v, lang = 'fr', french = null, published = false }) {
  const wrap = (key, node) => (french ? <Pair key={key} french={french[key]}>{node}</Pair> : node)
  const L = lang === 'en' ? 'en' : undefined
  return (
    <>
      <fieldset className="field">
        <legend>Le billet</legend>
        {wrap('title', <Text id={`${lang}-title`} name="title" label="Titre (onglet et Google)" value={v.title} max={MAX.title} hint="60 caractères au plus." required lang={L} />)}
        {wrap('description', <Area id={`${lang}-description`} name="description" label="Description (Google)" value={v.description} max={MAX.description} hint="De 140 à 160 caractères." rows={2} lang={L} />)}
        {wrap('h1', <Text id={`${lang}-h1`} name="h1" label="Titre de la page (h1)" value={v.h1} max={MAX.h1} lang={L} />)}
        {wrap('answer', <Area id={`${lang}-answer`} name="answer" label="Réponse (le premier paragraphe)" value={v.answer} max={MAX.answer} hint="De 40 à 60 mots : nommer Pâtisserie Coco Vanille ou Granby et un fait daté, avec sa source plus bas." rows={4} lang={L} />)}
        {wrap('slug', <Text id={`${lang}-slug`} name="slug" label="Adresse (après /journal/)" value={v.slug} max={MAX.slug} hint="Minuscules, chiffres et traits d’union, sans année. Vide : proposée d’après le titre. Fixe dès la première parution." lang={L} />)}
      </fieldset>
      {Array.from({ length: SECTION_ROWS }, (_, i) => (
        <fieldset className="field" key={`s${i}`}>
          <legend>Section {i + 1}{i < 3 ? '' : ' (facultative)'}</legend>
          {wrap(`s${i}_heading`, <Text id={`${lang}-s${i}-h`} name={`s${i}_heading`} label="Question (titre de la section)" value={v[`s${i}_heading`]} max={MAX.heading} hint="Une vraie question, qui finit par « ? »." lang={L} />)}
          {wrap(`s${i}_answer`, <Area id={`${lang}-s${i}-a`} name={`s${i}_answer`} label="Réponse (la première phrase répond)" value={v[`s${i}_answer`]} max={MAX.sectionAnswer} lang={L} />)}
          {wrap(`s${i}_body`, <Area id={`${lang}-s${i}-b`} name={`s${i}_body`} label="Suite (facultative; une ligne vide entre deux paragraphes)" value={v[`s${i}_body`]} max={MAX.body} rows={3} lang={L} />)}
          {wrap(`s${i}_list`, <Area id={`${lang}-s${i}-l`} name={`s${i}_list`} label="Liste (facultative; un élément par ligne)" value={v[`s${i}_list`]} max={MAX.body} rows={3} lang={L} />)}
        </fieldset>
      ))}
      <fieldset className="field">
        <legend>Questions fréquentes (5 à 8)</legend>
        {Array.from({ length: FAQ_ROWS }, (_, i) => (
          <div key={`f${i}`}>
            {wrap(`f${i}_q`, <Text id={`${lang}-f${i}-q`} name={`f${i}_q`} label={`Question ${i + 1}`} value={v[`f${i}_q`]} max={MAX.question} lang={L} />)}
            {wrap(`f${i}_a`, <Area id={`${lang}-f${i}-a`} name={`f${i}_a`} label={`Réponse ${i + 1}`} value={v[`f${i}_a`]} max={MAX.faqAnswer} rows={2} lang={L} />)}
          </div>
        ))}
      </fieldset>
      {wrap('changeNote', <Text id={`${lang}-note`} name="changeNote" label="Note de mise à jour (une ligne)" value={v.changeNote} max={MAX.changeNote} hint="Affichée au bas du billet, ex. « Première version. »." lang={L} />)}
      {published && (
        <label className="check">
          <input type="checkbox" name="major" value="on" />
          <span>Changement important : la date « Mis à jour » change.</span>
        </label>
      )}
    </>
  )
}

// What both languages share (French editor only): category, illustration, related pages, day, sources.
export function SharedFields({ v }) {
  const related = new Set(v.related || [])
  const filled = Array.from({ length: SOURCE_ROWS }, (_, i) => i).filter((i) => v[`src${i}_label`] || v[`src${i}_url`])
  const shown = Math.min(SOURCE_ROWS, Math.max(3, (filled.at(-1) ?? -1) + 3))
  return (
    <>
      <div className="field">
        <label htmlFor="category">Catégorie</label>
        <select id="category" name="category" defaultValue={v.category || POST_CATEGORIES[0]}>
          {POST_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS.fr[c]}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="publishedAt">Jour de publication (6 h, heure de Granby)</label>
        <input id="publishedAt" name="publishedAt" type="date" defaultValue={v.publishedAt} required />
        <span className="hint">Un lundi de préférence : un seul billet par semaine.</span>
      </div>
      <fieldset className="field">
        <legend>Photo d’illustration (remplacée par la photo de la boutique dès qu’elle existe)</legend>
        <div className="post-photos">
          {POST_PHOTO_KEYS.filter((k) => Object.hasOwn(PHOTOS, k)).map((key) => (
            <label className="post-photo" key={key}>
              <input type="radio" name="photo" value={key} defaultChecked={(v.photo || 'hero') === key} />
              <img src={photoSources(key).src} alt="" width="160" height="120" loading="lazy" decoding="async" />
              <span>{PHOTOS[key].alt.fr}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field">
        <legend>Pages liées (2 à 4)</legend>
        <div className="choices">
          {RELATABLE.map((key) => (
            <label className="choice" key={key}>
              <input type="checkbox" name="related[]" value={key} defaultChecked={related.has(key)} />
              <span>{pageName(key)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field">
        <legend>Sources (au moins une : chaque chiffre a sa date et sa source)</legend>
        {Array.from({ length: shown }, (_, i) => (
          <div className="post-source" key={`src${i}`}>
            <Text id={`src${i}-label`} name={`src${i}_label`} label={`Source ${i + 1} : nom`} value={v[`src${i}_label`]} max={MAX.label} />
            <Text id={`src${i}-url`} name={`src${i}_url`} label="Adresse (https://…)" value={v[`src${i}_url`]} max={MAX.url} />
            <div className="field">
              <label htmlFor={`src${i}-date`}>Date (consultée ou publiée)</label>
              <input id={`src${i}-date`} name={`src${i}_date`} type="date" defaultValue={v[`src${i}_date`]} />
            </div>
          </div>
        ))}
        {shown < SOURCE_ROWS && <span className="hint">Enregistrez pour ajouter d’autres sources.</span>}
      </fieldset>
    </>
  )
}
