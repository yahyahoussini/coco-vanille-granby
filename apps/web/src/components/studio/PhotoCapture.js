'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { act } from './outbox'
import { snack } from './Snackbar'

const LONG_EDGE = 2560

// Long edge 2560 px, JPEG 0.85, before upload (16b §3): a phone photo of 4–12 MB becomes ≈ 1 MB.
async function compress(file) {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) && file.type) return file
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, LONG_EDGE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    return blob ? new File([blob], 'vitrine.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}

// « Prendre la photo » → camera → preview → « Publier ». A plain file form without JavaScript; offline,
// the photo waits in the outbox and is published when the network is back.
export function PhotoCapture({ back = '/vitrine/', replace = false }) {
  const router = useRouter()
  const input = useRef(null)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)

  async function pick(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const small = await compress(f)
    setFile(small)
    setPreview(URL.createObjectURL(small))
  }

  async function publish(e) {
    e.preventDefault()
    if (!file || busy) return
    setBusy(true)
    snack({ message: navigator.onLine === false ? 'Photo gardée · elle sera publiée au retour du réseau' : 'Envoi de la photo…' })
    const r = await act('vitrine.photo', { photo: file })
    setBusy(false)
    snack({ message: r.ok ? r.message : `Pas appliqué : ${r.message}`, tone: r.ok ? 'ok' : 'bad', undo: r.undo || null })
    if (r.ok) {
      setPreview(null)
      setFile(null)
      router.refresh()
    }
  }

  return (
    <form method="post" action="/svc/action/" encType="multipart/form-data" onSubmit={publish}>
      <input type="hidden" name="type" value="vitrine.photo" />
      <input type="hidden" name="back" value={back} />
      <input ref={input} id="photo-vitrine" name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" capture="environment" onChange={pick} className="file-input sr-only" />
      <label className="btn btn-primary" htmlFor="photo-vitrine" style={{ cursor: 'pointer' }}>
        {replace ? 'Remplacer la photo' : 'Prendre la photo'}
      </label>
      {preview && (
        <div className="photo-day" style={{ marginBlock: '0.75rem' }}>
          <img src={preview} alt="Aperçu de la photo de la vitrine" width={640} height={480} style={{ objectFit: 'cover', aspectRatio: '4 / 3' }} />
        </div>
      )}
      <noscript>
        <button className="btn" type="submit" style={{ marginBlockStart: '0.5rem' }}>
          Publier
        </button>
      </noscript>
      {preview && (
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Publier
        </button>
      )}
    </form>
  )
}
