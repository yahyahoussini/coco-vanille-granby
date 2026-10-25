#!/usr/bin/env node
// scripts/log-bots.mjs — proof that the engines read you (Layer 17.6): hits per crawler per page from access logs.
// Accepts Apache/Nginx combined log format (also .gz not supported: gunzip first). Cloudflare/Netlify: export logs as text first.
// Usage: node log-bots.mjs access.log [access.log.1 ...] [--paths /,/pillar/] [--top 10] [--verify] [--week] 
//   --verify : reverse-DNS + forward-confirm a sample of IPs per crawler (Googlebot → googlebot.com/google.com, Bingbot → search.msn.com,
//              Applebot → applebot.apple.com; OpenAI/Anthropic/Perplexity publish IP lists instead — their hostnames are reported as-is).
//   --week   : hits per crawler per ISO week (are they coming back more often since the last publication?)
import { readFileSync } from "node:fs";
import { promises as dns } from "node:dns";
import { parseArgs, CRAWLERS, c, isoWeek } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args._.length) { console.error("Usage: node log-bots.mjs access.log [...] [--paths /,/pillar/]"); process.exit(1); }
const focus = args.paths ? String(args.paths).split(",").map((s) => s.trim()) : null;
const top = +(args.top ?? 10);

// combined: IP - - [date] "METHOD path HTTP/x" status bytes "referer" "ua"
const LINE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]*" (\d{3}) (\S+) "[^"]*" "([^"]*)"/;
const bots = CRAWLERS.map((b) => b.ua);
const other = ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "YandexBot", "DuckDuckBot", "facebookexternalhit", "Twitterbot", "LinkedInBot", "WhatsApp"];
const counts = new Map(); // bot -> { total, status:{}, paths: Map, days:Set }
let lines = 0, matched = 0, humans = 0;
for (const f of args._) {
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    if (!line) continue;
    lines++;
    const m = line.match(LINE);
    if (!m) continue;
    matched++;
    const [, ip, date, , path, status, , ua] = m;
    const bot = [...bots, ...other].find((b) => ua.toLowerCase().includes(b.toLowerCase()));
    if (!bot) { humans++; continue; }
    const cleanPath = path.replace(/\?.*$/, "");
    if (focus && !focus.includes(cleanPath)) continue;
    const e = counts.get(bot) ?? { total: 0, status: {}, paths: new Map(), days: new Set(), ips: new Set(), weeks: new Map() };
    e.total++; e.status[status] = (e.status[status] ?? 0) + 1; e.paths.set(cleanPath, (e.paths.get(cleanPath) ?? 0) + 1); e.days.add(date.slice(0, 11)); e.ips.add(ip);
    if (args.week) { const d = new Date(date.replace(/^(\d+)\/(\w+)\/(\d+):/, "$2 $1 $3 ")); if (!isNaN(d)) e.weeks.set(isoWeek(d), (e.weeks.get(isoWeek(d)) ?? 0) + 1); }
    counts.set(bot, e);
  }
}
console.log(`${lines} lines, ${matched} parsed, ${humans} non-bot hits${focus ? `, focus on ${focus.join(", ")}` : ""}`);
const table = [...counts.entries()].map(([bot, e]) => ({ bot, hits: e.total, days: e.days.size, ips: e.ips.size, "2xx": Object.entries(e.status).filter(([s]) => s.startsWith("2")).reduce((a, [, n]) => a + n, 0), "3xx": Object.entries(e.status).filter(([s]) => s.startsWith("3")).reduce((a, [, n]) => a + n, 0), "4xx/5xx": Object.entries(e.status).filter(([s]) => /^[45]/.test(s)).reduce((a, [, n]) => a + n, 0) })).sort((a, b) => b.hits - a.hits);
console.table(table);
for (const [bot, e] of [...counts.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, top)) {
  const topPaths = [...e.paths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p, n]) => `${p} (${n})`).join(", ");
  console.log(`${c.bold(bot.padEnd(22))} ${topPaths}`);
}
if (args.week) { const weeks = [...new Set([...counts.values()].flatMap((e) => [...e.weeks.keys()]))].sort(); console.log("\nHits per week:"); console.table([...counts.entries()].map(([bot, e]) => Object.fromEntries([["bot", bot], ...weeks.map((w) => [w, e.weeks.get(w) ?? 0])]))); }
if (args.verify) {
  const EXPECT = { Googlebot: /\.(googlebot|google)\.com$/, "Google-Extended": /\.(googlebot|google)\.com$/, Bingbot: /\.search\.msn\.com$/, Applebot: /\.applebot\.apple\.com$/, YandexBot: /\.yandex\.(ru|net|com)$/, DuckDuckBot: /duckduckgo\.com$/ };
  console.log("\nReverse DNS on up to 5 IPs per crawler (spoofed user agents fail this test):");
  for (const [bot, e] of counts) {
    const sample = [...e.ips].slice(0, 5); const res = [];
    for (const ip of sample) { try { const hosts = await dns.reverse(ip); const h = hosts[0] ?? ""; let fwd = false; try { const a = await dns.lookup(h); fwd = a.address === ip; } catch {} const exp = EXPECT[bot]; res.push({ ip, host: h, ok: exp ? exp.test(h) && fwd : null }); } catch { res.push({ ip, host: "(no PTR)", ok: EXPECT[bot] ? false : null }); } }
    const bad = res.filter((r) => r.ok === false).length;
    console.log(`  ${bad ? c.red("✗") : EXPECT[bot] ? c.green("✓") : c.dim("·")} ${bot.padEnd(20)} ${res.map((r) => `${r.ip} → ${r.host}${r.ok === false ? " (FAKE?)" : ""}`).join(", ")}`);
  }
}
const expected = ["Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "PerplexityBot", "ClaudeBot"];
const missing = expected.filter((b) => !counts.has(b));
if (missing.length) console.log(`\n${c.yellow("!")} no hits from: ${missing.join(", ")}. If robots.txt allows them, check the CDN/WAF bot settings (run crawler-access.mjs).`);
const blocked = [...counts.entries()].filter(([, e]) => (e.status["403"] ?? 0) + (e.status["429"] ?? 0) + (e.status["503"] ?? 0) > e.total * 0.3);
for (const [bot, e] of blocked) console.log(`${c.red("✗")} ${bot}: ${Math.round((100 * ((e.status["403"] ?? 0) + (e.status["429"] ?? 0) + (e.status["503"] ?? 0))) / e.total)}% of its requests are refused (403/429/503)`);
if (!args.verify) console.log(c.dim("Add --verify to reverse-DNS the IPs (a surprising Googlebot count is often a scraper with a fake user agent)."));
process.exit(missing.length || blocked.length ? 1 : 0);
