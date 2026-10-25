import { notFound } from 'next/navigation'

// Target of proxy.js rewrites for /admin, /api, /studio on the public host.
export default function Introuvable() {
  notFound()
}
