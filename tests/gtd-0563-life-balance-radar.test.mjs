import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildLifeBalanceRadar,buildLifeBalanceHistory,lifeBalanceRadarView} from '../client/src/life-balance-radar-v563.js';
const night=d=>({day:d,totals:{deep:90,light:260,rem:130,awake:20}});
const days=['2026-10-02','2026-10-03','2026-10-04','2026-10-09','2026-10-10','2026-10-11','2026-10-16','2026-10-17','2026-10-18'];
const state={healthImports:{garminNights:days.map(night)},tasks:{t:{title:'Nicht als historisch bewerten',dueDate:'2026-10-01'}},records:{i:{id:'i',title:'Offener Eingang'}}};
test('Historical 7-day periods are nonoverlapping and based on real dated records',()=>{
 const current=buildLifeBalanceRadar(state,{today:'2026-10-20',period:7});
 const [previous,older]=buildLifeBalanceHistory(state,{today:'2026-10-20',period:7});
 assert.equal(current.start,'2026-10-14');
 assert.deepEqual([[previous.start,previous.today],[older.start,older.today]], [['2026-10-07','2026-10-13'],['2026-09-30','2026-10-06']]);
 assert.equal(current.axes[0].score,100);assert.equal(previous.axes[0].score,100);assert.equal(older.axes[0].score,100);
 assert.equal(previous.axes.find(a=>a.key==='gtd').score,null);
 assert.equal(previous.axes.find(a=>a.key==='people').score,null);
 assert.equal(previous.axes.find(a=>a.key==='finance').score,null);
 assert.equal(current.axes.find(a=>a.key==='gtd').score!==null,true);
});
test('Historical overlays do not invent axes when earlier data are missing',()=>{
 const onlyCurrent={healthImports:{garminNights:['2026-10-17','2026-10-18','2026-10-19'].map(night)}};
 const h=buildLifeBalanceHistory(onlyCurrent,{today:'2026-10-20',period:7});
 assert.ok(h.every(x=>x.coverage===0));
 const html=lifeBalanceRadarView(buildLifeBalanceRadar(onlyCurrent,{today:'2026-10-20',period:7}),{history:h});
 assert.match(html,/Zeitspuren/);assert.match(html,/Aktuell/);assert.match(html,/Vorperiode/);assert.match(html,/Davor/);
 assert.doesNotMatch(html,/data-history-index="1"[\s\S]*?<line/);
});
test('Colored traces are controllable, isolated and historical data never alters current line',()=>{
 const now=buildLifeBalanceRadar(state,{today:'2026-10-20',period:7});
 const hist=buildLifeBalanceHistory(state,{today:'2026-10-20',period:7});
 const html=lifeBalanceRadarView(now,{history:hist});
 assert.match(html,/data-action="balance-history" data-id="0"/);
 assert.match(html,/data-action="balance-history" data-id="1"/);
 assert.match(html,/data-action="balance-history" data-id="2"/);
 assert.match(html,/data-history-index="1"/);assert.match(html,/data-history-index="2"/);
 assert.match(html,/#B7A2F5/);assert.match(html,/#E8BD73/);
 assert.match(html,/aria-pressed="true"/);
 const off=lifeBalanceRadarView(now,{history:[]});
 assert.doesNotMatch(off,/data-history-index=/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/action==='balance-history'/);
 assert.match(main,/buildLifeBalanceHistory/);
});
test('Thirty-day time slices use exact 30-day windows without overlap',()=>{
 const h=buildLifeBalanceHistory({},{today:'2026-10-20',period:30});
 assert.deepEqual([[h[0].start,h[0].today],[h[1].start,h[1].today]], [['2026-08-22','2026-09-20'],['2026-07-23','2026-08-21']]);
 assert.throws(()=>buildLifeBalanceHistory({},{period:8}),/Ungültiger/);
});
