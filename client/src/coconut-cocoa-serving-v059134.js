/** Compass 0.5.91.34 · photographed product label portions.
 * Dr. Goerg coconut milk label is per 100 ml; standard portion = 100 ml.
 * Copaya raw cocoa label is per 100 g; standard spoon = 1 level EL ~= 6 g.
 * An actual spoon can vary by brand, packing and whether heaped; editable grams win.
 * Invalid amounts stay unknown; do not silently count a default portion.
 */
export const DR_GOERG_COCONUT_MILK_ID='dr-goerg-organic-coconut-milk-200ml';
export const COPAYA_RAW_COCOA_ID='copaya-organic-raw-cocoa-powder';
export const COCONUT_MILK_STANDARD_ML=100;
export const COCONUT_MILK_CARTON_ML=200;
export const COCOA_LEVEL_TBSP_GRAMS=6;
const number=s=>Number(String(s).replace(',','.'));
const valid=(value,maximum)=>Number.isFinite(value)&&value>0&&value<=maximum;
const match=(s,re)=>{const m=s.match(re);return m?number(m[1]):null;};
const quantity=text=>String(text??'').trim();
const neg=/(?:^|\s)[−–-]\s*\d/;
// Favor one explicit quantity over explanatory equivalences in parentheses.
export function parseCoconutMilkPortion(value,defaultAmount='100 ml'){
 const text=quantity(value==null||quantity(value)===''?defaultAmount:value);
 if(!text||neg.test(text))return null;
 const count=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:packung(?:en)?|karton(?:s)?)(?=$|[^\p{L}])/iu);
 const portion=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:portion(?:en)?)(?=$|[^\p{L}])/iu);
 const ml=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:ml|milliliter)(?=$|[^\p{L}])/iu);
 const litres=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:l|liter)(?=$|[^\p{L}])/iu);
 const qty=count!==null?count*COCONUT_MILK_CARTON_ML:portion!==null?portion*COCONUT_MILK_STANDARD_ML:ml!==null?ml:litres!==null?litres*1000:null;
 return valid(qty,5000)?{value:qty,unit:'ml',portions:qty/COCONUT_MILK_STANDARD_ML}:null;
}
export function parseRawCocoaPortion(value,defaultAmount='1 EL (≈ 6 g)'){
 const text=quantity(value==null||quantity(value)===''?defaultAmount:value);
 if(!text||neg.test(text))return null;
 const tbsp=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:el|essl[oö]ffel|tbsp|tablespoons?)(?=$|[^\p{L}])/iu);
 const tsp=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:tl|teel[oö]ffel|tsp|teaspoons?)(?=$|[^\p{L}])/iu);
 const grams=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:g|gramm)(?=$|[^\p{L}])/iu);
 const portion=match(text,/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:portion(?:en)?)(?=$|[^\p{L}])/iu);
 const g=tbsp!==null?tbsp*COCOA_LEVEL_TBSP_GRAMS:tsp!==null?tsp*COCOA_LEVEL_TBSP_GRAMS/3:grams!==null?grams:portion!==null?portion*COCOA_LEVEL_TBSP_GRAMS:null;
 return valid(g,1000)?{value:g,unit:'g',tablespoons:g/COCOA_LEVEL_TBSP_GRAMS,estimatedMass:tbsp!==null||tsp!==null||portion!==null}:null;
}
export function labelledProductKcal(foodId,serving){
 if(!serving)return null;
 if(foodId===DR_GOERG_COCONUT_MILK_ID&&serving.unit==='ml')return Math.round(serving.value*1.86);
 if(foodId===COPAYA_RAW_COCOA_ID&&serving.unit==='g')return Math.round(serving.value*3.30);
 return null;
}
