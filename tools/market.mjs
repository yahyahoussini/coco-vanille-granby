#!/usr/bin/env node
// scripts/market.mjs — the market map and the battle plan (Layers 7.1, 7.5, 7.7, 9.2, 12, 14, 15): who owns the category today on Google,
// in the AI engines and in the map pack, prompt by prompt; what each winner's page is; each competitor's exploitable weaknesses;
// the fan-out topics nobody covers; and the ordered list of moves that take first place. Writes scoreboard/market/<week>.md (never
// docs/19-marche-et-concurrence.md unless --out names it: that document is completed by hand).
// Reads whatever exists (everything optional; empty sections say what fills them):
//   serp/<week>/prompts.json, share-of-voice.csv, local-pack.csv, listicles.csv, paa.csv   (serp.mjs)
//   scoreboard/runs/*.csv (hand-filled or ai-runs.mjs / serp.mjs; not runs/proxy/, PROXY rows left out; several runs of a case → what most agree on),
//   ai/<week>/share-of-model.csv, fanout.csv   (ai-runs.mjs)
//   crawl/<host>.json (crawl.mjs on each competitor), docs/gaps/*.json (content-gap.mjs --json), scoreboard/competitors.csv (name,domain,gbp_rating,gbp_reviews,notes)
//   scoreboard/prompts.csv (w_score), site.config.json (pages[] titles → topics we already cover; languages.others → the versions a competitor lacks)
// Usage: node market.mjs [--week 2026-W40] [--out scoreboard/market/2026-W40.md]
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { loadConfig, parseArgs, csvObjects, c, isoWeek, isoDate, readRuns, caseRow, brandNameList } from "./lib.mjs";
import { tokens, STOP } from "./extract.mjs";

