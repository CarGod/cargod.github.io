// Generates /llms.txt (English) and /llms-zh.txt (简体中文) following https://llmstxt.org/
const SITE = 'https://luffyliu.com';
const COPY = {
  en: {
    title: 'Luffy Liu',
    summary: 'Personal site of Luffy Liu, an independent product builder. Independent products, developer tools, and hands-on notes on AI agents, Vibe Coding, prompt engineering and AI workflows. Available in Simplified Chinese (default), Traditional Chinese, English, Japanese, Korean and Spanish.',
    note: 'A Simplified Chinese version of this file is at https://luffyliu.com/llms-zh.txt. Product source code is on GitHub: https://github.com/CarGod.',
    products: 'Products',
    items: [
      ['FanFan Cards', '/en/fanfan-cards/', 'Open-source, local-first Chrome extension for reading English: saved-word highlighting, AI explanations in context, page translation, bilingual YouTube subtitles and spaced review. Chrome Web Store: https://chromewebstore.google.com/detail/ejhmidlnfffkpolnaiflfaojgfbngjba · Source: https://github.com/CarGod/fanfan-cards'],
      ['FanFan Cards privacy policy', '/en/fanfan-cards/privacy/', 'What data FanFan Cards stores locally and what is sent to your chosen AI provider.'],
      ['Product Advisory Council', '/en/product-advisory-council/', 'Open-source AI Skill with 18 product and AI analysis perspectives and 255 method cards for product decisions. Source: https://github.com/CarGod/product-advisory-council'],
      ['Luffy Video Downloader', '/en/luffy-video-download-helper/', 'Open-source Chrome / Edge extension to discover, preview and download videos (MP4, HLS), usable by local Agents via MCP; manual ZIP install. Source: https://github.com/CarGod/luffy-video-download-helper']
    ],
    tutorials: 'Tutorials', blog: 'Blog', optional: 'Optional',
    extra: [['Tutorials index', '/en/tutorials/', 'All tutorials.'], ['Blog index', '/en/blog/', 'All blog posts.'], ['RSS feed', '/en/index.xml', 'Latest English posts.'], ['Sitemap', '/sitemap.xml', 'All pages in every language.']]
  },
  'zh-CN': {
    title: 'Luffy Liu',
    summary: 'Luffy Liu 的个人网站，独立产品构建者。这里有独立产品、开发者工具，以及正在实践的 Agent、Vibe Coding、提示工程与 AI 工作流。默认语言为简体中文，另有繁體中文、English、日本語、한국어、Español 版本。',
    note: '英文版见 https://luffyliu.com/llms.txt 。产品源码在 GitHub：https://github.com/CarGod 。',
    products: '产品',
    items: [
      ['翻翻词卡（FanFan Cards）', '/fanfan-cards/', '开源、本地优先的 Chrome 英语阅读扩展：收藏词自动高亮、AI 语境解释、整页翻译、YouTube 双语字幕和间隔复习。Chrome 商店：https://chromewebstore.google.com/detail/ejhmidlnfffkpolnaiflfaojgfbngjba · 源码：https://github.com/CarGod/fanfan-cards'],
      ['翻翻词卡隐私政策', '/fanfan-cards/privacy/', '翻翻词卡在本机保存哪些数据，以及哪些内容会发往你选择的模型服务商。'],
      ['产品顾问团（Product Advisory Council）', '/product-advisory-council/', '帮你思考产品决策的开源 AI Skill：18 个产品与 AI 分析视角，完整技能含 255 张方法卡。源码：https://github.com/CarGod/product-advisory-council'],
      ['Luffy 视频下载', '/luffy-video-download-helper/', '开源 Chrome / Edge 插件，在网页里发现、预览和下载视频（MP4、HLS），也能让本地 Agent 通过 MCP 调用；下载压缩包后手动安装。源码：https://github.com/CarGod/luffy-video-download-helper']
    ],
    tutorials: '教程', blog: '博客', optional: '可选',
    extra: [['全部教程', '/tutorials/', '教程目录。'], ['全部博客', '/blog/', '博客目录。'], ['RSS', '/index.xml', '最新中文文章。'], ['站点地图', '/sitemap.xml', '全部语言的页面。']]
  }
};
const line = ([name, url, desc]) => `- [${name}](${url.startsWith('http') ? url : SITE + url}): ${desc}`;
export function renderLlms(locale, articles) {
  const c = COPY[locale];
  const mine = articles.filter((a) => a.locale === locale && !a.draft);
  const list = (section) => mine.filter((a) => a.section === section).map((a) => line([a.title, a.url, String(a.description).replace(/\s+/g, ' ').trim()])).join('\n');
  return `# ${c.title}\n\n> ${c.summary}\n\n${c.note}\n\n## ${c.products}\n\n${c.items.map(line).join('\n')}\n\n## ${c.tutorials}\n\n${list('tutorials')}\n\n## ${c.blog}\n\n${list('blog')}\n\n## ${c.optional}\n\n${c.extra.map(line).join('\n')}\n`;
}
