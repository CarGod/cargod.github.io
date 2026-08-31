import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

import { localeData, originals } from "./generate-enterprise-ai-localized-visuals.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOT = path.join(REPO_ROOT, "content/blog");
const ASSET_ROOT = path.join(SOURCE_ROOT, "2026/08/enterprise-ai-four-stages/assets");
const GENERATED_ROOT = path.join(REPO_ROOT, "_site");

const sourceTemplateHashes = {
  "cover-liu-lufei-original-v8.svg": "92e5d07886ef31d4a04686c3b21f9967bd42f486b530b610e76b10f230f14064",
  "diagram-01-four-stages-original-v6.svg": "6134e310c71e37d2fd88a8ae7e88e190d09fd4f10cdc8e5e5ee0be9f25c302cc",
  "diagram-02-intent-tree-original-v6.svg": "966ff8ba36b7eb28dc3c382ec6b9a638963d9a00dd7b1cb9345a857674fe03da",
  "diagram-03-governance-original-v6.svg": "2d21d76c5becf5c41a10d9b6fc50d715e04e1ad75a945270940efa54ed7fa1a7",
  "diagram-04-upgrade-checklist-original-v6.svg": "c59fe01979c823cbb877bd5f15e0c469a33a3b5eb9be2e3428caa163107efb9e"
};

const articleSourcePaths = {
  "zh-TW": path.join(SOURCE_ROOT, "zh-TW/2026/08/enterprise-ai-four-stages/index.md"),
  en: path.join(SOURCE_ROOT, "en/2026/08/enterprise-ai-four-stages/index.md"),
  ja: path.join(SOURCE_ROOT, "ja/2026/08/enterprise-ai-four-stages/index.md"),
  ko: path.join(SOURCE_ROOT, "ko/2026/08/enterprise-ai-four-stages/index.md"),
  es: path.join(SOURCE_ROOT, "es/2026/08/enterprise-ai-four-stages/index.md")
};

const generatedArticlePaths = {
  "zh-TW": "zh-tw/blog/enterprise-ai-four-stages/index.html",
  en: "en/blog/enterprise-ai-four-stages/index.html",
  ja: "ja/blog/enterprise-ai-four-stages/index.html",
  ko: "ko/blog/enterprise-ai-four-stages/index.html",
  es: "es/blog/enterprise-ai-four-stages/index.html"
};

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function readPngDimensions(filePath) {
  const bytes = readFileSync(filePath);
  assert.equal(bytes.subarray(1, 4).toString("ascii"), "PNG", `${filePath} must be a PNG`);
  assert.ok(bytes.length > 20_000, `${filePath} is unexpectedly small`);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function visibleSvgText(svg) {
  return decodeXml(svg.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizeWhitespace(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function flattenStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

for (const [fileName, expectedHash] of Object.entries(sourceTemplateHashes)) {
  assert.equal(sha256(path.join(ASSET_ROOT, fileName)), expectedHash, `${fileName} no longer matches the approved SVG source`);
}

for (const [locale, data] of Object.entries(localeData)) {
  const sourcePath = articleSourcePaths[locale];
  const parsed = matter(readFileSync(sourcePath, "utf8"));
  const expectedCover = `assets/cover-liu-lufei-${data.fileLocale}-v1.png`;
  assert.equal(parsed.data.cover, expectedCover, `${locale} cover must use its localized asset`);

  const markdownImageUrls = [...parsed.content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
  const expectedDiagramUrls = [1, 2, 3, 4].map(
    (number) => `/assets/blog/enterprise-ai-four-stages/diagram-0${number}-${["four-stages", "intent-tree", "governance", "upgrade-checklist"][number - 1]}-${data.fileLocale}-v1.png`
  );
  for (const expectedUrl of expectedDiagramUrls) {
    assert.ok(markdownImageUrls.includes(expectedUrl), `${locale} article is missing ${expectedUrl}`);
  }
  assert.equal(
    markdownImageUrls.filter((url) => /diagram-0[1-4]-/.test(url)).length,
    4,
    `${locale} article must reference exactly four localized diagrams`
  );
  assert.ok(
    markdownImageUrls.every((url) => !/diagram-0[1-4].*-original-v6\.png$/.test(url)),
    `${locale} article still references a Chinese diagram`
  );

  for (const [assetKey, asset] of Object.entries(originals)) {
    const outputStem = `${asset.output}-${data.fileLocale}-v1`;
    const svgPath = path.join(ASSET_ROOT, `${outputStem}.svg`);
    const pngPath = path.join(ASSET_ROOT, `${outputStem}.png`);
    assert.ok(existsSync(svgPath), `${locale} SVG is missing: ${outputStem}`);
    assert.ok(existsSync(pngPath), `${locale} PNG is missing: ${outputStem}`);
    assert.deepEqual(readPngDimensions(pngPath), [asset.width, asset.height], `${outputStem} dimensions changed`);

    const svg = readFileSync(svgPath, "utf8");
    assert.match(svg, new RegExp(`<svg lang="${locale}" data-locale="${locale}"`), `${outputStem} has the wrong locale metadata`);
    const text = visibleSvgText(svg);
    for (const requiredText of flattenStrings(data[assetKey])) {
      const normalizedRequiredText = normalizeWhitespace(requiredText);
      assert.ok(text.includes(normalizedRequiredText), `${outputStem} is missing localized text: ${requiredText}`);
    }
  }

  const generatedPath = path.join(GENERATED_ROOT, generatedArticlePaths[locale]);
  assert.ok(existsSync(generatedPath), `${locale} generated article is missing; run npm run build first`);
  const generatedHtml = readFileSync(generatedPath, "utf8");
  assert.ok(generatedHtml.includes(`/assets/blog/enterprise-ai-four-stages/${path.basename(expectedCover)}`), `${locale} generated cover is wrong`);
  for (const expectedUrl of expectedDiagramUrls) {
    assert.ok(generatedHtml.includes(expectedUrl), `${locale} generated article is missing ${expectedUrl}`);
  }
}

for (const locale of ["en", "es", "ko"]) {
  const fileLocale = localeData[locale].fileLocale;
  for (const asset of Object.values(originals)) {
    const svg = readFileSync(path.join(ASSET_ROOT, `${asset.output}-${fileLocale}-v1.svg`), "utf8");
    assert.doesNotMatch(svg, /企业老系统|四个阶段，四层能力|用户表达|人工检查，变成系统护栏|先补自己缺的那一层/);
  }
}

const zhTwCover = readFileSync(path.join(ASSET_ROOT, "cover-liu-lufei-zh-tw-v1.svg"), "utf8");
assert.ok(zhTwCover.includes("劉路飛"));
assert.ok(!zhTwCover.includes(">刘路飞<"));
for (const locale of ["en", "ja", "ko", "es"]) {
  const cover = readFileSync(path.join(ASSET_ROOT, `cover-liu-lufei-${locale}-v1.svg`), "utf8");
  assert.ok(cover.includes("Luffy Liu"), `${locale} cover must use the localized author name`);
  assert.ok(!cover.includes(">刘路飞<"), `${locale} cover still exposes the Chinese author name`);
}

console.log(`Localized visual validation passed: ${Object.keys(localeData).length} locales × ${Object.keys(originals).length} assets.`);
