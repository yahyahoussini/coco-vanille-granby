#!/usr/bin/env node
// scripts/citation-share.mjs — the weekly scoreboard (Layer 17): citation share per engine, top-1/top-3/snippet share, trend, most-cited domains.
// Input: scoreboard/runs/*.csv (one file per week, or one file with a week column; subfolders such as runs/proxy/ are never read). Columns (see assets/scoreboard/runs-template.csv):
//   week,prompt_id,engine,google_position,snippet_owner,ai_overview_cited,cited_domains,brand_named,brand_position,third_party_names_us,map_pack,notes
//   engine ∈ Google | AI Overview | ChatGPT | Perplexity | Gemini | Claude | Copilot | AI Mode
//   AI Overview data may be recorded on the Google row (ai_overview_cited + cited_domains) OR as a separate "AI Overview" row: both count.
//   map_pack: yes/no on the Google row of local prompts — is the business in the map pack for that query? (Layer 21.5 "map pack held")
//   cited_domains: domains in the order the engine lists them, separated by ";"   brand_named: yes/no (named without a link)
//   third_party_names_us: yes/no — one of the cited sources is a third-party page that names the brand (Layer 15 "Done when" #5)
//   Several rows with the same week, prompt and engine (three passes) are all kept: the case counts when most of its runs agree (2 of 3).
//   prompt_id must exist in prompts.csv: an unknown id is listed and left out of the streaks and the definition of first (never "commercial").
//   A row whose notes start with "PROXY" (a stand-in measure) is left out, so a proxy week never enters a trend; --proxy scores proxy rows
//   alone (e.g. --runs scoreboard/runs/proxy --proxy): the table only, no trend, no streaks, no definition of first, written to
//   scoreboard/summary-proxy.csv (never over summary.csv, which dashboard.mjs and weekly.mjs read as the real scoreboard).
// Usage: node citation-share.mjs [--runs scoreboard/runs] [--brand x.ma] [--config site.config.json] [--prompts scoreboard/prompts.csv] [--out scoreboard/summary.csv] [--proxy]
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { loadConfig, parseArgs, csvObjects, toCsv, c, readRuns, holds, casePosition } from "./lib.mjs";
export { runsRank } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const brand = (args.brand ?? (cfg ? new URL(cfg.site).host : "")).replace(/^www\./, "").toLowerCase();
if (!brand) { console.error("Need --brand <domain> or site.config.json"); process.exit(1); }
const dir = args.runs ?? "scoreboard/runs";
if (!existsSync(dir)) { console.error(`No runs folder: ${dir}`); process.exit(1); }

const out = args.out ?? (args.proxy ? "scoreboard/summary-proxy.csv" : "scoreboard/summary.csv"); // a proxy table never replaces the real one
const COLUMNS = ["week", "engine", "prompts", "top1_pct", "top3_pct", "top10_pct", "snippet_pct", "cited_pct", "first_pct", "map_pack_pct"];

// Files per week: <week>-gsc.csv (gsc-api.mjs), <week>-google.csv (serp.mjs), <week>-ai.csv (ai-runs.mjs), <week>.csv (hand-filled).
// Precedence for the same (week, prompt, engine): hand-filled <week>.csv > <week>-google.csv (SerpApi) / <week>-ai.csv > <week>-gsc.csv (average position only).
// Each (week, prompt, engine) is a case; the rows of the winning file are all kept as its runs (lib.mjs readRuns), never overwritten.
const { cases, proxySkipped } = readRuns(dir, { proxy: !!args.proxy });
if (proxySkipped) console.log(c.yellow(`${proxySkipped} PROXY row(s) left out: a proxy week never enters a trend (keep them in ${dir}/proxy/; --runs ${dir}/proxy --proxy scores them alone).`));
if (!cases.length) { writeFileSync(out, toCsv([], COLUMNS)); console.error(`No rows found in ${dir} (its subfolders, such as proxy/, are not read): ${out} reset to its header, so no old week is reported as this one.`); process.exit(1); }
const norm = (d) => d.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
const isBrand = (d) => norm(d) === brand || norm(d).endsWith("." + brand);
const yes = (v) => /^(y|yes|oui|1|true)$/i.test((v ?? "").trim());
const domainsOf = (r) => (r.cited_domains ?? "").split(";").map((d) => d.trim()).filter(Boolean);
const citesUs = (r) => domainsOf(r).some(isBrand);
const sameEngine = (a, b) => (a ?? "").toLowerCase() === (b ?? "").toLowerCase();
// the domains a case cites: the run's list (repeats included) for one run, the domains most runs cite for several
const caseDomains = (k) => (k.runs.length === 1 ? domainsOf(k.runs[0]).map(norm) : [...new Set(k.runs.flatMap(domainsOf).map(norm))].filter((d) => holds(k.runs, (r) => domainsOf(r).map(norm).includes(d))));

