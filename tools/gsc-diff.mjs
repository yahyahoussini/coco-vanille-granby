#!/usr/bin/env node
// scripts/gsc-diff.mjs — Layer 18 drop protocol, step 1: diff two Search Console exports (Pages or Queries tab, same date length).
// Export: Search Console → Performance → filter dates (28 days before / 28 days after) → Export → CSV. Use the Pages.csv or Queries.csv file.
// Usage: node gsc-diff.mjs before.csv after.csv [--metric clicks|impressions] [--top 15]
import { readFileSync } from "node:fs";
import { parseArgs, csvObjects } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const [beforeFile, afterFile] = args._;
if (!beforeFile || !afterFile) { console.error("Usage: node gsc-diff.mjs before.csv after.csv [--metric clicks|impressions]"); process.exit(1); }
const metric = (args.metric ?? "clicks").toLowerCase();
const top = +(args.top ?? 15);

function load(file) {
  const objs = csvObjects(readFileSync(file, "utf8"));
  const keys = Object.keys(objs[0] ?? {});
  const keyCol = keys.find((k) => /page|query|top pages|top queries|requête|url/i.test(k)) ?? keys[0];
  const metCol = keys.find((k) => k.startsWith(metric) || (metric === "clicks" && /clics/i.test(k)) || (metric === "impressions" && /impress/i.test(k)));
  if (!metCol) throw new Error(`No "${metric}" column in ${file}. Columns: ${keys.join(", ")}`);
  const map = new Map();
  for (const o of objs) map.set(o[keyCol], Number(String(o[metCol]).replace(/[^\d.-]/g, "")) || 0);
  return { map, keyCol };
}
const before = load(beforeFile), after = load(afterFile);
const keys = new Set([...before.map.keys(), ...after.map.keys()]);
const rows = [...keys].map((key) => ({ key, before: before.map.get(key) ?? 0, after: after.map.get(key) ?? 0 }))
  .map((r) => ({ ...r, delta: r.after - r.before, pct: r.before ? Math.round((100 * (r.after - r.before)) / r.before) : (r.after ? 100 : 0) }))
  .sort((a, b) => a.delta - b.delta);

const tb = [...before.map.values()].reduce((a, b) => a + b, 0), ta = [...after.map.values()].reduce((a, b) => a + b, 0);
console.log(`${metric}: ${tb} → ${ta} (${ta - tb >= 0 ? "+" : ""}${ta - tb}, ${tb ? Math.round((100 * (ta - tb)) / tb) : 0}%) across ${keys.size} ${before.keyCol}`);
const losers = rows.filter((r) => r.delta < 0), gainers = rows.filter((r) => r.delta > 0);
console.log(`Scope: ${losers.length} lost, ${gainers.length} gained, ${rows.filter((r) => r.delta === 0).length} unchanged. ${losers.slice(0, 3).reduce((a, r) => a + r.delta, 0) / (losers.reduce((a, r) => a + r.delta, 0) || 1) > 0.6 ? "Loss is concentrated in ≤3 entries (page/section problem)." : "Loss is spread out (site-wide: algorithmic, technical or demand)."}`);
console.log("\nBiggest losses"); console.table(losers.slice(0, top));
console.log("Biggest gains"); console.table(gainers.slice(-Math.min(top, 10)).reverse());
console.log("Disappeared (had data before, none after):"); console.table(rows.filter((r) => r.before > 0 && r.after === 0).slice(0, 10));
