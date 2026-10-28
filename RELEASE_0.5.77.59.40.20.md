# Compass Web 0.5.77.59.40.20 — Ars Vivendi Annual: Work Journal Crash Hotfix

**Basis:** 0.5.77.59.40.19. Keine Änderung an Datenbank, Verschlüsselung, Garmin oder Finanzlogik. Keine D1-Migration.

## Root cause
Bei vorhandenen Time-Journal-Sessions erzeugte `[...journalByMonth]` statt Monatskennungen die Map-Entries `[key, value]`. Das anschließende `journalByMonth.get(k)['work']` griff mit dem Entry-Array als Schlüssel ins Leere und warf: `Cannot read properties of undefined (reading 'work')`.

## Fix
- Monatslabels über `journalByMonth.keys()` aufbauen und der gewünschten Kategorie nur dokumentierte Stunden zuordnen.
- Kein Aufruf der monatlichen Auswertung, wenn keine gültigen Zeitintervalle vorliegen.
- Regressionstest mit mehreren Monaten, Kategorien, Quick-Worktime-Einträgen und ungültigen/gelöschten Sessions, inklusive privater Reportkapitel.
- Buildversion .40.20; `.40.19` bleibt als abhängige Vite-Transformation bestehen.

## Installation
Patch **nur** auf .40.19; alternativ die komplette Full Source nutzen. Nicht beide ZIPs anwenden.

## Abnahme
`node --test tests/compass-0577594020-annual-workmap-hotfix.test.mjs` und `npm test`; Vite-Produktionsbuild in GitHub Actions ausführen, da nicht lokal verfügbar. Den Print-to-PDF-Flow bitte mit dem echten verschlüsselten Vault testen.
