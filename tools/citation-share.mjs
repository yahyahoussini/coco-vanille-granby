#!/usr/bin/env node
// scripts/citation-share.mjs — the weekly scoreboard (Layer 17): citation share per engine, top-1/top-3/snippet share, trend, most-cited domains.
// Input: scoreboard/runs/*.csv (one file per week, or one file with a week column). Columns (see assets/scoreboard/runs-template.csv):
//   week,prompt_id,engine,google_position,snippet_owner,ai_overview_cited,cited_domains,brand_named,brand_position,third_party_names_us,map_pack,notes
//   engine ∈ Google | AI Overview | ChatGPT | Perplexity | Gemini | Claude | Copilot | AI Mode
//   AI Overview data may be recorded on the Google row (ai_overview_cited + cited_domains) OR as a separate "AI Overview" row: both count.
//   map_pack: yes/no on the Google row of local prompts — is the business in the map pack for that query? (Layer 21.5 "map pack held")
//   cited_domains: domains in the order the engine lists them, separated by ";"   brand_named: yes/no (named without a link)
//   third_party_names_us: yes/no — one of the cited sources is a third-party page that names the brand (Layer 15 "Done when" #5)
// Usage: node citation-share.mjs [--runs scoreboard/runs] [--brand x.ma] [--config site.config.json] [--out scoreboard/summary.csv]
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs, csvObjects, toCsv, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const brand = (args.brand ?? (cfg ? new URL(cfg.site).host : "")).replace(/^www\./, "").toLowerCase();
if (!brand) { console.error("Need --brand <domain> or site.config.json"); process.exit(1); }
const dir = args.runs ?? "scoreboard/runs";
if (!existsSync(dir)) { console.error(`No runs folder: ${dir}`); process.exit(1); }

// Files per week: <week>-gsc.csv (gsc-api.mjs), <week>-google.csv (serp.mjs), <week>-ai.csv (ai-runs.mjs), <week>.csv (hand-filled).
// Precedence for the same (week, prompt, engine): hand-filled <week>.csv > <week>-google.csv (SerpApi) / <week>-ai.csv > <week>-gsc.csv (average position only).
export const runsRank = (f) => (/-gsc\.csv$/.test(f) ? 0 : /-(google|ai)\.csv$/.test(f) ? 1 : 2);
const byKey = new Map();
for (const f of readdirSync(dir).filter((f) => f.endsWith(".csv")).sort((a, b) => runsRank(a) - runsRank(b) || a.localeCompare(b))) {
  for (const r of csvObjects(readFileSync(join(dir, f), "utf8"))) { const row = { ...r, week: r.week || f.replace(/(-google|-ai|-gsc)?\.csv$/, "") }; byKey.set(`${row.week}|${row.prompt_id}|${(row.engine ?? "").toLowerCase()}`, row); }
}
const rows = [...byKey.values()];
if (!rows.length) { console.error("No rows found."); process.exit(1); }
const norm = (d) => d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
const isBrand = (d) => norm(d) === brand || norm(d).endsWith("." + brand);
const yes = (v) => /^(y|yes|oui|1|true)$/i.test((v ?? "").trim());

// ---------- per week per engine ----------
const weeks = [...new Set(rows.map((r) => r.week))].sort();
const engines = [...new Set(rows.map((r) => r.engine))];
const summary = [];
for (const week of weeks) {
  for (const engine of engines) {
    const rs = rows.filter((r) => r.week === week && r.engine === engine);
    if (!rs.length) continue;
    const n = rs.length;
    if (/^google$/i.test(engine)) {
      const pos = rs.map((r) => +r.google_position || 0);
      const top1 = pos.filter((p) => p === 1).length, top3 = pos.filter((p) => p >= 1 && p <= 3).length, top10 = pos.filter((p) => p >= 1 && p <= 10).length;
      const snippet = rs.filter((r) => r.snippet_owner && isBrand(r.snippet_owner)).length;
      const aio = rs.filter((r) => yes(r.ai_overview_cited) || (r.cited_domains ?? "").split(";").some((d) => d && isBrand(d))).length;
      const packRows = rs.filter((r) => (r.map_pack ?? "").trim() !== "");
      summary.push({ week, engine, prompts: n, top1_pct: pct(top1, n), top3_pct: pct(top3, n), top10_pct: pct(top10, n), snippet_pct: pct(snippet, n), cited_pct: aio ? pct(aio, n) : "", first_pct: "", map_pack_pct: packRows.length ? pct(packRows.filter((r) => yes(r.map_pack)).length, packRows.length) : "" });
    } else {
      const cited = rs.filter((r) => yes(r.ai_overview_cited) || yes(r.brand_named) || (r.cited_domains ?? "").split(";").some((d) => d && isBrand(d))).length;
      const first = rs.filter((r) => { const d = (r.cited_domains ?? "").split(";").map((x) => x.trim()).filter(Boolean); return d.length && isBrand(d[0]); }).length;
      summary.push({ week, engine, prompts: n, top1_pct: "", top3_pct: "", top10_pct: "", snippet_pct: "", cited_pct: pct(cited, n), first_pct: pct(first, n), map_pack_pct: "" });
    }
  }
}
function pct(a, b) { return b ? Math.round((100 * a) / b) : 0; }

