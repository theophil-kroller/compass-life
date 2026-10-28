import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
const names=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
const sequence=[...cfg.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
async function transformed(file){
 let src=readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
 for(const name of sequence){
  const filename=names.get(name);
  assert.ok(filename,`not wired: ${name}`);
  const mod=await import(new URL('../client/'+filename,import.meta.url));
  const r=mod[name]().transform(src,'/build/client/src/'+file);
  if(r?.code)src=r.code;
 }
 return src;
}
test('End-to-end Vite transform chain provides smoothie kcal for old journal records and all health graphs',async()=>{
 const journal=await transformed('personal-journal-v5692.js');
 assert.match(journal,/export function nutritionKcalEstimate\(food,amount,recipe=null\)/);
 assert.match(journal,/food\?\.id==='smoothie-personal'\)return smoothieKcalEstimate\(recipe,amount\)/);
 assert.match(journal,/nutritionKcalEstimate\(food,entry.amount,entry.recipe\)/);
 assert.match(journal,/Mein Smoothie · Banane, Sesam, Heidelbeeren, Blütenpollen/);
 const history=await transformed('nutrition-history-v577.js');
 assert.match(history,/nutritionKcalEstimate\(food,e.amount,e.recipe\)/);
 const day=await transformed('energy-goal-v575.js');
 assert.match(day,/estimate\(index.get\(e.foodId\),e.amount,e.recipe\)/);
 const timeline=await transformed('nutrition-timing-v57725.js');
 assert.match(timeline,/const approx=nutritionKcalEstimate\(food,entry.amount,entry.recipe\)/);
 assert.match(timeline,/e.note,e.recipe,e.updatedAt/);
 const intel=await transformed('nutrition-intelligence-v57712.js');
 assert.match(intel,/entry.foodId==='smoothie-personal'\?smoothieParts\(entry.recipe\)/);
});
