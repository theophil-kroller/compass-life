# Compass 0.5.77.59.6 — Deployment Repair 2

**Basis:** GitHub `main`, Commit `c53a5aab4399607e249aab189546a0fe47e24732` (#233 fehlgeschlagen).

## Dateien in GitHub hochladen

- `client/vite.config.js` — ersetzen
- `tests/compass-0577593-ux.test.mjs` — ersetzen
- `tests/compass-0595-deployment-regression.test.mjs` — ersetzen
- `tests/compass-0596-all-historical-vite-gates.test.mjs` — neu

**Nur die vier Dateien im ZIP hochladen.** Keine Datenmigration.

## Ursache

Die `.59.5`-Reparatur hat das neue UX-Plugin zwischen `compass749Bridge` und `VitePWA` geschoben. Dadurch scheiterten sechs ältere Regressionstests, die diese drei Vite-Plugins direkt nebeneinander erwarten.

Jetzt bleibt diese alte Reihenfolge unverändert. `compass7593UxBridge()` steht nach `VitePWA(...)` und direkt vor `compass750Bridge()`. Da die UX-Bridge `enforce:'pre'` setzt, bleibt der gewünschte Transformationszeitpunkt erhalten. Die vollständige `.50`–`.58`-Kette ist wieder direkt aneinander gereiht.

Der Nutrition-2-Fix aus `.59.5` (CSS nicht direkt über das JS-Modul importieren) bleibt unverändert.

## Validierung

`node --test tests/compass-0577593-ux.test.mjs tests/compass-0595-deployment-regression.test.mjs tests/compass-0596-all-historical-vite-gates.test.mjs`

Der vollständige Repository-Test `npm run check` und der Produktionsbuild werden erst durch das neue GitHub-Deployment endgültig bestätigt.
