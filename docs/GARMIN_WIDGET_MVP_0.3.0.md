# Compass 0.3.0 – Garmin Tracker, Watch Bridge, Widget Companion (Prototype)

Stand: 17.10.2026. Basis: Compass 0.2.1 (bewährter lokaler Vault, Google-Sitzung, Inbox-Worker, D1).

## Klarer Funktionsstand

**Web/Worker – Quellcode vorhanden, automatisierte Tests bestanden:**
- Neues Menü **Aktivitäten**. Ein mit Compass angemeldeter Nutzer kann einen einmaligen 8-stelligen Garmin-Kopplungscode anfordern (10 Minuten gültig).
- Cloudflare Worker speichert gekoppelte Uhren mit gehashtem, widerrufbarem Zugangstoken, und Sessions inklusive Zeiten, HR-Reihe und Body-Battery-Werten in D1. Authentifizierter Webclient kann bis zu 50 Sessions laden. Wiederholte Uploads derselben ID werden nur einmal gespeichert.
- In **Übersicht** erscheint eine Aktivitäts-Karte, die nur echte geladene Sessions anzeigt.
- Sync-Konflikte, bei denen Titel, Notiz und Archivstatus lokal/remote übereinstimmen, werden nach dem nächsten Abgleich automatisch bereinigt. Echte Unterschiede bleiben geschützt.

**Garmin Connect IQ – Quellcode-Prototyp, auf Hardware NICHT getestet:**
- fēnix 7S Watch-App in `garmin/CompassWatch`, acht Tätigkeiten, START/PAUSE/ENDE, Pomodoro 25/5, Vibration, HR-Stichproben etwa alle 30 Sekunden, Body-Battery-Stichproben alle 5 Minuten plus Beginn/Ende, soweit das Gerät diese API liefert.
- Sessions werden zunächst auf der Uhr in Application.Storage gehalten (maximal 20 noch nicht synchronisierte Sessions), anschließend per Garmin-Connect-Mobiltelefon-Bridge über HTTPS hochgeladen. Bei fehlender Verbindung bleiben sie lokal zur Wiederholung. Es wird keine Sport-FIT-Aktivität für Garmin Connect erstellt.
- Die API-Einbindung und Monkey-C-Syntax müssen mit einem echten Garmin-SDK kompiliert und im Simulator bzw. auf der fēnix 7S geprüft werden. Dieses Paket enthält **keine installierbare `.prg`**.

**Android Widget – installierbares Projekt, aber keine fertige APK:**
- `android/CompassWidget` ist ein eigenständiges Android-Studio-Java-Projekt mit Homescreen-Widget. Es zeigt Datum und öffnet **Heute** bzw. **+ Erfassen** im Browser/der installierten Compass-PWA.
- Es zeigt **noch keine Live-Aufgaben oder echten Termine**. Die Today-Listen-/Google-Calendar-Schnittstelle ist in Compass noch nicht verfügbar; ohne sichere, explizite Brücke zwischen Android-Widget und Compass würden Daten fehlen oder auf dem Homescreen ungewollt offengelegt.
- Android Studio und Android-SDK sind erforderlich. Eine signierte `.apk` konnte hier nicht gebaut/auf Samsung getestet werden.

## WICHTIGE Reihenfolge – bestehende Daten nicht löschen

**Vorher:** Auf Laptop UND Samsung nach Bedarf in Compass unter `System & Sync` ein verschlüsseltes Backup herunterladen. `OWNER_EMAIL`-Secret, Google-Client-ID, Worker-URL und D1 nicht ändern.

**1. Migration in Cloudflare D1 – VOR dem GitHub-Upload:**
- Cloudflare Dashboard → D1 → `compass-db` → Console.
- Den **gesamten Inhalt** von `worker/migrations/0003_watch_tracker.sql` ausführen (je nach Console SQL-Anweisungen einzeln).
- Optional prüfen: `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'watch_%' ORDER BY name;`.
- Es werden **nur neue Tabellen** angelegt. Bestehende `items`, `auth_sessions` und lokale Tresore bleiben unverändert.
- Migration `IF NOT EXISTS` und kompatibel mit späterem `npx wrangler d1 migrations apply compass-db --remote`; nicht die Tabelle `d1_migrations` manuell löschen.

