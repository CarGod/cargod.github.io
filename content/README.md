# 内容创作说明

## 新增博客

默认简体中文放在：

```text
content/blog/YYYY/MM/<slug>/index.md
content/blog/YYYY/MM/<slug>/assets/*
```

翻译放在 `content/blog/<locale>/YYYY/MM/<slug>/index.md`。支持的 locale 是 `zh-CN`、`zh-TW`、`en`、`ja`、`ko`、`es`。公开 URL 不含年月，始终是默认语言 `/blog/<slug>/`，其他语言 `/<locale-prefix>/blog/<slug>/`。

```yaml
---
title: "文章标题"
slug: "stable-slug"
contentKey: "blog.stable-slug"
translation_of: "/blog/stable-slug/"
locale: "zh-CN"
description: "独立、具体的搜索摘要。"
seoTitle: "可选的自然短标题 | Luffy Liu"
published: "2026-08-20"
updated: "2026-08-30"
tags:
  - id: "stable-tag-id"
    label: "本地化标签名"
cover: "assets/cover.webp"
cover_alt: "封面替代文本"
media_base: "local"
draft: false
---
```

`contentKey` 是翻译簇唯一标识，所有语言必须完全一致；`translation_of` 保留默认中文 canonical 作为可读元数据。标签 URL 使用稳定 `id`，不能使用翻译后的显示名。

正文从段落或二级标题开始，不要再写 Markdown H1、作者、发布日期或阅读时长，模板会统一生成。站内 `/blog/`、`/tutorials/` 正文链接会按当前 locale 输出。

## 新增教程与翻译

教程默认源是 `content/tutorials/<slug>/index.md`，翻译是 `content/tutorials/<locale>/<slug>/index.md`，`contentKey` 使用 `tutorial.<slug>`。没有完成并审核的翻译就不创建文件；生成器不会输出空详情页，也不会为不存在的译文声明 hreflang。

翻译先在临时工作区完成审校，再移动到正式目录；正式仓库中只保留一份源，不保留 staging 副本。所有译文沿用原文 `published`，翻译或迁移日期写入 `updated`。

## 媒体

- `media_base: local`：资源只放当前默认源同目录 `assets/`，构建复制到 `_site/assets/<section>/<content-key>/`。
- `media_base: shared:<key>`：翻译复用默认源已发布的媒体，不复制第二份。
- `media_base: https://cdn.example.com/path`：直接使用对象存储/CDN；文章 URL 和 Markdown 源无需改变。

推荐 WebP/AVIF、控制像素尺寸、复用图片。仓库或产物接近容量预算时，先把媒体迁到 CDN，文本与元数据继续留在 GitHub。
