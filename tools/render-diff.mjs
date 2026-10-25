#!/usr/bin/env node
// scripts/render-diff.mjs — does the content exist without JavaScript? (Layers 3.4, 14.3): compares the raw HTML response (what
// OAI-SearchBot, PerplexityBot, ClaudeBot, Bingbot's first pass and Google's first wave read) with the rendered DOM (what a
// browser shows). Words, headings, internal links, JSON-LD, title/canonical/meta must match; anything only in the rendered
// version is invisible to most AI crawlers. Rendering uses Playwright when installed (npm i -D playwright && npx playwright
// install chromium) — otherwise the script runs the heuristic mode: app-shell markers, empty main, script-to-text ratio.
// Usage: node render-diff.mjs https://x.ma/ https://x.ma/pillar/ [--ua "…"] [--timeout 20000]
import { parseArgs, fetchText, stripTags, wordCount, allTags, attr, jsonLdBlocks, linkHref, metaContent, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const urls = args._.filter((u) => /^https?:\/\//.test(u));
if (!urls.length) { console.error("Usage: node render-diff.mjs <url…>"); process.exit(1); }
const UA = args.ua ?? "Mozilla/5.0 (compatible; rank-first-render/1.0)";
const profile = (html) => ({ words: wordCount(stripTags(html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html)), h1: (html.match(/<h1\b/gi) ?? []).length, h2: (html.match(/<h2\b/gi) ?? []).length, links: allTags(html, "a").filter((t) => /^(\/|https?:)/.test(attr(t, "href") ?? "")).length, jsonld: jsonLdBlocks(html).filter((b) => b.ok).length, title: stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""), canonical: linkHref(html, "canonical")[0]?.href ?? "", description: (metaContent(html, "description") ?? "").slice(0, 60), images: allTags(html, "img").length });
const heuristics = (html) => { const flags = []; const body = html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html; const text = stripTags(body); if (/<div[^>]+id=["'](root|app|__next|__nuxt|svelte|q-app)["'][^>]*>\s*<\/div>/i.test(html)) flags.push("empty app-shell container (React/Vue/Next/Nuxt client render)"); if (wordCount(text) < 80) flags.push(`only ${wordCount(text)} words in the raw HTML`); if (/<noscript>[\s\S]*?(activer|enable)[\s\S]*?javascript/i.test(html)) flags.push("noscript asks to enable JavaScript"); const scripts = (html.match(/<script\b/gi) ?? []).length; const ratio = html.length ? Math.round((100 * text.length) / html.length) : 0; if (ratio < 10) flags.push(`text is ${ratio} % of the HTML (${scripts} scripts)`); if (/window\.location\.hash|#!\//.test(html)) flags.push("hash routing"); if (/id=["']main["'][^>]*>\s*<\/(main|div)>/i.test(html)) flags.push("empty <main>"); return flags; };

let pw = null;
try { pw = await import("playwright"); } catch { try { pw = await import("playwright-core"); } catch {} }
let browser = null;
if (pw) { try { browser = await pw.chromium.launch({ headless: true }); } catch (e) { console.log(c.yellow(`Playwright present but no browser: ${e.message.split("\n")[0]} — heuristic mode`)); } }
let bad = 0;
for (const url of urls) {
  const raw = await fetchText(url, { ua: UA, timeoutMs: +(args.timeout ?? 20000) }).catch((e) => ({ status: 0, text: "", error: e.message }));
  if (raw.status !== 200) { console.log(c.red(`${url}: HTTP ${raw.status} ${raw.error ?? ""}`)); bad++; continue; }
  const a = profile(raw.text), flags = heuristics(raw.text);
  if (browser) {
    const page = await browser.newPage({ userAgent: UA });
    try { await page.goto(url, { waitUntil: "networkidle", timeout: +(args.timeout ?? 20000) }); await page.waitForTimeout(500); const html = await page.content(); const b = profile(html);
      const diffs = [];
      if (b.words > a.words * 1.25 + 40) diffs.push(`words ${a.words} raw → ${b.words} rendered (${b.words - a.words} words only exist with JS)`);
      if (b.h2 > a.h2) diffs.push(`h2 ${a.h2} → ${b.h2}`); if (b.h1 !== a.h1) diffs.push(`h1 ${a.h1} → ${b.h1}`);
      if (b.links > a.links * 1.3 + 5) diffs.push(`internal links ${a.links} → ${b.links} (navigation built by JS)`);
      if (b.jsonld > a.jsonld) diffs.push(`JSON-LD blocks ${a.jsonld} → ${b.jsonld} (structured data injected by JS — Google may read it, AI crawlers will not)`);
      if (b.title !== a.title) diffs.push(`title "${a.title}" → "${b.title}"`); if (b.canonical !== a.canonical) diffs.push(`canonical ${a.canonical || "none"} → ${b.canonical || "none"}`);
      if (b.description !== a.description) diffs.push("meta description changed by JS");
      const ok = !diffs.length && !flags.length; if (!ok) bad++;
      console.log(`${ok ? c.green("OK  ") : c.red("DIFF")} ${url} — raw ${a.words} w / ${a.h2} h2 / ${a.links} links / ${a.jsonld} ld · rendered ${b.words} w / ${b.h2} h2 / ${b.links} links / ${b.jsonld} ld${diffs.length ? "\n      " + diffs.join("\n      ") : ""}${flags.length ? "\n      " + flags.join("\n      ") : ""}`);
    } catch (e) { console.log(c.yellow(`${url}: render failed (${e.message.split("\n")[0]}) — raw only: ${a.words} words, flags: ${flags.join("; ") || "none"}`)); }
    finally { await page.close(); }
  } else {
    const ok = !flags.length; if (!ok) bad++;
    console.log(`${ok ? c.green("OK  ") : c.yellow("WARN")} ${url} — raw HTML: ${a.words} words, ${a.h1} h1, ${a.h2} h2, ${a.links} links, ${a.jsonld} JSON-LD${flags.length ? "\n      " + flags.join("\n      ") : ""}`);
  }
}
if (browser) await browser.close();
console.log(c.dim(browser ? "Rendered comparison done (Playwright)." : "Heuristic mode: install Playwright for the true raw-vs-rendered diff (npm i -D playwright && npx playwright install chromium)."));
process.exit(bad ? 1 : 0);
