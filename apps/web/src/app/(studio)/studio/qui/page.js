import { headers } from 'next/headers'
import { studioAuth } from '@/lib/studio/session'
import { PIN_ROLES, ROLE_LABELS } from '@/lib/studio/roles'
import { PinPad } from '@/components/studio/PinPad'

export const metadata = { title: 'Qui utilise la tablette? · Coco Studio' }
export const dynamic = 'force-dynamic'

const ERRORS = {
  nip: 'NIP incorrect. Réessayez.',
  verrouille: 'Trop d’essais : cette personne est bloquée 15 minutes. La propriétaire peut changer le NIP dans Réglages.',
  format: 'Le NIP a 4 chiffres.',
  personne: 'Cette personne n’a pas de NIP sur la tablette. La propriétaire l’ajoute dans Plus › Réglages.',
  trop: 'Trop d’essais sur cette tablette. Attendez quelques minutes.',
}

// Shared tablet (16 §3.0 « Shared tablet, idle 30 min »): pick your name, then your 4-digit PIN.
export default async function Qui({ searchParams }) {
  const q = (await searchParams) || {}
  const { payload, user, device } = await studioAuth(await headers())
  if (!device?.shared) {
    return (
      <main className="st-auth" id="contenu">
        <h1>Qui utilise la tablette?</h1>
        <p>Cet appareil n’est pas enregistré comme la tablette partagée de la boutique.</p>
        <p>
          <a className="btn btn-primary" href="/connexion/">
            Se connecter avec un courriel
          </a>
        </p>
      </main>
    )
  }
  const res = await payload.find({
    collection: 'users',
    where: { and: [{ role: { in: PIN_ROLES } }, { active: { not_equals: false } }, { pinHash: { exists: true } }] },
    sort: 'name',
    limit: 30,
    depth: 0,
    overrideAccess: true,
    select: { name: true, role: true },
  })
  const people = res.docs
  const chosen = people.find((p) => String(p.id) === String(q.personne)) || null
  const error = ERRORS[q.erreur]
  return (
    <main className="st-auth" id="contenu">
      <h1>Qui utilise la tablette?</h1>
      {user && <p className="st-lead">En ce moment : {user.name}</p>}
      {error && (
        <div className="error-summary" tabIndex={-1}>
          {error}
        </div>
      )}
      {!chosen ? (
        <>
          {people.length ? (
            <ul className="persons">
              {people.map((p) => (
                <li key={p.id}>
                  <a className="btn" href={`/qui/?personne=${p.id}`}>
                    {p.role === 'proprietaire' ? `${p.name || ROLE_LABELS.proprietaire}` : p.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">Personne n’a encore de NIP. La propriétaire en ajoute dans Plus › Réglages.</p>
          )}
          <p>
            <a href="/connexion/">Se connecter avec un courriel</a>
          </p>
        </>
      ) : (
        <form method="post" action="/svc/nip/" className="card">
          <input type="hidden" name="personne" value={chosen.id} />
          <h2 style={{ marginTop: 0 }}>{chosen.name}</h2>
          <PinPad />
          <p>
            <a href="/qui/">Ce n’est pas moi</a>
          </p>
        </form>
      )}
    </main>
  )
}
