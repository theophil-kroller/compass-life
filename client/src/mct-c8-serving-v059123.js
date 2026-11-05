/** Compass 0.5.91.23 · BRAINEFFECT C8 portion normalization (not a lab measurement).
 * Manufacturer: 900 kcal / 100 g and 100 g saturated fat / 100 g.
 * A tablespoon is a volume. 1 EL = 15 ml; ~14 g uses an approximate MCT density
 * of 0.933 g/ml. The individual spoon and temperature can change the actual mass.
 * Prefer a single explicit unit over any explanatory numbers in parentheses.
 */
export const MCT_C8_FOOD_ID='braineffect-mct-c8-oil';
export const MCT_C8_ML_PER_EL=15;
export const MCT_C8_GRAMS_PER_EL=14;
const factor=MCT_C8_GRAMS_PER_EL/MCT_C8_ML_PER_EL;
const num=raw=>Number(String(raw).replace(',','.'));
const valid=x=>Number.isFinite(x)&&x>0&&x<=2000;
/** A dose contains one authoritative quantity. EL/TL take precedence over the
 * equivalent grams/ml printed in a descriptive default portion string.
 * Invalid/ambiguous input stays unknown instead of becoming one tablespoon.
 */
export function parseMctC8Serving(value,defaultAmount='1 EL (15 ml ≈ 14 g)'){
 const text=String(value==null||String(value).trim()===''?defaultAmount:value).trim();
 if(/(?:^|\s)[−–-]\s*\d/.test(text))return null;
 const options=[
  [/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:el|essl[oö]ffel|tbsp|tablespoons?)(?=$|[^\p{L}])/iu,MCT_C8_GRAMS_PER_EL,'EL'],
  [/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:tl|teel[oö]ffel|tsp|teaspoons?)(?=$|[^\p{L}])/iu,MCT_C8_GRAMS_PER_EL/3,'TL'],
  [/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:ml|milliliter)(?=$|[^\p{L}])/iu,factor,'ml'],
  [/(?:^|[^\p{L}\d])(\d+(?:[.,]\d+)?)\s*(?:g|gramm)(?=$|[^\p{L}])/iu,1,'g']
 ];
 for(const [regex,multiplier,unit] of options){
  const matched=text.match(regex);if(!matched)continue;
  const value=num(matched[1]),grams=value*multiplier;
  return valid(grams)?{grams,unit,inputValue:value,estimatedMass:unit!=='g',ml:unit==='g'?grams/factor:grams/factor}:null;
 }
 return null;
}
export function mctC8Kcal(serving){return serving?Math.round(serving.grams*9):null;}
