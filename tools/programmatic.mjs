#!/usr/bin/env node
// scripts/programmatic.mjs — pages generated from data WITHOUT becoming doorways (Layers 6.3, 9.4, 12.6): one page per row of a CSV
// (a car model, a treatment, a route, a quartier with its own facts), rendered from a template with {{field}} placeholders, then
// refused when it is not different enough — a row must carry its own facts (≥ --min-unique-fields distinct values vs every sibling)
// and its own text (--text column, ≥ --min-words words, written per row, not templated), and the rendered page must stay under the
// near-duplicate threshold (5-word shingles, Jaccard ≤ 0.6 against every sibling — the same test audit.mjs runs). Google names
// "pages for every city/variation with the same content" as scaled content abuse; this script makes that impossible by construction.
// Usage: node programmatic.mjs data.csv --template templates/page-model.html --type cluster --path-prefix /voitures/ [--lang fr]
//        [--text texte_unique] [--min-words 120] [--min-unique-fields 3] [--root site] [--config site.config.json] [--dry-run] [--force]
// CSV columns: slug, title, description, h1 (+ any fields the template uses: prix, places, photo, …), and the unique-text column.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { loadConfig, parseArgs, csvObjects, stripTags, wordCount, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const file = args._[0];
if (!file || !existsSync(file) || !args.template || !existsSync(args.template)) { console.error("Usage: node programmatic.mjs data.csv --template templates/page-x.html --path-prefix /x/ [--type cluster]"); process.exit(1); }
const cfgPath = args.config ?? "site.config.json";
const cfg = loadConfig(cfgPath);
const root = args.root ?? cfg.root ?? "site";
const lang = args.lang ?? "fr", prefix = (args["path-prefix"] ?? "/").replace(/\/?$/, "/");
const textCol = (args.text ?? "texte_unique").toLowerCase(), minWords = +(args["min-words"] ?? 120), minUnique = +(args["min-unique-fields"] ?? 3);
const rows = csvObjects(readFileSync(file, "utf8"));
const template = readFileSync(args.template, "utf8");
const langPrefix = lang === cfg.languages.default ? "" : `/${lang}`;
const shingles = (text) => { const w = text.toLowerCase().split(/\s+/).filter(Boolean); const s = new Set(); for (let i = 0; i + 5 <= w.length; i++) s.add(w.slice(i, i + 5).join(" ")); return s; };
const jaccard = (a, b) => { if (!a.size || !b.size) return 0; let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n); };

const rendered = [], rejected = [];
const fieldCols = Object.keys(rows[0] ?? {}).filter((k) => !["slug", "title", "description", "h1", textCol].includes(k));
for (const r of rows) {
  const reasons = [];
  if (!r.slug) reasons.push("no slug");
  const uniqueText = r[textCol] ?? "";
  if (wordCount(uniqueText) < minWords) reasons.push(`unique text ${wordCount(uniqueText)} words < ${minWords} (column ${textCol})`);
  // doorway test: against its CLOSEST sibling, how many things differ? (data fields with a different value + the unique text when it really is different)
  const mySh = shingles(uniqueText);
  let closest = null;
  for (const o of rows) { if (o === r) continue; const diff = fieldCols.filter((k) => (r[k] ?? "") !== (o[k] ?? "")); const textDiff = jaccard(mySh, shingles(o[textCol] ?? "")) < 0.3 ? 1 : 0; const n = diff.length + textDiff; if (!closest || n < closest.n) closest = { n, slug: o.slug, diff, textDiff }; }
  if (closest && closest.n < minUnique) reasons.push(`differs from ${closest.slug} by only ${closest.n} element(s) (${[...closest.diff, ...(closest.textDiff ? ["text"] : [])].join(", ") || "nothing"}) < ${minUnique}`);
  if (/\[\[FACT NEEDED/.test(Object.values(r).join(" "))) reasons.push("row contains [[FACT NEEDED]]");
  let html = template;
  for (const [k, v] of Object.entries(r)) html = html.replaceAll(`{{${k}}}`, v);
  html = html.replaceAll("{{path}}", `${langPrefix}${prefix}${r.slug}/`).replaceAll("{{site}}", cfg.site).replaceAll("{{lang}}", lang);
  const left = html.match(/{{[a-z0-9_]+}}/gi);
  if (left) reasons.push(`unfilled placeholders: ${[...new Set(left)].join(" ")}`);
  const text = stripTags(html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html);
  rendered.push({ r, html, text, sh: shingles(text), reasons, path: `${langPrefix}${prefix}${r.slug}/` });
}
for (const a of rendered) { for (const b of rendered) { if (a === b) continue; const j = jaccard(a.sh, b.sh); if (j > 0.6) a.reasons.push(`near-duplicate of ${b.r.slug} (${Math.round(100 * j)} % shared 5-word shingles)`); } }
let written = 0;
const pages = cfg.pages ?? [];
for (const p of rendered) {
  if (p.reasons.length) { rejected.push({ slug: p.r.slug, reasons: [...new Set(p.reasons)].join("; ") }); continue; }
  const out = join(root, p.path, "index.html");
  if (existsSync(out) && !args.force) { rejected.push({ slug: p.r.slug, reasons: "exists (use --force)" }); continue; }
  if (!args["dry-run"]) {
    mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, p.html); written++;
    if (!pages.some((x) => x.path === p.path)) pages.push({ path: p.path, type: args.type ?? "cluster", title: { [lang]: p.r.title }, description: { [lang]: p.r.description ?? "" }, h1: { [lang]: p.r.h1 ?? p.r.title }, published: new Date().toISOString().slice(0, 10), updated: new Date().toISOString().slice(0, 10), programmatic: true });
  }
}
if (!args["dry-run"] && written) { cfg.pages = pages; writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n"); }
console.log(c.bold(`Programmatic pages from ${file}: ${rows.length} rows → ${written} written${args["dry-run"] ? " (dry-run: none)" : ""}, ${rejected.length} refused`));
if (rejected.length) console.table(rejected);
console.log(c.dim(`Refused rows are not doorways yet: give each its own facts and its own ${minWords}-word text, then rerun. Then: npm run pages (for /ar/ mirrors if configured), npm run gate, links from the pillar to each page.`));
process.exit(rejected.length && !written ? 1 : 0);
