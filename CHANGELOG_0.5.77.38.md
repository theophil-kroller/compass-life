# Compass Life 0.5.77.38 · Premium Muscle Map

## UI / Training
- Neues, großes dunkles Krafttrainingsdashboard. SVG-Muskelkarte vorne und hinten parallel; warmes Gelb/Orange/Rot, neutrale Körperoberflächen in Anthrazit.
- 25 anatomische Regionen bleiben semantisch und per Fokus/Tooltip zugänglich.
- Kompakte Trainings-Heatmap; jedes Datum wird gezeigt, fehlende Garmin-Tage nicht als bestätigte trainingsfreie Tage ausgelegt.
- Kennzahlen: dokumentierte Kraftsätze, tatsächliche Wdh. soweit erfasst, Gewicht × Wiederholungen, dokumentierte Trainingszeit, Radfahrten/Minuten.
- Eigene anatomische Rangliste mit Kraft-/Radfilter, keine Umrechnung der Radfahrminuten in Kraftsätze.
- Editor nach der Muskelkarte platziert; Wiederholungen und Gewichte bleiben bearbeitbar.

## Behobene Vorversion
- Ursache des fehlgeschlagenen Deploys 0.5.77.37.1: Testdatei referenzierte fälschlich `/mnt/data/compass-pill-0577371/...`. Mit Repository-relativen Testpfaden behoben.
- kcal-Hinweise als direkte, rechtsbündige Pille in `client/src/nutrition-history-v577.js`; breiter `details`-Block entfernt. Nährstoff- und kcal-Werte bleiben erhalten.
- Automatische Gewicht/Wdh.-Vorschläge einer Übung bereits beim Öffnen des Editors (nur für bisher leere Felder).

## Teststatus
- 16/16 gezielte Tests bestanden; Full Build und produktive UI in GitHub Actions prüfen.
