# Compass Life 0.5.91.61 — Outlook Desktop Calendar Bridge + JSON-Handoff

## Zweck

Erweitert die seit 0.5.77.24 vorhandene **lokale Windows-Outlook-Bridge** mit Python/pywin32 und Windows-COM. Outlook-Mails über `/v1/flags` bleiben unverändert nutzbar. Die Kalenderintegration funktioniert mit klassischem Outlook für Windows und einem dort bereits eingerichteten Exchange-Konto; sie benötigt **weder Microsoft Graph noch Microsoft 365/Online-Login**.

## Bedienung auf dem Windows-PC

1. Klassisches Desktop-Outlook öffnen und prüfen, ob der TU-Graz-Exchange-Kalender sichtbar ist. **Das neue Outlook für Windows unterstützt die hier nötige COM-Automatisierung nicht.**
2. Einmalig im Terminal: `py -m pip install pywin32 tzdata`. Python 3.10+ wird benötigt. `tzdata` stellt die IANA-Zeitzone `Europe/Vienna` für den Export bereit.
3. Im Compass-Projekt `tools/start_outlook_bridge.cmd` starten. Die exakte **HTTPS-Origin** der Compass-Webseite eingeben, z. B. `https://app.example.org` (ohne Slash/Pfad). Die Bridge läuft ausschließlich unter `http://127.0.0.1:8765`; der zufällig ausgegebene lokale Schlüssel ist für diese laufende Bridge-Sitzung gültig.
4. Compass auf **demselben Windows-PC** öffnen und den verschlüsselten Tresor entsperren. Unter **Einstellungen → System → Integrationen · Lokale Quellen → Outlook Calendar** den Schlüssel aus der Windows-Konsole und Port 8765 eingeben; mit **„Outlook-Kalender jetzt aktualisieren“** abrufen.
5. Standardfenster: 14 Tage zurück und 180 Tage voraus (0–365 / 1–730 konfigurierbar). Bei aktiv verbundener Bridge wird alle 15 Minuten automatisch abgeglichen, solange die Webseite sichtbar und der Tresor entsperrt ist. Ein Import kann außerdem über **Snapshot-JSON einlesen** erfolgen, falls der Browser den lokalen Zugriff blockiert: `py tools/outlook_bridge.py --export-calendar outlook-snapshot.json` und Datei importieren.
6. **Heute und Forecast**: gespeicherte Outlook- und Google-Termine gemeinsam anzeigen; Filter „Alle / Google / Outlook“, Ortsangabe und Zeitdetails im bestehenden Kalender-Inspector. Übernacht- und mehrtägige Termine gelten an jedem belegten Tag. Bereits identische Google-Termine werden anhand von Titel/Zeit automatisch zusammengeführt; alternativ eine erhaltene Google-Event-ID manuell zuordnen.

## JSON für ChatGPT und Google Calendar

Unter **Outlook Calendar** Exportzeitraum wählen, dann **Voll-Export JSON** oder **Delta-Export JSON**. Die Datei ist versioniert mit `schema_version: "1.0"`, `source: "compass-outlook-bridge"`, `export_type`, `timezone`, `exported_at`, `window`, `events`, stabilen `source_id`s, optionalen `google_event_id`s, `change_type` und Lösch-Tombstones. Bei Bedarf den datensparsamen Standard ohne Beschreibung nutzen (Beschreibungen separat per Opt-in beim Abruf und Export; Teilnehmer werden nie exportiert).

1. Datei in ChatGPT hochladen und mit dem verbundenen Google Calendar abgleichen lassen. Vor dem Ändern/Löschen nach externen Dubletten suchen, besonders bei manuell kopierten Terminen.
2. **Erst nach nachweislich vollständiger erfolgreicher Google-Übernahme** in Compass **„In Google übernommen – Delta bestätigen“** anklicken. Nur dadurch wandert der Delta-Anker weiter. Falls etwas offenblieb, **„Noch nicht übernommen“** wählen und beim nächsten Export erneut abgleichen. Änderungen nach dem Dateidownload werden auch bei späterer Bestätigung **nicht** als bereits verarbeitet markiert.
3. Google-Event-IDs aus dem anschließenden Google-Abgleich für dauerhafte Zuordnung in Compass eintragen. Die ID ist nicht automatisch bekannt, solange Compass nur Google-Leserechte hat.

