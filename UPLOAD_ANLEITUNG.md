# Hochladen: Compass Life 0.5.77.54

**Voraussetzung:** 0.5.77.53 muss auf `main` sein. GitHub-Actions-Lauf #215 war erfolgreich.

1. ZIP entpacken und alle **Dateien unter `client/` und `tests/`** mit unveränderter Unterordnerstruktur in das GitHub-Repository `theophil-kroller/compass-life` hochladen.
2. Bestehende Dateien ersetzen, neue Dateien zusätzlich anlegen. Bitte keine Dateien aus dem ZIP ins Repo-Hauptverzeichnis legen.
3. Möglichst gemeinsam committen. Unter GitHub Actions den Lauf **Deploy Compass Web** kontrollieren: alle Node-Tests sowie `vite build` müssen grün sein.
4. Nach dem Deploy Compass neu laden; bei installierter PWA ggf. die App schließen und neu öffnen. **Nicht den Vault löschen.**
5. Prüfen: Gesperrt = grüne Vollfläche; Entsperren = Heute; Wechsel zu Insights = zunächst kurzer Modulfortschritt; Wechsel zu Finanzen = eigener Modulfortschritt. Zurück zu Heute sollte direkt möglich sein.
6. Ladefehler: Kommt beim ersten Offline-Aufruf eines noch nicht zwischengespeicherten Moduls ein Fehler, Internetverbindung prüfen und auf **Erneut versuchen** klicken. Erstmalig geladene Komponenten verbleiben danach im aktuellen App-Prozess.

## Ersetzte Dateien
- `client/vite.config.js`
- `tests/compass-057750-insights-nav.test.mjs`
- `tests/compass-057751-premium-ui.test.mjs`
- `tests/compass-057752-chart-first.test.mjs`
- `tests/compass-057753-finance-performance.test.mjs`

## Neue Dateien
- `client/compass754-bridge.js`
- `client/src/lazy-routes-v57754.js`
- `client/src/on-demand-v57754.js`
- `client/src/on-demand-v57754.css`
- `tests/compass-057754-on-demand.test.mjs`

Die große `client/src/main.js` wird **nicht** überschrieben. Sie wird wie zuvor über die Vite-Bridge in der Build-Pipeline generiert und transformiert.
