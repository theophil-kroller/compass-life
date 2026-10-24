# Upload – Compass Life 0.5.77.57

Voraussetzung: 0.5.77.56 ist auf `main` (Workflow #220 erfolgreich).

In dein GitHub-Repository `theophil-kroller/compass-life` alle drei Dateien aus `client/` mit identischen relativen Pfaden hochladen:

- **Ersetzen:** `client/vite.config.js`
- **Neu:** `client/compass757-bridge.js`
- **Neu:** `client/src/mobile-workflow-v57757.css`

Optional: `tests/compass-057757-mobile-workflow.test.mjs` und die zwei Markdown-Dateien. Anschließend GitHub Actions › Deploy Compass Web prüfen (check und build). Erst nach einem grünen Lauf die installierte PWA neu öffnen/aktualisieren.

Keine Änderungen an `client/src/main.js`, kein Vault Reset, keine Neuinstallation nötig.
