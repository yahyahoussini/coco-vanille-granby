import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { studioAuth, safeBack } from '@/lib/studio/session'
import { homeFor } from '@/lib/studio/roles'

export const metadata = { title: 'Se connecter · Coco Studio' }
export const dynamic = 'force-dynamic'

const ERRORS = {
  identifiants: 'Courriel ou mot de passe incorrect. Après 5 essais, le compte est bloqué 15 minutes.',
  verrouille: 'Trop d’essais : le compte est bloqué 15 minutes. La propriétaire peut le débloquer.',
  inactif: 'Ce compte est désactivé. Parlez-en à la propriétaire.',
  role: 'Ce compte n’a pas accès à Coco Studio.',
  vide: 'Indiquez le courriel et le mot de passe.',
  trop: 'Trop d’essais depuis cet appareil. Réessayez dans 10 minutes.',
  origine: 'La page a expiré. Réessayez.',
  appareil: 'Cet appareil n’est pas la tablette partagée de la boutique. Connectez-vous avec votre courriel.',
  cle: 'La clé d’accès n’a pas été acceptée. Utilisez le mot de passe ou un code de secours.',
}

// Studio login (admin host): email + password, French first, big targets, labels above fields (16a A15).
export default async function Connexion({ searchParams }) {
  const q = (await searchParams) || {}
  const { user, device } = await studioAuth(await headers())
  const back = safeBack(typeof q.retour === 'string' ? q.retour : '', '')
  if (user) redirect(back || homeFor(user))
  const error = ERRORS[q.erreur]
  return (
    <main className="st-auth" id="contenu">
      <h1>Coco Studio</h1>
      <p className="st-lead">Pâtisserie Coco Vanille · outil de la boutique</p>
      {error && (
        <div className="error-summary" role="alert" tabIndex={-1}>
          {error}
        </div>
      )}
      <form method="post" action="/svc/connexion/" className="card">
        <h2 style={{ marginTop: 0 }}>Se connecter</h2>
        <input type="hidden" name="retour" value={back} />
        <div className="field">
          <label htmlFor="email">Courriel</label>
          <input id="email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <fieldset className="field">
          <legend>Cet appareil</legend>
          <div className="choices">
            <label className="choice">
              <input type="radio" name="appareil" value="telephone" defaultChecked={!device || device.kind === 'telephone'} />
              <span>Mon téléphone</span>
            </label>
            <label className="choice">
              <input type="radio" name="appareil" value="tablette" defaultChecked={device?.kind === 'tablette'} />
              <span>Tablette de la boutique</span>
            </label>
            <label className="choice">
              <input type="radio" name="appareil" value="ordinateur" defaultChecked={device?.kind === 'ordinateur'} />
              <span>Ordinateur</span>
            </label>
          </div>
          <span className="hint">Sur la tablette partagée, l’équipe change ensuite de personne avec un NIP à 4 chiffres.</span>
        </fieldset>
        <button className="btn btn-primary" type="submit">
          Se connecter
        </button>
      </form>
      {device?.shared && (
        <p>
          <a className="btn" href="/qui/">
            Qui utilise la tablette?
          </a>
        </p>
      )}
      <p className="meta">Session de 12 h. Mot de passe oublié : la propriétaire ou l’agence le réinitialise dans « Avancé ».</p>
    </main>
  )
}
