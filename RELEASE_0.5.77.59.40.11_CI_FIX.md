# Compass Web 0.5.77.59.40.11 – GitHub Actions CI hotfix

Ausgangspunkt: fehlgeschlagener GitHub-Actions-Lauf **Deploy Compass Web #289**
`https://github.com/theophil-kroller/compass-life/actions/runs/40556604559`
Commit: `0114b0e4353fd934b0a4b2d61684e15ba7e32f6d`.

## Ursache

Der neue Lebensmittel-Release `.40.11` fügt den Terminal-Vite-Transform `compass594011FoodsRelease()` hinzu und hebt die sichtbare Versionsnummer auf `.40.11`. Sieben ältere Regressionstests erwarteten noch `.40.10` und/oder den vorherigen letzten Transform. GitHub Actions meldete **1.561 bestanden / 7 fehlgeschlagen** und stoppte vor `npm run build`.

## Korrektur

Ausschließlich die sieben betroffenen Tests wurden aktualisiert. Statt auf einen veralteten letzten Transform oder eine fest eingetragene Release-Endung zu bestehen, prüfen sie nun:

- ob die `.40.10`-Synchronisationsstufe weiterhin vorhanden ist und **vor** `.40.11` liegt,
- ob die transformierte Client-Versionsnummer dem bekannten Schema entspricht,
- ob die bestehenden Navigation-, Workout-, Projekt- und Sync-Anker erhalten bleiben.

Der separate `.40.11`-Test prüft weiterhin ausdrücklich die neue Release-Endung `.40.11`.

**Keine Änderung an Anwendungscode, Datenbank, Worker, Daten oder Versionsnummer.**

## Prüfung

- 48 gezielte Integrationstests einschließlich aller sieben ehemals fehlerhaften Fälle erfolgreich.
- Eine vollständig durchlaufene lokale Gesamttestsuite konnte innerhalb des Ausführungslimits nicht beendet werden; das Ergebnis muss mit GitHub Actions bestätigt werden.
- Original-Full-Source-Archiv wurde bytegleich kopiert; einzig die 7 korrigierten Tests und diese Installations-/Releasehinweise unterscheiden sich.
