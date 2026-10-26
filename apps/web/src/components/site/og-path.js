// URL of a page's Open Graph card (rendered by og.js). Kept apart so pages do not bundle the image renderer.
export const ogPath = (locale, name) => `${locale === 'fr' ? '' : `/${locale}`}/og/${name}.png`
