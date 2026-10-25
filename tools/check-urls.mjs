#!/usr/bin/env node
// scripts/check-urls.mjs — live URL hygiene after deploy (Layers 5 and 18): status, redirect chains, canonical, noindex, hreflang, host variants.
// Usage:
//   node check-urls.mjs https://x.ma/sitemap.xml            every URL in the sitemap
//   node check-urls.mjs https://x.ma/ https://x.ma/prix/     specific URLs
//   options: --concurrency 5  --json url-report.json
import { writeFileSync } from "node:fs";
import { parseArgs, fetchText, linkHref, metaContent, tagContent, loadConfig, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let urls = args._;
if (!urls.length) { console.error("Usage: node check-urls.mjs <sitemap-url | url...>"); process.exit(1); }
if (urls.length === 1 && /sitemap.*\.xml$/i.test(urls[0])) {
  const sm = await fetchText(urls[0]);
  if (sm.status !== 200) { console.error(`sitemap HTTP ${sm.status}`); process.exit(1); }
  urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  console.log(`${urls.length} URLs from sitemap`);
}

async function follow(url) {
  const chain = [];
  let cur = url;
  for (let i = 0; i < 6; i++) {
    const r = await fetchText(cur, { redirect: "manual" });
    if (r.status >= 300 && r.status < 400) {
      const loc = r.headers.get("location");
      if (!loc) return { chain, final: cur, status: r.status, html: "" };
      const next = new URL(loc, cur).href;
      chain.push({ from: cur, status: r.status, to: next });
      cur = next;
      continue;
    }
    return { chain, final: cur, status: r.status, html: r.text, headers: r.headers };
  }
  return { chain, final: cur, status: 0, html: "", loop: true };
}

const rows = [];
let fails = 0, warns = 0;
const conc = +(args.concurrency ?? 5);
const queue = [...urls];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const r = await follow(url);
      const canon = linkHref(r.html, "canonical")[0]?.href ?? "";
      const robots = (metaContent(r.html, "robots") ?? "").toLowerCase();
      const hreflang = linkHref(r.html, "alternate").filter((l) => l.hreflang).length;
      const title = (tagContent(r.html, "title")[0] ?? "").trim().slice(0, 60);
      const issues = [];
      if (r.status !== 200) issues.push(`HTTP ${r.status}`);
      if (r.chain.length > 1) issues.push(`redirect chain of ${r.chain.length} hops`);
      if (r.chain.length === 1 && urls.includes(url)) issues.push(`redirects (${r.chain[0].status}) to ${r.final} — use the final URL everywhere`);
      if (r.loop) issues.push("redirect loop");
      if (r.status === 200 && !canon) issues.push("no canonical");
      if (canon && canon !== r.final && canon.replace(/\/$/, "") !== r.final.replace(/\/$/, "")) issues.push(`canonical ${canon} ≠ final ${r.final}`);
      if (robots.includes("noindex")) issues.push("noindex");
      const xr = (r.headers?.get("x-robots-tag") ?? "").toLowerCase();
      if (/noindex/.test(xr)) issues.push(`X-Robots-Tag header: ${xr} (invisible in the HTML — set by the host/CDN)`);
      else if (/noarchive|nosnippet|nocache/.test(xr)) issues.push(`X-Robots-Tag "${xr}" limits snippets/citations`);
      if (r.headers && r.status === 200) {
        const ct = r.headers.get("content-type") ?? "";
        if (!/charset/i.test(ct)) issues.push(`Content-Type without charset (${ct || "missing"})`);
        if (!r.headers.get("strict-transport-security")) issues.push("no HSTS header");
        if ((r.headers.get("x-content-type-options") ?? "").toLowerCase() !== "nosniff") issues.push("no X-Content-Type-Options: nosniff");
        if (!r.headers.get("content-security-policy") && !r.headers.get("content-security-policy-report-only")) issues.push("no Content-Security-Policy (info)");
        if (!r.headers.get("cache-control")) issues.push("no Cache-Control header (info)");
        const cs = r.headers.get("content-signal"); if (cs) issues.push(`Content-Signal header: ${cs}`);
        if (/cf-mitigated|cf-chl/i.test([...r.headers.keys()].join(" "))) issues.push("Cloudflare challenge headers present");
      }
      if (r.status === 200 && r.html.length < 1500) issues.push("tiny HTML (soft 404 or empty shell?)");
      const level = issues.some((i) => /HTTP [45]|loop|noindex|≠|chain|redirects|X-Robots-Tag header|challenge/.test(i)) ? "FAIL" : issues.some((i) => !/\(info\)|Content-Signal header/.test(i)) ? "WARN" : issues.length ? "INFO" : "PASS";
      if (level === "FAIL") fails++; else if (level === "WARN") warns++;
      const mark = level === "FAIL" ? c.red("✗") : level === "WARN" ? c.yellow("!") : level === "INFO" ? c.dim("·") : c.green("✓");
      rows.push({ url, status: r.status, hops: r.chain.length, canonical: canon === r.final ? "self" : canon || "-", hreflang, noindex: robots.includes("noindex"), level, issues: issues.join("; "), title });
      console.log(`${mark} ${url} ${issues.length ? c.dim("— " + issues.join("; ")) : ""}`);
    } catch (e) { fails++; rows.push({ url, level: "FAIL", issues: e.message }); console.log(`${c.red("✗")} ${url} — ${e.message}`); }
  }
}
await Promise.all(Array.from({ length: conc }, worker));

