# Compass 0.5.77.41 – GitHub-Upload

**Voraussetzung:** Bereits erfolgreich deployte Version 0.5.77.40 (GitHub Actions #201).

Ersetze oder füge die Dateien mit GENAU dieser Ordnerstruktur hinzu:

| Pfad | Aktion |
|---|---|
| `client/vite.config.js` | ersetzen |
| `client/compass741-bridge.js` | neu |
| `client/src/compass741.css` | neu |
| `client/src/activity-energy-57741.js` | neu |
| `client/src/water-sport-muscles-57741.js` | neu |
| `tests/compass-057741.test.mjs` | neu |
| `tests/compass-057741-bridges.test.mjs` | neu |

**Wichtig:** Die Versionen in `package.json` und `client/package.json` NICHT verändern; die Altkompatibilität der Vite-Bridges erfordert die bisherige Quellversionsbasis. Die UI zeigt nach dem Build `0.5.77.41`.

1. ZIP entpacken und Dateien hochladen, bei `client/vite.config.js` die vorhandene Datei ersetzen.
2. GitHub Actions > **Deploy Compass Web** auf vollständigen Erfolg kontrollieren.
3. Nach dem Aktualisieren ggf. PWA-Seite neu laden. Bei älterem Service-Worker einmal ganz schließen und erneut öffnen.
4. Prüfen: aktives Shopping-Projekt => 🛒 oben; letzte Liste archivieren => Symbol weg.
5. Prüfen: Ernährungsschnellerfassung enthält Hofer Germknödel und Hofer Laugenbreze mit Butter.
6. Prüfen: Krafttraining > 🛶 Kajak/SUP mit geeigneten Garmin-Aktivitätsdaten.
7. Prüfen: Energieziel aktiv + Garmin-Monitoringtage: dynamische Tagesziele mit gelb-roter Skala. Bei unzureichenden Daten bleibt der alte Basiswert erhalten.

Alle gespeicherten Daten bleiben im bestehenden lokalen Vault. Die neuen UI-Module speichern selbst nichts Zusätzliches.
