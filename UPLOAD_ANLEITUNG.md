# Compass 0.5.77.42 – Upload und Schutz deiner Trainingsdaten

## Vorher: Daten sichern

1. **Am Desktop**, wo du die Übungen bereits zugeordnet hast, ein **verschlüsseltes Vault-Backup** erstellen. Bitte noch keine Trainingszuordnungen neu eingeben oder löschen.
2. Falls am Handy eigene Trainingseinträge vorhanden sind, auch dort zuvor ein Backup erstellen.
3. Weder den Vault noch App-Daten auf einem Gerät löschen.

## GitHub-Upload

1. ZIP entpacken.
2. Folgende Dateien unter denselben relativen Pfaden hochladen; identische Pfade **ersetzen**:
   - `client/strength-sync742-bridge.js` (neu)
   - `client/src/strength-device-sync-v57742.js` (neu)
   - `client/vite.config.js` (ersetzen)
   - `tests/compass-057738.test.mjs` (ersetzen)
   - `tests/compass-057741.test.mjs` (ersetzen)
   - `tests/compass-057742-strength-sync.test.mjs` (neu)
3. GitHub Actions abwarten: **Deploy Compass Web** muss grün bis zum Deploy sein. Ein roter Lauf bedeutet: keine neue veröffentlichte Version.
4. Nach dem Deploy muss Compass `0.5.77.42` anzeigen. Bei einer PWA eventuell einmal aktualisieren, aber keine App-Daten entfernen.

## Bestehende Übungen zwischen Desktop und Handy übertragen

1. **Desktop zuerst**: verschlüsselten Vault entsperren, mit dem Compass-Konto anmelden, Krafttraining öffnen.
2. Im Abschnitt `Übungen & Gewichte nachtragen` auf **„↻ Übungen zwischen Geräten abgleichen“** tippen. Auf eine bestätigte Meldung warten.
3. **Handy anschließend**: dieselbe App-Version und denselben **verschlüsselten Geräteabgleich** verwenden, Vault entsperren und Krafttraining öffnen.
4. Auf denselben Abgleich-Knopf tippen. Danach sollte die Zuordnung derselben Garmin-Trainingseinheit statt `unbekannte Übung` angezeigt werden.
5. **Erst nach Kontrolle am Handy** weitere Sätze bearbeiten oder neue Aktivitäten importieren.

## Wenn es weiterhin nicht funktioniert

- Prüfen, ob Desktop und Handy **denselben privaten Geräteabgleich** aktiviert haben und online sind.
- Aus zwei unabhängig eingerichteten Vaults mit **verschiedenen Synchronisierungsschlüsseln** kann Compass die Daten nicht automatisch verbinden.
- Ein Sync-Fehler soll **keine bestehenden Desktop-Zuordnungen löschen**; für Diagnose den angezeigten Status und ggf. die Fehlermeldung notieren.
- Ein blindes Neuimportieren der Garmin-Dateien ist **keine Lösung**, denn die Trainingsdetails werden als separate manuelle Annotationen gespeichert.

## Technischer Stand

Die lokalen Tests für die Änderung bestehen. Ein vollständiger CI- oder Produktions-Build ist hier nicht verifiziert. Der GitHub-Actions-Lauf bestätigt, ob die App erfolgreich veröffentlicht wurde.
