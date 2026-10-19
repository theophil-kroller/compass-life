import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createFinanceTrip,validFinanceTrip,travelAttributable,tripSuggestion,tripCandidateRows,tripReport,tripDelete,financeTravelView} from '../client/src/finance-travel.js';
const trip=createFinanceTrip({id:'trip-123456',name:'Example journey',start:'2026-07-01',end:'2026-07-20'});
const tx=(id,day,amountCents,category,flow='expense',extra={})=>({id,day,amountCents,category,flow,description:`Booking ${id}`,merchant:id,...extra});
const rows=[
 tx('air','2026-04-01',-45000,'Freizeit & Reisen / Flüge'),
 tx('hotel','2026-07-05',-22000,'Freizeit & Reisen / Reisen & Unterkunft'),
 tx('food','2026-07-06',-3400,'Lebensmittel / Supermarkt'),
 tx('rent','2026-07-02',-100000,'Wohnen / Miete & Betriebskosten'),
 tx('savings','2026-07-07',-30000,'Transfer / Eigene Konten','transfer'),
 tx('cash','2026-07-09',-5000,'Bargeld / Bargeldbehebung','cash'),
 tx('refund','2026-07-11',2500,'Rückerstattung / Rückzahlung','refund'),
 tx('pending','2026-07-12',-9800,'Prüfen / Noch ungeklärt','expense',{needsReview:true}),
 tx('other','2026-09-05',-1200,'Freizeit & Reisen / Flüge'),
];
test('0.5.15 travel: date validator checks calendar and trip boundaries',()=>{
 assert.equal(validFinanceTrip(trip),true);
 assert.throws(()=>createFinanceTrip({...trip,start:'2026-02-30'}));
 assert.throws(()=>createFinanceTrip({...trip,start:'2026-07-21'}));
 assert.throws(()=>createFinanceTrip({...trip,end:'2028-01-01'}));
 assert.throws(()=>createFinanceTrip({...trip,name:'X'}));
});
test('0.5.15 travel: candidates include prepayments, never infer a transfer is consumption',()=>{
 assert.equal(tripSuggestion(rows[0],trip).reason,'Mögliche Vorausbuchung vor Reisebeginn');
 assert.ok(tripSuggestion(rows[1],trip));
 assert.ok(tripSuggestion(rows[3],trip),'Rent is shown for user evaluation, not auto-assigned');
 assert.equal(tripSuggestion(rows[4],trip),null);
 assert.equal(tripSuggestion(rows[8],trip),null);
 assert.equal(tripCandidateRows(rows,trip).length,7);
 assert.equal(tripCandidateRows(rows,trip,{}, {},'','all').length,8);
});
test('0.5.15 travel: assigning and excluding are explicit and do not mutate the original bank row',()=>{
 const assignments={air:trip.id,hotel:trip.id,food:trip.id,refund:trip.id,cash:trip.id,pending:trip.id};
 assert.equal(tripCandidateRows(rows,trip,assignments,{[`${trip.id}|rent`]:true}).some(t=>t.id==='rent'),false);
 const report=tripReport(trip,rows,assignments);
 assert.equal(report.expenseCents,70400);assert.equal(report.refundCents,2500);
 assert.equal(report.netCents,67900);
 assert.equal(report.cashCents,5000);assert.equal(report.unresolvedCents,9800);
 assert.equal(report.unresolvedCount,1);assert.equal(report.linkedCount,6);
 assert.equal(rows[0].tripId,undefined,'Travel links do not change the CSV category');
 const removed=tripDelete(trip.id,assignments,{[`${trip.id}|rent`]:true,['trip-another|any']:true});
 assert.deepEqual(removed.links,{});assert.deepEqual(removed.exclusions,{'trip-another|any':true});
});
test('0.5.15 travel: data from other trips are not stolen or double counted',()=>{
 const links={air:'trip-abcdef',hotel:trip.id};
 assert.equal(tripReport(trip,rows,links).netCents,22000);
 assert.equal(tripCandidateRows(rows,trip,links).some(t=>t.id==='air'),false);
 assert.equal(travelAttributable(rows[4]),false);
});
test('0.5.15 travel: HTML escapes names, no private data or false automatic assignment',()=>{
 const malicious=createFinanceTrip({id:'trip-evil123',name:'<img src=x onerror=alert(1)>',start:trip.start,end:trip.end});
 const html=financeTravelView({financeTrips:[malicious],financeTransactions:rows});
 assert.ok(!html.includes('<img src=x'));assert.match(html,/&lt;img/);
 assert.match(html,/Buchungen für diese Reise prüfen/);
 assert.match(html,/Raiffeisen-EUR-Auszug/);
 assert.match(html,/finance-trip-add/);
 assert.match(html,/Keine weiteren Vorschläge|Zuordnen/);
 assert.match(financeTravelView({}),/Reise anlegen/);
});
test('0.5.15 travel: route wired in actual Finance tab, encrypted state mutations, version set',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const dash=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');
 const pane=readFileSync(new URL('../client/src/finance-preview.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.29'/);
 assert.match(main,/data-action="finance-trip-add"|action==='finance-trip-add'/);
 assert.match(main,/financeTripAssignments/);assert.match(main,/financeTripExcluded/);
 assert.match(dash,/financeTravelView/);assert.match(pane,/title:'Reisen'/);
});
