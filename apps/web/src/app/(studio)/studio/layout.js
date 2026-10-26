import '@fontsource-variable/inter'
import '@/styles/studio.css'

export const metadata = {
  title: 'Coco Studio',
  robots: { index: false, follow: false, nocache: true },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon-32.png', apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'Coco Studio', statusBarStyle: 'default' },
}
export const viewport = { themeColor: '#2E211A', width: 'device-width', initialScale: 1 }

// Coco Studio root layout (admin host only; French-first UI, 16 §3.0).
export default function StudioLayout({ children }) {
  return (
    <html lang="fr-CA">
      <body className="studio">{children}</body>
    </html>
  )
}
