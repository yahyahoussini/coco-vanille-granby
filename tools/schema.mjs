#!/usr/bin/env node
// scripts/schema.mjs — JSON-LD builders (Layers 8 and 12). Every value MUST also be visible on the page.
// Usage:
//   node schema.mjs --config site.config.json                      -> site graph (Organization/LocalBusiness subtype + founder + WebSite)
//   node schema.mjs --page /gestion-stock-casablanca/ --lang fr    -> site graph + WebPage + BreadcrumbList (+ Article/Service from page.type)
//   node schema.mjs --page /prix/ --faq faq.json                   -> adds FAQPage from [{ "q": "...", "a": "..." }]
//   node schema.mjs --page /... --html                             -> wraps the output in <script type="application/ld+json">
// Paste the output in <head>. Validate with Google's Rich Results Test and validator.schema.org.
import { readFileSync } from "node:fs";
import { loadConfig, parseArgs, ORG_TYPES } from "./lib.mjs";

const clean = (o) => {
  // drop null/undefined/empty values recursively
  if (Array.isArray(o)) return o.map(clean).filter((v) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0));
  if (o && typeof o === "object") {
    const out = {};
    for (const [k, v] of Object.entries(o)) {
      const cv = clean(v);
      if (cv === undefined || cv === null || cv === "" || (Array.isArray(cv) && cv.length === 0) || (typeof cv === "object" && !Array.isArray(cv) && Object.keys(cv).length === 0)) continue;
      out[k] = cv;
    }
    return out;
  }
  return o;
};

export function orgNode(cfg) {
  const site = cfg.site, b = cfg.brand ?? {}, nap = cfg.nap ?? {};
  const type = cfg.type ?? (nap.street ? "LocalBusiness" : "Organization");
  if (!ORG_TYPES.has(type)) console.error(`warning: "${type}" is not a known schema.org Organization/LocalBusiness type — pick one from references/12-site-types.md (e.g. AutoRental, Restaurant, Dentist, Store, ProfessionalService).`);
  return clean({
    "@type": type,
    "@id": `${site}/#org`,
    name: b.name,
    alternateName: b.nameAr,
    legalName: b.legalName,
    url: site,
    logo: b.logo ? { "@type": "ImageObject", url: abs(site, b.logo), width: b.logoWidth, height: b.logoHeight } : undefined,
    image: b.image ? abs(site, b.image) : undefined,
    description: cfg.category?.sentence?.fr,
    slogan: b.slogan,
    telephone: nap.phone,
    email: nap.email,
    address: nap.street || nap.city ? {
      "@type": "PostalAddress", streetAddress: nap.street, addressLocality: nap.city, postalCode: nap.postalCode, addressRegion: nap.region, addressCountry: nap.country ?? "MA",
    } : undefined,
    geo: cfg.geo?.lat ? { "@type": "GeoCoordinates", latitude: cfg.geo.lat, longitude: cfg.geo.lng } : undefined,
    hasMap: cfg.mapsUrl,
    openingHoursSpecification: (cfg.hours ?? []).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    priceRange: cfg.priceRange,
    areaServed: cfg.areaServed,
    currenciesAccepted: !["Organization", "Corporation", "NGO", "EducationalOrganization", "School", "Preschool", "CollegeOrUniversity", "MedicalOrganization"].includes(type) ? "MAD" : undefined,
    foundingDate: b.founded,
    founder: b.founder?.name ? { "@id": `${site}/#founder` } : undefined,
    taxID: b.ice,           // ICE (Identifiant Commun de l'Entreprise) — a stable public identifier in Morocco
    vatID: b.if,
    knowsAbout: cfg.category?.knowsAbout,
    sameAs: cfg.sameAs,
  });
}

export function founderNode(cfg) {
  const f = cfg.brand?.founder;
  if (!f?.name) return null;
  return clean({
    "@type": "Person",
    "@id": `${cfg.site}/#founder`,
    name: f.name,
    jobTitle: f.role,
    url: f.url ? abs(cfg.site, f.url) : undefined,
    image: f.image ? abs(cfg.site, f.image) : undefined,
    description: f.bio,
    knowsAbout: f.knowsAbout ?? cfg.category?.knowsAbout,
    hasCredential: (f.credentials ?? []).map((c) => ({ "@type": "EducationalOccupationalCredential", name: c })),
    worksFor: { "@id": `${cfg.site}/#org` },
    sameAs: f.sameAs,
  });
}

export function websiteNode(cfg) {
  const langs = [cfg.languages.default, ...(cfg.languages.others ?? [])].map((l) => cfg.languages.hreflang?.[l] ?? l);
  return clean({
    "@type": "WebSite",
    "@id": `${cfg.site}/#website`,
    url: `${cfg.site}/`,
    name: cfg.brand?.name,
    inLanguage: langs,
    publisher: { "@id": `${cfg.site}/#org` },
  });
}

export function findPage(cfg, path) {
  return (cfg.pages ?? []).find((p) => p.path === path || Object.values(p.alt ?? {}).includes(path));
}

export function langOfPath(cfg, path) {
  for (const l of cfg.languages.others ?? []) if (path === `/${l}/` || path.startsWith(`/${l}/`)) return l;
  return cfg.languages.default;
}

