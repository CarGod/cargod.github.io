import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "_site");
const SOURCE = "https://felixrieseberg.com/hunger-beats-tenure-advice-for-junior-engineers/";

function articleData(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1])["@graph"] || [])
    .find((item) => item["@type"] === "BlogPosting");
}

for (const prefix of ["", "zh-tw", "en", "ja", "ko", "es"]) {
  const html = readFileSync(path.join(SITE, prefix, "blog/hunger-beats-tenure/index.html"), "utf8");
  const article = articleData(html);
  assert.equal(article.author.name, "Felix Rieseberg");
  assert.equal(article.author.url, "https://felixrieseberg.com/");
  assert.equal(article.publisher["@id"], "https://luffyliu.com/#person");
  assert.equal(article.isBasedOn, SOURCE);
  assert.match(html, /<meta name="author" content="Felix Rieseberg">/);
  assert.match(html, /<meta property="article:author" content="Felix Rieseberg">/);
  assert.match(html, /<div class="content-meta"><span>Felix Rieseberg<\/span>/);
  const card = html.match(/<div class="author-card"[\s\S]*?<\/article>/)?.[0];
  assert.ok(card?.includes("Felix Rieseberg"));
  assert.ok(card.includes(SOURCE));
  assert.doesNotMatch(card, /<img|luffy-avatar|<strong>Luffy Liu/);

  const feed = readFileSync(path.join(SITE, prefix, "index.xml"), "utf8");
  assert.match(feed, /xmlns:dc="http:\/\/purl.org\/dc\/elements\/1.1\/"/);
  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1]);
  assert.ok(items[0].includes("/blog/hunger-beats-tenure/"), `${prefix}: republication must be first`);
  assert.match(items[0], /<dc:creator>Felix Rieseberg<\/dc:creator>/);
  assert.doesNotMatch(items[0], /<author>/);

  for (const slug of ["escaping-ai-anxiety", "enterprise-ai-four-stages"]) {
    const existing = readFileSync(path.join(SITE, prefix, `blog/${slug}/index.html`), "utf8");
    assert.deepEqual(articleData(existing).author, { "@id": "https://luffyliu.com/#person" });
    assert.match(existing, /<meta name="author" content="Luffy Liu">/);
    assert.match(existing, /<meta property="article:author" content="Luffy Liu">/);
    assert.match(existing, /<div class="content-meta"><span>Luffy Liu<\/span>/);
    assert.match(existing, /<div class="author-card"[^>]*><img src="\/assets\/luffy-avatar.png"/);
    const item = items.find((entry) => entry.includes(`/blog/${slug}/`));
    assert.match(item, /<author>luffyliux@gmail.com \(Luffy Liu\)<\/author>/);
    assert.doesNotMatch(item, /<dc:creator>/);
  }
}

console.log("Original-author attribution passed for six republications, RSS feeds, and twelve existing articles.");
