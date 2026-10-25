#!/usr/bin/env node
// scripts/cwv.mjs — Layer 3 "Done when": home + top pages pass Core Web Vitals on mobile (PageSpeed Insights API).
// Field data (CrUX, real Chrome users at p75) appears once the site has enough traffic; lab data (Lighthouse) is always returned.
// Usage: node cwv.mjs https://x.ma/ https://x.ma/pillar/ [--strategy mobile|desktop] [--key <PSI API key>] [--json cwv.json]
//        node cwv.mjs --sitemap https://x.ma/sitemap.xml --max 6
// Thresholds (good): LCP ≤ 2500 ms, INP ≤ 200 ms, CLS ≤ 0.1. Without --key the public quota is small: run it on ≤ 6 URLs at a time.
import { writeFileSync } from "node:fs";
import { parseArgs, fetchText, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let urls = args._;
if (args.sitemap) {
  const sm = await fetchText(args.sitemap);
  urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).slice(0, +(args.max ?? 6));
}
if (!urls.length) { console.error("Usage: node cwv.mjs <url...> | --sitemap <url> [--strategy mobile] [--key KEY]"); process.exit(1); }
const strategy = args.strategy ?? "mobile";
const rows = [];
let fails = 0;
for (const url of urls) {
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url); api.searchParams.set("strategy", strategy); api.searchParams.set("category", "performance");
  if (args.key) api.searchParams.set("key", args.key);
  try {
    const res = await fetch(api, { headers: { "User-Agent": "rank-first-cwv/1.0" } });
    if (res.status !== 200) { fails++; rows.push({ url, error: `PSI HTTP ${res.status}` }); console.log(`${c.red("✗")} ${url} — PSI HTTP ${res.status}${res.status === 429 ? " (quota: add --key or wait)" : ""}`); continue; }
    const j = await res.json();
    const originFallback = !!j.loadingExperience?.origin_fallback; // CrUX had no data for this URL and answered with origin-level data
    const field = originFallback ? {} : (j.loadingExperience?.metrics ?? {});
    const lab = j.lighthouseResult?.audits ?? {};
    const f = {
      lcp: field.LARGEST_CONTENTFUL_PAINT_MS?.percentile, inp: field.INTERACTION_TO_NEXT_PAINT?.percentile, cls: field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile != null ? field.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 : undefined,
      verdict: originFallback ? undefined : j.loadingExperience?.overall_category,
    };
    const l = {
      lcp: lab["largest-contentful-paint"]?.numericValue, cls: lab["cumulative-layout-shift"]?.numericValue, tbt: lab["total-blocking-time"]?.numericValue,
      score: j.lighthouseResult?.categories?.performance?.score != null ? Math.round(j.lighthouseResult.categories.performance.score * 100) : undefined,
      bytes: lab["total-byte-weight"]?.numericValue,
    };
    const ok = (v, t) => v == null ? "n/a" : v <= t ? c.green(String(Math.round(v * 1000) / 1000)) : c.red(String(Math.round(v * 1000) / 1000));
    const pass = f.verdict ? f.verdict === "FAST" : (l.lcp <= 2500 && l.cls <= 0.1 && l.tbt <= 200);
    if (!pass) fails++;
    console.log(`${pass ? c.green("✓") : c.red("✗")} ${url}`);
    console.log(`   field p75: LCP ${ok(f.lcp, 2500)} ms · INP ${ok(f.inp, 200)} ms · CLS ${ok(f.cls, 0.1)} ${f.verdict ? c.dim("(" + f.verdict + ")") : c.dim(originFallback ? "(no field data for this URL yet — origin-level data ignored)" : "(no field data yet: not enough real visits)")}`);
    console.log(`   lab: LCP ${ok(l.lcp, 2500)} ms · CLS ${ok(l.cls, 0.1)} · TBT ${ok(l.tbt, 200)} ms · score ${l.score ?? "n/a"} · weight ${l.bytes ? Math.round(l.bytes / 1024) + " KB" : "n/a"}`);
    rows.push({ url, field: f, lab: l, pass });
  } catch (e) { fails++; rows.push({ url, error: e.message }); console.log(`${c.red("✗")} ${url} — ${e.message}`); }
}
console.log(`\n${urls.length} URL(s): ${fails ? c.red(fails + " not passing") : c.green("all passing")} (${strategy}). Fix order: hero image size/format, fonts, third-party scripts, layout shifts (Layer 3.3).`);
if (args.json) writeFileSync(args.json, JSON.stringify({ strategy, rows, generated: new Date().toISOString() }, null, 2));
process.exit(fails ? 1 : 0);
