import { studioAuth } from '@/lib/studio/session'
import { canSee } from '@/lib/studio/roles'
import { subscribe } from '@/lib/studio/live'

// GET /svc/evenements/: server-sent events for open Studio screens (« commande » on a new order or a status
// change). nginx: proxy_buffering off for this path (X-Accel-Buffering: no below); the browser reconnects.
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { payload, user } = await studioAuth(request.headers)
  if (!user || !canSee(user, 'commandes')) return new Response('Session requise', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const enc = new TextEncoder()
  let cleanup = () => {}
  const stream = new ReadableStream({
    async start(controller) {
      const send = (chunk) => {
        try {
          controller.enqueue(enc.encode(chunk))
        } catch {
          cleanup()
        }
      }
      send('retry: 5000\n\n')
      // Counts and ids only: no names, phones or notes in the stream.
      const off = await subscribe(payload, (msg) => send(`event: commande\ndata: ${JSON.stringify({ id: msg?.id ?? null, status: msg?.status ?? null, nouvelle: msg?.op === 'INSERT' })}\n\n`))
      const ping = setInterval(() => send(': ping\n\n'), 25000)
      cleanup = () => {
        clearInterval(ping)
        off()
      }
      request.signal.addEventListener('abort', () => {
        cleanup()
        try {
          controller.close()
        } catch {
          // already closed
        }
      })
    },
    cancel() {
      cleanup()
    },
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store, no-transform', 'X-Accel-Buffering': 'no', Connection: 'keep-alive' },
  })
}
