import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { missingRequiredLiterals, validateRequiredFencedOutput } from "./lib/content-protection.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_ROOT = path.join(ROOT, "content");
const OUT = path.resolve(process.env.OUT_DIR || path.join(ROOT, "_site"));
const SOURCE_MAP = path.join(ROOT, "skills", "luffyliu-site-content-maintainer", "references", "gptpmt-source-map.yml");
const REVISION_LOG = path.join(CONTENT_ROOT, "tutorials", "prompt-engineering", "revision-log.yml");
const SITE_URL = "https://luffyliu.com";
const LOCALES = ["zh-CN", "zh-TW", "en", "ja", "ko", "es"];
const LOCALE_PREFIX = { "zh-CN": "", "zh-TW": "/zh-tw", en: "/en", ja: "/ja", ko: "/ko", es: "/es" };
const errors = [];

async function exists(target) {
  try { await fs.access(target); return true; } catch { return false; }
}

async function findMarkdown(directory) {
  const results = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await findMarkdown(target));
    else if (entry.isFile() && entry.name === "index.md") results.push(target);
  }
  return results.sort();
}

function scanMarkdown(content, relative) {
  const lines = content.split(/\r?\n/);
  const outside = [];
  const fences = [];
  let active = null;
  for (const [offset, line] of lines.entries()) {
    if (!active) {
      const opening = line.match(/^[ \t]{0,3}(`{3,}|~{3,})(.*)$/);
      if (!opening) { outside.push(line); continue; }
      const info = opening[2].trim().split(/\s+/)[0] || "";
      active = { marker: opening[1][0], length: opening[1].length, language: info, content: [], line: offset + 1 };
      outside.push("");
      if (!info) errors.push(`${relative}:${offset + 1}: fenced code block must declare a language`);
      continue;
    }
    const closing = line.match(/^[ \t]{0,3}(`{3,}|~{3,})[ \t]*$/);
    if (closing && closing[1][0] === active.marker && closing[1].length >= active.length) {
      fences.push({ language: active.language, content: active.content.join("\n"), line: active.line });
      active = null;
    } else {
      active.content.push(line);
    }
  }
  if (active) errors.push(`${relative}:${active.line}: unclosed fenced code block`);
  return { outside: outside.join("\n"), fences };
}

function jsonKeyPaths(value, prefix = "$") {
  if (Array.isArray(value)) return [...new Set(value.flatMap((item) => jsonKeyPaths(item, `${prefix}[]`)))].sort();
  if (!value || typeof value !== "object") return [];
  return Object.keys(value).sort().flatMap((key) => [`${prefix}.${key}`, ...jsonKeyPaths(value[key], `${prefix}.${key}`)]);
}

function xmlTagSequence(source, relative, line) {
  const tags = [];
  const stack = [];
  for (const match of source.matchAll(/<\s*(\/?)\s*([A-Za-z_][\w.:-]*)(?:\s[^<>]*?)?\s*(\/?)>/g)) {
    const [, closing, name, selfClosing] = match;
    if (selfClosing) { tags.push(`self:${name}`); continue; }
    if (!closing) { tags.push(`open:${name}`); stack.push(name); continue; }
    tags.push(`close:${name}`);
    const expected = stack.pop();
    if (expected !== name) errors.push(`${relative}:${line}: XML fence closes ${name}, expected ${expected || "no open tag"}`);
  }
  if (stack.length) errors.push(`${relative}:${line}: XML fence has unclosed tag(s): ${stack.join(", ")}`);
  return tags;
}

function routeFor(record) {
  const relativeDir = path.relative(path.join(CONTENT_ROOT, record.section), path.dirname(record.sourcePath)).split(path.sep);
  const parts = record.locale === "zh-CN" ? relativeDir : relativeDir.slice(1);
  const leaf = record.section === "tutorials" ? parts.join("/") : record.slug;
  return `${LOCALE_PREFIX[record.locale]}/${record.section}/${leaf}/`.replace(/\/+/g, "/");
}

function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.toISOString().slice(0, 10);
  const candidate = String(value ?? "");
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) && !Number.isNaN(Date.parse(`${candidate}T00:00:00Z`)) ? candidate : null;
}

