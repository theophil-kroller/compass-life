import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('legacy Sakura file remains optional, real Koto now defaults on demand',()=>{
 const file=new URL('../client/public/makko-ho-music-v5775912/sakura-sakura-compass.mp3',import.meta.url);
 const mp3=readFileSync(file);
 assert.ok(mp3.length>120_000&&mp3.length<500_000,'MP3 size bounded');
 assert.ok(mp3.subarray(0,3).toString()==='ID3'||mp3[0]===255,'MP3 file header');
 const guide=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(guide,/const MUSIC_ROOT=/);
 assert.match(guide,/sakura-sakura-compass\.mp3/);
 assert.match(guide,/let musicEnabled=true/);
 assert.match(guide,/cdn\.pixabay\.com/);
 assert.match(guide,/if\(musicEnabled\)void ensureMusic\(\)/);
 assert.match(guide,/const cached|await cache\.match\(MUSIC_URL\)/);
 assert.match(guide,/await cache\.put\(MUSIC_URL,/);
 assert.match(guide,/musicPlayer\.loop=true/);
 assert.match(guide,/stopMusic\(\);gongPlayer/);
 assert.match(guide,/duckMusic\(\);/);
 assert.match(guide,/data-go="music"/);
 assert.match(guide,/data-go="volume"/);
});
test('New personalized poses preserve 6 variants and invalidate old CacheFirst',()=>{
 const guide=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(guide,/webp\?v=5914/);
 assert.match(guide,/Kopf berührt sanft die Matte/);
 let total=0;
 for(const pose of ['metal','earth','fire','water','innerfire','wood']){
  const f=new URL('../client/public/makko-ho-illustrations-v5775911/'+pose+'.webp',import.meta.url);
  const bytes=readFileSync(f);
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.ok(bytes.length>5000&&bytes.length<50000);
  total+=bytes.length;
 }
 assert.ok(total<120000);
});
test('Project/folder chooser only intercepts mobile and delegates existing actions',()=>{
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
test('Vite historical bridge chain unaffected',()=>{
 const cfg=read('client/vite.config.js');
 assert.match(cfg,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(cfg,/compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(cfg,/globIgnores:/);
});
