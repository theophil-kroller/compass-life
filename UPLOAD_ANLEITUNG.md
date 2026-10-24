# GitHub Upload — Compass 0.5.77.32

**Voraussetzung:** Compass 0.5.77.31 ist bereits installiert (im Repo: `client/vite.config.js` bindet `nutrition731Bridge()` ein).

Alle Dateien unter `client/` in den entsprechenden Ordnern im bestehenden GitHub-Repository hochladen. Nur die aufgeführten Pfade sind nötig.

## Dateien
1. `client/vite.config.js` — bereits vorhandene Datei **ersetzen** (behält Nutrition 3 / Strength 28–30 / Nutrition 31 und ergänzt die neue Bridge).
2. `client/strength-nutrition732-bridge.js` — **neu**.
3. `client/src/strength-editor-v57732.js` — **neu**.
4. `client/src/strength-editor-v57732.css` — **neu**.
5. `tests/gtd-057732-strength-editor-mobile-nutrition.test.mjs` — optional für GitHub-/lokale Tests.

Die Anleitung und das Änderungsprotokoll kannst du mit hochladen, musst du aber nicht. **Keine alten Dateien, keine früheren ZIPs erneut hochladen.**

## Nach dem GitHub-Deployment
- App auf Desktop und Handy einmal aktualisieren, sodass die Versionsanzeige `0.5.77.32` zeigt (ggf. installierte PWA schließen und neu öffnen).
- Handy: Ernährungsschnellerfassung öffnen. Kategorien/Kacheln müssen vor der individuellen Mahlzeitbeschreibung stehen; beim Scrollen darf die Anzeige durch einen Hintergrund-Render nicht zum Anfang springen.
- Krafttraining unter Insights öffnen: Nach neuen Garmin-CSV-Imports zeigt Compass oben eine Aufforderung zur Zuordnung. Trainingseinheit anklicken → Sätze auswählen → Wiederholungen + kg ergänzen → speichern.
- Muskelkarte mit „Vorne“/„Hinten“ prüfen. Import der ursprünglichen Garmin Activities.csv genügt; zusätzliche Aktivitäts-FIT-Dateien sind optional.
- **Nur wenn der ältere Importer die Satzsummen noch nie eingelesen hat**, Activities.csv einmal nach dem Update erneut importieren.

## Lokal testen
`node --test tests/gtd-057732-strength-editor-mobile-nutrition.test.mjs`

## Hinweis
Die manuellen Übungszuordnungen werden im lokalen verschlüsselten Vault abgelegt; eine verifizierte Synchronisation zu anderen Geräten ist noch kein Bestandteil von 0.5.77.32.
