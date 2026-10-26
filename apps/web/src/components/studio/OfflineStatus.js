'use client'

import { useEffect, useState } from 'react'
import { count, flush } from './outbox'

export function OfflineStatus() {
  const [waiting, setWaiting] = useState(null)
  useEffect(() => {
    count().then(setWaiting)
    const back = () => {
      flush().then(() => window.location.assign('/'))
    }
    window.addEventListener('online', back)
    return () => window.removeEventListener('online', back)
  }, [])
  return (
    <div className="card">
      <p>
        <strong>{waiting === null ? '…' : waiting ? `${waiting} ${waiting > 1 ? 'changements' : 'changement'} en attente` : 'Rien en attente'}</strong>
      </p>
      <button type="button" className="btn btn-primary" onClick={() => window.location.assign('/')}>
        Réessayer
      </button>
    </div>
  )
}
