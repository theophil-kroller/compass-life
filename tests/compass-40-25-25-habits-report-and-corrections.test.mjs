import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {putHabitTimeSession,mergeHabitTimeSessions,habitTimeModel,habitTimeInsightsView} from '../client/src/habit-time-v57759402525.js';
import {bodyPhysiqueSvg} from '../client/src/body-physique-vector-v57759402525.js';
import {fitdaysDynamicBodyView} from '../client/src/body-comparison-v57759402524.js';
import {reportWindow} from '../client/src/life-report-v577594018.js';
import {dailyDozenExerciseMinutes,dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
const path=new URL('../client/src/',import.meta.url);
test('Wim-Hof: two same-day sessions remain separate, idempotent merge by id',()=>{
 const state={habitTimeSessions:[]};putHabitTimeSession(state,{id:'w1',habitId:'wim-hof',at:'2026-10-30T07:00:00Z',day:'2026-10-30',minutes:20,mode:'morning'});
 putHabitTimeSession(state,{id:'w2',habitId:'wim-hof',at:'2026-10-30T20:00:00Z',day:'2026-10-30',minutes:15,mode:'evening'});
 const m=habitTimeModel(state,{anchor:'2026-10-30',days:7});assert.equal(m.total,35);assert.equal(m.groups.find(g=>g.habitId==='wim-hof').sessions,2);
 assert.equal(mergeHabitTimeSessions(state.habitTimeSessions,state.habitTimeSessions).length,2);
});
test('Habit time: manual sessions and Makko/Miracle Morning, unknown checks not zero',()=>{
 const state={habitTimeSessions:[{id:'voice',habitId:'vocal-image',at:'2026-10-30T13:00:00Z',day:'2026-10-30',minutes:30,updatedAt:'2026-10-30T13:00:00Z'}],
 makkoHoSessions:[{id:'mk1',totalSeconds:600,day:'2026-10-30',holds:[]}],miracleMorning:{sessions:[{id:'mm1',day:'2026-10-30',finishedAt:'2026-10-30T08:00:00Z',steps:[{seconds:300},{seconds:200,skipped:true}]}]},
 habitsQuick:{completions:[{habitId:'wim-hof',day:'2026-10-30',done:true}]}};
 const m=habitTimeModel(state,{anchor:'2026-10-30',days:7});assert.equal(m.total,45);assert.equal(m.unknown,1);assert.match(habitTimeInsightsView(state,{anchor:'2026-10-30'}),/Einheit nachtragen/);
});
test('invalid manual duration does not mutate journal',()=>{const s={};assert.throws(()=>putHabitTimeSession(s,{habitId:'wim-hof',minutes:0}),/Datum oder Dauer/);assert.equal(s.habitTimeSessions,undefined);});
test('reports select exactly 1, 3, 6, 9, 12 months without rewriting PDF sections',()=>{assert.deepEqual(['month','quarter','half','threequarters','year'].map(period=>reportWindow('2026-10-30',period).days),[30,90,180,270,365]);});
test('daily dozen movement shows fractional daily progress from actual activities',()=>{const s={healthImports:{garminSessions:[{id:'walk',start:'2026-10-30T11:00:00Z',durationMinutes:30,sport:1}]}};assert.equal(dailyDozenExerciseMinutes(s,'2026-10-30').moderate,30);const model=dailyDozen5930(s,{day:'2026-10-30'});assert.ok(model.rows.find(r=>r.id==='exercise').observed>0);});
test('Mensa ratatouille is credited only when explicitly consumed; portion provisional',()=>{const state={nutritionJournal:{entries:[{id:'eat1',foodId:'mensa-menu-2026-10-30-v1',at:'2026-10-30T12:00:00',amount:'1 Study-Teller',menuSnapshot:{title:'Ratatouille Gemüse mit Cous Cous',dailyDozenCandidateCategories:['vegetables']}}]}};const m=dailyDozenIngredientEvidence404(state,'2026-10-30');assert.equal(m.totals.vegetables,0.5);const empty=dailyDozenIngredientEvidence404({nutritionJournal:{entries:[]}},'2026-10-30');assert.equal(empty.totals.vegetables,0);});
test('vector stays sharp and no fabricated abs for >=20% body fat',()=>{assert.doesNotMatch(bodyPhysiqueSvg(23.5),/M107 150/);assert.match(bodyPhysiqueSvg(10),/M107 150/);const v=fitdaysDynamicBodyView([{at:'2026-10-30T12:00:00',weightKg:86.8,bodyFatPct:23.5}]);assert.match(v,/cbody25-vector/);assert.doesNotMatch(v,/stage-23_5.webp/);});
test('source wires E2EE journal sync and player session save after callback',()=>{const main=readFileSync(new URL('main-full-v57759402510.js',path),'utf8');const player=readFileSync(new URL('wim-hof-player-v5775921.js',path),'utf8');assert.match(main,/habitTimeSessions:st\.habitTimeSessions\|\|\[\]/);assert.match(main,/habitTimeInsightsView/);assert.match(player,/await onComplete/);assert.match(player,/saved=true/);});
