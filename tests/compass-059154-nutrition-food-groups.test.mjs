import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nutritionCoachOverview52,nutritionCoachDashboard52,nutritionFoodGroup54,nutritionFoodGroups54,nutritionCategoryDonut54,NUTRITION_GROUP_COLORS_54,nutritionCoachAnalyze52} from '../client/src/nutrition-coach-v059152.js';
const day='2026-11-16';
const journal=(foods)=>({nutritionJournal:{entries:foods.map((f,i)=>({id:'item'+i,foodId:f.id,amount:'1 Portion',at:`2026-11-${String(10+i%6).padStart(2,'0')}T12:30:00+01:00`})),customFoods:foods.map(({id,title,nutrients})=>({id,title,group:'Eigene',defaultAmount:'1 Portion',nutrientBasis:'perPortion',nutrients}))}});
const foods=[
 {id:'bakery-snack-test',title:'Hausgemachter Muffin',nutrients:{kcal:220,protein:4,salt:0.2}},
 {id:'plant-vegetable-test',title:'Brokkoli gedämpft',nutrients:{kcal:90,protein:8,fiber:7}},
 {id:'fruit-test',title:'Apfel frisch',nutrients:{kcal:70,protein:0.5,fiber:3}},
 {id:'nut-test',title:'Erdnüsse geschält',nutrients:{kcal:175,protein:8,fiber:3}},
 {id:'protein-test',title:'High Protein Skyr',nutrients:{kcal:140,protein:25}},
 {id:'mensa-menu-2026-11-15',title:'Mensa Wokgemüse mit Basmatireis',nutrients:{kcal:600,protein:20,salt:2.5}},
 {id:'green-tea-chinese',title:'Grüntee',nutrients:{kcal:0}},
 {id:'profuel-alphaminos-bcaa',title:'PROFUEL Alphaminos BCAA',nutrients:{kcal:20}}
];
test('mutually exclusive food groups keep muffin, vegetable, fruit, nuts, skyr and mensa separate',()=>{
 const expected=['sweets','vegetables','fruit','nuts','dairy','meals','drinks','supplements'];
 assert.deepEqual(foods.map(nutritionFoodGroup54),expected);
});
test('category shares use quantifiable calories, do not include unlogged food or double-count meal ingredients',()=>{
 const m=nutritionCoachOverview52(journal(foods),{days:14,anchor:day,today:day});
 const groups=nutritionFoodGroups54(m),kcal=groups.reduce((x,g)=>x+g.knownKcal,0);
 assert.equal(m.entries,foods.length);
 assert.ok(kcal>1000);
 assert.ok(Math.abs(groups.reduce((x,g)=>x+(g.share||0),0)-100)<0.00001);
 assert.equal(groups.find(g=>g.id==='meals').count,1);
 assert.equal(groups.find(g=>g.id==='vegetables').count,1);
 assert.equal(groups.find(g=>g.id==='sweets').knownKcal,220);
 const html=nutritionCoachDashboard52(journal(foods),{days:14,anchor:day,today:day});
 assert.match(html,/So setzt sich deine Ernährung zusammen/);
 assert.match(html,/Süßes &amp; Desserts/);
 assert.match(html,/Segment oder Kategorie antippen/);
 assert.match(html,/Mischgerichte bleiben bei den Gruppenkalorien ein Gericht/);
 assert.match(html,/Dein persönlicher Nutrition Coach/);
 assert.match(html,/ni154-donut-layout/);
 assert.match(html,/ni154-category-value/);
 assert.match(html,/ni154-donut-wedge/);
});
test('nutrition report is only calculated after click and never changes the journal',()=>{
 const s=journal(foods),old=JSON.stringify(s);
 const html=nutritionCoachDashboard52(s,{days:14,anchor:day,today:day});
 assert.match(html,/Meine Ernährung analysieren/);
 assert.equal(JSON.stringify(s),old);
 const report=nutritionCoachAnalyze52(s,{days:14,anchor:day,today:day});
 assert.equal(JSON.stringify(s),old);
 assert.ok(report.items.length>0);
});

test('SVG donut and legend share one fixed colour per group and show label, icon, percentage and units',()=>{
 const m=nutritionCoachOverview52(journal(foods),{days:14,anchor:day,today:day});
 const groups=nutritionFoodGroups54(m);
 const html=nutritionCoachDashboard52(journal(foods),{days:14,anchor:day,today:day});
 for(const g of groups){
   assert.equal(g.color,NUTRITION_GROUP_COLORS_54[g.id]);
   assert.match(html,new RegExp('id="ni154-category-'+g.id+'" style="--ni154-color:'+g.color+'"'));
   assert.ok(html.includes(g.icon));
   assert.ok(html.includes(g.label.replace('&','&amp;')));
   if(g.share>0){
     assert.match(html,new RegExp('href="#ni154-category-'+g.id+'"'));
     assert.match(html,new RegExp('stroke="'+g.color+'"'));
   }
 }
 assert.match(html,/>QUANTIFIZIERT</);
 assert.match(html,/kcal im Zeitraum/);
 assert.match(html,/data-action="ni154-select-category"/);
});
test('unknown kcal stays visible in category detail, but creates no invented percentage or donut slice',()=>{
 const f=[{id:'custom-snack-a',title:'Unbekannter Snack',nutrients:{protein:4}},
          {id:'vegetables-a',title:'Brokkoli',nutrients:{kcal:100,protein:7}}];
 const m=nutritionCoachOverview52(journal(f),{days:14,anchor:day,today:day});
 const groups=nutritionFoodGroups54(m);
 const unknown=groups.find(g=>g.id==='other');
 assert.ok(unknown);assert.equal(unknown.share,null);
 const donut=nutritionCategoryDonut54(groups);
 assert.ok(!donut.includes('href="#ni154-category-other"'));
 const html=nutritionCoachDashboard52(journal(f),{days:14,anchor:day,today:day});
 assert.match(html,/kcal unbekannt/);
 assert.match(html,/Einträge ohne kcal/);
 assert.match(html,/href="#ni154-category-vegetables"/);
});
test('clicking donut only expands an existing group without render, sync or write',()=>{
 const code=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 const start=code.indexOf("if(action==='ni154-select-category')");
 assert.ok(start>0);
 const end=code.indexOf("if(action==='ni152-retry')",start);
 const branch=code.slice(start,end);
 assert.match(branch,/category.open=true/);
 assert.doesNotMatch(branch,/\b(?:render|persist|mutate|fetch|syncPersonalJournal)\(/);
});
