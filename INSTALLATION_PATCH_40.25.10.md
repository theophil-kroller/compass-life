# Compass Life 0.5.77.59.40.25.10 – Web + Garmin DELTA-PATCH

**Zielbasis:** Bereits vollständig eingespielter Web-Build `0.5.77.59.40.25.9` und Garmin Chrono `0.5.12.6`.
**Ergebnis:** Web `0.5.77.59.40.25.10`, Garmin `0.5.12.7`.

## Inhalt

Dieser Patch enthält nur die gegenüber dem Zielstand neu benötigten bzw. zu ersetzenden Quelldateien, nicht die gesamte Anwendung und keine historischen Assets. Die Dateien entsprechen bytegenau den gleichnamigen Dateien des korrigierten Full-Source-Pakets.

WICHTIG: Im Gegensatz zum vorherigen unvollständigen 0.5.77.59.40.25.10-Web-Patch sind **`client/src/main-full-v57759402510.js`, `client/src/ars-vivendi-lock-full-v5775922.js`, `client/vite.fullsource.config.js`, Root-/Client-`package.json` und `.github/workflows/deploy-pages.yml`** mit enthalten. Diese Dateien sind notwendig, damit die in 0.5.77.59.40.25.9 bereits transformierte Anwendung als Build-Einstiegspunkt eingesetzt wird. `client/vite.config.js` bleibt als historische Quelle vorhanden, wird aber vom Snapshot-Build nicht benutzt.

## Einspielen

1. VORHER: Sicherung des aktuellen Repositories erstellen. Sicherstellen, dass Web `.40.25.9` und Garmin `.0.5.12.6` tatsächlich vollständig eingespielt sind. Dieser Patch repariert keine ausgelassenen Vorgänger-Releases.
2. ZIP entpacken; **Inhalt direkt in den Root des GitHub-Repositories** hochladen (Pfade beibehalten, vorhandene Dateien ersetzen). Keine weitere Unterordner-Ebene anlegen. Verstecktes Verzeichnis `.github` unbedingt mit hochladen.
3. GitHub Actions (`Deploy Compass Web`) erwartet Node 22, führt `npm install`, `npm run check:deploy`, danach `npm run build` aus. Bei fehlgeschlagenem Build nicht deployen.
4. **Worker separat:** Vor einem Deploy des aktualisierten Workers die D1-Migration `worker/migrations/0020_watch_session_revision.sql` gegen die richtige Datenbank einspielen, dann Worker deployen (`npm run db:remote`, `npm run deploy:api`). GitHub Pages aktualisiert den Worker nicht automatisch.
5. **Garmin separat:** Das aktualisierte `garmin/CompassWatch/source/CompassApp.mc` mit Connect IQ SDK für die fēnix 7S kompilieren und auf die Uhr installieren. GitHub Pages installiert keine Watch-App.
6. Ende-zu-Ende-Test mit echter Uhr: 25-Minuten-Forschungspomodoro, Zwischensync, Session-Ende/Final-Sync; keine Doppelzählung; korrekte Anzeige von Forschung und nachträgliche Projektzuordnung.

## Validierungsstatus

- ZIP-Einträge wurden bytegenau mit dem zuvor erstellten Full-Source-Paket verglichen.
- Der `npm run test:release`-Test wurde auf dem Full-Source-Baum mit 24/24 bestandenen Tests ausgeführt.
- **Nicht als erfolgreich geprüft:** kompletter Vite-Produktionsbuild, erfolgreicher GitHub-Actions-Deploy, Cloudflare-Migration/Worker im Produktivbetrieb und Garmin-Hardwarekompilierung. Der Vite-Build konnte hier mangels installierbarer NPM-Abhängigkeiten nicht erfolgreich durchgeführt werden.
- Vorangegangener Legacy-Gesamttest des Full Package: 1652 von 1671 bestanden; diese alten Transformationsketten-Tests werden nicht von `check:deploy` ausgeführt. Details in `README_FULL_SOURCE_40.25.10.md`.

**Nicht anwenden**, wenn `.40.25.9` nicht wirklich installiert wurde oder das Repository nach einem fehlgeschlagenen Upload einen unbekannten Mischstand enthält. In dem Fall zuerst den Repository-Stand vergleichen bzw. den Full-Source-Build benutzen.
