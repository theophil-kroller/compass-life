/** Compass 0.5.91.41 · One grounded, motivational sentence per classified exercise.
 * Editorial cue, not an individual hypertrophy or fat-loss prediction.
 * Shared by workout preview, optional exercise, library and progression chart.
 */
import {EXERCISE_ANATOMY} from './strength-anatomy-v57737.js';
const special=Object.freeze({
 'lateral-raise':'Seitliche Schultern lassen deine Schulterlinie breiter wirken und verstärken den 3D-Effekt der V-Form.',
 'dumbbell-lateral-raise':'Seitliche Schultern lassen deine Schulterlinie breiter wirken und verstärken den 3D-Effekt der V-Form.',
 'cable-lateral-raise':'Seitliche Schultern lassen deine Schulterlinie breiter wirken und verstärken den 3D-Effekt der V-Form.',
 'reverse-fly':'Die hinteren Schultern gewinnen Kontur und geben deinem Oberkörper mehr dreidimensionale Tiefe.',
 'cable-rear-delt-fly':'Die hinteren Schultern gewinnen Kontur und geben deinem Oberkörper mehr dreidimensionale Tiefe.',
 'face-pull':'Hintere Schultern und oberer Rücken ergänzen eine rundere, ausgeglichenere Schulterkontur.',
 'pullup':'Klimmzüge trainieren deinen Latissimus – entscheidend für einen optisch breiten oberen Rücken.',
 'assisted-pullup':'Unterstützte Klimmzüge entwickeln deinen Latissimus auf dem Weg zu einer ausgeprägteren V-Form.',
 'lat-pulldown':'Der Latzug entwickelt deinen Latissimus und kann deinen oberen Rücken breiter wirken lassen.',
 'ab-wheel-kneeling':'Der Ab-Wheel stärkt deine Rumpfmuskulatur und Körperkontrolle; lokales Bauchfett verbrennt er nicht.',
 'plank':'Ein stabiler Rumpf unterstützt kontrolliertes Training – eine kleinere Taille entsteht nicht durch lokales Fettverbrennen.',
 'dead-bug':'Der Dead Bug stärkt die Rumpfkontrolle, damit du deine großen Zug- und Druckübungen stabil ausführen kannst.',
 'cable-crunch':'Du stärkst deine geraden Bauchmuskeln; die Taillenweite hängt zusätzlich von deiner Körperzusammensetzung ab.',
 'crunch':'Du stärkst deine geraden Bauchmuskeln; eine schmalere Taille entsteht nicht durch gezieltes Bauchfett-Training.',
 'pallof-press':'Der Pallof Press verbessert deine Rumpfstabilität und hilft, Zug- und Druckübungen kontrolliert auszuführen.',
 'cable-woodchop':'Kontrollierte Rotation stärkt deinen Rumpf und die Kraftübertragung bei anderen Übungen.',
 'goblet-squat':'Starke Beine und eine stabile Körpermitte bilden das Fundament für deinen gesamten athletischen Aufbau.',
 'squat':'Starke Beine und eine stabile Körpermitte bilden das Fundament für deinen gesamten athletischen Aufbau.'
});
/** Returns no text for unknown IDs, to avoid invented muscle-specific promises. */
export function vtaperBenefit141(id){
 const name=String(id||'');
 const roles=EXERCISE_ANATOMY[name];
 if(!roles)return null;
 if(special[name])return special[name];
 const a=roles.primary;
 const has=id=>a.includes(id);
 if(has('deltoid_side'))return 'Seitliche Schultern unterstützen eine breitere Schulterlinie – eine wichtige Komponente deiner V-Form.';
 if(has('deltoid_rear'))return 'Hintere Schultern formen die Schulterkontur und ergänzen den dreidimensionalen Oberkörper-Look.';
 if(has('latissimus'))return 'Dein Latissimus trägt zur Rückenbreite bei und unterstützt so die V-förmige Silhouette.';
 if(has('pectoral_upper'))return 'Der obere Brustbereich gibt deinem Oberkörper mehr Kontur und ergänzt die Schulterbreite.';
 if(has('deltoid_front'))return 'Starke vordere Schultern ergänzen die gesamte Schulterentwicklung – bei ausgewogener Belastung.';
 if(has('pectoral_lower'))return 'Brustmuskulatur sorgt für mehr Kontur im Oberkörper und ergänzt Rücken- und Schultertraining.';
 if(has('rhomboids')||has('trapezius_mid')||has('trapezius_upper'))return 'Ein kräftiger oberer Rücken unterstützt eine aufrechte Haltung und betont deinen Oberkörper.';
 if(has('rectus_abdominis')||has('obliques'))return 'Ein stabiler Rumpf erleichtert kontrollierte Belastung; gezielte Fettabnahme am Bauch ist nicht möglich.';
 if(has('biceps')||has('brachialis'))return 'Kräftigere Oberarme ergänzen die V-Silhouette und unterstützen deine Zugübungen.';
 if(has('triceps'))return 'Kräftigere Trizeps ergänzen die Schulter- und Armkontur und unterstützen deine Druckübungen.';
 if(has('forearm_flex')||has('forearm_ext'))return 'Mehr Griff- und Unterarmkraft unterstützt deine Zugübungen und damit langfristig den Rückenaufbau.';
 if(has('hamstrings')||has('glute_max')||has('quadriceps')||has('glute_med')||has('adductors'))return 'Unterkörperkraft und Stabilität schaffen eine belastbare Basis für deinen gesamten athletischen Fortschritt.';
 if(has('calves_gastro')||has('calves_soleus')||has('tibialis'))return 'Starke Unterschenkel ergänzen eine ausgewogene athletische Gesamtform.';
 if(has('erector_spinae'))return 'Ein kräftiger Rückenstrecker unterstützt Stabilität und Technik bei deinen Grundübungen.';
 return 'Diese Übung ergänzt deinen ausgewogenen, langfristigen athletischen Aufbau.';
}
