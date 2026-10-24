# Compass 0.5.77.34 – GitHub hochladen

**Voraussetzung:** Die Basis-Version 0.5.77.33 ist bereits vollständig im Repository `theophil-kroller/compass-life` installiert, insbesondere `client/nutrition-strength733-bridge.js` und `client/vite.config.js` mit `nutritionStrength733Bridge()`.

## Vorgehen
1. ZIP entpacken.
2. In GitHub **alle enthaltenen Dateien unter dem identischen Pfad** hochladen (Unterordner beibehalten).
3. Bei gleichnamigen Dateien die bisherige Datei **ersetzen** – insbesondere `client/vite.config.js`, `client/src/daily-dozen-v57733.js`, `client/src/strength-editor-v57732.js` und dessen CSS.
4. Neue Dateien zusätzlich hinzufügen: `client/nutrition-longevity734-bridge.js`, `client/src/anti-aging-eight-v57734.js`, `client/src/anti-aging-eight-v57734.css`, `client/src/daily-dozen-auto-v57734.js`.
5. Auf das GitHub Pages/Cloudflare Deployment warten und Compass im Browser **neu laden**. Links unten muss **0.5.77.34** stehen.
6. Testen: Ernährungsschnellerfassung > Getränke > „Chinesischer Grüntee“; Ernährung > Daily Dozen und „Anti-Aging Eight“; Insights > Krafttraining > Trainingseinheit bearbeiten (Handy).

## Hinweise
- Kein D1-Schema-Update; keine Daten löschen. Bestehende Daily-Dozen-Häkchen bleiben bestehen und haben Vorrang vor neu erkannten Einträgen.
- In der Vite-Konfiguration sind sämtliche früheren Plugins weiterhin notwendig und bereits enthalten.
- `tests/gtd-057734-longevity-tea-mobile.test.mjs` ist ein optionaler Regressionstest (Node ≥20).
- Die im ZIP enthaltenen neuen Dateien **ersetzen nicht** ältere Module, die GitHub bereits hat.
- Falls die App beim Deployment einen eindeutigen „Integrationsanker fehlt“-Fehler zeigt, ist die Basis nicht exakt .33; bitte dann zuerst die Grundlage prüfen.
