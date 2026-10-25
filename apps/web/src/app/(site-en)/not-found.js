import Link from 'next/link'
import { t } from '@/lib/i18n'

export default function NotFound() {
  const s = t('en')
  return (
    <main id="contenu" className="wrap page">
      <h1>{s.notFoundTitle}</h1>
      <p>{s.notFoundBody}</p>
      <p><Link href="/en/">Pâtisserie Coco Vanille · Home</Link> · <Link href="/en/menu/">Menu</Link> · <Link href="/en/visit/">Visit</Link></p>
    </main>
  )
}
