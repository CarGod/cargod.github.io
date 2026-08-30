import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.resolve(process.env.OUT_DIR || path.join(ROOT, "_site"));
const CONTENT_ROOT = path.resolve(process.env.CONTENT_ROOT || path.join(ROOT, "content"));
const BLOG_CONTENT = path.join(CONTENT_ROOT, "blog");
const TUTORIAL_CONTENT = path.join(CONTENT_ROOT, "tutorials");
const HOME_CONTENT = path.resolve(process.env.HOME_CONTENT_ROOT || path.join(ROOT, "content", "home"));
const SITE_URL = "https://luffyliu.com";
const PAGE_SIZE = 20;
const RSS_SIZE = 50;
const SITEMAP_SIZE = 5_000;
const WARN_SITE_BYTES = 750 * 1024 * 1024;
const MAX_SITE_BYTES = 850 * 1024 * 1024;
const WARN_IMAGE_BYTES = 1.5 * 1024 * 1024;
const REQUIRED_FIELDS = ["title", "slug", "contentKey", "locale", "description", "published", "updated", "tags", "draft"];
const LOCALES = {
  "zh-CN": { prefix: "", html: "zh-CN", og: "zh_CN", label: "简体中文", short: "中", blog: "博客", search: "搜索", tutorials: "教程", home: "首页", archive: "归档", allTags: "全部标签", contentNav: "主要内容" },
  "zh-TW": { prefix: "/zh-tw", html: "zh-TW", og: "zh_TW", label: "繁體中文", short: "繁", blog: "網誌", search: "搜尋", tutorials: "教學", home: "首頁", archive: "封存", allTags: "全部標籤", contentNav: "主要內容" },
  en: { prefix: "/en", html: "en", og: "en_US", label: "English", short: "EN", blog: "Blog", search: "Search", tutorials: "Tutorials", home: "Home", archive: "Archive", allTags: "All tags", contentNav: "Primary content" },
  ja: { prefix: "/ja", html: "ja", og: "ja_JP", label: "日本語", short: "日", blog: "ブログ", search: "検索", tutorials: "チュートリアル", home: "ホーム", archive: "アーカイブ", allTags: "すべてのタグ", contentNav: "メインコンテンツ" },
  ko: { prefix: "/ko", html: "ko", og: "ko_KR", label: "한국어", short: "한", blog: "블로그", search: "검색", tutorials: "튜토리얼", home: "홈", archive: "아카이브", allTags: "모든 태그", contentNav: "주요 콘텐츠" },
  es: { prefix: "/es", html: "es", og: "es_ES", label: "Español", short: "ES", blog: "Blog", search: "Buscar", tutorials: "Tutoriales", home: "Inicio", archive: "Archivo", allTags: "Todas las etiquetas", contentNav: "Contenido principal" }
};
const COPY = {
  "zh-CN": { blogTitle: "博客：AI、Agent 与独立产品实践", blogLede: "关于企业 AI、Agent、独立产品与真实工作流的长期记录。", searchTitle: "搜索博客", searchLede: "按关键词、标签和年份搜索文章；索引按需分片加载。", keyword: "关键词", placeholder: "例如：Agent、数据治理、Copilot", submit: "搜索", tag: "标签", year: "年份", all: "全部", prompt: "输入关键词，或选择标签和年份。", none: "没有找到匹配文章。" },
  "zh-TW": { blogTitle: "網誌：AI、Agent 與獨立產品實踐", blogLede: "關於企業 AI、Agent、獨立產品與真實工作流程的長期記錄。", searchTitle: "搜尋網誌", searchLede: "依關鍵字、標籤與年份搜尋文章；索引會按需分片載入。", keyword: "關鍵字", placeholder: "例如：Agent、資料治理、Copilot", submit: "搜尋", tag: "標籤", year: "年份", all: "全部", prompt: "輸入關鍵字，或選擇標籤與年份。", none: "找不到相符文章。" },
  en: { blogTitle: "Blog: AI, Agents & Independent Products", blogLede: "Long-form notes on enterprise AI, agents, independent products, and real workflows.", searchTitle: "Search the blog", searchLede: "Search by keyword, tag, and year. The index loads in small chunks on demand.", keyword: "Keyword", placeholder: "e.g. agents, governance, Copilot", submit: "Search", tag: "Tag", year: "Year", all: "All", prompt: "Enter a keyword or choose a tag and year.", none: "No matching posts." },
  ja: { blogTitle: "ブログ：AI・エージェント・個人開発", blogLede: "企業 AI、エージェント、個人開発、実際のワークフローについての記録。", searchTitle: "ブログを検索", searchLede: "キーワード、タグ、年で検索できます。インデックスは必要な分だけ読み込みます。", keyword: "キーワード", placeholder: "例：Agent、ガバナンス、Copilot", submit: "検索", tag: "タグ", year: "年", all: "すべて", prompt: "キーワードを入力するか、タグと年を選択してください。", none: "該当する記事はありません。" },
  ko: { blogTitle: "블로그: AI, 에이전트와 인디 제품", blogLede: "기업 AI, 에이전트, 인디 제품과 실제 워크플로에 대한 기록입니다.", searchTitle: "블로그 검색", searchLede: "키워드, 태그, 연도로 검색합니다. 인덱스는 필요한 조각만 불러옵니다.", keyword: "키워드", placeholder: "예: Agent, 거버넌스, Copilot", submit: "검색", tag: "태그", year: "연도", all: "전체", prompt: "키워드를 입력하거나 태그와 연도를 선택하세요.", none: "일치하는 글이 없습니다." },
  es: { blogTitle: "Blog: IA, agentes y productos independientes", blogLede: "Notas sobre IA empresarial, agentes, productos independientes y flujos de trabajo reales.", searchTitle: "Buscar en el blog", searchLede: "Busca por palabra clave, etiqueta y año. El índice carga fragmentos bajo demanda.", keyword: "Palabra clave", placeholder: "p. ej., agentes, gobernanza, Copilot", submit: "Buscar", tag: "Etiqueta", year: "Año", all: "Todo", prompt: "Escribe una palabra clave o elige etiqueta y año.", none: "No hay artículos coincidentes." }
};
const TUTORIAL_TITLES = {
  "zh-CN": "教程：AI 与提示工程实用指南 | Luffy Liu",
  "zh-TW": "教學：AI 與提示工程實用指南 | Luffy Liu",
  en: "Tutorials: Practical AI & Prompt Engineering | Luffy Liu",
  ja: "チュートリアル：AI とプロンプトエンジニアリング | Luffy Liu",
  ko: "튜토리얼: 실용 AI와 프롬프트 엔지니어링 | Luffy Liu",
  es: "Tutoriales prácticos de IA e ingeniería de prompts | Luffy Liu"
};
const STATIC_ENTRIES = [
  "404.html", "CNAME", "apple-touch-icon.png", "assets", "categories", "en",
  "fanfan-cards", "favicon-16x16.png", "favicon-32x32.png", "favicon-48x48.png",
  "icon-192.png", "icon-512.png", "index.html", "page", "robots.txt", "site.webmanifest",
  "support", "tags", "f12ccf366cb74427b4136826edc61235.txt"
];

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");
const escapeXml = escapeHtml;
const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const dateOnly = (value, field) => {
  const candidate = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) {
    throw new Error(`Invalid ${field} date: ${value}`);
  }
  return candidate;
};
const slugify = (value) => String(value).normalize("NFKC").trim().toLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
  .replace(/^-+|-+$/g, "");
