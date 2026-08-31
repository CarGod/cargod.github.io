# Editing policy

## Writable content scope

This skill may change only:

- `content/blog/**`
- `content/tutorials/**`

Build scripts, templates, CSS, workflows, product pages, and root metadata require a separately scoped request. `/Users/luffyliu/dream/blogs`, any GPTPMT checkout, and every other sibling repository are permanently read-only references for this skill.

## Source preservation

- Inspect the full current chapter and all six translations before editing.
- For GPTPMT-derived content, compare only against `CarGod/gptpmt` commit `e2f47db` as mapped in `gptpmt-source-map.yml`.
- Use minimum correction: change the inaccurate claim, unsafe instruction, stale endpoint, or broken example while preserving the surrounding teaching path.
- Preserve analogies, personal cases, worked examples, pacing, and chapter order. Do not replace the chapter with an outline, abstract, condensed guide, or newly invented framework.
- Do not remove a protected anchor unless the user explicitly approves that editorial change.
- Do not import MDX `import` statements, React components, or framework markup into Markdown body content. Translate their useful meaning to ordinary Markdown only when necessary.

## Six-locale synchronization

`zh-CN` is the semantic source, not a runtime fallback page. A published cluster must contain real reviewed variants for `zh-TW`, `en`, `ja`, `ko`, and `es`.

Keep these values identical within a cluster: `slug`, `contentKey`, `translation_of`, `published`, `updated`, tag IDs and order, `draft`, and—when present—`series` and `order`. Localize titles, descriptions, `seoTitle`, tag labels, prose, link labels, and examples only where meaning is preserved.

Maintain the same heading-level sequence, fenced-code languages, and JSON/XML example structure in all locales. A translation may phrase prose naturally, but it may not add or remove a teaching step without an explicit editorial decision.

## Images with visible text

- Treat readable words inside a cover, diagram, screenshot annotation, or infographic as part of the translation cluster. A translated page must not silently reuse a Chinese text image.
- Reuse the approved editable SVG or deterministic layout source. Change only text, typography sizing, and necessary line breaks; preserve the illustration, mascot identity, color palette, nodes, arrows, order, and factual relationships.
- Prefer exact SVG/HTML text layout over image-model lettering. Do not regenerate an approved character or background merely to translate labels.
- Text-free assets may remain shared. The Yunzhou avatar is intentionally shared; a cover or diagram containing a title or labels is not.
- Keep localized alt text in the Markdown source and localized SVG `<title>` metadata. Use stable locale-specific filenames so the generated page, Open Graph image, feed, and search result use the same language.
- For `enterprise-ai-four-stages`, run `node scripts/generate-enterprise-ai-localized-visuals.mjs` after changing visual copy, then run `npm run test:localized-visuals` after the site build.

## Corrections and revision logs

Record objective correction categories such as `terminology`, `official-service-links`, `privacy-safety`, `sampling-accuracy`, `structured-output-validation`, or `private-reasoning-boundary`. Do not use word counts, paragraph counts, or prose-length ratios as quality gates.

Every changed GPTPMT guide chapter must be present in `content/tutorials/prompt-engineering/revision-log.yml` and marked `synced` for all six locales after validation.

The GPTPMT source map deliberately combines three protection layers: exact `zh-CN` anchors, localized anchors or unchanged proper names for every locale, and minimum heading/code-block counts for experiment-heavy chapters. Do not weaken these checks to make a shortened rewrite pass. Update an anchor only when the underlying preserved example changes with explicit editorial approval.

## External actions

Content editing does not authorize commit, push, deployment, search-engine submission, or changes to external repositories. Obtain explicit user authorization for each publishing phase.
