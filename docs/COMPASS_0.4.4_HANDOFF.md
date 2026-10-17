# Compass 0.4.4 – GTD-Perspektiven & Forecast-Layout

**Basis:** `Compass_0.4.3_FULL.zip` (mit Migration `0006_gtd_context_review.sql`).  
**Release-Typ:** kleiner, konsolidierter GitHub-Patch. **Keine neue D1-Migration.**  
**Status:** Quellcode erstellt; Node-Prüfungen bestanden. Live-Browser- und GitHub-Pages-Deployment stehen aus.

## Umgesetzt

- **G-02 / Flagged:** nur explizit markierte, offene Aufgaben (`flagged === true`). Bisher konnte der Inspector beim Wechsel aus einer anderen Perspektive einen alten, nicht geflaggten Eintrag zeigen; nicht zugehörige Auswahl wird jetzt zurückgesetzt. Flagge direkt in der Liste an-/abschaltbar.
- **G-01 / Next Actions:** ausschließlich verfügbare Aufgaben, unter Berücksichtigung des GTD-Workflows, zukünftiger Defer-Daten und pausierter Projekte. Bei leerer Perspektive verständlicher Hinweis mit Links zu Inbox und Review statt leerer Ansicht. Kontextfilter bleibt erhalten.
- **G-03 / On Hold:** getrennte Abschnitte für „Waiting For“, explizit pausierte Aufgaben und Aufgaben, die durch pausierte Projekte blockiert sind. Pausierte Projekte sind aufrufbar.
- **G-04 / Dreams:** Einträge erfassen, auswählen, bearbeiten und kategorisieren. Aus dem Weekly Review lassen sich Inbox-Einträge nach Dreams einordnen. Dream kann wieder in die Inbox oder als Next Action übernommen werden. Klassifizierung über die bestehenden synchronisierten Inbox-Tags `dreams` und `dream-…` (kein neues Datenbankfeld). Dreams erscheinen nicht mehr als offene Inbox-Einträge.
- **F-04 / Forecast-Overlay:** Desktop-Forecast erhält 3 explizite Grid-Spalten (Kalenderleiste / Timeline / Inspector). Auf schmaleren Ansichten wird der Inspector darunter angeordnet. Agenda-Paneel wird beim Öffnen fokussiert; Formular-/Textfelder können nicht die rechte Spaltenbreite sprengen.

## Bewusst NICHT in 0.4.4

- OmniFocus-Dreispaltenprojektverwaltung, Folder-Hierarchie und Sequential/Parallel: **0.4.5**.
- Inspector mit vollständiger Trennung von Duration / Defer / Planned / Due: **0.4.6**.
- Geführter Weekly Review als Item-Liste statt Dropdown: **0.4.7**. (Neue Dreams-Zuordnung ist schon im bestehenden Review verfügbar.)
- Nutzerkonfigurierbare Forecast-Icons/-Regeln und Erholung: **0.4.8**.
- Activities Papierkorb, Dashboard-Timeline und Location Tags: **0.4.9–0.4.11**.
- Garmin-Quellcode: **unverändert**. Die bereits entwickelte und getestete Uhr-App ist nicht Teil dieses Patches.

## GitHub-Upload (bestehendes 0.4.3-Projekt)

1. **Vorher** in Compass ein verschlüsseltes Backup erstellen.
2. `Compass_0.4.4_GITHUB_PATCH.zip` entpacken.
3. **Den Inhalt** des ZIP (Dateipfade ab `client/`, `tests/`, `docs/`) im Root des bestehenden Compass-GitHub-Repositories hochladen und gleichnamige Dateien überschreiben. **Nicht** den ZIP als Datei ins Repo legen; **nicht** das gesamte Repo durch den PATCH ersetzen.
4. GitHub Actions `Deploy Compass Web` abwarten. Bei einem Fehler Log ansehen, nicht blind weiteren Patch hochladen.
5. Browser nach Deployment ggf. neu laden (PWA-Service-Worker sollte aktualisieren). Eine bestehende entsperrte Sitzung wird nicht verändert.
6. Für **0.4.4 ist keine D1-Migration und kein Worker-Deployment notwendig**, sofern 0.4.3/0006 auf dem Server bereits korrekt läuft.

## Manuelle Abnahme nach Deployment

- **Flagged:** Eine nicht geflaggte Aufgabe auswählen, nach Flagged wechseln → sie darf weder in der Liste noch als irreführender aktueller Inspector-Eintrag sichtbar sein. Eine explizit markierte Aufgabe erscheint. Flagge entfernen → sie verschwindet.
- **Next Actions:** Task ohne Datum und `next`-Workflow ist sichtbar. Mit Defer in der Zukunft oder Projekt „On Hold“ nicht sichtbar. Bei leerem Ergebnis Review-Link bedienbar.
- **On Hold:** Waiting-For-Aufgabe, On-Hold-Aufgabe und eine Aufgabe aus pausiertem Projekt sind in getrennten Gruppen sichtbar. Projekt-Link öffnet zugehöriges Projekt.
- **Dreams:** Eine neue Idee anlegen, Kategorie ändern, Reload, zurück in Inbox, von dort über Review nach Dreams, danach als Next Action aktivieren. Das Ganze am zweiten Gerät nach Sync nachprüfen.
- **Forecast:** Großes Desktop-Fenster, Termine anklicken → Gesprächsagenda in rechter Spalte ohne Text-Überlagerung und vollständige Formularfelder; ebenso schmales Browserfenster testen. Google Calendar bleibt absichtlich read-only.
- **Sync:** Bestehende Aufgaben und Projekte erhalten; keine Sync-/D1-Schemafehler. Eine Dream-Änderung auf Gerät A sollte nach Synchronisation auf Gerät B sichtbar sein.

## Prüfergebnisse (Build-Umgebung)

- `npm run check`: **36/36** automatisierte Node-Tests erfolgreich inklusive fünf neuer Regressionschecks.
- `node --check client/src/main.js`: erfolgreich.
- ZIP-Inhalte / Änderungen relativ zum originalen `Compass_0.4.3_FULL.zip`: werden bei Paketierung gegengeprüft.
- **Nicht durchgeführt:** Vite-Produktionsbuild (npm-Abhängigkeiten hier nicht installiert), visuelle Browser-End-to-End-Tests, echte Cloudflare-D1-Synchronisation über zwei Geräte. Diese müssen bei Deployment geprüft werden.
