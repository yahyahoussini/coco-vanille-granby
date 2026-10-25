#!/usr/bin/env node
// scripts/portfolio.mjs — every client in one table (Layer 20: the One-Man-Empire view): latest week measured, Google top-3 / snippet /
// AI-cited shares with their 4-week trend, reviews velocity, unresolved [[FACT NEEDED]] markers, open human tasks, and the clients
// whose scoreboard has not been run this week. Run from the folder that contains the client projects (each has site.config.json).
// Usage: node portfolio.mjs [dir] [--out portfolio.md]
import { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseArgs, csvObjects, walkHtml, c, isoWeek, isoDate } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const dir = args._[0] ?? ".";
const week = isoWeek();
const clients = readdirSync(dir).filter((d) => { try { return statSync(join(dir, d)).isDirectory() && existsSync(join(dir, d, "site.config.json")); } catch { return false; } });
if (!clients.length) { console.error(`No client projects under ${dir} (folders with site.config.json)`); process.exit(1); }
const rows = [];
for (const d of clients) {
  const p = join(dir, d);
  const cfg = JSON.parse(readFileSync(join(p, "site.config.json"), "utf8"));
  const summary = existsSync(join(p, "scoreboard/summary.csv")) ? csvObjects(readFileSync(join(p, "scoreboard/summary.csv"), "utf8")) : [];
  const weeks = [...new Set(summary.map((r) => r.week))].sort();
  const last = weeks.at(-1), prev = weeks[Math.max(0, weeks.length - 5)];
  const g = (w, e, k) => summary.find((r) => r.week === w && new RegExp(`^${e}$`, "i").test(r.engine))?.[k];
  const trend = (e, k) => (last && prev && last !== prev && g(last, e, k) !== undefined && g(prev, e, k) !== undefined ? ` (${+g(last, e, k) - +g(prev, e, k) >= 0 ? "+" : ""}${+g(last, e, k) - +g(prev, e, k)})` : "");
  const ai = [...new Set(summary.filter((r) => r.week === last && !/^google$/i.test(r.engine)).map((r) => r.engine))];
  const aiCited = ai.length ? Math.round(ai.reduce((s, e) => s + (+g(last, e, "cited_pct") || 0), 0) / ai.length) : "";
  const reviews = existsSync(join(p, "scoreboard/reviews.csv")) ? csvObjects(readFileSync(join(p, "scoreboard/reviews.csv"), "utf8")).filter((r) => r.week).sort((a, b) => a.week.localeCompare(b.week)).slice(-4) : [];
  const root = join(p, cfg.root ?? "site");
  let markers = 0; if (existsSync(root)) for (const f of walkHtml(root)) markers += (readFileSync(f, "utf8").match(/\[\[FACT NEEDED/g) ?? []).length;
  const tasks = existsSync(join(p, "docs/13-taches-humaines.md")) ? (readFileSync(join(p, "docs/13-taches-humaines.md"), "utf8").match(/\|\s*☐\s*\|\s*$|^\s*[-*]\s*\[ \]/gm) ?? []).length : "";
  rows.push({ client: cfg.brand?.name ?? d, site: cfg.site, last_run: last ?? "never", this_week: last === week ? "yes" : "NO", top3: last ? `${g(last, "google", "top3_pct") ?? "—"}${trend("google", "top3_pct")}` : "—", snippet: last ? `${g(last, "google", "snippet_pct") ?? "—"}${trend("google", "snippet_pct")}` : "—", ai_cited: aiCited === "" ? "—" : `${aiCited} % (${ai.length} eng.)`, reviews_4w: reviews.length ? reviews.map((r) => r.new_reviews).join("/") : "—", fact_needed: markers, open_tasks: tasks });
}
rows.sort((a, b) => (a.this_week === "NO" ? -1 : 1) - (b.this_week === "NO" ? -1 : 1) || a.client.localeCompare(b.client));
console.log(c.bold(`Portfolio — ${clients.length} client(s) — week ${week}`));
console.table(rows);
const md = [`# Portefeuille — semaine ${week} (${isoDate()})`, "", "| Client | Site | Dernier run | Run cette semaine | Google top 3 | Extraits | Cité IA | Avis (4 sem.) | FACT NEEDED | Tâches ouvertes |", "|---|---|---|---|---|---|---|---|---|---|", ...rows.map((r) => `| ${r.client} | ${r.site} | ${r.last_run} | ${r.this_week} | ${r.top3} | ${r.snippet} | ${r.ai_cited} | ${r.reviews_4w} | ${r.fact_needed} | ${r.open_tasks} |`), "", "Ordre du lundi : d'abord les clients sans run cette semaine, puis ceux dont un indicateur baisse depuis 4 semaines, puis les marqueurs FACT NEEDED encore ouverts (relancer le client)."];
writeFileSync(args.out ?? join(dir, "portfolio.md"), md.join("\n") + "\n");
console.log(c.dim(`written ${args.out ?? join(dir, "portfolio.md")}`));
