import test from 'node:test';
import assert from 'node:assert/strict';
import {lifeSevenYearRange,lifeWeeksView,lifeWeekCells,lifeWeekVisualLayers,validateLifeEvent} from '../client/src/life-weeks-v0582.js';
const today='2026-10-31';
const event=(category,title,start,end,extra={})=>validateLifeEvent({category,title,start,end,...extra});
const state={lifeWeekEvents:[
 event('travel','China und Thailand','2019-08-20','2019-09-16'),
 event('milestone','Geburt meiner Tochter','2025-06-07','2025-06-07'),
 event('work','Universitätslehre','2023-12-01','',{ongoing:true,organization:'TU Graz'}),
 event('education','Studium','2021-10-01','2025-09-30',{organization:'Universität Graz',endPrecision:'month'}),
]};
test('seven-year blocks are exactly birthday-anchored and handle 80, 100, 110 horizons',()=>{
 assert.deepEqual({...lifeSevenYearRange(0,80)}, {index:0,startAge:0,endAge:6,start:'1983-06-28',endExclusive:'1990-06-28',years:'1983–1990',count:7});
 assert.deepEqual({...lifeSevenYearRange(6,80)}, {index:6,startAge:42,endAge:48,start:'2025-06-28',endExclusive:'2032-06-28',years:'2025–2032',count:7});
 assert.equal(lifeSevenYearRange(11,80).count,3);
 assert.equal(lifeSevenYearRange(15,110).count,5);
 assert.equal(lifeSevenYearRange(-9,80).index,0);
 assert.equal(lifeSevenYearRange(900,80).index,11);
});
test('app seven year panorama has seven distinct years and full descriptive labels',()=>{
 const html=lifeWeeksView(state,{today,viewMode:'cycle'});
 assert.match(html,/SIEBENJAHRES-PANORAMA/);
 assert.match(html,/Deine Jahre 42–48/);
 assert.match(html,/class="lw86-year/);
 assert.equal((html.match(/class="lw86-year(?: |\")/g)||[]).length,7);
 assert.match(html,/class="lw86-cycle-menu"/);
 assert.match(html,/Gesamtes Leben ansehen/);
 assert.match(html,/Lebensphasen einblenden/);
 const withPhases=lifeWeeksView(state,{today,viewMode:'cycle',showPhases:true});assert.match(withPhases,/Universität Graz/);
 assert.ok(!html.includes('class="lw82-main-scroll"'),'no duplicate full 80-year grid in focus mode');
 assert.match(html,/lw86-year-events/);
});
test('switching selected segment shows 2018–2025 life years and the long China travel',()=>{
 const html=lifeWeeksView(state,{today,cycleIndex:5,viewMode:'cycle'});
 assert.match(html,/Deine Jahre 35–41/);
 assert.match(html,/China und Thailand/);
 assert.match(html,/Universitätslehre/);
 assert.match(html,/data-action="lw86-focus-event"/);
 assert.equal((html.match(/class="lw86-year(?: |\")/g)||[]).length,7);
});
test('full-life overview still renders all rows and zoom controls, no duplicated seven-year matrix',()=>{
 const html=lifeWeeksView(state,{today,viewMode:'overview'});
 assert.match(html,/class="lw82-main-scroll"/);
 assert.match(html,/data-lw83-years="80"/);
 assert.match(html,/Alles einpassen/);
 assert.ok(!html.includes('id="lw86-seven"'));
});
test('milestones remain stars, continuing education stays a phase and does not fill travel cells',()=>{
 const cell=lifeWeekCells(41,{today,events:state.lifeWeekEvents}).find(w=>w.start<='2025-06-07'&&w.end>='2025-06-07');
 assert.ok(cell);
 const layers=lifeWeekVisualLayers(cell);
 assert.equal(layers.milestone,true);
 assert.ok(layers.phases.includes('work'));
 assert.deepEqual(layers.experiences,[]);
 const html=lifeWeeksView(state,{today,cycleIndex:5,viewMode:'cycle'});
 assert.match(html,/lw87-milestone/);
 assert.match(html,/★/);
});
test('year selection, period selection and printable export are all wired in main screen',async()=>{
 const fs=await import('node:fs/promises');const main=await fs.readFile(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 for(const needle of ['lw86-mode','lw86-cycle','lw86-cycle-prev','lw86-cycle-next','lw86-focus-event','viewMode:lifeWeeksMode','cycleIndex:lifeWeeksCycleIndex','lw83-pdf'])assert.ok(main.includes(needle),needle);
});
