#!/usr/bin/env node
// scripts/ga4-api.mjs — GA4 through the Data API (Layer 17): AI-referral sessions per source and per week (the GA4 number is a floor —
// many AI visits arrive as Direct), the landing pages AI engines send people to, the lead key events per channel (LEAD_EVENTS: the
// site's phone_click, directions_click and order_click labels, generate_lead for a cake request, the server-sent purchase; docs/12 §3),
// and organic landing pages with their conversions. Needs google-service-account.json with the service-account e-mail as Viewer on the
// GA4 property, and the numeric property id (Admin → Property details): --property 123456789, env GA4_PROPERTY_ID or site.config.json → ga4PropertyId.
// Usage: node ga4-api.mjs [ai|leads|landing] [--property 123456789] [--days 28] [--weeks] — outputs console + ga4/<date>-<mode>.csv
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs, toCsv, c, isoDate } from "./lib.mjs";
import { googleJson, SCOPES } from "./google-auth.mjs";

const args = parseArgs(process.argv.slice(2));
const mode = args._[0] ?? "ai";
let cfg = null; try { cfg = loadConfig(args.config ?? "site.config.json"); } catch {}
const property = String(args.property ?? process.env.GA4_PROPERTY_ID ?? cfg?.ga4PropertyId ?? "").replace(/^properties\//, "");
if (!property) { console.error("Need the GA4 property id: --property 123456789 (Admin → Property details), env GA4_PROPERTY_ID or ga4PropertyId in site.config.json"); process.exit(1); }
const days = +(args.days ?? 28);
// The same regex as the GA4 "AI" channel group in docs/12 §3, character for character (keep the two in sync).
export const AI_SOURCES = "chatgpt\\.com|chat\\.openai\\.com|openai\\.com|perplexity\\.ai|pplx\\.ai|copilot\\.microsoft\\.com|bing\\.com/chat|gemini\\.google\\.com|bard\\.google\\.com|claude\\.ai|anthropic\\.com|meta\\.ai|grok\\.com|x\\.ai|deepseek\\.com|chat\\.mistral\\.ai|you\\.com|duckduckgo\\.com/\\?.*ia=chat|poe\\.com|kimi|moonshot|chatgpt|perplexity";
// The project's key events (docs/12 §3). No whatsapp_click: no WhatsApp at launch (decision M11).
export const LEAD_EVENTS = ["phone_click", "directions_click", "order_click", "generate_lead", "purchase"];
mkdirSync("ga4", { recursive: true });

async function report(body) {
  const json = await googleJson(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, { scope: SCOPES.ga4, method: "POST", body: { dateRanges: [{ startDate: `${days}daysAgo`, endDate: "yesterday" }], limit: 10000, ...body } });
  const dims = (body.dimensions ?? []).map((x) => x.name), mets = (body.metrics ?? []).map((x) => x.name);
  return (json.rows ?? []).map((r) => ({ ...Object.fromEntries(dims.map((k, i) => [k, r.dimensionValues[i].value])), ...Object.fromEntries(mets.map((k, i) => [k, +r.metricValues[i].value])) }));
}
const out = (name, rows, cols) => { const f = join("ga4", `${isoDate()}-${name}.csv`); writeFileSync(f, toCsv(rows, cols)); console.log(c.dim(`written ${f}`)); };

(async () => {
  console.log(c.bold(`GA4 property ${property} · last ${days} days · mode ${mode}`));
  if (mode === "ai") {
    const dims = args.weeks ? [{ name: "sessionSource" }, { name: "isoYearIsoWeek" }] : [{ name: "sessionSource" }];
    const rows = await report({ dimensions: dims, metrics: [{ name: "sessions" }, { name: "keyEvents" }, { name: "engagedSessions" }], dimensionFilter: { filter: { fieldName: "sessionSource", stringFilter: { matchType: "PARTIAL_REGEXP", value: AI_SOURCES, caseSensitive: false } } } });
    const total = rows.reduce((s, r) => s + r.sessions, 0);
    console.table(rows.sort((a, b) => b.sessions - a.sessions).slice(0, 40));
    console.log(`${total} AI-referred sessions in ${days} days (floor: visits without referrer land in Direct; ChatGPT appends utm_source=chatgpt.com to its links).`);
    out("ai", rows, [...dims.map((x) => x.name), "sessions", "engagedSessions", "keyEvents"]);
    const landing = await report({ dimensions: [{ name: "landingPage" }, { name: "sessionSource" }], metrics: [{ name: "sessions" }, { name: "keyEvents" }], dimensionFilter: { filter: { fieldName: "sessionSource", stringFilter: { matchType: "PARTIAL_REGEXP", value: AI_SOURCES, caseSensitive: false } } } });
    if (landing.length) { console.log("Pages the AI engines send people to (the pages they trust — keep them fresh, add the conversion band):"); console.table(landing.sort((a, b) => b.sessions - a.sessions).slice(0, 20)); out("ai-landing", landing, ["landingPage", "sessionSource", "sessions", "keyEvents"]); }
  } else if (mode === "leads") {
    const rows = await report({ dimensions: [{ name: "eventName" }, { name: "sessionDefaultChannelGroup" }], metrics: [{ name: "eventCount" }], dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: LEAD_EVENTS } } } });
    console.table(rows.sort((a, b) => b.eventCount - a.eventCount));
    const byEvent = {}; for (const r of rows) byEvent[r.eventName] = (byEvent[r.eventName] ?? 0) + r.eventCount;
    console.log(`Totals: ${Object.entries(byEvent).map(([k, v]) => `${k} ${v}`).join(" · ") || `no lead events yet — check that the consent banner loads the tag, that the site sends the data-event clicks, and that ${LEAD_EVENTS.join(", ")} are marked as key events (docs/12 §3)`}`);
    out("leads", rows, ["eventName", "sessionDefaultChannelGroup", "eventCount"]);
    if (args.weeks) { const w = await report({ dimensions: [{ name: "isoYearIsoWeek" }, { name: "eventName" }], metrics: [{ name: "eventCount" }], dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: LEAD_EVENTS } } } }); console.table(w.sort((a, b) => a.isoYearIsoWeek.localeCompare(b.isoYearIsoWeek))); out("leads-weekly", w, ["isoYearIsoWeek", "eventName", "eventCount"]); }
  } else if (mode === "landing") {
    const rows = await report({ dimensions: [{ name: "landingPage" }], metrics: [{ name: "sessions" }, { name: "keyEvents" }, { name: "engagementRate" }], dimensionFilter: { filter: { fieldName: "sessionDefaultChannelGroup", stringFilter: { matchType: "EXACT", value: "Organic Search" } } } });
    console.table(rows.sort((a, b) => b.sessions - a.sessions).slice(0, 30).map((r) => ({ ...r, engagementRate: `${Math.round(100 * r.engagementRate)}%` })));
    console.log("Organic landing pages: sessions without key events = a page that ranks but does not convert (add the conversion band: Commander, the phone, the price, the proof).");
    out("landing", rows, ["landingPage", "sessions", "keyEvents", "engagementRate"]);
  } else { console.error(`Unknown mode ${mode}`); process.exit(1); }
})().catch((e) => { console.error(c.red(e.message)); process.exit(1); });
