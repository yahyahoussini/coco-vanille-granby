#!/usr/bin/env node
// scripts/gsc-api.mjs — Search Console through the API (Layers 9.4, 11.3, 17, 18): the exact position/impressions/clicks of every prompt,
// striking-distance queries (positions 4–15), cannibalization (one query, two of our pages), CTR gaps (title/description rewrites),
// internal-link opportunities (pages that already rank → pages that must rank), period comparison. Free, exact, and the only
// source of Google positions when SerpApi is not used. Needs google-service-account.json (docs/12 → API) with the service-account
// e-mail added as a user of the property. The Generative AI report is NOT in the API (Sept 2026): read it in the UI.
// Usage: node gsc-api.mjs <mode> [--property sc-domain:example.ma] [--days 28] [--end 2026-09-20] [--min-impressions 20] [--week 2026-W40]
//   modes: positions (default; --to-runs writes Google rows for prompts without one) | striking | cannibal | ctr | links [--target /prix/] | pages | compare | queries [--filter mot]
// Data is cached in gsc/<start>_<end>.json (delete to refresh). Outputs: console + gsc/<end>-<mode>.csv
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs, csvObjects, toCsv, c, isoWeek } from "./lib.mjs";
import { googleJson, SCOPES } from "./google-auth.mjs";
import { tokens, STOP } from "./extract.mjs";

const args = parseArgs(process.argv.slice(2));
const mode = args._[0] ?? "positions";
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const host = cfg ? new URL(cfg.site).host.replace(/^www\./, "") : null;
const property = args.property ?? (host ? `sc-domain:${host}` : null);
if (!property) { console.error("Need --property sc-domain:example.ma or site.config.json"); process.exit(1); }
const days = +(args.days ?? 28);
const end = args.end ? new Date(args.end) : new Date(Date.now() - 3 * 86400000); // GSC data lags ~2–3 days
const start = new Date(end.getTime() - (days - 1) * 86400000);
const d = (x) => x.toISOString().slice(0, 10);
const minImp = +(args["min-impressions"] ?? 20);
const week = args.week ?? isoWeek();
mkdirSync("gsc", { recursive: true });

