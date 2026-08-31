import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(process.env.OUT_DIR || path.join(ROOT, "_site"));
const CASES = {
  "zh-CN": { index: "zh-cn", prefix: "", terms: [["AI", "/blog/enterprise-ai-four-stages/"], ["企业", "/blog/enterprise-ai-four-stages/"], ["提示", "/tutorials/prompt-engineering/"]] },
  "zh-TW": { index: "zh-tw", prefix: "/zh-tw", terms: [["企業", "/zh-tw/blog/enterprise-ai-four-stages/"], ["提示", "/zh-tw/tutorials/prompt-engineering/"]] },
  en: { index: "en", prefix: "/en", terms: [["enterprise", "/en/blog/enterprise-ai-four-stages/"], ["prompt", "/en/tutorials/prompt-engineering/"]] },
  ja: { index: "ja", prefix: "/ja", terms: [["企業", "/ja/blog/enterprise-ai-four-stages/"], ["プロンプト", "/ja/tutorials/prompt-engineering/"]] },
  ko: { index: "ko", prefix: "/ko", terms: [["기업", "/ko/blog/enterprise-ai-four-stages/"], ["프롬프트", "/ko/tutorials/prompt-engineering/"]] },
  es: { index: "es", prefix: "/es", terms: [["empresa", "/es/blog/enterprise-ai-four-stages/"], ["ingeniería", "/es/tutorials/prompt-engineering/"]] }
};

const childLocale = process.argv[2] === "--locale" ? process.argv[3] : null;

if (!childLocale) {
  for (const locale of Object.keys(CASES)) {
    const child = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--locale", locale], {
      cwd: ROOT,
      encoding: "utf8",
      env: { ...process.env, OUT_DIR: OUT }
    });
    if (child.status !== 0) {
      process.stderr.write(child.stdout || "");
      process.stderr.write(child.stderr || "");
      process.exit(child.status || 1);
    }
    process.stdout.write(child.stdout);
  }
  console.log("Pagefind search regression checks passed for all six locales.");
  process.exit(0);
}

const testCase = CASES[childLocale];
assert.ok(testCase, `unsupported test locale ${childLocale}`);
const requested = [];
globalThis.window = { location: { origin: "https://luffyliu.com" } };
globalThis.location = { href: `https://luffyliu.com${testCase.prefix}/blog/search/` };
globalThis.document = {
  currentScript: null,
  querySelector: (selector) => selector === "html" ? { getAttribute: () => childLocale } : null
};
globalThis.fetch = async (input) => {
  const raw = typeof input === "string" ? input : input.url;
  const pathname = new URL(raw, "https://luffyliu.com").pathname;
  requested.push(pathname);
  const target = path.resolve(OUT, decodeURIComponent(pathname).replace(/^\/+/, ""));
  assert.ok(target.startsWith(`${OUT}${path.sep}`), `Pagefind requested a path outside the artifact: ${pathname}`);
  try {
    const data = await fs.readFile(target);
    const contentType = target.endsWith(".json") ? "application/json" : "application/octet-stream";
    return new Response(data, { status: 200, headers: { "content-type": contentType } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};

const pagefindUrl = `${pathToFileURL(path.join(OUT, "pagefind", "pagefind.js")).href}?locale=${encodeURIComponent(childLocale)}`;
const pagefind = await import(pagefindUrl);
await pagefind.options({ basePath: "/pagefind/", noWorker: true, excerptLength: 30 });

const filters = await pagefind.filters();
assert.ok(!Object.hasOwn(filters, "locale"), `${childLocale}: redundant locale filter must not exist`);
assert.ok(filters.section?.blog > 0 && filters.section?.tutorials > 0, `${childLocale}: both blog and tutorial sections must be searchable`);
const entry = JSON.parse(await fs.readFile(path.join(OUT, "pagefind", "pagefind-entry.json"), "utf8"));
const indexedPages = entry.languages?.[testCase.index]?.page_count;
assert.equal(Object.values(filters.section).reduce((sum, count) => sum + count, 0), indexedPages, `${childLocale}: section filters must cover every page in the locale index`);

const belongsToLocale = (url) => {
  const pathname = new URL(url, "https://luffyliu.com").pathname;
  if (testCase.prefix) return pathname.startsWith(`${testCase.prefix}/`);
  return !/^\/(?:zh-tw|en|ja|ko|es)\//.test(pathname);
};

for (const [term, expectedPath] of testCase.terms) {
  const response = await pagefind.search(term);
  assert.ok(response.results.length, `${childLocale}: ${term} returned no results`);
  const loaded = await Promise.all(response.results.slice(0, 20).map((stub) => stub.data()));
  assert.ok(loaded.every((item) => belongsToLocale(item.url)), `${childLocale}: ${term} leaked another locale`);
  assert.ok(loaded.some((item) => new URL(item.url, "https://luffyliu.com").pathname === expectedPath), `${childLocale}: ${term} did not include ${expectedPath}`);
}

const blogOnly = await pagefind.search(testCase.terms[0][0], { filters: { section: "blog" } });
const blogLoaded = await Promise.all(blogOnly.results.slice(0, 20).map((stub) => stub.data()));
assert.ok(blogLoaded.length && blogLoaded.every((item) => new URL(item.url, "https://luffyliu.com").pathname.includes("/blog/")), `${childLocale}: type filter did not isolate blog results`);

const negative = await pagefind.search("qzxv-no-such-content-8f3a1d");
assert.equal(negative.results.length, 0, `${childLocale}: negative query unexpectedly returned results`);

for (const pathname of requested.filter((item) => /^\/pagefind\/(?:index|fragment|filter)\//.test(item))) {
  const filename = path.basename(pathname);
  assert.ok(filename.startsWith(`${testCase.index}_`), `${childLocale}: fetched another language index chunk ${filename}`);
}
console.log(`${childLocale}: Pagefind terms, routing, type filter, and language isolation passed.`);
