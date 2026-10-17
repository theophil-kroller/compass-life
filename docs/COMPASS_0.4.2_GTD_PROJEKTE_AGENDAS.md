# Compass 0.4.2 – GTD, Projekte und Agenda-Kalender

**Status:** Quellcode-Patch (Beta), Browser-Build/UI und Cloudflare Live-Verhalten nach dem Deployment verifizieren. Garmin 0.4.1 bleibt unverändert.

## Unbedingt in dieser Reihenfolge

0. **Sicherung:** In Compass → System & Sync einen verschlüsselten Tresor-Export erstellen und sicher ablegen. Den Download nicht öffentlich teilen. Bestehende Aufgaben und Inbox-Einträge werden durch die Migration nicht gelöscht.
1. **D1 `compass-db`:** Den Inhalt von `worker/migrations/0005_gtd_projects_agendas.sql` in der Cloudflare D1 Console **einmalig** vollständig ausführen. `ALTER TABLE ADD COLUMN` ist nicht beliebig wiederholbar. Bereits ausgeführt? Nicht nochmals ausführen. Die Migration ergänzt vier Felder in `planning_tasks`, eine neue Tabelle `planning_projects` und `tags_json` in `items`.
2. **GitHub:** ZIP-Inhalt aus `Compass_0.4.2_GITHUB_PATCH.zip` in das Repository `theophil-kroller/compass-life` (Root, keine zusätzliche Ebene) laden, Änderungen auf `main` committen.
3. **Deployments:** GitHub Pages und unabhängig davon Cloudflare Worker **`compass-api`** auf neuen Commit kontrollieren. Gesundheitsprüfung: `https://compass-api.theophil-tiger.workers.dev/api/health` enthält `apiVersion:3`, `gtd:true`, `projects:true`.
4. **PWA:** Geöffnete Compass-Tabs neu laden, verschlüsselten Tresor entsperren, erst ein Testprojekt anlegen, dann eine undatierte Next Action und eine mit `#UKO` getaggte Inbox-Notiz. Über System & Sync synchronisieren und auf dem zweiten Gerät prüfen.
5. **Google Calendar:** Bei Bedarf erneut „Google Calendar verbinden (nur lesen)“ auswählen. Forecast zeigt Termine jetzt beim jeweiligen Tag an. Die Google-Lesefreigabe wird wie bisher im Arbeitsspeicher gehalten und ist keine permanente Kalenderanbindung.

## Neue Funktionen

- Projekte: Titel, gewünschtes Ergebnis, Bereich, optional echte Deadline, Status Aktiv / On Hold / Abgeschlossen. Aufgaben per Projekt-Feld zuordnen. Aktive Projekte ohne offene ausführbare Next Action werden hervorgehoben.
- Next Actions: Undatierte und datierte ausführbare Aufgaben. Flagged ist eine unabhängige Markierung, keine Kopie. On Hold fasst pausierte und Waiting-For-Aufgaben zusammen.
- Tags: Aufgaben **und Inbox-Notizen** mit Tags versehen. `#UKO` wird zu `uko` normalisiert; Matching zu geladenen Google-Termin-Namen erfolgt nach ganzen Wörtern (kein Teilstring-Match). Beim ausgewählten Termin die zugehörigen offenen Agenda-Punkte anzeigen und neue erstellen. Keine Änderungen in Google Calendar.
- Forecast: eine gemeinsame 14-Tage-Chronik mit echten Compass-Deadlines und Google-Terminen. „Work“ und „RESEARCH Blocker“ werden als optionale Zeitblöcke gefiltert; per Schalter wieder einblendbar. Ganztägige Calendar-Einträge werden als Ganztagsmarker gezeigt, nicht automatisch als vollständige Belegung behandelt.
- Dashboard: Aktivitäts-Karte mit ausreichender Spaltenbreite, getrennten Werten für Heute, diese Woche und die letzten bis zu 50 übertragenen Garmin-Sessions. Kein Garmin-Schlaf ohne echte Datenquelle.
- Weekly Review: aktive Projekt-, Next-Action- und Waiting-For-Zähler mit Navigation; bestehende Energie-/Aufmerksamkeits-Chips bleiben erhalten.

## Grenzen und Datenschutz

- Projekte, Aufgaben, Agenda-Tags und Inbox-Notizen werden **in Cloudflare D1 nicht Ende-zu-Ende-verschlüsselt** gespeichert. Vertrauliche Klientendetails nicht in Titel/Tags ablegen. Lokal werden Daten im passwortgeschützten Vault verschlüsselt gespeichert.
- Kalender-Einträge kommen nur aus dem **primären** Google-Kalender für die nächsten 21 Tage, nach separater OAuth-Lesefreigabe. Die Weboberfläche zeigt einen 14-Tage-Ausschnitt; andere Kalender und dauerhafter Hintergrund-Sync folgen später.
- Der Garmin-Connect-IQ-Quellcode bleibt in dieser Version unverändert; Next Actions, Projektzuordnung und Kalender-Agendas erscheinen noch nicht auf der Uhr. Dort werden weiterhin die bisherigen Heute-Aufgaben und Deadlines verwendet.
- Bei Änderungen am selben Projekt/Aufgabe auf zwei Geräten setzt ein Versionskonflikt ein, sodass keine stillschweigende Überschreibung geschieht. Der Projektkonflikt-Dialog ist einfach; bitte bei gleichzeitigen Änderungen vorsichtig arbeiten.
- Der vollständige Vite-Produktionsbuild und Browser-/Live-Deploy wurden in dieser Umgebung nicht verifiziert. Node-Syntaxprüfung, SQLite-Migration und automatisierte Funktionstests wurden ausgeführt.

## Prüfungen

- `node --check client/src/main.js`
- `node --test tests/*.test.mjs`
- SQLite-Migrationskette 0001–0005 angewandt und einen Datensatz mit neuen Feldern eingefügt.

**Rollback:** Vor einer Änderung D1-Backup/Bookmark und verschlüsselten Tresor-Export anfertigen. Bei Problemen zuerst Web-/Worker-Commit zurücksetzen und keine manuelle Rückmigration per DROP/DELETE durchführen. Da die Migration additiv ist, bleiben alte Daten dabei erhalten; die neuen Felder können bis zum nächsten Patch unangetastet bleiben.
