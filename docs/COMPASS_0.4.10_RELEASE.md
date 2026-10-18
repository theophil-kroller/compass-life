# Compass 0.4.10 – kombinierter GitHub-Patch 0.4.9 + 0.4.10

**Basis:** Eine bereits korrekt installierte Compass **0.4.8** (mit 0.4.6 Worker/Migration 0007). **Ziel:** `0.4.10-alpha.1`. Dieses ZIP enthält **nur neue/geänderte Dateien**, **keinen FULL Build**. Patchdateien ab **Repository-Wurzel** in das vorhandene GitHub-Repository kopieren; vorhandene andere Dateien beibehalten. Keine Watch- oder Android-Dateien werden überschrieben.

## Einspielen – unbedingt Worker und D1 beachten

1. **Vorab:** Compass-Tresor über **System & Sync → Verschlüsseltes Backup herunterladen** sichern. Bei Bedarf zusätzlich eine D1-Sicherung anfertigen. Vorher prüfen, dass die 0.4.6/0.4.8-Version korrekt synchronisiert.
2. Den **Inhalt** des Patches im GitHub-Repository hochladen/ersetzen; Ordnerstruktur `client/`, `worker/`, `tests/`, `docs/` und `package.json` beibehalten. Kein Full Build und keine Dateien aus dem bestehenden Repository löschen.
3. Im verbundenen lokalen GitHub-Checkout mit Cloudflare-Wrangler-Berechtigung **zuerst Migration 0008** ausführen, **danach Worker deployen**:

   ```bash
   npm install
   npm run db:remote
   npm run deploy:api
   ```

   Die neue Migration heißt **`worker/migrations/0008_watch_session_tombstones.sql`**. Sie erzeugt die additive Tabelle `watch_deleted_sessions`, um erneutes Hochladen endgültig gelöschter Garmin-Datensätze zu verhindern. Sie löscht **keine bestehenden Session-Datensätze**. Die endgültige Löschung eines **einzeln ausgewählten** Datensatzes erfolgt ausschließlich nach ausdrücklicher Bestätigung in Compass.
4. Die GitHub Pages Action „Deploy Compass Web“ nach dem Commit abwarten. **Nur ein grüner Test- und Build-Status** belegt ein erfolgreiches Frontend-Deployment. PWA nach Update vollständig neu laden bzw. neu starten. Bei noch fehlender Worker-Migration unterbricht der Gesundheitscheck den Cloud-Sync vorübergehend; lokale Daten bleiben erhalten.
5. Unter System & Sync prüfen: Worker-/Schema-Status bereit und Synchronisierung möglich. Garmin-Gerät muss **nicht** neu gekoppelt werden.

## 0.4.9 – Activity Management

- Garmin-Sessions im Menü **Aktivitäten** auswählen und ihren **Anzeigenamen, Kategorie, Datum/Uhrzeit, Dauer, Notiz und Projektzuordnung** bearbeiten. Der ursprüngliche Garmin-Rohdatensatz (Puls, Body Battery, Pomodoros) wird dadurch **nicht geändert**.
- Manuelle Aktivitäten ergänzen, beispielsweise Schwimmen, Radfahren oder Sauna.
- Eigener **Papierkorb** für Sessions und manuelle Aktivitäten mit **Wiederherstellen**.
- **Endgültig löschen:** Manuelle Aktivität wird lokal entfernt; bei Garmin sendet Compass nach erneuter Bestätigung eine authentifizierte Löschanfrage an den Worker. Der Worker entfernt den D1-Datensatz und schreibt einen **Tombstone**, sodass verspätete Uploads derselben Session sie nicht wiederherstellen. Auch ein wiederholter Löschversuch nach einer verlorenen Antwort ist idempotent.
- **Wichtig:** Session-Korrekturen, manuelle Einträge und Papierkorbzustände liegen **verschlüsselt im lokalen Compass-Tresor** und werden in dieser Stufe **noch nicht geräteübergreifend synchronisiert**. Nur endgültige Garmin-Löschungen greifen zentral in D1. Auf einem zweiten Gerät kann eine Session bis zur serverseitigen Löschung anders dargestellt werden. Der Worker listet weiterhin maximal 50 Garmin-Sessions.

## 0.4.10 – Übersicht, Timeline und aktive Lebensbereiche

- **Übersicht:** kompakte verzweigte Timeline für die nächsten 14, 30 oder 90 Tage. Separat erkennbar: Aufgaben-Deadline (**Due**), Wunschtermin (**Planned**), Projekt-Meilenstein (Projekt-Deadline) und Google-Kalendertermin. Routineblocker werden herausgefiltert; Termine bleiben **nur lesend**.
- **Menschen:** keine ausgegraute Navigation mehr. Kontakte und kurze Notizen lokal anlegen; verknüpfte Gesprächs-/Agenda-Aufgaben als reguläre Compass-Tasks erfassen. Tasks erhalten ein Kontakt-Tag, das über die normale Task-Synchronisation mitgenommen wird. Der Kontaktstamm samt Notizen bleibt vorerst **lokal verschlüsselt**.
- **Fortschritt:** Projektfortschrittsanzeigen aus abgeschlossenen/offenen Schritten und Aktivitätskennzahlen der letzten sieben Tage.
- **Erholung:** anstehende Google-Kalendertermine der Kategorie „Erholung“ und als Erholung klassifizierte Aktivitäten. Bestehende frei editierbare Kalendersymbole/-regeln von 0.4.8 bleiben erhalten.
- **Weekly Review:** der entbehrliche Erklärtext/Badge oberhalb der fünf Schritte entfällt. Die eigentlichen Review-Schritte samt kurzen Hilfetexten bleiben.

