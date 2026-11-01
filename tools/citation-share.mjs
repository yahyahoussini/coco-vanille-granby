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
// The definition of first (docs/01 §5, decision M14) is read on 4 consecutive ISO weeks (four Mondays in a row; a missing week
//   means no verdict), over the frozen scored set of prompts.csv (every informational, commercial and local row, measured or not:
//   a prompt without a row that week counts as not held), once on all prompts and once on the French prompts only (both must
//   hold). A case with fewer than 3 runs, or a scored prompt without a row, makes it a « mesure partielle », printed as such.
//   GEO's most linked domain is the brand or a pastry shop of competitors.csv; directories and every other domain are counted
//   apart. The 7 × 7 map-pack grid and the « meilleure… » rule stay a monthly check by hand (docs/07).
// Also writes reports/scoreboard.json for Coco Studio › Agence ([{ week: Monday 'YYYY-MM-DD', seo, aeo, geo }], one row per week:
//   seo = commercial and local prompts at Google position 1, aeo = prompts with our snippet/PAA/AI Overview, geo = prompts
//   where at least 2 AI engines name or cite the brand; each « held/scored »).
// Usage: node citation-share.mjs [--runs scoreboard/runs] [--brand x.ma] [--config site.config.json] [--prompts scoreboard/prompts.csv]
//        [--competitors scoreboard/competitors.csv] [--out scoreboard/summary.csv] [--json-out reports/scoreboard.json] [--proxy]
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
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
const promptTypes = new Map(), promptLangs = new Map();
if (existsSync(promptsFile)) for (const r of csvObjects(readFileSync(promptsFile, "utf8"))) { promptTypes.set(r.id, r.type); promptLangs.set(r.id, (r.lang ?? "").trim().toLowerCase()); }
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
// The frozen scored set of prompts.csv is the denominator (docs/01 §5), not the prompts that happen to be in the runs.
const promptIds = [...promptTypes.keys()].filter(scored);
const isAio = (r) => (/^ai overview$/i.test(r.engine) && (yes(r.ai_overview_cited) || citesUs(r))) || (/^google$/i.test(r.engine) && yes(r.ai_overview_cited));
const isSnippet = (r) => /^google$/i.test(r.engine) && r.snippet_owner && isBrand(r.snippet_owner);
// held = the predicate holds on most runs of one of that prompt's cases that week (an engine's case, or the Google one)
const heldIn = (w, id, pred) => cases.some((k) => k.week === w && k.prompt_id === id && holds(k.runs, pred));
// ISO week label → its Monday (UTC): « four Mondays in a row » holds across a year end (2026 has a W53).
const mondayOf = (w) => { const m = /^(\d{4})-W(\d{2})$/.exec(w); if (!m) return null; const jan4 = new Date(Date.UTC(+m[1], 0, 4)); return new Date(jan4.getTime() + ((+m[2] - 1) * 7 - ((jan4.getUTCDay() || 7) - 1)) * 86400000); };
const nextWeek = (a, b) => { const x = mondayOf(a), y = mondayOf(b); return !!x && !!y && y - x === 7 * 86400000; };
// streak = number of consecutive most-recent ISO weeks the predicate held for that prompt (a week without runs ends it)
const streak = (id, pred) => { let n = 0; const ws = [...weeks].reverse(); for (let i = 0; i < ws.length; i++) { if (i && !nextWeek(ws[i], ws[i - 1])) break; if (heldIn(ws[i], id, pred)) n++; else break; } return n; };
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