const fallbackSlug = (value, prefix) => `${prefix}-${createHash("sha1").update(String(value)).digest("hex").slice(0, 10)}`;
const pageUrl = (base, number) => number === 1 ? base : `${base}page/${number}/`;
const chunks = (items, size) => Array.from({ length: Math.ceil(items.length / size) || 1 }, (_, index) => items.slice(index * size, (index + 1) * size));
const localePath = (locale, relative = "/") => `${LOCALES[locale].prefix}${relative}` || "/";
const localeUrl = (locale, relative = "/") => `${SITE_URL}${localePath(locale, relative)}`;
const feedPath = (locale) => locale === "zh-CN" ? "/index.xml" : `${LOCALES[locale].prefix}/index.xml`;
const hreflangLinks = (alternates = {}) => {
  const links = Object.entries(alternates).map(([locale, url]) => `<link rel="alternate" hreflang="${locale}" href="${url}">`);
  if (alternates["zh-CN"]) links.push(`<link rel="alternate" hreflang="x-default" href="${alternates["zh-CN"]}">`);
  return links.join("\n  ");
};
const ogLocaleTags = (locale, alternateLocales = []) => `<meta property="og:locale" content="${LOCALES[locale].og}">
  ${alternateLocales.filter((item) => item !== locale).map((item) => `<meta property="og:locale:alternate" content="${LOCALES[item].og}">`).join("\n  ")}`;

async function exists(target) {
  try { await fs.access(target); return true; } catch { return false; }
}

async function write(relative, content) {
  const target = path.join(OUT, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
}

async function findMarkdown(directory) {
  const results = [];
  if (!await exists(directory)) return results;
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await findMarkdown(target));
    else if (entry.isFile() && entry.name === "index.md") results.push(target);
  }
  return results.sort();
}

async function loadHomeContent() {
  const homes = new Map();
  for (const locale of Object.keys(LOCALES).filter((item) => item !== "zh-CN")) {
    const source = path.join(HOME_CONTENT, `${locale}.json`);
    const content = JSON.parse(await fs.readFile(source, "utf8"));
    for (const field of ["seo", "navigation", "hero", "recent", "content", "work", "about", "contact", "languagePrompt"]) {
      if (!content[field]) throw new Error(`${path.relative(ROOT, source)} is missing ${field}`);
    }
    if (content.locale !== locale) throw new Error(`${path.relative(ROOT, source)} has locale ${content.locale}`);
    homes.set(locale, content);
  }
  return homes;
}