function validateHeadingLevels(outside, relative) {
  const levels = [...outside.matchAll(/^[ \t]{0,3}(#{1,6})\s+\S.*$/gm)].map((match) => match[1].length);
  if (levels.includes(1)) errors.push(`${relative}: body must not contain H1 outside fenced code`);
  if (levels.length && levels[0] !== 2) errors.push(`${relative}: first body heading must be H2`);
  for (let index = 1; index < levels.length; index++) {
    if (levels[index] > levels[index - 1] + 1) errors.push(`${relative}: heading level jumps from H${levels[index - 1]} to H${levels[index]}`);
  }
  return levels;
}

function parseInternalLinks(outside) {
  return [...outside.matchAll(/!?(\[[^\]\n]*\])\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)].map((match) => match[2]);
}

const sourceFiles = [
  ...await findMarkdown(path.join(CONTENT_ROOT, "blog")),
  ...await findMarkdown(path.join(CONTENT_ROOT, "tutorials"))
];
const records = [];
const unique = new Set();

for (const sourcePath of sourceFiles) {
  const relative = path.relative(ROOT, sourcePath);
  const section = relative.split(path.sep)[1];
  const parsed = matter(await fs.readFile(sourcePath, "utf8"));
  const data = parsed.data;
  const locale = String(data.locale || "");
  const published = normalizeDate(data.published);
  const updated = normalizeDate(data.updated);
  const record = { ...data, section, locale, published, updated, sourcePath, relative, content: parsed.content };
  records.push(record);

  for (const field of ["title", "slug", "contentKey", "translation_of", "published", "updated", "tags", "draft"]) {
    if (data[field] === undefined || data[field] === null || data[field] === "") errors.push(`${relative}: missing ${field}`);
  }
  if (!LOCALES.includes(locale)) errors.push(`${relative}: unsupported locale ${locale}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug))) errors.push(`${relative}: invalid slug ${data.slug}`);
  if (!new RegExp(`^${section === "blog" ? "blog" : "tutorial"}(?:\\.[a-z0-9]+(?:-[a-z0-9]+)*)+$`).test(String(data.contentKey))) errors.push(`${relative}: invalid contentKey ${data.contentKey}`);
  if (typeof data.draft !== "boolean") errors.push(`${relative}: draft must be a Boolean`);
  if (!published) errors.push(`${relative}: published must be a valid YYYY-MM-DD date`);
  if (!updated) errors.push(`${relative}: updated must be a valid YYYY-MM-DD date`);
  if (published && updated && updated < published) errors.push(`${relative}: updated precedes published`);
  if (!Array.isArray(data.tags) || !data.tags.length) errors.push(`${relative}: tags must be a non-empty array`);
  else for (const tag of data.tags) {
    if (!tag || typeof tag !== "object" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(tag.id)) || typeof tag.label !== "string" || !tag.label.trim()) errors.push(`${relative}: every tag needs a stable id and localized label`);
  }

  const key = `${locale}:${data.contentKey}`;
  if (unique.has(key)) errors.push(`${relative}: duplicate locale + contentKey ${key}`);
  unique.add(key);
  const sectionRoot = path.join(CONTENT_ROOT, section);
  const sourceParts = path.relative(sectionRoot, path.dirname(sourcePath)).split(path.sep);
  if (locale === "zh-CN" && LOCALES.includes(sourceParts[0])) errors.push(`${relative}: zh-CN must use the unprefixed source path`);
  if (locale !== "zh-CN" && sourceParts[0] !== locale) errors.push(`${relative}: source path does not match locale ${locale}`);
  const localizedParts = locale === "zh-CN" ? sourceParts : sourceParts.slice(1);
  if (localizedParts.at(-1) !== data.slug) errors.push(`${relative}: source directory must end in slug ${data.slug}`);
  record.route = routeFor(record);
  const expectedTranslation = LOCALE_PREFIX[locale] ? record.route.slice(LOCALE_PREFIX[locale].length) : record.route;
  if (data.translation_of !== expectedTranslation) errors.push(`${relative}: translation_of must be ${expectedTranslation}`);

  if (section === "tutorials" && data.series !== undefined) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.series))) errors.push(`${relative}: invalid series id ${data.series}`);
    if (!Number.isInteger(data.order) || data.order < 1) errors.push(`${relative}: series order must be a positive integer`);
    if (localizedParts[0] !== data.series || (localizedParts.length === 1 && data.slug !== data.series) || localizedParts.length > 2) errors.push(`${relative}: series source path must be <series>/<slug> with its landing at <series>`);
  } else if (data.order !== undefined) {
    errors.push(`${relative}: order requires series`);
  } else if (section === "tutorials" && localizedParts.length !== 1) {
    errors.push(`${relative}: non-series tutorial must live directly below its locale root`);
  }

  const scanned = scanMarkdown(parsed.content, relative);
  record.outside = scanned.outside;
  record.fences = scanned.fences;
  record.headingLevels = validateHeadingLevels(scanned.outside, relative);
  record.structures = scanned.fences.map((fence) => {
    if (fence.language === "json") {
      try { return { language: "json", keys: jsonKeyPaths(JSON.parse(fence.content)) }; }
      catch (error) { errors.push(`${relative}:${fence.line}: invalid JSON fence (${error.message})`); }
    }
    if (fence.language === "xml") return { language: "xml", tags: xmlTagSequence(fence.content, relative, fence.line) };
    return { language: fence.language };
  });
  record.links = parseInternalLinks(scanned.outside);
}

const routeSet = new Set(records.map((record) => LOCALE_PREFIX[record.locale] ? record.route.slice(LOCALE_PREFIX[record.locale].length) : record.route));
for (const record of records) {
  for (const target of record.links) {
    if (!target.startsWith("/")) continue;
    const pathname = new URL(target, SITE_URL).pathname;
    if (/^\/(?:blog|tutorials)\//.test(pathname) && !routeSet.has(pathname)) errors.push(`${record.relative}: broken content link ${target}`);
  }
}

const clusters = new Map();
for (const record of records) {
  if (!clusters.has(record.contentKey)) clusters.set(record.contentKey, new Map());
  clusters.get(record.contentKey).set(record.locale, record);
}
for (const [contentKey, translations] of clusters) {
  for (const locale of LOCALES) if (!translations.has(locale)) errors.push(`${contentKey}: missing ${locale} translation`);
  const canonical = translations.get("zh-CN");
  if (!canonical) continue;
  const canonicalTags = canonical.tags.map((tag) => tag.id);
  for (const locale of LOCALES) {
    const peer = translations.get(locale);
    if (!peer) continue;
    for (const field of ["slug", "contentKey", "translation_of", "published", "updated", "series", "order", "draft"]) {
      if (peer[field] !== canonical[field]) errors.push(`${contentKey}:${locale}: ${field} differs from zh-CN`);
    }
    if (JSON.stringify(peer.tags.map((tag) => tag.id)) !== JSON.stringify(canonicalTags)) errors.push(`${contentKey}:${locale}: tag ids/order differ from zh-CN`);
    if (contentKey.startsWith("tutorial.prompt-engineering")) {
      if (JSON.stringify(peer.headingLevels) !== JSON.stringify(canonical.headingLevels)) errors.push(`${contentKey}:${locale}: heading levels differ from zh-CN`);
      if (JSON.stringify(peer.structures) !== JSON.stringify(canonical.structures)) errors.push(`${contentKey}:${locale}: fenced code languages or JSON/XML structures differ from zh-CN`);
    }
  }
}

for (const [key, group] of [...clusters].filter(([key]) => key.startsWith("tutorial."))) {
  const canonical = group.get("zh-CN");
  if (!canonical?.series) continue;
  const sameSeries = records.filter((record) => record.locale === "zh-CN" && record.series === canonical.series);
  const duplicateOrder = sameSeries.filter((record) => record.order === canonical.order);
  if (duplicateOrder.length !== 1) errors.push(`${key}: series order ${canonical.order} is not unique`);
}

let sourceMap;
let revisionLog;
try { sourceMap = JSON.parse(await fs.readFile(SOURCE_MAP, "utf8")); } catch (error) { errors.push(`${path.relative(ROOT, SOURCE_MAP)}: invalid JSON-compatible YAML (${error.message})`); }
try { revisionLog = JSON.parse(await fs.readFile(REVISION_LOG, "utf8")); } catch (error) { errors.push(`${path.relative(ROOT, REVISION_LOG)}: invalid JSON-compatible YAML (${error.message})`); }

if (sourceMap) {
  if (sourceMap.source_commit !== "e2f47db") errors.push("GPTPMT source map must stay pinned to e2f47db");
  const mappedKeys = new Set();
  for (const chapter of sourceMap.chapters || []) {
    mappedKeys.add(chapter.contentKey);
    const translations = clusters.get(chapter.contentKey);
    const canonical = translations?.get("zh-CN");
    if (!canonical) { errors.push(`GPTPMT source map points to missing ${chapter.contentKey}`); continue; }
    if (canonical.slug !== chapter.slug) errors.push(`${chapter.contentKey}: source map slug differs from content`);
    for (const anchor of chapter.protected_anchors || []) if (!canonical.content.includes(anchor)) errors.push(`${chapter.contentKey}: protected anchor is missing: ${anchor}`);
    if (chapter.protected_anchors_by_locale) {
      for (const locale of LOCALES) {
        const anchors = chapter.protected_anchors_by_locale[locale];
        if (!Array.isArray(anchors) || !anchors.length) {
          errors.push(`${chapter.contentKey}: protected_anchors_by_locale must define ${locale}`);
          continue;
        }
        const peer = translations?.get(locale);
        if (!peer) continue;
        for (const anchor of anchors) if (!peer.content.includes(anchor)) errors.push(`${chapter.contentKey}:${locale}: localized protected anchor is missing: ${anchor}`);
      }
      for (const locale of Object.keys(chapter.protected_anchors_by_locale)) if (!LOCALES.includes(locale)) errors.push(`${chapter.contentKey}: protected anchors use unsupported locale ${locale}`);
    }
    for (const locale of LOCALES) {
      const peer = translations?.get(locale);
      if (!peer) continue;
      for (const literal of missingRequiredLiterals(peer.content, chapter.required_literals_all_locales)) errors.push(`${chapter.contentKey}:${locale}: required cross-locale literal is missing: ${literal}`);
      if (chapter.required_fenced_output) {
        for (const issue of validateRequiredFencedOutput(peer.fences, chapter.required_fenced_output, locale)) errors.push(`${chapter.contentKey}:${locale}: protected fenced output is invalid: ${issue}`);
      }
      for (const [level, minimum] of Object.entries(chapter.minimum_structure?.heading_counts || {})) {
        const actual = peer.headingLevels.filter((value) => value === Number(level)).length;
        if (!Number.isInteger(minimum) || minimum < 0) errors.push(`${chapter.contentKey}: invalid minimum heading count for H${level}`);
        else if (actual < minimum) errors.push(`${chapter.contentKey}:${locale}: needs at least ${minimum} H${level} headings, found ${actual}`);
      }
      for (const [language, minimum] of Object.entries(chapter.minimum_structure?.fence_language_counts || {})) {
        const actual = peer.fences.filter((fence) => fence.language === language).length;
        if (!Number.isInteger(minimum) || minimum < 0) errors.push(`${chapter.contentKey}: invalid minimum ${language} fence count`);
        else if (actual < minimum) errors.push(`${chapter.contentKey}:${locale}: needs at least ${minimum} ${language} fence(s), found ${actual}`);
      }
    }
  }
  const guideKeys = [...clusters.keys()].filter((key) => key === "tutorial.prompt-engineering" || key.startsWith("tutorial.prompt-engineering."));
  for (const key of guideKeys) if (!mappedKeys.has(key)) errors.push(`GPTPMT source map is missing ${key}`);
  const guideTranslations = clusters.get("tutorial.prompt-engineering");
  for (const locale of LOCALES) {
    const peer = guideTranslations?.get(locale);
    if (!peer) continue;
    for (const officialUrl of sourceMap.official_model_urls || []) if (!peer.content.includes(`(${officialUrl})`)) errors.push(`${peer.relative}: missing official model URL ${officialUrl}`);
    const allowedUrls = new Set(sourceMap.official_model_urls || []);
    const externalUrls = [...peer.content.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
    for (const externalUrl of externalUrls) if (!allowedUrls.has(externalUrl)) errors.push(`${peer.relative}: guide landing links to a non-approved external URL ${externalUrl}`);
  }
  for (const phrase of sourceMap.forbidden_legacy_phrases || []) {
    for (const record of records.filter((item) => item.contentKey.startsWith("tutorial.prompt-engineering"))) {
      if (record.content.includes(phrase)) errors.push(`${record.relative}: contains forbidden legacy wording: ${phrase}`);
    }
  }
}

if (revisionLog) {
  if (revisionLog.series !== "prompt-engineering" || revisionLog.source_commit !== "e2f47db") errors.push("revision log must identify prompt-engineering and source commit e2f47db");
  if (JSON.stringify(revisionLog.locales) !== JSON.stringify(LOCALES)) errors.push("revision log must list all six locales in canonical order");
  const logged = new Set();
  for (const chapter of revisionLog.chapters || []) {
    logged.add(chapter.contentKey);
    if (!clusters.has(chapter.contentKey)) errors.push(`revision log points to missing ${chapter.contentKey}`);
    if (!Array.isArray(chapter.correction_categories) || !chapter.correction_categories.length) errors.push(`${chapter.contentKey}: revision log needs correction_categories`);
    for (const locale of LOCALES) if (chapter.locale_status?.[locale] !== "synced") errors.push(`${chapter.contentKey}: revision log must mark ${locale} synced`);
  }
  const guideKeys = [...clusters.keys()].filter((key) => key === "tutorial.prompt-engineering" || key.startsWith("tutorial.prompt-engineering."));
  for (const key of guideKeys) if (!logged.has(key)) errors.push(`revision log is missing ${key}`);
}

if (await exists(OUT)) {
  const sitemap = await fs.readFile(path.join(OUT, "sitemap.xml"), "utf8").catch(() => "");
  if (!/^<\?xml[^>]+>\s*<sitemapindex\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(sitemap)) errors.push("generated sitemap.xml is missing the expected sitemapindex structure");
  for (const locale of LOCALES) {
    const relative = locale === "zh-CN" ? "index.xml" : `${LOCALE_PREFIX[locale].slice(1)}/index.xml`;
    const rss = await fs.readFile(path.join(OUT, relative), "utf8").catch(() => "");
    for (const element of ["channel", "title", "link", "description", "language", "lastBuildDate"]) if (!new RegExp(`<${element}[\\s>]`).test(rss)) errors.push(`${relative}: RSS is missing ${element}`);
    if (!/<atom:link\s+href="[^"]+"\s+rel="self"\s+type="application\/rss\+xml"\/>/.test(rss)) errors.push(`${relative}: RSS is missing its atom:self link`);
  }
}

if (errors.length) {
  console.error(`Content synchronization validation failed with ${errors.length} error(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Content synchronization checks passed for ${records.length} documents, ${clusters.size} translation clusters, and ${LOCALES.length} locales.`);
