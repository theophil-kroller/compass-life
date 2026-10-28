import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {adiposeLayersSvg,bodyCompositionSvg,incomeExpenseSvg,portfolioTreemapSvg,wealthEditorial,editorialAnnualPages} from '../client/src/annual-editorial-v4025.js';
import {micronutrientAnnualPages} from '../client/src/annual-micronutrient-v4025.js';
import {annualDocument} from '../client/src/life-annual-v577594019.js';
import {compass594025EditorialAnnual} from '../client/compass594025-editorial-annual.js';
const w={start:'2025-10-29',end:'2026-10-28',days:365};
const tx=[{day:'2026-09-10',flow:'income',amountCents:300000,needsReview:false,category:'Einnahmen / Gehalt'},{day:'2026-09-11',flow:'expense',amountCents:-60000,needsReview:false,category:'Wohnen / Miete'},{day:'2026-09-12',flow:'transfer',amountCents:-70000,needsReview:false,category:'Transfers / Flatex'}];
const wealthState={financeTransactions:tx,financeFlatexSnapshots:[{day:'2026-10-27',positions:[{day:'2026-10-27',isin:'IE00B4L5Y983',name:'Global ETF',kind:'ETF',quantity:15,unitPrice:1000,marketCents:1500000,costCents:1100000},{day:'2026-10-27',isin:'IE00B5BMR087',name:'Second ETF',kind:'ETF',quantity:10,unitPrice:500,marketCents:500000,costCents:420000}]}],krakenPortfolio:{generatedAt:'2026-10-27T06:00:00Z',pricedAt:'2026-10-27T06:00:00Z',balances:{BTC:'0.12',ETH:'1'},quotesEur:{BTC:'75000',ETH:'2500'}}};
test('.40.25 illustrations distinguish visceral and subcutaneous fat',()=>{
 const s=adiposeLayersSvg();for(const t of ['Subkutanes Fett','Viszerales Fett','Schematischer anatomischer Querschnitt'])assert.ok(s.includes(t),t);
 assert.match(s,/viewBox="0 0 980 370"/);assert.doesNotMatch(s,/<script|https?:\/\//);
});
test('.40.25 body composition only derives evidence from measured BIA',()=>{
 const v=bodyCompositionSvg(80,20,60);assert.match(v,/Fettmasse 16 kg/);assert.match(v,/Fettfreie Masse 64 kg/);assert.match(v,/60 kg/);
 const missing=bodyCompositionSvg(undefined,undefined,undefined);assert.match(missing,/nicht bestimmt/);assert.doesNotMatch(missing,/NaN|undefined/);
});
test('.40.25 portfolio treemap has proportional areas, EUR weights and readable label key',()=>{
 const s=portfolioTreemapSvg([{label:'Global ETF',value:6000},{label:'BTC',value:4000},{label:'unpriced',value:null}]);assert.match(s,/Global ETF/);assert.match(s,/BTC/);assert.match(s,/60 %/);assert.match(s,/40 %/);assert.doesNotMatch(s,/unpriced|NaN|undefined/);
 assert.equal(portfolioTreemapSvg([{label:'unknown',value:null}]),'');
});
test('.40.25 monthly cashflow compares actual incomes and spending, not transfers',()=>{
 const s=incomeExpenseSvg([{month:'2026-10',income:3000,expense:1600}]);assert.match(s,/Einnahmen/);assert.match(s,/Konsum/);assert.match(s,/26-10/);assert.doesNotMatch(s,/NaN|undefined/);
});
test('.40.25 wealth pages require explicit finance consent and include Flatex/Kraken',()=>{
 assert.deepEqual(wealthEditorial(wealthState,w,{}),[]);
 const pages=wealthEditorial(wealthState,w,{finance:true}).join('');for(const label of ['Mein Flatex-Depot','Mein Kryptoportfolio','Global ETF','Positionen nach Marktwert','Krypto-Allokation'])assert.ok(pages.includes(label),label);
 assert.doesNotMatch(pages,/NaN|undefined/);
});
test('.40.25 editorial has scientific references, emotional narratives and complete micronutrients',()=>{
 const minimal={healthImports:{garminNights:[{day:'2026-10-25',sleepMinutes:360}],fitdays:[{day:'2026-10-25',weightKg:81,bodyFatPct:23,muscleKg:61}]},nutritionJournal:{entries:[]},financeTransactions:tx,feelingCheckins:[{id:'a',day:'2026-10-20',at:'2026-10-20T12:00:00',items:[{id:'joy',intensity:3}]}]};
 const r=annualDocument(minimal,{period:'year',now:'2026-10-28',finance:false});
 for(const label of ['PRIVATE ARCHIVE','PERSONAL CHRONICLE','Subkutanes Fett','Viszerales Fett'])assert.ok(r.includes(label),label);
 const editorial=readFileSync(new URL('../client/src/annual-editorial-v4025.js',import.meta.url),'utf8');const micro=readFileSync(new URL('../client/src/annual-micronutrient-v4025.js',import.meta.url),'utf8');for(const label of ['Karla McLaren','NutritionFacts.org','Der Rhythmus deiner Ernährung'])assert.ok(editorial.includes(label),label);assert.match(micro,/Vitaminatlas/);
 assert.doesNotMatch(r,/A Life Examined\. A Life Beautifully Lived/);assert.doesNotMatch(r,/Redaktioneller Grundsatz/);
 assert.doesNotMatch(r,/Mein Flatex-Depot|Mein Kryptoportfolio/);
});
test('.40.25 the knowledge story precedes its personal chart in finished report',()=>{
 const s={healthImports:{garminNights:[{day:'2026-10-25',sleepMinutes:370}],fitdays:[{day:'2026-10-25',weightKg:81,bodyFatPct:23}]},nutritionJournal:{entries:[]},financeTransactions:tx};
 const html=annualDocument(s,{now:'2026-10-28',period:'year',finance:true});
 const a=html.indexOf('Die Architektur erholsamer Nächte'),b=html.indexOf('Dein Schlaf im Jahresverlauf');assert.ok(a>0&&b>a);
 const c=html.indexOf('Vom Einkommen zum Vermögensaufbau'),d=html.indexOf('Einnahmen und Ausgaben im Vergleich');assert.ok(c>0&&d>c);
});
test('.40.25 micronutrient atlas lists physiological functions for vitamins and supplements',()=>{
 const pages=micronutrientAnnualPages({nutritionJournal:{entries:[{id:'sup',at:'2026-10-25T12:00:00',foodId:'supplement-bluebonnet-one-men',amount:'1 Kapsel'}]}},w).join('');
 assert.match(pages,/Vitamin C/);assert.match(pages,/Kollagen|Immunsystem/);assert.match(pages,/Vitamin B12/);assert.match(pages,/Nerven|Blutbildung/);assert.match(pages,/Magnesium/);
});
test('.40.25 radar inspector respects private finance and relationship opt-in',()=>{
 const state={...wealthState,people:{p:{id:'p',name:'Sensitive Contact',closeness:95}},healthImports:{garminNights:[{day:'2026-10-25',sleepMinutes:480}]}};
 const hidden=annualDocument(state,{now:'2026-10-28',period:'year'});
 assert.match(hidden,/Die acht Lebensbereiche verstehen/);
 assert.doesNotMatch(hidden,/Finanzen · 100\/100/);
 assert.doesNotMatch(hidden,/Sensitive Contact/);
 const shown=annualDocument(state,{now:'2026-10-28',period:'year',finance:true});assert.match(shown,/Mein Flatex-Depot/);
});
test('.40.25 version bump is installed after prior release plugin',()=>{
 const plug=compass594025EditorialAnnual();const src="const COMPASS_CLIENT_VERSION='0.5.77.59.40.24';\nBuild 0.5.77.59.40.24";
 const r=plug.transform(src,'/site/client/src/main.js');assert.match(r.code,/40\.25/);assert.equal(plug.transform(src,'/site/client/src/unrelated.js'),null);
 const conf=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');assert.match(conf,/compass594024AnnualKnowledge\(\),compass594025EditorialAnnual\(\)/);
});