async function loadCollection(section, directory) {
  const files = await findMarkdown(directory);
  const articles = [];
  const slugs = new Set();

  for (const sourcePath of files) {
    const parsed = matter(await fs.readFile(sourcePath, "utf8"));
    for (const field of REQUIRED_FIELDS) {
      if (parsed.data[field] === undefined || parsed.data[field] === null || parsed.data[field] === "") {
        throw new Error(`${path.relative(ROOT, sourcePath)} is missing front matter field: ${field}`);
      }
    }
    const slug = String(parsed.data.slug);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid stable slug: ${slug}`);
    const localeSlug = `${parsed.data.locale}:${slug}`;
    if (slugs.has(localeSlug)) throw new Error(`Duplicate ${section} slug: ${localeSlug}`);
    slugs.add(localeSlug);
    if (!LOCALES[parsed.data.locale]) throw new Error(`${slug}: unsupported locale ${parsed.data.locale}`);
    if (!Array.isArray(parsed.data.tags) || !parsed.data.tags.length) throw new Error(`${slug}: tags must be a non-empty array`);
    const tags = parsed.data.tags.map((tag) => {
      if (!tag || typeof tag !== "object" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(tag.id)) || !tag.label) {
        throw new Error(`${slug}: every tag must have a stable ASCII id and localized label`);
      }
      return { id: String(tag.id), label: String(tag.label) };
    });

    const published = dateOnly(parsed.data.published, "published");
    const updated = dateOnly(parsed.data.updated, "updated");
    const locale = String(parsed.data.locale);
    const contentKey = String(parsed.data.contentKey);
    if (!/^[a-z]+(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/.test(contentKey)) throw new Error(`${slug}: invalid contentKey`);
    const sourceDir = path.dirname(sourcePath);
    const coverRelative = parsed.data.cover ? String(parsed.data.cover).replace(/^\.\//, "") : "";
    if (section === "blog" && !coverRelative) throw new Error(`${slug}: blog cover is required`);
    const configuredMediaBase = parsed.data.media_base ? String(parsed.data.media_base) : "local";
    const localMedia = configuredMediaBase === "local";
    const sharedMedia = configuredMediaBase.startsWith("shared:");
    if (coverRelative && localMedia && !await exists(path.join(sourceDir, coverRelative))) throw new Error(`${slug}: cover not found: ${coverRelative}`);
    const mediaKey = contentKey.slice(contentKey.indexOf(".") + 1);
    const mediaBase = localMedia ? `/assets/${section}/${mediaKey}` : sharedMedia ? `/assets/${section}/${configuredMediaBase.slice(7)}` : configuredMediaBase.replace(/\/$/, "");

    articles.push({
      ...parsed.data,
      section,
      slug,
      locale,
      contentKey,
      published,
      updated,
      tags,
      draft: Boolean(parsed.data.draft),
      body: parsed.content.trim().replace(/^# .+\n+/, ""),
      sourcePath,
      sourceDir,
      year: published.slice(0, 4),
      url: localePath(locale, `/${section}/${slug}/`),
      absoluteUrl: localeUrl(locale, `/${section}/${slug}/`),
      mediaBase,
      localMedia,
      sharedMedia,
      coverUrl: coverRelative ? `${mediaBase}/${path.basename(coverRelative)}` : null
    });
  }
  const publishedArticles = articles.filter((article) => !article.draft).sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
  const clusters = new Map();
  for (const article of publishedArticles) {
    if (!clusters.has(article.contentKey)) clusters.set(article.contentKey, new Map());
    if (clusters.get(article.contentKey).has(article.locale)) throw new Error(`${article.contentKey}: duplicate ${article.locale} translation`);
    clusters.get(article.contentKey).set(article.locale, article);
  }
  for (const article of publishedArticles) article.translations = clusters.get(article.contentKey);
  return publishedArticles;
}

function languageSwitcher(locale, alternates = {}) {
  return `<div class="language-switch language-switch-six" role="group" aria-label="Language">${Object.entries(LOCALES).map(([code, config]) => {
    const href = alternates[code] || localeUrl(code, "/");
    return `<a href="${href}" data-language="${code}" lang="${config.html}" hreflang="${code}"${code === locale ? ' aria-current="page"' : ""} title="${config.label}">${config.short}</a>`;
  }).join('<span aria-hidden="true">/</span>')}</div>`;
}

function mobileContentNav(locale, active = "") {
  const text = LOCALES[locale];
  return `<nav class="mobile-content-nav" aria-label="${text.contentNav}" data-pagefind-ignore><a href="${localePath(locale, "/tutorials/")}"${active === "tutorials" ? ' aria-current="page"' : ""}>${text.tutorials}</a><a href="${localePath(locale, "/blog/")}"${active === "blog" ? ' aria-current="page"' : ""}>${text.blog}</a></nav>`;
}

function siteHeader(locale, active = "blog", alternates = {}) {
  const text = LOCALES[locale];
  return `<header class="site-header" data-pagefind-ignore>
    <a class="wordmark" href="${localePath(locale, "/")}" aria-label="Luffy Liu ${text.home}"><img class="wordmark-avatar" src="/assets/luffy-avatar.png" width="38" height="38" alt="Luffy Liu"><span>Luffy Liu</span></a>
    <nav class="nav content-nav" aria-label="Navigation"><a href="${localePath(locale, "/")}">${text.home}</a><a href="${localePath(locale, "/tutorials/")}"${active === "tutorials" ? ' aria-current="page"' : ""}>${text.tutorials}</a><a href="${localePath(locale, "/blog/")}"${active === "blog" ? ' aria-current="page"' : ""}>${text.blog}</a><a href="${localePath(locale, "/blog/search/")}">${text.search}</a>${languageSwitcher(locale, alternates)}</nav>
  </header>${mobileContentNav(locale, active)}`;
}

function siteFooter(locale) {
  const text = LOCALES[locale];
  return `<footer class="footer content-shell" data-pagefind-ignore><span>© 2026 Luffy Liu</span><span><a href="${localePath(locale, "/blog/")}">${text.blog}</a> · <a href="${localePath(locale, "/blog/search/")}">${text.search}</a> · <a href="${localePath(locale, "/tutorials/")}">${text.tutorials}</a> · <a href="${feedPath(locale)}">RSS</a></span></footer><script src="/assets/js/language.js" defer></script>`;
}

function baseHead({ title, description, canonical, locale = "zh-CN", alternates = {}, robots = "index, follow, max-image-preview:large", image = `${SITE_URL}/assets/og.png`, type = "website", extra = "" }) {
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f7f9">
  <meta name="robots" content="${robots}">
  <meta name="author" content="Luffy Liu">
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  ${hreflangLinks(alternates)}
  <link rel="alternate" type="application/rss+xml" title="Luffy Liu Blog RSS" href="${SITE_URL}${feedPath(locale)}">
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Luffy Liu">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  ${ogLocaleTags(locale, Object.keys(alternates))}
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="@luffyliux">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">
  ${extra}
  <link rel="stylesheet" href="/assets/css/site.css?v=20260831-1">
  <link rel="stylesheet" href="/assets/css/content.css?v=20260831-1">
  <title>${escapeHtml(title)}</title>`;
}

function pagination(base, current, total, locale) {
  if (total <= 1) return "";
  const links = [];
  if (current > 1) links.push(`<a rel="prev" href="${pageUrl(base, current - 1)}">← Prev</a>`);
  links.push(`<span>第 ${current} / ${total} 页</span>`);
  if (current < total) links.push(`<a rel="next" href="${pageUrl(base, current + 1)}">Next →</a>`);
  return `<nav class="pagination" aria-label="分页">${links.join("")}</nav>`;
}

function postCard(post) {
  return `<article class="content-card">
    <p class="card-label"><time datetime="${post.published}">${post.published.replaceAll("-", " · ")}</time> · ${escapeHtml(post.tags[0].label)}</p>
    <h2><a href="${post.url}">${escapeHtml(post.title)}</a></h2>
    <p>${escapeHtml(post.description)}</p>
    <a class="card-link" href="${post.url}">阅读全文 <span>↗</span></a>
  </article>`;
}

function collectionJsonLd({ canonical, name, posts, locale }) {
  return `<script type="application/ld+json">${json({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#page`,
    url: canonical,
    name,
    inLanguage: LOCALES[locale].html,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({ "@type": "ListItem", position: index + 1, url: post.absoluteUrl, name: post.title }))
    }
  })}</script>`;
}

function listPage({ title, heading, lede, canonical, posts, base, current, total, locale, alternates, eyebrow = "Blog · Notes from practice", section = "blog", robots }) {
  const pageTitle = current === 1 ? title : `${title} · 第 ${current} 页`;
  return `<!doctype html>
<html lang="${LOCALES[locale].html}"><head>
  ${baseHead({ title: pageTitle, description: lede, canonical, locale, alternates, ...(robots ? { robots } : {}) })}
  ${collectionJsonLd({ canonical, name: pageTitle, posts, locale })}
