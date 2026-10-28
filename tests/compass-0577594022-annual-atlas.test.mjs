import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {annualDocument,annualPremiumAnatomy,annualFinanceCategories,annualCategoryBars,annualMerchantRanking} from '../client/src/life-annual-v577594019.js';
import {compass594022AnnualPremiumReport} from '../client/compass594022-annual-premium-report.js';
const tx=[
 {id:'a',day:'2026-10-05',amountCents:-10000,category:'Wohnen / Miete',merchant:'Test Rent',flow:'expense',needsReview:false},
 {id:'b',day:'2026-10-06',amountCents:-2000,category:'Lebensmittel / Supermarkt',merchant:'Test Supermarket',flow:'expense',needsReview:false},
 {id:'c',day:'2026-10-06',amountCents:-6000,category:'Transfer / Eigene Konten',merchant:'Transfer Test',flow:'transfer',needsReview:false},
 {id:'d',day:'2026-10-06',amountCents:-3200,category:'Sonstiges / Unbekannt',merchant:'Unclear',flow:'expense',needsReview:true}
];
const state={financeTransactions:tx,healthImports:{},nutritionJournal:{entries:[]},strengthGuidedSessions:[{id:'coach-1',source:'compass-guided-v5920',startedAt:'2026-10-20T10:00:00.000Z',completed:true,exercises:[{exerciseId:'dumbbell-row',confirmedSets:[{confirmed:true,setNumber:1,reps:10,weightKg:12,completedAt:'2026-10-20T10:12:00Z'}]}]}]};
const parts=Array.from({length:80},(_,i)=>({id:i%4?'biceps':'lats',name:`Muskel ${i}`,path:`M${i%30} ${i%70}l1 1z`}));
const opts={period:'month',now:'2026-10-28',finance:true,anatomy:{FRONT_MUSCLES:parts,BACK_MUSCLES:parts}};
test('annual exports professional source anatomy paths, without loading placeholder or cartoon',()=>{
 const result=annualDocument(state,opts);
 assert.match(result,/av22-anatomy-detailed/);
 assert.match(result,/mit 80 anatomischen SVG-Regionen/);
 assert.doesNotMatch(result,/Anatomie wird geladen/);
 const svg=annualPremiumAnatomy({sessions:[]},parts,'front');
 assert.equal((svg.match(/<path /g)||[]).length,80);
});
test('report does not invent professional anatomy if source package unavailable',()=>{
 const result=annualDocument(state,{...opts,anatomy:null});
 assert.doesNotMatch(result,/Anatomie wird geladen/);
 assert.doesNotMatch(result,/class="av22-anatomy-detailed"/);
});
test('category spending is exact and excludes transfers, pending and cash',()=>{
 const data=annualFinanceCategories(tx);
 assert.equal(data.total,12000);
 assert.equal(data.groups.length,2);
 assert.equal(data.groups[0].name,'Wohnen');
 assert.equal(data.groups[0].cents,10000);
 assert.equal(data.groups[1].name,'Lebensmittel');
 assert.match(annualCategoryBars(data),/Klassifizierte Konsumausgaben/);
 const merchants=annualMerchantRanking(tx);
 assert.equal(merchants.reduce((n,m)=>n+m.cents,0),12000);
 assert.ok(merchants.every(x=>!x.name.includes('Transfer')&&!x.name.includes('Unclear')));
});
test('finance report contains the full category atlas, precise subcategory ledger and original visuals',()=>{
 const html=annualDocument(state,opts);
 for(const token of ['Wohin dein Geld tatsächlich floss','Miete','Supermarkt','Der Konsum im Radialdiagramm','Die Ausgaben als Flächen','Die Wege des Geldes','Sunburst','Bei welchen Händlern du Geld ausgegeben hast'])assert.ok(html.includes(token),token);
 assert.match(html,/100 €|100,0 €|100\.00/);
 assert.doesNotMatch(html,/Anatomie wird geladen/);
});
test('40.22 bridge imports anatomy only after opening a popup and keeps source build chain',()=>{
 const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');assert.match(vite,/compass594022AnnualPremiumReport/);
 const old="const COMPASS_CLIENT_VERSION='0.5.77.59.40.21';\nBuild 0.5.77.59.40.21\nwindow.open('','_blank');\n   reportWindow.document.write(annualDocument(state,{...lifeReportSettings,rankedIds:allow?lifeReportSettings.rankedIds:[],now:localDate()}));";
 const result=compass594022AnnualPremiumReport().transform(old,'/project/client/src/main.js');
 assert.ok(result.code.indexOf('window.open(')<result.code.indexOf("await import('body-muscles')"));
 assert.match(result.code,/anatomy:annualAnatomy/);
 assert.match(result.code,/0\.5\.77\.59\.40\.22/);
});
