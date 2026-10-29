import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {annualDocument} from '../client/src/life-annual-v577594019.js';
import {editorialAnnualPages} from '../client/src/annual-editorial-v4025.js';
import {annualFinancePatternPages} from '../client/src/annual-finance-patterns-v40252.js';
import {compass5940254FinancePatternsPrint} from '../client/compass5940254-finance-patterns-print.js';

const tx=[];
for(let i=0;i<13;i++){
 const day=new Date(Date.UTC(2025,9+i,15)).toISOString().slice(0,10);
 for(const [name,cents] of [['Lebensmittel',28500+i*70],['Wohnen',52000],['Gesundheit & Sport',17000+i*90],['Shopping',12000],['Familie',15500],['Mobilität',8200],['Freizeit & Reisen',21000],['Essen & Ausgehen',4000],['Sonstiges',90000]])
  tx.push({day,category:`${name} / Kategorienbeispiel`,amountCents:-cents,flow:'expense',needsReview:false});
 tx.push({day,category:'Transfers / Depot',amountCents:-250000,flow:'transfer',needsReview:false});
}
const date='2026-10-28',state={financeTransactions:tx},settings={now:date,period:'year',finance:true};

test('THE LIVE annualDocument export includes every patterns card, page title and release banner',()=>{
 const html=annualDocument(state,settings);
 assert.equal((html.match(/class="av252-card"/g)||[]).length,9);
 assert.equal((html.match(/class="av19-page av25-editorial av252-page"/g)||[]).length,2);
 assert.match(html,/PRIVATE ANNUAL · 40\.25\.4/);
 assert.match(html,/Finanzmuster: 9 Kategorien \/ 2 Seiten/);
 assert.ok(html.indexOf('Einnahmen und Ausgaben im Vergleich')<html.indexOf('Was ist bei mir üblich?'));
 assert.ok(html.indexOf('Was ist bei mir üblich?')<html.indexOf('Ausgaben im Jahresverlauf'));
});
test('Patterns no longer depend on a specific legacy money-section heading',()=>{
 const pages=['<section class="av19-page"><div class="av19-kicker">VI / CATEGORY OVERVIEW</div><h2>New financial page</h2></section>','<section class="av19-page"><div class="av19-kicker">COLOPHON / PRIVATE EDITION</div></section>'];
 const out=editorialAnnualPages(pages,state,{start:'2025-10-29',end:date,days:365},settings);
 assert.ok(out.some(p=>p.includes('Was ist bei mir üblich?')));
 assert.ok(out.findIndex(p=>p.includes('Was ist bei mir üblich?'))<out.findIndex(p=>p.includes('New financial page')));
});
test('Financial opt-in with zero approved rows reports why patterns cannot be shown, not silent omission',()=>{
 const html=annualDocument({financeTransactions:[{day:'2026-10-01',flow:'transfer',category:'Transfers / intern',amountCents:-25000,needsReview:false}]},settings);
 assert.match(html,/Was ist bei mir üblich\?/);
 assert.match(html,/Noch kein persönlicher Ausgabenkorridor/);
 assert.match(html,/Finanzmuster: Keine bestätigten Ausgaben/);
 assert.doesNotMatch(html,/class="av252-card"/);
});
test('Without finance consent, no private category chart or empty-data teaser is exposed',()=>{
 const html=annualDocument(state,{now:date,period:'year',finance:false});
 assert.doesNotMatch(html,/Was ist bei mir üblich\?/);
 assert.doesNotMatch(html,/Finanzmuster: 9 Kategorien/);
});
test('current .40.25.4 deployment plugin remains in registered release chain in real Vite config and validates print entrypoint',()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compass5940253PwaDeployFix\(\),compass5940254FinancePatternsPrint\(\),compass5940255BirthdaysSpeed\(\),compass5940256FastGtdActions\(\),compass5940257CoreFirst\(\),compass5940258CorePerformance\(\)\);/);
 const plugin=compass5940254FinancePatternsPrint();
 const src="const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.3';\nBuild 0.5.77.59.40.25.3\nreportWindow.document.write(annualDocument(state,settings));";
 const result=plugin.transform(src,'/repo/client/src/main.js');
 assert.match(result.code,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.25\.4'/);
 const lock=plugin.transform('Build 0.5.77.59.40.25.3','/repo/client/src/ars-vivendi-lock-v5775922.js');
 assert.equal(lock.code,'Build 0.5.77.59.40.25.4');
 assert.throws(()=>plugin.transform(src.replace('annualDocument','reportDocument'),'/repo/client/src/main.js'),/Entrypoint/);
});
