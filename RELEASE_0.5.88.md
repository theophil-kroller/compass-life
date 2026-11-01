# Compass Life 0.5.88 · Integrated Coach Intelligence

## Ausgangsstand

Exakter GitHub-Ausgangscommit: `01d002dfc1277d35c9df3bfcce757f7dd31e06bd` (Compass 0.5.87). Keine neuen konkurrierenden Trainings- oder Lebensmitteljournale.

## Tatsächlich implementiert

- **Protein Intelligence:** Tagesprotein aus dem bestehenden Ernährungsjournal und einmaligen Einträgen; unbekannte Mengen bleiben `null` statt 0. Anfangsziel 150 g, bei geeigneter Fitdays-Messung orientierend rund 1,7 g/kg (auf 5 g gerundet), manuell 60–250 g. Teilbilanz, Quellen-/Schätzhinweise, Heute-Fortschritt, 14-Tage-Balken und 30-Tage-Einsicht in Ernährung; 16:8/18:6/20:4/flex sowie manuelle Körperumfänge.
- **Open Food Logging:** einmalige Mahlzeit ohne neuen Stammdatensatz in `nutritionJournal.entries`, alternativ wiederverwendbares `nutritionJournal.customFoods`; manuelle Makros und korrigierbare Nahrungseinträge; Prompt/validiertes `compass_open_food_v1` mit Bestätigungsdialog, Quelle und Annahmen.
- **V-Taper:** ergänzt in bestehenden Strength Insights gemessene Fitdays-Gewichte, BIA-Körperfett als Schätzung, manuelle Schulter-/Taillenrelation, bestätigte Trainingstage; 3/6/12/24-Monats-Horizonte. Breit markierte **Planungsszenarien nur für Gewicht**, und nur bei mindestens acht dokumentierten Punkten über 45 Tage. Keine künstliche Prognose für Körperfett/Muskelmasse; keine Scheingenauigkeit.
- **StrongLifts optional:** Workout A (Squat/Bench/Row 5×5), B (Squat/Overhead Press 5×5, Deadlift 1×5); A/B nach bestätigtem Abschluss, nicht nach bloßem Öffnen; individuelle aktuelle Startgewichte, Mikrosteigerungen, Aufwärmsätze, bargewichtssensitiver Scheibenrechner, variable Pausen, Deload/Plateau-Vorschläge ohne erzwungene Laständerung, Schutz bei Schmerzen/HWS/Rücken, geschätztes 1RM als Hilfsfunktion. Eigene Daten in vorhandenem `strengthJournal` und `strengthGuidedSessions`, kein separates Log.
- **Verknüpfung:** Vorhandene Coach-Garmin-Historie, Primär-/Sekundärmuskelbelastung, RIR und Fortschrittslogik werden weiterverwendet. Bereits stark belastete Muskelgruppen werden bei Heimübungen vorsichtiger gewählt. Heimtraining bleibt 25 Minuten V-Taper-Standard; StrongLifts bleibt opt-in Studio.
- **Persistenz:** Bestehende Sync-Merges für `nutritionJournal` und `strengthJournal` nehmen neue Einstellungen, Maße und Einmalmahlzeiten verlustarm mit.

## Ehrlich dokumentierte Grenzen

- Kein integrierter Foto-Upload, Foto-Speisekartenparser, Barcode-Lookup, Sprachimport oder privater Vergleichsfoto-Workflow in diesem Release.
- Keine klinisch interpretierbare 24-Monats-Körperrekompositionsprognose, keine extrapolierten Körperfett-/Muskelmassewerte und kein verifizierter individueller V-Taper-Score. Gewichtsszenarien sind Planungshilfen, keine statistisch validierten Konfidenzintervalle.
- Der Scheibenrechner arbeitet mit einem allgemeinen Studio-Inventar. Individuell erfasste Scheibenbestände wären ein Folgefeature. Das e1RM ist eine mathematische Hilfsfunktion, noch keine eigene Verlaufsgrafik.
- Die historischen Bestleistungen werden nicht als heutige Startgewichte gesetzt. Schmerzen führen nicht zu automatischer Steigerung; Nutzer entscheidet über Last und Trainingspause.
- Das neue GPT-Format für einmalige Mahlzeiten ist nur ein **manueller** Import mit Bestätigung, keine automatische Online-Nährwertrecherche.

## Tests in dieser Umgebung

- `node --test tests/compass-0588-integrated-coach.test.mjs`: 18/18 bestanden.
- `npm run test:release`: 33/33 bestanden.
- `node scripts/check-import-graph.mjs`: 260 Module, keine fehlenden relativen Importe.
- `npm test`: 1836/1871 bestanden; exakt dieselben **35 historischen Fehler** wie der unveränderte 0.5.87-Ausgangsstand (1818/1853). Kein neu eingeführter Ausfall.
- JS-Syntaxchecks der betroffenen Kerndateien bestanden.
- **Vite-Produktionsbuild NICHT ausführbar in dieser Umgebung:** `node_modules` fehlt, `npm install --ignore-scripts --no-audit --no-fund --prefer-offline --fetch-retries=0` scheiterte mit `EAI_AGAIN registry.npmjs.org/body-muscles`. Daher kein falsches Produktions-Build-OK; GitHub Actions muss `npm ci && npm run build` ausführen.

## Installation

PATCH nur über den unveränderten Quellstand von Commit `01d002df...` entpacken (relative Pfade überschreiben) oder FULL SOURCE als vollständigen Quellstand hochladen. ZIPs enthalten **keine echten Nutzer-/Gesundheitsdaten**. Danach den CI-Produktionsbuild prüfen und erst dann deployen.
