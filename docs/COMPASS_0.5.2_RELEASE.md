# Compass 0.5.2 – Gesundheit, Event Discovery, Android Widget

**18. Oktober 2026 · Quellcode-Build.** Node.js-Checks und 83 automatische Tests erfolgreich. Web-Produktionsbuild und Android-APK-Compilerlauf sind lokal nicht durchgeführt; GitHub Actions müssen beide erfolgreich durchlaufen.

## 1. Gesundheitsansicht

- Drei kompakte Karten für Schritte, Schlaf und Trainingsminuten: 7-/30-Tage-Auswahl, Balkenverlauf und Durchschnitt **pro erfasstem Tag**.
- Fehlende Messungen werden als fehlend angezeigt (nicht mit Null gleichgesetzt). Keine scheinpräzise Diagnose oder ein pauschaler Erholungs-Score.
- Tageswerte und Einstellungen separat einklappbar. Health-Connect-Kopplung, Widerruf und Löschen der Daten bleiben erreichbar.

## 2. Veranstaltungen – „Entdecken“

- Tagesgruppierung, höchstens drei Einträge pro Tag zunächst sichtbar, „weitere anzeigen“.
- Merkliste (Herz) und Ausblenden getrennt vom Löschen; Filter Zeitraum, Stadt, Kategorie und Region (Graz/Umgebung, Wien, Österreich, Europa).
- Eigene Kategorie-Icons und Farben für Kabarett/Stand-up, Oper, Theater, Fußball/Sport, Zouk, Kizomba, Bachata, Tanz und Bujinkan. Diese Kategorien sind von den klassischen Kultur-/Kino-/Festivalkategorien getrennt.
- Optionales `description` (bis 420 Zeichen), `country` (Land), `imageUrl` (direkte HTTPS-Bildquelle) im JSON. Bei fehlenden Fotos erscheint die farbige Kategorie-Illustration. **Die 50 bereits importierten Ereignisse erhalten keine automatisch erfundenen Bilder oder Beschreibungen.** Neuer Import ergänzt künftig Quellbilder.
- Typische KI-Ausgabeprobleme wie ```json-Zäune und versehentlich maskierte URLs werden abgefangen; Fehler nennen die betroffene Nummer.
- Rechercheprompt erweitert auf **Kabarett**, Tanzveranstaltungen (Conny/Dado, Zouk, Kizomba, Bachata, Workshops/Socials, Österreich/Polen/Tschechien) und **Bujinkan-Seminare/-Camps mit internationalen/japanischen Gastlehrern**. Es handelt sich um einen manuellen Recherche- und JSON-Import, **keinen Live-Kalender**. Termindaten und Bildrechte vor Import prüfen.
- Importdaten, Merkliste und Ausblendungen bleiben zurzeit im verschlüsselten lokalen Browser-Tresor, nicht in Cloud D1 synchronisiert.

## 3. Android Widget

- Kompakte Startbildschirmvorschau: Anzahl offener Next Actions für heute, nächste geplante Aufgabe, Durchschnitt Schlafdauer, Schnellaktionen Heute/Erfassen/Erholung, Aktualisieren.
- Standardmäßig **ohne Aufgabentitel**. Die Anzeige von Titeln ist bewusst separat im Android-Companion aktivierbar; Vorsicht bei sichtbaren Homescreens.
- Separater, widerrufbarer Lesezugang `cw1_...`, im Android Keystore geschützt; auf dem Server liegt nur der Hash. Kein Zugriff auf Tresor oder Google-Kalender über das Widget. Widget-Vorschau wird direkt aus bereits synchronisierten `planning_tasks` und `health_daily` berechnet.
- Für Widget-Klicks wird eine Ziel-App-Auswahl angeboten. Ob die installierte PWA als Android-Ziel auswählbar ist, hängt vom Browser und Samsung-Setup ab; das vermeidet nicht zwingend eine browsergetrennte Tresor-Umgebung.
- **Kein direkter Google-Kalendertermin** im Widget: Google Calendar OAuth wird bisher nur in der PWA gehalten. „Nächster Schritt“ meint die nächste geplante Aufgabe.

## Einspielung (unbedingt diese Reihenfolge)

1. **Vorhandene Compass-Daten sichern**, bevor du Updates machst: unter System & Sync den verschlüsselten Tresor exportieren. Keine Browserdaten löschen, keine PWA deinstallieren.
2. In **Cloudflare D1 → compass-db → Console** genau die neue, additive Migration `worker/migrations/0010_widget_preview.sql` ausführen. Sie enthält nur `CREATE TABLE IF NOT EXISTS` und `CREATE INDEX IF NOT EXISTS`. Bitte keine alten Migrationen blind erneut ausführen.
3. Die Dateien aus `Compass_0.5.2_GITHUB_PATCH.zip` **mit derselben Verzeichnisstruktur** in das Repo `theophil-kroller/compass-life` hochladen und committen.
4. Bei GitHub Actions **Deploy Compass Web** und **Build Compass Android Widget** prüfen. Insbesondere der Android-Build wurde hier nicht kompiliert; potenzielle Compilerfehler werden in Actions sichtbar. Bei Fehlern die Logs prüfen, nicht sofort Datenbank oder Browser zurücksetzen.
5. Den Worker aus dem aktualisierten lokalen Repo **separat** per Wrangler deployen: `npm run deploy:api`. GitHub Pages aktualisiert den Cloudflare Worker nicht. `/api/health` soll danach `apiVersion:8`, `release:"0.5.2"`, `schema.ready:true` zeigen. Erst wenn diese Prüfung erfolgreich ist, das Android-Widget koppeln.
6. Neue APK aus dem erfolgreichen Android-Workflow unter `Artifacts → Compass-Widget-0.5.2-debug-apk` herunterladen/installieren. Falls sich die APK wegen einer wechselnden Debug-Signatur nicht installieren lässt: nur die native *Compass Widget*-App deinstallieren, **nicht** die PWA, und erst danach die neue APK installieren. Die Health-Connect- und Widget-Geräteverbindung müssen danach ggf. neu gekoppelt werden.
7. In der **Compass-PWA → Erholung → Gesundheit** `Widget-Kopplungscode erzeugen`, im **nativen Compass Widget / Gesundheitsdaten-Companion** `Widget mit Compass verbinden` und `Widget jetzt aktualisieren`. Für Aufgabentitel im Companion ausdrücklich `Aufgabentitel im Widget ANZEIGEN` aktivieren.
8. Widget „Heute“, „Erfassen“ und „Erholung“ testen. Bei „Lokalen Tresor einrichten“ im Companion `Widget-Ziel-App auswählen` und ggf. den Browser nutzen, in dem Compass bereits eingerichtet wurde. Keinen bisherigen Browser-Tresor löschen.

## Datenschutz / Grenzen

Die Gerätetokens gewähren im Gegensatz zur PWA-Sitzung keine Schreibrechte. Cloud Health-Daten und Aufgaben-Vorschau sind weiterhin zugriffsgeschützt, aber nicht Ende-zu-Ende-verschlüsselt. Veranstaltungen benötigen quellenbasierte Angaben. Ein direkter Google-Kalender-Feed fürs Widget sowie automatische Event-Recherche gehören nicht zu diesem Build.
