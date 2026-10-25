import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(root+'/'+p,'utf8');
test('GTD keyboard listener regression #240/#241',()=>{
 const t=read('client/public/gtd-workspace-premium-v577599.js');
 assert.equal(t.match(/document\.addEventListener\('keydown'/g)?.length,1);
 assert.match(t,/dialog\.addEventListener\('keydown'/);
 assert.match(t,/data-create="folder"/);
});
test('six stretch zones paired with six pictures',()=>{
 const s=read('client/src/makko-ho-guide-v5775910.js');
 for(const n of ['metal','earth','fire','water','innerfire','wood'])assert.match(s,new RegExp(n+':\\{label:'));
 assert.match(s,/zoneGraphic\(stage\)/);assert.match(s,/mk614-zones/);
 assert.match(s,/webp\?v=5914/);
});
test('real audio source not legacy synthesized default, optional recorded gong',()=>{
 const s=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(s,/cdn\.pixabay\.com\/download\/audio/);
 assert.match(s,/GONG_STORAGE_URL/);assert.match(s,/getGong\(\)/);
 assert.match(s,/data-go="gongfile"/);
 assert.doesNotMatch(s,/createOscillator\(/);
 assert.match(s,/if\(remaining===0&&!completed\)/);
});
