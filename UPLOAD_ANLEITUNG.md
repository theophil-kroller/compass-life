# Compass 0.5.77.59.20 — Strength Coach · Guided Workout

## GitHub: Dateien an dieselben Pfade hochladen

Die ZIP-Datei **entpacken** und die Ordnerstruktur beibehalten.

### Ersetzen (3 Dateien)

- `client/compass5910-strength-habits-bridge.js`
- `client/src/strength-coach-v5775910.js`
- `client/src/strength-coach-v5775910.css`

### Neu hinzufügen (9 Dateien)

- `client/src/strength-guided-v5775920.js`
- `client/src/strength-guided-v5775920.css`
- `client/public/strength-visuals-v5775920/dumbbell-row.webp`
- `client/public/strength-visuals-v5775920/dumbbell-lateral-raise.webp`
- `client/public/strength-visuals-v5775920/ab-wheel-kneeling.webp`
- `client/public/strength-visuals-v5775920/goblet-squat.webp`
- `client/public/strength-visuals-v5775920/lat-pulldown.webp`
- `client/public/strength-visuals-v5775920/deadlift.webp`
- `tests/compass-05775920-guided-workout.test.mjs`

## Was ändert sich?

- **Direkt oben in Krafttraining:** `▶ Workout starten` und `✦ Trainingscoach · Plan wählen`.
- **Über das Checklisten-Symbol:** `▶ Heutiges Workout`, ohne zuerst zum Krafttraining zu scrollen.
- Geführter Workout-Player mit Start-/Zielposition, Satz- und Pausensteuerung und optionalen Angaben zu tatsächlichen Wdh./kg.
- Nur mit `✓ Satz erledigt` bestätigte Sätze werden dokumentiert.
- Die bestätigten Sätze liegen im **lokalen verschlüsselten Vault** unter `strengthGuidedSessions` – niemals als automatische Garmin/FIT-Daten.
- Beim Bearbeiten einer Garmin-Einheit erscheint **nur bei zeitlicher Übereinstimmung** (und ohne mehrdeutige Mehrfachtreffer) ein Vorschlag, der explizit übernommen, geprüft und gespeichert werden muss.
- Vorhandene Garmin-Wdh. und -Gewichte werden bei leeren geführten Feldern beibehalten.
- Keine neue Vite-Bridge, keine Datenbankmigration und keine Änderung an Makko-Ho.

## Sicherheit / Grenzen

- Eine vorgeschlagene Übung bedeutet **nicht**, dass die Uhr diese Bewegung erkannt hat.
- Die Bilder zeigen Start- und Zielhaltungen; die gezeichneten Bewegungshinweise für noch nicht illustrierte Übungen sind schematisch. Die Bilder ersetzen keine persönliche Technikbegleitung.
- Bei vorzeitigem Verlassen werden bereits bestätigte Sätze erhalten. Eine nicht gestartete Einheit wird nicht gespeichert.
- Detailsessions werden lokal im Vault gespeichert. Geräteübergreifende Synchronisation dieser neuen Details ist noch nicht implementiert.
- Das normale Gemini/StrongLifts-/Garmin-Importverhalten bleibt unverändert, bis die Nutzerin oder der Nutzer ausdrücklich eine Zuordnung bestätigt.

## Qualitätssicherung

- 53/53 lokale gezielte Regressionstests (`tests` aus dem vorherigen Validierungs-Fixture plus neuer Test)
- Browserprüfung in Chromium bei 360, 390 und 1440 px: keine horizontale Überbreite; Start, Set-Bestätigung und Pause funktionieren.
- Das ist **kein** erfolgreicher GitHub-Produktions-Deploy; diesen liefert erst GitHub Actions nach dem Upload.

Bei einem roten GitHub-Workflow bitte den Text des ersten fehlschlagenden Schritts prüfen; den Patch erst dann weiterentwickeln.
