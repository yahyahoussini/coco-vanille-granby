import Link from 'next/link'
import { t } from '@/lib/i18n'

export default function NotFound() {
  const s = t('es')
  return (
    <main id="contenu" className="wrap page">
      <h1>{s.notFoundTitle}</h1>
      <p>{s.notFoundBody}</p>
      <p><Link href="/es/">Pâtisserie Coco Vanille · Inicio</Link> · <Link href="/carte/">Carte</Link> · <Link href="/nous-trouver/">Nous trouver</Link></p>
    </main>
  )
}
