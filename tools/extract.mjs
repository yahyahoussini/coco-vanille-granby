// scripts/extract.mjs — page profiler shared by crawl.mjs, content-gap.mjs, freshness.mjs, market.mjs, programmatic.mjs.
// Turns one HTML document into the numbers the market analysis compares: words, headings, questions, tables, lists, FAQ,
// numbers per 100 words (fact density), dates, entities, terms, schema types, media, citations, author, CTAs. No DOM, no deps.
import { stripTags, wordCount, allTags, attr, tagContent, metaContent, linkHref, jsonLdBlocks, ldNodes } from "./lib.mjs";

// ---------- stop words (FR + EN + AR, compact; enough to keep term lists meaningful) ----------
const STOP = new Set(`
le la les l un une des du de d et ou où mais donc or ni car que qui quoi dont à a au aux en dans par pour sur sous avec sans chez vers entre
ce cet cette ces se sa son ses leur leurs mon ma mes ton ta tes notre nos votre vos il elle ils elles on nous vous je tu me te lui y ne pas plus
est sont été être avoir ai as ont était étaient sera seront fait faire peut peuvent pouvez doit doivent aussi très bien tout tous toute toutes
comme si non oui même autre autres encore déjà toujours jamais ici là alors ainsi afin lors depuis pendant avant après selon cela ça ceci celui celle
ceux celles chaque plusieurs quelques certains certaines nombreux nombreuses grand grande petit petite nouveau nouvelle bon bonne meilleur meilleure
the a an and or but of to in on at by for with from as is are was were be been being have has had do does did this that these those it its
they them their we our you your he she his her not no yes so if then than too very can could will would should may might also more most
into over about after before between under out up down all any each other some such only own same just how what which who whom when where why
في من على إلى عن مع أن إن أو و يا هذا هذه ذلك تلك التي الذي الذين هو هي هم هن أنا نحن أنت أنتم كان كانت يكون تكون ليس لا لم لن ما ماذا كيف أين متى لماذا
كل بعض أي قد ثم حتى بل لكن إذا إذ لدى عند بين فوق تحت أمام خلف حول منذ خلال بعد قبل هنا هناك جدا أكثر أقل غير سوى الى او هذا
`.trim().split(/\s+/));

const QUESTION_START = /^(comment|pourquoi|quand|combien|quel|quelle|quels|quelles|qui|que|quoi|où|est-ce|faut-il|peut-on|doit-on|how|why|when|what|which|who|where|is|are|can|does|do|should|كيف|لماذا|متى|كم|ما|ماذا|أين|هل|من)\b/i;

const UNIT_RE = /(\d[\d\s.,]*)\s?(%|dh|dhs|mad|dirhams?|€|eur|\$|usd|km|m²|m2|km\/h|kg|g|h|min|jours?|ans?|mois|semaines?|days?|years?|hours?|minutes?|درهم|كم|يوم|سنة|شهر|ساعة)\b/gi;

