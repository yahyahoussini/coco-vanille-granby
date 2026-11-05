import { PHOTOS, photoSources } from '@/lib/photos'

// The caption under a page's picture: this word, then the credit. Nothing is written on the picture itself.
const SHORT = { fr: 'Illustration', en: 'Illustration', es: 'Ilustración' }
const BY = { fr: 'Photo', en: 'Photo', es: 'Foto' }
const MAP = { fr: 'Carte', en: 'Map', es: 'Mapa' }
// A CC licence asks to say the picture was changed (here: cropped and resized).
const MODIFIED = { fr: 'recadrée', en: 'cropped', es: 'recortada' }

// An illustration photo (src/lib/photos.js) until the shop's own photo replaces it (research/sessions/04 #12).
// It shows the kind of thing, never a specific Coco Vanille product; no notice on the picture (owner's decision,
// 2026-11-04, research/sessions/04 #14). The map, the Zoo photo and the shop's own cake are real (kind map / place /
// shop). Intrinsic size on the <img>, lazy unless `priority`.
// `caption`: a <figure> with the credit under the picture (page heroes; the Zoo's CC licence and the map's OpenStreetMap
// attribution require theirs: keep them).
export function StockPhoto({ name, locale = 'fr', sizes = '100vw', priority = false, className, decorative = false, caption = false }) {
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
  if (!caption) {
    return (
      <span className={['stock-photo', className].filter(Boolean).join(' ')}>
        {picture}
      </span>
    )
  }
  const c = photo.credit || {}
  // French typography: a no-break space before the colon.
  const colon = locale === 'fr' ? ' : ' : ': '
  return (
    <figure className={['stock-photo', 'stock-figure', className].filter(Boolean).join(' ')}>
      {picture}
      <figcaption className="stock-caption" data-nosnippet="">
        {isMap ? `${MAP[locale] || MAP.fr}${colon}` : isReal ? `${BY[locale] || BY.fr}${colon}` : `${SHORT[locale] || SHORT.fr} · `}
        {c.profile ? <a href={c.profile} rel="nofollow noopener">{c.author}</a> : c.author}
        {c.license && ' · '}
        {c.license && (c.licenseUrl ? <a href={c.licenseUrl} rel="license nofollow noopener">{c.license}</a> : c.license)}
        {c.modified && `, ${MODIFIED[locale] || MODIFIED.fr}`}
      </figcaption>
    </figure>
  )
}
