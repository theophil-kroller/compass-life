# Compass 0.5.68.1.1 – UX Hotfix: Gefühlswelt in Insights

Basis: 0.5.68.1. Reiner Frontend-Hotfix; keine Datenmigration, keine D1-Migration.

## Änderungen
- **Insights → Gefühlswelt** in der linken, aufklappbaren Insights-Navigation ergänzt. Öffnet direkt die bestehende Gefühlswelt mit Überblick, Chronik, Muster und Feeling Inspector.
- Beschriftung im kompakten Insights-Menü von „Gefühle“ auf „Gefühlswelt“ vereinheitlicht.
- Auf der gesperrten Heute-Ansicht die doppelten Schaltflächen „Gefühl erfassen – ohne Entsperren“ und „Gedanken erfassen – ohne Entsperren“ entfernt. Der globale Zugang in der oberen Leiste bleibt bestehen und ist auch bei gesperrtem Vault verwendbar, sofern der verschlüsselte Eingangspuffer auf diesem Gerät eingerichtet wurde.
- Doppelte Schnellaktion „+ Gefühl erfassen“ aus der Gefühlswelt-Zusammenfassung entfernt, da die globale Leiste bereits dieselbe Aktion anbietet.
- Versionsnummer von 0.5.68.1 auf 0.5.68.1.1 aktualisiert.

## Daten und Sicherheit
- Bestehende Gefühls-Check-ins bleiben im Vault, kein neues Datenformat.
- Keine Änderung an Verschlüsselung, Check-in-Speicherung, Synchronisierung oder bestehenden Analyseformeln.

## Tests
- 694/694 automatisierte Node-Tests bestanden (inklusive drei neuer Regressionstests für Navigation und Duplikate).
- Syntaxprüfungen `node --check` für main.js, feeling-interface und worker/index.js erfolgreich.
- `npm run build -w client` konnte nicht erfolgreich durchgeführt werden: Vite ist in der Umgebung nicht ausführbar (`vite: Permission denied`).
- Kein visueller Live-Browsertest oder Deployment ausgeführt.
