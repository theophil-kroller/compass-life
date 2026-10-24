# Compass 0.5.77.55.1 — HOTFIX

1. ZIP entpacken. **Nur die beiden enthaltenen Code/Testdateien** in die entsprechenden Repository-Pfade hochladen und die vorhandenen Versionen überschreiben.
2. `client/compass755-bridge.js` ersetzen.
3. `tests/compass-057755-lightning-fast.test.mjs` ersetzen.
4. Alle Änderungen in einem Commit auf `main` hochladen; GitHub Actions soll bei **Tests und `npm run build`** grün werden.
5. Danach Compass neu laden. Es sollte die Version `0.5.77.55.1` anzeigen.

**Nicht** aus dem alten .55-Patch `vite.config.js` erneut hochladen; es liegt bereits auf `main`. Keine Passwörter, lokalen Vault-Dateien oder Sync-Daten löschen.

Nach erfolgreichem Build kannst du im lokalen Performance-Panel die Messung aktivieren und 2–3 Entsperrvorgänge durchführen. Der folgende Export zeigt drei getrennte Stufen; der .54-Export konnte den Entsperrvorgang nicht analysieren.
