import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateKrakenSnapshot,mergeKrakenSnapshot,krakenWealthSummary,krakenWealthView,krakenPortfolioView,KRAKEN_FORMAT} from '../client/src/finance-kraken.js';
import {fitdaysSegmentTone,fitdaysFigureReport} from '../client/src/fitdays-figure.js';
import {fatAndLeanStack} from '../client/src/health-rolling.js';
import {healthBodyView} from '../client/src/health-dashboard.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';

const fixture={format:KRAKEN_FORMAT,generatedAt:'2026-10-18T16:00:00Z',pricedAt:'2026-10-18T15:59:00Z',balances:{XXBT:'0.05',ZEUR:'250.00',SOL:'1.1'},quotesEur:{XXBT:'80000.00',ZEUR:'1.00'},ledgers:[],trades:[],partial:false};
test('Kraken visual valuation uses explicit EUR rates and marks missing assets, never sums raw units',()=>{
 const v=validateKrakenSnapshot(fixture),out=krakenWealthSummary(v);
 assert.equal(out.totalEur,4250);assert.equal(out.covered,2);assert.equal(out.total,3);assert.equal(out.complete,false);
 const html=krakenWealthView(v);
 assert.match(html,/Bewerteter Teil/);assert.match(html,/4\.250/);assert.match(html,/SOL/);assert.match(html,/Nicht bewertet/);
 assert.match(html,/Asset Allocation/);assert.match(html,/bewerteten Portfolios/);
 const finance=financeDashboardView({financeTransactions:[],krakenPortfolio:v},'Überblick','all');
 assert.match(finance,/WEALTH \/ KRAKEN SPOT/);assert.match(finance,/bewerteter Teil/i);
});
test('Complete Kraken snapshots create historical points only when full EUR coverage exists',()=>{
 const incomplete=mergeKrakenSnapshot(null,fixture);
 assert.equal(incomplete.valuationHistory.length,0);
 const full={...fixture,quotesEur:{...fixture.quotesEur,SOL:'180.00'}};
 const one=mergeKrakenSnapshot(incomplete,full);
 assert.equal(one.valuationHistory.length,1);
 const replacement=mergeKrakenSnapshot(one,{...full,generatedAt:'2026-10-18T20:00:00Z'});
 assert.equal(replacement.valuationHistory.length,1);
 const two=mergeKrakenSnapshot(replacement,{...full,generatedAt:'2026-10-19T16:00:00Z'});
 assert.equal(two.valuationHistory.length,2);
 assert.match(krakenWealthView(two),/historischer|Entwicklung|Historisch/i);
});
test('Kraken forged quotes rejected; arbitrary market values cannot inject HTML',()=>{
 assert.throws(()=>validateKrakenSnapshot({...fixture,quotesEur:{XXBT:'-20'}}),/Kurs/);
 assert.throws(()=>validateKrakenSnapshot({...fixture,quotesEur:{XXBT:'Infinity'}}),/Kurs/);
 assert.throws(()=>validateKrakenSnapshot({...fixture,quotesEur:{'<script>':'400'}}),/Kurs/);
 assert.throws(()=>validateKrakenSnapshot({...fixture,pricedAt:'bad'}),/Zeitstempel/);
});
test('Fitdays colour classification denotes device-reference deviations; high muscle not equated with excessive fat',()=>{
 assert.equal(fitdaysSegmentTone('fat',193).code,'high');
 assert.equal(fitdaysSegmentTone('fat',100).code,'reference');
 assert.equal(fitdaysSegmentTone('muscle',98).code,'reference');
 assert.equal(fitdaysSegmentTone('muscle',150).code,'above');
 assert.equal(fitdaysSegmentTone('muscle',65).code,'low');
 assert.equal(fitdaysSegmentTone('fat',null).code,'missing');
 const regions=Object.fromEntries(['rightArm','leftArm','trunk','rightLeg','leftLeg'].map(k=>[k,{kg:2,relativePct:150}]));
 const html=fitdaysFigureReport({day:'2026-10-18',at:'2026-10-18T10:00:00Z',segmentFat:regions,segmentMuscle:regions});
 assert.match(html,/clipPath/);assert.match(html,/Deutliche Abweichung/);assert.match(html,/keine medizinische Aussage/);
 assert.match(html,/#C35D54/);assert.match(html,/#719FBE/);
});
test('Fitdays stacking adds ONLY fat and derived fat-free weight; protein has an independent measured label',()=>{
 const rows=[{day:'2026-10-17',at:'2026-10-17T06:00:00Z',weightKg:80,bodyFatPct:20,proteinPct:18,waterPct:55,muscleKg:60,segmentFat:{},segmentMuscle:{}},{day:'2026-10-18',at:'2026-10-18T06:00:00Z',weightKg:82,bodyFatPct:21,proteinPct:18.5,waterPct:56,muscleKg:61,segmentFat:{},segmentMuscle:{}}];
 const html=fatAndLeanStack(rows);
 assert.match(html,/Fettmasse \+ fettfreie Masse/);assert.match(html,/16\.0 kg/);assert.match(html,/64\.0 kg/);
 assert.doesNotMatch(html,/Muskeln \+ Wasser/);
 const body=healthBodyView({fitdays:rows},'all','stacked');
 assert.match(body,/Protein \(BIA\)/);assert.match(body,/Gestapelt: Fett \/ fettfrei/);assert.match(body,/Protein ist ein aus Bioimpedanz/);
});
test('Local Kraken bridge requires explicit session authentication and keeps private API keys off public server',()=>{
 const python=readFileSync(new URL('../tools/kraken/kraken_bridge.py',import.meta.url),'utf8');
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(python,/127\.0\.0\.1/);assert.match(python,/Authorization/);assert.match(python,/Origin/);
 assert.match(python,/token_urlsafe\(32\)/);assert.match(python,/no-store/);
 assert.doesNotMatch(python,/workers\.dev|AddOrder|WithdrawFunds/);
 assert.match(main,/finance-kraken-bridge-sync/);assert.match(main,/krakenAutoSync/);assert.match(main,/12\*3600\*1000/);
 assert.doesNotMatch(main,/krakenBridgeSecret|krakenApiSecret/);
 assert.match(krakenPortfolioView(validateKrakenSnapshot(fixture)),/START_LOCAL_CONNECTOR_WINDOWS\.bat/);
});
