import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
import {exercisePhoto131,EXERCISE_LIBRARY_ENTRIES_131,exerciseAllowedAtPlace135,singleExercisePlan131} from '../client/src/strength-exercise-library-model-v059131.js';
import {normalizeHomeAttachments135} from '../client/src/strength-home-attachments-v059135.js';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('client/public/strength-visuals-v059136/manifest.json'));
const guided=read('client/src/strength-guided-v5775920.js');
const library=read('client/src/strength-exercise-library-model-v059131.js');
const css=read('client/src/strength-guided-v5775920.css');
const ids=['dumbbell-front-raise','assisted-pullup'];

test('both image files are distinct, legitimate WebPs, with side-by-side phases and stable SHA256',()=>{
 assert.equal(manifest.release,'0.5.91.36');
 assert.deepEqual(manifest.images.map(x=>x.id).sort(),ids.slice().sort());
 assert.equal(manifest.original_photo_included,false);
 for(const meta of manifest.images){
  const b=readFileSync(new URL(`../client/public/strength-visuals-v059136/${meta.path}`,import.meta.url));
  assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
  assert.ok(b.length>35_000 && b.length<300_000,meta.id);
  assert.ok(meta.width>=950 && meta.height>=700,meta.id);
  assert.equal(createHash('sha256').update(b).digest('hex'),meta.sha256);
  assert.equal(meta.caption,'START → ENDE');
 }
 assert.notEqual(manifest.images[0].sha256,manifest.images[1].sha256);
});
test('canonical exercise IDs are in catalog; new photo series outranks earlier assets',()=>{
 for(const id of ids){
  assert.ok(EXERCISES.some(x=>x.id===id),id);
  assert.equal(exercisePhoto131(id)?.series,'v059136');
  assert.equal(exercisePhoto131(id)?.kind,'pair');
  assert.ok(exercisePhoto131(id)?.url.endsWith(`strength-visuals-v059136/${id}.webp`));
  assert.ok(guided.includes(`'${id}'`));
 }
 assert.ok(library.indexOf("'v059136'")<library.indexOf("'v059131'"));
 assert.ok(guided.indexOf('NEW_PHOTO_EXERCISES_136.has(curr.id)?')<guided.indexOf('ARM_PHOTO_EXERCISES_131.has(curr.id)?'));
 assert.ok(guided.includes('NEW_PHOTO_ROOT_136}${curr.id}.webp'));
});
test('old photographic collections stay reachable in guided player and library',()=>{
 for(const series of ['130','129','128','127','126'])assert.ok(guided.includes(`EXERCISES_${series}.has(curr.id)?`),series);
 assert.equal(exercisePhoto131('biceps-curl')?.series,'v059131');
 assert.equal(exercisePhoto131('lateral-raise')?.series,'v059130');
 assert.equal(exercisePhoto131('romanian-deadlift')?.series,'v059129');
 assert.equal(exercisePhoto131('pushup')?.series,'v059127');
});
test('guided player keeps confirmation, RIR and weight controls and renders image inside existing scroll region',()=>{
 assert.ok(guided.includes('sets.push({confirmed:true'));
 assert.ok(guided.includes('data-act="confirm"'));
 assert.ok(guided.includes('data-act="set-weight"'));
 assert.ok(guided.includes('data-act="rir"'));
 assert.ok(guided.includes('correctGuidedSessionSetWeight122'));
 assert.ok(guided.includes('class="str620-stage"><div class="str620-art">${NEW_PHOTO_EXERCISES_136'));
 assert.ok(css.includes('.str136-new-figure img{'));
 assert.ok(css.includes('object-fit:contain'));
 assert.ok(css.includes('max-height:min(26dvh,220px)!important'));
 assert.ok(css.includes('.str620-stage{overflow-y:auto'));
});
test('not-yet-mounted home pullup bar remains locked; new images cannot activate equipment',()=>{
 const ex=EXERCISE_LIBRARY_ENTRIES_131.find(e=>e.id==='assisted-pullup');
 assert.ok(ex);
 assert.equal(exerciseAllowedAtPlace135(ex,'home',{attachments:normalizeHomeAttachments135(null)}),false);
 assert.equal(exerciseAllowedAtPlace135(ex,'home',{attachments:normalizeHomeAttachments135({pullupReady:true})}),true);
 assert.throws(()=>singleExercisePlan131({},'assisted-pullup',{place:'home'}),/Kabelzug|Klimmzugstange/);
 assert.equal(singleExercisePlan131({},'dumbbell-front-raise',{place:'home'}).exercises[0].id,'dumbbell-front-raise');
});
test('versions agree, reference portrait excluded and all original image roots preserved',()=>{
 const root=JSON.parse(read('package.json')),client=JSON.parse(read('client/package.json'));
 assert.equal(root.version,'0.5.91.37');assert.equal(client.version,'0.5.91.37');
 assert.match(read('client/src/compass-release-v57759402519.js'),/0\.5\.91\.37/);
 assert.match(read('client/src/main-full-v57759402510.js'),/COMPASS_CLIENT_VERSION='0\.5\.91\.37'/);
 assert.ok(!manifest.images.some(x=>/image\.png|portrait|foto_original/i.test(x.path)));
 assert.ok(guided.includes('strength-visuals-v059130/'));
 assert.ok(guided.includes('strength-visuals-v059129/'));
});
