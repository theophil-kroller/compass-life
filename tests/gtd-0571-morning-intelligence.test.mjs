import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ensureMorning,normalizeMorningConfig,newMorningSession,mergeMorningData,morningOverlayView} from '../client/src/miracle-morning-v570.js';
import {addMorningAffirmation,removeMorningAffirmation,validMorningVision,saveMorningVision,removeMorningVision,putMorningNote,removeMorningNote,sessionToMorningNote,morningInsightsModel,morningCreateView,morningInsightsView,morningIntelligenceHeader} from '../client/src/morning-intelligence-v571.js';
const time='2026-10-21T06:00:00.000Z';
test('v0.5.70 routine and saved texts survive schema extension',()=>{
 const st={miracleMorning:{config:{affirmations:['Ich lerne.'],visualization:'Meine alte Vision',readingBook:'Kindle',updatedAt:time},sessions:[]}};
 const a=ensureMorning(st);assert.equal(a.config.visualization,'Meine alte Vision');assert.deepEqual(a.config.visions,[]);assert.deepEqual(a.notes,[]);
 addMorningAffirmation(st,'Ich wähle Ruhe.',time);
 assert.deepEqual(st.miracleMorning.config.affirmations,['Ich lerne.','Ich wähle Ruhe.']);
 removeMorningAffirmation(st,1,time);assert.deepEqual(st.miracleMorning.config.affirmations,['Ich lerne.']);
});
test('vision cards keep a stable ID, safety limit and optional image only in vault',()=>{
 const st={};const v=saveMorningVision(st,{title:'Forschung',text:'Den nächsten Schritt klar gestalten',emoji:'🎓',imageData:'data:image/jpeg;base64,AAAA'},time);
 assert.ok(v.id);assert.equal(v.goalId,'');assert.ok(ensureMorning(st).config.visions[0].imageData.startsWith('data:image'));
 assert.equal(normalizeMorningConfig(st.miracleMorning.config).visions.length,1);
 assert.equal(validMorningVision({text:'x',imageData:'https://example.org/untrusted.png'}).imageData,'');
 saveMorningVision(st,{...v,text:'Noch klarer'},'2026-10-21T07:00:00.000Z');assert.equal(st.miracleMorning.config.visions.length,1);
 removeMorningVision(st,v.id,time);assert.equal(st.miracleMorning.config.visions.length,0);
});
test('encrypted journal notes support editing, merging and soft deletion',()=>{
 const a={},b={};
 const note=putMorningNote(a,{id:'entry1',day:'2026-10-21',text:'Mein Morgen'},time);
 putMorningNote(b,{...note,text:'Nach Reflexion ergänzt'},'2026-10-21T07:00:00.000Z');
 let merged=mergeMorningData(a.miracleMorning,b.miracleMorning);
 assert.equal(merged.notes.length,1);assert.equal(merged.notes[0].text,'Nach Reflexion ergänzt');
 const later={miracleMorning:merged};removeMorningNote(later,'entry1','2026-10-21T08:00:00.000Z');
 merged=mergeMorningData(a.miracleMorning,later.miracleMorning);
 assert.equal(merged.notes[0].deleted,true);
});
test('previous Scribing notes become searchable once without duplication',()=>{
 const s=newMorningSession(null,time,'abc');s.note='Alte Scribing-Notiz';s.finishedAt='2026-10-21T06:30:00.000Z';s.updatedAt=s.finishedAt;
 const st={miracleMorning:{sessions:[s],config:{affirmations:[]}}};
 ensureMorning(st);ensureMorning(st);assert.equal(st.miracleMorning.notes.length,1);
 assert.equal(st.miracleMorning.notes[0].text,'Alte Scribing-Notiz');
 assert.equal(sessionToMorningNote(st,s).id,'session-abc');assert.equal(st.miracleMorning.notes.length,1);
});
test('Morning Insights computes recorded results, not speculative percentages',()=>{
 const blank=morningInsightsModel({},30,new Date('2026-10-22T12:00:00Z'));
 assert.equal(blank.entries,0);assert.ok(blank.steps.every(step=>step.ratio===0));
 const s=newMorningSession(null,time,'session');s.finishedAt='2026-10-21T06:30:00.000Z';s.steps=[{id:'silence',skipped:false,seconds:120},{id:'affirmations',skipped:true,seconds:0}];
 const data=morningInsightsModel({miracleMorning:{sessions:[s]}},7,new Date('2026-10-22T12:00:00Z'));
 assert.equal(data.entries,1);assert.equal(data.daysWithRoutine,1);assert.equal(data.averageMinutes,2);
 assert.equal(data.steps[0].ratio,100);assert.equal(data.steps[1].ratio,0);assert.equal(data.streak,1);
});
test('morning player shows goal image only with an unlocked vault',()=>{
 const st={};saveMorningVision(st,{title:'Privatvision',text:'Wichtiges für mich',imageData:'data:image/jpeg;base64,AAAA'},time);
 const s=newMorningSession(null,time,'session');s.stepIndex=2;
 const locked=morningOverlayView(s,ensureMorning(st).config,{locked:true});
 assert.doesNotMatch(locked,/Privatvision|data:image\/jpeg/);
 const unlocked=morningOverlayView(s,ensureMorning(st).config,{locked:false});
 assert.match(unlocked,/Privatvision/);assert.match(unlocked,/data:image\/jpeg/);
});
test('builder safely escapes injected journal and vision text',()=>{
 const st={};saveMorningVision(st,{title:'<img src=x>',text:'& Meine Ziele'},time);
 putMorningNote(st,{id:'note1',text:'<script>alert(1)</script>'},time);
 const html=morningCreateView(st,{journalEditingId:'note1'});
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;img src=x&gt;'));
 assert.match(morningIntelligenceHeader('create'),/aria-pressed="true"/);
 assert.match(morningInsightsView(st),/0\/0/);
});
test('main provides 3-tab navigation, encrypted autosave and existing quick access',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/morningIntelligenceHeader\(morningTab\)/);
 assert.match(main,/data-action="mm570-open"/);
 assert.match(main,/mm571-journal-text/);
 assert.match(main,/await persist\(\)/);
 assert.match(main,/sessionToMorningNote\(st,next\)/);
});
