import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

// Keep CSS beside its source so relative font/image URLs still resolve.
export async function fingerprintStylesheets(out) {
  const files = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile()) files.push(file);
    }
  }
  await walk(out);
  const versions = new Map();
  for (const file of files) {
    const relative = path.relative(out, file).split(path.sep).join('/');
    if (!/^assets\/css\/[^/]+\.css$/.test(relative)) continue;
    const contents = await fs.readFile(file);
    const hash = createHash('sha256').update(contents).digest('hex').slice(0, 16);
    const versioned = relative.replace(/\.css$/, `.${hash}.css`);
    await fs.writeFile(path.join(out, versioned), contents);
    versions.set(`/${relative}`, `/${versioned}`);
  }
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const html = await fs.readFile(file, 'utf8');
    const updated = html.replace(/\bhref=(['"])(\/assets\/css\/[^'"?#]+\.css)(?:\?[^'"#]*)?(?:#[^'"]*)?\1/g,
      (match, quote, url) => versions.has(url) ? `href=${quote}${versions.get(url)}${quote}` : match);
    if (updated !== html) await fs.writeFile(file, updated);
  }
}
