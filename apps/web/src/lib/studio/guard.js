// Page guard for Studio server components: the signed-in person, their device, and what they may see.
// Unauthenticated → the login screen (or « Qui utilise la tablette? » on the shared tablet); a screen outside
// the role's matrix → the role's home (16 §2.2).
import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { studioAuth, hasStepUp } from './session.js'
import { canSee, can, homeFor } from './roles.js'

// One auth lookup per request, shared by the layout and the page.
const authOnce = cache(async () => {
  const h = await headers()
  return { ...(await studioAuth(h)), headers: h }
})

export async function studioPage(screen, { back = null } = {}) {
  const ctx = await authOnce()
  if (!ctx.user) {
    if (ctx.device?.shared) redirect('/qui/')
    redirect(back ? `/connexion/?retour=${encodeURIComponent(back)}` : '/connexion/')
  }
  if (screen && !canSee(ctx.user, screen)) redirect(homeFor(ctx.user))
  return {
    ...ctx,
    can: (action) => can(ctx.user, action),
    stepUp: hasStepUp(ctx.payload, ctx.headers, ctx.user),
    // Local API options for every Studio read: the person's own access rules apply (16b §4 #2).
    as: { user: ctx.user, overrideAccess: false },
  }
}

export const firstParam = (v) => (Array.isArray(v) ? v[0] : v) ?? null
