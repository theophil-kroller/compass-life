# Compass 0.5.77.46 – GitHub-Upload

**Basis: Compass 0.5.77.45**, erfolgreiches Deployment #205.

1. ZIP entpacken.
2. Den Inhalt des Pakets unter den jeweils identischen Pfaden in `theophil-kroller/compass-life` hochladen. **`client/vite.config.js` ersetzen**, keinesfalls den Ordner `client` zusätzlich verschachteln.
3. Die neuen Module `client/src/weekly-intelligence-v57746.js`, `.css` und den Plugin-Baustein `client/compass746-bridge.js` ergänzen.
4. Drei ältere Regressionstests ersetzen, da diese noch verlangten, dass nach .45 unmittelbar die PWA-Integration folgt.
5. Den neuen Test `tests/compass-057746-weekly.test.mjs` hinzufügen.
6. GitHub Actions `Deploy Compass Web` prüfen. Nur bei grünem Gesamt-Check wird die neue Version veröffentlicht.
7. Im Browser gegebenenfalls neu laden. In der Navigation **Insights → Wochenkompass** öffnen. Version `0.5.77.46` prüfen.

## Was du erwarten kannst
- Beginnt mit dem jüngsten vollständig vergangenen Sieben-Tage-Fenster, nicht mit Live-Daten von heute.
- Garmin/Fitdays müssen weiterhin importiert werden. Ein leerer oder alter Import führt zu deutlichen Datenlücken bzw. Aktualitätshinweisen.
- Auf einen einzelnen Tag klicken/hovern: SVG-Dot zeigt Datum und beobachteten Wert.
- Die Schaltflächen `←`, `→`, `Letzte 7 Tage` wechseln den historischen Auswertungszeitraum.
- Der Fristenbereich nutzt den aktuellen GTD-Vault, nicht den Datenstand älterer importierter Fitnesstracker.

## Datensicherheit
Kein Vault-Schemawechsel und kein Datenverlust; die neue Wochenansicht liest bereits vorhandene Daten **nur lesend**. Keine Änderungen an bestehenden Garmin-, Ernährung-, Finanz- oder Zeiteinträgen.
