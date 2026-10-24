# Compass 0.5.77.45 – GitHub Upload

Voraussetzung: 0.5.77.44 liegt bereits im Repository (GitHub Actions #205 war erfolgreich).

## Dateien hochladen

Die folgende Pfadstruktur ist **relativ zum GitHub-Repository** (nicht zum lokalen Rechner):

- `client/vite.config.js` — ersetzen
- `client/compass745-bridge.js` — neu
- `client/src/receipt-gpt-v57743.js` — ersetzen
- `client/src/receipt-categories-v57745.js` — neu
- `client/src/receipt-categories-v57745.css` — neu
- `tests/compass-057743-dream-receipts.test.mjs` — ersetzen (CI-Test auf neuen letzten Vite-Baustein angepasst)
- `tests/compass-057744-fixes.test.mjs` — ersetzen (CI-Test auf neuen letzten Vite-Baustein angepasst)
- `tests/compass-057745-receipt-categories.test.mjs` — neu

`CHANGELOG_0.5.77.45.md` und diese Anleitung sind optional.

## Prüfen
1. GitHub Actions: „Deploy Compass Web“ vollständig erfolgreich durchlaufen lassen.
2. Compass neu laden und Versionsnummer 0.5.77.45 prüfen.
3. Einkaufswagen öffnen: Oben unter „Wofür gibst du beim Einkaufen Geld aus?“ die kategorisierten Monatsausgaben ansehen.
4. „Produktgruppen prüfen und korrigieren“ aufklappen. Eine unklare Position auswählen und Kategorie ändern. Beträge aktualisieren sich, ohne die lange Seite neu aufzubauen.
5. Anderes Gerät synchronisieren: Die korrigierte Zuordnung sollte auch dort erscheinen.
6. Den selben Kassenbon erneut importieren: weiterhin Dubletten verhindern, bestehende Regeln behalten.

## Datenschutz und Grenzen
Im ZIP liegen nur Programmdateien und künstliche Testfälle, **keine** privaten Kassenbons. GPT-Ausgaben mit Unklarheiten bleiben markiert. Keine automatisch erzeugten Bankbuchungen und keine erfassten Mahlzeiten aus Einkaufspositionen.
