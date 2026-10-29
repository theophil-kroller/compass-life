# Compass 0.5.77.59.40.25.10 – Hotfix nach GitHub Actions #319

Basis: der zuletzt hochgeladene Repository-Stand `c5342f93bb79389062f9b89422de991eb8e197a5` (Workflow #319).

## Tatsächliche Ursache
`npm run check` bestand in #319 mit 1708/1708. Danach schlug `npm run build` fehl mit:
`[vite:build-html] Full snapshot entry: unexpected HTML`.
Die HTML-Transformationsfunktion lief in Vite nach dessen eigener HTML-Verarbeitung; `enforce: 'pre'` steuert hier nicht den Zeitpunkt des `transformIndexHtml`-Hooks.

## Änderung
- `client/vite.fullsource.config.js`: `transformIndexHtml: { order: 'pre', handler(...) }` ersetzt die fehlerhafte späte Funktion. Damit werden die beiden vollständigen, vorhandenen Quell-Einstiegspunkte vor dem Vite-Bundling eingesetzt. Wiederholte Ausführung ist idempotent; unerwartete/teilweise HTML-Konfiguration wird weiterhin abgelehnt.
- `tests/compass-fullsource-25-10-deploy.test.mjs`: prüft explizit `order: 'pre'`, korrekte Entry-Ersetzung und Idempotenz.

## Installation
Nur diese beiden Dateien im Repository-Hauptverzeichnis mit gleicher Pfadstruktur ersetzen. `npm run check` und danach `npm run build` laufen über GitHub Actions automatisch. Keine Migration nötig, kein Garmin-Update nötig, kein Full-Package neu hochladen.

## Testnachweis
- GitHub Actions #319 (vor Hotfix): 1708/1708 Tests grün, Vite-Build fehlgeschlagen mit oben genannter Meldung.
- In der lokalen rekonstruierten Quellenkopie: 14/14 gezielte Tests grün.
- JavaScript-Syntaxprüfung und ZIP-Prüfung bestanden.
- Der vollständige Vite-Build konnte lokal mangels Zugriff auf registry.npmjs.org nicht durchgeführt werden. Daher **keine Zusage eines erfolgreichen Deployments**; erst der nächste GitHub-Actions-Lauf wird das bestätigen.
