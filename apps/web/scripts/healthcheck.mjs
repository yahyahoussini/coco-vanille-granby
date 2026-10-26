// Docker HEALTHCHECK: shallow liveness (process up, no database), so a database outage
// does not make Docker restart the app (17 §1.1). The deep check (/svc/health/) is for
// deploy.sh and the uptime monitor.
//   web | studio | all → GET /svc/health/?shallow=1 (src/proxy.js lets it through on every host and role)
//   worker             → no HTTP server: healthy while the container runs
import http from 'node:http'

const role = process.env.APP_ROLE || 'web'
if (role === 'worker') process.exit(0)

const port = Number(process.env.PORT || (role === 'studio' ? 3001 : 3000))
const req = http.get({ host: '127.0.0.1', port, path: '/svc/health/?shallow=1', headers: { 'user-agent': 'coco-healthcheck/1' }, timeout: 4000 }, (res) => {
  res.resume()
  process.exit(res.statusCode === 200 ? 0 : 1)
})
req.on('timeout', () => req.destroy(new Error('timeout')))
req.on('error', () => process.exit(1))
