import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fingerprintStylesheets } from './lib/stylesheets.mjs';
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'site-css-'));
const html = '<link rel="stylesheet" href="/assets/css/homepage.css?v=old">';
try {
  await fs.mkdir(path.join(temp, 'assets/css'), {recursive:true});
  await fs.mkdir(path.join(temp, 'en'), {recursive:true});
  async function build(css) {
    // Fresh build artifact, matching build.mjs's clean-first lifecycle.
    for(const file of await fs.readdir(path.join(temp,'assets/css'))) await fs.unlink(path.join(temp,'assets/css',file));
    await fs.writeFile(path.join(temp,'assets/css/homepage.css'),css);
    for(const route of ['index.html','en/index.html']) await fs.writeFile(path.join(temp,route),html);
    await fingerprintStylesheets(temp);
    const result=await fs.readFile(path.join(temp,'index.html'),'utf8');
    assert.equal(await fs.readFile(path.join(temp,'en/index.html'),'utf8'),result);
    const url=result.match(/href="([^"]+)"/)[1];
    assert.match(url,/homepage\.[a-f0-9]{16}\.css$/);
    assert.equal(await fs.readFile(path.join(temp,url.slice(1)),'utf8'),css);
    return url;
  }
  const before=await build('img{display:block}');
  assert.equal(await build('img{display:block}'),before);
  assert.notEqual(await build('.council-home-portraits{display:grid}'),before);
  console.log('CSS cache regression: content changes produce new URLs across locales; unchanged content stays stable.');
} finally { await fs.rm(temp,{recursive:true,force:true}); }
