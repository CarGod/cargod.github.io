import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(process.env.OUT_DIR || path.join(ROOT, "_site"));
const SITE_URL = "https://luffyliu.com";
const MAX_BYTES = 850 * 1024 * 1024;
const errors = [];
const warnings = [];
const htmlByUrl = new Map();
const files = [];

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (entry.isFile()) files.push(target);
    else errors.push(`Artifact must not contain links: ${path.relative(OUT, target)}`);
  }
}

const routeFor = (file) => {
  const relative = path.relative(OUT, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -10)}`;
  return `/${relative}`;
};
const fileForUrl = (raw, current = "/") => {
  let url;
  try { url = new URL(raw, `${SITE_URL}${current}`); } catch { return null; }
  if (url.origin !== SITE_URL) return null;
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) return path.join(OUT, pathname.slice(1), "index.html");
  return path.join(OUT, pathname.slice(1));
};
const matches = (html, regex) => [...html.matchAll(regex)];
const HEADER_LOCALES = {
  "zh-CN": { prefix: "", codes: ["zh-CN", "zh-TW", "en", "ja", "ko", "es"] },
  "zh-TW": { prefix: "/zh-tw", codes: ["zh-CN", "zh-TW", "en", "ja", "ko", "es"] },
  en: { prefix: "/en", codes: ["zh-CN", "zh-TW", "en", "ja", "ko", "es"] },
  ja: { prefix: "/ja", codes: ["zh-CN", "zh-TW", "en", "ja", "ko", "es"] },
  ko: { prefix: "/ko", codes: ["zh-CN", "zh-TW", "en", "ja", "ko", "es"] },
  es: { prefix: "/es", codes: ["zh-CN", "zh-TW", "en", "ja", "ko", "es"] }
};

await walk(OUT);
for (const file of files.filter((item) => item.endsWith(".html"))) {
  const route = routeFor(file);
  const html = await fs.readFile(file, "utf8");
  htmlByUrl.set(`${SITE_URL}${route}`, { file, route, html });
  if (route === "/404.html" || route === "/baidu_verify_codeva-6mj6cMYHtH.html") continue;
  if (/<meta[^>]+http-equiv=["']?refresh/i.test(html)) continue;
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const titles = matches(html, /<title>[^<]+<\/title>/gi);
  const h1s = matches(html, /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/gi);
  const canonicals = matches(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/gi);
  const descriptions = matches(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/gi);
  if (titles.length !== 1) errors.push(`${route}: expected one title, got ${titles.length}`);
  const titleText = titles[0]?.[0].replace(/<[^>]+>/g, "") || "";
  const titleLimit = /^(?:zh|ja|ko)/i.test(html.match(/<html[^>]+lang=["']([^"']+)/i)?.[1] || "") ? 60 : 65;
  if (titleText.length > titleLimit) warnings.push(`${route}: title length ${titleText.length} exceeds ${titleLimit}-character review threshold`);
  if (h1s.length !== 1) errors.push(`${route}: expected one H1, got ${h1s.length}`);
  if (!noindex && canonicals.length !== 1) errors.push(`${route}: expected one canonical, got ${canonicals.length}`);
  if (!descriptions.length) errors.push(`${route}: missing description`);
  if (canonicals[0]?.[1] !== `${SITE_URL}${route}`) errors.push(`${route}: canonical is not self-referencing (${canonicals[0]?.[1] || "missing"})`);
  for (const block of matches(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch (error) { errors.push(`${route}: invalid JSON-LD (${error.message})`); }
  }
  for (const match of matches(html, /<(?:a|link|img|script)[^>]+(?:href|src)=["']([^"']+)["']/gi)) {
    const value = match[1];
    if (/^(?:#|mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    const target = fileForUrl(value, route);
    if (target && !await fs.stat(target).then((stat) => stat.isFile()).catch(() => false)) errors.push(`${route}: broken local reference ${value}`);
  }
  const alternates = Object.fromEntries(matches(html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)/gi).map((item) => [item[1], item[2]]));
  const locale = html.match(/<html[^>]+lang=["']([^"']+)/i)?.[1];
  if (Object.keys(alternates).length) {
    if (!alternates[locale]) errors.push(`${route}: hreflang is missing self locale ${locale}`);
    if (alternates["zh-CN"] && alternates["x-default"] !== alternates["zh-CN"]) errors.push(`${route}: x-default must point to zh-CN`);
  }
  if (route.match(/^\/(?:en|ja|ko|es|zh-tw)\/(?:blog|tutorials)\/.+\/$/)) {
    const body = html.match(/<article[^>]+data-pagefind-body[\s\S]*?<\/article>/i)?.[0] || "";
    if (/href=["']\/(?:blog|tutorials)\//i.test(body)) errors.push(`${route}: localized body links to the zh-CN content route`);
  }
  const article = html.match(/<article[^>]+data-pagefind-body[\s\S]*?<\/article>/i)?.[0];
  if (article) {
    if (!/<div[^>]+class=["'][^"']*author-card[^"']*["'][^>]+data-pagefind-ignore(?:\s|=|>)/i.test(article)) errors.push(`${route}: repeated author boilerplate must be excluded from Pagefind`);
    const proseOutsideCode = article
      .replace(/<pre\b[\s\S]*?<\/pre>/gi, "")
      .replace(/<code\b[\s\S]*?<\/code>/gi, "");
    if (/\*\*[^*\n]+\*\*/.test(proseOutsideCode)) errors.push(`${route}: rendered article leaks strong Markdown syntax`);
    if (/__[^_\n]+__/.test(proseOutsideCode)) errors.push(`${route}: rendered article leaks underscore strong Markdown syntax`);
    if (/(?<!\*)\*(?!\*)[^*\n]+(?<!\s)\*(?!\*)/.test(proseOutsideCode)) errors.push(`${route}: rendered article leaks emphasis Markdown syntax`);
    if (/(?<!`)`{1,2}[^`\n]+`{1,2}(?!`)/.test(proseOutsideCode)) errors.push(`${route}: rendered article leaks inline-code Markdown syntax`);
    if (/(?<!!)\[[^\]\n]+\]\([^)\n]+\)/.test(proseOutsideCode)) errors.push(`${route}: rendered article leaks link Markdown syntax`);
  }
}

