# GitHub-Upload — Compass 0.5.77.28

**Voraussetzung:** Nutrition 3 (0.5.77.27) ist bereits in `theophil-kroller/compass-life` hochgeladen. Dieser Build enthält **keine** Nutrition-3-Dateien zur erneuten Installation.

1. Dieses ZIP **entpacken**.
2. Inhalt mit derselben Ordnerstruktur direkt in das Repository hochladen. Die bestehenden Dateien in `client/src` bleiben erhalten; nur `client/vite.config.js` wird durch die beiliegende Version ersetzt.
3. Neue Dateien:
   - `client/strength728-bridge.js`
   - `client/src/garmin-strength-v57728.js`
   - `client/src/strength-insights-v57728.js`
   - `client/src/strength-insights-v57728.css`
   - `tests/gtd-057728-strength-training.test.mjs`
   - `CHANGELOG_0.5.77.28.md`
   - `UPLOAD_ANLEITUNG.md`
4. **Ersetzen:** `client/vite.config.js` — erweitert den bestehenden `nutrition3Bridge()` um `strength728Bridge()`; behält die bestehende PWA-Konfiguration bei.
5. Nach GitHub Pages Build und PWA-Aktualisierung im Menü **Insights → Krafttraining** öffnen.
6. Garmin Connect → **Aktivitäten** → konkrete Krafttrainingseinheit → **Originaldatei (.fit) exportieren**. In Compass unter **Insights → Datenquellen** importieren. Du kannst dieselbe FIT-Datei später erneut importieren: dokumentierte zusätzliche Sätze ersetzen unvollständige Zwischenstände ohne Duplikate.

**Bitte beachten:** Ein Garmin-Activities-CSV reicht normalerweise nur für die Trainingsübersicht, aber **nicht** für individuelle Muskelgruppen. Datenqualität hängt von der Erfassung auf der Garmin-Uhr und vom Inhalt des FIT-Exports ab. Mit deinem ersten echten Strength-FIT können wir die Zuordnungen nachjustieren.

**Technik:** Frontend-Vite-Pipeline: `nutrition3Bridge()` → `strength728Bridge()` → `VitePWA()`. Der ältere `main.js`-Quelltext wird nicht überschrieben. Es ist weder eine Worker- noch eine D1-Migration erforderlich.

**Lokaler Funktionstest:** `node --test tests/gtd-057728-strength-training.test.mjs`.
