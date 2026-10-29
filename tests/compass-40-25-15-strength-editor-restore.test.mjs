import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {strengthInsightsView} from '../client/src/strength-insights-full-repair-v57759402511.js';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
import {putStrengthAnnotation} from '../client/src/strength-editor-v57732.js';
const src=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
const id='strength-csv|2026-10-28T23:47:00';
const start='2026-10-28T23:47:00';
const testState=()=>({healthImports:{garminSessions:[{source:'garmin-activities-csv',sport:19,activityType:'Strength',title:'Strength',start,day:'2026-10-28',durationMinutes:30.6,totalSets:null,totalReps:null}]}});

test('CSV-only training visibly offers restore editor and one-click direct action, no further FIT export',()=>{
 const state=testState(),before=structuredClone(state);
 const html=strengthInsightsView(state,{range:'28',today:'2026-10-29'});
 assert.match(html,/Krafttraining erkannt/);
 assert.match(html,/str732-editor/);
 assert.match(html,/Übungen &amp; Gewichte nachtragen/);
 assert.match(html,/data-action="str732-edit" data-id="strength-csv\|2026-10-28T23:47:00"/);
 assert.match(html,/str732-pending/);
 assert.ok(html.indexOf('str732-editor')<html.indexOf('str740-svg'),'editor should precede atlas');
 assert.doesNotMatch(html,/Original-FIT-Datei dieser Aktivität exportieren/);
 assert.deepEqual(state,before,'display must be read-only');
});

test('clicking a pending CSV session shows set editor with reps/load and add-set controls',()=>{
 const html=strengthInsightsView(testState(),{range:'28',today:'2026-10-29',editingId:id});
 assert.match(html,/id="str732-form"/);
 assert.match(html,/name="exercise-0"/);
 assert.match(html,/name="reps-0"/);
 assert.match(html,/name="weight-0"/);
 assert.match(html,/data-action="str732-add-set"/);
 assert.match(html,/Übungen speichern und Muskelkarte aktualisieren/);
 assert.match(html,/str740-svg.*data-anatomy-view="front"/);
 assert.match(html,/str740-svg.*data-anatomy-view="back"/);
});

test('confirmed CSV annotation updates muscle model, no duplicated workout or original changes',()=>{
 const state=testState(), original=structuredClone(state.healthImports);
 const data=[{exerciseId:'bench',reps:'12',weightKg:'25'},{exerciseId:'barbell-row',reps:'10',weightKg:'30'}];
 putStrengthAnnotation(state,{sessionId:id,start,sets:data});
 const x=strengthPeriod(state,{range:'28',today:'2026-10-29'});
 assert.equal(x.sessions.length,1);
 assert.equal(x.knownSets,2);
 assert.equal(x.activeSets,2);
 assert.equal(x.volumeKg,600);
 assert.equal(x.sessions[0].summaryOnly,false);
 assert.deepEqual(state.healthImports,original);
 const html=strengthInsightsView(state,{range:'28',today:'2026-10-29',editingId:id});
 assert.match(html,/value="25"/);
 assert.match(html,/value="30"/);
 assert.match(html,/Vorder- und Rückseite gleichzeitig/);
 putStrengthAnnotation(state,{sessionId:id,start,sets:[{exerciseId:'bench',reps:12,weightKg:27.5}]});
 assert.equal(state.strengthJournal.annotations.length,1,'repeat save updates rather than duplicates');
 assert.equal(strengthPeriod(state,{range:'28',today:'2026-10-29'}).sessions.length,1);
});

test('full-source rebinds editor form on ordinary render and partial refresh, and scrolls on direct edit',()=>{
 assert.match(src,/import \{strengthInsightsView\} from '\.\/strength-insights-full-repair-v57759402511\.js'/);
 assert.match(src,/function refreshStrength728\(\)[\s\S]*?old\.outerHTML=strengthInsightsView\([\s\S]*?bindStrengthEditor732\(\)/);
 assert.match(src,/function bindStrengthEditor732\(\)[\s\S]*?putStrengthAnnotation\(st,\{sessionId:strengthForm\.dataset\.sessionId/);
 assert.match(src,/if\(action==='str732-edit'\)[\s\S]*?scrollIntoView\?\.\(\{behavior:'smooth',block:'start'\}\)/);
 assert.match(src,/bindStrengthEditor732\(\);/);
});
