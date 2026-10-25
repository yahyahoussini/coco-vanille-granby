#!/usr/bin/env node
// scripts/validate-html.mjs — Layer 2 "Done when": the page passes validator.w3.org with no errors.
// Sends each HTML file (or URL) to the W3C Nu HTML Checker API and lists errors (warnings with --warnings).
// Usage: node validate-html.mjs site [--warnings] [--max 50]     |     node validate-html.mjs https://x.ma/ https://x.ma/prix/
// Be polite: the public checker is shared; for large sites run it on the top 20 pages, or self-host the checker (validator.github.io/validator).
import { readFileSync, existsSync, statSync } from "node:fs";
import { parseArgs, walkHtml, fileToPath, fetchText, loadConfig, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const targets = args._;
if (!targets.length) { console.error("Usage: node validate-html.mjs <dir|url...> [--warnings]"); process.exit(1); }
const max = +(args.max ?? 50);
const docs = [];
if (existsSync(targets[0]) && statSync(targets[0]).isDirectory()) {
  let cfgPaths = [];
  try { const cfg = loadConfig(args.config ?? "site.config.json"); cfgPaths = (cfg.pages ?? []).flatMap((p) => [p.path, ...Object.values(p.alt ?? {})]); } catch {}
  const files = walkHtml(targets[0]).map((f) => ({ f, path: fileToPath(targets[0], f) }));
  files.sort((a, b) => (cfgPaths.indexOf(a.path) === -1 ? 999 : cfgPaths.indexOf(a.path)) - (cfgPaths.indexOf(b.path) === -1 ? 999 : cfgPaths.indexOf(b.path))); // key pages first
  for (const { f, path } of files.slice(0, max)) docs.push({ name: path, html: readFileSync(f, "utf8") });
} else {
  for (const u of targets.slice(0, max)) { try { docs.push({ name: u, html: (await fetchText(u)).text }); } catch (e) { docs.push({ name: u, error: e.message }); } }
}

let totalErrors = 0;
for (const d of docs) {
  if (d.error) { totalErrors++; console.log(`${c.red("✗")} ${d.name} — ${d.error}`); continue; }
  try {
    const res = await fetch("https://validator.w3.org/nu/?out=json", {
      method: "POST", headers: { "Content-Type": "text/html; charset=utf-8", "User-Agent": "rank-first-validate/1.0" }, body: d.html,
    });
    if (res.status !== 200) { console.log(`${c.yellow("!")} ${d.name} — checker HTTP ${res.status}`); await new Promise((r) => setTimeout(r, 3000)); continue; }
    const json = await res.json();
    const errors = (json.messages ?? []).filter((m) => m.type === "error");
    const warnings = (json.messages ?? []).filter((m) => m.type === "info" && m.subType === "warning");
    totalErrors += errors.length;
    console.log(`${errors.length ? c.red("✗") : c.green("✓")} ${d.name} — ${errors.length} error(s), ${warnings.length} warning(s)`);
    for (const m of errors.slice(0, 10)) console.log(`    line ${m.lastLine ?? "?"}: ${m.message}`);
    if (args.warnings) for (const m of warnings.slice(0, 10)) console.log(`    ${c.dim("warn line " + (m.lastLine ?? "?") + ": " + m.message)}`);
    await new Promise((r) => setTimeout(r, 1200)); // rate-limit courtesy
  } catch (e) { console.log(`${c.yellow("!")} ${d.name} — ${e.message}`); }
}
console.log(`\n${docs.length} document(s), ${totalErrors ? c.red(totalErrors + " error(s)") : c.green("0 errors")}`);
process.exit(totalErrors ? 1 : 0);
