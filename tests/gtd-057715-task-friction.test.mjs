import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {taskFriction,stripTaskFriction,taskNoteWithFriction,frictionSummary} from '../client/src/task-friction-v57715.js';
import {taskSupportPrompt} from '../client/src/task-gpt-handoff-v57712.js';
import {retainWaitingLink,waitingSourceId,visibleWaitingNote} from '../client/src/waiting-followup-v57715.js';
const origin='11111111-1111-4111-8111-111111111111';
test('0.5.77.15 resistance independent of time/energy and opt-in reason',()=>{
 const note=taskNoteWithFriction('Fully Rose Co. antworten',{overcoming:'high',effort:'low',blocker:'shame'});
 assert.deepEqual(taskFriction(note),{overcoming:'high',effort:'low',blocker:'shame'});
 assert.equal(stripTaskFriction(note),'Fully Rose Co. antworten');
 assert.match(frictionSummary(note),/Überwindung: Hoch/);
 assert.match(frictionSummary(note),/Energieaufwand: Gering/);
 assert.match(frictionSummary(note),/Scham/);
 const blank=taskNoteWithFriction('Nur eine Notiz',{overcoming:'',effort:'',blocker:''});
 assert.equal(blank,'Nur eine Notiz');
 assert.deepEqual(taskFriction(blank),{overcoming:'',effort:'',blocker:''});
});
test('0.5.77.15 friction marker survives edits and waiting-for origin marker stays last',()=>{
 const existing='Antwort abwarten\n[Compass-WaitingFor:'+origin+']';
 const inserted=retainWaitingLink(existing,taskNoteWithFriction('Etwas Neues',{overcoming:'medium',effort:'high',blocker:'unclear'}));
 assert.equal(waitingSourceId({note:inserted}),origin);
 assert.equal(stripTaskFriction(visibleWaitingNote(inserted)),'Etwas Neues');
 assert.equal(taskFriction(inserted).blocker,'unclear');
 const reEdited=retainWaitingLink(inserted,taskNoteWithFriction('Geklärt',{overcoming:'low',effort:'low',blocker:''}));
 assert.equal(waitingSourceId({note:reEdited}),origin);
 assert.equal(taskFriction(reEdited).overcoming,'low');
 assert.equal((reEdited.match(/Compass-TaskFriction/g)||[]).length,1);
});
test('0.5.77.15 GPT prompt uses the reflection meaning, not encoded note marker',()=>{
 const prompt=taskSupportPrompt({title:'Geld nachfragen',note:taskNoteWithFriction('Sehr lange nicht gemeldet',{overcoming:'high',effort:'low',blocker:'shame'})},'Privat');
 assert.match(prompt,/Scham \/ lange nicht gemeldet/);
 assert.match(prompt,/Überwindung: Hoch/);
 assert.match(prompt,/sehr kleinen ersten Schritt/);
 assert.doesNotMatch(prompt,/Compass-TaskFriction/);
});
test('0.5.77.15 task inspector reflects optional fields and persists only on Save',()=>{
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(source,/taskOvercoming/);
 assert.match(source,/taskEffort/);
 assert.match(source,/taskBlocker/);
 assert.match(source,/note:retainWaitingLink\(existing.note,taskNoteWithFriction/);
 assert.match(source,/stripTaskFriction\(visibleWaitingNote\(t.note\)\)/);
 assert.match(source,/Compass-TaskFriction|taskFriction\(t.note\)/);
});
