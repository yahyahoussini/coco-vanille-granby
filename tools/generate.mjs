#!/usr/bin/env node
// scripts/generate.mjs — writes the technical files (Layers 4, 5, 14) from site.config.json + the HTML files on disk.
//   robots.txt          all search + AI crawlers allowed, Content-Signal declared, sitemap pointed
//   sitemap.xml         every indexable page with hreflang alternates (xhtml:link) and lastmod
//   _redirects          Netlify / Cloudflare Pages: host + old-URL redirects
//   .htaccess           Apache equivalent (https, www policy, redirect map)
//   <indexnow-key>.txt  key file IndexNow requires at the site root
//   llms.txt            optional (cfg.llmsTxt = true). Google ignores it; harmless; zero cost.
//   schema/site-graph.json  the entity graph (org + founder + website) to embed on every page
// Usage: node generate.mjs [--config site.config.json] [--root site] [--dry-run]
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs, walkHtml, fileToPath, CRAWLERS, metaContent, linkHref, jsonLdBlocks, ldNodes, tagContent, attr, allTags, isoDate } from "./lib.mjs";
import { siteGraph } from "./schema.mjs";

const args = parseArgs(process.argv.slice(2));
const cfg = loadConfig(args.config ?? "site.config.json");
const root = args.root ?? cfg.root ?? "site";
const dry = !!args["dry-run"];
if (!existsSync(root)) { console.error(`Root folder "${root}" not found. Set "root" in site.config.json or pass --root.`); process.exit(1); }

const write = (name, content) => {
  const p = join(root, name);
  if (dry) { console.log(`--- ${name} ---\n${content}`); return; }
  mkdirSync(join(p, ".."), { recursive: true });
  writeFileSync(p, content);
  console.log(`wrote ${p}`);
};

// ---------- pages from disk ----------
const pages = [];
for (const file of walkHtml(root)) {
  const path = fileToPath(root, file);
  const html = readFileSync(file, "utf8");
  const robots = (metaContent(html, "robots") ?? "").toLowerCase();
  const noindex = robots.includes("noindex") || path === "/404.html" || /\/404\//.test(path);
  const canonical = linkHref(html, "canonical")[0]?.href ?? null;
  const alternates = linkHref(html, "alternate").filter((l) => l.hreflang).map((l) => ({ hreflang: l.hreflang, href: l.href }));
  const nodes = ldNodes(jsonLdBlocks(html));
  const ldModified = nodes.map((n) => n.dateModified).find(Boolean);
  const times = allTags(html, "time").map((t) => attr(t, "datetime")).filter(Boolean).sort();
  const cfgPage = (cfg.pages ?? []).find((p) => p.path === path);
  const lastmod = cfgPage?.updated ?? ldModified ?? times.at(-1) ?? isoDate(statSync(file).mtime);
  const title = (tagContent(html, "title")[0] ?? "").replace(/\s+/g, " ").trim();
  const description = metaContent(html, "description") ?? "";
  pages.push({ path, file, noindex, canonical, alternates, lastmod: lastmod.slice(0, 10), title, description });
}
const indexable = pages
  .filter((p) => !p.noindex && (!p.canonical || p.canonical === `${cfg.site}${p.path}`))
  .sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path)));

// ---------- robots.txt ----------
const disallow = cfg.robots?.disallow ?? ["/admin/", "/recherche", "/panier/", "/cgi-bin/"];
const signal = cfg.contentSignal ?? { search: "yes", "ai-input": "yes", "ai-train": "yes" };
const signalLine = `Content-Signal: ${Object.entries(signal).map(([k, v]) => `${k}=${v}`).join(", ")}`;
// RFC 9309: a crawler obeys only its most specific group and ignores "*", so every named group repeats the Disallow lines.
const disallowLines = disallow.map((d) => `Disallow: ${d}`).join("\n");
const groups = CRAWLERS.map((b) => `User-agent: ${b.ua}\n${disallowLines}\nAllow: /`).join("\n\n");
const robots = `# ${cfg.site}/robots.txt — generated ${isoDate()} by rank-first
# Default: everything public is crawlable. Block only what must never be indexed.
# Content-Signal (Cloudflare Content Signals Policy, contentsignals.org): declares how content may be used
# AFTER crawling — search=index & show, ai-input=answer-time grounding (AI Overviews, ChatGPT search, Perplexity),
# ai-train=model training. A business that wants to be recommended by AI engines says yes to all three.
User-agent: *
${signalLine}
${disallow.map((d) => `Disallow: ${d}`).join("\n")}
Allow: /

# Search engines and AI crawlers, named explicitly so a future edit never locks them out by accident.
# Each named group repeats the Disallow lines: a crawler that finds its own group ignores the "*" group (RFC 9309).
# (Allow = eligible to be indexed, cited and remembered. Blocking GPTBot/ClaudeBot removes the brand from training data.)
${groups}

Sitemap: ${cfg.site}/sitemap.xml
`;
write("robots.txt", robots);

