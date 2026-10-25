#!/usr/bin/env node
// scripts/indexnow.mjs — tell Bing (the index behind ChatGPT search and Copilot), Yandex, Naver, Seznam and Yep that URLs changed.
// Google does NOT use IndexNow: request Google indexing in Search Console (URL inspection) after publishing.
// Usage:
//   node indexnow.mjs https://x.ma/prix/ https://x.ma/ar/prix/        submit URLs
//   node indexnow.mjs --sitemap site/sitemap.xml                       submit every URL in a local or remote sitemap
//   node indexnow.mjs --changed changed.txt                            one URL per line
//   options: --config site.config.json (host + key)  --key <key>  --dry-run
// Setup: put a 32+ hex key in site.config.json → indexnow.key; generate.mjs writes <key>.txt at the site root.
import { readFileSync, existsSync } from "node:fs";
import { loadConfig, parseArgs, fetchText } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let cfg = null;
try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const key = args.key ?? cfg?.indexnow?.key ?? process.env.INDEXNOW_KEY;
if (!key) { console.error("No IndexNow key. Set indexnow.key in site.config.json (32-128 hex chars) or pass --key."); process.exit(1); }

let urls = [...args._];
if (args.sitemap) {
  const text = existsSync(args.sitemap) ? readFileSync(args.sitemap, "utf8") : (await fetchText(args.sitemap)).text;
  urls.push(...[...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
}
if (args.changed) urls.push(...readFileSync(args.changed, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean));
urls = [...new Set(urls)];
if (!urls.length) { console.error("Nothing to submit. Pass URLs, --sitemap or --changed."); process.exit(1); }

const host = new URL(urls[0]).host;
if (urls.some((u) => new URL(u).host !== host)) { console.error("All URLs must share one host per request."); process.exit(1); }
const body = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls.slice(0, 10000) };
if (args["dry-run"]) { console.log(JSON.stringify(body, null, 2)); process.exit(0); }

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body),
});
const meaning = { 200: "OK", 202: "accepted (key validation pending)", 400: "bad request (check JSON)", 403: "forbidden (key file not found or mismatch at keyLocation)", 422: "URLs do not belong to the host or key invalid", 429: "too many requests" }[res.status] ?? "";
console.log(`IndexNow ${res.status} ${meaning} — ${urls.length} URL(s) for ${host}`);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
