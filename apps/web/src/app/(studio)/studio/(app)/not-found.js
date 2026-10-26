import Link from 'next/link'

export const metadata = { title: 'Page introuvable · Coco Studio' }

export default function Introuvable() {
  return (
    <>
      <div className="st-head">
        <h1>Page introuvable</h1>
      </div>
      <p>Cette page n’existe pas dans Coco Studio.</p>
      <p>
        <Link className="btn btn-primary" href="/">
          Retour à Aujourd’hui
        </Link>
      </p>
    </>
  )
}
