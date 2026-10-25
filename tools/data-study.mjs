#!/usr/bin/env node
// scripts/data-study.mjs — the client's own numbers turned into the category's most-cited asset (Layers 11.4, 15, 16.3): descriptive
// statistics from a CSV (count, min, median, mean, quartiles, max, share per category), a chart as SVG, a press-ready paragraph,
// the methodology note, the credit line journalists and AI engines can copy, Dataset JSON-LD, and facts.json entries with the study
// as source. Nothing is invented: every number is computed from the file; the human checks the data is real and anonymised (Law 09-08).
// Usage: node data-study.mjs data.csv --title "Prix de la location de voiture à Casablanca, relevé 2026" --value prix --by categorie
//        [--unit DH] [--date 2026-09] [--author "Diab Car"] [--out docs/etude-<slug>.md] [--svg site/img/etude-<slug>.svg] [--facts]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { loadConfig, parseArgs, csvObjects, c, isoDate } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const file = args._[0];
if (!file || !existsSync(file) || !args.value) { console.error("Usage: node data-study.mjs data.csv --title \"…\" --value <numeric column> [--by <category column>]"); process.exit(1); }
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const brand = args.author ?? cfg?.brand?.name ?? "";
const site = cfg?.site ?? "";
const rows = csvObjects(readFileSync(file, "utf8"));
const col = args.value.toLowerCase(), by = args.by?.toLowerCase();
const num = (v) => { const n = parseFloat(String(v).replace(/\s/g, "").replace(",", ".")); return Number.isFinite(n) ? n : null; };
const values = rows.map((r) => num(r[col])).filter((v) => v !== null);
if (!values.length) { console.error(`No numeric values in column "${args.value}" (columns: ${Object.keys(rows[0] ?? {}).join(", ")})`); process.exit(1); }
const unit = args.unit ?? "", title = args.title ?? `Étude ${col}`, date = args.date ?? isoDate().slice(0, 7);
const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const stats = (arr) => { const s = [...arr].sort((a, b) => a - b); const q = (p) => s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]; const mean = s.reduce((a, b) => a + b, 0) / s.length; const sd = Math.sqrt(s.reduce((a, b) => a + (b - mean) ** 2, 0) / s.length); return { n: s.length, min: s[0], q1: q(0.25), median: q(0.5), q3: q(0.75), max: s.at(-1), mean: +mean.toFixed(1), sd: +sd.toFixed(1) }; };
const fmt = (v) => (Number.isInteger(v) ? v.toLocaleString("fr-FR") : (+v).toLocaleString("fr-FR", { maximumFractionDigits: 1 })) + (unit ? ` ${unit}` : "");
const all = stats(values);
const groups = [];
if (by) { const m = new Map(); for (const r of rows) { const v = num(r[col]); if (v === null) continue; const k = (r[by] ?? "").trim() || "(vide)"; if (!m.has(k)) m.set(k, []); m.get(k).push(v); } for (const [k, arr] of m) groups.push({ key: k, ...stats(arr), share: Math.round((100 * arr.length) / values.length) }); groups.sort((a, b) => b.median - a.median); }

// ---------- SVG chart (bars of medians per group, or a histogram of the values) ----------
const W = 640, H = 360, padL = 60, padB = 60, padT = 40;
let bars = groups.length ? groups.map((g) => ({ label: g.key, value: g.median })) : (() => { const bins = 8, w = (all.max - all.min) / bins || 1; const counts = Array(bins).fill(0); for (const v of values) counts[Math.min(bins - 1, Math.floor((v - all.min) / w))]++; return counts.map((n, i) => ({ label: `${fmt(all.min + i * w)}–${fmt(all.min + (i + 1) * w)}`, value: n })); })();
const maxV = Math.max(...bars.map((b) => b.value)) || 1, bw = (W - padL - 20) / bars.length;
const svg = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="system-ui, sans-serif" font-size="12" role="img" aria-label="${title.replace(/"/g, "'")}">`, `<title>${title}</title>`, `<text x="${padL}" y="22" font-size="15" font-weight="600">${title}</text>`, `<text x="${padL}" y="${H - 8}" font-size="11" fill="#555">Source : ${brand || "étude interne"}, ${date}, n = ${all.n}${site ? ` — ${site}` : ""}</text>`];
bars.forEach((b, i) => { const h = ((H - padB - padT) * b.value) / maxV, x = padL + i * bw; svg.push(`<rect x="${(x + 4).toFixed(1)}" y="${(H - padB - h).toFixed(1)}" width="${(bw - 8).toFixed(1)}" height="${h.toFixed(1)}" fill="#1f5f8b" />`, `<text x="${(x + bw / 2).toFixed(1)}" y="${(H - padB - h - 4).toFixed(1)}" text-anchor="middle">${groups.length ? fmt(b.value) : b.value}</text>`, `<text x="${(x + bw / 2).toFixed(1)}" y="${H - padB + 16}" text-anchor="middle" font-size="10">${String(b.label).slice(0, 18)}</text>`); });
svg.push("</svg>");
const svgOut = args.svg ?? `site/img/etude-${slug}.svg`;
mkdirSync(dirname(svgOut), { recursive: true }); writeFileSync(svgOut, svg.join("\n"));