export function breadcrumbNode(cfg, path, lang) {
  const site = cfg.site;
  const homeLabel = { fr: "Accueil", ar: "الرئيسية", en: "Home" }[lang] ?? "Home";
  const items = [{ name: homeLabel, item: lang === cfg.languages.default ? `${site}/` : `${site}/${lang}/` }];
  const segs = path.split("/").filter(Boolean);
  const start = lang === cfg.languages.default ? 0 : 1; // skip the language folder
  let acc = start ? `/${segs[0]}/` : "/";
  for (let i = start; i < segs.length; i++) {
    acc = `${acc}${segs[i]}/`;
    const p = findPage(cfg, acc);
    const name = p?.title?.[lang] ?? p?.title?.[cfg.languages.default] ?? segs[i].replace(/-/g, " ");
    items.push({ name, item: `${site}${acc}` });
  }
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.item })),
  };
}

export function webPageNode(cfg, path, lang, page) {
  const url = `${cfg.site}${path}`;
  return clean({
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page?.title?.[lang] ?? page?.title?.[cfg.languages.default],
    description: page?.description?.[lang] ?? page?.description?.[cfg.languages.default],
    inLanguage: cfg.languages.hreflang?.[lang] ?? lang,
    isPartOf: { "@id": `${cfg.site}/#website` },
    about: { "@id": `${cfg.site}/#org` },
    datePublished: page?.published,
    dateModified: page?.updated,
    primaryImageOfPage: page?.image ? { "@type": "ImageObject", url: abs(cfg.site, page.image) } : undefined,
  });
}

export function articleNode(cfg, path, lang, page) {
  const url = `${cfg.site}${path}`;
  return clean({
    "@type": page?.articleType ?? "Article",
    headline: page?.title?.[lang] ?? page?.title?.[cfg.languages.default],
    description: page?.description?.[lang] ?? page?.description?.[cfg.languages.default],
    inLanguage: cfg.languages.hreflang?.[lang] ?? lang,
    author: cfg.brand?.founder?.name ? { "@id": `${cfg.site}/#founder` } : { "@id": `${cfg.site}/#org` },
    publisher: { "@id": `${cfg.site}/#org` },
    datePublished: page?.published,
    dateModified: page?.updated,
    image: page?.image ? abs(cfg.site, page.image) : undefined,
    mainEntityOfPage: url,
    // Layer 10.2 / 14: what the page is about and what it cites — from site.config.json → pages[].about (schema.org/Wikidata URLs or
    // names) and pages[].citations (URLs of the sources the page quotes; facts.json sources[] can be copied here). Only what is on the page.
    about: page?.about?.length ? page.about.map((a) => (/^https?:/.test(a) ? { "@type": "Thing", sameAs: a } : { "@type": "Thing", name: a })) : undefined,
    citation: page?.citations?.length ? page.citations.map((u) => (typeof u === "string" ? { "@type": "CreativeWork", url: u } : clean({ "@type": "CreativeWork", url: u.url, name: u.name, datePublished: u.date }))) : undefined,
    speakable: page?.speakable === false ? undefined : { "@type": "SpeakableSpecification", cssSelector: [".answer", "h1"] },
  });
}

export function serviceNode(cfg, path, lang, page) {
  return clean({
    "@type": "Service",
    "@id": `${cfg.site}${path}#service`,
    name: page?.serviceName?.[lang] ?? page?.title?.[lang],
    serviceType: page?.serviceType,
    description: page?.description?.[lang],
    provider: { "@id": `${cfg.site}/#org` },
    areaServed: cfg.areaServed,
    url: `${cfg.site}${path}`,
    offers: page?.price ? {
      "@type": "Offer", price: page.price.amount, priceCurrency: page.price.currency ?? "MAD",
      priceSpecification: page.price.unit ? { "@type": "UnitPriceSpecification", price: page.price.amount, priceCurrency: page.price.currency ?? "MAD", unitText: page.price.unit } : undefined,
      availability: "https://schema.org/InStock", url: `${cfg.site}${path}`,
    } : undefined,
  });
}

export function faqNode(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };
}

export function videoNode(v) {
  // v: { name, description, thumbnailUrl, uploadDate, duration (ISO 8601, e.g. PT4M12S), embedUrl, contentUrl }
  return clean({ "@type": "VideoObject", ...v });
}

export function siteGraph(cfg) {
  return [orgNode(cfg), founderNode(cfg), websiteNode(cfg)].filter(Boolean);
}

export function pageGraph(cfg, path, opts = {}) {
  const lang = opts.lang ?? langOfPath(cfg, path);
  const page = findPage(cfg, path);
  const nodes = [...siteGraph(cfg), webPageNode(cfg, path, lang, page)];
  if (path !== "/" && path !== `/${lang}/`) nodes.push(breadcrumbNode(cfg, path, lang));
  const t = opts.type ?? page?.type;
  if (["pillar", "cluster", "blog", "article", "city", "comparison", "study"].includes(t)) nodes.push(articleNode(cfg, path, lang, page));
  if (["service", "pillar", "city"].includes(t) && (page?.serviceName || page?.serviceType)) nodes.push(serviceNode(cfg, path, lang, page));
  if (opts.faq?.length) nodes.push(faqNode(opts.faq));
  if (opts.video) nodes.push(videoNode(opts.video));
  return { "@context": "https://schema.org", "@graph": nodes };
}

function abs(site, u) { return /^https?:\/\//i.test(u) ? u : `${site}${u.startsWith("/") ? "" : "/"}${u}`; }

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop());
if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const cfg = loadConfig(args.config ?? "site.config.json");
  let doc;
  if (args.page) {
    const faq = args.faq ? JSON.parse(readFileSync(args.faq, "utf8")) : undefined;
    doc = pageGraph(cfg, args.page, { lang: args.lang, type: args.type, faq });
  } else {
    doc = { "@context": "https://schema.org", "@graph": siteGraph(cfg) };
  }
  const json = JSON.stringify(doc, null, 2);
  console.log(args.html ? `<script type="application/ld+json">\n${json}\n</script>` : json);
}
