import { PHOTOS, photoSources } from '@/lib/photos'

const LABEL = { fr: 'Photo d’illustration', en: 'Illustrative photo', es: 'Foto ilustrativa' }
// Small pictures (product cards): the same notice in one word, so it is never cut off.
const SHORT = { fr: 'Illustration', en: 'Illustration', es: 'Ilustración' }
const BY = { fr: 'Photo', en: 'Photo', es: 'Foto' }
const MAP = { fr: 'Carte', en: 'Map', es: 'Mapa' }
// A CC licence asks to say the picture was changed (here: cropped and resized).
const MODIFIED = { fr: 'recadrée', en: 'cropped', es: 'recortada' }
const ILLUSTRATION_NOTE = {
  fr: 'La photo de la boutique la remplacera.',
  en: 'The shop’s own photo will replace it.',
  es: 'La foto de la tienda la reemplazará.',
}

// An illustration photo (src/lib/photos.js) until the shop's own photo replaces it (research/sessions/04 #12).
// Always labelled « Photo d'illustration »: it shows the kind of thing, never a specific Coco Vanille product. The
// map, the Zoo photo and the shop's own cake are real (kind map / place / shop) and carry their credit instead. Intrinsic size on the <img>, lazy unless `priority`.
// `caption`: a <figure> with the label and the credit under the picture (page heroes; a CC licence needs it).
export function StockPhoto({ name, locale = 'fr', sizes = '100vw', priority = false, className, label = true, decorative = false, caption = false, compact = false }) {
  const photo = Object.hasOwn(PHOTOS, name || '') ? PHOTOS[name] : null
  if (!photo) return null
  const src = photoSources(name)
  const isMap = photo.kind === 'map'
  // A map, a real photo of the place itself (the Zoo) or of the shop's own cake: true pictures, not « d'illustration ».
  const isReal = isMap || photo.kind === 'place' || photo.kind === 'shop'
  const picture = (
    <picture>
      <source type="image/avif" srcSet={src.avif} sizes={sizes} />
      <img
        src={src.src}
        srcSet={src.webp}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={decorative ? '' : photo.alt[locale] || photo.alt.fr}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' } : {})}
      />
    </picture>
  )
  const badge = label && !isReal && (
    <span className="stock-photo-label" data-nosnippet="">
      {(compact ? SHORT : LABEL)[locale] || LABEL.fr}
    </span>
  )
  if (!caption) {
    return (
      <span className={['stock-photo', className].filter(Boolean).join(' ')}>
        {picture}
        {badge}
      </span>
    )
  }
  const c = photo.credit || {}
  // French typography: a no-break space before the colon.
  const colon = locale === 'fr' ? ' : ' : ': '
  return (
    <figure className={['stock-photo', 'stock-figure', className].filter(Boolean).join(' ')}>
      {picture}
      {badge}
      <figcaption className="stock-caption" data-nosnippet="">
        {isMap ? `${MAP[locale] || MAP.fr}${colon}` : isReal ? `${BY[locale] || BY.fr}${colon}` : `${LABEL[locale] || LABEL.fr}. ${ILLUSTRATION_NOTE[locale] || ILLUSTRATION_NOTE.fr} ${BY[locale] || BY.fr}${colon}`}
        {c.profile ? <a href={c.profile} rel="nofollow noopener">{c.author}</a> : c.author}
        {c.license && ' · '}
        {c.license && (c.licenseUrl ? <a href={c.licenseUrl} rel="license nofollow noopener">{c.license}</a> : c.license)}
        {c.modified && `, ${MODIFIED[locale] || MODIFIED.fr}`}
      </figcaption>
    </figure>
  )
}
