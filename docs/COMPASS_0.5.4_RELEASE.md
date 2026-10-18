# Compass 0.5.4 – Focus, Entdecken und automatische Health-Synchronisation

**Stand 18.10.2026 · Quellcodebuild (Beta).** `npm run check` erfolgreich: **92/92 Tests** und Worker-JavaScript-Syntaxprüfungen. Die Android-APK muss noch in GitHub Actions kompiliert und auf einem Samsung getestet werden. Web-Build benötigt installierte npm/Vite-Abhängigkeiten und wird in GitHub Actions geprüft.

## Was wurde implementiert?

1. **Compass Fokus Widget:** neues, ruhiges Android-Layout, prominent die nächste geplante Action (Titel nur nach ausdrücklicher Freigabe), heutige Aufgaben, Waiting For, weitere Action und Schnellerfassung. Keine Schlaf- oder Gesundheitsanzeige mehr. Das Widget aktualisiert sich über den bestehenden, widerrufbaren Leseschlüssel (`cw1_`), ohne Browser-Tresor-Zugriff.
2. **Compass Entdecken Widget:** zweites, eigenständiges Android-Homescreen-Widget. Nutzt dieselbe optionale Geräte-Kopplung und zeigt nur die kommenden sieben Tage aus den in **Compass 0.5.3 synchronisierten** Events. Gespeicherte Events zuerst, ausgeblendete/gelöschte nicht. Maximal drei Vorschauzeilen, Klick öffnet den Entdecken-Bereich. Kein eigener Android-Kalender und keine unbestätigten Live-Events.
3. **Optionale tägliche Health Connect-Synchronisation:** Im Android Companion aktivierbar/deaktivierbar; zusätzliche Hintergrund-Leseberechtigung wird abgefragt, nur falls das Gerät den Health-Connect-Hintergrundzugriff unterstützt. WorkManager plant einen Lauf pro 24 Stunden bei Internetverbindung und sendet maximal sieben Tage aggregierter Messwerte. Android kann den Zeitpunkt aus Akku- und Energiespargründen verschieben. Manuelle Synchronisation funktioniert weiterhin. Fehlende Messwerte bleiben fehlend. Es werden keine neuen Gesundheitsparameter freigeschaltet.
4. **Projekte:** CSS-Breakpoint repariert; ab breiten Desktop-Ansichten Projektbaum links, Aufgaben mittig, Inspector rechts. Im Fokusmodus bleibt der Inspector rechts. Schmale Bildschirme passen sich weiterhin an.
5. **Worker API:** `/api/widget/summary` um `waitingFor` und `nextActions` erweitert und `/api/widget/events?day=YYYY-MM-DD` als getrennter, nur mit widerrufbarem `cw1_`-Token abrufbarer Sieben-Tage-Endpunkt hinzugefügt. `apiVersion:10`, `release:"0.5.4"`.

## Installation

1. **Verschlüsseltes Compass-Backup** erstellen und sicher aufbewahren; weder Browserdaten noch die PWA löschen.
2. Die Dateien aus dem **GITHUB_PATCH** ZIP mit Pfaden in GitHub `theophil-kroller/compass-life` auf `main` hochladen. Achtung auf `.github/workflows` mit Punkt.
3. In GitHub Actions müssen **Deploy Compass Web** und **Build Compass Android Widget** grün werden. Der neue Android-Workflow veröffentlicht Artifact `Compass-Widgets-0.5.4-debug-apk` (Datei `app-debug.apk` im Artifact-ZIP).
4. Den Cloudflare Worker aus dem aktualisierten Repository separat deployen (`npm run deploy:api` mit Wrangler). Prüfen: `https://compass-api.theophil-tiger.workers.dev/api/health` → `apiVersion:10`, `release:"0.5.4"`, `schema.ready:true`.
5. **KEINE D1-SQL-Migration erforderlich** (setzt die bereits ausgeführte Migration `0011_discovery_events.sql` aus 0.5.3 voraus). Das Event-Widget funktioniert erst, wenn die synchronisierten Events aus 0.5.3 in D1 stehen.
6. Android-APK aus erfolgreichem Build auf dem Samsung installieren. Je nach früherer Debug-Signatur kann Android eine Aktualisierung ablehnen. Gegebenenfalls **nur die Compass-Companion-App** deinstallieren und neue APK installieren; dabei gehen deren lokale Geräte-Tokens und Einstellungen verloren und müssen neu gekoppelt werden. **PWA/Tresor niemals dafür löschen.**
7. Homescreen lange antippen → Widgets → Compass Companion: **Compass Fokus** und **Compass Entdecken** unabhängig hinzufügen. Falls die alte Widget-Größe das neue Layout abschneidet, Widget entfernen und erneut hinzufügen bzw. passend vergrößern. Einmalig den bestehenden Widget-Code verwenden, sofern Companion nicht bereits gekoppelt ist.
8. Im Companion freiwillig **„Täglichen Abgleich aktivieren“** wählen und die zusätzliche Health-Connect-Berechtigung erlauben. Wenn der Hintergrund-Lesezugriff nicht unterstützt wird, bleibt die manuelle Synchronisation möglich. Letzten erfolgreichen Lauf und Status im Companion prüfen. Deaktivieren jederzeit über **„Automatischen Abgleich ausschalten“**.

## Grenzen und Datenschutz

- Die native Android-App benötigt einen separat widerrufbaren Schlüssel und ist kein Browser-Tresor. Widget-Titel sind standardmäßig verborgen; im Companion explizit freigeben. Persönliche Titel werden in diesem Fall auf dem Homescreen sichtbar (ggf. Sperrbildschirm-Vorschau beachten).
- Das Event-Widget zeigt nur **bereits synchronisierte** Events. Keine automatisierte Veranstaltungsrecherche, Bilder oder tatsächliche Ticket-Verfügbarkeiten.
- Google-Kalendertermine werden nicht in Widget-Vorschauen aufgenommen: Kalender-OAuth bleibt browserlokal.
- Die Health-Automatik funktioniert nur bei vorhandenem Health-Connect-Hintergrundzugriff und entsprechender Berechtigung. Häufigkeit ungefähr täglich, nicht sekundengenau; bei deaktiviertem Hintergrundzugriff keine unbemerkten Uploads.
- Die Compiler- und Geräteprüfung stehen aus. Die GitHub-Actions-Buildlogs sind maßgeblich. Nach einem roten Android-Build das dortige Fehlerprotokoll prüfen, nicht D1-Migration oder Cloud-Deploy wiederholen.
