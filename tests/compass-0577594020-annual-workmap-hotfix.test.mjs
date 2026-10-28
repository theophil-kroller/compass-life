import test from 'node:test';
import assert from 'node:assert/strict';
import {annualDocument,annualInventory} from '../client/src/life-annual-v577594019.js';
import {compass594020AnnualWorkmapRelease} from '../client/compass594020-annual-workmap-hotfix.js';
import {readFileSync} from 'node:fs';
const now='2026-10-28',settings={now,period:'year'};
const journals={timeJournal:{entries:[
 {id:'work-a',start:'2026-01-19T09:00:00',end:'2026-01-19T12:30:00',category:'work'},
 {id:'rest-a',start:'2026-01-21T18:00:00',end:'2026-01-21T19:30:00',category:'leisure'},
 {id:'work-b',start:'2026-02-02T10:00:00',end:'2026-02-02T13:00:00',category:'work'},
 {id:'rest-b',start:'2026-02-10T15:00:00',end:'2026-02-10T16:00:00',category:'family'},
 {id:'ignored',start:'2026-02-11T08:00:00',end:'2026-02-11T10:00:00',category:'work',deleted:true},
 {id:'not-ended',start:'2026-02-12T11:00:00',category:'work'}
 ]},quickWorktime:{sessions:[{id:'quick-a',start:'2026-02-20T08:00:00',end:'2026-02-20T09:00:00',category:'work'}]}};
test('regression: work and leisure time journal monthly grouping never raises TypeError work',()=>{
 const doc=annualDocument(journals,settings);
 assert.ok(doc.startsWith('<!doctype html>'));
 assert.ok(doc.includes('Arbeit, Aktivitäten &amp; Erholung'));
 assert.ok(doc.includes('Dokumentierte Arbeitszeit nach Monat'));
 assert.ok(doc.includes('Dokumentierte Freizeit und Erholung nach Monat'));
 assert.ok(doc.includes('7,5 h'), '3.5 + 3 + 1 recorded work hours');
 assert.ok(doc.includes('2,5 h'), '1.5 + 1 recorded leisure hours');
 assert.ok(!doc.includes('NaN'));
 const inv=annualInventory(journals,settings);
 assert.equal(inv.items.find(x=>x.id==='focus')?.count,6);
});
test('no error for single work entry, single rest entry, no journals, and invalid-only sessions',()=>{
 const variants=[{}, {timeJournal:{entries:[journals.timeJournal.entries[0]]}},
 {timeJournal:{entries:[journals.timeJournal.entries[1]]}},
 {quickWorktime:{sessions:[journals.quickWorktime.sessions[0]]}},
 {timeJournal:{entries:[journals.timeJournal.entries[5]]}}];
 for(const data of variants)assert.ok(annualDocument(data,settings).includes('Ars Vivendi'));
});
test('report with real journal and all opt-in chapters is isolated and renders',()=>{
 const state={...journals,healthImports:{garminNights:[{day:'2026-01-19',sleepMinutes:420}],garminHrv:[{day:'2026-01-19',nightAverageMs:55}],fitdays:[]},financeTransactions:[{day:'2026-02-10',id:'t',merchant:'SYNTHETIC STORE',amountCents:-1450,category:'Lebensmittel',flow:'expense',needsReview:false}],placesVisits:[{id:'v',start:'2026-02-10T09:00:00',end:'2026-02-10T11:00:00',lat:47.0,lon:15.0}],people:{p:{id:'p',name:'TEST PERSON'}},feelingCheckins:[{id:'f',at:'2026-02-10T10:00:00',day:'2026-02-10',items:[{id:'joy',intensity:3}]}]};
 const doc=annualDocument(state,{...settings,finance:true,places:true,people:true,feelings:true});
 assert.ok(doc.includes('Arbeit, Aktivitäten &amp; Erholung'));
 assert.ok(doc.includes('Sankey'));
 assert.ok(doc.includes('Worldmap'));
});
test('final version transform preserves the existing annual renderer',()=>{
 const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(config,/compass594020AnnualWorkmapRelease\(\)/);
 const p=compass594020AnnualWorkmapRelease();
 const realistic="const COMPASS_CLIENT_VERSION='0.5.77.59.40.19'; Build 0.5.77.59.40.19 reportWindow.document.write(annualDocument(state,";
 const result=p.transform(realistic,'/opt/app/client/src/main.js');
 assert.match(result.code,/COMPASS_CLIENT_VERSION='0.5.77.59.40.20'/);
 assert.match(result.code,/reportWindow.document.write\(annualDocument\(state,/);
});
