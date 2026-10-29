import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MENSA_SEED} from '../client/src/mensa-seed-v57759402511.js';
import {installMensaSeed,mensaOffer,mergeMensaCatalog,logMensaMeal,parseMensaJSON,importMensaOffers,mensaConsumed,mensaResearchReminder,mensaTodayButton} from '../client/src/mensa-catalog-v57759402512.js';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
const copy=x=>structuredClone(x);
const start=()=>({nutritionJournal:{entries:[],customFoods:[]}});
test('seed imports four real dated references without inventing meals',()=>{
 const st=start();assert.equal(installMensaSeed(st),true);assert.equal(installMensaSeed(st),false);
 assert.equal(st.mensaCatalog.entries.length,4);
 assert.deepEqual(st.mensaCatalog.entries.map(x=>x.menuDate),['2026-10-27','2026-10-28','2026-10-29','2026-10-30']);
 assert.equal(st.nutritionJournal.entries.length,0);
 assert.equal(mensaOffer(st,'2026-11-02'),null);
});
test('explicit click logs precisely one Study-Teller and preserves immutable dated nutrition snapshot',()=>{
 const st=start();installMensaSeed(st);const original=copy(mensaOffer(st,'2026-10-29'));
 assert.equal(logMensaMeal(st,'2026-10-29','2026-10-29T11:15:00Z').added,true);
 assert.equal(logMensaMeal(st,'2026-10-29','2026-10-29T11:15:05Z').added,false);
 assert.equal(st.nutritionJournal.entries.length,1);
 assert.equal(st.nutritionJournal.entries[0].menuSnapshot.title,original.title);
 assert.equal(st.nutritionJournal.entries[0].menuSnapshot.nutrientEstimates.energyKcal.min,original.nutrientEstimates.energyKcal.min);
 assert.equal(mensaConsumed(st,'2026-10-29'),true);
 const newOne={...original,title:'Neue Rezeptur'};importMensaOffers(st,[newOne]);
 assert.equal(st.nutritionJournal.entries[0].menuSnapshot.title,original.title);
 assert.equal(st.nutritionJournal.customFoods.length,1);
});
test('parse GPT JSON batch requires exact venue, correct day and sensible ranges',()=>{
 const offer=copy(MENSA_SEED.entries[0]);const pack={format:'compass-mensa-catalog-v1',entries:[offer]};
 assert.equal(parseMensaJSON(JSON.stringify(pack)).length,1);
 assert.throws(()=>parseMensaJSON(JSON.stringify({entries:[{...offer,venueId:'mensa-inffeldgasse'}]})),/Falscher Mensa/);
 assert.throws(()=>parseMensaJSON(JSON.stringify({entries:[{...offer,menuDate:'2026-02-31'}]})),/gültiges lokales Datum/);
 assert.throws(()=>parseMensaJSON(JSON.stringify({entries:[{...offer,nutrientEstimates:{energyKcal:{min:700,max:300}}}]})),/Bandbreite/);
 assert.throws(()=>parseMensaJSON(JSON.stringify({entries:[offer,offer]})),/Duplikate/);
});
test('idempotent reimport revises same date rather than duplicate',()=>{
 const st=start();installMensaSeed(st);const first=copy(MENSA_SEED.entries[0]);
 const r=importMensaOffers(st,[first]);assert.deepEqual(r,{added:0,updated:0,unchanged:1});
 assert.equal(st.mensaCatalog.entries.length,4);assert.equal(mensaOffer(st,'2026-10-27').catalogVersion,1);
 const changed={...first,title:'Geändertes Menü'};const update=importMensaOffers(st,[changed]);
 assert.deepEqual(update,{added:0,updated:1,unchanged:0});
 assert.equal(mensaOffer(st,'2026-10-27').catalogVersion,2);
});
test('two devices merge safely without erasing original menu and receipts',()=>{
 const local=start();installMensaSeed(local);local.receiptJournal={entries:[{id:'r',schema:'compass_receipt_v1',date:'2026-10-29',merchant:'Hofer',items:[]}]};
 const remote={mensaCatalog:{entries:[]}};
 const merged=mergeJournalData(local,remote);
 assert.equal(merged.mensaCatalog.entries.length,4);
 assert.equal(merged.receiptJournal.entries.length,1);
 assert.deepEqual(mergeMensaCatalog(merged.mensaCatalog,{}),merged.mensaCatalog);
});
test('Today 11–14 only and reminder if menu missing; no response after consumed',()=>{
 const st=start();installMensaSeed(st);
 const midday=new Date('2026-10-29T11:00:00Z'); // Vienna 12:00
 assert.match(mensaTodayButton(st,midday),/Study-Teller gegessen/);
 const morning=new Date('2026-10-29T08:00:00Z'); // Vienna 09:00
 assert.doesNotMatch(mensaTodayButton(st,morning),/Study-Teller gegessen/);
 logMensaMeal(st,'2026-10-29',midday.toISOString());
 assert.doesNotMatch(mensaTodayButton(st,midday),/Study-Teller gegessen/);
 assert.ok(mensaResearchReminder(st,'2026-10-30').needsResearch);
});
test('compiled app only lazy loads menu catalog in Nutrition, not on quick-tap',()=>{
 const app=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(app,/function ensureMensaForNutrition\(\)/);
 assert.match(app,/if\(insightTab==='nutrition'\)queueMicrotask\(ensureMensaForNutrition\)/);
 assert.match(app,/mensa-eat-today/);
 assert.doesNotMatch(app,/const mod=mensaApi\|\|await import\('.\/mensa-catalog/);
 assert.match(app,/mensa-copy-prompt/);
 assert.match(app,/mensa-confirm-import/);
 assert.match(app,/mensaCatalog:st\.mensaCatalog/);
 const nut=readFileSync(new URL('../client/src/nutrition-focus-v577594017.js',import.meta.url),'utf8');
 assert.match(nut,/\['mensa','Mensa'\]/);
});
