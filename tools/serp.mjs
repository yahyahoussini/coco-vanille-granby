#!/usr/bin/env node
// scripts/serp.mjs — the results page as data (Layers 7.2, 7.5, 13, 17): positions, SERP features, snippet owner, People Also Ask,
// AI Overview references, local pack, share of voice per domain, listicles/directories, and a local rank grid. Uses SerpApi
// (https://serpapi.com — paid; env SERPAPI_KEY). Every raw response is saved, so nothing is spent twice: --from-dir re-reads them.
// Field names follow the SerpApi Google / Google Maps / Related Questions / AI Overview JSON as documented in 2026; if a field is
// missing in a response, the value stays blank rather than guessed — check the raw JSON in serp/<week>/.
// Usage:
//   node serp.mjs [--prompts scoreboard/prompts.csv] [--ids C1,C5] [--type local] [--skip-type candidate] [--week 2026-W40] [--location "Granby,Quebec,Canada"]
//                 [--gl ca] [--domain google.ca] [--device mobile] [--paa-depth 0] [--aio] [--pages 1] [--from-dir serp/2026-W40] [--dry-run] [--help]
//   node serp.mjs local-grid --query "location voiture casablanca" --center 33.5731,-7.5898 [--radius-km 3] [--grid 5] [--zoom 14] [--place-id ChIJ…]
// Defaults: gl, google_domain and location come from the "market" block of site.config.json, else the Moroccan fallback (gl=ma,
// google.co.ma, a Moroccan location); hl is each prompt's lang (fr, en, es, ar), else the site's default language. --dry-run lists
// each search with its settings and spends nothing. A local-pack or grid listing is ours when its title contains brand.name,
// brand.nameAr or one of brand.alternateNames (the Business Profile may use another form of the name), or links to our domain.
// Writes: serp/<week>/<id>.json (raw), scoreboard/runs/<week>-google.csv (Google + AI Overview rows for citation-share.mjs),
//         serp/<week>/serp-map.md (docs/16 §1), share-of-voice.csv, paa.csv, listicles.csv, local-pack.csv, grid-<slug>.csv + .svg
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs, csvObjects, toCsv, c, isoWeek, marketConfig, langCode, printUsage, brandNameList } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
if (args.help) { printUsage(import.meta.url); process.exit(0); }
const mode = args._[0] === "local-grid" ? "local-grid" : "serp";
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const market = marketConfig(cfg);
const defaultLang = cfg?.languages?.default ?? "fr";
const hlFor = (p) => langCode(p.lang, defaultLang); // EN prompts get hl=en, ES prompts hl=es, never the French interface by default
const brandHost = (args.brand ?? (cfg ? new URL(cfg.site).host : "")).replace(/^www\./, "").toLowerCase();
const brandNames = brandNameList(cfg, args["brand-name"]); // brand.name (or --brand-name), nameAr, alternateNames: a pack listing under another form of the name is ours too
const KEY = process.env.SERPAPI_KEY ?? args.key;
const week = args.week ?? isoWeek();
const norm = (u) => { try { return new URL(u).host.replace(/^www\./, "").toLowerCase(); } catch { return String(u ?? "").replace(/^www\./, "").toLowerCase(); } };
const isBrand = (h) => !!brandHost && (norm(h) === brandHost || norm(h).endsWith("." + brandHost));
const nameMatch = (t) => brandNames.some((n) => String(t ?? "").toLowerCase().includes(n));

