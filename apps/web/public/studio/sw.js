// Coco Studio service worker (16b §3): caches the app shell only (hashed scripts and styles, fonts, icons,
// the offline page). Never a page with orders, names or phones, never an API or action response.
// Offline taps wait in IndexedDB (components/studio/outbox.js), not here.
const VERSION = 'coco-studio-1'
const SHELL = ['/hors-ligne/', '/manifest.webmanifest', '/icone-192.png', '/icone-512.png', '/apple-touch-icon.png', '/favicon-32.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const isShellAsset = (url) => url.pathname.startsWith('/_next/static/') || SHELL.includes(url.pathname)

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (request.mode === 'navigate') {
    // Pages are always fetched fresh (they hold today's orders); offline → the static offline page.
    event.respondWith(fetch(request).catch(() => caches.match('/hors-ligne/')))
    return
  }
  if (isShellAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok && url.pathname.startsWith('/_next/static/')) {
              const copy = res.clone()
              caches.open(VERSION).then((cache) => cache.put(request, copy))
            }
            return res
          }),
      ),
    )
  }
  // Everything else (RSC data, /svc/*, /api/*, /admin): network only, never cached.
})
