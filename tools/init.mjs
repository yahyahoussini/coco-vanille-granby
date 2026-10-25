#!/usr/bin/env node
// scripts/init.mjs — scaffold a client project (config, facts, static root, templates, scoreboard, docs) in one command.
// Usage (all flags optional except --brand and --service):
//   node init.mjs --brand "Diab Car" --service "location de voiture" --service-ar "كراء السيارات" \
//     --city Casablanca --city-ar "الدار البيضاء" --domain diabcar.ma --type AutoRental --langs fr,ar \
//     --phone +212522000000 --whatsapp +212600000000 --email contact@diabcar.ma --street "12 rue X" --postal 20000 \
//     --founder "Nom Prénom" --founder-role Gérant [--founder-ar "الاسم"] [--founder-role-ar "المسير"] [--legal-name "…"] [--ice …] [--rc …] [--if …] \
//     [--quartier Maarif] --out ./diabcar --root site [--llms] [--docs-only] [--no-pages] [--force]
// Unknown facts become [[FACT NEEDED: ...]] markers that audit.mjs refuses to ship.
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { deflateSync } from "node:zlib";
import { spawnSync } from "node:child_process";
import { parseArgs, toCsv, isoDate } from "./lib.mjs";
import { buildPrompts } from "./prompts.mjs";

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.brand || !args.service) {
  console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 9).join("\n"));
  process.exit(args.help ? 0 : 1);
}
const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(SKILL, "assets");
const out = resolve(args.out ?? ".");
const rootName = args.root ?? "site";
const root = join(out, rootName);
const langs = String(args.langs ?? "fr,ar").split(",").map((s) => s.trim()).filter(Boolean);
const [defLang, ...others] = langs;
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const domain = (args.domain ?? `${slug(args.brand)}.ma`).replace(/^https?:\/\//, "").replace(/\/$/, "");
const site = `https://${domain}`;
const city = args.city ?? "Casablanca";
const cityAr = args["city-ar"] ?? ({ Casablanca: "الدار البيضاء", Rabat: "الرباط", Marrakech: "مراكش", Tanger: "طنجة", Fès: "فاس", Agadir: "أكادير", Meknès: "مكناس", Oujda: "وجدة", Kénitra: "القنيطرة", Tétouan: "تطوان", Salé: "سلا", Mohammedia: "المحمدية", "El Jadida": "الجديدة" }[city] ?? city);
const need = (v, label) => v ?? `[[FACT NEEDED: ${label}]]`;
const serviceSlug = slug(args.service);
const citySlug = slug(city);
const pillar = `/${serviceSlug}-${citySlug}/`;
const hreflangMap = Object.fromEntries(langs.map((l) => [l, `${l}-MA`]));

const config = {
  $comment: "rank-first site config. Every value here is public and must match the site, Google Business Profile and every directory character for character (Layer 8).",
  site,
  root: rootName,
  brand: {
    name: args.brand,
    nameAr: args["brand-ar"] ?? "",
    legalName: args["legal-name"] ?? "",
    logo: "/img/logo.png",
    image: "/img/facade.jpg",
    founded: args.founded ?? "",
    ice: args.ice ?? "",
    rc: args.rc ?? "",
    if: args.if ?? "",
    founder: { name: args.founder ?? "", nameAr: args["founder-ar"] ?? "", role: args["founder-role"] ?? "", roleAr: args["founder-role-ar"] ?? "", url: args.founder ? `/a-propos/${slug(args.founder)}/` : "", image: "", bio: "", credentials: [], sameAs: [] },
  },
  type: args.type ?? "LocalBusiness",
  category: {
    sentence: { fr: `${args.brand} est ${args.service} pour [[FACT NEEDED: client type]] à ${city}.`, ar: `${args["brand-ar"] ?? args.brand} ${args["service-ar"] ?? args.service} في ${cityAr}.` },
    service: { fr: args.service, ar: args["service-ar"] ?? args.service },
    city: { fr: city, ar: cityAr },
    quartiers: args.quartier ? [args.quartier] : [],
    knowsAbout: [args.service],
  },
  nap: { street: args.street ?? "", city, postalCode: args.postal ?? "", region: "", country: "MA", phone: args.phone ?? "", whatsapp: args.whatsapp ?? args.phone ?? "", email: args.email ?? "" },
  geo: { lat: null, lng: null },
  mapsUrl: "",
  hours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" }, { days: ["Saturday"], opens: "09:00", closes: "13:00" }],
  priceRange: "",
  areaServed: [city],
  sameAs: [],
  languages: { default: defLang, others, hreflang: hreflangMap },
  urlPolicy: { trailingSlash: true, www: false },
  robots: { disallow: ["/admin/", "/recherche", "/panier/"] },
  contentSignal: { search: "yes", "ai-input": "yes", "ai-train": "yes" },
  indexnow: { key: randomBytes(16).toString("hex") },
  llmsTxt: !!args.llms,
  redirects: [],
  pages: [
    { path: "/", type: "home", title: { fr: `${args.brand} : ${args.service} à ${city}`, ar: `${args["brand-ar"] ?? args.brand}: ${args["service-ar"] ?? args.service} في ${cityAr}` }, h1: { fr: `${args.brand}, ${args.service} à ${city}`, ar: `${args["brand-ar"] ?? args.brand}، ${args["service-ar"] ?? args.service} في ${cityAr}` }, published: isoDate(), updated: isoDate() },
    { path: pillar, type: "pillar", nav: true, navLabel: { fr: cap(args.service), ar: args["service-ar"] ?? args.service }, title: { fr: `${cap(args.service)} à ${city} | ${args.brand}`, ar: `${args["service-ar"] ?? args.service} في ${cityAr} | ${args["brand-ar"] ?? args.brand}` }, h1: { fr: `${cap(args.service)} à ${city}`, ar: `${args["service-ar"] ?? args.service} في ${cityAr}` }, published: isoDate(), updated: isoDate() },
    { path: "/prix/", type: "cluster", nav: true, navLabel: { fr: "Prix", ar: "الأسعار" }, title: { fr: `Prix ${args.service} ${city} | ${args.brand}`, ar: `أسعار ${args["service-ar"] ?? args.service} ${cityAr} | ${args["brand-ar"] ?? args.brand}` }, h1: { fr: `Combien coûte ${args.service} à ${city} ?`, ar: `كم تكلفة ${args["service-ar"] ?? args.service} في ${cityAr}؟` }, published: isoDate(), updated: isoDate() },
    { path: "/a-propos/", type: "about", nav: true, navLabel: { fr: "À propos", ar: "من نحن" }, title: { fr: `À propos de ${args.brand}, ${city}`, ar: `عن ${args["brand-ar"] ?? args.brand}، ${cityAr}` }, published: isoDate(), updated: isoDate() },
    ...(args.founder ? [{ path: `/a-propos/${slug(args.founder)}/`, type: "person", title: { fr: `${args.founder}, ${args["founder-role"] ?? "fondateur"} de ${args.brand}`, ar: `${args["founder-ar"] ?? args.founder}، ${args["founder-role-ar"] ?? args["founder-role"] ?? ""} ${args["brand-ar"] ?? args.brand}` }, published: isoDate(), updated: isoDate() }] : []),
    { path: "/contact/", type: "contact", nav: true, navLabel: { fr: "Contact", ar: "اتصل بنا" }, title: { fr: `Contact ${args.brand} ${city}`, ar: `اتصل بـ${args["brand-ar"] ?? args.brand} ${cityAr}` }, published: isoDate(), updated: isoDate() },
    { path: "/mentions-legales/", type: "legal", title: { fr: "Mentions légales" } },
    { path: "/confidentialite/", type: "legal", title: { fr: "Politique de confidentialité" } },
  ],
};
if (others.length) for (const p of config.pages) if (p.type !== "legal") p.alt = Object.fromEntries(others.map((l) => [l, `/${l}${p.path}`]));

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

const write = (rel, content) => {
  const p = join(out, rel);
  if (existsSync(p) && !args.force) { console.log(`skip (exists) ${rel}`); return; }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log(`wrote ${rel}`);
};

mkdirSync(out, { recursive: true });
write("site.config.json", JSON.stringify(config, null, 2) + "\n");
write("facts.json", JSON.stringify({
  $comment: "Every number, price, date and quote used on the site lives here with its source. Pages reference facts with data-fact=\"id\". Never invent a fact; ask the client or find a public source with a URL.",
  facts: [
    { id: "founded", value: args.founded ?? "", text: { fr: "", ar: "" }, source: "client", date: isoDate(), status: args.founded ? "confirmed" : "needed" },
  ],
  quotes: [{ id: "q-founder-1", text: { fr: "", ar: "" }, person: args.founder ?? "", role: args["founder-role"] ?? "", status: "needed" }],
  sources: [],
}, null, 2) + "\n");

// placeholders for docs and legal templates
const vars = {
  BRAND: args.brand, BRAND_AR: args["brand-ar"] ?? args.brand, SERVICE: args.service, SERVICE_AR: args["service-ar"] ?? args.service,
  CITY: city, CITY_AR: cityAr, DOMAIN: domain, SITE: site, DATE: isoDate(), PILLAR: pillar,
  BRAND_SLUG: slug(args.brand), CITY_SLUG: citySlug, SERVICE_SLUG: serviceSlug,
  PHONE: args.phone, WHATSAPP: (args.whatsapp ?? args.phone)?.replace(/[^\d]/g, ""), EMAIL: args.email, STREET: args.street, POSTAL: args.postal,
  FOUNDER: args.founder, FOUNDER_ROLE: args["founder-role"], FOUNDER_AR: args["founder-ar"], FOUNDER_ROLE_AR: args["founder-role-ar"],
  FOUNDER_URL: args.founder ? `/a-propos/${slug(args.founder)}/` : "/a-propos/", FOUNDER_URL_AR: args.founder ? `/${others[0] ?? "ar"}/a-propos/${slug(args.founder)}/` : `/${others[0] ?? "ar"}/a-propos/`,
  LEGAL_NAME: args["legal-name"], ICE: args.ice, RC: args.rc, INDEXNOW_KEY: config.indexnow.key,
  SKILL_DIR: SKILL,
};
const fill = (text) => text.replace(/\{\{([A-Z_]+)\}\}/g, (_, k) => vars[k] ?? `[[FACT NEEDED: ${k.toLowerCase().replace(/_/g, " ")}]]`);

// docs
for (const f of readdirSync(join(ASSETS, "docs"))) write(join("docs", f), fill(readFileSync(join(ASSETS, "docs", f), "utf8")));

if (!args["docs-only"]) {
  mkdirSync(root, { recursive: true });
  for (const [from, to] of [["site.css", "css/site.css"], ["whatsapp-event.js", "js/whatsapp-event.js"], ["404.html", "404.html"]]) write(join(rootName, to), fill(readFileSync(join(ASSETS, from), "utf8")));
  mkdirSync(join(root, "img"), { recursive: true });
  for (const f of readdirSync(join(ASSETS, "legal"))) write(join(rootName, f.replace(/\.html$/, ""), "index.html"), fill(readFileSync(join(ASSETS, "legal", f), "utf8")));
  for (const f of ["page-template.html", "page-template.ar.html", "lite-youtube.html"]) write(join("templates", f), fill(readFileSync(join(ASSETS, f), "utf8")));
  write(join(rootName, `${config.indexnow.key}.txt`), config.indexnow.key);
}

// scoreboard
const prompts = buildPrompts({ brand: args.brand, service: args.service, serviceAr: args["service-ar"], city, cityAr, quartier: args.quartier });
write("scoreboard/prompts.csv", toCsv(prompts, ["id", "type", "lang", "prompt", "intent_note", "deciding_system", "w_weak_top10", "w_authority_range", "w_surface_winnable", "w_buyer", "w_score"]));
write("scoreboard/snippet-targets.csv", readFileSync(join(ASSETS, "scoreboard", "snippet-targets.csv"), "utf8"));
mkdirSync(join(out, "docs", "briefs"), { recursive: true });
mkdirSync(join(out, "scoreboard", "runs"), { recursive: true });
write("scoreboard/runs-template.csv", fill(readFileSync(join(ASSETS, "scoreboard", "runs-template.csv"), "utf8")));
write("scoreboard/README.md", fill(readFileSync(join(ASSETS, "scoreboard", "README.md"), "utf8")));
write("scoreboard/competitors.csv", readFileSync(join(ASSETS, "scoreboard", "competitors.csv"), "utf8"));
write("scoreboard/reviews.csv", readFileSync(join(ASSETS, "scoreboard", "reviews.csv"), "utf8"));
mkdirSync(join(out, "reports"), { recursive: true });
write(".env.example", ["# API keys for the automated measurement (never commit .env; load with: set -a; . ./.env; set +a  — or use your shell's export)", "SERPAPI_KEY=", "OPENAI_API_KEY=", "OPENAI_MODEL=gpt-5.4", "PERPLEXITY_API_KEY=", "PERPLEXITY_PRESET=fast", "GEMINI_API_KEY=", "GEMINI_MODEL=gemini-2.5-flash", "ANTHROPIC_API_KEY=", "ANTHROPIC_MODEL=claude-sonnet-5", "GA4_PROPERTY_ID=", "GOOGLE_APPLICATION_CREDENTIALS=google-service-account.json", "PSI_KEY=", ""].join("\n"));

// ---------- placeholder brand images (real ones replace them: docs/13 A2) ----------
function crc32(buf) { let c, crc = 0xffffffff; for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; }
function pngChunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function png(w, h, [r, g, b]) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const row = Buffer.alloc(1 + w * 3); for (let x = 0; x < w; x++) { row[1 + x * 3] = r; row[2 + x * 3] = g; row[3 + x * 3] = b; }
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk("IHDR", ihdr), pngChunk("IDAT", deflateSync(raw)), pngChunk("IEND", Buffer.alloc(0))]);
}
function ico(pngBuf, size) { const h = Buffer.alloc(6); h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4); const e = Buffer.alloc(16); e[0] = size; e[1] = size; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(pngBuf.length, 8); e.writeUInt32LE(22, 12); return Buffer.concat([h, e, pngBuf]); }
const initials = args.brand.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
const accent = [31, 58, 147];
const svgLogo = (w, h, fs) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${args.brand}"><rect width="${w}" height="${h}" rx="${Math.round(h * 0.15)}" fill="rgb(${accent.join(",")})"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, Arial, sans-serif" font-weight="700" font-size="${fs}" fill="#fff">${initials}</text></svg>\n`;
if (!args["docs-only"]) {
  const imgDir = join(rootName, "img");
  write(join(imgDir, "logo.svg"), svgLogo(140, 40, 22));
  write(join(imgDir, "icon.svg"), svgLogo(64, 64, 30));
  write(join(imgDir, "README.md"), `# Images à fournir (docs/13 A2) — remplacer les fichiers de substitution\n\n- logo.svg / icon.svg / favicon.ico / apple-touch-icon.png : logo réel (SVG + PNG 180×180 + ICO 32×32)\n- og-${slug(args.brand)}.png : image de partage 1200×630 (marque + catégorie + ville, photo réelle)\n- hero-${citySlug}.webp (1200×800) + -800.webp + -480.webp : photo réelle du lieu / de l'équipe / du travail, nommée de façon descriptive\n- facade.jpg : façade réelle (schema image)\n- ${args.founder ? slug(args.founder) + ".webp : portrait du fondateur 800×800" : "portrait du fondateur 800×800"}\n- photos réelles supplémentaires (≥ 10), noms descriptifs, WebP/AVIF, ≤ 200 KB chacune\n`);
  const fav = join(out, rootName, "favicon.ico"), apple = join(out, imgDir, "apple-touch-icon.png"), og = join(out, imgDir, `og-${slug(args.brand)}.png`);
  if (!existsSync(fav) || args.force) { writeFileSync(fav, ico(png(32, 32, accent), 32)); console.log(`wrote ${rootName}/favicon.ico (placeholder)`); }
  if (!existsSync(apple) || args.force) { writeFileSync(apple, png(180, 180, accent)); console.log(`wrote ${imgDir}/apple-touch-icon.png (placeholder)`); }
  if (!existsSync(og) || args.force) { writeFileSync(og, png(1200, 630, accent)); console.log(`wrote ${imgDir}/og-${slug(args.brand)}.png (placeholder)`); }
}