const gaps = last4.slice(1).filter((w, i) => !nextWeek(last4[i], w));
const consecutive = last4.length === 4 && !gaps.length;
const isPos1 = (r) => /^google$/i.test(r.engine) && +r.google_position === 1;
const namesUs = (r) => yes(r.brand_named) || citesUs(r);
const aiEngines = engines.filter((e) => !/^(google|ai overview)$/i.test(e));
// GEO's « most linked pastry domain » (docs/01 §5): the brand or a pastry shop of competitors.csv; directories, media and every
// other domain are counted apart (a pastry shop missing from competitors.csv belongs there).
const competitorsFile = args.competitors ?? "scoreboard/competitors.csv";
const pastryDomains = new Set([brand]);
if (existsSync(competitorsFile)) for (const r of csvObjects(readFileSync(competitorsFile, "utf8"))) if ((r.domain ?? "").trim() && !/^(null|—|-)$/i.test(r.domain.trim())) pastryDomains.add(norm(r.domain));
const isPastry = (d) => pastryDomains.has(d) || [...pastryDomains].some((p) => d.endsWith("." + p));

if (weeks.length >= 4 && !args.proxy && !consecutive) {
  console.log(`\nDefinition of first: no verdict — the last 4 weeks of runs (${last4.join(", ")}) are not 4 consecutive ISO weeks (break before ${gaps.join(", ")}). It is read on four Mondays in a row (docs/01 §5).`);
}
if (weeks.length >= 4 && !args.proxy && consecutive) {
  const allWeeks = (id, pred) => last4.every((w) => heldIn(w, id, pred));
  // the domains the AI engines cite over the 4 weeks, on these prompts, most cited first
  const citedDomains = (ids) => { const n = new Map(); for (const k of cases.filter((k) => last4.includes(k.week) && ids.includes(k.prompt_id) && !/^google$/i.test(k.engine))) for (const d of caseDomains(k)) n.set(d, (n.get(d) ?? 0) + 1); return [...n.entries()].sort((a, b) => b[1] - a[1]); };
  // One verdict for a set of prompts: the whole frozen set, then the French prompts alone (both must hold).
  const verdict = (ids) => {
    const ranked = citedDomains(ids);
    const topPastry = ranked.find(([d]) => isPastry(d))?.[0];
    const apart = ranked.filter(([d]) => !isPastry(d)).slice(0, 4);
    const commLocal = ids.filter((id) => ["commercial", "local"].includes(promptTypes.get(id)));
    const rest = ids.filter((id) => !commLocal.includes(id));
    const localIds = ids.filter((id) => promptTypes.get(id) === "local");
    const pos1 = commLocal.filter((id) => allWeeks(id, isPos1));
    const top3 = rest.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && +r.google_position >= 1 && +r.google_position <= 3));
    const aeo = ids.filter((id) => allWeeks(id, (r) => isSnippet(r) || isAio(r)));
    const packData = cases.some((k) => localIds.includes(k.prompt_id) && k.runs.some((r) => (r.map_pack ?? "").trim() !== ""));
    const packHeld = localIds.filter((id) => allWeeks(id, (r) => /^google$/i.test(r.engine) && yes(r.map_pack)));
    const geoEngines = aiEngines.filter((e) => ids.filter((id) => allWeeks(id, (r) => sameEngine(r.engine, e) && namesUs(r))).length >= ids.length / 2);
    const g = !!commLocal.length && pos1.length >= commLocal.length / 2 && (!rest.length || top3.length >= rest.length) && (!localIds.length || (packData && packHeld.length === localIds.length));
    const a = !!ids.length && aeo.length >= ids.length / 3;
    const ge = !!ids.length && geoEngines.length >= 2 && topPastry === brand;
    return { ids, commLocal, rest, localIds, pos1, top3, aeo, packData, packHeld, geoEngines, topPastry, apart, g, a, ge };
  };
  const print = (label, v) => {
    console.log(`\nDefinition of first, ${label} (${last4[0]} → ${last4.at(-1)}, ${v.ids.length} scored prompts):`);
    console.log(`  Google  ${v.g ? c.green("MET") : c.yellow("not yet")} — position 1 on ${v.pos1.length}/${v.commLocal.length} commercial+local (need half), top 3 on ${v.top3.length}/${v.rest.length} others (need all), map pack held on ${v.packData ? `${v.packHeld.length}/${v.localIds.length} local prompts (need all)` : "n/a — fill the map_pack column on local prompts"}`);
    console.log(`  AEO     ${v.a ? c.green("MET") : c.yellow("not yet")} — snippet/PAA/AI Overview held on ${v.aeo.length}/${v.ids.length} (need a third)`);
    console.log(`  GEO     ${v.ge ? c.green("MET") : c.yellow("not yet")} — named or cited on ≥ half of prompts in ${v.geoEngines.length} AI engine(s) [${v.geoEngines.join(", ")}] (need 2); most linked pastry domain: ${v.topPastry ?? "n/a"}${v.topPastry === brand ? " (us)" : ""}`);
    if (v.apart.length) console.log(c.dim(`          counted apart (directories, media, other domains): ${v.apart.map(([d, n]) => `${d} (${n})`).join(", ")} — a pastry shop here belongs in ${competitorsFile}`));
  };
  const all = verdict(promptIds), fr = verdict(promptIds.filter((id) => promptLangs.get(id) === "fr"));
  print("all prompts", all);
  print("French prompts only", fr);
  // « Mesure partielle » (docs/02 §2): each case needs 3 runs (2 of 3 counts), and every scored prompt a row every week.
  const measured = cases.filter((k) => last4.includes(k.week) && scored(k.prompt_id));
  const short = measured.filter((k) => k.runs.length < 3).length;
  const unmeasured = last4.flatMap((w) => promptIds.filter((id) => !cases.some((k) => k.week === w && k.prompt_id === id)).map((id) => `${w} ${id}`));
  const partial = short > 0 || unmeasured.length > 0;
  if (partial) console.log(c.yellow(`  MESURE PARTIELLE: ${short}/${measured.length} case(s) with fewer than 3 runs${unmeasured.length ? `; ${unmeasured.length} scored prompt-week(s) without any row (${unmeasured.slice(0, 6).join(", ")}${unmeasured.length > 6 ? "…" : ""})` : ""}. Say so next to the verdict (docs/07 §3).`));
  console.log(c.dim("  By hand, monthly (docs/07): the 7 × 7 map-pack grid within 3 km (the map_pack column is the top 3 at the point of the check), and the « meilleure… » rule (position 1 also counts when the first result names us first)."));
  if (all.g && all.a && all.ge && fr.g && fr.a && fr.ge && !partial) console.log(c.green("  All three hold on all prompts and on the French prompts: widen the category by one step, or add a city or a language, and run the stack again (Layer 21.5)."));
  else if (all.g && all.a && all.ge && fr.g && fr.a && fr.ge) console.log(c.yellow("  All three hold, on a partial measure: confirm with 3 runs per case before widening."));
}

// ---------- Coco Studio › Agence › Scoreboard (src/lib/studio/reports.js): one row per week ----------
if (!args.proxy) {
  const commLocal = promptIds.filter((id) => ["commercial", "local"].includes(promptTypes.get(id)));
  const rows = weeks.map((w) => ({
    week: mondayOf(w)?.toISOString().slice(0, 10) ?? w,
    seo: `${commLocal.filter((id) => heldIn(w, id, isPos1)).length}/${commLocal.length}`,
    aeo: `${promptIds.filter((id) => heldIn(w, id, (r) => isSnippet(r) || isAio(r))).length}/${promptIds.length}`,
    geo: `${promptIds.filter((id) => aiEngines.filter((e) => cases.some((k) => k.week === w && k.prompt_id === id && sameEngine(k.engine, e) && holds(k.runs, namesUs))).length >= 2).length}/${promptIds.length}`,
  }));
  const jsonOut = args["json-out"] ?? "reports/scoreboard.json";
  mkdirSync(dirname(jsonOut), { recursive: true });
  writeFileSync(jsonOut, JSON.stringify(rows, null, 2) + "\n");
  console.log(c.dim(`written ${jsonOut} (Studio › Agence reads it from REPORTS_DIR)`));
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
