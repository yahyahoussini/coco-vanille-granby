import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'
import { getPaymentSettings } from '@/lib/payments/settings'
import { resolveOptions } from '@/lib/payments/provider'
import { webhookUrlFor } from '@/lib/payments/connect'
import { maskKey } from '@/lib/payments/secrets'
import { publicOrigin } from '@/lib/ordering/context'
import { whenFr } from '@/lib/studio/format'

export const metadata = { title: 'Paiement · Coco Studio' }

const BACK = '/plus/paiement/'

// How customers pay, and the shop's Stripe account (owner only). The secret key goes in and never comes back on a screen.
export default async function Paiement({ searchParams }) {
  const ctx = await studioPage('paiement')
  const settings = await getPaymentSettings(ctx.payload)
  const options = resolveOptions(settings)
  const url = webhookUrlFor(publicOrigin())
  const moved = options.connected && settings.webhookUrl && settings.webhookUrl !== url
  const waiting = options.connected && settings.chargesEnabled === false
  return (
    <>
      <p>
        <Link href="/plus/">‹ Plus</Link>
      </p>
      <div className="st-head">
        <h1>Paiement</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />

      <section aria-labelledby="facons">
        <h2 id="facons">Comment vos clients paient</h2>
        <ActionForm type="payment.methods" back={BACK} needsNetwork className="card">
          <label className="check">
            <input type="checkbox" name="counter" value="true" defaultChecked={options.counter} />
            <span>À la cueillette, au comptoir (comptant)</span>
          </label>
          <label className="check">
            <input type="checkbox" name="online" value="true" defaultChecked={options.online === 'stripe'} disabled={!options.connected || waiting} />
            <span>En ligne, par carte{options.connected ? '' : ' : connectez d’abord Stripe, plus bas'}</span>
          </label>
          <p className="meta">Si les deux sont cochés, le client choisit dans son récapitulatif. Le site, ses conditions de vente et sa politique de confidentialité suivent aussitôt.</p>
          <button className="btn" type="submit">
            Enregistrer
          </button>
        </ActionForm>
      </section>

      <section aria-labelledby="stripe">
        <h2 id="stripe">Paiement en ligne avec Stripe</h2>
        {settings.unreadable && <p className="card">Les clés enregistrées ne peuvent plus être lues. Collez-les de nouveau ci-dessous.</p>}
        {options.connected ? (
          <>
            <div className="card">
              <p>
                <strong>{settings.accountName || 'Compte Stripe'}</strong> <span className="tag">{settings.live === false ? 'Mode essai' : 'Mode réel'}</span>
              </p>
              <p className="meta">Clé publiable : {maskKey(settings.publishableKey)}</p>
              <p className="meta">Paiements : {waiting ? 'pas encore activés par Stripe. Finissez le dossier dans Stripe, puis touchez « Vérifier la connexion ».' : 'activés'}</p>
              {settings.connectedAt && <p className="meta">Connecté : {whenFr(settings.connectedAt)}</p>}
              {settings.live === false && <p className="meta">Mode essai : les clients voient le paiement en ligne, mais aucune vraie carte n’est débitée. Carte d’essai : 4242 4242 4242 4242, date future, n’importe quel code. Collez vos clés réelles avant d’ouvrir au public.</p>}
              {moved && <p className="meta">L’adresse du site a changé : touchez « Vérifier la connexion » pour que Stripe prévienne la bonne adresse.</p>}
              <ActionForm type="payment.check" back={BACK} needsNetwork pending="Vérification auprès de Stripe…">
                <button className="btn" type="submit">
                  Vérifier la connexion
                </button>
              </ActionForm>
            </div>
            <details className="card">
              <summary>Changer de clés (passer du mode essai au mode réel)</summary>
              <KeysForm confirmed={ctx.stepUp} />
            </details>
            <details className="card">
              <summary>Déconnecter Stripe</summary>
              <p className="meta">Les clients paieront à la cueillette. Les paiements déjà reçus restent dans votre compte Stripe; pour rembourser l’un d’eux ensuite, passez par le tableau de bord de Stripe.</p>
              <ActionForm type="payment.disconnect" back={BACK} needsNetwork>
                <button className="btn" type="submit">
                  Déconnecter Stripe
                </button>
              </ActionForm>
            </details>
          </>
        ) : (
          <div className="card">
            <ol>
              <li>
                Ouvrez le compte au nom de l’entreprise, sur <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer">dashboard.stripe.com/register</a>. Stripe demande le NEQ, le compte de banque et une pièce d’identité.
              </li>
              <li>
                Copiez vos deux clés, sur <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">dashboard.stripe.com/apikeys</a>.
              </li>
              <li>Collez-les ici : le site vérifie le compte et règle le reste tout seul.</li>
            </ol>
            <p className="meta">Stripe prend environ 2,9 % + 0,30 $ par vente, sans frais mensuels. Vous pouvez essayer d’abord avec les clés du mode essai (pk_test_, sk_test_).</p>
            <KeysForm confirmed={ctx.stepUp} />
          </div>
        )}
      </section>
    </>
  )
}

// Studio asks who you are before saving keys; asked first, so nothing pasted is lost on the way.
function KeysForm({ confirmed }) {
  if (!confirmed) {
    return (
      <p>
        <Link className="btn" href={`/verifier/?retour=${encodeURIComponent(BACK)}`}>
          Confirmer que c’est vous, puis coller les clés
        </Link>
      </p>
    )
  }
  return (
    <ActionForm type="payment.connect" back={BACK} needsNetwork pending="Vérification auprès de Stripe…">
      <div className="field">
        <label htmlFor="cle-publiable">Clé publiable</label>
        <input id="cle-publiable" name="publishable" type="text" required autoComplete="off" spellCheck={false} placeholder="pk_live_…" />
      </div>
      <div className="field">
        <label htmlFor="cle-secrete">Clé secrète</label>
        <input id="cle-secrete" name="secret" type="password" required autoComplete="off" spellCheck={false} placeholder="sk_live_…" />
        <span className="hint">Gardée chiffrée; elle ne s’affiche plus jamais, ici ou ailleurs.</span>
      </div>
      <button className="btn btn-primary" type="submit">
        Vérifier et activer
      </button>
    </ActionForm>
  )
}
