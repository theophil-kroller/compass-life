import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const root='/mnt/data/compass-pill-0577371';
const load=path=>import(pathToFileURL(`${root}/${path}`).href);
const state={strengthJournal:{annotations:[
 {sessionId:'old-1',start:'2026-10-10T11:00:00',sets:[
  {exerciseId:'triceps-extension',reps:10,weightKg:12},
  {exerciseId:'triceps-extension',reps:12,weightKg:14},
  {exerciseId:'military-press',reps:8,weightKg:20}]},
 {sessionId:'old-2',start:'2026-10-21T11:00:00',sets:[
  {exerciseId:'triceps-extension',reps:11,weightKg:null},
  {exerciseId:'biceps-curl',reps:9,weightKg:7.5}]},
 {sessionId:'today',start:'2026-10-24T13:00:00',sets:[
  {exerciseId:'triceps-extension',reps:2,weightKg:99}]},
 {sessionId:'future',start:'2026-10-25T09:00:00',sets:[
  {exerciseId:'triceps-extension',reps:3,weightKg:100}]}
]}};

test('previous exercise values use latest explicit reps and last known weight, not zero',async()=>{
 const {recentStrengthExerciseValues}=await load('client/src/strength-recent-defaults-v577371.js');
 const a=recentStrengthExerciseValues(state,'triceps-extension',{before:'2026-10-24T13:00:00',excludeSessionId:'today'});
 assert.equal(a.reps,11);assert.equal(a.weightKg,14);assert.equal(a.day,'2026-10-21');
 assert.equal(recentStrengthExerciseValues(state,'biceps-curl',{before:'2026-10-24T13:00:00'}).weightKg,7.5);
 assert.equal(recentStrengthExerciseValues(state,'unknown',{before:'2026-10-24T13:00:00'}),null);
});

test('future and current session never leak into defaults',async()=>{
 const {recentStrengthExerciseValues}=await load('client/src/strength-recent-defaults-v577371.js');
 assert.equal(recentStrengthExerciseValues(state,'triceps-extension',{before:'2026-10-24T13:00:00',excludeSessionId:'today'}).weightKg,14);
 assert.equal(recentStrengthExerciseValues(state,'military-press',{before:'2026-10-24T13:00:00'}).reps,8);
});

test('unsaved rows use exercise-specific suggestion; changing exercise clears only unchanged auto-filled values',async()=>{
 const {wireStrengthRecentDefaults}=await load('client/src/strength-recent-defaults-v577371.js');
 const events={};
 const repetitions={value:''},weight={value:''};
 const select={value:'triceps-extension',matches:s=>s==='select[name^="exercise-"]',closest:()=>row};
 const row={hint:null,querySelector:s=>s.includes('select[')?select:s.includes('reps-')?repetitions:s.includes('weight-')?weight:s.includes('.str7371')?row.hint:null,
  appendChild(x){row.hint=x;}};
 const form={dataset:{start:'2026-10-24T13:00:00',sessionId:'today'},
  addEventListener:(k,v)=>{events[k]=v;},querySelectorAll:s=>s==='[data-strength-set]'?[row]:[]};
 const oldDocument=globalThis.document;
 globalThis.document={createElement:()=>({textContent:'',hidden:false})};
 try{
  wireStrengthRecentDefaults(form,state);
  events.change({target:select});assert.equal(repetitions.value,'11');assert.equal(weight.value,'14');
  assert.match(row.hint.textContent,/Zuletzt erfasst/);
  select.value='military-press';events.change({target:select});
  assert.equal(repetitions.value,'8');assert.equal(weight.value,'20');
  weight.value='22';select.value='triceps-extension';events.change({target:select});
  assert.equal(repetitions.value,'11');assert.equal(weight.value,'22','manual change must remain');
  assert.equal(Object.keys(events).length,1,'delegated listener only');
  wireStrengthRecentDefaults(form,state);assert.equal(Object.keys(events).length,1);
 }finally{globalThis.document=oldDocument;}
});

test('kcal pill shows details on hover/tap without wide details bar',async()=>{
 const {nutritionMissingEnergyPill}=await load('client/src/nutrition-missing-pill-v577371.js');
 const html=nutritionMissingEnergyPill({missingItems:[],supplementItems:[{id:'a',title:'Bluebonnet ONE for Men',emoji:'💊'}]});
 assert.match(html,/class="n577-pill-details"/);
 assert.match(html,/n577-mini-pill/);
 assert.match(html,/1 ohne kcal/);
 assert.match(html,/Bluebonnet ONE for Men/);
 assert.doesNotMatch(html,/n577-missing-items|Fehlende Energieangaben anzeigen/);
 assert.equal(nutritionMissingEnergyPill({missingItems:[],supplementItems:[]}), '');
});

test('pill distinguishes missing regular food from supplements',async()=>{
 const {nutritionMissingEnergyPill}=await load('client/src/nutrition-missing-pill-v577371.js');
 const html=nutritionMissingEnergyPill({missingItems:[{id:'x',title:'Geheimgericht',reason:'Keine Mengen'}],supplementItems:[]});
 assert.match(html,/ⓘ/);assert.match(html,/Eintrag prüfen/);
 assert.match(html,/pj92-food-edit/);
});

test('guarded bridge updates main and nutrition history only',async()=>{
 const {nutritionPill577371Bridge}=await load('client/nutrition-pill-577371-bridge.js');
 const bridge=nutritionPill577371Bridge();
 const main=`import './strength-recipes-v57737.css';\nconst COMPASS_CLIENT_VERSION='0.5.77.37';\nfunction bindStrengthEditor732(){\n const strengthForm=app.querySelector('#str732-form');\n if(strengthForm)strengthForm.onsubmit=async ev=>{};\n}`;
 const result=bridge.transform(main,'/project/client/src/main.js').code;
 assert.match(result,/0\.5\.77\.37\.1/);assert.match(result,/wireStrengthRecentDefaults\(strengthForm,state\)/);
 assert.match(result,/nutrition-missing-pill-v577371.css/);
 assert.match(result,/strength-recent-defaults-v577371.css/);
 assert.throws(()=>bridge.transform('broken','/project/client/src/main.js'),/Integrationsanker/);
 const history=`import {personalEnergyEstimate} from './energy-goal-v575.js';\nconst tpl=\`<span class="n577-amount">\${'1'}<small>unknown</small></span>\n \${'has'?\`<details class="n577-missing-items"><summary>old</summary></details>\`:''}</div>\`;`;
 const transformed=bridge.transform(history,'/project/client/src/nutrition-history-v577.js').code;
 assert.match(transformed,/nutritionMissingEnergyPill\(r\)/);
 assert.doesNotMatch(transformed,/class="n577-missing-items"/);
 assert.match(transformed,/import \{nutritionMissingEnergyPill\}/);
});

test('CSS keeps pill directly under values, on desktop and phone',()=>{
 const css=readFileSync(`${root}/client/src/nutrition-missing-pill-v577371.css`,'utf8');
 assert.match(css,/\.n577-history \.n577-amount\{display:flex;flex-direction:column;align-items:flex-end/);
 assert.match(css,/\[open\]/);
 assert.match(css,/@media\(hover:hover\)/);
 assert.match(css,/@media\(max-width:580px\)/);
});
