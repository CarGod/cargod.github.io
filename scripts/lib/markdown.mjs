import MarkdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItCjkFriendly from "markdown-it-cjk-friendly";

export function createMarkdownRenderer({ slugify } = {}) {
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: false
  });

  // CommonMark's delimiter rules reject natural CJK such as
  // `**正确性：**事实`. This maintained extension changes only the
  // emphasis boundary rules and keeps standard Markdown behavior elsewhere.
  md.use(markdownItCjkFriendly);

  if (slugify) md.use(markdownItAnchor, { level: [2, 3], slugify });
  return md;
}
