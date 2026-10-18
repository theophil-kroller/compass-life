# Compass 0.4.8 – GitHub Patch (0.4.7 Weekly Review + 0.4.8 Smart Forecast)

**Basis:** bereits eingespielte Compass 0.4.6 (entspricht `Compass_0.4.6_GITHUB_PATCH.zip` auf Basis 0.4.4). **Zielversion:** 0.4.8-alpha.1. **Umfang:** nur Frontend und Tests, **keine Änderung an Cloudflare Worker, Datenbankschema, Garmin oder Android**.

## Einspielen

1. **Voraussetzung:** 0.4.6 inklusive D1-Migration 0007 und Worker API-Version 5 ist bereits im Einsatz. Ist das nicht der Fall, zuerst **0.4.6 vollständig installieren**, dann diesen Patch darüber kopieren. Den Patch **nicht direkt auf 0.4.4** anwenden.
2. Verschlüsseltes Compass-Backup sichern. ZIP öffnen und **die enthaltenen Ordner und Dateien ab GitHub-Repository-Wurzel** hochladen bzw. ersetzen. Bestehende andere Dateien **nicht löschen**.
3. Commit in `main` auslösen. GitHub-Action „Deploy Compass Web“ führt `npm install`, `npm run check`, `npm run build` und GitHub Pages Deployment aus. Bei Fehler **nicht davon ausgehen**, dass die neue Website veröffentlicht ist.
4. Website neu laden (PWA eventuell vollständig schließen und neu öffnen). Nach dem Update vorhandene Tasks/Projekte prüfen.
5. **Keine neue D1-Migration, kein Worker-Deployment** für diese Version nötig. `worker/`, `garmin/` und `android/` nicht verändern.

## 0.4.7 – Weekly Review

- **Klickbare Inbox-Item-Liste** statt Dropdown. Einträge werden nacheinander direkt im Review geklärt; ausgewählter Eintrag bleibt sichtbar.
- Klärung als **Next Action, Waiting For, On Hold, Dreams**. Bei Aufgaben **Projekt, Bereich, Defer, Planned, Due, Duration**, Energie (Wenig/Mittel/Viel) und Aufmerksamkeitsart auswählbar. Beim Bestätigen wird der Eintrag in eine synchronisierbare Compass-Aufgabe übertragen und erst danach aus der Inbox entfernt. Dreams bleibt ein bewusstes Ideenziel.
- Energie und Aufmerksamkeit werden als **`energy-*`/`attention-*` Kontext-Tags** auf die Aufgabe übertragen und so über die vorhandene Task-Synchronisation zwischen Geräten mitgenommen. Noch nicht übernommene Review-Merkmale und Form-Zwischenstände sind nur lokal.
- **Projekt-Review-Warteschlange:** Projekte aufrufbar, Review-Zyklen gemäß dem schon vorhandenen `reviewIntervalDays` und `reviewedAt` individuell fällig; „Geprüft“ dokumentiert über bestehende Projektsynchronisation. Projektstatus bleibt unverändert.

## 0.4.8 – Smart Forecast, Klassifizierungen & Erholung

- 17 konfigurierbare Startregeln mit **Symbolen, Kategorien, Treffern, Ausschlussbegriffen und Prioritätsreihenfolge** (früheste passende aktive Regel gewinnt): Geburtstag 🎂, Sauna 🧖, Therme ♨️, Tauchen 🤿, Biking 🚴, Tanzen/Zouk 💃, Wandern 🥾, Ski 🎿, Urlaub/Zeitausgleich 🌴, Gym 🏋️, Schwimmen 🏊, Yoga 🧘, Massage 💆, Surfen 🏄, Spaziergang 🌿, Kultur 🎭, Treffen ☕.
- Verwendet Kalender-Termintitel und ganze Wörter/Phrasen (keine ungewollten Teilworttreffer). Sicherheitswarnungen wie **„No flying after diving“** sind durch Ausschlussbegriffe ausdrücklich **kein Taucherholungstermin**.
- Eigener Regel-Editor in Heute und Forecast (Aktiv-Schalter, Symbol, Kategorie, Such-/Ausschlussbegriffe, Priorität, Hinzufügen, Entfernen, Standards zurücksetzen).
- Jeder Kalendertermin öffnet einen **persönlichen Compass-Inspector**: optionaler Anzeigetitel, eigenes Symbol, Kategorie und „in Compass ausblenden“. Ausgeblendete Termine durch Schalter wieder anzeigen und beim Termin die automatische Zuordnung wiederherstellen. Zusätzlich weiterhin Agenda-/Gesprächspunkte sowie Link zum Originaltermin in Google Calendar (sofern Google den Link bereitstellt).
- Forecast zeigt Symbole, Kategorie und Erholungstermin-Zähler innerhalb des vorhandenen 14-Tage-Fensters. Planned bleibt **Wunschtermin**, Due bleibt **Deadline**. Kalendereinträge ändern keine Deadlines.

