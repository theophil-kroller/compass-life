# Compass 0.5.77.40 — Deployment-Reparatur für GitHub Actions #200

**Voraussetzung:** Dateien aus dem bisherigen Compass-0.5.77.40-Upload sind bereits auf GitHub. Dies ist ein kleiner korrigierender Upload; es werden keine Trainingsdaten geändert.

## Hochzuladen (genau dieselben Pfade)

- `client/package.json` — ersetzen
- `client/strength-premium738-bridge.js` — ersetzen
- `tests/compass-057740-deploy-repair.test.mjs` — neu hinzufügen

### Was war fehlerhaft?

1. GitHub Actions #200 scheiterte bei zwei Release-Konsistenztests. `package.json` und `client/src/main.js` sind im bestehenden Repository noch 0.5.77.26; die vorige Änderung setzte nur `client/package.json` schon auf 0.5.77.40. Die Vite-Bridge aktualisiert die sichtbare App erst beim Kompilieren auf 0.5.77.40. Um die aktuelle Architektur nicht mit weiteren riskanten Großänderungen umzubauen, wird hier die Quellbasis für alle drei Dateien wieder auf 0.5.77.26 vereinheitlicht. Die UI bleibt nach dem Vite-Transform 0.5.77.40.
2. Der Aufruf `mountPremiumAnatomy(app)` fehlte nach `app.innerHTML=html;bind()`. Ohne ihn wäre der neue SVG-Muskelatlas leer geblieben. Die Bridge injiziert den Aufruf jetzt nach jedem Rendern.

## Teststatus

- Syntaxprüfungen für beide JS-Dateien: bestanden.
- Simulierter Vite-Transform der Integrationsstelle: bestanden.
- Der neue Test `tests/compass-057740-deploy-repair.test.mjs` prüft diese Invarianten beim nächsten GitHub-Lauf; die Bridge-Injektion wurde lokal mit einem aussagekräftigen Test-Fragment ausgeführt.
- Vollständiger `npm run check` + `npm run build`: in dieser Umgebung nicht ausführbar, weil kein vollständiger Repository-Checkout und kein npm-Netzzugriff vorhanden sind. GitHub Actions muss dies noch bestätigen.

## Installationsschritte

1. ZIP entpacken.
2. Die zwei bestehenden Dateien in GitHub ersetzen, die Testdatei neu hinzufügen, dann Commit.
3. Unter https://github.com/theophil-kroller/compass-life/actions überprüfen, dass `Deploy Compass Web` **alle** Phasen inklusive `Run npm run build` erfolgreich abschließt.
4. Im Browser bei Bedarf Seite hart neu laden (`Strg+Shift+R`) oder installierte PWA schließen und neu starten.
5. Krafttraining öffnen: Anatomiefiguren sollten erscheinen; Maus-Hover bzw. Finger-Tipp auf Muskeln soll ihre deutschen Namen anzeigen.
