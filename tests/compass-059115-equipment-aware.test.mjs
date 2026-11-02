import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {DEFAULT_EQUIPMENT_115,normalizeEquipment115,availableLoads115,exactLoad115,nextLoad115,dumbbellCount115,plateSvg115,plateText115,equipmentDecision115,equipmentMarkup115} from '../client/src/strength-equipment-v059115.js';
const home=DEFAULT_EQUIPMENT_115;
const plan=(kg,id='dumbbell-lateral-raise',action='increase-load')=>equipmentDecision115({profile:home,exerciseId:id,lastKg:kg,rirModel:{action,message:'Alle Sätze bestätigt, RIR 2'},plateWeightKnown:true});
const path=file=>readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
test('1. Realistic plate levels from four of each size and two dumbbells',()=>{
 const levels=availableLoads115(home,{dumbbells:2});assert(levels.some(x=>x.plateKg===7));assert(levels.some(x=>x.plateKg===8));assert(!levels.some(x=>x.plateKg===13));assert.equal(levels.at(-1).plateKg,14);
});
test('2. Symmetric loading is derived, not independently assigned left and right',()=>{
 const x=exactLoad115(home,7,2);assert.deepEqual(x.perSide,[{kg:2.5,count:1},{kg:1,count:1}]);assert.equal(x.perSide.reduce((s,p)=>s+p.kg*p.count*2,0),7);
});
test('3. Two identical dumbbells consume all four plates of a used size',()=>{
 const x=exactLoad115(home,8,2);assert.deepEqual(x.perSide,[{kg:2.5,count:1},{kg:1.5,count:1}]);assert(!exactLoad115(home,16,2));
});
test('4. One dumbbell permits heavier loading than two, without multiplying inventory',()=>{
 assert.equal(availableLoads115(home,{dumbbells:1}).at(-1).plateKg,28);
 assert.equal(availableLoads115(home,{dumbbells:2}).at(-1).plateKg,14);
 assert.equal(dumbbellCount115('dumbbell-row'),1);assert.equal(dumbbellCount115('dumbbell-lateral-raise'),2);
});
test('5. Actual next step is 7 → 8, not generic fixed +2',()=>{
 assert.equal(nextLoad115(home,7,2).plateKg,8);assert.equal(nextLoad115(home,7,1).plateKg,8);
});
test('6. Missing grip weight stays unknown, explicit handle included separately',()=>{
 assert.equal(exactLoad115(home,8,2).totalKg,null);
 const other=structuredClone(home);other.sets[0].handleWeightKg=1.2;
 assert.equal(exactLoad115(other,8,2).totalKg,9.2);
 assert.match(plateText115(exactLoad115(home,8,2)),/Griffgewicht offen/);
});
test('7. Lateral raise resists 14.3% load jump while rows can accept it with confirmed RIR',()=>{
 assert.equal(plan(7,'dumbbell-lateral-raise').action,'hold-jump');
 assert.equal(plan(7,'dumbbell-row').suggestedKg,8);
});
test('8. High fatigue, RIR 0-1 and deload never automatically raise load',()=>{
 assert.equal(plan(7,'dumbbell-row','hold-fatigue').suggestedKg,null);
 assert.equal(equipmentDecision115({profile:home,exerciseId:'dumbbell-row',lastKg:7,rirModel:{action:'increase-load'},healthAttention:true}).suggestedKg,null);
 assert.equal(equipmentDecision115({profile:home,exerciseId:'dumbbell-row',lastKg:7,rirModel:{action:'increase-load'},deload:true}).suggestedKg,null);
});
test('9. Unknown or imported load is not passed off as verified plate mass',()=>{
 assert.equal(equipmentDecision115({profile:home,exerciseId:'dumbbell-row',lastKg:7,plateWeightKnown:false}).action,'verify-weight');
 assert.equal(equipmentDecision115({profile:home,exerciseId:'dumbbell-row',lastKg:null,plateWeightKnown:true}).suggestedKg,null);
 assert.equal(equipmentDecision115({profile:home,exerciseId:'dumbbell-row',lastKg:7,plateWeightKnown:true}).suggestedKg,null);
});
test('10. SVG and text expose matching 8kg and both side loads without picture assets',()=>{
 const x=exactLoad115(home,8,2),svg=plateSvg115(x),txt=plateText115(x);
 assert.match(svg,/role="img"/);assert.match(svg,/8 kg Scheiben/);assert.match(svg,/2,5/);assert.match(svg,/1,5/);
 assert.match(txt,/Je Seite: 2,5 kg \+ 1,5 kg/);
 assert.equal((svg.match(/<rect/g)||[]).length>=6,true);
});
test('11. Plate caps, missing inventory and profile sanitization never fabricate equipment',()=>{
 const p=structuredClone(home);p.sets[0].plates.find(x=>x.kg===2.5).count=0;assert(!exactLoad115(p,8,2)?.perSide.some(x=>x.kg===2.5));
 p.sets[0].maxPlatesPerSide=1;assert(availableLoads115(p,{dumbbells:2}).every(x=>x.plateCount<=1));
 const altered=normalizeEquipment115({sets:[{plates:[{kg:1,count:-3},{kg:2,count:6}],handleWeightKg:'',maxPlatesPerSide:2}]});assert.equal(altered.sets[0].plates[0].count,4);assert.equal(altered.sets[0].plates[2].count,6);assert.equal(altered.sets[0].handleWeightKg,null);
});
test('12. Responsive UI, data-driven diagrams and workout weight controls are integrated',()=>{
 const coach=path('strength-coach-v5775910.js'),guide=path('strength-guided-v5775920.js'),css=path('strength-equipment-v059115.css');
 assert.match(coach,/equipmentDecision115/);assert.match(coach,/equipmentMarkup115/);assert.match(coach,/data-equipment-save/);
 assert.match(guide,/validActual\(raw,curr.id\)/);assert.match(guide,/next===undefined/);assert.match(guide,/plateSvg115\(liveLoad\)/);
 assert.match(css,/@media\(max-width:560px\)/);
});
test('13. StrongLifts and other non-dumbbell exercises remain outside new loading model',()=>{
 assert.equal(dumbbellCount115('squat'),null);assert.equal(equipmentDecision115({profile:home,exerciseId:'squat',lastKg:100}),null);
});
test('14. Recommended SVG in compact UI and alternative real loads detail',()=>{
 const decision=plan(7,'dumbbell-row'),html=equipmentMarkup115(decision,{compact:true});assert.match(html,/Nächste/);assert.match(html,/details/);assert.match(html,/svg/);assert.match(html,/8 kg Scheiben/);
});
