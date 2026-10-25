# Compass Life 0.5.77.58 — GitHub-Upload

**Ausgangsbasis:** erfolgreich deployte Version **0.5.77.57.1** (GitHub Actions #222).

ZIP entpacken und die im ZIP enthaltenen Ordner `client/` und `tests/` **mit denselben Pfaden** in die Wurzel des GitHub-Repositories `theophil-kroller/compass-life` hochladen. Alle vorhandenen gleichnamigen Dateien ersetzen; neu hinzugefügte Dateien ebenfalls hochladen. Keine anderen Dateien löschen.

## Dateien

- `client/compass758-bridge.js` **NEU** — Projektdrei-Spalten-Ansicht, Inbox → Dreams
- `client/src/project-workspace-v57758.css` **NEU** — einheitliche kompakte Projekt-UX, responsiv
- `client/vite.config.js` **ERSETZEN** — neue Bridge an der letzten Stelle integrieren
- `tests/compass-057758-project-columns.test.mjs` **NEU** — UI-/Daten-/Navigationstests
- `tests/compass-057755-lightning-fast.test.mjs` **ERSETZEN** — aktualisierte Bridge-Reihenfolge
- `tests/compass-057756-workspace.test.mjs` **ERSETZEN** — aktualisierte Bridge-Reihenfolge
- `tests/compass-057757-mobile-workflow.test.mjs` **ERSETZEN** — aktualisierte Bridge-Reihenfolge
- `tests/compass-057757-full-transform-chain.test.mjs` **ERSETZEN** — komplette Produktions-Transformation am echten `client/src/main.js` inklusive .58 und Syntaxcheck

## Nach dem Upload

Unter GitHub → Actions kontrollieren, dass `npm run check` **und** `npm run build` erfolgreich sind. Den grünen Status nicht allein aus lokalen Unit-Tests ableiten. Erst danach die PWA neu laden.

Funktionsprüfung: Projekte → Ordner öffnen → Projekt auswählen → Aufgabe öffnen → Inspector schließen und neu öffnen. Danach Inbox → Eintrag öffnen → Dreams-Kategorie wählen → `Zu Dreams`; der Eintrag darf keine Aufgabe erzeugen und muss aus der Inbox verschwinden. Unter Dreams kontrollieren, dass Titel und Notiz erhalten sind.

**Hinweis:** Kein Vault-Migrationsschritt. Projekt-/Aufgaben-/Dreams-Daten werden weiterhin von der bestehenden Speicherung und Synchronisation verwaltet. Bei bestehendem Cloud/Vault vor Änderungen am Repository wie gewohnt eine verschlüsselte Sicherung aufbewahren.
