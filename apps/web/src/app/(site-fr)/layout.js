import Script from 'next/script'
import '@fontsource-variable/fraunces/soft.css'
import '@fontsource-variable/inter'
import '@/styles/site.css'
import '@/styles/content.css'
import '@/styles/home.css'
import '@/styles/catalogue.css'

// Icons: the round logo (public/brand), one favicon link for Google and the tabs (audit: favicon link).
export const metadata = {
  metadataBase: new URL('https://cocovanillegranby.com'),
  icons: {
    icon: [
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/logo-badge-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
}
export const viewport = { themeColor: '#FAF4E8', width: 'device-width', initialScale: 1 }

// Root layout for the fr site: <html lang="fr-CA"> (v1 L2); html.js is set before paint (suppressHydrationWarning).
export default function Layout({ children }) {
  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <body>
        {children}
        <Script id="js-class" strategy="beforeInteractive">{"document.documentElement.classList.add('js')"}</Script>
      </body>
    </html>
  )
}
