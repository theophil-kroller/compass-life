import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('GTD keyboard listener regression #240/#241',()=>{
 const s=read('client/public/gtd-workspace-premium-v577599.js');
 assert.equal(s.match(/document\.addEventListener\('keydown'/g)?.length,1);
 assert.match(s,/dialog\.addEventListener\('keydown'/);
 assert.match(s,/data-create="folder"/);
});

test('Makko six full illustrated cards replace obstructing stretch-zone overlay',()=>{
 const s=read('client/src/makko-ho-guide-v5775910.js');
 const css=read('client/src/makko-ho-guide-v5775910.css');
 for(const p of ['metal','earth','fire','water','innerfire','wood'])assert.match(s,new RegExp(`pose:'${p}'`));
 assert.match(s,/mk616-cardimg/);
 assert.match(s,/webp\?v=5916/);
 assert.doesNotMatch(s,/zoneGraphic\(stage\)|mk614-zones/);
 assert.doesNotMatch(css,/\.mk614-zones\{/);
 assert.match(css,/\.mk616-hero\{/);
});

test('Real Koto and acoustic Gong are preserved; no synthetic fallback',()=>{
 const s=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(s,/cdn\.pixabay\.com\/download\/audio/);
 assert.match(s,/GONG_STORAGE_URL/);
 assert.match(s,/getGong\(\)/);
 assert.match(s,/new Audio\(GONG_DEFAULT_URL\)/);
 assert.doesNotMatch(s,/createOscillator\(/);
 assert.match(s,/if\(remaining===0&&!completed\)/);
});
