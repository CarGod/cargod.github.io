const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const origin = 'https://luffyliu.com';
export function councilSeo({title, description, path, graph = []}) {
 const url = `${origin}${path}`;
 const image = `${origin}/assets/council/social-preview.png`;
 const imageAlt = '产品顾问团 Product Advisory Council · 14 个产品与 AI 分析视角、148 张决策方法卡';
 return `<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="Luffy Liu"><meta property="og:type" content="website"><meta property="og:site_name" content="Luffy Liu"><meta property="og:locale" content="zh_CN"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${imageAlt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:creator" content="@luffyliux"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="${imageAlt}"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`;
}
export function councilBreadcrumb(items) {
 return {'@type':'BreadcrumbList',itemListElement:items.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:`${origin}${path}`}))};
}
