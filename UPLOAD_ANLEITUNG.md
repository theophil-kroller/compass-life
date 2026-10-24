# Compass Life 0.5.77.55 — Upload

**Voraussetzung**: Version 0.5.77.54 liegt bereits auf `main` (GitHub Actions #216 grün).

1. ZIP entpacken.
2. Unterordner `client` und `tests` mit identischer Ordnerstruktur in `theophil-kroller/compass-life` nach GitHub hochladen.
3. Bei bestehenden Dateien Ersetzen wählen. Alle Änderungen möglichst in **einem Commit** hochladen.
4. In GitHub Actions den Workflow „Deploy Compass Web“ beobachten. Tests UND Produktionsbuild müssen grün sein.
5. Nach dem Deploy Compass/PWA aktualisieren. Falls eine installierte PWA einen alten Stand cached, normal neu starten/aktualisieren – **niemals den Tresor löschen**.

## Bestehende Dateien ersetzen

- `client/vite.config.js`
- `tests/compass-057750-insights-nav.test.mjs`
- `tests/compass-057751-premium-ui.test.mjs`
- `tests/compass-057752-chart-first.test.mjs`
- `tests/compass-057753-finance-performance.test.mjs`
- `tests/compass-057754-on-demand.test.mjs`

## Neue Dateien anlegen

- `client/compass755-bridge.js`
- `client/src/fast-today-v57755.css`
- `tests/compass-057755-lightning-fast.test.mjs`

`client/src/main.js`, gespeicherte Nutzerdaten, Worker, D1, Vault und Kalenderzugänge **nicht** ersetzen.

## Woran du es erkennst

- Unter „Compass“ in der linken Seitenleiste erscheint der Focus/Extended-Umschalter.
- Im Focus-Modus sind Insights und Finanzen nicht sichtbar. Im Extended-Modus bleiben sie aufrufbar, ohne automatisch Analysen zu laden.
- Die große Kopfzeile mit „Insights/Heute/...“ und Datum erscheint nicht mehr.
- In „Heute“ öffnet der Inspector ohne Neuladen des restlichen Fensters; die Checkbox reagiert unmittelbar.