**2. Den PATCH in GitHub hochladen:**
- `Compass_Watch_Activity_0.3.0_PATCH.zip` entpacken. Alle darin befindlichen Dateien **mit unveränderter Ordnerstruktur** ins Repository `theophil-kroller/compass-life` nach `main` übernehmen/ersetzen. Nicht nur `client/` hochladen: neue Worker-Dateien `worker/src/watch.js`, `worker/src/index.js`, SQL-Migration gehören dazu.
- Bestehende `worker/wrangler.jsonc` und `client/public/runtime-config.json` **nicht ersetzen** (der Patch enthält sie bewusst nicht); bestehendes Cloudflare `OWNER_EMAIL`-Secret bleibt erhalten.
- GitHub Actions → `Deploy Compass Web`: grün. Cloudflare → `Workers & Pages` → `compass-api` → `Deployments`: neue Version **Ready und aktiv**. GitHub-Erfolg allein prüft den Worker nicht.

**3. Web-Teil prüfen:**
- Compass neu laden, lokalen Tresor entsperren. Google sollte automatisch verbunden bleiben.
- `System & Sync`: automatisch bereinigten alten identischen Konflikt überprüfen (erwartet 0, sofern beide Fassungen wirklich gleich sind).
- Neues Menü `Aktivitäten` öffnen. Ohne gekoppelte Uhr keine erfundenen Messdaten. Über `Kopplungscode erstellen` 8-stellige Ziffernfolge sehen. **Code nicht in öffentliche Screenshots übernehmen.**

**4. Garmin SDK auf Windows einrichten / Garmin-Prototyp erst nach Kompilierung installieren:**
- Garmin SDK Manager über https://developer.garmin.com/connect-iq/sdk/ installieren.
- VS Code installieren, offizielle Erweiterung `Monkey C` von Garmin installieren; `Monkey C: Verify Installation` aufrufen.
- `Monkey C: Generate Developer Key` einmalig ausführen; den privaten Signaturschlüssel **nicht im öffentlichen GitHub hochladen**.
- Ordner `garmin/CompassWatch` in VS Code öffnen.
- `Monkey C: Build for Device` → **fenix7s** → Ausgabeordner auswählen. Falls Compilerfehler, bitte die genaue Fehlermeldung senden; dies ist der erste echte SDK-Test und kein garantierter fertiger Build.
- Garmin per USB mit Windows verbinden. Die resultierende `.prg`-Datei nach `GARMIN/APPS` kopieren, Uhr sicher trennen.
- Auf der Uhr START → Apps/Aktivitäten → `Compass Focus` öffnen (Sideloading gemäß Garmin-Dokumentation).
- Auf der Uhr in der Tätigkeitsauswahl: UP/DOWN wechseln, START starten, MENU Pomodoro ein/aus, während einer Session START pausieren/fortsetzen, BACK beenden/speichern. Nach 25 Min. signalisiert Vibration das Pausenangebot; DOWN startet die 5-Minuten-Pause, UP beendet sie vorzeitig.
- Zum Koppeln im Auswahlbildschirm BACK drücken: Ziffernfolge aus Compass per UP/DOWN einstellen, START bestätigt eine Ziffer. Nach der 8. Ziffer wird die Kopplung übers gekoppelte Smartphone versucht. Dazu Garmin Connect / Connect-IQ-Verbindung und Internet am Samsung benötigen.
- Fertige Sessions werden beim Beenden automatisch übertragen, sobald Verbindung möglich; über BACK im Auswahlbildschirm kann man später manuell nachsynchronisieren. Auf der Watch geht die lokale Sessionliste nur nach bestätigtem Upload zurück.
- Bei Verlust der Uhr unter Compass → Aktivitäten → verbundene Uhr → `Trennen` den Token widerrufen.

