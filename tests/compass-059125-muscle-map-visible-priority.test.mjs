import test from 'node:test';
import assert from 'node:assert/strict';
import {premiumMuscleHighlight125,premiumStrengthSvg,mountPremiumAnatomy,strengthPremiumMap} from '../client/src/strength-premium-v57738.js';
import {STABILIZER_COLOR_122} from '../client/src/strength-anatomy-v57737.js';

const today='2026-11-06';
const dataModel=()=>({today,sessions:[
 {day:'2026-11-06',sets:[{exerciseId:'goblet-squat',reps:10}]},
 {day:'2026-11-05',sets:[{exerciseId:'plank',reps:30},{exerciseId:'calf-raise',reps:12},{exerciseId:'biceps-curl',reps:12}]},
 {day:'2026-10-15',sets:[{exerciseId:'lat-pulldown',reps:10}]}
],events:[]});
const cycling={rides:0,regions:{primary:[],secondary:[]}};
const atlas={FRONT_MUSCLES:[
 {id:'abs-upper-left',path:'M0 0l1 1z'},
 {id:'quads-left',path:'M0 0l1 1z'},
 {id:'tibialis-left',path:'M0 0l1 1z'},
 {id:'biceps-left',path:'M0 0l1 1z'},
 {id:'lats-left',path:'M0 0l1 1z'}
],BACK_MUSCLES:[
 {id:'calves-gastroc-medial-left',path:'M0 0l1 1z'},
 {id:'calves-soleus-left',path:'M0 0l1 1z'}
]};
function svgFromModel(model,view='front'){
 const src=premiumStrengthSvg(model,view,'roles',cycling,'strength');
 const attr=src.match(/data-anatomy-info="([^"]+)"/)?.[1];
 assert.ok(attr,'SVG has anatomy model');
 const info=JSON.parse(attr.replaceAll('&quot;','"').replaceAll('&amp;','&'));
 const svg={isConnected:true,dataset:{anatomyView:view,anatomyInfo:JSON.stringify(info)},innerHTML:'',addEventListener(){},closest:()=>({querySelector:()=>null,addEventListener(){}})};
 return {svg,info,root:{querySelectorAll:()=>[svg]}};
}
function findFill(svg,muscle){
 const p=svg.innerHTML.split('<path ').find(x=>x.includes(`data-muscle-name="${muscle}"`));
 assert.ok(p,`muscle region ${muscle} appears`);
 return p.match(/fill="([^"]+)"/)?.[1];
}
test('a muscle trained yesterday as primary but supporting today is yellow, not muted red',async()=>{
 const v=svgFromModel(dataModel());
 assert.equal(v.info.temporalPalette125,true);
 assert.ok(v.info.yesterdayRegions.includes('rectus_abdominis'));
 assert.ok(v.info.supportingRegions.includes('rectus_abdominis'));
 assert.equal(premiumMuscleHighlight125(v.info,'rectus_abdominis').role,'today-supporting');
 assert.equal(await mountPremiumAnatomy(v.root,async()=>atlas),1);
 assert.equal(findFill(v.svg,'Gerader Bauchmuskel'),'#f0c955');
 assert.match(v.svg.innerHTML,/Heute unterstützend/);
});
test('today primary red beats today supporting and recent training',()=>{
 const info={todayRegions:['rectus_abdominis'],supportingRegions:['rectus_abdominis'],recentRegions:['rectus_abdominis'],todayStabilizers:['rectus_abdominis']};
 assert.equal(premiumMuscleHighlight125(info,'rectus_abdominis').fill,'#ed4b42');
});
test('today stabilizer turquoise beats yesterday muted red, but does not count as a growth set',async()=>{
 const v=svgFromModel(dataModel(),'back');
 assert.ok(v.info.todayStabilizers.includes('calves_gastro'));
 assert.ok(v.info.yesterdayRegions.includes('calves_gastro'));
 assert.equal(premiumMuscleHighlight125(v.info,'calves_gastro').role,'today-stabilizing');
 await mountPremiumAnatomy(v.root,async()=>atlas);
 assert.equal(findFill(v.svg,'Zwillingswadenmuskel (Gastrocnemius)'),STABILIZER_COLOR_122);
 assert.match(v.svg.innerHTML,/keine Wachstumssätze/);
});
test('yesterday muscles are muted red, current primary is red, current stabilizer is teal',async()=>{
 const v=svgFromModel(dataModel());
 await mountPremiumAnatomy(v.root,async()=>atlas);
 assert.equal(findFill(v.svg,'Quadrizeps'),'#ed4b42');
 assert.equal(findFill(v.svg,'Bizeps'),'#a63e53');
 assert.equal(findFill(v.svg,'Vorderer Schienbeinmuskel (Tibialis anterior)'),STABILIZER_COLOR_122);
});
test('older-than-seven-day muscles do not get misleading orange/color highlights',async()=>{
 const v=svgFromModel(dataModel());
 assert.equal(premiumMuscleHighlight125(v.info,'latissimus'),null);
 await mountPremiumAnatomy(v.root,async()=>atlas);
 assert.equal(findFill(v.svg,'Latissimus'),'#1d2633');
});
test('legend shows current-day roles before retrospective orange, and roles do not change training records',()=>{
 const model=dataModel(),saved=structuredClone(model);
 const html=strengthPremiumMap(model,cycling,'strength');
 assert.ok(html.indexOf('Heute unterstützend')<html.indexOf('Vor 2–7 Tagen trainiert'));
 assert.ok(html.indexOf('Stabilisierend · kein Wachstumssatz')<html.indexOf('Vor 2–7 Tagen trainiert'));
 assert.deepEqual(model,saved);
});