console.log(c.bold(`Scoreboard for ${brand} — ${weeks.length} week(s), ${engines.length} engine(s)`));
console.table(summary);
console.log(c.dim("Google row: cited_pct = AI Overview citations recorded on the Google rows; map_pack_pct = local prompts where the business is in the map pack."))

// ---------- trend: latest vs 4 weeks ago ----------
if (weeks.length >= 2) {
  const last = weeks.at(-1), prev = weeks[Math.max(0, weeks.length - 5)];
  console.log(`\nTrend ${prev} → ${last}:`);
  for (const engine of engines) {
    const a = summary.find((s) => s.week === prev && s.engine === engine), b = summary.find((s) => s.week === last && s.engine === engine);
    if (!a || !b) continue;
    const key = /^google$/i.test(engine) ? "top3_pct" : "cited_pct";
    const d = (b[key] || 0) - (a[key] || 0);
    console.log(`  ${engine.padEnd(12)} ${key.replace("_pct", "")}: ${a[key]}% → ${b[key]}% (${d >= 0 ? "+" : ""}${d})`);
  }
}

// ---------- most cited domains per engine (latest week) ----------
const last = weeks.at(-1);
console.log(`\nMost cited domains, week ${last} (the category's truth; pitch these sources first):`);
for (const engine of engines.filter((e) => !/^google$/i.test(e))) {
  const counts = new Map();
  for (const r of rows.filter((r) => r.week === last && r.engine === engine)) for (const d of (r.cited_domains ?? "").split(";").map(norm).filter(Boolean)) counts.set(d, (counts.get(d) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (top.length) console.log(`  ${engine.padEnd(12)} ${top.map(([d, n]) => `${d === brand ? c.green(d) : d} (${n})`).join(", ")}`);
}

// ---------- prompts that moved most (Google position) ----------
if (weeks.length >= 2) {
  const prev = weeks.at(-2);
  const moves = [];
  for (const r of rows.filter((r) => r.week === last && /^google$/i.test(r.engine))) {
    const p = rows.find((x) => x.week === prev && x.engine === r.engine && x.prompt_id === r.prompt_id);
    if (p && +p.google_position && +r.google_position) moves.push({ prompt_id: r.prompt_id, from: +p.google_position, to: +r.google_position, delta: +p.google_position - +r.google_position });
  }
  moves.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  if (moves.length) { console.log(`\nPrompts that moved most (${prev} → ${last}); the biggest mover is this week's focus:`); console.table(moves.slice(0, 5)); }
}

// ---------- streaks and the definition of first (Layer 13 #4, Layer 21.5) ----------
const promptsFile = args.prompts ?? "scoreboard/prompts.csv";
let promptTypes = new Map();
if (existsSync(promptsFile)) for (const r of csvObjects(readFileSync(promptsFile, "utf8"))) promptTypes.set(r.id, r.type);
const last4 = weeks.slice(-4);
const scored = (id) => ["informational", "commercial", "local"].includes(promptTypes.get(id) ?? "commercial");
const promptIds = [...new Set(rows.map((r) => r.prompt_id))].filter(scored);
const isAio = (r) => (/^ai overview$/i.test(r.engine) && (yes(r.ai_overview_cited) || (r.cited_domains ?? "").split(";").some((d) => d && isBrand(d)))) || (/^google$/i.test(r.engine) && yes(r.ai_overview_cited));
const isSnippet = (r) => /^google$/i.test(r.engine) && r.snippet_owner && isBrand(r.snippet_owner);
// streak = number of consecutive most-recent weeks the predicate held for that prompt (over the weeks available)
const streak = (id, pred) => { let n = 0; for (const w of [...weeks].reverse()) { if (rows.some((r) => r.week === w && r.prompt_id === id && pred(r))) n++; else break; } return n; };
const snippetStreaks = promptIds.map((id) => [id, streak(id, isSnippet)]).filter(([, n]) => n > 0);
const aioStreaks = promptIds.map((id) => [id, streak(id, isAio)]).filter(([, n]) => n > 0);
const fmt = (arr) => arr.map(([id, n]) => `${id}×${n}w`).join(", ") || "none";
const heldFour = promptIds.filter((id) => streak(id, (r) => isSnippet(r) || isAio(r)) >= 4).length;
console.log(`\nStreaks (consecutive most-recent weeks, ${weeks.length} week(s) of data): snippet/PAA ${fmt(snippetStreaks)} · AI Overview ${fmt(aioStreaks)}`);
console.log(`Answer boxes/citations held ≥ 4 weeks: ${heldFour} prompt(s) — Layer 13 target: at least 3${weeks.length < 4 ? c.dim(" (need 4 weeks of runs)") : ""}`);
const thirdParty = new Set(rows.filter((r) => last4.includes(r.week) && !/^google$/i.test(r.engine) && yes(r.third_party_names_us)).map((r) => r.prompt_id));
if (rows.some((r) => "third_party_names_us" in r)) console.log(`Third-party page naming the brand among cited sources (last ${last4.length} week(s)): ${thirdParty.size}/${promptIds.length} prompts — Layer 15 target: half`);

if (weeks.length >= 4) {
  const commLocal = promptIds.filter((id) => ["commercial", "local"].includes(promptTypes.get(id)));
  const allWeeks = (id, pred) => last4.every((w) => rows.some((r) => r.week === w && r.prompt_id === id && pred(r)));
  const pos1 = commLocal.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && +r.google_position === 1));
  const rest = promptIds.filter((id) => !commLocal.includes(id));
  const top3 = rest.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && +r.google_position >= 1 && +r.google_position <= 3));
  const aeo = promptIds.filter((id) => allWeeks(id, (r) => isSnippet(r) || isAio(r)));
  const localIds = promptIds.filter((id) => promptTypes.get(id) === "local");
  const packData = rows.some((r) => localIds.includes(r.prompt_id) && (r.map_pack ?? "").trim() !== "");
  const packHeld = localIds.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && yes(r.map_pack)));
  const aiEngines = engines.filter((e) => !/^(google|ai overview)$/i.test(e));
  const geoEngines = aiEngines.filter((e) => { const cited = promptIds.filter((id) => allWeeks(id, (r) => r.engine === e && (yes(r.brand_named) || (r.cited_domains ?? "").split(";").some((d) => d && isBrand(d))))); return cited.length >= promptIds.length / 2; });
  const domCount = new Map(); for (const r of rows.filter((r) => last4.includes(r.week) && !/^google$/i.test(r.engine))) for (const d of (r.cited_domains ?? "").split(";").map(norm).filter(Boolean)) domCount.set(d, (domCount.get(d) ?? 0) + 1);
  const topDom = [...domCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const g = commLocal.length && pos1.length >= commLocal.length / 2 && (!rest.length || top3.length >= rest.length) && (!localIds.length || (packData && packHeld.length === localIds.length));
  const a = aeo.length >= promptIds.length / 3;
  const ge = geoEngines.length >= 2 && topDom === brand;
  console.log(`\nDefinition of first (last 4 weeks, ${promptIds.length} scored prompts):`);
  console.log(`  Google  ${g ? c.green("MET") : c.yellow("not yet")} — position 1 on ${pos1.length}/${commLocal.length} commercial+local (need half), top 3 on ${top3.length}/${rest.length} others (need all), map pack held on ${packData ? `${packHeld.length}/${localIds.length} local prompts (need all)` : "n/a — fill the map_pack column on local prompts"}`);
  console.log(`  AEO     ${a ? c.green("MET") : c.yellow("not yet")} — snippet/PAA/AI Overview held on ${aeo.length}/${promptIds.length} (need a third)`);
  console.log(`  GEO     ${ge ? c.green("MET") : c.yellow("not yet")} — cited on ≥ half of prompts in ${geoEngines.length} engine(s) [${geoEngines.join(", ")}] (need 2); most cited domain: ${topDom ?? "n/a"}${topDom === brand ? " (us)" : ""}`);
  if (g && a && ge) console.log(c.green("  All three hold: widen the category by one step, or add a city or a language, and run the stack again (Layer 21.5)."));
}

