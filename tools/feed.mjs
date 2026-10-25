#!/usr/bin/env node
// scripts/feed.mjs — Layer 19.1: Google Merchant Center product feed (TSV) from products.json, plus Product JSON-LD per product.
// Google's guide says Merchant Center feeds help products appear in AI responses; the same data feeds the Product schema on product pages.
// products.json: [{ "id": "SKU-1", "title": "…", "description": "…", "link": "/produits/x/", "image_link": "/img/x.jpg", "price": 249, "currency": "MAD",
//                   "availability": "in_stock|out_of_stock|preorder", "brand": "…", "gtin": "…", "mpn": "…", "condition": "new|used|refurbished",
//                   "shipping_price": 30, "shipping_country": "MA", "google_product_category": "…", "product_type": "…", "sale_price": 199,
//                   "return_days": 14, "return_fees": "free|customer", "return_method": "mail|store|kiosk" }]   (return policy emitted only when all three are given)
// Usage: node feed.mjs products.json [--config site.config.json] [--out site/merchant-feed.tsv] [--schema-dir site/schema/products]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, parseArgs } from "./lib.mjs";

const args = parseArgs(process.argv.slice(2));
const file = args._[0];
if (!file) { console.error("Usage: node feed.mjs products.json [--out site/merchant-feed.tsv]"); process.exit(1); }
const cfg = loadConfig(args.config ?? "site.config.json");
const products = JSON.parse(readFileSync(file, "utf8"));
const abs = (u) => (/^https?:\/\//i.test(u) ? u : `${cfg.site}${u.startsWith("/") ? "" : "/"}${u}`);
const required = ["id", "title", "description", "link", "image_link", "price", "availability"];
const cols = ["id", "title", "description", "link", "image_link", "availability", "price", "sale_price", "brand", "gtin", "mpn", "condition", "google_product_category", "product_type", "shipping"];
const lines = [cols.join("\t")];
const problems = [];
for (const p of products) {
  for (const r of required) if (p[r] == null || p[r] === "") problems.push(`${p.id ?? "?"}: missing ${r}`);
  if (!p.gtin && !p.mpn && !p.brand) problems.push(`${p.id}: needs gtin or mpn+brand (identifier_exists) for most categories`);
  const cur = p.currency ?? "MAD";
  const row = {
    id: p.id, title: p.title, description: (p.description ?? "").replace(/\s+/g, " ").slice(0, 5000), link: abs(p.link), image_link: abs(p.image_link),
    availability: p.availability ?? "in_stock", price: `${Number(p.price).toFixed(2)} ${cur}`, sale_price: p.sale_price != null ? `${Number(p.sale_price).toFixed(2)} ${cur}` : "",
    brand: p.brand ?? cfg.brand?.name ?? "", gtin: p.gtin ?? "", mpn: p.mpn ?? "", condition: p.condition ?? "new",
    google_product_category: p.google_product_category ?? "", product_type: p.product_type ?? "",
    shipping: p.shipping_price != null ? `${p.shipping_country ?? "MA"}:::${Number(p.shipping_price).toFixed(2)} ${cur}` : "",
  };
  lines.push(cols.map((k) => String(row[k] ?? "").replace(/[\t\r\n]+/g, " ")).join("\t"));
  if (args["schema-dir"]) {
    mkdirSync(args["schema-dir"], { recursive: true });
    const ld = {
      "@context": "https://schema.org", "@type": "Product", name: p.title, description: p.description, image: abs(p.image_link), sku: p.id, gtin: p.gtin, mpn: p.mpn,
      brand: { "@type": "Brand", name: row.brand },
      offers: { "@type": "Offer", url: abs(p.link), price: Number(p.sale_price ?? p.price), priceCurrency: cur, itemCondition: `https://schema.org/${{ new: "NewCondition", used: "UsedCondition", refurbished: "RefurbishedCondition" }[row.condition] ?? "NewCondition"}`,
        availability: `https://schema.org/${{ in_stock: "InStock", out_of_stock: "OutOfStock", preorder: "PreOrder" }[row.availability] ?? "InStock"}`,
        shippingDetails: p.shipping_price != null ? { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: Number(p.shipping_price), currency: cur }, shippingDestination: { "@type": "DefinedRegion", addressCountry: p.shipping_country ?? "MA" } } : undefined,
        // Return policy ONLY from explicit client facts: return_days (number), return_fees ("free" | "customer"), return_method ("mail" | "store" | "kiosk"), return_country (default MA). Nothing is assumed.
        hasMerchantReturnPolicy: p.return_days != null && p.return_fees && p.return_method ? { "@type": "MerchantReturnPolicy", applicableCountry: p.return_country ?? "MA", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: p.return_days, returnMethod: `https://schema.org/${{ mail: "ReturnByMail", store: "ReturnInStore", kiosk: "ReturnAtKiosk" }[p.return_method] ?? "ReturnInStore"}`, returnFees: p.return_fees === "free" ? "https://schema.org/FreeReturn" : "https://schema.org/ReturnFeesCustomerResponsibility" } : undefined },
    };
    writeFileSync(join(args["schema-dir"], `${String(p.id).replace(/[^\w.-]/g, "_")}.json`), JSON.stringify(ld, null, 2));
  }
}
const out = args.out ?? join(cfg.root ?? "site", "merchant-feed.tsv");
writeFileSync(out, lines.join("\n") + "\n");
console.log(`${out}: ${products.length} product(s). ${problems.length ? "Problems:\n  " + problems.join("\n  ") : "No missing required attributes."}`);
console.log("Next (human): Merchant Center → Products → Add products → scheduled fetch of this TSV URL; every value must match the product page (price, availability). Same JSON-LD goes in each product page's <head>.");
process.exit(problems.length ? 1 : 0);
