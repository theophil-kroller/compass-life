import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
const base=new URL('../client/',import.meta.url);
const source=readFileSync(new URL('src/strength-guided-v5775920.js',base),'utf8');
const css=readFileSync(new URL('src/strength-guided-v5775920.css',base),'utf8');
const m=JSON.parse(readFileSync(new URL('public/strength-visuals-v059127/manifest.json',base),'utf8'));
const ids=['incline-bench','pushup','chest-press','chest-fly','close-grip-bench','decline-pushup','incline-pushup'];
test('seven distinct generated chest images are installed in current PWA public asset folder',()=>{
 assert.equal(m.release,'0.5.91.27');
 assert.equal(m.count,7);
 assert.deepEqual(Object.keys(m.images).sort(),[...ids].sort());
 for(const id of ids){
   const e=EXERCISES.find(e=>e.id===id);
   assert.ok(e,`exercise ID ${id} is in canonical library`);
   assert.equal(e.group,'Brust',`exercise ${id} is categorised as chest`);
   const photo=new URL(`public/strength-visuals-v059127/${id}.webp`,base);
   assert.ok(statSync(photo).size>20_000,`${id} too small or missing`);
   const bytes=readFileSync(photo);
   assert.equal(bytes.toString('ascii',0,4),'RIFF',id);
   assert.equal(bytes.toString('ascii',8,12),'WEBP',id);
   assert.deepEqual(m.images[id].phases,['START','ENDE']);
 }
});
test('guided workout checks chest photo mapping before calf/premium and textual fallback',()=>{
 const i=source.indexOf('CHEST_PHOTO_EXERCISES_127.has(curr.id)?');
 const calf=source.indexOf('CUSTOM_PHOTO_EXERCISES_126.has(curr.id)?');
 const later=source.indexOf(':exerciseMovementSvg(curr.id)}');
 assert.ok(i>0 && calf>i && later>calf);
 assert.match(source,/CHEST_PHOTO_ROOT_127=VISUAL_ROOT\.replace\('strength-visuals-v5775920\/','strength-visuals-v059127\/'\)/);
 for(const id of ids)assert.match(source,new RegExp(`['"]${id}['"]`));
 assert.match(source,/CHEST_PHOTO_ROOT_127}\$\{curr\.id}\.webp/);
 assert.match(source,/str127-chest-figure/);
 assert.match(css,/\.str127-chest-figure img/);
});
test('Calf Raise and all other existing photograph collections remain selected',()=>{
 assert.match(source,/CUSTOM_PHOTO_EXERCISES_126=new Set\(\['calf-raise'\]\)/);
 assert.ok(statSync(new URL('public/strength-visuals-v059126/calf-raise.webp',base)).size>20_000);
 for(const marker of ['NEW_EXERCISES_BY_ID_89.has(curr.id)','PREMIUM_VISUALS.has(curr.id)','COACH_PREMIUM_PHOTOS.has(curr.id)'])assert.ok(source.includes(marker),marker);
 assert.equal((source.match(/import\.meta\.env\?\.BASE_URL/g)||[]).length,1);
});
test('visual release updates without altering actual training data logic',()=>{
 const root=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 const client=JSON.parse(readFileSync(new URL('package.json',base),'utf8'));
 assert.equal(root.version,client.version);assert.equal(root.version,'0.5.91.37');
 const visible=readFileSync(new URL('src/compass-release-v57759402519.js',base),'utf8');
 assert.match(visible,/0\.5\.91\.37/);
 assert.ok(source.includes('sets.push({confirmed:true'), 'set confirmation code unchanged');
 assert.ok(source.includes('saveRir=('), 'RIR editing code unchanged');
});
