#!/usr/bin/env node
// scripts/weekly.mjs — the Monday hour as one command (Layers 17, 20, 21): measure (Search Console API, SerpApi, AI engines — whatever
// keys exist), score, map the market, check the site live, list what is stale, build the dashboard, and write reports/<week>.md with
// the numbers, the moves and the human tasks of the week. Anything without a key or credentials is skipped and named in the report
// so the human runs it by hand. Run inside a project folder (site.config.json).
// Usage: node tools/weekly.mjs [--week 2026-W40] [--live] [--no-ai] [--no-serp] [--engines openai,perplexity] [--out reports/<week>.md]
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, parseArgs, csvObjects, c, isoWeek, isoDate } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const cfg = loadConfig(args.config ?? "site.config.json");
const week = args.week ?? isoWeek();
const here = dirname(fileURLToPath(import.meta.url));
const sections = [], skipped = [];
const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");
// optional: a failure (exit ≥ 2, or exit 1 unless findings) is listed as skipped; findings: exit 1 means "problems found" (check-urls, crawler-access, cwv, freshness) and the output is kept.
function run(label, script, argv = [], { optional = false, findings = false } = {}) {
  const file = join(here, script);
  if (!existsSync(file)) { skipped.push(`${label}: ${script} missing`); return null; }
  process.stdout.write(c.bold(`▶ ${label}\n`));
  const r = spawnSync(process.execPath, [file, ...argv], { encoding: "utf8", env: process.env, maxBuffer: 64 * 1024 * 1024 });
  const out = strip((r.stdout ?? "") + (r.stderr ?? "")).trim();
  process.stdout.write(out.split("\n").slice(0, 25).map((l) => "  " + l).join("\n") + (out.split("\n").length > 25 ? "\n  …" : "") + "\n");
  const failed = r.status === null || (findings ? r.status >= 2 : r.status !== 0);
  if (failed && optional) { skipped.push(`${label}: exit ${r.status} (${out.split("\n").at(-1)?.slice(0, 120)})`); return null; }
  sections.push({ label, out, status: r.status, findings: findings && r.status === 1 });
  return r.status;
}
const hasSA = existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "google-service-account.json");
const hasSerp = !!process.env.SERPAPI_KEY && !args["no-serp"];
const aiKeys = ["OPENAI_API_KEY", "PERPLEXITY_API_KEY", "GEMINI_API_KEY", "ANTHROPIC_API_KEY"].filter((k) => process.env[k]);
const hasGa4 = hasSA && (process.env.GA4_PROPERTY_ID || cfg.ga4PropertyId);

// 1. measure
if (hasSerp) run("SERP — positions, features, PAA, AI Overviews, local pack, share of voice", "serp.mjs", ["--week", week], { optional: true }); else skipped.push("SerpApi: no SERPAPI_KEY — record Google rows by hand in scoreboard/runs/" + week + ".csv");
if (hasSA) { run("Search Console — positions of the prompt set", "gsc-api.mjs", ["positions", "--to-runs", "--week", week, "--fuzzy"], { optional: true }); } else skipped.push("Search Console API: no google-service-account.json (docs/12 → API) — read positions in the UI");
if (aiKeys.length && !args["no-ai"]) run("AI engines — prompt runs", "ai-runs.mjs", ["--week", week, ...(args.engines ? ["--engines", args.engines] : [])], { optional: true }); else skipped.push("AI engines: no API key — run the prompts by hand (ChatGPT, Perplexity, Gemini, Claude) into scoreboard/runs/" + week + ".csv");
// 2. score + market
if (existsSync("scoreboard/runs") && readdirSync("scoreboard/runs").some((f) => f.endsWith(".csv"))) run("Scoreboard — citation share, streaks, definition of first", "citation-share.mjs", [], { optional: true }); else skipped.push("Scoreboard: no runs yet");
run("Market map — who owns the category, the battle plan", "market.mjs", ["--week", week], { optional: true });
if (hasSA) { run("Search Console — striking distance", "gsc-api.mjs", ["striking"], { optional: true }); run("Search Console — cannibalization", "gsc-api.mjs", ["cannibal"], { optional: true }); run("Search Console — CTR gaps", "gsc-api.mjs", ["ctr"], { optional: true }); }
if (hasGa4) { run("GA4 — AI referrals", "ga4-api.mjs", ["ai"], { optional: true }); run("GA4 — WhatsApp / phone events", "ga4-api.mjs", ["leads"], { optional: true }); } else if (hasSA) skipped.push("GA4 API: set GA4_PROPERTY_ID (numeric) or ga4PropertyId in site.config.json");
// 3. site health (live)
if (args.live) { run("Live — status, chains, canonical, noindex", "check-urls.mjs", [`${cfg.site}/sitemap.xml`], { optional: true, findings: true }); run("Live — crawler access", "crawler-access.mjs", ["--sitemap", `${cfg.site}/sitemap.xml`, "--max", "5"], { optional: true, findings: true }); run("Live — Core Web Vitals", "cwv.mjs", [`${cfg.site}/`], { optional: true, findings: true }); } else skipped.push("Live checks skipped (add --live for check-urls, crawler-access, cwv)");
run("Freshness — refresh queue", "freshness.mjs", [cfg.root ?? "site", "--skip-drafts"], { optional: true, findings: true });
run("Dashboard", "dashboard.mjs", ["--out", `reports/dashboard.html`], { optional: true });

