# Compass Focus 0.3.1 — Garmin fēnix 7S

Eigenständiges Connect-IQ-Projekt für die fēnix 7S (nicht Pro).

**Wichtig:** Dies ist ein neuer Quellcode-Build; der 0.3.1-Code wurde hier
nicht mit dem Garmin Connect IQ SDK kompiliert oder auf der Uhr getestet.
Die Eingabebehandlung baut auf dem im Simulator bestätigten D4-Fix auf.

- `source/CompassApp.mc`: Uhr-App, runde UI, Kategorie-Auswahl, Timer,
  Session-Menü, lokale Sessions und Bridge-Synchronisierung.
- `manifest.xml`: App-Name über Ressourcen, Sensor-, SensorHistory- und
  Communications-Rechte.
- `resources/strings/strings.xml`: App-Name „Compass Focus“.
- `resources/icon.png`: Launcher-Icon in 40 × 40 Pixel.

**Schritt-für-Schritt und API-Abhängigkeiten:**
`docs/GARMIN_FOCUS_0.3.1.md` im Compass-Repo oder `ANLEITUNG.txt` im Download.

Bei Backend-Upload der Kategorien Lehre/Prüfungen muss zuerst der Worker-Patch
0.3.1 deployed werden. Für den reinen Simulator-Test reicht das Garmin-Projekt.
