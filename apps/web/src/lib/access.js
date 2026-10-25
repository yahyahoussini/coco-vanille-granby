// Role-based access helpers shared by every collection (16 §2.2 access matrix).
export const ROLES = ['proprietaire', 'gerant', 'comptoir', 'agence', 'traduction', 'integration']

export const hasRole = (user, ...roles) => Boolean(user && roles.includes(user.role))

export const isStaff = ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir')
export const isOwner = ({ req: { user } }) => hasRole(user, 'proprietaire')
export const isOwnerOrManager = ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant')
export const isOwnerOrAgency = ({ req: { user } }) => hasRole(user, 'proprietaire', 'agence')
export const isTeam = ({ req: { user } }) => hasRole(user, 'proprietaire', 'gerant', 'comptoir', 'agence', 'traduction')
export const isLoggedIn = ({ req: { user } }) => Boolean(user)
export const anyone = () => true
export const nobody = () => false

// Published content is public; drafts only for the team.
export const publishedOrTeam = ({ req: { user } }) => {
  if (hasRole(user, 'proprietaire', 'gerant', 'agence', 'traduction')) return true
  return { _status: { equals: 'published' } }
}
