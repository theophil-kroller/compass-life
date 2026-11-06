import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
const root = new URL('../client/',import.meta.url);
const js = readFileSync(new URL('src/strength-guided-v5775920.js',root),'utf8');
const css = readFileSync(new URL('src/strength-guided-v5775920.css',root),'utf8');
const manifest = JSON.parse(readFileSync(new URL('public/strength-visuals-v059129/manifest.json',root),'utf8'));
const ids = ['calf-raise','romanian-deadlift','leg-press','lunge','leg-extension','leg-curl','hip-thrust','glute-bridge'];
test('Eight individually generated leg/glute images exist, are unique, have both poses and match checksum manifest',()=>{
 assert.equal(manifest.release,'0.5.91.29');
 assert.equal(manifest.count,8);
 assert.deepEqual(Object.keys(manifest.images).sort(),[...ids].sort());
 const hashes = new Set();
 for(const id of ids){
  const exercise=EXERCISES.find(ex=>ex.id===id);
  assert.equal(exercise?.group,'Beine',id);
  const path=new URL(`public/strength-visuals-v059129/${id}.webp`,root);
  const bytes=readFileSync(path);
  assert.ok(bytes.length>20_000,id);
  assert.equal(bytes.toString('ascii',0,4),'RIFF',id);
  assert.equal(bytes.toString('ascii',8,12),'WEBP',id);
  const checksum=createHash('sha256').update(bytes).digest('hex');
  assert.equal(manifest.images[id].sha256,checksum,id);
  assert.deepEqual(manifest.images[id].phases,['START','ENDE'],id);
  assert.equal(manifest.images[id].dimensions[0],1448,id);
  assert.ok(manifest.images[id].dimensions[1]>=450 && manifest.images[id].dimensions[1]<=1015,id);
  hashes.add(checksum);
 }
 assert.equal(hashes.size,8);
});
test('Coach shows eight new images before older calf and all other visual branches',()=>{
 const leg=js.indexOf('LEG_GLUTE_PHOTO_EXERCISES_129.has(curr.id)?');
 const back=js.indexOf('BACK_CORE_PHOTO_EXERCISES_128.has(curr.id)?');
 const chest=js.indexOf('CHEST_PHOTO_EXERCISES_127.has(curr.id)?');
 const calf=js.indexOf('CUSTOM_PHOTO_EXERCISES_126.has(curr.id)?');
 const fallback=js.indexOf(':exerciseMovementSvg(curr.id)}');
 assert.ok(leg>0&&back>leg&&chest>back&&calf>chest&&fallback>calf);
 assert.match(js,/LEG_GLUTE_PHOTO_ROOT_129=VISUAL_ROOT\.replace/);
 assert.ok(js.includes('LEG_GLUTE_PHOTO_ROOT_129}${curr.id}.webp'));
 assert.ok(js.includes('LEG_GLUTE_PHASE_CUES_129[curr.id]'));
 assert.ok(css.includes('.str129-leg-glute-figure img'));
 for (const id of ids) assert.ok(js.includes(`'${id}'`),id);
});
test('Previous visual collections retained without overwriting and training data untouched',()=>{
 assert.ok(statSync(new URL('public/strength-visuals-v059126/calf-raise.webp',root)).size>20000);
 for(const [dir,count] of [['v059127',7],['v059128',6]]){
  const prefix=`public/strength-visuals-${dir}`;
  const m=JSON.parse(readFileSync(new URL(`${prefix}/manifest.json`,root),'utf8'));
  assert.equal(m.count,count,dir);
  for(const [id,obj] of Object.entries(m.images)){
   const b=readFileSync(new URL(`${prefix}/${id}.webp`,root));
   assert.equal(createHash('sha256').update(b).digest('hex'),obj.sha256,id);
  }
 }
 assert.ok(js.includes('sets.push({confirmed:true'));
 assert.ok(js.includes('saveRir=('));
 assert.ok(js.includes('correctGuidedSessionSetWeight122'));
});
test('Release numbers and PWA base paths are internally aligned',()=>{
 const rootp=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 const cp=JSON.parse(readFileSync(new URL('package.json',root),'utf8'));
 assert.equal(rootp.version,'0.5.91.31');assert.equal(cp.version,'0.5.91.31');
 assert.match(readFileSync(new URL('src/compass-release-v57759402519.js',root),'utf8'),/0\.5\.91\.31/);
 assert.match(readFileSync(new URL('src/main-full-v57759402510.js',root),'utf8'),/COMPASS_CLIENT_VERSION='0\.5\.91\.31'/);
 assert.ok(js.includes("VISUAL_ROOT.replace('strength-visuals-v5775920/','strength-visuals-v059129/')"));
});