</head><body>
  <a class="skip-link" href="#main">跳到正文</a>
  ${siteHeader(locale, section, alternates)}
  <main id="main">
    <header class="content-header content-shell"><nav class="crumbs" aria-label="Breadcrumb"><a href="${localePath(locale, "/")}">${LOCALES[locale].home}</a><span>/</span><a href="${localePath(locale, `/${section}/`)}">${LOCALES[locale][section]}</a><span>/</span><span aria-current="page">${escapeHtml(heading)}</span></nav><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(heading)}</h1><p class="content-lede">${escapeHtml(lede)}</p><div class="content-actions"><a class="button button-primary" href="${localePath(locale, "/blog/search/")}">${LOCALES[locale].search}</a><a class="button button-quiet" href="${feedPath(locale)}">RSS</a></div></header>
    <section class="listing content-shell" aria-label="Posts"><div class="content-grid">${posts.map(postCard).join("\n")}</div>${pagination(base, current, total, locale)}</section>
  </main>
  ${siteFooter(locale)}
</body></html>\n`;
}

function renderArticle(post) {
  const headingIds = new Map();
  const slugger = (title) => {
    const base = slugify(title) || fallbackSlug(title, "section");
    const count = headingIds.get(base) || 0;
    headingIds.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };
  const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
  md.use(markdownItAnchor, { level: [2, 3], slugify: slugger });
  const markdown = post.body
    .replace(/(!\[[^\]]*\]\()assets\//g, `$1${post.mediaBase}/`)
    .replace(/\]\(\/(blog|tutorials)\//g, `](${LOCALES[post.locale].prefix}/$1/`);
  const tokens = md.parse(markdown, {});
  headingIds.clear();
  const headings = [];
  for (let index = 0; index < tokens.length; index++) {
    if (tokens[index].type === "heading_open" && tokens[index].tag === "h2") {
      const title = tokens[index + 1]?.content || "章节";
      headings.push({ title, id: slugger(title) });
    }
  }
  headingIds.clear();
  const body = md.render(markdown);
  const coverAbsolute = post.coverUrl ? (post.coverUrl.startsWith("http") ? post.coverUrl : `${SITE_URL}${post.coverUrl}`) : null;
  const tags = post.tags.map((tag) => post.section === "blog" ? `<a href="${localePath(post.locale, `/blog/tags/${tag.id}/`)}" data-pagefind-filter="tag:${tag.id}" data-pagefind-meta="tag">${escapeHtml(tag.label)}</a>` : `<span data-pagefind-filter="tag:${tag.id}" data-pagefind-meta="tag">${escapeHtml(tag.label)}</span>`).join(" · ");
  const toc = headings.map((heading) => `<a href="#${escapeHtml(heading.id)}">${escapeHtml(heading.title)}</a>`).join("\n");
  const alternates = Object.fromEntries([...post.translations].map(([locale, translation]) => [locale, translation.absoluteUrl]));
  const articleLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": post.section === "blog" ? "BlogPosting" : "TechArticle", "@id": `${post.absoluteUrl}#article`, url: post.absoluteUrl, mainEntityOfPage: post.absoluteUrl, headline: post.title, description: post.description, ...(coverAbsolute ? { image: coverAbsolute } : {}), datePublished: post.published, dateModified: post.updated, inLanguage: LOCALES[post.locale].html, author: { "@id": `${SITE_URL}/#person` }, publisher: { "@id": `${SITE_URL}/#person` }, articleSection: post.tags[0].label, keywords: post.tags.map((tag) => tag.label) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: LOCALES[post.locale].home, item: localeUrl(post.locale, "/") },
        { "@type": "ListItem", position: 2, name: LOCALES[post.locale][post.section], item: localeUrl(post.locale, `/${post.section}/`) },
        { "@type": "ListItem", position: 3, name: post.title, item: post.absoluteUrl }
      ] }
    ]
  };
  const extra = `<meta property="article:published_time" content="${post.published}">
  <meta property="article:modified_time" content="${post.updated}">
  <meta property="article:author" content="Luffy Liu">
  ${post.tags.map((tag) => `<meta property="article:tag" content="${escapeHtml(tag.label)}">`).join("\n  ")}`;

  return `<!doctype html>
<html lang="${LOCALES[post.locale].html}"><head>
  ${baseHead({ title: post.seoTitle || `${post.title} | Luffy Liu`, description: post.description, canonical: post.absoluteUrl, locale: post.locale, alternates, ...(coverAbsolute ? { image: coverAbsolute } : {}), type: "article", extra })}
  <script type="application/ld+json">${json(articleLd)}</script>
</head><body>
  <a class="skip-link" href="#main">跳到正文</a>
  ${siteHeader(post.locale, post.section, alternates)}
  <main id="main">
    <header class="content-header content-shell">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${localePath(post.locale, "/")}">${LOCALES[post.locale].home}</a><span>/</span><a href="${localePath(post.locale, `/${post.section}/`)}">${LOCALES[post.locale][post.section]}</a><span>/</span><span aria-current="page">${escapeHtml(post.title)}</span></nav>
      <p class="eyebrow">${escapeHtml(post.tags.map((tag) => tag.label).join(" · "))}</p>
      <h1 data-pagefind-meta="title">${escapeHtml(post.title)}</h1>
      <p class="content-lede" data-pagefind-meta="description">${escapeHtml(post.description)}</p>
      <div class="content-meta"><span>Luffy Liu</span><time datetime="${post.published}" data-pagefind-meta="date" data-pagefind-sort="date">${post.published}</time>${post.section === "blog" ? `<a href="${localePath(post.locale, `/blog/archive/${post.year}/`)}" data-pagefind-filter="year:${post.year}">${post.year}</a>` : `<span data-pagefind-filter="year:${post.year}">${post.year}</span>`}<span>${tags}</span></div>
      ${post.coverUrl ? `<figure class="article-cover"><img src="${post.coverUrl}" alt="${escapeHtml(post.cover_alt || post.title)}" fetchpriority="high"></figure>` : ""}
    </header>
    <div class="content-layout content-shell">
      <nav class="content-toc" aria-label="文章目录" data-pagefind-ignore><strong>文章目录</strong>${toc}</nav>
      <article class="prose" data-pagefind-body data-pagefind-filter="section:${post.section}" data-pagefind-filter="locale:${post.locale}">${body}<div class="author-card"><img src="/assets/luffy-avatar.png" width="58" height="58" alt="Luffy Liu"><div><strong>Luffy Liu</strong><p>Independent product builder · AI, agents and real workflows.</p></div></div></article>
    </div>
  </main>
  ${siteFooter(post.locale)}
</body></html>\n`;
}