// ---------- sitemap.xml ----------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlEntries = indexable.map((p) => {
  const loc = `${cfg.site}${p.path}`;
  const alts = p.alternates.length ? p.alternates : [];
  const altXml = alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}"/>`).join("\n");
  return `  <url>\n    <loc>${esc(loc)}</loc>\n${altXml ? altXml + "\n" : ""}    <lastmod>${p.lastmod}</lastmod>\n  </url>`;
});
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>
`;
write("sitemap.xml", sitemap);

// ---------- redirects ----------
const host = new URL(cfg.site).host;
const wantWww = !!cfg.urlPolicy?.www;
const otherHost = wantWww ? host.replace(/^www\./, "") : `www.${host}`;
const redirects = cfg.redirects ?? [];
const redirectsFile = `# _redirects — Netlify / Cloudflare Pages. One canonical host, HTTPS, no chains. Keep old-URL rules for at least a year.
https://${otherHost}/* ${cfg.site}/:splat 301!
http://${otherHost}/* ${cfg.site}/:splat 301!
http://${host}/* ${cfg.site}/:splat 301!
${redirects.map((r) => `${r.from} ${r.to.startsWith("http") ? r.to : cfg.site + r.to} ${r.status ?? 301}`).join("\n")}
`;
write("_redirects", redirectsFile);

const htaccess = `# .htaccess — Apache. Force HTTPS + canonical host, trailing slash policy, old-URL map. No chains.
RewriteEngine On
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^${otherHost.replace(/\./g, "\\.")}$ [NC]
RewriteRule ^(.*)$ ${cfg.site}/$1 [R=301,L]
${cfg.urlPolicy?.trailingSlash !== false
    ? `# add trailing slash to directory URLs\nRewriteCond %{REQUEST_FILENAME} -d\nRewriteCond %{REQUEST_URI} !/$\nRewriteRule ^(.*)$ ${cfg.site}/$1/ [R=301,L]`
    : `# remove trailing slash\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)/$ ${cfg.site}/$1 [R=301,L]`}
${redirects.map((r) => `Redirect ${r.status ?? 301} ${r.from} ${r.to.startsWith("http") ? r.to : cfg.site + r.to}`).join("\n")}
# Security + caching (adjust to host)
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
`;
write(".htaccess", htaccess);

// ---------- IndexNow key file ----------
if (cfg.indexnow?.key) {
  write(`${cfg.indexnow.key}.txt`, cfg.indexnow.key);
} else {
  console.log("note: no indexnow.key in config — run: node init.mjs --indexnow-key (or set one: 32+ hex chars)");
}

// ---------- llms.txt (optional) ----------
if (cfg.llmsTxt) {
  const byLang = (l) => indexable.filter((p) => (l === cfg.languages.default ? !(cfg.languages.others ?? []).some((o) => p.path.startsWith(`/${o}/`)) : p.path.startsWith(`/${l}/`)));
  const section = (label, list) => list.length ? `\n## ${label}\n\n${list.map((p) => `- [${p.title || p.path}](${cfg.site}${p.path})${p.description ? `: ${p.description}` : ""}`).join("\n")}\n` : "";
  const llms = `# ${cfg.brand?.name ?? host}

> ${cfg.category?.sentence?.fr ?? ""}

Note: Google Search ignores this file (Search Central, 2026). It is provided for agents and tools that read it.
${section("Pages", byLang(cfg.languages.default))}${(cfg.languages.others ?? []).map((l) => section(`Pages (${l})`, byLang(l))).join("")}`;
  write("llms.txt", llms);
}

// ---------- entity graph ----------
write("schema/site-graph.json", JSON.stringify({ "@context": "https://schema.org", "@graph": siteGraph(cfg) }, null, 2));

console.log(`\n${indexable.length} indexable pages in sitemap (${pages.length} html files found).`);
const missingAlt = indexable.filter((p) => (cfg.languages.others ?? []).length && p.alternates.length === 0 && !/(404|mentions|confidentialite|cgv|privacy|legal)/.test(p.path));
if (missingAlt.length) console.log(`warning: ${missingAlt.length} page(s) without hreflang alternates: ${missingAlt.map((p) => p.path).join(", ")}`);
