# Compass 0.5.6 · Gesundheitsreports & stabilere Widgets

**Basis:** Compass 0.5.5 auf `main`. Geändert: Compass-Webclient, Android-Companion und zwei Android-Widgets. Worker-API bleibt bei **11 / 0.5.5**; Migration **0012_weekly_review.sql** aus 0.5.5 muss bereits vorhanden sein. **Keine neue SQL-Migration und kein neuer Worker-Deploy für 0.5.6.**

## Installation (GitHub Web UI)

1. **Backup** des lokalen verschlüsselten Compass-Tresors anlegen (Einstellungen → verschlüsseltes Backup). APK-/PWA-Deinstallationen und Browserdaten-Löschungen vermeiden; beide Apps haben unterschiedliche lokale Speicher.
2. `Compass_0.5.6_GITHUB_PATCH.zip` **lokal entpacken** und die enthaltenen Dateien mit unveränderten Verzeichnispfaden nach `theophil-kroller/compass-life` / `main` hochladen. **Nicht** die ZIP selbst als Repo-Datei hochladen.
3. Unter GitHub **Actions** den Erfolg von `Deploy Compass Web` und `Build Compass Android Widget` kontrollieren. Der Android-Workflow muss ein neues Debug-APK-Artifact `Compass-Widgets-0.5.6-debug-apk` erzeugen. Wenn der Build fehlschlägt, Logs aus Actions übermitteln; ein grüner Web-Build beweist keinen grünen Android-Build.
4. Den Browser/PWA normal neu öffnen oder neu laden (keine Daten löschen). Im Compass-Menü **Gesundheit** öffnen.
5. Den Widget-APK-Build aus **Actions → Build Compass Android Widget → Artifacts** herunterladen und auf Samsung über die alte Companion-Installation aktualisieren. **PWA nicht deinstallieren**. Beide Widgets erneut auf dem Homescreen platzieren. Falls Android erneut **„Couldn't add widget“** meldet, Samsung-Launcher/Home-Screen-Raster, Android-Version und die betroffene Widget-Größe nennen; wir brauchen dann einen echten Gerätelog (`adb logcat`) zur Ursachenbestimmung. Ein erfolgreicher Unit-Test garantiert keine Samsung-Launcher-Kompatibilität.
6. Die Android-Companion-App zeigt zunächst nur `Widget verbinden` und `Gesundheit einrichten`. Für das Widget in Compass → Gesundheit einen Kopplungscode erzeugen, im Companion einmalig eingeben. Native Widget-Zugänge sind getrennt vom verschlüsselten PWA-Tresor.

## Gesundheitsimport

- Unter **Gesundheit → Dateien auswählen** mehrere Garmin-Tages-ZIPs, FIT-Dateien, Garmin-`sleepData.json` oder Fitdays-Dateien auswählen. Der Fitdays-Export mit Dateiendung `.csv`, der tatsächlich ein XLS ist, wird automatisch erkannt.
- Vorschau mit erkannten Messungen und eventuellen Fehlern prüfen und `Import übernehmen` wählen. Wiederholtes Einlesen entfernt keine früheren Werte; echte Duplikate werden zusammengeführt. Bei gleichen Zeitstempeln mit abweichenden Körpermesswerten bleiben separate Datensätze erhalten.
- **Auswertungen:** Garmin-Schlafphasen mit tatsächlichen Anfangs-/Endzeiten, Tief-/Leicht-/REM-/Wachzeit, HRV-Trend; Fitdays-Gewicht/Körperfett, Körperzusammensetzung und regionale Fett-/Muskelwerte mit Referenzprozenten. Zeiträume 30 / 90 / 365 Tage / gesamter Verlauf. Kein Schätzen fehlender Schlafphasen aus bloßen Schlafsummen.
- Der abschließende Schritt des **Guided Weekly Review** bietet den optionalen Sammelimport ebenfalls direkt im Review an und nennt mögliche nachzutragende Garmin-Tage; dieser Schritt blockiert den GTD-Review nicht.
- **Datenschutz:** Garmin- und Fitdays-Importwerte werden **nur im lokalen AES-GCM-verschlüsselten Vault auf diesem Gerät** gespeichert. Keine automatische D1-/Geräte-Synchronisation dieser detaillierten Daten. Die bereits bestehende Health-Connect-Tageswerte-Synchronisation bleibt davon unabhängig bestehen. Vor einem Gerätewechsel unbedingt ein **verschlüsseltes Vault-Backup** erstellen und die Datenübernahme bewusst planen.
- Größere Exporte: maximal **120 MB je Quelldatei**, bis zu **75 Dateien je Auswahl**; bei sehr großen Garmin-Gesamtexporten aus Datenschutz-/Speichergründen nur die Wellness-`sleepData.json` und passende FIT-Dateien extrahieren oder die Archive in Portionen einlesen. Alle Dateien in einem Batch gelten als lokale Verarbeitung, kein Upload auf einen Server.
- Einzelne FIT-Dateien ohne Schlaf- oder HRV-Datensätze liefern keine zusätzlichen Reports. 17. Oktober enthält HRV-Daten, während der bereitgestellte 15.-Oktober-Export auch Schlafstufen enthält. Wenn eine Quelle nur Schlafsummen bereitstellt, zeichnet Compass keine frei erfundene Stadien-Zeitachse.

## Native Widgets

- **Fokus:** Aufgaben für heute, Next Action, Waiting For. Keine Gesundheitszahlen auf dem Homescreen. Titel weiterhin nur nach Opt-in.
- **Entdecken:** kommende sieben Tage, Merkliste priorisiert.
- Beide Homescreen-Layouts sind verkleinert (4×3 als Ziel) und verwenden einfache, RemoteViews-kompatible Text- und Container-Views. Debug-APK ist nötig; die endgültige Kompatibilität muss auf dem realen Samsung geprüft werden.
- Der Companion reduziert die Ersteinrichtung auf zwei Hauptaktionen. Optionale Datenschutzeinstellungen und Browserwahl sind separat.

## Tests und bekannte Grenzen

- `node --test tests/*.test.mjs`: **104 bestanden**, FIT- und XLS-Eingangsformate nach realen Datei-Spezifikationen und synthetischen Fixtures getestet; Android-XML wohlgeformt. Kein realer Android-SDK-Build oder Vite-Build in der isolierten Arbeitsumgebung möglich, da lokale npm-Abhängigkeiten/Android-SDK hier fehlen.
- Der `xlsx`-Decoder wird erst beim Einlesen gestartet; die tatsächliche `.xls`-Browser-Verarbeitung und das Entpacken per `fflate` werden mit dem GitHub-Webbuild und einem echten Import endgültig überprüft.
- Fitdays-Bioimpedanzwerte und Garmin-Schlafstadien sind Schätzwerte von Verbrauchergeräten, keine medizinischen Diagnosen.
