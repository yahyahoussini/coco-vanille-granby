#!/usr/bin/env node
// scripts/audit.mjs — the page contract audit (Layers 2, 3, 4, 5, 8, 10, 13, 14 "Done when" lists as code).
// Usage:
//   node audit.mjs site                          audit every .html under ./site (uses site.config.json for the expected URLs)
//   node audit.mjs https://x.ma/ https://x.ma/p/  audit live URLs (raw HTML, as a crawler that runs no JavaScript sees it)
//   options: --config site.config.json  --json audit-report.json  --quiet (only FAIL/WARN)  --no-site (skip site-level checks)
// Exit code 1 when any FAIL remains. FAIL = blocks shipping. WARN = fix before the weekly review. INFO = optional.
import { readFileSync, existsSync, statSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs, walkHtml, fileToPath, pathToFile, stripTags, wordCount, attr, allTags, tagContent, metaContent, linkHref, jsonLdBlocks, ldNodes, hasType, fetchText, CRAWLERS, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const targets = args._;
if (!targets.length) { console.error("Usage: node audit.mjs <dir|url...> [--config site.config.json] [--json report.json]"); process.exit(1); }

let cfg = null;
try { cfg = loadConfig(args.config ?? "site.config.json"); } catch { /* optional in URL mode */ }
const site = cfg?.site ?? null;
const otherLangs = cfg?.languages?.others ?? [];
const bilingual = otherLangs.length > 0;

const dirMode = existsSync(targets[0]) && statSync(targets[0]).isDirectory();
const root = dirMode ? targets[0] : null;

// ---------- collect documents ----------
const docs = []; // { path, url, html, file }
if (dirMode) {
  if (!site) { console.error("Directory mode needs site.config.json (for the expected canonical URLs)."); process.exit(1); }
  for (const file of walkHtml(root)) {
    const path = fileToPath(root, file);
    docs.push({ path, url: `${site}${path}`, html: readFileSync(file, "utf8"), file });
  }
} else {
  for (const u of targets) {
    try {
      const r = await fetchText(u);
      const url = new URL(u);
      docs.push({ path: url.pathname, url: u, html: r.text, status: r.status });
    } catch (e) { docs.push({ path: u, url: u, html: "", status: 0, fetchError: e.message }); }
  }
}

// ---------- helpers ----------
const kind = (path) => {
  const p = (cfg?.pages ?? []).find((x) => x.path === path || Object.values(x.alt ?? {}).includes(path));
  if (p?.type) return p.type;
  const stripped = path.replace(new RegExp(`^/(${otherLangs.join("|") || "xx"})/`), "/");
  if (stripped === "/" ) return "home";
  if (/404/.test(stripped)) return "404";
  if (/(mentions|confidentialite|privacy|legal|cgv|cgu|cookies)/.test(stripped)) return "legal";
  if (/contact/.test(stripped)) return "contact";
  if (/(a-propos|about|equipe|team|من-نحن)/.test(stripped)) return "about";
  return "content";
};
const isContent = (k) => !["404", "legal", "contact"].includes(k);
// schema.org FoodEstablishment and its subtypes (all LocalBusiness): https://schema.org/FoodEstablishment
const FOOD_TYPES = new Set(["FoodEstablishment", "Bakery", "BarOrPub", "Brewery", "CafeOrCoffeeShop", "Distillery", "FastFoodRestaurant", "IceCreamShop", "Restaurant", "Winery"]);
const GENERIC_ANCHORS = /^(cliquez ici|click here|ici|here|en savoir plus|lire la suite|read more|plus|voir|link|lien|اضغط هنا|المزيد|هنا)$/i;
const PLACEHOLDER = /\[\[FACT NEEDED[^\]]*\]\]|\{\{[^}]+\}\}|\bTODO\b|lorem ipsum|\bXXX\b|REPLACE_WITH|\[INSERT|Votre texte ici/i;

function alternateFor(doc, href) {
  // returns the html of an alternate (by URL) from disk, from the fetched set, or by fetching
  const found = docs.find((d) => d.url === href || d.url === href.replace(/\/$/, "") || d.url + "/" === href);
  if (found) return Promise.resolve(found.html);
  if (dirMode && site && href.startsWith(site)) {
    const f = pathToFile(root, href.slice(site.length));
    return Promise.resolve(existsSync(f) ? readFileSync(f, "utf8") : null);
  }
  return fetchText(href).then((r) => r.text).catch(() => null);
}

// ---------- per-page checks ----------
const report = { pages: [], site: { fails: [], warns: [], infos: [] }, summary: {} };
const titles = new Map(), descriptions = new Map();

for (const doc of docs) {
  const R = { path: doc.path, url: doc.url, fails: [], warns: [], infos: [] };
  const fail = (m) => R.fails.push(m), warn = (m) => R.warns.push(m), info = (m) => R.infos.push(m);
  report.pages.push(R);
  const html = doc.html;
  if (doc.fetchError) { fail(`fetch failed: ${doc.fetchError}`); continue; }
  if (doc.status && doc.status !== 200) fail(`HTTP ${doc.status}`);
  if (!html.trim()) { fail("empty document"); continue; }

  const k = kind(doc.path);
  const head = (html.match(/<head[\s\S]*?<\/head>/i) ?? [""])[0];
  const mainHtml = (html.match(/<main[\s\S]*?<\/main>/i) ?? [html])[0];
  const bodyText = stripTags(mainHtml);
  const words = wordCount(bodyText);
  const isDraft = /\[\[FACT NEEDED/.test(html); // skeleton/draft pages: content-quality rules wait for the facts

  // 1. skeleton
  if (!/^\s*<!doctype html/i.test(html)) fail("missing <!doctype html>");
  const htmlTag = allTags(html, "html")[0] ?? "";
  const lang = attr(htmlTag, "lang");
  const dir = (attr(htmlTag, "dir") ?? "ltr").toLowerCase();
  if (!lang) fail("<html> has no lang attribute");
  const pathLang = otherLangs.find((l) => doc.path === `/${l}/` || doc.path.startsWith(`/${l}/`)) ?? cfg?.languages?.default;
  if (lang && pathLang && cfg?.languages?.hreflang?.[pathLang] && !lang.toLowerCase().startsWith(pathLang)) warn(`lang="${lang}" but URL folder says ${pathLang}`);
  if (lang && /^ar/i.test(lang) && dir !== "rtl") fail('Arabic page without dir="rtl"');
  if (!/<meta\s+charset/i.test(head)) fail("missing <meta charset>");
  if (!metaContent(head, "viewport")) fail("missing viewport meta");

  // 2. title / description
  const title = (tagContent(head, "title")[0] ?? "").replace(/\s+/g, " ").trim();
  if (!title) fail("missing <title>");
  else {
    if (title.length > 60) warn(`title is ${title.length} chars (aim under 60): "${title}"`);
    if (titles.has(title)) fail(`duplicate title, also on ${titles.get(title)}`); else titles.set(title, doc.path);
    if (cfg?.brand?.name && !title.includes(cfg.brand.name) && !(cfg.brand.nameAr && title.includes(cfg.brand.nameAr))) info("title does not contain the brand name (category, place, brand is the order)");
  }
  const desc = metaContent(head, "description");
  if (!desc) fail("missing meta description");
  else {
    if (desc.length < 138 || desc.length > 162) warn(`meta description is ${desc.length} chars (aim 140-160)`);
    if (descriptions.has(desc)) warn(`duplicate meta description, also on ${descriptions.get(desc)}`); else descriptions.set(desc, doc.path);
  }

  // 3. canonical
  const canon = linkHref(head, "canonical")[0]?.href;
  const expected = dirMode ? doc.url : doc.url.replace(/[?#].*$/, "");
  if (!canon) { if (k !== "404") fail("missing rel=canonical"); }
  else if (!/^https:\/\//i.test(canon)) fail(`canonical is not absolute https: ${canon}`);
  else if (canon !== expected && canon.replace(/\/$/, "") !== expected.replace(/\/$/, "")) fail(`canonical ${canon} does not match this URL ${expected}`);

  // 4. hreflang
  const alts = linkHref(head, "alternate").filter((l) => l.hreflang);
  if (bilingual && isContent(k) && k !== "404") {
    if (!alts.length) fail("bilingual site but no hreflang alternates");
    else {
      if (!alts.some((a) => a.hreflang.toLowerCase() === "x-default")) fail("hreflang set has no x-default");
      if (!alts.some((a) => a.href === canon || a.href === expected)) fail("hreflang set does not include this page itself");
      for (const a of alts) {
        if (!/^https?:\/\//i.test(a.href)) { fail(`hreflang href must be absolute: ${a.href}`); continue; }
        if (a.href === expected || a.href === canon) continue;
        const other = await alternateFor(doc, a.href);
        if (other === null) fail(`hreflang target does not exist: ${a.href}`);
        else if (other && !linkHref(other, "alternate").some((l) => l.href === expected || l.href === canon)) fail(`no return hreflang link from ${a.href}`);
      }
    }
  }

  // 5. robots meta / preview controls
  const robots = (metaContent(head, "robots") ?? "").toLowerCase();
  if (robots.includes("noindex") && isContent(k)) fail("content page is noindex");
  if (/nosnippet|noarchive|nocache/.test(robots)) warn(`robots meta "${robots}" limits snippets/citations (Bing: noarchive removes the page from Copilot answers)`);
  if (!robots.includes("max-image-preview:large")) info('add <meta name="robots" content="max-image-preview:large"> (large image previews in Google surfaces)');

  // 6. social / favicon
  if (k !== "404") for (const p of ["og:title", "og:description", "og:image"]) if (!metaContent(head, p)) warn(`missing ${p}`);
  const ogImg = metaContent(head, "og:image");
  if (ogImg && !/^https?:\/\//i.test(ogImg)) warn("og:image must be an absolute URL");
  if (k !== "404" && !metaContent(head, "twitter:card")) info("missing twitter:card");
  if (!linkHref(head, "icon").length && !/rel=["'][^"']*icon/i.test(head)) warn("no favicon link (Google shows it next to the site name)");

  // 7. headings
  const h1s = tagContent(html, "h1");
  if (h1s.length !== 1) fail(`${h1s.length} <h1> (need exactly 1)`);
  const hs = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ n: +m[1], text: stripTags(m[2]) }));
  for (let i = 1; i < hs.length; i++) if (hs[i].n > hs[i - 1].n + 1) { warn(`heading level skips from h${hs[i - 1].n} to h${hs[i].n} ("${hs[i].text.slice(0, 40)}")`); break; }
  const h2s = hs.filter((h) => h.n === 2);
  if (isContent(k) && k !== "home" && h2s.length < 2) warn(`only ${h2s.length} <h2> sections`);
  const questionHeads = hs.filter((h) => h.n >= 2 && /[?؟]\s*$/.test(h.text));
  if (["pillar", "cluster", "content", "city", "service", "comparison", "study"].includes(k) && words > 400 && questionHeads.length === 0) warn("no question-phrased h2/h3 (People Also Ask candidates)");
  if (["pillar", "cluster", "content", "city", "service", "comparison", "study"].includes(k) && words > 400 && h2s.filter((h) => /[?؟]\s*$/.test(h.text)).length < 2) warn(`only ${h2s.filter((h) => /[?؟]\s*$/.test(h.text)).length} question-phrased h2 (Layer 13: one h2 per sub-question, phrased like People Also Ask; aim ≥ 2 besides FAQ/facts/CTA sections)`);
  // evidence density (Layer 10.2): ≥2 sourced statistics (data-fact) and ≥1 named quote on content pages
  if (["pillar", "cluster", "content", "city", "service", "comparison", "study"].includes(k)) {
    const factCount = (mainHtml.match(/data-fact=/gi) ?? []).length;
    const quoteCount = (mainHtml.match(/<q\b|<blockquote\b/gi) ?? []).length;
    if (factCount < 2) warn(`${factCount} data-fact element(s) (Layer 10: at least two sourced statistics per page)`);
    if (factCount > 8) warn(`${factCount} data-fact elements (Layer 10.2: many more than 2-3 statistics per page reads like a content farm)`);
    if (quoteCount < 1) warn("no <q>/<blockquote> named quote (Layer 10: one quote from a named person with a role)");
  }

  // 8. answer block
  const ps = tagContent(mainHtml, "p").map((p) => stripTags(p)).filter((t) => wordCount(t) > 0);
  if (isContent(k)) {
    if (!ps.length) fail("no paragraph text inside <main>");
    else {
      const answer = (mainHtml.match(/<p[^>]*class=["'][^"']*\banswer\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) ?? [null, ps[0]])[1];
      const aw = wordCount(stripTags(answer));
      if (k !== "home" && (aw < 38 || aw > 62)) warn(`answer block (first paragraph) is ${aw} words (aim 40-60)`);
      if (/^(nous|we|on|our|notre|bienvenue|welcome)\b/i.test(stripTags(answer))) info("answer block starts with a pronoun/greeting; start with the brand or the category term");
      const answerText = stripTags(answer);
      const brandNames = [cfg?.brand?.name, cfg?.brand?.nameAr].filter(Boolean);
      if (k !== "home" && brandNames.length && !brandNames.some((b) => answerText.toLowerCase().includes(b.toLowerCase())) && !isDraft) warn("answer block does not name the brand (Layer 2: brand + category + customer + place in the first 40-60 words)");
      if (k !== "home" && !/\d/.test(answerText) && !isDraft) warn("answer block has no number (one dated, sourced figure belongs in the first paragraph)");
    }
    if (words < 300 && ["pillar", "cluster", "content", "city", "service", "about", "comparison", "study"].includes(k)) warn(`main text is ${words} words (thin)`);
    // section openers: the first paragraph after each h2 is the passage an engine lifts — 40-60 words, direct answer first (Layer 13.2)
    if (["pillar", "cluster", "content", "city", "service", "comparison", "study"].includes(k) && !isDraft) {
      const sections = mainHtml.split(/<h2\b[^>]*>/i).slice(1);
      let short = 0, long = 0;
      for (const sec of sections) { const first = tagContent(sec, "p").map(stripTags).find((t) => wordCount(t) > 0); if (!first) continue; const n = wordCount(first); if (n < 25) short++; else if (n > 90) long++; }
      if (short + long > Math.max(1, Math.floor(sections.length / 2))) warn(`${short} section opener(s) under 25 words and ${long} over 90 (Layer 13: the paragraph right after each h2 answers in ~40-60 words, then details)`);
    }
    // hedges and self-references that kill a passage's quotability (Layer 10.4)
    const HEDGES = /\b(nous pensons que|il est important de noter|comme mentionné ci-dessus|comme indiqué plus haut|dans cet article|dans ce guide|il convient de noter|de nos jours|à l'ère du numérique|in this article|as mentioned above|it is important to note|we believe that|كما ذكرنا سابقا|في هذا المقال)\b/gi;
    const hedges = [...new Set((stripTags(mainHtml).match(HEDGES) ?? []).map((h) => h.toLowerCase()))];
    if (hedges.length) warn(`filler / self-reference phrases: ${hedges.slice(0, 4).join(", ")} (say the fact; a passage that refers to "this article" cannot be quoted alone)`);
  }
  // forms: every field labelled, no hidden required step (Layer 14.8 agent readiness, accessibility)
  for (const form of tagContent(html, "form")) {
    const fields = [...allTags(form, "input"), ...allTags(form, "select"), ...allTags(form, "textarea")].filter((t) => !/type=["'](hidden|submit|button|checkbox)["']/i.test(t));
    const labelsFor = new Set(allTags(form, "label").map((t) => attr(t, "for")).filter(Boolean));
    const unlabelled = fields.filter((t) => { const id = attr(t, "id"); return !(id && labelsFor.has(id)) && !attr(t, "aria-label") && !attr(t, "aria-labelledby"); });
    if (unlabelled.length) warn(`${unlabelled.length} form field(s) without <label for> / aria-label (agents and screen readers cannot fill them)`);
    if (!/<button[^>]*type=["']submit["']|<input[^>]*type=["']submit["']|<button\b(?![^>]*type=)/i.test(form)) warn("form without a submit button");
  }
  if (!/<main\b/i.test(html)) warn("no <main> landmark");
  for (const lm of ["header", "nav", "footer"]) if (!new RegExp(`<${lm}\\b`, "i").test(html)) warn(`no <${lm}> landmark`);

  // 9. images
  const imgs = allTags(html, "img");
  let highCount = 0;
  imgs.forEach((t, i) => {
    const src = attr(t, "src") ?? "";
    if (attr(t, "alt") === null) fail(`img without alt: ${src}`);
    if (!attr(t, "width") || !attr(t, "height")) fail(`img without width/height (layout shift): ${src}`);
    if ((attr(t, "fetchpriority") ?? "").toLowerCase() === "high") highCount++;
    if (i > 0 && !/loading\s*=\s*["']?lazy/i.test(t) && !/fetchpriority/i.test(t)) info(`img not lazy-loaded: ${src}`);
    if (/\.(jpe?g|png)(\?|$)/i.test(src)) info(`consider WebP/AVIF for ${src}`);
  });
  if (highCount > 1) warn(`${highCount} images with fetchpriority=high (only the hero)`);
  if (imgs.length && !/srcset=/i.test(html)) info("no responsive images (srcset/sizes)");

  // 10. links
  const anchors = allTags(html, "a").map((t) => ({ tag: t, href: attr(t, "href") ?? "" }));
  const internal = anchors.filter((a) => a.href.startsWith("/") || (site && a.href.startsWith(site))).filter((a) => !a.href.startsWith("//"));
  const distinctInternal = new Set(internal.map((a) => a.href.replace(/[#?].*$/, "")));
  if (isContent(k) && distinctInternal.size < 3) warn(`only ${distinctInternal.size} distinct internal links`);
  const anchorTexts = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => stripTags(m[1]));
  const generic = anchorTexts.filter((t) => GENERIC_ANCHORS.test(t.trim()));
  if (generic.length) warn(`${generic.length} generic anchor text(s): ${[...new Set(generic)].slice(0, 3).join(", ")}`);
  if (anchors.some((a) => /^(#|javascript:)/i.test(a.href.trim()) && !/^#[\w-]+$/.test(a.href.trim()))) warn('links with href="#" or javascript: (not crawlable)');
  if (/<button[^>]*onclick=["'][^"']*(location|href)/i.test(html)) warn("button used as navigation (crawlers do not follow it)");
  if (bilingual && isContent(k) && !anchors.some((a) => attr(a.tag, "hreflang")) && !alts.some((a) => a.href !== expected && a.href !== canon && html.includes(`href="${a.href}"`))) warn("no visible language switcher link to the equivalent page");
  if (cfg?.nap?.whatsapp && isContent(k) && !/wa\.me\/|whatsapp:|api\.whatsapp\.com/i.test(html)) warn("no WhatsApp click-to-chat link");

  // 11. tables
  const tables = tagContent(html, "table");
  tables.forEach((t, i) => {
    if (!/<caption/i.test(t)) warn(`table ${i + 1} has no <caption>`);
    if (!/<th\b/i.test(t)) warn(`table ${i + 1} has no <th> headers`);
    const headerRow = (t.match(/<tr[\s\S]*?<\/tr>/i) ?? [""])[0];
    const cols = (headerRow.match(/<t[hd]\b/gi) ?? []).length;
    if (cols > 5) warn(`table ${i + 1} has ${cols} columns (Layer 13.3: five or fewer for snippet eligibility)`);
  });

  // 12. JSON-LD
  const blocks = jsonLdBlocks(html);
  const nodes = ldNodes(blocks);
  for (const b of blocks) if (!b.ok) fail(`JSON-LD does not parse: ${b.error}`);
  if (!blocks.length && k !== "404") (isContent(k) ? fail : warn)("no JSON-LD block");
  // schema.org LocalBusiness subtypes count as the business node, FoodEstablishment and its subtypes included
  // (Bakery, CafeOrCoffeeShop, IceCreamShop, Restaurant…); @type may be a string or an array.
  const orgLike = nodes.find((n) => n["@id"]?.endsWith("#org") || hasType(n, "Organization") || hasType(n, "LocalBusiness") || [].concat(n["@type"] ?? []).some((t) => typeof t === "string" && (FOOD_TYPES.has(t) || /Business|Store|Dealer|Rental|Restaurant|Cafe|Clinic|Dentist|Physician|Repair|Agency|Company|Salon|Hotel|School|Shop/.test(t))));
  if (blocks.length && !orgLike && k !== "404") (isContent(k) ? fail : warn)("no Organization/LocalBusiness node in JSON-LD (embed the site graph on every page; an empty @graph is a placeholder)");
  if (orgLike) {
    for (const p of ["name", "url"]) if (!orgLike[p]) warn(`org node missing ${p}`);
    if (hasType(orgLike, "LocalBusiness") || [].concat(orgLike["@type"] ?? []).some((t) => FOOD_TYPES.has(t)) || /Business|Store|Dealer|Rental|Restaurant|Cafe|Clinic|Dentist|Repair|Salon|Hotel/.test(String(orgLike["@type"]))) {
      for (const p of ["address", "telephone"]) if (!orgLike[p]) warn(`local business node missing ${p}`);
    }
    if (orgLike.aggregateRating || orgLike.review) warn("self-serving aggregateRating/review on your own Organization/LocalBusiness is against Google's guidelines");
  }
  if (nodes.some((n) => n.potentialAction && JSON.stringify(n.potentialAction).includes("SearchAction"))) info("SearchAction (sitelinks search box) was deprecated by Google in Nov 2024");
  if (k !== "home" && k !== "404" && blocks.length && !nodes.some((n) => hasType(n, "BreadcrumbList"))) warn("no BreadcrumbList");
  const art = nodes.find((n) => ["Article", "BlogPosting", "NewsArticle", "TechArticle"].some((t) => hasType(n, t)));
  if (art) for (const p of ["author", "datePublished", "dateModified", "headline"]) if (!art[p]) fail(`Article node missing ${p}`);
  const faq = nodes.find((n) => hasType(n, "FAQPage"));
  if (faq) {
    const visible = stripTags(html).toLowerCase();
    for (const q of faq.mainEntity ?? []) {
      const name = (q.name ?? "").toLowerCase().replace(/\s+/g, " ").trim();
      if (name && !visible.includes(name.slice(0, 40))) warn(`FAQ question not visible on the page: "${q.name?.slice(0, 50)}"`);
    }
  }
  if (nodes.some((n) => hasType(n, "Product") && !n.offers)) warn("Product node without offers");

  // 13. author + dates
  const times = allTags(html, "time");
  const datetimes = times.map((t) => attr(t, "datetime")).filter(Boolean);
  if (art || ["pillar", "cluster", "city"].includes(k)) {
    if (datetimes.length < 1) warn("no <time datetime> published/updated dates visible");
    if (!/<footer[\s\S]*?<a[^>]*href=["'][^"']*(a-propos|about|auteur|author|equipe|team)[^"']*["']/i.test(mainHtml) && !/rel=["']author["']/i.test(html)) warn("no visible author link (bio page)");
  }
  for (const d of datetimes) if (!/^\d{4}-\d{2}-\d{2}/.test(d)) warn(`<time datetime="${d}"> is not ISO 8601`);
  if (["pillar"].includes(k) && !/(faq|questions fr[ée]quentes|الأسئلة)/i.test(html)) warn("pillar page without a FAQ section");
  if (["pillar"].includes(k) && !/yt-facade|youtube-nocookie\.com\/embed|youtube\.com\/embed/i.test(html) && !nodes.some((n) => hasType(n, "VideoObject"))) warn("pillar page without a video (Layer 10 gate: one YouTube video per pillar, facade + transcript + VideoObject)");

  // 14. placeholders and unverified statistics
  const ph = html.match(PLACEHOLDER);
  if (ph) fail(`placeholder left in page: "${ph[0]}"`);
  const statRe = /[^.!?]*\b\d[\d\s.,]*\s?(%|clients?|projets?|ans d'expérience|années|utilisateurs|commandes|véhicules|عميل|سنوات|٪)\b[^.!?]*/gi;
  const untracked = [];
  for (const m of mainHtml.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi)) {
    if (/data-fact=/i.test(m[1])) continue;
    const t = stripTags(m[2]);
    const s = t.match(statRe);
    if (s) untracked.push(...s.map((x) => x.trim()).filter((x) => x.length > 8));
  }
  if (untracked.length) warn(`${untracked.length} statistic sentence(s) without data-fact (verify with the client): ${untracked.slice(0, 2).map((s) => `"${s.slice(0, 60)}"`).join(" | ")}`);

  // 15. scripts, embeds, hidden text, weight
  const headScripts = allTags(head, "script").filter((t) => attr(t, "src") && !/\b(defer|async)\b/i.test(t));
  if (headScripts.length) warn(`${headScripts.length} render-blocking external script(s) in <head> (add defer)`);
  if (/<iframe[^>]*src=["'][^"']*(youtube\.com\/embed|youtube-nocookie\.com)/i.test(html)) warn("raw YouTube iframe (use the click-to-load facade from assets/lite-youtube.html)");
  if (/<iframe[^>]*src=["'][^"']*google\.com\/maps/i.test(html) && !/<iframe[^>]*loading=["']lazy/i.test(html)) warn("Google Maps iframe without loading=lazy");
  const hidden = [...html.matchAll(/<(p|div|span|h[1-6]|section|li)\b[^>]*(?:style=["'][^"']*(?:display\s*:\s*none|font-size\s*:\s*0|visibility\s*:\s*hidden|text-indent\s*:\s*-\d{3,}|opacity\s*:\s*0)[^"']*["']|\shidden(?:\s|>|=)|aria-hidden=["']true["']|class=["'][^"']*(?:sr-only|visually-hidden|screen-reader)[^"']*["'])[^>]*>([\s\S]*?)<\/\1>/gi)].filter((m) => wordCount(stripTags(m[2])) > 15);
  if (hidden.length) warn(`${hidden.length} hidden text block(s) with >15 words (hidden-text policy risk; <details> is the allowed way to collapse text)`);
  if (/(sponsor|partenaire payant|publicit[ée]|annonce)/i.test(stripTags(html)) && anchors.some((a) => /^https?:\/\//i.test(a.href) && !(site && a.href.startsWith(site)) && !/rel=["'][^"']*sponsored/i.test(a.tag))) info("page mentions sponsorship/ads and has external links without rel=\"sponsored\" — required on any paid placement (Layer 11.2)");
  const bytes = Buffer.byteLength(html, "utf8");
  if (bytes > 250 * 1024) warn(`HTML is ${(bytes / 1024).toFixed(0)} KB (aim well under 250 KB)`);
  if (!/href=["']#main["']/i.test(html)) info("no skip link (href=\"#main\")");
  if (k !== "home" && k !== "404" && !/aria-label=["'][^"']*(fil d['’]ariane|breadcrumb|مسار)/i.test(html)) warn("no breadcrumb <nav> (aria-label=\"Fil d'Ariane\")");
  if (!/data-nosnippet/i.test(html) && /(cookie|témoins)/i.test(html)) info("wrap the cookie/consent text in data-nosnippet so engines never lift it as the passage");
}

// ---------- site-level checks (directory mode) ----------
if (dirMode && !args["no-site"]) {
  const S = report.site;
  const has = (f) => existsSync(join(root, f));
  if (!has("robots.txt")) S.fails.push("robots.txt missing (run generate.mjs)");
  else {
    const r = readFileSync(join(root, "robots.txt"), "utf8");
    if (/^\s*User-agent:\s*\*\s*[\r\n]+(?:[^\r\n]*[\r\n]+)*?\s*Disallow:\s*\/\s*$/im.test(r)) S.fails.push("robots.txt disallows / for all agents");
    for (const b of CRAWLERS.filter((x) => x.tier === 1)) {
      const g = r.match(new RegExp(`User-agent:\\s*${b.ua}\\s*[\\r\\n]+([\\s\\S]*?)(?=User-agent:|Sitemap:|$)`, "i"));
      if (g && /Disallow:\s*\/\s*$/im.test(g[1])) S.fails.push(`robots.txt blocks ${b.ua}`);
      if (!g) S.infos.push(`robots.txt does not name ${b.ua} (falls back to *)`);
    }
    if (!/Content-Signal:/i.test(r)) S.infos.push("robots.txt has no Content-Signal line (declare search/ai-input/ai-train explicitly; Cloudflare's managed robots.txt sets ai-train=no by default)");
    if (!/Sitemap:/i.test(r)) S.warns.push("robots.txt has no Sitemap: line");
  }
  if (!has("sitemap.xml")) S.fails.push("sitemap.xml missing (run generate.mjs)");
  else {
    const sm = readFileSync(join(root, "sitemap.xml"), "utf8");
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const onDisk = new Set(docs.map((d) => d.url));
    for (const l of locs) if (!onDisk.has(l) && !onDisk.has(l.replace(/\/$/, ""))) S.fails.push(`sitemap lists a URL that does not exist on disk: ${l}`);
    for (const d of docs) {
      const k = kind(d.path);
      const noindex = (metaContent(d.html, "robots") ?? "").toLowerCase().includes("noindex");
      if (!noindex && k !== "404" && !locs.includes(d.url)) S.warns.push(`page not in sitemap: ${d.path}`);
    }
    if (bilingual && !/xhtml:link/.test(sm)) S.warns.push("sitemap has no hreflang alternates (xhtml:link)");
  }
  // doorway / near-duplicate detection (Layer 12.6, 16.2): main text compared after removing digits and place names; > 0.8 shingle overlap = FAIL
  const placeNames = new Set([...(cfg?.areaServed ?? []), cfg?.category?.city?.fr, cfg?.category?.city?.ar, ...(cfg?.category?.quartiers ?? [])].filter(Boolean).map((x) => String(x).toLowerCase()));
  const shingles = (text) => { const w = text.toLowerCase().replace(/\d+/g, " ").split(/\s+/).filter((x) => x && !placeNames.has(x)); const set = new Set(); for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(" ")); return set; };
  const contentDocs = docs.filter((d) => isContent(kind(d.path)) && kind(d.path) !== "home" && !/\[\[FACT NEEDED/.test(d.html)).map((d) => ({ path: d.path, sh: shingles(stripTags((d.html.match(/<main[\s\S]*?<\/main>/i) ?? [d.html])[0])) })).filter((d) => d.sh.size > 40);
  for (let i = 0; i < contentDocs.length; i++) for (let j = i + 1; j < contentDocs.length; j++) {
    const a = contentDocs[i], b = contentDocs[j];
    let inter = 0; for (const x of a.sh) if (b.sh.has(x)) inter++;
    const jaccard = inter / (a.sh.size + b.sh.size - inter);
    if (jaccard > 0.8) S.fails.push(`near-duplicate pages (${Math.round(jaccard * 100)}% shared text once digits and place names are removed): ${a.path} ↔ ${b.path} — doorway-page pattern; rewrite with content only that place/topic produces`);
    else if (jaccard > 0.6) S.warns.push(`${Math.round(jaccard * 100)}% shared text between ${a.path} and ${b.path} — thin differentiation`);
  }
  if (!has("404.html")) S.warns.push("no 404.html");
  const paths = docs.map((d) => d.path);
  if (!paths.some((p) => /(mentions|legal)/.test(p))) S.warns.push("no mentions légales page");
  if (!paths.some((p) => /(confidentialite|privacy|donnees)/.test(p))) S.warns.push("no politique de confidentialité page (Law 09-08 / CNDP)");
  if (!paths.some((p) => /contact/.test(p))) S.warns.push("no contact page");
  if (cfg?.indexnow?.key && !has(`${cfg.indexnow.key}.txt`)) S.warns.push("IndexNow key file missing at the root");
  if (!has("_redirects") && !has(".htaccess")) S.infos.push("no _redirects/.htaccess (host redirects for www/http)");
}

// ---------- output ----------
let fails = 0, warns = 0;
for (const p of report.pages) {
  fails += p.fails.length; warns += p.warns.length;
  const status = p.fails.length ? c.red("FAIL") : p.warns.length ? c.yellow("WARN") : c.green("PASS");
  console.log(`\n${status} ${c.bold(p.path)}`);
  p.fails.forEach((m) => console.log(`  ${c.red("✗")} ${m}`));
  p.warns.forEach((m) => console.log(`  ${c.yellow("!")} ${m}`));
  if (!args.quiet) p.infos.forEach((m) => console.log(`  ${c.dim("· " + m)}`));
}
if (dirMode && !args["no-site"]) {
  const S = report.site;
  fails += S.fails.length; warns += S.warns.length;
  console.log(`\n${c.bold("SITE")}`);
  S.fails.forEach((m) => console.log(`  ${c.red("✗")} ${m}`));
  S.warns.forEach((m) => console.log(`  ${c.yellow("!")} ${m}`));
  if (!args.quiet) S.infos.forEach((m) => console.log(`  ${c.dim("· " + m)}`));
}
report.summary = { pages: report.pages.length, fails, warns, generated: new Date().toISOString() };
console.log(`\n${report.pages.length} page(s): ${fails ? c.red(fails + " FAIL") : c.green("0 FAIL")}, ${warns ? c.yellow(warns + " WARN") : "0 WARN"}`);
if (args.json) { const jf = args.json === true ? "audit-report.json" : args.json; writeFileSync(jf, JSON.stringify(report, null, 2)); console.log(`report: ${jf}`); }
process.exit(fails ? 1 : 0);