function searchPage(locale, tags, years, alternates) {
  const copy = COPY[locale];
  const canonical = localeUrl(locale, "/blog/search/");
  return `<!doctype html>
<html lang="${LOCALES[locale].html}"><head>
  ${baseHead({ title: `${copy.searchTitle} | Luffy Liu`, description: copy.searchLede, canonical, locale, alternates, robots: "noindex, follow" })}
</head><body>
  <a class="skip-link" href="#main">Skip</a>${siteHeader(locale, "blog", alternates)}
  <main id="main"><header class="content-header content-shell"><nav class="crumbs" aria-label="Breadcrumb"><a href="${localePath(locale, "/")}">${LOCALES[locale].home}</a><span>/</span><a href="${localePath(locale, "/blog/")}">${LOCALES[locale].blog}</a><span>/</span><span aria-current="page">${copy.searchTitle}</span></nav><p class="eyebrow">Pagefind · Static search</p><h1>${copy.searchTitle}</h1><p class="content-lede">${copy.searchLede}</p></header>
    <section class="search-shell content-shell" aria-label="Search">
      <form id="blog-search-form" class="search-form"><label for="blog-search-input">${copy.keyword}</label><div class="search-row"><input id="blog-search-input" name="q" type="search" autocomplete="off" placeholder="${copy.placeholder}"><button class="button button-primary" type="submit">${copy.submit}</button></div><div class="search-filters"><label>${copy.tag}<select id="blog-search-tag"><option value="">${copy.all}</option>${tags.map((tag) => `<option value="${tag.id}">${escapeHtml(tag.label)}</option>`).join("")}</select></label><label>${copy.year}<select id="blog-search-year"><option value="">${copy.all}</option>${years.map((year) => `<option value="${year}">${year}</option>`).join("")}</select></label></div></form>
      <p id="blog-search-status" class="search-status" aria-live="polite">${copy.prompt}</p><div id="blog-search-results" class="search-results"></div>
    </section>
  </main>${siteFooter(locale)}
  <script type="module">
    const form = document.querySelector('#blog-search-form');
    const input = document.querySelector('#blog-search-input');
    const tag = document.querySelector('#blog-search-tag');
    const year = document.querySelector('#blog-search-year');
    const status = document.querySelector('#blog-search-status');
    const results = document.querySelector('#blog-search-results');
    const pagefind = await import('/pagefind/pagefind.js');
    await pagefind.options({ excerptLength: 30 });
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || ''; tag.value = params.get('tag') || ''; year.value = params.get('year') || '';
    const render = async () => {
      const filters = { locale: ${json(locale)} }; if (tag.value) filters.tag = tag.value; if (year.value) filters.year = year.value;
      const query = input.value.trim(); const search = await pagefind.search(query || null, { filters });
      const loaded = await Promise.all(search.results.slice(0, 20).map((item) => item.data())); results.replaceChildren();
      for (const item of loaded) {
        const article = document.createElement('article'); article.className = 'search-result';
        const title = document.createElement('h2'); const link = document.createElement('a'); link.href = item.url; link.textContent = item.meta.title || item.url; title.append(link);
        const excerpt = document.createElement('p'); excerpt.innerHTML = item.excerpt || '';
        const meta = document.createElement('small'); meta.textContent = [item.meta.date, ...(Array.isArray(item.meta.tag) ? item.meta.tag : [item.meta.tag])].filter(Boolean).join(' · ');
        article.append(title, excerpt, meta); results.append(article);
      }
      status.textContent = search.results.length ? search.results.length + ' result(s), showing ' + loaded.length + '.' : ${json(copy.none)};
      const next = new URLSearchParams(); if (query) next.set('q', query); if (tag.value) next.set('tag', tag.value); if (year.value) next.set('year', year.value); history.replaceState(null, '', next.size ? '?' + next : location.pathname);
    };
    form.addEventListener('submit', (event) => { event.preventDefault(); render(); }); tag.addEventListener('change', render); year.addEventListener('change', render);
    if (input.value || tag.value || year.value) render();
  </script>
</body></html>\n`;
}

