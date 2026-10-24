# Upload-Anleitung – Compass 0.5.77.39

Dieses Paket baut auf **0.5.77.38** auf und enthält zugleich den nötigen Test-Hotfix für den letzten fehlgeschlagenen Deploy.

## Zu ersetzen im GitHub-Repository

- `client/strength-premium738-bridge.js`
- `client/src/strength-premium-v57738.js`
- `client/src/strength-premium-v57738.css`
- `tests/gtd-057726-nutrition-trends-missing.test.mjs`

## Vorgehen

1. ZIP entpacken.
2. Die vier Dateien unter exakt denselben Pfaden in dein GitHub-Repository hochladen und vorhandene Dateien ersetzen.
3. Commit abschließen.
4. Unter GitHub Actions prüfen, dass **Deploy Compass Web** erfolgreich durchläuft.
5. Danach sollte Compass in der Oberfläche **0.5.77.39** anzeigen.

## Kurztest nach dem Deploy

- Krafttraining öffnen.
- Prüfen, ob die Muskelkarte deutlich schlanker und näher an deiner Referenz wirkt.
- Prüfen, ob Vorder-/Rückansicht weiterhin korrekt reagieren.
- Ernährung → Tagesverlauf prüfen: rechts unter dem Kalorienwert sollte weiterhin die kleine kcal-Pille stehen und **kein breiter Aufklappbalken** mehr.

## Lokaler Prüfstatus dieses Pakets

- Syntaxprüfung der geänderten JS-Dateien: **bestanden**
- Smoke-Test der neuen Muskelkartenfunktionen: **bestanden**
- Vollständiger Produktionsbuild: muss nach Upload über GitHub Actions bestätigt werden.
