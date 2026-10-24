# Compass 0.5.77.33 · GitHub-Upload

Voraussetzung: Im Repository ist Compass **0.5.77.32** eingebunden (`client/vite.config.js` enthält `strengthNutrition732Bridge()`).

## Dateien (alle Pfade relativ zum Repository-Hauptverzeichnis)
- `client/vite.config.js` **ersetzen**, bleibt mit allen vorherigen Brücken kompatibel und fügt `.33` als letzte Bridge hinzu.
- `client/nutrition-strength733-bridge.js` **neu**.
- `client/src/nutrition-guidance-v57733.js` **neu**.
- `client/src/nutrition-guidance-v57733.css` **neu**.
- `client/src/daily-dozen-v57733.js` **neu**.
- `client/src/strength-editor-v57732.js` **ersetzen** (bestehende Übungsdatenbank erweitern, bestehende IDs beibehalten).
- `tests/gtd-057733-greger-daily-dozen-strength.test.mjs` **neu** (Tests, optional für Deploy).
- `CHANGELOG_0.5.77.33.md`, `UPLOAD_ANLEITUNG.md` (Dokumentation, optional).

Es handelt sich um einen **inkrementellen Upload**, nicht um einen vollständigen Ersatz des Repositories. Andere Dateien aus den Builds .27 bis .32 NICHT löschen.

## Nach dem Deployment testen
1. Compass neu laden, ggf. PWA schließen/neu starten. Versionsanzeige `0.5.77.33` prüfen.
2. Insights → Ernährung → **🥑 Fettqualität**: oberhalb der Zahlen neue Ampel-Karten ansehen. Fehlende Omega-Werte dürfen nicht als null dargestellt werden.
3. Insights → Ernährung → **🌿 Daily Dozen**: Häkchen setzen, zum Vortag wechseln, zurück und nach Reload erneut prüfen.
4. Falls der private Geräte-Journal-Abgleich aktiv ist: ein Häkchen vom Handy speichern und auf dem zweiten Gerät Abgleich testen. Pro Kategorie werden Zeitstempel gemergt; bei parallelen Edits derselben Kategorie entscheidet die letzte Änderung.
5. Insights → Krafttraining → Übungen nachtragen: **Hammer Curl to Press**, **Curl to Press**, **Military Press** und klassische StrongLifts-5×5-Übungen auswählen und Satzdaten speichern.

## Tests
`node --test tests/gtd-057733-greger-daily-dozen-strength.test.mjs`

Die bereits vorhandene `.32` Testdatei kann parallel ausgeführt werden. **Ein vollständiger Produktions-Build wurde in der Erstellungssitzung nicht ausgeführt.**
