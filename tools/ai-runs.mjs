#!/usr/bin/env node
// scripts/ai-runs.mjs — the weekly AI-engine run, automated (Layers 7.6, 14, 17): the prompt set through ChatGPT (OpenAI Responses API
// with web search), Perplexity (Sonar), Gemini (Google Search grounding) and Claude (web search tool). Records what a manual run records
// — cited domains in order, brand named, brand position — plus what a human cannot see: the fan-out queries the engine ran, which of
// our facts it repeated, numbers it attributed to the brand that are not in facts.json (to verify), and the share of citations and
// mentions per competitor ("share of model"). Keys via env: OPENAI_API_KEY, PERPLEXITY_API_KEY, GEMINI_API_KEY, ANTHROPIC_API_KEY.
// Model ids change: OPENAI_MODEL (default gpt-5.4), PERPLEXITY_PRESET (fast|low|medium|high; PERPLEXITY_MODEL=sonar → legacy chat-completions until 2026-09-27), GEMINI_MODEL (gemini-2.5-flash), ANTHROPIC_MODEL (claude-sonnet-5).
// Field names follow each vendor's API reference as of 2026; a missing field leaves the value blank (never guessed). Raw JSON is saved per call.
// Usage: node ai-runs.mjs [--engines openai,perplexity,gemini,anthropic] [--ids C1,C5] [--week 2026-W40] [--prompts scoreboard/prompts.csv]
//        [--competitors scoreboard/competitors.csv] [--no-verify-mentions] [--from-dir ai/2026-W40] [--dry-run] [--delay 1500]
// Writes: ai/<week>/<engine>-<id>.json, scoreboard/runs/<week>-ai.csv, ai/<week>/answers.md, fanout.csv, share-of-model.csv, facts-propagation.csv, mentions.csv
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs, csvObjects, toCsv, fetchText, stripTags, c, isoWeek } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const brandHost = (args.brand ?? (cfg ? new URL(cfg.site).host : "")).replace(/^www\./, "").toLowerCase();
const brandNames = [args["brand-name"] ?? cfg?.brand?.name, cfg?.brand?.nameAr].filter(Boolean).map((s) => s.toLowerCase());
if (!brandHost || !brandNames.length) { console.error("Need site.config.json (site + brand.name) or --brand <host> --brand-name <name>"); process.exit(1); }
const week = args.week ?? isoWeek();
const dir = args["from-dir"] ?? join("ai", week);
mkdirSync(dir, { recursive: true });
const DELAY = +(args.delay ?? 1500);
const norm = (u) => { try { return new URL(u).host.replace(/^www\./, "").toLowerCase(); } catch { return String(u ?? "").replace(/^www\./, "").toLowerCase().split("/")[0]; } };
const isBrand = (h) => norm(h) === brandHost || norm(h).endsWith("." + brandHost);
const named = (text) => brandNames.some((n) => text.toLowerCase().includes(n));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const city = cfg?.nap?.city ?? "Casablanca";

