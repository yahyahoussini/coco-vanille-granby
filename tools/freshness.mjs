#!/usr/bin/env node
// scripts/freshness.mjs — what is stale (Layers 10.8, 13, 21): pages whose last update is older than N days, statistics and prices that
// carry an old year, pages without a visible date, and the refresh queue in order of importance (pillar → clusters → the rest).
// Freshness is a ranking signal for price/date queries and a citation signal for AI engines (they prefer the recent, dated passage).
// Usage: node freshness.mjs [site] [--config site.config.json] [--days 180] [--crawl crawl/example.ma.json] [--out docs/refresh-queue.md]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { loadConfig, parseArgs, walkHtml, fileToPath, c, isoDate } from "./lib.mjs";
import { profilePage } from "./extract.mjs";

const args = parseArgs(process.argv.slice(2));
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const root = args._[0] ?? cfg?.root ?? "site";
const maxAge = +(args.days ?? 180);
const now = new Date(), thisYear = now.getFullYear();
const typeOf = new Map((cfg?.pages ?? []).map((p) => [p.path, p.type]));
const weight = (path) => ({ home: 0, pillar: 1, cluster: 2, service: 2, city: 3 }[typeOf.get(path) ?? ""] ?? 4);
const STAT_RE = /\b(en|depuis|de|pour|année|في|سنة|منذ)\s+(20[1-3]\d)\b|\b(20[1-3]\d)\s*[:)]|\(\s*(20[1-3]\d)\s*\)|(?:chiffres|données|statistiques|étude|rapport|prix|tarifs?)\s+(?:de\s+)?(20[1-3]\d)/gi;

let pages = [], skippedDrafts = 0;
if (args.crawl) { for (const p of JSON.parse(readFileSync(args.crawl, "utf8")).pages) if (p.status === 200) pages.push({ path: new URL(p.url).pathname, dateModified: p.dateModified, latestYear: p.latestYear, years: [], words: p.words, title: p.title }); }
else {
  if (!existsSync(root)) { console.error(`No site root ${root}`); process.exit(1); }
  for (const f of walkHtml(root)) { const html = readFileSync(f, "utf8"); if (/\[\[FACT NEEDED/.test(html) && args["skip-drafts"]) { skippedDrafts++; continue; } const p = profilePage(html, { url: (cfg?.site ?? "https://x") + fileToPath(root, f) }); const oldYears = [...p.text.matchAll(STAT_RE)].map((m) => +(m[2] ?? m[3] ?? m[4] ?? m[5])).filter((y) => y && y < thisYear - 1); pages.push({ path: fileToPath(root, f), dateModified: p.dateModified, latestYear: p.latestYear, years: [...new Set(oldYears)], words: p.words, title: p.title, noindex: p.noindex }); }
}
const age = (d) => (d ? Math.round((now - new Date(d)) / 86400000) : null);
const rows = pages.filter((p) => !/^\/(404\.html|mentions-legales|confidentialite|cgv)/.test(p.path) && !p.noindex).map((p) => {
  const a = age(p.dateModified);
  const issues = [];
  if (a === null) issues.push("no visible/structured date");
  else if (a > maxAge) issues.push(`last update ${a} days ago`);
  if (p.years.length) issues.push(`old-year statistics: ${p.years.join(", ")}`);
  return { path: p.path, type: typeOf.get(p.path) ?? "", updated: p.dateModified ?? "", age_days: a ?? "", old_years: p.years.join(" "), issues: issues.join("; "), w: weight(p.path) };
}).filter((r) => r.issues).sort((a, b) => a.w - b.w || (b.age_days || 9999) - (a.age_days || 9999));
console.log(c.bold(`Freshness of ${pages.length} pages (threshold ${maxAge} days, current year ${thisYear})${skippedDrafts ? c.dim(` — ${skippedDrafts} draft page(s) with [[FACT NEEDED]] skipped`) : ""}`));
if (!rows.length) console.log(c.green("Nothing stale."));
else console.table(rows.map(({ path, type, updated, age_days, old_years, issues }) => ({ path, type, updated, age_days, old_years, issues })));
const md = [`# File de rafraîchissement — ${isoDate()} (freshness.mjs, seuil ${maxAge} jours)`, "", "Une mise à jour = un fait nouveau daté, un chiffre actualisé avec sa source, une date `<time>` + `dateModified` changées, puis IndexNow. Jamais une date changée sans contenu changé.", "", "| Page | Type | Dernière maj | Âge (j) | Années anciennes | À faire |", "|---|---|---|---|---|---|", ...rows.map((r) => `| ${r.path} | ${r.type} | ${r.updated || "—"} | ${r.age_days || "—"} | ${r.old_years || "—"} | ${r.issues} |`)];
const out = args.out ?? "docs/refresh-queue.md";
try { writeFileSync(out, md.join("\n") + "\n"); console.log(c.dim(`written ${out}`)); } catch {}
process.exit(rows.some((r) => r.w <= 1) ? 1 : 0);