## Anlassvorbereitung: Geburtstage, Weihnachten und Ostern

- **Geburtstage**: Wenn ein passender Termin aus dem verbundenen **primären** Google Kalender innerhalb des Vorschaufensters verfügbar ist, kann Compass z. B. Geschenk (ca. 14 Tage zuvor), Kerzen, Kuchen und Geburtstagsgrüße vorschlagen.
- **Weihnachten**: unabhängig vom Google-Kalender jährlich anhand **24. Dezember / Heiligabend** vorbereitet. Vorschläge: Familienzusammenkunft/Einladungen (sieben Wochen zuvor), Geschenke, Anreise/Besuche, Essen/Einkauf, Grüße.
- **Ostern**: jährlich automatisch korrekt nach dem gregorianischen Osteralgorithmus für Ostersonntag berechnet. Vorschläge: Familientreffen, kleine Geschenke, Eier/Deko, Essen und Grüße.
- **Jeder Schritt ist freiwillig.** Schaltflächen **Übernehmen** (erzeugt erst dann eine reguläre, synchronisierbare Compass-Next-Action) oder **Nicht nötig** (für diesen konkreten Anlass ausblenden, wieder einblendbar). Eigene Vorbereitungsschritte können ergänzt werden. Erledigte oder bereits übernommene Schritte werden über ein datumsbezogenes Anlass-Tag auch nach Aufgaben-Sync erkannt, sodass Doppelanlagen vermieden werden.
- Übernommene Schritte bekommen **Defer**, **Planned** und **Due** passend zum individuellen Vorlauf. Werden sie erst nach dem ursprünglich vorgesehenen Zeitpunkt übernommen, erhalten sie als frühestes relevantes Datum **heute**, keine absichtlich rückdatierte neue Deadline.
- Die Anlassvorschläge erscheinen in **Heute** und **Übersicht**, wenn eine entsprechende Vorbereitung ansteht. Standard-Vorschaufenster 70 Tage; der Google-Kalender lädt für diese Zwecke bis zu 90 Tage, maximal fünf paginierte Antworten.
- **Grenze:** Das ist eine **In-App-Erinnerung bei geöffneter Compass-Webseite**, derzeit **keine OS-Push-Benachrichtigung** bei geschlossener App und keine eigenständige Hintergrundautomatik. Weihnachten/Ostern benötigen keine Google-Freigabe; Geburtstage werden nur aus den im Compass-Frontend tatsächlich verbundenen Kalenderterminen erkannt (gegenwärtig `primary`, nicht jeder zusätzliche freigegebene Kalender). Persönliche „Nicht nötig“-Entscheidungen und eigene Vorschläge sind nur lokal im verschlüsselten Tresor. Die erzeugten Aufgaben werden hingegen regulär synchronisiert. Google Calendar bleibt schreibgeschützt (`calendar.events.readonly`).

## Prüfung

- `npm run check` → **54 von 54 Tests erfolgreich**. Dazu: Jahreswechsel / beweglicher Ostersonntag, Geburtstagsfilter, zeitgestaffelte Vorbereitungen, keine doppelte Aufgabenanlage, Deadline und Defer, Aktivitäts-Papierkorb, verzweigte Timeline, sämtliche bisher inaktiven Navigationsbereiche und eine **echte SQLite/D1-kompatible Löschprüfung** einschließlich Wiederholversuch und verspätetem Garmin-Upload.
- `node --check` auf neuen/geänderten JS-Quelldateien erfolgreich.
- **Nicht abgeschlossen:** Vite-Produktionsbuild in dieser Arbeitsumgebung (npm-Pakete nicht vorhanden / Registry hier nicht verfügbar), echter Chromium-End-to-End-Test (Browser-Navigation durch Umgebung gesperrt), Live-Deployment und Test gegen das echte Google-Kalenderkonto im Compass-Frontend. Für die Oberfläche wurde zusätzlich ein ausführbarer Node-VM-Rendertest genutzt. Deploymentstatus in GitHub Actions kontrollieren.

## Kurze Abnahme nach dem Deployment

1. Menü **Menschen, Fortschritt, Erholung** anklicken: alle müssen sichtbar und nutzbar sein.
2. **Übersicht** öffnen: Timeline auf 14/30/90 Tage umstellen; vorhandene Due-, Planned- und Projekt-Deadlines prüfen.
3. **Aktivitäten:** eine Garmin-Session zeitlich ändern, einem Projekt zuordnen, in Papierkorb legen und wiederherstellen. Einen **entbehrlichen Testdatensatz** erst nach Prüfung endgültig löschen und kontrollieren, dass er nach Aktualisierung nicht zurückkommt.
4. **Heute/Übersicht:** Anlassvorbereitung prüfen; aktuell (Mitte Oktober) kommt Weihnachten erst bei Beginn des Vorlaufs für die ersten Schritte in den Vorschlagsbereich. Mit realem passenden Geburtstagstermin im primären Google Kalender testen, einzelne Schritte übernehmen bzw. ausblenden und im Heute-/Next-Actions-Workspace kontrollieren.
5. Verschlüsseltes Backup erstellen, Browser aktualisieren, Sync auf Zweitgerät prüfen: Aufgaben und Projektstatus synchron, lokale Kontakt-/Aktivitäts-Overlays gerätegebunden. Google-Kalenderdaten dürfen **nicht** verändert werden.