**5. Android Homescreen-Widget separat bauen:**
- Android Studio installieren; Projektordner `android/CompassWidget` öffnen. Falls Android Studio nach Gradle-Version/SDK fragt, Android SDK 35 und einen kompatiblen Gradle-Wrapper installieren.
- `Build → Build APK(s)`; die Debug-APK auf dem Samsung installieren (idealerweise per USB über Android Studio). Danach Homescreen lange drücken → Widgets → `Compass Widget` → hinzufügen.
- Button `Heute öffnen` und `+ Erfassen` testen. Ersteres öffnet derzeit die Today-Oberfläche (Kalender noch ohne Google-Integration), letzteres die Capture-PWA.
- Der Android-Baustein ist **keine Ersatzinstallation der PWA**. Es ist eine separate Companion-App und bislang nur ein Starter-Widget.

## Datenschutz, Messqualität und Grenzen

- **Achtung Gesundheitsdaten:** In diesem Prototyp speichert D1 Herzfrequenz- und Body-Battery-Samples serverseitig **nicht Ende-zu-Ende-verschlüsselt**. Der Worker schützt Zugriffe mit angemeldeter Besitzeridentität bzw. gekoppelt beschränktem Watch-Token; eine vollständige Sicherheitsprüfung/Hardware-Abnahme steht aus. Bitte nur unkritische Testsessions einsetzen und keine Klienten-/Gesprächsgeheimnisse.
- Auf der Uhr liegt das individuelle Sync-Token im Connect-IQ-App-Speicher; bei Verlust die Kopplung widerrufen. Die lokale Garmin-Speicherung ist nicht identisch mit dem verschlüsselten Compass-Browser-Tresor.
- Sensorwerte sind geräte- und firmwareabhängig. Body-Battery-History kann leer sein. Dann wird `–` statt erfundener Zahlen angezeigt. Herzfrequenz und Body Battery sind keine direkten medizinischen Stressmessungen.
- Die Uhr benötigt zum Senden keine eigene SIM: Connect IQ verwendet üblicherweise das gekoppelte Samsung über Garmin Connect als Bluetooth/Internet-Brücke. **Ohne verfügbare Verbindung kein Upload**, aber lokale Zwischenspeicherung bis zur Kapazitätsgrenze.
- Garmin-Quellcode nicht auf einer echten Uhr oder im offiziellen Simulator getestet. Die Datenübertragung über die Connect-IQ-Brücke ist eine **zu verifizierende Integration**, keine bereits bestätigte Funktion. Insbesondere muss Garmin-MakeWebRequest inklusive `Authorization` Header, Anfragekodierung und UI-Lifecycle auf der fēnix 7S praktisch getestet werden.
- Die Android-Widget-Logik ist von Android-Studio-Build und Android-Geräteprüfung abhängig. Kein echter Calendar-/Today-Live-Feed.

## Automatisierte Tests

`npm test`: 18/18 bestanden (14 vorhandene Tests plus Konfliktreparatur, Validierung, Kopplung und idempotentes Session-Upload mit simulierter D1). `node --check` für Web/Worker; XML-Parsing für Garmin- und Android-Manifeste. **Nicht durch automatisierte Tests abgedeckt:** echter Garmin-Compile, Simulator, Bluetooth-Sync, Android-Gradle-Build, Browser-DOM-Endtest oder Produktions-Deployment.

## Offizielle Referenzen
- Garmin SDK: https://developer.garmin.com/connect-iq/sdk/
- Garmin Sideloading: https://developer.garmin.com/connect-iq/connect-iq-basics/your-first-app/
- Garmin Herzfrequenz: https://developer.garmin.com/connect-iq/api-docs/Toybox/Sensor.html
- Garmin Body Battery History: https://developer.garmin.com/connect-iq/api-docs/Toybox/SensorHistory.html
- Garmin Bluetooth/Internet Bridge: https://developer.garmin.com/connect-iq/api-docs/Toybox/Communications.html
- Android AppWidget: https://developer.android.com/develop/ui/views/appwidgets
