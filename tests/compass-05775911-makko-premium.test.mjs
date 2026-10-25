import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const positions=['metal','earth','fire','water','innerfire','wood'];

// Existing Vite bridge chain is intentionally unchanged by this art-only patch.
test('Makko-Premium keeps all established bridge ordering and lazy guide integration',()=>{
 const vite=read('client/vite.config.js');
 assert.match(vite,/plugins:\s*\[compass5910StrengthHabitsBridge\(\), nutrition3Bridge\(\)/);
 assert.match(vite,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(vite,/compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(vite,/globIgnores:\s*\[/);
 assert.match(vite,/handler: 'CacheFirst'/);
 assert.match(vite,/urlPattern: \/\\\/makko-ho-illustrations-v5775911/);
 const guide=read('client/src/makko-ho-guide-v5775910.js');
 assert.match(guide,/export function openMakkoGuide/);
 assert.match(guide,/import\.meta\.env\?\.BASE_URL/);
 assert.match(guide,/makko-ho-illustrations-v5775911/);
 assert.doesNotMatch(guide,/const poses=\{/);
});

test('Six distinct local WebP assets are present, bounded and valid',()=>{
 let total=0;
 for(const pose of positions){
  const filename=`client/public/makko-ho-illustrations-v5775911/${pose}.webp`;
  const buffer=readFileSync(new URL('../'+filename,import.meta.url));
  assert.equal(buffer.subarray(0,4).toString(),'RIFF',filename);
  assert.equal(buffer.subarray(8,12).toString(),'WEBP',filename);
  assert.ok(buffer.length<60_000,`${filename}: excessive asset size`);
  assert.ok(statSync(new URL('../'+filename,import.meta.url)).size>5000,filename);
  total+=buffer.length;
 }
 assert.ok(total<120_000,`Six illustrations total ${total} bytes`);
});

test('Guide offers exact six positions, meaningful alt text and retains timer/finish',()=>{
 const guide=read('client/src/makko-ho-guide-v5775910.js');
 for(const label of ['Lunge & Dickdarm','Magen & Milz','Herz & Dünndarm','Blase & Niere','Perikard & Dreifacherwärmer','Leber & Gallenblase'])assert.ok(guide.includes(label));
 for(const pose of positions)assert.match(guide,new RegExp(` ${pose}:['\"]`));
 assert.match(guide,/alt=\\?"\$\{ART_LABELS\[stage\.pose\]\}/);
 for(const event of ['setInterval(tick,200)','data-go="next"','getGong','visibilitychange','onFinish','function drawing(stage)'])assert.ok(guide.includes(event),event);
 assert.match(guide,/render\(\);panel\.querySelector/);
});

test('Styling prioritizes larger figures and retains phone layout without horizontal overflow',()=>{
 const css=read('client/src/makko-ho-guide-v5775910.css');
 for(const key of ['.mk611-artwork','.mk611-pose-image','.mk611-step-number','.mk610-main','.mk610-tip'])assert.ok(css.includes(key),key);
 assert.match(css,/@media\(max-width:680px\)/);
 assert.match(css,/object-fit:contain/);
 const vite=read('client/vite.config.js');
 assert.doesNotMatch(vite,/globPatterns: \[[^\]]*webp/);
 assert.match(vite,/cacheName:'compass-makko-art-on-demand-v5775911'/);
});