async function serpapi(params) {
  if (!KEY) throw new Error("SERPAPI_KEY missing (env) — see docs/12-setup-mesure.md → API.");
  const u = new URL("https://serpapi.com/search.json");
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") u.searchParams.set(k, v);
  u.searchParams.set("api_key", KEY);
  const res = await fetch(u, { signal: AbortSignal.timeout(60000) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(`SerpApi ${res.status}: ${json.error ?? JSON.stringify(json).slice(0, 200)}`);
  return json;
}

// SerpApi canonical location name (free endpoint, no key): serp/locations.json caches the answer per city. The market block's
// "location" is used as it is (no lookup); without a market block the Moroccan fallback applies.
async function canonicalLocation(city) {
  if (market.location) return market.location;
  if (!city) return market.fallback ? "Morocco" : "";
  const cacheFile = join("serp", "locations.json");
  const key = market.fallback ? city : `${market.country}:${city}`;
  let cache = {}; try { cache = JSON.parse(readFileSync(cacheFile, "utf8")); } catch {}
  if (cache[key]) return cache[key];
  try {
    const res = await fetch(`https://serpapi.com/locations.json?q=${encodeURIComponent(city)}&limit=5`, { signal: AbortSignal.timeout(15000) });
    const list = await res.json();
    const all = Array.isArray(list) ? list : [];
    const hit = all.find((l) => market.country && String(l.country_code ?? "").toUpperCase() === market.country) ?? (market.fallback ? all.find((l) => /morocco/i.test(l.canonical_name ?? "")) : null) ?? all[0] ?? null;
    if (hit?.canonical_name) { cache[key] = hit.canonical_name; mkdirSync("serp", { recursive: true }); writeFileSync(cacheFile, JSON.stringify(cache, null, 1)); return hit.canonical_name; }
  } catch {}
  if (!market.fallback) return city;
  return /casablanca/i.test(city) ? "Casablanca,Casablanca-Settat,Morocco" : `${city}, Morocco`;
}

// ---------- analysis of one Google SERP ----------
const DIRECTORY_HOSTS = /(pagesjaunes|yellowpages|annuaire|telecontact|kompass|trustpilot|yelp|tripadvisor|booking|avito|jumia|glassdoor|indeed|linkedin|facebook|instagram|youtube|wikipedia|reddit|quora|medium|maroc\.ma|petitesannonces|mubawab|sarouty|kelkoo)/i;
export function pageType(r) {
  const t = `${r.title ?? ""}`.toLowerCase(), h = norm(r.link);
  if (DIRECTORY_HOSTS.test(h)) return "directory/platform";
  if (/^\s*(top|les \d+|\d+ meilleurs|meilleurs?|best|classement|comparatif|أفضل|افضل)\b|\b\d+\s+(meilleurs?|best|top)\b/.test(t)) return "listicle";
  if (/\b(avis|review|test|témoignage)\b/.test(t)) return "review";
  if (/\b(prix|tarif|price|cost|combien|أسعار|ثمن)\b/.test(t)) return "price page";
  if (/\b(comment|guide|conseils|étapes|how to|كيف)\b/.test(t)) return "guide";
  return "service/brand page";
}
export function analyze(json, promptRow = {}) {
  const organic = json.organic_results ?? [];
  const pos = organic.find((r) => isBrand(r.link))?.position ?? 0;
  const ab = json.answer_box ?? null;
  const snippetOwner = ab?.link ? norm(ab.link) : "";
  const paa = (json.related_questions ?? []).map((q) => ({ question: q.question, snippet: q.snippet ?? q.title ?? "", link: q.link ?? "", token: q.next_page_token ?? "" }));
  const aio = json.ai_overview ?? null;
  const aioRefs = (aio?.references ?? []).map((r) => norm(r.link));
  const places = json.local_results?.places ?? (Array.isArray(json.local_results) ? json.local_results : []);
  const packHit = places.findIndex((p) => nameMatch(p.title) || isBrand(p.links?.website ?? p.website ?? p.link ?? ""));
  const features = {
    ads: (json.ads ?? []).length + (json.shopping_results ?? []).length > 0, local_pack: places.length > 0, snippet: !!ab, paa: paa.length > 0,
    ai_overview: !!aio, video: (json.inline_videos ?? []).length > 0 || (json.video_results ?? []).length > 0, images: (json.inline_images ?? []).length > 0,
    forums: (json.discussions_and_forums ?? []).length > 0, shopping: (json.shopping_results ?? []).length > 0, sitelinks: organic.some((r) => r.sitelinks),
    knowledge: !!json.knowledge_graph, top_stories: (json.top_stories ?? []).length > 0,
  };
  const top10 = organic.filter((r) => r.link).slice(0, 10).map((r) => ({ position: r.position, host: norm(r.link), link: r.link, title: r.title, type: pageType(r), date: r.date ?? "" }));
  const types = top10.slice(0, 3).map((r) => r.type);
  const winning = types.filter((t) => t === "listicle").length >= 2 ? "listicle / comparison" : features.local_pack && (promptRow.type === "local" || /près|near|à |في /i.test(promptRow.prompt ?? "")) ? "Business Profile + local page" : types.includes("price page") ? "price page with table" : types.includes("guide") ? "guide with answer block" : "service page with proof";
  const intent = winning.startsWith("listicle") ? "commercial (comparative)" : winning.startsWith("Business") ? "local" : winning.startsWith("guide") ? "informational" : promptRow.type ?? "commercial";
  return { position: pos, snippetOwner, snippetType: ab?.type ?? "", paa, aio: !!aio, aioRefs, aioCited: aioRefs.some(isBrand), aioToken: aio?.page_token ?? "", places: places.map((p) => ({ position: p.position, title: p.title, rating: p.rating ?? "", reviews: p.reviews ?? "", place_id: p.place_id ?? "" })), mapPack: places.length ? (packHit >= 0 ? "yes" : "no") : "", mapPackPosition: packHit >= 0 ? packHit + 1 : "", features, top10, winning, intent, related: (json.related_searches ?? []).map((r) => r.query ?? r.name ?? "").filter(Boolean), total: json.search_information?.total_results ?? "" };
}

function featureCell(f) { return f ? "☑" : "☐"; }

async function runSerp() {
  const promptsFile = args.prompts ?? "scoreboard/prompts.csv";
  if (!existsSync(promptsFile)) { console.error(`No prompts file: ${promptsFile}`); process.exit(1); }
  let prompts = csvObjects(readFileSync(promptsFile, "utf8")).filter((p) => p.prompt);
  if (args.ids) { const ids = new Set(String(args.ids).split(",")); prompts = prompts.filter((p) => ids.has(p.id)); }
  if (args.type) { const types = new Set(String(args.type).split(",")); prompts = prompts.filter((p) => types.has(p.type)); }
  if (args["skip-type"]) { const skip = new Set(String(args["skip-type"]).split(",")); prompts = prompts.filter((p) => !skip.has(p.type)); }
  const dir = args["from-dir"] ?? join("serp", week);
  mkdirSync(dir, { recursive: true });
  const city = market.city; // nap.city, else category.city.fr
  const location = args.location ?? (await canonicalLocation(city)); // SerpApi wants its canonical name ("Granby,Quebec,Canada"); the market block gives it, else resolved once via locations.json and cached
  const gl = args.gl ?? market.gl, domain = args.domain ?? market.googleDomain;
  console.log(c.dim(`SERP settings (${market.fallback ? "Moroccan defaults: no market block in site.config.json" : "site.config.json market"}): location "${location}" · gl=${gl} · ${domain} · hl per prompt lang · ${prompts.length} prompts`));
  const rows = [], mapRows = [], sov = new Map(), paaRows = [], listicles = [], packRows = [], perPrompt = [];
  for (const p of prompts) {
    const file = join(dir, `${p.id}.json`);
    let json;
    if (existsSync(file) && (args["from-dir"] || !args.refresh)) json = JSON.parse(readFileSync(file, "utf8"));
    else if (args["dry-run"]) { console.log(`would query: ${p.id} "${p.prompt}" (${location}, gl=${gl}, ${domain}, hl=${hlFor(p)})`); continue; }
    else {
      try {
        const base = { engine: "google", q: p.prompt, location, gl, hl: hlFor(p), google_domain: domain, device: args.device ?? "mobile" };
        json = await serpapi(base);
        // Google serves 10 results per page ("num" is gone): --pages 2 fetches positions 11–20 with start=10 (one more search per prompt)
        for (let pg = 1; pg < +(args.pages ?? 1); pg++) { try { const more = await serpapi({ ...base, start: pg * 10 }); json.organic_results = [...(json.organic_results ?? []), ...(more.organic_results ?? [])]; } catch (e) { json.page_error = e.message; break; } }
        if (args.aio && json.ai_overview?.page_token) { try { json.ai_overview = { ...json.ai_overview, ...(await serpapi({ engine: "google_ai_overview", page_token: json.ai_overview.page_token })).ai_overview }; } catch (e) { json.ai_overview_error = e.message; } }
        const depth = +(args["paa-depth"] ?? 0);
        if (depth > 0) { // expand People Also Ask: each expansion is one more search
          let frontier = (json.related_questions ?? []).filter((q) => q.next_page_token).slice(0, 4), level = 0; json.paa_expanded = [];
          while (frontier.length && level < depth) { const next = []; for (const q of frontier) { try { const r = await serpapi({ engine: "google_related_questions", next_page_token: q.next_page_token }); for (const x of r.related_questions ?? []) { json.paa_expanded.push({ ...x, parent: q.question, level: level + 1 }); if (x.next_page_token) next.push(x); } } catch {} } frontier = next.slice(0, 4); level++; }
        }
        writeFileSync(file, JSON.stringify(json, null, 1));
      } catch (e) { console.log(c.yellow(`${p.id}: ${e.message}`)); continue; }
    }
    const a = analyze(json, p);
    const feat = Object.entries(a.features).filter(([, v]) => v).map(([k]) => k).join(" ");
    perPrompt.push({ id: p.id, prompt: p.prompt, type: p.type, lang: p.lang, w_score: p.w_score ?? "", position: a.position, owner: a.top10[0]?.host ?? "", top3: a.top10.slice(0, 3).map((r) => ({ host: r.host, type: r.type, title: r.title })), top10: a.top10.map((r) => r.host), snippetOwner: a.snippetOwner, aio: a.aio, aioRefs: a.aioRefs, aioCited: a.aioCited, mapPack: a.mapPack, mapPackPosition: a.mapPackPosition, places: a.places, features: feat.split(" ").filter(Boolean), winning: a.winning, intent: a.intent, paa: a.paa.map((q) => q.question), related: a.related });
    rows.push({ week, prompt_id: p.id, engine: "Google", google_position: a.position, snippet_owner: a.snippetOwner, ai_overview_cited: a.aio ? (a.aioCited ? "yes" : "no") : "", cited_domains: a.aioRefs.join(";"), brand_named: "", brand_position: "", third_party_names_us: "", map_pack: a.mapPack, notes: `${feat}; top3: ${a.top10.slice(0, 3).map((r) => r.host).join(", ")}` });
    if (a.aio) rows.push({ week, prompt_id: p.id, engine: "AI Overview", google_position: "", snippet_owner: "", ai_overview_cited: a.aioCited ? "yes" : "no", cited_domains: a.aioRefs.join(";"), brand_named: "", brand_position: a.aioCited ? a.aioRefs.findIndex(isBrand) + 1 : "", third_party_names_us: "", map_pack: "", notes: "" });
    mapRows.push(`| ${p.id} ${p.prompt} | ${["ads", "local_pack", "snippet", "paa", "ai_overview", "video", "images", "forums", "shopping", "sitelinks"].map((k) => featureCell(a.features[k])).join(" | ")} | ${a.top10.slice(0, 3).map((r) => `${r.type} (${r.host})`).join("; ")} | ${a.winning} | ${a.intent} | ${a.position || "—"} |`);
    for (const r of a.top10) { const s = sov.get(r.host) ?? { host: r.host, top10: 0, top3: 0, top1: 0, snippets: 0, aio_refs: 0, local_pack: 0, prompts: new Set() }; s.top10++; if (r.position <= 3) s.top3++; if (r.position === 1) s.top1++; s.prompts.add(p.id); sov.set(r.host, s); }
    if (a.snippetOwner) { const s = sov.get(a.snippetOwner) ?? { host: a.snippetOwner, top10: 0, top3: 0, top1: 0, snippets: 0, aio_refs: 0, local_pack: 0, prompts: new Set() }; s.snippets++; sov.set(a.snippetOwner, s); }
    for (const h of a.aioRefs) { const s = sov.get(h) ?? { host: h, top10: 0, top3: 0, top1: 0, snippets: 0, aio_refs: 0, local_pack: 0, prompts: new Set() }; s.aio_refs++; sov.set(h, s); }
    for (const q of [...a.paa, ...(json.paa_expanded ?? []).map((x) => ({ question: x.question, snippet: x.snippet ?? "", link: x.link ?? "", parent: x.parent, level: x.level }))]) paaRows.push({ prompt_id: p.id, level: q.level ?? 0, parent: q.parent ?? "", question: q.question, answer_source: norm(q.link), snippet: (q.snippet ?? "").slice(0, 200) });
    for (const r of a.top10.concat((json.organic_results ?? []).slice(10, 30).map((r) => ({ position: r.position, host: norm(r.link), link: r.link, title: r.title, type: pageType(r) })))) if (r.type === "listicle" || r.type === "directory/platform") listicles.push({ prompt_id: p.id, query: p.prompt, position: r.position, host: r.host, url: r.link, title: r.title, type: r.type });
    for (const pl of a.places) packRows.push({ prompt_id: p.id, ...pl, is_us: nameMatch(pl.title) ? "yes" : "" });
  }
  if (!rows.length) return;
  mkdirSync("scoreboard/runs", { recursive: true });
  const runsFile = join("scoreboard/runs", `${week}-google.csv`);
  writeFileSync(runsFile, toCsv(rows, ["week", "prompt_id", "engine", "google_position", "snippet_owner", "ai_overview_cited", "cited_domains", "brand_named", "brand_position", "third_party_names_us", "map_pack", "notes"]));
  const sovRows = [...sov.values()].map((s) => ({ ...s, prompts: s.prompts.size, is_us: isBrand(s.host) ? "yes" : "", score: s.top10 + 2 * s.top3 + 3 * s.top1 + 2 * s.snippets + 2 * s.aio_refs })).sort((a, b) => b.score - a.score);
  writeFileSync(join(dir, "share-of-voice.csv"), toCsv(sovRows, ["host", "is_us", "prompts", "top10", "top3", "top1", "snippets", "aio_refs", "score"]));
  writeFileSync(join(dir, "paa.csv"), toCsv(paaRows, ["prompt_id", "level", "parent", "question", "answer_source", "snippet"]));
  writeFileSync(join(dir, "listicles.csv"), toCsv(listicles, ["prompt_id", "query", "position", "host", "url", "title", "type"]));
  writeFileSync(join(dir, "local-pack.csv"), toCsv(packRows, ["prompt_id", "position", "title", "rating", "reviews", "place_id", "is_us"]));
  const md = [`# Carte des pages de résultats — ${week} (${location}, mobile) — généré par serp.mjs`, "", "| Prompt | Annonces | Pack local | Extrait | PAA | AI Overview | Vidéo | Images | Forums | Shopping | Sitelinks | Type de page 1–3 | Format qui gagne | Intention | Notre position |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|", ...mapRows, "", `## Part de voix (top 10 sur ${prompts.length} prompts) — qui possède le marché aujourd'hui`, "| Domaine | Nous | Prompts | Top 10 | Top 3 | N°1 | Extraits | Réf. AI Overview | Score |", "|---|---|---|---|---|---|---|---|---|", ...sovRows.slice(0, 15).map((s) => `| ${s.host} | ${s.is_us} | ${s.prompts} | ${s.top10} | ${s.top3} | ${s.top1} | ${s.snippets} | ${s.aio_refs} | ${s.score} |`)];
  writeFileSync(join(dir, "serp-map.md"), md.join("\n") + "\n");
  writeFileSync(join(dir, "prompts.json"), JSON.stringify({ week, location, prompts: perPrompt }, null, 1));
  console.log(c.bold(`SERP run ${week}: ${prompts.length} prompts → ${runsFile}`));
  console.log(`Share of voice (top 8): ${sovRows.slice(0, 8).map((s) => `${s.is_us ? c.green(s.host) : s.host} ${s.score}`).join(" · ")}`);
  console.log(`PAA harvested: ${paaRows.length} · listicles/directories: ${listicles.length} · local-pack rows: ${packRows.length} · AI Overviews seen: ${rows.filter((r) => r.engine === "AI Overview").length}`);
  console.log(c.dim(`written ${dir}/serp-map.md, share-of-voice.csv, paa.csv, listicles.csv, local-pack.csv — then: npm run score`));
}

// ---------- local grid (Layer 12): rank in Google Maps at N×N points around the business ----------
async function runGrid() {
  const q = args.query, center = String(args.center ?? (cfg?.geo?.lat ? `${cfg.geo.lat},${cfg.geo.lng}` : "")).split(",").map(Number);
  if (!q || center.length !== 2 || center.some(isNaN)) { console.error("local-grid needs --query and --center lat,lng"); process.exit(1); }
  const n = +(args.grid ?? 5), radius = +(args["radius-km"] ?? 3), zoom = args.zoom ?? "14";
  const dir = args["from-dir"] ?? join("serp", week); mkdirSync(dir, { recursive: true });
  const slug = q.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, "-").replace(/^-|-$/g, "");
  const dLat = radius / 111, dLng = radius / (111 * Math.cos((center[0] * Math.PI) / 180));
  const points = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) points.push({ i, j, lat: center[0] - dLat + (2 * dLat * i) / (n - 1 || 1), lng: center[1] - dLng + (2 * dLng * j) / (n - 1 || 1) });
  const results = [];
  for (const pt of points) {
    const file = join(dir, `grid-${slug}-${pt.i}-${pt.j}.json`);
    let json;
    if (existsSync(file)) json = JSON.parse(readFileSync(file, "utf8"));
    else if (args["dry-run"]) { console.log(`would query maps at ${pt.lat.toFixed(4)},${pt.lng.toFixed(4)}`); continue; }
    else { try { json = await serpapi({ engine: "google_maps", q, ll: `@${pt.lat.toFixed(6)},${pt.lng.toFixed(6)},${zoom}z`, type: "search", hl: args.hl ?? defaultLang }); writeFileSync(file, JSON.stringify(json, null, 1)); } catch (e) { console.log(c.yellow(`grid ${pt.i},${pt.j}: ${e.message}`)); continue; } }
    const list = json.local_results ?? (json.place_results ? [json.place_results] : []); // a single-business match comes back as place_results
    const idx = list.findIndex((r) => (args["place-id"] && r.place_id === args["place-id"]) || nameMatch(r.title) || isBrand(r.website ?? ""));
    results.push({ i: pt.i, j: pt.j, lat: pt.lat.toFixed(5), lng: pt.lng.toFixed(5), rank: idx >= 0 ? idx + 1 : "", top: list.slice(0, 3).map((r) => r.title).join(" | ") });
  }
  if (!results.length) return;
  writeFileSync(join(dir, `grid-${slug}.csv`), toCsv(results, ["i", "j", "lat", "lng", "rank", "top"]));
  const cell = 60, pad = 20, svg = [`<svg xmlns="http://www.w3.org/2000/svg" width="${n * cell + 2 * pad}" height="${n * cell + 2 * pad + 30}" font-family="sans-serif" font-size="14">`, `<text x="${pad}" y="16">${q} — grille ${n}×${n}, rayon ${radius} km, ${week}</text>`];
  for (const r of results) { const rank = +r.rank || 21; const col = rank <= 3 ? "#2e7d32" : rank <= 10 ? "#f9a825" : "#c62828"; svg.push(`<rect x="${pad + r.j * cell}" y="${pad + 20 + (n - 1 - r.i) * cell}" width="${cell - 2}" height="${cell - 2}" fill="${col}" /><text x="${pad + r.j * cell + cell / 2 - 8}" y="${pad + 20 + (n - 1 - r.i) * cell + cell / 2 + 5}" fill="#fff">${r.rank || "20+"}</text>`); }
  svg.push("</svg>"); writeFileSync(join(dir, `grid-${slug}.svg`), svg.join("\n"));
  const ranked = results.filter((r) => r.rank), avg = ranked.length ? (ranked.reduce((s, r) => s + +r.rank, 0) / ranked.length).toFixed(1) : "n/a";
  console.log(c.bold(`Local grid "${q}": ${results.length} points · in top 3 at ${results.filter((r) => +r.rank && +r.rank <= 3).length} · top 10 at ${results.filter((r) => +r.rank && +r.rank <= 10).length} · not found at ${results.filter((r) => !r.rank).length} · average rank where found ${avg}`));
  console.log(c.dim(`written ${dir}/grid-${slug}.csv + .svg — red cells are the districts to win (GBP categories, local page content, reviews from those quartiers)`));
}

if (mode === "local-grid") runGrid(); else runSerp();
