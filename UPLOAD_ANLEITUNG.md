# Compass 0.5.77.40 – GitHub-Upload

Voraussetzung: 0.5.77.39 (Workflow #199 erfolgreich veröffentlicht).

## Ersetzen / hinzufügen

- `client/package.json` **ersetzen** (fügt die lokale NPM-Abhängigkeit `body-muscles@1.0.0` hinzu)
- `client/strength-premium738-bridge.js` **ersetzen**
- `client/src/strength-premium-v57738.js` **ersetzen**
- `client/src/strength-premium-v57738.css` **ersetzen**
- `tests/compass-057738.test.mjs` **ersetzen** (alter Test erwartete alte SVG-Polygone)
- `tests/compass-057740.test.mjs` **neu** (Hover + Muskelzuordnung)
- `client/public/THIRD_PARTY_MUSCLE_ATLAS.txt` **neu** (Attribution)
- `client/public/licenses/Apache-2.0.txt` **neu** (Lizenz)

## Installation

Entpacke ZIP. Lade diese Dateien mit der angegebenen Ordnerstruktur auf GitHub hoch.

GitHub Actions: `npm install` holt die Open-Source-Bibliothek `body-muscles@1.0.0` und Vite bündelt sie in die PWA. Es wird **keine Live-Verbindung** zu einem Bildserver benötigt.

Unter GitHub Actions sicherstellen, dass **npm run check**, **npm run build** und **Deploy Pages** grün sind. Erst dann Version 0.5.77.40 im Browser prüfen.

## Sichtprüfung

1. Muskelkarte öffnen. Anstelle der Comic-Polygone sollten fein gegliederte Silhouetten mit einzelnen Muskelkonturen vorn und hinten sichtbar sein.
2. Mit Maus auf Bizeps oder Waden zeigen – ein **deutscher Tooltip** mit Namen und Sätzen sollte erscheinen.
3. Auf dem Handy antippen – derselbe Hinweis bleibt eingeblendet.
4. Kraft / Rad / Gemeinsam und verschiedene Zeiträume prüfen.

## Teststatus hier

Die 9 angepassten bisherigen Muskelkarten-Tests und 4 neue Tests für Datenmapping/Hover bestehen (13/13). JS-Syntaxprüfungen erfolgreich. Vollständiges `npm install`/Vite-Produktionsbuild ist in diesem Container wegen fehlenden Internetzugriffs nicht möglich.
