# Compass Life 0.5.77.59.40.7 — Plateau Intelligence, Satzpausen und Fitdays-Segmente

Basis: genau der Full Build 0.5.77.59.40.6. Alle älteren Module, Daten und vorhandene Workouts bleiben erhalten.

## Funktionen

1. **Mögliches Leistungsplateau:** Im Coach, unter „↗ Plateau-Strategie · Satzpausen · Fitdays-Segmente“, werden vier **vollständig dokumentierte**, vergleichbare Trainingstage derselben Übung über mindestens 21 Tage betrachtet. Veränderungen von Last und Satzpause machen Vergleiche ggf. unzulässig. Ein Leistungsplateau ist **kein Nachweis** fehlenden Muskelwachstums.
2. **Strategiewechsel:** Liegen bei vergleichbaren Rücken-Workouts zu kurze gemessene Pausen vor, schlägt der nächste Coach-Plan versuchsweise 180 Sekunden Satzpause vor und berechnet die erwartete Trainingsdauer neu. Dieser neue Plan gilt erst nach bewusstem Start; Gewicht und vorhandene Logeinträge bleiben unverändert. Sonst werden je nach Datenlage erst Pausen erfassen, RIR-Reps, Erholungsphase/Deload, Wochenvolumen oder zeitlich begrenzte Übungsvariation empfohlen. Keine automatische Erhöhung von Gewichten oder Wochenvolumen.
3. **Echte Satzpause:** Im Guided Workout erscheint nach dem ersten bestätigten Satz optional „▶ Satz N beginnen“. Der Zeitpunkt wird im verschlüsselten Workout-Snapshot gespeichert. Beim Bestätigen des Satzes wird die Pause vom Ende des vorherigen Satzes bis zum **tatsächlich markierten Beginn** des folgenden Satzes protokolliert. Ohne solchen Marker wird **keine genaue Pause behauptet**. Ein bloßer Abstand zwischen zwei Bestätigungen enthält die Ausführung des zweiten Satzes.
4. **Rest Timer:** Die zuvor fest eingebauten mindestens 180 Sekunden entfallen. Der Timer verwendet die vorgeschriebene Pause und kann mit +1 oder +2 Minuten verlängert werden. Auf Reload gerettete Satzanfangsmarker bleiben gespeichert; es gibt keine zusätzliche GPS- oder Internetnutzung.
5. **Fitdays-Segmenttrends:** Ab sechs importierten segmentalen Messungen über ≥28 Tage: Median der ersten drei und letzten drei Tagesmessungen für rechter/linker Arm, Rumpf und Beine. Diese Werte sind Geräteschätzungen, nicht individuelle Wachstumsnachweise für Latissimus/Deltoideus. Keine automatische Lastanpassung aufgrund der Bioimpedanz.

## Grenzen und Evidenz

- 4 Sessions/21 Tage und 6 Tage/28 Tage Fitdays sind konservative **produktinterne Datenqualitätsregeln**, keine validierten medizinischen Schwellen.
- V-Taper bleibt Schwerpunkt Rücken und seitliche/hintere Schulter. Bei fehlenden RIR-/Pausen-/Fitdaysdaten wird nichts hinzuerfunden.
- Keine vollständige kausale Zuordnung von Muskelwachstum zu Übungen; eine statistisch belastbare N-of-1-Studie würde längere vergleichbare Phasen erfordern.
- Wissenschaftliche Referenzen: ACSM (Currier et al., 2026; PMID 41843416); Singer et al. (2024; PMID 39205815); AJCN Methodological Standards in Body Composition (2026; PMC13197919); RP Hypertrophy Help Center (June 2025); Fitbod Help Center (2026).

## Qualität

Automatische Suite + Worker-Syntaxprüfung per `npm run check`. Full Build ist Quellcode; Node/Vite-Dependencies sind nicht enthalten. GitHub Actions übernimmt den abschließenden Produktionsbuild und Deploy. Keine Vault-/D1-/Worker-Migration.
