import {taskFriction,stripTaskFriction,frictionSummary} from './task-friction-v57715.js';
/** Explicit, human-controlled task-to-ChatGPT handoff. No network call or silent sharing. */
export function taskSupportPrompt(task={},projectTitle=''){
 const title=String(task.title||'').trim().slice(0,200);
 if(!title)throw Error('Aufgabe ohne Titel kann nicht exportiert werden.');
 const note=stripTaskFriction(String(task.note||'')).replace(/\n?\[Compass-WaitingFor:[0-9a-f-]{36}\]\s*$/i,'').trim().slice(0,2000);
 const reflection=frictionSummary(task.note);
 const project=String(projectTitle||'').trim().slice(0,180);
 return `Ich habe eine Aufgabe, die ich immer wieder vor mir herschiebe. Bitte sei mein freundlicher, pragmatischer GTD-Klärungspartner.\n\nAUFGABE: ${title}\n${project?`PROJEKT: ${project}\n`:''}${note?`VORHANDENE NOTIZ: ${note}\n`:''}${reflection?`VON MIR MARKIERTE HÜRDE: ${reflection}\n`:''}\nHilf mir in einem kurzen Gespräch, den nächsten konkreten Schritt zu finden. Frage zuerst, woran es gerade hakt oder welche Informationen fehlen. Stelle jeweils nur EINE kurze, leicht beantwortbare Frage und lass mich auch per Sprache frei antworten. Nimm eine mögliche Hürde ernst, ohne Scham oder Überwindung als Charakterfehler zu bewerten. Schlage bei hoher Überwindung einen sehr kleinen ersten Schritt vor, auch wenn der eigentliche Energieaufwand gering ist. Gib keine langen allgemeinen Tipps und erfinde keine Fakten, Beträge, Zusagen, Adressen oder bisherigen Kontakte.\n\nWenn es um eine Kontaktaufnahme geht, hilf mir, die wichtigsten Fakten zu sortieren und dann eine kurze, höfliche, versandfertige Nachricht oder E-Mail zu entwerfen. Lass unbestätigte Details als Platzhalter stehen. Danach frage mich nach dem kleinsten nächsten Schritt, mit dem ich die Aufgabe wirklich abschließen kann. Schreibe die Nachricht nicht automatisch ab und sende nichts selbst.\n\nBeginne bitte mit deiner ersten konkreten Frage.`;
}