function entryHome(locale, content, alternates) {
  const text = LOCALES[locale];
  const canonical = localeUrl(locale, "/");
  const localizedPrefix = LOCALES[locale].prefix;
  const productPath = ["zh-CN", "zh-TW"].includes(locale) ? "/fanfan-cards/" : "/en/fanfan-cards/";
  const homeLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: content.seo.title, description: content.seo.description, inLanguage: text.html, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": `${SITE_URL}/#person` } },
      { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Luffy Liu", url: SITE_URL, image: `${SITE_URL}/assets/luffy-avatar.png`, sameAs: ["https://github.com/CarGod", "https://x.com/luffyliux"] }
    ]
  };
  const homeHeader = `<header class="site-header" data-pagefind-ignore><a class="wordmark" href="#top" aria-label="Luffy Liu ${text.home}"><img class="wordmark-avatar" src="/assets/luffy-avatar.png" width="38" height="38" alt="Luffy Liu"><span>Luffy Liu</span></a><nav class="nav content-nav" aria-label="${escapeHtml(content.navigation.language)}"><a href="#work">${escapeHtml(content.navigation.work)}</a><a href="${localizedPrefix}/tutorials/">${escapeHtml(content.navigation.tutorials)}</a><a href="${localizedPrefix}/blog/">${escapeHtml(content.navigation.blog)}</a><a href="#about">${escapeHtml(content.navigation.about)}</a><a class="nav-github" href="https://github.com/CarGod" target="_blank" rel="noreferrer">${escapeHtml(content.navigation.github)} ↗</a>${languageSwitcher(locale, alternates)}</nav></header>${mobileContentNav(locale)}`;
  return `<!doctype html>
<html lang="${text.html}"><head>
  ${baseHead({ title: content.seo.title, description: content.seo.description, canonical, locale, alternates })}
  <link rel="stylesheet" href="/assets/css/homepage.css?v=20260827-1">
  <script type="application/ld+json">${json(homeLd)}</script>
  <script type="application/json" id="language-copy">${json(content.languagePrompt)}</script>
</head><body>
  <a class="skip-link" href="#main">Skip</a>${homeHeader}
  <main id="main">
    <div id="top" class="hero-shell"><section class="home-hero shell"><div class="home-hero-copy"><p class="eyebrow"><span class="status-dot"></span>${escapeHtml(content.hero.eyebrow)}</p><h1>${escapeHtml(content.hero.quote)}</h1><p class="quote-author">${escapeHtml(content.hero.quoteAuthor)}</p><p class="home-hero-lede">${escapeHtml(content.hero.lede)}</p><div class="hero-actions"><a class="button button-primary" href="#work">${escapeHtml(content.hero.primaryCta)}</a><a class="button button-quiet" href="#recent">${escapeHtml(content.hero.secondaryCta)}</a></div></div><div class="home-hero-visual"><img src="/assets/luffy-avatar.png" width="420" height="420" alt="Luffy Liu"></div></section></div>
    <section class="section shell" id="recent"><p class="section-kicker">${escapeHtml(content.recent.eyebrow)}</p><h2>${escapeHtml(content.recent.title)}</h2><div class="content-grid">${content.recent.items.map((item) => `<article class="content-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("")}</div><p class="listing-intro"><a href="https://github.com/microsoft/vscode/issues/93058" target="_blank" rel="noreferrer">${escapeHtml(content.recent.openSourceLink)} ↗</a></p></section>
    <section class="section shell" id="content"><p class="section-kicker">${escapeHtml(content.content.eyebrow)}</p><h2>${escapeHtml(content.content.title)}</h2><div class="content-grid"><article class="content-card"><p class="card-label">${escapeHtml(content.content.tutorialLabel)}</p><h3><a href="${localizedPrefix}/tutorials/prompt-engineering/">${escapeHtml(content.content.tutorialTitle)}</a></h3><p>${escapeHtml(content.content.tutorialDescription)}</p><a class="card-link" href="${localizedPrefix}/tutorials/">${escapeHtml(content.content.tutorialsCta)} ↗</a></article><article class="content-card"><p class="card-label">${escapeHtml(content.content.blogLabel)}</p><h3><a href="${localizedPrefix}/blog/enterprise-ai-four-stages/">${escapeHtml(content.content.blogTitle)}</a></h3><p>${escapeHtml(content.content.blogDescription)}</p><a class="card-link" href="${localizedPrefix}/blog/">${escapeHtml(content.content.blogCta)} ↗</a></article></div></section>
    <section class="section shell selected-work" id="work"><div class="work-heading"><p class="section-kicker">${escapeHtml(content.work.eyebrow)}</p><h2>${escapeHtml(content.work.title)}</h2></div><article class="product-card"><div class="product-copy"><p class="product-kicker">${escapeHtml(content.work.productType)}</p><h3>${escapeHtml(content.work.productName)}</h3><p>${escapeHtml(content.work.summary)}</p><div class="product-tags">${content.work.features.map((feature) => `<span>${escapeHtml(feature)}</span>`).join("")}</div><p class="product-note">${escapeHtml(content.work.dataNote)}</p><div class="product-actions"><a class="button button-primary" href="${productPath}">${escapeHtml(content.work.primaryCta)}</a><a class="button button-quiet" href="https://chromewebstore.google.com/detail/fanfan-cards/fkpfoklbcifdcijjifpmbgjofdmcncig" target="_blank" rel="noreferrer">${escapeHtml(content.work.storeCta)} ↗</a><a class="button button-quiet" href="https://github.com/CarGod/fanfan" target="_blank" rel="noreferrer">${escapeHtml(content.work.sourceCta)} ↗</a></div></div><div class="product-visual"><img src="/assets/fanfan/contextual-reading-v1.4.png" alt="${escapeHtml(content.work.productName)}" loading="lazy"></div></article></section>
    <section class="section shell about" id="about"><div class="about-index">/ ${escapeHtml(content.about.label).toUpperCase()}</div><div class="about-copy"><h2>${escapeHtml(content.about.headline)}</h2><div class="practice-lines">${content.about.items.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div>`).join("")}</div></div></section>
    <section class="contact shell" id="contact"><p class="section-kicker">${escapeHtml(content.contact.eyebrow)}</p><h2>${escapeHtml(content.contact.headline)}</h2><div class="contact-row"><a class="contact-link" href="mailto:luffyliux@gmail.com"><span><small>Email</small>luffyliux@gmail.com</span><b>↗</b></a><a class="contact-link" href="https://x.com/luffyliux" target="_blank" rel="noreferrer"><span><small>X</small>@luffyliux</span><b>↗</b></a><a class="contact-link" href="https://github.com/CarGod" target="_blank" rel="noreferrer"><span><small>GitHub</small>CarGod</span><b>↗</b></a></div></section>
  </main>${siteFooter(locale)}
</body></html>\n`;
}

function tutorialEntryDescription(locale) {
  const descriptions = {
    "zh-CN": "面向真实工作场景的 AI 与提示工程教程。",
    "zh-TW": "面向真實工作情境的 AI 與提示工程教學。",
    en: "Practical AI and prompt engineering tutorials for real workflows.",
    ja: "実際のワークフローに役立つ AI とプロンプトエンジニアリングのチュートリアル。",
    ko: "실제 워크플로를 위한 AI 및 프롬프트 엔지니어링 튜토리얼입니다.",
    es: "Tutoriales prácticos de IA e ingeniería de prompts para flujos de trabajo reales."
  };
  return descriptions[locale];
}

function tutorialEntry(locale, alternates) {
  const text = LOCALES[locale];
  const canonical = localeUrl(locale, "/tutorials/");
  const description = tutorialEntryDescription(locale);
  return `<!doctype html>
<html lang="${text.html}"><head>${baseHead({ title: `${text.tutorials} | Luffy Liu`, description, canonical, locale, alternates })}</head><body><a class="skip-link" href="#main">Skip</a>${siteHeader(locale, "tutorials", alternates)}<main id="main"><header class="content-header content-shell"><p class="eyebrow">Tutorials · Learn by making</p><h1>${text.tutorials}</h1><p class="content-lede">${description}</p></header><section class="listing content-shell"><p class="listing-intro">Localized tutorials are published only after their translation has been reviewed. The language switch always remains available.</p></section></main>${siteFooter(locale)}</body></html>\n`;
}

async function copyStatic() {
  for (const entry of STATIC_ENTRIES) {
    const source = path.join(ROOT, entry);
    if (!await exists(source)) continue;
    await fs.cp(source, path.join(OUT, entry), { recursive: true, force: true });
  }
}

async function copyContentAssets(articles) {
  const copied = new Set();
  for (const article of articles) {
    const key = `${article.section}:${article.contentKey}`;
    if (!article.localMedia || copied.has(key)) continue;
    const assets = path.join(article.sourceDir, "assets");
    const mediaKey = article.contentKey.slice(article.contentKey.indexOf(".") + 1);
    if (await exists(assets)) await fs.cp(assets, path.join(OUT, "assets", article.section, mediaKey), { recursive: true, force: true });
    copied.add(key);
  }
}

