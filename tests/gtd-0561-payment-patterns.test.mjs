import test from 'node:test';
import assert from 'node:assert/strict';
import {detectPaymentPatterns,dailyPaymentForecast} from '../client/src/finance-payment-patterns-v561.js';
import {cashflowModel,cashflowDashboard} from '../client/src/finance-cashflow-v560.js';
const today='2026-10-20';
function samples(){const rows=[];for(let year=2024;year<=2026;year++)for(let month=1;month<=12;month++){
 if(year===2026&&month>9)continue;
 const ym=`${year}-${String(month).padStart(2,'0')}`;
 // One single payment each month. Seasonal pay supplements are inside salary, not separate transactions.
 const supplement=[5,6,11,12].includes(month)?40000:0;
 rows.push({id:`sal-${ym}`,day:`${ym}-28`,merchant:'Universität Arbeitgeber',category:'Einnahmen / Gehalt',flow:'income',currency:'EUR',amountCents:230000+supplement});
 rows.push({id:`rent-${ym}`,day:`${ym}-04`,merchant:'Hausverwaltung Muster',category:'Wohnen / Miete & Betriebskosten',flow:'expense',currency:'EUR',amountCents:year===2026?-71000:-65000});
 rows.push({id:`phone-${ym}`,day:`${ym}-10`,merchant:'Telekom Anbieter',category:'Verträge & Abos / Telekommunikation',flow:'expense',currency:'EUR',amountCents:-2200});
 rows.push({id:`grocery-${ym}`,day:`${ym}-18`,merchant:'Supermarkt A',category:'Lebensmittel / Supermarkt',flow:'expense',currency:'EUR',amountCents:-15000});
 }return rows;}
