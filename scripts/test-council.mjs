import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { council } from './lib/council.mjs';
import { councilMethods } from './lib/council-cards.mjs';
const out = path.resolve(process.env.OUT_DIR || '_site');
const prefix = '/product-advisory-council/';
const routes = [prefix, ...councilMethods.map(m => `${prefix}cards/${m.id.toLowerCase()}/`)];
assert.equal(council.advisors.length, 14);
assert.equal(councilMethods.length, 56);
for (const advisor of council.advisors) {
 assert.equal(advisor.questions.length, 4);
 for (const q of advisor.questions) assert(councilMethods.some(m => m.id === q.method && m.person === advisor.id), q.method);
}
const sitemapIndex = await fs.readFile(path.join(out, 'sitemap.xml'), 'utf8');
const sitemapFiles = [...sitemapIndex.matchAll(/<loc>https:\/\/luffyliu\.com\/(sitemaps\/[^<]+)<\/loc>/g)].map(m => m[1]);
const sitemap = (await Promise.all(sitemapFiles.map(file => fs.readFile(path.join(out, file), 'utf8')))).join('\n');
const titles = new Set();
for (const route of routes) {
 const html = await fs.readFile(path.join(out, route.slice(1), 'index.html'), 'utf8');
 const title = html.match(/<title>(.*?)<\/title>/)?.[1];
 assert(title && !titles.has(title), `Duplicate/missing title: ${route}`); titles.add(title);
 assert(html.includes(`<link rel="canonical" href="https://luffyliu.com${route}">`));
 assert(html.includes(`<meta property="og:url" content="https://luffyliu.com${route}">`));
 assert(html.includes('name="twitter:card" content="summary_large_image"'));
 assert(html.includes('content="index, follow, max-image-preview:large"'));
 const structured = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 const crumbs = structured['@graph'].find(x => x['@type'] === 'BreadcrumbList');
 assert.equal(crumbs.itemListElement.at(-1).item, `https://luffyliu.com${route}`);
 assert(sitemap.includes(`https://luffyliu.com${route}`), `Missing sitemap URL: ${route}`);
}
const image = await fs.readFile(path.join(out, 'assets/council/social-preview.png'));
assert.equal(image.readUInt32BE(16), 1200); assert.equal(image.readUInt32BE(20), 630);
console.log(`Council: ${routes.length} pages passed metadata, structured data, sitemap and method-reference checks; 1200 × 630 social image verified.`);
