import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { missingRequiredLiterals, validateRequiredFencedOutput } from "./lib/content-protection.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceMap = JSON.parse(await fs.readFile(path.join(ROOT, "skills", "luffyliu-site-content-maintainer", "references", "gptpmt-source-map.yml"), "utf8"));
const tokenRule = sourceMap.chapters.find((chapter) => chapter.contentKey === "tutorial.prompt-engineering.tokens");
const xmlRule = sourceMap.chapters.find((chapter) => chapter.contentKey === "tutorial.prompt-engineering.xml-delimiters")?.required_fenced_output;

assert.deepEqual(
  missingRequiredLiterals(
    "cl100k_base [15339, 1917] https://github.com/openai/tiktoken/blob/main/tests/test_encoding.py",
    tokenRule.required_literals_all_locales
  ),
  [],
  "the complete Token experiment fixture must pass"
);
assert.deepEqual(
  missingRequiredLiterals("cl100k_base [15339, 1917]", tokenRule.required_literals_all_locales),
  ["https://github.com/openai/tiktoken/blob/main/tests/test_encoding.py"],
  "removing the official reproducibility link must fail"
);

const completeOutput = {
  language: "text",
  content: [
    "## Action Items",
    "### Emily Martinez",
    "- Item: Example",
    "- Deadline: Not provided",
    "",
    "### David Wilson",
    "- Item: Example",
    "- Deadline: Not provided",
    "",
    "### Mary Johnson",
    "- Item: Example",
    "- Deadline: Not provided",
    "",
    "### Robert Brown",
    "- Item: Example",
    "- Deadline: Not provided",
    "",
    "### Lisa Taylor",
    "- Item: Example",
    "- Deadline: Not provided"
  ].join("\n")
};
assert.deepEqual(validateRequiredFencedOutput([completeOutput], xmlRule, "en"), [], "the complete five-owner output fixture must pass");

const onlyEmily = {
  ...completeOutput,
  content: ["## Action Items", "### Emily Martinez", "- Item: Example", "- Deadline: Not provided"].join("\n")
};
assert.ok(
  validateRequiredFencedOutput([onlyEmily], xmlRule, "en").some((issue) => issue.includes("each required owner heading exactly once")),
  "an output reduced to Emily alone must fail"
);

const lisaDeadlineRemoved = {
  ...completeOutput,
  content: completeOutput.content.replace("### Lisa Taylor\n- Item: Example\n- Deadline: Not provided", "### Lisa Taylor\n- Item: Example")
};
assert.ok(
  validateRequiredFencedOutput([lisaDeadlineRemoved], xmlRule, "en").some((issue) => issue.startsWith("Lisa Taylor section")),
  "each owner must retain an explicit missing-deadline value"
);

console.log("Protected-content regression fixtures passed.");
