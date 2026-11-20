import test from 'node:test';
import assert from 'node:assert/strict';
import {
 VAULT_IDLE_DEFAULT_163,VAULT_IDLE_MINUTES_163,readVaultIdleMinutes163,writeVaultIdleMinutes163,vaultIdleElapsed163,VAULT_IDLE_KEY_163
} from '../client/src/vault-idle-v059163.js';
import {
 outlookCalendarDedup61,calendarTitleParts163,sameCrossCalendarEvent163,applyOutlookSnapshot61
} from '../client/src/outlook-calendar-v059161.js';
import {proteinTodayMarkup88} from '../client/src/coach-integration-v0588.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {readFileSync} from 'node:fs';

const start='2026-11-20T09:00:00+01:00',end='2026-11-20T10:00:00+01:00';
const event=(summary,from=start,to=end,id='g')=>({id,summary,start:{dateTime:from},end:{dateTime:to},status:'confirmed'});
const uid=n=>'outlook-local-'+String(n).padStart(64,'0');
const work=(title,idNum=1,from=start,to=end)=>({source_id:uid(idNum),title,start:from,end:to,all_day:false,status:'confirmed',location:'Graz'});
const snap=rows=>({schema_version:'1.0',source:'compass-outlook-bridge',snapshot_type:'complete',timezone:'Europe/Vienna',generated_at:'2026-11-20T17:00:00+01:00',window:{start:'2026-11-01',end:'2027-05-20'},complete:true,events:rows,deleted:[]});

test('idle defaults to one hour and offers 15m through four hours per device',()=>{
 assert.equal(VAULT_IDLE_DEFAULT_163,60);
 assert.deepEqual([...VAULT_IDLE_MINUTES_163],[15,30,60,120,240]);
 assert.equal(readVaultIdleMinutes163({getItem:()=>null}),60);
 const db=new Map();const store={getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,v)};
 assert.equal(writeVaultIdleMinutes163(240,store),true);
 assert.equal(db.get(VAULT_IDLE_KEY_163),'240');
 assert.equal(readVaultIdleMinutes163(store),240);
 assert.equal(readVaultIdleMinutes163({getItem:()=>null}),60,'Second device remains independent');
});
test('invalid value or blocked storage is handled safely',()=>{
 const broken={getItem:()=>{throw Error('Blocked')},setItem:()=>{throw Error('Blocked')}};
 assert.equal(readVaultIdleMinutes163(broken),60);
 assert.equal(writeVaultIdleMinutes163(30,broken),false);
 assert.throws(()=>writeVaultIdleMinutes163(0,broken),/Ungültige/);
 assert.equal(readVaultIdleMinutes163({getItem:()=>'-20'}),60);
});
test('idle threshold respects activity, active exercise and grace window',()=>{
 const props={now:3601000,lastActivity:0,minutes:60};
 assert.equal(vaultIdleElapsed163(props),true);
 assert.equal(vaultIdleElapsed163({...props,minutes:120}),false);
 assert.equal(vaultIdleElapsed163({...props,activeRoutine:true}),false);
 assert.equal(vaultIdleElapsed163({...props,graceUntil:3602000}),false);
 assert.equal(vaultIdleElapsed163({...props,lastActivity:3500000}),false);
});
test('title keys ignore empty parentheses and different case',()=>{
 assert.deepEqual(calendarTitleParts163(' Marketing ( ) '),{base:'marketing',suffix:'',full:'marketing'});
 assert.equal(calendarTitleParts163(' Marketing  (GRO) ').base,'marketing');
 assert.equal(calendarTitleParts163(' Marketing  (GRO) ').suffix,'gro');
});
test('marketing (GRO) and Marketing () at same clock time display once, original stores unchanged',()=>{
 const stored=applyOutlookSnapshot61(null,snap([work('Marketing (GRO)')]));
 const google=event('Marketing ()');
 assert.equal(outlookCalendarDedup61([google],stored).length,1);
 assert.equal(stored.events.length,1,'Outlook archive never mutated');
 assert.equal(google.summary,'Marketing ()','Google record untouched');
});
test('known timezone-offset conversion and a 4-minute clock offset deduplicate',()=>{
 const stored=applyOutlookSnapshot61(null,snap([work('Marketing (GRO)')]));
 const google=event('Marketing','2026-11-20T08:04:00Z','2026-11-20T09:04:00Z');
 assert.equal(outlookCalendarDedup61([google],stored).length,1);
});
test('meaningful different suffix, different times or different duration stay visible',()=>{
 const stored=applyOutlookSnapshot61(null,snap([work('Marketing (GRO)')]));
 assert.equal(outlookCalendarDedup61([event('Marketing (HR)')],stored).length,2);
 assert.equal(outlookCalendarDedup61([event('Marketing ()','2026-11-20T11:00:00+01:00','2026-11-20T12:00:00+01:00')],stored).length,2);
 assert.equal(outlookCalendarDedup61([event('Marketing ()',start,'2026-11-20T11:00:00+01:00')],stored).length,2);
 assert.equal(outlookCalendarDedup61([event('Retrospektive',start,end)],stored).length,2);
});
test('all-day events match only exact date and date-exclusion',()=>{
 const x={summary:'Feiertag',start:{date:'2026-12-08'},end:{date:'2026-12-09'}};
 assert.equal(sameCrossCalendarEvent163(x,{summary:'Feiertag ()',start:{date:'2026-12-08'},end:{date:'2026-12-09'}}),true);
 assert.equal(sameCrossCalendarEvent163(x,{summary:'Feiertag',start:{date:'2026-12-08'},end:{date:'2026-12-10'}}),false);
 assert.equal(sameCrossCalendarEvent163(x,event('Feiertag')),false);
});
test('Daily Dozen peek displays documented progress without new top-level card',()=>{
 const state={nutritionJournal:{entries:[]}};
 const model=dailyDozen5930(state,{day:'2026-11-20'});
 assert.equal(model.goal,24);
 const html=proteinTodayMarkup88(state,'2026-11-20',{compact:true,dailyDozen:model});
 assert.match(html,/Daily Dozen/);
 assert.match(html,/0\/24/);
 assert.match(html,/data-action="ci163-dozen-open"/);
 assert.match(html,/data-action="ci88-food-open"/);
 assert.match(html,/ci90-protein-peek/);
 assert.doesNotMatch(html,/dd930-grid/);
});
test('actual Today navigation opens full Daily Dozen in nutrition rather than adding a duplicate dashboard',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(main,/proteinTodayMarkup88\(state,selectedDay,\{compact:true\}\)/);
 assert.match(main,/action==='ci163-dozen-open'/);
 assert.match(main,/nutritionView712='daily-dozen'/);
 assert.match(main,/vaultIdleMinutes163=value/);
});
