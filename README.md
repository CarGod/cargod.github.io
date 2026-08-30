# luffyliu.com

`luffyliu.com` 是一个由 GitHub Pages 托管的纯静态站点。首页和现有产品页保持无框架 HTML；博客、教程、多语言列表、RSS 与 sitemap 由仓库内的轻量 Node 生成器构建，全文搜索由 Pagefind 1.5.2 在构建后生成分片索引。

## 本地构建

需要 Node.js 24（与 GitHub Actions 一致）：

```sh
npm ci
npm run build
npm run validate
```

发布目录是 `_site/`，它是权威构建产物且不会提交到 Git。不要直接发布仓库根目录。首次上线工作流前，必须在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。本仓库只配置工作流，本轮没有执行部署。

新增文章或翻译见 [content/README.md](content/README.md)，架构和容量策略见 [docs/content-architecture.md](docs/content-architecture.md)，搜索引擎提交流程见 [docs/search-submission.md](docs/search-submission.md)，实测结果见 [docs/benchmark-2026-08-30.md](docs/benchmark-2026-08-30.md)。

## 容量边界

GitHub Pages 的源仓库和发布站点建议控制在约 1 GB 内，部署构建应在 10 分钟内完成。本项目在生成产物达到 750 MiB 时警告，达到 850 MiB 时阻断；单图超过 1.5 MiB 会警告。图片优先使用尺寸受控的 WebP/AVIF，并避免重复。

“1 万篇、6 种语言”最多意味着约 6 万个详情页。本机短合成语料实测：单语 1 万详情页产物 110.36 MiB；六语 6 万详情页产物 722.37 MiB、构建与索引合计 42.61 秒。六语结果已接近 750 MiB 预警线，不能直接外推到同等数量的真实长文与图片。运行 `npm run benchmark` 可重复测试单语基线；`npm run benchmark -- --six-locales` 可重复测试六语基线。
