import '@fontsource-variable/inter'
import '@/styles/studio.css'

export const metadata = { title: 'Coco Studio', robots: { index: false, follow: false }, manifest: '/studio/manifest.webmanifest' }
export const viewport = { themeColor: '#2E211A', width: 'device-width', initialScale: 1 }

// Coco Studio root layout (admin host only; French-first UI, 16 §3.0).
export default function StudioLayout({ children }) {
  return (
    <html lang="fr-CA">
      <body className="studio">{children}</body>
    </html>
  )
}
