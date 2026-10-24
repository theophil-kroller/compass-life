import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const base=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=p=>import(pathToFileURL(`${base}/${p}`).href);
const today='2026-10-24';
const model={today,range:'28',sessions:[{id:'a',day:'2026-10-23',start:'2026-10-23T12:00:00',reportedSets:2,sets:[{exerciseId:'hip-thrust',reps:10,weightKg:25},{exerciseId:'curl-to-press',reps:8,weightKg:8}],durationMinutes:25}],events:[{exerciseId:'hip-thrust',reps:10},{exerciseId:'curl-to-press',reps:8}],activeSets:2,csvOnlyReps:0,knownSets:2,unassigned:0,volumeKg:314};
const bike={sessions:[{day:'2026-10-22',durationMinutes:52}],days:1,rides:1,minutes:52,regions:{primary:['quadriceps','glute_max'],secondary:['calves_gastro','calves_soleus','hamstrings','tibialis','glute_med']}};
test('heatmap is one tile per calendar day, no invented completed rest days',async()=>{
 const {strengthPremiumTimeline}=await load('client/src/strength-premium-v57738.js');
 const html=strengthPremiumTimeline(model,bike,{today,range:'28'});
 assert.equal((html.match(/class="str738-day /g)||[]).length,28);
 assert.match(html,/Kraft/);assert.match(html,/Radfahren/);assert.match(html,/Keine Aufzeichnung/);
 assert.match(html,/2026-10-22: 0 dokumentierte Kraftsätze, 52 Radfahrminuten/);
 assert.match(html,/2026-10-23: 2 dokumentierte Kraftsätze/);
});
test('premium map shows front and back and does not add cycling to strength sets',async()=>{
 const {strengthPremiumMap}=await load('client/src/strength-premium-v57738.js');
 const html=strengthPremiumMap(model,bike,'combined','front');
 assert.match(html,/VORNE/);assert.match(html,/HINTEN/);assert.match(html,/KRAFT \+ RAD/);
 assert.match(html,/Gesäß/);assert.match(html,/calves_gastro/);
 assert.match(html,/str740-svg/);assert.match(html,/data-anatomy-info=/);
 assert.match(html,/nicht in Sätze umgerechnet/);
 assert.match(html,/str738-body/);
});
test('bike-only mode retains front/back anatomical viewports and contextual labels',async()=>{
 const {strengthPremiumMap}=await load('client/src/strength-premium-v57738.js');
 const html=strengthPremiumMap({...model,sessions:[],events:[],activeSets:0},bike,'cycling','back');
 assert.match(html,/Qualitative Beanspruchung beim Treten/);
 assert.match(html,/RAD/);assert.match(html,/Gastrocnemius/);
});
test('numbers count only documented training units',async()=>{
 const {strengthPremiumKpis}=await load('client/src/strength-premium-v57738.js');
 const html=strengthPremiumKpis(model,bike);
 assert.match(html,/AKTIVE SÄTZE/);assert.match(html,/>2<\/strong>/);
 assert.match(html,/GEWICHTSVOLUMEN/);assert.match(html,/314 kg/);
 assert.match(html,/52 Min/);
});
test('strength render integrates premium anatomy and keeps the exercise editor AFTER main card',async()=>{
 const txt=readFileSync(`${base}/client/strength-premium738-bridge.js`,'utf8');
 assert.match(txt,/strengthPremiumTimeline\(m,cycling/);
 assert.match(txt,/strengthPremiumKpis\(m,cycling\)/);
 assert.match(txt,/strengthPremiumMap\(m,cycling,activity,side\)/);
 assert.match(txt,/editor follows body card/);
});
test('real nutrition-history source directly renders kcal pill and preserves kcal estimation and recipe transform anchor',()=>{
 const txt=readFileSync(`${base}/client/src/nutrition-history-v577.js`,'utf8');
 assert.match(txt,/nutritionMissingEnergyPill\(r\)/);assert.match(txt,/n577-amount/);
 assert.doesNotMatch(txt,/n577-missing-items|Fehlende Energieangaben anzeigen/);
 assert.match(txt,/nutritionKcalEstimate\(food,e.amount\)/);
});
test('earlier .37.1 bridge skips redundant history transformation',async()=>{
 const {nutritionPill577371Bridge}=await load('client/nutrition-pill-577371-bridge.js');
 const txt=readFileSync(`${base}/client/src/nutrition-history-v577.js`,'utf8');
 assert.equal(nutritionPill577371Bridge().transform(txt,'/app/client/src/nutrition-history-v577.js'),null);
});
test('exercise values are also offered on opening editor, without overwriting filled fields',async()=>{
 const {wireStrengthRecentDefaults}=await load('client/src/strength-recent-defaults-v577371.js');
 const history={strengthJournal:{annotations:[{sessionId:'old',start:'2026-10-19T09:00:00',sets:[{exerciseId:'triceps-extension',weightKg:14,reps:12}]}]}};
 const reps={value:''},kg={value:''},form={dataset:{start:'2026-10-24T13:00:00',sessionId:'new'},events:{},querySelectorAll:()=>[row],addEventListener(k,v){this.events[k]=v;}};
 const sel={value:'triceps-extension',matches:q=>q.startsWith('select'),closest:()=>row};
 const row={hint:null,querySelector:q=>q.startsWith('select')?sel:q.includes('reps-')?reps:q.includes('weight-')?kg:q.includes('.str7371')?row.hint:null,appendChild(x){row.hint=x;}};
 const documentBefore=globalThis.document;globalThis.document={createElement:()=>({textContent:'',hidden:false})};
 try{wireStrengthRecentDefaults(form,history);assert.equal(reps.value,'12');assert.equal(kg.value,'14');}finally{globalThis.document=documentBefore;}
});
test('bridge fails closed on incorrect installed base and version config',async()=>{
 const {strengthPremium738Bridge}=await load('client/strength-premium738-bridge.js');
 assert.throws(()=>strengthPremium738Bridge().transform('no known content','/project/client/src/strength-insights-v57728.js'),/Integrationsstelle/);
 const vite=readFileSync(`${base}/client/vite.config.js`,'utf8');
 assert.match(vite,/nutritionPill577371Bridge\(\), strengthPremium738Bridge\(\), VitePWA/);
});
