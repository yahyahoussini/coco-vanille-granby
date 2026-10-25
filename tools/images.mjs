#!/usr/bin/env node
// scripts/images.mjs — Layer 3 + 19.3: page weight and image hygiene from the files on disk (no browser needed).
// Per page: HTML bytes + local CSS/JS/images referenced = transferred weight estimate (uncompressed); images > 200 KB; JPEG/PNG without WebP/AVIF;
// missing referenced files; non-descriptive file names (IMG_1234.jpg, photo1.png).
// Usage: node images.mjs site [--limit 1048576] [--json images-report.json]
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs, walkHtml, fileToPath, allTags, attr, c } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const root = args._[0];
if (!root || !existsSync(root)) { console.error("Usage: node images.mjs <site-dir>"); process.exit(1); }
const LIMIT = +(args.limit ?? 1024 * 1024);
const rows = [];
let warns = 0, fails = 0;
const seenImages = new Map();
for (const file of walkHtml(root)) {
  const path = fileToPath(root, file);
  const html = readFileSync(file, "utf8");
  let bytes = Buffer.byteLength(html), missing = [], big = [], legacy = [], badNames = [];
  const refs = new Set(), alternates = new Set(); // srcset candidates: checked for existence, not added to the weight (the browser downloads one)
  for (const t of allTags(html, "img")) { const s = attr(t, "src"); if (s) refs.add(s); for (const cand of (attr(t, "srcset") ?? "").split(",")) { const u = cand.trim().split(/\s+/)[0]; if (u && u !== s) { refs.add(u); alternates.add(u); } } }
  for (const t of allTags(html, "link")) { const rel = (attr(t, "rel") ?? "").toLowerCase(); const h = attr(t, "href"); if (h && /stylesheet|preload|icon/.test(rel)) refs.add(h); }
  for (const t of allTags(html, "script")) { const s = attr(t, "src"); if (s) refs.add(s); }
  for (const t of allTags(html, "source")) { const s = attr(t, "srcset") ?? attr(t, "src"); if (s) refs.add(s.split(",")[0].trim().split(/\s+/)[0]); }
  for (const r of refs) {
    if (!r.startsWith("/") || r.startsWith("//")) continue; // external or data:
    const f = join(root, r.replace(/[?#].*$/, ""));
    if (!existsSync(f)) { missing.push(r); continue; }
    const size = statSync(f).size;
    if (!alternates.has(r)) bytes += size;
    if (/\.(jpe?g|png|gif|webp|avif|svg)$/i.test(r)) {
      seenImages.set(r, size);
      if (size > 200 * 1024) big.push(`${r} (${Math.round(size / 1024)} KB)`);
      if (/\.(jpe?g|png)$/i.test(r) && !/(favicon|apple-touch-icon|\/og-|icon-\d)/i.test(r) && !existsSync(f.replace(/\.(jpe?g|png)$/i, ".webp")) && !existsSync(f.replace(/\.(jpe?g|png)$/i, ".avif"))) legacy.push(r);
      if (/(^|\/)(img|image|photo|pic|dsc|screenshot)[-_]?\d*\.(jpe?g|png|webp|avif)$/i.test(r) || /\/\d+\.(jpe?g|png|webp)$/i.test(r)) badNames.push(r);
    }
  }
  const issues = [];
  const list = (arr) => arr.slice(0, 3).join(", ") + (arr.length > 3 ? ` (+${arr.length - 3} more)` : "");
  if (missing.length) { fails++; issues.push(`${missing.length} missing file(s): ${list(missing)}`); }
  if (bytes > LIMIT) { warns++; issues.push(`page weight ≈ ${Math.round(bytes / 1024)} KB uncompressed (target < ${Math.round(LIMIT / 1024)} KB)`); }
  if (big.length) { warns++; issues.push(`large images: ${list(big)}`); }
  if (legacy.length) { warns++; issues.push(`JPEG/PNG without WebP/AVIF sibling: ${list(legacy)}`); }
  if (badNames.length) { warns++; issues.push(`non-descriptive image names: ${list(badNames)}`); }
  rows.push({ path, kb: Math.round(bytes / 1024), images: [...refs].filter((r) => /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(r)).length, issues: issues.join("; ") });
  console.log(`${missing.length ? c.red("✗") : issues.length ? c.yellow("!") : c.green("✓")} ${path} — ${Math.round(bytes / 1024)} KB${issues.length ? c.dim(" — " + issues.join("; ")) : ""}`);
}
console.log(`\n${rows.length} page(s): ${fails ? c.red(fails + " with missing files") : "no missing files"}, ${warns ? c.yellow(warns + " warning(s)") : "0 warnings"}. Export images at display size, WebP/AVIF, descriptive names (Layer 3.3, 19.3).`);
if (args.json) writeFileSync(args.json, JSON.stringify({ rows, generated: new Date().toISOString() }, null, 2));
process.exit(fails ? 1 : 0);
