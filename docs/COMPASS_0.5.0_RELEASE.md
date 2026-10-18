# Compass 0.5.0 – UX, Freizeitideen, Android Widget

## Umfang
- Primäre Navigation in **Dein Tag** (Übersicht, Heute, Inbox, Next Actions, Forecast, Weekly Review) und **Gestalten & Planen** (Projekte, Menschen, Erholung, Fortschritt) gegliedert. Sekundäre Ansichten (Flagged, On Hold, Dreams, Aktivitäten) aufklappbar und dauerhaft im lokalen Tresor speicherbar. Alle Seiten weiter erreichbar.
- Erholung: **Ideen**, **geplante Termine**, **erlebte Aktivitäten**; Zeit-/Energie-/Distanzfilter und aktueller Wetter-Hinweis. 10 ausblendbare Starter-Ideen inklusive Kampfsport 🥷. Eigene Ideen im lokalen verschlüsselten Tresor, kein automatischer Task, explizite Übernahme in Inbox.
- Workload-Hinweis nutzt nur protokollierte Compass-Aktivitäten der letzten sieben Tage, **keine medizinische Bewertung** und keinen behaupteten Erschöpfungswert. Wetter zeigt aktuelles Stadtwetter, **keine Wochenendprognose**; wetterbezogene Ideen sind Vorschläge, keine garantierte Vorhersage.
- Android Widget: drei Deeplink-Aktionen (Heute, Erfassen, Erholung) und Android-GitHub-Action zum Erzeugen einer Debug-APK. Keine privaten Inhalte auf dem gesperrten Homescreen. Nicht als signiertes Store-Release.
- Kein D1-Schemawechsel; kein Cloudflare Worker Deployment; keine Garmin-Firmware-/Connect-IQ-Änderung.

## Geplante Veranstaltungssuche (separates Modul für 0.5.1+)
Architektur: **Entdecken** innerhalb Erholung. Trennung zwischen (1) wiederholbaren persönlichen Ideen und (2) zeitgebundenen Veranstaltungen. Vorschläge erst durch explizites Merken/Planen nach Compass übertragen.

**Quellstrategien, in dieser Reihenfolge:**
1. Offizielle APIs/Feeds/ICS-Links der Veranstalter und Plattformen, soweit Lizenz und Zugriff dies gestatten. Startkandidaten Graz Tourismus, Bühnen Graz/Oper Graz, Ticketmaster Discovery API; später Wien, Kinos, Konzerte, lokale Festivals, Sportevents.
2. Kuratierter **JSON-Import**, z. B. aus einer Recherche mit einer externen KI. Vor dem Import Schema validieren, Quelle prüfen und abgelaufene Einträge verwerfen. KI-generierte Termine sind bis zur Prüfung ausdrücklich unbestätigt.
3. Optional Recherche-Button via Cloudflare Worker/Server, **kein Scraping geschützter Inhalte**, API Keys nicht in der PWA ausliefern.

Geplantes normalisiertes Ereignisformat:
```json
{
 "externalId":"source:1234", "title":"Beispielkonzert", "category":"Konzert",
 "startAt":"2026-11-05T19:30:00+01:00", "endAt":null,
 "venue":"Konzertsaal", "city":"Graz", "latitude":null, "longitude":null,
 "sourceName":"offizielle Veranstalterseite", "sourceUrl":"https://example.org/event/1234",
 "checkedAt":"2026-10-18T03:00:00+02:00", "priceFrom":null,
 "status":"unverified", "tags":["Musik"]
}
```
Sicherheit: HTTPS-Links, Schema/Dateitypen/Maximalgröße prüfen, Link-Ziele nie als HTML rendern. Deduplizieren via externe Quelle/ID oder Datum+Ort+normiertem Titel. Stornierungen sichtbar halten und Vorschläge auf Aktualität prüfen. Im Dashboard nur der passende Teil nach Stadt, Umkreis, verfügbarer Zeit, Interessen und Vorlieben – keine ungefilterte Flut.

**Noch nicht implementiert:** Event-Suche/APIs, JSON-Import, Health Connect, Cloud-Health-Sync, Widget mit Live-Tasks, Wetterprognose für das Wochenende, gezielte Push-Reminders.

## Installation
1. Vorher den verschlüsselten Tresor exportieren.
2. PATCH-ZIP in Hauptverzeichnis `compass-life` bei unveränderten Pfaden hochladen.
3. GitHub Actions **Deploy Compass Web** auf Grün prüfen, erst dann 0.5.0 im Browser öffnen.
4. Für Android: `.github/workflows/build-android-widget.yml` und `android/CompassWidget/**` im Repository; Actions **Build Compass Android Widget** auf Grün prüfen, Artefakt herunterladen und `.apk` auf Samsung installieren.
5. Keine neuen D1-Migrationen; Wrangler Worker 0.4.10/API 6 bleibt unverändert.
6. Browser-Tresor niemals durch Löschen des Website-Speichers vermeintlich updaten.

## Validierung / Grenzen
Node-Syntaxcheck und `npm test` lokal; separater Github-Web-Build via Action erforderlich. Für Android fehlen auf dem Build-Rechner SDK/Gradle; Build-Erfolg und Gerätetest über GitHub Action/Samsung bestätigen.
