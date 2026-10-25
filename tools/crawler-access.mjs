#!/usr/bin/env node
// scripts/crawler-access.mjs — what each search/AI crawler actually receives (Layer 14 + the #1 unknown unknown: the CDN).
// Fetches each URL with each crawler's User-Agent, compares with robots.txt, and flags edge blocks and challenge pages.
// Usage:
//   node crawler-access.mjs https://x.ma/ https://x.ma/pillar/        (tier-1 crawlers)
//   node crawler-access.mjs --sitemap https://x.ma/sitemap.xml --max 5 --all
//   options: --all (include tier-2 crawlers)  --json crawler-report.json
import { writeFileSync } from "node:fs";
import { parseArgs, fetchText, CRAWLERS, uaString, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let urls = args._;
if (args.sitemap) {
  const sm = await fetchText(args.sitemap);
  urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).slice(0, +(args.max ?? 5));
}
if (!urls.length) { console.error("Usage: node crawler-access.mjs <url...> | --sitemap <sitemap-url> [--max 5] [--all]"); process.exit(1); }
const bots = CRAWLERS.filter((b) => (args.all || b.tier === 1) && !b.tokenOnly); // Google-Extended / Applebot-Extended are robots.txt tokens, not fetching agents

// ---------- robots.txt parser (Google-style: longest match wins, * and $ wildcards, group by UA token) ----------
function parseRobots(text) {
  const groups = []; let cur = null;
  const signals = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === "user-agent") {
      if (cur && cur.rules.length === 0 && cur.open) cur.agents.push(val.toLowerCase());
      else { cur = { agents: [val.toLowerCase()], rules: [], open: true }; groups.push(cur); }
    } else if (key === "allow" || key === "disallow") {
      if (cur) { cur.open = false; cur.rules.push({ allow: key === "allow", path: val }); }
    } else if (key === "content-signal") signals.push({ agents: cur?.agents ?? ["*"], value: val });
  }
  return { groups, signals };
}
function robotsAllows(robots, ua, path) {
  const token = ua.toLowerCase();
  // most specific group wins: the longest agent token that is a prefix of the UA token (Google's matching rule)
  let group = null, bestLen = -1;
  for (const g of robots.groups) for (const a of g.agents) if (a !== "*" && token.startsWith(a) && a.length > bestLen) { bestLen = a.length; group = g; }
  if (!group) group = robots.groups.find((g) => g.agents.includes("*"));
  if (!group) return { allowed: true, rule: "(no group)" };
  let best = null;
  for (const r of group.rules) {
    if (r.path === "") continue;
    const re = new RegExp("^" + r.path.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (re.test(path) && (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow))) best = r;
  }
  return best ? { allowed: best.allow, rule: `${best.allow ? "Allow" : "Disallow"}: ${best.path}` } : { allowed: true, rule: "(default allow)" };
}

const origin = new URL(urls[0]).origin;
let robots = { groups: [], signals: [] }, robotsStatus = 0;
try { const r = await fetchText(`${origin}/robots.txt`); robotsStatus = r.status; if (r.status === 200) robots = parseRobots(r.text); } catch {}
console.log(`robots.txt: HTTP ${robotsStatus}${robots.signals.length ? ` | Content-Signal: ${robots.signals.map((s) => s.value).join(" ; ")}` : " | no Content-Signal line"}`);

const results = [];
for (const url of urls) {
  const path = new URL(url).pathname;
  console.log(`\n${c.bold(url)}`);
  for (const b of bots) {
    const rb = robotsAllows(robots, b.ua, path);
    let status = 0, bytes = 0, hasTitle = false, server = "", verdict = "";
    try {
      const r = await fetchText(url, { ua: uaString(b.ua), timeoutMs: 15000 });
      status = r.status; bytes = Buffer.byteLength(r.text); hasTitle = /<title[^>]*>[^<]{3,}/i.test(r.text);
      server = r.headers.get("server") ?? ""; if (r.headers.get("cf-ray")) server += " (cloudflare)";
      if (/cf-mitigated|challenge-platform|Just a moment|Attention Required|Enable JavaScript and cookies/i.test(r.text)) verdict = "CHALLENGE PAGE";
    } catch (e) { verdict = `ERROR ${e.message}`; }
    if (!verdict) {
      if (!rb.allowed) verdict = "blocked by robots.txt";
      else if ([401, 403, 429, 503].includes(status)) verdict = "BLOCKED AT EDGE (robots allows, server refuses)";
      else if (status === 200 && (!hasTitle || bytes < 800)) verdict = "SUSPICIOUS (200 but tiny/no title: JS challenge or empty shell?)";
      else if (status === 200) verdict = "ok";
      else verdict = `HTTP ${status}`;
    }
    const bad = /BLOCKED|CHALLENGE|SUSPICIOUS|ERROR/.test(verdict);
    const badRobots = !rb.allowed;
    console.log(`  ${bad ? c.red("✗") : badRobots ? c.yellow("!") : c.green("✓")} ${b.ua.padEnd(22)} HTTP ${String(status).padEnd(4)} ${String(bytes).padStart(7)} B  ${rb.rule.padEnd(22)} ${verdict}${server ? c.dim("  " + server) : ""}`);
    results.push({ url, ua: b.ua, owner: b.owner, status, bytes, robots: rb.rule, verdict });
  }
}
const blocked = results.filter((r) => /BLOCKED|CHALLENGE|SUSPICIOUS|ERROR|robots/.test(r.verdict));
console.log(`\n${results.length} checks, ${blocked.length ? c.red(blocked.length + " problem(s)") : c.green("no blocks")}.`);
if (blocked.some((r) => /EDGE|CHALLENGE|SUSPICIOUS/.test(r.verdict))) console.log("Edge blocks come from the CDN/WAF (e.g. Cloudflare 'Block AI bots' / AI Crawl Control / Bot Fight Mode) or a security plugin — not from robots.txt. Fix it there.");
if (args.json) writeFileSync(args.json, JSON.stringify({ robotsStatus, signals: robots.signals, results, generated: new Date().toISOString() }, null, 2));
process.exit(blocked.length ? 1 : 0);