## Technische Architektur

- `tools/outlook_bridge.py`: zusätzlich `GET /v1/calendar`, `GET /v1/status`, CLI `--export-calendar`; Outlook-COM **nur lesend**, keine Mutationen, Passwort-/Token-Abfrage für Outlook oder Microsoft-Login. Bestandsaufnahme mehrerer Outlook-Stores, bounded recurrence enumeration, Ausnahmen einschließlich verschobener und gelöschter Instanzen. Quellkennung aus Store/Kalender/GlobalAppointmentID oder EntryID und ursprünglichem Wiederholungsbeginn abgeleitet und SHA-256-gehasht. Keine rohen Exchange/MAPI-IDs im Export.
- `client/src/outlook-calendar-v059161.js`: validiert **vollständige** Snapshots und persistiert `outlookCalendar61` separat im bestehenden verschlüsselten Tresor. Zwei **erfolgreiche vollständige** Scans zur abwesenheitsbedingten Löschmarkierung (sofern im Fenster); eine fehlerhafte Bridge-Antwort verändert keine gespeicherten Termine. Explizite Serienausnahmen/Löschungen werden mit dem Serienmaster und ursprünglich belegtem Datum verknüpft. Permanente Tombstones erlauben zuverlässige Delta-Exporte.
- Journal-/Geräte-E2EE-Synchronisation enthält den Outlook-Bestand, **wenn** die bestehende verschlüsselte Gerätesynchronisation explizit verbunden ist. Am Smartphone wird Outlook **nicht** direkt über Windows-COM gelesen; dort erscheinen synchronisierte gespeicherte Termine. Dienstliche Vertraulichkeitsvorgaben vor Aktivierung einer geräteübergreifenden Sync unbedingt prüfen.
- Die Kalenderdaten werden nur bei Bridge-Import/Sync aktualisiert, **nicht bei jedem Öffnen** von Heute, Inbox oder Forecast. Separate Kalenderanzeige verwendet die bestehende Kalenderlogik. Google-Schreibrechte und automatisierte Google-Mutationen gibt es in Compass nicht.

## Sicherheit und Grenzen

Die Bridge bindet nur an `127.0.0.1`; sie erlaubt ausschließlich die konfigurierte HTTPS-Origin plus ein langes zufälliges Bridge-Token im Header, mit `Cache-Control: no-store`. Das Token wird nicht im Cloud-Tresor gespeichert; beim Neustart der Bridge wird ein neues ausgegeben. Eine lokale Bridge ersetzt keinen Freigabeprozess für dienstliche Kalenderdaten. Die standardmäßige Datenübertragung kann sensible Titel und Orte enthalten; Beschreibungen sind deaktiviert, bis sie ausdrücklich aktiviert werden.

**Externe Plattformprüfung noch erforderlich:** Im Entwicklungscontainer stand kein Windows-Outlook-COM und kein dienstliches Exchange-Profil zur Verfügung. Serientermine und Fehlerfälle wurden durch COM-freie Python-Mocks sowie Frontend-Tests geprüft; auf dem echten TU-Graz-Windows-PC insbesondere Outlook-Serien, verschobene Ausnahmen, gelöschte Termine, Multi-Store und die Browser-zu-Localhost-Verbindung testen. Das lokale Vite-Paket war nicht installiert; die Produktionskompilierung muss in GitHub Actions bestätigt werden.

## Tests

- 33/33 vorhandene Release-Prüfungen, Importgraph mit 310 Modulen fehlerfrei.
- 14 neue JS-Kalender/Delta/E2EE-/Zeitfenster-Tests erfolgreich; 8 Python-COM-freie Bridge-Tests erfolgreich.
- Gesamt-Regression: 2.353 bestanden, 66 bereits bekannte Fehlschläge; identische Fehlschlagsmenge wie 0.5.91.60, keine neuen.
