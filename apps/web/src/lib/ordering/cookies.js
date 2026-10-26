// Set-Cookie strings for the /svc routes (essential cookies only: « Ma boîte » and form drafts, 07 témoins page).
const secure = () => /^https:/.test(process.env.PUBLIC_ORIGIN || '')

export function setCookie(name, value, { maxAge = 60 * 60 * 24 * 30, httpOnly = true } = {}) {
  const parts = [`${name}=${value}`, 'Path=/', `Max-Age=${maxAge}`, 'SameSite=Lax']
  if (httpOnly) parts.push('HttpOnly')
  if (secure()) parts.push('Secure')
  return parts.join('; ')
}

export const clearCookie = (name) => setCookie(name, '', { maxAge: 0 })

export const draftValue = (data) => Buffer.from(JSON.stringify(data), 'utf8').toString('base64url')

// 303 See Other with a relative Location: the browser re-requests with GET (works with JavaScript off).
export function seeOther(location, cookies = []) {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' })
  for (const c of cookies) headers.append('Set-Cookie', c)
  return new Response(null, { status: 303, headers })
}
