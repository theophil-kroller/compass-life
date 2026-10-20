import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {closenessZone,closenessRadius,closenessAt,mapPlacement,relationshipMapView} from '../client/src/relationship-map-v567.js';
import {financeRadarEvidence,buildLifeBalanceRadar} from '../client/src/life-balance-radar-v563.js';
const make=(n,closeness)=>({id:`contact-${n}`,name:`Person ${n}`,closeness,genderMarker:n%2?'male':'female',contactCadenceDays:30});
test('0.5.67: 90+ is precisely in the warm, innermost ring; all zone boundaries stable',()=>{
 for(const [n,label] of [[100,'Sehr nah'],[90,'Sehr nah'],[89,'Nah'],[75,'Nah'],[74,'Vertraut'],[60,'Vertraut'],[59,'Locker'],[40,'Locker'],[39,'Peripher'],[0,'Peripher']]) assert.equal(closenessZone(n).label,label);
 assert.ok(closenessRadius(90)<85);assert.ok(closenessRadius(89)>85);assert.equal(closenessAt(490,377+closenessRadius(95)),95);
});
test('0.5.67: map layout preserves radial closeness, stable angles, callout labels do not collide',()=>{
 const people=Array.from({length:12},(_,i)=>make(i,Math.max(10,100-i*7)));
 const a=mapPlacement(people),b=mapPlacement(people);
 assert.deepEqual(a.map(({x,y,labelX,labelY})=>[x,y,labelX,labelY]),b.map(({x,y,labelX,labelY})=>[x,y,labelX,labelY]));
 for(const p of a){assert.ok(Math.abs(Math.hypot(p.x-490,p.y-377)-closenessRadius(p.p.closeness))<.0001);assert.ok(p.labelY>0&&p.labelY<760);}
 for(const side of ['left','right']){const yy=a.filter(p=>p.labelSide===side).map(p=>p.labelY).sort((x,y)=>x-y);for(let i=1;i<yy.length;i++)assert.ok(yy[i]-yy[i-1]>=36);}
});
test('0.5.67: full-screen view has filtering, voluntary gender and real inspector, sanitized input',()=>{
 const people=[make(1,95),{...make(2,70),name:'<script>bad</script>'}];const html=relationshipMapView(people,people[0],{focus:true,projects:{},inspector:'<form id="relationship-preferences-form"></form>'});
 for(const token of ['aria-modal="true"','rel567-focus','rel567-filter','relationship-map','rel567-sidebar','relationship-preferences-form','90–100'])assert.ok(html.includes(token),token);
 assert.ok(!html.includes('<script>'));
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');for(const key of ['closenessAt(q.x,q.y)','relationshipMapFocus','rel567-overlay','relationshipMapFilter','person-quick-log'])assert.ok(main.includes(key),key);
});
test('0.5.67: a two-month paired banking history is provisional; single month cannot establish solvency',()=>{
 const tx=[];for(const month of ['2026-08','2026-09']){tx.push({day:month+'-15',amountCents:250000,flow:'income',category:'Einnahmen / Gehalt',currency:'EUR'});tx.push({day:month+'-25',amountCents:-190000,flow:'expense',category:'Wohnen / Miete & Betriebskosten',currency:'EUR'});}
 const e=financeRadarEvidence(tx,'2026-10-21');assert.ok(e.score!==null);assert.equal(e.monthCount,2);assert.equal(e.provisional,true);
 const r=buildLifeBalanceRadar({financeTransactions:tx},{today:'2026-10-21'}).axes.find(x=>x.key==='finance');assert.ok(r.score!==null);assert.match(r.detail,/vorläufig/);
 const one=financeRadarEvidence(tx.slice(0,2),'2026-10-21');assert.equal(one.score,null);assert.match(one.cause,/mindestens 2/);
});
