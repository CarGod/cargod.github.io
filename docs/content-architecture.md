# 静态内容、多语言与搜索架构

## 发布模型

仓库采用渐进式静态生成：已有首页和产品页由白名单复制，`content/` 中的 Markdown 由 `scripts/build.mjs` 生成，Pagefind 再扫描最终 HTML。只有 `_site/` 会上传为 Pages artifact；`content/`、`scripts/`、`docs/`、`node_modules/`、draft 和 Git 元数据不会进入发布产物。

构建固定使用 package-lock、Node 24 和 Pagefind 1.5.2。页面排序为 `published desc, slug asc`，生成 HTML 不写当前时间，因此相同输入应得到相同静态产物。

## URL 与语言簇

简体中文继续使用根路径以保护现有 URL；其他前缀为 `/zh-tw/`、`/en/`、`/ja/`、`/ko/`、`/es/`。每个 locale 都有首页、博客列表、分页、稳定标签、年度归档、搜索、RSS、教程列表和已存在的内容详情。

每页 canonical 自指。详情页根据同一 `contentKey` 的实际文件生成 hreflang：包含自身、双向互链，且 `x-default` 只指向存在的 `zh-CN` 页面。缺少译文时不生成空详情和 hreflang，也不复制其他语言作为 fallback。列表页只在对应页码实际存在时互链。

浏览器语言只用于非阻塞推荐；不会根据 `navigator.languages` 或 localStorage 自动跳转。只有用户点击普通语言 `<a>` 后才记录偏好。

## 列表、标签、归档与 RSS

- 列表每页 20 条，使用稳定 URL `/blog/page/N/`。
- 标签 URL 使用稳定 ASCII tag id；不足 3 篇的标签页为 `noindex,follow` 且不进 sitemap，避免薄内容膨胀。
- 年度归档保持可索引。
- 每语言一个 RSS，最多最近 50 篇博客。

## Pagefind

Pagefind 只索引带 `data-pagefind-body` 的博客和教程详情。配置不使用 `force_language`，而是按 `<html lang>` 建立六个独立分片；搜索请求始终附带当前 locale filter，每次最多加载 20 条结果。浏览器不会下载单一全量 posts JSON。

Pagefind 的 CJK/韩语召回能力需要用真实查询集持续验收；无 stemming 的语言仍可搜索，但变形词召回可能弱于英语。

## Sitemap

`/sitemap.xml` 始终是根 sitemap index。普通 sitemap 按 `locale + section` 分片，每片最多 5,000 URL；达到更大规模时可继续按年月拆分。hreflang 只在 HTML 维护，避免两套关系源。Google/Bing 提交根 index；百度提交工具若不接受 index，应提交其中直接的 URL 分片。

## 容量与扩容

构建在 750 MiB 预警、850 MiB 阻断，并提示大于 1.5 MiB 的图片。源媒体只在 `content` 保存一份；`media_base` 抽象允许将资源迁到对象存储/CDN，而不改变文章源或公开 URL 结构。

GitHub Pages 约 1 GB 站点/仓库和 10 分钟部署限制是最终边界。1 万逻辑文章若全部有六语，会成为约 6 万个详情页；本机短合成语料已完成这一规模的测试，产物 722.37 MiB，静态构建与 Pagefind 合计 42.61 秒。它证明当前结构能生成 6 万页，但体积已接近 750 MiB 预警线，真实长文仍需在 Actions 同等级环境压测。若完整构建 + Pagefind 接近 8 分钟、产物接近 750 MiB 或仓库接近 800 MiB，应优先控制全量翻译比例并外迁媒体；仍超限时再评估分站或其他静态托管。

## GitHub Pages 切换

首次发布前在 Pages Settings 将 Source 改为 GitHub Actions，然后由 `.github/workflows/pages.yml` 的 build job 生成、校验和上传 `_site`，deploy job 才具备 Pages 与 OIDC 写权限。本次改造不执行部署、push、搜索引擎提交或外部 API 调用。
