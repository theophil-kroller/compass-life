# Compass 0.5.77.59.5 — Deployment Repair (#231 / #232)

Stand: GitHub `main` Commit `c4e496fb654dcb019cecb38f1f8ff496fdea4e06` (25.10.2026).

GitHub Actions Fehlerdiagnose:
- Run #231: 8 Tests prüfen die historische, durch `.59.3` unterbrochene Vite-Bridge-Reihenfolge.
- Run #232: dieselben 8 Fehler, außerdem 3 Node-Tests mit ERR_UNKNOWN_FILE_EXTENSION für den direkten Import der CSS-Datei im Nutrition-Modul.

## Dateien in diesem ZIP (relativ zum Repository-Hauptverzeichnis)

Ersetzen:
1. `client/vite.config.js`
2. `client/index.html`
3. `client/src/nutrition-timing-v57725.js`
4. `tests/compass-0577593-ux.test.mjs`
5. `tests/compass-nutrition-cup-plate.test.mjs`

Neu anlegen:
6. `tests/compass-0595-deployment-regression.test.mjs`

**Nicht** löschen oder ersetzen: `client/compass7593-ux-bridge.js` sowie `client/src/nutrition-cup-plate-v577593.css`; diese Dateien sind seit den Builds `.59.3` und `.59.4` vorhanden und werden weiterhin benötigt.

Korrekturen:
- `compass7593UxBridge()` wird vor den bisherigen `.50–.58`-Bridges ausgeführt, sodass die bestehende Reihenfolge und zugehörige Tests erhalten bleiben.
- Die Nutrition-CSS-Datei wird nun in der Vite-HTML-Einstiegsdatei eingebunden, statt per ESM-Import in einer Node-getesteten JS-Datei.
- Erwartungstests und neue Deployment-Regressionstests an die korrigierte Struktur angepasst.

Tests in dieser Umgebung: 15/15 bestanden (`node --test` in der isolierten, repräsentativen Patch-Struktur), `node --check` für geänderte JS-Dateien bestanden. Der vollständige 1.248-Testlauf und der Vite-Produktionsbuild konnten ohne ein lokal installiertes vollständiges Repository und dessen Node-Abhängigkeiten nicht erneut ausgeführt werden. Bitte GitHub Actions nach dem Upload kontrollieren.

Diese Korrektur ändert keine Tresor-/GTD-/Nutrition-Datenmodelle. Die geplante Verschiebung von Erholung unter Planen ist in diesem reinen Deployment-Reparatur-Build **noch nicht** enthalten.