// ---------- text ----------
const top = groups[0], bottom = groups.at(-1);
const press = `Selon une étude de ${brand || "[[FACT NEEDED: auteur]]"} portant sur ${all.n} ${args.what ?? "observations"} (${date}), ${col} médian s'établit à ${fmt(all.median)} (de ${fmt(all.min)} à ${fmt(all.max)} ; moyenne ${fmt(all.mean)}).${top && bottom && top !== bottom ? ` L'écart entre ${top.key} (médiane ${fmt(top.median)}) et ${bottom.key} (${fmt(bottom.median)}) atteint ${fmt(top.median - bottom.median)}.` : ""}`;
const md = [`# ${title}`, "", `_Étude ${brand ? `de ${brand}` : ""}, ${date}. Données : ${file} (${all.n} lignes valides sur ${rows.length}). Généré par data-study.mjs — vérifier que les données sont réelles, anonymisées (loi 09-08) et que le client accepte leur publication._`, "", "## Résultat en une phrase (à réutiliser tel quel dans la page, le pitch et les réseaux)", press, "", "## Statistiques", `| n | min | Q1 | médiane | moyenne | Q3 | max | écart-type |\n|---|---|---|---|---|---|---|---|\n| ${all.n} | ${fmt(all.min)} | ${fmt(all.q1)} | ${fmt(all.median)} | ${fmt(all.mean)} | ${fmt(all.q3)} | ${fmt(all.max)} | ${fmt(all.sd)} |`];
if (groups.length) md.push("", `## Par ${by}`, "| Catégorie | n | part | min | médiane | moyenne | max |", "|---|---|---|---|---|---|---|", ...groups.map((g) => `| ${g.key} | ${g.n} | ${g.share} % | ${fmt(g.min)} | ${fmt(g.median)} | ${fmt(g.mean)} | ${fmt(g.max)} |`));
const pageUrl = `${site}/${args.page ?? `etude-${slug}/`}`;
const imgPath = svgOut.replace(/^site/, "");
md.push("", "## Graphique", `![${title}](${imgPath})`);
md.push("", "## Méthodologie (à publier sous le graphique)");
md.push(`Relevé de ${all.n} observations, période ${date}, source ${brand || "[[FACT NEEDED]]"} ; ${by ? `regroupement par ${by} ; ` : ""}statistiques descriptives (médiane privilégiée, moyenne indiquée) ; données brutes disponibles sur demande [[FACT NEEDED: contact ou lien]]. Limites : échantillon propre à ${brand || "l'entreprise"}, non représentatif de tout le marché.`);
md.push("", "## Ligne de crédit et intégration (ce que les médias et les moteurs copient)", `> Source : « ${title} », ${brand || "[[FACT NEEDED]]"}, ${date}${site ? `, ${site}` : ""}.`, "");
md.push("```html", `<figure><img src="${imgPath}" alt="${title}" width="${W}" height="${H}"><figcaption>Source : <a href="${pageUrl}">${title}</a>, ${brand}, ${date}</figcaption></figure>`, "```", "");
md.push("## JSON-LD Dataset (à ajouter au graphe de la page de l'étude)", "```json", JSON.stringify({ "@type": "Dataset", name: title, description: press, creator: { "@type": "Organization", name: brand }, dateModified: isoDate(), temporalCoverage: date, variableMeasured: col, license: "https://creativecommons.org/licenses/by/4.0/", url: pageUrl }, null, 2), "```", "");
md.push("## Diffusion (docs/04) — qui reçoit ce chiffre", "- 3 médias économiques marocains qui ont déjà écrit sur la catégorie, avec le graphique prêt et la ligne de crédit.", "- Les listicles et annuaires du top 30 (docs/06) : un chiffre exclusif est la raison d'être ajouté.", "- LinkedIn du fondateur : le graphique + la phrase, sans lien dans le texte (le lien en commentaire).", "- La page pilier : section « Nos chiffres » avec `data-fact` sur chaque valeur.");
const out = args.out ?? `docs/etude-${slug}.md`;
mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, md.join("\n") + "\n");
if (args.facts) {
  const factsFile = "facts.json";
  const facts = existsSync(factsFile) ? JSON.parse(readFileSync(factsFile, "utf8")) : { facts: [], quotes: [], sources: [] };
  facts.facts ??= [];
  const add = (id, value, text) => { if (!facts.facts.some((f) => f.id === id)) facts.facts.push({ id, value: String(value), text: { fr: text, ar: "" }, source: `étude interne « ${title} », ${date}`, date: isoDate(), status: "to-confirm" }); };
  add(`etude-${slug}-n`, all.n, `${all.n} observations analysées (${date})`);
  add(`etude-${slug}-mediane`, all.median, `${col} médian : ${fmt(all.median)} (${date})`);
  add(`etude-${slug}-min-max`, `${all.min}–${all.max}`, `de ${fmt(all.min)} à ${fmt(all.max)} (${date})`);
  for (const g of groups.slice(0, 6)) add(`etude-${slug}-${g.key.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")}`, g.median, `${g.key} : médiane ${fmt(g.median)} sur ${g.n} (${date})`);
  writeFileSync(factsFile, JSON.stringify(facts, null, 2) + "\n");
  console.log(`facts.json: study facts added with status "to-confirm" (the client confirms before they ship)`);
}
console.log(c.bold(`Study "${title}": n=${all.n}, median ${fmt(all.median)}, range ${fmt(all.min)}–${fmt(all.max)}${groups.length ? `, ${groups.length} groups by ${by}` : ""}`));
console.log(press);
console.log(c.dim(`written ${out} and ${svgOut}`));
