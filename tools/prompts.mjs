#!/usr/bin/env node
// scripts/prompts.mjs — scaffold the 30-prompt query set (Layer 7) from the category sentence.
// Usage:
//   node prompts.mjs --config site.config.json [--out scoreboard/prompts.csv]
//   node prompts.mjs --service "location de voiture" --service-ar "كراء السيارات" --city Casablanca --city-ar "الدار البيضاء" --brand "Diab Car"
// The output is a SCAFFOLD: replace each prompt with the phrasing customers really type
// (Google autocomplete, People Also Ask, competitor titles, WhatsApp messages). Keep the ids.
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { loadConfig, parseArgs, toCsv } from "./lib.mjs";

export function buildPrompts({ brand, service, serviceAr, city, cityAr, quartier }) {
  const S = service, SA = serviceAr || service, C = city, CA = cityAr || city, Q = quartier || `${city} centre`;
  const rows = [];
  // deciding_system = the documented Google system most likely to decide the winner (Layer 6 "Done when" #2); refine per prompt after the SERP map.
  const systemFor = { informational: "passage ranking + helpful content", commercial: "reviews system + link authority", local: "local (relevance/distance/prominence)", brand: "entity / navigational" };
  // winnability (Layer 7.7): score 1-5 each after the baseline: w_weak_top10, w_authority_range, w_surface_winnable, w_buyer; w_score = sum; work >= 14 first.
  const add = (type, lang, prompt, note = "") => rows.push({ id: "", type, lang, prompt, intent_note: note, deciding_system: systemFor[type], w_weak_top10: "", w_authority_range: "", w_surface_winnable: "", w_buyer: "", w_score: "" });

  // 10 informational: how / what / why / conditions
  add("informational", "fr", `${S} c'est quoi`, "definition; wants 'X est ...' sentence");
  add("informational", "fr", `comment choisir ${S} à ${C}`, "guide; list format");
  add("informational", "fr", `combien coûte ${S} au Maroc`, "price question; table");
  add("informational", "fr", `${S} conditions et documents`, "process; ordered list");
  add("informational", "fr", `erreurs à éviter ${S}`, "experience content");
  add("informational", "fr", `${S} avantages et inconvénients`, "comparison table");
  add("informational", "ar", `كيف أختار ${SA} في ${CA}`, "guide");
  add("informational", "ar", `كم تكلفة ${SA} في المغرب`, "price");
  add("informational", "ar", `شروط ${SA} في المغرب`, "process");
  add("informational", "ar", `نصائح ${SA}`, "tips list");

  // 10 commercial / comparative
  add("commercial", "fr", `meilleur ${S} ${C}`, "listicle SERP; be on the lists");
  add("commercial", "fr", `top ${S} ${C}`, "listicle");
  add("commercial", "fr", `${S} ${C} avis`, "reviews; GBP + review platforms");
  add("commercial", "fr", `comparatif ${S} Maroc`, "comparison page with criteria");
  add("commercial", "fr", `${S} ${C} prix`, "price page");
  add("commercial", "fr", `${S} ${C} tarifs`, "price page");
  add("commercial", "ar", `أفضل ${SA} في ${CA}`, "listicle");
  add("commercial", "ar", `${SA} ${CA} أسعار`, "price");
  add("commercial", "ar", `${SA} ${CA} آراء`, "reviews");
  add("commercial", "darija", `ahsan ${S} f ${C}`, "REPLACE with real Darija-Latin phrasing from autocomplete");

  // 10 local / transactional
  add("local", "fr", `${S} près de moi`, "map pack; GBP");
  add("local", "fr", `${S} ${C} pas cher`, "price + local");
  add("local", "fr", `${S} ${Q}`, "neighbourhood; city page");
  add("local", "fr", `${S} ${C} téléphone`, "GBP; contact page");
  add("local", "fr", `${S} ${C} whatsapp`, "contact; wa.me link");
  add("local", "fr", `${S} ouvert maintenant ${C}`, "hours exact on GBP");
  add("local", "fr", `${S} ${C} contact`, "contact page");
  add("local", "ar", `${SA} قريب مني`, "map pack");
  add("local", "ar", `${SA} ${CA} رخيص`, "price + local");
  add("local", "darija", `${S} f ${C} rkhis`, "REPLACE with real Darija-Latin phrasing");

  // 3 brand prompts (not part of the 30; used to diagnose 'named without link' in AI engines)
  add("brand", "fr", `${brand} avis`, "navigational; profile + reviews");
  add("brand", "fr", `${brand} ${C}`, "navigational");
  add("brand", "fr", `c'est quoi ${brand}`, "entity; About page is the answer");

  const counters = { informational: 0, commercial: 0, local: 0, brand: 0 };
  const prefix = { informational: "I", commercial: "C", local: "L", brand: "B" };
  for (const r of rows) r.id = `${prefix[r.type]}${++counters[r.type]}`;
  return rows;
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop());
if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  let p;
  if (args.config || (!args.service && !args.brand)) {
    const cfg = loadConfig(args.config ?? "site.config.json");
    p = {
      brand: cfg.brand?.name, service: cfg.category?.service?.fr, serviceAr: cfg.category?.service?.ar,
      city: cfg.category?.city?.fr, cityAr: cfg.category?.city?.ar, quartier: cfg.category?.quartiers?.[0],
    };
  } else {
    p = { brand: args.brand ?? "Brand", service: args.service, serviceAr: args["service-ar"], city: args.city ?? "Casablanca", cityAr: args["city-ar"], quartier: args.quartier };
  }
  if (!p.service) { console.error("Need --service (or category.service.fr in site.config.json)"); process.exit(1); }
  const rows = buildPrompts(p);
  const out = args.out ?? "scoreboard/prompts.csv";
  if (!existsSync(dirname(out))) mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, toCsv(rows, ["id", "type", "lang", "prompt", "intent_note", "deciding_system", "w_weak_top10", "w_authority_range", "w_surface_winnable", "w_buyer", "w_score"]));
  console.log(`${out}: ${rows.length} prompts (30 scored + 3 brand). Now replace scaffold phrasing with real queries.`);
}
