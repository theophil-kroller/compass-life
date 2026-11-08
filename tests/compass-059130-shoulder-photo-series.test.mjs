import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
const client=new URL('../client/',import.meta.url);
const js=readFileSync(new URL('src/strength-guided-v5775920.js',client),'utf8');
const css=readFileSync(new URL('src/strength-guided-v5775920.css',client),'utf8');
const m=JSON.parse(readFileSync(new URL('public/strength-visuals-v059130/manifest.json',client),'utf8'));
const ids=['shoulder-press','lateral-raise','reverse-fly','seated-dumbbell-press','pike-pushup','prone-y-raise'];
test('six distinct individually generated shoulder visual files and accurate checksum manifest',()=>{
 assert.equal(m.release,'0.5.91.30');assert.equal(m.series,'Schultern');assert.equal(m.count,6);
 assert.deepEqual(Object.keys(m.images).sort(),ids.slice().sort());
 const hashes=new Set();
 for(const id of ids){
  assert.equal(EXERCISES.find(ex=>ex.id===id)?.group,'Schultern',id);
  const content=readFileSync(new URL(`public/strength-visuals-v059130/${id}.webp`,client));
  assert.ok(content.length>20_000,id);
  assert.equal(content.toString('ascii',0,4),'RIFF',id);assert.equal(content.toString('ascii',8,12),'WEBP',id);
  assert.deepEqual(m.images[id].phases,['START','ENDE']);
  assert.equal(m.images[id].sha256,createHash('sha256').update(content).digest('hex'),id);
  assert.equal(m.images[id].dimensions[0],1448,id);
  assert.ok(m.images[id].dimensions[1]>=600 && m.images[id].dimensions[1]<=960,id);
  assert.ok(m.images[id].startCue?.length>15&&m.images[id].endCue?.length>15,id);
  hashes.add(m.images[id].sha256);
 }
 assert.equal(hashes.size,6);
});
test('Guided coach uses shoulder photographs before old visual branches and text fallback',()=>{
 const shoulder=js.indexOf('SHOULDER_PHOTO_EXERCISES_130.has(curr.id)?');
 const leg=js.indexOf('LEG_GLUTE_PHOTO_EXERCISES_129.has(curr.id)?');
 const back=js.indexOf('BACK_CORE_PHOTO_EXERCISES_128.has(curr.id)?');
 const chest=js.indexOf('CHEST_PHOTO_EXERCISES_127.has(curr.id)?');
 const calf=js.indexOf('CUSTOM_PHOTO_EXERCISES_126.has(curr.id)?');
 const fallback=js.indexOf(':exerciseMovementSvg(curr.id)}');
 assert.ok(shoulder>0&&leg>shoulder&&back>leg&&chest>back&&calf>chest&&fallback>calf);
 assert.match(js,/SHOULDER_PHOTO_ROOT_130=VISUAL_ROOT\.replace/);
 assert.ok(js.includes('SHOULDER_PHOTO_ROOT_130}${curr.id}.webp'));
 assert.ok(js.includes('SHOULDER_PHOTO_HEIGHT_130[curr.id]'));
 assert.ok(js.includes('SHOULDER_PHASE_CUES_130[curr.id]'));
 assert.ok(css.includes('.str130-shoulder-figure img'));
 for(const id of ids)assert.ok(js.includes(`'${id}'`),id);
});
test('Prior historical figure sets, their hashes and all training confirmation code remain unchanged',()=>{
 for(const [dir,count] of [['v059127',7],['v059128',6],['v059129',8]]){
  const prefix=`public/strength-visuals-${dir}`;
  const old=JSON.parse(readFileSync(new URL(`${prefix}/manifest.json`,client),'utf8'));
  assert.equal(old.count,count);
  for(const [id,data] of Object.entries(old.images)){
   const file=readFileSync(new URL(`${prefix}/${id}.webp`,client));
   assert.equal(createHash('sha256').update(file).digest('hex'),data.sha256,id);
  }
 }
 assert.ok(statSync(new URL('public/strength-visuals-v059126/calf-raise.webp',client)).size>20_000);
 assert.ok(js.includes('sets.push({confirmed:true'));
 assert.ok(js.includes('saveRir=('));
 assert.ok(js.includes('correctGuidedSessionSetWeight122'));
});
test('Release identifiers and asset paths updated for shoulder version without regressions',()=>{
 const root=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 const pkg=JSON.parse(readFileSync(new URL('package.json',client),'utf8'));
 assert.equal(root.version,'0.5.91.37');assert.equal(pkg.version,'0.5.91.37');
 assert.match(readFileSync(new URL('src/compass-release-v57759402519.js',client),'utf8'),/0\.5\.91\.37/);
 assert.match(readFileSync(new URL('src/main-full-v57759402510.js',client),'utf8'),/COMPASS_CLIENT_VERSION='0\.5\.91\.37'/);
 assert.ok(js.includes("VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v059130/')"));
 assert.equal((js.match(/import\.meta\.env\?\.BASE_URL/g)||[]).length,1);
});
