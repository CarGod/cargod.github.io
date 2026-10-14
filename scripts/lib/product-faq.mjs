import { readFileSync } from 'node:fs';
export const productFaq = JSON.parse(readFileSync(new URL('../../content/products/product-faq.json', import.meta.url), 'utf8'));
const stripTags = (value) => String(value).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const faqFor = (product, locale) => productFaq[product]?.[locale] || null;
export function faqPageLd(items, url, locale) {
  return { '@type': 'FAQPage', '@id': `${url}#faq`, url, inLanguage: locale, mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: stripTags(q), acceptedAnswer: { '@type': 'Answer', text: stripTags(a) } })) };
}
export function faqSection(faq, { className = 'product-faq', kicker = 'FAQ' } = {}) {
  if (!faq) return '';
  return `<section class="${className}" id="faq" aria-labelledby="faq-heading"><p class="section-kicker">${kicker}</p><h2 id="faq-heading">${esc(faq.title)}</h2>${faq.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`;
}
export const ldScript = (value) => `<script type="application/ld+json">${JSON.stringify(value).replaceAll('<', '\\u003c')}</script>`;
