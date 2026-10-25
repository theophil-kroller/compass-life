# Compass Dream-Moon Quickfix (auf Basis 0.5.77.58.2)

**Voraussetzung:** Erfolgreich deployter Build #226 / alle Änderungen aus 0.5.77.58.2.

In GitHub im Repository `theophil-kroller/compass-life` genau diese zwei Dateien aus dem ZIP in die passenden Ordner hochladen/ersetzen:

1. `client/compass758-bridge.js`
2. `tests/compass-057758-project-columns.test.mjs`

Nicht `vite.config.js` ändern. Alle CSS-Dateien und der reine Insights-Design-Patch .59 bleiben unverändert.

## Fehlerbehebung

Der Mond-Button (`dream743-open`) wechselte auf `tab=insights` und `insightTab=dreamworld`. In Focus lenkte die allgemeine Render-Sperre *jede* Insights-Ansicht wieder auf Heute. Zusätzlich musste die Traumwelt auf sämtliche Lazy-Analytics-Module warten.

Der Fix lässt ausschließlich `dreamworld` auch in Focus zu und lädt das bereits vorhandene Traumformular sofort, ohne die übrigen Insights-Chunks. Der Cursor wird beim Antippen direkt auf „Erinnerung“ gesetzt; bei verzögertem Rendern greift ein zweiter Fokusversuch.

Keine Änderung an Tresor, Verschlüsselung, Traumdaten, Journal-Synchronisation oder den anderen Insights-Routen.

**Qualität:** ergänzte Verhaltens- und Regressionstests; der vollständige Produktionsbuild wird durch GitHub Actions nach dem Upload geprüft.
