// Compass 0.5.0 - deterministic, editable personal ideas. Stored only in encrypted local vault.
export const STARTER_IDEAS = Object.freeze([
  {id:'starter-walk',title:'Spaziergang im Grünen',emoji:'🌳',weather:'any',energy:'low',minutes:45,range:'near'},
  {id:'starter-sauna',title:'Sauna',emoji:'🧖',weather:'any',energy:'low',minutes:120,range:'near'},
  {id:'starter-reading',title:'In Ruhe lesen',emoji:'📖',weather:'rain',energy:'low',minutes:45,range:'home'},
  {id:'starter-thermal',title:'Therme',emoji:'♨️',weather:'rain',energy:'low',minutes:180,range:'trip'},
  {id:'starter-bike',title:'Radtour',emoji:'🚴',weather:'sun',energy:'medium',minutes:150,range:'near'},
  {id:'starter-hike',title:'Wanderung',emoji:'🥾',weather:'sun',energy:'high',minutes:240,range:'trip'},
  {id:'starter-dance',title:'Tanzen',emoji:'💃',weather:'any',energy:'medium',minutes:120,range:'near'},
  {id:'starter-kampfsport',title:'Kampfsport',emoji:'🥷',weather:'any',energy:'high',minutes:90,range:'near'},
  {id:'starter-culture',title:'Museum oder Ausstellung',emoji:'🏛️',weather:'rain',energy:'medium',minutes:150,range:'near'},
  {id:'starter-friends',title:'Freunde treffen',emoji:'☕',weather:'any',energy:'low',minutes:120,range:'near'},
]);
const climates=['any','sun','rain'],energies=['low','medium','high'],ranges=['home','near','trip'];
export function validRecoveryIdea(i){
 return Boolean(i&&typeof i.id==='string'&&/^(starter-[a-z-]+|idea-[0-9a-f-]{36})$/i.test(i.id)&&
 typeof i.title==='string'&&i.title.trim().length>=1&&i.title.length<=90&&
 typeof i.emoji==='string'&&i.emoji.length<=12&&climates.includes(i.weather)&&energies.includes(i.energy)&&ranges.includes(i.range)&&
 Number.isInteger(i.minutes)&&i.minutes>=15&&i.minutes<=1440);
}
export function allRecoveryIdeas(state){
 const removed=new Set(Array.isArray(state?.hiddenStarterIdeas)?state.hiddenStarterIdeas:[]);
 const starters=STARTER_IDEAS.filter(x=>!removed.has(x.id));
 const custom=Array.isArray(state?.recoveryIdeas)?state.recoveryIdeas.filter(x=>validRecoveryIdea(x)&&x.id.startsWith('idea-')):[];
 return [...custom,...starters];
}
export function recoveryWeather(label){
 if(typeof label!=='string'||!label.trim())return 'unknown';
 return /regen|schauer|gewitter|schnee|nebel/i.test(label)?'rain':'sun';
}
// Unknown weather never pretends to be sunshine. Filter only when a forecast exists.
export function scoreRecoveryIdeas(ideas,{weather='unknown',minutes=180,energy='medium',range='trip'}={}){
 const energyRank={low:1,medium:2,high:3},rangeRank={home:1,near:2,trip:3};
 return (ideas||[]).filter(validRecoveryIdea).filter(i=>i.minutes<=minutes&&energyRank[i.energy]<=energyRank[energy]&&rangeRank[i.range]<=rangeRank[range]&&
   (weather==='unknown'||i.weather==='any'||i.weather===weather))
  .sort((a,b)=>{const score=i=>(i.weather===weather?2:0)+(i.energy===energy?1:0);return score(b)-score(a)||a.minutes-b.minutes||a.title.localeCompare(b.title,'de');});
}
