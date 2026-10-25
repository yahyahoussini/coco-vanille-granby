#!/usr/bin/env node
// scripts/links.mjs — internal link graph (Layers 9 and 11): inbound counts, orphans, depth from home, broken links, generic anchors.
// Usage: node links.mjs site [--config site.config.json] [--min 3] [--depth 3] [--json links-report.json]
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { loadConfig, parseArgs, walkHtml, fileToPath, pathToFile, allTags, attr, stripTags, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const root = args._[0];
if (!root || !existsSync(root)) { console.error("Usage: node links.mjs <site-dir> [--min 3] [--depth 3]"); process.exit(1); }
const cfg = loadConfig(args.config ?? "site.config.json");
const MIN = +(args.min ?? 3), MAXDEPTH = +(args.depth ?? 3);
const site = cfg.site;
const otherLangs = cfg.languages.others ?? [];
const GENERIC = /^(cliquez ici|click here|ici|here|en savoir plus|lire la suite|read more|plus|voir|lien|اضغط هنا|المزيد|هنا)$/i;

const normalize = (href) => {
  let h = href.trim();
  if (h.startsWith(site)) h = h.slice(site.length) || "/";
  if (!h.startsWith("/") || h.startsWith("//")) return null; // external, mailto, tel, wa.me...
  h = h.replace(/[#?].*$/, "");
  if (!h.endsWith("/") && !/\.[a-z0-9]+$/i.test(h)) h += "/";
  return h;
};

const pages = new Map(); // path -> { out:Set, in:Set, anchors:[] , file }
for (const file of walkHtml(root)) pages.set(fileToPath(root, file), { out: new Set(), in: new Set(), anchors: [], broken: [], file });

for (const [path, p] of pages) {
  const html = readFileSync(p.file, "utf8");
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(`<a ${m[1]}>`, "href");
    if (!href) continue;
    const t = normalize(href);
    if (!t) continue;
    const text = stripTags(m[2]);
    if (GENERIC.test(text)) p.anchors.push(text);
    if (t === path) continue;
    const exists = pages.has(t) || existsSync(pathToFile(root, t)) || (t.endsWith("/") && existsSync(pathToFile(root, t.slice(0, -1))));
    if (!exists) { p.broken.push(href); continue; }
    p.out.add(t);
    pages.get(t)?.in.add(path);
  }
}

// depth via BFS from each language home
const depth = new Map();
const homes = ["/", ...otherLangs.map((l) => `/${l}/`)].filter((h) => pages.has(h));
for (const h of homes) depth.set(h, 0);
const queue = [...homes];
while (queue.length) {
  const cur = queue.shift();
  for (const n of pages.get(cur)?.out ?? []) if (!depth.has(n)) { depth.set(n, depth.get(cur) + 1); queue.push(n); }
}

const isUtility = (p) => /(404|mentions|confidentialite|privacy|legal|cgv|cookies)/.test(p);
const rows = [...pages.entries()].map(([path, p]) => ({
  path, inbound: p.in.size, outbound: p.out.size, depth: depth.has(path) ? depth.get(path) : "∞", broken: p.broken.length, generic: p.anchors.length,
}));
console.table(rows.sort((a, b) => a.inbound - b.inbound));

let fails = 0, warns = 0;
for (const r of rows) {
  const p = pages.get(r.path);
  if (r.broken) { fails++; console.log(`${c.red("✗")} ${r.path}: ${r.broken} broken internal link(s): ${p.broken.slice(0, 3).join(", ")}`); }
  if (r.depth === "∞" && !/404/.test(r.path)) { fails++; console.log(`${c.red("✗")} ${r.path}: not reachable from home`); }
  else if (r.depth !== "∞" && r.depth > MAXDEPTH && !isUtility(r.path)) { warns++; console.log(`${c.yellow("!")} ${r.path}: ${r.depth} clicks from home (max ${MAXDEPTH})`); }
  if (r.inbound < MIN && !isUtility(r.path) && !homes.includes(r.path)) { warns++; console.log(`${c.yellow("!")} ${r.path}: ${r.inbound} inbound internal link(s) (min ${MIN})`); }
  if (r.generic) { warns++; console.log(`${c.yellow("!")} ${r.path}: generic anchor text: ${[...new Set(p.anchors)].slice(0, 3).join(", ")}`); }
  if (r.outbound === 0 && !isUtility(r.path)) { warns++; console.log(`${c.yellow("!")} ${r.path}: no outbound internal links`); }
}
// Layer 9.3: every cluster links to the pillar and to two sibling clusters; the pillar links to every cluster (per language)
const typed = (cfg.pages ?? []).filter((p) => p.type);
const pathsOf = (p) => [p.path, ...Object.values(p.alt ?? {})];
for (const lang of [cfg.languages.default, ...otherLangs]) {
  const inLang = (path) => (lang === cfg.languages.default ? !otherLangs.some((l) => path.startsWith(`/${l}/`)) : path.startsWith(`/${lang}/`));
  const pillar = typed.filter((p) => p.type === "pillar").flatMap(pathsOf).find((x) => inLang(x) && pages.has(x));
  const clusters = typed.filter((p) => ["cluster", "service", "city", "comparison", "study"].includes(p.type)).flatMap(pathsOf).filter((x) => inLang(x) && pages.has(x));
  if (!pillar || clusters.length < 2) continue;
  for (const cl of clusters) {
    const out = pages.get(cl).out;
    if (!out.has(pillar)) { warns++; console.log(`${c.yellow("!")} ${cl}: does not link to the pillar ${pillar} (Layer 9.3)`); }
    const siblings = clusters.filter((x) => x !== cl && out.has(x)).length;
    if (siblings < Math.min(2, clusters.length - 1)) { warns++; console.log(`${c.yellow("!")} ${cl}: links to ${siblings} sibling cluster(s) (Layer 9.3: two)`); }
  }
  for (const cl of clusters) if (!pages.get(pillar).out.has(cl)) { warns++; console.log(`${c.yellow("!")} ${pillar}: does not link to cluster ${cl} (Layer 9.3: the pillar links to every cluster)`); }
}
console.log(`\n${rows.length} pages: ${fails ? c.red(fails + " FAIL") : c.green("0 FAIL")}, ${warns ? c.yellow(warns + " WARN") : "0 WARN"}`);
if (args.json) writeFileSync(args.json, JSON.stringify({ rows, generated: new Date().toISOString() }, null, 2));
process.exit(fails ? 1 : 0);
