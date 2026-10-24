import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {weeklyPeriod,weeklyIntelligenceModel,weeklyDots,weeklyIntelligenceView} from '../client/src/weekly-intelligence-v57746.js';
import {compass746Bridge} from '../client/compass746-bridge.js';
const TODAY='2026-10-24';
const model=(state={})=>weeklyIntelligenceModel(state,{today:TODAY});

test('last complete seven days exclude today and move by weeks without future days',()=>{
 assert.deepEqual(weeklyPeriod({today:TODAY}),{start:'2026-10-17',end:'2026-10-23',previousStart:'2026-10-10',previousEnd:'2026-10-16',today:TODAY,offset:0,days:['2026-10-17','2026-10-18','2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23']});
 assert.equal(weeklyPeriod({today:TODAY,offset:1}).end,'2026-10-16');
 assert.equal(weeklyPeriod({today:TODAY,offset:-20}).end,'2026-10-23');
});
test('no import is not an invented zero or live measurement',()=>{
 const m=model();for(const key of ['sleep','steps','weight','fat','nutrition','time','research','family','receipts']){
  assert.equal(m.domains[key].value,null,key);assert.equal(m.domains[key].count,0,key);
 }
 const html=weeklyIntelligenceView({},{today:TODAY});
 assert.match(html,/Keine protokollierten Werte/);assert.match(html,/keine fehlenden Werte als Null|Keine fehlenden Werte als Null/);
 assert.match(html,/Garmin Schlaf/);assert.match(html,/Fitdays/);
 assert.doesNotMatch(html,/Du hast heute/);
});
test('sleep dots only include actually measured nights and reject empty phases',()=>{
 const s={healthImports:{garminNights:[
  {day:'2026-10-20',totals:{deep:90,light:230,rem:110}},
  {day:'2026-10-21',totals:{deep:null,light:null,rem:null}},
  {day:'2026-10-23',totals:{deep:60,light:280,rem:100}},
  {day:'2026-10-24',totals:{deep:70,light:300,rem:110}}
 ]}};
 const m=model(s),r=m.domains.sleep;assert.equal(r.count,2);assert.equal(r.value,435);
 assert.equal(r.points.filter(p=>p.value!==null).length,2);
 const dots=weeklyDots(r,{name:'Schlafdauer',unit:'min'});assert.equal((dots.match(/r="5"/g)||[]).length,2);assert.match(dots,/kein protokollierter Wert/);
});
test('Garmin daily steps deduplicate identical day without treating missing days as rest',()=>{
 const s={healthImports:{garminFitness:[{day:'2026-10-20',steps:4500},{day:'2026-10-20',steps:4000},{day:'2026-10-23',steps:12000}]}};
 const d=model(s).domains.steps;assert.equal(d.count,2);assert.equal(d.value,8250);assert.equal(d.last,'2026-10-23');
});
test('Fitdays individual observations, not a current-weight claim',()=>{
 const s={healthImports:{fitdays:[{day:'2026-10-18',at:'2026-10-18T07:00:00Z',weightKg:88.2,bodyFatPct:24},{day:'2026-10-23',at:'2026-10-23T06:00:00Z',weightKg:87.9,bodyFatPct:23.4}]}};
 const m=model(s);assert.equal(m.domains.weight.count,2);assert.ok(Math.abs(m.domains.weight.value-88.05)<1e-8);assert.equal(m.domains.fat.value,23.7);
 assert.match(weeklyIntelligenceView(s,{today:TODAY}),/Geräteschätzung/);
});
test('time log shows family only when explicitly classified and research only explicit tags',()=>{
 const s={timeJournal:{entries:[
  {id:'1',start:'2026-10-18T08:00:00',end:'2026-10-18T09:30:00',category:'work',project:'Doktorat – Paper',title:'Schreiben'},
  {id:'2',start:'2026-10-19T16:00:00',end:'2026-10-19T17:00:00',category:'family',title:'Gemeinsam Zeit'},
  {id:'3',start:'2026-10-22T10:00:00',end:'2026-10-22T11:00:00',category:'work',title:'Lehre'},
 ],overrides:{}}};
 const m=model(s);assert.equal(m.domains.time.value,210);assert.equal(m.domains.research.value,90);assert.equal(m.domains.family.value,60);
 assert.match(weeklyIntelligenceView(s,{today:TODAY}),/nur mit genauerer Zuordnung getrennt erfassbar/);
});
test('time journal interval spanning midnight is attributed to both days',()=>{
 const s={timeJournal:{entries:[{id:'a',start:'2026-10-20T23:30:00',end:'2026-10-21T00:30:00',category:'project',title:'Doktorat'}]}};
 const m=model(s);assert.equal(m.domains.time.count,2);assert.equal(m.domains.time.value,60);assert.equal(m.domains.research.count,2);
});
test('expenses only mean imported receipt totals and never bank transactions',()=>{
 const s={financeTransactions:[{id:'bank',amount:-50000}],receiptJournal:{entries:[{date:'2026-10-20',total:10.25},{date:'2026-10-23',total:20.13},{date:'2026-10-23',total:3,deleted:true}]}};
 const d=model(s).domains;assert.equal(d.receipts.value,30.38);assert.equal(d.receiptCount.value,2);
 assert.match(weeklyIntelligenceView(s,{today:TODAY}),/keine Aussage über alle Kontobewegungen/);
});
test('nutrition tracked days and entry totals cannot be misrepresented as all meals eaten',()=>{
 const s={nutritionJournal:{entries:[{foodId:'apple',at:'2026-10-20T12:00:00',id:'a'},{foodId:'nuts',at:'2026-10-20T13:00:00',id:'b'},{foodId:'apple',at:'2026-10-21T16:00:00',id:'c',deleted:true}]}};
 const d=model(s).domains.nutrition;assert.equal(d.value,2);assert.equal(d.count,1);
 assert.match(weeklyIntelligenceView(s,{today:TODAY}),/keine Aussage über vollständige Energieaufnahme/i);
});
test('task deadlines are current forward look and template tasks excluded',()=>{
 const s={tasks:{a:{title:'Review',dueDate:'2026-10-25',category:'Forschung'},b:{title:'Old',dueDate:'2026-10-20',category:'Lehre'},c:{title:'Template',dueDate:'2026-10-26',projectId:'template'},d:{title:'Done',dueDate:'2026-10-27',completed:true}},projects:{template:{isTemplate:true}}};
 const m=model(s);assert.equal(m.upcoming.length,1);assert.equal(m.overdue.length,1);assert.equal(m.researchTasks.length,1);
 assert.match(weeklyIntelligenceView(s,{today:TODAY}),/Review/);assert.doesNotMatch(weeklyIntelligenceView(s,{today:TODAY}),/Template/);
});
test('HTML injection in task names is escaped, not inserted as executable markup',()=>{
 const html=weeklyIntelligenceView({tasks:{x:{title:'<img src=x onerror=alert(1)>',dueDate:'2026-10-25'}}},{today:TODAY});
 assert.doesNotMatch(html,/<img src=x/);assert.match(html,/&lt;img/);
});
test('historic period ignores newer measurements but identifies their actual last date',()=>{
 const s={healthImports:{garminNights:[{day:'2026-10-23',totals:{light:400,rem:80,deep:50}}]}};
 const m=weeklyIntelligenceModel(s,{today:TODAY,offset:1});assert.equal(m.domains.sleep.count,0);assert.equal(m.sources.nights,'2026-10-23');
});
test('bridge fails closed when upstream anchors change',()=>{
 assert.throws(()=>compass746Bridge().transform('broken source','/work/client/src/main.js'),/anchor/);
 assert.equal(compass746Bridge().transform('unchanged','/work/client/src/something-else.js'),null);
});
const mock=`
import {setReceiptCategory} from './receipt-categories-v57745.js';
const COMPASS_CLIENT_VERSION='0.5.77.45';
let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;
function insightsScreen(){
 const tabDef=insightTab==='dreamworld'?{label:'Traumwelt'}:INSIGHT_TABS[0];
 const compactInsights=[['dreamworld','Traumwelt','moon'],['balance','Balance Radar','compass']];
 const content=insightTab==='dreamworld'?dreamJournalView(state):other();
 return content;
}
function chrome(){return \`<button type="button" class="nav-item 4{tab==='insights'&&insightTab==='dreamworld'?'is-active':''}" data-action="calm-insight-view" data-id="dreamworld">4{ico('moon',19)}<span>Traumwelt</span></button>\`;}
async function runAction(action,id){
 if(action==='insights-tab'){if(id==='touch'||id==='dreamworld'||INSIGHT_TABS.some(t=>t.id===id)){render();}return;}
 if(action==='calm-insight-view'){if(id==='dreamworld'||INSIGHT_TABS.some(t=>t.id===id)||['balance'].includes(id)){render();}return;}
 if(action==='dream743-open'){render();return;}
}
`;
test('Vite bridge generates parsable JS with weekly navigation and correct version',()=>{
 const input=mock.replaceAll('\u00024','$');
 const b=compass746Bridge().transform(input,'/work/client/src/main.js').code;
 for(const x of ['0.5.77.46','weeklyOffset746','weekly746-shift','weeklyIntelligenceView','data-id="weekly"'])assert.ok(b.includes(x),x);
 const path=join(tmpdir(),'compass-746-syntax-'+process.pid+'.mjs');writeFileSync(path,b);
 try{execFileSync(process.execPath,['--check',path],{stdio:'pipe'});}finally{unlinkSync(path);}
});
test('pipeline retains ordering and does not duplicate last plugin',()=>{
 const v=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 const chain=['compass745Bridge()', 'compass746Bridge()', 'compass747Bridge()', 'VitePWA('];
 let previous=-1;for(const part of chain){const at=v.indexOf(part);assert.ok(at>previous,part+' order');previous=at;}
});
