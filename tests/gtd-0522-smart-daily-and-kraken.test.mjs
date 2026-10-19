import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateLifeGoal,lifeGoals,goalsForProject,lifeGoalProgress,smartDailyChoices} from '../client/src/life-intelligence-v22.js';
import {publicEurSymbols,parsePublicTicker,fetchPublicEurQuotes} from '../client/src/kraken-public-market-v22.js';
import {updateKrakenQuotes,krakenWealthSummary,KRAKEN_FORMAT} from '../client/src/finance-kraken.js';
const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const finance=readFileSync(new URL('../client/src/finance-kraken.js',import.meta.url),'utf8');
const today='2026-10-19';
const pid='00000000-0000-4000-8000-000000000123';
const gid='00000000-0000-4000-8000-000000000124';
const make=(id,title,extras={})=>({id:`00000000-0000-4000-8000-${String(id).padStart(12,'0')}`,title,category:'Allgemein',workflow:'next',completed:false,archived:false,plannedDate:null,dueDate:null,deferUntil:null,contextTags:[],tags:[],...extras});
const goal={id:gid,title:'Dissertation abschließen',outcome:'Eingereichte Dissertation',area:'Forschung',status:'active',projectIds:[pid],targetDate:null};

test('0.5.22 local life goals validate, link existing projects, and report only observed tasks',()=>{
 assert.equal(validateLifeGoal(goal),true);
 assert.equal(validateLifeGoal({...goal,projectIds:[pid,pid]}),false);
 assert.equal(validateLifeGoal({...goal,title:' '.repeat(4)}),false);
 const s={lifeGoals:[goal],projects:{[pid]:{id:pid,status:'active'}},tasks:{t:make(1,'Analyse', {projectId:pid}),other:make(2,'Review',{projectId:pid,completed:true})}};
 assert.equal(lifeGoals(s).length,1);assert.equal(goalsForProject(s,pid)[0].id,gid);
 assert.deepEqual(lifeGoalProgress(s,goal),{projects:1,taskCount:2,completed:1,missingProjects:0});
});

test('0.5.22 daily recommendations respect next action availability, defer, time/context filters and real due dates',()=>{
 const s={tasks:{},projects:{[pid]:{id:pid,status:'active',kind:'project'}},lifeGoals:[goal]};
 for(const t of [make(1,'Zielprojekt', {projectId:pid,estimateMinutes:20}),make(2,'Richtig dringend',{dueDate:today,estimateMinutes:15}),make(3,'Später',{deferUntil:'2026-10-22',estimateMinutes:10}),make(4,'Zu lang',{estimateMinutes:300}),make(5,'Context',{estimateMinutes:20,contextTags:['arbeit-buero']})])s.tasks[t.id]=t;
 const results=smartDailyChoices(s,{day:today,minutes:30,energy:'offen'});
 assert.equal(results.items[0].task.title,'Richtig dringend');
 assert.ok(results.items.some(x=>x.task.title==='Zielprojekt'&&x.reasons.some(r=>r.includes('Dissertation'))));
 assert.ok(results.items.every(x=>x.task.title!=='Später'&&x.task.title!=='Zu lang'));
 assert.equal(results.skippedTime,1);
 const only=smartDailyChoices(s,{day:today,minutes:30,energy:'low',context:'arbeit-buero'});
 assert.equal(only.items.length,1);assert.equal(only.items[0].task.title,'Context');
 assert.throws(()=>smartDailyChoices(s,{minutes:-5}));
});

test('0.5.22 legacy asset aliases map to public Kraken EUR symbols and reject bogus prices',()=>{
 const m=publicEurSymbols(['XXBT','XETH','ADA','XXDG','ZEUR','OTHER','../../secret']);
 assert.deepEqual(m['BTC/EUR'],['XXBT']);assert.deepEqual(m['DOGE/EUR'],['XXDG']);
 assert.equal(m['OTHER/EUR'],undefined);
 assert.deepEqual(parsePublicTicker({channel:'ticker',data:[{symbol:'BTC/EUR',last:'67000'},{symbol:'ADA/EUR',last:-1}]},m),{XXBT:'67000'});
});

test('0.5.22 public ticker retrieves quotes through unauthenticated WebSocket without transmitting balances',async()=>{
 const messages=[];
 class FakeWebSocket {
  constructor(url){assert.equal(url,'wss://ws.kraken.com/v2');queueMicrotask(()=>this.onopen());}
  send(data){messages.push(JSON.parse(data));queueMicrotask(()=>this.onmessage({data:JSON.stringify({channel:'ticker',type:'snapshot',data:[{symbol:'BTC/EUR',last:71000},{symbol:'ETH/EUR',last:2300}]})}));}
  close(){}
 }
 const values=await fetchPublicEurQuotes(['XXBT','XETH'],{WebSocketClass:FakeWebSocket,timeoutMs:1800});
 assert.equal(values.quotesEur.XXBT,'71000');assert.equal(values.quotesEur.XETH,'2300');
 assert.equal(messages[0].method,'subscribe');
 assert.deepEqual(Object.keys(messages[0].params).sort(),['channel','snapshot','symbol']);
 assert.deepEqual(messages[0].params.symbol,['BTC/EUR','ETH/EUR']);
 assert.ok(!JSON.stringify(messages).includes('amount'));
});

test('0.5.22 new public quotes reprice old imported holdings without inventing a new balance snapshot',()=>{
 const old={format:KRAKEN_FORMAT,generatedAt:'2026-10-01T12:00:00Z',balances:{XXBT:'0.1',ADA:'100'},ledgers:[],trades:[],quotesEur:{},pricedAt:null,valuationHistory:[]};
 const updated=updateKrakenQuotes(old,{pricedAt:'2026-10-19T08:00:00Z',quotesEur:{XXBT:'60000'}});
 assert.equal(updated.generatedAt,old.generatedAt);assert.equal(updated.valuationHistory.length,0);
 assert.equal(krakenWealthSummary(updated).complete,false);
 assert.equal(krakenWealthSummary(updated).totalEur,6000);
});

test('0.5.22 UI wires goals, daily choices and browser public quotes without new cloud endpoints',()=>{
 assert.match(source,/lifeGoalsPanel\(\)/);assert.match(source,/todaySmartPanel\(\)/);
 assert.match(source,/data-action="life-goal-link"/);assert.match(source,/v22-day-energy/);
 assert.match(source,/finance-kraken-public-quotes/);assert.match(source,/fetchPublicEurQuotes/);
 assert.match(finance,/EUR-Marktwert jetzt aktualisieren/);
 assert.match(source,/COMPASS_CLIENT_VERSION='0\.5\.32'/);
});
