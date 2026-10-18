# Compass Widget 0.5.0 (Android, Samsung)

**Native Homescreen-Widget Companion**; Compass selbst bleibt die PWA. Es enthält kein Google-Token, keine Aufgaben-Texte, keine Gesundheitsdaten und benötigt daher keine weitreichenden Berechtigungen.

## Was funktioniert
- Drei Schaltflächen: **Heute**, **+ Erfassen**, **Erholung**.
- `Heute` öffnet `?view=today`, `Erholung` öffnet `?view=recovery`, `Erfassen` öffnet `?capture=1`.
- Datum wird von Android lokal gesetzt.
- Die Schaltflächen öffnen die Compass-URL im Browser/der installierten PWA.
- Es zeigt noch **keine** echten Aufgaben- oder Terminzahlen und liest **keine** Health-Connect-Daten.

## APK ohne Android Studio bauen
1. Dateien im GitHub-Repo unter `android/CompassWidget/` pfadgleich ersetzen und `.github/workflows/build-android-widget.yml` mit hochladen.
2. Nach Commit auf GitHub > Actions > **Build Compass Android Widget** > `Run workflow` (oder auf automatischen Lauf warten).
3. Nach einem **grünen** Build auf der Run-Seite im Abschnitt **Artifacts** `Compass-Widget-0.5.0-debug-apk` herunterladen.
4. Entpacken, `app-debug.apk` auf dein Samsung übertragen und installieren. Die Installationsberechtigung nur für die vertraute APK-Quelle gewähren. Keine private Keystore-Datei hochladen.
5. Auf Samsung: Homescreen lange drücken > Widgets > Compass 0.5 > Widget platzieren.
6. Teste die drei Aktionen. Bei bestehendem Compass-Tresor kann das Öffnen ein Entsperren erfordern.

## Alternativ selbst bauen
Android Studio, Java 17, Android SDK 35, AGP 8.7.3. Projekt öffnen, Gradle synchronisieren, `Build APK(s)`.

## Datenschutz und Einschränkungen
Das Widget ist eine kleine native Android-Hülle, kein vollwertiger Offline-Sync. Keine Hintergrundaktualisierung von sensiblen Daten und keine Health Connect Berechtigungen im 0.5.0 Widget. Der native Sicherheits- und Datenzugriff wird in der Health-Connect-Ausbaustufe gesondert geprüft. Die GitHub Actions Debug-APK muss auf dem echten Samsung getestet werden; in dieser Umgebung gab es keinen Android SDK/Gradle-Build.


## Compass 0.5.1: Health Connect Companion (TEST)
Die Android-App ist jetzt zusätzlich zur Widget-Funktion eine eigenständige Oberfläche, die Schrittzahl,
Schlaf- und Trainingsminuten der letzten 7 Tage **nach ausdrücklicher Freigabe** aus Health Connect liest.
Daten werden nur durch Klick auf „Letzte 7 Tage synchronisieren“ übertragen. Eine verschlüsselte
Gerätekennung liegt im Android Keystore, nur ihr Hash in D1. Die Rohdaten bleiben im Health Connect;
in D1 werden nur Tageszusammenfassungen gespeichert (nicht Ende-zu-Ende-verschlüsselt).

### Android nach GitHub-Actions-Build installieren
* In GitHub Actions `Build Compass Android Widget` erfolgreichen Lauf öffnen, unter Artifacts Debug-APK ZIP herunterladen, entpacken und auf Samsung `app-debug.apk` installieren.
* ACHTUNG: GitHub signiert Debug-APKs mit je nach Runner neuem Debug-Schlüssel. Bei `APP_NOT_INSTALLED` / Signaturkonflikt **nur die alte Companion-App deinstallieren** (Widget verschwindet, ggf. später neu hinzufügen), die PWA/die Compass-Vault-Daten **nicht** löschen. Langfristig festen Signierschlüssel verwenden.
* In Garmin Connect nachsehen, ob die gewünschten Messwerte in Health Connect zugelassen sind. Nicht alle Garmin-Messwerte werden übermittelt; Body Battery ist kein Standard-Health-Connect-Wert.
* Compass-PWA → Erholung → `Gesundheits-Kopplungscode erzeugen`. Auf Samsung Companion-App öffnen, Health Connect freigeben, achtstelligen Code eingeben, verbinden, Daten synchronisieren. In Compass → Erholung auf `Daten aktualisieren` klicken.
* Code 10 Minuten gültig, niemals öffentlich teilen. Zugriff in der PWA widerrufen; gespeicherte Cloud-Tageswerte dort gesondert löschen.
* Voraussetzungen: Health Connect verfügbar (Android 14 integriert, darunter ggf. separate Health-Connect-App); Garmin Connect muss die Daten in Health Connect exportieren. Der Build auf realem Android wurde hier **nicht** getestet.


## 0.5.4 – Zwei Widgets und optionale Health-Automatik

Nach Worker-Deploy API 10 zeigt **Compass Fokus** nächste geplante Aufgaben sowie Waiting For – keine Gesundheitsdaten. Nur wenn im Companion "Aufgabentitel anzeigen" ausdrücklich aktiviert wurde, sind Titel sichtbar. **Compass Entdecken** ist ein zweites, unabhängiges Widget mit bis zu drei Vorschauen aus den kommenden sieben Tagen; gespeicherte Events stehen oben. Beide verwenden denselben widerrufbaren Leseschlüssel und benötigen keine erneute Google-Anmeldung.

Die Gesundheitsautomatik wird im Companion unter "Täglichen Abgleich aktivieren" eingerichtet. Sie benötigt eine zusätzliche Health-Connect-Berechtigung für Hintergrund-Lesezugriff und einen unterstützten Health-Connect-Stand. WorkManager läuft etwa alle 24 Stunden bei Internetverbindung; Ausführungszeitpunkt kann durch Android verschoben werden. Abschalten beendet den Hintergrundauftrag; manuelle Synchronisation bleibt möglich.
