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

await walk(OUT);
for (const file of files.filter((item) => item.endsWith(".html"))) {
  const route = routeFor(file);
  const html = await fs.readFile(file, "utf8");
  htmlByUrl.set(`${SITE_URL}${route}`, { file, route, html });
  if (route === "/404.html") continue;
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

for (const route of ["/", "/zh-tw/", "/en/", "/ja/", "/ko/", "/es/"]) {
  const page = htmlByUrl.get(`${SITE_URL}${route}`);
  if (!page) { errors.push(`Missing locale home ${route}`); continue; }
  const homeAlternates = Object.fromEntries(matches(page.html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)/gi).map((item) => [item[1], item[2]]));
  for (const locale of ["zh-CN", "zh-TW", "en", "ja", "ko", "es", "x-default"]) if (!homeAlternates[locale]) errors.push(`${route}: missing homepage hreflang ${locale}`);
  if (matches(page.html, /<a[^>]+data-language=["'](?:zh-CN|zh-TW|en|ja|ko|es)["']/gi).length < 6) errors.push(`${route}: homepage must expose six ordinary language links`);
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

for (const localePath of ["index.xml", "zh-tw/index.xml", "en/index.xml", "ja/index.xml", "ko/index.xml", "es/index.xml"]) {
  const xml = await fs.readFile(path.join(OUT, localePath), "utf8").catch(() => "");
  if (!/<rss[\s>]/.test(xml) || !/<channel>/.test(xml)) errors.push(`${localePath}: invalid or missing RSS`);
  if ((xml.match(/<item>/g) || []).length > 50) errors.push(`${localePath}: RSS contains more than 50 items`);
}

for (const forbidden of ["content", "scripts", "docs", "node_modules", ".git"]) {
  if (await fs.stat(path.join(OUT, forbidden)).then(() => true).catch(() => false)) errors.push(`Forbidden artifact directory: ${forbidden}`);
}
if (!await fs.stat(path.join(OUT, "pagefind", "pagefind.js")).then(() => true).catch(() => false)) errors.push("Pagefind index is missing");
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
  if (/^#\s+/m.test(parsed.content)) errors.push(`${path.relative(ROOT, source)}: body must not contain H1`);
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
