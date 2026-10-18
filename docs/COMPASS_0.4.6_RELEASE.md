# Compass 0.4.6 – kombinierter Patch aus 0.4.5 + 0.4.6

**Basis:** `Compass_0.4.4_FULL(1).zip`. **Release:** `0.4.6-alpha.1`. **Ziel:** vorhandenes GitHub-Repository, nur Dateien überschreiben, die im Patch enthalten sind. **Kein Full Build.**

## Umfang

### 0.4.5 – OmniFocus-inspirierter Projektworkspace

- Drei Bereiche: **Ordner/Projekte links, Aufgaben/Hierarchie in der Mitte, Inspector rechts**; kompakter Fokusmodus blendet die Projektnavigation vorübergehend aus.
- Verschachtelte Ordner und Projekte: `kind`, `parentId`, `sortOrder` als synchronisierte Felder.
- Projekttypen **Parallel**, **Sequential** (nur der erste offene, verschachtelte Ausführungspfad wird verfügbar) und **Single Actions** (unabhängige Einzelaktionen ohne sequentielle Sperre).
- Verschachtelte Aufgaben per `parentTaskId`, Unteraufgaben anlegen und Aufgaben mit Auf/Ab neu sortieren. Ungültige und zyklische Hierarchien werden lokal und serverseitig zurückgewiesen.
- On Hold eines Elternordners/-projekts sperrt Next Actions aller Kinder. Abgeschlossene Projektstruktur bleibt erhalten.
- Vorhandene Projekte bleiben nach Migration auf oberster Ebene mit Typ **Parallel**; die bestehenden Aufgaben bleiben erhalten.

### 0.4.6 – Inspector & Date Logic

- **Duration** = geschätzte Minuten, kein Datum.
- **Defer** = frühester Start (versteckt Next Actions davor; ist **keine Deadline**).
- **Planned** = gewünschter Bearbeitungstag, in Heute **und** Forecast sichtbar (keine Überfälligkeit allein aufgrund von Planned).
- **Due** = tatsächliche Frist und Grundlage für Überfälligkeit/Deadlines in Forecast.
- Die drei Datumsfelder sind unabhängig, mit `+1d`, `+1w`, `+1m` und **Löschen**; Datumskürzel übernehmen den bestehenden Feldwert oder beginnen bei heute. Die Änderung wird mit **Speichern** übernommen.
- Alle vier Werte werden separat persistiert und über vorhandene Konfliktbehandlung synchronisiert. Datumsänderungen benötigen keine zusätzliche D1-Migration, die Hierarchie dagegen schon.

## WICHTIG: Datenbank & API aktualisieren

Dieser Patch enthält **`worker/migrations/0007_project_hierarchy.sql`** (nur `ADD COLUMN` und Indizes; kein Löschen alter Daten), sowie Änderungen am Worker.

1. Vorher aus Compass ein **verschlüsseltes Backup** der Daten sichern. Sicherstellen, dass frühere D1-Migrationen **0001–0006** bereits angewendet wurden.
2. ZIP entpacken und **Inhalt** ab Repo-Wurzel (`client/`, `worker/`, `tests/`, `docs/`, `package.json`, ...), nicht den ZIP als einzelne Datei ins GitHub-Repository hochladen. Existierende Dateien ersetzen; alle übrigen Dateien behalten.
3. Für Cloudflare **nach dem Code-Upload** im Repository lokal per Wrangler (mit Authentifizierung, Worker-/D1-Konfiguration wie bei früheren Builds) die Migration anwenden:

   ```bash
   npm install
   npm run db:remote
   npm run deploy:api
   ```

   Die Migration **vor** dem Worker-Deployment ausführen. Falls GitHub Pages vor dem Worker veröffentlicht wird, bleibt Cloud-Sync durch den Versionscheck temporär blockiert; lokale Änderungen bleiben im verschlüsselten Tresor.
4. Die GitHub-Action **Deploy Compass Web** muss erfolgreich durchlaufen; bei Bedarf die App/PWA danach aktualisieren. API-Gesundheitscheck meldet jetzt **`apiVersion: 5`** und `schema.ready: true` nur mit den neuen Spalten. Ältere 0.4.4-Clients synchronisieren mit dem aktualisierten Worker **absichtlich nicht mehr**, um ein unbeabsichtigtes Zurücksetzen neuer Hierarchiefelder zu vermeiden. Aktualisiere daher alle Geräte.
5. **Garmin-App unverändert:** `garmin/` und `android/` sind nicht Teil des Patches; die installierte Garmin-App/Verbindung wird durch diesen Patch nicht neu gebaut.

**Achtung:** Eine schon erfolgreich angewendete Migration 0007 **nicht manuell wiederholen**. Bei Fehler zuerst den Migrationsstatus und die Worker-Logs prüfen, keine neuen ZIPs blind nachschieben.

## Abnahmecheck

- Bestehendes Projekt öffnen: Daten/Tasks erhalten; Standardtyp Parallel.
- Unterordner anlegen, Unterprojekt anlegen, Ebene wechseln und neu laden. Zweites Gerät per Sync kontrollieren.
- Sequential-Projekt mit 2 Haupthandlungen erstellen, erste Handlung um Unteraufgabe ergänzen: Nur die verfügbare Unteraufgabe erscheint in Next Actions, danach der Elternschritt und erst dann die zweite Haupthandlung.
- Parallel und Single Actions umschalten: mehrere offene Aktionen können zeitgleich verfügbar sein.
- Elternordner auf Hold → abhängige Next Actions verschwinden; Reaktivierung stellt sie wieder her.
- Einzeln Defer, Planned, Due und Duration setzen, speichern, Seite neu laden: Werte unverändert; Defer verbirgt vor Fälligkeit Next Action, Planned zeigt im Forecast einen Wunschtermin, Due eine Deadline.
- `+1d/+1w/+1m` und Löschen testen; Änderungen **explizit speichern**.
- Sync auf zweitem Gerät, Offline-Erfassung, Rückkehr online und Konfliktbehandlung prüfen.

## Automatische Prüfungen

- `npm run check`: **40 / 40 bestanden**, einschließlich echter SQLite-Migrationen und -Inserts/Updates für Projekte und Aufgaben.
- `node --check` für die geänderten JavaScript-Dateien bestanden.
- Ein **Vite-Produktionsbuild**, Cloudflare-Live-Deployment und visuelle Browser-End-to-End-Prüfung wurden in dieser Bearbeitungsumgebung **nicht erfolgreich durchgeführt** (npm-Dependencies fehlten, Installation lief in einen Timeout). GitHub Actions führt `npm install`, `npm run check` und `npm run build` automatisch aus.