function sitemapUrl(loc, lastmod, image) {
  return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod>${image ? `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>` : ""}</url>`;
}

async function writeSitemaps(articles, generatedPages) {
  const staticPages = [
    { url: "/", lastmod: "2026-08-30", locale: "zh-CN", section: "home" },
    { url: "/en/", lastmod: "2026-08-30", locale: "en", section: "home" },
    { url: "/fanfan-cards/", lastmod: "2026-08-27", locale: "zh-CN", section: "products" },
    { url: "/en/fanfan-cards/", lastmod: "2026-08-27", locale: "en", section: "products" },
    { url: "/fanfan-cards/privacy/", lastmod: "2026-08-27", locale: "zh-CN", section: "products" },
    { url: "/en/fanfan-cards/privacy/", lastmod: "2026-08-27", locale: "en", section: "products" }
  ];
  const records = [
    ...staticPages,
    ...generatedPages,
    ...articles.map((article) => ({
      url: article.url,
      lastmod: article.updated,
      locale: article.locale,
      section: article.section,
      image: article.coverUrl ? (article.coverUrl.startsWith("http") ? article.coverUrl : `${SITE_URL}${article.coverUrl}`) : null
    }))
  ].filter((record) => record.indexable !== false);
  const unique = new Map();
  for (const record of records) unique.set(record.url, record);
  const grouped = new Map();
  for (const record of [...unique.values()].sort((a, b) => a.url.localeCompare(b.url))) {
    const key = `${record.locale}:${record.section}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  }
  const refs = [];
  for (const [key, recordsForShard] of [...grouped].sort(([a], [b]) => a.localeCompare(b))) {
    const [locale, section] = key.split(":");
    const localeSlug = locale.toLowerCase();
    for (const [index, shard] of chunks(recordsForShard, SITEMAP_SIZE).entries()) {
      const filename = `sitemaps/sitemap-${localeSlug}-${section}-${index + 1}.xml`;
      const urls = shard.map((record) => sitemapUrl(`${SITE_URL}${record.url}`, record.lastmod, record.image));
      await write(filename, `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>\n`);
      refs.push(`<sitemap><loc>${SITE_URL}/${filename}</loc><lastmod>${shard.map((record) => record.lastmod).sort().at(-1)}</lastmod></sitemap>`);
    }
  }
  await write("sitemap.xml", `<?xml version="1.0" encoding="utf-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${refs.join("\n")}\n</sitemapindex>\n`);
}

async function writeRss(locale, posts) {
  const items = posts.slice(0, RSS_SIZE).map((post) => `<item><title>${escapeXml(post.title)}</title><link>${post.absoluteUrl}</link><guid isPermaLink="true">${post.absoluteUrl}</guid><pubDate>${new Date(`${post.published}T00:00:00+08:00`).toUTCString()}</pubDate><author>luffyliux@gmail.com (Luffy Liu)</author>${post.tags.map((tag) => `<category>${escapeXml(tag.label)}</category>`).join("")}<description>${escapeXml(post.description)}</description></item>`).join("\n");
  const last = posts[0]?.updated || "2026-08-30";
  const relative = feedPath(locale).slice(1);
  await write(relative, `<?xml version="1.0" encoding="utf-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(COPY[locale].blogTitle)} | Luffy Liu</title><link>${localeUrl(locale, "/blog/")}</link><description>${escapeXml(COPY[locale].blogLede)}</description><language>${LOCALES[locale].html}</language><lastBuildDate>${new Date(`${last}T00:00:00+08:00`).toUTCString()}</lastBuildDate><atom:link href="${SITE_URL}${feedPath(locale)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>\n`);
}

async function enforceSizeBudget() {
  let total = 0;
  const walk = async (directory) => {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(target);
      else if (entry.isFile()) {
        const size = (await fs.stat(target)).size;
        total += size;
        if (/\.(?:avif|gif|jpe?g|png|webp)$/i.test(entry.name) && size > WARN_IMAGE_BYTES) {
          console.warn(`WARN: large image ${(size / 1024 / 1024).toFixed(2)} MiB: ${path.relative(OUT, target)}`);
        }
      }
    }
  };
  await walk(OUT);
  const mib = total / 1024 / 1024;
  if (total > MAX_SITE_BYTES) throw new Error(`Generated site is ${mib.toFixed(2)} MiB; hard limit is 850 MiB.`);
  if (total > WARN_SITE_BYTES) console.warn(`WARN: generated site is ${mib.toFixed(2)} MiB; warning threshold is 750 MiB.`);
  else console.log(`Generated site size before Pagefind: ${mib.toFixed(2)} MiB.`);
}

