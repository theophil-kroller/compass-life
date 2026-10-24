# 0.5.77.55.2 – Installieren

Voraussetzung: .55.1 ist bereits in GitHub `main` hochgeladen, aber nicht erfolgreich deployt (#218).

1. ZIP entpacken.
2. `client/compass755-bridge.js` ersetzen.
3. `client/src/occasion-compact-v577552.css` hinzufügen.
4. `tests/compass-057755-lightning-fast.test.mjs` ersetzen.
5. Alle drei Dateien in einem Commit auf `main` hochladen.
6. GitHub Actions `Deploy Compass Web` auf `npm run check` und `npm run build` prüfen.

Bei Buildfehler nicht erneut hochladen, sondern Fehlermeldung aus dem Lauf auswerten. Bestehende Nutzerdaten und Geräte-Vault bleiben erhalten.