// ---------- prompt types: an id missing from prompts.csv is "unknown", reported, never scored ----------
const promptsFile = args.prompts ?? "scoreboard/prompts.csv";
const promptTypes = new Map();
if (existsSync(promptsFile)) for (const r of csvObjects(readFileSync(promptsFile, "utf8"))) promptTypes.set(r.id, r.type);
const unknown = [...new Set(cases.map((k) => k.prompt_id))].filter((id) => !promptTypes.has(id));
if (unknown.length) console.log(c.yellow(`${unknown.length} prompt_id(s) not in ${promptsFile}${existsSync(promptsFile) ? "" : " (file missing)"}: counted as unknown, left out of the streaks and the definition of first — ${unknown.join(", ")}`));

// ---------- per week per engine (one case per prompt: a case counts when most of its runs agree) ----------
const weeks = [...new Set(cases.map((k) => k.week))].sort();
const engines = [...new Set(cases.map((k) => k.engine))];
const summary = [];
for (const week of weeks) {
  for (const engine of engines) {
    const ks = cases.filter((k) => k.week === week && k.engine === engine);
    if (!ks.length) continue;
    const n = ks.length;
    if (/^google$/i.test(engine)) {
      const pos = ks.map((k) => casePosition(k.runs));
      const top1 = pos.filter((p) => p === 1).length, top3 = pos.filter((p) => p >= 1 && p <= 3).length, top10 = pos.filter((p) => p >= 1 && p <= 10).length;
      const snippet = ks.filter((k) => holds(k.runs, (r) => r.snippet_owner && isBrand(r.snippet_owner))).length;
      const aio = ks.filter((k) => holds(k.runs, (r) => yes(r.ai_overview_cited) || citesUs(r))).length;
      const packRuns = ks.map((k) => k.runs.filter((r) => (r.map_pack ?? "").trim() !== "")).filter((rs) => rs.length);
      summary.push({ week, engine, prompts: n, top1_pct: pct(top1, n), top3_pct: pct(top3, n), top10_pct: pct(top10, n), snippet_pct: pct(snippet, n), cited_pct: aio ? pct(aio, n) : "", first_pct: "", map_pack_pct: packRuns.length ? pct(packRuns.filter((rs) => holds(rs, (r) => yes(r.map_pack))).length, packRuns.length) : "" });
    } else {
      const cited = ks.filter((k) => holds(k.runs, (r) => yes(r.ai_overview_cited) || yes(r.brand_named) || citesUs(r))).length;
      const first = ks.filter((k) => holds(k.runs, (r) => { const d = domainsOf(r); return d.length && isBrand(d[0]); })).length;
      summary.push({ week, engine, prompts: n, top1_pct: "", top3_pct: "", top10_pct: "", snippet_pct: "", cited_pct: pct(cited, n), first_pct: pct(first, n), map_pack_pct: "" });
    }
  }
}
function pct(a, b) { return b ? Math.round((100 * a) / b) : 0; }

console.log(c.bold(`Scoreboard for ${brand} — ${weeks.length} week(s), ${engines.length} engine(s)`));
console.table(summary);
console.log(c.dim("Google row: cited_pct = AI Overview citations recorded on the Google rows; map_pack_pct = local prompts where the business is in the map pack."))
const multi = cases.filter((k) => k.runs.length > 1);
if (multi.length) console.log(c.dim(`${multi.length} case(s) recorded with several runs (passes): each counts once, with the result most of its runs agree on (2 of 3) — ${multi.slice(0, 8).map((k) => `${k.week} ${k.prompt_id} ${k.engine} ×${k.runs.length}`).join(", ")}${multi.length > 8 ? "…" : ""}`));
if (args.proxy) console.log(c.yellow("PROXY rows read (--proxy): the table only — no trend, no streaks, no definition of first (a proxy week is never compared with another week)."));

