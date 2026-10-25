#!/usr/bin/env node
// scripts/pages.mjs — the build layer: writes one skeleton HTML file per page and language from site.config.json → pages[],
// with the head (title, description, canonical, hreflang set, Open Graph), the navigation, the language switcher, the breadcrumb,
// the JSON-LD graph and a kind-specific body (home / pillar & clusters / about / person / contact). Content stays as
// [[FACT NEEDED]] markers for Claude to write from facts.json. Existing files are never overwritten unless --force.
// Usage: node pages.mjs [--config site.config.json] [--root site] [--templates templates] [--only /path/] [--force] [--dry-run]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, parseArgs, pathToFile, isoDate } from "./lib.mjs";
import { pageGraph } from "./schema.mjs";

const args = parseArgs(process.argv.slice(2));
const cfg = loadConfig(args.config ?? "site.config.json");
const root = args.root ?? cfg.root ?? "site";
const tplDir = args.templates ?? "templates";
const SKILL_ASSETS = resolve(dirname(fileURLToPath(import.meta.url)), "..", "assets");
const defLang = cfg.languages.default;
const langs = [defLang, ...(cfg.languages.others ?? [])];
const brand = cfg.brand?.name ?? "";
const brandFor = (lang) => (lang === "ar" && cfg.brand?.nameAr) ? cfg.brand.nameAr : brand;
const site = cfg.site;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const need = (label) => `[[FACT NEEDED: ${label}]]`;

function loadTemplate(lang) {
  const name = lang === defLang ? "page-template.html" : `page-template.${lang}.html`;
  const local = join(tplDir, name), fallback = join(SKILL_ASSETS, name);
  if (existsSync(local)) return readFileSync(local, "utf8");
  if (existsSync(fallback)) return readFileSync(fallback, "utf8");
  throw new Error(`No template for language "${lang}" (${local}). Add templates/${name}.`);
}

const pathFor = (page, lang) => (lang === defLang ? page.path : page.alt?.[lang]);
const homeFor = (lang) => (lang === defLang ? "/" : `/${lang}/`);
const t = (obj, lang, fallback) => obj?.[lang] ?? obj?.[defLang] ?? fallback;
const L = {
  fr: { home: "Accueil", nav: "Principal", crumb: "Fil d'Ariane", whatsapp: "WhatsApp", switch: { ar: "العربية", en: "English" } },
  ar: { home: "الرئيسية", nav: "القائمة الرئيسية", crumb: "مسار التصفح", whatsapp: "واتساب", switch: { fr: "Français", en: "English" } },
  en: { home: "Home", nav: "Main", crumb: "Breadcrumb", whatsapp: "WhatsApp", switch: { fr: "Français", ar: "العربية" } },
};
const lbl = (lang) => L[lang] ?? L.fr;

function navHtml(lang) {
  const items = (cfg.pages ?? []).filter((p) => p.nav && pathFor(p, lang)).map((p) => `      <a href="${pathFor(p, lang)}">${esc(t(p.navLabel, lang, t(p.title, lang, p.path)).split(" | ")[0])}</a>`);
  return items.join("\n");
}
function switcherLinks(page, lang) {
  return langs.filter((l) => l !== lang).map((l) => {
    const href = pathFor(page, l) ?? homeFor(l);
    return `      <a href="${href}" hreflang="${cfg.languages.hreflang?.[l] ?? l}" lang="${l}">${lbl(lang).switch[l] ?? l}</a>`;
  }).join("\n");
}
function hreflangBlock(page, lang) {
  const lines = langs.filter((l) => pathFor(page, l)).map((l) => `  <link rel="alternate" hreflang="${cfg.languages.hreflang?.[l] ?? l}" href="${site}${pathFor(page, l)}">`);
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${site}${pathFor(page, defLang)}">`);
  return lines.join("\n");
}