// ---------- engines: each returns { text, citations: [url…], queries: [q…], raw } ----------
async function postJson(url, body, headers) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(120000) });
    if (res.status === 429 || res.status >= 500) { await sleep(3000 * (attempt + 1)); continue; }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
    return json;
  }
  throw new Error("rate limited / server error after 3 attempts");
}
const ENGINES = {
  openai: { label: "ChatGPT", key: "OPENAI_API_KEY", async run(prompt) {
    const raw = await postJson("https://api.openai.com/v1/responses", { model: process.env.OPENAI_MODEL ?? "gpt-5.4", input: prompt, tools: [{ type: "web_search", user_location: { type: "approximate", country: "MA", city } }] }, { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` });
    const items = raw.output ?? [];
    const queries = [...new Set(items.filter((i) => i.type === "web_search_call").flatMap((i) => [...(i.action?.queries ?? []), i.action?.query]).filter(Boolean))]; // action.query is deprecated in favour of action.queries[]
    const msgs = items.filter((i) => i.type === "message").flatMap((i) => i.content ?? []).filter((p) => p.type === "output_text");
    const text = msgs.map((p) => p.text).join("\n");
    const citations = msgs.flatMap((p) => (p.annotations ?? []).filter((a) => a.type === "url_citation").map((a) => a.url));
    return { text, citations, queries, raw };
  } },
  perplexity: { label: "Perplexity", key: "PERPLEXITY_API_KEY", async run(prompt) {
    // Agent API (docs.perplexity.ai/api-reference/agent-post): presets fast|low|medium|high replace the sonar model ids.
    // The Sonar chat-completions endpoint is supported until 2026-09-27 only; PERPLEXITY_MODEL=sonar forces that legacy path.
    if (process.env.PERPLEXITY_MODEL) {
      const raw = await postJson("https://api.perplexity.ai/chat/completions", { model: process.env.PERPLEXITY_MODEL, messages: [{ role: "user", content: prompt }], web_search_options: { user_location: { country: "MA" } } }, { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` });
      return { text: raw.choices?.[0]?.message?.content ?? "", citations: raw.citations ?? (raw.search_results ?? []).map((r) => r.url), queries: [], raw };
    }
    const raw = await postJson("https://api.perplexity.ai/v1/agent", { preset: process.env.PERPLEXITY_PRESET ?? "fast", input: prompt, tools: [{ type: "web_search", user_location: { country: "MA", city } }] }, { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` });
    const items = raw.output ?? [];
    const msgs = items.filter((i) => i.type === "message").flatMap((i) => i.content ?? []).filter((p) => p.type === "output_text");
    const text = msgs.map((p) => p.text).join("\n");
    const sr = items.filter((i) => i.type === "search_results");
    const cited = msgs.flatMap((p) => (p.annotations ?? []).filter((a) => a.type === "url_citation").map((a) => a.url));
    const citations = cited.length ? cited : sr.flatMap((i) => (i.results ?? []).map((r) => r.url)).filter(Boolean);
    const queries = [...new Set(sr.flatMap((i) => i.queries ?? []).filter(Boolean))];
    return { text, citations, queries, raw };
  } },
  gemini: { label: "Gemini", key: "GEMINI_API_KEY", async run(prompt) {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const raw = await postJson(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { contents: [{ parts: [{ text: prompt }] }], tools: [{ google_search: {} }] }, { "x-goog-api-key": process.env.GEMINI_API_KEY });
    const cand = raw.candidates?.[0] ?? {};
    const text = (cand.content?.parts ?? []).map((p) => p.text ?? "").join("\n");
    const gm = cand.groundingMetadata ?? {};
    // groundingChunks[].web.uri is a vertexaisearch redirect; the domain is in .title (Gemini API docs) — keep both.
    const citations = (gm.groundingChunks ?? []).map((ch) => (ch.web?.title && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(ch.web.title) ? `https://${ch.web.title}/` : ch.web?.uri)).filter(Boolean);
    return { text, citations, queries: gm.webSearchQueries ?? [], raw };
  } },
  anthropic: { label: "Claude", key: "ANTHROPIC_API_KEY", async run(prompt) {
    const raw = await postJson("https://api.anthropic.com/v1/messages", { model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5", max_tokens: 1500, messages: [{ role: "user", content: prompt }], tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5, user_location: { type: "approximate", country: "MA", city, timezone: "Africa/Casablanca" } }] }, { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" });
    const blocks = raw.content ?? [];
    const text = blocks.filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const cited = blocks.filter((b) => b.type === "text").flatMap((b) => (b.citations ?? []).map((ci) => ci.url)).filter(Boolean);
    const results = blocks.filter((b) => b.type === "web_search_tool_result").flatMap((b) => (Array.isArray(b.content) ? b.content : []).map((r) => r.url)).filter(Boolean);
    const queries = blocks.filter((b) => b.type === "server_tool_use").map((b) => b.input?.query).filter(Boolean);
    return { text, citations: cited.length ? cited : results, queries, raw };
  } },
};

// ---------- facts and competitors ----------
const facts = existsSync("facts.json") ? JSON.parse(readFileSync("facts.json", "utf8")) : {};
const factValues = []; // [id, value string with a digit]
if (Array.isArray(facts.facts)) for (const f of facts.facts) { if (f?.id && f.value !== undefined && f.value !== "" && /\d/.test(String(f.value))) factValues.push([f.id, String(f.value)]); }
else (function walk(o, path = "") { if (!o || typeof o !== "object") return; for (const [k, v] of Object.entries(o)) { if (v && typeof v === "object") walk(v, path ? `${path}.${k}` : k); else if (typeof v === "string" && /\d/.test(v) && v.length < 80) factValues.push([path ? `${path}.${k}` : k, v]); else if (typeof v === "number") factValues.push([path ? `${path}.${k}` : k, String(v)]); } })(facts);
const napDigits = [cfg?.nap?.phone, cfg?.nap?.whatsapp].filter(Boolean).map((p) => p.replace(/\D/g, "").slice(-9));
const compFile = args.competitors ?? "scoreboard/competitors.csv";
const competitors = existsSync(compFile) ? csvObjects(readFileSync(compFile, "utf8")).map((r) => ({ name: (r.name ?? "").toLowerCase(), domain: norm(r.domain ?? "") })).filter((r) => r.name || r.domain) : [];

(async () => {
  const promptsFile = args.prompts ?? "scoreboard/prompts.csv";
  if (!existsSync(promptsFile)) { console.error(`No prompts file: ${promptsFile}`); process.exit(1); }
  let prompts = csvObjects(readFileSync(promptsFile, "utf8")).filter((p) => p.prompt);
  if (args.ids) { const ids = new Set(String(args.ids).split(",")); prompts = prompts.filter((p) => ids.has(p.id)); }
  const wanted = String(args.engines ?? "openai,perplexity,gemini,anthropic").split(",").map((s) => s.trim()).filter((e) => ENGINES[e]);
  const engines = wanted.filter((e) => args["from-dir"] || args["dry-run"] || process.env[ENGINES[e].key]);
  for (const e of wanted) if (!engines.includes(e)) console.log(c.yellow(`${ENGINES[e].label}: no ${ENGINES[e].key} in env — skipped (record it by hand in scoreboard/runs/${week}.csv)`));
  if (!engines.length) { console.error("No engine available."); process.exit(1); }
  const rows = [], fanout = [], answers = [], propagation = [], mentionRows = [];
  const shareModel = new Map(); // engine|host -> { citations, mentions }
  const pageCache = new Map();
  async function namesUs(url) { // does a third-party page name the brand? (Layer 15 "Done when" #5; unlinked-mention list for docs/06)
    if (pageCache.has(url)) return pageCache.get(url);
    let out = { names: false, links: false };
    try { const r = await fetchText(url, { ua: "Mozilla/5.0 (compatible; rank-first-mentions/1.0)", timeoutMs: 15000 }); if (r.status === 200) { const t = stripTags(r.text).toLowerCase(); out = { names: brandNames.some((n) => t.includes(n)), links: r.text.toLowerCase().includes(brandHost) }; } } catch {}
    pageCache.set(url, out); return out;
  }

  await Promise.all(engines.map(async (e) => {
    const eng = ENGINES[e];
    for (const p of prompts) {
      const file = join(dir, `${e}-${p.id}.json`);
      let res;
      if (existsSync(file)) { const saved = JSON.parse(readFileSync(file, "utf8")); res = saved.parsed ?? null; }
      if (!res) {
        if (args["dry-run"]) { console.log(`would ask ${eng.label}: ${p.id} "${p.prompt}"`); continue; }
        try { const r = await eng.run(p.prompt); res = { text: r.text, citations: r.citations, queries: r.queries }; writeFileSync(file, JSON.stringify({ engine: e, prompt_id: p.id, prompt: p.prompt, parsed: res, raw: r.raw }, null, 1)); }
        catch (err) { console.log(c.yellow(`${eng.label} ${p.id}: ${err.message}`)); await sleep(DELAY); continue; }
        await sleep(DELAY);
      }
      const hosts = [...new Set(res.citations.map(norm).filter(Boolean))];
      const brandIdx = hosts.findIndex(isBrand);
      const isNamed = named(res.text);
      // third-party pages among the citations that name the brand
      let third = "", mentions = [];
      if (!args["no-verify-mentions"] && !args["dry-run"]) {
        const thirdUrls = [...new Set(res.citations.filter((u) => /^https?:/.test(u) && !isBrand(u)))].slice(0, 5);
        for (const u of thirdUrls) { const m = await namesUs(u); if (m.names) mentions.push({ url: u, links_us: m.links ? "yes" : "no" }); }
        third = thirdUrls.length ? (mentions.length ? "yes" : "no") : "";
        for (const m of mentions) mentionRows.push({ week, engine: eng.label, prompt_id: p.id, url: m.url, links_us: m.links_us });
      }
      rows.push({ week, prompt_id: p.id, engine: eng.label, google_position: "", snippet_owner: "", ai_overview_cited: "", cited_domains: hosts.join(";"), brand_named: isNamed ? "yes" : "no", brand_position: brandIdx >= 0 ? brandIdx + 1 : "", third_party_names_us: third, map_pack: "", notes: res.queries.length ? `fan-out: ${res.queries.join(" | ")}` : "" });
      for (const q of res.queries) fanout.push({ week, engine: eng.label, prompt_id: p.id, query: q });
      for (const h of hosts) { const k = `${eng.label}|${h}`; const s = shareModel.get(k) ?? { engine: eng.label, host: h, citations: 0, mentions: 0 }; s.citations++; shareModel.set(k, s); }
      const lower = res.text.toLowerCase();
      for (const comp of competitors) { const hit = (comp.name && lower.includes(comp.name)) || (comp.domain && lower.includes(comp.domain)); if (hit) { const k = `${eng.label}|${comp.domain || comp.name}`; const s = shareModel.get(k) ?? { engine: eng.label, host: comp.domain || comp.name, citations: 0, mentions: 0 }; s.mentions++; shareModel.set(k, s); } }
      if (isNamed) { const k = `${eng.label}|${brandHost}`; const s = shareModel.get(k) ?? { engine: eng.label, host: brandHost, citations: 0, mentions: 0 }; s.mentions++; shareModel.set(k, s); }
      // fact propagation and numbers attributed to the brand
      const repeated = factValues.filter(([, v]) => lower.includes(v.toLowerCase())).map(([id]) => id);
      const phones = (res.text.match(/(?:\+212|00212|0)[\s.-]?[5-7](?:[\s.-]?\d){8}/g) ?? []).map((x) => x.replace(/\D/g, "").slice(-9));
      const wrongPhone = phones.filter((d) => napDigits.length && !napDigits.includes(d));
      const brandSentences = res.text.split(/(?<=[.!?؟])\s+/).filter((s) => named(s) && /\d/.test(s));
      const toVerify = brandSentences.filter((s) => { const nums = s.match(/\d[\d\s.,]*\d|\d/g) ?? []; return nums.some((n) => n.length >= 2 && !factValues.some(([, v]) => v.replace(/\s/g, "").includes(n.replace(/\s/g, "")))); });
      propagation.push({ week, engine: eng.label, prompt_id: p.id, brand_named: isNamed ? "yes" : "no", facts_repeated: repeated.join("|"), wrong_phone: wrongPhone.join("|"), sentences_to_verify: toVerify.join(" || ").slice(0, 500) });
      answers.push(`## ${eng.label} — ${p.id} ${p.prompt}\n${res.queries.length ? `_Fan-out: ${res.queries.join(" · ")}_\n` : ""}${res.text.trim()}\n\nSources: ${hosts.map((h) => (isBrand(h) ? `**${h}**` : h)).join(", ") || "—"}${toVerify.length ? `\n\n⚠ À vérifier (chiffres attribués à la marque, absents de facts.json) : ${toVerify.join(" | ")}` : ""}${wrongPhone.length ? `\n\n⚠ Téléphone incorrect cité : ${wrongPhone.join(", ")}` : ""}\n`);
    }
  }));
  if (!rows.length) { console.log("Nothing recorded."); return; }
  mkdirSync("scoreboard/runs", { recursive: true });
  const runsFile = join("scoreboard/runs", `${week}-ai.csv`);
  writeFileSync(runsFile, toCsv(rows, ["week", "prompt_id", "engine", "google_position", "snippet_owner", "ai_overview_cited", "cited_domains", "brand_named", "brand_position", "third_party_names_us", "map_pack", "notes"]));
  writeFileSync(join(dir, "fanout.csv"), toCsv(fanout, ["week", "engine", "prompt_id", "query"]));
  const som = [...shareModel.values()].sort((a, b) => a.engine.localeCompare(b.engine) || b.citations + b.mentions - a.citations - a.mentions);
  writeFileSync(join(dir, "share-of-model.csv"), toCsv(som.map((s) => ({ ...s, is_us: isBrand(s.host) ? "yes" : "" })), ["engine", "host", "is_us", "citations", "mentions"]));
  writeFileSync(join(dir, "facts-propagation.csv"), toCsv(propagation, ["week", "engine", "prompt_id", "brand_named", "facts_repeated", "wrong_phone", "sentences_to_verify"]));
  writeFileSync(join(dir, "mentions.csv"), toCsv(mentionRows, ["week", "engine", "prompt_id", "url", "links_us"]));
  writeFileSync(join(dir, "answers.md"), `# Réponses des moteurs IA — ${week}\n\n${answers.join("\n")}`);
  console.log(c.bold(`AI run ${week}: ${prompts.length} prompts × ${engines.map((e) => ENGINES[e].label).join(", ")} → ${runsFile}`));
  for (const e of engines) { const r = rows.filter((x) => x.engine === ENGINES[e].label); const cited = r.filter((x) => x.cited_domains.split(";").some((h) => h && isBrand(h))).length; const nm = r.filter((x) => x.brand_named === "yes").length; console.log(`  ${ENGINES[e].label.padEnd(11)} cited ${cited}/${r.length} · named ${nm}/${r.length} · top cited: ${som.filter((s) => s.engine === ENGINES[e].label).slice(0, 5).map((s) => `${isBrand(s.host) ? c.green(s.host) : s.host} ${s.citations}`).join(", ")}`); }
  const verify = propagation.filter((p) => p.sentences_to_verify || p.wrong_phone).length;
  console.log(`Fan-out queries: ${fanout.length} (→ sections / cluster pages, Layer 9.2) · third-party pages naming us: ${mentionRows.length} (unlinked: ${mentionRows.filter((m) => m.links_us === "no").length} → docs/06) · answers with numbers to verify: ${verify}`);
  console.log(c.dim(`written ${dir}/answers.md, fanout.csv, share-of-model.csv, facts-propagation.csv, mentions.csv — then: npm run score`));
})();
