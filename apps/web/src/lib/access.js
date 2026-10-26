// Role-based access helpers shared by every collection (16 §2.2 access matrix).
// These rules apply to REST, GraphQL and « Avancé » (/admin). Studio actions check the role matrix and the
// step-up themselves (lib/studio/actions), then write with overrideAccess; the worker and the payment code too.
import { hasStepUp } from './studio/stepup.js'

export const ROLES = ['proprietaire', 'gerant', 'comptoir', 'agence', 'traduction', 'integration']

export const hasRole = (user, ...roles) => Boolean(user && roles.includes(user.role))

export const isStaff = ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir')
export const isOwner = ({ req: { user } }) => hasRole(user, 'proprietaire')
export const isOwnerOrManager = ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant')
export const isOwnerOrAgency = ({ req: { user } }) => hasRole(user, 'proprietaire', 'agence')
export const isTeam = ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir', 'agence', 'traduction')
export const isLoggedIn = ({ req: { user } }) => Boolean(user)
// Roles that may open « Avancé » (Users.access.admin). Comptoir works in Studio only.
export const isEditor = ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'agence', 'traduction')
export const anyone = () => true
export const nobody = () => false

// Published content is public; drafts only for the team.
export const publishedOrTeam = ({ req: { user } }) => {
  if (hasRole(user, 'proprietaire', 'gerant', 'agence', 'traduction')) return true
  return { _status: { equals: 'published' } }
}

// Money, prices, allergens, taxes and people: the role and a fresh identity check (16b §4 #4), the same
// 5-minute proof Studio asks for (/verifier/).
export const steppedUp = (req) => Boolean(req?.user && hasStepUp(req.payload, req.headers, req.user))
export const withStepUp = (...roles) => ({ req }) => hasRole(req?.user, ...roles) && steppedUp(req)
