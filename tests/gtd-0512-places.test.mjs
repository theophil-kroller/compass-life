import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseTimelineData,inspectTimelineFiles,manualPlaceVisit,mergePlaces,placeClusters,compareSleepPlaces,placesInsightsView} from '../client/src/insights-places.js';
import {INSIGHT_TABS} from '../client/src/insights.js';

const fixture={semanticSegments:[
 {startTime:'2026-10-14T21:00:00+02:00',endTime:'2026-10-15T09:00:00+02:00',visit:{isConfirmed:true,topCandidate:{placeLocation:{latLng:'47.0707°, 15.4395°'}}}},
 {startTime:'2026-10-15T09:15:00+02:00',endTime:'2026-10-15T11:00:00+02:00',activity:{start:{latLng:'47.07°, 15.44°'},end:{latLng:'48.2°, 16.3°'}}},
 {startTime:'2026-10-15T11:00:00+02:00',endTime:'2026-10-15T12:00:00+02:00',timelinePath:[{point:'47.07°, 15.44°'}]},
 {startTime:'2026-10-15T14:00:00+02:00',endTime:'2026-10-15T18:00:00+02:00',visit:{topCandidate:{placeLocation:{latLng:'48.2082°, 16.3738°'}}}}
]};
const night={day:'2026-10-15',start:'2026-10-14T23:30:00+02:00',end:'2026-10-15T07:30:00+02:00',totals:{deep:95,light:240,rem:90,awake:30}};
test('modern Android timeline parses visits only and respects timezone offsets',()=>{
 const visits=parseTimelineData(fixture);
 assert.equal(visits.length,2);
 assert.equal(visits[0].start,'2026-10-14T19:00:00.000Z');
 assert.equal(visits[0].lat,47.0707);
 assert.equal(visits[0].confirmed,true);
 assert.equal(visits[1].confirmed,false);
 assert.ok(visits.every(v=>v.source==='googleTimeline'));
});
test('historical Takeout placeVisit, coordinates E7 and timestamps supported',()=>{
 const j={timelineObjects:[{placeVisit:{duration:{startTimestampMs:'1791990000000',endTimestampMs:'1791997200000'},location:{latitudeE7:470707000,longitudeE7:154395000,name:'Ort'}}}]};
 const v=parseTimelineData(j);
 assert.equal(v.length,1);assert.equal(v[0].lat,47.0707);assert.equal(v[0].name,'Ort');
});
test('invalid positions, short visits and GPS activity are rejected',()=>{
 const j={semanticSegments:[
 {startTime:'2026-10-17T10:00:00Z',endTime:'2026-10-17T10:05:00Z',visit:{topCandidate:{placeLocation:{latLng:'47°, 15°'}}}},
 {startTime:'2026-10-17T10:00:00Z',endTime:'2026-10-17T11:00:00Z',visit:{topCandidate:{placeLocation:{latLng:'99°, 15°'}}}},
 {startTime:'2026-10-17T10:00:00Z',endTime:'2026-10-17T11:00:00Z',activity:{start:{latLng:'47°, 15°'}}}
 ]};
 assert.deepEqual(parseTimelineData(j),[]);
 assert.throws(()=>parseTimelineData({rawSignals:[]}),/semanticSegments/);
});
test('bulk JSON inspection produces previews and duplicate-safe merge',async()=>{
 const file={name:'Timeline.json',size:100,async arrayBuffer(){return new TextEncoder().encode(JSON.stringify(fixture)).buffer;}};
 const preview=await inspectTimelineFiles([file,file]);
 assert.equal(preview.visits.length,2);
 let x=mergePlaces([],preview.visits);assert.equal(x.added,2);
 x=mergePlaces(x.visits,preview.visits);assert.equal(x.added,0);assert.equal(x.visits.length,2);
});
test('manual entries require valid named coordinates and time span',()=>{
 const v=manualPlaceVisit({name:'Sydney',lat:-33.865,lon:151.21,start:'2026-08-10T21:00:00+10:00',end:'2026-08-11T07:00:00+10:00'});
 assert.equal(v.source,'manual');assert.equal(v.confirmed,true);
 assert.throws(()=>manualPlaceVisit({name:'Berlin',lat:91,lon:13,start:v.start,end:v.end}),/gültige/);
});
test('sleep match uses night midpoint only, ignores ambiguous overlapping visits',()=>{
 const visits=parseTimelineData(fixture);
 const found=compareSleepPlaces([night],visits,{'47,15.5':'Graz'});
 assert.equal(found.length,1);assert.equal(found[0].nights,1);assert.equal(found[0].avgMinutes,425);
 const overlap={...visits[0],id:'another',lat:47.09,lon:15.48};
 assert.equal(compareSleepPlaces([night],[...visits,overlap]).length,0);
 assert.equal(compareSleepPlaces([{...night,totals:{}}],visits).length,0);
});
test('clusters filter periods, preserve labels, and do not invent place names',()=>{
 const visits=parseTimelineData(fixture),labels={'47,15.5':'Graz'};
 const clusters=placeClusters(visits,labels,{start:'2026-10-14',end:'2026-10-14'});
 assert.equal(clusters.length,1);assert.equal(clusters[0].name,'Graz');
 assert.equal(placeClusters(visits,{}, {start:'2027-01-01',end:'2027-01-02'}).length,0);
});
test('places screen renders local map, source disclosure, empty and non-empty views without HTML injection',()=>{
 const visits=parseTimelineData(fixture),html=placesInsightsView({visits,nights:[night],labels:{'47,15.5':'<unsafe>'},range:{start:'2026-10-01',end:'2026-10-18'}});
 assert.match(html,/places-world-svg/);assert.match(html,/Schlaf nach Aufenthaltsort/);assert.match(html,/Reiseverlauf/);assert.match(html,/Google: bestätigt/);
 assert.match(html,/&lt;unsafe&gt;/);assert.doesNotMatch(html,/<unsafe>/);
 assert.match(html,/keine lückenlose Reise/);assert.match(html,/nur lokale Standortdaten/);
 assert.match(placesInsightsView(),/Keine Aufenthalte importiert/);
});
test('main screen uses new Places view and no API endpoint for location data',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.14\.1'/);
 assert.match(main,/placesInsightsView\(/);assert.match(main,/places-import-confirm/);assert.match(main,/places-clear/);
 assert.match(main,/s\.placesVisits/);
 assert.equal(INSIGHT_TABS.find(t=>t.id==='places').state,'live');
});
