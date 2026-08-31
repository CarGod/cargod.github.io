---
name: luffyliu-site-content-maintainer
description: Maintain or add Luffy Liu's luffyliu.com Markdown blog posts and tutorial chapters, including six-locale translation synchronization, GPTPMT-derived prompt-engineering corrections, front matter, revision logs, and content validation. Use when a task edits content/blog/** or content/tutorials/** in this repository. Do not use for unrelated site code, product pages, or external repositories.
---

# Luffy Liu Site Content Maintainer

Maintain the versioned Markdown content in this repository without flattening the author's voice or silently diverging translations.

## Start with the boundary

- Write only below `content/blog/**` and `content/tutorials/**` unless the user separately asks for site-code changes.
- Treat external `blogs` and `gptpmt` repositories as read-only references. Never edit, commit, push, or publish them from this skill.
- For GPTPMT-derived chapters, use the source map pinned to commit `e2f47db`; do not substitute a newer upstream revision without user approval.
- Treat `zh-CN` as the semantic source. Keep every published translation cluster synchronized across `zh-CN`, `zh-TW`, `en`, `ja`, `ko`, and `es`.
- Stop before commit, push, deployment, or search-engine submission unless the user has explicitly authorized that external action.

Read [editing-policy.md](references/editing-policy.md), [voice-profile.md](references/voice-profile.md), and [content-schema.md](references/content-schema.md) before editing. For the prompt-engineering guide, also read [gptpmt-source-map.yml](references/gptpmt-source-map.yml).

## Editing workflow

1. Inspect `git status` and the complete translation cluster. Preserve unrelated and user-owned changes.
2. Identify whether the request is a correction, translation sync, metadata change, or new article. Do not broaden a correction into a rewrite.
3. Make the smallest adequate change in `zh-CN` first. Preserve examples, analogies, cases, sequence, and distinctive phrasing unless they are the factual error being fixed.
4. Apply the same semantic change to all five translated variants. Keep stable IDs, dates, tag IDs, `series`, `order`, links, heading levels, and code-block structure aligned.
5. If a cover or inline image contains readable prose, labels, or a title, localize that image for every published locale from the approved editable source. Share only text-free artwork such as the Yunzhou avatar. Keep layout, illustration, nodes, arrows, and visual identity unchanged; use deterministic SVG text layout for exact copy.
6. For GPTPMT material, keep every protected anchor and remove only the objective legacy error. Never turn a chapter into a summary or generic AI copy.
7. Add or update the relevant revision-log entry with an objective correction category and six-locale sync status.
8. Run `npm run build` and `npm run validate`. Resolve route, Markdown, localized-visual, hreflang, sitemap, RSS, and content-sync failures before handoff.
9. Report changed content, validation, and any editorial choice that still requires the user's decision. Do not publish implicitly.

## Decision rule

If a requested change conflicts with source preservation, factual correctness, or cross-locale parity, pause and present the concrete conflict. Do not silently delete the original example, invent a fact, or leave a partial translation cluster.
