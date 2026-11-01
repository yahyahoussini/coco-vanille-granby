import '@fontsource-variable/fraunces/soft.css'
import '@fontsource-variable/inter'
import '@/styles/site.css'
import '@/styles/content.css'
import '@/styles/journal.css'

export const metadata = { title: 'Aperçu · Coco Studio', robots: { index: false, follow: false, nocache: true } }
export const viewport = { themeColor: '#FAF4E8', width: 'device-width', initialScale: 1 }

// Studio's preview of a Journal post as the public page renders it (admin host only, /plus/journal/<id>/apercu/).
// Its own root layout: the site's styles load here without ever reaching Studio's screens (a move between two
// root layouts is a full page load).
export default function PreviewLayout({ children }) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  )
}
