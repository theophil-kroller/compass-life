# Compass Life 0.5.77.18 – Kritischer Tresor-Entsperr-Hotfix

## Fehlerursache

Der Performance-Patch 0.5.77.17 ersetzte den Inbox-Navigationszähler durch `Object.values(state.records)` mit `isDreamRecord()`, vergaß aber, `isDreamRecord` aus `client/src/tasks.js` zu importieren. Der Zustand des Tresors konnte erfolgreich entschlüsselt werden, anschließend brach jedoch `chrome()` beim Rendern mit `ReferenceError: isDreamRecord is not defined` ab. Weil die Fehleranzeige ebenfalls `render()` aufrief, konnte nach dem Entsperren keine benutzbare Oberfläche erscheinen.

## Behebung

- Fehlenden Export explizit in `client/src/main.js` importiert.
- Regressionstest führt die tatsächlich aus `main.js` extrahierte Navigation mit einem entsperrten Testzustand aus: sowohl leerer Tresor als auch Inbox mit aktiven/archivierten/Dreams-Einträgen.
- Client- und Paketversion auf 0.5.77.18 erhöht.
- Keine Änderungen am `vault.js`, am Verschlüsselungsschlüssel, an IndexedDB, den Sync-Protokollen oder Worker/D1.

## Installation

PATCH_FROM_0.5.77.17.zip nur auf Version 0.5.77.17 anwenden. FULL_SOURCE.zip enthält den vollständigen Stand, falls ein anderer Ausgangsstand besteht. Nach dem Deploy ggf. einen normalen Hard-Refresh ausführen (Strg+F5), aber keinesfalls Browserdaten oder Website-Speicher löschen: Dort liegt der verschlüsselte Tresor.

## Prüfung

- `node --check client/src/main.js`
- `node --test tests/gtd-057718-unlock-shell.test.mjs` (2/2)
- `npm test` (vollständige Regressionstests)
- `npm run check -w worker` (Worker-Syntax)
