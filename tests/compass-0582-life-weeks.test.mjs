import test from 'node:test';
import assert from 'node:assert/strict';
import {LIFE_BIRTHDAY,lifeYearRange,lifeWeekCells,lifeMonthMarkers,lifeAgeAt,validateLifeEvent,putLifeEvent,deleteLifeEvent,mergeLifeWeekEvents,calendarLifeCandidates,lifeWeeksView,lifeYearTier} from '../client/src/life-weeks-v0582.js';

test('Birthday starts first year 28 June 1983 and each year exactly',()=>{
 assert.equal(LIFE_BIRTHDAY,'1983-06-28');
 assert.deepEqual([lifeYearRange(0).start,lifeYearRange(0).endExclusive,lifeYearRange(43).start],['1983-06-28','1984-06-28','2026-06-28']);
 assert.equal(lifeYearRange(40).days,366); // Jun 2023–Jun 2024 includes Feb 29
});
test('53rd partial week is not a duplicate and every day is represented exactly once',()=>{
 for(const age of [0,1,40,43,79,89,99]){const r=lifeYearRange(age),cells=lifeWeekCells(age,{today:'2026-10-31'});assert.equal(cells.length,53);assert.equal(cells.reduce((s,c)=>s+c.days,0),r.days);assert.equal(cells[0].start,r.start);assert.equal(cells[52].days,r.days-364);for(let i=1;i<cells.length;i++){const prior=Date.parse(cells[i-1].end+'T00:00:00Z');const next=Date.parse(cells[i].start+'T00:00:00Z');assert.equal(next-prior,86400000);}}
});
test('Month July starts three days after birthday, Jan 1 visually distinct',()=>{
 const m=lifeMonthMarkers(43);const july=m.find(x=>x.date==='2026-07-01');const jan=m.find(x=>x.date==='2027-01-01');
 assert.ok(july&&jan);assert.ok(july.pct>0.7&&july.pct<0.85);assert.ok(jan.newYear);assert.ok(jan.pct>49&&jan.pct<51);
});
test('Current life-week correctly marked, future cells stay empty',()=>{
 const cells=lifeWeekCells(43,{today:'2026-10-31'});assert.equal(cells.filter(c=>c.status==='current').length,1);assert.equal(cells.at(-1).status,'future');assert.equal(lifeAgeAt('2026-06-27'),42);assert.equal(lifeAgeAt('2026-06-28'),43);
});
test('Events color every overlapping weekly cell including event spanning months',()=>{
 const row={id:'trip1',title:'Sydney',start:'2026-06-30',end:'2026-07-09',category:'travel'};
 const cells=lifeWeekCells(43,{today:'2026-10-31',events:[row]});assert.equal(cells.filter(c=>c.events.length).length,2);assert.equal(cells[0].events[0].title,'Sydney');
});
test('Life events validate dates, inclusivity, category and are editable',()=>{
 const state={};const v=putLifeEvent(state,{id:'a',title:'China',start:'2004-01-01',end:'2004-01-01',category:'travel'});assert.equal(state.lifeWeekEvents.length,1);assert.equal(v.end,'2004-01-01');assert.throws(()=>validateLifeEvent({title:'x',start:'2026-10-02',end:'2026-10-01',category:'other'}));putLifeEvent(state,{id:'a',title:'China Familienurlaub',start:'2004-01-01',end:'2004-01-10',category:'family'});assert.equal(state.lifeWeekEvents.length,1);deleteLifeEvent(state,'a');assert.equal(state.lifeWeekEvents[0].deleted,true);
});
test('Device journal merge retains different events and deleted tombstones',()=>{
 const left=[{id:'a',title:'A',start:'2000-01-01',updatedAt:'2026-01-01T00:00:00Z',deleted:false}];const right=[{id:'a',title:'A',start:'2000-01-01',updatedAt:'2026-01-02T00:00:00Z',deleted:true},{id:'b',updatedAt:'2026-01-03T00:00:00Z',start:'2001-01-01'}];const out=mergeLifeWeekEvents(left,right);assert.equal(out.length,2);assert.equal(out.find(x=>x.id==='a').deleted,true);
});
test('Google all-day end is exclusive, calendar item is merely a candidate',()=>{
 const calendar=[{id:'g1',summary:'Familienurlaub China',start:{date:'2003-08-01'},end:{date:'2003-08-15'}},{id:'g2',summary:'Arbeitsmeeting',start:{date:'2003-12-01'},end:{date:'2003-12-02'}}];
 const suggestions=calendarLifeCandidates(calendar,20);assert.equal(suggestions.length,1);assert.equal(suggestions[0].end,'2003-08-14');assert.equal(suggestions[0].title,'Familienurlaub China');
 assert.equal(calendarLifeCandidates(calendar,20,{existing:[{calendarRef:'g1'}]}).length,0);
 assert.equal(calendarLifeCandidates(calendar,20,{query:'Arbeits'}).length,1);
});
test('Life milestones tiers Bronze/Silver/Gold/Star as stated',()=>{assert.deepEqual([69,70,80,90,100].map(lifeYearTier),['base','bronze','silver','gold','star']);});
test('UI contains Jul monthly gridlines, Jan New Year, edit form and zoom',()=>{
 const html=lifeWeeksView({lifeWeekEvents:[]},{today:'2026-10-31',selectedAge:43,bonus:false});
 assert.match(html,/My Life in Weeks/);assert.match(html,/lw82-year-line/);assert.match(html,/2026-07-01/);assert.match(html,/2027-01-01/);assert.match(html,/lw82-event-form/);assert.match(html,/calendar-fetch/);assert.match(html,/1983/);assert.match(html,/1984/);assert.doesNotMatch(html,/class="lw82-row lw82-silver"/);
 const expanded=lifeWeeksView({}, {bonus:true,today:'2026-10-31'});assert.match(expanded,/lw82-silver/);assert.match(expanded,/lw82-gold/);
});
