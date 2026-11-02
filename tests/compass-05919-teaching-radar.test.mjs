import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hasTeachingCodeKro,teachingEventType,teachingRadarEntries,teachingRadarAccept,teachingRadarSnooze,teachingRadarPanel,mergeTeachingRadar} from '../client/src/teaching-preparation-radar-v05919.js';
import {validProject,validLocalTask} from '../client/src/tasks.js';
const when=(date,title,id='id-'+title)=>({id,summary:title,start:{dateTime:date+'T09:00:00+01:00'},end:{dateTime:date+'T10:30:00+01:00'},status:'confirmed'});
const state=()=>({projects:{},projectPending:{},tasks:{},taskPending:{}});
const uuid=()=>`00000000-0000-4000-8000-${String(++counter).padStart(12,'0')}`;
let counter=0;
test('kro allein und mit anderen Kürzeln gehört zum eigenen Unterricht',()=>{
 for(const name of ['Entrepreneurship (kro)','Marketing (kro, ab)','Design-Thinking (AB/kro)','Marketing (XY-kro)','Geschäftsplan (AB; KRO)','Intro (kro & xyz)','Workshop ( kRo + ABC )']){
  assert.equal(hasTeachingCodeKro(name),true,name);
  assert.equal(teachingEventType(when('2026-11-12',name)),'lecture');
 }
});
test('fremde Lehrblöcke und Buchstabenfolgen niemals zuordnen',()=>{
 for(const name of ['Marketing (abc)','Kromer Seminar','Marketing krokodil','Titel KRO ohne Klammer','Intro (krol,xy)','(microkro)'])assert.equal(hasTeachingCodeKro(name),false,name);
 assert.equal(teachingEventType(when('2026-11-12','Kurs (abc)')),null);
});
test('Workshop und Final Pitch werden auch ohne kro gefunden; Absagen nicht',()=>{
 assert.equal(teachingEventType(when('2026-11-12','Gründungsgarage Business Model Workshop')),'workshop');
 assert.equal(teachingEventType(when('2026-11-12','Final Pitch Abend · Moderation')),'moderation');
 assert.equal(teachingEventType({...when('2026-11-12','Intro (kro)'),status:'cancelled'}),null);
});
test('Countdowns, horizon und Spiegeltermine; jedes Ereignis hat ein eigenes Projekt',()=>{
 const events=[when('2026-11-02','Entrepreneurship (kro)','e0'),when('2026-11-20','Marketing (kro, xy)','e1'),when('2026-11-20','Marketing (kro, xy)','mirror'),when('2026-12-10','Marketing (kro)','e3'),when('2026-11-29','Final Pitch Abend','fp'),when('2026-12-01','Intro (abc)','no')];
 const rows=teachingRadarEntries(events,state(),{today:'2026-11-02'});
 assert.equal(rows.length,3);assert.deepEqual(rows.map(x=>x.daysLeft),[0,18,27]);
 assert.ok(rows.some(x=>x.kind==='moderation'));
});
test('bestätigter Projektvorschlag erzeugt gültige GTD-Projekte/Aufgaben genau einmal',()=>{
 const s=state(), entry=teachingRadarEntries([when('2026-11-16','Design Thinking (abc/kro)','d1')],s,{today:'2026-11-02'})[0];
 const result=teachingRadarAccept(s,entry,{today:'2026-11-02',uuid});
 assert.ok(validProject(result.project));assert.equal(result.tasks.length,4);
 assert.ok(result.tasks.every(t=>validLocalTask(t)));assert.equal(result.project.category,'Lehre');
 assert.equal(result.project.dueDate,'2026-11-16');assert.ok(result.tasks.every(t=>t.projectId===result.project.id));
 assert.ok(result.tasks.every(t=>s.taskPending[t.id]===true));assert.equal(s.projectPending[result.project.id],true);
 assert.equal(teachingRadarAccept(s,entry,{today:'2026-11-02',uuid}).reason,'existing');
 assert.equal(Object.keys(s.projects).length,1);assert.equal(Object.keys(s.tasks).length,4);
 assert.equal(teachingRadarEntries([when('2026-11-16','Design Thinking (abc/kro)','d1')],s,{today:'2026-11-02'})[0].projectId,result.project.id);
});
test('bestehender Lehrordner wird verwendet, nicht dupliziert',()=>{
 const s=state();s.projects.existing={id:'existing',title:'Lehre',kind:'folder',status:'active'};
 const entry=teachingRadarEntries([when('2026-11-16','Geschäftsplan (kro)','d2')],s,{today:'2026-11-02'})[0];
 const created=teachingRadarAccept(s,entry,{today:'2026-11-02',uuid});
 assert.equal(created.project.parentId,'existing');assert.equal(Object.keys(s.projects).length,2);
});
test('snooze bleibt 3 Tage still, führt zu keiner automatischen Aufgabe und wird korrekt zusammengeführt',()=>{
 const s=state(),e=when('2026-11-16','Marketing (kro)','d2');const item=teachingRadarEntries([e],s,{today:'2026-11-02'})[0];
 assert.equal(teachingRadarSnooze(s,item.key,'2026-11-02'),true);
 assert.equal(teachingRadarEntries([e],s,{today:'2026-11-04'}).length,0);
 assert.equal(teachingRadarEntries([e],s,{today:'2026-11-05'}).length,1);
 assert.equal(Object.keys(s.projects).length,0);
 const merged=mergeTeachingRadar({decisions:{[item.key]:{status:'snoozed',until:'2026-11-04',updatedAt:'2026-11-01'}}},s.teachingRadar);
 assert.equal(merged.decisions[item.key].until,'2026-11-05');
});
test('UI escaped Titel und Buttons; keine Sofortmutationen',()=>{
 const s=state(),e=when('2026-11-16','Intro <img onerror=alert(1)> (kro)','x');const html=teachingRadarPanel(teachingRadarEntries([e],s,{today:'2026-11-02'}));
 assert.ok(html.includes('Projekt anlegen'));assert.ok(html.includes('In 14 Tagen'));assert.ok(html.includes('&lt;img'));
 assert.ok(!html.includes('<img onerror'));assert.equal(Object.keys(s.projects).length,0);
});
test('Final Pitch erstellt Moderationsschritte',()=>{
 const s=state(),e=teachingRadarEntries([when('2026-11-29','Final Pitch Abend','f')],s,{today:'2026-11-02'})[0];
 const r=teachingRadarAccept(s,e,{today:'2026-11-02',uuid});
 assert.ok(r.tasks.some(t=>t.title.includes('Moderationsablauf')));assert.ok(r.tasks.every(validLocalTask));
});

test('ein bereits angelegtes Projekt bleibt bei gespiegelten Kalender-IDs wiedererkennbar',()=>{
 const s=state();const a=teachingRadarEntries([when('2026-11-16','Marketing (kro)','org')],s,{today:'2026-11-02'})[0];
 const r=teachingRadarAccept(s,a,{today:'2026-11-02',uuid});
 const mirrored=teachingRadarEntries([when('2026-11-16','Marketing (kro)','mirror')],s,{today:'2026-11-02'})[0];
 assert.equal(mirrored.projectId,r.project.id);
 assert.equal(teachingRadarAccept(s,mirrored,{today:'2026-11-02',uuid}).reason,'existing');
});
