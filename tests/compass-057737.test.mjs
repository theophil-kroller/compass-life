import test from 'node:test';
import assert from 'node:assert/strict';
import {cyclingSessions,cyclingMuscleSummary,CYCLING_REGIONS} from '../client/src/cycling-muscles-v57737.js';
import {detailedMuscleData,detailedMuscleSvg,detailedMuscleTable,EXERCISE_ANATOMY} from '../client/src/strength-anatomy-v57737.js';
import {PERSONAL_RECIPE_IDS,PERSONAL_RECIPE_PRESETS,recipeSnapshot,personalRecipeParts,personalRecipeKcal,personalRecipeEditor,readPersonalRecipe} from '../client/src/personal-recipes-v57737.js';
import {anatomyRecipes737Bridge} from '../client/anatomy-recipes737-bridge.js';
const sessions=[
 {id:'csv1',day:'2026-10-24',start:'2026-10-24T08:00:00',sport:2,activityType:'Cycling',durationMinutes:45,source:'garmin-activities-csv'},
 {id:'fit1',day:'2026-10-24',start:'2026-10-24T06:00:00Z',sport:2,durationMinutes:45,calories:250,avgHr:110,source:'garmin-fit-session'},
 {id:'csv2',day:'2026-10-22',start:'2026-10-22T08:00:00',sport:2,activityType:'Cycling',durationMinutes:32,source:'garmin-activities-csv'},
 {id:'csv3',day:'2026-10-22',start:'2026-10-22T19:00:00',sport:19,activityType:'Strength Training',durationMinutes:20,source:'garmin-activities-csv'},
 {id:'csv4',day:'2026-09-01',start:'2026-09-01T08:00:00',sport:2,activityType:'Cycling',durationMinutes:45,source:'garmin-activities-csv'}
];
const state={healthImports:{garminSessions:sessions}};
test('Cycling imported Garmin CSV/FIT once despite timezone offset',()=>{const c=cyclingMuscleSummary(state,{range:'7',today:'2026-10-24'});assert.equal(c.rides,2);assert.equal(c.minutes,77);assert.equal(c.days,2);assert(CYCLING_REGIONS.secondary.includes('calves_gastro'));assert(CYCLING_REGIONS.secondary.includes('calves_soleus'));});
test('No cycling as virtual lifting sets',()=>{const empty={sessions:[],activeSets:0};const c=cyclingMuscleSummary(state,{range:'7',today:'2026-10-24'});assert.equal(detailedMuscleData(empty).mapped,0);assert.equal(c.regions.primary.includes('biceps'),false);assert.match(detailedMuscleSvg(empty,'back','roles',c,'cycling'),/Wadenmuskel/);assert.match(detailedMuscleSvg(empty,'back','roles',c,'cycling'),/#F6C95A/);});
test('Different activity contexts render same detailed anatomy',()=>{const model={sessions:[{sets:[{exerciseId:'hip-thrust',reps:10},{exerciseId:'curl-to-press',reps:10}]}]};const x=detailedMuscleData(model);assert.equal(x.mapped,2);assert(x.regions.glute_max.primary>0);assert(x.regions.deltoid_front.primary>0);assert.match(detailedMuscleSvg(model,'back'),/Gesäßmuskel/);assert.match(detailedMuscleTable(model,cyclingMuscleSummary(state,{range:'7',today:'2026-10-24'})),/Ausdauerbeteiligung/);});
test('All four personal recipe presets have correctly exposed defaults',()=>{assert.equal(PERSONAL_RECIPE_IDS.length,4);assert.equal(PERSONAL_RECIPE_PRESETS.length,4);assert(PERSONAL_RECIPE_PRESETS.some(x=>x.id==='salad-personal'));assert(PERSONAL_RECIPE_PRESETS.some(x=>x.id==='bean-salad-personal'));assert(PERSONAL_RECIPE_PRESETS.some(x=>x.id==='fried-egg-personal'));});
test('Salad has 20g salted peanuts, optional vegetables/avocado default omitted',()=>{const r=recipeSnapshot('salad-personal');assert.equal(r.find(x=>x.id==='peanuts').grams,20);assert.equal(r.find(x=>x.id==='avocado').grams,0);assert.equal(r.find(x=>x.id==='carrot').grams,0);});
test('No zero nutrients are fabricated from unknown seasonings',()=>{const r=personalRecipeParts('salad-personal');assert(r.length>=7);assert(!r.some(x=>x.name==='Avocado'));const beans=personalRecipeParts('bean-salad-personal');assert(beans.some(x=>x.name.includes('Käferbohnen')));});
test('Egg recipe reflects extra virgin olive oil and spices',()=>{const r=personalRecipeParts('fried-egg-personal');assert(r.some(x=>x.name.includes('Olivenöl')));assert(r.some(x=>x.name.includes('Kala Namak')));assert(r.some(x=>x.name.includes('Chili')));assert(r.some(x=>x.name.includes('Kurkuma')));});
test('Editable weights preserve other recipe snapshots',()=>{const r=recipeSnapshot('salad-personal',[{id:'pumpkin-oil',grams:20,assumed:false}]);assert.equal(r.find(x=>x.id==='pumpkin-oil').grams,20);assert.equal(recipeSnapshot('salad-personal').find(x=>x.id==='pumpkin-oil').grams,10);const fd=new FormData();for(const a of r)fd.set('recipe737-'+a.id,String(a.grams));assert.equal(readPersonalRecipe('salad-personal',fd).find(x=>x.id==='pumpkin-oil').grams,20);});
test('Food energy estimates explicitly from ingredient parts',()=>{const p=personalRecipeKcal('bean-salad-personal');assert(p.low>200);assert.equal(p.kind,'Rezept-Teilsumme (unvollständig)');assert.match(personalRecipeEditor({foodId:'bean-salad-personal',recipe:[]}),/recipe737-beans/);});
test('Bridge plugin present and safe for unrelated files',()=>{const b=anatomyRecipes737Bridge();assert.equal(b.enforce,'pre');assert.equal(b.transform('unrelated','/assets/any.js'),null);});
test('Two separate Garmin rides of equal duration are not merged merely because they are two hours apart',()=>{
 const both={healthImports:{garminSessions:[
  {id:'c1',day:'2026-10-24',start:'2026-10-24T08:00:00',durationMinutes:20,source:'garmin-activities-csv',activityType:'Cycling'},
  {id:'c2',day:'2026-10-24',start:'2026-10-24T10:00:00',durationMinutes:20,source:'garmin-activities-csv',activityType:'Cycling'}
 ]}};
 assert.equal(cyclingSessions(both,{range:'7',today:'2026-10-24'}).length,2);
});
test('Undocumented rides do not generate cycling muscle colors',()=>{
 const empty=cyclingMuscleSummary({healthImports:{garminSessions:[]}},{range:'28',today:'2026-10-24'});
 assert.equal(empty.rides,0);
 assert.doesNotMatch(detailedMuscleSvg({sessions:[]},'back','roles',empty,'cycling'),/fill="#F6C95A"/);
});
test('Cycling layer can be hidden without altering resistance annotations',()=>{
 const ride=cyclingMuscleSummary(state,{range:'7',today:'2026-10-24'});
 const lift={sessions:[{sets:[{exerciseId:'hip-thrust',reps:10}]}]};
 const withBike=detailedMuscleSvg(lift,'back','roles',ride,'combined');
 const liftingOnly=detailedMuscleSvg(lift,'back','roles',ride,'strength');
 assert.match(withBike,/Radfahren anatomisch mitbeansprucht/);
 assert.doesNotMatch(liftingOnly,/Radfahren anatomisch mitbeansprucht/);
});
test('Guarded bridge transforms expected post-.36 source anchors',()=>{
 const source=[
 "const COMPASS_CLIENT_VERSION='0.5.77.36';",
 "import './nutrition-phyto-v57736.css';",
 "let strengthRange728='28',strengthSide728='front';",
 "const a = strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today,editingId:strengthEditId732});",
 "const b = strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today:localDate(),editingId:strengthEditId732});",
 " // Strength: fast local map toggle, without re-rendering the whole GTD app.",
 "if(item.foodId==='smoothie-personal')item.recipe=readSmoothieForm(fd);item.updatedAt=stamp();"
 ].join('\n');
 const out=anatomyRecipes737Bridge().transform(source,'/any/client/src/main.js');
 assert.match(out.code,/COMPASS_CLIENT_VERSION='0\.5\.77\.37'/);
 assert.match(out.code,/activity:strengthActivity737/);
 assert.match(out.code,/str737-activity/);
 assert.match(out.code,/PERSONAL_RECIPE_IDS\.includes/);
});
test('Guarded anatomy bridge emits both SVG views and cycling tab',()=>{
 const source=[
 "import {applyStrengthAnnotations,manualExerciseMuscles,strengthEditorView} from './strength-editor-v57732.js';",
 "export function strengthInsightsView(state,{range='28',side='front',today=day(new Date()),editingId=''}={}){",
 "const m=strengthPeriod(state,{range,today}); const groups=m.groups;",
 '<div class="str728-visual"><div class="str728-body-panel"><div class="str735-two-maps">',
 "${bodySvg(m,'front',side==='back'?'load':'roles')}",
 "${bodySvg(m,'back',side==='back'?'load':'roles')}",
 "${groupTiles(m)}",
 '<div class="str735-body-legend">'
 ].join('\n');
 const out=anatomyRecipes737Bridge().transform(source,'/other/client/src/strength-insights-v57728.js').code;
 assert.match(out,/detailedMuscleSvg\(m,'front'/);
 assert.match(out,/detailedMuscleSvg\(m,'back'/);
 assert.match(out,/🚲 Radfahren/);
 assert.match(out,/cyclingMuscleSummary/);
 assert.match(out,/detailedMuscleTable/);
});
