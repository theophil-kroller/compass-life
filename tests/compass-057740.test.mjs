import test from 'node:test';
import assert from 'node:assert/strict';
import {compassRegionForAnatomyId,mountPremiumAnatomy,premiumStrengthSvg} from '../client/src/strength-premium-v57738.js';
const fakeAtlas={
 FRONT_MUSCLES:[
  {id:'head',name:'Head',path:'m 0,0 l 1,0 0,2 z'},
  {id:'biceps-left',name:'Biceps (L)',path:'m 12,25 l 4,2 0,7 z'},
  {id:'chest-upper-left',name:'Upper pectoral',path:'m 16,15 l 4,2 0,7 z'}
 ],
 BACK_MUSCLES:[
  {id:'gluteus-maximus-left',name:'Gluteus maximus (L)',path:'m 50,50 l 3,2 0,7 z'},
  {id:'calves-gastroc-medial-left',name:'Calf',path:'m 50,65 l 3,2 0,7 z'},
  {id:'calves-soleus-left',name:'Soleus',path:'m 50,70 l 3,2 0,7 z'}
 ]
};
function fakeMount(view){
 const tip={hidden:true,dataset:{},textContent:''};
 const fig={querySelector:()=>tip,events:{},addEventListener(k,v){this.events[k]=v;}};
 const svg={isConnected:true,dataset:{anatomyView:view,anatomyInfo:JSON.stringify({regions:{biceps:{primary:3,secondary:0,index:3},glute_max:{primary:3,secondary:0,index:3}},activity:'strength',mode:'roles',cyclingPrimary:[],cyclingSecondary:[]})},innerHTML:'',events:{},closest:()=>fig,addEventListener(k,v){this.events[k]=v;}};
 return {tip,fig,svg,root:{querySelectorAll:()=>[svg]}};
}
test('names map to detailed anatomical exercise regions, including calves and compound lifts',()=>{
 for(const [id,region] of [['biceps-left','biceps'],['chest-upper-left','pectoral_upper'],['gluteus-maximus-left','glute_max'],['calves-gastroc-medial-left','calves_gastro'],['calves-soleus-left','calves_soleus'],['traps-upper-left','trapezius_upper'],['hamstrings-lateral-left','hamstrings'],['shoulder-front-right','deltoid_front']]){
  assert.equal(compassRegionForAnatomyId(id,'back'),region,id);
 }
});
test('front atlas mounts locally bundled fine regions and gives German muscle names on hover and tap',async()=>{
 const v=fakeMount('front');assert.equal(await mountPremiumAnatomy(v.root,async()=>fakeAtlas),1);
 assert.match(v.svg.innerHTML,/Bizeps/);assert.match(v.svg.innerHTML,/Oberer Brustmuskel/);
 assert.match(v.svg.innerHTML,/#f06436/);assert.match(v.svg.innerHTML,/<title>/);
 const muscle={dataset:{muscleName:'Bizeps',muscleNote:'3 Hauptsätze · 0 unterstützend'}};
 v.svg.events.pointerover({target:{closest:()=>muscle}});
 assert.equal(v.tip.hidden,false);assert.match(v.tip.textContent,/Bizeps/);
 v.svg.events.pointerout();assert.equal(v.tip.hidden,true);
 v.svg.events.click({target:{closest:()=>muscle}});
 assert.equal(v.tip.hidden,false);assert.equal(v.tip.dataset.pinned,'1');
 v.svg.events.keydown({key:'Escape'});assert.equal(v.tip.hidden,true);
});
test('back atlas highlights calves and glutes separately; no cycling minutes become strength sets',async()=>{
 const v=fakeMount('back');assert.equal(await mountPremiumAnatomy(v.root,async()=>fakeAtlas),1);
 assert.match(v.svg.innerHTML,/Großer Gesäßmuskel/);assert.match(v.svg.innerHTML,/Zwillingswadenmuskel/);assert.match(v.svg.innerHTML,/Schollenmuskel/);
 assert.match(v.svg.innerHTML,/data-muscle-name=/);assert.match(v.svg.innerHTML,/role="img"/);
});
test('SVG viewports preserve precise atlas coordinates and escape metadata',()=>{
 const model={sessions:[{sets:[{exerciseId:'hip-thrust',reps:10}]}]};
 const body=premiumStrengthSvg(model,'back','roles',{rides:0,regions:{primary:[],secondary:[]}},'strength');
 assert.match(body,/viewBox="37 0 35 93"/);
 assert.match(body,/&quot;glute_max&quot;/);
 assert.doesNotMatch(body,/class="str739-body"/);
});
