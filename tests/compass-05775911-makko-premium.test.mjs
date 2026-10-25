import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const poses=['metal','earth','fire','water','innerfire','wood'];

test('Makko guide stays dynamic and Vite plugin ordering remains unchanged',()=>{
 const cfg=read('client/vite.config.js');
 assert.match(cfg,/plugins:\s*\[compass5910StrengthHabitsBridge\(\), nutrition3Bridge\(\)/);
 assert.match(cfg,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(cfg,/compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(cfg,/globIgnores:/);
 const guide=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(guide,/export function openMakkoGuide/);
 assert.match(guide,/import\.meta\.env\?\.BASE_URL/);
 assert.match(guide,/makko-ho-cards-v5775916/);
 assert.doesNotMatch(read('client/index.html'),/makko-ho-cards-v5775916|makko-ho-guide-v5775910\.js/);
});

test('Six complete illustrated information cards exist as local WebP assets',()=>{
 let total=0;
 for(const pose of poses){
  const path=`client/public/makko-ho-cards-v5775916/${pose}.webp`;
  const b=readFileSync(new URL('../'+path,import.meta.url));
  assert.equal(b.toString('ascii',0,4),'RIFF',path);
  assert.equal(b.toString('ascii',8,12),'WEBP',path);
  assert.ok(b.length>10000&&b.length<200000,`${path}: invalid or oversize`);
  total+=b.length;
 }
 assert.ok(total<1_000_000,`Total image payload ${total}`);
});

test('Japanese names, six stages, accessible card labels, uninterrupted timer and finish',()=>{
 const s=read('client/src/makko-ho-guide-v5775910.js');
 for(const p of ['ZENKUTSU','KOKYŪ','KOKAN','ASHI','KOSA','SOKUHO'])assert.ok(s.includes(p),p);
 for(const name of ['Lunge & Dickdarm','Magen & Milz','Herz & Dünndarm','Blase & Niere','Perikard & Dreifacherwärmer','Leber & Gallenblase'])assert.ok(s.includes(name),name);
 for(const pose of poses)assert.match(s,new RegExp(` ${pose}:['"]`));
 assert.match(s,/alt="\$\{ART_LABELS\[stage\.pose\]\}"/);
 for(const item of ['setInterval(tick,200)','data-go="next"','getGong','visibilitychange','onFinish','function drawing(stage)'])assert.ok(s.includes(item),item);
 assert.match(s,/render\(\);\s*panel\.querySelector/);
});

test('Responsive fullscreen layout uses one artwork and never obscures it with a floating inset',()=>{
 const css=read('client/src/makko-ho-guide-v5775910.css');
 const js=read('client/src/makko-ho-guide-v5775910.js');
 for(const key of ['.mk616-cardwrap','.mk616-cardimg','.mk616-hero','.mk616-controls','.mk616-start'])assert.ok(css.includes(key),key);
 assert.match(css,/height:100dvh;max-height:100dvh/);
 assert.match(css,/overflow:hidden/);
 assert.match(css,/object-fit:contain/);
 assert.doesNotMatch(js,/zoneGraphic\(stage\)|mk614-zones/);
});