## Datenschutz und technische Grenzen

- Google-Calendar-OAuth bleibt **`calendar.events.readonly`**. Die neue Oberfläche **bearbeitet keine Google-Calendar-Events**. Der Link zum Originaltermin erlaubt die Bearbeitung *auf der Google-Calendar-Seite* im Rahmen der dortigen Berechtigungen.
- Regeln und persönliche Kalender-Overlays liegen **verschlüsselt im lokalen Compass-Tresor** (`calendarRules`/`calendarOverrides`). Sie **werden aktuell nicht über D1 synchronisiert**. Für die Wiederherstellung an einem anderen Gerät kann ein bestehendes verschlüsseltes vollständiges Tresorbackup verwendet werden (Import nur in leeren Tresor). Es werden **keine realen Kalendertermine als Regeln vorbefüllt**; nur allgemeine Stichwörter und Kategorien, inspiriert von vorhandenen Aktivitätstypen.
- Termine werden weiterhin nur innerhalb des derzeitigen Google-Kalender-Ladefensters **des primären Kalenders** angezeigt (der vorhandene Code lädt bis 21 Tage im Voraus; Forecast davon 14 Tage). Andere Google-Kalender werden nicht neu eingebunden.
- Ein wiederkehrender Termin wird **über Regelbegriffe** für alle Instanzen klassifiziert. Ein einzelnes Overlay bezieht sich auf die ID der konkreten Termininstanz.

## Technische Prüfung

- `npm run check` erfolgreich: **46 / 46 Tests**, einschließlich 6 neuer Regressionstests für Kalenderklassifikation, Ausschlussregeln, Überschreiben/Ausblenden und Review-Datenvalidierung.
- `node --check` erfolgreich auf neuem und geändertem JavaScript.
- **Nicht validiert:** Vite-Produktionsbuild und visueller Chromium-End-to-End-Test. `npm install` scheiterte in der Bearbeitungsumgebung an `EAI_AGAIN` (npm-Registry/DNS nicht erreichbar). Die GitHub-Action übernimmt `npm run build`; Deployment erst nach grünem Status als erfolgreich ansehen.

## Abnahme nach GitHub-Deployment

1. Weekly Review öffnen, mehrere Inbox-Items anklicken, Projekt zuordnen, Energie auswählen und Datum setzen. Als Next Action bestätigen. Prüfen, ob Task im Projekt erscheint und `energy-low` o.ä. im Kontextfilter vorhanden ist.
2. Eine weitere Inbox-Notiz als Dreams, Waiting For oder On Hold übernehmen. Sicherstellen, dass nicht versehentlich eine Deadline erfunden wird.
3. Projekt aus Review-Warteschlange öffnen; „Geprüft“ verwenden; Projekt erst nach seinem eigenen Review-Intervall erneut fällig.
4. Google Calendar **nur lesend verbinden**. Forecast prüfen: Sauna/Therme/Zouk/Gym/Biking erhalten passende Symbole; nicht passender Termin bekommt 📅.
5. „Kalenderregeln“ öffnen, Suchwort oder Icon verändern, speichern, nach Reload prüfen; bei Bedarf Standards wiederherstellen.
6. Kalendertermin anklicken, Kategorie/Symbol manuell überschreiben, ausblenden, „Ausgeblendete zeigen“ aktivieren und automatische Zuordnung wiederherstellen. Google Calendar soll unverändert sein.
7. Auf einem zweiten Gerät überprüfen, dass Aufgaben, Projektzuordnung und Projekt-Review-Zeitpunkt synchronisiert werden. **Kalenderregel-Overrides sind nur lokal** – das ist die explizite Grenze dieses Builds.
