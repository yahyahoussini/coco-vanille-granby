#!/usr/bin/env node
// scripts/dashboard.mjs — one self-contained HTML page for the client (Layers 17, 20.5): the 30-prompt scoreboard as curves per engine
// (top-3 share, snippet share, AI citation share, map pack), the definition-of-first status, review velocity, share of voice vs
// competitors, leads from GA4 exports, and the next moves from the market map. No dependencies, no external requests — it opens
// from a file, an e-mail attachment or a private URL. Run after `npm run score` (reads scoreboard/summary.csv).
// Usage: node dashboard.mjs [--out reports/dashboard.html] [--week 2026-W40] [--market scoreboard/market/2026-W40.md]
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { loadConfig, parseArgs, csvObjects, c, isoDate } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const brand = cfg?.brand?.name ?? args.brand ?? "Client";
const readCsv = (p) => (existsSync(p) ? csvObjects(readFileSync(p, "utf8")) : []);
const summary = readCsv("scoreboard/summary.csv");
if (!summary.length) { console.error("No scoreboard/summary.csv — run `npm run score` first."); process.exit(1); }
const reviews = readCsv("scoreboard/reviews.csv").filter((r) => r.week).sort((a, b) => a.week.localeCompare(b.week));
const weeks = [...new Set(summary.map((r) => r.week))].sort();
const engines = [...new Set(summary.map((r) => r.engine))];
const latestDir = (base) => (existsSync(base) ? readdirSync(base).filter((d) => /^\d{4}-W\d{2}$/.test(d)).sort().at(-1) : null);
const serpWeek = latestDir("serp");
const sov = serpWeek ? readCsv(join("serp", serpWeek, "share-of-voice.csv")).slice(0, 8) : [];
const gsc = existsSync("gsc") ? readdirSync("gsc").filter((f) => f.endsWith("-positions.csv")).sort().at(-1) : null;
const positions = gsc ? readCsv(join("gsc", gsc)) : [];
const ga4 = existsSync("ga4") ? readdirSync("ga4").filter((f) => f.endsWith("-leads.csv")).sort().at(-1) : null;
const leads = ga4 ? readCsv(join("ga4", ga4)) : [];
const marketFile = args.market ?? "docs/19-marche-et-concurrence.md"; // weekly.mjs passes this week's scoreboard/market/<week>.md
const market = existsSync(marketFile) ? readFileSync(marketFile, "utf8") : "";
const moves = (market.match(/## 4\. Les dix coups[\s\S]*?\n(?=## 5)/)?.[0] ?? "").split("\n").filter((l) => /^\d+\. /.test(l)).map((l) => l.replace(/\*\*/g, ""));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

// ---------- SVG line chart ----------
function lineChart(title, series, { max = 100, unit = "%" } = {}) {
  const W = 560, H = 220, L = 40, B = 34, T = 28, R = 12;
  const x = (i) => L + (weeks.length > 1 ? (i * (W - L - R)) / (weeks.length - 1) : (W - L - R) / 2);
  const y = (v) => T + (H - T - B) * (1 - Math.min(max, +v || 0) / max);
  const colors = ["#1f5f8b", "#c0392b", "#27ae60", "#8e44ad", "#e67e22", "#16a085", "#7f8c8d"];
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}"><text x="${L}" y="18" class="t">${esc(title)}</text>`;
  for (const f of [0, 0.25, 0.5, 0.75, 1]) { const g = Math.round(f * max); s += `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" class="grid"/><text x="${L - 6}" y="${y(g) + 4}" text-anchor="end" class="ax">${g}${unit}</text>`; }
  weeks.forEach((w, i) => { if (weeks.length <= 12 || i % Math.ceil(weeks.length / 12) === 0) s += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" class="ax">${esc(w.replace(/^\d{4}-/, ""))}</text>`; });
  series.forEach((sr, k) => { const pts = sr.values.map((v, i) => (v === "" || v === undefined ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`)); const d = pts.map((p, i) => (p ? `${i && pts[i - 1] ? "L" : "M"}${p}` : "")).join(" "); s += `<path d="${d}" fill="none" stroke="${colors[k % colors.length]}" stroke-width="2.5"/>`; pts.forEach((p) => { if (p) s += `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="${colors[k % colors.length]}"/>`; }); s += `<text x="${W - R}" y="${T + 14 * k}" text-anchor="end" fill="${colors[k % colors.length]}" class="lg">${esc(sr.name)}</text>`; });
  return s + "</svg>";
}
function barChart(title, items, { unit = "" } = {}) {
  const W = 560, rowH = 22, H = 40 + rowH * items.length, max = Math.max(...items.map((i) => +i.value || 0)) || 1;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}"><text x="8" y="18" class="t">${esc(title)}</text>`;
  items.forEach((it, i) => { const w = (340 * (+it.value || 0)) / max, y = 32 + i * rowH; s += `<text x="180" y="${y + 14}" text-anchor="end" class="ax">${esc(String(it.label).slice(0, 28))}</text><rect x="188" y="${y}" width="${w.toFixed(1)}" height="16" fill="${it.us ? "#27ae60" : "#1f5f8b"}"/><text x="${(192 + w).toFixed(1)}" y="${y + 13}" class="ax">${esc(it.value)}${unit}</text>`; });
  return s + "</svg>";
}
const val = (engine, key) => weeks.map((w) => summary.find((r) => r.week === w && r.engine === engine)?.[key] ?? "");
const google = engines.find((e) => /^google$/i.test(e));
const aiEngines = engines.filter((e) => !/^google$/i.test(e));
const last = weeks.at(-1);
const kpi = (label, v, note = "") => `<div class="kpi"><div class="v">${esc(v)}</div><div class="l">${esc(label)}</div>${note ? `<div class="n">${esc(note)}</div>` : ""}</div>`;
const lastRow = (e) => summary.find((r) => r.week === last && r.engine === e) ?? {};
const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Tableau de bord — ${esc(brand)} — ${esc(last)}</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;background:#f5f6f8;color:#1a1a1a}header{background:#1f2d3d;color:#fff;padding:18px 28px}header h1{margin:0;font-size:20px}header p{margin:4px 0 0;opacity:.8;font-size:13px}main{padding:20px 28px;max-width:1240px;margin:auto}.row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:20px}.kpi{background:#fff;border-radius:10px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.08)}.kpi .v{font-size:26px;font-weight:700}.kpi .l{font-size:12px;color:#555;margin-top:2px}.kpi .n{font-size:11px;color:#888;margin-top:4px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:16px}.card{background:#fff;border-radius:10px;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}svg{width:100%;height:auto}.t{font-size:13px;font-weight:600}.ax{font-size:10px;fill:#666}.lg{font-size:11px}line.grid{stroke:#e5e7eb}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:6px 8px;border-bottom:1px solid #eee;text-align:left}th{background:#fafafa}ol{padding-left:20px;font-size:14px}.ok{color:#27ae60;font-weight:600}.ko{color:#c0392b;font-weight:600}footer{font-size:11px;color:#777;padding:16px 28px}</style></head>
<body><header><h1>${esc(brand)} — visibilité Google, réponses (AEO) et moteurs IA (GEO)</h1><p>Semaine ${esc(last)} · ${weeks.length} semaine(s) mesurée(s) · généré le ${isoDate()} · tendances sur 4 semaines, jamais sur une seule</p></header><main>
<div class="row">${google ? kpi("Top 3 Google", `${lastRow(google).top3_pct ?? "—"} %`, `n°1 : ${lastRow(google).top1_pct ?? "—"} %`) + kpi("Extraits / PAA", `${lastRow(google).snippet_pct ?? "—"} %`, "part des prompts") + kpi("Pack local", lastRow(google).map_pack_pct !== "" && lastRow(google).map_pack_pct !== undefined ? `${lastRow(google).map_pack_pct} %` : "—", "prompts locaux") : ""}${aiEngines.map((e) => kpi(`Cité par ${e}`, `${lastRow(e).cited_pct ?? "—"} %`, `en 1er : ${lastRow(e).first_pct ?? "—"} %`)).join("")}${reviews.length ? kpi("Nouveaux avis", reviews.at(-1).new_reviews, `${reviews.at(-1).avg_rating ? reviews.at(-1).avg_rating + "★ · " : ""}objectif ≥ 3 / semaine`) : ""}${leads.length ? kpi("Clics WhatsApp + tél. (GA4)", leads.filter((l) => /whatsapp_click|phone_click/.test(l.eventname)).reduce((s, l) => s + (+l.eventcount || 0), 0), "28 derniers jours") : ""}</div>
<div class="grid">
${google ? `<div class="card">${lineChart("Google — part des prompts en top 3 / n°1 / extrait", [{ name: "top 3", values: val(google, "top3_pct") }, { name: "n°1", values: val(google, "top1_pct") }, { name: "extrait", values: val(google, "snippet_pct") }])}</div>` : ""}
<div class="card">${lineChart("Moteurs IA — part des prompts où nous sommes cités", aiEngines.map((e) => ({ name: e, values: val(e, "cited_pct") })))}</div>
${sov.length ? `<div class="card">${barChart(`Part de voix Google (${esc(serpWeek)}) — qui possède le marché`, sov.map((s) => ({ label: s.host, value: s.score, us: s.is_us === "yes" })))}</div>` : ""}
${reviews.length ? `<div class="card">${lineChart("Avis Google — nouveaux avis par semaine", [{ name: "nouveaux avis", values: weeks.map((w) => reviews.find((r) => r.week === w)?.new_reviews ?? "") }], { max: Math.max(10, ...reviews.map((r) => +r.new_reviews || 0)), unit: "" })}</div>` : ""}
${positions.length ? `<div class="card"><table><thead><tr><th>Prompt</th><th>Position (Search Console)</th><th>Impressions</th><th>Clics</th><th>Page</th></tr></thead><tbody>${positions.slice(0, 33).map((p) => `<tr><td>${esc(p.prompt_id)} ${esc(p.prompt)}</td><td>${esc(p.position || "—")}</td><td>${esc(p.impressions)}</td><td>${esc(p.clicks)}</td><td>${esc(p.page)}</td></tr>`).join("")}</tbody></table></div>` : ""}
${moves.length ? `<div class="card"><h3 style="margin:4px 0 8px;font-size:14px">Les prochains coups (carte de bataille)</h3><ol>${moves.slice(0, 10).map((m) => `<li>${esc(m.replace(/^\d+\.\s*/, ""))}</li>`).join("")}</ol></div>` : ""}
</div>
<p style="font-size:13px;color:#555;margin-top:18px">Définition de « premier » (4 semaines consécutives) : Google position 1 sur ≥ la moitié des prompts commerciaux et locaux, top 3 sur le reste, pack local tenu · un extrait / PAA / AI Overview sur ≥ un tiers · cité sur ≥ la moitié des prompts par ≥ deux moteurs IA et domaine le plus cité de la catégorie. Les indicateurs avancés (impressions, positions, citations, avis) bougent en jours ; les retardés (clics, WhatsApp, revenus) en semaines.</p>
</main><footer>Source : scoreboard/ (30 prompts relevés chaque lundi depuis ${esc(cfg?.nap?.city ?? "le Maroc")}), Search Console, GA4. Généré par rank-first / dashboard.mjs — aucune position promise, la méthode et la mesure le sont.</footer></body></html>`;
const out = args.out ?? "reports/dashboard.html";
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(c.bold(`Dashboard for ${brand}: ${weeks.length} weeks, ${engines.length} engines${sov.length ? ", share of voice" : ""}${reviews.length ? ", reviews" : ""}${positions.length ? ", GSC positions" : ""}${leads.length ? ", GA4 leads" : ""}${moves.length ? ", next moves" : ""}`));
console.log(c.dim(`written ${out} (${Math.round(html.length / 1024)} KB, no external requests — attach it to the monthly report)`));