// ---------- trend: latest vs 4 weeks ago ----------
if (weeks.length >= 2 && !args.proxy) {
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
  for (const k of cases.filter((k) => k.week === last && k.engine === engine)) for (const d of caseDomains(k)) counts.set(d, (counts.get(d) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (top.length) console.log(`  ${engine.padEnd(12)} ${top.map(([d, n]) => `${d === brand ? c.green(d) : d} (${n})`).join(", ")}`);
}

// ---------- prompts that moved most (Google position) ----------
if (weeks.length >= 2 && !args.proxy) {
  const prev = weeks.at(-2);
  const moves = [];
  for (const k of cases.filter((k) => k.week === last && /^google$/i.test(k.engine))) {
    const p = cases.find((x) => x.week === prev && x.engine === k.engine && x.prompt_id === k.prompt_id);
    const from = p ? casePosition(p.runs) : 0, to = casePosition(k.runs);
    if (from && to) moves.push({ prompt_id: k.prompt_id, from, to, delta: from - to });
  }
  moves.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  if (moves.length) { console.log(`\nPrompts that moved most (${prev} → ${last}); the biggest mover is this week's focus:`); console.table(moves.slice(0, 5)); }
}

// ---------- streaks and the definition of first (Layer 13 #4, Layer 21.5) ----------
const last4 = weeks.slice(-4);
const scored = (id) => ["informational", "commercial", "local"].includes(promptTypes.get(id)); // unknown ids are not scored
const promptIds = [...new Set(cases.map((k) => k.prompt_id))].filter(scored);
const isAio = (r) => (/^ai overview$/i.test(r.engine) && (yes(r.ai_overview_cited) || citesUs(r))) || (/^google$/i.test(r.engine) && yes(r.ai_overview_cited));
const isSnippet = (r) => /^google$/i.test(r.engine) && r.snippet_owner && isBrand(r.snippet_owner);
// held = the predicate holds on most runs of one of that prompt's cases that week (an engine's case, or the Google one)
const heldIn = (w, id, pred) => cases.some((k) => k.week === w && k.prompt_id === id && holds(k.runs, pred));
// streak = number of consecutive most-recent weeks the predicate held for that prompt (over the weeks available)
const streak = (id, pred) => { let n = 0; for (const w of [...weeks].reverse()) { if (heldIn(w, id, pred)) n++; else break; } return n; };
const snippetStreaks = promptIds.map((id) => [id, streak(id, isSnippet)]).filter(([, n]) => n > 0);
const aioStreaks = promptIds.map((id) => [id, streak(id, isAio)]).filter(([, n]) => n > 0);
const fmt = (arr) => arr.map(([id, n]) => `${id}×${n}w`).join(", ") || "none";
const heldFour = promptIds.filter((id) => streak(id, (r) => isSnippet(r) || isAio(r)) >= 4).length;
const thirdParty = new Set(cases.filter((k) => last4.includes(k.week) && !/^google$/i.test(k.engine) && holds(k.runs, (r) => yes(r.third_party_names_us))).map((k) => k.prompt_id).filter(scored));
if (!args.proxy) {
  console.log(`\nStreaks (consecutive most-recent weeks, ${weeks.length} week(s) of data): snippet/PAA ${fmt(snippetStreaks)} · AI Overview ${fmt(aioStreaks)}`);
  console.log(`Answer boxes/citations held ≥ 4 weeks: ${heldFour} prompt(s) — Layer 13 target: at least 3${weeks.length < 4 ? c.dim(" (need 4 weeks of runs)") : ""}`);
  if (cases.some((k) => k.runs.some((r) => "third_party_names_us" in r))) console.log(`Third-party page naming the brand among cited sources (last ${last4.length} week(s)): ${thirdParty.size}/${promptIds.length} prompts — Layer 15 target: half`);
}

if (weeks.length >= 4 && !args.proxy) {
  const commLocal = promptIds.filter((id) => ["commercial", "local"].includes(promptTypes.get(id)));
  const allWeeks = (id, pred) => last4.every((w) => heldIn(w, id, pred));
  const pos1 = commLocal.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && +r.google_position === 1));
  const rest = promptIds.filter((id) => !commLocal.includes(id));
  const top3 = rest.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && +r.google_position >= 1 && +r.google_position <= 3));
  const aeo = promptIds.filter((id) => allWeeks(id, (r) => isSnippet(r) || isAio(r)));
  const localIds = promptIds.filter((id) => promptTypes.get(id) === "local");
  const packData = cases.some((k) => localIds.includes(k.prompt_id) && k.runs.some((r) => (r.map_pack ?? "").trim() !== ""));
  const packHeld = localIds.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && yes(r.map_pack)));
  const aiEngines = engines.filter((e) => !/^(google|ai overview)$/i.test(e));
  const geoEngines = aiEngines.filter((e) => { const cited = promptIds.filter((id) => allWeeks(id, (r) => sameEngine(r.engine, e) && (yes(r.brand_named) || citesUs(r)))); return cited.length >= promptIds.length / 2; });
  const domCount = new Map(); for (const k of cases.filter((k) => last4.includes(k.week) && !/^google$/i.test(k.engine))) for (const d of caseDomains(k)) domCount.set(d, (domCount.get(d) ?? 0) + 1);
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

writeFileSync(out, toCsv(summary, COLUMNS));
console.log(`\nwritten ${out}`);
