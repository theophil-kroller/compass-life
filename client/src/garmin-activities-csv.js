/** Garmin Connect Activities table export (not Fitdays). Local-only parsing.
 * Exported dates have no offset and distances may follow the account's display unit.
 * We preserve this uncertainty instead of asserting UTC or converting miles implicitly.
 */
const MAX_ROWS=50000;
const isValidDate=(s)=>{if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(s))return false;const d=new Date(s+'Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,19)===s;};
const numeric=(x)=>{const s=String(x??'').trim();if(!s||s==='--')return null;const n=Number(s.replace(/^'/,'').replace(/,/g,''));return Number.isFinite(n)?n:null;};
const validNumber=(x,min,max)=>{const n=numeric(x);return n!==null&&n>=min&&n<=max?n:null;};
const elapsed=(text)=>{const m=String(text??'').match(/^(\d{1,3}):(\d\d):(\d\d)(?:\.(\d+))?$/);if(!m)return null;const h=+m[1],min=+m[2],sec=+m[3];if(min>59||sec>59||h>23)return null;return h*60+min+sec/60+Number('0.'+(m[4]||'0'))/60;};
// RFC 4180 records, including quoted commas, newlines and escaped quotes.
function records(csv){const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<csv.length;i++){const ch=csv[i];if(ch==='"'){if(quoted&&csv[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;continue;}
  if(ch===','&&!quoted){row.push(cell);cell='';continue;}if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&csv[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';if(rows.length>MAX_ROWS+4)throw Error('Garmin-CSV enthält mehr als 50.000 Aktivitäten. Bitte Export aufteilen.');continue;}cell+=ch;
 }if(quoted)throw Error('Garmin-CSV: unvollständiges Anführungszeichen');row.push(cell);if(row.some(v=>v!==''))rows.push(row);return rows;
}
export function isGarminActivitiesCsv(text){const head=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/,1)[0].toLowerCase();return /\bactivity type\b/.test(head)&&/\bdate\b/.test(head)&&/\btime\b/.test(head)&&/\bdistance\b/.test(head);}
const SPORT={'cycling':2,'running':1,'swimming':5,'walking':11,'hiking':17,'strength training':19,'indoor cycling':20};
export function parseGarminActivitiesCsv(text){const csv=String(text??'').replace(/^\uFEFF/,'');if(!isGarminActivitiesCsv(csv))throw Error('Keine Garmin-Activities-Tabelle: Spalten Activity Type, Date, Time, Distance erwartet');
 const all=records(csv),header=all.shift()?.map(s=>s.trim().toLowerCase())||[];
 for(const needed of ['activity type','date','title','time','distance'])if(!header.includes(needed))throw Error('Garmin-Activities-Spalte fehlt: '+needed);
 const field=(row,k)=>row[header.indexOf(k)]||'',result=[];
 for(const row of all){const at=field(row,'date').trim().replace(' ','T');if(!isValidDate(at))continue;const minutes=elapsed(field(row,'time'));if(minutes===null||minutes<=0)continue;
  const activityType=field(row,'activity type').trim().slice(0,64),title=(field(row,'title').trim()||activityType||'Garmin-Aktivität').slice(0,150);
  const sport=SPORT[activityType.toLowerCase()]??0,day=at.slice(0,10);
  const rawDistance=validNumber(field(row,'distance'),0,150000),swim=/swimm?ing/i.test(activityType+' '+title),distance=swim&&rawDistance!==null&&rawDistance>30?rawDistance/1000:rawDistance,calories=validNumber(field(row,'calories'),0,25000),avgHr=validNumber(field(row,'avg hr'),25,240),maxHr=validNumber(field(row,'max hr'),25,260);
  result.push({id:`garmin-csv|${at}|${activityType}|${title}`,day,start:at,end:null,sport,title,activityType,durationMinutes:Math.round(minutes*10)/10,
   distanceKm:distance,calories,avgHr,maxHr,source:'garmin-activities-csv',localTimeNoOffset:true,distanceUnitAssumed:swim&&rawDistance!==null&&rawDistance>30?'m-converted':'km'});
 }
 if(!result.length)throw Error('Garmin-Activities-CSV enthält keine verwertbaren Aktivitäten mit Datum und Dauer');
 return result;
}
