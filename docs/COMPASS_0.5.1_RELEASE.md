# Compass 0.5.1 – Events aggregieren & Health Connect (Beta)

**Stand:** 18.10.2026. **Quellcodepaket. Web-/Android-Produktionsbuild und Hardwaretests sind noch nicht durchgeführt.**

## Lieferumfang

- `Erholung` → Gesundheitsbereich mit aggregierten Tageswerten (Schritte, Schlaf, Trainingsminuten), 7-Tage-Mittel und Tagesliste. Cloud-Datenabfrage über persönliche Compass-Sitzung; Daten nur zugriffsgeschützt in D1 (nicht E2EE).
- Health-Geräte-Pairing: einmaliger achtstelliger Code, maximal 10 Minuten; separater, kryptografisch zufälliger und widerrufbarer `ch1_`-Gerätezugang. Nur dessen SHA-256-Hash liegt in D1. Android speichert das Token über den Android Keystore geschützt.
- Android-Companion Health Connect: nur lesende Berechtigungen, Schritte, Schlafdauer, Trainingszeit; manueller Upload der letzten 7 Tage. Nicht alle Garmin-Connect-Daten werden zwangsläufig an Health Connect geliefert.
- Gesundheitsverlauf über das Compass-Dashboard löschen und verknüpfte Android-Geräte unabhängig widerrufen. Bei Widerruf bleibt der bereits gespeicherte Verlauf bestehen, bis du ihn gesondert löschst.
- Veranstaltungssammlung in Erholung: JSON-Import aus externer Recherche, Prüfung von Datum und HTTPS-Quelle, Dublettenfilter, Quellenlink, Klick zum Vormerken in die Inbox. Importierte Ereignisse liegen im verschlüsselten lokalen Tresor (noch nicht geräteübergreifend synchronisiert). **Kein automatisches Live-Scraping/Live-API-Feed.**

## Installation – Reihenfolge sehr wichtig!

1. **Sicherung:** Compass → System & Sync → verschlüsseltes Backup erstellen. Keine lokalen Daten/Browser-Sitedaten löschen.
2. **D1-Remote-Datenbank aktualisieren**, bevor neuer Worker veröffentlicht wird: SQL-Datei `worker/migrations/0009_health_daily.sql` in Cloudflare D1 → `compass-db` → Console ausführen. Die Migration legt nur neue Tabellen an. Alternativ mit Wrangler über `npm run db:remote` (nur wenn die älteren Migrationen korrekt protokolliert sind); wenn diese bereits manuell ausgeführt wurden, den Wrangler-Migrationsstatus vorab prüfen und nichts blind erneut ausführen.
3. GitHub-PATCH pfadgleich in `theophil-kroller/compass-life` hochladen (Branch `main`) und GitHub Actions überprüfen: `Deploy Compass Web` sowie `Build Compass Android Widget` müssen **grün** sein. Unbedingt `.github/workflows` mit führendem Punkt beibehalten.
4. Cloudflare Worker **separat** veröffentlichen, wie bisher per Wrangler aus dem aktualisierten Repository (`npm run deploy:api`). GitHub Pages aktualisiert den Worker NICHT.
5. `https://compass-api.theophil-tiger.workers.dev/api/health`: erwartet `apiVersion:7`, `release:"0.5.1"`, `schema.ready:true`. Bei nicht bereitem Schema keine Health-Kopplung versuchen.
6. Android Debug-APK aus dem neuen GitHub-Actions-Lauf (Artifacts) laden und installieren, Hinweise zur wechselnden Debug-Signatur beachten. Im Android-Companion zunächst Health Connect freigeben. Dann in Compass Erholung `Gesundheits-Kopplungscode erzeugen` und Code auf dem Samsung eingeben; `Letzte 7 Tage synchronisieren` auslösen, anschließend im Web auf `Daten aktualisieren`.
7. Für Veranstaltungen `Erholung` → `Rechercheprompt kopieren`, Recherche in einer externen KI durchführen und gültiges JSON mit `events` zurückkopieren, importieren, Quellen prüfen. Die Daten werden nicht automatisch aktualisiert.

## Sicherheit und Qualität

- Heart Rate und Body Battery der Garmin-Watch-Session sind **separat** von Health-Connect-Tageswerten. Keine systemweite Garmin-Connect-API enthalten. Kein automatischer Hintergrundsync auf Android.
- D1-Speicherung ist nach Nutzerfreigabe cloudbasiert, zugriffsgeschützt aber nicht Ende-zu-Ende-verschlüsselt. Es werden weder GPS noch einzelne Herzfrequenzpunkte aus Health Connect übertragen.
- Android Health Connect ist ein eigener Berechtigungsfluss. Das bestehende einfache Widget erhält dadurch keinen Zugriff auf geheime Daten auf dem Homescreen.
- Compiler- und Hardwarestatus: `npm run check` erfolgreich (78 Tests); `npm run build` hier nicht ausführbar (`vite` mangels installiertem node_modules). Android Gradle Build muss erst GitHub Actions bestätigen. Auf echtem Samsung nicht verifiziert.
- Datenbeschränkung: Upload 1–14 Tage pro Anfrage, maximal 32 Tage zurück; UI überträgt nur die letzten 7 Tage. Anzeige maximal 90 Datensätze.
