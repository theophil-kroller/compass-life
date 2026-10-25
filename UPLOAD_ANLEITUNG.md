# Compass 0.5.77.58 — CI-Hotfix 58.1

**Nur 5 bestehende Testdateien ersetzen. Keine anderen Dateien hochladen oder löschen.**

In GitHub im Repository `theophil-kroller/compass-life` die Dateien unter `tests/` mit denselben Pfaden ersetzen:

- `tests/compass-057750-insights-nav.test.mjs`
- `tests/compass-057751-premium-ui.test.mjs`
- `tests/compass-057752-chart-first.test.mjs`
- `tests/compass-057753-finance-performance.test.mjs`
- `tests/compass-057754-on-demand.test.mjs`

Die Dateien `client/compass758-bridge.js`, `client/vite.config.js` und `client/src/project-workspace-v57758.css` **unverändert lassen**. Die App-Version bleibt `0.5.77.58`.

## Ursache und Korrektur

GitHub Actions #223 stoppte bei `npm run check` nach 1.251 Tests mit 5 Fehlern. Alle fünf hatten denselben Fehler: Der Test verlangte, dass die Plugin-Liste nach `.57` endet (`...compass757Bridge()]`). Mit der neuen `.58`-Bridge ist das falsch. Nun prüfen die historischen Tests weiterhin die richtige Reihenfolge aller `.50–.57`-Plugins, **ohne das Ende der Liste festzuschreiben**. Der bereits bestehende aktuelle Test `compass-057757-full-transform-chain.test.mjs` sichert die gesamte Produktionskette einschließlich `.58` und deren abschließender Syntaxprüfung ab; genau dieser Test war in GitHub Actions #223 bereits erfolgreich.

## Teststatus

- Lokal 58/58 Tests in der verfügbaren 0.5.77.50–.58-Sandbox erfolgreich, darunter alle fünf betroffenen historischen Testdateien.
- GitHub Actions #223: Die echte vollständige Transformationskette bestand bereits; fünf historische Endanker-Tests scheiterten.
- Der **vollständige `npm run check`- und `npm run build`-Lauf** ist **nach diesem Hotfix noch nicht bestätigt**. Nach dem Upload in GitHub Actions kontrollieren.

**Keine Datenmigration, kein Vault-Eingriff, keine Änderung am produktiven Anwendungscode.**
