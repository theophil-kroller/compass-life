import test from 'node:test';
import assert from 'node:assert/strict';
import {lifeSevenYearTracks,lifeWeeksView,lifeWeekCells,lifeWeekMilestones,validateLifeEvent} from '../client/src/life-weeks-v0582.js';
const today='2026-10-31';
const e=(category,title,start,end,extra={})=>validateLifeEvent({category,title,start,end,...extra});
const entries=[
 e('travel','China erster Aufenthalt','2019-08-20','2019-09-04'),
 e('travel','Thailand Phuket','2019-09-05','2019-09-10'),
 e('travel','China zweiter Aufenthalt','2019-09-10','2019-09-16'),
 e('travel','Weihnachtsurlaub Mexiko','2020-12-18','2021-01-10'),
 e('travel','Tansania','2024-12-19','2025-01-13'),
 e('milestone','Geburt Nathanael','2012-12-27','2012-12-27'),
 e('milestone','Geburt Seraphina','2025-06-07','2025-06-07'),
 e('work','Beruf TU Graz','2023-12-01','',{ongoing:true,organization:'TU Graz'}),
 e('relationship','Beziehung mit Partnerin','2020-10-01','',{ongoing:true,person:'Person A'})
];
const state={lifeWeekEvents:entries};
test('bar geometry matches actual date, not a full-row pill',()=>{
 const a=lifeSevenYearTracks(36,entries,{today});
 const china=a.experiences.find(x=>x.label==='China erster Aufenthalt');
 const thailand=a.experiences.find(x=>x.label==='Thailand Phuket');
 const china2=a.experiences.find(x=>x.label==='China zweiter Aufenthalt');
 assert.ok(china&&thailand&&china2);
 assert.equal(china.start,'2019-08-20'); assert.equal(china.end,'2019-09-04');
 assert.ok(china.left>10&&china.left<20);assert.ok(china.width>3&&china.width<6);
 assert.ok(thailand.left>china.left); assert.ok(china2.left>thailand.left);
 // Near-neighbour captions get their own rows rather than visually overlapping.
 assert.equal(new Set([china.lane,thailand.lane,china2.lane]).size,3);
});
test('experience-first: phases are opt-in and bands carry the event title',()=>{
 const html=lifeWeeksView(state,{today,viewMode:'cycle',cycleIndex:5});
 assert.match(html,/China erster Aufenthalt/);assert.match(html,/Thailand Phuket/);
 assert.match(html,/lw87-time-extent/);assert.match(html,/lw87-period-caption/);
 assert.match(html,/Lebensphasen einblenden/);assert.ok(!html.includes('lw87-phase-heading'));
 const shown=lifeWeeksView(state,{today,viewMode:'cycle',cycleIndex:5,showPhases:true});
 assert.match(shown,/lw87-phase-heading/);assert.match(shown,/Person A/);assert.match(shown,/TU Graz/);
});
test('star hover shows only milestone title, never an unrelated ongoing relationship or employment',()=>{
 const cell=lifeWeekCells(41,{today,events:entries}).find(x=>x.start<='2025-06-07'&&x.end>='2025-06-07');
 assert.equal(lifeWeekMilestones(cell).length,1);
 const html=lifeWeeksView(state,{today,viewMode:'cycle',cycleIndex:5});
 const star=html.match(/<button[^>]*class="[^"]*lw85-has-milestone[^>]*>[^<]*<span class="lw85-milestone-star"/);
 assert.ok(star,'star has own week button');
 assert.match(star[0],/★ Geburt Seraphina/);
 assert.doesNotMatch(star[0],/Person A|Beruf TU Graz/);
});
test('several events at exact same date are stacked, XSS remains escaped',()=>{
 const items=[...entries,e('travel','Another overlapping trip','2019-09-05','2019-09-12'),e('milestone','<script>alert(1)</script>','2019-09-07','2019-09-07')];
 const r=lifeSevenYearTracks(36,items,{today});
 assert.ok(r.experiences.length>=5);
 const html=lifeWeeksView({lifeWeekEvents:items},{today,viewMode:'cycle',cycleIndex:5});
 assert.ok(!html.includes('<script>alert(1)</script>'));
 assert.ok(html.includes('&lt;script&gt;'));
});
test('same institution is grouped in optional phase timeline',()=>{
 const items=[e('work','Researcher','2023-12-01','',{ongoing:true,organization:'TU Graz'}),e('work','Lecturer','2024-07-01','',{ongoing:true,organization:'TU Graz'})];
 const tracks=lifeSevenYearTracks(41,items,{today,showPhases:true});
 assert.equal(tracks.phases.length,1);
 assert.equal(tracks.phases[0].label,'TU Graz');
});
test('main app actually wires the phase switch',async()=>{
 const fs=await import('node:fs/promises');const s=await fs.readFile(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(s,/if\(action==='lw87-phases'\)/);
 assert.match(s,/showPhases:lifeWeeksShowPhases/);
});
