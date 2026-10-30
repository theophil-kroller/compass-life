# Compass Life .25.24 — Dynamischer Körpervergleich und Import-Check

- Gewicht, Körperfett %, Fettmasse, fettfreie Masse, BMI und vorhandene Fitdays-Muskelmasse werden bei jedem Aufruf aus dem jüngsten tatsächlich gemessenen Eintrag des gewählten Zeitraums neu berechnet.
- Vergleichsillustrationen bleiben feste, als illustrativ gekennzeichnete Referenzbeispiele bei 10, 15, 20, 23,5, 28 und 32 %. Die Anzeige der aktuellen Körperform blendet zwischen den zwei nächstliegenden Referenzbildern. Das ist eine künstlerische Annäherung, keine biometrische Rekonstruktion.
- Die importierte Muskelmasse wird nicht mit fettfreier Masse gleichgesetzt. Fehlende Muskelmasse bleibt ausdrücklich fehlend.
- Die Adipositas-Einordnung erfolgt über BMI-Screening, nicht über erfundene klinische Körperfett-Grenzen. Bei ausgeprägter Muskulatur ist der BMI eingeschränkt aussagekräftig.
- Die neue Prüfung `scripts/check-import-graph.mjs` verhindert das erneute Ausliefern eines unvollständigen FULL_SOURCE mit fehlenden relativen Importen.
- **Achtung:** Der zuvor ausgelieferte .25.23-FULL_SOURCE-Snapshot enthält nicht alle historischen Annual-Report-Module. Bei einem Deployment eines kompletten Snapshots fehlen `annual-chart-atlas-v4023.js`, `annual-knowledge-v4024.js`, `annual-micronutrient-v4025.js`. Diese Dateien sind im GitHub-Repository vorhanden, im früheren ZIP aber nicht. Der .25.24-Patch überschreibt sie nicht.
- Bei GitHub-Einbindung den Patch gegen den exakten Stand .25.23 anwenden, bestehende Annual-Module nicht löschen.
