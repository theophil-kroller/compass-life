# Compass 0.5.77.59.16.1 — Fullscreen Deployment Repair

## Ursache des GitHub-Actions-Fehlers #244
Acht ältere Assertions in vier Testdateien erwarteten die vorherige Makko-Ho-UI: separate Dehnzonen-Box, alte Illustrations-Pfade, alte CSS-Klassen oder veraltete Musik-/Gong-Bedienung.
Die Fullscreen-Umstellung `.59.16` ersetzt diese Elemente absichtlich.

## In GitHub ersetzen
Nur diese vier Dateien in den Pfad `tests/` hochladen:

- `tests/compass-05775911-makko-premium.test.mjs`
- `tests/compass-05775912-sakura-mobile.test.mjs`
- `tests/compass-05775913-gong-overtime.test.mjs`
- `tests/compass-05775914-makko-deploy.test.mjs`

**Keine anderen Dateien hochladen.** Die Makko-Ho-JS-/CSS-Dateien und sechs Bilddateien aus `.59.16` bleiben unverändert.

## Verifiziert
Alle 15 Tests der vier überarbeiteten Testdateien bestanden mit `node --test tests/*.test.mjs` in einer lokalen Validierungsumgebung, die die produktiven `.59.16`-Quelltexte, die sechs Bilder sowie die unveränderten Vite- und GTD-Dateien enthält. Die JavaScript- und CSS-Dateien wurden über ihre Git-Blob-SHA mit dem aktuellen GitHub-Stand abgeglichen.

Ein vollständiger GitHub-Workflow muss nach dem Upload erneut laufen; hier wurde nicht behauptet, dass bereits die vollständigen 1305 Tests bestanden hätten.
