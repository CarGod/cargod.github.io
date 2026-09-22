import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {council,councilMethods,councilLocales,localizedCouncil,councilPath,councilAlternates} from './lib/council-i18n.mjs';
const out=path.resolve(process.env.OUT_DIR||'_site');
const sitemapIndex=await fs.readFile(path.join(out,'sitemap.xml'),'utf8');
const sitemapFiles=[...sitemapIndex.matchAll(/<loc>https:\/\/luffyliu\.com\/(sitemaps\/[^<]+)<\/loc>/g)].map(m=>m[1]);
const sitemap=(await Promise.all(sitemapFiles.map(file=>fs.readFile(path.join(out,file),'utf8')))).join('\n');
const ids=councilMethods.map(m=>m.id).sort();
const uiKeys=Object.keys(localizedCouncil('zh-CN').ui).sort();
let count=0;
for(const locale of Object.keys(councilLocales)){
 const {ui,advisors,methods}=localizedCouncil(locale);
 assert.equal(advisors.length,14); assert.deepEqual(methods.map(m=>m.id).sort(),ids);
 assert.deepEqual(Object.keys(ui).sort(),uiKeys);
 assert(Object.entries(ui).every(([key,v])=>typeof v==='string'&&(v.trim()||key==='heroBefore')),`Missing UI text: ${locale}`);
 for(const advisor of advisors){
  assert.equal(advisor.questions.length,4);
  for(const q of advisor.questions){
   const method=methods.find(m=>m.id===q.method&&m.person===advisor.id);
   assert(method,`${locale}:${q.method}`);assert.equal(method.title,q.methodTitle);
   for(const field of ['conditions','questions','actions','boundaries'])assert(method[field]?.length&&method[field].every(v=>v.trim()));
   assert(q.question.length>5&&q.answer.length>20);
  }
 }
 if(['en','es','ko'].includes(locale))assert(!/[\u3400-\u9fff]/u.test(JSON.stringify({ui,advisors,methods})),`Untranslated CJK text in ${locale}`);
 const titles=new Set();
 for(const id of ['',...ids]){
  const route=councilPath(locale,id),url=`https://luffyliu.com${route}`;
  const html=await fs.readFile(path.join(out,route.slice(1),'index.html'),'utf8');
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title&&!titles.has(title),`Duplicate/missing title: ${route}`);titles.add(title);
  assert(html.includes(`<html lang="${locale}">`));
  assert(html.includes(`<link rel="canonical" href="${url}">`));
  assert(html.includes(`<meta property="og:url" content="${url}">`));
  assert(html.includes(`content="${councilLocales[locale].og}"`));
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  assert(html.includes('content="index, follow, max-image-preview:large"'));
  for(const [lang,href] of Object.entries(councilAlternates(id))){
   assert(html.includes(`<link rel="alternate" hreflang="${lang}" href="${href}">`),`Missing hreflang: ${route}:${lang}`);
   assert(html.includes(`<a href="${href}" data-language="${lang}"`),`Wrong language switch target: ${route}:${lang}`);
  }
  assert(html.includes(`<link rel="alternate" hreflang="x-default" href="${councilAlternates(id)['zh-CN']}">`));
  const structured=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const crumbs=structured['@graph'].find(x=>x['@type']==='BreadcrumbList');
  assert.equal(crumbs.itemListElement.at(-1).item,url);
  assert.equal(structured['@graph'].find(x=>x['@type']==='WebPage').inLanguage,locale);
  assert(sitemap.includes(url),`Missing sitemap URL: ${route}`);
  assert(html.includes(`social-preview-${locale}.png`));
  if(!id){
   for(const method of methods)assert(html.includes(`href="${councilPath(locale,method.id)}"`));
   assert(html.includes(ui.installIntro));
  }
  count++;
 }
 const homepage=await fs.readFile(path.join(out,councilLocales[locale].prefix.slice(1),'index.html'),'utf8');
 assert(homepage.includes(`href="${councilPath(locale)}"`));
 const image=await fs.readFile(path.join(out,`assets/council/social-preview-${locale}.png`));
 assert.equal(image.readUInt32BE(16),1200);assert.equal(image.readUInt32BE(20),630);
}
console.log(`Council: ${count} pages in six locales passed translation completeness, method references, route isolation, reciprocal hreflang, canonical, JSON-LD, sitemap, homepage links and localized image checks.`);
