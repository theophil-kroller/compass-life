import test from 'node:test';
import assert from 'node:assert/strict';
import {compass5910StrengthHabitsBridge} from '../client/compass5910-strength-habits-bridge.js';
const nav=(id,label,icon)=>` \${navItem('${id}','${label}','${icon}')}`;
const ids=[['overview','Übersicht','layers'],['next','Next Actions','target'],['projects','Projekte','folder'],['templates','Vorlagen','bookmark'],['shopping','Einkaufslisten','list'],['forecast','Kalender & Forecast','calendar'],['radar','Konferenzen','book'],['flagged','Flagged','flag'],['hold','On Hold','pause'],['someday','Dreams · Someday','spark']];
const plan=ids.map(x=>nav(...x)).join('\n');
const mockMain=[plan,
 `return '<button type="button" class="habit569-item '+(done?'is-done':'')+'" data-action="habit-toggle" data-id="'+h(item.id)+'" '+(lockedDone?'disabled':'')+'><span></span></button>';`,
 `'<article class="habit569-card"><div class="habit569-card-head"><div><strong>'+h(item.title)+'`,
 `data-action="habit-toggle" data-id="'+h(item.id)+'">'+(doneToday?'Heute erledigt ✓':'Heute abhaken')+'</button>`,
 `if(action==='habit-toggle'){`,
 `function habitInsightsView(){ return \`<div>\${journalSyncPanel()}<section class="work-card"><div class="work-heading"><span>\${ico('checkSquare',18)} Habit Tracker</span></div></section></div>\`; }`
].join('\n');
test('Strength bridge integrates data persistence and statistics exactly once into real main anchors',()=>{
 const transformed=compass5910StrengthHabitsBridge().transform(mockMain,'/repo/client/src/main.js');
 assert.ok(transformed?.code);
 assert.match(transformed.code,/onSession:async session=>/);
 assert.match(transformed.code,/await mutate\(st=>\{/);
 assert.match(transformed.code,/makkoHoSessions/);
 assert.match(transformed.code,/function makkoTimeInsights\(st\)/);
 assert.match(transformed.code,/\$\{journalSyncPanel\(\)\}\$\{makkoTimeInsights\(state\)\}/);
 assert.equal(transformed.code.match(/function makkoTimeInsights\(st\)/g).length,1);
});
