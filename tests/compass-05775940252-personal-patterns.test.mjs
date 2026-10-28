import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {annualFinancePatternPages,annualPersonalPatternModel} from '../client/src/annual-finance-patterns-v40252.js';
import {annualDocument} from '../client/src/life-annual-v577594019.js';
import {compass5940252PersonalPatterns} from '../client/compass5940252-personal-patterns.js';
const end='2026-10-28';
const start='2025-10-01';
const tx=[];
// Twelve historical reference months, one current (partial) month.
for(let i=-1;i<13;i++){
 const d=new Date(Date.UTC(2025,9+i,15)).toISOString().slice(0,10);
 for(const [name,amount] of [['Lebensmittel',31000+i*50],['Wohnen',53000],['Gesundheit & Sport',18000+i*70],['Shopping',17000],['Familie',15000],['Mobilität',9000],['Freizeit & Reisen',16000],['Essen & Ausgehen',2400],['Sonstiges',163000]]){
 tx.push({day:d,flow:'expense',amountCents:-amount,category:`${name} / Test`,needsReview:false});
 }
 tx.push({day:d,flow:'transfer',amountCents:-180000,category:'Transfer / Depot',needsReview:false});
 tx.push({day:d,flow:'expense',amountCents:-90000,category:'Geheim / Nicht prüfen',needsReview:true});
}
test('.40.25.2 finance print uses the Compass personal patterns computation for 9 categories',()=>{
 const m=annualPersonalPatternModel(tx,end);assert.equal(m.length,9);
 for(const k of ['Lebensmittel','Wohnen','Sonstiges','Familie','Mobilität'])assert.ok(m.some(x=>x.category===k));
 const food=m.find(x=>x.category==='Lebensmittel');assert.equal(food.n,12);
 assert.ok(food.mean>31000 && food.mean<32000);
 assert.ok(food.p20!==null && food.p80!==null);
 assert.equal(food.history.length,12);
 assert.equal(food.thisMonth,'2026-10');
});
test('.40.25.2 printable sheets have actual labeled rails and legend',()=>{
 const pages=annualFinancePatternPages({financeTransactions:tx},{end}, {finance:true});assert.equal(pages.length,2);
 const html=pages.join('');for(const s of ['Was ist bei mir üblich?','Lebensmittel','Wohnen','Gesundheit &amp; Sport','20.–80. Perzentil','Ø pro Referenzmonat','Monatsmittel','Prognose Monatsende','Ausgabenkorridor'])assert.ok(html.includes(s),s);
 assert.equal((html.match(/class="av252-card"/g)||[]).length,9);
 assert.equal((html.match(/class="av19-page /g)||[]).length,2);
 assert.doesNotMatch(html,/NaN|undefined|Geheim|Transfer \/ Depot/);
});
test('.40.25.2 report respects explicit finance opt-in and category inputs',()=>{
 assert.deepEqual(annualFinancePatternPages({financeTransactions:tx},{end},{}),[]);
 assert.deepEqual(annualFinancePatternPages({financeTransactions:tx},{end},{finance:false}),[]);
 const hidden=annualDocument({financeTransactions:tx},{now:end,period:'year'});
 assert.doesNotMatch(hidden,/Was ist bei mir üblich\?/);
 const shown=annualDocument({financeTransactions:tx},{now:end,period:'year',finance:true});
 assert.match(shown,/Was ist bei mir üblich\?/);
 assert.ok(shown.indexOf('Einnahmen und Ausgaben im Vergleich') < shown.indexOf('Was ist bei mir üblich?'));
 assert.ok(shown.indexOf('Was ist bei mir üblich?') < shown.indexOf('Ausgaben im Jahresverlauf'));
});
test('.40.25.2 anchor uses report-end history, not browser wall clock or historical future spend',()=>{
 const prior=annualPersonalPatternModel(tx,'2026-04-28');
 assert.equal(prior[0].thisMonth,'2026-04');
 const future={day:'2026-11-03',flow:'expense',amountCents:-7500000,category:'Future / Bad',needsReview:false};
 assert.deepEqual(annualPersonalPatternModel([...tx,future],end),annualPersonalPatternModel(tx,end));
});
test('.40.25.2 release transform and registration',()=>{
 const plug=compass5940252PersonalPatterns();const r=plug.transform("const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.1';\nBuild 0.5.77.59.40.25.1",'/site/client/src/main.js');
 assert.match(r.code,/40\.25\.2/);
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');assert.match(cfg,/compass5940251SolarCoverHotfix\(\),compass5940252PersonalPatterns\(\)/);
});
