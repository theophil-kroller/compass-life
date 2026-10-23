import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planningCheckpoint,restorePlanningCheckpoint,afterPlanningPaint} from '../client/src/fast-planning-v57721.js';
import {nutritionIntelligenceView,bioactiveDay} from '../client/src/nutrition-intelligence-v57712.js';
import {addNutrition} from '../client/src/personal-journal-v5692.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const d='2026-10-23',at='2026-10-23T12:00:00+02:00';
test('0.5.77.21: planning checkpoint excludes large health/finance journal and rolls back failed new item',()=>{
 const big={transactions:[{value:'a'.repeat(500000)}]};
 const state={format:1,tasks:{existing:{id:'existing',title:'Bleibt'}},projects:{},taskPending:{},projectPending:{},recentTags:['Forschung'],finance:big};
 const checkpoint=planningCheckpoint(state);
 assert.equal(checkpoint.finance,undefined);
 state.tasks.new={id:'new',title:'Test'};state.taskPending.new=true;state.recentTags.unshift('Eintrag');
 restorePlanningCheckpoint(state,checkpoint);
 assert.equal(state.tasks.new,undefined);assert.equal(state.taskPending.new,undefined);
 assert.deepEqual(state.recentTags,['Forschung']);assert.equal(state.finance,big);
});
test('0.5.77.21: early paint always precedes slow persistence work',async()=>{
 const steps=[];await afterPlanningPaint({frame:fn=>{steps.push('frame');fn();},task:fn=>{steps.push('task');fn();}});
 assert.deepEqual(steps,['frame','task']);
});
test('0.5.77.21: create forms render before encrypted save and preserve commit confirmation order',()=>{
 assert.match(main,/if\(fastPlanning\)\{\s*options\?\.onApplied\?\.\(\);\s*render\(\);\s*await afterPlanningPaint\(\);\s*\}\s*await persist\(\)/);
 assert.match(main,/fastPlanning:true,onApplied:\(\)=>\{selectedTaskId=t\.id/);
 assert.match(main,/fastPlanning:true,onApplied:\(\)=>\{selectedProjectId=project\.id/);
 assert.match(main,/restorePlanningCheckpoint\(state,previous\)/);
 assert.match(main,/scheduleSync\(12000\);return/);
 assert.match(main,/Eingabe: Vorlagenitem/);
});
test('0.5.77.21: Matcha EGC and EGCG have separate daily records with unknown, not fabricated milligrams',()=>{
 const state={nutritionJournal:{entries:[],customFoods:[]}};
 addNutrition(state,{foodId:'matcha-oat-plain',at});
 const c=bioactiveDay(state,d);
 assert.equal(c.find(x=>x.key==='EGC').known,0);
 assert.equal(c.find(x=>x.key==='EGC').unknown,1);
 assert.equal(c.find(x=>x.key==='EGCG').known,0);
 assert.equal(c.find(x=>x.key==='EGCG').unknown,1);
 const html=nutritionIntelligenceView(state,{day:d});
 assert.match(html,/Epigallocatechin \(EGC\)/);
 assert.match(html,/Epigallocatechingallat \(EGCG\)/);
 assert.match(html,/Nicht bestimmt/);
 assert.doesNotMatch(html,/EGC<\/span><strong>0 mg/);
});
test('0.5.77.21: supplement declared extra quantities and micronutrient icons appear without double accounting',()=>{
 const s={nutritionJournal:{entries:[],customFoods:[]}};
 addNutrition(s,{foodId:'supplement-fuerstenmed',amount:'4 Kapseln',at});
 const c=bioactiveDay(s,d);
 assert.equal(c.find(x=>x.key==='arginine').value,630);
 assert.equal(c.find(x=>x.key==='saponins').value,798);
 const h=nutritionIntelligenceView(s,{day:d});
 assert.match(h,/Vitamin A/);assert.match(h,/👁️/);assert.match(h,/🍊/);
 assert.match(h,/Weitere deklarierte Stoffe/);
 assert.match(css,/ni721-bioactive/);
});

test('0.5.77.21: unsaved form and original creation context return on vault-write error',()=>{
 assert.match(main,/restorePlanningCheckpoint\(state,previous\);options\?\.onFailed\?\.\(\)/);
 assert.match(main,/editDraftGuard\.rollback\(draftBackup\);render\(\)/);
 assert.match(main,/onFailed:\(\)=>\{\(\{selectedTaskId,selectedProjectId,treeCreateKind/);
 assert.match(main,/onFailed:\(\)=>\{\(\{selectedProjectId,treeCreateKind/);
});
