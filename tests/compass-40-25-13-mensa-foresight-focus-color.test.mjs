import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MENSA_SEED} from '../client/src/mensa-seed-v57759402511.js';
import {mensaUpcomingWeeks,MENSA_GPT_PROMPT,installMensaSeed,importMensaOffers} from '../client/src/mensa-catalog-v57759402512.js';
const root=new URL('../client/src/',import.meta.url);
const state=()=>({nutritionJournal:{entries:[],customFoods:[]}});
test('published future week persists and renders in grouped preview without phantom meals',()=>{
 const s=state();installMensaSeed(s);
 const weeks=mensaUpcomingWeeks(s,'2026-10-29');
 assert.equal(weeks[0].label,'Diese Woche');assert.equal(weeks[1].label,'Nächste Woche');
 assert.ok(weeks[0].offers.length>=1);assert.equal(weeks[1].offers.length,0);
 const future={...structuredClone(MENSA_SEED.entries[0]),menuDate:'2026-11-03',title:'Nachweislich publiziertes Menü'};
 assert.deepEqual(importMensaOffers(s,[future], '2026-10-29T20:00:00Z'),{added:1,updated:0,unchanged:0});
 assert.equal(mensaUpcomingWeeks(s,'2026-10-29')[1].offers[0].title, future.title);
 assert.equal(s.nutritionJournal.entries.length,0);
});
test('GPT research prompt covers multiple future weeks but forbids invented menus',()=>{
 assert.match(MENSA_GPT_PROMPT,/nächsten vier Kalenderwochen/);
 assert.match(MENSA_GPT_PROMPT,/Vorschau für NÄCHSTE WOCHE/);
 assert.match(MENSA_GPT_PROMPT,/KEINEN Menüeintrag/);
});
test('mode indicator is always green focus, bright orange extended, in both desktop and mobile',()=>{
 const css=readFileSync(new URL('gtd-workspace-v57756.css',root),'utf8');
 const js=readFileSync(new URL('main-full-v57759402510.js',root),'utf8');
 assert.match(css,/compass55-extended \.compass56-mode-switch \.compass56-mode-button/);
 assert.match(css,/#d35400/);
 assert.match(css,/\.compass56-mode-button\.is-active\{color:#16735b/);
 assert.match(js,/compass55-\$\{compass55Mode\}/);
 assert.match(js,/compass57-mobile-mode/);assert.match(js,/compass57-desktop-mode/);
});
