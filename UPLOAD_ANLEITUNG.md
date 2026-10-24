# Compass 0.5.77.29 · Upload nach GitHub

**Basis:** Compass 0.5.77.28 muss bereits installiert sein, einschließlich Nutrition 3.

1. ZIP entpacken und die Ordnerstruktur beibehalten.
2. Dateien in dein vorhandenes GitHub-Repository `theophil-kroller/compass-life` hochladen:
   - **Ersetzen:** `client/vite.config.js`
   - **Ersetzen:** `client/src/strength-insights-v57728.js`
   - **Ersetzen:** `client/src/strength-insights-v57728.css`
   - **Neu:** `client/strength729-bridge.js`
   - **Neu:** `tests/gtd-057729-strength-csv.test.mjs`
   - **Neu:** `CHANGELOG_0.5.77.29.md`
3. GitHub Pages-Deployment abwarten und Compass aktualisieren (bei PWA gegebenenfalls Seite neu laden).
4. **`Activities(2).csv` in Compass nochmals unter den bisherigen Garmin-Datenquellen importieren.** Der alte Import hatte die Satz-/Wiederholungszahlen noch nicht gespeichert.
5. **Insights → Krafttraining** aufrufen. Bei deiner Datei vom 24. Oktober sollten 2 Einheiten, 1 Trainingstag, 6 Sätze und 72 Wiederholungen erscheinen. Die Körperkarte bleibt zunächst neutral, weil die CSV keine einzelnen Übungen enthält.
6. Damit die Muskelgruppen eingefärbt werden: Garmin Connect → jeweilige Krafttrainingseinheit öffnen → **Original/FIT exportieren**. Diese Aktivitäts-FIT in Compass importieren; nicht den täglichen Wellness-FIT-ZIP verwechseln.

**Architektur:** `nutrition3Bridge()` → `strength728Bridge()` → `strength729Bridge()` → `VitePWA()`; kein Überschreiben von `client/src/main.js` und keine Datenbank-Migration erforderlich.

**Tests:** `node --test tests/gtd-057728-strength-training.test.mjs tests/gtd-057729-strength-csv.test.mjs`.

**Hinweis:** Die Garmin Activities CSV verrät Set-Gesamtzahlen, nicht Einzelgewichte/Übungsnamen. Es werden keine Muskelzuordnungen erfunden. Spätere FIT-Details ersetzen nicht die vorhandenen Daten unkontrolliert, sondern werden mit CSV-Zusammenfassungen verrechnet.
