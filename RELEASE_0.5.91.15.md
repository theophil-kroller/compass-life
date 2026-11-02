# Compass Life 0.5.91.15 – Equipment-aware V-Taper Progression

**Ausgangsbasis:** GitHub `theophil-kroller/compass-life`, Branch `main`, Version `0.5.91.14`, Commit `65dd5ca2374d92832b767418755999d9e8a0acfb`, geprüft am 02.11.2026. Es werden keine vorhandenen Trainingseinheiten, Garmin-Daten, bestätigten Sätze, RIR, Plateau- oder Zyklusdaten geändert.

## Neue Funktionen

- `client/src/strength-equipment-v059115.js`: konfigurierbares Equipmentprofil mit vier Scheiben je 1 / 1,5 / 2 / 2,5 kg, zwei Griffen und symmetrischer Beladung. Griffgewicht = unbekannt (`null`) bis zur expliziten Eingabe. Optional Platz- und Gewichtsgrenzen; zusätzliche Sets als inaktive Reserve im Schema vorbereitet.
- **Alle realen Gewichte:** Für jede Scheibengröße wird höchstens `floor(verfügbare Stückzahl / (2 × Anzahl gleichzeitig benötigter Hanteln))` auf *jeder Seite pro Hantel* berücksichtigt. Durch vollständige Kombinationen aller Plattensorten und Zusammenfassen gleich schwerer Varianten entstehen die möglichen Gewichte. Für zwei identische Kurzhanteln mit vier Scheiben je Sorte sind die möglichen Scheibengewichte pro Hantel 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 und 14 kg; 13 kg ist mit diesen Scheiben und zwei gleichzeitig symmetrischen Hanteln nicht verfügbar. Für eine einzelne Kurzhantel ist der kombinierte maximale Scheibenbestand 28 kg (vor Berücksichtigung von Griff, Verschlüssen und Platz).
- **7 → 8 kg:** 7 kg = je Seite 2,5 + 1 kg; 8 kg = je Seite 2,5 + 1,5 kg. Griffmasse ist zusätzlich anzusetzen, wenn bekannt. Die Angabe `weightKg` aus früheren zuhause geführten Compass-Sätzen wird als dokumentierte *Scheibenmasse* behandelt; aus reinen Garmin-Aktivitäten wird eine ungesicherte Gewichtsdefinition nicht erraten.
- **RIR und Double Progression:** Die vorhandene `rirProgression46` bleibt die Leistungsgrundlage. Nur nach bestätigten Sätzen am oberen Wiederholungsziel, dokumentierter RIR-Reserve und ohne Erholungs-/Deload-Alarm ist ein Lastsprung möglich. Zusätzlich werden die tatsächlich erreichbare nächste Gewichtsstufe sowie Richtwerte je Übung geprüft (Lateral Raise 12 %, moderate Presses/Lunges 15 %, größere Zug-/Beinübungen 18 %). Das sind transparente konservative Coaching-Heuristiken, keine physiologischen Grenzwerte. Größere Schritte ⇒ Gewicht halten und Wiederholungen kontrolliert ausbauen.
- **Visualisierung:** Ein für alle Gewichte dynamisch aus den Scheiben generiertes, barrierebeschriftetes Inline-SVG zeigt Griff, identische Scheiben links/rechts und Gewichtstexte. Kompakt in Coach und Guided Workout, mit ausklappbarer Erklärung und alternativen real baubaren Stufen; Mobil-Styles auf 560 px. Keine externen Bilddateien, kein eager-load.
- **Workout:** Die +/−-Tasten und die Gewichtseingabe unterstützen nur echte Kombinationen der aktuell vorhandenen Kurzhantelscheiben; im Gym und bei StrongLifts bleibt die bestehende Laststeuerung unangetastet. Ein angenommenes Vorschlagsgewicht wird **nicht** als absolvierter Satz gespeichert: nur ein expliziter Satz-Tap bestätigt die Last.
- **Profileditor:** Im vorhandenen, aufklappbaren Bereich „Equipmentdetails“ können Scheibenstückzahlen, Griffgewicht und max. Scheiben pro Seite geändert werden. Einstellungen sind lokal auf dem Gerät gespeichert; keine Behauptung einer cloudübergreifenden Sync-Funktion. Zukünftiges zweites Set noch nicht automatisch hinzugerechnet.

## Offene Annahmen / fachliche Grenzen

- Griff- und Verschlussgewicht sind derzeit nicht gemessen. `null` bedeutet ausdrücklich „unbekannt“, nicht Nullgewicht.
- Max. Stangenlänge, Verschlussbreite, sichere Belastbarkeit und das noch nicht gelieferte zweite Set sind unbekannt. Vor Übungsbeginn mechanische Fixierung/Sicherheit prüfen.
- Die vorhandenen älteren Coach-Daten besitzen keinen separaten `plateKg`/`handleKg`-Datensatz. Für Compass-geführte Home-Sätze gilt die bisherige Implementationssemantik „Scheibengewicht“. Unsicher importierte Garmin-Gewichte werden nicht automatisch zur Gerätebeladung erklärt.
- Es werden keine neuen Trainingssätze, Gewichte, Progressionsbestätigungen oder StrongLifts-Varianten erzeugt. Die bestehende V-Taper-/Plateau-/Recovery-/Deload-Steuerung bleibt bestehen.

## Qualitätssicherung

- 14/14 spezifische Equipment-/Visualisierungstests bestanden.
- 33/33 bestehende Deployment-/Importgraph-Tests bestanden (Importgraph: 269 Module, keine fehlenden relativen Importe).
- 2.002/2.037 Gesamttests bestanden: dieselben 35 historischen Testfehler wie 0.5.91.14, **keine neuen Testfehler**.
- `npm run build` **nicht erfolgreich**: `vite: not found` – npm-Dependencies sind in dieser Laufzeit nicht installiert, kein erfolgreiches kompiliertes `dist`. Dieser Download ist daher ein vollständiger, getesteter **Quellcode-Build**, kein erfolgreich kompilierter Web-Produktionsbuild. GitHub Actions muss nach dem Upload die Vite-Produktion kompilieren.
- Kein physischer Hantelaufbau, kein Hardware- oder realer Mobilbrowser-Test durchgeführt. Die SVG- und Responsive-Checks sind Quell-/Einheitstests.

## Installation

Nur den Patch auf die exakt genannte Basisversion `0.5.91.14` anwenden, oder das vollständige ZIP über den Quellstand legen. Vorherige persönliche Trainingsdaten sind nicht im Release enthalten. Nach GitHub-Deploy Vite-Workflow auf `success` prüfen.
