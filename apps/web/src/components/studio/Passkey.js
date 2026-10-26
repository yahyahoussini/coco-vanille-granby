'use client'

import { useEffect, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

const post = async (etape, body = {}) => {
  const res = await fetch(`/svc/cle/${etape}/`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
  return res.json().catch(() => ({ ok: false, message: 'Problème de notre côté.' }))
}

function useSupported() {
  const [ok, setOk] = useState(false)
  useEffect(() => setOk(typeof window !== 'undefined' && Boolean(window.PublicKeyCredential)), [])
  return ok
}

// « Se connecter avec une clé d'accès » (Face ID, Touch ID, empreinte, clé de sécurité). Shown only where it works.
export function PasskeyLogin({ back = '' }) {
  const supported = useSupported()
  const [error, setError] = useState(null)
  if (!supported) return null
  async function go() {
    setError(null)
    const o = await post('options-connexion')
    if (!o.ok) return setError(o.message)
    let response
    try {
      response = await startAuthentication({ optionsJSON: o.options })
    } catch {
      return setError('Connexion avec la clé d’accès annulée.')
    }
    const r = await post('connexion', { response, back })
    if (r.ok) window.location.assign(r.redirect || '/')
    else setError(r.message)
  }
  return (
    <div className="card">
      <button type="button" className="btn" style={{ inlineSize: '100%' }} onClick={go}>
        Se connecter avec une clé d’accès
      </button>
      {error && (
        <p className="error-summary" role="alert" style={{ marginBlock: '0.75rem 0' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// Step-up with the passkey instead of the password.
export function PasskeyStepUp({ back = '/' }) {
  const supported = useSupported()
  const [error, setError] = useState(null)
  if (!supported) return null
  async function go() {
    setError(null)
    const o = await post('options-verif')
    if (!o.ok) return setError(o.message)
    let response
    try {
      response = await startAuthentication({ optionsJSON: o.options })
    } catch {
      return setError('Vérification annulée.')
    }
    const r = await post('verif', { response, back })
    if (r.ok) window.location.assign(r.redirect || back)
    else setError(r.message)
  }
  return (
    <div className="card">
      <button type="button" className="btn btn-primary" onClick={go}>
        Confirmer avec ma clé d’accès
      </button>
      {error && <p className="error-summary">{error}</p>}
    </div>
  )
}

function Codes({ codes }) {
  if (!codes?.length) return null
  return (
    <div className="effects" role="status">
      <p>
        <strong>Codes de secours : notez-les maintenant, ils ne s’afficheront plus.</strong> Chacun sert une seule fois si la clé d’accès est perdue.
      </p>
      <ul style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.125rem' }}>
        {codes.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

// Réglages: add a passkey on this device, new backup codes, remove a passkey. Each needs the step-up.
export function PasskeyManager({ keys = [] }) {
  const supported = useSupported()
  const [msg, setMsg] = useState(null)
  const [codes, setCodes] = useState(null)
  const needStep = (r) => {
    if (r.code === 'step_up') {
      window.location.assign(`/verifier/?retour=${encodeURIComponent('/plus/reglages/#cles')}`)
      return true
    }
    return false
  }
  async function add() {
    setMsg(null)
    const o = await post('options-inscription')
    if (needStep(o)) return
    if (!o.ok) return setMsg(o.message)
    let response
    try {
      response = await startRegistration({ optionsJSON: o.options })
    } catch {
      return setMsg('Ajout annulé.')
    }
    const r = await post('inscription', { response })
    setMsg(r.message)
    if (r.backupCodes) setCodes(r.backupCodes)
    if (r.ok) setTimeout(() => window.location.reload(), r.backupCodes ? 60000 : 1500)
  }
  async function newCodes() {
    const r = await post('codes')
    if (needStep(r)) return
    if (r.ok) setCodes(r.backupCodes)
    else setMsg(r.message)
  }
  async function remove(id) {
    const r = await post('retirer', { id })
    if (needStep(r)) return
    setMsg(r.message)
    if (r.ok) window.location.reload()
  }
  return (
    <div className="card">
      {keys.length ? (
        <ul className="rows">
          {keys.map((k) => (
            <li key={k.id}>
              <span className="grow">
                {k.label}
                <small className="meta" style={{ display: 'block' }}>
                  Ajoutée {k.createdAt ? new Date(k.createdAt).toLocaleDateString('fr-CA') : ''}
                  {k.lastUsedAt ? ` · utilisée ${new Date(k.lastUsedAt).toLocaleDateString('fr-CA')}` : ''}
                </small>
              </span>
              <button type="button" className="btn btn-text" onClick={() => remove(k.id)}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="meta">Aucune clé d’accès. Avec une clé, plus besoin de taper le mot de passe : Face ID ou l’empreinte suffit.</p>
      )}
      <div className="btn-row" style={{ marginBlockStart: '0.5rem' }}>
        {supported ? (
          <button type="button" className="btn btn-primary" onClick={add}>
            Ajouter une clé d’accès sur cet appareil
          </button>
        ) : (
          <p className="meta">Cet appareil ou ce navigateur ne gère pas les clés d’accès (iOS 16 ou plus récent).</p>
        )}
        <button type="button" className="btn" onClick={newCodes}>
          Nouveaux codes de secours
        </button>
      </div>
      {msg && (
        <p className="meta" role="status">
          {msg}
        </p>
      )}
      <Codes codes={codes} />
    </div>
  )
}
