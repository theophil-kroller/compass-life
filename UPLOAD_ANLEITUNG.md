# Compass 0.5.77.59.21 — Coach & Wim-Hof Player

**Ausgangsbasis:** erfolgreicher GitHub-Deploy von Compass 0.5.77.59.20.
Dies ist ein **Datei-Patch** mit den exakt angegebenen Zielpfaden. Keine Vite-Änderung, keine D1-Migration.

## GitHub-Upload

ZIP entpacken und die Dateien unter **denselben relativen Pfaden** im Repository `theophil-kroller/compass-life` hochladen:

**Vorhandene Dateien ersetzen:**

- `client/compass5910-strength-habits-bridge.js`
- `client/src/strength-coach-v5775910.js`
- `client/src/strength-coach-v5775910.css`
- `client/src/strength-guided-v5775920.js`
- `client/src/strength-guided-v5775920.css`
- `tests/compass-05775919-workout-planner.test.mjs`
- `tests/compass-05775920-guided-workout.test.mjs`

**Neu hinzufügen:**

- `client/src/wim-hof-player-v5775921.js`
- `client/src/wim-hof-player-v5775921.css`
- `tests/compass-05775921-coach-wimhof.test.mjs`
- `client/public/wim-hof-audio/AUD-20240504-WA0004.m4a` (Morgen)
- `client/public/wim-hof-audio/AUD-20240504-WA0005.m4a` (Abend)

Die beiden M4A-Dateien sind im *vollständigen* ZIP enthalten. Wenn du das *Code-Patch* wählst, kannst du die beiden Audios separat in den oben genannten Ordner hochladen. Ohne Audios kann der Player die Titel alternativ einmalig über den lokalen Dateiimport übernehmen.

### Achtung: Veröffentlichung der Aufnahmen

Alles unter `client/public/` wird nach dem Deploy **öffentlich über GitHub Pages erreichbar**. Lade die M4A-Dateien nur dort hoch, wenn du zur öffentlichen Weitergabe der konkreten Aufnahmen berechtigt bist. Wenn nicht, benutze das **Code-Patch ohne Audio** und die eingebaute Funktion **„Aufnahme einmal lokal speichern“** auf deinem Handy; die Dateien verbleiben dann im lokalen Gerätespeicher.

## Enthaltene Funktionen

1. **Coach** in der Checkliste, direkt neben **Miracle Morning**; eigener Trainer-Einstieg oben im Krafttrainingsbereich.
2. Ziel (V-Taper / Sixpack / Muskelbalance / allgemeine Kraft) und **Zuhause/Gym** als direkter Switch. Letzte Einstellungen werden auf diesem Gerät gespeichert.
3. **StrongLifts 5×5 nur als ausdrücklich wählbare Gym-Methode**. V-Taper priorisiert Hypertrophie; die Auswahl gewichtet bereits dokumentierte Muskelbeteiligung und gibt Datenunsicherheit an.
4. **Workout-Player** mit Übungsbildern, roten Rep-Kreisen pro Satz, Gewichts-/Scheibeneingabe über dem Übungsbild, Satzpause und Bildschirm-Wachhalten bei laufender Trainingseinheit.
5. Home-Inventory: **je vier Scheiben zu 2,5 / 2 / 1,5 / 1 kg = 28 kg Scheibengewicht insgesamt**. Verbindungsstange mit vernachlässigbarem Eigengewicht. Grip-Gewichte werden **nicht** erraten. Die App zeigt das Gewichtsbudget an; ein vollständiger physischer Scheiben-Belegungsrechner pro Gerät ist noch nicht enthalten.
6. **Wim-Hof-Audio-Player** mit 🌅 Morgen (004), 🌙 Abend (005), ▶ / ⏸ / ⏹, Fortschritt und Screen Wake Lock während der Wiedergabe. Erst nach dem **vollständigen Abspielen** gilt `wim-hof` für den Habit Tracker als erledigt.
7. **Offline-Audio nach dem ersten Herunterladen:** die jeweilige M4A wird beim ersten Abruf in IndexedDB gespeichert, danach über einen lokalen Blob wiedergegeben. Es erfolgt **kein** Download beim normalen Compass-Start. Lokale App-Daten dürfen nicht gelöscht werden. Bei Speicherplatz-/Browserproblemen kann ein erneuter Download nötig sein.
8. Coach-Satzprotokolle bleiben im **verschlüsselten Vault** und werden später nur nach manueller Bestätigung zu Garmin-Sätzen zugeordnet; kein automatisches Überschreiben von Garmin-Daten.

## Hinweise zur Bedienung

- **Workout → Coach:** Ziel/Ort auswählen, „Workout starten“. Oder den Coach über das Checklisten-Menü öffnen.
- **Wim-Hof:** Bei `Wim-Hof · Atemroutine` auf ▶ tippen, Morgen/Abend auswählen, ▶ abspielen. Das lokale Speichern von je ca. 22 MB kann beim ersten Mal einige Sekunden benötigen. Beim nächsten Start wird die gespeicherte Version bevorzugt.
- **Wim-Hof-Sicherheit:** Wegen möglicher Benommenheit ausschließlich sitzend oder liegend an sicherem Ort üben; niemals während des Fahrens oder im Wasser.

## Prüfung / Risiken

- 31/31 **gezielte Node-Regressionstests** bestanden (Coach, Guided Workout, vorhandene Transformations-Anker, Wim-Hof-Audio-Referenzen).
- JS-Quellcode auf Syntax geprüft; beide M4A-Container mit FFprobe validiert.
- **Nicht** als vollständiger GitHub-Actions-/Produktions-Deploy bestätigt. Bitte die nächste Actions-Ausführung abwarten.
- Keine neuen Bilddateien in diesem Patch: es nutzt die sechs bereits unter `strength-visuals-v5775920` bereitgestellten Übungsbilder.
