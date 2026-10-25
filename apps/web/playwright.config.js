import dns from 'node:dns'
import { defineConfig, devices } from '@playwright/test'

// End-to-end tests against a running server (CI starts it with APP_ROLE=all; see .github/workflows/ci.yml).
//   E2E_PUBLIC_URL  public host  (default PUBLIC_ORIGIN, then http://localhost:3000)
//   E2E_ADMIN_URL   admin host   (default ADMIN_ORIGIN, then http://admin.localhost:3000)
// Projects: "public" runs everything except Studio specs; "admin" runs test/e2e/studio/** and *.admin.spec.js.
export const PUBLIC_URL = (process.env.E2E_PUBLIC_URL || process.env.PUBLIC_ORIGIN || 'http://localhost:3000').replace(/\/$/, '')
export const ADMIN_URL = (process.env.E2E_ADMIN_URL || process.env.ADMIN_ORIGIN || 'http://admin.localhost:3000').replace(/\/$/, '')

// Chromium resolves *.localhost by itself; Node (the `request` fixture) does not.
// Map *.localhost to loopback for Node-side requests too, in the runner and in every worker.
if (!dns.lookup.__cocoLocalhost) {
  const lookup = dns.lookup
  const patched = function (hostname, options, callback) {
    if (typeof hostname === 'string' && (hostname === 'localhost' || hostname.endsWith('.localhost'))) hostname = '127.0.0.1'
    return lookup.call(this, hostname, options, callback)
  }
  patched.__cocoLocalhost = true
  dns.lookup = patched
}

const STUDIO = ['**/studio/**/*.spec.js', '**/*.admin.spec.js']

export default defineConfig({
  testDir: './test/e2e',
  outputDir: './test-results/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './playwright-report' }],
    ['json', { outputFile: './test-results/e2e-results.json' }],
  ],
  use: {
    locale: 'fr-CA',
    timezoneId: 'America/Toronto',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'public',
      testIgnore: STUDIO,
      use: { ...devices['Desktop Chrome'], baseURL: PUBLIC_URL },
    },
    {
      name: 'admin',
      testMatch: STUDIO,
      use: { ...devices['Desktop Chrome'], baseURL: ADMIN_URL, locale: 'fr-CA' },
    },
  ],
})
