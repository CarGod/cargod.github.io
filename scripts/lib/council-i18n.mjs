import { promises as fs } from 'node:fs';
export const councilLocales = {
 'zh-CN': {prefix:'',og:'zh_CN'}, 'zh-TW':{prefix:'/zh-tw',og:'zh_TW'},
 en:{prefix:'/en',og:'en_US'},ja:{prefix:'/ja',og:'ja_JP'},ko:{prefix:'/ko',og:'ko_KR'},es:{prefix:'/es',og:'es_ES'}
};
export const council = JSON.parse(await fs.readFile(new URL('../../content/products/council.json',import.meta.url),'utf8'));
export const councilMethods = JSON.parse(await fs.readFile(new URL('../../content/products/council-methods.json',import.meta.url),'utf8'));
const data = new Map();
await Promise.all(Object.keys(councilLocales).map(async locale => {
 const ui=JSON.parse(await fs.readFile(new URL(`../../content/products/council-locales/ui.${locale}.json`,import.meta.url),'utf8'));
 const content=locale==='zh-CN'?{advisors:council.advisors,methods:councilMethods}:JSON.parse(await fs.readFile(new URL(`../../content/products/council-locales/${locale}.json`,import.meta.url),'utf8'));
 data.set(locale,{ui,...content});
}));
export const localizedCouncil = locale => {const result=data.get(locale);if(!result)throw new Error(`Unknown council locale: ${locale}`);return result;};
export const councilPath = (locale='zh-CN',id='') => `${councilLocales[locale].prefix}/product-advisory-council/${id?`cards/${id.toLowerCase()}/`:''}`;
export const councilAlternates = (id='') => Object.fromEntries(Object.keys(councilLocales).map(l=>[l,`https://luffyliu.com${councilPath(l,id)}`]));
export const format = (text,values={}) => text.replace(/\{(\w+)\}/g,(_,key)=>values[key]??`{${key}}`);
export const esc = (s='') => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const json = value => JSON.stringify(value).replaceAll('<','\\u003c');
export const clientConfig = ui => `<script id="council-ui" type="application/json">${json(ui)}</script>`;
export const installPrompt = ui => `${ui.installIntro}\n\n${ui.publicRepo}: ${council.source}\n\n${ui.installBody}\n\n${ui.installVerify}`;
