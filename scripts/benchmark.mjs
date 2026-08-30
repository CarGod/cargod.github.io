import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_ROOT = path.join(ROOT, ".benchmark-content");
const OUT = path.join(ROOT, ".benchmark-site");
const count = Number(process.env.BENCHMARK_COUNT || 10_000);
const locales = process.argv.includes("--six-locales") ? ["zh-CN", "zh-TW", "en", "ja", "ko", "es"] : ["zh-CN"];
const prefixes = { "zh-CN": "", "zh-TW": "zh-tw/", en: "en/", ja: "ja/", ko: "ko/", es: "es/" };

if (!Number.isInteger(count) || count < 1) throw new Error("BENCHMARK_COUNT must be a positive integer");

const run = (command, args, env = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd: ROOT, env: { ...process.env, ...env }, stdio: "inherit" });
  child.on("error", reject);
  child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
});
const sizeOf = async (directory) => {
  let total = 0;
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) total += await sizeOf(target);
    else if (entry.isFile()) total += (await fs.stat(target)).size;
  }
  return total;
};

await fs.rm(CONTENT_ROOT, { recursive: true, force: true });
await fs.rm(OUT, { recursive: true, force: true });

try {
  const generatedAt = performance.now();
  const jobs = [];
  for (let index = 1; index <= count; index++) {
    const slug = `benchmark-${String(index).padStart(5, "0")}`;
    const year = String(2017 + (index % 10));
    for (const locale of locales) {
      const directory = path.join(CONTENT_ROOT, "blog", locale === "zh-CN" ? "" : locale, year, "01", slug);
      const url = `/${prefixes[locale]}blog/${slug}/`;
      const markdown = `---\ntitle: "Benchmark article ${index} (${locale})"\nslug: "${slug}"\ncontentKey: "blog.${slug}"\ntranslation_of: "/blog/${slug}/"\nlocale: "${locale}"\ndescription: "Deterministic synthetic article ${index} for the static build and Pagefind capacity benchmark."\npublished: "${year}-01-01"\nupdated: "2026-08-30"\ntags:\n  - id: "benchmark"\n    label: "Benchmark"\n  - id: "static-search"\n    label: "Static search"\ncover: "cover.webp"\ncover_alt: "Synthetic benchmark cover"\nmedia_base: "https://media.example.invalid/benchmark"\ndraft: false\n---\n\nThis synthetic document measures deterministic static generation and sharded search at URL ${url}. It contains enough repeated prose to exercise parsing, headings, metadata, filters, and search excerpts without copying production content.\n\n## Stable section\n\nArticle ${index} belongs to year ${year}. The generated corpus is temporary and is removed after the benchmark.\n`;
      jobs.push(fs.mkdir(directory, { recursive: true }).then(() => fs.writeFile(path.join(directory, "index.md"), markdown)));
      if (jobs.length >= 250) { await Promise.all(jobs.splice(0)); }
    }
  }
  await Promise.all(jobs);
  const generateSeconds = (performance.now() - generatedAt) / 1000;

  const buildAt = performance.now();
  await run(process.execPath, ["scripts/build.mjs"], { CONTENT_ROOT, OUT_DIR: OUT, SKIP_STATIC: "1" });
  const buildSeconds = (performance.now() - buildAt) / 1000;

  const indexAt = performance.now();
  await run(path.join(ROOT, "node_modules", ".bin", "pagefind"), ["--site", OUT, "--output-subdir", "pagefind"]);
  const indexSeconds = (performance.now() - indexAt) / 1000;
  const bytes = await sizeOf(OUT);
  const result = {
    logical_articles: count,
    locales: locales.length,
    detail_pages: count * locales.length,
    corpus_generation_seconds: Number(generateSeconds.toFixed(2)),
    static_build_seconds: Number(buildSeconds.toFixed(2)),
    pagefind_seconds: Number(indexSeconds.toFixed(2)),
    total_seconds_excluding_install: Number((generateSeconds + buildSeconds + indexSeconds).toFixed(2)),
    artifact_mib: Number((bytes / 1024 / 1024).toFixed(2)),
    node: process.version
  };
  console.log(`BENCHMARK_RESULT ${JSON.stringify(result)}`);
} finally {
  if (!process.argv.includes("--keep")) {
    await fs.rm(CONTENT_ROOT, { recursive: true, force: true });
    await fs.rm(OUT, { recursive: true, force: true });
  }
}
