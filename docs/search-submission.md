# 搜索引擎收录与提交

站点的公开发现入口：

- Sitemap：`https://luffyliu.com/sitemap.xml`
- RSS：`https://luffyliu.com/index.xml`
- Robots：`https://luffyliu.com/robots.txt`
- IndexNow key：`https://luffyliu.com/f12ccf366cb74427b4136826edc61235.txt`

## Google

部署后在 Google Search Console 验证 `luffyliu.com` 域名资源，并提交 `https://luffyliu.com/sitemap.xml`。Google 已停止支持 sitemap ping，普通博客/教程也不应使用只面向特定内容类型的 Indexing API。

## Bing 与 IndexNow

在 Bing Webmaster Tools 验证站点并提交 sitemap。需要主动通知支持 IndexNow 的搜索引擎时，手动运行：

```sh
sh scripts/submit-indexnow.sh
```

脚本默认提交主要公开页面，也接受站内绝对 URL 参数。提交前应先确认新版本和根目录 key 文件已经在线。

## 百度

在百度搜索资源平台验证站点。根 `sitemap.xml` 是 sitemap index；若百度提交界面要求直接 URL 集，应从根 index 中选择对应的 `sitemaps/sitemap-zh-cn-*.xml` 分片逐一提交。使用快速收录/普通收录 API 时，只从本地环境或 CI Secret 注入 token：

```sh
BAIDU_SITE_TOKEN='从百度搜索资源平台获取' sh scripts/submit-baidu.sh
```

不要把 token 写入脚本、文档、URL 清单或 Git 历史。

## 豆包与其他抓取系统

本站保持公开抓取、语义化 HTML、sitemap 和 RSS。当前没有在项目中配置或虚构“豆包站长提交 API”；若未来出现经过验证的官方入口，再单独接入。
