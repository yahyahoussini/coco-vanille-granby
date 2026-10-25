#!/usr/bin/env node
// scripts/crawl.mjs — live crawler for one site: your own (UPGRADE baseline: orphans, thin pages, duplicates, chains) or a
// competitor's (market map: how many pages, which topics, formats, freshness, schema, questions they answer). Layers 7.5, 9, 18.
// Usage:
//   node crawl.mjs https://competitor.ma/ [--max 150] [--sitemap https://competitor.ma/sitemap.xml] [--include /blog/]
//                  [--concurrency 4] [--delay 250] [--depth 6] [--out crawl/competitor.ma.json] [--csv] [--no-robots] [--keep-query]
// Respects robots.txt ("*" group) unless --no-robots; identifies as rank-first-crawl. Stores a compact profile per page (extract.mjs), never the full text.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs, fetchText, toCsv, c } from "./lib.mjs";
import { profilePage, summarize, termFrequency } from "./extract.mjs";

const args = parseArgs(process.argv.slice(2));
const starts = args._.filter((a) => /^https?:\/\//.test(a));
if (args.sitemap !== undefined && typeof args.sitemap !== "string") { console.error("--sitemap needs a URL"); process.exit(1); }
if (!starts.length && !args.sitemap) { console.error("Usage: node crawl.mjs https://site.ma/ [--sitemap URL] [--max N] [--out file.json]"); process.exit(1); }
const first = starts[0] ?? args.sitemap;
const origin = new URL(first);
const hostKey = (h) => h.replace(/^www\./, "").toLowerCase();
const HOST = hostKey(origin.host);
const MAX = +(args.max ?? 150), CONC = +(args.concurrency ?? 4), DELAY = +(args.delay ?? 250), DEPTH = +(args.depth ?? 6);
const UA = `Mozilla/5.0 (compatible; rank-first-crawl/1.0; +https://github.com/) ${args.ua ?? ""}`.trim();
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|avif|svg|ico|css|js|mjs|json|xml|txt|zip|rar|7z|mp4|mp3|webm|woff2?|ttf|eot|docx?|xlsx?|pptx?)(\?.*)?$/i;
const TRACKING = /^(utm_|gclid|fbclid|msclkid|mc_|ref$|source$)/i;
// --alias prod.ma : links that point at the production host are followed on the crawled (staging/local) host
const ALIASES = new Set(String(args.alias ?? "").split(",").map((a) => hostKey(a.trim())).filter(Boolean));

function normalize(href, base) {
  let u; try { u = new URL(href, base); } catch { return null; }
  if (!/^https?:$/.test(u.protocol)) return null;
  if (ALIASES.has(hostKey(u.host))) { u.protocol = origin.protocol; u.host = origin.host; }
  if (hostKey(u.host) !== HOST) return null;
  u.hash = "";
  if (args["keep-query"]) { for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k); } else u.search = "";
  if (SKIP_EXT.test(u.pathname)) return null;
  if (args.include && !u.pathname.startsWith(args.include)) return null;
  return u.toString();
}

// ---------- robots.txt ("*" group; rank-first-crawl has no rules of its own on any site) ----------
async function robotsDisallow() {
  if (args["no-robots"]) return [];
  try {
    const r = await fetchText(`${origin.protocol}//${origin.host}/robots.txt`, { ua: UA, timeoutMs: 10000 });
    if (r.status !== 200) return [];
    const groups = []; let cur = null;
    for (const raw of r.text.split(/\r?\n/)) {
      const line = raw.replace(/#.*$/, "").trim(); if (!line) continue;
      const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/); if (!m) continue;
      const k = m[1].toLowerCase(), v = m[2].trim();
      if (k === "user-agent") { if (!cur || cur.rules.length) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(v.toLowerCase()); }
      else if ((k === "disallow" || k === "allow") && cur) cur.rules.push({ k, v });
    }
    const star = groups.find((g) => g.agents.includes("*"));
    return star ? star.rules.filter((r) => r.k === "disallow" && r.v).map((r) => r.v) : [];
  } catch { return []; }
}

