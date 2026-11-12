import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISE_ANATOMY} from '../client/src/strength-anatomy-v57737.js';
import {vtaperBenefit141} from '../client/src/strength-vtaper-purpose-v059141.js';
import {exerciseProgressionView141} from '../client/src/strength-exercise-progression-v059141.js';
const src=name=>readFileSync(new URL('../client/src/'+name,import.meta.url),'utf8');
test('Each classified workout exercise has a single brief, informative V-Taper sentence',()=>{
 for(const id of Object.keys(EXERCISE_ANATOMY)){
  const text=vtaperBenefit141(id);
  assert.equal(typeof text,'string',id);
  assert.ok(text.length>=40 && text.length<165,`Length ${id}: ${text.length}`);
  assert.match(text,/[.!]$/,id);
 }
 assert.equal(vtaperBenefit141('unmapped-fit-429'),null);
 assert.match(vtaperBenefit141('dumbbell-lateral-raise'),/Seitliche Schultern.*3D-Effekt/);
 assert.match(vtaperBenefit141('lat-pulldown'),/Latissimus/);
 assert.match(vtaperBenefit141('ab-wheel-kneeling'),/lokales Bauchfett verbrennt er nicht/);
});
test('Motivational cue is visible in complete workout preview, optional extra and active exercise',()=>{
 const ui=src('strength-guided-v5775920.js');
 assert.match(ui,/vtaperBenefit141\(exercise.id\)/);
 assert.match(ui,/vtaperBenefit141\(bonusCandidate.id\)/);
 assert.match(ui,/vtaperBenefit141\(curr.id\)/);
 const css=src('strength-guided-v5775920.css');
 assert.match(css,/\.str92-tile \.str141-purpose\{display:block/);
 assert.match(css,/@media\(max-width:600px\)\{\.str92-tile \.str141-purpose\{display:block/);
});
test('Same sentence is shared with standalone exercise preview and strength progression',()=>{
 assert.match(src('strength-exercise-library-ui-v059131.js'),/vtaperBenefit141\(ex.id\)/);
 const model={today:'2026-11-12',sessions:[{day:'2026-11-12',sets:[{exerciseId:'dumbbell-lateral-raise',weightKg:6,reps:10}]}]};
 const html=exerciseProgressionView141(model);
 assert.match(html,/3D-Effekt/);
 assert.match(html,/str141-purpose/);
 assert.match(html,/6\s*<span>kg/);
});
