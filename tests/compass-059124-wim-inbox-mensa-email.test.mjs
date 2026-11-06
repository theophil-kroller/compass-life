import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseMensaEmail,mensaEmailToPrompt,parseMensaJSON,importMensaOffers} from '../client/src/mensa-catalog-v57759402512.js';
import {gtdCheckpoint} from '../client/src/fast-gtd-actions-v5775940256.js';
import {gtdDelta,applyGtdDelta} from '../client/src/core-first-v5775940257.js';
import {restorePlanningCheckpoint} from '../client/src/fast-planning-v57721.js';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const email=`Speiseplan KW46\nMensa TU Graz Stremayrgasse\nStremayrgasse 16, 8010 Graz\nMontag, 09.11.\nBirnen-Joghurtcreme (F) € 2.80\nKlare Gemüsesuppe (A,C,L) € 2.40\nKürbiscremesuppe (F,L,O) € 2.40\nKürbis Gnocchi\nmit Kürbis Rahmgemüse\n(A, F, G, O) € 6.70\nGebackenes Schweinsschnitzel (A) € 9.70\nDienstag, 10.11.\nGlühwein Tiramisu € 2.80\nKlare Gemüsesuppe € 2.40\nDinkelsuppe € 2.40\nBrainfood Kartoffelauflauf mit Gemüse, Feta und Nüssen\ndazu Kresse-Sauerrahm Dip\nKartoffeln, buntes Gemüse, würziger Feta und Nüsse verbinden sich\n(C, G, H, O) € 6.70\nGebratenes Karreesteak € 7.70\nMittwoch, 11.11.\nWaldbeer-Joghurtcreme € 2.80\nKlare Gemüsesuppe € 2.40\nOrientalische Linsensuppe € 2.40\nLongevity-Powerfood Gemüse Reispfanne mit Curry\ndazu Chinakohlsalat\n(F, L, O) € 6.70\nFleischbällchen € 7.70\nDonnerstag, 12.11.\nSchokomousse € 2.80\nGemüsesuppe € 2.40\nMais-Kokoscremesuppe € 2.40\nBrainfood Aloo Masala Südindisches Kartoffelcurry mit Cous Cous\nKartoffeln, orientalische Gewürze und Cashewkerne prägen dieses Gericht.\n(A, H, L, O) € 6.70\nChili Chicken € 7.70\nFreitag, 13.11.\nChia Fruchtmus Vegan € 2.80\nKlare Gemüsesuppe € 2.40\nKnoblauchcremesuppe € 2.40\nCamembert gebacken\nmit Tomaten-Dip & Salatbouquet\n(A, C, F, G, M, O) € 6.70\nSeelachsfilet € 7.70`;
test('E-Mail KW46 erkennt 5 vegetarische Tagesmenüs mit lokalem Datum',()=>{
 const menus=parseMensaEmail(email);
 assert.equal(menus.length,5);
 assert.deepEqual(menus.map(x=>x.menuDate),['2026-11-09','2026-11-10','2026-11-11','2026-11-12','2026-11-13']);
 assert.match(menus[0].title,/Kürbis Gnocchi/);
 assert.match(menus[1].title,/Brainfood Kartoffelauflauf/);
 assert.match(menus[2].title,/Longevity-Powerfood/);
 assert.match(menus[3].title,/Aloo Masala/);
 assert.match(menus[4].title,/Camembert/);
 for(const x of menus){assert.equal(x.priceMenuListedEuro,6.7);assert.equal(x.priceActualStudyEuro,null);assert.equal(x.menuStatus,'estimated_from_source');assert.equal(x.evidence.sourceType,'email_subscription');assert.equal(x.evidence.sourceUrl,'');assert.equal(x.nutrientEstimates.energyKcal,null);}
 assert.deepEqual(menus[4].allergens,['A','C','F','G','M','O']);
});
test('E-Mail ohne verlässliche Datengrundlage wird nicht erraten',()=>{
 assert.throws(()=>parseMensaEmail('Mensa Stremayrgasse\nMontag, 09.11.\nHeute leider keine Angaben zum Menü'),/E-Mailtext|Keine eindeutig/);
});
test('E-Mail-Prompt fordert Daten- und Preisquellentrennung und enthält Text',()=>{
 const prompt=mensaEmailToPrompt(email);
 assert.match(prompt,/priceMenuListedEuro/);assert.match(prompt,/email_subscription/);assert.match(prompt,/Originalrezeptur/);
 assert.ok(prompt.includes(email));
});
test('E-Mail Importvorschau wird idempotent in Katalog übernommen',()=>{
 const st={};const preview=parseMensaEmail(email);const first=importMensaOffers(st,preview,'2026-11-06T12:00:00Z');assert.equal(first.added,5);
 const second=importMensaOffers(st,preview,'2026-11-06T12:00:00Z');assert.equal(second.unchanged,5);
});
test('GTD Inbox-Übernahme wird als verschlüsselter schmaler Delta wiederhergestellt',()=>{
 const original={tasks:{},projects:{},taskPending:{},projectPending:{},records:{a:{id:'a',title:'Besprechung',deleted:false,updatedAt:'old'}},pending:[],recentTags:[]};
 const state=structuredClone(original),before=gtdCheckpoint(state,{singleRecordId:'a'});
 state.records.a.deleted=true;state.records.a.updatedAt='now';state.pending.push({id:'a',deleted:true});
 state.tasks.x={id:'x',title:'Besprechung',workflow:'next'};state.taskPending.x=true;
 const delta=gtdDelta(before,state);assert.equal(delta.records.a.deleted,true);assert.equal(delta.tasks.x.workflow,'next');assert.equal(delta.pending.length,1);
 const recovered=applyGtdDelta(structuredClone(original),delta);assert.deepEqual(recovered.records,state.records);assert.deepEqual(recovered.tasks,state.tasks);assert.deepEqual(recovered.pending,state.pending);
 restorePlanningCheckpoint(state,before);assert.deepEqual(state.records,original.records);assert.deepEqual(state.pending,original.pending);
});
test('Wim Hof Player schützt laufende Wiedergabe und speichert Checkpoints',()=>{
 const player=read('../client/src/wim-hof-player-v5775921.js');const app=read('../client/src/main-full-v57759402510.js');
 assert.match(player,/routineActive5928\(\)/);assert.match(player,/routineEnded5928\(\)/);assert.match(player,/saveWimCheckpoint5928/);assert.match(player,/audio\.currentTime-playStartedPosition/);
 assert.match(app,/compassRoutineActive/);assert.match(app,/next-load-more/);
});
