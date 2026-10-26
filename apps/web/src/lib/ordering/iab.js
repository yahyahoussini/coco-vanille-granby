// Instagram / Facebook in-app browsers (08 §2.2): wallets often missing there. Detected server-side from the
// user agent (tokens UNVERIFIED on current app versions: confirm on real devices).
export function inAppBrowser(ua = '') {
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return 'facebook'
  return null
}

export const isIOS = (ua = '') => /iPhone|iPad|iPod/i.test(ua)

// Link that asks iOS to open the page in Safari; elsewhere the plain https link (the menu « Ouvrir dans le navigateur »).
export function openInBrowserHref(url, ua = '') {
  if (isIOS(ua)) return url.replace(/^https?:\/\//, (m) => (m === 'https://' ? 'x-safari-https://' : 'x-safari-http://'))
  return url
}