export function normalizeToken(t) {
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

export function tokens(text) {
  return text.split(/[\s"“”«»(),;:!?/\\|[\]{}<>]+/).map(normalizeToken).filter((t) => t.length > 1 && /\p{L}/u.test(t));
}

export function termFrequency(text, { bigrams = true } = {}) {
  const tf = new Map();
  const add = (k) => tf.set(k, (tf.get(k) ?? 0) + 1);
  for (const sentence of text.split(/[.!?؟:;|\n]+/)) { // bigrams never cross a sentence boundary
    const toks = tokens(sentence);
    for (let i = 0; i < toks.length; i++) {
      const a = toks[i];
      if (!STOP.has(a) && a.length > 2) add(a);
      if (bigrams && i + 1 < toks.length) {
        const b = toks[i + 1];
        if (!STOP.has(a) && !STOP.has(b) && a.length > 2 && b.length > 2) add(`${a} ${b}`);
      }
    }
  }
  return tf;
}

// Capitalised sequences (FR/EN proper nouns: places, brands, products, laws) — Arabic has no case, so Arabic entities come from term frequency.
const UI_WORDS = new Set("questions question reponse reponses demander appeler ecrire publie mis par sommaire accueil contact faq source sources note notes lire voir suite plus menu fermer ouvrir devis whatsapp telephone email adresse horaires prix tarif tarifs formule inclus oui non".split(" "));
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
export function entities(text) {
  const out = new Map();
  const re = /(?:^|[\s(«"'])((?:[A-ZÀ-ÝŒ][\p{L}\p{N}'’-]+)(?:\s(?:de|du|des|d'|d’|la|le|les|et|al|el|of|the|&)?\s?[A-ZÀ-ÝŒ][\p{L}\p{N}'’-]+){0,4})/gu;
  let m;
  const sentenceStart = /[.!?]\s*$/;
  while ((m = re.exec(text))) {
    const e = m[1].trim();
    const before = text.slice(Math.max(0, m.index - 3), m.index + 1);
    if (e.split(" ").length === 1 && (m.index === 0 || sentenceStart.test(before))) continue; // sentence-initial single word: skip
    if (STOP.has(e.toLowerCase())) continue;
    if (e.split(/\s+/).every((w) => UI_WORDS.has(norm(w)) || STOP.has(norm(w)))) continue; // "Questions", "WhatsApp Appeler": interface words, not entities
    out.set(e, (out.get(e) ?? 0) + 1);
  }
  return out;
}

export function isQuestion(text) {
  const t = text.trim();
  return /[?؟]\s*$/.test(t) || QUESTION_START.test(t);
}

// links that are actions or profiles, never evidence: excluded from the external-citation count
const NOT_CITATION = /^(wa\.me|api\.whatsapp\.com|facebook\.com|instagram\.com|linkedin\.com|x\.com|twitter\.com|tiktok\.com|youtube\.com|youtu\.be|maps\.google\.com|goo\.gl|maps\.app\.goo\.gl|g\.page|wa\.link)$/i;

function mainHtml(html) {
  const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i) ?? [, html])[1];
  const main = body.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? body.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  const scoped = main ?? body.replace(/<(nav|header|footer|aside)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  return scoped.replace(/<(script|style|noscript|template|svg)[^>]*>[\s\S]*?<\/\1>/gi, " ");
}

export function profilePage(html, { url = "" } = {}) {
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? html;
  const htmlTag = html.match(/<html[^>]*>/i)?.[0] ?? "";
  const main = mainHtml(html);
  const text = stripTags(main);
  const words = wordCount(text);
  const headings = [];
  for (const m of main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) headings.push({ level: +m[1], text: stripTags(m[2]) });
  const h1 = headings.find((h) => h.level === 1)?.text ?? stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const summaries = tagContent(main, "summary").map(stripTags);
  const questions = [...headings.filter((h) => h.level >= 2 && isQuestion(h.text)).map((h) => h.text), ...summaries.filter(isQuestion)];
  const paragraphs = tagContent(main, "p").map(stripTags).filter((p) => wordCount(p) > 3);
  const tables = allTags(main, "table").length;
  const tableRows = (main.match(/<tr\b/gi) ?? []).length;
  const ol = allTags(main, "ol").length, ul = allTags(main, "ul").length;
  const details = allTags(main, "details").length;
  const quotes = allTags(main, "blockquote").length + allTags(main, "q").length;
  const numbers = [...text.matchAll(UNIT_RE)].length + (text.match(/\b\d{2,}(?:[.,]\d+)?\b/g) ?? []).length;
  const years = [...new Set((text.match(/\b(20[1-3]\d)\b/g) ?? []).map(Number))].sort();
  const blocks = jsonLdBlocks(html);
  const nodes = ldNodes(blocks);
  const schemaTypes = [...new Set(nodes.flatMap((n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]])))];
  const ldDate = nodes.map((n) => n.dateModified ?? n.datePublished).find(Boolean) ?? null;
  const timeTags = allTags(html, "time").map((t) => attr(t, "datetime")).filter(Boolean);
  const metaMod = metaContent(html, "article:modified_time") ?? metaContent(html, "article:published_time");
  const dateModified = [ldDate, metaMod, ...timeTags].filter(Boolean).map((d) => String(d).slice(0, 10)).sort().at(-1) ?? null;
  const author = nodes.map((n) => (typeof n.author === "object" ? n.author?.name : n.author)).find(Boolean) ?? metaContent(html, "author") ?? null;
  const imgs = allTags(main, "img");
  const images = imgs.length, imagesAlt = imgs.filter((t) => (attr(t, "alt") ?? "").trim().length > 2).length;
  const video = /youtube\.com\/embed|youtu\.be|<video\b|lite-youtube|yt-facade|vimeo\.com/i.test(html) || schemaTypes.includes("VideoObject");
  const links = allTags(main, "a").map((t) => attr(t, "href") ?? "").filter(Boolean);
  let host = ""; try { host = new URL(url).host.replace(/^www\./, ""); } catch {}
  const external = new Set(), internal = [];
  for (const h of links) {
    if (/^(tel:|mailto:|#|javascript:)/i.test(h)) continue;
    if (/^https?:\/\//i.test(h)) { try { const u = new URL(h); const hh = u.host.replace(/^www\./, ""); if (!host || hh !== host) { if (!NOT_CITATION.test(hh)) external.add(hh); } else internal.push(h); } catch {} }
    else internal.push(h);
  }
  const ctas = links.filter((h) => /^tel:|wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(h)).length;
  // every internal link of the whole document (nav, footer included) — what a crawler follows
  const allHrefs = allTags(html, "a").map((t) => attr(t, "href") ?? "").filter((h) => h && !/^(tel:|mailto:|#|javascript:)/i.test(h));
  const bodyInternal = allHrefs.filter((h) => { if (!/^https?:\/\//i.test(h)) return true; try { return !host || new URL(h).host.replace(/^www\./, "") === host; } catch { return false; } });
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) ?? []).length;
  const robots = metaContent(html, "robots") ?? "";
  return {
    url, host,
    title: stripTags(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: metaContent(html, "description") ?? "",
    canonical: linkHref(html, "canonical")[0]?.href ?? null,
    noindex: /noindex/i.test(robots),
    lang: attr(htmlTag, "lang") ?? "", dir: attr(htmlTag, "dir") ?? "",
    h1, headings, questions, faqItems: details,
    words, paragraphs: paragraphs.length, firstParagraphWords: paragraphs[0] ? wordCount(paragraphs[0]) : 0,
    tables, tableRows, orderedLists: ol, unorderedLists: ul, quotes,
    numbers, factDensity: words ? +((100 * numbers) / words).toFixed(1) : 0, years, latestYear: years.at(-1) ?? null,
    dateModified, author, schemaTypes, hasFaqSchema: schemaTypes.includes("FAQPage"), hasBreadcrumb: schemaTypes.includes("BreadcrumbList"),
    images, imagesAlt, video, externalHosts: [...external], externalLinks: external.size, internalLinks: internal.length, ctas,
    arabicShare: text.length ? +(arabicChars / text.length).toFixed(2) : 0,
    text, internalHrefs: bodyInternal, allHrefs,
  };
}

// Compact version for JSON/CSV storage (drops the text and hrefs).
export function summarize(p) {
  const { text, internalHrefs, allHrefs, headings, ...rest } = p;
  return { ...rest, headingCount: headings.length };
}

// Similarity of two short strings (token Jaccard) — used to match questions across pages.
export function similar(a, b, threshold = 0.5) {
  const A = new Set(tokens(a).filter((t) => !STOP.has(t))), B = new Set(tokens(b).filter((t) => !STOP.has(t)));
  if (!A.size || !B.size) return false;
  let inter = 0; for (const t of A) if (B.has(t)) inter++;
  return inter / (A.size + B.size - inter) >= threshold;
}

export { STOP };
