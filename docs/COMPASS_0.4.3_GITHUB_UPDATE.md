# Compass 0.4.3 – konsolidierter GitHub-Patch auf Basis 0.4.2

**Stand:** 18.10.2026 · **Status:** lokaler Teststand / zur Prüfung nach Deployment

Dieser Patch basiert **ausschließlich auf dem wiedergefundenen Originalarchiv `Compass_0.4.2_FULL.zip`**. Die vorherigen, nicht auffindbaren ZIP 1–3 der ursprünglich diskutierten 0.4.3-Umsetzung wurden **nicht** als vollständige Artefakte rekonstruiert. Daher ist die hier enthaltene Funktionalität nach dem Upload im Browser zu prüfen und fehlende Punkte anschließend zu ergänzen.

## Enthalten

- **GTD-Aufgaben:** neues optionales Feld „Frühestens ab“ (`defer_until`) – nicht als Deadline behandeln. Aufgeschobene Aufgaben werden erst ab dem angegebenen Datum unter Next Actions angezeigt.
- **Kontexte:** Tags wie `@büro` / `@laptop` und Kontextfilter in Next Actions.
- **Aufwand:** optionaler geschätzter Aufwand in Minuten (5–1440), ohne automatische Zeiterfassung.
- **Projekt-Review:** individuell einstellbares Review-Intervall (1–90 Tage), letzter Review-Zeitpunkt und „Jetzt geprüft“-Aktion. Fällige aktive Projekte erscheinen im geführten Review.
- **Inbox → Aufgaben:** im Review über „Next Action“, „Waiting For“ oder „On Hold“ in eine echte Aufgabe übernehmen. Ursprünglicher Inbox-Eintrag wird zur Vermeidung von Doppelungen archiviert; Synchronisierung wird vorgemerkt.
- **Review-Hilfen:** Energie- und Aufmerksamkeitswahl für Inbox-Einträge; diese Metadaten bleiben bislang **nur im verschlüsselten lokalen Tresor**.
- **API/D1:** neue additive Migration `0006_gtd_context_review.sql`, zusätzliche Felder in Task-/Projekt-API, Schema-Prüfung über `/api/health` (`apiVersion:4`). Der Client versucht keinen Cloud-Sync gegen einen nicht passend migrierten Worker.
- **Regressionsschutz:** bisherige Tests sowie neue Tests für Datum, Kontexte, Aufwand, Review-Intervalle, Schema-Status und Migration.

## UNBEDINGT: Deployment-Reihenfolge

1. **Backup:** Compass öffnen → System & Sync → „Verschlüsseltes Backup herunterladen“. Datei sicher privat verwahren. Falls möglich, zusätzlich vor der Migration einen Cloudflare D1-Backup-/Bookmark-Snapshot erstellen. Vor den folgenden Schritten keine Daten löschen.
2. **Alte Version prüfen:** Cloudflare-Datenbank `compass-db` muss das 0.4.2-Schema mit `0005_gtd_projects_agendas.sql` haben. Das 0.4.2-Problem `items.tags_json` muss behoben sein. Bereits ausgeführte Migrationen **nicht nochmals in die D1-Konsole kopieren**.
3. **Migration 0006 ausführen:** Inhalt von `worker/migrations/0006_gtd_context_review.sql` auf deiner **bestehenden** Compass-D1-Datenbank **genau einmal** ausführen, vorzugsweise per Wrangler-Migrationssystem. Kein neues DB-Projekt anlegen. Bei manuellem SQL-Apply die Migration nicht später nochmals automatisch ausführen (D1-Migrationshistorie beachten).
4. **Cloudflare Worker aktualisieren:** Die geänderten Dateien unter `worker/` aus dem PATCH ins Repository übernehmen und Worker über `npm run deploy:api` / Wrangler veröffentlichen. GitHub Pages aktualisiert den Worker **nicht** automatisch.
5. **Gesundheitsprüfung:** `https://<dein-worker>.workers.dev/api/health` prüfen. Erwartet: `apiVersion:4`, `release:"0.4.3"`, `schema.ready:true`. Wenn `schema.ready:false`, erst `schema.missing`/`schema.requiredMigration` korrigieren.
6. **GitHub:** ZIP **entpacken**, den enthaltenen Verzeichnisbaum ins bestehende GitHub-Repository übernehmen (Root, **keinen zusätzlichen Ordner**). Geänderte Dateien ersetzen; bestehende andere Dateien beibehalten. Commit auf `main` und GitHub Actions Build prüfen. `client/public/runtime-config.json`, `worker/wrangler.jsonc` und persönliche Secrets müssen für diesen Patch **nicht** überschrieben werden.
7. **Geräteprüfung:** Browser/Android-PWA aktualisieren, Tresor entsperren, unter System & Sync einmal manuell synchronisieren. Ein Test-Projekt und eine Test-Aufgabe mit Kontext, Startdatum und Aufwand anlegen, prüfen und auf dem Zweitgerät wiederfinden.

### Wichtige Besonderheiten

- Der PATCH ist **nicht** das gleiche wie der FULL Build. Der PATCH enthält nur gegenüber dem 0.4.2-Original geänderte oder neue Dateien. `Compass_0.4.3_FULL.zip` dient als Referenz / Notfallvergleich; **nicht** als blindes Überschreiben persönlicher Cloud-Konfiguration.
- **Rollback:** Falls das Webfrontend Probleme hat, den letzten GitHub-Web-Commit zurücksetzen und bei Bedarf den Worker auf seine vorherige Version zurücksetzen. Die Migration 0006 ist additiv und sollte **nicht** durch `DROP TABLE` oder ähnliches rückgängig gemacht werden. Ältere Worker ignorieren die neuen Spalten normalerweise.
- Neue Task-/Projektfelder setzen einen aktiven 0.4.3-Worker voraus. Werden Frontend und Worker in falscher Reihenfolge aktualisiert, können neue Felder nicht zuverlässig synchronisiert werden.
- Es wurde **kein** automatischer Cloud- oder Android-/Garmin-End-to-End-Test ausgeführt.

## Teststatus

- `npm run check`: **31/31 Node-Tests bestanden**.
- `node --check client/src/main.js`: **bestanden**.
- D1-Schema `0001–0006` in SQLite: **Migrationen erfolgreich**.
- SQL INSERT/UPDATE für neue Task-/Projektfelder: **erfolgreich**.
- `npm run build` (Vite), GitHub Actions, Wrangler-Cloud-Deploy und echte Gerätesynchronisation: **noch nicht verifiziert**. Die Installation der npm-Pakete war in dieser Umgebung ohne erreichbare Registry nicht möglich.

## Bewusst noch nicht enthalten

- Vollständiges sequenzielles OmniFocus-artiges Next-Action-Management.
- Lernende Aufwandsschätzung / Fokus-Timer aus 0.4.3 (die separate Garmin-Zeiterfassung aus früheren Builds bleibt unverändert).
- Local-LLM-Guidance und automatisches „What's Next?“-Ranking.
- Automatisierte Kalender-Zeitblockplanung.
- Sicherungsnachweis, dass alle ursprünglich besprochenen ZIP-1–4-Änderungen enthalten sind.

**Bitte Rückmeldung zum tatsächlichen 0.4.3-Verhalten nach dem Upload geben. Diese Version ist eine klar abgegrenzte, konsolidierte Weiterentwicklung von 0.4.2, keine Behauptung vollständiger Rekonstruktion der verschollenen Teilpakete.**