// ---------- kind-specific article bodies ----------
function bodyFor(page, lang, h1) {
  const B = brandFor(lang), S = t(cfg.category?.service, lang, ""), C = t(cfg.category?.city, lang, "");
  const nap = cfg.nap ?? {};
  const wa = (nap.whatsapp ?? nap.phone ?? "").replace(/[^\d]/g, "");
  const founder = cfg.brand?.founder ?? {};
  const fname = lang === "ar" ? (founder.nameAr || need(lang === "ar" ? "اسم المؤسس بالعربية" : "founder")) : (founder.name || need("fondateur"));
  const frole = lang === "ar" ? (founder.roleAr || need("الصفة بالعربية")) : (founder.role || need("rôle"));
  const furl = founder.url || (lang === defLang ? "/a-propos/" : `${homeFor(lang)}a-propos/`);
  const date = isoDate();
  const fr = lang !== "ar";
  const clusters = (cfg.pages ?? []).filter((p) => ["cluster", "service", "city"].includes(p.type) && pathFor(p, lang));
  const pillar = (cfg.pages ?? []).find((p) => p.type === "pillar");
  const author = fr
    ? `      <footer class="article-meta">\n        <p>Par <a href="${furl}" rel="author">${esc(fname)}</a>, ${esc(frole)}. Publié le <time datetime="${date}">${date}</time>, mis à jour le <time datetime="${date}">${date}</time>. <span class="change-note">${need("note de mise à jour")}</span></p>\n      </footer>`
    : `      <footer class="article-meta">\n        <p>بقلم <a href="${furl}" rel="author">${esc(fname)}</a>، ${esc(frole)}. نُشر في <time datetime="${date}">${date}</time>، آخر تحديث <time datetime="${date}">${date}</time>. <span class="change-note">${need("ملاحظة التحديث")}</span></p>\n      </footer>`;
  const cta = fr
    ? `      <section class="cta-band" aria-labelledby="cta">\n        <h2 id="cta">Demander un devis</h2>\n        <p>Réponse sous ${need("délai")} par WhatsApp.</p>\n        <a class="cta" href="https://wa.me/${wa}?text=Bonjour%20${encodeURIComponent(B)}">Écrire sur WhatsApp</a>\n        <a href="tel:${esc(nap.phone ?? "")}">Appeler le <bdi dir="ltr">${esc(nap.phone ?? need("téléphone"))}</bdi></a>\n      </section>`
    : `      <section class="cta-band" aria-labelledby="cta">\n        <h2 id="cta">اطلب عرض سعر</h2>\n        <p>الرد خلال ${need("المدة")} عبر واتساب.</p>\n        <a class="cta" href="https://wa.me/${wa}?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85">راسلنا على واتساب</a>\n        <a href="tel:${esc(nap.phone ?? "")}">اتصل على <bdi dir="ltr">${esc(nap.phone ?? need("الهاتف"))}</bdi></a>\n      </section>`;

  if (page.type === "home") {
    const list = clusters.map((p) => `        <li><a href="${pathFor(p, lang)}">${esc(t(p.navLabel, lang, t(p.title, lang, p.path)).split(" | ")[0])}</a> — ${need(fr ? "une phrase: pour qui, résultat" : "جملة: لمن، النتيجة")}</li>`).join("\n");
    return fr ? `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${esc(t(cfg.category?.sentence, lang, `${B} est ${S} pour ${need("type de client")} à ${C}.`))} ${need("ce que fait le service en une proposition")}. ${need("un chiffre daté et sourcé")}.</p>
      <figure>
        <img src="/img/hero-${slug(C)}.webp" srcset="/img/hero-${slug(C)}-480.webp 480w, /img/hero-${slug(C)}-800.webp 800w, /img/hero-${slug(C)}.webp 1200w" sizes="(max-width: 68ch) 100vw, 68ch" alt="${need("description factuelle de la photo")}" width="1200" height="800" fetchpriority="high">
        <figcaption>${need("légende: lieu, date")}</figcaption>
      </figure>
      <h2>Que propose ${esc(B)} à ${esc(C)} ?</h2>
      <p>${need("réponse directe en 2 phrases")}</p>
      <ul>
${list}
      </ul>
      <h2>Pourquoi choisir ${esc(B)} ?</h2>
      <p data-fact="${need("id")}">${need("preuve chiffrée, année, source")}. <q>${need("citation d'un client ou du fondateur")}</q>, ${esc(fname)}, ${esc(frole)}.</p>
      <section aria-labelledby="chiffres">
        <h2 id="chiffres">${esc(B)} en chiffres</h2>
        <ul class="facts">
          <li data-fact="${need("id")}">${need("fait 1")}</li>
          <li data-fact="${need("id")}">${need("fait 2")}</li>
          <li data-fact="${need("id")}">${need("fait 3")}</li>
          <li data-fact="${need("id")}">${need("fait 4")}</li>
          <li data-fact="${need("id")}">${need("fait 5")}</li>
        </ul>
      </section>
      <p>Tout savoir sur <a href="${pillar ? pathFor(pillar, lang) : "/"}">${esc(S)} à ${esc(C)}</a>.</p>
${cta}
${author}
    </article>` : `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${esc(t(cfg.category?.sentence, lang, `${B} ${S} في ${C}.`))} ${need("ما تفعله الخدمة")}. ${need("رقم مؤرخ وموثق")}.</p>
      <figure>
        <img src="/img/hero-${slug(t(cfg.category?.city, defLang, C))}.webp" srcset="/img/hero-${slug(t(cfg.category?.city, defLang, C))}-480.webp 480w, /img/hero-${slug(t(cfg.category?.city, defLang, C))}-800.webp 800w, /img/hero-${slug(t(cfg.category?.city, defLang, C))}.webp 1200w" sizes="(max-width: 68ch) 100vw, 68ch" alt="${need("وصف واقعي للصورة")}" width="1200" height="800" fetchpriority="high">
        <figcaption>${need("تعليق: المكان، التاريخ")}</figcaption>
      </figure>
      <h2>ماذا يقدم ${esc(B)} في ${esc(C)}؟</h2>
      <p>${need("جواب مباشر في جملتين")}</p>
      <ul>
${list}
      </ul>
      <h2>لماذا تختار ${esc(B)}؟</h2>
      <p data-fact="${need("id")}">${need("دليل رقمي، السنة، المصدر")}. <q>${need("اقتباس زبون أو المؤسس")}</q>، ${esc(fname)}، ${esc(frole)}.</p>
      <section aria-labelledby="chiffres">
        <h2 id="chiffres">${esc(B)} بالأرقام</h2>
        <ul class="facts">
          <li data-fact="${need("id")}">${need("حقيقة 1")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 2")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 3")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 4")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 5")}</li>
        </ul>
      </section>
      <p>كل ما تحتاج معرفته عن <a href="${pillar ? pathFor(pillar, lang) : homeFor(lang)}">${esc(S)} في ${esc(C)}</a>.</p>
${cta}
${author}
    </article>`;
  }
  if (page.type === "about") {
    return fr ? `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${esc(t(cfg.category?.sentence, lang, `${B} est ${S} pour ${need("type de client")} à ${C}.`))} Fondée en ${esc(cfg.brand?.founded || need("année"))} par <a href="${furl}">${esc(fname)}</a>, ${need("nombre de clients ou projets, année, source")}.</p>
      <h2>Que fait ${esc(B)}, pour qui, où ?</h2>
      <p>${need("services, clients servis, zones — faits et dates")}</p>
      <h2>Qui dirige ${esc(B)} ?</h2>
      <p>${need("fondateur/équipe: parcours, expérience de première main dans la catégorie, diplômes")} <q>${need("citation du fondateur")}</q>, ${esc(fname)}, ${esc(frole)}.</p>
      <h2>Quels résultats ${esc(B)} peut-elle prouver ?</h2>
      <p data-fact="${need("id")}">${need("résultats mesurés, méthode, période")}</p>
      <section aria-labelledby="chiffres">
        <h2 id="chiffres">${esc(B)} en chiffres</h2>
        <ul class="facts">
          <li data-fact="${need("id")}">${need("fait 1 (année de création, source)")}</li>
          <li data-fact="${need("id")}">${need("fait 2 (clients/projets)")}</li>
          <li data-fact="${need("id")}">${need("fait 3 (zones, équipe)")}</li>
          <li data-fact="${need("id")}">${need("fait 4 (résultat)")}</li>
          <li data-fact="${need("id")}">${need("fait 5 (identifiant public: RC/ICE)")}</li>
        </ul>
      </section>
      <section aria-labelledby="ils-en-parlent">
        <h2 id="ils-en-parlent">Qui parle de ${esc(B)} ?</h2>
        <p>Mentions et citations publiques (médias, annuaires, listicles, vidéos) — la preuve que les moteurs recoupent (Layer 15) :</p>
        <ul class="mentions">
          <li>${need("média ou site 1 — titre de l'article, date, lien")}</li>
          <li>${need("média ou site 2 — titre, date, lien")}</li>
          <li>${need("annuaire ou listicle 3 — titre, date, lien")}</li>
        </ul>
      </section>
      <h2>Comment contacter ${esc(B)} ?</h2>
      <p>${esc(nap.street || need("adresse"))}, ${esc(nap.postalCode || "")} ${esc(nap.city || C)}. <a href="tel:${esc(nap.phone ?? "")}"><bdi dir="ltr">${esc(nap.phone || need("téléphone"))}</bdi></a> · <a href="https://wa.me/${wa}">WhatsApp</a> · <a href="mailto:${esc(nap.email ?? "")}">${esc(nap.email || need("e-mail"))}</a>. Horaires : ${need("horaires")}.</p>
${author}
    </article>` : `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${esc(t(cfg.category?.sentence, lang, `${B} ${S} في ${C}.`))} تأسست سنة ${esc(cfg.brand?.founded || need("السنة"))} على يد <a href="${furl}">${esc(fname)}</a>، ${need("عدد الزبناء أو المشاريع، السنة، المصدر")}.</p>
      <h2>ماذا يقدم ${esc(B)}، لمن، وأين؟</h2>
      <p>${need("الخدمات، الزبناء، المناطق — وقائع وتواريخ")}</p>
      <h2>من يدير ${esc(B)}؟</h2>
      <p>${need("المؤسس/الفريق: المسار، الخبرة المباشرة في المجال، الشهادات")} <q>${need("اقتباس المؤسس")}</q>، ${esc(fname)}، ${esc(frole)}.</p>
      <h2>ما النتائج التي يمكن لـ${esc(B)} إثباتها؟</h2>
      <p data-fact="${need("id")}">${need("نتائج مقاسة، الطريقة، الفترة")}</p>
      <section aria-labelledby="chiffres">
        <h2 id="chiffres">${esc(B)} بالأرقام</h2>
        <ul class="facts">
          <li data-fact="${need("id")}">${need("حقيقة 1")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 2")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 3")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 4")}</li>
          <li data-fact="${need("id")}">${need("حقيقة 5")}</li>
        </ul>
      </section>
      <section aria-labelledby="ils-en-parlent">
        <h2 id="ils-en-parlent">من يتحدث عن ${esc(B)}؟</h2>
        <p>إشارات واقتباسات عامة (إعلام، أدلة، قوائم، فيديوهات) — الدليل الذي تتحقق منه المحركات:</p>
        <ul class="mentions">
          <li>${need("وسيلة إعلام أو موقع 1 — العنوان، التاريخ، الرابط")}</li>
          <li>${need("وسيلة إعلام أو موقع 2 — العنوان، التاريخ، الرابط")}</li>
          <li>${need("دليل أو قائمة 3 — العنوان، التاريخ، الرابط")}</li>
        </ul>
      </section>
      <h2>كيف تتواصل مع ${esc(B)}؟</h2>
      <p>${esc(nap.street || need("العنوان"))}، ${esc(nap.postalCode || "")} ${esc(nap.city || C)}. <a href="tel:${esc(nap.phone ?? "")}"><bdi dir="ltr">${esc(nap.phone || need("الهاتف"))}</bdi></a> · <a href="https://wa.me/${wa}">واتساب</a> · <a href="mailto:${esc(nap.email ?? "")}"><bdi dir="ltr">${esc(nap.email || need("البريد"))}</bdi></a>. ساعات العمل: ${need("الساعات")}.</p>
${author}
    </article>`;
  }
  if (page.type === "comparison") {
    // Layer 14.5 / 16.2: the honest comparison — named competitors, one criteria table (≤ 5 columns), our verdict per use case, sources dated.
    // Nominative-use rules: published facts only (prices, options, hours as each actor publishes them, with page + date), no invented weaknesses,
    // no competitor trademark in the URL or title as bait, rel="nofollow" on the pages cited.
    return fr ? `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${need("réponse directe : pour quel client quelle offre convient, en 40–60 mots, avec un chiffre daté")}</p>
      <h2>Quels critères comptent pour choisir ${esc(S)} à ${esc(C)} ?</h2>
      <ol>
        <li>${need("critère 1 (prix, avec unité)")}</li>
        <li>${need("critère 2 (délai / disponibilité)")}</li>
        <li>${need("critère 3 (garantie, conditions, documents)")}</li>
        <li>${need("critère 4 (avis vérifiables)")}</li>
        <li>${need("critère 5 (couverture, zones, horaires)")}</li>
      </ol>
      <h2>Comparatif ${esc(S)} à ${esc(C)} (${need("mois année du relevé")})</h2>
      <table>
        <caption>Comparaison relevée le ${need("date")} sur les pages publiques de chaque acteur (source citée par ligne)</caption>
        <thead><tr><th scope="col">Offre</th><th scope="col">${need("critère 1")}</th><th scope="col">${need("critère 2")}</th><th scope="col">${need("critère 3")}</th><th scope="col">Source</th></tr></thead>
        <tbody>
          <tr><th scope="row">${esc(B)}</th><td data-fact="${need("id")}">${need("valeur")}</td><td data-fact="${need("id")}">${need("valeur")}</td><td data-fact="${need("id")}">${need("valeur")}</td><td>cette page, ${need("date")}</td></tr>
          <tr><th scope="row">${need("concurrent 1 (nom public)")}</th><td>${need("valeur relevée")}</td><td>${need("valeur relevée")}</td><td>${need("valeur relevée")}</td><td><a href="${need("URL de la page relevée")}" rel="nofollow">page relevée</a>, ${need("date")}</td></tr>
          <tr><th scope="row">${need("concurrent 2")}</th><td>${need("valeur relevée")}</td><td>${need("valeur relevée")}</td><td>${need("valeur relevée")}</td><td><a href="${need("URL")}" rel="nofollow">page relevée</a>, ${need("date")}</td></tr>
          <tr><th scope="row">${need("concurrent 3")}</th><td>${need("valeur relevée")}</td><td>${need("valeur relevée")}</td><td>${need("valeur relevée")}</td><td><a href="${need("URL")}" rel="nofollow">page relevée</a>, ${need("date")}</td></tr>
        </tbody>
      </table>
      <h2>Quelle offre pour quel besoin ?</h2>
      <p>${need("verdict honnête par cas d'usage : quand un concurrent est le meilleur choix, le dire — c'est ce qui fait citer la page")}</p>
      <h2>Comment ce comparatif a-t-il été fait ?</h2>
      <p>${need("méthode : pages relevées, date, ce qui n'a pas pu être vérifié, mise à jour prévue")} Les marques citées appartiennent à leurs propriétaires ; les chiffres sont ceux publiés par chaque acteur à la date indiquée.</p>
${author}
    </article>` : `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${need("جواب مباشر: أي عرض يناسب أي زبون، في 40–60 كلمة، مع رقم مؤرخ")}</p>
      <h2>ما المعايير المهمة لاختيار ${esc(S)} في ${esc(C)}؟</h2>
      <ol>
        <li>${need("المعيار 1 (السعر بالوحدة)")}</li>
        <li>${need("المعيار 2 (المدة / التوفر)")}</li>
        <li>${need("المعيار 3 (الضمان، الشروط، الوثائق)")}</li>
        <li>${need("المعيار 4 (آراء يمكن التحقق منها)")}</li>
        <li>${need("المعيار 5 (التغطية، المناطق، الساعات)")}</li>
      </ol>
      <h2>مقارنة ${esc(S)} في ${esc(C)} (${need("شهر وسنة الرصد")})</h2>
      <table>
        <caption>مقارنة مرصودة بتاريخ ${need("التاريخ")} من الصفحات العمومية لكل فاعل (المصدر في كل سطر)</caption>
        <thead><tr><th scope="col">العرض</th><th scope="col">${need("المعيار 1")}</th><th scope="col">${need("المعيار 2")}</th><th scope="col">${need("المعيار 3")}</th><th scope="col">المصدر</th></tr></thead>
        <tbody>
          <tr><th scope="row">${esc(B)}</th><td data-fact="${need("id")}">${need("القيمة")}</td><td data-fact="${need("id")}">${need("القيمة")}</td><td data-fact="${need("id")}">${need("القيمة")}</td><td>هذه الصفحة، ${need("التاريخ")}</td></tr>
          <tr><th scope="row">${need("المنافس 1 (الاسم العمومي)")}</th><td>${need("القيمة المرصودة")}</td><td>${need("القيمة المرصودة")}</td><td>${need("القيمة المرصودة")}</td><td><a href="${need("رابط الصفحة")}" rel="nofollow">الصفحة المرصودة</a>، ${need("التاريخ")}</td></tr>
          <tr><th scope="row">${need("المنافس 2")}</th><td>${need("القيمة المرصودة")}</td><td>${need("القيمة المرصودة")}</td><td>${need("القيمة المرصودة")}</td><td><a href="${need("الرابط")}" rel="nofollow">الصفحة المرصودة</a>، ${need("التاريخ")}</td></tr>
        </tbody>
      </table>
      <h2>أي عرض لأي حاجة؟</h2>
      <p>${need("حكم صادق حسب حالة الاستعمال: عندما يكون المنافس الخيار الأفضل، يُقال — هذا ما يجعل الصفحة تُستشهد بها")}</p>
      <h2>كيف أُنجزت هذه المقارنة؟</h2>
      <p>${need("الطريقة: الصفحات المرصودة، التاريخ، ما تعذر التحقق منه، موعد التحديث")} العلامات المذكورة ملك لأصحابها؛ الأرقام هي المنشورة من طرف كل فاعل في التاريخ المذكور.</p>
${author}
    </article>`;
  }
  if (page.type === "person") {
    return fr ? `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${esc(fname)} est ${esc(frole)} de ${esc(B)}, ${esc(S)} à ${esc(C)}. ${need("expérience de première main: depuis quand, combien de clients/projets, formation")}.</p>
      <figure>
        <img src="/img/${slug(fname)}.webp" alt="${esc(fname)}, ${esc(frole)} de ${esc(B)}" width="800" height="800" loading="lazy">
        <figcaption>${esc(fname)}, ${esc(C)}, ${need("année")}.</figcaption>
      </figure>
      <h2>Quel est le parcours de ${esc(fname)} ?</h2>
      <p>${need("étapes datées, diplômes, employeurs précédents")}</p>
      <h2>Sur quoi ${esc(fname)} s'exprime-t-il ?</h2>
      <p>${need("sujets d'expertise, interventions, publications")} <q>${need("citation")}</q>, ${esc(fname)}.</p>
      <p>Profils : ${need("LinkedIn, YouTube (liens sameAs)")}.</p>
${author}
    </article>` : `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer" data-fact="${need("id")}">${esc(fname)} هو ${esc(frole)} في ${esc(B)}، ${esc(S)} في ${esc(C)}. ${need("الخبرة المباشرة: منذ متى، كم زبوناً/مشروعاً، التكوين")}.</p>
      <figure>
        <img src="/img/${slug(founder.name || "fondateur")}.webp" alt="${esc(fname)}، ${esc(frole)} في ${esc(B)}" width="800" height="800" loading="lazy">
        <figcaption>${esc(fname)}، ${esc(C)}، ${need("السنة")}.</figcaption>
      </figure>
      <h2>ما مسار ${esc(fname)}؟</h2>
      <p>${need("محطات مؤرخة، شهادات، أعمال سابقة")}</p>
      <h2>فيمَ يتحدث ${esc(fname)}؟</h2>
      <p>${need("مواضيع الخبرة، المداخلات، المنشورات")} <q>${need("اقتباس")}</q>، ${esc(fname)}.</p>
      <p>الحسابات: ${need("LinkedIn، YouTube")}.</p>
${author}
    </article>`;
  }
  if (page.type === "contact") {
    const hours = (cfg.hours ?? []).map((h) => `<li>${esc(Array.isArray(h.days) ? h.days.join(", ") : h.days)} : ${esc(h.opens)}–${esc(h.closes)}</li>`).join("\n          ");
    return fr ? `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer">${esc(B)}, ${esc(S)} à ${esc(C)} : réponse par WhatsApp sous ${need("délai")}, par téléphone au <bdi dir="ltr">${esc(nap.phone || need("téléphone"))}</bdi> aux heures d'ouverture, ou par e-mail. Adresse : ${esc(nap.street || need("adresse"))}, ${esc(nap.postalCode || "")} ${esc(nap.city || C)}.</p>
      <h2>Comment joindre ${esc(B)} ?</h2>
      <ul>
        <li><a class="cta" href="https://wa.me/${wa}?text=Bonjour%20${encodeURIComponent(B)}">Écrire sur WhatsApp</a></li>
        <li>Téléphone : <a href="tel:${esc(nap.phone ?? "")}"><bdi dir="ltr">${esc(nap.phone || need("téléphone"))}</bdi></a></li>
        <li>E-mail : <a href="mailto:${esc(nap.email ?? "")}">${esc(nap.email || need("e-mail"))}</a></li>
      </ul>
      <h2>Où se trouve ${esc(B)} ?</h2>
      <p>${esc(nap.street || need("adresse"))}, ${esc(nap.postalCode || "")} ${esc(nap.city || C)}. ${need("repère connu: « en face de … »")}. <a href="${esc(cfg.mapsUrl || need("lien Google Maps"))}">Itinéraire sur Google Maps</a>. Parking : ${need("parking")}.</p>
      <h2>Quels sont les horaires ?</h2>
      <ul>
          ${hours || `<li>${need("horaires")}</li>`}
      </ul>
      <h2>Demander un devis</h2>
      <form method="post" action="${need("URL du traitement du formulaire")}">
        <p><label for="nom">Nom</label> <input id="nom" name="nom" type="text" autocomplete="name" required></p>
        <p><label for="tel">Téléphone (WhatsApp)</label> <input id="tel" name="tel" type="tel" autocomplete="tel" required></p>
        <p><label for="besoin">Votre besoin</label> <textarea id="besoin" name="besoin" rows="4" required></textarea></p>
        <p><button type="submit" class="cta">Envoyer</button></p>
        <p class="consent" data-nosnippet>Vos données servent uniquement à répondre à votre demande (loi 09-08). <a href="/confidentialite/">Politique de confidentialité</a>.</p>
      </form>
    </article>` : `    <article>
      <h1>${esc(h1)}</h1>
      <p class="answer">${esc(B)}، ${esc(S)} في ${esc(C)}: الرد عبر واتساب خلال ${need("المدة")}، أو بالهاتف على <bdi dir="ltr">${esc(nap.phone || need("الهاتف"))}</bdi> في ساعات العمل، أو بالبريد الإلكتروني. العنوان: ${esc(nap.street || need("العنوان"))}، ${esc(nap.postalCode || "")} ${esc(nap.city || C)}.</p>
      <h2>كيف تتواصل مع ${esc(B)}؟</h2>
      <ul>
        <li><a class="cta" href="https://wa.me/${wa}?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85">راسلنا على واتساب</a></li>
        <li>الهاتف: <a href="tel:${esc(nap.phone ?? "")}"><bdi dir="ltr">${esc(nap.phone || need("الهاتف"))}</bdi></a></li>
        <li>البريد: <a href="mailto:${esc(nap.email ?? "")}"><bdi dir="ltr">${esc(nap.email || need("البريد"))}</bdi></a></li>
      </ul>
      <h2>أين يوجد ${esc(B)}؟</h2>
      <p>${esc(nap.street || need("العنوان"))}، ${esc(nap.postalCode || "")} ${esc(nap.city || C)}. ${need("معلم معروف: «قبالة …»")}. <a href="${esc(cfg.mapsUrl || need("رابط خرائط Google"))}">الاتجاهات على خرائط Google</a>. موقف السيارات: ${need("الموقف")}.</p>
      <h2>ما ساعات العمل؟</h2>
      <ul>
          ${hours || `<li>${need("الساعات")}</li>`}
      </ul>
      <h2>اطلب عرض سعر</h2>
      <form method="post" action="${need("رابط معالجة النموذج")}">
        <p><label for="nom">الاسم</label> <input id="nom" name="nom" type="text" autocomplete="name" required></p>
        <p><label for="tel">الهاتف (واتساب)</label> <input id="tel" name="tel" type="tel" autocomplete="tel" required dir="ltr"></p>
        <p><label for="besoin">طلبكم</label> <textarea id="besoin" name="besoin" rows="4" required></textarea></p>
        <p><button type="submit" class="cta">إرسال</button></p>
        <p class="consent" data-nosnippet>تُستعمل بياناتكم فقط للرد على طلبكم (القانون 09-08). <a href="/confidentialite/">سياسة الخصوصية</a>.</p>
      </form>
    </article>`;
  }
  return null; // pillar / cluster / service / city / content: keep the template's article
}
function slug(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

// ---------- assemble ----------
let written = 0, kept = 0;
for (const page of cfg.pages ?? []) {
  if (page.type === "legal") continue; // legal pages come from assets/legal via init.mjs
  for (const lang of langs) {
    const path = pathFor(page, lang);
    if (!path || (args.only && args.only !== path)) continue;
    const file = pathToFile(root, path);
    if (existsSync(file) && !args.force) { kept++; continue; }
    let html = loadTemplate(lang);
    const title = t(page.title, lang, path);
    const h1 = t(page.h1, lang, title.split(" | ")[0]);
    const desc = t(page.description, lang, need(lang === "ar" ? "وصف 140-160 حرفاً بالخدمة والمدينة ورقم موثق" : "meta description 140-160 caractères avec le service, la ville et un chiffre sourcé"));
    const url = `${site}${path}`;
    const locale = `${lang}_MA`;
    // head
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);
    html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
    html = html.replace(/(\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">)+/, `\n${hreflangBlock(page, lang)}`);
    html = html.replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${locale}">`);
    html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
    html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
    html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(t(page.description, lang, need(lang === "ar" ? "نفس الوعد في جملة واحدة" : "même promesse que la meta description, 1 phrase")))}">`);
    // JSON-LD
    const graph = JSON.stringify(pageGraph(cfg, path, { lang, type: page.type }), null, 2);
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${graph}\n  </script>`);
    // nav + switcher (header)
    html = html.replace(/(<nav aria-label="(?:Principal|القائمة الرئيسية|Main)">)[\s\S]*?(<\/nav>)/, `$1\n${navHtml(lang)}\n${switcherLinks(page, lang)}\n    $2`);
    // footer switcher links
    html = html.replace(/<a href="[^"]*" hreflang="([a-z]{2}-[A-Z]{2})" lang="([a-z]{2})">([^<]*)<\/a>/g, (m, hl, l, text) => (langs.includes(l) && l !== lang && text.trim() === (lbl(lang).switch[l] ?? "") ? `<a href="${pathFor(page, l) ?? homeFor(l)}" hreflang="${hl}" lang="${l}">${text}</a>` : m));
    html = html.replace(/\s*<!-- JSON-LD:[^>]*-->/, "");
    // breadcrumb + h1
    html = html.replace(/<li aria-current="page">[^<]*<\/li>/, `<li aria-current="page">${esc(h1)}</li>`);
    html = html.replace(/<li><a href="\/(?:ar\/)?">[^<]*<\/a><\/li>/, `<li><a href="${homeFor(lang)}">${lbl(lang).home}</a></li>`);
    if (page.type === "home") html = html.replace(/<nav aria-label="(?:Fil d'Ariane|مسار التصفح|Breadcrumb)" class="breadcrumb">[\s\S]*?<\/nav>\n?/, "");
    html = html.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(h1)}</h1>`);
    // kind-specific body
    const body = bodyFor(page, lang, h1);
    if (body) html = html.replace(/<article>[\s\S]*<\/article>/, body.trim());
    if (args["dry-run"]) { console.log(`--- ${path} (${lang}) ---`); continue; }
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    written++;
    console.log(`wrote ${file}`);
  }
}
console.log(`\n${written} page(s) written, ${kept} kept (use --force to overwrite). Next: write the content in place of every [[FACT NEEDED]] from facts.json, then npm run gate.`);
