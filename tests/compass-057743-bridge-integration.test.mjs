import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync,readFileSync,unlinkSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {compass743Bridge} from '../client/compass743-bridge.js';
const marker=x=>'${'+x+'}';
const base=`
import {nutritionHistoryView} from './nutrition-history-v577.js';
const COMPASS_CLIENT_VERSION='0.5.77.42';
let state={},authToken='',journalSyncBusy=false,journalSyncInFlight=null;
let journalSyncTimer=null,journalSyncInFlightX=null,journalRevision=0,journalLastConfirmedAt=0;
function journalFingerprint(s){return JSON.stringify([s?.touchJournal||null,s?.strengthJournal||null,s?.miracleMorning||null]);}
function journalSyncPayload(st){return {strengthJournal:st.strengthJournal||{annotations:[]},miracleMorning:ensureMorning(st)};}
function applyJournalPayload(st,payload){st.strengthJournal=m.strengthJournal;st.feelingCheckins=m.feelingCheckins;}
function scheduleJournalSync(){}function toast(){}function render(){}function mutate(){}function putDream(){}
function chrome(content){return \`<div class="utility-right">${marker('shopping741QuickButton()')}${marker('worktimeQuickButton()')}</div>${marker("navItem('activity','Aktivitäten','activity')")}\`;}
function shoppingScreen(){return \`<div class="shopping713-shell"><section class="work-card shopping713-overview"></section></div>\`;}
function insightsScreen(){const tabDef=insightTab==='touch'?{label:'Touch'}:{};const compactInsights=[['balance','Balance Radar']];const content=insightTab==='connections'?null:null;return content;}
function bind() {}
async function runAction(action,id){if(action==='pj92-sync-now'){return;}if(action==='insights-tab'){if(id==='touch'||INSIGHT_TABS.some(t=>t.id===id)){}}if(action==='calm-insight-view'){if(INSIGHT_TABS.some(t=>t.id===id)||id==='touch'){}}}
`;
test('all production bridge anchors transform .42 main exactly once',()=>{
 const plugin=compass743Bridge();
 const source=base.replace('let journalSyncTimer=null,journalSyncInFlightX=null','let journalSyncTimer=null,journalSyncInFlight=null').replace('let state={},authToken=\'\',journalSyncBusy=false,journalSyncInFlight=null;','let state={},authToken=\'\',journalSyncBusy=false;');
 const out=plugin.transform(source,'/user/client/src/main.js').code;
 assert.match(out,/0\.5\.77\.43/);assert.match(out,/dreamJournalView/);
 assert.match(out,/data-action="dream743-open"/);assert.match(out,/receiptInboxView/);
 assert.match(out,/auto.*Journal.*Resume743/i);
 const file='/tmp/compass-057743-transformed-check.mjs';
 writeFileSync(file,out);
 try{execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}finally{unlinkSync(file);}
});
test('main merge adds both journals after strength journal and preserves status',()=>{
 const mock=`import {mergeStrengthJournal} from './strength-device-sync-v57742.js';\nconst out={strengthJournal:mergeStrengthJournal(lc.strengthJournal,rc.strengthJournal),};`;
 const code=compass743Bridge().transform(mock,'/user/client/src/personal-journal-v5692.js').code;
 assert.match(code,/dreamJournal:mergeDreamJournals/);assert.match(code,/receiptJournal:mergeReceiptJournals/);
});