// ---------- review velocity (Layer 12 "Done when": ≥ 3 new reviews per week for four weeks) ----------
const reviewsFile = args.reviews ?? "scoreboard/reviews.csv";
if (existsSync(reviewsFile)) {
  const rv = csvObjects(readFileSync(reviewsFile, "utf8")).filter((r) => r.week).sort((a, b) => a.week.localeCompare(b.week)).slice(-4);
  const ok = rv.length >= 4 && rv.every((r) => +r.new_reviews >= 3);
  console.log(`\nReviews, last ${rv.length} week(s): ${rv.map((r) => `${r.week}: ${r.new_reviews} new${r.avg_rating ? ` (${r.avg_rating}★)` : ""}${r.reply_time_h ? `, reply ${r.reply_time_h} h` : ""}`).join(" · ")} — ${ok ? c.green("≥ 3/week for 4 weeks: MET") : c.yellow("target: ≥ 3 new reviews every week for 4 weeks, replies < 24 h")}`);
}

const out = args.out ?? "scoreboard/summary.csv";
writeFileSync(out, toCsv(summary, ["week", "engine", "prompts", "top1_pct", "top3_pct", "top10_pct", "snippet_pct", "cited_pct", "first_pct", "map_pack_pct"]));
console.log(`\nwritten ${out}`);
