// Docker HEALTHCHECK: shallow liveness (process up, no database), so a database outage
// does not make Docker restart the app (17 §1.1). The deep check (/svc/health/) is for
// deploy.sh and the uptime monitor.
//   web | all → GET /svc/health/?shallow=1 with a public Host
//   studio    → same path with an admin Host (src/proxy.js routes by Host)
//   worker    → no HTTP server: healthy while the container runs
import http from 'node:http'

const role = process.env.APP_ROLE || 'web'
const port = Number(process.env.PORT || (role === 'studio' ? 3001 : 3000))
const first = (list, fallback) => (list || fallback).split(',').map((s) => s.trim()).filter(Boolean)[0]
const host = role === 'studio' ? first(process.env.ADMIN_HOSTS, 'admin.localhost') : first(process.env.PUBLIC_HOSTS, 'localhost')

function probe({ port, host, path = '/svc/health/?shallow=1', timeout = 4000 }) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path, headers: { host, 'user-agent': 'coco-healthcheck/1' }, timeout }, (res) => {
      res.resume()
      resolve(res.statusCode)
    })
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', () => resolve(0))
  })
}

if (role === 'worker') process.exit(0)

let status = await probe({ port, host })
// Until src/proxy.js lets /svc/health/ through on the admin host, Studio answers it with 404:
// fall back to Payload's REST API, which only Studio serves (any answer below 500 = process up).
if (role === 'studio' && status === 404) {
  const api = await probe({ port, host, path: '/api/users/me' })
  status = api > 0 && api < 500 ? 200 : api
}
process.exit(status === 200 ? 0 : 1)
