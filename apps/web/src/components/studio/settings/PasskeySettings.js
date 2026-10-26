import { PasskeyManager } from '../Passkey'
import { PASSKEY_ROLES } from '@/lib/studio/passkey'

// Réglages › Clés d'accès (owner, manager, agency): passkeys + backup codes (16b §4 #5–#6).
export async function PasskeySettings({ ctx }) {
  if (!PASSKEY_ROLES.includes(ctx.user.role)) return null
  const me = await ctx.payload.findByID({ collection: 'users', id: ctx.user.id, depth: 0, overrideAccess: true, showHiddenFields: true })
  const keys = (Array.isArray(me.passkeys) ? me.passkeys : []).map(({ id, label, createdAt, lastUsedAt }) => ({ id, label, createdAt, lastUsedAt }))
  const codes = Array.isArray(me.backupCodes) ? me.backupCodes.length : 0
  return (
    <section aria-labelledby="cles-titre" id="cles">
      <h2 id="cles-titre">Clés d’accès et codes de secours</h2>
      <PasskeyManager keys={keys} />
      <p className="meta">{codes ? `${codes} codes de secours inutilisés.` : 'Pas encore de codes de secours : ils sont créés avec la première clé d’accès.'}</p>
    </section>
  )
}
