# Product Advisory Council — SEO and release

## Scope

Six complete locales (Simplified Chinese, Traditional Chinese, English, Japanese, Korean and Spanish), each with one landing page and 56 method pages: 342 routes. Homepages and language switches link to the corresponding locale and preserve the current method. Public repository documentation is available in Chinese and English. Localized examples and methods are editorial adaptations of the public source materials; the skill itself is primarily Chinese.

## Implemented

- Distinct page titles and descriptions, self-referencing HTTPS canonicals, index/follow and large-image preview directives.
- Open Graph and Twitter large-image cards with page-specific titles/descriptions, locale, canonical URL, author, image alt text and a localized 1200 × 630 PNG cover for each language.
- JSON-LD: WebPage and BreadcrumbList on each page; SoftwareSourceCode for the actual skill repository and CreativeWork for method cards. No invented ratings, testimonials, or endorsements.
- Static HTML includes all 56 answers and the front/back method content. JavaScript progressively adds selection and flipping; it is not required to retrieve the content.
- Existing robots.txt permits crawling; the generated sitemap contains the new product and method pages. Six homepage project entries and previous/next method links provide crawlable navigation.
- Avatars have intrinsic image dimensions. CSS respects reduced motion; phone widths and keyboard navigation were checked.
- `npm run test:council` verifies all 342 routes, unique titles, canonical/OG agreement, structured breadcrumbs, sitemap inclusion, referenced method ownership, reciprocal hreflang links, locale completeness, localized homepage links, and six share-image dimensions.

## Documentation media

Actual local page screenshots are stored in the public skill repository under `docs/images/` with corresponding Chinese and English UI images in each README. The sharing cover uses the same public illustration assets; run `node scripts/council-share-previews.mjs` after building to generate six localized HTML compositions in `_site/`, then capture each at 1200 × 630. These compositions are preview artifacts and are removed by the next build.

## Limits

This is an implementation and functional crawlability audit, not evidence of search ranking or indexing. Search Console ownership, indexing submissions, field Core Web Vitals and real-user metrics were not accessed. No claim of rich-result eligibility is made.

Reference guidance: [Google title links](https://developers.google.com/search/docs/appearance/title-link), [structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data). Structured data describes visible content and does not imply results will receive a particular search treatment.
