# Upload-Anleitung · Compass Life 0.5.77.52

**Voraussetzung:** Compass Life 0.5.77.51 ist bereits auf `main` und GitHub Actions #213 war erfolgreich.

1. ZIP entpacken.
2. Den Inhalt des `client/`- und `tests/`-Ordners nach GitHub `theophil-kroller/compass-life` hochladen, mit **unveränderter Verzeichnisstruktur**. Bereits vorhandene Dateien überschreiben, die neuen hinzufügen.
3. GitHub Actions → **Deploy Compass Web** prüfen. Sowohl `npm run check` als auch `npm run build` müssen grün sein.
4. Compass im Browser / als PWA aktualisieren. Falls alte Assets aus dem Cache angezeigt werden, App neu öffnen.

### Existierende Dateien ersetzen

- `client/vite.config.js`
- `tests/compass-057750-insights-nav.test.mjs`
- `tests/compass-057751-premium-ui.test.mjs`

### Neu hinzufügen

- `client/compass752-bridge.js`
- `client/src/chart-first-v57752.css`
- `tests/compass-057752-chart-first.test.mjs`

### Nicht überschreiben / nicht löschen

- `client/src/main.js`
- `client/src/insights.js`
- alle anderen Quellcodedateien, Nutzerdaten, Workflows und Cloudflare-Konfigurationen

Hinweis: Die Bridge transformiert die vorhandenen Quellcodedateien **beim Build**, deshalb müssen `main.js` und `insights.js` nicht manuell ersetzt werden.
