// scripts/lib.mjs — shared helpers for the rank-first scripts. Node 18+, no dependencies.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

// ---------- config ----------
export function loadConfig(path = "site.config.json") {
  if (!existsSync(path)) {
    throw new Error(`Config not found: ${path}. Run "node <skill>/scripts/init.mjs --help" to create one.`);
  }
  const cfg = JSON.parse(readFileSync(path, "utf8"));
  if (!cfg.site) throw new Error("site.config.json needs a \"site\" URL (https://example.ma)");
  cfg.site = cfg.site.replace(/\/+$/, "");
  cfg.languages ??= { default: "fr", others: ["ar"], hreflang: { fr: "fr-MA", ar: "ar-MA" } };
  cfg.urlPolicy ??= { trailingSlash: true, www: false };
  return cfg;
}

// ---------- crawlers ----------
// One authoritative list. Each entry: user-agent token, owner, what it feeds.
export const CRAWLERS = [
  { ua: "Googlebot", owner: "Google", feeds: "Search, AI Overviews, AI Mode", tier: 1 },
  { ua: "Google-Extended", owner: "Google", feeds: "Gemini apps and Vertex AI grounding (opt-out token; no effect on Search)", tier: 1, tokenOnly: true },
  { ua: "Google-CloudVertexBot", owner: "Google", feeds: "Vertex AI Agents site crawl (customer-initiated)", tier: 2 },
  { ua: "Bingbot", owner: "Microsoft", feeds: "Bing, Copilot, ChatGPT search index", tier: 1 },
  { ua: "OAI-SearchBot", owner: "OpenAI", feeds: "ChatGPT search index", tier: 1 },
  { ua: "ChatGPT-User", owner: "OpenAI", feeds: "ChatGPT on-demand fetches", tier: 1 },
  { ua: "GPTBot", owner: "OpenAI", feeds: "Training data", tier: 1 },
  { ua: "PerplexityBot", owner: "Perplexity", feeds: "Perplexity index", tier: 1 },
  { ua: "Perplexity-User", owner: "Perplexity", feeds: "Perplexity on-demand fetches", tier: 1 },
  { ua: "ClaudeBot", owner: "Anthropic", feeds: "Training data", tier: 1 },
  { ua: "Claude-SearchBot", owner: "Anthropic", feeds: "Claude search index", tier: 1 },
  { ua: "Claude-User", owner: "Anthropic", feeds: "Claude on-demand fetches", tier: 1 },
  { ua: "Applebot", owner: "Apple", feeds: "Siri, Spotlight, Safari suggestions", tier: 1 },
  { ua: "Applebot-Extended", owner: "Apple", feeds: "Apple foundation models (opt-out token)", tier: 1, tokenOnly: true },
  { ua: "meta-externalagent", owner: "Meta", feeds: "Meta AI training and answers", tier: 2 },
  { ua: "meta-externalfetcher", owner: "Meta", feeds: "Meta AI on-demand fetches", tier: 2 },
  { ua: "Amazonbot", owner: "Amazon", feeds: "Alexa and Amazon AI answers", tier: 2 },
  { ua: "DuckAssistBot", owner: "DuckDuckGo", feeds: "DuckDuckGo AI answers", tier: 2 },
  { ua: "MistralAI-User", owner: "Mistral", feeds: "Le Chat on-demand fetches", tier: 2 },
  { ua: "CCBot", owner: "Common Crawl", feeds: "Open datasets many models train on", tier: 2 },
  { ua: "Bytespider", owner: "ByteDance", feeds: "ByteDance/TikTok AI", tier: 2 },
  { ua: "YouBot", owner: "You.com", feeds: "You.com answers", tier: 2 },
];

// Realistic UA strings for access tests (token + generic browser part is what most CDN rules match on).
export function uaString(token) {
  const map = {
    Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    Bingbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36",
    GPTBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot",
    "OAI-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
    "ChatGPT-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    PerplexityBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
    "Perplexity-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)",
    ClaudeBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Claude-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +claudebot@anthropic.com)",
    "Claude-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +claudebot@anthropic.com)",
  };
  return map[token] ?? `Mozilla/5.0 (compatible; ${token}/1.0)`;
}

// ---------- files ----------
export function walkHtml(dir) {
  const out = [];
  const skip = new Set(["node_modules", ".git", ".claude", "dist-old"]);
  (function walk(d) {
    for (const name of readdirSync(d)) {
      if (skip.has(name)) continue;
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (name.endsWith(".html")) out.push(p);
    }
  })(dir);
  return out.sort();
}

// /dist/a/index.html -> /a/ ; /dist/404.html -> /404.html ; /dist/index.html -> /
export function fileToPath(root, file) {
  let rel = relative(root, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel;
}

export function pathToFile(root, path) {
  if (path.endsWith("/")) return join(root, path, "index.html");
  if (path.endsWith(".html")) return join(root, path);
  return join(root, path, "index.html");
}

// ---------- tolerant HTML helpers (no DOM; good enough for static pages) ----------
export function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(text) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4]) : null;
}

