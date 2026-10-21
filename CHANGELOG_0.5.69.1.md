# Compass 0.5.69.1 – GitHub Actions Deployment-Fix

## Fehlerursache (Runs #127 und #128)

GitHub hat den Upload angenommen und `npm install` erfolgreich ausgeführt. Im Schritt `npm run check` schlugen 38 von 694 Tests fehl.

- 36 historische Tests erwarteten weiterhin einen exakt fest einprogrammierten Versionsstring `0.5.68.1.1`, obwohl die neue Anwendung die Version `0.5.69` hatte.
- Zwei Quick-Capture-Tests isolierten einen Abschnitt aus `main.js`. Darin war inzwischen `readQuickPublic()` als unmittelbarer Initialisierer eingefügt, ohne dass diese Funktion in der isolierten Testumgebung verfügbar war.

## Korrektur

- Historische Tests prüfen jetzt das semantische `0.5.x`-Versionsformat statt einer dauerhaft veralteten Versionsnummer.
- Ein zusätzlicher Release-Konsistenztest vergleicht die exakte Version in `package.json`, `client/package.json` und `client/src/main.js`.
- Quick-Status-Variablen wurden aus dem isolierten Capture-Testabschnitt verschoben, ohne das Laufzeitverhalten zu ändern.
- Die Version wurde auf **0.5.69.1** erhöht.
- **PATCH und FULL ZIP haben jetzt korrekte relative Repository-Pfade direkt im ZIP-Stammverzeichnis** (keinen übergeordneten Projektordner).

## Prüfstand

- 696/696 Node-Tests bestanden.
- `npm run check -w worker` bestanden.
- JS-Syntaxprüfung bestanden.
- Vite-Produktionsbuild **hier nicht ausführbar** (`vite: not found`, keine installierten Node-Module); der GitHub-Workflow muss den Build nach der Korrektur ausführen.

## Installationshinweise

- Der Patch ist für das bereits hochgeladene 0.5.69 aus den fehlgeschlagenen Läufen #127/#128 gedacht.
- Vor Änderungen ein Backup des lokalen Tresors machen.
- Keine D1-Migration und kein Vault-Reset.
- Im Repository-Stammverzeichnis entpacken, geänderte Testdateien **mit hochladen**, committen.
- In GitHub Actions auf einen neuen grünen `Deploy Compass Web`-Lauf warten, anschließend die Version im Compass-Menü prüfen.
