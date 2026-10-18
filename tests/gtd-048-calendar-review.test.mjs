import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEFAULT_CALENDAR_RULES,effectiveCalendarRules,containsTerm,classifyCalendarEvent,visibleCalendarEventsForDay,validCalendarRule,validCalendarOverride} from '../client/src/calendar-rules.js';
import {validLocalTask,parseTags} from '../client/src/tasks.js';
const e=(summary,id='e1',day='2026-10-18')=>({id,summary,status:'confirmed',start:{date:day}});
const look=(title)=>classifyCalendarEvent(e(title));
test('specific calendar events are classified using editable rules with recognizable symbols',()=>{
 for(const [title,symbol,category] of [
  ['Sauna mit Freund', '🧖','Erholung'],['Therme mit Familie','♨️','Erholung'],
  ['Scuba Diving Cairns','🤿','Erholung'],['🚲 Uluru Bike Ride + transfers','🚴','Erholung'],
  ['Zouk Meridian','💃','Erholung'],['Wandern mit Freundin','🥾','Erholung'],
  ['Gym 5 x 5 Training','🏋️','Erholung'],['Skiurlaub','🎿','Erholung'],
  ['Zeitausgleich','🌴','Erholung'],['Geburtstag','🎂','Soziales']]){
   const res=look(title);assert.equal(res.emoji,symbol,title);assert.equal(res.category,category,title);
  }
});
test('classification prevents substrings and warnings being mislabeled as recovery',()=>{
 assert.equal(containsTerm('Beratung zum Stadtrad', 'rad'),false);
 assert.equal(look('⚠️ No flying / high altitude after diving').emoji,'📅');
 assert.equal(look('Besprechung about DIVING').emoji,'🤿');
 assert.equal(look('ZOUK congress').emoji,'💃');
 assert.equal(look('Normaler Termin').category,'Neutral');
});
test('rules can be changed, switched off, reprioritized and protected by validation',()=>{
 const rules=effectiveCalendarRules({});
 assert.notEqual(rules,DEFAULT_CALENDAR_RULES);
 assert.equal(rules[0].id,'birthday');
 const all=rules.map(r=>({...r}));
 all.unshift({id:'custom',label:'Radtour',emoji:'🚲',category:'Freizeit',terms:'bike ride',exclude:'test',enabled:true});
 assert.equal(classifyCalendarEvent(e('Bike Ride Uluru'),all).category,'Freizeit');
 all[0].enabled=false;
 assert.equal(classifyCalendarEvent(e('Bike Ride Uluru'),all).emoji,'🚴');
 assert.equal(validCalendarRule(all[1]),true);
 assert.equal(validCalendarRule({...all[1],category:'invalid'}),false);
 assert.equal(validCalendarOverride({emoji:'🎯',category:'Erholung',title:'Eigene Anzeige',hidden:true}),true);
 assert.equal(validCalendarOverride({emoji:'🎯',category:'invalid',hidden:true}),false);
});
test('event overrides and hiding are local, reversible and do not mutate source events',()=>{
 const original=e('Gym 5 x 5 Training');
 const o={e1:{category:'Arbeit',emoji:'⚙️',title:'Selbst bezeichnet',hidden:true}};
 assert.deepEqual(classifyCalendarEvent(original,DEFAULT_CALENDAR_RULES,o),{category:'Arbeit',emoji:'⚙️',displayTitle:'Selbst bezeichnet',ruleId:'gym',hidden:true});
 assert.equal(visibleCalendarEventsForDay([original],'2026-10-18',DEFAULT_CALENDAR_RULES,o).length,0);
 assert.equal(visibleCalendarEventsForDay([original],'2026-10-18',DEFAULT_CALENDAR_RULES,o,true).length,1);
 assert.equal(original.summary,'Gym 5 x 5 Training');
});
test('weekly review conversion fields can be a valid synchronizable task',()=>{
 const task={id:crypto.randomUUID(),title:'Sportwochenende buchen',note:'',plannedDate:'2026-11-01',dueDate:'2026-12-01',deferUntil:'2026-10-20',estimateMinutes:45,category:'Allgemein',workflow:'next',flagged:false,completed:false,archived:false,projectId:null,parentTaskId:null,sortOrder:0,tags:[],contextTags:parseTags(['energy-low','attention-deep'])};
 assert.equal(validLocalTask(task),true);
 assert.deepEqual(task.contextTags,['energy-low','attention-deep']);
});
test('weekly review has selectable inbox, project and date editor; forecast has rules and overlay',()=>{
 const src=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const pattern of ['review-inbox-item','review-select','review-commit-form','review-project-open','calendar-rule-form','calendar-overlay-form','calendar-toggle-hidden','calendarRulesPanel()','recoveryEvents(day)']) assert.ok(src.includes(pattern),pattern);
 assert.match(src,/const CAL_SCOPE='https:\/\/www.googleapis.com\/auth\/calendar.events.readonly'/);
 assert.ok(!src.includes('/api/calendar/overrides'), 'calendar titles should not be synced to Compass API');
});