// ---------- the scripts travel with the project (handover-proof): tools/ ----------
const S = join(SKILL, "scripts");
mkdirSync(join(out, "tools"), { recursive: true });
for (const f of readdirSync(S).filter((f) => f.endsWith(".mjs"))) { copyFileSync(join(S, f), join(out, "tools", f)); }
console.log(`copied ${readdirSync(S).filter((f) => f.endsWith(".mjs")).length} scripts to tools/ (the project stays self-contained for handover)`);
write("package.json", JSON.stringify({
  name: slug(args.brand) + "-site", private: true, type: "module",
  scripts: {
    pages: `node tools/pages.mjs`,
    generate: `node tools/generate.mjs`,
    audit: `node tools/audit.mjs ${rootName}`,
    links: `node tools/links.mjs ${rootName}`,
    images: `node tools/images.mjs ${rootName}`,
    validate: `node tools/validate-html.mjs ${rootName} --max 20`,
    gate: `npm run generate && npm run audit && npm run links && npm run images`,
    check: `node tools/check-urls.mjs ${site}/sitemap.xml`,
    crawlers: `node tools/crawler-access.mjs --sitemap ${site}/sitemap.xml --max 5`,
    cwv: `node tools/cwv.mjs ${site}/ ${site}${pillar}`,
    indexnow: `node tools/indexnow.mjs`,
    "indexnow:all": `node tools/indexnow.mjs --sitemap ${rootName}/sitemap.xml`,
    score: `node tools/citation-share.mjs`,
    schema: `node tools/schema.mjs`,
    feed: `node tools/feed.mjs products.json --schema-dir ${rootName}/schema/products`,
    // market intelligence and measurement (Layers 7, 15, 17) — see docs/19 and references/16
    market: `node tools/market.mjs`,
    weekly: `node tools/weekly.mjs`,
    serp: `node tools/serp.mjs`,
    ai: `node tools/ai-runs.mjs`,
    gsc: `node tools/gsc-api.mjs`,
    ga4: `node tools/ga4-api.mjs`,
    crawl: `node tools/crawl.mjs`,
    gap: `node tools/content-gap.mjs`,
    fresh: `node tools/freshness.mjs ${rootName} --skip-drafts`,
    dashboard: `node tools/dashboard.mjs`,
    study: `node tools/data-study.mjs`,
    programmatic: `node tools/programmatic.mjs`,
    render: `node tools/render-diff.mjs ${site}/ ${site}${pillar}`,
  },
}, null, 2) + "\n");
write(".gitignore", ["node_modules/", "audit-report.json", "*.log", ".env", "google-service-account.json", "# raw API responses (large, re-fetchable); the derived CSV/MD files stay versioned", "serp/**/*.json", "!serp/**/prompts.json", "ai/**/*.json", "gsc/*.json", ""].join("\n"));

// ---------- skeleton pages for every page in the config (never overwrites) ----------
if (!args["docs-only"] && !args["no-pages"]) {
  const r = spawnSync(process.execPath, [join(out, "tools", "pages.mjs"), "--config", join(out, "site.config.json"), "--root", join(out, rootName), "--templates", join(out, "templates")], { cwd: out, encoding: "utf8" });
  process.stdout.write(r.stdout ?? ""); if (r.status !== 0) process.stderr.write(r.stderr ?? "");
}

console.log(`\nProject ready in ${out}
  root folder (deploy as-is): ${rootName}/  — skeleton pages written for every page in site.config.json (FR + AR)
  next: write the content in place of every [[FACT NEEDED]] from facts.json, add clusters to site.config.json → pages[] and run "npm run pages", then "npm run gate"
  human tasks: docs/13-taches-humaines.md · facts still needed: grep -rn "FACT NEEDED" ${rootName} | wc -l`);