for (const [url, page] of htmlByUrl) {
  const alternates = matches(page.html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)/gi);
  for (const [, locale, peerUrl] of alternates) {
    if (locale === "x-default") continue;
    const peer = htmlByUrl.get(peerUrl);
    if (!peer) { errors.push(`${page.route}: hreflang target missing ${peerUrl}`); continue; }
    const reciprocal = matches(peer.html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]+href=["']([^"']+)/gi).some((item) => item[1] === url);
    if (!reciprocal) errors.push(`${page.route}: hreflang target does not link back (${peerUrl})`);
  }
}

for (const page of htmlByUrl.values()) {
  const headerMatch = page.html.match(/<header[^>]+class=["'][^"']*site-header[^"']*["'][^>]*>[\s\S]*?<\/header>/i);
  if (!headerMatch) continue;
  const header = headerMatch[0];
  const htmlLocale = page.html.match(/<html[^>]+lang=["']([^"']+)/i)?.[1];
  const config = HEADER_LOCALES[htmlLocale];
  if (!config) { errors.push(`${page.route}: site header uses an unsupported locale ${htmlLocale || "missing"}`); continue; }
  if (!/<header[^>]+data-pagefind-ignore(?:\s|=|>)/i.test(header)) errors.push(`${page.route}: site header must be excluded from Pagefind`);
  const brand = header.match(/<a[^>]+class=["'][^"']*wordmark[^"']*["'][^>]*>[\s\S]*?<\/a>/i)?.[0] || "";
  if (!new RegExp(`href=["']${(config.prefix || "") + "/"}["']`, "i").test(brand)) errors.push(`${page.route}: wordmark does not link to its locale home`);
  if (!/<img[^>]+class=["'][^"']*wordmark-avatar[^"']*["'][^>]+src=["']\/assets\/luffy-avatar\.png["']/i.test(brand) || !/<span>Luffy Liu<\/span>/i.test(brand)) errors.push(`${page.route}: site header brand is inconsistent`);

  const nav = header.match(/<nav[^>]+class=["'][^"']*content-nav[^"']*["'][^>]*>[\s\S]*?<\/nav>/i)?.[0] || "";
  if (!nav) { errors.push(`${page.route}: site header is missing the shared content navigation`); continue; }
  const languageStart = nav.search(/<div[^>]+class=["'][^"']*language-switch-six[^"']*["']/i);
  if (languageStart < 0) { errors.push(`${page.route}: site header is missing the six-language switch`); continue; }
  const primary = nav.slice(0, languageStart);
  const primaryHrefs = matches(primary, /<a[^>]+href=["']([^"']+)["']/gi).map((match) => match[1]);
  const expectedHrefs = [`${config.prefix}/`, `${config.prefix}/tutorials/`, `${config.prefix}/blog/`, `${config.prefix}/blog/search/`, "https://github.com/CarGod"];
  if (JSON.stringify(primaryHrefs) !== JSON.stringify(expectedHrefs)) errors.push(`${page.route}: header navigation order differs (${primaryHrefs.join(" | ")})`);

  const github = primary.match(/<a[^>]+class=["'][^"']*nav-github[^"']*["'][^>]*>[\s\S]*?<\/a>/i)?.[0] || "";
  if (!/href=["']https:\/\/github\.com\/CarGod["']/i.test(github)) errors.push(`${page.route}: GitHub control must link to the profile`);
  if (!/aria-label=["'][^"']+["']/i.test(github) || !/title=["'][^"']+["']/i.test(github)) errors.push(`${page.route}: GitHub icon control needs an accessible name and title`);
  if (!/<img[^>]+src=["']\/assets\/icons\/github-mark\.svg["'][^>]+alt=["']["'][^>]*>/i.test(github)) errors.push(`${page.route}: GitHub control must use the local decorative mark`);
  if (github.replace(/<img\b[^>]*>/gi, "").replace(/<[^>]+>/g, "").trim()) errors.push(`${page.route}: GitHub icon control must not expose a text label`);

  const language = nav.slice(languageStart);
  const codes = matches(language, /<a[^>]+data-language=["']([^"']+)["']/gi).map((match) => match[1]);
  if (JSON.stringify(codes) !== JSON.stringify(config.codes)) errors.push(`${page.route}: language switch order differs (${codes.join(" | ")})`);
  const currentLanguage = matches(language, /<a[^>]+data-language=["']([^"']+)["'][^>]*aria-current=["']page["'][^>]*>|<a[^>]+aria-current=["']page["'][^>]*data-language=["']([^"']+)["'][^>]*>/gi).map((match) => match[1] || match[2]);
  if (currentLanguage.length !== 1 || currentLanguage[0] !== htmlLocale) errors.push(`${page.route}: language switch must identify ${htmlLocale} as current`);

  const mobileNav = page.html.match(/<nav[^>]+class=["'][^"']*mobile-content-nav[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || "";
  const mobileHrefs = matches(mobileNav, /<a[^>]+href=["']([^"']+)["']/gi).map((match) => match[1]);
  const expectedMobile = [`${config.prefix}/tutorials/`, `${config.prefix}/blog/`, `${config.prefix}/blog/search/`];
  if (JSON.stringify(mobileHrefs) !== JSON.stringify(expectedMobile)) errors.push(`${page.route}: mobile navigation order differs (${mobileHrefs.join(" | ")})`);
}

for (const route of ["/", "/zh-tw/", "/en/", "/ja/", "/ko/", "/es/"]) {
  const page = htmlByUrl.get(`${SITE_URL}${route}`);
  if (!page) { errors.push(`Missing locale home ${route}`); continue; }
  const homeAlternates = Object.fromEntries(matches(page.html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)/gi).map((item) => [item[1], item[2]]));
  for (const locale of ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "x-default"]) if (!homeAlternates[locale]) errors.push(`${route}: missing homepage hreflang ${locale}`);
  if (matches(page.html, /<a[^>]+data-language=["'](?:zh-CN|zh-TW|en|ja|ko|es)["']/gi).length < 6) errors.push(`${route}: homepage must expose six ordinary language links`);
  const prefix = route === "/" ? "" : route.slice(0, -1);
  const mobileNav = page.html.match(/<nav[^>]+class=["'][^"']*mobile-content-nav[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || "";
  for (const destination of [`${prefix}/tutorials/`, `${prefix}/blog/`, `${prefix}/blog/search/`]) {
    if (!new RegExp(`<a[^>]+href=["']${destination.replaceAll("/", "\\/")}["']`, "i").test(mobileNav)) errors.push(`${route}: mobile content navigation is missing ${destination}`);
  }
}

for (const prefix of ["", "/zh-tw", "/en", "/ja", "/ko", "/es"]) {
  const route = `${prefix}/blog/search/`;
  const page = htmlByUrl.get(`${SITE_URL}${route}`);
  if (!page) { errors.push(`Missing localized search page ${route}`); continue; }
  const expectedAction = route;
  if (!new RegExp(`<form[^>]+id=["']blog-search-form["'][^>]+method=["']get["'][^>]+action=["']${expectedAction.replaceAll("/", "\\/")}["']`, "i").test(page.html)) errors.push(`${route}: search form needs a localized GET action`);
  for (const name of ["q", "type", "tag", "year", "sort"]) if (!new RegExp(`<(?:input|select)[^>]+name=["']${name}["']`, "i").test(page.html)) errors.push(`${route}: search form is missing ${name}`);
  if (!/<script[^>]+type=["']module["'][^>]+src=["']\/assets\/js\/search\.js["'][^>]*><\/script>/i.test(page.html)) errors.push(`${route}: search module is missing`);
  if (!/<script[^>]+type=["']application\/json["'][^>]+id=["']blog-search-config["']/i.test(page.html)) errors.push(`${route}: localized search configuration is missing`);
  if (!/<button[^>]+id=["']blog-search-more["'][^>]+hidden/i.test(page.html)) errors.push(`${route}: incremental result control is missing`);
  const noscript = page.html.match(/<noscript>([\s\S]*?)<\/noscript>/i)?.[1] || "";
  for (const destination of [`${prefix}/blog/`, `${prefix}/tutorials/`]) if (!new RegExp(`href=["']${destination.replaceAll("/", "\\/")}["']`, "i").test(noscript)) errors.push(`${route}: no-JavaScript browse link is missing ${destination}`);
  const mobileNav = page.html.match(/<nav[^>]+class=["'][^"']*mobile-content-nav[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || "";
  if (!new RegExp(`<a[^>]+href=["']${route.replaceAll("/", "\\/")}["'][^>]+aria-current=["']page["']`, "i").test(mobileNav)) errors.push(`${route}: mobile search link is not active`);
}

for (const page of htmlByUrl.values()) {
  for (const tag of matches(page.html, /<[^>]+>/g)) {
    if (matches(tag[0], /\bdata-pagefind-filter\s*=/gi).length > 1) errors.push(`${page.route}: element contains duplicate data-pagefind-filter attributes`);
  }
}

const guideSlugs = ["prompt-engineering", "first-conversation", "tokens", "probability-temperature", "clear-instructions", "structured-prompts", "json-output", "xml-delimiters", "complex-tasks"];
const expectedGuideRoutes = [];
for (const prefix of ["", "/zh-tw", "/en", "/ja", "/ko", "/es"]) {
  const listingRoute = `${prefix}/tutorials/`;
  const listing = htmlByUrl.get(`${SITE_URL}${listingRoute}`)?.html || "";
  if (!/<article[^>]+class=["'][^"']*tutorial-series[^"']*["'][^>]+data-series=["']prompt-engineering["']/i.test(listing)) errors.push(`${listingRoute}: prompt-engineering must be presented as a tutorial series`);
  const listChapterLinks = matches(listing, /<ol[^>]+class=["'][^"']*chapter-list[^"']*["'][^>]*>([\s\S]*?)<\/ol>/gi).flatMap((item) => matches(item[1], /<a[^>]+href=["']([^"']+)/gi).map((link) => link[1]));
  if (listChapterLinks.length !== guideSlugs.length) errors.push(`${listingRoute}: expected ${guideSlugs.length} ordered guide links, got ${listChapterLinks.length}`);
  for (const [index, slug] of guideSlugs.entries()) {
    const route = slug === "prompt-engineering" ? `${prefix}/tutorials/prompt-engineering/` : `${prefix}/tutorials/prompt-engineering/${slug}/`;
    expectedGuideRoutes.push(route);
    const page = htmlByUrl.get(`${SITE_URL}${route}`)?.html || "";
    if (!page) { errors.push(`Missing localized guide chapter ${route}`); continue; }
    const seriesToc = page.match(/<nav[^>]+class=["'][^"']*series-toc[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i)?.[1] || "";
    const tocLinks = matches(seriesToc, /<a[^>]+href=["']([^"']+)/gi).map((item) => item[1]);
    if (tocLinks.length !== guideSlugs.length) errors.push(`${route}: expected ${guideSlugs.length} links in the series directory, got ${tocLinks.length}`);
    if (index > 0 && !new RegExp(`<a[^>]+rel=["']prev["']`).test(page)) errors.push(`${route}: missing previous-chapter navigation`);
    if (index < guideSlugs.length - 1 && !new RegExp(`<a[^>]+rel=["']next["']`).test(page)) errors.push(`${route}: missing next-chapter navigation`);
  }
  for (const slug of guideSlugs.slice(1)) {
    const obsolete = `${prefix}/tutorials/${slug}/`;
    if (htmlByUrl.has(`${SITE_URL}${obsolete}`)) errors.push(`${obsolete}: obsolete flattened tutorial route must not be generated`);
  }
}

const rootHome = htmlByUrl.get(`${SITE_URL}/`)?.html || "";
if (/X icon by Icons8|icons8\.com\/icon/i.test(rootHome)) errors.push("/: obsolete visible Icons8 credit remains");
if (!/<a[^>]+href=["']https:\/\/x\.com\/luffyliux["'][^>]+aria-label=["'][^"']+["'][^>]*>[\s\S]*?<img[^>]+src=["']\/assets\/icons\/x-mark\.svg["'][^>]+alt=["']["']/i.test(rootHome)) {
  errors.push("/: X contact link must use the local mark and retain an accessible link name");
}

const sitemapIndex = await fs.readFile(path.join(OUT, "sitemap.xml"), "utf8").catch(() => "");
if (!/<sitemapindex[\s>]/.test(sitemapIndex)) errors.push("sitemap.xml must always be a sitemap index");
const shardUrls = matches(sitemapIndex, /<loc>([^<]+)<\/loc>/g).map((item) => item[1]);
const sitemapUrls = new Set();
for (const shardUrl of shardUrls) {
  const target = fileForUrl(shardUrl);
  const xml = target ? await fs.readFile(target, "utf8").catch(() => "") : "";
  if (!xml) { errors.push(`Missing sitemap shard ${shardUrl}`); continue; }
  const urls = matches(xml, /<url><loc>([^<]+)<\/loc>/g).map((item) => item[1]);
  if (urls.length > 5_000) errors.push(`${shardUrl}: has more than 5000 URLs`);
  for (const url of urls) {
    if (sitemapUrls.has(url)) errors.push(`Duplicate sitemap URL ${url}`);
    sitemapUrls.add(url);
    if (!htmlByUrl.has(url)) errors.push(`Sitemap URL has no HTML output: ${url}`);
    if (/noindex/i.test(htmlByUrl.get(url)?.html || "")) errors.push(`Noindex URL appears in sitemap: ${url}`);
  }
}
for (const route of expectedGuideRoutes) if (!sitemapUrls.has(`${SITE_URL}${route}`)) errors.push(`${route}: localized guide chapter is missing from sitemap`);

for (const localePath of ["index.xml", "zh-tw/index.xml", "en/index.xml", "ja/index.xml", "ko/index.xml", "es/index.xml"]) {
  const xml = await fs.readFile(path.join(OUT, localePath), "utf8").catch(() => "");
  if (!/<rss[\s>]/.test(xml) || !/<channel>/.test(xml)) errors.push(`${localePath}: invalid or missing RSS`);
  if ((xml.match(/<item>/g) || []).length > 50) errors.push(`${localePath}: RSS contains more than 50 items`);
}

for (const forbidden of ["content", "scripts", "docs", "node_modules", ".git"]) {
  if (await fs.stat(path.join(OUT, forbidden)).then(() => true).catch(() => false)) errors.push(`Forbidden artifact directory: ${forbidden}`);
}
if (!await fs.stat(path.join(OUT, "pagefind", "pagefind.js")).then(() => true).catch(() => false)) errors.push("Pagefind index is missing");
if (!await fs.stat(path.join(OUT, "assets", "js", "search.js")).then(() => true).catch(() => false)) errors.push("Search client module is missing");
if (!await fs.stat(path.join(OUT, "assets", "icons", "github-mark.svg")).then(() => true).catch(() => false)) errors.push("Local GitHub navigation mark is missing");
const baiduVerification = await fs.readFile(path.join(OUT, "baidu_verify_codeva-6mj6cMYHtH.html"), "utf8").catch(() => "");
if (baiduVerification.trim() !== "cb5eba8b8f1400766c0a5bc7e283defa") errors.push("Baidu verification file is missing or invalid");
const siteCss = await fs.readFile(path.join(OUT, "assets", "css", "site.css"), "utf8").catch(() => "");
if (!/\.site-header\s*\{[^}]*width:\s*min\(1180px,\s*calc\(100% - 48px\)\)[^}]*height:\s*84px/s.test(siteCss)) errors.push("Shared header must use the 1180px container and 84px desktop height");
if (!/\.nav-github\s*\{[^}]*width:\s*44px[^}]*height:\s*44px/s.test(siteCss)) errors.push("GitHub icon control must retain a 44px touch target");
if (!/\.nav-github\s*\{[^}]*border:\s*0[^}]*background:\s*transparent/s.test(siteCss)) errors.push("GitHub control must present only the icon without a persistent button surface");
if (!/@media\s*\(max-width:\s*860px\)[\s\S]*?\.site-header\s*\{[^}]*height:\s*72px[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s.test(siteCss)) errors.push("Responsive header/mobile navigation contract is missing");
const total = (await Promise.all(files.map((file) => fs.stat(file).then((stat) => stat.size)))).reduce((sum, size) => sum + size, 0);
if (total > MAX_BYTES) errors.push(`Artifact is ${(total / 1024 / 1024).toFixed(2)} MiB, above 850 MiB limit`);

const sourceFiles = files.length ? [] : [];
async function validateSources(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await validateSources(target);
    else if (entry.name === "index.md") sourceFiles.push(target);
  }
}
await validateSources(path.join(ROOT, "content", "blog"));
await validateSources(path.join(ROOT, "content", "tutorials"));
const contentKeys = new Set();
for (const source of sourceFiles) {
  const parsed = matter(await fs.readFile(source, "utf8"));
  const contentWithoutFences = parsed.content.replace(/(^|\n)[ \t]{0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n[ \t]{0,3}\2(?=\n|$)/g, "$1");
  if (/^#\s+/m.test(contentWithoutFences)) errors.push(`${path.relative(ROOT, source)}: body must not contain H1 outside fenced code`);
  if (/^(?:import|export)\s.+(?:from\s+)?["'][^"']+["'];?\s*$/m.test(contentWithoutFences) || /<\/?[A-Z][A-Za-z0-9_.:-]*(?:\s[^<>]*?)?\s*\/?>/.test(contentWithoutFences)) {
    errors.push(`${path.relative(ROOT, source)}: MDX imports/components must be cleaned before the content build`);
  }
  const key = `${parsed.data.locale}:${parsed.data.contentKey}`;
  if (contentKeys.has(key)) errors.push(`${path.relative(ROOT, source)}: duplicate locale + contentKey ${key}`);
  contentKeys.add(key);
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
if (warnings.length) console.warn(`Validation warnings (${warnings.length}):\n- ${warnings.join("\n- ")}`);
console.log(`Validated ${htmlByUrl.size} HTML pages, ${sitemapUrls.size} sitemap URLs, ${sourceFiles.length} source documents, ${(total / 1024 / 1024).toFixed(2)} MiB artifact.`);
