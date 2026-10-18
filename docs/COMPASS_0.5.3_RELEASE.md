# Compass 0.5.3 – Event-Sync, wochenweise Entdecken und klarer Import

Stand: 18.10.2026 · Quellcode-Release. **Lokale 88/88 Node-Tests erfolgreich.** Web-Produktionsbuild lokal nicht möglich (Vite fehlt). GitHub Actions und Deployment sind noch nicht erfolgt.

## Inhalt

- **Event-Sync über D1:** `discovery_events` speichert Veranstaltungen sowie Status `open` / `saved` / `hidden`, revisionsgesichert pro Benutzer. Ein Löschen sendet persistente Tombstones, damit andere Geräte entfernte Einträge nicht erneut anlegen.
- **Altbestände:** Vorhandene 0.5.2-Veranstaltungen bleiben im verschlüsselten Browser-Tresor und werden beim ersten gültigen Sync mit dem Cloud-Stand zusammengeführt. Bei konkurrierenden Entscheidungen wird eine Konfliktauswahl angezeigt; es gibt kein stilles Überschreiben von Merkliste oder Ausblenden.
- **Wochenweise blättern:** Im Tab `Alle` ab der laufenden Kalenderwoche vor/zurück navigieren. Region, Stadt und Interessen bleiben beim Blättern erhalten.
- **Recherche:** Zwei getrennte Prompts für (a) Graz/Wien/Österreich, 30 Tage und (b) Tanz-/Bujinkan-Events in Europa, 6 Monate. Recherche weiterhin manuell und extern.
- **Import:** JSON bis zu 250 Veranstaltungen pro Import, Vorschau mit neu/dupliziert und ausdrücklicher Übernahme. Optional `endDate` für mehrtägige Veranstaltungen. Bilder (`imageUrl`) und quellenbasierte Beschreibungen (`description`) aus 0.5.2 bleiben erhalten.
- **Vergangenes:** Abgelaufene Events verschwinden nach Veranstaltungsende aus aktiven Ansichten. Nicht vorgemerkte Events werden nach 14 Tagen beim Entsperren oder Synchronisieren lokal entfernt und als Löschung zur Cloud vorgemerkt. Bewusst gemerkte Events bleiben im Tresor erhalten, werden aber nicht in den zukünftigen Vorschlägen angezeigt. Noch keine separate Archivansicht.
- **Vorerst nicht enthalten:** automatische Quellenrecherche, automatischer Kontakte-/WhatsApp-Verlauf, grundlegender Weekly-Review-Umbau oder Android-Widget-Redesign. Keine Android-APK-Änderungen in 0.5.3.

## Installation – Reihenfolge

1. **Zuerst eine verschlüsselte Sicherung des funktionierenden Compass-Tresors erstellen.** Weder Browserdaten löschen noch die PWA deinstallieren.
2. In Cloudflare D1 `compass-db` **nur die neue** Datei `worker/migrations/0011_discovery_events.sql` via SQL Console ausführen. Früher bereits manuell ausgeführte Migrationen nicht erneut blind über Wrangler durchführen. `0011` ist ausschließlich additiv und kann bei Wiederholung gefahrlos `CREATE TABLE IF NOT EXISTS` ausführen.
3. `Compass_0.5.3_GITHUB_PATCH.zip` entpacken und dessen Dateien unter unveränderter relativer Ordnerstruktur in GitHub `theophil-kroller/compass-life` auf Branch `main` hochladen. **Nicht die ZIP selbst ins Repository legen.** GitHub Web-Deploy abwarten und prüfen.
4. **Worker zusätzlich separat veröffentlichen:** nach Aktualisierung des lokalen Repositorys im Repo-Wurzelverzeichnis `npm run deploy:api` (über Wrangler mit korrektem Cloudflare-Account). GitHub Pages deployt nicht die API. Der Cloudflare-Worker muss die neue Datei `worker/src/discovery-events.js` enthalten.
5. `https://compass-api.theophil-tiger.workers.dev/api/health` prüfen: erwartet `apiVersion:9`, `release:"0.5.3"`, `schema.ready:true` und keine fehlenden Spalten. Bei `schema.ready:false` nicht mit Event-Sync fortfahren.
6. PC zuerst: bestehenden Tresor entsperren, `System & Synchronisation → Jetzt synchronisieren`. Auf dem Samsung die **bereits funktionierende Compass-PWA** öffnen, denselben Benutzer anmelden, eigenen Tresor entsperren und synchronisieren. Events, Merkliste und ausgeblendete Einträge sollten erscheinen. `Entdecken → Alle` zeigt den Wochenblätterer.
7. Bei Konflikten unter `Erholung → Entdecken`: **Cloud** oder **Lokal** ausdrücklich wählen, dann erneut synchronisieren.

## Qualität, Speicherung und Einschränkungen

- Gespeicherte Eventdaten in Cloudflare D1 sind nutzergebunden authentifiziert, aber **nicht Ende-zu-Ende-verschlüsselt**. Der Browser-Tresor bleibt lokal AES-GCM-verschlüsselt.
- Die Cloud speichert nur vom Nutzer importierte Veranstaltungen samt Status, keine automatischen Scrapes. Quelle/Datum weiterhin bei offiziellen Veranstaltern prüfen.
- Für viele alte Events wird bei der ersten Synchronisierung ein initialer Upload durchgeführt; er kann länger dauern als spätere kleine Änderungen. Synchronisationsstatus in Compass prüfen.
- Neu importierte Veranstaltungsvorschauen werden zunächst im Tresor gespeichert, erst beim expliziten Import bestätigt und anschließend synchronisiert.
- Der `week` Tab zeigt die nächsten 7 Tage, `Alle` zeigt die Kalenderwoche, `Merkliste` alle noch laufenden und zukünftigen gespeicherten Einträge.
- 88 Node-Tests grün; `vite build` und echte PWA-/Android-Hardwaretests stehen noch aus.

## Nachfolgende Fokus-Builds

**Weekly Review:** Auf Basis von David Allens Get Clear → Get Current → Get Creative und OmniFocus' einzelnem Projekt-Review einen pausierbaren 11-Schritte-Assistenten gestalten. Ganz besonders: vergangene und kommende Kalender, Waiting For, Listen, Projektstatus und expliziter Review-Abschluss.

**Menschen:** Leichtgewichtiger, freiwilliger Kontakt-Radar mit „zuletzt gesprochen“, offenem Gesprächsanlass, persönlichen Erinnerungen und optionalen Importen; **kein automatisches WhatsApp-Scannen, keine sensiblen SMS-/Anruflisten-Berechtigungen** im jetzigen Android-Widget.
