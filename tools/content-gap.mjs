#!/usr/bin/env node
// scripts/content-gap.mjs — what the pages that already win contain, what ours lacks, and what would beat them (Layers 7.5, 10, 13, 14).
// Compares our page (optional) with the competitor pages that rank for a prompt: term gap, question gap, entity gap, format gap,
// fact density, freshness, external citations, and our information gain (what only we say). Writes the "battle brief" for the page.
// Usage:
//   node content-gap.mjs --prompt "prix location voiture casablanca" [--ours https://x.ma/prix/] https://a.ma/tarifs https://b.ma/prix ...
//   node content-gap.mjs --prompt "…" --serp serp/2026-W40/C5.json [--top 5] [--ours site/prix/index.html]
//   [--out docs/gaps/<slug>.md] [--json]   Arguments may be URLs or local HTML files. No --ours → the brief for a page not yet written.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs, fetchText, c, isoDate } from "./lib.mjs";
import { profilePage, termFrequency, entities, similar, tokens, STOP } from "./extract.mjs";

const args = parseArgs(process.argv.slice(2));
const prompt = args.prompt ?? "";
let theirs = args._.slice();
if (args.serp) {
  const s = JSON.parse(readFileSync(args.serp, "utf8"));
  const organic = (s.organic ?? s.organic_results ?? []).map((r) => r.link ?? r.url).filter(Boolean);
  theirs.push(...organic.slice(0, +(args.top ?? 5)));
}
theirs = [...new Set(theirs)];
if (!theirs.length) { console.error("Usage: node content-gap.mjs --prompt \"…\" [--ours URL|file] <competitor URL|file>… | --serp serp.json"); process.exit(1); }
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 rank-first-gap/1.0";
const slug = (prompt || "page").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\u0600-\u06FF]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function load(src) {
  if (existsSync(src)) return { html: readFileSync(src, "utf8"), url: src };
  const r = await fetchText(src, { ua: UA, timeoutMs: 25000 });
  if (r.status !== 200) throw new Error(`HTTP ${r.status}`);
  return { html: r.text, url: r.url || src };
}

