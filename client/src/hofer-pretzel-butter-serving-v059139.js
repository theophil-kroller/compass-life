/** Compass 0.5.91.39 · HOFER BACKBOX Laugenbreze spread with user-added butter.
 * Product label not supplied: pretzel uses unverified FDDB community estimate
 * (314 kcal, 8.5g protein, 56.7g carbs, 5.2g fat, 1.75g salt per 100g).
 * 95g/breze and 10g/breze butter are EDITABLE MASS ASSUMPTIONS.
 */
export const HOFER_PRETZEL_BUTTER_ID='hofer-laugenbreze-butter';
export const HOFER_PRETZEL_DEFAULT='1 Breze (95 g) + Butter (10 g; geschätzt)';
const num=value=>Number(String(value).replace(',','.'));
export function parseHoferPretzelButterPortion(amount='',fallback=HOFER_PRETZEL_DEFAULT){
 const s=String(amount||fallback||'').trim().toLowerCase();
 if(!s||/[-+]?infinity|nan/.test(s)||/^-\s*\d/.test(s)||/\(\s*-\s*\d/.test(s)||/butter\s*-\s*\d/.test(s))return null;
 const count=s.match(/(\d+(?:[.,]\d+)?)\s*(?:stücke?|stuecke?|brezeln?|brezen?|breze)\b/);
 const gramsAfter=s.match(/(?:breze|brezel|brezen|brezeln|stück|stueck)[^+]*?\(\s*(\d+(?:[.,]\d+)?)\s*g\s*\)/);
 const gramsBefore=s.match(/(\d+(?:[.,]\d+)?)\s*g\s*(?:laugen-?)?brez/);
 const noButter=/\bohne\s+butter\b/.test(s);
 const butter=s.match(/butter\s*\(?\s*(\d+(?:[.,]\d+)?)\s*g\b/)||s.match(/(\d+(?:[.,]\d+)?)\s*g\s*butter\b/);
 if(!count&&!gramsAfter&&!gramsBefore)return null;
 const pieces=count?num(count[1]):1;
 // For '1 Breze (95 g)' the explicit mass takes precedence over piece-count.
 const pretzelGrams=gramsAfter?num(gramsAfter[1]):gramsBefore?num(gramsBefore[1]):pieces*95;
 const butterGrams=noButter?0:butter?num(butter[1]):pieces*10;
 if(!Number.isFinite(pretzelGrams)||!Number.isFinite(butterGrams)||!Number.isFinite(pieces)||pieces<=0||pretzelGrams<=0||pretzelGrams>2000||butterGrams<0||butterGrams>500)return null;
 return {pretzelGrams,butterGrams};
}
export function hoferPretzelButterKcal(portion){
 if(!portion)return null;
 const {pretzelGrams,butterGrams}=portion;
 return Math.round(pretzelGrams*3.14+butterGrams*7.4);
}
