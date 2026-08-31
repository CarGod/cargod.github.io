# Content schema and URL rules

## Source locations

Blog source:

```text
content/blog/YYYY/MM/<slug>/index.md
content/blog/<locale>/YYYY/MM/<slug>/index.md
```

Tutorial source:

```text
content/tutorials/<slug>/index.md
content/tutorials/<series>/<slug>/index.md
content/tutorials/<locale>/<slug>/index.md
content/tutorials/<locale>/<series>/<slug>/index.md
```

`zh-CN` uses the unprefixed source tree. Other locale directory names are exactly `zh-TW`, `en`, `ja`, `ko`, and `es`.

## Required front matter

Every document requires:

```yaml
locale: "zh-CN"
title: "Visible H1"
seoTitle: "Optional natural meta title"
description: "Search description"
slug: "stable-ascii-slug"
contentKey: "tutorial.stable-cluster-key"
translation_of: "/tutorials/canonical-zh-route/"
published: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags:
  - id: "stable-tag-id"
    label: "Localized label"
draft: false
```

Series tutorials additionally require a stable ASCII `series` ID and positive integer `order`. All six translations in a cluster share `slug`, `contentKey`, `translation_of`, dates, tag IDs/order, `draft`, `series`, and `order`.

Dates must parse as ISO calendar dates (`YYYY-MM-DD`; quoting is recommended for consistency). Booleans must be YAML Booleans, not strings. The Markdown body starts below the front matter and must not contain an H1; the template generates the only H1.

## Stable routing

- Default locale: `/blog/<slug>/`, `/tutorials/<slug>/`, or `/tutorials/<series>/<slug>/`.
- Prompt-engineering landing: `/tutorials/prompt-engineering/`.
- Prompt-engineering chapter: `/tutorials/prompt-engineering/<slug>/`.
- Other locales prepend `/zh-tw`, `/en`, `/ja`, `/ko`, or `/es` to the same logical route.
- `translation_of` always stores the unprefixed `zh-CN` canonical route.

Never change a published slug or `contentKey` during ordinary copy editing. Stable tag URLs use tag IDs, not translated labels.

## Markdown structure

- Use H2 for top-level body sections and H3 only below an H2.
- Add a language to every fenced code block: `text`, `json`, `xml`, `js`, and so on.
- Keep JSON examples parseable. Keep XML example tags balanced.
- Ordinary Markdown supports paragraphs, nested lists, blockquotes, tables, strong/emphasis, links, and inline code.
- Do not include MDX imports or JSX components.
- Use root-relative canonical content links in source; the generator localizes them for translated output.

## Validation

Run:

```sh
npm run build
npm run validate
```

The content-sync validator enforces schema types, locale path placement, cluster parity, heading/code structure, internal content targets, protected GPTPMT anchors, revision-log coverage, and generated XML essentials.
