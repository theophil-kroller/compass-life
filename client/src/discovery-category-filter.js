/** `null` means all categories, [] means none. Array contains exact known category ids. */
export const matchesEventCategories=(category,selected)=>selected===null||selected===undefined||selected.includes(String(category));
export function toggleEventCategory(selected,category,checked,universe){
 const known=[...new Set(universe.map(String))];
 const old=selected==null?new Set(known):new Set(selected);
 if(checked)old.add(category);else old.delete(category);
 const next=known.filter(x=>old.has(x));
 return next.length===known.length?null:next;
}
export const selectedCategoryLabel=(selected,universe)=>selected==null?'Alle':selected.length===0?'Keine':selected.length===1?selected[0]:`${selected.length} von ${universe.length}`;