(async () => {
  const comp = [];
  for (const src of theirs) {
    try { const { html, url } = await load(src); const p = profilePage(html, { url }); p.host ||= url.split(/[\\/]/).pop(); if (p.words < 50) { console.log(c.dim(`skip ${src}: ${p.words} words (blocked or empty)`)); continue; } comp.push(p); }
    catch (e) { console.log(c.yellow(`skip ${src}: ${e.message}`)); }
  }
  if (!comp.length) { console.error("No competitor page could be read."); process.exit(1); }
  let ours = null;
  if (args.ours) { try { const { html, url } = await load(args.ours); ours = profilePage(html, { url }); } catch (e) { console.log(c.yellow(`ours unreadable: ${e.message}`)); } }
  const n = comp.length, need = n >= 3 ? 2 : 1;
  const median = (arr) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const ourTf = ours ? termFrequency(ours.text) : new Map();
  const ourText = (ours?.text ?? "").toLowerCase();

  // ---------- term gap (topics the market covers) ----------
  const termUse = new Map(); // term -> { pages, freq }
  for (const p of comp) for (const [t, f] of termFrequency(p.text)) { if (f < 2) continue; const e = termUse.get(t) ?? { pages: 0, freq: 0 }; e.pages++; e.freq += f; termUse.set(t, e); }
  const promptToks = new Set(tokens(prompt));
  const market = [...termUse.entries()].filter(([t, e]) => e.pages >= need && e.freq >= 3 && !promptToks.has(t)).map(([t, e]) => ({ term: t, pages: e.pages, freq: e.freq, score: e.pages * Math.log(1 + e.freq), ours: ourTf.get(t) ?? 0 })).sort((a, b) => b.score - a.score);
  const termGap = market.filter((m) => !m.ours).slice(0, 40);
  const termCoverage = market.length ? market.filter((m) => m.ours).length / market.length : 0;

  // ---------- question gap ----------
  const qs = []; // deduped competitor questions with count
  for (const p of comp) for (const q of p.questions) { const hit = qs.find((x) => similar(x.q, q)); if (hit) { hit.n++; hit.hosts.add(p.host); } else qs.push({ q, n: 1, hosts: new Set([p.host]) }); }
  const ourQs = ours?.questions ?? [];
  const questionGap = qs.filter((x) => !ourQs.some((o) => similar(o, x.q))).sort((a, b) => b.hosts.size - a.hosts.size || b.n - a.n);
  const questionCoverage = qs.length ? (qs.length - questionGap.length) / qs.length : 1;

  // ---------- entity gap ----------
  const entUse = new Map();
  for (const p of comp) for (const [e] of entities(p.text)) { const k = e.toLowerCase(); const cur = entUse.get(k) ?? { e, pages: new Set() }; cur.pages.add(p.host); entUse.set(k, cur); }
  const entityGap = [...entUse.values()].filter((x) => x.pages.size >= need && !ourText.includes(x.e.toLowerCase())).sort((a, b) => b.pages.size - a.pages.size).slice(0, 25);

  // ---------- formats and evidence ----------
  const fmtKeys = { tables: (p) => p.tables > 0, orderedLists: (p) => p.orderedLists > 0, faq: (p) => p.faqItems > 0 || p.hasFaqSchema, video: (p) => p.video, quotes: (p) => p.quotes > 0, author: (p) => !!p.author, dateModified: (p) => !!p.dateModified, externalCitations: (p) => p.externalLinks >= 2, images: (p) => p.images >= 3, breadcrumb: (p) => p.hasBreadcrumb, ctas: (p) => p.ctas > 0 };
  const formats = Object.entries(fmtKeys).map(([k, f]) => ({ format: k, competitors: comp.filter(f).length, ours: ours ? f(ours) : null }));
  const common = formats.filter((f) => f.competitors >= Math.ceil(n / 2));
  const formatGap = ours ? common.filter((f) => !f.ours) : common;
  const formatParity = ours && common.length ? common.filter((f) => f.ours).length / common.length : 0;
  const medDensity = median(comp.map((p) => p.factDensity)), medWords = median(comp.map((p) => p.words)), medExt = median(comp.map((p) => p.externalLinks));
  const theirLatest = comp.map((p) => p.dateModified ?? (p.latestYear ? `${p.latestYear}` : "")).filter(Boolean).sort().at(-1) ?? "";
  const ourLatest = ours ? ours.dateModified ?? (ours.latestYear ? `${ours.latestYear}` : "") : "";

  // ---------- information gain: what only we say ----------
  let unique = { terms: [], entities: [], sentences: [] };
  if (ours) {
    const allTheirText = comp.map((p) => p.text.toLowerCase()).join("\n");
    unique.terms = [...ourTf.entries()].filter(([t, f]) => f >= 2 && !termUse.has(t) && !allTheirText.includes(t)).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([t, f]) => `${t} (${f})`);
    unique.entities = [...entities(ours.text).entries()].filter(([e, f]) => f >= 2 && !allTheirText.includes(e.toLowerCase())).map(([e]) => e).slice(0, 15);
    unique.sentences = ours.text.split(/(?<=[.!?؟])\s+/).filter((s) => /\d/.test(s) && s.length > 30 && s.length < 220).filter((s) => { const nums = s.match(/\d[\d.,]*/g) ?? []; return nums.some((x) => x.length >= 2 && !allTheirText.includes(x)); }).slice(0, 10);
  }
  const gainScore = ours ? Math.min(1, (unique.terms.length + unique.entities.length + 2 * unique.sentences.length) / 15) : 0;
  const fresh = ours ? (ourLatest && theirLatest ? (ourLatest >= theirLatest ? 1 : ourLatest.slice(0, 4) >= String(+theirLatest.slice(0, 4) - 1) ? 0.5 : 0) : 0.5) : 0;
  const density = ours ? Math.min(1, medDensity ? ours.factDensity / medDensity : 1) : 0;
  const beat = ours ? Math.round(30 * termCoverage + 20 * questionCoverage + 15 * formatParity + 15 * density + 10 * fresh + 10 * gainScore) : null;

  // ---------- actions ----------
  const actions = [];
  for (const q of questionGap.slice(0, 8)) actions.push(`Ajouter une section h2 « ${q.q} » (réponse directe en première phrase) — posée par ${q.hosts.size} concurrent(s)`);
  if (termGap.length) actions.push(`Couvrir les sujets du marché absents de la page : ${termGap.slice(0, 15).map((t) => t.term).join(", ")}`);
  for (const f of formatGap) actions.push({ tables: "Ajouter un tableau (≤ 5 colonnes, légende) — les concurrents en ont", orderedLists: "Ajouter une liste ordonnée pour l'étape / la méthode", faq: "Ajouter une FAQ (5–8 objections réelles, `<details>`)", video: "Ajouter la vidéo (façade + transcription) — les concurrents en ont", quotes: "Ajouter une citation nommée (client, expert, source publique)", author: "Signer la page (auteur + bio) et dater", dateModified: "Afficher la date de mise à jour (`<time>` + dateModified)", externalCitations: `Citer ≥ ${Math.max(2, medExt)} sources externes (lois, chiffres officiels, études)`, images: "Ajouter ≥ 3 images réelles (alt descriptif, dimensions)", breadcrumb: "Ajouter le fil d'Ariane (BreadcrumbList)", ctas: "Ajouter les actions WhatsApp / téléphone" }[f.format]);
  if (ours && ours.factDensity < medDensity) actions.push(`Monter la densité de faits de ${ours.factDensity} à ≥ ${medDensity} chiffres / 100 mots (prix, délais, quantités, dates — depuis facts.json)`);
  if (ours && ours.words < 0.8 * medWords) actions.push(`Étoffer : ${ours.words} mots contre une médiane concurrente de ${medWords} (par des sections utiles, pas du remplissage)`);
  if (ours && !unique.sentences.length && !unique.terms.length) actions.push("Aucune information unique détectée : ajouter des données propres (statistiques internes, mesure, étude, cas client chiffré) — c'est ce qui fait citer la page plutôt que la concurrence");
  if (ours && ourLatest && theirLatest && ourLatest < theirLatest) actions.push(`Mettre à jour la page (dernière date ${ourLatest} contre ${theirLatest} chez le mieux daté des concurrents)`);
  if (entityGap.length) actions.push(`Nommer les entités que le marché nomme et que nous ignorons : ${entityGap.slice(0, 10).map((e) => e.e).join(", ")}`);

  // ---------- report ----------
  const row = (p) => `| ${p.host || p.url} | ${p.words} | ${p.questions.length} | ${p.tables} | ${p.orderedLists} | ${p.faqItems} | ${p.video ? "oui" : "non"} | ${p.factDensity} | ${p.externalLinks} | ${p.images} | ${p.author ? "oui" : "non"} | ${p.dateModified ?? p.latestYear ?? "?"} | ${p.schemaTypes.join(", ") || "—"} |`;
  const md = [];
  md.push(`# Analyse d'écart — « ${prompt || "(prompt non précisé)"} » — ${isoDate()}`);
  md.push(`Pages comparées : ${comp.map((p) => p.url).join(" · ")}${ours ? `\nNotre page : ${ours.url}` : "\nNotre page : pas encore écrite (ce document est le brief à battre)."}`);
  if (beat !== null) md.push(`\n**Score « battre le marché » : ${beat}/100** (proxy : couverture des sujets ${Math.round(100 * termCoverage)} %, questions ${Math.round(100 * questionCoverage)} %, formats ${Math.round(100 * formatParity)} %, densité de faits ${ours.factDensity} vs médiane ${medDensity}, fraîcheur, information unique). Un score élevé ne garantit rien ; un score bas indique quoi corriger.`);
  md.push(`\n## 1. Ce que contiennent les pages qui gagnent\n| Page | Mots | Questions | Tableaux | Listes ord. | FAQ | Vidéo | Chiffres/100 mots | Sources ext. | Images | Auteur | Date | Schema |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|`);
  for (const p of comp) md.push(row(p));
  if (ours) md.push(`| **nous** ${row(ours).slice(1)}`);
  md.push(`\nMédianes concurrentes : ${medWords} mots · ${medDensity} chiffres/100 mots · ${medExt} sources externes · dernière mise à jour la plus récente ${theirLatest || "inconnue"}.`);
  md.push(`\n## 2. Questions qu'ils posent et que nous ne traitons pas (${questionGap.length})\n${questionGap.slice(0, 25).map((q) => `- ${q.q} _(${[...q.hosts].join(", ")})_`).join("\n") || "- aucune"}`);
  md.push(`\n## 3. Sujets du marché absents de notre page (${termGap.length} sur ${market.length} termes de marché)\n${termGap.slice(0, 40).map((t) => `${t.term} (${t.pages} pages, ${t.freq}×)`).join(" · ") || "aucun"}`);
  md.push(`\n## 4. Entités nommées par ≥ ${need} concurrents, absentes chez nous\n${entityGap.map((e) => `${e.e} (${e.pages.size})`).join(" · ") || "aucune"}`);
  md.push(`\n## 5. Formats\n| Format | Concurrents qui l'ont | Nous |\n|---|---|---|\n${formats.map((f) => `| ${f.format} | ${f.competitors}/${n} | ${f.ours === null ? "—" : f.ours ? "oui" : "**non**"} |`).join("\n")}`);
  if (ours) md.push(`\n## 6. Notre information unique (gain d'information — ce que seul notre site dit)\n- Termes : ${unique.terms.join(", ") || "aucun"}\n- Entités : ${unique.entities.join(", ") || "aucune"}\n- Phrases chiffrées uniques : ${unique.sentences.length ? "\n  - " + unique.sentences.join("\n  - ") : "aucune"}`);
  md.push(`\n## ${ours ? 7 : 6}. Pour battre ces pages — actions dans l'ordre\n${actions.map((a, i) => `${i + 1}. ${a}`).join("\n") || "1. Rien à ajouter sur le fond : travailler l'autorité (liens, mentions, avis) et la fraîcheur."}`);
  md.push(`\nRègles : chaque chiffre ajouté vient de facts.json ou d'une source citée (jamais des chiffres concurrents présentés comme les nôtres) ; les concurrents sont nommés seulement dans une comparaison honnête (Layer 14.5). Généré par content-gap.mjs.`);
  const out = args.out ?? join("docs", "gaps", `${slug}.md`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, md.join("\n") + "\n");
  if (args.json) writeFileSync(out.replace(/\.md$/, ".json"), JSON.stringify({ prompt, date: isoDate(), competitors: comp.map((p) => ({ url: p.url, host: p.host, words: p.words, questions: p.questions, factDensity: p.factDensity, dateModified: p.dateModified, schemaTypes: p.schemaTypes, video: p.video, tables: p.tables, externalLinks: p.externalLinks })), ours: ours && { url: ours.url, words: ours.words, factDensity: ours.factDensity, dateModified: ours.dateModified }, beat, termCoverage, questionCoverage, formatParity, termGap, questionGap: questionGap.map((q) => ({ q: q.q, hosts: [...q.hosts] })), entityGap: entityGap.map((e) => ({ e: e.e, pages: [...e.pages] })), formatGap: formatGap.map((f) => f.format), unique, actions }, null, 1));
  console.log(c.bold(`Gap analysis for "${prompt}": ${n} competitor page(s)${ours ? `, ours ${ours.url}` : ", no page of ours yet"}`));
  if (beat !== null) console.log(`Beat score ${beat}/100 · topics ${Math.round(100 * termCoverage)}% · questions ${Math.round(100 * questionCoverage)}% · formats ${Math.round(100 * formatParity)}% · fact density ${ours.factDensity} vs median ${medDensity} · unique numbered sentences ${unique.sentences.length}`);
  console.log(`Question gap ${questionGap.length} · term gap ${termGap.length}/${market.length} · entity gap ${entityGap.length} · format gap ${formatGap.map((f) => f.format).join(", ") || "none"}`);
  console.log(`Actions (${actions.length}):\n  ${actions.slice(0, 12).join("\n  ")}`);
  console.log(c.dim(`written ${out}${args.json ? " (+ .json)" : ""}`));
})();