// host variants for the home page: expect exactly one 301 to the canonical origin
try {
  const origin = new URL(urls[0]).origin;
  const host = new URL(origin).host;
  const variants = [`http://${host}/`, host.startsWith("www.") ? `https://${host.slice(4)}/` : `https://www.${host}/`, host.startsWith("www.") ? `http://${host.slice(4)}/` : `http://www.${host}/`];
  console.log(`\nHost variants (expect one 301 to ${origin}/):`);
  for (const v of variants) {
    try {
      const r = await follow(v);
      const ok = r.chain.length === 1 && r.chain[0].status === 301 && r.final.startsWith(origin);
      if (!ok && !(r.final === `${origin}/` && r.chain.length <= 1)) warns++;
      console.log(`  ${ok ? c.green("✓") : c.yellow("!")} ${v} → ${r.chain.map((h) => `${h.status} → `).join("")}${r.final} (${r.status})`);
    } catch (e) { warns++; console.log(`  ${c.yellow("!")} ${v} — ${e.message}`); }
  }
} catch {}

// sameAs profiles (Layer 8 "Done when": every sameAs link resolves to a live profile)
if (args.config) {
  try {
    const cfg = loadConfig(args.config === true ? "site.config.json" : args.config);
    const links = [...(cfg.sameAs ?? []), ...(cfg.brand?.founder?.sameAs ?? [])];
    if (links.length) console.log(`\nsameAs profiles (${links.length}):`);
    for (const u of links) {
      try { const r = await fetchText(u, { ua: "Mozilla/5.0 (compatible; rank-first-check/1.0)" }); const ok = r.status === 200; if (!ok) warns++; console.log(`  ${ok ? c.green("✓") : c.yellow("!")} ${u} (${r.status})${/login|sign in|connexion/i.test(r.text.slice(0, 4000)) && ok ? c.dim(" — login wall, verify manually") : ""}`); }
      catch (e) { warns++; console.log(`  ${c.yellow("!")} ${u} — ${e.message}`); }
    }
  } catch (e) { console.log(c.dim(`sameAs check skipped: ${e.message}`)); }
}

console.log(`\n${rows.length} URL(s): ${fails ? c.red(fails + " FAIL") : c.green("0 FAIL")}, ${warns ? c.yellow(warns + " WARN") : "0 WARN"}`);
if (args.json) writeFileSync(args.json, JSON.stringify({ rows, generated: new Date().toISOString() }, null, 2));
process.exit(fails ? 1 : 0);