export function allTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

export function tagContent(html, tagName) {
  // returns array of inner HTML for <tag ...>...</tag> (non-nested use)
  const re = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

export function metaContent(html, nameOrProp) {
  const tags = allTags(html, "meta");
  for (const t of tags) {
    const n = attr(t, "name") ?? attr(t, "property");
    if (n && n.toLowerCase() === nameOrProp.toLowerCase()) return attr(t, "content");
  }
  return null;
}

export function linkHref(html, rel, extra = {}) {
  const tags = allTags(html, "link");
  const out = [];
  for (const t of tags) {
    const r = (attr(t, "rel") ?? "").toLowerCase().split(/\s+/);
    if (!r.includes(rel.toLowerCase())) continue;
    let ok = true;
    for (const [k, v] of Object.entries(extra)) if ((attr(t, k) ?? "").toLowerCase() !== v.toLowerCase()) ok = false;
    if (ok) out.push({ href: attr(t, "href"), hreflang: attr(t, "hreflang"), tag: t });
  }
  return out;
}

export function jsonLdBlocks(html) {
  const re = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    try { out.push({ ok: true, data: JSON.parse(raw) }); }
    catch (e) { out.push({ ok: false, error: e.message, raw: raw.slice(0, 120) }); }
  }
  return out;
}

// Flatten a JSON-LD document (with @graph) into a list of typed nodes
export function ldNodes(blocks) {
  const nodes = [];
  const push = (n) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) return n.forEach(push);
    if (n["@graph"]) n["@graph"].forEach(push);
    if (n["@type"]) nodes.push(n);
  };
  for (const b of blocks) if (b.ok) push(b.data);
  return nodes;
}
export const hasType = (node, type) => {
  const t = node["@type"];
  return Array.isArray(t) ? t.includes(type) : t === type;
};

// ---------- CSV ----------
export function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export function csvObjects(text) {
  const rows = parseCsv(text);
  const [head, ...rest] = rows;
  const keys = head.map((h) => h.trim().toLowerCase());
  return rest.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

export function toCsv(rows, columns) {
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}

// ---------- fetch ----------
export async function fetchText(url, { ua = "rank-first-audit/1.0 (+https://github.com/)", timeoutMs = 20000, redirect = "follow" } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { "User-Agent": ua, Accept: "text/html,*/*" }, redirect, signal: ctrl.signal });
    const text = redirect === "manual" && res.status >= 300 && res.status < 400 ? "" : await res.text();
    return { status: res.status, headers: res.headers, text, url: res.url };
  } finally { clearTimeout(t); }
}

// ---------- output ----------
export const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      if (v !== undefined) args[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith("--")) args[k] = argv[++i];
      else args[k] = true;
    } else args._.push(a);
  }
  return args;
}

export function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

// ISO week label used for scoreboard files: 2026-W40
export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${String(w).padStart(2, "0")}`;
}

// ---------- schema.org business types (curated; Organization/LocalBusiness subtypes that Google reads) ----------
export const ORG_TYPES = new Set(`Organization LocalBusiness ProfessionalService Corporation NGO EducationalOrganization School Preschool CollegeOrUniversity
MedicalOrganization MedicalBusiness MedicalClinic Dentist Physician Pharmacy Optician Hospital VeterinaryCare Physiotherapy Dermatology Pediatric PrimaryCare
AutomotiveBusiness AutoDealer AutoRental AutoRepair AutoWash AutoBodyShop AutoPartsStore GasStation MotorcycleDealer MotorcycleRepair TireShop
FoodEstablishment Restaurant CafeOrCoffeeShop Bakery FastFoodRestaurant IceCreamShop LodgingBusiness Hotel Hostel BedAndBreakfast Resort TravelAgency
RealEstateAgent HealthAndBeautyBusiness BeautySalon HairSalon DaySpa NailSalon TattooParlor HealthClub SportsActivityLocation ExerciseGym
HomeAndConstructionBusiness Plumber Electrician HVACBusiness GeneralContractor HousePainter Locksmith MovingCompany RoofingContractor
LegalService Attorney Notary AccountingService FinancialService InsuranceAgency BankOrCreditUnion EmploymentAgency
Store ClothingStore ElectronicsStore FurnitureStore GroceryStore HardwareStore JewelryStore MobilePhoneStore ShoeStore ToyStore Florist PetStore BikeStore
BookStore ComputerStore ConvenienceStore DepartmentStore GardenStore HobbyShop HomeGoodsStore MensClothingStore MusicStore OfficeEquipmentStore OutletStore
SportingGoodsStore WholesaleStore EntertainmentBusiness NightClub ArtGallery EventVenue ChildCare DryCleaningOrLaundry SelfStorage TouristInformationCenter
InternetCafe RecyclingCenter ShoppingCenter`.split(/\s+/).filter(Boolean));
