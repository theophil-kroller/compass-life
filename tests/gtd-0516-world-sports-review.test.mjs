import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {approximatePlace,countryAt} from '../client/src/offline-places.js';
import {summarizeSports,sportsInsightsView} from '../client/src/sports-insights.js';
import {reviewImportHub} from '../client/src/review-import-hub.js';
import {PLACE_MAP_REGIONS,placesInsightsView} from '../client/src/insights-places.js';
import {validActivityEdit} from '../client/src/activity-management.js';

test('offline atlas identifies real countries without network geocoding and marks place hints approximate',()=>{
 assert.equal(countryAt(47.07,15.439)?.name,'Österreich');
 assert.equal(countryAt(-33.87,151.21)?.name,'Australien');
 assert.match(approximatePlace(47.07,15.439).name,/Raum Graz/);
 assert.match(approximatePlace(-33.87,151.21).name,/Raum Sydney/);
 assert.equal(approximatePlace(47.07,15.439).approximate,true);
 assert.equal(countryAt(30,-40),null);
});
test('five map presets and zoom controls rendered with local country coastline',()=>{
 for(const key of ['world','europe','austria','china','australia'])assert.ok(PLACE_MAP_REGIONS[key]);
 const v={id:'g1',start:'2026-09-10T09:00:00Z',end:'2026-09-10T12:00:00Z',minutes:180,lat:47.07,lon:15.44,source:'googleTimeline',name:'',confirmed:false};
 const html=placesInsightsView({visits:[v],mapRegion:'austria',mapZoom:2});
 assert.match(html,/Raum Graz/);assert.match(html,/places-map-region/);assert.match(html,/places-map-zoom/);
 assert.match(html,/places-world-svg/);assert.match(html,/Natural Earth/);
 assert.doesNotMatch(html,/maps.googleapis|openstreetmap.org/);
});
test('sport totals are categorical, use genuine distances and avoid overlapping duplicate manual session',()=>{
 const sessions=[{id:'fit-1',start:'2026-10-10T10:00:00Z',day:'2026-10-10',sport:2,durationMinutes:70,distanceKm:23.5},
 {id:'fit-2',start:'2026-10-11T10:00:00Z',day:'2026-10-11',sport:17,durationMinutes:190,distanceKm:8.25}];
 const activities=[{id:'m1',startedAt:'2026-10-10T10:00',title:'Radfahren',durationMinutes:70},
 {id:'m2',startedAt:'2026-10-12T18:00',title:'Zouk Tanzen',durationMinutes:120},
 {id:'m3',startedAt:'2026-10-13T12:00',title:'Sauna',durationMinutes:90},
 {id:'m4',startedAt:'2026-10-14T12:00',title:'Disc Golf',durationMinutes:60,distanceKm:3.2}];
 const groups=summarizeSports(sessions,activities,{start:'2026-10-01',end:'2026-10-31'});
 assert.equal(groups.find(g=>g.type==='cycling').count,1);
 assert.equal(groups.find(g=>g.type==='cycling').distanceKm,23.5);
 assert.equal(groups.find(g=>g.type==='dancing').minutes,120);
 assert.equal(groups.find(g=>g.type==='disc').distanceKm,3.2);
 assert.equal(groups.find(g=>g.type==='sauna').measuredDistance,false);
 const html=sportsInsightsView(sessions,activities,{start:'2026-10-01',end:'2026-10-31'});
 for(const label of ['Radfahren','Tanzen','Sauna &amp; Therme','Disc Golf','Wandern'])assert.match(html,new RegExp(label));
});
test('optional manual distances are valid, no negative or infinite distances',()=>{
 const v={title:'Tanzen',category:'Freizeit',startedAt:'2026-10-12T18:00',durationMinutes:120,note:'',projectId:'',distanceKm:null};
 assert.equal(validActivityEdit(v),true);
 assert.equal(validActivityEdit({...v,distanceKm:12.3}),true);
 assert.equal(validActivityEdit({...v,distanceKm:-3}),false);
 assert.equal(validActivityEdit({...v,distanceKm:Infinity}),false);
});
test('weekly review hub offers all three working imports with previews, hints, no state mutation',()=>{
 const state={healthImports:{garminNights:[],garminSessions:[],fitdays:[]},placesVisits:[],financeTransactions:[]};
 const html=reviewImportHub({state});
 for(const id of ['health-import-input','places-import-input','finance-files'])assert.match(html,new RegExp(`id="${id}"`));
 for(const text of ['Standortdienste','Raiffeisen','Garmin Connect','Fitdays','Kraken'])assert.match(html,new RegExp(text));
 assert.deepEqual(state.financeTransactions,[]);
});
test('existing review step order preserved and main handlers wired',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const guided=readFileSync(new URL('../client/src/guided-review.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.53'/);
 assert.match(main,/reviewImportHub\(/);assert.match(main,/places-map-region/);assert.match(main,/places-map-zoom/);
 assert.match(main,/sportsInsightsView\(/);assert.match(main,/distanceKm/);
 assert.match(guided,/\{id:'finish'/);
});
