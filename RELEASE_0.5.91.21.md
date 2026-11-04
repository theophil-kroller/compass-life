# Compass Life 0.5.91.21 · Körperübersicht & tagesgenaue Krafttrainingshistorie

**Basis:** 0.5.91.20.1 (inkl. GitHub-Pages-Workflow-Hotfix), im persönlichen Repo öffentlich hochladbare Source. Keine Änderungen an Vault-Schema oder Backend.

## UI
- Eine dynamische Smart-Tape-Körpersilhouette links und eine einzige ausgewählte Verlaufskurve rechts (mobil untereinander). Kein zweites Raster mit zwölf immer sichtbaren Umfangswerten.
- Andere Messstellen sind über die Silhouette oder einen kompakten aufklappbaren Auswahldialog erreichbar.
- Ergänzende Verhältniszahlen (WHtR, Schulter/Taille usw.) bleiben optional im Bereich **Weitere Proportionskennzahlen**. Die bestehende WHR-Referenzgrafik unter Fitdays-Kennzahlen bleibt unverändert.

## Tage & Regeneration
- Bereits vorhandene `completedAt`-Zeitstempel je bestätigtem Coach-Satz werden als zeitliche Wahrheit verwendet; neu bestätigte Sätze erhalten zusätzlich einen lokal ermittelten `completedDay`. `updatedAt` / späteres RIR-Feedback verschiebt einen ausgeführten Satz nicht.
- Fortgesetzte Workouts über mehrere Tage werden **in Ansichten rechnerisch** nach tatsächlichem Trainingstag aufgeteilt. Im Vault bleibt ein einziges unverändertes Workout mit allen Sätzen. Ein Training mit einem Satz am Vortag und zwei Sätzen am Folgetag erscheint als 1 + 2 Sätze. Nur am Abschlusstag gilt der tägliche Abschnitt als abgeschlossen.
- Berücksichtigt in Strength Insights / Muscle Map, RIR, Periodisierung, Plateauevidenz, V-Taper-Datenabdeckung, StrongLifts-Tendenzen und Life-Balance-Radar. Doppelzählung bei zusammenpassenden Garmin-Aktivitäten wird weiterhin unterdrückt.
- Vorhandene historische Coach-Sätze ohne `completedAt` können nicht verlässlich einem anderen Tag zugeordnet werden. Sie bleiben transparent mit dem ursprünglichen Starttag als Fallback; es werden keine künstlichen Ausführungszeitpunkte erzeugt.
- Keine Mutation/Neuaufteilung des verschlüsselten Journals. Keine übergriffige Änderung von Gewichtsprogressionen.

## Installation
- Patch über 0.5.91.20.1 hochladen, wobei relative Pfade einschließlich `.github/` erhalten bleiben. Der Full-Source-ZIP ist die vollständige Alternative.
- Wegen vorangegangener GitHub-Pages-Probleme bitte den tatsächlich erfolgreichen `Publish Compass Web`-Job prüfen. Release-Tests und `check:deploy` sind nicht dasselbe wie eine erfolgreiche Pages-Veröffentlichung.

## Tests und Status (04.11.2026)
- Neue Tageswechsel-/UI-Regressionstests: **9/9 bestanden**.
- Gezielt alte/neue Smart-Tape-/Strength-/Pages-Hotfix-Suite: **43/43 bestanden** (vor dem letzten Kompatibilitätsfix); alle durch den Vergleich eingeführten 8 Fehler wurden nach dem Fix beseitigt.
- `npm run check:deploy`: **33/33 bestanden**. Importgraph wurde erfolgreich geprüft.
- Vollständiger Vergleich gegen exakt den archivierten 0.5.91.20.1-Quellstand: **2.059/2.094** Tests bestanden, **35 historisch bekannte Fehler, kein zusätzlicher Fehler**. Die unveränderte Vorversion erreichte 2.050/2.085 mit **denselben 35** Fehlern. Der Mehrumfang beträgt 9 neue bestandene Tests.
- Kein lokaler Vite-Produktionsbuild durchgeführt, weil die npm-Abhängigkeiten in dieser Laufzeit nicht installiert sind. Ein erfolgreicher GitHub-Pages-Deploy wurde **nicht** behauptet.
