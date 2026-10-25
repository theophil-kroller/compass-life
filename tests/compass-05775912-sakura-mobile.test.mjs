import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('Recorded Koto is optional and fetched only after Play, never the legacy synth loop',()=>{
 const s=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(s,/let musicEnabled=true/);
 assert.match(s,/cdn\.pixabay\.com/);
 assert.match(s,/const MUSIC_CACHE=/);
 assert.match(s,/await cache\.match\(MUSIC_URL\)/);
 assert.match(s,/await cache\.put\(MUSIC_URL,/);
 assert.match(s,/musicPlayer\.loop=true/);
 assert.match(s,/stopMusic\(\);gongPlayer/);
 assert.match(s,/duckMusic\(\);/);
 assert.match(s,/data-go="music"/);
 assert.match(s,/data-go="volume"/);
 const startHandler=s.split("panel.querySelector('[data-go=\"start\"]').onclick=")[1];
 assert.ok(startHandler,'play handler exists');
 assert.match(startHandler.slice(0,320),/if\(musicEnabled\)void ensureMusic\(\)/);
 assert.doesNotMatch(s,/sakura-sakura-compass\.mp3|createOscillator\(/);
});

test('Six newer complete cards and cache-busting version 5916',()=>{
 const s=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(s,/makko-ho-cards-v5775917/);
 assert.match(s,/webp\?v=5917/);
 let bytes=0;
 for(const name of ['metal','earth','fire','water','innerfire','wood']){
  const b=readFileSync(new URL('../client/public/makko-ho-cards-v5775917/'+name+'.webp',import.meta.url));
  assert.equal(b.toString('ascii',0,4),'RIFF'); assert.equal(b.toString('ascii',8,12),'WEBP');
  bytes+=b.length;
 }
 assert.ok(bytes<1_000_000);
});

test('Mobile project/folder chooser remains intact',()=>{
 const js=read('client/public/gtd-workspace-premium-v577599.js');
 const css=read('client/public/gtd-workspace-premium-v577599.css');
 assert.match(js,/max-width: 800px/);
 assert.match(js,/tree-add-project/);
 assert.match(js,/tree-add-folder/);
 assert.match(js,/stopImmediatePropagation/);
 assert.match(js,/bypass=true;try\{trigger\.click\(\)/);
 assert.match(css,/\.gtd612-create-backdrop/);
 assert.match(css,/env\(safe-area-inset-bottom\)/);
});

test('Vite historical bridges remain in correct order',()=>{
 const cfg=read('client/vite.config.js');
 assert.match(cfg,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(cfg,/compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(cfg,/globIgnores:/);
});