async function build() {
  await fs.rm(OUT, { recursive: true, force: true });
  if (process.argv.includes("--clean-only")) return;
  await fs.mkdir(OUT, { recursive: true });
  if (process.env.SKIP_STATIC !== "1") await copyStatic();
  const posts = await loadCollection("blog", BLOG_CONTENT);
  const tutorials = await loadCollection("tutorials", TUTORIAL_CONTENT);
  const homes = await loadHomeContent();
  const articles = [...posts, ...tutorials];
  await copyContentAssets(articles);
  const generatedPages = [];

  const localeCodes = Object.keys(LOCALES);
  const homeAlternates = Object.fromEntries(localeCodes.map((locale) => [locale, localeUrl(locale, "/")]));
  const tutorialAlternates = Object.fromEntries(localeCodes.map((locale) => [locale, localeUrl(locale, "/tutorials/")]));
  for (const locale of localeCodes.filter((item) => item !== "zh-CN")) {
    const url = localePath(locale, "/");
    await write(path.join(url.slice(1), "index.html"), entryHome(locale, homes.get(locale), homeAlternates));
    generatedPages.push({ url, lastmod: "2026-08-30", locale, section: "home" });
  }
  for (const article of articles) await write(path.join(article.url.slice(1), "index.html"), renderArticle(article));

  const tutorialsByLocale = new Map(localeCodes.map((locale) => [locale, tutorials.filter((article) => article.locale === locale)]));
  const tutorialPageSets = new Map([...tutorialsByLocale].map(([locale, localized]) => [locale, chunks(localized, PAGE_SIZE)]));
  for (const locale of localeCodes) {
    const pages = tutorialPageSets.get(locale);
    for (let index = 0; index < pages.length; index++) {
      const number = index + 1;
      const base = localePath(locale, "/tutorials/");
      const url = pageUrl(base, number);
      const alternates = Object.fromEntries(localeCodes.filter((code) => tutorialPageSets.get(code).length >= number).map((code) => [code, `${SITE_URL}${pageUrl(localePath(code, "/tutorials/"), number)}`]));
      await write(path.join(url.slice(1), "index.html"), listPage({ title: TUTORIAL_TITLES[locale], heading: LOCALES[locale].tutorials, lede: tutorialEntryDescription(locale), canonical: `${SITE_URL}${url}`, posts: pages[index], base, current: number, total: pages.length, locale, alternates, section: "tutorials", eyebrow: "Tutorials · Learn by making" }));
      generatedPages.push({ url, lastmod: tutorialsByLocale.get(locale)[0]?.updated || "2026-08-30", locale, section: "tutorials" });
    }
  }

  const byLocale = new Map(localeCodes.map((locale) => [locale, posts.filter((post) => post.locale === locale)]));
  const mainPageSets = new Map([...byLocale].map(([locale, localized]) => [locale, chunks(localized, PAGE_SIZE)]));
  for (const locale of localeCodes) {
    const pages = mainPageSets.get(locale);
    for (let index = 0; index < pages.length; index++) {
      const number = index + 1;
      const base = localePath(locale, "/blog/");
      const url = pageUrl(base, number);
      const alternates = Object.fromEntries(localeCodes.filter((code) => mainPageSets.get(code).length >= number).map((code) => [code, `${SITE_URL}${pageUrl(localePath(code, "/blog/"), number)}`]));
      await write(path.join(url.slice(1), "index.html"), listPage({ title: `${COPY[locale].blogTitle} | Luffy Liu`, heading: number === 1 ? LOCALES[locale].blog : `${LOCALES[locale].blog} · ${number}`, lede: COPY[locale].blogLede, canonical: `${SITE_URL}${url}`, posts: pages[index], base, current: number, total: pages.length, locale, alternates }));
      generatedPages.push({ url, lastmod: byLocale.get(locale)[0]?.updated || "2026-08-30", locale, section: "blog" });
    }
  }

  const tagSets = new Map();
  for (const locale of localeCodes) {
    for (const post of byLocale.get(locale)) for (const tag of post.tags) {
      const key = `${locale}:${tag.id}`;
      if (!tagSets.has(key)) tagSets.set(key, { locale, tag, posts: [] });
      tagSets.get(key).posts.push(post);
    }
  }
  for (const { locale, tag, posts: tagged } of [...tagSets.values()].sort((a, b) => `${a.locale}:${a.tag.id}`.localeCompare(`${b.locale}:${b.tag.id}`))) {
    const pages = chunks(tagged, PAGE_SIZE);
    for (let index = 0; index < pages.length; index++) {
      const number = index + 1; const base = localePath(locale, `/blog/tags/${tag.id}/`); const url = pageUrl(base, number);
      const alternates = {};
      for (const code of localeCodes) {
        const peer = tagSets.get(`${code}:${tag.id}`); if (peer && chunks(peer.posts, PAGE_SIZE).length >= number) alternates[code] = `${SITE_URL}${pageUrl(localePath(code, `/blog/tags/${tag.id}/`), number)}`;
      }
      const indexable = tagged.length >= 3;
      await write(path.join(url.slice(1), "index.html"), listPage({ title: `${COPY[locale].tag}: ${tag.label} | Luffy Liu`, heading: `${COPY[locale].tag} · ${tag.label}`, lede: `${tag.label} · ${COPY[locale].blogLede}`, canonical: `${SITE_URL}${url}`, posts: pages[index], base, current: number, total: pages.length, locale, alternates, eyebrow: "Blog tag", robots: indexable ? undefined : "noindex, follow" }));
      generatedPages.push({ url, lastmod: tagged[0].updated, locale, section: "blog-tags", indexable });
    }
  }

  const archiveSets = new Map();
  for (const locale of localeCodes) for (const post of byLocale.get(locale)) {
    const key = `${locale}:${post.year}`; if (!archiveSets.has(key)) archiveSets.set(key, { locale, year: post.year, posts: [] }); archiveSets.get(key).posts.push(post);
  }
  for (const { locale, year, posts: archived } of [...archiveSets.values()].sort((a, b) => `${a.locale}:${b.year}`.localeCompare(`${b.locale}:${a.year}`))) {
    const pages = chunks(archived, PAGE_SIZE);
    for (let index = 0; index < pages.length; index++) {
      const number = index + 1; const base = localePath(locale, `/blog/archive/${year}/`); const url = pageUrl(base, number);
      const alternates = {};
      for (const code of localeCodes) { const peer = archiveSets.get(`${code}:${year}`); if (peer && chunks(peer.posts, PAGE_SIZE).length >= number) alternates[code] = `${SITE_URL}${pageUrl(localePath(code, `/blog/archive/${year}/`), number)}`; }
      await write(path.join(url.slice(1), "index.html"), listPage({ title: `${year} · ${LOCALES[locale].archive} | Luffy Liu`, heading: `${year} · ${LOCALES[locale].archive}`, lede: COPY[locale].blogLede, canonical: `${SITE_URL}${url}`, posts: pages[index], base, current: number, total: pages.length, locale, alternates, eyebrow: "Blog archive" }));
      generatedPages.push({ url, lastmod: archived[0].updated, locale, section: "blog-archive" });
    }
  }

  const searchAlternates = Object.fromEntries(localeCodes.map((locale) => [locale, localeUrl(locale, "/blog/search/")]));
  for (const locale of localeCodes) {
    const localized = byLocale.get(locale);
    const searchable = articles.filter((article) => article.locale === locale);
    const tagMap = new Map(); for (const article of searchable) for (const tag of article.tags) tagMap.set(tag.id, tag);
    const tags = [...tagMap.values()].sort((a, b) => a.label.localeCompare(b.label, locale));
    const years = [...new Set(searchable.map((article) => article.year))].sort().reverse();
    const url = localePath(locale, "/blog/search/");
    await write(path.join(url.slice(1), "index.html"), searchPage(locale, tags, years, searchAlternates));
    generatedPages.push({ url, lastmod: searchable[0]?.updated || "2026-08-30", locale, section: "blog-search", indexable: false });
    await writeRss(locale, localized);
  }
  await writeSitemaps(articles, generatedPages);
  await enforceSizeBudget();
  console.log(`Built ${posts.length} blog post(s), ${tutorials.length} tutorial(s), ${generatedPages.length} collection/search page(s) into ${path.relative(ROOT, OUT)}.`);
}

await build();
