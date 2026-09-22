# Product Advisory Council — SEO and release

## Scope

One Chinese product landing page and 56 Chinese method pages. Five translated homepages link to the Chinese product explicitly; no nonexistent English product URL or hreflang equivalent is advertised. Public repository documentation is available in Chinese and English.

## Implemented

- Distinct page titles and descriptions, self-referencing HTTPS canonicals, index/follow and large-image preview directives.
- Open Graph and Twitter large-image cards with page-specific titles/descriptions, locale, canonical URL, author, image alt text and a 1200 × 630 PNG cover.
- JSON-LD: WebPage and BreadcrumbList on each page; SoftwareSourceCode for the actual skill repository and CreativeWork for method cards. No invented ratings, testimonials, or endorsements.
- Static HTML includes all 56 answers and the front/back method content. JavaScript progressively adds selection and flipping; it is not required to retrieve the content.
- Existing robots.txt permits crawling; the generated sitemap contains the new product and method pages. Six homepage project entries and previous/next method links provide crawlable navigation.
- Avatars have intrinsic image dimensions. CSS respects reduced motion; phone widths and keyboard navigation were checked.
- `npm run test:council` verifies all 57 routes, unique titles, canonical/OG agreement, structured breadcrumbs, sitemap inclusion, referenced method ownership, and share-image dimensions.

## Documentation media

Actual local page screenshots are stored in the public skill repository under `docs/images/` and reused by both README languages. They show the Chinese UI, explicitly stated in English documentation. The sharing cover uses the same public illustration assets; its reproducible HTML composition is `docs/council-social-preview.html` (serve it against the built site's asset root and capture at 1200 × 630).

## Limits

This is an implementation and functional crawlability audit, not evidence of search ranking or indexing. Search Console ownership, indexing submissions, field Core Web Vitals and real-user metrics were not accessed. No claim of rich-result eligibility is made.

Reference guidance: [Google title links](https://developers.google.com/search/docs/appearance/title-link), [structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data). Structured data describes visible content and does not imply results will receive a particular search treatment.
