/** Compass 0.5.77.54: lightweight navigation metadata. No charts, vault or remote access. */
import {FINANCE_PANES} from './finance-preview.js';
export const FINANCE_TABS=[...FINANCE_PANES,
 {title:'Geldkreislauf',icon:'refresh-cw',text:'Bestätigte Vermögensbewegungen als interaktive Kreislaufgrafik'},
 {title:'Kontenflüsse',icon:'git-merge',text:'Bestätigte Eigenüberträge & Wege zu Depot/Krypto'},
 {title:'Pflicht & Luxus',icon:'target',text:'Eigene Einordnung von notwendigen, flexiblen und verzichtbaren Ausgaben'},
 {title:'Visual Lab',icon:'aperture',text:'Exotische Finanzdiagramme & Zeitvergleiche'},
 {title:'Buchungen',icon:'list',text:'Suchen und Kategorien korrigieren'},
 {title:'Prüfen',icon:'checkSquare',text:'Offene Kategorien bestätigen'}];
export const FINANCE_GROUPS=[
 {title:'Überblick',icon:'layers',panes:['Überblick']},
 {title:'Ausgaben',icon:'activity',panes:['Ausgaben','Pflicht & Luxus','Einnahmen','Cashflow','Sparpotenzial','Reisen']},
 {title:'Vermögen',icon:'folder',panes:['Portfolio','Konten']},
 {title:'Planung',icon:'target',panes:['Budget & Ziele','Fixkosten','Prognose']},
 {title:'Werkzeuge',icon:'settings',panes:['Buchungen','Prüfen','Visual Lab','Geldkreislauf','Kontenflüsse']}
];
export const financeGroupForPane=pane=>FINANCE_GROUPS.find(g=>g.panes.includes(pane))||FINANCE_GROUPS[0];
export const INSIGHT_TABS=[
 {id:'nutrition',label:'Ernährung',icon:'food',state:'live',subtitle:'Ernährungstagebuch · Tagesverlauf und geschätzte Kalorien'},
 {id:'touch',label:'Berührung & Nähe',icon:'heart',state:'live',subtitle:'Berührung & Nähe · persönliche Chronik'},
 {id:'habits',label:'Habits',icon:'checkSquare',state:'live',subtitle:'Routinen und Gewohnheiten im Verlauf'},
 {id:'timejournal',label:'Zeitjournal',icon:'clock',state:'live',subtitle:'Wofür du deine Zeit verwendest'},
 {id:'feelings',label:'Gefühlswelt',icon:'heart',state:'live',subtitle:'Deine emotionalen Check-ins – freiwillig und ohne Bewertung'},
 {id:'connections',label:'Zusammenhänge',icon:'spark',state:'live',subtitle:'Gefühle, Schlaf, Bewegung, Arbeitsbelastung und Erholung gemeinsam betrachten'},
 {id:'balance',label:'Life Balance Radar',icon:'compass',state:'live',subtitle:'Persönliche Zielnähe über mehrere Lebensbereiche'},
 {id:'sleep',label:'Schlaf',icon:'moon',state:'live',subtitle:'Schlafdauer, -konsistenz und nächtliche HRV'},
 {id:'energy',label:'Body Battery',icon:'bolt',state:'live',subtitle:'Energiereserven, Tageskurven und langfristige Verläufe'},
 {id:'stress',label:'Stress',icon:'activity',state:'live',subtitle:'Garmin-Stress, Belastungszonen und Tagesmuster'},
 {id:'activity',label:'Aktivität',icon:'heart',state:'live',subtitle:'Garmin-Schritte und Aktivitätsdateien sowie Health-Connect-Training'},
 {id:'worktime',label:'Arbeitszeit',icon:'clock',state:'live',subtitle:'Arbeitszeit, Überstunden, Zeitausgleich & Urlaub'},
 {id:'focus',label:'Produktivität',icon:'target',state:'live',subtitle:'Arbeitsphasen, Meetings und Gesundheitsdaten · lokale Zusammenhänge'},
 {id:'body',label:'Körper',icon:'layers',state:'live',subtitle:'Fitdays-Report · Körpergewicht, Körperfett und Segmente'},
 {id:'places',label:'Orte',icon:'compass',state:'live',subtitle:'Weltkarte, Aufenthaltsverlauf und Schlaf nach Ort · lokal im Vault'},
 {id:'explore',label:'Explore',icon:'spark',state:'live',subtitle:'Eigene Zusammenhänge und explorative 95%-Konfidenzbänder'},
 {id:'sources',label:'Datenquellen',icon:'settings',state:'live',subtitle:'Garmin, Fitdays und Health Connect · Import & Verbindungen'}
];
export const INSIGHT_PERIODS=[['7','7 Tage'],['28','4 Wochen'],['90','90 Tage'],['365','1 Jahr'],['all','Alles']];
