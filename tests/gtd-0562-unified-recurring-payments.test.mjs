import test from 'node:test';
import assert from 'node:assert/strict';
import {merchantKey} from '../client/src/finance-core.js';
import {financeRecurringCandidates} from '../client/src/finance-analytics.js';
import {detectPaymentPatterns,dailyPaymentForecast} from '../client/src/finance-payment-patterns-v561.js';
import {cashflowModel,cashflowDashboard} from '../client/src/finance-cashflow-v560.js';
const today='2026-10-20';
const items=[];
for(let m=1;m<=9;m++){
 const mo=String(m).padStart(2,'0');
 items.push({id:'salary-'+mo,merchant:'Universität Arbeitgeber',flow:'income',category:'Einnahmen / Gehalt',description:'Gehalt',day:`2026-${mo}-27`,amountCents:246000});
 items.push({id:'rent-'+mo,merchant:'Sylvia Stuhlpfarrer',flow:'transfer',category:'Transfer / Private Überweisung',description:'Betriebskosten Wohnung',day:`2026-${mo}-${String(3+(m%3)).padStart(2,'0')}`,amountCents:m>=8?-37700:-35900});
 items.push({id:'transit-'+mo,merchant:'WIENER LINIEN',flow:'expense',category:'Mobilität / Öffentliche Verkehrsmittel',description:'Jahreskarte monatliche Abbuchung',day:`2026-${mo}-${String(9+(m%4)).padStart(2,'0')}`,amountCents:-5100});
 items.push({id:'market-'+mo,merchant:'Supermarkt A',flow:'expense',category:'Lebensmittel / Supermarkt',day:`2026-${mo}-15`,amountCents:-14500});
}
test('Betriebskosten as outgoing private bank transfer are visible in both recurring-cost screens',()=>{
 const p=detectPaymentPatterns(items,today);const rent=p.find(x=>x.name==='Sylvia Stuhlpfarrer');
 assert.ok(rent);assert.equal(rent.kind,'expense');assert.equal(rent.baselineCents,37700);
 const c=financeRecurringCandidates(items);
 assert.ok(c.some(x=>x.merchant==='Sylvia Stuhlpfarrer'));
});
test('monthly Wiener Linien public-transport charge is recognized and uses manual contract confirmation',()=>{
 const manual={[merchantKey('WIENER LINIEN')]:'fixed'};
 const p=detectPaymentPatterns(items,today,manual);
 assert.ok(p.some(x=>x.name==='WIENER LINIEN'&&x.confirmed));
 const c=financeRecurringCandidates(items,manual);
 assert.ok(c.some(x=>x.merchant==='WIENER LINIEN'&&x.status==='fixed'));
 const model=cashflowModel({transactions:items,recurringRules:manual,today});
 assert.ok(model.patterns.some(x=>x.name==='WIENER LINIEN'));
 assert.ok(model.daily.events.some(e=>e.label==='WIENER LINIEN'));
});
test('monthly public-transport fixed charge is also a recurring candidate without explicit confirmation',()=>{
 const candidates=financeRecurringCandidates(items);
 assert.ok(candidates.some(c=>c.merchant==='WIENER LINIEN'&&c.status==='candidate'));
 assert.ok(detectPaymentPatterns(items,today).some(p=>p.name==='WIENER LINIEN'));
});
test('excluded merchant stays excluded from fixed patterns without excluding actual cash expenses',()=>{
 const manual={[merchantKey('WIENER LINIEN')]:'exclude'};
 assert.equal(detectPaymentPatterns(items,today,manual).some(p=>p.name==='WIENER LINIEN'),false);
 const model=cashflowModel({transactions:items,recurringRules:manual,today});
 assert.ok(model.daily.variableCents>=5100);
});
test('internal transfers are not converted into fixed costs based on misleading memo text',()=>{
 const rows=[...items,...Array.from({length:9},(_,i)=>({merchant:'Eigenes Bankkonto',day:`2026-${String(i+1).padStart(2,'0')}-12`,amountCents:-95000,flow:'transfer',category:'Transfer / Eigene Konten',description:'Betriebskosten',linkedTransferId:'self'}))];
 assert.equal(detectPaymentPatterns(rows,today).some(p=>p.name==='Eigenes Bankkonto'),false);
 assert.equal(financeRecurringCandidates(rows).some(p=>p.merchant==='Eigenes Bankkonto'),false);
});
test('confirmed candidate lacking timing evidence is shown as unmodeled, not silently discarded',()=>{
 const manual={[merchantKey('WIENER LINIEN')]:'fixed'};
 const rows=items.filter(t=>!t.id.startsWith('transit-')||t.day<'2026-06-01');
 const m=cashflowModel({transactions:rows,recurringRules:manual,today});
 assert.equal(m.patterns.some(p=>p.name==='WIENER LINIEN'),false);
 assert.ok(m.unmodeledRecurring.some(p=>p.merchant==='WIENER LINIEN'));
 assert.match(cashflowDashboard({financeTransactions:rows,financeRecurringRules:manual},today),/weitere regelmäßige Kandidaten/);
});
