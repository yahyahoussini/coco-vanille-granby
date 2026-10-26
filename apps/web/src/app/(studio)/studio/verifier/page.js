import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { studioAuth, safeBack } from '@/lib/studio/session'

export const metadata = { title: 'Confirmer que c’est vous · Coco Studio' }
export const dynamic = 'force-dynamic'

const ERRORS = {
  'mot-de-passe': 'Mot de passe incorrect.',
  code: 'Code de secours incorrect ou déjà utilisé.',
  trop: 'Trop d’essais. Réessayez dans 10 minutes.',
  origine: 'La page a expiré. Réessayez.',
  cle: 'La clé d’accès n’a pas été acceptée.',
}

// Step-up before money, prices, allergens, taxes and people (16b §4 #4): valid 5 minutes.
export default async function Verifier({ searchParams }) {
  const q = (await searchParams) || {}
  const { user } = await studioAuth(await headers())
  const back = safeBack(typeof q.retour === 'string' ? q.retour : '/', '/')
  if (!user) redirect(`/connexion/?retour=${encodeURIComponent(back)}`)
  const error = ERRORS[q.erreur]
  return (
    <main className="st-auth" id="contenu">
      <h1>Confirmer que c’est vous</h1>
      <p className="st-lead">Pour les remboursements, les prix, les allergènes, les taxes et les comptes, Studio vérifie qui fait le changement. La vérification vaut 5 minutes.</p>
      {error && (
        <div className="error-summary" tabIndex={-1}>
          {error}
        </div>
      )}
      <form method="post" action="/svc/verifier/" className="card">
        <input type="hidden" name="retour" value={back} />
        <div className="field">
          <label htmlFor="password">Mot de passe de {user.name}</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button className="btn btn-primary" type="submit">
          Confirmer
        </button>
      </form>
      <details className="card">
        <summary className="btn btn-text">Utiliser un code de secours</summary>
        <form method="post" action="/svc/verifier/">
          <input type="hidden" name="retour" value={back} />
          <div className="field">
            <label htmlFor="code">Code de secours (10 caractères)</label>
            <input id="code" name="code" type="text" autoComplete="one-time-code" autoCapitalize="none" spellCheck={false} required />
          </div>
          <button className="btn" type="submit">
            Confirmer avec le code
          </button>
        </form>
      </details>
      <p>
        <a href={back}>Retour</a>
      </p>
    </main>
  )
}
