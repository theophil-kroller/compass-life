import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inboxOrdered,inboxMove,inboxNudge} from '../client/src/inbox-order-v34.js';
import {deepSankey,deepSankeyModel} from '../client/src/finance-deep-sankey.js';
import {transferCandidates} from '../client/src/finance-revolut.js';
import {observedCircularEdges,circularWealthFlowView,nodeColor,circularFlowPalette} from '../client/src/finance-circular-flow-v32.js';
import {accountFlowView} from '../client/src/finance-account-flows.js';
const read=f=>readFileSync(new URL('../client/src/'+f,import.meta.url),'utf8');
const row=(id,amountCents,flow,description='',accountId='raiffeisen:current:EUR',extra={})=>({id,amountCents,flow,description,accountId,needsReview:false,day:'2026-10-18',merchant:'Test',category:'Lebensmittel / Supermarkt',...extra});
test('0.5.35 spending Sankey ignores even confirmed inter-account transfers, withdrawals, and unreviewed debits',()=>{
 const rows=[row('food',-2400,'expense','Bakery'),row('transfer',-100000,'transfer','EIGENÜBERTRAG',undefined,{category:'Transfer / Eigene Konten'}),row('cash',-10000,'cash','ATM',undefined,{category:'Bargeld / Abhebung'}),row('open',-23000,'expense','Unknown',undefined,{needsReview:true})];
 const model=deepSankeyModel(rows);assert.equal(model.reduce((s,g)=>s+g.cents,0),2400);
 const html=deepSankey(rows);assert.doesNotMatch(html,/Transfers \/ Investieren|Bargeld · Zweck unbekannt|Noch ungeklärt/);assert.match(html,/1 Transferbuchungen/);
});
test('0.5.35 transfer matching only suggests complementary entries and requires manual confirmation',()=>{
 const rows=[row('debit',-125000,'expense','SEPA ÜBERWEISUNG an eigenes N26 Konto'),row('credit',125000,'income','N26 Incoming','n26:current:EUR',{needsReview:true}),row('purchase',-9200,'expense','VISA shop'),row('merchantrefund',9200,'refund','VISA refund','revolut:current:EUR')];
 const candidates=transferCandidates(rows);assert.ok(candidates.some(p=>p.aId==='credit'&&p.bId==='debit'));assert.ok(!candidates.some(p=>p.aId==='merchantrefund'||p.bId==='merchantrefund'));
 assert.equal(rows[0].flow,'expense');assert.equal(rows[1].flow,'income','suggestions must never mutate transaction identity');
});
test('0.5.35 manual inbox ordering has no side-effects on items or text',()=>{
 const items=[{id:'c',title:'third'},{id:'b',title:'second'},{id:'a',title:'first'}];const saved=['a','b','c'];
 assert.deepEqual(inboxOrdered(items,saved).map(x=>x.id),saved);
 const next=inboxMove(saved,items,'c','a');assert.deepEqual(next,['c','a','b']);
 assert.deepEqual(inboxNudge(next,items,'c',1),['a','c','b']);
 assert.deepEqual(items.map(x=>x.title),['third','second','first']);
 assert.equal(inboxMove(saved,items,'a','a'),null);
 assert.equal(inboxNudge(saved,items,'a',-1),null);
});
test('0.5.35 unsorted new captures stay visible above user-arranged entries',()=>{
 const items=[{id:'new'},{id:'b'},{id:'a'}];assert.deepEqual(inboxOrdered(items,['a','b']).map(x=>x.id),['new','a','b']);
});
test('0.5.35 bright account gradient bands preserve exact observed edges and interactive detail',()=>{
 const rows=[row('a',-15200,'transfer','Übertrag','n26:current:EUR',{linkedTransferId:'b',category:'Transfer / Eigene Konten'}),row('b',15200,'transfer','Übertrag','revolut:current:EUR',{linkedTransferId:'a',category:'Transfer / Eigene Konten'})];
 assert.equal(observedCircularEdges(rows).length,1);assert.equal(observedCircularEdges(rows)[0].cents,15200);
 const circle=circularWealthFlowView({},rows);assert.match(circle,/linearGradient id="fin34-edge-/);assert.match(circle,/data-action="finance-cycle-inspect"/);assert.ok(circularFlowPalette.length>=7);assert.equal(nodeColor('n26'),nodeColor('n26'));
 const sankey=accountFlowView(rows);assert.match(sankey,/linearGradient id="fin34-account-/);assert.match(sankey,/fin-account-ribbon/);
});
test('0.5.35 Inbox includes drag handles and accessible up/down controls; storage is only in UI preferences',()=>{
 const main=read('main.js'),css=read('style.css');assert.match(main,/data-inbox-drag/);assert.match(main,/data-action="inbox-move-up"/);assert.match(main,/data-action="inbox-move-down"/);assert.match(main,/uiPreferences\.inboxManualOrder/);assert.match(css,/inbox-drag-over/);
});
