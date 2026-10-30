import { PHOTOS, photoSources } from '@/lib/photos'

const LABEL = { fr: 'Photo d’illustration', en: 'Illustrative photo', es: 'Foto ilustrativa' }

// An ambiance photo (Unsplash License, src/lib/photos.js) until the shop's own photos replace it
// (research/sessions/04 #12). Always labelled « Photo d'illustration »: it shows the kind of thing, never a
// specific Coco Vanille product. Intrinsic size on the <img>, lazy unless `priority` (the hero's LCP image).
export function StockPhoto({ name, locale = 'fr', sizes = '100vw', priority = false, className, label = true, decorative = false }) {
  const photo = PHOTOS[name]
  if (!photo) return null
  const src = photoSources(name)
  return (
    <span className={['stock-photo', className].filter(Boolean).join(' ')}>
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
      {label && (
        <span className="stock-photo-label" data-nosnippet="">
          {LABEL[locale] || LABEL.fr}
        </span>
      )}
    </span>
  )
}
