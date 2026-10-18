# Compass 0.5.10 – Insights Fitness & Fitdays Body Report

**Basis:** Compass 0.5.9 auf GitHub `main`. **Reines Web-/PWA-Update**. Keine D1-Migration, kein Worker-Deploy, keine neue Android-APK. Bestehender Worker (`apiVersion: 11`) unverändert.

## Neu

- **Insights → Aktivität** verbindet echte Garmin-Wellness-FIT-Monitoring-Zähler (`monitoring`, global 55) und vorhandene Health-Connect-Tagesdaten. Steps/Schritte aus Feld 3 nur für `activity_type=walking/running`, Distanz aus Feld 2 / 100.000 in km, Geh-/Laufzeit aus Feld 4 / 60.000 in Minuten. Die Werte eines Tages sind **kumulative Zählerstände**: Compass verwendet den höchsten gültigen Wert und summiert sie **nicht**. Für Schritte gilt pro Tag: Garmin, sofern vorhanden; sonst Health Connect. Die Werte aus beiden Quellen werden niemals addiert.
- **Trainings-FITs** mit `session`-Nachricht 18 werden optional eingelesen: Dauer, Distanz, Kalorien sowie Pulszusammenfassung, wenn vorhanden. Es werden ausdrücklich **keine GPS-Routen oder Rohpositionsfelder** importiert. Die Wellness-ZIPs können keine Session enthalten – dann bleibt der Sessions-Bereich leer.
- **Fitness-Diagramme**: Schritte, Geh-/Laufdistanz, Garmin-Monitoring-Aktivzeit, Health-Connect-Trainingsminuten und importierte Garmin-Trainingssessions. Zeitraum 7 Tage / 4 Wochen / 90 Tage / 1 Jahr / Alles, Wochenverdichtung in langen Zeiträumen, echte Zeitachse und sichtbare Lücken.
- **Insights → Körper**: Fitdays-Report mit zwei stilisierten Menschengrafiken für **segmentale Fettmasse und Muskelbalance**, fünf Körperregionen, Kilogramm und Fitdays-**Referenzprozente**. Die ältere Detailbalkenanzeige bleibt aufklappbar. Die Figur ist eine Illustration, keine medizinische Körpermessung.
- **Insights → Datenquellen** und der Importvorschau/Weekly Review zeigen neue Garmin-Aktivitätstage und Trainingssessions. Garmin-Daten werden ausschließlich im verschlüsselten lokalen Browser-Vault dieses Gerätes verarbeitet und gespeichert. Die bestehenden Health-Connect-Cloud-Tageswerte werden nicht verändert.

## Erneuter Sammelimport

Der bisherige Garmin-Importer 0.5.9 hat Schritte und Geh-/Laufdistanz noch **nicht** aus FIT-Monitoring gespeichert. Daher die bereits vorhandenen originalen Garmin-ZIP-Dateien für Juli bis Oktober unter **Insights → Datenquellen → Mehrere Exportdateien auswählen** gesammelt erneut auswählen, Vorschau prüfen und **Import übernehmen**. Erneutes Einlesen erzeugt keine zusätzlichen Tageszeilen oder Sessions; vorhandene Nächte, HRV und Stressdaten bleiben erhalten. Du brauchst nicht erneut bei Garmin herunterzuladen, sofern die ZIPs noch auf dem PC liegen.

- Hinweis: Manche einzelnen `WELLNESS.fit`-Dateien haben keine Schritte; dann kann bei Garmin eine andere Exportdatei oder Health Connect die Tageszählung liefern. Der vollständige Tagesexport erhöht die Abdeckung.
- `FIT monitoring active_time` ist **nicht** gleich Garmins offiziellen Intensitätsminuten. Garmin-Monitoring-Zählerstände können unvollständig sein. Individuelle Garmin-Aktivitäts-`.fit` Dateien sind für die Trainingseinheiten geeignet.
- Zeitzonen: Garmin-Wellness-Monitoring wird anhand der exportierten UTC-Zeitstempel einer UTC-Kalenderdate zugeordnet. Nächte/Reisen über Zeitzonengrenzen erfordern später gezielte lokale Zeitzonen-Zuordnung; die Werte werden nicht heimlich umdatiert.
- Fitdays muss **nicht** neu importiert werden: Die bestehenden segmentalen Daten genügen für die neue Körpergrafik.

## Installation

1. Im bestehenden Compass ein **verschlüsseltes Vault-Backup** erstellen.
2. `Compass_0.5.10_GITHUB_PATCH.zip` lokal entpacken und die enthaltenen Dateien mit **identischen relativen Ordnerpfaden** über die GitHub-Weboberfläche in `theophil-kroller/compass-life`, `main`, hochladen. ZIP **nicht** als einzelnes Dateiobjekt hochladen.
3. [GitHub Actions](https://github.com/theophil-kroller/compass-life/actions) → **Deploy Compass Web**: grünen Build prüfen. (Lokal konnte mangels installierter npm-Dependencies `vite` nicht ausgeführt werden.)
4. Compass-PWA aktualisieren und den vorhandenen Tresor entsperren. **Nicht** den Browsercache löschen oder die PWA deinstallieren.
5. Garmin-ZIPs erneut unter **Insights → Datenquellen** gesammelt importieren. Danach **Insights → Aktivität** ansehen und **Insights → Körper** mit den Fitdays-Segmenten prüfen.

Keine neue SQL-Migration, kein Cloudflare-Worker-Deploy, kein Android-APK-Update erforderlich.

## Prüfungen und Grenzen

- `node --test tests/*.test.mjs` → **135/135 bestanden**.
- Binary-Fixture-Test (Garmin FIT global 55) und Import-Regressionstests; reale Wellness-Datei vom 15. Oktober 2026 ergab **5.294 Schritte, 4,43 km Geh-/Laufdistanz, 93,5 Minuten Monitoring-Zeit**. Andere FIT-Dateien haben diese Felder teils nicht. Private Beispieldateien sind nicht Teil der Release-ZIPs.
- `node --check` für alle geänderten Module erfolgreich.
- Lokaler kompletter Vite-Build **nicht möglich**: `vite: not found`; GitHub Actions ist die nächste Buildbestätigung. Desktop-Screenshotversuch im Chromium dieser Laufzeit scheiterte an einer nicht erreichbaren Browserumgebung; die Layoutprüfung ist deshalb erst im echten GitHub-PWA-Build vollständig möglich.
- Körperfett, Muskelmasse und Fitdays-Referenzprozente sind Bioimpedanz-Schätzungen, keine Diagnosen. Regionale Referenzprozente sind **keine** regionalen Körperfettprozente.

## Danach geplant

Compass 0.5.11: Produktivität × Gesundheit (Pomodoros, Kalender, Schlaf und Energie). Danach Orte & Reisen sowie statistische Explorer und verschlüsselte Monats-/Jahresaggregate in der Cloud.
