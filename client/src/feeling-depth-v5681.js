/** Compass 0.5.68.1: voluntary emotion vocabulary and reflective context.
 * Vocabulary is original and curated; not a reproduction of third-party word lists.
 * Intensity and emotional nuance are independent dimensions.
 */
export const FEELING_DEPTH=Object.freeze({
 joy:[['Optimismus',['Inspiriert','Hoffnungsvoll','Zuversichtlich','Offen']],['Interesse',['Neugierig','Fasziniert','Aufmerksam','Motiviert']],['Lebensfreude',['Verspielt','Ausgelassen','Belebt','Erleichtert']],['Erfüllung',['Dankbar','Stolz','Zufrieden','Erfüllt']]],
 calm:[['Gelassenheit',['Entspannt','Geerdet','Zentriert','Gelassen']],['Sicherheit',['Geborgen','Sicher','Stabil','Getragen']],['Frieden',['Friedlich','Versöhnt','Still','Im Einklang']]],
 sadness:[['Abschied',['Wehmütig','Trauernd','Sehnsüchtig','Verlustbewusst']],['Enttäuschung',['Bedrückt','Enttäuscht','Mutlos','Niedergeschlagen']],['Berührung',['Gerührt','Melancholisch','Nachdenklich','Verletzlich']]],
 fear:[['Unsicherheit',['Unsicher','Zögerlich','Nervös','Besorgt']],['Wachsamkeit',['Vorsichtig','Alarmiert','Wachsam','Verunsichert']],['Bedrohung',['Furchtsam','Erschrocken','Ängstlich','Überfordert']]],
 anger:[['Reizung',['Genervt','Gereizt','Ungeduldig','Überdrüssig']],['Grenzen',['Verletzt','Empört','Aufgebracht','Abgegrenzt']],['Frustration',['Frustriert','Enttäuscht','Verärgert','Ungerecht behandelt']]],
 affection:[['Verbundenheit',['Verbunden','Nah','Zugehörig','Geborgen']],['Zärtlichkeit',['Zärtlich','Liebevoll','Wärmend','Innig']],['Anziehung',['Angezogen','Verliebt','Begehrend','Voller Zuneigung']]]
});
export const FEELING_OBSERVATIONS=Object.freeze({
 body:['Erschöpft','Müde','Angespannt','Entspannt','Energiegeladen','Warm','Unruhig','Körperlich erregt'],
 needs:['Ruhe','Rückzug','Nähe','Verbindung','Bewegung','Raum für mich','Spiel','Intimität'],
 impulses:['Süßes essen','Rausgehen','Reden','Ablenken','Bewegen','Kuscheln','Sexualität','Pause machen']
});
export function feelingFamilies(id){return FEELING_DEPTH[id]||[];}
export function validFeelingDetail(id,detail={}){
 if(!detail || typeof detail!=='object'||Array.isArray(detail))return {};
 const group=feelingFamilies(id).find(g=>g[0]===detail.family);
 if(!group)return {};
 return {family:group[0],...(group[1].includes(detail.nuance)?{nuance:detail.nuance}:{})};
}
export function setFeelingDetail(draft,id,{family,nuance}={}){
 if(!Object.hasOwn(draft?.selected||{},id))throw Error('Gefühl zuerst auswählen.');
 const previous=draft.details?.[id]||{};
 const valid=validFeelingDetail(id,{family:family||previous.family,nuance:nuance||((family&&family!==previous.family)?'':previous.nuance)});
 if(!valid.family)throw Error('Unbekannte Gefühlsfamilie.');
 if(nuance&&!valid.nuance)throw Error('Unbekannte Gefühlsnuance.');
 return {...draft,details:{...(draft.details||{}),[id]:valid}};
}
export function toggleFeelingObservation(draft,kind,word){
 if(!Object.hasOwn(FEELING_OBSERVATIONS,kind)||!FEELING_OBSERVATIONS[kind].includes(word))throw Error('Unbekannte Wahrnehmung.');
 const old=Array.isArray(draft?.observations?.[kind])?draft.observations[kind]:[];
 const values=old.includes(word)?old.filter(w=>w!==word):[...old,word];
 return {...draft,observations:{...(draft.observations||{}),[kind]:values}};
}
export function normalizeFeelingObservation(input){const out={};for(const [kind,allowed] of Object.entries(FEELING_OBSERVATIONS)){
  const values=input?.[kind];if(values!==undefined&&(!Array.isArray(values)||values.some(w=>!allowed.includes(w))))throw Error('Wahrnehmungen prüfen.');
  if(Array.isArray(values)&&values.length)out[kind]=[...new Set(values)];
 }return out;}
export function feelingMeaning(id){const texts={
 joy:'Freude kann auf etwas hinweisen, das dich belebt, berührt oder dir wichtig ist. Was tut dir gerade gut?',
 calm:'Ruhe kann zeigen, dass du dich sicher oder im Gleichgewicht fühlst. Was unterstützt diesen Zustand?',
 sadness:'Trauer kann mit einem Verlust oder etwas Bedeutsamem verbunden sein. Was braucht Raum oder Anerkennung?',
 fear:'Angst kann deine Aufmerksamkeit auf Unsicherheit oder Schutzbedürfnisse lenken. Was würde dir Orientierung geben?',
 anger:'Wut kann darauf hinweisen, dass eine Grenze oder ein Bedürfnis berührt wurde. Was war gerade zu viel?',
 affection:'Zuneigung kann von Verbundenheit und Nähe erzählen. Was möchtest du davon pflegen oder ausdrücken?'
 };return texts[id]||'';}
export function intensityPresence(n){return n<=2?'Sehr leise wahrnehmbar':n<=4?'Leicht spürbar':n<=6?'Deutlich präsent':n<=8?'Nimmt viel Raum ein':'Sehr intensiv und vereinnahmend';}
