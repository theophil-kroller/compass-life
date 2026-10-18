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