const settings={openingCents:200000,bufferCents:150000,asOf:today};
test('salary extras are part of the same salary transfer and are NOT additional predicted income',()=>{
 const rows=samples(),patterns=detectPaymentPatterns(rows,today),salary=patterns.find(p=>p.type==='salary');
 assert.ok(salary);assert.equal(salary.baselineCents,230000);
 assert.deepEqual(salary.seasonalUplifts.map(p=>p.month),['05','06','11','12']);
 assert.ok(salary.seasonalUplifts.every(p=>p.years>=2&&p.extraCents===40000));
 const daily=dailyPaymentForecast({transactions:rows,patterns,today,opening:200000});
 assert.ok(daily);const nov=daily.events.filter(e=>e.day.startsWith('2026-11')&&e.source==='salary');
 assert.equal(nov.length,1);assert.equal(nov[0].cents,230000);assert.equal(daily.year[1].expectedIncome,230000);
});
test('rental Betriebskosten retain latest amount and near-monthly payment day',()=>{
 const patterns=detectPaymentPatterns(samples(),today),rent=patterns.find(p=>p.name==='Hausverwaltung Muster');
 assert.equal(rent.type,'fixed-cost');assert.equal(rent.baselineCents,71000);
 const d=dailyPaymentForecast({transactions:samples(),patterns,today,opening:200000});
 assert.ok(d.events.some(e=>e.label==='Hausverwaltung Muster'&&e.day==='2026-11-04'&&e.cents===-71000));
});
test('supermarket purchases do not masquerade as contract fixed costs and remain in variable spending',()=>{
 const patterns=detectPaymentPatterns(samples(),today);
 assert.equal(patterns.some(p=>p.name==='Supermarkt A'),false);
 const d=dailyPaymentForecast({transactions:samples(),patterns,today,opening:200000});
 assert.equal(d.variableCents,15000);assert.ok(d.events.some(e=>e.source==='variable'));
});
test('daily runway detects a trough BEFORE late salary despite comfortable month end',()=>{
 const rows=samples();const m=cashflowModel({transactions:rows,today,settings,whatIf:{day:'2026-10-21',cents:90000}});
 assert.equal(m.mode,'daily');assert.equal(m.verdict,'risk');
 assert.ok(m.trough<=110000&&m.trough>=90000);assert.equal(m.year[0].expectedIncome,230000);
 assert.ok(m.year[0].scenarioBalance>settings.bufferCents);
});
test('current-month salary and fixed costs that are already posted cannot be predicted a second time',()=>{
 const rows=[...samples(),{id:'sal-current',day:'2026-10-10',merchant:'Universität Arbeitgeber',category:'Einnahmen / Gehalt',flow:'income',amountCents:230000,currency:'EUR'},{id:'rent-current',day:'2026-10-04',merchant:'Hausverwaltung Muster',category:'Wohnen / Miete & Betriebskosten',flow:'expense',amountCents:-71000,currency:'EUR'}];
 const m=cashflowModel({transactions:rows,today,settings});assert.equal(m.mode,'daily');
 assert.equal(m.daily.events.filter(e=>e.day.startsWith('2026-10')&&e.source==='salary').length,0);
 assert.equal(m.daily.events.filter(e=>e.day.startsWith('2026-10')&&e.source==='fixed-cost'&&e.label==='Hausverwaltung Muster').length,0);
});
test('bad merchant coverage preserves clearly labelled monthly fallback, never fabricated certainty',()=>{
 const rows=samples().map(t=>({...t,merchant:'',merchantDisplayName:''}));
 const m=cashflowModel({transactions:rows,today,settings,whatIf:{day:today,cents:100000}});
 assert.equal(m.mode,'monthly');assert.ok(m.warnings.some(x=>x.includes('Monatsmodell')));
});
test('a date-stale opening balance prevents an affordability verdict',()=>{
 const m=cashflowModel({transactions:samples(),today,settings:{...settings,asOf:'2026-10-19'},whatIf:{day:today,cents:80000}});
 assert.equal(m.mode,'daily');assert.equal(m.verdict,'unavailable');assert.equal(m.trough,null);
});
test('external transfers / credit cards do not become double-counted subscriptions',()=>{
 const rows=samples();for(let m=4;m<=9;m++)rows.push({day:`2026-${String(m).padStart(2,'0')}-12`,merchant:'Eigenes Konto',amountCents:-100000,flow:'transfer',category:'Transfer / Eigene Konten',currency:'EUR'});
 const patterns=detectPaymentPatterns(rows,today);assert.equal(patterns.some(p=>p.name==='Eigenes Konto'),false);
 const d=dailyPaymentForecast({transactions:rows,patterns,today,opening:200000});assert.equal(d.variableCents,15000);
});
test('rendered forecast discloses bonus uncertainty and the distinction between daily and monthly projections',()=>{
 const html=cashflowDashboard({financeTransactions:samples(),financeCashflowSettings:settings},today,{day:today,cents:50000});
 assert.match(html,/Tagesprognose aktiv/);assert.match(html,/Beobachtete höhere Gehaltsmonate/);assert.match(html,/gemeinsamen Gehalt/);
 assert.match(html,/Diese Erhöhungen werden nicht in den verfügbaren Grundbetrag eingerechnet/);
});
test('categorized Betriebskosten transfers are detected as fixed costs without treating all transfers as subscriptions',()=>{
 const rows=samples().map(r=>r.merchant==='Hausverwaltung Muster'?{...r,flow:'transfer',category:'Wohnen / Miete & Betriebskosten'}:r);
 const p=detectPaymentPatterns(rows,today),rent=p.find(x=>x.name==='Hausverwaltung Muster');
 assert.ok(rent);assert.equal(rent.baselineCents,71000);
 const d=dailyPaymentForecast({transactions:rows,patterns:p,today,opening:200000});assert.ok(d);
});
test('salary only pattern removes unconfirmed seasonal uplift even if daily forecast is unavailable',()=>{
 const rows=samples().map(t=>t.flow==='expense'?{...t,merchant:''}:t);
 const m=cashflowModel({transactions:rows,today});assert.equal(m.mode,'monthly');assert.equal(m.monthlyIncome,230000);
});
