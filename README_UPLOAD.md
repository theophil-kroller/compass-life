# Compass Life 0.5.77.59.29 — Workflow #259 Fix + Lyttos-Frühstück

**Direkter GitHub-Upload. Keine lokalen Skripte oder Python erforderlich.**

Basis: GitHub `main` Commit `878a4092b43a4bcad667be9dc5c87ef68dcb6fe3` (Workflow #259 fehlgeschlagen).

## Upload auf Branch main

ZIP entpacken. Verzeichnispfade wie im ZIP beibehalten und **alle enthaltenen Dateien** hochladen:

- `client/vite.config.js` – bestehende Datei **ersetzen**, historische `.50`–`.58`-Kette unverändert; der bereits gelieferte `.28`-Baustein wird wieder wirksam registriert.
- `client/compass5929-breakfast-bridge.js` – **neue Datei** mit vorgefertigter Lyttos-/KoRo-Frühstücksbibliothek und Version `.29`.
- `tests/compass-05775929-breakfast-deploy.test.mjs` – **neue Regressionstests** zur alten Vite-Reihenfolge und zu Rezept-/Mengenberechnung.

Keine Vault-Migration, keine D1-Migration, kein Reset; vorhandene Fotos und Coach-Logs bleiben unverändert.

## Frühstücksvarianten

Neues Schnellmenü: Lyttos Greek Style Natur 150 g plus ein Esslöffel Honig (15 g angenommen) plus wahlweise ein Esslöffel KoRo 100%-Pistazienmus oder schwarzes Bio Tahini (15 g angenommen). Zwei komplette Rezeptkacheln + vier separat buchbare Zutaten. Im Ernährungsjournal sind die Gramm-Mengen direkt im Mengenfeld editierbar (Beispiel: `150 g Joghurt + 10 g Honig + 20 g Pistazienmus`). Bei Änderung werden kcal und Makros für die Komponenten neu berechnet.

KoRo-Werte nach Hersteller: Pistazienmus 658 kcal/100 g (MUS_060), schwarzes Tahin 616 kcal/100 g (MUS_037). Lyttos-Werte derzeit nur vorläufig aus Fitatu: 115 kcal/100 g; Etikett muss noch mit realem Produkt abgeglichen werden. Honigwert generische Schätzung. Portionen etwa 318 / 311 kcal.

## Workflow #259

Der Fehler lag vollständig in 13 historischen Vite-Konfigurationstests, die einen unveränderten PWA-/Bridge-Abschnitt erwarten. Beim vorigen Patch wurde `compass5928VtaperLuxBridge()` in die abschließende alte `.50`–`.58`-Kette gesetzt. Der neue Fix stellt genau die historisch überprüfte Array-Liste wieder her und registriert die neuen Bausteine danach über `compassConfig.plugins.push(...)`. Dadurch ist die alte Test-Reihenfolge unverändert, und die neuen Module werden trotzdem auf die Quellen angewendet.

## Teststatus

- Node-Syntaxprüfungen für beide neuen/ersetzten JavaScript-Dateien erfolgreich.
- 5 neue Tests bestanden, inklusive alter Vite-Regex-Assertions und Kalorienberechnung nach individuell geänderten Gramm.
- 7 vorherige `.28`-Integrationstests auf Basis des unveränderten `.28`-Bausteins bestanden.
- Der vollständige GitHub `npm run check` und `npm run build` kann erst nach deinem Upload im GitHub-Workflow bestätigt werden. Vorher keine Erfolgsbehauptung.