async function sitemapUrls(url, seen = new Set(), depth = 0) {
  if (seen.has(url) || depth > 3) return []; seen.add(url);
  try {
    const r = await fetchText(url, { ua: UA, timeoutMs: 20000 });
    if (r.status !== 200) return [];
    const locs = [...r.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);
    if (/<sitemapindex/i.test(r.text)) { const out = []; for (const l of locs.slice(0, 50)) out.push(...(await sitemapUrls(l, seen, depth + 1))); return out; }
    return locs;
  } catch { return []; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const disallow = await robotsDisallow();
  const blocked = (u) => disallow.some((d) => new URL(u).pathname.startsWith(d));
  const smUrls = args.sitemap ? (await sitemapUrls(args.sitemap)).map((u) => normalize(u, first)).filter(Boolean) : [];
  const queue = [];
  const seen = new Set();
  const push = (u, depth) => { if (u && !seen.has(u) && seen.size < MAX * 3) { seen.add(u); queue.push({ url: u, depth }); } };
  for (const s of starts) push(normalize(s, first), 0);
  if (!starts.length) for (const u of smUrls) push(u, 0);
  const pages = new Map(); // url -> record
  const inlinks = new Map(); // url -> Set(from)
  let active = 0, done = 0;

  async function worker() {
    while (queue.length && pages.size < MAX) {
      const { url, depth } = queue.shift();
      if (blocked(url)) { pages.set(url, { url, status: "robots", depth }); continue; }
      active++;
      try {
        const r = await fetchText(url, { ua: UA, timeoutMs: 20000 });
        const finalUrl = r.url && r.url !== url ? normalize(r.url, url) ?? r.url : url;
        const ct = r.headers.get("content-type") ?? "";
        if (r.status !== 200 || !/html/i.test(ct)) { pages.set(url, { url, status: r.status, redirectTo: finalUrl !== url ? finalUrl : undefined, depth }); continue; }
        const p = profilePage(r.text, { url: finalUrl });
        const tf = termFrequency([p.title, p.h1, ...p.headings.map((h) => h.text)].join(". "));
        const topTerms = [...tf.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([t]) => t);
        const out = new Set();
        if (depth < DEPTH) for (const h of p.internalHrefs) { const n = normalize(h, finalUrl); if (n) { out.add(n); push(n, depth + 1); } }
        for (const o of out) { if (!inlinks.has(o)) inlinks.set(o, new Set()); inlinks.get(o).add(finalUrl); }
        pages.set(url, { ...summarize(p), status: 200, depth, redirectTo: finalUrl !== url ? finalUrl : undefined, outlinks: out.size, topTerms, questionsList: p.questions.slice(0, 40) });
      } catch (e) { pages.set(url, { url, status: "error", error: e.message, depth }); }
      finally { active--; done++; if (done % 10 === 0) process.stderr.write(`  ${done} fetched, ${queue.length} queued\r`); await sleep(DELAY); }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));

  // ---------- summary ----------
  const recs = [...pages.values()];
  for (const r of recs) r.inlinks = inlinks.get(r.redirectTo ?? r.url)?.size ?? 0;
  const ok = recs.filter((r) => r.status === 200);
  const count = (pred) => ok.filter(pred).length;
  const dup = (key) => { const m = new Map(); for (const r of ok) { const k = (r[key] ?? "").trim().toLowerCase(); if (k) m.set(k, (m.get(k) ?? 0) + 1); } return [...m.entries()].filter(([, n]) => n > 1); };
  const statusCounts = {}; for (const r of recs) statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  const topicMap = new Map();
  for (const r of ok) for (const t of r.topTerms ?? []) topicMap.set(t, (topicMap.get(t) ?? 0) + 1);
  const topics = [...topicMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
  const schemaHist = {}; for (const r of ok) for (const t of r.schemaTypes ?? []) schemaHist[t] = (schemaHist[t] ?? 0) + 1;
  const byYear = {}; for (const r of ok) { const y = (r.dateModified ?? "").slice(0, 4); if (y) byYear[y] = (byYear[y] ?? 0) + 1; }
  const crawledSet = new Set(ok.map((r) => r.redirectTo ?? r.url));
  const orphans = smUrls.filter((u) => !inlinks.has(u) && !starts.includes(u));
  const notInSitemap = smUrls.length ? ok.map((r) => r.redirectTo ?? r.url).filter((u) => !smUrls.includes(u)) : [];
  const sitemapNotCrawled = smUrls.filter((u) => !crawledSet.has(u) && !pages.has(u));
  const avg = (k) => (ok.length ? +(ok.reduce((s, r) => s + (+r[k] || 0), 0) / ok.length).toFixed(1) : 0);
  const summary = {
    host: HOST, crawledAt: new Date().toISOString(), pages: recs.length, ok: ok.length, statusCounts,
    noindex: count((r) => r.noindex), thin: count((r) => r.words < 300), noH1: count((r) => !r.h1), noDate: count((r) => !r.dateModified), noAuthor: count((r) => !r.author),
    duplicateTitles: dup("title").length, duplicateH1: dup("h1").length,
    withTables: count((r) => r.tables > 0), withVideo: count((r) => r.video), withFaq: count((r) => r.faqItems > 0 || r.hasFaqSchema), withQuestions: count((r) => r.questions.length > 0),
    questionHeadings: ok.reduce((s, r) => s + r.questions.length, 0), avgWords: avg("words"), avgFactDensity: avg("factDensity"), avgExternalLinks: avg("externalLinks"),
    latestYear: Math.max(0, ...ok.map((r) => r.latestYear ?? 0)) || null, byYear, schemaTypes: schemaHist, topics: Object.fromEntries(topics),
    languages: Object.fromEntries(ok.reduce((m, r) => m.set(r.lang || "?", (m.get(r.lang || "?") ?? 0) + 1), new Map())),
    orphans, notInSitemap: notInSitemap.slice(0, 50), sitemapNotCrawled: sitemapNotCrawled.slice(0, 50), robotsDisallow: disallow,
  };
  const outFile = args.out ?? join("crawl", `${HOST}.json`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify({ summary, pages: recs }, null, 1));
  if (args.csv) {
    const cols = ["url", "status", "depth", "inlinks", "outlinks", "title", "h1", "lang", "words", "questions", "tables", "faqItems", "video", "factDensity", "dateModified", "author", "schemaTypes", "noindex", "canonical", "redirectTo"];
    writeFileSync(outFile.replace(/\.json$/, ".csv"), toCsv(recs.map((r) => ({ ...r, questions: r.questions?.length ?? "", schemaTypes: (r.schemaTypes ?? []).join("|") })), cols));
  }
  console.log(c.bold(`\nCrawl of ${HOST}: ${ok.length} HTML pages (${recs.length} URLs fetched, max ${MAX})`));
  console.table([{ thin: summary.thin, noH1: summary.noH1, noDate: summary.noDate, noAuthor: summary.noAuthor, dupTitles: summary.duplicateTitles, noindex: summary.noindex, tables: summary.withTables, video: summary.withVideo, faq: summary.withFaq, qHeadings: summary.questionHeadings, avgWords: summary.avgWords, factDensity: summary.avgFactDensity, latestYear: summary.latestYear }]);
  console.log("Status:", JSON.stringify(statusCounts), "· languages:", JSON.stringify(summary.languages), "· schema:", JSON.stringify(schemaHist));
  console.log("Topics (title/h1/heading terms, pages using them):", topics.slice(0, 20).map(([t, n]) => `${t} (${n})`).join(", "));
  if (Object.keys(byYear).length) console.log("Pages by last-modified year:", JSON.stringify(byYear));
  if (smUrls.length) console.log(`Sitemap: ${smUrls.length} URLs · orphans (in sitemap, no inlink found): ${orphans.length} · crawled but not in sitemap: ${notInSitemap.length} · in sitemap, not reachable: ${sitemapNotCrawled.length}`);
  const bad = recs.filter((r) => r.status !== 200 && r.status !== "robots");
  if (bad.length) console.log(c.yellow(`Non-200 URLs (${bad.length}):`), bad.slice(0, 15).map((r) => `${r.status} ${r.url}`).join("\n  "));
  console.log(c.dim(`written ${outFile}${args.csv ? " (+ .csv)" : ""} — feed it to content-gap.mjs / market.mjs`));
})();
