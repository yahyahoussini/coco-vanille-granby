import { studioPage } from '@/lib/studio/guard'
import { ROLE_LABELS, PIN_ROLES } from '@/lib/studio/roles'
import { DEVICE_LABELS } from '@/lib/studio/audit'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { ShopSettings } from '@/components/studio/settings/ShopSettings'
import { PasskeySettings } from '@/components/studio/settings/PasskeySettings'

export const metadata = { title: 'Réglages · Coco Studio' }

const BACK = '/plus/reglages/'

// Plus › Réglages (16 §8.1): this device, the team and their PINs, the Comptoir closure permission,
// the owner's settings and sign-in keys.
export default async function Reglages({ searchParams }) {
  const ctx = await studioPage('reglages')
  const { payload, user, device } = ctx
  const owner = user.role === 'proprietaire'
  let team = []
  let withPin = new Set()
  if (owner) {
    team = (await payload.find({ collection: 'users', sort: 'name', limit: 50, depth: 0, ...ctx.as })).docs
    const pins = await payload.find({ collection: 'users', where: { pinHash: { exists: true } }, limit: 50, depth: 0, overrideAccess: true, select: { name: true } })
    withPin = new Set(pins.docs.map((d) => String(d.id)))
  }
  return (
    <>
      <div className="st-head">
        <h1>Réglages</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />

      <section aria-labelledby="moi">
        <h2 id="moi">Vous et cet appareil</h2>
        <div className="card">
          <p>
            <strong>{user.name}</strong> · {ROLE_LABELS[user.role]}
          </p>
          <p className="meta">Cet appareil : {DEVICE_LABELS[device?.kind] || 'non indiqué'}{device?.shared ? ' (partagé · changement de personne par NIP)' : ''}</p>
          <form method="post" action="/svc/appareil/">
            <input type="hidden" name="back" value={BACK} />
            <fieldset className="field">
              <legend>Cet appareil est…</legend>
              <div className="choices">
                {[
                  ['telephone', 'Mon téléphone'],
                  ['tablette', 'La tablette de la boutique'],
                  ['ordinateur', 'Un ordinateur'],
                ].map(([v, l]) => (
                  <label className="choice" key={v}>
                    <input type="radio" name="appareil" value={v} defaultChecked={(device?.kind || 'telephone') === v} />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="btn" type="submit">
              Enregistrer l’appareil
            </button>
          </form>
          <div className="btn-row" style={{ marginBlockStart: '0.75rem' }}>
            {device?.shared && (
              <a className="btn" href="/qui/">
                Changer de personne
              </a>
            )}
            <form method="post" action="/svc/deconnexion/">
              <button className="btn" type="submit">
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </section>

      {owner && (
        <section aria-labelledby="equipe">
          <h2 id="equipe">L’équipe et les NIP</h2>
          <p className="meta">Sur la tablette partagée, chaque personne choisit son nom et tape son NIP à 4 chiffres. Changer un NIP ou un compte demande de confirmer que c’est vous.</p>
          {team.map((p) => (
            <div className="card" key={p.id}>
              <div className="card-head">
                <h3>{p.name}</h3>
                <span className="tag" data-tone={p.active === false ? 'bad' : 'ok'}>
                  {p.active === false ? '× Désactivé' : `✓ ${ROLE_LABELS[p.role]}`}
                </span>
              </div>
              <p className="meta">{!PIN_ROLES.includes(p.role) ? 'Connexion par clé d’accès ou mot de passe (pas de NIP)' : withPin.has(String(p.id)) ? 'NIP enregistré' : 'Pas de NIP (ne peut pas prendre la tablette)'}</p>
              {PIN_ROLES.includes(p.role) && (
                <ActionForm type="users.pin" fields={{ userId: p.id }} back={BACK} className="btn-row">
                  <label className="sr-only" htmlFor={`pin-${p.id}`}>
                    Nouveau NIP de {p.name}
                  </label>
                  <input id={`pin-${p.id}`} name="pin" className="code" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} autoComplete="new-password" placeholder="••••" required />
                  <button className="btn" type="submit">
                    {withPin.has(String(p.id)) ? 'Changer le NIP' : 'Donner un NIP'}
                  </button>
                </ActionForm>
              )}
              <div className="btn-row" style={{ marginBlockStart: '0.5rem' }}>
                {p.role === 'comptoir' && (
                  <ActionForm type="settings.mayClose" fields={{ userId: p.id, mayClose: p.mayClose ? 'false' : 'true' }} back={BACK}>
                    <button className="btn btn-text" type="submit">
                      {p.mayClose ? 'Retirer la permission de fermer la boutique' : 'Permettre de fermer la boutique'}
                    </button>
                  </ActionForm>
                )}
                {String(p.id) !== String(user.id) && (
                  <ActionForm type="users.active" fields={{ userId: p.id, active: p.active === false ? 'true' : 'false' }} back={BACK}>
                    <button className="btn btn-text" type="submit">
                      {p.active === false ? 'Réactiver' : 'Désactiver le compte'}
                    </button>
                  </ActionForm>
                )}
              </div>
            </div>
          ))}
          <details className="card">
            <summary className="btn">Ajouter une personne</summary>
            <ActionForm type="users.create" back={BACK}>
              <div className="field">
                <label htmlFor="new-name">Prénom</label>
                <input id="new-name" name="name" type="text" autoComplete="off" autoCorrect="off" spellCheck={false} required />
              </div>
              <fieldset className="field">
                <legend>Rôle</legend>
                <div className="choices">
                  <label className="choice">
                    <input type="radio" name="role" value="comptoir" defaultChecked />
                    <span>Comptoir</span>
                  </label>
                  <label className="choice">
                    <input type="radio" name="role" value="gerant" />
                    <span>Gérant·e</span>
                  </label>
                </div>
              </fieldset>
              <div className="field">
                <label htmlFor="new-pin">NIP à 4 chiffres</label>
                <input id="new-pin" name="pin" className="code" type="password" inputMode="numeric" pattern="\d{4}" maxLength={4} autoComplete="new-password" required />
              </div>
              <button className="btn btn-primary" type="submit">
                Ajouter
              </button>
            </ActionForm>
          </details>
        </section>
      )}

      <ShopSettings ctx={ctx} back={BACK} />
      <PasskeySettings ctx={ctx} />
    </>
  )
}