// 4. report
mkdirSync("reports", { recursive: true });
const summary = existsSync("scoreboard/summary.csv") ? csvObjects(readFileSync("scoreboard/summary.csv", "utf8")) : [];
const lastWeek = summary.map((r) => r.week).sort().at(-1);
const kpis = summary.filter((r) => r.week === lastWeek).map((r) => (/^google$/i.test(r.engine) ? `Google top 3 ${r.top3_pct} % · n°1 ${r.top1_pct} % · extraits ${r.snippet_pct} %${r.map_pack_pct !== "" ? ` · pack local ${r.map_pack_pct} %` : ""}` : `${r.engine} cité ${r.cited_pct} % (1er ${r.first_pct} %)`));
const market = existsSync("docs/19-marche-et-concurrence.md") ? readFileSync("docs/19-marche-et-concurrence.md", "utf8") : "";
const moves = (market.match(/## 4\. Les dix coups[\s\S]*?\n(?=## 5)/)?.[0] ?? "").split("\n").filter((l) => /^\d+\. /.test(l));
const tasks = existsSync("docs/13-taches-humaines.md") ? (readFileSync("docs/13-taches-humaines.md", "utf8").match(/^\|\s*[A-E]\d+[a-z]?\s*\|.*\|\s*☐\s*\|\s*$/gm) ?? []).map((l) => l.split("|").slice(1, 3).map((x) => x.trim()).join(" — ").slice(0, 140)).slice(0, 12) : [];
const md = [`# Rapport hebdomadaire — ${cfg.brand?.name ?? cfg.site} — ${week} (${isoDate()})`, "", `## Chiffres de la semaine (${lastWeek ?? "pas de run"})`, ...(kpis.length ? kpis.map((k) => `- ${k}`) : ["- pas de scoreboard cette semaine"]), "", "## Les coups de la semaine (carte de bataille)", ...(moves.length ? moves.slice(0, 5) : ["- (market.mjs sans données : remplir les runs)"]), "", "## Ce que l'humain fait cette semaine", "- Lundi : lire ce rapport, valider les 3 premiers coups, envoyer les demandes d'avis aux clients de la semaine (docs/03).", "- Mardi : publier le post GBP + LinkedIn préparés ; répondre aux avis (< 24 h).", "- Mercredi : le pitch / la demande de lien de la semaine (docs/04, docs/06) — depuis la vraie boîte mail.", "- Jeudi : enregistrer/valider la vidéo ou les photos prévues.", "- Vendredi : `npm run check` + `npm run crawlers` si non lancés ici ; Search Console → Pages, CWV, actions manuelles.", ...(tasks.length ? ["", "Tâches ouvertes (docs/13) :", ...tasks.map((t) => t.trim())] : []), "", "## Non mesuré cette semaine (à faire à la main)", ...(skipped.length ? skipped.map((s) => `- ${s}`) : ["- rien"]), "", "## Détail des sorties", ...sections.map((s) => `### ${s.label}${s.findings ? " — ⚠ problèmes trouvés" : s.status ? ` (exit ${s.status})` : ""}\n\`\`\`\n${s.out.slice(0, 4000)}\n\`\`\``), "", "Règles : tendances sur 4 semaines ; conclusions gelées pendant un déploiement de core update ; comparer à N-1 autour du Ramadan et de l'été ; aucune position promise."];
const out = args.out ?? join("reports", `${week}.md`);
writeFileSync(out, md.join("\n") + "\n");
console.log(c.bold(`\nWeekly ${week}: ${sections.length} step(s) run, ${skipped.length} skipped → ${out}${existsSync("reports/dashboard.html") ? " + reports/dashboard.html" : ""}`));
if (skipped.length) console.log(c.yellow("Skipped: ") + skipped.join(" | "));
