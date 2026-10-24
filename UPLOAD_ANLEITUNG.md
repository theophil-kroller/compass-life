# Upload: Compass Life 0.5.77.51

**Wichtig:** Als Basis muss `0.5.77.50` (GitHub Actions #212, erfolgreich) im Repository vorhanden sein.

1. Das ZIP lokal entpacken.
2. Den Inhalt der Unterordner `client/` und `tests/` in GitHub `theophil-kroller/compass-life` an **die identischen Pfade** hochladen.
3. Bei den bereits existierenden Dateien Ersetzen/Overwrite bestätigen. Für neue Dateien den Pfad unbedingt beibehalten.
4. Alle Dateien möglichst in einem Commit hochladen und anschließend **Actions → Deploy Compass Web** prüfen. Sowohl `npm run check` als auch `npm run build` müssen grün sein.
5. Nach erfolgreichem Deploy die App aktualisieren. Installierte PWAs können das App-Icon weiterhin zwischenspeichern; bei Bedarf die Verknüpfung neu installieren. Den Tresor dafür nicht löschen.

## Zu ersetzende Dateien
- `client/vite.config.js`
- `client/index.html`
- `client/public/compass-icon.svg`
- `client/public/icon-192.png`
- `client/public/icon-512.png`
- `tests/compass-057750-insights-nav.test.mjs` (bestehenden Integrationstest anpassen)

## Neue Dateien
- `client/compass751-bridge.js`
- `client/src/premium-ui-v57751.css`
- `client/public/apple-touch-icon.png`
- `tests/compass-057751-premium-ui.test.mjs`

## Unverändert
`client/src/main.js`, GTD-Aufgaben, gespeicherte Daten, Today-Handler, Kalender-API, Vault, D1/Worker, Sync.
