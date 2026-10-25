# Compass 0.5.77.59.3 – Insights-Reiter und Focus nach Entsperren

**Basis:** Der zuletzt hochgeladene Stand mit UI-Patch 0.5.77.59.2.

## GitHub-Upload

Im Repository `theophil-kroller/compass-life` die Verzeichnisstruktur beibehalten und diese Dateien hochladen:

1. **`client/vite.config.js` – bestehende Datei ersetzen.** Nur die Registrierung von `compass7593UxBridge` ist neu; Vite/PWA-Einstellungen und die finalen .57/.58-Bridges bleiben unverändert.
2. **`client/compass7593-ux-bridge.js` – neue Datei hinzufügen.** Enthält die guarded UI-Änderungen.
3. **`tests/compass-0577593-ux.test.mjs` – neue Datei hinzufügen.** Regressionstests.

Bitte die bestehende `client/public/insights-streamline-v577591.css` unverändert lassen. Keine D1-, Cloudflare-, Vault- oder Datenmigration.

## Verhalten

- `Insights → Leben & Orte → Erholung` zeigt wieder dieselben Unterreiter wie `Gefühlswelt`, `Berührung & Nähe`, `Traumwelt` und `Orte & Weltkarte`.
- Auch die externen Routen `Aktivitäten` und `Fortschritt` zeigen ihre jeweilige Insights-Untertab-Navigation.
- Nach erfolgreichem Entsperren setzt Compass den Ansichtsmodus auf **Focus** und öffnet standardmäßig **Heute**. Die bisherige Sitzungsauswahl `Extended` wird damit zurückgesetzt.
- Explizite Deep Links wie `?view=projects` und die Schnellaufnahme `?capture=1` bleiben erhalten.
- Während der entsperrten Sitzung kann weiter auf `Extended` gewechselt werden.
- Nach fehlgeschlagenem Entsperren wird der Modus nicht zurückgesetzt.

## Qualität

- 5 lokale Node-Regressionstests bestanden.
- Vite-Konfigurationsänderung gegen den GitHub-Original-Blob verifiziert: keine unbeabsichtigten Änderungen.
- Die beiden externen Ansichten wurden zusätzlich zur gemeldeten Erholungsroute mit korrigiert.
- Der vollständige Vite-Produktionsbuild und der visuelle Browser-Test müssen nach Upload in GitHub Actions / der deployten App überprüft werden.

**Versionsanzeige:** Weiterhin `0.5.77.58.2` – die Änderung wird ohne Versionsanker-Änderung in die bestehende Transformationskette eingefügt.
