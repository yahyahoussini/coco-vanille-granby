import '@fontsource-variable/fraunces/soft.css'
import '@fontsource-variable/inter'
import '@/styles/site.css'

export const metadata = { metadataBase: new URL('https://cocovanillegranby.com') }
export const viewport = { themeColor: '#F7F0E3', width: 'device-width', initialScale: 1 }

// Root layout for the en site: <html lang="en-CA"> (v1 L2).
export default function Layout({ children }) {
  return (
    <html lang="en-CA">
      <body>{children}</body>
    </html>
  )
}
