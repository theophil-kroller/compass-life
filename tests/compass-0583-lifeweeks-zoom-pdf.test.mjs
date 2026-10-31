import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lifeElapsedMetrics,lifeYearTier,lifeZoomSizing,normalizeLifeZoom,lifeWeeksView} from '../client/src/life-weeks-v0582.js';
import {buildLifeWeeksPdf,lifeWeeksPosterModel} from '../client/src/life-weeks-pdf-v0583.js';
const src=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
const bytestr=bytes=>new TextDecoder().decode(bytes);
test('31 October 2026 stats: day/week/month/year and seven-year cycle are precise',()=>{
 const m=lifeElapsedMetrics('2026-10-31');
 assert.equal(m.lifeYear,44);assert.equal(m.lifeMonth,521);assert.equal(m.sevenCycle,7);assert.equal(m.sevenYear,2);
 assert.equal(m.lifeDay,m.completedDays+1);assert.equal(m.lifeWeek,m.completedWeeks+1);
 assert.equal(m.cycleStart,'2025-06-28');assert.equal(m.cycleEndExclusive,'2032-06-28');
});
test('Zoom levels are restricted to agreed steps and fit respects 80 and 110 years',()=>{
 assert.deepEqual([100,90,80,75,70,60,50].map(normalizeLifeZoom),[100,90,80,75,70,60,50]);
 assert.equal(normalizeLifeZoom('unknown'),'fit');assert.equal(lifeZoomSizing('fit',110).years,110);
 assert.equal(lifeZoomSizing(50,80).rowHeight,9.5);
});
test('UI contains life stats and seven-year separators, zoom and direct A4/A3 PDF actions',()=>{
 const ui=lifeWeeksView({}, {today:'2026-10-31',bonus:true});
 assert.match(ui,/Dein Lebenstag/);assert.match(ui,/7-Jahreszyklus/);
 for(const q of ['100 %','90 %','80 %','75 %','70 %','60 %','50 %','Alles einpassen'])assert.ok(ui.includes(q),q);
 assert.match(ui,/data-action="lw83-pdf" data-id="A4"/);assert.match(ui,/data-action="lw83-pdf" data-id="A3"/);
 assert.match(src,/buildLifeWeeksPdf/);assert.match(src,/URL\.createObjectURL/);
});
test('Both paper sizes and all life spans produce valid one-page vector PDF',()=>{
 for(const paper of ['A4','A3'])for(const years of [80,100,110]){
  const buf=buildLifeWeeksPdf({today:'2026-10-31',years,paper});const s=bytestr(buf);
  assert.ok(buf.length>70000,`${paper} ${years}: ${buf.length}`);
  assert.ok(s.startsWith('%PDF-1.4'));assert.match(s,/\/Count 1\b/);
  assert.match(s,paper==='A4'?/\/MediaBox \[0 0 841\.89 595\.28\]/:/\/MediaBox \[0 0 1190\.55 841\.89\]/);
  assert.match(s,/\/Subtype \/Type1 \/BaseFont \/Helvetica/);
  assert.equal((s.match(/\/Type \/Page\b/g)||[]).length,1);
  assert.ok((s.match(/ re f/g)||[]).length>years*53,`Vector boxes missing for ${paper},${years}`);
 }
});
test('Poster marks crossing-years trips and current week, not deleted events',()=>{
 const events=[{id:'trip',title:'Sydney',start:'2026-10-01',end:'2026-11-02',category:'travel'},
 {id:'removed',title:'Hidden',start:'2026-10-01',end:'2026-11-02',category:'career',deleted:true}];
 const model=lifeWeeksPosterModel({events,today:'2026-10-31',years:80});
 assert.equal(model.events.length,1);
 const row=model.rows.find(r=>r.age===43);assert.ok(row.cells.some(c=>c.events.length&&c.status==='current'));
 const content=bytestr(buildLifeWeeksPdf({events,today:'2026-10-31'}));
 assert.ok(content.includes('0.39 0.6 0.77 rg')); // travel RGB from #649ac4
 assert.ok(content.includes('/Count 1'));
});
test('PDF export rejects invalid formats/dates/years before touching private data',()=>{
 for(const opts of [{paper:'A2'},{years:90},{today:'not-a-date'},{today:'2026-02-30'}])assert.throws(()=>buildLifeWeeksPdf(opts));
});
