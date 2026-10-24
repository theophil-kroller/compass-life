# Compass 0.5.77.39 – Muscle Map Visual Overhaul

Basis: 0.5.77.38 plus integrierter CI-Hotfix für den Nutrition-Pillen-Test.

## Neu in 0.5.77.39

- Muskelkarte im deutlich näheren **Referenzstil** umgesetzt:
  - schlankere Körper-Silhouette
  - feinere, ruhigere Muskelzonen
  - stärkeres Fitness-App-Gefühl auf dunklem Hintergrund
  - größere Vorder-/Rückansicht
- Bestehende Datenlogik bleibt erhalten:
  - Krafttraining, Radfahren, Gemeinsam
  - Haupt/unterstützend bzw. Satzbelastung
  - Muskel-Ranking und Trainingsraster
- Analysehinweis ergänzt:
  - spätere Kombination mit Fitdays-Körperdaten soll als **Trend über Wochen/Monate** interpretiert werden, nicht tagesgenau
- CI-Hotfix aus 0.5.77.38 integriert:
  - `tests/gtd-057726-nutrition-trends-missing.test.mjs` berücksichtigt die neue kcal-Pille statt des alten Aufklappbalkens
- Versionsanzeige wird auf **0.5.77.39** gesetzt.

## Geänderte Dateien

- `client/strength-premium738-bridge.js`
- `client/src/strength-premium-v57738.js`
- `client/src/strength-premium-v57738.css`
- `tests/gtd-057726-nutrition-trends-missing.test.mjs`