const args = parseArgs(process.argv.slice(2));
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const brandHost = (args.brand ?? (cfg ? new URL(cfg.site).host : "")).replace(/^www\./, "").toLowerCase();
const brandName = cfg?.brand?.name ?? brandHost;
if (!brandHost) { console.error("Need site.config.json or --brand <host>"); process.exit(1); }
const norm = (d) => String(d ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
const isBrand = (h) => norm(h) === brandHost || norm(h).endsWith("." + brandHost);
const yes = (v) => /^(y|yes|oui|1|true)$/i.test((v ?? "").trim());
const latestDir = (base) => existsSync(base) ? readdirSync(base).filter((d) => /^\d{4}-W\d{2}$/.test(d)).sort().at(-1) : null;
const week = args.week ?? latestDir("serp") ?? latestDir("ai") ?? isoWeek();
const readCsv = (p) => (existsSync(p) ? csvObjects(readFileSync(p, "utf8")) : []);
const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

// ---------- inputs ----------
const serp = readJson(join("serp", week, "prompts.json"));
const sov = readCsv(join("serp", week, "share-of-voice.csv"));
const pack = readCsv(join("serp", week, "local-pack.csv"));
const listicles = readCsv(join("serp", week, "listicles.csv"));
const paa = readCsv(join("serp", week, "paa.csv"));
const som = readCsv(join("ai", week, "share-of-model.csv"));
const fanout = readCsv(join("ai", week, "fanout.csv"));
const competitors = readCsv("scoreboard/competitors.csv").map((r) => ({ ...r, domain: norm(r.domain), name: r.name ?? "" })).filter((r) => r.domain && !/FACT NEEDED/.test(r.name + r.domain));
const prompts = readCsv("scoreboard/prompts.csv");
// same precedence and passes as citation-share.mjs (lib.mjs readRuns): one row per (week, prompt, engine), the value most runs agree on
const { cases, proxySkipped } = readRuns("scoreboard/runs");
if (proxySkipped) console.log(c.yellow(`${proxySkipped} PROXY row(s) in scoreboard/runs left out: proxy weeks belong in scoreboard/runs/proxy/.`));
const runs = cases.map(caseRow);
const lastWeeks = [...new Set(runs.map((r) => r.week))].sort().slice(-4);
const recent = runs.filter((r) => lastWeeks.includes(r.week));
const crawls = existsSync("crawl") ? readdirSync("crawl").filter((f) => f.endsWith(".json")).map((f) => readJson(join("crawl", f))).filter(Boolean) : [];
const gaps = existsSync("docs/gaps") ? readdirSync("docs/gaps").filter((f) => f.endsWith(".json")).map((f) => readJson(join("docs/gaps", f))).filter(Boolean) : [];

if (!serp && !recent.length && !crawls.length && !gaps.length && !som.length && !args.force) {
  console.log(c.yellow(`Nothing measured yet for week ${week}: no serp/${week}/prompts.json, no scoreboard/runs/*.csv, no crawl/*.json, no docs/gaps/*.json.`));
  console.log("Nothing written. Measure first: npm run serp (SerpApi) / npm run ai (AI APIs) / fill scoreboard/runs/<week>.csv by hand, npm run crawl -- <competitor URL>, npm run gap -- --prompt … — then npm run market. (--force writes the empty map anyway.)");
  process.exit(0);
}

// ---------- 1. who owns the market: one score per domain ----------
const dom = new Map();
const get = (h) => { h = norm(h); if (!h) return null; if (!dom.has(h)) dom.set(h, { host: h, sov: 0, top1: 0, top3: 0, snippets: 0, aio: 0, ai: {}, mentions: 0, pack: 0, gbp: "", pages: "", weak: [] }); return dom.get(h); };
for (const s of sov) { const d = get(s.host); if (!d) continue; d.sov = +s.score || 0; d.top1 = +s.top1 || 0; d.top3 = +s.top3 || 0; d.snippets = +s.snippets || 0; d.aio = +s.aio_refs || 0; }
for (const r of recent.filter((r) => !/^google$/i.test(r.engine))) for (const h of (r.cited_domains ?? "").split(";").map(norm).filter(Boolean)) { const d = get(h); if (d) d.ai[r.engine] = (d.ai[r.engine] ?? 0) + 1; }
for (const s of som) { const d = get(s.host); if (d) d.mentions += +s.mentions || 0; }
const ourNames = brandNameList(cfg); if (!ourNames.length) ourNames.push(brandHost); // brand.name, nameAr, alternateNames: our pack listing under any form of the name
const nameToDomain = (title) => { const t = String(title ?? "").toLowerCase(); if (ourNames.some((n) => t.includes(n))) return brandHost; const hit = competitors.find((cp) => cp.name && t.includes(cp.name.toLowerCase())); return hit?.domain ?? ""; };
for (const p of pack) { const h = nameToDomain(p.title); const d = h ? get(h) : null; if (d) { d.pack++; if (p.rating) d.gbp = `${p.rating}★ (${p.reviews || "?"})`; } }
for (const cp of competitors) { const d = get(cp.domain); if (!d) continue; if (cp.gbp_rating) d.gbp = `${cp.gbp_rating}★ (${cp.gbp_reviews || "?"})`; d.name = cp.name; d.notes = cp.notes ?? ""; }
// a missing version counts only in a language the site itself serves beyond its default (site.config.json languages.others)
const otherLangs = (cfg ? cfg.languages?.others ?? [] : ["ar"]).map((l) => String(l).toLowerCase().split("-")[0]);
const LANG_NAMES = { ar: "arabe", en: "anglaise", es: "espagnole", fr: "française", de: "allemande", it: "italienne", pt: "portugaise", zgh: "amazighe" };
const langName = (l) => LANG_NAMES[l] ?? `« ${l} »`;
// cart, checkout, login and account pages are noindex on purpose (also on another host: account.example.com): never a weakness
const UTILITY_PATH = /\/(cart|panier|checkouts?|commande|caisse|login|logout|sign-?in|sign-?up|connexion|register|inscription|my-?account|mon-compte|accounts?|compte|authentication|oauth|wishlist)(\/|$)/i;
const utilityPage = (u) => { try { const x = new URL(u); return UTILITY_PATH.test(x.pathname) || /^(account|accounts|login|auth|checkout)\./i.test(x.host); } catch { return false; } };
for (const cr of crawls) {
  if (!cr?.summary?.host) continue;
  const d = get(cr.summary.host); const s = cr.summary; if (!d) continue; d.pages = `${s.ok} pages, ${Object.keys(s.topics).slice(0, 5).join("/")}, maj ${s.latestYear ?? "?"}`;
  const pct = (n) => (s.ok ? Math.round((100 * n) / s.ok) : 0);
  if (pct(s.thin) >= 30) d.weak.push(`${pct(s.thin)} % de pages minces (< 300 mots)`);
  if (pct(s.noDate) >= 50) d.weak.push("pages sans date de mise à jour");
  if (pct(s.noAuthor) >= 70) d.weak.push("pages non signées");
  if (pct(s.withFaq) < 20) d.weak.push("presque aucune FAQ");
  if (pct(s.withVideo) < 10) d.weak.push("aucune vidéo");
  if (pct(s.withQuestions) < 30) d.weak.push("titres non formulés en questions");
  if (s.avgFactDensity < 3) d.weak.push(`peu de chiffres (${s.avgFactDensity}/100 mots)`);
  if (!Object.keys(s.schemaTypes).some((t) => /Organization|LocalBusiness|Business|Store|Service|Dealer|Rental|Repair|Clinic|Agent|Restaurant|Hotel/.test(t))) d.weak.push("aucune entité Organization/LocalBusiness en JSON-LD");
  const theirLangs = Object.keys(s.languages ?? {}).map((l) => l.toLowerCase().split("-")[0]);
  for (const l of otherLangs) if (!theirLangs.includes(l)) d.weak.push(`pas de version ${langName(l)}`);
  if (s.latestYear && s.latestYear < new Date().getFullYear() - 1) d.weak.push(`contenu daté de ${s.latestYear}`);
  if (s.duplicateTitles > 0) d.weak.push(`${s.duplicateTitles} titres dupliqués`);
  const noindex = Array.isArray(cr.pages) ? cr.pages.filter((p) => p.status === 200 && p.noindex && !utilityPage(p.url) && !(p.redirectTo && utilityPage(p.redirectTo))).length : s.noindex;
  if (noindex > 0) d.weak.push(`${noindex} pages noindex`);
}
const aiTotal = (d) => Object.values(d.ai).reduce((a, b) => a + b, 0);
const score = (d) => d.sov + 3 * aiTotal(d) + 2 * d.mentions + 2 * d.pack;
const ranking = [...dom.values()].filter((d) => score(d) > 0 || d.pages || d.gbp).sort((a, b) => score(b) - score(a));
const us = dom.get(brandHost) ?? get(brandHost);
const ourRank = ranking.findIndex((d) => isBrand(d.host)) + 1;

// ---------- 2. per-prompt battle map ----------
const wScore = new Map(prompts.map((p) => [p.id, +p.w_score || 0]));
const gapFor = (id, text) => gaps.find((g) => g.prompt && (g.prompt === text || g.prompt === id));
const moves = [];
const battle = [];
// a prompt's Google row from the latest week it was measured: recent spans 4 weeks in file order (not by week), so a plain find would return an older week
const lastGoogle = (id) => recent.filter((r) => r.prompt_id === id && /^google$/i.test(r.engine)).sort((a, b) => String(b.week).localeCompare(String(a.week)))[0];
const promptList = serp?.prompts ?? prompts.map((p) => ({ id: p.id, prompt: p.prompt, type: p.type, position: +(lastGoogle(p.id)?.google_position ?? 0), owner: "", top3: [], aio: false, aioRefs: [], aioCited: false, mapPack: lastGoogle(p.id)?.map_pack ?? "", features: [], winning: "", intent: p.type, paa: [] }));
for (const p of promptList) {
  const aiRows = recent.filter((r) => r.prompt_id === p.id && !/^(google|ai overview)$/i.test(r.engine));
  const aiCited = aiRows.filter((r) => (r.cited_domains ?? "").split(";").some((d) => d && isBrand(d)) || yes(r.brand_named));
  const aiOwners = new Map(); for (const r of aiRows) for (const d of (r.cited_domains ?? "").split(";").map(norm).filter(Boolean)) aiOwners.set(d, (aiOwners.get(d) ?? 0) + 1);
  const aiOwner = [...aiOwners.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
  const w = wScore.get(p.id) || 0;
  const actions = [];
  const ownerType = p.top3?.[0]?.type ?? "";
  if (p.position === 1 && (p.mapPack === "yes" || !p.features?.includes("local_pack"))) actions.push("tenir : rafraîchir la date, ajouter une preuve, surveiller le concurrent n°2");
  else {
    if (ownerType === "listicle") actions.push(`figurer dans le listicle de ${p.owner} (pitch + preuves) et publier notre comparatif honnête avec tableau`);
    else if (ownerType === "directory/platform") actions.push(`fiche complète sur ${p.owner} (avis, photos) + notre page dédiée`);
    else if (p.owner && !isBrand(p.owner)) actions.push(`battre la page de ${p.owner} : écart de contenu (content-gap.mjs), plus de faits datés, réponse en 40–60 mots, tableau`);
    if (p.position >= 2 && p.position <= 10) actions.push(`à portée (position ${p.position}) : 3 liens internes depuis les pages qui se classent, refonte du bloc réponse, mise à jour datée`);
    if (p.position === 0 || p.position > 20) actions.push("pas dans le top 20 : page dédiée à cette intention (une requête, une page) puis liens internes");
    if (p.features?.includes("local_pack") && p.mapPack !== "yes") actions.push("pack local sans nous : catégorie GBP exacte, avis avec le mot de la catégorie, page locale avec adresse et photos, grille locale (serp.mjs local-grid)");
    if (p.features?.includes("snippet") && p.snippetOwner && !isBrand(p.snippetOwner)) actions.push(`extrait tenu par ${p.snippetOwner} : réponse de 40–60 mots sous un h2 identique à la question, format identique (${p.winning})`);
    if (p.aio && !p.aioCited) actions.push(`AI Overview cite ${p.aioRefs.slice(0, 3).join(", ") || "d'autres"} : passage autonome ~150 mots + faits datés + mention par un tiers cité`);
    if (aiRows.length && !aiCited.length) actions.push(`moteurs IA citent ${aiOwner || "d'autres"} : être nommé sur les pages qu'ils citent (mentions, listicles, annuaires), fiche entité cohérente`);
    if (p.features?.includes("video")) actions.push("vidéo dans la page de résultats : publier la vidéo du pilier avec transcription");
  }
  const g = gapFor(p.id, p.prompt);
  if (g) actions.push(`brief d'écart : docs/gaps/ (score ${g.beat ?? "—"}/100, ${g.questionGap?.length ?? 0} questions manquantes)`);
  const dist = p.position === 0 ? 30 : p.position; // striking distance weighs the priority
  const priority = w * 3 + (p.position >= 2 && p.position <= 10 ? 20 : 0) + (p.type === "commercial" || p.type === "local" ? 10 : 0) + (p.features?.includes("local_pack") && p.mapPack !== "yes" ? 8 : 0) + (p.aio && !p.aioCited ? 6 : 0) - Math.min(dist, 30) / 3;
  battle.push({ ...p, aiCited: aiRows.length ? `${aiCited.length}/${aiRows.length}` : "—", aiOwner, w, actions, priority: Math.round(priority) });
  if (actions.length && !(p.position === 1 && actions[0].startsWith("tenir"))) moves.push({ id: p.id, prompt: p.prompt, priority: Math.round(priority), action: actions[0], position: p.position || "—" });
}
moves.sort((a, b) => b.priority - a.priority);

// ---------- 3. fan-out / PAA topics we do not cover yet ----------
const ourTitles = (cfg?.pages ?? []).map((p) => `${p.title?.fr ?? ""} ${p.h1?.fr ?? ""} ${p.path ?? ""}`).join(" ").toLowerCase();
const ourToks = new Set(tokens(ourTitles).filter((t) => !STOP.has(t)));
const topicRows = [...fanout.map((f) => ({ src: `${f.engine} fan-out (${f.prompt_id})`, q: f.query })), ...paa.map((q) => ({ src: `PAA (${q.prompt_id})`, q: q.question }))];
const uncovered = [];
for (const t of topicRows) { const toks = tokens(t.q).filter((x) => !STOP.has(x) && x.length > 3); const missing = toks.filter((x) => !ourToks.has(x)); if (toks.length && missing.length / toks.length >= 0.5 && !uncovered.some((u) => u.q.toLowerCase() === t.q.toLowerCase())) uncovered.push({ ...t, missing: missing.join(" ") }); }

// ---------- report ----------
const md = [];
md.push(`# Marché et concurrence — ${brandName} — semaine ${week} (généré ${isoDate()} par market.mjs)`);
md.push(`Objectif : la première place se prend à quelqu'un. Ce document dit à qui, sur quel prompt, avec quelle page, et par quel coup.\nDonnées : ${serp ? `SERP ${serp.location}` : "pas de run SERP (serp.mjs)"} · ${recent.length} lignes de runs sur ${lastWeeks.length} semaine(s) · ${som.length ? "part de modèle IA" : "pas de run IA automatisé (ai-runs.mjs ou relevé manuel)"} · ${crawls.length} site(s) concurrent(s) crawlé(s) · ${gaps.length} brief(s) d'écart · ${competitors.length} concurrent(s) déclaré(s) dans scoreboard/competitors.csv.`);
md.push(`\n## 1. Qui possède le marché aujourd'hui${ourRank ? ` — nous sommes ${ourRank}ᵉ sur ${ranking.length}` : ""}\n| # | Domaine | Score | Part de voix Google | N°1 | Top 3 | Extraits | Réf. AI Overview | Citations IA (4 sem.) | Mentions IA | Pack local | Fiche GBP | Site (crawl) |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|`);
ranking.slice(0, 15).forEach((d, i) => md.push(`| ${i + 1} | ${isBrand(d.host) ? `**${d.host}** (nous)` : d.host} | ${score(d)} | ${d.sov} | ${d.top1} | ${d.top3} | ${d.snippets} | ${d.aio} | ${Object.entries(d.ai).map(([e, n]) => `${e} ${n}`).join(", ") || "—"} | ${d.mentions || "—"} | ${d.pack || "—"} | ${d.gbp || "—"} | ${d.pages || "—"} |`));
if (!ranking.length) md.push("| — | (lancer serp.mjs / ai-runs.mjs, ou remplir scoreboard/runs/<semaine>.csv à la main) | | | | | | | | | | | |");
md.push(`Score = part de voix Google + 3 × citations IA + 2 × mentions IA + 2 × apparitions dans le pack local. Le domaine le plus cité de la catégorie est la cible à dépasser (définition de « premier », GEO).`);
md.push(`\n## 2. Faiblesses exploitables des concurrents (crawl)\n${ranking.filter((d) => !isBrand(d.host) && d.weak.length).map((d) => `- **${d.host}** : ${d.weak.join(" · ")}`).join("\n") || `- crawler chaque concurrent du top 5 : \`node tools/crawl.mjs https://concurrent.example/ --max 150\` — les faiblesses (pages minces, non datées, sans FAQ${otherLangs.length ? `, sans version ${otherLangs.map(langName).join(" ou ")}` : ""}, sans entité) apparaissent ici`}`);
md.push(`\n## 3. Carte de bataille par prompt (4 dernières semaines)\n| Prompt | Type | W | Notre pos. | Propriétaire n°1 (type) | Extrait | AI Overview | Cité IA | Moteurs IA citent | Pack local | Format qui gagne | Priorité | Coup à jouer |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|`);
for (const b of [...battle].sort((a, b) => b.priority - a.priority)) md.push(`| ${b.id} ${b.prompt} | ${b.type ?? ""} | ${b.w || "—"} | ${b.position || "—"} | ${b.owner ? `${b.owner} (${b.top3?.[0]?.type ?? ""})` : "—"} | ${b.snippetOwner ? (isBrand(b.snippetOwner) ? "**nous**" : b.snippetOwner) : "—"} | ${b.aio ? (b.aioCited ? "**cités**" : b.aioRefs.slice(0, 2).join(", ") || "oui") : "—"} | ${b.aiCited} | ${b.aiOwner || "—"} | ${b.mapPack || "—"} | ${b.winning || "—"} | ${b.priority} | ${b.actions.join(" ; ") || "—"} |`);
md.push(`W = score de gagnabilité (prompts.csv). Priorité = 3 × W + 20 si à portée (positions 2–10) + 10 si commercial/local + pack local manqué + AI Overview manqué − distance.`);
md.push(`\n## 4. Les dix coups, dans l'ordre\n${moves.slice(0, 10).map((m, i) => `${i + 1}. **${m.id}** (${m.prompt}, position ${m.position}, priorité ${m.priority}) — ${m.action}`).join("\n") || "1. (aucune donnée de prompt : lancer serp.mjs ou remplir les runs)"}`);
md.push(`\n## 5. Sujets que les moteurs cherchent (fan-out) et que nos pages ne couvrent pas (${uncovered.length})\n${uncovered.slice(0, 30).map((u) => `- ${u.q} _(${u.src}; mots absents : ${u.missing})_`).join("\n") || "- aucun (ou pas de données fan-out/PAA : ai-runs.mjs, serp.mjs)"}\nChaque ligne devient une section du pilier ou une page cluster (Layer 9.2) — jamais une page quasi-dupliquée.`);
md.push(`\n## 6. Listicles et annuaires qui décident les prompts commerciaux (${listicles.length})\n${[...new Map(listicles.map((l) => [l.url, l])).values()].slice(0, 25).map((l) => `- ${l.host} — ${l.title} (${l.type}, position ${l.position} sur ${l.prompt_id})`).join("\n") || "- (serp.mjs remplit cette liste ; sinon docs/06 à la main)"}\nÊtre dans chaque liste où la catégorie se décide est le coup off-site n°1 (Layers 12.5, 15.2) — avec des preuves, jamais contre paiement non signalé.`);
md.push(`\n## 7. Ce que ce document ne sait pas\n- Les autorités de liens (domaines référents) : Ahrefs/Semrush ou l'export Search Console « Liens » des concurrents n'existe pas — estimer par les mentions trouvées.\n- Les avis Google des concurrents hors pack local : les relever à la main dans scoreboard/competitors.csv (gbp_rating, gbp_reviews).\n- Copilot et AI Mode : pas d'API — relevé manuel hebdomadaire.\n- Les chiffres concurrents restent des faits sur les concurrents (page + date), jamais des faits du client.`);
const out = args.out ?? join("scoreboard", "market", `${week}.md`); // docs/19 is completed by hand: only an explicit --out writes it
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, md.join("\n") + "\n");
console.log(c.bold(`Market map ${week} for ${brandHost}: ${ranking.length} domains scored${ourRank ? `, we are #${ourRank}` : ""} · ${battle.length} prompts mapped · ${moves.length} moves · ${uncovered.length} uncovered topics`));
if (ranking.length) console.log(`Top 5: ${ranking.slice(0, 5).map((d) => `${isBrand(d.host) ? c.green(d.host) : d.host} ${score(d)}`).join(" · ")}`);
console.log(`Next moves: ${moves.slice(0, 3).map((m) => `${m.id} → ${m.action.split(":")[0]}`).join(" | ") || "none"}`);
console.log(c.dim(`written ${out}`));
