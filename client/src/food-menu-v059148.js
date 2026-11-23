/** Compass 0.5.91.48 · additive discoverability index.
 * This is a view-only layer. Never rewrite a food group, ID, saved item, snapshot or amount.
 */
export const FOOD_FILTERS_148=Object.freeze([
 ['quick','✦','Für dich'],['protein','💪','Proteinreich'],['dairy','🥣','Milchprodukte'],
 ['bakery','🥨','Brot & Gebäck'],['sport','🥤','Shakes & Supplemente'],
 ['meals','🍽️','Gerichte & Beilagen'],['vegetables','🥦','Gemüse'],['fruitnuts','🥜','Obst & Nüsse'],
 ['sweets','🍫','Süßes & Snacks'],['drinks','☕','Getränke'],
 ['ingredients','🧂','Zutaten'],['other','◌','Weitere'],['all','▦','Alle']
]);
const norm=s=>String(s??'').toLocaleLowerCase('de-AT').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
const explicit=Object.freeze({
 'profuel-alphaminos-bcaa':'sport','supplement-bluebonnet-one-men':'sport','supplement-fuerstenmed':'sport',
 'matcha-powder':'ingredients', // Matcha is a culinary ingredient, not a protein supplement
 'realmix-ube-latte-stick-16g':'drinks',
 'homemade-beet-potato-sheep-cheese-salad-20261121':'meals',
 'all-seasons-roesti-toast-camembert-lingonberry-200g':'meals',
 'homemade-raw-cacao-oat-milk-20261122':'drinks',
 'takeaway-noodle-box-vegetable-thai-curry-20261123':'meals',
 'homemade-millet-egg-bake-little-date-syrup-20261123':'meals',
 'homemade-millet-egg-bake-pear-breakfast-20261123':'meals',
 'braineffect-mct-c8-oil':'ingredients','water-glass':'drinks',
 'milsani-high-protein-pfirsich-maracuja-200g':'dairy',
 'dr-oetker-high-protein-milchreis-zimt-400g':'dairy',
 'billa-high-protein-griesspudding-zimt-500g':'dairy',
 'noem-pro20-topfencreme-blueberry-cheesecake-235g':'dairy',
 'broccoli-steamed-home-20261115':'vegetables','sweet-potato-steamed-20261115':'vegetables','spelt-spaghetti-dry-20261115':'meals',
 'passion-fruit-fresh-20261115':'fruitnuts','carrot-raw-fresh-20261115':'vegetables',
 'mango-fresh-20261115':'fruitnuts','mandarin-fresh-20261115':'fruitnuts','dragon-fruit-fresh-20261115':'fruitnuts',
 'pomelo-fresh-20261115':'fruitnuts','pomegranate-fresh-20261115':'fruitnuts','kiwi-green-fresh-20261115':'fruitnuts',
 'avocado-fresh-20261115':'fruitnuts','calpis-kyohou-grape-diluted-20261115':'drinks',
 'all-stars-whey-iced-matcha-latte-30g':'sport',
 'nutrinorm-whey-deluxe-cookies-cream-30g':'sport',
 'golden-turtle-peanuts-raw-with-skin-500g':'fruitnuts',
 'homemade-muffin-low-sugar-20261114':'sweets',
 'homemade-cake-slice-low-sugar-20261114':'sweets',
 'ehrmann-high-protein-vegan-chocolate-200g':'sweets',
 'alpro-plant-protein-vanilla-pudding-200g':'sweets',
 'alpro-plant-protein-chocolate-pudding-200g':'sweets',
 'homemade_indian_lemon_red_cabbage_20261114':'meals','homemade_red_cabbage_beet_kimchi_20261114':'meals',
 'hofer-laugenbreze-butter':'bakery','happy-harvest-steinofen-kornspitz':'bakery',
 'wholegrain-toast-butter-jam':'bakery','bio-kornbrot':'bakery','bread-cheese':'bakery',
 'dark-bread-butter':'bakery','wholegrain-bread-slice':'bakery',
 'chocolate-cookie-cream':'sweets','whipped-cream':'ingredients',
 'sbudget-topfencreme-vanilla':'dairy','rice-pudding':'dairy',
 'peanuts':'fruitnuts','mixed-nuts':'fruitnuts','spar-bio-flaxseed':'fruitnuts',
 'koro-black-tahini':'fruitnuts','koro-pistachio-puree':'fruitnuts',
 'green-tea-chinese':'drinks','matcha':'drinks','matcha-oat-plain':'drinks',
 'oat-latte':'drinks','latella':'dairy','milk-my-vay':'drinks',
 'organic-hemp-fruit-protein-bar-35g':'sweets'
});
const proteinIds=new Set([
 'ironmaxx-vegan-protein-shake-mixed-berries',
 'all-stars-whey-iced-matcha-latte-30g','nutrinorm-whey-deluxe-cookies-cream-30g',
 'ehrmann-high-protein-skyr-natural-450g','ehrmann-high-protein-vegan-chocolate-200g',
 'spar-naturpur-bio-skyr-mango-maracuja-400g','milsani-high-protein-pfirsich-maracuja-200g',
 'milsani-skyr-maracuja-150g','spar-freefrom-bio-skyr-250g','bio-magertopfen-250g',
 'dr-oetker-high-protein-milchreis-zimt-400g','billa-high-protein-griesspudding-zimt-500g','noem-pro20-topfencreme-blueberry-cheesecake-235g',
 'alpro-plant-protein-vanilla-pudding-200g','alpro-plant-protein-chocolate-pudding-200g',
 'organic-hemp-fruit-protein-bar-35g'
]);
export function foodCategory148(food){
 const id=String(food?.id||''),title=norm(food?.title),group=norm(food?.group);
 if(Object.hasOwn(explicit,id))return explicit[id];
 if(group==='eigene')return 'other';
 if(/protein.*(shake|drink|pulver)|whey|ironmaxx|bcaa|aminos|supplement|nahrungserganzung|kapsel/.test(id+' '+title+' '+group))return 'sport';
 if(/skyr|joghurt|yogurt|quark|topfen|pudding|cheddar|kase|milchreis|greek|griechisch|milsani|ehrmann/.test(id+' '+title))return 'dairy';
 if(/brot|toast|laugen|breze|brezel|kornspitz|backbox|brotchen|semmel/.test(id+' '+title))return 'bakery';
 if(group==='mahlzeiten'||group==='fruhstuck'&&/fruhstuck|omelette|ei|porridge|smoothie|schussel/.test(id+' '+title)||/kimchi|rotkraut|salat|reis|dal|kitcheri|suppe|pizza|mensa|study-teller|teller/.test(id+' '+title))return 'meals';
 if(/nuss|nuts|erdnuss|mandel|pistazie|sesam|tahini|leinsamen|mango|apfel|banana|banane|beeren/.test(id+' '+title))return 'fruitnuts';
 if(group==='getranke'||/tee|kaffee|espresso|latte|water|wasser|drink|saft|spritz|wein|whisk|cocktail/.test(id+' '+title))return 'drinks';
 if(group==='zutaten'||/pulver|ol|butter|sirup|honig|kakao/.test(id+' '+title))return 'ingredients';
 if(group==='snacks'||/keks|schoko|cookie|riegel|pudding|chips|cup|torte|kuchen|dessert/.test(id+' '+title))return 'sweets';
 return 'other';
}
export function foodTags148(food){
 const category=foodCategory148(food),id=String(food?.id||''),title=norm(food?.title);
 const protein=proteinIds.has(id)||/high.protein|protein|skyr|magertopfen|quark/.test(title);
 return [category,...(protein?['protein']:[])];
}
export function foodSearch148(food){
 const aliases=Array.isArray(food?.aliases)?food.aliases.join(' '):'';
 const title=String(food?.title||'');
 const extras=/bcaa|alphaminos/.test(food?.id||'')?'aminos aminosaeure aminosäuren shaker pulver supplement drink':'';
 return norm([title,food?.id,food?.group,food?.defaultAmount,aliases,extras].join(' '));
}
/** Called after overlay render. Only native DOM visibility, no rerender, no persistence. */
export function wireFoodMenu148(app){
 const menu=app?.querySelector?.('[data-pj148-menu]');
 if(!menu||menu.dataset.pj148Ready==='1')return;
 menu.dataset.pj148Ready='1';
 const search=menu.querySelector('[data-pj148-search]');
 const chips=[...menu.querySelectorAll('[data-pj148-filter]')];
 const sections=[...menu.querySelectorAll('[data-pj148-group]')];
 const recommendations=menu.querySelector('[data-pj148-recommended]');
 const summary=menu.querySelector('[data-pj148-count]');
 let selected=menu.dataset.pj148Initial||'all';
 const apply=()=>{
  const query=norm(search?.value||'').trim();let visible=0;
  for(const section of sections){
   const tiles=[...section.querySelectorAll('[data-pj148-tags]')];let sectionCount=0;
   for(const tile of tiles){
    const matches=(!query||norm(tile.dataset.pj148Search||'').includes(query))&&
      (query||selected==='all'||(selected!=='quick'&&String(tile.dataset.pj148Tags||'').split(' ').includes(selected)));
    tile.hidden=!matches;
    if(matches)sectionCount++;
   }
   section.hidden=sectionCount===0;visible+=sectionCount;
  }
  if(recommendations)recommendations.hidden=!!query||selected!=='quick';
  for(const chip of chips){const active=chip.dataset.pj148Filter===selected&&!query;chip.classList.toggle('active',active);chip.setAttribute('aria-pressed',String(active));}
  if(summary)summary.textContent=query?`${visible} Treffer in allen Gruppen`:selected==='quick'?'Zuletzt passend erfasste Lebensmittel':`${visible} Produkte sichtbar`;
 };
 search?.addEventListener('input',apply);
 menu.addEventListener('click',ev=>{
  const chip=ev.target.closest?.('[data-pj148-filter]');if(!chip)return;
  ev.preventDefault();ev.stopPropagation();
  selected=chip.dataset.pj148Filter;
  if(search)search.value='';
  apply();
 });
 apply();
}