async function query(dimensions, startDate = d(start), endDate = d(end), extra = {}) {
  const file = join("gsc", `${startDate}_${endDate}_${dimensions.join("-")}${extra.filterKey ?? ""}.json`);
  if (existsSync(file) && !args.refresh) return JSON.parse(readFileSync(file, "utf8"));
  const rows = [];
  for (let startRow = 0; startRow < 100000; startRow += 25000) {
    const body = { startDate, endDate, dimensions, rowLimit: 25000, startRow, dataState: "final", type: "web", ...extra.body };
    const json = await googleJson(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`, { scope: SCOPES.gsc, method: "POST", body });
    const batch = (json.rows ?? []).map((r) => ({ ...Object.fromEntries(dimensions.map((k, i) => [k, r.keys[i]])), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
    rows.push(...batch);
    if (batch.length < 25000) break;
  }
  writeFileSync(file, JSON.stringify(rows));
  return rows;
}
const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u; } };
const out = (name, rows, cols) => { const f = join("gsc", `${d(end)}-${name}.csv`); writeFileSync(f, toCsv(rows, cols)); console.log(c.dim(`written ${f}`)); };
const expectedCtr = (p) => (p <= 1 ? 0.28 : p <= 2 ? 0.15 : p <= 3 ? 0.11 : p <= 4 ? 0.08 : p <= 5 ? 0.07 : p <= 7 ? 0.05 : 0.03); // rough organic averages; mobile/local SERPs run lower

(async () => {
  console.log(c.bold(`Search Console ${property} · ${d(start)} → ${d(end)} (${days} days) · mode ${mode}`));
  if (mode === "positions") {
    const rows = await query(["query", "page"]);
    const promptsFile = args.prompts ?? "scoreboard/prompts.csv";
    const prompts = existsSync(promptsFile) ? csvObjects(readFileSync(promptsFile, "utf8")).filter((p) => p.prompt) : [];
    const res = [];
    for (const p of prompts) {
      const q = p.prompt.trim().toLowerCase();
      let hits = rows.filter((r) => r.query.toLowerCase() === q);
      if (!hits.length && args.fuzzy) { const t = tokens(q).filter((x) => !STOP.has(x)); hits = rows.filter((r) => t.every((x) => r.query.toLowerCase().includes(x))); }
      if (!hits.length) { res.push({ prompt_id: p.id, prompt: p.prompt, position: "", impressions: 0, clicks: 0, page: "", note: "no impressions (not ranking in top ~100, or phrased differently)" }); continue; }
      const imp = hits.reduce((s, r) => s + r.impressions, 0), clk = hits.reduce((s, r) => s + r.clicks, 0);
      const best = hits.sort((a, b) => b.impressions - a.impressions)[0];
      res.push({ prompt_id: p.id, prompt: p.prompt, position: +(hits.reduce((s, r) => s + r.position * r.impressions, 0) / imp).toFixed(1), impressions: imp, clicks: clk, page: pathOf(best.page), note: hits.length > 1 ? `${hits.length} pages get impressions` : "" });
    }
    console.table(res.map(({ prompt_id, position, impressions, clicks, page }) => ({ prompt_id, position, impressions, clicks, page })));
    out("positions", res, ["prompt_id", "prompt", "position", "impressions", "clicks", "page", "note"]);
    if (args["to-runs"]) { // Google rows for prompts that have none this week (serp.mjs or the hand-filled file win)
      mkdirSync("scoreboard/runs", { recursive: true });
      const have = new Set();
      for (const f of [`${week}-google.csv`, `${week}.csv`]) if (existsSync(join("scoreboard/runs", f))) for (const r of csvObjects(readFileSync(join("scoreboard/runs", f), "utf8"))) if (/^google$/i.test(r.engine)) have.add(r.prompt_id);
      const runRows = res.filter((r) => !have.has(r.prompt_id)).map((r) => ({ week, prompt_id: r.prompt_id, engine: "Google", google_position: r.position ? Math.round(r.position) : 0, snippet_owner: "", ai_overview_cited: "", cited_domains: "", brand_named: "", brand_position: "", third_party_names_us: "", map_pack: "", notes: `GSC avg position over ${days} d, ${r.impressions} impr.` }));
      writeFileSync(join("scoreboard/runs", `${week}-gsc.csv`), toCsv(runRows, ["week", "prompt_id", "engine", "google_position", "snippet_owner", "ai_overview_cited", "cited_domains", "brand_named", "brand_position", "third_party_names_us", "map_pack", "notes"]));
      console.log(`wrote ${runRows.length} Google rows (GSC average position) to scoreboard/runs/${week}-gsc.csv`);
    }
  } else if (mode === "striking") {
    const rows = (await query(["query", "page"])).filter((r) => r.position >= 4 && r.position <= 15 && r.impressions >= minImp).sort((a, b) => b.impressions - a.impressions).slice(0, 60);
    console.table(rows.map((r) => ({ query: r.query.slice(0, 50), position: +r.position.toFixed(1), impressions: r.impressions, clicks: r.clicks, page: pathOf(r.page) })));
    console.log("Each row: rewrite the answer block for that query, add a question h2, add 3 internal links from ranking pages, update the date — then IndexNow + request indexing.");
    out("striking", rows.map((r) => ({ ...r, page: pathOf(r.page) })), ["query", "page", "position", "impressions", "clicks", "ctr"]);
  } else if (mode === "cannibal") {
    const rows = await query(["query", "page"]);
    const byQ = new Map(); for (const r of rows) { if (!byQ.has(r.query)) byQ.set(r.query, []); byQ.get(r.query).push(r); }
    const res = [];
    for (const [q, rs] of byQ) { if (rs.length < 2) continue; const imp = rs.reduce((s, r) => s + r.impressions, 0); if (imp < minImp) continue; const sorted = rs.sort((a, b) => b.impressions - a.impressions); const [a, b] = sorted; if (b.impressions / imp < 0.2) continue; res.push({ query: q, impressions: imp, page_a: pathOf(a.page), pos_a: +a.position.toFixed(1), share_a: Math.round((100 * a.impressions) / imp), page_b: pathOf(b.page), pos_b: +b.position.toFixed(1), share_b: Math.round((100 * b.impressions) / imp), pages: rs.length }); }
    res.sort((a, b) => b.impressions - a.impressions);
    console.table(res.slice(0, 30));
    console.log(`${res.length} cannibalized queries (two of our pages share ≥ 20 % of impressions). Decide per query: merge the weaker into the stronger (301) or re-target it; point every internal anchor for the query at the owner (Layer 9.4).`);
    out("cannibal", res, ["query", "impressions", "page_a", "pos_a", "share_a", "page_b", "pos_b", "share_b", "pages"]);
  } else if (mode === "ctr") {
    const rows = (await query(["query", "page"])).filter((r) => r.position <= 7 && r.impressions >= minImp).map((r) => ({ ...r, expected: expectedCtr(r.position), gap: expectedCtr(r.position) - r.ctr, lost_clicks: Math.round((expectedCtr(r.position) - r.ctr) * r.impressions) })).filter((r) => r.gap > 0.02).sort((a, b) => b.lost_clicks - a.lost_clicks).slice(0, 40);
    console.table(rows.map((r) => ({ query: r.query.slice(0, 45), position: +r.position.toFixed(1), impressions: r.impressions, ctr: `${(100 * r.ctr).toFixed(1)}%`, expected: `${Math.round(100 * r.expected)}%`, lost_clicks: r.lost_clicks, page: pathOf(r.page) })));
    console.log("Low CTR at a good position = the title/description lose to the neighbours (or an AI Overview / ads take the clicks): rewrite title (query words first, the number, the year) and description (the answer sentence), then check the SERP for what sits above.");
    out("ctr", rows.map((r) => ({ ...r, page: pathOf(r.page) })), ["query", "page", "position", "impressions", "clicks", "ctr", "expected", "lost_clicks"]);
  } else if (mode === "pages") {
    const rows = await query(["page", "query"]);
    const byP = new Map(); for (const r of rows) { const p = pathOf(r.page); const e = byP.get(p) ?? { page: p, clicks: 0, impressions: 0, queries: [] }; e.clicks += r.clicks; e.impressions += r.impressions; e.queries.push(r); byP.set(p, e); }
    const res = [...byP.values()].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).map((e) => ({ page: e.page, clicks: e.clicks, impressions: e.impressions, top_queries: e.queries.sort((a, b) => b.impressions - a.impressions).slice(0, 3).map((q) => `${q.query} (${q.position.toFixed(0)})`).join(" | ") }));
    console.table(res.slice(0, 30));
    console.log("The pages at the top are the ones whose internal links carry the most weight (Layer 11.3): link from them to the pages that must rank next.");
    out("pages", res, ["page", "clicks", "impressions", "top_queries"]);
  } else if (mode === "links") {
    // internal-link opportunities: pages ranking for queries that share words with the target page's queries
    const rows = await query(["query", "page"]);
    const targets = args.target ? [args.target] : (existsSync("scoreboard/snippet-targets.csv") ? [...new Set(csvObjects(readFileSync("scoreboard/snippet-targets.csv", "utf8")).map((r) => r.target_url).filter(Boolean))] : []);
    if (!targets.length) { console.error("Need --target /path/ (or scoreboard/snippet-targets.csv with target_url)"); process.exit(1); }
    const res = [];
    for (const t of targets) {
      const tq = rows.filter((r) => pathOf(r.page) === t);
      const terms = new Set(tq.flatMap((r) => tokens(r.query)).filter((x) => !STOP.has(x) && x.length > 3));
      if (!terms.size) { console.log(c.yellow(`${t}: no impressions yet — link from the home, the pillar and the top 3 pages by clicks`)); continue; }
      const sources = new Map();
      for (const r of rows) { const p = pathOf(r.page); if (p === t || r.impressions < 5) continue; const shared = tokens(r.query).filter((x) => terms.has(x)); if (shared.length >= 2) { const s = sources.get(p) ?? { target: t, source: p, impressions: 0, anchors: new Set() }; s.impressions += r.impressions; s.anchors.add(r.query); sources.set(p, s); } }
      for (const s of [...sources.values()].sort((a, b) => b.impressions - a.impressions).slice(0, 8)) res.push({ target: t, source: s.source, source_impressions: s.impressions, anchor_ideas: [...s.anchors].slice(0, 3).join(" | ") });
    }
    console.table(res);
    console.log("Add a descriptive link (anchor = the query words, never 'cliquez ici') from each source to its target inside a relevant paragraph, then IndexNow the source.");
    out("links", res, ["target", "source", "source_impressions", "anchor_ideas"]);
  } else if (mode === "compare") {
    const prevEnd = new Date(start.getTime() - 86400000), prevStart = new Date(prevEnd.getTime() - (days - 1) * 86400000);
    const cur = await query(["page"]), prev = await query(["page"], d(prevStart), d(prevEnd));
    const pm = new Map(prev.map((r) => [pathOf(r.page), r]));
    const res = cur.map((r) => { const p = pm.get(pathOf(r.page)); return { page: pathOf(r.page), clicks: r.clicks, clicks_prev: p?.clicks ?? 0, d_clicks: r.clicks - (p?.clicks ?? 0), impressions: r.impressions, impr_prev: p?.impressions ?? 0, d_impr: r.impressions - (p?.impressions ?? 0), position: +r.position.toFixed(1), pos_prev: p ? +p.position.toFixed(1) : "" }; });
    for (const [p, r] of pm) if (!cur.some((x) => pathOf(x.page) === p)) res.push({ page: p, clicks: 0, clicks_prev: r.clicks, d_clicks: -r.clicks, impressions: 0, impr_prev: r.impressions, d_impr: -r.impressions, position: "", pos_prev: +r.position.toFixed(1) });
    const tot = (k) => res.reduce((s, r) => s + (+r[k] || 0), 0);
    console.log(`Clicks ${tot("clicks_prev")} → ${tot("clicks")} · impressions ${tot("impr_prev")} → ${tot("impressions")} (${d(prevStart)}–${d(prevEnd)} vs ${d(start)}–${d(end)})`);
    console.log("Biggest losers:"); console.table(res.sort((a, b) => a.d_clicks - b.d_clicks).slice(0, 10));
    console.log("Biggest winners:"); console.table(res.sort((a, b) => b.d_clicks - a.d_clicks).slice(0, 10));
    out("compare", res, ["page", "clicks", "clicks_prev", "d_clicks", "impressions", "impr_prev", "d_impr", "position", "pos_prev"]);
  } else if (mode === "queries") {
    const rows = (await query(["query"])).filter((r) => !args.filter || r.query.includes(String(args.filter).toLowerCase())).sort((a, b) => b.impressions - a.impressions).slice(0, 100);
    console.table(rows.map((r) => ({ query: r.query.slice(0, 60), position: +r.position.toFixed(1), impressions: r.impressions, clicks: r.clicks })));
    console.log("Real phrasings customers type: replace scaffold prompts in scoreboard/prompts.csv with these (keep the ids) and add the ones you never planned for (AR, Darija).");
    out("queries", rows, ["query", "position", "impressions", "clicks", "ctr"]);
  } else { console.error(`Unknown mode ${mode}`); process.exit(1); }
})().catch((e) => { console.error(c.red(e.message)); process.exit(1); });
