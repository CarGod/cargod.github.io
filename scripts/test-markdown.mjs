import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { createMarkdownRenderer } from "./lib/markdown.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = createMarkdownRenderer();

const fixture = `Paragraph with **strong**, *emphasis*, [a link](https://example.com), and \`inline code\`.

- **正确性：**事实与计算是否正确。
  - **嵌套项：**包含 *强调*、[链接](https://example.com/nested) 和 \`code\`。

> **引用：**这是一个带强调的引用段落。

| 项目 | 结果 |
| --- | --- |
| **正确性：**事实 | \`pass\` |

\`\`\`js
const literal = "**not emphasis inside code**";
\`\`\`

<UnsafeComponent value="must stay escaped" />`;

const fixtureHtml = md.render(fixture);
assert.match(fixtureHtml, /<p>Paragraph with <strong>strong<\/strong>, <em>emphasis<\/em>, <a href="https:\/\/example\.com">a link<\/a>, and <code>inline code<\/code>\.<\/p>/);
assert.match(fixtureHtml, /<li><strong>正确性：<\/strong>事实与计算是否正确。/);
assert.match(fixtureHtml, /<li><strong>嵌套项：<\/strong>包含 <em>强调<\/em>、<a href="https:\/\/example\.com\/nested">链接<\/a> 和 <code>code<\/code>。/);
assert.match(fixtureHtml, /<blockquote>[\s\S]*<strong>引用：<\/strong>这是一个带强调的引用段落。/);
assert.match(fixtureHtml, /<table>[\s\S]*<th>项目<\/th>[\s\S]*<td><strong>正确性：<\/strong>事实<\/td>/);
assert.match(fixtureHtml, /<pre><code class="language-js">const literal = &quot;\*\*not emphasis inside code\*\*&quot;;/);
assert.match(fixtureHtml, /&lt;UnsafeComponent value=&quot;must stay escaped&quot; \/&gt;/);

async function findMarkdown(directory) {
  const results = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await findMarkdown(target));
    else if (entry.isFile() && entry.name === "index.md") results.push(target);
  }
  return results.sort();
}

function withoutCode(html) {
  return html
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, "")
    .replace(/<code\b[\s\S]*?<\/code>/gi, "");
}

const sourceFiles = [
  ...await findMarkdown(path.join(ROOT, "content", "tutorials")),
  ...await findMarkdown(path.join(ROOT, "content", "blog"))
];

for (const source of sourceFiles) {
  const parsed = matter(await fs.readFile(source, "utf8"));
  const html = withoutCode(md.render(parsed.content));
  assert.doesNotMatch(html, /\*\*[^*\n]+\*\*/, `${path.relative(ROOT, source)} leaks strong Markdown`);
  assert.doesNotMatch(html, /__[^_\n]+__/, `${path.relative(ROOT, source)} leaks underscore strong Markdown`);
  assert.doesNotMatch(html, /(?<!\*)\*(?!\*)[^*\n]+(?<!\s)\*(?!\*)/, `${path.relative(ROOT, source)} leaks emphasis Markdown`);
  assert.doesNotMatch(html, /(?<!`)`{1,2}[^`\n]+`{1,2}(?!`)/, `${path.relative(ROOT, source)} leaks inline-code Markdown`);
  assert.doesNotMatch(html, /(?<!!)\[[^\]\n]+\]\([^)\n]+\)/, `${path.relative(ROOT, source)} leaks link Markdown`);
}

const jaTutorial = matter(await fs.readFile(path.join(ROOT, "content", "tutorials", "ja", "prompt-engineering", "structured-prompts", "index.md"), "utf8"));
assert.match(md.render(jaTutorial.content), /これは<strong>役割または対象<\/strong>です/);

const koTutorial = matter(await fs.readFile(path.join(ROOT, "content", "tutorials", "ko", "prompt-engineering", "first-conversation", "index.md"), "utf8"));
assert.match(md.render(koTutorial.content), /<strong>Prompt<\/strong>라고/);

const zhTwTutorial = matter(await fs.readFile(path.join(ROOT, "content", "tutorials", "zh-TW", "prompt-engineering", "structured-prompts", "index.md"), "utf8"));
assert.match(md.render(zhTwTutorial.content), /這裡是<strong>角色或對象<\/strong>/);

console.log(`Markdown compatibility checks passed for fixture coverage and ${sourceFiles.length} real source documents.`);
