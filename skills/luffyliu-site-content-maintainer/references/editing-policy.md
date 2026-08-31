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

## Corrections and revision logs

Record objective correction categories such as `terminology`, `official-service-links`, `privacy-safety`, `sampling-accuracy`, `structured-output-validation`, or `private-reasoning-boundary`. Do not use word counts, paragraph counts, or prose-length ratios as quality gates.

Every changed GPTPMT guide chapter must be present in `content/tutorials/prompt-engineering/revision-log.yml` and marked `synced` for all six locales after validation.

The GPTPMT source map deliberately combines three protection layers: exact `zh-CN` anchors, localized anchors or unchanged proper names for every locale, and minimum heading/code-block counts for experiment-heavy chapters. Do not weaken these checks to make a shortened rewrite pass. Update an anchor only when the underlying preserved example changes with explicit editorial approval.

## External actions

Content editing does not authorize commit, push, deployment, search-engine submission, or changes to external repositories. Obtain explicit user authorization for each publishing phase.
