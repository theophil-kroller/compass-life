import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MORNING_STEPS,MORNING_PRESETS,normalizeMorningConfig,newMorningSession,elapsedStepSeconds,transitionMorning,morningSafeMeta,morningFromSafeMeta,storeMorningSession,mergeMorningData,morningStats,morningHubView,morningOverlayView} from '../client/src/miracle-morning-v570.js';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
const base='/mnt/data/compass_0570_source';
const at='2026-10-21T06:00:00.000Z';
test('classic SAVERS has six configurable steps and a six minute preset',()=>{
 assert.deepEqual(MORNING_STEPS.map(s=>s.letter),['S','A','V','E','R','S']);
 assert.equal(MORNING_PRESETS.quick.reduce((a,b)=>a+b),6);
 const cfg=normalizeMorningConfig({durations:{silence:1,reading:99},affirmations:['Ich lerne.','Ich gestalte.'],readingBook:'Kindle'});
 assert.equal(cfg.durations.silence,1);assert.equal(cfg.durations.reading,10);assert.equal(cfg.affirmations.length,2);
});
test('timestamp-based running and pause survives background suspension',()=>{
 const s=newMorningSession(null,at,'s1');
 const start=transitionMorning(s,'start',at);
 assert.equal(elapsedStepSeconds(start,'2026-10-21T06:02:34.000Z'),154);
 const pause=transitionMorning(start,'pause','2026-10-21T06:03:00.000Z');
 assert.equal(elapsedStepSeconds(pause,'2026-10-21T06:10:00.000Z'),180);
 const resume=transitionMorning(pause,'start','2026-10-21T06:11:00.000Z');
 const done=transitionMorning(resume,'finish','2026-10-21T06:12:15.000Z');
 assert.equal(done.steps[0].seconds,255);assert.equal(done.stepIndex,1);assert.equal(done.status,'idle');
});
test('skip and finish produce one immutable journal record after six steps',()=>{
 let s=newMorningSession(MORNING_PRESETS.quick,at,'s2');
 for(let i=0;i<5;i++)s=transitionMorning(s,'skip',at);
 s=transitionMorning(s,'finish','2026-10-21T06:08:00.000Z');
 assert.equal(s.steps.length,6);assert.equal(s.steps.filter(x=>x.skipped).length,5);assert.ok(s.finishedAt);
 assert.throws(()=>transitionMorning(s,'start',at));
 const vault={};storeMorningSession(vault,s);storeMorningSession(vault,s);
 assert.equal(vault.miracleMorning.sessions.length,1);
});
test('safe locked session metadata never contains private journaling text',()=>{
 const s=newMorningSession(null,at,'s3');s.note='Nur für mich';
 const metadata=morningSafeMeta(s);assert.equal(JSON.stringify(metadata).includes('Nur für mich'),false);
 assert.equal(morningFromSafeMeta(metadata).note,'');
});
test('merge by stable ID retains newer timestamp and settings across devices',()=>{
 const a=newMorningSession(null,at,'sync');a.updatedAt='2026-10-21T06:05:00Z';
 const b={...a,updatedAt:'2026-10-21T06:06:00Z',finishedAt:'2026-10-21T06:06:00Z'};
 const local={config:{updatedAt:'2026-10-21T06:00:00Z',readingBook:'Old'},sessions:[a]};
 const remote={config:{updatedAt:'2026-10-21T07:00:00Z',readingBook:'Kindle'},sessions:[b]};
 const m=mergeMorningData(local,remote);assert.equal(m.sessions.length,1);assert.equal(m.sessions[0].finishedAt,b.finishedAt);assert.equal(m.config.readingBook,'Kindle');
 const journal=mergeJournalData({miracleMorning:local},{miracleMorning:remote});assert.equal(journal.miracleMorning.sessions.length,1);
});
test('insights and player render without leaking personal text on locked screen',()=>{
 const cfg=normalizeMorningConfig({affirmations:['Mein privater Satz'],visualization:'Geheime Ziele',readingBook:'Privat'});
 const s=newMorningSession(null,at,'s4');s.stepIndex=1;
 const locked=morningOverlayView(s,cfg,{locked:true});
 assert.ok(locked.includes('SAVERS')===false||locked.includes('MIRACLE MORNING'));assert.equal(locked.includes('Mein privater Satz'),false);
 const unlocked=morningOverlayView(s,cfg,{locked:false});assert.ok(unlocked.includes('Mein privater Satz'));
 const hub=morningHubView({});assert.ok(hub.includes('Konfigurieren'));assert.ok(hub.includes('Routine starten'));
});
test('morning completed session stats count actual recorded time',()=>{
 const s=newMorningSession(null,at,'x');s.finishedAt='2026-10-21T06:40:00.000Z';s.steps=[{id:'silence',seconds:300,skipped:false},{id:'affirmations',seconds:90,skipped:true}];
 const st={miracleMorning:{sessions:[s]}};
 const stats=morningStats(st,30,new Date('2026-10-21T13:00:00Z'));assert.equal(stats.entries.length,1);assert.equal(stats.totalSeconds,300);
});
test('main integrates locked sealed capture and habits entry',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const vault=readFileSync(new URL('../client/src/vault.js',import.meta.url),'utf8');
 assert.ok(main.includes('morningPlayerOpen?morningRenderOverlay()'));assert.ok(main.includes("capture.kind==='morning'"));
 assert.ok(main.includes('data-action="mm570-open"'));assert.ok(vault.includes('appendSealedMorning'));
});
