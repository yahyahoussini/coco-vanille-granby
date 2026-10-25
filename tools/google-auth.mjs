// scripts/google-auth.mjs — service-account access tokens for Google APIs (Search Console, GA4 Data API) with zero dependencies.
// Setup (human, docs/12): Google Cloud → create a service account → JSON key → save as ./google-service-account.json (never commit it)
//   → add the service-account e-mail as a user on the Search Console property (Full or Restricted) and as Viewer on the GA4 property
//   → enable "Google Search Console API" and "Google Analytics Data API" on the Cloud project.
import { readFileSync, existsSync } from "node:fs";
import { createSign } from "node:crypto";

const cache = new Map();

export function loadServiceAccount(path = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "google-service-account.json") {
  if (!existsSync(path)) throw new Error(`Service-account key not found (${path}). See docs/12-setup-mesure.md → "API".`);
  const sa = JSON.parse(readFileSync(path, "utf8"));
  if (!sa.client_email || !sa.private_key) throw new Error("Invalid service-account JSON (needs client_email and private_key).");
  return sa;
}

const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

export async function accessToken(scope, saPath) {
  const key = `${saPath ?? ""}|${scope}`;
  const hit = cache.get(key);
  if (hit && hit.exp > Date.now() / 1000 + 60) return hit.token;
  const sa = loadServiceAccount(saPath);
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: sa.client_email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const assertion = `${header}.${claims}.${b64url(signer.sign(sa.private_key))}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(json).slice(0, 300)}`);
  cache.set(key, { token: json.access_token, exp: now + (json.expires_in ?? 3600) });
  return json.access_token;
}

export async function googleJson(url, { scope, method = "GET", body, saPath } = {}) {
  const token = await accessToken(scope, saPath);
  const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${url} → HTTP ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  return json;
}

export const SCOPES = {
  gsc: "https://www.googleapis.com/auth/webmasters.readonly",
  ga4: "https://www.googleapis.com/auth/analytics.readonly",
};
