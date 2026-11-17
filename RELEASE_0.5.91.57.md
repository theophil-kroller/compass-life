# Compass Life 0.5.91.57 — Mobile Nutrition & V-Taper Forecast Scenarios

## Änderungen gegenüber 0.5.91.56

- **Mobile Ernährung:** Die Ernährungsübersicht und ihr Donut-/Analysebereich bleiben innerhalb der Displaybreite. Lange Tabellen und horizontale Detailinhalte können innerhalb ihres Containers gescrollt werden, statt rechts abgeschnitten zu werden.
- **V-Taper-Prognose:** Die 3-, 6-, 12- und 24-Monats-Szenarien sind auch während einer kurzen, aber ausreichend dokumentierten aktuellen Trainingsphase wieder sichtbar (frühe Vorausschau). Gewichtsverläufe vor Trainingsbeginn werden nicht zur Fortschreibung verwendet.
- **Hypothetischer Defizitrechner:** Stufen 0, 200, 300, 400, 500, 600, 700, 800 und 900 kcal/Tag sowie eine Option für den beobachteten Trend. Die Stufen können nur ausgewählt werden, wenn der daraus abgeleitete Energiezielwert die geschätzte Ruheenergie nicht unterschreitet. Die Langfristprognose wird abgeflacht und Gewichtsverluste sind begrenzt; die Szenarien sind keine Garantien.
- **Bestandsschutz:** Keine Migration und keine Änderung an vorhandenen Ernährungs-, Körpermaß-, Gewichts- oder Trainingsdaten. Der Regler verändert weder das Ernährungstagebuch noch das gespeicherte Kalorienziel.
- **Performance:** Die zusätzlichen Darstellungen betreffen nur die entsprechenden Insights-Ansichten, nicht den Start der Kernbereiche Heute/Inbox/Planen.

## Tests

- `npm run check:deploy`: 33/33 Release-Tests erfolgreich (in der Arbeitsumgebung).
- `node --test tests/*.test.mjs`: 2.318 bestanden, 66 bekannte Fehlschläge. Die Namen aller 66 Fehlschläge stimmen exakt mit 0.5.91.56 überein.
- Die neuen Tests decken eine ca. 21-tägige Trainingsphase, Prognosezeiträume, mobile Overflow-Regeln und die Defizitstufen bis 900 kcal ab.
- ZIP-Dateien wurden auf Integrität und korrekte Patch-Wiederherstellung gegenüber 0.5.91.56 geprüft.

Die lokale Vite-Produktionskompilierung wurde mangels installierter Abhängigkeiten nicht validiert; bitte GitHub Actions zur abschließenden Buildkontrolle verwenden.
