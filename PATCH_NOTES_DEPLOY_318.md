# Compass 0.5.77.59.40.25.10 — Hotfix für GitHub Actions #317/#318

## Gilt für
Repository `theophil-kroller/compass-life`, **nach Commit `3af8426005433280f223d231d0189daf77e0d616`**, Deploy #318.
Dies ist ein Reparaturpatch **auf den bereits hochgeladenen .40.25.10-Stand**, nicht auf .40.25.9.

## Fehlerursache laut GitHub-Actions-Logs
Bei `npm run check` schlugen sieben Tests fehl; `npm run build` wurde nicht ausgeführt. Die Version und die Reihenfolge der Vite-Plugins wurden in den historischen Tests noch bis `.40.25.9` erwartet, obwohl `.40.25.10` inzwischen die letzte Version der regulären Transformationskette ist.

## Dateien und Behebung
Die sieben aktualisierten Tests prüfen weiterhin alle bisherigen Kernfunktionen, die komplette Vite-Plugin-Reihenfolge inklusive `compass59402510FocusWorktime()` und die tatsächliche transformierte Version `.40.25.10`. Keine Tests werden übersprungen, deaktiviert oder aus `npm run check` entfernt. Web-App- und Garmin-Code bleiben unverändert.

## Installation
1. Die sieben Dateien samt `tests/`-Ordnerstruktur im Root des GitHub-Repositories hochladen und bestehende gleichnamige Dateien ersetzen.
2. Die Datei `PATCH_NOTES_DEPLOY_318.md` ist rein informativ und kann mit hochgeladen werden.
3. GitHub Actions `Deploy Compass Web` erneut laufen lassen. Der Workflow muss weiterhin `npm run check` **vor** `npm run build` ausführen.
4. Bei neuem Fehler die konkrete Actions-Fehlermeldung prüfen. Ein erfolgreicher Web-Build/Deploy ist bis dahin **nicht** bestätigt.

## Teststand
- GitHub Actions #318: 1701 von 1708 Tests bestanden, exakt 7 veraltete Assertions fehlgeschlagen.
- Lokale Tests der geänderten Dateien: 21 erfolgreiche Teiltests; 5 konnten wegen unvollständiger lokaler historischer Quellkopie nicht ausgeführt werden. Nachweis der Transformation `.40.25.10` mittels vorhandener vollständiger Transformations-Vorschau.
- Keinerlei Aussage über einen erfolgreichen Produktionsbuild. Dieser wird erst auf GitHub Actions ausgeführt.

**Wichtig:** Das zuvor gelieferte vollständige ZIP ist kein verifizierter Ersatz für den bestehenden Repository-Quellstand; verwende zur Reparatur dieses gezielte ZIP auf dem aktuellen Repo und keinen Rückimport des früheren Full-ZIP.
