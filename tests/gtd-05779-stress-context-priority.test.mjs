import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStressContext,stressContextView} from '../client/src/stress-context-v5778.js';
import {buildStressPatterns,stressPatternsView} from '../client/src/stress-patterns-v5779.js';
import {buildWellnessInsights,insightsStressView} from '../client/src/insights-wellness.js';
const day='2026-10-19';
const local=t=>new Date(`${day}T${t}:00`).toISOString();
const dataset=(data)=>buildWellnessInsights({garminWellness:data},day,'7');
const event=(id,name,start,end)=>({id,summary:name,start:{dateTime:local(start)},end:{dateTime:local(end)}});
const coverage={start:'2026-10-01',end:'2026-10-31',complete:true};
test('finished appointment shortly before peak is explicitly shown as preceding it, not overlapping',()=>{
 const model=dataset([{at:local('11:00'),stress:90},{at:local('11:05'),stress:89}]);
 const r=buildStressContext({model,calendarEvents:[event('one','Kritisches Meeting','10:20','10:45')],calendarCoverage:coverage});
 const peak=r.recentPeaks[0];assert.equal(peak.calendar.length,0);
 assert.equal(peak.nearbyCalendar[0].title,'Kritisches Meeting');assert.equal(peak.nearbyCalendar[0].minutes,15);
 assert.equal(peak.nearbyCalendar[0].relation,'before');
 const html=stressContextView(r);assert.match(html,/15 Min. davor beendet/);
 assert.match(html,/Kritisches Meeting/);assert.match(html,/Stressphasen/);
 assert.ok(html.indexOf('Kritisches Meeting')<html.indexOf('Ruhe, niedrige und mittlere Stresswerte'));
});
test('future event close to peak is labelled afterwards and not invented as coincident',()=>{
 const r=buildStressContext({model:dataset([{at:local('11:00'),stress:95}]),calendarEvents:[event('later','Nächster Termin','11:30','12:10')],calendarCoverage:coverage});
 assert.equal(r.recentPeaks[0].calendar.length,0);assert.equal(r.recentPeaks[0].nearbyCalendar[0].relation,'after');
 assert.match(stressContextView(r),/25 Min. danach begonnen/);
});
test('no calendar archive leads to meaningful one-click synchronization instead of fake empty history',()=>{
 const html=insightsStressView({garminWellness:[{at:local('10:20'),stress:75}]},'7',day,'','day',14,0,{calendarEvents:[],calendarCoverage:null,calendarConnected:true});
 assert.match(html,/Kalenderhistorie fehlt/);assert.match(html,/data-action="calendar-refresh"/);
});
test('repeated pattern offers prominent text summary instead of only category tables',()=>{
 const days=['2026-10-17','2026-10-18','2026-10-19'];
 const timed=(d,t)=>new Date(`${d}T${t}:00`).toISOString();
 const points=days.flatMap(d=>[['09:30',32],['09:35',30],['10:05',81],['10:10',86],['10:40',35],['10:45',30]].map(([t,stress])=>({at:timed(d,t),stress})));
 const meetings=days.map((d,i)=>({id:'m'+i,summary:'Projektmeeting',start:{dateTime:timed(d,'10:00')},end:{dateTime:timed(d,'10:30')}}));
 const model=buildWellnessInsights({garminWellness:points},day,'7');
 const r=buildStressPatterns({model,calendarEvents:meetings,calendarCoverage:coverage});
 const h=stressPatternsView(r);assert.match(h,/Wiederkehrende Beobachtungen/);
 assert.match(h,/Projektmeeting|Meetings &amp; Besprechungen/);
 assert.ok(h.indexOf('Wiederkehrende Beobachtungen')<h.indexOf('Vergleichbare Ereignisarten'));
});
